## 微信小程序原生开发辅助框架 LWX （执著于原生）

## 项目介绍

作者开发了一年多的小程序，在开发过程中遇到了很多的坑与不方便之处，同时又对原生开发有着一定的执著，但是对于习惯了我这种用惯了vue的人来说，原生小程序中的一些写法确实让人感到难受，我想大家在进行原生开发时也会面临着一些不方便之处，例如wxss写法不支持嵌套，不支持变量、混合、函数，不支持双向绑定等等一些问题。于是本着不放弃原生开发并解决一些开发中的问题，一个原生微信小程序开发辅助框架  **LWX** 应运而生，希望能帮助大家解决一些开发中的痛点与不方便之处同时也借此分享一些我的小程序开发心得，同时希望大家能多多交流一起完善这个项目，让原生小程序开发更加丝滑。

## 项目特点

1. 只需要几分钟即可快速上手，**LWX** 就像一个游戏辅助一样来帮助你快速通关微信小程序开发

2. 可以直接分离源码，快速融入进现有项目

3. 整个项目不到100k的代码，不会影响项目大小
4. 配合文档，源码易懂，可快速定制修改

## 项目启动

1. 全局安装gulp

   ```
   cnpm i -g gulp
   ```

2. 安装依赖

   ```
   cnpm i
   ```

3. 启动实时编译sass 

   ```
   gulp serve
   ```

4. 立即编译全部sass

   ```
   gulp all
   ```
5. 创建新页面
    ```  
    gulp create  -name=<页面名称>
    ```
6. 使用微信开发者工具打开app文件夹，即可开始开发

## sass与wxss相关

### sass编译

1. 默认只编译在`app/style/`下的子文件, `app/style/modules` 下的文件不会编译。
2. 在 `app/pages/`下的二级scss文件会被编译, 编译后的文件存在于同级目录，如果新增编译文件，需要在gulpfile.js 文件中 `watch_files` 数组内添加对应目录。
3. 为了减少编译后的体积，可以直接在scss文件中直接引入wxss文件（必须添加`*.wxss`后缀），编译时会自动忽略对wxss的编译，在wxss中直接显示引用。

例如：

``` scss
@import "../../style/modules/color";
@import "../../style/animation.wxss";

.list {
    padding: 10PX;

    .item {
        padding: 20px;
    }
}
```

编译为：

```css
@import "../../style/animation.wxss";

.list {
   padding: 10PX; 
}
.list .item {
   padding: 20rpx; 
}
```

### 全局样式

在`app/style`文件夹内存在着 `rest.scss` `icon.scss`  `button.scss` 这三个文件默认是全局引入的，如不需要可以在 `app/app.wxss` 中删除引用。

接下来对这三个样式进行简单描述

#### rest.scss

1. 对全部标签设置了 `box-sizing: border-box;` （至于为什么不使用 * 大家亲自尝试就知道了）
2. flex布局简写样式，tab样式，link-list样式，form-wrap 请查看源码

#### icon.scss

此处是为了举例如何引入字体图标，因小程序不支持本地路径，所有将字体文件转成base64后引用即可。

以iconfont为例 在浏览器中打开生成的连接，@font-face 下只保留base64字符串引入即可

#### button.scss

原生的button按钮实在是太丑了，此处使用 .btn class对button按钮进行美化，使用方式和bootstrap类似

> 此处只做概述，细节请查看源码



## 全局注入

### 场景一：双向绑定

在 app/hook 中存在 mixins 和 beforeHook 文件夹，此处是为了实现上文中的双向绑定和一些其他的全局可调用的函数方法例如：

平常在为一个输入框添加类似双向绑定的功能时需要这样写

``` html
<input type="text" value="{{name}}" bindinput="handlerInput" />
```

```js
Page({
    data: {
        name: ''
    },
    onLoad() {
    },
    handlerInput(event) {
        const {value} = event.detail
        this.setData({
            name: value
        })
    }
})

```

如果整个项目只有一处或者很少那么这样写没什么问题，但是如果很多页面需要那么你就需要写很多 `handlerInput` 方法这样就很费事了。但是在 **LWX** 中你不需要在js中写 `handlerInput`方法了，`LWX` 使用函数拦截的方式为每个Page 和 Component 注入了一个 `$MixinVModel` 方法。此时你只需要在 wxml 中这样写，不需要在js写了。

``` html
<input type="text" value="{{name}}" data-model="name" bindinput="$MixinVModel" />
```

只需要在 input中添加 一个`data-model`属性，对应data中的值，并且更换 ``handlerInput`  为  `$MixinVModel`即可。

同时也支持绑定对象，举例如下

``` html
<input type="text" value="{{form.name}}" data-model="form.name" bindinput="$MixinVModel" />
```

`$MixinVModel`同时还支持以下表单组件

1. checkbox-group
2. radio-group
3. picker
4. picker-view
5. slider
6. switch
7. textarea
8. input

**LWX** 同时内置了其他类似$MixinVModel的方法 大家可以在 /app/hook/mixins/global.js 中查看，如果需要扩展也可以在在此处自行添加修改

### mixins API

#### `$MixinVModel`

输入框双向绑定

标签属性名称：`data-model`  data中对应的值(类似v-model)  必填

#### `$MixinDownHttpImage`

下载网络图片

标签属性名称：`data-url` 图片地址 必填

#### `$MixinCopyText`

复制文字

标签属性名称：`data-text` 要复制的文字 必填

#### `$MixinToTell`

拨打电话

标签属性名称：`data-tell` 电话号码 必填

#### `$MixinScrollToSelector`

跳转至选择器位置

标签属性名称：`data-selector` 选择器 必填

#### `$MixinBackTop`

返回顶部



### 场景二：每个页面在初始化时都执行一个相同的方法

这个场景是我在开发公司项目时遇到的问题，领导想要通过后端为每个页面实时的配置分享语和分享图，后端提供了一个接口，通过页面路由来获取对应的分享语和分享图，演示函数如下：

``` js
import api from '../../api/index'

