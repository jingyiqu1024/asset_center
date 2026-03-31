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
                        { id: "wiki_101", name: "开发环境配置指南", type: "RESOURCE", resourceType: "WIKI" },
                        { id: "data_500", name: "各办事处地址簿", type: "RESOURCE", resourceType: "DATA_ASSET" },
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
                        { id: "wiki_101", name: "2024 员工手册", type: "RESOURCE", resourceType: "WIKI" },
                        { id: "dict_02", name: "Employee_Levels", type: "RESOURCE", resourceType: "DICTIONARY" },
                        { id: "dict_03", name: "Gender_Codes", type: "RESOURCE", resourceType: "DICTIONARY" },
                        { id: "skill_data_analysis", name: "数据分析", type: "RESOURCE", resourceType: "SKILL" },
                        {
                            id: "cat_hr_workflows",
                            name: "审批流程",
                            type: "CATALOG",
                            isOpen: true,
                            children: [
                                { id: "data_202", name: "员工休假记录表", type: "RESOURCE", resourceType: "DATA_ASSET" },
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
                        { id: "wiki_101", name: "SRE 运维手册 v2", type: "RESOURCE", resourceType: "WIKI" },
                        { id: "card_01", name: "集群健康状态组件", type: "RESOURCE", resourceType: "PAGE_CARD" },
                        { id: "dict_01", name: "K8s_Error_Codes", type: "RESOURCE", resourceType: "DICTIONARY" },
                        { id: "func_88", name: "restart_k8s_pod", type: "RESOURCE", resourceType: "FUNCTION" }
                    ]
                }
            ]
        }
    ];

    const resourceTypeMap = {
        'WIKI': 'Wiki',
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
            case 'WIKI': return 'ph-books';
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
            case 'WIKI': return 'text-orange-600';
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
            case 'WIKI': return 'bg-orange-50 border-orange-100';
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
            tagTreeExpanded: Object
        },
        emits: ['close', 'save', 'update:showTagTreeDropdown', 'toggleTagTreeNode', 'selectTagFromTree', 'navigateToDict'],
        methods: {
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
            }
        },
        data() {
            return {
                selectedTag: ''
            };
        },
        computed: {
            fieldOptions() {
                // 如果是全局规则，使用标签；否则使用字段
                return this.isGlobal ? this.availableTags : (this.schemaFields || []).map(f => f.name);
            }
        },
        emits: ['close', 'save', 'update:showAudienceDropdown', 'selectAudience', 'addRowFilter', 'removeRowFilter', 'toggleColumnField'],
        template: window.AppTemplates.PermissionRuleEditModal
    };

    const DetailData = {
        name: 'DetailData',
        props: ['node'],
        data() {
            return {
                dataActiveTab: 'schema',
                tableDescription: '员工休假记录视图，按日分区，数据来源 raw.emp_leave。',
                tableStatistics: `总行数: 1,250,000
字段数: 6`,
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
                    },
                    {
                        name: '财务',
                        fullPath: '/Tags 治理标签/财务:/',
                        children: [
                            { name: '收入', fullPath: '/Tags 治理标签/财务:/收入', linkedDict: null, children: [] },
                            { name: '支出', fullPath: '/Tags 治理标签/财务:/支出', linkedDict: null, children: [] }
                        ]
                    }
                ],
                schemaFields: [
                    {
                        name: 'id', type: 'BIGINT', description: '主键', governed_tag: '/Tags 治理标签/PII 个人信息:/姓名', is_partition: false, is_encrypted: false, fieldStatistics: `非空值: 1,250,000 (100.0%)
唯一值: 1,250,000 (100.0%)
范围: 1 ~ 999999` },
                    {
                        name: 'name', type: 'VARCHAR(128)', description: '姓名', governed_tag: '/Tags 治理标签/PII 个人信息:/姓名', is_partition: false, is_encrypted: true, fieldStatistics: `非空值: 1,248,750 (99.9%)
唯一值: 850,000 (68.0%)
最常见值: Alice (0.12%), Bob (0.11%), Charlie (0.10%)` },
                    {
                        name: 'department', type: 'VARCHAR(64)', description: '部门（通过 governed_tag 关联字典获取）', governed_tag: '/Tags 治理标签/业务分类:/部门', is_partition: false, is_encrypted: false, fieldStatistics: `非空值: 1,250,000 (100.0%)
唯一值: 12 (0.001%)
最常见值: Engineering (35.0%), HR (25.0%), Sales (20.0%)` },
                    {
                        name: 'status', type: 'VARCHAR(32)', description: '在职状态（Active, On Leave, Terminated）', governed_tag: null, is_partition: false, is_encrypted: false, fieldStatistics: `非空值: 1,249,500 (99.96%)
唯一值: 3 (0.0002%)
最常见值: Active (85.0%), On Leave (10.0%), Terminated (5.0%)` },
                    {
                        name: 'joined_at', type: 'DATE', description: '入职日期', governed_tag: null, is_partition: false, is_encrypted: false, fieldStatistics: `非空值: 1,248,000 (99.84%)
唯一值: 365 (0.03%)
范围: 2020-01-01 ~ 2024-01-15` },
                    {
                        name: 'dt', type: 'VARCHAR(8)', description: '分区日期 yyyyMMdd', governed_tag: null, is_partition: true, is_encrypted: false, fieldStatistics: `非空值: 1,250,000 (100.0%)
唯一值: 365 (0.03%)
范围: 20230101 ~ 20240101
分区数: 365` }
                ],
                partitionInfo: {
                    partition_field: 'dt',
                    partition_format: 'yyyyMMdd',
                    partition_mode: 'incremental'
                },
                ddlStatement: `CREATE VIEW emp_leave_view AS
SELECT id, name, department, status, joined_at, dt
FROM raw.emp_leave
WHERE dt >= '20230101';`,
                previewColumns: ['id', 'name', 'department', 'status', 'joined_at', 'dt'],
                previewRows: [
                    ['E001', 'Alice Smith', 'Engineering', 'Active', '2023-01-15', '20240101'],
                    ['E002', 'Bob Jones', 'HR', 'Active', '2023-02-20', '20240101'],
                    ['E003', 'Charlie Day', 'Sales', 'On Leave', '2022-11-05', '20240101'],
                    ['E004', 'Dana White', 'Marketing', 'Active', '2023-03-10', '20240101'],
                    ['E005', 'Evan Roth', 'Engineering', 'Terminated', '2021-06-01', '20240101']
                ],
                previewSql: '',
                previewSqlResult: null,
                previewSqlColumns: null,
                previewSqlRows: null,
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
                    },
                    {
                        name: '仅查看本人脱敏数据',
                        targetAudience: { type: 'role', value: '普通员工' },
                        ruleSource: 'custom',
                        globalRuleRef: null,
                        rowFilters: [{ field: 'user_id', operator: '=', value: 'visiting_user.user_id', valueType: 'env_var' }],
                        conditionLogic: '',
                        columnVisibility: { mode: 'exclude', fields: ['salary', 'bonus', 'id_card'] }
                    },
                    {
                        name: '引用 PII 规则',
                        targetAudience: { type: 'role', value: '数据分析师' },
                        ruleSource: 'global_reference',
                        globalRuleRef: '通用 PII 字段脱敏',
                        rowFilters: [],
                        conditionLogic: '',
                        columnVisibility: { mode: 'all', fields: [] }
                    }
                ],
                authRulesOnline: [
                    {
                        name: '部门数据隔离',
                        targetAudience: { type: 'role', value: 'HRBP' },
                        ruleSource: 'custom',
                        globalRuleRef: null,
                        rowFilters: [{ field: 'department_id', operator: 'IN', value: 'visiting_user.as_hrbp.department_ids', valueType: 'env_var' }],
                        conditionLogic: '',
                        columnVisibility: { mode: 'all', fields: [] }
                    },
                    {
                        name: '仅查看本人脱敏数据',
                        targetAudience: { type: 'role', value: '普通员工' },
                        ruleSource: 'custom',
                        globalRuleRef: null,
                        rowFilters: [{ field: 'user_id', operator: '=', value: 'visiting_user.user_id', valueType: 'env_var' }],
                        conditionLogic: '',
                        columnVisibility: { mode: 'exclude', fields: ['salary', 'bonus', 'id_card'] }
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
                showVersionHistory: false,
                // 版本管理（统一格式）
                currentVersion: {
                    version: '1.0.1',
                    createdAt: '2026/1/21 13:16:20',
                    createdBy: 'Yuzhiyuan',
                    isLatest: true,
                    environments: {
                        online: null,    // 生产
                        pre: null,       // 预发
                        test: null       // 测试
                    }
                },
                versionHistory: [
                    {
                        version: '1.0.0',
                        createdAt: '2024-01-10 09:00:00',
                        createdBy: 'Yuzhiyuan',
                        note: '初始版本',
                        environments: { online: '1.0.0', pre: null, test: null }
                    },
                    {
                        version: '0.9.0',
                        createdAt: '2024-01-08 14:20:00',
                        createdBy: 'Yuzhiyuan',
                        note: '测试版本',
                        environments: { online: null, pre: '0.9.0', test: '0.9.0' }
                    }
                ],
                showVersionPublish: false,
                showVersionDropdown: false,
                publishForm: {
                    environment: 'test',
                    note: ''
                }
            };
        },
        computed: {
            authRules() {
                return this.activeAuthEnv === 'online' ? this.authRulesOnline : this.authRulesPre;
            },
            globalRules() {
                return [
                    { name: '通用 PII 字段脱敏', description: '屏蔽所有被标记为 PII 的字段' },
                    { name: '财务数据限制', description: '仅财务中心人员可见' }
                ];
            }
        },
        methods: {
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
                        }
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
                if (confirm('确定要删除这条权限规则吗？')) {
                    const index = this.editingAuthRuleIndex;
                    this.authRules.splice(index, 1);
                    this.closeAuthRuleEdit();
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
                    partition_format: (this.partitionInfo && f.is_partition) ? this.partitionInfo.partition_format : 'yyyyMMdd',
                    partition_mode: (this.partitionInfo && f.is_partition) ? this.partitionInfo.partition_mode : 'incremental'
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
                f.description = F.description;
                f.governed_tag = F.governed_tag || null;
                f.is_encrypted = F.is_encrypted;
                f.is_partition = F.is_partition;
                this.closeFieldEdit();
            },
            closeFieldEdit() {
                this.showFieldEdit = false;
                this.showTagTreeDropdown = false;
                this.tagTreeExpanded = {};
            },
            openVersionPublish() {
                this.publishForm.environment = 'test';
                this.publishForm.note = '';
                this.showVersionPublish = true;
            },
            saveVersionPublish() {
                // 发布版本到指定环境
                const envKey = this.publishForm.environment; // 'online', 'pre', 'test'

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
                }
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
                this.publishForm.environment = 'test';
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
            selectedTag: Object
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
                            class="text-sm font-medium text-slate-900 flex-1 cursor-pointer">{{ tag.name }}</span>
                        <span v-if="tag.children && tag.children.length > 0" class="text-xs text-slate-400">{{ tag.children.length }}</span>
                        <div class="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                            <button 
                                @click.stop="$emit('add-child', tag, parentPath + '/' + tag.name)"
                                class="p-1 hover:bg-slate-200 rounded text-slate-600"
                                title="添加子标签">
                                <i class="ph ph-plus text-xs"></i>
                            </button>
                            <button 
                                @click.stop="$emit('edit', tag, parentPath)"
                                class="p-1 hover:bg-slate-200 rounded text-slate-600"
                                title="编辑">
                                <i class="ph ph-pencil-simple text-xs"></i>
                            </button>
                            <button 
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
                        @toggle="(id) => $emit('toggle', id)"
                        @select="(t) => $emit('select', t)"
                        @add-child="(t, p) => $emit('add-child', t, p)"
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
                editForm: {
                    name: '',
                    description: '',
                    parentId: null
                },
                tagTree: [
                    {
                        id: 'tag_pii',
                        name: 'PII 个人信息',
                        description: '个人身份信息标签，用于标记包含用户个人隐私的敏感数据',
                        isOpen: true,
                        children: [
                            {
                                id: 'tag_pii_name',
                                name: '姓名',
                                description: '用户姓名字段',
                                fullPath: '/Tags/PII 个人信息/姓名',
                                appliedFieldCount: 3,
                                ruleCount: 2,
                                isOpen: false,
                                appliedFields: [
                                    { id: 1, assetName: '员工休假记录表', fieldName: 'employee_name', fieldType: 'VARCHAR(128)', description: '员工姓名' },
                                    { id: 2, assetName: '用户画像表', fieldName: 'user_name', fieldType: 'VARCHAR(64)', description: '用户姓名' },
                                    { id: 3, assetName: '订单历史记录', fieldName: 'customer_name', fieldType: 'VARCHAR(100)', description: '客户姓名' }
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
                                description: '电话号码字段',
                                fullPath: '/Tags/PII 个人信息/电话',
                                appliedFieldCount: 2,
                                ruleCount: 1,
                                isOpen: false,
                                appliedFields: [
                                    { id: 1, assetName: '员工休假记录表', fieldName: 'mobile_phone', fieldType: 'VARCHAR(20)', description: '手机号码' },
                                    { id: 2, assetName: '用户画像表', fieldName: 'phone_number', fieldType: 'VARCHAR(20)', description: '联系电话' }
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
                                description: '电子邮箱地址字段',
                                fullPath: '/Tags/PII 个人信息/邮箱',
                                appliedFieldCount: 1,
                                ruleCount: 1,
                                isOpen: false,
                                appliedFields: [
                                    { id: 1, assetName: '用户画像表', fieldName: 'email', fieldType: 'VARCHAR(255)', description: '电子邮箱' }
                                ],
                                relatedRules: [
                                    { id: 1, name: '邮箱脱敏规则', targetAsset: '全局', condition: 'governed_tags CONTAINS "PII/邮箱"', enabled: true }
                                ],
                                relatedDictionaries: [
                                    { id: 2, name: 'Email_Domains', description: '邮箱域名白名单', entryCount: 20 }
                                ],
                                children: []
                            }
                        ]
                    },
                    {
                        id: 'tag_business',
                        name: '业务分类',
                        description: '业务领域相关的分类标签',
                        isOpen: false,
                        children: [
                            {
                                id: 'tag_dept',
                                name: '部门',
                                description: '部门信息字段',
                                fullPath: '/Tags/业务分类/部门',
                                appliedFieldCount: 2,
                                ruleCount: 1,
                                isOpen: false,
                                appliedFields: [
                                    { id: 1, assetName: '员工休假记录表', fieldName: 'department', fieldType: 'VARCHAR(64)', description: '所属部门' },
                                    { id: 2, assetName: '用户画像表', fieldName: 'dept_id', fieldType: 'INT', description: '部门ID' }
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
                                description: '员工职级字段',
                                fullPath: '/Tags/业务分类/职级',
                                appliedFieldCount: 1,
                                ruleCount: 0,
                                isOpen: false,
                                appliedFields: [
                                    { id: 1, assetName: '员工休假记录表', fieldName: 'job_level', fieldType: 'VARCHAR(32)', description: '职级' }
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
                this.editForm = { name: '', description: '', parentId: null, parentPath: '' };
                this.showEditModal = true;
            },
            addChildTag(parentTag, parentPath = '') {
                this.editingTag = null;
                this.editForm = {
                    name: '',
                    description: '',
                    parentId: parentTag.id,
                    parentPath: parentPath || parentTag.fullPath || `/Tags/${parentTag.name}`
                };
                this.showEditModal = true;
            },
            editTag(tag, parentPath = '') {
                this.editingTag = tag;
                this.editForm = {
                    name: tag.name,
                    description: tag.description,
                    parentId: null,
                    parentPath: parentPath
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
                        // 添加根标签
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
            cancelDelete() {
                this.showDeleteConfirm = false;
                this.tagToDelete = null;
            }
        },
        template: window.AppTemplates.TagCollection
    };

})();
