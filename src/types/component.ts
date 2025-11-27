export interface StyleProperties {
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  icon?: string;
  borderRadius?: number;
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  boxShadow?: string;
  opacity?: number;
}

export interface ComponentBase {
  id: string;
  type: 'text' | 'image' | 'carousel' | 'banner' | 'category' | 'productRank' | 'productGroup' | 'container';
  name: string;
  customId?: string; // 用户自定义ID
  customName?: string; // 用户自定义名称
  link?: string;
  style?: StyleProperties;
}

export interface TextComponent extends ComponentBase {
  type: 'text';
  content: string;
  fontSize: number;
  color: string;
  fontWeight?: 'normal' | 'bold' | 'lighter';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  letterSpacing?: number
}

export interface ImageComponent extends ComponentBase {
  type: 'image';
  src: string;
  width: number;
  height: number;
  hover: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  filter?: string;
}

export interface CarouselImage {
  url: string;
  link?: string;
}

export interface CarouselComponent extends ComponentBase {
  type: 'carousel';
  images: CarouselImage[];
  width: number;
  height: number;
  autoplay: boolean;
  interval: number;
  showIndicators?: boolean;
  showControls?: boolean;
  transitionEffect?: 'slide' | 'fade';
}

// 公共业务组件属性接口
export interface BusinessComponentBase extends ComponentBase {
  title: string;
  startDate?: string;
  endDate?: string;
  images?: {
    url: string;
    link?: string;
    text?: string;
  }[];
}

// Banner组件
export interface BannerComponent extends BusinessComponentBase {
  type: 'banner';
  images: {
    url: string;
    link?: string;
    text?: string;
  }[];
}

// 热门类目组件
export interface CategoryComponent extends BusinessComponentBase {
  type: 'category';
  bigImage?: {
    url: string;
    link?: string;
  };
  smallImages: {
    url: string;
    link?: string;
    text?: string;
  }[];
}

// 商品排行组件
export interface ProductRankComponent extends BusinessComponentBase {
  type: 'productRank';
  dataSource: 'ranking' | 'hotSale';
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

// 商品分组组件
export interface ProductGroupComponent extends BusinessComponentBase {
  type: 'productGroup';
  groups: {
    title: string;
    images: {
      url: string;
      link?: string;
    }[];
  }[];
  buttonText?: string;
  buttonLink?: string;
}

// 容器组件
export interface ContainerComponent extends ComponentBase {
  type: 'container';
  children?: string[]; // 子组件ID列表
}

export type BaseComponent = TextComponent | ImageComponent | CarouselComponent | ContainerComponent
export type BusinessComponent = BannerComponent | CategoryComponent | ProductRankComponent | ProductGroupComponent;

export type Component = BaseComponent | BusinessComponent;
