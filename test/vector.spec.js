describe('Vector', function() {
    const id = {
        id: '15c4b51c',
        type: 'vector',
        baseType: 'Vector',
        params: []
    };

    describe('::id', function() {
        it('should have a fixed id', function () {
            expect(TL.Vector.id).toEqual(id);
        });
    });

    describe('#constructor()', function() {
        it('should extend TypeObject', function () {
            let vector = new TL.Vector();
            expect(vector instanceof TL.TLObject).toBe(true);
        });
    });

    describe('#constructor(Array list, String type = "int")', function() {
        it('should store the initialization array', function () {
            let list = [1, 2, 3];
            let vector = new TL.Vector(list);

            expect(vector.list).toBe(list);
            expect(vector.type).toBe('int');
        });
    });
});