<template>
  <div class="p-4 bg-gray-50 min-h-full space-y-6">
    <!-- 基础组件库分组 -->
    <div class="component-group">
      <div class="group-header mb-4">
        <h2 class="text-xl font-bold text-gray-800 border-l-4 border-blue-500 pl-3 inline-flex items-center">
          基础组件库
          <span class="ml-2 text-sm font-normal text-blue-500">{{ baseComponentTemplates.length }} 个组件</span>
        </h2>
      </div>
      <div class="component-list-container bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="component-list flex flex-wrap gap-3 justify-start">
          <div v-for="item in baseComponentTemplates" :key="item.type"
            class="component-item bg-white border border-gray-100 rounded-lg p-3 flex items-center cursor-pointer hover:border-blue-400 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 flex-1 min-w-[160px] max-w-[200px]"
            draggable="true" @dragstart="onDragStart($event, item)" @drag="onDrag($event)" @dragend="onDragEnd($event)">
            <div :class="getIconClass(item.type)" class="w-8 h-8 flex items-center justify-center rounded-full mr-3">
              <img :src="item.icon" alt="组件图标" class="w-5 h-5">
            </div>
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- 业务组件库分组 -->
    <div class="component-group">
      <div class="group-header mb-4">
        <h2 class="text-xl font-bold text-gray-800 border-l-4 border-green-500 pl-3 inline-flex items-center">
          业务组件库
          <span class="ml-2 text-sm font-normal text-green-500">{{ advanceComponentTemplates.length }} 个组件</span>
        </h2>
      </div>
      <div class="component-list-container bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div class="component-list flex flex-wrap gap-3 justify-start">
          <div v-for="item in advanceComponentTemplates" :key="item.type"
            class="component-item bg-white border border-gray-100 rounded-lg p-3 flex items-center cursor-pointer hover:border-green-400 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 flex-1 min-w-[160px] max-w-[200px]"
            draggable="true" @dragstart="onDragStart($event, item)" @drag="onDrag($event)" @dragend="onDragEnd($event)">
            <div :class="getIconClass(item.type)" class="w-8 h-8 flex items-center justify-center rounded-full mr-3">
              <img :src="item.icon" alt="组件图标" class="w-5 h-5">
            </div>
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    <!-- 组件顺序区域 -->
    <div class="component-order-section">
      <div class="group-header mb-3">
        <h3 class="text-lg font-bold text-gray-800 border-l-4 border-purple-500 pl-3 inline-flex items-center">
          组件顺序
          <span class="ml-2 text-sm font-normal text-purple-500">{{ topLevelComponents.length }} 个顶级组件</span>
        </h3>
      </div>
      <div ref="sortableList"
        class="component-order-list bg-white border border-gray-100 rounded-xl p-4 min-h-[100px] shadow-sm">
        <!-- 递归渲染组件树 -->
        <template v-for="component in topLevelComponents" :key="component.id">
          <div
            :data-component-id="component.id"
            class="component-order-item p-3 mb-2 bg-white rounded border border-gray-200 cursor-move hover:border-blue-300 hover:shadow-sm transition-all duration-200 transform hover:-translate-y-0.5"
            :class="{ 
              'border-blue-400 bg-blue-50 hover:bg-blue-100': component.id === selectedComponentId && component.type === 'container',
              'border-blue-600 bg-blue-100 hover:bg-blue-200': component.id === selectedComponentId && component.type !== 'container'
            }"
            @click="selectComponent(component.id)" @mouseenter="onItemMouseEnter(component.id)"
            @mouseleave="onItemMouseLeave"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
                </svg>
                <span class="font-medium">{{ component.customName || component.name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="text-xs text-gray-500">
                  {{ component.customId || component.id.slice(0, 8) }}
                </div>
                <button
                  @click.stop="deleteComponent(component.id)"
                  class="text-xs text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                  title="删除组件"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <!-- 渲染子组件 -->
            <div v-if="isContainerComponent(component) && getContainerChildren(component.id).length > 0" class="ml-6 mt-2 border-l-2 border-gray-200 pl-4">
              <div
                v-for="child in getContainerChildren(component.id)" :key="child!.id"
                :data-component-id="child!.id"
                class="component-order-item p-2 mb-1 bg-gray-50 rounded border border-gray-200 cursor-move hover:border-blue-300 hover:shadow-sm transition-all duration-200 transform hover:-translate-y-0.5"
                :class="{ 'border-blue-600 bg-blue-100 hover:bg-blue-200': child!.id === selectedComponentId }"
                @click="selectComponent(child!.id)" @mouseenter="onItemMouseEnter(child!.id)"
                @mouseleave="onItemMouseLeave"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <svg class="w-3 h-3 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <span class="font-medium text-sm">{{ child!.customName || child!.name }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="text-xs text-gray-500">
                      {{ child!.customId || child!.id.slice(0, 8) }}
                    </div>
                    <button
                      @click.stop="deleteComponent(child!.id)"
                      class="text-xs text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                      title="删除组件"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-if="topLevelComponents.length === 0" class="text-gray-400 text-center py-4">
          暂无组件，请从上方拖拽添加
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Sortable from 'sortablejs';
import { v4 as uuidv4 } from 'uuid';
import { useComponentStore } from '../../stores/componentStore';
import type { TextComponent, ImageComponent, CarouselComponent, BannerComponent, CategoryComponent, ProductRankComponent, ProductGroupComponent, ContainerComponent, FloatingButtonComponent } from '../../types/component';
import textIconUrl from '@/assets/images/text-icon.svg';
import imgIconUrl from '@/assets/images/img-icon.svg';

const componentStore = useComponentStore();
const components = computed(() => componentStore.components);
const selectedComponentId = computed(() => componentStore.selectedComponentId);

const sortableList = ref<HTMLElement | null>(null);

// 计算顶级组件（不在任何容器组件的children列表中的组件）
const topLevelComponents = computed(() => {
  // 收集所有容器组件的子组件ID
  const allChildComponentIds = new Set<string>();
  components.value.forEach(component => {
    if (isContainerComponent(component) && Array.isArray(component.children)) {
      component.children.forEach(childId => allChildComponentIds.add(childId));
    }
  });
  
  // 过滤出顶级组件（不在任何容器的children列表中的组件）
  return components.value.filter(component => !allChildComponentIds.has(component.id));
});

// 判断组件是否为容器组件
function isContainerComponent(component: any): component is { children: string[] } {
  return component.type === 'container' && Array.isArray(component.children);
}

// 获取容器组件的子组件
function getContainerChildren(containerId: string) {
  const container = components.value.find(c => c.id === containerId);
  if (!container || !isContainerComponent(container)) {
    return [];
  }
  
  // 根据children ID列表获取实际的子组件对象
  return container.children
    .map(childId => components.value.find(c => c.id === childId))
    .filter((child): child is typeof child => child !== undefined);
}

const baseComponentTemplates = [
  {
    type: 'text',
    name: '文本组件',
    icon: textIconUrl,
    createDefault: (): TextComponent => ({
      id: uuidv4(),
      type: 'text',
      name: '文本组件',
      content: '点击编辑文本',
    })
  },
  {
    type: 'image',
    name: '图片组件',
    icon: imgIconUrl,
    createDefault: (): ImageComponent => ({
      id: uuidv4(),
      type: 'image',
      name: '图片组件',
      src: '',
      width: 250,
      height: 200,
      hover: false,
    })
  },
  {
    type: 'carousel',
    name: '轮播图组件',
    icon: imgIconUrl,
    createDefault: (): CarouselComponent => ({
      id: uuidv4(),
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
  },
  {
    type: 'container',
    name: '容器组件',
    icon: imgIconUrl,
    createDefault: (): ContainerComponent => ({
      id: uuidv4(),
      type: 'container',
      name: '容器组件',
      children: []
    })
  },
  {
    type: 'floatingButton',
    name: '底部悬浮按钮',
    icon: imgIconUrl,
    createDefault: (): FloatingButtonComponent => ({
      id: uuidv4(),
      type: 'floatingButton',
      name: '底部悬浮按钮',
      content: '点击按钮',
      fixed: true,
    })
  }
];

const advanceComponentTemplates = [
  {
    type: 'banner',
    name: 'banner组件',
    icon: imgIconUrl,
    createDefault: (): BannerComponent => ({
      id: uuidv4(),
      type: 'banner',
      name: 'banner组件',
      title: 'Banner标题',
      images: [{ url: 'https://picsum.photos/750/200?random=2', link: '#' }],
    })
  },
  {
    type: 'category',
    name: '热门类目组件',
    icon: imgIconUrl,
    createDefault: (): CategoryComponent => ({
      id: uuidv4(),
      type: 'category',
      name: '热门类目组件',
      title: '热门类目',
      bigImage: { url: 'https://picsum.photos/300/300?random=3', link: '#' },
      smallImages: Array(6).fill(0).map((_, index) => ({
        url: `https://picsum.photos/120/120?random=${index + 4}`,
        link: '#',
        text: `类目${index + 1}`
      }))
    })
  },
  {
    type: 'productRank',
    name: '商品排行组件',
    icon: imgIconUrl,
    createDefault: (): ProductRankComponent => ({
      id: uuidv4(),
      type: 'productRank',
      name: '商品排行组件',
      title: '商品排行榜',
      dataSource: 'ranking',
      subtitle: '热销榜单',
      buttonText: '查看全部',
      buttonLink: '#'
    })
  },
  {
    type: 'productGroup',
    name: '商品分组组件',
    icon: imgIconUrl,
    createDefault: (): ProductGroupComponent => ({
      id: uuidv4(),
      type: 'productGroup',
      name: '商品分组组件',
      title: '商品分类',
      buttonText: '查看全部',
      buttonLink: '#',
      groups: [
        {
          title: '推荐商品',
          images: Array(4).fill(0).map((_, index) => ({
            url: `https://picsum.photos/150/150?random=${index + 10}`,
            link: '#'
          }))
        }
      ]
    })
  }
]

onMounted(() => {
  if (sortableList.value) {
    new Sortable(sortableList.value, {
      animation: 150,
      // 只允许对顶级组件进行排序，不允许对子组件进行排序
      filter: '.component-order-item > .ml-6',
      onEnd: (evt) => {
        // 只处理顶级组件的排序
        if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
          // 获取当前的顶级组件
          const currentTopLevel = [...topLevelComponents.value];
          
          // 从顶级组件中移动元素
          const movedItem = currentTopLevel.splice(evt.oldIndex, 1)[0];
          currentTopLevel.splice(evt.newIndex, 0, movedItem);
          
          // 构建新的组件顺序：先放顶级组件，再放子组件
          const newComponents: typeof components.value = [];
          const processedComponentIds = new Set<string>();
          
          // 先添加顶级组件
          currentTopLevel.forEach(component => {
            newComponents.push(component);
            processedComponentIds.add(component.id);
            
            // 如果是容器组件，添加其所有子组件
            if (isContainerComponent(component)) {
              component.children.forEach(childId => {
                const childComponent = components.value.find(c => c.id === childId);
                if (childComponent && !processedComponentIds.has(childComponent.id)) {
                  newComponents.push(childComponent);
                  processedComponentIds.add(childComponent.id);
                }
              });
            }
          });
          
          // 添加剩余的组件（如果有的话）
          components.value.forEach(component => {
            if (!processedComponentIds.has(component.id)) {
              newComponents.push(component);
              processedComponentIds.add(component.id);
            }
          });
          
          // 更新组件顺序
          componentStore.reorderComponents(newComponents);
        }
      }
    });
  }
});

function onDragStart(event: DragEvent, item: any) {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('componentType', item.type);
    // 添加拖拽开始时的视觉反馈
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.classList.add('opacity-50', 'scale-95');
    }
  }
}

function onDrag(event: DragEvent) {
  // 拖拽过程中的视觉反馈
  if (event.currentTarget instanceof HTMLElement) {
    // 可以在这里添加更多拖拽中的视觉效果
  }
}

function onDragEnd(event: DragEvent) {
  // 拖拽结束时恢复原始样式
  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget.classList.remove('opacity-50', 'scale-95');
  }
}

