<template>
  <div class="project-manager">
    <h3 class="text-lg font-semibold mb-4">项目管理</h3>
    
    <div class="space-y-3">
      <!-- 保存项目 -->
      <button
        @click="saveProject"
        class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        保存项目
      </button>

      <!-- 加载项目 -->
      <div class="relative">
        <input
          ref="fileInput"
          type="file"
          accept=".json"
          @change="handleFileSelect"
          class="hidden"
        />
        <button
          @click="triggerFileSelect"
          class="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
          </svg>
          加载项目
        </button>
      </div>

      <!-- 新建项目 -->
      <button
        @click="newProject"
        class="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        新建项目
      </button>

      <!-- 状态提示 -->
      <div v-if="message" :class="messageClass" class="p-3 rounded-md text-sm">
        {{ message }}
      </div>
    </div>

    <!-- 项目信息 -->
    <div class="mt-6 p-3 bg-gray-50 rounded-md">
      <h4 class="text-sm font-medium mb-2">项目信息</h4>
      <div class="text-xs text-gray-600 space-y-1">
        <div>组件数量: {{ componentCount }}</div>
        <div>页面标题: {{ pageTitle }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useComponentStore } from '../stores/componentStore';

const componentStore = useComponentStore();
const fileInput = ref<HTMLInputElement>();
const message = ref('');
const messageType = ref<'success' | 'error' | 'info'>('info');

const componentCount = computed(() => componentStore.components.length);
const pageTitle = computed(() => componentStore.pageConfig.title);

const messageClass = computed(() => {
  const baseClass = 'border';
  switch (messageType.value) {
    case 'success':
      return `${baseClass} bg-green-50 border-green-200 text-green-800`;
    case 'error':
      return `${baseClass} bg-red-50 border-red-200 text-red-800`;
    default:
      return `${baseClass} bg-blue-50 border-blue-200 text-blue-800`;
  }
});

const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 3000);
};

const saveProject = () => {
  try {
    componentStore.saveProject();
    showMessage('项目保存成功！', 'success');
  } catch (error) {
    showMessage('保存失败，请重试', 'error');
  }
};

const triggerFileSelect = () => {
  fileInput.value?.click();
};

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  try {
    await componentStore.loadProject(file);
    showMessage('项目加载成功！', 'success');
  } catch (error) {
    showMessage(`加载失败: ${error instanceof Error ? error.message : '未知错误'}`, 'error');
  }
  
  // 清空文件输入
  target.value = '';
};

const newProject = () => {
  if (componentStore.components.length > 0) {
    if (confirm('确定要新建项目吗？当前项目的所有内容将被清空。')) {
      componentStore.clearProject();
      showMessage('新项目创建成功！', 'success');
    }
  } else {
    componentStore.clearProject();
    showMessage('新项目创建成功！', 'success');
  }
};
</script>

<style scoped>
.project-manager {
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>