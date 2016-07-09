Collection
==========

Collection — minimalistic JavaScript library for working with collections of data.

[![NPM version](http://img.shields.io/npm/v/collection.js.svg?style=flat)](http://badge.fury.io/js/collection.js)
[![NPM download](https://img.shields.io/npm/dm/collection.js.svg?style=flat)](http://badge.fury.io/js/collection.js)
[![NPM dependencies](http://img.shields.io/david/kobezzza/Collection.svg?style=flat)](https://david-dm.org/kobezzza/Collection#info=dependencies&view=table)
[![NPM devDependencies](http://img.shields.io/david/dev/kobezzza/Collection.svg?style=flat)](https://david-dm.org/kobezzza/Collection#info=devDependencies&view=table)

[![Build Status](http://img.shields.io/travis/kobezzza/Collection.svg?style=flat&branch=master)](https://travis-ci.org/kobezzza/Collection)
[![Coverage Status](http://img.shields.io/coveralls/kobezzza/Collection.svg?style=flat)](https://coveralls.io/r/kobezzza/Collection?branch=master)

[Demo (threads)](http://jsfiddle.net/kobezzza/hut2jhL9/)

[Documentation](https://github.com/kobezzza/Collection/wiki)

## Features

* Universal interface for multiple data types: arrays, typed arrays, tables, Map, Set, generators and @@iterator protocol;
* The rich set of iterators;
* Built-in self JIT compilation of requests provides a very high speed of execution, which is comparable to the native cycles JavaScript;
* Support lightweight threads based on generators;
* Transparent support for the data storage: LocalStorage, SessionStorage, IndexedDB;
* Work in browsers, as well as on the server ([node.js](http://nodejs.org));
* The engine is written in pure JavaScript and does not have any dependencies;
* The source code is designed to work with Google Closure Compiler in advanced mode;
* 3 basic types of the library:
  1. [full](https://raw.githubusercontent.com/kobezzza/Collection/master/dist/collection.min.js) (`min + gzip` ~ **22kb**);
  2. [light](https://raw.githubusercontent.com/kobezzza/Collection/master/dist/collection.light.min.js) (only base iterators, `min + gzip` ~ **13kb**);
  3. [core](https://raw.githubusercontent.com/kobezzza/Collection/master/dist/collection.core.min.js) (only `forEach`, `min + gzip` ~ **11kb**).
* The modular architecture allows to build your library;
* Good code coverage;
* Detailed [documentation](https://github.com/kobezzza/Collection/wiki) with examples.

### Usage

```js
// Iterate over the elements in reverse order starting with the 5th
$C(document.querySelectorAll('.foo')).forEach(function (el) {
  ...
}, {
  reverse: true,
  startIndex: 5
});

// Return an array of all the even elements of the original array
$C([1, 2, 3, 4]).get(function (el) { return el % 2 === 0; });

// Create a new object based on the source,
// {a: 2, b: 4}
$C({a: 4, b: 16}).map(Math.sqrt);

// Upload a collection from the indexedDB
$C().load({lib: 'indexedDB', id: 'foo'});

// Iterate very large object in the thread
$C(new Array(1e8)).forEach(function () {
  ...
}, {thread: true});
```

## [License](https://github.com/kobezzza/Collection/blob/master/LICENSE)

The MIT License.
