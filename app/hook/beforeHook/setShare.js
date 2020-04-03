import api from '../../api/index'

// 设置服务端配置的分享语
// this为每个Page中的this
export default async function () {
    console.warn('此处只为演示如何为每个page页面注入函数')
    try {
        const data = await api.get(this.route)
        this.onShareAppMessage = function () {
            return {
                title: data.title,
                path: data.path,
                imageUrl: data.imageUrl,
            }
        }
    } catch (e) {
    }
}
