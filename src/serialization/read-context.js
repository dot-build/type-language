import { Buffer } from 'buffer';
import TypeRegistry from 'type/type-registry.js';
import { BigInteger } from 'jsbn';
import { SHORT_BUFFER_LENGTH, isPrimitive } from 'serialization/common.js';

const ZERO_BUFFER = new Buffer(1).fill(0);

export default class ReadContext {
    constructor(buffer, options = {}) {
        if (!Buffer.isBuffer(buffer)) {
            throw new Error('Invalid buffer to deserialize');
        }

        this._buffer = buffer;
        this._cursor = 0;
        this._object = null;
        this._options = options;
    }

    getTypeObject() {
        return this._object;
    }

    deserialize() {
        let typeId = this._readTypeIdFromBuffer();
        let Type = TypeRegistry.getById(typeId);

        if (!Type) {
            throw new Error('Type id not found: ' + typeId);
        }

        this.moveCursor(4);

        this._object = new Type();
        this.deserializeType(Type);

        return this;
    }

    deserializeType(Type) {
        let params = Type.id.params;

        params.forEach(param => {
            let value;
            let type = param.type;

            if (param.isVector) {
                value = this.deserializeVector(type);
            }

            else if (this._isPrimitive(type)) {
                value = this._readPrimitive(type);
            }

            else {
                value = this._readTypeObject(type);
            }

            this._object[param.name] = value;
        });
    }

    deserializeVector(type) {
        // skip vector type id
        this.moveCursor(4);

        let length = this._buffer.readUInt32LE(this._cursor);
        this.moveCursor(4);

        let objects = [];
        let isPrimitive = this._isPrimitive(type);

        const read = () => isPrimitive ? this._readPrimitive(type) : this._readTypeObject(type);

        for (let i = 0; i < length; i++) {
            objects.push(read());
        }

        let Vector = TypeRegistry.getByType('vector');

        return new Vector(objects, type);
    }

    _isPrimitive(type) {
        return isPrimitive.test(type);
    }

    _readPrimitive(type) {
        let method = 'read' + type.charAt(0).toUpperCase() + type.slice(1);
        return this[method]();
    }

    _readTypeObject(type) {
        let buffer = this.slice(this._buffer.length - this._cursor);

        let context = new ReadContext(buffer, { isBare: type.charAt(0) === '%' });
        context.deserialize();
        this.moveCursor(context._cursor);

        // TODO
        // (typeName == 'BoolTrue') ? true : (typeName == 'BoolFalse') ? false : obj;
        return context.getTypeObject();
    }

    readString() {
        return this.readBytes().toString('utf8');
    }

    readBytes() {
        let length = this.slice();
        length = length.readUInt8(0);

        // from short length and up, uses different reading
        if (length === SHORT_BUFFER_LENGTH) {
            this.moveCursor();
            return this._readLongBytes();
        }

        this.moveCursor();
        let bytes = this._readBytes(length);
        this._checkPadding();

        return bytes;
    }

    _readBytes(length) {
        let bytes = this.slice(length);
        this.moveCursor(length);

        return bytes;
    }

    /**
     * Read the length from first 3 bytes, then read bytes up to the found length
     */
    _readLongBytes() {
        let lengthBytes = this.slice(3);
        let length = Buffer.concat([lengthBytes, ZERO_BUFFER]);
        length = length.readUInt32LE(0);

        this.moveCursor(3);

        let bytes = this.slice(length);
        this.moveCursor(length);
        this._checkPadding();

        return bytes;
    }

    _checkPadding() {
        let padding = this._cursor % 4;

        if (padding > 0) {
            this.moveCursor(4 - padding);
        }
    }

    readInt() {
        let int = this._buffer.readUInt32LE(this._cursor);
        this.moveCursor(4);

        return int;
    }

    readDouble() {
        let int = this._buffer.readDoubleLE(this._cursor);
        this.moveCursor(8);

        return int;
    }

    readLong() {
        return this._readBigInt(8);
    }

    readInt128() {
        return this._readBigInt(16);
    }

    readInt256() {
        return this._readBigInt(32);
    }

    _readBigInt(length) {
        let bytes = this.slice(length);

        this.moveCursor(length);
        bytes = new BigInteger(bytes);

        return bytes || null;
    }

    slice(length = 1) {
        let end = this._cursor + length;
        let max = this._buffer.length;

        if (end > max) {
            end = max;
        }

        return this._buffer.slice(this._cursor, end);
    }

    moveCursor(by = 1) {
        this._cursor += by;
    }

    _readTypeIdFromBuffer() {
        return this.slice(this._cursor + 4).toString('hex');
    }
}