# Resource Console - Catalog Tree 启动指南

## 项目概述
这是一个纯前端静态HTML应用，使用CDN引入依赖（Tailwind CSS、Phosphor Icons），无需安装依赖或构建步骤。

## 快速启动

### 方式一：使用Python HTTP服务器（推荐）

```bash
python3 -m http.server 8080
```

**启动后访问**：http://localhost:8080

### 方式二：直接打开HTML文件

```bash
open index.html
```

或在浏览器中直接打开 `index.html` 文件

```yaml
subProjectPath: .
command: python3 -m http.server 8080
cwd: .
port: 8080
previewUrl: http://localhost:8080
description: 目录资源管理控制台，包含Wiki和Dictionary组件
```

## 其他测试页面

- `test_create_wizard.html` - 创建向导测试页面
- `test_full.html` - 完整功能测试页面
- `test_templates.html` - 模板测试页面
- `test_vue_simple.html` - Vue简单测试页面
- `debug_steps.html` - 调试步骤页面
- `diagnose.html` - 诊断页面
