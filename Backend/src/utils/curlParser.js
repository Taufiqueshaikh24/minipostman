export const parseCurl = (curlCommand) => {
  const result = {
    method: 'GET',
    url: '',
    headers: [],
    body: null,
  };

  const tokens = curlCommand.match(/"[^"]*"|'[^']*'|\S+/g);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token === '-X' || token === '--request') {
      result.method = tokens[++i].replace(/['"]/g, '');
    }

    if (token === '-H' || token === '--header') {
      const header = tokens[++i].replace(/['"]/g, '');
      const [key, ...rest] = header.split(':');
      result.headers.push({
        key: key.trim(),
        value: rest.join(':').trim(),
      });
    }

    if (token === '-d' || token === '--data' || token === '--data-raw') {
      result.body = tokens[++i].replace(/['"]/g, '');
      if (result.method === 'GET') result.method = 'POST';
    }

    if (token.startsWith('http')) {
      result.url = token.replace(/['"]/g, '');
    }
  }

  if (!result.url) {
    throw new Error('Invalid cURL: URL not found');
  }

  return result;
};
