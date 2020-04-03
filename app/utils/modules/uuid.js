export default () => {
    const time = new Date().getTime()
    let timeLen = time.toString(16).length
    let nextCode = ''
    for (let i = 0; i < (32 - timeLen); i++) {
        nextCode += parseInt(Math.random() * 15).toString(16)
    }
    const uuid = time.toString(16) + nextCode
    console.log(uuid + ': ' + uuid.length)
    return uuid
}
