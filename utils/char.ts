export const titleCase = (str: string) =>
  str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

export const snakeCase = (str: string) => str.replace(/ /g, '_').toLowerCase();
