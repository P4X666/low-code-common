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
      {{ component.content }}
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useComponentStore } from '../../../stores/componentStore';
import type { TextComponent } from '../../../types/component';

const props = defineProps<{
  component: TextComponent;
}>();

const componentStore = useComponentStore();
const isSelected = computed(() => componentStore.selectedComponentId === props.component.id);

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
.text-component {
  padding: 8px;
  cursor: pointer;
  
  &.selected {
    outline: 2px solid #3b82f6;
    background-color: rgba(59, 130, 246, 0.1);
  }
}
</style>