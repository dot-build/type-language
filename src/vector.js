import TLObject from 'type/tl-object.js';

// const defaultOptions = { type: 'int' };

export default class Vector extends TLObject {
    constructor(list = [], type = 'int') {
        super();

        this.list = list;
        this.type = type;
    }

    getList() {
        return this.list.slice();
    }
}

Vector.prototype.__id = Vector.id = {
    id: '15c4b51c',
    type: 'vector',
    baseType: 'Vector',
    params: []
};