describe('fromBuffer', function() {
    it('should deserialize a type from a buffer', function () {
        let schema = {
            constructors: [{
                "id": "12345678", // hex 4e61bc00
                "predicate": "point",
                "params": [{
                    "name": "x",
                    "type": "long"
                }, {
                    "name": "y",
                    "type": "long"
                }],
                "type": "Point"
            }]
        }

        TL.TypeRegistry.importSchema(schema);

        let data = { x: 10, y: -1 };
        let buffer = new Buffer('4e61bc000000000000002440000000000000f0bf', 'hex');

        let Type = TL.types.point;
        let value = TL.deserialize(buffer);

        console.log(value);
    });

    xit('should read a Vector of integers', function () {
        let buffer = new Buffer('15c4b51c03000000020000000300000004000000', 'hex');
        let vector = TL.deserializeVector(buffer, type);

        // console.log(vector);
        expect(vector._list).toEqual([2, 3, 4]);
    });
});