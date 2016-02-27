import TLObject from 'type/tl-object.js';

export default class Vector extends TLObject {
    constructor(list = [], type = 'int') {
        super();

        this.list = list;
        this.type = type;
    }

    getList() {
        return this.list.slice();
    }

    toJSON() {
        let list = this.list.map(item => {
            if (item instanceof TLObject) {
                return item.toJSON();
            }

            return item;
        });

        return { _: 'vector', type: this.type, list };
    }
}

Vector.prototype.__id = Vector.id = {
    id: '15c4b51c',
    type: 'vector',
    baseType: 'Vector',
    params: []
};