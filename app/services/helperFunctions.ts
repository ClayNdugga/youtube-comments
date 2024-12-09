export function formatTimestamp(input: string): string {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const match = input.match(regex);

  if (!match) {
    return ""; 
  }

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  if (hours > 0) {
    return `${hours}h ${minutes}m`; 
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }

  if (seconds > 0) {
    return `${seconds}s`;
  }

  return ""; 
}

export function formatLargeNumber(input: string | number): string {
  const number = typeof(input) === "string" ? parseFloat(input): input; 

  if (isNaN(number)) {
    return input.toString(); 
  }

  if (number < 1000) {
    return number.toString(); 
  } else if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  } else {
    return `${(number / 1000).toFixed(1).replace(/\.0$/, "")}K`;
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


  const diffInMs = now.getTime() - uploadDate.getTime();

  const diffInSeconds = Math.floor(diffInMs / 1000);

  const seconds = diffInSeconds % 60;
  const minutes = Math.floor(diffInSeconds / 60) % 60;
  const hours = Math.floor(diffInSeconds / 3600) % 24;
  const days = Math.floor(diffInSeconds / 86400);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

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
