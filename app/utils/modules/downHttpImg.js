import downImg from './downImg'

export default url => {
    return new Promise((resolve, reject) => {
        wx.downloadFile({
            url,
            success: res => {
                if (res.statusCode === 200) {
                    downImg(res.tempFilePath).then(res => {
                        resolve(res)
                    }).catch(err => {
                        reject(err)
                    })
                } else {
                    reject(res)
                    wx.showToast({
                        icon: 'none',
                        title: '图片请求失败'
                    })
                }
            },
            fail: e => {
                reject(e)
                wx.showToast({
                    icon: 'none',
                    title: '图片请求失败'
                })
            }
        })
    })
}
