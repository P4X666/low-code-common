<template>
  <div class="low-code-container">
    <div class="editor-area">
      <EditorPanel />
    </div>
    <div class="render-area">
      <RendererPanel />
    </div>
    <div class="properties-area">
      <PropertiesPanel />
    </div>

    <!-- 页面配置悬浮按钮 -->
    <button 
      class="config-float-button" 
      @click="toggleConfigDrawer"
      title="页面配置"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>

    <!-- 页面配置抽屉 -->
    <div v-if="showConfigDrawer" class="config-drawer-overlay" @click="toggleConfigDrawer"></div>
    <div class="config-drawer" :class="{ 'open': showConfigDrawer }">
      <PageConfig />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EditorPanel from './components/editor/EditorPanel.vue';
import RendererPanel from './components/renderer/RendererPanel.vue';
import PropertiesPanel from './components/properties/PropertiesPanel.vue';
import PageConfig from './components/PageConfig.vue';

// 控制配置抽屉显示状态
const showConfigDrawer = ref(false);

// 切换配置抽屉显示/隐藏
const toggleConfigDrawer = () => {
  showConfigDrawer.value = !showConfigDrawer.value;
};
</script>
