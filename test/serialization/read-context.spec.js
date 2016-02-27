describe('ReadContext', function() {
    const ReadContext = TL.ReadContext;

    describe('#constructor(buffer)', function() {
        it('should store the buffer on context', function() {
            let buffer = new Buffer(0);
            let context = new ReadContext(buffer);

            expect(context._buffer).toBe(buffer);
            expect(context._cursor).toBe(0);
        });
    });

    describe('#deserialize()', function() {
        it('should extract data on buffer into _data property', function() {
            const schema = getSchema();
            TL.TypeRegistry.importSchema(schema);

            let buffer = new Buffer('15c4b51c03000000020000000300000004000000');
        });
    });
});

// test schema
function getSchema() {
    return {
        "constructors": [{
            "id": "481674261",
            "predicate": "vector",
            "params": [],
            "type": "Vector t"
        }, {
            "id": "12345678",
            "predicate": "AbstractConstructorType",
            "params": [{
                "name": "message",
                "type": "string"
            }, {
                "name": "rawBytes",
                "type": "bytes"
            }, {
                "name": "int",
                "type": "int"
            }, {
                "name": "double",
                "type": "double"
            }, {
                "name": "long",
                "type": "long"
            }, {
                "name": "int128",
                "type": "int128"
            }, {
                "name": "int256",
                "type": "int256"
            }, {
                "name": "vectorInt",
                "type": "Vector<int>"
            }, {
                "name": "vectorLong",
                "type": "Vector<long>"
            }, {
                "name": "object",
                "type": "Object"
            }],
            "type": "AbstractConstructor"
        }, {
            "id": "87654321",
            "predicate": "methodResult",
            "params": [{
                "name": "ok",
                "type": "Bool"
            }],
            "type": "MethodResult"
        }],
        "methods": [{
            "id": "-12345678",
            "method": "methodTest",
            "params": [{
                "name": "name",
                "type": "string"
            }, {
                "name": "numbers",
                "type": "Vector<int>"
            }],
            "type": "MethodResult"
        }]
    };
}
