<template>
  <div 
    :class="['container-component', { 'selected': isSelected, 'dragging-over': isDraggingOver }]"
    @click="selectComponent"
    :style="containerStyles"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop="onDrop"
  >
    <div class="container-content">
      <!-- 容器内的子组件 -->
      <div 
        v-if="childrenComponents.length > 0" 
        class="container-children"
        :style="childrenContainerStyles"
      >
        <div 
          v-for="child in childrenComponents" 
          :key="child.id" 
          class="component-wrapper relative group"
          :class="{ 'selected': child.id === componentStore.selectedComponentId }"
          @click.stop="selectComponent(child.id)"
        >
          <component 
            :is="getChildComponentByType(child.type)" 
            :component="child as any" 
          />
        </div>
      </div>
      <!-- 容器组件的占位符内容 -->
      <div v-else class="container-placeholder">
        <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
        </svg>
        <div class="text-sm text-gray-500">容器组件</div>
        <div class="text-xs text-gray-400 mt-1">Flex布局容器</div>
        <div class="text-xs text-blue-500 mt-1 animate-bounce">拖拽组件到此处</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useComponentStore } from '../../../stores/componentStore';
import type { ContainerComponent, Component } from '../../../types/component';
import TextRenderer from './TextRenderer.vue';
import ImageRenderer from './ImageRenderer.vue';
import CarouselRenderer from './CarouselRenderer.vue';
import BannerRenderer from './BannerRenderer.vue';
import CategoryRenderer from './CategoryRenderer.vue';
import ProductRankRenderer from './ProductRankRenderer.vue';
import ProductGroupRenderer from './ProductGroupRenderer.vue';
import { parseSpacing } from '@/utils/common';

const props = defineProps<{
  component: ContainerComponent;
}>();

const componentStore = useComponentStore();
const isSelected = computed(() => componentStore.selectedComponentId === props.component.id);
const isDraggingOver = ref(false);

// 获取所有组件，用于查找子组件
const allComponents = computed(() => componentStore.components);

// 从store中获取当前容器组件
const currentContainer = computed(() => {
  return allComponents.value.find(component => component.id === props.component.id) as ContainerComponent;
});

// 计算容器的子组件
const childrenComponents = computed(() => {
  const childrenIds = currentContainer.value?.children || [];
  return allComponents.value.filter(component => childrenIds.includes(component.id));
});

// 计算容器样式（不包含flex布局）
const containerStyles = computed(() => {
  const style = props.component.style || {};
  return {
    margin: parseSpacing(style.margin),
    padding: parseSpacing(style.padding),
    borderRadius: style.borderRadius ? `${style.borderRadius}px` : '',
    backgroundColor: style.backgroundColor || '',
    border: style.borderWidth ? `${style.borderWidth}px ${style.borderStyle || 'solid'} ${style.borderColor || '#000'}` : '',
    boxShadow: style.boxShadow !== 'none' ? style.boxShadow : '',
    opacity: style.opacity !== undefined ? style.opacity : 1,
    minHeight: '100px'
  } as Record<string, string|number>;
});

// 计算子组件容器的flex布局样式
const childrenContainerStyles = computed(() => {
  return {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    width: '100%'
  } as Record<string, string|number>;
});

// 根据子组件类型获取对应的渲染器
function getChildComponentByType(type: string) {
  switch (type) {
    case 'text':
      return TextRenderer;
    case 'image':
      return ImageRenderer;
    case 'carousel':
      return CarouselRenderer;
    case 'banner':
      return BannerRenderer;
    case 'category':
      return CategoryRenderer;
    case 'productRank':
      return ProductRankRenderer;
    case 'productGroup':
      return ProductGroupRenderer;
    default:
      return null;
  }
}

// 拖拽经过处理
function onDragOver(event: DragEvent) {
  event.preventDefault();
  isDraggingOver.value = true;
}

// 拖拽离开处理
function onDragLeave(event: DragEvent) {
  isDraggingOver.value = false;
}

