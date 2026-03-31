(function () {
    // 1. Init Namespace
    window.App = window.App || {};

    // 2. Mock Data
    const catalog = [
        {
            id: "root_all",
            name: "全部",
            type: "CATALOG",
            isOpen: true,
            children: [
                {
                    id: "root_common",
                    name: "公共资源库",
                    type: "CATALOG",
                    isOpen: true,
                    children: [
                        { id: "wiki_common_101", name: "开发环境配置指南", type: "RESOURCE", resourceType: "DOCUMENT" },
                        { id: "data_500_common", name: "office_address_book", chineseName: "各办事处地址簿", description: "员工休假记录视图，按日分区，数据来源 raw.emp_leave。", type: "RESOURCE", resourceType: "DATA_ASSET" },
                        { id: "data_upload_mock", name: "emp_allowance_2024q4", chineseName: "2024Q4员工津贴明细", description: "通过本地文件上传，支持对字段描述、治理标签进行编辑。", type: "RESOURCE", resourceType: "DATA_ASSET", sourceType: "EXCEL" },
                        {
                            id: "cat_utils",
                            name: "通用工具函数",
                            type: "CATALOG",
                            isOpen: false,
                            children: [
                                { id: "func_logger", name: "system_logger_v2", type: "RESOURCE", resourceType: "FUNCTION" }
                            ]
                        }
                    ]
                },
                {
                    id: "root_hr",
                    name: "HR 人力资源域",
                    type: "CATALOG",
                    isOpen: true,
                    children: [
                        { id: "wiki_hr_101", name: "2024 员工手册", type: "RESOURCE", resourceType: "DOCUMENT" },
                        { id: "dict_02", name: "Employee_Levels", type: "RESOURCE", resourceType: "DICTIONARY" },
                        { id: "dict_03", name: "Gender_Codes", type: "RESOURCE", resourceType: "DICTIONARY" },
                        { id: "skill_data_analysis", name: "数据分析", type: "RESOURCE", resourceType: "SKILL" },
                        {
                            id: "cat_hr_workflows",
                            name: "审批流程",
                            type: "CATALOG",
                            isOpen: true,
                            children: [
                                { id: "data_202", name: "ks.emp.leave", chineseName: "员工休假记录表", description: "员工休假记录视图，按日分区，数据来源 raw.emp_leave。", type: "RESOURCE", resourceType: "DATA_ASSET" },
                                { id: "func_305", name: "submit_leave_request", type: "RESOURCE", resourceType: "FUNCTION" }
                            ]
                        }
                    ]
                },
                {
                    id: "root_sre",
                    name: "SRE 运维域",
                    type: "CATALOG",
                    isOpen: false,
                    children: [
                        { id: "wiki_sre_101", name: "SRE 运维手册 v2", type: "RESOURCE", resourceType: "DOCUMENT" },
                        { id: "card_01", name: "集群健康状态组件", type: "RESOURCE", resourceType: "PAGE_CARD" },
                        { id: "dict_01", name: "K8s_Error_Codes", type: "RESOURCE", resourceType: "DICTIONARY" },
                        { id: "func_88", name: "restart_k8s_pod", type: "RESOURCE", resourceType: "FUNCTION" }
                    ]
                }
            ]
        }
    ];

    const resourceTypeMap = {
        'DOCUMENT': '文档',
        'DATA_ASSET': '结构化数据',
        'FUNCTION': '函数',
        'PAGE_CARD': '页面卡片',
        'SKILL': 'SKILLS',
        'DICTIONARY': '字典',
        'TAG_COLLECTION': 'Tags 集合',
        'CATALOG': '文件夹'
    };

    // 3. Utils
    const getNodeIcon = (node) => {
        if (node.type === 'CATALOG') return 'ph-folder-open';
        switch (node.resourceType) {
            case 'DOCUMENT': return 'ph-file-text';
            case 'DATA_ASSET': return 'ph-database';
            case 'FUNCTION': return 'ph-code';
            case 'PAGE_CARD': return 'ph-layout';
            case 'SKILL': return 'ph-lightning';
            case 'DICTIONARY': return 'ph-list-bullets';
            case 'TAG_COLLECTION': return 'ph-tags';
            default: return 'ph-file';
        }
    };

    const getColor = (node) => {
        if (node.type === 'CATALOG') return 'text-yellow-500';
        switch (node.resourceType) {
            case 'DOCUMENT': return 'text-orange-600';
            case 'DATA_ASSET': return 'text-blue-600';
            case 'FUNCTION': return 'text-purple-600';
            case 'PAGE_CARD': return 'text-pink-600';
            case 'SKILL': return 'text-emerald-600';
            case 'DICTIONARY': return 'text-cyan-600';
            case 'TAG_COLLECTION': return 'text-amber-600';
            default: return 'text-slate-600';
        }
    };

    const getBgColor = (node) => {
        if (node.type === 'CATALOG') return 'bg-yellow-50 border-yellow-100';
        switch (node.resourceType) {
            case 'DOCUMENT': return 'bg-orange-50 border-orange-100';
            case 'DATA_ASSET': return 'bg-blue-50 border-blue-100';
            case 'FUNCTION': return 'bg-purple-50 border-purple-100';
            case 'PAGE_CARD': return 'bg-pink-50 border-pink-100';
            case 'SKILL': return 'bg-emerald-50 border-emerald-100';
            case 'DICTIONARY': return 'bg-cyan-50 border-cyan-100';
            case 'TAG_COLLECTION': return 'bg-amber-50 border-amber-100';
            default: return 'bg-slate-50 border-slate-100';
        }
    };

    const getTypeLabel = (node) => {
        if (node.type === 'CATALOG') return '文件夹';
        return resourceTypeMap[node.resourceType] || node.resourceType;
    };

    // 4. Components
    // TreeItem 组件
    const TreeItem = {
        name: 'TreeItem',
        template: window.AppTemplates.TreeItem,
        props: {
            node: Object,
            depth: { type: Number, default: 0 },
            selectedId: String
        },
        emits: ['select', 'toggle'],
        setup(props, { emit }) {
            const isOpen = Vue.computed(() => props.node.isOpen);
            const isSelected = Vue.computed(() => props.selectedId === props.node.id);
            const nodeIcon = Vue.computed(() => getNodeIcon(props.node));
            const iconColor = Vue.computed(() => {
                if (props.node.type === 'CATALOG') return 'text-slate-500 group-hover:text-slate-300';
                return getColor(props.node);
            });
            const toggle = () => {
                if (props.node.type === 'CATALOG') props.node.isOpen = !props.node.isOpen;
            };
            const handleClick = () => emit('select', props.node);
            return { isOpen, isSelected, nodeIcon, iconColor, toggle, handleClick };
        }
    };

    // DetailWiki 组件 - 已移至独立文件 js/components/DetailWiki.js
    // const DetailWiki = {
    //     name: 'DetailWiki',
    //     props: ['node'],
    //     template: window.AppTemplates.DetailWiki
    // };

    // FieldEditModal 和 PermissionRuleEditModal 组件在此处应该已定义
    // 这些是从前面代码中保留的

    // 字段编辑弹层组件
    const FieldEditModal = {
        name: 'FieldEditModal',
        props: {
            visible: Boolean,
            editingForm: Object,
            editingFieldIndex: Number,
            schemaFields: Array,
            governedTagTree: Array,
            showTagTreeDropdown: Boolean,
            tagTreeExpanded: Object,
            dictionaries: Object
        },
        data() {
            return {
                showDictDropdown: false,
                dictSearchQuery: ''
            };
        },
        emits: ['close', 'save', 'update:showTagTreeDropdown', 'toggleTagTreeNode', 'selectTagFromTree', 'navigateToDict', 'update-encryption-init'],
        computed: {
            filteredDictionaries() {
                const dicts = Object.values(this.dictionaries || {});
                const query = this.dictSearchQuery.trim().toLowerCase();
                if (!query) return dicts;
                return dicts.filter(d =>
                    d.name.toLowerCase().includes(query) ||
                    (d.description && d.description.toLowerCase().includes(query))
                );
            }
        },
        methods: {
            selectDict(dict) {
                this.editingForm.linked_dict = dict ? dict.name : null;
                this.showDictDropdown = false;
                this.dictSearchQuery = '';
            },
            getTagShortName(fullPath) {
                if (!fullPath) return '';
                const parts = fullPath.split(':/');
                if (parts.length > 1) {
                    return parts[1].split('/').pop();
                }
                return fullPath.split('/').pop();
            },
            hasLinkedDict(tagPath) {
                if (!tagPath) return false;
                for (const node of this.governedTagTree) {
                    if (node.fullPath === tagPath && node.linkedDict) return true;
                    if (node.children) {
                        for (const child of node.children) {
                            if (child.fullPath === tagPath && child.linkedDict) return true;
                        }
                    }
                }
                return false;
            },
            getLinkedDict(tagPath) {
                if (!tagPath) return null;
                for (const node of this.governedTagTree) {
                    if (node.fullPath === tagPath) return node.linkedDict;
                    if (node.children) {
                        for (const child of node.children) {
                            if (child.fullPath === tagPath) return child.linkedDict;
                        }
                    }
                }
                return null;
            }
        },
        template: window.AppTemplates.FieldEditModal
    };

    // 权限规则编辑弹层组件
    const PermissionRuleEditModal = {
        name: 'PermissionRuleEditModal',
        props: {
            visible: Boolean,
            editingRule: Object,
            editingIndex: Number,
            authRules: Array,
            schemaFields: Array,
            showAudienceDropdown: Boolean,
            isGlobal: {
                type: Boolean,
                default: false
            },
            availableTags: {
                type: Array,
                default: () => []
            },
            globalRules: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                selectedTag: '',
                showGlobalDropdown: false
            };
        },
        computed: {
            fieldOptions() {
                // 如果是全局规则，使用标签；否则使用字段
                return this.isGlobal ? this.availableTags : (this.schemaFields || []).map(f => f.name);
            }
        },
        methods: {
            selectGlobalRule(rule) {
                this.editingRule.globalRuleRef = rule.name;

                // 自动生成标签与字段的映射
                // 尝试根据字段的 governed_tag 匹配全局规则的 tags
                const mappings = {};
                if (rule.tags && Array.isArray(rule.tags)) {
                    rule.tags.forEach(tag => {
                        // 简单匹配逻辑：查看 schemaFields 中是否有字段的 governed_tag 包含此 tag
                        // 实际匹配可能需要更复杂的路径匹配
                        const matchedField = this.schemaFields.find(f => f.governed_tag && f.governed_tag.includes(tag));
                        mappings[tag] = matchedField ? matchedField.name : '';
                    });
                }
                // 使用 Vue.set 或重新赋值对象以确保响应式（Vue 3 中直接赋值即可，Vue 2 需要注意）
                // 这里假设环境是 Vue 3 (const { ref } = Vue)
                this.editingRule.tagFieldMappings = mappings;

                this.showGlobalDropdown = false;
            }
        },
        emits: ['close', 'save', 'delete', 'update:showAudienceDropdown', 'selectAudience', 'addRowFilter', 'removeRowFilter', 'toggleColumnField'],
        template: window.AppTemplates.PermissionRuleEditModal
    };

    const DetailData = {
        name: 'DetailData',
        props: ['node', 'dictionaries', 'eligibleCatalogs', 'topLevelCatalogName', 'globalTags'],
        template: window.AppTemplates.DetailData,
        data() {
            return {
                showCatalogDropdown: false,
                dataActiveTab: 'schema',
                tableStatistics: `总行数: 1,250,000\n字段数: 6`,
                governedTagTree: [
                    {
                        name: 'PII 个人信息',
                        fullPath: '/Tags 治理标签/PII 个人信息:/',
                        children: [
                            { name: '姓名', fullPath: '/Tags 治理标签/PII 个人信息:/姓名', linkedDict: null, children: [] },
                            { name: '电话', fullPath: '/Tags 治理标签/PII 个人信息:/电话', linkedDict: null, children: [] },
                            { name: '邮箱', fullPath: '/Tags 治理标签/PII 个人信息:/邮箱', linkedDict: null, children: [] },
                            { name: '身份证', fullPath: '/Tags 治理标签/PII 个人信息:/身份证', linkedDict: null, children: [] }
                        ]
                    },
                    {
                        name: '业务分类',
                        fullPath: '/Tags 治理标签/业务分类:/',
                        children: [
                            { name: '部门', fullPath: '/Tags 治理标签/业务分类:/部门', linkedDict: '/字典/标准字典:/部门编码', children: [] },
                            { name: '职级', fullPath: '/Tags 治理标签/业务分类:/职级', linkedDict: '/字典/标准字典:/员工职级', children: [] }
                        ]
                    }
                ],
                schemaFields: [
                    { name: 'id', type: 'BIGINT', description: '主键', governed_tag: '/Tags 治理标签/PII 个人信息:/姓名', is_partition: false, is_encrypted: false },
                    { name: 'name', type: 'VARCHAR(128)', description: '姓名', governed_tag: '/Tags 治理标签/PII 个人信息:/姓名', is_partition: false, is_encrypted: true },
                    { name: 'department', type: 'VARCHAR(64)', description: '部门', governed_tag: '/Tags 治理标签/业务分类:/部门', linked_dict: 'Employee_Levels', is_partition: false, is_encrypted: false }
                ],
                activeAuthEnv: 'pre',
                authRulesPre: [
                    {
                        name: '部门数据隔离',
                        targetAudience: { type: 'role', value: 'HRBP' },
                        ruleSource: 'custom',
                        globalRuleRef: null,
                        rowFilters: [{ field: 'department_id', operator: 'IN', value: 'visiting_user.as_hrbp.department_ids', valueType: 'env_var' }],
                        conditionLogic: '',
                        columnVisibility: { mode: 'all', fields: [] }
                    }
                ],
                authRulesOnline: [
                    {
                        name: '生产环境规则',
                        targetAudience: { type: 'role', value: '管理者' },
                        ruleSource: 'custom',
                        globalRuleRef: null,
                        rowFilters: [],
                        conditionLogic: '',
                        columnVisibility: { mode: 'all', fields: [] }
                    }
                ],
                showAuthRuleEdit: false,
                editingAuthRuleIndex: null,
                editingAuthRule: null,
                showAudienceDropdown: false,
                showTableDescEdit: false,
                tableDescForm: '',
                showFieldEdit: false,
                editingFieldIndex: null,
                editingForm: null,
                hoverPartitionIndex: null,
                showTagTreeDropdown: false,
                tagTreeExpanded: {},
                showVersionDropdown: false,
                selectedDropdownVersion: null,
                showVersionHistory: false,
                currentVersion: { version: '1.0.1', environments: { online: null, pre: null, test: null } },
                versionHistory: [
                    {
                        version: '1.0.0',
                        environments: { online: '1.0.0', pre: null, test: null },
                        createdBy: '张嘉怡',
                        createdAt: '2026/3/26 20:46:18',
                        changeLog: '支持版本环境标签持久化展示，优化字段渲染逻辑，修复部分边界问题。',
                        isLatest: false
                    }
                ],
                showVersionPublish: false,
                publishForm: { environment: 'test', note: '' },
                showDdlEdit: false,
                ddlEditForm: { name: '', sql: '', parentId: '', targetCatalogName: '' },
                globalRules: [
                    { name: '通用 PII 字段脱敏', description: '屏蔽所有被标记为 PII 的字段' },
                    { name: '财务数据限制', description: '仅财务中心人员可见' }
                ],
                sqlPreviewResult: null,
                partitionInfo: { partition_field: 'dt', partition_format: 'yyyyMMdd', partition_mode: 'incremental' },
                ddlStatement: ``,
                previewColumns: [],
                previewRows: [],
                // 新增标签相关
                showResourceTagInput: false,
                newResourceTagName: ''
            };
        },
        computed: {
            authRules() {
                return this.activeAuthEnv === 'online' ? this.authRulesOnline : this.authRulesPre;
            },
            tableDescription() {
                return this.node ? this.node.description : '';
            }
        },
        created() {
            if (this.node && this.node.id === 'data_upload_mock') {
                this.tableDescription = '2024年第四季度员工各类津贴明细汇总，包含餐补、交通补贴等。';
                this.tableStatistics = '总行数: 3,420\n字段数: 5';
                this.schemaFields = [
                    { name: 'emp_id', type: 'VARCHAR(20)', description: '员工编号', governed_tag: null, is_partition: false, is_encrypted: false, fieldStatistics: '非空值: 3,420 (100.0%)\n唯一值: 1,200' },
                    { name: 'emp_name', type: 'VARCHAR(128)', description: '姓名', governed_tag: '/Tags 治理标签/PII 个人信息:/姓名', is_partition: false, is_encrypted: true, fieldStatistics: '非空值: 3,420 (100.0%)\n唯一值: 1,200' },
                    { name: 'allowance_type', type: 'VARCHAR(32)', description: '津贴类型', governed_tag: null, is_partition: false, is_encrypted: false, fieldStatistics: '餐饮补贴, 交通补贴, 住房通讯' },
                    { name: 'amount', type: 'DECIMAL(10,2)', description: '金额', governed_tag: '/Tags 治理标签/财务:/支出', is_partition: false, is_encrypted: false, fieldStatistics: '平均值: 540.00' },
                    { name: 'pay_date', type: 'DATE', description: '发放日期', governed_tag: null, is_partition: false, is_encrypted: false, fieldStatistics: '2024-10-01 ~ 2024-12-31' }
                ];
                this.ddlStatement = '';
            }
        },
        methods: {
            handleAddNewResourceTag() {
                if (this.newResourceTagName.trim()) {
                    const tag = this.newResourceTagName.trim();
                    if (!this.node.tags) {
                        this.node.tags = ['基础数据', '结构化'];
                    }
                    if (!this.node.tags.includes(tag)) {
                        this.node.tags.push(tag);
                    }
                    // 同步到全局
                    if (window.App && window.App.addGlobalTag) {
                        window.App.addGlobalTag(tag);
                    }
                    this.newResourceTagName = '';
                    this.showResourceTagInput = false;
                }
            },
            openDdlEdit() {
                // 查找父节点
                const findParent = (root, nodeId) => {
                    if (!root.children) return null;
                    for (const child of root.children) {
                        if (child.id === nodeId) return root;
                        if (child.type === 'CATALOG') {
                            const found = findParent(child, nodeId);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const root = this.$root.catalogTree[0]; // 访问根 App 的数据
                const parent = findParent(root, this.node.id);

                this.ddlEditForm = {
                    name: this.node.name,
                    chineseName: this.node.chineseName || '',
                    description: this.node.description || '',
                    sql: this.ddlStatement,
                    parentId: parent ? parent.id : '',
                    targetCatalogName: parent ? parent.name : ''
                };
                this.sqlPreviewResult = null;
                this.showDdlEdit = true;
            },
            selectDdlCatalog(cat) {
                this.ddlEditForm.parentId = cat.id;
                this.ddlEditForm.targetCatalogName = cat.name;
                this.showCatalogDropdown = false;
            },
            runSqlPreview() {
                // 模拟查询
                this.sqlPreviewResult = {
                    columns: ['id', 'name', 'department', 'status', 'joined_at'],
                    rows: [
                        ['E001', 'Alice Smith', 'Engineering', 'Active', '2023-01-15'],
                        ['E002', 'Bob Jones', 'HR', 'Active', '2023-02-20']
                    ]
                };
            },
            saveDdlEdit() {
                // 更新 SQL, 中文名 和 描述 (英文名不可修改)
                this.node.chineseName = this.ddlEditForm.chineseName;
                this.node.description = this.ddlEditForm.description;
                this.ddlStatement = this.ddlEditForm.sql;

                // 处理移动逻辑 (复用全局逻辑，这里通过派发事件或直接操作)
                const root = this.$root.catalogTree[0];
                const findParent = (root, nodeId) => {
                    if (!root.children) return null;
                    for (const child of root.children) {
                        if (child.id === nodeId) return root;
                        if (child.type === 'CATALOG') {
                            const found = findParent(child, nodeId);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const currentParent = findParent(root, this.node.id);
                if (currentParent && currentParent.id !== this.ddlEditForm.parentId) {
                    // 从旧父节点移除
                    const index = currentParent.children.findIndex(c => c.id === this.node.id);
                    if (index > -1) {
                        currentParent.children.splice(index, 1);
                    }
                    // 加入新父节点
                    const findNodeById = (nodes, id) => {
                        for (const n of nodes) {
                            if (n.id === id) return n;
                            if (n.children) {
                                const found = findNodeById(n.children, id);
                                if (found) return found;
                            }
                        }
                        return null;
                    };
                    const newParent = findNodeById([root], this.ddlEditForm.parentId);
                    if (newParent) {
                        if (!newParent.children) newParent.children = [];
                        newParent.children.push(this.node);
                    }
                }

                this.showDdlEdit = false;
                alert('修改已保存');
            },
            copyToClipboard(text) {
                const el = document.createElement('textarea');
                el.value = text;
                document.body.appendChild(el);
                el.select();
                try {
                    document.execCommand('copy');
                    alert('已复制到剪贴板');
                } catch (err) {
                    console.error('Copy failed', err);
                }
                document.body.removeChild(el);
            },
            findTagInTree(tagPath, nodes = null) {
                if (!tagPath) return null;
                if (!nodes) nodes = this.governedTagTree;

                // 遍历所有节点和子节点，查找匹配 fullPath 的 tag
                for (const node of nodes) {
                    if (node.fullPath === tagPath) {
                        return node;
                    }
                    if (node.children) {
                        for (const child of node.children) {
                            if (child.fullPath === tagPath) {
                                return child;
                            }
                            if (child.children) {
                                const found = this.findTagInTree(tagPath, [child]);
                                if (found) return found;
                            }
                        }
                    }
                }
                return null;
            },
            getTagShortName(tagPath) {
                // 从完整路径提取短名称（最后一个/后面的内容）
                if (!tagPath) return '';
                const parts = tagPath.split(':');
                if (parts.length === 2) {
                    const tagPart = parts[1]; // "/姓名" 或 "/部门"
                    return tagPart.replace(/^\//, ''); // 去掉开头的/
                }
                return tagPath;
            },
            hasLinkedDict(tagPath) {
                const tag = this.findTagInTree(tagPath);
                return tag && tag.linkedDict;
            },
            getLinkedDict(tagPath) {
                const tag = this.findTagInTree(tagPath);
                return tag ? tag.linkedDict : null;
            },
            toggleTagTreeNode(path) {
                this.tagTreeExpanded[path] = !this.tagTreeExpanded[path];
            },
            selectTagFromTree(path) {
                this.editingForm.governed_tag = path;
                this.showTagTreeDropdown = false;
            },
            navigateToDict(dictName) {
                alert('跳转到字典: ' + dictName);
            },
            navigateToRule(rulePath) {
                alert('跳转到全局规则: ' + rulePath);
            },
            openAuthRuleEdit(index) {
                this.editingAuthRuleIndex = index;
                if (index === -1) {
                    // 新建规则
                    this.editingAuthRule = {
                        name: '',
                        targetAudience: { type: 'role', value: '' },
                        ruleSource: 'custom',
                        globalRuleRef: null,
                        // 行过滤条件
                        rowFilters: [
                            { field: '', operator: '=', value: '', valueType: 'literal' }
                        ],
                        conditionLogic: '', // 条件组合逻辑
                        // 列可见性
                        columnVisibility: {
                            mode: 'all',
                            fields: []
                        },
                        tagFieldMappings: {}
                    };
                } else {
                    // 编辑已有规则
                    const rule = this.authRules[index];
                    this.editingAuthRule = JSON.parse(JSON.stringify(rule)); // 深拷贝
                }
                this.showAuthRuleEdit = true;
            },
            closeAuthRuleEdit() {
                this.showAuthRuleEdit = false;
                this.editingAuthRule = null;
                this.editingAuthRuleIndex = null;
                this.showAudienceDropdown = false;
            },
            selectAudience(type, value) {
                this.editingAuthRule.targetAudience = { type, value };
                this.showAudienceDropdown = false;
            },
            saveAuthRuleEdit() {
                // 创建新版本
                this.createNewVersion();

                if (this.editingAuthRuleIndex === -1) {
                    // 新增规则
                    this.authRules.push(JSON.parse(JSON.stringify(this.editingAuthRule)));
                } else {
                    // 更新规则
                    this.authRules[this.editingAuthRuleIndex] = JSON.parse(JSON.stringify(this.editingAuthRule));
                }
                this.closeAuthRuleEdit();
            },
            deleteAuthRule() {
                if (this.editingAuthRuleIndex !== null && this.editingAuthRuleIndex !== -1) {
                    if (confirm('确定要删除这条权限规则吗？')) {
                        // 创建新版本
                        this.createNewVersion();

                        this.authRules.splice(this.editingAuthRuleIndex, 1);
                        this.closeAuthRuleEdit();
                    }
                }
            },
            // 行权限：添加过滤条件
            addRowFilter() {
                if (!this.editingAuthRule.rowFilters) {
                    this.editingAuthRule.rowFilters = [];
                }
                this.editingAuthRule.rowFilters.push({
                    field: '',
                    operator: '=',
                    value: '',
                    valueType: 'literal'
                });
            },
            // 行权限：删除过滤条件
            removeRowFilter(index) {
                this.editingAuthRule.rowFilters.splice(index, 1);
            },
            // 列权限：切换字段选择
            toggleColumnField(fieldName) {
                const fields = this.editingAuthRule.columnVisibility.fields;
                const index = fields.indexOf(fieldName);
                if (index > -1) {
                    fields.splice(index, 1);
                } else {
                    fields.push(fieldName);
                }
            },
            // 格式化规则描述（用于列表显示）
            formatRuleDescription(rule) {
                let desc = [];

                // 列可见性
                if (rule.columnVisibility) {
                    const mode = rule.columnVisibility.mode;
                    const fields = rule.columnVisibility.fields;
                    if (mode === 'all') {
                        desc.push('字段: 全部');
                    } else if (mode === 'include' && fields.length > 0) {
                        desc.push(`字段: 仅 ${fields.join(', ')}`);
                    } else if (mode === 'exclude' && fields.length > 0) {
                        desc.push(`字段: 排除 ${fields.join(', ')}`);
                    }
                }

                // 行条件
                if (rule.rowFilters && rule.rowFilters.length > 0) {
                    const validFilters = rule.rowFilters.filter(f => f.field);
                    if (validFilters.length > 0) {
                        const logic = rule.conditionLogic?.trim() || validFilters.map((f, i) => i + 1).join(' AND ');
                        desc.push(`条件: ${logic}`);
                    }
                }

                return desc.length > 0 ? desc.join('; ') : '-';
            },
            executePreviewSql() {
                const sql = this.previewSql.trim();
                if (!sql) {
                    // 空 SQL 时显示原始预览数据
                    this.previewSqlResult = null;
                    this.previewSqlColumns = null;
                    this.previewSqlRows = null;
                    return;
                }

                // 模拟 SQL 执行（这里只是前端演示，实际应该调用后端 API）
                // 简单模拟：如果 SQL 包含 WHERE 或其他关键字，返回不同的结果
                try {
                    // 这里模拟一个简单的查询结果
                    // 在实际场景中，应该调用后端 API 执行 SQL
                    const sqlUpper = sql.toUpperCase();

                    // 模拟不同的查询结果
                    if (sqlUpper.includes('WHERE') && sqlUpper.includes('ACTIVE')) {
                        this.previewSqlColumns = this.previewColumns;
                        this.previewSqlRows = [
                            ['E001', 'Alice Smith', 'Engineering', 'Active', '2023-01-15', '20240101'],
                            ['E002', 'Bob Jones', 'HR', 'Active', '2023-02-20', '20240101'],
                            ['E004', 'Dana White', 'Marketing', 'Active', '2023-03-10', '20240101']
                        ];
                    } else if (sqlUpper.includes('WHERE') && sqlUpper.includes('ENGINEERING')) {
                        this.previewSqlColumns = this.previewColumns;
                        this.previewSqlRows = [
                            ['E001', 'Alice Smith', 'Engineering', 'Active', '2023-01-15', '20240101'],
                            ['E005', 'Evan Roth', 'Engineering', 'Terminated', '2021-06-01', '20240101']
                        ];
                    } else if (sqlUpper.includes('SELECT') && sqlUpper.includes('NAME')) {
                        this.previewSqlColumns = ['name'];
                        this.previewSqlRows = [
                            ['Alice Smith'],
                            ['Bob Jones'],
                            ['Charlie Day'],
                            ['Dana White'],
                            ['Evan Roth']
                        ];
                    } else {
                        // 默认返回原始数据
                        this.previewSqlColumns = this.previewColumns;
                        this.previewSqlRows = this.previewRows;
                    }

                    this.previewSqlResult = { success: true, message: '查询成功', rowCount: this.previewSqlRows.length };
                } catch (error) {
                    this.previewSqlResult = { success: false, message: 'SQL 执行错误: ' + error.message };
                    this.previewSqlColumns = null;
                    this.previewSqlRows = null;
                }
            },
            openTableDescEdit() {
                this.tableDescForm = this.tableDescription || '';
                this.showTableDescEdit = true;
            },
            saveTableDescEdit() {
                // 编辑内容时创建新版本
                this.createNewVersion();
                this.tableDescription = this.tableDescForm;
                this.showTableDescEdit = false;
            },
            createNewVersion() {
                // 统一的版本管理：判断当前版本是否已发布到环境
                const hasEnvironment = this.currentVersion.environments.online ||
                    this.currentVersion.environments.pre ||
                    this.currentVersion.environments.test;

                // 如果没有环境标签，直接编辑当前版本，不创建新版本
                if (!hasEnvironment) {
                    return;
                }

                // 如果有环境标签，创建新版本
                const versionParts = this.currentVersion.version.split('.');
                const minor = parseInt(versionParts[2]) + 1;
                const newVersion = `${versionParts[0]}.${versionParts[1]}.${minor}`;

                // 将当前版本加入历史
                this.versionHistory.unshift({
                    ...this.currentVersion,
                    isLatest: false
                });

                // 创建新版本（未发布，没有环境标签）
                this.currentVersion = {
                    version: newVersion,
                    createdAt: new Date().toLocaleString('zh-CN'),
                    createdBy: 'Yuzhiyuan',
                    isLatest: true,
                    environments: {
                        online: null,
                        pre: null,
                        test: null
                    }
                };
            },
            openFieldEdit(i) {
                const f = this.schemaFields[i];
                this.editingFieldIndex = i;
                this.editingForm = {
                    description: f.description || '',
                    governed_tag: f.governed_tag || null,
                    is_encrypted: !!f.is_encrypted,
                    is_partition: !!f.is_partition,
                    linked_dict: f.linked_dict || null,
                    partition_format: (this.partitionInfo && f.is_partition) ? this.partitionInfo.partition_format : 'yyyyMMdd',
                    partition_mode: (this.partitionInfo && f.is_partition) ? this.partitionInfo.partition_mode : 'incremental',
                    encryptionConfigs: f.encryptionConfigs ? JSON.parse(JSON.stringify(f.encryptionConfigs)) : [
                        { env: '沙箱环境', keyCenterEnv: 'Online', appKey: '', isSandbox: true },
                        { env: '生产环境', keyCenterEnv: '-', appKey: '', isProduction: true }
                    ]
                };
                this.showTagTreeDropdown = false;
                this.tagTreeExpanded = {};
                this.showFieldEdit = true;
            },
            saveFieldEdit() {
                // 编辑内容时创建新版本
                this.createNewVersion();

                const i = this.editingFieldIndex;
                const F = this.editingForm;
                const f = this.schemaFields[i];

                // 更新字段属性
                f.description = F.description;
                f.governed_tag = F.governed_tag;
                f.is_encrypted = F.is_encrypted;
                f.encryptionConfigs = F.is_encrypted ? JSON.parse(JSON.stringify(F.encryptionConfigs)) : null;
                f.linked_dict = F.linked_dict;

                if (F.is_partition && !f.is_partition) {
                    this.schemaFields.forEach(function (x, j) { if (x.is_partition) this.schemaFields[j].is_partition = false; }, this);
                    this.partitionInfo = { partition_field: f.name, partition_format: F.partition_format, partition_mode: F.partition_mode };
                } else if (F.is_partition && f.is_partition) {
                    this.partitionInfo.partition_format = F.partition_format;
                    this.partitionInfo.partition_mode = F.partition_mode;
                    this.partitionInfo.partition_field = f.name;
                } else if (!F.is_partition && f.is_partition) {
                    this.partitionInfo = null;
                }
                f.is_partition = F.is_partition;
                this.closeFieldEdit();
            },
            updateDetailFieldEncryptionInit() {
                if (this.editingForm.is_encrypted && (!this.editingForm.encryptionConfigs || this.editingForm.encryptionConfigs.length === 0)) {
                    this.editingForm.encryptionConfigs = [
                        { env: '沙箱环境', keyCenterEnv: 'Online', appKey: '', isSandbox: true },
                        { env: '生产环境', keyCenterEnv: '-', appKey: '', isProduction: true }
                    ];
                }
            },
            closeFieldEdit() {
                this.showFieldEdit = false;
                this.showTagTreeDropdown = false;
                this.tagTreeExpanded = {};
            },
            openVersionPublish() {
                this.publishForm.environment = 'pre';
                this.publishForm.note = '';
                this.showVersionPublish = true;
            },
            saveVersionPublish() {
                // 发布版本到指定环境
                const envKey = this.publishForm.environment; // 'online', 'pre', 'test'

                // 检查关联的字典是否都已发布到目标环境
                const unpublishedDicts = this.getUnpublishedDictionaries(envKey);
                if (unpublishedDicts.length > 0) {
                    const dictNames = unpublishedDicts.join('、');
                    const envName = envKey === 'online' ? '生产环境' : envKey === 'pre' ? '预发环境' : '测试环境';
                    alert(`当前关联的字典【${dictNames}】在目标环境中不存在，请先将字典发布至${envName}。`);
                    return;
                }

                // 检查该环境是否已有版本，如果有则清空
                this.versionHistory.forEach(v => {
                    if (v.environments[envKey] && v.environments[envKey] !== this.currentVersion.version) {
                        v.environments[envKey] = null;
                    }
                });

                // 更新当前版本的环境标签
                this.currentVersion.environments[envKey] = this.currentVersion.version;
                this.currentVersion.note = this.publishForm.note;
                this.currentVersion.publishedAt = new Date().toLocaleString('zh-CN');

                this.showVersionPublish = false;
                this.publishForm.note = '';
            },
            switchVersion(version) {
                // 切换版本
                if (version.version === this.currentVersion.version) {
                    this.showVersionDropdown = false;
                    this.selectedDropdownVersion = null;
                    return;
                }

                // 将当前版本保存到历史（如果还没保存）
                if (this.currentVersion.isLatest && !this.versionHistory.some(v => v.version === this.currentVersion.version)) {
                    this.versionHistory.push({
                        ...this.currentVersion,
                        isLatest: false
                    });
                }

                // 切换版本
                this.currentVersion = {
                    ...version,
                    isLatest: true
                };

                this.showVersionDropdown = false;
                this.selectedDropdownVersion = null;
            },
            getAllVersions() {
                // 获取所有版本，按版本号倒序排列
                const all = [this.currentVersion, ...this.versionHistory.filter(v => v.version !== this.currentVersion.version)];
                // 按版本号倒序排序
                return all.sort((a, b) => {
                    const aParts = a.version.split('.').map(Number);
                    const bParts = b.version.split('.').map(Number);
                    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                        const aNum = aParts[i] || 0;
                        const bNum = bParts[i] || 0;
                        if (aNum !== bNum) return bNum - aNum;
                    }
                    return 0;
                });
            },
            hasEnvironment(version) {
                // 判断版本是否已发布到环境
                return version.environments.online || version.environments.pre || version.environments.test;
            },
            isDictPublishedToAnyEnv(dictName) {
                // 检查字典当前版本是否已发布到任何环境
                if (!dictName || !this.dictionaries) return true;

                const dict = this.dictionaries[dictName] || Object.values(this.dictionaries).find(d => d.name === dictName);
                if (!dict || !dict.versions) return true;

                // 获取当前版本
                const currentVersion = dict.versions.find(v => v.version === dict.currentVersion);
                if (!currentVersion) return false;

                // 检查当前版本是否发布到了任何环境
                if (currentVersion.environments && (currentVersion.environments.online || currentVersion.environments.pre || currentVersion.environments.test)) {
                    return true;
                }
                return false;
            },
            isDictPublishedToTargetEnv(dictName, targetEnv) {
                // 检查字典当前版本是否已发布到目标环境
                if (!dictName || !this.dictionaries) return true;

                const dict = this.dictionaries[dictName] || Object.values(this.dictionaries).find(d => d.name === dictName);
                if (!dict || !dict.versions) return true;

                // 获取当前版本
                const currentVersion = dict.versions.find(v => v.version === dict.currentVersion);
                if (!currentVersion) return false;

                // 检查当前版本是否发布到了目标环境
                if (currentVersion.environments && currentVersion.environments[targetEnv]) {
                    return true;
                }
                return false;
            },
            getUnpublishedDictionaries(targetEnv) {
                // 获取所有未发布到目标环境的字典名称列表
                const unpublished = [];

                // 遍历所有字段，检查关联的字典
                for (const field of this.schemaFields) {
                    // 检查直接关联的字典
                    if (field.linked_dict && !this.isDictPublishedToTargetEnv(field.linked_dict, targetEnv)) {
                        if (!unpublished.includes(field.linked_dict)) {
                            unpublished.push(field.linked_dict);
                        }
                    }

                    // 检查通过治理标签关联的字典
                    if (field.governed_tag) {
                        const linkedDict = this.getLinkedDict(field.governed_tag);
                        if (linkedDict && !this.isDictPublishedToTargetEnv(linkedDict, targetEnv)) {
                            if (!unpublished.includes(linkedDict)) {
                                unpublished.push(linkedDict);
                            }
                        }
                    }
                }

                return unpublished;
            }
        },
        template: window.AppTemplates.DetailData
    };


    // DetailFunction 已移到独立组件文件：js/components/DetailFunction.js

    // 统一的版本管理栏组件
    const VersionBar = {
        name: 'VersionBar',
        props: {
            currentVersion: {
                type: Object,
                required: true
            },
            versions: {
                type: Array,
                default: () => []
            },
            extraTags: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                showVersionDropdown: false
            };
        },
        computed: {
            allVersions() {
                // 获取所有版本（当前版本+历史版本）
                const all = [this.currentVersion];
                this.versions.forEach(v => {
                    if (v.version !== this.currentVersion.version) {
                        all.push(v);
                    }
                });
                return all.sort((a, b) => {
                    const aParts = a.version.replace('v', '').split('.').map(Number);
                    const bParts = b.version.replace('v', '').split('.').map(Number);
                    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                        const aNum = aParts[i] || 0;
                        const bNum = bParts[i] || 0;
                        if (aNum !== bNum) return bNum - aNum;
                    }
                    return 0;
                });
            }
        },
        methods: {
            switchVersion(version) {
                this.$emit('switch-version', version);
                this.showVersionDropdown = false;
            },
            openPublish() {
                this.$emit('open-publish');
            }
        },
        template: `
            <div class="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center gap-4 flex-shrink-0">
                <div class="flex items-center gap-2 flex-1">
                    <span class="text-xs font-medium text-slate-500">版本：</span>
                    <div class="relative" @click.stop>
                        <button @click.stop="showVersionDropdown = !showVersionDropdown" 
                            class="px-2.5 py-1 bg-white border border-slate-200 rounded text-sm font-mono text-slate-700 hover:border-indigo-300 transition-colors flex items-center gap-2">
                            <span>{{ currentVersion.version }}</span>
                            <!-- 环境标签 -->
                            <span v-if="currentVersion.environments?.online === currentVersion.version" 
                                class="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">生产</span>
                            <span v-else-if="currentVersion.environments?.pre === currentVersion.version" 
                                class="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">预发</span>
                            <span v-else-if="currentVersion.environments?.test === currentVersion.version" 
                                class="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">测试</span>
                            <i class="ph ph-caret-down text-xs text-slate-400"></i>
                        </button>
                        <!-- 版本下拉列表 -->
                        <div v-if="showVersionDropdown" @click.stop 
                            class="absolute top-full left-0 mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden min-w-[280px] max-h-60 overflow-y-auto">
                            <div v-for="v in allVersions" :key="v.version" 
                                @click="switchVersion(v)"
                                :class="['px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 border-b border-slate-100 last:border-b-0', 
                                    v.version === currentVersion.version ? 'bg-indigo-100 text-indigo-700' : 'text-slate-700']">
                                <div class="flex items-center justify-between gap-2">
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center gap-2">
                                            <span class="font-mono font-medium">{{ v.version }}</span>
                                            <span v-if="v.environments?.online === v.version" 
                                                class="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">生产</span>
                                            <span v-else-if="v.environments?.pre === v.version" 
                                                class="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">预发</span>
                                            <span v-else-if="v.environments?.test === v.version" 
                                                class="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">测试</span>
                                        </div>
                                        <div class="text-xs text-slate-500 mt-0.5">
                                            {{ v.createdBy }} · {{ v.createdAt }}
                                        </div>
                                    </div>
                                    <i v-if="v.version === currentVersion.version" 
                                        class="ph ph-check text-indigo-600 flex-shrink-0"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 额外的标签（如字典类型） -->
                    <span v-for="tag in extraTags" :key="tag.label" 
                        :class="['px-2 py-1 text-xs font-medium rounded', tag.class]">
                        {{ tag.label }}
                    </span>
                </div>
                <div class="flex items-center gap-2">
                    <!-- 发布按钮 -->
                    <button @click="openPublish" 
                        class="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5">
                        <i class="ph ph-upload-simple"></i>发布
                    </button>
                </div>
            </div>
        `
    };

    const DetailDictionary = {
        name: 'DetailDictionary',
        props: ['node', 'dictionaries'],
        data() {
            return {
                activeTab: 'enums',
                editingEnum: null,
                showEnumModal: false,
                showDeleteConfirm: false,
                enumToDelete: null,
                editForm: {
                    code: '',
                    label: '',
                    description: ''
                },
                // 标签关联
                showTagSelector: false,
                selectedTags: [],
                // 版本管理
                showVersionHistory: false,
                selectedVersion: null,
                // 发布弹窗
                showVersionPublish: false,
                publishForm: {
                    environment: 'test',
                    note: ''
                },
                // 直接关联字段
                showFieldSearchModal: false,
                assetSearchQuery: '',
                selectedAsset: null,
                selectedFieldsForLink: [],
                allAssets: [
                    { id: 'asset_1', name: 'employee_info', description: '员工基本信息表' },
                    { id: 'asset_2', name: 'job_history', description: '员工职位变更历史' },
                    { id: 'asset_3', name: 'promotion_request', description: '员工晋升申请记录' },
                    { id: 'asset_4', name: 'salary_info', description: '薪资结算信息' },
                    { id: 'asset_5', name: 'attendance_daily', description: '每日出勤统计' }
                ]
            };
        },
        mounted() {
            console.log('DetailDictionary mounted');
            console.log('node:', this.node);
            console.log('dictionaries:', this.dictionaries);
            console.log('dictData:', this.dictData);
            console.log('enumTree:', this.enumTree);
        },
        computed: {
            dictData() {
                // 从 props 获取字典数据
                return this.dictionaries?.[this.node.id] || null;
            },
            currentVersionData() {
                if (!this.dictData) return null;
                const version = this.dictData.currentVersion;
                return this.dictData.versions.find(v => v.version === version);
            },
            enumTree() {
                return this.currentVersionData?.enums || [];
            },
            hasEnvironment() {
                // 判断当前版本是否已发布到环境
                const env = this.currentVersionData?.environments;
                return env && (env.online || env.pre || env.test);
            },
            associatedTags() {
                return this.dictData?.associatedTags || [];
            },
            appliedFields() {
                return this.dictData?.appliedFields || [];
            },
            filteredAssets() {
                if (!this.assetSearchQuery.trim()) return [];
                const query = this.assetSearchQuery.toLowerCase();
                return this.allAssets.filter(a => a.name.toLowerCase().includes(query) || (a.description && a.description.toLowerCase().includes(query)));
            },
            assetFieldsForLinking() {
                if (!this.selectedAsset) return [];
                // 模拟不同资产的字段
                const fieldMocks = {
                    'employee_info': [
                        { name: 'emp_id', type: 'STRING', description: '工号' },
                        { name: 'name', type: 'STRING', description: '姓名' },
                        { name: 'gender', type: 'STRING', description: '性别' },
                        { name: 'level', type: 'STRING', description: '职级' }
                    ],
                    'job_history': [
                        { name: 'id', type: 'BIGINT', description: '主键' },
                        { name: 'emp_id', type: 'STRING', description: '工号' },
                        { name: 'position_level', type: 'STRING', description: '职位等级' }
                    ],
                    'promotion_request': [
                        { name: 'req_id', type: 'STRING', description: '申请单号' },
                        { name: 'target_level', type: 'STRING', description: '目标职级' }
                    ]
                };
                return fieldMocks[this.selectedAsset.name] || [
                    { name: 'field_1', type: 'STRING', description: '示例字段 1' },
                    { name: 'field_2', type: 'BIGINT', description: '示例字段 2' }
                ];
            }
        },
        methods: {
            // 枚举项 CRUD
            addRootEnum() {
                this.editingEnum = null;
                this.editForm = { code: '', label: '', description: '' };
                this.showEnumModal = true;
            },
            addChildEnum(parentEnum) {
                this.editingEnum = { parent: parentEnum };
                this.editForm = { code: '', label: '', description: '' };
                this.showEnumModal = true;
            },
            editEnum(enumItem) {
                this.editingEnum = enumItem;
                this.editForm = {
                    code: enumItem.code,
                    label: enumItem.label,
                    description: enumItem.description
                };
                this.showEnumModal = true;
            },
            saveEnum() {
                // 创建草稿版本
                this.createDraftVersion();

                if (!this.editingEnum) {
                    // 新增根枚举
                    const newEnum = {
                        id: 'enum_' + Date.now(),
                        ...this.editForm,
                        children: []
                    };
                    this.currentVersionData.enums.push(newEnum);
                } else if (this.editingEnum.parent) {
                    // 新增子枚举
                    const newEnum = {
                        id: 'enum_' + Date.now(),
                        ...this.editForm,
                        children: []
                    };
                    this.editingEnum.parent.children.push(newEnum);
                } else {
                    // 编辑枚举
                    Object.assign(this.editingEnum, this.editForm);
                }

                this.showEnumModal = false;
            },
            confirmDeleteEnum(enumItem) {
                this.enumToDelete = enumItem;
                this.showDeleteConfirm = true;
            },
            deleteEnum() {
                this.createDraftVersion();
                this.findAndDeleteEnum(this.enumTree, this.enumToDelete);
                this.showDeleteConfirm = false;
            },
            findAndDeleteEnum(tree, target) {
                for (let i = 0; i < tree.length; i++) {
                    if (tree[i].id === target.id) {
                        tree.splice(i, 1);
                        return true;
                    }
                    if (tree[i].children && this.findAndDeleteEnum(tree[i].children, target)) {
                        return true;
                    }
                }
                return false;
            },
            // 版本管理（统一逻辑）
            createDraftVersion() {
                // 判断当前版本是否已发布到环境
                const env = this.currentVersionData?.environments;
                const hasEnvironment = env && (env.online || env.pre || env.test);

                // 如果没有环境标签，直接编辑当前版本，不创建新版本
                if (!hasEnvironment) {
                    return;
                }

                // 如果有环境标签，创建新版本
                const latestVersion = this.dictData.versions[0];
                const versionParts = latestVersion.version.slice(1).split('.');
                const newVersionNum = parseInt(versionParts[0]) + 1;
                const newVersion = {
                    version: 'v' + newVersionNum,
                    createdAt: new Date().toISOString().split('T')[0],
                    createdBy: 'current_user',
                    environments: {
                        online: null,
                        pre: null,
                        test: null
                    },
                    enums: JSON.parse(JSON.stringify(latestVersion.enums))
                };
                this.dictData.versions.unshift(newVersion);
                this.dictData.currentVersion = newVersion.version;
            },
            switchVersion(version) {
                this.dictData.currentVersion = version.version;
                this.showVersionHistory = false;
            },
            openVersionPublish() {
                this.publishForm.environment = 'pre';
                this.publishForm.note = '';
                this.showVersionPublish = true;
            },
            saveVersionPublish() {
                // 发布版本到指定环境
                const envKey = this.publishForm.environment; // 'online', 'pre', 'test'

                // 清空该环境的其他版本标记
                this.dictData.versions.forEach(v => {
                    if (v.environments[envKey] === v.version) {
                        v.environments[envKey] = null;
                    }
                });

                // 标记当前版本到该环境
                this.currentVersionData.environments[envKey] = this.currentVersionData.version;

                // 如果有发布说明，保存到版本中
                if (this.publishForm.note) {
                    this.currentVersionData.note = this.publishForm.note;
                }

                this.showVersionPublish = false;
            },
            // 标签关联
            toggleTagAssociation(tagPath) {
                const index = this.associatedTags.indexOf(tagPath);
                if (index > -1) {
                    this.associatedTags.splice(index, 1);
                } else {
                    this.associatedTags.push(tagPath);
                }
            },
            getFieldsForTag(tagPath) {
                // 模拟：获取该标签下关联的字段
                // 实际应该从后端获取
                const mockFields = {
                    '技术标签/错误代码': ['logs.error_code', 'events.error_type'],
                    '运维分类/K8s': ['k8s_pods.status', 'k8s_nodes.condition'],
                    'PII 个人信息/职级': ['employees.level', 'users.job_grade'],
                    '业务分类/HR': ['hr_data.category', 'leave_records.hr_type']
                };
                return mockFields[tagPath] || [];
            },
            navigateToField(tableName, fieldName) {
                // 跳转到字段详情
                console.log('Navigate to:', tableName, fieldName);
                // 实际实现：切换到对应的表，并定位到字段
            },
            // 直接关联字段方法
            openFieldSearch() {
                this.assetSearchQuery = '';
                this.selectedAsset = null;
                this.selectedFieldsForLink = [];
                this.showFieldSearchModal = true;
            },
            selectAssetForFieldLink(asset) {
                this.selectedAsset = asset;
            },
            toggleFieldSelection(field) {
                const index = this.selectedFieldsForLink.findIndex(f => f.name === field.name);
                if (index > -1) {
                    this.selectedFieldsForLink.splice(index, 1);
                } else {
                    this.selectedFieldsForLink.push(field);
                }
            },
            isFieldSelectedForLink(field) {
                return this.selectedFieldsForLink.some(f => f.name === field.name);
            },
            confirmFieldLink() {
                if (!this.dictData.appliedFields) {
                    this.dictData.appliedFields = [];
                }

                this.selectedFieldsForLink.forEach(f => {
                    // 避免重复添加
                    const exists = this.dictData.appliedFields.some(existing =>
                        existing.assetName === this.selectedAsset.name && existing.fieldName === f.name
                    );

                    if (!exists) {
                        this.dictData.appliedFields.push({
                            id: Date.now() + Math.random(),
                            assetName: this.selectedAsset.name,
                            fieldName: f.name,
                            fieldType: f.type,
                            description: f.description
                        });
                    }
                });

                this.showFieldSearchModal = false;
            },
            removeAppliedField(id) {
                const index = this.dictData.appliedFields.findIndex(f => f.id === id);
                if (index > -1) {
                    this.dictData.appliedFields.splice(index, 1);
                }
            }
        },
        template: window.AppTemplates.DetailDictionary
    };


    // 递归枚举树项组件
    const EnumTreeItem = {
        name: 'EnumTreeItem',
        props: {
            enumItem: Object,
            depth: {
                type: Number,
                default: 0
            },
            dictType: {
                type: String,
                default: 'tree' // 'tree' | 'flat'
            }
        },
        emits: ['add-child', 'edit', 'delete'],
        data() {
            return {
                isOpen: true
            };
        },
        template: window.AppTemplates.EnumTreeItem
    };

    // 递归标签树项组件
    const TagTreeItem = {
        name: 'TagTreeItem',
        props: {
            tag: Object,
            level: Number,
            parentPath: String,
            selectedTag: Object,
            currentNodeId: String
        },
        emits: ['toggle', 'select', 'add-child', 'edit', 'delete'],
        template: `
            <div class="space-y-1">
                <div class="group">
                    <div 
                        :class="[
                            'px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2',
                            { 'bg-indigo-50': selectedTag?.id === tag.id }
                        ]"
                        :style="{ paddingLeft: (level * 1.5 + 0.75) + 'rem' }">
                        <i 
                            v-if="tag.children && tag.children.length > 0"
                            @click="$emit('toggle', tag.id)"
                            :class="['ph text-sm transition-transform cursor-pointer', tag.isOpen ? 'ph-caret-down' : 'ph-caret-right']"></i>
                        <i v-else class="ph text-sm text-transparent">-</i>
                        <i class="ph ph-tag text-amber-600"></i>
                        <span 
                            @click="$emit('select', tag)"
                            class="text-sm font-medium text-slate-900 flex-1 cursor-pointer flex items-center">
                            {{ tag.name }}
                            <span v-if="currentNodeId && currentNodeId !== 'root_all' && tag.originNodeId && tag.originNodeId !== currentNodeId" 
                                  class="ml-2 px-1 py-0.5 rounded text-[10px] bg-amber-100 text-amber-700 leading-none">继承自 {{ tag.originNodeName || (tag.originNodeId === 'root_all' ? '全部' : '上级目录') }}</span>
                        </span>
                        <span v-if="tag.children && tag.children.length > 0" class="text-xs text-slate-400">{{ tag.children.length }}</span>
                        <div class="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                            <button 
                                v-if="level === 0"
                                @click.stop="$emit('add-child', tag, parentPath + '/' + tag.name)"
                                class="p-1 hover:bg-slate-200 rounded text-slate-600"
                                title="添加子标签">
                                <i class="ph ph-plus text-xs"></i>
                            </button>
                            <button 
                                v-if="!tag.originNodeId || tag.originNodeId === currentNodeId"
                                @click.stop="$emit('edit', tag, parentPath)"
                                class="p-1 hover:bg-slate-200 rounded text-slate-600"
                                title="编辑">
                                <i class="ph ph-pencil-simple text-xs"></i>
                            </button>
                            <button 
                                v-if="!tag.originNodeId || tag.originNodeId === currentNodeId"
                                @click.stop="$emit('delete', tag)"
                                class="p-1 hover:bg-red-100 rounded text-red-600"
                                title="删除">
                                <i class="ph ph-trash text-xs"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- 递归渲染子标签 -->
                <template v-if="tag.isOpen && tag.children && tag.children.length > 0">
                    <tag-tree-item
                        v-for="child in tag.children"
                        :key="child.id"
                        :tag="child"
                        :level="level + 1"
                        :parent-path="parentPath + '/' + tag.name"
                        :selected-tag="selectedTag"
                        :current-node-id="currentNodeId"
                        @toggle="(id) => $emit('toggle', id)"
                        @select="(t) => $emit('select', t)"
                        @add-child="(p, path) => $emit('add-child', p, path)"
                        @edit="(t, p) => $emit('edit', t, p)"
                        @delete="(t) => $emit('delete', t)">
                    </tag-tree-item>
                </template>
            </div>
        `
    };

    const TagCollection = {
        name: 'TagCollection',
        props: ['node'],
        components: {
            TagTreeItem
        },
        data() {
            return {
                selectedTag: null,
                editingTag: null,
                showEditModal: false,
                showDeleteConfirm: false,
                tagToDelete: null,
                tagSearchQuery: '',
                editForm: {
                    name: '',
                    identifier: '',
                    description: '',
                    parentId: null,
                    parentIdentifier: ''
                },
                tagTree: [
                    {
                        id: 'tag_pii',
                        name: 'PII 个人信息',
                        identifier: 'PII',
                        originNodeId: 'root_all',
                        originNodeName: '全部',
                        description: '个人身份信息标签，用于标记包含用户个人隐私的敏感数据',
                        isOpen: true,
                        children: [
                            {
                                id: 'tag_pii_name',
                                name: '姓名',
                                identifier: 'PII.name',
                                originNodeId: 'root_all',
                                originNodeName: '全部',
                                description: '用户姓名字段',
                                fullPath: '/Tags/PII 个人信息/姓名',
                                appliedFieldCount: 3,
                                ruleCount: 2,
                                isOpen: false,
                                appliedFields: [
                                    { id: 1, assetName: '员工休假记录表', tableName: 'ks.emp.leave', fieldName: 'employee_name', fieldType: 'VARCHAR(128)', description: '员工姓名', env: 'online', version: 'v2.1.0' },
                                    { id: 2, assetName: '员工休假记录表', tableName: 'ks.emp.leave', fieldName: 'employee_name', fieldType: 'VARCHAR(128)', description: '员工姓名', env: 'pre', version: 'v2.2.0' },
                                    { id: 3, assetName: '用户画像表', tableName: 'user_profile', fieldName: 'user_name', fieldType: 'VARCHAR(64)', description: '用户姓名', env: 'online', version: 'v1.0.0' },
                                    { id: 4, assetName: '订单历史记录', tableName: 'order_history', fieldName: 'customer_name', fieldType: 'VARCHAR(100)', description: '客户姓名', env: 'pre', version: 'v3.0.0' },
                                    { id: 5, assetName: '客服工单表', tableName: 'cs_tickets', fieldName: 'reporter_name', fieldType: 'VARCHAR(64)', description: '报告人姓名', env: null, version: 'v1.2.0-draft', otherVersionCount: 2 },
                                    { id: 6, assetName: '员工休假记录表', tableName: 'ks.emp.leave', fieldName: 'approver_name', fieldType: 'VARCHAR(128)', description: '审批人姓名', env: null, version: 'v2.3.0-draft', otherVersionCount: 0 }
                                ],
                                relatedRules: [
                                    { id: 1, name: 'PII 脱敏规则', targetAsset: '员工休假记录表', condition: 'governed_tags CONTAINS "PII/姓名"', enabled: true },
                                    { id: 2, name: '用户画像访问控制', targetAsset: '用户画像表', condition: 'governed_tags CONTAINS "PII" AND role NOT IN ("数据管理员")', enabled: true }
                                ],
                                relatedDictionaries: [
                                    { id: 1, name: 'Name_Formats', description: '姓名格式字典', entryCount: 5 }
                                ],
                                children: []
                            },
                            {
                                id: 'tag_pii_phone',
                                name: '电话',
                                identifier: 'PII.phone',
                                description: '电话号码字段',
                                fullPath: '/Tags/PII 个人信息/电话',
                                appliedFieldCount: 2,
                                ruleCount: 1,
                                isOpen: false,
                                appliedFields: [
                                    { id: 1, assetName: '员工休假记录表', tableName: 'ks.emp.leave', fieldName: 'mobile_phone', fieldType: 'VARCHAR(20)', description: '手机号码', env: 'online', version: 'v2.1.0' },
                                    { id: 2, assetName: '用户画像表', tableName: 'user_profile', fieldName: 'phone_number', fieldType: 'VARCHAR(20)', description: '联系电话', env: 'online', version: 'v1.0.0' },
                                    { id: 3, assetName: '用户画像表', tableName: 'user_profile', fieldName: 'phone_number', fieldType: 'VARCHAR(20)', description: '联系电话', env: null, version: 'v1.1.0-draft', otherVersionCount: 1 }
                                ],
                                relatedRules: [
                                    { id: 1, name: '电话脱敏规则', targetAsset: '全局', condition: 'governed_tags CONTAINS "PII/电话"', enabled: true }
                                ],
                                relatedDictionaries: [],
                                children: []
                            },
                            {
                                id: 'tag_pii_email',
                                name: '邮箱',
                                identifier: 'PII.email',
                                description: '电子邮箱地址字段',
                                fullPath: '/Tags/PII 个人信息/邮箱',
                                appliedFieldCount: 1,
                                ruleCount: 1,
                                isOpen: false,
                                appliedFields: [
                                    { id: 1, assetName: '用户画像表', tableName: 'user_profile', fieldName: 'email', fieldType: 'VARCHAR(255)', description: '电子邮箱', env: 'online', version: 'v1.0.0' },
                                    { id: 2, assetName: '用户画像表', tableName: 'user_profile', fieldName: 'email', fieldType: 'VARCHAR(255)', description: '电子邮箱', env: 'pre', version: 'v1.1.0' }
                                ],
                                relatedRules: [
                                    { id: 1, name: '邮箱脱敏规则', targetAsset: '全局', condition: 'governed_tags CONTAINS "PII/邮箱"', enabled: true }
                                ],
                                relatedDictionaries: [
                                    { id: 2, name: 'Email_Domains', description: '邮箱域名白名单', entryCount: 20 }
                                ],
                                children: []
                            },
                            {
                                id: 'tag_local_secret',
                                name: '目录机密标签',
                                identifier: 'PII.secret',
                                originNodeId: 'root_common',
                                originNodeName: '公共资源库',
                                description: '仅在公共资源库目录可见的机密标签',
                                appliedFieldCount: 1,
                                ruleCount: 0,
                                isOpen: false,
                                appliedFields: [],
                                relatedRules: [],
                                relatedDictionaries: [],
                                children: []
                            }
                        ]
                    },
                    {
                        id: 'tag_business',
                        name: '业务分类',
                        identifier: 'BUSINESS',
                        description: '业务领域相关的分类标签',
                        isOpen: false,
                        children: [
                            {
                                id: 'tag_dept',
                                name: '部门',
                                identifier: 'BUSINESS.dept',
                                description: '部门信息字段',
                                fullPath: '/Tags/业务分类/部门',
                                appliedFieldCount: 2,
                                ruleCount: 1,
                                isOpen: false,
                                appliedFields: [
                                    { id: 1, assetName: '员工休假记录表', tableName: 'ks.emp.leave', fieldName: 'department', fieldType: 'VARCHAR(64)', description: '所属部门', env: 'online', version: 'v2.1.0' },
                                    { id: 2, assetName: '用户画像表', tableName: 'user_profile', fieldName: 'dept_id', fieldType: 'INT', description: '部门ID', env: 'pre', version: 'v1.1.0' }
                                ],
                                relatedRules: [
                                    { id: 1, name: '部门数据隔离', targetAsset: '员工休假记录表', condition: 'department_id IN (visiting_user.as_hrbp.department_ids)', enabled: true }
                                ],
                                relatedDictionaries: [
                                    { id: 3, name: 'Department_Codes', description: '部门编码字典', entryCount: 50 }
                                ],
                                children: []
                            },
                            {
                                id: 'tag_level',
                                name: '职级',
                                identifier: 'BUSINESS.level',
                                description: '员工职级字段',
                                fullPath: '/Tags/业务分类/职级',
                                appliedFieldCount: 1,
                                ruleCount: 0,
                                isOpen: false,
                                appliedFields: [
                                    { id: 1, assetName: '员工休假记录表', tableName: 'ks.emp.leave', fieldName: 'job_level', fieldType: 'VARCHAR(32)', description: '职级', env: 'online', version: 'v2.1.0' },
                                    { id: 2, assetName: '员工休假记录表', tableName: 'ks.emp.leave', fieldName: 'job_level', fieldType: 'VARCHAR(32)', description: '职级', env: null, version: 'v2.3.0-draft', otherVersionCount: 3 }
                                ],
                                relatedRules: [],
                                relatedDictionaries: [],
                                children: []
                            }
                        ]
                    }
                ]
            };
        },
        computed: {
            breadcrumbs() {
                if (!this.selectedTag) return [];
                const crumbs = [{ name: '治理标签', path: null }];
                if (this.selectedTag.fullPath) {
                    const parts = this.selectedTag.fullPath.split('/').filter(p => p && p !== 'Tags');
                    parts.forEach(part => {
                        crumbs.push({ name: part, path: null });
                    });
                }
                return crumbs;
            },
            flatTags() {
                const results = [];
                const flatten = (tags, parentPath = '/Tags', level = 0) => {
                    tags.forEach(tag => {
                        const path = parentPath + '/' + tag.name;
                        results.push({
                            ...tag,
                            fullPath: path,
                            level: level
                        });
                        if (tag.children && tag.children.length > 0) {
                            flatten(tag.children, path, level + 1);
                        }
                    });
                };
                flatten(this.tagTree);
                return results;
            },
            filteredFlatTags() {
                if (!this.tagSearchQuery.trim()) return this.flatTags;
                const query = this.tagSearchQuery.toLowerCase();
                return this.flatTags.filter(tag =>
                    tag.name.toLowerCase().includes(query) ||
                    tag.identifier.toLowerCase().includes(query)
                );
            }
        },
        methods: {
            findTagById(tagId, tags = this.tagTree) {
                for (const tag of tags) {
                    if (tag.id === tagId) return tag;
                    if (tag.children && tag.children.length > 0) {
                        const found = this.findTagById(tagId, tag.children);
                        if (found) return found;
                    }
                }
                return null;
            },
            toggleTag(tagId) {
                const tag = this.findTagById(tagId);
                if (tag) {
                    tag.isOpen = !tag.isOpen;
                }
            },
            selectTag(tag) {
                this.selectedTag = tag;
            },
            addRootTag() {
                this.editingTag = null;
                this.editForm = { name: '', identifier: '', description: '', parentId: null, parentPath: '', parentIdentifier: '' };
                this.showEditModal = true;
            },
            addChildTag(parentTag, parentPath = '') {
                this.editingTag = null;
                this.editForm = {
                    name: '',
                    identifier: '',
                    description: '',
                    parentId: parentTag.id,
                    parentPath: parentPath || parentTag.fullPath || `/Tags/${parentTag.name}`,
                    parentIdentifier: parentTag.identifier
                };
                this.showEditModal = true;
            },
            editTag(tag, parentPath = '') {
                this.editingTag = tag;
                let idPart = tag.identifier || '';
                let parentIdPart = '';
                if (idPart.includes('.')) {
                    const parts = idPart.split('.');
                    parentIdPart = parts[0];
                    idPart = parts.slice(1).join('.');
                }
                this.editForm = {
                    name: tag.name,
                    identifier: idPart,
                    description: tag.description,
                    parentId: null,
                    parentPath: parentPath,
                    parentIdentifier: parentIdPart
                };
                this.showEditModal = true;
            },
            saveTag() {
                if (!this.editForm.name.trim()) {
                    alert('请输入标签名称');
                    return;
                }

                if (this.editingTag) {
                    // 编辑标签
                    this.editingTag.name = this.editForm.name;
                    this.editingTag.identifier = this.editForm.parentIdentifier ? `${this.editForm.parentIdentifier}.${this.editForm.identifier}` : this.editForm.identifier;
                    this.editingTag.description = this.editForm.description;
                    // 更新 fullPath
                    if (this.editForm.parentPath) {
                        this.editingTag.fullPath = `${this.editForm.parentPath}/${this.editForm.name}`;
                    }
                } else {
                    // 新增标签
                    const newTag = {
                        id: 'tag_' + Date.now(),
                        name: this.editForm.name,
                        identifier: this.editForm.parentIdentifier ? `${this.editForm.parentIdentifier}.${this.editForm.identifier}` : this.editForm.identifier,
                        originNodeId: this.node.id,
                        originNodeName: this.node.name,
                        description: this.editForm.description,
                        appliedFieldCount: 0,
                        ruleCount: 0,
                        isOpen: false,
                        appliedFields: [],
                        relatedRules: [],
                        relatedDictionaries: [],
                        children: []
                    };

                    if (this.editForm.parentId) {
                        // 添加子标签
                        const parent = this.findTagById(this.editForm.parentId);
                        if (parent) {
                            newTag.fullPath = `${this.editForm.parentPath}/${newTag.name}`;
                            if (!parent.children) parent.children = [];
                            parent.children.push(newTag);
                        }
                    } else {
                        // 添加父标签
                        newTag.fullPath = `/Tags/${newTag.name}`;
                        this.tagTree.push(newTag);
                    }
                }

                this.showEditModal = false;
                this.editingTag = null;
            },
            findAndDeleteTag(tagId, tags = this.tagTree, parent = null) {
                for (let i = 0; i < tags.length; i++) {
                    if (tags[i].id === tagId) {
                        tags.splice(i, 1);
                        return true;
                    }
                    if (tags[i].children && tags[i].children.length > 0) {
                        if (this.findAndDeleteTag(tagId, tags[i].children, tags[i])) {
                            return true;
                        }
                    }
                }
                return false;
            },
            confirmDeleteTag(tag) {
                this.tagToDelete = { tag };
                this.showDeleteConfirm = true;
            },
            deleteTag() {
                if (!this.tagToDelete) return;

                const { tag } = this.tagToDelete;
                this.findAndDeleteTag(tag.id);

                if (this.selectedTag && this.selectedTag.id === tag.id) {
                    this.selectedTag = null;
                }

                this.showDeleteConfirm = false;
                this.tagToDelete = null;
            },
            handleCancelDelete() {
                this.showDeleteConfirm = false;
                this.tagToDelete = null;
            },
            cancelDelete() {
                this.showDeleteConfirm = false;
                this.tagToDelete = null;
            }
        },
        template: window.AppTemplates.TagCollection
    };

    // 创建结构化数据资产向导组件
    const CreateDataAssetWizard = {
        name: 'CreateDataAssetWizard',
        template: window.AppTemplates.CreateDataAssetWizard,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            step: {
                type: Number,
                default: 1
            },
            method: {
                type: String,
                default: null
            },
            form: {
                type: Object,
                required: true,
                default: () => ({
                    name: '',
                    description: '',
                    targetCatalog: null,
                    viewSql: '',
                    viewFields: [],
                    dataSource: '',
                    selectedTable: null,
                    tableMetadata: null,
                    sourceCatalog: null,
                    excelFile: null,
                    excelPreview: null,
                    uploadedFile: null,
                    availableSheets: [],
                    selectedSheet: null,
                    excelFields: [],
                    tableName: '',
                    clusterName: '',
                    chineseName: '',
                    encryptionConfigs: [
                        { env: '沙箱环境', keyCenterEnv: 'Online', appKeyIdempotent: '', appKeyNonIdempotent: '', isSandbox: true },
                        { env: '生产环境', keyCenterEnv: '-', appKeyIdempotent: '', appKeyNonIdempotent: '', isProduction: true }
                    ]
                })
            },
            dataSourceTables: {
                type: Object,
                default: () => ({})
            }
        },
        emits: ['close', 'back', 'select-method', 'preview', 'save', 'select-table', 'update:form', 'update-field-description', 'update-view-field-description', 'file-upload', 'select-sheet', 'update-excel-field', 'next-step'],
        data() {
            return {
                showCatalogDropdown: false,
                previewData: null,
                tableSearchQuery: '',
                showNewCatalogForm: false,
                newCatalogParent: null,
                newCatalogName: '',
                testConnectionStatus: null, // 'success', 'error', 'testing'
                testConnectionMessage: ''
            };
        },
        computed: {
            filteredTables() {
                if (!this.form) return [];

                // If ONLINE method, search across all data sources
                let tables = [];
                if (this.method === 'ONLINE') {
                    Object.entries(this.dataSourceTables || {}).forEach(([type, dsTables]) => {
                        let displayType = type.toUpperCase();
                        if (displayType.includes('CK')) displayType = 'CK';
                        // Inject source type into each table for display
                        const tablesWithType = dsTables.map(t => ({ ...t, sourceType: displayType }));
                        tables = tables.concat(tablesWithType);
                    });
                } else if (this.form.dataSource) {
                    tables = (this.dataSourceTables && this.dataSourceTables[this.form.dataSource]) || [];
                }

                const query = (this.tableSearchQuery || '').toLowerCase().trim();
                if (!query) return [];
                return tables.filter(t =>
                    t.name.toLowerCase().includes(query) ||
                    (t.description && t.description.toLowerCase().includes(query)) ||
                    (t.sourceType && t.sourceType.toLowerCase().includes(query))
                );
            },
            filteredTablesByEnv() {
                const tables = this.filteredTables || [];
                return {
                    online: tables.filter(t => t.env === 'online'),
                    offline: tables.filter(t => t.env === 'offline')
                };
            },
            shouldShowStep3() {
                const result = this.step === 3 && this.form && this.form.tableMetadata && this.method === 'ONLINE';
                console.log('shouldShowStep3 computed:', {
                    step: this.step,
                    hasTableMetadata: !!this.form?.tableMetadata,
                    method: this.method,
                    result: result
                });
                return result;
            },
            anyExcelFieldEncrypted() {
                return this.form && this.form.excelFields && this.form.excelFields.some(f => f.isEncrypted);
            },
            anyOnlineFieldEncrypted() {
                return this.form && this.form.tableMetadata && this.form.tableMetadata.fields && this.form.tableMetadata.fields.some(f => f.isEncrypted);
            }
        },
        methods: {
            handleClose() {
                this.$emit('close');
            },
            handleBack() {
                if (this.step === 1) {
                    this.handleClose();
                } else {
                    this.$emit('back');
                }
            },
            handleSelectMethod(method) {
                this.$emit('select-method', method);
            },
            handlePreview() {
                // VIEW 方式：模拟查询预览
                // 实际应该调用后端API执行SQL
                if (this.method === 'VIEW') {
                    this.previewData = {
                        columns: ['id', 'name', 'department', 'status', 'joined_at', 'dt'],
                        rows: [
                            ['E001', 'Alice Smith', 'Engineering', 'Active', '2023-01-15', '20240101'],
                            ['E002', 'Bob Jones', 'HR', 'Active', '2023-02-20', '20240101'],
                            ['E003', 'Charlie Day', 'Marketing', 'On Leave', '2022-11-05', '20240101'],
                            ['E004', 'Dana White', 'Engineering', 'Active', '2023-03-10', '20240101'],
                            ['E005', 'Evan Roth', 'Finance', 'Terminated', '2021-06-01', '20240101']
                        ]
                    };
                    // 为 VIEW 方式生成字段元数据
                    const viewFields = this.previewData.columns.map(col => {
                        let type = 'STRING';
                        if (col === 'id') type = 'BIGINT';
                        if (col === 'dt') type = 'INT';
                        return {
                            name: col,
                            type: type,
                            description: ''
                        };
                    });
                    this.$emit('update:form', { ...this.form, viewFields });
                } else if (this.method === 'ONLINE' || this.method === 'EXCEL') {
                    // ONLINE 或 EXCEL 方式
                    this.$emit('preview');
                }
            },
            handleSave() {
                this.$emit('save');
            },
            handleSelectTable(table) {
                this.$emit('select-table', table);
            },
            isTableSelected(table) {
                if (!table || !this.form || !this.form.selectedTable) {
                    return false;
                }
                return this.form.selectedTable.name === table.name;
            },
            handleUpdateFieldDescription(fieldName, newDescription) {
                this.$emit('update-field-description', fieldName, newDescription);
            },
            handleUpdateViewFieldDescription(index, description) {
                this.$emit('update-view-field-description', index, description);
            },
            updateOnlineFieldEncryption(fieldName, isEncrypted) {
                if (!this.form || !this.form.tableMetadata || !this.form.tableMetadata.fields) return;
                const fields = [...this.form.tableMetadata.fields];
                const field = fields.find(f => f.name === fieldName);
                if (field) {
                    field.isEncrypted = isEncrypted;
                    // Initialize encryptionConfigs if not present and isEncrypted is true
                    if (isEncrypted && !field.encryptionConfigs) {
                        field.encryptionConfigs = [
                            { env: '沙箱环境', keyCenterEnv: 'Online', appKey: '', isSandbox: true },
                            { env: '生产环境', keyCenterEnv: '-', appKey: '', isProduction: true }
                        ];
                    }
                    this.$emit('update:form', {
                        ...this.form,
                        tableMetadata: {
                            ...this.form.tableMetadata,
                            fields: fields
                        }
                    });
                }
            },
            copyEncryptionConfig(sourceField) {
                if (!sourceField.encryptionConfigs) return;

                const fields = JSON.parse(JSON.stringify(this.form.tableMetadata.fields));
                const sourceConfig = JSON.stringify(sourceField.encryptionConfigs);

                let count = 0;
                fields.forEach(f => {
                    if (f.isEncrypted && f.name !== sourceField.name) {
                        f.encryptionConfigs = JSON.parse(sourceConfig);
                        count++;
                    }
                });

                this.$emit('update:form', {
                    ...this.form,
                    tableMetadata: {
                        ...this.form.tableMetadata,
                        fields: fields
                    }
                });
                alert('已将配置复制到其他 ' + count + ' 个加密字段');
            },
            updateExcelFieldEncryption(index, isEncrypted) {
                if (!this.form || !this.form.excelFields) return;
                const fields = [...this.form.excelFields];
                const field = fields[index];
                if (field) {
                    field.isEncrypted = isEncrypted;
                    if (isEncrypted && !field.encryptionConfigs) {
                        field.encryptionConfigs = [
                            { env: '沙箱环境', keyCenterEnv: 'Online', appKey: '', isSandbox: true },
                            { env: '生产环境', keyCenterEnv: '-', appKey: '', isProduction: true }
                        ];
                    }
                    this.$emit('update:form', {
                        ...this.form,
                        excelFields: fields
                    });
                }
            },
            copyExcelEncryptionConfig(sourceField) {
                if (!sourceField.encryptionConfigs) return;
                const fields = JSON.parse(JSON.stringify(this.form.excelFields));
                const sourceConfig = JSON.stringify(sourceField.encryptionConfigs);
                let count = 0;
                fields.forEach(f => {
                    if (f.isEncrypted && f.name !== sourceField.name) {
                        f.encryptionConfigs = JSON.parse(sourceConfig);
                        count++;
                    }
                });
                this.$emit('update:form', {
                    ...this.form,
                    excelFields: fields
                });
                alert('已将配置复制到其他 ' + count + ' 个加密字段同步');
            },
            selectCatalog(catalog) {
                this.$emit('update:form', { ...this.form, targetCatalog: catalog });
                this.showCatalogDropdown = false;
            },
            handleCreateNewCatalog(event) {
                // 阻止事件冒泡
                if (event) {
                    event.stopPropagation();
                }

                // 显示新建目录表单
                this.showNewCatalogForm = true;
                this.newCatalogParent = null;
                this.newCatalogName = '';
            },
            selectNewCatalogParent(parent) {
                this.newCatalogParent = parent;
            },
            cancelNewCatalog() {
                this.showNewCatalogForm = false;
                this.newCatalogParent = null;
                this.newCatalogName = '';
            },
            confirmNewCatalog() {
                if (!this.newCatalogParent) {
                    alert('请选择父目录');
                    return;
                }
                if (!this.newCatalogName || !this.newCatalogName.trim()) {
                    alert('请输入目录名称');
                    return;
                }

                // 创建新目录
                const newCatalog = {
                    id: 'new_' + Date.now(),
                    name: this.newCatalogName.trim(),
                    parentId: this.newCatalogParent.id,
                    parentName: this.newCatalogParent.name
                };

                // 选中新建的目录
                this.$emit('update:form', { ...this.form, targetCatalog: newCatalog });

                // 关闭表单和下拉框
                this.showNewCatalogForm = false;
                this.showCatalogDropdown = false;
                this.newCatalogParent = null;
                this.newCatalogName = '';

                console.log('创建新目录：', newCatalog);
            },
            testClusterConnection() {
                if (!this.form.clusterName) {
                    alert('请输入集群名称');
                    return;
                }

                this.testConnectionStatus = 'testing';
                this.testConnectionMessage = '正在连接集群...';

                // Simulate connection delay
                setTimeout(() => {
                    // Randomly succeed or fail for demo purposes
                    const success = Math.random() > 0.3;
                    if (success) {
                        this.testConnectionStatus = 'success';
                        this.testConnectionMessage = '连接成功';
                    } else {
                        this.testConnectionStatus = 'error';
                        this.testConnectionMessage = '连接失败：集群 ' + this.form.clusterName + ' 响应超时';
                    }

                    // Clear toast after 3 seconds
                    setTimeout(() => {
                        this.testConnectionStatus = null;
                        this.testConnectionMessage = '';
                    }, 3000);
                }, 1000);
            }
        },
        template: window.AppTemplates.CreateDataAssetWizard
    };

    // 5. Main App
    const { createApp, ref, computed } = Vue;
    const app = createApp({
        setup() {
            const catalogTree = ref(catalog);
            const selectedNode = ref(catalogTree.value[0]);
            const catalogActiveTab = ref('resources');
            const resourceTypeFilter = ref('ALL'); // New: resource type filter for resources tab
            const showCreateMenu = ref(false);
            const expandedNodes = ref(new Set());
            const showPermissionPopover = ref(false);
            const showSdkPopover = ref(false);
            const activePopoverNode = ref(null);
            const showDeleteConfirm = ref(false);
            const searchQuery = ref('');
            
            // 全局标签系统
            const globalTags = ref(['基础知识', '开发规范', 'PII', '核心业务']);
            window.App.addGlobalTag = (tag) => {
                if (!globalTags.value.includes(tag)) {
                    globalTags.value.push(tag);
                }
            };

            // 集群列表模拟数据
            const availableClusters = ref([
                { name: 'emr-cluster-01', type: 'EMR' },
                { name: 'starrocks-prod-01', type: 'StarRocks' },
                { name: 'doris-main-cluster', type: 'Doris' },
                { name: 'ck-realtime-cluster', type: 'ClickHouse' },
                { name: 'k8s-spark-compute-02', type: 'Spark' }
            ]);
            const showClusterSearch = ref(false);
            const testConnectionStatus = ref('idle'); // 'idle' | 'testing' | 'success' | 'error'
            const testConnectionMessage = ref('');
            const showEditNodeModal = ref(false);
            const editNodeForm = ref({
                name: '',
                parentId: ''
            });

            // 查找给定节点的父节点
            const findParent = (root, nodeId) => {
                if (!root.children) return null;
                for (const child of root.children) {
                    if (child.id === nodeId) return root;
                    if (child.type === 'CATALOG') {
                        const parent = findParent(child, nodeId);
                        if (parent) return parent;
                    }
                }
                return null;
            };

            // 获取资源所属的二级目录（root_all 的直接子节点）
            const getTopLevelCatalog = (nodeId) => {
                const root = catalogTree.value[0]; // root_all
                if (!root.children) return null;
                for (const topCat of root.children) {
                    if (topCat.id === nodeId) return topCat;
                    // 递归查找，如果找到了，说明 topCat 就是该节点的顶级先辈（二级目录）
                    const isDescendant = (cat, id) => {
                        if (cat.id === id) return true;
                        if (!cat.children) return false;
                        return cat.children.some(child => isDescendant(child, id));
                    };
                    if (isDescendant(topCat, nodeId)) return topCat;
                }
                return null;
            };

            const topLevelCatalog = computed(() => {
                if (!selectedNode.value || selectedNode.value.id === 'root_all') return null;
                return getTopLevelCatalog(selectedNode.value.id);
            });

            const topLevelCatalogName = computed(() => {
                return topLevelCatalog.value ? topLevelCatalog.value.name : '';
            });

            const eligibleCatalogs = computed(() => {
                const root = catalogTree.value[0];
                if (!root) return [];
                const result = [];

                // 检查节点是否是 targetId 节点本身或其后代
                const isSelfOrDescendant = (node, targetId) => {
                    if (node.id === targetId) return true;
                    if (!node.children) return false;
                    return node.children.some(child => isSelfOrDescendant(child, targetId));
                };

                const collect = (cat) => {
                    // 如果正在编辑某个目录，不能将该目录移动到自己或其子目录下
                    if (showEditNodeModal.value && selectedNode.value && selectedNode.value.type === 'CATALOG') {
                        if (isSelfOrDescendant(selectedNode.value, cat.id)) return;
                    }

                    result.push({ id: cat.id, name: cat.name });
                    if (cat.children) {
                        cat.children.filter(c => c.type === 'CATALOG').forEach(collect);
                    }
                };
                collect(root);
                return result;
            });

            const openEditNodeModal = (node) => {
                const parent = findParent(catalogTree.value[0], node.id);
                if (node.resourceType === 'DATA_ASSET') {
                    editNodeForm.value = {
                        name: node.chineseName || '',
                        code: node.name, // 对于数据资产，English Name 即为 Code
                        description: node.description || '',
                        parentId: parent ? parent.id : ''
                    };
                } else {
                    editNodeForm.value = {
                        name: node.name,
                        code: node.code || node.id,
                        description: node.description || '',
                        parentId: parent ? parent.id : ''
                    };
                }
                showEditNodeModal.value = true;
            };

            const saveEditNode = () => {
                if (!selectedNode.value) return;

                // 更新名称和描述
                if (selectedNode.value.resourceType === 'DATA_ASSET') {
                    selectedNode.value.chineseName = editNodeForm.value.name;
                    selectedNode.value.description = editNodeForm.value.description;
                } else {
                    selectedNode.value.name = editNodeForm.value.name;
                    selectedNode.value.description = editNodeForm.value.description;
                }

                // 执行移动逻辑 (如果父节点改变)
                const root = catalogTree.value[0];
                const currentParent = findParent(root, selectedNode.value.id);
                if (currentParent && editNodeForm.value.parentId && currentParent.id !== editNodeForm.value.parentId) {
                    // 1. 从旧父节点移除
                    const index = currentParent.children.findIndex(c => c.id === selectedNode.value.id);
                    if (index > -1) {
                        currentParent.children.splice(index, 1);
                    }
                    // 2. 加入新父节点
                    const findNodeById = (nodes, id) => {
                        for (const n of nodes) {
                            if (n.id === id) return n;
                            if (n.children) {
                                const found = findNodeById(n.children, id);
                                if (found) return found;
                            }
                        }
                        return null;
                    };
                    const newParent = findNodeById([root], editNodeForm.value.parentId);
                    if (newParent) {
                        if (!newParent.children) newParent.children = [];
                        newParent.children.push(selectedNode.value);
                    }
                }

                showEditNodeModal.value = false;
            };

            // 权限管理相关状态
            const showAddPermissionDialog = ref(false);
            const userSearchQuery = ref('');
            const selectedUser = ref(null);
            const selectedPermissionRole = ref('viewer'); // 'admin', 'editor', 'viewer'
            const currentPermissions = ref([
                { id: 1, name: 'Yuzhiyuan', email: 'yuzhiyuan@company.com', role: 'admin', avatar: 'YZ' },
                { id: 2, name: 'HR Team', email: 'hr@company.com', role: 'editor', avatar: 'HR' }
            ]);
            const inheritedPermissions = ref([
                { id: 3, name: 'SRE Team', email: 'sre@company.com', role: 'viewer', avatar: 'SR', inheritedFrom: '公共资源库' }
            ]);

            // 模拟用户列表
            const availableUsers = ref([
                { id: 101, name: 'Alice Wang', email: 'alice@company.com', avatar: 'AW' },
                { id: 102, name: 'Bob Chen', email: 'bob@company.com', avatar: 'BC' },
                { id: 103, name: 'Carol Li', email: 'carol@company.com', avatar: 'CL' },
                { id: 104, name: 'David Zhang', email: 'david@company.com', avatar: 'DZ' },
                { id: 105, name: 'Emma Liu', email: 'emma@company.com', avatar: 'EL' }
            ]);

            // 字典数据（统一版本管理）
            const dictionaries = ref({
                dict_01: {
                    id: 'dict_01',
                    name: 'K8s_Error_Codes',
                    description: 'Kubernetes 错误代码字典',
                    type: 'tree', // 'tree' | 'flat'
                    currentVersion: 'v1',
                    versions: [
                        {
                            version: 'v1',
                            createdAt: '2024-01-15',
                            createdBy: 'admin',
                            environments: {
                                online: 'v1',
                                pre: null,
                                test: null
                            },
                            enums: [
                                {
                                    id: 'enum_1',
                                    code: 'POD_FAILED',
                                    label: 'Pod 启动失败',
                                    description: 'Pod 无法成功启动，可能是镜像拉取失败或配置错误',
                                    children: [
                                        {
                                            id: 'enum_1_1',
                                            code: 'IMAGE_PULL_ERROR',
                                            label: '镜像拉取失败',
                                            description: '无法从镜像仓库拉取指定镜像',
                                            children: []
                                        },
                                        {
                                            id: 'enum_1_2',
                                            code: 'CONFIG_ERROR',
                                            label: '配置错误',
                                            description: 'Pod 配置文件格式错误或必填项缺失',
                                            children: []
                                        }
                                    ]
                                },
                                {
                                    id: 'enum_2',
                                    code: 'NODE_NOT_READY',
                                    label: '节点未就绪',
                                    description: 'K8s 节点状态异常，无法调度 Pod',
                                    children: []
                                }
                            ]
                        }
                    ],
                    associatedTags: ['技术标签/错误代码', '运维分类/K8s']
                },
                dict_02: {
                    id: 'dict_02',
                    name: 'Employee_Levels',
                    description: '员工职级字典',
                    type: 'tree', // 'tree' | 'flat'
                    currentVersion: 'v2',
                    versions: [
                        {
                            version: 'v2',
                            createdAt: '2024-01-20',
                            createdBy: 'hr_admin',
                            environments: {
                                online: null,
                                pre: null,
                                test: null
                            },
                            enums: [
                                {
                                    id: 'enum_10',
                                    code: 'IC',
                                    label: '个人贡献者',
                                    description: 'Individual Contributor 系列',
                                    children: [
                                        {
                                            id: 'enum_10_1',
                                            code: 'IC1',
                                            label: '初级工程师',
                                            description: '入职1-2年，需要指导',
                                            children: []
                                        },
                                        {
                                            id: 'enum_10_2',
                                            code: 'IC2',
                                            label: '工程师',
                                            description: '2-4年经验，独立工作',
                                            children: []
                                        },
                                        {
                                            id: 'enum_10_3',
                                            code: 'IC3',
                                            label: '高级工程师',
                                            description: '4-6年经验，技术专家',
                                            children: []
                                        }
                                    ]
                                },
                                {
                                    id: 'enum_11',
                                    code: 'M',
                                    label: '管理者',
                                    description: 'Manager 系列',
                                    children: [
                                        {
                                            id: 'enum_11_1',
                                            code: 'M1',
                                            label: '团队负责人',
                                            description: '管理5-10人团队',
                                            children: []
                                        },
                                        {
                                            id: 'enum_11_2',
                                            code: 'M2',
                                            label: '部门经理',
                                            description: '管理多个团队',
                                            children: []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            version: 'v1',
                            createdAt: '2023-06-10',
                            createdBy: 'hr_admin',
                            environments: {
                                online: null,
                                pre: 'v1',
                                test: 'v1'
                            },
                            enums: [
                                {
                                    id: 'enum_old_1',
                                    code: 'L1',
                                    label: '初级',
                                    description: '旧版职级体系',
                                    children: []
                                },
                                {
                                    id: 'enum_old_2',
                                    code: 'L2',
                                    label: '中级',
                                    description: '旧版职级体系',
                                    children: []
                                }
                            ]
                        }
                    ],
                    associatedTags: ['PII 个人信息/职级', '业务分类/HR']
                },
                dict_03: {
                    id: 'dict_03',
                    name: 'Gender_Codes',
                    description: '性别代码字典（单排结构示例）',
                    type: 'flat', // 单排字典
                    currentVersion: 'v1',
                    versions: [
                        {
                            version: 'v1',
                            createdAt: '2023-08-01',
                            createdBy: 'data_admin',
                            environments: {
                                online: 'v1',
                                pre: null,
                                test: null
                            },
                            enums: [
                                {
                                    id: 'enum_gender_1',
                                    code: 'M',
                                    label: '男',
                                    description: '男性',
                                    children: []
                                },
                                {
                                    id: 'enum_gender_2',
                                    code: 'F',
                                    label: '女',
                                    description: '女性',
                                    children: []
                                },
                                {
                                    id: 'enum_gender_3',
                                    code: 'U',
                                    label: '未知',
                                    description: '性别未知或不愿透露',
                                    children: []
                                }
                            ]
                        }
                    ],
                    associatedTags: ['PII 个人信息/性别'],
                    appliedFields: [
                        { id: 1, assetName: 'employee_info', fieldName: 'level', fieldType: 'STRING', description: '员工职级' },
                        { id: 2, assetName: 'job_history', fieldName: 'position_level', fieldType: 'STRING', description: '职位等级' },
                        { id: 3, assetName: 'promotion_request', fieldName: 'target_level', fieldType: 'STRING', description: '目标职级' }
                    ]
                }
            });

            // 数据资产版本数据（统一版本管理）
            const dataAssetVersions = ref({
                data_202: {
                    id: 'data_202',
                    currentVersion: '1.0.0',
                    versions: [
                        {
                            version: '1.0.1',
                            status: 'draft',
                            publishedAt: '',
                            publishedBy: 'data_admin',
                            changeLog: '新增 department_id 字段，修复 user_id 类型定义错误',
                            schema: 'current',
                            authRules: 'current'
                        },
                        {
                            version: '1.0.0',
                            status: 'published',
                            publishedAt: '2024-02-01',
                            publishedBy: 'data_admin',
                            changeLog: '首次发布，包含基础员工信息字段',
                            schema: 'current',
                            authRules: 'current'
                        },
                        {
                            version: '0.9.0',
                            status: 'published',
                            publishedAt: '2024-01-15',
                            publishedBy: 'data_dev',
                            changeLog: 'Beta 版本测试，仅包含部分测试数据',
                            schema: 'current',
                            authRules: 'current'
                        }
                    ],
                    isDraft: false
                }
            });

            // 全局权限规则
            const globalAuthRules = ref([
                {
                    id: 'global_rule_1',
                    name: 'PII 姓名脱敏规则',
                    tags: ['PII 个人信息/姓名'],
                    targetAudience: {
                        type: 'role',
                        value: '普通员工'
                    },
                    rowFilters: [],
                    columnVisibility: {
                        mode: 'mask',
                        fields: ['PII 个人信息/姓名']
                    },
                    appliedTables: [
                        { id: 'data_202', name: 'ks.emp.leave', env: 'online' },
                        { id: 'data_202_pre', name: 'ks.emp.leave', env: 'pre' },
                        { id: 'data_500', name: '用户画像表', env: 'online' }
                    ],
                    enabled: true
                },
                {
                    id: 'global_rule_2',
                    name: '部门数据隔离',
                    tags: ['业务分类/部门'],
                    targetAudience: {
                        type: 'role',
                        value: 'HRBP'
                    },
                    rowFilters: [
                        {
                            field: '业务分类/部门',
                            operator: 'IN',
                            value: 'visiting_user.as_hrbp.department_ids',
                            valueType: 'env_var'
                        }
                    ],
                    columnVisibility: {
                        mode: 'all',
                        fields: []
                    },
                    appliedTables: [
                        { id: 'data_202', name: '员工休假记录表', env: 'online' }
                    ],
                    enabled: false
                }
            ]);

            // 继承的权限规则 (Mock Data)
            const inheritedAuthRules = ref([
                {
                    id: 'inherited_rule_1',
                    name: '全员基础数据访问',
                    tags: ['通用标签/基础信息'],
                    targetAudience: {
                        type: 'role',
                        value: '普通员工'
                    },
                    sourceCatalogName: '公共资源库', // 来源目录名称
                    appliedTables: [
                        { id: 'data_101', name: '部门列表' },
                        { id: 'data_102', name: '公共字典' }
                    ],
                    enabled: true
                },
                {
                    id: 'inherited_rule_2',
                    name: '运维审计日志访问',
                    tags: ['运维分类/审计'],
                    targetAudience: {
                        type: 'role',
                        value: 'SRE'
                    },
                    sourceCatalogName: '全部',
                    appliedTables: [
                        { id: 'data_801', name: '全局日志' }
                    ],
                    enabled: true
                }
            ]);

            const showRuleDetail = (rule) => {
                alert(`查看规则详情：${rule.name}\n来源于：${rule.sourceCatalogName || '当前目录'}`);
            };
            const showGlobalRuleEdit = ref(false);
            const editingGlobalRule = ref(null);
            const editingGlobalRuleIndex = ref(-1);
            const showAppliedTables = ref(null);
            // 新增 showInheritedAppliedTables
            const showInheritedAppliedTables = ref(null);
            const showAudienceDropdown = ref(false);
            const showSearchDropdown = ref(false);
            const searchActiveTab = ref('ALL');
            const showCreateDataAssetWizard = ref(false);
            const createDataAssetStep = ref(1); // 1: 选择方式, 2: 填写表单, 3: 预览
            const createDataAssetMethod = ref(null); // 'VIEW', 'ONLINE', 'EXCEL'

            // 新建文件夹弹窗状态
            const showNewFolderDialog = ref(false);
            const newFolderParent = ref(null);
            const newFolderName = ref('');
            const newFolderCode = ref('');

            // 创建数据资产的数据
            const createDataAssetForm = ref({
                // 通用字段
                name: '',
                description: '',
                targetCatalog: null,

                // 方式1: 从已有数据资产构建新视图
                viewSql: '',

                // 方式2: 从生产环境接入
                dataSource: '', // 'tiangong', 'datahub', 'mysql'
                selectedTable: null, // 改为单选表
                tableMetadata: null, // 选中表的元数据（包含可编辑的字段描述）
                sourceCatalog: null,

                // 方式3: Excel 文件
                excelFile: null,
                excelPreview: null,
                // 新增字段用于三步式流程
                uploadedFile: null, // 上传的文件信息
                availableSheets: [], // 可用的 Sheet 列表
                selectedSheet: null, // 选中的 Sheet
                excelFields: [], // Excel 字段元数据
                tableName: '', // 表名称
                clusterName: 'emr-cluster-01', // 集群名称
                encryptionConfigs: [
                    { env: '沙箱环境', keyCenterEnv: 'Online', appKeyIdempotent: '', appKeyNonIdempotent: '', isSandbox: true },
                    { env: '生产环境', keyCenterEnv: '-', appKeyIdempotent: '', appKeyNonIdempotent: '', isProduction: true }
                ],
                isParsing: false // 模拟解析状态
            });

            // 模拟数据源表列表及其元数据
            const dataSourceTables = ref({
                mysql: [
                    {
                        name: 'raw.users',
                        schema: 'raw',
                        env: 'online',
                        description: '用户基础表',
                        fields: [
                            { name: 'id', type: 'BIGINT', description: '用户ID', isPrimary: true, isEncrypted: false, isPartition: false, stats: '唯一值', tags: [] },
                            { name: 'username', type: 'VARCHAR(100)', description: '用户名', isPrimary: false, isEncrypted: false, isPartition: false, stats: '唯一值', tags: [] },
                            { name: 'email', type: 'VARCHAR(255)', description: '邮箱地址', isPrimary: false, isEncrypted: true, isPartition: false, stats: '唯一值', tags: ['PII 个人信息:/邮箱'] },
                            { name: 'phone', type: 'VARCHAR(20)', description: '手机号', isPrimary: false, isEncrypted: true, isPartition: false, stats: '唯一值', tags: ['PII 个人信息:/手机号'] },
                            { name: 'created_at', type: 'TIMESTAMP', description: '创建时间', isPrimary: false, isEncrypted: false, isPartition: false, stats: '2020-01-01 至今', tags: [] },
                            { name: 'dt', type: 'STRING', description: '分区日期', isPrimary: false, isEncrypted: false, isPartition: true, stats: '20200101-20240131', tags: [] }
                        ]
                    },
                    {
                        name: 'test.users_backup',
                        schema: 'test',
                        env: 'offline',
                        description: '用户备份表',
                        fields: [
                            { name: 'id', type: 'BIGINT', description: '用户ID', isPrimary: true, isEncrypted: false, isPartition: false },
                            { name: 'username', type: 'VARCHAR(100)', description: '用户名', isPrimary: false, isEncrypted: false, isPartition: false }
                        ]
                    }
                ],
                hive: [
                    {
                        name: 'dw.dim_user',
                        schema: 'dw',
                        env: 'online',
                        description: '用户维度表',
                        fields: [
                            { name: 'user_key', type: 'BIGINT', description: '用户代理键', isPrimary: true, isEncrypted: false, isPartition: false, stats: '唯一值' },
                            { name: 'user_id', type: 'BIGINT', description: '用户业务ID', isPrimary: false, isEncrypted: false, isPartition: false, stats: '唯一值' },
                            { name: 'username', type: 'VARCHAR(100)', description: '用户名', isPrimary: false, isEncrypted: false, isPartition: false, stats: '文本' },
                            { name: 'age', type: 'INT', description: '年龄', isPrimary: false, isEncrypted: false, isPartition: false, stats: '18-99' },
                            { name: 'gender', type: 'VARCHAR(10)', description: '性别', isPrimary: false, isEncrypted: false, isPartition: false, stats: 'M/F/U' }
                        ]
                    }
                ],
                trino: [
                    {
                        name: 'ads.user_active_metrics',
                        schema: 'ads',
                        env: 'online',
                        description: '用户活跃指标表',
                        fields: [
                            { name: 'dt', type: 'STRING', description: '日期', isPrimary: true, isEncrypted: false, isPartition: true },
                            { name: 'user_count', type: 'BIGINT', description: '用户数', isPrimary: false, isEncrypted: false, isPartition: false }
                        ]
                    }
                ],
                tiangong_ck: [
                    {
                        name: 'realtime.event_log',
                        schema: 'realtime',
                        env: 'online',
                        description: '实时事件日志',
                        fields: [
                            { name: 'event_id', type: 'STRING', description: '事件ID', isPrimary: true, isEncrypted: false, isPartition: false },
                            { name: 'event_time', type: 'TIMESTAMP', description: '事件时间', isPrimary: false, isEncrypted: false, isPartition: true }
                        ]
                    }
                ],
                self_built_ck: [
                    {
                        name: 'local.debug_log',
                        schema: 'local',
                        env: 'offline',
                        description: '本地调试日志',
                        fields: [
                            { name: 'id', type: 'INT', description: 'ID', isPrimary: true, isEncrypted: false, isPartition: false },
                            { name: 'log_content', type: 'STRING', description: '日志内容', isPrimary: false, isEncrypted: false, isPartition: false }
                        ]
                    }
                ]
            });

            const selectNode = (node) => {
                selectedNode.value = node;
                showSearchDropdown.value = false;
                searchQuery.value = '';
            };

            const handleRenameNode = (node) => {
                openEditNodeModal(node);
            };

            const selectNewFolderParent = (parent) => {
                newFolderParent.value = parent;
            };

            const cancelNewFolder = () => {
                showNewFolderDialog.value = false;
                newFolderParent.value = null;
                newFolderName.value = '';
                newFolderCode.value = '';
            };

            const confirmNewFolder = () => {
                if (!newFolderParent.value) {
                    alert('请选择父目录');
                    return;
                }
                if (!newFolderName.value || !newFolderName.value.trim()) {
                    alert('请输入目录名称');
                    return;
                }
                if (!newFolderCode.value || !newFolderCode.value.trim()) {
                    alert('请输入目录 Code');
                    return;
                }

                // 创建新目录
                const newCatalog = {
                    id: newFolderCode.value.trim() || ('new_' + Date.now()),
                    name: newFolderName.value.trim(),
                    code: newFolderCode.value.trim(),
                    type: 'CATALOG',
                    isOpen: false,
                    children: []
                };

                // 找到父节点并添加
                const findAndAddToParent = (nodes) => {
                    for (let node of nodes) {
                        if (node.id === newFolderParent.value.id) {
                            if (!node.children) {
                                node.children = [];
                            }
                            node.children.push(newCatalog);
                            node.isOpen = true;
                            return true;
                        }
                        if (node.children && findAndAddToParent(node.children)) {
                            return true;
                        }
                    }
                    return false;
                };

                findAndAddToParent(catalogTree.value);

                // 关闭弹窗
                showNewFolderDialog.value = false;
                newFolderParent.value = null;
                newFolderName.value = '';
                newFolderCode.value = '';

                console.log('创建新文件夹：', newCatalog);
            };

            const toggleNode = (node) => { /* handled in component */ };
            // 新建字典状态
            const showCreateDictionaryWizard = ref(false);
            const createDictionaryForm = ref({
                parentId: 'root_all',
                name: '',
                code: '',
                description: '',
                isTree: false,
                syncMethod: null // 'manual' or 'api'
            });

            const createDictionary = () => {
                try {
                    const form = createDictionaryForm.value;

                    // 验证必填字段
                    if (!form.name) {
                        alert('请填写字典名称');
                        return;
                    }
                    if (!form.parentId) {
                        alert('请选择放置目录');
                        return;
                    }
                    // 使用用户输入的 Code 作为 ID
                    const generatedId = form.code || 'dict_' + Date.now();

                    // 查找目标目录节点
                    const findNodeById = (nodes, id) => {
                        for (const node of nodes) {
                            if (node.id === id) return node;
                            if (node.children) {
                                const found = findNodeById(node.children, id);
                                if (found) return found;
                            }
                        }
                        return null;
                    };

                    const parent = findNodeById(catalogTree.value, form.parentId);

                    if (parent) {
                        const newDict = {
                            id: generatedId,
                            name: form.name,
                            code: form.code, // Dictionary code
                            type: 'RESOURCE',
                            resourceType: 'DICTIONARY',
                            description: form.description || '',
                            isTree: form.isTree,
                            syncMethod: null, // Initialized as null, user will select in detail page
                            items: [] // Enum items
                        };

                        if (!parent.children) parent.children = [];
                        parent.children.push(newDict);

                        // Ensure dictionaries object also has it if applicable
                        if (!dictionaries.value[generatedId]) {
                            dictionaries.value[generatedId] = {
                                ...newDict,
                                currentVersion: 'v1',
                                versions: [{
                                    version: 'v1',
                                    createdAt: new Date().toISOString().split('T')[0],
                                    createdBy: 'admin',
                                    enums: []
                                }]
                            };
                        }

                        // Select the newly created dictionary
                        selectNode(newDict);

                        // Close dialog and reset form
                        showCreateDictionaryWizard.value = false;
                        createDictionaryForm.value = {
                            parentId: 'root_all',
                            name: '',
                            code: '',
                            description: '',
                            isTree: false,
                            syncMethod: null
                        };
                    } else {
                        alert('无法找到目录，创建失败');
                        showCreateDictionaryWizard.value = false;
                    }
                } catch (error) {
                    console.error('创建字典时出错:', error);
                    alert('创建字典时出错: ' + error.message);
                    // 确保对话框关闭
                    showCreateDictionaryWizard.value = false;
                    createDictionaryForm.value = {
                        parentId: 'root_common',
                        structure: 'FLAT',
                        name: '',
                        code: '',
                        description: ''
                    };
                }
            };

            // 新建知识库状态
            const showCreateWikiWizard = ref(false);
            const createWikiForm = ref({
                parentId: 'root_common', // 默认选中公共资源库
                name: '',
                code: '',
                description: ''
            });

            const createWiki = () => {
                try {
                    const form = createWikiForm.value;

                    // 验证必填字段
                    if (!form.name) {
                        alert('请填写知识库名称');
                        return;
                    }
                    if (!form.parentId) {
                        alert('请选择放置目录');
                        return;
                    }
                    if (!form.description) {
                        alert('请填写知识库描述');
                        return;
                    }

                    // 自动生成 ID（时间戳）
                    const generatedId = 'wiki_' + Date.now();

                    // 查找目标目录节点
                    const findNodeById = (nodes, id) => {
                        for (const node of nodes) {
                            if (node.id === id) return node;
                            if (node.children) {
                                const found = findNodeById(node.children, id);
                                if (found) return found;
                            }
                        }
                        return null;
                    };

                    const parent = findNodeById(catalogTree.value, form.parentId);

                    if (parent) {
                        const newWiki = {
                            id: generatedId,
                            name: form.name,
                            code: generatedId,
                            description: form.description,
                            type: 'RESOURCE',
                            resourceType: 'DOCUMENT',
                            // Add a minimal internal doc list
                            files: [],
                            // 标记为新创建的文档，需要选择创建方式
                            isNew: true
                        };

                        if (!parent.children) {
                            parent.children = [];
                        }
                        parent.children.push(newWiki);

                        // 选中新创建的知识库
                        selectedNode.value = newWiki;

                        // 关闭弹窗并重置表单
                        showCreateWikiWizard.value = false;
                        createWikiForm.value = {
                            parentId: 'root_common',
                            name: '',
                            description: ''
                        };
                    } else {
                        alert('无法找到目录，创建失败');
                        showCreateWikiWizard.value = false;
                    }
                } catch (error) {
                    console.error('创建知识库时出错:', error);
                    alert('创建知识库时出错: ' + error.message);
                    showCreateWikiWizard.value = false;
                }
            };

            const createItem = (type) => {
                if (type === 'DICTIONARY') {
                    showCreateMenu.value = false;
                    showCreateDictionaryWizard.value = true;
                    // 重置表单
                    createDictionaryForm.value = {
                        parentId: 'root_common',
                        structure: 'FLAT',
                        name: '',
                        code: ''
                    };
                    return;
                }

                if (type === 'DOCUMENT') {
                    showCreateMenu.value = false;
                    showCreateWikiWizard.value = true;
                    // 重置表单
                    createWikiForm.value = {
                        parentId: 'root_common',
                        name: '',
                        code: '',
                        description: ''
                    };
                    return;
                }

                if (type === 'DATA_ASSET') {
                    showCreateDataAssetWizard.value = true;
                    createDataAssetStep.value = 1;
                    createDataAssetMethod.value = null;
                    // 重置表单
                    createDataAssetForm.value = {
                        name: '',
                        description: '',
                        targetCatalog: selectedNode.value?.type === 'CATALOG' ? selectedNode.value : null,
                        viewSql: '',
                        dataSource: '',
                        selectedTable: null,
                        tableMetadata: null,
                        sourceCatalog: null,
                        excelFile: null,
                        excelPreview: null,
                        tableName: '',
                        clusterName: 'emr-cluster-01',
                        encryptionConfigs: [
                            { env: '沙箱环境', keyCenterEnv: 'Online', appKeyIdempotent: '', appKeyNonIdempotent: '', isSandbox: true },
                            { env: '生产环境', keyCenterEnv: '-', appKeyIdempotent: '', appKeyNonIdempotent: '', isProduction: true }
                        ]
                    };
                } else if (type === 'CATALOG') {
                    // 显示新建文件夹弹窗
                    showNewFolderDialog.value = true;
                    newFolderParent.value = null;
                    newFolderName.value = '';
                } else {
                    alert('Create: ' + type);
                }
                showCreateMenu.value = false;
            };

            const selectCluster = (cluster) => {
                createDataAssetForm.value.clusterName = cluster.name;
                showClusterSearch.value = false;
            };

            const filteredClusters = computed(() => {
                const query = createDataAssetForm.value.clusterName?.toLowerCase() || '';
                if (!query) return availableClusters.value;
                return availableClusters.value.filter(c =>
                    c.name.toLowerCase().includes(query) ||
                    c.type.toLowerCase().includes(query)
                );
            });

            const testClusterConnection = () => {
                const clusterName = createDataAssetForm.value.clusterName;
                if (!clusterName) {
                    alert('请输入集群名称');
                    return;
                }

                testConnectionStatus.value = 'testing';
                testConnectionMessage.value = '正在测试连接...';

                // 模拟连接过程
                setTimeout(() => {
                    const isSuccess = Math.random() > 0.3; // 70% 成功率
                    if (isSuccess) {
                        testConnectionStatus.value = 'success';
                        testConnectionMessage.value = '连接成功';
                    } else {
                        testConnectionStatus.value = 'error';
                        testConnectionMessage.value = '连接失败，请检查配置';
                    }

                    // 3秒后清除消息，但保留状态
                    setTimeout(() => {
                        testConnectionMessage.value = '';
                    }, 3000);
                }, 1500);
            };

            const selectCreateMethod = (method) => {
                createDataAssetMethod.value = method;
                createDataAssetStep.value = 2;
                // 重置表单数据源的选中状态
                if (method === 'ONLINE') {
                    createDataAssetForm.value.dataSource = '';
                    createDataAssetForm.value.selectedTable = null;
                    createDataAssetForm.value.tableMetadata = null;
                }
            };

            const goBackCreateWizard = () => {
                if (createDataAssetStep.value === 1) {
                    closeCreateWizard();
                } else if (createDataAssetMethod.value === 'ONLINE') {
                    if (createDataAssetStep.value === 4) createDataAssetStep.value = 3;
                    else if (createDataAssetStep.value === 3) {
                        createDataAssetStep.value = 2;
                        createDataAssetForm.value.selectedTable = null;
                        createDataAssetForm.value.tableMetadata = null;
                    } else createDataAssetStep.value = 1;
                } else if (createDataAssetMethod.value === 'VIEW') {
                    if (createDataAssetStep.value === 4) createDataAssetStep.value = 3;
                    else if (createDataAssetStep.value === 3) createDataAssetStep.value = 2;
                    else createDataAssetStep.value = 1;
                } else if (createDataAssetMethod.value === 'EXCEL') {
                    if (createDataAssetStep.value === 4) createDataAssetStep.value = 3;
                    else if (createDataAssetStep.value === 3) createDataAssetStep.value = 2;
                    else createDataAssetStep.value = 1;
                } else {
                    createDataAssetStep.value = 1;
                }
            };

            const closeCreateWizard = () => {
                showCreateDataAssetWizard.value = false;
                createDataAssetStep.value = 1;
                createDataAssetMethod.value = null;
            };

            const previewCreateView = () => {
                if (createDataAssetMethod.value === 'EXCEL' && createDataAssetStep.value === 2) {
                    // Excel 方式从 Step 2 进入 Step 3
                    createDataAssetStep.value = 3;
                } else if (createDataAssetMethod.value === 'VIEW' && createDataAssetStep.value === 2) {
                    // VIEW 方式从 Step 2 进入 Step 3
                    createDataAssetStep.value = 3;
                } else {
                    // 其他方式进入步骤 4
                    createDataAssetStep.value = 4;
                }
            };

            const saveCreateDataAsset = () => {
                // 模拟保存
                alert('创建成功！');
                closeCreateWizard();
                // 这里应该刷新树或跳转到新创建的节点
            };

            const toggleTableSelection = (table) => {
                // 改为单选模式
                if (createDataAssetForm.value.selectedTable &&
                    createDataAssetForm.value.selectedTable.name === table.name) {
                    // 如果点击已选中的表，取消选择
                    createDataAssetForm.value.selectedTable = null;
                    createDataAssetForm.value.tableMetadata = null;
                } else {
                    // 选择新表，并加载元数据
                    createDataAssetForm.value.selectedTable = table;
                    // 深拷贝字段元数据，用于编辑
                    createDataAssetForm.value.tableMetadata = {
                        ...table,
                        fields: table.fields.map(f => {
                            const newField = { ...f };
                            if (newField.isEncrypted) {
                                newField.encryptionConfigs = [
                                    { env: '沙箱环境', keyCenterEnv: 'Online', appKey: '', isSandbox: true },
                                    { env: '生产环境', keyCenterEnv: '-', appKey: '', isProduction: true }
                                ];
                            }
                            return newField;
                        })
                    };
                    // 进入元数据预览步骤（step 3）
                    createDataAssetStep.value = 3;
                }
            };

            const updateFieldDescription = (fieldName, newDescription) => {
                if (createDataAssetForm.value.tableMetadata) {
                    const field = createDataAssetForm.value.tableMetadata.fields.find(f => f.name === fieldName);
                    if (field) {
                        field.description = newDescription;
                    }
                }
            };

            const updateViewFieldDescription = (index, description) => {
                if (createDataAssetForm.value.viewFields && createDataAssetForm.value.viewFields[index]) {
                    createDataAssetForm.value.viewFields[index].description = description;
                }
            };

            const proceedToFinalStep = () => {
                if (createDataAssetMethod.value === 'VIEW' && createDataAssetStep.value === 2) {
                    createDataAssetStep.value = 3;
                } else if ((createDataAssetMethod.value === 'VIEW' || createDataAssetMethod.value === 'ONLINE' || createDataAssetMethod.value === 'EXCEL') && createDataAssetStep.value === 3) {
                    createDataAssetStep.value = 4;
                } else {
                    createDataAssetStep.value = 4;
                }
            };

            const isTableSelected = (table) => {
                return createDataAssetForm.value.selectedTable &&
                    createDataAssetForm.value.selectedTable.name === table.name;
            };

            // Excel 文件上传 Mock 函数
            const handleFileUpload = (event) => {
                const file = event.target.files[0];
                if (!file) return;

                // 准备状态
                createDataAssetForm.value.uploadedFile = {
                    name: file.name,
                    size: `${(file.size / 1024).toFixed(2)} KB`
                };
                createDataAssetForm.value.availableSheets = [];
                createDataAssetForm.value.selectedSheet = null;
                createDataAssetForm.value.isParsing = true;

                // 模拟解析延迟
                setTimeout(() => {
                    createDataAssetForm.value.isParsing = false;
                    // Mock 可用的 Sheets
                    createDataAssetForm.value.availableSheets = [
                        { name: 'Sheet1', rowCount: 1250, columnCount: 8 },
                        { name: '员工数据', rowCount: 856, columnCount: 12 },
                        { name: '统计汇总', rowCount: 45, columnCount: 6 }
                    ];
                }, 1500);
            };

            const selectSheet = (sheet) => {
                createDataAssetForm.value.selectedSheet = sheet;
                createDataAssetForm.value.tableName = sheet.name;

                // Mock Excel 字段元数据
                createDataAssetForm.value.excelFields = [
                    { name: 'employee_id', type: 'BIGINT', length: '20', description: '员工ID', isEncrypted: false, isPartition: false, stats: '唯一值' },
                    { name: 'employee_name', type: 'STRING', length: '128', description: '员工姓名', isEncrypted: true, isPartition: false, stats: '文本' },
                    { name: 'department', type: 'STRING', length: '64', description: '部门', isEncrypted: false, isPartition: false, stats: '枚举值' },
                    { name: 'position', type: 'STRING', length: '64', description: '职位', isEncrypted: false, isPartition: false, stats: '枚举值' },
                    { name: 'hire_date', type: 'DATE', length: '', description: '入职日期', isEncrypted: false, isPartition: false, stats: '2015-01-01 至今' },
                    { name: 'salary', type: 'DOUBLE', length: '10,2', description: '薪资', isEncrypted: true, isPartition: false, stats: '数值范围' },
                    { name: 'email', type: 'STRING', length: '255', description: '邮箱', isEncrypted: true, isPartition: false, stats: '唯一值' },
                    { name: 'status', type: 'STRING', length: '32', description: '状态', isEncrypted: false, isPartition: false, stats: 'ACTIVE/INACTIVE' }
                ];
            };

            const updateExcelField = (index, field, value) => {
                if (createDataAssetForm.value.excelFields[index]) {
                    createDataAssetForm.value.excelFields[index][field] = value;
                }
            };

            const toggleExpand = (nodeId) => {
                if (expandedNodes.value.has(nodeId)) {
                    expandedNodes.value.delete(nodeId);
                } else {
                    expandedNodes.value.add(nodeId);
                }
                expandedNodes.value = new Set(expandedNodes.value);
            };

            const isExpanded = (nodeId) => expandedNodes.value.has(nodeId);

            const openPermissionPopover = (node) => {
                activePopoverNode.value = node;
                showPermissionPopover.value = true;
                showSdkPopover.value = false;

                // 模拟权限数据
                if (node.type === 'CATALOG') {
                    // 文件夹：展示模拟的已有权限
                    currentPermissions.value = [
                        { id: 1, name: 'Yuzhiyuan', email: 'yuzhiyuan@company.com', role: 'admin', avatar: 'YZ' },
                        { id: 2, name: 'HR Team', email: 'hr@company.com', role: 'editor', avatar: 'HR' }
                    ];
                } else {
                    // 文件：模拟“没有对文件单独授权”的状态
                    currentPermissions.value = [];
                }
            };

            const openSdkPopover = (node) => {
                activePopoverNode.value = node;
                showSdkPopover.value = true;
                showPermissionPopover.value = false;
            };

            const openAddPermissionDialog = () => {
                showAddPermissionDialog.value = true;
                userSearchQuery.value = '';
                selectedUser.value = null;
                selectedPermissionRole.value = 'viewer';
            };

            const closeAddPermissionDialog = () => {
                showAddPermissionDialog.value = false;
                userSearchQuery.value = '';
                selectedUser.value = null;
                selectedPermissionRole.value = 'viewer';
            };

            const selectUser = (user) => {
                selectedUser.value = user;
            };

            const selectPermissionRole = (role) => {
                selectedPermissionRole.value = role;
            };

            const confirmAddPermission = () => {
                if (!selectedUser.value) {
                    alert('请选择用户');
                    return;
                }

                // 添加新权限
                currentPermissions.value.push({
                    id: Date.now(),
                    name: selectedUser.value.name,
                    email: selectedUser.value.email,
                    role: selectedPermissionRole.value,
                    avatar: selectedUser.value.avatar
                });

                closeAddPermissionDialog();
            };

            const removePermission = (permissionId) => {
                currentPermissions.value = currentPermissions.value.filter(p => p.id !== permissionId);
            };

            const filteredUsers = computed(() => {
                if (!userSearchQuery.value.trim()) {
                    return availableUsers.value;
                }
                const query = userSearchQuery.value.toLowerCase();
                return availableUsers.value.filter(user =>
                    user.name.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query)
                );
            });

            const getRoleLabel = (role) => {
                const labels = {
                    admin: '管理员',
                    editor: '可编辑',
                    viewer: '可查看'
                };
                return labels[role] || role;
            };

            const getRoleBadgeClass = (role) => {
                const classes = {
                    admin: 'bg-indigo-100 text-indigo-700',
                    editor: 'bg-green-100 text-green-700',
                    viewer: 'bg-slate-100 text-slate-700'
                };
                return classes[role] || 'bg-slate-100 text-slate-700';
            };

            // API 访问管理功能
            const generateToken = (prefix) => {
                const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
                let token = '';
                for (let i = 0; i < 32; i++) {
                    token += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return `ks_${prefix}_${token}`;
            };

            const enableApiAccess = () => {
                if (!selectedNode.value) return;

                selectedNode.value.apiAccess = {
                    enabled: true,
                    onlineToken: generateToken('online'),
                    preToken: generateToken('pre'),
                    onlineTokenVisible: false,
                    preTokenVisible: false,
                    createdAt: new Date().toISOString()
                };
            };

            const toggleTokenVisibility = (env) => {
                if (!selectedNode.value?.apiAccess) return;

                if (env === 'online') {
                    selectedNode.value.apiAccess.onlineTokenVisible = !selectedNode.value.apiAccess.onlineTokenVisible;
                } else if (env === 'pre') {
                    selectedNode.value.apiAccess.preTokenVisible = !selectedNode.value.apiAccess.preTokenVisible;
                }
            };

            const copyToken = (token) => {
                if (!token) return;
                navigator.clipboard.writeText(token).then(() => {
                    alert('Token 已复制到剪贴板');
                }).catch(() => {
                    alert('复制失败，请手动复制');
                });
            };

            const maskToken = (token) => {
                if (!token) return '';
                const prefix = token.substring(0, 10); // ks_online_ 或 ks_pre_
                return prefix + '************************';
            };

            const resetEnvToken = (env) => {
                const envName = env === 'online' ? '生产环境' : '预发环境';
                const confirmed = confirm(`⚠️ 重置后，原 ${envName} Token 将立即失效。所有正在使用该 Token 的外部应用（Agent）将无法访问，直到将新 Token 替换。是否确认重置？`);
                if (confirmed && selectedNode.value?.apiAccess) {
                    if (env === 'online') {
                        selectedNode.value.apiAccess.onlineToken = generateToken('online');
                        selectedNode.value.apiAccess.onlineTokenVisible = false;
                    } else if (env === 'pre') {
                        selectedNode.value.apiAccess.preToken = generateToken('pre');
                        selectedNode.value.apiAccess.preTokenVisible = false;
                    }
                    alert(`✓ ${envName} Token 已重置，请及时更新外部应用的配置`);
                }
            };

            const confirmResetToken = () => {
                const confirmed = confirm('⚠️ 重置后，原 Token 将立即失效。所有正在使用原 Token 的外部应用（Agent）将无法获取该目录数据，直到将新 Token 替换。是否确认重置？');
                if (confirmed && selectedNode.value?.apiAccess) {
                    selectedNode.value.apiAccess.onlineToken = generateToken('online');
                    selectedNode.value.apiAccess.preToken = generateToken('pre');
                    selectedNode.value.apiAccess.onlineTokenVisible = false;
                    selectedNode.value.apiAccess.preTokenVisible = false;
                    alert('✓ Token 已重置，请及时更新外部应用的配置');
                }
            };

            const confirmDisableApiAccess = () => {
                const confirmed = confirm('⚠️ 停用后，原 Token 将立即失效。所有正在使用原 Token 的外部应用（Agent）将无法获取该目录数据。是否确认停用？');
                if (confirmed && selectedNode.value) {
                    selectedNode.value.apiAccess = {
                        enabled: false,
                        onlineToken: null,
                        preToken: null
                    };
                    alert('✓ API 访问已停用');
                }
            };

            // 文件夹设置 - 应用授权管理
            const showAppAuthModal = ref(false);
            const appSearchQuery = ref('');
            const selectedAppsForAuth = ref([]);

            // Mock available apps
            const availableApps = ref([
                { id: 'app_001', name: 'HR管理系统', appKey: 'ak_hr_2024_prod_001' },
                { id: 'app_002', name: '财务报表平台', appKey: 'ak_finance_2024_prod_002' },
                { id: 'app_003', name: 'OA办公系统', appKey: 'ak_oa_2024_prod_003' },
                { id: 'app_004', name: '数据分析平台', appKey: 'ak_analytics_2024_prod_004' },
                { id: 'app_005', name: '客户管理系统', appKey: 'ak_crm_2024_prod_005' },
                { id: 'app_006', name: '供应链管理', appKey: 'ak_scm_2024_prod_006' },
                { id: 'app_007', name: '项目协作工具', appKey: 'ak_pm_2024_prod_007' },
                { id: 'app_008', name: '智能客服平台', appKey: 'ak_cs_2024_prod_008' }
            ]);

            const filteredAvailableApps = computed(() => {
                const query = appSearchQuery.value.toLowerCase().trim();
                if (!query) return availableApps.value;

                return availableApps.value.filter(app =>
                    app.name.toLowerCase().includes(query) ||
                    app.appKey.toLowerCase().includes(query)
                );
            });

            const openAppAuthModal = () => {
                showAppAuthModal.value = true;
                appSearchQuery.value = '';
                selectedAppsForAuth.value = [];
            };

            const closeAppAuthModal = () => {
                showAppAuthModal.value = false;
                appSearchQuery.value = '';
                selectedAppsForAuth.value = [];
            };

            const confirmAppAuthorization = () => {
                if (!selectedNode.value || selectedAppsForAuth.value.length === 0) return;

                // Initialize authorizedApps if not exists
                if (!selectedNode.value.authorizedApps) {
                    selectedNode.value.authorizedApps = [];
                }

                // Add selected apps
                const currentUser = '张三'; // In real app, get from auth context
                const currentTime = new Date().toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                selectedAppsForAuth.value.forEach(appId => {
                    const app = availableApps.value.find(a => a.id === appId);
                    if (app && !selectedNode.value.authorizedApps.find(a => a.id === appId)) {
                        selectedNode.value.authorizedApps.push({
                            id: appId,
                            name: app.name,
                            appKey: app.appKey,
                            authorizer: currentUser,
                            authorizedAt: currentTime
                        });
                    }
                });

                closeAppAuthModal();
            };

            const removeAuthorizedApp = (index) => {
                if (!selectedNode.value?.authorizedApps) return;

                const app = selectedNode.value.authorizedApps[index];
                const confirmed = confirm(`确定要删除授权应用"${app.name}"吗？删除后该应用将无法访问此目录。`);

                if (confirmed) {
                    selectedNode.value.authorizedApps.splice(index, 1);
                }
            };

            const closePopovers = () => {
                showPermissionPopover.value = false;
                showSdkPopover.value = false;
                activePopoverNode.value = null;
            };

            const confirmDelete = () => {
                alert(`删除资源: ${selectedNode.value.name}`);
                showDeleteConfirm.value = false;
            };

            // 全局权限规则方法
            const openGlobalRuleEdit = (index) => {
                editingGlobalRuleIndex.value = index;
                if (index === -1) {
                    // 新建
                    editingGlobalRule.value = {
                        name: '',
                        tags: [],
                        targetAudience: {
                            type: 'role',
                            value: ''
                        },
                        rowFilters: [],
                        columnVisibility: {
                            mode: 'all',
                            fields: []
                        },
                        enabled: true
                    };
                } else {
                    // 编辑
                    const rule = JSON.parse(JSON.stringify(globalAuthRules.value[index]));
                    if (!rule.tags) rule.tags = [];
                    editingGlobalRule.value = rule;
                }
                showGlobalRuleEdit.value = true;
            };

            const closeGlobalRuleEdit = () => {
                showGlobalRuleEdit.value = false;
                editingGlobalRule.value = null;
                editingGlobalRuleIndex.value = -1;
            };

            const saveGlobalRule = (rule) => {
                if (editingGlobalRuleIndex.value === -1) {
                    // 新建
                    rule.id = 'global_rule_' + Date.now();
                    rule.appliedTables = [];
                    globalAuthRules.value.push(rule);
                } else {
                    // 编辑
                    globalAuthRules.value[editingGlobalRuleIndex.value] = rule;
                }
                closeGlobalRuleEdit();
            };

            const deleteGlobalRule = (index) => {
                if (confirm('确定要删除这个全局权限规则吗？')) {
                    globalAuthRules.value.splice(index, 1);
                }
            };

            const selectAudience = (audience) => {
                if (editingGlobalRule.value) {
                    editingGlobalRule.value.targetAudience = audience;
                }
                showAudienceDropdown.value = false;
            };

            const addGlobalRuleRowFilter = () => {
                if (!editingGlobalRule.value.rowFilters) {
                    editingGlobalRule.value.rowFilters = [];
                }
                editingGlobalRule.value.rowFilters.push({
                    field: '',
                    operator: '=',
                    value: '',
                    valueType: 'literal'
                });
            };

            const removeGlobalRuleRowFilter = (index) => {
                editingGlobalRule.value.rowFilters.splice(index, 1);
            };

            const toggleGlobalRuleColumnField = (field) => {
                if (!editingGlobalRule.value.columnVisibility.fields) {
                    editingGlobalRule.value.columnVisibility.fields = [];
                }
                const index = editingGlobalRule.value.columnVisibility.fields.indexOf(field);
                if (index > -1) {
                    editingGlobalRule.value.columnVisibility.fields.splice(index, 1);
                } else {
                    editingGlobalRule.value.columnVisibility.fields.push(field);
                }
            };

            // 递归查找节点的父级路径
            const findNodePath = (nodes, targetId, path = []) => {
                for (const node of nodes) {
                    const currentPath = [...path, node];
                    if (node.id === targetId) {
                        return currentPath;
                    }
                    if (node.children && node.children.length > 0) {
                        const found = findNodePath(node.children, targetId, currentPath);
                        if (found) return found;
                    }
                }
                return null;
            };

            // 获取面包屑路径
            const breadcrumbs = computed(() => {
                if (!selectedNode.value) return [];
                return findNodePath(catalogTree.value, selectedNode.value.id) || [];
            });

            // 可用的标签列表（从 TagCollection 组件的数据中获取）
            const availableTags = computed(() => {
                // 这里简化处理,实际应该从 TagCollection 组件中获取
                return [
                    'PII 个人信息/姓名',
                    'PII 个人信息/电话',
                    'PII 个人信息/邮箱',
                    '业务分类/部门',
                    '业务分类/职级'
                ];
            });

            // 递归收集指定类型的所有资源（包含路径）
            const collectResourcesByType = (node, type, parentPath = []) => {
                const results = [];
                const currentPath = [...parentPath, node.name];

                if (node.children && node.children.length > 0) {
                    node.children.forEach(child => {
                        // 如果是匹配的资源类型，添加到结果中
                        if (child.resourceType === type) {
                            results.push({
                                ...child,
                                _displayPath: currentPath.join(' / ')
                            });
                        }

                        // 如果是 CATALOG，递归查找其子节点
                        if (child.type === 'CATALOG') {
                            const childResults = collectResourcesByType(child, type, currentPath);
                            results.push(...childResults);
                        }
                    });
                }

                return results;
            };

            // 根据资源类型过滤子节点
            const filteredChildren = computed(() => {
                if (!selectedNode.value) return [];

                // 「全部」tab：只显示直接子节点（不递归）
                if (resourceTypeFilter.value === 'ALL') {
                    return (selectedNode.value.children || []).map(child => ({
                        ...child,
                        _displayPath: selectedNode.value.name
                    }));
                }

                // 其他 tab：递归收集所有该类型的资源（拍平显示）
                return collectResourcesByType(selectedNode.value, resourceTypeFilter.value);
            });

            // 递归收集所有资源
            const getAllResources = (nodes, result = []) => {
                nodes.forEach(node => {
                    result.push(node);
                    if (node.children && node.children.length > 0) {
                        getAllResources(node.children, result);
                    }
                });
                return result;
            };

            // 搜索过滤
            const searchResults = computed(() => {
                if (!searchQuery.value.trim()) return [];

                const allResources = getAllResources(catalogTree.value);
                const query = searchQuery.value.toLowerCase();

                return allResources.filter(node => {
                    const matchesQuery = node.name.toLowerCase().includes(query) ||
                        (node.chineseName && node.chineseName.toLowerCase().includes(query));
                    const matchesTab = searchActiveTab.value === 'ALL' ||
                        (searchActiveTab.value === 'CATALOG' && node.type === 'CATALOG') ||
                        (searchActiveTab.value !== 'CATALOG' && node.resourceType === searchActiveTab.value);
                    return matchesQuery && matchesTab;
                });
            });

            const copyToClipboard = (text) => {
                navigator.clipboard.writeText(text).then(() => {
                    alert('已复制到剪贴板');
                });
            };

            const getSdkCode = (node) => {
                const baseCode = `from resource_sdk import AssetBrowser

# 初始化 Asset Browser
browser = AssetBrowser(
    resource_id="${node.id}",
    auth_token="your_auth_token"
)
`;

                if (node.type === 'CATALOG') {
                    return baseCode + `
# 获取 catalog 下的所有资源
resources = browser.list_resources()

# 遍历资源
for resource in resources:
    print(f"Resource: {resource.name} ({resource.type})")
    
# 测试用例
def test_catalog_access():
    assert browser.has_permission("read")
    assert len(resources) > 0
    print("✓ Catalog access test passed")

if __name__ == "__main__":
    test_catalog_access()`;
                } else if (node.resourceType === 'DOCUMENT') {
                    return baseCode + `
# 获取 文档 内容
document = browser.get_resource()
content = document.get_content()

# 读取 文档
print(f"Title: {document.title}")
print(f"Content: {content[:200]}...")  # 前200字符

# 测试用例
def test_wiki_access():
    assert wiki is not None
    assert len(content) > 0
    print("✓ Wiki access test passed")

if __name__ == "__main__":
    test_wiki_access()`;
                } else if (node.resourceType === 'DATA_ASSET') {
                    return baseCode + `
# 获取数据资产
data_asset = browser.get_resource()

# 查询数据
df = data_asset.query("SELECT * FROM table LIMIT 10")
print(df.head())

# 带权限过滤的查询
filtered_df = data_asset.query(
    "SELECT * FROM table WHERE department = 'HR'",
    apply_permissions=True
)

# 测试用例
def test_data_access():
    assert df is not None
    assert len(df) > 0
    print("✓ Data asset access test passed")

if __name__ == "__main__":
    test_data_access()`;
                } else if (node.resourceType === 'FUNCTION') {
                    return baseCode + `
# 获取函数
function = browser.get_resource()

# 调用函数
result = function.invoke({
    "param1": "value1",
    "param2": "value2"
})

print(f"Function result: {result}")

# 测试用例
def test_function_call():
    assert result is not None
    assert result.get("status") == "success"
    print("✓ Function call test passed")

if __name__ == "__main__":
    test_function_call()`;
                } else if (node.resourceType === 'DICTIONARY') {
                    return baseCode + `
# 获取字典
dictionary = browser.get_resource()

# 查询字典值
value = dictionary.get("STATUS_APPROVED")
print(f"STATUS_APPROVED = {value}")

# 批量查询
values = dictionary.get_many(["STATUS_PENDING", "STATUS_APPROVED"])
print(values)

# 测试用例
def test_dictionary_access():
    assert value is not None
    assert len(values) > 0
    print("✓ Dictionary access test passed")

if __name__ == "__main__":
    test_dictionary_access()`;
                } else {
                    return baseCode + `
# 获取资源
resource = browser.get_resource()
print(f"Resource: {resource.name}")
print(f"Type: {resource.type}")

# 测试用例
def test_resource_access():
    assert resource is not None
    print("✓ Resource access test passed")

if __name__ == "__main__":
    test_resource_access()`;
                }
            };

            const currentDetailComponent = computed(() => {
                if (!selectedNode.value) return null;
                if (selectedNode.value.type === 'CATALOG') return 'CatalogView';
                switch (selectedNode.value.resourceType) {
                    case 'DOCUMENT': return 'DetailDocument';
                    case 'DATA_ASSET': return 'DetailData';
                    case 'FUNCTION': return 'DetailFunction';
                    case 'DICTIONARY': return 'DetailDictionary';
                    case 'SKILL': return 'DetailSkill';
                    case 'TAG_COLLECTION': return 'TagCollection';
                    default: return null;
                }
            });

            return {
                catalogTree, selectedNode, catalogActiveTab, resourceTypeFilter, filteredChildren, selectNode, handleRenameNode, toggleNode,
                getNodeIcon, getColor, getBgColor, getTypeLabel,
                showCreateMenu, createItem, currentDetailComponent,
                toggleExpand, isExpanded,
                showPermissionPopover, showSdkPopover, activePopoverNode,
                openPermissionPopover, openSdkPopover, closePopovers,
                copyToClipboard, getSdkCode,
                showDeleteConfirm, confirmDelete,
                searchQuery, showSearchDropdown, searchActiveTab, searchResults,
                breadcrumbs,
                // 字典数据
                dictionaries,
                // 数据资产版本数据
                dataAssetVersions,
                // 全局权限规则
                globalAuthRules, showGlobalRuleEdit, editingGlobalRule, editingGlobalRuleIndex,
                showAppliedTables, availableTags, showAudienceDropdown,
                openGlobalRuleEdit, closeGlobalRuleEdit, saveGlobalRule, deleteGlobalRule,
                selectAudience, addGlobalRuleRowFilter, removeGlobalRuleRowFilter, toggleGlobalRuleColumnField,
                inheritedAuthRules, showInheritedAppliedTables, showRuleDetail,
                showCreateDataAssetWizard, createDataAssetStep, createDataAssetMethod,
                createDataAssetForm, dataSourceTables,
                selectCreateMethod, goBackCreateWizard, closeCreateWizard, previewCreateView, saveCreateDataAsset,
                toggleTableSelection, isTableSelected, updateFieldDescription, updateViewFieldDescription, proceedToFinalStep,
                // Excel 文件上传
                handleFileUpload, selectSheet, updateExcelField,
                // 新建文件夹
                showNewFolderDialog, newFolderParent, newFolderName, newFolderCode,
                selectNewFolderParent, cancelNewFolder, confirmNewFolder,

                // 集群搜索与测试
                availableClusters, showClusterSearch, filteredClusters, testConnectionStatus, testConnectionMessage,
                selectCluster, testClusterConnection,

                // 新建字典与知识库
                showCreateDictionaryWizard, createDictionaryForm, createDictionary,
                showCreateWikiWizard, createWikiForm, createWiki,
                // 权限管理
                showAddPermissionDialog, userSearchQuery, selectedUser, selectedPermissionRole,
                currentPermissions, inheritedPermissions, availableUsers, filteredUsers,
                openAddPermissionDialog, closeAddPermissionDialog, selectUser, selectPermissionRole,
                confirmAddPermission, removePermission, getRoleLabel, getRoleBadgeClass,
                // 编辑资源
                showEditNodeModal, editNodeForm, eligibleCatalogs, topLevelCatalogName,
                openEditNodeModal, saveEditNode,

                // API 访问管理
                enableApiAccess, toggleTokenVisibility, copyToken, maskToken, resetEnvToken, confirmDisableApiAccess,

                // 文件夹设置 - 应用授权
                showAppAuthModal, appSearchQuery, selectedAppsForAuth, availableApps, filteredAvailableApps,
                openAppAuthModal, closeAppAuthModal, confirmAppAuthorization, removeAuthorizedApp,

                // 辅助方法
                isDictionaryTree: (node) => {
                    if (!node || node.resourceType !== 'DICTIONARY') return false;
                    return node.structure === 'TREE' || node.structure === 'tree' ||
                        (dictionaries.value[node.id] && dictionaries.value[node.id].type === 'tree');
                },
                // 全局标签
                globalTags,
                addGlobalTag: window.App.addGlobalTag
            };
        }
    });

    // 注册组件
    app.component('tree-item', TreeItem);
    // 使用独立文件中的 DetailDocument 组件
    if (window.App && window.App.Components && window.App.Components.DetailDocument) {
        app.component('DetailDocument', window.App.Components.DetailDocument);
        console.log('Using DetailDocument from separate file');
    } else {
        console.error('DetailDocument component not found in window.App.Components');
    }
    app.component('FieldEditModal', FieldEditModal);
    app.component('PermissionRuleEditModal', PermissionRuleEditModal);
    app.component('DetailData', DetailData);

    // DetailFunction 从独立文件加载
    if (window.App.Components && window.App.Components.DetailFunction) {
        app.component('DetailFunction', window.App.Components.DetailFunction);
        console.log('Using DetailFunction from separate file');
    } else {
        console.error('DetailFunction component not found in window.App.Components');
    }

    // DetailSkill 从独立文件加载
    if (window.App.Components && window.App.Components.DetailSkill) {
        app.component('DetailSkill', window.App.Components.DetailSkill);
        app.component('skill-file-tree-item', window.App.Components.SkillFileTreeItem);
        console.log('Using DetailSkill from separate file');
    } else {
        console.error('DetailSkill component not found in window.App.Components');
    }

    app.component('version-bar', VersionBar);

    // DetailDictionary from separate file
    if (window.App.Components && window.App.Components.DetailDictionary) {
        app.component('DetailDictionary', window.App.Components.DetailDictionary);
        console.log('Using DetailDictionary from separate file');
    } else {
        console.error('DetailDictionary component not found in window.App.Components');
    }

    // 无论是否使用了外部DetailDictionary，都注册本地的 EnumTreeItem
    app.component('enum-tree-item', EnumTreeItem);

    app.component('tag-tree-item', TagTreeItem);
    app.component('TagCollection', TagCollection);
    app.component('CreateDataAssetWizard', CreateDataAssetWizard);

    app.mount('#app');
})();
