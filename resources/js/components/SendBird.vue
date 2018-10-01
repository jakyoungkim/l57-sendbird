<template>
    <div id="sendBirdContain">
        <table class="w-100">
            <tr>
                <td class="text-center">
                    <div id="userInfoArea" class="d-inline-block">
                        <div v-if="!viewData.menu" class="w-100 float-left">
                            <input class="input-area-1 float-left" v-model="userId" placeholder="아이디 or Email 입력"/>
                            <div class="area-1 d-inline-block font-color-fff
                            background-761 float-right line-h-50" data-font='15'
                                 @click="connectBtn">확인
                            </div>
                        </div>
                        <div v-if="viewData.menu" class="w-h-100">
                            <div class="area-2 float-left">
                                <table>
                                    <tr>
                                        <td @click="openChannelList">open 채널</td>
                                        <td @click="openChannelAdd">+</td>
                                    </tr>
                                    <tr>
                                        <td @click="groupChannelList">group 채널</td>
                                        <td @click="groupChannelAdd">+</td>
                                    </tr>
                                </table>
                            </div>
                            <div class="area-3 float-left">
                                <div v-if="!viewData.chat">
                                    <div class="listArea"
                                         v-for="(item, index) in $store.getters.getOpenChannelListItem "
                                         @click="openChannelEnter(index)"
                                         :class="{'top-10': index !== 0}">#{{ item.name }}
                                    </div>
                                </div>
                                <div v-else class="w-h-100">
                                    <div class="area-4">#{{ $store.getters.getSetOpenChannel.name }}</div>
                                    <div class="area-5">
                                        <div class="area-7" v-for="(item, index) in totalMsg"
                                             :class="{'my-color': item.user === 'me' }">
                                            {{item.userId}}: {{ item.message }}
                                        </div>
                                    </div>
                                    <input class="area-6" placeholder="입력..." @keydown.enter="enterEvent"
                                           v-model="inputData"></input>
                                    <div class="area-8" @click="openChannelExit">나가기</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
        <creat-popup v-if="$store.getters.getCreatePopup" :sbUtile="sbUtile"></creat-popup>
    </div>
