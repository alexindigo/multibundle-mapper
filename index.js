/**
 * Writable stream that accepts r.js config objects
 * and writes mapping/bundling meta data into provided file
 * of specified format (json, js, html).
 *
 * [![Build Status](https://travis-ci.org/alexindigo/multibundle-mapper.svg)](https://travis-ci.org/alexindigo/multibundle-mapper)
 *
 * @example
 *
 * var multibundle = require('multibundle')
 *   , Mapper      = require('multibundle-mapper')
 *   , options     = require('./options/bundles.js')
 *   , config      = require('./options/config.js')
 *   ;
 *
 * // optimize
 * var bundler = multibundle(config, options);
 * var bundleMapper = Mapper.json('config/local.json', {prefix: config.prefix});
 *
 * bundler.pipe(bundleMapper);
 *
 * @module multibundle-mapper
 */

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

/**
 * Creates stream for JSON file
 *
 * @param {string} filepath - path to the output file
 * @param {object} options - list of options to adjust Mapper's behavior
 * @param {function} callback - invoked after all data has been written
 * @returns {stream.Writable} Writable stream for json file
 */
Mapper.json = Mapper.bind(undefined, Mapper.JSON);

/**
 * Creates stream for JS file
 *
 * @param {string} filepath - path to the output file
 * @param {object} options - list of options to adjust Mapper's behavior
 * @param {function} callback - invoked after all data has been written
 * @returns {stream.Writable} Writable stream for js file
 */
Mapper.js = Mapper.bind(undefined, Mapper.JS);

/**
 * Creates stream for HTML file
 *
 * @param {string} filepath - path to the output file
 * @param {object} options - list of options to adjust Mapper's behavior
 * @param {function} callback - invoked after all data has been written
 * @returns {stream.Writable} Writable stream for html file
 */
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
 * @param {function} callback - invoked after all data has been written
 * @alias module:multibundle-mapper
 */
function Mapper(format, outfile, options, callback)
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
    return new Mapper(format, outfile, options, callback);
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
  this.on('finish', this._writer.bind(this, callback || function(err)
  {
    if (err) throw err;
  }));
}

/**
 * Writes bundles data into JSON file
 *
 * @private
 * @param {function} callback - invoked after file has been written
 */
Mapper.prototype._toJson = function(callback)
{
  var _mapper = this
    , outFile = new jsonFile.File(this._outputFile)
    ;

  outFile.update(function(err, save)
  {
    if (err) return callback(err);

    this.set(_mapper._markers.mapping, _mapper._accumulator.mapping);
    this.set(_mapper._markers.bundles, _mapper._accumulator.bundles);

    save(callback);
  });
};

/**
 * Writes bundles data into JS file
 *
 * @private
 * @param {function} callback - invoked after file has been written
 */
Mapper.prototype._toJs = function(callback)
{
  this._readAndWrite(this._outputFile, function(err, data, save)
  {
    if (err) return callback(err);

    // if content exists, replace
    if (data)
    {
      data = data.replace(this._markers.mapping, JSON.stringify(this._accumulator.mapping));
      data = data.replace(this._markers.bundles, JSON.stringify(this._accumulator.bundles));
    }
    // otherwise append
    else
    {
      data += '\n;';
      data += 'requirejs.config({';
      data += 'paths:' + JSON.stringify(this._accumulator.mapping) + ',';
      data += 'bundles:' + JSON.stringify(this._accumulator.bundles);
      data += '});';
    }

    save(data, callback);
  }.bind(this));
};

/**
 * Writes bundles data into HTML file
 *
 * @private
 * @param {function} callback - invoked after file has been written
 */
Mapper.prototype._toHtml = function(callback)
{
  this._readAndWrite(this._outputFile, function(err, data, save)
  {
    if (err) return callback(err);

    // if content exists, replace
    if (data)
    {
      data = data.replace(this._markers.mapping, JSON.stringify(this._accumulator.mapping));
      data = data.replace(this._markers.bundles, JSON.stringify(this._accumulator.bundles));
    }
    // otherwise append
    else
    {
      data += '\n<!-- -->\n';
      data += '<script>requirejs.config({';
      data += 'paths:' + JSON.stringify(this._accumulator.mapping) + ',';
      data += 'bundles:' + JSON.stringify(this._accumulator.bundles);
      data += '});</script>';
    }

    save(data, callback);
  }.bind(this));
};

/**
 * Checks if file exists and reads from it,
 * otherwise passes empty content
 * and writeFile function bound to the file
 *
 * @private
 * @param   {string} file - file path to read
 * @param   {function} callback - invoked with file's content
 *                              (or empty string) and write function
 */
Mapper.prototype._readAndWrite = function(file, callback)
{
  fs.exists(file, function(exists)
  {
    if (exists)
    {
      fs.readFile(file, {encoding: 'utf8'}, function(err, data)
      {
        if (err) return callback(err);

        // pass fs.writeFile as save function
        callback(null, data, fs.writeFile.bind(fs, file));
      });
    }
    else
    {
      callback(null, '', fs.writeFile.bind(fs, file));
    }
  });
};

/**
 * Composes prefixed file path for provided bundle local file
 *
 * @private
 * @param   {string} file - bundle's file name
 * @returns {string} prefix file name sans extension
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

  this._accumulator.mapping[bundle.name] = prefixedBundle;
  this._accumulator.bundles[bundle.name] = bundle.include;

  next();
};
