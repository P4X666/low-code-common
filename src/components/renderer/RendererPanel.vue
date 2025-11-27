<template>
  <div class="component-preview-container bg-white border border-gray-100 shadow-md">
    <!-- 页面标题 -->
    <div class="page-title px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 shadow-sm">
      <h2 class="text-lg sm:text-xl font-medium text-gray-800 tracking-tight text-center">{{ pageConfig.title || '页面预览' }}</h2>
    </div>
    
    <!-- <div class="h-32 relative">
      <div 
        class="logo-name absolute"
      >WEFOR</div>
      <img src="@/assets/images/phone-header.png" alt="phone-header" />
    </div> -->
    <div 
      ref="sortableContainer"
      class="component-preview h-full p-4 sm:p-6" 
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
      <div v-if="components.length === 0" class="flex flex-col items-center justify-center min-h-[200px] text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-blue-400 mb-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="text-lg font-medium mb-2">开始创建您的页面</h3>
        <p class="max-w-md mb-4">从左侧组件库拖拽组件到此处，构建您的页面内容</p>
        <span class="text-sm text-blue-500 flex items-center animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          拖拽到这里
        </span>
      </div>
      <template v-else>
        <!-- 只渲染顶级组件，容器内的子组件由容器组件自己渲染 -->
        <div 
          v-for="comp in topLevelComponents" 
          :key="comp.id" 
          class="component-wrapper relative group"
          :class="{ 'selected': comp.id === componentStore.selectedComponentId }"
          @click="selectComponent(comp.id)"
        >
          <component 
            :is="getComponentByType(comp.type)" 
            :component="comp as any" 
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
      },
      {        
        type: 'banner', createDefault: () => ({
          id: crypto.randomUUID(),
          type: 'banner',
          name: 'Banner组件',
          title: 'Banner标题',
          images: [{ url: 'https://picsum.photos/750/200?random=10', link: '#' }],
          width: 450,
          height: 200
        })
      },
      {
        type: 'category', createDefault: () => ({
          id: crypto.randomUUID(),
          type: 'category',
          name: '热门类目组件',
          title: '热门类目',
          bigImage: { url: 'https://picsum.photos/300/300?random=11', link: '#' },
          smallImages: [
            { url: 'https://picsum.photos/100/100?random=12', link: '#', text: '类目1' },
            { url: 'https://picsum.photos/100/100?random=13', link: '#', text: '类目2' },
            { url: 'https://picsum.photos/100/100?random=14', link: '#', text: '类目3' },
            { url: 'https://picsum.photos/100/100?random=15', link: '#', text: '类目4' },
            { url: 'https://picsum.photos/100/100?random=16', link: '#', text: '类目5' },
            { url: 'https://picsum.photos/100/100?random=17', link: '#', text: '类目6' }
          ],
          width: 450,
          height: 300
        })
      },
      {
        type: 'productRank', createDefault: () => ({
          id: crypto.randomUUID(),
          type: 'productRank',
          name: '商品排行组件',
          title: '商品排行榜',
          subtitle: '热门商品推荐',
          dataSource: 'ranking',
          buttonText: '查看全部',
          buttonLink: '#',
          width: 750,
          height: 350
        })
      },
      {
        type: 'productGroup', createDefault: () => ({
          id: crypto.randomUUID(),
          type: 'productGroup',
          name: '商品分组组件',
          title: '商品分类',
          groups: [
            {
              title: '分类一',
              images: [
                { url: 'https://picsum.photos/200/200?random=18', link: '#' },
                { url: 'https://picsum.photos/200/200?random=19', link: '#' },
                { url: 'https://picsum.photos/200/200?random=20', link: '#' }
              ]
            },
            {
              title: '分类二',
              images: [
                { url: 'https://picsum.photos/200/200?random=21', link: '#' },
                { url: 'https://picsum.photos/200/200?random=22', link: '#' }
              ]
            }
          ],
          buttonText: '全部商品',
          buttonLink: '#',
          width: 750,
          height: 400
        })
      },
      {
        type: 'container', createDefault: () => ({
          id: crypto.randomUUID(),
          type: 'container',
          name: '容器组件',
          children: []
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
  
  &.selected {
    /* 更醒目的选中效果 */
    outline: 2px solid #3b82f6;
    outline-offset: 3px;
    background-color: rgba(59, 130, 246, 0.05);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    transform: translateY(-1px);
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
</style>
