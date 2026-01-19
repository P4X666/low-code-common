<template>
  <div class="product-group-component" :class="{ 'selected': isSelected }" @click="selectComponent"
    :style="componentStyles">
    <div class="product-group-container">
      <!-- 标题部分 -->
      <div class="product-group-header">
        <h3 v-if="component.title" class="product-group-title">{{ component.title }}</h3>
      </div>

      <!-- 分类导航：使用daisyui的tabs组件 -->
      <div class="tabs tabs-boxed">
        <a 
          v-for="(group, groupIndex) in component.groups" 
          :key="groupIndex" 
          class="tab"
          :class="{ 'tab-active': selectedTabIndex === groupIndex }"
          @click.stop="selectTab(groupIndex)"
        >
          {{ group.title }}
        </a>
      </div>

      <!-- 分组内容：只显示当前选中的分组 -->
      <div class="product-group-content">
        <div v-if="component.groups.length > 0" class="product-group">
          <!-- 添加高度过渡包装器 -->
          <div 
            ref="productsContainerRef" 
            class="group-products-wrapper"
            :style="{ height: containerHeight + 'px' }"
          >
            <div class="group-products">
              <template v-if="component.groups[selectedTabIndex].images.length > 0">
                <div v-for="(image, index) in component.groups[selectedTabIndex].images.slice(0, 7)" :key="`${selectedTabIndex}-${index}`" :href="image.link" target="_blank"
                  class="product-item">
                  <div class="product-image-container">
                    <img 
                      :src="image.url" 
                      alt="商品图片" 
                      class="product-image" 
                      loading="eager" 
                      decoding="async"
                    />
                  </div>
                </div>
              </template>
              <div v-else class="product-placeholder flex items-center justify-center bg-gray-100">
                <span class="text-gray-400">暂无图片</span>
              </div>
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
import { computed, ref, watch, nextTick } from 'vue';
import { useComponentStore } from '../../../stores/componentStore';
import type { ProductGroupComponent } from '../../../types/component';
import { parseSpacing } from '@/utils/common';

const props = defineProps<{
  component: ProductGroupComponent;
}>();

const componentStore = useComponentStore();
const isSelected = computed(() => componentStore.selectedComponentId === props.component.id);

// 当前选中的tab索引
const selectedTabIndex = ref(0);
// 产品容器引用
const productsContainerRef = ref<HTMLElement | null>(null);
// 容器高度
const containerHeight = ref(0);

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

// 选择tab
async function selectTab(index: number) {
  // 预加载当前tab的图片
  preloadImages(props.component.groups[index].images);
  
  // 切换tab索引
  selectedTabIndex.value = index;
}

// 预加载图片
function preloadImages(images: { url: string; link?: string }[]) {
  images.slice(0, 7).forEach(image => {
    const img = new Image();
    img.src = image.url;
  });
}

// 更新容器高度
async function updateContainerHeight() {
  await nextTick();
  
  if (productsContainerRef.value) {
    // 获取内部group-products元素的实际高度
    const groupProducts = productsContainerRef.value.querySelector('.group-products');
    if (groupProducts) {
      // 先获取旧高度
      const oldHeight = containerHeight.value;
      
      // 强制计算新高度
      const newHeight = groupProducts.scrollHeight;
      
      // 如果高度不同，执行过渡动画
      if (oldHeight !== newHeight) {
        // 触发浏览器重排
        productsContainerRef.value.offsetHeight;
        
        // 设置新高度，触发过渡动画
        containerHeight.value = newHeight;
      }
    }
  }
}

// 监听selectedTabIndex变化，更新容器高度
watch(selectedTabIndex, updateContainerHeight);

// 初始设置高度和预加载图片
nextTick(() => {
  updateContainerHeight();
  preloadImages(props.component.groups[0].images);
});
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

/* 调整tabs样式 */
.tabs {
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 8px;
}

.tab {
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
}

/* 调整tab-active样式 */
.tab-active {
  color: #000;
}

.product-group-content {
  margin-bottom: 15px;
}

.group-products-wrapper {
  overflow: hidden;
  transition: height 0.3s ease;
  will-change: height;
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

/* 响应式调整 */
@media (max-width: 768px) {
  .product-group-container {
    padding: 10px;
  }

  .tabs {
    gap: 4px;
  }

  .tab {
    padding: 4px 12px;
    font-size: 13px;
  }

  .group-products {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 8px;
  }
}

/* 商品项过渡动画 */
.product-item {
  display: block;
  text-decoration: none;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 1;

  &:hover {
    transform: translateY(-2px);
  }
}

/* 图片过渡效果 */
.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
  opacity: 1;
}

/* 确保容器高度稳定 */
.product-group-content {
  min-height: 200px; /* 设置一个合理的最小高度 */
  transition: opacity 0.3s ease;
  opacity: 1;
  overflow: hidden;
}

/* 确保图片容器高度固定 */
.product-image-container {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #f3f4f6;
  position: relative;
}

/* 预加载占位符 */
.product-image-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f3f4f6;
  z-index: -1;
}
</style>