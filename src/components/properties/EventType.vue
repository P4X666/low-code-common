<template>
  <div class="mb-4">
    <h3 class="text-lg font-medium mb-2">事件设置</h3>
    <div class="mb-2">
      <label class="block text-sm font-medium mb-1">选择触发事件类型</label>
      <select 
        :value="selectedComponent.eventType || 'none'" 
        @change="updateComponent" 
        class="w-full px-3 py-2 border rounded"
      >
        <option value="none">无事件</option>
        <option value="pageJump">页面跳转事件</option>
        <option value="apiRequest">接口请求事件</option>
      </select>
    </div>
    <div v-if="selectedComponent.eventType === 'pageJump'">
      <label class="block text-sm font-medium mb-1">跳转页面路径</label>
      <input
        v-model="selectedComponent.pageJumpPath"
        type="text"
        placeholder="输入跳转路径"
        class="w-full px-3 py-2 border rounded"
      />
    </div>
    <div v-if="selectedComponent.eventType === 'apiRequest'">
      <label class="block text-sm font-medium mb-1">接口请求</label>
      <div v-if="apiRequestNames.length === 0">
        <p class="text-sm text-red-500">当前无可用接口请求，请先配置接口请求</p>
      </div>
      <select
        v-else
        :value="selectedComponent.apiRequestPath"
        @change="updateApiRequestPath"
        type="text"
        placeholder="选择接口请求"
        class="w-full px-3 py-2 border rounded"
      >
        <option v-for="name in apiRequestNames" :key="name" :value="name">{{ name }}</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useComponentStore } from '@/stores/componentStore'
import { ComponentBaseEventType } from '@/types/component'
import { useAPIStore } from '@/stores/apiStore'

const props = defineProps({
  componentId: {
    type: String,
    required: true
  }
})

watch(() => props.componentId, () => {
  selectedComponent.value = getSelectedComponent()
})

const getSelectedComponent = () => {
  return componentStore.components.find(c => c.id === props.componentId)!
}

const componentStore = useComponentStore()
const selectedComponent = ref(getSelectedComponent())
const apiStore = useAPIStore()

// 使用计算属性，当API变量变化时自动更新
const apiRequestNames = computed(() => {
  return Object.keys(apiStore.getAllApiVariables)
})

onMounted(() => {
  selectedComponent.value = getSelectedComponent()
})

const updateComponent = (e: Event) => {
    const target = e.target as HTMLSelectElement
    selectedComponent.value.eventType = target.value as ComponentBaseEventType
    componentStore.updateComponent(props.componentId, selectedComponent.value)
}
const updateApiRequestPath = (e: Event) => {
    const target = e.target as HTMLSelectElement
    selectedComponent.value.apiRequestPath = target.value
    componentStore.updateComponent(props.componentId, selectedComponent.value)
    useAPIStore().aliveApiVariable(target.value);
}
</script>