<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">属性设置</h2>
    
    <!-- API管理组件 -->
    <APIManager 
      v-model="apiVariables"
    />
    
    
    <div v-if="selectedComponent">
      <!-- 通用属性 -->
      <div class="mb-4">
        <h3 class="text-lg font-medium mb-2">通用属性</h3>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">组件ID</label>
          <input 
            type="text" 
            v-model="customId" 
            class="w-full px-3 py-2 border rounded"
            :class="{ 'border-red-500': idError }"
            placeholder="请输入唯一的组件ID"
            @input="validateId"
            @blur="updateCustomId"
          />
          <p v-if="idError" class="text-red-500 text-xs mt-1">{{ idError }}</p>
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">组件名称</label>
          <input 
            type="text" 
            v-model="customName" 
            class="w-full px-3 py-2 border rounded"
            placeholder="请输入组件名称"
            @blur="updateCustomName"
          />
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">系统名称</label>
          <input 
            type="text" 
            v-model="selectedComponent.name" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
        
        <div v-if="selectedComponent.type !== 'carousel'" class="mb-2">
          <label class="block text-sm font-medium mb-1">链接</label>
          <input 
            type="text" 
            v-model="selectedComponent.link" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
      </div>
      
      <!-- 文本组件特有属性 -->
      <div v-if="selectedComponent.type === 'text'" class="mb-4">
        <h3 class="text-lg font-medium mb-2">文本属性</h3>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">内容</label>
          <textarea 
            :value="contentValue" 
            @input="updateContent"
            class="w-full px-3 py-2 border rounded"
            rows="3"
            placeholder="在此输入文本内容，可包含变量引用如${api.data.city}"
          ></textarea>
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">字体大小</label>
          <input 
            type="number" 
            v-model="selectedComponent.fontSize" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">颜色</label>
          <input 
            type="color" 
            v-model="selectedComponent.color" 
            class="w-full h-10"
            @change="updateComponent"
          />
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">字体粗细</label>
          <select 
            v-model="selectedComponent.fontWeight" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          >
            <option value="normal">正常</option>
            <option value="bold">粗体</option>
            <option value="lighter">细体</option>
          </select>
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">字体样式</label>
          <select 
            v-model="selectedComponent.fontStyle" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          >
            <option value="normal">正常</option>
            <option value="italic">斜体</option>
          </select>
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">文本对齐</label>
          <select 
            v-model="selectedComponent.textAlign" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          >
            <option value="left">左对齐</option>
            <option value="center">居中</option>
            <option value="right">右对齐</option>
            <option value="justify">两端对齐</option>
          </select>
        </div>
      </div>
      
      <!-- 图片组件特有属性 -->
      <div v-if="selectedComponent.type === 'image'" class="mb-4">
        <h3 class="text-lg font-medium mb-2">图片属性</h3>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">图片地址</label>
          <input 
            type="text" 
            v-model="selectedComponent.src" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
        
        <div class="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label class="block text-sm font-medium mb-1">宽度</label>
            <input 
              type="number" 
              v-model="selectedComponent.width" 
              class="w-full px-3 py-2 border rounded"
              @change="updateComponent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">高度</label>
            <input 
              type="number" 
              v-model="selectedComponent.height" 
              class="w-full px-3 py-2 border rounded"
              @change="updateComponent"
            />
          </div>
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">填充方式</label>
          <select 
            v-model="selectedComponent.objectFit" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          >
            <option value="cover">覆盖(cover)</option>
            <option value="contain">包含(contain)</option>
            <option value="fill">填充(fill)</option>
            <option value="none">无(none)</option>
          </select>
        </div>
        
        <div class="mb-2">
          <label class="flex items-center">
            <input 
              type="checkbox" 
              v-model="selectedComponent.hover" 
              class="mr-2"
              @change="updateComponent"
            />
            <span class="text-sm font-medium">悬停效果</span>
          </label>
        </div>
      </div>
      
      <!-- 轮播图组件特有属性 -->
      <div v-if="selectedComponent.type === 'carousel'" class="mb-4">
        <h3 class="text-lg font-medium mb-2">轮播图属性</h3>
        
        <div class="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label class="block text-sm font-medium mb-1">宽度</label>
            <input 
              type="number" 
              v-model="selectedComponent.width" 
              class="w-full px-3 py-2 border rounded"
              @change="updateComponent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">高度</label>
            <input 
              type="number" 
              v-model="selectedComponent.height" 
              class="w-full px-3 py-2 border rounded"
              @change="updateComponent"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="selectedComponent.autoplay" 
                class="mr-2"
                @change="updateComponent"
              />
              <span class="text-sm font-medium">自动播放</span>
            </label>
          </div>
          <div v-if="selectedComponent.autoplay">
            <label class="block text-sm font-medium mb-1">播放间隔(ms)</label>
            <input 
              type="number" 
              v-model="selectedComponent.interval" 
              class="w-full px-3 py-2 border rounded"
              min="1000"
              @change="updateComponent"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="selectedComponent.showIndicators"
                class="mr-2"
                @change="updateComponent"
              />
              <span class="text-sm font-medium">显示指示器</span>
            </label>
          </div>
          <div>
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="selectedComponent.showControls"
                class="mr-2"
                @change="updateComponent"
              />
              <span class="text-sm font-medium">显示控制按钮</span>
            </label>
          </div>
        </div>
        
        <!-- 图片列表管理 -->
        <div class="mt-4">
          <h4 class="text-sm font-medium mb-2">图片列表</h4>
          <div v-if="selectedComponent.images.length === 0" class="text-gray-500 text-sm mb-2">
            暂无图片，请点击下方按钮添加
          </div>
          <div v-else>
            <div v-for="(image, index) in selectedComponent.images" :key="index" class="mb-3 p-2 border rounded bg-gray-50">
              <div class="grid grid-cols-1 gap-2">
                <div>
                  <label class="block text-xs font-medium mb-1">图片URL</label>
                  <input 
                    type="text" 
                    v-model="image.url" 
                    class="w-full px-2 py-1 text-sm border rounded"
                    placeholder="请输入图片URL"
                    @change="updateComponent"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium mb-1">跳转链接 (可选)</label>
                  <input 
                    type="text" 
                    v-model="image.link" 
                    class="w-full px-2 py-1 text-sm border rounded"
                    placeholder="请输入跳转链接"
                    @change="updateComponent"
                  />
                </div>
                <button 
                  class="text-xs text-red-500 hover:text-red-700 self-end"
                  @click.stop="removeCarouselImage(index)"
                >
                  删除此图片
                </button>
              </div>
            </div>
          </div>
          <button 
            class="mt-2 text-sm text-blue-500 hover:text-blue-700"
            @click="addCarouselImage"
          >
            + 添加图片
          </button>
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">过渡效果</label>
          <select 
            v-model="selectedComponent.transitionEffect" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          >
            <option value="slide">滑动</option>
            <option value="fade">淡入淡出</option>
          </select>
        </div>
      </div>
      
      <!-- Banner组件特有属性 -->
      <div v-if="selectedComponent.type === 'banner'" class="mb-4">
        <h3 class="text-lg font-medium mb-2">Banner属性</h3>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">标题</label>
          <input 
            type="text" 
            v-model="selectedComponent.title" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">图片地址</label>
          <input 
            type="text" 
            v-model="selectedComponent.images[0].url"
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">跳转链接</label>
          <input 
            type="text" 
            v-model="selectedComponent.link" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>

      </div>
      
      <!-- 热门类目组件特有属性 -->
      <div v-if="selectedComponent.type === 'category'" class="mb-4">
        <h3 class="text-lg font-medium mb-2">热门类目属性</h3>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">标题</label>
          <input 
            type="text" 
            v-model="selectedComponent.title" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">大图地址</label>
          <input 
            type="text" 
            v-model="(selectedComponent as any).bigImage.url" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">大图链接</label>
          <input 
            type="text" 
            v-model="(selectedComponent as any).bigImage.link" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
        
        <!-- 小图列表管理 -->
        <div class="mt-4">
          <h4 class="text-sm font-medium mb-2">小图列表</h4>
          <div v-if="selectedComponent.smallImages.length === 0" class="text-gray-500 text-sm mb-2">
            暂无小图，请点击下方按钮添加
          </div>
          <div v-else>
            <div v-for="(image, index) in selectedComponent.smallImages" :key="index" class="mb-3 p-2 border rounded bg-gray-50">
              <div class="grid grid-cols-1 gap-2">
                <div>
                  <label class="block text-xs font-medium mb-1">图片URL</label>
                  <input 
                    type="text" 
                    v-model="image.url" 
                    class="w-full px-2 py-1 text-sm border rounded"
                    placeholder="请输入图片URL"
                    @change="updateComponent"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium mb-1">跳转链接</label>
                  <input 
                    type="text" 
                    v-model="image.link" 
                    class="w-full px-2 py-1 text-sm border rounded"
                    placeholder="请输入跳转链接"
                    @change="updateComponent"
                  />
                </div>
                <button 
                  class="text-xs text-red-500 hover:text-red-700 self-end"
                  @click.stop="removeSmallImage(index)"
                >
                  删除此图片
                </button>
              </div>
            </div>
          </div>
          <button 
            v-if="selectedComponent.smallImages.length < 6"
            class="mt-2 text-sm text-blue-500 hover:text-blue-700"
            @click="addSmallImage"
          >
            + 添加图片
          </button>
          <p v-else class="mt-2 text-xs text-gray-500">最多添加6张小图</p>
        </div>

      </div>
      
      <!-- 商品排行组件特有属性 -->
      <div v-if="selectedComponent.type === 'productRank'" class="mb-4">
        <h3 class="text-lg font-medium mb-2">商品排行属性</h3>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">标题</label>
          <input 
            type="text" 
            v-model="selectedComponent.title" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">小标题</label>
          <input 
            type="text" 
            v-model="selectedComponent.subtitle" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">数据来源</label>
          <select 
            v-model="selectedComponent.dataSource" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          >
            <option value="ranking">排行榜</option>
            <option value="hotSale">热卖榜</option>
          </select>
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">底部按钮文本</label>
          <input 
            type="text" 
            v-model="selectedComponent.buttonText" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">底部按钮链接</label>
          <input 
            type="text" 
            v-model="selectedComponent.buttonLink" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
        
      </div>
      
      <!-- 商品分组组件特有属性 -->
      <div v-if="selectedComponent.type === 'productGroup'" class="mb-4">
        <h3 class="text-lg font-medium mb-2">商品分组属性</h3>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">标题</label>
          <input 
            type="text" 
            v-model="selectedComponent.title" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
        
        <!-- 分组列表管理 -->
        <div class="mt-4">
          <h4 class="text-sm font-medium mb-2">分组列表</h4>
          <div v-if="selectedComponent.groups.length === 0" class="text-gray-500 text-sm mb-2">
            暂无分组，请点击下方按钮添加
          </div>
          <div v-else>
            <div v-for="(group, groupIndex) in selectedComponent.groups" :key="groupIndex" class="mb-4 p-3 border rounded bg-gray-50">
              <div class="grid grid-cols-1 gap-3">
                <div>
                  <label class="block text-xs font-medium mb-1">分组标题</label>
                  <input 
                    type="text" 
                    v-model="group.title" 
                    class="w-full px-2 py-1 text-sm border rounded"
                    placeholder="请输入分组标题"
                    @change="updateComponent"
                  />
                </div>
                
                <!-- 分组图片列表 -->
                <div>
                  <label class="block text-xs font-medium mb-1">分组图片 (最多7张)</label>
                  <div v-if="group.images.length === 0" class="text-gray-400 text-xs mb-2">
                    暂无图片，请点击下方按钮添加
                  </div>
                  <div v-else>
                    <div v-for="(image, imageIndex) in group.images.slice(0, 7)" :key="imageIndex" class="mb-2">
                      <div class="grid grid-cols-1 gap-1">
                        <div>
                          <label class="block text-xs font-medium mb-1">图片URL</label>
                          <input 
                            type="text" 
                            v-model="image.url" 
                            class="w-full px-2 py-1 text-xs border rounded"
                            placeholder="请输入图片URL"
                            @change="updateComponent"
                          />
                        </div>
                        <div>
                          <label class="block text-xs font-medium mb-1">跳转链接</label>
                          <input 
                            type="text" 
                            v-model="image.link" 
                            class="w-full px-2 py-1 text-xs border rounded"
                            placeholder="请输入跳转链接"
                            @change="updateComponent"
                          />
                        </div>
                        <button 
                          class="text-xs text-red-500 hover:text-red-700 self-end"
                          @click.stop="removeGroupImage(groupIndex, imageIndex)"
                        >
                          删除此图片
                        </button>
                      </div>
                    </div>
                  </div>
                  <button 
                    v-if="group.images.length < 7"
                    class="mt-1 text-xs text-blue-500 hover:text-blue-700"
                    @click.stop="addGroupImage(groupIndex)"
                  >
                    + 添加图片
                  </button>
                </div>
                
                <button 
                  class="text-xs text-red-500 hover:text-red-700 self-end"
                  @click.stop="removeGroup(groupIndex)"
                >
                  删除此分组
                </button>
              </div>
            </div>
          </div>
          <button 
            class="mt-2 text-sm text-blue-500 hover:text-blue-700"
            @click="addGroup"
          >
            + 添加分组
          </button>
        </div>
        
        <div class="mb-2 mt-4">
          <label class="block text-sm font-medium mb-1">底部按钮文本</label>
          <input 
            type="text" 
            v-model="selectedComponent.buttonText" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
        
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">底部按钮链接</label>
          <input 
            type="text" 
            v-model="selectedComponent.buttonLink" 
            class="w-full px-3 py-2 border rounded"
            @change="updateComponent"
          />
        </div>
      </div>
      
      <!-- 样式编辑器 -->
      <StyleEditor 
        v-if="selectedComponent" 
        :componentId="selectedComponent.id" 
      />
    </div>
    
    <div v-else class="text-center text-gray-500 py-8">
      请选择一个组件进行编辑
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useComponentStore } from '../../stores/componentStore';
import { useAPIStore } from '../../stores/apiStore';
import type { Component, BannerComponent , CategoryComponent, ProductRankComponent, ProductGroupComponent } from '../../types/component';
import StyleEditor from './StyleEditor.vue';
import APIManager from './APIManager.vue';
import { parseVariables, nodesToText } from '../../utils/variableParser';

