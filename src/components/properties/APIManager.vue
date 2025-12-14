<template>
  <div class="api-manager">
    <h3 class="text-lg font-medium mb-4">API管理</h3>
    
    <div class="mb-4">
      <label class="block text-sm font-medium mb-2">Swagger API文档URL</label>
      <div class="flex gap-2">
        <input 
          type="text" 
          v-model="apiUrl" 
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请输入Swagger API文档URL"
        />
        <button 
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          @click="parseApiDoc"
          :disabled="isParsing"
        >
          {{ isParsing ? '解析中...' : '解析' }}
        </button>
      </div>
    </div>
    
    <div v-if="Object.keys(apiStore.apiVariables).length > 0" class="mt-4">
      <h4 class="text-sm font-medium mb-2">已解析的API变量</h4>
      <div class="p-3 bg-gray-50 rounded-md">
        <div v-for="(api, key) in apiStore.apiVariables" :key="key" class="pb-3 border-b last:border-0">
          <div class="flex justify-between items-center">
            <span class="font-medium">{{ key }}  {{ api.isAlive ? '已引用' : '未引用' }}</span>
            <button 
              class="text-xs text-red-500 hover:text-red-700"
              @click="removeApi(key)"
            >
              删除
            </button>
          </div>
          <div class="text-xs text-gray-500 mt-1">
            接口路径：{{api.url}}
          </div>
          <div class="text-xs text-gray-500 mt-1">
            接口方法：{{api.method}}
          </div>
          <div v-if="api.method==='get'" class="text-xs text-gray-500 mt-1">
            {{ Object.keys(api.data).length }} 个可引用变量
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="error" class="mt-3 p-2 bg-red-50 text-red-500 text-sm rounded-md">
      {{ error }}
    </div>
    
    <div v-if="successMessage" class="mt-3 p-2 bg-green-50 text-green-500 text-sm rounded-md">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { parseMarkdownApi } from '@/utils/apiParser';
import { useAPIStore } from '../../stores/apiStore';

// 使用API store
const apiStore = useAPIStore();

// 响应式数据
const apiUrl = ref('');
const isParsing = ref(false);
const error = ref('');
const successMessage = ref('');

// 解析API文档
async function parseApiDoc() {
  if (!apiUrl.value.trim()) {
    error.value = '请输入API文档URL';
    return;
  }
  
  isParsing.value = true;
  error.value = '';
  successMessage.value = '';
  
  try {
    // 动态导入markdown文件内容
    const markdownUrl = apiUrl.value.includes('http') ? apiUrl.value:`/${apiUrl.value}`
    const markdownContent = await fetch(markdownUrl)
      .then(res => {
        if (!res.ok) throw new Error('读取 md 文件失败');
        return res.text();
      });
    
    // 使用外部工具函数解析Markdown格式的API文档
    const openapiData = await parseMarkdownApi(markdownContent);
    
    console.log('解析后的OpenAPI数据:', openapiData);
    
    // 实现API path去重逻辑
    const newApiPaths = new Set<string>();
    const filteredApiData: Record<string, 0|1> = {};
    
    const {url, method} = openapiData
    const path = url + method
    if (!newApiPaths.has(path)) {
        newApiPaths.add(path);
        filteredApiData[path] = 1;
      }
    
    // 生成唯一的API键名
    const existingKeys = Object.keys(apiStore.apiVariables);
    const apiKey = `api${existingKeys.length + 1}`;
    
    // 检查是否已存在相同path的API
    let isDuplicate = false;
    for (const existingApi of Object.values(apiStore.apiVariables)) {
      const existingPaths = Object.keys(existingApi);
      const newPaths = Object.keys(filteredApiData);
      
      // 检查是否有重叠的path
      if (newPaths.some(path => existingPaths.includes(path))) {
        isDuplicate = true;
        break;
      }
    }
    
    if (isDuplicate) {
      error.value = '该API文档包含已存在的API路径，请检查后重试';
      return;
    }
    
    // 存储解析后的API数据
    apiStore.setApiVariable(apiKey, openapiData);
    
    successMessage.value = `API文档解析成功，可使用 ${apiKey} 引用`;
    apiUrl.value = '';
  } catch (err) {
    error.value = 'API文档解析失败，请检查文档格式是否正确';
    console.error('API解析错误:', err);
  } finally {
    isParsing.value = false;
  }
}

// 删除API
function removeApi(apiKey: string) {
  apiStore.deleteApiVariable(apiKey);
  successMessage.value = 'API已删除';
  setTimeout(() => {
    successMessage.value = '';
  }, 2000);
}
</script>

<style scoped lang="less">
.api-manager {
  width: 100%;
}
</style>