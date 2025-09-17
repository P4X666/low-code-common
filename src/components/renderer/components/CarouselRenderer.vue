<template>
  <div 
    class="carousel-component"
    :class="{ 'selected': isSelected }"
    @click="selectComponent"
    :style="componentStyles"
  >
    <div class="carousel-container" :style="{ width: `${component.width}px`, height: `${component.height}px` }">
      <div class="carousel-inner" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div 
          v-for="(image, index) in component.images" 
          :key="index" 
          class="carousel-item"
        >
          <a v-if="component.link" :href="component.link" target="_blank">
            <img :src="image" :alt="`Slide ${index + 1}`" />
          </a>
          <img v-else :src="image" :alt="`Slide ${index + 1}`" />
        </div>
      </div>
      
      <div v-if="component.showIndicators !== false && component.images.length > 1" class="carousel-indicators">
        <button 
          v-for="(_, index) in component.images" 
          :key="index"
          class="indicator"
          :class="{ 'active': index === currentIndex }"
          @click.stop="goToSlide(index)"
        ></button>
      </div>
      
      <button v-if="component.showControls !== false && component.images.length > 1" class="carousel-control prev" @click.stop="prevSlide">&lt;</button>
      <button v-if="component.showControls !== false && component.images.length > 1" class="carousel-control next" @click.stop="nextSlide">&gt;</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import { useComponentStore } from '../../../stores/componentStore';
import type { CarouselComponent } from '../../../types/component';

const props = defineProps<{
  component: CarouselComponent
}>();

const componentStore = useComponentStore();
const isSelected = computed(() => componentStore.selectedComponentId === props.component.id);
const currentIndex = ref(0);
let intervalId: number | null = null;

// 计算组件样式
const componentStyles = computed(() => {
  const style = props.component.style || {};
  return {
    margin: style.margin ? `${style.margin.top}px ${style.margin.right}px ${style.margin.bottom}px ${style.margin.left}px` : '',
    padding: style.padding ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px` : '',
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

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % props.component.images.length;
}

function prevSlide() {
  currentIndex.value = (currentIndex.value - 1 + props.component.images.length) % props.component.images.length;
}

function goToSlide(index: number) {
  currentIndex.value = index;
}

function startAutoplay() {
  if (props.component.autoplay && props.component.interval > 0) {
    intervalId = window.setInterval(() => {
      nextSlide();
    }, props.component.interval);
  }
}

function stopAutoplay() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

watch(() => props.component.autoplay, (newValue) => {
  if (newValue) {
    startAutoplay();
  } else {
    stopAutoplay();
  }
});

watch(() => props.component.interval, () => {
  if (props.component.autoplay) {
    stopAutoplay();
    startAutoplay();
  }
});

onMounted(() => {
  if (props.component.autoplay) {
    startAutoplay();
  }
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<style scoped lang="less">
.carousel-component {
  padding: 8px;
  cursor: pointer;
  
  &.selected {
    outline: 2px solid #3b82f6;
    background-color: rgba(59, 130, 246, 0.1);
  }
}

.carousel-container {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  
  .carousel-inner {
    display: flex;
    transition: transform 0.5s ease;
    height: 100%;
    
    .carousel-item {
      flex: 0 0 100%;
      width: 100%;
      height: 100%;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  
  .carousel-indicators {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 2;
    
    .indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.5);
      border: none;
      padding: 0;
      cursor: pointer;
      
      &.active {
        background-color: white;
      }
    }
  }
  
  .carousel-control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
    
    &.prev {
      left: 10px;
    }
    
    &.next {
      right: 10px;
    }
  }
}
</style>