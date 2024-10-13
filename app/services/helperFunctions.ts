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

export function formatLargeNumber(input: string): string {
  const number = parseFloat(input); // Convert the input string to a number

  if (isNaN(number)) {
    return input; // Return the original string if it's not a valid number
  }

  if (number < 1000) {
    return number.toString(); // Return the number as a string if it's less than 1000
  } else if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1).replace(/\.0$/, '')}M`; // Convert to millions
  } else {
    return `${(number / 1000).toFixed(1).replace(/\.0$/, '')}K`; // Convert to thousands
  }
}

export function parseYouTubeVideoId(url: string): string | null {
  const videoIdRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(videoIdRegex);
  return match ? match[1] : null;
}
