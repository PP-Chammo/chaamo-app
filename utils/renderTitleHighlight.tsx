import { Label } from '@/components/atoms';

export const renderTitleHighlight = (
  titleText: string,
  searchQuery: string,
) => {
  const q = (searchQuery ?? '').trim();
  if (!q) return titleText;
  // Split the search query into tokens (per word) and compare against each word in the title
  const qTokens = q
    .split(' ')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  // Iterate from titleText.split(' ') to highlight per word
  const words = titleText.split(' ');

  return (
    <>
      {words.map((word, idx) => {
        const isMatch = qTokens.some((token) =>
          word.toLowerCase().includes(token),
        );
        return isMatch ? (
          <Label key={idx} className={classes.titleHighlight}>
            {word}
            {idx < words.length - 1 ? ' ' : ''}
          </Label>
        ) : (
          <Label key={idx}>
            {word}
            {idx < words.length - 1 ? ' ' : ''}
          </Label>
        );
      })}
    </>
  );
};

const classes = {
  titleHighlight: 'text-primary-500 font-bold',
};
