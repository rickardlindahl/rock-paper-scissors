import { Game } from "./types/game";

type GetValueFn<T> = (id: string) => T;
type SetValueFn<T> = (id: string, value: T) => void;

const createStore = <T extends {}>(): { get: GetValueFn<T>; set: SetValueFn<T> } => {
  const cache: { [key: string]: T } = {};

  return {
    get: id => cache[id],
    set: (id, value) => (cache[id] = value),
  };
};

export const store = createStore<Game>();
