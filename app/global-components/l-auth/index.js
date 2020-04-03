let parent = null

function authInfoText(type) {
    if (type === 'getPhoneNumber') {
        return {
            content: '申请获取您的手机号码',
            subtitle: '申请获取您的手机号码',
        }
    }
    if (type === 'getUserInfo') {
        return {
            content: '申请获取您的信息',
            subtitle: '申请获取您的信息',
        }
    }
}

Component({
    properties: {},
    data: {
        // 授权弹出框
        authModal: {
            show: false,
            mask: false,
            content: '',
            subtitle: '',
            openType: 'getUserInfo',
            confirmText: '确认',
            cancelText: '取消',
            showCancel: false,
            success: () => {
            },
            fail: () => {
            }
        }
    },
    options: {
        addGlobalClass: true,
    },
    lifetimes: {
        // 在组件实例刚刚被创建时执行
        created() {
        },
        // 在组件实例进入页面节点树时执行
        attached() {
            parent = wx.createSelectorQuery().in(this)._defaultComponent
        },
        // 在组件在视图层布局完成后执行
        ready() {
        },
        // 在组件实例被移动到节点树另一个位置时执行
        moved() {
        },
        // 在组件实例被从页面节点树移除时执行
        detached() {
        },
        // 每当组件方法抛出错误时执行
        error() {
        }
    },
    methods: {
        show(options = {}) {
            const authOpt = this.data.authModal
            options.success ? this.data.authModal.success = options.success : true
            options.fail ? this.data.authModal.fail = options.fail : true
            this.setData({
                'authModal.show': true,
                'authModal.content': options.content || authInfoText(options.openType).content,
                'authModal.subtitle': options.subtitle || authInfoText(options.openType).subtitle,
                'authModal.openType': options.openType || authOpt.openType,
                'authModal.mask': options.mask || authOpt.mask,
                'authModal.confirmText': options.confirmText || authOpt.confirmText,
                'authModal.cancelText': options.cancelText || authOpt.cancelText,
                'authModal.showCancel': options.showCancel || authOpt.showCancel,
            })
        },
        close() {
            this.setData({
                'authModal.show': false,
            })
        },
        handlerAuthModalEvent(e) {
            if (e.detail.errMsg.includes(':ok')) {
                this.data.authModal.success(e)
                this.close()
            } else {
                this.data.authModal.fail(e)
            }
        }
    }
})
