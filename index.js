var fs       = require('fs')
  , path     = require('path')
  , util     = require('util')
  , Writable = require('stream').Writable
  , jsonFile = require('jsonfile2')
  ;

// Public API
module.exports = Mapper;
util.inherits(Mapper, Writable);

// supported formats
Mapper.JSON = 'please-use-constant:json';
Mapper.JS   = 'please-use-constant:js';
Mapper.HTML = 'please-use-constant:html';

// shortcuts for supported formats
Mapper.json = Mapper.bind(undefined, Mapper.JSON);
Mapper.js   = Mapper.bind(undefined, Mapper.JS);
Mapper.html = Mapper.bind(undefined, Mapper.HTML);

// default markers
Mapper.markers = {};
Mapper.markers[Mapper.JSON] =
{
  mapping: 'appData.static.js.mapping',
  bundles: 'appData.static.js.bundles'
};

Mapper.markers[Mapper.JS]   =
{
  mapping: '{/* requirejs multibundle mapping */}',
  bundles: '{/* requirejs multibundle bundles */}'
};

Mapper.markers[Mapper.HTML] =
{
  mapping: '{/* requirejs multibundle mapping */}',
  bundles: '{/* requirejs multibundle bundles */}'
};

// accumulates bundle objects
Mapper.prototype._accumulator =
{
  mapping: {},
  bundles: {}
};

/**
 * Creates writable stream attached to the provided endpoint (file)
 * of the specified format.
 *
 * @constructor
 * @param {string} format - output file format
 * @param {string} filepath - path to the output file
 * @param {object} options - list of options to adjust Mapper's behavior
 * @alias module:Mapper
 */
function Mapper(format, outfile, options)
{
  options = options || {};

  // require format
  if ([Mapper.JSON, Mapper.JS, Mapper.HTML].indexOf(format) == -1)
  {
    throw new Error('Supported output format is required.');
  }

  // require filepath
  if (!outfile)
  {
    throw new Error('Output file path is required.');
  }

  if (!(this instanceof Mapper))
  {
    return new Mapper(format, outfile, options);
  }

  // pick marker
  this._markers = options.markers || Mapper.markers[format];
  // key prefix
  this._prefix = options.prefix || '';

  // output file
  this._outputFile = outfile;

  // turn on object mode
  Writable.call(this, {objectMode: true});

  // setup writer
  switch(format)
  {
    case Mapper.JSON:
      this._writer = this._toJson;
      break;

    case Mapper.JS:
      this._writer = this._toJs;
      break;

    case Mapper.HTML:
      this._writer = this._toHtml;
      break;
  }

  // when everything collected write it down
  this.on('finish', this._writer.bind(this, function()
  {

    console.log('SAVED');

  }));
}

/**
 * [function description]
 */
Mapper.prototype._toJson = function(callback)
{
  var outFile = new jsonFile.File(this._outputFile);

  outFile.update(function(err)
  {
    if (err) throw err;

    this._writeJson(outFile, callback);
  }.bind(this));

  console.log('_______', this._accumulator);
};

Mapper.prototype._writeJson = function(file, callback)
{
  // reset mapping
  file.set(this._markers.mapping, this._accumulator.mapping);
  file.set(this._markers.bundles, this._accumulator.bundles);

  // extra step to preserve dots in the filenames
  // Object.keys(this._accumulator.bundles).forEach(function(bundle)
  // {
  //   file.set(this._markers.mapping + '[' + bundle + ']', this._accumulator.mapping[bundle]);
  //   file.set(this._markers.bundles + '[' + bundle + ']', this._accumulator.bundles[bundle]);
  // }.bind);

  file.write(callback);
};

/**
 * [function description]
 */
Mapper.prototype._toJs = function()
{

};

/**
 * [function description]
 */
Mapper.prototype._toHtml = function()
{

};

/**
 * Composes prefixed file path for provided bundle local file
 * @param   {[type]} file [description]
 * @returns {[type]} [description]
 */
Mapper.prototype._getPrefixedBundle = function(file)
{
  // preserve `//` if prefix is full url
  var proto, prefix, parts = this._prefix.split('//', 2);

  proto  = parts[1] && (parts[0] + '//') || '';
  prefix = parts[1] || parts[0];

  return proto + path.join(prefix, path.basename(file, path.extname(file)));
};

/**
 * Receiver for the written data (underlying writeable stream interface)
 *
 * @private
 * @param {object} bundle - bundle metadata
 * @param {string} encoding - encoding type for a chunk,
 *                          ignored since expecting only objects
 * @param {function} next - callback function
 */
Mapper.prototype._write = function(bundle, encoding, next)
{
  var prefixedBundle = this._getPrefixedBundle(bundle.outFile);

  this._accumulator.mapping[bundle.name]    = prefixedBundle;
  this._accumulator.bundles[prefixedBundle] = bundle.include;

  next();
};
