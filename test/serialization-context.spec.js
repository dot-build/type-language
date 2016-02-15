describe('SerializationContext', function() {
    describe('#constructor', function() {
        it('should initialize the context', function () {
            let context = new TL.SerializationContext();
            expect(context._buffers).toEqual([]);
            expect(context.length).toBe(0);
        });
    });

    describe('#write(buffer)', function() {
        it('should add a buffer to context', function () {
            let buffer = new Buffer(2);
            let context = new TL.SerializationContext();

            context.write(buffer);
            expect(context._buffers).toEqual([buffer]);
            expect(context.length).toBe(2);
        });
    });

    describe('#toBuffer()', function() {
        it('should concat and return the buffers on context', function () {
            let one = new Buffer(1);
            let two = new Buffer(1);
            one.writeUInt8(10);
            two.writeUInt8(20);

            let context = new TL.SerializationContext();
            context.write(one).write(two);

            let buffer = context.toBuffer();
            let expected = Buffer.concat([one, two]);
            expect(buffer.toString('hex')).toBe(expected.toString('hex'));
        });
    });

    describe('#reset()', function() {
        it('should reset the context', function () {
            let context = new TL.SerializationContext();
            let buffer = new Buffer(1);
            context.write(buffer);
            context.reset();

            expect(context._buffers).toEqual([]);
            expect(context.length).toBe(0);
        });
    });
});