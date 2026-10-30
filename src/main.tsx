import { StrictMode, useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import {
  AlignLeft,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleHelp,
  Download,
  GalleryVerticalEnd,
  Heart,
  House,
  Image,
  Images,
  LayoutGrid,
  Menu,
  Minus,
  Moon,
  MousePointer2,
  Music2,
  PanelsTopLeft,
  Play,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Square,
  Sun,
  Trash2,
  Undo2,
  Workflow,
  type LucideIcon,
  WandSparkles,
} from 'lucide-react'
import {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { createRoot } from 'react-dom/client'
import {
  assetItems,
  canvasNodes as seedNodes,
  categoryOptions,
  filterTemplates,
  navGroups,
  projects,
  templates,
  workflowList,
  workflowSteps as seedWorkflowSteps,
  type RouteKey,
  type Template,
} from './data/mock'
import './styles.css'

const routeLabels: Record<RouteKey, string> = {
  home: '首页',
  creator: 'AI 创作',
  canvas: '我的画布',
  workflow: '工作流',
  templates: '创意模板库',
  market: '画布广场',
  assets: '素材库',
  account: '我的账号',
}

const routeHashes: Record<RouteKey, string> = {
  home: 'home', creator: 'aigc-creator', canvas: 'aigc-canvas', workflow: 'workflow',
  templates: 'aigc-template-library', market: 'aigc-canvas-market', assets: 'aigc-assets', account: 'account',
}

const hashRoutes = Object.fromEntries(Object.entries(routeHashes).map(([route, hash]) => [hash, route])) as Record<string, RouteKey>

function useLocalState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key)
    if (saved) {
      try { return JSON.parse(saved) as T } catch { localStorage.removeItem(key) }
    }
    return initial
  })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)) }, [key, value])
  return [value, setValue]
}

