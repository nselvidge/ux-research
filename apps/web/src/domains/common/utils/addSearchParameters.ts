export const addSearchParameters = (
  url: string,
  parameters: { [key: string]: string }
) => {
  const query = new URLSearchParams(parameters);
  return `${url}${query.toString() === "" ? "" : `?${query.toString()}`}`;
};
