/**
 * Parse a cURL command string into a request object
 */
export function parseCurl(curlCommand) {
  const result = {
    method: "GET",
    url: "",
    headers: [],
    body: null,
  };

  let cmd = curlCommand
    .replace(/\\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (cmd.toLowerCase().startsWith("curl ")) {
    cmd = cmd.substring(5).trim();
  }

  // Extract method
  const methodMatch = cmd.match(/-X\s+(\w+)|--request\s+(\w+)/i);
  if (methodMatch) {
    result.method = (methodMatch[1] || methodMatch[2]).toUpperCase();
  }

  // Extract headers
  const headerRegex = /-H\s+["']([^"']+)["']|--header\s+["']([^"']+)["']/gi;
  let headerMatch;
  while ((headerMatch = headerRegex.exec(cmd)) !== null) {
    const headerStr = headerMatch[1] || headerMatch[2];
    const colonIndex = headerStr.indexOf(":");
    if (colonIndex > 0) {
      result.headers.push({
        key: headerStr.substring(0, colonIndex).trim(),
        value: headerStr.substring(colonIndex + 1).trim(),
      });
    }
  }

  // Extract body
  const bodyMatch = cmd.match(/-d\s+["']([^"']+)["']|--data\s+["']([^"']+)["']|--data-raw\s+["']([^"']+)["']/i);
  if (bodyMatch) {
    result.body = bodyMatch[1] || bodyMatch[2] || bodyMatch[3];
    if (!methodMatch) result.method = "POST";
  }

  // Extract URL
  const urlMatch = cmd.match(/(https?:\/\/[^\s"']+)|["'](https?:\/\/[^"']+)["']/i);
  if (urlMatch) {
    result.url = urlMatch[1] || urlMatch[2];
  }

  return result;
}

export default parseCurl;