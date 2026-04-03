
export type MockSimpleType = string;
export type MocksSimpleType = Array<MockSimpleType>;


interface MockOfSimpleItem<A> {
  description : string;
  items       : Array<A>;
  value       : Partial<A>,
}

type MockOfSimpleResult<A> = Array<A>;

interface MockOfSimple<A> extends Array<MockOfSimpleItem<A> | MockOfSimpleResult<A>> {
  0: MockOfSimpleItem<A>;
  1: MockOfSimpleResult<A>;
}

export type MocksOfSimple<A> = Array<MockOfSimple<A>>;
