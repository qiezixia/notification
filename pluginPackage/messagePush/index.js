
// 导入组件，组件必须声明 name
import MessagePush from './src/main.vue'

// 为组件添加 install 方法，用于按需引入
MessagePush.install = function (Vue) {
    Vue.component(MessagePush.name, MessagePush)
}

export default MessagePush