<template>
    <div id="creatTop">
        <div id="creatPopupArea"></div>
        <table class="creatArea">
            <tr>
                <td class="text-center">
                    <div id="poupArae">
                        <h1>{{ $store.getters.getPopupTitle }}</h1>
                        <input v-model="chname" class="input-area-1 text-center" placeholder="채널 name"/>
                        <div class="btnArea">
                            <div class="btn-type-1 b-c-t-1" @click="btn2">확인</div>
                            <div class="btn-type-1 b-c-t-2" @click="btn1">취소</div>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: "CreatPopup",
        props: {
            sbUtile: {
                type: Object
            }
        },
        data() {
            return {
                chname: ''
            }
        },
        methods: {
            btn1: function () {
                this.$store.commit('createPopup', false)
            },
            btn2: function () {
                console.log(this.sbUtile.OpenChannel.createChannel)
                const that = this.$store
                this.sbUtile.OpenChannel.createChannel(this.chname, null, null, function (createdChannel, error) {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    // onCreated
                    console.log(createdChannel);
                    that.commit('createPopup', false)
                });
            }
        }
    }
</script>

<style scoped>
    #creatTop {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
    }

    #creatPopupArea {
        width: 100%;
        height: 100%;
        top: 0;
        background-color: #000000;
        opacity: 0.5;
        position: absolute;
    }

    .creatArea {
        width: 100%;
        height: 100%;
        position: absolute;
    }

    #poupArae {
        width: 50%;
        height: 150px;
        background-color: #ffffff;
        display: inline-block;
        padding: 10px;
    }

    .input-area-1 {
        width: 100%;
        height: 35px;
    }

    .input-area-1::placeholder {
        text-align: center;
    }

    .btnArea {
        margin-top: 10px;
        width: 100%;
        height: 35px;
    }

    .btn-type-1 {
        width: 70px;
        height: 35px;
        float: right;
        border-radius: 30px;
        margin-left: 10px;
    }

    .b-c-t-1 {
        background-color: #1b4b72;
        color: #ffffff;
        line-height: 35px;

    }

    .b-c-t-2 {
        border: 1px solid #1b4b72;
        color: #000000;
        line-height: 35px;
    }
</style>
