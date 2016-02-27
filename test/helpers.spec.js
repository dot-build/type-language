fdescribe('fromBuffer', function() {
    it('should deserialize a type from a buffer', function () {
        let buffer = new Buffer('15c4b51c03000000020000000300000004000000', 'hex');
        TL.deserialize(buffer);
    });
});