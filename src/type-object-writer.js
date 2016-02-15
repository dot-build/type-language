import { Buffer } from 'buffer';
import { BigInteger } from 'jsbn';

const SHORT_BUFFER_LENGTH = 254;

/**
 * Prepare basic object types for serialization (integers, strings, buffers...)
 */
export default class TypeObjectWriter {
    static getInstance() {
        if (!TypeObjectWriter._instance) {
            TypeObjectWriter._instance = new TypeObjectWriter();
        }

        return TypeObjectWriter._instance;
    }

    /**
     * @param {SerializationContext} context    Serialization context
     * @param {number} number                   A valid integer
     */
    writeInt(context, number) {
        var buffer = new Buffer(4);
        buffer.writeUInt32LE(number, 0, true);
        context.write(buffer);

        return this;
    }

    /**
     * @param {SerializationContext} context    Serialization context
     * @param {number} number                   A valid double
     */
    writeDouble(context, number) {
        var buffer = new Buffer(8);
        buffer.writeDoubleLE(number, 0, true);
        context.write(buffer);

        return this;
    }

    /**
     * @param {SerializationContext} context        Serialization context
     * @param {BigInteger|String|Number} number     A long representation
     */
    writeLong(context, number) {
        return this._writeBigInt(context, number, 8);
    }

    /**
     * @param {SerializationContext} context        Serialization context
     * @param {BigInteger|String|Number} number     A int128 representation
     */
    writeInt128(context, number) {
        return this._writeBigInt(context, number, 16);
    }

    /**
     * @param {SerializationContext} context        Serialization context
     * @param {BigInteger|String|Number} number     A int256 representation
     */
    writeInt256(context, number) {
        return this._writeBigInt(context, number, 32);
    }

    /**
     * @param {SerializationContext} context        Serialization context
     * @param {Buffer|String} bytes                 Either a string or a Buffer object
     */
    writeBytes(context, bytes) {
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
        context.write(lengthBuffer);

        this._writeBytes(context, bytes);
        byteCount += length;

        let padding = byteCount % 4;
        if (padding) {
            padding = new Buffer(4 - padding);
            padding.fill(0);
            context.write(padding);
        }

        return this;
    }

    /**
     * @param {SerializationContext} context                Serialization context
     * @param {string|number|Buffer|BigInteger} number      Number to write
     * @param {number} length                               Byte-length of number
     */
    _writeBigInt(context, number, length) {
        if (typeof number === 'number') {
            let buffer = this._getBufferFromNumber(number, length);
            context.write(buffer);
        } else

        if (typeof number === 'string') {
            let buffer = this._getBufferFromNumberString(number, length);
            context.write(buffer);
        } else

        // a BigInteger or Buffer
        {
            this._writeBytes(context, number);
        }

        return this;
    }

    /**
     * @param {SerializationContext} context        Serialization context
     * @param {Buffer|String} bytes                 Either a string or a Buffer object
     */
    _writeBytes(context, bytes) {
        var buffer = !Buffer.isBuffer(bytes) ? new Buffer(bytes) : bytes;
        context.write(buffer);

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
