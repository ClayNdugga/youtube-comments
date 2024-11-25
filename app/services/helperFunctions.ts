export function formatTimestamp(input: string): string {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const match = input.match(regex);

  if (!match) {
    return ""; // Return an empty string if the format is invalid
  }

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  // Return format according to the specified conditions
  if (hours > 0) {
    return `${hours}h ${minutes}m`; // Return hours and minutes
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }

  if (seconds > 0) {
    return `${seconds}s`;
  }

  return ""; // Fallback for empty input or unrecognized format
}

export function formatLargeNumber(input: string | number): string {
  const number = typeof(input) === "string" ? parseFloat(input): input; // Convert the input string to a number

  if (isNaN(number)) {
    return input.toString(); // Return the original string if it's not a valid number
  }

  if (number < 1000) {
    return number.toString(); // Return the number as a string if it's less than 1000
  } else if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1).replace(/\.0$/, "")}M`; // Convert to millions
  } else {
    return `${(number / 1000).toFixed(1).replace(/\.0$/, "")}K`; // Convert to thousands
  }
}

export function parseSearch(url: string): [string , boolean] {
  const videoIdRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const channelHandleRegex = /@([a-zA-Z0-9_-]+)/;

  const videoMatch = url.match(videoIdRegex);
  if (videoMatch) {
    return [videoMatch[1], true]; 
  }

  const channelMatch = url.match(channelHandleRegex);
  if (channelMatch) {
    return [channelMatch[1], false]; 
  }

  return ["", false];
}


export function timeSinceUpload(dateString: string) {
  const uploadDate = new Date(dateString);
  const now = new Date();

  // Calculate the difference in milliseconds

  const diffInMs = now.getTime() - uploadDate.getTime();

  // Convert milliseconds to seconds
  const diffInSeconds = Math.floor(diffInMs / 1000);

  // Calculate the difference in various time units
  const seconds = diffInSeconds % 60;
  const minutes = Math.floor(diffInSeconds / 60) % 60;
  const hours = Math.floor(diffInSeconds / 3600) % 24;
  const days = Math.floor(diffInSeconds / 86400);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // Determine the appropriate string to return
  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }
}
