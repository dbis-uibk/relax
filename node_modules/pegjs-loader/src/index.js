import pegjs from 'pegjs';
import loaderUtils from 'loader-utils';

export default function loader(source) {
  if (this.cacheable) {
    this.cacheable();
  }

  const query = loaderUtils.parseQuery(this.query);
  const cacheParserResults = !!query.cache;
  const optimizeParser = query.optimize || 'speed';
  const trace = !!query.trace;
  const dependencies = JSON.parse(query.dependencies || '{}');

  let allowedStartRules;
  if (typeof query.allowedStartRules === 'string') {
    allowedStartRules = [ query.allowedStartRules ];
  } else if (Array.isArray(query.allowedStartRules)) {
    allowedStartRules = query.allowedStartRules;
  } else {
    allowedStartRules = [];
  }

  // Description of PEG.js options: https://github.com/pegjs/pegjs#javascript-api
  const pegOptions = {
    cache: cacheParserResults,
    dependencies: dependencies,
    format: 'commonjs',
    optimize: optimizeParser,
    output: 'source',
    trace: trace,
  };
  if (allowedStartRules.length > 0) {
    pegOptions.allowedStartRules = allowedStartRules;
  }

  const methodName = (typeof pegjs.generate === 'function') ? 'generate' : 'buildParser';
  return pegjs[methodName](source, pegOptions);
}
