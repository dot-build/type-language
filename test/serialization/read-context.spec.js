/* globals BigInteger */
describe('ReadContext', function() {
    const ReadContext = TL.ReadContext;

    describe('#constructor(buffer)', function() {
        it('should store the buffer on context', function() {
            let buffer = new Buffer(0);
            let context = new ReadContext(buffer);

            expect(context._buffer).toBe(buffer);
            expect(context._cursor).toBe(0);
            expect(context._object).toBe(null);
        });
    });

    describe('#deserialize()', function() {
        it('should extract data on buffer into _object', function() {
            const schema = getSchema();
            TL.TypeRegistry.importSchema(schema);

            let Type = TL.TypeRegistry.getByType('AbstractConstructorType');

            let longString = 'A'.repeat(300);

            // 320 bytes
            let bytes = '500e6b59ab8572e576847cd28b960fe8f9fc817661381585555a258f2f4b4700' +
                        '16031307306d5dcb40b1154f8dc231c26c1ffb3de8ee14ed69ce35c9689a6391' +
                        '29d2bdaafa0007456188ba934c9e4a0e82327880dc3bf1b9afed091c817503a0' +
                        '367c051a5606027f193fdee6f7c00808704c4f79420e24a663be7340eb5ac6fd' +
                        '14e0bb7e40671a5be862b0af9fd33e6e113439001ad85c81cac9bd9a179728f1' +
                        '2d168639c7feb48a4b40a668dffd0f9d176b31dfa06774b5cb29ff01b9413304' +
                        '8551fd69dff55265e018f0634ee11132e0397ae06c91954b87e9a6ee5b63f349' +
                        '0d1d20e49f9169785a608750d2365f427cf5b244f8c704a5eaeb6a3130604450' +
                        'c79faa5775bcc3fbebef38b4e684ed3ed02fa87d18c9255d9bfa0ab3ba8e750c' +
                        '93c90b0f61b6288c285614253793c90b0f61b6288c2856142537010203040506';

            bytes = new Buffer(bytes, 'hex');

            let data = {
                message: 'short message',
                longMessage: longString,
                rawBytes: bytes,
                int: 1,
                double: 2,
                long: 3,
                int128: new BigInteger('0x9f09a56a2a594c5e036bc3db4578a52f', 16).toString(16),
                int256: new BigInteger('0x5d1ffa9187804b67bffe4f80f49901aa0d91fa07b12443a9fe645cb7311600cc', 32).toString(16),
                vectorLong: new TL.Vector(['288230376151711744', '360287970189639680', '432345564227567616'], 'long'),
                vectorInt: new TL.Vector([1, 2, 3]),
                object: new TL.types.intId({ id: 1 }),
                intIds: new TL.Vector([ new TL.types.intId({ id: 1 }), new TL.types.intId({ id: 2 }) ], 'intId')
            };

            let i = new Type(data);
            let c = new TL.WriteContext(i);
            let buffer = c.serialize().toBuffer().toString('hex');
            // console.log(buffer.toString('hex'));

            buffer = new Buffer(buffer, 'hex');
            let context = new ReadContext(buffer);
            let result = context.deserialize().getTypeObject();

            expect(result.message).toBe(data.message);
            expect(result.longMessage).toBe(data.longMessage);
            expect(result.rawBytes.toString('hex')).toBe(bytes.toString('hex'));
            expect(result.int).toBe(data.int);
            expect(result.double).toEqual(data.double);

            let vectorLong = result.vectorLong.getList();
            expect(result.vectorInt.getList()).toEqual([1, 2, 3]);
            expect(vectorLong[0].toString(10)).toEqual('4');
            expect(vectorLong[1].toString(10)).toEqual('5');
            expect(vectorLong[2].toString(10)).toEqual('6');

            expect(result.object instanceof TL.types.intId).toBe(true);
            expect(result.object.id).toBe(1);

            // console.log(i.toJSON());
            // console.log(buffer.toString('hex'));
            // console.log(result);
        });
    });

    describe('#readString()', function() {
        it('should read a short string from current position', function () {
            let string = 'AAA';
            let bytes = '03414141';
            let buffer = new Buffer(bytes, 'hex');

            let context = new ReadContext(buffer, { isBare: true });
            let result = context.readString();
            expect(result).toBe(string);
        });

        it('should read a long string from current position', function () {
            let string = 'A'.repeat(300);
            let bytes = 'fe2c0100' + '41'.repeat(300);
            let buffer = new Buffer(bytes, 'hex');

            let context = new ReadContext(buffer, { isBare: true });
            let result = context.readString();

            expect(result).toBe(string);
        });
    });

    describe('#readInt()', function() {
        it('should read a integer from current position', function () {
            let buffer = new Buffer('0000000001000000', 'hex');
            let context = new ReadContext(buffer, { isBare: true });
            context._cursor = 4;

            let number = context.readInt();
            expect(number).toBe(1);
            expect(context._cursor).toBe(8);
        });
    });

    describe('#readDouble()', function() {
        it('should read a integer from current position', function () {
            let buffer = new Buffer('000000000000f03f', 'hex');
            let context = new ReadContext(buffer, { isBare: true });

            let number = context.readDouble();
            expect(number).toBe(1);
            expect(context._cursor).toBe(8);
        });
    });
});

// test schema
function getSchema() {
    return {
        "constructors": [{
            "id": "622949684",
            "predicate": "intId",
            "params": [{
                "name": "id",
                "type": "int"
            }],
            "type": "IntId"
        },{
            "id": "12345678",
            "predicate": "AbstractConstructorType",
            "params": [{
                "name": "message",
                "type": "string"
            }, {
                "name": "longMessage",
                "type": "string"
            }, {
                "name": "rawBytes",
                "type": "bytes"
            }, {
                "name": "int",
                "type": "int"
            }, {
                "name": "double",
                "type": "double"
            }, {
                "name": "long",
                "type": "long"
            }, {
                "name": "int128",
                "type": "int128"
            }, {
                "name": "int256",
                "type": "int256"
            }, {
                "name": "vectorLong",
                "type": "Vector<long>"
            }, {
                "name": "vectorInt",
                "type": "Vector<int>"
            }, {
                "name": "object",
                "type": "Object"
            }, {
                "name": "intIds",
                "type": "vector<intId>"
            }],
            "type": "AbstractConstructor"
        }, {
            "id": "87654321",
            "predicate": "methodResult",
            "params": [{
                "name": "ok",
                "type": "Bool"
            }],
            "type": "MethodResult"
        }],
        "methods": [{
            "id": "-12345678",
            "method": "methodTest",
            "params": [{
                "name": "name",
                "type": "string"
            }, {
                "name": "numbers",
                "type": "Vector<int>"
            }],
            "type": "MethodResult"
        }]
    };
}
