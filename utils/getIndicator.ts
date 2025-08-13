export const getIndicator = (
  startPrice: number | string,
  lastSoldPrice: number | string,
) => {
  return Number(lastSoldPrice) > Number(startPrice) ? 'up' : 'down';
};
