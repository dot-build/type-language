describe('fromBuffer', function() {
    it('should deserialize a type from a buffer', function () {
        let schema = {
            constructors: [{
                "id": "12345678", // hex 4e61bc00
                "predicate": "point",
                "params": [{
                    "name": "x",
                    "type": "int"
                }, {
                    "name": "y",
                    "type": "int"
                }],
                "type": "Point"
            }]
        }

        TL.TypeRegistry.importSchema(schema);

        let buffer = new Buffer('4e61bc000a000000ff000000', 'hex');
        let Type = TL.types.point;
        let value = TL.deserialize(buffer);

        expect(value.x).toBe(10);
        expect(value.y).toBe(255);
    });
});