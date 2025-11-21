import { Directive, App } from 'vue';
import { parseVariables, containsVariables, VariableNode } from '../utils/variableParser';

// 变量模型指令配置
interface VariableModelOptions {
  variables?: Record<string, any>;
  onParse?: (original: string, parsed: string) => void;
}

// 指令值类型
interface VariableModelBindingValue {
  value?: string;
  options?: VariableModelOptions;
}

/**
 * 支持变量解析的v-model指令
 * 用于在输入时自动解析${变量}格式的引用
 */
const variableModel: Directive<HTMLInputElement, VariableModelBindingValue> = {
  mounted(el, binding, vnode) {
    // 获取options（如果有）
    const options = binding.value?.options || {};
    const variables = options.variables || {};
    const onParse = options.onParse;
    
    // 获取input元素
    const input = el.tagName === 'INPUT' ? el : el.querySelector('input');
    if (!input) return;
    
    // 初始值设置
    if (binding.value?.value !== undefined) {
      input.value = binding.value.value;
    }
    
    // 输入事件处理
    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const originalValue = target.value;
      let parsedValue: string | VariableNode[] = originalValue;
      
      // 当输入包含变量引用时进行解析
      if (containsVariables(originalValue)) {
        try {
          parsedValue = parseVariables(originalValue, variables);
        } catch (error) {
          console.warn('变量解析失败:', error);
        }
      }
      
      // 在vnode上更新值
      const model = (vnode.props || {})['onUpdate:modelValue'];
      if (model && typeof model === 'function') {
        model(parsedValue);
      }
      
      // 调用解析回调
      if (onParse && parsedValue !== originalValue) {
        onParse(originalValue, parsedValue as string);
      }
    };
    
    // 添加事件监听器
    input.addEventListener('input', handleInput);
    input.addEventListener('change', handleInput);
    
    // 存储事件处理器以便后续清理
    (el as any).__variableModelHandler = handleInput;
  },
  
  updated(el, binding) {
    const value = binding.value?.value;
    const input = el.tagName === 'INPUT' ? el : el.querySelector('input');
    if (!input) return;
    
    // 避免循环更新
    if (input.value !== value) {
      input.value = value || '';
    }
  },
  
  unmounted(el) {
    const input = el.tagName === 'INPUT' ? el : el.querySelector('input');
    if (!input) return;
    
    // 清理事件监听器
    const handler = (el as any).__variableModelHandler;
    if (handler) {
      input.removeEventListener('input', handler);
      input.removeEventListener('change', handler);
      delete (el as any).__variableModelHandler;
    }
  }
};

/**
 * 指令插件安装函数
 */
export function installVariableModelDirective(app: App, defaultOptions: VariableModelOptions = {}) {
  // 创建一个包装指令，合并默认选项
  const wrappedDirective: Directive = {
    ...variableModel,
    mounted(el, binding, vnode) {
      // 合并默认选项和指令提供的选项
      const mergedOptions = {
        ...defaultOptions,
        ...(binding.value?.options || {})
      };
      
      // 调用原始的mounted钩子，确保类型安全和错误处理
      try {
        // 安全地调用原始mounted钩子，确保binding和vnode参数正确
        const enhancedBinding = {
          ...binding,
          value: {
            ...binding.value,
            options: mergedOptions
          }
        };
        
        // 直接调用原始 mounted 钩子，无需额外检查
        (variableModel as any).mounted(el, enhancedBinding, vnode);
      } catch (error) {
        console.warn('v-variable-model 指令挂载失败:', error);
      }
    }
  };
  
  app.directive('variable-model', wrappedDirective);
}

export default variableModel;