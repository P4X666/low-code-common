<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">属性设置</h2>
    
    <div v-if="selectedComponent">
      <!-- 通用属性 -->
      <div class="mb-4">
        <h3 class="text-lg font-medium mb-2">通用属性</h3>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">组件ID</label>
          <input 
            type="text" 
            v-model="customId" 
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': idError }"
            placeholder="请输入唯一的组件ID"
            @input="validateId"
            @blur="updateCustomId"
          />
          <p v-if="idError" class="text-red-500 text-xs mt-1">{{ idError }}</p>
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">组件名称</label>
          <input 
            type="text" 
            v-model="customName" 
            class="w-full px-3 py-2 border rounded"
            placeholder="请输入组件名称"
            @blur="updateCustomName"
          />
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">系统名称</label>
          <input 
            type="text" 
            v-model="selectedComponent.name" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">链接</label>
          <input 
            type="text" 
            v-model="selectedComponent.link" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
      </div>
      
      <!-- 文本组件特有属性 -->
      <div v-if="selectedComponent.type === 'text'" class="mb-4">
        <h3 class="text-lg font-medium mb-2">文本属性</h3>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">内容</label>
          <textarea 
            v-model="selectedComponent.content" 
            class="w-full px-3 py-2 border rounded"
            rows="3"
            @change="updateComponent"
          ></textarea>
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">字体大小</label>
          <input 
            type="number" 
            v-model="selectedComponent.fontSize" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">颜色</label>
          <input 
            type="color" 
            v-model="selectedComponent.color" 
            class="w-full h-10"
            @change="updateComponent"
          />
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">字体粗细</label>
          <select 
            v-model="selectedComponent.fontWeight" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          >
            <option value="normal">正常</option>
            <option value="bold">粗体</option>
            <option value="lighter">细体</option>
          </select>
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">字体样式</label>
          <select 
            v-model="selectedComponent.fontStyle" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          >
            <option value="normal">正常</option>
            <option value="italic">斜体</option>
          </select>
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">文本对齐</label>
          <select 
            v-model="selectedComponent.textAlign" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          >
            <option value="left">左对齐</option>
            <option value="center">居中</option>
            <option value="right">右对齐</option>
            <option value="justify">两端对齐</option>
          </select>
        </div>
      </div>
      
      <!-- 图片组件特有属性 -->
      <div v-if="selectedComponent.type === 'image'" class="mb-4">
        <h3 class="text-lg font-medium mb-2">图片属性</h3>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">图片地址</label>
          <input 
            type="text" 
            v-model="selectedComponent.src" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
        
        <div class="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label class="block text-sm font-medium mb-1">宽度</label>
            <input 
              type="number" 
              v-model="selectedComponent.width" 
              class="w-full px-3 py-2 border rounded"
              @change="updateComponent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">高度</label>
            <input 
              type="number" 
              v-model="selectedComponent.height" 
              class="w-full px-3 py-2 border rounded"
              @change="updateComponent"
            />
          </div>
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">填充方式</label>
          <select 
            v-model="selectedComponent.objectFit" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          >
            <option value="cover">覆盖(cover)</option>
            <option value="contain">包含(contain)</option>
            <option value="fill">填充(fill)</option>
            <option value="none">无(none)</option>
          </select>
        </div>
        
        <div class="mb-2">
          <label class="flex items-center">
            <input 
              type="checkbox" 
              v-model="selectedComponent.hover" 
              class="mr-2"
              @change="updateComponent"
            />
            <span class="text-sm font-medium">悬停效果</span>
          </label>
        </div>
      </div>
      
      <!-- 轮播图组件特有属性 -->
      <div v-if="selectedComponent.type === 'carousel'" class="mb-4">
        <h3 class="text-lg font-medium mb-2">轮播图属性</h3>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">图片列表 (每行一个URL)</label>
          <textarea 
            v-model="carouselImages" 
            class="w-full px-3 py-2 border rounded"
            rows="4"
            @change="updateCarouselImages"
          ></textarea>
        </div>
        
        <div class="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label class="block text-sm font-medium mb-1">宽度</label>
            <input 
              type="number" 
              v-model="selectedComponent.width" 
              class="w-full px-3 py-2 border rounded"
              @change="updateComponent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">高度</label>
            <input 
              type="number" 
              v-model="selectedComponent.height" 
              class="w-full px-3 py-2 border rounded"
              @change="updateComponent"
            />
          </div>
        </div>
        
        <div class="mb-2">
          <label class="flex items-center">
            <input 
              type="checkbox" 
              v-model="selectedComponent.autoplay" 
              class="mr-2"
              @change="updateComponent"
            />
            <span class="text-sm font-medium">自动播放</span>
          </label>
        </div>
        
        <div v-if="selectedComponent.autoplay" class="mb-2">
          <label class="block text-sm font-medium mb-1">播放间隔 (毫秒)</label>
          <input 
            type="number" 
            v-model="selectedComponent.interval" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
        
        <div class="mb-2">
          <label class="flex items-center">
            <input 
              type="checkbox" 
              v-model="selectedComponent.showIndicators" 
              class="mr-2"
              @change="updateComponent"
            />
            <span class="text-sm font-medium">显示指示器</span>
          </label>
        </div>
        
        <div class="mb-2">
          <label class="flex items-center">
            <input 
              type="checkbox" 
              v-model="selectedComponent.showControls" 
              class="mr-2"
              @change="updateComponent"
            />
            <span class="text-sm font-medium">显示控制按钮</span>
          </label>
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">过渡效果</label>
          <select 
            v-model="selectedComponent.transitionEffect" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          >
            <option value="slide">滑动</option>
            <option value="fade">淡入淡出</option>
          </select>
        </div>
      </div>
      
      <!-- 样式编辑器 -->
      <StyleEditor 
        v-if="selectedComponent" 
        :componentId="selectedComponent.id" 
      />
    </div>
    
    <div v-else class="text-center text-gray-500 py-8">
      请选择一个组件进行编辑
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useComponentStore } from '../../stores/componentStore';
import type { Component } from '../../types/component';
import StyleEditor from './StyleEditor.vue';

