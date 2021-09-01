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

const errorResponse = (error) => {
    console.log(error)
    let response = {};
    response.errors = []
    error.forEach(i => {
        response.errors.push({
            "value": i[0],
            "msg": i[1],
            "param": i[2],
            "location": i[3],
        })
    });
    return response;
}

module.exports = {handleUndefined, errorResponse};