function onItemMouseEnter(componentId: string) {
  // 鼠标悬停在组件顺序项上的额外效果
  const element = document.querySelector(`[data-component-id="${componentId}"]`);
  if (element instanceof HTMLElement) {
    // 可以在这里添加更多鼠标悬停效果
  }
}

function onItemMouseLeave() {
  // 鼠标离开组件顺序项时的清理
}

function selectComponent(id: string) {
  componentStore.selectComponent(id);

  // 自动滚动到选中的组件
  setTimeout(() => {
    const selectedElement = document.querySelector(`.component-wrapper.relative.group.selected`);
    if (selectedElement && sortableList.value) {
      selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
}

// 删除组件
function deleteComponent(id: string) {
  componentStore.removeComponent(id);
}

function getIconClass(componentType: string): string {
  // 根据组件类型返回不同的背景色
  const iconClasses: Record<string, string> = {
    text: 'bg-blue-100 text-blue-600',
    image: 'bg-purple-100 text-purple-600',
    carousel: 'bg-pink-100 text-pink-600',
    container: 'bg-indigo-100 text-indigo-600',
    floatingButton: 'bg-orange-100 text-orange-600',
    banner: 'bg-green-100 text-green-600',
    category: 'bg-amber-100 text-amber-600',
    productRank: 'bg-red-100 text-red-600',
    productGroup: 'bg-cyan-100 text-cyan-600'
  };

  return iconClasses[componentType] || 'bg-gray-100 text-gray-600';
}
</script>