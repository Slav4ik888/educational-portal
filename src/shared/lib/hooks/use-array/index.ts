import * as React from 'react';
import { Item, updateArrWithItemByField } from 'shared/helpers/arrays';


export interface UseArray<Item> {
  array                               : Item[]
  setArray(v: Item[])                 : void
  updateArray(v: Item, field: string) : void
  clearArray()                        : void
}


export function useArray(initArray: Item[]): UseArray<Item> {
  const [array, _setArray] = React.useState<Item[]>(initArray);

  const setArray = (v: Item[]) => _setArray(v);
  const updateArray = (v: Item, field: string) => {
    _setArray((_prev) => updateArrWithItemByField(array, field, v));
  };
  const clearArray = () => _setArray([]);

  return {
    array, setArray, updateArray, clearArray
  }
}
