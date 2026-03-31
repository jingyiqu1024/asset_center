
window.App = window.App || {};
window.App.Components = window.App.Components || {};

/* 
// 暂时停用新版 API 接入逻辑，回退到上个版本
// Sub-component: Request Configuration
const ApiRequestConfig = { ... };

// Sub-component: Response Mapping Table
const ApiResponseMapping = { ... };
*/

window.App.Components.DetailDictionary = {
    name: 'DetailDictionary',
    props: ['node', 'dictionaries', 'globalTags'],

    data() {
        return {
            isEditing: false,
            // 编辑项
            editingItem: null,
            editingItemIndex: null,
            showManualCreateModal: false,
            // 字典项表单
            newItemForm: {
                id: '',
                code: '',
                label: '',
                description: '',
                status: 'enabled', // 'enabled' or 'disabled'
                parentId: '',
                parentInfo: null, // 父级信息 {id, code, label}
                isTree: false // 当前项是否为树状根节点或其子节点具有树状性质
            },

            activeTab: 'items', // 'items' or 'fields'

            // 新建枚举方式
            showCreateMethodDropdown: false,
            showManualTypeSelect: false, // 选择单排还是树状
            
            draggedItem: null,
            dragOverItem: null,

            // API配置相关
            showApiConfigModal: false,
            // 服务列表（mock 数据）
            availableServices: [
                {
                    id: 'service_hr_api',
                    name: 'HR 人力资源服务',
                    appKey: 'e2a1eb5f-6f3d-4d1f-92f5-02a7ed17f5a8',
                    appSecret: 'sk_hr_2024_abc123def456',
                    description: '人力资源相关API服务'
                },
                {
                    id: 'service_erp_api',
                    name: 'ERP 企业资源计划',
                    appKey: '7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e',
                    appSecret: 'sk_erp_2024_xyz789uvw012',
                    description: 'ERP系统集成API'
                },
                {
                    id: 'service_crm_api',
                    name: 'CRM 客户关系管理',
                    appKey: '3f4e5d6c-7b8a-9c0d-1e2f-3a4b5c6d7e8f',
                    appSecret: 'sk_crm_2024_mno345pqr678',
                    description: 'CRM客户数据API'
                },
                {
                    id: 'service_finance_api',
                    name: 'Finance 财务系统',
                    appKey: '9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d',
                    appSecret: 'sk_finance_2024_stu901vwx234',
                    description: '财务数据接口服务'
                },
                {
                    id: 'service_oa_api',
                    name: 'OA 办公自动化',
                    appKey: '5d6e7f8a-9b0c-1d2e-3f4a-5b6c7d8e9f0a',
                    appSecret: 'sk_oa_2024_ghi567jkl890',
                    description: 'OA办公流程API'
                }
            ],
            serviceSearchQuery: '',  // 服务搜索关键词
            selectedService: null,   // 选中的服务
            showServiceDropdown: false, // 显示服务下拉列表
            apiConfig: {
                appKey: '',
                appSecret: '',
                apiUrl: '',
                method: 'POST', // selectable
                requestTab: 'params', // 'params', 'headers', or 'body'
                params: [], // {key, value}
                headers: [
                    { key: 'Content-Type', value: 'application/json' }
                ],
                requestBody: '{"parameter_name":"parameter_value"}',
                response: null,
                loading: false,
                error: null,
                mapping: {
                    jsonPath: 'data',  // JSON Path 数据提取路径
                    codeField: '',
                    labelField: '',
                    descField: '',
                    // 树状结构字段
                    parentIdField: '',  // parent_id 字段
                    childrenField: ''   // children 字段
                }
            },


            // 关联字段 Mock
            referencedFields: [
                { id: 1, fieldName: 'level', tableName: 'employee_info', tableType: 'DATA_ASSET', type: 'STRING', description: '员工职级', env: 'online' },
                { id: 2, fieldName: 'level', tableName: 'employee_info', tableType: 'DATA_ASSET', type: 'STRING', description: '员工职级', env: 'pre' },
            ],

            // 字段查找相关
            showFieldSearchModal: false,
            fieldSearchQuery: '',
            selectedAsset: null,
            assetFields: [],
            selectedFieldsForLink: [],
            viewEnv: 'pre', // 'pre' or 'online'
            availableAssets: [
                {
                    id: 'data_202', name: 'ks.emp.leave', type: 'DATA_ASSET', fields: [
                        { name: 'leave_id', type: 'BIGINT', description: '请假ID' },
                        { name: 'emp_id', type: 'STRING', description: '员工ID' }
                    ]
                }
            ],
            // ==================== 标签管理 ====================
            resourceTags: this.node.tags || ['数据标准', '指标字典'],
            showAddTagInput: false,
            newTagName: '',

            // ==================== Toast 提示 ====================
            toastMessage: '',
            showToast: false
        };
    },
    computed: {
        dictionaryDetail() {
            if (this.dictionaries && this.node && this.dictionaries[this.node.id]) {
                return this.dictionaries[this.node.id];
            }
            return null;
        },
        currentVersionItems() {
            if (!this.dictionaryDetail) return [];
            return this.dictionaryDetail.enums || [];
        },
        // 判断当前展示的枚举是否有树状结构
        isTreeStructure() {
            // First check if explicitly set in the dictionary header
            if (this.dictionaryDetail && this.dictionaryDetail.isTree !== undefined) {
                return this.dictionaryDetail.isTree;
            }
            // Check type field (type === 'tree')
            if (this.dictionaryDetail && this.dictionaryDetail.type === 'tree') {
                return true;
            }
            // Fallback: check if any item has children
            const checkTree = (items) => {
                if (!items) return false;
                for (const item of items) {
                    if (item.children && item.children.length > 0) return true;
                }
                return false;
            };
            return checkTree(this.currentVersionItems);
        },
        flattenedItems() {
            const result = [];
            const flatten = (list, level = 0, parentId = null) => {
                if (!list || !list.length) return;
                list.forEach(item => {
                    result.push({ ...item, _level: level, _parentId: parentId });
                    if (item.children && item.children.length > 0) {
                        flatten(item.children, level + 1, item.id);
                    }
                });
            };
            flatten(this.currentVersionItems, 0, null);
            return result;
        },
        filteredSearchAssets() {
            if (!this.fieldSearchQuery) return this.availableAssets;
            const q = this.fieldSearchQuery.toLowerCase();
            return this.availableAssets.filter(a => a.name.toLowerCase().includes(q));
        },
        // 过滤服务列表（模糊搜索）
        filteredServices() {
            if (!this.serviceSearchQuery) return this.availableServices;
            const q = this.serviceSearchQuery.toLowerCase();
            return this.availableServices.filter(service => 
                service.name.toLowerCase().includes(q) || 
                service.description.toLowerCase().includes(q)
            );
        },
        // 生成枚举项 Code 的命名空间前缀
        codeNamespacePrefix() {
            if (!this.dictionaryDetail) return '';
            
            // 命名空间只包含字典的 code，不包含父节点 code
            let prefix = this.dictionaryDetail.code || this.dictionaryDetail.id || '';
            
            // 添加分隔符
            return prefix ? prefix + '.' : '';
        },
        // 获取可选的父级列表（树状结构使用）
        availableParents() {
            if (!this.isTreeStructure) return [];
            
            const result = [];
            const items = this.currentVersionItems || [];
            
            // 递归收集所有枚举项作为可选父级
            const collect = (list, level = 0) => {
                if (!list || !list.length) return;
                list.forEach(item => {
                    result.push({
                        id: item.id,
                        code: item.code,
                        label: item.label,
                        level: level,
                        indent: '　'.repeat(level) // 使用全角空格缩进
                    });
                    if (item.children && item.children.length > 0) {
                        collect(item.children, level + 1);
                    }
                });
            };
            
            collect(items);
            return result;
        }
    },
    methods: {
        handleDragStart(event, item) {
            this.draggedItem = item;
            event.dataTransfer.effectAllowed = 'move';
        },
        handleDragOver(event, item) {
            if (!this.draggedItem) return;
            // Only allow dropping on same parent level
            if (this.draggedItem._parentId === item._parentId) {
                event.preventDefault(); // allow drop
                this.dragOverItem = item;
            } else {
                event.dataTransfer.dropEffect = 'none';
            }
        },
        handleDrop(event, targetItem) {
            if (!this.draggedItem || this.draggedItem.id === targetItem.id) {
                this.draggedItem = null;
                this.dragOverItem = null;
                return;
            }
            if (this.draggedItem._parentId === targetItem._parentId) {
                const itemsList = this.findArrayByParentId(this.draggedItem._parentId);
                if (itemsList) {
                    const fromIndex = itemsList.findIndex(i => i.id === this.draggedItem.id);
                    const toIndex = itemsList.findIndex(i => i.id === targetItem.id);
                    if (fromIndex > -1 && toIndex > -1) {
                        const [movedItem] = itemsList.splice(fromIndex, 1);
                        itemsList.splice(toIndex, 0, movedItem);
                    }
                }
            }
            this.draggedItem = null;
            this.dragOverItem = null;
        },
        handleDragEnd() {
            this.draggedItem = null;
            this.dragOverItem = null;
        },
        findArrayByParentId(parentId) {
            const rootItems = this.ensureDraftVersion();
            if (parentId === null) return rootItems;
            
            let targetArray = null;
            const findParent = (list) => {
                if (!list || targetArray) return;
                for (const item of list) {
                    if (item.id === parentId) {
                        targetArray = item.children;
                        return;
                    }
                    if (item.children && item.children.length > 0) {
                        findParent(item.children);
                    }
                }
            };
            findParent(rootItems);
            return targetArray;
        },
        addTag() {
            if (this.newTagName.trim()) {
                const tag = this.newTagName.trim();
                if (!this.resourceTags.includes(tag)) {
                    this.resourceTags.push(tag);
                    if (!this.node.tags) this.node.tags = [];
                    if (!this.node.tags.includes(tag)) this.node.tags.push(tag);
                    
                    // 模拟全局同步
                    if (window.App && window.App.addGlobalTag) {
                        window.App.addGlobalTag(tag);
                    }
                }
                this.newTagName = '';
                this.showAddTagInput = false;
            }
        },
        // --- 通用辅助 ---
        setSyncMethod(method) {
            if (this.dictionaryDetail) {
                this.dictionaryDetail.syncMethod = method;
            }
        },
        switchViewEnv(env) {
            this.viewEnv = env;
            if (env === 'online' && this.onlineVersion) {
                this.selectedVersion = this.onlineVersion.version;
            } else if (env === 'pre' && this.preVersion) {
                this.selectedVersion = this.preVersion.version;
            }
        },
        // 核心逻辑：操作前确保处于“草稿”状态（无环境标签的最新版本）
        ensureDraftVersion() {
            if (!this.dictionaryDetail) return null;
            const currentVerStr = this.selectedVersion || this.dictionaryDetail.currentVersion;
            const currentVerData = this.dictionaryDetail.versions.find(v => v.version === currentVerStr);

            // 如果当前版本已有环境标签，则产生新版本
            if (currentVerData && currentVerData.environments && (currentVerData.environments.online || currentVerData.environments.pre)) {
                const vParts = currentVerStr.split('.');
                let last = parseInt(vParts[vParts.length - 1]);
                vParts[vParts.length - 1] = isNaN(last) ? '1' : (last + 1).toString();
                const newVerStr = vParts.join('.');

                const newVersion = {
                    version: newVerStr,
                    createdAt: new Date().toISOString().split('T')[0],
                    createdBy: 'admin',
                    enums: JSON.parse(JSON.stringify(currentVerData.enums || [])),
                    environments: {}
                };

                this.dictionaryDetail.versions.unshift(newVersion);
                this.dictionaryDetail.currentVersion = newVerStr;
                this.selectedVersion = newVerStr;
                return newVersion.enums;
            }
            return currentVerData ? currentVerData.enums : [];
        },
        copyToClipboard(text) {
            const el = document.createElement('textarea');
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            alert('已复制到剪贴板: ' + text);
        },
        shareLink() {
            const url = `${window.location.origin}${window.location.pathname}?type=dict&id=${this.node.id}`;
            this.copyToClipboard(url);
        },
        viewCode() {
            alert(`资源 ID: ${this.node.id}\n类型: DICTIONARY\n访问方式: API / SDK`);
        },

        // --- 枚举创建入口 ---
        toggleCreateMethodDropdown() {
            this.showCreateMethodDropdown = !this.showCreateMethodDropdown;
        },
        selectCreateMethod(method) {
            this.showCreateMethodDropdown = false;
            if (method === 'manual') {
                this.showManualTypeSelect = true; // 先选择结构
            } else if (method === 'api') {
                this.openApiConfigModal();
            }
        },
        selectManualType(type) {
            this.showManualTypeSelect = false;
            this.openManualCreateModal(type === 'tree');
        },

        // --- 手动新建/编辑 ---
        openManualCreateModal(isTree = false, parentId = '') {
            this.editingItemIndex = null;
            
            // 初始化表单，不预设父级（让用户自己选择）
            this.newItemForm = {
                id: '',
                code: '',
                label: '',
                description: '',
                status: 'enabled',
                parentId: '', // 初始为空，用户可以选择
                parentInfo: null,
                isTree: isTree
            };
            this.showManualCreateModal = true;
        },
        closeManualCreateModal() {
            this.showManualCreateModal = false;
            this.editingItemIndex = null;
        },
        saveItem() {
            if (!this.newItemForm.code || !this.newItemForm.label) {
                alert('请填写编码和枚举值');
                return;
            }

            const items = this.ensureDraftVersion();
            if (!items) return;

            const findAndReplace = (list, targetId, newData) => {
                for (let i = 0; i < list.length; i++) {
                    if (list[i].id === targetId) {
                        list[i] = { ...list[i], ...newData };
                        return true;
                    }
                    if (list[i].children && findAndReplace(list[i].children, targetId, newData)) return true;
                }
                return false;
            };

            const findAndPush = (list, parentId, newNode) => {
                if (!parentId) {
                    list.push(newNode);
                    return true;
                }
                for (let i = 0; i < list.length; i++) {
                    if (list[i].id === parentId) {
                        if (!list[i].children) list[i].children = [];
                        list[i].children.push(newNode);
                        return true;
                    }
                    if (list[i].children && findAndPush(list[i].children, parentId, newNode)) return true;
                }
                return false;
            };

            if (this.editingItemIndex !== null) {
                // 编辑
                findAndReplace(items, this.newItemForm.id, {
                    label: this.newItemForm.label,
                    description: this.newItemForm.description,
                    status: this.newItemForm.status
                });
            } else {
                // 新建：直接使用用户输入的 code（不添加命名空间前缀）
                const newNode = {
                    id: 'enum_' + Date.now(),
                    code: this.newItemForm.code, // 直接使用用户输入的 code
                    label: this.newItemForm.label,
                    description: this.newItemForm.description,
                    status: this.newItemForm.status || 'enabled',
                    children: []
                };
                findAndPush(items, this.newItemForm.parentId, newNode);
            }

            this.closeManualCreateModal();
        },
        editItem(item) {
            this.editingItemIndex = 999; // 标记正在编辑
            let parentId = item._parentId || item.parentId || '';
            let parentInfo = null;
            if (parentId) {
                const pItems = this.ensureDraftVersion();
                const findParent = (list) => {
                    if (!list || parentInfo) return;
                    for (const node of list) {
                        if (node.id === parentId) {
                            parentInfo = { code: node.code, label: node.label };
                            return;
                        }
                        if (node.children) findParent(node.children);
                    }
                };
                findParent(pItems);
            }
            this.newItemForm = {
                id: item.id,
                code: item.code,
                label: item.label,
                description: item.description,
                status: item.status || 'enabled',
                parentId: parentId,
                parentInfo: parentInfo,
                isTree: !!(item.children && item.children.length > 0)
            };
            this.showManualCreateModal = true;
        },
        confirmDeleteItem(item) {
            if (!confirm(`确定要删除枚举项 "${item.label}" (${item.code}) 吗？`)) return;

            const items = this.ensureDraftVersion();
            if (!items) return;

            const removeById = (list, id) => {
                const idx = list.findIndex(i => i.id === id);
                if (idx > -1) {
                    list.splice(idx, 1);
                    return true;
                }
                for (const i of list) {
                    if (i.children && removeById(i.children, id)) return true;
                }
                return false;
            };
            removeById(items, item.id);
        },
        addChildItem(parentItem) {
            this.openManualCreateModal(true, parentItem.id);
        },

        // --- API 配置 ---
        openApiConfigModal() {
            this.selectedService = null;
            this.serviceSearchQuery = '';
            this.showServiceDropdown = false;
            this.apiConfig.appKey = '';
            this.apiConfig.appSecret = '';
            this.apiConfig.apiUrl = '';
            this.apiConfig.method = 'POST';
            this.apiConfig.requestTab = 'params';
            this.apiConfig.params = [];
            this.apiConfig.headers = [{ key: 'Content-Type', value: 'application/json' }];
            this.apiConfig.requestBody = '{"parameter_name":"parameter_value"}';
            this.apiConfig.response = null;
            this.apiConfig.error = null;
            this.apiConfig.mapping = { 
                jsonPath: 'data',
                codeField: '', 
                labelField: '', 
                descField: '',
                parentIdField: '',
                childrenField: ''
            };
            this.showApiConfigModal = true;
        },
        closeApiConfigModal() {
            this.showApiConfigModal = false;
            this.showServiceDropdown = false;
        },
        // 选择服务
        selectService(service) {
            this.selectedService = service;
            this.apiConfig.appKey = service.appKey;
            this.apiConfig.appSecret = service.appSecret;
            this.showServiceDropdown = false;
            this.serviceSearchQuery = '';
        },
        // 切换服务下拉框显示
        toggleServiceDropdown() {
            this.showServiceDropdown = !this.showServiceDropdown;
        },
        // 清除服务选择
        clearServiceSelection() {
            this.selectedService = null;
            this.apiConfig.appKey = '';
            this.apiConfig.appSecret = '';
            this.serviceSearchQuery = '';
        },
        addParam() {
            this.apiConfig.params.push({ key: '', value: '' });
        },
        removeParam(index) {
            this.apiConfig.params.splice(index, 1);
        },
        addHeader() {
            this.apiConfig.headers.push({ key: '', value: '' });
        },
        removeHeader(index) {
            this.apiConfig.headers.splice(index, 1);
        },
        sendApiRequest() {
            if (!this.apiConfig.appKey || !this.apiConfig.appSecret || !this.apiConfig.apiUrl) {
                alert('请填写必要配置');
                return;
            }
            this.apiConfig.loading = true;
            this.apiConfig.response = null;
            this.apiConfig.error = null;
            this.apiConfig.mapping = { jsonPath: 'data', codeField: '', labelField: '', descField: '', parentIdField: '', childrenField: '' };
            setTimeout(() => {
                this.apiConfig.loading = false;
                this.apiConfig.response = {
                    code: 200,
                    data: [
                        { code: 'LV1', value: 'Junior', desc: 'Entry level' },
                        { code: 'LV2', value: 'Senior', desc: 'Experienced' }
                    ]
                };
                // Auto-guess mapping from first data item keys
                const firstItem = this.apiConfig.response.data && this.apiConfig.response.data[0];
                if (firstItem) {
                    const keys = Object.keys(firstItem);
                    this.apiConfig.mapping.codeField = keys[0] || '';
                    this.apiConfig.mapping.labelField = keys[1] || '';
                    this.apiConfig.mapping.descField = keys[2] || '';
                }
            }, 800);
        },
        saveApiConfig() {
            if (!this.apiConfig.response) return;

            const { jsonPath, codeField, labelField, descField, parentIdField, childrenField } = this.apiConfig.mapping;
            if (!codeField || !labelField) {
                alert('请先完成字段映射（至少需要映射 Code 和枚举值）');
                return;
            }

            // 使用 JSON Path 提取数据
            let extractedData = this.apiConfig.response;
            if (jsonPath && jsonPath.trim()) {
                const pathSegments = jsonPath.trim().split('.');
                for (const segment of pathSegments) {
                    if (extractedData && extractedData[segment] !== undefined) {
                        extractedData = extractedData[segment];
                    } else {
                        alert(`JSON Path 提取失败：路径 "${jsonPath}" 在响应数据中不存在`);
                        return;
                    }
                }
            }
            
            // 验证提取的数据是否为数组
            if (!Array.isArray(extractedData)) {
                alert('提取的数据不是数组格式，请检查 JSON Path 是否正确');
                return;
            }
            
            if (extractedData.length === 0) {
                alert('提取的数据为空数组');
                return;
            }

            const items = this.ensureDraftVersion();
            if (!items) return;

            let newEnums = [];
            
            // 检查是否使用树状结构映射
            if (childrenField) {
                // 使用 children 字段构建树状结构
                const buildTreeFromChildren = (dataList) => {
                    return dataList.map(item => {
                        const node = {
                            id: 'api_' + (item[codeField] || '') + '_' + Date.now() + '_' + Math.random(),
                            code: item[codeField] || '',
                            label: item[labelField] || '',
                            description: descField ? (item[descField] || '') : '',
                            status: item.status || 'enabled',
                            children: []
                        };
                        
                        // 递归处理子节点
                        if (item[childrenField] && Array.isArray(item[childrenField]) && item[childrenField].length > 0) {
                            node.children = buildTreeFromChildren(item[childrenField]);
                        }
                        
                        return node;
                    });
                };
                
                newEnums = buildTreeFromChildren(extractedData);
                
            } else if (parentIdField) {
                // 使用 parent_id 字段构建树状结构
                const buildTreeFromParentId = (dataList) => {
                    const idMap = {};
                    const rootNodes = [];
                    
                    // 第一遍：创建所有节点
                    dataList.forEach(item => {
                        const node = {
                            id: 'api_' + (item[codeField] || '') + '_' + Date.now() + '_' + Math.random(),
                            code: item[codeField] || '',
                            label: item[labelField] || '',
                            description: descField ? (item[descField] || '') : '',
                            status: item.status || 'enabled',
                            children: [],
                            _parentId: item[parentIdField],
                            _originalCode: item[codeField]
                        };
                        idMap[item[codeField]] = node;
                    });
                    
                    // 第二遍：建立父子关系
                    Object.values(idMap).forEach(node => {
                        if (node._parentId && idMap[node._parentId]) {
                            idMap[node._parentId].children.push(node);
                        } else {
                            rootNodes.push(node);
                        }
                    });
                    
                    // 清理临时字段
                    const cleanNode = (node) => {
                        delete node._parentId;
                        delete node._originalCode;
                        if (node.children) {
                            node.children.forEach(cleanNode);
                        }
                    };
                    rootNodes.forEach(cleanNode);
                    
                    return rootNodes;
                };
                
                newEnums = buildTreeFromParentId(extractedData);
                
            } else {
                // 平铺结构（单排字典）
                newEnums = extractedData.map(i => ({
                    id: 'api_' + (i[codeField] || '') + '_' + Date.now() + '_' + Math.random(),
                    code: i[codeField] || '',
                    label: i[labelField] || '',
                    description: descField ? (i[descField] || '') : '',
                    status: i.status || 'enabled',
                    children: []
                }));
            }

            items.push(...newEnums);
            this.closeApiConfigModal();
            
            // 统计导入的总数量（包括子节点）
            const countNodes = (nodes) => {
                let count = 0;
                nodes.forEach(node => {
                    count++;
                    if (node.children && node.children.length > 0) {
                        count += countNodes(node.children);
                    }
                });
                return count;
            };
            
            const totalCount = countNodes(newEnums);
            alert(`已成功导入 ${totalCount} 条数据${(parentIdField || childrenField) ? '（包含层级结构）' : ''}`);
        },
        copyResponse() {
            if (this.apiConfig.response) {
                this.copyToClipboard(JSON.stringify(this.apiConfig.response, null, 2));
            }
        },

        // --- 关联字段 ---
        openFieldSearchModal() {
            this.showFieldSearchModal = true;
        },
        selectAssetForLink(asset) {
            this.selectedAsset = asset;
            this.assetFields = asset.fields;
        },
        toggleFieldSelection(field) {
            const idx = this.selectedFieldsForLink.indexOf(field.name);
            if (idx > -1) this.selectedFieldsForLink.splice(idx, 1);
            else this.selectedFieldsForLink.push(field.name);
        },
        confirmFieldLink() {
            if (!this.selectedAsset) return;
            
            const targetTableName = this.selectedAsset.name;
            
            this.selectedFieldsForLink.forEach(fname => {
                this.referencedFields.push({
                    id: Date.now() + Math.random(),
                    fieldName: fname,
                    tableName: this.selectedAsset.name,
                    tableType: 'DATA_ASSET',
                    type: 'STRING',
                    description: '关联字段',
                    env: 'online'
                });
            });
            
            // 显示 toast 提示
            this.toastMessage = `已关联至${targetTableName}草稿，发布该表后正式生效。`;
            this.showToast = true;
            
            // 5秒后自动隐藏 toast
            setTimeout(() => {
                this.showToast = false;
            }, 5000);
            
            this.showFieldSearchModal = false;
            
            // 清空选择状态
            this.selectedAsset = null;
            this.selectedFieldsForLink = [];
        }
    },
    template: `
        <div class="h-full flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <!-- Unified Navigation & Actions Bar -->
            <div class="px-6 bg-white border-b border-slate-200 flex items-center justify-between flex-shrink-0 z-20">
                <div class="flex items-center gap-0">
                    <button @click="activeTab = 'items'" 
                        :class="['px-4 py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2', 
                            activeTab === 'items' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50']">
                        <i class="ph ph-list-dashes text-base"></i>
                        <span>枚举项</span>
                    </button>
                    <button @click="activeTab = 'fields'" 
                        :class="['px-4 py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2', 
                            activeTab === 'fields' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50']">
                        <i class="ph ph-brackets-curly text-base"></i>
                        <span>关联字段</span>
                    </button>
                </div>

                <div class="flex items-center gap-4">
                    <!-- Resource Tags -->
                    <div class="flex items-center gap-1.5 py-1">
                        <div v-for="tag in resourceTags" :key="tag" 
                            class="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-[10px] font-bold border border-slate-100 hover:border-indigo-200 hover:text-indigo-600 transition-colors cursor-default">
                            #{{ tag }}
                        </div>
                        <div class="relative flex items-center">
                            <button v-if="!showAddTagInput" @click="showAddTagInput = true" 
                                class="w-5 h-5 flex items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-400 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-all" title="显示标签">
                                <i class="ph ph-plus text-[10px]"></i>
                            </button>
                            <div v-else class="flex items-center gap-1 bg-white border border-indigo-200 rounded-lg px-2 py-1 shadow-xl absolute right-0 top-0 z-[60] w-48 animate-in slide-in-from-right-2 duration-200">
                                <i class="ph ph-tag text-indigo-400 text-xs"></i>
                                <input v-model="newTagName" @keyup.enter="addTag" list="global-dict-tags-new"
                                    class="w-full text-[10px] outline-none border-none p-0 focus:ring-0 font-medium" placeholder="新标签..." />
                                <datalist id="global-dict-tags-new">
                                    <option v-for="tag in globalTags" :key="tag" :value="tag"></option>
                                </datalist>
                                <button @click="addTag" class="text-indigo-600 hover:scale-110 transition-transform"><i class="ph-bold ph-check text-[10px]"></i></button>
                                <button @click="showAddTagInput = false" class="text-slate-400 hover:scale-110 transition-transform"><i class="ph-bold ph-x text-[10px]"></i></button>
                            </div>
                        </div>
                    </div>


                </div>
            </div>


            <!-- Content -->
            <div class="flex-1 overflow-auto bg-slate-50/50 flex flex-col">
                <!-- Initial Sync Method Selection -->
                <div v-if="dictionaryDetail && !dictionaryDetail.syncMethod" class="flex-1 flex flex-col items-center justify-center p-12">
                    <div class="max-w-4xl w-full grid grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-500">
                        <!-- Manual Card -->
                        <div @click="setSyncMethod('manual')" class="group relative bg-white p-8 rounded-3xl border-2 border-slate-100 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-100 transition-all cursor-pointer flex flex-col items-center text-center space-y-6">
                            <div class="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                <i class="ph-bold ph-pencil-line text-4xl"></i>
                            </div>
                            <div class="space-y-2">
                                <h3 class="text-xl font-black text-slate-900 tracking-tight">手动创建枚举</h3>
                                <p class="text-sm text-slate-500 leading-relaxed font-medium">自主定义枚举项名称与对应编码，支持树状层级扩展</p>
                            </div>
                            <div class="pt-4">
                                <span class="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-xs font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">立即开始</span>
                            </div>
                        </div>
                        <!-- API Card -->
                        <div @click="setSyncMethod('api')" class="group relative bg-white p-8 rounded-3xl border-2 border-slate-100 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-100 transition-all cursor-pointer flex flex-col items-center text-center space-y-6">
                            <div class="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                <i class="ph-bold ph-broadcast text-4xl"></i>
                            </div>
                            <div class="space-y-2">
                                <h3 class="text-xl font-black text-slate-900 tracking-tight">通过 API 导入</h3>
                                <p class="text-sm text-slate-500 leading-relaxed font-medium">配置外部业务接口，自动化拉取并导入远程枚举数据</p>
                            </div>
                            <div class="pt-4">
                                <span class="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-xs font-bold group-hover:bg-emerald-600 group-hover:text-white transition-all">配置连接</span>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Items/Fields Content -->
                <div v-else class="flex-1 overflow-auto p-6">
                    <!-- Items Content -->
                    <div v-if="activeTab === 'items'">
                        <!-- Description -->
                        <div class="mb-4">
                            <p class="text-sm text-slate-600">{{ isTreeStructure ? '支持层级结构的枚举项管理' : '用于扁平列表的枚举项管理' }}</p>
                        </div>

                        <!-- Action Bar -->
                        <div class="flex items-center justify-between mb-4">
                            <!-- API 模式下的自动同步提示 -->
                            <div v-if="dictionaryDetail.syncMethod === 'api'" class="flex items-center gap-1.5 text-xs text-slate-400">
                                <i class="ph ph-clock text-sm"></i>
                                <span>每周日 24:00 自动拉取最新字典</span>
                            </div>
                            <div v-else></div>

                            <div class="flex items-center gap-3">
                                <!-- Manual Mode Action (仅手动模式显示) -->
                                <button v-if="dictionaryDetail.syncMethod === 'manual'" 
                                    @click="openManualCreateModal(false)" 
                                    class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 font-bold">
                                    <i class="ph ph-plus-circle text-lg"></i>
                                    <span>新建枚举</span>
                                </button>
                                <!-- API Mode Actions (仅API模式显示) -->
                                <template v-if="dictionaryDetail.syncMethod === 'api'">
                                    <button @click="saveApiConfig" 
                                        class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2 font-bold">
                                        <i class="ph ph-arrows-clockwise text-base"></i>
                                        <span>手动拉取最新字典</span>
                                    </button>
                                    <button @click="openApiConfigModal" 
                                        class="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2 font-medium">
                                        <i class="ph ph-gear text-base"></i>
                                        <span>更新 API 配置</span>
                                    </button>
                                </template>
                            </div>
                        </div>

                        <!-- Table -->
                        <div class="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                            <table class="w-full text-sm text-left">
                                <thead class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                                    <tr>
                                        <th class="px-6 py-3 font-mono text-slate-500">Code</th>
                                        <th class="px-6 py-3 text-slate-500">枚举值</th>
                                        <th v-if="dictionaryDetail.syncMethod !== 'api'" class="px-6 py-3 text-center text-slate-500">状态</th>
                                        <th class="px-6 py-3 text-slate-500">描述</th>
                                        <th class="px-6 py-3 text-right text-slate-500">操作</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <tr v-if="flattenedItems.length === 0">
                                        <td colspan="5" class="px-6 py-12 text-center text-slate-400">
                                            <div class="flex flex-col items-center gap-2">
                                                <i class="ph ph-list-dashes text-3xl text-slate-300"></i>
                                                <p>暂无枚举项，点击上方按钮添加</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <template v-else>
                                        <tr v-for="item in flattenedItems" :key="item.id" 
                                            draggable="true"
                                            @dragstart="handleDragStart($event, item)"
                                            @dragover="handleDragOver($event, item)"
                                            @drop.prevent="handleDrop($event, item)"
                                            @dragend="handleDragEnd"
                                            :class="['transition-colors group', 
                                                     dragOverItem && dragOverItem.id === item.id ? 'bg-indigo-50 border-t-2 border-indigo-400 relative z-10' : 'hover:bg-slate-50/80',
                                                     draggedItem && draggedItem.id === item.id ? 'opacity-40 bg-slate-50' : '']">
                                            <td class="px-6 py-3 font-mono text-indigo-600 font-medium">
                                                <div class="flex items-center gap-1">
                                                    <i class="ph ph-dots-six-vertical text-slate-300 cursor-move hover:text-slate-500 text-lg mr-1 -ml-1"></i>
                                                    <i v-if="isTreeStructure && item.children && item.children.length" class="ph ph-caret-right text-xs text-slate-400"></i>
                                                    <span :style="{ paddingLeft: (item._level ? item._level * 20 : 0) + 'px' }">{{ item.code }}</span>
                                                </div>
                                            </td>
                                            <td class="px-6 py-3 text-slate-900 font-medium">{{ item.label }}</td>
                                            <td v-if="dictionaryDetail.syncMethod !== 'api'" class="px-6 py-3">
                                                <div class="flex justify-center">
                                                    <span v-if="item.status === 'disabled'" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                                                        <i class="ph ph-circle"></i> 停用
                                                    </span>
                                                    <span v-else class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                                                        <i class="ph-fill ph-check-circle"></i> 启用
                                                    </span>
                                                </div>
                                            </td>
                                            <td class="px-6 py-3 text-slate-500">{{ item.description || '-' }}</td>
                                            <td class="px-6 py-3 text-right">
                                                <div class="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                                                    <template v-if="dictionaryDetail.syncMethod === 'api'">
                                                        <button @click="editItem(item)" class="text-slate-400 hover:text-indigo-600" title="编辑描述">
                                                            <i class="ph ph-pencil-simple text-lg"></i>
                                                        </button>
                                                    </template>
                                                    <template v-else>
                                                        <button v-if="isTreeStructure" @click="addChildItem(item)" class="text-slate-400 hover:text-emerald-600" title="添加子项">
                                                            <i class="ph ph-plus-circle text-lg"></i>
                                                        </button>
                                                        <button @click="editItem(item)" class="text-slate-400 hover:text-indigo-600" title="编辑">
                                                            <i class="ph ph-pencil-simple text-lg"></i>
                                                        </button>
                                                        <button @click="confirmDeleteItem(item)" class="text-slate-400 hover:text-red-600" title="删除">
                                                            <i class="ph ph-trash text-lg"></i>
                                                        </button>
                                                    </template>
                                                </div>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Fields Content -->
                    <div v-if="activeTab === 'fields'">
                        <!-- Action Bar -->
                        <div class="flex justify-between items-center mb-4">
                            <p class="text-sm text-slate-600">已关联如下系统字段，字典变更将自动同步</p>
                            <button @click="openFieldSearchModal" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 font-bold">
                                <i class="ph ph-plus-circle"></i> 新增关联字段
                            </button>
                        </div>

                         <div class="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                            <table class="w-full text-sm text-left">
                                <thead class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                                    <tr>
                                        <th class="px-6 py-3">字段名称</th>
                                        <th class="px-6 py-3">所属表/资产</th>
                                        <th class="px-6 py-3">字段类型</th>
                                        <th class="px-6 py-3">字段描述</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <tr v-for="field in referencedFields" :key="field.id" class="hover:bg-slate-50/80 transition-colors">
                                        <td class="px-6 py-3 font-mono text-indigo-600 font-medium">{{ field.fieldName }}</td>
                                        <td class="px-6 py-3 text-slate-700">
                                            <div class="flex items-center gap-2">
                                                <i class="ph-fill ph-database text-slate-400"></i>
                                                {{ field.tableName }}
                                                <span v-if="field.env === 'online'" class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-100 text-emerald-700 border border-emerald-200">ONLINE</span>
                                                <span v-else-if="field.env === 'pre'" class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-700 border border-amber-200">PRE</span>
                                            </div>
                                        </td>
                                        <td class="px-6 py-3">
                                            <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-mono border border-slate-200">{{ field.type }}</span>
                                        </td>
                                        <td class="px-6 py-3 text-slate-500">{{ field.description }}</td>
                                    </tr>
                                </tbody>
                            </table>
                         </div>
                    </div>
                </div>
            </div>

            <!-- Manual Type Select Modal -->
            <div v-if="showManualTypeSelect" class="fixed inset-0 bg-black/40 z-[65] flex items-center justify-center backdrop-blur-sm" @click.self="showManualTypeSelect = false">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden transform transition-all border border-slate-100">
                    <div class="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <h3 class="text-base font-bold text-slate-800 tracking-tight">选择新建结构</h3>
                        <button @click="showManualTypeSelect = false" class="text-slate-400 hover:text-slate-600 transition-colors">
                            <i class="ph ph-x text-xl"></i>
                        </button>
                    </div>
                    <div class="p-6 grid grid-cols-1 gap-4">
                        <button @click="selectManualType('flat')" 
                            class="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group text-left">
                            <div class="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <i class="ph ph-list-numbers text-xl"></i>
                            </div>
                            <div>
                                <div class="text-sm font-bold text-slate-700">单排结构</div>
                                <div class="text-[11px] text-slate-500 mt-0.5">简单的 K-V 扁平列表</div>
                            </div>
                        </button>
                        <button @click="selectManualType('tree')" 
                            class="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group text-left">
                            <div class="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <i class="ph ph-tree-structure text-xl"></i>
                            </div>
                            <div>
                                <div class="text-sm font-bold text-slate-700">树状结构</div>
                                <div class="text-[11px] text-slate-500 mt-0.5">支持无限层级的嵌套结构</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Field Search Modal -->
            <div v-if="showFieldSearchModal" class="fixed inset-0 bg-black/30 z-[60] flex items-center justify-center font-sans" @click.self="showFieldSearchModal = false">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] mx-4 overflow-hidden flex flex-col">
                    <!-- Header -->
                    <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                        <div>
                            <h3 class="text-lg font-bold text-slate-900">关联系统字段</h3>
                            <p class="text-xs text-slate-500 mt-0.5">搜索并选择已注册的表，支持多字段批量关联</p>
                        </div>
                        <button @click="showFieldSearchModal = false" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <i class="ph ph-x text-lg text-slate-400"></i>
                        </button>
                    </div>
                    
                    <div class="flex-1 overflow-hidden flex">
                        <!-- Left: Asset Search -->
                        <div class="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
                            <div class="p-4 border-b border-slate-100 bg-white">
                                <div class="relative">
                                    <i class="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                    <input v-model="fieldSearchQuery" type="text" 
                                        class="w-full pl-9 pr-3 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                                        placeholder="检索表名称..." />
                                </div>
                            </div>
                            <div class="flex-1 overflow-y-auto p-2 space-y-1">
                                <div v-if="filteredSearchAssets.length === 0" class="py-12 text-center">
                                    <i class="ph ph-database text-3xl text-slate-200 mb-2"></i>
                                    <p class="text-xs text-slate-400">请输入关键字搜索</p>
                                </div>
                                <button v-for="asset in filteredSearchAssets" :key="asset.id"
                                    @click="selectAssetForLink(asset)"
                                    :class="['w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group', 
                                        selectedAsset?.id === asset.id ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'hover:bg-white hover:shadow-sm text-slate-600']">
                                    <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', selectedAsset?.id === asset.id ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-400 group-hover:border-indigo-200 group-hover:text-indigo-500']">
                                        <i class="ph-fill ph-database text-base"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="text-sm font-bold truncate">{{ asset.name }}</div>
                                        <div class="text-[10px] opacity-60 uppercase tracking-tighter">{{ asset.type }}</div>
                                    </div>
                                    <i v-if="selectedAsset?.id === asset.id" class="ph ph-caret-right text-indigo-400"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Right: Field Selection -->
                        <div class="flex-1 flex flex-col bg-white">
                            <div v-if="!selectedAsset" class="flex-1 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                                <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <i class="ph ph-arrow-left text-3xl text-slate-200"></i>
                                </div>
                                <h4 class="text-slate-900 font-bold mb-1">请先从左侧选择表</h4>
                                <p class="text-sm max-w-xs">选择表后，右侧将展示该表的所有字段供您勾选关联</p>
                            </div>
                            
                            <template v-else>
                                <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <span class="text-sm font-bold text-slate-900">选择待关联字段</span>
                                        <span class="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold">
                                            {{ selectedFieldsForLink.length }} 已选
                                        </span>
                                    </div>
                                    <div class="text-[10px] text-slate-400 uppercase font-mono tracking-widest">
                                        {{ assetFields.length }} TOTAL FIELDS
                                    </div>
                                </div>
                                
                                <div class="flex-1 overflow-y-auto">
                                    <table class="w-full text-left text-sm border-separate border-spacing-0">
                                        <thead class="sticky top-0 bg-white/95 backdrop-blur-sm z-10 shadow-sm shadow-slate-100/50">
                                            <tr>
                                                <th class="pl-6 pr-3 py-3 w-10"></th>
                                                <th class="px-3 py-3 font-bold text-slate-500 text-[10px] uppercase tracking-wider">字段名称</th>
                                                <th class="px-3 py-3 font-bold text-slate-500 text-[10px] uppercase tracking-wider">类型</th>
                                                <th class="px-3 py-3 font-bold text-slate-500 text-[10px] uppercase tracking-wider">描述</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-slate-50">
                                            <tr v-for="field in assetFields" :key="field.name" 
                                                @click="toggleFieldSelection(field)"
                                                :class="['group cursor-pointer transition-colors', selectedFieldsForLink.includes(field.name) ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50']">
                                                <td class="pl-6 pr-3 py-3">
                                                    <div :class="['w-5 h-5 rounded border transition-all flex items-center justify-center', 
                                                        selectedFieldsForLink.includes(field.name) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white group-hover:border-indigo-400']">
                                                        <i v-if="selectedFieldsForLink.includes(field.name)" class="ph ph-check text-xs font-bold"></i>
                                                    </div>
                                                </td>
                                                <td class="px-3 py-3 font-mono font-bold text-slate-900 text-xs">{{ field.name }}</td>
                                                <td class="px-3 py-3 text-xs">
                                                    <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-mono border border-slate-200">{{ field.type }}</span>
                                                </td>
                                                <td class="px-3 py-3 text-xs text-slate-500 italic">{{ field.description || '-' }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </template>
                        </div>
                    </div>
                    
                    <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div class="text-xs text-slate-500">
                             <span v-if="selectedAsset">当前选中: <span class="font-bold text-indigo-600">{{ selectedAsset.name }}</span></span>
                        </div>
                        <div class="flex items-center gap-3">
                            <button @click="showFieldSearchModal = false" 
                                class="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-bold transition-colors">取消</button>
                            <button @click="confirmFieldLink" 
                                :disabled="!selectedAsset || selectedFieldsForLink.length === 0"
                                class="px-8 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm font-bold shadow-md shadow-indigo-100 disabled:opacity-50 disabled:shadow-none transition-all">
                                确认关联 ({{ selectedFieldsForLink.length }})
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Manual Create Enum Modal -->
            <div v-if="showManualCreateModal" class="fixed inset-0 bg-black/30 z-[60] flex items-center justify-center" @click.self="closeManualCreateModal">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                    <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                        <h3 class="text-base font-semibold text-slate-900">
                            {{ dictionaryDetail.syncMethod === 'api' ? '编辑描述' : (editingItemIndex !== null ? '编辑枚举项' : '手动新建枚举') }}
                        </h3>
                        <button @click="closeManualCreateModal" class="text-slate-400 hover:text-slate-600">
                            <i class="ph ph-x text-lg"></i>
                        </button>
                    </div>
                    <div class="p-6 space-y-4">
                        <!-- 父级选择器（仅树状结构显示） -->
                        <div v-if="isTreeStructure && editingItemIndex === null">
                            <label class="block text-sm font-medium text-slate-700 mb-1">所属父级</label>
                            <select v-model="newItemForm.parentId" 
                                class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                <option value="">无（作为根级别）</option>
                                <option v-for="parent in availableParents" :key="parent.id" :value="parent.id">
                                    {{ parent.indent }}{{ parent.label }} ({{ parent.code }})
                                </option>
                            </select>
                            <p class="text-xs text-slate-400 mt-1">
                                <i class="ph ph-info text-xs"></i> 选择父级后，新枚举将作为其子项；不选则作为根级别
                            </p>
                        </div>
                        
                        <!-- 原有的父级信息显示（编辑时） -->
                        <div v-if="newItemForm.parentInfo && editingItemIndex !== null" class="p-2.5 bg-slate-50 rounded-lg border border-slate-200 mb-2 flex items-center gap-2">
                            <span class="text-xs text-slate-500">父级枚举:</span>
                            <span class="text-xs font-bold text-slate-800">{{ newItemForm.parentInfo.label }}</span>
                            <span class="text-[10px] font-mono text-slate-400 bg-white border border-slate-100 px-1.5 py-0.5 rounded">{{ newItemForm.parentInfo.code }}</span>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Code <span v-if="dictionaryDetail.syncMethod !== 'api'" class="text-red-500">*</span></label>
                            <input v-model="newItemForm.code" 
                                :readonly="editingItemIndex !== null || dictionaryDetail.syncMethod === 'api'"
                                :class="['w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono', (editingItemIndex !== null || dictionaryDetail.syncMethod === 'api') ? 'bg-slate-50 cursor-not-allowed text-slate-400' : '']" 
                                placeholder="MY_ENUM_CODE" />
                            <p v-if="editingItemIndex !== null" class="text-xs text-slate-500 mt-1">导入或自动写入的Code不可修改</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">枚举值 <span v-if="dictionaryDetail.syncMethod !== 'api'" class="text-red-500">*</span></label>
                            <input v-model="newItemForm.label" 
                                :readonly="dictionaryDetail.syncMethod === 'api'"
                                :class="['w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent', dictionaryDetail.syncMethod === 'api' ? 'bg-slate-50 cursor-not-allowed text-slate-400' : '']" 
                                placeholder="显示名称" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">描述</label>
                            <textarea v-model="newItemForm.description" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none" rows="3" placeholder="描述信息"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">状态</label>
                            <div class="flex gap-4">
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="radio" v-model="newItemForm.status" value="enabled" class="hidden" />
                                    <div :class="['w-4 h-4 rounded-full border flex items-center justify-center transition-all', newItemForm.status === 'enabled' ? 'border-emerald-600' : 'border-slate-300']">
                                        <div v-show="newItemForm.status === 'enabled'" class="w-2 h-2 rounded-full bg-emerald-600"></div>
                                    </div>
                                    <span :class="['text-sm font-medium transition-colors', newItemForm.status === 'enabled' ? 'text-emerald-700' : 'text-slate-500']">启用</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="radio" v-model="newItemForm.status" value="disabled" class="hidden" />
                                    <div :class="['w-4 h-4 rounded-full border flex items-center justify-center transition-all', newItemForm.status === 'disabled' ? 'border-amber-600' : 'border-slate-300']">
                                        <div v-show="newItemForm.status === 'disabled'" class="w-2 h-2 rounded-full bg-amber-600"></div>
                                    </div>
                                    <span :class="['text-sm font-medium transition-colors', newItemForm.status === 'disabled' ? 'text-amber-700' : 'text-slate-500']">停用</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
                        <button @click="closeManualCreateModal" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">取消</button>
                        <button @click="saveItem" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm shadow-sm hover:bg-indigo-700">
                            {{ editingItemIndex !== null ? '保存修改' : '确认添加' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- API Config Modal -->
            <div v-if="showApiConfigModal" class="fixed inset-0 bg-black/30 z-[60] flex items-center justify-center" @click.self="closeApiConfigModal">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[85vh] mx-4 overflow-hidden flex flex-col">
                    <!-- Header -->
                    <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-cyan-50">
                        <div>
                            <h3 class="text-lg font-semibold text-slate-900">API 配置</h3>
                            <p class="text-xs text-slate-500 mt-1">通过API接口获取枚举数据</p>
                        </div>
                        <button @click="closeApiConfigModal" class="text-slate-400 hover:text-slate-600">
                            <i class="ph ph-x text-xl"></i>
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 overflow-y-auto p-6 space-y-6">
                        <!-- Top: Service Selection -->
                        <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                            <label class="block text-sm font-medium text-slate-700 mb-2">选择服务 <span class="text-red-500">*</span></label>
                            
                            <!-- 服务选择器 -->
                            <div class="relative">
                                <!-- 选中服务显示 / 搜索输入框 -->
                                <div v-if="!selectedService" class="relative">
                                    <input v-model="serviceSearchQuery" 
                                        @focus="showServiceDropdown = true"
                                        @input="showServiceDropdown = true"
                                        type="text" 
                                        class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none pr-10" 
                                        placeholder="搜索服务名称或描述..." />
                                    <i class="ph ph-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                                </div>
                                
                                <!-- 已选中服务显示 -->
                                <div v-else class="flex items-center justify-between px-4 py-2.5 bg-white border border-indigo-300 rounded-lg">
                                    <div class="flex items-center gap-3">
                                        <i class="ph ph-check-circle text-emerald-600 text-lg"></i>
                                        <div>
                                            <div class="text-sm font-bold text-slate-800">{{ selectedService.name }}</div>
                                            <div class="text-xs text-slate-500">{{ selectedService.description }}</div>
                                        </div>
                                    </div>
                                    <button @click="clearServiceSelection" 
                                        class="text-slate-400 hover:text-red-600 transition-colors">
                                        <i class="ph ph-x text-lg"></i>
                                    </button>
                                </div>
                                
                                <!-- 服务下拉列表 -->
                                <div v-if="showServiceDropdown && !selectedService" 
                                    class="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                                    <div v-if="filteredServices.length === 0" class="px-4 py-8 text-center text-slate-400 text-sm">
                                        <i class="ph ph-magnifying-glass text-2xl mb-2"></i>
                                        <p>未找到匹配的服务</p>
                                    </div>
                                    <div v-else>
                                        <button v-for="service in filteredServices" :key="service.id"
                                            @click="selectService(service)"
                                            class="w-full px-4 py-3 hover:bg-indigo-50 transition-colors text-left border-b border-slate-100 last:border-0">
                                            <div class="font-bold text-sm text-slate-800 mb-1">{{ service.name }}</div>
                                            <div class="text-xs text-slate-500 mb-2">{{ service.description }}</div>
                                            <div class="flex items-center gap-2 text-xs">
                                                <span class="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-mono">{{ service.appKey.substring(0, 20) }}...</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <p class="text-xs text-slate-400 mt-2">
                                <i class="ph ph-info text-xs"></i> 选择服务后将自动填充认证信息
                            </p>
                        </div>

                        <!-- Config: Method & URL -->
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">API 路径 <span class="text-red-500">*</span></label>
                            <div class="flex gap-3">
                                <select v-model="apiConfig.method" class="w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold bg-white text-indigo-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                    <option value="PUT">PUT</option>
                                </select>
                                <input v-model="apiConfig.apiUrl" type="text" 
                                    class="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" 
                                    placeholder="如 /mdata/v1/persons/base" />
                                <button @click="sendApiRequest" 
                                    :disabled="apiConfig.loading"
                                    class="px-8 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    <i v-if="!apiConfig.loading" class="ph ph-paper-plane-tilt"></i>
                                    <i v-else class="ph ph-spinner animate-spin"></i>
                                    {{ apiConfig.loading ? '发送中...' : '发送请求' }}
                                </button>
                            </div>
                            <p class="mt-2 text-xs text-slate-400">将调用OpenAPI生产环境下的接口</p>
                        </div>

                        <!-- Request Data -->
                        <div class="border border-slate-200 rounded-xl overflow-hidden bg-white">
                            <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                <h4 class="text-sm font-bold text-slate-800">请求数据 Request</h4>
                            </div>
                            <div class="flex border-b border-slate-100 px-2 pt-1 h-10 bg-slate-50/50">
                                <button @click="apiConfig.requestTab = 'params'" 
                                    :class="['px-6 text-sm font-medium border-b-2 transition-all h-full outline-none', apiConfig.requestTab === 'params' ? 'border-indigo-600 text-indigo-600 font-bold bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100']">
                                    Params <span v-if="apiConfig.params.length" class="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px]">{{ apiConfig.params.length }}</span>
                                </button>
                                <button @click="apiConfig.requestTab = 'headers'" 
                                    :class="['px-6 text-sm font-medium border-b-2 transition-all h-full outline-none', apiConfig.requestTab === 'headers' ? 'border-indigo-600 text-indigo-600 font-bold bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100']">
                                    Headers <span v-if="apiConfig.headers.length" class="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px]">{{ apiConfig.headers.length }}</span>
                                </button>
                                <button @click="apiConfig.requestTab = 'body'" 
                                    :class="['px-6 text-sm font-medium border-b-2 transition-all h-full outline-none', apiConfig.requestTab === 'body' ? 'border-indigo-600 text-indigo-600 font-bold bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100']">
                                    Body <span class="text-[10px] text-slate-400 font-normal ml-1">(请求体)</span>
                                </button>
                            </div>

                            <div class="p-4 bg-white min-h-[160px]">
                                <!-- Params -->
                                <div v-if="apiConfig.requestTab === 'params'" class="space-y-3">
                                    <div class="grid grid-cols-[1fr,1fr,40px] gap-2 items-center text-[11px] font-bold text-slate-400 px-1 uppercase tracking-wider bg-slate-50 py-1.5 rounded">
                                        <div class="pl-2">Query Param Key</div>
                                        <div class="pl-2">Value</div>
                                        <div></div>
                                    </div>
                                    <div class="max-h-[200px] overflow-y-auto space-y-2 pr-1">
                                        <div v-for="(param, index) in apiConfig.params" :key="index" class="grid grid-cols-[1fr,1fr,40px] gap-2 items-center">
                                            <input v-model="param.key" type="text" placeholder="Key" 
                                                class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all hover:border-indigo-300" />
                                            <input v-model="param.value" type="text" placeholder="Value" 
                                                class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all hover:border-indigo-300" />
                                            <button @click="removeParam(index)" class="flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors w-8 h-8 rounded-full hover:bg-red-50">
                                                <i class="ph ph-trash text-lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <button @click="addParam" class="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors px-2 py-1.5 rounded hover:bg-indigo-50 mt-2">
                                        <i class="ph ph-plus-circle text-lg"></i>
                                        添加 Query 参数
                                    </button>
                                </div>

                                <!-- Headers -->
                                <div v-if="apiConfig.requestTab === 'headers'" class="space-y-3">
                                    <div class="grid grid-cols-[1fr,1fr,40px] gap-2 items-center text-[11px] font-bold text-slate-400 px-1 uppercase tracking-wider bg-slate-50 py-1.5 rounded">
                                        <div class="pl-2">Header Key</div>
                                        <div class="pl-2">Value</div>
                                        <div></div>
                                    </div>
                                    <div class="max-h-[200px] overflow-y-auto space-y-2 pr-1">
                                        <div v-for="(header, index) in apiConfig.headers" :key="index" class="grid grid-cols-[1fr,1fr,40px] gap-2 items-center">
                                            <input v-model="header.key" type="text" placeholder="e.g. Content-Type" 
                                                class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all hover:border-indigo-300" />
                                            <input v-model="header.value" type="text" placeholder="Value" 
                                                class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all hover:border-indigo-300" />
                                            <button @click="removeHeader(index)" class="flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors w-8 h-8 rounded-full hover:bg-red-50">
                                                <i class="ph ph-trash text-lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <button @click="addHeader" class="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors px-2 py-1.5 rounded hover:bg-indigo-50 mt-2">
                                        <i class="ph ph-plus-circle text-lg"></i>
                                        添加 Header
                                    </button>
                                </div>

                                <!-- Body -->
                                <div v-if="apiConfig.requestTab === 'body'" class="h-full">
                                    <textarea v-model="apiConfig.requestBody" rows="6"
                                        class="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y bg-slate-50 hover:bg-white outline-none transition-all"
                                        placeholder='{"parameter_name":"parameter_value"}'></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Response Preview -->
                        <div class="border border-slate-200 rounded-xl overflow-hidden bg-white">
                            <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                <h4 class="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <i class="ph ph-code text-base text-emerald-600"></i>
                                    返回数据 Response
                                </h4>
                                <button v-if="apiConfig.response" @click="copyResponse" 
                                    class="text-xs font-bold px-3 py-1.5 bg-white border border-slate-200 rounded text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all flex items-center gap-1.5 shadow-sm">
                                    <i class="ph ph-copy"></i>
                                    复制数据
                                </button>
                            </div>
                            
                            <div class="bg-slate-900 min-h-[250px] max-h-[400px] overflow-auto relative">
                                <div v-if="!apiConfig.response && !apiConfig.error && !apiConfig.loading" class="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-3">
                                    <i class="ph ph-terminal-window text-4xl opacity-50"></i>
                                    <span class="text-sm font-medium">配置请求参数并点击「发送请求」获取响应数据</span>
                                </div>
                                <div v-else-if="apiConfig.loading" class="absolute inset-0 flex flex-col items-center justify-center text-indigo-400 gap-3">
                                    <i class="ph ph-spinner-gap animate-spin text-4xl"></i>
                                    <span class="text-sm font-medium animate-pulse">请求执行中...</span>
                                </div>
                                
                                <div v-else class="p-5 font-mono text-sm leading-relaxed">
                                    <pre v-if="apiConfig.response" class="text-emerald-400">{{ JSON.stringify(apiConfig.response, null, 2) }}</pre>
                                    <div v-if="apiConfig.error" class="text-rose-400 font-bold flex gap-2"><i class="ph ph-warning-circle text-lg"></i> <span>请求失败: {{ apiConfig.error }}</span></div>
                                </div>
                            </div>
                        </div>

                        <!-- Field Mapping -->
                        <div v-if="apiConfig.response && apiConfig.response.data && apiConfig.response.data.length" class="border border-indigo-200 rounded-xl overflow-hidden bg-white">
                            <div class="px-4 py-3 bg-indigo-50 border-b border-indigo-100 flex items-center gap-2">
                                <i class="ph ph-arrows-left-right text-indigo-600"></i>
                                <h4 class="text-sm font-bold text-indigo-800">字段映射 Field Mapping</h4>
                                <span class="text-xs text-indigo-400 ml-1">将接口返回的字段对应到字典结构</span>
                            </div>
                            <div class="p-5">
                                <!-- JSON Path 数据提取路径 -->
                                <div class="mb-5 pb-5 border-b border-slate-200">
                                    <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                                        <i class="ph ph-path text-indigo-600"></i>
                                        数据提取路径 JSON Path
                                    </label>
                                    <input v-model="apiConfig.mapping.jsonPath" type="text" 
                                        class="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none bg-white hover:border-indigo-300 transition-colors" 
                                        placeholder="data 或 result.items（留空表示根级数组）" />
                                    <div class="mt-2 flex items-start gap-2 text-xs text-slate-500">
                                        <i class="ph ph-info text-sm flex-shrink-0 mt-0.5"></i>
                                        <div>
                                            <p class="mb-1">指定从响应中提取数组数据的路径，例如：</p>
                                            <ul class="space-y-0.5 ml-4 list-disc">
                                                <li><code class="px-1 py-0.5 bg-slate-100 rounded text-[10px]">data</code> → 提取 <code class="px-1 py-0.5 bg-slate-100 rounded text-[10px]">response.data</code></li>
                                                <li><code class="px-1 py-0.5 bg-slate-100 rounded text-[10px]">result.items</code> → 提取 <code class="px-1 py-0.5 bg-slate-100 rounded text-[10px]">response.result.items</code></li>
                                                <li><code class="px-1 py-0.5 bg-slate-100 rounded text-[10px]">留空</code> → 响应本身就是数组</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- 基础字段映射 -->
                                <div class="grid grid-cols-3 gap-4">
                                    <!-- Code Field -->
                                    <div>
                                        <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Code <span class="text-red-500">*</span></label>
                                        <div class="relative">
                                            <select v-model="apiConfig.mapping.codeField"
                                                class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none bg-white appearance-none cursor-pointer hover:border-indigo-300 transition-colors">
                                                <option value="">-- 选择字段 --</option>
                                                <option v-for="key in Object.keys(apiConfig.response.data[0])" :key="key" :value="key">{{ key }}</option>
                                            </select>
                                            <i class="ph ph-caret-down absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                                        </div>
                                        <p class="text-[10px] text-slate-400 mt-1">枚举的唯一标识符</p>
                                    </div>
                                    <!-- Label Field -->
                                    <div>
                                        <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">枚举值 <span class="text-red-500">*</span></label>
                                        <div class="relative">
                                            <select v-model="apiConfig.mapping.labelField"
                                                class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none bg-white appearance-none cursor-pointer hover:border-indigo-300 transition-colors">
                                                <option value="">-- 选择字段 --</option>
                                                <option v-for="key in Object.keys(apiConfig.response.data[0])" :key="key" :value="key">{{ key }}</option>
                                            </select>
                                            <i class="ph ph-caret-down absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                                        </div>
                                        <p class="text-[10px] text-slate-400 mt-1">枚举的显示名称</p>
                                    </div>
                                    <!-- Desc Field -->
                                    <div>
                                        <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">描述 <span class="text-slate-300">(可选)</span></label>
                                        <div class="relative">
                                            <select v-model="apiConfig.mapping.descField"
                                                class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none bg-white appearance-none cursor-pointer hover:border-indigo-300 transition-colors">
                                                <option value="">-- 不映射 --</option>
                                                <option v-for="key in Object.keys(apiConfig.response.data[0])" :key="key" :value="key">{{ key }}</option>
                                            </select>
                                            <i class="ph ph-caret-down absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                                        </div>
                                        <p class="text-[10px] text-slate-400 mt-1">补充说明信息</p>
                                    </div>
                                </div>
                                
                                <!-- 树状结构字段映射（仅在树状字典时显示） -->
                                <div v-if="isTreeStructure" class="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-200">
                                    <div class="col-span-2">
                                        <div class="flex items-center gap-2 mb-2">
                                            <i class="ph ph-tree-structure text-amber-600 text-base"></i>
                                            <label class="text-xs font-bold text-amber-700 uppercase tracking-wider">树状结构字段</label>
                                            <span class="text-[10px] text-amber-500">(二选一)</span>
                                        </div>
                                        <p class="text-[10px] text-slate-400 mb-3">
                                            <i class="ph ph-info text-xs"></i> 选择 parent_id 或 children 字段来表示层级关系
                                        </p>
                                    </div>
                                    
                                    <!-- Parent ID Field -->
                                    <div>
                                        <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Parent ID <span class="text-slate-300">(可选)</span></label>
                                        <div class="relative">
                                            <select v-model="apiConfig.mapping.parentIdField"
                                                class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:border-amber-400 outline-none bg-white appearance-none cursor-pointer hover:border-amber-300 transition-colors">
                                                <option value="">-- 不映射 --</option>
                                                <option v-for="key in Object.keys(apiConfig.response.data[0])" :key="key" :value="key">{{ key }}</option>
                                            </select>
                                            <i class="ph ph-caret-down absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                                        </div>
                                        <p class="text-[10px] text-slate-400 mt-1">父节点的标识符</p>
                                    </div>
                                    
                                    <!-- Children Field -->
                                    <div>
                                        <label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Children <span class="text-slate-300">(可选)</span></label>
                                        <div class="relative">
                                            <select v-model="apiConfig.mapping.childrenField"
                                                class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:border-amber-400 outline-none bg-white appearance-none cursor-pointer hover:border-amber-300 transition-colors">
                                                <option value="">-- 不映射 --</option>
                                                <option v-for="key in Object.keys(apiConfig.response.data[0])" :key="key" :value="key">{{ key }}</option>
                                            </select>
                                            <i class="ph ph-caret-down absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                                        </div>
                                        <p class="text-[10px] text-slate-400 mt-1">子节点数组字段</p>
                                    </div>
                                </div>
                            </div>
                                <!-- Preview Row -->
                                <div v-if="apiConfig.mapping.codeField && apiConfig.mapping.labelField" class="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">映射预览（前3条数据）</p>
                                    <div class="space-y-1.5">
                                        <div v-for="(item, i) in apiConfig.response.data.slice(0,3)" :key="i"
                                            class="flex items-center gap-3 text-xs">
                                            <span class="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded min-w-[80px] truncate">{{ item[apiConfig.mapping.codeField] }}</span>
                                            <i class="ph ph-arrow-right text-slate-300 flex-shrink-0"></i>
                                            <span class="text-slate-700 font-semibold min-w-[80px] truncate">{{ item[apiConfig.mapping.labelField] }}</span>
                                            <span v-if="apiConfig.mapping.descField" class="text-slate-400 truncate">{{ item[apiConfig.mapping.descField] }}</span>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="w-full flex-shrink-0 px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
                        <button @click="closeApiConfigModal" 
                            class="px-5 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors">
                            取消
                        </button>
                        <button @click="saveApiConfig" 
                            :disabled="!apiConfig.response"
                            class="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                            <i class="ph ph-check-circle"></i>
                            保存并更新至字典
                        </button>
                    </div>
                </div>
            </div>

            <!-- Toast 提示 -->
            <transition name="fade">
                <div v-if="showToast" 
                    class="fixed top-20 right-6 px-4 py-3 rounded-lg shadow-2xl text-sm font-medium flex items-start gap-3 border z-[100] bg-green-50 text-green-800 border-green-200 max-w-md animate-in slide-in-from-right-4 duration-300">
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

        </div>
    `
};
