# YouTube Comments & Song Search Backend

## Overview

This project provides a scalable and fault-tolerant backend architecture that enables users to extract and search for songs mentioned in YouTube comments, either from a single video or an entire channel. The application is integrated with Spotify's song search for music discovery.


## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Components](#components)
  - [1. Job Queue, Tracking, and Processing](#1-job-queue-tracking-and-processing)
  - [2. Song Searching Algorithm](#2-song-searching-algorithm)
- [Data Flow](#data-flow)
- [Data Models](#data-models)
  - [DynamoDB Table Structure](#dynamodb-table-structure)
  - [S3 Folder Structure](#s3-folder-structure)
- [AWS Services Used](#aws-services-used)
- [Scalability and Fault Tolerance](#scalability-and-fault-tolerance)
- [Error Handling and Idempotency](#error-handling-and-idempotency)
- [Caching Strategy](#caching-strategy)
- [Security Considerations](#security-considerations)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [Future Improvements](#future-improvements)
- [License](#license)

## Features

- **Scalable Backend Architecture**: Designed to handle a high volume of requests with AWS serverless components.
- **Fault Tolerance**: Utilizes AWS services to ensure reliable job processing and data retrieval.
- **Song Extraction**: Implements algorithm to accurately extract song names from YouTube comments.
- **Integration with Spotify API**: Enables users to search and retrieve song details directly from Spotify.
- **Efficient Job Queue System**: Manages job states and processing using DynamoDB and SQS queues.
- **Loose Coupling of Components**: Achieved through the use of queues and microservices architecture.

## Architecture Overview

The backend architecture is built on AWS serverless technologies to ensure scalability, cost-effectiveness, and ease of maintenance. The system consists of several AWS components working together:

![alt text]("https://github.com/ClayNdugga/youtube-comments/tree/main/public/images/placeholderAvatar.png?raw=true")

<!-- ![alt text]("https://github.com/ClayNdugga/youtube-comments/tree/main/public/images/YTC architecture.png?raw=true") -->


- **Amazon API Gateway**: Acts as the entry point for all API requests, handling load balancing and routing to the appropriate services.
- **AWS Lambda Functions**: Stateless functions that perform various tasks such as processing jobs, fetching comments, and running the song searching algorithm.
- **Amazon SQS Queues**: Decouple the system's components by queuing tasks for channels and videos.
- **Amazon DynamoDB**: Serves as the central store for tracking job states and ensuring idempotency.
- **Amazon S3**: Stores raw comments and processed song data organized systematically.
- **Spotify API**: Used for searching and fetching song details based on extracted song names.

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

#### Processing Workflow

1. **Job Submission**:
   - When a user requests song extraction for a channel or video, the API Gateway invokes a Lambda function that checks the DynamoDB table for existing jobs.
   - If no existing job is found, the metadata of the video or channel Id in s3 is checked for recency.
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
   - Notifies the user through API responses or callbacks.

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
def group_similar_songs(song_strings, threshold=0.9):
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

#### Benefits

- **Efficiency**: By precomputing q-grams and using a single pass through the data, the algorithm operates in $O(n)$ time 
- **Accuracy**: Groups together songs with high similarity, reducing duplicates sent to the Spotify API.
- **Scalability**: Suitable for scaling with increased data due to low time complexity.

## Data Flow

1. **User Request**: A user initiates a request to extract songs from a channel or video via the frontend interface.
2. **API Gateway**: Receives the request and triggers the appropriate Lambda function.
3. **Job Handling**:
   - The Lambda function checks the DynamoDB table for existing jobs.
   - Creates a new job entry if none exists and updates the job state.
   - Places the channel or video ID into the corresponding SQS queue.
4. **Queue Processing**:
   - Lambda functions consume messages from the Channel and Video Queues.
   - For channels, video IDs are fetched and queued.
   - For videos, comments are retrieved and stored in S3.
5. **Comment Processing**:
   - Song extraction Lambda functions process comments from S3.
   - The song searching algorithm identifies and groups song names.
   - Results are stored back into S3 under the appropriate path.
6. **Job Completion**:
   - Job status in DynamoDB is updated to "complete".
   - Users can retrieve the results through the API or receive notifications.

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

## Scalability and Fault Tolerance

- **Serverless Architecture**: Automatically scales with the workload, reducing the need to manage infrastructure.
- **Stateless Functions**: Lambda functions are stateless, enhancing scalability and reliability.
- **Concurrency Controls**: Manages concurrency levels to prevent resource exhaustion.
- **Auto Scaling for DynamoDB**: Adjusts read/write capacities based on demand.
- **SQS Queues**: Decouples system components, allowing each part to scale independently.

## Error Handling and Idempotency

- **Idempotent Lambda Functions**: Functions can be safely retried without causing inconsistent states.
- **Retries and Backoff Policies**: Configured to handle transient errors and throttling issues.
- **Dead-Letter Queues**: Messages that can't be processed after retries are moved to a dead-letter queue for manual investigation.
- **Logging and Monitoring**: CloudWatch collects logs for debugging and performance monitoring.

## Caching Strategy

- **Result Caching**: Stores processed results in S3 and checks for existing data before processing new requests.
- **Cache Invalidation**: Implements policies to invalidate cached data after a certain period to ensure data freshness.
- **Edge Caching**: Uses AWS CloudFront (if applicable) to cache API responses at edge locations for faster delivery.

## Security Considerations

- **Input Validation**: Validates all input data to prevent injection attacks.
- **Authentication and Authorization**:
  - Secure API endpoints with authentication mechanisms (e.g., API keys, IAM roles).
  - Apply the principle of least privilege in IAM policies.
- **Data Encryption**:
  - Enable encryption at rest for S3 buckets and DynamoDB tables.
  - Use HTTPS endpoints to encrypt data in transit.
- **Secrets Management**: Store API keys and sensitive information securely using AWS Secrets Manager or AWS Systems Manager Parameter Store.

## Deployment

- **Infrastructure as Code**: Uses AWS CloudFormation or AWS SAM templates for consistent and repeatable deployments.
- **CI/CD Pipeline**:
  - Integrate with AWS CodePipeline and CodeDeploy for automated deployments.
  - Incorporate testing and code quality checks in the pipeline.
- **Environment Management**: Supports multiple environments (e.g., development, staging, production) with parameterized configurations.



## Future Improvements

- **Enhanced NLP**: Incorporate advanced natural language processing techniques to improve song extraction accuracy.
- **User Notifications**: Implement email or push notifications to inform users when processing is complete.
- **Webhooks Integration**: Allow clients to subscribe to job status updates via webhooks.
- **GraphQL API**: Provide a flexible API for clients to query data.
- **Analytics and Reporting**: Collect usage metrics to analyze popular songs and trends.
- **Internationalization**: Extend support for multiple languages in comment processing.