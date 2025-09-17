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
  type: 'text' | 'image' | 'carousel';
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

export interface CarouselComponent extends ComponentBase {
  type: 'carousel';
  images: string[];
  width: number;
  height: number;
  autoplay: boolean;
  interval: number;
  showIndicators?: boolean;
  showControls?: boolean;
  transitionEffect?: 'slide' | 'fade';
}

export type Component = TextComponent | ImageComponent | CarouselComponent;