<template>
  <view class="modal-mask" v-if="show" @click="close">
    <view class="modal" @click.stop>
      <view class="close-button" @click="close">×</view>
      <view class="title">{{ title }}</view>
      <view class="modal_content">
        <text>{{ content }}</text>
      </view>
      <view class="button-group">
        <button @click="onCancel">{{ cancelText }}</button>
        <button @click="onConfirm">{{ confirmText }}</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '温馨提示'
    },
    content: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: '确认'
    },
    cancelText: {
      type: String,
      default: '取消'
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    onConfirm() {
      this.$emit('confirm');
    },
    onCancel() {
      this.$emit('cancel');
    }
  }
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* 确保模态框覆盖其他内容 */
}

.modal {
  background: #fff;
  padding: 20rpx;
  border-radius: 10rpx;
  position: relative;
  width: 80%;
  height: 400rpx;
  overflow-y: auto;
}

.close-button {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  width: 30rpx;
  height: 30rpx;
  line-height: 30rpx;
  text-align: center;
  border-radius: 50%;
  background: #f8f8f8;
  color: #333;
  cursor: pointer;
}

.title {
  font-weight: bold;
  margin-bottom: 15rpx;
  text-align: center;
}

.modal_content {
  margin-bottom: 20rpx;
  padding-top: 50rpx;
  text-align: center;
}

.button-group {
  display: flex;
  justify-content: space-around;
  position: absolute;
  bottom: 20rpx;
  left: 0;
  right: 0;
  padding: 0 20rpx;
}

button {
  /*padding: 10rpx 20rpx;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5rpx;*/
  cursor: pointer;
}
</style>
