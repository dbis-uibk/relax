const fs = require('fs');
const path = require('path');
const QUnit = require('qunitjs');

const existsStat = require('./');

QUnit.module('existsStat', function() {
  QUnit.test('returns the stats object for a path that exists', function(assert) {
    const dirPath = path.join(__dirname, 'fixtures', 'exists-dir');
    const filePath = path.join(__dirname, 'fixtures', 'exists-dir', 'exists.js');

    assert.ok(existsStat(dirPath).isDirectory());
    assert.ok(existsStat(filePath).isFile());
  });

  QUnit.test('returns null for a path that does not exist', function(assert) {
    const filePath = path.join(__dirname, 'fixtures', 'does-not-exist.js');
    const dirPath = path.join(__dirname, 'fixtures', 'does-not-exist-dir');

    assert.strictEqual(existsStat(filePath), null);
    assert.strictEqual(existsStat(dirPath), null);
  });
});

QUnit.on('runEnd', function(data) {
  const testCounts = JSON.stringify(data.testCounts, null, 2);
  console.log(testCounts);

  process.exitCode = data.testCounts.failed;
});

QUnit.start();
