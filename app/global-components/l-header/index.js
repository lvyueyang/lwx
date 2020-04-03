let parent = null

const app = getApp()

Component({
    properties: {},
    data: {
        barHeight: 0,
        height: 0,
        back: {
            show: false
        }
    },
    lifetimes: {
        // 在组件实例刚刚被创建时执行
        created() {
        },
        // 在组件实例进入页面节点树时执行
        attached() {
            const sysInfo = wx.getSystemInfoSync()
            this.setData({
                barHeight: sysInfo.statusBarHeight,
                height: sysInfo.statusBarHeight + 44
            })
            parent = wx.createSelectorQuery().in(this)._defaultComponent
            const routers = getCurrentPages()
            if (routers.length > 1) {
                this.setData({
                    'back.show': true
                })
            }
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
    methods: {}
})
