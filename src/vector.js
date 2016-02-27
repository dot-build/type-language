import TLObject from 'type/tl-object.js';

const defaultOptions = { type: 'int' };

export default class Vector extends TLObject {
    constructor(data = {}) {
        super(data);

        let mergedOptions = {};

        Object.assign(mergedOptions, defaultOptions);
        Object.assign(mergedOptions, data);

        this._options = mergedOptions;

        if (Array.isArray(mergedOptions.list)) {
            this._list = mergedOptions.list;
        }
    }
}

Vector.prototype._id = Vector.id = {
    id: '15c4b51c',
    type: 'Vector'
};