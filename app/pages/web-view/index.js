import util from '../../utils/util'

let shareData = null
Page({
    data: {
        src: ''
    },
    /**
     * 打开webview页
     * */
    async onLoad(options) {
        wx.showLoading({
            title: '加载中'
        })
        this.init()
    },
    async init() {
        try {
            let {url, title} = this.options
            if (title) {
                title = decodeURIComponent(title)
                wx.setNavigationBarTitle({title})
            }
            // 像页面内传入登陆token，此处请自行与后端商议后修改
            const token = wx.getStorageSync('token')
            if (url) {
                url = decodeURIComponent(url)
                let endStr = url.charAt(url.length - 1)
                if (['&', '?'].includes(endStr)) {
                    url += `miniToken=${token}`
                } else {
                    if (url.includes('?')) {
                        url += `&miniToken=${token}`
                    } else {
                        url += `?miniToken=${token}`
                    }
                }
            }
            this.setData({src: url})
        } catch (e) {
            wx.showToast({
                icon: 'none',
                title: '加载失败'
            })
            wx.hideLoading()
        }
    },
    webLoadSuccess() {
        wx.hideLoading()
    },
    webLoadError() {
        wx.hideLoading()
    },
    // H5页面内设置分享语
    onShareAppMessage({webViewUrl}) {
        let obj = {
            title: decodeURIComponent(this.options.title),
            url: webViewUrl
        }
        let data = {
            path: `${this.route}?${util.queryStringify(obj)}`
        }
        if (shareData) {
            const {title, path, pathType, imageUrl} = shareData
            title ? data.title = shareData.title : true
            imageUrl ? data.imageUrl = shareData.imageUrl : true
            if (path) {
                if (pathType === 'miniPath') {
                    data.path = path
                } else {
                    obj.url = path
                    data.path = `${this.route}?${util.queryStringify(obj)}`
                }
            }
        }
        return data
    },
    handlerMessage(e) {
        console.log(e.detail.data)
        for (let item of e.detail.data) {
            // 获取web中发送的分享图数据
            if (typeof item === 'object') {
                if (typeof shareData === 'object') {
                    shareData = item.shareData
                }
            }
        }
    }
})
