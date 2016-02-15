describe('TypeObject', function() {
    describe('#constructor(data)', function() {
        it('should copy the object "data" to instance', function () {
            let data = { a: 1, b: 2};
            let o = new TL.TypeObject(data);

            expect(o.a).toBe(1);
            expect(o.b).toBe(2);
        });
    });
});