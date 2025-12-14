<template>
  <div 
    :class="['text-component', { 'selected': isSelected }]"
    @click="selectComponent"
    :style="componentStyles"
  >
    <component 
      :is="component.link ? 'a' : 'div'" 
      :href="component.link" 
      :style="{
        fontSize: `${component.fontSize}px`,
        color: component.color,
        fontWeight: component.fontWeight || 'normal',
        fontStyle: component.fontStyle || 'normal',
        textAlign: component.textAlign || 'left',
        lineHeight: component.lineHeight ? `${component.lineHeight}px` : 'normal',
        letterSpacing: component.letterSpacing ? `${component.letterSpacing}px` : 'normal'
      }"
    >
      <!-- 渲染解析后的文本内容，支持变量替换 -->
      <span v-html="renderedContent"></span>
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useComponentStore } from '../../../stores/componentStore';
import { useAPIStore } from '../../../stores/apiStore';
import { parseVariables, getValueByPath } from '../../../utils/variableParser';
import type { TextComponent } from '../../../types/component';

const props = defineProps<{
  component: TextComponent;
}>();

const componentStore = useComponentStore();
const apiStore = useAPIStore();
const isSelected = computed(() => componentStore.selectedComponentId === props.component.id);

// 计算渲染内容，支持变量替换
const renderedContent = computed(() => {
  const content = props.component.content;
  if (!content || typeof content !== 'string') return '';
  
  try {
    // 解析文本中的变量
    const nodes = parseVariables(content, apiStore.apiVariables);
    
    // 将节点数组转换为HTML字符串
    return nodes.map(node => {
      if (node.type === 'variable') {
        // 标记为API变量已引用
        if (node.isApiVariable && node.apiKey) {
          useAPIStore().aliveApiVariable(node.apiKey);
        }
        // 直接使用节点的content作为原始变量引用
        const variableText = node.content;
        
        // 对于API变量，优先使用variableValue作为显示值（如果存在）
        let displayValue = variableText;
        if (node.isApiVariable) {
          // 如果变量有具体的值，使用该值
          if (node.variableValue !== undefined && node.variableValue !== null) {
            displayValue = formatVariableValue(node.variableValue);
          } else if (node.variablePath) {
            // 如果没有具体值但有路径，尝试从apiVariables中获取
            const apiValue = getValueByPath(apiStore.apiVariables, node.variablePath);
            if (apiValue !== undefined && apiValue !== null) {
              displayValue = formatVariableValue(apiValue);
            }
          }
        }
        
        // 为变量添加高亮样式
        return `<span class="api-variable-highlight" title="${variableText}">${displayValue}</span>`;
      }
      // 普通文本节点
      return node.content || '';
    }).join('');
  } catch (error) {
    console.error('文本渲染错误:', error);
    // 出错时直接返回原始内容，确保用户能看到输入的文本
    return content;
  }
});

/**
 * 格式化变量值，处理对象类型显示
 * @param value 变量值
 * @returns 格式化后的字符串
 */
function formatVariableValue(value: any): string {
  // 检查value是否存在且不为null
  if (value === undefined || value === null) {
    return String(value);
  }
  
  // 特殊处理日期类型
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  
  // 如果是数组
  if (Array.isArray(value)) {
    // 空数组返回[]
    if (value.length === 0) {
      return '[]';
    }
    // 简单数组（值为基本类型）返回逗号分隔的字符串
    if (value.every(item => typeof item !== 'object' || item === null)) {
      return '[' + value.map(item => String(item)).join(', ') + ']';
    }
    // 复杂数组转为单行JSON
    return JSON.stringify(value);
  }
  // 如果是对象
  if (typeof value === 'object') {
    // 尝试获取对象的键值对，返回友好格式
    try {
      const entries = Object.entries(value);
      if (entries.length === 0) {
        return '{}';
      }
      const contentitem = entries.find(item=> item.includes('description'));
      // 简单对象（值为基本类型）返回键值对格式
      if (contentitem?.[1]) {
        return contentitem[1] as string || '解析错误';
      }
      // 复杂对象转为单行JSON
      return JSON.stringify(value);
    } catch {
      // 如果对象转换失败，使用对象的toString()
      return String(value);
    }
  }
  
  // 其他类型（基本类型）直接转为字符串
  return String(value);
}

// 计算组件样式
const componentStyles = computed(() => {
  const style = props.component.style || {};
  return {
    margin: style.margin ? `${style.margin.top}px ${style.margin.right}px ${style.margin.bottom}px ${style.margin.left}px` : '',
    padding: style.padding ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px` : '',
    borderRadius: style.borderRadius ? `${style.borderRadius}px` : '',
    backgroundColor: style.backgroundColor || '',
    border: style.borderWidth ? `${style.borderWidth}px ${style.borderStyle || 'solid'} ${style.borderColor || '#000'}` : '',
    boxShadow: style.boxShadow !== 'none' ? style.boxShadow : '',
    opacity: style.opacity !== undefined ? style.opacity : 1
  };
});

function selectComponent() {
  componentStore.selectComponent(props.component.id);
}
</script>

<style scoped lang="less">
@import '../common/styles.less';

.text-component {
  padding: 8px;
  cursor: pointer;
  
}

/* API变量高亮样式 */
:deep(.api-variable-highlight) {
  background-color: #4ade80;
  color: #166534;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 500;
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #22c55e;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &.has-description {
    /* 为有描述的API变量添加特殊样式 */
    background-color: #a3e635;
    color: #4d7c0f;
    animation: api-variable-pulse 2s infinite;
  }
}

/* 脉冲动画 */
@keyframes api-variable-pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
</style>