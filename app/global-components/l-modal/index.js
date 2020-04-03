// components/modal/index.js
import util from "../../utils/util"

Component({
    properties: {
        show: {
            type: Boolean,
            value: false
        },
        headerHide: {
            type: Boolean,
            value: false
        },
        title: {
            type: [String, Boolean],
            value: false
        },
        backgroundOpacity: {
            type: String,
            value: '.4'
        },
        mask: {
            type: Boolean,
            value: false
        },
        closeIcon: {
            type: Boolean,
            value: true
        },
    },
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    externalClasses: ['lk-wrapper-class'],
    data: {
        ipx: util.isIpx()
    },
    methods: {
        handlerClose() {
            this.toggleModal(false)
        },
        handlerMaskCloseModal() {
            if (this.data.mask) {
                return
            }
            this.toggleModal(false)
        },
        toggleModal(show = true) {
            this.setData({
                show
            })
            if (!show) {
                this.triggerEvent('close')
            }
            this.triggerEvent('change', show)
        }
    }
})