const componentStore = useComponentStore();

const selectedComponent = computed<Component | null>(() => {
  return componentStore.getSelectedComponent;
});

// 自定义ID和名称
const customId = ref('');
const customName = ref('');
const idError = ref('');

const apiStore = useAPIStore();
const apiVariables = computed({
  get: () => apiStore.apiVariables,
  set: (value) => apiStore.setApiVariables(value)
});

// 处理TextComponent的content属性
const contentValue = computed(() => {
  if (!selectedComponent.value || selectedComponent.value.type !== 'text') return '';
  const content = selectedComponent.value.content;
  // 如果content已经是解析后的节点数组，转换回原始文本格式
  if (Array.isArray(content)) {
    return content.map(node => node.content || '').join('');
  }
  return content || '';
});

// 更新content属性
const updateContent = (event: any) => {
  if (!selectedComponent.value || selectedComponent.value.type !== 'text') return;
  const newValue = (event.target as HTMLInputElement).value;
  // 直接设置为字符串，不经过变量处理
  selectedComponent.value.content = newValue;
  // 直接更新组件，不调用updateComponent以避免过度解析
  componentStore.updateComponent(selectedComponent.value.id, { ...selectedComponent.value });
};

// 确保component.content始终是字符串格式
watch(() => selectedComponent.value?.id, () => {
  if (selectedComponent.value && selectedComponent.value.type === 'text' && Array.isArray(selectedComponent.value.content)) {
    // 将节点数组转换为原始文本
    selectedComponent.value.content = contentValue.value;
    componentStore.updateComponent(selectedComponent.value.id, { ...selectedComponent.value });
  }
});

