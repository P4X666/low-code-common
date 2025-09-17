<template>
  <div class="style-editor">
    <h3 class="text-lg font-medium mb-3">样式编辑</h3>
    
    <!-- 尺寸与间距 -->
    <div class="style-section">
      <h4 class="text-sm font-medium mb-2">尺寸与间距</h4>
      
      <!-- 外边距 -->
      <div class="mb-3">
        <label class="block text-sm mb-1">外边距 (Margin)</label>
        <div class="spacing-control">
          <div class="spacing-inputs">
            <input type="number" v-model="margin.top" class="border rounded px-1 py-1 text-xs" />
            <input type="number" v-model="margin.right" class="border rounded px-1 py-1 text-xs" />
            <input type="number" v-model="margin.bottom" class="border rounded px-1 py-1 text-xs" />
            <input type="number" v-model="margin.left" class="border rounded px-1 py-1 text-xs" />
          </div>
          <div class="spacing-labels">
            <span>上</span>
            <span>右</span>
            <span>下</span>
            <span>左</span>
          </div>
        </div>
      </div>
      
      <!-- 内边距 -->
      <div class="mb-3">
        <label class="block text-sm mb-1">内边距 (Padding)</label>
        <div class="spacing-control">
          <div class="spacing-inputs">
            <input type="number" v-model="padding.top" class="border rounded px-1 py-1 text-xs" />
            <input type="number" v-model="padding.right" class="border rounded px-1 py-1 text-xs" />
            <input type="number" v-model="padding.bottom" class="border rounded px-1 py-1 text-xs" />
            <input type="number" v-model="padding.left" class="border rounded px-1 py-1 text-xs" />
          </div>
          <div class="spacing-labels">
            <span>上</span>
            <span>右</span>
            <span>下</span>
            <span>左</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 边框与背景 -->
    <div class="style-section">
      <h4 class="text-sm font-medium mb-2">边框与背景</h4>
      
      <!-- 背景色 -->
      <div class="mb-3">
        <label class="block text-sm mb-1">背景颜色</label>
        <div class="color-picker">
          <input type="color" v-model="backgroundColor" class="w-8 h-8 border-0" />
          <input type="text" v-model="backgroundColor" class="border rounded px-2 py-1 text-xs flex-1" />
        </div>
      </div>
      
      <!-- 边框 -->
      <div class="mb-3 grid grid-cols-2 gap-2">
        <div>
          <label class="block text-sm mb-1">边框宽度</label>
          <input type="number" v-model="borderWidth" class="border rounded px-2 py-1 text-xs w-full" />
        </div>
        <div>
          <label class="block text-sm mb-1">边框圆角</label>
          <input type="number" v-model="borderRadius" class="border rounded px-2 py-1 text-xs w-full" />
        </div>
      </div>
      
      <div class="mb-3 grid grid-cols-2 gap-2">
        <div>
          <label class="block text-sm mb-1">边框颜色</label>
          <div class="color-picker">
            <input type="color" v-model="borderColor" class="w-6 h-6 border-0" />
            <input type="text" v-model="borderColor" class="border rounded px-2 py-1 text-xs flex-1" />
          </div>
        </div>
        <div>
          <label class="block text-sm mb-1">边框样式</label>
          <select v-model="borderStyle" class="border rounded px-2 py-1 text-xs w-full">
            <option value="none">无</option>
            <option value="solid">实线</option>
            <option value="dashed">虚线</option>
            <option value="dotted">点线</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- 效果 -->
    <div class="style-section">
      <h4 class="text-sm font-medium mb-2">效果</h4>
      
      <!-- 透明度 -->
      <div class="mb-3">
        <label class="block text-sm mb-1">透明度: {{ opacity }}</label>
        <input type="range" v-model="opacity" min="0" max="1" step="0.1" class="w-full" />
      </div>
      
      <!-- 阴影 -->
      <div class="mb-3">
        <label class="block text-sm mb-1">阴影</label>
        <select v-model="boxShadow" class="border rounded px-2 py-1 text-xs w-full">
          <option value="none">无阴影</option>
          <option value="0 1px 3px rgba(0,0,0,0.12)">轻微阴影</option>
          <option value="0 4px 6px rgba(0,0,0,0.1)">中等阴影</option>
          <option value="0 10px 15px rgba(0,0,0,0.1)">强烈阴影</option>
        </select>
      </div>
    </div>
    
    <button @click="applyStyles" class="bg-blue-500 text-white px-3 py-1 rounded text-sm mt-3">
      应用样式
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useComponentStore } from '../../stores/componentStore';
import type { StyleProperties, Component } from '../../types/component';

const props = defineProps<{
  componentId: string;
}>();

const componentStore = useComponentStore();
const component = ref<Component | null>(null);

// 样式属性
const margin = ref({ top: 0, right: 0, bottom: 0, left: 0 });
const padding = ref({ top: 0, right: 0, bottom: 0, left: 0 });
const borderRadius = ref(0);
const backgroundColor = ref('');
const borderWidth = ref(0);
const borderColor = ref('#000000');
const borderStyle = ref<'none' | 'solid' | 'dashed' | 'dotted'>('none');
const boxShadow = ref('none');
const opacity = ref(1);

// 监听组件ID变化，加载组件样式
watch(() => props.componentId, loadComponentStyles, { immediate: true });

// 加载组件样式
function loadComponentStyles() {
  if (!props.componentId) return;
  
  component.value = componentStore.getComponentById(props.componentId);
  if (!component.value) return;
  
  // 加载现有样式
  const style = component.value.style || {};
  
  // 设置默认值
  margin.value = style.margin || { top: 0, right: 0, bottom: 0, left: 0 };
  padding.value = style.padding || { top: 0, right: 0, bottom: 0, left: 0 };
  borderRadius.value = style.borderRadius || 0;
  backgroundColor.value = style.backgroundColor || '';
  borderWidth.value = style.borderWidth || 0;
  borderColor.value = style.borderColor || '#000000';
  borderStyle.value = style.borderStyle || 'none';
  boxShadow.value = style.boxShadow || 'none';
  opacity.value = style.opacity || 1;
}

// 应用样式到组件
function applyStyles() {
  if (!component.value) return;
  
  const updatedStyle: StyleProperties = {
    margin: margin.value,
    padding: padding.value,
    borderRadius: borderRadius.value,
    backgroundColor: backgroundColor.value,
    borderWidth: borderWidth.value,
    borderColor: borderColor.value,
    borderStyle: borderStyle.value,
    boxShadow: boxShadow.value,
    opacity: opacity.value
  };
  
  componentStore.updateComponentStyle(props.componentId, updatedStyle);
}
</script>

<style scoped lang="less">
.style-editor {
  padding: 12px;
  
  .style-section {
    margin-bottom: 16px;
    border-bottom: 1px solid #eee;
    padding-bottom: 12px;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .color-picker {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .spacing-control {
    .spacing-inputs {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
    }
    
    .spacing-labels {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      text-align: center;
      font-size: 10px;
      color: #666;
      margin-top: 2px;
    }
  }
}
</style>