import { expect } from 'chai';
import 'mocha';

import { noop } from "./noop";

describe('Noop Function', () => {
  it('should return void', () => {
    expect(noop()).to.eq(undefined);
    expect(Function.noop.call(this, "a", 1, true, {})).to.eq(undefined);
  });
});
