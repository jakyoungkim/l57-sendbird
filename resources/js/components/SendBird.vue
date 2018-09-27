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
                            @click="connectBtn">확인</div>
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
                                        <td>+</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
        <creat-popup v-if="$store.getters.getCreatePopup" :title="'test'"></creat-popup>
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
                userId: 'jkkim',
                viewData: {
                    menu: false
                },
                popupTitle: '',
            }
        },
        methods: {
            connectBtn: function () {
                const that = this.viewData
                this.sbUtile.connect(this.userId, function(user, error) {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log(user)
                        that.menu = true
                    }
                });
            },
            openChannelList: function () {
                let openChannelList = this.sbUtile.OpenChannel.createOpenChannelListQuery();
                openChannelList.next(function (channels, error) {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    console.log(channels);
                });
            },
            openChannelAdd: function () {
                this.$store.commit('popupTitle', 'open 채널')
                this.popupOpen()
            },
            groupChannelList: function () {
                let openChannelList = this.sbUtile.OpenChannel.createOpenChannelListQuery();
                openChannelList.next(function (channels, error) {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    console.log(channels);
                });
            },
            popupOpen: function () {
                this.$store.commit('createPopup', true)
            }
        },
        created() {
            let sendBirdUtile = this.$sendbird
            let sb = new sendBirdUtile({
                appId: this.appKey
            })
            this.sbUtile = sb;
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
        padding: 20px 10px;
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
        width: 100%;
        height: 35px;
        color: #000000;
        line-height: 35px;
    }
    .background-761 {
        background-color: #761b18;
    }

    [data-font='15'] {
        font-size: 15px;
    }
    .font-color-fff {
        color: #ffffff;
    }
    .line-h-50 {
        line-height: 50px;
    }
</style>