const routeFromHash = (): RouteKey => {
  const value = window.location.hash.replace(/^#\/?/, '').split('/')[0]
  return hashRoutes[value] || (Object.prototype.hasOwnProperty.call(routeLabels, value) ? (value as RouteKey) : 'home')
}

const iconMap: Record<string, LucideIcon> = {
  '⌂': House, '✦': Sparkles, '▦': LayoutGrid, '⌁': Workflow, '◈': GalleryVerticalEnd, '◇': PanelsTopLeft,
  '▧': Images, '＋': Plus, '›': ChevronRight, '‹': ChevronLeft, '⌕': Search, '☾': Moon, '☀': Sun,
  '♢': Bell, '↺': RotateCcw, '✧': WandSparkles, '↓': Download, '→': ArrowRight, '↗': ArrowUpRight,
  '↖': MousePointer2, '⌫': Trash2, '▣': Image, '▶': Play, '−': Minus, '⌄': ChevronDown, '♪': Music2,
  '≡': AlignLeft, '◌': Circle, '▤': BookOpen, '?': CircleHelp, '↶': Undo2, '↷': ArrowLeft, '□': Square,
  '♡': Heart, '♥': Heart, '✓': Check, '☰': Menu,
}

function Symbol({ children, className = '' }: { children: string; className?: string }) {
  const Icon = iconMap[children]
  return Icon ? <span className={`symbol ${className}`} aria-hidden="true"><Icon /></span> : <span className={`symbol ${className}`} aria-hidden="true">{children}</span>
}

function App() {
  const [route, setRoute] = useState<RouteKey>(routeFromHash)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('superdir-theme') as 'light' | 'dark') || 'light')
  const [toast, setToast] = useState('')
  const [globalSearch, setGlobalSearch] = useState('')
  const [favoriteIds, setFavoriteIds] = useLocalState<string[]>('superdir-favorites', ['t-02'])
  const [templateQuery, setTemplateQuery] = useState('')
  const [templateCategory, setTemplateCategory] = useState('全部')
  const [nodes, setNodes] = useLocalState('superdir-canvas-nodes', seedNodes)
  const [selectedNode, setSelectedNode] = useState(seedNodes[0].id)
  const [workflowSteps, setWorkflowSteps] = useLocalState('superdir-workflow-steps', seedWorkflowSteps)
  const [workflowRunning, setWorkflowRunning] = useState(false)

  useEffect(() => {
    const onHashChange = () => setRoute(routeFromHash())
    window.addEventListener('hashchange', onHashChange)
    document.documentElement.dataset.theme = theme
    localStorage.setItem('superdir-theme', theme)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [theme])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])

  const navigate = (next: RouteKey) => {
    window.location.hash = `#/${routeHashes[next]}`
    setRoute(next)
    setMobileNavOpen(false)
  }

  const notify = (message: string) => setToast(message)

  const filteredTemplates = useMemo(() => filterTemplates(templates, templateCategory, templateQuery), [templateCategory, templateQuery])

  const toggleFavorite = (id: string) => {
    setFavoriteIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
    notify(favoriteIds.includes(id) ? '已取消收藏' : '已加入收藏')
  }

  const useTemplate = (template: Template) => {
    notify(`已引用「${template.title}」，正在打开创作配置`)
    navigate('creator')
  }

  const addNode = (kind: string) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: kind,
      title: kind === '图片生成' ? '新图片生成' : kind === '视频生成' ? '新视频生成' : '新节点',
      description: '双击节点编辑配置',
      x: 180 + (nodes.length % 2) * 250,
      y: 390 + Math.floor(nodes.length / 2) * 125,
      tone: kind === '视频生成' ? 'green' : kind === '图片生成' ? 'orange' : 'blue',
    }
    setNodes((current) => [...current, newNode])
    setSelectedNode(newNode.id)
    notify(`已添加「${kind}」节点`)
  }

  const deleteSelectedNode = () => {
    if (nodes.length <= 1) return notify('画布至少需要保留一个节点')
    setNodes((current) => current.filter((node) => node.id !== selectedNode))
    setSelectedNode(nodes.find((node) => node.id !== selectedNode)?.id || nodes[0].id)
    notify('节点已移除，可使用撤销恢复')
  }

  const runWorkflow = () => {
    setWorkflowRunning(true)
    setWorkflowSteps((current) => current.map((step, index) => ({ ...step, status: index < 2 ? 'done' : index === 2 ? 'current' : 'pending' })))
    notify('工作流已提交到队列，预计 2 分钟完成')
    window.setTimeout(() => {
      setWorkflowSteps((current) => current.map((step) => ({ ...step, status: 'done' })))
      setWorkflowRunning(false)
      notify('工作流全部执行完毕，成品已保存到素材库')
    }, 2600)
  }

  const renderPage = () => {
    const common = { navigate, notify, templates: filteredTemplates, favoriteIds, toggleFavorite, useTemplate }
    switch (route) {
      case 'creator': return <CreatorPage {...common} />
      case 'canvas': return <CanvasPage nodes={nodes} selectedNode={selectedNode} setSelectedNode={setSelectedNode} addNode={addNode} deleteSelectedNode={deleteSelectedNode} notify={notify} />
      case 'workflow': return <WorkflowPage steps={workflowSteps} running={workflowRunning} onRun={runWorkflow} notify={notify} />
      case 'templates': return <LibraryPage kind="templates" {...common} query={templateQuery} setQuery={setTemplateQuery} category={templateCategory} setCategory={setTemplateCategory} />
      case 'market': return <LibraryPage kind="market" {...common} query={templateQuery} setQuery={setTemplateQuery} category={templateCategory} setCategory={setTemplateCategory} />
      case 'assets': return <AssetsPage notify={notify} />
      case 'account': return <AccountPage notify={notify} />
      default: return <HomePage navigate={navigate} notify={notify} useTemplate={useTemplate} />
    }
  }

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'is-collapsed' : ''}`}>
      <aside className={`sidebar ${mobileNavOpen ? 'is-mobile-open' : ''}`}>
        <div className="brand-row">
          <button className="brand" onClick={() => navigate('home')} aria-label="回到首页">
            <span className="brand-mark">✦</span>
            {!sidebarCollapsed && <span><strong>超级编导</strong><small>SUPERDIR STUDIO</small></span>}
          </button>
          <button className="icon-button sidebar-toggle" onClick={() => setSidebarCollapsed((value) => !value)} aria-label={sidebarCollapsed ? '展开侧栏' : '收起侧栏'}>{sidebarCollapsed ? '›' : '‹'}</button>
        </div>
        <button className="new-canvas-button" onClick={() => { setNodes([]); setSelectedNode(''); navigate('canvas'); notify('已新建空白画布') }}><Symbol>＋</Symbol>{!sidebarCollapsed && <span>新建画布</span>}</button>
        <nav className="side-nav" aria-label="主导航">
          {navGroups.map((group) => <div className="nav-group" key={group.label}>
            {!sidebarCollapsed && <p className="nav-label">{group.label}</p>}
            {group.items.map((item) => <button className={`nav-item ${route === item.key ? 'is-active' : ''}`} key={item.key} onClick={() => navigate(item.key)} title={sidebarCollapsed ? item.label : undefined}>
              <Symbol>{item.icon}</Symbol><span className="nav-text">{item.label}</span>{item.badge && !sidebarCollapsed && <em>{item.badge}</em>}
            </button>)}
          </div>)}
        </nav>
        <div className="sidebar-bottom">
          <button className={`nav-item ${route === 'account' ? 'is-active' : ''}`} onClick={() => navigate('account')} title={sidebarCollapsed ? '我的账号' : undefined}><span className="avatar avatar-small">林</span><span className="nav-text account-label"><strong>林晓溪</strong><small>专业版</small></span></button>
          <button className="nav-item" onClick={() => notify('帮助中心即将开放')} title={sidebarCollapsed ? '帮助中心' : undefined}><Symbol>?</Symbol><span className="nav-text">帮助中心</span></button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left"><button className="mobile-menu" onClick={() => setMobileNavOpen((value) => !value)} aria-label="打开导航">☰</button><span className="breadcrumb">{routeLabels[route]}</span><span className="breadcrumb-separator">/</span><span className="breadcrumb-muted">本地工作区</span></div>
          <div className="topbar-actions">
            <label className="global-search"><Symbol>⌕</Symbol><input value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && notify(globalSearch ? `正在搜索「${globalSearch}」` : '请输入搜索内容')} placeholder="搜索画布、模板或素材" /><kbd>⌘ K</kbd></label>
            <button className="topbar-link" onClick={() => notify('新手教程已准备好')}><Symbol>▤</Symbol><span>使用教程</span></button>
            <button className="icon-button" onClick={() => setTheme((value) => value === 'light' ? 'dark' : 'light')} aria-label="切换主题">{theme === 'light' ? '☾' : '☀'}</button>
            <button className="notification-button" onClick={() => notify('没有新的通知')} aria-label="通知"><Symbol>♢</Symbol><span className="notification-dot" /></button>
            <button className="topbar-avatar" onClick={() => navigate('account')} aria-label="打开账号设置">林</button>
          </div>
        </header>
        <div className="page-content">{renderPage()}</div>
      </main>
      {toast && <div className="toast" role="status"><span className="toast-check">✓</span>{toast}</div>}
    </div>
  )
}

type SharedPageProps = {
  navigate: (route: RouteKey) => void
  notify: (message: string) => void
  templates: Template[]
  favoriteIds: string[]
  toggleFavorite: (id: string) => void
  useTemplate: (template: Template) => void
}

function PageTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="page-title-row"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>{action}</div>
}

function HomePage({ navigate, notify, useTemplate }: Pick<SharedPageProps, 'navigate' | 'notify' | 'useTemplate'>) {
  const [prompt, setPrompt] = useState('')
  const [submitted, setSubmitted] = useState(false)
  return <div className="home-page">
    <section className="welcome-strip"><div><p className="eyebrow">AI CONTENT STUDIO · 2026</p><h1>让创作从一句话开始<span className="title-dot">。</span></h1><p>把灵感变成可发布的图片、视频与完整营销物料。</p></div><div className="welcome-stats"><div><strong>12</strong><span>本月剩余创作</span></div><div><strong>86%</strong><span>素材复用率</span></div></div></section>
    <section className="prompt-composer panel"><div className="composer-heading"><span className="composer-icon">✦</span><div><strong>开始你的第一次创作</strong><span>描述你想要的内容，或从模板开始</span></div><span className="local-badge"><i />本地演示</span></div><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="例如：生成一条突出轻盈与耐用属性的保温杯商品广告，适合抖音信息流..." rows={3} /><div className="composer-footer"><div className="composer-tools"><button className="plain-button" onClick={() => notify('参考素材上传入口已打开')}><Symbol>＋</Symbol>添加参考素材</button><button className="plain-button" onClick={() => notify('提示词优化建议：加入场景、镜头与平台信息')}><Symbol>✧</Symbol>优化提示词</button></div><button className="primary-button" onClick={() => { setSubmitted(true); notify('创作任务已提交，进入 AI 创作工作区'); navigate('creator') }}>{submitted ? '继续创作' : '开始生成'}<span>→</span></button></div></section>
    <section className="section-block"><div className="section-heading"><div><h2>快速开始</h2><p>从带货、探店、口播结构开始，快速得到第一版结果</p></div><button className="text-button" onClick={() => navigate('creator')}>查看全部 <span>→</span></button></div><div className="quick-grid">
      {[
        ['文字生视频', '只用文字描述生成视频', '✦', 'blue', 'creator'],
        ['图片生视频', '让静态商品拥有轻微运镜', '▧', 'purple', 'creator'],
        ['批量套版', '一键生成多尺寸营销海报', '▦', 'orange', 'workflow'],
        ['视频换背景', '上传视频，快速替换场景', '◌', 'green', 'creator'],
      ].map(([title, desc, icon, tone, target]) => <button className="quick-card" key={title} onClick={() => navigate(target as RouteKey)}><span className={`quick-icon ${tone}`}>{icon}</span><span><strong>{title}</strong><small>{desc}</small></span><span className="card-arrow">↗</span></button>)}
    </div></section>
    <section className="section-block"><div className="section-heading"><div><h2>最近编辑</h2><p>继续完成你还没做完的创作</p></div><button className="text-button" onClick={() => navigate('canvas')}>查看全部 <span>→</span></button></div><div className="project-grid">{projects.map((project) => <button className="project-card" key={project.id} onClick={() => navigate(project.type === '工作流' ? 'workflow' : project.type === '画布' ? 'canvas' : 'creator')}><div className="project-cover" style={{ backgroundColor: '#e7edf7' }}><img src={project.cover} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} /><span className="project-type">{project.type}</span>{project.status === '排队中' && <span className="progress-ring">{project.progress}%</span>}</div><div className="project-meta"><strong>{project.title}</strong><span>{project.updated}<i className={`status-dot ${project.status === '已完成' ? 'done' : project.status === '编辑中' ? 'editing' : 'queued'}`} />{project.status}</span></div></button>)}</div></section>
    <section className="section-block template-section"><div className="section-heading"><div><h2>精选模板</h2><p>参考热门内容的画面与节奏，一键做同款</p></div><button className="text-button" onClick={() => navigate('templates')}>打开模板库 <span>→</span></button></div><div className="template-grid home-template-grid">{templates.filter((template) => template.featured).slice(0, 3).map((template) => <TemplateCard template={template} key={template.id} onUse={useTemplate} onFavorite={() => undefined} favorite={false} />)}</div></section>
    <section className="insight-banner panel"><div className="insight-mark">◒</div><div><strong>无限画布全新升级</strong><p>从灵感到成片，把每一个节点连接成完整营销链路。</p></div><button className="secondary-button" onClick={() => navigate('canvas')}>去画布看看 <span>→</span></button></section>
  </div>
}

function CreatorPage({ notify, navigate, templates, useTemplate }: Pick<SharedPageProps, 'notify' | 'navigate' | 'templates' | 'useTemplate'>) {
  const [mode, setMode] = useState('文字生视频')
  const [prompt, setPrompt] = useState('制作一条突出轻盈与耐用属性的保温杯商品广告。场景是清晨通勤，光线自然，镜头简洁有质感。')
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)
  const modes = [['文字生视频', '✦'], ['图片生视频', '▧'], ['视频换背景', '◌'], ['图片编辑', '✧']]
  const submit = () => { setGenerating(true); setDone(false); notify('已创建生成任务，正在排队'); window.setTimeout(() => { setGenerating(false); setDone(true); notify('生成完成，可继续调整或导出') }, 2200) }
  return <div className="creator-page"><PageTitle eyebrow="AI CREATOR" title="AI 创作" description="从一句话、一个商品或一段参考视频，开始你的创意。" action={<button className="secondary-button" onClick={() => navigate('templates')}>打开模板库 <span>→</span></button>} />
    <div className="creator-layout"><aside className="creator-config panel"><div className="config-title"><span>创作配置</span><button className="icon-button" onClick={() => notify('创作配置已重置')}>↺</button></div><div className="mode-list">{modes.map(([label, icon]) => <button className={`mode-item ${mode === label ? 'is-active' : ''}`} key={label} onClick={() => setMode(label)}><span>{icon}</span><strong>{label}</strong>{label === '文字生视频' && <em>推荐</em>}</button>)}</div><div className="config-divider" /><label className="field-label">创作描述<span>0/2000</span></label><textarea className="creator-textarea" rows={6} value={prompt} onChange={(event) => setPrompt(event.target.value)} /><div className="suggestion-row"><button onClick={() => setPrompt('制作一个专业的商品广告，突出产品材质和功能，适合抖音和快手信息流。')}>专业商品广告</button><button onClick={() => setPrompt('参考爆款视频的节奏，替换为我的商品并保留画面结构。')}>爆款复刻</button></div><div className="upload-zone" onClick={() => notify('素材选择器已打开')}><span>＋</span><strong>添加参考素材</strong><small>图片、视频或音频，最多 10 个</small></div><div className="select-row"><label>画面比例<select defaultValue="9:16"><option>9:16 竖屏</option><option>1:1 方形</option><option>16:9 横屏</option><option>4:5 竖版海报</option></select></label><label>输出时长<select defaultValue="6 秒"><option>6 秒</option><option>10 秒</option><option>15 秒</option></select></label></div><button className="primary-button full-button" onClick={submit} disabled={generating}>{generating ? '生成中…' : '开始生成'}<span>{generating ? '◌' : '→'}</span></button></aside><section className="creator-stage panel"><div className="stage-toolbar"><div><strong>{mode}</strong><span>本地演示工作区</span></div><div className="stage-actions"><button className="icon-button" onClick={() => notify('已撤销上一步操作')}>↶</button><button className="icon-button" onClick={() => notify('已重做上一步操作')}>↷</button><button className="icon-button" onClick={() => notify('画布已清空')}>□</button></div></div><div className={`stage-preview ${done ? 'has-result' : ''}`}>{done ? <div className="result-preview"><div className="result-art"><span className="result-orb" /><span className="result-bottle">▮</span><div><small>轻盈随行</small><strong>一杯，陪你走得更远</strong></div></div><div className="result-footer"><span><i className="status-dot done" />已生成 1 个结果</span><button className="secondary-button" onClick={() => notify('已保存到成片库')}>保存到成片库</button><button className="primary-button compact" onClick={() => notify('导出任务已创建')}>导出 <span>↓</span></button></div></div> : <div className="empty-stage"><div className="empty-logo">✦</div><strong>{generating ? '正在准备创作空间' : '你的成片会出现在这里'}</strong><span>{generating ? '正在理解提示词与参考素材…' : '输入描述并点击“开始生成”，查看第一版结果'}</span><div className="stage-hints"><span>支持图片生视频</span><span>支持多种画面比例</span><span>支持一键做同款</span></div></div>}</div></section><aside className="creator-history panel"><div className="config-title"><span>生成记录</span><button className="text-button" onClick={() => notify('已清空生成记录')}>清空</button></div>{[...projects, { id: 'history-01', title: '夏日果茶产品海报', type: '图片生成', updated: '10 月 27 日', cover: templates[2].cover, status: '已完成' as const }].map((item) => <button className="history-item" key={item.id} onClick={() => notify(`已打开「${item.title}」`)}><div className="history-cover"><img src={item.cover} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} /></div><div><strong>{item.title}</strong><span>{item.updated}</span></div><span className="history-more">···</span></button>)}</aside></div><section className="section-block compact-section"><div className="section-heading"><div><h2>从模板开始</h2><p>少写提示词，也能快速得到专业结果</p></div><button className="text-button" onClick={() => navigate('templates')}>更多模板 <span>→</span></button></div><div className="template-grid">{templates.slice(0, 4).map((template) => <TemplateCard template={template} key={template.id} onUse={useTemplate} onFavorite={() => undefined} favorite={false} />)}</div></section></div>
}

type CanvasNode = typeof seedNodes[number]
type FlowNodeData = { title: string; type: string; description: string; tone: string }

function StudioNode({ data, selected }: NodeProps) {
  const content = data as unknown as FlowNodeData
  return <div className={`flow-node tone-${content.tone} ${selected ? 'is-selected' : ''}`}><span className="flow-node-type">{content.type}</span><strong>{content.title}</strong><small>{content.description}</small><span className="flow-port input" /><span className="flow-port output" /></div>
}

const flowNodeTypes = { studio: StudioNode }

function CanvasPage({ nodes, selectedNode, setSelectedNode, addNode, deleteSelectedNode, notify }: { nodes: CanvasNode[]; selectedNode: string; setSelectedNode: (id: string) => void; addNode: (kind: string) => void; deleteSelectedNode: () => void; notify: (message: string) => void }) {
  const initialNodes = nodes.map((node) => ({ id: node.id, type: 'studio', position: { x: node.x, y: node.y }, data: { title: node.title, type: node.type, description: node.description, tone: node.tone } })) as Node<FlowNodeData>[]
  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState<Node<FlowNodeData>>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: 'edge-1', source: 'node-input', target: 'node-prompt', type: 'smoothstep', animated: true },
    { id: 'edge-2', source: 'node-input', target: 'node-image', type: 'smoothstep', animated: true },
    { id: 'edge-3', source: 'node-prompt', target: 'node-video', type: 'smoothstep', animated: true },
    { id: 'edge-4', source: 'node-image', target: 'node-video', type: 'smoothstep', animated: true },
  ])
  useEffect(() => { setFlowNodes(nodes.map((node) => ({ id: node.id, type: 'studio', position: { x: node.x, y: node.y }, data: { title: node.title, type: node.type, description: node.description, tone: node.tone } })) as Node<FlowNodeData>[]) }, [nodes, setFlowNodes])
  const selected = nodes.find((node) => node.id === selectedNode) || nodes[0]
  const onConnect = (connection: Connection) => setEdges((current) => addEdge({ ...connection, type: 'smoothstep', animated: true }, current))
  const onNodeClick = (_event: React.MouseEvent, node: Node) => setSelectedNode(node.id)
  return <div className="canvas-page"><PageTitle eyebrow="INFINITE CANVAS" title="我的画布" description="把灵感、素材和生成结果放在同一张画布上。" action={<div className="title-actions"><button className="secondary-button" onClick={() => notify('画布已保存')}>保存 <span>⌘ S</span></button><button className="primary-button" onClick={() => notify('导出任务已创建')}>导出 <span>↓</span></button></div>} /><div className="canvas-toolbar panel"><div className="canvas-tools"><button className="tool-button is-active"><Symbol>↖</Symbol>选择</button><button className="tool-button" onClick={() => addNode('图片生成')}><Symbol>＋</Symbol>添加节点</button><button className="tool-button" onClick={() => notify('已复制选中节点')}><Symbol>▣</Symbol>复制</button><button className="tool-button" onClick={deleteSelectedNode}><Symbol>⌫</Symbol>删除</button></div><div className="canvas-status"><span><i className="status-dot done" />已保存</span><span className="zoom-control"><button onClick={() => notify('画布缩小')}>−</button><strong>82%</strong><button onClick={() => notify('画布放大')}>＋</button></span></div></div><div className="canvas-workspace"><aside className="node-library panel"><div className="panel-heading"><strong>节点库</strong><button className="icon-button" onClick={() => notify('节点库搜索')}>⌕</button></div><p>拖到画布空白处即可添加</p>{[['输入素材', '▧', '上传图片、视频或音频'], ['文案生成', '≡', '标题、卖点和脚本'], ['图片生成', '▣', '商品主图与营销海报'], ['视频生成', '▶', '图生视频与创意短片'], ['处理工具', '✧', '抠图、扩图、去水印']].map(([label, icon, desc]) => <button className="node-library-item" key={label} onClick={() => addNode(label)}><span className="node-lib-icon"><Symbol>{icon}</Symbol></span><span><strong>{label}</strong><small>{desc}</small></span><span className="node-add"><Symbol>＋</Symbol></span></button>)}</aside><section className="canvas-board"><div className="board-label">未命名画布 <span>·</span> {nodes.length} 个节点</div><div className="board-canvas reactflow-board"><ReactFlow nodes={flowNodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onNodeClick={onNodeClick} nodeTypes={flowNodeTypes} fitView fitViewOptions={{ padding: 0.2 }} proOptions={{ hideAttribution: true }}><Background gap={18} size={1} color="#cbd6e6" /><Controls showInteractive={false} /><MiniMap pannable zoomable nodeColor="#9dbff2" /></ReactFlow></div></section><aside className="node-inspector panel"><div className="panel-heading"><strong>节点配置</strong><button className="icon-button" onClick={() => notify('节点配置已收起')}>×</button></div>{selected && <><div className="inspector-type"><span className={`node-lib-icon tone-${selected.tone}`}><Symbol>✦</Symbol></span><div><strong>{selected.title}</strong><small>{selected.type}</small></div></div><label className="field-label">节点名称<input defaultValue={selected.title} /></label><label className="field-label">提示词<textarea defaultValue={selected.description} rows={5} /></label><div className="inspector-section"><span>输出设置</span><div className="mini-setting"><span>画面比例</span><strong>9:16</strong></div><div className="mini-setting"><span>清晰度</span><strong>高清</strong></div></div><button className="primary-button full-button" onClick={() => notify(`「${selected.title}」配置已保存`)}>保存节点配置</button></>}</aside></div></div>
}

function WorkflowPage({ steps, running, onRun, notify }: { steps: typeof seedWorkflowSteps; running: boolean; onRun: () => void; notify: (message: string) => void }) {
  return <div className="workflow-page"><PageTitle eyebrow="AUTOMATION" title="工作流" description="把重复的创作步骤串起来，一次配置，批量执行。" action={<button className="primary-button" onClick={() => notify('已新建空白工作流')}>＋ 新建工作流</button>} /><div className="workflow-layout"><aside className="workflow-list panel"><div className="panel-heading"><strong>我的工作流</strong><button className="icon-button" onClick={() => notify('工作流搜索')}>⌕</button></div>{workflowList.map((workflow) => <button className={`workflow-list-item ${workflow.active ? 'is-active' : ''}`} key={workflow.id} onClick={() => notify(`已打开「${workflow.title}」`)}><span className="workflow-symbol">⌁</span><span><strong>{workflow.title}</strong><small>{workflow.count} 个步骤 · {workflow.updated}</small></span><span className="list-more">···</span></button>)}<button className="empty-add" onClick={() => notify('工作流创建面板已打开')}>＋ 从模板创建</button></aside><section className="workflow-editor panel"><div className="editor-header"><div><span className="status-pill"><i className="status-dot editing" />编辑中</span><h2>新品营销完整链路</h2><p>已自动保存 · 最后编辑于今天 09:32</p></div><div className="editor-actions"><button className="secondary-button" onClick={() => notify('工作流已复制')}>复制</button><button className="primary-button" onClick={onRun} disabled={running}>{running ? '执行中…' : '开始执行'} <span>▶</span></button></div></div><div className="workflow-canvas"><div className="workflow-line" />{steps.map((step, index) => <div className={`workflow-step ${step.status}`} key={step.id}><div className="step-index">{step.status === 'done' ? '✓' : index + 1}</div><div className="step-card"><div className="step-card-top"><span className="step-kind">{step.type}</span><button className="icon-button" onClick={() => notify('步骤菜单已打开')}>···</button></div><strong>{step.title}</strong><p>{step.description}</p><div className="step-meta"><span>{step.status === 'done' ? '已完成' : step.status === 'current' ? '等待执行' : '未开始'}</span>{step.status === 'current' && <span className="step-loader">◌</span>}</div></div></div>)}<button className="workflow-add" onClick={() => notify('步骤节点库已打开')}>＋ 添加步骤</button></div><div className="workflow-footer"><span>预计消耗 <strong>18</strong> 个创作点</span><span>预计耗时 <strong>2-4 分钟</strong></span><button className="text-button" onClick={() => notify('执行记录已打开')}>查看执行记录 →</button></div></section></div></div>
}

function TemplateCard({ template, onUse, onFavorite, favorite }: { template: Template; onUse: (template: Template) => void; onFavorite: (id: string) => void; favorite: boolean }) {
  return <article className="template-card"><button className="template-cover" style={{ backgroundColor: template.color }} onClick={() => onUse(template)}><img src={template.cover} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} /><span className="template-type">{template.type}</span><span className="template-play">▶</span></button><div className="template-info"><div><strong>{template.title}</strong><span>{template.creator} · {template.uses} 次使用</span></div><button className={`favorite-button ${favorite ? 'is-favorite' : ''}`} onClick={() => onFavorite(template.id)} aria-label={favorite ? '取消收藏' : '收藏'}>{favorite ? '♥' : '♡'}</button></div><div className="tag-row">{template.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>
}

function LibraryPage({ kind, templates: filteredTemplates, favoriteIds, toggleFavorite, useTemplate, notify, query, setQuery, category, setCategory }: SharedPageProps & { kind: 'templates' | 'market'; query: string; setQuery: (value: string) => void; category: string; setCategory: (value: string) => void }) {
  const isMarket = kind === 'market'
  const title = isMarket ? '画布广场' : '创意模板库'
  const description = isMarket ? '看看别人如何搭建一条完整的营销链路，把好用的画布复制到自己的工作区。' : '从热门创意和成熟结构开始，少写提示词，也能快速做出专业内容。'
  return <div className="library-page"><PageTitle eyebrow={isMarket ? 'CANVAS MARKET' : 'TEMPLATE LIBRARY'} title={title} description={description} action={isMarket ? <button className="secondary-button" onClick={() => notify('发布画布入口已打开')}>去发布我的画布 <span>→</span></button> : <button className="primary-button" onClick={() => notify('模板创建入口已打开')}>＋ 创建模板</button>} /><div className="library-toolbar panel"><div className="library-tabs"><button className={!isMarket ? 'is-active' : ''} onClick={() => !isMarket && undefined}>全部模板</button><button onClick={() => notify('我的收藏已筛选')}>我的收藏 <span>{favoriteIds.length}</span></button><button onClick={() => notify('最近使用已筛选')}>最近使用</button></div><label className="library-search"><Symbol>⌕</Symbol><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isMarket ? '搜索画布' : '搜索模板标题'} /></label></div><div className="category-row">{categoryOptions.map((option) => <button className={category === option ? 'is-active' : ''} onClick={() => setCategory(option)} key={option}>{option}</button>)}</div><div className="library-summary"><span>共 {filteredTemplates.length} 个{isMarket ? '公开画布' : '模板'}</span><button className="sort-button" onClick={() => notify('已按最新发布排序')}>最新发布 <span>⌄</span></button></div><div className="template-grid library-grid">{filteredTemplates.length ? filteredTemplates.map((template) => <TemplateCard template={template} key={template.id} onUse={useTemplate} onFavorite={toggleFavorite} favorite={favoriteIds.includes(template.id)} />) : <div className="empty-state panel"><div className="empty-logo">⌕</div><strong>没有匹配的内容</strong><span>试试调整关键词，或清除筛选条件</span><button className="secondary-button" onClick={() => { setQuery(''); setCategory('全部') }}>清除筛选</button></div>}</div></div>
}

function AssetsPage({ notify }: { notify: (message: string) => void }) {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState('全部')
  const filtered = assetItems.filter((asset) => (kind === '全部' || asset.kind === kind) && `${asset.name}${asset.kind}`.includes(query))
  return <div className="assets-page"><PageTitle eyebrow="ASSET LIBRARY" title="素材库" description="图片、视频、音频与文案集中管理，上传一次，创作处处可用。" action={<button className="primary-button" onClick={() => notify('上传面板已打开')}>↑ 上传素材</button>} /><div className="asset-overview"><div><span className="overview-icon blue">▧</span><strong>128</strong><small>全部素材</small></div><div><span className="overview-icon purple">▶</span><strong>46</strong><small>视频</small></div><div><span className="overview-icon orange">▧</span><strong>64</strong><small>图片</small></div><div><span className="overview-icon green">♪</span><strong>18</strong><small>音频与文案</small></div><div className="asset-storage"><span>存储空间</span><strong>2.4 GB <small>/ 10 GB</small></strong><div className="storage-bar"><i style={{ width: '24%' }} /></div></div></div><div className="asset-toolbar panel"><div className="library-tabs"><button className="is-active">全部素材</button><button onClick={() => notify('我的文件夹已打开')}>我的文件夹</button><button onClick={() => notify('收藏素材已筛选')}>收藏</button></div><label className="library-search"><Symbol>⌕</Symbol><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索素材名称" /></label></div><div className="asset-filters">{['全部', '图片', '视频', '音频', '文案'].map((option) => <button className={kind === option ? 'is-active' : ''} key={option} onClick={() => setKind(option)}>{option}</button>)}<span className="filter-spacer" /><button className="plain-button" onClick={() => notify('排序菜单已打开')}>最近添加 <span>⌄</span></button></div><div className="asset-grid">{filtered.map((asset) => <button className="asset-card" key={asset.id} onClick={() => notify(`已选中「${asset.name}」`)}><div className="asset-preview" style={{ background: `linear-gradient(135deg, ${asset.color}, #111827)` }}><span>{asset.icon}</span>{asset.kind === '视频' && <i>0:06</i>}</div><div><strong>{asset.name}</strong><span>{asset.kind} · {asset.size}</span></div><span className="asset-menu">···</span></button>)}</div></div>
}

