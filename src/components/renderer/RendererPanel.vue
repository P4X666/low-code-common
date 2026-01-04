<template>
  <div class="component-preview-container bg-white border border-gray-100 shadow-md">
    <div class="phone-top-wrap w-full">
      <img class="w-full h-full" src="/phone-top.5971738.png" />
    </div>
    <!-- 页面标题 -->
    <!-- <div class="page-title px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 shadow-sm">
      <h2 class="text-lg sm:text-xl font-medium text-gray-800 tracking-tight text-center">{{ pageConfig.title || '页面预览' }}</h2>
    </div> -->
    <div class="page-title flex items-center font-bold">
      <div class="flex-1"></div>
      <div class="flex-1 flex justify-center">
        {{ pageConfig.title || '页面预览' }}
      </div>
      <div class="flex-1 flex justify-center">
        <img class="phone-icon" src="/phone-icon.28da43a.png" />
      </div>
    </div>
    
    <!-- <div class="h-32 relative">
      <div 
        class="logo-name absolute"
      >WEFOR</div>
      <img src="@/assets/images/phone-header.png" alt="phone-header" />
    </div> -->
    <div 
      ref="sortableContainer"
      class="component-preview px-4 relative overflow-y-auto" 
      @dragover.prevent 
      @drop="onDrop"
      :style="{
        backgroundColor: pageConfig.backgroundColor,
      }"
    >
      <div v-if="components.length === 0" class="flex flex-col items-center justify-center min-h-[200px] text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200 mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-blue-400 mb-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="text-lg font-medium mb-2">开始创建您的页面</h3>
        <p class="max-w-md mb-4 px-8">从左侧组件库拖拽组件到此处，构建您的页面内容</p>
        <span class="text-sm text-blue-500 flex items-center animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          拖拽到这里
        </span>
      </div>
      <template v-else>
        <img v-if="pageConfig.backgroundImage" class="page-bg" :src="pageConfig.backgroundImage" />
        <!-- 只渲染顶级组件，容器内的子组件由容器组件自己渲染 -->
         <template v-for="comp in topLevelComponents" :key="comp.id">
          <div
            v-if="comp.type !== 'floatingButton'"
            class="component-wrapper group"
            :class="{ 'selected': comp.id === componentStore.selectedComponentId,  }"
            @click="selectComponent(comp.id)"
          >
            <component 
              :is="getComponentByType(comp.type)" 
              :component="comp as any" 
            />
          </div>
        </template>
        <div
            v-if="fixedComponent"
            class="component-wrapper group fixed-box"
            :class="{ 'selected': fixedComponent.id === componentStore.selectedComponentId }"
            @click="selectComponent(fixedComponent.id)"
          >
            <component 
              :is="getComponentByType(fixedComponent.type)" 
              :component="fixedComponent as any" 
            />
          </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import Sortable from 'sortablejs';
import { useComponentStore } from '../../stores/componentStore';
import TextRenderer from './components/TextRenderer.vue';
import ImageRenderer from './components/ImageRenderer.vue';
import CarouselRenderer from './components/CarouselRenderer.vue';
import BannerRenderer from './components/BannerRenderer.vue';
import CategoryRenderer from './components/CategoryRenderer.vue';
import ProductRankRenderer from './components/ProductRankRenderer.vue';
import ProductGroupRenderer from './components/ProductGroupRenderer.vue';
import ContainerRenderer from './components/ContainerRenderer.vue';
import FloatingButtonRenderer from './components/FloatingButtonRenderer.vue';
import { getDefaultComponentData } from '@/utils/component-defaultdata';
import type { Component, ComponentType } from '@/types/component';

const componentStore = useComponentStore();
const components = computed(() => componentStore.components);
const pageConfig = computed(() => componentStore.pageConfig);
const sortableContainer = ref<HTMLElement | null>(null);

// 计算顶级组件（不是任何容器组件的子组件的组件）
const topLevelComponents = computed(() => {
  // 收集所有容器组件的子组件ID
  const allChildComponentIds = new Set<string>();
  components.value.forEach(component => {
    if ('children' in component && Array.isArray(component.children)) {
      component.children.forEach(childId => allChildComponentIds.add(childId));
    }
  });
  
  // 过滤出顶级组件（不在任何容器的children列表中的组件）
  return components.value.filter(component => !allChildComponentIds.has(component.id));
});
// 通常来说，固定组件是不参与排序的，且固定组件一般只有一个
const fixedComponent = computed(() => {
  return components.value.find(comp => comp.type === 'floatingButton');
});

onMounted(() => {
  if (sortableContainer.value) {
    new Sortable(sortableContainer.value, {
      animation: 150,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      filter: '.empty-state',
      onEnd: (evt) => {
        const newComponents = [...components.value];
        const movedItem = newComponents.splice(evt.oldIndex!, 1)[0];
        newComponents.splice(evt.newIndex!, 0, movedItem);
        componentStore.reorderComponents(newComponents);
      }
    });
  }
});

function getComponentByType(type: string) {
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
    case 'container':
      return ContainerRenderer;
    case 'floatingButton':
      return FloatingButtonRenderer;
    default:
      return null;
  }
}

function onDrop(event: DragEvent) {
  const componentType = event.dataTransfer?.getData('componentType') as ComponentType;
  if (componentType) {
    const newComponent = getDefaultComponentData(componentType) as Component;
    if (newComponent) { 
      componentStore.addComponent(newComponent as any);
      componentStore.selectComponent(newComponent.id);
    }
  }
}

function selectComponent(id: string) {
  componentStore.selectComponent(id);
}
</script>

<style scoped lang="less">
.phone-top-wrap {
  height: 28px;
}
.page-title {
  height: 32px;
  .phone-icon {
    width: 87px; 
    height: 28px;
  }
}
.logo-name {
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
}

/* 改进拖拽排序时的视觉效果 */
.sortable-ghost {
  opacity: 0.4;
  background-color: rgba(59, 130, 246, 0.1);
  border: 1px dashed #93c5fd;
  border-radius: 6px;
}

.sortable-chosen {
  outline: 2px solid #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
}

.sortable-drag {
  transform: rotate(2deg) scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.component-wrapper {
  position: relative;
  cursor: move;
  transition: all 0.2s ease;
  border-radius: 6px;
  margin-bottom: 16px;
  width: 100%;
  /* 确保组件在各种状态下保持一致的布局 */
  box-sizing: border-box;
  
  &:first-of-type {
    margin-top: 6px;
  }
  &.selected {
    /* 更醒目的选中效果 */
    outline: 2px solid #3b82f6;
    outline-offset: 3px;
    background-color: rgba(59, 130, 246, 0.05);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }
  
  &:hover:not(.selected) {
    outline: 1px solid #93c5fd;
    outline-offset: 2px;
    background-color: rgba(59, 130, 246, 0.02);
  }
}

.sortable-ghost {
  opacity: 0.4;
}

.sortable-chosen {
  outline: 2px solid #3b82f6;
}

.sortable-drag {
  transform: rotate(5deg);
}
.fixed-box {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 100;
}
.page-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 0;
  display: block;
}
</style>
