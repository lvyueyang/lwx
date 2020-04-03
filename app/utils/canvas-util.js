/**
 * 处理文字换行
 * @param text {String}  -需要处理的文字段落
 * @param num {Number}  -每段的文字数
 * */
export const textWrap = (text, num) => {
    let textArr = []
    const fn = str => {
        if (str) {
            const n = str.substring(0, num)
            textArr.push(n)
            fn(str.substring(num))
        }
    }
    fn(text)
    console.log(textArr)
    return textArr
}

/**
 * 绘制圆形型头像
 * @param ctx {Object}  -canvas上下文
 * @param img {String}  -头像
 * @param x {Number}  -横坐标
 * @param y {Number}  -纵坐标
 * @param r {Number}  -半径
 * */
export const circleAvatar = (ctx, img, x, y, r) => {
    ctx.save()
    let d = 2 * r
    let cx = x + r
    let cy = y + r
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(img, x, y, d, d)
    ctx.restore()
    ctx.closePath()

}

/**
 * 图片缓存到本地
 * @param imgUrl {String}  -需要缓存到本地的图片地址
 */
export const httpImgLocal = imgUrl => {
    return new Promise((resolve, reject) => {
        wx.getImageInfo({
            src: imgUrl,
            success: res => {
                resolve(res)
            },
            fail: e => {
                console.error('缓存网络图片失败', e)
                reject(e)
            }
        })
    })
}

/**
 * 多个图片缓存至本地
 * @param imgUrls {String | Array | Object}  -图片地址
 * */
export const httpImgsLocal = imgUrls => {
    if (Array.isArray(imgUrls) && imgUrls.length > 0) {
        let arr = []
        imgUrls.forEach(item => {
            const p = httpImgLocal(item)
            arr.push(p)
        })
        return Promise.all(arr)
    } else if (typeof imgUrls === 'object') {
        let valArr = []
        let keyArr = []
        for (let keyName in imgUrls) {
            // IDE 提示检测使用 hasOwnProperty , 防止添加原型链中的key
            if (imgUrls.hasOwnProperty(keyName)) {
                keyArr.push(keyName)
                const p = httpImgLocal(imgUrls[keyName])
                valArr.push(p)
            }
        }
        return new Promise((resolve, reject) => {
            if (valArr.length === 0) {
                reject({
                    message: '传入参数为空'
                })
            } else {
                Promise.all(valArr).then(res => {
                    let obj = {}
                    res.map((item, index) => {
                        let k = keyArr[index]
                        obj[k] = item
                    })
                    resolve(obj)
                }).catch(e => {
                    console.error('缓存网络图片失败', e)
                    reject(e)
                })
            }
        })
    }
    if (typeof imgUrls === 'string') {
        return httpImgLocal(imgUrls)
    }

}

/**
 * base64转本地图片url
 * @param base64data {String}  -图片base64编码
 */

const fsm = wx.getFileSystemManager()
const FILE_BASE_NAME = 'tmp_base64src'

export const base64src = base64data => {
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || []
    if (!format) {
        return new Error('ERROR_BASE64SRC_PARSE')
    }
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`
    const buffer = wx.base64ToArrayBuffer(bodyData)
    try {
        fsm.writeFileSync(filePath, buffer, 'binary')
        return filePath
    } catch (e) {
        console.error('writeFileSync  base64转地址失败')
        return new Error(e)
    }
}

