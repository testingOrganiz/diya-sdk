(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.d1 = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/*! http://mths.be/base64 v0.1.0 by @mathias | MIT license */
;(function(root) {

	// Detect free variables `exports`.
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`.
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code, and use
	// it as `root`.
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var InvalidCharacterError = function(message) {
		this.message = message;
	};
	InvalidCharacterError.prototype = new Error;
	InvalidCharacterError.prototype.name = 'InvalidCharacterError';

	var error = function(message) {
		// Note: the error messages used throughout this file match those used by
		// the native `atob`/`btoa` implementation in Chromium.
		throw new InvalidCharacterError(message);
	};

	var TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	// http://whatwg.org/html/common-microsyntaxes.html#space-character
	var REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;

	// `decode` is designed to be fully compatible with `atob` as described in the
	// HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
	// The optimized base64-decoding algorithm used is based on @atk’s excellent
	// implementation. https://gist.github.com/atk/1020396
	var decode = function(input) {
		input = String(input)
			.replace(REGEX_SPACE_CHARACTERS, '');
		var length = input.length;
		if (length % 4 == 0) {
			input = input.replace(/==?$/, '');
			length = input.length;
		}
		if (
			length % 4 == 1 ||
			// http://whatwg.org/C#alphanumeric-ascii-characters
			/[^+a-zA-Z0-9/]/.test(input)
		) {
			error(
				'Invalid character: the string to be decoded is not correctly encoded.'
			);
		}
		var bitCounter = 0;
		var bitStorage;
		var buffer;
		var output = '';
		var position = -1;
		while (++position < length) {
			buffer = TABLE.indexOf(input.charAt(position));
			bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
			// Unless this is the first of a group of 4 characters…
			if (bitCounter++ % 4) {
				// …convert the first 8 bits to a single ASCII character.
				output += String.fromCharCode(
					0xFF & bitStorage >> (-2 * bitCounter & 6)
				);
			}
		}
		return output;
	};

	// `encode` is designed to be fully compatible with `btoa` as described in the
	// HTML Standard: http://whatwg.org/html/webappapis.html#dom-windowbase64-btoa
	var encode = function(input) {
		input = String(input);
		if (/[^\0-\xFF]/.test(input)) {
			// Note: no need to special-case astral symbols here, as surrogates are
			// matched, and the input is supposed to only contain ASCII anyway.
			error(
				'The string to be encoded contains characters outside of the ' +
				'Latin1 range.'
			);
		}
		var padding = input.length % 3;
		var output = '';
		var position = -1;
		var a;
		var b;
		var c;
		var d;
		var buffer;
		// Make sure any padding is handled outside of the loop.
		var length = input.length - padding;

		while (++position < length) {
			// Read three bytes, i.e. 24 bits.
			a = input.charCodeAt(position) << 16;
			b = input.charCodeAt(++position) << 8;
			c = input.charCodeAt(++position);
			buffer = a + b + c;
			// Turn the 24 bits into four chunks of 6 bits each, and append the
			// matching character for each of them to the output.
			output += (
				TABLE.charAt(buffer >> 18 & 0x3F) +
				TABLE.charAt(buffer >> 12 & 0x3F) +
				TABLE.charAt(buffer >> 6 & 0x3F) +
				TABLE.charAt(buffer & 0x3F)
			);
		}

		if (padding == 2) {
			a = input.charCodeAt(position) << 8;
			b = input.charCodeAt(++position);
			buffer = a + b;
			output += (
				TABLE.charAt(buffer >> 10) +
				TABLE.charAt((buffer >> 4) & 0x3F) +
				TABLE.charAt((buffer << 2) & 0x3F) +
				'='
			);
		} else if (padding == 1) {
			buffer = input.charCodeAt(position);
			output += (
				TABLE.charAt(buffer >> 2) +
				TABLE.charAt((buffer << 4) & 0x3F) +
				'=='
			);
		}

		return output;
	};

	var base64 = {
		'encode': encode,
		'decode': decode,
		'version': '0.1.0'
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return base64;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = base64;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (var key in base64) {
				base64.hasOwnProperty(key) && (freeExports[key] = base64[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.base64 = base64;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],5:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (isArrayBuffer(value)) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (isArrayBufferView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (isArrayBufferView(string) || isArrayBuffer(string)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffers from another context (i.e. an iframe) do not pass the `instanceof` check
// but they should be treated as valid. See: https://github.com/feross/buffer/issues/166
function isArrayBuffer (obj) {
  return obj instanceof ArrayBuffer ||
    (obj != null && obj.constructor != null && obj.constructor.name === 'ArrayBuffer' &&
      typeof obj.byteLength === 'number')
}

// Node 0.10 supports `ArrayBuffer` but lacks `ArrayBuffer.isView`
function isArrayBufferView (obj) {
  return (typeof ArrayBuffer.isView === 'function') && ArrayBuffer.isView(obj)
}

function numberIsNaN (obj) {
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":2,"ieee754":8}],6:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})

},{"../../is-buffer/index.js":10}],7:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],8:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],9:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],10:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],11:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],12:[function(require,module,exports){
/**
 * Utility functions
 */

var util = {};

util.isObject = function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

util.isNumber = function isNumber(arg) {
  return typeof arg === 'number';
}

util.isUndefined = function isUndefined(arg) {
  return arg === void 0;
}

util.isFunction = function isFunction(arg){
  return typeof arg === 'function';
}


/**
 * EventEmitter class
 */

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

EventEmitter.init = function() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!util.isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error' && !this._events.error) {
    er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      throw Error('Uncaught, unspecified "error" event.');
    }
    return false;
  }

  handler = this._events[type];

  if (util.isUndefined(handler))
    return false;

  if (util.isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (util.isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!util.isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              util.isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (util.isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (util.isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!util.isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;

      if (util.isFunction(console.error)) {
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
      }
      if (util.isFunction(console.trace))
        console.trace();
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!util.isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!util.isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (util.isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (util.isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (util.isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (Array.isArray(listeners)) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (util.isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (util.isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

},{}],13:[function(require,module,exports){
(function (process){
'use strict';

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}

}).call(this,require('_process'))

},{"_process":14}],14:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],15:[function(require,module,exports){
module.exports = require('./lib/_stream_duplex.js');

},{"./lib/_stream_duplex.js":16}],16:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

'use strict';

/*<replacement>*/

var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();

  processNextTick(cb, err);
};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}
},{"./_stream_readable":18,"./_stream_writable":20,"core-util-is":6,"inherits":9,"process-nextick-args":13}],17:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"./_stream_transform":19,"core-util-is":6,"inherits":9}],18:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var processNextTick = require('process-nextick-args');
/*</replacement>*/

module.exports = Readable;

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = require('events').EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = require('./internal/streams/stream');
/*</replacement>*/

// TODO(bmeurer): Change this back to const once hole checks are
// properly optimized away early in Ignition+TurboFan.
/*<replacement>*/
var Buffer = require('safe-buffer').Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var debugUtil = require('util');
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = require('./internal/streams/BufferList');
var destroyImpl = require('./internal/streams/destroy');
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') {
    return emitter.prependListener(event, fn);
  } else {
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
  }
}

function ReadableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});

Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = { hasUnpiped: false };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, unpipeInfo);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this, unpipeInfo);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], self.emit.bind(self, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./_stream_duplex":16,"./internal/streams/BufferList":21,"./internal/streams/destroy":22,"./internal/streams/stream":23,"_process":14,"core-util-is":6,"events":7,"inherits":9,"isarray":11,"process-nextick-args":13,"safe-buffer":29,"string_decoder/":24,"util":3}],19:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

'use strict';

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) {
    return stream.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er, data) {
      done(stream, er, data);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  var _this = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
    _this.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data !== null && data !== undefined) stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}
},{"./_stream_duplex":16,"core-util-is":6,"inherits":9}],20:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

/*<replacement>*/

var processNextTick = require('process-nextick-args');
/*</replacement>*/

module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/
var Stream = require('./internal/streams/stream');
/*</replacement>*/

/*<replacement>*/
var Buffer = require('safe-buffer').Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/

var destroyImpl = require('./internal/streams/destroy');

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;

    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = _isUint8Array(chunk) && !state.objectMode;

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    processNextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    processNextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      stream.emit('error', err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      processNextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }
  if (state.corkedRequestsFree) {
    state.corkedRequestsFree.next = corkReq;
  } else {
    state.corkedRequestsFree = corkReq;
  }
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function () {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});

Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./_stream_duplex":16,"./internal/streams/destroy":22,"./internal/streams/stream":23,"_process":14,"core-util-is":6,"inherits":9,"process-nextick-args":13,"safe-buffer":29,"util-deprecate":31}],21:[function(require,module,exports){
'use strict';

/*<replacement>*/

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = require('safe-buffer').Buffer;
/*</replacement>*/

function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function push(v) {
    var entry = { data: v, next: null };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function unshift(v) {
    var entry = { data: v, next: this.head };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;
    while (p = p.next) {
      ret += s + p.data;
    }return ret;
  };

  BufferList.prototype.concat = function concat(n) {
    if (this.length === 0) return Buffer.alloc(0);
    if (this.length === 1) return this.head.data;
    var ret = Buffer.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;
    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }
    return ret;
  };

  return BufferList;
}();
},{"safe-buffer":29}],22:[function(require,module,exports){
'use strict';

/*<replacement>*/

var processNextTick = require('process-nextick-args');
/*</replacement>*/

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      processNextTick(emitErrorNT, this, err);
    }
    return;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      processNextTick(emitErrorNT, _this, err);
      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy
};
},{"process-nextick-args":13}],23:[function(require,module,exports){
module.exports = require('events').EventEmitter;

},{"events":7}],24:[function(require,module,exports){
'use strict';

var Buffer = require('safe-buffer').Buffer;

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return -1;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// UTF-8 replacement characters ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd'.repeat(p);
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd'.repeat(p + 1);
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd'.repeat(p + 2);
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character for each buffered byte of a (partial)
// character needs to be added to the output.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd'.repeat(this.lastTotal - this.lastNeed);
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}
},{"safe-buffer":29}],25:[function(require,module,exports){
module.exports = require('./readable').PassThrough

},{"./readable":26}],26:[function(require,module,exports){
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":16,"./lib/_stream_passthrough.js":17,"./lib/_stream_readable.js":18,"./lib/_stream_transform.js":19,"./lib/_stream_writable.js":20}],27:[function(require,module,exports){
module.exports = require('./readable').Transform

},{"./readable":26}],28:[function(require,module,exports){
module.exports = require('./lib/_stream_writable.js');

},{"./lib/_stream_writable.js":20}],29:[function(require,module,exports){
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

},{"buffer":5}],30:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":7,"inherits":9,"readable-stream/duplex.js":15,"readable-stream/passthrough.js":25,"readable-stream/readable.js":26,"readable-stream/transform.js":27,"readable-stream/writable.js":28}],31:[function(require,module,exports){
(function (global){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],32:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],33:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],34:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":33,"_process":14,"inherits":32}],35:[function(require,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('node-event-emitter');
var DiyaSelector = require('./DiyaSelector.js').DiyaSelector;

var PROPERTIES_CHANGED_SIGNAL = 'org.freedesktop.DBus.Properties.PropertiesChanged';

DiyaSelector.prototype.dbusObject = function (service, path, partialObject) {
	var _this = this;

	var objects = [];

	this.each(function (peerId) {
		var store = _this._connection.store.get(peerId);
		if (store.get('dbus') == null) {
			store.set('dbus', new Map());
		}
		var dbus = store.get('dbus');

		if (dbus.get(service) == null) {
			dbus.set(service, new Map());
		}
		var dbusService = dbus.get(service);

		var object = dbusService.get(path);
		if (object == null) {
			object = new DBusObjectHandler(_this._connection._d1inst, peerId, service, path);
			dbusService.set(path, object);
			//delete dbus object when no one uses it anymore
			object.once('release', function () {
				return dbusService.delete(path);
			});
		}

		object.importPartialObject(partialObject);

		objects.push(object);
	});

	return objects;
};

var DBusObjectHandler = function (_EventEmitter) {
	_inherits(DBusObjectHandler, _EventEmitter);

	function DBusObjectHandler(d1inst, peerId, service, path) {
		_classCallCheck(this, DBusObjectHandler);

		var _this2 = _possibleConstructorReturn(this, (DBusObjectHandler.__proto__ || Object.getPrototypeOf(DBusObjectHandler)).call(this));

		_this2.objPath = path;
		_this2.service = service;
		_this2._d1inst = d1inst;
		_this2._peerId = peerId;

		_this2._propertiesChangedCallback = null;
		_this2._propertiesChangedWatchers = new Set();

		_this2._signalHandlers = new Map();

		_this2._getAllDone = {};
		return _this2;
	}

	_createClass(DBusObjectHandler, [{
		key: 'importPartialObject',
		value: function importPartialObject(partialObject) {
			if (partialObject == null) {
				return;
			}

			for (var iface in partialObject) {
				this._onPropertiesChanged([iface, partialObject[iface], []]);
			}
		}
	}, {
		key: 'onSignal',
		value: function onSignal(signal, callback) {
			var _this3 = this;

			var signalHandler = this._signalHandlers.get(signal);

			//if no signalHandler is registered for this signal,
			//register one, and do the actual subscription to remote
			//server
			if (signalHandler == null) {
				var _extractIface2 = this._extractIface(signal),
				    _extractIface3 = _slicedToArray(_extractIface2, 2),
				    iface = _extractIface3[0],
				    member = _extractIface3[1];

				signalHandler = this._d1inst(this._peerId).subscribe({
					service: this.service,
					func: member,
					obj: {
						interface: iface,
						path: this.objPath
					}
				}, function (peerId, err, data) {
					//notify clients when a signal is received
					_this3.emit(signal, err != null ? err : data);
				});

				this._signalHandlers.set(signal, signalHandler);
			}

			this.on(signal, callback);
		}
	}, {
		key: 'removeSignalListener',
		value: function removeSignalListener(signal, callback) {
			this.removeListener(signal, callback);

			//if there are other listeners on this signal, do noting
			if (this.listeners(signal).length > 0) {
				return;
			}

			//else, try to close the subscription to that signal
			var signalHandler = this._signalHandlers.get(signal);
			if (signalHandler == null) {
				return;
			}

			signalHandler.close();
			this._signalHandlers.delete(signal);
		}
	}, {
		key: 'watchProperties',
		value: function watchProperties(context) {
			var _this4 = this;

			if (this._propertiesChangedCallback == null) {
				this._propertiesChangedCallback = function (data) {
					return _this4._onPropertiesChanged(data);
				};
				this.onSignal(PROPERTIES_CHANGED_SIGNAL, this._propertiesChangedCallback);
			}

			this._propertiesChangedWatchers.add(context);
		}
	}, {
		key: 'unwatchProperties',
		value: function unwatchProperties(context) {
			this._propertiesChangedWatchers.delete(context);

			//if no one listen for properties, remove listener on property changes (object's properties will not be updated anymore)
			if (this._propertiesChangedWatchers.size <= 0 && this._propertiesChangedCallback != null) {
				this.removeSignalListener(PROPERTIES_CHANGED_SIGNAL, this._propertiesChangedCallback);
				this._propertiesChangedCallback = null;
			}
		}
	}, {
		key: 'call',
		value: function call(method, args, callback) {
			var iface = void 0;

			var _extractIface4 = this._extractIface(method);

			var _extractIface5 = _slicedToArray(_extractIface4, 2);

			iface = _extractIface5[0];
			method = _extractIface5[1];


			this._d1inst(this._peerId).request({
				service: this.service,
				func: method,
				obj: {
					path: this.objPath,
					interface: iface
				},
				data: args
			}, callback);
		}
	}, {
		key: 'get',
		value: function get(iface, propName) {
			var _this5 = this;

			this.call('org.freedesktop.DBus.Properties.Get', {
				interface: iface, //systemd devs are fucktard that don't follow their own fucking standard !
				interface_name: iface,
				property: propName
			}, function (peerId, err, data) {
				if (err) {
					//TODO : handle error
					console.error(err);
				} else {
					var res = {};
					res[propName] = data;
					_this5._onGetAll(iface, res);
				}
			});
		}
	}, {
		key: 'getAll',
		value: function getAll(iface, force) {
			var _this6 = this;

			//by default, prevent one to run get all more than once (that shouldn't be useful if PropertiesChanged does its job
			if (!force && this._getAllDone[iface]) {
				return;
			}
			this._getAllDone[iface] = true;

			this.call('org.freedesktop.DBus.Properties.GetAll', {
				interface: iface, //systemd devs are fucktard that don't follow their own fucking standard !
				interface_name: iface
			}, function (peerId, err, data) {
				if (err) {
					//TODO : handle error
					console.error(err);
				} else {
					_this6._onGetAll(iface, data);
				}
			});
		}
	}, {
		key: '_onGetAll',
		value: function _onGetAll(iface, data) {
			if (data == null) {
				return;
			}

			this._onPropertiesChanged([iface, data, []]);
		}
	}, {
		key: '_onPropertiesChanged',
		value: function _onPropertiesChanged(data) {
			var _this7 = this;

			if (!Array.isArray(data) || data.length !== 3) {
				return;
			}

			var iface = data[0];
			var changedProperties = data[1];
			var invalidatedProperties = data[2];

			var simpleIface = iface.split('.');
			simpleIface = simpleIface[simpleIface.length - 1];

			if (this[simpleIface] == null) {
				this[simpleIface] = {};
			}

			for (var propName in changedProperties) {
				this[simpleIface][propName] = changedProperties[propName];
			}

			invalidatedProperties.forEach(function (propName) {
				_this7[simpleIface][propName] = null;
			});

			this.emit('properties-changed', simpleIface, changedProperties, invalidatedProperties);
		}
	}, {
		key: '_extractIface',
		value: function _extractIface(member) {
			var iface = member.split('.');
			member = iface[iface.length - 1];
			iface.pop();
			iface = iface.join('.');

			return [iface, member];
		}
	}]);

	return DBusObjectHandler;
}(EventEmitter);

},{"./DiyaSelector.js":37,"node-event-emitter":12}],36:[function(require,module,exports){
(function (Buffer){
'use strict';

var isBrowser = !(typeof window === 'undefined');
var UNIXSocketHandler = void 0;
if (!isBrowser) {
	var Q = require('q');
	UNIXSocketHandler = require('./UNIXSocketHandler');
} else {
	var Q = window.Q;
}

var EventEmitter = require('node-event-emitter');
var inherits = require('inherits');
var DiyaSocket = require('./DiyaSocket');

//////////////////////////////////////////////////////////////
/////////////////// Logging utility methods //////////////////
//////////////////////////////////////////////////////////////

var DEBUG = false;
var Logger = {
	log: function log(message) {
		if (DEBUG) console.log(message);
	},

	error: function error(message) {
		if (DEBUG) console.error(message);
	}
};

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////


function DiyaNode() {
	EventEmitter.call(this);

	this._user = null;
	this._authenticated = null;
	this._pass = null;

	this._status = 'closed';
	this._addr = null;
	this._socket = null;
	this._nextId = 0;
	this._connectionDeferred = null;
	this._disconnectionDeferred = null;
	this._pendingMessages = [];
	this._peers = [];
	this._reconnectTimeout = 1000;
	this._connectTimeout = 5000;
	this.store = new Map();
	this._diyaSocket = new Map();
}
inherits(DiyaNode, EventEmitter);

////////////////////////////////////////////////////
////////////////// Public API //////////////////////
////////////////////////////////////////////////////

DiyaNode.prototype.user = function (user) {
	if (user) this._user = user;else return this._user;
};
DiyaNode.prototype.authenticated = function (authenticated) {
	if (authenticated !== undefined) this._authenticated = authenticated;else return this._authenticated;
};
DiyaNode.prototype.pass = function (pass) {
	if (pass !== undefined) this._pass = pass;else return this._pass;
};
DiyaNode.prototype.addr = function () {
	return this._addr;
};
DiyaNode.prototype.peers = function () {
	return this._peers;
};
DiyaNode.prototype.self = function () {
	return this._self;
};
DiyaNode.prototype.setSecured = function (bSecured) {
	this._secured = bSecured !== false;
};
DiyaNode.prototype.setWSocket = function (WSocket) {
	this._WSocket = WSocket;
};

/** @return {Promise<String>} the connected peer name */
DiyaNode.prototype.connect = function (addr, WSocket) {
	var _this = this;

	this.bDontReconnect = false;

	// Handle local clients on UNIX sockets
	if (addr.startsWith('unix://')) {
		// If we've trying to connect to the same address we're already connected to
		if (this._addr === addr) {
			console.log('[SDK/DiyaNode] Address is identical to our address...');
			if (this._status === 'opened') {
				console.log('[SDK/DiyaNode] ... and the connection is still openened, returning it.');
				return Q(this.self());
			} else if (this._connectionDeferred && this._connectionDeferred.promise && this._connectionDeferred.promise.isPending()) {
				console.log('[SDK/DiyaNode]... and the connection is pending, so returning the pending connection.');
				return this._connectionDeferred.promise;
			}
		}

		return this.close().then(function (_) {
			_this._addr = addr;
			_this._connectionDeferred = Q.defer();
			Logger.log('d1: connect to ' + _this._addr);
			var sock = new UNIXSocketHandler(_this._addr.substr('unix://'.length), _this._connectTimeout);

			if (!_this._socketHandler) _this._socketHandler = sock;

			_this._onopening();

			sock.on('open', function (_) {
				if (_this._socketHandler !== sock) {
					console.log('[SDK/DiyaNode] Socket responded but already connected to a different one');
					return;
				}
				_this._status = 'opened';
				_this._setupPingResponse();
			});

			sock.on('closing', function (_) {
				if (_this._socketHandler !== sock) return;
				_this._onclosing();
			});

			sock.on('close', function (_) {
				if (_this._socketHandler !== sock) return;
				_this._socketHandler = null;
				_this._status = 'closed';
				_this._stopPingResponse();
				_this._onclose();

				if (_this._connectionDeferred) {
					_this._connectionDeferred.reject("closed");
					_this._connectionDeferred = null;
				}
			});

			sock.on('error', function (error) {
				if (_this._socketHandler !== sock) return;
				_this._onerror(error);
			});

			sock.on('timeout', function (_) {
				if (_this._socketHandler !== sock) return;
				_this._socketHandler = null;
				_this._status = 'closed';
				if (_this._connectionDeferred) {
					_this._connectionDeferred.reject("closed");
					_this._connectionDeferred = null;
				}
			});

			sock.on('message', _this._onmessage.bind(_this));

			return _this._connectionDeferred.promise;
		});
	}

	if (WSocket !== undefined) this._WSocket = WSocket;else if (this._WSocket === undefined) this._WSocket = window.WebSocket;

	WSocket = this._WSocket;

	// Check and Format URI (FQDN)
	if (addr.startsWith("ws://") && this._secured) return Q.reject("Please use a secured connection (" + addr + ")");

	if (addr.startsWith("wss://") && this._secured === false) return Q.reject("Please use a non-secured connection (" + addr + ")");

	if (!addr.startsWith("ws://") && !addr.startsWith("wss://")) {
		if (this._secured) addr = "wss://" + addr;else addr = "ws://" + addr;
	}

	if (this._addr === addr) {
		if (this._status === 'opened') return Q(this.self());else if (this._connectionDeferred && this._connectionDeferred.promise && this._connectionDeferred.promise.isPending()) return this._connectionDeferred.promise;
	}

	return this.close().then(function (_) {
		_this._addr = addr;
		_this._connectionDeferred = Q.defer();
		Logger.log('d1: connect to ' + _this._addr);
		var sock = new SocketHandler(WSocket, _this._addr, _this._connectTimeout);

		if (!_this._socketHandler) _this._socketHandler = sock;

		_this._onopening();

		sock.on('open', function (_) {
			if (_this._socketHandler !== sock) {
				console.log("[d1] Websocket responded but already connected to a different one");
				return;
			}
			_this._socketHandler = sock;
			_this._status = 'opened';
			_this._setupPingResponse();
		});

		sock.on('closing', function (_) {
			if (_this._socketHandler !== sock) return;
			_this._onclosing();
		});

		sock.on('close', function (_) {
			if (_this._socketHandler !== sock) return;
			_this._socketHandler = null;
			_this._status = 'closed';
			_this._stopPingResponse();
			_this._onclose();

			if (_this._connectionDeferred) {
				_this._connectionDeferred.reject("closed");
				_this._connectionDeferred = null;
			}
		});

		sock.on('error', function (error) {
			if (_this._socketHandler !== sock) return;
			_this._onerror(error);
		});

		sock.on('timeout', function (_) {
			if (_this._socketHandler !== sock) return;
			_this._socketHandler = null;
			_this._status = 'closed';
			if (_this._connectionDeferred) {
				_this._connectionDeferred.reject("closed");
				_this._connectionDeferred = null;
			}
		});

		sock.on('message', _this._onmessage.bind(_this));

		return _this._connectionDeferred.promise;
	});
};

DiyaNode.prototype.disconnect = function () {
	this.bDontReconnect = true;
	return this.close();
};

DiyaNode.prototype.close = function () {
	this._stopPingResponse();
	if (this._socketHandler) return this._socketHandler.close();else return Q();
};

DiyaNode.prototype.isConnected = function () {
	return this._socketHandler && this._socketHandler.isConnected();
};

DiyaNode.prototype.request = function (params, callback, timeout, options) {
	var that = this;
	if (!options) options = {};

	if (params.constructor === String) {
		var _params = params.split(".");
		if (_params.length != 2) throw 'MalformedRequest';
		params = { service: _params[0], func: _params[1] };
	}

	if (!params.service) {
		Logger.error('No service defined for request !');
		return false;
	}

	var message = this._createMessage(params, "Request");
	this._appendMessage(message, callback);
	if (typeof options.callback_partial === 'function') this._pendingMessages[message.id].callback_partial = options.callback_partial;
	message.options = options;

	if (!isNaN(timeout) && timeout > 0) {
		setTimeout(function () {
			var handler = that._removeMessage(message.id);
			if (handler) that._notifyListener(handler, 'Timeout exceeded (' + timeout + 'ms) !');
		}, timeout);
	}

	if (!this._send(message)) {
		this._removeMessage(message.id);
		console.error('Cannot send request !');
		return false;
	}

	return true;
};

DiyaNode.prototype.subscribe = function (params, callback) {
	if (params.constructor === String) {
		var _params = params.split(".");
		if (_params.length != 2) throw 'MalformedRequest';
		params = { service: _params[0], func: _params[1] };
	}

	if (!params.service) {
		Logger.error('No service defined for subscription !');
		return -1;
	}

	var message = this._createMessage(params, "Subscription");
	this._appendMessage(message, callback);

	if (!this._send(message)) {
		this._removeMessage(message.id);
		Logger.error('Cannot send subscription !');
		return -1;
	}

	return message.id;
};

DiyaNode.prototype.openSocket = function (d1inst, params, callback) {
	this._diyaSocket.set(params.socketId, new DiyaSocket(d1inst, params));
	this._diyaSocket.get(params.socketId).subscribeSocketClosed(params.socketId);
	if (typeof callback === 'function') callback(this._diyaSocket.get(params.socketId));
};

DiyaNode.prototype.onSocketClosed = function (socketId) {
	if (this._diyaSocket.has(socketId)) {
		this._diyaSocket.get(socketId).emit('close');
		this._diyaSocket.delete(socketId);
	}
};

DiyaNode.prototype.sendSocketData = function (params) {
	var message = this._createMessage(params, "SocketClientData");
	if (!this._send(message)) {
		throw new Error('Cannot send socket!');
	}
	return message.id;
};

DiyaNode.prototype.unsubscribe = function (subId) {
	if (this._pendingMessages[subId] && this._pendingMessages[subId].type === "Subscription") {
		var subscription = this._removeMessage(subId);

		var message = this._createMessage({
			target: subscription.target,
			data: {
				subId: subId
			}
		}, "Unsubscribe");

		if (!this._send(message)) {
			Logger.error('Cannot send unsubscribe !');
			return false;
		}

		return true;
	}
	return false;
};

///////////////////////////////////////////////////////////
//////////////////// Internal methods /////////////////////
///////////////////////////////////////////////////////////

DiyaNode.prototype._appendMessage = function (message, callback) {
	this._pendingMessages[message.id] = {
		callback: callback,
		type: message.type,
		target: message.target
	};
};

DiyaNode.prototype._removeMessage = function (messageId) {
	var handler = this._pendingMessages[messageId];
	if (handler) {
		delete this._pendingMessages[messageId];
		return handler;
	} else {
		return null;
	}
};

DiyaNode.prototype._clearMessages = function (err, data) {
	for (var messageId in this._pendingMessages) {
		var handler = this._removeMessage(messageId);
		this._notifyListener(handler, err, data);
	}
};

DiyaNode.prototype._clearPeers = function () {
	while (this._peers.length) {
		var peer = this._peers.pop();
		this.store.delete(peer);
		this.emit('peer-disconnected', peer);
	}
};

DiyaNode.prototype._getMessageHandler = function (messageId) {
	var handler = this._pendingMessages[messageId];
	return handler ? handler : null;
};

DiyaNode.prototype._notifyListener = function (handler, error, data) {
	if (handler && typeof handler.callback === 'function') {
		error = error ? error : null;
		data = data ? data : null;
		try {
			handler.callback(error, data);
		} catch (e) {
			console.log('[Error in Request callback] ' + e.stack ? e.stack : e);
		}
	}
};

DiyaNode.prototype._send = function (message) {
	return this._socketHandler && this._socketHandler.send(message);
};

DiyaNode.prototype._setupPingResponse = function () {
	var that = this;

	this._pingTimeout = 15000;
	this._lastPing = new Date().getTime();

	function checkPing() {
		var curTime = new Date().getTime();
		if (curTime - that._lastPing > that._pingTimeout) {
			that._forceClose();
			Logger.log("d1:  timed out!");
		} else {
			Logger.log("d1: last ping ok");
			that._pingSetTimeoutId = setTimeout(checkPing, Math.round(that._pingTimeout / 2.1));
		}
	}

	checkPing();
};

DiyaNode.prototype._stopPingResponse = function () {
	clearTimeout(this._pingSetTimeoutId);
};

DiyaNode.prototype._forceClose = function () {
	this._socketHandler.close();
	this._onclose();
};

///////////////////////////////////////////////////////////////
/////////////////// Socket event handlers /////////////////////
///////////////////////////////////////////////////////////////


DiyaNode.prototype._onmessage = function (message) {
	if (message.type === "SocketServerData") this._handleSocketServerData(message);
	if (isNaN(message.id)) return this._handleInternalMessage(message);
	var handler = this._getMessageHandler(message.id);
	if (!handler) return;
	switch (handler.type) {
		case "Request":
			this._handleRequest(handler, message);
			break;
		case "Subscription":
			this._handleSubscription(handler, message);
			break;
	}
};

DiyaNode.prototype._onopening = function () {
	this.emit('opening', this);
};

DiyaNode.prototype._onerror = function (error) {
	this.emit('error', new Error(error));
};

DiyaNode.prototype._onclosing = function () {
	this.emit('closing', this);
};

DiyaNode.prototype._onclose = function () {
	var that = this;

	this._clearMessages('PeerDisconnected');
	this._clearPeers();

	if (!this.bDontReconnect) {
		Logger.log('d1: connection lost, try reconnecting');
		setTimeout(function () {
			that.connect(that._addr, that._WSocket).catch(function (err) {});
		}, that._reconnectTimeout);
	}
	this.emit('close', this._addr);
};

/////////////////////////////////////////////////////////////
/////////////// Protocol event handlers /////////////////////
/////////////////////////////////////////////////////////////

DiyaNode.prototype._handleInternalMessage = function (message) {
	switch (message.type) {
		case "PeerConnected":
			this._handlePeerConnected(message);
			break;
		case "PeerDisconnected":
			this._handlePeerDisconnected(message);
			break;
		case "Handshake":
			this._handleHandshake(message);
			break;
		case "Ping":
			this._handlePing(message);
			break;
	}
};

DiyaNode.prototype._handlePing = function (message) {
	message.type = "Pong";
	this._lastPing = new Date().getTime();
	this._send(message);
};

DiyaNode.prototype._handleHandshake = function (message) {

	if (message.peers === undefined || typeof message.self !== 'string') {
		Logger.error("Missing arguments for Handshake message, dropping...");
		return;
	}

	this._self = message.self;

	for (var i = 0; i < message.peers.length; i++) {
		this._peers.push(message.peers[i]);
		this.store.set(message.peers[i], new Map());
		this.emit('peer-connected', message.peers[i]);
	}

	this._connectionDeferred.resolve(this.self());
	this.emit('open', this._addr);
	this._status = 'opened';
	this._connectionDeferred = null;
};

DiyaNode.prototype._handlePeerConnected = function (message) {
	if (message.peerId === undefined) {
		Logger.error("Missing arguments for PeerConnected message, dropping...");
		return;
	}

	//Add peer to the list of reachable peers
	this._peers.push(message.peerId);
	this.store.set(message.peerId, new Map());

	this.emit('peer-connected', message.peerId);
};

DiyaNode.prototype._handlePeerDisconnected = function (message) {
	if (message.peerId === undefined) {
		Logger.error("Missing arguments for PeerDisconnected Message, dropping...");
		return;
	}

	//Remove peer from list of reachable peers
	for (var i = this._peers.length - 1; i >= 0; i--) {
		if (this._peers[i] === message.peerId) {
			this._peers.splice(i, 1);
			break;
		}
	}
	//remove associated store
	this.store.delete(message.peerId);

	//Go through all pending messages and notify the ones that are targeted
	//at the disconnected peer that it disconnected and therefore the command
	//cannot be fulfilled
	for (var messageId in this._pendingMessages) {
		var handler = this._getMessageHandler(messageId);
		if (handler && handler.target === message.peerId) {
			this._removeMessage(messageId);
			this._notifyListener(handler, 'PeerDisconnected', null);
		}
	}

	this.emit('peer-disconnected', message.peerId);
};

DiyaNode.prototype._handleRequest = function (handler, message) {
	if (message.type === 'PartialAnswer') {
		if (typeof this._pendingMessages[message.id].callback_partial === 'function') {
			var error = message.error ? message.error : null;
			var data = message.data ? message.data : null;
			this._pendingMessages[message.id].callback_partial(error, data);
		}
	} else {

		this._removeMessage(message.id);
		this._notifyListener(handler, message.error, message.data);
	}
};

DiyaNode.prototype._handleSubscription = function (handler, message) {
	//remove subscription if it was closed from node
	if (message.result === "closed") {
		this._removeMessage(message.id);
		message.error = 'SubscriptionClosed';
	}
	this._notifyListener(handler, message.error, message.data ? message.data : null);
};

DiyaNode.prototype._handleSocketServerData = function (message) {
	this._diyaSocket.get(message.data.socketId).push(new Buffer(message.data.buffer, 'base64'));
};

///////////////////
// SocketHandler //
///////////////////

function SocketHandler(WSocket, addr, timeout) {
	var that = this;
	this.addr = addr;

	if (WSocket) this._WSocket = WSocket;else if (!this._WSocket) this._WSocket = window.WebSocket;
	WSocket = this._WSocket;

	this._status = 'opening';

	try {
		this._socket = addr.indexOf("wss://") === 0 ? new WSocket(addr, undefined, { rejectUnauthorized: false }) : new WSocket(addr);

		this._socketOpenCallback = this._onopen.bind(this);
		this._socketCloseCallback = this._onclose.bind(this);
		this._socketMessageCallback = this._onmessage.bind(this);
		this._socketErrorCallback = this._onerror.bind(this);

		this._socket.addEventListener('open', this._socketOpenCallback);
		this._socket.addEventListener('close', this._socketCloseCallback);
		this._socket.addEventListener('message', this._socketMessageCallback);
		this._socket.addEventListener('error', this._socketErrorCallback);

		this._socket.addEventListener('error', function (err) {
			Logger.error("[WS] error : " + err.toString());
			that._socket.close();
		});

		setTimeout(function () {
			if (that._status === 'opened') return;
			if (that._status !== 'closed') {
				Logger.log('d1: ' + that.addr + ' timed out while connecting');
				that.close();
				that.emit('timeout', that._socket);
			}
		}, timeout);
	} catch (e) {
		Logger.error(e.stack);
		that.close();
		throw e;
	}
};
inherits(SocketHandler, EventEmitter);

SocketHandler.prototype.close = function () {
	if (this._disconnectionDeferred && this._disconnectionDeferred.promise) return this._disconnectionDeferred.promise;
	this._disconnectionDeferred = Q.defer();
	this._status = 'closing';
	this.emit('closing', this._socket);
	if (this._socket) this._socket.close();
	return this._disconnectionDeferred.promise;
};

SocketHandler.prototype.send = function (message) {
	try {
		var data = JSON.stringify(message);
	} catch (err) {
		console.error('Cannot serialize message');
		return false;
	}

	try {
		this._socket.send(data);
	} catch (err) {
		console.error('Cannot send message');
		console.error(err);
		return false;
	}

	return true;
};

SocketHandler.prototype.isConnected = function () {
	return this._socket.readyState == this._WSocket.OPEN && this._status === 'opened';
};

SocketHandler.prototype._onopen = function () {
	this._status = 'opened';
	this.emit('open', this._socket);
};

SocketHandler.prototype._onclose = function (evt) {
	this._status = 'closed';
	this.unregisterCallbacks();
	this.emit('close', this._socket);
	if (this._disconnectionDeferred && this._disconnectionDeferred.promise) this._disconnectionDeferred.resolve();
};

SocketHandler.prototype._onmessage = function (evt) {
	try {
		var message = JSON.parse(evt.data);
		this.emit('message', message);
	} catch (err) {
		Logger.error("[WS] cannot parse message, dropping...");
		throw err;
	}
};

SocketHandler.prototype._onerror = function (evt) {
	this.emit('error', evt);
};

SocketHandler.prototype.unregisterCallbacks = function () {
	if (this._socket && typeof this._socket.removeEventListener === 'function') {
		this._socket.removeEventListener('open', this._socketOpenCallback);
		this._socket.removeEventListener('close', this._socketCloseCallback);
		this._socket.removeEventListener('message', this._socketMessageCallback);
	} else if (this._socket && typeof this._socket.removeAllListeners === 'function') {
		this._socket.removeAllListeners();
	}
};

///////////////////////////////////////////////////////////////
////////////////////// Utility methods ////////////////////////
///////////////////////////////////////////////////////////////

DiyaNode.prototype._createMessage = function (params, type) {
	if (!params || !type || type !== "Request" && type !== "Subscription" && type !== "Unsubscribe" && type !== "SocketClientData") {
		return null;
	}

	return {
		type: type,
		id: this._generateId(),
		service: params.service,
		target: params.target,
		func: params.func,
		obj: params.obj,
		data: params.data,
		bus: params.bus
	};
};

DiyaNode.prototype._generateId = function () {
	var id = this._nextId;
	this._nextId++;
	return id;
};

module.exports = DiyaNode;

}).call(this,require("buffer").Buffer)

},{"./DiyaSocket":38,"./UNIXSocketHandler":39,"buffer":5,"inherits":9,"node-event-emitter":12,"q":undefined}],37:[function(require,module,exports){
'use strict';

var isBrowser = !(typeof window === 'undefined');
if (!isBrowser) {
	var Q = require('q');
} else {
	var Q = window.Q;
}
var EventEmitter = require('node-event-emitter');
var inherits = require('inherits');

var DiyaNode = require('./DiyaNode');

var IP_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

//////////////
//  D1 API  //
//////////////


function newInstance() {

	var connection = new DiyaNode();

	var d1inst = function d1inst(selector) {
		return new DiyaSelector(selector, connection);
	};

	connection._d1inst = d1inst;

	d1inst.DiyaNode = DiyaNode;
	d1inst.DiyaSelector = DiyaSelector;

	d1inst.connect = function (addr, WSocket) {
		return connection.connect(addr, WSocket);
	};

	d1inst.disconnect = function () {
		return connection.disconnect();
	};

	d1inst.isConnected = function () {
		return connection.isConnected();
	};
	d1inst.peers = function () {
		return connection.peers();
	};
	d1inst.self = function () {
		return connection.self();
	};
	d1inst.addr = function () {
		return connection.addr();
	};
	d1inst.user = function () {
		return connection.user();
	};
	d1inst.pass = function () {
		return connection.pass();
	};
	d1inst.isAuthenticated = function () {
		return connection.authenticated();
	};

	d1inst.parsePeer = function (addrStr) {
		var peer = {};

		// <nothing> -> wss://localhost/api
		if (!addrStr || addrStr === "") {
			peer.addr = "wss://localhost/api";
			peer.addrNet = "wss://localhost/net";
		}
		// 1234 -> ws://localhost:1234
		else if (/^[0-9]*$/.test(addrStr)) {
				peer.addr = "ws://localhost:" + addrStr;
			}
			// 'localhost' alone -> UNIX socket /var/run/diya/diya-node.sock
			else if (addrStr === 'localhost') {
					peer.addr = 'unix:///var/run/diya/diya-node.sock';
				}
				// 10.42.0.1 -> wss://10.42.0.1/api
				//          -> wss://10.24.0.1/net
				else if (IP_REGEX.test(addrStr)) {
						peer.addr = "wss://" + addrStr + "/api";
						peer.addrNet = "wss://" + addrStr + "/net";
					}
					// 10.42.0.1:1234 -> ws://10.42.0.1:1234
					else if (IP_REGEX.test(addrStr.split(':')[0]) && /^[0-9]*$/.test(addrStr.split(':')[1])) {
							peer.addr = "ws://" + addrStr;
						}
						// wss://someaddress.com/stuff -> wss://someaddress.com/stuff
						// ws://someaddress.com/stuff -> ws://someaddress.com/stuff
						else if (addrStr.indexOf("wss://") === 0 || addrStr.indexOf("ws://") === 0) {
								peer.addr = addrStr;
							}
							// somedomain/somesite -> "wss://somedomain/somesite/api
							//                     -> "wss://somedomain/somesite/net
							//                     -> somesite
							else if (addrStr.split('/').length === 2) {
									peer.addr = "wss://" + addrStr + '/api';
									peer.addrNet = "wss://" + addrStr + '/net';
									peer.name = addrStr.split('/')[1];
								}
								// somedomain/somesite/api -> "wss://somedomain/somesite/api"
								//                         -> "wss://somedomain/somesite/net"
								//                         -> somesite
								else if (addrStr.split('/').length === 3 && addrStr.split('/')[2] === "api") {
										peer.addr = "wss://" + addrStr;
										peer.addrNet = "wss://" + addrStr.substr(0, addrStr.length - 4);
										peer.name = addrStr.split('/')[1];
									}
									// somesite -> "wss://partnering-cloud.com/somesite/api"
									//          -> "wss://partnering-cloud.com/somesite/net"
									//          -> somesite
									else {
											peer.addr = "wss://partnering-cloud.com/" + addrStr + "/api";
											peer.addrNet = "wss://partnering-cloud.com/" + addrStr + "/net";
											peer.name = addrStr;
										}

		return peer;
	};

	/** Try to connect to the given servers list in the list order, until finding an available one */
	d1inst.tryConnect = function (servers, WSocket) {
		var deferred = Q.defer();
		function tc(i) {
			d1inst.connect(servers[i], WSocket).then(function (e) {
				return deferred.resolve(servers[i]);
			}).catch(function (e) {
				d1inst.disconnect().then(function () {
					i++;
					if (i < servers.length) setTimeout(function () {
						tc(i);
					}, 100);else return deferred.reject("Timeout");
				});
			});
		}
		tc(0);
		return deferred.promise;
	};

	d1inst.currentServer = function () {
		return connection._addr;
	};

	d1inst.on = function (event, callback) {
		connection.on(event, callback);
		return d1inst;
	};

	d1inst.removeListener = function (event, callback) {
		connection.removeListener(event, callback);
		return d1inst;
	};

	/** Shorthand function to connect and login with the given (user,password) */
	d1inst.connectAsUser = function (ip, user, password, WSocket) {
		return d1inst.connect(ip, WSocket).then(function () {
			return d1inst("#self").auth(user, password);
		});
	};

	d1inst.deauthenticate = function () {
		connection.authenticated(false);connection.user(null);connection.pass(null);
	};
	d1inst.setSecured = function (bSecured) {
		connection.setSecured(bSecured);
	};
	d1inst.isSecured = function () {
		return connection._secured;
	};
	d1inst.setWSocket = function (WSocket) {
		connection.setWSocket(WSocket);
	};

	return d1inst;
}

var d1 = newInstance();
d1.newInstance = newInstance;

//////////////////
// DiyaSelector //
//////////////////

function DiyaSelector(selector, connection) {
	EventEmitter.call(this);

	this._connection = connection;
	this._selector = selector;
	this._listenerCount = 0;
	this._listenCallback = null;
	this._callbackAttached = false;
}
inherits(DiyaSelector, EventEmitter);

//////////////////////////////////////////////////////////
////////////////////// Public API ////////////////////////
//////////////////////////////////////////////////////////

DiyaSelector.prototype.select = function () {
	return this._select();
};

/**
 * Apply callback cb to each selected peer. Peers are selected
 * according to the rule 'selector' given to constructor. Selector can
 * be a peerId, a regEx for peerIds of an array of peerIds.
 * @params 	cb		callback to be applied
 * @return 	this 	<DiyaSelector>
 */
DiyaSelector.prototype.each = function (cb) {
	var peers = this._select();
	for (var i = 0; i < peers.length; i++) {
		cb.bind(this)(peers[i]);
	}return this;
};

/**
 * Send request to selected peers ( see each() ) through the current connection (DiyaNode).
 * @param {String | Object} params : can be service.function or {service:service, func:function, ...}
 */
DiyaSelector.prototype.request = function (params, callback, timeout, options) {
	if (!this._connection) return this;
	if (!options) options = {};
	if (params.constructor === String) {
		var _params = params.split(".");
		if (_params.length != 2) throw 'MalformedRequest';
		params = { service: _params[0], func: _params[1] };
	}

	var nbAnswers = 0;
	var nbExpected = this._select().length;
	return this.each(function (peerId) {
		params.target = peerId;

		var opts = {};
		for (var i in options) {
			opts[i] = options[i];
		}if (typeof opts.callback_partial === 'function') opts.callback_partial = function (err, data) {
			options.callback_partial(peerId, err, data);
		};

		this._connection.request(params, function (err, data) {
			if (typeof callback === 'function') callback(peerId, err, data);
			nbAnswers++;
			if (nbAnswers == nbExpected && options.bNotifyWhenFinished) callback(null, err, "##END##"); // TODO : Find a better way to notify request END !!
		}, timeout, opts);
	});
};

// IMPORTANT !!! By 30/11/15, this method doesn't return 'this' anymore, but a Subscription object instead
/* @param {String | Object} params : can be 'service.function' or {service:service, func:function, ...} */
DiyaSelector.prototype.subscribe = function (params, callback, options) {
	if (params.constructor === String) {
		var _params = params.split(".");
		if (_params.length != 2) throw 'MalformedSubscription';
		params = { service: _params[0], func: _params[1] };
	}

	return new Subscription(this, params, callback, options);
};

// IMPORTANT !!! BY 30/11/15, this method doesn't take subIds as input anymore.
// Please provide a subscription instead !
DiyaSelector.prototype.unsubscribe = function (subscription) {
	if (Array.isArray(subscription) || !subscription.close) return this.__old_deprecated_unsubscribe(subscription);
	return subscription.close();
};

DiyaSelector.prototype.auth = function (user, password, callback, timeout) {
	var that = this;
	if (typeof callback === 'function') callback = callback.bind(this);

	var deferred = Q.defer();

	this.request({
		service: 'auth',
		func: 'Authenticate',
		data: {
			user: user, // DEPRECATED, kept for now for backward compatiblity (will be dropped)
			username: user, // New syntax since switching to DBus
			password: password
		}
	}, function (peerId, err, data) {

		if (err === 'ServiceNotFound') {
			if (typeof callback === 'function') callback(peerId, true);else deferred.reject(err);
			return;
		}

		// data.authenticated is DEPRECATED, kept for backward compatibility
		if (!err && data && (data === true || data.authenticated === true)) {
			that._connection.authenticated(true);
			that._connection.user(user);
			that._connection.pass(password);
			if (typeof callback === 'function') callback(peerId, true);else deferred.resolve();
		} else {
			that._connection.authenticated(false);
			if (typeof callback === 'function') callback(peerId, false);else deferred.reject('AccessDenied');
		}
	}, timeout);

	return deferred.promise;
};

DiyaSelector.prototype.openSocket = function (params, callback) {
	var that = this;

	if (typeof callback === 'function') callback = callback.bind(this);

	var socketName = params;

	this.request({
		service: 'socketHandler',
		func: 'OpenSocket',
		data: {
			socket_name: socketName
		}
	}, function (peerId, err, data) {
		if (err == null && data.socket_id != null) {
			params = {
				err: err,
				socketId: data.socket_id,
				socketName: socketName,
				target: peerId
			};
			that._connection.openSocket(that, params, function (diyaSocket) {
				if (typeof callback === 'function') callback(peerId, null, diyaSocket);
			});
		} else {
			if (typeof callback === 'function') callback(peerId, err, null);
		}
	});
};

DiyaSelector.prototype.sendSocketData = function (params) {
	return this.each(function (peerId) {
		params.target = peerId;
		this._connection.sendSocketData(params);
	});
};

DiyaSelector.prototype.onSocketClosed = function (socketId) {
	this._connection.onSocketClosed(socketId);
};

// Privates

DiyaSelector.prototype._select = function (selectorFunction) {
	var that = this;

	if (!this._connection) return [];
	return this._connection.peers().filter(function (peerId) {
		return that._match(that._selector, peerId);
	});
};

DiyaSelector.prototype._match = function (selector, str) {
	if (!selector) return false;
	if (selector === "#self") {
		return this._connection && str === this._connection.self();
	} else if (selector.not) return !this._match(selector.not, str);else if (selector.constructor.name === 'String') {
		return matchString(selector, str);
	} else if (selector.constructor.name === 'RegExp') {
		return matchRegExp(selector, str);
	} else if (Array.isArray(selector)) {
		return matchArray(selector, str);
	}
	return false;
};

function matchString(selector, str) {
	return selector === str;
}

function matchRegExp(selector, str) {
	return str.match(selector);
}

function matchArray(selector, str) {
	for (var i = 0; i < selector.length; i++) {
		if (selector[i] === str) return true;
	}
	return false;
}

// Overrides EventEmitter's behavior to proxy and filter events from the connection
DiyaSelector.prototype._on = DiyaSelector.prototype.on;
DiyaSelector.prototype.on = function (type, callback) {
	var that = this;
	callback.___DiyaSelector_hidden_wrapper = function (peerId) {
		if (that._match(that._selector, peerId)) that.emit(type, peerId);
	};
	this._connection.on(type, callback.___DiyaSelector_hidden_wrapper);
	var ret = this._on(type, callback);

	// Handle the specific case of "peer-connected" events, i.e., notify of already connected peers
	if (type === 'peer-connected' && this._connection.isConnected()) {
		var peers = this._connection.peers();
		for (var i = 0; i < peers.length; i++) {
			if (this._match(this._selector, peers[i])) callback(peers[i]);
		}
	}
	return ret;
};

// Overrides EventEmitter's behavior to proxy and filter events from the connection
DiyaSelector.prototype._removeListener = DiyaSelector.prototype.removeListener;
DiyaSelector.prototype.removeListener = function (type, callback) {
	if (callback.___DiyaSelector_hidden_wrapper) this._connection.removeListener(type, callback.___DiyaSelector_hidden_wrapper);
	this._removeListener(type, callback);
};

//////////////////
// SUBSCRIPTION //
//////////////////


/**
* Handles a subscription to some DiyaNode service for multiple nodes
* according to the given selector
*/
function Subscription(selector, params, callback, options) {
	var that = this;
	this.selector = selector;
	this.params = params;
	this.callback = callback;
	this.options = options;
	this.subIds = [];

	this.doSubscribe = function (peerId) {
		that.subIds.push(that._addSubscription(peerId));
		that.state = "open";
	};

	if (this.options && this.options.auto) {
		this.selector.on('peer-connected', this.doSubscribe);
	} else {
		this.selector.each(this.doSubscribe);
	}

	return this;
};

Subscription.prototype.close = function () {
	for (var i = 0; i < this.subIds.length; i++) {
		this.selector._connection.unsubscribe(this.subIds[i]);
	}
	this.subIds = [];
	this.selector.removeListener('peer-connected', this.doSubscribe);
	this.state = "closed";
};

Subscription.prototype._addSubscription = function (peerId) {
	var that = this;
	var params = {};
	for (var k in this.params) {
		params[k] = this.params[k];
	}params.target = peerId;
	var subId = this.selector._connection.subscribe(params, function (err, data) {
		that.callback(peerId, err, data);
	});
	if (this.options && Array.isArray(this.options.subIds)) this.options.subIds[peerId] = subId;
	return subId;
};

// Legacy --------------------------------------------


/** @deprecated  */
DiyaSelector.prototype.listen = function () {};

DiyaSelector.prototype.__old_deprecated_unsubscribe = function (subIds) {
	this.each(function (peerId) {
		var subId = subIds[peerId];
		if (subId) this._connection.unsubscribe(subId);
	});
	return this;
};

// -------------------------------------


module.exports = d1;

},{"./DiyaNode":36,"inherits":9,"node-event-emitter":12,"q":undefined}],38:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Transform = require('stream').Transform;

var DiyaSocket = function (_Transform) {
	_inherits(DiyaSocket, _Transform);

	function DiyaSocket(d1inst, params, options) {
		_classCallCheck(this, DiyaSocket);

		var _this = _possibleConstructorReturn(this, (DiyaSocket.__proto__ || Object.getPrototypeOf(DiyaSocket)).call(this, options));

		_this.d1inst = d1inst;
		_this.socketName = params.socketName;
		_this.socketId = params.socketId;
		_this.peerId = params.target;
		_this.flagSocketIsDead = false;
		_this.subscriptionSocketClosed = null;
		return _this;
	}

	_createClass(DiyaSocket, [{
		key: '_write',
		value: function _write(chunk, encoding, callback) {
			if (this.flagSocketIsDead === false) {
				var params = {
					data: {
						socketId: this.socketId,
						socketBuffer: chunk.toString('base64')
					}, target: this.peerId
				};
				this.d1inst.sendSocketData(params);
			}
			callback();
		}
	}, {
		key: 'disconnect',
		value: function disconnect() {
			var _this2 = this;

			if (this.flagSocketIsDead === false) {
				this.end();
				this.d1inst.request({
					service: 'socketHandler',
					func: 'DisconnectClient',
					data: {
						socket_id: this.socketId
					}
				}, function (peerId, err, data) {
					_this2.flagSocketIsDead = true;
				});
			}
		}
	}, {
		key: 'subscribeSocketClosed',
		value: function subscribeSocketClosed(openedSocketId) {
			var _this3 = this;

			this.subscriptionSocketClosed = this.d1inst.subscribe({
				service: 'SocketHandler',
				func: 'SocketIsClosed'
			}, function (peerId, err, data) {
				if (err != null || data == null) {
					console.error(err);
					_this3.disconnect();
					return;
				}

				if (data[0] !== openedSocketId) {
					return;
				}

				_this3.d1inst.onSocketClosed(data[0]);

				_this3.subscriptionSocketClosed.close();
				_this3.subscriptionSocketClosed = null;
				_this3.d1inst = null;
				_this3.socketName = null;
				_this3.socketId = null;
				_this3.peerId = null;
				_this3.flagSocketIsDead = null;
			});
		}
	}]);

	return DiyaSocket;
}(Transform);

module.exports = DiyaSocket;

},{"stream":30}],39:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isBrowser = !(typeof window === 'undefined');

if (!isBrowser) {

	var Q = require('q');
	var net = require('net');
	var JSONSocket = require('json-socket');
	var EventEmitter = require('node-event-emitter');

	var UNIXSocketHandler = function (_EventEmitter) {
		_inherits(UNIXSocketHandler, _EventEmitter);

		function UNIXSocketHandler(addr, connectTimeout) {
			_classCallCheck(this, UNIXSocketHandler);

			var _this = _possibleConstructorReturn(this, (UNIXSocketHandler.__proto__ || Object.getPrototypeOf(UNIXSocketHandler)).call(this));

			_this.addr = addr;

			_this._socket = new JSONSocket(new net.Socket());
			_this._socket.connect(_this.addr);

			// Store callback so that we can unregister them later
			_this._socketOpenCallback = _this._onopen.bind(_this);
			_this._socketCloseCallback = _this._onclose.bind(_this);
			_this._socketMessageCallback = _this._onmessage.bind(_this);
			_this._socketErrorCallback = _this._onerror.bind(_this);

			_this._socket.on('connect', _this._socketOpenCallback);
			_this._socket._socket.on('close', _this._socketCloseCallback);
			_this._socket.on('message', _this._socketMessageCallback);
			_this._socket._socket.on('error', _this._socketErrorCallback);

			// Create timeout to abord connectiong
			setTimeout(function (_) {
				// Whe ntime times out, if the socket is opened, simply return
				if (_this._status === 'opened') return;
				// Otherwise, abord
				if (_this._status !== 'closed') {
					Logger.log('d1: ' + that.addr + ' timed out while connecting');
					_this.close();
					_this.emit('timeout', _this._socket);
				}
			}, connectTimeout);
			return _this;
		}

		_createClass(UNIXSocketHandler, [{
			key: 'close',
			value: function close() {
				if (this._disconnectionDeferred && this._disconnectionDeferred.promise) return this._disconnectionDeferred.promise;

				this._disconnectionDeferred = Q.defer();
				this._status = 'closing';

				this.emit('closing', this._socket);

				if (this._socket) this._socket.end();

				return this._disconnectionDeferred.promise;
			}

			/**
    * Send a JSON-formatted message through the socket
    * @param {JSON} msg The JSON to send (do not stringify it, json-socket will do it)
    */

		}, {
			key: 'send',
			value: function send(msg) {
				try {
					this._socket.sendMessage(msg);
				} catch (err) {
					console.error('Cannot send message: ' + err.message);
					return false;
				}

				return true;
			}
		}, {
			key: 'isConnected',
			value: function isConnected() {
				return !this._socket.isClosed() && this._status === 'opened';
			}
		}, {
			key: '_onopen',
			value: function _onopen() {
				this._status = 'opened';
				this.emit('open', this._socket);
			}
		}, {
			key: '_onclose',
			value: function _onclose() {
				this._status = 'closed';
				this.unregisterCallbacks();
				this.emit('close', this._socket);
				if (this._disconnectionDeferred && this._disconnectionDeferred.promise) this._disconnectionDeferred.resolve();
			}
		}, {
			key: '_onmessage',
			value: function _onmessage(msg) {
				// The message is already a JSON
				this.emit('message', msg);
			}
		}, {
			key: '_onerror',
			value: function _onerror(err) {
				this.emit('error', err);
			}
		}, {
			key: 'unregisterCallbacks',
			value: function unregisterCallbacks() {
				if (this._socket && typeof this._socket.removeEventListener === 'function') {
					this._socket.removeEventListener('open', this._socketOpenCallback);
					this._socket.removeEventListener('close', this._socketCloseCallback);
					this._socket.removeEventListener('message', this._socketMessageCallback);
				} else if (this._socket && typeof this._socket.removeAllListeners === 'function') {
					this._socket.removeAllListeners();
				}
			}
		}]);

		return UNIXSocketHandler;
	}(EventEmitter);

	module.exports = UNIXSocketHandler;
}

},{"json-socket":undefined,"net":4,"node-event-emitter":12,"q":undefined}],40:[function(require,module,exports){
'use strict';

var d1 = require('./DiyaSelector.js');

//require('./services/rtc/rtc.js');
require('./services/ieq/ieq.js');
require('./services/peerAuth/PeerAuth.js');
require('./services/meshNetwork/MeshNetwork.js');
require('./utils/encoding/encoding.js');
require('./services/status/status.js');
require('./DBusObject.js');
//require('./services/shell/Shell.js');

module.exports = d1;

},{"./DBusObject.js":35,"./DiyaSelector.js":37,"./services/ieq/ieq.js":41,"./services/meshNetwork/MeshNetwork.js":42,"./services/peerAuth/PeerAuth.js":44,"./services/status/status.js":45,"./utils/encoding/encoding.js":46}],41:[function(require,module,exports){
'use strict';

/* maya-client
 * Copyright (c) 2014, Partnering Robotics, All rights reserved.
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; version
 *	3.0 of the License. This library is distributed in the hope
 * that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE. See the GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library.
 */

/**
   Todo :
   check err for each data
   improve API : getData(sensorName, dataConfig)
   return adapted vector for display with D3 to reduce code in IHM ?
   updateData(sensorName, dataConfig)
   set and get for the different dataConfig params

*/

var DiyaSelector = require('../../DiyaSelector').DiyaSelector;
var util = require('util');

var Message = require('../message');

//////////////////////////////////////////////////////////////
/////////////////// Logging utility methods //////////////////
//////////////////////////////////////////////////////////////

var DEBUG = true;
var Logger = {
	log: function log(message) {
		if (DEBUG) console.log(message);
	},

	error: function error(message) {
		if (DEBUG) console.error(message);
	}
};

/**
 *	callback : function called after model updated
 * */
function IEQ(selector) {
	var that = this;
	this.selector = selector;
	this.dataModel = {};
	this._coder = selector.encode();
	this.subscriptions = [];
	//	that.subscriptionErrorNum = 0;

	/*** structure of data config ***
 	 criteria :
 	   time: all 3 time criteria should not be defined at the same time. (range would be given up)
 	     start: {[null],time} (null means most recent) // stored a UTC in ms (num)
 	     end: {[null], time} (null means most oldest) // stored as UTC in ms (num)
 	     range: {[null], time} (range of time(positive) ) // in s (num)
 	   robot: {ArrayOf ID or ["all"]}
 	   place: {ArrayOf ID or ["all"]}
 	 operator: {[last], max, moy, sd} -( maybe moy should be default
 	 ...
 		 sensors : {[null] or ArrayOf SensorName}
 		 sampling: {[null] or int}
 */
	this.dataConfig = {
		criteria: {
			time: {
				start: null,
				end: null,
				range: null // in s
			},
			robot: null,
			place: null
		},
		operator: 'last',
		sensors: null,
		sampling: null //sampling
	};

	return this;
};

/**
 * Get dataModel :
 * {
 *	"senseurXX": {
 *			data:[FLOAT, ...],
 *			time:[FLOAT, ...],
 *			robot:[FLOAT, ...],
 *			place:[FLOAT, ...],
 *			qualityIndex:[FLOAT, ...],
 *			range: [FLOAT, FLOAT],
 *			unit: string,
 *		label: string
 *		},
 *	 ... ("senseursYY")
 * }
 */
IEQ.prototype.getDataModel = function () {
	return this.dataModel;
};
IEQ.prototype.getDataRange = function () {
	return this.dataModel.range;
};

/**
 * @param {Object} dataConfig config for data request
 * if dataConfig is define : set and return this
 *	 @return {IEQ} this
 * else
 *	 @return {Object} current dataConfig
 */
IEQ.prototype.DataConfig = function (newDataConfig) {
	if (newDataConfig) {
		this.dataConfig = newDataConfig;
		return this;
	} else return this.dataConfig;
};
/**
 * TO BE IMPLEMENTED : operator management in DN-IEQ
 * @param  {String}	 newOperator : {[last], max, moy, sd}
 * @return {IEQ} this - chainable
 * Set operator criteria.
 * Depends on newOperator
 *	@param {String} newOperator
 *	@return this
 * Get operator criteria.
 *	@return {String} operator
 */
IEQ.prototype.DataOperator = function (newOperator) {
	if (newOperator) {
		this.dataConfig.operator = newOperator;
		return this;
	} else return this.dataConfig.operator;
};
/**
 * Depends on numSamples
 * @param {int} number of samples in dataModel
 * if defined : set number of samples
 *	@return {IEQ} this
 * else
 *	@return {int} number of samples
 **/
IEQ.prototype.DataSampling = function (numSamples) {
	if (numSamples) {
		this.dataConfig.sampling = numSamples;
		return this;
	} else return this.dataConfig.sampling;
};
/**
 * Set or get data time criteria start and end.
 * If param defined
 *	@param {Date} newTimeStart // may be null
 *	@param {Date} newTimeEnd // may be null
 *	@return {IEQ} this
 * If no param defined:
 *	@return {Object} Time object: fields start and end.
 */
IEQ.prototype.DataTime = function (newTimeStart, newTimeEnd, newRange) {
	if (newTimeStart || newTimeEnd || newRange) {
		this.dataConfig.criteria.time.start = newTimeStart.getTime();
		this.dataConfig.criteria.time.end = newTimeEnd.getTime();
		this.dataConfig.criteria.time.range = newRange;
		return this;
	} else return {
		start: new Date(this.dataConfig.criteria.time.start),
		end: new Date(this.dataConfig.criteria.time.end),
		range: new Date(this.dataConfig.criteria.time.range)
	};
};
/**
 * Depends on robotIds
 * Set robot criteria.
 *	@param {Array[Int]} robotIds list of robot Ids
 * Get robot criteria.
 *	@return {Array[Int]} list of robot Ids
 */
IEQ.prototype.DataRobotIds = function (robotIds) {
	if (robotIds) {
		this.dataConfig.criteria.robot = robotIds;
		return this;
	} else return this.dataConfig.criteria.robot;
};
/**
 * Depends on placeIds
 * Set place criteria.
 *	@param {Array[Int]} placeIds list of place Ids
 * Get place criteria.
 *	@return {Array[Int]} list of place Ids
 */
IEQ.prototype.DataPlaceIds = function (placeIds) {
	if (placeIds) {
		this.dataConfig.criteria.placeId = placeIds;
		return this;
	} else return this.dataConfig.criteria.place;
};
/**
 * Get data by sensor name.
 *	@param {Array[String]} sensorName list of sensors
 */
IEQ.prototype.getDataByName = function (sensorNames) {
	var data = [];
	for (var n in sensorNames) {
		data.push(this.dataModel[sensorNames[n]]);
	}
	return data;
};
/**
 * Update data given dataConfig.
 * @param {func} callback : called after update
 * TODO USE PROMISE
 */
IEQ.prototype.updateData = function (callback, dataConfig) {
	var that = this;
	if (dataConfig) this.DataConfig(dataConfig);
	// console.log("Request: "+JSON.stringify(dataConfig));
	this.selector.request({
		service: "ieq",
		func: "DataRequest",
		data: {
			type: "splReq",
			dataConfig: that.dataConfig
		}
	}, function (dnId, err, data) {
		if (err) {
			Logger.error("[" + that.dataConfig.sensors + "] Recv err: " + JSON.stringify(err));
			return;
		}
		if (data.header.error) {
			// TODO : check/use err status and adapt behavior accordingly
			Logger.error("UpdateData:\n" + JSON.stringify(data.header.dataConfig));
			Logger.error("Data request failed (" + data.header.error.st + "): " + data.header.error.msg);
			return;
		}

		// console.log(data);
		that._getDataModelFromRecv(data);

		// Logger.log(that.getDataModel());

		callback = callback.bind(that); // bind callback with IEQ
		callback(that.getDataModel()); // callback func
	});
};

IEQ.prototype._isDataModelWithNaN = function () {
	var dataModelNaN = false;
	var sensorNan;
	for (var n in this.dataModel) {
		sensorNan = this.dataModel[n].data.reduce(function (nanPres, d) {
			return nanPres && isNaN(d);
		}, false);
		dataModelNaN = dataModelNaN && sensorNan;
		Logger.log(n + " with nan : " + sensorNan + " (" + dataModelNaN + ") / " + this.dataModel[n].data.length);
	}
};

IEQ.prototype.getConfinementLevel = function () {
	return this.confinement;
};

IEQ.prototype.getAirQualityLevel = function () {
	return this.airQuality;
};

IEQ.prototype.getEnvQualityLevel = function () {
	return this.envQuality;
};

/**
 * Update internal model with received data
 * @param  data to configure subscription
 * @param  callback called on answers (@param : dataModel)
 */
IEQ.prototype.watch = function (data, callback) {
	var that = this;
	// console.log("Request: "+JSON.stringify(dataConfig));

	/** default **/
	data = data || {};
	data.timeRange = data.timeRange || 'hours';
	data.cat = data.cat || 'ieq'; /* category */

	var subs = this.selector.subscribe({
		service: "ieq",
		func: "Data",
		data: data,
		obj: data.cat /* provide category of sensor to be watched, filtered according to CRM */
	}, function (dnId, err, data) {
		if (err) {
			Logger.error("WatchIEQRecvErr:" + JSON.stringify(err));
			// console.log(e);
			// console.log(that.selector);
			// if(err==="SubscriptionClosed") {
			// 	that.closeSubscriptions(); // should not be necessary
			// 	that.subscriptionError = that.subscriptionErrorNum+1; // increase error counter
			// 	setTimeout(that.subscriptionErrorNum*60000, that.watch(data,callback)); // try again later
			// }
			// else {
			// 	console.error("Unmanage cases : should the subscription be regenerated ?");
			// }
			return;
		}
		if (data.header.error) {
			// TODO : check/use err status and adapt behavior accordingly
			Logger.error("WatchIEQ:\n" + JSON.stringify(data.header.dataConfig));
			Logger.error("Data request failed (" + data.header.error.st + "): " + data.header.error.msg);
			return;
		}
		// console.log(data);
		that._getDataModelFromRecv(data);
		//		that.subscriptionError = 0; // reset error counter

		callback = callback.bind(that); // bind callback with IEQ
		callback(that.getDataModel()); // callback func
	});

	this.subscriptions.push(subs);
};

/**
 * Close all subscriptions
 */
IEQ.prototype.closeSubscriptions = function () {
	for (var i in this.subscriptions) {
		this.subscriptions[i].close();
	}
	this.subscriptions = [];
};

/**
 * request Data to make CSV file
 */
IEQ.prototype.getCSVData = function (sensorNames, _firstDay, callback) {
	var firstDay = new Date(_firstDay);
	var dataConfig = {
		criteria: {
			time: { start: firstDay.getTime(), rangeUnit: 'hour', range: 180 }, // 360h -> 15d // 180h -> 7j
			places: [],
			robots: []
		},
		sensors: sensorNames
	};

	this.updateData(callback, dataConfig);
};

/**
 * Update internal model with received data
 * @param  {Object} data data received from DiyaNode by websocket
 * @return {[type]}		[description]
 */
IEQ.prototype._getDataModelFromRecv = function (data) {
	var dataModel = null;

	if (data.err && data.err.st > 0) {
		Logger.error(data.err.msg);
		return null;
	}
	delete data.err;
	if (data && data.header) {
		for (var n in data) {
			if (n != "header" && n != "err") {

				if (data[n].err && data[n].err.st > 0) {
					Logger.error(n + " was in error: " + data[n].err.msg);
					continue;
				}

				if (!dataModel) dataModel = {};

				// Logger.log(n);
				if (!dataModel[n]) {
					dataModel[n] = {};
				}
				/* update data absolute range */
				dataModel[n].range = data[n].range;
				/* update data range */
				dataModel[n].timeRange = data[n].timeRange;
				/* update data label */
				dataModel[n].label = data[n].label;
				/* update data unit */
				dataModel[n].unit = data[n].unit;
				/* update data precision */
				dataModel[n].precision = data[n].precision;
				/* update data categories */
				dataModel[n].category = data[n].category;

				/* suggested y display range */
				dataModel[n].zoomRange = [0, 100];

				/* update data indexRange */
				dataModel[n].qualityConfig = {
					/* confortRange: data[n].confortRange, */
					indexRange: data[n].indexRange
				};
				dataModel[n].time = this._coder.from(data[n].time, 'b64', 8);
				dataModel[n].data = data[n].data ? this._coder.from(data[n].data, 'b64', 4) : data[n].avg ? this._coder.from(data[n].avg.d, 'b64', 4) : null;
				dataModel[n].qualityIndex = data[n].data ? this._coder.from(data[n].index, 'b64', 4) : data[n].avg ? this._coder.from(data[n].avg.i, 'b64', 4) : null;
				dataModel[n].robotId = this._coder.from(data[n].robotId, 'b64', 4);
				if (dataModel[n].robotId) {
					/** dico robotId -> robotName **/
					var dicoRobot = {};
					data.header.robots.forEach(function (el) {
						dicoRobot[el.id] = el.name;
					});
					dataModel[n].robotId = dataModel[n].robotId.map(function (el) {
						return dicoRobot[el];
					});
				}

				dataModel[n].placeId = this._coder.from(data[n].placeId, 'b64', 4);
				dataModel[n].x = null;
				dataModel[n].y = null;

				if (data[n].avg) dataModel[n].avg = {
					d: this._coder.from(data[n].avg.d, 'b64', 4),
					i: this._coder.from(data[n].avg.i, 'b64', 4)
				};
				if (data[n].min) dataModel[n].min = {
					d: this._coder.from(data[n].min.d, 'b64', 4),
					i: this._coder.from(data[n].min.i, 'b64', 4)
				};
				if (data[n].max) dataModel[n].max = {
					d: this._coder.from(data[n].max.d, 'b64', 4),
					i: this._coder.from(data[n].max.i, 'b64', 4)
				};
				if (data[n].stddev) dataModel[n].stddev = {
					d: this._coder.from(data[n].stddev.d, 'b64', 4),
					i: this._coder.from(data[n].stddev.i, 'b64', 4)
				};
				if (data[n].stddev) dataModel[n].stddev = {
					d: this._coder.from(data[n].stddev.d, 'b64', 4),
					i: this._coder.from(data[n].stddev.i, 'b64', 4)
				};
				if (data[n].x) dataModel[n].x = this._coder.from(data[n].x, 'b64', 4);
				if (data[n].y) dataModel[n].y = this._coder.from(data[n].y, 'b64', 4);
				/**
     * current quality : {'b'ad, 'm'edium, 'g'ood}
     * evolution : {'u'p, 'd'own, 's'table}
     * evolution quality : {'b'etter, 'w'orse, 's'ame}
     */
				/// TODO
				dataModel[n].trend = 'mss';
			}
		}
	} else {
		Logger.error("No Data to read or header is missing !");
	}
	/** list robots **/
	//	dataModel.robots = [{name: 'D2R2', id:1}];
	this.dataModel = dataModel;
	return dataModel;
};

/** create IEQ service **/
DiyaSelector.prototype.IEQ = function () {
	return new IEQ(this);
};

},{"../../DiyaSelector":37,"../message":43,"util":34}],42:[function(require,module,exports){
'use strict';

var DiyaSelector = require('../../DiyaSelector').DiyaSelector;
var d1 = require('../../DiyaSelector');
var isBrowser = !(typeof window === 'undefined');
if (!isBrowser) {
	var Q = require('q');
} else {
	var Q = window.Q;
}

d1.knownPeers = function () {
	return d1("#self").knownPeers();
};
d1.kp = d1.knownPeers;

DiyaSelector.prototype.knownPeers = function (callback) {
	var deferred = Q.defer();
	this.request({ service: 'meshNetwork', func: 'ListKnownPeers' }, function (peerId, err, data) {
		if (err) return deferred.reject(err);
		var peers = [];
		for (var i = 0; i < data.length; i++) {
			peers.push(data[i].peer_name);
		}return deferred.resolve(peers);
	});
	return deferred.promise;
};

d1.listenMeshNetwork = function (callback) {
	return d1(/.*/).subscribe({ service: 'meshNetwork', func: 'MeshNetwork' }, callback, { auto: true });
};

},{"../../DiyaSelector":37,"q":undefined}],43:[function(require,module,exports){
'use strict';

/* maya-client
 *
 * Copyright (c) 2014, Partnering Robotics, All rights reserved.
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; version
 *  3.0 of the License This library is distributed in the hope
 * that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE. See the GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library.
 */

function Message(service, func, obj, permanent) {

	this.service = service;
	this.func = func;
	this.obj = obj;

	this.permanent = permanent; //If this flag is on, the command will stay on the callback list listening for events
}

Message.buildSignature = function (msg) {
	return msg.service + '.' + msg.func + '.' + msg.obj;
};

Message.prototype.signature = function () {
	return this.service + '.' + this.func + '.' + this.obj;
};

Message.prototype.exec = function (data) {
	return {
		service: this.service,
		func: this.func,
		obj: this.obj,
		data: data
	};
};

module.exports = Message;

},{}],44:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var DiyaSelector = require('../../DiyaSelector').DiyaSelector;
var d1 = require('../../DiyaSelector');
var isBrowser = !(typeof window === 'undefined');
if (!isBrowser) {
	var Q = require('q');
} else {
	var Q = window.Q;
}

if (typeof INFO === 'undefined') var INFO = function INFO(s) {
	console.log(s);
};
if (typeof OK === 'undefined') var OK = function OK(s) {
	console.log(s);
};

/**
* Installs a new DiyaNode device (with address 'ip') into an existing network, by
* contacting an existing DiyaNode device with address 'bootstrap_ip' :
*   1) Contact the new node to get its public key
*   2) Add this public key to the existing node TrustedPeers list
*   3) Add the existing node's public key to the new node's TrustedPeers list
*   4) Ask the new node to join the network by calling @see{d1().join()}
*
* NOTE : This operation requires the given user to have root role on both nodes
*
* @param ip : the IP address of the new device
* @param user : a username with root role on the new device
* @param password : the password for 'user'
* @param bootstrap_ip : the IP address of the bootstrap device
* @param bootstrap_user : a user identifier with root role on the boostrap device
* @param bootstrap_password : the password for 'bootstrap_user'
* @param bootstrap_net : the IP address where the new device will connect to the boostrap one
* @param callback : of the form callback(new_peer_name,bootstrap_peer_name, err, data)
*/
d1.installNodeExt = function (ip, user, password, bootstrap_ip, bootstrap_user, bootstrap_password, bootstrap_net, callback) {
	if (typeof ip !== 'string') throw "[installNode] ip should be an IP address";
	if (typeof bootstrap_ip !== 'string') throw "[installNode] bootstrap_ip should be an IP address";
	if (typeof bootstrap_net !== 'string') throw "[installNode] bootstrap_net should be an IP address";

	// Check and Format URI (FQDN)
	if (bootstrap_ip.indexOf("ws://") !== 0 && bootstrap_ip.indexOf("wss://") !== 0) {
		if (d1.isSecured()) bootstrap_ip = "wss://" + bootstrap_ip;else bootstrap_ip = "ws://" + bootstrap_ip;
	}
	if (bootstrap_net.indexOf("ws://") !== 0 && bootstrap_net.indexOf("wss://") !== 0) {
		if (d1.isSecured()) bootstrap_net = "wss://" + bootstrap_net;else bootstrap_net = "ws://" + bootstrap_net;
	}

	function join(peer, bootstrap_peer) {
		d1("#self").join(bootstrap_net, true, function (peer, err, data) {
			if (!err) OK("JOINED !!!");
			return callback(peer, bootstrap_peer, err, data);
		});
	}

	d1.connectAsUser(ip, user, password).then(function (peer, err, data) {
		d1("#self").givePublicKey(function (peer, err, data) {
			if (err === 'ServiceNotFound') {
				INFO("Peer Authentication disabled ... directly joining");
				join();
				return;
			} else if (err) return callback(peer, null, err, null);else {
				INFO("Add trusted peer '" + peer + "' (ip=" + ip + ") to '" + bootstrap_ip + "' with public key\n" + data.public_key);
				d1.connectAsUser(bootstrap_ip, bootstrap_user, bootstrap_password).then(function () {
					d1("#self").addTrustedPeer(peer, data.public_key, function (bootstrap_peer, err, _ref) {
						var _ref2 = _slicedToArray(_ref, 2),
						    alreadyTrusted = _ref2[0],
						    public_key = _ref2[1];

						if (err) return callback(peer, bootstrap_peer, err, null);
						if (alreadyTrusted) INFO(peer + " already trusted by " + bootstrap_peer);else INFO(bootstrap_peer + "(ip=" + bootstrap_ip + ") added " + peer + "(ip=" + ip + ") as a Trusted Peer");

						d1('#self').givePublicKey(function (_, err, data) {
							INFO("In return, add " + bootstrap_peer + " to " + peer + " as a Trusted Peer with public key " + data.public_key);
							d1.connectAsUser(ip, user, password).then(function () {
								d1("#self").addTrustedPeer(bootstrap_peer, data.public_key, function (peer, err, _ref3) {
									var _ref4 = _slicedToArray(_ref3, 2),
									    alreadyTrusted = _ref4[0],
									    public_key = _ref4[1];

									if (err) callback(peer, bootstrap_peer, err, null);else if (alreadyTrusted) INFO(bootstrap_peer + " already trusted by " + peer);else INFO(peer + "(ip=" + ip + ") added " + bootstrap_peer + "(ip=" + bootstrap_ip + ") as a Trusted Peer");
									// Once Keys have been exchanged ask to join the network
									OK("KEYS OK ! Now, let " + peer + "(ip=" + ip + ") join the network via " + bootstrap_peer + "(ip=" + bootstrap_net + ") ...");
									return join(peer, bootstrap_peer);
								});
							});
						});
					});
				});
			}
		});
	});
};

/** Short version of @see{d1.installNodeExt} */
d1.installNode = function (bootstrap_ip, bootstrap_net, callback) {
	var ip = d1.addr();
	var user = d1.user();
	var password = d1.pass();
	var bootstrap_user = user;
	var bootstrap_password = password;

	console.log('[installNode]\nip:' + ip);

	return d1.installNodeExt(ip, user, password, bootstrap_ip, bootstrap_user, bootstrap_password, bootstrap_net, callback);
};

/**
 * Make the selected DiyaNodes join an existing DiyaNodes Mesh Network by contacting
 * the given bootstrap peers.
 *
 * NOTE : This operation requires root role
 *
 * @param bootstrap_ips : an array of bootstrap IP addresses to contact to join the Network
 * @param permanent : if true, permanently add the bootstrap peers as automatic bootstrap peers for the selected nodes.
 *
 */
DiyaSelector.prototype.join = function (bootstrap_ips, permanent, callback) {
	if (typeof bootstrap_ips === 'string') bootstrap_ips = [bootstrap_ips];

	if (bootstrap_ips.constructor !== Array) throw "join() : bootstrap_ips should be an array of peers URIs";

	this.request({
		service: 'meshNetwork',
		func: 'Join',
		data: {
			bootstrap_ips: bootstrap_ips,
			permanent: permanent
		}
	}, function (peerId, err, data) {
		if (typeof callback === "function") callback(peerId, err, data);
	});
};

/**
 * Disconnect the selected DiyaNodes from the given bootstrap peers
 *
 * NOTE : This operation requires root role
 *
 * @param bootstrap_ips : an array of bootstrap IP addresses to leave
 * @param bPermanent : if true, permanently remove the given peers from the automatic bootstrap peers list
 *
 */
DiyaSelector.prototype.leave = function (bootstrap_ips, bPermanent, callback) {
	if (typeof bootstrap_ips === 'string') bootstrap_ips = [bootstrap_ips];
	if (bootstrap_ips.constructor !== Array) throw "leave() : bootstrap_ips should be an array of peers URIs";
	this.request({ service: 'meshNetwork', func: 'Leave', data: { bootstrap_ips: bootstrap_ips, bPermanent: bPermanent } }, function (peerId, err, data) {
		if (typeof callback === "function") callback(peerId, err, data);
	});
};

/**
 * Ask the selected DiyaNodes for their public keys
 */
DiyaSelector.prototype.givePublicKey = function (callback) {
	return this.request({ service: 'peerAuth', func: 'GivePublicKey', data: {} }, function (peerId, err, data) {
		callback(peerId, err, data);
	});
};

/**
 * Add a new trusted peer RSA public key to the selected DiyaNodes
 * NOTE : This operation requires root role
 *
 * @param peer_name : the name of the new trusted DiyaNode peer
 * @param public_key : the RSA public key of the new trusted DiyaNode peer
 */
DiyaSelector.prototype.addTrustedPeer = function (name, public_key, callback) {
	return this.request({
		service: 'peerAuth',
		func: 'AddTrustedPeer',
		data: {
			peer_name: name,
			public_key: public_key
		}
	}, function (peerId, err, data) {
		callback(peerId, err, data);
	});
};

/**
 * Check if the selected DiyaNodes trust the given peers
 * @param peers : an array of peer names
 */
DiyaSelector.prototype.areTrusted = function (peers, callback) {
	return this.request({ service: 'peerAuth', func: 'AreTrusted', data: { peers: peers } }, function (peerId, err, data) {
		var allTrusted = data.trusted;
		if (allTrusted) {
			OK(peers + " are trusted by " + peerId);callback(peerId, true);
		} else {
			ERR("Some peers in " + peers + " are untrusted by " + peerId);callback(peerId, false);
		}
	});
};
DiyaSelector.prototype.isTrusted = function (peer, callback) {
	return this.areTrusted([peer], callback);
};

d1.trustedPeers = function () {
	var deferred = Q.defer();
	d1("#self").request({ service: 'peerAuth', func: 'GetTrustedPeers' }, function (peerId, err, data) {
		if (err) return deferred.reject(err);
		var peers = [];
		for (var i = 0; i < data.peers.length; i++) {
			peers.push(data.peers[i].name);
		}return deferred.resolve(peers);
	});
	return deferred.promise;
};
d1.tp = d1.trustedPeers; // Shorthand

d1.blacklistedPeers = function () {
	var deferred = Q.defer();
	d1("#self").request({ service: 'peerAuth', func: 'GetBlacklistedPeers' }, function (peerId, err, data) {
		if (err) return deferred.reject(err);
		var peers = [];
		for (var i = 0; i < data.peers.length; i++) {
			peers.push(data.peers[i].name);
		}return deferred.resolve(peers);
	});
	return deferred.promise;
};
d1.bp = d1.blacklistedPeers; // Shorthand

},{"../../DiyaSelector":37,"q":undefined}],45:[function(require,module,exports){
'use strict';

/*
 * Copyright : Partnering 3.0 (2007-2016)
 * Author : Sylvain Mahé <sylvain.mahe@partnering.fr>
 *
 * This file is part of diya-sdk.
 *
 * diya-sdk is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * diya-sdk is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with diya-sdk.  If not, see <http://www.gnu.org/licenses/>.
 */

/* maya-client
 * Copyright (c) 2014, Partnering Robotics, All rights reserved.
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; version
 *	3.0 of the License. This library is distributed in the hope
 * that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE. See the GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library.
 */

var isBrowser = !(typeof window === 'undefined');
if (!isBrowser) {
	var Promise = require('bluebird');
} else {
	var Promise = window.Promise;
}
var DiyaSelector = require('../../DiyaSelector').DiyaSelector;
var util = require('util');

var Message = require('../message');

//////////////////////////////////////////////////////////////
/////////////////// Logging utility methods //////////////////
//////////////////////////////////////////////////////////////

var DEBUG = true;
var Logger = {
	log: function log(message) {
		if (DEBUG) console.log(message);
	},

	error: function error(message) {
		if (DEBUG) console.error(message);
	}
};

/**
 *	callback : function called after model updated
 * */
function Status(selector) {
	this.selector = selector;
	this._coder = selector.encode();
	this.subscriptions = [];

	/** model of robot : available parts and status **/
	this.robotModel = [];
	this._robotModelInit = false;

	/*** structure of data config ***
 	 criteria :
 	   time: all 3 time criteria should not be defined at the same time. (range would be given up)
 	     beg: {[null],time} (null means most recent) // stored a UTC in ms (num)
 	     end: {[null], time} (null means most oldest) // stored as UTC in ms (num)
 	     range: {[null], time} (range of time(positive) ) // in s (num)
 	   robot: {ArrayOf ID or ["all"]}
 	   place: {ArrayOf ID or ["all"]}
 	 operator: {[last], max, moy, sd} -( maybe moy should be default
 	 ...
 		 parts : {[null] or ArrayOf PartsId} to get errors
 	 status : {[null] or ArrayOf StatusName} to get status
 		 sampling: {[null] or int}
 */
	this.dataConfig = {
		criteria: {
			time: {
				beg: null,
				end: null,
				range: null // in s
			},
			robot: null
		},
		operator: 'last',
		parts: null,
		status: null
	};

	return this;
};
/**
 * Get robotModel :
 * {
 *  parts: {
 *		"partXX": {
 * 			 errorsDescr: { encountered errors indexed by errorIds>0 }
 *				> Config of errors :
 *					critLevel: FLOAT, // could be int...
 * 					msg: STRING,
 *					stopServiceId: STRING,
 *					runScript: Sequelize.STRING,
 *					missionMask: Sequelize.INTEGER,
 *					runLevel: Sequelize.INTEGER
 *			error:[FLOAT, ...], // could be int...
 *			time:[FLOAT, ...],
 *			robot:[FLOAT, ...],
 *			/// place:[FLOAT, ...], not implemented yet
 *		},
 *	 	... ("PartYY")
 *  },
 *  status: {
 *		"statusXX": {
 *				data:[FLOAT, ...], // could be int...
 *				time:[FLOAT, ...],
 *				robot:[FLOAT, ...],
 *				/// place:[FLOAT, ...], not implemented yet
 *				range: [FLOAT, FLOAT],
 *				label: string
 *			},
 *	 	... ("StatusYY")
 *  }
 * }
 */
Status.prototype.getRobotModel = function () {
	return this.robotModel;
};

/**
 * @param {Object} dataConfig config for data request
 * if dataConfig is define : set and return this
 *	 @return {Status} this
 * else
 *	 @return {Object} current dataConfig
 */
Status.prototype.DataConfig = function (newDataConfig) {
	if (newDataConfig) {
		this.dataConfig = newDataConfig;
		return this;
	} else return this.dataConfig;
};
/**
 * TO BE IMPLEMENTED : operator management in DN-Status
 * @param  {String}	 newOperator : {[last], max, moy, sd}
 * @return {Status} this - chainable
 * Set operator criteria.
 * Depends on newOperator
 *	@param {String} newOperator
 *	@return this
 * Get operator criteria.
 *	@return {String} operator
 */
Status.prototype.DataOperator = function (newOperator) {
	if (newOperator) {
		this.dataConfig.operator = newOperator;
		return this;
	} else return this.dataConfig.operator;
};
/**
 * Depends on numSamples
 * @param {int} number of samples in dataModel
 * if defined : set number of samples
 *	@return {Status} this
 * else
 *	@return {int} number of samples
 **/
Status.prototype.DataSampling = function (numSamples) {
	if (numSamples) {
		this.dataConfig.sampling = numSamples;
		return this;
	} else return this.dataConfig.sampling;
};
/**
 * Set or get data time criteria beg and end.
 * If param defined
 *	@param {Date} newTimeBeg // may be null
 *	@param {Date} newTimeEnd // may be null
 *	@return {Status} this
 * If no param defined:
 *	@return {Object} Time object: fields beg and end.
 */
Status.prototype.DataTime = function (newTimeBeg, newTimeEnd, newRange) {
	if (newTimeBeg || newTimeEnd || newRange) {
		this.dataConfig.criteria.time.beg = newTimeBeg.getTime();
		this.dataConfig.criteria.time.end = newTimeEnd.getTime();
		this.dataConfig.criteria.time.range = newRange;
		return this;
	} else return {
		beg: new Date(this.dataConfig.criteria.time.beg),
		end: new Date(this.dataConfig.criteria.time.end),
		range: new Date(this.dataConfig.criteria.time.range)
	};
};
/**
 * Depends on robotIds
 * Set robot criteria.
 *	@param {Array[Int]} robotIds list of robot Ids
 * Get robot criteria.
 *	@return {Array[Int]} list of robot Ids
 */
Status.prototype.DataRobotIds = function (robotIds) {
	if (robotIds) {
		this.dataConfig.criteria.robot = robotIds;
		return this;
	} else return this.dataConfig.criteria.robot;
};
/**
 * Depends on placeIds // not relevant?, not implemented yet
 * Set place criteria.
 *	@param {Array[Int]} placeIds list of place Ids
 * Get place criteria.
 *	@return {Array[Int]} list of place Ids
 */
Status.prototype.DataPlaceIds = function (placeIds) {
	if (placeIds) {
		this.dataConfig.criteria.placeId = placeIds;
		return this;
	} else return this.dataConfig.criteria.place;
};
/**
 * Get data by sensor name.
 *	@param {Array[String]} sensorName list of sensors
 */
Status.prototype.getDataByName = function (sensorNames) {
	var data = [];
	for (var n in sensorNames) {
		data.push(this.dataModel[sensorNames[n]]);
	}
	return data;
};

/**
 * Subscribe to error/status updates
 */
Status.prototype.watch = function (robotNames, callback) {
	var _this = this;

	this.selector.setMaxListeners(0);
	this.selector._connection.setMaxListeners(0);
	var sendData = [];
	var robotIds = [];
	return Promise.try(function (_) {
		var req = _this.selector.request({
			service: 'status',
			func: 'GetManagedObjects',
			obj: {
				interface: 'org.freedesktop.DBus.ObjectManager'
			}
		}, function (peerId, err, objData) {
			// get all object paths, interfaces and properties children of Status
			var robotName = '';
			var robotId = 1;

			var _loop = function _loop(objectPath) {
				if (objData[objectPath]['fr.partnering.Status.Robot'] != null) {
					robotName = objData[objectPath]['fr.partnering.Status.Robot'].RobotName;
					robotId = objData[objectPath]['fr.partnering.Status.Robot'].RobotId;
					robotIds[robotName] = robotId;
					_this.getAllStatuses(robotName, function (model) {
						callback(model);
					});
				}
				if (objData[objectPath]['fr.partnering.Status.Part'] != null) {
					var subs = _this.selector.subscribe({ // subscribes to status changes for all parts
						service: 'status',
						func: 'CurrentStatusChanged',
						obj: {
							interface: 'fr.partnering.Status.Part',
							path: objectPath
						},
						data: robotNames
					}, function (peerId, err, data) {
						if (err != null) {
							Logger.error("StatusSubscribe:" + err);
						} else {
							robotName = objectPath.split("/")[5];
							robotId = robotIds[robotName];
							sendData[0] = data;
							_this._getRobotModelFromRecv2(sendData, robotId, robotName);
							if (typeof callback === 'function') callback(_this.robotModel);
						}
					});
					_this.subscriptions.push(subs);
				}
			};

			for (var objectPath in objData) {
				_loop(objectPath);
			}
		});
	}).catch(function (err) {
		Logger.error(err);
	});
};

/**
 * Close all subscriptions
 */
Status.prototype.closeSubscriptions = function () {
	for (var i in this.subscriptions) {
		this.subscriptions[i].close();
	}
	this.subscriptions = [];
	this.robotModel = [];
};

/**
 * Get data given dataConfig.
 * @param {func} callback : called after update
 * TODO USE PROMISE
 */
Status.prototype.getData = function (callback, dataConfig) {
	var _this2 = this;

	var dataModel = {};
	return Promise.try(function (_) {
		if (dataConfig != null) _this2.DataConfig(dataConfig);
		// console.log("Request: "+JSON.stringify(dataConfig));
		_this2.selector.request({
			service: "status",
			func: "DataRequest",
			data: {
				type: "splReq",
				dataConfig: _this2.dataConfig
			}
		}, function (dnId, err, data) {
			if (err != null) {
				Logger.error("[" + _this2.dataConfig.sensors + "] Recv err: " + JSON.stringify(err));
				return;
			}
			if (data.header.error != null) {
				// TODO : check/use err status and adapt behavior accordingly
				Logger.error("UpdateData:\n" + JSON.stringify(data.header.reqConfig));
				Logger.error("Data request failed (" + data.header.error.st + "): " + data.header.error.msg);
				return;
			}
			//Logger.log(JSON.stringify(this.dataModel));
			dataModel = _this2._getDataModelFromRecv(data);

			Logger.log(_this2.getDataModel());
			callback = callback.bind(_this2); // bind callback with Status
			callback(dataModel); // callback func
		});
	}).catch(function (err) {
		Logger.error(err);
	});
};

/**
 * Update internal robot model with received data (version 2)
 * @param  {Object} data data received from DiyaNode by websocket
 * @return {[type]}		[description]
 */
Status.prototype._getRobotModelFromRecv2 = function (data, robotId, robotName) {
	var _this3 = this;

	if (this.robotModel == null) this.robotModel = [];

	if (this.robotModel[robotId] != null) this.robotModel[robotId].parts = {}; // reset parts

	if (this.robotModel[robotId] == null) this.robotModel[robotId] = {};

	this.robotModel[robotId] = {
		robot: {
			name: robotName
		}
	};

	/** extract parts info **/
	this.robotModel[robotId].parts = {};
	var rParts = this.robotModel[robotId].parts;

	data.forEach(function (d) {
		var partId = d[0];
		var category = d[1];
		var partName = d[2];
		var label = d[3];
		var time = d[4];
		var code = d[5];
		var codeRef = d[6];
		var msg = d[7];
		var critLevel = d[8];
		var description = d[9];

		if (rParts[partId] == null) {
			rParts[partId] = {};
		}
		/* update part category */
		rParts[partId].category = category;
		/* update part name */
		rParts[partId].name = partName.toLowerCase();
		/* update part label */
		rParts[partId].label = label;

		/* update error */
		/** update errorList **/
		if (rParts[partId].errorList == null) rParts[partId].errorList = {};

		if (rParts[partId].errorList[codeRef] == null) rParts[partId].errorList[codeRef] = {
			msg: msg,
			critLevel: critLevel,
			description: description
		};
		var evts_tmp = {
			time: _this3._coder.from(time),
			code: _this3._coder.from(code),
			codeRef: _this3._coder.from(codeRef)
		};
		/** if received list of events **/
		if (Array.isArray(evts_tmp.code) || Array.isArray(evts_tmp.time) || Array.isArray(evts_tmp.codeRef)) {
			if (evts_tmp.code.length === evts_tmp.codeRef.length && evts_tmp.code.length === evts_tmp.time.length) {
				/** build list of events **/
				rParts[partId].evts = [];
				for (var i = 0; i < evts_tmp.code.length; i++) {
					rParts[partId].evts.push({
						time: evts_tmp.time[i],
						code: evts_tmp.code[i],
						codeRef: evts_tmp.codeRef[i]
					});
				}
			} else Logger.error("Status:Inconsistant lengths of buffers (time/code/codeRef)");
		} else {
			/** just in case, to provide backward compatibility **/
			/** set received event **/
			rParts[partId].evts = [{
				time: evts_tmp.time,
				code: evts_tmp.code,
				codeRef: evts_tmp.codeRef
			}];
		}
	});
};

/** create Status service **/
DiyaSelector.prototype.Status = function () {
	return new Status(this);
};

/**
 * Set on status
 * @param robotName to find status to modify
 * @param partName 	to find status to modify
 * @param code		newCode
 * @param source		source
 * @param callback		return callback (<bool>success)
 */
DiyaSelector.prototype.setStatus = function (robotName, partName, code, source, callback) {
	var _this4 = this;

	return Promise.try(function (_) {
		var objectPath = "/fr/partnering/Status/Robots/" + robotName + "/Parts/" + partName;
		_this4.request({
			service: "status",
			func: "SetPart",
			obj: {
				interface: 'fr.partnering.Status.Part',
				path: objectPath
			},
			data: {
				//robotName: robotName,
				code: code,
				//partName: partName,
				source: source | 1
			}
		}, function (peerId, err, data) {
			if (err != null) {
				if (typeof callback === 'function') callback(false);
			} else {
				if (typeof callback === 'function') callback(true);
			}
		});
	}).catch(function (err) {
		Logger.error(err);
	});
};

/**
 * Get one status
 * @param robotName to get status
 * @param partName 	to get status
 * @param callback		return callback(-1 if not found/data otherwise)
 * @param _full 	more data about status
 */
Status.prototype.getStatus = function (robotName, partName, callback /*, _full*/) {
	var _this5 = this;

	var sendData = [];
	return Promise.try(function (_) {
		var req = _this5.selector.request({
			service: 'status',
			func: 'GetManagedObjects',
			obj: {
				interface: 'org.freedesktop.DBus.ObjectManager'
			}
		}, function (peerId, err, objData) {

			var objectPathRobot = "/fr/partnering/Status/Robots/" + robotName;
			var objectPathPart = "/fr/partnering/Status/Robots/" + robotName + "/Parts/" + partName;
			var robotId = objData[objectPathRobot]['fr.partnering.Status.Robot'].RobotId;
			_this5.selector.request({
				service: "status",
				func: "GetPart",
				obj: {
					interface: 'fr.partnering.Status.Part',
					path: objectPathPart
				}
			}, function (peerId, err, data) {
				sendData.push(data);
				_this5._getRobotModelFromRecv2(sendData, robotId, robotName);
				if (err != null) {
					if (typeof callback === 'function') callback(-1);
				} else {
					if (typeof callback === 'function') callback(_this5.robotModel);
				}
			});
		});
	}).catch(function (err) {
		Logger.error(err);
	});
};

/**
 * Get all status
 * @param robotName to get status
 * @param partName 	to get status
 * @param callback		return callback(-1 if not found/data otherwise)
 * @param _full 	more data about status
 */
Status.prototype.getAllStatuses = function (robotName, callback) {
	var _this6 = this;

	var req = this.selector.request({
		service: 'status',
		func: 'GetManagedObjects',
		obj: {
			interface: 'org.freedesktop.DBus.ObjectManager'
		}
	}, function (peerId, err, objData) {
		// get all object paths, interfaces and properties children of Status
		var objectPath = "/fr/partnering/Status/Robots/" + robotName;
		if (objData[objectPath] != null) {
			if (objData[objectPath]['fr.partnering.Status.Robot'] != null) {
				var robotId = objData[objectPath]['fr.partnering.Status.Robot'].RobotId;
				//var full = _full || false;
				_this6.selector.request({
					service: "status",
					func: "GetAllParts",
					obj: {
						interface: 'fr.partnering.Status.Robot',
						path: objectPath
					}
				}, function (peerId, err, data) {
					if (err != null) {
						if (typeof callback === 'function') callback(-1);
						throw new Error(err);
					} else {
						_this6._getRobotModelFromRecv2(data, robotId, robotName);
						if (typeof callback === 'function') callback(_this6.robotModel);
					}
				});
			} else {
				Logger.error("Interface fr.partnering.Status.Robot doesn't exist!");
			}
		} else {
			Logger.error("ObjectPath " + objectPath + " doesn't exist!");
		}
	});
};

},{"../../DiyaSelector":37,"../message":43,"bluebird":undefined,"util":34}],46:[function(require,module,exports){
'use strict';

/* maya-client
 * Copyright (c) 2014, Partnering Robotics, All rights reserved.
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; version
 *	3.0 of the License. This library is distributed in the hope
 * that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE. See the GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library.
 */

/**
 * Management of channel encoding
 * - base64 coding
 * - none
 * Data format :
 *		t: {'b64','none'}
 *		b: <if b64> {4,8}
 *		d: encoded data {buffer or Array}
 *		s: size
 */

var DiyaSelector = require('../../DiyaSelector').DiyaSelector;
var base64 = require('base-64');

/**
 * Default : no encoding
 * */
function NoCoding() {
	return this;
};

/**
*
*/
NoCoding.prototype.from = function (data) {
	if (data.d === 'number' || Array.isArray(data.d)) return data.d;else return data;
};

/**
*/
NoCoding.prototype.to = function (array) {
	return {
		t: 'no', /* type */
		d: array, /* data */
		s: array.length
	};
};

/**
 * Management of base64 encoding
 * Effective for string based channels (like JSON based WS)
 * */
function Base64Coding() {
	return this;
};

////////////////////////////////////////////////////////////////
/////////////////    Utility functions    //////////////////////
////////////////////////////////////////////////////////////////

/*\
 |*|
 |*|  utilitaires de manipulations de chaînes base 64 / binaires / UTF-8
 |*|
 |*|  https://developer.mozilla.org/fr/docs/Décoder_encoder_en_base64
 |*|
 \*/
/** Decoder un tableau d'octets depuis une chaîne en base64 */
var b64ToUint6 = function b64ToUint6(nChr) {
	return nChr > 64 && nChr < 91 ? nChr - 65 : nChr > 96 && nChr < 123 ? nChr - 71 : nChr > 47 && nChr < 58 ? nChr + 4 : nChr === 43 ? 62 : nChr === 47 ? 63 : 0;
};

/**
 * Decode base64 string to UInt8Array
 * @param  {String} sBase64		base64 coded string
 * @param  {int} nBlocksSize size of blocks of bytes to be read. Output byteArray length will be a multiple of this value.
 * @return {Uint8Array}				tab of decoded bytes
 */
var base64DecToArr = function base64DecToArr(sBase64, nBlocksSize) {
	var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""),
	    nInLen = sB64Enc.length,
	    nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2,
	    buffer = new ArrayBuffer(nOutLen),
	    taBytes = new Uint8Array(buffer);

	for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
		nMod4 = nInIdx & 3; /* n mod 4 */
		nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
		if (nMod4 === 3 || nInLen - nInIdx === 1) {
			for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
				taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
			}
			nUint24 = 0;
		}
	}
	// console.log("u8int : "+JSON.stringify(taBytes));
	return buffer;
};

////////////////////////////////////////////////////////////////
/////////////////   Interface functions   //////////////////////
////////////////////////////////////////////////////////////////


/**
* Convert buffer coded in base64 and containing numbers coded by
* byteCoding bytes into array
* @param buffer in base64
* @param byteCoding number of bytes for each number (4 or 8)
* @return array of float (32 or 64). null if could not convert.
*/
Base64Coding.prototype.from = function (data) {
	var byteCoding = data.b;

	/* check byte coding */
	if (byteCoding !== 4 && byteCoding !== 8) {
		return null;
	}

	/* decode data to array of byte */
	var buf = base64DecToArr(data.d, data.b);
	/* parse data to float array */
	var fArray = null;
	switch (data.b) {
		case 4:
			fArray = new Float32Array(buf);
			break;
		case 8:
			fArray = new Float64Array(buf);
			break;
		default:
			console.log("Unexpected byteCoding! Should not happen!!");
			return null;
	}
	/* parse fArray into normal array */
	var tab = [].slice.call(fArray);

	if (data.s !== tab.length) {
		console.log("Size mismatch when decoding !");
		return null;
	}
	return tab;
};

/**
* Convert array containing numbers coded by byteCoding bytes into buffer coded in base64
* @param 	{Array<Float>} 	array of float (32 or 64 bits)
* @param 	{integer} 	byteCoding number of bytes for each float (4 or 8)
* @return  	{String} 	buffer in base64. null if could not convert.
*/
Base64Coding.prototype.to = function (array, byteCoding) {
	/* check byte coding */
	if (byteCoding !== 4 && byteCoding !== 8) {
		return null;
	}

	/*** case ArrayBuffer ***/
	var buffer = new ArrayBuffer(array.length * byteCoding);
	switch (byteCoding) {
		case 4:
			var buf32 = new Float32Array(buffer);
			buf32.set(array);
			break;
		case 8:
			var buf64 = new Float64Array(buffer);
			buf64.set(array);
			break;
	}
	var buffChar = new Uint8Array(buffer);
	var buffCharCoded = new Array(buffChar.length);
	for (var n = 0; n < buffChar.length; n++) {
		buffCharCoded[n] = String.fromCharCode(buffChar[n]);
	}
	var str = new String(buffCharCoded.join(''));
	var b64Buff = base64.encode(str);
	return {
		t: 'b64', /* type */
		b: byteCoding, /* byteCoding */
		d: b64Buff, /* data */
		s: array.length /* size */
	};
};

/**
 * Management of comm encoding
 * */
function CodingHandler() {
	this.b64 = new Base64Coding();
	this.none = new NoCoding();

	return this;
};

CodingHandler.prototype.from = function (data) {
	if (typeof data == 'undefined' || data == null) return null;
	switch (data.t) {
		case 'b64':
			return this.b64.from(data);
		default:
			return this.none.from(data);
	}
};

CodingHandler.prototype.to = function (array, type, byteCoding) {
	if (typeof array === 'number') {
		array = [array];
	}
	if (!Array.isArray(array)) {
		console.log("CodingHandler.to only accepts array !");
		return null;
	}

	switch (type) {
		case 'b64':
			return this.b64.to(array, byteCoding);
		case 'no':
		default:
			return this.none.to(array);
	}
};

/** Add base64 handler to DiyaSelector **/
DiyaSelector.prototype.encode = function () {
	return new CodingHandler();
};

},{"../../DiyaSelector":37,"base-64":1}]},{},[40])(40)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYmFzZS02NC9iYXNlNjQuanMiLCJub2RlX21vZHVsZXMvYmFzZTY0LWpzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcmVzb2x2ZS9lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS11dGlsLWlzL2xpYi91dGlsLmpzIiwibm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2lzLWJ1ZmZlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pc2FycmF5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL25vZGUtZXZlbnQtZW1pdHRlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzLW5leHRpY2stYXJncy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2R1cGxleC1icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV9kdXBsZXguanMiLCJub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL2xpYi9fc3RyZWFtX3Bhc3N0aHJvdWdoLmpzIiwibm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV9yZWFkYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL19zdHJlYW1fdHJhbnNmb3JtLmpzIiwibm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9saWIvX3N0cmVhbV93cml0YWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL2ludGVybmFsL3N0cmVhbXMvQnVmZmVyTGlzdC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL2ludGVybmFsL3N0cmVhbXMvZGVzdHJveS5qcyIsIm5vZGVfbW9kdWxlcy9yZWFkYWJsZS1zdHJlYW0vbGliL2ludGVybmFsL3N0cmVhbXMvc3RyZWFtLWJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL25vZGVfbW9kdWxlcy9zdHJpbmdfZGVjb2Rlci9saWIvc3RyaW5nX2RlY29kZXIuanMiLCJub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL3Bhc3N0aHJvdWdoLmpzIiwibm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS9yZWFkYWJsZS1icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWRhYmxlLXN0cmVhbS90cmFuc2Zvcm0uanMiLCJub2RlX21vZHVsZXMvcmVhZGFibGUtc3RyZWFtL3dyaXRhYmxlLWJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvc2FmZS1idWZmZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc3RyZWFtLWJyb3dzZXJpZnkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdXRpbC1kZXByZWNhdGUvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyIsInNyYy9EQnVzT2JqZWN0LmpzIiwic3JjL0RpeWFOb2RlLmpzIiwic3JjL0RpeWFTZWxlY3Rvci5qcyIsInNyYy9EaXlhU29ja2V0LmpzIiwic3JjL1VOSVhTb2NrZXRIYW5kbGVyLmpzIiwic3JjL2RpeWEtc2RrLmpzIiwic3JjL3NlcnZpY2VzL2llcS9pZXEuanMiLCJzcmMvc2VydmljZXMvbWVzaE5ldHdvcmsvTWVzaE5ldHdvcmsuanMiLCJzcmMvc2VydmljZXMvbWVzc2FnZS5qcyIsInNyYy9zZXJ2aWNlcy9wZWVyQXV0aC9QZWVyQXV0aC5qcyIsInNyYy9zZXJ2aWNlcy9zdGF0dXMvc3RhdHVzLmpzIiwic3JjL3V0aWxzL2VuY29kaW5nL2VuY29kaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xIQTs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2xyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN2U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzkrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3JOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1FBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBOztBQ0RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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UyxJQUFULENBQWMsSUFBZCxDQUFQO0FBQ0Q7QUFDQyxVQUFPLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQVA7QUFKRDtBQU1BLENBVEQ7O0FBWUEsY0FBYyxTQUFkLENBQXdCLEVBQXhCLEdBQTZCLFVBQVMsS0FBVCxFQUFnQixJQUFoQixFQUFzQixVQUF0QixFQUFrQztBQUM5RCxLQUFHLE9BQU8sS0FBUCxLQUFpQixRQUFwQixFQUE4QjtBQUM3QixVQUFNLENBQUMsS0FBRCxDQUFOO0FBQ0E7QUFDRCxLQUFHLENBQUMsTUFBTSxPQUFOLENBQWMsS0FBZCxDQUFKLEVBQXlCO0FBQ3hCLFVBQVEsR0FBUixDQUFZLHVDQUFaO0FBQ0EsU0FBTyxJQUFQO0FBQ0E7O0FBRUQsU0FBTyxJQUFQO0FBQ0EsT0FBSyxLQUFMO0FBQ0MsVUFBTyxLQUFLLEdBQUwsQ0FBUyxFQUFULENBQVksS0FBWixFQUFtQixVQUFuQixDQUFQO0FBQ0QsT0FBSyxJQUFMO0FBQ0E7QUFDQyxVQUFPLEtBQUssSUFBTCxDQUFVLEVBQVYsQ0FBYSxLQUFiLENBQVA7QUFMRDtBQU9BLENBaEJEOztBQW1CQTtBQUNBLGFBQWEsU0FBYixDQUF1QixNQUF2QixHQUFnQyxZQUFVO0FBQ3pDLFFBQU8sSUFBSSxhQUFKLEVBQVA7QUFDQSxDQUZEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qISBodHRwOi8vbXRocy5iZS9iYXNlNjQgdjAuMS4wIGJ5IEBtYXRoaWFzIHwgTUlUIGxpY2Vuc2UgKi9cbjsoZnVuY3Rpb24ocm9vdCkge1xuXG5cdC8vIERldGVjdCBmcmVlIHZhcmlhYmxlcyBgZXhwb3J0c2AuXG5cdHZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHM7XG5cblx0Ly8gRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuXG5cdHZhciBmcmVlTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiZcblx0XHRtb2R1bGUuZXhwb3J0cyA9PSBmcmVlRXhwb3J0cyAmJiBtb2R1bGU7XG5cblx0Ly8gRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAsIGZyb20gTm9kZS5qcyBvciBCcm93c2VyaWZpZWQgY29kZSwgYW5kIHVzZVxuXHQvLyBpdCBhcyBgcm9vdGAuXG5cdHZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWw7XG5cdGlmIChmcmVlR2xvYmFsLmdsb2JhbCA9PT0gZnJlZUdsb2JhbCB8fCBmcmVlR2xvYmFsLndpbmRvdyA9PT0gZnJlZUdsb2JhbCkge1xuXHRcdHJvb3QgPSBmcmVlR2xvYmFsO1xuXHR9XG5cblx0LyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblx0dmFyIEludmFsaWRDaGFyYWN0ZXJFcnJvciA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHR9O1xuXHRJbnZhbGlkQ2hhcmFjdGVyRXJyb3IucHJvdG90eXBlID0gbmV3IEVycm9yO1xuXHRJbnZhbGlkQ2hhcmFjdGVyRXJyb3IucHJvdG90eXBlLm5hbWUgPSAnSW52YWxpZENoYXJhY3RlckVycm9yJztcblxuXHR2YXIgZXJyb3IgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cdFx0Ly8gTm90ZTogdGhlIGVycm9yIG1lc3NhZ2VzIHVzZWQgdGhyb3VnaG91dCB0aGlzIGZpbGUgbWF0Y2ggdGhvc2UgdXNlZCBieVxuXHRcdC8vIHRoZSBuYXRpdmUgYGF0b2JgL2BidG9hYCBpbXBsZW1lbnRhdGlvbiBpbiBDaHJvbWl1bS5cblx0XHR0aHJvdyBuZXcgSW52YWxpZENoYXJhY3RlckVycm9yKG1lc3NhZ2UpO1xuXHR9O1xuXG5cdHZhciBUQUJMRSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblx0Ly8gaHR0cDovL3doYXR3Zy5vcmcvaHRtbC9jb21tb24tbWljcm9zeW50YXhlcy5odG1sI3NwYWNlLWNoYXJhY3RlclxuXHR2YXIgUkVHRVhfU1BBQ0VfQ0hBUkFDVEVSUyA9IC9bXFx0XFxuXFxmXFxyIF0vZztcblxuXHQvLyBgZGVjb2RlYCBpcyBkZXNpZ25lZCB0byBiZSBmdWxseSBjb21wYXRpYmxlIHdpdGggYGF0b2JgIGFzIGRlc2NyaWJlZCBpbiB0aGVcblx0Ly8gSFRNTCBTdGFuZGFyZC4gaHR0cDovL3doYXR3Zy5vcmcvaHRtbC93ZWJhcHBhcGlzLmh0bWwjZG9tLXdpbmRvd2Jhc2U2NC1hdG9iXG5cdC8vIFRoZSBvcHRpbWl6ZWQgYmFzZTY0LWRlY29kaW5nIGFsZ29yaXRobSB1c2VkIGlzIGJhc2VkIG9uIEBhdGvigJlzIGV4Y2VsbGVudFxuXHQvLyBpbXBsZW1lbnRhdGlvbi4gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vYXRrLzEwMjAzOTZcblx0dmFyIGRlY29kZSA9IGZ1bmN0aW9uKGlucHV0KSB7XG5cdFx0aW5wdXQgPSBTdHJpbmcoaW5wdXQpXG5cdFx0XHQucmVwbGFjZShSRUdFWF9TUEFDRV9DSEFSQUNURVJTLCAnJyk7XG5cdFx0dmFyIGxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcblx0XHRpZiAobGVuZ3RoICUgNCA9PSAwKSB7XG5cdFx0XHRpbnB1dCA9IGlucHV0LnJlcGxhY2UoLz09PyQvLCAnJyk7XG5cdFx0XHRsZW5ndGggPSBpbnB1dC5sZW5ndGg7XG5cdFx0fVxuXHRcdGlmIChcblx0XHRcdGxlbmd0aCAlIDQgPT0gMSB8fFxuXHRcdFx0Ly8gaHR0cDovL3doYXR3Zy5vcmcvQyNhbHBoYW51bWVyaWMtYXNjaWktY2hhcmFjdGVyc1xuXHRcdFx0L1teK2EtekEtWjAtOS9dLy50ZXN0KGlucHV0KVxuXHRcdCkge1xuXHRcdFx0ZXJyb3IoXG5cdFx0XHRcdCdJbnZhbGlkIGNoYXJhY3RlcjogdGhlIHN0cmluZyB0byBiZSBkZWNvZGVkIGlzIG5vdCBjb3JyZWN0bHkgZW5jb2RlZC4nXG5cdFx0XHQpO1xuXHRcdH1cblx0XHR2YXIgYml0Q291bnRlciA9IDA7XG5cdFx0dmFyIGJpdFN0b3JhZ2U7XG5cdFx0dmFyIGJ1ZmZlcjtcblx0XHR2YXIgb3V0cHV0ID0gJyc7XG5cdFx0dmFyIHBvc2l0aW9uID0gLTE7XG5cdFx0d2hpbGUgKCsrcG9zaXRpb24gPCBsZW5ndGgpIHtcblx0XHRcdGJ1ZmZlciA9IFRBQkxFLmluZGV4T2YoaW5wdXQuY2hhckF0KHBvc2l0aW9uKSk7XG5cdFx0XHRiaXRTdG9yYWdlID0gYml0Q291bnRlciAlIDQgPyBiaXRTdG9yYWdlICogNjQgKyBidWZmZXIgOiBidWZmZXI7XG5cdFx0XHQvLyBVbmxlc3MgdGhpcyBpcyB0aGUgZmlyc3Qgb2YgYSBncm91cCBvZiA0IGNoYXJhY3RlcnPigKZcblx0XHRcdGlmIChiaXRDb3VudGVyKysgJSA0KSB7XG5cdFx0XHRcdC8vIOKApmNvbnZlcnQgdGhlIGZpcnN0IDggYml0cyB0byBhIHNpbmdsZSBBU0NJSSBjaGFyYWN0ZXIuXG5cdFx0XHRcdG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKFxuXHRcdFx0XHRcdDB4RkYgJiBiaXRTdG9yYWdlID4+ICgtMiAqIGJpdENvdW50ZXIgJiA2KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gb3V0cHV0O1xuXHR9O1xuXG5cdC8vIGBlbmNvZGVgIGlzIGRlc2lnbmVkIHRvIGJlIGZ1bGx5IGNvbXBhdGlibGUgd2l0aCBgYnRvYWAgYXMgZGVzY3JpYmVkIGluIHRoZVxuXHQvLyBIVE1MIFN0YW5kYXJkOiBodHRwOi8vd2hhdHdnLm9yZy9odG1sL3dlYmFwcGFwaXMuaHRtbCNkb20td2luZG93YmFzZTY0LWJ0b2Fcblx0dmFyIGVuY29kZSA9IGZ1bmN0aW9uKGlucHV0KSB7XG5cdFx0aW5wdXQgPSBTdHJpbmcoaW5wdXQpO1xuXHRcdGlmICgvW15cXDAtXFx4RkZdLy50ZXN0KGlucHV0KSkge1xuXHRcdFx0Ly8gTm90ZTogbm8gbmVlZCB0byBzcGVjaWFsLWNhc2UgYXN0cmFsIHN5bWJvbHMgaGVyZSwgYXMgc3Vycm9nYXRlcyBhcmVcblx0XHRcdC8vIG1hdGNoZWQsIGFuZCB0aGUgaW5wdXQgaXMgc3VwcG9zZWQgdG8gb25seSBjb250YWluIEFTQ0lJIGFueXdheS5cblx0XHRcdGVycm9yKFxuXHRcdFx0XHQnVGhlIHN0cmluZyB0byBiZSBlbmNvZGVkIGNvbnRhaW5zIGNoYXJhY3RlcnMgb3V0c2lkZSBvZiB0aGUgJyArXG5cdFx0XHRcdCdMYXRpbjEgcmFuZ2UuJ1xuXHRcdFx0KTtcblx0XHR9XG5cdFx0dmFyIHBhZGRpbmcgPSBpbnB1dC5sZW5ndGggJSAzO1xuXHRcdHZhciBvdXRwdXQgPSAnJztcblx0XHR2YXIgcG9zaXRpb24gPSAtMTtcblx0XHR2YXIgYTtcblx0XHR2YXIgYjtcblx0XHR2YXIgYztcblx0XHR2YXIgZDtcblx0XHR2YXIgYnVmZmVyO1xuXHRcdC8vIE1ha2Ugc3VyZSBhbnkgcGFkZGluZyBpcyBoYW5kbGVkIG91dHNpZGUgb2YgdGhlIGxvb3AuXG5cdFx0dmFyIGxlbmd0aCA9IGlucHV0Lmxlbmd0aCAtIHBhZGRpbmc7XG5cblx0XHR3aGlsZSAoKytwb3NpdGlvbiA8IGxlbmd0aCkge1xuXHRcdFx0Ly8gUmVhZCB0aHJlZSBieXRlcywgaS5lLiAyNCBiaXRzLlxuXHRcdFx0YSA9IGlucHV0LmNoYXJDb2RlQXQocG9zaXRpb24pIDw8IDE2O1xuXHRcdFx0YiA9IGlucHV0LmNoYXJDb2RlQXQoKytwb3NpdGlvbikgPDwgODtcblx0XHRcdGMgPSBpbnB1dC5jaGFyQ29kZUF0KCsrcG9zaXRpb24pO1xuXHRcdFx0YnVmZmVyID0gYSArIGIgKyBjO1xuXHRcdFx0Ly8gVHVybiB0aGUgMjQgYml0cyBpbnRvIGZvdXIgY2h1bmtzIG9mIDYgYml0cyBlYWNoLCBhbmQgYXBwZW5kIHRoZVxuXHRcdFx0Ly8gbWF0Y2hpbmcgY2hhcmFjdGVyIGZvciBlYWNoIG9mIHRoZW0gdG8gdGhlIG91dHB1dC5cblx0XHRcdG91dHB1dCArPSAoXG5cdFx0XHRcdFRBQkxFLmNoYXJBdChidWZmZXIgPj4gMTggJiAweDNGKSArXG5cdFx0XHRcdFRBQkxFLmNoYXJBdChidWZmZXIgPj4gMTIgJiAweDNGKSArXG5cdFx0XHRcdFRBQkxFLmNoYXJBdChidWZmZXIgPj4gNiAmIDB4M0YpICtcblx0XHRcdFx0VEFCTEUuY2hhckF0KGJ1ZmZlciAmIDB4M0YpXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGlmIChwYWRkaW5nID09IDIpIHtcblx0XHRcdGEgPSBpbnB1dC5jaGFyQ29kZUF0KHBvc2l0aW9uKSA8PCA4O1xuXHRcdFx0YiA9IGlucHV0LmNoYXJDb2RlQXQoKytwb3NpdGlvbik7XG5cdFx0XHRidWZmZXIgPSBhICsgYjtcblx0XHRcdG91dHB1dCArPSAoXG5cdFx0XHRcdFRBQkxFLmNoYXJBdChidWZmZXIgPj4gMTApICtcblx0XHRcdFx0VEFCTEUuY2hhckF0KChidWZmZXIgPj4gNCkgJiAweDNGKSArXG5cdFx0XHRcdFRBQkxFLmNoYXJBdCgoYnVmZmVyIDw8IDIpICYgMHgzRikgK1xuXHRcdFx0XHQnPSdcblx0XHRcdCk7XG5cdFx0fSBlbHNlIGlmIChwYWRkaW5nID09IDEpIHtcblx0XHRcdGJ1ZmZlciA9IGlucHV0LmNoYXJDb2RlQXQocG9zaXRpb24pO1xuXHRcdFx0b3V0cHV0ICs9IChcblx0XHRcdFx0VEFCTEUuY2hhckF0KGJ1ZmZlciA+PiAyKSArXG5cdFx0XHRcdFRBQkxFLmNoYXJBdCgoYnVmZmVyIDw8IDQpICYgMHgzRikgK1xuXHRcdFx0XHQnPT0nXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH07XG5cblx0dmFyIGJhc2U2NCA9IHtcblx0XHQnZW5jb2RlJzogZW5jb2RlLFxuXHRcdCdkZWNvZGUnOiBkZWNvZGUsXG5cdFx0J3ZlcnNpb24nOiAnMC4xLjAnXG5cdH07XG5cblx0Ly8gU29tZSBBTUQgYnVpbGQgb3B0aW1pemVycywgbGlrZSByLmpzLCBjaGVjayBmb3Igc3BlY2lmaWMgY29uZGl0aW9uIHBhdHRlcm5zXG5cdC8vIGxpa2UgdGhlIGZvbGxvd2luZzpcblx0aWYgKFxuXHRcdHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnICYmXG5cdFx0ZGVmaW5lLmFtZFxuXHQpIHtcblx0XHRkZWZpbmUoZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gYmFzZTY0O1xuXHRcdH0pO1xuXHR9XHRlbHNlIGlmIChmcmVlRXhwb3J0cyAmJiAhZnJlZUV4cG9ydHMubm9kZVR5cGUpIHtcblx0XHRpZiAoZnJlZU1vZHVsZSkgeyAvLyBpbiBOb2RlLmpzIG9yIFJpbmdvSlMgdjAuOC4wK1xuXHRcdFx0ZnJlZU1vZHVsZS5leHBvcnRzID0gYmFzZTY0O1xuXHRcdH0gZWxzZSB7IC8vIGluIE5hcndoYWwgb3IgUmluZ29KUyB2MC43LjAtXG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gYmFzZTY0KSB7XG5cdFx0XHRcdGJhc2U2NC5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIChmcmVlRXhwb3J0c1trZXldID0gYmFzZTY0W2tleV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHsgLy8gaW4gUmhpbm8gb3IgYSB3ZWIgYnJvd3NlclxuXHRcdHJvb3QuYmFzZTY0ID0gYmFzZTY0O1xuXHR9XG5cbn0odGhpcykpO1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydHMuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcbmV4cG9ydHMudG9CeXRlQXJyYXkgPSB0b0J5dGVBcnJheVxuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gZnJvbUJ5dGVBcnJheVxuXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxuXG52YXIgY29kZSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJ1xuZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgbG9va3VwW2ldID0gY29kZVtpXVxuICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGlcbn1cblxucmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG5yZXZMb29rdXBbJ18nLmNoYXJDb2RlQXQoMCldID0gNjNcblxuZnVuY3Rpb24gcGxhY2VIb2xkZXJzQ291bnQgKGI2NCkge1xuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuICBpZiAobGVuICUgNCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuICB9XG5cbiAgLy8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcbiAgLy8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuICAvLyByZXByZXNlbnQgb25lIGJ5dGVcbiAgLy8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG4gIC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2VcbiAgcmV0dXJuIGI2NFtsZW4gLSAyXSA9PT0gJz0nID8gMiA6IGI2NFtsZW4gLSAxXSA9PT0gJz0nID8gMSA6IDBcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoYjY0KSB7XG4gIC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuICByZXR1cm4gKGI2NC5sZW5ndGggKiAzIC8gNCkgLSBwbGFjZUhvbGRlcnNDb3VudChiNjQpXG59XG5cbmZ1bmN0aW9uIHRvQnl0ZUFycmF5IChiNjQpIHtcbiAgdmFyIGksIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcbiAgdmFyIGxlbiA9IGI2NC5sZW5ndGhcbiAgcGxhY2VIb2xkZXJzID0gcGxhY2VIb2xkZXJzQ291bnQoYjY0KVxuXG4gIGFyciA9IG5ldyBBcnIoKGxlbiAqIDMgLyA0KSAtIHBsYWNlSG9sZGVycylcblxuICAvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG4gIGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gbGVuIC0gNCA6IGxlblxuXG4gIHZhciBMID0gMFxuXG4gIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDQpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxOCkgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgMTIpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildIDw8IDYpIHwgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAzKV1cbiAgICBhcnJbTCsrXSA9ICh0bXAgPj4gMTYpICYgMHhGRlxuICAgIGFycltMKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcbiAgICB0bXAgPSAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAyKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA+PiA0KVxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDEwKSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCA0KSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA+PiAyKVxuICAgIGFycltMKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbTCsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcbiAgcmV0dXJuIGxvb2t1cFtudW0gPj4gMTggJiAweDNGXSArIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArIGxvb2t1cFtudW0gPj4gNiAmIDB4M0ZdICsgbG9va3VwW251bSAmIDB4M0ZdXG59XG5cbmZ1bmN0aW9uIGVuY29kZUNodW5rICh1aW50OCwgc3RhcnQsIGVuZCkge1xuICB2YXIgdG1wXG4gIHZhciBvdXRwdXQgPSBbXVxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkgKz0gMykge1xuICAgIHRtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcbiAgICBvdXRwdXQucHVzaCh0cmlwbGV0VG9CYXNlNjQodG1wKSlcbiAgfVxuICByZXR1cm4gb3V0cHV0LmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGZyb21CeXRlQXJyYXkgKHVpbnQ4KSB7XG4gIHZhciB0bXBcbiAgdmFyIGxlbiA9IHVpbnQ4Lmxlbmd0aFxuICB2YXIgZXh0cmFCeXRlcyA9IGxlbiAlIDMgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcbiAgdmFyIG91dHB1dCA9ICcnXG4gIHZhciBwYXJ0cyA9IFtdXG4gIHZhciBtYXhDaHVua0xlbmd0aCA9IDE2MzgzIC8vIG11c3QgYmUgbXVsdGlwbGUgb2YgM1xuXG4gIC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbjIgPSBsZW4gLSBleHRyYUJ5dGVzOyBpIDwgbGVuMjsgaSArPSBtYXhDaHVua0xlbmd0aCkge1xuICAgIHBhcnRzLnB1c2goZW5jb2RlQ2h1bmsodWludDgsIGksIChpICsgbWF4Q2h1bmtMZW5ndGgpID4gbGVuMiA/IGxlbjIgOiAoaSArIG1heENodW5rTGVuZ3RoKSkpXG4gIH1cblxuICAvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG4gIGlmIChleHRyYUJ5dGVzID09PSAxKSB7XG4gICAgdG1wID0gdWludDhbbGVuIC0gMV1cbiAgICBvdXRwdXQgKz0gbG9va3VwW3RtcCA+PiAyXVxuICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA8PCA0KSAmIDB4M0ZdXG4gICAgb3V0cHV0ICs9ICc9PSdcbiAgfSBlbHNlIGlmIChleHRyYUJ5dGVzID09PSAyKSB7XG4gICAgdG1wID0gKHVpbnQ4W2xlbiAtIDJdIDw8IDgpICsgKHVpbnQ4W2xlbiAtIDFdKVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDEwXVxuICAgIG91dHB1dCArPSBsb29rdXBbKHRtcCA+PiA0KSAmIDB4M0ZdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDIpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz0nXG4gIH1cblxuICBwYXJ0cy5wdXNoKG91dHB1dClcblxuICByZXR1cm4gcGFydHMuam9pbignJylcbn1cbiIsIiIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cbid1c2Ugc3RyaWN0J1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBTbG93QnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcblxudmFyIEtfTUFYX0xFTkdUSCA9IDB4N2ZmZmZmZmZcbmV4cG9ydHMua01heExlbmd0aCA9IEtfTUFYX0xFTkdUSFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBQcmludCB3YXJuaW5nIGFuZCByZWNvbW1lbmQgdXNpbmcgYGJ1ZmZlcmAgdjQueCB3aGljaCBoYXMgYW4gT2JqZWN0XG4gKiAgICAgICAgICAgICAgIGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBXZSByZXBvcnQgdGhhdCB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBpZiB0aGUgYXJlIG5vdCBzdWJjbGFzc2FibGVcbiAqIHVzaW5nIF9fcHJvdG9fXy4gRmlyZWZveCA0LTI5IGxhY2tzIHN1cHBvcnQgZm9yIGFkZGluZyBuZXcgcHJvcGVydGllcyB0byBgVWludDhBcnJheWBcbiAqIChTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOCkuIElFIDEwIGxhY2tzIHN1cHBvcnRcbiAqIGZvciBfX3Byb3RvX18gYW5kIGhhcyBhIGJ1Z2d5IHR5cGVkIGFycmF5IGltcGxlbWVudGF0aW9uLlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IHR5cGVkQXJyYXlTdXBwb3J0KClcblxuaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgY29uc29sZS5lcnJvciA9PT0gJ2Z1bmN0aW9uJykge1xuICBjb25zb2xlLmVycm9yKFxuICAgICdUaGlzIGJyb3dzZXIgbGFja3MgdHlwZWQgYXJyYXkgKFVpbnQ4QXJyYXkpIHN1cHBvcnQgd2hpY2ggaXMgcmVxdWlyZWQgYnkgJyArXG4gICAgJ2BidWZmZXJgIHY1LnguIFVzZSBgYnVmZmVyYCB2NC54IGlmIHlvdSByZXF1aXJlIG9sZCBicm93c2VyIHN1cHBvcnQuJ1xuICApXG59XG5cbmZ1bmN0aW9uIHR5cGVkQXJyYXlTdXBwb3J0ICgpIHtcbiAgLy8gQ2FuIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkP1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAgIGFyci5fX3Byb3RvX18gPSB7X19wcm90b19fOiBVaW50OEFycmF5LnByb3RvdHlwZSwgZm9vOiBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9fVxuICAgIHJldHVybiBhcnIuZm9vKCkgPT09IDQyXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAobGVuZ3RoID4gS19NQVhfTEVOR1RIKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgdHlwZWQgYXJyYXkgbGVuZ3RoJylcbiAgfVxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkobGVuZ3RoKVxuICBidWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gYnVmXG59XG5cbi8qKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBoYXZlIHRoZWlyXG4gKiBwcm90b3R5cGUgY2hhbmdlZCB0byBgQnVmZmVyLnByb3RvdHlwZWAuIEZ1cnRoZXJtb3JlLCBgQnVmZmVyYCBpcyBhIHN1YmNsYXNzIG9mXG4gKiBgVWludDhBcnJheWAsIHNvIHRoZSByZXR1cm5lZCBpbnN0YW5jZXMgd2lsbCBoYXZlIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBtZXRob2RzXG4gKiBhbmQgdGhlIGBVaW50OEFycmF5YCBtZXRob2RzLiBTcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdFxuICogcmV0dXJucyBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBUaGUgYFVpbnQ4QXJyYXlgIHByb3RvdHlwZSByZW1haW5zIHVubW9kaWZpZWQuXG4gKi9cblxuZnVuY3Rpb24gQnVmZmVyIChhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICAvLyBDb21tb24gY2FzZS5cbiAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZ09yT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnSWYgZW5jb2RpbmcgaXMgc3BlY2lmaWVkIHRoZW4gdGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBhbGxvY1Vuc2FmZShhcmcpXG4gIH1cbiAgcmV0dXJuIGZyb20oYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbi8vIEZpeCBzdWJhcnJheSgpIGluIEVTMjAxNi4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzk3XG5pZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnNwZWNpZXMgJiZcbiAgICBCdWZmZXJbU3ltYm9sLnNwZWNpZXNdID09PSBCdWZmZXIpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlciwgU3ltYm9sLnNwZWNpZXMsIHtcbiAgICB2YWx1ZTogbnVsbCxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgd3JpdGFibGU6IGZhbHNlXG4gIH0pXG59XG5cbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTIgLy8gbm90IHVzZWQgYnkgdGhpcyBpbXBsZW1lbnRhdGlvblxuXG5mdW5jdGlvbiBmcm9tICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIGEgbnVtYmVyJylcbiAgfVxuXG4gIGlmIChpc0FycmF5QnVmZmVyKHZhbHVlKSkge1xuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZyb21TdHJpbmcodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQpXG4gIH1cblxuICByZXR1cm4gZnJvbU9iamVjdCh2YWx1ZSlcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsbHkgZXF1aXZhbGVudCB0byBCdWZmZXIoYXJnLCBlbmNvZGluZykgYnV0IHRocm93cyBhIFR5cGVFcnJvclxuICogaWYgdmFsdWUgaXMgYSBudW1iZXIuXG4gKiBCdWZmZXIuZnJvbShzdHJbLCBlbmNvZGluZ10pXG4gKiBCdWZmZXIuZnJvbShhcnJheSlcbiAqIEJ1ZmZlci5mcm9tKGJ1ZmZlcilcbiAqIEJ1ZmZlci5mcm9tKGFycmF5QnVmZmVyWywgYnl0ZU9mZnNldFssIGxlbmd0aF1dKVxuICoqL1xuQnVmZmVyLmZyb20gPSBmdW5jdGlvbiAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gZnJvbSh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG4vLyBOb3RlOiBDaGFuZ2UgcHJvdG90eXBlICphZnRlciogQnVmZmVyLmZyb20gaXMgZGVmaW5lZCB0byB3b3JrYXJvdW5kIENocm9tZSBidWc6XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzE0OFxuQnVmZmVyLnByb3RvdHlwZS5fX3Byb3RvX18gPSBVaW50OEFycmF5LnByb3RvdHlwZVxuQnVmZmVyLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXlcblxuZnVuY3Rpb24gYXNzZXJ0U2l6ZSAoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBiZSBhIG51bWJlcicpXG4gIH0gZWxzZSBpZiAoc2l6ZSA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgbmVnYXRpdmUnKVxuICB9XG59XG5cbmZ1bmN0aW9uIGFsbG9jIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIGlmIChzaXplIDw9IDApIHtcbiAgICByZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUpXG4gIH1cbiAgaWYgKGZpbGwgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIE9ubHkgcGF5IGF0dGVudGlvbiB0byBlbmNvZGluZyBpZiBpdCdzIGEgc3RyaW5nLiBUaGlzXG4gICAgLy8gcHJldmVudHMgYWNjaWRlbnRhbGx5IHNlbmRpbmcgaW4gYSBudW1iZXIgdGhhdCB3b3VsZFxuICAgIC8vIGJlIGludGVycHJldHRlZCBhcyBhIHN0YXJ0IG9mZnNldC5cbiAgICByZXR1cm4gdHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJ1xuICAgICAgPyBjcmVhdGVCdWZmZXIoc2l6ZSkuZmlsbChmaWxsLCBlbmNvZGluZylcbiAgICAgIDogY3JlYXRlQnVmZmVyKHNpemUpLmZpbGwoZmlsbClcbiAgfVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUpXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBmaWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogYWxsb2Moc2l6ZVssIGZpbGxbLCBlbmNvZGluZ11dKVxuICoqL1xuQnVmZmVyLmFsbG9jID0gZnVuY3Rpb24gKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIHJldHVybiBhbGxvYyhzaXplLCBmaWxsLCBlbmNvZGluZylcbn1cblxuZnVuY3Rpb24gYWxsb2NVbnNhZmUgKHNpemUpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUgPCAwID8gMCA6IGNoZWNrZWQoc2l6ZSkgfCAwKVxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gQnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKHNpemUpXG59XG4vKipcbiAqIEVxdWl2YWxlbnQgdG8gU2xvd0J1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICovXG5CdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgcmV0dXJuIGFsbG9jVW5zYWZlKHNpemUpXG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgfVxuXG4gIGlmICghQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJlbmNvZGluZ1wiIG11c3QgYmUgYSB2YWxpZCBzdHJpbmcgZW5jb2RpbmcnKVxuICB9XG5cbiAgdmFyIGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIHZhciBidWYgPSBjcmVhdGVCdWZmZXIobGVuZ3RoKVxuXG4gIHZhciBhY3R1YWwgPSBidWYud3JpdGUoc3RyaW5nLCBlbmNvZGluZylcblxuICBpZiAoYWN0dWFsICE9PSBsZW5ndGgpIHtcbiAgICAvLyBXcml0aW5nIGEgaGV4IHN0cmluZywgZm9yIGV4YW1wbGUsIHRoYXQgY29udGFpbnMgaW52YWxpZCBjaGFyYWN0ZXJzIHdpbGxcbiAgICAvLyBjYXVzZSBldmVyeXRoaW5nIGFmdGVyIHRoZSBmaXJzdCBpbnZhbGlkIGNoYXJhY3RlciB0byBiZSBpZ25vcmVkLiAoZS5nLlxuICAgIC8vICdhYnh4Y2QnIHdpbGwgYmUgdHJlYXRlZCBhcyAnYWInKVxuICAgIGJ1ZiA9IGJ1Zi5zbGljZSgwLCBhY3R1YWwpXG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUxpa2UgKGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGggPCAwID8gMCA6IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdmFyIGJ1ZiA9IGNyZWF0ZUJ1ZmZlcihsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICBidWZbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyIChhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdvZmZzZXRcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgKyAobGVuZ3RoIHx8IDApKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ2xlbmd0aFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIHZhciBidWZcbiAgaWYgKGJ5dGVPZmZzZXQgPT09IHVuZGVmaW5lZCAmJiBsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5KVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQpXG4gIH0gZWxzZSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlXG4gIGJ1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAob2JqKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIob2JqKSkge1xuICAgIHZhciBsZW4gPSBjaGVja2VkKG9iai5sZW5ndGgpIHwgMFxuICAgIHZhciBidWYgPSBjcmVhdGVCdWZmZXIobGVuKVxuXG4gICAgaWYgKGJ1Zi5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBidWZcbiAgICB9XG5cbiAgICBvYmouY29weShidWYsIDAsIDAsIGxlbilcbiAgICByZXR1cm4gYnVmXG4gIH1cblxuICBpZiAob2JqKSB7XG4gICAgaWYgKGlzQXJyYXlCdWZmZXJWaWV3KG9iaikgfHwgJ2xlbmd0aCcgaW4gb2JqKSB7XG4gICAgICBpZiAodHlwZW9mIG9iai5sZW5ndGggIT09ICdudW1iZXInIHx8IG51bWJlcklzTmFOKG9iai5sZW5ndGgpKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVCdWZmZXIoMClcbiAgICAgIH1cbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKG9iailcbiAgICB9XG5cbiAgICBpZiAob2JqLnR5cGUgPT09ICdCdWZmZXInICYmIEFycmF5LmlzQXJyYXkob2JqLmRhdGEpKSB7XG4gICAgICByZXR1cm4gZnJvbUFycmF5TGlrZShvYmouZGF0YSlcbiAgICB9XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nLCBCdWZmZXIsIEFycmF5QnVmZmVyLCBBcnJheSwgb3IgYXJyYXktbGlrZSBvYmplY3QuJylcbn1cblxuZnVuY3Rpb24gY2hlY2tlZCAobGVuZ3RoKSB7XG4gIC8vIE5vdGU6IGNhbm5vdCB1c2UgYGxlbmd0aCA8IEtfTUFYX0xFTkdUSGAgaGVyZSBiZWNhdXNlIHRoYXQgZmFpbHMgd2hlblxuICAvLyBsZW5ndGggaXMgTmFOICh3aGljaCBpcyBvdGhlcndpc2UgY29lcmNlZCB0byB6ZXJvLilcbiAgaWYgKGxlbmd0aCA+PSBLX01BWF9MRU5HVEgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnc2l6ZTogMHgnICsgS19NQVhfTEVOR1RILnRvU3RyaW5nKDE2KSArICcgYnl0ZXMnKVxuICB9XG4gIHJldHVybiBsZW5ndGggfCAwXG59XG5cbmZ1bmN0aW9uIFNsb3dCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAoK2xlbmd0aCAhPSBsZW5ndGgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbiAgICBsZW5ndGggPSAwXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5hbGxvYygrbGVuZ3RoKVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiBpc0J1ZmZlciAoYikge1xuICByZXR1cm4gYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyID09PSB0cnVlXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihhKSB8fCAhQnVmZmVyLmlzQnVmZmVyKGIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIG11c3QgYmUgQnVmZmVycycpXG4gIH1cblxuICBpZiAoYSA9PT0gYikgcmV0dXJuIDBcblxuICB2YXIgeCA9IGEubGVuZ3RoXG4gIHZhciB5ID0gYi5sZW5ndGhcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXVxuICAgICAgeSA9IGJbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIGlzRW5jb2RpbmcgKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gY29uY2F0IChsaXN0LCBsZW5ndGgpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGxpc3QpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBCdWZmZXIuYWxsb2MoMClcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGxlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgbGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShsZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIGJ1ZiA9IGxpc3RbaV1cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmxlbmd0aFxuICB9XG4gIGlmIChpc0FycmF5QnVmZmVyVmlldyhzdHJpbmcpIHx8IGlzQXJyYXlCdWZmZXIoc3RyaW5nKSkge1xuICAgIHJldHVybiBzdHJpbmcuYnl0ZUxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuICAgIHN0cmluZyA9ICcnICsgc3RyaW5nXG4gIH1cblxuICB2YXIgbGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAobGVuID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIFVzZSBhIGZvciBsb29wIHRvIGF2b2lkIHJlY3Vyc2lvblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsZW5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIGxlbiAqIDJcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBsZW4gPj4+IDFcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aCAvLyBhc3N1bWUgdXRmOFxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuQnVmZmVyLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5cbmZ1bmN0aW9uIHNsb3dUb1N0cmluZyAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcblxuICAvLyBObyBuZWVkIHRvIHZlcmlmeSB0aGF0IFwidGhpcy5sZW5ndGggPD0gTUFYX1VJTlQzMlwiIHNpbmNlIGl0J3MgYSByZWFkLW9ubHlcbiAgLy8gcHJvcGVydHkgb2YgYSB0eXBlZCBhcnJheS5cblxuICAvLyBUaGlzIGJlaGF2ZXMgbmVpdGhlciBsaWtlIFN0cmluZyBub3IgVWludDhBcnJheSBpbiB0aGF0IHdlIHNldCBzdGFydC9lbmRcbiAgLy8gdG8gdGhlaXIgdXBwZXIvbG93ZXIgYm91bmRzIGlmIHRoZSB2YWx1ZSBwYXNzZWQgaXMgb3V0IG9mIHJhbmdlLlxuICAvLyB1bmRlZmluZWQgaXMgaGFuZGxlZCBzcGVjaWFsbHkgYXMgcGVyIEVDTUEtMjYyIDZ0aCBFZGl0aW9uLFxuICAvLyBTZWN0aW9uIDEzLjMuMy43IFJ1bnRpbWUgU2VtYW50aWNzOiBLZXllZEJpbmRpbmdJbml0aWFsaXphdGlvbi5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQgfHwgc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgLy8gUmV0dXJuIGVhcmx5IGlmIHN0YXJ0ID4gdGhpcy5sZW5ndGguIERvbmUgaGVyZSB0byBwcmV2ZW50IHBvdGVudGlhbCB1aW50MzJcbiAgLy8gY29lcmNpb24gZmFpbCBiZWxvdy5cbiAgaWYgKHN0YXJ0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCB8fCBlbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoZW5kIDw9IDApIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIC8vIEZvcmNlIGNvZXJzaW9uIHRvIHVpbnQzMi4gVGhpcyB3aWxsIGFsc28gY29lcmNlIGZhbHNleS9OYU4gdmFsdWVzIHRvIDAuXG4gIGVuZCA+Pj49IDBcbiAgc3RhcnQgPj4+PSAwXG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGF0aW4xU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1dGYxNmxlU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKGVuY29kaW5nICsgJycpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbi8vIFRoaXMgcHJvcGVydHkgaXMgdXNlZCBieSBgQnVmZmVyLmlzQnVmZmVyYCAoYW5kIHRoZSBgaXMtYnVmZmVyYCBucG0gcGFja2FnZSlcbi8vIHRvIGRldGVjdCBhIEJ1ZmZlciBpbnN0YW5jZS4gSXQncyBub3QgcG9zc2libGUgdG8gdXNlIGBpbnN0YW5jZW9mIEJ1ZmZlcmBcbi8vIHJlbGlhYmx5IGluIGEgYnJvd3NlcmlmeSBjb250ZXh0IGJlY2F1c2UgdGhlcmUgY291bGQgYmUgbXVsdGlwbGUgZGlmZmVyZW50XG4vLyBjb3BpZXMgb2YgdGhlICdidWZmZXInIHBhY2thZ2UgaW4gdXNlLiBUaGlzIG1ldGhvZCB3b3JrcyBldmVuIGZvciBCdWZmZXJcbi8vIGluc3RhbmNlcyB0aGF0IHdlcmUgY3JlYXRlZCBmcm9tIGFub3RoZXIgY29weSBvZiB0aGUgYGJ1ZmZlcmAgcGFja2FnZS5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvaXNzdWVzLzE1NFxuQnVmZmVyLnByb3RvdHlwZS5faXNCdWZmZXIgPSB0cnVlXG5cbmZ1bmN0aW9uIHN3YXAgKGIsIG4sIG0pIHtcbiAgdmFyIGkgPSBiW25dXG4gIGJbbl0gPSBiW21dXG4gIGJbbV0gPSBpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDE2ID0gZnVuY3Rpb24gc3dhcDE2ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSAyICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAxNi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMSlcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAzMiA9IGZ1bmN0aW9uIHN3YXAzMiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgNCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMzItYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDMpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDIpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwNjQgPSBmdW5jdGlvbiBzd2FwNjQgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDggIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDY0LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDgpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyA3KVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyA2KVxuICAgIHN3YXAodGhpcywgaSArIDIsIGkgKyA1KVxuICAgIHN3YXAodGhpcywgaSArIDMsIGkgKyA0KVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIHRydWVcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpID09PSAwXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QgKCkge1xuICB2YXIgc3RyID0gJydcbiAgdmFyIG1heCA9IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVNcbiAgaWYgKHRoaXMubGVuZ3RoID4gMCkge1xuICAgIHN0ciA9IHRoaXMudG9TdHJpbmcoJ2hleCcsIDAsIG1heCkubWF0Y2goLy57Mn0vZykuam9pbignICcpXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbWF4KSBzdHIgKz0gJyAuLi4gJ1xuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgc3RyICsgJz4nXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKHRhcmdldCwgc3RhcnQsIGVuZCwgdGhpc1N0YXJ0LCB0aGlzRW5kKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgfVxuXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5kID0gdGFyZ2V0ID8gdGFyZ2V0Lmxlbmd0aCA6IDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzU3RhcnQgPSAwXG4gIH1cbiAgaWYgKHRoaXNFbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNFbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBlbmQgPiB0YXJnZXQubGVuZ3RoIHx8IHRoaXNTdGFydCA8IDAgfHwgdGhpc0VuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ291dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQgJiYgc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIHN0YXJ0ID4+Pj0gMFxuICBlbmQgPj4+PSAwXG4gIHRoaXNTdGFydCA+Pj49IDBcbiAgdGhpc0VuZCA+Pj49IDBcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0KSByZXR1cm4gMFxuXG4gIHZhciB4ID0gdGhpc0VuZCAtIHRoaXNTdGFydFxuICB2YXIgeSA9IGVuZCAtIHN0YXJ0XG4gIHZhciBsZW4gPSBNYXRoLm1pbih4LCB5KVxuXG4gIHZhciB0aGlzQ29weSA9IHRoaXMuc2xpY2UodGhpc1N0YXJ0LCB0aGlzRW5kKVxuICB2YXIgdGFyZ2V0Q29weSA9IHRhcmdldC5zbGljZShzdGFydCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAodGhpc0NvcHlbaV0gIT09IHRhcmdldENvcHlbaV0pIHtcbiAgICAgIHggPSB0aGlzQ29weVtpXVxuICAgICAgeSA9IHRhcmdldENvcHlbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG4vLyBGaW5kcyBlaXRoZXIgdGhlIGZpcnN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA+PSBgYnl0ZU9mZnNldGAsXG4vLyBPUiB0aGUgbGFzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPD0gYGJ5dGVPZmZzZXRgLlxuLy9cbi8vIEFyZ3VtZW50czpcbi8vIC0gYnVmZmVyIC0gYSBCdWZmZXIgdG8gc2VhcmNoXG4vLyAtIHZhbCAtIGEgc3RyaW5nLCBCdWZmZXIsIG9yIG51bWJlclxuLy8gLSBieXRlT2Zmc2V0IC0gYW4gaW5kZXggaW50byBgYnVmZmVyYDsgd2lsbCBiZSBjbGFtcGVkIHRvIGFuIGludDMyXG4vLyAtIGVuY29kaW5nIC0gYW4gb3B0aW9uYWwgZW5jb2RpbmcsIHJlbGV2YW50IGlzIHZhbCBpcyBhIHN0cmluZ1xuLy8gLSBkaXIgLSB0cnVlIGZvciBpbmRleE9mLCBmYWxzZSBmb3IgbGFzdEluZGV4T2ZcbmZ1bmN0aW9uIGJpZGlyZWN0aW9uYWxJbmRleE9mIChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICAvLyBFbXB0eSBidWZmZXIgbWVhbnMgbm8gbWF0Y2hcbiAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHJldHVybiAtMVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0XG4gIGlmICh0eXBlb2YgYnl0ZU9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IGJ5dGVPZmZzZXRcbiAgICBieXRlT2Zmc2V0ID0gMFxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPiAweDdmZmZmZmZmKSB7XG4gICAgYnl0ZU9mZnNldCA9IDB4N2ZmZmZmZmZcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgLTB4ODAwMDAwMDApIHtcbiAgICBieXRlT2Zmc2V0ID0gLTB4ODAwMDAwMDBcbiAgfVxuICBieXRlT2Zmc2V0ID0gK2J5dGVPZmZzZXQgIC8vIENvZXJjZSB0byBOdW1iZXIuXG4gIGlmIChudW1iZXJJc05hTihieXRlT2Zmc2V0KSkge1xuICAgIC8vIGJ5dGVPZmZzZXQ6IGl0IGl0J3MgdW5kZWZpbmVkLCBudWxsLCBOYU4sIFwiZm9vXCIsIGV0Yywgc2VhcmNoIHdob2xlIGJ1ZmZlclxuICAgIGJ5dGVPZmZzZXQgPSBkaXIgPyAwIDogKGJ1ZmZlci5sZW5ndGggLSAxKVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXQ6IG5lZ2F0aXZlIG9mZnNldHMgc3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBidWZmZXJcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwKSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCArIGJ5dGVPZmZzZXRcbiAgaWYgKGJ5dGVPZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkge1xuICAgIGlmIChkaXIpIHJldHVybiAtMVxuICAgIGVsc2UgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggLSAxXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IDApIHtcbiAgICBpZiAoZGlyKSBieXRlT2Zmc2V0ID0gMFxuICAgIGVsc2UgcmV0dXJuIC0xXG4gIH1cblxuICAvLyBOb3JtYWxpemUgdmFsXG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIHZhbCA9IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gIH1cblxuICAvLyBGaW5hbGx5LCBzZWFyY2ggZWl0aGVyIGluZGV4T2YgKGlmIGRpciBpcyB0cnVlKSBvciBsYXN0SW5kZXhPZlxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHZhbCkpIHtcbiAgICAvLyBTcGVjaWFsIGNhc2U6IGxvb2tpbmcgZm9yIGVtcHR5IHN0cmluZy9idWZmZXIgYWx3YXlzIGZhaWxzXG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMHhGRiAvLyBTZWFyY2ggZm9yIGEgYnl0ZSB2YWx1ZSBbMC0yNTVdXG4gICAgaWYgKHR5cGVvZiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAoZGlyKSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIFsgdmFsIF0sIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCd2YWwgbXVzdCBiZSBzdHJpbmcsIG51bWJlciBvciBCdWZmZXInKVxufVxuXG5mdW5jdGlvbiBhcnJheUluZGV4T2YgKGFyciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIHZhciBpbmRleFNpemUgPSAxXG4gIHZhciBhcnJMZW5ndGggPSBhcnIubGVuZ3RoXG4gIHZhciB2YWxMZW5ndGggPSB2YWwubGVuZ3RoXG5cbiAgaWYgKGVuY29kaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgIGlmIChlbmNvZGluZyA9PT0gJ3VjczInIHx8IGVuY29kaW5nID09PSAndWNzLTInIHx8XG4gICAgICAgIGVuY29kaW5nID09PSAndXRmMTZsZScgfHwgZW5jb2RpbmcgPT09ICd1dGYtMTZsZScpIHtcbiAgICAgIGlmIChhcnIubGVuZ3RoIDwgMiB8fCB2YWwubGVuZ3RoIDwgMikge1xuICAgICAgICByZXR1cm4gLTFcbiAgICAgIH1cbiAgICAgIGluZGV4U2l6ZSA9IDJcbiAgICAgIGFyckxlbmd0aCAvPSAyXG4gICAgICB2YWxMZW5ndGggLz0gMlxuICAgICAgYnl0ZU9mZnNldCAvPSAyXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZCAoYnVmLCBpKSB7XG4gICAgaWYgKGluZGV4U2l6ZSA9PT0gMSkge1xuICAgICAgcmV0dXJuIGJ1ZltpXVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYnVmLnJlYWRVSW50MTZCRShpICogaW5kZXhTaXplKVxuICAgIH1cbiAgfVxuXG4gIHZhciBpXG4gIGlmIChkaXIpIHtcbiAgICB2YXIgZm91bmRJbmRleCA9IC0xXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA8IGFyckxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocmVhZChhcnIsIGkpID09PSByZWFkKHZhbCwgZm91bmRJbmRleCA9PT0gLTEgPyAwIDogaSAtIGZvdW5kSW5kZXgpKSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ID09PSAtMSkgZm91bmRJbmRleCA9IGlcbiAgICAgICAgaWYgKGkgLSBmb3VuZEluZGV4ICsgMSA9PT0gdmFsTGVuZ3RoKSByZXR1cm4gZm91bmRJbmRleCAqIGluZGV4U2l6ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggIT09IC0xKSBpIC09IGkgLSBmb3VuZEluZGV4XG4gICAgICAgIGZvdW5kSW5kZXggPSAtMVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYnl0ZU9mZnNldCArIHZhbExlbmd0aCA+IGFyckxlbmd0aCkgYnl0ZU9mZnNldCA9IGFyckxlbmd0aCAtIHZhbExlbmd0aFxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YXIgZm91bmQgPSB0cnVlXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZhbExlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmIChyZWFkKGFyciwgaSArIGopICE9PSByZWFkKHZhbCwgaikpIHtcbiAgICAgICAgICBmb3VuZCA9IGZhbHNlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZvdW5kKSByZXR1cm4gaVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXMgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIHRoaXMuaW5kZXhPZih2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSAhPT0gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gaW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgdHJ1ZSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uIGxhc3RJbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBmYWxzZSlcbn1cblxuZnVuY3Rpb24gaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAoc3RyTGVuICUgMiAhPT0gMCkgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHBhcnNlZCA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBpZiAobnVtYmVySXNOYU4ocGFyc2VkKSkgcmV0dXJuIGlcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGxhdGluMVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGFzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gdWNzMldyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIHdyaXRlIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nKVxuICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIG9mZnNldFssIGxlbmd0aF1bLCBlbmNvZGluZ10pXG4gIH0gZWxzZSBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGggPj4+IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCdcbiAgICApXG4gIH1cblxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGxlbmd0aCA+IHJlbWFpbmluZykgbGVuZ3RoID0gcmVtYWluaW5nXG5cbiAgaWYgKChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSkgfHwgb2Zmc2V0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGxhdGluMVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyAoYnl0ZXNbaSArIDFdICogMjU2KSlcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICB2YXIgbmV3QnVmID0gdGhpcy5zdWJhcnJheShzdGFydCwgZW5kKVxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICBuZXdCdWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50TEUgPSBmdW5jdGlvbiByZWFkVUludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiByZWFkVUludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAoKHRoaXNbb2Zmc2V0XSkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpKSArXG4gICAgICAodGhpc1tvZmZzZXQgKyAzXSAqIDB4MTAwMDAwMClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiByZWFkVUludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aFxuICB2YXIgbXVsID0gMVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWldXG4gIHdoaWxlIChpID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0taV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gcmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAxXSB8ICh0aGlzW29mZnNldF0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gcmVhZEludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gcmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYnVmZmVyXCIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpXG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlVUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweGZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsICg4ICogYnl0ZUxlbmd0aCkgLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpIC0gMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFID0gZnVuY3Rpb24gd3JpdGVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCAoOCAqIGJ5dGVMZW5ndGgpIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSArIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHg3ZiwgLTB4ODApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA4LCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkgKHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldFN0YXJ0ID49IHRhcmdldC5sZW5ndGgpIHRhcmdldFN0YXJ0ID0gdGFyZ2V0Lmxlbmd0aFxuICBpZiAoIXRhcmdldFN0YXJ0KSB0YXJnZXRTdGFydCA9IDBcbiAgaWYgKGVuZCA+IDAgJiYgZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMFxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCB0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGlmICh0YXJnZXRTdGFydCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIH1cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBpZiAoZW5kIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgPCBlbmQgLSBzdGFydCkge1xuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCArIHN0YXJ0XG4gIH1cblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcbiAgdmFyIGlcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0ICYmIHN0YXJ0IDwgdGFyZ2V0U3RhcnQgJiYgdGFyZ2V0U3RhcnQgPCBlbmQpIHtcbiAgICAvLyBkZXNjZW5kaW5nIGNvcHkgZnJvbSBlbmRcbiAgICBmb3IgKGkgPSBsZW4gLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSBpZiAobGVuIDwgMTAwMCkge1xuICAgIC8vIGFzY2VuZGluZyBjb3B5IGZyb20gc3RhcnRcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIFVpbnQ4QXJyYXkucHJvdG90eXBlLnNldC5jYWxsKFxuICAgICAgdGFyZ2V0LFxuICAgICAgdGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLFxuICAgICAgdGFyZ2V0U3RhcnRcbiAgICApXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIFVzYWdlOlxuLy8gICAgYnVmZmVyLmZpbGwobnVtYmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChidWZmZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKHN0cmluZ1ssIG9mZnNldFssIGVuZF1dWywgZW5jb2RpbmddKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsLCBzdGFydCwgZW5kLCBlbmNvZGluZykge1xuICAvLyBIYW5kbGUgc3RyaW5nIGNhc2VzOlxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHlwZW9mIHN0YXJ0ID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBzdGFydFxuICAgICAgc3RhcnQgPSAwXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVuZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gZW5kXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH1cbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIGNvZGUgPSB2YWwuY2hhckNvZGVBdCgwKVxuICAgICAgaWYgKGNvZGUgPCAyNTYpIHtcbiAgICAgICAgdmFsID0gY29kZVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycgJiYgIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDI1NVxuICB9XG5cbiAgLy8gSW52YWxpZCByYW5nZXMgYXJlIG5vdCBzZXQgdG8gYSBkZWZhdWx0LCBzbyBjYW4gcmFuZ2UgY2hlY2sgZWFybHkuXG4gIGlmIChzdGFydCA8IDAgfHwgdGhpcy5sZW5ndGggPCBzdGFydCB8fCB0aGlzLmxlbmd0aCA8IGVuZCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdPdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzdGFydCA9IHN0YXJ0ID4+PiAwXG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gdGhpcy5sZW5ndGggOiBlbmQgPj4+IDBcblxuICBpZiAoIXZhbCkgdmFsID0gMFxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICAgIHRoaXNbaV0gPSB2YWxcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJ5dGVzID0gQnVmZmVyLmlzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IG5ldyBCdWZmZXIodmFsLCBlbmNvZGluZylcbiAgICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rLzAtOUEtWmEtei1fXS9nXG5cbmZ1bmN0aW9uIGJhc2U2NGNsZWFuIChzdHIpIHtcbiAgLy8gTm9kZSBzdHJpcHMgb3V0IGludmFsaWQgY2hhcmFjdGVycyBsaWtlIFxcbiBhbmQgXFx0IGZyb20gdGhlIHN0cmluZywgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHN0ciA9IHN0ci50cmltKCkucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgY29udmVydHMgc3RyaW5ncyB3aXRoIGxlbmd0aCA8IDIgdG8gJydcbiAgaWYgKHN0ci5sZW5ndGggPCAyKSByZXR1cm4gJydcbiAgLy8gTm9kZSBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgYmFzZTY0IHN0cmluZ3MgKG1pc3NpbmcgdHJhaWxpbmcgPT09KSwgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHdoaWxlIChzdHIubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgIHN0ciA9IHN0ciArICc9J1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyaW5nLCB1bml0cykge1xuICB1bml0cyA9IHVuaXRzIHx8IEluZmluaXR5XG4gIHZhciBjb2RlUG9pbnRcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgdmFyIGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIHZhciBieXRlcyA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvZGVQb2ludCA9IHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cbiAgICAvLyBpcyBzdXJyb2dhdGUgY29tcG9uZW50XG4gICAgaWYgKGNvZGVQb2ludCA+IDB4RDdGRiAmJiBjb2RlUG9pbnQgPCAweEUwMDApIHtcbiAgICAgIC8vIGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoIWxlYWRTdXJyb2dhdGUpIHtcbiAgICAgICAgLy8gbm8gbGVhZCB5ZXRcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+IDB4REJGRikge1xuICAgICAgICAgIC8vIHVuZXhwZWN0ZWQgdHJhaWxcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKGkgKyAxID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAvLyB1bnBhaXJlZCBsZWFkXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkIGxlYWRcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIDIgbGVhZHMgaW4gYSByb3dcbiAgICAgIGlmIChjb2RlUG9pbnQgPCAweERDMDApIHtcbiAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gdmFsaWQgc3Vycm9nYXRlIHBhaXJcbiAgICAgIGNvZGVQb2ludCA9IChsZWFkU3Vycm9nYXRlIC0gMHhEODAwIDw8IDEwIHwgY29kZVBvaW50IC0gMHhEQzAwKSArIDB4MTAwMDBcbiAgICB9IGVsc2UgaWYgKGxlYWRTdXJyb2dhdGUpIHtcbiAgICAgIC8vIHZhbGlkIGJtcCBjaGFyLCBidXQgbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgIH1cblxuICAgIGxlYWRTdXJyb2dhdGUgPSBudWxsXG5cbiAgICAvLyBlbmNvZGUgdXRmOFxuICAgIGlmIChjb2RlUG9pbnQgPCAweDgwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDEpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goY29kZVBvaW50KVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHg4MDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiB8IDB4QzAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDMpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgfCAweEUwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSA0KSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHgxMiB8IDB4RjAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIsIHVuaXRzKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG4vLyBBcnJheUJ1ZmZlcnMgZnJvbSBhbm90aGVyIGNvbnRleHQgKGkuZS4gYW4gaWZyYW1lKSBkbyBub3QgcGFzcyB0aGUgYGluc3RhbmNlb2ZgIGNoZWNrXG4vLyBidXQgdGhleSBzaG91bGQgYmUgdHJlYXRlZCBhcyB2YWxpZC4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9pc3N1ZXMvMTY2XG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyIChvYmopIHtcbiAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIEFycmF5QnVmZmVyIHx8XG4gICAgKG9iaiAhPSBudWxsICYmIG9iai5jb25zdHJ1Y3RvciAhPSBudWxsICYmIG9iai5jb25zdHJ1Y3Rvci5uYW1lID09PSAnQXJyYXlCdWZmZXInICYmXG4gICAgICB0eXBlb2Ygb2JqLmJ5dGVMZW5ndGggPT09ICdudW1iZXInKVxufVxuXG4vLyBOb2RlIDAuMTAgc3VwcG9ydHMgYEFycmF5QnVmZmVyYCBidXQgbGFja3MgYEFycmF5QnVmZmVyLmlzVmlld2BcbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3IChvYmopIHtcbiAgcmV0dXJuICh0eXBlb2YgQXJyYXlCdWZmZXIuaXNWaWV3ID09PSAnZnVuY3Rpb24nKSAmJiBBcnJheUJ1ZmZlci5pc1ZpZXcob2JqKVxufVxuXG5mdW5jdGlvbiBudW1iZXJJc05hTiAob2JqKSB7XG4gIHJldHVybiBvYmogIT09IG9iaiAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5cbmZ1bmN0aW9uIGlzQXJyYXkoYXJnKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXJnKTtcbiAgfVxuICByZXR1cm4gb2JqZWN0VG9TdHJpbmcoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IEJ1ZmZlci5pc0J1ZmZlcjtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4gKCcgKyBlciArICcpJyk7XG4gICAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IG0gKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAodmFsdWUgKiBjIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIi8qIVxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbi8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcbi8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgKGlzQnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikgfHwgISFvYmouX2lzQnVmZmVyKVxufVxuXG5mdW5jdGlvbiBpc0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG5cbi8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5mdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzQnVmZmVyKG9iai5zbGljZSgwLCAwKSlcbn1cbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKGFycikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChhcnIpID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiLyoqXG4gKiBVdGlsaXR5IGZ1bmN0aW9uc1xuICovXG5cbnZhciB1dGlsID0ge307XG5cbnV0aWwuaXNPYmplY3QgPSBmdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxudXRpbC5pc051bWJlciA9IGZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbnV0aWwuaXNVbmRlZmluZWQgPSBmdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuXG51dGlsLmlzRnVuY3Rpb24gPSBmdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZyl7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5cbi8qKlxuICogRXZlbnRFbWl0dGVyIGNsYXNzXG4gKi9cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICBFdmVudEVtaXR0ZXIuaW5pdC5jYWxsKHRoaXMpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG5FdmVudEVtaXR0ZXIuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59O1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghdXRpbC5pc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InICYmICF0aGlzLl9ldmVudHMuZXJyb3IpIHtcbiAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmICh1dGlsLmlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodXRpbC5pc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodXRpbC5pc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghdXRpbC5pc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgdXRpbC5pc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmICh1dGlsLmlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAodXRpbC5pc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCF1dGlsLmlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG5cbiAgICAgIGlmICh1dGlsLmlzRnVuY3Rpb24oY29uc29sZS5lcnJvcikpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICB9XG4gICAgICBpZiAodXRpbC5pc0Z1bmN0aW9uKGNvbnNvbGUudHJhY2UpKVxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCF1dGlsLmlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghdXRpbC5pc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAodXRpbC5pc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmICh1dGlsLmlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAodXRpbC5pc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShsaXN0ZW5lcnMpKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKHV0aWwuaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmICh1dGlsLmlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmICghcHJvY2Vzcy52ZXJzaW9uIHx8XG4gICAgcHJvY2Vzcy52ZXJzaW9uLmluZGV4T2YoJ3YwLicpID09PSAwIHx8XG4gICAgcHJvY2Vzcy52ZXJzaW9uLmluZGV4T2YoJ3YxLicpID09PSAwICYmIHByb2Nlc3MudmVyc2lvbi5pbmRleE9mKCd2MS44LicpICE9PSAwKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gbmV4dFRpY2s7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHByb2Nlc3MubmV4dFRpY2s7XG59XG5cbmZ1bmN0aW9uIG5leHRUaWNrKGZuLCBhcmcxLCBhcmcyLCBhcmczKSB7XG4gIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImNhbGxiYWNrXCIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gIH1cbiAgdmFyIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHZhciBhcmdzLCBpO1xuICBzd2l0Y2ggKGxlbikge1xuICBjYXNlIDA6XG4gIGNhc2UgMTpcbiAgICByZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhmbik7XG4gIGNhc2UgMjpcbiAgICByZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiBhZnRlclRpY2tPbmUoKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIGFyZzEpO1xuICAgIH0pO1xuICBjYXNlIDM6XG4gICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gYWZ0ZXJUaWNrVHdvKCkge1xuICAgICAgZm4uY2FsbChudWxsLCBhcmcxLCBhcmcyKTtcbiAgICB9KTtcbiAgY2FzZSA0OlxuICAgIHJldHVybiBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uIGFmdGVyVGlja1RocmVlKCkge1xuICAgICAgZm4uY2FsbChudWxsLCBhcmcxLCBhcmcyLCBhcmczKTtcbiAgICB9KTtcbiAgZGVmYXVsdDpcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgYXJncy5sZW5ndGgpIHtcbiAgICAgIGFyZ3NbaSsrXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gYWZ0ZXJUaWNrKCkge1xuICAgICAgZm4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfSk7XG4gIH1cbn1cbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL19zdHJlYW1fZHVwbGV4LmpzJyk7XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gYSBkdXBsZXggc3RyZWFtIGlzIGp1c3QgYSBzdHJlYW0gdGhhdCBpcyBib3RoIHJlYWRhYmxlIGFuZCB3cml0YWJsZS5cbi8vIFNpbmNlIEpTIGRvZXNuJ3QgaGF2ZSBtdWx0aXBsZSBwcm90b3R5cGFsIGluaGVyaXRhbmNlLCB0aGlzIGNsYXNzXG4vLyBwcm90b3R5cGFsbHkgaW5oZXJpdHMgZnJvbSBSZWFkYWJsZSwgYW5kIHRoZW4gcGFyYXNpdGljYWxseSBmcm9tXG4vLyBXcml0YWJsZS5cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjxyZXBsYWNlbWVudD4qL1xuXG52YXIgcHJvY2Vzc05leHRUaWNrID0gcmVxdWlyZSgncHJvY2Vzcy1uZXh0aWNrLWFyZ3MnKTtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciBrZXlzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBrZXlzLnB1c2goa2V5KTtcbiAgfXJldHVybiBrZXlzO1xufTtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IER1cGxleDtcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciB1dGlsID0gcmVxdWlyZSgnY29yZS11dGlsLWlzJyk7XG51dGlsLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG52YXIgUmVhZGFibGUgPSByZXF1aXJlKCcuL19zdHJlYW1fcmVhZGFibGUnKTtcbnZhciBXcml0YWJsZSA9IHJlcXVpcmUoJy4vX3N0cmVhbV93cml0YWJsZScpO1xuXG51dGlsLmluaGVyaXRzKER1cGxleCwgUmVhZGFibGUpO1xuXG52YXIga2V5cyA9IG9iamVjdEtleXMoV3JpdGFibGUucHJvdG90eXBlKTtcbmZvciAodmFyIHYgPSAwOyB2IDwga2V5cy5sZW5ndGg7IHYrKykge1xuICB2YXIgbWV0aG9kID0ga2V5c1t2XTtcbiAgaWYgKCFEdXBsZXgucHJvdG90eXBlW21ldGhvZF0pIER1cGxleC5wcm90b3R5cGVbbWV0aG9kXSA9IFdyaXRhYmxlLnByb3RvdHlwZVttZXRob2RdO1xufVxuXG5mdW5jdGlvbiBEdXBsZXgob3B0aW9ucykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRHVwbGV4KSkgcmV0dXJuIG5ldyBEdXBsZXgob3B0aW9ucyk7XG5cbiAgUmVhZGFibGUuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgV3JpdGFibGUuY2FsbCh0aGlzLCBvcHRpb25zKTtcblxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJlYWRhYmxlID09PSBmYWxzZSkgdGhpcy5yZWFkYWJsZSA9IGZhbHNlO1xuXG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMud3JpdGFibGUgPT09IGZhbHNlKSB0aGlzLndyaXRhYmxlID0gZmFsc2U7XG5cbiAgdGhpcy5hbGxvd0hhbGZPcGVuID0gdHJ1ZTtcbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5hbGxvd0hhbGZPcGVuID09PSBmYWxzZSkgdGhpcy5hbGxvd0hhbGZPcGVuID0gZmFsc2U7XG5cbiAgdGhpcy5vbmNlKCdlbmQnLCBvbmVuZCk7XG59XG5cbi8vIHRoZSBuby1oYWxmLW9wZW4gZW5mb3JjZXJcbmZ1bmN0aW9uIG9uZW5kKCkge1xuICAvLyBpZiB3ZSBhbGxvdyBoYWxmLW9wZW4gc3RhdGUsIG9yIGlmIHRoZSB3cml0YWJsZSBzaWRlIGVuZGVkLFxuICAvLyB0aGVuIHdlJ3JlIG9rLlxuICBpZiAodGhpcy5hbGxvd0hhbGZPcGVuIHx8IHRoaXMuX3dyaXRhYmxlU3RhdGUuZW5kZWQpIHJldHVybjtcblxuICAvLyBubyBtb3JlIGRhdGEgY2FuIGJlIHdyaXR0ZW4uXG4gIC8vIEJ1dCBhbGxvdyBtb3JlIHdyaXRlcyB0byBoYXBwZW4gaW4gdGhpcyB0aWNrLlxuICBwcm9jZXNzTmV4dFRpY2sob25FbmROVCwgdGhpcyk7XG59XG5cbmZ1bmN0aW9uIG9uRW5kTlQoc2VsZikge1xuICBzZWxmLmVuZCgpO1xufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoRHVwbGV4LnByb3RvdHlwZSwgJ2Rlc3Ryb3llZCcsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX3JlYWRhYmxlU3RhdGUgPT09IHVuZGVmaW5lZCB8fCB0aGlzLl93cml0YWJsZVN0YXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3JlYWRhYmxlU3RhdGUuZGVzdHJveWVkICYmIHRoaXMuX3dyaXRhYmxlU3RhdGUuZGVzdHJveWVkO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIC8vIHdlIGlnbm9yZSB0aGUgdmFsdWUgaWYgdGhlIHN0cmVhbVxuICAgIC8vIGhhcyBub3QgYmVlbiBpbml0aWFsaXplZCB5ZXRcbiAgICBpZiAodGhpcy5fcmVhZGFibGVTdGF0ZSA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuX3dyaXRhYmxlU3RhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIHRoZSB1c2VyIGlzIGV4cGxpY2l0bHlcbiAgICAvLyBtYW5hZ2luZyBkZXN0cm95ZWRcbiAgICB0aGlzLl9yZWFkYWJsZVN0YXRlLmRlc3Ryb3llZCA9IHZhbHVlO1xuICAgIHRoaXMuX3dyaXRhYmxlU3RhdGUuZGVzdHJveWVkID0gdmFsdWU7XG4gIH1cbn0pO1xuXG5EdXBsZXgucHJvdG90eXBlLl9kZXN0cm95ID0gZnVuY3Rpb24gKGVyciwgY2IpIHtcbiAgdGhpcy5wdXNoKG51bGwpO1xuICB0aGlzLmVuZCgpO1xuXG4gIHByb2Nlc3NOZXh0VGljayhjYiwgZXJyKTtcbn07XG5cbmZ1bmN0aW9uIGZvckVhY2goeHMsIGYpIHtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB4cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBmKHhzW2ldLCBpKTtcbiAgfVxufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyBhIHBhc3N0aHJvdWdoIHN0cmVhbS5cbi8vIGJhc2ljYWxseSBqdXN0IHRoZSBtb3N0IG1pbmltYWwgc29ydCBvZiBUcmFuc2Zvcm0gc3RyZWFtLlxuLy8gRXZlcnkgd3JpdHRlbiBjaHVuayBnZXRzIG91dHB1dCBhcy1pcy5cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhc3NUaHJvdWdoO1xuXG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnLi9fc3RyZWFtX3RyYW5zZm9ybScpO1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIHV0aWwgPSByZXF1aXJlKCdjb3JlLXV0aWwtaXMnKTtcbnV0aWwuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbnV0aWwuaW5oZXJpdHMoUGFzc1Rocm91Z2gsIFRyYW5zZm9ybSk7XG5cbmZ1bmN0aW9uIFBhc3NUaHJvdWdoKG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFBhc3NUaHJvdWdoKSkgcmV0dXJuIG5ldyBQYXNzVGhyb3VnaChvcHRpb25zKTtcblxuICBUcmFuc2Zvcm0uY2FsbCh0aGlzLCBvcHRpb25zKTtcbn1cblxuUGFzc1Rocm91Z2gucHJvdG90eXBlLl90cmFuc2Zvcm0gPSBmdW5jdGlvbiAoY2h1bmssIGVuY29kaW5nLCBjYikge1xuICBjYihudWxsLCBjaHVuayk7XG59OyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbi8qPHJlcGxhY2VtZW50PiovXG5cbnZhciBwcm9jZXNzTmV4dFRpY2sgPSByZXF1aXJlKCdwcm9jZXNzLW5leHRpY2stYXJncycpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbm1vZHVsZS5leHBvcnRzID0gUmVhZGFibGU7XG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKTtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIER1cGxleDtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG5SZWFkYWJsZS5SZWFkYWJsZVN0YXRlID0gUmVhZGFibGVTdGF0ZTtcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBFRSA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcblxudmFyIEVFbGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uIChlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVycyh0eXBlKS5sZW5ndGg7XG59O1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgU3RyZWFtID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9zdHJlYW1zL3N0cmVhbScpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbi8vIFRPRE8oYm1ldXJlcik6IENoYW5nZSB0aGlzIGJhY2sgdG8gY29uc3Qgb25jZSBob2xlIGNoZWNrcyBhcmVcbi8vIHByb3Blcmx5IG9wdGltaXplZCBhd2F5IGVhcmx5IGluIElnbml0aW9uK1R1cmJvRmFuLlxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlcjtcbnZhciBPdXJVaW50OEFycmF5ID0gZ2xvYmFsLlVpbnQ4QXJyYXkgfHwgZnVuY3Rpb24gKCkge307XG5mdW5jdGlvbiBfdWludDhBcnJheVRvQnVmZmVyKGNodW5rKSB7XG4gIHJldHVybiBCdWZmZXIuZnJvbShjaHVuayk7XG59XG5mdW5jdGlvbiBfaXNVaW50OEFycmF5KG9iaikge1xuICByZXR1cm4gQnVmZmVyLmlzQnVmZmVyKG9iaikgfHwgb2JqIGluc3RhbmNlb2YgT3VyVWludDhBcnJheTtcbn1cbi8qPC9yZXBsYWNlbWVudD4qL1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIHV0aWwgPSByZXF1aXJlKCdjb3JlLXV0aWwtaXMnKTtcbnV0aWwuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgZGVidWdVdGlsID0gcmVxdWlyZSgndXRpbCcpO1xudmFyIGRlYnVnID0gdm9pZCAwO1xuaWYgKGRlYnVnVXRpbCAmJiBkZWJ1Z1V0aWwuZGVidWdsb2cpIHtcbiAgZGVidWcgPSBkZWJ1Z1V0aWwuZGVidWdsb2coJ3N0cmVhbScpO1xufSBlbHNlIHtcbiAgZGVidWcgPSBmdW5jdGlvbiAoKSB7fTtcbn1cbi8qPC9yZXBsYWNlbWVudD4qL1xuXG52YXIgQnVmZmVyTGlzdCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvc3RyZWFtcy9CdWZmZXJMaXN0Jyk7XG52YXIgZGVzdHJveUltcGwgPSByZXF1aXJlKCcuL2ludGVybmFsL3N0cmVhbXMvZGVzdHJveScpO1xudmFyIFN0cmluZ0RlY29kZXI7XG5cbnV0aWwuaW5oZXJpdHMoUmVhZGFibGUsIFN0cmVhbSk7XG5cbnZhciBrUHJveHlFdmVudHMgPSBbJ2Vycm9yJywgJ2Nsb3NlJywgJ2Rlc3Ryb3knLCAncGF1c2UnLCAncmVzdW1lJ107XG5cbmZ1bmN0aW9uIHByZXBlbmRMaXN0ZW5lcihlbWl0dGVyLCBldmVudCwgZm4pIHtcbiAgLy8gU2FkbHkgdGhpcyBpcyBub3QgY2FjaGVhYmxlIGFzIHNvbWUgbGlicmFyaWVzIGJ1bmRsZSB0aGVpciBvd25cbiAgLy8gZXZlbnQgZW1pdHRlciBpbXBsZW1lbnRhdGlvbiB3aXRoIHRoZW0uXG4gIGlmICh0eXBlb2YgZW1pdHRlci5wcmVwZW5kTGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZW1pdHRlci5wcmVwZW5kTGlzdGVuZXIoZXZlbnQsIGZuKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBUaGlzIGlzIGEgaGFjayB0byBtYWtlIHN1cmUgdGhhdCBvdXIgZXJyb3IgaGFuZGxlciBpcyBhdHRhY2hlZCBiZWZvcmUgYW55XG4gICAgLy8gdXNlcmxhbmQgb25lcy4gIE5FVkVSIERPIFRISVMuIFRoaXMgaXMgaGVyZSBvbmx5IGJlY2F1c2UgdGhpcyBjb2RlIG5lZWRzXG4gICAgLy8gdG8gY29udGludWUgdG8gd29yayB3aXRoIG9sZGVyIHZlcnNpb25zIG9mIE5vZGUuanMgdGhhdCBkbyBub3QgaW5jbHVkZVxuICAgIC8vIHRoZSBwcmVwZW5kTGlzdGVuZXIoKSBtZXRob2QuIFRoZSBnb2FsIGlzIHRvIGV2ZW50dWFsbHkgcmVtb3ZlIHRoaXMgaGFjay5cbiAgICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW2V2ZW50XSkgZW1pdHRlci5vbihldmVudCwgZm4pO2Vsc2UgaWYgKGlzQXJyYXkoZW1pdHRlci5fZXZlbnRzW2V2ZW50XSkpIGVtaXR0ZXIuX2V2ZW50c1tldmVudF0udW5zaGlmdChmbik7ZWxzZSBlbWl0dGVyLl9ldmVudHNbZXZlbnRdID0gW2ZuLCBlbWl0dGVyLl9ldmVudHNbZXZlbnRdXTtcbiAgfVxufVxuXG5mdW5jdGlvbiBSZWFkYWJsZVN0YXRlKG9wdGlvbnMsIHN0cmVhbSkge1xuICBEdXBsZXggPSBEdXBsZXggfHwgcmVxdWlyZSgnLi9fc3RyZWFtX2R1cGxleCcpO1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIC8vIG9iamVjdCBzdHJlYW0gZmxhZy4gVXNlZCB0byBtYWtlIHJlYWQobikgaWdub3JlIG4gYW5kIHRvXG4gIC8vIG1ha2UgYWxsIHRoZSBidWZmZXIgbWVyZ2luZyBhbmQgbGVuZ3RoIGNoZWNrcyBnbyBhd2F5XG4gIHRoaXMub2JqZWN0TW9kZSA9ICEhb3B0aW9ucy5vYmplY3RNb2RlO1xuXG4gIGlmIChzdHJlYW0gaW5zdGFuY2VvZiBEdXBsZXgpIHRoaXMub2JqZWN0TW9kZSA9IHRoaXMub2JqZWN0TW9kZSB8fCAhIW9wdGlvbnMucmVhZGFibGVPYmplY3RNb2RlO1xuXG4gIC8vIHRoZSBwb2ludCBhdCB3aGljaCBpdCBzdG9wcyBjYWxsaW5nIF9yZWFkKCkgdG8gZmlsbCB0aGUgYnVmZmVyXG4gIC8vIE5vdGU6IDAgaXMgYSB2YWxpZCB2YWx1ZSwgbWVhbnMgXCJkb24ndCBjYWxsIF9yZWFkIHByZWVtcHRpdmVseSBldmVyXCJcbiAgdmFyIGh3bSA9IG9wdGlvbnMuaGlnaFdhdGVyTWFyaztcbiAgdmFyIGRlZmF1bHRId20gPSB0aGlzLm9iamVjdE1vZGUgPyAxNiA6IDE2ICogMTAyNDtcbiAgdGhpcy5oaWdoV2F0ZXJNYXJrID0gaHdtIHx8IGh3bSA9PT0gMCA/IGh3bSA6IGRlZmF1bHRId207XG5cbiAgLy8gY2FzdCB0byBpbnRzLlxuICB0aGlzLmhpZ2hXYXRlck1hcmsgPSBNYXRoLmZsb29yKHRoaXMuaGlnaFdhdGVyTWFyayk7XG5cbiAgLy8gQSBsaW5rZWQgbGlzdCBpcyB1c2VkIHRvIHN0b3JlIGRhdGEgY2h1bmtzIGluc3RlYWQgb2YgYW4gYXJyYXkgYmVjYXVzZSB0aGVcbiAgLy8gbGlua2VkIGxpc3QgY2FuIHJlbW92ZSBlbGVtZW50cyBmcm9tIHRoZSBiZWdpbm5pbmcgZmFzdGVyIHRoYW5cbiAgLy8gYXJyYXkuc2hpZnQoKVxuICB0aGlzLmJ1ZmZlciA9IG5ldyBCdWZmZXJMaXN0KCk7XG4gIHRoaXMubGVuZ3RoID0gMDtcbiAgdGhpcy5waXBlcyA9IG51bGw7XG4gIHRoaXMucGlwZXNDb3VudCA9IDA7XG4gIHRoaXMuZmxvd2luZyA9IG51bGw7XG4gIHRoaXMuZW5kZWQgPSBmYWxzZTtcbiAgdGhpcy5lbmRFbWl0dGVkID0gZmFsc2U7XG4gIHRoaXMucmVhZGluZyA9IGZhbHNlO1xuXG4gIC8vIGEgZmxhZyB0byBiZSBhYmxlIHRvIHRlbGwgaWYgdGhlIGV2ZW50ICdyZWFkYWJsZScvJ2RhdGEnIGlzIGVtaXR0ZWRcbiAgLy8gaW1tZWRpYXRlbHksIG9yIG9uIGEgbGF0ZXIgdGljay4gIFdlIHNldCB0aGlzIHRvIHRydWUgYXQgZmlyc3QsIGJlY2F1c2VcbiAgLy8gYW55IGFjdGlvbnMgdGhhdCBzaG91bGRuJ3QgaGFwcGVuIHVudGlsIFwibGF0ZXJcIiBzaG91bGQgZ2VuZXJhbGx5IGFsc29cbiAgLy8gbm90IGhhcHBlbiBiZWZvcmUgdGhlIGZpcnN0IHJlYWQgY2FsbC5cbiAgdGhpcy5zeW5jID0gdHJ1ZTtcblxuICAvLyB3aGVuZXZlciB3ZSByZXR1cm4gbnVsbCwgdGhlbiB3ZSBzZXQgYSBmbGFnIHRvIHNheVxuICAvLyB0aGF0IHdlJ3JlIGF3YWl0aW5nIGEgJ3JlYWRhYmxlJyBldmVudCBlbWlzc2lvbi5cbiAgdGhpcy5uZWVkUmVhZGFibGUgPSBmYWxzZTtcbiAgdGhpcy5lbWl0dGVkUmVhZGFibGUgPSBmYWxzZTtcbiAgdGhpcy5yZWFkYWJsZUxpc3RlbmluZyA9IGZhbHNlO1xuICB0aGlzLnJlc3VtZVNjaGVkdWxlZCA9IGZhbHNlO1xuXG4gIC8vIGhhcyBpdCBiZWVuIGRlc3Ryb3llZFxuICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlO1xuXG4gIC8vIENyeXB0byBpcyBraW5kIG9mIG9sZCBhbmQgY3J1c3R5LiAgSGlzdG9yaWNhbGx5LCBpdHMgZGVmYXVsdCBzdHJpbmdcbiAgLy8gZW5jb2RpbmcgaXMgJ2JpbmFyeScgc28gd2UgaGF2ZSB0byBtYWtlIHRoaXMgY29uZmlndXJhYmxlLlxuICAvLyBFdmVyeXRoaW5nIGVsc2UgaW4gdGhlIHVuaXZlcnNlIHVzZXMgJ3V0ZjgnLCB0aG91Z2guXG4gIHRoaXMuZGVmYXVsdEVuY29kaW5nID0gb3B0aW9ucy5kZWZhdWx0RW5jb2RpbmcgfHwgJ3V0ZjgnO1xuXG4gIC8vIHRoZSBudW1iZXIgb2Ygd3JpdGVycyB0aGF0IGFyZSBhd2FpdGluZyBhIGRyYWluIGV2ZW50IGluIC5waXBlKClzXG4gIHRoaXMuYXdhaXREcmFpbiA9IDA7XG5cbiAgLy8gaWYgdHJ1ZSwgYSBtYXliZVJlYWRNb3JlIGhhcyBiZWVuIHNjaGVkdWxlZFxuICB0aGlzLnJlYWRpbmdNb3JlID0gZmFsc2U7XG5cbiAgdGhpcy5kZWNvZGVyID0gbnVsbDtcbiAgdGhpcy5lbmNvZGluZyA9IG51bGw7XG4gIGlmIChvcHRpb25zLmVuY29kaW5nKSB7XG4gICAgaWYgKCFTdHJpbmdEZWNvZGVyKSBTdHJpbmdEZWNvZGVyID0gcmVxdWlyZSgnc3RyaW5nX2RlY29kZXIvJykuU3RyaW5nRGVjb2RlcjtcbiAgICB0aGlzLmRlY29kZXIgPSBuZXcgU3RyaW5nRGVjb2RlcihvcHRpb25zLmVuY29kaW5nKTtcbiAgICB0aGlzLmVuY29kaW5nID0gb3B0aW9ucy5lbmNvZGluZztcbiAgfVxufVxuXG5mdW5jdGlvbiBSZWFkYWJsZShvcHRpb25zKSB7XG4gIER1cGxleCA9IER1cGxleCB8fCByZXF1aXJlKCcuL19zdHJlYW1fZHVwbGV4Jyk7XG5cbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJlYWRhYmxlKSkgcmV0dXJuIG5ldyBSZWFkYWJsZShvcHRpb25zKTtcblxuICB0aGlzLl9yZWFkYWJsZVN0YXRlID0gbmV3IFJlYWRhYmxlU3RhdGUob3B0aW9ucywgdGhpcyk7XG5cbiAgLy8gbGVnYWN5XG4gIHRoaXMucmVhZGFibGUgPSB0cnVlO1xuXG4gIGlmIChvcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnJlYWQgPT09ICdmdW5jdGlvbicpIHRoaXMuX3JlYWQgPSBvcHRpb25zLnJlYWQ7XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuZGVzdHJveSA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5fZGVzdHJveSA9IG9wdGlvbnMuZGVzdHJveTtcbiAgfVxuXG4gIFN0cmVhbS5jYWxsKHRoaXMpO1xufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGFibGUucHJvdG90eXBlLCAnZGVzdHJveWVkJywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5fcmVhZGFibGVTdGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9yZWFkYWJsZVN0YXRlLmRlc3Ryb3llZDtcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAvLyB3ZSBpZ25vcmUgdGhlIHZhbHVlIGlmIHRoZSBzdHJlYW1cbiAgICAvLyBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQgeWV0XG4gICAgaWYgKCF0aGlzLl9yZWFkYWJsZVN0YXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gYmFja3dhcmQgY29tcGF0aWJpbGl0eSwgdGhlIHVzZXIgaXMgZXhwbGljaXRseVxuICAgIC8vIG1hbmFnaW5nIGRlc3Ryb3llZFxuICAgIHRoaXMuX3JlYWRhYmxlU3RhdGUuZGVzdHJveWVkID0gdmFsdWU7XG4gIH1cbn0pO1xuXG5SZWFkYWJsZS5wcm90b3R5cGUuZGVzdHJveSA9IGRlc3Ryb3lJbXBsLmRlc3Ryb3k7XG5SZWFkYWJsZS5wcm90b3R5cGUuX3VuZGVzdHJveSA9IGRlc3Ryb3lJbXBsLnVuZGVzdHJveTtcblJlYWRhYmxlLnByb3RvdHlwZS5fZGVzdHJveSA9IGZ1bmN0aW9uIChlcnIsIGNiKSB7XG4gIHRoaXMucHVzaChudWxsKTtcbiAgY2IoZXJyKTtcbn07XG5cbi8vIE1hbnVhbGx5IHNob3ZlIHNvbWV0aGluZyBpbnRvIHRoZSByZWFkKCkgYnVmZmVyLlxuLy8gVGhpcyByZXR1cm5zIHRydWUgaWYgdGhlIGhpZ2hXYXRlck1hcmsgaGFzIG5vdCBiZWVuIGhpdCB5ZXQsXG4vLyBzaW1pbGFyIHRvIGhvdyBXcml0YWJsZS53cml0ZSgpIHJldHVybnMgdHJ1ZSBpZiB5b3Ugc2hvdWxkXG4vLyB3cml0ZSgpIHNvbWUgbW9yZS5cblJlYWRhYmxlLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKGNodW5rLCBlbmNvZGluZykge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICB2YXIgc2tpcENodW5rQ2hlY2s7XG5cbiAgaWYgKCFzdGF0ZS5vYmplY3RNb2RlKSB7XG4gICAgaWYgKHR5cGVvZiBjaHVuayA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gZW5jb2RpbmcgfHwgc3RhdGUuZGVmYXVsdEVuY29kaW5nO1xuICAgICAgaWYgKGVuY29kaW5nICE9PSBzdGF0ZS5lbmNvZGluZykge1xuICAgICAgICBjaHVuayA9IEJ1ZmZlci5mcm9tKGNodW5rLCBlbmNvZGluZyk7XG4gICAgICAgIGVuY29kaW5nID0gJyc7XG4gICAgICB9XG4gICAgICBza2lwQ2h1bmtDaGVjayA9IHRydWU7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNraXBDaHVua0NoZWNrID0gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiByZWFkYWJsZUFkZENodW5rKHRoaXMsIGNodW5rLCBlbmNvZGluZywgZmFsc2UsIHNraXBDaHVua0NoZWNrKTtcbn07XG5cbi8vIFVuc2hpZnQgc2hvdWxkICphbHdheXMqIGJlIHNvbWV0aGluZyBkaXJlY3RseSBvdXQgb2YgcmVhZCgpXG5SZWFkYWJsZS5wcm90b3R5cGUudW5zaGlmdCA9IGZ1bmN0aW9uIChjaHVuaykge1xuICByZXR1cm4gcmVhZGFibGVBZGRDaHVuayh0aGlzLCBjaHVuaywgbnVsbCwgdHJ1ZSwgZmFsc2UpO1xufTtcblxuZnVuY3Rpb24gcmVhZGFibGVBZGRDaHVuayhzdHJlYW0sIGNodW5rLCBlbmNvZGluZywgYWRkVG9Gcm9udCwgc2tpcENodW5rQ2hlY2spIHtcbiAgdmFyIHN0YXRlID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlO1xuICBpZiAoY2h1bmsgPT09IG51bGwpIHtcbiAgICBzdGF0ZS5yZWFkaW5nID0gZmFsc2U7XG4gICAgb25Fb2ZDaHVuayhzdHJlYW0sIHN0YXRlKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZXI7XG4gICAgaWYgKCFza2lwQ2h1bmtDaGVjaykgZXIgPSBjaHVua0ludmFsaWQoc3RhdGUsIGNodW5rKTtcbiAgICBpZiAoZXIpIHtcbiAgICAgIHN0cmVhbS5lbWl0KCdlcnJvcicsIGVyKTtcbiAgICB9IGVsc2UgaWYgKHN0YXRlLm9iamVjdE1vZGUgfHwgY2h1bmsgJiYgY2h1bmsubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKHR5cGVvZiBjaHVuayAhPT0gJ3N0cmluZycgJiYgIXN0YXRlLm9iamVjdE1vZGUgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKGNodW5rKSAhPT0gQnVmZmVyLnByb3RvdHlwZSkge1xuICAgICAgICBjaHVuayA9IF91aW50OEFycmF5VG9CdWZmZXIoY2h1bmspO1xuICAgICAgfVxuXG4gICAgICBpZiAoYWRkVG9Gcm9udCkge1xuICAgICAgICBpZiAoc3RhdGUuZW5kRW1pdHRlZCkgc3RyZWFtLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdzdHJlYW0udW5zaGlmdCgpIGFmdGVyIGVuZCBldmVudCcpKTtlbHNlIGFkZENodW5rKHN0cmVhbSwgc3RhdGUsIGNodW5rLCB0cnVlKTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUuZW5kZWQpIHtcbiAgICAgICAgc3RyZWFtLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdzdHJlYW0ucHVzaCgpIGFmdGVyIEVPRicpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlLnJlYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKHN0YXRlLmRlY29kZXIgJiYgIWVuY29kaW5nKSB7XG4gICAgICAgICAgY2h1bmsgPSBzdGF0ZS5kZWNvZGVyLndyaXRlKGNodW5rKTtcbiAgICAgICAgICBpZiAoc3RhdGUub2JqZWN0TW9kZSB8fCBjaHVuay5sZW5ndGggIT09IDApIGFkZENodW5rKHN0cmVhbSwgc3RhdGUsIGNodW5rLCBmYWxzZSk7ZWxzZSBtYXliZVJlYWRNb3JlKHN0cmVhbSwgc3RhdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFkZENodW5rKHN0cmVhbSwgc3RhdGUsIGNodW5rLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFhZGRUb0Zyb250KSB7XG4gICAgICBzdGF0ZS5yZWFkaW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5lZWRNb3JlRGF0YShzdGF0ZSk7XG59XG5cbmZ1bmN0aW9uIGFkZENodW5rKHN0cmVhbSwgc3RhdGUsIGNodW5rLCBhZGRUb0Zyb250KSB7XG4gIGlmIChzdGF0ZS5mbG93aW5nICYmIHN0YXRlLmxlbmd0aCA9PT0gMCAmJiAhc3RhdGUuc3luYykge1xuICAgIHN0cmVhbS5lbWl0KCdkYXRhJywgY2h1bmspO1xuICAgIHN0cmVhbS5yZWFkKDApO1xuICB9IGVsc2Uge1xuICAgIC8vIHVwZGF0ZSB0aGUgYnVmZmVyIGluZm8uXG4gICAgc3RhdGUubGVuZ3RoICs9IHN0YXRlLm9iamVjdE1vZGUgPyAxIDogY2h1bmsubGVuZ3RoO1xuICAgIGlmIChhZGRUb0Zyb250KSBzdGF0ZS5idWZmZXIudW5zaGlmdChjaHVuayk7ZWxzZSBzdGF0ZS5idWZmZXIucHVzaChjaHVuayk7XG5cbiAgICBpZiAoc3RhdGUubmVlZFJlYWRhYmxlKSBlbWl0UmVhZGFibGUoc3RyZWFtKTtcbiAgfVxuICBtYXliZVJlYWRNb3JlKHN0cmVhbSwgc3RhdGUpO1xufVxuXG5mdW5jdGlvbiBjaHVua0ludmFsaWQoc3RhdGUsIGNodW5rKSB7XG4gIHZhciBlcjtcbiAgaWYgKCFfaXNVaW50OEFycmF5KGNodW5rKSAmJiB0eXBlb2YgY2h1bmsgIT09ICdzdHJpbmcnICYmIGNodW5rICE9PSB1bmRlZmluZWQgJiYgIXN0YXRlLm9iamVjdE1vZGUpIHtcbiAgICBlciA9IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgbm9uLXN0cmluZy9idWZmZXIgY2h1bmsnKTtcbiAgfVxuICByZXR1cm4gZXI7XG59XG5cbi8vIGlmIGl0J3MgcGFzdCB0aGUgaGlnaCB3YXRlciBtYXJrLCB3ZSBjYW4gcHVzaCBpbiBzb21lIG1vcmUuXG4vLyBBbHNvLCBpZiB3ZSBoYXZlIG5vIGRhdGEgeWV0LCB3ZSBjYW4gc3RhbmQgc29tZVxuLy8gbW9yZSBieXRlcy4gIFRoaXMgaXMgdG8gd29yayBhcm91bmQgY2FzZXMgd2hlcmUgaHdtPTAsXG4vLyBzdWNoIGFzIHRoZSByZXBsLiAgQWxzbywgaWYgdGhlIHB1c2goKSB0cmlnZ2VyZWQgYVxuLy8gcmVhZGFibGUgZXZlbnQsIGFuZCB0aGUgdXNlciBjYWxsZWQgcmVhZChsYXJnZU51bWJlcikgc3VjaCB0aGF0XG4vLyBuZWVkUmVhZGFibGUgd2FzIHNldCwgdGhlbiB3ZSBvdWdodCB0byBwdXNoIG1vcmUsIHNvIHRoYXQgYW5vdGhlclxuLy8gJ3JlYWRhYmxlJyBldmVudCB3aWxsIGJlIHRyaWdnZXJlZC5cbmZ1bmN0aW9uIG5lZWRNb3JlRGF0YShzdGF0ZSkge1xuICByZXR1cm4gIXN0YXRlLmVuZGVkICYmIChzdGF0ZS5uZWVkUmVhZGFibGUgfHwgc3RhdGUubGVuZ3RoIDwgc3RhdGUuaGlnaFdhdGVyTWFyayB8fCBzdGF0ZS5sZW5ndGggPT09IDApO1xufVxuXG5SZWFkYWJsZS5wcm90b3R5cGUuaXNQYXVzZWQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmcgPT09IGZhbHNlO1xufTtcblxuLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG5SZWFkYWJsZS5wcm90b3R5cGUuc2V0RW5jb2RpbmcgPSBmdW5jdGlvbiAoZW5jKSB7XG4gIGlmICghU3RyaW5nRGVjb2RlcikgU3RyaW5nRGVjb2RlciA9IHJlcXVpcmUoJ3N0cmluZ19kZWNvZGVyLycpLlN0cmluZ0RlY29kZXI7XG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUuZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKGVuYyk7XG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUuZW5jb2RpbmcgPSBlbmM7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gRG9uJ3QgcmFpc2UgdGhlIGh3bSA+IDhNQlxudmFyIE1BWF9IV00gPSAweDgwMDAwMDtcbmZ1bmN0aW9uIGNvbXB1dGVOZXdIaWdoV2F0ZXJNYXJrKG4pIHtcbiAgaWYgKG4gPj0gTUFYX0hXTSkge1xuICAgIG4gPSBNQVhfSFdNO1xuICB9IGVsc2Uge1xuICAgIC8vIEdldCB0aGUgbmV4dCBoaWdoZXN0IHBvd2VyIG9mIDIgdG8gcHJldmVudCBpbmNyZWFzaW5nIGh3bSBleGNlc3NpdmVseSBpblxuICAgIC8vIHRpbnkgYW1vdW50c1xuICAgIG4tLTtcbiAgICBuIHw9IG4gPj4+IDE7XG4gICAgbiB8PSBuID4+PiAyO1xuICAgIG4gfD0gbiA+Pj4gNDtcbiAgICBuIHw9IG4gPj4+IDg7XG4gICAgbiB8PSBuID4+PiAxNjtcbiAgICBuKys7XG4gIH1cbiAgcmV0dXJuIG47XG59XG5cbi8vIFRoaXMgZnVuY3Rpb24gaXMgZGVzaWduZWQgdG8gYmUgaW5saW5hYmxlLCBzbyBwbGVhc2UgdGFrZSBjYXJlIHdoZW4gbWFraW5nXG4vLyBjaGFuZ2VzIHRvIHRoZSBmdW5jdGlvbiBib2R5LlxuZnVuY3Rpb24gaG93TXVjaFRvUmVhZChuLCBzdGF0ZSkge1xuICBpZiAobiA8PSAwIHx8IHN0YXRlLmxlbmd0aCA9PT0gMCAmJiBzdGF0ZS5lbmRlZCkgcmV0dXJuIDA7XG4gIGlmIChzdGF0ZS5vYmplY3RNb2RlKSByZXR1cm4gMTtcbiAgaWYgKG4gIT09IG4pIHtcbiAgICAvLyBPbmx5IGZsb3cgb25lIGJ1ZmZlciBhdCBhIHRpbWVcbiAgICBpZiAoc3RhdGUuZmxvd2luZyAmJiBzdGF0ZS5sZW5ndGgpIHJldHVybiBzdGF0ZS5idWZmZXIuaGVhZC5kYXRhLmxlbmd0aDtlbHNlIHJldHVybiBzdGF0ZS5sZW5ndGg7XG4gIH1cbiAgLy8gSWYgd2UncmUgYXNraW5nIGZvciBtb3JlIHRoYW4gdGhlIGN1cnJlbnQgaHdtLCB0aGVuIHJhaXNlIHRoZSBod20uXG4gIGlmIChuID4gc3RhdGUuaGlnaFdhdGVyTWFyaykgc3RhdGUuaGlnaFdhdGVyTWFyayA9IGNvbXB1dGVOZXdIaWdoV2F0ZXJNYXJrKG4pO1xuICBpZiAobiA8PSBzdGF0ZS5sZW5ndGgpIHJldHVybiBuO1xuICAvLyBEb24ndCBoYXZlIGVub3VnaFxuICBpZiAoIXN0YXRlLmVuZGVkKSB7XG4gICAgc3RhdGUubmVlZFJlYWRhYmxlID0gdHJ1ZTtcbiAgICByZXR1cm4gMDtcbiAgfVxuICByZXR1cm4gc3RhdGUubGVuZ3RoO1xufVxuXG4vLyB5b3UgY2FuIG92ZXJyaWRlIGVpdGhlciB0aGlzIG1ldGhvZCwgb3IgdGhlIGFzeW5jIF9yZWFkKG4pIGJlbG93LlxuUmVhZGFibGUucHJvdG90eXBlLnJlYWQgPSBmdW5jdGlvbiAobikge1xuICBkZWJ1ZygncmVhZCcsIG4pO1xuICBuID0gcGFyc2VJbnQobiwgMTApO1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICB2YXIgbk9yaWcgPSBuO1xuXG4gIGlmIChuICE9PSAwKSBzdGF0ZS5lbWl0dGVkUmVhZGFibGUgPSBmYWxzZTtcblxuICAvLyBpZiB3ZSdyZSBkb2luZyByZWFkKDApIHRvIHRyaWdnZXIgYSByZWFkYWJsZSBldmVudCwgYnV0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhIGJ1bmNoIG9mIGRhdGEgaW4gdGhlIGJ1ZmZlciwgdGhlbiBqdXN0IHRyaWdnZXJcbiAgLy8gdGhlICdyZWFkYWJsZScgZXZlbnQgYW5kIG1vdmUgb24uXG4gIGlmIChuID09PSAwICYmIHN0YXRlLm5lZWRSZWFkYWJsZSAmJiAoc3RhdGUubGVuZ3RoID49IHN0YXRlLmhpZ2hXYXRlck1hcmsgfHwgc3RhdGUuZW5kZWQpKSB7XG4gICAgZGVidWcoJ3JlYWQ6IGVtaXRSZWFkYWJsZScsIHN0YXRlLmxlbmd0aCwgc3RhdGUuZW5kZWQpO1xuICAgIGlmIChzdGF0ZS5sZW5ndGggPT09IDAgJiYgc3RhdGUuZW5kZWQpIGVuZFJlYWRhYmxlKHRoaXMpO2Vsc2UgZW1pdFJlYWRhYmxlKHRoaXMpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbiA9IGhvd011Y2hUb1JlYWQobiwgc3RhdGUpO1xuXG4gIC8vIGlmIHdlJ3ZlIGVuZGVkLCBhbmQgd2UncmUgbm93IGNsZWFyLCB0aGVuIGZpbmlzaCBpdCB1cC5cbiAgaWYgKG4gPT09IDAgJiYgc3RhdGUuZW5kZWQpIHtcbiAgICBpZiAoc3RhdGUubGVuZ3RoID09PSAwKSBlbmRSZWFkYWJsZSh0aGlzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIEFsbCB0aGUgYWN0dWFsIGNodW5rIGdlbmVyYXRpb24gbG9naWMgbmVlZHMgdG8gYmVcbiAgLy8gKmJlbG93KiB0aGUgY2FsbCB0byBfcmVhZC4gIFRoZSByZWFzb24gaXMgdGhhdCBpbiBjZXJ0YWluXG4gIC8vIHN5bnRoZXRpYyBzdHJlYW0gY2FzZXMsIHN1Y2ggYXMgcGFzc3Rocm91Z2ggc3RyZWFtcywgX3JlYWRcbiAgLy8gbWF5IGJlIGEgY29tcGxldGVseSBzeW5jaHJvbm91cyBvcGVyYXRpb24gd2hpY2ggbWF5IGNoYW5nZVxuICAvLyB0aGUgc3RhdGUgb2YgdGhlIHJlYWQgYnVmZmVyLCBwcm92aWRpbmcgZW5vdWdoIGRhdGEgd2hlblxuICAvLyBiZWZvcmUgdGhlcmUgd2FzICpub3QqIGVub3VnaC5cbiAgLy9cbiAgLy8gU28sIHRoZSBzdGVwcyBhcmU6XG4gIC8vIDEuIEZpZ3VyZSBvdXQgd2hhdCB0aGUgc3RhdGUgb2YgdGhpbmdzIHdpbGwgYmUgYWZ0ZXIgd2UgZG9cbiAgLy8gYSByZWFkIGZyb20gdGhlIGJ1ZmZlci5cbiAgLy9cbiAgLy8gMi4gSWYgdGhhdCByZXN1bHRpbmcgc3RhdGUgd2lsbCB0cmlnZ2VyIGEgX3JlYWQsIHRoZW4gY2FsbCBfcmVhZC5cbiAgLy8gTm90ZSB0aGF0IHRoaXMgbWF5IGJlIGFzeW5jaHJvbm91cywgb3Igc3luY2hyb25vdXMuICBZZXMsIGl0IGlzXG4gIC8vIGRlZXBseSB1Z2x5IHRvIHdyaXRlIEFQSXMgdGhpcyB3YXksIGJ1dCB0aGF0IHN0aWxsIGRvZXNuJ3QgbWVhblxuICAvLyB0aGF0IHRoZSBSZWFkYWJsZSBjbGFzcyBzaG91bGQgYmVoYXZlIGltcHJvcGVybHksIGFzIHN0cmVhbXMgYXJlXG4gIC8vIGRlc2lnbmVkIHRvIGJlIHN5bmMvYXN5bmMgYWdub3N0aWMuXG4gIC8vIFRha2Ugbm90ZSBpZiB0aGUgX3JlYWQgY2FsbCBpcyBzeW5jIG9yIGFzeW5jIChpZSwgaWYgdGhlIHJlYWQgY2FsbFxuICAvLyBoYXMgcmV0dXJuZWQgeWV0KSwgc28gdGhhdCB3ZSBrbm93IHdoZXRoZXIgb3Igbm90IGl0J3Mgc2FmZSB0byBlbWl0XG4gIC8vICdyZWFkYWJsZScgZXRjLlxuICAvL1xuICAvLyAzLiBBY3R1YWxseSBwdWxsIHRoZSByZXF1ZXN0ZWQgY2h1bmtzIG91dCBvZiB0aGUgYnVmZmVyIGFuZCByZXR1cm4uXG5cbiAgLy8gaWYgd2UgbmVlZCBhIHJlYWRhYmxlIGV2ZW50LCB0aGVuIHdlIG5lZWQgdG8gZG8gc29tZSByZWFkaW5nLlxuICB2YXIgZG9SZWFkID0gc3RhdGUubmVlZFJlYWRhYmxlO1xuICBkZWJ1ZygnbmVlZCByZWFkYWJsZScsIGRvUmVhZCk7XG5cbiAgLy8gaWYgd2UgY3VycmVudGx5IGhhdmUgbGVzcyB0aGFuIHRoZSBoaWdoV2F0ZXJNYXJrLCB0aGVuIGFsc28gcmVhZCBzb21lXG4gIGlmIChzdGF0ZS5sZW5ndGggPT09IDAgfHwgc3RhdGUubGVuZ3RoIC0gbiA8IHN0YXRlLmhpZ2hXYXRlck1hcmspIHtcbiAgICBkb1JlYWQgPSB0cnVlO1xuICAgIGRlYnVnKCdsZW5ndGggbGVzcyB0aGFuIHdhdGVybWFyaycsIGRvUmVhZCk7XG4gIH1cblxuICAvLyBob3dldmVyLCBpZiB3ZSd2ZSBlbmRlZCwgdGhlbiB0aGVyZSdzIG5vIHBvaW50LCBhbmQgaWYgd2UncmUgYWxyZWFkeVxuICAvLyByZWFkaW5nLCB0aGVuIGl0J3MgdW5uZWNlc3NhcnkuXG4gIGlmIChzdGF0ZS5lbmRlZCB8fCBzdGF0ZS5yZWFkaW5nKSB7XG4gICAgZG9SZWFkID0gZmFsc2U7XG4gICAgZGVidWcoJ3JlYWRpbmcgb3IgZW5kZWQnLCBkb1JlYWQpO1xuICB9IGVsc2UgaWYgKGRvUmVhZCkge1xuICAgIGRlYnVnKCdkbyByZWFkJyk7XG4gICAgc3RhdGUucmVhZGluZyA9IHRydWU7XG4gICAgc3RhdGUuc3luYyA9IHRydWU7XG4gICAgLy8gaWYgdGhlIGxlbmd0aCBpcyBjdXJyZW50bHkgemVybywgdGhlbiB3ZSAqbmVlZCogYSByZWFkYWJsZSBldmVudC5cbiAgICBpZiAoc3RhdGUubGVuZ3RoID09PSAwKSBzdGF0ZS5uZWVkUmVhZGFibGUgPSB0cnVlO1xuICAgIC8vIGNhbGwgaW50ZXJuYWwgcmVhZCBtZXRob2RcbiAgICB0aGlzLl9yZWFkKHN0YXRlLmhpZ2hXYXRlck1hcmspO1xuICAgIHN0YXRlLnN5bmMgPSBmYWxzZTtcbiAgICAvLyBJZiBfcmVhZCBwdXNoZWQgZGF0YSBzeW5jaHJvbm91c2x5LCB0aGVuIGByZWFkaW5nYCB3aWxsIGJlIGZhbHNlLFxuICAgIC8vIGFuZCB3ZSBuZWVkIHRvIHJlLWV2YWx1YXRlIGhvdyBtdWNoIGRhdGEgd2UgY2FuIHJldHVybiB0byB0aGUgdXNlci5cbiAgICBpZiAoIXN0YXRlLnJlYWRpbmcpIG4gPSBob3dNdWNoVG9SZWFkKG5PcmlnLCBzdGF0ZSk7XG4gIH1cblxuICB2YXIgcmV0O1xuICBpZiAobiA+IDApIHJldCA9IGZyb21MaXN0KG4sIHN0YXRlKTtlbHNlIHJldCA9IG51bGw7XG5cbiAgaWYgKHJldCA9PT0gbnVsbCkge1xuICAgIHN0YXRlLm5lZWRSZWFkYWJsZSA9IHRydWU7XG4gICAgbiA9IDA7XG4gIH0gZWxzZSB7XG4gICAgc3RhdGUubGVuZ3RoIC09IG47XG4gIH1cblxuICBpZiAoc3RhdGUubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gSWYgd2UgaGF2ZSBub3RoaW5nIGluIHRoZSBidWZmZXIsIHRoZW4gd2Ugd2FudCB0byBrbm93XG4gICAgLy8gYXMgc29vbiBhcyB3ZSAqZG8qIGdldCBzb21ldGhpbmcgaW50byB0aGUgYnVmZmVyLlxuICAgIGlmICghc3RhdGUuZW5kZWQpIHN0YXRlLm5lZWRSZWFkYWJsZSA9IHRydWU7XG5cbiAgICAvLyBJZiB3ZSB0cmllZCB0byByZWFkKCkgcGFzdCB0aGUgRU9GLCB0aGVuIGVtaXQgZW5kIG9uIHRoZSBuZXh0IHRpY2suXG4gICAgaWYgKG5PcmlnICE9PSBuICYmIHN0YXRlLmVuZGVkKSBlbmRSZWFkYWJsZSh0aGlzKTtcbiAgfVxuXG4gIGlmIChyZXQgIT09IG51bGwpIHRoaXMuZW1pdCgnZGF0YScsIHJldCk7XG5cbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIG9uRW9mQ2h1bmsoc3RyZWFtLCBzdGF0ZSkge1xuICBpZiAoc3RhdGUuZW5kZWQpIHJldHVybjtcbiAgaWYgKHN0YXRlLmRlY29kZXIpIHtcbiAgICB2YXIgY2h1bmsgPSBzdGF0ZS5kZWNvZGVyLmVuZCgpO1xuICAgIGlmIChjaHVuayAmJiBjaHVuay5sZW5ndGgpIHtcbiAgICAgIHN0YXRlLmJ1ZmZlci5wdXNoKGNodW5rKTtcbiAgICAgIHN0YXRlLmxlbmd0aCArPSBzdGF0ZS5vYmplY3RNb2RlID8gMSA6IGNodW5rLmxlbmd0aDtcbiAgICB9XG4gIH1cbiAgc3RhdGUuZW5kZWQgPSB0cnVlO1xuXG4gIC8vIGVtaXQgJ3JlYWRhYmxlJyBub3cgdG8gbWFrZSBzdXJlIGl0IGdldHMgcGlja2VkIHVwLlxuICBlbWl0UmVhZGFibGUoc3RyZWFtKTtcbn1cblxuLy8gRG9uJ3QgZW1pdCByZWFkYWJsZSByaWdodCBhd2F5IGluIHN5bmMgbW9kZSwgYmVjYXVzZSB0aGlzIGNhbiB0cmlnZ2VyXG4vLyBhbm90aGVyIHJlYWQoKSBjYWxsID0+IHN0YWNrIG92ZXJmbG93LiAgVGhpcyB3YXksIGl0IG1pZ2h0IHRyaWdnZXJcbi8vIGEgbmV4dFRpY2sgcmVjdXJzaW9uIHdhcm5pbmcsIGJ1dCB0aGF0J3Mgbm90IHNvIGJhZC5cbmZ1bmN0aW9uIGVtaXRSZWFkYWJsZShzdHJlYW0pIHtcbiAgdmFyIHN0YXRlID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlO1xuICBzdGF0ZS5uZWVkUmVhZGFibGUgPSBmYWxzZTtcbiAgaWYgKCFzdGF0ZS5lbWl0dGVkUmVhZGFibGUpIHtcbiAgICBkZWJ1ZygnZW1pdFJlYWRhYmxlJywgc3RhdGUuZmxvd2luZyk7XG4gICAgc3RhdGUuZW1pdHRlZFJlYWRhYmxlID0gdHJ1ZTtcbiAgICBpZiAoc3RhdGUuc3luYykgcHJvY2Vzc05leHRUaWNrKGVtaXRSZWFkYWJsZV8sIHN0cmVhbSk7ZWxzZSBlbWl0UmVhZGFibGVfKHN0cmVhbSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZW1pdFJlYWRhYmxlXyhzdHJlYW0pIHtcbiAgZGVidWcoJ2VtaXQgcmVhZGFibGUnKTtcbiAgc3RyZWFtLmVtaXQoJ3JlYWRhYmxlJyk7XG4gIGZsb3coc3RyZWFtKTtcbn1cblxuLy8gYXQgdGhpcyBwb2ludCwgdGhlIHVzZXIgaGFzIHByZXN1bWFibHkgc2VlbiB0aGUgJ3JlYWRhYmxlJyBldmVudCxcbi8vIGFuZCBjYWxsZWQgcmVhZCgpIHRvIGNvbnN1bWUgc29tZSBkYXRhLiAgdGhhdCBtYXkgaGF2ZSB0cmlnZ2VyZWRcbi8vIGluIHR1cm4gYW5vdGhlciBfcmVhZChuKSBjYWxsLCBpbiB3aGljaCBjYXNlIHJlYWRpbmcgPSB0cnVlIGlmXG4vLyBpdCdzIGluIHByb2dyZXNzLlxuLy8gSG93ZXZlciwgaWYgd2UncmUgbm90IGVuZGVkLCBvciByZWFkaW5nLCBhbmQgdGhlIGxlbmd0aCA8IGh3bSxcbi8vIHRoZW4gZ28gYWhlYWQgYW5kIHRyeSB0byByZWFkIHNvbWUgbW9yZSBwcmVlbXB0aXZlbHkuXG5mdW5jdGlvbiBtYXliZVJlYWRNb3JlKHN0cmVhbSwgc3RhdGUpIHtcbiAgaWYgKCFzdGF0ZS5yZWFkaW5nTW9yZSkge1xuICAgIHN0YXRlLnJlYWRpbmdNb3JlID0gdHJ1ZTtcbiAgICBwcm9jZXNzTmV4dFRpY2sobWF5YmVSZWFkTW9yZV8sIHN0cmVhbSwgc3RhdGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1heWJlUmVhZE1vcmVfKHN0cmVhbSwgc3RhdGUpIHtcbiAgdmFyIGxlbiA9IHN0YXRlLmxlbmd0aDtcbiAgd2hpbGUgKCFzdGF0ZS5yZWFkaW5nICYmICFzdGF0ZS5mbG93aW5nICYmICFzdGF0ZS5lbmRlZCAmJiBzdGF0ZS5sZW5ndGggPCBzdGF0ZS5oaWdoV2F0ZXJNYXJrKSB7XG4gICAgZGVidWcoJ21heWJlUmVhZE1vcmUgcmVhZCAwJyk7XG4gICAgc3RyZWFtLnJlYWQoMCk7XG4gICAgaWYgKGxlbiA9PT0gc3RhdGUubGVuZ3RoKVxuICAgICAgLy8gZGlkbid0IGdldCBhbnkgZGF0YSwgc3RvcCBzcGlubmluZy5cbiAgICAgIGJyZWFrO2Vsc2UgbGVuID0gc3RhdGUubGVuZ3RoO1xuICB9XG4gIHN0YXRlLnJlYWRpbmdNb3JlID0gZmFsc2U7XG59XG5cbi8vIGFic3RyYWN0IG1ldGhvZC4gIHRvIGJlIG92ZXJyaWRkZW4gaW4gc3BlY2lmaWMgaW1wbGVtZW50YXRpb24gY2xhc3Nlcy5cbi8vIGNhbGwgY2IoZXIsIGRhdGEpIHdoZXJlIGRhdGEgaXMgPD0gbiBpbiBsZW5ndGguXG4vLyBmb3IgdmlydHVhbCAobm9uLXN0cmluZywgbm9uLWJ1ZmZlcikgc3RyZWFtcywgXCJsZW5ndGhcIiBpcyBzb21ld2hhdFxuLy8gYXJiaXRyYXJ5LCBhbmQgcGVyaGFwcyBub3QgdmVyeSBtZWFuaW5nZnVsLlxuUmVhZGFibGUucHJvdG90eXBlLl9yZWFkID0gZnVuY3Rpb24gKG4pIHtcbiAgdGhpcy5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignX3JlYWQoKSBpcyBub3QgaW1wbGVtZW50ZWQnKSk7XG59O1xuXG5SZWFkYWJsZS5wcm90b3R5cGUucGlwZSA9IGZ1bmN0aW9uIChkZXN0LCBwaXBlT3B0cykge1xuICB2YXIgc3JjID0gdGhpcztcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcblxuICBzd2l0Y2ggKHN0YXRlLnBpcGVzQ291bnQpIHtcbiAgICBjYXNlIDA6XG4gICAgICBzdGF0ZS5waXBlcyA9IGRlc3Q7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDE6XG4gICAgICBzdGF0ZS5waXBlcyA9IFtzdGF0ZS5waXBlcywgZGVzdF07XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgc3RhdGUucGlwZXMucHVzaChkZXN0KTtcbiAgICAgIGJyZWFrO1xuICB9XG4gIHN0YXRlLnBpcGVzQ291bnQgKz0gMTtcbiAgZGVidWcoJ3BpcGUgY291bnQ9JWQgb3B0cz0laicsIHN0YXRlLnBpcGVzQ291bnQsIHBpcGVPcHRzKTtcblxuICB2YXIgZG9FbmQgPSAoIXBpcGVPcHRzIHx8IHBpcGVPcHRzLmVuZCAhPT0gZmFsc2UpICYmIGRlc3QgIT09IHByb2Nlc3Muc3Rkb3V0ICYmIGRlc3QgIT09IHByb2Nlc3Muc3RkZXJyO1xuXG4gIHZhciBlbmRGbiA9IGRvRW5kID8gb25lbmQgOiB1bnBpcGU7XG4gIGlmIChzdGF0ZS5lbmRFbWl0dGVkKSBwcm9jZXNzTmV4dFRpY2soZW5kRm4pO2Vsc2Ugc3JjLm9uY2UoJ2VuZCcsIGVuZEZuKTtcblxuICBkZXN0Lm9uKCd1bnBpcGUnLCBvbnVucGlwZSk7XG4gIGZ1bmN0aW9uIG9udW5waXBlKHJlYWRhYmxlLCB1bnBpcGVJbmZvKSB7XG4gICAgZGVidWcoJ29udW5waXBlJyk7XG4gICAgaWYgKHJlYWRhYmxlID09PSBzcmMpIHtcbiAgICAgIGlmICh1bnBpcGVJbmZvICYmIHVucGlwZUluZm8uaGFzVW5waXBlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgdW5waXBlSW5mby5oYXNVbnBpcGVkID0gdHJ1ZTtcbiAgICAgICAgY2xlYW51cCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uZW5kKCkge1xuICAgIGRlYnVnKCdvbmVuZCcpO1xuICAgIGRlc3QuZW5kKCk7XG4gIH1cblxuICAvLyB3aGVuIHRoZSBkZXN0IGRyYWlucywgaXQgcmVkdWNlcyB0aGUgYXdhaXREcmFpbiBjb3VudGVyXG4gIC8vIG9uIHRoZSBzb3VyY2UuICBUaGlzIHdvdWxkIGJlIG1vcmUgZWxlZ2FudCB3aXRoIGEgLm9uY2UoKVxuICAvLyBoYW5kbGVyIGluIGZsb3coKSwgYnV0IGFkZGluZyBhbmQgcmVtb3ZpbmcgcmVwZWF0ZWRseSBpc1xuICAvLyB0b28gc2xvdy5cbiAgdmFyIG9uZHJhaW4gPSBwaXBlT25EcmFpbihzcmMpO1xuICBkZXN0Lm9uKCdkcmFpbicsIG9uZHJhaW4pO1xuXG4gIHZhciBjbGVhbmVkVXAgPSBmYWxzZTtcbiAgZnVuY3Rpb24gY2xlYW51cCgpIHtcbiAgICBkZWJ1ZygnY2xlYW51cCcpO1xuICAgIC8vIGNsZWFudXAgZXZlbnQgaGFuZGxlcnMgb25jZSB0aGUgcGlwZSBpcyBicm9rZW5cbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIG9uY2xvc2UpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2ZpbmlzaCcsIG9uZmluaXNoKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdkcmFpbicsIG9uZHJhaW4pO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgb25lcnJvcik7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcigndW5waXBlJywgb251bnBpcGUpO1xuICAgIHNyYy5yZW1vdmVMaXN0ZW5lcignZW5kJywgb25lbmQpO1xuICAgIHNyYy5yZW1vdmVMaXN0ZW5lcignZW5kJywgdW5waXBlKTtcbiAgICBzcmMucmVtb3ZlTGlzdGVuZXIoJ2RhdGEnLCBvbmRhdGEpO1xuXG4gICAgY2xlYW5lZFVwID0gdHJ1ZTtcblxuICAgIC8vIGlmIHRoZSByZWFkZXIgaXMgd2FpdGluZyBmb3IgYSBkcmFpbiBldmVudCBmcm9tIHRoaXNcbiAgICAvLyBzcGVjaWZpYyB3cml0ZXIsIHRoZW4gaXQgd291bGQgY2F1c2UgaXQgdG8gbmV2ZXIgc3RhcnRcbiAgICAvLyBmbG93aW5nIGFnYWluLlxuICAgIC8vIFNvLCBpZiB0aGlzIGlzIGF3YWl0aW5nIGEgZHJhaW4sIHRoZW4gd2UganVzdCBjYWxsIGl0IG5vdy5cbiAgICAvLyBJZiB3ZSBkb24ndCBrbm93LCB0aGVuIGFzc3VtZSB0aGF0IHdlIGFyZSB3YWl0aW5nIGZvciBvbmUuXG4gICAgaWYgKHN0YXRlLmF3YWl0RHJhaW4gJiYgKCFkZXN0Ll93cml0YWJsZVN0YXRlIHx8IGRlc3QuX3dyaXRhYmxlU3RhdGUubmVlZERyYWluKSkgb25kcmFpbigpO1xuICB9XG5cbiAgLy8gSWYgdGhlIHVzZXIgcHVzaGVzIG1vcmUgZGF0YSB3aGlsZSB3ZSdyZSB3cml0aW5nIHRvIGRlc3QgdGhlbiB3ZSdsbCBlbmQgdXBcbiAgLy8gaW4gb25kYXRhIGFnYWluLiBIb3dldmVyLCB3ZSBvbmx5IHdhbnQgdG8gaW5jcmVhc2UgYXdhaXREcmFpbiBvbmNlIGJlY2F1c2VcbiAgLy8gZGVzdCB3aWxsIG9ubHkgZW1pdCBvbmUgJ2RyYWluJyBldmVudCBmb3IgdGhlIG11bHRpcGxlIHdyaXRlcy5cbiAgLy8gPT4gSW50cm9kdWNlIGEgZ3VhcmQgb24gaW5jcmVhc2luZyBhd2FpdERyYWluLlxuICB2YXIgaW5jcmVhc2VkQXdhaXREcmFpbiA9IGZhbHNlO1xuICBzcmMub24oJ2RhdGEnLCBvbmRhdGEpO1xuICBmdW5jdGlvbiBvbmRhdGEoY2h1bmspIHtcbiAgICBkZWJ1Zygnb25kYXRhJyk7XG4gICAgaW5jcmVhc2VkQXdhaXREcmFpbiA9IGZhbHNlO1xuICAgIHZhciByZXQgPSBkZXN0LndyaXRlKGNodW5rKTtcbiAgICBpZiAoZmFsc2UgPT09IHJldCAmJiAhaW5jcmVhc2VkQXdhaXREcmFpbikge1xuICAgICAgLy8gSWYgdGhlIHVzZXIgdW5waXBlZCBkdXJpbmcgYGRlc3Qud3JpdGUoKWAsIGl0IGlzIHBvc3NpYmxlXG4gICAgICAvLyB0byBnZXQgc3R1Y2sgaW4gYSBwZXJtYW5lbnRseSBwYXVzZWQgc3RhdGUgaWYgdGhhdCB3cml0ZVxuICAgICAgLy8gYWxzbyByZXR1cm5lZCBmYWxzZS5cbiAgICAgIC8vID0+IENoZWNrIHdoZXRoZXIgYGRlc3RgIGlzIHN0aWxsIGEgcGlwaW5nIGRlc3RpbmF0aW9uLlxuICAgICAgaWYgKChzdGF0ZS5waXBlc0NvdW50ID09PSAxICYmIHN0YXRlLnBpcGVzID09PSBkZXN0IHx8IHN0YXRlLnBpcGVzQ291bnQgPiAxICYmIGluZGV4T2Yoc3RhdGUucGlwZXMsIGRlc3QpICE9PSAtMSkgJiYgIWNsZWFuZWRVcCkge1xuICAgICAgICBkZWJ1ZygnZmFsc2Ugd3JpdGUgcmVzcG9uc2UsIHBhdXNlJywgc3JjLl9yZWFkYWJsZVN0YXRlLmF3YWl0RHJhaW4pO1xuICAgICAgICBzcmMuX3JlYWRhYmxlU3RhdGUuYXdhaXREcmFpbisrO1xuICAgICAgICBpbmNyZWFzZWRBd2FpdERyYWluID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHNyYy5wYXVzZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBkZXN0IGhhcyBhbiBlcnJvciwgdGhlbiBzdG9wIHBpcGluZyBpbnRvIGl0LlxuICAvLyBob3dldmVyLCBkb24ndCBzdXBwcmVzcyB0aGUgdGhyb3dpbmcgYmVoYXZpb3IgZm9yIHRoaXMuXG4gIGZ1bmN0aW9uIG9uZXJyb3IoZXIpIHtcbiAgICBkZWJ1Zygnb25lcnJvcicsIGVyKTtcbiAgICB1bnBpcGUoKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uZXJyb3IpO1xuICAgIGlmIChFRWxpc3RlbmVyQ291bnQoZGVzdCwgJ2Vycm9yJykgPT09IDApIGRlc3QuZW1pdCgnZXJyb3InLCBlcik7XG4gIH1cblxuICAvLyBNYWtlIHN1cmUgb3VyIGVycm9yIGhhbmRsZXIgaXMgYXR0YWNoZWQgYmVmb3JlIHVzZXJsYW5kIG9uZXMuXG4gIHByZXBlbmRMaXN0ZW5lcihkZXN0LCAnZXJyb3InLCBvbmVycm9yKTtcblxuICAvLyBCb3RoIGNsb3NlIGFuZCBmaW5pc2ggc2hvdWxkIHRyaWdnZXIgdW5waXBlLCBidXQgb25seSBvbmNlLlxuICBmdW5jdGlvbiBvbmNsb3NlKCkge1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2ZpbmlzaCcsIG9uZmluaXNoKTtcbiAgICB1bnBpcGUoKTtcbiAgfVxuICBkZXN0Lm9uY2UoJ2Nsb3NlJywgb25jbG9zZSk7XG4gIGZ1bmN0aW9uIG9uZmluaXNoKCkge1xuICAgIGRlYnVnKCdvbmZpbmlzaCcpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgb25jbG9zZSk7XG4gICAgdW5waXBlKCk7XG4gIH1cbiAgZGVzdC5vbmNlKCdmaW5pc2gnLCBvbmZpbmlzaCk7XG5cbiAgZnVuY3Rpb24gdW5waXBlKCkge1xuICAgIGRlYnVnKCd1bnBpcGUnKTtcbiAgICBzcmMudW5waXBlKGRlc3QpO1xuICB9XG5cbiAgLy8gdGVsbCB0aGUgZGVzdCB0aGF0IGl0J3MgYmVpbmcgcGlwZWQgdG9cbiAgZGVzdC5lbWl0KCdwaXBlJywgc3JjKTtcblxuICAvLyBzdGFydCB0aGUgZmxvdyBpZiBpdCBoYXNuJ3QgYmVlbiBzdGFydGVkIGFscmVhZHkuXG4gIGlmICghc3RhdGUuZmxvd2luZykge1xuICAgIGRlYnVnKCdwaXBlIHJlc3VtZScpO1xuICAgIHNyYy5yZXN1bWUoKTtcbiAgfVxuXG4gIHJldHVybiBkZXN0O1xufTtcblxuZnVuY3Rpb24gcGlwZU9uRHJhaW4oc3JjKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHN0YXRlID0gc3JjLl9yZWFkYWJsZVN0YXRlO1xuICAgIGRlYnVnKCdwaXBlT25EcmFpbicsIHN0YXRlLmF3YWl0RHJhaW4pO1xuICAgIGlmIChzdGF0ZS5hd2FpdERyYWluKSBzdGF0ZS5hd2FpdERyYWluLS07XG4gICAgaWYgKHN0YXRlLmF3YWl0RHJhaW4gPT09IDAgJiYgRUVsaXN0ZW5lckNvdW50KHNyYywgJ2RhdGEnKSkge1xuICAgICAgc3RhdGUuZmxvd2luZyA9IHRydWU7XG4gICAgICBmbG93KHNyYyk7XG4gICAgfVxuICB9O1xufVxuXG5SZWFkYWJsZS5wcm90b3R5cGUudW5waXBlID0gZnVuY3Rpb24gKGRlc3QpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcbiAgdmFyIHVucGlwZUluZm8gPSB7IGhhc1VucGlwZWQ6IGZhbHNlIH07XG5cbiAgLy8gaWYgd2UncmUgbm90IHBpcGluZyBhbnl3aGVyZSwgdGhlbiBkbyBub3RoaW5nLlxuICBpZiAoc3RhdGUucGlwZXNDb3VudCA9PT0gMCkgcmV0dXJuIHRoaXM7XG5cbiAgLy8ganVzdCBvbmUgZGVzdGluYXRpb24uICBtb3N0IGNvbW1vbiBjYXNlLlxuICBpZiAoc3RhdGUucGlwZXNDb3VudCA9PT0gMSkge1xuICAgIC8vIHBhc3NlZCBpbiBvbmUsIGJ1dCBpdCdzIG5vdCB0aGUgcmlnaHQgb25lLlxuICAgIGlmIChkZXN0ICYmIGRlc3QgIT09IHN0YXRlLnBpcGVzKSByZXR1cm4gdGhpcztcblxuICAgIGlmICghZGVzdCkgZGVzdCA9IHN0YXRlLnBpcGVzO1xuXG4gICAgLy8gZ290IGEgbWF0Y2guXG4gICAgc3RhdGUucGlwZXMgPSBudWxsO1xuICAgIHN0YXRlLnBpcGVzQ291bnQgPSAwO1xuICAgIHN0YXRlLmZsb3dpbmcgPSBmYWxzZTtcbiAgICBpZiAoZGVzdCkgZGVzdC5lbWl0KCd1bnBpcGUnLCB0aGlzLCB1bnBpcGVJbmZvKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNsb3cgY2FzZS4gbXVsdGlwbGUgcGlwZSBkZXN0aW5hdGlvbnMuXG5cbiAgaWYgKCFkZXN0KSB7XG4gICAgLy8gcmVtb3ZlIGFsbC5cbiAgICB2YXIgZGVzdHMgPSBzdGF0ZS5waXBlcztcbiAgICB2YXIgbGVuID0gc3RhdGUucGlwZXNDb3VudDtcbiAgICBzdGF0ZS5waXBlcyA9IG51bGw7XG4gICAgc3RhdGUucGlwZXNDb3VudCA9IDA7XG4gICAgc3RhdGUuZmxvd2luZyA9IGZhbHNlO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgZGVzdHNbaV0uZW1pdCgndW5waXBlJywgdGhpcywgdW5waXBlSW5mbyk7XG4gICAgfXJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gdHJ5IHRvIGZpbmQgdGhlIHJpZ2h0IG9uZS5cbiAgdmFyIGluZGV4ID0gaW5kZXhPZihzdGF0ZS5waXBlcywgZGVzdCk7XG4gIGlmIChpbmRleCA9PT0gLTEpIHJldHVybiB0aGlzO1xuXG4gIHN0YXRlLnBpcGVzLnNwbGljZShpbmRleCwgMSk7XG4gIHN0YXRlLnBpcGVzQ291bnQgLT0gMTtcbiAgaWYgKHN0YXRlLnBpcGVzQ291bnQgPT09IDEpIHN0YXRlLnBpcGVzID0gc3RhdGUucGlwZXNbMF07XG5cbiAgZGVzdC5lbWl0KCd1bnBpcGUnLCB0aGlzLCB1bnBpcGVJbmZvKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIHNldCB1cCBkYXRhIGV2ZW50cyBpZiB0aGV5IGFyZSBhc2tlZCBmb3Jcbi8vIEVuc3VyZSByZWFkYWJsZSBsaXN0ZW5lcnMgZXZlbnR1YWxseSBnZXQgc29tZXRoaW5nXG5SZWFkYWJsZS5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAoZXYsIGZuKSB7XG4gIHZhciByZXMgPSBTdHJlYW0ucHJvdG90eXBlLm9uLmNhbGwodGhpcywgZXYsIGZuKTtcblxuICBpZiAoZXYgPT09ICdkYXRhJykge1xuICAgIC8vIFN0YXJ0IGZsb3dpbmcgb24gbmV4dCB0aWNrIGlmIHN0cmVhbSBpc24ndCBleHBsaWNpdGx5IHBhdXNlZFxuICAgIGlmICh0aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmcgIT09IGZhbHNlKSB0aGlzLnJlc3VtZSgpO1xuICB9IGVsc2UgaWYgKGV2ID09PSAncmVhZGFibGUnKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcbiAgICBpZiAoIXN0YXRlLmVuZEVtaXR0ZWQgJiYgIXN0YXRlLnJlYWRhYmxlTGlzdGVuaW5nKSB7XG4gICAgICBzdGF0ZS5yZWFkYWJsZUxpc3RlbmluZyA9IHN0YXRlLm5lZWRSZWFkYWJsZSA9IHRydWU7XG4gICAgICBzdGF0ZS5lbWl0dGVkUmVhZGFibGUgPSBmYWxzZTtcbiAgICAgIGlmICghc3RhdGUucmVhZGluZykge1xuICAgICAgICBwcm9jZXNzTmV4dFRpY2soblJlYWRpbmdOZXh0VGljaywgdGhpcyk7XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmxlbmd0aCkge1xuICAgICAgICBlbWl0UmVhZGFibGUodGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcztcbn07XG5SZWFkYWJsZS5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBSZWFkYWJsZS5wcm90b3R5cGUub247XG5cbmZ1bmN0aW9uIG5SZWFkaW5nTmV4dFRpY2soc2VsZikge1xuICBkZWJ1ZygncmVhZGFibGUgbmV4dHRpY2sgcmVhZCAwJyk7XG4gIHNlbGYucmVhZCgwKTtcbn1cblxuLy8gcGF1c2UoKSBhbmQgcmVzdW1lKCkgYXJlIHJlbW5hbnRzIG9mIHRoZSBsZWdhY3kgcmVhZGFibGUgc3RyZWFtIEFQSVxuLy8gSWYgdGhlIHVzZXIgdXNlcyB0aGVtLCB0aGVuIHN3aXRjaCBpbnRvIG9sZCBtb2RlLlxuUmVhZGFibGUucHJvdG90eXBlLnJlc3VtZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcbiAgaWYgKCFzdGF0ZS5mbG93aW5nKSB7XG4gICAgZGVidWcoJ3Jlc3VtZScpO1xuICAgIHN0YXRlLmZsb3dpbmcgPSB0cnVlO1xuICAgIHJlc3VtZSh0aGlzLCBzdGF0ZSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5mdW5jdGlvbiByZXN1bWUoc3RyZWFtLCBzdGF0ZSkge1xuICBpZiAoIXN0YXRlLnJlc3VtZVNjaGVkdWxlZCkge1xuICAgIHN0YXRlLnJlc3VtZVNjaGVkdWxlZCA9IHRydWU7XG4gICAgcHJvY2Vzc05leHRUaWNrKHJlc3VtZV8sIHN0cmVhbSwgc3RhdGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc3VtZV8oc3RyZWFtLCBzdGF0ZSkge1xuICBpZiAoIXN0YXRlLnJlYWRpbmcpIHtcbiAgICBkZWJ1ZygncmVzdW1lIHJlYWQgMCcpO1xuICAgIHN0cmVhbS5yZWFkKDApO1xuICB9XG5cbiAgc3RhdGUucmVzdW1lU2NoZWR1bGVkID0gZmFsc2U7XG4gIHN0YXRlLmF3YWl0RHJhaW4gPSAwO1xuICBzdHJlYW0uZW1pdCgncmVzdW1lJyk7XG4gIGZsb3coc3RyZWFtKTtcbiAgaWYgKHN0YXRlLmZsb3dpbmcgJiYgIXN0YXRlLnJlYWRpbmcpIHN0cmVhbS5yZWFkKDApO1xufVxuXG5SZWFkYWJsZS5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gIGRlYnVnKCdjYWxsIHBhdXNlIGZsb3dpbmc9JWonLCB0aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmcpO1xuICBpZiAoZmFsc2UgIT09IHRoaXMuX3JlYWRhYmxlU3RhdGUuZmxvd2luZykge1xuICAgIGRlYnVnKCdwYXVzZScpO1xuICAgIHRoaXMuX3JlYWRhYmxlU3RhdGUuZmxvd2luZyA9IGZhbHNlO1xuICAgIHRoaXMuZW1pdCgncGF1c2UnKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbmZ1bmN0aW9uIGZsb3coc3RyZWFtKSB7XG4gIHZhciBzdGF0ZSA9IHN0cmVhbS5fcmVhZGFibGVTdGF0ZTtcbiAgZGVidWcoJ2Zsb3cnLCBzdGF0ZS5mbG93aW5nKTtcbiAgd2hpbGUgKHN0YXRlLmZsb3dpbmcgJiYgc3RyZWFtLnJlYWQoKSAhPT0gbnVsbCkge31cbn1cblxuLy8gd3JhcCBhbiBvbGQtc3R5bGUgc3RyZWFtIGFzIHRoZSBhc3luYyBkYXRhIHNvdXJjZS5cbi8vIFRoaXMgaXMgKm5vdCogcGFydCBvZiB0aGUgcmVhZGFibGUgc3RyZWFtIGludGVyZmFjZS5cbi8vIEl0IGlzIGFuIHVnbHkgdW5mb3J0dW5hdGUgbWVzcyBvZiBoaXN0b3J5LlxuUmVhZGFibGUucHJvdG90eXBlLndyYXAgPSBmdW5jdGlvbiAoc3RyZWFtKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG4gIHZhciBwYXVzZWQgPSBmYWxzZTtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHN0cmVhbS5vbignZW5kJywgZnVuY3Rpb24gKCkge1xuICAgIGRlYnVnKCd3cmFwcGVkIGVuZCcpO1xuICAgIGlmIChzdGF0ZS5kZWNvZGVyICYmICFzdGF0ZS5lbmRlZCkge1xuICAgICAgdmFyIGNodW5rID0gc3RhdGUuZGVjb2Rlci5lbmQoKTtcbiAgICAgIGlmIChjaHVuayAmJiBjaHVuay5sZW5ndGgpIHNlbGYucHVzaChjaHVuayk7XG4gICAgfVxuXG4gICAgc2VsZi5wdXNoKG51bGwpO1xuICB9KTtcblxuICBzdHJlYW0ub24oJ2RhdGEnLCBmdW5jdGlvbiAoY2h1bmspIHtcbiAgICBkZWJ1Zygnd3JhcHBlZCBkYXRhJyk7XG4gICAgaWYgKHN0YXRlLmRlY29kZXIpIGNodW5rID0gc3RhdGUuZGVjb2Rlci53cml0ZShjaHVuayk7XG5cbiAgICAvLyBkb24ndCBza2lwIG92ZXIgZmFsc3kgdmFsdWVzIGluIG9iamVjdE1vZGVcbiAgICBpZiAoc3RhdGUub2JqZWN0TW9kZSAmJiAoY2h1bmsgPT09IG51bGwgfHwgY2h1bmsgPT09IHVuZGVmaW5lZCkpIHJldHVybjtlbHNlIGlmICghc3RhdGUub2JqZWN0TW9kZSAmJiAoIWNodW5rIHx8ICFjaHVuay5sZW5ndGgpKSByZXR1cm47XG5cbiAgICB2YXIgcmV0ID0gc2VsZi5wdXNoKGNodW5rKTtcbiAgICBpZiAoIXJldCkge1xuICAgICAgcGF1c2VkID0gdHJ1ZTtcbiAgICAgIHN0cmVhbS5wYXVzZSgpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gcHJveHkgYWxsIHRoZSBvdGhlciBtZXRob2RzLlxuICAvLyBpbXBvcnRhbnQgd2hlbiB3cmFwcGluZyBmaWx0ZXJzIGFuZCBkdXBsZXhlcy5cbiAgZm9yICh2YXIgaSBpbiBzdHJlYW0pIHtcbiAgICBpZiAodGhpc1tpXSA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBzdHJlYW1baV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXNbaV0gPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHN0cmVhbVttZXRob2RdLmFwcGx5KHN0cmVhbSwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgIH0oaSk7XG4gICAgfVxuICB9XG5cbiAgLy8gcHJveHkgY2VydGFpbiBpbXBvcnRhbnQgZXZlbnRzLlxuICBmb3IgKHZhciBuID0gMDsgbiA8IGtQcm94eUV2ZW50cy5sZW5ndGg7IG4rKykge1xuICAgIHN0cmVhbS5vbihrUHJveHlFdmVudHNbbl0sIHNlbGYuZW1pdC5iaW5kKHNlbGYsIGtQcm94eUV2ZW50c1tuXSkpO1xuICB9XG5cbiAgLy8gd2hlbiB3ZSB0cnkgdG8gY29uc3VtZSBzb21lIG1vcmUgYnl0ZXMsIHNpbXBseSB1bnBhdXNlIHRoZVxuICAvLyB1bmRlcmx5aW5nIHN0cmVhbS5cbiAgc2VsZi5fcmVhZCA9IGZ1bmN0aW9uIChuKSB7XG4gICAgZGVidWcoJ3dyYXBwZWQgX3JlYWQnLCBuKTtcbiAgICBpZiAocGF1c2VkKSB7XG4gICAgICBwYXVzZWQgPSBmYWxzZTtcbiAgICAgIHN0cmVhbS5yZXN1bWUoKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHNlbGY7XG59O1xuXG4vLyBleHBvc2VkIGZvciB0ZXN0aW5nIHB1cnBvc2VzIG9ubHkuXG5SZWFkYWJsZS5fZnJvbUxpc3QgPSBmcm9tTGlzdDtcblxuLy8gUGx1Y2sgb2ZmIG4gYnl0ZXMgZnJvbSBhbiBhcnJheSBvZiBidWZmZXJzLlxuLy8gTGVuZ3RoIGlzIHRoZSBjb21iaW5lZCBsZW5ndGhzIG9mIGFsbCB0aGUgYnVmZmVycyBpbiB0aGUgbGlzdC5cbi8vIFRoaXMgZnVuY3Rpb24gaXMgZGVzaWduZWQgdG8gYmUgaW5saW5hYmxlLCBzbyBwbGVhc2UgdGFrZSBjYXJlIHdoZW4gbWFraW5nXG4vLyBjaGFuZ2VzIHRvIHRoZSBmdW5jdGlvbiBib2R5LlxuZnVuY3Rpb24gZnJvbUxpc3Qobiwgc3RhdGUpIHtcbiAgLy8gbm90aGluZyBidWZmZXJlZFxuICBpZiAoc3RhdGUubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblxuICB2YXIgcmV0O1xuICBpZiAoc3RhdGUub2JqZWN0TW9kZSkgcmV0ID0gc3RhdGUuYnVmZmVyLnNoaWZ0KCk7ZWxzZSBpZiAoIW4gfHwgbiA+PSBzdGF0ZS5sZW5ndGgpIHtcbiAgICAvLyByZWFkIGl0IGFsbCwgdHJ1bmNhdGUgdGhlIGxpc3RcbiAgICBpZiAoc3RhdGUuZGVjb2RlcikgcmV0ID0gc3RhdGUuYnVmZmVyLmpvaW4oJycpO2Vsc2UgaWYgKHN0YXRlLmJ1ZmZlci5sZW5ndGggPT09IDEpIHJldCA9IHN0YXRlLmJ1ZmZlci5oZWFkLmRhdGE7ZWxzZSByZXQgPSBzdGF0ZS5idWZmZXIuY29uY2F0KHN0YXRlLmxlbmd0aCk7XG4gICAgc3RhdGUuYnVmZmVyLmNsZWFyKCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gcmVhZCBwYXJ0IG9mIGxpc3RcbiAgICByZXQgPSBmcm9tTGlzdFBhcnRpYWwobiwgc3RhdGUuYnVmZmVyLCBzdGF0ZS5kZWNvZGVyKTtcbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5cbi8vIEV4dHJhY3RzIG9ubHkgZW5vdWdoIGJ1ZmZlcmVkIGRhdGEgdG8gc2F0aXNmeSB0aGUgYW1vdW50IHJlcXVlc3RlZC5cbi8vIFRoaXMgZnVuY3Rpb24gaXMgZGVzaWduZWQgdG8gYmUgaW5saW5hYmxlLCBzbyBwbGVhc2UgdGFrZSBjYXJlIHdoZW4gbWFraW5nXG4vLyBjaGFuZ2VzIHRvIHRoZSBmdW5jdGlvbiBib2R5LlxuZnVuY3Rpb24gZnJvbUxpc3RQYXJ0aWFsKG4sIGxpc3QsIGhhc1N0cmluZ3MpIHtcbiAgdmFyIHJldDtcbiAgaWYgKG4gPCBsaXN0LmhlYWQuZGF0YS5sZW5ndGgpIHtcbiAgICAvLyBzbGljZSBpcyB0aGUgc2FtZSBmb3IgYnVmZmVycyBhbmQgc3RyaW5nc1xuICAgIHJldCA9IGxpc3QuaGVhZC5kYXRhLnNsaWNlKDAsIG4pO1xuICAgIGxpc3QuaGVhZC5kYXRhID0gbGlzdC5oZWFkLmRhdGEuc2xpY2Uobik7XG4gIH0gZWxzZSBpZiAobiA9PT0gbGlzdC5oZWFkLmRhdGEubGVuZ3RoKSB7XG4gICAgLy8gZmlyc3QgY2h1bmsgaXMgYSBwZXJmZWN0IG1hdGNoXG4gICAgcmV0ID0gbGlzdC5zaGlmdCgpO1xuICB9IGVsc2Uge1xuICAgIC8vIHJlc3VsdCBzcGFucyBtb3JlIHRoYW4gb25lIGJ1ZmZlclxuICAgIHJldCA9IGhhc1N0cmluZ3MgPyBjb3B5RnJvbUJ1ZmZlclN0cmluZyhuLCBsaXN0KSA6IGNvcHlGcm9tQnVmZmVyKG4sIGxpc3QpO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbi8vIENvcGllcyBhIHNwZWNpZmllZCBhbW91bnQgb2YgY2hhcmFjdGVycyBmcm9tIHRoZSBsaXN0IG9mIGJ1ZmZlcmVkIGRhdGFcbi8vIGNodW5rcy5cbi8vIFRoaXMgZnVuY3Rpb24gaXMgZGVzaWduZWQgdG8gYmUgaW5saW5hYmxlLCBzbyBwbGVhc2UgdGFrZSBjYXJlIHdoZW4gbWFraW5nXG4vLyBjaGFuZ2VzIHRvIHRoZSBmdW5jdGlvbiBib2R5LlxuZnVuY3Rpb24gY29weUZyb21CdWZmZXJTdHJpbmcobiwgbGlzdCkge1xuICB2YXIgcCA9IGxpc3QuaGVhZDtcbiAgdmFyIGMgPSAxO1xuICB2YXIgcmV0ID0gcC5kYXRhO1xuICBuIC09IHJldC5sZW5ndGg7XG4gIHdoaWxlIChwID0gcC5uZXh0KSB7XG4gICAgdmFyIHN0ciA9IHAuZGF0YTtcbiAgICB2YXIgbmIgPSBuID4gc3RyLmxlbmd0aCA/IHN0ci5sZW5ndGggOiBuO1xuICAgIGlmIChuYiA9PT0gc3RyLmxlbmd0aCkgcmV0ICs9IHN0cjtlbHNlIHJldCArPSBzdHIuc2xpY2UoMCwgbik7XG4gICAgbiAtPSBuYjtcbiAgICBpZiAobiA9PT0gMCkge1xuICAgICAgaWYgKG5iID09PSBzdHIubGVuZ3RoKSB7XG4gICAgICAgICsrYztcbiAgICAgICAgaWYgKHAubmV4dCkgbGlzdC5oZWFkID0gcC5uZXh0O2Vsc2UgbGlzdC5oZWFkID0gbGlzdC50YWlsID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpc3QuaGVhZCA9IHA7XG4gICAgICAgIHAuZGF0YSA9IHN0ci5zbGljZShuYik7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgKytjO1xuICB9XG4gIGxpc3QubGVuZ3RoIC09IGM7XG4gIHJldHVybiByZXQ7XG59XG5cbi8vIENvcGllcyBhIHNwZWNpZmllZCBhbW91bnQgb2YgYnl0ZXMgZnJvbSB0aGUgbGlzdCBvZiBidWZmZXJlZCBkYXRhIGNodW5rcy5cbi8vIFRoaXMgZnVuY3Rpb24gaXMgZGVzaWduZWQgdG8gYmUgaW5saW5hYmxlLCBzbyBwbGVhc2UgdGFrZSBjYXJlIHdoZW4gbWFraW5nXG4vLyBjaGFuZ2VzIHRvIHRoZSBmdW5jdGlvbiBib2R5LlxuZnVuY3Rpb24gY29weUZyb21CdWZmZXIobiwgbGlzdCkge1xuICB2YXIgcmV0ID0gQnVmZmVyLmFsbG9jVW5zYWZlKG4pO1xuICB2YXIgcCA9IGxpc3QuaGVhZDtcbiAgdmFyIGMgPSAxO1xuICBwLmRhdGEuY29weShyZXQpO1xuICBuIC09IHAuZGF0YS5sZW5ndGg7XG4gIHdoaWxlIChwID0gcC5uZXh0KSB7XG4gICAgdmFyIGJ1ZiA9IHAuZGF0YTtcbiAgICB2YXIgbmIgPSBuID4gYnVmLmxlbmd0aCA/IGJ1Zi5sZW5ndGggOiBuO1xuICAgIGJ1Zi5jb3B5KHJldCwgcmV0Lmxlbmd0aCAtIG4sIDAsIG5iKTtcbiAgICBuIC09IG5iO1xuICAgIGlmIChuID09PSAwKSB7XG4gICAgICBpZiAobmIgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICAgICAgKytjO1xuICAgICAgICBpZiAocC5uZXh0KSBsaXN0LmhlYWQgPSBwLm5leHQ7ZWxzZSBsaXN0LmhlYWQgPSBsaXN0LnRhaWwgPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGlzdC5oZWFkID0gcDtcbiAgICAgICAgcC5kYXRhID0gYnVmLnNsaWNlKG5iKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICArK2M7XG4gIH1cbiAgbGlzdC5sZW5ndGggLT0gYztcbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gZW5kUmVhZGFibGUoc3RyZWFtKSB7XG4gIHZhciBzdGF0ZSA9IHN0cmVhbS5fcmVhZGFibGVTdGF0ZTtcblxuICAvLyBJZiB3ZSBnZXQgaGVyZSBiZWZvcmUgY29uc3VtaW5nIGFsbCB0aGUgYnl0ZXMsIHRoZW4gdGhhdCBpcyBhXG4gIC8vIGJ1ZyBpbiBub2RlLiAgU2hvdWxkIG5ldmVyIGhhcHBlbi5cbiAgaWYgKHN0YXRlLmxlbmd0aCA+IDApIHRocm93IG5ldyBFcnJvcignXCJlbmRSZWFkYWJsZSgpXCIgY2FsbGVkIG9uIG5vbi1lbXB0eSBzdHJlYW0nKTtcblxuICBpZiAoIXN0YXRlLmVuZEVtaXR0ZWQpIHtcbiAgICBzdGF0ZS5lbmRlZCA9IHRydWU7XG4gICAgcHJvY2Vzc05leHRUaWNrKGVuZFJlYWRhYmxlTlQsIHN0YXRlLCBzdHJlYW0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGVuZFJlYWRhYmxlTlQoc3RhdGUsIHN0cmVhbSkge1xuICAvLyBDaGVjayB0aGF0IHdlIGRpZG4ndCBnZXQgb25lIGxhc3QgdW5zaGlmdC5cbiAgaWYgKCFzdGF0ZS5lbmRFbWl0dGVkICYmIHN0YXRlLmxlbmd0aCA9PT0gMCkge1xuICAgIHN0YXRlLmVuZEVtaXR0ZWQgPSB0cnVlO1xuICAgIHN0cmVhbS5yZWFkYWJsZSA9IGZhbHNlO1xuICAgIHN0cmVhbS5lbWl0KCdlbmQnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JFYWNoKHhzLCBmKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0geHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZih4c1tpXSwgaSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5kZXhPZih4cywgeCkge1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHhzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGlmICh4c1tpXSA9PT0geCkgcmV0dXJuIGk7XG4gIH1cbiAgcmV0dXJuIC0xO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyBhIHRyYW5zZm9ybSBzdHJlYW0gaXMgYSByZWFkYWJsZS93cml0YWJsZSBzdHJlYW0gd2hlcmUgeW91IGRvXG4vLyBzb21ldGhpbmcgd2l0aCB0aGUgZGF0YS4gIFNvbWV0aW1lcyBpdCdzIGNhbGxlZCBhIFwiZmlsdGVyXCIsXG4vLyBidXQgdGhhdCdzIG5vdCBhIGdyZWF0IG5hbWUgZm9yIGl0LCBzaW5jZSB0aGF0IGltcGxpZXMgYSB0aGluZyB3aGVyZVxuLy8gc29tZSBiaXRzIHBhc3MgdGhyb3VnaCwgYW5kIG90aGVycyBhcmUgc2ltcGx5IGlnbm9yZWQuICAoVGhhdCB3b3VsZFxuLy8gYmUgYSB2YWxpZCBleGFtcGxlIG9mIGEgdHJhbnNmb3JtLCBvZiBjb3Vyc2UuKVxuLy9cbi8vIFdoaWxlIHRoZSBvdXRwdXQgaXMgY2F1c2FsbHkgcmVsYXRlZCB0byB0aGUgaW5wdXQsIGl0J3Mgbm90IGFcbi8vIG5lY2Vzc2FyaWx5IHN5bW1ldHJpYyBvciBzeW5jaHJvbm91cyB0cmFuc2Zvcm1hdGlvbi4gIEZvciBleGFtcGxlLFxuLy8gYSB6bGliIHN0cmVhbSBtaWdodCB0YWtlIG11bHRpcGxlIHBsYWluLXRleHQgd3JpdGVzKCksIGFuZCB0aGVuXG4vLyBlbWl0IGEgc2luZ2xlIGNvbXByZXNzZWQgY2h1bmsgc29tZSB0aW1lIGluIHRoZSBmdXR1cmUuXG4vL1xuLy8gSGVyZSdzIGhvdyB0aGlzIHdvcmtzOlxuLy9cbi8vIFRoZSBUcmFuc2Zvcm0gc3RyZWFtIGhhcyBhbGwgdGhlIGFzcGVjdHMgb2YgdGhlIHJlYWRhYmxlIGFuZCB3cml0YWJsZVxuLy8gc3RyZWFtIGNsYXNzZXMuICBXaGVuIHlvdSB3cml0ZShjaHVuayksIHRoYXQgY2FsbHMgX3dyaXRlKGNodW5rLGNiKVxuLy8gaW50ZXJuYWxseSwgYW5kIHJldHVybnMgZmFsc2UgaWYgdGhlcmUncyBhIGxvdCBvZiBwZW5kaW5nIHdyaXRlc1xuLy8gYnVmZmVyZWQgdXAuICBXaGVuIHlvdSBjYWxsIHJlYWQoKSwgdGhhdCBjYWxscyBfcmVhZChuKSB1bnRpbFxuLy8gdGhlcmUncyBlbm91Z2ggcGVuZGluZyByZWFkYWJsZSBkYXRhIGJ1ZmZlcmVkIHVwLlxuLy9cbi8vIEluIGEgdHJhbnNmb3JtIHN0cmVhbSwgdGhlIHdyaXR0ZW4gZGF0YSBpcyBwbGFjZWQgaW4gYSBidWZmZXIuICBXaGVuXG4vLyBfcmVhZChuKSBpcyBjYWxsZWQsIGl0IHRyYW5zZm9ybXMgdGhlIHF1ZXVlZCB1cCBkYXRhLCBjYWxsaW5nIHRoZVxuLy8gYnVmZmVyZWQgX3dyaXRlIGNiJ3MgYXMgaXQgY29uc3VtZXMgY2h1bmtzLiAgSWYgY29uc3VtaW5nIGEgc2luZ2xlXG4vLyB3cml0dGVuIGNodW5rIHdvdWxkIHJlc3VsdCBpbiBtdWx0aXBsZSBvdXRwdXQgY2h1bmtzLCB0aGVuIHRoZSBmaXJzdFxuLy8gb3V0cHV0dGVkIGJpdCBjYWxscyB0aGUgcmVhZGNiLCBhbmQgc3Vic2VxdWVudCBjaHVua3MganVzdCBnbyBpbnRvXG4vLyB0aGUgcmVhZCBidWZmZXIsIGFuZCB3aWxsIGNhdXNlIGl0IHRvIGVtaXQgJ3JlYWRhYmxlJyBpZiBuZWNlc3NhcnkuXG4vL1xuLy8gVGhpcyB3YXksIGJhY2stcHJlc3N1cmUgaXMgYWN0dWFsbHkgZGV0ZXJtaW5lZCBieSB0aGUgcmVhZGluZyBzaWRlLFxuLy8gc2luY2UgX3JlYWQgaGFzIHRvIGJlIGNhbGxlZCB0byBzdGFydCBwcm9jZXNzaW5nIGEgbmV3IGNodW5rLiAgSG93ZXZlcixcbi8vIGEgcGF0aG9sb2dpY2FsIGluZmxhdGUgdHlwZSBvZiB0cmFuc2Zvcm0gY2FuIGNhdXNlIGV4Y2Vzc2l2ZSBidWZmZXJpbmdcbi8vIGhlcmUuICBGb3IgZXhhbXBsZSwgaW1hZ2luZSBhIHN0cmVhbSB3aGVyZSBldmVyeSBieXRlIG9mIGlucHV0IGlzXG4vLyBpbnRlcnByZXRlZCBhcyBhbiBpbnRlZ2VyIGZyb20gMC0yNTUsIGFuZCB0aGVuIHJlc3VsdHMgaW4gdGhhdCBtYW55XG4vLyBieXRlcyBvZiBvdXRwdXQuICBXcml0aW5nIHRoZSA0IGJ5dGVzIHtmZixmZixmZixmZn0gd291bGQgcmVzdWx0IGluXG4vLyAxa2Igb2YgZGF0YSBiZWluZyBvdXRwdXQuICBJbiB0aGlzIGNhc2UsIHlvdSBjb3VsZCB3cml0ZSBhIHZlcnkgc21hbGxcbi8vIGFtb3VudCBvZiBpbnB1dCwgYW5kIGVuZCB1cCB3aXRoIGEgdmVyeSBsYXJnZSBhbW91bnQgb2Ygb3V0cHV0LiAgSW5cbi8vIHN1Y2ggYSBwYXRob2xvZ2ljYWwgaW5mbGF0aW5nIG1lY2hhbmlzbSwgdGhlcmUnZCBiZSBubyB3YXkgdG8gdGVsbFxuLy8gdGhlIHN5c3RlbSB0byBzdG9wIGRvaW5nIHRoZSB0cmFuc2Zvcm0uICBBIHNpbmdsZSA0TUIgd3JpdGUgY291bGRcbi8vIGNhdXNlIHRoZSBzeXN0ZW0gdG8gcnVuIG91dCBvZiBtZW1vcnkuXG4vL1xuLy8gSG93ZXZlciwgZXZlbiBpbiBzdWNoIGEgcGF0aG9sb2dpY2FsIGNhc2UsIG9ubHkgYSBzaW5nbGUgd3JpdHRlbiBjaHVua1xuLy8gd291bGQgYmUgY29uc3VtZWQsIGFuZCB0aGVuIHRoZSByZXN0IHdvdWxkIHdhaXQgKHVuLXRyYW5zZm9ybWVkKSB1bnRpbFxuLy8gdGhlIHJlc3VsdHMgb2YgdGhlIHByZXZpb3VzIHRyYW5zZm9ybWVkIGNodW5rIHdlcmUgY29uc3VtZWQuXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFuc2Zvcm07XG5cbnZhciBEdXBsZXggPSByZXF1aXJlKCcuL19zdHJlYW1fZHVwbGV4Jyk7XG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgdXRpbCA9IHJlcXVpcmUoJ2NvcmUtdXRpbC1pcycpO1xudXRpbC5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxudXRpbC5pbmhlcml0cyhUcmFuc2Zvcm0sIER1cGxleCk7XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0YXRlKHN0cmVhbSkge1xuICB0aGlzLmFmdGVyVHJhbnNmb3JtID0gZnVuY3Rpb24gKGVyLCBkYXRhKSB7XG4gICAgcmV0dXJuIGFmdGVyVHJhbnNmb3JtKHN0cmVhbSwgZXIsIGRhdGEpO1xuICB9O1xuXG4gIHRoaXMubmVlZFRyYW5zZm9ybSA9IGZhbHNlO1xuICB0aGlzLnRyYW5zZm9ybWluZyA9IGZhbHNlO1xuICB0aGlzLndyaXRlY2IgPSBudWxsO1xuICB0aGlzLndyaXRlY2h1bmsgPSBudWxsO1xuICB0aGlzLndyaXRlZW5jb2RpbmcgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBhZnRlclRyYW5zZm9ybShzdHJlYW0sIGVyLCBkYXRhKSB7XG4gIHZhciB0cyA9IHN0cmVhbS5fdHJhbnNmb3JtU3RhdGU7XG4gIHRzLnRyYW5zZm9ybWluZyA9IGZhbHNlO1xuXG4gIHZhciBjYiA9IHRzLndyaXRlY2I7XG5cbiAgaWYgKCFjYikge1xuICAgIHJldHVybiBzdHJlYW0uZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ3dyaXRlIGNhbGxiYWNrIGNhbGxlZCBtdWx0aXBsZSB0aW1lcycpKTtcbiAgfVxuXG4gIHRzLndyaXRlY2h1bmsgPSBudWxsO1xuICB0cy53cml0ZWNiID0gbnVsbDtcblxuICBpZiAoZGF0YSAhPT0gbnVsbCAmJiBkYXRhICE9PSB1bmRlZmluZWQpIHN0cmVhbS5wdXNoKGRhdGEpO1xuXG4gIGNiKGVyKTtcblxuICB2YXIgcnMgPSBzdHJlYW0uX3JlYWRhYmxlU3RhdGU7XG4gIHJzLnJlYWRpbmcgPSBmYWxzZTtcbiAgaWYgKHJzLm5lZWRSZWFkYWJsZSB8fCBycy5sZW5ndGggPCBycy5oaWdoV2F0ZXJNYXJrKSB7XG4gICAgc3RyZWFtLl9yZWFkKHJzLmhpZ2hXYXRlck1hcmspO1xuICB9XG59XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybShvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBUcmFuc2Zvcm0pKSByZXR1cm4gbmV3IFRyYW5zZm9ybShvcHRpb25zKTtcblxuICBEdXBsZXguY2FsbCh0aGlzLCBvcHRpb25zKTtcblxuICB0aGlzLl90cmFuc2Zvcm1TdGF0ZSA9IG5ldyBUcmFuc2Zvcm1TdGF0ZSh0aGlzKTtcblxuICB2YXIgc3RyZWFtID0gdGhpcztcblxuICAvLyBzdGFydCBvdXQgYXNraW5nIGZvciBhIHJlYWRhYmxlIGV2ZW50IG9uY2UgZGF0YSBpcyB0cmFuc2Zvcm1lZC5cbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5uZWVkUmVhZGFibGUgPSB0cnVlO1xuXG4gIC8vIHdlIGhhdmUgaW1wbGVtZW50ZWQgdGhlIF9yZWFkIG1ldGhvZCwgYW5kIGRvbmUgdGhlIG90aGVyIHRoaW5nc1xuICAvLyB0aGF0IFJlYWRhYmxlIHdhbnRzIGJlZm9yZSB0aGUgZmlyc3QgX3JlYWQgY2FsbCwgc28gdW5zZXQgdGhlXG4gIC8vIHN5bmMgZ3VhcmQgZmxhZy5cbiAgdGhpcy5fcmVhZGFibGVTdGF0ZS5zeW5jID0gZmFsc2U7XG5cbiAgaWYgKG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMudHJhbnNmb3JtID09PSAnZnVuY3Rpb24nKSB0aGlzLl90cmFuc2Zvcm0gPSBvcHRpb25zLnRyYW5zZm9ybTtcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5mbHVzaCA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5fZmx1c2ggPSBvcHRpb25zLmZsdXNoO1xuICB9XG5cbiAgLy8gV2hlbiB0aGUgd3JpdGFibGUgc2lkZSBmaW5pc2hlcywgdGhlbiBmbHVzaCBvdXQgYW55dGhpbmcgcmVtYWluaW5nLlxuICB0aGlzLm9uY2UoJ3ByZWZpbmlzaCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuX2ZsdXNoID09PSAnZnVuY3Rpb24nKSB0aGlzLl9mbHVzaChmdW5jdGlvbiAoZXIsIGRhdGEpIHtcbiAgICAgIGRvbmUoc3RyZWFtLCBlciwgZGF0YSk7XG4gICAgfSk7ZWxzZSBkb25lKHN0cmVhbSk7XG4gIH0pO1xufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiAoY2h1bmssIGVuY29kaW5nKSB7XG4gIHRoaXMuX3RyYW5zZm9ybVN0YXRlLm5lZWRUcmFuc2Zvcm0gPSBmYWxzZTtcbiAgcmV0dXJuIER1cGxleC5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIGNodW5rLCBlbmNvZGluZyk7XG59O1xuXG4vLyBUaGlzIGlzIHRoZSBwYXJ0IHdoZXJlIHlvdSBkbyBzdHVmZiFcbi8vIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb24gaW4gaW1wbGVtZW50YXRpb24gY2xhc3Nlcy5cbi8vICdjaHVuaycgaXMgYW4gaW5wdXQgY2h1bmsuXG4vL1xuLy8gQ2FsbCBgcHVzaChuZXdDaHVuaylgIHRvIHBhc3MgYWxvbmcgdHJhbnNmb3JtZWQgb3V0cHV0XG4vLyB0byB0aGUgcmVhZGFibGUgc2lkZS4gIFlvdSBtYXkgY2FsbCAncHVzaCcgemVybyBvciBtb3JlIHRpbWVzLlxuLy9cbi8vIENhbGwgYGNiKGVycilgIHdoZW4geW91IGFyZSBkb25lIHdpdGggdGhpcyBjaHVuay4gIElmIHlvdSBwYXNzXG4vLyBhbiBlcnJvciwgdGhlbiB0aGF0J2xsIHB1dCB0aGUgaHVydCBvbiB0aGUgd2hvbGUgb3BlcmF0aW9uLiAgSWYgeW91XG4vLyBuZXZlciBjYWxsIGNiKCksIHRoZW4geW91J2xsIG5ldmVyIGdldCBhbm90aGVyIGNodW5rLlxuVHJhbnNmb3JtLnByb3RvdHlwZS5fdHJhbnNmb3JtID0gZnVuY3Rpb24gKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdfdHJhbnNmb3JtKCkgaXMgbm90IGltcGxlbWVudGVkJyk7XG59O1xuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLl93cml0ZSA9IGZ1bmN0aW9uIChjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIHZhciB0cyA9IHRoaXMuX3RyYW5zZm9ybVN0YXRlO1xuICB0cy53cml0ZWNiID0gY2I7XG4gIHRzLndyaXRlY2h1bmsgPSBjaHVuaztcbiAgdHMud3JpdGVlbmNvZGluZyA9IGVuY29kaW5nO1xuICBpZiAoIXRzLnRyYW5zZm9ybWluZykge1xuICAgIHZhciBycyA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG4gICAgaWYgKHRzLm5lZWRUcmFuc2Zvcm0gfHwgcnMubmVlZFJlYWRhYmxlIHx8IHJzLmxlbmd0aCA8IHJzLmhpZ2hXYXRlck1hcmspIHRoaXMuX3JlYWQocnMuaGlnaFdhdGVyTWFyayk7XG4gIH1cbn07XG5cbi8vIERvZXNuJ3QgbWF0dGVyIHdoYXQgdGhlIGFyZ3MgYXJlIGhlcmUuXG4vLyBfdHJhbnNmb3JtIGRvZXMgYWxsIHRoZSB3b3JrLlxuLy8gVGhhdCB3ZSBnb3QgaGVyZSBtZWFucyB0aGF0IHRoZSByZWFkYWJsZSBzaWRlIHdhbnRzIG1vcmUgZGF0YS5cblRyYW5zZm9ybS5wcm90b3R5cGUuX3JlYWQgPSBmdW5jdGlvbiAobikge1xuICB2YXIgdHMgPSB0aGlzLl90cmFuc2Zvcm1TdGF0ZTtcblxuICBpZiAodHMud3JpdGVjaHVuayAhPT0gbnVsbCAmJiB0cy53cml0ZWNiICYmICF0cy50cmFuc2Zvcm1pbmcpIHtcbiAgICB0cy50cmFuc2Zvcm1pbmcgPSB0cnVlO1xuICAgIHRoaXMuX3RyYW5zZm9ybSh0cy53cml0ZWNodW5rLCB0cy53cml0ZWVuY29kaW5nLCB0cy5hZnRlclRyYW5zZm9ybSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gbWFyayB0aGF0IHdlIG5lZWQgYSB0cmFuc2Zvcm0sIHNvIHRoYXQgYW55IGRhdGEgdGhhdCBjb21lcyBpblxuICAgIC8vIHdpbGwgZ2V0IHByb2Nlc3NlZCwgbm93IHRoYXQgd2UndmUgYXNrZWQgZm9yIGl0LlxuICAgIHRzLm5lZWRUcmFuc2Zvcm0gPSB0cnVlO1xuICB9XG59O1xuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLl9kZXN0cm95ID0gZnVuY3Rpb24gKGVyciwgY2IpIHtcbiAgdmFyIF90aGlzID0gdGhpcztcblxuICBEdXBsZXgucHJvdG90eXBlLl9kZXN0cm95LmNhbGwodGhpcywgZXJyLCBmdW5jdGlvbiAoZXJyMikge1xuICAgIGNiKGVycjIpO1xuICAgIF90aGlzLmVtaXQoJ2Nsb3NlJyk7XG4gIH0pO1xufTtcblxuZnVuY3Rpb24gZG9uZShzdHJlYW0sIGVyLCBkYXRhKSB7XG4gIGlmIChlcikgcmV0dXJuIHN0cmVhbS5lbWl0KCdlcnJvcicsIGVyKTtcblxuICBpZiAoZGF0YSAhPT0gbnVsbCAmJiBkYXRhICE9PSB1bmRlZmluZWQpIHN0cmVhbS5wdXNoKGRhdGEpO1xuXG4gIC8vIGlmIHRoZXJlJ3Mgbm90aGluZyBpbiB0aGUgd3JpdGUgYnVmZmVyLCB0aGVuIHRoYXQgbWVhbnNcbiAgLy8gdGhhdCBub3RoaW5nIG1vcmUgd2lsbCBldmVyIGJlIHByb3ZpZGVkXG4gIHZhciB3cyA9IHN0cmVhbS5fd3JpdGFibGVTdGF0ZTtcbiAgdmFyIHRzID0gc3RyZWFtLl90cmFuc2Zvcm1TdGF0ZTtcblxuICBpZiAod3MubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ0NhbGxpbmcgdHJhbnNmb3JtIGRvbmUgd2hlbiB3cy5sZW5ndGggIT0gMCcpO1xuXG4gIGlmICh0cy50cmFuc2Zvcm1pbmcpIHRocm93IG5ldyBFcnJvcignQ2FsbGluZyB0cmFuc2Zvcm0gZG9uZSB3aGVuIHN0aWxsIHRyYW5zZm9ybWluZycpO1xuXG4gIHJldHVybiBzdHJlYW0ucHVzaChudWxsKTtcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gQSBiaXQgc2ltcGxlciB0aGFuIHJlYWRhYmxlIHN0cmVhbXMuXG4vLyBJbXBsZW1lbnQgYW4gYXN5bmMgLl93cml0ZShjaHVuaywgZW5jb2RpbmcsIGNiKSwgYW5kIGl0J2xsIGhhbmRsZSBhbGxcbi8vIHRoZSBkcmFpbiBldmVudCBlbWlzc2lvbiBhbmQgYnVmZmVyaW5nLlxuXG4ndXNlIHN0cmljdCc7XG5cbi8qPHJlcGxhY2VtZW50PiovXG5cbnZhciBwcm9jZXNzTmV4dFRpY2sgPSByZXF1aXJlKCdwcm9jZXNzLW5leHRpY2stYXJncycpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbm1vZHVsZS5leHBvcnRzID0gV3JpdGFibGU7XG5cbi8qIDxyZXBsYWNlbWVudD4gKi9cbmZ1bmN0aW9uIFdyaXRlUmVxKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgdGhpcy5jaHVuayA9IGNodW5rO1xuICB0aGlzLmVuY29kaW5nID0gZW5jb2Rpbmc7XG4gIHRoaXMuY2FsbGJhY2sgPSBjYjtcbiAgdGhpcy5uZXh0ID0gbnVsbDtcbn1cblxuLy8gSXQgc2VlbXMgYSBsaW5rZWQgbGlzdCBidXQgaXQgaXMgbm90XG4vLyB0aGVyZSB3aWxsIGJlIG9ubHkgMiBvZiB0aGVzZSBmb3IgZWFjaCBzdHJlYW1cbmZ1bmN0aW9uIENvcmtlZFJlcXVlc3Qoc3RhdGUpIHtcbiAgdmFyIF90aGlzID0gdGhpcztcblxuICB0aGlzLm5leHQgPSBudWxsO1xuICB0aGlzLmVudHJ5ID0gbnVsbDtcbiAgdGhpcy5maW5pc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgb25Db3JrZWRGaW5pc2goX3RoaXMsIHN0YXRlKTtcbiAgfTtcbn1cbi8qIDwvcmVwbGFjZW1lbnQ+ICovXG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgYXN5bmNXcml0ZSA9ICFwcm9jZXNzLmJyb3dzZXIgJiYgWyd2MC4xMCcsICd2MC45LiddLmluZGV4T2YocHJvY2Vzcy52ZXJzaW9uLnNsaWNlKDAsIDUpKSA+IC0xID8gc2V0SW1tZWRpYXRlIDogcHJvY2Vzc05leHRUaWNrO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgRHVwbGV4O1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbldyaXRhYmxlLldyaXRhYmxlU3RhdGUgPSBXcml0YWJsZVN0YXRlO1xuXG4vKjxyZXBsYWNlbWVudD4qL1xudmFyIHV0aWwgPSByZXF1aXJlKCdjb3JlLXV0aWwtaXMnKTtcbnV0aWwuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuLyo8L3JlcGxhY2VtZW50PiovXG5cbi8qPHJlcGxhY2VtZW50PiovXG52YXIgaW50ZXJuYWxVdGlsID0ge1xuICBkZXByZWNhdGU6IHJlcXVpcmUoJ3V0aWwtZGVwcmVjYXRlJylcbn07XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBTdHJlYW0gPSByZXF1aXJlKCcuL2ludGVybmFsL3N0cmVhbXMvc3RyZWFtJyk7XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxuLyo8cmVwbGFjZW1lbnQ+Ki9cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlcjtcbnZhciBPdXJVaW50OEFycmF5ID0gZ2xvYmFsLlVpbnQ4QXJyYXkgfHwgZnVuY3Rpb24gKCkge307XG5mdW5jdGlvbiBfdWludDhBcnJheVRvQnVmZmVyKGNodW5rKSB7XG4gIHJldHVybiBCdWZmZXIuZnJvbShjaHVuayk7XG59XG5mdW5jdGlvbiBfaXNVaW50OEFycmF5KG9iaikge1xuICByZXR1cm4gQnVmZmVyLmlzQnVmZmVyKG9iaikgfHwgb2JqIGluc3RhbmNlb2YgT3VyVWludDhBcnJheTtcbn1cbi8qPC9yZXBsYWNlbWVudD4qL1xuXG52YXIgZGVzdHJveUltcGwgPSByZXF1aXJlKCcuL2ludGVybmFsL3N0cmVhbXMvZGVzdHJveScpO1xuXG51dGlsLmluaGVyaXRzKFdyaXRhYmxlLCBTdHJlYW0pO1xuXG5mdW5jdGlvbiBub3AoKSB7fVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0YXRlKG9wdGlvbnMsIHN0cmVhbSkge1xuICBEdXBsZXggPSBEdXBsZXggfHwgcmVxdWlyZSgnLi9fc3RyZWFtX2R1cGxleCcpO1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIC8vIG9iamVjdCBzdHJlYW0gZmxhZyB0byBpbmRpY2F0ZSB3aGV0aGVyIG9yIG5vdCB0aGlzIHN0cmVhbVxuICAvLyBjb250YWlucyBidWZmZXJzIG9yIG9iamVjdHMuXG4gIHRoaXMub2JqZWN0TW9kZSA9ICEhb3B0aW9ucy5vYmplY3RNb2RlO1xuXG4gIGlmIChzdHJlYW0gaW5zdGFuY2VvZiBEdXBsZXgpIHRoaXMub2JqZWN0TW9kZSA9IHRoaXMub2JqZWN0TW9kZSB8fCAhIW9wdGlvbnMud3JpdGFibGVPYmplY3RNb2RlO1xuXG4gIC8vIHRoZSBwb2ludCBhdCB3aGljaCB3cml0ZSgpIHN0YXJ0cyByZXR1cm5pbmcgZmFsc2VcbiAgLy8gTm90ZTogMCBpcyBhIHZhbGlkIHZhbHVlLCBtZWFucyB0aGF0IHdlIGFsd2F5cyByZXR1cm4gZmFsc2UgaWZcbiAgLy8gdGhlIGVudGlyZSBidWZmZXIgaXMgbm90IGZsdXNoZWQgaW1tZWRpYXRlbHkgb24gd3JpdGUoKVxuICB2YXIgaHdtID0gb3B0aW9ucy5oaWdoV2F0ZXJNYXJrO1xuICB2YXIgZGVmYXVsdEh3bSA9IHRoaXMub2JqZWN0TW9kZSA/IDE2IDogMTYgKiAxMDI0O1xuICB0aGlzLmhpZ2hXYXRlck1hcmsgPSBod20gfHwgaHdtID09PSAwID8gaHdtIDogZGVmYXVsdEh3bTtcblxuICAvLyBjYXN0IHRvIGludHMuXG4gIHRoaXMuaGlnaFdhdGVyTWFyayA9IE1hdGguZmxvb3IodGhpcy5oaWdoV2F0ZXJNYXJrKTtcblxuICAvLyBpZiBfZmluYWwgaGFzIGJlZW4gY2FsbGVkXG4gIHRoaXMuZmluYWxDYWxsZWQgPSBmYWxzZTtcblxuICAvLyBkcmFpbiBldmVudCBmbGFnLlxuICB0aGlzLm5lZWREcmFpbiA9IGZhbHNlO1xuICAvLyBhdCB0aGUgc3RhcnQgb2YgY2FsbGluZyBlbmQoKVxuICB0aGlzLmVuZGluZyA9IGZhbHNlO1xuICAvLyB3aGVuIGVuZCgpIGhhcyBiZWVuIGNhbGxlZCwgYW5kIHJldHVybmVkXG4gIHRoaXMuZW5kZWQgPSBmYWxzZTtcbiAgLy8gd2hlbiAnZmluaXNoJyBpcyBlbWl0dGVkXG4gIHRoaXMuZmluaXNoZWQgPSBmYWxzZTtcblxuICAvLyBoYXMgaXQgYmVlbiBkZXN0cm95ZWRcbiAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZTtcblxuICAvLyBzaG91bGQgd2UgZGVjb2RlIHN0cmluZ3MgaW50byBidWZmZXJzIGJlZm9yZSBwYXNzaW5nIHRvIF93cml0ZT9cbiAgLy8gdGhpcyBpcyBoZXJlIHNvIHRoYXQgc29tZSBub2RlLWNvcmUgc3RyZWFtcyBjYW4gb3B0aW1pemUgc3RyaW5nXG4gIC8vIGhhbmRsaW5nIGF0IGEgbG93ZXIgbGV2ZWwuXG4gIHZhciBub0RlY29kZSA9IG9wdGlvbnMuZGVjb2RlU3RyaW5ncyA9PT0gZmFsc2U7XG4gIHRoaXMuZGVjb2RlU3RyaW5ncyA9ICFub0RlY29kZTtcblxuICAvLyBDcnlwdG8gaXMga2luZCBvZiBvbGQgYW5kIGNydXN0eS4gIEhpc3RvcmljYWxseSwgaXRzIGRlZmF1bHQgc3RyaW5nXG4gIC8vIGVuY29kaW5nIGlzICdiaW5hcnknIHNvIHdlIGhhdmUgdG8gbWFrZSB0aGlzIGNvbmZpZ3VyYWJsZS5cbiAgLy8gRXZlcnl0aGluZyBlbHNlIGluIHRoZSB1bml2ZXJzZSB1c2VzICd1dGY4JywgdGhvdWdoLlxuICB0aGlzLmRlZmF1bHRFbmNvZGluZyA9IG9wdGlvbnMuZGVmYXVsdEVuY29kaW5nIHx8ICd1dGY4JztcblxuICAvLyBub3QgYW4gYWN0dWFsIGJ1ZmZlciB3ZSBrZWVwIHRyYWNrIG9mLCBidXQgYSBtZWFzdXJlbWVudFxuICAvLyBvZiBob3cgbXVjaCB3ZSdyZSB3YWl0aW5nIHRvIGdldCBwdXNoZWQgdG8gc29tZSB1bmRlcmx5aW5nXG4gIC8vIHNvY2tldCBvciBmaWxlLlxuICB0aGlzLmxlbmd0aCA9IDA7XG5cbiAgLy8gYSBmbGFnIHRvIHNlZSB3aGVuIHdlJ3JlIGluIHRoZSBtaWRkbGUgb2YgYSB3cml0ZS5cbiAgdGhpcy53cml0aW5nID0gZmFsc2U7XG5cbiAgLy8gd2hlbiB0cnVlIGFsbCB3cml0ZXMgd2lsbCBiZSBidWZmZXJlZCB1bnRpbCAudW5jb3JrKCkgY2FsbFxuICB0aGlzLmNvcmtlZCA9IDA7XG5cbiAgLy8gYSBmbGFnIHRvIGJlIGFibGUgdG8gdGVsbCBpZiB0aGUgb253cml0ZSBjYiBpcyBjYWxsZWQgaW1tZWRpYXRlbHksXG4gIC8vIG9yIG9uIGEgbGF0ZXIgdGljay4gIFdlIHNldCB0aGlzIHRvIHRydWUgYXQgZmlyc3QsIGJlY2F1c2UgYW55XG4gIC8vIGFjdGlvbnMgdGhhdCBzaG91bGRuJ3QgaGFwcGVuIHVudGlsIFwibGF0ZXJcIiBzaG91bGQgZ2VuZXJhbGx5IGFsc29cbiAgLy8gbm90IGhhcHBlbiBiZWZvcmUgdGhlIGZpcnN0IHdyaXRlIGNhbGwuXG4gIHRoaXMuc3luYyA9IHRydWU7XG5cbiAgLy8gYSBmbGFnIHRvIGtub3cgaWYgd2UncmUgcHJvY2Vzc2luZyBwcmV2aW91c2x5IGJ1ZmZlcmVkIGl0ZW1zLCB3aGljaFxuICAvLyBtYXkgY2FsbCB0aGUgX3dyaXRlKCkgY2FsbGJhY2sgaW4gdGhlIHNhbWUgdGljaywgc28gdGhhdCB3ZSBkb24ndFxuICAvLyBlbmQgdXAgaW4gYW4gb3ZlcmxhcHBlZCBvbndyaXRlIHNpdHVhdGlvbi5cbiAgdGhpcy5idWZmZXJQcm9jZXNzaW5nID0gZmFsc2U7XG5cbiAgLy8gdGhlIGNhbGxiYWNrIHRoYXQncyBwYXNzZWQgdG8gX3dyaXRlKGNodW5rLGNiKVxuICB0aGlzLm9ud3JpdGUgPSBmdW5jdGlvbiAoZXIpIHtcbiAgICBvbndyaXRlKHN0cmVhbSwgZXIpO1xuICB9O1xuXG4gIC8vIHRoZSBjYWxsYmFjayB0aGF0IHRoZSB1c2VyIHN1cHBsaWVzIHRvIHdyaXRlKGNodW5rLGVuY29kaW5nLGNiKVxuICB0aGlzLndyaXRlY2IgPSBudWxsO1xuXG4gIC8vIHRoZSBhbW91bnQgdGhhdCBpcyBiZWluZyB3cml0dGVuIHdoZW4gX3dyaXRlIGlzIGNhbGxlZC5cbiAgdGhpcy53cml0ZWxlbiA9IDA7XG5cbiAgdGhpcy5idWZmZXJlZFJlcXVlc3QgPSBudWxsO1xuICB0aGlzLmxhc3RCdWZmZXJlZFJlcXVlc3QgPSBudWxsO1xuXG4gIC8vIG51bWJlciBvZiBwZW5kaW5nIHVzZXItc3VwcGxpZWQgd3JpdGUgY2FsbGJhY2tzXG4gIC8vIHRoaXMgbXVzdCBiZSAwIGJlZm9yZSAnZmluaXNoJyBjYW4gYmUgZW1pdHRlZFxuICB0aGlzLnBlbmRpbmdjYiA9IDA7XG5cbiAgLy8gZW1pdCBwcmVmaW5pc2ggaWYgdGhlIG9ubHkgdGhpbmcgd2UncmUgd2FpdGluZyBmb3IgaXMgX3dyaXRlIGNic1xuICAvLyBUaGlzIGlzIHJlbGV2YW50IGZvciBzeW5jaHJvbm91cyBUcmFuc2Zvcm0gc3RyZWFtc1xuICB0aGlzLnByZWZpbmlzaGVkID0gZmFsc2U7XG5cbiAgLy8gVHJ1ZSBpZiB0aGUgZXJyb3Igd2FzIGFscmVhZHkgZW1pdHRlZCBhbmQgc2hvdWxkIG5vdCBiZSB0aHJvd24gYWdhaW5cbiAgdGhpcy5lcnJvckVtaXR0ZWQgPSBmYWxzZTtcblxuICAvLyBjb3VudCBidWZmZXJlZCByZXF1ZXN0c1xuICB0aGlzLmJ1ZmZlcmVkUmVxdWVzdENvdW50ID0gMDtcblxuICAvLyBhbGxvY2F0ZSB0aGUgZmlyc3QgQ29ya2VkUmVxdWVzdCwgdGhlcmUgaXMgYWx3YXlzXG4gIC8vIG9uZSBhbGxvY2F0ZWQgYW5kIGZyZWUgdG8gdXNlLCBhbmQgd2UgbWFpbnRhaW4gYXQgbW9zdCB0d29cbiAgdGhpcy5jb3JrZWRSZXF1ZXN0c0ZyZWUgPSBuZXcgQ29ya2VkUmVxdWVzdCh0aGlzKTtcbn1cblxuV3JpdGFibGVTdGF0ZS5wcm90b3R5cGUuZ2V0QnVmZmVyID0gZnVuY3Rpb24gZ2V0QnVmZmVyKCkge1xuICB2YXIgY3VycmVudCA9IHRoaXMuYnVmZmVyZWRSZXF1ZXN0O1xuICB2YXIgb3V0ID0gW107XG4gIHdoaWxlIChjdXJyZW50KSB7XG4gICAgb3V0LnB1c2goY3VycmVudCk7XG4gICAgY3VycmVudCA9IGN1cnJlbnQubmV4dDtcbiAgfVxuICByZXR1cm4gb3V0O1xufTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgdHJ5IHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV3JpdGFibGVTdGF0ZS5wcm90b3R5cGUsICdidWZmZXInLCB7XG4gICAgICBnZXQ6IGludGVybmFsVXRpbC5kZXByZWNhdGUoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRCdWZmZXIoKTtcbiAgICAgIH0sICdfd3JpdGFibGVTdGF0ZS5idWZmZXIgaXMgZGVwcmVjYXRlZC4gVXNlIF93cml0YWJsZVN0YXRlLmdldEJ1ZmZlciAnICsgJ2luc3RlYWQuJywgJ0RFUDAwMDMnKVxuICAgIH0pO1xuICB9IGNhdGNoIChfKSB7fVxufSkoKTtcblxuLy8gVGVzdCBfd3JpdGFibGVTdGF0ZSBmb3IgaW5oZXJpdGFuY2UgdG8gYWNjb3VudCBmb3IgRHVwbGV4IHN0cmVhbXMsXG4vLyB3aG9zZSBwcm90b3R5cGUgY2hhaW4gb25seSBwb2ludHMgdG8gUmVhZGFibGUuXG52YXIgcmVhbEhhc0luc3RhbmNlO1xuaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLmhhc0luc3RhbmNlICYmIHR5cGVvZiBGdW5jdGlvbi5wcm90b3R5cGVbU3ltYm9sLmhhc0luc3RhbmNlXSA9PT0gJ2Z1bmN0aW9uJykge1xuICByZWFsSGFzSW5zdGFuY2UgPSBGdW5jdGlvbi5wcm90b3R5cGVbU3ltYm9sLmhhc0luc3RhbmNlXTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdyaXRhYmxlLCBTeW1ib2wuaGFzSW5zdGFuY2UsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24gKG9iamVjdCkge1xuICAgICAgaWYgKHJlYWxIYXNJbnN0YW5jZS5jYWxsKHRoaXMsIG9iamVjdCkpIHJldHVybiB0cnVlO1xuXG4gICAgICByZXR1cm4gb2JqZWN0ICYmIG9iamVjdC5fd3JpdGFibGVTdGF0ZSBpbnN0YW5jZW9mIFdyaXRhYmxlU3RhdGU7XG4gICAgfVxuICB9KTtcbn0gZWxzZSB7XG4gIHJlYWxIYXNJbnN0YW5jZSA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgdGhpcztcbiAgfTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGUob3B0aW9ucykge1xuICBEdXBsZXggPSBEdXBsZXggfHwgcmVxdWlyZSgnLi9fc3RyZWFtX2R1cGxleCcpO1xuXG4gIC8vIFdyaXRhYmxlIGN0b3IgaXMgYXBwbGllZCB0byBEdXBsZXhlcywgdG9vLlxuICAvLyBgcmVhbEhhc0luc3RhbmNlYCBpcyBuZWNlc3NhcnkgYmVjYXVzZSB1c2luZyBwbGFpbiBgaW5zdGFuY2VvZmBcbiAgLy8gd291bGQgcmV0dXJuIGZhbHNlLCBhcyBubyBgX3dyaXRhYmxlU3RhdGVgIHByb3BlcnR5IGlzIGF0dGFjaGVkLlxuXG4gIC8vIFRyeWluZyB0byB1c2UgdGhlIGN1c3RvbSBgaW5zdGFuY2VvZmAgZm9yIFdyaXRhYmxlIGhlcmUgd2lsbCBhbHNvIGJyZWFrIHRoZVxuICAvLyBOb2RlLmpzIExhenlUcmFuc2Zvcm0gaW1wbGVtZW50YXRpb24sIHdoaWNoIGhhcyBhIG5vbi10cml2aWFsIGdldHRlciBmb3JcbiAgLy8gYF93cml0YWJsZVN0YXRlYCB0aGF0IHdvdWxkIGxlYWQgdG8gaW5maW5pdGUgcmVjdXJzaW9uLlxuICBpZiAoIXJlYWxIYXNJbnN0YW5jZS5jYWxsKFdyaXRhYmxlLCB0aGlzKSAmJiAhKHRoaXMgaW5zdGFuY2VvZiBEdXBsZXgpKSB7XG4gICAgcmV0dXJuIG5ldyBXcml0YWJsZShvcHRpb25zKTtcbiAgfVxuXG4gIHRoaXMuX3dyaXRhYmxlU3RhdGUgPSBuZXcgV3JpdGFibGVTdGF0ZShvcHRpb25zLCB0aGlzKTtcblxuICAvLyBsZWdhY3kuXG4gIHRoaXMud3JpdGFibGUgPSB0cnVlO1xuXG4gIGlmIChvcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLndyaXRlID09PSAnZnVuY3Rpb24nKSB0aGlzLl93cml0ZSA9IG9wdGlvbnMud3JpdGU7XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMud3JpdGV2ID09PSAnZnVuY3Rpb24nKSB0aGlzLl93cml0ZXYgPSBvcHRpb25zLndyaXRldjtcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5kZXN0cm95ID09PSAnZnVuY3Rpb24nKSB0aGlzLl9kZXN0cm95ID0gb3B0aW9ucy5kZXN0cm95O1xuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmZpbmFsID09PSAnZnVuY3Rpb24nKSB0aGlzLl9maW5hbCA9IG9wdGlvbnMuZmluYWw7XG4gIH1cblxuICBTdHJlYW0uY2FsbCh0aGlzKTtcbn1cblxuLy8gT3RoZXJ3aXNlIHBlb3BsZSBjYW4gcGlwZSBXcml0YWJsZSBzdHJlYW1zLCB3aGljaCBpcyBqdXN0IHdyb25nLlxuV3JpdGFibGUucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ0Nhbm5vdCBwaXBlLCBub3QgcmVhZGFibGUnKSk7XG59O1xuXG5mdW5jdGlvbiB3cml0ZUFmdGVyRW5kKHN0cmVhbSwgY2IpIHtcbiAgdmFyIGVyID0gbmV3IEVycm9yKCd3cml0ZSBhZnRlciBlbmQnKTtcbiAgLy8gVE9ETzogZGVmZXIgZXJyb3IgZXZlbnRzIGNvbnNpc3RlbnRseSBldmVyeXdoZXJlLCBub3QganVzdCB0aGUgY2JcbiAgc3RyZWFtLmVtaXQoJ2Vycm9yJywgZXIpO1xuICBwcm9jZXNzTmV4dFRpY2soY2IsIGVyKTtcbn1cblxuLy8gQ2hlY2tzIHRoYXQgYSB1c2VyLXN1cHBsaWVkIGNodW5rIGlzIHZhbGlkLCBlc3BlY2lhbGx5IGZvciB0aGUgcGFydGljdWxhclxuLy8gbW9kZSB0aGUgc3RyZWFtIGlzIGluLiBDdXJyZW50bHkgdGhpcyBtZWFucyB0aGF0IGBudWxsYCBpcyBuZXZlciBhY2NlcHRlZFxuLy8gYW5kIHVuZGVmaW5lZC9ub24tc3RyaW5nIHZhbHVlcyBhcmUgb25seSBhbGxvd2VkIGluIG9iamVjdCBtb2RlLlxuZnVuY3Rpb24gdmFsaWRDaHVuayhzdHJlYW0sIHN0YXRlLCBjaHVuaywgY2IpIHtcbiAgdmFyIHZhbGlkID0gdHJ1ZTtcbiAgdmFyIGVyID0gZmFsc2U7XG5cbiAgaWYgKGNodW5rID09PSBudWxsKSB7XG4gICAgZXIgPSBuZXcgVHlwZUVycm9yKCdNYXkgbm90IHdyaXRlIG51bGwgdmFsdWVzIHRvIHN0cmVhbScpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBjaHVuayAhPT0gJ3N0cmluZycgJiYgY2h1bmsgIT09IHVuZGVmaW5lZCAmJiAhc3RhdGUub2JqZWN0TW9kZSkge1xuICAgIGVyID0gbmV3IFR5cGVFcnJvcignSW52YWxpZCBub24tc3RyaW5nL2J1ZmZlciBjaHVuaycpO1xuICB9XG4gIGlmIChlcikge1xuICAgIHN0cmVhbS5lbWl0KCdlcnJvcicsIGVyKTtcbiAgICBwcm9jZXNzTmV4dFRpY2soY2IsIGVyKTtcbiAgICB2YWxpZCA9IGZhbHNlO1xuICB9XG4gIHJldHVybiB2YWxpZDtcbn1cblxuV3JpdGFibGUucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fd3JpdGFibGVTdGF0ZTtcbiAgdmFyIHJldCA9IGZhbHNlO1xuICB2YXIgaXNCdWYgPSBfaXNVaW50OEFycmF5KGNodW5rKSAmJiAhc3RhdGUub2JqZWN0TW9kZTtcblxuICBpZiAoaXNCdWYgJiYgIUJ1ZmZlci5pc0J1ZmZlcihjaHVuaykpIHtcbiAgICBjaHVuayA9IF91aW50OEFycmF5VG9CdWZmZXIoY2h1bmspO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNiID0gZW5jb2Rpbmc7XG4gICAgZW5jb2RpbmcgPSBudWxsO1xuICB9XG5cbiAgaWYgKGlzQnVmKSBlbmNvZGluZyA9ICdidWZmZXInO2Vsc2UgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSBzdGF0ZS5kZWZhdWx0RW5jb2Rpbmc7XG5cbiAgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykgY2IgPSBub3A7XG5cbiAgaWYgKHN0YXRlLmVuZGVkKSB3cml0ZUFmdGVyRW5kKHRoaXMsIGNiKTtlbHNlIGlmIChpc0J1ZiB8fCB2YWxpZENodW5rKHRoaXMsIHN0YXRlLCBjaHVuaywgY2IpKSB7XG4gICAgc3RhdGUucGVuZGluZ2NiKys7XG4gICAgcmV0ID0gd3JpdGVPckJ1ZmZlcih0aGlzLCBzdGF0ZSwgaXNCdWYsIGNodW5rLCBlbmNvZGluZywgY2IpO1xuICB9XG5cbiAgcmV0dXJuIHJldDtcbn07XG5cbldyaXRhYmxlLnByb3RvdHlwZS5jb3JrID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc3RhdGUgPSB0aGlzLl93cml0YWJsZVN0YXRlO1xuXG4gIHN0YXRlLmNvcmtlZCsrO1xufTtcblxuV3JpdGFibGUucHJvdG90eXBlLnVuY29yayA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fd3JpdGFibGVTdGF0ZTtcblxuICBpZiAoc3RhdGUuY29ya2VkKSB7XG4gICAgc3RhdGUuY29ya2VkLS07XG5cbiAgICBpZiAoIXN0YXRlLndyaXRpbmcgJiYgIXN0YXRlLmNvcmtlZCAmJiAhc3RhdGUuZmluaXNoZWQgJiYgIXN0YXRlLmJ1ZmZlclByb2Nlc3NpbmcgJiYgc3RhdGUuYnVmZmVyZWRSZXF1ZXN0KSBjbGVhckJ1ZmZlcih0aGlzLCBzdGF0ZSk7XG4gIH1cbn07XG5cbldyaXRhYmxlLnByb3RvdHlwZS5zZXREZWZhdWx0RW5jb2RpbmcgPSBmdW5jdGlvbiBzZXREZWZhdWx0RW5jb2RpbmcoZW5jb2RpbmcpIHtcbiAgLy8gbm9kZTo6UGFyc2VFbmNvZGluZygpIHJlcXVpcmVzIGxvd2VyIGNhc2UuXG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnKSBlbmNvZGluZyA9IGVuY29kaW5nLnRvTG93ZXJDYXNlKCk7XG4gIGlmICghKFsnaGV4JywgJ3V0ZjgnLCAndXRmLTgnLCAnYXNjaWknLCAnYmluYXJ5JywgJ2Jhc2U2NCcsICd1Y3MyJywgJ3Vjcy0yJywgJ3V0ZjE2bGUnLCAndXRmLTE2bGUnLCAncmF3J10uaW5kZXhPZigoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKSkgPiAtMSkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZyk7XG4gIHRoaXMuX3dyaXRhYmxlU3RhdGUuZGVmYXVsdEVuY29kaW5nID0gZW5jb2Rpbmc7XG4gIHJldHVybiB0aGlzO1xufTtcblxuZnVuY3Rpb24gZGVjb2RlQ2h1bmsoc3RhdGUsIGNodW5rLCBlbmNvZGluZykge1xuICBpZiAoIXN0YXRlLm9iamVjdE1vZGUgJiYgc3RhdGUuZGVjb2RlU3RyaW5ncyAhPT0gZmFsc2UgJiYgdHlwZW9mIGNodW5rID09PSAnc3RyaW5nJykge1xuICAgIGNodW5rID0gQnVmZmVyLmZyb20oY2h1bmssIGVuY29kaW5nKTtcbiAgfVxuICByZXR1cm4gY2h1bms7XG59XG5cbi8vIGlmIHdlJ3JlIGFscmVhZHkgd3JpdGluZyBzb21ldGhpbmcsIHRoZW4ganVzdCBwdXQgdGhpc1xuLy8gaW4gdGhlIHF1ZXVlLCBhbmQgd2FpdCBvdXIgdHVybi4gIE90aGVyd2lzZSwgY2FsbCBfd3JpdGVcbi8vIElmIHdlIHJldHVybiBmYWxzZSwgdGhlbiB3ZSBuZWVkIGEgZHJhaW4gZXZlbnQsIHNvIHNldCB0aGF0IGZsYWcuXG5mdW5jdGlvbiB3cml0ZU9yQnVmZmVyKHN0cmVhbSwgc3RhdGUsIGlzQnVmLCBjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIGlmICghaXNCdWYpIHtcbiAgICB2YXIgbmV3Q2h1bmsgPSBkZWNvZGVDaHVuayhzdGF0ZSwgY2h1bmssIGVuY29kaW5nKTtcbiAgICBpZiAoY2h1bmsgIT09IG5ld0NodW5rKSB7XG4gICAgICBpc0J1ZiA9IHRydWU7XG4gICAgICBlbmNvZGluZyA9ICdidWZmZXInO1xuICAgICAgY2h1bmsgPSBuZXdDaHVuaztcbiAgICB9XG4gIH1cbiAgdmFyIGxlbiA9IHN0YXRlLm9iamVjdE1vZGUgPyAxIDogY2h1bmsubGVuZ3RoO1xuXG4gIHN0YXRlLmxlbmd0aCArPSBsZW47XG5cbiAgdmFyIHJldCA9IHN0YXRlLmxlbmd0aCA8IHN0YXRlLmhpZ2hXYXRlck1hcms7XG4gIC8vIHdlIG11c3QgZW5zdXJlIHRoYXQgcHJldmlvdXMgbmVlZERyYWluIHdpbGwgbm90IGJlIHJlc2V0IHRvIGZhbHNlLlxuICBpZiAoIXJldCkgc3RhdGUubmVlZERyYWluID0gdHJ1ZTtcblxuICBpZiAoc3RhdGUud3JpdGluZyB8fCBzdGF0ZS5jb3JrZWQpIHtcbiAgICB2YXIgbGFzdCA9IHN0YXRlLmxhc3RCdWZmZXJlZFJlcXVlc3Q7XG4gICAgc3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdCA9IHtcbiAgICAgIGNodW5rOiBjaHVuayxcbiAgICAgIGVuY29kaW5nOiBlbmNvZGluZyxcbiAgICAgIGlzQnVmOiBpc0J1ZixcbiAgICAgIGNhbGxiYWNrOiBjYixcbiAgICAgIG5leHQ6IG51bGxcbiAgICB9O1xuICAgIGlmIChsYXN0KSB7XG4gICAgICBsYXN0Lm5leHQgPSBzdGF0ZS5sYXN0QnVmZmVyZWRSZXF1ZXN0O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5idWZmZXJlZFJlcXVlc3QgPSBzdGF0ZS5sYXN0QnVmZmVyZWRSZXF1ZXN0O1xuICAgIH1cbiAgICBzdGF0ZS5idWZmZXJlZFJlcXVlc3RDb3VudCArPSAxO1xuICB9IGVsc2Uge1xuICAgIGRvV3JpdGUoc3RyZWFtLCBzdGF0ZSwgZmFsc2UsIGxlbiwgY2h1bmssIGVuY29kaW5nLCBjYik7XG4gIH1cblxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBkb1dyaXRlKHN0cmVhbSwgc3RhdGUsIHdyaXRldiwgbGVuLCBjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIHN0YXRlLndyaXRlbGVuID0gbGVuO1xuICBzdGF0ZS53cml0ZWNiID0gY2I7XG4gIHN0YXRlLndyaXRpbmcgPSB0cnVlO1xuICBzdGF0ZS5zeW5jID0gdHJ1ZTtcbiAgaWYgKHdyaXRldikgc3RyZWFtLl93cml0ZXYoY2h1bmssIHN0YXRlLm9ud3JpdGUpO2Vsc2Ugc3RyZWFtLl93cml0ZShjaHVuaywgZW5jb2RpbmcsIHN0YXRlLm9ud3JpdGUpO1xuICBzdGF0ZS5zeW5jID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIG9ud3JpdGVFcnJvcihzdHJlYW0sIHN0YXRlLCBzeW5jLCBlciwgY2IpIHtcbiAgLS1zdGF0ZS5wZW5kaW5nY2I7XG5cbiAgaWYgKHN5bmMpIHtcbiAgICAvLyBkZWZlciB0aGUgY2FsbGJhY2sgaWYgd2UgYXJlIGJlaW5nIGNhbGxlZCBzeW5jaHJvbm91c2x5XG4gICAgLy8gdG8gYXZvaWQgcGlsaW5nIHVwIHRoaW5ncyBvbiB0aGUgc3RhY2tcbiAgICBwcm9jZXNzTmV4dFRpY2soY2IsIGVyKTtcbiAgICAvLyB0aGlzIGNhbiBlbWl0IGZpbmlzaCwgYW5kIGl0IHdpbGwgYWx3YXlzIGhhcHBlblxuICAgIC8vIGFmdGVyIGVycm9yXG4gICAgcHJvY2Vzc05leHRUaWNrKGZpbmlzaE1heWJlLCBzdHJlYW0sIHN0YXRlKTtcbiAgICBzdHJlYW0uX3dyaXRhYmxlU3RhdGUuZXJyb3JFbWl0dGVkID0gdHJ1ZTtcbiAgICBzdHJlYW0uZW1pdCgnZXJyb3InLCBlcik7XG4gIH0gZWxzZSB7XG4gICAgLy8gdGhlIGNhbGxlciBleHBlY3QgdGhpcyB0byBoYXBwZW4gYmVmb3JlIGlmXG4gICAgLy8gaXQgaXMgYXN5bmNcbiAgICBjYihlcik7XG4gICAgc3RyZWFtLl93cml0YWJsZVN0YXRlLmVycm9yRW1pdHRlZCA9IHRydWU7XG4gICAgc3RyZWFtLmVtaXQoJ2Vycm9yJywgZXIpO1xuICAgIC8vIHRoaXMgY2FuIGVtaXQgZmluaXNoLCBidXQgZmluaXNoIG11c3RcbiAgICAvLyBhbHdheXMgZm9sbG93IGVycm9yXG4gICAgZmluaXNoTWF5YmUoc3RyZWFtLCBzdGF0ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gb253cml0ZVN0YXRlVXBkYXRlKHN0YXRlKSB7XG4gIHN0YXRlLndyaXRpbmcgPSBmYWxzZTtcbiAgc3RhdGUud3JpdGVjYiA9IG51bGw7XG4gIHN0YXRlLmxlbmd0aCAtPSBzdGF0ZS53cml0ZWxlbjtcbiAgc3RhdGUud3JpdGVsZW4gPSAwO1xufVxuXG5mdW5jdGlvbiBvbndyaXRlKHN0cmVhbSwgZXIpIHtcbiAgdmFyIHN0YXRlID0gc3RyZWFtLl93cml0YWJsZVN0YXRlO1xuICB2YXIgc3luYyA9IHN0YXRlLnN5bmM7XG4gIHZhciBjYiA9IHN0YXRlLndyaXRlY2I7XG5cbiAgb253cml0ZVN0YXRlVXBkYXRlKHN0YXRlKTtcblxuICBpZiAoZXIpIG9ud3JpdGVFcnJvcihzdHJlYW0sIHN0YXRlLCBzeW5jLCBlciwgY2IpO2Vsc2Uge1xuICAgIC8vIENoZWNrIGlmIHdlJ3JlIGFjdHVhbGx5IHJlYWR5IHRvIGZpbmlzaCwgYnV0IGRvbid0IGVtaXQgeWV0XG4gICAgdmFyIGZpbmlzaGVkID0gbmVlZEZpbmlzaChzdGF0ZSk7XG5cbiAgICBpZiAoIWZpbmlzaGVkICYmICFzdGF0ZS5jb3JrZWQgJiYgIXN0YXRlLmJ1ZmZlclByb2Nlc3NpbmcgJiYgc3RhdGUuYnVmZmVyZWRSZXF1ZXN0KSB7XG4gICAgICBjbGVhckJ1ZmZlcihzdHJlYW0sIHN0YXRlKTtcbiAgICB9XG5cbiAgICBpZiAoc3luYykge1xuICAgICAgLyo8cmVwbGFjZW1lbnQ+Ki9cbiAgICAgIGFzeW5jV3JpdGUoYWZ0ZXJXcml0ZSwgc3RyZWFtLCBzdGF0ZSwgZmluaXNoZWQsIGNiKTtcbiAgICAgIC8qPC9yZXBsYWNlbWVudD4qL1xuICAgIH0gZWxzZSB7XG4gICAgICBhZnRlcldyaXRlKHN0cmVhbSwgc3RhdGUsIGZpbmlzaGVkLCBjYik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGFmdGVyV3JpdGUoc3RyZWFtLCBzdGF0ZSwgZmluaXNoZWQsIGNiKSB7XG4gIGlmICghZmluaXNoZWQpIG9ud3JpdGVEcmFpbihzdHJlYW0sIHN0YXRlKTtcbiAgc3RhdGUucGVuZGluZ2NiLS07XG4gIGNiKCk7XG4gIGZpbmlzaE1heWJlKHN0cmVhbSwgc3RhdGUpO1xufVxuXG4vLyBNdXN0IGZvcmNlIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCBvbiBuZXh0VGljaywgc28gdGhhdCB3ZSBkb24ndFxuLy8gZW1pdCAnZHJhaW4nIGJlZm9yZSB0aGUgd3JpdGUoKSBjb25zdW1lciBnZXRzIHRoZSAnZmFsc2UnIHJldHVyblxuLy8gdmFsdWUsIGFuZCBoYXMgYSBjaGFuY2UgdG8gYXR0YWNoIGEgJ2RyYWluJyBsaXN0ZW5lci5cbmZ1bmN0aW9uIG9ud3JpdGVEcmFpbihzdHJlYW0sIHN0YXRlKSB7XG4gIGlmIChzdGF0ZS5sZW5ndGggPT09IDAgJiYgc3RhdGUubmVlZERyYWluKSB7XG4gICAgc3RhdGUubmVlZERyYWluID0gZmFsc2U7XG4gICAgc3RyZWFtLmVtaXQoJ2RyYWluJyk7XG4gIH1cbn1cblxuLy8gaWYgdGhlcmUncyBzb21ldGhpbmcgaW4gdGhlIGJ1ZmZlciB3YWl0aW5nLCB0aGVuIHByb2Nlc3MgaXRcbmZ1bmN0aW9uIGNsZWFyQnVmZmVyKHN0cmVhbSwgc3RhdGUpIHtcbiAgc3RhdGUuYnVmZmVyUHJvY2Vzc2luZyA9IHRydWU7XG4gIHZhciBlbnRyeSA9IHN0YXRlLmJ1ZmZlcmVkUmVxdWVzdDtcblxuICBpZiAoc3RyZWFtLl93cml0ZXYgJiYgZW50cnkgJiYgZW50cnkubmV4dCkge1xuICAgIC8vIEZhc3QgY2FzZSwgd3JpdGUgZXZlcnl0aGluZyB1c2luZyBfd3JpdGV2KClcbiAgICB2YXIgbCA9IHN0YXRlLmJ1ZmZlcmVkUmVxdWVzdENvdW50O1xuICAgIHZhciBidWZmZXIgPSBuZXcgQXJyYXkobCk7XG4gICAgdmFyIGhvbGRlciA9IHN0YXRlLmNvcmtlZFJlcXVlc3RzRnJlZTtcbiAgICBob2xkZXIuZW50cnkgPSBlbnRyeTtcblxuICAgIHZhciBjb3VudCA9IDA7XG4gICAgdmFyIGFsbEJ1ZmZlcnMgPSB0cnVlO1xuICAgIHdoaWxlIChlbnRyeSkge1xuICAgICAgYnVmZmVyW2NvdW50XSA9IGVudHJ5O1xuICAgICAgaWYgKCFlbnRyeS5pc0J1ZikgYWxsQnVmZmVycyA9IGZhbHNlO1xuICAgICAgZW50cnkgPSBlbnRyeS5uZXh0O1xuICAgICAgY291bnQgKz0gMTtcbiAgICB9XG4gICAgYnVmZmVyLmFsbEJ1ZmZlcnMgPSBhbGxCdWZmZXJzO1xuXG4gICAgZG9Xcml0ZShzdHJlYW0sIHN0YXRlLCB0cnVlLCBzdGF0ZS5sZW5ndGgsIGJ1ZmZlciwgJycsIGhvbGRlci5maW5pc2gpO1xuXG4gICAgLy8gZG9Xcml0ZSBpcyBhbG1vc3QgYWx3YXlzIGFzeW5jLCBkZWZlciB0aGVzZSB0byBzYXZlIGEgYml0IG9mIHRpbWVcbiAgICAvLyBhcyB0aGUgaG90IHBhdGggZW5kcyB3aXRoIGRvV3JpdGVcbiAgICBzdGF0ZS5wZW5kaW5nY2IrKztcbiAgICBzdGF0ZS5sYXN0QnVmZmVyZWRSZXF1ZXN0ID0gbnVsbDtcbiAgICBpZiAoaG9sZGVyLm5leHQpIHtcbiAgICAgIHN0YXRlLmNvcmtlZFJlcXVlc3RzRnJlZSA9IGhvbGRlci5uZXh0O1xuICAgICAgaG9sZGVyLm5leHQgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5jb3JrZWRSZXF1ZXN0c0ZyZWUgPSBuZXcgQ29ya2VkUmVxdWVzdChzdGF0ZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIFNsb3cgY2FzZSwgd3JpdGUgY2h1bmtzIG9uZS1ieS1vbmVcbiAgICB3aGlsZSAoZW50cnkpIHtcbiAgICAgIHZhciBjaHVuayA9IGVudHJ5LmNodW5rO1xuICAgICAgdmFyIGVuY29kaW5nID0gZW50cnkuZW5jb2Rpbmc7XG4gICAgICB2YXIgY2IgPSBlbnRyeS5jYWxsYmFjaztcbiAgICAgIHZhciBsZW4gPSBzdGF0ZS5vYmplY3RNb2RlID8gMSA6IGNodW5rLmxlbmd0aDtcblxuICAgICAgZG9Xcml0ZShzdHJlYW0sIHN0YXRlLCBmYWxzZSwgbGVuLCBjaHVuaywgZW5jb2RpbmcsIGNiKTtcbiAgICAgIGVudHJ5ID0gZW50cnkubmV4dDtcbiAgICAgIC8vIGlmIHdlIGRpZG4ndCBjYWxsIHRoZSBvbndyaXRlIGltbWVkaWF0ZWx5LCB0aGVuXG4gICAgICAvLyBpdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gd2FpdCB1bnRpbCBpdCBkb2VzLlxuICAgICAgLy8gYWxzbywgdGhhdCBtZWFucyB0aGF0IHRoZSBjaHVuayBhbmQgY2IgYXJlIGN1cnJlbnRseVxuICAgICAgLy8gYmVpbmcgcHJvY2Vzc2VkLCBzbyBtb3ZlIHRoZSBidWZmZXIgY291bnRlciBwYXN0IHRoZW0uXG4gICAgICBpZiAoc3RhdGUud3JpdGluZykge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZW50cnkgPT09IG51bGwpIHN0YXRlLmxhc3RCdWZmZXJlZFJlcXVlc3QgPSBudWxsO1xuICB9XG5cbiAgc3RhdGUuYnVmZmVyZWRSZXF1ZXN0Q291bnQgPSAwO1xuICBzdGF0ZS5idWZmZXJlZFJlcXVlc3QgPSBlbnRyeTtcbiAgc3RhdGUuYnVmZmVyUHJvY2Vzc2luZyA9IGZhbHNlO1xufVxuXG5Xcml0YWJsZS5wcm90b3R5cGUuX3dyaXRlID0gZnVuY3Rpb24gKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgY2IobmV3IEVycm9yKCdfd3JpdGUoKSBpcyBub3QgaW1wbGVtZW50ZWQnKSk7XG59O1xuXG5Xcml0YWJsZS5wcm90b3R5cGUuX3dyaXRldiA9IG51bGw7XG5cbldyaXRhYmxlLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbiAoY2h1bmssIGVuY29kaW5nLCBjYikge1xuICB2YXIgc3RhdGUgPSB0aGlzLl93cml0YWJsZVN0YXRlO1xuXG4gIGlmICh0eXBlb2YgY2h1bmsgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYiA9IGNodW5rO1xuICAgIGNodW5rID0gbnVsbDtcbiAgICBlbmNvZGluZyA9IG51bGw7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2IgPSBlbmNvZGluZztcbiAgICBlbmNvZGluZyA9IG51bGw7XG4gIH1cblxuICBpZiAoY2h1bmsgIT09IG51bGwgJiYgY2h1bmsgIT09IHVuZGVmaW5lZCkgdGhpcy53cml0ZShjaHVuaywgZW5jb2RpbmcpO1xuXG4gIC8vIC5lbmQoKSBmdWxseSB1bmNvcmtzXG4gIGlmIChzdGF0ZS5jb3JrZWQpIHtcbiAgICBzdGF0ZS5jb3JrZWQgPSAxO1xuICAgIHRoaXMudW5jb3JrKCk7XG4gIH1cblxuICAvLyBpZ25vcmUgdW5uZWNlc3NhcnkgZW5kKCkgY2FsbHMuXG4gIGlmICghc3RhdGUuZW5kaW5nICYmICFzdGF0ZS5maW5pc2hlZCkgZW5kV3JpdGFibGUodGhpcywgc3RhdGUsIGNiKTtcbn07XG5cbmZ1bmN0aW9uIG5lZWRGaW5pc2goc3RhdGUpIHtcbiAgcmV0dXJuIHN0YXRlLmVuZGluZyAmJiBzdGF0ZS5sZW5ndGggPT09IDAgJiYgc3RhdGUuYnVmZmVyZWRSZXF1ZXN0ID09PSBudWxsICYmICFzdGF0ZS5maW5pc2hlZCAmJiAhc3RhdGUud3JpdGluZztcbn1cbmZ1bmN0aW9uIGNhbGxGaW5hbChzdHJlYW0sIHN0YXRlKSB7XG4gIHN0cmVhbS5fZmluYWwoZnVuY3Rpb24gKGVycikge1xuICAgIHN0YXRlLnBlbmRpbmdjYi0tO1xuICAgIGlmIChlcnIpIHtcbiAgICAgIHN0cmVhbS5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgfVxuICAgIHN0YXRlLnByZWZpbmlzaGVkID0gdHJ1ZTtcbiAgICBzdHJlYW0uZW1pdCgncHJlZmluaXNoJyk7XG4gICAgZmluaXNoTWF5YmUoc3RyZWFtLCBzdGF0ZSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gcHJlZmluaXNoKHN0cmVhbSwgc3RhdGUpIHtcbiAgaWYgKCFzdGF0ZS5wcmVmaW5pc2hlZCAmJiAhc3RhdGUuZmluYWxDYWxsZWQpIHtcbiAgICBpZiAodHlwZW9mIHN0cmVhbS5fZmluYWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHN0YXRlLnBlbmRpbmdjYisrO1xuICAgICAgc3RhdGUuZmluYWxDYWxsZWQgPSB0cnVlO1xuICAgICAgcHJvY2Vzc05leHRUaWNrKGNhbGxGaW5hbCwgc3RyZWFtLCBzdGF0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLnByZWZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgIHN0cmVhbS5lbWl0KCdwcmVmaW5pc2gnKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluaXNoTWF5YmUoc3RyZWFtLCBzdGF0ZSkge1xuICB2YXIgbmVlZCA9IG5lZWRGaW5pc2goc3RhdGUpO1xuICBpZiAobmVlZCkge1xuICAgIHByZWZpbmlzaChzdHJlYW0sIHN0YXRlKTtcbiAgICBpZiAoc3RhdGUucGVuZGluZ2NiID09PSAwKSB7XG4gICAgICBzdGF0ZS5maW5pc2hlZCA9IHRydWU7XG4gICAgICBzdHJlYW0uZW1pdCgnZmluaXNoJyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBuZWVkO1xufVxuXG5mdW5jdGlvbiBlbmRXcml0YWJsZShzdHJlYW0sIHN0YXRlLCBjYikge1xuICBzdGF0ZS5lbmRpbmcgPSB0cnVlO1xuICBmaW5pc2hNYXliZShzdHJlYW0sIHN0YXRlKTtcbiAgaWYgKGNiKSB7XG4gICAgaWYgKHN0YXRlLmZpbmlzaGVkKSBwcm9jZXNzTmV4dFRpY2soY2IpO2Vsc2Ugc3RyZWFtLm9uY2UoJ2ZpbmlzaCcsIGNiKTtcbiAgfVxuICBzdGF0ZS5lbmRlZCA9IHRydWU7XG4gIHN0cmVhbS53cml0YWJsZSA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBvbkNvcmtlZEZpbmlzaChjb3JrUmVxLCBzdGF0ZSwgZXJyKSB7XG4gIHZhciBlbnRyeSA9IGNvcmtSZXEuZW50cnk7XG4gIGNvcmtSZXEuZW50cnkgPSBudWxsO1xuICB3aGlsZSAoZW50cnkpIHtcbiAgICB2YXIgY2IgPSBlbnRyeS5jYWxsYmFjaztcbiAgICBzdGF0ZS5wZW5kaW5nY2ItLTtcbiAgICBjYihlcnIpO1xuICAgIGVudHJ5ID0gZW50cnkubmV4dDtcbiAgfVxuICBpZiAoc3RhdGUuY29ya2VkUmVxdWVzdHNGcmVlKSB7XG4gICAgc3RhdGUuY29ya2VkUmVxdWVzdHNGcmVlLm5leHQgPSBjb3JrUmVxO1xuICB9IGVsc2Uge1xuICAgIHN0YXRlLmNvcmtlZFJlcXVlc3RzRnJlZSA9IGNvcmtSZXE7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFdyaXRhYmxlLnByb3RvdHlwZSwgJ2Rlc3Ryb3llZCcsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX3dyaXRhYmxlU3RhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fd3JpdGFibGVTdGF0ZS5kZXN0cm95ZWQ7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgLy8gd2UgaWdub3JlIHRoZSB2YWx1ZSBpZiB0aGUgc3RyZWFtXG4gICAgLy8gaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkIHlldFxuICAgIGlmICghdGhpcy5fd3JpdGFibGVTdGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIHRoZSB1c2VyIGlzIGV4cGxpY2l0bHlcbiAgICAvLyBtYW5hZ2luZyBkZXN0cm95ZWRcbiAgICB0aGlzLl93cml0YWJsZVN0YXRlLmRlc3Ryb3llZCA9IHZhbHVlO1xuICB9XG59KTtcblxuV3JpdGFibGUucHJvdG90eXBlLmRlc3Ryb3kgPSBkZXN0cm95SW1wbC5kZXN0cm95O1xuV3JpdGFibGUucHJvdG90eXBlLl91bmRlc3Ryb3kgPSBkZXN0cm95SW1wbC51bmRlc3Ryb3k7XG5Xcml0YWJsZS5wcm90b3R5cGUuX2Rlc3Ryb3kgPSBmdW5jdGlvbiAoZXJyLCBjYikge1xuICB0aGlzLmVuZCgpO1xuICBjYihlcnIpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbi8qPHJlcGxhY2VtZW50PiovXG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlcjtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG5mdW5jdGlvbiBjb3B5QnVmZmVyKHNyYywgdGFyZ2V0LCBvZmZzZXQpIHtcbiAgc3JjLmNvcHkodGFyZ2V0LCBvZmZzZXQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQnVmZmVyTGlzdCgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQnVmZmVyTGlzdCk7XG5cbiAgICB0aGlzLmhlYWQgPSBudWxsO1xuICAgIHRoaXMudGFpbCA9IG51bGw7XG4gICAgdGhpcy5sZW5ndGggPSAwO1xuICB9XG5cbiAgQnVmZmVyTGlzdC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uIHB1c2godikge1xuICAgIHZhciBlbnRyeSA9IHsgZGF0YTogdiwgbmV4dDogbnVsbCB9O1xuICAgIGlmICh0aGlzLmxlbmd0aCA+IDApIHRoaXMudGFpbC5uZXh0ID0gZW50cnk7ZWxzZSB0aGlzLmhlYWQgPSBlbnRyeTtcbiAgICB0aGlzLnRhaWwgPSBlbnRyeTtcbiAgICArK3RoaXMubGVuZ3RoO1xuICB9O1xuXG4gIEJ1ZmZlckxpc3QucHJvdG90eXBlLnVuc2hpZnQgPSBmdW5jdGlvbiB1bnNoaWZ0KHYpIHtcbiAgICB2YXIgZW50cnkgPSB7IGRhdGE6IHYsIG5leHQ6IHRoaXMuaGVhZCB9O1xuICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgdGhpcy50YWlsID0gZW50cnk7XG4gICAgdGhpcy5oZWFkID0gZW50cnk7XG4gICAgKyt0aGlzLmxlbmd0aDtcbiAgfTtcblxuICBCdWZmZXJMaXN0LnByb3RvdHlwZS5zaGlmdCA9IGZ1bmN0aW9uIHNoaWZ0KCkge1xuICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIHZhciByZXQgPSB0aGlzLmhlYWQuZGF0YTtcbiAgICBpZiAodGhpcy5sZW5ndGggPT09IDEpIHRoaXMuaGVhZCA9IHRoaXMudGFpbCA9IG51bGw7ZWxzZSB0aGlzLmhlYWQgPSB0aGlzLmhlYWQubmV4dDtcbiAgICAtLXRoaXMubGVuZ3RoO1xuICAgIHJldHVybiByZXQ7XG4gIH07XG5cbiAgQnVmZmVyTGlzdC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICB0aGlzLmhlYWQgPSB0aGlzLnRhaWwgPSBudWxsO1xuICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgfTtcblxuICBCdWZmZXJMaXN0LnByb3RvdHlwZS5qb2luID0gZnVuY3Rpb24gam9pbihzKSB7XG4gICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gJyc7XG4gICAgdmFyIHAgPSB0aGlzLmhlYWQ7XG4gICAgdmFyIHJldCA9ICcnICsgcC5kYXRhO1xuICAgIHdoaWxlIChwID0gcC5uZXh0KSB7XG4gICAgICByZXQgKz0gcyArIHAuZGF0YTtcbiAgICB9cmV0dXJuIHJldDtcbiAgfTtcblxuICBCdWZmZXJMaXN0LnByb3RvdHlwZS5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQobikge1xuICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIEJ1ZmZlci5hbGxvYygwKTtcbiAgICBpZiAodGhpcy5sZW5ndGggPT09IDEpIHJldHVybiB0aGlzLmhlYWQuZGF0YTtcbiAgICB2YXIgcmV0ID0gQnVmZmVyLmFsbG9jVW5zYWZlKG4gPj4+IDApO1xuICAgIHZhciBwID0gdGhpcy5oZWFkO1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAocCkge1xuICAgICAgY29weUJ1ZmZlcihwLmRhdGEsIHJldCwgaSk7XG4gICAgICBpICs9IHAuZGF0YS5sZW5ndGg7XG4gICAgICBwID0gcC5uZXh0O1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9O1xuXG4gIHJldHVybiBCdWZmZXJMaXN0O1xufSgpOyIsIid1c2Ugc3RyaWN0JztcblxuLyo8cmVwbGFjZW1lbnQ+Ki9cblxudmFyIHByb2Nlc3NOZXh0VGljayA9IHJlcXVpcmUoJ3Byb2Nlc3MtbmV4dGljay1hcmdzJyk7XG4vKjwvcmVwbGFjZW1lbnQ+Ki9cblxuLy8gdW5kb2N1bWVudGVkIGNiKCkgQVBJLCBuZWVkZWQgZm9yIGNvcmUsIG5vdCBmb3IgcHVibGljIEFQSVxuZnVuY3Rpb24gZGVzdHJveShlcnIsIGNiKSB7XG4gIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgdmFyIHJlYWRhYmxlRGVzdHJveWVkID0gdGhpcy5fcmVhZGFibGVTdGF0ZSAmJiB0aGlzLl9yZWFkYWJsZVN0YXRlLmRlc3Ryb3llZDtcbiAgdmFyIHdyaXRhYmxlRGVzdHJveWVkID0gdGhpcy5fd3JpdGFibGVTdGF0ZSAmJiB0aGlzLl93cml0YWJsZVN0YXRlLmRlc3Ryb3llZDtcblxuICBpZiAocmVhZGFibGVEZXN0cm95ZWQgfHwgd3JpdGFibGVEZXN0cm95ZWQpIHtcbiAgICBpZiAoY2IpIHtcbiAgICAgIGNiKGVycik7XG4gICAgfSBlbHNlIGlmIChlcnIgJiYgKCF0aGlzLl93cml0YWJsZVN0YXRlIHx8ICF0aGlzLl93cml0YWJsZVN0YXRlLmVycm9yRW1pdHRlZCkpIHtcbiAgICAgIHByb2Nlc3NOZXh0VGljayhlbWl0RXJyb3JOVCwgdGhpcywgZXJyKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gd2Ugc2V0IGRlc3Ryb3llZCB0byB0cnVlIGJlZm9yZSBmaXJpbmcgZXJyb3IgY2FsbGJhY2tzIGluIG9yZGVyXG4gIC8vIHRvIG1ha2UgaXQgcmUtZW50cmFuY2Ugc2FmZSBpbiBjYXNlIGRlc3Ryb3koKSBpcyBjYWxsZWQgd2l0aGluIGNhbGxiYWNrc1xuXG4gIGlmICh0aGlzLl9yZWFkYWJsZVN0YXRlKSB7XG4gICAgdGhpcy5fcmVhZGFibGVTdGF0ZS5kZXN0cm95ZWQgPSB0cnVlO1xuICB9XG5cbiAgLy8gaWYgdGhpcyBpcyBhIGR1cGxleCBzdHJlYW0gbWFyayB0aGUgd3JpdGFibGUgcGFydCBhcyBkZXN0cm95ZWQgYXMgd2VsbFxuICBpZiAodGhpcy5fd3JpdGFibGVTdGF0ZSkge1xuICAgIHRoaXMuX3dyaXRhYmxlU3RhdGUuZGVzdHJveWVkID0gdHJ1ZTtcbiAgfVxuXG4gIHRoaXMuX2Rlc3Ryb3koZXJyIHx8IG51bGwsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoIWNiICYmIGVycikge1xuICAgICAgcHJvY2Vzc05leHRUaWNrKGVtaXRFcnJvck5ULCBfdGhpcywgZXJyKTtcbiAgICAgIGlmIChfdGhpcy5fd3JpdGFibGVTdGF0ZSkge1xuICAgICAgICBfdGhpcy5fd3JpdGFibGVTdGF0ZS5lcnJvckVtaXR0ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY2IpIHtcbiAgICAgIGNiKGVycik7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gdW5kZXN0cm95KCkge1xuICBpZiAodGhpcy5fcmVhZGFibGVTdGF0ZSkge1xuICAgIHRoaXMuX3JlYWRhYmxlU3RhdGUuZGVzdHJveWVkID0gZmFsc2U7XG4gICAgdGhpcy5fcmVhZGFibGVTdGF0ZS5yZWFkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5fcmVhZGFibGVTdGF0ZS5lbmRlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3JlYWRhYmxlU3RhdGUuZW5kRW1pdHRlZCA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKHRoaXMuX3dyaXRhYmxlU3RhdGUpIHtcbiAgICB0aGlzLl93cml0YWJsZVN0YXRlLmRlc3Ryb3llZCA9IGZhbHNlO1xuICAgIHRoaXMuX3dyaXRhYmxlU3RhdGUuZW5kZWQgPSBmYWxzZTtcbiAgICB0aGlzLl93cml0YWJsZVN0YXRlLmVuZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuX3dyaXRhYmxlU3RhdGUuZmluaXNoZWQgPSBmYWxzZTtcbiAgICB0aGlzLl93cml0YWJsZVN0YXRlLmVycm9yRW1pdHRlZCA9IGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGVtaXRFcnJvck5UKHNlbGYsIGVycikge1xuICBzZWxmLmVtaXQoJ2Vycm9yJywgZXJyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRlc3Ryb3k6IGRlc3Ryb3ksXG4gIHVuZGVzdHJveTogdW5kZXN0cm95XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXI7XG5cbnZhciBpc0VuY29kaW5nID0gQnVmZmVyLmlzRW5jb2RpbmcgfHwgZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIGVuY29kaW5nID0gJycgKyBlbmNvZGluZztcbiAgc3dpdGNoIChlbmNvZGluZyAmJiBlbmNvZGluZy50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpjYXNlICd1dGY4JzpjYXNlICd1dGYtOCc6Y2FzZSAnYXNjaWknOmNhc2UgJ2JpbmFyeSc6Y2FzZSAnYmFzZTY0JzpjYXNlICd1Y3MyJzpjYXNlICd1Y3MtMic6Y2FzZSAndXRmMTZsZSc6Y2FzZSAndXRmLTE2bGUnOmNhc2UgJ3Jhdyc6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfbm9ybWFsaXplRW5jb2RpbmcoZW5jKSB7XG4gIGlmICghZW5jKSByZXR1cm4gJ3V0ZjgnO1xuICB2YXIgcmV0cmllZDtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuYykge1xuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiAndXRmOCc7XG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gJ3V0ZjE2bGUnO1xuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiAnbGF0aW4xJztcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gZW5jO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKHJldHJpZWQpIHJldHVybjsgLy8gdW5kZWZpbmVkXG4gICAgICAgIGVuYyA9ICgnJyArIGVuYykudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgcmV0cmllZCA9IHRydWU7XG4gICAgfVxuICB9XG59O1xuXG4vLyBEbyBub3QgY2FjaGUgYEJ1ZmZlci5pc0VuY29kaW5nYCB3aGVuIGNoZWNraW5nIGVuY29kaW5nIG5hbWVzIGFzIHNvbWVcbi8vIG1vZHVsZXMgbW9ua2V5LXBhdGNoIGl0IHRvIHN1cHBvcnQgYWRkaXRpb25hbCBlbmNvZGluZ3NcbmZ1bmN0aW9uIG5vcm1hbGl6ZUVuY29kaW5nKGVuYykge1xuICB2YXIgbmVuYyA9IF9ub3JtYWxpemVFbmNvZGluZyhlbmMpO1xuICBpZiAodHlwZW9mIG5lbmMgIT09ICdzdHJpbmcnICYmIChCdWZmZXIuaXNFbmNvZGluZyA9PT0gaXNFbmNvZGluZyB8fCAhaXNFbmNvZGluZyhlbmMpKSkgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jKTtcbiAgcmV0dXJuIG5lbmMgfHwgZW5jO1xufVxuXG4vLyBTdHJpbmdEZWNvZGVyIHByb3ZpZGVzIGFuIGludGVyZmFjZSBmb3IgZWZmaWNpZW50bHkgc3BsaXR0aW5nIGEgc2VyaWVzIG9mXG4vLyBidWZmZXJzIGludG8gYSBzZXJpZXMgb2YgSlMgc3RyaW5ncyB3aXRob3V0IGJyZWFraW5nIGFwYXJ0IG11bHRpLWJ5dGVcbi8vIGNoYXJhY3RlcnMuXG5leHBvcnRzLlN0cmluZ0RlY29kZXIgPSBTdHJpbmdEZWNvZGVyO1xuZnVuY3Rpb24gU3RyaW5nRGVjb2RlcihlbmNvZGluZykge1xuICB0aGlzLmVuY29kaW5nID0gbm9ybWFsaXplRW5jb2RpbmcoZW5jb2RpbmcpO1xuICB2YXIgbmI7XG4gIHN3aXRjaCAodGhpcy5lbmNvZGluZykge1xuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgdGhpcy50ZXh0ID0gdXRmMTZUZXh0O1xuICAgICAgdGhpcy5lbmQgPSB1dGYxNkVuZDtcbiAgICAgIG5iID0gNDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgdGhpcy5maWxsTGFzdCA9IHV0ZjhGaWxsTGFzdDtcbiAgICAgIG5iID0gNDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICB0aGlzLnRleHQgPSBiYXNlNjRUZXh0O1xuICAgICAgdGhpcy5lbmQgPSBiYXNlNjRFbmQ7XG4gICAgICBuYiA9IDM7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhpcy53cml0ZSA9IHNpbXBsZVdyaXRlO1xuICAgICAgdGhpcy5lbmQgPSBzaW1wbGVFbmQ7XG4gICAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5sYXN0TmVlZCA9IDA7XG4gIHRoaXMubGFzdFRvdGFsID0gMDtcbiAgdGhpcy5sYXN0Q2hhciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShuYik7XG59XG5cblN0cmluZ0RlY29kZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKGJ1Zikge1xuICBpZiAoYnVmLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcnO1xuICB2YXIgcjtcbiAgdmFyIGk7XG4gIGlmICh0aGlzLmxhc3ROZWVkKSB7XG4gICAgciA9IHRoaXMuZmlsbExhc3QoYnVmKTtcbiAgICBpZiAociA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJyc7XG4gICAgaSA9IHRoaXMubGFzdE5lZWQ7XG4gICAgdGhpcy5sYXN0TmVlZCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgaSA9IDA7XG4gIH1cbiAgaWYgKGkgPCBidWYubGVuZ3RoKSByZXR1cm4gciA/IHIgKyB0aGlzLnRleHQoYnVmLCBpKSA6IHRoaXMudGV4dChidWYsIGkpO1xuICByZXR1cm4gciB8fCAnJztcbn07XG5cblN0cmluZ0RlY29kZXIucHJvdG90eXBlLmVuZCA9IHV0ZjhFbmQ7XG5cbi8vIFJldHVybnMgb25seSBjb21wbGV0ZSBjaGFyYWN0ZXJzIGluIGEgQnVmZmVyXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS50ZXh0ID0gdXRmOFRleHQ7XG5cbi8vIEF0dGVtcHRzIHRvIGNvbXBsZXRlIGEgcGFydGlhbCBub24tVVRGLTggY2hhcmFjdGVyIHVzaW5nIGJ5dGVzIGZyb20gYSBCdWZmZXJcblN0cmluZ0RlY29kZXIucHJvdG90eXBlLmZpbGxMYXN0ID0gZnVuY3Rpb24gKGJ1Zikge1xuICBpZiAodGhpcy5sYXN0TmVlZCA8PSBidWYubGVuZ3RoKSB7XG4gICAgYnVmLmNvcHkodGhpcy5sYXN0Q2hhciwgdGhpcy5sYXN0VG90YWwgLSB0aGlzLmxhc3ROZWVkLCAwLCB0aGlzLmxhc3ROZWVkKTtcbiAgICByZXR1cm4gdGhpcy5sYXN0Q2hhci50b1N0cmluZyh0aGlzLmVuY29kaW5nLCAwLCB0aGlzLmxhc3RUb3RhbCk7XG4gIH1cbiAgYnVmLmNvcHkodGhpcy5sYXN0Q2hhciwgdGhpcy5sYXN0VG90YWwgLSB0aGlzLmxhc3ROZWVkLCAwLCBidWYubGVuZ3RoKTtcbiAgdGhpcy5sYXN0TmVlZCAtPSBidWYubGVuZ3RoO1xufTtcblxuLy8gQ2hlY2tzIHRoZSB0eXBlIG9mIGEgVVRGLTggYnl0ZSwgd2hldGhlciBpdCdzIEFTQ0lJLCBhIGxlYWRpbmcgYnl0ZSwgb3IgYVxuLy8gY29udGludWF0aW9uIGJ5dGUuXG5mdW5jdGlvbiB1dGY4Q2hlY2tCeXRlKGJ5dGUpIHtcbiAgaWYgKGJ5dGUgPD0gMHg3RikgcmV0dXJuIDA7ZWxzZSBpZiAoYnl0ZSA+PiA1ID09PSAweDA2KSByZXR1cm4gMjtlbHNlIGlmIChieXRlID4+IDQgPT09IDB4MEUpIHJldHVybiAzO2Vsc2UgaWYgKGJ5dGUgPj4gMyA9PT0gMHgxRSkgcmV0dXJuIDQ7XG4gIHJldHVybiAtMTtcbn1cblxuLy8gQ2hlY2tzIGF0IG1vc3QgMyBieXRlcyBhdCB0aGUgZW5kIG9mIGEgQnVmZmVyIGluIG9yZGVyIHRvIGRldGVjdCBhblxuLy8gaW5jb21wbGV0ZSBtdWx0aS1ieXRlIFVURi04IGNoYXJhY3Rlci4gVGhlIHRvdGFsIG51bWJlciBvZiBieXRlcyAoMiwgMywgb3IgNClcbi8vIG5lZWRlZCB0byBjb21wbGV0ZSB0aGUgVVRGLTggY2hhcmFjdGVyIChpZiBhcHBsaWNhYmxlKSBhcmUgcmV0dXJuZWQuXG5mdW5jdGlvbiB1dGY4Q2hlY2tJbmNvbXBsZXRlKHNlbGYsIGJ1ZiwgaSkge1xuICB2YXIgaiA9IGJ1Zi5sZW5ndGggLSAxO1xuICBpZiAoaiA8IGkpIHJldHVybiAwO1xuICB2YXIgbmIgPSB1dGY4Q2hlY2tCeXRlKGJ1ZltqXSk7XG4gIGlmIChuYiA+PSAwKSB7XG4gICAgaWYgKG5iID4gMCkgc2VsZi5sYXN0TmVlZCA9IG5iIC0gMTtcbiAgICByZXR1cm4gbmI7XG4gIH1cbiAgaWYgKC0taiA8IGkpIHJldHVybiAwO1xuICBuYiA9IHV0ZjhDaGVja0J5dGUoYnVmW2pdKTtcbiAgaWYgKG5iID49IDApIHtcbiAgICBpZiAobmIgPiAwKSBzZWxmLmxhc3ROZWVkID0gbmIgLSAyO1xuICAgIHJldHVybiBuYjtcbiAgfVxuICBpZiAoLS1qIDwgaSkgcmV0dXJuIDA7XG4gIG5iID0gdXRmOENoZWNrQnl0ZShidWZbal0pO1xuICBpZiAobmIgPj0gMCkge1xuICAgIGlmIChuYiA+IDApIHtcbiAgICAgIGlmIChuYiA9PT0gMikgbmIgPSAwO2Vsc2Ugc2VsZi5sYXN0TmVlZCA9IG5iIC0gMztcbiAgICB9XG4gICAgcmV0dXJuIG5iO1xuICB9XG4gIHJldHVybiAwO1xufVxuXG4vLyBWYWxpZGF0ZXMgYXMgbWFueSBjb250aW51YXRpb24gYnl0ZXMgZm9yIGEgbXVsdGktYnl0ZSBVVEYtOCBjaGFyYWN0ZXIgYXNcbi8vIG5lZWRlZCBvciBhcmUgYXZhaWxhYmxlLiBJZiB3ZSBzZWUgYSBub24tY29udGludWF0aW9uIGJ5dGUgd2hlcmUgd2UgZXhwZWN0XG4vLyBvbmUsIHdlIFwicmVwbGFjZVwiIHRoZSB2YWxpZGF0ZWQgY29udGludWF0aW9uIGJ5dGVzIHdlJ3ZlIHNlZW4gc28gZmFyIHdpdGhcbi8vIFVURi04IHJlcGxhY2VtZW50IGNoYXJhY3RlcnMgKCdcXHVmZmZkJyksIHRvIG1hdGNoIHY4J3MgVVRGLTggZGVjb2Rpbmdcbi8vIGJlaGF2aW9yLiBUaGUgY29udGludWF0aW9uIGJ5dGUgY2hlY2sgaXMgaW5jbHVkZWQgdGhyZWUgdGltZXMgaW4gdGhlIGNhc2Vcbi8vIHdoZXJlIGFsbCBvZiB0aGUgY29udGludWF0aW9uIGJ5dGVzIGZvciBhIGNoYXJhY3RlciBleGlzdCBpbiB0aGUgc2FtZSBidWZmZXIuXG4vLyBJdCBpcyBhbHNvIGRvbmUgdGhpcyB3YXkgYXMgYSBzbGlnaHQgcGVyZm9ybWFuY2UgaW5jcmVhc2UgaW5zdGVhZCBvZiB1c2luZyBhXG4vLyBsb29wLlxuZnVuY3Rpb24gdXRmOENoZWNrRXh0cmFCeXRlcyhzZWxmLCBidWYsIHApIHtcbiAgaWYgKChidWZbMF0gJiAweEMwKSAhPT0gMHg4MCkge1xuICAgIHNlbGYubGFzdE5lZWQgPSAwO1xuICAgIHJldHVybiAnXFx1ZmZmZCcucmVwZWF0KHApO1xuICB9XG4gIGlmIChzZWxmLmxhc3ROZWVkID4gMSAmJiBidWYubGVuZ3RoID4gMSkge1xuICAgIGlmICgoYnVmWzFdICYgMHhDMCkgIT09IDB4ODApIHtcbiAgICAgIHNlbGYubGFzdE5lZWQgPSAxO1xuICAgICAgcmV0dXJuICdcXHVmZmZkJy5yZXBlYXQocCArIDEpO1xuICAgIH1cbiAgICBpZiAoc2VsZi5sYXN0TmVlZCA+IDIgJiYgYnVmLmxlbmd0aCA+IDIpIHtcbiAgICAgIGlmICgoYnVmWzJdICYgMHhDMCkgIT09IDB4ODApIHtcbiAgICAgICAgc2VsZi5sYXN0TmVlZCA9IDI7XG4gICAgICAgIHJldHVybiAnXFx1ZmZmZCcucmVwZWF0KHAgKyAyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy8gQXR0ZW1wdHMgdG8gY29tcGxldGUgYSBtdWx0aS1ieXRlIFVURi04IGNoYXJhY3RlciB1c2luZyBieXRlcyBmcm9tIGEgQnVmZmVyLlxuZnVuY3Rpb24gdXRmOEZpbGxMYXN0KGJ1Zikge1xuICB2YXIgcCA9IHRoaXMubGFzdFRvdGFsIC0gdGhpcy5sYXN0TmVlZDtcbiAgdmFyIHIgPSB1dGY4Q2hlY2tFeHRyYUJ5dGVzKHRoaXMsIGJ1ZiwgcCk7XG4gIGlmIChyICE9PSB1bmRlZmluZWQpIHJldHVybiByO1xuICBpZiAodGhpcy5sYXN0TmVlZCA8PSBidWYubGVuZ3RoKSB7XG4gICAgYnVmLmNvcHkodGhpcy5sYXN0Q2hhciwgcCwgMCwgdGhpcy5sYXN0TmVlZCk7XG4gICAgcmV0dXJuIHRoaXMubGFzdENoYXIudG9TdHJpbmcodGhpcy5lbmNvZGluZywgMCwgdGhpcy5sYXN0VG90YWwpO1xuICB9XG4gIGJ1Zi5jb3B5KHRoaXMubGFzdENoYXIsIHAsIDAsIGJ1Zi5sZW5ndGgpO1xuICB0aGlzLmxhc3ROZWVkIC09IGJ1Zi5sZW5ndGg7XG59XG5cbi8vIFJldHVybnMgYWxsIGNvbXBsZXRlIFVURi04IGNoYXJhY3RlcnMgaW4gYSBCdWZmZXIuIElmIHRoZSBCdWZmZXIgZW5kZWQgb24gYVxuLy8gcGFydGlhbCBjaGFyYWN0ZXIsIHRoZSBjaGFyYWN0ZXIncyBieXRlcyBhcmUgYnVmZmVyZWQgdW50aWwgdGhlIHJlcXVpcmVkXG4vLyBudW1iZXIgb2YgYnl0ZXMgYXJlIGF2YWlsYWJsZS5cbmZ1bmN0aW9uIHV0ZjhUZXh0KGJ1ZiwgaSkge1xuICB2YXIgdG90YWwgPSB1dGY4Q2hlY2tJbmNvbXBsZXRlKHRoaXMsIGJ1ZiwgaSk7XG4gIGlmICghdGhpcy5sYXN0TmVlZCkgcmV0dXJuIGJ1Zi50b1N0cmluZygndXRmOCcsIGkpO1xuICB0aGlzLmxhc3RUb3RhbCA9IHRvdGFsO1xuICB2YXIgZW5kID0gYnVmLmxlbmd0aCAtICh0b3RhbCAtIHRoaXMubGFzdE5lZWQpO1xuICBidWYuY29weSh0aGlzLmxhc3RDaGFyLCAwLCBlbmQpO1xuICByZXR1cm4gYnVmLnRvU3RyaW5nKCd1dGY4JywgaSwgZW5kKTtcbn1cblxuLy8gRm9yIFVURi04LCBhIHJlcGxhY2VtZW50IGNoYXJhY3RlciBmb3IgZWFjaCBidWZmZXJlZCBieXRlIG9mIGEgKHBhcnRpYWwpXG4vLyBjaGFyYWN0ZXIgbmVlZHMgdG8gYmUgYWRkZWQgdG8gdGhlIG91dHB1dC5cbmZ1bmN0aW9uIHV0ZjhFbmQoYnVmKSB7XG4gIHZhciByID0gYnVmICYmIGJ1Zi5sZW5ndGggPyB0aGlzLndyaXRlKGJ1ZikgOiAnJztcbiAgaWYgKHRoaXMubGFzdE5lZWQpIHJldHVybiByICsgJ1xcdWZmZmQnLnJlcGVhdCh0aGlzLmxhc3RUb3RhbCAtIHRoaXMubGFzdE5lZWQpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gVVRGLTE2TEUgdHlwaWNhbGx5IG5lZWRzIHR3byBieXRlcyBwZXIgY2hhcmFjdGVyLCBidXQgZXZlbiBpZiB3ZSBoYXZlIGFuIGV2ZW5cbi8vIG51bWJlciBvZiBieXRlcyBhdmFpbGFibGUsIHdlIG5lZWQgdG8gY2hlY2sgaWYgd2UgZW5kIG9uIGEgbGVhZGluZy9oaWdoXG4vLyBzdXJyb2dhdGUuIEluIHRoYXQgY2FzZSwgd2UgbmVlZCB0byB3YWl0IGZvciB0aGUgbmV4dCB0d28gYnl0ZXMgaW4gb3JkZXIgdG9cbi8vIGRlY29kZSB0aGUgbGFzdCBjaGFyYWN0ZXIgcHJvcGVybHkuXG5mdW5jdGlvbiB1dGYxNlRleHQoYnVmLCBpKSB7XG4gIGlmICgoYnVmLmxlbmd0aCAtIGkpICUgMiA9PT0gMCkge1xuICAgIHZhciByID0gYnVmLnRvU3RyaW5nKCd1dGYxNmxlJywgaSk7XG4gICAgaWYgKHIpIHtcbiAgICAgIHZhciBjID0gci5jaGFyQ29kZUF0KHIubGVuZ3RoIC0gMSk7XG4gICAgICBpZiAoYyA+PSAweEQ4MDAgJiYgYyA8PSAweERCRkYpIHtcbiAgICAgICAgdGhpcy5sYXN0TmVlZCA9IDI7XG4gICAgICAgIHRoaXMubGFzdFRvdGFsID0gNDtcbiAgICAgICAgdGhpcy5sYXN0Q2hhclswXSA9IGJ1ZltidWYubGVuZ3RoIC0gMl07XG4gICAgICAgIHRoaXMubGFzdENoYXJbMV0gPSBidWZbYnVmLmxlbmd0aCAtIDFdO1xuICAgICAgICByZXR1cm4gci5zbGljZSgwLCAtMSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByO1xuICB9XG4gIHRoaXMubGFzdE5lZWQgPSAxO1xuICB0aGlzLmxhc3RUb3RhbCA9IDI7XG4gIHRoaXMubGFzdENoYXJbMF0gPSBidWZbYnVmLmxlbmd0aCAtIDFdO1xuICByZXR1cm4gYnVmLnRvU3RyaW5nKCd1dGYxNmxlJywgaSwgYnVmLmxlbmd0aCAtIDEpO1xufVxuXG4vLyBGb3IgVVRGLTE2TEUgd2UgZG8gbm90IGV4cGxpY2l0bHkgYXBwZW5kIHNwZWNpYWwgcmVwbGFjZW1lbnQgY2hhcmFjdGVycyBpZiB3ZVxuLy8gZW5kIG9uIGEgcGFydGlhbCBjaGFyYWN0ZXIsIHdlIHNpbXBseSBsZXQgdjggaGFuZGxlIHRoYXQuXG5mdW5jdGlvbiB1dGYxNkVuZChidWYpIHtcbiAgdmFyIHIgPSBidWYgJiYgYnVmLmxlbmd0aCA/IHRoaXMud3JpdGUoYnVmKSA6ICcnO1xuICBpZiAodGhpcy5sYXN0TmVlZCkge1xuICAgIHZhciBlbmQgPSB0aGlzLmxhc3RUb3RhbCAtIHRoaXMubGFzdE5lZWQ7XG4gICAgcmV0dXJuIHIgKyB0aGlzLmxhc3RDaGFyLnRvU3RyaW5nKCd1dGYxNmxlJywgMCwgZW5kKTtcbiAgfVxuICByZXR1cm4gcjtcbn1cblxuZnVuY3Rpb24gYmFzZTY0VGV4dChidWYsIGkpIHtcbiAgdmFyIG4gPSAoYnVmLmxlbmd0aCAtIGkpICUgMztcbiAgaWYgKG4gPT09IDApIHJldHVybiBidWYudG9TdHJpbmcoJ2Jhc2U2NCcsIGkpO1xuICB0aGlzLmxhc3ROZWVkID0gMyAtIG47XG4gIHRoaXMubGFzdFRvdGFsID0gMztcbiAgaWYgKG4gPT09IDEpIHtcbiAgICB0aGlzLmxhc3RDaGFyWzBdID0gYnVmW2J1Zi5sZW5ndGggLSAxXTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmxhc3RDaGFyWzBdID0gYnVmW2J1Zi5sZW5ndGggLSAyXTtcbiAgICB0aGlzLmxhc3RDaGFyWzFdID0gYnVmW2J1Zi5sZW5ndGggLSAxXTtcbiAgfVxuICByZXR1cm4gYnVmLnRvU3RyaW5nKCdiYXNlNjQnLCBpLCBidWYubGVuZ3RoIC0gbik7XG59XG5cbmZ1bmN0aW9uIGJhc2U2NEVuZChidWYpIHtcbiAgdmFyIHIgPSBidWYgJiYgYnVmLmxlbmd0aCA/IHRoaXMud3JpdGUoYnVmKSA6ICcnO1xuICBpZiAodGhpcy5sYXN0TmVlZCkgcmV0dXJuIHIgKyB0aGlzLmxhc3RDaGFyLnRvU3RyaW5nKCdiYXNlNjQnLCAwLCAzIC0gdGhpcy5sYXN0TmVlZCk7XG4gIHJldHVybiByO1xufVxuXG4vLyBQYXNzIGJ5dGVzIG9uIHRocm91Z2ggZm9yIHNpbmdsZS1ieXRlIGVuY29kaW5ncyAoZS5nLiBhc2NpaSwgbGF0aW4xLCBoZXgpXG5mdW5jdGlvbiBzaW1wbGVXcml0ZShidWYpIHtcbiAgcmV0dXJuIGJ1Zi50b1N0cmluZyh0aGlzLmVuY29kaW5nKTtcbn1cblxuZnVuY3Rpb24gc2ltcGxlRW5kKGJ1Zikge1xuICByZXR1cm4gYnVmICYmIGJ1Zi5sZW5ndGggPyB0aGlzLndyaXRlKGJ1ZikgOiAnJztcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vcmVhZGFibGUnKS5QYXNzVGhyb3VnaFxuIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvX3N0cmVhbV9yZWFkYWJsZS5qcycpO1xuZXhwb3J0cy5TdHJlYW0gPSBleHBvcnRzO1xuZXhwb3J0cy5SZWFkYWJsZSA9IGV4cG9ydHM7XG5leHBvcnRzLldyaXRhYmxlID0gcmVxdWlyZSgnLi9saWIvX3N0cmVhbV93cml0YWJsZS5qcycpO1xuZXhwb3J0cy5EdXBsZXggPSByZXF1aXJlKCcuL2xpYi9fc3RyZWFtX2R1cGxleC5qcycpO1xuZXhwb3J0cy5UcmFuc2Zvcm0gPSByZXF1aXJlKCcuL2xpYi9fc3RyZWFtX3RyYW5zZm9ybS5qcycpO1xuZXhwb3J0cy5QYXNzVGhyb3VnaCA9IHJlcXVpcmUoJy4vbGliL19zdHJlYW1fcGFzc3Rocm91Z2guanMnKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9yZWFkYWJsZScpLlRyYW5zZm9ybVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9fc3RyZWFtX3dyaXRhYmxlLmpzJyk7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBub2RlL25vLWRlcHJlY2F0ZWQtYXBpICovXG52YXIgYnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJylcbnZhciBCdWZmZXIgPSBidWZmZXIuQnVmZmVyXG5cbi8vIGFsdGVybmF0aXZlIHRvIHVzaW5nIE9iamVjdC5rZXlzIGZvciBvbGQgYnJvd3NlcnNcbmZ1bmN0aW9uIGNvcHlQcm9wcyAoc3JjLCBkc3QpIHtcbiAgZm9yICh2YXIga2V5IGluIHNyYykge1xuICAgIGRzdFtrZXldID0gc3JjW2tleV1cbiAgfVxufVxuaWYgKEJ1ZmZlci5mcm9tICYmIEJ1ZmZlci5hbGxvYyAmJiBCdWZmZXIuYWxsb2NVbnNhZmUgJiYgQnVmZmVyLmFsbG9jVW5zYWZlU2xvdykge1xuICBtb2R1bGUuZXhwb3J0cyA9IGJ1ZmZlclxufSBlbHNlIHtcbiAgLy8gQ29weSBwcm9wZXJ0aWVzIGZyb20gcmVxdWlyZSgnYnVmZmVyJylcbiAgY29weVByb3BzKGJ1ZmZlciwgZXhwb3J0cylcbiAgZXhwb3J0cy5CdWZmZXIgPSBTYWZlQnVmZmVyXG59XG5cbmZ1bmN0aW9uIFNhZmVCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBCdWZmZXIoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbi8vIENvcHkgc3RhdGljIG1ldGhvZHMgZnJvbSBCdWZmZXJcbmNvcHlQcm9wcyhCdWZmZXIsIFNhZmVCdWZmZXIpXG5cblNhZmVCdWZmZXIuZnJvbSA9IGZ1bmN0aW9uIChhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IG5vdCBiZSBhIG51bWJlcicpXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlcihhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuU2FmZUJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIG51bWJlcicpXG4gIH1cbiAgdmFyIGJ1ZiA9IEJ1ZmZlcihzaXplKVxuICBpZiAoZmlsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGJ1Zi5maWxsKGZpbGwsIGVuY29kaW5nKVxuICAgIH0gZWxzZSB7XG4gICAgICBidWYuZmlsbChmaWxsKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBidWYuZmlsbCgwKVxuICB9XG4gIHJldHVybiBidWZcbn1cblxuU2FmZUJ1ZmZlci5hbGxvY1Vuc2FmZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyJylcbiAgfVxuICByZXR1cm4gQnVmZmVyKHNpemUpXG59XG5cblNhZmVCdWZmZXIuYWxsb2NVbnNhZmVTbG93ID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9XG4gIHJldHVybiBidWZmZXIuU2xvd0J1ZmZlcihzaXplKVxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbm1vZHVsZS5leHBvcnRzID0gU3RyZWFtO1xuXG52YXIgRUUgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5pbmhlcml0cyhTdHJlYW0sIEVFKTtcblN0cmVhbS5SZWFkYWJsZSA9IHJlcXVpcmUoJ3JlYWRhYmxlLXN0cmVhbS9yZWFkYWJsZS5qcycpO1xuU3RyZWFtLldyaXRhYmxlID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL3dyaXRhYmxlLmpzJyk7XG5TdHJlYW0uRHVwbGV4ID0gcmVxdWlyZSgncmVhZGFibGUtc3RyZWFtL2R1cGxleC5qcycpO1xuU3RyZWFtLlRyYW5zZm9ybSA9IHJlcXVpcmUoJ3JlYWRhYmxlLXN0cmVhbS90cmFuc2Zvcm0uanMnKTtcblN0cmVhbS5QYXNzVGhyb3VnaCA9IHJlcXVpcmUoJ3JlYWRhYmxlLXN0cmVhbS9wYXNzdGhyb3VnaC5qcycpO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjQueFxuU3RyZWFtLlN0cmVhbSA9IFN0cmVhbTtcblxuXG5cbi8vIG9sZC1zdHlsZSBzdHJlYW1zLiAgTm90ZSB0aGF0IHRoZSBwaXBlIG1ldGhvZCAodGhlIG9ubHkgcmVsZXZhbnRcbi8vIHBhcnQgb2YgdGhpcyBjbGFzcykgaXMgb3ZlcnJpZGRlbiBpbiB0aGUgUmVhZGFibGUgY2xhc3MuXG5cbmZ1bmN0aW9uIFN0cmVhbSgpIHtcbiAgRUUuY2FsbCh0aGlzKTtcbn1cblxuU3RyZWFtLnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24oZGVzdCwgb3B0aW9ucykge1xuICB2YXIgc291cmNlID0gdGhpcztcblxuICBmdW5jdGlvbiBvbmRhdGEoY2h1bmspIHtcbiAgICBpZiAoZGVzdC53cml0YWJsZSkge1xuICAgICAgaWYgKGZhbHNlID09PSBkZXN0LndyaXRlKGNodW5rKSAmJiBzb3VyY2UucGF1c2UpIHtcbiAgICAgICAgc291cmNlLnBhdXNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc291cmNlLm9uKCdkYXRhJywgb25kYXRhKTtcblxuICBmdW5jdGlvbiBvbmRyYWluKCkge1xuICAgIGlmIChzb3VyY2UucmVhZGFibGUgJiYgc291cmNlLnJlc3VtZSkge1xuICAgICAgc291cmNlLnJlc3VtZSgpO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Qub24oJ2RyYWluJywgb25kcmFpbik7XG5cbiAgLy8gSWYgdGhlICdlbmQnIG9wdGlvbiBpcyBub3Qgc3VwcGxpZWQsIGRlc3QuZW5kKCkgd2lsbCBiZSBjYWxsZWQgd2hlblxuICAvLyBzb3VyY2UgZ2V0cyB0aGUgJ2VuZCcgb3IgJ2Nsb3NlJyBldmVudHMuICBPbmx5IGRlc3QuZW5kKCkgb25jZS5cbiAgaWYgKCFkZXN0Ll9pc1N0ZGlvICYmICghb3B0aW9ucyB8fCBvcHRpb25zLmVuZCAhPT0gZmFsc2UpKSB7XG4gICAgc291cmNlLm9uKCdlbmQnLCBvbmVuZCk7XG4gICAgc291cmNlLm9uKCdjbG9zZScsIG9uY2xvc2UpO1xuICB9XG5cbiAgdmFyIGRpZE9uRW5kID0gZmFsc2U7XG4gIGZ1bmN0aW9uIG9uZW5kKCkge1xuICAgIGlmIChkaWRPbkVuZCkgcmV0dXJuO1xuICAgIGRpZE9uRW5kID0gdHJ1ZTtcblxuICAgIGRlc3QuZW5kKCk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIG9uY2xvc2UoKSB7XG4gICAgaWYgKGRpZE9uRW5kKSByZXR1cm47XG4gICAgZGlkT25FbmQgPSB0cnVlO1xuXG4gICAgaWYgKHR5cGVvZiBkZXN0LmRlc3Ryb3kgPT09ICdmdW5jdGlvbicpIGRlc3QuZGVzdHJveSgpO1xuICB9XG5cbiAgLy8gZG9uJ3QgbGVhdmUgZGFuZ2xpbmcgcGlwZXMgd2hlbiB0aGVyZSBhcmUgZXJyb3JzLlxuICBmdW5jdGlvbiBvbmVycm9yKGVyKSB7XG4gICAgY2xlYW51cCgpO1xuICAgIGlmIChFRS5saXN0ZW5lckNvdW50KHRoaXMsICdlcnJvcicpID09PSAwKSB7XG4gICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkIHN0cmVhbSBlcnJvciBpbiBwaXBlLlxuICAgIH1cbiAgfVxuXG4gIHNvdXJjZS5vbignZXJyb3InLCBvbmVycm9yKTtcbiAgZGVzdC5vbignZXJyb3InLCBvbmVycm9yKTtcblxuICAvLyByZW1vdmUgYWxsIHRoZSBldmVudCBsaXN0ZW5lcnMgdGhhdCB3ZXJlIGFkZGVkLlxuICBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignZGF0YScsIG9uZGF0YSk7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignZHJhaW4nLCBvbmRyYWluKTtcblxuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignZW5kJywgb25lbmQpO1xuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBvbmNsb3NlKTtcblxuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBvbmVycm9yKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uZXJyb3IpO1xuXG4gICAgc291cmNlLnJlbW92ZUxpc3RlbmVyKCdlbmQnLCBjbGVhbnVwKTtcbiAgICBzb3VyY2UucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgY2xlYW51cCk7XG5cbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIGNsZWFudXApO1xuICB9XG5cbiAgc291cmNlLm9uKCdlbmQnLCBjbGVhbnVwKTtcbiAgc291cmNlLm9uKCdjbG9zZScsIGNsZWFudXApO1xuXG4gIGRlc3Qub24oJ2Nsb3NlJywgY2xlYW51cCk7XG5cbiAgZGVzdC5lbWl0KCdwaXBlJywgc291cmNlKTtcblxuICAvLyBBbGxvdyBmb3IgdW5peC1saWtlIHVzYWdlOiBBLnBpcGUoQikucGlwZShDKVxuICByZXR1cm4gZGVzdDtcbn07XG4iLCJcbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBkZXByZWNhdGU7XG5cbi8qKlxuICogTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbiAqIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4gKlxuICogSWYgYGxvY2FsU3RvcmFnZS5ub0RlcHJlY2F0aW9uID0gdHJ1ZWAgaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG4gKlxuICogSWYgYGxvY2FsU3RvcmFnZS50aHJvd0RlcHJlY2F0aW9uID0gdHJ1ZWAgaXMgc2V0LCB0aGVuIGRlcHJlY2F0ZWQgZnVuY3Rpb25zXG4gKiB3aWxsIHRocm93IGFuIEVycm9yIHdoZW4gaW52b2tlZC5cbiAqXG4gKiBJZiBgbG9jYWxTdG9yYWdlLnRyYWNlRGVwcmVjYXRpb24gPSB0cnVlYCBpcyBzZXQsIHRoZW4gZGVwcmVjYXRlZCBmdW5jdGlvbnNcbiAqIHdpbGwgaW52b2tlIGBjb25zb2xlLnRyYWNlKClgIGluc3RlYWQgb2YgYGNvbnNvbGUuZXJyb3IoKWAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gLSB0aGUgZnVuY3Rpb24gdG8gZGVwcmVjYXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gbXNnIC0gdGhlIHN0cmluZyB0byBwcmludCB0byB0aGUgY29uc29sZSB3aGVuIGBmbmAgaXMgaW52b2tlZFxuICogQHJldHVybnMge0Z1bmN0aW9ufSBhIG5ldyBcImRlcHJlY2F0ZWRcIiB2ZXJzaW9uIG9mIGBmbmBcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZGVwcmVjYXRlIChmbiwgbXNnKSB7XG4gIGlmIChjb25maWcoJ25vRGVwcmVjYXRpb24nKSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKGNvbmZpZygndGhyb3dEZXByZWNhdGlvbicpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChjb25maWcoJ3RyYWNlRGVwcmVjYXRpb24nKSkge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4obXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGBsb2NhbFN0b3JhZ2VgIGZvciBib29sZWFuIHZhbHVlcyBmb3IgdGhlIGdpdmVuIGBuYW1lYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBjb25maWcgKG5hbWUpIHtcbiAgLy8gYWNjZXNzaW5nIGdsb2JhbC5sb2NhbFN0b3JhZ2UgY2FuIHRyaWdnZXIgYSBET01FeGNlcHRpb24gaW4gc2FuZGJveGVkIGlmcmFtZXNcbiAgdHJ5IHtcbiAgICBpZiAoIWdsb2JhbC5sb2NhbFN0b3JhZ2UpIHJldHVybiBmYWxzZTtcbiAgfSBjYXRjaCAoXykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdmFsID0gZ2xvYmFsLmxvY2FsU3RvcmFnZVtuYW1lXTtcbiAgaWYgKG51bGwgPT0gdmFsKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBTdHJpbmcodmFsKS50b0xvd2VyQ2FzZSgpID09PSAndHJ1ZSc7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5yZWFkVUludDggPT09ICdmdW5jdGlvbic7XG59IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ25vZGUtZXZlbnQtZW1pdHRlcicpXG5jb25zdCBEaXlhU2VsZWN0b3IgPSByZXF1aXJlKCcuL0RpeWFTZWxlY3Rvci5qcycpLkRpeWFTZWxlY3RvclxuXG5cbmNvbnN0IFBST1BFUlRJRVNfQ0hBTkdFRF9TSUdOQUwgPSAnb3JnLmZyZWVkZXNrdG9wLkRCdXMuUHJvcGVydGllcy5Qcm9wZXJ0aWVzQ2hhbmdlZCcgXG5cblxuRGl5YVNlbGVjdG9yLnByb3RvdHlwZS5kYnVzT2JqZWN0ID0gZnVuY3Rpb24gKHNlcnZpY2UsIHBhdGgsIHBhcnRpYWxPYmplY3QpIHtcblx0bGV0IG9iamVjdHMgPSBbXVxuXG5cdHRoaXMuZWFjaChwZWVySWQgPT4ge1xuXHRcdGxldCBzdG9yZSA9IHRoaXMuX2Nvbm5lY3Rpb24uc3RvcmUuZ2V0KHBlZXJJZClcblx0XHRpZiAoc3RvcmUuZ2V0KCdkYnVzJykgPT0gbnVsbCkge1xuXHRcdFx0c3RvcmUuc2V0KCdkYnVzJywgbmV3IE1hcCgpKVxuXHRcdH1cblx0XHRsZXQgZGJ1cyA9IHN0b3JlLmdldCgnZGJ1cycpXG5cdFx0XG5cdFx0aWYgKGRidXMuZ2V0KHNlcnZpY2UpID09IG51bGwpIHtcblx0XHRcdGRidXMuc2V0KHNlcnZpY2UsIG5ldyBNYXAoKSlcblx0XHR9XG5cdFx0bGV0IGRidXNTZXJ2aWNlID0gZGJ1cy5nZXQoc2VydmljZSlcblxuXHRcdGxldCBvYmplY3QgPSBkYnVzU2VydmljZS5nZXQocGF0aClcblx0XHRpZiAob2JqZWN0ID09IG51bGwpIHtcblx0XHRcdG9iamVjdCA9IG5ldyBEQnVzT2JqZWN0SGFuZGxlcih0aGlzLl9jb25uZWN0aW9uLl9kMWluc3QsIHBlZXJJZCwgc2VydmljZSwgcGF0aClcblx0XHRcdGRidXNTZXJ2aWNlLnNldChwYXRoLCBvYmplY3QpXG5cdFx0XHQvL2RlbGV0ZSBkYnVzIG9iamVjdCB3aGVuIG5vIG9uZSB1c2VzIGl0IGFueW1vcmVcblx0XHRcdG9iamVjdC5vbmNlKCdyZWxlYXNlJywgKCkgPT4gZGJ1c1NlcnZpY2UuZGVsZXRlKHBhdGgpKVxuXHRcdH1cblxuXHRcdG9iamVjdC5pbXBvcnRQYXJ0aWFsT2JqZWN0KHBhcnRpYWxPYmplY3QpXG5cblx0XHRvYmplY3RzLnB1c2gob2JqZWN0KVxuXHR9KVxuXG5cdHJldHVybiBvYmplY3RzXG59XG5cbmNsYXNzIERCdXNPYmplY3RIYW5kbGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuXHRjb25zdHJ1Y3RvciAoZDFpbnN0LCBwZWVySWQsIHNlcnZpY2UsIHBhdGgpIHtcblx0XHRzdXBlcigpXG5cblx0XHR0aGlzLm9ialBhdGggPSBwYXRoXG5cdFx0dGhpcy5zZXJ2aWNlID0gc2VydmljZVxuXHRcdHRoaXMuX2QxaW5zdCA9IGQxaW5zdFxuXHRcdHRoaXMuX3BlZXJJZCA9IHBlZXJJZFxuXG5cdFx0dGhpcy5fcHJvcGVydGllc0NoYW5nZWRDYWxsYmFjayA9IG51bGxcblx0XHR0aGlzLl9wcm9wZXJ0aWVzQ2hhbmdlZFdhdGNoZXJzID0gbmV3IFNldCgpXG5cblx0XHR0aGlzLl9zaWduYWxIYW5kbGVycyA9IG5ldyBNYXAoKVxuXG5cdFx0dGhpcy5fZ2V0QWxsRG9uZSA9IHt9XG5cdH1cblxuXHRpbXBvcnRQYXJ0aWFsT2JqZWN0IChwYXJ0aWFsT2JqZWN0KSB7XG5cdFx0aWYgKHBhcnRpYWxPYmplY3QgPT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIFxuXHRcdH1cblxuXHRcdGZvciAobGV0IGlmYWNlIGluIHBhcnRpYWxPYmplY3QpIHtcblx0XHRcdHRoaXMuX29uUHJvcGVydGllc0NoYW5nZWQgKFtpZmFjZSwgcGFydGlhbE9iamVjdFtpZmFjZV0sIFtdXSlcblx0XHR9XG5cdH1cblxuXHRvblNpZ25hbCAoc2lnbmFsLCBjYWxsYmFjaykge1xuXHRcdGxldCBzaWduYWxIYW5kbGVyID0gdGhpcy5fc2lnbmFsSGFuZGxlcnMuZ2V0KHNpZ25hbClcblxuXHRcdC8vaWYgbm8gc2lnbmFsSGFuZGxlciBpcyByZWdpc3RlcmVkIGZvciB0aGlzIHNpZ25hbCxcblx0XHQvL3JlZ2lzdGVyIG9uZSwgYW5kIGRvIHRoZSBhY3R1YWwgc3Vic2NyaXB0aW9uIHRvIHJlbW90ZVxuXHRcdC8vc2VydmVyXG5cdFx0aWYgKHNpZ25hbEhhbmRsZXIgPT0gbnVsbCkge1xuXHRcdFx0bGV0IFtpZmFjZSwgbWVtYmVyXSA9IHRoaXMuX2V4dHJhY3RJZmFjZSAoc2lnbmFsKVxuXG5cdFx0XHRzaWduYWxIYW5kbGVyID0gdGhpcy5fZDFpbnN0KHRoaXMuX3BlZXJJZCkuc3Vic2NyaWJlKHtcblx0XHRcdFx0c2VydmljZTogdGhpcy5zZXJ2aWNlLFxuXHRcdFx0XHRmdW5jOiBtZW1iZXIsXG5cdFx0XHRcdG9iajoge1xuXHRcdFx0XHRcdGludGVyZmFjZTogaWZhY2UsXG5cdFx0XHRcdFx0cGF0aDogdGhpcy5vYmpQYXRoXG5cdFx0XHRcdH1cblx0XHRcdH0sIChwZWVySWQsIGVyciwgZGF0YSkgPT4ge1xuXHRcdFx0XHQvL25vdGlmeSBjbGllbnRzIHdoZW4gYSBzaWduYWwgaXMgcmVjZWl2ZWRcblx0XHRcdFx0dGhpcy5lbWl0KHNpZ25hbCwgZXJyICE9IG51bGwgPyBlcnIgOiBkYXRhKVxuXHRcdFx0fSlcblxuXHRcdFx0dGhpcy5fc2lnbmFsSGFuZGxlcnMuc2V0KHNpZ25hbCwgc2lnbmFsSGFuZGxlcilcblx0XHR9XG5cblx0XHR0aGlzLm9uIChzaWduYWwsIGNhbGxiYWNrKVxuXHR9XG5cblx0cmVtb3ZlU2lnbmFsTGlzdGVuZXIgKHNpZ25hbCwgY2FsbGJhY2spIHtcblx0XHR0aGlzLnJlbW92ZUxpc3RlbmVyIChzaWduYWwsIGNhbGxiYWNrKVxuXG5cdFx0Ly9pZiB0aGVyZSBhcmUgb3RoZXIgbGlzdGVuZXJzIG9uIHRoaXMgc2lnbmFsLCBkbyBub3Rpbmdcblx0XHRpZiAodGhpcy5saXN0ZW5lcnMoc2lnbmFsKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXR1cm4gXG5cdFx0fVxuXG5cdFx0Ly9lbHNlLCB0cnkgdG8gY2xvc2UgdGhlIHN1YnNjcmlwdGlvbiB0byB0aGF0IHNpZ25hbFxuXHRcdGxldCBzaWduYWxIYW5kbGVyID0gdGhpcy5fc2lnbmFsSGFuZGxlcnMuZ2V0KHNpZ25hbClcblx0XHRpZiAoc2lnbmFsSGFuZGxlciA9PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gXG5cdFx0fVxuXG5cdFx0c2lnbmFsSGFuZGxlci5jbG9zZSAoKVxuXHRcdHRoaXMuX3NpZ25hbEhhbmRsZXJzLmRlbGV0ZShzaWduYWwpXG5cdH1cblxuXHR3YXRjaFByb3BlcnRpZXMgKGNvbnRleHQpIHtcblx0XHRpZiAodGhpcy5fcHJvcGVydGllc0NoYW5nZWRDYWxsYmFjayA9PSBudWxsKSB7XG5cdFx0XHR0aGlzLl9wcm9wZXJ0aWVzQ2hhbmdlZENhbGxiYWNrID0gZGF0YSA9PiB0aGlzLl9vblByb3BlcnRpZXNDaGFuZ2VkIChkYXRhKVxuXHRcdFx0dGhpcy5vblNpZ25hbCAoUFJPUEVSVElFU19DSEFOR0VEX1NJR05BTCwgdGhpcy5fcHJvcGVydGllc0NoYW5nZWRDYWxsYmFjaylcblx0XHR9XG5cdFxuXHRcdHRoaXMuX3Byb3BlcnRpZXNDaGFuZ2VkV2F0Y2hlcnMuYWRkIChjb250ZXh0KVxuXHR9XG5cblx0dW53YXRjaFByb3BlcnRpZXMgKGNvbnRleHQpIHtcblx0XHR0aGlzLl9wcm9wZXJ0aWVzQ2hhbmdlZFdhdGNoZXJzLmRlbGV0ZSAoY29udGV4dClcblxuXHRcdC8vaWYgbm8gb25lIGxpc3RlbiBmb3IgcHJvcGVydGllcywgcmVtb3ZlIGxpc3RlbmVyIG9uIHByb3BlcnR5IGNoYW5nZXMgKG9iamVjdCdzIHByb3BlcnRpZXMgd2lsbCBub3QgYmUgdXBkYXRlZCBhbnltb3JlKVxuXHRcdGlmICh0aGlzLl9wcm9wZXJ0aWVzQ2hhbmdlZFdhdGNoZXJzLnNpemUgPD0gMCAmJiB0aGlzLl9wcm9wZXJ0aWVzQ2hhbmdlZENhbGxiYWNrICE9IG51bGwpIHtcblx0XHRcdHRoaXMucmVtb3ZlU2lnbmFsTGlzdGVuZXIgKFBST1BFUlRJRVNfQ0hBTkdFRF9TSUdOQUwsIHRoaXMuX3Byb3BlcnRpZXNDaGFuZ2VkQ2FsbGJhY2spXG5cdFx0XHR0aGlzLl9wcm9wZXJ0aWVzQ2hhbmdlZENhbGxiYWNrID0gbnVsbFxuXHRcdH1cblx0fVxuXG5cblx0Y2FsbCAobWV0aG9kLCBhcmdzLCBjYWxsYmFjaykge1xuXHRcdGxldCBpZmFjZVxuXHRcdFtpZmFjZSwgbWV0aG9kXSA9IHRoaXMuX2V4dHJhY3RJZmFjZShtZXRob2QpXG5cdFx0XHRcblx0XHR0aGlzLl9kMWluc3QodGhpcy5fcGVlcklkKS5yZXF1ZXN0KHtcblx0XHRcdHNlcnZpY2U6IHRoaXMuc2VydmljZSxcblx0XHRcdGZ1bmM6IG1ldGhvZCxcblx0XHRcdG9iajoge1xuXHRcdFx0XHRwYXRoOiB0aGlzLm9ialBhdGgsXG5cdFx0XHRcdGludGVyZmFjZTogaWZhY2Vcblx0XHRcdH0sXG5cdFx0XHRkYXRhOiBhcmdzXG5cdFx0fSwgY2FsbGJhY2spXG5cdH1cblxuXHRnZXQgKGlmYWNlLCBwcm9wTmFtZSkge1xuXHRcdHRoaXMuY2FsbCgnb3JnLmZyZWVkZXNrdG9wLkRCdXMuUHJvcGVydGllcy5HZXQnLCB7XG5cdFx0XHRpbnRlcmZhY2U6IGlmYWNlLCAvL3N5c3RlbWQgZGV2cyBhcmUgZnVja3RhcmQgdGhhdCBkb24ndCBmb2xsb3cgdGhlaXIgb3duIGZ1Y2tpbmcgc3RhbmRhcmQgIVxuXHRcdFx0aW50ZXJmYWNlX25hbWU6IGlmYWNlLFxuXHRcdFx0cHJvcGVydHk6IHByb3BOYW1lXG5cdFx0fSwgKHBlZXJJZCwgZXJyLCBkYXRhKSA9PiB7XG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdC8vVE9ETyA6IGhhbmRsZSBlcnJvclxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGVycilcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxldCByZXMgPSB7fVxuXHRcdFx0XHRyZXNbcHJvcE5hbWVdID0gZGF0YVxuXHRcdFx0XHR0aGlzLl9vbkdldEFsbChpZmFjZSwgcmVzKVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0fVxuXG5cdGdldEFsbCAoaWZhY2UsIGZvcmNlKSB7XG5cdFx0Ly9ieSBkZWZhdWx0LCBwcmV2ZW50IG9uZSB0byBydW4gZ2V0IGFsbCBtb3JlIHRoYW4gb25jZSAodGhhdCBzaG91bGRuJ3QgYmUgdXNlZnVsIGlmIFByb3BlcnRpZXNDaGFuZ2VkIGRvZXMgaXRzIGpvYlxuXHRcdGlmICghZm9yY2UgJiYgdGhpcy5fZ2V0QWxsRG9uZVtpZmFjZV0pIHtcblx0XHRcdHJldHVybiBcblx0XHR9XG5cdFx0dGhpcy5fZ2V0QWxsRG9uZVtpZmFjZV0gPSB0cnVlXG5cblx0XHR0aGlzLmNhbGwoJ29yZy5mcmVlZGVza3RvcC5EQnVzLlByb3BlcnRpZXMuR2V0QWxsJywge1xuXHRcdFx0aW50ZXJmYWNlOiBpZmFjZSwgLy9zeXN0ZW1kIGRldnMgYXJlIGZ1Y2t0YXJkIHRoYXQgZG9uJ3QgZm9sbG93IHRoZWlyIG93biBmdWNraW5nIHN0YW5kYXJkICFcblx0XHRcdGludGVyZmFjZV9uYW1lOiBpZmFjZSxcblx0XHR9LCAocGVlcklkLCBlcnIsIGRhdGEpID0+IHtcblx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0Ly9UT0RPIDogaGFuZGxlIGVycm9yXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fb25HZXRBbGwoaWZhY2UsIGRhdGEpXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxuXG5cdF9vbkdldEFsbCAoaWZhY2UsIGRhdGEpIHtcblx0XHRpZiAoZGF0YSA9PSBudWxsKSB7XG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cdFxuXHRcdHRoaXMuX29uUHJvcGVydGllc0NoYW5nZWQoW2lmYWNlLCBkYXRhLCBbXV0pXG5cdH1cblxuXHRcblx0X29uUHJvcGVydGllc0NoYW5nZWQgKGRhdGEpIHtcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkgfHwgZGF0YS5sZW5ndGggIT09IDMpIHtcblx0XHRcdHJldHVybiBcblx0XHR9XG5cblx0XHRsZXQgaWZhY2UgPSBkYXRhWzBdXG5cdFx0bGV0IGNoYW5nZWRQcm9wZXJ0aWVzID0gZGF0YVsxXVxuXHRcdGxldCBpbnZhbGlkYXRlZFByb3BlcnRpZXMgPSBkYXRhWzJdXG5cdFx0XG5cdFx0bGV0IHNpbXBsZUlmYWNlID0gaWZhY2Uuc3BsaXQoJy4nKVxuXHRcdHNpbXBsZUlmYWNlID0gc2ltcGxlSWZhY2Vbc2ltcGxlSWZhY2UubGVuZ3RoIC0gMV1cblxuXHRcdGlmICh0aGlzW3NpbXBsZUlmYWNlXSA9PSBudWxsKSB7XG5cdFx0XHR0aGlzW3NpbXBsZUlmYWNlXSA9IHt9XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgcHJvcE5hbWUgaW4gY2hhbmdlZFByb3BlcnRpZXMpIHtcblx0XHRcdHRoaXNbc2ltcGxlSWZhY2VdW3Byb3BOYW1lXSA9IGNoYW5nZWRQcm9wZXJ0aWVzW3Byb3BOYW1lXVxuXHRcdH1cblxuXHRcdGludmFsaWRhdGVkUHJvcGVydGllcy5mb3JFYWNoKHByb3BOYW1lID0+IHtcblx0XHRcdHRoaXNbc2ltcGxlSWZhY2VdW3Byb3BOYW1lXSA9IG51bGxcblx0XHR9KVxuXG5cdFx0dGhpcy5lbWl0ICgncHJvcGVydGllcy1jaGFuZ2VkJywgc2ltcGxlSWZhY2UsIGNoYW5nZWRQcm9wZXJ0aWVzLCBpbnZhbGlkYXRlZFByb3BlcnRpZXMpXG5cdH1cblx0XG5cdF9leHRyYWN0SWZhY2UgKG1lbWJlcikge1xuXHRcdGxldCBpZmFjZSA9IG1lbWJlci5zcGxpdCgnLicpXG5cdFx0bWVtYmVyID0gaWZhY2VbaWZhY2UubGVuZ3RoIC0gMV1cblx0XHRpZmFjZS5wb3AoKVxuXHRcdGlmYWNlID0gaWZhY2Uuam9pbignLicpXG5cdFxuXHRcdHJldHVybiBbaWZhY2UsIG1lbWJlcl1cblx0fVxufVxuIiwidmFyIGlzQnJvd3NlciA9ICEodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpO1xubGV0IFVOSVhTb2NrZXRIYW5kbGVyXG5pZighaXNCcm93c2VyKSB7XG5cdHZhciBRID0gcmVxdWlyZSgncScpO1xuXHRVTklYU29ja2V0SGFuZGxlciA9IHJlcXVpcmUoJy4vVU5JWFNvY2tldEhhbmRsZXInKVxufVxuZWxzZSB7IHZhciBRID0gd2luZG93LlE7IH1cblxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ25vZGUtZXZlbnQtZW1pdHRlcicpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbnZhciBEaXlhU29ja2V0ID0gcmVxdWlyZSgnLi9EaXlhU29ja2V0JylcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8gTG9nZ2luZyB1dGlsaXR5IG1ldGhvZHMgLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG52YXIgREVCVUcgPSBmYWxzZTtcbnZhciBMb2dnZXIgPSB7XG5cdGxvZzogZnVuY3Rpb24obWVzc2FnZSl7XG5cdFx0aWYoREVCVUcpIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuXHR9LFxuXG5cdGVycm9yOiBmdW5jdGlvbihtZXNzYWdlKXtcblx0XHRpZihERUJVRykgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcblx0fVxufTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cbmZ1bmN0aW9uIERpeWFOb2RlKCl7XG5cdEV2ZW50RW1pdHRlci5jYWxsKHRoaXMpO1xuXG5cdHRoaXMuX3VzZXIgPSBudWxsO1xuXHR0aGlzLl9hdXRoZW50aWNhdGVkID0gbnVsbDtcblx0dGhpcy5fcGFzcyA9IG51bGw7XG5cblx0dGhpcy5fc3RhdHVzID0gJ2Nsb3NlZCc7XG5cdHRoaXMuX2FkZHIgPSBudWxsO1xuXHR0aGlzLl9zb2NrZXQgPSBudWxsO1xuXHR0aGlzLl9uZXh0SWQgPSAwO1xuXHR0aGlzLl9jb25uZWN0aW9uRGVmZXJyZWQgPSBudWxsO1xuXHR0aGlzLl9kaXNjb25uZWN0aW9uRGVmZXJyZWQgPSBudWxsO1xuXHR0aGlzLl9wZW5kaW5nTWVzc2FnZXMgPSBbXTtcblx0dGhpcy5fcGVlcnMgPSBbXTtcblx0dGhpcy5fcmVjb25uZWN0VGltZW91dCA9IDEwMDA7XG5cdHRoaXMuX2Nvbm5lY3RUaW1lb3V0ID0gNTAwMDtcblx0dGhpcy5zdG9yZSA9IG5ldyBNYXAoKVxuXHR0aGlzLl9kaXlhU29ja2V0ID0gbmV3IE1hcCgpO1xufVxuaW5oZXJpdHMoRGl5YU5vZGUsIEV2ZW50RW1pdHRlcik7XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLyBQdWJsaWMgQVBJIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuRGl5YU5vZGUucHJvdG90eXBlLnVzZXIgPSBmdW5jdGlvbih1c2VyKSB7XG5cdGlmKHVzZXIpIHRoaXMuX3VzZXIgPSB1c2VyO1xuXHRlbHNlIHJldHVybiB0aGlzLl91c2VyO1xufTtcbkRpeWFOb2RlLnByb3RvdHlwZS5hdXRoZW50aWNhdGVkID0gZnVuY3Rpb24oYXV0aGVudGljYXRlZCkge1xuXHRpZihhdXRoZW50aWNhdGVkICE9PSB1bmRlZmluZWQpIHRoaXMuX2F1dGhlbnRpY2F0ZWQgPSBhdXRoZW50aWNhdGVkO1xuXHRlbHNlIHJldHVybiB0aGlzLl9hdXRoZW50aWNhdGVkO1xufTtcbkRpeWFOb2RlLnByb3RvdHlwZS5wYXNzID0gZnVuY3Rpb24ocGFzcykge1xuXHRpZihwYXNzICE9PSB1bmRlZmluZWQpIHRoaXMuX3Bhc3MgPSBwYXNzO1xuXHRlbHNlIHJldHVybiB0aGlzLl9wYXNzO1xufTtcbkRpeWFOb2RlLnByb3RvdHlwZS5hZGRyID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9hZGRyOyB9O1xuRGl5YU5vZGUucHJvdG90eXBlLnBlZXJzID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXMuX3BlZXJzOyB9O1xuRGl5YU5vZGUucHJvdG90eXBlLnNlbGYgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX3NlbGY7IH07XG5EaXlhTm9kZS5wcm90b3R5cGUuc2V0U2VjdXJlZCA9IGZ1bmN0aW9uKGJTZWN1cmVkKSB7IHRoaXMuX3NlY3VyZWQgPSBiU2VjdXJlZCAhPT0gZmFsc2U7IH07XG5EaXlhTm9kZS5wcm90b3R5cGUuc2V0V1NvY2tldCA9IGZ1bmN0aW9uKFdTb2NrZXQpIHt0aGlzLl9XU29ja2V0ID0gV1NvY2tldDt9XG5cbi8qKiBAcmV0dXJuIHtQcm9taXNlPFN0cmluZz59IHRoZSBjb25uZWN0ZWQgcGVlciBuYW1lICovXG5EaXlhTm9kZS5wcm90b3R5cGUuY29ubmVjdCA9IGZ1bmN0aW9uIChhZGRyLCBXU29ja2V0KSB7XG5cdHRoaXMuYkRvbnRSZWNvbm5lY3QgPSBmYWxzZVxuXG5cdC8vIEhhbmRsZSBsb2NhbCBjbGllbnRzIG9uIFVOSVggc29ja2V0c1xuXHRpZiAoYWRkci5zdGFydHNXaXRoKCd1bml4Oi8vJykpIHtcblx0XHQvLyBJZiB3ZSd2ZSB0cnlpbmcgdG8gY29ubmVjdCB0byB0aGUgc2FtZSBhZGRyZXNzIHdlJ3JlIGFscmVhZHkgY29ubmVjdGVkIHRvXG5cdFx0aWYgKHRoaXMuX2FkZHIgPT09IGFkZHIpIHtcblx0XHRcdGNvbnNvbGUubG9nKGBbU0RLL0RpeWFOb2RlXSBBZGRyZXNzIGlzIGlkZW50aWNhbCB0byBvdXIgYWRkcmVzcy4uLmApXG5cdFx0XHRpZiAodGhpcy5fc3RhdHVzID09PSAnb3BlbmVkJykge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhgW1NESy9EaXlhTm9kZV0gLi4uIGFuZCB0aGUgY29ubmVjdGlvbiBpcyBzdGlsbCBvcGVuZW5lZCwgcmV0dXJuaW5nIGl0LmApXG5cdFx0XHRcdHJldHVybiBRKHRoaXMuc2VsZigpKVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAodGhpcy5fY29ubmVjdGlvbkRlZmVycmVkICYmIHRoaXMuX2Nvbm5lY3Rpb25EZWZlcnJlZC5wcm9taXNlICYmIHRoaXMuX2Nvbm5lY3Rpb25EZWZlcnJlZC5wcm9taXNlLmlzUGVuZGluZygpKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGBbU0RLL0RpeWFOb2RlXS4uLiBhbmQgdGhlIGNvbm5lY3Rpb24gaXMgcGVuZGluZywgc28gcmV0dXJuaW5nIHRoZSBwZW5kaW5nIGNvbm5lY3Rpb24uYClcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25EZWZlcnJlZC5wcm9taXNlXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuY2xvc2UoKVxuXHRcdC50aGVuKCBfID0+IHtcblx0XHRcdHRoaXMuX2FkZHIgPSBhZGRyXG5cdFx0XHR0aGlzLl9jb25uZWN0aW9uRGVmZXJyZWQgPSBRLmRlZmVyKClcblx0XHRcdExvZ2dlci5sb2coJ2QxOiBjb25uZWN0IHRvICcgKyB0aGlzLl9hZGRyKVxuXHRcdFx0bGV0IHNvY2sgPSBuZXcgVU5JWFNvY2tldEhhbmRsZXIodGhpcy5fYWRkci5zdWJzdHIoJ3VuaXg6Ly8nLmxlbmd0aCksIHRoaXMuX2Nvbm5lY3RUaW1lb3V0KVxuXG5cdFx0XHRpZiAoIXRoaXMuX3NvY2tldEhhbmRsZXIpXG5cdFx0XHRcdHRoaXMuX3NvY2tldEhhbmRsZXIgPSBzb2NrXG5cblx0XHRcdHRoaXMuX29ub3BlbmluZygpXG5cblx0XHRcdHNvY2sub24oJ29wZW4nLCBfID0+IHtcblx0XHRcdFx0aWYgKHRoaXMuX3NvY2tldEhhbmRsZXIgIT09IHNvY2spIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnW1NESy9EaXlhTm9kZV0gU29ja2V0IHJlc3BvbmRlZCBidXQgYWxyZWFkeSBjb25uZWN0ZWQgdG8gYSBkaWZmZXJlbnQgb25lJylcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9zdGF0dXMgPSAnb3BlbmVkJ1xuXHRcdFx0XHR0aGlzLl9zZXR1cFBpbmdSZXNwb25zZSgpXG5cdFx0XHR9KVxuXG5cdFx0XHRzb2NrLm9uKCdjbG9zaW5nJywgXyA9PiB7XG5cdFx0XHRcdGlmICh0aGlzLl9zb2NrZXRIYW5kbGVyICE9PSBzb2NrKVxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHR0aGlzLl9vbmNsb3NpbmcoKVxuXHRcdFx0fSlcblxuXHRcdFx0c29jay5vbignY2xvc2UnLCBfID0+IHtcblx0XHRcdFx0aWYgKHRoaXMuX3NvY2tldEhhbmRsZXIgIT09IHNvY2spXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdHRoaXMuX3NvY2tldEhhbmRsZXIgPSBudWxsXG5cdFx0XHRcdHRoaXMuX3N0YXR1cyA9ICdjbG9zZWQnXG5cdFx0XHRcdHRoaXMuX3N0b3BQaW5nUmVzcG9uc2UoKVxuXHRcdFx0XHR0aGlzLl9vbmNsb3NlKClcblxuXHRcdFx0XHRpZiAodGhpcy5fY29ubmVjdGlvbkRlZmVycmVkKSB7XG5cdFx0XHRcdFx0dGhpcy5fY29ubmVjdGlvbkRlZmVycmVkLnJlamVjdChcImNsb3NlZFwiKVxuXHRcdFx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25EZWZlcnJlZCA9IG51bGxcblx0XHRcdFx0fVxuXHRcdFx0fSlcblxuXHRcdFx0c29jay5vbignZXJyb3InLCBlcnJvciA9PiB7XG5cdFx0XHRcdGlmICh0aGlzLl9zb2NrZXRIYW5kbGVyICE9PSBzb2NrKVxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHR0aGlzLl9vbmVycm9yKGVycm9yKVxuXHRcdFx0fSlcblxuXHRcdFx0c29jay5vbigndGltZW91dCcsIF8gPT4ge1xuXHRcdFx0XHRpZiAodGhpcy5fc29ja2V0SGFuZGxlciAhPT0gc29jaylcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0dGhpcy5fc29ja2V0SGFuZGxlciA9IG51bGxcblx0XHRcdFx0dGhpcy5fc3RhdHVzID0gJ2Nsb3NlZCdcblx0XHRcdFx0aWYgKHRoaXMuX2Nvbm5lY3Rpb25EZWZlcnJlZCkge1xuXHRcdFx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25EZWZlcnJlZC5yZWplY3QoXCJjbG9zZWRcIilcblx0XHRcdFx0XHR0aGlzLl9jb25uZWN0aW9uRGVmZXJyZWQgPSBudWxsXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cblx0XHRcdHNvY2sub24oJ21lc3NhZ2UnLCB0aGlzLl9vbm1lc3NhZ2UuYmluZCh0aGlzKSlcblxuXHRcdFx0cmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25EZWZlcnJlZC5wcm9taXNlXG5cdFx0fSlcblx0fVxuXG5cdGlmIChXU29ja2V0ICE9PSB1bmRlZmluZWQpXG5cdFx0dGhpcy5fV1NvY2tldCA9IFdTb2NrZXRcblx0ZWxzZSBpZiAodGhpcy5fV1NvY2tldCA9PT0gdW5kZWZpbmVkKVxuXHRcdHRoaXMuX1dTb2NrZXQgPSB3aW5kb3cuV2ViU29ja2V0XG5cblx0V1NvY2tldCA9IHRoaXMuX1dTb2NrZXRcblxuXHQvLyBDaGVjayBhbmQgRm9ybWF0IFVSSSAoRlFETilcblx0aWYgKGFkZHIuc3RhcnRzV2l0aChcIndzOi8vXCIpICYmIHRoaXMuX3NlY3VyZWQpXG5cdFx0cmV0dXJuIFEucmVqZWN0KFwiUGxlYXNlIHVzZSBhIHNlY3VyZWQgY29ubmVjdGlvbiAoXCIgKyBhZGRyICsgXCIpXCIpXG5cblx0aWYgKGFkZHIuc3RhcnRzV2l0aChcIndzczovL1wiKSAmJiB0aGlzLl9zZWN1cmVkID09PSBmYWxzZSlcblx0XHRyZXR1cm4gUS5yZWplY3QoXCJQbGVhc2UgdXNlIGEgbm9uLXNlY3VyZWQgY29ubmVjdGlvbiAoXCIgKyBhZGRyICsgXCIpXCIpXG5cblx0aWYgKCFhZGRyLnN0YXJ0c1dpdGgoXCJ3czovL1wiKSAmJiAhYWRkci5zdGFydHNXaXRoKFwid3NzOi8vXCIpKSB7XG5cdFx0aWYgKHRoaXMuX3NlY3VyZWQpXG5cdFx0XHRhZGRyID0gXCJ3c3M6Ly9cIiArIGFkZHJcblx0XHRlbHNlXG5cdFx0XHRhZGRyID0gXCJ3czovL1wiICsgYWRkclxuXHR9XG5cblx0aWYgKHRoaXMuX2FkZHIgPT09IGFkZHIpIHtcblx0XHRpZiAodGhpcy5fc3RhdHVzID09PSAnb3BlbmVkJylcblx0XHRcdHJldHVybiBRKHRoaXMuc2VsZigpKVxuXHRcdGVsc2UgaWYgKHRoaXMuX2Nvbm5lY3Rpb25EZWZlcnJlZCAmJiB0aGlzLl9jb25uZWN0aW9uRGVmZXJyZWQucHJvbWlzZSAmJiB0aGlzLl9jb25uZWN0aW9uRGVmZXJyZWQucHJvbWlzZS5pc1BlbmRpbmcoKSlcblx0XHRcdHJldHVybiB0aGlzLl9jb25uZWN0aW9uRGVmZXJyZWQucHJvbWlzZVxuXHR9XG5cblx0cmV0dXJuIHRoaXMuY2xvc2UoKVxuXHQudGhlbiggXyA9PiB7XG5cdFx0dGhpcy5fYWRkciA9IGFkZHJcblx0XHR0aGlzLl9jb25uZWN0aW9uRGVmZXJyZWQgPSBRLmRlZmVyKClcblx0XHRMb2dnZXIubG9nKCdkMTogY29ubmVjdCB0byAnICsgdGhpcy5fYWRkcilcblx0XHR2YXIgc29jayA9IG5ldyBTb2NrZXRIYW5kbGVyKFdTb2NrZXQsIHRoaXMuX2FkZHIsIHRoaXMuX2Nvbm5lY3RUaW1lb3V0KVxuXG5cdFx0aWYgKCF0aGlzLl9zb2NrZXRIYW5kbGVyKVxuXHRcdFx0dGhpcy5fc29ja2V0SGFuZGxlciA9IHNvY2tcblxuXHRcdHRoaXMuX29ub3BlbmluZygpXG5cblx0XHRzb2NrLm9uKCdvcGVuJywgXyA9PiB7XG5cdFx0XHRpZiAodGhpcy5fc29ja2V0SGFuZGxlciAhPT0gc29jaykge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIltkMV0gV2Vic29ja2V0IHJlc3BvbmRlZCBidXQgYWxyZWFkeSBjb25uZWN0ZWQgdG8gYSBkaWZmZXJlbnQgb25lXCIpXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXHRcdFx0dGhpcy5fc29ja2V0SGFuZGxlciA9IHNvY2tcblx0XHRcdHRoaXMuX3N0YXR1cyA9ICdvcGVuZWQnXG5cdFx0XHR0aGlzLl9zZXR1cFBpbmdSZXNwb25zZSgpXG5cdFx0fSlcblxuXHRcdHNvY2sub24oJ2Nsb3NpbmcnLCBfID0+IHtcblx0XHRcdGlmICh0aGlzLl9zb2NrZXRIYW5kbGVyICE9PSBzb2NrKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdHRoaXMuX29uY2xvc2luZygpXG5cdFx0fSlcblxuXHRcdHNvY2sub24oJ2Nsb3NlJywgXyA9PiB7XG5cdFx0XHRpZiAodGhpcy5fc29ja2V0SGFuZGxlciAhPT0gc29jaylcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR0aGlzLl9zb2NrZXRIYW5kbGVyID0gbnVsbFxuXHRcdFx0dGhpcy5fc3RhdHVzID0gJ2Nsb3NlZCdcblx0XHRcdHRoaXMuX3N0b3BQaW5nUmVzcG9uc2UoKVxuXHRcdFx0dGhpcy5fb25jbG9zZSgpXG5cblx0XHRcdGlmICh0aGlzLl9jb25uZWN0aW9uRGVmZXJyZWQpIHtcblx0XHRcdFx0dGhpcy5fY29ubmVjdGlvbkRlZmVycmVkLnJlamVjdChcImNsb3NlZFwiKVxuXHRcdFx0XHR0aGlzLl9jb25uZWN0aW9uRGVmZXJyZWQgPSBudWxsXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdHNvY2sub24oJ2Vycm9yJywgZXJyb3IgPT4ge1xuXHRcdFx0aWYgKHRoaXMuX3NvY2tldEhhbmRsZXIgIT09IHNvY2spXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0dGhpcy5fb25lcnJvcihlcnJvcilcblx0XHR9KVxuXG5cdFx0c29jay5vbigndGltZW91dCcsIF8gPT4ge1xuXHRcdFx0aWYgKHRoaXMuX3NvY2tldEhhbmRsZXIgIT09IHNvY2spXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0dGhpcy5fc29ja2V0SGFuZGxlciA9IG51bGxcblx0XHRcdHRoaXMuX3N0YXR1cyA9ICdjbG9zZWQnXG5cdFx0XHRpZiAodGhpcy5fY29ubmVjdGlvbkRlZmVycmVkKSB7XG5cdFx0XHRcdHRoaXMuX2Nvbm5lY3Rpb25EZWZlcnJlZC5yZWplY3QoXCJjbG9zZWRcIilcblx0XHRcdFx0dGhpcy5fY29ubmVjdGlvbkRlZmVycmVkID0gbnVsbFxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHRzb2NrLm9uKCdtZXNzYWdlJywgdGhpcy5fb25tZXNzYWdlLmJpbmQodGhpcykpXG5cblx0XHRyZXR1cm4gdGhpcy5fY29ubmVjdGlvbkRlZmVycmVkLnByb21pc2Vcblx0fSlcbn1cblxuRGl5YU5vZGUucHJvdG90eXBlLmRpc2Nvbm5lY3QgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5iRG9udFJlY29ubmVjdCA9IHRydWVcblx0cmV0dXJuIHRoaXMuY2xvc2UoKVxufVxuXG5EaXlhTm9kZS5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpe1xuXHR0aGlzLl9zdG9wUGluZ1Jlc3BvbnNlKCk7XG5cdGlmKHRoaXMuX3NvY2tldEhhbmRsZXIpIHJldHVybiB0aGlzLl9zb2NrZXRIYW5kbGVyLmNsb3NlKCk7XG5cdGVsc2UgcmV0dXJuIFEoKTtcbn07XG5cbkRpeWFOb2RlLnByb3RvdHlwZS5pc0Nvbm5lY3RlZCA9IGZ1bmN0aW9uKCl7XG5cdHJldHVybiAodGhpcy5fc29ja2V0SGFuZGxlciAmJiB0aGlzLl9zb2NrZXRIYW5kbGVyLmlzQ29ubmVjdGVkKCkpO1xufTtcblxuRGl5YU5vZGUucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbihwYXJhbXMsIGNhbGxiYWNrLCB0aW1lb3V0LCBvcHRpb25zKXtcblx0dmFyIHRoYXQgPSB0aGlzO1xuXHRpZighb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuXG5cdGlmKHBhcmFtcy5jb25zdHJ1Y3RvciA9PT0gU3RyaW5nKSB7XG5cdFx0dmFyIF9wYXJhbXMgPSBwYXJhbXMuc3BsaXQoXCIuXCIpO1xuXHRcdGlmKF9wYXJhbXMubGVuZ3RoIT0yKSB0aHJvdyAnTWFsZm9ybWVkUmVxdWVzdCc7XG5cdFx0cGFyYW1zID0ge3NlcnZpY2U6X3BhcmFtc1swXSwgZnVuYzpfcGFyYW1zWzFdfTtcblx0fVxuXG5cdGlmKCFwYXJhbXMuc2VydmljZSkge1xuXHRcdExvZ2dlci5lcnJvcignTm8gc2VydmljZSBkZWZpbmVkIGZvciByZXF1ZXN0ICEnKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHR2YXIgbWVzc2FnZSA9IHRoaXMuX2NyZWF0ZU1lc3NhZ2UocGFyYW1zLCBcIlJlcXVlc3RcIik7XG5cdHRoaXMuX2FwcGVuZE1lc3NhZ2UobWVzc2FnZSwgY2FsbGJhY2spO1xuXHRpZih0eXBlb2Ygb3B0aW9ucy5jYWxsYmFja19wYXJ0aWFsID09PSAnZnVuY3Rpb24nKSB0aGlzLl9wZW5kaW5nTWVzc2FnZXNbbWVzc2FnZS5pZF0uY2FsbGJhY2tfcGFydGlhbCA9IG9wdGlvbnMuY2FsbGJhY2tfcGFydGlhbDtcblx0bWVzc2FnZS5vcHRpb25zID0gb3B0aW9ucztcblxuXHRpZighaXNOYU4odGltZW91dCkgJiYgdGltZW91dCA+IDApe1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdHZhciBoYW5kbGVyID0gdGhhdC5fcmVtb3ZlTWVzc2FnZShtZXNzYWdlLmlkKTtcblx0XHRcdGlmKGhhbmRsZXIpIHRoYXQuX25vdGlmeUxpc3RlbmVyKGhhbmRsZXIsICdUaW1lb3V0IGV4Y2VlZGVkICgnK3RpbWVvdXQrJ21zKSAhJyk7XG5cdFx0fSwgdGltZW91dCk7XG5cdH1cblxuXHRpZighdGhpcy5fc2VuZChtZXNzYWdlKSl7XG5cdFx0dGhpcy5fcmVtb3ZlTWVzc2FnZShtZXNzYWdlLmlkKTtcblx0XHRjb25zb2xlLmVycm9yKCdDYW5ub3Qgc2VuZCByZXF1ZXN0ICEnKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn07XG5cbkRpeWFOb2RlLnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbihwYXJhbXMsIGNhbGxiYWNrKXtcblx0aWYocGFyYW1zLmNvbnN0cnVjdG9yID09PSBTdHJpbmcpIHtcblx0XHR2YXIgX3BhcmFtcyA9IHBhcmFtcy5zcGxpdChcIi5cIik7XG5cdFx0aWYoX3BhcmFtcy5sZW5ndGghPTIpIHRocm93ICdNYWxmb3JtZWRSZXF1ZXN0Jztcblx0XHRwYXJhbXMgPSB7c2VydmljZTpfcGFyYW1zWzBdLCBmdW5jOl9wYXJhbXNbMV19O1xuXHR9XG5cblx0aWYoIXBhcmFtcy5zZXJ2aWNlKXtcblx0XHRMb2dnZXIuZXJyb3IoJ05vIHNlcnZpY2UgZGVmaW5lZCBmb3Igc3Vic2NyaXB0aW9uICEnKTtcblx0XHRyZXR1cm4gLTE7XG5cdH1cblxuXHR2YXIgbWVzc2FnZSA9IHRoaXMuX2NyZWF0ZU1lc3NhZ2UocGFyYW1zLCBcIlN1YnNjcmlwdGlvblwiKTtcblx0dGhpcy5fYXBwZW5kTWVzc2FnZShtZXNzYWdlLCBjYWxsYmFjayk7XG5cblx0aWYoIXRoaXMuX3NlbmQobWVzc2FnZSkpe1xuXHRcdHRoaXMuX3JlbW92ZU1lc3NhZ2UobWVzc2FnZS5pZCk7XG5cdFx0TG9nZ2VyLmVycm9yKCdDYW5ub3Qgc2VuZCBzdWJzY3JpcHRpb24gIScpO1xuXHRcdHJldHVybiAtMTtcblx0fVxuXG5cdHJldHVybiBtZXNzYWdlLmlkO1xufTtcblxuRGl5YU5vZGUucHJvdG90eXBlLm9wZW5Tb2NrZXQgPSBmdW5jdGlvbihkMWluc3QsIHBhcmFtcywgY2FsbGJhY2spe1xuXHR0aGlzLl9kaXlhU29ja2V0LnNldChwYXJhbXMuc29ja2V0SWQsIG5ldyBEaXlhU29ja2V0KGQxaW5zdCwgcGFyYW1zKSk7XG5cdHRoaXMuX2RpeWFTb2NrZXQuZ2V0KHBhcmFtcy5zb2NrZXRJZCkuc3Vic2NyaWJlU29ja2V0Q2xvc2VkKHBhcmFtcy5zb2NrZXRJZCk7XG5cdGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKHRoaXMuX2RpeWFTb2NrZXQuZ2V0KHBhcmFtcy5zb2NrZXRJZCkpO1xufTtcblxuRGl5YU5vZGUucHJvdG90eXBlLm9uU29ja2V0Q2xvc2VkID0gZnVuY3Rpb24oc29ja2V0SWQpe1xuXHRpZiAodGhpcy5fZGl5YVNvY2tldC5oYXMoc29ja2V0SWQpKXtcblx0XHR0aGlzLl9kaXlhU29ja2V0LmdldChzb2NrZXRJZCkuZW1pdCgnY2xvc2UnKVxuXHRcdHRoaXMuX2RpeWFTb2NrZXQuZGVsZXRlKHNvY2tldElkKTtcblx0fVxufVxuXG5EaXlhTm9kZS5wcm90b3R5cGUuc2VuZFNvY2tldERhdGEgPSBmdW5jdGlvbihwYXJhbXMpe1xuXHRsZXQgbWVzc2FnZSA9IHRoaXMuX2NyZWF0ZU1lc3NhZ2UocGFyYW1zLCBcIlNvY2tldENsaWVudERhdGFcIik7XG5cdGlmKCF0aGlzLl9zZW5kKG1lc3NhZ2UpKXtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzZW5kIHNvY2tldCEnKTtcblx0fVxuXHRyZXR1cm4gbWVzc2FnZS5pZDtcbn07XG5cbkRpeWFOb2RlLnByb3RvdHlwZS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uKHN1YklkKXtcblx0aWYodGhpcy5fcGVuZGluZ01lc3NhZ2VzW3N1YklkXSAmJiB0aGlzLl9wZW5kaW5nTWVzc2FnZXNbc3ViSWRdLnR5cGUgPT09IFwiU3Vic2NyaXB0aW9uXCIpe1xuXHRcdHZhciBzdWJzY3JpcHRpb24gPSB0aGlzLl9yZW1vdmVNZXNzYWdlKHN1YklkKTtcblxuXHRcdHZhciBtZXNzYWdlID0gdGhpcy5fY3JlYXRlTWVzc2FnZSh7XG5cdFx0XHR0YXJnZXQ6IHN1YnNjcmlwdGlvbi50YXJnZXQsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHN1YklkOiBzdWJJZFxuXHRcdFx0fVxuXHRcdH0sIFwiVW5zdWJzY3JpYmVcIik7XG5cblx0XHRpZighdGhpcy5fc2VuZChtZXNzYWdlKSl7XG5cdFx0XHRMb2dnZXIuZXJyb3IoJ0Nhbm5vdCBzZW5kIHVuc3Vic2NyaWJlICEnKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vIEludGVybmFsIG1ldGhvZHMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5EaXlhTm9kZS5wcm90b3R5cGUuX2FwcGVuZE1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlLCBjYWxsYmFjayl7XG5cdHRoaXMuX3BlbmRpbmdNZXNzYWdlc1ttZXNzYWdlLmlkXSA9IHtcblx0XHRjYWxsYmFjazogY2FsbGJhY2ssXG5cdFx0dHlwZTogbWVzc2FnZS50eXBlLFxuXHRcdHRhcmdldDogbWVzc2FnZS50YXJnZXRcblx0fTtcbn07XG5cbkRpeWFOb2RlLnByb3RvdHlwZS5fcmVtb3ZlTWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2VJZCl7XG5cdHZhciBoYW5kbGVyID0gdGhpcy5fcGVuZGluZ01lc3NhZ2VzW21lc3NhZ2VJZF07XG5cdGlmKGhhbmRsZXIpe1xuXHRcdGRlbGV0ZSB0aGlzLl9wZW5kaW5nTWVzc2FnZXNbbWVzc2FnZUlkXTtcblx0XHRyZXR1cm4gaGFuZGxlcjtcblx0fWVsc2V7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn07XG5cbkRpeWFOb2RlLnByb3RvdHlwZS5fY2xlYXJNZXNzYWdlcyA9IGZ1bmN0aW9uKGVyciwgZGF0YSl7XG5cdGZvcih2YXIgbWVzc2FnZUlkIGluIHRoaXMuX3BlbmRpbmdNZXNzYWdlcyl7XG5cdFx0dmFyIGhhbmRsZXIgPSB0aGlzLl9yZW1vdmVNZXNzYWdlKG1lc3NhZ2VJZCk7XG5cdFx0dGhpcy5fbm90aWZ5TGlzdGVuZXIoaGFuZGxlciwgZXJyLCBkYXRhKTtcblx0fVxufTtcblxuRGl5YU5vZGUucHJvdG90eXBlLl9jbGVhclBlZXJzID0gZnVuY3Rpb24oKSB7XG5cdHdoaWxlKHRoaXMuX3BlZXJzLmxlbmd0aCkge1xuXHRcdGxldCBwZWVyID0gdGhpcy5fcGVlcnMucG9wKClcblx0XHR0aGlzLnN0b3JlLmRlbGV0ZShwZWVyKVxuXHRcdHRoaXMuZW1pdCgncGVlci1kaXNjb25uZWN0ZWQnLCBwZWVyKTtcblx0fVxufTtcblxuRGl5YU5vZGUucHJvdG90eXBlLl9nZXRNZXNzYWdlSGFuZGxlciA9IGZ1bmN0aW9uKG1lc3NhZ2VJZCl7XG5cdHZhciBoYW5kbGVyID0gdGhpcy5fcGVuZGluZ01lc3NhZ2VzW21lc3NhZ2VJZF07XG5cdHJldHVybiBoYW5kbGVyID8gaGFuZGxlciA6IG51bGw7XG59O1xuXG5cbkRpeWFOb2RlLnByb3RvdHlwZS5fbm90aWZ5TGlzdGVuZXIgPSBmdW5jdGlvbihoYW5kbGVyLCBlcnJvciwgZGF0YSl7XG5cdGlmKGhhbmRsZXIgJiYgdHlwZW9mIGhhbmRsZXIuY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcblx0XHRlcnJvciA9IGVycm9yID8gZXJyb3IgOiBudWxsO1xuXHRcdGRhdGEgPSBkYXRhID8gZGF0YSA6IG51bGw7XG5cdFx0dHJ5IHtcblx0XHRcdGhhbmRsZXIuY2FsbGJhY2soZXJyb3IsIGRhdGEpO1xuXHRcdH0gY2F0Y2goZSkgeyBjb25zb2xlLmxvZygnW0Vycm9yIGluIFJlcXVlc3QgY2FsbGJhY2tdICcgKyBlLnN0YWNrID8gZS5zdGFjayA6IGUpO31cblx0fVxufTtcblxuRGl5YU5vZGUucHJvdG90eXBlLl9zZW5kID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcblx0cmV0dXJuIHRoaXMuX3NvY2tldEhhbmRsZXIgJiYgdGhpcy5fc29ja2V0SGFuZGxlci5zZW5kKG1lc3NhZ2UpXG59XG5cbkRpeWFOb2RlLnByb3RvdHlwZS5fc2V0dXBQaW5nUmVzcG9uc2UgPSBmdW5jdGlvbigpe1xuXHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0dGhpcy5fcGluZ1RpbWVvdXQgPSAxNTAwMDtcblx0dGhpcy5fbGFzdFBpbmcgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuXHRmdW5jdGlvbiBjaGVja1BpbmcoKXtcblx0XHR2YXIgY3VyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdGlmKGN1clRpbWUgLSB0aGF0Ll9sYXN0UGluZyA+IHRoYXQuX3BpbmdUaW1lb3V0KXtcblx0XHRcdHRoYXQuX2ZvcmNlQ2xvc2UoKTtcblx0XHRcdExvZ2dlci5sb2coXCJkMTogIHRpbWVkIG91dCFcIik7XG5cdFx0fWVsc2V7XG5cdFx0XHRMb2dnZXIubG9nKFwiZDE6IGxhc3QgcGluZyBva1wiKTtcblx0XHRcdHRoYXQuX3BpbmdTZXRUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KGNoZWNrUGluZywgTWF0aC5yb3VuZCh0aGF0Ll9waW5nVGltZW91dCAvIDIuMSkpO1xuXHRcdH1cblx0fVxuXG5cdGNoZWNrUGluZygpO1xufTtcblxuRGl5YU5vZGUucHJvdG90eXBlLl9zdG9wUGluZ1Jlc3BvbnNlID0gZnVuY3Rpb24oKXtcblx0Y2xlYXJUaW1lb3V0KHRoaXMuX3BpbmdTZXRUaW1lb3V0SWQpO1xufTtcblxuRGl5YU5vZGUucHJvdG90eXBlLl9mb3JjZUNsb3NlID0gZnVuY3Rpb24oKXtcblx0dGhpcy5fc29ja2V0SGFuZGxlci5jbG9zZSgpO1xuXHR0aGlzLl9vbmNsb3NlKCk7XG59O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8gU29ja2V0IGV2ZW50IGhhbmRsZXJzIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuRGl5YU5vZGUucHJvdG90eXBlLl9vbm1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKXtcblx0aWYobWVzc2FnZS50eXBlID09PSBcIlNvY2tldFNlcnZlckRhdGFcIikgdGhpcy5faGFuZGxlU29ja2V0U2VydmVyRGF0YShtZXNzYWdlKTtcblx0aWYoaXNOYU4obWVzc2FnZS5pZCkpIHJldHVybiB0aGlzLl9oYW5kbGVJbnRlcm5hbE1lc3NhZ2UobWVzc2FnZSk7XG5cdHZhciBoYW5kbGVyID0gdGhpcy5fZ2V0TWVzc2FnZUhhbmRsZXIobWVzc2FnZS5pZCk7XG5cdGlmKCFoYW5kbGVyKSByZXR1cm47XG5cdHN3aXRjaChoYW5kbGVyLnR5cGUpe1xuXHRcdGNhc2UgXCJSZXF1ZXN0XCI6XG5cdFx0XHR0aGlzLl9oYW5kbGVSZXF1ZXN0KGhhbmRsZXIsIG1lc3NhZ2UpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIlN1YnNjcmlwdGlvblwiOlxuXHRcdFx0dGhpcy5faGFuZGxlU3Vic2NyaXB0aW9uKGhhbmRsZXIsIG1lc3NhZ2UpO1xuXHRcdFx0YnJlYWs7XG5cdH1cbn07XG5cbkRpeWFOb2RlLnByb3RvdHlwZS5fb25vcGVuaW5nID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuZW1pdCgnb3BlbmluZycsIHRoaXMpO1xufTtcblxuRGl5YU5vZGUucHJvdG90eXBlLl9vbmVycm9yID0gZnVuY3Rpb24oZXJyb3IpIHtcblx0dGhpcy5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcihlcnJvcikpO1xufTtcblxuRGl5YU5vZGUucHJvdG90eXBlLl9vbmNsb3NpbmcgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5lbWl0KCdjbG9zaW5nJywgdGhpcyk7XG59O1xuXG5EaXlhTm9kZS5wcm90b3R5cGUuX29uY2xvc2UgPSBmdW5jdGlvbigpe1xuXHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0dGhpcy5fY2xlYXJNZXNzYWdlcygnUGVlckRpc2Nvbm5lY3RlZCcpO1xuXHR0aGlzLl9jbGVhclBlZXJzKCk7XG5cblx0aWYoIXRoaXMuYkRvbnRSZWNvbm5lY3QpIHtcblx0XHRMb2dnZXIubG9nKCdkMTogY29ubmVjdGlvbiBsb3N0LCB0cnkgcmVjb25uZWN0aW5nJyk7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0dGhhdC5jb25uZWN0KHRoYXQuX2FkZHIsIHRoYXQuX1dTb2NrZXQpLmNhdGNoKGZ1bmN0aW9uKGVycil7fSk7XG5cdFx0fSwgdGhhdC5fcmVjb25uZWN0VGltZW91dCk7XG5cdH1cblx0dGhpcy5lbWl0KCdjbG9zZScsIHRoaXMuX2FkZHIpO1xufTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vIFByb3RvY29sIGV2ZW50IGhhbmRsZXJzIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5EaXlhTm9kZS5wcm90b3R5cGUuX2hhbmRsZUludGVybmFsTWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2Upe1xuXHRzd2l0Y2gobWVzc2FnZS50eXBlKXtcblx0XHRjYXNlIFwiUGVlckNvbm5lY3RlZFwiOlxuXHRcdFx0dGhpcy5faGFuZGxlUGVlckNvbm5lY3RlZChtZXNzYWdlKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJQZWVyRGlzY29ubmVjdGVkXCI6XG5cdFx0XHR0aGlzLl9oYW5kbGVQZWVyRGlzY29ubmVjdGVkKG1lc3NhZ2UpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIkhhbmRzaGFrZVwiOlxuXHRcdFx0dGhpcy5faGFuZGxlSGFuZHNoYWtlKG1lc3NhZ2UpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcIlBpbmdcIjpcblx0XHRcdHRoaXMuX2hhbmRsZVBpbmcobWVzc2FnZSk7XG5cdFx0XHRicmVhaztcblx0fVxufTtcblxuRGl5YU5vZGUucHJvdG90eXBlLl9oYW5kbGVQaW5nID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcblx0bWVzc2FnZS50eXBlID0gXCJQb25nXCJcblx0dGhpcy5fbGFzdFBpbmcgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuXHR0aGlzLl9zZW5kKG1lc3NhZ2UpXG59XG5cbkRpeWFOb2RlLnByb3RvdHlwZS5faGFuZGxlSGFuZHNoYWtlID0gZnVuY3Rpb24obWVzc2FnZSl7XG5cblx0aWYobWVzc2FnZS5wZWVycyA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiBtZXNzYWdlLnNlbGYgIT09ICdzdHJpbmcnKXtcblx0XHRMb2dnZXIuZXJyb3IoXCJNaXNzaW5nIGFyZ3VtZW50cyBmb3IgSGFuZHNoYWtlIG1lc3NhZ2UsIGRyb3BwaW5nLi4uXCIpO1xuXHRcdHJldHVybiA7XG5cdH1cblxuXG5cdHRoaXMuX3NlbGYgPSBtZXNzYWdlLnNlbGY7XG5cblx0Zm9yKHZhciBpPTA7aTxtZXNzYWdlLnBlZXJzLmxlbmd0aDsgaSsrKXtcblx0XHR0aGlzLl9wZWVycy5wdXNoKG1lc3NhZ2UucGVlcnNbaV0pO1xuXHRcdHRoaXMuc3RvcmUuc2V0KG1lc3NhZ2UucGVlcnNbaV0sIG5ldyBNYXAoKSlcblx0XHR0aGlzLmVtaXQoJ3BlZXItY29ubmVjdGVkJywgbWVzc2FnZS5wZWVyc1tpXSk7XG5cdH1cblxuXHR0aGlzLl9jb25uZWN0aW9uRGVmZXJyZWQucmVzb2x2ZSh0aGlzLnNlbGYoKSk7XG5cdHRoaXMuZW1pdCgnb3BlbicsIHRoaXMuX2FkZHIpO1xuXHR0aGlzLl9zdGF0dXMgPSAnb3BlbmVkJztcblx0dGhpcy5fY29ubmVjdGlvbkRlZmVycmVkID0gbnVsbDtcbn07XG5cbkRpeWFOb2RlLnByb3RvdHlwZS5faGFuZGxlUGVlckNvbm5lY3RlZCA9IGZ1bmN0aW9uKG1lc3NhZ2Upe1xuXHRpZihtZXNzYWdlLnBlZXJJZCA9PT0gdW5kZWZpbmVkKXtcblx0XHRMb2dnZXIuZXJyb3IoXCJNaXNzaW5nIGFyZ3VtZW50cyBmb3IgUGVlckNvbm5lY3RlZCBtZXNzYWdlLCBkcm9wcGluZy4uLlwiKTtcblx0XHRyZXR1cm4gO1xuXHR9XG5cblx0Ly9BZGQgcGVlciB0byB0aGUgbGlzdCBvZiByZWFjaGFibGUgcGVlcnNcblx0dGhpcy5fcGVlcnMucHVzaChtZXNzYWdlLnBlZXJJZCk7XG5cdHRoaXMuc3RvcmUuc2V0KG1lc3NhZ2UucGVlcklkLCBuZXcgTWFwKCkpXG5cblx0dGhpcy5lbWl0KCdwZWVyLWNvbm5lY3RlZCcsIG1lc3NhZ2UucGVlcklkKTtcbn07XG5cbkRpeWFOb2RlLnByb3RvdHlwZS5faGFuZGxlUGVlckRpc2Nvbm5lY3RlZCA9IGZ1bmN0aW9uKG1lc3NhZ2Upe1xuXHRpZihtZXNzYWdlLnBlZXJJZCA9PT0gdW5kZWZpbmVkKXtcblx0XHRMb2dnZXIuZXJyb3IoXCJNaXNzaW5nIGFyZ3VtZW50cyBmb3IgUGVlckRpc2Nvbm5lY3RlZCBNZXNzYWdlLCBkcm9wcGluZy4uLlwiKTtcblx0XHRyZXR1cm4gO1xuXHR9XG5cdFxuXHQvL1JlbW92ZSBwZWVyIGZyb20gbGlzdCBvZiByZWFjaGFibGUgcGVlcnNcblx0Zm9yKHZhciBpPXRoaXMuX3BlZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKXtcblx0XHRpZih0aGlzLl9wZWVyc1tpXSA9PT0gbWVzc2FnZS5wZWVySWQpe1xuXHRcdFx0dGhpcy5fcGVlcnMuc3BsaWNlKGksIDEpO1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cdC8vcmVtb3ZlIGFzc29jaWF0ZWQgc3RvcmVcblx0dGhpcy5zdG9yZS5kZWxldGUobWVzc2FnZS5wZWVySWQpXG5cblx0Ly9HbyB0aHJvdWdoIGFsbCBwZW5kaW5nIG1lc3NhZ2VzIGFuZCBub3RpZnkgdGhlIG9uZXMgdGhhdCBhcmUgdGFyZ2V0ZWRcblx0Ly9hdCB0aGUgZGlzY29ubmVjdGVkIHBlZXIgdGhhdCBpdCBkaXNjb25uZWN0ZWQgYW5kIHRoZXJlZm9yZSB0aGUgY29tbWFuZFxuXHQvL2Nhbm5vdCBiZSBmdWxmaWxsZWRcblx0Zm9yKHZhciBtZXNzYWdlSWQgaW4gdGhpcy5fcGVuZGluZ01lc3NhZ2VzKXtcblx0XHR2YXIgaGFuZGxlciA9IHRoaXMuX2dldE1lc3NhZ2VIYW5kbGVyKG1lc3NhZ2VJZCk7XG5cdFx0aWYoaGFuZGxlciAmJiBoYW5kbGVyLnRhcmdldCA9PT0gbWVzc2FnZS5wZWVySWQpIHtcblx0XHRcdHRoaXMuX3JlbW92ZU1lc3NhZ2UobWVzc2FnZUlkKTtcblx0XHRcdHRoaXMuX25vdGlmeUxpc3RlbmVyKGhhbmRsZXIsICdQZWVyRGlzY29ubmVjdGVkJywgbnVsbCk7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy5lbWl0KCdwZWVyLWRpc2Nvbm5lY3RlZCcsIG1lc3NhZ2UucGVlcklkKTtcbn07XG5cbkRpeWFOb2RlLnByb3RvdHlwZS5faGFuZGxlUmVxdWVzdCA9IGZ1bmN0aW9uKGhhbmRsZXIsIG1lc3NhZ2Upe1xuXHRpZihtZXNzYWdlLnR5cGUgPT09ICdQYXJ0aWFsQW5zd2VyJykge1xuXHRcdGlmKHR5cGVvZiB0aGlzLl9wZW5kaW5nTWVzc2FnZXNbbWVzc2FnZS5pZF0uY2FsbGJhY2tfcGFydGlhbCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dmFyIGVycm9yID0gbWVzc2FnZS5lcnJvciA/IG1lc3NhZ2UuZXJyb3IgOiBudWxsO1xuXHRcdFx0dmFyIGRhdGEgPSBtZXNzYWdlLmRhdGEgPyBtZXNzYWdlLmRhdGEgOiBudWxsO1xuXHRcdFx0dGhpcy5fcGVuZGluZ01lc3NhZ2VzW21lc3NhZ2UuaWRdLmNhbGxiYWNrX3BhcnRpYWwoZXJyb3IsIGRhdGEpO1xuXHRcdH1cblx0fSBlbHNlIHtcblxuXHRcdHRoaXMuX3JlbW92ZU1lc3NhZ2UobWVzc2FnZS5pZCk7XG5cdFx0dGhpcy5fbm90aWZ5TGlzdGVuZXIoaGFuZGxlciwgbWVzc2FnZS5lcnJvciwgbWVzc2FnZS5kYXRhKTtcblx0fVxufTtcblxuRGl5YU5vZGUucHJvdG90eXBlLl9oYW5kbGVTdWJzY3JpcHRpb24gPSBmdW5jdGlvbihoYW5kbGVyLCBtZXNzYWdlKXtcblx0Ly9yZW1vdmUgc3Vic2NyaXB0aW9uIGlmIGl0IHdhcyBjbG9zZWQgZnJvbSBub2RlXG5cdGlmKG1lc3NhZ2UucmVzdWx0ID09PSBcImNsb3NlZFwiKSB7XG5cdFx0dGhpcy5fcmVtb3ZlTWVzc2FnZShtZXNzYWdlLmlkKTtcblx0XHRtZXNzYWdlLmVycm9yID0gJ1N1YnNjcmlwdGlvbkNsb3NlZCc7XG5cdH1cblx0dGhpcy5fbm90aWZ5TGlzdGVuZXIoaGFuZGxlciwgbWVzc2FnZS5lcnJvciwgbWVzc2FnZS5kYXRhID8gbWVzc2FnZS5kYXRhIDogbnVsbCk7XG59O1xuXG5EaXlhTm9kZS5wcm90b3R5cGUuX2hhbmRsZVNvY2tldFNlcnZlckRhdGEgPSBmdW5jdGlvbihtZXNzYWdlKXtcblx0XHR0aGlzLl9kaXlhU29ja2V0LmdldChtZXNzYWdlLmRhdGEuc29ja2V0SWQpLnB1c2gobmV3IEJ1ZmZlcihtZXNzYWdlLmRhdGEuYnVmZmVyLCAnYmFzZTY0JykpO1xufTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gU29ja2V0SGFuZGxlciAvL1xuLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5mdW5jdGlvbiBTb2NrZXRIYW5kbGVyKFdTb2NrZXQsIGFkZHIsIHRpbWVvdXQpIHtcblx0dmFyIHRoYXQgPSB0aGlzO1xuXHR0aGlzLmFkZHIgPSBhZGRyO1xuXG5cdGlmKFdTb2NrZXQpIHRoaXMuX1dTb2NrZXQgPSBXU29ja2V0O1xuXHRlbHNlIGlmKCF0aGlzLl9XU29ja2V0KSB0aGlzLl9XU29ja2V0ID0gd2luZG93LldlYlNvY2tldDtcblx0V1NvY2tldCA9IHRoaXMuX1dTb2NrZXQ7XG5cblx0dGhpcy5fc3RhdHVzID0gJ29wZW5pbmcnO1xuXG5cdHRyeSB7XG5cdFx0dGhpcy5fc29ja2V0ID0gYWRkci5pbmRleE9mKFwid3NzOi8vXCIpPT09MCA/IG5ldyBXU29ja2V0KGFkZHIsIHVuZGVmaW5lZCwge3JlamVjdFVuYXV0aG9yaXplZDpmYWxzZX0pIDogbmV3IFdTb2NrZXQoYWRkcik7XG5cblx0XHR0aGlzLl9zb2NrZXRPcGVuQ2FsbGJhY2sgPSB0aGlzLl9vbm9wZW4uYmluZCh0aGlzKTtcblx0XHR0aGlzLl9zb2NrZXRDbG9zZUNhbGxiYWNrID0gdGhpcy5fb25jbG9zZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuX3NvY2tldE1lc3NhZ2VDYWxsYmFjayA9IHRoaXMuX29ubWVzc2FnZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuX3NvY2tldEVycm9yQ2FsbGJhY2sgPSB0aGlzLl9vbmVycm9yLmJpbmQodGhpcyk7XG5cblx0XHR0aGlzLl9zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcignb3BlbicsIHRoaXMuX3NvY2tldE9wZW5DYWxsYmFjayk7XG5cdFx0dGhpcy5fc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2Nsb3NlJyx0aGlzLl9zb2NrZXRDbG9zZUNhbGxiYWNrKTtcblx0XHR0aGlzLl9zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMuX3NvY2tldE1lc3NhZ2VDYWxsYmFjayk7XG5cdFx0dGhpcy5fc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgdGhpcy5fc29ja2V0RXJyb3JDYWxsYmFjayk7XG5cblx0XHR0aGlzLl9zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBmdW5jdGlvbihlcnIpe1xuXHRcdFx0TG9nZ2VyLmVycm9yKFwiW1dTXSBlcnJvciA6IFwiICsgZXJyLnRvU3RyaW5nKCkpO1xuXHRcdFx0dGhhdC5fc29ja2V0LmNsb3NlKCk7XG5cdFx0fSk7XG5cblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRpZih0aGF0Ll9zdGF0dXMgPT09ICdvcGVuZWQnKSByZXR1cm47XG5cdFx0XHRpZih0aGF0Ll9zdGF0dXMgIT09ICdjbG9zZWQnKXtcblx0XHRcdFx0TG9nZ2VyLmxvZygnZDE6ICcgKyB0aGF0LmFkZHIgKyAnIHRpbWVkIG91dCB3aGlsZSBjb25uZWN0aW5nJyk7XG5cdFx0XHRcdHRoYXQuY2xvc2UoKTtcblx0XHRcdFx0dGhhdC5lbWl0KCd0aW1lb3V0JywgdGhhdC5fc29ja2V0KTtcblx0XHRcdH1cblx0XHR9LCB0aW1lb3V0KTtcblxuXHR9IGNhdGNoKGUpIHtcblx0XHRMb2dnZXIuZXJyb3IoZS5zdGFjayk7XG5cdFx0dGhhdC5jbG9zZSgpO1xuXHRcdHRocm93IGU7XG5cdH1cbn07XG5pbmhlcml0cyhTb2NrZXRIYW5kbGVyLCBFdmVudEVtaXR0ZXIpO1xuXG5Tb2NrZXRIYW5kbGVyLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuXHRpZih0aGlzLl9kaXNjb25uZWN0aW9uRGVmZXJyZWQgJiYgdGhpcy5fZGlzY29ubmVjdGlvbkRlZmVycmVkLnByb21pc2UpIHJldHVybiB0aGlzLl9kaXNjb25uZWN0aW9uRGVmZXJyZWQucHJvbWlzZTtcblx0dGhpcy5fZGlzY29ubmVjdGlvbkRlZmVycmVkID0gUS5kZWZlcigpO1xuXHR0aGlzLl9zdGF0dXMgPSAnY2xvc2luZyc7XG5cdHRoaXMuZW1pdCgnY2xvc2luZycsIHRoaXMuX3NvY2tldCk7XG5cdGlmKHRoaXMuX3NvY2tldCkgdGhpcy5fc29ja2V0LmNsb3NlKCk7XG5cdHJldHVybiB0aGlzLl9kaXNjb25uZWN0aW9uRGVmZXJyZWQucHJvbWlzZTtcbn07XG5cblNvY2tldEhhbmRsZXIucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cdHRyeSB7XG5cdFx0dmFyIGRhdGEgPSBKU09OLnN0cmluZ2lmeShtZXNzYWdlKTtcblx0fSBjYXRjaChlcnIpIHtcblx0XHRjb25zb2xlLmVycm9yKCdDYW5ub3Qgc2VyaWFsaXplIG1lc3NhZ2UnKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHR0cnkge1xuXHRcdHRoaXMuX3NvY2tldC5zZW5kKGRhdGEpO1xuXHR9IGNhdGNoKGVycil7XG5cdFx0Y29uc29sZS5lcnJvcignQ2Fubm90IHNlbmQgbWVzc2FnZScpO1xuXHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn1cblxuU29ja2V0SGFuZGxlci5wcm90b3R5cGUuaXNDb25uZWN0ZWQgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuX3NvY2tldC5yZWFkeVN0YXRlID09IHRoaXMuX1dTb2NrZXQuT1BFTiAmJiB0aGlzLl9zdGF0dXMgPT09ICdvcGVuZWQnO1xufTtcblxuU29ja2V0SGFuZGxlci5wcm90b3R5cGUuX29ub3BlbiA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLl9zdGF0dXMgPSAnb3BlbmVkJztcblx0dGhpcy5lbWl0KCdvcGVuJywgdGhpcy5fc29ja2V0KTtcbn07XG5cblNvY2tldEhhbmRsZXIucHJvdG90eXBlLl9vbmNsb3NlID0gZnVuY3Rpb24oZXZ0KSB7XG5cdHRoaXMuX3N0YXR1cyA9ICdjbG9zZWQnO1xuXHR0aGlzLnVucmVnaXN0ZXJDYWxsYmFja3MoKTtcblx0dGhpcy5lbWl0KCdjbG9zZScsIHRoaXMuX3NvY2tldCk7XG5cdGlmKHRoaXMuX2Rpc2Nvbm5lY3Rpb25EZWZlcnJlZCAmJiB0aGlzLl9kaXNjb25uZWN0aW9uRGVmZXJyZWQucHJvbWlzZSkgdGhpcy5fZGlzY29ubmVjdGlvbkRlZmVycmVkLnJlc29sdmUoKTtcbn07XG5cblNvY2tldEhhbmRsZXIucHJvdG90eXBlLl9vbm1lc3NhZ2UgPSBmdW5jdGlvbihldnQpIHtcblx0dHJ5IHtcblx0XHR2YXIgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZ0LmRhdGEpO1xuXHRcdHRoaXMuZW1pdCgnbWVzc2FnZScsIG1lc3NhZ2UpO1xuXHR9IGNhdGNoKGVycil7XG5cdFx0TG9nZ2VyLmVycm9yKFwiW1dTXSBjYW5ub3QgcGFyc2UgbWVzc2FnZSwgZHJvcHBpbmcuLi5cIik7XG5cdFx0dGhyb3cgZXJyO1xuXHR9XG59O1xuXG5Tb2NrZXRIYW5kbGVyLnByb3RvdHlwZS5fb25lcnJvciA9IGZ1bmN0aW9uKGV2dCkge1xuXHR0aGlzLmVtaXQoJ2Vycm9yJywgZXZ0KTtcbn07XG5cblNvY2tldEhhbmRsZXIucHJvdG90eXBlLnVucmVnaXN0ZXJDYWxsYmFja3MgPSBmdW5jdGlvbigpIHtcblx0aWYodGhpcy5fc29ja2V0ICYmICh0eXBlb2YgdGhpcy5fc29ja2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIgPT09ICdmdW5jdGlvbicpKXtcblx0XHR0aGlzLl9zb2NrZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignb3BlbicsIHRoaXMuX3NvY2tldE9wZW5DYWxsYmFjayk7XG5cdFx0dGhpcy5fc29ja2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Nsb3NlJywgdGhpcy5fc29ja2V0Q2xvc2VDYWxsYmFjayk7XG5cdFx0dGhpcy5fc29ja2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCB0aGlzLl9zb2NrZXRNZXNzYWdlQ2FsbGJhY2spO1xuXHR9IGVsc2UgaWYodGhpcy5fc29ja2V0ICYmICh0eXBlb2YgdGhpcy5fc29ja2V0LnJlbW92ZUFsbExpc3RlbmVycyA9PT0gJ2Z1bmN0aW9uJykpe1xuXHRcdHRoaXMuX3NvY2tldC5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcblx0fVxufTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIFV0aWxpdHkgbWV0aG9kcyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5EaXlhTm9kZS5wcm90b3R5cGUuX2NyZWF0ZU1lc3NhZ2UgPSBmdW5jdGlvbihwYXJhbXMsIHR5cGUpe1xuXHRpZighcGFyYW1zIHx8ICF0eXBlIHx8ICh0eXBlICE9PSBcIlJlcXVlc3RcIiAmJiB0eXBlICE9PSBcIlN1YnNjcmlwdGlvblwiICYmIHR5cGUgIT09IFwiVW5zdWJzY3JpYmVcIiAmJiB0eXBlICE9PSBcIlNvY2tldENsaWVudERhdGFcIikpe1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHR0eXBlOiB0eXBlLFxuXHRcdGlkOiB0aGlzLl9nZW5lcmF0ZUlkKCksXG5cdFx0c2VydmljZTogcGFyYW1zLnNlcnZpY2UsXG5cdFx0dGFyZ2V0OiBwYXJhbXMudGFyZ2V0LFxuXHRcdGZ1bmM6IHBhcmFtcy5mdW5jLFxuXHRcdG9iajogcGFyYW1zLm9iaixcblx0XHRkYXRhOiBwYXJhbXMuZGF0YSxcblx0XHRidXM6IHBhcmFtcy5idXMsXG5cdH07XG59O1xuXG5EaXlhTm9kZS5wcm90b3R5cGUuX2dlbmVyYXRlSWQgPSBmdW5jdGlvbigpe1xuXHR2YXIgaWQgPSB0aGlzLl9uZXh0SWQ7XG5cdHRoaXMuX25leHRJZCsrO1xuXHRyZXR1cm4gaWQ7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBEaXlhTm9kZTtcbiIsInZhciBpc0Jyb3dzZXIgPSAhKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKTtcbmlmKCFpc0Jyb3dzZXIpIHsgdmFyIFEgPSByZXF1aXJlKCdxJyk7IH1cbmVsc2UgeyB2YXIgUSA9IHdpbmRvdy5ROyB9XG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnbm9kZS1ldmVudC1lbWl0dGVyJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgRGl5YU5vZGUgPSByZXF1aXJlKCcuL0RpeWFOb2RlJyk7XG5cbnZhciBJUF9SRUdFWCA9IC9eKDI1WzAtNV18MlswLTRdWzAtOV18WzAxXT9bMC05XVswLTldPylcXC4oMjVbMC01XXwyWzAtNF1bMC05XXxbMDFdP1swLTldWzAtOV0/KVxcLigyNVswLTVdfDJbMC00XVswLTldfFswMV0/WzAtOV1bMC05XT8pXFwuKDI1WzAtNV18MlswLTRdWzAtOV18WzAxXT9bMC05XVswLTldPykkLztcblxuLy8vLy8vLy8vLy8vLy9cbi8vICBEMSBBUEkgIC8vXG4vLy8vLy8vLy8vLy8vL1xuXG5cblxuZnVuY3Rpb24gbmV3SW5zdGFuY2UgKCkge1xuXG5cdHZhciBjb25uZWN0aW9uID0gbmV3IERpeWFOb2RlKCk7XG5cblx0dmFyIGQxaW5zdCA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuXHRcdHJldHVybiBuZXcgRGl5YVNlbGVjdG9yKHNlbGVjdG9yLCBjb25uZWN0aW9uKTtcblx0fVxuXG5cdGNvbm5lY3Rpb24uX2QxaW5zdCA9IGQxaW5zdFxuXG5cdGQxaW5zdC5EaXlhTm9kZSA9IERpeWFOb2RlO1xuXHRkMWluc3QuRGl5YVNlbGVjdG9yID0gRGl5YVNlbGVjdG9yO1xuXG5cdGQxaW5zdC5jb25uZWN0ID0gZnVuY3Rpb24oYWRkciwgV1NvY2tldCl7XG5cdFx0cmV0dXJuIGNvbm5lY3Rpb24uY29ubmVjdChhZGRyLCBXU29ja2V0KTtcblx0fTtcblxuXHRkMWluc3QuZGlzY29ubmVjdCA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGNvbm5lY3Rpb24uZGlzY29ubmVjdCgpO1xuXHR9O1xuXG5cdGQxaW5zdC5pc0Nvbm5lY3RlZCA9IGZ1bmN0aW9uKCkge1x0cmV0dXJuIGNvbm5lY3Rpb24uaXNDb25uZWN0ZWQoKTt9O1xuXHRkMWluc3QucGVlcnMgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGNvbm5lY3Rpb24ucGVlcnMoKTt9O1xuXHRkMWluc3Quc2VsZiA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29ubmVjdGlvbi5zZWxmKCk7IH07XG5cdGQxaW5zdC5hZGRyID0gZnVuY3Rpb24oKSB7IHJldHVybiBjb25uZWN0aW9uLmFkZHIoKTsgfTtcblx0ZDFpbnN0LnVzZXIgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGNvbm5lY3Rpb24udXNlcigpOyB9O1xuXHRkMWluc3QucGFzcyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29ubmVjdGlvbi5wYXNzKCk7IH07XG5cdGQxaW5zdC5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGNvbm5lY3Rpb24uYXV0aGVudGljYXRlZCgpOyB9O1xuXG5cdGQxaW5zdC5wYXJzZVBlZXIgPSBmdW5jdGlvbihhZGRyU3RyKSB7XG5cdFx0dmFyIHBlZXIgPSB7fTtcblxuXHRcdC8vIDxub3RoaW5nPiAtPiB3c3M6Ly9sb2NhbGhvc3QvYXBpXG5cdFx0aWYoIWFkZHJTdHIgfHwgYWRkclN0ciA9PT0gXCJcIikge1xuXHRcdFx0cGVlci5hZGRyID0gXCJ3c3M6Ly9sb2NhbGhvc3QvYXBpXCI7XG5cdFx0XHRwZWVyLmFkZHJOZXQgPSBcIndzczovL2xvY2FsaG9zdC9uZXRcIjtcblx0XHR9XG5cdFx0Ly8gMTIzNCAtPiB3czovL2xvY2FsaG9zdDoxMjM0XG5cdFx0ZWxzZSBpZigvXlswLTldKiQvLnRlc3QoYWRkclN0cikpIHtcblx0XHRcdHBlZXIuYWRkciA9IFwid3M6Ly9sb2NhbGhvc3Q6XCIrYWRkclN0cjtcblx0XHR9XG5cdFx0Ly8gJ2xvY2FsaG9zdCcgYWxvbmUgLT4gVU5JWCBzb2NrZXQgL3Zhci9ydW4vZGl5YS9kaXlhLW5vZGUuc29ja1xuXHRcdGVsc2UgaWYgKGFkZHJTdHIgPT09ICdsb2NhbGhvc3QnKSB7XG5cdFx0XHRwZWVyLmFkZHIgPSAndW5peDovLy92YXIvcnVuL2RpeWEvZGl5YS1ub2RlLnNvY2snXG5cdFx0fVxuXHRcdC8vIDEwLjQyLjAuMSAtPiB3c3M6Ly8xMC40Mi4wLjEvYXBpXG5cdFx0Ly8gICAgICAgICAgLT4gd3NzOi8vMTAuMjQuMC4xL25ldFxuXHRcdGVsc2UgaWYgKElQX1JFR0VYLnRlc3QoYWRkclN0cikpIHtcblx0XHRcdHBlZXIuYWRkciA9IFwid3NzOi8vXCIrYWRkclN0citcIi9hcGlcIjtcblx0XHRcdHBlZXIuYWRkck5ldCA9IFwid3NzOi8vXCIrYWRkclN0citcIi9uZXRcIjtcblx0XHR9XG5cdFx0Ly8gMTAuNDIuMC4xOjEyMzQgLT4gd3M6Ly8xMC40Mi4wLjE6MTIzNFxuXHQgICAgICAgXHRlbHNlIGlmIChJUF9SRUdFWC50ZXN0KGFkZHJTdHIuc3BsaXQoJzonKVswXSkgJiYgL15bMC05XSokLy50ZXN0KGFkZHJTdHIuc3BsaXQoJzonKVsxXSkpIHtcblx0XHRcdHBlZXIuYWRkciA9IFwid3M6Ly9cIithZGRyU3RyO1xuXHRcdH1cblx0XHQvLyB3c3M6Ly9zb21lYWRkcmVzcy5jb20vc3R1ZmYgLT4gd3NzOi8vc29tZWFkZHJlc3MuY29tL3N0dWZmXG5cdFx0Ly8gd3M6Ly9zb21lYWRkcmVzcy5jb20vc3R1ZmYgLT4gd3M6Ly9zb21lYWRkcmVzcy5jb20vc3R1ZmZcblx0XHRlbHNlIGlmIChhZGRyU3RyLmluZGV4T2YoXCJ3c3M6Ly9cIikgPT09IDAgfHwgYWRkclN0ci5pbmRleE9mKFwid3M6Ly9cIikgPT09IDApIHtcblx0XHRcdHBlZXIuYWRkciA9IGFkZHJTdHI7XG5cdFx0fVxuXHRcdC8vIHNvbWVkb21haW4vc29tZXNpdGUgLT4gXCJ3c3M6Ly9zb21lZG9tYWluL3NvbWVzaXRlL2FwaVxuXHRcdC8vICAgICAgICAgICAgICAgICAgICAgLT4gXCJ3c3M6Ly9zb21lZG9tYWluL3NvbWVzaXRlL25ldFxuXHRcdC8vICAgICAgICAgICAgICAgICAgICAgLT4gc29tZXNpdGVcblx0XHRlbHNlIGlmKGFkZHJTdHIuc3BsaXQoJy8nKS5sZW5ndGggPT09IDIpIHtcblx0XHRcdHBlZXIuYWRkciA9IFwid3NzOi8vXCIgKyBhZGRyU3RyICsgJy9hcGknO1xuXHRcdFx0cGVlci5hZGRyTmV0ID0gXCJ3c3M6Ly9cIiArIGFkZHJTdHIgKyAnL25ldCc7XG5cdFx0XHRwZWVyLm5hbWUgPSBhZGRyU3RyLnNwbGl0KCcvJylbMV07XG5cdFx0fVxuXHRcdC8vIHNvbWVkb21haW4vc29tZXNpdGUvYXBpIC0+IFwid3NzOi8vc29tZWRvbWFpbi9zb21lc2l0ZS9hcGlcIlxuXHRcdC8vICAgICAgICAgICAgICAgICAgICAgICAgIC0+IFwid3NzOi8vc29tZWRvbWFpbi9zb21lc2l0ZS9uZXRcIlxuXHRcdC8vICAgICAgICAgICAgICAgICAgICAgICAgIC0+IHNvbWVzaXRlXG5cdFx0ZWxzZSBpZihhZGRyU3RyLnNwbGl0KCcvJykubGVuZ3RoID09PSAzICYmIGFkZHJTdHIuc3BsaXQoJy8nKVsyXSA9PT0gXCJhcGlcIikge1xuXHRcdFx0cGVlci5hZGRyID0gXCJ3c3M6Ly9cIithZGRyU3RyO1xuXHRcdFx0cGVlci5hZGRyTmV0ID0gXCJ3c3M6Ly9cIithZGRyU3RyLnN1YnN0cigwLCBhZGRyU3RyLmxlbmd0aCAtIDQpO1xuXHRcdFx0cGVlci5uYW1lID0gYWRkclN0ci5zcGxpdCgnLycpWzFdO1xuXHRcdH1cblx0XHQvLyBzb21lc2l0ZSAtPiBcIndzczovL3BhcnRuZXJpbmctY2xvdWQuY29tL3NvbWVzaXRlL2FwaVwiXG5cdFx0Ly8gICAgICAgICAgLT4gXCJ3c3M6Ly9wYXJ0bmVyaW5nLWNsb3VkLmNvbS9zb21lc2l0ZS9uZXRcIlxuXHRcdC8vICAgICAgICAgIC0+IHNvbWVzaXRlXG5cdFx0ZWxzZSB7XG5cdFx0XHRwZWVyLmFkZHIgPSBcIndzczovL3BhcnRuZXJpbmctY2xvdWQuY29tL1wiK2FkZHJTdHIrXCIvYXBpXCI7XG5cdFx0XHRwZWVyLmFkZHJOZXQgPSBcIndzczovL3BhcnRuZXJpbmctY2xvdWQuY29tL1wiK2FkZHJTdHIrXCIvbmV0XCI7XG5cdFx0XHRwZWVyLm5hbWUgPSBhZGRyU3RyO1xuXHRcdH1cblxuXHRcdHJldHVybiBwZWVyO1xuXHR9O1xuXG5cblx0LyoqIFRyeSB0byBjb25uZWN0IHRvIHRoZSBnaXZlbiBzZXJ2ZXJzIGxpc3QgaW4gdGhlIGxpc3Qgb3JkZXIsIHVudGlsIGZpbmRpbmcgYW4gYXZhaWxhYmxlIG9uZSAqL1xuXHRkMWluc3QudHJ5Q29ubmVjdCA9IGZ1bmN0aW9uKHNlcnZlcnMsIFdTb2NrZXQpe1xuXHRcdHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcblx0XHRmdW5jdGlvbiB0YyhpKSB7XG5cdFx0XHRkMWluc3QuY29ubmVjdChzZXJ2ZXJzW2ldLCBXU29ja2V0KS50aGVuKGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRyZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShzZXJ2ZXJzW2ldKTtcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRkMWluc3QuZGlzY29ubmVjdCgpLnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aSsrO1xuXHRcdFx0XHRcdGlmKGk8c2VydmVycy5sZW5ndGgpIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7dGMoaSk7fSwgMTAwKTtcblx0XHRcdFx0XHRlbHNlIHJldHVybiBkZWZlcnJlZC5yZWplY3QoXCJUaW1lb3V0XCIpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHR0YygwKTtcblx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcblx0fVxuXG5cdGQxaW5zdC5jdXJyZW50U2VydmVyID0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gY29ubmVjdGlvbi5fYWRkcjtcblx0fTtcblxuXHRkMWluc3Qub24gPSBmdW5jdGlvbihldmVudCwgY2FsbGJhY2spe1xuXHRcdGNvbm5lY3Rpb24ub24oZXZlbnQsIGNhbGxiYWNrKTtcblx0XHRyZXR1cm4gZDFpbnN0O1xuXHR9O1xuXG5cdGQxaW5zdC5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBjYWxsYmFjayl7XG5cdFx0Y29ubmVjdGlvbi5yZW1vdmVMaXN0ZW5lcihldmVudCwgY2FsbGJhY2spO1xuXHRcdHJldHVybiBkMWluc3Q7XG5cdH07XG5cblx0LyoqIFNob3J0aGFuZCBmdW5jdGlvbiB0byBjb25uZWN0IGFuZCBsb2dpbiB3aXRoIHRoZSBnaXZlbiAodXNlcixwYXNzd29yZCkgKi9cblx0ZDFpbnN0LmNvbm5lY3RBc1VzZXIgPSBmdW5jdGlvbihpcCwgdXNlciwgcGFzc3dvcmQsIFdTb2NrZXQpIHtcblx0XHRyZXR1cm4gZDFpbnN0LmNvbm5lY3QoaXAsIFdTb2NrZXQpLnRoZW4oZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBkMWluc3QoXCIjc2VsZlwiKS5hdXRoKHVzZXIsIHBhc3N3b3JkKTtcblx0XHR9KTtcblx0fTtcblxuXHRkMWluc3QuZGVhdXRoZW50aWNhdGUgPSBmdW5jdGlvbigpeyBjb25uZWN0aW9uLmF1dGhlbnRpY2F0ZWQoZmFsc2UpOyBjb25uZWN0aW9uLnVzZXIobnVsbCk7IGNvbm5lY3Rpb24ucGFzcyhudWxsKTt9O1xuXHRkMWluc3Quc2V0U2VjdXJlZCA9IGZ1bmN0aW9uKGJTZWN1cmVkKSB7IGNvbm5lY3Rpb24uc2V0U2VjdXJlZChiU2VjdXJlZCk7IH07XG5cdGQxaW5zdC5pc1NlY3VyZWQgPSBmdW5jdGlvbigpIHtyZXR1cm4gY29ubmVjdGlvbi5fc2VjdXJlZDsgfVxuXHRkMWluc3Quc2V0V1NvY2tldCA9IGZ1bmN0aW9uKFdTb2NrZXQpIHsgY29ubmVjdGlvbi5zZXRXU29ja2V0KFdTb2NrZXQpOyB9XG5cblx0cmV0dXJuIGQxaW5zdDtcbn1cblxudmFyIGQxID0gbmV3SW5zdGFuY2UoKTtcbmQxLm5ld0luc3RhbmNlID0gbmV3SW5zdGFuY2U7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIERpeWFTZWxlY3RvciAvL1xuLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIERpeWFTZWxlY3RvcihzZWxlY3RvciwgY29ubmVjdGlvbil7XG5cdEV2ZW50RW1pdHRlci5jYWxsKHRoaXMpO1xuXG5cdHRoaXMuX2Nvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuXHR0aGlzLl9zZWxlY3RvciA9IHNlbGVjdG9yO1xuXHR0aGlzLl9saXN0ZW5lckNvdW50ID0gMDtcblx0dGhpcy5fbGlzdGVuQ2FsbGJhY2sgPSBudWxsO1xuXHR0aGlzLl9jYWxsYmFja0F0dGFjaGVkID0gZmFsc2U7XG59XG5pbmhlcml0cyhEaXlhU2VsZWN0b3IsIEV2ZW50RW1pdHRlcik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyBQdWJsaWMgQVBJIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5EaXlhU2VsZWN0b3IucHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fc2VsZWN0KCk7IH07XG5cblxuXG4vKipcbiAqIEFwcGx5IGNhbGxiYWNrIGNiIHRvIGVhY2ggc2VsZWN0ZWQgcGVlci4gUGVlcnMgYXJlIHNlbGVjdGVkXG4gKiBhY2NvcmRpbmcgdG8gdGhlIHJ1bGUgJ3NlbGVjdG9yJyBnaXZlbiB0byBjb25zdHJ1Y3Rvci4gU2VsZWN0b3IgY2FuXG4gKiBiZSBhIHBlZXJJZCwgYSByZWdFeCBmb3IgcGVlcklkcyBvZiBhbiBhcnJheSBvZiBwZWVySWRzLlxuICogQHBhcmFtcyBcdGNiXHRcdGNhbGxiYWNrIHRvIGJlIGFwcGxpZWRcbiAqIEByZXR1cm4gXHR0aGlzIFx0PERpeWFTZWxlY3Rvcj5cbiAqL1xuRGl5YVNlbGVjdG9yLnByb3RvdHlwZS5lYWNoID0gZnVuY3Rpb24oY2Ipe1xuXHR2YXIgcGVlcnMgPSB0aGlzLl9zZWxlY3QoKTtcblx0Zm9yKHZhciBpPTA7IGk8cGVlcnMubGVuZ3RoOyBpKyspIGNiLmJpbmQodGhpcykocGVlcnNbaV0pO1xuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2VuZCByZXF1ZXN0IHRvIHNlbGVjdGVkIHBlZXJzICggc2VlIGVhY2goKSApIHRocm91Z2ggdGhlIGN1cnJlbnQgY29ubmVjdGlvbiAoRGl5YU5vZGUpLlxuICogQHBhcmFtIHtTdHJpbmcgfCBPYmplY3R9IHBhcmFtcyA6IGNhbiBiZSBzZXJ2aWNlLmZ1bmN0aW9uIG9yIHtzZXJ2aWNlOnNlcnZpY2UsIGZ1bmM6ZnVuY3Rpb24sIC4uLn1cbiAqL1xuRGl5YVNlbGVjdG9yLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24ocGFyYW1zLCBjYWxsYmFjaywgdGltZW91dCwgb3B0aW9ucyl7XG5cdGlmKCF0aGlzLl9jb25uZWN0aW9uKSByZXR1cm4gdGhpcztcblx0aWYoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcblx0aWYocGFyYW1zLmNvbnN0cnVjdG9yID09PSBTdHJpbmcpIHtcblx0XHR2YXIgX3BhcmFtcyA9IHBhcmFtcy5zcGxpdChcIi5cIik7XG5cdFx0aWYoX3BhcmFtcy5sZW5ndGghPTIpIHRocm93ICdNYWxmb3JtZWRSZXF1ZXN0Jztcblx0XHRwYXJhbXMgPSB7c2VydmljZTpfcGFyYW1zWzBdLCBmdW5jOl9wYXJhbXNbMV19O1xuXHR9XG5cblx0dmFyIG5iQW5zd2VycyA9IDA7XG5cdHZhciBuYkV4cGVjdGVkID0gdGhpcy5fc2VsZWN0KCkubGVuZ3RoO1xuXHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKHBlZXJJZCl7XG5cdFx0cGFyYW1zLnRhcmdldCA9IHBlZXJJZDtcblxuXHRcdHZhciBvcHRzID0ge307XG5cdFx0Zm9yKHZhciBpIGluIG9wdGlvbnMpIG9wdHNbaV0gPSBvcHRpb25zW2ldO1xuXHRcdGlmKHR5cGVvZiBvcHRzLmNhbGxiYWNrX3BhcnRpYWwgPT09ICdmdW5jdGlvbicpIG9wdHMuY2FsbGJhY2tfcGFydGlhbCA9IGZ1bmN0aW9uKGVyciwgZGF0YSl7IG9wdGlvbnMuY2FsbGJhY2tfcGFydGlhbChwZWVySWQsIGVyciwgZGF0YSk7fVxuXG5cdFx0dGhpcy5fY29ubmVjdGlvbi5yZXF1ZXN0KHBhcmFtcywgZnVuY3Rpb24oZXJyLCBkYXRhKXtcblx0XHRcdGlmKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2socGVlcklkLCBlcnIsIGRhdGEpO1xuXHRcdFx0bmJBbnN3ZXJzKys7XG5cdFx0XHRpZihuYkFuc3dlcnMgPT0gbmJFeHBlY3RlZCAmJiBvcHRpb25zLmJOb3RpZnlXaGVuRmluaXNoZWQpIGNhbGxiYWNrKG51bGwsIGVyciwgXCIjI0VORCMjXCIpOyAvLyBUT0RPIDogRmluZCBhIGJldHRlciB3YXkgdG8gbm90aWZ5IHJlcXVlc3QgRU5EICEhXG5cdFx0fSwgdGltZW91dCwgb3B0cyk7XG5cdH0pO1xufTtcblxuXG4vLyBJTVBPUlRBTlQgISEhIEJ5IDMwLzExLzE1LCB0aGlzIG1ldGhvZCBkb2Vzbid0IHJldHVybiAndGhpcycgYW55bW9yZSwgYnV0IGEgU3Vic2NyaXB0aW9uIG9iamVjdCBpbnN0ZWFkXG4vKiBAcGFyYW0ge1N0cmluZyB8IE9iamVjdH0gcGFyYW1zIDogY2FuIGJlICdzZXJ2aWNlLmZ1bmN0aW9uJyBvciB7c2VydmljZTpzZXJ2aWNlLCBmdW5jOmZ1bmN0aW9uLCAuLi59ICovXG5EaXlhU2VsZWN0b3IucHJvdG90eXBlLnN1YnNjcmliZSA9IGZ1bmN0aW9uKHBhcmFtcywgY2FsbGJhY2ssIG9wdGlvbnMpe1xuXHRpZihwYXJhbXMuY29uc3RydWN0b3IgPT09IFN0cmluZykge1xuXHRcdHZhciBfcGFyYW1zID0gcGFyYW1zLnNwbGl0KFwiLlwiKTtcblx0XHRpZihfcGFyYW1zLmxlbmd0aCE9MikgdGhyb3cgJ01hbGZvcm1lZFN1YnNjcmlwdGlvbic7XG5cdFx0cGFyYW1zID0ge3NlcnZpY2U6X3BhcmFtc1swXSwgZnVuYzpfcGFyYW1zWzFdfTtcblx0fVxuXG5cdHJldHVybiBuZXcgU3Vic2NyaXB0aW9uKHRoaXMsIHBhcmFtcywgY2FsbGJhY2ssIG9wdGlvbnMpO1xufTtcblxuXG4vLyBJTVBPUlRBTlQgISEhIEJZIDMwLzExLzE1LCB0aGlzIG1ldGhvZCBkb2Vzbid0IHRha2Ugc3ViSWRzIGFzIGlucHV0IGFueW1vcmUuXG4vLyBQbGVhc2UgcHJvdmlkZSBhIHN1YnNjcmlwdGlvbiBpbnN0ZWFkICFcbkRpeWFTZWxlY3Rvci5wcm90b3R5cGUudW5zdWJzY3JpYmUgPSBmdW5jdGlvbihzdWJzY3JpcHRpb24pe1xuXHRpZihBcnJheS5pc0FycmF5KHN1YnNjcmlwdGlvbikgfHwgIXN1YnNjcmlwdGlvbi5jbG9zZSkgcmV0dXJuIHRoaXMuX19vbGRfZGVwcmVjYXRlZF91bnN1YnNjcmliZShzdWJzY3JpcHRpb24pO1xuXHRyZXR1cm4gc3Vic2NyaXB0aW9uLmNsb3NlKCk7XG59O1xuXG5EaXlhU2VsZWN0b3IucHJvdG90eXBlLmF1dGggPSBmdW5jdGlvbih1c2VyLCBwYXNzd29yZCwgY2FsbGJhY2ssIHRpbWVvdXQpe1xuXHR2YXIgdGhhdCA9IHRoaXM7XG5cdGlmKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2sgPSBjYWxsYmFjay5iaW5kKHRoaXMpO1xuXG5cdHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcblxuXHR0aGlzLnJlcXVlc3Qoe1xuXHRcdHNlcnZpY2U6ICdhdXRoJyxcblx0XHRmdW5jOiAnQXV0aGVudGljYXRlJyxcblx0XHRkYXRhOiB7XG5cdFx0XHR1c2VyOiB1c2VyLCAvLyBERVBSRUNBVEVELCBrZXB0IGZvciBub3cgZm9yIGJhY2t3YXJkIGNvbXBhdGlibGl0eSAod2lsbCBiZSBkcm9wcGVkKVxuXHRcdFx0dXNlcm5hbWU6IHVzZXIsIC8vIE5ldyBzeW50YXggc2luY2Ugc3dpdGNoaW5nIHRvIERCdXNcblx0XHRcdHBhc3N3b3JkOiBwYXNzd29yZFxuXHRcdH1cblx0fSwgZnVuY3Rpb24ocGVlcklkLCBlcnIsIGRhdGEpe1xuXG5cdFx0aWYoZXJyID09PSAnU2VydmljZU5vdEZvdW5kJyl7XG5cdFx0XHRpZih0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKHBlZXJJZCwgdHJ1ZSk7XG5cdFx0XHRlbHNlIGRlZmVycmVkLnJlamVjdChlcnIpO1xuXHRcdFx0cmV0dXJuIDtcblx0XHR9XG5cblx0XHQvLyBkYXRhLmF1dGhlbnRpY2F0ZWQgaXMgREVQUkVDQVRFRCwga2VwdCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuXHRcdGlmKCFlcnIgJiYgZGF0YSAmJiAoZGF0YSA9PT0gdHJ1ZSB8fCBkYXRhLmF1dGhlbnRpY2F0ZWQgPT09IHRydWUpKXtcblx0XHRcdHRoYXQuX2Nvbm5lY3Rpb24uYXV0aGVudGljYXRlZCh0cnVlKTtcblx0XHRcdHRoYXQuX2Nvbm5lY3Rpb24udXNlcih1c2VyKTtcblx0XHRcdHRoYXQuX2Nvbm5lY3Rpb24ucGFzcyhwYXNzd29yZCk7XG5cdFx0XHRpZih0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKHBlZXJJZCwgdHJ1ZSk7XG5cdFx0XHRlbHNlIGRlZmVycmVkLnJlc29sdmUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhhdC5fY29ubmVjdGlvbi5hdXRoZW50aWNhdGVkKGZhbHNlKTtcblx0XHRcdGlmKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2socGVlcklkLCBmYWxzZSk7XG5cdFx0XHRlbHNlIGRlZmVycmVkLnJlamVjdCgnQWNjZXNzRGVuaWVkJyk7XG5cdFx0fVxuXG5cdH0sIHRpbWVvdXQpO1xuXG5cdHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuRGl5YVNlbGVjdG9yLnByb3RvdHlwZS5vcGVuU29ja2V0ID0gZnVuY3Rpb24gKHBhcmFtcywgY2FsbGJhY2spIHtcblx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrID0gY2FsbGJhY2suYmluZCh0aGlzKTtcblxuXHR2YXIgc29ja2V0TmFtZSA9IHBhcmFtcztcblxuXHR0aGlzLnJlcXVlc3Qoe1xuXHRcdHNlcnZpY2U6ICdzb2NrZXRIYW5kbGVyJyxcblx0XHRmdW5jOiAnT3BlblNvY2tldCcsXG5cdFx0ZGF0YToge1xuXHRcdFx0c29ja2V0X25hbWU6IHNvY2tldE5hbWUsXG5cdFx0fVxuXHR9LCBmdW5jdGlvbiAocGVlcklkLCBlcnIsIGRhdGEpIHtcblx0XHRpZiAoZXJyID09IG51bGwgJiYgZGF0YS5zb2NrZXRfaWQgIT0gbnVsbCkge1xuXHRcdFx0cGFyYW1zID0ge1xuXHRcdFx0XHRlcnI6IGVycixcblx0XHRcdFx0c29ja2V0SWQ6IGRhdGEuc29ja2V0X2lkLFxuXHRcdFx0XHRzb2NrZXROYW1lOiBzb2NrZXROYW1lLFxuXHRcdFx0XHR0YXJnZXQ6IHBlZXJJZCxcblx0XHRcdH1cblx0XHRcdHRoYXQuX2Nvbm5lY3Rpb24ub3BlblNvY2tldCh0aGF0LCBwYXJhbXMsIChkaXlhU29ja2V0KSA9PiB7XG5cdFx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKHBlZXJJZCwgbnVsbCwgZGl5YVNvY2tldCk7XG5cdFx0XHR9KTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjayhwZWVySWQsIGVyciwgbnVsbCk7XG5cdFx0fVxuXHR9KTtcbn07XG5cbkRpeWFTZWxlY3Rvci5wcm90b3R5cGUuc2VuZFNvY2tldERhdGEgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKHBlZXJJZCkge1xuXHRcdHBhcmFtcy50YXJnZXQgPSBwZWVySWQ7XG5cdFx0dGhpcy5fY29ubmVjdGlvbi5zZW5kU29ja2V0RGF0YShwYXJhbXMpO1xuXHR9KTtcbn07XG5cbkRpeWFTZWxlY3Rvci5wcm90b3R5cGUub25Tb2NrZXRDbG9zZWQgPSBmdW5jdGlvbihzb2NrZXRJZCl7XG5cdHRoaXMuX2Nvbm5lY3Rpb24ub25Tb2NrZXRDbG9zZWQoc29ja2V0SWQpO1xufVxuXG4vLyBQcml2YXRlc1xuXG5EaXlhU2VsZWN0b3IucHJvdG90eXBlLl9zZWxlY3QgPSBmdW5jdGlvbihzZWxlY3RvckZ1bmN0aW9uKXtcblx0dmFyIHRoYXQgPSB0aGlzO1xuXG5cdGlmKCF0aGlzLl9jb25uZWN0aW9uKSByZXR1cm4gW107XG5cdHJldHVybiB0aGlzLl9jb25uZWN0aW9uLnBlZXJzKCkuZmlsdGVyKGZ1bmN0aW9uKHBlZXJJZCl7XG5cdFx0cmV0dXJuIHRoYXQuX21hdGNoKHRoYXQuX3NlbGVjdG9yLCBwZWVySWQpO1xuXHR9KTtcbn07XG5cbkRpeWFTZWxlY3Rvci5wcm90b3R5cGUuX21hdGNoID0gZnVuY3Rpb24oc2VsZWN0b3IsIHN0cil7XG5cdGlmKCFzZWxlY3RvcikgcmV0dXJuIGZhbHNlO1xuXHRpZihzZWxlY3RvciA9PT0gXCIjc2VsZlwiKSB7IHJldHVybiB0aGlzLl9jb25uZWN0aW9uICYmIHN0ciA9PT0gdGhpcy5fY29ubmVjdGlvbi5zZWxmKCk7IH1cblx0ZWxzZSBpZihzZWxlY3Rvci5ub3QpIHJldHVybiAhdGhpcy5fbWF0Y2goc2VsZWN0b3Iubm90LCBzdHIpO1xuXHRlbHNlIGlmKHNlbGVjdG9yLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdTdHJpbmcnKXtcblx0XHRyZXR1cm4gbWF0Y2hTdHJpbmcoc2VsZWN0b3IsIHN0cik7XG5cdH0gZWxzZSBpZihzZWxlY3Rvci5jb25zdHJ1Y3Rvci5uYW1lID09PSAnUmVnRXhwJyl7XG5cdFx0cmV0dXJuIG1hdGNoUmVnRXhwKHNlbGVjdG9yLCBzdHIpO1xuXHR9IGVsc2UgaWYoQXJyYXkuaXNBcnJheShzZWxlY3Rvcikpe1xuXHRcdHJldHVybiBtYXRjaEFycmF5KHNlbGVjdG9yLCBzdHIpO1xuXHR9XG5cdHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hTdHJpbmcoc2VsZWN0b3IsIHN0cil7XG5cdHJldHVybiBzZWxlY3RvciA9PT0gc3RyO1xufVxuXG5mdW5jdGlvbiBtYXRjaFJlZ0V4cChzZWxlY3Rvciwgc3RyKXtcblx0cmV0dXJuIHN0ci5tYXRjaChzZWxlY3Rvcik7XG59XG5cbmZ1bmN0aW9uIG1hdGNoQXJyYXkoc2VsZWN0b3IsIHN0cil7XG5cdGZvcih2YXIgaT0wO2k8c2VsZWN0b3IubGVuZ3RoOyBpKyspe1xuXHRcdGlmKHNlbGVjdG9yW2ldID09PSBzdHIpIHJldHVybiB0cnVlO1xuXHR9XG5cdHJldHVybiBmYWxzZTtcbn1cblxuLy8gT3ZlcnJpZGVzIEV2ZW50RW1pdHRlcidzIGJlaGF2aW9yIHRvIHByb3h5IGFuZCBmaWx0ZXIgZXZlbnRzIGZyb20gdGhlIGNvbm5lY3Rpb25cbkRpeWFTZWxlY3Rvci5wcm90b3R5cGUuX29uID0gRGl5YVNlbGVjdG9yLnByb3RvdHlwZS5vbjtcbkRpeWFTZWxlY3Rvci5wcm90b3R5cGUub24gPSBmdW5jdGlvbih0eXBlLCBjYWxsYmFjayl7XG5cdHZhciB0aGF0ID0gdGhpcztcblx0Y2FsbGJhY2suX19fRGl5YVNlbGVjdG9yX2hpZGRlbl93cmFwcGVyID0gZnVuY3Rpb24ocGVlcklkKSB7XG5cdFx0aWYodGhhdC5fbWF0Y2godGhhdC5fc2VsZWN0b3IsIHBlZXJJZCkpIHRoYXQuZW1pdCh0eXBlLCBwZWVySWQpO1xuXHR9O1xuXHR0aGlzLl9jb25uZWN0aW9uLm9uKHR5cGUsIGNhbGxiYWNrLl9fX0RpeWFTZWxlY3Rvcl9oaWRkZW5fd3JhcHBlcik7XG5cdHZhciByZXQgPSB0aGlzLl9vbih0eXBlLCBjYWxsYmFjayk7XG5cblx0Ly8gSGFuZGxlIHRoZSBzcGVjaWZpYyBjYXNlIG9mIFwicGVlci1jb25uZWN0ZWRcIiBldmVudHMsIGkuZS4sIG5vdGlmeSBvZiBhbHJlYWR5IGNvbm5lY3RlZCBwZWVyc1xuXHRpZih0eXBlID09PSAncGVlci1jb25uZWN0ZWQnICYmIHRoaXMuX2Nvbm5lY3Rpb24uaXNDb25uZWN0ZWQoKSkge1xuXHRcdHZhciBwZWVycyA9IHRoaXMuX2Nvbm5lY3Rpb24ucGVlcnMoKTtcblx0XHRmb3IodmFyIGk9MDtpPHBlZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZih0aGlzLl9tYXRjaCh0aGlzLl9zZWxlY3RvciwgcGVlcnNbaV0pKSBjYWxsYmFjayhwZWVyc1tpXSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXQ7XG59O1xuXG5cbi8vIE92ZXJyaWRlcyBFdmVudEVtaXR0ZXIncyBiZWhhdmlvciB0byBwcm94eSBhbmQgZmlsdGVyIGV2ZW50cyBmcm9tIHRoZSBjb25uZWN0aW9uXG5EaXlhU2VsZWN0b3IucHJvdG90eXBlLl9yZW1vdmVMaXN0ZW5lciA9IERpeWFTZWxlY3Rvci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI7XG5EaXlhU2VsZWN0b3IucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgY2FsbGJhY2spIHtcblx0aWYoY2FsbGJhY2suX19fRGl5YVNlbGVjdG9yX2hpZGRlbl93cmFwcGVyKSB0aGlzLl9jb25uZWN0aW9uLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLl9fX0RpeWFTZWxlY3Rvcl9oaWRkZW5fd3JhcHBlcik7XG5cdHRoaXMuX3JlbW92ZUxpc3RlbmVyKHR5cGUsIGNhbGxiYWNrKTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFNVQlNDUklQVElPTiAvL1xuLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuLyoqXG4qIEhhbmRsZXMgYSBzdWJzY3JpcHRpb24gdG8gc29tZSBEaXlhTm9kZSBzZXJ2aWNlIGZvciBtdWx0aXBsZSBub2Rlc1xuKiBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIHNlbGVjdG9yXG4qL1xuZnVuY3Rpb24gU3Vic2NyaXB0aW9uKHNlbGVjdG9yLCBwYXJhbXMsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdHRoaXMuc2VsZWN0b3IgPSBzZWxlY3Rvcjtcblx0XHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcblx0XHR0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XG5cdFx0dGhpcy5vcHRpb25zID0gb3B0aW9ucztcblx0XHR0aGlzLnN1YklkcyA9IFtdO1xuXG5cdFx0dGhpcy5kb1N1YnNjcmliZSA9IGZ1bmN0aW9uKHBlZXJJZCkge1xuXHRcdFx0dGhhdC5zdWJJZHMucHVzaCh0aGF0Ll9hZGRTdWJzY3JpcHRpb24ocGVlcklkKSk7XG5cdFx0XHR0aGF0LnN0YXRlID0gXCJvcGVuXCI7XG5cdFx0fTtcblxuXHRcdGlmKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuYXV0bykge1xuXHRcdFx0dGhpcy5zZWxlY3Rvci5vbigncGVlci1jb25uZWN0ZWQnLCB0aGlzLmRvU3Vic2NyaWJlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5zZWxlY3Rvci5lYWNoKHRoaXMuZG9TdWJzY3JpYmUpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xufTtcblxuU3Vic2NyaXB0aW9uLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuXHRmb3IodmFyIGkgPSAwOyBpPHRoaXMuc3ViSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dGhpcy5zZWxlY3Rvci5fY29ubmVjdGlvbi51bnN1YnNjcmliZSh0aGlzLnN1Yklkc1tpXSk7XG5cdH1cblx0dGhpcy5zdWJJZHMgPSBbXTtcblx0dGhpcy5zZWxlY3Rvci5yZW1vdmVMaXN0ZW5lcigncGVlci1jb25uZWN0ZWQnLCB0aGlzLmRvU3Vic2NyaWJlKTtcblx0dGhpcy5zdGF0ZSA9IFwiY2xvc2VkXCI7XG59O1xuXG5TdWJzY3JpcHRpb24ucHJvdG90eXBlLl9hZGRTdWJzY3JpcHRpb24gPSBmdW5jdGlvbihwZWVySWQpIHtcblx0dmFyIHRoYXQgPSB0aGlzO1xuXHR2YXIgcGFyYW1zID0ge307XG5cdGZvcih2YXIgayBpbiB0aGlzLnBhcmFtcykgcGFyYW1zW2tdID0gdGhpcy5wYXJhbXNba107XG5cdHBhcmFtcy50YXJnZXQgPSBwZWVySWQ7XG5cdHZhciBzdWJJZCA9IHRoaXMuc2VsZWN0b3IuX2Nvbm5lY3Rpb24uc3Vic2NyaWJlKHBhcmFtcywgZnVuY3Rpb24oZXJyLCBkYXRhKXtcblx0XHR0aGF0LmNhbGxiYWNrKHBlZXJJZCwgZXJyLCBkYXRhKTtcblx0fSk7XG5cdGlmKHRoaXMub3B0aW9ucyAmJiBBcnJheS5pc0FycmF5KHRoaXMub3B0aW9ucy5zdWJJZHMpKVxuXHRcdHRoaXMub3B0aW9ucy5zdWJJZHNbcGVlcklkXSA9IHN1YklkO1xuXHRyZXR1cm4gc3ViSWQ7XG59O1xuXG5cblxuXG5cbi8vIExlZ2FjeSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cbi8qKiBAZGVwcmVjYXRlZCAgKi9cbkRpeWFTZWxlY3Rvci5wcm90b3R5cGUubGlzdGVuID0gZnVuY3Rpb24oKXt9O1xuXG5EaXlhU2VsZWN0b3IucHJvdG90eXBlLl9fb2xkX2RlcHJlY2F0ZWRfdW5zdWJzY3JpYmUgPSBmdW5jdGlvbihzdWJJZHMpIHtcblx0dGhpcy5lYWNoKGZ1bmN0aW9uKHBlZXJJZCl7XG5cdFx0dmFyIHN1YklkID0gc3ViSWRzW3BlZXJJZF07XG5cdFx0aWYoc3ViSWQpIHRoaXMuX2Nvbm5lY3Rpb24udW5zdWJzY3JpYmUoc3ViSWQpO1xuXHR9KTtcblx0cmV0dXJuIHRoaXM7XG59XG5cblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGQxO1xuIiwiY29uc3QgVHJhbnNmb3JtID0gcmVxdWlyZSgnc3RyZWFtJykuVHJhbnNmb3JtO1xuXG5jbGFzcyBEaXlhU29ja2V0IGV4dGVuZHMgVHJhbnNmb3JtIHtcblx0Y29uc3RydWN0b3IoZDFpbnN0LCBwYXJhbXMsIG9wdGlvbnMpIHtcblx0XHRzdXBlcihvcHRpb25zKTtcblx0XHR0aGlzLmQxaW5zdCA9IGQxaW5zdDtcblx0XHR0aGlzLnNvY2tldE5hbWUgPSBwYXJhbXMuc29ja2V0TmFtZTtcblx0XHR0aGlzLnNvY2tldElkID0gcGFyYW1zLnNvY2tldElkO1xuXHRcdHRoaXMucGVlcklkID0gcGFyYW1zLnRhcmdldDtcblx0XHR0aGlzLmZsYWdTb2NrZXRJc0RlYWQgPSBmYWxzZTtcblx0XHR0aGlzLnN1YnNjcmlwdGlvblNvY2tldENsb3NlZCA9IG51bGw7XG5cdH1cblxuXHRfd3JpdGUoY2h1bmssIGVuY29kaW5nLCBjYWxsYmFjaykge1xuXHRcdGlmICh0aGlzLmZsYWdTb2NrZXRJc0RlYWQgPT09IGZhbHNlKSB7XG5cdFx0XHRsZXQgcGFyYW1zID0ge1xuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0c29ja2V0SWQ6IHRoaXMuc29ja2V0SWQsXG5cdFx0XHRcdFx0c29ja2V0QnVmZmVyOiBjaHVuay50b1N0cmluZygnYmFzZTY0JyksXG5cdFx0XHRcdH0sIHRhcmdldDogdGhpcy5wZWVySWRcblx0XHRcdH07XG5cdFx0XHR0aGlzLmQxaW5zdC5zZW5kU29ja2V0RGF0YShwYXJhbXMpO1xuXHRcdH1cblx0XHRjYWxsYmFjaygpO1xuXHR9XG5cblx0ZGlzY29ubmVjdCgpIHtcblx0XHRpZiAodGhpcy5mbGFnU29ja2V0SXNEZWFkID09PSBmYWxzZSkge1xuXHRcdFx0dGhpcy5lbmQoKTtcblx0XHRcdHRoaXMuZDFpbnN0LnJlcXVlc3Qoe1xuXHRcdFx0XHRzZXJ2aWNlOiAnc29ja2V0SGFuZGxlcicsXG5cdFx0XHRcdGZ1bmM6ICdEaXNjb25uZWN0Q2xpZW50Jyxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdHNvY2tldF9pZDogdGhpcy5zb2NrZXRJZFxuXHRcdFx0XHR9XG5cdFx0XHR9LCAocGVlcklkLCBlcnIsIGRhdGEpID0+IHtcblx0XHRcdFx0dGhpcy5mbGFnU29ja2V0SXNEZWFkID0gdHJ1ZVxuXHRcdFx0fSlcblx0XHR9XG5cdH1cblxuXHRzdWJzY3JpYmVTb2NrZXRDbG9zZWQob3BlbmVkU29ja2V0SWQpIHtcblx0XHR0aGlzLnN1YnNjcmlwdGlvblNvY2tldENsb3NlZCA9IHRoaXMuZDFpbnN0LnN1YnNjcmliZSh7XG5cdFx0XHRzZXJ2aWNlOiAnU29ja2V0SGFuZGxlcicsXG5cdFx0XHRmdW5jOiAnU29ja2V0SXNDbG9zZWQnXG5cdFx0fSwgKHBlZXJJZCwgZXJyLCBkYXRhKSA9PiB7XG5cdFx0XHRpZiAoZXJyICE9IG51bGwgfHwgZGF0YSA9PSBudWxsKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgKGVycilcblx0XHRcdFx0dGhpcy5kaXNjb25uZWN0ICgpXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZGF0YVswXSAhPT0gb3BlbmVkU29ja2V0SWQpIHtcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHRoaXMuZDFpbnN0Lm9uU29ja2V0Q2xvc2VkKGRhdGFbMF0pO1xuXHRcdFx0XG5cdFx0XHR0aGlzLnN1YnNjcmlwdGlvblNvY2tldENsb3NlZC5jbG9zZSgpO1xuXHRcdFx0dGhpcy5zdWJzY3JpcHRpb25Tb2NrZXRDbG9zZWQgPSBudWxsO1xuXHRcdFx0dGhpcy5kMWluc3QgPSBudWxsO1xuXHRcdFx0dGhpcy5zb2NrZXROYW1lID0gbnVsbDtcblx0XHRcdHRoaXMuc29ja2V0SWQgPSBudWxsO1xuXHRcdFx0dGhpcy5wZWVySWQgPSBudWxsO1xuXHRcdFx0dGhpcy5mbGFnU29ja2V0SXNEZWFkID0gbnVsbDtcblx0XHR9KVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGl5YVNvY2tldDtcbiIsIid1c2Ugc3RyaWN0JztcblxubGV0IGlzQnJvd3NlciA9ICEodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpXG5cbmlmICghaXNCcm93c2VyKSB7XG5cblx0Y29uc3QgUSAgICAgICAgICAgID0gcmVxdWlyZSgncScpXG5cdGNvbnN0IG5ldCAgICAgICAgICA9IHJlcXVpcmUgKCduZXQnKVxuXHRjb25zdCBKU09OU29ja2V0ICAgPSByZXF1aXJlICgnanNvbi1zb2NrZXQnKVxuXHRjb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlICgnbm9kZS1ldmVudC1lbWl0dGVyJylcblxuXHRjbGFzcyBVTklYU29ja2V0SGFuZGxlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cdFx0Y29uc3RydWN0b3IgKGFkZHIsIGNvbm5lY3RUaW1lb3V0KSB7XG5cdFx0XHRzdXBlcigpXG5cdFx0XHR0aGlzLmFkZHIgPSBhZGRyXG5cblx0XHRcdHRoaXMuX3NvY2tldCA9IG5ldyBKU09OU29ja2V0KG5ldyBuZXQuU29ja2V0KCkpXG5cdFx0XHR0aGlzLl9zb2NrZXQuY29ubmVjdCh0aGlzLmFkZHIpXG5cblx0XHRcdC8vIFN0b3JlIGNhbGxiYWNrIHNvIHRoYXQgd2UgY2FuIHVucmVnaXN0ZXIgdGhlbSBsYXRlclxuXHRcdFx0dGhpcy5fc29ja2V0T3BlbkNhbGxiYWNrID0gdGhpcy5fb25vcGVuLmJpbmQodGhpcylcblx0XHRcdHRoaXMuX3NvY2tldENsb3NlQ2FsbGJhY2sgPSB0aGlzLl9vbmNsb3NlLmJpbmQodGhpcylcblx0XHRcdHRoaXMuX3NvY2tldE1lc3NhZ2VDYWxsYmFjayA9IHRoaXMuX29ubWVzc2FnZS5iaW5kKHRoaXMpXG5cdFx0XHR0aGlzLl9zb2NrZXRFcnJvckNhbGxiYWNrID0gdGhpcy5fb25lcnJvci5iaW5kKHRoaXMpXG5cblx0XHRcdHRoaXMuX3NvY2tldC5vbignY29ubmVjdCcsIHRoaXMuX3NvY2tldE9wZW5DYWxsYmFjaylcblx0XHRcdHRoaXMuX3NvY2tldC5fc29ja2V0Lm9uKCdjbG9zZScsdGhpcy5fc29ja2V0Q2xvc2VDYWxsYmFjaylcblx0XHRcdHRoaXMuX3NvY2tldC5vbignbWVzc2FnZScsIHRoaXMuX3NvY2tldE1lc3NhZ2VDYWxsYmFjaylcblx0XHRcdHRoaXMuX3NvY2tldC5fc29ja2V0Lm9uKCdlcnJvcicsIHRoaXMuX3NvY2tldEVycm9yQ2FsbGJhY2spXG5cblx0XHRcdC8vIENyZWF0ZSB0aW1lb3V0IHRvIGFib3JkIGNvbm5lY3Rpb25nXG5cdFx0XHRzZXRUaW1lb3V0KF8gPT4ge1xuXHRcdFx0XHQvLyBXaGUgbnRpbWUgdGltZXMgb3V0LCBpZiB0aGUgc29ja2V0IGlzIG9wZW5lZCwgc2ltcGx5IHJldHVyblxuXHRcdFx0XHRpZiAodGhpcy5fc3RhdHVzID09PSAnb3BlbmVkJylcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0Ly8gT3RoZXJ3aXNlLCBhYm9yZFxuXHRcdFx0XHRpZiAodGhpcy5fc3RhdHVzICE9PSAnY2xvc2VkJyl7XG5cdFx0XHRcdFx0TG9nZ2VyLmxvZygnZDE6ICcgKyB0aGF0LmFkZHIgKyAnIHRpbWVkIG91dCB3aGlsZSBjb25uZWN0aW5nJylcblx0XHRcdFx0XHR0aGlzLmNsb3NlKClcblx0XHRcdFx0XHR0aGlzLmVtaXQoJ3RpbWVvdXQnLCB0aGlzLl9zb2NrZXQpXG5cdFx0XHRcdH1cblx0XHRcdH0sIGNvbm5lY3RUaW1lb3V0KVxuXHRcdH1cblxuXHRcdGNsb3NlICgpIHtcblx0XHRcdGlmICh0aGlzLl9kaXNjb25uZWN0aW9uRGVmZXJyZWQgJiYgdGhpcy5fZGlzY29ubmVjdGlvbkRlZmVycmVkLnByb21pc2UpXG5cdFx0XHRcdHJldHVybiB0aGlzLl9kaXNjb25uZWN0aW9uRGVmZXJyZWQucHJvbWlzZVxuXG5cdFx0XHR0aGlzLl9kaXNjb25uZWN0aW9uRGVmZXJyZWQgPSBRLmRlZmVyKClcblx0XHRcdHRoaXMuX3N0YXR1cyA9ICdjbG9zaW5nJ1xuXG5cdFx0XHR0aGlzLmVtaXQoJ2Nsb3NpbmcnLCB0aGlzLl9zb2NrZXQpXG5cblx0XHRcdGlmICh0aGlzLl9zb2NrZXQpXG5cdFx0XHRcdHRoaXMuX3NvY2tldC5lbmQoKVxuXG5cdFx0XHRyZXR1cm4gdGhpcy5fZGlzY29ubmVjdGlvbkRlZmVycmVkLnByb21pc2Vcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBTZW5kIGEgSlNPTi1mb3JtYXR0ZWQgbWVzc2FnZSB0aHJvdWdoIHRoZSBzb2NrZXRcblx0XHQgKiBAcGFyYW0ge0pTT059IG1zZyBUaGUgSlNPTiB0byBzZW5kIChkbyBub3Qgc3RyaW5naWZ5IGl0LCBqc29uLXNvY2tldCB3aWxsIGRvIGl0KVxuXHRcdCAqL1xuXHRcdHNlbmQgKG1zZykge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dGhpcy5fc29ja2V0LnNlbmRNZXNzYWdlKG1zZylcblx0XHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignQ2Fubm90IHNlbmQgbWVzc2FnZTogJyArIGVyci5tZXNzYWdlKVxuXHRcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRydWVcblx0XHR9XG5cblx0XHRpc0Nvbm5lY3RlZCAoKSB7XG5cdFx0XHRyZXR1cm4gIXRoaXMuX3NvY2tldC5pc0Nsb3NlZCgpICYmIHRoaXMuX3N0YXR1cyA9PT0gJ29wZW5lZCdcblx0XHR9XG5cblx0XHRfb25vcGVuICgpIHtcblx0XHRcdHRoaXMuX3N0YXR1cyA9ICdvcGVuZWQnXG5cdFx0XHR0aGlzLmVtaXQoJ29wZW4nLCB0aGlzLl9zb2NrZXQpXG5cdFx0fVxuXG5cdFx0X29uY2xvc2UgKCkge1xuXHRcdFx0dGhpcy5fc3RhdHVzID0gJ2Nsb3NlZCdcblx0XHRcdHRoaXMudW5yZWdpc3RlckNhbGxiYWNrcygpXG5cdFx0XHR0aGlzLmVtaXQoJ2Nsb3NlJywgdGhpcy5fc29ja2V0KVxuXHRcdFx0aWYgKHRoaXMuX2Rpc2Nvbm5lY3Rpb25EZWZlcnJlZCAmJiB0aGlzLl9kaXNjb25uZWN0aW9uRGVmZXJyZWQucHJvbWlzZSlcblx0XHRcdFx0dGhpcy5fZGlzY29ubmVjdGlvbkRlZmVycmVkLnJlc29sdmUoKVxuXHRcdH1cblxuXHRcdF9vbm1lc3NhZ2UgKG1zZykge1xuXHRcdFx0Ly8gVGhlIG1lc3NhZ2UgaXMgYWxyZWFkeSBhIEpTT05cblx0XHRcdHRoaXMuZW1pdCgnbWVzc2FnZScsIG1zZylcblx0XHR9XG5cblx0XHRfb25lcnJvciAoZXJyKSB7XG5cdFx0XHR0aGlzLmVtaXQoJ2Vycm9yJywgZXJyKVxuXHRcdH1cblxuXHRcdHVucmVnaXN0ZXJDYWxsYmFja3MgKCkge1xuXHRcdFx0aWYgKHRoaXMuX3NvY2tldCAmJiAodHlwZW9mIHRoaXMuX3NvY2tldC5yZW1vdmVFdmVudExpc3RlbmVyID09PSAnZnVuY3Rpb24nKSkge1xuXHRcdFx0XHR0aGlzLl9zb2NrZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignb3BlbicsIHRoaXMuX3NvY2tldE9wZW5DYWxsYmFjaylcblx0XHRcdFx0dGhpcy5fc29ja2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Nsb3NlJywgdGhpcy5fc29ja2V0Q2xvc2VDYWxsYmFjaylcblx0XHRcdFx0dGhpcy5fc29ja2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCB0aGlzLl9zb2NrZXRNZXNzYWdlQ2FsbGJhY2spXG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMuX3NvY2tldCAmJiAodHlwZW9mIHRoaXMuX3NvY2tldC5yZW1vdmVBbGxMaXN0ZW5lcnMgPT09ICdmdW5jdGlvbicpKSB7XG5cdFx0XHRcdHRoaXMuX3NvY2tldC5yZW1vdmVBbGxMaXN0ZW5lcnMoKVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdG1vZHVsZS5leHBvcnRzID0gVU5JWFNvY2tldEhhbmRsZXJcbn1cbiIsInZhciBkMSA9IHJlcXVpcmUoJy4vRGl5YVNlbGVjdG9yLmpzJyk7XG5cbi8vcmVxdWlyZSgnLi9zZXJ2aWNlcy9ydGMvcnRjLmpzJyk7XG5yZXF1aXJlKCcuL3NlcnZpY2VzL2llcS9pZXEuanMnKTtcbnJlcXVpcmUoJy4vc2VydmljZXMvcGVlckF1dGgvUGVlckF1dGguanMnKTtcbnJlcXVpcmUoJy4vc2VydmljZXMvbWVzaE5ldHdvcmsvTWVzaE5ldHdvcmsuanMnKTtcbnJlcXVpcmUoJy4vdXRpbHMvZW5jb2RpbmcvZW5jb2RpbmcuanMnKTtcbnJlcXVpcmUoJy4vc2VydmljZXMvc3RhdHVzL3N0YXR1cy5qcycpO1xucmVxdWlyZSgnLi9EQnVzT2JqZWN0LmpzJyk7XG4vL3JlcXVpcmUoJy4vc2VydmljZXMvc2hlbGwvU2hlbGwuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBkMTtcbiIsIi8qIG1heWEtY2xpZW50XG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIFBhcnRuZXJpbmcgUm9ib3RpY3MsIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBUaGlzIGxpYnJhcnkgaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4gKiBtb2RpZnkgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljXG4gKiBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uOyB2ZXJzaW9uXG4gKlx0My4wIG9mIHRoZSBMaWNlbnNlLiBUaGlzIGxpYnJhcnkgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGVcbiAqIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuXG4gKiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpY1xuICogTGljZW5zZSBhbG9uZyB3aXRoIHRoaXMgbGlicmFyeS5cbiAqL1xuXG4vKipcbiAgIFRvZG8gOlxuICAgY2hlY2sgZXJyIGZvciBlYWNoIGRhdGFcbiAgIGltcHJvdmUgQVBJIDogZ2V0RGF0YShzZW5zb3JOYW1lLCBkYXRhQ29uZmlnKVxuICAgcmV0dXJuIGFkYXB0ZWQgdmVjdG9yIGZvciBkaXNwbGF5IHdpdGggRDMgdG8gcmVkdWNlIGNvZGUgaW4gSUhNID9cbiAgIHVwZGF0ZURhdGEoc2Vuc29yTmFtZSwgZGF0YUNvbmZpZylcbiAgIHNldCBhbmQgZ2V0IGZvciB0aGUgZGlmZmVyZW50IGRhdGFDb25maWcgcGFyYW1zXG5cbiovXG5cbnZhciBEaXlhU2VsZWN0b3IgPSByZXF1aXJlKCcuLi8uLi9EaXlhU2VsZWN0b3InKS5EaXlhU2VsZWN0b3I7XG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcblxuXG52YXIgTWVzc2FnZSA9IHJlcXVpcmUoJy4uL21lc3NhZ2UnKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLyBMb2dnaW5nIHV0aWxpdHkgbWV0aG9kcyAvLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbnZhciBERUJVRyA9IHRydWU7XG52YXIgTG9nZ2VyID0ge1xuXHRsb2c6IGZ1bmN0aW9uKG1lc3NhZ2Upe1xuXHRcdGlmKERFQlVHKSBjb25zb2xlLmxvZyhtZXNzYWdlKTtcblx0fSxcblxuXHRlcnJvcjogZnVuY3Rpb24obWVzc2FnZSl7XG5cdFx0aWYoREVCVUcpIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG5cdH1cbn07XG5cbi8qKlxuICpcdGNhbGxiYWNrIDogZnVuY3Rpb24gY2FsbGVkIGFmdGVyIG1vZGVsIHVwZGF0ZWRcbiAqICovXG5mdW5jdGlvbiBJRVEoc2VsZWN0b3Ipe1xuXHR2YXIgdGhhdCA9IHRoaXM7XG5cdHRoaXMuc2VsZWN0b3IgPSBzZWxlY3Rvcjtcblx0dGhpcy5kYXRhTW9kZWw9e307XG5cdHRoaXMuX2NvZGVyID0gc2VsZWN0b3IuZW5jb2RlKCk7XG5cdHRoaXMuc3Vic2NyaXB0aW9ucyA9IFtdO1xuLy9cdHRoYXQuc3Vic2NyaXB0aW9uRXJyb3JOdW0gPSAwO1xuXG5cdC8qKiogc3RydWN0dXJlIG9mIGRhdGEgY29uZmlnICoqKlxuXHRcdCBjcml0ZXJpYSA6XG5cdFx0ICAgdGltZTogYWxsIDMgdGltZSBjcml0ZXJpYSBzaG91bGQgbm90IGJlIGRlZmluZWQgYXQgdGhlIHNhbWUgdGltZS4gKHJhbmdlIHdvdWxkIGJlIGdpdmVuIHVwKVxuXHRcdCAgICAgc3RhcnQ6IHtbbnVsbF0sdGltZX0gKG51bGwgbWVhbnMgbW9zdCByZWNlbnQpIC8vIHN0b3JlZCBhIFVUQyBpbiBtcyAobnVtKVxuXHRcdCAgICAgZW5kOiB7W251bGxdLCB0aW1lfSAobnVsbCBtZWFucyBtb3N0IG9sZGVzdCkgLy8gc3RvcmVkIGFzIFVUQyBpbiBtcyAobnVtKVxuXHRcdCAgICAgcmFuZ2U6IHtbbnVsbF0sIHRpbWV9IChyYW5nZSBvZiB0aW1lKHBvc2l0aXZlKSApIC8vIGluIHMgKG51bSlcblx0XHQgICByb2JvdDoge0FycmF5T2YgSUQgb3IgW1wiYWxsXCJdfVxuXHRcdCAgIHBsYWNlOiB7QXJyYXlPZiBJRCBvciBbXCJhbGxcIl19XG5cdFx0IG9wZXJhdG9yOiB7W2xhc3RdLCBtYXgsIG1veSwgc2R9IC0oIG1heWJlIG1veSBzaG91bGQgYmUgZGVmYXVsdFxuXHRcdCAuLi5cblxuXHRcdCBzZW5zb3JzIDoge1tudWxsXSBvciBBcnJheU9mIFNlbnNvck5hbWV9XG5cblx0XHQgc2FtcGxpbmc6IHtbbnVsbF0gb3IgaW50fVxuXHQqL1xuXHR0aGlzLmRhdGFDb25maWcgPSB7XG5cdFx0Y3JpdGVyaWE6IHtcblx0XHRcdHRpbWU6IHtcblx0XHRcdFx0c3RhcnQ6IG51bGwsXG5cdFx0XHRcdGVuZDogbnVsbCxcblx0XHRcdFx0cmFuZ2U6IG51bGwgLy8gaW4gc1xuXHRcdFx0fSxcblx0XHRcdHJvYm90OiBudWxsLFxuXHRcdFx0cGxhY2U6IG51bGxcblx0XHR9LFxuXHRcdG9wZXJhdG9yOiAnbGFzdCcsXG5cdFx0c2Vuc29yczogbnVsbCxcblx0XHRzYW1wbGluZzogbnVsbCAvL3NhbXBsaW5nXG5cdH07XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEdldCBkYXRhTW9kZWwgOlxuICoge1xuICpcdFwic2Vuc2V1clhYXCI6IHtcbiAqXHRcdFx0ZGF0YTpbRkxPQVQsIC4uLl0sXG4gKlx0XHRcdHRpbWU6W0ZMT0FULCAuLi5dLFxuICpcdFx0XHRyb2JvdDpbRkxPQVQsIC4uLl0sXG4gKlx0XHRcdHBsYWNlOltGTE9BVCwgLi4uXSxcbiAqXHRcdFx0cXVhbGl0eUluZGV4OltGTE9BVCwgLi4uXSxcbiAqXHRcdFx0cmFuZ2U6IFtGTE9BVCwgRkxPQVRdLFxuICpcdFx0XHR1bml0OiBzdHJpbmcsXG4gKlx0XHRsYWJlbDogc3RyaW5nXG4gKlx0XHR9LFxuICpcdCAuLi4gKFwic2Vuc2V1cnNZWVwiKVxuICogfVxuICovXG5JRVEucHJvdG90eXBlLmdldERhdGFNb2RlbCA9IGZ1bmN0aW9uKCl7XG5cdHJldHVybiB0aGlzLmRhdGFNb2RlbDtcbn07XG5JRVEucHJvdG90eXBlLmdldERhdGFSYW5nZSA9IGZ1bmN0aW9uKCl7XG5cdHJldHVybiB0aGlzLmRhdGFNb2RlbC5yYW5nZTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IGRhdGFDb25maWcgY29uZmlnIGZvciBkYXRhIHJlcXVlc3RcbiAqIGlmIGRhdGFDb25maWcgaXMgZGVmaW5lIDogc2V0IGFuZCByZXR1cm4gdGhpc1xuICpcdCBAcmV0dXJuIHtJRVF9IHRoaXNcbiAqIGVsc2VcbiAqXHQgQHJldHVybiB7T2JqZWN0fSBjdXJyZW50IGRhdGFDb25maWdcbiAqL1xuSUVRLnByb3RvdHlwZS5EYXRhQ29uZmlnID0gZnVuY3Rpb24obmV3RGF0YUNvbmZpZyl7XG5cdGlmKG5ld0RhdGFDb25maWcpIHtcblx0XHR0aGlzLmRhdGFDb25maWc9bmV3RGF0YUNvbmZpZztcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRlbHNlXG5cdFx0cmV0dXJuIHRoaXMuZGF0YUNvbmZpZztcbn07XG4vKipcbiAqIFRPIEJFIElNUExFTUVOVEVEIDogb3BlcmF0b3IgbWFuYWdlbWVudCBpbiBETi1JRVFcbiAqIEBwYXJhbSAge1N0cmluZ31cdCBuZXdPcGVyYXRvciA6IHtbbGFzdF0sIG1heCwgbW95LCBzZH1cbiAqIEByZXR1cm4ge0lFUX0gdGhpcyAtIGNoYWluYWJsZVxuICogU2V0IG9wZXJhdG9yIGNyaXRlcmlhLlxuICogRGVwZW5kcyBvbiBuZXdPcGVyYXRvclxuICpcdEBwYXJhbSB7U3RyaW5nfSBuZXdPcGVyYXRvclxuICpcdEByZXR1cm4gdGhpc1xuICogR2V0IG9wZXJhdG9yIGNyaXRlcmlhLlxuICpcdEByZXR1cm4ge1N0cmluZ30gb3BlcmF0b3JcbiAqL1xuSUVRLnByb3RvdHlwZS5EYXRhT3BlcmF0b3IgPSBmdW5jdGlvbihuZXdPcGVyYXRvcil7XG5cdGlmKG5ld09wZXJhdG9yKSB7XG5cdFx0dGhpcy5kYXRhQ29uZmlnLm9wZXJhdG9yID0gbmV3T3BlcmF0b3I7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0ZWxzZVxuXHRcdHJldHVybiB0aGlzLmRhdGFDb25maWcub3BlcmF0b3I7XG59O1xuLyoqXG4gKiBEZXBlbmRzIG9uIG51bVNhbXBsZXNcbiAqIEBwYXJhbSB7aW50fSBudW1iZXIgb2Ygc2FtcGxlcyBpbiBkYXRhTW9kZWxcbiAqIGlmIGRlZmluZWQgOiBzZXQgbnVtYmVyIG9mIHNhbXBsZXNcbiAqXHRAcmV0dXJuIHtJRVF9IHRoaXNcbiAqIGVsc2VcbiAqXHRAcmV0dXJuIHtpbnR9IG51bWJlciBvZiBzYW1wbGVzXG4gKiovXG5JRVEucHJvdG90eXBlLkRhdGFTYW1wbGluZyA9IGZ1bmN0aW9uKG51bVNhbXBsZXMpe1xuXHRpZihudW1TYW1wbGVzKSB7XG5cdFx0dGhpcy5kYXRhQ29uZmlnLnNhbXBsaW5nID0gbnVtU2FtcGxlcztcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRlbHNlXG5cdFx0cmV0dXJuIHRoaXMuZGF0YUNvbmZpZy5zYW1wbGluZztcbn07XG4vKipcbiAqIFNldCBvciBnZXQgZGF0YSB0aW1lIGNyaXRlcmlhIHN0YXJ0IGFuZCBlbmQuXG4gKiBJZiBwYXJhbSBkZWZpbmVkXG4gKlx0QHBhcmFtIHtEYXRlfSBuZXdUaW1lU3RhcnQgLy8gbWF5IGJlIG51bGxcbiAqXHRAcGFyYW0ge0RhdGV9IG5ld1RpbWVFbmQgLy8gbWF5IGJlIG51bGxcbiAqXHRAcmV0dXJuIHtJRVF9IHRoaXNcbiAqIElmIG5vIHBhcmFtIGRlZmluZWQ6XG4gKlx0QHJldHVybiB7T2JqZWN0fSBUaW1lIG9iamVjdDogZmllbGRzIHN0YXJ0IGFuZCBlbmQuXG4gKi9cbklFUS5wcm90b3R5cGUuRGF0YVRpbWUgPSBmdW5jdGlvbihuZXdUaW1lU3RhcnQsbmV3VGltZUVuZCwgbmV3UmFuZ2Upe1xuXHRpZihuZXdUaW1lU3RhcnQgfHwgbmV3VGltZUVuZCB8fCBuZXdSYW5nZSkge1xuXHRcdHRoaXMuZGF0YUNvbmZpZy5jcml0ZXJpYS50aW1lLnN0YXJ0ID0gbmV3VGltZVN0YXJ0LmdldFRpbWUoKTtcblx0XHR0aGlzLmRhdGFDb25maWcuY3JpdGVyaWEudGltZS5lbmQgPSBuZXdUaW1lRW5kLmdldFRpbWUoKTtcblx0XHR0aGlzLmRhdGFDb25maWcuY3JpdGVyaWEudGltZS5yYW5nZSA9IG5ld1JhbmdlO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdGVsc2Vcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3RhcnQ6IG5ldyBEYXRlKHRoaXMuZGF0YUNvbmZpZy5jcml0ZXJpYS50aW1lLnN0YXJ0KSxcblx0XHRcdGVuZDogbmV3IERhdGUodGhpcy5kYXRhQ29uZmlnLmNyaXRlcmlhLnRpbWUuZW5kKSxcblx0XHRcdHJhbmdlOiBuZXcgRGF0ZSh0aGlzLmRhdGFDb25maWcuY3JpdGVyaWEudGltZS5yYW5nZSlcblx0XHR9O1xufTtcbi8qKlxuICogRGVwZW5kcyBvbiByb2JvdElkc1xuICogU2V0IHJvYm90IGNyaXRlcmlhLlxuICpcdEBwYXJhbSB7QXJyYXlbSW50XX0gcm9ib3RJZHMgbGlzdCBvZiByb2JvdCBJZHNcbiAqIEdldCByb2JvdCBjcml0ZXJpYS5cbiAqXHRAcmV0dXJuIHtBcnJheVtJbnRdfSBsaXN0IG9mIHJvYm90IElkc1xuICovXG5JRVEucHJvdG90eXBlLkRhdGFSb2JvdElkcyA9IGZ1bmN0aW9uKHJvYm90SWRzKXtcblx0aWYocm9ib3RJZHMpIHtcblx0XHR0aGlzLmRhdGFDb25maWcuY3JpdGVyaWEucm9ib3QgPSByb2JvdElkcztcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRlbHNlXG5cdFx0cmV0dXJuIHRoaXMuZGF0YUNvbmZpZy5jcml0ZXJpYS5yb2JvdDtcbn07XG4vKipcbiAqIERlcGVuZHMgb24gcGxhY2VJZHNcbiAqIFNldCBwbGFjZSBjcml0ZXJpYS5cbiAqXHRAcGFyYW0ge0FycmF5W0ludF19IHBsYWNlSWRzIGxpc3Qgb2YgcGxhY2UgSWRzXG4gKiBHZXQgcGxhY2UgY3JpdGVyaWEuXG4gKlx0QHJldHVybiB7QXJyYXlbSW50XX0gbGlzdCBvZiBwbGFjZSBJZHNcbiAqL1xuSUVRLnByb3RvdHlwZS5EYXRhUGxhY2VJZHMgPSBmdW5jdGlvbihwbGFjZUlkcyl7XG5cdGlmKHBsYWNlSWRzKSB7XG5cdFx0dGhpcy5kYXRhQ29uZmlnLmNyaXRlcmlhLnBsYWNlSWQgPSBwbGFjZUlkcztcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRlbHNlXG5cdFx0cmV0dXJuIHRoaXMuZGF0YUNvbmZpZy5jcml0ZXJpYS5wbGFjZTtcbn07XG4vKipcbiAqIEdldCBkYXRhIGJ5IHNlbnNvciBuYW1lLlxuICpcdEBwYXJhbSB7QXJyYXlbU3RyaW5nXX0gc2Vuc29yTmFtZSBsaXN0IG9mIHNlbnNvcnNcbiAqL1xuSUVRLnByb3RvdHlwZS5nZXREYXRhQnlOYW1lID0gZnVuY3Rpb24oc2Vuc29yTmFtZXMpe1xuXHR2YXIgZGF0YT1bXTtcblx0Zm9yKHZhciBuIGluIHNlbnNvck5hbWVzKSB7XG5cdFx0ZGF0YS5wdXNoKHRoaXMuZGF0YU1vZGVsW3NlbnNvck5hbWVzW25dXSk7XG5cdH1cblx0cmV0dXJuIGRhdGE7XG59O1xuLyoqXG4gKiBVcGRhdGUgZGF0YSBnaXZlbiBkYXRhQ29uZmlnLlxuICogQHBhcmFtIHtmdW5jfSBjYWxsYmFjayA6IGNhbGxlZCBhZnRlciB1cGRhdGVcbiAqIFRPRE8gVVNFIFBST01JU0VcbiAqL1xuSUVRLnByb3RvdHlwZS51cGRhdGVEYXRhID0gZnVuY3Rpb24oY2FsbGJhY2ssIGRhdGFDb25maWcpe1xuXHR2YXIgdGhhdD10aGlzO1xuXHRpZihkYXRhQ29uZmlnKVxuXHRcdHRoaXMuRGF0YUNvbmZpZyhkYXRhQ29uZmlnKTtcblx0Ly8gY29uc29sZS5sb2coXCJSZXF1ZXN0OiBcIitKU09OLnN0cmluZ2lmeShkYXRhQ29uZmlnKSk7XG5cdHRoaXMuc2VsZWN0b3IucmVxdWVzdCh7XG5cdFx0c2VydmljZTogXCJpZXFcIixcblx0XHRmdW5jOiBcIkRhdGFSZXF1ZXN0XCIsXG5cdFx0ZGF0YToge1xuXHRcdFx0dHlwZTpcInNwbFJlcVwiLFxuXHRcdFx0ZGF0YUNvbmZpZzogdGhhdC5kYXRhQ29uZmlnXG5cdFx0fVxuXHR9LCBmdW5jdGlvbihkbklkLCBlcnIsIGRhdGEpe1xuXHRcdGlmKGVycikge1xuXHRcdFx0TG9nZ2VyLmVycm9yKFwiW1wiK3RoYXQuZGF0YUNvbmZpZy5zZW5zb3JzK1wiXSBSZWN2IGVycjogXCIrSlNPTi5zdHJpbmdpZnkoZXJyKSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmKGRhdGEuaGVhZGVyLmVycm9yKSB7XG5cdFx0XHQvLyBUT0RPIDogY2hlY2svdXNlIGVyciBzdGF0dXMgYW5kIGFkYXB0IGJlaGF2aW9yIGFjY29yZGluZ2x5XG5cdFx0XHRMb2dnZXIuZXJyb3IoXCJVcGRhdGVEYXRhOlxcblwiK0pTT04uc3RyaW5naWZ5KGRhdGEuaGVhZGVyLmRhdGFDb25maWcpKTtcblx0XHRcdExvZ2dlci5lcnJvcihcIkRhdGEgcmVxdWVzdCBmYWlsZWQgKFwiK2RhdGEuaGVhZGVyLmVycm9yLnN0K1wiKTogXCIrZGF0YS5oZWFkZXIuZXJyb3IubXNnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBjb25zb2xlLmxvZyhkYXRhKTtcblx0XHR0aGF0Ll9nZXREYXRhTW9kZWxGcm9tUmVjdihkYXRhKTtcblxuXHRcdC8vIExvZ2dlci5sb2codGhhdC5nZXREYXRhTW9kZWwoKSk7XG5cblx0XHRjYWxsYmFjayA9IGNhbGxiYWNrLmJpbmQodGhhdCk7IC8vIGJpbmQgY2FsbGJhY2sgd2l0aCBJRVFcblx0XHRjYWxsYmFjayh0aGF0LmdldERhdGFNb2RlbCgpKTsgLy8gY2FsbGJhY2sgZnVuY1xuXHR9KTtcbn07XG5cbklFUS5wcm90b3R5cGUuX2lzRGF0YU1vZGVsV2l0aE5hTiA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgZGF0YU1vZGVsTmFOPWZhbHNlO1xuXHR2YXIgc2Vuc29yTmFuO1xuXHRmb3IodmFyIG4gaW4gdGhpcy5kYXRhTW9kZWwpIHtcblx0XHRzZW5zb3JOYW4gPSB0aGlzLmRhdGFNb2RlbFtuXS5kYXRhLnJlZHVjZShmdW5jdGlvbihuYW5QcmVzLGQpIHtcblx0XHRcdHJldHVybiBuYW5QcmVzICYmIGlzTmFOKGQpO1xuXHRcdH0sZmFsc2UpO1xuXHRcdGRhdGFNb2RlbE5hTiA9IGRhdGFNb2RlbE5hTiAmJiBzZW5zb3JOYW47XG5cdFx0TG9nZ2VyLmxvZyhuK1wiIHdpdGggbmFuIDogXCIrc2Vuc29yTmFuK1wiIChcIitkYXRhTW9kZWxOYU4rXCIpIC8gXCIrdGhpcy5kYXRhTW9kZWxbbl0uZGF0YS5sZW5ndGgpO1xuXHR9XG59O1xuXG5JRVEucHJvdG90eXBlLmdldENvbmZpbmVtZW50TGV2ZWwgPSBmdW5jdGlvbigpe1xuXHRyZXR1cm4gdGhpcy5jb25maW5lbWVudDtcbn07XG5cbklFUS5wcm90b3R5cGUuZ2V0QWlyUXVhbGl0eUxldmVsID0gZnVuY3Rpb24oKXtcblx0cmV0dXJuIHRoaXMuYWlyUXVhbGl0eTtcbn07XG5cbklFUS5wcm90b3R5cGUuZ2V0RW52UXVhbGl0eUxldmVsID0gZnVuY3Rpb24oKXtcblx0cmV0dXJuIHRoaXMuZW52UXVhbGl0eTtcbn07XG5cblxuXG4vKipcbiAqIFVwZGF0ZSBpbnRlcm5hbCBtb2RlbCB3aXRoIHJlY2VpdmVkIGRhdGFcbiAqIEBwYXJhbSAgZGF0YSB0byBjb25maWd1cmUgc3Vic2NyaXB0aW9uXG4gKiBAcGFyYW0gIGNhbGxiYWNrIGNhbGxlZCBvbiBhbnN3ZXJzIChAcGFyYW0gOiBkYXRhTW9kZWwpXG4gKi9cbklFUS5wcm90b3R5cGUud2F0Y2ggPSBmdW5jdGlvbihkYXRhLCBjYWxsYmFjayl7XG5cdHZhciB0aGF0ID0gdGhpcztcblx0Ly8gY29uc29sZS5sb2coXCJSZXF1ZXN0OiBcIitKU09OLnN0cmluZ2lmeShkYXRhQ29uZmlnKSk7XG5cblx0LyoqIGRlZmF1bHQgKiovXG5cdGRhdGEgPSBkYXRhIHx8IHt9O1xuXHRkYXRhLnRpbWVSYW5nZSA9IGRhdGEudGltZVJhbmdlICB8fCAnaG91cnMnO1xuXHRkYXRhLmNhdCA9IGRhdGEuY2F0IHx8ICdpZXEnOyAvKiBjYXRlZ29yeSAqL1xuXG5cdHZhciBzdWJzID0gdGhpcy5zZWxlY3Rvci5zdWJzY3JpYmUoe1xuXHRcdHNlcnZpY2U6IFwiaWVxXCIsXG5cdFx0ZnVuYzogXCJEYXRhXCIsXG5cdFx0ZGF0YTogZGF0YSxcblx0XHRvYmo6IGRhdGEuY2F0IC8qIHByb3ZpZGUgY2F0ZWdvcnkgb2Ygc2Vuc29yIHRvIGJlIHdhdGNoZWQsIGZpbHRlcmVkIGFjY29yZGluZyB0byBDUk0gKi9cblx0fSwgZnVuY3Rpb24oZG5JZCwgZXJyLCBkYXRhKXtcblx0XHRpZihlcnIpIHtcblx0XHRcdExvZ2dlci5lcnJvcihcIldhdGNoSUVRUmVjdkVycjpcIitKU09OLnN0cmluZ2lmeShlcnIpKTtcblx0XHRcdC8vIGNvbnNvbGUubG9nKGUpO1xuXHRcdFx0Ly8gY29uc29sZS5sb2codGhhdC5zZWxlY3Rvcik7XG5cdFx0XHQvLyBpZihlcnI9PT1cIlN1YnNjcmlwdGlvbkNsb3NlZFwiKSB7XG5cdFx0XHQvLyBcdHRoYXQuY2xvc2VTdWJzY3JpcHRpb25zKCk7IC8vIHNob3VsZCBub3QgYmUgbmVjZXNzYXJ5XG5cdFx0XHQvLyBcdHRoYXQuc3Vic2NyaXB0aW9uRXJyb3IgPSB0aGF0LnN1YnNjcmlwdGlvbkVycm9yTnVtKzE7IC8vIGluY3JlYXNlIGVycm9yIGNvdW50ZXJcblx0XHRcdC8vIFx0c2V0VGltZW91dCh0aGF0LnN1YnNjcmlwdGlvbkVycm9yTnVtKjYwMDAwLCB0aGF0LndhdGNoKGRhdGEsY2FsbGJhY2spKTsgLy8gdHJ5IGFnYWluIGxhdGVyXG5cdFx0XHQvLyB9XG5cdFx0XHQvLyBlbHNlIHtcblx0XHRcdC8vIFx0Y29uc29sZS5lcnJvcihcIlVubWFuYWdlIGNhc2VzIDogc2hvdWxkIHRoZSBzdWJzY3JpcHRpb24gYmUgcmVnZW5lcmF0ZWQgP1wiKTtcblx0XHRcdC8vIH1cblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYoZGF0YS5oZWFkZXIuZXJyb3IpIHtcblx0XHRcdC8vIFRPRE8gOiBjaGVjay91c2UgZXJyIHN0YXR1cyBhbmQgYWRhcHQgYmVoYXZpb3IgYWNjb3JkaW5nbHlcblx0XHRcdExvZ2dlci5lcnJvcihcIldhdGNoSUVROlxcblwiK0pTT04uc3RyaW5naWZ5KGRhdGEuaGVhZGVyLmRhdGFDb25maWcpKTtcblx0XHRcdExvZ2dlci5lcnJvcihcIkRhdGEgcmVxdWVzdCBmYWlsZWQgKFwiK2RhdGEuaGVhZGVyLmVycm9yLnN0K1wiKTogXCIrZGF0YS5oZWFkZXIuZXJyb3IubXNnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Ly8gY29uc29sZS5sb2coZGF0YSk7XG5cdFx0dGhhdC5fZ2V0RGF0YU1vZGVsRnJvbVJlY3YoZGF0YSk7XG4vL1x0XHR0aGF0LnN1YnNjcmlwdGlvbkVycm9yID0gMDsgLy8gcmVzZXQgZXJyb3IgY291bnRlclxuXG5cdFx0Y2FsbGJhY2sgPSBjYWxsYmFjay5iaW5kKHRoYXQpOyAvLyBiaW5kIGNhbGxiYWNrIHdpdGggSUVRXG5cdFx0Y2FsbGJhY2sodGhhdC5nZXREYXRhTW9kZWwoKSk7IC8vIGNhbGxiYWNrIGZ1bmNcblx0fSk7XG5cblx0dGhpcy5zdWJzY3JpcHRpb25zLnB1c2goc3Vicyk7XG59O1xuXG4vKipcbiAqIENsb3NlIGFsbCBzdWJzY3JpcHRpb25zXG4gKi9cbklFUS5wcm90b3R5cGUuY2xvc2VTdWJzY3JpcHRpb25zID0gZnVuY3Rpb24oKXtcblx0Zm9yKHZhciBpIGluIHRoaXMuc3Vic2NyaXB0aW9ucykge1xuXHRcdHRoaXMuc3Vic2NyaXB0aW9uc1tpXS5jbG9zZSgpO1xuXHR9XG5cdHRoaXMuc3Vic2NyaXB0aW9ucyA9W107XG59O1xuXG4vKipcbiAqIHJlcXVlc3QgRGF0YSB0byBtYWtlIENTViBmaWxlXG4gKi9cbklFUS5wcm90b3R5cGUuZ2V0Q1NWRGF0YSA9IGZ1bmN0aW9uKHNlbnNvck5hbWVzLF9maXJzdERheSxjYWxsYmFjayl7XG5cdHZhciBmaXJzdERheSA9IG5ldyBEYXRlKF9maXJzdERheSk7XG5cdHZhciBkYXRhQ29uZmlnID0ge1xuXHRcdGNyaXRlcmlhOiB7XG5cdFx0XHR0aW1lOiB7IHN0YXJ0OiBmaXJzdERheS5nZXRUaW1lKCksIHJhbmdlVW5pdDogJ2hvdXInLCByYW5nZTogMTgwfSwgLy8gMzYwaCAtPiAxNWQgLy8gMTgwaCAtPiA3alxuXHRcdFx0cGxhY2VzOiBbXSxcblx0XHRcdHJvYm90czogW11cblx0XHR9LFxuXHRcdHNlbnNvcnM6IHNlbnNvck5hbWVzXG5cdH07XG5cblx0dGhpcy51cGRhdGVEYXRhKGNhbGxiYWNrLCBkYXRhQ29uZmlnKTtcbn07XG5cblxuLyoqXG4gKiBVcGRhdGUgaW50ZXJuYWwgbW9kZWwgd2l0aCByZWNlaXZlZCBkYXRhXG4gKiBAcGFyYW0gIHtPYmplY3R9IGRhdGEgZGF0YSByZWNlaXZlZCBmcm9tIERpeWFOb2RlIGJ5IHdlYnNvY2tldFxuICogQHJldHVybiB7W3R5cGVdfVx0XHRbZGVzY3JpcHRpb25dXG4gKi9cbklFUS5wcm90b3R5cGUuX2dldERhdGFNb2RlbEZyb21SZWN2ID0gZnVuY3Rpb24oZGF0YSl7XG5cdHZhciBkYXRhTW9kZWw9bnVsbDtcblxuXHRpZihkYXRhLmVyciAmJiBkYXRhLmVyci5zdD4wKSB7XG5cdFx0TG9nZ2VyLmVycm9yKGRhdGEuZXJyLm1zZyk7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0ZGVsZXRlIGRhdGEuZXJyO1xuXHRpZihkYXRhICYmIGRhdGEuaGVhZGVyKSB7XG5cdFx0Zm9yICh2YXIgbiBpbiBkYXRhKSB7XG5cdFx0XHRpZihuICE9IFwiaGVhZGVyXCIgJiYgbiAhPSBcImVyclwiKSB7XG5cblx0XHRcdFx0aWYoZGF0YVtuXS5lcnIgJiYgZGF0YVtuXS5lcnIuc3Q+MCkge1xuXHRcdFx0XHRcdExvZ2dlci5lcnJvcihuK1wiIHdhcyBpbiBlcnJvcjogXCIrZGF0YVtuXS5lcnIubXNnKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKCFkYXRhTW9kZWwpXG5cdFx0XHRcdFx0ZGF0YU1vZGVsPXt9O1xuXG5cdFx0XHRcdC8vIExvZ2dlci5sb2cobik7XG5cdFx0XHRcdGlmKCFkYXRhTW9kZWxbbl0pIHtcblx0XHRcdFx0XHRkYXRhTW9kZWxbbl09e307XG5cdFx0XHRcdH1cblx0XHRcdFx0LyogdXBkYXRlIGRhdGEgYWJzb2x1dGUgcmFuZ2UgKi9cblx0XHRcdFx0ZGF0YU1vZGVsW25dLnJhbmdlPWRhdGFbbl0ucmFuZ2U7XG5cdFx0XHRcdC8qIHVwZGF0ZSBkYXRhIHJhbmdlICovXG5cdFx0XHRcdGRhdGFNb2RlbFtuXS50aW1lUmFuZ2U9ZGF0YVtuXS50aW1lUmFuZ2U7XG5cdFx0XHRcdC8qIHVwZGF0ZSBkYXRhIGxhYmVsICovXG5cdFx0XHRcdGRhdGFNb2RlbFtuXS5sYWJlbD1kYXRhW25dLmxhYmVsO1xuXHRcdFx0XHQvKiB1cGRhdGUgZGF0YSB1bml0ICovXG5cdFx0XHRcdGRhdGFNb2RlbFtuXS51bml0PWRhdGFbbl0udW5pdDtcblx0XHRcdFx0LyogdXBkYXRlIGRhdGEgcHJlY2lzaW9uICovXG5cdFx0XHRcdGRhdGFNb2RlbFtuXS5wcmVjaXNpb249ZGF0YVtuXS5wcmVjaXNpb247XG5cdFx0XHRcdC8qIHVwZGF0ZSBkYXRhIGNhdGVnb3JpZXMgKi9cblx0XHRcdFx0ZGF0YU1vZGVsW25dLmNhdGVnb3J5PWRhdGFbbl0uY2F0ZWdvcnk7XG5cblx0XHRcdFx0Lyogc3VnZ2VzdGVkIHkgZGlzcGxheSByYW5nZSAqL1xuXHRcdFx0XHRkYXRhTW9kZWxbbl0uem9vbVJhbmdlID0gWzAsIDEwMF07XG5cblx0XHRcdFx0LyogdXBkYXRlIGRhdGEgaW5kZXhSYW5nZSAqL1xuXHRcdFx0XHRkYXRhTW9kZWxbbl0ucXVhbGl0eUNvbmZpZz17XG5cdFx0XHRcdFx0LyogY29uZm9ydFJhbmdlOiBkYXRhW25dLmNvbmZvcnRSYW5nZSwgKi9cblx0XHRcdFx0XHRpbmRleFJhbmdlOiBkYXRhW25dLmluZGV4UmFuZ2Vcblx0XHRcdFx0fTtcblx0XHRcdFx0ZGF0YU1vZGVsW25dLnRpbWUgPSB0aGlzLl9jb2Rlci5mcm9tKGRhdGFbbl0udGltZSwnYjY0Jyw4KTtcblx0XHRcdFx0ZGF0YU1vZGVsW25dLmRhdGEgPSAoZGF0YVtuXS5kYXRhP3RoaXMuX2NvZGVyLmZyb20oZGF0YVtuXS5kYXRhLCdiNjQnLDQpOihkYXRhW25dLmF2Zz90aGlzLl9jb2Rlci5mcm9tKGRhdGFbbl0uYXZnLmQsJ2I2NCcsNCk6bnVsbCkpO1xuXHRcdFx0XHRkYXRhTW9kZWxbbl0ucXVhbGl0eUluZGV4ID0gKGRhdGFbbl0uZGF0YT90aGlzLl9jb2Rlci5mcm9tKGRhdGFbbl0uaW5kZXgsJ2I2NCcsNCk6KGRhdGFbbl0uYXZnP3RoaXMuX2NvZGVyLmZyb20oZGF0YVtuXS5hdmcuaSwnYjY0Jyw0KTpudWxsKSk7XG5cdFx0XHRcdGRhdGFNb2RlbFtuXS5yb2JvdElkID0gdGhpcy5fY29kZXIuZnJvbShkYXRhW25dLnJvYm90SWQsJ2I2NCcsNCk7XG5cdFx0XHRcdGlmKGRhdGFNb2RlbFtuXS5yb2JvdElkKSB7XG5cdFx0XHRcdFx0LyoqIGRpY28gcm9ib3RJZCAtPiByb2JvdE5hbWUgKiovXG5cdFx0XHRcdFx0dmFyIGRpY29Sb2JvdCA9IHt9O1xuXHRcdFx0XHRcdGRhdGEuaGVhZGVyLnJvYm90cy5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG5cdFx0XHRcdFx0XHRkaWNvUm9ib3RbZWwuaWRdPWVsLm5hbWU7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0ZGF0YU1vZGVsW25dLnJvYm90SWQgPSBkYXRhTW9kZWxbbl0ucm9ib3RJZC5tYXAoZnVuY3Rpb24oZWwpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkaWNvUm9ib3RbZWxdO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGF0YU1vZGVsW25dLnBsYWNlSWQgPSB0aGlzLl9jb2Rlci5mcm9tKGRhdGFbbl0ucGxhY2VJZCwnYjY0Jyw0KTtcblx0XHRcdFx0ZGF0YU1vZGVsW25dLnggPSBudWxsO1xuXHRcdFx0XHRkYXRhTW9kZWxbbl0ueSA9IG51bGw7XG5cblx0XHRcdFx0aWYoZGF0YVtuXS5hdmcpXG5cdFx0XHRcdFx0ZGF0YU1vZGVsW25dLmF2ZyA9IHtcblx0XHRcdFx0XHRcdGQ6IHRoaXMuX2NvZGVyLmZyb20oZGF0YVtuXS5hdmcuZCwnYjY0Jyw0KSxcblx0XHRcdFx0XHRcdGk6IHRoaXMuX2NvZGVyLmZyb20oZGF0YVtuXS5hdmcuaSwnYjY0Jyw0KVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdGlmKGRhdGFbbl0ubWluKVxuXHRcdFx0XHRcdGRhdGFNb2RlbFtuXS5taW4gPSB7XG5cdFx0XHRcdFx0XHRkOiB0aGlzLl9jb2Rlci5mcm9tKGRhdGFbbl0ubWluLmQsJ2I2NCcsNCksXG5cdFx0XHRcdFx0XHRpOiB0aGlzLl9jb2Rlci5mcm9tKGRhdGFbbl0ubWluLmksJ2I2NCcsNClcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRpZihkYXRhW25dLm1heClcblx0XHRcdFx0XHRkYXRhTW9kZWxbbl0ubWF4ID0ge1xuXHRcdFx0XHRcdFx0ZDogdGhpcy5fY29kZXIuZnJvbShkYXRhW25dLm1heC5kLCdiNjQnLDQpLFxuXHRcdFx0XHRcdFx0aTogdGhpcy5fY29kZXIuZnJvbShkYXRhW25dLm1heC5pLCdiNjQnLDQpXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0aWYoZGF0YVtuXS5zdGRkZXYpXG5cdFx0XHRcdFx0ZGF0YU1vZGVsW25dLnN0ZGRldiA9IHtcblx0XHRcdFx0XHRcdGQ6IHRoaXMuX2NvZGVyLmZyb20oZGF0YVtuXS5zdGRkZXYuZCwnYjY0Jyw0KSxcblx0XHRcdFx0XHRcdGk6IHRoaXMuX2NvZGVyLmZyb20oZGF0YVtuXS5zdGRkZXYuaSwnYjY0Jyw0KVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdGlmKGRhdGFbbl0uc3RkZGV2KVxuXHRcdFx0XHRcdGRhdGFNb2RlbFtuXS5zdGRkZXYgPSB7XG5cdFx0XHRcdFx0XHRkOiB0aGlzLl9jb2Rlci5mcm9tKGRhdGFbbl0uc3RkZGV2LmQsJ2I2NCcsNCksXG5cdFx0XHRcdFx0XHRpOiB0aGlzLl9jb2Rlci5mcm9tKGRhdGFbbl0uc3RkZGV2LmksJ2I2NCcsNClcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRpZihkYXRhW25dLngpXG5cdFx0XHRcdFx0ZGF0YU1vZGVsW25dLnggPSB0aGlzLl9jb2Rlci5mcm9tKGRhdGFbbl0ueCwnYjY0Jyw0KTtcblx0XHRcdFx0aWYoZGF0YVtuXS55KVxuXHRcdFx0XHRcdGRhdGFNb2RlbFtuXS55ID0gdGhpcy5fY29kZXIuZnJvbShkYXRhW25dLnksJ2I2NCcsNCk7XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBjdXJyZW50IHF1YWxpdHkgOiB7J2InYWQsICdtJ2VkaXVtLCAnZydvb2R9XG5cdFx0XHRcdCAqIGV2b2x1dGlvbiA6IHsndSdwLCAnZCdvd24sICdzJ3RhYmxlfVxuXHRcdFx0XHQgKiBldm9sdXRpb24gcXVhbGl0eSA6IHsnYidldHRlciwgJ3cnb3JzZSwgJ3MnYW1lfVxuXHRcdFx0XHQgKi9cblx0XHRcdFx0Ly8vIFRPRE9cblx0XHRcdFx0ZGF0YU1vZGVsW25dLnRyZW5kID0gJ21zcyc7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGVsc2Uge1xuXHRcdExvZ2dlci5lcnJvcihcIk5vIERhdGEgdG8gcmVhZCBvciBoZWFkZXIgaXMgbWlzc2luZyAhXCIpO1xuXHR9XG5cdC8qKiBsaXN0IHJvYm90cyAqKi9cbi8vXHRkYXRhTW9kZWwucm9ib3RzID0gW3tuYW1lOiAnRDJSMicsIGlkOjF9XTtcblx0dGhpcy5kYXRhTW9kZWw9ZGF0YU1vZGVsO1xuXHRyZXR1cm4gZGF0YU1vZGVsO1xufTtcblxuXG5cblxuXG4vKiogY3JlYXRlIElFUSBzZXJ2aWNlICoqL1xuRGl5YVNlbGVjdG9yLnByb3RvdHlwZS5JRVEgPSBmdW5jdGlvbigpe1xuXHRyZXR1cm4gbmV3IElFUSh0aGlzKTtcbn07XG4iLCJ2YXIgRGl5YVNlbGVjdG9yID0gcmVxdWlyZSgnLi4vLi4vRGl5YVNlbGVjdG9yJykuRGl5YVNlbGVjdG9yO1xudmFyIGQxID0gcmVxdWlyZSgnLi4vLi4vRGl5YVNlbGVjdG9yJyk7XG52YXIgaXNCcm93c2VyID0gISh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyk7XG5pZighaXNCcm93c2VyKSB7IHZhciBRID0gcmVxdWlyZSgncScpOyB9XG5lbHNlIHsgdmFyIFEgPSB3aW5kb3cuUTsgfVxuXG5cbmQxLmtub3duUGVlcnMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIGQxKFwiI3NlbGZcIikua25vd25QZWVycygpO1xufTtcbmQxLmtwID0gZDEua25vd25QZWVycztcblxuXG5cbkRpeWFTZWxlY3Rvci5wcm90b3R5cGUua25vd25QZWVycyA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcblx0dGhpcy5yZXF1ZXN0KHtzZXJ2aWNlOiAnbWVzaE5ldHdvcmsnLGZ1bmM6ICdMaXN0S25vd25QZWVycyd9LCBmdW5jdGlvbihwZWVySWQsIGVyciwgZGF0YSl7XG5cdFx0aWYoZXJyKSByZXR1cm4gZGVmZXJyZWQucmVqZWN0KGVycik7XG5cdFx0dmFyIHBlZXJzID0gW107XG5cdFx0Zm9yKHZhciBpPTA7IGk8ZGF0YS5sZW5ndGg7IGkrKykgcGVlcnMucHVzaChkYXRhW2ldLnBlZXJfbmFtZSk7XG5cdFx0cmV0dXJuIGRlZmVycmVkLnJlc29sdmUocGVlcnMpO1xuXHR9KTtcblx0cmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cblxuXG5kMS5saXN0ZW5NZXNoTmV0d29yayA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdHJldHVybiBkMSgvLiovKS5zdWJzY3JpYmUoeyBzZXJ2aWNlOiAnbWVzaE5ldHdvcmsnLCBmdW5jOiAnTWVzaE5ldHdvcmsnIH0sIGNhbGxiYWNrLCB7YXV0bzogdHJ1ZX0pO1xufTtcbiIsIi8qIG1heWEtY2xpZW50XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBQYXJ0bmVyaW5nIFJvYm90aWNzLCBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogVGhpcyBsaWJyYXJ5IGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vclxuICogbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpY1xuICogTGljZW5zZSBhcyBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbjsgdmVyc2lvblxuICogIDMuMCBvZiB0aGUgTGljZW5zZSBUaGlzIGxpYnJhcnkgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGVcbiAqIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuXG4gKiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpY1xuICogTGljZW5zZSBhbG9uZyB3aXRoIHRoaXMgbGlicmFyeS5cbiAqL1xuXG5cblxuZnVuY3Rpb24gTWVzc2FnZShzZXJ2aWNlLCBmdW5jLCBvYmosIHBlcm1hbmVudCl7XG5cblx0dGhpcy5zZXJ2aWNlID0gc2VydmljZTtcblx0dGhpcy5mdW5jID0gZnVuYztcblx0dGhpcy5vYmogPSBvYmo7XG5cdFxuXHR0aGlzLnBlcm1hbmVudCA9IHBlcm1hbmVudDsgLy9JZiB0aGlzIGZsYWcgaXMgb24sIHRoZSBjb21tYW5kIHdpbGwgc3RheSBvbiB0aGUgY2FsbGJhY2sgbGlzdCBsaXN0ZW5pbmcgZm9yIGV2ZW50c1xufVxuXG5NZXNzYWdlLmJ1aWxkU2lnbmF0dXJlID0gZnVuY3Rpb24obXNnKXtcblx0cmV0dXJuIG1zZy5zZXJ2aWNlKycuJyttc2cuZnVuYysnLicrbXNnLm9iajtcbn1cblxuXG5NZXNzYWdlLnByb3RvdHlwZS5zaWduYXR1cmUgPSBmdW5jdGlvbigpe1xuXHRyZXR1cm4gdGhpcy5zZXJ2aWNlKycuJyt0aGlzLmZ1bmMrJy4nK3RoaXMub2JqO1xufVxuXG5NZXNzYWdlLnByb3RvdHlwZS5leGVjID0gZnVuY3Rpb24oZGF0YSl7XG5cdHJldHVybiB7XG5cdFx0c2VydmljZTogdGhpcy5zZXJ2aWNlLFxuXHRcdGZ1bmM6IHRoaXMuZnVuYyxcblx0XHRvYmo6IHRoaXMub2JqLFxuXHRcdGRhdGE6IGRhdGFcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lc3NhZ2U7XG4iLCJ2YXIgRGl5YVNlbGVjdG9yID0gcmVxdWlyZSgnLi4vLi4vRGl5YVNlbGVjdG9yJykuRGl5YVNlbGVjdG9yO1xudmFyIGQxID0gcmVxdWlyZSgnLi4vLi4vRGl5YVNlbGVjdG9yJyk7XG52YXIgaXNCcm93c2VyID0gISh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyk7XG5pZighaXNCcm93c2VyKSB7IHZhciBRID0gcmVxdWlyZSgncScpOyB9XG5lbHNlIHsgdmFyIFEgPSB3aW5kb3cuUTsgfVxuXG5pZih0eXBlb2YgSU5GTyA9PT0gJ3VuZGVmaW5lZCcpIHZhciBJTkZPID0gZnVuY3Rpb24ocykgeyBjb25zb2xlLmxvZyhzKTt9XG5pZih0eXBlb2YgT0sgPT09ICd1bmRlZmluZWQnKSB2YXIgT0sgPSBmdW5jdGlvbihzKSB7IGNvbnNvbGUubG9nKHMpO31cblxuXG5cbi8qKlxuKiBJbnN0YWxscyBhIG5ldyBEaXlhTm9kZSBkZXZpY2UgKHdpdGggYWRkcmVzcyAnaXAnKSBpbnRvIGFuIGV4aXN0aW5nIG5ldHdvcmssIGJ5XG4qIGNvbnRhY3RpbmcgYW4gZXhpc3RpbmcgRGl5YU5vZGUgZGV2aWNlIHdpdGggYWRkcmVzcyAnYm9vdHN0cmFwX2lwJyA6XG4qICAgMSkgQ29udGFjdCB0aGUgbmV3IG5vZGUgdG8gZ2V0IGl0cyBwdWJsaWMga2V5XG4qICAgMikgQWRkIHRoaXMgcHVibGljIGtleSB0byB0aGUgZXhpc3Rpbmcgbm9kZSBUcnVzdGVkUGVlcnMgbGlzdFxuKiAgIDMpIEFkZCB0aGUgZXhpc3Rpbmcgbm9kZSdzIHB1YmxpYyBrZXkgdG8gdGhlIG5ldyBub2RlJ3MgVHJ1c3RlZFBlZXJzIGxpc3RcbiogICA0KSBBc2sgdGhlIG5ldyBub2RlIHRvIGpvaW4gdGhlIG5ldHdvcmsgYnkgY2FsbGluZyBAc2Vle2QxKCkuam9pbigpfVxuKlxuKiBOT1RFIDogVGhpcyBvcGVyYXRpb24gcmVxdWlyZXMgdGhlIGdpdmVuIHVzZXIgdG8gaGF2ZSByb290IHJvbGUgb24gYm90aCBub2Rlc1xuKlxuKiBAcGFyYW0gaXAgOiB0aGUgSVAgYWRkcmVzcyBvZiB0aGUgbmV3IGRldmljZVxuKiBAcGFyYW0gdXNlciA6IGEgdXNlcm5hbWUgd2l0aCByb290IHJvbGUgb24gdGhlIG5ldyBkZXZpY2VcbiogQHBhcmFtIHBhc3N3b3JkIDogdGhlIHBhc3N3b3JkIGZvciAndXNlcidcbiogQHBhcmFtIGJvb3RzdHJhcF9pcCA6IHRoZSBJUCBhZGRyZXNzIG9mIHRoZSBib290c3RyYXAgZGV2aWNlXG4qIEBwYXJhbSBib290c3RyYXBfdXNlciA6IGEgdXNlciBpZGVudGlmaWVyIHdpdGggcm9vdCByb2xlIG9uIHRoZSBib29zdHJhcCBkZXZpY2VcbiogQHBhcmFtIGJvb3RzdHJhcF9wYXNzd29yZCA6IHRoZSBwYXNzd29yZCBmb3IgJ2Jvb3RzdHJhcF91c2VyJ1xuKiBAcGFyYW0gYm9vdHN0cmFwX25ldCA6IHRoZSBJUCBhZGRyZXNzIHdoZXJlIHRoZSBuZXcgZGV2aWNlIHdpbGwgY29ubmVjdCB0byB0aGUgYm9vc3RyYXAgb25lXG4qIEBwYXJhbSBjYWxsYmFjayA6IG9mIHRoZSBmb3JtIGNhbGxiYWNrKG5ld19wZWVyX25hbWUsYm9vdHN0cmFwX3BlZXJfbmFtZSwgZXJyLCBkYXRhKVxuKi9cbmQxLmluc3RhbGxOb2RlRXh0ID0gZnVuY3Rpb24oaXAsIHVzZXIsIHBhc3N3b3JkLCBib290c3RyYXBfaXAsIGJvb3RzdHJhcF91c2VyLCBib290c3RyYXBfcGFzc3dvcmQsIGJvb3RzdHJhcF9uZXQsIGNhbGxiYWNrKSB7XG5cdGlmKHR5cGVvZiBpcCAhPT0gJ3N0cmluZycpIHRocm93IFwiW2luc3RhbGxOb2RlXSBpcCBzaG91bGQgYmUgYW4gSVAgYWRkcmVzc1wiO1xuXHRpZih0eXBlb2YgYm9vdHN0cmFwX2lwICE9PSAnc3RyaW5nJykgdGhyb3cgXCJbaW5zdGFsbE5vZGVdIGJvb3RzdHJhcF9pcCBzaG91bGQgYmUgYW4gSVAgYWRkcmVzc1wiO1xuXHRpZih0eXBlb2YgYm9vdHN0cmFwX25ldCAhPT0gJ3N0cmluZycpIHRocm93IFwiW2luc3RhbGxOb2RlXSBib290c3RyYXBfbmV0IHNob3VsZCBiZSBhbiBJUCBhZGRyZXNzXCI7XG5cblx0Ly8gQ2hlY2sgYW5kIEZvcm1hdCBVUkkgKEZRRE4pXG5cdGlmKGJvb3RzdHJhcF9pcC5pbmRleE9mKFwid3M6Ly9cIikgIT09IDAgJiYgYm9vdHN0cmFwX2lwLmluZGV4T2YoXCJ3c3M6Ly9cIikgIT09IDApIHtcblx0XHRpZihkMS5pc1NlY3VyZWQoKSkgYm9vdHN0cmFwX2lwID0gXCJ3c3M6Ly9cIiArIGJvb3RzdHJhcF9pcDtcblx0XHRlbHNlIGJvb3RzdHJhcF9pcCA9IFwid3M6Ly9cIiArIGJvb3RzdHJhcF9pcDtcblx0fVxuXHRpZihib290c3RyYXBfbmV0LmluZGV4T2YoXCJ3czovL1wiKSAhPT0gMCAmJiBib290c3RyYXBfbmV0LmluZGV4T2YoXCJ3c3M6Ly9cIikgIT09IDApIHtcblx0XHRpZihkMS5pc1NlY3VyZWQoKSkgYm9vdHN0cmFwX25ldCA9IFwid3NzOi8vXCIgKyBib290c3RyYXBfbmV0O1xuXHRcdGVsc2UgYm9vdHN0cmFwX25ldCA9IFwid3M6Ly9cIiArIGJvb3RzdHJhcF9uZXQ7XG5cdH1cblxuXG5cblx0ZnVuY3Rpb24gam9pbihwZWVyLCBib290c3RyYXBfcGVlcikge1xuXHRcdGQxKFwiI3NlbGZcIikuam9pbihib290c3RyYXBfbmV0LCB0cnVlLCBmdW5jdGlvbihwZWVyLCBlcnIsIGRhdGEpe1xuXHRcdFx0aWYoIWVycikgT0soXCJKT0lORUQgISEhXCIpO1xuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKHBlZXIsIGJvb3RzdHJhcF9wZWVyLCBlcnIsIGRhdGEpO1xuXHRcdH0pO1xuXHR9XG5cblx0ZDEuY29ubmVjdEFzVXNlcihpcCwgdXNlciwgcGFzc3dvcmQpLnRoZW4oZnVuY3Rpb24ocGVlciwgZXJyLCBkYXRhKXtcblx0XHRkMShcIiNzZWxmXCIpLmdpdmVQdWJsaWNLZXkoZnVuY3Rpb24ocGVlciwgZXJyLCBkYXRhKSB7XG5cdFx0XHRpZihlcnI9PT0nU2VydmljZU5vdEZvdW5kJykge1xuXHRcdFx0XHRJTkZPKFwiUGVlciBBdXRoZW50aWNhdGlvbiBkaXNhYmxlZCAuLi4gZGlyZWN0bHkgam9pbmluZ1wiKTtcblx0XHRcdFx0am9pbigpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKGVycikgcmV0dXJuIGNhbGxiYWNrKHBlZXIsIG51bGwsIGVyciwgbnVsbCk7XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0SU5GTyhcIkFkZCB0cnVzdGVkIHBlZXIgJ1wiICsgcGVlciArIFwiJyAoaXA9XCIgKyBpcCArIFwiKSB0byAnXCIgKyBib290c3RyYXBfaXAgKyBcIicgd2l0aCBwdWJsaWMga2V5XFxuXCIgKyBkYXRhLnB1YmxpY19rZXkpXG5cdFx0XHRcdGQxLmNvbm5lY3RBc1VzZXIoYm9vdHN0cmFwX2lwLCBib290c3RyYXBfdXNlciwgYm9vdHN0cmFwX3Bhc3N3b3JkKS50aGVuKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0ZDEoXCIjc2VsZlwiKS5hZGRUcnVzdGVkUGVlcihwZWVyLCBkYXRhLnB1YmxpY19rZXksIGZ1bmN0aW9uKGJvb3RzdHJhcF9wZWVyLCBlcnIsIFthbHJlYWR5VHJ1c3RlZCwgcHVibGljX2tleV0pIHtcblxuXHRcdFx0XHRcdFx0aWYoZXJyKSByZXR1cm4gY2FsbGJhY2socGVlciwgYm9vdHN0cmFwX3BlZXIsIGVyciwgbnVsbCk7XG5cdFx0XHRcdFx0XHRpZihhbHJlYWR5VHJ1c3RlZCkgSU5GTyhwZWVyICsgXCIgYWxyZWFkeSB0cnVzdGVkIGJ5IFwiICsgYm9vdHN0cmFwX3BlZXIpO1xuXHRcdFx0XHRcdFx0ZWxzZSBJTkZPKGJvb3RzdHJhcF9wZWVyICsgXCIoaXA9XCIrIGJvb3RzdHJhcF9pcCArXCIpIGFkZGVkIFwiICsgcGVlciArIFwiKGlwPVwiICsgaXAgKyBcIikgYXMgYSBUcnVzdGVkIFBlZXJcIik7XG5cblx0XHRcdFx0XHRcdGQxKCcjc2VsZicpLmdpdmVQdWJsaWNLZXkoZnVuY3Rpb24oXywgZXJyLCBkYXRhKSB7XG5cdFx0XHRcdFx0XHRcdElORk8oXCJJbiByZXR1cm4sIGFkZCBcIiArIGJvb3RzdHJhcF9wZWVyICsgXCIgdG8gXCIgKyBwZWVyICsgXCIgYXMgYSBUcnVzdGVkIFBlZXIgd2l0aCBwdWJsaWMga2V5IFwiICsgZGF0YS5wdWJsaWNfa2V5KVxuXHRcdFx0XHRcdFx0XHRkMS5jb25uZWN0QXNVc2VyKGlwLCB1c2VyLCBwYXNzd29yZCkudGhlbihmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdGQxKFwiI3NlbGZcIikuYWRkVHJ1c3RlZFBlZXIoYm9vdHN0cmFwX3BlZXIsIGRhdGEucHVibGljX2tleSwgZnVuY3Rpb24ocGVlciwgZXJyLCBbYWxyZWFkeVRydXN0ZWQsIHB1YmxpY19rZXldKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZihlcnIpIGNhbGxiYWNrKHBlZXIsIGJvb3RzdHJhcF9wZWVyLCBlcnIsIG51bGwpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBpZihhbHJlYWR5VHJ1c3RlZCkgSU5GTyhib290c3RyYXBfcGVlciArIFwiIGFscmVhZHkgdHJ1c3RlZCBieSBcIiArIHBlZXIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSBJTkZPKHBlZXIgKyBcIihpcD1cIisgaXAgK1wiKSBhZGRlZCBcIiArIGJvb3RzdHJhcF9wZWVyICsgXCIoaXA9XCIrIGJvb3RzdHJhcF9pcCArXCIpIGFzIGEgVHJ1c3RlZCBQZWVyXCIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gT25jZSBLZXlzIGhhdmUgYmVlbiBleGNoYW5nZWQgYXNrIHRvIGpvaW4gdGhlIG5ldHdvcmtcblx0XHRcdFx0XHRcdFx0XHRcdE9LKFwiS0VZUyBPSyAhIE5vdywgbGV0IFwiK3BlZXIrXCIoaXA9XCIraXArXCIpIGpvaW4gdGhlIG5ldHdvcmsgdmlhIFwiK2Jvb3RzdHJhcF9wZWVyK1wiKGlwPVwiK2Jvb3RzdHJhcF9uZXQrXCIpIC4uLlwiKTtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBqb2luKHBlZXIsIGJvb3RzdHJhcF9wZWVyKTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG59XG5cblxuLyoqIFNob3J0IHZlcnNpb24gb2YgQHNlZXtkMS5pbnN0YWxsTm9kZUV4dH0gKi9cbmQxLmluc3RhbGxOb2RlID0gZnVuY3Rpb24oYm9vdHN0cmFwX2lwLCBib290c3RyYXBfbmV0LCBjYWxsYmFjaykge1xuXHRcdHZhciBpcCA9IGQxLmFkZHIoKTtcblx0XHR2YXIgdXNlciA9IGQxLnVzZXIoKTtcblx0XHR2YXIgcGFzc3dvcmQgPSBkMS5wYXNzKCk7XG5cdFx0dmFyIGJvb3RzdHJhcF91c2VyID0gdXNlcjtcblx0XHR2YXIgYm9vdHN0cmFwX3Bhc3N3b3JkID0gcGFzc3dvcmQ7XG5cblx0XHRjb25zb2xlLmxvZyAoYFtpbnN0YWxsTm9kZV1cXG5pcDoke2lwfWApXG5cblx0XHRyZXR1cm4gZDEuaW5zdGFsbE5vZGVFeHQoaXAsIHVzZXIsIHBhc3N3b3JkLCBib290c3RyYXBfaXAsIGJvb3RzdHJhcF91c2VyLCBib290c3RyYXBfcGFzc3dvcmQsIGJvb3RzdHJhcF9uZXQsIGNhbGxiYWNrKTtcbn1cblxuXG5cblxuLyoqXG4gKiBNYWtlIHRoZSBzZWxlY3RlZCBEaXlhTm9kZXMgam9pbiBhbiBleGlzdGluZyBEaXlhTm9kZXMgTWVzaCBOZXR3b3JrIGJ5IGNvbnRhY3RpbmdcbiAqIHRoZSBnaXZlbiBib290c3RyYXAgcGVlcnMuXG4gKlxuICogTk9URSA6IFRoaXMgb3BlcmF0aW9uIHJlcXVpcmVzIHJvb3Qgcm9sZVxuICpcbiAqIEBwYXJhbSBib290c3RyYXBfaXBzIDogYW4gYXJyYXkgb2YgYm9vdHN0cmFwIElQIGFkZHJlc3NlcyB0byBjb250YWN0IHRvIGpvaW4gdGhlIE5ldHdvcmtcbiAqIEBwYXJhbSBwZXJtYW5lbnQgOiBpZiB0cnVlLCBwZXJtYW5lbnRseSBhZGQgdGhlIGJvb3RzdHJhcCBwZWVycyBhcyBhdXRvbWF0aWMgYm9vdHN0cmFwIHBlZXJzIGZvciB0aGUgc2VsZWN0ZWQgbm9kZXMuXG4gKlxuICovXG5EaXlhU2VsZWN0b3IucHJvdG90eXBlLmpvaW4gPSBmdW5jdGlvbihib290c3RyYXBfaXBzLCBwZXJtYW5lbnQsIGNhbGxiYWNrKSB7XG5cdGlmKHR5cGVvZiBib290c3RyYXBfaXBzID09PSAnc3RyaW5nJykgYm9vdHN0cmFwX2lwcyA9IFsgYm9vdHN0cmFwX2lwcyBdXG5cblx0aWYoYm9vdHN0cmFwX2lwcy5jb25zdHJ1Y3RvciAhPT0gQXJyYXkpXG5cdFx0dGhyb3cgXCJqb2luKCkgOiBib290c3RyYXBfaXBzIHNob3VsZCBiZSBhbiBhcnJheSBvZiBwZWVycyBVUklzXCJcblxuXHR0aGlzLnJlcXVlc3Qoe1xuXHRcdHNlcnZpY2UgOiAnbWVzaE5ldHdvcmsnLFxuXHRcdGZ1bmM6ICdKb2luJyxcblx0XHRkYXRhOiB7XG5cdFx0XHRib290c3RyYXBfaXBzLFxuXHRcdFx0cGVybWFuZW50XG5cdFx0fVxuXHR9LFxuXHRcdGZ1bmN0aW9uKHBlZXJJZCwgZXJyLCBkYXRhKSB7XG5cdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpXG5cdFx0XHRcdGNhbGxiYWNrKHBlZXJJZCwgZXJyLCBkYXRhKVxuXHRcdH1cblx0KVxufVxuXG5cbi8qKlxuICogRGlzY29ubmVjdCB0aGUgc2VsZWN0ZWQgRGl5YU5vZGVzIGZyb20gdGhlIGdpdmVuIGJvb3RzdHJhcCBwZWVyc1xuICpcbiAqIE5PVEUgOiBUaGlzIG9wZXJhdGlvbiByZXF1aXJlcyByb290IHJvbGVcbiAqXG4gKiBAcGFyYW0gYm9vdHN0cmFwX2lwcyA6IGFuIGFycmF5IG9mIGJvb3RzdHJhcCBJUCBhZGRyZXNzZXMgdG8gbGVhdmVcbiAqIEBwYXJhbSBiUGVybWFuZW50IDogaWYgdHJ1ZSwgcGVybWFuZW50bHkgcmVtb3ZlIHRoZSBnaXZlbiBwZWVycyBmcm9tIHRoZSBhdXRvbWF0aWMgYm9vdHN0cmFwIHBlZXJzIGxpc3RcbiAqXG4gKi9cbkRpeWFTZWxlY3Rvci5wcm90b3R5cGUubGVhdmUgPSBmdW5jdGlvbihib290c3RyYXBfaXBzLCBiUGVybWFuZW50LCBjYWxsYmFjayl7XG5cdGlmKHR5cGVvZiBib290c3RyYXBfaXBzID09PSAnc3RyaW5nJykgYm9vdHN0cmFwX2lwcyA9IFsgYm9vdHN0cmFwX2lwcyBdO1xuXHRpZihib290c3RyYXBfaXBzLmNvbnN0cnVjdG9yICE9PSBBcnJheSkgdGhyb3cgXCJsZWF2ZSgpIDogYm9vdHN0cmFwX2lwcyBzaG91bGQgYmUgYW4gYXJyYXkgb2YgcGVlcnMgVVJJc1wiO1xuXHR0aGlzLnJlcXVlc3QoXG5cdFx0e3NlcnZpY2UgOiAnbWVzaE5ldHdvcmsnLCBmdW5jOiAnTGVhdmUnLCBkYXRhOiB7IGJvb3RzdHJhcF9pcHM6IGJvb3RzdHJhcF9pcHMsIGJQZXJtYW5lbnQ6IGJQZXJtYW5lbnQgfX0sXG5cdFx0ZnVuY3Rpb24ocGVlcklkLCBlcnIsIGRhdGEpIHsgaWYodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIGNhbGxiYWNrKHBlZXJJZCwgZXJyLCBkYXRhKTt9XG5cdCk7XG59O1xuXG5cbi8qKlxuICogQXNrIHRoZSBzZWxlY3RlZCBEaXlhTm9kZXMgZm9yIHRoZWlyIHB1YmxpYyBrZXlzXG4gKi9cbkRpeWFTZWxlY3Rvci5wcm90b3R5cGUuZ2l2ZVB1YmxpY0tleSA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcblx0cmV0dXJuIHRoaXMucmVxdWVzdChcblx0XHR7IHNlcnZpY2U6ICdwZWVyQXV0aCcsXHRmdW5jOiAnR2l2ZVB1YmxpY0tleScsXHRkYXRhOiB7fSB9LFxuXHRcdGZ1bmN0aW9uKHBlZXJJZCwgZXJyLCBkYXRhKXtjYWxsYmFjayhwZWVySWQsZXJyLGRhdGEpO1xuXHR9KTtcbn07XG5cbi8qKlxuICogQWRkIGEgbmV3IHRydXN0ZWQgcGVlciBSU0EgcHVibGljIGtleSB0byB0aGUgc2VsZWN0ZWQgRGl5YU5vZGVzXG4gKiBOT1RFIDogVGhpcyBvcGVyYXRpb24gcmVxdWlyZXMgcm9vdCByb2xlXG4gKlxuICogQHBhcmFtIHBlZXJfbmFtZSA6IHRoZSBuYW1lIG9mIHRoZSBuZXcgdHJ1c3RlZCBEaXlhTm9kZSBwZWVyXG4gKiBAcGFyYW0gcHVibGljX2tleSA6IHRoZSBSU0EgcHVibGljIGtleSBvZiB0aGUgbmV3IHRydXN0ZWQgRGl5YU5vZGUgcGVlclxuICovXG5EaXlhU2VsZWN0b3IucHJvdG90eXBlLmFkZFRydXN0ZWRQZWVyID0gZnVuY3Rpb24obmFtZSwgcHVibGljX2tleSwgY2FsbGJhY2spIHtcblx0cmV0dXJuIHRoaXMucmVxdWVzdCh7XG5cdFx0c2VydmljZTogJ3BlZXJBdXRoJyxcblx0XHRmdW5jOiAnQWRkVHJ1c3RlZFBlZXInLFxuXHRcdGRhdGE6IHtcblx0XHRcdHBlZXJfbmFtZTogbmFtZSxcblx0XHRcdHB1YmxpY19rZXk6IHB1YmxpY19rZXlcblx0XHR9XG5cdH0sXG5cdFx0ZnVuY3Rpb24gKHBlZXJJZCxlcnIsZGF0YSkge1xuXHRcdFx0Y2FsbGJhY2sgKHBlZXJJZCxlcnIsZGF0YSlcblx0XHR9XG5cdClcbn1cblxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBzZWxlY3RlZCBEaXlhTm9kZXMgdHJ1c3QgdGhlIGdpdmVuIHBlZXJzXG4gKiBAcGFyYW0gcGVlcnMgOiBhbiBhcnJheSBvZiBwZWVyIG5hbWVzXG4gKi9cbkRpeWFTZWxlY3Rvci5wcm90b3R5cGUuYXJlVHJ1c3RlZCA9IGZ1bmN0aW9uKHBlZXJzLCBjYWxsYmFjayl7XG5cdHJldHVybiB0aGlzLnJlcXVlc3QoXG5cdFx0eyBzZXJ2aWNlOiAncGVlckF1dGgnLFx0ZnVuYzogJ0FyZVRydXN0ZWQnLFx0ZGF0YTogeyBwZWVyczogcGVlcnMgfSB9LFxuXHRcdGZ1bmN0aW9uKHBlZXJJZCwgZXJyLCBkYXRhKSB7XG5cdFx0XHR2YXIgYWxsVHJ1c3RlZCA9IGRhdGEudHJ1c3RlZDtcblx0XHRcdGlmKGFsbFRydXN0ZWQpIHsgT0socGVlcnMgKyBcIiBhcmUgdHJ1c3RlZCBieSBcIiArIHBlZXJJZCk7IGNhbGxiYWNrKHBlZXJJZCwgdHJ1ZSk7IH1cblx0XHRcdGVsc2UgeyBFUlIoXCJTb21lIHBlZXJzIGluIFwiICsgcGVlcnMgKyBcIiBhcmUgdW50cnVzdGVkIGJ5IFwiICsgcGVlcklkKTsgY2FsbGJhY2socGVlcklkLCBmYWxzZSk7IH1cblx0XHR9XG5cdCk7XG59O1xuRGl5YVNlbGVjdG9yLnByb3RvdHlwZS5pc1RydXN0ZWQgPSBmdW5jdGlvbihwZWVyLCBjYWxsYmFjaykgeyByZXR1cm4gdGhpcy5hcmVUcnVzdGVkKFtwZWVyXSwgY2FsbGJhY2spOyB9XG5cblxuZDEudHJ1c3RlZFBlZXJzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcblx0ZDEoXCIjc2VsZlwiKS5yZXF1ZXN0KFxuXHRcdHsgc2VydmljZTogJ3BlZXJBdXRoJyxcdGZ1bmM6ICdHZXRUcnVzdGVkUGVlcnMnIH0sXG5cdFx0ZnVuY3Rpb24ocGVlcklkLCBlcnIsIGRhdGEpIHtcblx0XHRcdGlmKGVycikgcmV0dXJuIGRlZmVycmVkLnJlamVjdChlcnIpO1xuXHRcdFx0dmFyIHBlZXJzID0gW107XG5cdFx0XHRmb3IodmFyIGk9MDsgaTxkYXRhLnBlZXJzLmxlbmd0aDsgaSsrKSBwZWVycy5wdXNoKGRhdGEucGVlcnNbaV0ubmFtZSk7XG5cdFx0XHRyZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShwZWVycyk7XG5cdFx0fVxuXHQpO1xuXHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5kMS50cCA9IGQxLnRydXN0ZWRQZWVyczsgLy8gU2hvcnRoYW5kXG5cbmQxLmJsYWNrbGlzdGVkUGVlcnMgPSBmdW5jdGlvbigpIHtcblx0dmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuXHRkMShcIiNzZWxmXCIpLnJlcXVlc3QoXG5cdFx0eyBzZXJ2aWNlOiAncGVlckF1dGgnLFx0ZnVuYzogJ0dldEJsYWNrbGlzdGVkUGVlcnMnIH0sXG5cdFx0ZnVuY3Rpb24ocGVlcklkLCBlcnIsIGRhdGEpIHtcblx0XHRcdGlmKGVycikgcmV0dXJuIGRlZmVycmVkLnJlamVjdChlcnIpO1xuXHRcdFx0dmFyIHBlZXJzID0gW107XG5cdFx0XHRmb3IodmFyIGk9MDsgaTxkYXRhLnBlZXJzLmxlbmd0aDsgaSsrKSBwZWVycy5wdXNoKGRhdGEucGVlcnNbaV0ubmFtZSk7XG5cdFx0XHRyZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShwZWVycyk7XG5cdFx0fVxuXHQpO1xuXHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5kMS5icCA9IGQxLmJsYWNrbGlzdGVkUGVlcnM7IC8vIFNob3J0aGFuZFxuIiwiLypcbiAqIENvcHlyaWdodCA6IFBhcnRuZXJpbmcgMy4wICgyMDA3LTIwMTYpXG4gKiBBdXRob3IgOiBTeWx2YWluIE1haMOpIDxzeWx2YWluLm1haGVAcGFydG5lcmluZy5mcj5cbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBkaXlhLXNkay5cbiAqXG4gKiBkaXlhLXNkayBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBkaXlhLXNkayBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBkaXlhLXNkay4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5cblxuXG5cbi8qIG1heWEtY2xpZW50XG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIFBhcnRuZXJpbmcgUm9ib3RpY3MsIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBUaGlzIGxpYnJhcnkgaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4gKiBtb2RpZnkgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljXG4gKiBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uOyB2ZXJzaW9uXG4gKlx0My4wIG9mIHRoZSBMaWNlbnNlLiBUaGlzIGxpYnJhcnkgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGVcbiAqIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuXG4gKiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpY1xuICogTGljZW5zZSBhbG9uZyB3aXRoIHRoaXMgbGlicmFyeS5cbiAqL1xuXG52YXIgaXNCcm93c2VyID0gISh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyk7XG5pZighaXNCcm93c2VyKSB7IHZhciBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTsgfVxuZWxzZSB7IHZhciBQcm9taXNlID0gd2luZG93LlByb21pc2U7IH1cbnZhciBEaXlhU2VsZWN0b3IgPSByZXF1aXJlKCcuLi8uLi9EaXlhU2VsZWN0b3InKS5EaXlhU2VsZWN0b3I7XG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcblxudmFyIE1lc3NhZ2UgPSByZXF1aXJlKCcuLi9tZXNzYWdlJyk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8gTG9nZ2luZyB1dGlsaXR5IG1ldGhvZHMgLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG52YXIgREVCVUcgPSB0cnVlO1xudmFyIExvZ2dlciA9IHtcblx0bG9nOiBmdW5jdGlvbihtZXNzYWdlKXtcblx0XHRpZihERUJVRykgY29uc29sZS5sb2cobWVzc2FnZSk7XG5cdH0sXG5cblx0ZXJyb3I6IGZ1bmN0aW9uKG1lc3NhZ2Upe1xuXHRcdGlmKERFQlVHKSBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuXHR9XG59O1xuXG4vKipcbiAqXHRjYWxsYmFjayA6IGZ1bmN0aW9uIGNhbGxlZCBhZnRlciBtb2RlbCB1cGRhdGVkXG4gKiAqL1xuZnVuY3Rpb24gU3RhdHVzKHNlbGVjdG9yKXtcblx0dGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yO1xuXHR0aGlzLl9jb2RlciA9IHNlbGVjdG9yLmVuY29kZSgpO1xuXHR0aGlzLnN1YnNjcmlwdGlvbnMgPSBbXTtcblxuXHQvKiogbW9kZWwgb2Ygcm9ib3QgOiBhdmFpbGFibGUgcGFydHMgYW5kIHN0YXR1cyAqKi9cblx0dGhpcy5yb2JvdE1vZGVsID0gW107XG5cdHRoaXMuX3JvYm90TW9kZWxJbml0ID0gZmFsc2U7XG5cblx0LyoqKiBzdHJ1Y3R1cmUgb2YgZGF0YSBjb25maWcgKioqXG5cdFx0IGNyaXRlcmlhIDpcblx0XHQgICB0aW1lOiBhbGwgMyB0aW1lIGNyaXRlcmlhIHNob3VsZCBub3QgYmUgZGVmaW5lZCBhdCB0aGUgc2FtZSB0aW1lLiAocmFuZ2Ugd291bGQgYmUgZ2l2ZW4gdXApXG5cdFx0ICAgICBiZWc6IHtbbnVsbF0sdGltZX0gKG51bGwgbWVhbnMgbW9zdCByZWNlbnQpIC8vIHN0b3JlZCBhIFVUQyBpbiBtcyAobnVtKVxuXHRcdCAgICAgZW5kOiB7W251bGxdLCB0aW1lfSAobnVsbCBtZWFucyBtb3N0IG9sZGVzdCkgLy8gc3RvcmVkIGFzIFVUQyBpbiBtcyAobnVtKVxuXHRcdCAgICAgcmFuZ2U6IHtbbnVsbF0sIHRpbWV9IChyYW5nZSBvZiB0aW1lKHBvc2l0aXZlKSApIC8vIGluIHMgKG51bSlcblx0XHQgICByb2JvdDoge0FycmF5T2YgSUQgb3IgW1wiYWxsXCJdfVxuXHRcdCAgIHBsYWNlOiB7QXJyYXlPZiBJRCBvciBbXCJhbGxcIl19XG5cdFx0IG9wZXJhdG9yOiB7W2xhc3RdLCBtYXgsIG1veSwgc2R9IC0oIG1heWJlIG1veSBzaG91bGQgYmUgZGVmYXVsdFxuXHRcdCAuLi5cblxuXHRcdCBwYXJ0cyA6IHtbbnVsbF0gb3IgQXJyYXlPZiBQYXJ0c0lkfSB0byBnZXQgZXJyb3JzXG5cdFx0IHN0YXR1cyA6IHtbbnVsbF0gb3IgQXJyYXlPZiBTdGF0dXNOYW1lfSB0byBnZXQgc3RhdHVzXG5cblx0XHQgc2FtcGxpbmc6IHtbbnVsbF0gb3IgaW50fVxuXHQqL1xuXHR0aGlzLmRhdGFDb25maWcgPSB7XG5cdFx0Y3JpdGVyaWE6IHtcblx0XHRcdHRpbWU6IHtcblx0XHRcdFx0YmVnOiBudWxsLFxuXHRcdFx0XHRlbmQ6IG51bGwsXG5cdFx0XHRcdHJhbmdlOiBudWxsIC8vIGluIHNcblx0XHRcdH0sXG5cdFx0XHRyb2JvdDogbnVsbFxuXHRcdH0sXG5cdFx0b3BlcmF0b3I6ICdsYXN0Jyxcblx0XHRwYXJ0czogbnVsbCxcblx0XHRzdGF0dXM6IG51bGxcblx0fTtcblxuXHRyZXR1cm4gdGhpcztcbn07XG4vKipcbiAqIEdldCByb2JvdE1vZGVsIDpcbiAqIHtcbiAqICBwYXJ0czoge1xuICpcdFx0XCJwYXJ0WFhcIjoge1xuICogXHRcdFx0IGVycm9yc0Rlc2NyOiB7IGVuY291bnRlcmVkIGVycm9ycyBpbmRleGVkIGJ5IGVycm9ySWRzPjAgfVxuICpcdFx0XHRcdD4gQ29uZmlnIG9mIGVycm9ycyA6XG4gKlx0XHRcdFx0XHRjcml0TGV2ZWw6IEZMT0FULCAvLyBjb3VsZCBiZSBpbnQuLi5cbiAqIFx0XHRcdFx0XHRtc2c6IFNUUklORyxcbiAqXHRcdFx0XHRcdHN0b3BTZXJ2aWNlSWQ6IFNUUklORyxcbiAqXHRcdFx0XHRcdHJ1blNjcmlwdDogU2VxdWVsaXplLlNUUklORyxcbiAqXHRcdFx0XHRcdG1pc3Npb25NYXNrOiBTZXF1ZWxpemUuSU5URUdFUixcbiAqXHRcdFx0XHRcdHJ1bkxldmVsOiBTZXF1ZWxpemUuSU5URUdFUlxuICpcdFx0XHRlcnJvcjpbRkxPQVQsIC4uLl0sIC8vIGNvdWxkIGJlIGludC4uLlxuICpcdFx0XHR0aW1lOltGTE9BVCwgLi4uXSxcbiAqXHRcdFx0cm9ib3Q6W0ZMT0FULCAuLi5dLFxuICpcdFx0XHQvLy8gcGxhY2U6W0ZMT0FULCAuLi5dLCBub3QgaW1wbGVtZW50ZWQgeWV0XG4gKlx0XHR9LFxuICpcdCBcdC4uLiAoXCJQYXJ0WVlcIilcbiAqICB9LFxuICogIHN0YXR1czoge1xuICpcdFx0XCJzdGF0dXNYWFwiOiB7XG4gKlx0XHRcdFx0ZGF0YTpbRkxPQVQsIC4uLl0sIC8vIGNvdWxkIGJlIGludC4uLlxuICpcdFx0XHRcdHRpbWU6W0ZMT0FULCAuLi5dLFxuICpcdFx0XHRcdHJvYm90OltGTE9BVCwgLi4uXSxcbiAqXHRcdFx0XHQvLy8gcGxhY2U6W0ZMT0FULCAuLi5dLCBub3QgaW1wbGVtZW50ZWQgeWV0XG4gKlx0XHRcdFx0cmFuZ2U6IFtGTE9BVCwgRkxPQVRdLFxuICpcdFx0XHRcdGxhYmVsOiBzdHJpbmdcbiAqXHRcdFx0fSxcbiAqXHQgXHQuLi4gKFwiU3RhdHVzWVlcIilcbiAqICB9XG4gKiB9XG4gKi9cblN0YXR1cy5wcm90b3R5cGUuZ2V0Um9ib3RNb2RlbCA9IGZ1bmN0aW9uKCl7XG5cdHJldHVybiB0aGlzLnJvYm90TW9kZWw7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhQ29uZmlnIGNvbmZpZyBmb3IgZGF0YSByZXF1ZXN0XG4gKiBpZiBkYXRhQ29uZmlnIGlzIGRlZmluZSA6IHNldCBhbmQgcmV0dXJuIHRoaXNcbiAqXHQgQHJldHVybiB7U3RhdHVzfSB0aGlzXG4gKiBlbHNlXG4gKlx0IEByZXR1cm4ge09iamVjdH0gY3VycmVudCBkYXRhQ29uZmlnXG4gKi9cblN0YXR1cy5wcm90b3R5cGUuRGF0YUNvbmZpZyA9IGZ1bmN0aW9uKG5ld0RhdGFDb25maWcpe1xuXHRpZihuZXdEYXRhQ29uZmlnKSB7XG5cdFx0dGhpcy5kYXRhQ29uZmlnPW5ld0RhdGFDb25maWc7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0ZWxzZVxuXHRcdHJldHVybiB0aGlzLmRhdGFDb25maWc7XG59O1xuLyoqXG4gKiBUTyBCRSBJTVBMRU1FTlRFRCA6IG9wZXJhdG9yIG1hbmFnZW1lbnQgaW4gRE4tU3RhdHVzXG4gKiBAcGFyYW0gIHtTdHJpbmd9XHQgbmV3T3BlcmF0b3IgOiB7W2xhc3RdLCBtYXgsIG1veSwgc2R9XG4gKiBAcmV0dXJuIHtTdGF0dXN9IHRoaXMgLSBjaGFpbmFibGVcbiAqIFNldCBvcGVyYXRvciBjcml0ZXJpYS5cbiAqIERlcGVuZHMgb24gbmV3T3BlcmF0b3JcbiAqXHRAcGFyYW0ge1N0cmluZ30gbmV3T3BlcmF0b3JcbiAqXHRAcmV0dXJuIHRoaXNcbiAqIEdldCBvcGVyYXRvciBjcml0ZXJpYS5cbiAqXHRAcmV0dXJuIHtTdHJpbmd9IG9wZXJhdG9yXG4gKi9cblN0YXR1cy5wcm90b3R5cGUuRGF0YU9wZXJhdG9yID0gZnVuY3Rpb24obmV3T3BlcmF0b3Ipe1xuXHRpZihuZXdPcGVyYXRvcikge1xuXHRcdHRoaXMuZGF0YUNvbmZpZy5vcGVyYXRvciA9IG5ld09wZXJhdG9yO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdGVsc2Vcblx0XHRyZXR1cm4gdGhpcy5kYXRhQ29uZmlnLm9wZXJhdG9yO1xufTtcbi8qKlxuICogRGVwZW5kcyBvbiBudW1TYW1wbGVzXG4gKiBAcGFyYW0ge2ludH0gbnVtYmVyIG9mIHNhbXBsZXMgaW4gZGF0YU1vZGVsXG4gKiBpZiBkZWZpbmVkIDogc2V0IG51bWJlciBvZiBzYW1wbGVzXG4gKlx0QHJldHVybiB7U3RhdHVzfSB0aGlzXG4gKiBlbHNlXG4gKlx0QHJldHVybiB7aW50fSBudW1iZXIgb2Ygc2FtcGxlc1xuICoqL1xuU3RhdHVzLnByb3RvdHlwZS5EYXRhU2FtcGxpbmcgPSBmdW5jdGlvbihudW1TYW1wbGVzKXtcblx0aWYobnVtU2FtcGxlcykge1xuXHRcdHRoaXMuZGF0YUNvbmZpZy5zYW1wbGluZyA9IG51bVNhbXBsZXM7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0ZWxzZVxuXHRcdHJldHVybiB0aGlzLmRhdGFDb25maWcuc2FtcGxpbmc7XG59O1xuLyoqXG4gKiBTZXQgb3IgZ2V0IGRhdGEgdGltZSBjcml0ZXJpYSBiZWcgYW5kIGVuZC5cbiAqIElmIHBhcmFtIGRlZmluZWRcbiAqXHRAcGFyYW0ge0RhdGV9IG5ld1RpbWVCZWcgLy8gbWF5IGJlIG51bGxcbiAqXHRAcGFyYW0ge0RhdGV9IG5ld1RpbWVFbmQgLy8gbWF5IGJlIG51bGxcbiAqXHRAcmV0dXJuIHtTdGF0dXN9IHRoaXNcbiAqIElmIG5vIHBhcmFtIGRlZmluZWQ6XG4gKlx0QHJldHVybiB7T2JqZWN0fSBUaW1lIG9iamVjdDogZmllbGRzIGJlZyBhbmQgZW5kLlxuICovXG5TdGF0dXMucHJvdG90eXBlLkRhdGFUaW1lID0gZnVuY3Rpb24obmV3VGltZUJlZyxuZXdUaW1lRW5kLCBuZXdSYW5nZSl7XG5cdGlmKG5ld1RpbWVCZWcgfHwgbmV3VGltZUVuZCB8fCBuZXdSYW5nZSkge1xuXHRcdHRoaXMuZGF0YUNvbmZpZy5jcml0ZXJpYS50aW1lLmJlZyA9IG5ld1RpbWVCZWcuZ2V0VGltZSgpO1xuXHRcdHRoaXMuZGF0YUNvbmZpZy5jcml0ZXJpYS50aW1lLmVuZCA9IG5ld1RpbWVFbmQuZ2V0VGltZSgpO1xuXHRcdHRoaXMuZGF0YUNvbmZpZy5jcml0ZXJpYS50aW1lLnJhbmdlID0gbmV3UmFuZ2U7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0ZWxzZVxuXHRcdHJldHVybiB7XG5cdFx0XHRiZWc6IG5ldyBEYXRlKHRoaXMuZGF0YUNvbmZpZy5jcml0ZXJpYS50aW1lLmJlZyksXG5cdFx0XHRlbmQ6IG5ldyBEYXRlKHRoaXMuZGF0YUNvbmZpZy5jcml0ZXJpYS50aW1lLmVuZCksXG5cdFx0XHRyYW5nZTogbmV3IERhdGUodGhpcy5kYXRhQ29uZmlnLmNyaXRlcmlhLnRpbWUucmFuZ2UpXG5cdFx0fTtcbn07XG4vKipcbiAqIERlcGVuZHMgb24gcm9ib3RJZHNcbiAqIFNldCByb2JvdCBjcml0ZXJpYS5cbiAqXHRAcGFyYW0ge0FycmF5W0ludF19IHJvYm90SWRzIGxpc3Qgb2Ygcm9ib3QgSWRzXG4gKiBHZXQgcm9ib3QgY3JpdGVyaWEuXG4gKlx0QHJldHVybiB7QXJyYXlbSW50XX0gbGlzdCBvZiByb2JvdCBJZHNcbiAqL1xuU3RhdHVzLnByb3RvdHlwZS5EYXRhUm9ib3RJZHMgPSBmdW5jdGlvbihyb2JvdElkcyl7XG5cdGlmKHJvYm90SWRzKSB7XG5cdFx0dGhpcy5kYXRhQ29uZmlnLmNyaXRlcmlhLnJvYm90ID0gcm9ib3RJZHM7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0ZWxzZVxuXHRcdHJldHVybiB0aGlzLmRhdGFDb25maWcuY3JpdGVyaWEucm9ib3Q7XG59O1xuLyoqXG4gKiBEZXBlbmRzIG9uIHBsYWNlSWRzIC8vIG5vdCByZWxldmFudD8sIG5vdCBpbXBsZW1lbnRlZCB5ZXRcbiAqIFNldCBwbGFjZSBjcml0ZXJpYS5cbiAqXHRAcGFyYW0ge0FycmF5W0ludF19IHBsYWNlSWRzIGxpc3Qgb2YgcGxhY2UgSWRzXG4gKiBHZXQgcGxhY2UgY3JpdGVyaWEuXG4gKlx0QHJldHVybiB7QXJyYXlbSW50XX0gbGlzdCBvZiBwbGFjZSBJZHNcbiAqL1xuU3RhdHVzLnByb3RvdHlwZS5EYXRhUGxhY2VJZHMgPSBmdW5jdGlvbihwbGFjZUlkcyl7XG5cdGlmKHBsYWNlSWRzKSB7XG5cdFx0dGhpcy5kYXRhQ29uZmlnLmNyaXRlcmlhLnBsYWNlSWQgPSBwbGFjZUlkcztcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRlbHNlXG5cdFx0cmV0dXJuIHRoaXMuZGF0YUNvbmZpZy5jcml0ZXJpYS5wbGFjZTtcbn07XG4vKipcbiAqIEdldCBkYXRhIGJ5IHNlbnNvciBuYW1lLlxuICpcdEBwYXJhbSB7QXJyYXlbU3RyaW5nXX0gc2Vuc29yTmFtZSBsaXN0IG9mIHNlbnNvcnNcbiAqL1xuU3RhdHVzLnByb3RvdHlwZS5nZXREYXRhQnlOYW1lID0gZnVuY3Rpb24oc2Vuc29yTmFtZXMpe1xuXHR2YXIgZGF0YT1bXTtcblx0Zm9yKHZhciBuIGluIHNlbnNvck5hbWVzKSB7XG5cdFx0ZGF0YS5wdXNoKHRoaXMuZGF0YU1vZGVsW3NlbnNvck5hbWVzW25dXSk7XG5cdH1cblx0cmV0dXJuIGRhdGE7XG59O1xuXG4vKipcbiAqIFN1YnNjcmliZSB0byBlcnJvci9zdGF0dXMgdXBkYXRlc1xuICovXG5TdGF0dXMucHJvdG90eXBlLndhdGNoID0gZnVuY3Rpb24gKHJvYm90TmFtZXMsIGNhbGxiYWNrKSB7XG5cdHRoaXMuc2VsZWN0b3Iuc2V0TWF4TGlzdGVuZXJzKDApO1xuXHR0aGlzLnNlbGVjdG9yLl9jb25uZWN0aW9uLnNldE1heExpc3RlbmVycygwKTtcblx0bGV0IHNlbmREYXRhID0gW107XG5cdGxldCByb2JvdElkcyA9IFtdO1xuXHRyZXR1cm4gUHJvbWlzZS50cnkoXyA9PiB7XG5cdFx0bGV0IHJlcSA9IHRoaXMuc2VsZWN0b3IucmVxdWVzdCh7XG5cdFx0XHRzZXJ2aWNlOiAnc3RhdHVzJyxcblx0XHRcdGZ1bmM6ICdHZXRNYW5hZ2VkT2JqZWN0cycsXG5cdFx0XHRvYmo6IHtcblx0XHRcdFx0aW50ZXJmYWNlOiAnb3JnLmZyZWVkZXNrdG9wLkRCdXMuT2JqZWN0TWFuYWdlcicsXG5cdFx0XHR9XG5cdFx0fSwgKHBlZXJJZCwgZXJyLCBvYmpEYXRhKSA9PiB7IC8vIGdldCBhbGwgb2JqZWN0IHBhdGhzLCBpbnRlcmZhY2VzIGFuZCBwcm9wZXJ0aWVzIGNoaWxkcmVuIG9mIFN0YXR1c1xuXHRcdFx0bGV0IHJvYm90TmFtZSA9ICcnO1xuXHRcdFx0bGV0IHJvYm90SWQgPSAxO1xuXHRcdFx0Zm9yIChsZXQgb2JqZWN0UGF0aCBpbiBvYmpEYXRhKSB7XG5cdFx0XHRcdGlmIChvYmpEYXRhW29iamVjdFBhdGhdWydmci5wYXJ0bmVyaW5nLlN0YXR1cy5Sb2JvdCddICE9IG51bGwpIHtcblx0XHRcdFx0XHRyb2JvdE5hbWUgPSBvYmpEYXRhW29iamVjdFBhdGhdWydmci5wYXJ0bmVyaW5nLlN0YXR1cy5Sb2JvdCddLlJvYm90TmFtZTtcblx0XHRcdFx0XHRyb2JvdElkID0gb2JqRGF0YVtvYmplY3RQYXRoXVsnZnIucGFydG5lcmluZy5TdGF0dXMuUm9ib3QnXS5Sb2JvdElkO1xuXHRcdFx0XHRcdHJvYm90SWRzW3JvYm90TmFtZV0gPSByb2JvdElkO1xuXHRcdFx0XHRcdHRoaXMuZ2V0QWxsU3RhdHVzZXMocm9ib3ROYW1lLCBmdW5jdGlvbiAobW9kZWwpIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrKG1vZGVsKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChvYmpEYXRhW29iamVjdFBhdGhdWydmci5wYXJ0bmVyaW5nLlN0YXR1cy5QYXJ0J10gIT0gbnVsbCkge1xuXHRcdFx0XHRcdGxldCBzdWJzID0gdGhpcy5zZWxlY3Rvci5zdWJzY3JpYmUoey8vIHN1YnNjcmliZXMgdG8gc3RhdHVzIGNoYW5nZXMgZm9yIGFsbCBwYXJ0c1xuXHRcdFx0XHRcdFx0c2VydmljZTogJ3N0YXR1cycsXG5cdFx0XHRcdFx0XHRmdW5jOiAnQ3VycmVudFN0YXR1c0NoYW5nZWQnLFxuXHRcdFx0XHRcdFx0b2JqOiB7XG5cdFx0XHRcdFx0XHRcdGludGVyZmFjZTogJ2ZyLnBhcnRuZXJpbmcuU3RhdHVzLlBhcnQnLFxuXHRcdFx0XHRcdFx0XHRwYXRoOiBvYmplY3RQYXRoXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0ZGF0YTogcm9ib3ROYW1lc1xuXHRcdFx0XHRcdH0sIChwZWVySWQsIGVyciwgZGF0YSkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGVyciAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdExvZ2dlci5lcnJvcihcIlN0YXR1c1N1YnNjcmliZTpcIiArIGVycik7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyb2JvdE5hbWUgPSBvYmplY3RQYXRoLnNwbGl0KFwiL1wiKVs1XTtcblx0XHRcdFx0XHRcdFx0cm9ib3RJZCA9IHJvYm90SWRzW3JvYm90TmFtZV07XG5cdFx0XHRcdFx0XHRcdHNlbmREYXRhWzBdID0gZGF0YTtcblx0XHRcdFx0XHRcdFx0dGhpcy5fZ2V0Um9ib3RNb2RlbEZyb21SZWN2MihzZW5kRGF0YSwgcm9ib3RJZCwgcm9ib3ROYW1lKTtcblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJylcblx0XHRcdFx0XHRcdFx0XHRjYWxsYmFjayh0aGlzLnJvYm90TW9kZWwpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHN1YnMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0fSkuY2F0Y2goZXJyID0+IHtcblx0XHRMb2dnZXIuZXJyb3IoZXJyKTtcblx0fSlcblxuXG59O1xuXG4vKipcbiAqIENsb3NlIGFsbCBzdWJzY3JpcHRpb25zXG4gKi9cblN0YXR1cy5wcm90b3R5cGUuY2xvc2VTdWJzY3JpcHRpb25zID0gZnVuY3Rpb24oKXtcblx0Zm9yKHZhciBpIGluIHRoaXMuc3Vic2NyaXB0aW9ucykge1xuXHRcdHRoaXMuc3Vic2NyaXB0aW9uc1tpXS5jbG9zZSgpO1xuXHR9XG5cdHRoaXMuc3Vic2NyaXB0aW9ucyA9W107XG5cdHRoaXMucm9ib3RNb2RlbCA9IFtdO1xufTtcblxuLyoqXG4gKiBHZXQgZGF0YSBnaXZlbiBkYXRhQ29uZmlnLlxuICogQHBhcmFtIHtmdW5jfSBjYWxsYmFjayA6IGNhbGxlZCBhZnRlciB1cGRhdGVcbiAqIFRPRE8gVVNFIFBST01JU0VcbiAqL1xuU3RhdHVzLnByb3RvdHlwZS5nZXREYXRhID0gZnVuY3Rpb24oY2FsbGJhY2ssIGRhdGFDb25maWcpe1xuXHR2YXIgZGF0YU1vZGVsID0ge307XG5cdHJldHVybiBQcm9taXNlLnRyeShfID0+IHtcblx0XHRpZihkYXRhQ29uZmlnICE9IG51bGwpXG5cdFx0XHR0aGlzLkRhdGFDb25maWcoZGF0YUNvbmZpZyk7XG5cdFx0Ly8gY29uc29sZS5sb2coXCJSZXF1ZXN0OiBcIitKU09OLnN0cmluZ2lmeShkYXRhQ29uZmlnKSk7XG5cdFx0dGhpcy5zZWxlY3Rvci5yZXF1ZXN0KHtcblx0XHRcdHNlcnZpY2U6IFwic3RhdHVzXCIsXG5cdFx0XHRmdW5jOiBcIkRhdGFSZXF1ZXN0XCIsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHR5cGU6XCJzcGxSZXFcIixcblx0XHRcdFx0ZGF0YUNvbmZpZzogdGhpcy5kYXRhQ29uZmlnXG5cdFx0XHR9XG5cdFx0fSwgKGRuSWQsIGVyciwgZGF0YSkgPT4ge1xuXHRcdFx0aWYgKGVyciAhPSBudWxsKSB7XG5cdFx0XHRcdExvZ2dlci5lcnJvcihcIltcIiArIHRoaXMuZGF0YUNvbmZpZy5zZW5zb3JzICsgXCJdIFJlY3YgZXJyOiBcIiArIEpTT04uc3RyaW5naWZ5KGVycikpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZihkYXRhLmhlYWRlci5lcnJvciAhPSBudWxsKSB7XG5cdFx0XHRcdC8vIFRPRE8gOiBjaGVjay91c2UgZXJyIHN0YXR1cyBhbmQgYWRhcHQgYmVoYXZpb3IgYWNjb3JkaW5nbHlcblx0XHRcdFx0TG9nZ2VyLmVycm9yKFwiVXBkYXRlRGF0YTpcXG5cIitKU09OLnN0cmluZ2lmeShkYXRhLmhlYWRlci5yZXFDb25maWcpKTtcblx0XHRcdFx0TG9nZ2VyLmVycm9yKFwiRGF0YSByZXF1ZXN0IGZhaWxlZCAoXCIrZGF0YS5oZWFkZXIuZXJyb3Iuc3QrXCIpOiBcIitkYXRhLmhlYWRlci5lcnJvci5tc2cpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQvL0xvZ2dlci5sb2coSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhTW9kZWwpKTtcblx0XHRcdGRhdGFNb2RlbCA9IHRoaXMuX2dldERhdGFNb2RlbEZyb21SZWN2KGRhdGEpO1xuXG5cdFx0XHRMb2dnZXIubG9nKHRoaXMuZ2V0RGF0YU1vZGVsKCkpO1xuXHRcdFx0Y2FsbGJhY2sgPSBjYWxsYmFjay5iaW5kKHRoaXMpOyAvLyBiaW5kIGNhbGxiYWNrIHdpdGggU3RhdHVzXG5cdFx0XHRjYWxsYmFjayhkYXRhTW9kZWwpOyAvLyBjYWxsYmFjayBmdW5jXG5cdFx0fSk7XG5cdH0pLmNhdGNoKGVyciA9PiB7XG5cdFx0TG9nZ2VyLmVycm9yKGVycilcblx0fSlcbn07XG5cblxuLyoqXG4gKiBVcGRhdGUgaW50ZXJuYWwgcm9ib3QgbW9kZWwgd2l0aCByZWNlaXZlZCBkYXRhICh2ZXJzaW9uIDIpXG4gKiBAcGFyYW0gIHtPYmplY3R9IGRhdGEgZGF0YSByZWNlaXZlZCBmcm9tIERpeWFOb2RlIGJ5IHdlYnNvY2tldFxuICogQHJldHVybiB7W3R5cGVdfVx0XHRbZGVzY3JpcHRpb25dXG4gKi9cblN0YXR1cy5wcm90b3R5cGUuX2dldFJvYm90TW9kZWxGcm9tUmVjdjIgPSBmdW5jdGlvbihkYXRhLCByb2JvdElkLCByb2JvdE5hbWUpIHtcblx0aWYodGhpcy5yb2JvdE1vZGVsID09IG51bGwpXG5cdFx0dGhpcy5yb2JvdE1vZGVsID0gW107XG5cblx0aWYodGhpcy5yb2JvdE1vZGVsW3JvYm90SWRdICE9IG51bGwpXG5cdFx0dGhpcy5yb2JvdE1vZGVsW3JvYm90SWRdLnBhcnRzID0ge307IC8vIHJlc2V0IHBhcnRzXG5cblx0aWYodGhpcy5yb2JvdE1vZGVsW3JvYm90SWRdID09IG51bGwpXG5cdFx0dGhpcy5yb2JvdE1vZGVsW3JvYm90SWRdID0ge307XG5cblx0dGhpcy5yb2JvdE1vZGVsW3JvYm90SWRdID0ge1xuXHRcdHJvYm90OiB7XG5cdFx0XHRuYW1lOiByb2JvdE5hbWVcblx0XHR9XG5cdH07XG5cblx0LyoqIGV4dHJhY3QgcGFydHMgaW5mbyAqKi9cblx0dGhpcy5yb2JvdE1vZGVsW3JvYm90SWRdLnBhcnRzID0ge307XG5cdGxldCByUGFydHMgPSB0aGlzLnJvYm90TW9kZWxbcm9ib3RJZF0ucGFydHM7XG5cblx0ZGF0YS5mb3JFYWNoKGQgPT4ge1xuXHRcdGxldCBwYXJ0SWQgPSBkWzBdO1xuXHRcdGxldCBjYXRlZ29yeSA9IGRbMV07XG5cdFx0bGV0IHBhcnROYW1lID0gZFsyXTtcblx0XHRsZXQgbGFiZWwgPSBkWzNdO1xuXHRcdGxldCB0aW1lID0gZFs0XTtcblx0XHRsZXQgY29kZSA9IGRbNV07XG5cdFx0bGV0IGNvZGVSZWYgPSBkWzZdO1xuXHRcdGxldCBtc2cgPSBkWzddO1xuXHRcdGxldCBjcml0TGV2ZWwgPSBkWzhdO1xuXHRcdGxldCBkZXNjcmlwdGlvbiA9IGRbOV07XG5cblx0XHRpZiAoclBhcnRzW3BhcnRJZF0gPT0gbnVsbCkge1xuXHRcdFx0clBhcnRzW3BhcnRJZF0gPSB7fTtcblx0XHR9XG5cdFx0LyogdXBkYXRlIHBhcnQgY2F0ZWdvcnkgKi9cblx0XHRyUGFydHNbcGFydElkXS5jYXRlZ29yeSA9IGNhdGVnb3J5O1xuXHRcdC8qIHVwZGF0ZSBwYXJ0IG5hbWUgKi9cblx0XHRyUGFydHNbcGFydElkXS5uYW1lID0gcGFydE5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHQvKiB1cGRhdGUgcGFydCBsYWJlbCAqL1xuXHRcdHJQYXJ0c1twYXJ0SWRdLmxhYmVsID0gbGFiZWw7XG5cblx0XHQvKiB1cGRhdGUgZXJyb3IgKi9cblx0XHQvKiogdXBkYXRlIGVycm9yTGlzdCAqKi9cblx0XHRpZiAoclBhcnRzW3BhcnRJZF0uZXJyb3JMaXN0ID09IG51bGwpXG5cdFx0XHRyUGFydHNbcGFydElkXS5lcnJvckxpc3QgPSB7fTtcblxuXHRcdGlmIChyUGFydHNbcGFydElkXS5lcnJvckxpc3RbY29kZVJlZl0gPT0gbnVsbClcblx0XHRcdHJQYXJ0c1twYXJ0SWRdLmVycm9yTGlzdFtjb2RlUmVmXSA9IHtcblx0XHRcdFx0bXNnOiBtc2csXG5cdFx0XHRcdGNyaXRMZXZlbDogY3JpdExldmVsLFxuXHRcdFx0XHRkZXNjcmlwdGlvbjogZGVzY3JpcHRpb25cblx0XHRcdH07XG5cdFx0bGV0IGV2dHNfdG1wID0ge1xuXHRcdFx0dGltZTogdGhpcy5fY29kZXIuZnJvbSh0aW1lKSxcblx0XHRcdGNvZGU6IHRoaXMuX2NvZGVyLmZyb20oY29kZSksXG5cdFx0XHRjb2RlUmVmOiB0aGlzLl9jb2Rlci5mcm9tKGNvZGVSZWYpXG5cdFx0fTtcblx0XHQvKiogaWYgcmVjZWl2ZWQgbGlzdCBvZiBldmVudHMgKiovXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoZXZ0c190bXAuY29kZSkgfHwgQXJyYXkuaXNBcnJheShldnRzX3RtcC50aW1lKVxuXHRcdFx0fHwgQXJyYXkuaXNBcnJheShldnRzX3RtcC5jb2RlUmVmKSkge1xuXHRcdFx0aWYgKGV2dHNfdG1wLmNvZGUubGVuZ3RoID09PSBldnRzX3RtcC5jb2RlUmVmLmxlbmd0aFxuXHRcdFx0XHQmJiBldnRzX3RtcC5jb2RlLmxlbmd0aCA9PT0gZXZ0c190bXAudGltZS5sZW5ndGgpIHtcblx0XHRcdFx0LyoqIGJ1aWxkIGxpc3Qgb2YgZXZlbnRzICoqL1xuXHRcdFx0XHRyUGFydHNbcGFydElkXS5ldnRzID0gW107XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZXZ0c190bXAuY29kZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHJQYXJ0c1twYXJ0SWRdLmV2dHMucHVzaCh7XG5cdFx0XHRcdFx0XHR0aW1lOiBldnRzX3RtcC50aW1lW2ldLFxuXHRcdFx0XHRcdFx0Y29kZTogZXZ0c190bXAuY29kZVtpXSxcblx0XHRcdFx0XHRcdGNvZGVSZWY6IGV2dHNfdG1wLmNvZGVSZWZbaV1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBMb2dnZXIuZXJyb3IoXCJTdGF0dXM6SW5jb25zaXN0YW50IGxlbmd0aHMgb2YgYnVmZmVycyAodGltZS9jb2RlL2NvZGVSZWYpXCIpO1xuXHRcdH1cblx0XHRlbHNlIHsgLyoqIGp1c3QgaW4gY2FzZSwgdG8gcHJvdmlkZSBiYWNrd2FyZCBjb21wYXRpYmlsaXR5ICoqL1xuXHRcdFx0LyoqIHNldCByZWNlaXZlZCBldmVudCAqKi9cblx0XHRcdHJQYXJ0c1twYXJ0SWRdLmV2dHMgPSBbe1xuXHRcdFx0XHR0aW1lOiBldnRzX3RtcC50aW1lLFxuXHRcdFx0XHRjb2RlOiBldnRzX3RtcC5jb2RlLFxuXHRcdFx0XHRjb2RlUmVmOiBldnRzX3RtcC5jb2RlUmVmXG5cdFx0XHR9XTtcblx0XHR9XG5cdH0pXG59O1xuXG4vKiogY3JlYXRlIFN0YXR1cyBzZXJ2aWNlICoqL1xuRGl5YVNlbGVjdG9yLnByb3RvdHlwZS5TdGF0dXMgPSBmdW5jdGlvbigpe1xuXHRyZXR1cm4gbmV3IFN0YXR1cyh0aGlzKTtcbn07XG5cbi8qKlxuICogU2V0IG9uIHN0YXR1c1xuICogQHBhcmFtIHJvYm90TmFtZSB0byBmaW5kIHN0YXR1cyB0byBtb2RpZnlcbiAqIEBwYXJhbSBwYXJ0TmFtZSBcdHRvIGZpbmQgc3RhdHVzIHRvIG1vZGlmeVxuICogQHBhcmFtIGNvZGVcdFx0bmV3Q29kZVxuICogQHBhcmFtIHNvdXJjZVx0XHRzb3VyY2VcbiAqIEBwYXJhbSBjYWxsYmFja1x0XHRyZXR1cm4gY2FsbGJhY2sgKDxib29sPnN1Y2Nlc3MpXG4gKi9cbkRpeWFTZWxlY3Rvci5wcm90b3R5cGUuc2V0U3RhdHVzID0gZnVuY3Rpb24gKHJvYm90TmFtZSwgcGFydE5hbWUsIGNvZGUsIHNvdXJjZSwgY2FsbGJhY2spIHtcblx0cmV0dXJuIFByb21pc2UudHJ5KF8gPT4ge1xuXHRcdHZhciBvYmplY3RQYXRoID0gXCIvZnIvcGFydG5lcmluZy9TdGF0dXMvUm9ib3RzL1wiICsgcm9ib3ROYW1lICsgXCIvUGFydHMvXCIgKyBwYXJ0TmFtZTtcblx0XHR0aGlzLnJlcXVlc3Qoe1xuXHRcdFx0c2VydmljZTogXCJzdGF0dXNcIixcblx0XHRcdGZ1bmM6IFwiU2V0UGFydFwiLFxuXHRcdFx0b2JqOiB7XG5cdFx0XHRcdGludGVyZmFjZTogJ2ZyLnBhcnRuZXJpbmcuU3RhdHVzLlBhcnQnLFxuXHRcdFx0XHRwYXRoOiBvYmplY3RQYXRoXG5cdFx0XHR9LFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHQvL3JvYm90TmFtZTogcm9ib3ROYW1lLFxuXHRcdFx0XHRjb2RlOiBjb2RlLFxuXHRcdFx0XHQvL3BhcnROYW1lOiBwYXJ0TmFtZSxcblx0XHRcdFx0c291cmNlOiBzb3VyY2UgfCAxXG5cdFx0XHR9XG5cdFx0fSwgKHBlZXJJZCwgZXJyLCBkYXRhKSA9PiB7XG5cdFx0XHRpZiAoZXJyICE9IG51bGwpIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soZmFsc2UpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKHRydWUpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KS5jYXRjaChlcnIgPT4ge1xuXHRcdExvZ2dlci5lcnJvcihlcnIpXG5cdH0pXG59O1xuXG4vKipcbiAqIEdldCBvbmUgc3RhdHVzXG4gKiBAcGFyYW0gcm9ib3ROYW1lIHRvIGdldCBzdGF0dXNcbiAqIEBwYXJhbSBwYXJ0TmFtZSBcdHRvIGdldCBzdGF0dXNcbiAqIEBwYXJhbSBjYWxsYmFja1x0XHRyZXR1cm4gY2FsbGJhY2soLTEgaWYgbm90IGZvdW5kL2RhdGEgb3RoZXJ3aXNlKVxuICogQHBhcmFtIF9mdWxsIFx0bW9yZSBkYXRhIGFib3V0IHN0YXR1c1xuICovXG5TdGF0dXMucHJvdG90eXBlLmdldFN0YXR1cyA9IGZ1bmN0aW9uIChyb2JvdE5hbWUsIHBhcnROYW1lLCBjYWxsYmFjay8qLCBfZnVsbCovKSB7XG5cdGxldCBzZW5kRGF0YSA9IFtdXG5cdHJldHVybiBQcm9taXNlLnRyeShfID0+IHtcblx0XHRsZXQgcmVxID0gdGhpcy5zZWxlY3Rvci5yZXF1ZXN0KHtcblx0XHRcdHNlcnZpY2U6ICdzdGF0dXMnLFxuXHRcdFx0ZnVuYzogJ0dldE1hbmFnZWRPYmplY3RzJyxcblx0XHRcdG9iajoge1xuXHRcdFx0XHRpbnRlcmZhY2U6ICdvcmcuZnJlZWRlc2t0b3AuREJ1cy5PYmplY3RNYW5hZ2VyJyxcblx0XHRcdH1cblx0XHR9LCAocGVlcklkLCBlcnIsIG9iakRhdGEpID0+IHtcblxuXHRcdFx0bGV0IG9iamVjdFBhdGhSb2JvdCA9IFwiL2ZyL3BhcnRuZXJpbmcvU3RhdHVzL1JvYm90cy9cIiArIHJvYm90TmFtZTtcblx0XHRcdGxldCBvYmplY3RQYXRoUGFydCA9IFwiL2ZyL3BhcnRuZXJpbmcvU3RhdHVzL1JvYm90cy9cIiArIHJvYm90TmFtZSArIFwiL1BhcnRzL1wiICsgcGFydE5hbWU7XG5cdFx0XHRsZXQgcm9ib3RJZCA9IG9iakRhdGFbb2JqZWN0UGF0aFJvYm90XVsnZnIucGFydG5lcmluZy5TdGF0dXMuUm9ib3QnXS5Sb2JvdElkXG5cdFx0XHR0aGlzLnNlbGVjdG9yLnJlcXVlc3Qoe1xuXHRcdFx0XHRzZXJ2aWNlOiBcInN0YXR1c1wiLFxuXHRcdFx0XHRmdW5jOiBcIkdldFBhcnRcIixcblx0XHRcdFx0b2JqOiB7XG5cdFx0XHRcdFx0aW50ZXJmYWNlOiAnZnIucGFydG5lcmluZy5TdGF0dXMuUGFydCcsXG5cdFx0XHRcdFx0cGF0aDogb2JqZWN0UGF0aFBhcnRcblx0XHRcdFx0fVxuXHRcdFx0fSwgKHBlZXJJZCwgZXJyLCBkYXRhKSA9PiB7XG5cdFx0XHRcdHNlbmREYXRhLnB1c2goZGF0YSlcblx0XHRcdFx0dGhpcy5fZ2V0Um9ib3RNb2RlbEZyb21SZWN2MihzZW5kRGF0YSwgcm9ib3RJZCwgcm9ib3ROYW1lKTtcblx0XHRcdFx0aWYgKGVyciAhPSBudWxsKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soLTEpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKHRoaXMucm9ib3RNb2RlbCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pXG5cdH0pLmNhdGNoKGVyciA9PiB7XG5cdFx0TG9nZ2VyLmVycm9yKGVycilcblx0fSlcbn07XG5cbi8qKlxuICogR2V0IGFsbCBzdGF0dXNcbiAqIEBwYXJhbSByb2JvdE5hbWUgdG8gZ2V0IHN0YXR1c1xuICogQHBhcmFtIHBhcnROYW1lIFx0dG8gZ2V0IHN0YXR1c1xuICogQHBhcmFtIGNhbGxiYWNrXHRcdHJldHVybiBjYWxsYmFjaygtMSBpZiBub3QgZm91bmQvZGF0YSBvdGhlcndpc2UpXG4gKiBAcGFyYW0gX2Z1bGwgXHRtb3JlIGRhdGEgYWJvdXQgc3RhdHVzXG4gKi9cblN0YXR1cy5wcm90b3R5cGUuZ2V0QWxsU3RhdHVzZXMgPSBmdW5jdGlvbiAocm9ib3ROYW1lLCBjYWxsYmFjaykge1xuXHRsZXQgcmVxID0gdGhpcy5zZWxlY3Rvci5yZXF1ZXN0KHtcblx0XHRzZXJ2aWNlOiAnc3RhdHVzJyxcblx0XHRmdW5jOiAnR2V0TWFuYWdlZE9iamVjdHMnLFxuXHRcdG9iajoge1xuXHRcdFx0aW50ZXJmYWNlOiAnb3JnLmZyZWVkZXNrdG9wLkRCdXMuT2JqZWN0TWFuYWdlcicsXG5cdFx0fVxuXHR9LCAocGVlcklkLCBlcnIsIG9iakRhdGEpID0+IHsgLy8gZ2V0IGFsbCBvYmplY3QgcGF0aHMsIGludGVyZmFjZXMgYW5kIHByb3BlcnRpZXMgY2hpbGRyZW4gb2YgU3RhdHVzXG5cdFx0bGV0IG9iamVjdFBhdGggPSBcIi9mci9wYXJ0bmVyaW5nL1N0YXR1cy9Sb2JvdHMvXCIgKyByb2JvdE5hbWU7XG5cdFx0aWYgKG9iakRhdGFbb2JqZWN0UGF0aF0gIT0gbnVsbCkge1xuXHRcdFx0aWYgKG9iakRhdGFbb2JqZWN0UGF0aF1bJ2ZyLnBhcnRuZXJpbmcuU3RhdHVzLlJvYm90J10gIT0gbnVsbCkge1xuXHRcdFx0XHRsZXQgcm9ib3RJZCA9IG9iakRhdGFbb2JqZWN0UGF0aF1bJ2ZyLnBhcnRuZXJpbmcuU3RhdHVzLlJvYm90J10uUm9ib3RJZFxuXHRcdFx0XHQvL3ZhciBmdWxsID0gX2Z1bGwgfHwgZmFsc2U7XG5cdFx0XHRcdHRoaXMuc2VsZWN0b3IucmVxdWVzdCh7XG5cdFx0XHRcdFx0c2VydmljZTogXCJzdGF0dXNcIixcblx0XHRcdFx0XHRmdW5jOiBcIkdldEFsbFBhcnRzXCIsXG5cdFx0XHRcdFx0b2JqOiB7XG5cdFx0XHRcdFx0XHRpbnRlcmZhY2U6ICdmci5wYXJ0bmVyaW5nLlN0YXR1cy5Sb2JvdCcsXG5cdFx0XHRcdFx0XHRwYXRoOiBvYmplY3RQYXRoXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCAocGVlcklkLCBlcnIsIGRhdGEpID0+IHtcblx0XHRcdFx0XHRpZiAoZXJyICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKC0xKTtcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihlcnIpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy5fZ2V0Um9ib3RNb2RlbEZyb21SZWN2MihkYXRhLCByb2JvdElkLCByb2JvdE5hbWUpO1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2sodGhpcy5yb2JvdE1vZGVsKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0TG9nZ2VyLmVycm9yKFwiSW50ZXJmYWNlIGZyLnBhcnRuZXJpbmcuU3RhdHVzLlJvYm90IGRvZXNuJ3QgZXhpc3QhXCIpXG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdExvZ2dlci5lcnJvcihcIk9iamVjdFBhdGggXCIgKyBvYmplY3RQYXRoICsgXCIgZG9lc24ndCBleGlzdCFcIilcblx0XHR9XG5cdH0pXG59O1xuIiwiLyogbWF5YS1jbGllbnRcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgUGFydG5lcmluZyBSb2JvdGljcywgQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFRoaXMgbGlicmFyeSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3JcbiAqIG1vZGlmeSBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWNcbiAqIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb247IHZlcnNpb25cbiAqXHQzLjAgb2YgdGhlIExpY2Vuc2UuIFRoaXMgbGlicmFyeSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZVxuICogdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW5cbiAqIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVJcbiAqIFBVUlBPU0UuIFNlZSB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljXG4gKiBMaWNlbnNlIGFsb25nIHdpdGggdGhpcyBsaWJyYXJ5LlxuICovXG5cbi8qKlxuICogTWFuYWdlbWVudCBvZiBjaGFubmVsIGVuY29kaW5nXG4gKiAtIGJhc2U2NCBjb2RpbmdcbiAqIC0gbm9uZVxuICogRGF0YSBmb3JtYXQgOlxuICpcdFx0dDogeydiNjQnLCdub25lJ31cbiAqXHRcdGI6IDxpZiBiNjQ+IHs0LDh9XG4gKlx0XHRkOiBlbmNvZGVkIGRhdGEge2J1ZmZlciBvciBBcnJheX1cbiAqXHRcdHM6IHNpemVcbiAqL1xuXG5cbnZhciBEaXlhU2VsZWN0b3IgPSByZXF1aXJlKCcuLi8uLi9EaXlhU2VsZWN0b3InKS5EaXlhU2VsZWN0b3I7XG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZS02NCcpO1xuXG4vKipcbiAqIERlZmF1bHQgOiBubyBlbmNvZGluZ1xuICogKi9cbmZ1bmN0aW9uIE5vQ29kaW5nKCl7XG5cdHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4qXG4qL1xuTm9Db2RpbmcucHJvdG90eXBlLmZyb20gPSBmdW5jdGlvbihkYXRhKSB7XG5cdGlmKGRhdGEuZCA9PT0gJ251bWJlcicgfHwgQXJyYXkuaXNBcnJheShkYXRhLmQpKVxuXHRcdHJldHVybiBkYXRhLmQ7XG5cdGVsc2Vcblx0XHRyZXR1cm4gZGF0YTtcbn07XG5cbi8qKlxuKi9cbk5vQ29kaW5nLnByb3RvdHlwZS50byA9IGZ1bmN0aW9uKGFycmF5KSB7XG5cdHJldHVybiB7XG5cdFx0dDogJ25vJywgLyogdHlwZSAqL1xuXHRcdGQ6IGFycmF5LCAvKiBkYXRhICovXG5cdFx0czogYXJyYXkubGVuZ3RoXG5cdH07XG59O1xuXG5cblxuXG4vKipcbiAqIE1hbmFnZW1lbnQgb2YgYmFzZTY0IGVuY29kaW5nXG4gKiBFZmZlY3RpdmUgZm9yIHN0cmluZyBiYXNlZCBjaGFubmVscyAobGlrZSBKU09OIGJhc2VkIFdTKVxuICogKi9cbmZ1bmN0aW9uIEJhc2U2NENvZGluZygpe1xuXHRyZXR1cm4gdGhpcztcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLyAgICBVdGlsaXR5IGZ1bmN0aW9ucyAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8qXFxcbiB8KnxcbiB8KnwgIHV0aWxpdGFpcmVzIGRlIG1hbmlwdWxhdGlvbnMgZGUgY2hhw65uZXMgYmFzZSA2NCAvIGJpbmFpcmVzIC8gVVRGLThcbiB8KnxcbiB8KnwgIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2ZyL2RvY3MvRMOpY29kZXJfZW5jb2Rlcl9lbl9iYXNlNjRcbiB8KnxcbiBcXCovXG4vKiogRGVjb2RlciB1biB0YWJsZWF1IGQnb2N0ZXRzIGRlcHVpcyB1bmUgY2hhw65uZSBlbiBiYXNlNjQgKi9cbnZhciBiNjRUb1VpbnQ2ID0gZnVuY3Rpb24obkNocikge1xuXHRyZXR1cm4gbkNociA+IDY0ICYmIG5DaHIgPCA5MSA/XG5cdFx0bkNociAtIDY1XG5cdFx0OiBuQ2hyID4gOTYgJiYgbkNociA8IDEyMyA/XG5cdFx0bkNociAtIDcxXG5cdFx0OiBuQ2hyID4gNDcgJiYgbkNociA8IDU4ID9cblx0XHRuQ2hyICsgNFxuXHRcdDogbkNociA9PT0gNDMgP1xuXHRcdDYyXG5cdFx0OiBuQ2hyID09PSA0NyA/XG5cdFx0NjNcblx0XHQ6XHQwO1xufTtcblxuLyoqXG4gKiBEZWNvZGUgYmFzZTY0IHN0cmluZyB0byBVSW50OEFycmF5XG4gKiBAcGFyYW0gIHtTdHJpbmd9IHNCYXNlNjRcdFx0YmFzZTY0IGNvZGVkIHN0cmluZ1xuICogQHBhcmFtICB7aW50fSBuQmxvY2tzU2l6ZSBzaXplIG9mIGJsb2NrcyBvZiBieXRlcyB0byBiZSByZWFkLiBPdXRwdXQgYnl0ZUFycmF5IGxlbmd0aCB3aWxsIGJlIGEgbXVsdGlwbGUgb2YgdGhpcyB2YWx1ZS5cbiAqIEByZXR1cm4ge1VpbnQ4QXJyYXl9XHRcdFx0XHR0YWIgb2YgZGVjb2RlZCBieXRlc1xuICovXG52YXIgYmFzZTY0RGVjVG9BcnIgPSBmdW5jdGlvbihzQmFzZTY0LCBuQmxvY2tzU2l6ZSkge1xuXHR2YXJcblx0c0I2NEVuYyA9IHNCYXNlNjQucmVwbGFjZSgvW15BLVphLXowLTlcXCtcXC9dL2csIFwiXCIpLCBuSW5MZW4gPSBzQjY0RW5jLmxlbmd0aCxcblx0bk91dExlbiA9IG5CbG9ja3NTaXplID8gTWF0aC5jZWlsKChuSW5MZW4gKiAzICsgMSA+PiAyKSAvIG5CbG9ja3NTaXplKSAqIG5CbG9ja3NTaXplIDogbkluTGVuICogMyArIDEgPj4gMixcblx0YnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKG5PdXRMZW4pLCB0YUJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcblxuXHRmb3IgKHZhciBuTW9kMywgbk1vZDQsIG5VaW50MjQgPSAwLCBuT3V0SWR4ID0gMCwgbkluSWR4ID0gMDsgbkluSWR4IDwgbkluTGVuOyBuSW5JZHgrKykge1xuXHRcdG5Nb2Q0ID0gbkluSWR4ICYgMzsgLyogbiBtb2QgNCAqL1xuXHRcdG5VaW50MjQgfD0gYjY0VG9VaW50NihzQjY0RW5jLmNoYXJDb2RlQXQobkluSWR4KSkgPDwgMTggLSA2ICogbk1vZDQ7XG5cdFx0aWYgKG5Nb2Q0ID09PSAzIHx8IG5JbkxlbiAtIG5JbklkeCA9PT0gMSkge1xuXHRcdFx0Zm9yIChuTW9kMyA9IDA7IG5Nb2QzIDwgMyAmJiBuT3V0SWR4IDwgbk91dExlbjsgbk1vZDMrKywgbk91dElkeCsrKSB7XG5cdFx0XHRcdHRhQnl0ZXNbbk91dElkeF0gPSBuVWludDI0ID4+PiAoMTYgPj4+IG5Nb2QzICYgMjQpICYgMjU1O1xuXHRcdFx0fVxuXHRcdFx0blVpbnQyNCA9IDA7XG5cdFx0fVxuXHR9XG5cdC8vIGNvbnNvbGUubG9nKFwidThpbnQgOiBcIitKU09OLnN0cmluZ2lmeSh0YUJ5dGVzKSk7XG5cdHJldHVybiBidWZmZXI7XG59O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLyAgIEludGVyZmFjZSBmdW5jdGlvbnMgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuLyoqXG4qIENvbnZlcnQgYnVmZmVyIGNvZGVkIGluIGJhc2U2NCBhbmQgY29udGFpbmluZyBudW1iZXJzIGNvZGVkIGJ5XG4qIGJ5dGVDb2RpbmcgYnl0ZXMgaW50byBhcnJheVxuKiBAcGFyYW0gYnVmZmVyIGluIGJhc2U2NFxuKiBAcGFyYW0gYnl0ZUNvZGluZyBudW1iZXIgb2YgYnl0ZXMgZm9yIGVhY2ggbnVtYmVyICg0IG9yIDgpXG4qIEByZXR1cm4gYXJyYXkgb2YgZmxvYXQgKDMyIG9yIDY0KS4gbnVsbCBpZiBjb3VsZCBub3QgY29udmVydC5cbiovXG5CYXNlNjRDb2RpbmcucHJvdG90eXBlLmZyb20gPSBmdW5jdGlvbihkYXRhKSB7XG5cdHZhciBieXRlQ29kaW5nID0gZGF0YS5iO1xuXG5cdC8qIGNoZWNrIGJ5dGUgY29kaW5nICovXG5cdGlmKGJ5dGVDb2RpbmcgIT09IDQgJiYgYnl0ZUNvZGluZyAhPT0gOCkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0LyogZGVjb2RlIGRhdGEgdG8gYXJyYXkgb2YgYnl0ZSAqL1xuXHR2YXIgYnVmID0gYmFzZTY0RGVjVG9BcnIoZGF0YS5kLCBkYXRhLmIpO1xuXHQvKiBwYXJzZSBkYXRhIHRvIGZsb2F0IGFycmF5ICovXG5cdHZhciBmQXJyYXk9bnVsbDtcblx0c3dpdGNoKGRhdGEuYikge1xuXHRjYXNlIDQ6XG5cdFx0ZkFycmF5ID0gbmV3IEZsb2F0MzJBcnJheShidWYpO1xuXHRcdGJyZWFrO1xuXHRjYXNlIDg6XG5cdFx0ZkFycmF5ID0gbmV3IEZsb2F0NjRBcnJheShidWYpO1xuXHRcdGJyZWFrO1xuXHRkZWZhdWx0OlxuXHRcdGNvbnNvbGUubG9nKFwiVW5leHBlY3RlZCBieXRlQ29kaW5nISBTaG91bGQgbm90IGhhcHBlbiEhXCIpO1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdC8qIHBhcnNlIGZBcnJheSBpbnRvIG5vcm1hbCBhcnJheSAqL1xuXHR2YXIgdGFiID0gW10uc2xpY2UuY2FsbChmQXJyYXkpO1xuXG5cdGlmKGRhdGEucyAhPT0gdGFiLmxlbmd0aCkge1xuXHRcdGNvbnNvbGUubG9nKFwiU2l6ZSBtaXNtYXRjaCB3aGVuIGRlY29kaW5nICFcIik7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0cmV0dXJuIHRhYjtcbn07XG5cbi8qKlxuKiBDb252ZXJ0IGFycmF5IGNvbnRhaW5pbmcgbnVtYmVycyBjb2RlZCBieSBieXRlQ29kaW5nIGJ5dGVzIGludG8gYnVmZmVyIGNvZGVkIGluIGJhc2U2NFxuKiBAcGFyYW0gXHR7QXJyYXk8RmxvYXQ+fSBcdGFycmF5IG9mIGZsb2F0ICgzMiBvciA2NCBiaXRzKVxuKiBAcGFyYW0gXHR7aW50ZWdlcn0gXHRieXRlQ29kaW5nIG51bWJlciBvZiBieXRlcyBmb3IgZWFjaCBmbG9hdCAoNCBvciA4KVxuKiBAcmV0dXJuICBcdHtTdHJpbmd9IFx0YnVmZmVyIGluIGJhc2U2NC4gbnVsbCBpZiBjb3VsZCBub3QgY29udmVydC5cbiovXG5CYXNlNjRDb2RpbmcucHJvdG90eXBlLnRvID0gZnVuY3Rpb24oYXJyYXksIGJ5dGVDb2RpbmcpIHtcblx0LyogY2hlY2sgYnl0ZSBjb2RpbmcgKi9cblx0aWYoYnl0ZUNvZGluZyAhPT0gNCAmJiBieXRlQ29kaW5nICE9PSA4KSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHQvKioqIGNhc2UgQXJyYXlCdWZmZXIgKioqL1xuXHR2YXIgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGFycmF5Lmxlbmd0aCpieXRlQ29kaW5nKTtcblx0c3dpdGNoKGJ5dGVDb2RpbmcpIHtcblx0Y2FzZSA0OlxuXHRcdHZhciBidWYzMiA9IG5ldyBGbG9hdDMyQXJyYXkoYnVmZmVyKTtcblx0XHRidWYzMi5zZXQoYXJyYXkpO1xuXHRcdGJyZWFrO1xuXHRjYXNlIDg6XG5cdFx0dmFyIGJ1ZjY0ID0gbmV3IEZsb2F0NjRBcnJheShidWZmZXIpO1xuXHRcdGJ1ZjY0LnNldChhcnJheSk7XG5cdFx0YnJlYWs7XG5cdH1cblx0dmFyIGJ1ZmZDaGFyID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcblx0dmFyIGJ1ZmZDaGFyQ29kZWQgPSBuZXcgQXJyYXkoYnVmZkNoYXIubGVuZ3RoKTtcblx0Zm9yKHZhciBuID0wOyBuPGJ1ZmZDaGFyLmxlbmd0aDsgbisrKSB7XG5cdFx0YnVmZkNoYXJDb2RlZFtuXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmZkNoYXJbbl0pO1xuXHR9XG5cdHZhciBzdHIgPSBuZXcgU3RyaW5nKGJ1ZmZDaGFyQ29kZWQuam9pbignJykpO1xuXHR2YXIgYjY0QnVmZiA9IGJhc2U2NC5lbmNvZGUoc3RyKTtcblx0cmV0dXJuIHtcblx0XHR0OiAnYjY0JywgLyogdHlwZSAqL1xuXHRcdGI6IGJ5dGVDb2RpbmcsIC8qIGJ5dGVDb2RpbmcgKi9cblx0XHRkOiBiNjRCdWZmLCAvKiBkYXRhICovXG5cdFx0czogYXJyYXkubGVuZ3RoIC8qIHNpemUgKi9cblx0fTtcbn07XG5cblxuXG5cbi8qKlxuICogTWFuYWdlbWVudCBvZiBjb21tIGVuY29kaW5nXG4gKiAqL1xuZnVuY3Rpb24gQ29kaW5nSGFuZGxlcigpe1xuXHR0aGlzLmI2NCA9IG5ldyBCYXNlNjRDb2RpbmcoKTtcblx0dGhpcy5ub25lID0gbmV3IE5vQ29kaW5nKCk7XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG5cbkNvZGluZ0hhbmRsZXIucHJvdG90eXBlLmZyb20gPSBmdW5jdGlvbihkYXRhKSB7XG5cdGlmKHR5cGVvZiBkYXRhID09ICd1bmRlZmluZWQnIHx8IGRhdGE9PW51bGwpXG5cdFx0cmV0dXJuIG51bGw7XG5cdHN3aXRjaChkYXRhLnQpIHtcblx0Y2FzZSAnYjY0Jzpcblx0XHRyZXR1cm4gdGhpcy5iNjQuZnJvbShkYXRhKTtcblx0ZGVmYXVsdDpcblx0XHRyZXR1cm4gdGhpcy5ub25lLmZyb20oZGF0YSk7XG5cdH1cbn07XG5cblxuQ29kaW5nSGFuZGxlci5wcm90b3R5cGUudG8gPSBmdW5jdGlvbihhcnJheSwgdHlwZSwgYnl0ZUNvZGluZykge1xuXHRpZih0eXBlb2YgYXJyYXkgPT09ICdudW1iZXInKSB7XG5cdFx0YXJyYXk9W2FycmF5XTtcblx0fVxuXHRpZighQXJyYXkuaXNBcnJheShhcnJheSkpe1xuXHRcdGNvbnNvbGUubG9nKFwiQ29kaW5nSGFuZGxlci50byBvbmx5IGFjY2VwdHMgYXJyYXkgIVwiKTtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHN3aXRjaCh0eXBlKSB7XG5cdGNhc2UgJ2I2NCc6XG5cdFx0cmV0dXJuIHRoaXMuYjY0LnRvKGFycmF5LCBieXRlQ29kaW5nKTtcblx0Y2FzZSAnbm8nOlxuXHRkZWZhdWx0OlxuXHRcdHJldHVybiB0aGlzLm5vbmUudG8oYXJyYXkpO1xuXHR9XG59O1xuXG5cbi8qKiBBZGQgYmFzZTY0IGhhbmRsZXIgdG8gRGl5YVNlbGVjdG9yICoqL1xuRGl5YVNlbGVjdG9yLnByb3RvdHlwZS5lbmNvZGUgPSBmdW5jdGlvbigpe1xuXHRyZXR1cm4gbmV3IENvZGluZ0hhbmRsZXIoKTtcbn07XG4iXX0=
