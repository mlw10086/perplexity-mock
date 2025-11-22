# Perplexity Mock

参考 Perplexity.ai 设计风格的后台管理系统，采用深色主题和青色作为主色调。

## 功能特性

### 设计风格
- 深色主题为主
- 主色调：青色 (#13B9C4)
- 背景色：深灰 (#191A1A)
- 使用 Inter 和 Space Grotesk 字体
- 基于 Framer Motion 的页面动画

### 组件
项目包含 100+ 个 UI 组件，包括基础组件（按钮、输入框、选择器等）、高级组件（对话框、标签页、下拉菜单等）和复杂组件（数据表格、看板、日历等）。

详细列表见 [COMPONENTS_LIST.md](./COMPONENTS_LIST.md)

### 技术栈
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- Recharts
- React Router

## 开始使用

安装依赖：
```bash
npm install
```

启动开发服务器：
```bash
npm run dev
```

访问 http://localhost:5173

## 项目结构

```
src/
├── components/
│   ├── ui/              # 基础组件
│   ├── advanced/        # 高级组件
│   ├── dashboard/       # 仪表板组件
│   └── layout/          # 布局组件
├── pages/               # 页面
├── lib/                 # 工具函数
└── App.jsx
```

## 路由

- `/dashboard` - 首页
- `/discover` - 发现页（音乐搜索）
- `/components` - 基础组件展示
- `/components/advanced` - 高级组件展示
- `/analytics` - 数据分析
- `/settings` - 设置
- `/library` - 资料库

## 使用示例

### 按钮组件
```jsx
import { Button } from '@/components/ui/Button';

<Button variant="primary">主要按钮</Button>
<Button variant="outline">轮廓按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
```

对话框：
```jsx
import { Dialog, DialogContent } from '@/components/ui/Dialog';

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    {/* 内容 */}
  </DialogContent>
</Dialog>
```

数据表格：
```jsx
import { DataGrid } from '@/components/advanced/DataGrid';

<DataGrid columns={columns} data={data} />
```

## 设计规范

主要颜色：
- 背景: #191A1A
- 表面: #202222
- 主色: #13B9C4
- 边框: #2D2F2F

圆角大小：8px / 12px / 16px

## 构建部署

构建生产版本：
```bash
npm run build
```

部署到 Vercel：
```bash
vercel --prod
```

详细部署说明见 [DEPLOYMENT.md](./DEPLOYMENT.md)

## License

MIT
