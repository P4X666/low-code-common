<template>
  <div class="drawer-content">
    <!-- 抽屉标题栏 -->
    <div class="drawer-header">
      <h3 class="text-lg font-semibold">页面配置</h3>
    </div>

    <!-- 页面配置内容 -->
    <div class="page-config">
      <div class="space-y-4">
        <!-- 页面标题 -->
        <div>
          <label class="block text-sm font-medium mb-2">页面标题</label>
          <input
            v-model="localConfig.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入页面标题"
          />
        </div>

        <!-- 背景颜色 -->
        <div>
          <label class="block text-sm font-medium mb-2">背景颜色</label>
          <div class="flex items-center space-x-2">
            <input
              v-model="localConfig.backgroundColor"
              type="color"
              class="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              v-model="localConfig.backgroundColor"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#ffffff"
            />
          </div>
        </div>

        <!-- 背景图片 -->
        <div>
          <label class="block text-sm font-medium mb-2">背景图片URL</label>
          <input
            v-model="localConfig.backgroundImage"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入图片URL"
          />
        </div>

        <!-- 预览 -->
        <div v-if="localConfig.backgroundImage" class="mt-4">
          <label class="block text-sm font-medium mb-2">背景预览</label>
          <div 
            class="w-full h-20 border border-gray-300 rounded-md bg-cover bg-center"
            :style="{
              backgroundColor: localConfig.backgroundColor,
              backgroundImage: localConfig.backgroundImage ? `url(${localConfig.backgroundImage})` : 'none'
            }"
          ></div>
        </div>

        <!-- 应用按钮 -->
        <button
          @click="applyConfig"
          class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          应用配置
        </button>
      </div>
    </div>

    <!-- API管理 -->
    <div class="api-manager-section">
      <APIManager />
    </div>

    <!-- 项目管理 -->
    <div class="project-manager-section">
      <ProjectManager />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useComponentStore } from '../stores/componentStore';
import ProjectManager from './ProjectManager.vue';
import APIManager from './properties/APIManager.vue';
import { useAPIStore } from '../stores/apiStore';

const componentStore = useComponentStore();
const apiStore = useAPIStore();

const localConfig = ref({
  title: componentStore.pageConfig.title,
  backgroundColor: componentStore.pageConfig.backgroundColor,
  backgroundImage: componentStore.pageConfig.backgroundImage
});

// 监听store中的配置变化
watch(() => componentStore.pageConfig, (newConfig) => {
  localConfig.value = { ...newConfig };
}, { deep: true });

const applyConfig = () => {
  componentStore.updatePageConfig(localConfig.value);
};
</script>

<style scoped>
.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.drawer-header {
  padding: 16px;
  border-bottom: 1px solid #eaecf0;
  background-color: #f9fafb;
  position: sticky;
  top: 0;
  z-index: 10;
}

.page-config {
  padding: 16px;
  background: white;
}

.api-manager-section {
  padding: 16px;
  background: white;
  border-top: 1px solid #eaecf0;
}

.project-manager-section {
  padding: 0 16px 16px;
  border-top: 1px solid #eaecf0;
}
</style>