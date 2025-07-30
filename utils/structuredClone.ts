export const structuredClone = (value: unknown) => {
  return JSON.parse(JSON.stringify(value));
};
