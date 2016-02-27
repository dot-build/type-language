/**
 * Base class to all TL objects
 */
export default class TLObject {

    /**
     * @param {Object} [data]      Object literal with properties to add on instance
     */
    constructor(data = null) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
