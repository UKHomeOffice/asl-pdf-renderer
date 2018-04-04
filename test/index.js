const pdf = require('../');
const assert = require('assert');

const HOST = 'https://example.com';

// convert a middleware into (req, res) => Promise
const promisify = fn => (req, res) => {
  return new Promise((resolve, reject) => {
    fn(req, res, err => {
      return err ? reject(err) : resolve();
    });
  });
};

describe('@asl/pdf-renderer', () => {

  it('exports a middleware function', () => {
    assert.equal(typeof pdf(HOST), 'function');
    assert.equal(pdf(HOST).length, 3);
  });

  it('throws if not provided with a host', () => {
    assert.throws(() => pdf());
  });

  describe('middleware', () => {

    let middleware;
    let req;
    let res;

    beforeEach(() => {
      middleware = promisify(pdf(HOST));
      req = {};
      res = {};
    });

    it('adds a `res.pdf` method to the response object', () => {
      return middleware(req, res)
        .then(() => {
          assert.equal(typeof res.pdf, 'function');
        });
    });

  });

});
