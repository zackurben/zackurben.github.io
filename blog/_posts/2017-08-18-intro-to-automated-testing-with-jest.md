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

Welcome back to another post. Today I wanted to highlight my favorite automated testing library, [Jest](https://github.com/facebook/jest), from Facebook. This is a delightful tool with built in code coverage, that is super simple to get started with. For this post, I've created a [GitHub Repository](https://github.com/zackurben/intro-to-jest) for you to follow if you get lost.

To get started with Jest in your [NPM](https://www.npmjs.com/) based projects, you can add it as a dev dependency:

```bash
npm i --save-dev jest
```

Once installed, you can instantly get started with writing tests!

## Sum Module

I've made a simple module in the sister repo, which contains a single function for calculating the sum of the given numbers. Using ES6 syntax, our function will:

  1. Filter all of the input arguments using the Number class
  2. Reduce the array into a single value with our custom accumulator
  3. Return the sum of all input numbers

```javascript
'use strict';

module.exports = {
  sum: (...args) => args.filter(Number).reduce((sum, value) => sum + value, 0)
};
```

## Writing Tests

To get started with writing tests, it should be known that Jest will look in 3 pre-defined places for test code, but you can configure any location using the [testMatch configuration](http://facebook.github.io/jest/docs/en/configuration.html#testmatch-array-string) setting.

For simplicity, I've created a root level file called `index.test.js`, to test my `index.js` file. The names don't have to match, but speaking for anyone who has to work with your code, _make them match_.

Finally, to get started with writing tests, you dont need to import any assertion libraries or additional libs, simply write code using their simple test and assert syntax. For my test file, I've created two simple usecases for my library:

  1. Verify that my default values are working
  2. Demonstrate the ability to calculate the sum of n numbers

The final file is as follows.

```javascript
'use strict';

const sum = require('./').sum;

test('sum without arguments returns 0', () => {
  expect(sum()).toBe(0);
});

test('sum of 1 and 2 is 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```