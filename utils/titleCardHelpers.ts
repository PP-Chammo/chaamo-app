import { startCase, toLower, upperCase } from 'lodash';

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

/**
 * Build canonical title:
 * {Year} {SetName} - {Name} - Variation #{Number} /{Serial} (GradingCompany Grade)
 */

export function buildCanonicalTitle(input: SellFormStore): string {
  const trimSafe = (s?: string | null) =>
    typeof s === 'string' ? s.trim() : '';

  const normalizeSpace = (s: string) => s.replace(/\s+/g, ' ').trim();

  const toTitleCase = (s?: string | null) =>
    s ? startCase(toLower(trimSafe(s))) : '';

  // parse years robustly:
  function parseYears(raw?: string): string | null {
    const v = trimSafe(raw);
    if (!v) return null;

    try {
      const maybeArr = JSON.parse(v);
      if (Array.isArray(maybeArr) && maybeArr.length > 0) {
        const first = String(maybeArr[0]).trim();
        if (maybeArr.length > 1) {
          const last = String(maybeArr[maybeArr.length - 1]).trim();
          return `${first}-${last}`;
        }
        return first;
      }
    } catch {
      // ignore
    }

    if (v.includes(',')) {
      const parts = v
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
      if (parts.length === 1) return parts[0];
      if (parts.length > 1) return `${parts[0]}-${parts[parts.length - 1]}`;
    }

    return v;
  }

  const formatNumber = (num?: string) => {
    const t = trimSafe(num);
    return t ? `#${t}` : '';
  };

  const formatSerial = (serial?: string) => {
    const t = trimSafe(serial);
    if (!t) return '';
    if (t.startsWith('/')) return t;
    return `/${t}`;
  };

  // parts with TitleCase
  const yearPart = parseYears(input.cardYears);
  const setPart = toTitleCase(input.cardSet);
  const namePart = toTitleCase(input.cardName);
  const variationPart = toTitleCase(input.cardVariation);
  const numberPart = formatNumber(input.cardNumber);
  const serialPart = formatSerial(input.cardSerialNumber);

  const gradingCompany = toTitleCase(input.cardGradingCompany);
  const gradeNumber = trimSafe(input.cardGradeNumber);
  const gradingPart =
    gradingCompany && gradeNumber
      ? `${upperCase(gradingCompany)} ${gradeNumber}`
      : '';

  const frontParts = [yearPart, setPart].filter(Boolean).join(' ');
  const middleParts: string[] = [];
  if (namePart) middleParts.push(namePart);
  if (variationPart) middleParts.push(variationPart);

  let title = '';
  if (frontParts) {
    title = middleParts.length
      ? `${frontParts} - ${middleParts.join(' - ')}`
      : frontParts;
  } else {
    title = middleParts.join(' - ');
  }

  const numSerial = [numberPart, serialPart].filter(Boolean).join(' ');
  if (numSerial) {
    title = title ? `${title} ${numSerial}` : numSerial;
  }

  if (gradingPart) {
    title = title ? `${title} (${gradingPart})` : `(${gradingPart})`;
  }

  return normalizeSpace(title);
}
