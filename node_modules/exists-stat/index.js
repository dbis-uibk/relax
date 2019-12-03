'use strict';

const fs = require('fs');

module.exports = function existsStat() {
  try {
    const stats = fs.statSync.apply(fs, arguments);
    return stats;
  } catch (e) {
    return null;
  }
};
