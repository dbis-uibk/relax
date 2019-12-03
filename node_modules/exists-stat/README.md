# exists-stat

Synchronously check if a path exists and returns its stats object if it does. Saves you from needing `try-catch` statements when trying to get stats information.

```js
existsStat('exists-dir').isDirectory(); // true
existsStat('exists.js').isFile();       //true

existsStat('does-not-exist-dir'); // null
existsStat('does-not-exist.js');  // null
```
