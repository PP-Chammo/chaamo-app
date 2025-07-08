export type FlatData<T> =
  | {
      type: 'date';
      date: string;
    }
  | {
      type: 'group';
      group: T;
      date: string;
    };
