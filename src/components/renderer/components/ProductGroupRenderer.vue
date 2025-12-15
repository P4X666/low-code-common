<template>
  <div class="product-group-component" :class="{ 'selected': isSelected }" @click="selectComponent"
    :style="componentStyles">
    <div class="product-group-container">
      <!-- 标题部分 -->
      <div class="product-group-header">
        <h3 v-if="component.title" class="product-group-title">{{ component.title }}</h3>
      </div>

      <!-- 分组内容 -->
      <div class="product-group-content">
        <div v-for="(group, groupIndex) in component.groups" :key="groupIndex" class="product-group">
          <div class="group-header">
            <h4 class="group-title">{{ group.title }}</h4>
          </div>
          <div class="group-products">
            <template v-if="group.images.length > 0">
              <div v-for="(image, index) in group.images.slice(0, 7)" :key="index" :href="image.link" target="_blank"
                class="product-item">
                <div class="product-image-container">
                  <img :src="image.url || 'https://zara-cms.oss-cn-shanghai.aliyuncs.com/2025/09/ba4164590d974581a21e24db41a97708.png'" alt="商品图片" class="product-image" />
                </div>
              </div>
            </template>
            <div v-else class="product-placeholder flex items-center justify-center bg-gray-100">
              <span class="text-gray-400">暂无图片</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div v-if="component.buttonText" class="product-group-footer">
        <a :href="component.buttonLink" target="_blank" class="view-all-button">
          {{ component.buttonText }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useComponentStore } from '../../../stores/componentStore';
import type { ProductGroupComponent } from '../../../types/component';
import { parseSpacing } from '@/utils/common';

const props = defineProps<{
  component: ProductGroupComponent;
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

.product-group-component {
  padding: 8px;
  cursor: pointer;

}

.product-group-container {
  border-radius: 4px;
  overflow: hidden;
  background-color: #ffffff;
  padding: 15px;
  border: 1px solid #e5e7eb;
}

.product-group-header {
  margin-bottom: 15px;
}

.product-group-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.product-group-content {
  margin-bottom: 15px;
}

.product-group {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.group-header {
  margin-bottom: 10px;
}

.group-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  padding-bottom: 5px;
  border-bottom: 2px solid #3b82f6;
  display: inline-block;
}

.group-products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.product-item {
  display: block;
  text-decoration: none;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.product-image-container {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #f3f4f6;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.product-placeholder {
  width: 100%;
  aspect-ratio: 1;
  border: 1px dashed #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.product-group-footer {
  text-align: center;
  margin-top: 15px;
}

.view-all-button {
  display: inline-block;
  padding: 8px 24px;
  background-color: #3b82f6;
  color: white;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background-color: #2563eb;
  }
}
</style>