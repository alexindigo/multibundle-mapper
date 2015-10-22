var fs       = require('fs')
  , assert   = require('assert')
  , Readable = require('stream').Readable
  , Mapper   = require('./')
  , data     =
  {
    common  : require('./test/input/common.json'),
    optional: require('./test/input/optional.json'),
    maps    : require('./test/input/maps.json'),
    user    : require('./test/input/user.json')
  }
  , expected =
  {
    existing: {
      json: require('./test/expected/existing.json'),
      js  : fs.readFileSync('./test/expected/existing.js', {encoding: 'utf8'}),
      html: fs.readFileSync('./test/expected/existing.html', {encoding: 'utf8'})
    },
    newly_created: {
      json: require('./test/expected/newly_created.json'),
      js  : fs.readFileSync('./test/expected/newly_created.js', {encoding: 'utf8'}),
      html: fs.readFileSync('./test/expected/newly_created.html', {encoding: 'utf8'})
    }
  }
  ;

// updating existing
writeTest('json', './test/tmp/existing.json', expected.existing.json);
writeTest('js', './test/tmp/existing.js', expected.existing.js);
writeTest('html', './test/tmp/existing.html', expected.existing.html);

// creating new ones
writeTest('json', './test/tmp/newly_created.json', expected.newly_created.json);
writeTest('js', './test/tmp/newly_created.js', expected.newly_created.js);
writeTest('html', './test/tmp/newly_created.html', expected.newly_created.html);

// write test data
function writeTest(format, file, expected)
{
  var stream = Readable({objectMode: true});
  stream._read = function(size){};
  stream.pipe(Mapper[format](file, {prefix: 'http://static.company-cdn.com/javascript/'}, function(err)
  {
    assert.ifError(err);

    if (format == 'json')
    {
      assert.deepEqual(require(file), expected);
    }
    else
    {
      assert.equal(fs.readFileSync(file, {encoding: 'utf8'}), expected);
    }
  }));

  Object.keys(data).forEach(function(key)
  {
    stream.push(data[key]);
  });

  // done
  stream.push(null);
}
