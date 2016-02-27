describe('Vector', function() {
    const id = {
        id: '15c4b51c',
        type: 'Vector'
    };

    describe('::id', function() {
        it('should have a fixed id', function () {
            expect(TL.Vector.id).toEqual(id);
        });
    });

    describe('#constructor(Buffer data)', function() {
        it('should extend TypeObject', function () {
            let vector = new TL.Vector();
            expect(vector instanceof TL.TLObject).toBe(true);
        });
    });

    describe('#constructor(Object options)', function() {
        it('should store the initialization array', function () {
            let list = [1, 2, 3];
            let options = { list };

            let vector = new TL.Vector(options);

            expect(vector._list).toBe(list);
            expect(vector._options.type).toBe('int');
        });
    });
});