const componentStore = useComponentStore();

const selectedComponent = computed<Component | null>(() => {
  return componentStore.getSelectedComponent;
});

// 自定义ID和名称
const customId = ref('');
const customName = ref('');
const idError = ref('');

// 监听选中组件变化，更新自定义ID和名称
watch(selectedComponent, (newComponent) => {
  if (newComponent) {
    customId.value = newComponent.customId || '';
    customName.value = newComponent.customName || '';
    if (newComponent.type === 'carousel') {
      carouselImages.value = newComponent.images.join('\n');
    }
  } else {
    customId.value = '';
    customName.value = '';
    idError.value = '';
  }
}, { immediate: true });

// ID唯一性验证
function validateId() {
  idError.value = '';
  if (!customId.value.trim()) {
    return;
  }
  
  const existingComponent = componentStore.components.find(
    comp => comp.customId === customId.value.trim() && comp.id !== selectedComponent.value?.id
  );
  
  if (existingComponent) {
    idError.value = '该ID已存在，请使用唯一的ID';
  }
}

// 更新自定义ID
function updateCustomId() {
  if (selectedComponent.value && !idError.value) {
    componentStore.updateComponent(selectedComponent.value.id, {
      ...selectedComponent.value,
      customId: customId.value.trim() || undefined
    });
  }
}

// 更新自定义名称
function updateCustomName() {
  if (selectedComponent.value) {
    componentStore.updateComponent(selectedComponent.value.id, {
      ...selectedComponent.value,
      customName: customName.value.trim() || undefined
    });
  }
}

// 轮播图图片列表处理
const carouselImages = ref('');

function updateComponent() {
  if (selectedComponent.value) {
    componentStore.updateComponent(selectedComponent.value.id, selectedComponent.value);
  }
}

function updateCarouselImages() {
  if (selectedComponent.value && selectedComponent.value.type === 'carousel') {
    const images = carouselImages.value
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    componentStore.updateComponent(selectedComponent.value.id, {
      ...selectedComponent.value,
      images
    });
  }
}
</script>

<style scoped lang="less">
.properties-panel {
  height: 100%;
  overflow-y: auto;
  
  .section {
    margin-bottom: 16px;
    border-bottom: 1px solid #eee;
    padding-bottom: 12px;
    
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>