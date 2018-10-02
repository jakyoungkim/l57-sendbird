<template>
    <div>
        <table id="chatArea">
            <tr>
                <td class="w-h-100 text-center">
                    <div id="chatContain">
                        <div id="headerArea" class="font-weight-bold">
                            <div @click="menuOpen" class="font-weight-bold">M</div>
                            <div>{{ title }}</div>
                        </div>
                        <div id="msgArea">
                            <div>
                                <div class="w-100" v-for="(item, index) in $store.getters.getChannelMsg"
                                     :class="{'t-10':index !== 0, 'text-right':my === item._sender.userId,
                                     'text-left':my !== item._sender.userId}">
                                    <div v-if="item.type !== 'in' && 'out'">
                                        <div class="dis-i-b">{{ item._sender.userId }} :</div>
                                        <div class="userMsg font-weight-bold dis-i-b"
                                             :class="{'b-y':my === item._sender.userId}">{{item.message}}
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div class="font-weight-bold text-center">------{{item.userId}}
                                            <span v-if="item.type === 'in'">입장하셨습니다.</span>
                                            <span v-else>퇴장하셨습니다.</span>------
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <input id="chatInput" @keydown.enter="enterEvent"
                                   v-model="inputData"/>
                            <button id="chatBtn" @click="enterEvent">전송</button>
                        </div>
                        <transition name="fade" mode="out-in">
                            <div id="menuContain" v-if="menu">
                                <div id="backArea"></div>
                                <div id="menuArea" @click="menuOpen">
                                    <div class="font-weight-bold">접속자</div>
                                    <div>
                                        <div v-for="(item, index) in channelUserList"
                                             :class="{'t-10':index !== 0}">
                                            <div class="font-weight-bold">{{ index+1 }}.</div>
                                            <div>{{ item.userId }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </transition>
                        <div id="spinnerArea" v-if="$store.getters.getSpinner !== 0">
                            <div></div>
                            <table>
                                <tr>
                                    <td>
                                        <div class="lds-ring">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
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
                inputData: '',
                menu: false,
                channelUserList: []
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
                })
            },
            menuOpen: function () {
                let that = this
                this.menu = !this.menu
                if (this.menu) {
                    let participantListQuery = that.channel.createParticipantListQuery();
                    participantListQuery.next(function (participantList, error) {
                        if (error) {
                            console.error(error)
                            return
                        }
                        that.channelUserList = participantList
                    })
                }
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
            // this.my = '123123qw'
            // sb.connetion(this.sb, '123123qw')
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
        position: relative;
        width: 300px;
        background-color: #c1f5da;
        display: inline-block;
    }

    #chatContain > div:nth-child(1) {
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
        border: none;
        background-color: #1b4b72;
        color: #ffffff;
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

    #headerArea > div:nth-child(1) {
        position: absolute;
        width: 47px;
        height: 47px;
        background-color: #9cb7a9;
    }

    #headerArea > div:nth-child(2) {
        width: 100%;
        height: 47px;
        line-height: 47px;
    }

    #menuContain {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
    }
    #menuArea {
        width: 255px;
        height: 614px;
        background-color: #9cb7a9;
        position: fixed;
        z-index: 100;
    }

    #backArea {
        width: 300px;
        height: 614px;
        position: fixed;
        z-index: 10;
        background-color: #ffffff;
        opacity: 0.5;
    }

    #menuArea > div:nth-child(1) {
        width: 100%;
        height: 47px;
        line-height: 47px;
        font-size: 17px;
        background-color: #6c8e7c;
    }

    #menuArea > div:nth-child(2) {
        width: 100%;
        padding: 10px;
        height: 500px;
        overflow: scroll;
    }

    #menuArea > div:nth-child(2) > div:nth-child(n) {
        width: 100%;
        text-align: left;
    }

    #menuArea > div:nth-child(2) > div:nth-child(n) > div:nth-child(n) {
        display: inline-block;
    }

    #menuArea > div:nth-child(2) > div:nth-child(n) > div:nth-child(2n) {
        display: inline-block;
        background-color: #c8c8c8;
        color: #ffffff;
        border-radius: 10px;
        padding: 5px;
    }

    #menuArea > div:nth-child(2)::-webkit-scrollbar {
        display: none;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    #spinnerArea {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
    }

    #spinnerArea > div:nth-child(1) {
        width: 100%;
        height: 100%;
        opacity: 0.5;
        background-color: #000000;
    }

    #spinnerArea > table:nth-child(2) {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
    }

    .lds-ring {
        display: inline-block;
        position: relative;
        width: 64px;
        height: 64px;
    }

    .lds-ring div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 51px;
        height: 51px;
        margin: 6px;
        border: 6px solid #fff;
        border-radius: 50%;
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: #fff transparent transparent transparent;
    }

    .lds-ring div:nth-child(1) {
        animation-delay: -0.45s;
    }

    .lds-ring div:nth-child(2) {
        animation-delay: -0.3s;
    }

    .lds-ring div:nth-child(3) {
        animation-delay: -0.15s;
    }

    @keyframes lds-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
