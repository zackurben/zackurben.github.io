---
title: "Intro to automated testing with Jest"
displayDate: "2017-08-18"
summary: "Modern JavaScript testing with Jest"
tags:
---
<small class="left">
{{ page.displayDate }}
</small>
<br><br>

## {{ page.title }}
{{ page.summary }}

---

Welcome back to another post. Today I wanted to highlight my new favorite automated testing library, [Jest](https://github.com/facebook/jest), from Facebook. This is a delightful tool with built in code coverage and minimal setup time. For this post, I've created a [GitHub Repository](https://github.com/zackurben/intro-to-jest) for you to use as you follow along, if you choose to.

<br>
To get started with Jest in a [NPM](https://www.npmjs.com/) based project, simply add it as a dev dependency. Once installed, you can instantly get started with writing tests!

```bash
npm i --save-dev jest
```

<br>
### Writing Tests
---

Before getting started with the first test, it should be known that Jest will look for 3 predefined patterns to test code. Any files in the `__test__` folder and files ending in `.test.js` or `.spec.js` will auto-magically be picked up by jest.

>Note: You can configure any location using the [testMatch configuration](http://facebook.github.io/jest/docs/en/configuration.html#testmatch-array-string) setting.

<br>
For simplicity, I've created a root level file called `index.test.js`, to test my `index.js` file. The names are not required to match, but speaking for anyone who may touch your code, please _make them match_. To write the first test, forget about importing any assertion libraries or additional utilities, simply write code using the simple test and assertion syntax. The test syntax is as follows:

```javascript
'use strict';

test('this is the identifier for my test', () => {
  // Write assertions or return a 
  // promise which contains assertions.
});
```

Assertions are pretty straight forward too. They all essentially take the form of:
```javascript
expect(<anything>).toBe<something>()
```

For example:
```javascript
expect(null).toBeNull();            // true
expect(NaN).toBeNaN();              // true
expect(undefined).toBeUndefined();  // true
```

Putting our test skeleton and some assertions together, we get a crude test used for testing JavaScript internals.

>See the full list of [Assertion Methods](http://facebook.github.io/jest/docs/en/expect.html#methods)

```javascript
// assert.test.js
'use strict';

test('various assertion tests', () => {
  expect(null).toBeNull();
  expect(NaN).toBeNaN();
  expect(undefined).toBeUndefined();
  expect([]).toBeInstanceOf(Array);
  expect(1).toBeTruthy();
  expect(true).toBe(true);
  expect({ foo: 'bar' }).toHaveProperty('foo', 'bar');
});
```

<br>
### Running Tests
---

Now that we have a test, we need to run it. Since Jest configures the binary into the project path, `./node_modules/.bin/jest`, we can run any tests via `npm` with a simple test script:

```json
// Inside package.json, this is to avoid directly
// executing jest or installing it globally
{
  "script": {
    "test": "jest"
  }
}
```

To run the tests for a single file, we can add the path directly to the npm script command using `--` as follows: 

```bash
$ npm test -- assert.test.js

> intro-to-jest@0.0.1 test C:\code\intro-to-jest
> jest "assert.test.js"

 PASS  .\assert.test.js
  √ various assertion tests (13ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.978s, estimated 1s
Ran all test suites matching "assert.test.js".
```

What does a broken test look like? Using the following test, we can see the output for a failing test too:

```javascript
test('this wont pass', () => {
  expect(NaN).toBeTruthy();
});
```

```bash
$ npm test -- assert.test.js

> intro-to-jest@0.0.1 test C:\code\intro-to-jest
> jest "assert.test.js"

 FAIL  .\assert.test.js
  ● this wont pass

    expect(received).toBeTruthy()

    Expected value to be truthy, instead received
      NaN

      at Object.<anonymous>.test (assert.test.js:14:15)
      at process._tickCallback (internal/process/next_tick.js:109:7)

  √ this is the identifier for my test (13ms)
  × this wont pass (1ms)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
Snapshots:   0 total
Time:        0.996s, estimated 1s
Ran all test suites matching "assert.test.js".
npm ERR! Test failed.  See above for more details.
```

<br>
### Real Example
---

Asserting that language level constructs pass tests is pretty boring, so I've included a more in-depth example too. I've made a simple module in the sister repo, which contains a few functions for calculating the sum of the given numbers (wildly impractical). There are three core demonstrations, followed by their set of passing tests: pure synchronous code, promise based, and callback style.

```javascript
// index.js
'use strict';

/**
 * Get the sum of the input as a number.
 * 
 * @param {*} args
 *   The arguments to sum.
 * 
 * @returns {Number}
 *   The sum of the input variables or 0.
 */
const sum = (...args) =>
  args.filter(Number).reduce((sum, value) => sum + value, 0);

/**
 * Get the sum of the input as a delayed promise.
 * 
 * @param {*} args
 *   The arguments to sum.
 * 
 * @returns {Promise}
 *   The promise of the sum.
 */
const sumP = (...args) =>
  new Promise(resolve =>
    setTimeout(() => resolve(sum.apply(this, args)), 1000)
  );

/**
 * Get the sum of the input as a callback value.
 * 
 * @param {*} args
 *   The arguments to sum with a callback.
 */
const sumC = (...args) => {
  const cb = args.pop();
  if (!cb || typeof cb !== 'function') {
    return undefined;
  }

  return cb(sum.apply(this, args));
};

module.exports = {
  sum,
  sumP,
  sumC
};

```

```javascript
// index.test.js
'use strict';

const { sum, sumP, sumC } = require('./');

test('sum without arguments returns 0', () => {
  expect(sum()).toBe(0);
});

test('sum of 1 and 2 is 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('sumP returns a promise', () => {
  expect(sumP(1, 2)).toBeInstanceOf(Promise);
});

test('sumP of 3 and 4 is 7', () =>
  sumP(3, 4).then(val => {
    expect(val).toBe(7);
  }));

test('sumC without a arguments returns undefined', () => {
  expect(sumC()).toBeUndefined();
});

test('sumC without a callback returns undefined', () => {
  expect(sumC(1)).toBeUndefined();
});

test('sumC of 1 with a callback returns 1', () => {
  sumC(1, value => {
    expect(value).toBe(1);
  });
});
```

<br>
### Code Coverage
---

Finally, my last favorite thing about Jest is the ease of getting code coverage. I've tried various solutions with mocha, but it always seems half baked and cumbersome to use with cool tools like [Coveralls](https://coveralls.io/). That is a thing of the past with Jest. Simply run your test suite with `--coverage` and you will get all the coverage information you could want!

>Note: The CLI output is limited, but it has full lcov output in the coverage folder!

```bash
$ npm run test -- index.test.js --coverage

> intro-to-jest@0.0.1 test C:\code\intro-to-jest
> jest "index.test.js" "--coverage"

 PASS  .\index.test.js
  √ sum without arguments returns 0 (4ms)
  √ sum of 1 and 2 is 3 (1ms)
  √ sumP returns a promise (1ms)
  √ sumP of 3 and 4 is 7 (1000ms)
  √ sumC without a arguments returns undefined (1ms)
  √ sumC without a callback returns undefined
  √ sumC of 1 with a callback returns 1 (1ms)

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        1.87s, estimated 2s
Ran all test suites matching "index.test.js".
----------|----------|----------|----------|----------|----------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------|----------|----------|----------|----------|----------------|
All files |      100 |      100 |      100 |      100 |                |
 index.js |      100 |      100 |      100 |      100 |                |
----------|----------|----------|----------|----------|----------------|
```

<br>
### Conclusion
---
As stated earlier, the aim of this post was to highlight my new favorite automated testing library. My post just scratches the surface of what Jest can do, but I may do a follow up or two and cover more. With the simplicity of getting started with Jest, there really isn't a good reason for projects having zero tests.

<br>
I hope someone found this post helpful, and as always feel free to reach out to me on
[Twitter]({{ site.twitter_profile }}) and suggest new topics for me to cover!

&minus; Zack
<br>