// 监听选中组件变化，更新自定义ID和名称
watch(selectedComponent, (newComponent) => {
  if (newComponent) {
    customId.value = newComponent.customId || '';
    customName.value = newComponent.customName || '';
  } else {
    customId.value = '';
    customName.value = '';
    idError.value = '';
  }
}, { immediate: true });

// ID唯一性验证
function validateId() {
  idError.value = '';
  if (!customId.value.trim()) {
    return;
  }
  
  const existingComponent = componentStore.components.find(
    comp => comp.customId === customId.value.trim() && comp.id !== selectedComponent.value?.id
  );
  
  if (existingComponent) {
    idError.value = '该ID已存在，请使用唯一的ID';
  }
}

// 更新自定义ID
function updateCustomId() {
  if (selectedComponent.value && !idError.value) {
    componentStore.updateComponent(selectedComponent.value.id, {
      ...selectedComponent.value,
      customId: customId.value.trim() || undefined
    });
  }
}

// 更新自定义名称
function updateCustomName() {
  if (selectedComponent.value) {
    componentStore.updateComponent(selectedComponent.value.id, {
      ...selectedComponent.value,
      customName: customName.value.trim() || undefined
    });
  }
}

// 递归处理对象中的变量引用
function processObjectVariables(obj: any, variables: Record<string, any>): any {
  if (typeof obj === 'string') {
    // 字符串直接解析
    return obj.includes('${') ? parseVariables(obj, variables) : obj;
  } else if (Array.isArray(obj)) {
    // 数组递归处理每个元素
    return obj.map(item => processObjectVariables(item, variables));
  } else if (obj && typeof obj === 'object') {
    // 对象递归处理每个属性
    const result: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 对于TextComponent的content属性，跳过变量解析，保持原始字符串
        if (obj.type === 'text' && key === 'content') {
          result[key] = obj[key];
        } else {
          result[key] = processObjectVariables(obj[key], variables);
        }
      }
    }
    return result;
  }
  // 其他类型直接返回
  return obj;
}

