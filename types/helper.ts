export type DeepGet<
  T,
  Path extends readonly (string | number)[],
> = Path extends [infer K, ...infer Rest]
  ? K extends keyof T
    ? DeepGet<NonNullable<T[K]>, Extract<Rest, readonly (string | number)[]>>
    : K extends number
      ? T extends (infer U)[]
        ? DeepGet<NonNullable<U>, Extract<Rest, readonly (string | number)[]>>
        : never
      : never
  : T;
