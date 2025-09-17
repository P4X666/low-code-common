<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">组件库</h2>
    <div class="component-list flex justify-between flex-wrap">
      <div 
        v-for="item in componentTemplates" 
        :key="item.type"
        class="component-item"
        draggable="true"
        @dragstart="onDragStart($event, item)"
      >
        <img :src="item.icon" alt="组件图标" class="w-4 h-4 mr-2">
        {{ item.name }}
      </div>
    </div>
    
    <h3 class="text-lg font-bold mt-6 mb-2">组件顺序</h3>
    <div ref="sortableList" class="component-order-list border rounded p-2 min-h-[100px]">
      <div 
        v-for="component in components" 
        :key="component.id"
        class="component-order-item p-2 mb-2 bg-gray-50 rounded cursor-move hover:bg-gray-100 transition-colors"
        :class="{ 'bg-blue-100 hover:bg-blue-200': component.id === selectedComponentId }"
        @click="selectComponent(component.id)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
            </svg>
            <span class="font-medium">{{ component.customName || component.name }}</span>
          </div>
          <div class="text-xs text-gray-500">
            {{ component.customId || component.id.slice(0, 8) }}
          </div>
        </div>
      </div>
      <div v-if="components.length === 0" class="text-gray-400 text-center py-4">
        暂无组件，请从上方拖拽添加
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Sortable from 'sortablejs';
import { v4 as uuidv4 } from 'uuid';
import { useComponentStore } from '../../stores/componentStore';
import type { TextComponent, ImageComponent, CarouselComponent } from '../../types/component';

const componentStore = useComponentStore();
const components = computed(() => componentStore.components);
const selectedComponentId = computed(() => componentStore.selectedComponentId);

const sortableList = ref<HTMLElement | null>(null);

const componentTemplates = [
  { 
    type: 'text', 
    name: '文本组件',
    icon: 'src/assets/images/text-icon.svg',
    createDefault: (): TextComponent => ({
      id: uuidv4(),
      type: 'text',
      name: '文本组件',
      content: '点击编辑文本',
      fontSize: 16,
      color: '#000000',
    })
  },
  { 
    type: 'image', 
    name: '图片组件',
    icon: 'src/assets/images/img-icon.svg',
    createDefault: (): ImageComponent => ({
      id: uuidv4(),
      type: 'image',
      name: '图片组件',
      src: '',
      width: 300,
      height: 200,
      hover: false,
    })
  },
  { 
    type: 'carousel', 
    name: '轮播图组件',
    icon: 'src/assets/images/img-icon.svg',
    createDefault: (): CarouselComponent => ({
      id: uuidv4(),
      type: 'carousel',
      name: '轮播图组件',
      images: [],
      width: 300,
      height: 200,
      autoplay: true,
      interval: 3000,
    })
  }
];

onMounted(() => {
  if (sortableList.value) {
    new Sortable(sortableList.value, {
      animation: 150,
      onEnd: (evt) => {
        const newComponents = [...components.value];
        const movedItem = newComponents.splice(evt.oldIndex!, 1)[0];
        newComponents.splice(evt.newIndex!, 0, movedItem);
        componentStore.reorderComponents(newComponents);
      }
    });
  }
});

function onDragStart(event: DragEvent, item: any) {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('componentType', item.type);
  }
}

function selectComponent(id: string) {
  componentStore.selectComponent(id);
}
</script>