function AccountPage({ notify }: { notify: (message: string) => void }) {
  const [tab, setTab] = useState('账号信息')
  return <div className="account-page"><PageTitle eyebrow="ACCOUNT CENTER" title="我的账号" description="管理你的个人资料、团队空间和创作套餐。" action={<button className="secondary-button" onClick={() => notify('邀请成员入口已打开')}>＋ 邀请成员</button>} /><div className="account-layout"><aside className="account-menu panel"><div className="account-profile"><span className="avatar avatar-large">林</span><div><strong>林晓溪</strong><span>linxiaoxi@studio.local</span></div></div>{['账号信息', '我的团队', '套餐与用量', '创作记录', '订单与发票'].map((item) => <button className={tab === item ? 'is-active' : ''} onClick={() => setTab(item)} key={item}>{item}<span>›</span></button>)}</aside><section className="account-main panel">{tab === '账号信息' && <><div className="account-heading"><div><h2>账号信息</h2><p>你的个人资料只保存在本地演示环境。</p></div><button className="secondary-button" onClick={() => notify('账号信息已保存')}>保存修改</button></div><div className="profile-form"><label>头像<button className="avatar avatar-large" onClick={() => notify('头像选择器已打开')}>林</button></label><label>昵称<input defaultValue="林晓溪" /></label><label>邮箱<input defaultValue="linxiaoxi@studio.local" /></label><label>团队名称<input defaultValue="内容工作室" /></label></div></>}{tab === '套餐与用量' && <><div className="account-heading"><div><h2>套餐与用量</h2><p>当前套餐与创作点使用情况</p></div><button className="primary-button" onClick={() => notify('套餐升级入口已打开')}>升级套餐 <span>→</span></button></div><div className="plan-card"><div><span className="plan-kicker">CURRENT PLAN</span><h3>专业版 <span>PRO</span></h3><p>适合个人创作者和小型团队</p></div><strong>¥99 <small>/月</small></strong></div><div className="usage-list"><div><span>本月创作点</span><strong>682 <small>/ 1,000</small></strong><div className="usage-bar"><i style={{ width: '68%' }} /></div></div><div><span>素材存储</span><strong>2.4 GB <small>/ 10 GB</small></strong><div className="usage-bar green"><i style={{ width: '24%' }} /></div></div></div></>}{tab !== '账号信息' && tab !== '套餐与用量' && <div className="empty-state account-empty"><div className="empty-logo">✦</div><h2>{tab}</h2><p>这一页已预留本地演示入口，后续可接入真实服务。</p><button className="secondary-button" onClick={() => notify(`${tab}功能即将开放`)}>了解更多</button></div>}</section></div></div>
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
