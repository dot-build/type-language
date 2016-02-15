import { Buffer } from 'buffer';

export default class SerializationContext {
    constructor() {
        this.reset();
    }

    /**
     * @param {Buffer} buffer
     */
    write(buffer) {
        this._buffers.push(buffer);
        this.length += buffer.length;

        return this;
    }

    /**
     * @return {Buffer}
     */
    toBuffer() {
        return Buffer.concat(this._buffers);
    }

    reset() {
        this._buffers = [];
        this.length = 0;
    }
}