// 拖拽放置处理
function onDrop(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation(); // 防止事件冒泡到父组件，避免重复创建组件
  isDraggingOver.value = false;
  const componentType = event.dataTransfer?.getData('componentType');
  if (componentType) {
    // 这里应该调用父组件的onDrop方法，或者直接调用componentStore来添加组件
    // 由于当前组件是容器组件，我们需要特殊处理
    console.log('Drop component into container:', componentType);
    
    // 这里需要实现将组件添加到容器的逻辑
    // 由于容器组件的children是通过id列表管理的，我们需要：
    // 1. 创建新组件
    // 2. 将新组件的id添加到容器的children列表中
    
    // 注意：这里的逻辑需要与RendererPanel.vue中的onDrop方法保持一致
    // 我们可以复用RendererPanel.vue中的模板逻辑
    const template = [
      {
        type: 'text', createDefault: () => ({
          id: crypto.randomUUID(),
          type: 'text',
          name: '文本组件',
          content: '点击编辑文本',
          fontSize: 16,
          color: '#000000'
        })
      },
      {
        type: 'image', createDefault: () => ({
          id: crypto.randomUUID(),
          type: 'image',
          name: '图片组件',
          src: '',
          width: 250,
          height: 200,
          hover: false
        })
      },
      {
        type: 'carousel', createDefault: () => ({
          id: crypto.randomUUID(),
          type: 'carousel',
          name: '轮播图组件',
          images: [{ url: 'https://picsum.photos/600/400?random=1' }],
          width: 750,
          height: 200,
          autoplay: true,
          interval: 3000,
          showIndicators: true,
          showControls: true
        })
      }
    ].find(t => t.type === componentType);

    if (template) {
      const newComponent = template.createDefault();
      // 添加组件到组件库，获取实际生成的ID
      const actualComponentId = componentStore.addComponent(newComponent as any);
      
      // 将实际生成的组件ID添加到容器的children列表中
      const updatedContainer = { ...props.component };
      updatedContainer.children = [...(updatedContainer.children || []), actualComponentId];
      componentStore.updateComponent(updatedContainer.id, updatedContainer);
      
      // 选择新添加的组件
      componentStore.selectComponent(actualComponentId);
    }
  }
}

// 选择组件
function selectComponent(id: string | MouseEvent) {
  if (typeof id === 'string') {
    // 选择子组件
    componentStore.selectComponent(id);
  } else {
    // 选择容器组件本身
    id.stopPropagation();
    componentStore.selectComponent(props.component.id);
  }
}
</script>

<style scoped lang="less">
@import '../common/styles.less';

.container-component {
  padding: 8px;
  cursor: pointer;
  
  &.dragging-over {
    outline: 1px solid #93c5fd;
    outline-offset: 2px;
    background-color: rgba(59, 130, 246, 0.02);
  }
  
  /* 容器组件选中样式 - 浅颜色 */
  &.selected {
    outline: 2px solid #93c5fd;
    outline-offset: 3px;
    background-color: rgba(59, 130, 246, 0.05);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }
}

.container-content {
  width: 100%;
  height: 100%;
}

.container-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 150px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background-color: #f9fafb;
  color: #6b7280;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #3b82f6;
    background-color: #eff6ff;
  }
}

/* 子组件包装器样式 */
.component-wrapper {
  position: relative;
  cursor: move;
  transition: all 0.2s ease;
  border-radius: 6px;
  margin-bottom: 16px;
  width: auto;
  box-sizing: border-box;
  
  /* 子组件选中样式 - 深颜色 */
  &.selected {
    outline: 2px solid #3b82f6;
    outline-offset: 3px;
    background-color: rgba(59, 130, 246, 0.1);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    transform: translateY(-1px);
  }
  
  &:hover:not(.selected) {
    outline: 1px solid #93c5fd;
    outline-offset: 2px;
    background-color: rgba(59, 130, 246, 0.02);
  }
}
</style>