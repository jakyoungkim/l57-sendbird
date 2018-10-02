import SendBird from 'sendbird'
import store from '../store'

export default {
    sb: () => {
        return {
            utile: SendBird,
            reset: (utile, key) => {
                return new utile({
                    appId: key
                })
            },
            connetion: (utile, user) => {
                utile.connect(user, (user, error) => {
                    if (error) {
                        console.log(error)
                    } else {
                    }
                })
            },
            openChannelList: (utile) => {
                store.commit('spinner', store.getters.getSpinner + 1)
                let openChannelList = utile.OpenChannel.createOpenChannelListQuery()
                return new Promise((resolve, reject) => {
                    openChannelList.next((channels, error) => {
                        if (error) {
                            console.log(error)
                            reject(error)
                            return
                        }
                        resolve(channels)
                        store.commit('spinner', store.getters.getSpinner - 1)
                    })
                })
            },
            openChannelEnter: (utile, channel) => {
                let that = this
                store.commit('spinner', store.getters.getSpinner + 1)
                return new Promise((resolve, reject) => {
                    utile.OpenChannel.getChannel(channel.url, (channel, error) => {
                        if (error) {
                            console.error(error);
                            return;
                        }
                        channel.enter((response, error) => {
                            if (error) {
                                console.error(error)
                                return
                            }
                        })
                        let messageListQuery = channel.createPreviousMessageListQuery()
                        messageListQuery.load(30, true, (messageList, error) => {
                            if (error) {
                                console.error(error)
                                return
                            }
                            resolve({
                                msg: messageList.reverse(),
                                channel: channel
                            })
                            store.commit('spinner', store.getters.getSpinner - 1)
                        })
                    })
                    const ChannelHandler = new utile.ChannelHandler()
                    ChannelHandler.onMessageReceived = function (channel, message) {
                        store.getters.getChannelMsg.push(message)
                    }
                    ChannelHandler.onUserEntered = function (openChannel, user) {
                        user['type'] = 'in'
                        user['_sender'] = {
                            userId: ''
                        }
                        store.getters.getChannelMsg.push(user)
                    }
                    ChannelHandler.onUserExited = function (openChannel, user) {
                        user['type'] = 'out'
                        user['_sender'] = {
                            userId: ''
                        }
                        user['type'] = 'out'
                    }
                    utile.addChannelHandler(this.a.devUser().user, ChannelHandler)
                })
            },
            openChannelAdd: (utile, channel) => {
                store.commit('spinner', store.getters.getSpinner + 1)
                return new Promise((resolve, reject) => {
                    utile.OpenChannel.createChannel(channel, null, null, function (createdChannel, error) {
                        if (error) {
                            console.error(error);
                            return
                        }
                        return resolve(createdChannel)
                        store.commit('spinner', store.getters.getSpinner - 1)
                    })
                })
            },
        }
    },
    devUser: () => {
        const date = new Date()
        const devUser = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
        return {
            user: "dev:" + devUser,
            index: devUser
        }
    },
    objectListSearch: (list, object) => {
        let result = false
        let searchItem = 0
        list.forEach((item, index, arr) => {
            if (item[object.key] === object.value) {
                result = true
                searchItem = arr[index]
            }
        })
        return {
            result: result,
            searchItem: searchItem

        }
    },
    gotoBottom: (id) => {
        let element = document.getElementById(id);
        element.scrollTop = element.scrollHeight
    }
}
