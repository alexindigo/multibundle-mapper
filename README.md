<a name="module_multibundle-mapper"></a>
## multibundle-mapper
Writable stream that accepts r.js config objects
and writes mapping/bundling meta data into provided file
of specified format (json, js, html).

[![Build Status](https://travis-ci.org/alexindigo/multibundle-mapper.svg)](https://travis-ci.org/alexindigo/multibundle-mapper)

**Example**  
```js
var multibundle = require('multibundle')
  , Mapper      = require('multibundle-mapper')
  , options     = require('./options/bundles.js')
  , config      = require('./options/config.js')
  ;

// optimize
var bundler = multibundle(config, options);
var bundleMapper = Mapper.json('config/local.json', {prefix: config.prefix});

bundler.pipe(bundleMapper);
```

* [multibundle-mapper](#module_multibundle-mapper)
  * [Mapper](#exp_module_multibundle-mapper--Mapper) ⏏
    * [`new Mapper(format, filepath, options, callback)`](#new_module_multibundle-mapper--Mapper_new)
    * [`._toJson(callback)`](#module_multibundle-mapper--Mapper+_toJson) ℗
    * [`._toJs(callback)`](#module_multibundle-mapper--Mapper+_toJs) ℗
    * [`._toHtml(callback)`](#module_multibundle-mapper--Mapper+_toHtml) ℗
    * [`._readAndWrite(file, callback)`](#module_multibundle-mapper--Mapper+_readAndWrite) ℗
    * [`._getPrefixedBundle(file)`](#module_multibundle-mapper--Mapper+_getPrefixedBundle) ⇒ <code>string</code> ℗
    * [`._write(bundle, encoding, next)`](#module_multibundle-mapper--Mapper+_write) ℗


-

<a name="exp_module_multibundle-mapper--Mapper"></a>
### Mapper ⏏
**Kind**: Exported class  

-

<a name="new_module_multibundle-mapper--Mapper_new"></a>
#### `new Mapper(format, filepath, options, callback)`
Creates writable stream attached to the provided endpoint (file)
of the specified format.

**Params**
- format <code>string</code> - output file format
- filepath <code>string</code> - path to the output file
- options <code>object</code> - list of options to adjust Mapper's behavior
- callback <code>function</code> - invoked after all data has been written


-

<a name="module_multibundle-mapper--Mapper+_toJson"></a>
#### `mapper._toJson(callback)` ℗
Writes bundles data into JSON file

**Kind**: instance method of <code>[Mapper](#exp_module_multibundle-mapper--Mapper)</code>  
**Access:** private  
**Params**
- callback <code>function</code> - invoked after file has been written


-

<a name="module_multibundle-mapper--Mapper+_toJs"></a>
#### `mapper._toJs(callback)` ℗
Writes bundles data into JS file

**Kind**: instance method of <code>[Mapper](#exp_module_multibundle-mapper--Mapper)</code>  
**Access:** private  
**Params**
- callback <code>function</code> - invoked after file has been written


-

<a name="module_multibundle-mapper--Mapper+_toHtml"></a>
#### `mapper._toHtml(callback)` ℗
Writes bundles data into HTML file

**Kind**: instance method of <code>[Mapper](#exp_module_multibundle-mapper--Mapper)</code>  
**Access:** private  
**Params**
- callback <code>function</code> - invoked after file has been written


-

<a name="module_multibundle-mapper--Mapper+_readAndWrite"></a>
#### `mapper._readAndWrite(file, callback)` ℗
Checks if file exists and reads from it,
otherwise passes empty content
and writeFile function bound to the file

**Kind**: instance method of <code>[Mapper](#exp_module_multibundle-mapper--Mapper)</code>  
**Access:** private  
**Params**
- file <code>string</code> - file path to read
- callback <code>function</code> - invoked with file's content
                             (or empty string) and write function


-

<a name="module_multibundle-mapper--Mapper+_getPrefixedBundle"></a>
#### `mapper._getPrefixedBundle(file)` ⇒ <code>string</code> ℗
Composes prefixed file path for provided bundle local file

**Kind**: instance method of <code>[Mapper](#exp_module_multibundle-mapper--Mapper)</code>  
**Returns**: <code>string</code> - prefix file name sans extension  
**Access:** private  
**Params**
- file <code>string</code> - bundle's file name


-

<a name="module_multibundle-mapper--Mapper+_write"></a>
#### `mapper._write(bundle, encoding, next)` ℗
Receiver for the written data (underlying writeable stream interface)

**Kind**: instance method of <code>[Mapper](#exp_module_multibundle-mapper--Mapper)</code>  
**Access:** private  
**Params**
- bundle <code>object</code> - bundle metadata
- encoding <code>string</code> - encoding type for a chunk,
                         ignored since expecting only objects
- next <code>function</code> - callback function


-

