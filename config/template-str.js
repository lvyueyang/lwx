const WXML_STR = `<global-view-template id="__GVC"></global-view-template>`
const JS_STR = `Page({
    data: {},
    onLoad(options) {
    },
    onShow() {
    },
    onHide() {
    },
    onUnload() {
    },
    onPullDownRefresh() {
    },
    onShareAppMessage() {
    },
})
`

const JSON_STR = `{
    "navigationBarTitleText": "",
    "usingComponents": {}
}
`
const SCSS_STR = `@import "../../style/modules/color";
@import "../../style/modules/function";
`
module.exports = {
    WXML_STR,
    JS_STR,
    JSON_STR,
    SCSS_STR,
}
