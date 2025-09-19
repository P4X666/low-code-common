<template>
  <div class="product-rank-component" :class="{ 'selected': isSelected }" @click="selectComponent" :style="componentStyles">
    <div class="product-rank-container">
      <!-- 标题部分 -->
      <div class="product-rank-header">
        <h3 v-if="component.title" class="product-rank-title">{{ component.title }}</h3>
        <p v-if="component.subtitle" class="product-rank-subtitle">{{ component.subtitle }}</p>
        <div class="product-rank-tabs">
          <button 
            class="rank-tab" 
            :class="{ active: component.dataSource === 'ranking' }"
            @click.stop="changeDataSource('ranking')"
          >
            排行榜
          </button>
          <button 
            class="rank-tab" 
            :class="{ active: component.dataSource === 'hotSale' }"
            @click.stop="changeDataSource('hotSale')"
          >
            热卖榜
          </button>
        </div>
      </div>
      
      <!-- 排行榜内容 -->
      <div class="product-rank-content">
        <div v-for="(item, index) in getRankItems()" :key="index" class="product-rank-item">
          <div class="rank-number">{{ index + 1 }}</div>
          <div class="product-info">
            <div class="product-name">{{ item.name }}</div>
            <div class="product-price">{{ item.price }}</div>
          </div>
          <div class="product-image">
            <img :src="item.image" alt="商品图片" />
          </div>
        </div>
      </div>
      
      <!-- 底部按钮 -->
      <div v-if="component.buttonText" class="product-rank-footer">
        <a :href="component.buttonLink" target="_blank" class="view-all-button">
          {{ component.buttonText }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useComponentStore } from '../../../stores/componentStore';
import type { ProductRankComponent } from '../../../types/component';

const props = defineProps<{
  component: ProductRankComponent;
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

// 模拟排行榜数据
function getRankItems() {
  if (props.component.dataSource === 'ranking') {
    return [
      { name: '热门商品一', price: '¥199.00', image: 'https://picsum.photos/80/80?random=20' },
      { name: '热门商品二', price: '¥299.00', image: 'https://picsum.photos/80/80?random=21' },
      { name: '热门商品三', price: '¥159.00', image: 'https://picsum.photos/80/80?random=22' },
      { name: '热门商品四', price: '¥399.00', image: 'https://picsum.photos/80/80?random=23' },
      { name: '热门商品五', price: '¥129.00', image: 'https://picsum.photos/80/80?random=24' }
    ];
  } else {
    return [
      { name: '热卖商品一', price: '¥99.00', image: 'https://picsum.photos/80/80?random=25' },
      { name: '热卖商品二', price: '¥199.00', image: 'https://picsum.photos/80/80?random=26' },
      { name: '热卖商品三', price: '¥259.00', image: 'https://picsum.photos/80/80?random=27' },
      { name: '热卖商品四', price: '¥149.00', image: 'https://picsum.photos/80/80?random=28' },
      { name: '热卖商品五', price: '¥19.90', image: 'https://picsum.photos/80/80?random=29' }
    ];
  }
}

function selectComponent(event: MouseEvent) {
  event.stopPropagation();
  componentStore.selectComponent(props.component.id);
}

function changeDataSource(dataSource: 'ranking' | 'hotSale') {
  // 这里仅做UI切换，实际应用中应该从store更新数据
  console.log('切换数据源:', dataSource);
}
</script>

<style scoped lang="less">
@import '../common/styles.less';

.product-rank-component {
  padding: 8px;
  cursor: pointer;

  &.selected {
    .component-selected();
  }
}

.product-rank-container {
  border-radius: 4px;
  overflow: hidden;
  background-color: #ffffff;
  padding: 15px;
  border: 1px solid #e5e7eb;
}

.product-rank-header {
  margin-bottom: 15px;
  position: relative;
}

.product-rank-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.product-rank-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.product-rank-tabs {
  display: flex;
  gap: 10px;
  position: absolute;
  right: 0;
  top: 5px;
}

.rank-tab {
  padding: 4px 12px;
  border: 1px solid #d1d5db;
  background-color: white;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &.active {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  &:hover:not(.active) {
    border-color: #3b82f6;
    color: #3b82f6;
  }
}

.product-rank-content {
  margin-bottom: 15px;
}

.product-rank-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
}

.rank-number {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3b82f6;
  color: white;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  font-size: 16px;
  color: #ef4444;
  font-weight: bold;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.product-rank-footer {
  text-align: right;
}

.view-all-button {
  display: inline-block;
  padding: 6px 20px;
  background-color: #f3f4f6;
  color: #3b82f6;
  border-radius: 4px;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e5e7eb;
  }
}
</style>