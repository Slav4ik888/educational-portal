import type { Item } from '../../types';

export interface MockObjType extends Item {
  id     : string | number,
  field1 : string,
  field2 : string,
}

export type MocksObjType = Array<MockObjType>;


interface MockOfObjItem<A> {
  description : string;
  items       : Array<A>;
  value       : string | number,
}

type MockOfObjResult<A> = Array<A>;

interface MockOfObj<A> extends Array<MockOfObjItem<A> | MockOfObjResult<A>> {
  0: MockOfObjItem<A>;
  1: MockOfObjResult<A>;
}

export type MocksOfObj<A extends object> = Array<MockOfObj<A>>;
