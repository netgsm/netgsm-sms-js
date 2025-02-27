const assert = require('assert');

describe('CommonJS Compatibility', () => {
  it('should work with require', () => {
    const Netgsm = require('../../dist/cjs/index.cjs');
    assert(typeof Netgsm === 'object');
    assert(typeof Netgsm.default === 'function');
    
    const instance = new Netgsm.default({
      userCode: 'test',
      password: 'test'
    });
    
    assert(instance instanceof Netgsm.default);
  });
}); 