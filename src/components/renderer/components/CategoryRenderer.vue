<template>
  <div class="category-component" :class="{ 'selected': isSelected }" @click="selectComponent" :style="componentStyles">
    <div class="category-container">
      <h3 v-if="component.title" class="category-title">{{ component.title }}</h3>
      <div class="category-images-grid">
        <!-- 大图部分 -->
        <div class="category-big-image-container" v-if="component.bigImage?.url">
          <a :href="component.bigImage.link" target="_blank" class="category-image-wrapper big">
            <img :src="component.bigImage.url" alt="热门类目" class="category-image w-full h-full object-cover" />
          </a>
        </div>
        <div v-else class="category-placeholder big flex items-center justify-center bg-gray-100">
          <span class="text-gray-400">暂无大图</span>
        </div>
        
        <!-- 小图部分 -->
        <div class="category-small-images-container">
          <div v-for="(image, index) in component.smallImages.slice(0, 6)" :key="index" class="category-small-image-item">
            <a v-if="image.url" :href="image.link" target="_blank" class="category-image-wrapper small">
              <img :src="image.url" :alt="image.text || `类目${index + 1}`" class="category-image w-full h-full object-cover" />
              <span v-if="image.text" class="category-image-text">{{ image.text }}</span>
            </a>
            <div v-else class="category-placeholder small flex items-center justify-center bg-gray-100">
              <span class="text-gray-400">暂无图片</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useComponentStore } from '../../../stores/componentStore';
import type { CategoryComponent } from '../../../types/component';
import { parseSpacing } from '@/utils/common';

const props = defineProps<{
  component: CategoryComponent;
}>();

const componentStore = useComponentStore();
const isSelected = computed(() => componentStore.selectedComponentId === props.component.id);

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

.category-component {
  padding: 8px;
  cursor: pointer;

}

.category-container {
  border-radius: 4px;
  overflow: hidden;
  background-color: #ffffff;
  padding: 10px;
}

.category-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.category-images-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: auto;
    gap: 10px;
  }

  .category-big-image-container {
    grid-row: 1;
    grid-column: 1;
    height: 100%;
  }

  .category-small-images-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 10px;
    grid-row: 1;
    grid-column: 2;
  }

.category-small-image-item {
  aspect-ratio: 1;
  min-height: 0;
}

.category-image-wrapper {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }

    &.big {
      height: 100%;
      display: flex;
    }

    &.small {
      height: 100%;
      display: flex;
    }
  }

  .category-image {
    transition: opacity 0.3s ease;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

.category-image-text {
  position: absolute;
  bottom: 5px;
  left: 5px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
}

.category-placeholder {
  border: 1px dashed #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  color: #666;

  &.big {
    height: 300px;
  }

  &.small {
    aspect-ratio: 1;
  }
}
</style>