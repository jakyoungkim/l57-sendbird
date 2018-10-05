import ImportSendbird from 'sendbird';
import _ from 'lodash';

const returnObject = {};
let enterChannel = {};
returnObject.createChannel = (sendBirdAppKey, isOpenChannel, channelKey, clientUserId, getChannelMsg, msgUpdate) => {
    const sb = new ImportSendbird({
        appId: sendBirdAppKey,
    });
    sb.connect(clientUserId, (user, error) => {
        if (error) {
            console.log(error);
        } else {
        }
    });
    const openChannelList = sb.OpenChannel.createOpenChannelListQuery();
    openChannelList.next((channels, error) => {
        if (error) {
            console.log(error);
            return;
        }
        const findChannel = _.find(channels, { name: channelKey });
        const openChannelEnter = (channelSelect) => {
            enterChannel = channelSelect;
            sb.OpenChannel.getChannel(channelSelect.url, (channel, error) => {
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
                    getChannelMsg.call(this, messageList);
                });
            });
            /**
             * event handler
             * */
            const ChannelHandler = new sb.ChannelHandler();
            ChannelHandler.onMessageReceived = (channel, message) => {
                msgUpdate.call(this, message);
            };
            ChannelHandler.onUserEntered = (openChannel, user) => {
                user.type = 'in';
                user._sender = {
                    userId: user.userId,
                };
                msgUpdate.call(this, user);
            };
            ChannelHandler.onUserExited = (openChannel, user) => {
                console.log(user);
            };
            const date = new Date();
            const handlerKey = clientUserId + date.getHours() + date.getMinutes() + date.getSeconds();
            sb.addChannelHandler(handlerKey, ChannelHandler);
        };
        const openChannelAdd = () => {
            sb.OpenChannel.createChannel(channelKey, null, null, (createdChannel, error) => {
                if (error) {
                    console.error(error);
                    return;
                }
                openChannelEnter(createdChannel);
            });
        };
        // openChannel 있을때
        if (findChannel) {
            openChannelEnter(findChannel);
        } else {
            // openChannel 없을때
            openChannelAdd();
        }
    });
};
returnObject.getEnterChannel = () => { return enterChannel };

export default returnObject;
