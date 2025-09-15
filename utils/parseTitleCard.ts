import { startCase, toLower } from 'lodash';

import { CardCondition } from '@/generated/graphql';
import { SellFormStore } from '@/stores/sellFormStore';

export function parseTitleCardYear(input: string) {
  const parts = input
    .trim()
    .split(/[^0-9]+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return [parts[0]];
  }

  if (parts.length !== 2) {
    throw new Error('Input tidak valid');
  }

  const [startStr, endStr] = parts;
  const startYear = parseInt(startStr, 10);

  let endYear;
  if (endStr.length === 2) {
    const century = Math.floor(startYear / 100) * 100;
    const endYearNum = parseInt(endStr, 10);

    endYear = century + endYearNum;

    if (endYear < startYear) {
      endYear += 100;
    }
  } else {
    endYear = parseInt(endStr, 10);
  }

  return [startYear.toString(), endYear.toString()];
}

export function parseCanonicalTitle(payload: SellFormStore) {
  const {
    cardYears,
    cardSet,
    cardName,
    cardSerialNumber,
    cardNumber,
    cardGradingCompany,
    cardGradeNumber,
  } = payload;

  // Parse years using helper
  const parsedYears = Array.isArray(cardYears)
    ? cardYears
    : parseTitleCardYear(cardYears);

  // Years format
  const yearPart =
    parsedYears.length === 2
      ? `${parsedYears[0]}-${parsedYears[1]}`
      : parsedYears[0] || '';

  // Card set & name
  const setPart = cardSet?.trim() || '';
  const namePart = cardName?.trim() || '';

  // Card number & serial number
  const numberPart = cardNumber ? `#${cardNumber}` : '';
  const serialPart = cardSerialNumber ? `/${cardSerialNumber}` : '';

  // Grading
  const gradePart =
    payload.cardCondition === CardCondition.GRADED
      ? `${cardGradingCompany.toUpperCase()} ${cardGradeNumber}`
      : '';

  // Combine all parts
  const titleParts = [
    yearPart,
    startCase(toLower(setPart)),
    namePart,
    [numberPart, serialPart].filter(Boolean).join(' '),
    gradePart,
  ];

  return titleParts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}
