<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">API变量解析测试页面</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-lg font-medium mb-4">1. API管理测试</h2>
        <APIManager v-model="testApiVariables" />
      </div>

      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-lg font-medium mb-4">2. 变量解析测试</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">输入包含变量的文本</label>
          <textarea v-model="testInput" class="w-full h-32 p-3 border rounded"
            placeholder="例如: 你好 ${api1.data.user.name}，欢迎使用我们的平台！" />
        </div>
        <button class="px-4 py-2 bg-green-500 text-white rounded mb-4" @click="parseTest">
          解析变量
        </button>
        <div v-if="testOutput !== null" class="mb-4">
          <label class="block text-sm font-medium mb-1">解析结果</label>
          <div class="p-3 border rounded bg-gray-50">{{ testOutput }}</div>
        </div>
      </div>
    </div>

    <div class="mt-8 bg-white p-4 rounded shadow">
      <h2 class="text-lg font-medium mb-4">3. 已解析的API数据预览</h2>
      <div v-if="Object.keys(testApiVariables).length > 0" class="space-y-4">
        <div v-for="(api, key) in testApiVariables" :key="key">
          <h3 class="font-medium">{{ key }}</h3>
          <pre class="p-2 bg-gray-50 rounded text-xs overflow-x-auto">{{ JSON.stringify(api, null, 2) }}</pre>
        </div>
      </div>
      <div v-else class="text-gray-500">暂无API数据，请先解析API文档</div>

      <div class="mt-8 bg-blue-50 p-4 rounded border border-blue-200">
        <h2 class="text-lg font-medium mb-2 text-blue-700">使用说明</h2>
        <ol class="list-decimal pl-5 space-y-2 text-blue-800">
          <li>在左侧输入任何URL进行测试（会模拟解析）</li>
          <li>在右侧文本框中输入包含${api1.data.user.name}格式的变量引用</li>
          <li>点击"解析变量"按钮查看解析结果</li>
          <li>下方会显示当前已解析的所有API数据结构</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import APIManager from '../components/properties/APIManager.vue';
import { parseVariables } from '../utils/variableParser';

// 测试数据
const testApiVariables = reactive({});
const testInput = ref('你好 ${api1.data.user.name}，欢迎使用我们的平台！您的年龄是 ${api1.data.user.age} 岁。');
const testOutput = ref();

// 测试变量解析
function parseTest() {
  try {
    testOutput.value = parseVariables(testInput.value, testApiVariables);
  } catch (error: any) {
    console.error('测试解析失败:', error);
    testOutput.value = '解析失败: ' + error.message;
  }
}
</script>

<style scoped lang="less">
@layer components {
  .test-container {
    @apply p-4 border rounded;
  }

  .test-button {
    @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors;
  }
}
</style>