import defaultValue from '../../utils/defaultValue.js';

class Feature {
    constructor(type) {
        this.name = 'Feature';
        this.type = defaultValue(type, '');
    }

    getName() {
        return this.name;
    }

    getType() {
        return this.type;
    }
}

export default Feature;