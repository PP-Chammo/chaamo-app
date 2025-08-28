import { Label } from '@/components/atoms';
import { escapeRegExp } from '@/utils/escapeRegExp';

export const renderTitleHighlight = (
  titleText: string,
  searchQuery: string,
) => {
  const q = (searchQuery ?? '').trim();
  if (!q) return titleText;
  const regex = new RegExp(`(${escapeRegExp(q)})`, 'ig');
  const parts = titleText.split(regex);
  return (
    <>
      {parts.map((part, idx) =>
        idx % 2 === 1 ? (
          <Label key={idx} className={classes.titleHighlight}>
            {part}
          </Label>
        ) : (
          <Label key={idx}>{part}</Label>
        ),
      )}
    </>
  );
};

const classes = {
  titleHighlight: 'text-primary-500 font-bold',
};
