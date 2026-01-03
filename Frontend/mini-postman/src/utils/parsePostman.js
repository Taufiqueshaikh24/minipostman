/**
 * Parse a Postman Collection v2 JSON into requests
 */
export function parsePostmanCollection(jsonString) {
  try {
    const collection = typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;

    const result = {
      name: collection.info?.name || "Imported Collection",
      requests: [],
    };

    function extractRequests(items) {
      if (!items || !Array.isArray(items)) return;

      for (const item of items) {
        if (item.request) {
          const req = item.request;
          
          // Build URL
          let url = "";
          if (typeof req.url === "string") {
            url = req.url;
          } else if (req.url?.raw) {
            url = req.url.raw;
          }

          // Build headers
          const headers = [];
          if (req.header && Array.isArray(req.header)) {
            for (const h of req.header) {
              if (h.key && !h.disabled) {
                headers.push({ key: h.key, value: h.value || "" });
              }
            }
          }

          // Build body
          let body = null;
          if (req.body?.mode === "raw" && req.body.raw) {
            body = req.body.raw;
          }

          result.requests.push({
            name: item.name || "Unnamed Request",
            method: (req.method || "GET").toUpperCase(),
            url,
            headers,
            body,
          });
        }

        // Recurse into folders
        if (item.item && Array.isArray(item.item)) {
          extractRequests(item.item);
        }
      }
    }

    extractRequests(collection.item);
    return result;
  } catch (error) {
    throw new Error("Invalid Postman Collection: " + error.message);
  }
}

export default parsePostmanCollection;
