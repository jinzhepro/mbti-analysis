# MBTI 人格分析网站 - AGENTS.md

## 项目概述

MBTI 人格分析网站 - 星空神秘学风格
- 40 道测试题目（李克特 5 点量表）
- 16 种人格类型完整数据库
- 分享功能（多平台 + 生成图片）
- 人格对比功能
- 维度得分可视化

## 技术栈

- **Next.js 16.2.1** - App Router, Server Components
- **React 19.2.4** - Hooks (useState, useCallback, useRef, use)
- **Tailwind CSS v4** - Utility-first, 自定义 CSS 变量
- **TypeScript 5** - Strict mode, 路径别名 `@/*`
- **html-to-image** - PNG 图片生成

## 项目结构

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # 根布局（星空背景）
│   ├── page.tsx              # 首页（4 大人格群组）
│   ├── test/
│   │   └── page.tsx          # 测试页面（李克特量表）
│   ├── result/
│   │   └── [type]/
│   │       └── page.tsx      # 结果页面（分享/对比）
│   └── globals.css           # 全局样式（神秘学主题）
├── components/
│   ├── Header.tsx            # 固定导航头
│   ├── PersonalityCard.tsx   # 人格卡片（统一高度）
│   ├── TestQuestion.tsx      # 测试题目组件
│   └── TypeGrid.tsx          # 人格类型网格
├── lib/
│   ├── questions.ts          # 40 道测试题目
│   ├── personalities.ts      # 16 种人格数据
│   └── testStore.ts          # 计分逻辑
└── types/
    └── index.ts              # TypeScript 类型定义
```

## 命令

```bash
npm run dev      # 开发服务器 (http://localhost:3001)
npm run build    # 生产构建
npm run start    # 启动生产服务器
npm run lint     # ESLint 检查
```

## 核心代码风格

### 导入顺序
1. Next.js 模块 (`next/*`)
2. React 模块
3. 第三方库
4. 项目别名导入 (`@/*`)

### 命名约定
- 组件：PascalCase (e.g., `PersonalityCard`)
- 工具函数：camelCase (e.g., `calculateScores`)
- 类型：PascalCase (e.g., `MBTIType`, `TestResult`)
- 常量：camelCase 或 PascalCase (e.g., `testQuestions`, `likertScale`)

### 注释规范
- 函数级注释（中文）
- 复杂逻辑添加行内注释
- 类型定义添加 JSDoc

## 关键模式

### 神秘学主题样式类

```css
.card-mystical        # 半透明卡片，金色边框
.btn-mystical         # 金色渐变按钮，悬停发光
.btn-outline-mystical # 金色描边按钮
.text-gradient-gold   # 金色渐变文字
.gradient-gold        # 金色渐变背景
```

### 颜色变量

```css
--background: #0a0a12       # 深蓝黑背景
--foreground: #e8e6e3       # 米白文字
--accent-gold: #d4af37      # 金色强调
--card-bg: rgba(255,255,255,0.03)
--card-border: rgba(212,175,55,0.15)
```

### 模态框模式

```typescript
const [showModal, setShowModal] = useState(false);
const [data, setData] = useState<Type | null>(null);

// 打开模态框
const handleOpen = (item: Type) => {
  setData(item);
  setShowModal(true);
};

// 关闭模态框
const handleClose = () => {
  setShowModal(false);
  setData(null);
};
```

### 图片生成模式

```typescript
const shareContentRef = useRef<HTMLDivElement>(null);

const handleGenerateImage = async () => {
  const dataUrl = await toPng(shareContentRef.current, {
    quality: 1.0,
    pixelRatio: 2,
    backgroundColor: '#0a0a12',
  });
  setGeneratedImageUrl(dataUrl);
  setShowImageModal(true);
};
```

## TypeScript 配置

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 测试系统

### 计分逻辑

- 40 题，每题 1-5 分（李克特量表）
- 4 个维度：EI, SN, TF, JP（各 10 题）
- 双向计分：题目倾向 + 反向得分

```typescript
// direction: 'first' - 题目倾向第一个字母
scores[firstLetter] += score;      // 用户选 5 分，first 得 5 分
scores[secondLetter] += (6 - score); // second 得 1 分

// direction: 'second' - 题目倾向第二个字母
scores[secondLetter] += score;      // 用户选 5 分，second 得 5 分
scores[firstLetter] += (6 - score); // first 得 1 分
```

### 人格类型判定

```typescript
const type = `${
  scores.E >= scores.I ? 'E' : 'I'
}${
  scores.S >= scores.N ? 'S' : 'N'
}${
  scores.T >= scores.F ? 'T' : 'F'
}${
  scores.J >= scores.P ? 'J' : 'P'
}`;
```

## 人格数据格式

```typescript
interface PersonalityType {
  type: MBTIType;           // 4 字母类型
  name: string;             // 中文名
  nickname: string;         // 英文名
  description: string;      // 简短描述
  traits: string[];         // 7 个特征
  strengths: string[];      // 7 个优势
  weaknesses: string[];     // 7 个劣势
  careers: string[];        // 7-8 个职业
  relationships: string;    // 关系描述
  color: string;            // 主题色
  gradient: string;         // Tailwind 渐变类
}
```

## Git 提交规范

```
feat: 新功能
fix: 修复 bug
style: 样式调整
refactor: 重构
docs: 文档更新
chore: 构建/工具
```

## 重要注意事项

1. **Next.js 16** - 使用 App Router，所有页面组件默认 Server Components
2. **Client Components** - 使用 hooks 时添加 `'use client'`
3. **Tailwind v4** - 使用 `@import "tailwindcss"` 而非 `@tailwind`
4. **路径别名** - 使用 `@/` 代替 `../../../`
5. **严格模式** - TypeScript strict mode，禁止 `any`

## 开发提示

- 修改样式时优先使用现有神秘学主题类
- 添加新功能时保持与现有代码风格一致
- 测试相关修改需同步更新 `questions.ts` 和 `testStore.ts`
- 人格数据修改需同步更新 `personalities.ts` 所有 16 类型
