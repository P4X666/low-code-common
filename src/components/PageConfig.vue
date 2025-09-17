<template>
  <div class="config-container">
    <!-- 页面配置 -->
    <div class="page-config mb-6">
      <h3 class="text-lg font-semibold mb-4">页面配置</h3>
      
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

    <!-- 项目管理 -->
    <ProjectManager />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useComponentStore } from '../stores/componentStore';
import ProjectManager from './ProjectManager.vue';

const componentStore = useComponentStore();

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
.config-container {
  padding: 16px;
}

.page-config {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
}
</style>