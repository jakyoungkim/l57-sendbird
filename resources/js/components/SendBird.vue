<template>
    <div>
        <h1>{{msg}}</h1>
    </div>
</template>

<script>
    export default {
        name: "SendBird",
        data () {
            return {
                msg: "SENDBIRD TEST"
            }
        },
        created: function () {
            alert("test")
        }
    }
</script>

<style scoped>
</style>
