import TypeRegistry from 'type/type-registry.js';

export default class ReadContext {
    constructor(buffer) {
        this._buffer = buffer;
        this._cursor = 0;
        this._object = null;
    }

    getTypeObject() {
        return this._object;
    }

    deserialize() {
        // let typeId = new Buffer(4);
        // typeId.writeInt32LE(buffer.readInt32LE(0), 0);
        // typeId = typeId.toString('hex');
        let typeId = this._buffer.readInt32LE(0);

        let Type = TypeRegistry.getById(typeId);

        if (!Type) {
            throw new Error('Type id not found: ' + typeId);
        }

        console.log(Type);
        this.moveCursor(4);

    }

    moveCursor(by) {
        this._cursor += by;
    }

    slice() {
        return this._buffer.slice(this._cursor, this.buffer.length - this._cursor);
    }
}