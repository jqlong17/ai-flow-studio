# AI应用生成平台

**项目目标:** 构建一个基于 Vue 3 和 Dify 的、提供简单拖拽式界面的轻量级 AI 应用开发平台。允许用户通过可视化方式快速组合 AI 组件和工作流，并最终生成可部署的 AI 教学应用。

## 项目结构

本项目基于 Vue 3 构建，是一个单页面的 AI 应用开发平台，主要包含以下目录和模块：

```
ai-flow-studio/
├── src/                     # 源代码目录
│   ├── App.vue             # 根组件
│   ├── main.ts             # 入口文件
│   ├── views/              # 页面视图
│   │   └── Home.vue       # 主页面
│   ├── components/         # 组件目录
│   │   ├── common/        # 通用组件
│   │   │   ├── Button/    # 按钮组件
│   │   │   ├── Icons/     # 图标组件
│   │   │   └── Modal/     # 弹窗组件
│   │   ├── form/          # 表单相关组件
│   │   │   ├── base/      # 基础表单组件
│   │   │   ├── enhanced/  # 增强型表单组件
│   │   │   └── education/ # 教育领域组件
│   │   ├── upload/        # 文件上传组件
│   │   └── layout/        # 布局组件
│   ├── composables/        # 组合式函数
│   │   ├── useAI.ts       # AI 相关
│   │   ├── useEducation.ts # 教育相关
│   │   └── useUpload.ts   # 上传相关
│   ├── stores/            # Pinia 状态管理
│   │   ├── modules/       # 状态模块
│   │   └── index.ts      # 状态入口
│   ├── api/               # API 接口
│   │   ├── dify.ts       # Dify API
│   │   └── education.ts  # 教育 API
│   ├── utils/            # 工具函数
│   │   ├── request.ts    # Axios 封装
│   │   ├── dify.ts      # Dify 工具
│   │   └── file.ts      # 文件处理
│   ├── assets/          # 静态资源
│   │   ├── styles/     # 样式文件
│   │   └── images/     # 图片资源
│   ├── plugins/        # 插件配置
│   │   └── antd.ts    # Ant Design Vue 配置
│   └── types/         # 类型定义
├── public/            # 公共资源
├── index.html        # HTML 模板
├── vite.config.ts    # Vite 配置
├── tsconfig.json     # TypeScript 配置
├── package.json      # 项目依赖
└── README.md         # 项目文档
```

## 技术栈

