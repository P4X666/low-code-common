<template>
  <div class="component-preview-container bg-white">
    <!-- 页面标题 -->
    <div class="page-title px-4 py-2 bg-gray-50 border-b text-center">
      <h2 class="text-lg font-semibold">{{ pageConfig.title }}</h2>
    </div>
    
    <!-- <div class="h-32 relative">
      <div 
        class="logo-name absolute"
      >WEFOR</div>
      <img src="@/assets/images/phone-header.png" alt="phone-header" />
    </div> -->
    <div 
      ref="sortableContainer"
      class="component-preview h-full" 
      @dragover.prevent 
      @drop="onDrop"
      :style="{
        backgroundColor: pageConfig.backgroundColor,
        backgroundImage: pageConfig.backgroundImage ? `url(${pageConfig.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }"
    >
      <div v-if="components.length === 0" class="flex items-center justify-center h-32 text-gray-400">
        从左侧拖拽组件到此处
      </div>
      <template v-else>
        <div 
          v-for="comp in components" 
          :key="comp.id" 
          class="component-wrapper relative group"
          :class="{ 'selected': comp.id === componentStore.selectedComponentId }"
          @click="selectComponent(comp.id)"
        >
          <component 
            :is="getComponentByType(comp.type)" 
            :component="comp as any" 
          />
          <!-- 删除按钮 -->
          <button
            v-if="comp.id === componentStore.selectedComponentId"
            @click.stop="deleteComponent(comp.id)"
            class="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            title="删除组件"
          >
            x
          </button>
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

const componentStore = useComponentStore();
const components = computed(() => componentStore.components);
const pageConfig = computed(() => componentStore.pageConfig);
const sortableContainer = ref<HTMLElement | null>(null);

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
    default:
      return null;
  }
}

function onDrop(event: DragEvent) {
  const componentType = event.dataTransfer?.getData('componentType');
  if (componentType) {
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
          width: 300,
          height: 200,
          hover: false
        })
      },
      {
        type: 'carousel', createDefault: () => ({
          id: crypto.randomUUID(),
          type: 'carousel',
          name: '轮播图组件',
          images: [],
          width: 300,
          height: 200,
          autoplay: true,
          interval: 3000
        })
      }
    ].find(t => t.type === componentType);

    if (template) {
      const newComponent = template.createDefault();
      componentStore.addComponent(newComponent as any);
      componentStore.selectComponent(newComponent.id);
    }
  }
}

function selectComponent(id: string) {
  componentStore.selectComponent(id);
}

function deleteComponent(id: string) {
  componentStore.removeComponent(id);
}
</script>

<style scoped lang="less">
.logo-name {
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
}

.component-wrapper {
  position: relative;
  cursor: move;
  
  &.selected {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  &:hover {
    outline: 1px solid #93c5fd;
    outline-offset: 1px;
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
</style>