function updateComponent() {
  if (selectedComponent.value) {
    try {
      // 递归处理组件中的所有变量引用
      const updatedComponent = processObjectVariables(selectedComponent.value, apiVariables.value);
      
      componentStore.updateComponent(selectedComponent.value.id, updatedComponent);
    } catch (error) {
      console.error('组件变量解析失败:', error);
      // 发生错误时，尝试使用简单的直接更新
      componentStore.updateComponent(selectedComponent.value.id, { ...selectedComponent.value });
    }
  }
}

// 添加轮播图图片
function addCarouselImage() {
  if (selectedComponent.value && selectedComponent.value.type === 'carousel') {
    const newImages = [...selectedComponent.value.images];
    newImages.push({ url: '' });
    
    componentStore.updateComponent(selectedComponent.value.id, {
      ...selectedComponent.value,
      images: newImages
    });
  }
}

// 删除轮播图图片
function removeCarouselImage(index: number) {
  if (selectedComponent.value && selectedComponent.value.type === 'carousel') {
    const newImages = [...selectedComponent.value.images];
    newImages.splice(index, 1);
    
    componentStore.updateComponent(selectedComponent.value.id, {
      ...selectedComponent.value,
      images: newImages
    });
  }
}

// 添加热门类目小图
function addSmallImage() {
  if (selectedComponent.value && selectedComponent.value.type === 'category' && selectedComponent.value.smallImages.length < 6) {
    const newImages = [...selectedComponent.value.smallImages];
    newImages.push({ url: '', link: '#' });
    
    componentStore.updateComponent(selectedComponent.value.id, {
      ...selectedComponent.value,
      smallImages: newImages
    });
  }
}

