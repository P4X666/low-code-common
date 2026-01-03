import { ComponentType } from "@/types/component";

export const getDefaultComponentData = (componentType: ComponentType) => {
  const template = [
      {
        type: 'text', createDefault: () => ({
          id: crypto.randomUUID(),
          type: 'text',
          name: '文本组件',
          content: '点击编辑文本',
          fontSize: 16,
          color: '#000000'
        })
      },
      {
        type: 'image', createDefault: () => ({
          id: crypto.randomUUID(),
          type: 'image',
          name: '图片组件',
          src: '',
          width: 250,
          height: 200,
          hover: false
        })
      },
      {        
        type: 'carousel', createDefault: () => ({
          id: crypto.randomUUID(),
          type: 'carousel',
          name: '轮播图组件',
          images: [{ url: 'https://picsum.photos/600/400?random=1' }],
          width: 750,
          height: 200,
          autoplay: true,
          interval: 3000,
          showIndicators: true,
          showControls: true
        })
      },
      {        
        type: 'banner', createDefault: () => ({
          id: crypto.randomUUID(),
          type: 'banner',
          name: 'Banner组件',
          title: 'Banner标题',
          images: [{ url: 'https://picsum.photos/750/200?random=10', link: '#' }],
          width: 450,
          height: 200
        })
      },
      {
        type: 'category', createDefault: () => ({
          id: crypto.randomUUID(),
          type: 'category',
          name: '热门类目组件',
          title: '热门类目',
          bigImage: { url: 'https://picsum.photos/300/300?random=11', link: '#' },
          smallImages: [
            { url: 'https://picsum.photos/100/100?random=12', link: '#', text: '类目1' },
            { url: 'https://picsum.photos/100/100?random=13', link: '#', text: '类目2' },
            { url: 'https://picsum.photos/100/100?random=14', link: '#', text: '类目3' },
            { url: 'https://picsum.photos/100/100?random=15', link: '#', text: '类目4' },
            { url: 'https://picsum.photos/100/100?random=16', link: '#', text: '类目5' },
            { url: 'https://picsum.photos/100/100?random=17', link: '#', text: '类目6' }
          ],
          width: 450,
          height: 300
        })
      },
      {
        type: 'productRank', createDefault: () => ({
          id: crypto.randomUUID(),
          type: 'productRank',
          name: '商品排行组件',
          title: '商品排行榜',
          subtitle: '热门商品推荐',
          dataSource: 'ranking',
          buttonText: '查看全部',
          buttonLink: '#',
          width: 750,
          height: 350
        })
      },
      {
        type: 'productGroup', createDefault: () => ({
          id: crypto.randomUUID(),
          type: 'productGroup',
          name: '商品分组组件',
          title: '商品分类',
          groups: [
            {
              title: '分类一',
              images: [
                { url: 'https://picsum.photos/200/200?random=18', link: '#' },
                { url: 'https://picsum.photos/200/200?random=19', link: '#' },
                { url: 'https://picsum.photos/200/200?random=20', link: '#' }
              ]
            },
            {
              title: '分类二',
              images: [
                { url: 'https://picsum.photos/200/200?random=21', link: '#' },
                { url: 'https://picsum.photos/200/200?random=22', link: '#' }
              ]
            }
          ],
          buttonText: '全部商品',
          buttonLink: '#',
          width: 750,
          height: 400
        })
      },
      {
        type: 'container', createDefault: () => ({
          id: crypto.randomUUID(),
          type: 'container',
          name: '容器组件',
          children: []
        })
      },
      {
        type: 'floatingButton', createDefault: () => ({
          id: crypto.randomUUID(),
          type: 'floatingButton',
          name: '底部悬浮按钮组件',
          content: '点击跳转',
        })
      },
    ].find(t => t.type === componentType);

    if (template) {
      return template.createDefault();
    }
    return null;
}
