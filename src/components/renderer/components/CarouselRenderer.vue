<template>
  <div class="carousel-component" :class="{ 'selected': isSelected }" @click="selectComponent" :style="componentStyles">
    <div class="relative overflow-hidden">
      <!-- 使用daisyui的carousel组件 -->
      <div 
        class="carousel w-full" 
        :class="{
          'carousel-center': true,
          'carousel-animate-slide': component.transitionEffect === 'slide',
          'carousel-animate-fade': component.transitionEffect === 'fade',
          'w-full': true
        }"
        :style="{ width: `${component.width}px`, height: `${component.height}px` }"
      >
        <!-- 轮播项 -->
        <div 
          v-for="(image, index) in component.images" 
          :key="index" 
          class="carousel-item"
          :class="{ 'active': index === activeIndex }"
        >
          <a v-if="image.link" :href="image.link" target="_blank" class="block w-full h-full">
            <img 
              :src="image.url" 
              :alt="`Slide ${index + 1}`" 
              class="w-full h-full object-cover" 
              @error="handleImageError($event, image)"
            />
          </a>
          <img 
            v-else 
            :src="image.url" 
            :alt="`Slide ${index + 1}`" 
            class="w-full h-full object-cover" 
            @error="handleImageError($event, image)"
          />
        </div>
        
        <!-- 指示器 -->
        <div v-if="component.showIndicators !== false && component.images.length > 1" class="carousel-indicators absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <button
            v-for="(image, index) in component.images"
            :key="index"
            class="indicator border-2 border-white w-3 h-3 rounded-full mx-1"
            :class="{ 'bg-white': index === activeIndex }"
            @click.stop="goToSlide(index)"
            :title="`跳转到第${index + 1}张`"
          ></button>
        </div>
      </div>
      <!-- 控制按钮 -->
      <button 
        v-if="component.showControls !== false && component.images.length > 1" 
        class="btn btn-circle absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white z-10"
        @click.stop="prevSlide"
        title="上一张"
      >
        ❮
      </button>
      <button 
        v-if="component.showControls !== false && component.images.length > 1" 
        class="btn btn-circle absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white z-10"
        @click.stop="nextSlide"
        title="下一张"
      >
        ❯
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, onUnmounted } from 'vue';
import { useComponentStore } from '../../../stores/componentStore';
import type { CarouselComponent } from '../../../types/component';
import { parseSpacing } from '@/utils/common';

const props = defineProps<{
  component: CarouselComponent;
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

// 手动管理轮播图的active状态，用于控制指示器和过渡效果
const activeIndex = ref(0);
let intervalId: number | null = null;

// 监听图片变化，重置active索引
watch(() => props.component.images, (newImages, oldImages) => {
  // 只有当图片数量发生变化时才重置activeIndex，避免编辑图片URL时重置
  if (newImages.length !== oldImages?.length) {
    activeIndex.value = 0;
  }
});

// 监听autoplay和interval变化，重置自动播放
watch([() => props.component.autoplay, () => props.component.interval], () => {
  startAutoplay();
});

// 开始自动播放
function startAutoplay() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  
  if (props.component.autoplay && props.component.images.length > 1) {
    // 使用默认值3000ms或配置的值
    const interval = props.component.interval || 3000;
    intervalId = window.setInterval(() => {
      activeIndex.value = (activeIndex.value + 1) % props.component.images.length;
    }, interval);
  }
}

// 图片加载错误处理
function handleImageError(event: Event, image: any) {
  // 设置默认占位图片
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="50" font-size="12" fill="%239ca3af" text-anchor="middle" dy=".3em"%3E图片加载失败%3C/text%3E%3C/svg%3E';
}

// 上一张
function prevSlide() {
  if (props.component.images.length === 0) return;
  activeIndex.value = (activeIndex.value - 1 + props.component.images.length) % props.component.images.length;
}

// 下一张
function nextSlide() {
  if (props.component.images.length === 0) return;
  activeIndex.value = (activeIndex.value + 1) % props.component.images.length;
}

// 切换到指定索引
function goToSlide(index: number) {
  if (index < 0 || index >= props.component.images.length) return;
  activeIndex.value = index;
}

onMounted(() => {
  startAutoplay();
});

// 清理定时器
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped lang="less">
.carousel-component {
  padding: 8px;
  cursor: pointer;
}

/* 选中状态样式 */
.carousel-component.selected {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* 轮播图容器基础样式 */
.carousel {
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

/* 轮播项基础样式 */
.carousel-item {
  position: relative;
  display: none;
  width: 100%;
  height: 100%;
  transition: all 0.5s ease;
}

/* 当前活动轮播项样式 */
.carousel-item.active {
  display: block;
}

/* 确保图片正确显示 */
.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .carousel {
    width: 100% !important;
    height: auto !important;
    aspect-ratio: 16/9;
  }
  
  .btn-circle {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
  
  .indicator {
    width: 6px;
    height: 6px;
  }
}

@media (max-width: 480px) {
  .btn-circle {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
  
  .indicator {
    width: 5px;
    height: 5px;
    margin: 0 2px;
  }
}
</style>