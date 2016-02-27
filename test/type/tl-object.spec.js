describe('TLObject', function() {
    describe('#constructor(Object data)', function() {
        it('should copy the object "data" to instance', function () {
            let data = { a: 1, b: 2};
            let o = new TL.TLObject(data);

            expect(o.a).toBe(1);
            expect(o.b).toBe(2);
        });
    });

    xdescribe('#toJSON()', function() {
        it('should turn an instance into a JSON-compatible structure', function () {

        });
    });
});