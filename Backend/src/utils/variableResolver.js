export const resolveVariables = (input, variables) => {
  if (!input) return input;

  let output = input;

  for (const key in variables) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    output = output.replace(regex, variables[key]);
  }

  return output;
};