*   **前端框架:** [Vue 3](https://vuejs.org/) (使用组合式 API)
*   **构建工具:** [Vite](https://vitejs.dev/)
*   **UI 库:** [Ant Design Vue](https://antdv.com/)
*   **工作流引擎:** [Dify](https://dify.ai/)
*   **状态管理:** [Pinia](https://pinia.vuejs.org/)
*   **HTTP 客户端:** [Axios](https://axios-http.com/)
*   **组件库:** [Vue Flow](https://vueflow.dev/)

## 快速开始

1.  **克隆项目:**
    ```bash
    git clone <你的仓库地址>
    cd ai-flow-studio
    ```

2.  **安装依赖:**
    ```bash
    pnpm install
    ```

3.  **配置环境变量:**
    创建 `.env` 文件：
    ```
    VITE_DIFY_API_KEY=你的Dify API密钥
    VITE_DIFY_BASE_URL=你的Dify实例地址
    ```

4.  **启动开发服务器:**
    ```bash
    pnpm dev
    ```

## 开发规范

1. **代码规范**
   - 使用 TypeScript 开发
   - 使用组合式 API
   - ESLint + Prettier

2. **组件开发**
   - 使用 `<script setup>` 语法
   - 组件名使用 PascalCase
   - Props 类型定义
   - 使用 `defineEmits` 定义事件

3. **状态管理**
   - 使用 Pinia
   - 按功能模块拆分
   - 复杂状态使用 actions

4. **样式规范**
   - 使用 Less
   - 遵循 Ant Design 规范
   - 使用 CSS Modules

## 构建部署

1. **构建**
    ```bash
    pnpm build
    ```

2. **预览**
    ```bash
    pnpm preview
    ```

## 项目特点

1. **轻量级 SPA**
   - 快速的开发构建
   - 简单的部署需求
   - 更好的开发体验

2. **模块化设计**
   - 清晰的目录结构
   - 组件高度复用
   - 状态集中管理

3. **开发效率**
   - Vite 快速热更新
   - TypeScript 类型支持
   - 组合式 API 逻辑复用

## 组件说明

项目采用组件化开发，按功能划分为以下几个主要模块：

### 1. 通用组件 (`components/common/`)

```
common/
├── Button/              # 按钮组件
│   ├── index.vue       # 基础按钮
│   ├── IconButton.vue  # 图标按钮
│   └── types.ts        # 按钮类型定义
├── Icons/              # 图标组件
│   ├── index.vue       # 图标包装器
│   ├── AIIcon.vue      # AI相关图标
│   └── EditorIcon.vue  # 编辑器图标
└── Modal/              # 弹窗组件
    ├── index.vue       # 基础弹窗
    ├── ConfirmModal.vue # 确认弹窗
    └── DrawerModal.vue  # 抽屉式弹窗
```

### 2. 表单组件 (`components/form/`)

#### 2.1 基础表单 (`form/base/`)
```
base/
├── Input/             # 输入框组件
│   ├── index.vue     # 基础输入框
│   └── SearchInput.vue # 搜索输入框
├── Select/           # 选择器组件
│   ├── index.vue     # 基础选择器
│   └── AsyncSelect.vue # 异步加载选择器
├── Radio/            # 单选组件
├── Checkbox/         # 多选组件
└── TextArea/         # 文本域组件
```

#### 2.2 增强型表单 (`form/enhanced/`)
```
enhanced/
└── AIInput/          # AI 增强输入组件
    ├── index.vue     # 主组件
    ├── AIButton.vue  # AI 补全按钮
    ├── PromptModal.vue # 提示词配置弹窗
    ├── composables/  # 组合式函数
    │   ├── useDifyCompletion.ts  # Dify 补全逻辑
    │   └── usePromptTemplate.ts  # 提示词模板处理
    └── types/        # 类型定义
        ├── completion.ts  # 补全相关类型
        └── prompt.ts     # 提示词相关类型
```

#### 2.3 教育领域表单 (`form/education/`)
```
education/
├── GradeSelect/     # 年级选择组件
│   ├── index.vue    # 年级选择器
│   └── constants.ts # 年级数据常量
├── SubjectSelect/   # 学科选择组件
│   ├── index.vue    # 学科选择器
│   └── constants.ts # 学科数据常量
└── TreeSelect/      # 树形选择器组件
    ├── index.vue    # 通用树形选择器
    ├── ContentTree/ # 教学内容树
    │   ├── index.vue
    │   └── types.ts
    └── GoalTree/    # 教学目标树
        ├── index.vue
        └── types.ts
```

### 3. 文件上传组件 (`components/upload/`)
```
upload/
├── FileUpload/      # 文件上传组件
│   ├── index.vue    # 主组件
│   ├── DropZone.vue # 拖拽上传区域
│   └── Preview.vue  # 文件预览
└── types/           # 类型定义
    └── file.ts      # 文件相关类型
```

### 4. 布局组件 (`components/layout/`)
```
layout/
├── TheHeader.vue   # 顶部导航栏
├── TheSidebar.vue  # 侧边栏
└── TheMain.vue     # 主内容区域
```

## 组件特性

### 1. AI 增强输入组件
- 支持一键 AI 补全内容
- 可配置上下文变量
- 自定义提示词模板
- 实时响应和错误处理
- 支持流式输出
- 历史记录功能

### 2. 教育领域组件
- 年级和学科联动选择
- 树形结构展示教学内容
- 支持异步加载数据
- 多选教学目标
- 支持搜索和过滤
- 自定义模板功能

### 3. 文件上传组件
- 拖拽上传
- 多文件上传
- 文件类型限制
- 文件大小限制
- 上传进度显示
- 文件预览功能

### 4. 布局组件
- 响应式设计
- 可折叠侧边栏
- 面包屑导航
- 用户信息展示
- 主题切换
- 全局消息通知

## 组件开发规范

1. **命名规范**
   - 组件文件使用 PascalCase
   - 组件名与文件名保持一致
   - 使用 index.vue 作为入口文件

2. **代码组织**
   - 使用 `<script setup>` 语法
   - 类型定义放在单独的 types 文件
   - 常量配置单独管理
   - 样式使用 CSS Modules

3. **组件通信**
   - Props 类型严格定义
   - 事件使用 defineEmits
   - 复杂状态使用 Pinia
   - 组件间通信使用 provide/inject

4. **性能优化**
   - 合理使用异步组件
   - 避免不必要的渲染
   - 及时清理副作用
   - 缓存计算结果