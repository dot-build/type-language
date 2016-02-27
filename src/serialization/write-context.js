import { Buffer } from 'buffer';
import { BigInteger } from 'jsbn';
import { SHORT_BUFFER_LENGTH, isPrimitive } from 'serialization/common.js';
import Vector from 'vector';

const VECTOR_ID = Vector.id.id;

export default class WriteContext {
    /**
     * @param {TL.TLObject} object
     */
    constructor(object, options = {}) {
        this._object = object;
        this._buffers = [];
        this._options = options;
    }

    /**
     * Serializes the TL Object given upon construction
     */
    serialize() {
        let params = this._object.__id.params;

        if (!this._options.isBare) {
            let id = this._object.__id.id;
            id = new Buffer(id, 'hex');
            this.push(id);
        }

        params.forEach(param => {
            let value = this._object[param.name];

            if (param.isVector) {
                this._writeVector(value);
                return;
            }

            if (this._isPrimitive(param.type)) {
                this._writePrimitive(param.type, value);
                return;
            }

            this._writeTypeObject(value);
        });

        return this;
    }

    _writeVector(vector) {
        let list = vector.getList();

        let id = new Buffer(VECTOR_ID, 'hex');
        let length = new Buffer(4);
        length.writeUInt32LE(list.length);

        this.push(id);
        this.push(length);

        let type = vector.type;
        let isPrimitive = this._isPrimitive(type);

        if (isPrimitive) {
            list.forEach(item => this._writePrimitive(type, item));
            return;
        }

        list.forEach(item => this._writeTypeObject(item, { isBare: true }));
    }

    /**
     * Check whether a given object param is primitive or a TL object
     * @private
     * @return {boolean}
     */
    _isPrimitive(type) {
        return isPrimitive.test(type);
    }

    /**
     * Write a primitive value
     * @param {string} type
     * @param {*} value
     */
    _writePrimitive(type, value) {
        let method = 'write' + type.charAt(0).toUpperCase() + type.slice(1);
        return this[method](value);
    }

    /**
     * Write a TL Object
     * @param {TL.TLObject} object
     */
    _writeTypeObject(object, options = {}) {
        if (!options.isBare) {
            this.push(new Buffer(object.__id.id, 'hex'));
        }

        let context = new WriteContext(object);
        let buffer = context.serialize().toBuffer();

        this._writeBytes(buffer);
    }

    /**
     * @param {Buffer} buffer
     */
    push(buffer) {
        this._buffers.push(buffer);

        return this;
    }

    /**
     * Concatenate and return all buffers generated on serialization
     * @return {Buffer}
     */
    toBuffer() {
        return Buffer.concat(this._buffers);
    }

    /**
     * @param {SerializationContext} context    Serialization context
     * @param {number} number                   A valid integer
     */
    writeInt(number) {
        var buffer = new Buffer(4);
        buffer.writeUInt32LE(number, 0, true);
        this.push(buffer);

        return this;
    }

    /**
     * @param {SerializationContext} context    Serialization context
     * @param {number} number                   A valid double
     */
    writeDouble(number) {
        var buffer = new Buffer(8);
        buffer.writeDoubleLE(number, 0, true);
        this.push(buffer);

        return this;
    }

    /**
     * @param {SerializationContext} context        Serialization context
     * @param {BigInteger|String|Number} number     A long representation
     */
    writeLong(number) {
        return this._writeBigInt(number, 8);
    }

    /**
     * @param {SerializationContext} context        Serialization context
     * @param {BigInteger|String|Number} number     A int128 representation
     */
    writeInt128(number) {
        return this._writeBigInt(number, 16);
    }

    /**
     * @param {SerializationContext} context        Serialization context
     * @param {BigInteger|String|Number} number     A int256 representation
     */
    writeInt256(number) {
        return this._writeBigInt(number, 32);
    }

    writeString(string) {
        return this.writeBytes(string);
    }

    /**
     * @param {SerializationContext} context        Serialization context
     * @param {Buffer|string} bytes                 Either a string or a Buffer object
     */
    writeBytes(bytes = '') {
        let length = bytes.length;
        let isShortBuffer = length < SHORT_BUFFER_LENGTH;
        let lengthBuffer, byteCount = 0;

        if (isShortBuffer) {
            lengthBuffer = new Buffer(1);
            lengthBuffer.writeUInt8(length, 0);
            byteCount = 1;
        } else {
            lengthBuffer = new Buffer([
                254,
                length & 0xff,
                (length >> 8) & 0xff,
                (length >> 16) & 0xff
            ]);

            byteCount = 4;
        }

        // buffer that defines the length of "bytes" buffer
        this.push(lengthBuffer);

        this._writeBytes(bytes);
        byteCount += length;

        let padding = byteCount % 4;
        if (padding) {
            padding = new Buffer(4 - padding);
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
    _writeBigInt(number, length) {
        if (typeof number === 'number') {
            let buffer = this._getBufferFromNumber(number, length);
            this.push(buffer);
        } else

        if (typeof number === 'string') {
            let buffer = this._getBufferFromNumberString(number, length);
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
    _writeBytes(bytes) {
        var buffer = !Buffer.isBuffer(bytes) ? new Buffer(bytes) : bytes;
        this.push(buffer);

        return this;
    }

    /**
     * @param {number} number       Number as a integer/float
     * @param {number} length       Number byte-length
     */
    _getBufferFromNumber(number, length) {
        let buffer = new Buffer(length);

        buffer.fill(0);
        buffer.writeUInt32LE(number, 0);

        return buffer;
    }

    /**
     * @param {String} number       Number in decimals, written as string
     * @param {number} length       Number byte-length
     */
    _getBufferFromNumberString(number, length) {
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
    _getBufferFromBigIntHex(number, length) {
        let bytes = [];
        let byteLength = length * 2;

        if (number.length > byteLength) {
            number = number.slice(number.length - byteLength);
        }

        // left padding with zeros to align byte size
        if (number.length < byteLength) {
            number = '0'.repeat(byteLength - number.length) + number;
        }

        let i = byteLength;
        while(i >= 0) {
            bytes.push(new Buffer(number.slice(i - 2, i), 'hex'));
            i -= 2;
        }

        return Buffer.concat(bytes, length);
    }

    /**
     * @param {BigInteger} number
     * @param {number} length
     */
    _getBufferFromBigInt(number, length) {
        let byteArray = number.toByteArray();
        let byteArrayLength = byteArray.length;

        let buffer = new Buffer(length);
        buffer.fill(0);

        let i = 0, ii = Math.min(byteArrayLength, length);
        byteArrayLength--;

        // copy number by number to buffer from right to left
        for (; i < ii; i++) {
            let value = byteArray[byteArrayLength - i];
            buffer[i] = value;
        }

        return buffer;
    }
}
