<template>
  <div 
    :class="['floating-button-component', { 'selected': isSelected }]"
    @click="selectComponent"
  >
    <div 
      :style="buttonStyles"
    >
      <!-- 渲染解析后的文本内容，支持变量替换 -->
      <span v-html="renderedContent"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useComponentStore } from '../../../stores/componentStore';
import { useAPIStore } from '../../../stores/apiStore';
import { parseVariables } from '../../../utils/variableParser';
import type { FloatingButtonComponent } from '../../../types/component';
import { parseSpacing } from '@/utils/common';

const props = defineProps<{
  component: FloatingButtonComponent;
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
        return `<span class="variable-node" title="${node.description || ''}">${node.variableValue || ''}</span>`;
      } else {
        return node.content;
      }
    }).join('');
  } catch (error) {
    console.error('Error parsing variables:', error);
    return content;
  }
});

// 计算按钮样式
const buttonStyles = computed(() => {
  const style = props.component.style || {};
  console.log('style', style);
  return {
    fontSize: `${style.fontSize || 16}px`,
    color: style.color || '#ffffff',
    fontWeight: style.fontWeight || 'normal',
    fontStyle: style.fontStyle || 'normal',
    textAlign: style.textAlign || 'center',
    lineHeight: style.lineHeight ? `${style.lineHeight}px` : 'normal',
    letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : 'normal',
    padding: parseSpacing(style.padding || '10px 20px'),
    width: style.width || '300px',
    borderRadius: style.borderRadius ? `${style.borderRadius}px` : '8px',
    backgroundColor: style.backgroundColor || '#1890ff',
    border: style.borderWidth ? `${style.borderWidth}px ${style.borderStyle || 'solid'} ${style.borderColor || '#1890ff'}` : 'none',
    boxShadow: style.boxShadow || '0 4px 12px rgba(0, 0, 0, 0.15)',
  };
});

// 选择组件
function selectComponent(event: MouseEvent) {
  event.stopPropagation();
  componentStore.selectComponent(props.component.id);
}

</script>

<style scoped lang="less">
@import '../common/styles.less';

.floating-button-component {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0;
  cursor: pointer;
}

.floating-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  outline: none;
  text-decoration: none;
  user-select: none;

}

</style>