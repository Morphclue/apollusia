import {Types} from 'mongoose';

type Expand<T> = T extends (...args: infer A) => infer R
  ? (...args: Expand<A>) => Expand<R>
  : T extends infer O
    ? { [K in keyof O]: O[K] }
    : never;

export type DTOValue<T> =
  T extends Types.ObjectId ? string :
    T extends Date ? string :
      T extends Array<infer U> ? Array<DTOValue<U>> :
        T extends object ?
          Expand<{
            [P in keyof T]: DTOValue<T[P]>;
          }> : T;

export type DTO<T> = Expand<DTOValue<T> & {
  _id: string;
}>;
