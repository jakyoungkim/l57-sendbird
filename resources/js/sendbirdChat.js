import ImportSendbird from 'sendbird';
import _ from 'lodash';

class sendbirdClass {
    /**
     * constructor
     *
     * @param {String} sendBirdAppKey - sendbird Api key
     * @param {String} isOpenChannel
     * @param {String} channelKey- channel Name
     * @param {String} clientUserId - user id
     * @param {Event} channelMassagesCallback
     * @param {Event} massageUpdateCallback
     * @param {Event} errorCallback
     */
    constructor(sendBirdAppKey, sendBirdToken, isOpenChannel, channelKey, clientUserId, channelMassagesCallback, massageUpdateCallback, errorCallback) {
        this.sendBirdToken = sendBirdToken;
        this.isOpenChannel = isOpenChannel;
        this.channelMassagesCallback = channelMassagesCallback;
        this.massageUpdateCallback = massageUpdateCallback;
        this.errorCallback = errorCallback;
        this.enterChannel = {};
        this.importSendbird = new ImportSendbird({
            appId: sendBirdAppKey,
        });
        this.createChannel(clientUserId, channelKey);
    }

    createChannel(clientUserId, channelKey) {
        this.importSendbird.connect(clientUserId, this.sendBirdToken, (user, error) => {
            if (error) {
                this.errorCallback(error);
            } else {
            }
        });
        const openChannelList = this.importSendbird.OpenChannel.createOpenChannelListQuery();
        openChannelList.next((channels, error) => {
            if (error) {
                this.errorCallback(error);
                return;
            }
            const findChannel = _.find(channels, { name: channelKey });
            // openChannel 있을때
            if (findChannel) {
                this.openChannelEnter(findChannel, clientUserId);
            } else {
                // openChannel 없을때
                this.openChannelAdd(clientUserId, channelKey);
            }
        });
    }

    openChannelEnter(channelSelect, clientUserId) {
        this.enterChannel = channelSelect;
        this.importSendbird.OpenChannel.getChannel(channelSelect.url, (channel, error) => {
            if (error) {
                this.errorCallback(error);
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
                    this.errorCallback(error);
                    return;
                }
                this.channelMassagesCallback.call(this, messageList);
            });
        });

        /**
         * event handler
         * */
        this.addEventHandler(clientUserId);
    }

    openChannelAdd(clientUserId, channelKey) {
        this.importSendbird.OpenChannel.createChannel(channelKey, null, null, (createdChannel, error) => {
            if (error) {
                this.errorCallback(error);
                return;
            }
            this.openChannelEnter(createdChannel, clientUserId);
        });
    }

    addEventHandler(clientUserId) {
        const ChannelHandler = new this.importSendbird.ChannelHandler();
        const date = new Date();
        const handlerKey = clientUserId + date.getHours() + date.getMinutes() + date.getSeconds();

        ChannelHandler.onMessageReceived = (channel, message) => {
            this.massageUpdateCallback.call(this, message);
        };
        ChannelHandler.onUserEntered = (openChannel, user) => {
            const callbackUser = user;
            callbackUser.type = 'in';
            callbackUser._sender = {
                userId: user.userId,
            };
            this.massageUpdateCallback.call(this, callbackUser);
        };
        this.importSendbird.addChannelHandler(handlerKey, ChannelHandler);
    }

    getEnterChannel() {
        return this.enterChannel;
    }
}

export default sendbirdClass;
