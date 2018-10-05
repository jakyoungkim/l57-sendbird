import ImportSendbird from 'sendbird';
import _ from 'lodash';

class sendbirdClass {
    constructor(sendBirdAppKey, isOpenChannel, channelKey, clientUserId, getChannelMsg, msgUpdate) {
        this.sendBirdAppKey = sendBirdAppKey;
        this.isOpenChannel = isOpenChannel;
        this.channelKey = channelKey;
        this.clientUserId = clientUserId;
        this.getChannelMsg = getChannelMsg;
        this.msgUpdate = msgUpdate;
        this.enterChannel = {};
        this.newSendBird = new ImportSendbird({
            appId: this.sendBirdAppKey,
        });
        this.createChannel();
    }

    createChannel() {
        this.newSendBird.connect(this.clientUserId, (user, error) => {
            if (error) {
                console.log(error);
            } else {
            }
        });
        const openChannelList = this.newSendBird.OpenChannel.createOpenChannelListQuery();
        openChannelList.next((channels, error) => {
            if (error) {
                console.log(error);
                return;
            }
            const findChannel = _.find(channels, { name: this.channelKey });
            // openChannel 있을때
            if (findChannel) {
                this.openChannelEnter(findChannel);
            } else {
                // openChannel 없을때
                this.openChannelAdd();
            }
        });
    }

    openChannelEnter(channelSelect) {
        this.enterChannel = channelSelect;
        this.newSendBird.OpenChannel.getChannel(channelSelect.url, (channel, error) => {
            if (error) {
                console.error(error);
                return;
            }
            channel.enter((response, error) => {
                if (error) {
                    console.error(error);
                }
            });
            const messageListQuery = channel.createPreviousMessageListQuery();
            messageListQuery.load(30, true, (messageList, error) => {
                if (error) {
                    console.error(error);
                    return;
                }
                this.getChannelMsg.call(this, messageList);
            });
        });

        /**
         * event handler
         * */
        this.addEventHandler();
    }

    openChannelAdd() {
        this.newSendBird.OpenChannel.createChannel(this.channelKey, null, null, (createdChannel, error) => {
            if (error) {
                console.error(error);
                return;
            }
            this.openChannelEnter(createdChannel);
        });
    }

    addEventHandler() {
        const ChannelHandler = new this.newSendBird.ChannelHandler();
        ChannelHandler.onMessageReceived = (channel, message) => {
            this.msgUpdate.call(this, message);
        };
        ChannelHandler.onUserEntered = (openChannel, user) => {
            user.type = 'in';
            user._sender = {
                userId: user.userId,
            };
            this.msgUpdate.call(this, user);
        };
        ChannelHandler.onUserExited = (openChannel, user) => {
            console.log(user);
        };
        const date = new Date();
        const handlerKey = this.clientUserId + date.getHours() + date.getMinutes() + date.getSeconds();
        this.newSendBird.addChannelHandler(handlerKey, ChannelHandler);
    }

    getEnterChannel() {
        return this.enterChannel;
    }
}

export default sendbirdClass;
