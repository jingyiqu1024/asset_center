const { ref, computed, watch, onMounted } = Vue;

const DetailWiki = {
    name: 'DetailWiki',
    props: ['node', 'globalTags'],
    setup(props) {
        
        // ==================== 数据状态 ====================
        const files = ref([]);
        const selectedFile = ref(null);
        const showImportMenu = ref(false);
        const showOriginalFileModal = ref(false);
        const showToastMessage = ref(false);
        const toastText = ref('');
        const isEditing = ref(false); // 编辑/预览模式切换
        
        // ==================== Mock 数据 ====================
        const mockFiles = [
            {
                id: 'file_1',
                name: '产品需求文档 - Q2规划',
                type: 'created',
                source: '',
                mdContent: `# 产品需求文档 - Q2规划

## 1. 概述

本文档描述了2024年第二季度的产品规划和需求细节。

### 1.1 目标

- 提升用户体验
- 增加核心功能
- 优化性能

## 2. 核心功能

### 2.1 用户管理模块

实现完整的用户权限管理系统，包括：

- 用户注册与登录
- 权限分配与管理
- 用户行为追踪

### 2.2 数据分析模块

提供实时数据分析能力：

- 实时数据大盘
- 自定义报表
- 数据导出功能

## 3. 技术实现

### 3.1 前端架构

采用 Vue 3 + TypeScript 技术栈。

### 3.2 后端服务

基于 Node.js 构建微服务架构。

## 4. 时间规划

| 阶段 | 时间 | 负责人 |
|------|------|--------|
| 需求评审 | 04/01-04/05 | 产品团队 |
| 设计评审 | 04/08-04/12 | 设计团队 |
| 开发实现 | 04/15-05/31 | 研发团队 |
| 测试上线 | 06/01-06/15 | 测试团队 |

## 5. 风险评估

需要注意的潜在风险点：

1. 技术难度较高
2. 时间紧迫
3. 资源有限
`,
                originalFileUrl: '',
                createdAt: '2024-03-01 10:00:00',
                updatedAt: '2024-03-12 16:30:00'
            },
            {
                id: 'file_2',
                name: '技术方案 - 用户中台重构.pdf',
                type: 'imported',
                source: 'PDF 文件',
                mdContent: `# 技术方案 - 用户中台重构

## 1. 背景

当前用户中台存在以下问题：

- 架构陈旧
- 性能瓶颈
- 维护困难

## 2. 重构目标

### 2.1 性能优化

- 响应时间降低50%
- 并发能力提升3倍
- 资源占用减少30%

### 2.2 架构升级

采用微服务架构，实现服务解耦：

- 用户服务
- 权限服务
- 会话服务
- 日志服务

## 3. 技术选型

### 3.1 后端技术栈

- **框架**: Spring Boot 3.0
- **数据库**: MySQL 8.0 + Redis 7.0
- **消息队列**: Kafka 3.0
- **服务治理**: Nacos + Sentinel

### 3.2 前端技术栈

- **框架**: React 18 + Next.js 13
- **状态管理**: Zustand
- **UI 组件**: Ant Design 5.0

## 4. 实施计划

分三个阶段进行：

### 阶段一：基础设施（2周）

搭建基础开发环境和 CI/CD 流水线。

### 阶段二：核心功能迁移（6周）

逐步迁移现有功能到新架构。

### 阶段三：灰度上线（2周）

小流量验证后全量上线。

## 5. 风险控制

制定详细的回滚方案和应急预案。
`,
                originalFileUrl: '/mock/tech-design.pdf',
                createdAt: '2024-02-28 14:20:00',
                updatedAt: '2024-03-10 09:15:00'
            },
            {
                id: 'file_3',
                name: '在线协作文档 - 团队规范',
                type: 'imported',
                source: '在线 Docs',
                mdContent: `# 团队协作规范文档

## 1. 代码规范

### 1.1 命名规范

- 使用驼峰命名法
- 变量名要有意义
- 常量使用大写

### 1.2 注释规范

每个函数必须包含注释说明。

## 2. Git 协作流程

### 2.1 分支策略

- main: 生产分支
- develop: 开发分支
- feature/*: 功能分支
- hotfix/*: 紧急修复分支

### 2.2 Commit 规范

格式: \`type(scope): subject\`

类型包括:
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式
- refactor: 重构
- test: 测试
- chore: 构建

## 3. 代码审查

每个 PR 必须经过至少2人审查。

## 4. 测试规范

### 4.1 单元测试

覆盖率要求达到 80% 以上。

### 4.2 集成测试

关键业务流程必须有集成测试覆盖。
`,
                originalFileUrl: '/mock/team-docs.png',
                createdAt: '2024-03-05 11:00:00',
                updatedAt: '2024-03-12 14:20:00'
            }
        ];
        
        // ==================== 初始化 ====================
        onMounted(() => {
            loadFiles();
        });
        
        // 监听节点变化
        watch(() => props.node, () => {
            loadFiles();
        });
        
        const loadFiles = () => {
            // 根据 wiki ID 加载对应的文件
            // 这里简化处理，直接加载所有 mock 数据
            files.value = JSON.parse(JSON.stringify(mockFiles));
            
            // 自动选中第一个文件
            if (files.value.length > 0 && !selectedFile.value) {
                selectedFile.value = files.value[0];
            }
        };
        
        // ==================== 计算属性 ====================
        const hasFiles = computed(() => files.value.length > 0);
        
        // 提取目录大纲
        const tocItems = computed(() => {
            if (!selectedFile.value || !selectedFile.value.mdContent) return [];
            
            const lines = selectedFile.value.mdContent.split('\n');
            const toc = [];
            
            lines.forEach((line, index) => {
                const match = line.match(/^(#{1,3})\s+(.+)$/);
                if (match) {
                    toc.push({
                        level: match[1].length,
                        title: match[2],
                        lineIndex: index,
                        id: 'heading-' + index
                    });
                }
            });
            
            return toc;
        });
        
        // 渲染 Markdown 为 HTML (简化版)
        const renderedHtml = computed(() => {
            if (!selectedFile.value || !selectedFile.value.mdContent) return '';
            
            let html = selectedFile.value.mdContent;
            
            // 转义 HTML
            const escapeHtml = (text) => {
                return text.replace(/&/g, '&amp;')
                          .replace(/</g, '&lt;')
                          .replace(/>/g, '&gt;');
            };
            
            // 处理代码块（先处理，避免其他规则影响）
            const codeBlocks = [];
            html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
                const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
                codeBlocks.push(escapeHtml(code));
                return placeholder;
            });
            
            // 处理行内代码
            const inlineCodes = [];
            html = html.replace(/`([^`]+)`/g, (match, code) => {
                const placeholder = `__INLINE_CODE_${inlineCodes.length}__`;
                inlineCodes.push(escapeHtml(code));
                return placeholder;
            });
            
            // 转义其他 HTML
            html = escapeHtml(html);
            
            // 标题 (必须从 h3 到 h1 依次处理)
            html = html.replace(/^### (.+)$/gm, '<h3 id="heading-$1">$1</h3>');
            html = html.replace(/^## (.+)$/gm, '<h2 id="heading-$1">$1</h2>');
            html = html.replace(/^# (.+)$/gm, '<h1 id="heading-$1">$1</h1>');
            
            // 加粗和斜体
            html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
            
            // 恢复代码块
            codeBlocks.forEach((code, index) => {
                html = html.replace(`__CODE_BLOCK_${index}__`, `<pre><code>${code}</code></pre>`);
            });
            
            // 恢复行内代码
            inlineCodes.forEach((code, index) => {
                html = html.replace(`__INLINE_CODE_${index}__`, `<code>${code}</code>`);
            });
            
            // 列表
            html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
            
            // 表格 (简化处理)
            html = html.replace(/^\|(.+)\|$/gm, (match) => {
                return match.replace(/\|/g, '</td><td>').replace('<td>', '<tr><td>').replace('</td>', '</td></tr>');
            });
            
            // 段落 (非标签行添加 p 标签)
            const lineArray = html.split('\n');
            html = lineArray.map(line => {
                if (line.trim() === '') return '<br/>';
                if (line.match(/^<(h[123]|li|pre|tr)/)) return line;
                if (line.match(/<\/(h[123]|code|strong|em)>/)) return line;
                return `<p>${line}</p>`;
            }).join('\n');
            
            // 包装列表
            html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
            
            // 包装表格
            html = html.replace(/(<tr>.*<\/tr>\n?)+/g, '<table>$&</table>');
            
            return html;
        });
        
        // ==================== 文件操作 ====================
        const selectFile = (file) => {
            selectedFile.value = file;
            isEditing.value = false; // 切换文件时重置为预览模式
        };
        
        const toggleEditMode = () => {
            isEditing.value = !isEditing.value;
        };
        
        const canEdit = computed(() => {
            // PDF 文件不能编辑
            if (!selectedFile.value) return false;
            return !selectedFile.value.source.includes('PDF');
        });
        
        const createNewFile = () => {
            const newFile = {
                id: 'file_' + Date.now(),
                name: '无标题文档',
                type: 'created',
                source: '',
                mdContent: `# 新文档

开始编辑...
`,
                originalFileUrl: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            files.value.unshift(newFile);
            selectedFile.value = newFile;
            
            showToast('已创建新文档');
        };
        
        const importFile = (importType) => {
            const sourceMap = {
                'local-word': 'Word 文档',
                'local-excel': 'Excel 表格',
                'local-pdf': 'PDF 文件',
                'local-csv': 'CSV 文件',
                'online-docs': '在线 Docs',
                'online-sheets': '在线 Sheet'
            };
            
            const newFile = {
                id: 'file_' + Date.now(),
                name: `导入的${sourceMap[importType]}_${Date.now()}`,
                type: 'imported',
                source: sourceMap[importType],
                mdContent: `# 导入的${sourceMap[importType]}

## 1. 文档内容

这是从 ${sourceMap[importType]} 导入的文档内容。

### 1.1 章节示例

文档内容已经转换为 Markdown 格式。

## 2. 编辑说明

您可以在左侧编辑器中修改此文档的内容。
`,
                originalFileUrl: '/mock/imported-file-placeholder.png',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            files.value.unshift(newFile);
            selectedFile.value = newFile;
            
            showToast(`已成功导入 ${sourceMap[importType]}`);
            showImportMenu.value = false;
        };
        
        const updateFileContent = (content) => {
            if (selectedFile.value) {
                selectedFile.value.mdContent = content;
                selectedFile.value.updatedAt = new Date().toISOString();
            }
        };
        
        // ==================== 格式化编辑器 ====================
        const editor = ref(null);
        
        const formatText = (command) => {
            if (!editor.value) return;
            
            // 使用 document.execCommand 进行格式化
            switch(command) {
                case 'h1':
                case 'h2':
                case 'h3':
                    document.execCommand('formatBlock', false, command);
                    break;
                case 'bold':
                    document.execCommand('bold', false, null);
                    break;
                case 'italic':
                    document.execCommand('italic', false, null);
                    break;
                case 'underline':
                    document.execCommand('underline', false, null);
                    break;
                case 'strikethrough':
                    document.execCommand('strikethrough', false, null);
                    break;
                case 'ul':
                    document.execCommand('insertUnorderedList', false, null);
                    break;
                case 'ol':
                    document.execCommand('insertOrderedList', false, null);
                    break;
                case 'code':
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        const code = document.createElement('code');
                        code.appendChild(range.extractContents());
                        range.insertNode(code);
                    }
                    break;
                case 'link':
                    const url = prompt('请输入链接地址:');
                    if (url) {
                        document.execCommand('createLink', false, url);
                    }
                    break;
            }
            
            editor.value.focus();
        };
        
        const onEditorInput = () => {
            if (!editor.value || !selectedFile.value) return;
            
            // 从 contenteditable div 提取 HTML 内容
            const htmlContent = editor.value.innerHTML;
            
            // 简单地将 HTML 转换回 Markdown（这是一个简化版本）
            let markdown = htmlToMarkdown(htmlContent);
            
            // 更新文件内容
            selectedFile.value.mdContent = markdown;
            selectedFile.value.updatedAt = new Date().toISOString();
        };
        
        // 简化的 HTML 转 Markdown 函数
        const htmlToMarkdown = (html) => {
            let md = html;
            
            // 移除多余的空白
            md = md.trim();
            
            // 标题转换
            md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
            md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
            md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
            
            // 加粗
            md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
            md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
            
            // 斜体
            md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
            md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
            
            // 行内代码
            md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
            
            // 代码块
            md = md.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n');
            
            // 列表项
            md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
            
            // 移除 ul/ol 标签
            md = md.replace(/<\/?ul[^>]*>/gi, '\n');
            md = md.replace(/<\/?ol[^>]*>/gi, '\n');
            
            // 表格（保持简单）
            md = md.replace(/<table[^>]*>.*?<\/table>/gis, (match) => {
                // 简化处理：保留原始表格 HTML
                return match;
            });
            
            // 段落
            md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
            
            // 换行
            md = md.replace(/<br\s*\/?>/gi, '\n');
            
            // 删除所有剩余的 HTML 标签
            md = md.replace(/<[^>]+>/g, '');
            
            // 解码 HTML 实体
            md = md.replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&amp;/g, '&')
                  .replace(/&nbsp;/g, ' ');
            
            // 清理多余的空行
            md = md.replace(/\n{3,}/g, '\n\n');
            
            return md.trim();
        };
        
        // ==================== UI 交互 ====================
        const toggleImportMenu = () => {
            showImportMenu.value = !showImportMenu.value;
        };
        
        const openOriginalFile = () => {
            showOriginalFileModal.value = true;
        };
        
        const closeOriginalFile = () => {
            showOriginalFileModal.value = false;
        };
        
        const showToast = (message) => {
            toastText.value = message;
            showToastMessage.value = true;
            
            setTimeout(() => {
                showToastMessage.value = false;
            }, 3000);
        };
        
        const scrollToHeading = (tocItem) => {
            const previewPane = document.querySelector('.preview-content');
            if (previewPane) {
                const heading = previewPane.querySelector(`#heading-${tocItem.title}`);
                if (heading) {
                    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        };
        
        const getFileIcon = (file) => {
            if (file.type === 'created') {
                return 'ph-file-text';
            }
            
            if (file.source.includes('PDF')) return 'ph-file-pdf';
            if (file.source.includes('Word')) return 'ph-file-doc';
            if (file.source.includes('Excel') || file.source.includes('Sheet')) return 'ph-file-xls';
            if (file.source.includes('Docs')) return 'ph-file-doc';
            
            return 'ph-file-arrow-up';
        };
        
        const getFileIconColor = (file) => {
            if (file.type === 'created') {
                return 'text-blue-600';
            }
            
            if (file.source.includes('PDF')) return 'text-red-600';
            if (file.source.includes('Word')) return 'text-blue-600';
            if (file.source.includes('Excel') || file.source.includes('Sheet')) return 'text-green-600';
            if (file.source.includes('Docs')) return 'text-blue-500';
            
            return 'text-slate-600';
        };
        
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        };
        
        const getSourceLabel = (file) => {
            if (file.type !== 'imported' || !file.source) return '';
            
            // 根据来源返回标签文本
            if (file.source.includes('Word')) return 'Word';
            if (file.source.includes('Excel')) return 'Excel';
            if (file.source.includes('PDF')) return 'PDF';
            if (file.source.includes('Docs')) return '在线文档';
            if (file.source.includes('Sheet')) return '在线表格';
            if (file.source.includes('CSV')) return 'CSV';
            
            return '已导入';
        };
        
        const getSourceBadgeClass = (file) => {
            if (file.type !== 'imported' || !file.source) return '';
            
            // 根据来源返回不同的颜色样式
            if (file.source.includes('Word')) return 'bg-blue-100 text-blue-700 border border-blue-200';
            if (file.source.includes('Excel')) return 'bg-green-100 text-green-700 border border-green-200';
            if (file.source.includes('PDF')) return 'bg-red-100 text-red-700 border border-red-200';
            if (file.source.includes('Docs')) return 'bg-sky-100 text-sky-700 border border-sky-200';
            if (file.source.includes('Sheet')) return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
            if (file.source.includes('CSV')) return 'bg-slate-100 text-slate-700 border border-slate-200';
            
            return 'bg-amber-100 text-amber-700 border border-amber-200';
        };
        
        // ==================== 返回接口 ====================
        return {
            files,
            selectedFile,
            hasFiles,
            showImportMenu,
            showOriginalFileModal,
            showToastMessage,
            toastText,
            tocItems,
            renderedHtml,
            isEditing,
            canEdit,
            editor,
            
            selectFile,
            createNewFile,
            importFile,
            updateFileContent,
            toggleImportMenu,
            toggleEditMode,
            openOriginalFile,
            closeOriginalFile,
            showToast,
            scrollToHeading,
            getFileIcon,
            getFileIconColor,
            formatDate,
            getSourceLabel,
            getSourceBadgeClass,
            formatText,
            onEditorInput
        };
    },
    
    template: `
        <div class="h-full flex flex-col bg-slate-50">
            <!-- Toast 提示 -->
            <transition name="fade">
                <div v-if="showToastMessage" 
                    class="fixed top-20 right-6 px-4 py-3 rounded-lg shadow-2xl text-sm font-medium flex items-start gap-3 border z-[100] bg-green-50 text-green-800 border-green-200 max-w-md">
                    <div class="flex-shrink-0 w-5 h-5 rounded-full bg-green-600 flex items-center justify-center mt-0.5">
                        <i class="ph-fill ph-check text-white text-xs"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm leading-relaxed">{{ toastText }}</p>
                    </div>
                    <button @click="showToastMessage = false" class="flex-shrink-0 text-green-600 hover:text-green-700 transition-colors">
                        <i class="ph ph-x text-lg"></i>
                    </button>
                </div>
            </transition>

            <!-- 空状态视图 -->
            <div v-if="!selectedFile" class="flex-1 flex items-center justify-center">
                <div class="text-center max-w-md mx-auto px-6">
                    <div class="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <i class="ph-fill ph-file-text text-4xl text-indigo-600"></i>
                    </div>
                    
                    <h2 class="text-2xl font-bold text-slate-900 mb-3">开始使用知识库</h2>
                    <p class="text-slate-600 mb-8">创建新文档或导入已有文件来构建您的知识库</p>
                    
                    <div class="flex flex-col gap-3">
                        <!-- 新建文件按钮 -->
                        <button @click="createNewFile"
                            class="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold text-base hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 hover:shadow-xl hover:shadow-indigo-200 flex items-center justify-center gap-3">
                            <i class="ph-fill ph-plus-circle text-2xl"></i>
                            <span>新建文件</span>
                        </button>
                        
                        <!-- 导入文件按钮（带下拉菜单） -->
                        <div class="relative">
                            <button @click="toggleImportMenu"
                                class="w-full px-6 py-4 bg-white text-slate-700 rounded-xl font-bold text-base border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center justify-center gap-3">
                                <i class="ph-fill ph-file-arrow-up text-2xl"></i>
                                <span>导入已有文件</span>
                                <i class="ph ph-caret-down text-sm ml-auto"></i>
                            </button>
                            
                            <!-- 下拉菜单 -->
                            <transition name="dropdown">
                                <div v-if="showImportMenu" 
                                    class="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-10">
                                    <div class="py-2">
                                        <div class="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">本地文件</div>
                                        <button @click="importFile('local-word')" 
                                            class="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm">
                                            <i class="ph ph-file-doc text-lg text-blue-600"></i>
                                            <span class="text-slate-700 font-medium">Word 文档</span>
                                        </button>
                                        <button @click="importFile('local-excel')" 
                                            class="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm">
                                            <i class="ph ph-file-xls text-lg text-green-600"></i>
                                            <span class="text-slate-700 font-medium">Excel 表格</span>
                                        </button>
                                        <button @click="importFile('local-pdf')" 
                                            class="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm">
                                            <i class="ph ph-file-pdf text-lg text-red-600"></i>
                                            <span class="text-slate-700 font-medium">PDF 文件</span>
                                        </button>
                                        <button @click="importFile('local-csv')" 
                                            class="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm">
                                            <i class="ph ph-file-csv text-lg text-slate-600"></i>
                                            <span class="text-slate-700 font-medium">CSV 文件</span>
                                        </button>
                                        
                                        <div class="h-px bg-slate-200 my-2"></div>
                                        
                                        <div class="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">在线文档</div>
                                        <button @click="importFile('online-docs')" 
                                            class="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm">
                                            <i class="ph ph-file-doc text-lg text-blue-500"></i>
                                            <span class="text-slate-700 font-medium">在线 Docs 文档</span>
                                        </button>
                                        <button @click="importFile('online-sheets')" 
                                            class="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm">
                                            <i class="ph ph-file-xls text-lg text-green-500"></i>
                                            <span class="text-slate-700 font-medium">在线 Sheet 表格</span>
                                        </button>
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 三栏工作台视图 -->
            <div v-else class="flex-1 flex overflow-hidden">
                <!-- 左侧栏：文件列表 -->
                <div class="w-80 bg-white border-r border-slate-200 flex flex-col">
                    <!-- 顶部工具栏 -->
                    <div class="px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                        <button @click="createNewFile"
                            class="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                            <i class="ph-fill ph-plus text-base"></i>
                            <span>新建</span>
                        </button>
                        
                        <div class="relative">
                            <button @click="toggleImportMenu"
                                class="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
                                <i class="ph ph-file-arrow-up text-base"></i>
                                <span>导入</span>
                            </button>
                            
                            <!-- 导入下拉菜单 -->
                            <transition name="dropdown">
                                <div v-if="showImportMenu" 
                                    class="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-20">
                                    <div class="py-2">
                                        <div class="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">本地文件</div>
                                        <button @click="importFile('local-word')" 
                                            class="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm">
                                            <i class="ph ph-file-doc text-base text-blue-600"></i>
                                            <span class="text-slate-700">Word 文档</span>
                                        </button>
                                        <button @click="importFile('local-excel')" 
                                            class="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm">
                                            <i class="ph ph-file-xls text-base text-green-600"></i>
                                            <span class="text-slate-700">Excel 表格</span>
                                        </button>
                                        <button @click="importFile('local-pdf')" 
                                            class="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm">
                                            <i class="ph ph-file-pdf text-base text-red-600"></i>
                                            <span class="text-slate-700">PDF 文件</span>
                                        </button>
                                        <button @click="importFile('local-csv')" 
                                            class="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm">
                                            <i class="ph ph-file-csv text-base text-slate-600"></i>
                                            <span class="text-slate-700">CSV 文件</span>
                                        </button>
                                        <div class="h-px bg-slate-200 my-2"></div>
                                        <div class="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">在线文档</div>
                                        <button @click="importFile('online-docs')" 
                                            class="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm">
                                            <i class="ph ph-file-doc text-base text-blue-500"></i>
                                            <span class="text-slate-700">在线 Docs</span>
                                        </button>
                                        <button @click="importFile('online-sheets')" 
                                            class="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm">
                                            <i class="ph ph-file-xls text-base text-green-500"></i>
                                            <span class="text-slate-700">在线 Sheet</span>
                                        </button>
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </div>
                    
                    <!-- 文件列表 -->
                    <div class="flex-1 overflow-y-auto">
                        <div v-for="file in files" :key="file.id"
                            @click="selectFile(file)"
                            :class="['px-4 py-3 border-b border-slate-100 cursor-pointer transition-colors', 
                                     selectedFile?.id === file.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'hover:bg-slate-50']">
                            <div class="flex items-start gap-3">
                                <i :class="['text-xl mt-0.5', getFileIcon(file), getFileIconColor(file)]"></i>
                                <div class="flex-1 min-w-0">
                                    <div class="font-medium text-slate-900 text-sm truncate mb-1">{{ file.name }}</div>
                                    <div class="flex items-center gap-2 text-xs text-slate-500">
                                        <span v-if="file.type === 'imported'" 
                                            :class="['px-1.5 py-0.5 rounded text-[10px] font-bold', getSourceBadgeClass(file)]">
                                            {{ getSourceLabel(file) }}
                                        </span>
                                        <span class="truncate">{{ formatDate(file.updatedAt) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 中间栏：预览/编辑切换区域 -->
                <div class="flex-1 bg-white border-r border-slate-200 flex flex-col">
                    <!-- 工具栏 -->
                    <div class="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <i :class="['text-lg', isEditing ? 'ph ph-pencil-simple text-amber-600' : 'ph ph-eye text-indigo-600']"></i>
                            <span class="text-sm font-bold text-slate-700">{{ isEditing ? '编辑模式' : '预览' }}</span>
                        </div>
                        
                        <div class="flex items-center gap-2">
                            <!-- 查看原文件按钮（导入文件专属） -->
                            <button v-if="selectedFile.type === 'imported'" 
                                @click="openOriginalFile"
                                class="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
                                <i class="ph ph-file text-sm"></i>
                                <span>查看原文件</span>
                            </button>
                            
                            <!-- 编辑/完成按钮 -->
                            <button v-if="canEdit"
                                @click="toggleEditMode"
                                :class="['px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2',
                                         isEditing 
                                         ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                                         : 'bg-amber-100 text-amber-700 hover:bg-amber-200']">
                                <i :class="['text-sm', isEditing ? 'ph ph-check' : 'ph ph-pencil-simple']"></i>
                                <span>{{ isEditing ? '完成' : '编辑' }}</span>
                            </button>
                        </div>
                    </div>
                    
                    <!-- 格式化工具栏（仅编辑模式显示） -->
                    <div v-if="isEditing" class="px-4 py-2 border-b border-slate-200 flex items-center gap-1 bg-slate-50 flex-wrap">
                        <!-- 标题工具 -->
                        <div class="flex items-center gap-1 border-r border-slate-300 pr-2 mr-2">
                            <button @click="formatText('h1')" 
                                class="px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded transition-colors" title="一级标题">
                                H1
                            </button>
                            <button @click="formatText('h2')" 
                                class="px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded transition-colors" title="二级标题">
                                H2
                            </button>
                            <button @click="formatText('h3')" 
                                class="px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded transition-colors" title="三级标题">
                                H3
                            </button>
                        </div>
                        
                        <!-- 文本格式 -->
                        <div class="flex items-center gap-1 border-r border-slate-300 pr-2 mr-2">
                            <button @click="formatText('bold')" 
                                class="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded transition-colors" title="加粗">
                                <i class="ph-bold ph-text-b text-sm"></i>
                            </button>
                            <button @click="formatText('italic')" 
                                class="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded transition-colors" title="斜体">
                                <i class="ph ph-text-italic text-sm"></i>
                            </button>
                            <button @click="formatText('underline')" 
                                class="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded transition-colors" title="下划线">
                                <i class="ph ph-text-underline text-sm"></i>
                            </button>
                            <button @click="formatText('strikethrough')" 
                                class="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded transition-colors" title="删除线">
                                <i class="ph ph-text-strikethrough text-sm"></i>
                            </button>
                        </div>
                        
                        <!-- 列表 -->
                        <div class="flex items-center gap-1 border-r border-slate-300 pr-2 mr-2">
                            <button @click="formatText('ul')" 
                                class="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded transition-colors" title="无序列表">
                                <i class="ph ph-list-bullets text-sm"></i>
                            </button>
                            <button @click="formatText('ol')" 
                                class="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded transition-colors" title="有序列表">
                                <i class="ph ph-list-numbers text-sm"></i>
                            </button>
                        </div>
                        
                        <!-- 其他格式 -->
                        <div class="flex items-center gap-1">
                            <button @click="formatText('code')" 
                                class="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded transition-colors" title="行内代码">
                                <i class="ph ph-code text-sm"></i>
                            </button>
                            <button @click="formatText('link')" 
                                class="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded transition-colors" title="插入链接">
                                <i class="ph ph-link text-sm"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- 内容区：编辑器或预览 -->
                    <div class="flex-1 overflow-hidden">
                        <!-- 编辑模式：所见即所得编辑器 -->
                        <div v-if="isEditing"
                            ref="editor"
                            @input="onEditorInput"
                            contenteditable="true"
                            class="w-full h-full px-6 py-4 overflow-y-auto focus:outline-none preview-content"
                            v-html="renderedHtml"></div>
                        
                        <!-- 预览模式：显示渲染结果 -->
                        <div v-else class="w-full h-full overflow-y-auto">
                            <div class="preview-content px-6 py-4" v-html="renderedHtml"></div>
                        </div>
                    </div>
                    
                    <!-- 底部：目录大纲（仅预览模式显示） -->
                    <div v-if="!isEditing" class="border-t border-slate-200 bg-slate-50">
                        <div class="px-4 py-3 border-b border-slate-200">
                            <div class="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <i class="ph ph-list-bullets text-lg"></i>
                                <span>目录大纲</span>
                            </div>
                        </div>
                        
                        <div class="max-h-60 overflow-y-auto px-4 py-3">
                            <div v-if="tocItems.length === 0" class="text-center text-slate-400 text-xs py-4">
                                <i class="ph ph-list-dashes text-2xl mb-2"></i>
                                <p>暂无标题</p>
                            </div>
                            
                            <div v-for="(item, index) in tocItems" :key="index"
                                @click="scrollToHeading(item)"
                                :class="['py-2 cursor-pointer hover:text-indigo-600 transition-colors text-sm', 
                                         item.level === 1 ? 'font-bold text-slate-900' : 
                                         item.level === 2 ? 'pl-4 font-medium text-slate-700' : 'pl-8 text-slate-600']">
                                {{ item.title }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 右侧栏：Markdown 源码（只读） -->
                <div class="w-1/3 bg-slate-50 border-l border-slate-200 flex flex-col">
                    <!-- 工具栏 -->
                    <div class="px-4 py-3 border-b border-slate-200 flex items-center gap-3">
                        <i class="ph ph-code text-lg text-slate-600"></i>
                        <span class="text-sm font-bold text-slate-700">Markdown 源码</span>
                    </div>
                    
                    <!-- 源码显示区（只读） -->
                    <div class="flex-1 overflow-y-auto">
                        <pre class="px-6 py-4 font-mono text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{{ selectedFile.mdContent }}</pre>
                    </div>
                </div>
            </div>

            <!-- 查看原文件弹窗 -->
            <transition name="modal">
                <div v-if="showOriginalFileModal" 
                    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                    @click.self="closeOriginalFile">
                    <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                        <!-- 弹窗头部 -->
                        <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <i class="ph ph-file text-2xl text-slate-600"></i>
                                <div>
                                    <h3 class="text-lg font-bold text-slate-900">原文件预览</h3>
                                    <p class="text-sm text-slate-600">{{ selectedFile.name }}</p>
                                </div>
                            </div>
                            <button @click="closeOriginalFile" 
                                class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                                <i class="ph ph-x text-xl text-slate-600"></i>
                            </button>
                        </div>
                        
                        <!-- 原文件内容 -->
                        <div class="flex-1 overflow-auto p-6 bg-slate-50">
                            <div class="bg-white rounded-lg p-8 border border-slate-200 flex items-center justify-center min-h-[500px]">
                                <div class="text-center">
                                    <div class="w-32 h-32 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <i class="ph-fill ph-file-image text-6xl text-slate-400"></i>
                                    </div>
                                    <p class="text-slate-600 font-medium mb-2">原文件占位图</p>
                                    <p class="text-sm text-slate-400">实际场景中这里会显示原文件的图片或 PDF 预览</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    `
};

// 注册到全局
window.App = window.App || {};
window.App.Components = window.App.Components || {};
window.App.Components.DetailWiki = DetailWiki;

// 导出组件 (for CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DetailWiki;
}
