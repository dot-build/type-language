describe('TypeRegistry', function() {
    const TypeRegistry = TL.TypeRegistry;

    beforeEach(function () {
        TypeRegistry._byId = {};
        TypeRegistry._byType = {};
    });

    describe('#getByName(String typeName)', function() {
        it('should retrieve a defined type by name', function () {
            TypeRegistry.addType(TL.Vector);
            let Vector = TypeRegistry.getByType('vector');

            expect(Vector).toBe(TL.Vector);
        });
    });

    describe('#getById(String hash)', function() {
        it('should retrieve the Vector type by it`s CRC32 signature', function () {
            TypeRegistry.addType(TL.Vector);

            let id = TL.Vector.id.id;
            let Vector = TypeRegistry.getById(id);

            expect(Vector).toBe(TL.Vector);
        });
    });

    describe('#addType(TypeConstructor)', function() {
        it('should store a type on registry', function () {
            class Foo {}

            let id = '12345678';
            let type = 'foo.Foo';

            Foo.id = { id, type };

            TypeRegistry.addType(Foo);

            expect(TypeRegistry._byId[id]).toBe(Foo);
            expect(TypeRegistry._byType[type]).toBe(Foo);
        });
    });

    describe('#importSchema(schema, namespace)', function() {
        it('should process a schema definition and declare types', function () {
            let schema = {
                constructors: [{
                    "id": "12345678",
                    "predicate": "foo.FooType",
                    "params": [{
                        "name": "id",
                        "type": "int"
                    }],
                    "type": "Foo"
                }],
                "methods": [{
                    "id": "87654321",
                    "predicate": "foo.getFoo",
                    "params": [{
                        "name": "fooId",
                        "type": "int"
                    }],
                    "type": "Foo"
                }]
            };

            let _ = new Buffer(4);

            _.writeInt32LE(12345678, 0);
            let typeId = _.toString('hex');

            _.writeInt32LE(87654321, 0);
            let methodId = _.toString('hex');

            TypeRegistry.importSchema(schema, 'ns');

            let Type = TypeRegistry.getByType('ns.foo.FooType');
            let Method = TypeRegistry.getByType('ns.foo.getFoo');

            let typeMeta = Type.id;
            let methodMeta = Method.id;

            expect(typeMeta.id).toBe(typeId);
            expect(typeMeta.type).toBe('foo.FooType');
            expect(typeMeta.baseType).toBe('Foo');

            expect(methodMeta.id).toBe(methodId);
            expect(methodMeta.type).toBe('foo.getFoo');
            expect(methodMeta.baseType).toBe('Foo');

            expect(TypeRegistry.types.ns.foo.FooType).toBe(Type);
            expect(TypeRegistry.types.ns.foo.getFoo).toBe(Method);
        });
    });
});
