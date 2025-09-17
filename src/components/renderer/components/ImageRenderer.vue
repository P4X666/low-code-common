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
.image-component {
  padding: 8px;
  cursor: pointer;

  &.selected {
    outline: 2px solid #3b82f6;
    background-color: rgba(59, 130, 246, 0.1);
  }

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