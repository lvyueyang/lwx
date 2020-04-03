// 是否为测试环境版本，发版前必须确认
// const TEST = true
const TEST = false

// 此中内容都是正式环境数据
let index = {
    TEST,
    baseURL: '', // 正式环境
}

if (TEST) {
    index.TEST = TEST
    index.baseURL = ''
}

export default index
