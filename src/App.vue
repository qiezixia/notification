<template>
  <div id="app">
    <MessagePush></MessagePush>
  </div>
</template>

<script>
import MessagePush from '../pluginPackage/messagePush/src/main'

export default {
  name: 'app',
  components: {
    MessagePush
  }
}
</script>

<style>
@font-face {
  font-family: 'iconfont';  /* project id 543982 */
  src: url('//at.alicdn.com/t/font_543982_njbsq191y2.eot');
  src: url('//at.alicdn.com/t/font_543982_njbsq191y2.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_543982_njbsq191y2.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_543982_njbsq191y2.woff') format('woff'),
  url('//at.alicdn.com/t/font_543982_njbsq191y2.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_543982_njbsq191y2.svg#iconfont') format('svg');
}

.iconfont{
    font-family:"iconfont" !important;
    font-size:16px;font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
}
</style>
