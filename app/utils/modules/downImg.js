/**
 * 下载临时文件路径或永久文件路径，不支持网络图片路径
 * @param {String} path -路径
 * @return {Promise}
 * */

export default path => {
    return new Promise((resolve, reject) => {
        wx.saveImageToPhotosAlbum({
            filePath: path,
            success: res => {
                wx.showToast({
                    icon: 'success',
                    title: '保存成功'
                })
                resolve(res)
            },
            fail: e => {
                console.log(e)
                if (e.errMsg === 'saveImageToPhotosAlbum:fail auth deny' || e.errMsg === 'saveImageToPhotosAlbum:fail authorize no response') {
                    wx.showModal({
                        title: '下载失败',
                        content: '您未授予保存到相册的权限，请在接下来的授权选项中选择 相册 > 点击打开，返回继续点击下载图片即可保存',
                        showCancel: false,
                        success(res) {
                            if (res.confirm) {
                                wx.openSetting({})
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: '保存失败'
                    })
                }
                reject(e)
            }
        })
    })
}