let shareData = {}
Page({
    data: {},
    onLoad() {
        this.setShareMessage()
    },
    async setShareMessage() {
        try {
            const data = await api.get(this.route)
            shareData = {
                title: data.title,
                path: data.path,
                imageUrl: data.imageUrl,
            }
        } catch (e) {
            console.error(e)
        }
    },
    onShareAppMessage() {
        return shareData
    }
})
```

如上所示，这是为某一个页面设置信息，如果所有的都要设置改怎么办呢？一个个的加？太费事儿了。

在 **LWX **中你可以这样实现（类似`vue-router`中的**路由导航守卫**）：

在 `app/hook/beforeHook` 中新建 `setShare.js`

```js
import api from '../../api/index'

// 设置服务端配置的分享语
// this为每个Page中的this
export default async function () {
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
```

之后在`app/hook/index.js` 中引用 `setShare.js`

```js
...
import setShare from './beforeHook/setShare'
...
const hookOption = {
    ...
    onLoad(option) {
        setShare.call(this)
    },
  	...
}
```

如上方式 即可在 **LWX ** 中解决了此种需求，大家也可以发挥想象随意扩展。

> 此处示例在源码中已经存在，可以直接查看源码



## 与web-view内页面交互（持续完善）

因小程序存在大小限制和发版审核机制，有时候我们需要嵌入H5页面来应对或者复用一些场景。

**LWX**为小程序与H5互相调用交互提供了一套解决方案：

### 快速跳转至H5页面

在 `app/util/toWeb` 中存在 `toWeb` 方法，只需要传入对应参数即可直接跳转至对应H5页面。

### 在H5中如何设置页面分享语

在引入wx-sdk并初始化完成的前提下

h5中执行如下方法即可

``` js
function postShareData() {
    const shareData = {
        title: '这是分享页面',
        path: '',
        pathType: 'miniPath', // 设置为 miniPath 时，path为小程序路径地址。将会分享小程序内的路径地址，不填path可设置为H5地址
        imageUrl: ''
    }
	wx.miniProgram.postMessage({data: {shareData}})
}
```



## 授权组件

为减少在wxml中重复书bind方法**LWX** 提供 `l-auth`授权组件使用步骤如下

此组件已经全局注册，直接引用即可

1. 引入组件

```html
<l-auth id="Auth"></l-auth>
```

2. 使用js调用 (获取手机号为例)

``` js
const auth = this.selectComponent('#Auth')

auth.show({
    openType: 'getPhoneNumber',
    content: '',
    subtitle: '',
    mask: '',
    confirmText: '',
    cancelText: '',
    showCancel: '',
    success: res => {
        console.log(res)
    },
    fail: e => {
        console.error(e)
    }
})
```

3. 参数解析

| code        | 名称               | 必填 | 默认  | 类型     | 备注                                                         |
| ----------- | ------------------ | ---- | ----- | -------- | ------------------------------------------------------------ |
| openType    | 唤起的授权类型     |      |       | String   | 对应 `button`的`openType` 仅支持[`getPhoneNumber`,`getUserInfo`] |
| content     | 弹出模态框的内容   | 否   |       | String   |                                                              |
| subtitle    | 弹出模态框的子内容 | 否   |       | String   |                                                              |
| mask        | 点击遮罩层允许关闭 | 否   | false | Boolean  |                                                              |
| confirmText | 确认按钮文字       | 否   | 确定  | String   |                                                              |
| cancelText  | 取消按钮文字       | 否   | 取消  | String   |                                                              |
| showCancel  | 是否显示取消按钮   | 否   | false | Boolean  |                                                              |
| success     | 授权成功的回调     |      |       | Function |                                                              |
| fail        | 授权失败的回调     |      |       | Function |                                                              |

## 自定义header组件

**LWX**内提供 `navigationStyle = "custom"` 时自定义header组件（已经为大家适配了iPhoneX系列的齐刘海）

此组件已经全局注册，直接引用即可

``` html
<l-header></l-header>
```

> 此组件只提供适配实现，其他自定义属性请按照自己业务自行定制

## modal组件

**LWX**内提供 自定义modal组件，用于 `l-auth`,也可用于直接引用

此组件已经全局注册，直接引用即可

```html
<l-modal></l-modal>
```

### 属性

| code              | 名称               | 必填 | 类型    | 默认  |
| ----------------- | ------------------ | ---- | ------- | ----- |
| show              | 显示隐藏           | 否   | Boolean | false |
| headerHide        | 是否隐藏头部       | 否   | Boolean | false |
| title             | 标题               | 否   | String  |       |
| backgroundOpacity | 遮罩层透明度       | 否   | String  | 0.4   |
| mask              | 点击遮罩层是否关闭 | 否   | Boolean | false |
| closeIcon         | 关闭按钮是否显示   | 否   | Boolean | true  |



## 其他

1. **LWX**在每个Page的Component的data中都注入了 `$ipx` 用于判断是否为ipx系列齐刘海手机，方便大家适配ipx系列齐刘海手机

2. 内置 `Day.js` 是一个轻量的处理时间和日期的 JavaScript 库，和 Moment.js 的 API 设计保持完全一样，

   [文档地址]: https://day.js.org/zh-CN/	"Day.js"

   util文件夹中内置 canvas 相关的4个方法，在只做海报时应该会有用到

## 最后

感谢大家的阅读和使用，大家对 **LWX**有什么改进意见或者想法可以联系我（QQ：975794403）进行交流，一起完善 **LWX**