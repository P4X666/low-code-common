<template>
  <div class="banner-component" :class="{ 'selected': isSelected }" @click="selectComponent" :style="componentStyles">
    <h3 v-if="component.title" class="banner-title text-lg font-bold mb-2">{{ component.title }}</h3>
    <div class="banner-container">
      <div class="banner-image-container">
        <template v-if="component.images && component.images.length > 0">
          <div v-for="(image, index) in component.images" :key="index"
            class="banner-image-wrapper">
            <img :src="image.url || 'https://zara-cms.oss-cn-shanghai.aliyuncs.com/2025/09/ba4164590d974581a21e24db41a97708.png'" :alt="image.text || `Banner ${index + 1}`"
              class="banner-image w-full h-full object-cover" />
            <span v-if="image.text" class="banner-image-text">{{ image.text }}</span>
          </div>
        </template>
        <div v-else class="banner-placeholder flex items-center justify-center w-full h-full bg-gray-100">
          <span class="text-gray-400">暂无图片</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useComponentStore } from '../../../stores/componentStore';
import type { BannerComponent } from '../../../types/component';

const props = defineProps<{
  component: BannerComponent;
}>();

const componentStore = useComponentStore();
const isSelected = computed(() => componentStore.selectedComponentId === props.component.id);

// 计算组件样式
const componentStyles = computed(() => {
  const style = props.component.style || {};
  return {
    margin: style.margin ? `${style.margin.top}px ${style.margin.right}px ${style.margin.bottom}px ${style.margin.left}px` : '',
    padding: style.padding ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px` : '',
    borderRadius: style.borderRadius ? `${style.borderRadius}px` : '',
    backgroundColor: style.backgroundColor || '',
    border: style.borderWidth ? `${style.borderWidth}px ${style.borderStyle || 'solid'} ${style.borderColor || '#000'}` : '',
    boxShadow: style.boxShadow !== 'none' ? style.boxShadow : '',
    opacity: style.opacity !== undefined ? style.opacity : 1
  };
});

function selectComponent(event: MouseEvent) {
  event.stopPropagation();
  componentStore.selectComponent(props.component.id);
}
</script>

<style scoped lang="less">
@import '../common/styles.less';

.banner-component {
  padding: 8px;
  cursor: pointer;

}

.banner-container {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f5f5f5;
}

// .banner-title {
//   position: absolute;
//   top: 10px;
//   left: 10px;
//   color: white;
//   font-size: 18px;
//   font-weight: bold;
//   text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
//   z-index: 10;
// }

.banner-image-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.banner-image-wrapper {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
}

.banner-image {
  transition: opacity 0.3s ease;
}

.banner-image-text {
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.banner-placeholder {
  border: 1px dashed #d1d5db;
}
</style>