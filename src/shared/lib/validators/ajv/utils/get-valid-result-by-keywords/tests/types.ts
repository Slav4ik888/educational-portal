import { AnyValidateFunction } from 'ajv/dist/core';
import { Validation } from '../../../../types';

interface MockItem {
  description : string
  validate    : AnyValidateFunction<unknown>
}

interface Mock extends Array<MockItem | Validation> {
  0: MockItem
  1: Validation
}

export type Mocks = Array<Mock>
