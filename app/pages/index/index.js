Page({
    data: {},
    onLoad() {
    },
    handlerAuth() {
        this.selectComponent('#Auth').show({
            openType: 'getUserInfo',
            success: res => {
                console.log(res)
                wx.showToast({
                    title: '成功'
                })
            },
            fail: e => {
                wx.showToast({
                    icon: 'none',
                    title: '失败'
                })
            }
        })
    }
})
