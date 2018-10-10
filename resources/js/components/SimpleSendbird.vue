<template>
    <div>
        <table id="chatArea">
            <tr>
                <td class="padding-20 text-right">
                    <test-video></test-video>
                </td>
                <td class="text-center">
                    <div id="chatContain">
                        <div id="headerArea" class="font-weight-bold">
                            <div class="font-weight-bold" @click="menuOpen">M</div>
                            <div></div>
                        </div>
                        <div id="msgArea">
                            <div>
                                <div class="w-100"
                                     v-for="(item, index) in channelMessages"
                                     :class="{'t-10':index !== 0, 'text-right':clientUserId === item._sender.userId,
                                     'text-left':clientUserId !== item._sender.userId}"
                                >
                                    <div  v-if="item.type !== 'in' && 'out'">
                                        <div class="dis-i-b">{{ item._sender.userId }} :</div>
                                        <div class="userMsg font-weight-bold dis-i-b"
                                             :class="{'b-y':clientUserId === item._sender.userId}">
                                            {{item.message}}
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div class="font-weight-bold text-center">
                                            ------{{ item._sender.userId }}님이 입장하셨습니다.------
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <input id="chatInput"
                                   v-model="inputMessage"
                                   @keyup.enter="enterEvent"
                            />
                            <button id="chatBtn" @click="enterEvent">전송</button>
                        </div>
                        <transition name="fade" mode="out-in">
                            <div id="menuContain" v-if="menuSwitch" @click="menuOpen">
                                <div id="backArea"></div>
                                <div id="menuArea">
                                    <div class="font-weight-bold">접속자</div>
                                    <div>
                                        <div v-for="(item, index) in channelUsers"
                                             :class="{'t-10':index !== 0}">
                                            <div class="font-weight-bold">{{ index+1 }}.</div>
                                            <div>{{ item.userId }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </transition>
                        <div id="spinnerArea" v-if="spinner">
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
import Sendbird from '../sendbirdChat';

export default {
    name: 'SimpleSendbird',
    props: {
        sendBirdAppKey: {
            type: String,
        },
        token: {
          type: String,
        },
        clientUserId: {
            type: String,
        },
        channelKey: {
            type: String,
        },
        isOpenChannel: {
            type: Boolean,
        },
    },
    data() {
        return {
            sendBird: {},
            menuSwitch: false,
            channelUsers: [],
            channelMessages: [],
            inputMessage: '',
            spinner: false,
            playTime: 0,
        };
    },
    methods: {
        enterEvent() {
            if (this.inputMessage.length <= 0) {
                return;
            }
            const date = new Date();
            const timestamp = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds();
            this.sendBird.getEnterChannel().sendUserMessage(this.inputMessage, timestamp, 'timestemp', (message, error) => {
                if (error) {
                    console.error(error);
                    return;
                }
                this.channelMessages.push(message);
                this.inputMessage = '';
            });
        },
        menuOpen() {
            this.menuSwitch = !this.menuSwitch;
            if (this.menuSwitch) {
                const participantListQuery = this.sendBird.getEnterChannel().createParticipantListQuery();
                participantListQuery.next((participantList, error) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    this.channelUsers = participantList;
                });
            }
        },
        scrollBottom(elementId) {
            const element = document.getElementById(elementId);
            element.scrollTop = element.scrollHeight;
        },
    },
    created() {
        this.spinner = true;
        this.sendBird = new Sendbird(
            this.sendBirdAppKey,
            this.token,
            this.isOpenChannel,
            this.channelKey,
            this.clientUserId,
            (messagesCallback) => {
                this.channelMessages = messagesCallback.reverse();
                this.spinner = false;
            },
            (messageCallback) => {
                this.channelMessages.push(messageCallback);
            },
            (errorCallback) => {
                console.error(errorCallback);
            },
        );
    },
    updated() {
        this.scrollBottom('msgArea');
    }
};
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
        position: absolute;
    }

    #backArea {
        width: 300px;
        height: 614px;
        position: absolute;
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
    .padding-20 {
        background-color: #c1f5da;
    }
    /*spinner*/
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
