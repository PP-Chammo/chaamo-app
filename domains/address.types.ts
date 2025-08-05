export interface Country {
  name: string;
  iso2: string;
  [key: string]: string | number;
}

export interface State {
  name: string;
  country_code: string;
  iso2: string;
  [key: string]: string | number;
}
