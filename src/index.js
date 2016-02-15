import { Buffer } from 'buffer';

import TypeObject from './type-object.js';
import TypeObjectWriter from './type-object-writer.js';
import SerializationContext from './serialization-context.js';

if (typeof window !== 'undefined') {
    window.Buffer = Buffer;
}

export default {
    TypeObject,
    TypeObjectWriter,
    SerializationContext
};