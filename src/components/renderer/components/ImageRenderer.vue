<template>
  <div class="image-component" :class="{ 'selected': isSelected }" @click="selectComponent" :style="componentStyles">
    <img :src="component.src || defaultImageSrc" :width="component.width" :height="component.height"
      :class="{ 'hover-effect': component.hover }" :style="{
        objectFit: component.objectFit || 'cover',
        filter: component.filter || 'none'
      }" alt="图片" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useComponentStore } from '../../../stores/componentStore';
import type { ImageComponent } from '../../../types/component';
import defaultImageUrl from '@/assets/images/img-icon.svg';
import { parseSpacing } from '@/utils/common';

const props = defineProps<{
  component: ImageComponent
}>();

const componentStore = useComponentStore();
const isSelected = computed(() => componentStore.selectedComponentId === props.component.id);

// 默认图片路径
const defaultImageSrc = defaultImageUrl;

// 计算组件样式
const componentStyles = computed(() => {
  const style = props.component.style || {};
  return {
    margin: parseSpacing(style.margin),
    padding: parseSpacing(style.padding),
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

.image-component {
  padding: 8px;
  cursor: pointer;

  img {
    display: block;
    max-width: 100%;

    &.hover-effect {
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }
}
</style>