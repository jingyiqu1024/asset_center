const { ref, computed, watch, onMounted, nextTick } = Vue;

const DetailDocument = {
    name: 'DetailDocument',
    props: ['node', 'globalTags'],
    setup(props) {
        // ==================== 状态管理 ====================
        const currentStep = ref('welcome');
        const documentForm = ref({
            name: '',
            code: '',
            description: '',
            parentId: 'root_all'
        });
        
        const selectedDocType = ref(null);
        const documents = ref([]);
        const selectedDocument = ref(null);
        
        // 编辑器状态（使用HTML而不是Markdown）
        const htmlContent = ref('');
        const isEditing = ref(false);
        
        // 元数据
        const lastModifiedTime = ref('');
        const lastModifiedBy = ref('');
        const isSaving = ref(false);
        const saveTimer = ref(null);
        
        // 历史版本
        const showHistoryModal = ref(false);
        const versionHistory = ref([]);
        const selectedVersion = ref(null);
        const showVersionDetail = ref(false);
        
        // 在线导入状态
        const onlineUrl = ref('');
        const isParsingOnline = ref(false);
        
        // 本地导入状态
        const localFile = ref(null);
        const isParsingLocal = ref(false);
        
        // 原文查看
        const showOriginalModal = ref(false);
        const originalFileName = ref('');
        const originalFileContent = ref('');
        const originalFileType = ref('');
        
        // 重新同步
        const showResyncModal = ref(false);
        const resyncOnlineUrl = ref('');
        const isResyncingOnline = ref(false);
        const isResyncingLocal = ref(false);
        
        // 从外部导入弹窗
        const showImportConfirmModal = ref(false);
        const showImportOnlinePanel = ref(false);
        const showImportLocalPanel = ref(false);
        const importOnlineUrl = ref('');
        const isImportingOnline = ref(false);
        const isImportingLocal = ref(false);
        const importDropdownOpen = ref(false);
        
        // Toast
        const showToast = ref(false);
        const toastMessage = ref('');
        
        // ==================== Mock 版本历史数据 ====================
        const mockVersionHistory = [
            {
                id: 'v5',
                timestamp: '2024-03-20 16:00:00',
                editor: '张三',
                editorId: 'zhangsan',
                content: '<h1>2024 员工手册</h1><p>这是「2024 员工手册」的文档内容。</p><h2>文档信息</h2><ul><li>文档ID：wiki_hr_101</li><li>文档代码：wiki_hr_101</li></ul><h2>主要内容</h2><p>这里展示文档的主要内容...</p>'
            },
            {
                id: 'v4',
                timestamp: '2024-03-20 15:30:00',
                editor: '李四',
                editorId: 'lisi',
                content: '<h1>2024 员工手册</h1><p>这是旧版本的文档内容。</p>'
            }
        ];
        
        // ==================== 计算属性 ====================
        const eligibleCatalogs = computed(() => {
            return [
                { id: 'root_all', name: '全部资源' },
                { id: 'root_common', name: '公共资源库' },
                { id: 'cat_hr', name: '人力资源' },
                { id: 'cat_finance', name: '财务管理' }
            ];
        });
        
        const hasDocuments = computed(() => documents.value.length > 0);
        
        const documentFormValid = computed(() => {
            return documentForm.value.name.trim() !== '' && 
                   documentForm.value.code.trim() !== '';
        });
        
        const formattedLastModified = computed(() => {
            if (!lastModifiedTime.value) return '';
            return `最后修改：${lastModifiedTime.value} · ${lastModifiedBy.value}`;
        });

        // 字符数统计（去除 HTML 标签后的纯文本字符数）
        const charCount = computed(() => {
            if (!htmlContent.value) return 0;
            const text = htmlContent.value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
            return text.trim().length;
        });

        const formattedCharCount = computed(() => {
            const n = charCount.value;
            if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, '') + ' 万';
            return n.toLocaleString();
        });
        
        // 是否是通过外部弹窗创建的新文档（已经在目录树中）
        const isExternalCreated = computed(() => {
            return props.node && props.node.id && currentStep.value === 'typeSelection';
        });
        
        // ==================== 自动保存 ====================
        watch(htmlContent, (newContent, oldContent) => {
            // 实时自动保存（防抖）
            if (currentStep.value === 'editor' && oldContent !== undefined) {
                autoSave();
            }
        });
        
        const autoSave = () => {
            if (saveTimer.value) {
                clearTimeout(saveTimer.value);
            }
            
            isSaving.value = true;
            
            saveTimer.value = setTimeout(() => {
                // 模拟保存到服务器
                const now = new Date();
                lastModifiedTime.value = now.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                lastModifiedBy.value = '当前用户'; // 实际应该从用户信息获取
                
                // 添加到版本历史
                versionHistory.value.unshift({
                    id: 'v' + Date.now(),
                    timestamp: lastModifiedTime.value,
                    editor: lastModifiedBy.value,
                    editorId: 'current_user',
                    content: htmlContent.value
                });
                
                isSaving.value = false;
                console.log('文档已自动保存');
            }, 1000); // 1秒防抖
        };
        
        // ==================== 权限管理 ====================
        const activeEditorTab = ref('content'); // 'content' | 'permissions'
        const docPermissions = ref([
            { id: 'perm_1', subject: '张三', subjectType: 'user', role: '查看文档', addedBy: '管理员', addedAt: '2024-03-10' },
            { id: 'perm_2', subject: 'HR 部门', subjectType: 'role', role: '查看文档', addedBy: '管理员', addedAt: '2024-03-12' }
        ]);
        const showAddPermModal = ref(false);
        const addPermForm = ref({ subject: '', subjectType: 'user' });
        const isAddingPerm = ref(false);
        
        const openAddPermModal = () => {
            addPermForm.value = { subject: '', subjectType: 'user' };
            showAddPermModal.value = true;
        };
        
        const closeAddPermModal = () => {
            showAddPermModal.value = false;
        };
        
        const saveAddPerm = () => {
            if (!addPermForm.value.subject.trim()) {
                displayToast('请填写授权对象');
                return;
            }
            isAddingPerm.value = true;
            setTimeout(() => {
                docPermissions.value.push({
                    id: 'perm_' + Date.now(),
                    subject: addPermForm.value.subject.trim(),
                    subjectType: addPermForm.value.subjectType,
                    role: '查看文档',
                    addedBy: '当前用户',
                    addedAt: new Date().toLocaleDateString('zh-CN')
                });
                isAddingPerm.value = false;
                closeAddPermModal();
                displayToast('授权添加成功');
            }, 800);
        };
        
        const removePermission = (permId) => {
            if (confirm('确定要移除该授权吗？')) {
                docPermissions.value = docPermissions.value.filter(p => p.id !== permId);
                displayToast('授权已移除');
            }
        };
        
        // ==================== 版本状态 ====================
        const currentVersion = ref({
            version: 'v1',
            environments: { online: 'v1', pre: 'v1', test: null }
        });
        const showVersionDropdown = ref(false);
        const showVersionPublish = ref(false);
        const publishForm = ref({ environment: 'test', note: '' });
        const selectedDropdownVersion = ref(null); // 下拉面板中当前选中查看的版本
        
        const createNewVersion = () => {
            const hasEnvironment = currentVersion.value.environments.online ||
                currentVersion.value.environments.pre ||
                currentVersion.value.environments.test;
            if (!hasEnvironment) return;
            
            const num = parseInt(currentVersion.value.version.replace('v', '') || '1');
            const newVersionStr = `v${num + 1}`;
            
            versionHistory.value.unshift({
                ...currentVersion.value,
                id: 'v_arch_' + Date.now(),
                editor: '当前用户',
                timestamp: new Date().toLocaleString('zh-CN'),
                isLatest: false
            });
            
            currentVersion.value = {
                version: newVersionStr,
                createdAt: new Date().toLocaleString('zh-CN'),
                createdBy: '当前用户',
                isLatest: true,
                environments: { online: null, pre: null, test: null }
            };
        };
        
        const openVersionPublish = () => {
            publishForm.value.environment = 'test';
            publishForm.value.note = '';
            showVersionPublish.value = true;
            showVersionDropdown.value = false;
        };
        
        const closeVersionPublish = () => {
            showVersionPublish.value = false;
        };
        
        const saveVersionPublish = () => {
            const envKey = publishForm.value.environment;
            // 清除其他版本相同环境标签
            versionHistory.value.forEach(v => {
                if (v.environments && v.environments[envKey]) {
                    v.environments[envKey] = null;
                }
            });
            currentVersion.value.environments[envKey] = currentVersion.value.version;
            currentVersion.value.publishedAt = new Date().toLocaleString('zh-CN');
            showVersionPublish.value = false;
            displayToast(`已发布到${envKey === 'online' ? '生产' : envKey === 'pre' ? '预发' : '测试'}环境`);
        };
        
        const switchVersion = (version) => {
            if (version.version === currentVersion.value.version) {
                showVersionDropdown.value = false;
                return;
            }
            htmlContent.value = version.content || htmlContent.value;
            // 将旧 currentVersion 压入历史
            versionHistory.value = versionHistory.value.filter(v => v.version !== version.version);
            versionHistory.value.unshift({ ...currentVersion.value, isLatest: false });
            currentVersion.value = { ...version, isLatest: true };
            showVersionDropdown.value = false;
            displayToast(`已切换到版本 ${version.version}`);
        };
        
        const envLabel = (envKey) => {
            return { online: 'PROD', pre: 'Pre', test: 'Test' }[envKey] || envKey;
        };
        
        const envBadgeClass = (envKey) => {
            return {
                online: 'bg-green-100 text-green-700',
                pre: 'bg-yellow-100 text-yellow-700',
                test: 'bg-sky-100 text-sky-700'
            }[envKey] || 'bg-slate-100 text-slate-600';
        };
        
        // ==================== 历史版本管理 ====================
        const openHistoryModal = () => {
            showHistoryModal.value = true;
            selectedVersion.value = null;
            showVersionDetail.value = false;
        };
        
        const closeHistoryModal = () => {
            showHistoryModal.value = false;
            selectedVersion.value = null;
            showVersionDetail.value = false;
        };
        
        const viewVersion = (version) => {
            selectedVersion.value = version;
            showVersionDetail.value = true;
        };
        
        const backToVersionList = () => {
            selectedVersion.value = null;
            showVersionDetail.value = false;
        };
        
        const restoreVersion = (version) => {
            if (confirm(`确定要恢复到 ${version.timestamp} 的版本吗？当前内容将被替换。`)) {
                htmlContent.value = version.content;
                closeHistoryModal();
                displayToast('已恢复到历史版本');
            }
        };
        
        // ==================== 流程控制 ====================
        const startCreateDocument = () => {
            currentStep.value = 'documentForm';
        };
        
        const submitDocumentForm = () => {
            if (!documentFormValid.value) {
                displayToast('请填写完整的文档信息');
                return;
            }
            // 直接进入编辑器，跳过选择页面
            selectedDocType.value = 'manual';
            htmlContent.value = `<h1>${documentForm.value.name}</h1>\n<p>开始编写您的文档...</p>`;
            isEditing.value = true;
            versionHistory.value = [];
            lastModifiedTime.value = '';
            lastModifiedBy.value = '';
            currentStep.value = 'editor';
        };
        
        const selectDocumentType = (type) => {
            selectedDocType.value = type;
            
            if (type === 'manual') {
                htmlContent.value = '<h1>' + documentForm.value.name + '</h1><p>开始编写您的文档...</p>';
                isEditing.value = true;
                currentStep.value = 'editor';
            } else if (type === 'online') {
                currentStep.value = 'onlineImport';
            } else if (type === 'local') {
                currentStep.value = 'localImport';
            }
        };
        
        const parseOnlineDocument = async () => {
            if (!onlineUrl.value.trim()) {
                displayToast('请输入在线文档链接');
                return;
            }
            
            isParsingOnline.value = true;
            
            setTimeout(() => {
                htmlContent.value = '<h1>' + documentForm.value.name + '</h1><h2>从在线文档导入</h2><p>这是从在线文档 ' + onlineUrl.value + ' 解析得到的内容。</p><h3>1. 导入说明</h3><p>内容已成功解析为 HTML 格式。</p>';
                
                isParsingOnline.value = false;
                isEditing.value = true;
                currentStep.value = 'editor';
                displayToast('在线文档解析成功');
            }, 1500);
        };
        
        const handleLocalFileUpload = (event) => {
            const file = event.target.files[0];
            if (!file) return;
            
            localFile.value = file;
            
            const validTypes = [
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/msword'
            ];
            
            if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.doc') && !file.name.endsWith('.docx')) {
                displayToast('请选择 Word 或 PDF 文件');
                return;
            }
            
            parseLocalFile(file);
        };
        
        const parseLocalFile = (file) => {
            isParsingLocal.value = true;
            
            setTimeout(() => {
                htmlContent.value = '<h1>' + documentForm.value.name + '</h1><h2>从本地文件导入</h2><p>文件名：' + file.name + '</p><h3>1. 文档内容</h3><p>这是从本地 ' + file.name + ' 文件解析得到的内容。</p>';
                
                // 保存原始文件信息和类型
                originalFileName.value = file.name;
                originalFileType.value = file.type;
                localFile.value = file; // 保存文件引用用于下载
                
                originalFileContent.value = '文件名：' + file.name + '\n文件类型：' + (file.type || '未知') + '\n文件大小：' + (file.size / 1024).toFixed(2) + ' KB\n\n原始文件内容（生产环境中由服务器解析返回）。';
                
                isParsingLocal.value = false;
                isEditing.value = true;
                currentStep.value = 'editor';
                displayToast('本地文件解析成功');
            }, 2000);
        };
        
        // ==================== 富文本编辑器格式化功能 ====================
        const formatDoc = (command, value = null) => {
            document.execCommand(command, false, value);
        };
        
        const toggleBold = () => formatDoc('bold');
        const toggleItalic = () => formatDoc('italic');
        const toggleUnderline = () => formatDoc('underline');
        const toggleStrikethrough = () => formatDoc('strikeThrough');
        
        const formatHeading = (level) => {
            formatDoc('formatBlock', `<h${level}>`);
        };
        
        const insertUnorderedList = () => formatDoc('insertUnorderedList');
        const insertOrderedList = () => formatDoc('insertOrderedList');
        
        const alignLeft = () => formatDoc('justifyLeft');
        const alignCenter = () => formatDoc('justifyCenter');
        const alignRight = () => formatDoc('justifyRight');
        const alignJustify = () => formatDoc('justifyFull');
        
        const indent = () => formatDoc('indent');
        const outdent = () => formatDoc('outdent');
        
        const undo = () => formatDoc('undo');
        const redo = () => formatDoc('redo');
        
        const toggleEditMode = () => {
            const wasEditing = isEditing.value;
            isEditing.value = !isEditing.value;

            // 从编辑模式 → 保存并预览
            if (wasEditing) {
                const env = currentVersion.value.environments;
                const isPublished = env.online || env.pre || env.test;

                if (isPublished) {
                    // 当前版本已发布，将其归档到历史，创建递增版本（不带环境标签）
                    const num = parseInt(currentVersion.value.version.replace('v', '') || '1');
                    const newVersionStr = `v${num + 1}`;

                    versionHistory.value.unshift({
                        ...currentVersion.value,
                        id: 'v_arch_' + Date.now(),
                        editor: '当前用户',
                        timestamp: new Date().toLocaleString('zh-CN'),
                        isLatest: false
                    });

                    currentVersion.value = {
                        version: newVersionStr,
                        content: htmlContent.value,
                        createdAt: new Date().toLocaleString('zh-CN'),
                        createdBy: '当前用户',
                        isLatest: true,
                        environments: { online: null, pre: null, test: null }
                    };

                    displayToast(`已保存为新版本 ${newVersionStr}`);
                } else {
                    // 当前版本未发布，直接更新内容即可
                    currentVersion.value.content = htmlContent.value;
                    displayToast('已保存');
                }

                lastModifiedTime.value = new Date().toLocaleString('zh-CN');
                lastModifiedBy.value = '当前用户';
            }
        };
        
        // ==================== 原文查看功能 ====================
        const openOriginalModal = () => {
            showOriginalModal.value = true;
        };
        
        const closeOriginalModal = () => {
            showOriginalModal.value = false;
        };
        
        // 查看原文：在弹窗内预览（PDF 内嵌 iframe，Word 暂时无法内嵌但仍打开弹窗）
        const originalPreviewUrl = ref('');
        const originalPreviewType = ref(''); // 'pdf' | 'word' | 'mock'

        const viewOrDownloadOriginal = () => {
            if (!originalFileName.value) return;

            const fileType = originalFileType.value || '';
            const isPdf = fileType.includes('pdf') || originalFileName.value.toLowerCase().endsWith('.pdf');
            const isWord = fileType.includes('word') || fileType.includes('msword') ||
                originalFileName.value.toLowerCase().endsWith('.docx') ||
                originalFileName.value.toLowerCase().endsWith('.doc');

            if (localFile.value) {
                // 有真实文件 Blob
                const url = URL.createObjectURL(localFile.value);
                originalPreviewUrl.value = url;
                originalPreviewType.value = isPdf ? 'pdf' : isWord ? 'word' : 'pdf';
            } else {
                // Mock 场景：无真实文件
                originalPreviewUrl.value = '';
                originalPreviewType.value = isPdf ? 'pdf' : isWord ? 'word' : 'pdf';
            }

            showOriginalModal.value = true;
        };
        
        const isLocalImported = computed(() => {
            return selectedDocType.value === 'local' && originalFileName.value;
        });

        // 是否为 PDF 扫描件（本地导入且文件类型/文件名为 pdf）
        const isPdfScan = computed(() => {
            if (selectedDocType.value !== 'local') return false;
            const fileType = originalFileType.value || '';
            const fileName = (originalFileName.value || '').toLowerCase();
            return fileType.includes('pdf') || fileName.endsWith('.pdf');
        });
        
        const isOnlineImported = computed(() => {
            return selectedDocType.value === 'online' && onlineUrl.value;
        });
        
        // ==================== 重新同步功能 ====================
        const openResyncModal = () => {
            if (selectedDocType.value === 'online') {
                resyncOnlineUrl.value = onlineUrl.value; // 回显原地址
            }
            showResyncModal.value = true;
        };
        
        const closeResyncModal = () => {
            showResyncModal.value = false;
            resyncOnlineUrl.value = '';
        };
        
        const resyncOnlineDocument = () => {
            if (!resyncOnlineUrl.value.trim()) {
                displayToast('请输入在线文档链接');
                return;
            }
            
            isResyncingOnline.value = true;
            
            setTimeout(() => {
                onlineUrl.value = resyncOnlineUrl.value; // 更新URL
                htmlContent.value = '<h1>' + documentForm.value.name + '</h1><h2>重新同步在线文档</h2><p>已从 ' + resyncOnlineUrl.value + ' 重新同步内容。</p><h3>更新内容</h3><p>文档已更新为最新版本。</p>';
                
                isResyncingOnline.value = false;
                closeResyncModal();
                displayToast('在线文档重新同步成功');
            }, 1500);
        };
        
        const handleResyncLocalFile = (event) => {
            const file = event.target.files[0];
            if (!file) return;
            
            const validTypes = [
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/msword'
            ];
            
            if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.doc') && !file.name.endsWith('.docx')) {
                displayToast('请选择 Word 或 PDF 文件');
                return;
            }
            
            isResyncingLocal.value = true;
            
            setTimeout(() => {
                htmlContent.value = '<h1>' + documentForm.value.name + '</h1><h2>重新同步本地文件</h2><p>文件名：' + file.name + '</p><h3>更新内容</h3><p>已从新上传的 ' + file.name + ' 文件重新解析内容。</p>';
                
                // 更新原始文件信息
                originalFileName.value = file.name;
                originalFileType.value = file.type;
                localFile.value = file;
                
                originalFileContent.value = '文件名：' + file.name + '\n文件类型：' + (file.type || '未知') + '\n文件大小：' + (file.size / 1024).toFixed(2) + ' KB\n\n已重新上传的文件内容。';
                
                isResyncingLocal.value = false;
                closeResyncModal();
                displayToast('本地文件重新同步成功');
            }, 2000);
        };
        
        const backToTypeSelection = () => {
            currentStep.value = 'typeSelection';
            onlineUrl.value = '';
            localFile.value = null;
        };
        
        // ==================== 从外部导入功能 ====================
        const openImportConfirm = () => {
            showImportConfirmModal.value = true;
            showImportOnlinePanel.value = false;
            showImportLocalPanel.value = false;
            importOnlineUrl.value = '';
            importDropdownOpen.value = false;
        };
        
        const closeImportConfirm = () => {
            showImportConfirmModal.value = false;
            showImportOnlinePanel.value = false;
            showImportLocalPanel.value = false;
            importOnlineUrl.value = '';
            isImportingOnline.value = false;
            isImportingLocal.value = false;
        };
        
        const chooseImportOnline = () => {
            showImportOnlinePanel.value = true;
            showImportLocalPanel.value = false;
        };
        
        const chooseImportLocal = () => {
            showImportLocalPanel.value = true;
            showImportOnlinePanel.value = false;
        };
        
        const doImportOnline = () => {
            if (!importOnlineUrl.value.trim()) {
                displayToast('请输入在线文档链接');
                return;
            }
            isImportingOnline.value = true;
            setTimeout(() => {
                onlineUrl.value = importOnlineUrl.value;
                selectedDocType.value = 'online';
                htmlContent.value = '<h1>' + documentForm.value.name + '</h1><h2>从在线文档导入</h2><p>这是从在线文档 ' + importOnlineUrl.value + ' 解析得到的内容。</p><h3>1. 导入说明</h3><p>内容已成功解析为 HTML 格式。</p>';
                isImportingOnline.value = false;
                closeImportConfirm();
                displayToast('在线文档导入成功');
            }, 1500);
        };
        
        const handleImportLocalFile = (event) => {
            const file = event.target.files[0];
            if (!file) return;
            const validTypes = [
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/msword'
            ];
            if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.doc') && !file.name.endsWith('.docx')) {
                displayToast('请选择 Word 或 PDF 文件');
                return;
            }
            isImportingLocal.value = true;
            setTimeout(() => {
                selectedDocType.value = 'local';
                originalFileName.value = file.name;
                originalFileType.value = file.type;
                localFile.value = file;
                htmlContent.value = '<h1>' + documentForm.value.name + '</h1><h2>从本地文件导入</h2><p>文件名：' + file.name + '</p><h3>1. 文档内容</h3><p>这是从本地 ' + file.name + ' 文件解析得到的内容。</p>';
                originalFileContent.value = '文件名：' + file.name + '\n文件类型：' + (file.type || '未知') + '\n文件大小：' + (file.size / 1024).toFixed(2) + ' KB\n\n已成功从本地文件导入内容。';
                isImportingLocal.value = false;
                closeImportConfirm();
                displayToast('导入成功，部分格式解析存在问题，请手动调整');
            }, 2000);
        };
        
        const backToWelcome = () => {
            currentStep.value = 'welcome';
            documentForm.value = { name: '', code: '', description: '', parentId: 'root_all' };
            selectedDocType.value = null;
            htmlContent.value = '';
        };
        
        const displayToast = (message) => {
            toastMessage.value = message;
            showToast.value = true;
            
            setTimeout(() => {
                showToast.value = false;
            }, 3000);
        };
        
        // ==================== 初始化 ====================
        onMounted(() => {
            if (props.node && props.node.id) {
                documentForm.value = {
                    name: props.node.name || props.node.chineseName || '',
                    code: props.node.code || props.node.id,
                    description: props.node.description || '',
                    parentId: 'root_all'
                };
                
                // 检查是否是新创建的文档（直接进入编辑器）
                if (props.node.isNew) {
                    // 新建文档：直接进入编辑器
                    selectedDocType.value = 'manual';
                    htmlContent.value = `<h1>${documentForm.value.name}</h1>\n<p>开始编写您的文档...</p>`;
                    isEditing.value = true;
                    versionHistory.value = [];
                    lastModifiedTime.value = '';
                    lastModifiedBy.value = '';
                    currentStep.value = 'editor';
                    // 清除isNew标记，避免重复触发
                    delete props.node.isNew;
                } else {
                    // 已有文档：加载内容并显示
                    htmlContent.value = '<h1>' + documentForm.value.name + '</h1><p>这是「' + documentForm.value.name + '」的文档内容。</p><h2>文档信息</h2><ul><li>文档ID：' + props.node.id + '</li><li>文档代码：' + documentForm.value.code + '</li></ul><h2>主要内容</h2><p>这里展示文档的主要内容...</p>';
                    
                    // 加载版本历史
                    versionHistory.value = JSON.parse(JSON.stringify(mockVersionHistory));
                    
                    // 设置初始修改时间和修改人
                    lastModifiedTime.value = '2024-03-20 16:00';
                    lastModifiedBy.value = '张三';
                    
                    // Mock：模拟本地文件导入的文档，使「查看原文」按钮可见
                    selectedDocType.value = 'local';
                    originalFileName.value = `${documentForm.value.name}.pdf`;
                    originalFileType.value = 'application/pdf';
                    isEditing.value = false;
                    currentStep.value = 'editor';
                }
            } else {
                currentStep.value = 'welcome';
            }
        });
        
        watch(() => props.node, (newNode) => {
            if (newNode && newNode.id) {
                documentForm.value = {
                    name: newNode.name || newNode.chineseName || '',
                    code: newNode.code || newNode.id,
                    description: newNode.description || '',
                    parentId: 'root_all'
                };
                
                // 检查是否是新创建的文档（直接进入编辑器）
                if (newNode.isNew) {
                    // 新建文档：直接进入编辑器
                    selectedDocType.value = 'manual';
                    htmlContent.value = `<h1>${documentForm.value.name}</h1>\n<p>开始编写您的文档...</p>`;
                    isEditing.value = true;
                    versionHistory.value = [];
                    lastModifiedTime.value = '';
                    lastModifiedBy.value = '';
                    currentStep.value = 'editor';
                    // 清除isNew标记，避免重复触发
                    delete newNode.isNew;
                } else {
                    // 已有文档：加载内容并显示
                    htmlContent.value = '<h1>' + documentForm.value.name + '</h1><p>这是「' + documentForm.value.name + '」的文档内容。</p><h2>文档信息</h2><ul><li>文档ID：' + newNode.id + '</li><li>文档代码：' + documentForm.value.code + '</li></ul><h2>主要内容</h2><p>这里展示文档的主要内容...</p>';
                    
                    versionHistory.value = JSON.parse(JSON.stringify(mockVersionHistory));
                    lastModifiedTime.value = '2024-03-20 16:00';
                    lastModifiedBy.value = '张三';
                    
                    // Mock：模拟本地文件导入的文档，使「查看原文」按钮可见
                    selectedDocType.value = 'local';
                    originalFileName.value = `${documentForm.value.name}.pdf`;
                    originalFileType.value = 'application/pdf';
                    isEditing.value = false;
                    currentStep.value = 'editor';
                }
            }
        });
        
        // ==================== 返回接口 ====================
        return {
            currentStep,
            documentForm,
            selectedDocType,
            documents,
            selectedDocument,
            htmlContent,
            isEditing,
            onlineUrl,
            isParsingOnline,
            localFile,
            isParsingLocal,
            showToast,
            toastMessage,
            eligibleCatalogs,
            hasDocuments,
            documentFormValid,
            
            // 新增
            lastModifiedTime,
            lastModifiedBy,
            formattedLastModified,
            charCount,
            formattedCharCount,
            isSaving,
            isExternalCreated,
            showHistoryModal,
            versionHistory,
            selectedVersion,
            showVersionDetail,
            
            // 原文查看
            showOriginalModal,
            originalFileName,
            originalFileContent,
            originalFileType,
            originalPreviewUrl,
            originalPreviewType,
            isLocalImported,
            isOnlineImported,
            isPdfScan,
            
            // 重新同步
            showResyncModal,
            resyncOnlineUrl,
            isResyncingOnline,
            isResyncingLocal,
            
            startCreateDocument,
            submitDocumentForm,
            selectDocumentType,
            parseOnlineDocument,
            handleLocalFileUpload,
            toggleEditMode,
            backToTypeSelection,
            backToWelcome,
            
            // 富文本编辑器格式化功能
            toggleBold,
            toggleItalic,
            toggleUnderline,
            toggleStrikethrough,
            formatHeading,
            insertUnorderedList,
            insertOrderedList,
            alignLeft,
            alignCenter,
            alignRight,
            alignJustify,
            indent,
            outdent,
            undo,
            redo,
            
            // 新增
            openHistoryModal,
            closeHistoryModal,
            viewVersion,
            backToVersionList,
            restoreVersion,
            
            // 原文查看和重新同步
            openOriginalModal,
            closeOriginalModal,
            viewOrDownloadOriginal,
            openResyncModal,
            closeResyncModal,
            resyncOnlineDocument,
            handleResyncLocalFile,
            
            // 从外部导入
            showImportConfirmModal,
            showImportOnlinePanel,
            showImportLocalPanel,
            importOnlineUrl,
            isImportingOnline,
            isImportingLocal,
            importDropdownOpen,
            openImportConfirm,
            closeImportConfirm,
            chooseImportOnline,
            chooseImportLocal,
            doImportOnline,
            handleImportLocalFile,
            
            // 版本管理
            currentVersion,
            showVersionDropdown,
            showVersionPublish,
            publishForm,
            selectedDropdownVersion,
            createNewVersion,
            openVersionPublish,
            closeVersionPublish,
            saveVersionPublish,
            switchVersion,
            envLabel,
            envBadgeClass,
            
            // 权限管理
            activeEditorTab,
            docPermissions,
            showAddPermModal,
            addPermForm,
            isAddingPerm,
            openAddPermModal,
            closeAddPermModal,
            saveAddPerm,
            removePermission,
            

        };
    },
    
    template: `
        <div class="h-full flex flex-col bg-slate-50">
            <!-- Toast 提示 -->
            <transition name="fade">
                <div v-if="showToast" 
                    class="fixed top-20 right-6 px-4 py-3 rounded-lg shadow-2xl text-sm font-medium flex items-start gap-3 border z-[100] bg-green-50 text-green-800 border-green-200 max-w-md">
                    <div class="flex-shrink-0 w-5 h-5 rounded-full bg-green-600 flex items-center justify-center mt-0.5">
                        <i class="ph-fill ph-check text-white text-xs"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm leading-relaxed">{{ toastMessage }}</p>
                    </div>
                    <button @click="showToast = false" class="flex-shrink-0 text-green-600 hover:text-green-700 transition-colors">
                        <i class="ph ph-x text-lg"></i>
                    </button>
                </div>
            </transition>

            <!-- 欢迎页面 -->
            <div v-if="currentStep === 'welcome'" class="flex-1 flex items-center justify-center">
                <div class="text-center max-w-md mx-auto px-6">
                    <div class="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <i class="ph-fill ph-file-text text-4xl text-indigo-600"></i>
                    </div>
                    
                    <h2 class="text-2xl font-bold text-slate-900 mb-3">开始创建文档</h2>
                    <p class="text-slate-600 mb-8">创建新文档或导入已有文件来构建您的文档库</p>
                    
                    <button @click="startCreateDocument"
                        class="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-base hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 hover:shadow-xl hover:shadow-indigo-200 flex items-center justify-center gap-3 mx-auto">
                        <i class="ph-fill ph-plus-circle text-2xl"></i>
                        <span>新建文档</span>
                    </button>
                </div>
            </div>

            <!-- 文档信息表单 -->
            <div v-if="currentStep === 'documentForm'" class="flex-1 flex items-center justify-center">
                <div class="w-full max-w-2xl mx-auto px-6">
                    <div class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                        <div class="px-8 py-6 border-b border-slate-200 bg-slate-50">
                            <h2 class="text-2xl font-bold text-slate-900 mb-2">文档信息</h2>
                            <p class="text-sm text-slate-600">请填写文档的基本信息</p>
                        </div>
                        
                        <div class="p-8 space-y-6">
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-2">文档名称 <span class="text-red-500">*</span></label>
                                <input v-model="documentForm.name" type="text" 
                                    class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                    placeholder="例如：产品需求文档-Q2规划">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-2">文档 Code <span class="text-red-500">*</span></label>
                                <input v-model="documentForm.code" type="text" 
                                    class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-mono"
                                    placeholder="例如：product_req_q2">
                                <p class="mt-1 text-xs text-slate-500">Code 用于唯一标识文档，只能包含字母、数字和下划线</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-2">文档描述</label>
                                <textarea v-model="documentForm.description" rows="3"
                                    class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                    placeholder="简要描述文档的用途和内容"></textarea>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-2">放置目录</label>
                                <select v-model="documentForm.parentId" 
                                    class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white">
                                    <option v-for="cat in eligibleCatalogs" :key="cat.id" :value="cat.id">
                                        {{ cat.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="px-8 py-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                            <button @click="backToWelcome"
                                class="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                                取消
                            </button>
                            <button @click="submitDocumentForm"
                                :disabled="!documentFormValid"
                                :class="['px-8 py-2.5 rounded-lg text-sm font-bold transition-all',
                                         documentFormValid 
                                         ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100' 
                                         : 'bg-slate-200 text-slate-400 cursor-not-allowed']">
                                下一步
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 文档类型选择 -->
            <div v-if="currentStep === 'typeSelection'" class="flex-1 flex items-center justify-center">
                <div class="w-full max-w-4xl mx-auto px-6">
                    <div class="text-center mb-8">
                        <h2 class="text-2xl font-bold text-slate-900 mb-2">选择创建方式</h2>
                        <p class="text-slate-600">请选择您希望如何创建这个文档</p>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-6">
                        <button @click="selectDocumentType('manual')"
                            class="group bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-indigo-400 hover:shadow-xl transition-all">
                            <div class="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                                <i class="ph-fill ph-pencil-line text-3xl text-indigo-600"></i>
                            </div>
                            <h3 class="text-lg font-bold text-slate-900 mb-2">手动创建文档</h3>
                            <p class="text-sm text-slate-600">使用编辑器从零开始创建文档</p>
                        </button>
                        
                        <button @click="selectDocumentType('online')"
                            class="group bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-indigo-400 hover:shadow-xl transition-all">
                            <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                                <i class="ph-fill ph-cloud-arrow-down text-3xl text-blue-600"></i>
                            </div>
                            <h3 class="text-lg font-bold text-slate-900 mb-2">从在线文档导入</h3>
                            <p class="text-sm text-slate-600">粘贴 Docs 文档链接，自动解析内容</p>
                        </button>
                        
                        <button @click="selectDocumentType('local')"
                            class="group bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-indigo-400 hover:shadow-xl transition-all">
                            <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                                <i class="ph-fill ph-upload-simple text-3xl text-green-600"></i>
                            </div>
                            <h3 class="text-lg font-bold text-slate-900 mb-2">从本地导入</h3>
                            <p class="text-sm text-slate-600">上传 Word 或 PDF 文件，自动转换为文档</p>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 在线文档导入 -->
            <div v-if="currentStep === 'onlineImport'" class="flex-1 flex items-center justify-center">
                <div class="w-full max-w-2xl mx-auto px-6">
                    <div class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                        <div class="px-8 py-6 border-b border-slate-200 bg-slate-50">
                            <h2 class="text-2xl font-bold text-slate-900 mb-2">从在线文档导入</h2>
                            <p class="text-sm text-slate-600">粘贴在线文档的链接，我们将自动解析内容</p>
                        </div>
                        
                        <div class="p-8 space-y-6">
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-2">在线文档链接</label>
                                <input v-model="onlineUrl" type="url" 
                                    class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                    placeholder="https://docs.corp.kuaishou.com/xxxx">
                            </div>
                            
                            <div v-if="isParsingOnline" class="text-center py-8">
                                <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p class="text-sm text-slate-600">正在解析在线文档...</p>
                            </div>
                        </div>
                        
                        <div class="px-8 py-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                            <button @click="backToTypeSelection"
                                class="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                                <i class="ph ph-arrow-left mr-2"></i>
                                返回
                            </button>
                            <button @click="parseOnlineDocument"
                                :disabled="!onlineUrl.trim() || isParsingOnline"
                                :class="['px-8 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2',
                                         onlineUrl.trim() && !isParsingOnline
                                         ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100' 
                                         : 'bg-slate-200 text-slate-400 cursor-not-allowed']">
                                <i class="ph ph-magic-wand"></i>
                                <span>解析文档</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 本地文件导入 -->
            <div v-if="currentStep === 'localImport'" class="flex-1 flex items-center justify-center">
                <div class="w-full max-w-2xl mx-auto px-6">
                    <div class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                        <div class="px-8 py-6 border-b border-slate-200 bg-slate-50">
                            <h2 class="text-2xl font-bold text-slate-900 mb-2">从本地文件导入</h2>
                            <p class="text-sm text-slate-600">上传 Word 或 PDF 文件，自动转换为文档</p>
                        </div>
                        
                        <div class="p-8">
                            <div class="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-indigo-400 transition-colors">
                                <input type="file" @change="handleLocalFileUpload" 
                                    accept=".doc,.docx,.pdf"
                                    class="hidden" id="fileInput">
                                
                                <label for="fileInput" class="cursor-pointer block">
                                    <div class="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <i class="ph-fill ph-file-arrow-up text-3xl text-slate-400"></i>
                                    </div>
                                    <p class="text-lg font-bold text-slate-900 mb-2">点击选择文件</p>
                                    <p class="text-sm text-slate-600 mb-4">支持 Word (.doc, .docx) 和 PDF (.pdf) 格式</p>
                                    <p v-if="localFile" class="text-sm text-indigo-600 font-medium">
                                        已选择：{{ localFile.name }}
                                    </p>
                                </label>
                            </div>
                            
                            <div v-if="isParsingLocal" class="text-center py-8 mt-6">
                                <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p class="text-sm text-slate-600">正在解析本地文件...</p>
                            </div>
                        </div>
                        
                        <div class="px-8 py-6 bg-slate-50 border-t border-slate-200">
                            <button @click="backToTypeSelection"
                                class="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                                <i class="ph ph-arrow-left mr-2"></i>
                                返回
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 编辑器界面 -->
            <div v-if="currentStep === 'editor'" class="flex-1 flex flex-col overflow-hidden">
                <!-- 顶部文档信息栏 -->
                <div class="px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0">
                    <div class="flex items-start justify-between gap-4">
                        <div class="flex-1 min-w-0">
                            <h1 class="text-xl font-bold text-slate-900 truncate mb-2">{{ documentForm.name }}</h1>
                            <p v-if="documentForm.description" class="text-sm text-slate-600">{{ documentForm.description }}</p>
                            <div class="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                                <span>字符数：{{ formattedCharCount }}</span>
                                <span class="text-slate-300">·</span>
                                <span>{{ formattedLastModified }}</span>
                                <span v-if="isSaving" class="flex items-center gap-1 text-amber-600">
                                    <i class="ph ph-spinner animate-spin text-xs"></i>
                                    保存中...
                                </span>


                            </div>
                        </div>
                        
                        <div class="flex items-center gap-2 flex-shrink-0">
                            <!-- 保存并预览按钮（PDF 扫描件时隐藏） -->
                            <button v-if="!isPdfScan" @click="toggleEditMode"
                                :class="['px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5',
                                    isEditing
                                    ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-300'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700']">
                                <i :class="['text-sm', isEditing ? 'ph ph-check' : 'ph ph-pencil-simple']"></i>
                                <span>{{ isEditing ? '保存并预览' : '编辑' }}</span>
                            </button>
                            
                            <!-- 从外部导入按钮 -->
                            <button @click="openImportConfirm"
                                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200">
                                <i class="ph ph-cloud-arrow-down text-sm"></i>
                                <span>从外部导入</span>
                            </button>
                            
                            <!-- 查看原文按钮 - 仅在本地或在线导入时显示 -->
                            <button v-if="isLocalImported || isOnlineImported"
                                @click="isOnlineImported ? window.open(onlineUrl, '_blank') : viewOrDownloadOriginal()"
                                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200">
                                <i class="ph ph-file-text text-sm"></i>
                                <span>查看原文</span>
                            </button>

                            <!-- 分隔线 -->
                            <div class="w-px h-4 bg-slate-200 mx-1"></div>

                            <!-- 版本选择器 + 发布（最右边） -->
                            <div class="relative flex items-center gap-1.5">
                                <!-- 版本触发器 -->
                                <button @click="showVersionDropdown = !showVersionDropdown"
                                    class="flex items-center gap-1.5 text-sm text-slate-700 hover:text-slate-900 transition-colors">
                                    <span class="text-slate-500 text-xs">版本：</span>
                                    <span class="font-medium">{{ currentVersion.version }}</span>
                                    <span v-if="currentVersion.environments.pre" class="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">预发</span>
                                    <span v-if="currentVersion.environments.online" class="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">生产</span>
                                    <span v-if="!currentVersion.environments.online && !currentVersion.environments.pre && currentVersion.environments.test" class="px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-700">测试</span>
                                    <i class="ph ph-caret-down text-xs text-slate-400"></i>
                                </button>
                                <!-- 发布按钮 -->
                                <button @click="openVersionPublish"
                                    class="flex items-center gap-1.5 px-3 py-1.5 border border-indigo-500 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-50 transition-colors">
                                    <i class="ph ph-cloud-arrow-up text-sm"></i>
                                    <span>发布</span>
                                </button>
                                <!-- 版本下拉面板 -->
                                <div v-if="showVersionDropdown" @click.stop
                                    class="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-30 overflow-hidden flex flex-col" style="width:560px; max-width:calc(100vw - 32px)">
                                    <!-- 上半部分：左右分栏 -->
                                    <div class="flex" style="min-height:360px; max-height:480px">
                                        <!-- 左侧：版本列表 -->
                                        <div class="flex flex-col border-r border-slate-100" style="width:200px; flex-shrink:0">
                                            <!-- 当前版本头部 -->
                                            <div class="px-5 pt-5 pb-4 border-b border-slate-100">
                                                <p class="text-xs text-slate-400 mb-1">当前版本</p>
                                                <div class="flex items-center gap-2">
                                                    <span class="text-3xl font-bold text-slate-900 leading-none">{{ currentVersion.version }}</span>
                                                    <div class="flex flex-col gap-1">
                                                        <span v-if="currentVersion.environments.pre" class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">预发</span>
                                                        <span v-if="currentVersion.environments.online" class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">生产</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- 版本列表标题 -->
                                            <div class="px-5 pt-3 pb-2">
                                                <p class="text-xs text-slate-400">版本列表</p>
                                            </div>
                                            <!-- 版本列表滚动区 -->
                                            <div class="flex-1 overflow-y-auto pb-2">
                                                <!-- 当前版本条目 -->
                                                <button
                                                    @click="selectedDropdownVersion = null"
                                                    :class="['w-full px-5 py-3 flex items-center justify-between text-left transition-colors', !selectedDropdownVersion ? 'bg-indigo-50' : 'hover:bg-slate-50']">
                                                    <span :class="['text-sm font-medium', !selectedDropdownVersion ? 'text-indigo-700' : 'text-slate-700']">{{ currentVersion.version }}</span>
                                                    <div class="flex items-center gap-1">
                                                        <span v-if="currentVersion.environments.pre" class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                                                        <span v-if="currentVersion.environments.online" class="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
                                                        <span v-if="!currentVersion.environments.online && !currentVersion.environments.pre && currentVersion.environments.test" class="w-2 h-2 rounded-full bg-sky-400 inline-block"></span>
                                                        <span v-if="!currentVersion.environments.online && !currentVersion.environments.pre && !currentVersion.environments.test" class="w-2 h-2 rounded-full bg-slate-200 inline-block"></span>
                                                    </div>
                                                </button>
                                                <!-- 历史版本条目 -->
                                                <button v-for="v in versionHistory" :key="v.id || v.version"
                                                    @click="selectedDropdownVersion = v"
                                                    :class="['w-full px-5 py-3 flex items-center justify-between text-left transition-colors', selectedDropdownVersion && selectedDropdownVersion.version === v.version ? 'bg-indigo-50' : 'hover:bg-slate-50']">
                                                    <span :class="['text-sm', selectedDropdownVersion && selectedDropdownVersion.version === v.version ? 'font-medium text-indigo-700' : 'text-slate-600']">{{ v.version }}</span>
                                                    <div class="flex items-center gap-1">
                                                        <span v-if="v.environments && v.environments.pre" class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                                                        <span v-if="v.environments && v.environments.online" class="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
                                                        <span v-if="v.environments && v.environments.test" class="w-2 h-2 rounded-full bg-sky-400 inline-block"></span>
                                                        <span v-if="!(v.environments && (v.environments.pre || v.environments.online || v.environments.test))" class="w-2 h-2 rounded-full bg-slate-200 inline-block"></span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        <!-- 右侧：发布记录 -->
                                        <div class="flex-1 flex flex-col overflow-hidden">
                                            <!-- 右侧头部：版本号 | 发布记录 -->
                                            <div class="px-5 pt-5 pb-3 border-b border-slate-100">
                                                <span class="text-sm font-semibold text-slate-800">{{ selectedDropdownVersion ? selectedDropdownVersion.version : currentVersion.version }}</span>
                                                <span class="mx-2 text-slate-300">|</span>
                                                <span class="text-sm text-slate-400">发布记录</span>
                                            </div>
                                            <!-- 发布记录内容 -->
                                            <div class="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                                                <!-- 查看历史版本的发布记录 -->
                                                <template v-if="selectedDropdownVersion">
                                                    <div v-if="selectedDropdownVersion.environments && selectedDropdownVersion.environments.online">
                                                        <p class="text-sm font-semibold text-slate-800 mb-2">生产环境</p>
                                                        <p class="text-xs text-slate-500 leading-relaxed mb-3">{{ selectedDropdownVersion.publishNote || '支持版本环境标签持久化展示，优化字段渲染逻辑，修复部分边界问题。' }}</p>
                                                        <div class="flex items-center gap-2">
                                                            <img src="https://api.dicebear.com/7.x/thumbs/svg?seed=online" class="w-6 h-6 rounded-full bg-slate-200" />
                                                            <span class="text-xs text-slate-600">{{ selectedDropdownVersion.publishedBy || '张嘉怡' }}</span>
                                                            <span class="text-xs text-slate-400 ml-auto">{{ selectedDropdownVersion.publishedAt || '2025-06-04 22:06' }}</span>
                                                        </div>
                                                    </div>
                                                    <div v-if="selectedDropdownVersion.environments && selectedDropdownVersion.environments.pre">
                                                        <p class="text-sm font-semibold text-slate-800 mb-2">预发环境</p>
                                                        <p class="text-xs text-slate-500 leading-relaxed mb-3">{{ selectedDropdownVersion.publishNote || '支持版本环境标签持久化展示，优化字段渲染逻辑，修复部分边界问题。' }}</p>
                                                        <div class="flex items-center gap-2">
                                                            <img src="https://api.dicebear.com/7.x/thumbs/svg?seed=pre" class="w-6 h-6 rounded-full bg-slate-200" />
                                                            <span class="text-xs text-slate-600">{{ selectedDropdownVersion.publishedBy || '张俊杰' }}</span>
                                                            <span class="text-xs text-slate-400 ml-auto">{{ selectedDropdownVersion.publishedAt || '2025-05-08 21:44' }}</span>
                                                        </div>
                                                    </div>
                                                    <div v-if="selectedDropdownVersion.environments && selectedDropdownVersion.environments.test">
                                                        <p class="text-sm font-semibold text-slate-800 mb-2">测试环境</p>
                                                        <p class="text-xs text-slate-500 leading-relaxed mb-3">{{ selectedDropdownVersion.publishNote || '支持版本环境标签持久化展示。' }}</p>
                                                        <div class="flex items-center gap-2">
                                                            <img src="https://api.dicebear.com/7.x/thumbs/svg?seed=test" class="w-6 h-6 rounded-full bg-slate-200" />
                                                            <span class="text-xs text-slate-600">{{ selectedDropdownVersion.publishedBy || '当前用户' }}</span>
                                                            <span class="text-xs text-slate-400 ml-auto">{{ selectedDropdownVersion.publishedAt || '' }}</span>
                                                        </div>
                                                    </div>
                                                    <div v-if="!(selectedDropdownVersion.environments && (selectedDropdownVersion.environments.online || selectedDropdownVersion.environments.pre || selectedDropdownVersion.environments.test))" class="text-center py-10">
                                                        <i class="ph ph-clock text-3xl text-slate-300 block mb-2"></i>
                                                        <p class="text-xs text-slate-400">该版本暂未发布</p>
                                                    </div>
                                                </template>
                                                <!-- 查看当前版本的发布记录 -->
                                                <template v-else>
                                                    <div v-if="currentVersion.environments.online">
                                                        <p class="text-sm font-semibold text-slate-800 mb-2">生产环境</p>
                                                        <p class="text-xs text-slate-500 leading-relaxed mb-3">{{ currentVersion.publishNote || '支持版本环境标签持久化展示，优化字段渲染逻辑，修复部分边界问题。' }}</p>
                                                        <div class="flex items-center gap-2">
                                                            <img src="https://api.dicebear.com/7.x/thumbs/svg?seed=online" class="w-6 h-6 rounded-full bg-slate-200" />
                                                            <span class="text-xs text-slate-600">{{ currentVersion.publishedBy || '张嘉怡' }}</span>
                                                            <span class="text-xs text-slate-400 ml-auto">{{ currentVersion.publishedAt || '2025-06-04 22:06' }}</span>
                                                        </div>
                                                    </div>
                                                    <div v-if="currentVersion.environments.pre">
                                                        <p class="text-sm font-semibold text-slate-800 mb-2">预发环境</p>
                                                        <p class="text-xs text-slate-500 leading-relaxed mb-3">{{ currentVersion.publishNote || '支持版本环境标签持久化展示，优化字段渲染逻辑，修复部分边界问题。' }}</p>
                                                        <div class="flex items-center gap-2">
                                                            <img src="https://api.dicebear.com/7.x/thumbs/svg?seed=pre" class="w-6 h-6 rounded-full bg-slate-200" />
                                                            <span class="text-xs text-slate-600">{{ currentVersion.publishedBy || '张俊杰' }}</span>
                                                            <span class="text-xs text-slate-400 ml-auto">{{ currentVersion.publishedAt || '2025-05-08 21:44' }}</span>
                                                        </div>
                                                    </div>
                                                    <div v-if="currentVersion.environments.test">
                                                        <p class="text-sm font-semibold text-slate-800 mb-2">测试环境</p>
                                                        <p class="text-xs text-slate-500 leading-relaxed mb-3">{{ currentVersion.publishNote || '支持版本环境标签持久化展示。' }}</p>
                                                        <div class="flex items-center gap-2">
                                                            <img src="https://api.dicebear.com/7.x/thumbs/svg?seed=test" class="w-6 h-6 rounded-full bg-slate-200" />
                                                            <span class="text-xs text-slate-600">{{ currentVersion.publishedBy || '当前用户' }}</span>
                                                            <span class="text-xs text-slate-400 ml-auto">{{ currentVersion.publishedAt || '' }}</span>
                                                        </div>
                                                    </div>
                                                    <div v-if="!currentVersion.environments.online && !currentVersion.environments.pre && !currentVersion.environments.test" class="text-center py-10">
                                                        <i class="ph ph-clock text-3xl text-slate-300 block mb-2"></i>
                                                        <p class="text-xs text-slate-400">当前版本暂未发布</p>
                                                    </div>
                                                </template>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 底部横跨全宽的「浏览此版本」按钮 -->
                                    <div class="px-5 py-4 border-t border-slate-100">
                                        <button @click="selectedDropdownVersion ? switchVersion(selectedDropdownVersion) : (showVersionDropdown = false)"
                                            class="w-full py-2.5 border border-indigo-400 text-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-50 transition-colors">
                                            浏览此版本
                                        </button>
                                    </div>
                                </div>
                                <!-- 遮罩 -->
                                <div v-if="showVersionDropdown" @click="showVersionDropdown = false; selectedDropdownVersion = null" class="fixed inset-0 z-20"></div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                
                <!-- 页签导航 + 编辑器主体 -->
                <div class="flex-1 overflow-hidden bg-white flex flex-col">
                    <!-- 页签栏 -->
                    <div class="flex-shrink-0 border-b border-slate-200 bg-white px-4 pt-2">
                        <div class="flex items-center gap-0">
                            <button @click="activeEditorTab = 'content'"
                                :class="['px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2',
                                    activeEditorTab === 'content'
                                    ? 'text-indigo-700 border-indigo-600 bg-white'
                                    : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300']">
                                <i class="ph ph-file-text text-sm"></i>
                                文档内容
                            </button>
                            <button @click="activeEditorTab = 'permissions'"
                                :class="['px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2',
                                    activeEditorTab === 'permissions'
                                    ? 'text-indigo-700 border-indigo-600 bg-white'
                                    : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300']">
                                <i class="ph ph-lock-key text-sm"></i>
                                权限管理
                            </button>
                        </div>
                    </div>
                    
                    <!-- 文档内容页签 -->
                    <div v-if="activeEditorTab === 'content'" class="flex-1 overflow-hidden flex flex-col">
                    <div class="h-full flex flex-col">
                        <!-- 编辑器工具栏 -->
                        <div class="border-b border-slate-200 bg-white flex-shrink-0">
                            <!-- 格式化工具栏 -->
                            <div v-if="isEditing" class="px-4 py-2 border-t border-slate-200 bg-slate-50 flex items-center gap-1 flex-wrap">
                                <!-- 撤销/重做 -->
                                <div class="flex items-center gap-0.5 pr-2 border-r border-slate-300">
                                    <button @click="undo" 
                                        class="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
                                        title="撤销">
                                        <i class="ph ph-arrow-counter-clockwise text-slate-700"></i>
                                    </button>
                                    <button @click="redo"
                                        class="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
                                        title="重做">
                                        <i class="ph ph-arrow-clockwise text-slate-700"></i>
                                    </button>
                                </div>
                                
                                <!-- 标题 -->
                                <div class="flex items-center gap-0.5 px-2 border-r border-slate-300">
                                    <button @click="formatHeading(1)"
                                        class="px-2 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors text-xs font-bold text-slate-700"
                                        title="标题1">
                                        H1
                                    </button>
                                    <button @click="formatHeading(2)"
                                        class="px-2 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors text-xs font-bold text-slate-700"
                                        title="标题2">
                                        H2
                                    </button>
                                    <button @click="formatHeading(3)"
                                        class="px-2 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors text-xs font-bold text-slate-700"
                                        title="标题3">
                                        H3
                                    </button>
                                </div>
                                
                                <!-- 文本样式 -->
                                <div class="flex items-center gap-0.5 px-2 border-r border-slate-300">
                                    <button @click="toggleBold"
                                        class="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
                                        title="加粗">
                                        <i class="ph-bold ph-text-b text-slate-700"></i>
                                    </button>
                                    <button @click="toggleItalic"
                                        class="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
                                        title="斜体">
                                        <i class="ph ph-text-italic text-slate-700"></i>
                                    </button>
                                    <button @click="toggleUnderline"
                                        class="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
                                        title="下划线">
                                        <i class="ph ph-text-underline text-slate-700"></i>
                                    </button>
                                    <button @click="toggleStrikethrough"
                                        class="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
                                        title="删除线">
                                        <i class="ph ph-text-strikethrough text-slate-700"></i>
                                    </button>
                                </div>
                                
                                <!-- 列表 -->
                                <div class="flex items-center gap-0.5 px-2 border-r border-slate-300">
                                    <button @click="insertUnorderedList"
                                        class="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
                                        title="无序列表">
                                        <i class="ph ph-list-bullets text-slate-700"></i>
                                    </button>
                                    <button @click="insertOrderedList"
                                        class="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
                                        title="有序列表">
                                        <i class="ph ph-list-numbers text-slate-700"></i>
                                    </button>
                                </div>
                                
                                <!-- 缩进 -->
                                <div class="flex items-center gap-0.5 px-2 border-r border-slate-300">
                                    <button @click="outdent"
                                        class="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
                                        title="减少缩进">
                                        <i class="ph ph-text-outdent text-slate-700"></i>
                                    </button>
                                    <button @click="indent"
                                        class="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
                                        title="增加缩进">
                                        <i class="ph ph-text-indent text-slate-700"></i>
                                    </button>
                                </div>
                                
                                <!-- 对齐 -->
                                <div class="flex items-center gap-0.5 px-2">
                                    <button @click="alignLeft"
                                        class="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
                                        title="左对齐">
                                        <i class="ph ph-text-align-left text-slate-700"></i>
                                    </button>
                                    <button @click="alignCenter"
                                        class="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
                                        title="居中对齐">
                                        <i class="ph ph-text-align-center text-slate-700"></i>
                                    </button>
                                    <button @click="alignRight"
                                        class="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
                                        title="右对齐">
                                        <i class="ph ph-text-align-right text-slate-700"></i>
                                    </button>
                                    <button @click="alignJustify"
                                        class="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
                                        title="两端对齐">
                                        <i class="ph ph-text-align-justify text-slate-700"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 富文本编辑器 -->
                        <div v-if="isEditing" class="flex-1 overflow-y-auto p-6">
                            <div contenteditable="true"
                                @input="htmlContent = $event.target.innerHTML"
                                v-html="htmlContent"
                                class="min-h-full prose prose-slate max-w-none focus:outline-none
                                       prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4
                                       prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-3 prose-h2:mt-6
                                       prose-h3:text-xl prose-h3:font-bold prose-h3:mb-2 prose-h3:mt-4
                                       prose-p:mb-3 prose-p:leading-relaxed
                                       prose-ul:my-3 prose-ul:list-disc prose-ul:pl-6
                                       prose-li:mb-1">
                            </div>
                        </div>
                        
                        <!-- 预览模式 -->
                        <div v-else class="flex-1 overflow-hidden flex flex-col">
                            <!-- PDF 扫描件：直接内嵌 PDF 预览 -->
                            <template v-if="isPdfScan">
                                <!-- 有真实文件 Blob：iframe 预览 -->
                                <iframe v-if="originalPreviewUrl"
                                    :src="originalPreviewUrl"
                                    class="flex-1 w-full border-0 bg-white"
                                    type="application/pdf">
                                </iframe>
                                <!-- Mock 场景：占位提示 -->
                                <div v-else class="flex-1 flex flex-col items-center justify-center gap-4 bg-slate-50 text-slate-400">
                                    <div class="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center">
                                        <i class="ph-fill ph-file-pdf text-4xl text-red-400"></i>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-base font-medium text-slate-600 mb-1">{{ originalFileName }}</p>
                                        <p class="text-sm text-slate-400">PDF 扫描件预览（Mock 模式，暂无真实文件）</p>
                                    </div>
                                </div>
                            </template>
                            <!-- 普通文档：渲染 HTML 内容 -->
                            <div v-else class="flex-1 overflow-y-auto p-6 bg-slate-50">
                                <div v-html="htmlContent"
                                    class="prose prose-slate max-w-none
                                           prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4
                                           prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-3 prose-h2:mt-6
                                           prose-h3:text-xl prose-h3:font-bold prose-h3:mb-2 prose-h3:mt-4
                                           prose-p:mb-3 prose-p:leading-relaxed
                                           prose-ul:my-3 prose-ul:list-disc prose-ul:pl-6
                                           prose-li:mb-1">
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    
                    <!-- 权限管理页签 -->
                    <div v-if="activeEditorTab === 'permissions'" class="flex-1 overflow-y-auto p-6 bg-slate-50">
                        <!-- 权限说明 -->
                        <div class="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-5 flex items-start gap-2">
                            <i class="ph ph-info text-blue-600 mt-0.5 flex-shrink-0"></i>
                            <p class="text-xs text-blue-700 leading-relaxed">
                                在此管理可查看本文档的用户或角色授权。默认权限为 <strong>查看文档</strong>，授权后即可通过 Agent 检索访问本文档内容。
                            </p>
                        </div>
                        
                        <!-- 授权列表标题 + 添加按钮 -->
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <h3 class="text-sm font-bold text-slate-900">授权列表</h3>
                                <p class="text-xs text-slate-500 mt-0.5">共 {{ docPermissions.length }} 条授权</p>
                            </div>
                            <button @click="openAddPermModal"
                                class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                <i class="ph ph-plus text-sm"></i>
                                <span>添加授权</span>
                            </button>
                        </div>
                        
                        <!-- 权限表格 -->
                        <div v-if="docPermissions.length > 0" class="bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <table class="w-full text-sm">
                                <thead>
                                    <tr class="bg-slate-50 border-b border-slate-200">
                                        <th class="text-left px-4 py-3 text-xs font-bold text-slate-600">授权对象</th>
                                        <th class="text-left px-4 py-3 text-xs font-bold text-slate-600">权限</th>
                                        <th class="text-left px-4 py-3 text-xs font-bold text-slate-600">授权时间</th>
                                        <th class="text-right px-4 py-3 text-xs font-bold text-slate-600">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="perm in docPermissions" :key="perm.id"
                                        class="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                        <td class="px-4 py-3">
                                            <div class="flex items-center gap-2">
                                                <div class="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                                    <i class="ph ph-user text-sm text-indigo-600"></i>
                                                </div>
                                                <span class="text-sm text-slate-900 font-medium">{{ perm.subject }}</span>
                                            </div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <span class="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{{ perm.role }}</span>
                                        </td>
                                        <td class="px-4 py-3 text-xs text-slate-500">{{ perm.addedAt }}</td>
                                        <td class="px-4 py-3 text-right">
                                            <button @click="removePermission(perm.id)"
                                                class="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors">
                                                <i class="ph ph-trash text-sm"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <!-- 空状态 -->
                        <div v-else class="text-center py-16">
                            <div class="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <i class="ph ph-lock-open text-3xl text-slate-400"></i>
                            </div>
                            <p class="text-slate-500 text-sm font-medium">暂无授权</p>
                            <p class="text-slate-400 text-xs mt-1">点击「添加授权」为用户或角色授权访问</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 版本发布弹窗 -->
            <div v-if="showVersionPublish" @click="closeVersionPublish"
                class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                <div @click.stop class="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
                    <!-- 头部 -->
                    <div class="px-7 pt-7 pb-5 flex items-start justify-between">
                        <div>
                            <h3 class="text-xl font-bold text-slate-900 mb-0.5">发布新版本到对应环境</h3>
                        </div>
                        <button @click="closeVersionPublish"
                            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 mt-0.5">
                            <i class="ph ph-x text-lg"></i>
                        </button>
                    </div>
                    <!-- 内容 -->
                    <div class="px-7 pb-6 space-y-5">
                        <!-- 目标环境 -->
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-3">目标环境 <span class="text-red-500">*</span></label>
                            <div class="grid grid-cols-2 gap-3">
                                <!-- 预发环境 -->
                                <button @click="publishForm.environment = 'pre'"
                                    :class="['px-5 py-4 rounded-xl text-left transition-all border',
                                        publishForm.environment === 'pre'
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50']">
                                    <p :class="['text-sm font-semibold mb-1', publishForm.environment === 'pre' ? 'text-indigo-700' : 'text-slate-800']">预发环境</p>
                                    <p class="text-xs text-slate-400">发布后对预发生效</p>
                                </button>
                                <!-- 生产环境 -->
                                <button @click="publishForm.environment = 'online'"
                                    :class="['px-5 py-4 rounded-xl text-left transition-all border',
                                        publishForm.environment === 'online'
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50']">
                                    <p :class="['text-sm font-semibold mb-1', publishForm.environment === 'online' ? 'text-indigo-700' : 'text-slate-800']">生产环境</p>
                                    <p class="text-xs text-slate-400">发布后对线上生效</p>
                                </button>
                            </div>
                        </div>
                        <!-- 发布说明 -->
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">发布说明</label>
                            <textarea v-model="publishForm.note" rows="4"
                                class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-slate-50"
                                placeholder="描述本次发布的变更内容..."></textarea>
                        </div>
                    </div>
                    <!-- 底部按钮 -->
                    <div class="px-7 py-5 border-t border-slate-100 flex justify-end gap-3">
                        <button @click="closeVersionPublish"
                            class="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                            取消
                        </button>
                        <button @click="saveVersionPublish"
                            class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm shadow-indigo-200">
                            <i class="ph-fill ph-rocket-launch text-sm"></i>
                            确认发布
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- 添加授权弹窗 -->
            <div v-if="showAddPermModal" @click="closeAddPermModal"
                class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                <div @click.stop class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                    <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <i class="ph-fill ph-lock-key text-xl text-green-600"></i>
                            </div>
                            <h3 class="text-lg font-bold text-slate-900">添加授权</h3>
                        </div>
                        <button @click="closeAddPermModal"
                            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                            <i class="ph ph-x text-xl text-slate-600"></i>
                        </button>
                    </div>
                    <div class="p-6 space-y-4">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">授权对象 <span class="text-red-500">*</span></label>
                            <input v-model="addPermForm.subject" type="text"
                                class="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="输入用户名、邮箱或角色名称">
                        </div>
                        <div class="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-3">
                            <i class="ph ph-lock text-slate-500"></i>
                            <div>
                                <p class="text-xs font-bold text-slate-700">权限：查看文档</p>
                                <p class="text-xs text-slate-500">授权后可通过 Agent 检索访问本文档</p>
                            </div>
                        </div>
                    </div>
                    <div class="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                        <button @click="closeAddPermModal"
                            class="px-5 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-300 transition-colors">
                            取消
                        </button>
                        <button @click="saveAddPerm"
                            :disabled="!addPermForm.subject.trim() || isAddingPerm"
                            :class="['px-6 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2',
                                addPermForm.subject.trim() && !isAddingPerm
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed']">
                            <i v-if="isAddingPerm" class="ph ph-spinner animate-spin"></i>
                            <i v-else class="ph ph-check"></i>
                            {{ isAddingPerm ? '保存中...' : '确认授权' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- 历史版本弹窗 -->
            <div v-if="showHistoryModal" @click="closeHistoryModal"
                class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                <div @click.stop class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
                    <!-- 弹窗头部 -->
                    <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <i class="ph-fill ph-clock-counter-clockwise text-xl text-indigo-600"></i>
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-slate-900">版本历史</h3>
                                <p class="text-xs text-slate-500">{{ documentForm.name }}</p>
                            </div>
                        </div>
                        <button @click="closeHistoryModal" 
                            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                            <i class="ph ph-x text-xl text-slate-600"></i>
                        </button>
                    </div>
                    
                    <!-- 版本列表 -->
                    <div v-if="!showVersionDetail" class="flex-1 overflow-y-auto p-6">
                        <div class="space-y-3">
                            <div v-for="version in versionHistory" :key="version.id"
                                class="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all group">
                                <div class="flex items-start justify-between gap-4">
                                    <div class="flex items-start gap-3 flex-1">
                                        <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                            <span class="text-sm font-bold text-indigo-600">{{ version.editor.charAt(0) }}</span>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="flex items-center gap-2 mb-1">
                                                <span class="text-sm font-bold text-slate-900">{{ version.editor }}</span>
                                                <span class="text-xs text-slate-500">编辑了文档</span>
                                            </div>
                                            <div class="text-xs text-slate-500">
                                                <i class="ph ph-clock text-xs mr-1"></i>
                                                {{ version.timestamp }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex gap-2 flex-shrink-0">
                                        <button @click="viewVersion(version)"
                                            class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-indigo-300 transition-all">
                                            查看内容
                                        </button>
                                        <button @click="restoreVersion(version)"
                                            class="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-all">
                                            恢复此版本
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div v-if="versionHistory.length === 0" class="text-center py-12">
                            <i class="ph ph-clock-counter-clockwise text-4xl text-slate-300 mb-3 block"></i>
                            <p class="text-slate-500">暂无版本历史</p>
                        </div>
                    </div>
                    
                    <!-- 版本详情 -->
                    <div v-else class="flex-1 overflow-hidden flex flex-col">
                        <div class="px-6 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
                            <button @click="backToVersionList"
                                class="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
                                <i class="ph ph-arrow-left"></i>
                                返回列表
                            </button>
                            <div class="text-xs text-slate-500">
                                {{ selectedVersion.timestamp }} · {{ selectedVersion.editor }}
                            </div>
                        </div>
                        
                        <div class="flex-1 overflow-y-auto p-6">
                            <div class="bg-slate-50 border border-slate-200 rounded-xl p-6">
                                <h4 class="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                    <i class="ph ph-file-text"></i>
                                    历史版本内容
                                </h4>
                                <div v-html="selectedVersion.content"
                                    class="bg-white border border-slate-200 rounded-lg p-4 prose prose-sm max-w-none max-h-96 overflow-y-auto">
                                </div>
                            </div>
                        </div>
                        
                        <div class="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
                            <button @click="backToVersionList"
                                class="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm transition-colors">
                                取消
                            </button>
                            <button @click="restoreVersion(selectedVersion)"
                                class="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors font-medium">
                                恢复此版本
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 原文查看弹窗 -->
            <div v-if="showOriginalModal" @click="closeOriginalModal"
                class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                <div @click.stop class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden" style="height:85vh">
                    <!-- 弹窗头部 -->
                    <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                                :class="originalPreviewType === 'pdf' ? 'bg-red-100' : 'bg-blue-100'">
                                <i class="text-xl"
                                    :class="originalPreviewType === 'pdf' ? 'ph-fill ph-file-pdf text-red-600' : 'ph-fill ph-file-doc text-blue-600'"></i>
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-slate-900">查看原文</h3>
                                <p class="text-xs text-slate-500">{{ originalFileName }}</p>
                            </div>
                        </div>
                        <button @click="closeOriginalModal"
                            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                            <i class="ph ph-x text-xl text-slate-600"></i>
                        </button>
                    </div>

                    <!-- 预览区域 -->
                    <div class="flex-1 overflow-hidden bg-slate-100">
                        <!-- 有真实文件：PDF 用 iframe 直接预览 -->
                        <iframe v-if="originalPreviewUrl && originalPreviewType === 'pdf'"
                            :src="originalPreviewUrl"
                            class="w-full h-full border-0"
                            type="application/pdf">
                        </iframe>

                        <!-- 有真实文件：Word 无法内嵌，提示用户 -->
                        <div v-else-if="originalPreviewUrl && originalPreviewType === 'word'"
                            class="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-500">
                            <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                                <i class="ph-fill ph-file-doc text-3xl text-blue-600"></i>
                            </div>
                            <div class="text-center">
                                <p class="text-base font-medium text-slate-700 mb-1">{{ originalFileName }}</p>
                                <p class="text-sm text-slate-500 mb-4">Word 文件无法在浏览器内直接预览</p>
                                <a :href="originalPreviewUrl" :download="originalFileName"
                                    class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                    <i class="ph ph-download-simple"></i>
                                    下载文件
                                </a>
                            </div>
                        </div>

                        <!-- Mock 场景：无真实文件，展示占位预览 -->
                        <div v-else class="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-400">
                            <div class="w-16 h-16 rounded-2xl flex items-center justify-center"
                                :class="originalPreviewType === 'word' ? 'bg-blue-100' : 'bg-red-100'">
                                <i class="text-3xl"
                                    :class="originalPreviewType === 'word' ? 'ph-fill ph-file-doc text-blue-500' : 'ph-fill ph-file-pdf text-red-500'"></i>
                            </div>
                            <p class="text-base font-medium text-slate-600">{{ originalFileName }}</p>
                            <p class="text-sm">该文档为 Mock 数据，暂无真实文件可预览</p>
                        </div>
                    </div>

                    <!-- 弹窗底部 -->
                    <div class="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
                        <button @click="closeOriginalModal"
                            class="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-300 transition-colors font-medium">
                            关闭
                        </button>
                    </div>
                </div>
            </div>

            <!-- 从外部导入确认弹窗 -->
            <div v-if="showImportConfirmModal" @click="closeImportConfirm"
                class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                <div @click.stop class="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden">
                    <!-- 弹窗头部 -->
                    <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <i class="ph-fill ph-cloud-arrow-down text-xl text-indigo-600"></i>
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-slate-900">从外部导入</h3>
                                <p class="text-xs text-slate-500">导入后将覆盖现有文档内的内容</p>
                            </div>
                        </div>
                        <button @click="closeImportConfirm"
                            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                            <i class="ph ph-x text-xl text-slate-600"></i>
                        </button>
                    </div>
                    
                    <!-- 选择导入方式 -->
                    <div v-if="!showImportOnlinePanel && !showImportLocalPanel" class="p-6 space-y-3">
                        <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 mb-4">
                            <i class="ph ph-warning text-amber-600 mt-0.5 flex-shrink-0"></i>
                            <p class="text-xs text-amber-700 leading-relaxed">导入后将覆盖现有文档内的内容，请确认操作。</p>
                        </div>
                        <button @click="chooseImportOnline"
                            class="w-full flex items-center gap-4 p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-md transition-all group text-left">
                            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                                <i class="ph-fill ph-globe text-2xl text-blue-600"></i>
                            </div>
                            <div>
                                <p class="text-sm font-bold text-slate-900">从在线文档导入</p>
                                <p class="text-xs text-slate-500 mt-0.5">粘贴 Docs 文档链接，自动解析内容</p>
                            </div>
                            <i class="ph ph-arrow-right text-slate-400 ml-auto flex-shrink-0"></i>
                        </button>
                        <button @click="chooseImportLocal"
                            class="w-full flex items-center gap-4 p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-md transition-all group text-left">
                            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                                <i class="ph-fill ph-upload-simple text-2xl text-green-600"></i>
                            </div>
                            <div>
                                <p class="text-sm font-bold text-slate-900">从本地文件导入</p>
                                <p class="text-xs text-slate-500 mt-0.5">上传 Word 或 PDF 文件，自动转换为文档内容</p>
                            </div>
                            <i class="ph ph-arrow-right text-slate-400 ml-auto flex-shrink-0"></i>
                        </button>
                    </div>
                    
                    <!-- 在线文档导入面板 -->
                    <div v-if="showImportOnlinePanel" class="p-6 space-y-4">
                        <button @click="showImportOnlinePanel = false"
                            class="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors mb-2">
                            <i class="ph ph-arrow-left"></i>返回选择
                        </button>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-2">在线文档链接</label>
                            <input v-model="importOnlineUrl" type="url"
                                class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                placeholder="https://docs.corp.kuaishou.com/xxxx">
                        </div>
                        <div v-if="isImportingOnline" class="text-center py-6">
                            <div class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p class="text-sm text-slate-600">正在解析在线文档...</p>
                        </div>
                        <div class="flex justify-end gap-3 pt-2">
                            <button @click="closeImportConfirm"
                                class="px-5 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors">取消</button>
                            <button @click="doImportOnline"
                                :disabled="!importOnlineUrl.trim() || isImportingOnline"
                                :class="['px-6 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2',
                                    importOnlineUrl.trim() && !isImportingOnline
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed']">
                                <i class="ph ph-magic-wand"></i>确认导入
                            </button>
                        </div>
                    </div>
                    
                    <!-- 本地文件导入面板 -->
                    <div v-if="showImportLocalPanel" class="p-6 space-y-4">
                        <button @click="showImportLocalPanel = false"
                            class="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors mb-2">
                            <i class="ph ph-arrow-left"></i>返回选择
                        </button>
                        <div class="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:border-indigo-400 transition-colors">
                            <input type="file" @change="handleImportLocalFile"
                                accept=".doc,.docx,.pdf"
                                class="hidden" id="importFileInput">
                            <label for="importFileInput" class="cursor-pointer block">
                                <div class="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <i class="ph-fill ph-file-arrow-up text-3xl text-slate-400"></i>
                                </div>
                                <p class="text-base font-bold text-slate-900 mb-1">点击选择文件</p>
                                <p class="text-xs text-slate-500">支持 Word (.doc, .docx) 和 PDF (.pdf) 格式</p>
                            </label>
                        </div>
                        <div v-if="isImportingLocal" class="text-center py-4">
                            <div class="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p class="text-sm text-slate-600">正在解析本地文件...</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 重新同步弹窗 -->
            <div v-if="showResyncModal" @click="closeResyncModal"
                class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                <div @click.stop class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
                    <!-- 弹窗头部 -->
                    <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i class="ph-fill ph-arrows-clockwise text-xl text-purple-600"></i>
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-slate-900">
                                    {{ isOnlineImported ? '重新同步在线文档' : '重新同步本地文件' }}
                                </h3>
                                <p class="text-xs text-slate-500">更新文档内容</p>
                            </div>
                        </div>
                        <button @click="closeResyncModal" 
                            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                            <i class="ph ph-x text-xl text-slate-600"></i>
                        </button>
                    </div>
                    
                    <!-- 在线文档重新同步 -->
                    <div v-if="isOnlineImported" class="flex-1 overflow-y-auto p-6">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-2">在线文档链接</label>
                                <input v-model="resyncOnlineUrl" type="url" 
                                    class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                    placeholder="例如：https://docs.google.com/document/d/xxx">
                                <p class="mt-2 text-xs text-slate-500">已回显当前文档链接，可修改后重新解析</p>
                            </div>
                            
                            <div v-if="isResyncingOnline" class="text-center py-8">
                                <div class="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p class="text-sm text-slate-600">正在重新同步在线文档...</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 本地文件重新同步 -->
                    <div v-else class="flex-1 overflow-y-auto p-6">
                        <div class="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-purple-400 transition-colors">
                            <input type="file" @change="handleResyncLocalFile" 
                                accept=".doc,.docx,.pdf"
                                class="hidden" id="resyncFileInput">
                            
                            <label for="resyncFileInput" class="cursor-pointer block">
                                <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <i class="ph-fill ph-file-arrow-up text-3xl text-purple-600"></i>
                                </div>
                                <p class="text-lg font-bold text-slate-900 mb-2">点击重新上传文件</p>
                                <p class="text-sm text-slate-600 mb-4">支持 Word (.doc, .docx) 和 PDF (.pdf) 格式</p>
                            </label>
                        </div>
                        
                        <div v-if="isResyncingLocal" class="text-center py-8 mt-6">
                            <div class="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p class="text-sm text-slate-600">正在重新同步本地文件...</p>
                        </div>
                    </div>
                    
                    <!-- 弹窗底部 -->
                    <div class="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
                        <button @click="closeResyncModal"
                            class="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-300 transition-colors font-medium">
                            取消
                        </button>
                        <button v-if="isOnlineImported" @click="resyncOnlineDocument"
                            :disabled="!resyncOnlineUrl.trim() || isResyncingOnline"
                            :class="['px-6 py-2 rounded-lg text-sm font-medium transition-colors',
                                     resyncOnlineUrl.trim() && !isResyncingOnline
                                     ? 'bg-purple-600 text-white hover:bg-purple-700' 
                                     : 'bg-slate-300 text-slate-500 cursor-not-allowed']">
                            重新解析
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
};

// 注册到全局
window.App = window.App || {};
window.App.Components = window.App.Components || {};
window.App.Components.DetailDocument = DetailDocument;

// 导出组件
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DetailDocument;
}
