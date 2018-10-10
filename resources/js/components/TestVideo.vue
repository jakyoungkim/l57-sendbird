<template>
    <div>
        <div id="videoContainer">
            <div id="instructions">
                <video id="my_video_1" class="video-js vjs-default-skin" width="640px" height="267px"
                       controls preload="none" poster='http://www.hellodd.com/upload/editor/201805/thumb/watermark_687x0_twi001t1504064.jpg'
                       data-setup='{ "aspectRatio":"640:267", "playbackRates": [1, 1.5, 2] }'>
                    <source src="https://vjs.zencdn.net/v/oceans.mp4" type='video/mp4' />
                    <source src="https://vjs.zencdn.net/v/oceans.webm" type='video/webm' />
                </video>
            </div>
        </div>
    </div>
</template>

<script>
import 'video.js/dist/video-js.css';
import videojs from 'video.js';
import videoPlayTime from 'videojs-playtime';

export default {
    name: 'TestVideo',
    data() {
        return {
            currentTime: 0,
        };
    },
    mounted() {
        videojs.plugin('videoPlayTime', videoPlayTime);
        const player = videojs('my_video_1', {
            techOrder: ['flash', 'html5'],
            plugins: {
                videoPlayTime: null,
            },
        });
        const timeCheck = () => {
            const date = new Date();
            if (player.playTime() > 0) {
                const timestampa = date.getHours() + ':' + date.getMinutes() + ':' + player.playTime() + ':' + date.getMilliseconds();
                this.currentTime = timestampa;
                this.$EventBus.$emit('time', timestampa);
            }
        };
        player.on('timeupdate', timeCheck);
    },
};
</script>

<style scoped>
#videoContainer {
    width: 100%;
}
#instructions {
    width: 720px;
}
#instructions textarea {
    width: 100%;
    height: 100px;
}
/* Show the controls (hidden at the start by default) */
.video-js .vjs-control-bar {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
}
.video-js.vjs-fluid{
    height: 600px;
}

</style>
