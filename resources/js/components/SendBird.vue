<template>
    <div class="col-md-4">
        <h1>{{ maindHeader }}</h1>
        <h2>{{ headerText }}</h2>
        <h1 v-if="textArea.length > 0">입력중입니다...</h1>
        <div class="form-group">
            <textarea
                class="form-control"
                rows="8" cols="8"
                maxlength="130"
                v-model="textArea"
                required>
            </textarea>
        </div>
        <button class="btn btn-primary" @click="clcikEvent">
           send
        </button>
    </div>
</template>
<script>
    export default {
        name: 'SendBird',
        props: {
            headerText: {
                type: String,
                default: 'default String'
            }
        },
        data() {
            return {
                maindHeader: '',
                textArea: ''
            }
        },
        methods: {
            clcikEvent: function () {
                this.$utile.testUtile(this.textArea)
                this.textArea = ''
            }
        },
        created() {
            this.maindHeader = 'SendBird created'
        }
    }
</script>