</template>
<script>
    export default {
        name: 'SendBird',
        props: {
            appKey: {
                type: String
            }
        },
        data() {
            return {
                sbUtile: {},
                handler: {},
                userId: 'jkkim',
                viewData: {
                    menu: false,
                    channelMenu: true,
                    chat: false
                },
                popupTitle: '',
                inputData: '',
                totalMsg: [],
                openChannelItem: {}
            }
        },
        methods: {
            connectBtn: function () {
                const that = this.viewData
                this.sbUtile.connect(this.userId, function (user, error) {
                    if (error) {
                        console.log(error)
                    } else {
                        that.menu = true
                    }
                });
            },
            openChannelList: function () {
                let that = this.$store
                let openChannelList = this.sbUtile.OpenChannel.createOpenChannelListQuery();
                openChannelList.next(function (channels, error) {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    that.commit('openChannelListItem', channels)
                });
            },
            openChannelEnter: function (index) {
                const thatStore = this.$store
                const thattTtalMsg = this.totalMsg
                const openListItem = thatStore.getters.getOpenChannelListItem
                const indexItem = openListItem[index]
                //open channel item
                this.openChannelItem = indexItem
                const indexUrl = indexItem.url
                const thatViewData = this.viewData
                const thatHandler = this.createConnectionHandler
                this.sbUtile.OpenChannel.getChannel(indexUrl, function (channel, error) {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    channel.enter(function (response, error) {
                        if (error) {
                            console.error(error)
                            return
                        }
                        thatViewData.chat = true
                        thatStore.commit("setOpenChannel", channel)
                    });
                    let messageListQuery = channel.createPreviousMessageListQuery()
                    messageListQuery.load(30, true, function (messageList, error) {
                        if (error) {
                            console.error(error)
                            return
                        }
                        messageList.forEach(function (data) {
                            thattTtalMsg.unshift({
                                userId: data._sender.userId,
                                message: data.message
                            })
                        })
                    })
                });
                /**
                 * Handler
                 * */
                thatHandler('123123qw')
            },
            openChannelExit: function () {
                const that = this
                console.log("exit", this.openChannelItem)
                const indexUrl = this.openChannelItem.url
                this.sbUtile.OpenChannel.getChannel(indexUrl, function (channel, error) {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    channel.exit(function (response, error) {
                        if (error) {
                            console.error(error);
                            return;
                        }
                        that.viewData.chat = false
                    });
                })
            },
            openChannelAdd: function () {
                this.$store.commit('popupTitle', 'open 채널')
                this.popupOpen()
            },
            groupChannelAdd: function () {
                this.$store.commit('popupTitle', 'group 채널')
                this.popupOpen()
            },
            groupChannelList: function () {
                let openChannelList = this.sbUtile.OpenChannel.createOpenChannelListQuery();
                openChannelList.next(function (channels, error) {
                    if (error) {
                        console.log(error);
                        return;
                    }
                });
            },
            popupOpen: function () {
                this.$store.commit('createPopup', true)
            },
            enterEvent: function () {
                const thattTtalMsg = this.totalMsg
                const openChannel = this.$store.getters.getSetOpenChannel
                openChannel.sendUserMessage(this.inputData, null, null, function (message, error) {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    console.log(message)
                    thattTtalMsg.push({
                        userId: message._sender.userId,
                        message: message.message,
                        user: 'me'
                    })
                });
            },
            createConnectionHandler: function (key) {
                const thattTtalMsg = this.totalMsg
                const ChannelHandler = new this.sbUtile.ChannelHandler();
                ChannelHandler.onMessageReceived = function (channel, message) {
                    console.log(channel)
                    console.log(message)
                    thattTtalMsg.push({
                        userId: message._sender.userId,
                        message: message.message
                    })
                };
                this.sbUtile.addChannelHandler(key, ChannelHandler);
            }
        },
        created() {
            let sendBirdUtile = this.$sendbird
            let sb = new sendBirdUtile({
                appId: this.appKey
            })
            this.sbUtile = sb
        }
    }
</script>
<style scoped>
    #sendBirdContain {
        width: 100%;
    }

    .w-100 {
        width: 100%;
    }

    .w-h-100 {
        width: 100%;
        height: 100%;
    }

    #userInfoArea {
        width: 80%;
        height: 700px;
        background-color: #6b8ace;
        padding: 20px;
    }

    .input-area-1 {
        width: 82%;
        height: 50px;
    }

    .area-1 {
        width: 15%;
        height: 50px;
    }

    .area-2 {
        width: 20%;
        height: 100%;
        background-color: #c2caef;
        padding: 10px;
    }

    .area-3 {
        width: 78%;
        height: 100%;
        background-color: #c2caef;
        margin-left: 2%;
        padding: 10px;
        overflow: scroll;
    }

    .area-4 {
        width: 100%;
        height: 45px;
        background-color: #ffffff;
        text-align: center;
        font-size: 25px;
    }

    .area-5 {
        width: 100%;
        height: 450px;
        background-color: #ffffff;
        text-align: center;
        font-size: 20px;
        margin-top: 20px;
        padding: 15px;
        overflow: scroll;
    }

    .area-6 {
        width: 100%;
        height: 45px;
        background-color: #ffffff;
        border: 0;
        padding: 0;
        margin-top: 10px;
        text-indent: 15px;
    }

    .area-7 {
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: left;
    }

    .area-8 {
        width: 100px;
        height: 25px;
        float: right;
        line-height: 25px;
        background-color: #1b1e21;
        margin-top: 10px;
        border-radius: 10px;
        color: #ffffff;
    }

    .background-761 {
        background-color: #761b18;
    }

    [data-font='15'] {
        font-size: 15px;
    }

    .line-h-50 {
        line-height: 50px;
    }

    .listArea {
        width: 100%;
        height: 45px;
        background-color: #1b4b72;
        color: #ffffff;
        text-align: center;
        line-height: 45px;
        font-size: 20px;
    }

    .top-10 {
        margin-top: 10px;
    }
</style>
