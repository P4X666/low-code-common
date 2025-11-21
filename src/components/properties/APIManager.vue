<template>
  <div class="mb-4">
    <h3 class="text-lg font-medium mb-2">API管理</h3>
    
    <div class="mb-2">
      <label class="block text-sm font-medium mb-1">Swagger API文档URL</label>
      <div class="flex gap-2">
        <input 
          type="text" 
          v-model="apiUrl" 
          class="flex-1 px-3 py-2 border rounded"
          placeholder="请输入Swagger API文档URL"
        />
        <button 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          @click="parseApiDoc"
          :disabled="isParsing"
        >
          {{ isParsing ? '解析中...' : '解析' }}
        </button>
      </div>
    </div>
    
    <div v-if="apiData && Object.keys(apiData).length > 0" class="mt-4">
      <h4 class="text-sm font-medium mb-2">已解析的API变量</h4>
      <div class="p-2 bg-gray-50 rounded">
        <div v-for="(api, key) in apiData" :key="key" class="mb-2 pb-2 border-b last:border-0">
          <div class="flex justify-between">
            <span class="font-medium">{{ key }}</span>
            <button 
              class="text-xs text-red-500 hover:text-red-700"
              @click="removeApi(key)"
            >
              删除
            </button>
          </div>
          <div class="text-xs text-gray-500">
            {{ Object.keys(api).length }} 个可引用变量
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="error" class="mt-2 p-2 bg-red-50 text-red-500 text-sm rounded">
      {{ error }}
    </div>
    
    <div v-if="successMessage" class="mt-2 p-2 bg-green-50 text-green-500 text-sm rounded">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { parseMarkdownApi } from '@/utils/apiParser';

// Props
interface Props {
  modelValue: Record<string, any>;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>];
}>();

// 响应式数据
const apiUrl = ref('');
const isParsing = ref(false);
const error = ref('');
const successMessage = ref('');
const apiData = reactive<Record<string, any>>(props.modelValue || {});

// 监听props变化更新本地数据
function updateApiData() {
  Object.keys(apiData).forEach(key => {
    delete apiData[key];
  });
  
  Object.keys(props.modelValue).forEach(key => {
    apiData[key] = props.modelValue[key];
  });
}

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
    // 直接读取本地 md 文件内容：先通过 fetch 拿到文本，再交给解析器
    const markdownContent = await fetch('/src/components/properties/member-info-api.md')
      .then(res => {
        if (!res.ok) throw new Error('读取 md 文件失败');
        return res.text();
      });
    
    // 使用外部工具函数解析Markdown格式的API文档
    const openapiData = await parseMarkdownApi(markdownContent);
    
    console.log('解析后的OpenAPI数据:', openapiData);
    
    // 生成唯一的API键名
    const apiKey = `api${Object.keys(apiData).length + 1}`;
    
    // 存储解析后的API数据
    apiData[apiKey] = openapiData;
    
    // 通知父组件数据更新
    emit('update:modelValue', { ...apiData });
    
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
  if (apiData[apiKey]) {
    delete apiData[apiKey];
    emit('update:modelValue', { ...apiData });
    successMessage.value = 'API已删除';
    setTimeout(() => {
      successMessage.value = '';
    }, 2000);
  }
}
</script>

<style scoped lang="less">
/* 样式可以根据需要自定义 */
</style>