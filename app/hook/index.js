import utils from '../utils/util'
import api from '../api/index'
import setShare from './beforeHook/setShare'
import * as mixins from './mixins/global'

const hookOption = {
    data: {
        // 当前设备是否为iPhoneX
        $ipx: utils.isIpx()
    },
    $utils: utils,
    $api: api,
    onLoad(option) {
        setShare.call(this)
    },
    onShow() {
    },
    onReady() {
    },
    onHide() {
    },
    onUnload() {
    },
    onPullDownRefresh() {
    },
    onReachBottom() {
    },
    onShareAppMessage() {
    },
    onPageScroll() {
    },
    onResize() {
    },
    onTabItemTap(item) {
    },
    ...mixins
}

String.prototype.lineClamp = function (number = 20) {
    if (!this) {
        return this
    }
    if (this.length <= number) {
        return this
    }
    return '...'.padStart(number + 3, this)
}

const originPage = Page
const originComponent = Component

Page = options => {
    for (let [key, value] of Object.entries(hookOption)) {
        if (['data', '$utils', '$api'].includes(key)) {
            options[key] = {
                ...value,
                ...options[key]
            }
        }
        if (typeof value === 'function') {
            const originFunction = options[key]
            options[key] = function (...args) {
                value.call(this, ...args)
                return originFunction && originFunction.call(this, ...args)
            }
        }
    }
    originPage(options)
}
Component = options => {
    if (typeof options.methods == 'object') {
        for (let [key, value] of Object.entries(hookOption)) {
            if (['data', '$utils', '$api'].includes(key)) {
                options[key] = {
                    ...value,
                    ...options[key]
                }
            }
            if (typeof value === 'function') {
                const originFunction = options.methods[key]
                options.methods[key] = function (...args) {
                    value.call(this, ...args)
                    return originFunction && originFunction.call(this, ...args)
                }
            }
        }
    }
    originComponent(options)
}
