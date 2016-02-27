describe('WriteContext', function() {
    const WriteContext = TL.WriteContext;
    let context;

    beforeEach(function () {
        context = new WriteContext();
    });

    describe('#constructor(object)', function() {
        it('should initialize the context', function () {
            let object = new TL.TLObject();
            let context = new WriteContext(object);

            expect(context._object).toBe(object);
            expect(context._buffers).toEqual([]);
        });
    });

    describe('#push(buffer)', function() {
        it('should add a buffer to context', function () {
            let buffer = new Buffer(2);

            context.push(buffer);
            expect(context._buffers).toEqual([buffer]);
        });
    });

    describe('#toBuffer()', function() {
        it('should concat and return the buffers on context', function () {
            let one = new Buffer(1);
            let two = new Buffer(1);
            one.writeUInt8(10);
            two.writeUInt8(20);

            context.push(one).push(two);

            let buffer = context.toBuffer();
            let expected = Buffer.concat([one, two]);
            expect(buffer.toString('hex')).toBe(expected.toString('hex'));
        });
    });

    describe('#writeInt(Number int)', function() {
        it('should queue a int value on context', function () {
            let number = 0x0a0b0c0d;

            var buffer = new Buffer(4);
            buffer.writeUInt32LE(number, 0, true);
            let bufferHex = buffer.toString('hex');

            context.writeInt(number);

            let writtenInt = context.toBuffer();
            expect(writtenInt.toString('hex')).toBe(bufferHex);
        });
    });

    describe('#writeDouble(Number double)', function() {
        it('should queue a double value on context', function () {

            context.writeDouble(0x010204081a1b1c1d);
            let writtenDouble = context.toBuffer();
            let hex = writtenDouble.toString('hex');
            expect(hex).toBe('c2b1a18140207043');
        });
    });

    describe('#writeLong(number)', function() {
        it('should write a long type', function () {
            spyOn(context, '_writeBigInt');

            let number = 0x01;
            context.writeLong(number);

            expect(context._writeBigInt).toHaveBeenCalledWith(number, 8);
        });
    });

    describe('#writeInt128(number)', function() {
        it('should write a int128 value', function () {
            spyOn(context, '_writeBigInt');

            let number = 0x01;
            context.writeInt128(number);

            expect(context._writeBigInt).toHaveBeenCalledWith(number, 16);
        });
    });

    describe('#writeInt256(number)', function() {
        it('should write a int256 value', function () {
            spyOn(context, '_writeBigInt');

            let number = 0x01;
            context.writeInt256(number);

            expect(context._writeBigInt).toHaveBeenCalledWith(number, 32);
        });
    });

    describe('#writeBytes(bytes)', function() {
        it('should write a short sequence of bytes', function () {
            // sequence of 8 hex pairs
            let bytes = new Buffer('130c81d08c748257', 'hex');
            context.writeBytes(bytes);

            let writtenBytes = context.toBuffer();
            let hex = writtenBytes.toString('hex');

            // first pair = 8, followed by 8 hex pairs and a padding
            expect(hex).toBe('08130c81d08c748257000000');
        });

        it('should write a long sequence of bytes', function () {
            // sequence of 300 "z" chars
            let bytes = new Buffer('abcdefghij'.repeat(27), 'ascii');
            let length = bytes.length;
            context.writeBytes(bytes);

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

    describe('#_writeBigInt(bigInt, length)', function() {
        it('should write a long from a number', function () {
            let number = 1;
            context._writeBigInt(number, 8);

            let buffer = new Buffer([1, 0, 0, 0, 0, 0, 0, 0]);
            let writtenInt = context.toBuffer();
            expect(writtenInt.toString('hex')).toBe(buffer.toString('hex'));
        });

        it('should write a BigInt from a string', function () {
            let number = '1022202216703';
            context._writeBigInt(number, 4);

            let writtenInt = context.toBuffer();
            expect(writtenInt.toString('hex')).toBe('ff000000');
        });

        it('should write a BigInt from a string that is not a safe number', function () {
            // greater than Number.MAX_SAFE_INTEGER
            let number = '18441921394529845472';
            context._writeBigInt(number, 8);

            let writtenInt = context.toBuffer();
            expect(writtenInt.toString('hex')).toBe('e0c0a080ccddeeff');
        });

        it('should write a long from a string', function () {
            let number = '1';
            context._writeBigInt(number, 8);

            let writtenInt = context.toBuffer();
            let hex = writtenInt.toString('hex');
            expect(hex).toBe('0100000000000000');
        });

        it('should write a long from an hex string', function () {
            let number = '0x01';
            context._writeBigInt(number, 8);

            let buffer = new Buffer([1, 0, 0, 0, 0, 0, 0, 0]);
            let writtenInt = context.toBuffer();
            let hex = writtenInt.toString('hex');
            expect(hex).toBe(buffer.toString('hex'));
        });

        it('should write a long from an hex string that is not a safe number', function () {
            // greater than Number.MAX_SAFE_INTEGER
            let number = '0xffeeddcc80a0c0e0';
            context._writeBigInt(number, 8);

            let writtenInt = context.toBuffer();
            let hex = writtenInt.toString('hex');
            expect(hex).toBe('e0c0a080ccddeeff');
        });

        it('should write a int128 from a hex string', function () {
            let number = 0x01;
            context._writeBigInt(number, 16);

            let writtenInt = context.toBuffer();
            let hex = writtenInt.toString('hex');
            expect(hex).toBe('01000000000000000000000000000000');
        });

        it('should write a int256 from a hex string', function () {
            let number = 0x01;
            context._writeBigInt(number, 32);

            let writtenInt = context.toBuffer();
            let hex = writtenInt.toString('hex');

            expect(hex).toBe('0100000000000000000000000000000000000000000000000000000000000000');
        });

        it('should ignore bytes exceeding the length', function () {
            let bytes = '0xee000000ff';
            context._writeBigInt(bytes, 4);

            let writtenInt = context.toBuffer();
            let hex = writtenInt.toString('hex');
            expect(hex).toBe('ff000000');
        });

        it('should fallback to _writeBytes if the value is not number or string', function () {
            let number = new Buffer('000000ff', 'hex');
            context._writeBigInt(number, 4);

            let writtenInt = context.toBuffer();
            let hex = writtenInt.toString('hex');
            expect(hex).toBe('000000ff');
        });
    });

    describe('#_writeBytes(Buffer bytes[])', function() {
        it('should append the buffer to serialization queue', function () {
            let buffer = new Buffer('00', 'hex');
            context._writeBytes(buffer);

            let writtenBuffer = context.toBuffer();
            expect(writtenBuffer.toString('hex')).toBe('00');
        });

        it('should cast bytes if necessary and append to serialization queue', function () {
            var bytes = '00';
            context._writeBytes(bytes);

            let writtenBuffer = context.toBuffer();
            let buffer = new Buffer(bytes);

            expect(writtenBuffer.toString('hex')).toBe(buffer.toString('hex'));
        });
    });
});
