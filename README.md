# Installation

```shell
pnpm add html-updater-listener
```

# Get started
```ts
import HtmlUpdateListener from 'html-update-listener'

// 参数每隔多长时间检测一次当前html是否发生更新了。默认1000ms。这里传了5000，也就是每隔5000ms检测一次。
const updater = new HtmlUpdateListener(5000)


// 检测到html更新会一直触发此回调，你可以调用 controller.destroy()来销毁此回调。
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
