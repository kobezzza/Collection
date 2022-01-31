Collection
==========

Collection — minimalistic JavaScript library for working with collections of data.

[![NPM version](http://img.shields.io/npm/v/collection.js.svg?style=flat)](http://badge.fury.io/js/collection.js)
[![NPM download](https://img.shields.io/npm/dm/collection.js.svg?style=flat)](http://badge.fury.io/js/collection.js)

[![Build Status](https://github.com/kobezzza/Collection/workflows/build/badge.svg?branch=master)](https://github.com/kobezzza/Collection/actions?query=workflow%3Abuild)
[![Coverage Status](http://img.shields.io/coveralls/kobezzza/Collection.svg?style=flat)](https://coveralls.io/r/kobezzza/Collection?branch=master)

[Demo (threads)](http://jsfiddle.net/kobezzza/hut2jhL9/)

[Documentation](https://github.com/kobezzza/Collection/wiki)

## Features

* Universal interface for multiple data types: arrays, typed arrays, tables, Map, Set, generators and @@iterator protocol;
* The rich set of iterators;
* Built-in self JIT compilation of requests provides a very high speed of execution, which is comparable to the native cycles JavaScript;
* Support lightweight threads based on generators;
* Work in browsers, as well as on the server ([node.js](http://nodejs.org));
* The engine is written in pure JavaScript and does not have any dependencies;
* The source code is designed to work with Google Closure Compiler in advanced mode;
* The modular architecture allows to build your library;
* Good code coverage;
* Detailed [documentation](https://github.com/kobezzza/Collection/wiki) with examples.

### Usage

```js
// Iterate over the elements in reverse order starting with the 5th
$C(document.querySelectorAll('.foo')).forEach((el) => {
  ...
}, {
  reverse: true,
  startIndex: 5
});

// Return an array of all the even elements of the original array
$C([1, 2, 3, 4]).get((el) => el % 2 === 0);

// Create a new object based on the source,
// {a: 2, b: 4}
$C({a: 4, b: 16}).map(Math.sqrt);

// Iterate very large object in the lightweight thread
await $C(new Array(1e8)).thread().forEach(() => {
  ...
});
```

## [License](https://github.com/kobezzza/Collection/blob/master/LICENSE)

The MIT License.
