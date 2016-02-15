describe('TypeObjectWriter', function() {
    let o, context;
    beforeEach(function () {
        context = new TL.SerializationContext();
        o =  new TL.TypeObjectWriter();
    });

    describe('::get()', function() {
        it('should return a singleton writer', function () {
            let writer = TL.TypeObjectWriter.getInstance();
            expect(writer instanceof TL.TypeObjectWriter).toBe(true);

            // return the same instance
            expect(TL.TypeObjectWriter.getInstance()).toBe(writer);
        });
    });

    describe('#writeInt(Context context, Number int)', function() {
        it('should queue a int value on context', function () {
            let number = 0x0a0b0c0d;

            var buffer = new Buffer(4);
            buffer.writeUInt32LE(number, 0, true);
            let bufferHex = buffer.toString('hex');

            o.writeInt(context, number);

            let writtenInt = context.toBuffer();
            expect(writtenInt.toString('hex')).toBe(bufferHex);
        });
    });

    describe('#writeDouble(context, Number double)', function() {
        it('should queue a double value on context', function () {

            o.writeDouble(context, 0x010204081a1b1c1d);
            let writtenDouble = context.toBuffer();
            let hex = writtenDouble.toString('hex');
            expect(hex).toBe('c2b1a18140207043');

            context.reset();
            o.writeDouble(context, 0xdeadbeefcafebabe);
            writtenDouble = context.toBuffer();
            hex = writtenDouble.toString('hex');
            expect(hex).toBe('d75ff9ddb7d5eb43');
        });
    });

    describe('#writeLong(context, number)', function() {
        it('should write a long type', function () {
            spyOn(o, '_writeBigInt');

            let number = 0x01;
            o.writeLong(context, number);

            expect(o._writeBigInt).toHaveBeenCalledWith(context, number, 8);
        });
    });

    describe('#writeInt128(context, number)', function() {
        it('should write a int128 value', function () {
            spyOn(o, '_writeBigInt');

            let number = 0x01;
            o.writeInt128(context, number);

            expect(o._writeBigInt).toHaveBeenCalledWith(context, number, 16);
        });
    });

    describe('#writeInt256(context, number)', function() {
        it('should write a int256 value', function () {
            spyOn(o, '_writeBigInt');

            let number = 0x01;
            o.writeInt256(context, number);

            expect(o._writeBigInt).toHaveBeenCalledWith(context, number, 32);
        });
    });

    describe('#writeBytes(context, bytes)', function() {
        it('should write a short sequence of bytes', function () {
            // sequence of 8 hex pairs
            let bytes = new Buffer('130c81d08c748257', 'hex');
            let o = new TL.TypeObjectWriter();
            o.writeBytes(context, bytes);

            let writtenBytes = context.toBuffer();
            let hex = writtenBytes.toString('hex');

            // first pair = 8, followed by 8 hex pairs and a padding
            expect(hex).toBe('08130c81d08c748257000000');
        });

        it('should write a long sequence of bytes', function () {
            // sequence of 300 "z" chars
            let bytes = new Buffer('abcdefghij'.repeat(27), 'ascii');
            let length = bytes.length;
            let o = new TL.TypeObjectWriter();
            o.writeBytes(context, bytes);

            let writtenBytes = context.toBuffer();

            let firstByte = writtenBytes.readUInt8(0);
            expect(firstByte).toBe(254);

            // expected signature
            let [a, b, c] = [length & 0xff, (length >> 8) & 0xff, (length >> 16) & 0xff];
            let lengthSignature = new Buffer([a, b, c]);

            // bytes written
            let writtenLength = new Buffer([
                writtenBytes.readUInt8(1), writtenBytes.readUInt8(2), writtenBytes.readUInt8(3)
            ]);

            expect(lengthSignature.toString('hex')).toBe(writtenLength.toString('hex'));

            // 27 * 10 = 274 bytes in length, 2 bytes needed for padding
            expect(writtenBytes.slice(274, 276).toString('hex')).toBe('0000');
        });
    });

    describe('#_writeBigInt(context, bigInt, length)', function() {
        it('should write a long from a number', function () {
            let number = 1;
            o._writeBigInt(context, number, 8);

            let buffer = new Buffer([1, 0, 0, 0, 0, 0, 0, 0]);
            let writtenInt = context.toBuffer();
            expect(writtenInt.toString('hex')).toBe(buffer.toString('hex'));
        });

        it('should write a BigInt from a string', function () {
            let number = '1022202216703';
            o._writeBigInt(context, number, 4);

            let writtenInt = context.toBuffer();
            expect(writtenInt.toString('hex')).toBe('ff000000');

            context.reset();
            number = '18441921394529845472';
            o._writeBigInt(context, number, 8);

            writtenInt = context.toBuffer();
            expect(writtenInt.toString('hex')).toBe('e0c0a080ccddeeff');
        });

        it('should write a long from a string', function () {
            let number = '1';
            o._writeBigInt(context, number, 8);

            let writtenInt = context.toBuffer();
            let hex = writtenInt.toString('hex');
            expect(hex).toBe('0100000000000000');
        });

        it('should write a long from a hex string', function () {
            let number = '0x01';
            o._writeBigInt(context, number, 8);

            let buffer = new Buffer([1, 0, 0, 0, 0, 0, 0, 0]);
            let writtenInt = context.toBuffer();
            let hex = writtenInt.toString('hex');
            expect(hex).toBe(buffer.toString('hex'));

            context.reset();
            number = '0xffeeddcc80a0c0e0';
            o._writeBigInt(context, number, 8);

            writtenInt = context.toBuffer();
            hex = writtenInt.toString('hex');
            expect(hex).toBe('e0c0a080ccddeeff');
        });

        it('should write a int128 from a hex string', function () {
            let number = 0x01;
            o._writeBigInt(context, number, 16);

            let writtenInt = context.toBuffer();
            let hex = writtenInt.toString('hex');
            expect(hex).toBe('01000000000000000000000000000000');
        });

        it('should write a int256 from a hex string', function () {
            let number = 0x01;
            o._writeBigInt(context, number, 32);

            let writtenInt = context.toBuffer();
            let hex = writtenInt.toString('hex');

            expect(hex).toBe('0100000000000000000000000000000000000000000000000000000000000000');
        });

        it('should ignore bytes exceeding the length', function () {
            let bytes = '0xee000000ff';
            o._writeBigInt(context, bytes, 4);

            let writtenInt = context.toBuffer();
            let hex = writtenInt.toString('hex');
            expect(hex).toBe('ff000000');
        });

        it('should fallback to _writeBytes if the value is not number or string', function () {
            let number = new Buffer('000000ff', 'hex');
            o._writeBigInt(context, number, 4);

            let writtenInt = context.toBuffer();
            let hex = writtenInt.toString('hex');
            expect(hex).toBe('000000ff');
        });
    });

    describe('#_writeBytes(context, Buffer bytes[])', function() {
        it('should append the buffer to serialization queue', function () {
            let buffer = new Buffer('00', 'hex');
            o._writeBytes(context, buffer);

            let writtenBuffer = context.toBuffer();
            expect(writtenBuffer.toString('hex')).toBe('00');
        });

        it('should cast bytes if necessary and append to serialization queue', function () {
            var bytes = '00';
            o._writeBytes(context, bytes);

            let writtenBuffer = context.toBuffer();
            let buffer = new Buffer(bytes);

            expect(writtenBuffer.toString('hex')).toBe(buffer.toString('hex'));
        });
    });
});