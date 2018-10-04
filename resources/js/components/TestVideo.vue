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
export default {
    name: 'TestVideo',
};
</script>

<style scoped>
#videoContainer {
    width: 100%;
}
#instructions { max-width: 640px; text-align: left; margin: 30px auto; }
#instructions textarea { width: 100%; height: 100px; }

/* Show the controls (hidden at the start by default) */
.video-js .vjs-control-bar {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
}
</style>
