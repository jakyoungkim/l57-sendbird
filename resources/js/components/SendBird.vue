<template>
    <div id="sendBirdContain">
        <table class="w-100">
            <tr>
                <td class="text-center">
                    <div id="userInfoArea" class="d-inline-block">
                        <div class="w-100">
                            <input class="input-area-1 float-left" v-model="userId" placeholder="아이디 or Email 입력"/>
                            <div class="area-1 d-inline-block font-color-fff
                            background-761 float-right line-h-50" data-font='15'
                            @click="connectBtn">확인</div>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
    export default {
        name: 'SendBird',
        props: {
            headerText: {
                type: String,
                default: 'default String'
            },
            old: {
                type: Number
            },
            item: {
                type: Object
            }
        },
        data() {
            return {
                sbUtile: {},
                userId: ''
            }
        },
        methods: {
            connectBtn: function () {
                this.sbUtile.connect(this.userId, function(user, error) {
                    console.log(user, error)
                });
            }
        },
        created() {
            let sendBirdUtile = this.$sendbird
            let sb = new sendBirdUtile({
                appId: '076F2CD7-A154-4522-8415-112D6CDB2248'
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

    #userInfoArea {
        width: 80%;
        height: 300px;
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
