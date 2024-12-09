# YouTube Comments & Song Search Backend

## Overview

This project provides a scalable and fault-tolerant backend architecture that enables users to extract and search for songs mentioned in YouTube comments, either from a single video or an entire channel. The application is integrated with Spotify's song search for music discovery.


## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Components](#components)
  - [1. Job Queue, Tracking, and Processing](#1-job-queue-tracking-and-processing)
  - [2. Song Searching Algorithm](#2-song-searching-algorithm)
- [Data Models](#data-models)
  - [DynamoDB Table Structure](#dynamodb-table-structure)
  - [S3 Folder Structure](#s3-folder-structure)
- [AWS Services Used](#aws-services-used)
- [Scalability and Fault Tolerance](#scalability-and-fault-tolerance)
- [Error Handling and Idempotency](#error-handling-and-idempotency)
- [Caching Strategy](#caching-strategy)


## Features

- **Scalable Backend Architecture**: Designed to handle a high volume of requests with AWS serverless components.
- **Efficient Job Queue System**: Manages job states and processing using DynamoDB and SQS queues.
- **Loose Coupling of Components**: Achieved through the use of queues and microservices architecture.
- **Song Extraction**: Implements algorithm to accurately extract song names from YouTube comments.
- **Integration with Spotify API**: Enables users to search and retrieve song details directly from Spotify.

## Architecture Overview

The backend architecture is in AWS. The following is a rough archtecture diagram:

<!-- ![alt text]("https://github.com/ClayNdugga/youtube-comments/tree/main/public/images/placeholderAvatar.png?raw=true") -->

  <img src="https://github.com/ClayNdugga/youtube-comments/blob/main/public/images/YTC%20architecture.png?raw=true">


- **Amazon API Gateway**: Acts as the entry point for all API requests, handling load balancing and routing to the appropriate services.
- **AWS Lambda Functions**: Stateless functions that perform various tasks such as processing jobs, fetching comments, and running the song searching algorithm.
- **Amazon SQS Queues**: Decouple the system's components by queuing tasks for channels and videos.
- **Amazon DynamoDB**: Serves as the central store for tracking job states and ensuring idempotency.
- **Amazon S3**: Stores raw comments and processed song data organized systematically.
- **Spotify API**: Used for searching and fetching song details based on extracted song names.

## Processing Workflow

1. **Job Submission**:
   - When a user requests song extraction for a channel or video, the API Gateway invokes a Lambda function that checks the DynamoDB table for existing jobs.
   - If no existing job is found, the metadata of the video or channel Id in S3 is checked for recency.
   - If the cache is outdated a new job entry is created in DynamoDB, and the channel or video ID is placed into the appropriate SQS queue.

2. **Channel Processing**:
   - A Lambda function retrieves channel IDs from the Channel Queue.
   - It fetches all video IDs associated with the channel and places them into the Video Queue.
   - Updates the job status in DynamoDB to reflect progress.

3. **Video Processing**:
   - Another Lambda function processes video IDs from the Video Queue.
   - Fetches all comments for each video using the YouTube Data API.
   - Stores raw comments in Amazon S3 under the corresponding channel and video folders.

4. **Song Extraction**:
   - A dedicated Lambda function runs the song searching algorithm on the comments.
   - Extracted song names are processed to identify duplicates and similarities.
   - Stores the list of unique songs back into Amazon S3.

5. **Job Completion**:
   - Updates the job status in DynamoDB to "complete" once processing is finished.
   - The client "long polls" the backend uses the updated status to retrieve the results

## Components

### 1. Job Queue, Tracking, and Processing

The backend employs a job queue system to manage and process requests efficiently. This system ensures scalability and fault tolerance through loose coupling and distributed processing.

#### API Gateway

- **Load Balancing and Routing**: The API Gateway receives incoming requests and routes them to the appropriate Lambda functions. It also handles load balancing to manage traffic spikes efficiently.

#### Queues for Loose Coupling

- **Channel Queue**: Stores channel IDs for processing. Ensures that the retrieval of video IDs for each channel is handled asynchronously.
- **Video Queue**: Holds video IDs to process comments for each video. This decoupling allows for parallel processing of multiple videos.

#### Lambda Functions

Lambda functions are the backbone of the processing pipeline:

- **Concurrency and Scaling**: Lambda functions can scale horizontally to match the workload, with multiple concurrent invocations handling tasks from the queues.
- **Idempotency**: Designed to be idempotent, ensuring that repeated invocations (due to retries or failures) do not lead to inconsistent states or duplicate processing.



#### Job State Management with DynamoDB

To efficiently manage jobs and prevent redundant processing, we use a DynamoDB table to track job states.

##### DynamoDB Table Entry Structure

```typescript
interface TableEntry {
  jobId: string;               
  type: "channel" | "video";   
  channelId: string;           
  videoId: string | string[];  
  status: "queued" | "complete";
  parentJobId?: string | null; 
  parentJobType?: "channel" | "video" | null;
  createdAt: string;           
}
```

##### Sample DynamoDB Table

| jobId    | type    | channelId | videoId    | status      | parentJobId | parentJobType | createdAt             |
|----------|---------|-----------|------------|-------------|-------------|---------------|-----------------------|
| jobC123  | channel | chan1     | []         | complete    | null        | null          | 2024-11-11T12:00:00Z  |
| jobV456  | video   | chan1     | vidA       | complete    | jobC123     | channel       | 2024-11-11T12:01:00Z  |
| jobV789  | video   | chan1     | vidB       |  queued     | jobC123     | channel       | 2024-11-11T12:02:00Z  |
| jobV101  | video   | chan1     | vidB       |  queued     | jobV789     | video         | 2024-11-11T12:03:00Z  |

##### Job Deduplication Logic

- **Preventing Redundant Jobs**: Before queuing a new job, the system checks DynamoDB for existing jobs with the same `channelId` or `videoId`.
- **Job Hierarchy**: Uses `parentJobId` and `parentJobType` to link related jobs, ensuring that processing for a channel or video isn't duplicated.
- **Concurrent Requests Handling**:
  - If a job is already in progress, the new request references the existing job.
  - This approach maintains consistency and optimizes resource usage.

#### Example Scenario

Suppose **User A** requests all songs from **Channel 1**, and **User B** requests songs from **Video X** of **Channel 1** shortly after.

- **Channel Job Creation**:
  - A new job (`jobC123`) is created for **Channel 1**, and its status is set to "queued".
- **Video Job Deduplication**:
  - When processing **Channel 1**, video IDs including **Video X** are added to the Video Queue.
  - **User B's** request for **Video X** checks DynamoDB and finds that the video is already scheduled for processing.
  - The system links **User B's** request to the existing video job (`jobV456`), avoiding redundant processing.

### 2. Song Searching Algorithm

Extracting song names from comments requires handling `variations` and `duplicates` effectively. The goal was to design an algorithm that focuses on identifying and grouping similar song mentions accurately.



#### Solution Overview

- **Normalization**: Preprocess comments to standardize formats (e.g., converting to lowercase, removing special characters).
- **Q-Gram Analysis**: Break down strings into a set of character n-grams (substrings of length *q*).
- **Similarity Measurement**: Use the Jaccard similarity coefficient to compare sets of q-grams.
- **Grouping Algorithm**: Cluster similar strings based on a similarity threshold.

#### Q-Grams 

- **Definition**: A q-gram is a substring of length *q* extracted from a string.
- **Example**: Using `q = 2` the comment 
    - `song1 - artist1` maps to `{'so', 'on', 'ng', 'g1', '1 ', ' -', '- ', ' a', 'ar', 'rt', 'ti', 'is', 'st', 't1', '1'}`
    - `its song1 by artist1` maps to `{'it', 'ts', 's ', ' s', 'so', 'on', 'ng', 'g1', '1 ', ' b', 'by', 'y ', ' a', 'ar', 'rt', 'ti', 'is', 'st', 't1', '1'}`


#### Jaccard Similarity

To identify similiar songs q-grams are compared using the Jaccard similiatiy $J$, which is the intersection over union (IoU) between two sets.

$$
  J(A, B) = \frac{|A \cap B|}{|A \cup B|}
$$ 
  where A and B are sets of q-grams.
The function can take values over the range $[0,1]$, the closer the value to $1$ the more similiar to the songs. 

#### Grouping Algorithm Implementation

```python
def group_similar_songs(song_strings: List[str], threshold=0.9) -> (List[str], List[List[str]]):
    """
    Group similar songs efficiently by precomputing normalized strings and Q-grams.
    """
    # Precompute normalized strings and Q-grams for all songs
    song_qgrams = []
    for song in song_strings:
        grams = normalize_and_create_qgrams(song)
        song_qgrams.append((song, grams))
  
    groups = []  # Holds groups of similar songs
    representatives_qgrams = []  # Q-grams of group representatives
  
    for song, grams in song_qgrams:
        best_match_index = None
        best_similarity = threshold  
  
        for i, rep_grams in enumerate(representatives_qgrams):
            similarity = jaccard_similarity(grams, rep_grams)
            if similarity > best_similarity:  
                best_similarity = similarity
                best_match_index = i
  
        if best_match_index is not None:
            groups[best_match_index].append(song)
        else:
            groups.append([song])
            representatives_qgrams.append(grams)
  
    # Sort groups and select a representative song from each
    groups.sort(key=len, reverse=True)
    representative_songs = [select_representative(group) for group in groups]
    return representative_songs, groups

```

The algorithm groups all songs that are identified as similiar (under the specified threshold), and chooses a representative for each. The return value is list of all the unique songs within the comments.

#### Benefits

- **Efficiency**: By precomputing q-grams and using a single pass through the data, the algorithm operates in $O(n)$ time 
- **Accuracy**: Groups together songs with high similarity, reducing duplicates sent to the Spotify API.
- **Scalability**: Suitable for scaling with increased data due to low time complexity.


## Data Models

### DynamoDB Table Structure

Used for tracking job states and relationships between jobs.

- **Partition Key**: `jobId`
- **Attributes**:
  - `type`: "channel" or "video"
  - `channelId`: YouTube channel ID
  - `videoId`: Single or list of YouTube video IDs
  - `status`: "queued", "in_progress", or "complete"
  - `parentJobId`: References the parent job if applicable
  - `parentJobType`: Type of the parent job
  - `createdAt`: Timestamp of job creation

### S3 Folder Structure

Organizes stored data systematically for easy retrieval and management.

```
s3://bucket-name/
├── channel1/
│   ├── video1/
│   │   ├── comments.csv         # Raw comments from YouTube
│   │   └── unique_songs.csv     # Processed unique song names
│   ├── video2/
│   │   ├── comments.csv
│   │   └── unique_songs.csv
│   └── unique_songs.csv         # Aggregated songs for the channel
├── channel2/
│   └── ...
└── channel3/
    └── ...
```


## AWS Services Used

- **Amazon API Gateway**: Handles API requests, Load Balancing, Authentication, and routes API requests to Lambda functions.
- **AWS Lambda**: Executes code in response to events without provisioning servers.
- **Amazon SQS (Simple Queue Service)**: Manages message queues for channels and videos for loose coupling.
- **Amazon DynamoDB**: NoSQL database for tracking job states and ensuring lambda function idempotency.
- **Amazon S3 (Simple Storage Service)**: Stores raw comments and processed data.
- **AWS CloudWatch**: Monitors logs and system metrics.
- **Amazon IAM**: Manages access control and permissions.
- **Spotify API**: External service used for song searches and data retrieval.
- **YouTube Data API**: Fetches video and comment data from YouTube.


## Error Handling and Idempotency

- **Idempotent Lambda Functions**: Functions can be safely retried without causing inconsistent states.
- **Dead-Letter Queues**: Messages that can't be processed after retries are moved to a dead-letter queue for manual investigation.
- **Logging and Monitoring**: CloudWatch collects logs for debugging and performance monitoring.

## Caching Strategy

- **Result Caching**: Stores processed results in S3 and checks for existing data before processing new requests.
- **Cache Invalidation**: Implements policies to invalidate cached data after a certain period to ensure data freshness.
- **Edge Caching**: Uses AWS CloudFront to cache API responses at edge locations for faster delivery.

