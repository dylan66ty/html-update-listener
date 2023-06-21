## Introduction
#### 痛点：
前端部署前，用户已经打开了页面，部署后用户不知道网页重新部署了，跳转页面的时候有时候script src的hash变了导致报错跳不过去，严重影响用户体验。
#### 解决方案：
- 使用webSocket 跟后端进行实时通讯，前端部署完成，后端通过socket推送消息前端。前端接收到信息后，做些事...
- 接口轮询
- EvnentSource

**以上方案需要后端配合，成本较高**

### 最终方案：
采用`fetch('/')`轮询请求html,匹配页面script src 的值去判断，每次打包都会生成唯一的hash值，只要轮询去判断不一样了，那一定是重新部署了.

##### 因此诞生了 `html-update-listener`

## Installation

```shell
pnpm add html-update-listener
```

## Usage
```ts
// main.ts

import HtmlUpdateListener from 'html-update-listener'

// 参数每隔多长时间检测一次当前html是否发生更新了。默认1000ms。这里传了5000，也就是每隔5000ms检测一次。
const updater = new HtmlUpdateListener(5000)


// 注意：检测到html更新会一直触发此回调，你可以调用 controller.destroy()来销毁此回调。
updater.on('update', (controller) => {
   // 你可以在这里做些事！！！
  console.log('html update....')
 
})

// 这种写法只会在html发生改变后只触发一次。
updater.once('update', () => {
  console.log('html update once....')
  // 你可以在这里做些事！！！
})
  
```
