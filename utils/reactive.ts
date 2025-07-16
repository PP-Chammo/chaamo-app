import {
  useReactiveVar as apolloUseReactiveVar,
  makeVar,
} from '@apollo/client';

function createReactiveVar<T>(initialValue: T) {
  const variable = makeVar<T>(initialValue);
  const useVar = () => apolloUseReactiveVar(variable);
  const get = () => variable();
  const set = (value: T) => variable(value);
  return { useVar, get, set };
}

export { createReactiveVar };
