<template>
    <div>
        <table id="chatArea">
            <tr>
                <td class="w-h-100 text-center">
                    <div id="chatContain">
                        <div class="font-weight-bold">{{ title }}</div>
                        <div id="msgArea">
                            <div>
                                <div class="w-100" v-for="(item, index) in $store.getters.getChannelMsg"
                                     :class="{'t-10':index !== 0, 'text-right':my === item._sender.userId,
                                'text-left':my !== item._sender.userId}">
                                    <div class="dis-i-b">{{ item._sender.userId }} :</div>
                                    <div class="userMsg font-weight-bold dis-i-b"
                                         :class="{'b-y':my === item._sender.userId}">{{item.message}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <input id="chatInput" @keydown.enter="enterEvent"
                                   v-model="inputData"/>
                            <button id="chatBtn" @click="enterEvent">전송</button>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: "SimpleSendbird",
        props: {
            appKey: {
                type: String
            }
        },
        data() {
            return {
                my: '',
                sb: {},
                channel: {},
                title: '',
                msgList: [],
                inputData: ''
            }
        },
        methods: {
            enterEvent: function () {
                let that = this
                if (this.inputData.length <= 0) return
                this.channel.sendUserMessage(this.inputData, null, null, function (message, error) {
                    if (error) {
                        console.error(error)
                        return;
                    }
                    that.$store.getters.getChannelMsg.push(message)
                    that.inputData = ""
                });
            }
        },
        created() {
            /**
             * reset
             * */
            let utiles = this.$utile
            let sb = utiles.sb()
            this.sb = sb.reset(sb.utile, this.appKey)
            /**
             * connetion
             **/
                //임시 User 생성
            const devUser = this.$utile.devUser()
            this.my = devUser.user
            sb.connetion(this.sb, devUser.user)
            /**
             * Channel add or Enter
             * */
            sb.openChannelList(this.sb).then((value) => {
                const channelName = '채널10'
                this.title = channelName
                const result = utiles.objectListSearch(value, {
                    key: 'name',
                    value: channelName
                })
                console.log(result.result)
                if (result.result) {
                    //접속
                    sb.openChannelEnter(this.sb, result.searchItem).then((value) => {
                        this.$store.commit("channelMsg", value.msg)
                        this.channel = value.channel
                    })
                } else {
                    //채널 생성 및 접속
                    sb.openChannelAdd(this.sb, channelName).then((result) => {
                        sb.openChannelEnter(this.sb, result).then((value) => {
                            this.$store.commit("channelMsg", value.msg)
                            this.channel = value.channel
                        })
                    })
                }
            })
        },
        updated() {
            this.$utile.gotoBottom("msgArea")
        }

    }
</script>

<style scoped>
    .w-h-100 {
        width: 100%;
    }

    #chatArea {
        width: 100%;
    }

    #chatContain {
        width: 300px;
        height: 600px;
        background-color: #c1f5da;
        display: inline-block;
    }

    #chatContain > div:nth-child(1) {
        padding: 5px 0;
        height: 47px;
        border-bottom: 1px solid #c8c8c8;
        line-height: 47px;
        font-size: 18px;
    }

    #chatContain > div:nth-child(2) {
        height: 520px;
        padding: 10px;
        overflow: scroll;
    }

    #chatContain > div:nth-child(2)::-webkit-scrollbar {

        display: none;

    }

    #chatContain > div:nth-child(3) {
        width: 100%;
        height: 47px;
        border: none;
        background-color: #e8e7e7;
        padding: 5px 7px;
    }

    #chatInput {
        width: 215px;
        height: 100%;
        border: none;
        float: left;
        text-indent: 10px;
    }

    #chatBtn {
        width: 65px;
        height: 100%;
        float: right;
    }

    .userMsg {
        background-color: #ffffff;
        border-radius: 4px;
        padding: 4px;
        margin-left: 5px;
        max-width: 178px;
        text-align: left;
        word-wrap: break-word
    }

    .t-10 {
        margin-top: 10px;
    }

    .b-y {
        background-color: #ffe817;
    }

    .dis-i-b {
        display: inline-block;
    }
</style>
