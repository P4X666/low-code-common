<template>
  <div class="low-code-container">
    <div class="editor-area">
      <EditorPanel />
    </div>
    <div class="render-area">
      <RendererPanel />
    </div>
    <div class="properties-area">
      <PropertiesPanel />
    </div>
    <div class="config-area">
      <PageConfig />
    </div>
  </div>
</template>

<script setup lang="ts">
import EditorPanel from './components/editor/EditorPanel.vue';
import RendererPanel from './components/renderer/RendererPanel.vue';
import PropertiesPanel from './components/properties/PropertiesPanel.vue';
import PageConfig from './components/PageConfig.vue';
</script>
