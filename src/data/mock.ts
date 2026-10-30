export type RouteKey =
  | 'home'
  | 'creator'
  | 'canvas'
  | 'workflow'
  | 'templates'
  | 'market'
  | 'assets'
  | 'account'

export type Template = {
  id: string
  title: string
  category: string
  type: '视频' | '图片' | '工作流'
  creator: string
  uses: string
  cover: string
  color: string
  tags: string[]
  featured?: boolean
}

export type Project = {
  id: string
  title: string
  type: string
  updated: string
  progress?: number
  cover: string
  status: '已完成' | '编辑中' | '排队中'
}

export const navGroups = [
  {
    label: '工作台',
    items: [
      { key: 'home' as RouteKey, label: '首页', icon: '⌂' },
      { key: 'creator' as RouteKey, label: 'AI 创作', icon: '✦', badge: 'NEW' },
      { key: 'canvas' as RouteKey, label: '我的画布', icon: '▦' },
      { key: 'workflow' as RouteKey, label: '工作流', icon: '⌁' },
    ],
  },
  {
    label: '发现与资产',
    items: [
      { key: 'templates' as RouteKey, label: '创意模板库', icon: '◈' },
      { key: 'market' as RouteKey, label: '画布广场', icon: '◇' },
      { key: 'assets' as RouteKey, label: '素材库', icon: '▧' },
    ],
  },
]

export const templates: Template[] = [
  {
    id: 't-01',
    title: '爆款复刻 · 智能药盒',
    category: '商品广告',
    type: '视频',
    creator: '超级编导精选',
    uses: '2.8k',
    cover: 'https://oss-sh2.oss-cn-shanghai.aliyuncs.com/aigc/template/superdir_new/cover/video/seedance2.0/1爆款复刻/seedance2.0fast智能药盒/preview_video_cover.jpg',
    color: '#dbeafe',
    tags: ['商品', '电商', '信息流'],
    featured: true,
  },
  {
    id: 't-02',
    title: '产品功能三维可视化',
    category: '创意广告',
    type: '视频',
    creator: '超级编导精选',
    uses: '1.6k',
    cover: 'https://oss-sh2.oss-cn-shanghai.aliyuncs.com/aigc/template/superdir_new/cover/video/seedance2.0/1爆款复刻/seedance2.0fast电动清洁刷/preview_video_cover.jpg',
    color: '#ede9fe',
    tags: ['功能展示', '科技', '三维'],
    featured: true,
  },
  {
    id: 't-03',
    title: '日常咖啡带货风格',
    category: '电商带货',
    type: '视频',
    creator: '超级编导精选',
    uses: '920',
    cover: 'https://oss-sh2.oss-cn-shanghai.aliyuncs.com/aigc/template/superdir_new/cover/video/seedance2.0/1爆款复刻/seedance2.0fast餐饮摆盘/preview_video_cover.jpg',
    color: '#ffedd5',
    tags: ['咖啡', '口播', '生活'],
    featured: true,
  },
  {
    id: 't-04',
    title: '一镜到底 · 服装上新',
    category: '品牌种草',
    type: '视频',
    creator: '灵感研究所',
    uses: '684',
    cover: 'https://oss-sh2.oss-cn-shanghai.aliyuncs.com/aigc/template/superdir_new/cover/video/seedance2.0/1爆款复刻/seedance2.0服装套装/preview_video_cover.jpg',
    color: '#fce7f3',
    tags: ['服饰', '穿搭', '小红书'],
  },
  {
    id: 't-05',
    title: '专业商品主图套版',
    category: '营销海报',
    type: '图片',
    creator: '超级编导精选',
    uses: '1.2k',
    cover: 'https://oss-sh2.oss-cn-shanghai.aliyuncs.com/aigc/template/superdir_new/cover/video/seedance2.0/1爆款复刻/seedance2.0fast香水/preview_video_cover.jpg',
    color: '#fef3c7',
    tags: ['主图', '海报', '电商'],
  },
  {
    id: 't-06',
    title: '厨房好物功能展示',
    category: '功能展示',
    type: '视频',
    creator: '灵感研究所',
    uses: '508',
    cover: 'https://oss-sh2.oss-cn-shanghai.aliyuncs.com/aigc/template/superdir_new/cover/video/seedance2.0/1爆款复刻/seedance2.0fast高压水管/preview_video_cover.jpg',
    color: '#dcfce7',
    tags: ['家居', '教程', '实用'],
  },
  {
    id: 't-07',
    title: '直播切片 · 三层平衡结构',
    category: '直播切片',
    type: '工作流',
    creator: '内容工厂',
    uses: '392',
    cover: 'https://oss-sh2.oss-cn-shanghai.aliyuncs.com/aigc/template/superdir_new/cover/video/seedance2.0/1爆款复刻/seedance2.0一加手机/preview_video_cover.jpg',
    color: '#e0f2fe',
    tags: ['直播', '剪辑', '批量'],
  },
  {
    id: 't-08',
    title: '美妆产品质感广告',
    category: '创意广告',
    type: '视频',
    creator: '超级编导精选',
    uses: '774',
    cover: 'https://oss-sh2.oss-cn-shanghai.aliyuncs.com/aigc/template/superdir_new/cover/video/seedance2.0/1爆款复刻/seedance2.0隔离霜/preview_video_cover.jpg',
    color: '#fae8ff',
    tags: ['美妆', '高端', '光影'],
  },
]

