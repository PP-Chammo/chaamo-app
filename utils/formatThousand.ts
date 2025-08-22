export function formatThousand(value?: number | string | null): string {
  if (value === null || value === undefined) return '0';
  const num = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(num as number)) return '0';
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(num as number);
}

export default formatThousand;
