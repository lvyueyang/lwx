const queryStringify = (obj, prefix) => {
    let pairs = []
    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue
        }

        let value = obj[key]
        let enKey = encodeURIComponent(key)
        let pair
        if (typeof value === 'object') {
            pair = queryStringify(value, prefix ? prefix + '[' + enKey + ']' : enKey)
        } else {
            pair = (prefix ? prefix + '[' + enKey + ']' : enKey) + '=' + encodeURIComponent(value)
        }
        pairs.push(pair)
    }
    return pairs.join('&')
}

export default queryStringify
