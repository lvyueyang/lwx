import CONFIG from '../config/index'
import util from './util'

const navigateTypes = ['redirectTo', 'navigateTo']
/**
 * 打开web页面
 * @param {Object} options 默认请求地址
 * @param {String} options.baseUrl 默认请求地址
 * @param {String} options.src 请求路径
 * @param {String} options.query 请求参数
 * @param {String} options.title 页面标题
 * @param {String} options.navigateType 跳转方式 @default navigateTo
 * */
export const toWeb = (options = {}) => {
    let {baseUrl, src, query, title, navigateType} = options
    if (!navigateTypes.includes(navigateType)) {
        navigateType = 'navigateTo'
    }
    if (!baseUrl) {
        baseUrl = CONFIG.frontUrl
    }
    if (src.includes('https://') || src.includes('http://')) {
        baseUrl = ''
    }
    let q = ``
    if (query && typeof query === 'object') {
        q = util.queryStringify(query)
    }
    if (src) {
        let endStr = src.charAt(src.length - 1)
        if (['&', '?'].includes(endStr)) {
            src += q
        } else {
            if (src.includes('?')) {
                src += `&${q}`
            } else {
                src += `?${q}`
            }
        }
    }
    let url = `${baseUrl}${src}`
    wx[navigateType]({
        url: `/pages/web-view/index?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    })
}
