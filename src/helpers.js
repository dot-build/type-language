import WriteContext from 'serialization/write-context.js';
import ReadContext from 'serialization/read-context.js';

export function deserialize (buffer) {
    if (!Buffer.isBuffer(buffer)) {
        throw new Error('Invalid buffer');
    }

    let context = new ReadContext(buffer);
    context.deserialize();

    return context.getTypeObject();
}

export function serialize(object) {
    let context = new WriteContext(object);
    context.serialize();

    return context.toBuffer();
}
