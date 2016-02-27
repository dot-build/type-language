(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.TL = factory());
}(this, function () { 'use strict';

  var __commonjs_global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
  function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports, __commonjs_global), module.exports; }


  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  babelHelpers.inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  babelHelpers.possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  babelHelpers;

  var index$3 = __commonjs(function (module) {
  var toString = {}.toString;

  module.exports = Array.isArray || function (arr) {
    return toString.call(arr) == '[object Array]';
  };
  });

  var require$$0 = (index$3 && typeof index$3 === 'object' && 'default' in index$3 ? index$3['default'] : index$3);

  var index$4 = __commonjs(function (module, exports) {
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
  });

  var require$$1 = (index$4 && typeof index$4 === 'object' && 'default' in index$4 ? index$4['default'] : index$4);

  var b64 = __commonjs(function (module, exports, global) {
  ;(function (exports) {
    'use strict'

    var i
    var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    var lookup = []
    for (i = 0; i < code.length; i++) {
      lookup[i] = code[i]
    }
    var revLookup = []

    for (i = 0; i < code.length; ++i) {
      revLookup[code.charCodeAt(i)] = i
    }
    revLookup['-'.charCodeAt(0)] = 62
    revLookup['_'.charCodeAt(0)] = 63

    var Arr = (typeof Uint8Array !== 'undefined')
      ? Uint8Array
      : Array

    function decode (elt) {
      var v = revLookup[elt.charCodeAt(0)]
      return v !== undefined ? v : -1
    }

    function b64ToByteArray (b64) {
      var i, j, l, tmp, placeHolders, arr

      if (b64.length % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4')
      }

      // the number of equal signs (place holders)
      // if there are two placeholders, than the two characters before it
      // represent one byte
      // if there is only one, then the three characters before it represent 2 bytes
      // this is just a cheap hack to not do indexOf twice
      var len = b64.length
      placeHolders = b64.charAt(len - 2) === '=' ? 2 : b64.charAt(len - 1) === '=' ? 1 : 0

      // base64 is 4/3 + up to two characters of the original data
      arr = new Arr(b64.length * 3 / 4 - placeHolders)

      // if there are placeholders, only get up to the last complete 4 chars
      l = placeHolders > 0 ? b64.length - 4 : b64.length

      var L = 0

      function push (v) {
        arr[L++] = v
      }

      for (i = 0, j = 0; i < l; i += 4, j += 3) {
        tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
        push((tmp & 0xFF0000) >> 16)
        push((tmp & 0xFF00) >> 8)
        push(tmp & 0xFF)
      }

      if (placeHolders === 2) {
        tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
        push(tmp & 0xFF)
      } else if (placeHolders === 1) {
        tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
        push((tmp >> 8) & 0xFF)
        push(tmp & 0xFF)
      }

      return arr
    }

    function encode (num) {
      return lookup[num]
    }

    function tripletToBase64 (num) {
      return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
    }

    function encodeChunk (uint8, start, end) {
      var temp
      var output = []
      for (var i = start; i < end; i += 3) {
        temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
        output.push(tripletToBase64(temp))
      }
      return output.join('')
    }

    function uint8ToBase64 (uint8) {
      var i
      var extraBytes = uint8.length % 3 // if we have 1 byte left, pad 2 bytes
      var output = ''
      var parts = []
      var temp, length
      var maxChunkLength = 16383 // must be multiple of 3

      // go through the array every three bytes, we'll deal with trailing stuff later

      for (i = 0, length = uint8.length - extraBytes; i < length; i += maxChunkLength) {
        parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > length ? length : (i + maxChunkLength)))
      }

      // pad the end with zeros, but make sure to not forget the extra bytes
      switch (extraBytes) {
        case 1:
          temp = uint8[uint8.length - 1]
          output += encode(temp >> 2)
          output += encode((temp << 4) & 0x3F)
          output += '=='
          break
        case 2:
          temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
          output += encode(temp >> 10)
          output += encode((temp >> 4) & 0x3F)
          output += encode((temp << 2) & 0x3F)
          output += '='
          break
        default:
          break
      }

      parts.push(output)

      return parts.join('')
    }

    exports.toByteArray = b64ToByteArray
    exports.fromByteArray = uint8ToBase64
  }(typeof exports === 'undefined' ? (__commonjs_global.base64js = {}) : exports))
  });

  var require$$2 = (b64 && typeof b64 === 'object' && 'default' in b64 ? b64['default'] : b64);

  var index$1 = __commonjs(function (module, exports, global) {
  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
   * @license  MIT
   */
  /* eslint-disable no-proto */

  'use strict'

  var base64 = require$$2
  var ieee754 = require$$1
  var isArray = require$$0

  exports.Buffer = Buffer
  exports.SlowBuffer = SlowBuffer
  exports.INSPECT_MAX_BYTES = 50
  Buffer.poolSize = 8192 // not used by this implementation

  var rootParent = {}

  /**
   * If `Buffer.TYPED_ARRAY_SUPPORT`:
   *   === true    Use Uint8Array implementation (fastest)
   *   === false   Use Object implementation (most compatible, even IE6)
   *
   * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
   * Opera 11.6+, iOS 4.2+.
   *
   * Due to various browser bugs, sometimes the Object implementation will be used even
   * when the browser supports typed arrays.
   *
   * Note:
   *
   *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
   *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
   *
   *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
   *
   *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
   *     incorrect length in some situations.

   * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
   * get the Object implementation, which is slower but behaves correctly.
   */
  Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
    ? global.TYPED_ARRAY_SUPPORT
    : typedArraySupport()

  function typedArraySupport () {
    try {
      var arr = new Uint8Array(1)
      arr.foo = function () { return 42 }
      return arr.foo() === 42 && // typed array instances can be augmented
          typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
          arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
    } catch (e) {
      return false
    }
  }

  function kMaxLength () {
    return Buffer.TYPED_ARRAY_SUPPORT
      ? 0x7fffffff
      : 0x3fffffff
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
  function Buffer (arg) {
    if (!(this instanceof Buffer)) {
      // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
      if (arguments.length > 1) return new Buffer(arg, arguments[1])
      return new Buffer(arg)
    }

    if (!Buffer.TYPED_ARRAY_SUPPORT) {
      this.length = 0
      this.parent = undefined
    }

    // Common case.
    if (typeof arg === 'number') {
      return fromNumber(this, arg)
    }

    // Slightly less common case.
    if (typeof arg === 'string') {
      return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
    }

    // Unusual.
    return fromObject(this, arg)
  }

  // TODO: Legacy, not needed anymore. Remove in next major version.
  Buffer._augment = function (arr) {
    arr.__proto__ = Buffer.prototype
    return arr
  }

  function fromNumber (that, length) {
    that = allocate(that, length < 0 ? 0 : checked(length) | 0)
    if (!Buffer.TYPED_ARRAY_SUPPORT) {
      for (var i = 0; i < length; i++) {
        that[i] = 0
      }
    }
    return that
  }

  function fromString (that, string, encoding) {
    if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

    // Assumption: byteLength() return value is always < kMaxLength.
    var length = byteLength(string, encoding) | 0
    that = allocate(that, length)

    that.write(string, encoding)
    return that
  }

  function fromObject (that, object) {
    if (Buffer.isBuffer(object)) return fromBuffer(that, object)

    if (isArray(object)) return fromArray(that, object)

    if (object == null) {
      throw new TypeError('must start with number, buffer, array or string')
    }

    if (typeof ArrayBuffer !== 'undefined') {
      if (object.buffer instanceof ArrayBuffer) {
        return fromTypedArray(that, object)
      }
      if (object instanceof ArrayBuffer) {
        return fromArrayBuffer(that, object)
      }
    }

    if (object.length) return fromArrayLike(that, object)

    return fromJsonObject(that, object)
  }

  function fromBuffer (that, buffer) {
    var length = checked(buffer.length) | 0
    that = allocate(that, length)
    buffer.copy(that, 0, 0, length)
    return that
  }

  function fromArray (that, array) {
    var length = checked(array.length) | 0
    that = allocate(that, length)
    for (var i = 0; i < length; i += 1) {
      that[i] = array[i] & 255
    }
    return that
  }

  // Duplicate of fromArray() to keep fromArray() monomorphic.
  function fromTypedArray (that, array) {
    var length = checked(array.length) | 0
    that = allocate(that, length)
    // Truncating the elements is probably not what people expect from typed
    // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
    // of the old Buffer constructor.
    for (var i = 0; i < length; i += 1) {
      that[i] = array[i] & 255
    }
    return that
  }

  function fromArrayBuffer (that, array) {
    array.byteLength // this throws if `array` is not a valid ArrayBuffer

    if (Buffer.TYPED_ARRAY_SUPPORT) {
      // Return an augmented `Uint8Array` instance, for best performance
      that = new Uint8Array(array)
      that.__proto__ = Buffer.prototype
    } else {
      // Fallback: Return an object instance of the Buffer class
      that = fromTypedArray(that, new Uint8Array(array))
    }
    return that
  }

  function fromArrayLike (that, array) {
    var length = checked(array.length) | 0
    that = allocate(that, length)
    for (var i = 0; i < length; i += 1) {
      that[i] = array[i] & 255
    }
    return that
  }

  // Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
  // Returns a zero-length buffer for inputs that don't conform to the spec.
  function fromJsonObject (that, object) {
    var array
    var length = 0

    if (object.type === 'Buffer' && isArray(object.data)) {
      array = object.data
      length = checked(array.length) | 0
    }
    that = allocate(that, length)

    for (var i = 0; i < length; i += 1) {
      that[i] = array[i] & 255
    }
    return that
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    Buffer.prototype.__proto__ = Uint8Array.prototype
    Buffer.__proto__ = Uint8Array
  } else {
    // pre-set for values that may exist in the future
    Buffer.prototype.length = undefined
    Buffer.prototype.parent = undefined
  }

  function allocate (that, length) {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      // Return an augmented `Uint8Array` instance, for best performance
      that = new Uint8Array(length)
      that.__proto__ = Buffer.prototype
    } else {
      // Fallback: Return an object instance of the Buffer class
      that.length = length
    }

    var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
    if (fromPool) that.parent = rootParent

    return that
  }

  function checked (length) {
    // Note: cannot use `length < kMaxLength` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= kMaxLength()) {
      throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                           'size: 0x' + kMaxLength().toString(16) + ' bytes')
    }
    return length | 0
  }

  function SlowBuffer (subject, encoding) {
    if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

    var buf = new Buffer(subject, encoding)
    delete buf.parent
    return buf
  }

  Buffer.isBuffer = function isBuffer (b) {
    return !!(b != null && b._isBuffer)
  }

  Buffer.compare = function compare (a, b) {
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
      throw new TypeError('Arguments must be Buffers')
    }

    if (a === b) return 0

    var x = a.length
    var y = b.length

    var i = 0
    var len = Math.min(x, y)
    while (i < len) {
      if (a[i] !== b[i]) break

      ++i
    }

    if (i !== len) {
      x = a[i]
      y = b[i]
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
      case 'binary':
      case 'base64':
      case 'raw':
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
    if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

    if (list.length === 0) {
      return new Buffer(0)
    }

    var i
    if (length === undefined) {
      length = 0
      for (i = 0; i < list.length; i++) {
        length += list[i].length
      }
    }

    var buf = new Buffer(length)
    var pos = 0
    for (i = 0; i < list.length; i++) {
      var item = list[i]
      item.copy(buf, pos)
      pos += item.length
    }
    return buf
  }

  function byteLength (string, encoding) {
    if (typeof string !== 'string') string = '' + string

    var len = string.length
    if (len === 0) return 0

    // Use a for loop to avoid recursion
    var loweredCase = false
    for (;;) {
      switch (encoding) {
        case 'ascii':
        case 'binary':
        // Deprecated
        case 'raw':
        case 'raws':
          return len
        case 'utf8':
        case 'utf-8':
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

    start = start | 0
    end = end === undefined || end === Infinity ? this.length : end | 0

    if (!encoding) encoding = 'utf8'
    if (start < 0) start = 0
    if (end > this.length) end = this.length
    if (end <= start) return ''

    while (true) {
      switch (encoding) {
        case 'hex':
          return hexSlice(this, start, end)

        case 'utf8':
        case 'utf-8':
          return utf8Slice(this, start, end)

        case 'ascii':
          return asciiSlice(this, start, end)

        case 'binary':
          return binarySlice(this, start, end)

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

  // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
  // Buffer instances.
  Buffer.prototype._isBuffer = true

  Buffer.prototype.toString = function toString () {
    var length = this.length | 0
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

  Buffer.prototype.compare = function compare (b) {
    if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
    if (this === b) return 0
    return Buffer.compare(this, b)
  }

  Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
    if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
    else if (byteOffset < -0x80000000) byteOffset = -0x80000000
    byteOffset >>= 0

    if (this.length === 0) return -1
    if (byteOffset >= this.length) return -1

    // Negative offsets start from the end of the buffer
    if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

    if (typeof val === 'string') {
      if (val.length === 0) return -1 // special case: looking for empty string always fails
      return String.prototype.indexOf.call(this, val, byteOffset)
    }
    if (Buffer.isBuffer(val)) {
      return arrayIndexOf(this, val, byteOffset)
    }
    if (typeof val === 'number') {
      if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
        return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
      }
      return arrayIndexOf(this, [ val ], byteOffset)
    }

    function arrayIndexOf (arr, val, byteOffset) {
      var foundIndex = -1
      for (var i = 0; byteOffset + i < arr.length; i++) {
        if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
          if (foundIndex === -1) foundIndex = i
          if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
        } else {
          foundIndex = -1
        }
      }
      return -1
    }

    throw new TypeError('val must be string, number or Buffer')
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
    if (strLen % 2 !== 0) throw new Error('Invalid hex string')

    if (length > strLen / 2) {
      length = strLen / 2
    }
    for (var i = 0; i < length; i++) {
      var parsed = parseInt(string.substr(i * 2, 2), 16)
      if (isNaN(parsed)) throw new Error('Invalid hex string')
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

  function binaryWrite (buf, string, offset, length) {
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
      offset = offset | 0
      if (isFinite(length)) {
        length = length | 0
        if (encoding === undefined) encoding = 'utf8'
      } else {
        encoding = length
        length = undefined
      }
    // legacy write(string, encoding, offset, length) - remove in v0.13
    } else {
      var swap = encoding
      encoding = offset
      offset = length | 0
      length = swap
    }

    var remaining = this.length - offset
    if (length === undefined || length > remaining) length = remaining

    if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
      throw new RangeError('attempt to write outside buffer bounds')
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

        case 'binary':
          return binaryWrite(this, string, offset, length)

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

    for (var i = start; i < end; i++) {
      ret += String.fromCharCode(buf[i] & 0x7F)
    }
    return ret
  }

  function binarySlice (buf, start, end) {
    var ret = ''
    end = Math.min(buf.length, end)

    for (var i = start; i < end; i++) {
      ret += String.fromCharCode(buf[i])
    }
    return ret
  }

  function hexSlice (buf, start, end) {
    var len = buf.length

    if (!start || start < 0) start = 0
    if (!end || end < 0 || end > len) end = len

    var out = ''
    for (var i = start; i < end; i++) {
      out += toHex(buf[i])
    }
    return out
  }

  function utf16leSlice (buf, start, end) {
    var bytes = buf.slice(start, end)
    var res = ''
    for (var i = 0; i < bytes.length; i += 2) {
      res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
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

    var newBuf
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      newBuf = this.subarray(start, end)
      newBuf.__proto__ = Buffer.prototype
    } else {
      var sliceLen = end - start
      newBuf = new Buffer(sliceLen, undefined)
      for (var i = 0; i < sliceLen; i++) {
        newBuf[i] = this[i + start]
      }
    }

    if (newBuf.length) newBuf.parent = this.parent || this

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
    offset = offset | 0
    byteLength = byteLength | 0
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
    offset = offset | 0
    byteLength = byteLength | 0
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
    if (!noAssert) checkOffset(offset, 1, this.length)
    return this[offset]
  }

  Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length)
    return this[offset] | (this[offset + 1] << 8)
  }

  Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length)
    return (this[offset] << 8) | this[offset + 1]
  }

  Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length)

    return ((this[offset]) |
        (this[offset + 1] << 8) |
        (this[offset + 2] << 16)) +
        (this[offset + 3] * 0x1000000)
  }

  Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length)

    return (this[offset] * 0x1000000) +
      ((this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      this[offset + 3])
  }

  Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
    offset = offset | 0
    byteLength = byteLength | 0
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
    offset = offset | 0
    byteLength = byteLength | 0
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
    if (!noAssert) checkOffset(offset, 1, this.length)
    if (!(this[offset] & 0x80)) return (this[offset])
    return ((0xff - this[offset] + 1) * -1)
  }

  Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length)
    var val = this[offset] | (this[offset + 1] << 8)
    return (val & 0x8000) ? val | 0xFFFF0000 : val
  }

  Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length)
    var val = this[offset + 1] | (this[offset] << 8)
    return (val & 0x8000) ? val | 0xFFFF0000 : val
  }

  Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length)

    return (this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16) |
      (this[offset + 3] << 24)
  }

  Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length)

    return (this[offset] << 24) |
      (this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      (this[offset + 3])
  }

  Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length)
    return ieee754.read(this, offset, true, 23, 4)
  }

  Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length)
    return ieee754.read(this, offset, false, 23, 4)
  }

  Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 8, this.length)
    return ieee754.read(this, offset, true, 52, 8)
  }

  Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
    if (!noAssert) checkOffset(offset, 8, this.length)
    return ieee754.read(this, offset, false, 52, 8)
  }

  function checkInt (buf, value, offset, ext, max, min) {
    if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
    if (value > max || value < min) throw new RangeError('value is out of bounds')
    if (offset + ext > buf.length) throw new RangeError('index out of range')
  }

  Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
    value = +value
    offset = offset | 0
    byteLength = byteLength | 0
    if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

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
    offset = offset | 0
    byteLength = byteLength | 0
    if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

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
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
    this[offset] = (value & 0xff)
    return offset + 1
  }

  function objectWriteUInt16 (buf, value, offset, littleEndian) {
    if (value < 0) value = 0xffff + value + 1
    for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
      buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
        (littleEndian ? i : 1 - i) * 8
    }
  }

  Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value & 0xff)
      this[offset + 1] = (value >>> 8)
    } else {
      objectWriteUInt16(this, value, offset, true)
    }
    return offset + 2
  }

  Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value >>> 8)
      this[offset + 1] = (value & 0xff)
    } else {
      objectWriteUInt16(this, value, offset, false)
    }
    return offset + 2
  }

  function objectWriteUInt32 (buf, value, offset, littleEndian) {
    if (value < 0) value = 0xffffffff + value + 1
    for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
      buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
    }
  }

  Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset + 3] = (value >>> 24)
      this[offset + 2] = (value >>> 16)
      this[offset + 1] = (value >>> 8)
      this[offset] = (value & 0xff)
    } else {
      objectWriteUInt32(this, value, offset, true)
    }
    return offset + 4
  }

  Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value >>> 24)
      this[offset + 1] = (value >>> 16)
      this[offset + 2] = (value >>> 8)
      this[offset + 3] = (value & 0xff)
    } else {
      objectWriteUInt32(this, value, offset, false)
    }
    return offset + 4
  }

  Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) {
      var limit = Math.pow(2, 8 * byteLength - 1)

      checkInt(this, value, offset, byteLength, limit - 1, -limit)
    }

    var i = 0
    var mul = 1
    var sub = value < 0 ? 1 : 0
    this[offset] = value & 0xFF
    while (++i < byteLength && (mul *= 0x100)) {
      this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
    }

    return offset + byteLength
  }

  Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) {
      var limit = Math.pow(2, 8 * byteLength - 1)

      checkInt(this, value, offset, byteLength, limit - 1, -limit)
    }

    var i = byteLength - 1
    var mul = 1
    var sub = value < 0 ? 1 : 0
    this[offset + i] = value & 0xFF
    while (--i >= 0 && (mul *= 0x100)) {
      this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
    }

    return offset + byteLength
  }

  Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
    if (value < 0) value = 0xff + value + 1
    this[offset] = (value & 0xff)
    return offset + 1
  }

  Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value & 0xff)
      this[offset + 1] = (value >>> 8)
    } else {
      objectWriteUInt16(this, value, offset, true)
    }
    return offset + 2
  }

  Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value >>> 8)
      this[offset + 1] = (value & 0xff)
    } else {
      objectWriteUInt16(this, value, offset, false)
    }
    return offset + 2
  }

  Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value & 0xff)
      this[offset + 1] = (value >>> 8)
      this[offset + 2] = (value >>> 16)
      this[offset + 3] = (value >>> 24)
    } else {
      objectWriteUInt32(this, value, offset, true)
    }
    return offset + 4
  }

  Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
    value = +value
    offset = offset | 0
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
    if (value < 0) value = 0xffffffff + value + 1
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = (value >>> 24)
      this[offset + 1] = (value >>> 16)
      this[offset + 2] = (value >>> 8)
      this[offset + 3] = (value & 0xff)
    } else {
      objectWriteUInt32(this, value, offset, false)
    }
    return offset + 4
  }

  function checkIEEE754 (buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length) throw new RangeError('index out of range')
    if (offset < 0) throw new RangeError('index out of range')
  }

  function writeFloat (buf, value, offset, littleEndian, noAssert) {
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
      for (i = len - 1; i >= 0; i--) {
        target[i + targetStart] = this[i + start]
      }
    } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
      // ascending copy from start
      for (i = 0; i < len; i++) {
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

  // fill(value, start=0, end=buffer.length)
  Buffer.prototype.fill = function fill (value, start, end) {
    if (!value) value = 0
    if (!start) start = 0
    if (!end) end = this.length

    if (end < start) throw new RangeError('end < start')

    // Fill 0 bytes; we're done
    if (end === start) return
    if (this.length === 0) return

    if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
    if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

    var i
    if (typeof value === 'number') {
      for (i = start; i < end; i++) {
        this[i] = value
      }
    } else {
      var bytes = utf8ToBytes(value.toString())
      var len = bytes.length
      for (i = start; i < end; i++) {
        this[i] = bytes[i % len]
      }
    }

    return this
  }

  // HELPER FUNCTIONS
  // ================

  var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

  function base64clean (str) {
    // Node strips out invalid characters like \n and \t from the string, base64-js does not
    str = stringtrim(str).replace(INVALID_BASE64_RE, '')
    // Node converts strings with length < 2 to ''
    if (str.length < 2) return ''
    // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
    while (str.length % 4 !== 0) {
      str = str + '='
    }
    return str
  }

  function stringtrim (str) {
    if (str.trim) return str.trim()
    return str.replace(/^\s+|\s+$/g, '')
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

    for (var i = 0; i < length; i++) {
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
    for (var i = 0; i < str.length; i++) {
      // Node's code seems to be doing this and not & 0x7F..
      byteArray.push(str.charCodeAt(i) & 0xFF)
    }
    return byteArray
  }

  function utf16leToBytes (str, units) {
    var c, hi, lo
    var byteArray = []
    for (var i = 0; i < str.length; i++) {
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
    for (var i = 0; i < length; i++) {
      if ((i + offset >= dst.length) || (i >= src.length)) break
      dst[i + offset] = src[i]
    }
    return i
  }
  });

  var Buffer$1 = index$1.Buffer;

  /**
   * Base class to all TL objects
   */

  var TLObject = function () {

      /**
       * @param {Object} [data]      Object literal with properties to add on instance
       */

      function TLObject() {
          var data = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
          babelHelpers.classCallCheck(this, TLObject);

          if (data) {
              Object.assign(this, data);
          }
      }

      babelHelpers.createClass(TLObject, [{
          key: 'toJSON',
          value: function toJSON() {
              var self = this;
              var type = this.__id.type;
              var result = { _: type, params: {} };

              Object.keys(this).forEach(function (name) {
                  var value = self[name];

                  if (value === null || value === undefined) return;

                  if (value instanceof TLObject) {
                      value = value.toJSON();
                  }

                  if (Buffer$1.isBuffer(value)) {
                      value = '0x' + value.toString('hex');
                  }

                  result.params[name] = value;
              });

              return result;
          }
      }, {
          key: 'toString',
          value: function toString() {
              JSON.stringify(this.toJSON(), null, '  ');
          }
      }]);
      return TLObject;
  }();

  TLObject.id = TLObject.prototype.__id = {
      id: '',
      type: '',
      baseType: 'Object',
      params: []
  };

  var VectorType = /^[Vv]ector<(.+)>$/;

  var TypeRegistry = function () {
      function TypeRegistry() {
          babelHelpers.classCallCheck(this, TypeRegistry);

          this._byId = {};
          this._byType = {};
          this.types = {};
      }

      /**
       * @param {Function} Type               TLObject constructor
       * @param {string} [namespace='']       Optional namespace (type prefix)
       */


      babelHelpers.createClass(TypeRegistry, [{
          key: 'addType',
          value: function addType(Type, namespace) {
              var typeMeta = Type.id;
              var ns = namespace ? namespace + '.' : '';

              var id = ns + typeMeta.id;
              var type = ns + typeMeta.type;

              this._byId[id] = Type;
              this._byType[type] = Type;

              this.addTypeReference(Type, type);
          }

          /**
           * @param {Function} Type
           * @param {string} [namespace='']
           */

      }, {
          key: 'addTypeReference',
          value: function addTypeReference(Type, namespace) {
              var parent = this.types;
              var typeName = namespace;

              if (~namespace.indexOf('.')) {
                  var parts = typeName.split('.');
                  typeName = parts.pop();
                  parts.forEach(function (prefix) {
                      parent = parent[prefix] || (parent[prefix] = {});
                  });
              }

              parent[typeName] = Type;
          }

          /**
           * @param {Object} schema
           * @property {Array<Object>} constructors
           * @property {Array<Object>} methods
           * @param {string} [namespace='']
           */

      }, {
          key: 'importSchema',
          value: function importSchema(schema) {
              var _this = this;

              var namespace = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

              var register = function register(type) {
                  return _this.importType(type, namespace);
              };

              (schema.constructors || []).forEach(register);
              (schema.methods || []).forEach(register);
          }

          /**
           * @param {Object} typeDefinition
           * @param {string} [namespace='']
           */

      }, {
          key: 'importType',
          value: function importType(typeDefinition, namespace) {
              this.addType(this.createType(typeDefinition), namespace);
          }
      }, {
          key: 'createType',
          value: function createType(typeDefinition) {
              var type = typeDefinition.method || typeDefinition.predicate;
              var baseType = typeDefinition.type;
              var params = typeDefinition.params;

              var id = typeDefinition.id;
              var typeHash = new Buffer(4);
              typeHash.writeInt32LE(id, 0);
              id = typeHash.toString('hex');

              this._normalizeParams(params);

              var typeMetadata = { id: id, type: type, baseType: baseType, params: params };

              var Type = function (_TLObject) {
                  babelHelpers.inherits(Type, _TLObject);

                  function Type() {
                      babelHelpers.classCallCheck(this, Type);
                      return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Type).apply(this, arguments));
                  }

                  return Type;
              }(TLObject);

              Type.id = Type.prototype.__id = typeMetadata;
              Type.params = typeDefinition.params;

              return Type;
          }
      }, {
          key: 'getByType',
          value: function getByType(type) {
              return this._byType[type];
          }
      }, {
          key: 'getById',
          value: function getById(id) {
              return this._byId[id];
          }
      }, {
          key: '_normalizeParams',
          value: function _normalizeParams(params) {
              params.forEach(function (param) {
                  var type = param.type;
                  if (!VectorType.test(type)) return;

                  var match = type.match(VectorType);
                  type = match[1];

                  param.type = type;
                  param.isVector = true;
                  param.isBare = type.charAt(0) === '%';
              });
          }
      }]);
      return TypeRegistry;
  }();

  var registry = new TypeRegistry();

  var index$5 = __commonjs(function (module, exports, global) {
  (function(){

      // Copyright (c) 2005  Tom Wu
      // All Rights Reserved.
      // See "LICENSE" for details.

      // Basic JavaScript BN library - subset useful for RSA encryption.

      // Bits per digit
      var dbits;

      // JavaScript engine analysis
      var canary = 0xdeadbeefcafe;
      var j_lm = ((canary&0xffffff)==0xefcafe);

      // (public) Constructor
      function BigInteger(a,b,c) {
        if(a != null)
          if("number" == typeof a) this.fromNumber(a,b,c);
          else if(b == null && "string" != typeof a) this.fromString(a,256);
          else this.fromString(a,b);
      }

      // return new, unset BigInteger
      function nbi() { return new BigInteger(null); }

      // am: Compute w_j += (x*this_i), propagate carries,
      // c is initial carry, returns final carry.
      // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
      // We need to select the fastest one that works in this environment.

      // am1: use a single mult and divide to get the high bits,
      // max digit bits should be 26 because
      // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
      function am1(i,x,w,j,c,n) {
        while(--n >= 0) {
          var v = x*this[i++]+w[j]+c;
          c = Math.floor(v/0x4000000);
          w[j++] = v&0x3ffffff;
        }
        return c;
      }
      // am2 avoids a big mult-and-extract completely.
      // Max digit bits should be <= 30 because we do bitwise ops
      // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
      function am2(i,x,w,j,c,n) {
        var xl = x&0x7fff, xh = x>>15;
        while(--n >= 0) {
          var l = this[i]&0x7fff;
          var h = this[i++]>>15;
          var m = xh*l+h*xl;
          l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
          c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
          w[j++] = l&0x3fffffff;
        }
        return c;
      }
      // Alternately, set max digit bits to 28 since some
      // browsers slow down when dealing with 32-bit numbers.
      function am3(i,x,w,j,c,n) {
        var xl = x&0x3fff, xh = x>>14;
        while(--n >= 0) {
          var l = this[i]&0x3fff;
          var h = this[i++]>>14;
          var m = xh*l+h*xl;
          l = xl*l+((m&0x3fff)<<14)+w[j]+c;
          c = (l>>28)+(m>>14)+xh*h;
          w[j++] = l&0xfffffff;
        }
        return c;
      }
      var inBrowser = typeof navigator !== "undefined";
      if(inBrowser && j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
        BigInteger.prototype.am = am2;
        dbits = 30;
      }
      else if(inBrowser && j_lm && (navigator.appName != "Netscape")) {
        BigInteger.prototype.am = am1;
        dbits = 26;
      }
      else { // Mozilla/Netscape seems to prefer am3
        BigInteger.prototype.am = am3;
        dbits = 28;
      }

      BigInteger.prototype.DB = dbits;
      BigInteger.prototype.DM = ((1<<dbits)-1);
      BigInteger.prototype.DV = (1<<dbits);

      var BI_FP = 52;
      BigInteger.prototype.FV = Math.pow(2,BI_FP);
      BigInteger.prototype.F1 = BI_FP-dbits;
      BigInteger.prototype.F2 = 2*dbits-BI_FP;

      // Digit conversions
      var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
      var BI_RC = new Array();
      var rr,vv;
      rr = "0".charCodeAt(0);
      for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
      rr = "a".charCodeAt(0);
      for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
      rr = "A".charCodeAt(0);
      for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

      function int2char(n) { return BI_RM.charAt(n); }
      function intAt(s,i) {
        var c = BI_RC[s.charCodeAt(i)];
        return (c==null)?-1:c;
      }

      // (protected) copy this to r
      function bnpCopyTo(r) {
        for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
        r.t = this.t;
        r.s = this.s;
      }

      // (protected) set from integer value x, -DV <= x < DV
      function bnpFromInt(x) {
        this.t = 1;
        this.s = (x<0)?-1:0;
        if(x > 0) this[0] = x;
        else if(x < -1) this[0] = x+this.DV;
        else this.t = 0;
      }

      // return bigint initialized to value
      function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

      // (protected) set from string and radix
      function bnpFromString(s,b) {
        var k;
        if(b == 16) k = 4;
        else if(b == 8) k = 3;
        else if(b == 256) k = 8; // byte array
        else if(b == 2) k = 1;
        else if(b == 32) k = 5;
        else if(b == 4) k = 2;
        else { this.fromRadix(s,b); return; }
        this.t = 0;
        this.s = 0;
        var i = s.length, mi = false, sh = 0;
        while(--i >= 0) {
          var x = (k==8)?s[i]&0xff:intAt(s,i);
          if(x < 0) {
            if(s.charAt(i) == "-") mi = true;
            continue;
          }
          mi = false;
          if(sh == 0)
            this[this.t++] = x;
          else if(sh+k > this.DB) {
            this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
            this[this.t++] = (x>>(this.DB-sh));
          }
          else
            this[this.t-1] |= x<<sh;
          sh += k;
          if(sh >= this.DB) sh -= this.DB;
        }
        if(k == 8 && (s[0]&0x80) != 0) {
          this.s = -1;
          if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
        }
        this.clamp();
        if(mi) BigInteger.ZERO.subTo(this,this);
      }

      // (protected) clamp off excess high words
      function bnpClamp() {
        var c = this.s&this.DM;
        while(this.t > 0 && this[this.t-1] == c) --this.t;
      }

      // (public) return string representation in given radix
      function bnToString(b) {
        if(this.s < 0) return "-"+this.negate().toString(b);
        var k;
        if(b == 16) k = 4;
        else if(b == 8) k = 3;
        else if(b == 2) k = 1;
        else if(b == 32) k = 5;
        else if(b == 4) k = 2;
        else return this.toRadix(b);
        var km = (1<<k)-1, d, m = false, r = "", i = this.t;
        var p = this.DB-(i*this.DB)%k;
        if(i-- > 0) {
          if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
          while(i >= 0) {
            if(p < k) {
              d = (this[i]&((1<<p)-1))<<(k-p);
              d |= this[--i]>>(p+=this.DB-k);
            }
            else {
              d = (this[i]>>(p-=k))&km;
              if(p <= 0) { p += this.DB; --i; }
            }
            if(d > 0) m = true;
            if(m) r += int2char(d);
          }
        }
        return m?r:"0";
      }

      // (public) -this
      function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

      // (public) |this|
      function bnAbs() { return (this.s<0)?this.negate():this; }

      // (public) return + if this > a, - if this < a, 0 if equal
      function bnCompareTo(a) {
        var r = this.s-a.s;
        if(r != 0) return r;
        var i = this.t;
        r = i-a.t;
        if(r != 0) return (this.s<0)?-r:r;
        while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
        return 0;
      }

      // returns bit length of the integer x
      function nbits(x) {
        var r = 1, t;
        if((t=x>>>16) != 0) { x = t; r += 16; }
        if((t=x>>8) != 0) { x = t; r += 8; }
        if((t=x>>4) != 0) { x = t; r += 4; }
        if((t=x>>2) != 0) { x = t; r += 2; }
        if((t=x>>1) != 0) { x = t; r += 1; }
        return r;
      }

      // (public) return the number of bits in "this"
      function bnBitLength() {
        if(this.t <= 0) return 0;
        return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
      }

      // (protected) r = this << n*DB
      function bnpDLShiftTo(n,r) {
        var i;
        for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
        for(i = n-1; i >= 0; --i) r[i] = 0;
        r.t = this.t+n;
        r.s = this.s;
      }

      // (protected) r = this >> n*DB
      function bnpDRShiftTo(n,r) {
        for(var i = n; i < this.t; ++i) r[i-n] = this[i];
        r.t = Math.max(this.t-n,0);
        r.s = this.s;
      }

      // (protected) r = this << n
      function bnpLShiftTo(n,r) {
        var bs = n%this.DB;
        var cbs = this.DB-bs;
        var bm = (1<<cbs)-1;
        var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
        for(i = this.t-1; i >= 0; --i) {
          r[i+ds+1] = (this[i]>>cbs)|c;
          c = (this[i]&bm)<<bs;
        }
        for(i = ds-1; i >= 0; --i) r[i] = 0;
        r[ds] = c;
        r.t = this.t+ds+1;
        r.s = this.s;
        r.clamp();
      }

      // (protected) r = this >> n
      function bnpRShiftTo(n,r) {
        r.s = this.s;
        var ds = Math.floor(n/this.DB);
        if(ds >= this.t) { r.t = 0; return; }
        var bs = n%this.DB;
        var cbs = this.DB-bs;
        var bm = (1<<bs)-1;
        r[0] = this[ds]>>bs;
        for(var i = ds+1; i < this.t; ++i) {
          r[i-ds-1] |= (this[i]&bm)<<cbs;
          r[i-ds] = this[i]>>bs;
        }
        if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
        r.t = this.t-ds;
        r.clamp();
      }

      // (protected) r = this - a
      function bnpSubTo(a,r) {
        var i = 0, c = 0, m = Math.min(a.t,this.t);
        while(i < m) {
          c += this[i]-a[i];
          r[i++] = c&this.DM;
          c >>= this.DB;
        }
        if(a.t < this.t) {
          c -= a.s;
          while(i < this.t) {
            c += this[i];
            r[i++] = c&this.DM;
            c >>= this.DB;
          }
          c += this.s;
        }
        else {
          c += this.s;
          while(i < a.t) {
            c -= a[i];
            r[i++] = c&this.DM;
            c >>= this.DB;
          }
          c -= a.s;
        }
        r.s = (c<0)?-1:0;
        if(c < -1) r[i++] = this.DV+c;
        else if(c > 0) r[i++] = c;
        r.t = i;
        r.clamp();
      }

      // (protected) r = this * a, r != this,a (HAC 14.12)
      // "this" should be the larger one if appropriate.
      function bnpMultiplyTo(a,r) {
        var x = this.abs(), y = a.abs();
        var i = x.t;
        r.t = i+y.t;
        while(--i >= 0) r[i] = 0;
        for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
        r.s = 0;
        r.clamp();
        if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
      }

      // (protected) r = this^2, r != this (HAC 14.16)
      function bnpSquareTo(r) {
        var x = this.abs();
        var i = r.t = 2*x.t;
        while(--i >= 0) r[i] = 0;
        for(i = 0; i < x.t-1; ++i) {
          var c = x.am(i,x[i],r,2*i,0,1);
          if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
            r[i+x.t] -= x.DV;
            r[i+x.t+1] = 1;
          }
        }
        if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
        r.s = 0;
        r.clamp();
      }

      // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
      // r != q, this != m.  q or r may be null.
      function bnpDivRemTo(m,q,r) {
        var pm = m.abs();
        if(pm.t <= 0) return;
        var pt = this.abs();
        if(pt.t < pm.t) {
          if(q != null) q.fromInt(0);
          if(r != null) this.copyTo(r);
          return;
        }
        if(r == null) r = nbi();
        var y = nbi(), ts = this.s, ms = m.s;
        var nsh = this.DB-nbits(pm[pm.t-1]);   // normalize modulus
        if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
        else { pm.copyTo(y); pt.copyTo(r); }
        var ys = y.t;
        var y0 = y[ys-1];
        if(y0 == 0) return;
        var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
        var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
        var i = r.t, j = i-ys, t = (q==null)?nbi():q;
        y.dlShiftTo(j,t);
        if(r.compareTo(t) >= 0) {
          r[r.t++] = 1;
          r.subTo(t,r);
        }
        BigInteger.ONE.dlShiftTo(ys,t);
        t.subTo(y,y);  // "negative" y so we can replace sub with am later
        while(y.t < ys) y[y.t++] = 0;
        while(--j >= 0) {
          // Estimate quotient digit
          var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
          if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {   // Try it out
            y.dlShiftTo(j,t);
            r.subTo(t,r);
            while(r[i] < --qd) r.subTo(t,r);
          }
        }
        if(q != null) {
          r.drShiftTo(ys,q);
          if(ts != ms) BigInteger.ZERO.subTo(q,q);
        }
        r.t = ys;
        r.clamp();
        if(nsh > 0) r.rShiftTo(nsh,r); // Denormalize remainder
        if(ts < 0) BigInteger.ZERO.subTo(r,r);
      }

      // (public) this mod a
      function bnMod(a) {
        var r = nbi();
        this.abs().divRemTo(a,null,r);
        if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
        return r;
      }

      // Modular reduction using "classic" algorithm
      function Classic(m) { this.m = m; }
      function cConvert(x) {
        if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
        else return x;
      }
      function cRevert(x) { return x; }
      function cReduce(x) { x.divRemTo(this.m,null,x); }
      function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
      function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

      Classic.prototype.convert = cConvert;
      Classic.prototype.revert = cRevert;
      Classic.prototype.reduce = cReduce;
      Classic.prototype.mulTo = cMulTo;
      Classic.prototype.sqrTo = cSqrTo;

      // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
      // justification:
      //         xy == 1 (mod m)
      //         xy =  1+km
      //   xy(2-xy) = (1+km)(1-km)
      // x[y(2-xy)] = 1-k^2m^2
      // x[y(2-xy)] == 1 (mod m^2)
      // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
      // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
      // JS multiply "overflows" differently from C/C++, so care is needed here.
      function bnpInvDigit() {
        if(this.t < 1) return 0;
        var x = this[0];
        if((x&1) == 0) return 0;
        var y = x&3;       // y == 1/x mod 2^2
        y = (y*(2-(x&0xf)*y))&0xf; // y == 1/x mod 2^4
        y = (y*(2-(x&0xff)*y))&0xff;   // y == 1/x mod 2^8
        y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;    // y == 1/x mod 2^16
        // last step - calculate inverse mod DV directly;
        // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
        y = (y*(2-x*y%this.DV))%this.DV;       // y == 1/x mod 2^dbits
        // we really want the negative inverse, and -DV < y < DV
        return (y>0)?this.DV-y:-y;
      }

      // Montgomery reduction
      function Montgomery(m) {
        this.m = m;
        this.mp = m.invDigit();
        this.mpl = this.mp&0x7fff;
        this.mph = this.mp>>15;
        this.um = (1<<(m.DB-15))-1;
        this.mt2 = 2*m.t;
      }

      // xR mod m
      function montConvert(x) {
        var r = nbi();
        x.abs().dlShiftTo(this.m.t,r);
        r.divRemTo(this.m,null,r);
        if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
        return r;
      }

      // x/R mod m
      function montRevert(x) {
        var r = nbi();
        x.copyTo(r);
        this.reduce(r);
        return r;
      }

      // x = x/R mod m (HAC 14.32)
      function montReduce(x) {
        while(x.t <= this.mt2) // pad x so am has enough room later
          x[x.t++] = 0;
        for(var i = 0; i < this.m.t; ++i) {
          // faster way of calculating u0 = x[i]*mp mod DV
          var j = x[i]&0x7fff;
          var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
          // use am to combine the multiply-shift-add into one call
          j = i+this.m.t;
          x[j] += this.m.am(0,u0,x,i,0,this.m.t);
          // propagate carry
          while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
        }
        x.clamp();
        x.drShiftTo(this.m.t,x);
        if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
      }

      // r = "x^2/R mod m"; x != r
      function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

      // r = "xy/R mod m"; x,y != r
      function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

      Montgomery.prototype.convert = montConvert;
      Montgomery.prototype.revert = montRevert;
      Montgomery.prototype.reduce = montReduce;
      Montgomery.prototype.mulTo = montMulTo;
      Montgomery.prototype.sqrTo = montSqrTo;

      // (protected) true iff this is even
      function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

      // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
      function bnpExp(e,z) {
        if(e > 0xffffffff || e < 1) return BigInteger.ONE;
        var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
        g.copyTo(r);
        while(--i >= 0) {
          z.sqrTo(r,r2);
          if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
          else { var t = r; r = r2; r2 = t; }
        }
        return z.revert(r);
      }

      // (public) this^e % m, 0 <= e < 2^32
      function bnModPowInt(e,m) {
        var z;
        if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
        return this.exp(e,z);
      }

      // protected
      BigInteger.prototype.copyTo = bnpCopyTo;
      BigInteger.prototype.fromInt = bnpFromInt;
      BigInteger.prototype.fromString = bnpFromString;
      BigInteger.prototype.clamp = bnpClamp;
      BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
      BigInteger.prototype.drShiftTo = bnpDRShiftTo;
      BigInteger.prototype.lShiftTo = bnpLShiftTo;
      BigInteger.prototype.rShiftTo = bnpRShiftTo;
      BigInteger.prototype.subTo = bnpSubTo;
      BigInteger.prototype.multiplyTo = bnpMultiplyTo;
      BigInteger.prototype.squareTo = bnpSquareTo;
      BigInteger.prototype.divRemTo = bnpDivRemTo;
      BigInteger.prototype.invDigit = bnpInvDigit;
      BigInteger.prototype.isEven = bnpIsEven;
      BigInteger.prototype.exp = bnpExp;

      // public
      BigInteger.prototype.toString = bnToString;
      BigInteger.prototype.negate = bnNegate;
      BigInteger.prototype.abs = bnAbs;
      BigInteger.prototype.compareTo = bnCompareTo;
      BigInteger.prototype.bitLength = bnBitLength;
      BigInteger.prototype.mod = bnMod;
      BigInteger.prototype.modPowInt = bnModPowInt;

      // "constants"
      BigInteger.ZERO = nbv(0);
      BigInteger.ONE = nbv(1);

      // Copyright (c) 2005-2009  Tom Wu
      // All Rights Reserved.
      // See "LICENSE" for details.

      // Extended JavaScript BN functions, required for RSA private ops.

      // Version 1.1: new BigInteger("0", 10) returns "proper" zero
      // Version 1.2: square() API, isProbablePrime fix

      // (public)
      function bnClone() { var r = nbi(); this.copyTo(r); return r; }

      // (public) return value as integer
      function bnIntValue() {
        if(this.s < 0) {
          if(this.t == 1) return this[0]-this.DV;
          else if(this.t == 0) return -1;
        }
        else if(this.t == 1) return this[0];
        else if(this.t == 0) return 0;
        // assumes 16 < DB < 32
        return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
      }

      // (public) return value as byte
      function bnByteValue() { return (this.t==0)?this.s:(this[0]<<24)>>24; }

      // (public) return value as short (assumes DB>=16)
      function bnShortValue() { return (this.t==0)?this.s:(this[0]<<16)>>16; }

      // (protected) return x s.t. r^x < DV
      function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }

      // (public) 0 if this == 0, 1 if this > 0
      function bnSigNum() {
        if(this.s < 0) return -1;
        else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
        else return 1;
      }

      // (protected) convert to radix string
      function bnpToRadix(b) {
        if(b == null) b = 10;
        if(this.signum() == 0 || b < 2 || b > 36) return "0";
        var cs = this.chunkSize(b);
        var a = Math.pow(b,cs);
        var d = nbv(a), y = nbi(), z = nbi(), r = "";
        this.divRemTo(d,y,z);
        while(y.signum() > 0) {
          r = (a+z.intValue()).toString(b).substr(1) + r;
          y.divRemTo(d,y,z);
        }
        return z.intValue().toString(b) + r;
      }

      // (protected) convert from radix string
      function bnpFromRadix(s,b) {
        this.fromInt(0);
        if(b == null) b = 10;
        var cs = this.chunkSize(b);
        var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
        for(var i = 0; i < s.length; ++i) {
          var x = intAt(s,i);
          if(x < 0) {
            if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
            continue;
          }
          w = b*w+x;
          if(++j >= cs) {
            this.dMultiply(d);
            this.dAddOffset(w,0);
            j = 0;
            w = 0;
          }
        }
        if(j > 0) {
          this.dMultiply(Math.pow(b,j));
          this.dAddOffset(w,0);
        }
        if(mi) BigInteger.ZERO.subTo(this,this);
      }

      // (protected) alternate constructor
      function bnpFromNumber(a,b,c) {
        if("number" == typeof b) {
          // new BigInteger(int,int,RNG)
          if(a < 2) this.fromInt(1);
          else {
            this.fromNumber(a,c);
            if(!this.testBit(a-1))	// force MSB set
              this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
            if(this.isEven()) this.dAddOffset(1,0); // force odd
            while(!this.isProbablePrime(b)) {
              this.dAddOffset(2,0);
              if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
            }
          }
        }
        else {
          // new BigInteger(int,RNG)
          var x = new Array(), t = a&7;
          x.length = (a>>3)+1;
          b.nextBytes(x);
          if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
          this.fromString(x,256);
        }
      }

      // (public) convert to bigendian byte array
      function bnToByteArray() {
        var i = this.t, r = new Array();
        r[0] = this.s;
        var p = this.DB-(i*this.DB)%8, d, k = 0;
        if(i-- > 0) {
          if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
            r[k++] = d|(this.s<<(this.DB-p));
          while(i >= 0) {
            if(p < 8) {
              d = (this[i]&((1<<p)-1))<<(8-p);
              d |= this[--i]>>(p+=this.DB-8);
            }
            else {
              d = (this[i]>>(p-=8))&0xff;
              if(p <= 0) { p += this.DB; --i; }
            }
            if((d&0x80) != 0) d |= -256;
            if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
            if(k > 0 || d != this.s) r[k++] = d;
          }
        }
        return r;
      }

      function bnEquals(a) { return(this.compareTo(a)==0); }
      function bnMin(a) { return(this.compareTo(a)<0)?this:a; }
      function bnMax(a) { return(this.compareTo(a)>0)?this:a; }

      // (protected) r = this op a (bitwise)
      function bnpBitwiseTo(a,op,r) {
        var i, f, m = Math.min(a.t,this.t);
        for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
        if(a.t < this.t) {
          f = a.s&this.DM;
          for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
          r.t = this.t;
        }
        else {
          f = this.s&this.DM;
          for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
          r.t = a.t;
        }
        r.s = op(this.s,a.s);
        r.clamp();
      }

      // (public) this & a
      function op_and(x,y) { return x&y; }
      function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }

      // (public) this | a
      function op_or(x,y) { return x|y; }
      function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }

      // (public) this ^ a
      function op_xor(x,y) { return x^y; }
      function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }

      // (public) this & ~a
      function op_andnot(x,y) { return x&~y; }
      function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }

      // (public) ~this
      function bnNot() {
        var r = nbi();
        for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
        r.t = this.t;
        r.s = ~this.s;
        return r;
      }

      // (public) this << n
      function bnShiftLeft(n) {
        var r = nbi();
        if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
        return r;
      }

      // (public) this >> n
      function bnShiftRight(n) {
        var r = nbi();
        if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
        return r;
      }

      // return index of lowest 1-bit in x, x < 2^31
      function lbit(x) {
        if(x == 0) return -1;
        var r = 0;
        if((x&0xffff) == 0) { x >>= 16; r += 16; }
        if((x&0xff) == 0) { x >>= 8; r += 8; }
        if((x&0xf) == 0) { x >>= 4; r += 4; }
        if((x&3) == 0) { x >>= 2; r += 2; }
        if((x&1) == 0) ++r;
        return r;
      }

      // (public) returns index of lowest 1-bit (or -1 if none)
      function bnGetLowestSetBit() {
        for(var i = 0; i < this.t; ++i)
          if(this[i] != 0) return i*this.DB+lbit(this[i]);
        if(this.s < 0) return this.t*this.DB;
        return -1;
      }

      // return number of 1 bits in x
      function cbit(x) {
        var r = 0;
        while(x != 0) { x &= x-1; ++r; }
        return r;
      }

      // (public) return number of set bits
      function bnBitCount() {
        var r = 0, x = this.s&this.DM;
        for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
        return r;
      }

      // (public) true iff nth bit is set
      function bnTestBit(n) {
        var j = Math.floor(n/this.DB);
        if(j >= this.t) return(this.s!=0);
        return((this[j]&(1<<(n%this.DB)))!=0);
      }

      // (protected) this op (1<<n)
      function bnpChangeBit(n,op) {
        var r = BigInteger.ONE.shiftLeft(n);
        this.bitwiseTo(r,op,r);
        return r;
      }

      // (public) this | (1<<n)
      function bnSetBit(n) { return this.changeBit(n,op_or); }

      // (public) this & ~(1<<n)
      function bnClearBit(n) { return this.changeBit(n,op_andnot); }

      // (public) this ^ (1<<n)
      function bnFlipBit(n) { return this.changeBit(n,op_xor); }

      // (protected) r = this + a
      function bnpAddTo(a,r) {
        var i = 0, c = 0, m = Math.min(a.t,this.t);
        while(i < m) {
          c += this[i]+a[i];
          r[i++] = c&this.DM;
          c >>= this.DB;
        }
        if(a.t < this.t) {
          c += a.s;
          while(i < this.t) {
            c += this[i];
            r[i++] = c&this.DM;
            c >>= this.DB;
          }
          c += this.s;
        }
        else {
          c += this.s;
          while(i < a.t) {
            c += a[i];
            r[i++] = c&this.DM;
            c >>= this.DB;
          }
          c += a.s;
        }
        r.s = (c<0)?-1:0;
        if(c > 0) r[i++] = c;
        else if(c < -1) r[i++] = this.DV+c;
        r.t = i;
        r.clamp();
      }

      // (public) this + a
      function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }

      // (public) this - a
      function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }

      // (public) this * a
      function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }

      // (public) this^2
      function bnSquare() { var r = nbi(); this.squareTo(r); return r; }

      // (public) this / a
      function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }

      // (public) this % a
      function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }

      // (public) [this/a,this%a]
      function bnDivideAndRemainder(a) {
        var q = nbi(), r = nbi();
        this.divRemTo(a,q,r);
        return new Array(q,r);
      }

      // (protected) this *= n, this >= 0, 1 < n < DV
      function bnpDMultiply(n) {
        this[this.t] = this.am(0,n-1,this,0,0,this.t);
        ++this.t;
        this.clamp();
      }

      // (protected) this += n << w words, this >= 0
      function bnpDAddOffset(n,w) {
        if(n == 0) return;
        while(this.t <= w) this[this.t++] = 0;
        this[w] += n;
        while(this[w] >= this.DV) {
          this[w] -= this.DV;
          if(++w >= this.t) this[this.t++] = 0;
          ++this[w];
        }
      }

      // A "null" reducer
      function NullExp() {}
      function nNop(x) { return x; }
      function nMulTo(x,y,r) { x.multiplyTo(y,r); }
      function nSqrTo(x,r) { x.squareTo(r); }

      NullExp.prototype.convert = nNop;
      NullExp.prototype.revert = nNop;
      NullExp.prototype.mulTo = nMulTo;
      NullExp.prototype.sqrTo = nSqrTo;

      // (public) this^e
      function bnPow(e) { return this.exp(e,new NullExp()); }

      // (protected) r = lower n words of "this * a", a.t <= n
      // "this" should be the larger one if appropriate.
      function bnpMultiplyLowerTo(a,n,r) {
        var i = Math.min(this.t+a.t,n);
        r.s = 0; // assumes a,this >= 0
        r.t = i;
        while(i > 0) r[--i] = 0;
        var j;
        for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
        for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
        r.clamp();
      }

      // (protected) r = "this * a" without lower n words, n > 0
      // "this" should be the larger one if appropriate.
      function bnpMultiplyUpperTo(a,n,r) {
        --n;
        var i = r.t = this.t+a.t-n;
        r.s = 0; // assumes a,this >= 0
        while(--i >= 0) r[i] = 0;
        for(i = Math.max(n-this.t,0); i < a.t; ++i)
          r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
        r.clamp();
        r.drShiftTo(1,r);
      }

      // Barrett modular reduction
      function Barrett(m) {
        // setup Barrett
        this.r2 = nbi();
        this.q3 = nbi();
        BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
        this.mu = this.r2.divide(m);
        this.m = m;
      }

      function barrettConvert(x) {
        if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
        else if(x.compareTo(this.m) < 0) return x;
        else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
      }

      function barrettRevert(x) { return x; }

      // x = x mod m (HAC 14.42)
      function barrettReduce(x) {
        x.drShiftTo(this.m.t-1,this.r2);
        if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
        this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
        this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
        while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
        x.subTo(this.r2,x);
        while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
      }

      // r = x^2 mod m; x != r
      function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

      // r = x*y mod m; x,y != r
      function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

      Barrett.prototype.convert = barrettConvert;
      Barrett.prototype.revert = barrettRevert;
      Barrett.prototype.reduce = barrettReduce;
      Barrett.prototype.mulTo = barrettMulTo;
      Barrett.prototype.sqrTo = barrettSqrTo;

      // (public) this^e % m (HAC 14.85)
      function bnModPow(e,m) {
        var i = e.bitLength(), k, r = nbv(1), z;
        if(i <= 0) return r;
        else if(i < 18) k = 1;
        else if(i < 48) k = 3;
        else if(i < 144) k = 4;
        else if(i < 768) k = 5;
        else k = 6;
        if(i < 8)
          z = new Classic(m);
        else if(m.isEven())
          z = new Barrett(m);
        else
          z = new Montgomery(m);

        // precomputation
        var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
        g[1] = z.convert(this);
        if(k > 1) {
          var g2 = nbi();
          z.sqrTo(g[1],g2);
          while(n <= km) {
            g[n] = nbi();
            z.mulTo(g2,g[n-2],g[n]);
            n += 2;
          }
        }

        var j = e.t-1, w, is1 = true, r2 = nbi(), t;
        i = nbits(e[j])-1;
        while(j >= 0) {
          if(i >= k1) w = (e[j]>>(i-k1))&km;
          else {
            w = (e[j]&((1<<(i+1))-1))<<(k1-i);
            if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
          }

          n = k;
          while((w&1) == 0) { w >>= 1; --n; }
          if((i -= n) < 0) { i += this.DB; --j; }
          if(is1) {	// ret == 1, don't bother squaring or multiplying it
            g[w].copyTo(r);
            is1 = false;
          }
          else {
            while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
            if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
            z.mulTo(r2,g[w],r);
          }

          while(j >= 0 && (e[j]&(1<<i)) == 0) {
            z.sqrTo(r,r2); t = r; r = r2; r2 = t;
            if(--i < 0) { i = this.DB-1; --j; }
          }
        }
        return z.revert(r);
      }

      // (public) gcd(this,a) (HAC 14.54)
      function bnGCD(a) {
        var x = (this.s<0)?this.negate():this.clone();
        var y = (a.s<0)?a.negate():a.clone();
        if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
        var i = x.getLowestSetBit(), g = y.getLowestSetBit();
        if(g < 0) return x;
        if(i < g) g = i;
        if(g > 0) {
          x.rShiftTo(g,x);
          y.rShiftTo(g,y);
        }
        while(x.signum() > 0) {
          if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
          if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
          if(x.compareTo(y) >= 0) {
            x.subTo(y,x);
            x.rShiftTo(1,x);
          }
          else {
            y.subTo(x,y);
            y.rShiftTo(1,y);
          }
        }
        if(g > 0) y.lShiftTo(g,y);
        return y;
      }

      // (protected) this % n, n < 2^26
      function bnpModInt(n) {
        if(n <= 0) return 0;
        var d = this.DV%n, r = (this.s<0)?n-1:0;
        if(this.t > 0)
          if(d == 0) r = this[0]%n;
          else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
        return r;
      }

      // (public) 1/this % m (HAC 14.61)
      function bnModInverse(m) {
        var ac = m.isEven();
        if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
        var u = m.clone(), v = this.clone();
        var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
        while(u.signum() != 0) {
          while(u.isEven()) {
            u.rShiftTo(1,u);
            if(ac) {
              if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
              a.rShiftTo(1,a);
            }
            else if(!b.isEven()) b.subTo(m,b);
            b.rShiftTo(1,b);
          }
          while(v.isEven()) {
            v.rShiftTo(1,v);
            if(ac) {
              if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
              c.rShiftTo(1,c);
            }
            else if(!d.isEven()) d.subTo(m,d);
            d.rShiftTo(1,d);
          }
          if(u.compareTo(v) >= 0) {
            u.subTo(v,u);
            if(ac) a.subTo(c,a);
            b.subTo(d,b);
          }
          else {
            v.subTo(u,v);
            if(ac) c.subTo(a,c);
            d.subTo(b,d);
          }
        }
        if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
        if(d.compareTo(m) >= 0) return d.subtract(m);
        if(d.signum() < 0) d.addTo(m,d); else return d;
        if(d.signum() < 0) return d.add(m); else return d;
      }

      var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
      var lplim = (1<<26)/lowprimes[lowprimes.length-1];

      // (public) test primality with certainty >= 1-.5^t
      function bnIsProbablePrime(t) {
        var i, x = this.abs();
        if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
          for(i = 0; i < lowprimes.length; ++i)
            if(x[0] == lowprimes[i]) return true;
          return false;
        }
        if(x.isEven()) return false;
        i = 1;
        while(i < lowprimes.length) {
          var m = lowprimes[i], j = i+1;
          while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
          m = x.modInt(m);
          while(i < j) if(m%lowprimes[i++] == 0) return false;
        }
        return x.millerRabin(t);
      }

      // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
      function bnpMillerRabin(t) {
        var n1 = this.subtract(BigInteger.ONE);
        var k = n1.getLowestSetBit();
        if(k <= 0) return false;
        var r = n1.shiftRight(k);
        t = (t+1)>>1;
        if(t > lowprimes.length) t = lowprimes.length;
        var a = nbi();
        for(var i = 0; i < t; ++i) {
          //Pick bases at random, instead of starting at 2
          a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
          var y = a.modPow(r,this);
          if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
            var j = 1;
            while(j++ < k && y.compareTo(n1) != 0) {
              y = y.modPowInt(2,this);
              if(y.compareTo(BigInteger.ONE) == 0) return false;
            }
            if(y.compareTo(n1) != 0) return false;
          }
        }
        return true;
      }

      // protected
      BigInteger.prototype.chunkSize = bnpChunkSize;
      BigInteger.prototype.toRadix = bnpToRadix;
      BigInteger.prototype.fromRadix = bnpFromRadix;
      BigInteger.prototype.fromNumber = bnpFromNumber;
      BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
      BigInteger.prototype.changeBit = bnpChangeBit;
      BigInteger.prototype.addTo = bnpAddTo;
      BigInteger.prototype.dMultiply = bnpDMultiply;
      BigInteger.prototype.dAddOffset = bnpDAddOffset;
      BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
      BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
      BigInteger.prototype.modInt = bnpModInt;
      BigInteger.prototype.millerRabin = bnpMillerRabin;

      // public
      BigInteger.prototype.clone = bnClone;
      BigInteger.prototype.intValue = bnIntValue;
      BigInteger.prototype.byteValue = bnByteValue;
      BigInteger.prototype.shortValue = bnShortValue;
      BigInteger.prototype.signum = bnSigNum;
      BigInteger.prototype.toByteArray = bnToByteArray;
      BigInteger.prototype.equals = bnEquals;
      BigInteger.prototype.min = bnMin;
      BigInteger.prototype.max = bnMax;
      BigInteger.prototype.and = bnAnd;
      BigInteger.prototype.or = bnOr;
      BigInteger.prototype.xor = bnXor;
      BigInteger.prototype.andNot = bnAndNot;
      BigInteger.prototype.not = bnNot;
      BigInteger.prototype.shiftLeft = bnShiftLeft;
      BigInteger.prototype.shiftRight = bnShiftRight;
      BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
      BigInteger.prototype.bitCount = bnBitCount;
      BigInteger.prototype.testBit = bnTestBit;
      BigInteger.prototype.setBit = bnSetBit;
      BigInteger.prototype.clearBit = bnClearBit;
      BigInteger.prototype.flipBit = bnFlipBit;
      BigInteger.prototype.add = bnAdd;
      BigInteger.prototype.subtract = bnSubtract;
      BigInteger.prototype.multiply = bnMultiply;
      BigInteger.prototype.divide = bnDivide;
      BigInteger.prototype.remainder = bnRemainder;
      BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
      BigInteger.prototype.modPow = bnModPow;
      BigInteger.prototype.modInverse = bnModInverse;
      BigInteger.prototype.pow = bnPow;
      BigInteger.prototype.gcd = bnGCD;
      BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

      // JSBN-specific extension
      BigInteger.prototype.square = bnSquare;

      // Expose the Barrett function
      BigInteger.prototype.Barrett = Barrett

      // BigInteger interfaces not implemented in jsbn:

      // BigInteger(int signum, byte[] magnitude)
      // double doubleValue()
      // float floatValue()
      // int hashCode()
      // long longValue()
      // static BigInteger valueOf(long val)

  	// Random number generator - requires a PRNG backend, e.g. prng4.js

  	// For best results, put code like
  	// <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
  	// in your main HTML document.

  	var rng_state;
  	var rng_pool;
  	var rng_pptr;

  	// Mix in a 32-bit integer into the pool
  	function rng_seed_int(x) {
  	  rng_pool[rng_pptr++] ^= x & 255;
  	  rng_pool[rng_pptr++] ^= (x >> 8) & 255;
  	  rng_pool[rng_pptr++] ^= (x >> 16) & 255;
  	  rng_pool[rng_pptr++] ^= (x >> 24) & 255;
  	  if(rng_pptr >= rng_psize) rng_pptr -= rng_psize;
  	}

  	// Mix in the current time (w/milliseconds) into the pool
  	function rng_seed_time() {
  	  rng_seed_int(new Date().getTime());
  	}

  	// Initialize the pool with junk if needed.
  	if(rng_pool == null) {
  	  rng_pool = new Array();
  	  rng_pptr = 0;
  	  var t;
  	  if(typeof window !== "undefined" && window.crypto) {
  		if (window.crypto.getRandomValues) {
  		  // Use webcrypto if available
  		  var ua = new Uint8Array(32);
  		  window.crypto.getRandomValues(ua);
  		  for(t = 0; t < 32; ++t)
  			rng_pool[rng_pptr++] = ua[t];
  		}
  		else if(navigator.appName == "Netscape" && navigator.appVersion < "5") {
  		  // Extract entropy (256 bits) from NS4 RNG if available
  		  var z = window.crypto.random(32);
  		  for(t = 0; t < z.length; ++t)
  			rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
  		}
  	  }
  	  while(rng_pptr < rng_psize) {  // extract some randomness from Math.random()
  		t = Math.floor(65536 * Math.random());
  		rng_pool[rng_pptr++] = t >>> 8;
  		rng_pool[rng_pptr++] = t & 255;
  	  }
  	  rng_pptr = 0;
  	  rng_seed_time();
  	  //rng_seed_int(window.screenX);
  	  //rng_seed_int(window.screenY);
  	}

  	function rng_get_byte() {
  	  if(rng_state == null) {
  		rng_seed_time();
  		rng_state = prng_newstate();
  		rng_state.init(rng_pool);
  		for(rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
  		  rng_pool[rng_pptr] = 0;
  		rng_pptr = 0;
  		//rng_pool = null;
  	  }
  	  // TODO: allow reseeding after first request
  	  return rng_state.next();
  	}

  	function rng_get_bytes(ba) {
  	  var i;
  	  for(i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
  	}

  	function SecureRandom() {}

  	SecureRandom.prototype.nextBytes = rng_get_bytes;

  	// prng4.js - uses Arcfour as a PRNG

  	function Arcfour() {
  	  this.i = 0;
  	  this.j = 0;
  	  this.S = new Array();
  	}

  	// Initialize arcfour context from key, an array of ints, each from [0..255]
  	function ARC4init(key) {
  	  var i, j, t;
  	  for(i = 0; i < 256; ++i)
  		this.S[i] = i;
  	  j = 0;
  	  for(i = 0; i < 256; ++i) {
  		j = (j + this.S[i] + key[i % key.length]) & 255;
  		t = this.S[i];
  		this.S[i] = this.S[j];
  		this.S[j] = t;
  	  }
  	  this.i = 0;
  	  this.j = 0;
  	}

  	function ARC4next() {
  	  var t;
  	  this.i = (this.i + 1) & 255;
  	  this.j = (this.j + this.S[this.i]) & 255;
  	  t = this.S[this.i];
  	  this.S[this.i] = this.S[this.j];
  	  this.S[this.j] = t;
  	  return this.S[(t + this.S[this.i]) & 255];
  	}

  	Arcfour.prototype.init = ARC4init;
  	Arcfour.prototype.next = ARC4next;

  	// Plug in your RNG constructor here
  	function prng_newstate() {
  	  return new Arcfour();
  	}

  	// Pool size must be a multiple of 4 and greater than 32.
  	// An array of bytes the size of the pool will be passed to init()
  	var rng_psize = 256;

      if (typeof exports !== 'undefined') {
          exports = module.exports = {
  			BigInteger: BigInteger,
  			SecureRandom: SecureRandom,
  		};
      } else {
          this.BigInteger = BigInteger;
          this.SecureRandom = SecureRandom;
      }

  }).call(__commonjs_global);
  });

  var BigInteger = index$5.BigInteger;

  /**
   * Common values used on serialization classes
   */

  var SHORT_BUFFER_LENGTH = 254;
  var isPrimitive = /^(int|long|double|int128|int256|string|bytes)$/i;

  var Vector = function (_TLObject) {
      babelHelpers.inherits(Vector, _TLObject);

      function Vector() {
          var list = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
          var type = arguments.length <= 1 || arguments[1] === undefined ? 'int' : arguments[1];
          babelHelpers.classCallCheck(this, Vector);

          var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Vector).call(this));

          _this.list = list;
          _this.type = type;
          return _this;
      }

      babelHelpers.createClass(Vector, [{
          key: 'getList',
          value: function getList() {
              return this.list.slice();
          }
      }, {
          key: 'toJSON',
          value: function toJSON() {
              var list = this.list.map(function (item) {
                  if (item instanceof TLObject) {
                      return item.toJSON();
                  }

                  return item;
              });

              return { _: 'vector', type: this.type, list: list };
          }
      }]);
      return Vector;
  }(TLObject);

  Vector.prototype.__id = Vector.id = {
      id: '15c4b51c',
      type: 'vector',
      baseType: 'Vector',
      params: []
  };

  var VECTOR_ID = Vector.id.id;

  var WriteContext = function () {
      /**
       * @param {TL.TLObject} object
       */

      function WriteContext(object) {
          var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          babelHelpers.classCallCheck(this, WriteContext);

          this._object = object;
          this._buffers = [];
          this._options = options;
      }

      /**
       * Serializes the TL Object given upon construction
       */


      babelHelpers.createClass(WriteContext, [{
          key: 'serialize',
          value: function serialize() {
              var _this = this;

              var params = this._object.__id.params;

              if (!this._options.isBare) {
                  var id = this._object.__id.id;
                  id = new Buffer$1(id, 'hex');
                  this.push(id);
              }

              params.forEach(function (param) {
                  var value = _this._object[param.name];
                  var type = param.type;

                  if (param.isVector) {
                      _this._writeVector(value);
                      return;
                  }

                  if (_this._isPrimitive(type)) {
                      _this._writePrimitive(type, value);
                      return;
                  }

                  // if (type === 'Object') {
                  //     this._writeBytes(value);
                  //     return;
                  // }

                  _this._writeTypeObject(value, { isBare: param.isBare || type === 'Object' });
              });

              return this;
          }
      }, {
          key: '_writeVector',
          value: function _writeVector(vector) {
              var _this2 = this;

              var list = vector.getList();

              var id = new Buffer$1(VECTOR_ID, 'hex');
              var length = new Buffer$1(4);
              length.writeUInt32LE(list.length);

              this.push(id);
              this.push(length);

              var type = vector.type;
              var isPrimitive = this._isPrimitive(type);

              if (isPrimitive) {
                  list.forEach(function (item) {
                      return _this2._writePrimitive(type, item);
                  });
                  return;
              }

              list.forEach(function (item) {
                  return _this2._writeTypeObject(item, { isBare: true });
              });
          }

          /**
           * Check whether a given object param is primitive or a TL object
           * @private
           * @return {boolean}
           */

      }, {
          key: '_isPrimitive',
          value: function _isPrimitive(type) {
              return isPrimitive.test(type);
          }

          /**
           * Write a primitive value
           * @param {string} type
           * @param {*} value
           */

      }, {
          key: '_writePrimitive',
          value: function _writePrimitive(type, value) {
              var method = 'write' + type.charAt(0).toUpperCase() + type.slice(1);
              return this[method](value);
          }

          /**
           * Write a TL Object
           * @param {TL.TLObject} object
           */

      }, {
          key: '_writeTypeObject',
          value: function _writeTypeObject(object) {
              var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

              if (!options.isBare) {
                  this.push(new Buffer$1(object.__id.id, 'hex'));
              }

              var context = new WriteContext(object);
              var buffer = context.serialize().toBuffer();

              this._writeBytes(buffer);
          }

          /**
           * @param {Buffer} buffer
           */

      }, {
          key: 'push',
          value: function push(buffer) {
              this._buffers.push(buffer);

              return this;
          }

          /**
           * Concatenate and return all buffers generated on serialization
           * @return {Buffer}
           */

      }, {
          key: 'toBuffer',
          value: function toBuffer() {
              return Buffer$1.concat(this._buffers);
          }

          /**
           * @param {SerializationContext} context    Serialization context
           * @param {number} number                   A valid integer
           */

      }, {
          key: 'writeInt',
          value: function writeInt(number) {
              var buffer = new Buffer$1(4);
              buffer.writeUInt32LE(number, 0, true);
              this.push(buffer);

              return this;
          }

          /**
           * @param {SerializationContext} context    Serialization context
           * @param {number} number                   A valid double
           */

      }, {
          key: 'writeDouble',
          value: function writeDouble(number) {
              var buffer = new Buffer$1(8);
              buffer.writeDoubleLE(number, 0, true);
              this.push(buffer);

              return this;
          }

          /**
           * @param {SerializationContext} context        Serialization context
           * @param {BigInteger|String|Number} number     A long representation
           */

      }, {
          key: 'writeLong',
          value: function writeLong(number) {
              return this._writeBigInt(number, 8);
          }

          /**
           * @param {SerializationContext} context        Serialization context
           * @param {BigInteger|String|Number} number     A int128 representation
           */

      }, {
          key: 'writeInt128',
          value: function writeInt128(number) {
              return this._writeBigInt(number, 16);
          }

          /**
           * @param {SerializationContext} context        Serialization context
           * @param {BigInteger|String|Number} number     A int256 representation
           */

      }, {
          key: 'writeInt256',
          value: function writeInt256(number) {
              return this._writeBigInt(number, 32);
          }
      }, {
          key: 'writeString',
          value: function writeString(string) {
              return this.writeBytes(string);
          }

          /**
           * @param {SerializationContext} context        Serialization context
           * @param {Buffer|string} bytes                 Either a string or a Buffer object
           */

      }, {
          key: 'writeBytes',
          value: function writeBytes() {
              var bytes = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

              var length = bytes.length;
              var isShortBuffer = length < SHORT_BUFFER_LENGTH;
              var lengthBuffer = undefined,
                  byteCount = 0;

              if (isShortBuffer) {
                  lengthBuffer = new Buffer$1(1);
                  lengthBuffer.writeUInt8(length, 0);
                  byteCount = 1;
              } else {
                  lengthBuffer = new Buffer$1([254, length & 0xff, length >> 8 & 0xff, length >> 16 & 0xff]);

                  byteCount = 4;
              }

              // buffer that defines the length of "bytes" buffer
              this.push(lengthBuffer);

              this._writeBytes(bytes);
              byteCount += length;

              var padding = byteCount % 4;
              if (padding) {
                  padding = new Buffer$1(4 - padding);
                  padding.fill(0);
                  this.push(padding);
              }

              return this;
          }

          /**
           * @param {SerializationContext} context                Serialization context
           * @param {string|number|Buffer|BigInteger} number      Number to write
           * @param {number} length                               Byte-length of number
           */

      }, {
          key: '_writeBigInt',
          value: function _writeBigInt(number, length) {
              if (typeof number === 'number') {
                  var buffer = this._getBufferFromNumber(number, length);
                  this.push(buffer);
              } else if (typeof number === 'string') {
                  var buffer = this._getBufferFromNumberString(number, length);
                  this.push(buffer);
              }

              // a BigInteger or Buffer
              else {
                      this._writeBytes(number);
                  }

              return this;
          }

          /**
           * @param {SerializationContext} context        Serialization context
           * @param {Buffer|String} bytes                 Either a string or a Buffer object
           */

      }, {
          key: '_writeBytes',
          value: function _writeBytes(bytes) {
              var buffer = !Buffer$1.isBuffer(bytes) ? new Buffer$1(bytes) : bytes;
              this.push(buffer);

              return this;
          }

          /**
           * @param {number} number       Number as a integer/float
           * @param {number} length       Number byte-length
           */

      }, {
          key: '_getBufferFromNumber',
          value: function _getBufferFromNumber(number, length) {
              var buffer = new Buffer$1(length);

              buffer.fill(0);
              buffer.writeUInt32LE(number, 0);

              return buffer;
          }

          /**
           * @param {String} number       Number in decimals, written as string
           * @param {number} length       Number byte-length
           */

      }, {
          key: '_getBufferFromNumberString',
          value: function _getBufferFromNumberString(number, length) {
              if (number.startsWith('0x')) {
                  number = number.slice(2);
                  return this._getBufferFromBigIntHex(number, length);
              }

              return this._getBufferFromBigInt(new BigInteger(number), length);
          }

          /**
           * @param {String} number       Number as a hexadecimal string
           * @param {number} length       Number byte-length
           */

      }, {
          key: '_getBufferFromBigIntHex',
          value: function _getBufferFromBigIntHex(number, length) {
              var bytes = [];
              var byteLength = length * 2;

              if (number.length > byteLength) {
                  number = number.slice(number.length - byteLength);
              }

              // left padding with zeros to align byte size
              if (number.length < byteLength) {
                  number = '0'.repeat(byteLength - number.length) + number;
              }

              var i = byteLength;
              while (i >= 0) {
                  bytes.push(new Buffer$1(number.slice(i - 2, i), 'hex'));
                  i -= 2;
              }

              return Buffer$1.concat(bytes, length);
          }

          /**
           * @param {BigInteger} number
           * @param {number} length
           */

      }, {
          key: '_getBufferFromBigInt',
          value: function _getBufferFromBigInt(number, length) {
              var byteArray = number.toByteArray();
              var byteArrayLength = byteArray.length;

              var buffer = new Buffer$1(length);
              buffer.fill(0);

              var i = 0,
                  ii = Math.min(byteArrayLength, length);
              byteArrayLength--;

              // copy number by number to buffer from right to left
              for (; i < ii; i++) {
                  var value = byteArray[byteArrayLength - i];
                  buffer[i] = value;
              }

              return buffer;
          }
      }]);
      return WriteContext;
  }();

  var ZERO_BUFFER = new Buffer$1(1).fill(0);

  var ReadContext = function () {
      function ReadContext(buffer) {
          var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          babelHelpers.classCallCheck(this, ReadContext);

          if (!Buffer$1.isBuffer(buffer)) {
              throw new Error('Invalid buffer to deserialize');
          }

          this._buffer = buffer;
          this._cursor = 0;
          this._object = null;
          this._options = options;
      }

      babelHelpers.createClass(ReadContext, [{
          key: 'getTypeObject',
          value: function getTypeObject() {
              return this._object;
          }
      }, {
          key: 'deserialize',
          value: function deserialize() {
              var typeId = this._readTypeIdFromBuffer();
              var Type = registry.getById(typeId);

              if (!Type) {
                  throw new Error('Type id not found: ' + typeId);
              }

              this.moveCursor(4);

              this._object = new Type();
              this.deserializeType(Type);

              return this;
          }
      }, {
          key: 'deserializeType',
          value: function deserializeType(Type) {
              var _this = this;

              var params = Type.id.params;

              params.forEach(function (param) {
                  var value = undefined;
                  var type = param.type;

                  if (param.isVector) {
                      value = _this.deserializeVector(type);
                  } else if (_this._isPrimitive(type)) {
                      value = _this._readPrimitive(type);
                  } else {
                      value = _this._readTypeObject(type);
                  }

                  _this._object[param.name] = value;
              });
          }
      }, {
          key: 'deserializeVector',
          value: function deserializeVector(type) {
              var _this2 = this;

              // skip vector type id
              this.moveCursor(4);

              var length = this._buffer.readUInt32LE(this._cursor);
              this.moveCursor(4);

              var objects = [];
              var isPrimitive = this._isPrimitive(type);

              var read = function read() {
                  return isPrimitive ? _this2._readPrimitive(type) : _this2._readTypeObject(type);
              };

              for (var i = 0; i < length; i++) {
                  objects.push(read());
              }

              var Vector = registry.getByType('vector');

              return new Vector(objects, type);
          }
      }, {
          key: '_isPrimitive',
          value: function _isPrimitive(type) {
              return isPrimitive.test(type);
          }
      }, {
          key: '_readPrimitive',
          value: function _readPrimitive(type) {
              var method = 'read' + type.charAt(0).toUpperCase() + type.slice(1);
              return this[method]();
          }
      }, {
          key: '_readTypeObject',
          value: function _readTypeObject(type) {
              var buffer = this.slice(this._buffer.length - this._cursor);

              var context = new ReadContext(buffer, { isBare: type.charAt(0) === '%' });
              context.deserialize();
              this.moveCursor(context._cursor);

              // TODO
              // (typeName == 'BoolTrue') ? true : (typeName == 'BoolFalse') ? false : obj;
              return context.getTypeObject();
          }
      }, {
          key: 'readString',
          value: function readString() {
              return this.readBytes().toString('utf8');
          }
      }, {
          key: 'readBytes',
          value: function readBytes() {
              var length = this.slice();
              length = length.readUInt8(0);

              // from short length and up, uses different reading
              if (length === SHORT_BUFFER_LENGTH) {
                  this.moveCursor();
                  return this._readLongBytes();
              }

              this.moveCursor();
              var bytes = this._readBytes(length);
              this._checkPadding();

              return bytes;
          }
      }, {
          key: '_readBytes',
          value: function _readBytes(length) {
              var bytes = this.slice(length);
              this.moveCursor(length);

              return bytes;
          }

          /**
           * Read the length from first 3 bytes, then read bytes up to the found length
           */

      }, {
          key: '_readLongBytes',
          value: function _readLongBytes() {
              var lengthBytes = this.slice(3);
              var length = Buffer$1.concat([lengthBytes, ZERO_BUFFER]);
              length = length.readUInt32LE(0);

              this.moveCursor(3);

              var bytes = this.slice(length);
              this.moveCursor(length);
              this._checkPadding();

              return bytes;
          }
      }, {
          key: '_checkPadding',
          value: function _checkPadding() {
              var padding = this._cursor % 4;

              if (padding > 0) {
                  this.moveCursor(4 - padding);
              }
          }
      }, {
          key: 'readInt',
          value: function readInt() {
              var int = this._buffer.readUInt32LE(this._cursor);
              this.moveCursor(4);

              return int;
          }
      }, {
          key: 'readDouble',
          value: function readDouble() {
              var int = this._buffer.readDoubleLE(this._cursor);
              this.moveCursor(8);

              return int;
          }
      }, {
          key: 'readLong',
          value: function readLong() {
              return this._readBigInt(8);
          }
      }, {
          key: 'readInt128',
          value: function readInt128() {
              return this._readBigInt(16);
          }
      }, {
          key: 'readInt256',
          value: function readInt256() {
              return this._readBigInt(32);
          }
      }, {
          key: '_readBigInt',
          value: function _readBigInt(length) {
              var bytes = this.slice(length);

              this.moveCursor(length);
              bytes = new BigInteger(bytes);

              return bytes || null;
          }
      }, {
          key: 'slice',
          value: function slice() {
              var length = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

              var end = this._cursor + length;
              var max = this._buffer.length;

              if (end > max) {
                  end = max;
              }

              return this._buffer.slice(this._cursor, end);
          }
      }, {
          key: 'moveCursor',
          value: function moveCursor() {
              var by = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

              this._cursor += by;
          }
      }, {
          key: '_readTypeIdFromBuffer',
          value: function _readTypeIdFromBuffer() {
              return this.slice(this._cursor + 4).toString('hex');
          }
      }]);
      return ReadContext;
  }();

  function deserialize(buffer) {
      if (!Buffer.isBuffer(buffer)) {
          throw new Error('Invalid buffer');
      }

      var context = new ReadContext(buffer);
      context.deserialize();

      return context.getTypeObject();
  }

  function serialize(object) {
      var context = new WriteContext(object);
      context.serialize();

      return context.toBuffer();
  }

  if (typeof window !== 'undefined') {
      window.Buffer = Buffer$1;
  }

  var serialization = { WriteContext: WriteContext, ReadContext: ReadContext };
  var types = registry.types;

  registry.addType(Vector);

  var index = {
      TLObject: TLObject,
      TypeRegistry: registry,
      Vector: Vector,
      WriteContext: WriteContext,
      ReadContext: ReadContext,

      types: types,
      deserialize: deserialize,
      serialize: serialize
  };

  return index;

}));
//# sourceMappingURL=type-language.js.map