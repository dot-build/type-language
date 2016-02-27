import { Buffer } from 'buffer';

import TLObject from 'type/tl-object.js';
import TypeRegistry from 'type/type-registry.js';

import WriteContext from 'serialization/write-context.js';
import ReadContext from 'serialization/read-context.js';

import Vector from 'vector.js';

import {serialize, deserialize} from 'helpers.js';

if (typeof window !== 'undefined') {
    window.Buffer = Buffer;
}

const serialization = { WriteContext, ReadContext };
const types = TypeRegistry.types;

TypeRegistry.addType(Vector);

export default {
    TLObject,
    TypeRegistry,
    Vector,
    WriteContext,
    ReadContext,

    types,
    deserialize,
    serialize
};