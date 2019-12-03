# relax-core

this is be the core of the calculator.

It is actually a small in-memory database with custom grammars for relational algebra and SQL.

## TODOs

* the complete interface should be changed
  * the exposed api should be async
  * the check and getResult steps should each return different (immutable) objects. e.g. `api(query).check().getResult()`
* remove the jQuery dependency
* the actual calculation should be executed in a web-worker
* decide wether to depend on immutable.js

## Documentation

// TODO: documentation is missing

### Parser

The parsers for SQL and RA are created with [peg.js](http://pegjs.majda.cz/).
The *.pegjs files contain the grammar.

The actual parser generation is triggered by the webpack build process.

### Tests

Tests are compiled to a separate bundle and can be found at http://127.0.0.1:8088/test.html