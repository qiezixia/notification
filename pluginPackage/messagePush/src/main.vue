<template>
    <div class="mesage-push">
        <div class="iconfont wain" @mouseenter="mouseenter" @mouseleave="leave">&#xe68a;
            <div class="number">{{messageNum}}</div>
            <transition name="list-fade">
                <div class="listBox" v-show="showMessageList" @mouseenter="mouseenter" @mouseleave="leave">
                    <ul class="list">
                        <li class="item" v-for="(item,index) in messsageList" :key="index" @click="readMe(item)">
                            <div class="msg-content">{{item.text}}</div>
                            <div class="time">{{item.time}}</div>
                        </li>
                    </ul>  
                </div>
            </transition>
        </div>
        <transition name="footer-fade">
            <div class="footerWarnList" v-if="showPush">
                <div class="closeAll" @click="close">忽略全部</div>
                <div class="footerWarnItem" v-for="(item, index) in pushList" :key="index">
                    <div class="title">{{item.text}}</div>
                    <div class="close iconfont" @click="deleCurrent(index)">&#xe621;</div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'message-push',
    data() {
        return {
            showMessageList: false,
            showPush: false,
            nim: null,
            sessionsList: [], // 会话列表,
            messsageList: [],
            pushList: [],
            isReset: false
        }
    },
    created() {
        this.initNimSDK()
    },
    methods: {
        readMe(item) {
            window.console.log(item)
            let sessionId = item.scene + '-' + item.from
            this.messsageList.length = 0
            this.pushList.length = 0
            this.isReset = true
            this.nim.setCurrSession(sessionId)
            this.nim.resetCurrSession();
        },
        deleCurrent(index) {
            this.pushList.splice(index, 1)
        },
        //鼠标移入事件
        mouseenter() {
            this.showMessageList = true
        },
        leave() {
            this.showMessageList = false
        },
        close() {
            this.showPush = false
            this.pushList.length = 0
        },
        initNimSDK () {
            window.min = this.nim = window.SDK.NIM.getInstance({
            // debug: true,
            appKey: '4b024821f348f78566c75dea9b0b285e',
            account: '1f7086e015e6eaad20cdc911ce025587',
            token: 'db2f198963e49a478cda900fbe2e5a6f',
            db: true, // 若不要开启数据库请设置false。SDK默认为true。
            // privateConf: {}, // 私有化部署方案所需的配置
            onconnect: onConnect,
            onwillreconnect: onWillReconnect,
            ondisconnect: onDisconnect,
            onerror: function () {
            },
            onsessions: this.onSessions,
            onupdatesession: this.onUpdateSession
            })
            function onConnect () {
                window.console.log('连接成功')
            }
            function onWillReconnect () {
            // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
            }
            function onDisconnect (error) {
            // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
                if (error) {
                    switch (error.code) {
                    // 账号或者密码错误, 请跳转到登录页面并提示错误
                        case 302:
                        break
                        // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
                        case 417:
                        break
                        // 被踢, 请提示错误后跳转到登录页面
                        case 'kicked':
                        break
                        default:
                        break
                    }
                }
            }
        },
        async onSessions (sessions) {
            this.sessionsList = await this.nim.mergeSessions(this.sessionsList, sessions)
            this.getMessage() 
        },
        onUpdateSession (sessions) {
            window.console.log(sessions)
            this.sessionsList = this.nim.mergeSessions(this.sessionsList, sessions)
            if (!this.isReset) {
                this.pushList.push(sessions.lastMsg)
                this.messsageList.push(sessions.lastMsg)
                this.showPush = true
            } else {
                this.getMessage() 
            }
            this.isReset = false
        },
        getMessage () {
            let that = this
            this.sessionsList.map(item => {
                if (item.unread > 0) {
                    this.nim.getLocalMsgs({
                    sessionId: item.id,
                    limit: item.unread,
                    // eslint-disable-next-line
                    done: (error, obj) => {
                        that.messsageList = that.messsageList.concat(obj.msgs)
                        that.pushList = that.pushList.concat(obj.msgs)
                        if (that.pushList.length) {
                            this.showPush = true
                        }
                    }
                })
                }
            })
        }
    },
    computed: {
        messageNum () {
            let unread = 0
            this.sessionsList.map(item => {
                unread += item.unread
            })         
            return unread
        }
    }
}
</script>

<style scoped>
.wain{
    position: relative;
    font-size: 20px;
    margin-left: 300px;
    cursor: pointer;
    width: 30px;
}
.number{
    position: absolute;
    top: -5px;
    left: 10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    line-height: 20px;
    text-align: center;
    background: red;
    color: #fff;
    font-size: 10px;
}
.list-fade-enter-active, .list-fade-leave-active {
    transition: all 0.3s linear;
  }
  .list-fade-enter, .list-fade-leave {
    transform: translate3d(0, -100%, 0);
  }
  .list-fade-leave-to{
    transform: translateY(-100%);
  }
.listBox{
    position: absolute;
    top: 24px;
    width: 300px;
    max-height: 500px;
    overflow-y: scroll;
    border: 1px solid #999;
    border-radius: 4px;
    left: -250px;
    transition: all 2s;
    z-index: 9999;
}
.list{
    list-style: none;
    margin: 0;
    padding: 0;
}
.item{
    padding: 20px;
    border-bottom: 1px solid #999;
}
.item:last-child{
    border-bottom: 0;
}
.msg-content{
    font-size: 14px;
    color: #222;
}
.time{
    font-size: 12px;
    color: #999;
    margin-top: 12px;
}
.footerWarnList{
    position: fixed;
    width: 300px;
    max-height: 400px;
    overflow-y: auto;
    right: 20px;
    bottom: 30px;
    border: 1px solid #999;
    padding: 20px 10px;
}
.closeAll{
    width: 100%;
    text-align: right;
    color: steelblue;
    cursor: pointer;
}
.footerWarnItem{
    display: flex;
    align-items: center;
    margin: 20px 0;
    font-size: 14px;
}
.title{
    flex: 1;
    padding-right: 10px;
}
.close{
    flex: 0 0 30px;
    width: 30px;
    text-align: right;
    color: #999;
}
.footer-fade-enter-active, .footer-fade-leave-active {
    transition: all 0.3s linear;
  }
  .footer-fade-enter, .footer-fade-leave {
    transform: translate3d(0, 100%, 0);
  }
  .footer-fade-leave-to{
    transform: translateY(100%);
  }

</style>