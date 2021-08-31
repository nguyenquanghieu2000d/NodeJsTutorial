const handleUndefined = (object, value) => {
    const obj = {};
    for (const key of value) {
        obj[key] = "";
    }
    for (const [key, value] of Object.entries(object)) {
        if (obj[key] !== undefined) {
            obj[key] = value
        }
    }
    return obj;
}

module.exports = handleUndefined;