// 删除热门类目小图
function removeSmallImage(index: number) {
  if (selectedComponent.value && selectedComponent.value.type === 'category') {
    const newImages = [...selectedComponent.value.smallImages];
    newImages.splice(index, 1);
    
    componentStore.updateComponent(selectedComponent.value.id, {
      ...selectedComponent.value,
      smallImages: newImages
    });
  }
}

// 添加商品分组
function addGroup() {
  if (selectedComponent.value && selectedComponent.value.type === 'productGroup') {
    const newGroups = [...selectedComponent.value.groups];
    newGroups.push({ title: '新分组', images: [] });
    
    componentStore.updateComponent(selectedComponent.value.id, {
      ...selectedComponent.value,
      groups: newGroups
    });
  }
}

// 删除商品分组
function removeGroup(index: number) {
  if (selectedComponent.value && selectedComponent.value.type === 'productGroup') {
    const newGroups = [...selectedComponent.value.groups];
    newGroups.splice(index, 1);
    
    componentStore.updateComponent(selectedComponent.value.id, {
      ...selectedComponent.value,
      groups: newGroups
    });
  }
}

// 添加分组图片
function addGroupImage(groupIndex: number) {
  if (selectedComponent.value && selectedComponent.value.type === 'productGroup') {
    const newGroups = JSON.parse(JSON.stringify(selectedComponent.value.groups));
    if (newGroups[groupIndex] && newGroups[groupIndex].images.length < 7) {
      newGroups[groupIndex].images.push({ url: '', link: '#' });
      
      componentStore.updateComponent(selectedComponent.value.id, {
        ...selectedComponent.value,
        groups: newGroups
      });
    }
  }
}

// 删除分组图片
function removeGroupImage(groupIndex: number, imageIndex: number) {
  if (selectedComponent.value && selectedComponent.value.type === 'productGroup') {
    const newGroups = JSON.parse(JSON.stringify(selectedComponent.value.groups));
    if (newGroups[groupIndex] && newGroups[groupIndex].images) {
      newGroups[groupIndex].images.splice(imageIndex, 1);
      
      componentStore.updateComponent(selectedComponent.value.id, {
        ...selectedComponent.value,
        groups: newGroups
      });
    }
  }
}
</script>

<style scoped lang="less">
.properties-panel {
  height: 100%;
  overflow-y: auto;
  
  .section {
    margin-bottom: 16px;
    border-bottom: 1px solid #eee;
    padding-bottom: 12px;
    
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>