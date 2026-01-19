<template>
  <div class="carousel-component" :class="{ 'selected': isSelected }" @click="selectComponent" :style="componentStyles">
    <div class="relative overflow-hidden">
      <!-- 轮播图容器 -->
      <div class="carousel" :style="{ width: `${component.width}px`, height: `${component.height}px` }">
        <!-- 轮播项容器 -->
        <div class="carousel-inner">
          <!-- 轮播项 -->
          <div 
            v-for="(image, index) in component.images" 
            :key="index" 
            :class="['carousel-item', { 
              'active': index === activeIndex,
              'prev': index === (activeIndex - 1 + component.images.length) % component.images.length,
              'next': index === (activeIndex + 1) % component.images.length
            }]"
          >
            <a v-if="image.link" :href="image.link" target="_blank" class="block w-full h-full">
              <img :src="image.url" :alt="`Slide ${index + 1}`" class="w-full h-full object-cover" />
            </a>
            <img v-else :src="image.url" :alt="`Slide ${index + 1}`" class="w-full h-full object-cover" />
          </div>
        </div>
        
        <!-- 指示器 -->
        <div v-if="component.showIndicators !== false && component.images.length > 1" class="carousel-indicators">
          <button
            v-for="(image, index) in component.images"
            :key="index"
            :class="['indicator', { 'active': index === activeIndex }]"
            @click.stop="goToSlide(index)"
            :title="`跳转到第${index + 1}张`"
          ></button>
        </div>
        
        <!-- 控制按钮 -->
        <div v-if="component.showControls !== false && component.images.length > 1" class="carousel-control">
          <button 
            class="control-btn prev"
            @click.stop="prevSlide"
            title="上一张"
          >
            &lt;
          </button>
          <button 
            class="control-btn next"
            @click.stop="nextSlide"
            title="下一张"
          >
            &gt;
          </button>
        </div>
      </div>
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

// 手动管理轮播图的active状态
const activeIndex = ref(0);
let intervalId: number | null = null;

// 监听图片变化，重置active索引
watch(() => props.component.images, () => {
  activeIndex.value = 0;
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

// 切换到指定索引
function goToSlide(index: number) {
  activeIndex.value = index;
}

// 上一张
function prevSlide() {
  activeIndex.value = (activeIndex.value - 1 + props.component.images.length) % props.component.images.length;
}

// 下一张
function nextSlide() {
  activeIndex.value = (activeIndex.value + 1) % props.component.images.length;
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

.carousel {
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.carousel-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-item {
  position: absolute;
  inset: 0;
  transition: all 0.5s ease;
  opacity: 0;
  visibility: hidden;
  transform: translateX(100%);
  z-index: 0;

  &.active {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
    z-index: 2;
  }

  // 上一个和下一个状态，用于首尾衔接效果
  &.prev {
    transform: translateX(-100%);
    z-index: 1;
  }

  &.next {
    transform: translateX(100%);
    z-index: 1;
  }
}

/* 指示器样式 */
.carousel-indicators {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 5px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.3s ease;

  &.active {
    background-color: white;
  }
}

/* 控制按钮样式 */
.carousel-control {
  position: relative;
}

.control-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;
}

.carousel:hover .control-btn {
  opacity: 1;
}

.control-btn.prev {
  left: 10px;
}

.control-btn.next {
  right: 10px;
}
</style>