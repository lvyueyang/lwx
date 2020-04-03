import queryStringify from './modules/queryStringify'
import downImg from './modules/downImg'
import downHttpImg from './modules/downHttpImg'
import dayjs from '../plugin/dayjs/index'

export default {
    queryStringify,
    downImg,
    downHttpImg,
    dayjs,
    /**
     * 是否为ipx类型设备
     * @return {Boolean}
     * */
    isIpx() {
        const sysInfo = wx.getSystemInfoSync()
        const { system, statusBarHeight} = sysInfo
        return system.toLocaleLowerCase().includes('ios') && statusBarHeight > 40
    },
    /**
     * 字符串超出显示...
     * @param {String} text @default '' 目标字符串
     * @param {Number} num @default 0 截取长度
     *
     * @return {String}
     * */
    textSplice(text = '', num = 0) {
        if (text && num > 0) {
            if (text.length > num) {
                return '...'.padStart(num + 3, text)
            }
            return text
        } else {
            return text
        }
    },
    copyText(data) {
        return new Promise((resolve, reject) => {
            if (!data) {
                reject({
                    message: '文字为空，复制失败'
                })
                return
            }
            wx.setClipboardData({
                data,
                success: res => {
                    console.log(res)
                    resolve(res)
                },
                fail: e => {
                    console.error(e)
                    reject(e)
                }
            })
        })
    },
    sleep: (timer = 0) => {
        if (timer > 0) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve()
                }, timer)
            })
        }
    }
}
