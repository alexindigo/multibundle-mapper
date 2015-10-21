var Readable = require('stream').Readable
  , Mapper   = require('./')
  , data     =
  {
    common  : require('./test/input/common.json'),
    optional: require('./test/input/optional.json'),
    maps    : require('./test/input/maps.json'),
    user    : require('./test/input/user.json')
  }
  ;

// json
writeData('json', './test/tmp/file.json');

// js
writeData('js', './test/tmp/file.js');

// html
writeData('html', './test/tmp/file.html');

// write test data
function writeData(format, file)
{
  var stream = Readable({objectMode: true});
  stream._read = function(size){};
  stream.pipe(Mapper[format](file, {prefix: 'http://static.company-cdn.com/javascript/'}));

  Object.keys(data).forEach(function(key)
  {
    stream.push(data[key]);
  });

  // done
  stream.push(null);
}
