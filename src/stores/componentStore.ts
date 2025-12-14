import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import type { Component, StyleProperties } from '../types/component';
import { useAPIStore } from './apiStore';

interface PageConfig {
  title: string;
  backgroundColor: string;
  backgroundImage: string;
}

export const useComponentStore = defineStore('component', {
  state: () => ({
    components: [] as Component[],
    selectedComponentId: null as string | null,
    pageConfig: {
      title: '我的页面',
      backgroundColor: '#ffffff',
      backgroundImage: '',
    } as PageConfig,
  }),
  
  getters: {
    getSelectedComponent: (state) => {
      return state.components.find(c => c.id === state.selectedComponentId) || null;
    },
  },
  
  actions: {
    addComponent(component: Omit<Component, 'id'>) {
      const id = uuidv4();
      // 初始化默认样式
      const defaultStyle: StyleProperties = {
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        borderRadius: 0,
        backgroundColor: '',
        borderWidth: 0,
        borderColor: '#000000',
        borderStyle: 'none',
        boxShadow: 'none',
        opacity: 1
      };
      
      this.components.push({ 
        ...component, 
        id,
        style: component.style || defaultStyle 
      } as Component);
      
      return id;
    },
    
    removeComponent(id: string) {
      const index = this.components.findIndex(c => c.id === id);
      if (index !== -1) {
        this.components.splice(index, 1);
        if (this.selectedComponentId === id) {
          this.selectedComponentId = null;
        }
      }
    },
    
    updateComponent(id: string, updates: Partial<Component>) {
      const component = this.components.find(c => c.id === id);
      if (component) {
        Object.assign(component, updates);
      }
    },
    
    updateComponentStyle(id: string, styleUpdates: StyleProperties) {
      const component = this.components.find(c => c.id === id);
      if (component) {
        component.style = {
          ...component.style,
          ...styleUpdates
        };
      }
    },
    
    selectComponent(id: string | null) {
      this.selectedComponentId = id;
    },
    
    reorderComponents(newOrder: Component[]) {
      this.components = newOrder;
    },
    
    getComponentById(id: string) {
      return this.components.find(c => c.id === id) || null;
    },

    updatePageConfig(config: Partial<PageConfig>) {
      this.pageConfig = {
        ...this.pageConfig,
        ...config
      };
    },

    // 保存项目为JSON
    saveProject() {
      const projectData = {
        components: this.components,
        pageConfig: this.pageConfig,
        apiVariables: useAPIStore().getAllApiVariables,
        version: '1.0.0',
        timestamp: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(projectData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `low-code-project-${new Date().getTime()}.json`;
      link.click();
      
      URL.revokeObjectURL(link.href);
    },

    // 从JSON加载项目
    loadProject(file: File): Promise<void> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const projectData = JSON.parse(e.target?.result as string);
            
            // 验证数据格式
            if (!projectData.components || !projectData.pageConfig) {
              throw new Error('无效的项目文件格式');
            }
            
            // 加载数据
            this.components = projectData.components;
            this.pageConfig = projectData.pageConfig;
            // 加载API变量
            useAPIStore().setApiVariables(projectData.apiVariables || {});
            this.selectedComponentId = null;
            
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        
        reader.onerror = () => {
          reject(new Error('文件读取失败'));
        };
        
        reader.readAsText(file);
      });
    },

    // 清空项目
    clearProject() {
      this.components = [];
      this.selectedComponentId = null;
      this.pageConfig = {
        title: '我的页面',
        backgroundColor: '#ffffff',
        backgroundImage: ''
      };
    },
  },
});