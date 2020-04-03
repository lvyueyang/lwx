import CONFIG from '../config/index'

const baseURL = CONFIG.baseURL + '/api'

function formatUrl(url) {
    if (url.substring(0, 5).includes('http')) {
        return url
    } else {
        return baseURL + url
    }
}

export default {
    /**
     * get请求
     * @param {String} url 请求地址
     * @param {{params: *}} options 配置项
     * @param {Object} options.params 请求参数
     * @param {Object} options.header 请求头
     * */
    get(url, options = {}) {
        const {params = {}, headers = {}} = options
        return new Promise((resolve, reject) => {
            wx.request({
                url: formatUrl(url),
                data: params,
                header: {
                    ...headers
                },
                success: res => {
                    resolve(res.data)
                },
                fail: e => {
                    reject(e)
                }
            })
        })
    },
    /**
     * post请求
     * @param {String} url 请求地址
     * @param {Object} data 请求参数
     * @param {Object} options 请求配置
     * */
    post(url, data = {}, options = {}) {
        url = formatUrl(url)
        let headers = options.headers || {}
        return new Promise((resolve, reject) => {
            wx.request({
                url: formatUrl(url),
                data,
                header: {
                    ...headers
                },
                method: 'POST',
                success: res => {
                    resolve(res.data)
                },
                fail: e => {
                    reject(e)
                }
            })
        })
    },
}
