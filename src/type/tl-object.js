import {Buffer} from 'buffer';

/**
 * Base class to all TL objects
 */
export default class TLObject {

    /**
     * @param {Object} [data]      Object literal with properties to add on instance
     */
    constructor(data = null) {
        if (data) {
            Object.assign(this, data);
        }
    }

    toJSON() {
        let self = this;
        let type = this.__id.type;
        let result = { _: type, params: {}};

        Object.keys(this).forEach(function (name) {
            let value = self[name];

            if (value === null || value === undefined) return;

            if (value instanceof TLObject) {
                value = value.toJSON();
            }

            if (Buffer.isBuffer(value)) {
                value = '0x' + value.toString('hex');
            }

            result.params[name] = value;
        });

        return result;
    }

    toString() {
        JSON.stringify(this.toJSON(), null, '  ');
    }
}

TLObject.id = TLObject.prototype.__id = {
    id: '',
    type: '',
    baseType: 'Object',
    params: []
};