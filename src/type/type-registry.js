import TLObject from 'type/tl-object.js';

const VectorType = /^[Vv]ector<(.+)>$/;

class TypeRegistry {
    constructor() {
        this._byId = {};
        this._byType = {};
        this.types = {};
    }

    /**
     * @param {Function} Type               TLObject constructor
     * @param {string} [namespace='']       Optional namespace (type prefix)
     */
    addType(Type, namespace) {
        let typeMeta = Type.id;
        let ns = (namespace ? namespace + '.' : '');

        let id = ns + typeMeta.id;
        let type = ns + typeMeta.type;

        this._byId[id] = Type;
        this._byType[type] = Type;

        this.addTypeReference(Type, type);
    }

    /**
     * @param {Function} Type
     * @param {string} [namespace='']
     */
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
     * @property {Array<Object>} constructors
     * @property {Array<Object>} methods
     * @param {string} [namespace='']
     */
    importSchema(schema, namespace = '') {
        const register = (type) => this.importType(type, namespace);

        (schema.constructors||[]).forEach(register);
        (schema.methods||[]).forEach(register);
    }

    /**
     * @param {Object} typeDefinition
     * @param {string} [namespace='']
     */
    importType(typeDefinition, namespace) {
        this.addType(this.createType(typeDefinition), namespace);
    }

    createType(typeDefinition) {
        let type = typeDefinition.method || typeDefinition.predicate;
        let baseType = typeDefinition.type;
        let params = typeDefinition.params;

        let id = typeDefinition.id;
        let typeHash = new Buffer(4);
        typeHash.writeInt32LE(id, 0);
        id = typeHash.toString('hex');

        this._normalizeParams(params);

        let typeMetadata = { id, type, baseType, params };

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

    _normalizeParams(params) {
        params.forEach(param => {
            let type = param.type;
            if (!VectorType.test(type)) return;

            let match = type.match(VectorType);
            type = match[1];

            param.type = type;
            param.isVector = true;
            param.isBare = type.charAt(0) === '%';
        });
    }
}

let registry = new TypeRegistry();

export default registry;
