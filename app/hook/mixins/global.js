// 全局混合函数
import utils from "../../utils/util"

/**
 * 输入框双向绑定 可为input
 * */
export function $MixinVModel(event) {
    console.log(event)
    const {value} = event.detail
    const {model} = event.currentTarget.dataset
    this.setData({
        [model]: value
    })
}

/**
 * 下载网络图片
 * */
export function $MixinDownHttpImage(event) {
    const {url} = event.currentTarget.dataset
    utils.downHttpImg(url)
}

/**
 * 复制文字
 * */
export function $MixinCopyText(event) {
    const {text} = event.currentTarget.dataset
    utils.copyText(text).then(() => {
        wx.showToast({
            title: '复制成功'
        })
    }).catch(() => {
        wx.showToast({
            icon: 'none',
            title: '复制失败'
        })
    })
}

/**
 * 拨打电话
 * */
export function $MixinToTell(event) {
    const {tell} = event.currentTarget.dataset
    wx.makePhoneCall({
        phoneNumber: tell
    })
}

/**
 * 跳转至选择器位置或者返回顶部
 * @param {String} event.selector -选择器
 * */
export const $MixinScrollToSelector = event => {
    let selector = ''
    if (event) {
        if (typeof event === 'string') {
            selector = event
        } else if (event.currentTarget.dataset.selector) {
            selector = event.currentTarget.dataset.selector
        } else {
            wx.pageScrollTo({
                scrollTop: 0
            })
            return
        }
        wx.pageScrollTo({
            selector
        })
    } else {
        wx.pageScrollTo({
            scrollTop: 0
        })
    }
}

/**
 * 返回顶部
 * */
export const $MixinBackTop = () => {
    $MixinScrollToSelector()
}
