import { defineStore } from 'pinia';

interface ApiStoreState {
  apiVariables: Record<string, any>;
}

export const useAPIStore = defineStore('api', {
  state: (): ApiStoreState => ({
    apiVariables: {}
  }),
  
  getters: {
    /**
     * 获取所有API变量
     */
    getAllApiVariables(): Record<string, any> {
      return this.apiVariables;
    },

    /**
     * 获取所有被引用的API变量键名
     */
    getAliveApiVariables(): Record<string, any> {
      const obj: Record<string, any> = {}
      Object.keys(this.apiVariables).forEach(key => {
        if (this.apiVariables[key].isAlive) {
          obj[key] = this.apiVariables[key];
        }
      })
      return obj;
    },
    
    /**
     * 获取指定API变量
     */
    getApiVariable(): (key: string) => any {
      return (key: string) => this.apiVariables[key];
    }
  },
  
  actions: {
    /**
     * 设置API变量
     * @param key API变量的键名，如 'api1'
     * @param value API变量的值
     */
    setApiVariable(key: string, value: any) {
      this.apiVariables[key] = value;
    },
    
    /**
     * 批量设置API变量
     * @param variables API变量对象
     */
    setApiVariables(variables: Record<string, any>) {
      this.apiVariables = { ...this.apiVariables, ...variables };
    },
    
    /**
     * 清除所有API变量
     */
    clearApiVariables() {
      this.apiVariables = {};
    },
    
    /**
     * 删除指定API变量
     * @param key API变量的键名
     */
    deleteApiVariable(key: string) {
      delete this.apiVariables[key];
    },
    /**
     * 标记指定API变量是否被引用
     * @param key API变量的键名
     */
    aliveApiVariable(key: string) {
      return this.apiVariables[key].isAlive = true;
    }
  }
});