export const projects: Project[] = [
  {
    id: 'p-01',
    title: '轻盈随行 · 保温杯创意广告',
    type: '画布',
    updated: '今天 10:24',
    cover: 'https://oss-sh2.oss-cn-shanghai.aliyuncs.com/aigc/template/superdir_new/cover/video/seedance2.0/1爆款复刻/seedance2.0fast新车发布/preview_video_cover.jpg',
    status: '编辑中',
  },
  {
    id: 'p-02',
    title: '春季新品营销物料',
    type: '工作流',
    updated: '昨天 16:48',
    cover: 'https://oss-sh2.oss-cn-shanghai.aliyuncs.com/aigc/template/superdir_new/cover/video/seedance2.0/1爆款复刻/seedance2.0服装套装/preview_video_cover.jpg',
    status: '已完成',
  },
  {
    id: 'p-03',
    title: '智能清洁刷产品主图',
    type: '图片创作',
    updated: '10 月 28 日',
    cover: 'https://oss-sh2.oss-cn-shanghai.aliyuncs.com/aigc/template/superdir_new/cover/video/seedance2.0/1爆款复刻/seedance2.0fast电动清洁刷/image01.jpg',
    status: '排队中',
    progress: 68,
  },
]

export const assetItems = [
  { id: 'a-01', name: '咖啡杯产品图', kind: '图片', size: '2.4 MB', color: '#d97706', icon: '▧' },
  { id: 'a-02', name: '品牌片头音乐', kind: '音频', size: '4.8 MB', color: '#7c3aed', icon: '♪' },
  { id: 'a-03', name: '手机开箱参考', kind: '视频', size: '18.2 MB', color: '#2563eb', icon: '▶' },
  { id: 'a-04', name: '白色背景素材', kind: '图片', size: '1.1 MB', color: '#0f766e', icon: '▧' },
  { id: 'a-05', name: '口播脚本 v2', kind: '文案', size: '12 KB', color: '#db2777', icon: '≡' },
  { id: 'a-06', name: '厨房实拍镜头', kind: '视频', size: '22.6 MB', color: '#4f46e5', icon: '▶' },
]

export const canvasNodes = [
  { id: 'node-input', type: '输入素材', title: '商品原图', description: '上传 1 张商品主图', x: 70, y: 180, tone: 'blue' },
  { id: 'node-prompt', type: '文案生成', title: '营销提示词', description: '突出轻盈、耐用与通勤场景', x: 310, y: 92, tone: 'purple' },
  { id: 'node-image', type: '图片生成', title: '生成商品主图', description: '影棚柔光 · 4:5 · 高清', x: 310, y: 260, tone: 'orange' },
  { id: 'node-video', type: '视频生成', title: '生成创意短片', description: '一镜到底 · 6 秒 · 9:16', x: 570, y: 178, tone: 'green' },
]

export const workflowSteps = [
  { id: 'step-01', title: '上传商品素材', type: '素材输入', status: 'done', description: '从素材库选择 1 张商品图' },
  { id: 'step-02', title: '生成营销文案', type: '文案生成', status: 'done', description: '输出标题、卖点与行动号召' },
  { id: 'step-03', title: '生成多尺寸海报', type: '图片生成', status: 'current', description: '输出 1:1、4:5、9:16 三种比例' },
  { id: 'step-04', title: '生成商品短片', type: '视频生成', status: 'pending', description: '用海报与文案生成信息流视频' },
]

export const workflowList = [
  { id: 'w-01', title: '新品营销完整链路', count: 4, updated: '今天 09:32', active: true },
  { id: 'w-02', title: '商品主图批量套版', count: 3, updated: '昨天 18:20' },
  { id: 'w-03', title: '直播切片自动整理', count: 5, updated: '10 月 26 日' },
]

export const categoryOptions = ['全部', '商品广告', '创意广告', '电商带货', '品牌种草', '营销海报', '功能展示', '直播切片']

export function filterTemplates(items: Template[], category: string, query: string): Template[] {
  const normalizedQuery = query.trim().toLowerCase()
  return items.filter((template) => {
    const matchesCategory = category === '全部' || template.category === category
    const haystack = `${template.title} ${template.category} ${template.tags.join(' ')}`.toLowerCase()
    return matchesCategory && haystack.includes(normalizedQuery)
  })
}
