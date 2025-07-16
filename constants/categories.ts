import { SvgProps } from 'react-native-svg';

import {
  DC,
  Digimon,
  Fortnite,
  Futera,
  GarbagePailKids,
  Marvel,
  Panini,
  PokeMon,
  Poker,
  Topps,
  Wrestling,
  YuGiOh,
} from '@/assets/svg/categories';

export const imageCategories: Record<string, React.FC<SvgProps>> = {
  Topps: Topps,
  Panini: Panini,
  Futera: Futera,
  Pokemon: PokeMon,
  DC: DC,
  Fortnite: Fortnite,
  Marvel: Marvel,
  'Garbage Pail Kids': GarbagePailKids,
  Digimon: Digimon,
  Poker: Poker,
  Wrestling: Wrestling,
  'Yu-Gi-Oh!': YuGiOh,
};
