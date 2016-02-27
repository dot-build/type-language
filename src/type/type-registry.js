import TLObject from 'type/tl-object.js';

class TypeRegistry {
    constructor() {
        this._byId = {};
        this._byType = {};
        this.types = {};
    }

    addType(Type, namespace) {
        let typeMeta = Type.id;
        let ns = (namespace ? namespace + '.' : '');

        let id = ns + typeMeta.id;
        let type = ns + typeMeta.type;

        this._byId[id] = Type;
        this._byType[type] = Type;

        this.addTypeReference(Type, type);
    }

    addTypeReference(Type, namespace) {
        let parent = this.types;
        let typeName = namespace;

        if (~namespace.indexOf('.')) {
            let parts = typeName.split('.');
            typeName = parts.pop();
            parts.forEach(prefix => {
                parent =  parent[prefix] || (parent[prefix] = {});
            });
        }

        parent[typeName] = Type;
    }

    /**
     * @param {Object} schema
     * @param {string} [namespace='']
     */
    importSchema(schema, namespace = '') {
        const register = (type) => this.importType(type, namespace);

        schema.constructors.forEach(register);
        schema.methods.forEach(register);
    }

    importType(typeDefinition, namespace) {
        this.addType(this.createType(typeDefinition), namespace);
    }

    createType(typeDefinition) {
        let type = typeDefinition.method || typeDefinition.predicate;
        let baseType = typeDefinition.type;

        let id = typeDefinition.id;
        let typeHash = new Buffer(4);
        typeHash.writeInt32LE(id, 0);
        id = typeHash.toString('hex');

        let typeMetadata = { id, type, baseType };

        class Type extends TLObject {}

        Type.id = Type.prototype.__id = typeMetadata;
        Type.params = typeDefinition.params;

        return Type;
    }

    getByType(type) {
        return this._byType[type];
    }

    getById(id) {
        return this._byId[id];
    }
}

let registry = new TypeRegistry();

export default registry;
