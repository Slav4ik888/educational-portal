import { Item } from '../../types';

export interface MockObjType extends Item {
  id     : string,
  field1 : string,
  field2 : string,
}

export type MocksObjType = Array<MockObjType>;


interface MockOfObjItem<A> {
  description : string;
  items       : Array<A>;
  value       : Partial<A> | string,
  field?      : string
}

type MockOfObjResult<A> = Array<A>;

interface MockOfObj<A> extends Array<MockOfObjItem<A> | MockOfObjResult<A>> {
  0: MockOfObjItem<A>;
  1: MockOfObjResult<A>;
}

export type MocksOfObj<A extends object> = Array<MockOfObj<A>>;
