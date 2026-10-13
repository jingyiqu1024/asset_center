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
                        {
                            id: "cat_hr_emp",
                            name: "员工表",
                            type: "CATALOG",
                            isOpen: true,
                            children: [
                                { id: "data_hr_emp_all", name: "topic_hr_emp_all_td", chineseName: "员工全量信息表", description: "员工全量基础及在职信息，含400个字段，覆盖基础信息、在职信息、组织信息、职级信息等。", type: "RESOURCE", resourceType: "DATA_ASSET" },
                                { id: "data_hr_ltc_emp", name: "dim_hr_ltc_emp_cp", chineseName: "员工快照维度表", description: "员工历史快照维度表，用于历史对比分析。", type: "RESOURCE", resourceType: "DATA_ASSET" },
                                {
                                    id: "cat_hr_attendance",
                                    name: "考勤表",
                                    type: "CATALOG",
                                    isOpen: false,
                                    children: [
                                        { id: "data_att_di_1", name: "app_outer_attendance_emp_attendance_di", chineseName: "员工考勤日明细", description: "员工每日考勤记录，含打卡时间、考勤状态等。", type: "RESOURCE", resourceType: "DATA_ASSET" },
                                        { id: "data_att_mi", name: "app_outer_attendance_emp_attendance_mi", chineseName: "员工考勤月汇总", description: "员工月度考勤汇总，含出勤天数、加班小时数等。", type: "RESOURCE", resourceType: "DATA_ASSET" },
                                        { id: "data_att_overtime", name: "app_outer_attendance_emp_overtime_di", chineseName: "员工加班明细表", description: "员工加班申请及审批记录。", type: "RESOURCE", resourceType: "DATA_ASSET" },
                                        { id: "data_att_vacation", name: "app_outer_attendance_emp_vacation_di", chineseName: "员工假期明细表", description: "员工各类假期申请及使用记录。", type: "RESOURCE", resourceType: "DATA_ASSET" },
                                        { id: "data_att_clockin", name: "app_outer_attendance_clockin_appeal_di", chineseName: "打卡申诉记录表", description: "员工打卡申诉流程记录。", type: "RESOURCE", resourceType: "DATA_ASSET" },
                                        { id: "data_vocation_filter", name: "emp_vocation_filter_part_td", chineseName: "员工职级过滤快照", description: "按职级过滤的员工快照表。", type: "RESOURCE", resourceType: "DATA_ASSET" },
                                        { id: "data_cawf", name: "emp_cawf_di", chineseName: "员工工作流审批日明细", description: "员工各类工作流（如假期、加班）审批记录。", type: "RESOURCE", resourceType: "DATA_ASSET" },
                                        { id: "data_att_intern", name: "app_hr_attendance_intern_attendance_di", chineseName: "实习生考勤日明细", description: "实习生每日考勤记录。", type: "RESOURCE", resourceType: "DATA_ASSET" }
                                    ]
                                },
                                {
                                    id: "cat_hr_personal",
                                    name: "个人信息",
                                    type: "CATALOG",
                                    isOpen: false,
                                    children: [
                                        { id: "data_work_exp", name: "fact_hr_corehr_employee_work_experience_td", chineseName: "员工工作经历表", description: "员工历史工作经历记录，含公司、职位、起止时间等。", type: "RESOURCE", resourceType: "DATA_ASSET" }
                                    ]
                                }
                            ]
                        },
                        {
                            id: "cat_hr_org",
                            name: "组织表",
                            type: "CATALOG",
                            isOpen: false,
                            children: [
                                {
                                    id: "cat_hr_org_detail",
                                    name: "组织明细",
                                    type: "CATALOG",
                                    isOpen: false,
                                    children: [
                                        { id: "data_org_front_1m", name: "app_hr_org_org_front_class_1m", chineseName: "组织前台分类月快照", description: "组织前台分类月度快照，含组织层级、路径等。", type: "RESOURCE", resourceType: "DATA_ASSET" },
                                        { id: "data_org_1m", name: "app_hr_org_org_1m", chineseName: "组织月快照表", description: "组织月度快照表，含组织基础信息和人员数量。", type: "RESOURCE", resourceType: "DATA_ASSET" }
                                    ]
                                },
                                {
                                    id: "cat_hr_org_metric",
                                    name: "组织指标",
                                    type: "CATALOG",
                                    isOpen: false,
                                    children: [
                                        { id: "data_develop_perf_org", name: "app_hr_develop_perf_org_front_class_1m", chineseName: "组织绩效前台分类月表", description: "组织绩效数据月度汇总，按前台分类展示。", type: "RESOURCE", resourceType: "DATA_ASSET" },
                                        { id: "data_org_attr_dis", name: "app_hr_org_org_front_class_attr_dis_1m", chineseName: "组织属性分布月表", description: "组织人员属性分布月度统计表。", type: "RESOURCE", resourceType: "DATA_ASSET" },
                                        { id: "data_view_org_attr_1", name: "view_app_hr_org_org_front_class_attr_1", chineseName: "组织属性视图1", description: "组织属性聚合视图，供报表使用。", type: "RESOURCE", resourceType: "DATA_ASSET" },
                                        { id: "data_view_org_attr_2", name: "view_app_hr_org_org_front_class_attr_2", chineseName: "组织属性视图2", description: "组织属性聚合视图（备用），供报表使用。", type: "RESOURCE", resourceType: "DATA_ASSET" },
                                        { id: "data_view_org_ca_1", name: "view_app_hr_org_org_front_class_ca_1", chineseName: "组织分类汇总视图1", description: "组织分类汇总视图，供管理看板使用。", type: "RESOURCE", resourceType: "DATA_ASSET" },
                                        { id: "data_view_org_ca_2", name: "view_app_hr_org_org_front_class_ca_2", chineseName: "组织分类汇总视图2", description: "组织分类汇总视图（备用），供管理看板使用。", type: "RESOURCE", resourceType: "DATA_ASSET" }
                                    ]
                                }
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
            selectedId: String,
            typeFilter: { type: String, default: 'ALL' },
            searchQuery: { type: String, default: '' }
        },
        emits: ['select', 'toggle', 'rename'],
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

            // 判断节点名称是否匹配关键词搜索
            const matchesSearch = (node, query) => {
                if (!query || !query.trim()) return true;
                const q = query.trim().toLowerCase();
                if (node.name && node.name.toLowerCase().includes(q)) return true;
                if (node.chineseName && node.chineseName.toLowerCase().includes(q)) return true;
                return false;
            };

            // 判断节点是否匹配类型过滤
            const matchesType = (node, typeFilter) => {
                if (typeFilter === 'ALL') return true;
                if (node.type === 'CATALOG') return true; // 文件夹是结构性节点
                return node.resourceType === typeFilter;
            };

            // 递归判断文件夹节点是否应显示：自身名称匹配 或 有匹配的子孙节点
            const catalogMatchesFilter = (node, typeFilter, query) => {
                // 文件夹自身名称匹配关键词 → 显示
                if (matchesSearch(node, query)) return true;
                // 文件夹下有匹配(类型+关键词)的子孙 → 显示
                return hasMatchingDescendant(node, typeFilter, query);
            };

            // 递归判断文件夹下是否有匹配(关键词+类型)的子孙节点
            const hasMatchingDescendant = (node, typeFilter, query) => {
                if (!node.children || node.children.length === 0) return false;
                for (const child of node.children) {
                    if (child.type === 'CATALOG') {
                        // 子文件夹：自身名称匹配 或 有匹配子孙
                        if (catalogMatchesFilter(child, typeFilter, query)) return true;
                    } else {
                        // 资源节点：类型+关键词同时匹配
                        if (matchesType(child, typeFilter) && matchesSearch(child, query)) return true;
                    }
                }
                return false;
            };

            // 当前节点是否应该显示（叠加：关键词 + 类型）
            const shouldShow = Vue.computed(() => {
                const typeF = props.typeFilter;
                const searchQ = props.searchQuery;
                if (typeF === 'ALL' && !searchQ) return true;
                // 文件夹节点：自身名称匹配关键词 或 有匹配子孙
                if (props.node.type === 'CATALOG') {
                    if (props.node.id === 'root_all') return true;
                    return catalogMatchesFilter(props.node, typeF, searchQ);
                }
                // 资源节点：叠加关键词和类型过滤
                return matchesType(props.node, typeF) && matchesSearch(props.node, searchQ);
            });

            // 过滤子节点（叠加关键词+类型）
            const filteredChildren = Vue.computed(() => {
                if (!props.node.children || props.node.children.length === 0) return [];
                const typeF = props.typeFilter;
                const searchQ = props.searchQuery;
                if (typeF === 'ALL' && !searchQ) return props.node.children;
                return props.node.children.filter(child => {
                    if (child.type === 'CATALOG') {
                        // 子文件夹：自身名称匹配 或 含匹配子孙
                        return catalogMatchesFilter(child, typeF, searchQ);
                    }
                    // 资源节点：类型+关键词
                    return matchesType(child, typeF) && matchesSearch(child, searchQ);
                });
            });

            // 当有搜索/过滤条件时，自动展开含匹配子孙的文件夹
            Vue.watch(() => [props.typeFilter, props.searchQuery], ([typeF, searchQ]) => {
                if ((typeF !== 'ALL' || searchQ) && props.node.type === 'CATALOG') {
                    if (shouldShow.value) {
                        props.node.isOpen = true;
                    }
                }
            });

            return { isOpen, isSelected, nodeIcon, iconColor, toggle, handleClick, filteredChildren, shouldShow };
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
            dictionaries: Object,
            classificationTree: {
                type: Array,
                default: () => []
            },
            classificationOptions: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                showDictDropdown: false,
                dictSearchQuery: '',
                showClassificationDropdown: false,
                classificationSearchQuery: ''
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
            },
            selectedClassificationOption() {
                const form = this.editingForm || {};
                const id = form.categoryId;
                const names = Array.isArray(form.classification) ? form.classification : (form.classification ? [form.classification] : []);
                const opts = this.classificationOptions || [];
                if (id) {
                    const byId = opts.find(o => o.id === id);
                    if (byId) return byId;
                }
                if (names.length) {
                    const byName = opts.find(o => o.name === names[0] || o.label === names[0]);
                    if (byName) return byName;
                    return { id: null, name: names[0], domainName: '', label: names[0] };
                }
                return null;
            },
            selectedClassificationLabel() {
                const opt = this.selectedClassificationOption;
                if (!opt) return '';
                return opt.label || (opt.domainName ? `${opt.domainName} / ${opt.name}` : opt.name);
            },
            filteredClassificationGroups() {
                const query = (this.classificationSearchQuery || '').trim().toLowerCase();
                const opts = (this.classificationOptions || []).filter(o => this.fuzzyMatch(o.searchText || o.label || o.name, query));
                const groups = [];
                const map = new Map();
                for (const opt of opts) {
                    const key = opt.domainId || opt.domainName || '_';
                    if (!map.has(key)) {
                        const g = { domainId: key, domainName: opt.domainName || '未分组', options: [] };
                        map.set(key, g);
                        groups.push(g);
                    }
                    map.get(key).options.push(opt);
                }
                return groups;
            }
        },
        watch: {
            visible(v) {
                if (!v) {
                    this.showClassificationDropdown = false;
                    this.classificationSearchQuery = '';
                }
            },
            showClassificationDropdown(v) {
                if (v) {
                    this.$nextTick(() => {
                        const el = this.$refs.classificationSearchInput;
                        if (el && el.focus) el.focus();
                    });
                }
            }
        },
        methods: {
            selectDict(dict) {
                this.editingForm.linked_dict = dict ? dict.name : null;
                this.showDictDropdown = false;
                this.dictSearchQuery = '';
            },
            fuzzyMatch(text, query) {
                if (!query) return true;
                const t = String(text || '').toLowerCase();
                const q = String(query).toLowerCase().trim();
                if (!q) return true;
                if (t.includes(q)) return true;
                // 子序列模糊：按字符顺序匹配
                let ti = 0;
                for (let i = 0; i < q.length; i++) {
                    ti = t.indexOf(q[i], ti);
                    if (ti < 0) return false;
                    ti += 1;
                }
                return true;
            },
            toggleClassificationDropdown() {
                this.showClassificationDropdown = !this.showClassificationDropdown;
                if (this.showClassificationDropdown) this.classificationSearchQuery = '';
            },
            isClassificationSelected(opt) {
                const cur = this.selectedClassificationOption;
                if (!cur || !opt) return false;
                if (cur.id && opt.id) return cur.id === opt.id;
                return cur.name === opt.name;
            },
            selectClassification(opt) {
                if (!this.editingForm) return;
                this.editingForm.classification = opt && opt.name ? [opt.name] : [];
                this.editingForm.categoryId = opt ? opt.id : null;
                this.editingForm.category = opt ? opt.name : null;
                this.showClassificationDropdown = false;
                this.classificationSearchQuery = '';
            },
            clearClassification() {
                if (!this.editingForm) return;
                this.editingForm.classification = [];
                this.editingForm.categoryId = null;
                this.editingForm.category = null;
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
            },
            permissionPointRules: {
                type: Array,
                default: () => []
            },
            columnPermissionRules: {
                type: Array,
                default: () => []
            },
            availableTablesForColRef: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                selectedTag: '',
                showGlobalDropdown: false,
                subqueries: [
                    { id: 'sq_active_users', name: '活跃用户列表', code: 'active_users', sql: 'SELECT user_id FROM user_stats WHERE last_login > DATE_SUB(NOW(), INTERVAL 30 DAY)' },
                    { id: 'sq_hrbp_depts', name: 'HRBP管理部门', code: 'hrbp_managed', sql: 'SELECT department_id FROM hrbp_mapping WHERE hrbp_id = {user_id}' },
                    { id: 'sq_sensitive_data', name: '敏感数据权限组', code: 'sensitive_access', sql: 'SELECT resource_id FROM permission_matrix WHERE user_id = {user_id} AND access_level >= 3' },
                    { id: 'sq_team_members', name: '团队成员', code: 'team_members', sql: 'SELECT member_id FROM team WHERE leader_id = {user_id}' }
                ],
                availableTablesForColRef: this.availableTablesForColRef || this.availableTablesForColumnPermission,
                // 权限点引用相关（平铺列表，非树状）
                permissionPointTree: [
                    { id: 'pp_base', name: '基础信息' },
                    { id: 'pp_org', name: '组织信息' },
                    { id: 'pp_hrbp', name: 'HRBP信息' },
                    { id: 'pp_report', name: '汇报关系' },
                    { id: 'pp_mgmt_base', name: '管理信息-基础' },
                    { id: 'pp_promo_base', name: '职级晋升-基础' },
                    { id: 'pp_promo_sensitive', name: '职级晋升-敏感' },
                    { id: 'pp_perf', name: '绩效信息' },
                    { id: 'pp_talent', name: '人才盘点' }
                ],
                // 规则来源切换确认
                showRuleSourceSwitchConfirm: false,
                pendingRuleSource: null,
                // 子查询弹窗状态
                showSubqueryModal: false,
                tempHideMainModal: false,
                newSubqueryForm: { name: '', code: '', sql: '' },
                newSubqueryValidation: null,
                pendingFilterIndex: null,
                subqueryEditMode: false,
                editingSubqueryId: null,
                columnSearchQuery: '', // 列权限字段搜索
                expandedRefRuleIndex: null // 引用规则展开索引
            };
        },
        computed: {
            fieldOptions() {
                // 如果是全局规则，使用标签；否则使用字段
                return this.isGlobal ? this.availableTags : (this.schemaFields || []).map(f => f.name);
            },
            filteredRefRules() {
                const query = this.editingRule?.refRuleSearchQuery || '';
                const rules = this.columnPermissionRules || this.permissionPointRules || [];
                if (!query) return rules;
                const q = query.toLowerCase();
                return rules.filter(r => r.name.toLowerCase().includes(q));
            }
        },
        watch: {
            // 名称变化时自动生成 code（仅新建模式）
            'newSubqueryForm.name'(val) {
                if (this.subqueryEditMode) return;
                const code = val.trim()
                    .toLowerCase()
                    .replace(/\s+/g, '_')
                    .replace(/[^a-z0-9_]/g, '');
                this.newSubqueryForm.code = code;
            }
        },
        methods: {
            // 列权限规则来源切换
            switchColumnRuleSource(newSource) {
                if (this.editingRule.columnRuleSource === 'global_reference' && newSource === 'custom') {
                    // 从引用切换到定义表专属，需要确认
                    this.pendingRuleSource = { target: 'column', source: newSource };
                    this.showRuleSourceSwitchConfirm = true;
                } else {
                    this.editingRule.columnRuleSource = newSource;
                    // 切换到引用时，初始化引用相关字段
                    if (newSource === 'global_reference') {
                        if (!this.editingRule.selectedRefRules) this.editingRule.selectedRefRules = [];
                        if (!this.editingRule.refRuleSearchQuery) this.editingRule.refRuleSearchQuery = '';
                    }
                }
            },
            // 行权限规则来源切换
            switchRowRuleSource(newSource) {
                if (this.editingRule.rowRuleSource === 'global_reference' && newSource === 'custom') {
                    // 从引用切换到定义表专属，需要确认
                    this.pendingRuleSource = { target: 'row', source: newSource };
                    this.showRuleSourceSwitchConfirm = true;
                } else {
                    this.editingRule.rowRuleSource = newSource;
                    // 切换到自定义时，初始化行过滤条件
                    if (newSource === 'custom') {
                        if (!this.editingRule.rowFilters) this.editingRule.rowFilters = [];
                        this.editingRule.globalRowRuleRef = null;
                    }
                    // 切换到引用时，清空自定义条件
                    if (newSource === 'global_reference') {
                        this.editingRule.rowFilters = [];
                        this.editingRule.conditionLogic = '';
                        this.editingRule.globalRowRuleRef = null;
                    }
                }
            },
            cancelRuleSourceSwitch() {
                this.showRuleSourceSwitchConfirm = false;
                this.pendingRuleSource = null;
            },
            confirmRuleSourceSwitch() {
                this.showRuleSourceSwitchConfirm = false;
                const pending = this.pendingRuleSource;
                if (pending.target === 'column') {
                    // 清空列权限引用相关配置
                    this.editingRule.columnRuleSource = pending.source;
                    this.editingRule.selectedRefRules = [];
                    this.editingRule.refRuleSearchQuery = '';
                    this.editingRule.globalRuleRef = null;
                    this.editingRule.tagFieldMappings = {};
                } else if (pending.target === 'row') {
                    // 清空行权限引用相关配置
                    this.editingRule.rowRuleSource = pending.source;
                    this.editingRule.globalRowRuleRef = null;
                    if (pending.source === 'custom') {
                        if (!this.editingRule.rowFilters) this.editingRule.rowFilters = [];
                    }
                }
                this.pendingRuleSource = null;
            },
            // 引用规则：切换选择
            toggleRefRule(rule) {
                if (!this.editingRule.selectedRefRules) this.editingRule.selectedRefRules = [];
                const idx = this.editingRule.selectedRefRules.findIndex(r => r.id === rule.id);
                if (idx > -1) {
                    this.editingRule.selectedRefRules.splice(idx, 1);
                } else {
                    this.editingRule.selectedRefRules.push(JSON.parse(JSON.stringify(rule)));
                }
            },
            // 引用规则：移除
            removeRefRule(rule) {
                if (!this.editingRule.selectedRefRules) return;
                const idx = this.editingRule.selectedRefRules.findIndex(r => r.id === rule.id);
                if (idx > -1) {
                    this.editingRule.selectedRefRules.splice(idx, 1);
                    // 同时关闭该规则的展开状态
                    if (this.expandedRefRuleIndex === idx) this.expandedRefRuleIndex = null;
                    else if (this.expandedRefRuleIndex > idx) this.expandedRefRuleIndex--;
                }
            },
            // 引用规则：展开/收起
            toggleRefRuleExpand(ruleIdx) {
                this.expandedRefRuleIndex = this.expandedRefRuleIndex === ruleIdx ? null : ruleIdx;
            },
            // 获取引用规则中按权限点分组的表字段信息
            getRefRuleGroupedByPermissionPoint(refRule) {
                if (!refRule.tableFields) return [];
                const ppMap = {};
                for (const tblId of Object.keys(refRule.tableFields)) {
                    const fieldNames = refRule.tableFields[tblId];
                    if (!fieldNames || fieldNames.length === 0) continue;
                    const tableInfo = this.availableTablesForColRef ? this.availableTablesForColRef.find(t => t.id === tblId) : null;
                    const tableName = tableInfo ? tableInfo.name : tblId;
                    const tableChineseName = tableInfo ? tableInfo.chineseName : '';
                    for (const fieldName of fieldNames) {
                        let permPoint = null;
                        if (tableInfo && tableInfo.fields) {
                            const fieldDef = tableInfo.fields.find(f => f.name === fieldName);
                            permPoint = fieldDef ? fieldDef.permissionPoint : null;
                        }
                        const ppKey = permPoint || '未分配权限点';
                        if (!ppMap[ppKey]) ppMap[ppKey] = { tables: {} };
                        if (!ppMap[ppKey].tables[tableName]) ppMap[ppKey].tables[tableName] = { chineseName: tableChineseName, fields: [] };
                        ppMap[ppKey].tables[tableName].fields.push(fieldName);
                    }
                }
                return Object.keys(ppMap).map(pp => ({
                    permissionPoint: pp,
                    tables: Object.keys(ppMap[pp].tables).map(tblName => ({
                        name: tblName,
                        chineseName: ppMap[pp].tables[tblName].chineseName,
                        fields: ppMap[pp].tables[tblName].fields
                    }))
                }));
            },
            // 全局规则选择
            selectGlobalRule(rule) {
                this.editingRule.globalRuleRef = rule.name;

                // 自动生成标签与字段的映射
                const mappings = {};
                if (rule.tags && Array.isArray(rule.tags)) {
                    rule.tags.forEach(tag => {
                        const matchedField = this.schemaFields.find(f => f.governed_tag && f.governed_tag.includes(tag));
                        mappings[tag] = matchedField ? matchedField.name : '';
                    });
                }
                this.editingRule.tagFieldMappings = mappings;
                this.showGlobalDropdown = false;
            },
            // 子查询：获取名称
            getSubqueryName(id) {
                const sq = this.subqueries.find(s => s.id === id);
                return sq ? sq.name : '';
            },
            // 子查询：过滤列表
            getFilteredSubqueries(query) {
                if (!query) return this.subqueries;
                const q = query.toLowerCase();
                return this.subqueries.filter(s =>
                    s.name.toLowerCase().includes(q) ||
                    s.code.toLowerCase().includes(q)
                );
            },
            // 子查询：切换下拉框
            toggleSubqueryDropdown(filterIndex) {
                if (this.editingRule && this.editingRule.rowFilters && this.editingRule.rowFilters[filterIndex]) {
                    const filter = this.editingRule.rowFilters[filterIndex];
                    filter.showSubqueryDropdown = !filter.showSubqueryDropdown;
                }
            },
            // 子查询：更新搜索词
            updateSubquerySearch(filterIndex, query) {
                if (this.editingRule && this.editingRule.rowFilters && this.editingRule.rowFilters[filterIndex]) {
                    this.editingRule.rowFilters[filterIndex].subquerySearchQuery = query;
                }
            },
            // 子查询：选择子查询
            selectSubquery(filterIndex, subqueryId) {
                if (this.editingRule && this.editingRule.rowFilters && this.editingRule.rowFilters[filterIndex]) {
                    this.editingRule.rowFilters[filterIndex].value = subqueryId;
                    this.editingRule.rowFilters[filterIndex].showSubqueryDropdown = false;
                }
            },
            // 子查询：打开新建弹窗（临时隐藏主弹窗）
            openSubqueryDrawer(filterIndex) {
                // 关闭当前打开的下拉框
                if (this.editingRule && this.editingRule.rowFilters && this.editingRule.rowFilters[filterIndex]) {
                    this.editingRule.rowFilters[filterIndex].showSubqueryDropdown = false;
                }
                this.pendingFilterIndex = filterIndex;
                this.subqueryEditMode = false;
                this.editingSubqueryId = null;
                this.tempHideMainModal = true;
                this.showSubqueryModal = true;
                this.newSubqueryForm = { name: '', code: '', sql: '' };
                this.newSubqueryValidation = null;
            },
            // 子查询：打开编辑弹窗
            openSubqueryEdit(sqId) {
                const sq = this.subqueries.find(s => s.id === sqId);
                if (!sq) return;
                this.subqueryEditMode = true;
                this.editingSubqueryId = sqId;
                this.tempHideMainModal = true;
                this.showSubqueryModal = true;
                this.newSubqueryForm = { name: sq.name, code: sq.code, sql: sq.sql || '' };
                this.newSubqueryValidation = null;
            },
            // 子查询：关闭弹窗，恢复主弹窗
            closeSubqueryDrawer() {
                this.showSubqueryModal = false;
                this.tempHideMainModal = false;
                this.newSubqueryForm = { name: '', code: '', sql: '' };
                this.newSubqueryValidation = null;
                this.pendingFilterIndex = null;
                this.subqueryEditMode = false;
                this.editingSubqueryId = null;
            },
            // 子查询：执行 SQL
            validateNewSubquerySql() {
                if (!this.newSubqueryForm.sql.trim()) {
                    this.newSubqueryValidation = { success: false, message: 'SQL 不能为空' };
                    return;
                }
                // 模拟执行（前端演示用）
                const isSuccess = Math.random() > 0.2;
                this.newSubqueryValidation = isSuccess
                    ? { success: true, message: '执行成功，返回列符合预期格式' }
                    : { success: false, message: '执行失败：未知的表名，请检查 SQL 语句' };
            },
            // 子查询：保存（新建或编辑）
            saveNewSubquery() {
                if (!this.newSubqueryForm.name.trim()) return;
                if (this.subqueryEditMode && this.editingSubqueryId) {
                    // 编辑模式：只更新 name 和 sql
                    const sq = this.subqueries.find(s => s.id === this.editingSubqueryId);
                    if (sq) {
                        sq.name = this.newSubqueryForm.name.trim();
                        sq.sql = this.newSubqueryForm.sql;
                    }
                } else {
                    // 新建模式
                    if (!this.newSubqueryForm.code.trim()) return;
                    const newId = 'sq_' + Date.now();
                    this.subqueries.push({
                        id: newId,
                        name: this.newSubqueryForm.name.trim(),
                        code: this.newSubqueryForm.code.trim(),
                        sql: this.newSubqueryForm.sql
                    });
                    // 自动选中新建的子查询
                    if (this.pendingFilterIndex !== null) {
                        this.selectSubquery(this.pendingFilterIndex, newId);
                    }
                }
                this.closeSubqueryDrawer();
            },
            // 有效期：计算快捷选择的截止日期
            getComputedExpiryDate(validityType) {
                const now = new Date();
                let days = 0;
                if (validityType === '30d') days = 30;
                if (validityType === '90d') days = 90;
                if (validityType === '180d') days = 180;
                if (days > 0) {
                    const expiry = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
                    return expiry.toISOString().split('T')[0];
                }
                return '';
            }
        },
        emits: ['close', 'save', 'delete', 'update:showAudienceDropdown', 'selectAudience', 'addRowFilter', 'removeRowFilter', 'toggleColumnField', 'openCreateSubqueryModal'],
        template: window.AppTemplates.PermissionRuleEditModal
    };

    const DetailData = {
        name: 'DetailData',
        props: ['node', 'dictionaries', 'eligibleCatalogs', 'topLevelCatalogName', 'globalTags', 'classificationTree', 'classificationOptions'],
        template: window.AppTemplates.DetailData,
        data() {
            return {
                showCatalogDropdown: false,
                dataActiveTab: 'basic_info',
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
                    { name: 'id', type: 'BIGINT', description: '主键', sensitivityClass: 'C1', classification: ['审计信息'], category: '审计信息', governed_tag: null, permission_point: null, is_partition: false, is_encrypted: false },
                    { name: 'name', type: 'VARCHAR(128)', description: '姓名', sensitivityClass: 'C2', classification: ['个人信息', '敏感属性', '基础属性'], category: '个人信息', governed_tag: '/Tags 治理标签/PII 个人信息:/姓名', permission_point: '基础信息', linked_dict: '/字典/标准字典:/姓名', is_partition: false, is_encrypted: true },
                    { name: 'emp_id', type: 'VARCHAR(64)', description: '员工编号', sensitivityClass: 'C1', classification: ['个人信息', '基础属性'], category: '个人信息', governed_tag: '/Tags 治理标签/PII 个人信息:/员工编号', permission_point: '基础信息', linked_dict: '/字典/标准字典:/员工编号', is_partition: false, is_encrypted: false },
                    { name: 'phone', type: 'VARCHAR(32)', description: '手机号', sensitivityClass: 'C3', classification: ['个人信息', '敏感属性', '基础属性'], category: '个人信息', governed_tag: '/Tags 治理标签/PII 个人信息:/手机号', permission_point: '基础信息', linked_dict: null, is_partition: false, is_encrypted: true },
                    { name: 'email', type: 'VARCHAR(128)', description: '邮箱', sensitivityClass: 'C2', classification: ['个人信息', '敏感属性', '基础属性'], category: '个人信息', governed_tag: '/Tags 治理标签/PII 个人信息:/邮箱', permission_point: '基础信息', linked_dict: null, is_partition: false, is_encrypted: true },
                    { name: 'department', type: 'VARCHAR(64)', description: '部门', sensitivityClass: 'C1', classification: ['组织信息', '基础属性'], category: '组织信息', governed_tag: '/Tags 治理标签/业务分类:/部门', permission_point: '基础信息', linked_dict: '/字典/标准字典:/部门编码', is_partition: false, is_encrypted: false },
                    { name: 'salary_account', type: 'VARCHAR(64)', description: '薪资账户', sensitivityClass: 'C4', classification: ['薪酬信息', '敏感属性'], category: '薪酬信息', governed_tag: '/Tags 治理标签/PII 个人信息:/薪资账户', permission_point: null, linked_dict: null, is_partition: false, is_encrypted: true },
                    { name: 'current_level', type: 'VARCHAR(32)', description: '当前职级', sensitivityClass: 'C2', classification: ['职级晋升'], category: '职级晋升', governed_tag: '/Tags 治理标签/业务分类:/职级', permission_point: null, linked_dict: '/字典/标准字典:/职级序列', is_partition: false, is_encrypted: false },
                    { name: 'perf_score', type: 'DECIMAL(5,2)', description: '绩效评分', sensitivityClass: 'C3', classification: ['绩效信息', '敏感属性'], category: '绩效信息', governed_tag: '/Tags 治理标签/业务分类:/绩效', permission_point: null, linked_dict: null, is_partition: false, is_encrypted: false },
                    { name: 'hrbp_name', type: 'VARCHAR(128)', description: 'HRBP姓名', sensitivityClass: 'C2', classification: ['HRBP信息'], category: 'HRBP信息', governed_tag: '/Tags 治理标签/业务分类:/HRBP', permission_point: null, linked_dict: null, is_partition: false, is_encrypted: false },
                    { name: 'report_to_name', type: 'VARCHAR(128)', description: '直属上级姓名', sensitivityClass: 'C2', classification: ['汇报关系'], category: '汇报关系', governed_tag: '/Tags 治理标签/业务分类:/汇报关系', permission_point: null, linked_dict: null, is_partition: false, is_encrypted: false },
                    { name: 'create_time', type: 'TIMESTAMP', description: '创建时间', sensitivityClass: 'C1', classification: ['审计信息'], category: '审计信息', governed_tag: null, permission_point: null, is_partition: false, is_encrypted: false },
                    { name: 'update_time', type: 'TIMESTAMP', description: '更新时间', sensitivityClass: 'C1', classification: ['审计信息'], category: '审计信息', governed_tag: null, permission_point: null, is_partition: false, is_encrypted: false }
                ],
                activeAuthEnv: 'pre',
                authRulesPre: [
                    {
                        name: '部门数据隔离',
                        targetAudience: { type: 'role', value: 'HRBP' },
                        ruleSource: 'custom',
                        columnRuleSource: 'custom',
                        rowRuleSource: 'custom',
                        globalRuleRef: null,
                        columnVisibility: { mode: 'all', fields: [] },
                        rowFilters: [
                            { field: '/Tags 治理标签/业务分类:/部门', operator: '=', valueType: 'env_var', value: '${user_dept}', showSubqueryDropdown: false, subquerySearchQuery: '' }
                        ],
                        conditionLogic: '',
                        validityType: 'permanent',
                        expiryDate: null
                    },
                    {
                        name: 'PII 字段脱敏',
                        targetAudience: { type: 'individual', value: '张三' },
                        ruleSource: 'custom',
                        columnRuleSource: 'custom',
                        rowRuleSource: 'custom',
                        globalRuleRef: null,
                        columnVisibility: { mode: 'include', fields: ['emp_id', 'department', 'leave_type', 'start_date', 'end_date', 'status'] },
                        rowFilters: [],
                        conditionLogic: '',
                        validityType: '30d',
                        expiryDate: null
                    },
                    {
                        name: '薪资字段排除',
                        targetAudience: { type: 'department', value: '财务部' },
                        ruleSource: 'custom',
                        columnRuleSource: 'custom',
                        rowRuleSource: 'custom',
                        globalRuleRef: null,
                        columnVisibility: { mode: 'exclude', fields: ['salary', 'bonus', 'performance_score'] },
                        rowFilters: [
                            { field: '/Tags 治理标签/业务分类:/部门', operator: '=', valueType: 'literal', value: '研发部', showSubqueryDropdown: false, subquerySearchQuery: '' },
                            { field: '/Tags 治理标签/业务分类:/状态', operator: '!=', valueType: 'literal', value: '已离职', showSubqueryDropdown: false, subquerySearchQuery: '' }
                        ],
                        conditionLogic: '1 AND 2',
                        validityType: '90d',
                        expiryDate: null
                    },
                    {
                        name: '引用全局脱敏规则',
                        targetAudience: { type: 'role', value: '实习生' },
                        ruleSource: 'permission_point_reference',
                        columnRuleSource: 'global_reference',
                        rowRuleSource: 'global_reference',
                        globalRuleRef: null,
                        columnVisibility: null,
                        rowFilters: [],
                        conditionLogic: '',
                        validityType: 'permanent',
                        expiryDate: null,
                        selectedRefRules: [
                            { id: 'global_rule_1', name: 'PII 姓名脱敏规则', columnVisibility: { mode: 'exclude', fields: ['name', 'phone', 'email'] }, rowFilters: [{ field: 'department', operator: '=', value: '自己部门' }] },
                            { id: 'global_rule_2', name: '薪资字段屏蔽规则', columnVisibility: { mode: 'exclude', fields: ['salary', 'bonus'] }, rowFilters: [] }
                        ],
                        refRuleNames: ['PII 姓名脱敏规则', '薪资字段屏蔽规则']
                    },
                    {
                        name: '过期测试规则',
                        targetAudience: { type: 'role', value: '外包人员' },
                        ruleSource: 'custom',
                        columnRuleSource: 'custom',
                        rowRuleSource: 'custom',
                        globalRuleRef: null,
                        columnVisibility: { mode: 'include', fields: ['emp_id', 'name'] },
                        rowFilters: [
                            { field: '/Tags 治理标签/业务分类:/部门', operator: 'IN', valueType: 'literal', value: '项目组A,项目组B', showSubqueryDropdown: false, subquerySearchQuery: '' }
                        ],
                        conditionLogic: '',
                        validityType: 'custom',
                        expiryDate: '2025-03-01'
                    }
                ],
                authRulesOnline: [
                    {
                        name: '生产环境规则',
                        targetAudience: { type: 'role', value: '管理者' },
                        ruleSource: 'custom',
                        columnRuleSource: 'custom',
                        rowRuleSource: 'custom',
                        globalRuleRef: null,
                        columnVisibility: { mode: 'all', fields: [] },
                        rowFilters: [
                            { field: '/Tags 治理标签/业务分类:/部门', operator: '=', valueType: 'env_var', value: '${user_dept}', showSubqueryDropdown: false, subquerySearchQuery: '' }
                        ],
                        conditionLogic: '',
                        validityType: 'custom',
                        expiryDate: '2026-09-30'
                    },
                    {
                        name: '生产-引用规则',
                        targetAudience: { type: 'role', value: '数据分析师' },
                        ruleSource: 'permission_point_reference',
                        columnRuleSource: 'global_reference',
                        rowRuleSource: 'global_reference',
                        globalRuleRef: null,
                        columnVisibility: null,
                        rowFilters: [],
                        conditionLogic: '',
                        validityType: '180d',
                        expiryDate: null,
                        selectedRefRules: [
                            { id: 'global_rule_1', name: 'PII 姓名脱敏规则', columnVisibility: { mode: 'exclude', fields: ['name', 'phone'] }, rowFilters: [{ field: 'department', operator: '=', value: '自己部门' }] }
                        ],
                        refRuleNames: ['PII 姓名脱敏规则']
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
                originalLatestVersion: '1.0.2',
                currentVersion: { version: '1.0.2', environments: { online: '1.0.2', pre: '1.0.2', test: null }, isLatest: true, createdBy: '张嘉怡', createdAt: '2026/5/20 14:30:00', changeLog: '新增环境标签字段展示，优化字段分类与权限点配置' },
                versionHistory: [
                    {
                        version: '1.0.1',
                        environments: { online: null, pre: '1.0.1', test: '1.0.1' },
                        createdBy: '李明',
                        createdAt: '2026/4/15 10:20:00',
                        changeLog: '添加敏感字段脱敏规则，配置绩效信息权限点',
                        isLatest: false
                    },
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
                newResourceTagName: '',
                // 子查询数据
                subqueries: [
                    { id: 'sq_active_users', name: '活跃用户列表', code: 'active_users', sql: 'SELECT user_id FROM user_stats WHERE last_login > DATE_SUB(NOW(), INTERVAL 30 DAY)' },
                    { id: 'sq_hrbp_depts', name: 'HRBP管理部门', code: 'hrbp_managed', sql: 'SELECT department_id FROM hrbp_mapping WHERE hrbp_id = {user_id}' },
                    { id: 'sq_sensitive_data', name: '敏感数据权限组', code: 'sensitive_access', sql: 'SELECT resource_id FROM permission_matrix WHERE user_id = {user_id} AND access_level >= 3' },
                    { id: 'sq_team_members', name: '团队成员', code: 'team_members', sql: 'SELECT member_id FROM team WHERE leader_id = {user_id}' }
                ],
                // 权限点引用相关（平铺列表，非树状）
                permissionPointTree: [
                    { id: 'pp_base', name: '基础信息' },
                    { id: 'pp_org', name: '组织信息' },
                    { id: 'pp_hrbp', name: 'HRBP信息' },
                    { id: 'pp_report', name: '汇报关系' },
                    { id: 'pp_mgmt_base', name: '管理信息-基础' },
                    { id: 'pp_promo_base', name: '职级晋升-基础' },
                    { id: 'pp_promo_sensitive', name: '职级晋升-敏感' },
                    { id: 'pp_perf', name: '绩效信息' },
                    { id: 'pp_talent', name: '人才盘点' }
                ],
                // 分类（由 Vue app 的 ref 传入，这里留空占位）
                // ks.emp.base: 400+ 字段分属不同权限点
                availableTablesForColumnPermission: (() => {
                    // 权限点定义
                    const pp = ['基础信息', '组织信息', 'HRBP信息', '汇报关系', '管理信息-基础', '职级晋升-基础', '职级晋升-敏感', '绩效信息', '人才盘点'];
                    // 按权限点分配字段数量
                    const fieldDefs = [
                        // 基础信息 (约60字段)
                        ...['emp_id','emp_name','username','emp_nature','emp_type','emp_nature_group','gender','birth_date','nation','political_status','marital_status','education','graduation_school','major','phone','email','id_card_type','id_card_no','address','city','province','country','zip_code','emergency_contact','emergency_phone','avatar_url','photo_url','entry_channel','recruit_source','is_intern','intern_end_date','contract_type','contract_start','contract_end','contract_periods','probation_start','probation_end','probation_months','is_probation_passed','social_security_no','tax_id','bank_name','bank_account','salary_account','cost_center','hire_type','rehire_flag','work_city','work_location','seat_no','emp_status','status_change_date','leave_type','leave_date','leave_reason','create_time','update_time'].map(f => ({ name: f, permissionPoint: '基础信息' })),
                        // 组织信息 (约50字段)
                        ...['dept_id','dept_name','dept_path','dept_level','dept_type','dept_head_id','dept_head_name','parent_dept_id','parent_dept_name','org_unit_id','org_unit_name','org_unit_code','business_line','business_line_name','sub_business_line','cost_center_id','cost_center_name','profit_center','profit_center_name','company_id','company_name','company_code','legal_entity','legal_entity_name','region_id','region_name','zone_id','zone_name','branch_id','branch_name','team_id','team_name','team_code','group_id','group_name','section_id','section_name','unit_id','unit_name','factory_id','factory_name','floor_id','floor_name','office_id','office_name','building_id','building_name','campus_id','campus_name'].map(f => ({ name: f, permissionPoint: '组织信息' })),
                        // HRBP信息 (约30字段)
                        ...['hrbp_id','hrbp_name','hrbp_email','hrbp_phone','hrbp_level','hrbp_dept_id','hrbp_dept_name','hrbp_scope','hrbp_scope_type','hrbp_start_date','hrbp_end_date','hrbp_is_active','hrbp_backup_id','hrbp_backup_name','hrbp_score','hrbp_eval_date','hrbp_cert_level','hrbp_service_year','hrbp_load_ratio','hrbp_case_count','hrbp_satisfaction_rate','hrbp_response_time','hrbp_region','hrbp_team_size','hrbp_mentor_id','hrbp_mentor_name','hrbp_train_hours','hrbp_special_flag','hrbp_category'].map(f => ({ name: f, permissionPoint: 'HRBP信息' })),
                        // 汇报关系 (约30字段)
                        ...['report_to_id','report_to_name','report_to_level','report_to_dept','report_to_position','report_to_type','report_line_id','report_line_name','second_report_id','second_report_name','third_report_id','third_report_name','skip_report_id','skip_report_name','matrix_report_id','matrix_report_name','matrix_report_type','matrix_report_dept','functional_report_id','functional_report_name','report_depth','report_chain','is_top_manager','is_skip_level','delegate_report_id','delegate_report_name','delegate_start','delegate_end','temp_report_id','temp_report_name'].map(f => ({ name: f, permissionPoint: '汇报关系' })),
                        // 管理信息-基础 (约35字段)
                        ...['mgmt_id','mgmt_type','mgmt_level','mgmt_scope','mgmt_scope_type','mgmt_start_date','mgmt_end_date','mgmt_is_active','team_size','direct_reports','indirect_reports','total_reports','budget','budget_year','budget_type','authority_level','decision_scope','approval_limit','approval_type','mgmt_style','mgmt_score','mgmt_eval_date','mgmt_cert_flag','is_key_manager','mgmt_delegated_flag','mgmt_delegated_to','mgmt_backup','mgmt_backup_name','span_of_control','mgmt_tenure','mgmt_training_hours','mgmt_rotation_count','mgmt_project_count','mgmt_kpi_score','mgmt_bonus_pool'].map(f => ({ name: f, permissionPoint: '管理信息-基础' })),
                        // 职级晋升-基础 (约40字段)
                        ...['current_level','current_level_name','level_type','level_category','level_grade','level_score','level_entry_date','level_adjust_date','next_level','next_level_name','promotion_eligible_date','promotion_eligible_flag','promotion_apply_date','promotion_apply_flag','promotion_plan_date','promotion_plan_type','promotion_track','promotion_track_name','promotion_path','promotion_path_type','level_seq','level_seq_no','level_tier','level_tier_name','level_band','level_band_name','level_family','level_family_name','level_sub_family','level_sub_family_name','level_is_terminal','level_ref_code','level_min_salary','level_max_salary','level_mid_salary','level_tenure_require','level_perf_require','level_competency','level_cert_require'].map(f => ({ name: f, permissionPoint: '职级晋升-基础' })),
                        // 职级晋升-敏感 (约40字段)
                        ...['promotion_status','promotion_result','promotion_score','promotion_score_detail','promotion_reviewer_id','promotion_reviewer_name','promotion_review_date','promotion_review_comment','promotion_committee_score','promotion_committee_comment','promotion_final_score','promotion_rank','promotion_rank_in_dept','promotion_reason','promotion_evidence','promotion_appeal_flag','promotion_appeal_result','promotion_appeal_date','old_level','old_level_name','new_level','new_level_name','level_change_type','level_change_reason','salary_adjust_flag','salary_adjust_ratio','salary_adjust_amount','stock_adjust_flag','stock_adjust_amount','bonus_adjust_flag','bonus_adjust_ratio','competency_eval_score','competency_eval_level','competency_eval_date','competency_gap','sensitive_flag','sensitive_level','data_mask_flag','mask_rule_id','audit_log_id'].map(f => ({ name: f, permissionPoint: '职级晋升-敏感' })),
                        // 绩效信息 (约50字段)
                        ...['perf_year','perf_quarter','perf_period','perf_cycle','perf_type','perf_score','perf_level','perf_grade','perf_rank','perf_rank_in_dept','perf_percentile','perf_target_score','perf_actual_score','perf_gap','perf_completion_rate','perf_kpi_score','perf_kpi_detail','perf_behavior_score','perf_behavior_detail','perf_competency_score','perf_competency_detail','perf_potential_score','perf_potential_level','perf_overall_comment','perf_self_eval_score','perf_self_eval_comment','perf_manager_score','perf_manager_comment','perf_360_score','perf_360_detail','perf_calibrator_id','perf_calibrator_name','perf_calibrator_score','perf_calibrator_comment','perf_review_id','perf_review_status','perf_appeal_flag','perf_appeal_result','perf_bonus_flag','perf_bonus_amount','perf_salary_adjust_flag','perf_salary_adjust_ratio','perf_promotion_flag','perf_improvement_plan','perf_training_plan','perf_mentor_assign','perf_next_goal','perf_is_final','perf_sign_date'].map(f => ({ name: f, permissionPoint: '绩效信息' })),
                        // 人才盘点 (约50字段)
                        ...['talent_review_year','talent_review_cycle','talent_review_type','talent_category','talent_category_name','talent_potential','talent_potential_level','talent_performance','talent_performance_level','talent_ready_now','talent_ready_1yr','talent_ready_3yr','talent_flight_risk','talent_flight_risk_level','talent_retention_strategy','talent_key_strength','talent_key_strength_detail','talent_key_gap','talent_key_gap_detail','talent_development_plan','talent_development_action','talent_career_path','talent_career_target','talent_rotation_plan','talent_rotation_target','talent_successor_of','talent_successor_for','talent_successor_ready','talent_backup_of','talent_backup_for','talent_critical_flag','talent_critical_level','talent_special_track','talent_special_track_name','talent_tier','talent_tier_name','talent_band','talent_band_name','talent_pool','talent_pool_name','talent_reviewer_id','talent_reviewer_name','talent_review_score','talent_review_comment','talent_is_high_potential','talent_is_key_person','talent_replace_cost','talent_impact_scope','talent_urgency_level','talent_strategy_tag','talent_develop_priority'].map(f => ({ name: f, permissionPoint: '人才盘点' }))
                    ];
                    // 加上一些无权限点的辅助字段
                    const extraFields = ['id','create_time','update_time','is_deleted','version','data_source','load_date','etl_batch_id','partition_date','sync_flag','op_type','diff_type','biz_date','source_system','source_table','source_field','quality_score','quality_flag','dq_check_date','dq_error_count','dq_error_type','audit_id','audit_action','audit_user','audit_date','audit_comment','row_count','col_count','md5_hash','schema_version','ddl_version','is_encrypted','encrypt_key_id','decrypt_flag','mask_type','mask_rule_id','retention_days','expire_date','archive_flag','archive_date','replication_flag','replication_source','snapshot_date','snapshot_version','change_type','change_date','change_user','change_reason','validation_status','validation_date','validation_error','reconciliation_flag','reconciliation_date','reconciliation_diff','is_active','effective_date','expire_flag','data_owner','data_steward','data_custodian','lineage_id','lineage_source','lineage_path','comment','remark','note','description','metadata_version','catalog_id','catalog_path','project_id','project_name','env_tag','env_name','app_id','app_name','service_id','service_name','api_id','api_name','workflow_id','workflow_name','task_id','task_name','job_id','job_name','run_id','run_date','run_status','run_duration','run_error','log_id','log_date','log_level','log_message','trace_id','span_id','parent_span_id','operation_name','operation_type','operation_duration','operation_status','operation_error','request_id','request_date','response_code','response_time','retry_count','retry_flag','timeout_flag','callback_id','callback_date','callback_status','callback_result','event_id','event_type','event_date','event_source','event_target','event_data','event_status','queue_id','queue_name','queue_depth','queue_status','topic_id','topic_name','topic_partition','topic_offset','consumer_group','consumer_id','consumer_status','producer_id','producer_status','message_id','message_key','message_value','message_size','message_date','message_retry','message_error','is_test','test_id','test_name','test_env','test_date','test_result','test_error','bench_id','bench_name','bench_type','bench_score','bench_detail','bench_date','bench_version','bench_env','bench_status','bench_error','bench_duration','bench_metric','bench_threshold','bench_passed','bench_failed','bench_total','bench_ratio','bench_trend','bench_baseline','bench_comment','bench_note','bench_description'].map(f => ({ name: f, permissionPoint: null }));
                    const allFields = [...fieldDefs, ...extraFields];
                    return [
                        { id: 'tbl_1', name: 'ks.emp.base', chineseName: '员工基础信息表', catalogPath: '公共资源库/人力资源', fields: allFields },
                        { id: 'tbl_2', name: 'ks.emp.leave', chineseName: '员工休假记录表', catalogPath: '公共资源库/人力资源', fields: [
                            { name: 'leave_id', permissionPoint: null },
                            { name: 'emp_id', permissionPoint: '基础信息' },
                            { name: 'leave_type', permissionPoint: '基础信息' },
                            { name: 'start_date', permissionPoint: null },
                            { name: 'end_date', permissionPoint: null },
                            { name: 'leave_days', permissionPoint: '组织信息' },
                            { name: 'approve_status', permissionPoint: null },
                            { name: 'approve_id', permissionPoint: '汇报关系' },
                            { name: 'leave_reason', permissionPoint: '基础信息' },
                            { name: 'leave_category', permissionPoint: '基础信息' },
                            { name: 'cancel_flag', permissionPoint: null },
                            { name: 'half_day_flag', permissionPoint: '基础信息' },
                            { name: 'substitute_id', permissionPoint: '汇报关系' },
                            { name: 'hrbp_approve_id', permissionPoint: 'HRBP信息' },
                            { name: 'hrbp_approve_date', permissionPoint: 'HRBP信息' },
                            { name: 'hrbp_comment', permissionPoint: 'HRBP信息' }
                        ] },
                        { id: 'tbl_3', name: 'ks.performance.review', chineseName: '绩效评估表', catalogPath: '公共资源库/人力资源/绩效', fields: [
                            { name: 'review_id', permissionPoint: null },
                            { name: 'emp_id', permissionPoint: '基础信息' },
                            { name: 'review_period', permissionPoint: '绩效信息' },
                            { name: 'score', permissionPoint: '绩效信息' },
                            { name: 'level', permissionPoint: '绩效信息' },
                            { name: 'reviewer_id', permissionPoint: null },
                            { name: 'comment', permissionPoint: '绩效信息' },
                            { name: 'self_score', permissionPoint: '绩效信息' },
                            { name: 'calibrator_id', permissionPoint: '绩效信息' },
                            { name: 'calibrator_score', permissionPoint: '职级晋升-敏感' },
                            { name: 'potential_level', permissionPoint: '人才盘点' },
                            { name: 'flight_risk', permissionPoint: '职级晋升-敏感' },
                            { name: 'promotion_flag', permissionPoint: '职级晋升-基础' },
                            { name: 'dept_id', permissionPoint: '组织信息' },
                            { name: 'mgmt_id', permissionPoint: '管理信息-基础' }
                        ] },
                        { id: 'tbl_4', name: 'ks.promotion.record', chineseName: '晋升记录表', catalogPath: '公共资源库/人力资源/晋升', fields: [
                            { name: 'record_id', permissionPoint: null },
                            { name: 'emp_id', permissionPoint: '基础信息' },
                            { name: 'old_level', permissionPoint: '职级晋升-基础' },
                            { name: 'new_level', permissionPoint: '职级晋升-基础' },
                            { name: 'promotion_date', permissionPoint: '职级晋升-基础' },
                            { name: 'approve_id', permissionPoint: null },
                            { name: 'promotion_score', permissionPoint: '职级晋升-敏感' },
                            { name: 'promotion_reason', permissionPoint: '职级晋升-敏感' },
                            { name: 'salary_adjust_ratio', permissionPoint: '职级晋升-敏感' },
                            { name: 'review_comment', permissionPoint: '职级晋升-敏感' },
                            { name: 'dept_id', permissionPoint: '组织信息' },
                            { name: 'report_to_id', permissionPoint: '汇报关系' }
                        ] },
                        { id: 'tbl_5', name: 'ks.management.info', chineseName: '管理信息表', catalogPath: '公共资源库/人力资源/管理', fields: [
                            { name: 'mgmt_id', permissionPoint: null },
                            { name: 'emp_id', permissionPoint: '基础信息' },
                            { name: 'team_size', permissionPoint: '管理信息-基础' },
                            { name: 'budget', permissionPoint: '管理信息-基础' },
                            { name: 'authority_level', permissionPoint: '管理信息-基础' },
                            { name: 'report_to', permissionPoint: '汇报关系' },
                            { name: 'hrbp_id', permissionPoint: 'HRBP信息' },
                            { name: 'hrbp_name', permissionPoint: 'HRBP信息' },
                            { name: 'direct_reports', permissionPoint: '管理信息-基础' },
                            { name: 'approval_limit', permissionPoint: '管理信息-基础' },
                            { name: 'span_of_control', permissionPoint: '管理信息-基础' },
                            { name: 'dept_id', permissionPoint: '组织信息' }
                        ] }
                    ];
                })(),
                // 列权限规则数据（与访问控制中的规则保持一致）
                columnPermissionRules: [
                    {
                        id: 'cpr_1',
                        name: 'OD-基础',
                        description: '除HR外，E13及以下OD工作所需的员工和组织基础字段',
                        sensitivityLevel: 'basic',
                        tableFields: {
                            'tbl_1': ['emp_id', 'emp_name', 'username', 'emp_nature', 'emp_type', 'emp_nature_group'],
                            'tbl_2': ['leave_id', 'emp_id', 'leave_type']
                        },
                        rowFilters: [
                            { field: 'PII 个人信息/姓名', operator: '=', value: 'visiting_user.real_name', valueType: 'env_var' }
                        ],
                        conditionLogic: ''
                    },
                    {
                        id: 'cpr_2',
                        name: 'OD-敏感-职级晋升-低职级',
                        description: '包含职级晋升相关的敏感字段',
                        sensitivityLevel: 'sensitive',
                        tableFields: {
                            'tbl_1': ['emp_id', 'emp_name', 'emp_nature'],
                            'tbl_4': ['record_id', 'emp_id', 'old_level', 'new_level']
                        },
                        rowFilters: [
                            { field: '/Tags 治理标签/业务分类:/职级', operator: '<=', valueType: 'env_var', value: '${user_level}' }
                        ],
                        conditionLogic: ''
                    },
                    {
                        id: 'cpr_3',
                        name: 'OD-敏感-绩效信息-低职级',
                        description: '包含绩效评估相关的敏感字段',
                        sensitivityLevel: 'sensitive',
                        tableFields: {
                            'tbl_1': ['emp_id', 'emp_name', 'username'],
                            'tbl_3': ['review_id', 'emp_id', 'score', 'level']
                        },
                        rowFilters: [
                            { field: '/Tags 治理标签/业务分类:/职级', operator: '<=', valueType: 'env_var', value: '${user_level}' },
                            { field: '/Tags 治理标签/业务分类:/部门', operator: '=', valueType: 'env_var', value: '${user_dept}' }
                        ],
                        conditionLogic: '1 AND 2'
                    },
                    {
                        id: 'cpr_4',
                        name: 'OD-敏感-管理信息-低职级',
                        description: '包含管理信息相关的敏感字段',
                        sensitivityLevel: 'high_sensitive',
                        tableFields: {
                            'tbl_1': ['emp_id', 'emp_name'],
                            'tbl_5': ['mgmt_id', 'emp_id', 'authority_level']
                        },
                        rowFilters: [
                            { field: '/Tags 治理标签/业务分类:/部门', operator: '=', valueType: 'env_var', value: '${user_dept}' }
                        ],
                        conditionLogic: ''
                    },
                    {
                        id: 'cpr_5',
                        name: 'OD-人才盘点-高职级',
                        description: '包含人才盘点、潜力评估等极高敏感字段，仅限高职级OD使用',
                        sensitivityLevel: 'top_sensitive',
                        tableFields: {
                            'tbl_1': ['emp_id', 'emp_name', 'current_level'],
                            'tbl_3': ['review_id', 'emp_id', 'score', 'level', 'calibrator_score', 'potential_level', 'flight_risk']
                        },
                        rowFilters: [],
                        conditionLogic: ''
                    }
                ]
            };
        },
        computed: {
            authRules() {
                return this.activeAuthEnv === 'online' ? this.authRulesOnline : this.authRulesPre;
            },
            tableDescription() {
                return this.node ? this.node.description : '';
            },
            isCurrentVersionPublished() {
                return !!(this.currentVersion.environments.online || this.currentVersion.environments.pre || this.currentVersion.environments.test);
            },
            isViewingHistoricalVersion() {
                // 判断是否在查看历史版本：当前版本不是最初加载时的最新版本
                // 初始加载时 originalLatestVersion = '1.0.2'，切换到旧版本后 currentVersion.version 变了
                return this.currentVersion.version !== this.originalLatestVersion;
            },
            shouldShowEnvColumn() {
                return this.isCurrentVersionPublished && !this.isViewingHistoricalVersion;
            },
            getFieldEnvironmentTags() {
                return function(fieldName) {
                    const envs = [];
                    const envMap = this.currentVersion.environments;
                    if (envMap.online) envs.push({ key: 'online', label: '生产', color: 'green' });
                    if (envMap.pre) envs.push({ key: 'pre', label: '预发', color: 'blue' });
                    if (envMap.test) envs.push({ key: 'test', label: '测试', color: 'purple' });
                    return envs;
                };
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
            isSystemClassification(name) {
                return (this.classificationTree || []).some(node => node.name === name && node.isSystem);
            },
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
                        columnRuleSource: 'custom',
                        rowRuleSource: 'custom',
                        globalRuleRef: null,
                        // 列可见性
                        columnVisibility: {
                            mode: 'all',
                            fields: []
                        },
                        // 行权限条件
                        rowFilters: [],
                        conditionLogic: '',
                        rowRangeType: 'specified',
                        tagFieldMappings: {},
                        // 引用规则相关
                        selectedRefRules: [],
                        refRuleSearchQuery: '',
                        // 有效期相关
                        validityType: 'permanent',
                        expiryDate: null,
                        validityStartDate: new Date().toISOString().split('T')[0],
                        validityEndDate: ''
                    };
                } else {
                    // 编辑已有规则
                    const rule = this.authRules[index];
                    this.editingAuthRule = JSON.parse(JSON.stringify(rule)); // 深拷贝
                    // 兼容旧数据：将 ruleSource 转换为 columnRuleSource
                    if (!this.editingAuthRule.columnRuleSource && this.editingAuthRule.ruleSource) {
                        this.editingAuthRule.columnRuleSource = this.editingAuthRule.ruleSource;
                    }
                    // 补充引用规则相关字段（旧规则可能没有）
                    if (!this.editingAuthRule.selectedRefRules) this.editingAuthRule.selectedRefRules = [];
                    if (!this.editingAuthRule.refRuleSearchQuery) this.editingAuthRule.refRuleSearchQuery = '';
                    // 补充行权限相关字段（旧规则可能没有）
                    if (!this.editingAuthRule.rowRuleSource) this.editingAuthRule.rowRuleSource = 'custom';
                    if (!this.editingAuthRule.rowFilters) this.editingAuthRule.rowFilters = [];
                    if (!this.editingAuthRule.conditionLogic) this.editingAuthRule.conditionLogic = '';
                    // 补充有效期相关字段（旧规则可能没有）
                    if (!this.editingAuthRule.validityType) this.editingAuthRule.validityType = this.editingAuthRule.expiryDate ? 'custom' : 'permanent';
                    if (!this.editingAuthRule.validityStartDate) this.editingAuthRule.validityStartDate = new Date().toISOString().split('T')[0];
                    if (!this.editingAuthRule.validityEndDate) this.editingAuthRule.validityEndDate = this.editingAuthRule.expiryDate || '';
                    // 补充行范围类型（旧规则可能没有）
                    if (!this.editingAuthRule.rowRangeType) this.editingAuthRule.rowRangeType = (this.editingAuthRule.rowFilters && this.editingAuthRule.rowFilters.length > 0) ? 'specified' : 'specified';
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
            getComputedExpiryDate(validityType) {
                const now = new Date();
                let days = 0;
                if (validityType === '30d') days = 30;
                if (validityType === '90d') days = 90;
                if (validityType === '180d') days = 180;
                if (days > 0) {
                    const expiry = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
                    return expiry.toISOString().split('T')[0];
                }
                return '';
            },
            saveAuthRuleEdit() {
                // 创建新版本
                this.createNewVersion();

                // 处理有效期数据
                if (this.editingAuthRule.validityType === '30d' || this.editingAuthRule.validityType === '90d' || this.editingAuthRule.validityType === '180d') {
                    this.editingAuthRule.expiryDate = this.getComputedExpiryDate(this.editingAuthRule.validityType);
                    this.editingAuthRule.validityType = 'custom'; // 快捷选择最终存为 custom 类型
                } else if (this.editingAuthRule.validityType === 'permanent') {
                    this.editingAuthRule.expiryDate = null;
                } else if (this.editingAuthRule.validityType === 'custom') {
                    if (this.editingAuthRule.validityEndDate) {
                        this.editingAuthRule.expiryDate = this.editingAuthRule.validityEndDate;
                    }
                }


                // 确定是否有引用规则
                const hasColumnRef = this.editingAuthRule.columnRuleSource === 'global_reference' && this.editingAuthRule.selectedRefRules && this.editingAuthRule.selectedRefRules.length > 0;

                if (hasColumnRef) {
                    // 列权限引用访问控制规则：直接保存选中的规则引用
                    const refRuleNames = [];
                    for (const selectedRule of this.editingAuthRule.selectedRefRules) {
                        refRuleNames.push(selectedRule.name);
                    }

                    const rule = {
                        name: this.editingAuthRule.name || refRuleNames.join(' / '),
                        targetAudience: this.editingAuthRule.targetAudience,
                        columnRuleSource: this.editingAuthRule.columnRuleSource,
                        ruleSource: 'permission_point_reference',
                        selectedRefRules: JSON.parse(JSON.stringify(this.editingAuthRule.selectedRefRules)),
                        refRuleNames: refRuleNames
                    };
                    this.authRules.push(rule);
                } else {
                    // 列权限使用自定义规则，直接保存
                    // 设置兼容旧字段的 ruleSource
                    this.editingAuthRule.ruleSource = this.editingAuthRule.columnRuleSource;
                    if (this.editingAuthRuleIndex === -1) {
                        // 新增规则
                        this.authRules.push(JSON.parse(JSON.stringify(this.editingAuthRule)));
                    } else {
                        // 更新规则
                        this.authRules[this.editingAuthRuleIndex] = JSON.parse(JSON.stringify(this.editingAuthRule));
                    }
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
            // 子查询相关方法
            getSubqueryName(id) {
                const sq = this.subqueries.find(s => s.id === id);
                return sq ? sq.name : '';
            },
            getFilteredSubqueries(query) {
                if (!query) return this.subqueries;
                const q = query.toLowerCase();
                return this.subqueries.filter(s =>
                    s.name.toLowerCase().includes(q) ||
                    s.code.toLowerCase().includes(q)
                );
            },
            toggleSubqueryDropdown(filterIndex) {
                if (this.editingAuthRule?.rowFilters?.[filterIndex]) {
                    this.editingAuthRule.rowFilters[filterIndex].showSubqueryDropdown = !this.editingAuthRule.rowFilters[filterIndex].showSubqueryDropdown;
                }
            },
            updateSubquerySearch(filterIndex, query) {
                if (this.editingAuthRule?.rowFilters?.[filterIndex]) {
                    this.editingAuthRule.rowFilters[filterIndex].subquerySearchQuery = query;
                }
            },
            selectSubquery(filterIndex, subqueryId) {
                if (this.editingAuthRule?.rowFilters?.[filterIndex]) {
                    this.editingAuthRule.rowFilters[filterIndex].value = subqueryId;
                    this.editingAuthRule.rowFilters[filterIndex].showSubqueryDropdown = false;
                }
            },
            openCreateSubqueryModal(filterIndex) {
                // 触发主应用显示弹窗
                this.$root.showCreateSubqueryModal = true;
                this.$root.subqueryForm = { name: '', code: '', sql: '' };
            },

            // 行权限：添加过滤条件
            addRowFilter() {
                if (!this.editingAuthRule.rowFilters) {
                    this.editingAuthRule.rowFilters = [];
                }
                this.editingAuthRule.rowFilters.push({
                    field: '',
                    operator: '=',
                    valueType: 'literal',
                    value: '',
                    showSubqueryDropdown: false,
                    subquerySearchQuery: ''
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
                if (rule.columnRuleSource === 'global_reference' || rule.ruleSource === 'permission_point_reference') {
                    // 引用模式：显示引用的规则名
                    if (rule.refRuleNames && rule.refRuleNames.length > 0) {
                        desc.push(`引用: ${rule.refRuleNames.join(', ')}`);
                    }
                    if (rule.selectedRefRules) {
                        let totalFields = 0;
                        let totalTables = 0;
                        for (const refRule of rule.selectedRefRules) {
                            if (refRule.tableFields) {
                                for (const tblId of Object.keys(refRule.tableFields)) {
                                    if (refRule.tableFields[tblId].length > 0) {
                                        totalTables++;
                                        totalFields += refRule.tableFields[tblId].length;
                                    }
                                }
                            }
                        }
                        if (totalTables > 0) {
                            desc.push(`${totalTables}个表 ${totalFields}个字段`);
                        }
                    }
                } else if (rule.columnVisibility) {
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

                // 行权限
                if (rule.rowRuleSource === 'global_reference') {
                    desc.push('行权限: 引用全局规则');
                } else if (rule.rowFilters && rule.rowFilters.length > 0) {
                    desc.push(`行权限: ${rule.rowFilters.length}个条件`);
                }

                return desc.length > 0 ? desc.join('; ') : '-';
            },
            // 格式化行权限展示（用于引用权限点弹窗）
            formatRowPermissionDisplay(rule) {
                if (!rule.rowFilters || rule.rowFilters.length === 0) return '无行权限条件';
                const parts = rule.rowFilters.map(f => {
                    const fieldShort = f.field ? f.field.split('/').pop() : '?';
                    return `${fieldShort} ${f.operator} ${f.value}`;
                });
                return '行权限: ' + parts.join(', ');
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
                    classification: Array.isArray(f.classification) ? [...f.classification] : (f.classification ? [f.classification] : []),
                    categoryId: f.categoryId || null,
                    category: f.category || null,
                    governed_tag: f.governed_tag || null,
                    permission_point: f.permission_point || null,
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
                f.classification = F.classification;
                f.categoryId = F.categoryId || null;
                f.category = F.category || (Array.isArray(F.classification) && F.classification[0]) || null;
                f.governed_tag = F.governed_tag;
                f.permission_point = F.permission_point;
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
            },
            // 权限点相关方法
            getPermissionPointShortName(path) {
                if (!path) return '—';
                const parts = path.split('/');
                return parts[parts.length - 1];
            },
            getPermissionPointPathSegments(path) {
                if (!path) return [];
                const parts = path.split('/');
                return parts.map((p, i) => ({ name: p, depth: i }));
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

    // 分类管理（二级业务域）：领域分类 → 字段分类 + 负责人
    const buildCategorySeedTree = (domainId) => {
        const user = (name) => {
            const found = [
                { id: 'u_sqy', name: '邵秋旸', userName: 'shaoqiuyang', department: 'OD · 干部管理' },
                { id: 'u_zxq', name: '郑晓庆', userName: 'zhengxiaoqing', department: 'OD · 人才发展' },
                { id: 'u_st', name: '沈恬', userName: 'shentian', department: 'OD部门' },
                { id: 'u_ty', name: '唐颖', userName: 'tangying', department: 'CB · 成本组' },
                { id: 'u_zy', name: '郑悦', userName: 'zhengyue', department: 'CB · LTI运营' },
                { id: 'u_cmh', name: '陈铭涵', userName: 'chenminghan', department: 'CB · 激励组' },
                { id: 'u_gl', name: '龚力', userName: 'gongli', department: 'CB · 外包组' },
                { id: 'u_zk', name: '张科', userName: 'zhangke', department: 'SF' },
                { id: 'u_wb', name: '王贝', userName: 'wangbei', department: 'CB部门' },
                { id: 'u_whx', name: '王宏轩', userName: 'wanghongxuan', department: 'HC' },
                { id: 'u_jx', name: '金鑫', userName: 'jinxin', department: '生态用工' },
                { id: 'u_zkai', name: '周恺', userName: 'zhoukai', department: '招聘运营' },
                { id: 'u_dh', name: '杜昊', userName: 'duhao', department: 'C招聘' }
            ].find(u => u.name === name);
            return found ? { ...found } : { id: 'u_' + name, name, userName: name, department: '' };
        };
        if (domainId !== 'root_hr') return [];
        return [
            {
                id: 'dom_general', name: '通用字段', type: 'domain', isOpen: true,
                owner: null,
                children: [
                    { id: 'fld_basic', name: '基础信息', type: 'field', owner: null }
                ]
            },
            {
                id: 'dom_od', name: 'OD领域', type: 'domain', isOpen: true,
                owner: user('沈恬'),
                children: [
                    { id: 'fld_od_mgmt', name: '管理信息', type: 'field', owner: user('邵秋旸') },
                    { id: 'fld_od_talent', name: '人才盘点', type: 'field', owner: user('邵秋旸') },
                    { id: 'fld_od_promo', name: '职级晋升', type: 'field', owner: user('郑晓庆') },
                    { id: 'fld_od_perf', name: '绩效信息', type: 'field', owner: user('郑晓庆') }
                ]
            },
            {
                id: 'dom_cb', name: 'CB领域', type: 'domain', isOpen: true,
                owner: user('王贝'),
                children: [
                    { id: 'fld_cb_emp_cost', name: '员工全量信息表（成本）', type: 'field', owner: user('唐颖') },
                    { id: 'fld_cb_token', name: 'Token成本表', type: 'field', owner: user('唐颖') },
                    { id: 'fld_cb_lti', name: 'LTI报表', type: 'field', owner: user('郑悦') },
                    { id: 'fld_cb_tp', name: 'TP报表', type: 'field', owner: user('陈铭涵') },
                    { id: 'fld_cb_social', name: '社招Offer报表（含薪酬）', type: 'field', owner: user('陈铭涵') },
                    { id: 'fld_cb_campus', name: '校招Offer报表（含薪酬）', type: 'field', owner: user('陈铭涵') },
                    { id: 'fld_cb_bonus', name: '奖金表', type: 'field', owner: user('陈铭涵') },
                    { id: 'fld_cb_salary', name: '调薪表', type: 'field', owner: user('陈铭涵') },
                    { id: 'fld_cb_out', name: '外包报价花名册', type: 'field', owner: user('龚力') },
                    { id: 'fld_cb_sf', name: 'SF相关', type: 'field', owner: user('张科') }
                ]
            },
            {
                id: 'dom_flex', name: '多样化用工领域', type: 'domain', isOpen: false,
                owner: user('金鑫'),
                children: [
                    { id: 'fld_flex_intern', name: '实习生相关', type: 'field', owner: user('王宏轩') },
                    { id: 'fld_flex_hc', name: 'HC数据', type: 'field', owner: user('王宏轩') }
                ]
            },
            {
                id: 'dom_recruit', name: '招聘领域', type: 'domain', isOpen: false,
                owner: user('杜昊'),
                children: [
                    { id: 'fld_recruit_data', name: '招聘数据', type: 'field', owner: user('周恺') }
                ]
            }
        ];
    };

    const getFieldCategoryOptions = (domainCatalogId) => {
        if (!domainCatalogId) return [];
        if (!window.__categoryTreesByDomain) window.__categoryTreesByDomain = {};
        if (!window.__categoryTreesByDomain[domainCatalogId]) {
            window.__categoryTreesByDomain[domainCatalogId] = buildCategorySeedTree(domainCatalogId);
        }
        const tree = window.__categoryTreesByDomain[domainCatalogId] || [];
        const options = [];
        for (const domain of tree) {
            for (const field of (domain.children || [])) {
                const label = `${domain.name} / ${field.name}`;
                options.push({
                    id: field.id,
                    name: field.name,
                    domainId: domain.id,
                    domainName: domain.name,
                    label,
                    searchText: `${domain.name} ${field.name} ${field.owner?.name || ''} ${field.owner?.userName || ''}`.toLowerCase()
                });
            }
        }
        return options;
    };

    const CategoryManagement = {
        name: 'CategoryManagement',
        props: ['node'],
        data() {
            const domainId = this.node && this.node.id;
            if (!window.__categoryTreesByDomain) window.__categoryTreesByDomain = {};
            if (!window.__categoryTreesByDomain[domainId]) {
                window.__categoryTreesByDomain[domainId] = buildCategorySeedTree(domainId);
            }
            return {
                categoryTree: window.__categoryTreesByDomain[domainId],
                showModal: false,
                modalMode: 'create-domain',
                createParentDomain: null,
                editingNode: null,
                modalForm: { name: '', owner: null },
                ownerSearchQuery: '',
                ownerSearchResults: [],
                dragPayload: null,
                dropTargetKey: null,
                mockUsers: [
                    { id: 'u_sqy', name: '邵秋旸', userName: 'shaoqiuyang', department: 'OD · 干部管理' },
                    { id: 'u_zxq', name: '郑晓庆', userName: 'zhengxiaoqing', department: 'OD · 人才发展' },
                    { id: 'u_st', name: '沈恬', userName: 'shentian', department: 'OD部门' },
                    { id: 'u_ty', name: '唐颖', userName: 'tangying', department: 'CB · 成本组' },
                    { id: 'u_zy', name: '郑悦', userName: 'zhengyue', department: 'CB · LTI运营' },
                    { id: 'u_cmh', name: '陈铭涵', userName: 'chenminghan', department: 'CB · 激励组' },
                    { id: 'u_gl', name: '龚力', userName: 'gongli', department: 'CB · 外包组' },
                    { id: 'u_zk', name: '张科', userName: 'zhangke', department: 'SF' },
                    { id: 'u_wb', name: '王贝', userName: 'wangbei', department: 'CB部门' },
                    { id: 'u_whx', name: '王宏轩', userName: 'wanghongxuan', department: 'HC' },
                    { id: 'u_jx', name: '金鑫', userName: 'jinxin', department: '生态用工' },
                    { id: 'u_zkai', name: '周恺', userName: 'zhoukai', department: '招聘运营' },
                    { id: 'u_dh', name: '杜昊', userName: 'duhao', department: 'C招聘' }
                ]
            };
        },
        computed: {
            isDomainModal() {
                return this.modalMode === 'create-domain' || this.modalMode === 'edit-domain';
            },
            modalTitle() {
                const map = {
                    'create-domain': '新增领域分类',
                    'create-field': '新增字段分类',
                    'edit-domain': '编辑领域分类',
                    'edit-field': '编辑字段分类'
                };
                return map[this.modalMode] || '分类';
            },
            modalKindLabel() {
                if (this.modalMode.includes('domain')) return '领域分类';
                if (this.modalMode.includes('field')) return '字段分类';
                return '';
            },
            canSubmitModal() {
                return !!(this.modalForm.name && this.modalForm.name.trim());
            }
        },
        watch: {
            node: {
                immediate: true,
                handler(n) {
                    if (!n) return;
                    if (!window.__categoryTreesByDomain) window.__categoryTreesByDomain = {};
                    if (!window.__categoryTreesByDomain[n.id]) {
                        window.__categoryTreesByDomain[n.id] = buildCategorySeedTree(n.id);
                    }
                    this.categoryTree = window.__categoryTreesByDomain[n.id];
                    this.closeModal();
                }
            }
        },
        methods: {
            persist() {
                if (this.node && this.node.id) {
                    window.__categoryTreesByDomain[this.node.id] = this.categoryTree;
                }
                if (typeof window.__bumpCategoryTreeTick === 'function') {
                    window.__bumpCategoryTreeTick();
                }
            },
            toggleDomain(id) {
                const d = this.categoryTree.find(x => x.id === id);
                if (d) d.isOpen = !d.isOpen;
            },
            parentDomainName(fieldNode) {
                if (!fieldNode) return '-';
                const d = this.categoryTree.find(dom => (dom.children || []).some(c => c.id === fieldNode.id));
                return d ? d.name : '-';
            },
            filterUsers(query) {
                const q = (query || '').trim().toLowerCase();
                if (!q) return [];
                return this.mockUsers.filter(u =>
                    u.name.toLowerCase().includes(q) ||
                    u.userName.toLowerCase().includes(q) ||
                    (u.department || '').toLowerCase().includes(q)
                ).slice(0, 8);
            },
            searchOwners() {
                this.ownerSearchResults = this.filterUsers(this.ownerSearchQuery);
            },
            selectOwner(u) {
                this.modalForm.owner = { ...u };
                this.ownerSearchQuery = '';
                this.ownerSearchResults = [];
            },
            clearOwner() {
                this.modalForm.owner = null;
            },
            resetModalForm() {
                this.modalForm = { name: '', owner: null };
                this.ownerSearchQuery = '';
                this.ownerSearchResults = [];
            },
            openCreateDomain() {
                this.modalMode = 'create-domain';
                this.createParentDomain = null;
                this.editingNode = null;
                this.resetModalForm();
                this.showModal = true;
            },
            openCreateField(domain) {
                this.modalMode = 'create-field';
                this.createParentDomain = domain;
                this.editingNode = null;
                this.resetModalForm();
                this.showModal = true;
            },
            openEdit(node) {
                this.modalMode = node.type === 'domain' ? 'edit-domain' : 'edit-field';
                this.editingNode = node;
                this.createParentDomain = null;
                this.modalForm = {
                    name: node.name || '',
                    owner: node.owner ? { ...node.owner } : null
                };
                this.ownerSearchQuery = '';
                this.ownerSearchResults = [];
                this.showModal = true;
            },
            closeModal() {
                this.showModal = false;
                this.editingNode = null;
                this.createParentDomain = null;
                this.resetModalForm();
            },
            confirmModal() {
                if (!this.canSubmitModal) return;
                if (this.modalMode === 'create-domain') {
                    this.categoryTree.push({
                        id: 'dom_' + Date.now(),
                        name: this.modalForm.name.trim(),
                        type: 'domain',
                        isOpen: true,
                        owner: this.modalForm.owner ? { ...this.modalForm.owner } : null,
                        children: []
                    });
                } else if (this.modalMode === 'create-field' && this.createParentDomain) {
                    if (!this.createParentDomain.children) this.createParentDomain.children = [];
                    this.createParentDomain.children.push({
                        id: 'fld_' + Date.now(),
                        name: this.modalForm.name.trim(),
                        type: 'field',
                        owner: this.modalForm.owner ? { ...this.modalForm.owner } : null
                    });
                    this.createParentDomain.isOpen = true;
                } else if (this.modalMode.startsWith('edit') && this.editingNode) {
                    this.editingNode.name = this.modalForm.name.trim();
                    this.editingNode.owner = this.modalForm.owner ? { ...this.modalForm.owner } : null;
                }
                this.persist();
                this.closeModal();
            },
            confirmDelete() {
                if (!this.editingNode) return;
                const node = this.editingNode;
                if (node.type === 'domain') {
                    const childCount = (node.children || []).length;
                    const msg = childCount
                        ? `确定删除领域「${node.name}」及其下 ${childCount} 个字段分类吗？`
                        : `确定删除领域「${node.name}」吗？`;
                    if (!confirm(msg)) return;
                    const idx = this.categoryTree.findIndex(d => d.id === node.id);
                    if (idx >= 0) this.categoryTree.splice(idx, 1);
                } else {
                    if (!confirm(`确定删除字段分类「${node.name}」吗？`)) return;
                    for (const d of this.categoryTree) {
                        const i = (d.children || []).findIndex(c => c.id === node.id);
                        if (i >= 0) {
                            d.children.splice(i, 1);
                            break;
                        }
                    }
                }
                this.persist();
                this.closeModal();
            },
            onDragStart(e, payload) {
                this.dragPayload = payload;
                try {
                    e.dataTransfer.setData('application/json', JSON.stringify(payload));
                    e.dataTransfer.effectAllowed = 'move';
                } catch (_) {}
            },
            onDragEnd() {
                this.dragPayload = null;
                this.dropTargetKey = null;
            },
            getPayload(e) {
                if (this.dragPayload) return this.dragPayload;
                try {
                    const raw = e.dataTransfer.getData('application/json');
                    return raw ? JSON.parse(raw) : null;
                } catch (_) {
                    return null;
                }
            },
            findFieldLocation(fieldId) {
                for (let di = 0; di < this.categoryTree.length; di++) {
                    const children = this.categoryTree[di].children || [];
                    const fi = children.findIndex(c => c.id === fieldId);
                    if (fi >= 0) return { domainIndex: di, fieldIndex: fi, domain: this.categoryTree[di] };
                }
                return null;
            },
            removeField(fieldId) {
                const loc = this.findFieldLocation(fieldId);
                if (!loc) return null;
                const [removed] = loc.domain.children.splice(loc.fieldIndex, 1);
                return removed;
            },
            onRootDragOver(e) {
                if (this.dragPayload && this.dragPayload.type === 'domain') {
                    this.dropTargetKey = 'root';
                    e.dataTransfer.dropEffect = 'move';
                }
            },
            onRootDrop(e) {
                const p = this.getPayload(e);
                if (!p || p.type !== 'domain') return;
                const from = this.categoryTree.findIndex(d => d.id === p.id);
                if (from < 0) return;
                const [item] = this.categoryTree.splice(from, 1);
                this.categoryTree.push(item);
                this.persist();
                this.dropTargetKey = null;
            },
            onDomainDragOver(e, domain) {
                if (!this.dragPayload) return;
                this.dropTargetKey = 'domain:' + domain.id;
                e.dataTransfer.dropEffect = 'move';
            },
            onDomainDrop(e, domain) {
                const p = this.getPayload(e);
                if (!p) return;
                if (p.type === 'domain') {
                    if (p.id === domain.id) return;
                    const from = this.categoryTree.findIndex(d => d.id === p.id);
                    if (from < 0) return;
                    const [item] = this.categoryTree.splice(from, 1);
                    const to = this.categoryTree.findIndex(d => d.id === domain.id);
                    this.categoryTree.splice(to, 0, item);
                    this.persist();
                } else if (p.type === 'field') {
                    const field = this.removeField(p.id);
                    if (!field) return;
                    if (!domain.children) domain.children = [];
                    domain.children.push(field);
                    domain.isOpen = true;
                    this.persist();
                }
                this.dropTargetKey = null;
            },
            onFieldDragOver(e, domain, field) {
                if (!this.dragPayload || this.dragPayload.type !== 'field') return;
                this.dropTargetKey = 'field:' + field.id;
                e.dataTransfer.dropEffect = 'move';
            },
            onFieldDrop(e, domain, field) {
                const p = this.getPayload(e);
                if (!p || p.type !== 'field' || p.id === field.id) return;
                const moved = this.removeField(p.id);
                if (!moved) return;
                const targetIdx = (domain.children || []).findIndex(c => c.id === field.id);
                const insertAt = targetIdx >= 0 ? targetIdx : (domain.children || []).length;
                if (!domain.children) domain.children = [];
                domain.children.splice(insertAt, 0, moved);
                domain.isOpen = true;
                this.persist();
                this.dropTargetKey = null;
            }
        },
        template: window.AppTemplates.CategoryManagement
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
                testConnectionMessage: '',
                // 权限点下拉相关状态
                wizardPermissionPointTree: [
                    { id: 'pp_base', name: '基础信息' },
                    { id: 'pp_org', name: '组织信息' },
                    { id: 'pp_hrbp', name: 'HRBP信息' },
                    { id: 'pp_report', name: '汇报关系' },
                    { id: 'pp_salary', name: '薪酬信息' },
                    { id: 'pp_leave', name: '考勤休假' },
                    { id: 'pp_perf', name: '绩效评估' },
                    { id: 'pp_recruit', name: '招聘信息' },
                    { id: 'pp_benefits', name: '福利待遇' }
                ],
                wizardPPSearchQuery: '',
                // VIEW方式权限点
                viewFieldPPDropdownIndex: null,
                viewFieldPPSearchQuery: '',
                showViewFieldNewPPInput: false,
                viewFieldNewPPName: '',
                // ONLINE方式权限点
                onlineFieldPPDropdownIndex: null,
                onlineFieldPPSearchQuery: '',
                showOnlineFieldNewPPInput: false,
                onlineFieldNewPPName: '',
                // EXCEL方式权限点
                excelFieldPPDropdownIndex: null,
                excelFieldPPSearchQuery: '',
                showExcelFieldNewPPInput: false,
                excelFieldNewPPName: ''
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
            },
            filteredWizardPermissionPointTree() {
                const query = this.wizardPPSearchQuery.trim().toLowerCase();
                if (!query) return this.wizardPermissionPointTree;
                return this.wizardPermissionPointTree.filter(node => node.name.toLowerCase().includes(query));
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
            // ─── 权限点相关方法（CreateWizard）──────────────────
            // VIEW方式
            toggleViewFieldPPDropdown(fIdx) {
                if (this.viewFieldPPDropdownIndex === fIdx) {
                    this.viewFieldPPDropdownIndex = null;
                    this.viewFieldPPSearchQuery = '';
                } else {
                    this.viewFieldPPDropdownIndex = fIdx;
                    this.viewFieldPPSearchQuery = '';
                    this.showViewFieldNewPPInput = false;
                    this.wizardPPSearchQuery = '';
                }
            },
            selectViewFieldPP(fIdx, name) {
                const fields = [...this.form.viewFields];
                fields[fIdx] = { ...fields[fIdx], permission_point: name };
                this.$emit('update:form', { ...this.form, viewFields: fields });
                this.viewFieldPPDropdownIndex = null;
                this.viewFieldPPSearchQuery = '';
            },
            clearViewFieldPP(fIdx) {
                const fields = [...this.form.viewFields];
                fields[fIdx] = { ...fields[fIdx], permission_point: null };
                this.$emit('update:form', { ...this.form, viewFields: fields });
                this.viewFieldPPDropdownIndex = null;
                this.viewFieldPPSearchQuery = '';
            },
            startViewFieldNewPP() {
                this.showViewFieldNewPPInput = true;
                this.viewFieldNewPPName = '';
            },
            confirmViewFieldNewPP(fIdx) {
                if (!this.viewFieldNewPPName.trim()) return;
                const newId = 'pp_' + Date.now();
                this.wizardPermissionPointTree.unshift({ id: newId, name: this.viewFieldNewPPName.trim() });
                const fields = [...this.form.viewFields];
                fields[fIdx] = { ...fields[fIdx], permission_point: this.viewFieldNewPPName.trim() };
                this.$emit('update:form', { ...this.form, viewFields: fields });
                this.showViewFieldNewPPInput = false;
                this.viewFieldNewPPName = '';
                this.viewFieldPPDropdownIndex = null;
                this.viewFieldPPSearchQuery = '';
            },
            cancelViewFieldNewPP() {
                this.showViewFieldNewPPInput = false;
                this.viewFieldNewPPName = '';
            },
            // ONLINE方式
            toggleOnlineFieldPPDropdown(fIdx) {
                if (this.onlineFieldPPDropdownIndex === fIdx) {
                    this.onlineFieldPPDropdownIndex = null;
                    this.onlineFieldPPSearchQuery = '';
                } else {
                    this.onlineFieldPPDropdownIndex = fIdx;
                    this.onlineFieldPPSearchQuery = '';
                    this.showOnlineFieldNewPPInput = false;
                    this.wizardPPSearchQuery = '';
                }
            },
            selectOnlineFieldPP(fIdx, name) {
                const fields = [...this.form.tableMetadata.fields];
                fields[fIdx] = { ...fields[fIdx], permission_point: name };
                this.$emit('update:form', {
                    ...this.form,
                    tableMetadata: { ...this.form.tableMetadata, fields: fields }
                });
                this.onlineFieldPPDropdownIndex = null;
                this.onlineFieldPPSearchQuery = '';
            },
            clearOnlineFieldPP(fIdx) {
                const fields = [...this.form.tableMetadata.fields];
                fields[fIdx] = { ...fields[fIdx], permission_point: null };
                this.$emit('update:form', {
                    ...this.form,
                    tableMetadata: { ...this.form.tableMetadata, fields: fields }
                });
                this.onlineFieldPPDropdownIndex = null;
                this.onlineFieldPPSearchQuery = '';
            },
            startOnlineFieldNewPP() {
                this.showOnlineFieldNewPPInput = true;
                this.onlineFieldNewPPName = '';
            },
            confirmOnlineFieldNewPP(fIdx) {
                if (!this.onlineFieldNewPPName.trim()) return;
                const newId = 'pp_' + Date.now();
                this.wizardPermissionPointTree.unshift({ id: newId, name: this.onlineFieldNewPPName.trim() });
                const fields = [...this.form.tableMetadata.fields];
                fields[fIdx] = { ...fields[fIdx], permission_point: this.onlineFieldNewPPName.trim() };
                this.$emit('update:form', {
                    ...this.form,
                    tableMetadata: { ...this.form.tableMetadata, fields: fields }
                });
                this.showOnlineFieldNewPPInput = false;
                this.onlineFieldNewPPName = '';
                this.onlineFieldPPDropdownIndex = null;
                this.onlineFieldPPSearchQuery = '';
            },
            cancelOnlineFieldNewPP() {
                this.showOnlineFieldNewPPInput = false;
                this.onlineFieldNewPPName = '';
            },
            // EXCEL方式
            toggleExcelFieldPPDropdown(idx) {
                if (this.excelFieldPPDropdownIndex === idx) {
                    this.excelFieldPPDropdownIndex = null;
                    this.excelFieldPPSearchQuery = '';
                } else {
                    this.excelFieldPPDropdownIndex = idx;
                    this.excelFieldPPSearchQuery = '';
                    this.showExcelFieldNewPPInput = false;
                    this.wizardPPSearchQuery = '';
                }
            },
            selectExcelFieldPP(idx, name) {
                const fields = [...this.form.excelFields];
                fields[idx] = { ...fields[idx], permission_point: name };
                this.$emit('update:form', { ...this.form, excelFields: fields });
                this.excelFieldPPDropdownIndex = null;
                this.excelFieldPPSearchQuery = '';
            },
            clearExcelFieldPP(idx) {
                const fields = [...this.form.excelFields];
                fields[idx] = { ...fields[idx], permission_point: null };
                this.$emit('update:form', { ...this.form, excelFields: fields });
                this.excelFieldPPDropdownIndex = null;
                this.excelFieldPPSearchQuery = '';
            },
            startExcelFieldNewPP() {
                this.showExcelFieldNewPPInput = true;
                this.excelFieldNewPPName = '';
            },
            confirmExcelFieldNewPP(idx) {
                if (!this.excelFieldNewPPName.trim()) return;
                const newId = 'pp_' + Date.now();
                this.wizardPermissionPointTree.unshift({ id: newId, name: this.excelFieldNewPPName.trim() });
                const fields = [...this.form.excelFields];
                fields[idx] = { ...fields[idx], permission_point: this.excelFieldNewPPName.trim() };
                this.$emit('update:form', { ...this.form, excelFields: fields });
                this.showExcelFieldNewPPInput = false;
                this.excelFieldNewPPName = '';
                this.excelFieldPPDropdownIndex = null;
                this.excelFieldPPSearchQuery = '';
            },
            cancelExcelFieldNewPP() {
                this.showExcelFieldNewPPInput = false;
                this.excelFieldNewPPName = '';
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
            const sidebarSearchQuery = ref(''); // Left sidebar: keyword search
            const sidebarTypeFilter = ref('ALL'); // Left sidebar: resource type filter
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


            // 子查询相关状态
            const showCreateSubqueryModal = ref(false);
            const subqueryForm = ref({ name: '', code: '', sql: '' });
            const subqueryValidation = ref(null);
            const subqueries = ref([
                { id: 'sq_active_users', name: '活跃用户列表', code: 'active_users', sql: 'SELECT user_id FROM user_stats WHERE last_login > DATE_SUB(NOW(), INTERVAL 30 DAY)' },
                { id: 'sq_hrbp_depts', name: 'HRBP管理部门', code: 'hrbp_managed', sql: 'SELECT department_id FROM hrbp_mapping WHERE hrbp_id = {user_id}' },
                { id: 'sq_sensitive_data', name: '敏感数据权限组', code: 'sensitive_access', sql: 'SELECT resource_id FROM permission_matrix WHERE user_id = {user_id} AND access_level >= 3' },
                { id: 'sq_team_members', name: '团队成员', code: 'team_members', sql: 'SELECT member_id FROM team WHERE leader_id = {user_id}' }
            ]);

            const openCreateSubqueryModal = (filterIndex) => {
                showCreateSubqueryModal.value = true;
                subqueryForm.value = { name: '', code: '', sql: '' };
                subqueryValidation.value = null;
            };

            const closeCreateSubqueryModal = () => {
                showCreateSubqueryModal.value = false;
            };

            const validateSubquerySql = () => {
                if (!subqueryForm.value.sql.trim()) {
                    subqueryValidation.value = { success: false, error: 'SQL 不能为空' };
                    return;
                }
                const isSuccess = Math.random() > 0.2;
                if (isSuccess) {
                    subqueryValidation.value = { success: true, message: '语法检查通过' };
                } else {
                    subqueryValidation.value = { success: false, error: '语法错误: 未知的表名 user_info' };
                }
            };

            const saveSubquery = () => {
                if (!subqueryForm.value.name || !subqueryForm.value.code) return;
                const newId = 'sq_' + Date.now();
                subqueries.value.push({
                    id: newId,
                    name: subqueryForm.value.name,
                    code: subqueryForm.value.code,
                    sql: subqueryForm.value.sql
                });
                showCreateSubqueryModal.value = false;
            };

            const toggleGlobalRuleSubqueryDropdown = (filterIndex) => {
                if (editingGlobalRule.value?.rowFilters?.[filterIndex]) {
                    editingGlobalRule.value.rowFilters[filterIndex].showSubqueryDropdown = !editingGlobalRule.value.rowFilters[filterIndex].showSubqueryDropdown;
                }
            };

            const updateGlobalRuleSubquerySearch = (filterIndex, query) => {
                if (editingGlobalRule.value?.rowFilters?.[filterIndex]) {
                    editingGlobalRule.value.rowFilters[filterIndex].subquerySearchQuery = query;
                }
            };

            const selectGlobalRuleSubquery = (filterIndex, subqueryId) => {
                if (editingGlobalRule.value?.rowFilters?.[filterIndex]) {
                    editingGlobalRule.value.rowFilters[filterIndex].value = subqueryId;
                    editingGlobalRule.value.rowFilters[filterIndex].showSubqueryDropdown = false;
                }
            };
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

            // 当前选中节点是否为二级业务域（root_all 的直接子文件夹）
            const isSecondaryDomainCatalog = computed(() => {
                const node = selectedNode.value;
                if (!node || node.type !== 'CATALOG' || node.id === 'root_all') return false;
                const root = catalogTree.value[0];
                return !!(root && root.children && root.children.some(c => c.id === node.id));
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
            const selectedValidityType = ref('permanent'); // 'permanent', '30d', '90d', '180d', 'custom'
            const validityStartDate = ref('');
            const validityEndDate = ref('');
            const computedExpiryDate = computed(() => {
                const now = new Date();
                let days = 0;
                if (selectedValidityType.value === '30d') days = 30;
                if (selectedValidityType.value === '90d') days = 90;
                if (selectedValidityType.value === '180d') days = 180;
                if (days > 0) {
                    const expiry = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
                    return expiry.toISOString().split('T')[0];
                }
                return '';
            });
            const currentPermissions = ref([
                { id: 1, name: 'Yuzhiyuan', email: 'yuzhiyuan@company.com', role: 'admin', avatar: 'YZ', validityType: 'permanent', expiryDate: null },
                { id: 2, name: 'HR Team', email: 'hr@company.com', role: 'editor', avatar: 'HR', validityType: 'custom', expiryDate: '2026-12-31' }
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
                    rowFilters: [
                        {
                            field: 'PII 个人信息/姓名',
                            operator: '=',
                            value: 'visiting_user.real_name',
                            valueType: 'env_var'
                        }
                    ],
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

            // ─── 访问控制页面子 Tab ───────────────────
            const rulesSubTab = ref('column_permission_points');

            // ─── 分类数据（平铺列表，支持系统分类和自定义分类分组）──────────────────────────────
            const classificationTree = ref([
                // 系统分类
                { id: 'cls_personal', name: '个人信息', isSystem: true },
                { id: 'cls_org', name: '组织信息', isSystem: true },
                { id: 'cls_hrbp', name: 'HRBP信息', isSystem: true },
                { id: 'cls_report', name: '汇报关系', isSystem: true },
                { id: 'cls_mgmt', name: '管理信息', isSystem: true },
                { id: 'cls_promo', name: '职级晋升', isSystem: true },
                { id: 'cls_perf', name: '绩效信息', isSystem: true },
                { id: 'cls_talent', name: '人才盘点', isSystem: true },
                { id: 'cls_compensation', name: '薪酬信息', isSystem: true },
                { id: 'cls_base_attr', name: '基础属性', isSystem: true },
                { id: 'cls_sens_attr', name: '敏感属性', isSystem: true },
                { id: 'cls_audit', name: '审计信息', isSystem: true },
                // 自定义分类
                { id: 'cls_custom_1', name: '考勤数据', isSystem: false },
                { id: 'cls_custom_2', name: '招聘信息', isSystem: false },
                { id: 'cls_custom_3', name: '培训记录', isSystem: false },
                { id: 'cls_custom_4', name: '合同管理', isSystem: false },
                { id: 'cls_custom_5', name: '社保公积金', isSystem: false }
            ]);

            // 字段分类选项：来自二级业务域「分类管理」树
            const categoryTreeTick = ref(0);
            window.__bumpCategoryTreeTick = () => { categoryTreeTick.value += 1; };
            const classificationOptions = computed(() => {
                categoryTreeTick.value;
                const cat = topLevelCatalog.value;
                if (!cat) return [];
                return getFieldCategoryOptions(cat.id);
            });

            // ─── 权限点数据（平铺列表）──────────────────────────────
            const permissionPointTree = ref([
                { id: 'pp_base', name: '基础信息', appliedFields: [
                    { id: 1, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'emp_id', fieldType: 'VARCHAR(20)', description: '员工编号', env: 'online', version: 'v2.1.0' },
                    { id: 2, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'emp_name', fieldType: 'VARCHAR(128)', description: '员工姓名', env: 'online', version: 'v2.1.0' },
                    { id: 3, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'username', fieldType: 'VARCHAR(64)', description: '用户名', env: 'online', version: 'v2.1.0' },
                    { id: 4, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'gender', fieldType: 'VARCHAR(10)', description: '性别', env: 'online', version: 'v2.1.0' },
                    { id: 5, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'phone', fieldType: 'VARCHAR(20)', description: '手机号', env: 'online', version: 'v2.1.0' },
                    { id: 6, assetName: '员工休假记录表', tableName: 'ks.emp.leave', fieldName: 'emp_id', fieldType: 'VARCHAR(20)', description: '员工编号', env: 'online', version: 'v1.0.0' },
                    { id: 7, assetName: '员工休假记录表', tableName: 'ks.emp.leave', fieldName: 'leave_type', fieldType: 'VARCHAR(30)', description: '休假类型', env: 'online', version: 'v1.0.0' }
                ]},
                { id: 'pp_org', name: '组织信息', appliedFields: [
                    { id: 1, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'dept_id', fieldType: 'VARCHAR(20)', description: '部门ID', env: 'online', version: 'v2.1.0' },
                    { id: 2, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'dept_name', fieldType: 'VARCHAR(128)', description: '部门名称', env: 'online', version: 'v2.1.0' },
                    { id: 3, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'dept_path', fieldType: 'VARCHAR(500)', description: '部门路径', env: 'online', version: 'v2.1.0' },
                    { id: 4, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'org_unit_id', fieldType: 'VARCHAR(20)', description: '组织单元ID', env: 'online', version: 'v2.1.0' },
                    { id: 5, assetName: '员工休假记录表', tableName: 'ks.emp.leave', fieldName: 'leave_days', fieldType: 'DECIMAL(5,2)', description: '休假天数', env: 'online', version: 'v1.0.0' }
                ]},
                { id: 'pp_hrbp', name: 'HRBP信息', appliedFields: [
                    { id: 1, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'hrbp_id', fieldType: 'VARCHAR(20)', description: 'HRBP编号', env: 'online', version: 'v2.1.0' },
                    { id: 2, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'hrbp_name', fieldType: 'VARCHAR(128)', description: 'HRBP姓名', env: 'online', version: 'v2.1.0' },
                    { id: 3, assetName: '员工休假记录表', tableName: 'ks.emp.leave', fieldName: 'hrbp_approve_id', fieldType: 'VARCHAR(20)', description: 'HRBP审批人ID', env: 'online', version: 'v1.0.0' }
                ]},
                { id: 'pp_report', name: '汇报关系', appliedFields: [
                    { id: 1, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'report_to_id', fieldType: 'VARCHAR(20)', description: '汇报上级ID', env: 'online', version: 'v2.1.0' },
                    { id: 2, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'report_to_name', fieldType: 'VARCHAR(128)', description: '汇报上级姓名', env: 'online', version: 'v2.1.0' },
                    { id: 3, assetName: '员工休假记录表', tableName: 'ks.emp.leave', fieldName: 'approve_id', fieldType: 'VARCHAR(20)', description: '审批人ID', env: 'online', version: 'v1.0.0' }
                ]},
                { id: 'pp_mgmt_base', name: '管理信息-基础', appliedFields: [
                    { id: 1, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'mgmt_id', fieldType: 'VARCHAR(20)', description: '管理ID', env: 'online', version: 'v2.1.0' },
                    { id: 2, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'team_size', fieldType: 'INT', description: '团队规模', env: 'online', version: 'v2.1.0' },
                    { id: 3, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'authority_level', fieldType: 'VARCHAR(30)', description: '权限等级', env: 'online', version: 'v2.1.0' },
                    { id: 4, assetName: '管理信息表', tableName: 'ks.management.info', fieldName: 'team_size', fieldType: 'INT', description: '团队规模', env: 'online', version: 'v1.0.0' }
                ]},
                { id: 'pp_promo_base', name: '职级晋升-基础', appliedFields: [
                    { id: 1, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'current_level', fieldType: 'VARCHAR(20)', description: '当前职级', env: 'online', version: 'v2.1.0' },
                    { id: 2, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'current_level_name', fieldType: 'VARCHAR(128)', description: '当前职级名称', env: 'online', version: 'v2.1.0' },
                    { id: 3, assetName: '晋升记录表', tableName: 'ks.promotion.record', fieldName: 'old_level', fieldType: 'VARCHAR(20)', description: '旧职级', env: 'online', version: 'v1.0.0' },
                    { id: 4, assetName: '晋升记录表', tableName: 'ks.promotion.record', fieldName: 'new_level', fieldType: 'VARCHAR(20)', description: '新职级', env: 'online', version: 'v1.0.0' }
                ]},
                { id: 'pp_promo_sensitive', name: '职级晋升-敏感', appliedFields: [
                    { id: 1, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'promotion_status', fieldType: 'VARCHAR(30)', description: '晋升状态', env: 'online', version: 'v2.1.0' },
                    { id: 2, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'promotion_score', fieldType: 'DECIMAL(5,2)', description: '晋升评分', env: 'online', version: 'v2.1.0' },
                    { id: 3, assetName: '晋升记录表', tableName: 'ks.promotion.record', fieldName: 'promotion_score', fieldType: 'DECIMAL(5,2)', description: '晋升评分', env: 'online', version: 'v1.0.0' },
                    { id: 4, assetName: '晋升记录表', tableName: 'ks.promotion.record', fieldName: 'salary_adjust_ratio', fieldType: 'DECIMAL(5,4)', description: '薪酬调整比例', env: 'online', version: 'v1.0.0' }
                ]},
                { id: 'pp_perf', name: '绩效信息', appliedFields: [
                    { id: 1, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'perf_year', fieldType: 'INT', description: '绩效年份', env: 'online', version: 'v2.1.0' },
                    { id: 2, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'perf_score', fieldType: 'DECIMAL(5,2)', description: '绩效评分', env: 'online', version: 'v2.1.0' },
                    { id: 3, assetName: '绩效评估表', tableName: 'ks.performance.review', fieldName: 'score', fieldType: 'DECIMAL(5,2)', description: '绩效评分', env: 'online', version: 'v1.0.0' },
                    { id: 4, assetName: '绩效评估表', tableName: 'ks.performance.review', fieldName: 'level', fieldType: 'VARCHAR(10)', description: '绩效等级', env: 'online', version: 'v1.0.0' }
                ]},
                { id: 'pp_talent', name: '人才盘点', appliedFields: [
                    { id: 1, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'talent_category', fieldType: 'VARCHAR(30)', description: '人才类别', env: 'online', version: 'v2.1.0' },
                    { id: 2, assetName: '员工基础信息表', tableName: 'ks.emp.base', fieldName: 'talent_potential', fieldType: 'VARCHAR(20)', description: '人才潜力等级', env: 'online', version: 'v2.1.0' },
                    { id: 3, assetName: '绩效评估表', tableName: 'ks.performance.review', fieldName: 'potential_level', fieldType: 'VARCHAR(20)', description: '潜力等级', env: 'online', version: 'v1.0.0' }
                ]}
            ]);
            const columnPermissionRules = ref([
                {
                    id: 'cpr_1',
                    name: 'OD-基础',
                    description: '除HR外，E13及以下OD工作所需的员工和组织基础字段，适用于OD已入职稳定工作的普通正式员工',
                    enabled: true,
                    targetEnv: 'online',
                    tableFields: {
                        'tbl_1': ['emp_id', 'emp_name', 'username', 'emp_nature', 'emp_type', 'emp_nature_group', 'gender', 'birth_date', 'education', 'phone', 'email', 'dept_id', 'dept_name', 'dept_path', 'position', 'hire_type', 'emp_status', 'contract_type', 'contract_start', 'contract_end', 'cost_center', 'work_city', 'work_location'],
                        'tbl_2': ['leave_id', 'emp_id', 'leave_type', 'leave_days', 'start_date', 'end_date', 'approve_status']
                    },
                    tableFieldScope: {
                        'tbl_1': 'dynamic'
                    },
                    appliedTables: [
                        { id: 1, name: 'ks.emp.base', env: 'online' },
                        { id: 2, name: 'ks.emp.leave', env: 'online' },
                        { id: 3, name: 'ks.emp.base', env: 'pre' }
                    ]
                },
                {
                    id: 'cpr_2',
                    name: 'OD-敏感-职级晋升-低职级',
                    description: '包含职级晋升相关的敏感字段，适用于低职级OD员工的晋升审批流程',
                    enabled: true,
                    targetEnv: 'online',
                    tableFields: {
                        'tbl_1': ['emp_id', 'emp_name', 'current_level', 'current_level_name', 'level_type', 'level_category', 'next_level', 'next_level_name'],
                        'tbl_4': ['record_id', 'emp_id', 'old_level', 'new_level', 'promotion_date', 'promotion_score', 'promotion_reason', 'salary_adjust_ratio']
                    },
                    appliedTables: [
                        { id: 4, name: 'ks.emp.base', env: 'online' },
                        { id: 5, name: 'ks.promotion.record', env: 'online' }
                    ]
                },
                {
                    id: 'cpr_3',
                    name: 'OD-敏感-绩效信息-低职级',
                    description: '包含绩效评估相关的敏感字段，适用于低职级OD员工的绩效查看',
                    enabled: false,
                    targetEnv: 'pre',
                    tableFields: {
                        'tbl_1': ['emp_id', 'emp_name', 'dept_id', 'dept_name', 'current_level'],
                        'tbl_3': ['review_id', 'emp_id', 'review_period', 'score', 'level', 'comment', 'self_score', 'perf_rank', 'perf_rank_in_dept']
                    },
                    appliedTables: [
                        { id: 6, name: 'ks.emp.base', env: 'online' },
                        { id: 7, name: 'ks.performance.review', env: 'online' }
                    ]
                },
                {
                    id: 'cpr_4',
                    name: 'OD-敏感-管理信息-低职级',
                    description: '包含管理信息相关的敏感字段，适用于低职级OD员工的管理信息查看',
                    enabled: true,
                    targetEnv: 'online',
                    tableFields: {
                        'tbl_1': ['emp_id', 'emp_name', 'dept_id'],
                        'tbl_5': ['mgmt_id', 'emp_id', 'team_size', 'authority_level', 'direct_reports', 'approval_limit', 'span_of_control', 'budget']
                    },
                    tableFieldScope: {
                        'tbl_5': 'static'
                    },
                    appliedTables: [
                        { id: 8, name: 'ks.emp.base', env: 'online' },
                        { id: 9, name: 'ks.management.info', env: 'online' }
                    ]
                }
            ]);
            const selectedColumnRule = ref(null);
            const showColumnRuleModal = ref(false);
            const editingColumnRule = ref(null);
            const editingColumnRuleIndex = ref(null);
            // 新增权限资源点弹窗
            const showAddResourcePointModal = ref(false);
            const addingResourcePoints = ref([]);
            // 权限点树内新增/重命名状态（资源点弹窗用）
            const showNewParentInput = ref(false);
            const newParentName = ref('');
            const newChildName = ref('');
            const addingChildToParentId = ref(null);
            const renamingNodeId = ref(null);
            const renamingNodeName = ref('');
            const renamingNodeType = ref(''); // 'parent' or 'child'
            // 列权限规则弹窗内：表+字段选择状态
            const availableTablesForColumnPermission = ref((() => {
                // permissionPoint -> category 映射
                const ppToCategory = { '基础信息': '个人信息', '组织信息': '组织信息', 'HRBP信息': 'HRBP信息', '汇报关系': '汇报关系', '管理信息-基础': '管理信息', '职级晋升-基础': '职级晋升', '职级晋升-敏感': '职级晋升', '绩效信息': '绩效信息', '人才盘点': '人才盘点' };
                // 常用字段中文名映射
                const cnMap = { 'emp_id':'员工编号','emp_name':'员工姓名','username':'用户名','emp_nature':'员工性质','emp_type':'员工类型','emp_nature_group':'员工性质分组','gender':'性别','birth_date':'出生日期','nation':'民族','political_status':'政治面貌','marital_status':'婚姻状况','education':'学历','graduation_school':'毕业院校','major':'专业','phone':'手机号','email':'邮箱','id_card_type':'证件类型','id_card_no':'证件号码','address':'地址','city':'城市','province':'省份','country':'国家','zip_code':'邮编','emergency_contact':'紧急联系人','emergency_phone':'紧急联系电话','avatar_url':'头像URL','photo_url':'照片URL','entry_channel':'入职渠道','recruit_source':'招聘来源','is_intern':'是否实习生','intern_end_date':'实习结束日期','contract_type':'合同类型','contract_start':'合同开始日期','contract_end':'合同结束日期','contract_periods':'合同期限','probation_start':'试用期开始','probation_end':'试用期结束','probation_months':'试用月数','is_probation_passed':'是否通过试用期','social_security_no':'社保号','tax_id':'税号','bank_name':'银行名称','bank_account':'银行账号','salary_account':'薪资账户','cost_center':'成本中心','hire_type':'入职类型','rehire_flag':'是否重新入职','work_city':'工作城市','work_location':'工作地点','seat_no':'座位号','emp_status':'员工状态','status_change_date':'状态变更日期','leave_type':'离职类型','leave_date':'离职日期','leave_reason':'离职原因','create_time':'创建时间','update_time':'更新时间','dept_id':'部门编号','dept_name':'部门名称','dept_path':'部门路径','dept_level':'部门层级','dept_type':'部门类型','dept_head_id':'部门负责人ID','dept_head_name':'部门负责人','parent_dept_id':'上级部门ID','parent_dept_name':'上级部门名称','org_unit_id':'组织单元ID','org_unit_name':'组织单元名称','org_unit_code':'组织单元编码','business_line':'业务线','business_line_name':'业务线名称','sub_business_line':'子业务线','cost_center_id':'成本中心ID','cost_center_name':'成本中心名称','profit_center':'利润中心','profit_center_name':'利润中心名称','company_id':'公司ID','company_name':'公司名称','company_code':'公司编码','legal_entity':'法人实体','legal_entity_name':'法人实体名称','region_id':'区域ID','region_name':'区域名称','zone_id':'大区ID','zone_name':'大区名称','branch_id':'分公司ID','branch_name':'分公司名称','team_id':'团队ID','team_name':'团队名称','team_code':'团队编码','group_id':'组ID','group_name':'组名称','section_id':'科室ID','section_name':'科室名称','unit_id':'单元ID','unit_name':'单元名称','hrbp_id':'HRBP编号','hrbp_name':'HRBP姓名','hrbp_email':'HRBP邮箱','hrbp_phone':'HRBP电话','hrbp_level':'HRBP职级','hrbp_dept_id':'HRBP部门ID','hrbp_dept_name':'HRBP部门名称','report_to_id':'直属上级ID','report_to_name':'直属上级姓名','report_to_level':'直属上级职级','mgmt_id':'管理ID','mgmt_type':'管理类型','mgmt_level':'管理层级','team_size':'团队规模','direct_reports':'直接下属数','indirect_reports':'间接下属数','total_reports':'下属总数','budget':'预算','authority_level':'权限等级','approval_limit':'审批额度','span_of_control':'管理幅度','current_level':'当前职级','current_level_name':'当前职级名称','level_type':'职级类型','level_category':'职级类别','next_level':'下一职级','next_level_name':'下一职级名称','promotion_date':'晋升日期','promotion_score':'晋升评分','promotion_reason':'晋升原因','salary_adjust_ratio':'薪资调整比例','old_level':'原职级','new_level':'新职级','review_id':'评估ID','review_period':'评估周期','score':'评分','level':'等级','comment':'评论','self_score':'自评分数','perf_year':'绩效年份','perf_score':'绩效评分','perf_level':'绩效等级','perf_rank':'绩效排名','talent_category':'人才类别','talent_potential':'人才潜力','leave_id':'休假ID','leave_days':'休假天数','start_date':'开始日期','end_date':'结束日期','approve_status':'审批状态','approve_id':'审批人ID','cancel_flag':'取消标志','half_day_flag':'半天标志','substitute_id':'代班人ID','hrbp_approve_id':'HRBP审批人ID','hrbp_approve_date':'HRBP审批日期','hrbp_comment':'HRBP评论','record_id':'记录ID','calibrator_id':'校准人ID','calibrator_score':'校准评分','potential_level':'潜力等级','flight_risk':'流失风险','promotion_flag':'晋升标志','report_to':'汇报对象','hrbp_scope':'HRBP范围','hrbp_scope_type':'HRBP范围类型','hrbp_start_date':'HRBP开始日期','hrbp_end_date':'HRBP结束日期','hrbp_is_active':'HRBP是否有效','hrbp_backup_id':'HRBP备份ID','hrbp_backup_name':'HRBP备份姓名','hrbp_score':'HRBP评分','hrbp_eval_date':'HRBP评估日期','hrbp_cert_level':'HRBP认证级别','hrbp_service_year':'HRBP服务年限','hrbp_load_ratio':'HRBP负载率','hrbp_case_count':'HRBP案例数','hrbp_satisfaction_rate':'HRBP满意度','hrbp_response_time':'HRBP响应时间','hrbp_region':'HRBP区域','hrbp_team_size':'HRBP团队规模','hrbp_mentor_id':'HRBP导师ID','hrbp_mentor_name':'HRBP导师姓名','hrbp_train_hours':'HRBP培训时长','hrbp_special_flag':'HRBP特殊标志','hrbp_category':'HRBP分类','promotion_eligible_date':'晋升资格日期','promotion_eligible_flag':'晋升资格标志','promotion_apply_date':'晋升申请日期','promotion_apply_flag':'晋升申请标志','promotion_plan_date':'晋升计划日期','promotion_plan_type':'晋升计划类型','promotion_track':'晋升通道','promotion_track_name':'晋升通道名称','promotion_path':'晋升路径','promotion_path_type':'晋升路径类型','level_seq':'职级序列','level_seq_no':'职级序号','level_tier':'职级层级','level_tier_name':'职级层级名称','level_band':'职级段','level_band_name':'职级段名称','level_family':'职级族','level_family_name':'职级族名称','level_sub_family':'职级子族','level_sub_family_name':'职级子族名称','level_is_terminal':'是否终级','level_ref_code':'职级参考编码','level_min_salary':'职级最低薪资','level_max_salary':'职级最高薪资','level_mid_salary':'职级中位薪资','level_tenure_require':'职级年限要求','level_perf_require':'职级绩效要求','level_competency':'职级能力要求','level_cert_require':'职级证书要求','promotion_status':'晋升状态','promotion_result':'晋升结果','promotion_score_detail':'晋升评分详情','promotion_reviewer_id':'晋升评审人ID','promotion_reviewer_name':'晋升评审人姓名','promotion_review_date':'晋升评审日期','promotion_review_comment':'晋升评审意见','promotion_committee_score':'晋升委员会评分','promotion_committee_comment':'晋升委员会意见','promotion_final_score':'晋升最终评分','promotion_rank':'晋升排名','promotion_rank_in_dept':'部门内晋升排名','promotion_evidence':'晋升证据','promotion_appeal_flag':'晋升申诉标志','promotion_appeal_result':'晋升申诉结果','promotion_appeal_date':'晋升申诉日期','level_change_type':'职级变更类型','level_change_reason':'职级变更原因','salary_adjust_flag':'薪资调整标志','salary_adjust_amount':'薪资调整金额','stock_adjust_flag':'股票调整标志','stock_adjust_amount':'股票调整金额','bonus_adjust_flag':'奖金调整标志','bonus_adjust_ratio':'奖金调整比例','competency_eval_score':'能力评估评分','competency_eval_level':'能力评估等级','competency_eval_date':'能力评估日期','competency_gap':'能力差距','sensitive_flag':'敏感标志','sensitive_level':'敏感等级','data_mask_flag':'数据脱敏标志','mask_rule_id':'脱敏规则ID','audit_log_id':'审计日志ID','perf_quarter':'绩效季度','perf_period':'绩效期间','perf_cycle':'绩效周期','perf_type':'绩效类型','perf_grade':'绩效等级','perf_rank_in_dept':'部门内绩效排名','perf_percentile':'绩效百分位','perf_target_score':'绩效目标分数','perf_actual_score':'绩效实际分数','perf_gap':'绩效差距','perf_completion_rate':'绩效完成率','perf_kpi_score':'绩效KPI分数','perf_kpi_detail':'绩效KPI详情','perf_behavior_score':'行为评分','perf_behavior_detail':'行为评分详情','perf_competency_score':'能力评分','perf_competency_detail':'能力评分详情','perf_potential_score':'潜力评分','perf_potential_level':'潜力等级','perf_overall_comment':'总体评价','perf_self_eval_score':'自评分数','perf_self_eval_comment':'自评意见','perf_manager_score':'主管评分','perf_manager_comment':'主管意见','perf_360_score':'360评分','perf_360_detail':'360评分详情','perf_calibrator_id':'校准人ID','perf_calibrator_name':'校准人姓名','perf_calibrator_score':'校准评分','perf_calibrator_comment':'校准意见','perf_review_id':'评估ID','perf_review_status':'评估状态','perf_appeal_flag':'申诉标志','perf_appeal_result':'申诉结果','perf_bonus_flag':'奖金标志','perf_bonus_amount':'奖金金额','perf_salary_adjust_flag':'薪资调整标志','perf_salary_adjust_ratio':'薪资调整比例','perf_promotion_flag':'晋升标志','perf_improvement_plan':'改进计划','perf_training_plan':'培训计划','perf_mentor_assign':'导师分配','perf_next_goal':'下一目标','perf_is_final':'是否终评','perf_sign_date':'签署日期','talent_review_year':'盘点年份','talent_review_cycle':'盘点周期','talent_review_type':'盘点类型','talent_category_name':'人才类别名称','talent_potential_level':'潜力等级','talent_performance':'人才绩效','talent_performance_level':'人才绩效等级','talent_ready_now':'即刻就绪','talent_ready_1yr':'1年内就绪','talent_ready_3yr':'3年内就绪','talent_flight_risk':'流失风险','talent_flight_risk_level':'流失风险等级','talent_retention_strategy':'保留策略','talent_key_strength':'核心优势','talent_key_strength_detail':'核心优势详情','talent_key_gap':'关键差距','talent_key_gap_detail':'关键差距详情','talent_development_plan':'发展计划','talent_development_action':'发展行动','talent_career_path':'职业路径','talent_career_target':'职业目标','talent_rotation_plan':'轮岗计划','talent_rotation_target':'轮岗目标','talent_successor_of':'继任于','talent_successor_for':'继任者','talent_successor_ready':'继任就绪','talent_backup_of':'备份于','talent_backup_for':'备份者','talent_critical_flag':'关键人才标志','talent_critical_level':'关键等级','talent_special_track':'特殊通道','talent_special_track_name':'特殊通道名称','talent_tier':'人才层级','talent_tier_name':'人才层级名称','talent_band':'人才段','talent_band_name':'人才段名称','talent_pool':'人才池','talent_pool_name':'人才池名称','talent_reviewer_id':'盘点人ID','talent_reviewer_name':'盘点人姓名','talent_review_score':'盘点评分','talent_review_comment':'盘点意见','talent_is_high_potential':'是否高潜力','talent_is_key_person':'是否关键人','talent_replace_cost':'替换成本','talent_impact_scope':'影响范围','talent_urgency_level':'紧急程度','talent_strategy_tag':'战略标签','talent_develop_priority':'发展优先级','review_comment':'评审意见' };
                // 字段描述映射（部分关键字段）
                const descMap = { 'emp_id':'员工唯一标识','emp_name':'员工真实姓名','username':'系统登录名','gender':'员工性别','phone':'手机号码','email':'公司邮箱','dept_id':'所属部门编号','dept_name':'所属部门名称','position':'岗位名称','hire_type':'入职方式','emp_status':'在职状态','current_level':'当前职级','score':'绩效评分','level':'绩效等级','promotion_date':'晋升生效日期','team_size':'管理团队人数','budget':'部门预算金额','leave_days':'请假天数','approve_status':'审批状态' };
                // 辅助：为字段对象添加 category/chineseName/description/classification/sensitivityClass
                const enrichField = (f) => {
                    if (typeof f === 'object' && f.name) {
                        const cls = ppToCategory[f.permissionPoint];
                        f.category = cls || null;
                        const systemCls = [];
                        if (cls) systemCls.push(cls);
                        if (['emp_name','phone','email','id_card_no','salary_account','bank_account','id_card_type','social_security_no','tax_id','bank_name','address','emergency_contact','emergency_phone','avatar_url','photo_url'].includes(f.name)) systemCls.push('敏感属性');
                        if (['emp_id','emp_name','username','gender','birth_date','nation','political_status','marital_status','education','dept_id','dept_name','phone','email','emp_status','hire_type','emp_type','emp_nature','work_city','work_location'].includes(f.name)) systemCls.push('基础属性');
                        if (['create_time','update_time','is_deleted','version','data_source','load_date','etl_batch_id','partition_date','sync_flag','op_type','diff_type','biz_date','source_system','source_table','source_field','quality_score','quality_flag','dq_check_date','dq_error_count','dq_error_type','audit_id','audit_action','audit_user','audit_date','audit_comment','row_count','col_count','md5_hash','schema_version','ddl_version','is_encrypted','encrypt_key_id','decrypt_flag','mask_type','mask_rule_id','retention_days','expire_date','archive_flag','archive_date','replication_flag','replication_source','snapshot_date','snapshot_version','change_type','change_date','change_user','change_reason','validation_status','validation_date','validation_error','reconciliation_flag','reconciliation_date','reconciliation_diff','is_active','effective_date','expire_flag'].includes(f.name)) systemCls.push('审计信息');
                        if (['salary_account','bank_account','bank_name','cost_center','cost_center_id','cost_center_name','profit_center','profit_center_name','budget','salary_adjust_ratio','salary_adjust_flag','salary_adjust_amount','stock_adjust_flag','stock_adjust_amount','bonus_adjust_flag','bonus_adjust_ratio','perf_bonus_flag','perf_bonus_amount','perf_salary_adjust_flag','perf_salary_adjust_ratio','level_min_salary','level_max_salary','level_mid_salary'].includes(f.name)) systemCls.push('薪酬信息');
                        f.classification = [...new Set(systemCls)];
                        f.chineseName = cnMap[f.name] || '';
                        f.description = descMap[f.name] || '';
                        // sensitivityClass: C1/C2/C3/C4 based on permissionPoint / field name
                        const sc = (() => {
                            const pp = f.permissionPoint;
                            const n = f.name;
                            // C4 极高敏：薪酬/晋升敏感/银行账户/证件号等
                            if (pp === '职级晋升-敏感' || ['salary_account','bank_account','id_card_no','social_security_no','tax_id','perf_bonus_amount','salary_adjust_amount','stock_adjust_amount','level_min_salary','level_max_salary','level_mid_salary','perf_score','perf_level','perf_grade','perf_rank','promotion_score','promotion_result','promotion_rank','flight_risk','talent_flight_risk','talent_replace_cost'].includes(n)) return 'C4';
                            // C3 高敏：绩效/人才盘点/手机/邮箱/汇报链
                            if (['绩效信息','人才盘点'].includes(pp) || ['phone','email','report_to_id','report_to_name','perf_kpi_detail','perf_behavior_detail','perf_360_score','talent_category','talent_potential','talent_strategy_tag','talent_is_key_person','talent_is_high_potential'].includes(n)) return 'C3';
                            // C2 敏感：HRBP/管理/汇报关系/职级基础
                            if (['HRBP信息','汇报关系','管理信息-基础','职级晋升-基础'].includes(pp) || ['emp_name','hrbp_name','hrbp_email','hrbp_phone','mgmt_level','budget','approval_limit','span_of_control','team_size','report_to_level','authority_level'].includes(n)) return 'C2';
                            // C1 公开：基础标识/组织/审计字段
                            return 'C1';
                        })();
                        f.sensitivityClass = sc;
                    }
                    return f;
                };
                const pp = ['基础信息', '组织信息', 'HRBP信息', '汇报关系', '管理信息-基础', '职级晋升-基础', '职级晋升-敏感', '绩效信息', '人才盘点'];
                const fieldDefs = [
                    ...['emp_id','emp_name','username','emp_nature','emp_type','emp_nature_group','gender','birth_date','nation','political_status','marital_status','education','graduation_school','major','phone','email','id_card_type','id_card_no','address','city','province','country','zip_code','emergency_contact','emergency_phone','avatar_url','photo_url','entry_channel','recruit_source','is_intern','intern_end_date','contract_type','contract_start','contract_end','contract_periods','probation_start','probation_end','probation_months','is_probation_passed','social_security_no','tax_id','bank_name','bank_account','salary_account','cost_center','hire_type','rehire_flag','work_city','work_location','seat_no','emp_status','status_change_date','leave_type','leave_date','leave_reason','create_time','update_time'].map(f => ({ name: f, permissionPoint: '基础信息' })),
                    ...['dept_id','dept_name','dept_path','dept_level','dept_type','dept_head_id','dept_head_name','parent_dept_id','parent_dept_name','org_unit_id','org_unit_name','org_unit_code','business_line','business_line_name','sub_business_line','cost_center_id','cost_center_name','profit_center','profit_center_name','company_id','company_name','company_code','legal_entity','legal_entity_name','region_id','region_name','zone_id','zone_name','branch_id','branch_name','team_id','team_name','team_code','group_id','group_name','section_id','section_name','unit_id','unit_name','factory_id','factory_name','floor_id','floor_name','office_id','office_name','building_id','building_name','campus_id','campus_name'].map(f => ({ name: f, permissionPoint: '组织信息' })),
                    ...['hrbp_id','hrbp_name','hrbp_email','hrbp_phone','hrbp_level','hrbp_dept_id','hrbp_dept_name','hrbp_scope','hrbp_scope_type','hrbp_start_date','hrbp_end_date','hrbp_is_active','hrbp_backup_id','hrbp_backup_name','hrbp_score','hrbp_eval_date','hrbp_cert_level','hrbp_service_year','hrbp_load_ratio','hrbp_case_count','hrbp_satisfaction_rate','hrbp_response_time','hrbp_region','hrbp_team_size','hrbp_mentor_id','hrbp_mentor_name','hrbp_train_hours','hrbp_special_flag','hrbp_category'].map(f => ({ name: f, permissionPoint: 'HRBP信息' })),
                    ...['report_to_id','report_to_name','report_to_level','report_to_dept','report_to_position','report_to_type','report_line_id','report_line_name','second_report_id','second_report_name','third_report_id','third_report_name','skip_report_id','skip_report_name','matrix_report_id','matrix_report_name','matrix_report_type','matrix_report_dept','functional_report_id','functional_report_name','report_depth','report_chain','is_top_manager','is_skip_level','delegate_report_id','delegate_report_name','delegate_start','delegate_end','temp_report_id','temp_report_name'].map(f => ({ name: f, permissionPoint: '汇报关系' })),
                    ...['mgmt_id','mgmt_type','mgmt_level','mgmt_scope','mgmt_scope_type','mgmt_start_date','mgmt_end_date','mgmt_is_active','team_size','direct_reports','indirect_reports','total_reports','budget','budget_year','budget_type','authority_level','decision_scope','approval_limit','approval_type','mgmt_style','mgmt_score','mgmt_eval_date','mgmt_cert_flag','is_key_manager','mgmt_delegated_flag','mgmt_delegated_to','mgmt_backup','mgmt_backup_name','span_of_control','mgmt_tenure','mgmt_training_hours','mgmt_rotation_count','mgmt_project_count','mgmt_kpi_score','mgmt_bonus_pool'].map(f => ({ name: f, permissionPoint: '管理信息-基础' })),
                    ...['current_level','current_level_name','level_type','level_category','level_grade','level_score','level_entry_date','level_adjust_date','next_level','next_level_name','promotion_eligible_date','promotion_eligible_flag','promotion_apply_date','promotion_apply_flag','promotion_plan_date','promotion_plan_type','promotion_track','promotion_track_name','promotion_path','promotion_path_type','level_seq','level_seq_no','level_tier','level_tier_name','level_band','level_band_name','level_family','level_family_name','level_sub_family','level_sub_family_name','level_is_terminal','level_ref_code','level_min_salary','level_max_salary','level_mid_salary','level_tenure_require','level_perf_require','level_competency','level_cert_require'].map(f => ({ name: f, permissionPoint: '职级晋升-基础' })),
                    ...['promotion_status','promotion_result','promotion_score','promotion_score_detail','promotion_reviewer_id','promotion_reviewer_name','promotion_review_date','promotion_review_comment','promotion_committee_score','promotion_committee_comment','promotion_final_score','promotion_rank','promotion_rank_in_dept','promotion_reason','promotion_evidence','promotion_appeal_flag','promotion_appeal_result','promotion_appeal_date','old_level','old_level_name','new_level','new_level_name','level_change_type','level_change_reason','salary_adjust_flag','salary_adjust_ratio','salary_adjust_amount','stock_adjust_flag','stock_adjust_amount','bonus_adjust_flag','bonus_adjust_ratio','competency_eval_score','competency_eval_level','competency_eval_date','competency_gap','sensitive_flag','sensitive_level','data_mask_flag','mask_rule_id','audit_log_id'].map(f => ({ name: f, permissionPoint: '职级晋升-敏感' })),
                    ...['perf_year','perf_quarter','perf_period','perf_cycle','perf_type','perf_score','perf_level','perf_grade','perf_rank','perf_rank_in_dept','perf_percentile','perf_target_score','perf_actual_score','perf_gap','perf_completion_rate','perf_kpi_score','perf_kpi_detail','perf_behavior_score','perf_behavior_detail','perf_competency_score','perf_competency_detail','perf_potential_score','perf_potential_level','perf_overall_comment','perf_self_eval_score','perf_self_eval_comment','perf_manager_score','perf_manager_comment','perf_360_score','perf_360_detail','perf_calibrator_id','perf_calibrator_name','perf_calibrator_score','perf_calibrator_comment','perf_review_id','perf_review_status','perf_appeal_flag','perf_appeal_result','perf_bonus_flag','perf_bonus_amount','perf_salary_adjust_flag','perf_salary_adjust_ratio','perf_promotion_flag','perf_improvement_plan','perf_training_plan','perf_mentor_assign','perf_next_goal','perf_is_final','perf_sign_date'].map(f => ({ name: f, permissionPoint: '绩效信息' })),
                    ...['talent_review_year','talent_review_cycle','talent_review_type','talent_category','talent_category_name','talent_potential','talent_potential_level','talent_performance','talent_performance_level','talent_ready_now','talent_ready_1yr','talent_ready_3yr','talent_flight_risk','talent_flight_risk_level','talent_retention_strategy','talent_key_strength','talent_key_strength_detail','talent_key_gap','talent_key_gap_detail','talent_development_plan','talent_development_action','talent_career_path','talent_career_target','talent_rotation_plan','talent_rotation_target','talent_successor_of','talent_successor_for','talent_successor_ready','talent_backup_of','talent_backup_for','talent_critical_flag','talent_critical_level','talent_special_track','talent_special_track_name','talent_tier','talent_tier_name','talent_band','talent_band_name','talent_pool','talent_pool_name','talent_reviewer_id','talent_reviewer_name','talent_review_score','talent_review_comment','talent_is_high_potential','talent_is_key_person','talent_replace_cost','talent_impact_scope','talent_urgency_level','talent_strategy_tag','talent_develop_priority'].map(f => ({ name: f, permissionPoint: '人才盘点' }))
                ];
                const extraFields = ['id','create_time','update_time','is_deleted','version','data_source','load_date','etl_batch_id','partition_date','sync_flag','op_type','diff_type','biz_date','source_system','source_table','source_field','quality_score','quality_flag','dq_check_date','dq_error_count','dq_error_type','audit_id','audit_action','audit_user','audit_date','audit_comment','row_count','col_count','md5_hash','schema_version','ddl_version','is_encrypted','encrypt_key_id','decrypt_flag','mask_type','mask_rule_id','retention_days','expire_date','archive_flag','archive_date','replication_flag','replication_source','snapshot_date','snapshot_version','change_type','change_date','change_user','change_reason','validation_status','validation_date','validation_error','reconciliation_flag','reconciliation_date','reconciliation_diff','is_active','effective_date','expire_flag','data_owner','data_steward','data_custodian','lineage_id','lineage_source','lineage_path','comment','remark','note','description','metadata_version','catalog_id','catalog_path','project_id','project_name','env_tag','env_name','app_id','app_name','service_id','service_name','api_id','api_name','workflow_id','workflow_name','task_id','task_name','job_id','job_name','run_id','run_date','run_status','run_duration','run_error','log_id','log_date','log_level','log_message','trace_id','span_id','parent_span_id','operation_name','operation_type','operation_duration','operation_status','operation_error','request_id','request_date','response_code','response_time','retry_count','retry_flag','timeout_flag','callback_id','callback_date','callback_status','callback_result','event_id','event_type','event_date','event_source','event_target','event_data','event_status','queue_id','queue_name','queue_depth','queue_status','topic_id','topic_name','topic_partition','topic_offset','consumer_group','consumer_id','consumer_status','producer_id','producer_status','message_id','message_key','message_value','message_size','message_date','message_retry','message_error','is_test','test_id','test_name','test_env','test_date','test_result','test_error','bench_id','bench_name','bench_type','bench_score','bench_detail','bench_date','bench_version','bench_env','bench_status','bench_error','bench_duration','bench_metric','bench_threshold','bench_passed','bench_failed','bench_total','bench_ratio','bench_trend','bench_baseline','bench_comment','bench_note','bench_description'].map(f => enrichField({ name: f, permissionPoint: null }));
                const allFields = [...fieldDefs.map(enrichField), ...extraFields];
                return [
                    { id: 'tbl_1', name: 'ks.emp.base', chineseName: '员工基础信息表', catalogPath: '公共资源库/人力资源', fields: [
                        enrichField({ name: 'emp_id', permissionPoint: '基础信息' }),
                        enrichField({ name: 'emp_name', permissionPoint: '基础信息' }),
                        enrichField({ name: 'username', permissionPoint: '基础信息' }),
                        enrichField({ name: 'gender', permissionPoint: '基础信息' }),
                        enrichField({ name: 'phone', permissionPoint: '基础信息' }),
                        enrichField({ name: 'email', permissionPoint: '基础信息' }),
                        enrichField({ name: 'id_card_no', permissionPoint: '基础信息' }),
                        enrichField({ name: 'salary_account', permissionPoint: '基础信息' }),
                        enrichField({ name: 'bank_account', permissionPoint: '基础信息' }),
                        enrichField({ name: 'dept_id', permissionPoint: '组织信息' }),
                        enrichField({ name: 'dept_name', permissionPoint: '组织信息' }),
                        enrichField({ name: 'business_line', permissionPoint: '组织信息' }),
                        enrichField({ name: 'hrbp_id', permissionPoint: 'HRBP信息' }),
                        enrichField({ name: 'hrbp_name', permissionPoint: 'HRBP信息' }),
                        enrichField({ name: 'report_to_id', permissionPoint: '汇报关系' }),
                        enrichField({ name: 'report_to_name', permissionPoint: '汇报关系' }),
                        enrichField({ name: 'current_level', permissionPoint: '职级晋升-基础' }),
                        enrichField({ name: 'emp_status', permissionPoint: '基础信息' }),
                        enrichField({ name: 'create_time', permissionPoint: null }),
                        enrichField({ name: 'update_time', permissionPoint: null }),
                    ]},
                    { id: 'tbl_2', name: 'ks.emp.leave', chineseName: '员工休假记录表', catalogPath: '公共资源库/人力资源', fields: [
                        enrichField({ name: 'leave_id', permissionPoint: null }),
                        enrichField({ name: 'emp_id', permissionPoint: '基础信息' }),
                        enrichField({ name: 'leave_type', permissionPoint: '基础信息' }),
                        enrichField({ name: 'start_date', permissionPoint: '基础信息' }),
                        enrichField({ name: 'end_date', permissionPoint: '基础信息' }),
                        enrichField({ name: 'leave_days', permissionPoint: '组织信息' }),
                        enrichField({ name: 'approve_status', permissionPoint: '汇报关系' }),
                        enrichField({ name: 'approve_id', permissionPoint: '汇报关系' }),
                        enrichField({ name: 'hrbp_approve_id', permissionPoint: 'HRBP信息' }),
                        enrichField({ name: 'create_time', permissionPoint: null }),
                        enrichField({ name: 'update_time', permissionPoint: null }),
                    ]},
                    { id: 'tbl_3', name: 'ks.performance.review', chineseName: '绩效评估表', catalogPath: '公共资源库/人力资源/绩效', fields: [
                        enrichField({ name: 'review_id', permissionPoint: '绩效信息' }),
                        enrichField({ name: 'emp_id', permissionPoint: '基础信息' }),
                        enrichField({ name: 'perf_year', permissionPoint: '绩效信息' }),
                        enrichField({ name: 'perf_score', permissionPoint: '绩效信息' }),
                        enrichField({ name: 'perf_level', permissionPoint: '绩效信息' }),
                        enrichField({ name: 'perf_rank', permissionPoint: '绩效信息' }),
                        enrichField({ name: 'perf_kpi_detail', permissionPoint: '绩效信息' }),
                        enrichField({ name: 'perf_manager_score', permissionPoint: '绩效信息' }),
                        enrichField({ name: 'perf_bonus_amount', permissionPoint: '绩效信息' }),
                        enrichField({ name: 'dept_id', permissionPoint: '组织信息' }),
                        enrichField({ name: 'create_time', permissionPoint: null }),
                    ]},
                    { id: 'tbl_4', name: 'ks.promotion.record', chineseName: '晋升记录表', catalogPath: '公共资源库/人力资源/晋升', fields: [
                        enrichField({ name: 'record_id', permissionPoint: '职级晋升-基础' }),
                        enrichField({ name: 'emp_id', permissionPoint: '基础信息' }),
                        enrichField({ name: 'old_level', permissionPoint: '职级晋升-基础' }),
                        enrichField({ name: 'new_level', permissionPoint: '职级晋升-基础' }),
                        enrichField({ name: 'promotion_date', permissionPoint: '职级晋升-基础' }),
                        enrichField({ name: 'promotion_score', permissionPoint: '职级晋升-敏感' }),
                        enrichField({ name: 'promotion_result', permissionPoint: '职级晋升-敏感' }),
                        enrichField({ name: 'salary_adjust_amount', permissionPoint: '职级晋升-敏感' }),
                        enrichField({ name: 'report_to_id', permissionPoint: '汇报关系' }),
                        enrichField({ name: 'create_time', permissionPoint: null }),
                    ]},
                    { id: 'tbl_5', name: 'ks.management.info', chineseName: '管理信息表', catalogPath: '公共资源库/人力资源/管理', fields: [
                        enrichField({ name: 'mgmt_id', permissionPoint: '管理信息-基础' }),
                        enrichField({ name: 'emp_id', permissionPoint: '基础信息' }),
                        enrichField({ name: 'team_size', permissionPoint: '管理信息-基础' }),
                        enrichField({ name: 'budget', permissionPoint: '管理信息-基础' }),
                        enrichField({ name: 'authority_level', permissionPoint: '管理信息-基础' }),
                        enrichField({ name: 'approval_limit', permissionPoint: '管理信息-基础' }),
                        enrichField({ name: 'direct_reports', permissionPoint: '管理信息-基础' }),
                        enrichField({ name: 'hrbp_name', permissionPoint: 'HRBP信息' }),
                        enrichField({ name: 'dept_id', permissionPoint: '组织信息' }),
                        enrichField({ name: 'create_time', permissionPoint: null }),
                    ]},
                    { id: 'tbl_6', name: 'ks.talent.review', chineseName: '人才盘点表', catalogPath: '公共资源库/人力资源/人才', fields: [
                        enrichField({ name: 'emp_id', permissionPoint: '基础信息' }),
                        enrichField({ name: 'talent_review_year', permissionPoint: '人才盘点' }),
                        enrichField({ name: 'talent_category', permissionPoint: '人才盘点' }),
                        enrichField({ name: 'talent_potential', permissionPoint: '人才盘点' }),
                        enrichField({ name: 'talent_is_high_potential', permissionPoint: '人才盘点' }),
                        enrichField({ name: 'talent_is_key_person', permissionPoint: '人才盘点' }),
                        enrichField({ name: 'talent_flight_risk', permissionPoint: '人才盘点' }),
                        enrichField({ name: 'talent_replace_cost', permissionPoint: '人才盘点' }),
                        enrichField({ name: 'talent_strategy_tag', permissionPoint: '人才盘点' }),
                        enrichField({ name: 'dept_id', permissionPoint: '组织信息' }),
                        enrichField({ name: 'create_time', permissionPoint: null }),
                    ]},
                    { id: 'tbl_7', name: 'ks.hrbp.scope', chineseName: 'HRBP负责范围表', catalogPath: '公共资源库/人力资源/HRBP', fields: [
                        enrichField({ name: 'hrbp_id', permissionPoint: 'HRBP信息' }),
                        enrichField({ name: 'hrbp_name', permissionPoint: 'HRBP信息' }),
                        enrichField({ name: 'hrbp_email', permissionPoint: 'HRBP信息' }),
                        enrichField({ name: 'hrbp_scope', permissionPoint: 'HRBP信息' }),
                        enrichField({ name: 'hrbp_load_ratio', permissionPoint: 'HRBP信息' }),
                        enrichField({ name: 'hrbp_satisfaction_rate', permissionPoint: 'HRBP信息' }),
                        enrichField({ name: 'dept_id', permissionPoint: '组织信息' }),
                        enrichField({ name: 'create_time', permissionPoint: null }),
                    ]},
                ];
            })());
            // 批量新增弹窗状态
            const showBatchImportModal = ref(false);
            const showBatchImportView = ref(false); // 在当前弹窗内切换到批量导入视图
            const batchImportSource = ref(''); // 'resourcePointModal' or 'columnRuleModal'
            const batchImportFile = ref(null);
            const batchImportPreview = ref([]);
            // 规则名称/描述编辑状态
            const editingRuleName = ref(false);
            const editingRuleNameValue = ref('');
            const editingRuleDescription = ref(false);
            const editingRuleDescriptionValue = ref('');

            // 更新表字段弹窗状态
            const showAddTableFieldModal = ref(false);
            const addTableFieldSearchQuery = ref('');
            const addFieldSelectedFields = ref({}); // { tableId: [fieldName, ...] }
            const addTableFieldViewMode = ref('by_permission_point'); // 'by_table' or 'by_permission_point'
            const expandedTablesForAddField = ref([]); // 按表浏览时哪些表展开（用数组代替 Set 保证响应式）
            const expandedPPsForAddField = ref(['基础信息']); // 按权限点浏览时哪些权限点展开

            // 打开更新表字段弹窗（带已有字段预选）
            const openAddTableFieldModalWithExisting = () => {
                showAddTableFieldModal.value = true;
                addTableFieldSearchQuery.value = '';
                addTableFieldViewMode.value = 'by_permission_point';
                // 将当前规则的已有字段预选到弹窗中
                if (selectedColumnRule.value && selectedColumnRule.value.tableFields) {
                    const existing = {};
                    for (const tableId of Object.keys(selectedColumnRule.value.tableFields)) {
                        existing[tableId] = [...selectedColumnRule.value.tableFields[tableId]];
                    }
                    addFieldSelectedFields.value = existing;
                } else {
                    addFieldSelectedFields.value = {};
                }
            };

            // 列权限规则：新建/编辑
            const openColumnRuleEdit = (index) => {
                editingColumnRuleIndex.value = index;
                if (index === -1) {
                    editingColumnRule.value = {
                        id: 'cpr_' + Date.now(),
                        name: '',
                        sensitivityLevel: '',
                        description: '',
                        enabled: true,
                        tableFields: {},
                        tableFieldScope: {},
                        appliedTables: []
                    };
                    expandedTablesForColRule.value = [];
                } else {
                    editingColumnRule.value = JSON.parse(JSON.stringify(columnPermissionRules.value[index]));
                    // 自动展开有已选字段的表
                    const expanded = [];
                    if (editingColumnRule.value.tableFields) {
                        for (const tableId of Object.keys(editingColumnRule.value.tableFields)) {
                            if (editingColumnRule.value.tableFields[tableId].length > 0) {
                                expanded.push(tableId);
                            }
                        }
                    }
                    expandedTablesForColRule.value = expanded;
                }
                colRuleFilterSearch.value = '';
                colRuleTableFilters.value = [];
                colRuleFieldFilters.value = [];
                colRuleGlobalCategoryFilters.value = [];
                colRuleShowSelected.value = false;
                colRuleResourceType.value = 'all';
                colRuleFieldSearchQueries.value = {};
                colRuleTableSearch.value = '';
                colRuleTableSelectOpen.value = false;
                colRuleFieldGroupMode.value = 'classification';
                if (!colRuleSelectedTableId.value || !editingColumnRule.value.tableFields[colRuleSelectedTableId.value]) {
                    colRuleSelectedTableId.value = Object.keys(editingColumnRule.value.tableFields || {})[0] || null;
                }
                showColumnRuleModal.value = true;
            };
            const closeColumnRuleEdit = () => {
                showColumnRuleModal.value = false;
                showBatchImportView.value = false;
                editingColumnRule.value = null;
                editingColumnRuleIndex.value = null;
            };
            const saveColumnRule = () => {
                if (!editingColumnRule.value.name.trim()) {
                    alert('列权限名称为必填项');
                    return;
                }
                if (!editingColumnRule.value.sensitivityLevel) {
                    alert('敏感等级为必填项');
                    return;
                }
                if (editingColumnRuleIndex.value === -1) {
                    columnPermissionRules.value.push(JSON.parse(JSON.stringify(editingColumnRule.value)));
                    selectedColumnRule.value = columnPermissionRules.value[columnPermissionRules.value.length - 1];
                } else {
                    columnPermissionRules.value[editingColumnRuleIndex.value] = JSON.parse(JSON.stringify(editingColumnRule.value));
                    selectedColumnRule.value = columnPermissionRules.value[editingColumnRuleIndex.value];
                }
                closeColumnRuleEdit();
            };
            const deleteColumnRule = (index) => {
                if (confirm('确定要删除这条列权限规则吗？')) {
                    if (selectedColumnRule.value && selectedColumnRule.value.id === columnPermissionRules.value[index].id) {
                        selectedColumnRule.value = null;
                    }
                    columnPermissionRules.value.splice(index, 1);
                }
                closeColumnRuleEdit();
            };
            // 列权限规则：直接删除（不弹窗）
            const deleteColumnRuleDirect = (index) => {
                if (confirm('确定要删除这条列权限规则吗？')) {
                    columnPermissionRules.value.splice(index, 1);
                }
            };
            // 列权限规则：切换启用状态
            const toggleColumnRuleEnabled = (rule) => {
                rule.enabled = !rule.enabled;
            };
            // 列权限规则：获取表字段预览列表（用于规则列表展示）
            const getColRuleTableFieldPreview = (rule) => {
                const result = [];
                if (rule.tableFields) {
                    for (const tableId of Object.keys(rule.tableFields)) {
                        const table = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                        const fieldNames = rule.tableFields[tableId];
                        if (table && fieldNames && fieldNames.length > 0) {
                            result.push({
                                tableId: tableId,
                                tableName: table.name,
                                tableChineseName: table.chineseName,
                                fieldCount: fieldNames.length,
                                totalFieldCount: table.fields.length
                            });
                        }
                    }
                }
                return result;
            };
            // 列权限规则：获取权限点名称列表（保留向后兼容）
            const getColRulePermissionPointNames = (rule) => {                const pps = new Set();
                if (rule.tableFields) {
                    for (const tableId of Object.keys(rule.tableFields)) {
                        const table = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                        if (table) {
                            for (const fName of rule.tableFields[tableId]) {
                                const fieldObj = table.fields.find(f => (typeof f === 'object' ? f.name : f) === fName);
                                if (fieldObj && typeof fieldObj === 'object' && fieldObj.permissionPoint) {
                                    pps.add(fieldObj.permissionPoint);
                                }
                            }
                        }
                    }
                }
                return Array.from(pps);
            };
            // 列权限规则：应用表hover弹窗状态
            const showColRuleAppliedTables = ref(null);
            // 新增权限资源点弹窗
            const openAddResourcePointModal = () => {
                if (!selectedColumnRule.value) return;
                addingResourcePoints.value = [...(selectedColumnRule.value.resourcePoints || [])];
                showAddResourcePointModal.value = true;
            };
            const closeAddResourcePointModal = () => {
                showAddResourcePointModal.value = false;
                showBatchImportView.value = false;
                addingResourcePoints.value = [];
            };
            const saveAddedResourcePoints = () => {
                if (!selectedColumnRule.value) return;
                selectedColumnRule.value.resourcePoints = [...addingResourcePoints.value];
                closeAddResourcePointModal();
            };
            // 权限点树内：新增父级（资源点弹窗）
            const showAddParentInput = () => {
                showNewParentInput.value = true;
                newParentName.value = '';
            };
            const addPermissionPointParent = () => {
                if (!newParentName.value.trim()) return;
                const newId = 'pp_' + Date.now();
                permissionPointTree.value.unshift({
                    id: newId,
                    name: newParentName.value.trim(),
                    expanded: true,
                    children: []
                });
                showNewParentInput.value = false;
                newParentName.value = '';
            };
            const cancelAddParent = () => {
                showNewParentInput.value = false;
                newParentName.value = '';
            };
            // 权限点树内：新增子级
            const addChildToParent = (parentId) => {
                addingChildToParentId.value = parentId;
                newChildName.value = '';
            };
            const confirmAddChild = () => {
                if (!newChildName.value.trim() || !addingChildToParentId.value) return;
                const parent = permissionPointTree.value.find(p => p.id === addingChildToParentId.value);
                if (parent) {
                    const newChildId = addingChildToParentId.value + '_' + Date.now();
                    parent.children.unshift({
                        id: newChildId,
                        name: newChildName.value.trim(),
                        parentId: addingChildToParentId.value,
                        appliedFields: []
                    });
                    parent.expanded = true;
                }
                addingChildToParentId.value = null;
                newChildName.value = '';
            };
            const cancelAddChild = () => {
                addingChildToParentId.value = null;
                newChildName.value = '';
            };
            // 权限点树内：重命名
            const startRenameNode = (nodeId, currentName, nodeType) => {
                renamingNodeId.value = nodeId;
                renamingNodeName.value = currentName;
                renamingNodeType.value = nodeType;
            };
            const confirmRenameNode = () => {
                if (!renamingNodeName.value.trim() || !renamingNodeId.value) return;
                const newName = renamingNodeName.value.trim();
                // Find the node in permissionPointTree
                for (const parent of permissionPointTree.value) {
                    if (parent.id === renamingNodeId.value) {
                        const oldName = parent.name;
                        parent.name = newName;
                        // Update any addingResourcePoints that reference the old parent name
                        addingResourcePoints.value = addingResourcePoints.value.map(p => {
                            if (p.startsWith(oldName + '/')) return newName + '/' + p.substring(oldName.length + 1);
                            if (p === oldName) return newName;
                            return p;
                        });
                        break;
                    }
                    if (parent.children) {
                        for (const child of parent.children) {
                            if (child.id === renamingNodeId.value) {
                                const oldChildName = child.name;
                                child.name = newName;
                                // Update any addingResourcePoints that reference the old child name
                                addingResourcePoints.value = addingResourcePoints.value.map(p => {
                                    if (p === parent.name + '/' + oldChildName) return parent.name + '/' + newName;
                                    return p;
                                });
                                break;
                            }
                        }
                    }
                }
                renamingNodeId.value = null;
                renamingNodeName.value = '';
                renamingNodeType.value = '';
            };
            const cancelRenameNode = () => {
                renamingNodeId.value = null;
                renamingNodeName.value = '';
                renamingNodeType.value = '';
            };
            // 权限点树内：删除节点
            const deletePermissionPointNode = (nodeId, nodeType) => {
                if (nodeType === 'parent') {
                    const idx = permissionPointTree.value.findIndex(p => p.id === nodeId);
                    if (idx > -1) {
                        const parent = permissionPointTree.value[idx];
                        // Remove all child paths from addingResourcePoints
                        if (parent.children) {
                            for (const child of parent.children) {
                                const path = parent.name + '/' + child.name;
                                const pidx = addingResourcePoints.value.indexOf(path);
                                if (pidx > -1) addingResourcePoints.value.splice(pidx, 1);
                            }
                        }
                        // Remove parent itself from addingResourcePoints
                        const pidx = addingResourcePoints.value.indexOf(parent.name);
                        if (pidx > -1) addingResourcePoints.value.splice(pidx, 1);
                        permissionPointTree.value.splice(idx, 1);
                    }
                } else {
                    for (const parent of permissionPointTree.value) {
                        if (parent.children) {
                            const idx = parent.children.findIndex(c => c.id === nodeId);
                            if (idx > -1) {
                                const child = parent.children[idx];
                                const path = parent.name + '/' + child.name;
                                const pidx = addingResourcePoints.value.indexOf(path);
                                if (pidx > -1) addingResourcePoints.value.splice(pidx, 1);
                                parent.children.splice(idx, 1);
                                break;
                            }
                        }
                    }
                }
                // 更新 scope 标记（权限点全选可能导致整表全选）
                _refreshTableFieldScopes();
            };
            // 规则名称/描述编辑
            const startEditRuleName = () => {
                if (!selectedColumnRule.value) return;
                editingRuleNameValue.value = selectedColumnRule.value.name;
                editingRuleName.value = true;
            };
            const confirmEditRuleName = () => {
                if (!editingRuleNameValue.value.trim() || !selectedColumnRule.value) return;
                selectedColumnRule.value.name = editingRuleNameValue.value.trim();
                editingRuleName.value = false;
                editingRuleNameValue.value = '';
            };
            const cancelEditRuleName = () => {
                editingRuleName.value = false;
                editingRuleNameValue.value = '';
            };
            const startEditRuleDescription = () => {
                if (!selectedColumnRule.value) return;
                editingRuleDescriptionValue.value = selectedColumnRule.value.description || '';
                editingRuleDescription.value = true;
            };
            const confirmEditRuleDescription = () => {
                if (!selectedColumnRule.value) return;
                selectedColumnRule.value.description = editingRuleDescriptionValue.value.trim();
                editingRuleDescription.value = false;
                editingRuleDescriptionValue.value = '';
            };
            const cancelEditRuleDescription = () => {
                editingRuleDescription.value = false;
                editingRuleDescriptionValue.value = '';
            };
            // ─── 列权限规则弹窗内的表+字段选择 ─────────────────
            const colRuleSelectedTableId = ref(null);
            const colRuleViewMode = ref('by_table');
            const colRuleShowCategory = ref(false); // 展示字段分类
            const colRuleShowSelected = ref(false); // 只看已选
            const colRuleGlobalCategoryFilters = ref([]); // 全局分类过滤条件 [category1, category2, ...]
            const colRuleTableFilters = ref([]); // 全局表名过滤条件 [tableName1, ...]
            const colRuleFieldFilters = ref([]); // 全局字段名过滤条件 [fieldName1, ...]
            const colRuleFilterSearch = ref(''); // 筛选输入框的搜索词
            const colRuleFilterSearchFocused = ref(false); // 筛选输入框是否聚焦
            const colRuleResourceType = ref('all'); // 资源类型过滤：all=全部, table=表, field=字段, category=分类
            const colRuleResourceTypeDropdownOpen = ref(false); // 资源类型下拉框是否展开
            const expandedTablesForColRule = ref([]); // 新建列权限规则-按表浏览展开状态
            const colRuleFieldSearchQueries = ref({}); // 每个表的字段搜索关键词 { tableId: 'searchQuery' }
            const expandedPPsForColRule = ref(['基础信息']); // 新建列权限规则-按权限点浏览展开状态
            const colRuleTableSearch = ref('');
            const colRuleTableSelectOpen = ref(false);
            const colRuleFieldGroupMode = ref('classification');
            const sensitivityLevelOrder = ['C1', 'C2', 'C3', 'C4'];
            const sortFieldObjects = (fields) => {
                return [...fields].sort((a, b) => {
                    const aName = (a.chineseName || a.name || '').toLowerCase();
                    const bName = (b.chineseName || b.name || '').toLowerCase();
                    return aName.localeCompare(bName, 'zh-Hans-CN-u-co-pinyin') || (a.name || '').localeCompare((b.name || ''), 'en');
                });
            };
            const getSortedFieldsForTable = (tableId) => {
                const table = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                if (!table) return [];
                return sortFieldObjects(table.fields.map(f => typeof f === 'object' ? f : { name: f, chineseName: '', permissionPoint: null, classification: [], sensitivityClass: null }));
            };
            const selectedTableIdsForColRule = computed(() => {
                if (!editingColumnRule.value || !editingColumnRule.value.tableFields) return [];
                return Object.keys(editingColumnRule.value.tableFields);
            });
            const selectedTablesForColRule = computed(() => {
                return selectedTableIdsForColRule.value
                    .map(tableId => availableTablesForColumnPermission.value.find(t => t.id === tableId))
                    .filter(Boolean);
            });
            const colRuleFilteredTableOptions = computed(() => {
                const query = colRuleTableSearch.value.trim().toLowerCase();
                return availableTablesForColumnPermission.value.filter(table => {
                    if (!query) return true;
                    return (table.name || '').toLowerCase().includes(query)
                        || (table.chineseName || '').toLowerCase().includes(query)
                        || (table.catalogPath || '').toLowerCase().includes(query);
                });
            });
            const ensureColRuleTableSelected = (tableId) => {
                if (!editingColumnRule.value.tableFields) editingColumnRule.value.tableFields = {};
                if (!editingColumnRule.value.tableFields[tableId]) editingColumnRule.value.tableFields[tableId] = [];
                if (!expandedTablesForColRule.value.includes(tableId)) expandedTablesForColRule.value.push(tableId);
            };
            const selectTableForColRule = (tableId) => {
                ensureColRuleTableSelected(tableId);
                colRuleSelectedTableId.value = tableId;
                colRuleTableSelectOpen.value = false;
                colRuleTableSearch.value = '';
            };
            const removeSelectedTableForColRule = (tableId) => {
                if (!editingColumnRule.value || !editingColumnRule.value.tableFields) return;
                delete editingColumnRule.value.tableFields[tableId];
                if (editingColumnRule.value.tableFieldScope) delete editingColumnRule.value.tableFieldScope[tableId];
                expandedTablesForColRule.value = expandedTablesForColRule.value.filter(id => id !== tableId);
                delete colRuleFieldSearchQueries.value[tableId];
                if (colRuleSelectedTableId.value === tableId) {
                    colRuleSelectedTableId.value = selectedTableIdsForColRule.value[0] || null;
                }
            };
            const getColRuleFieldGroups = (tableId) => {
                const fields = getSortedFieldsForTable(tableId);
                const query = (colRuleFieldSearchQueries.value[tableId] || '').trim().toLowerCase();
                const filtered = fields.filter(field => {
                    if (!query) return true;
                    return (field.chineseName || '').toLowerCase().includes(query) || (field.name || '').toLowerCase().includes(query);
                });
                const groups = new Map();
                if (colRuleFieldGroupMode.value === 'classification') {
                    filtered.forEach(field => {
                        const key = field.sensitivityClass || '未分类';
                        if (!groups.has(key)) groups.set(key, []);
                        groups.get(key).push(field);
                    });
                    return Array.from(groups.entries())
                        .sort((a, b) => {
                            const ai = sensitivityLevelOrder.indexOf(a[0]);
                            const bi = sensitivityLevelOrder.indexOf(b[0]);
                            if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
                            return a[0].localeCompare(b[0]);
                        })
                        .map(([name, fields]) => ({ key: name, name, fields: sortFieldObjects(fields), type: 'classification' }));
                }
                filtered.forEach(field => {
                    const key = field.permissionPoint || '未分类';
                    if (!groups.has(key)) groups.set(key, []);
                    groups.get(key).push(field);
                });
                return Array.from(groups.entries())
                    .sort((a, b) => a[0].localeCompare(b[0], 'zh-Hans-CN-u-co-pinyin'))
                    .map(([name, fields]) => ({ key: name, name, fields: sortFieldObjects(fields), type: 'permissionPoint' }));
            };
            const isColRuleGroupFullyChecked = (tableId, groupName) => {
                const selected = editingColumnRule.value?.tableFields?.[tableId] || [];
                const group = getColRuleFieldGroups(tableId).find(g => g.name === groupName);
                if (!group || group.fields.length === 0) return false;
                return group.fields.every(f => selected.includes(f.name));
            };
            const isColRuleGroupIndeterminate = (tableId, groupName) => {
                const selected = editingColumnRule.value?.tableFields?.[tableId] || [];
                const group = getColRuleFieldGroups(tableId).find(g => g.name === groupName);
                if (!group || group.fields.length === 0) return false;
                const checked = group.fields.filter(f => selected.includes(f.name)).length;
                return checked > 0 && checked < group.fields.length;
            };
            const toggleColRuleGroupSelection = (tableId, groupName) => {
                ensureColRuleTableSelected(tableId);
                const selected = editingColumnRule.value.tableFields[tableId];
                const group = getColRuleFieldGroups(tableId).find(g => g.name === groupName);
                if (!group) return;
                if (isColRuleGroupFullyChecked(tableId, groupName)) {
                    group.fields.forEach(field => {
                        const idx = selected.indexOf(field.name);
                        if (idx > -1) selected.splice(idx, 1);
                    });
                } else {
                    group.fields.forEach(field => {
                        if (!selected.includes(field.name)) selected.push(field.name);
                    });
                }
            };
            // 列权限规则：获取所有表涉及的所有分类（去重）
            const getAllCategories = () => {
                const cats = new Set();
                for (const table of availableTablesForColumnPermission.value) {
                    for (const field of table.fields) {
                        const fObj = typeof field === 'object' ? field : { name: field, category: null };
                        if (fObj.category) cats.add(fObj.category);
                    }
                }
                return Array.from(cats).sort();
            };
            // 列权限规则：获取某张表涉及的所有分类
            const getCategoriesForTable = (tableId) => {
                const table = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                if (!table) return [];
                const cats = new Set();
                for (const field of table.fields) {
                    const fObj = typeof field === 'object' ? field : { name: field, category: null };
                    if (fObj.category) cats.add(fObj.category);
                }
                return Array.from(cats).sort();
            };
            // 列权限规则：获取筛选下拉选项（组合：表名、字段名、分类，受资源类型选择影响）
            const getFilterDropdownOptions = () => {
                const search = colRuleFilterSearch.value.trim().toLowerCase();
                if (!search) return [];
                const resourceType = colRuleResourceType.value; // all, table, field, category
                const results = [];
                // 匹配的表
                if (resourceType === 'all' || resourceType === 'table') {
                    for (const table of availableTablesForColumnPermission.value) {
                        if (table.name.toLowerCase().includes(search) || table.chineseName.toLowerCase().includes(search)) {
                            results.push({ type: 'table', label: table.name, sublabel: table.chineseName, value: table.name });
                        }
                    }
                }
                // 匹配的字段（去重）
                if (resourceType === 'all' || resourceType === 'field') {
                    const fieldNames = new Set();
                    for (const table of availableTablesForColumnPermission.value) {
                        for (const f of table.fields) {
                            const fObj = typeof f === 'object' ? f : { name: f, chineseName: '', category: null };
                            if (fieldNames.has(fObj.name)) continue;
                            if (fObj.name.toLowerCase().includes(search) || (fObj.chineseName && fObj.chineseName.toLowerCase().includes(search))) {
                                fieldNames.add(fObj.name);
                                results.push({ type: 'field', label: fObj.name, sublabel: fObj.chineseName || '', value: fObj.name });
                            }
                        }
                    }
                }
                // 匹配的分类
                if (resourceType === 'all' || resourceType === 'category') {
                    for (const cat of getAllCategories()) {
                        if (cat.toLowerCase().includes(search)) {
                            results.push({ type: 'category', label: cat, sublabel: '', value: cat });
                        }
                    }
                }
                return results;
            };
            // 列权限规则：从下拉选择添加/移除一个过滤条件（toggle）
            const addFilterCondition = (option) => {
                if (option.type === 'table') {
                    if (colRuleTableFilters.value.includes(option.value)) {
                        colRuleTableFilters.value = colRuleTableFilters.value.filter(v => v !== option.value);
                    } else {
                        colRuleTableFilters.value = [...colRuleTableFilters.value, option.value];
                    }
                } else if (option.type === 'field') {
                    if (colRuleFieldFilters.value.includes(option.value)) {
                        colRuleFieldFilters.value = colRuleFieldFilters.value.filter(v => v !== option.value);
                    } else {
                        colRuleFieldFilters.value = [...colRuleFieldFilters.value, option.value];
                    }
                } else if (option.type === 'category') {
                    if (colRuleGlobalCategoryFilters.value.includes(option.value)) {
                        colRuleGlobalCategoryFilters.value = colRuleGlobalCategoryFilters.value.filter(v => v !== option.value);
                    } else {
                        colRuleGlobalCategoryFilters.value = [...colRuleGlobalCategoryFilters.value, option.value];
                    }
                }
                // 不清空搜索词，让用户可以继续选择多个过滤条件
            };
            // 列权限规则：完成筛选（关闭下拉框并清空搜索词）
            const finishFilterSearch = () => {
                colRuleFilterSearch.value = '';
                colRuleFilterSearchFocused.value = false;
            };;
            // 列权限规则：移除一个过滤条件
            const removeFilterCondition = (type, value) => {
                if (type === 'table') {
                    colRuleTableFilters.value = colRuleTableFilters.value.filter(v => v !== value);
                } else if (type === 'field') {
                    colRuleFieldFilters.value = colRuleFieldFilters.value.filter(v => v !== value);
                } else if (type === 'category') {
                    colRuleGlobalCategoryFilters.value = colRuleGlobalCategoryFilters.value.filter(v => v !== value);
                }
            };
            // 列权限规则：清空所有过滤条件
            const clearAllFilterConditions = () => {
                colRuleTableFilters.value = [];
                colRuleFieldFilters.value = [];
                colRuleGlobalCategoryFilters.value = [];
            };
            // 列权限规则：判断是否有任何过滤条件
            const hasAnyFilterCondition = () => {
                return colRuleTableFilters.value.length > 0 || colRuleFieldFilters.value.length > 0 || colRuleGlobalCategoryFilters.value.length > 0;
            };
            // 列权限规则：获取所有已选过滤条件（统一列表）
            const getAllFilterConditions = () => {
                const conditions = [];
                for (const v of colRuleTableFilters.value) conditions.push({ type: 'table', value: v });
                for (const v of colRuleFieldFilters.value) conditions.push({ type: 'field', value: v });
                for (const v of colRuleGlobalCategoryFilters.value) conditions.push({ type: 'category', value: v });
                return conditions;
            };
            // 列权限规则：获取某张表的扁平字段列表（所有字段，不按分类分组）
            const getFlatFieldsForTable = (tableId) => {
                const table = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                if (!table) return [];
                return table.fields.map(f => typeof f === 'object' ? f : { name: f, category: null, chineseName: '', description: '' });
            };
            // 列权限规则：获取某张表在当前全局过滤条件下应显示的字段
            const getDisplayFieldsForTable = (tableId) => {
                const globalCats = colRuleGlobalCategoryFilters.value;
                const fieldFilters = colRuleFieldFilters.value;
                const tableSearchQuery = (colRuleFieldSearchQueries.value[tableId] || '').trim().toLowerCase();
                const allGroups = getFieldsGroupedByCategory(tableId);
                // 局部搜索过滤辅助：对字段列表应用表内搜索
                const applyTableSearch = (fields) => {
                    if (!tableSearchQuery) return fields;
                    return fields.filter(f => {
                        const name = (f.name || '').toLowerCase();
                        const chinese = (f.chineseName || '').toLowerCase();
                        return name.includes(tableSearchQuery) || chinese.includes(tableSearchQuery);
                    });
                };
                // 有分类过滤时按分类过滤
                if (globalCats.length > 0) {
                    if (globalCats.length === 1) {
                        const cat = globalCats[0];
                        const group = allGroups.find(g => g.category === cat);
                        let fields = group ? group.fields : [];
                        // 如果还有字段过滤，进一步过滤
                        if (fieldFilters.length > 0) {
                            fields = fields.filter(f => fieldFilters.includes(f.name));
                        }
                        // 应用表内搜索
                        fields = applyTableSearch(fields);
                        return { mode: 'single-category', category: cat, fields };
                    } else {
                        const groups = allGroups.filter(g => globalCats.includes(g.category));
                        // 如果还有字段过滤，进一步过滤每个组
                        if (fieldFilters.length > 0) {
                            return { mode: 'grouped', groups: groups.map(g => ({ ...g, fields: applyTableSearch(g.fields.filter(f => fieldFilters.includes(f.name))) })).filter(g => g.fields.length > 0) };
                        }
                        return { mode: 'grouped', groups: groups.map(g => ({ ...g, fields: applyTableSearch(g.fields) })).filter(g => g.fields.length > 0) };
                    }
                }
                // 有字段过滤但没有分类过滤
                if (fieldFilters.length > 0) {
                    const allFields = [];
                    for (const g of allGroups) allFields.push(...g.fields);
                    return { mode: 'flat', fields: applyTableSearch(allFields.filter(f => fieldFilters.includes(f.name))) };
                }
                // 无任何过滤：返回扁平列表
                const allFields = [];
                for (const g of allGroups) allFields.push(...g.fields);
                return { mode: 'flat', fields: applyTableSearch(allFields) };
            };
            // 列权限规则：某个分类过滤器下是否全选
            const isFilterCategoryFullyChecked = (tableId, category) => {
                if (!editingColumnRule.value) return false;
                const selected = editingColumnRule.value.tableFields[tableId] || [];
                const allGroups = getFieldsGroupedByCategory(tableId);
                const group = allGroups.find(g => g.category === category);
                if (!group || group.fields.length === 0) return false;
                return group.fields.every(f => selected.includes(f.name));
            };
            const isFilterCategoryIndeterminate = (tableId, category) => {
                if (!editingColumnRule.value) return false;
                const selected = editingColumnRule.value.tableFields[tableId] || [];
                const allGroups = getFieldsGroupedByCategory(tableId);
                const group = allGroups.find(g => g.category === category);
                if (!group || group.fields.length === 0) return false;
                const checkedCount = group.fields.filter(f => selected.includes(f.name)).length;
                return checkedCount > 0 && checkedCount < group.fields.length;
            };
            // 列权限规则弹窗 - 过滤后显示的表
            const filteredTablesForColRule = computed(() => {
                const globalCats = colRuleGlobalCategoryFilters.value;
                const tableFilters = colRuleTableFilters.value;
                const fieldFilters = colRuleFieldFilters.value;
                return availableTablesForColumnPermission.value.filter(table => {
                    // 表名过滤：如果指定了表名过滤，只保留匹配的表
                    if (tableFilters.length > 0) {
                        if (!tableFilters.includes(table.name)) return false;
                    }
                    // 字段名过滤：表至少要有一个匹配的字段
                    if (fieldFilters.length > 0) {
                        const hasField = table.fields.some(f => {
                            const fObj = typeof f === 'object' ? f : { name: f };
                            return fieldFilters.includes(fObj.name);
                        });
                        if (!hasField) return false;
                    }
                    // 分类过滤：只保留有对应分类字段的表
                    if (globalCats.length > 0) {
                        const hasAnyCat = table.fields.some(f => {
                            const fObj = typeof f === 'object' ? f : { name: f, category: null };
                            return fObj.category && globalCats.includes(fObj.category);
                        });
                        if (!hasAnyCat) return false;
                    }
                    return true;
                });
            });
            const filteredPPGroupsForColRule = computed(() => {
                const globalCats = colRuleGlobalCategoryFilters.value;
                const fieldFilters = colRuleFieldFilters.value;
                const tableFilters = colRuleTableFilters.value;
                if (globalCats.length === 0 && fieldFilters.length === 0 && tableFilters.length === 0) {
                    return permissionPointGroupsForAddField.value;
                }
                return permissionPointGroupsForAddField.value.filter(group => {
                    const fieldMatch = group.tableIds.some(tableId => {
                        const table = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                        if (!table) return false;
                        // 表名过滤
                        if (tableFilters.length > 0 && !tableFilters.includes(table.name)) return false;
                        return table.fields.some(f => {
                            const fObj = typeof f === 'object' ? f : { name: f, permissionPoint: null, category: null };
                            if (fObj.permissionPoint !== group.permissionPoint) return false;
                            // 字段名过滤
                            if (fieldFilters.length > 0 && !fieldFilters.includes(fObj.name)) return false;
                            // 分类过滤
                            if (globalCats.length > 0 && (!fObj.category || !globalCats.includes(fObj.category))) return false;
                            return true;
                        });
                    });
                    return fieldMatch;
                });
            });
            // 列权限规则弹窗 - 按权限点选择
            const isPPFullyCheckedForColRule = (permissionPoint) => {
                const ppGroup = permissionPointGroupsForAddField.value.find(g => g.permissionPoint === permissionPoint);
                if (!ppGroup) return false;
                let total = 0;
                let selected = 0;
                for (const tableId of ppGroup.tableIds) {
                    const fields = getFieldsForTableAndPP(tableId, permissionPoint);
                    total += fields.length;
                    selected += fields.filter(f => (editingColumnRule.value?.tableFields?.[tableId] || []).includes(f.name)).length;
                }
                return selected === total && total > 0;
            };
            const isPPIndeterminateForColRule = (permissionPoint) => {
                const ppGroup = permissionPointGroupsForAddField.value.find(g => g.permissionPoint === permissionPoint);
                if (!ppGroup) return false;
                let total = 0;
                let selected = 0;
                for (const tableId of ppGroup.tableIds) {
                    const fields = getFieldsForTableAndPP(tableId, permissionPoint);
                    total += fields.length;
                    selected += fields.filter(f => (editingColumnRule.value?.tableFields?.[tableId] || []).includes(f.name)).length;
                }
                return selected > 0 && selected < total;
            };
            // 辅助函数：刷新所有表的 tableFieldScope 标记（自动检测全选/取消全选状态）
            const _refreshTableFieldScopes = () => {
                if (!editingColumnRule.value) return;
                if (!editingColumnRule.value.tableFieldScope) editingColumnRule.value.tableFieldScope = {};
                for (const table of availableTablesForColumnPermission.value) {
                    const fields = editingColumnRule.value.tableFields[table.id] || [];
                    const totalFieldNames = table.fields.map(f => typeof f === 'object' ? f.name : f);
                    const isFull = fields.length === totalFieldNames.length && totalFieldNames.length > 0;
                    if (isFull && !editingColumnRule.value.tableFieldScope[table.id]) {
                        editingColumnRule.value.tableFieldScope[table.id] = 'dynamic';
                    } else if (!isFull && editingColumnRule.value.tableFieldScope[table.id]) {
                        delete editingColumnRule.value.tableFieldScope[table.id];
                    }
                }
            };
            const togglePPForColRule = (permissionPoint) => {
                const ppGroup = permissionPointGroupsForAddField.value.find(g => g.permissionPoint === permissionPoint);
                if (!ppGroup || !editingColumnRule.value) return;
                const isFull = isPPFullyCheckedForColRule(permissionPoint);
                for (const tableId of ppGroup.tableIds) {
                    const fields = getFieldsForTableAndPP(tableId, permissionPoint);
                    if (!editingColumnRule.value.tableFields[tableId]) editingColumnRule.value.tableFields[tableId] = [];
                    if (isFull) {
                        for (const f of fields) {
                            const idx = editingColumnRule.value.tableFields[tableId].indexOf(f.name);
                            if (idx > -1) editingColumnRule.value.tableFields[tableId].splice(idx, 1);
                        }
                    } else {
                        for (const f of fields) {
                            if (!editingColumnRule.value.tableFields[tableId].includes(f.name)) {
                                editingColumnRule.value.tableFields[tableId].push(f.name);
                            }
                        }
                    }
                }
            };
            const isTableFullyChecked = (table) => {
                if (!editingColumnRule.value) return false;
                const tableId = typeof table === 'object' && table.id ? table.id : table;
                const fields = editingColumnRule.value.tableFields[tableId] || [];
                const tableObj = typeof table === 'object' ? table : availableTablesForColumnPermission.value.find(t => t.id === tableId);
                if (!tableObj) return false;
                const totalFieldNames = tableObj.fields.map(f => typeof f === 'object' ? f.name : f);
                return fields.length === totalFieldNames.length && totalFieldNames.length > 0;
            };
            const isTableIndeterminate = (table) => {
                if (!editingColumnRule.value) return false;
                const tableId = typeof table === 'object' && table.id ? table.id : table;
                const fields = editingColumnRule.value.tableFields[tableId] || [];
                const tableObj = typeof table === 'object' ? table : availableTablesForColumnPermission.value.find(t => t.id === tableId);
                if (!tableObj) return false;
                const totalFieldNames = tableObj.fields.map(f => typeof f === 'object' ? f.name : f);
                return fields.length > 0 && fields.length < totalFieldNames.length;
            };
            // 按权限点浏览时：判断某表在该权限点下的字段是否全选
            const isTableFullyCheckedInPP = (tableId, permissionPoint) => {
                if (!editingColumnRule.value) return false;
                const fields = getFieldsForTableAndPP(tableId, permissionPoint);
                const selected = editingColumnRule.value.tableFields?.[tableId] || [];
                const ppFieldsSelected = fields.filter(f => selected.includes(f.name));
                return ppFieldsSelected.length === fields.length && fields.length > 0;
            };
            // 按权限点浏览时：判断某表在该权限点下的字段是否半选
            const isTableIndeterminateInPP = (tableId, permissionPoint) => {
                if (!editingColumnRule.value) return false;
                const fields = getFieldsForTableAndPP(tableId, permissionPoint);
                const selected = editingColumnRule.value.tableFields?.[tableId] || [];
                const ppFieldsSelected = fields.filter(f => selected.includes(f.name));
                return ppFieldsSelected.length > 0 && ppFieldsSelected.length < fields.length;
            };
            // 按权限点浏览时：切换某表在该权限点下的全部字段选中状态
            const toggleTableForPPInColRule = (tableId, permissionPoint) => {
                if (!editingColumnRule.value) return;
                const fields = getFieldsForTableAndPP(tableId, permissionPoint);
                if (!editingColumnRule.value.tableFields) editingColumnRule.value.tableFields = {};
                if (!editingColumnRule.value.tableFields[tableId]) editingColumnRule.value.tableFields[tableId] = [];
                const selected = editingColumnRule.value.tableFields[tableId];
                const isFull = isTableFullyCheckedInPP(tableId, permissionPoint);
                if (isFull) {
                    // 取消选中该权限点下的所有字段
                    for (const f of fields) {
                        const idx = selected.indexOf(f.name);
                        if (idx > -1) selected.splice(idx, 1);
                    }
                    // 检查该表是否还有任何选中字段，清除 scope 标记
                    if (selected.length === 0) {
                        if (editingColumnRule.value.tableFieldScope && editingColumnRule.value.tableFieldScope[tableId]) {
                            delete editingColumnRule.value.tableFieldScope[tableId];
                        }
                    }
                } else {
                    // 选中该权限点下的所有字段
                    for (const f of fields) {
                        if (!selected.includes(f.name)) selected.push(f.name);
                    }
                    // 检查是否全选了该表所有字段，自动标记 scope
                    const tableObj = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                    if (tableObj) {
                        const totalFieldNames = tableObj.fields.map(f => typeof f === 'object' ? f.name : f);
                        if (selected.length === totalFieldNames.length && totalFieldNames.length > 0) {
                            if (!editingColumnRule.value.tableFieldScope) editingColumnRule.value.tableFieldScope = {};
                            if (!editingColumnRule.value.tableFieldScope[tableId]) editingColumnRule.value.tableFieldScope[tableId] = 'dynamic';
                        }
                    }
                }
            };
            const toggleTableSelection = (table) => {
                if (!editingColumnRule.value) return;
                if (!editingColumnRule.value.tableFields) editingColumnRule.value.tableFields = {};
                const totalFieldNames = table.fields.map(f => typeof f === 'object' ? f.name : f);
                if (!editingColumnRule.value.tableFields[table.id]) editingColumnRule.value.tableFields[table.id] = [];
                const selected = editingColumnRule.value.tableFields[table.id];
                
                // 如果有筛选条件，toggle 只作用于筛选后的字段
                const displayInfo = getDisplayFieldsForTable(table.id);
                let targetFieldNames;
                if (displayInfo.mode === 'flat') {
                    targetFieldNames = displayInfo.fields.map(f => f.name);
                } else if (displayInfo.mode === 'single-category') {
                    targetFieldNames = displayInfo.fields.map(f => f.name);
                } else if (displayInfo.mode === 'grouped') {
                    targetFieldNames = [];
                    for (const g of displayInfo.groups) targetFieldNames.push(...g.fields.map(f => f.name));
                } else {
                    targetFieldNames = totalFieldNames;
                }
                
                if (targetFieldNames.length === 0) return;
                
                const allTargetSelected = targetFieldNames.every(f => selected.includes(f));
                if (allTargetSelected) {
                    // 取消选择筛选后的字段
                    for (const fName of targetFieldNames) {
                        const idx = selected.indexOf(fName);
                        if (idx > -1) selected.splice(idx, 1);
                    }
                    // 如果全表都取消了，清除 scope 标记
                    if (selected.length === 0 && editingColumnRule.value.tableFieldScope) {
                        delete editingColumnRule.value.tableFieldScope[table.id];
                    }
                } else {
                    // 选中筛选后的字段
                    for (const fName of targetFieldNames) {
                        if (!selected.includes(fName)) selected.push(fName);
                    }
                    // 检查是否全选了整表
                    if (selected.length === totalFieldNames.length && totalFieldNames.length > 0) {
                        if (!editingColumnRule.value.tableFieldScope) editingColumnRule.value.tableFieldScope = {};
                        if (!editingColumnRule.value.tableFieldScope[table.id]) editingColumnRule.value.tableFieldScope[table.id] = 'dynamic';
                    }
                }
            };
            const toggleFieldSelection = (tableId, fieldName) => {
                if (!editingColumnRule.value) return;
                ensureColRuleTableSelected(tableId);
                const fields = editingColumnRule.value.tableFields[tableId];
                const idx = fields.indexOf(fieldName);
                if (idx > -1) fields.splice(idx, 1);
                else fields.push(fieldName);
                // 检查是否全选了某表，自动标记 scope
                const table = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                if (table) {
                    const totalFieldNames = table.fields.map(f => typeof f === 'object' ? f.name : f);
                    if (fields.length === totalFieldNames.length && totalFieldNames.length > 0) {
                        if (!editingColumnRule.value.tableFieldScope) editingColumnRule.value.tableFieldScope = {};
                        if (!editingColumnRule.value.tableFieldScope[tableId]) editingColumnRule.value.tableFieldScope[tableId] = 'dynamic';
                    } else {
                        if (editingColumnRule.value.tableFieldScope && editingColumnRule.value.tableFieldScope[tableId]) {
                            delete editingColumnRule.value.tableFieldScope[tableId];
                        }
                    }
                }
            };
            // 新建列权限规则 - 展开/收起表
            const toggleTableExpandForColRule = (tableId) => {
                const idx = expandedTablesForColRule.value.indexOf(tableId);
                if (idx > -1) {
                    expandedTablesForColRule.value.splice(idx, 1);
                    // 折叠时清空该表的搜索关键词
                    delete colRuleFieldSearchQueries.value[tableId];
                } else {
                    expandedTablesForColRule.value.push(tableId);
                }
            };
            // 新建列权限规则 - 展开/收起权限点
            const togglePPExpandForColRule = (ppName) => {
                const idx = expandedPPsForColRule.value.indexOf(ppName);
                if (idx > -1) {
                    expandedPPsForColRule.value.splice(idx, 1);
                } else {
                    expandedPPsForColRule.value.push(ppName);
                }
            };
            const getTotalSelectedFieldCount = () => {
                if (!editingColumnRule.value || !editingColumnRule.value.tableFields) return 0;
                let total = 0;
                for (const tableId of Object.keys(editingColumnRule.value.tableFields)) {
                    total += editingColumnRule.value.tableFields[tableId].length;
                }
                return total;
            };
            const getSelectedTableCount = () => {
                if (!editingColumnRule.value || !editingColumnRule.value.tableFields) return 0;
                let count = 0;
                for (const tableId of Object.keys(editingColumnRule.value.tableFields)) {
                    if (editingColumnRule.value.tableFields[tableId].length > 0) count++;
                }
                return count;
            };

            // ─── 更新表字段弹窗 ─────────────────
            const filteredAvailableTablesForAddField = computed(() => {
                const query = addTableFieldSearchQuery.value.trim().toLowerCase();
                if (!query) return availableTablesForColumnPermission.value;
                return availableTablesForColumnPermission.value.filter(table => {
                    const tableMatch = table.name.toLowerCase().includes(query) ||
                                       table.chineseName.toLowerCase().includes(query) ||
                                       (table.catalogPath && table.catalogPath.toLowerCase().includes(query));
                    const fieldMatch = table.fields.some(f => {
                        const fName = typeof f === 'object' ? f.name : f;
                        const fPP = typeof f === 'object' ? (f.permissionPoint || '') : '';
                        return fName.toLowerCase().includes(query) || fPP.toLowerCase().includes(query);
                    });
                    return tableMatch || fieldMatch;
                });
            });
            // 字段搜索匹配判断（用于v-show）
            const isFieldMatchSearch = (field, query) => {
                if (!query || !query.trim()) return true;
                const q = query.trim().toLowerCase();
                const fName = typeof field === 'object' ? field.name : field;
                const fPP = typeof field === 'object' ? (field.permissionPoint || '') : '';
                return fName.toLowerCase().includes(q) || fPP.toLowerCase().includes(q);
            };
            // 详情展示：按分类分组字段（新建规则弹窗使用）
            const getFieldsGroupedByCategory = (tableId) => {
                const table = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                if (!table) return [];
                const groups = {};
                for (const field of table.fields) {
                    const fObj = typeof field === 'object' ? field : { name: field, category: null, chineseName: '', description: '' };
                    const cat = fObj.category || '_none';
                    if (!groups[cat]) groups[cat] = { category: fObj.category || null, fields: [] };
                    groups[cat].fields.push(fObj);
                }
                // 先有分类的，后无分类的
                const result = [];
                for (const key of Object.keys(groups)) {
                    if (key !== '_none') result.push(groups[key]);
                }
                if (groups['_none']) result.push(groups['_none']);
                return result;
            };
            // 分类全选判断
            const isCategoryFullyChecked = (tableId, category) => {
                if (!editingColumnRule.value) return false;
                const selected = editingColumnRule.value.tableFields[tableId] || [];
                const groups = getFieldsGroupedByCategory(tableId);
                const group = groups.find(g => (g.category || '_none') === (category || '_none'));
                if (!group || group.fields.length === 0) return false;
                return group.fields.every(f => selected.includes(f.name));
            };
            const isCategoryIndeterminate = (tableId, category) => {
                if (!editingColumnRule.value) return false;
                const selected = editingColumnRule.value.tableFields[tableId] || [];
                const groups = getFieldsGroupedByCategory(tableId);
                const group = groups.find(g => (g.category || '_none') === (category || '_none'));
                if (!group || group.fields.length === 0) return false;
                const checkedCount = group.fields.filter(f => selected.includes(f.name)).length;
                return checkedCount > 0 && checkedCount < group.fields.length;
            };
            const toggleCategorySelection = (tableId, category) => {
                if (!editingColumnRule.value) return;
                if (!editingColumnRule.value.tableFields) editingColumnRule.value.tableFields = {};
                if (!editingColumnRule.value.tableFields[tableId]) editingColumnRule.value.tableFields[tableId] = [];
                const selected = editingColumnRule.value.tableFields[tableId];
                const groups = getFieldsGroupedByCategory(tableId);
                const group = groups.find(g => (g.category || '_none') === (category || '_none'));
                if (!group) return;
                const isFull = isCategoryFullyChecked(tableId, category);
                if (isFull) {
                    // 取消该分类下所有字段
                    for (const f of group.fields) {
                        const idx = selected.indexOf(f.name);
                        if (idx > -1) selected.splice(idx, 1);
                    }
                } else {
                    // 选中该分类下所有字段
                    for (const f of group.fields) {
                        if (!selected.includes(f.name)) selected.push(f.name);
                    }
                }
                // 检查是否全选了某表，自动标记 scope
                const table = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                if (table) {
                    const totalFieldNames = table.fields.map(f => typeof f === 'object' ? f.name : f);
                    if (selected.length === totalFieldNames.length && totalFieldNames.length > 0) {
                        if (!editingColumnRule.value.tableFieldScope) editingColumnRule.value.tableFieldScope = {};
                        if (!editingColumnRule.value.tableFieldScope[tableId]) editingColumnRule.value.tableFieldScope[tableId] = 'dynamic';
                    } else {
                        if (editingColumnRule.value.tableFieldScope && editingColumnRule.value.tableFieldScope[tableId]) {
                            delete editingColumnRule.value.tableFieldScope[tableId];
                        }
                    }
                }
            };
            // 只看已选 - 获取有选中字段的表
            const getSelectedTablesForColRule = () => {
                if (!editingColumnRule.value || !editingColumnRule.value.tableFields) return [];
                const result = [];
                for (const tableId of Object.keys(editingColumnRule.value.tableFields)) {
                    const fields = editingColumnRule.value.tableFields[tableId];
                    if (fields && fields.length > 0) {
                        const table = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                        if (table) result.push(table);
                    }
                }
                return result;
            };
            // 只看已选 - 获取某表中已选的字段详情
            const getSelectedFieldsForTable = (tableId) => {
                if (!editingColumnRule.value || !editingColumnRule.value.tableFields) return [];
                const selected = editingColumnRule.value.tableFields[tableId] || [];
                const table = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                if (!table) return [];
                return selected.map(name => {
                    const fObj = table.fields.find(f => (typeof f === 'object' ? f.name : f) === name);
                    return fObj && typeof fObj === 'object' ? fObj : { name: name, chineseName: '', description: '' };
                });
            };
            // 列权限规则：只看已选模式下，带搜索过滤的已选字段列表
            const getSelectedFieldsForTableFiltered = (tableId) => {
                const fields = getSelectedFieldsForTable(tableId);
                const query = (colRuleFieldSearchQueries.value[tableId] || '').trim().toLowerCase();
                if (!query) return fields;
                return fields.filter(f => {
                    const name = (f.name || '').toLowerCase();
                    const chinese = (f.chineseName || '').toLowerCase();
                    return name.includes(query) || chinese.includes(query);
                });
            };
            // 详情展示：按权限点分组字段
            const getFieldsGroupedByPermissionPoint = (tableId, fieldNames) => {
                const table = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                if (!table) return [];
                const groups = {};
                for (const fName of fieldNames) {
                    const fieldObj = table.fields.find(f => (typeof f === 'object' ? f.name : f) === fName);
                    const pp = fieldObj && typeof fieldObj === 'object' ? (fieldObj.permissionPoint || null) : null;
                    const key = pp || '_none';
                    if (!groups[key]) groups[key] = { permissionPoint: pp, fields: [] };
                    groups[key].fields.push(fName);
                }
                // 先有权限点的，后无权限点的
                const result = [];
                for (const key of Object.keys(groups)) {
                    if (key !== '_none') result.push(groups[key]);
                }
                if (groups['_none']) result.push(groups['_none']);
                return result;
            };
            // 详情展示：权限点数量统计
            const getPermissionPointCountForTable = (tableId, fieldNames) => {
                const table = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                if (!table) return 0;
                const pps = new Set();
                for (const fName of fieldNames) {
                    const fieldObj = table.fields.find(f => (typeof f === 'object' ? f.name : f) === fName);
                    const pp = fieldObj && typeof fieldObj === 'object' ? fieldObj.permissionPoint : null;
                    if (pp) pps.add(pp);
                }
                return pps.size;
            };
            // ─── 按权限点浏览 ─────────────────
            // 构建权限点分组数据
            const permissionPointGroupsForAddField = computed(() => {
                const allTables = availableTablesForColumnPermission.value;
                const groups = {};
                for (const table of allTables) {
                    for (const field of table.fields) {
                        const fObj = typeof field === 'object' ? field : { name: field, permissionPoint: null };
                        const pp = fObj.permissionPoint || null;
                        const key = pp || '_none';
                        if (!groups[key]) groups[key] = { permissionPoint: pp, tableIds: [], totalFieldCount: 0 };
                        if (!groups[key].tableIds.includes(table.id)) groups[key].tableIds.push(table.id);
                        groups[key].totalFieldCount++;
                    }
                }
                const result = [];
                for (const key of Object.keys(groups)) {
                    if (key !== '_none') result.push(groups[key]);
                }
                if (groups['_none']) result.push(groups['_none']);
                return result;
            });
            // 过滤后的权限点分组
            const filteredPermissionPointGroupsForAddField = computed(() => {
                const query = addTableFieldSearchQuery.value.trim().toLowerCase();
                if (!query) return permissionPointGroupsForAddField.value;
                return permissionPointGroupsForAddField.value.filter(group => {
                    const ppMatch = (group.permissionPoint || '').toLowerCase().includes(query);
                    const fieldMatch = group.tableIds.some(tableId => {
                        const table = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                        if (!table) return false;
                        return table.fields.some(f => {
                            const fObj = typeof f === 'object' ? f : { name: f, permissionPoint: null };
                            const pp = fObj.permissionPoint || null;
                            if (pp !== group.permissionPoint) return false;
                            return fObj.name.toLowerCase().includes(query) || (pp && pp.toLowerCase().includes(query));
                        });
                    });
                    return ppMatch || fieldMatch;
                });
            });
            // 获取某表某权限点下的字段（支持搜索过滤）
            const getFieldsForTableAndPP = (tableId, permissionPoint, searchQuery = '') => {
                const table = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                if (!table) return [];
                const query = searchQuery || addTableFieldSearchQuery.value.trim().toLowerCase();
                return table.fields.filter(f => {
                    const fObj = typeof f === 'object' ? f : { name: f, permissionPoint: null };
                    if (fObj.permissionPoint !== permissionPoint) return false;
                    // 如果有搜索关键词，字段名或权限点需要匹配
                    if (query) {
                        const nameMatch = fObj.name.toLowerCase().includes(query);
                        const ppMatch = fObj.permissionPoint && fObj.permissionPoint.toLowerCase().includes(query);
                        return nameMatch || ppMatch;
                    }
                    return true;
                });
            };
            // 权限点全选/半选判断
            const isPermissionPointFullyCheckedForAddField = (permissionPoint) => {
                const ppGroup = permissionPointGroupsForAddField.value.find(g => g.permissionPoint === permissionPoint);
                if (!ppGroup) return false;
                let total = 0;
                let selected = 0;
                for (const tableId of ppGroup.tableIds) {
                    const fields = getFieldsForTableAndPP(tableId, permissionPoint);
                    total += fields.length;
                    selected += fields.filter(f => (addFieldSelectedFields.value[tableId] || []).includes(f.name)).length;
                }
                return selected === total && total > 0;
            };
            const isPermissionPointIndeterminateForAddField = (permissionPoint) => {
                const ppGroup = permissionPointGroupsForAddField.value.find(g => g.permissionPoint === permissionPoint);
                if (!ppGroup) return false;
                let total = 0;
                let selected = 0;
                for (const tableId of ppGroup.tableIds) {
                    const fields = getFieldsForTableAndPP(tableId, permissionPoint);
                    total += fields.length;
                    selected += fields.filter(f => (addFieldSelectedFields.value[tableId] || []).includes(f.name)).length;
                }
                return selected > 0 && selected < total;
            };
            const getSelectedFieldCountForPPForAddField = (permissionPoint) => {
                const ppGroup = permissionPointGroupsForAddField.value.find(g => g.permissionPoint === permissionPoint);
                if (!ppGroup) return 0;
                let selected = 0;
                for (const tableId of ppGroup.tableIds) {
                    const fields = getFieldsForTableAndPP(tableId, permissionPoint);
                    selected += fields.filter(f => (addFieldSelectedFields.value[tableId] || []).includes(f.name)).length;
                }
                return selected;
            };
            const togglePermissionPointForAddField = (permissionPoint) => {
                const ppGroup = permissionPointGroupsForAddField.value.find(g => g.permissionPoint === permissionPoint);
                if (!ppGroup) return;
                const isFull = isPermissionPointFullyCheckedForAddField(permissionPoint);
                for (const tableId of ppGroup.tableIds) {
                    const fields = getFieldsForTableAndPP(tableId, permissionPoint);
                    if (!addFieldSelectedFields.value[tableId]) addFieldSelectedFields.value[tableId] = [];
                    if (isFull) {
                        // 取消选择该权限点下所有字段
                        for (const f of fields) {
                            const idx = addFieldSelectedFields.value[tableId].indexOf(f.name);
                            if (idx > -1) addFieldSelectedFields.value[tableId].splice(idx, 1);
                        }
                    } else {
                        // 选择该权限点下所有字段
                        for (const f of fields) {
                            if (!addFieldSelectedFields.value[tableId].includes(f.name)) {
                                addFieldSelectedFields.value[tableId].push(f.name);
                            }
                        }
                    }
                }
            };
            const isTableFullyCheckedForAddField = (tableId) => {
                const selected = addFieldSelectedFields.value[tableId] || [];
                const table = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                if (!table) return false;
                const totalFieldNames = table.fields.map(f => typeof f === 'object' ? f.name : f);
                return selected.length === totalFieldNames.length && totalFieldNames.length > 0;
            };
            const isTableIndeterminateForAddField = (tableId) => {
                const selected = addFieldSelectedFields.value[tableId] || [];
                const table = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                if (!table) return false;
                const totalFieldNames = table.fields.map(f => typeof f === 'object' ? f.name : f);
                return selected.length > 0 && selected.length < totalFieldNames.length;
            };
            const getSelectedFieldCountForAddField = (tableId) => {
                return (addFieldSelectedFields.value[tableId] || []).length;
            };
            const toggleTableForAddField = (tableId) => {
                const table = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                if (!table) return;
                const query = addTableFieldSearchQuery.value.trim().toLowerCase();
                if (!addFieldSelectedFields.value[tableId]) addFieldSelectedFields.value[tableId] = [];
                const selected = addFieldSelectedFields.value[tableId];
                
                // 如果搜索关键词匹配某个权限点名称，全选 = 只选该权限点下的字段
                if (query) {
                    const matchedPPs = table.fields
                        .filter(f => typeof f === 'object' && f.permissionPoint)
                        .map(f => f.permissionPoint)
                        .filter(pp => pp.toLowerCase().includes(query));
                    
                    if (matchedPPs.length > 0) {
                        // 有匹配的权限点，全选只选这些权限点下的字段
                        const ppFields = table.fields.filter(f => {
                            if (typeof f !== 'object') return false;
                            return matchedPPs.includes(f.permissionPoint);
                        }).map(f => f.name);
                        
                        // 判断是否已经全部选中了这些权限点字段
                        const allPPSelected = ppFields.every(f => selected.includes(f));
                        if (allPPSelected) {
                            // 取消选择这些权限点字段
                            for (const fName of ppFields) {
                                const idx = selected.indexOf(fName);
                                if (idx > -1) selected.splice(idx, 1);
                            }
                        } else {
                            // 选择这些权限点字段
                            for (const fName of ppFields) {
                                if (!selected.includes(fName)) selected.push(fName);
                            }
                        }
                        return;
                    }
                    
                    // 如果搜索关键词没有匹配权限点，只匹配字段名
                    const matchedFieldNames = table.fields.filter(f => {
                        const fObj = typeof f === 'object' ? f : { name: f };
                        return fObj.name.toLowerCase().includes(query);
                    }).map(f => typeof f === 'object' ? f.name : f);
                    
                    if (matchedFieldNames.length > 0) {
                        const allMatched = matchedFieldNames.every(f => selected.includes(f));
                        if (allMatched) {
                            for (const fName of matchedFieldNames) {
                                const idx = selected.indexOf(fName);
                                if (idx > -1) selected.splice(idx, 1);
                            }
                        } else {
                            for (const fName of matchedFieldNames) {
                                if (!selected.includes(fName)) selected.push(fName);
                            }
                        }
                        return;
                    }
                }
                
                // 无搜索关键词：全选 = 选中全表所有字段（原有逻辑）
                const totalFieldNames = table.fields.map(f => typeof f === 'object' ? f.name : f);
                if (selected.length === totalFieldNames.length) {
                    addFieldSelectedFields.value[tableId] = [];
                } else {
                    addFieldSelectedFields.value[tableId] = [...totalFieldNames];
                }
            };
            const toggleFieldForAddField = (tableId, fieldName) => {
                if (!addFieldSelectedFields.value[tableId]) addFieldSelectedFields.value[tableId] = [];
                const selected = addFieldSelectedFields.value[tableId];
                const idx = selected.indexOf(fieldName);
                if (idx > -1) selected.splice(idx, 1);
                else selected.push(fieldName);
            };
            // 展开/收起表
            const toggleTableExpandForAddField = (tableId) => {
                const idx = expandedTablesForAddField.value.indexOf(tableId);
                if (idx > -1) {
                    expandedTablesForAddField.value.splice(idx, 1);
                } else {
                    expandedTablesForAddField.value.push(tableId);
                }
            };
            // 展开/收起权限点
            const togglePPExpandForAddField = (ppName) => {
                const idx = expandedPPsForAddField.value.indexOf(ppName);
                if (idx > -1) {
                    expandedPPsForAddField.value.splice(idx, 1);
                } else {
                    expandedPPsForAddField.value.push(ppName);
                }
            };
            const getTotalSelectedFieldCountForAddField = computed(() => {
                let total = 0;
                for (const tableId of Object.keys(addFieldSelectedFields.value)) {
                    total += addFieldSelectedFields.value[tableId].length;
                }
                return total;
            });
            const getSelectedTableCountForAddField = computed(() => {
                let count = 0;
                for (const tableId of Object.keys(addFieldSelectedFields.value)) {
                    if (addFieldSelectedFields.value[tableId].length > 0) count++;
                }
                return count;
            });
            const confirmAddTableField = () => {
                if (!selectedColumnRule.value) return;
                if (!selectedColumnRule.value.tableFields) selectedColumnRule.value.tableFields = {};
                for (const tableId of Object.keys(addFieldSelectedFields.value)) {
                    const newFields = addFieldSelectedFields.value[tableId];
                    if (newFields.length === 0) continue;
                    if (!selectedColumnRule.value.tableFields[tableId]) {
                        selectedColumnRule.value.tableFields[tableId] = [...newFields];
                    } else {
                        // 合并，避免重复
                        for (const fName of newFields) {
                            if (!selectedColumnRule.value.tableFields[tableId].includes(fName)) {
                                selectedColumnRule.value.tableFields[tableId].push(fName);
                            }
                        }
                    }
                }
                showAddTableFieldModal.value = false;
                addFieldSelectedFields.value = {};
                addTableFieldSearchQuery.value = '';
            };
            // ─── 批量新增 ─────────────────
            const openBatchImportModal = (source) => {
                batchImportSource.value = source;
                batchImportFile.value = null;
                batchImportPreview.value = [];
                showBatchImportView.value = true;
            };
            const closeBatchImportModal = () => {
                showBatchImportModal.value = false;
                showBatchImportView.value = false;
                batchImportSource.value = '';
                batchImportFile.value = null;
                batchImportPreview.value = [];
            };
            const exitBatchImportView = () => {
                showBatchImportView.value = false;
                batchImportFile.value = null;
                batchImportPreview.value = [];
            };
            const handleBatchImportFile = (event) => {
                const file = event.target.files[0];
                if (!file) return;
                batchImportFile.value = file;
                // Simple CSV parsing (since XLSX parsing requires a library)
                // We'll support CSV and simple Excel-like format
                const reader = new FileReader();
                reader.onload = (e) => {
                    const text = e.target.result;
                    const lines = text.split('\n').filter(l => l.trim());
                    if (lines.length === 0) {
                        batchImportPreview.value = [];
                        return;
                    }
                    // Skip header line if it contains "父级" or "子级"
                    let startIdx = 0;
                    if (lines[0].includes('父级') || lines[0].includes('子级') || lines[0].includes('parent') || lines[0].includes('child')) {
                        startIdx = 1;
                    }
                    const preview = [];
                    for (let i = startIdx; i < lines.length; i++) {
                        const parts = lines[i].split(/[,;\t]/);
                        if (parts.length >= 2) {
                            const parentName = parts[0].trim();
                            const childName = parts[1].trim();
                            if (parentName && childName) {
                                preview.push({ parentName, childName });
                            }
                        }
                    }
                    batchImportPreview.value = preview;
                };
                reader.readAsText(file);
            };
            const confirmBatchImport = () => {
                if (batchImportPreview.value.length === 0) return;
                const imported = batchImportPreview.value;
                // Group by parent name
                const parentMap = {};
                for (const item of imported) {
                    if (!parentMap[item.parentName]) {
                        parentMap[item.parentName] = [];
                    }
                    parentMap[item.parentName].push(item.childName);
                }
                // Add to permissionPointTree
                for (const [parentName, children] of Object.entries(parentMap)) {
                    // Check if parent already exists
                    const existingParent = permissionPointTree.value.find(p => p.name === parentName);
                    if (existingParent) {
                        // Add children that don't already exist
                        for (const childName of children) {
                            const exists = existingParent.children.find(c => c.name === childName);
                            if (!exists) {
                                existingParent.children.unshift({
                                    id: existingParent.id + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                                    name: childName,
                                    parentId: existingParent.id,
                                    appliedFields: []
                                });
                            }
                        }
                        existingParent.expanded = true;
                    } else {
                        // Create new parent
                        const newParentId = 'pp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
                        const newChildren = children.map((childName, idx) => ({
                            id: newParentId + '_' + idx + '_' + Date.now(),
                            name: childName,
                            parentId: newParentId,
                            appliedFields: []
                        }));
                        permissionPointTree.value.unshift({
                            id: newParentId,
                            name: parentName,
                            expanded: true,
                            children: newChildren
                        });
                    }
                }
                // Also auto-select the newly added items in the appropriate modal
                if (batchImportSource.value === 'resourcePointModal') {
                    for (const item of imported) {
                        const path = item.parentName + '/' + item.childName;
                        if (!addingResourcePoints.value.includes(path)) {
                            addingResourcePoints.value.push(path);
                        }
                    }
                }
                closeBatchImportModal();
            };
            // 新增资源点：树选择逻辑（复用 permissionPointTree）
            const isAddResourceParentFullyChecked = (node) => {
                if (!node.children || node.children.length === 0) {
                    return addingResourcePoints.value.includes(node.name);
                }
                return node.children.every(child =>
                    addingResourcePoints.value.includes(node.name + '/' + child.name)
                );
            };
            const isAddResourceParentIndeterminate = (node) => {
                if (!node.children || node.children.length === 0) return false;
                const checkedCount = node.children.filter(child =>
                    addingResourcePoints.value.includes(node.name + '/' + child.name)
                ).length;
                return checkedCount > 0 && checkedCount < node.children.length;
            };
            const toggleAddResourceParent = (node) => {
                if (!node.children || node.children.length === 0) {
                    toggleAddResourcePoint(node.name);
                    return;
                }
                const allChecked = isAddResourceParentFullyChecked(node);
                if (allChecked) {
                    for (const child of node.children) {
                        const path = node.name + '/' + child.name;
                        const idx = addingResourcePoints.value.indexOf(path);
                        if (idx > -1) addingResourcePoints.value.splice(idx, 1);
                    }
                } else {
                    for (const child of node.children) {
                        const path = node.name + '/' + child.name;
                        if (!addingResourcePoints.value.includes(path)) {
                            addingResourcePoints.value.push(path);
                        }
                    }
                }
            };
            const toggleAddResourcePoint = (path) => {
                const idx = addingResourcePoints.value.indexOf(path);
                if (idx > -1) addingResourcePoints.value.splice(idx, 1);
                else addingResourcePoints.value.push(path);
            };
            // 跳转到表详情
            const navigateToTableDetail = (table) => {
                // 查找节点树中对应的资产并选中
                const findAndSelectAsset = (nodes, tableName) => {
                    for (const node of nodes) {
                        if (node.type === 'CATALOG' && node.children) {
                            const result = findAndSelectAsset(node.children, tableName);
                            if (result) return result;
                        }
                        if (node.type === 'RESOURCE' && node.resourceType === 'DATA_ASSET' && node.name === tableName) {
                            return node;
                        }
                    }
                    return null;
                };
                const asset = findAndSelectAsset(catalogTree.value, table.name);
                if (asset) {
                    selectedNode.value = asset;
                    catalogActiveTab.value = 'detail';
                }
            };
            // 权限点规则：列权限选择 - 父级全选/半选逻辑（复用用于新建列权限规则弹窗）
            // ─── UDF 列表 Mock 数据 ───────────────────────
            const udfList = ref([
                { id: 'udf_1', name: '活跃用户列表', type: 'subquery', udfType: '行权限', code: 'active_users', sql: 'SELECT user_id FROM user_stats WHERE last_login > DATE_SUB(NOW(), INTERVAL 30 DAY)', appliedTableCount: 2, enabled: true },
                { id: 'udf_2', name: '部门圈人', type: 'subquery', udfType: '圈人', code: 'dept_users', sql: 'SELECT user_id FROM hr_dept WHERE dept_id IN ({dept_ids})', appliedTableCount: 1, enabled: false },
                { id: 'udf_3', name: '敏感数据权限组', type: 'subquery', udfType: '行权限', code: 'sensitive_access', sql: 'SELECT resource_id FROM permission_matrix WHERE user_id = {user_id} AND access_level >= 3', appliedTableCount: 3, enabled: true }
            ]);

            // ─── 新建子查询弹窗（UDF 页面） ──────────────
            const showUdfSubqueryModal = ref(false);
            const udfSubqueryForm = ref({ name: '', code: '', udfType: '行权限', sql: '' });
            const udfSubqueryValidation = ref(null);
            const udfSubqueryExecuted = ref(false);

            // ─── 权限点子查询弹窗 ──────────────
            const showPermissionPointSubqueryModal = ref(false);
            const permissionPointNewSubqueryForm = ref({ name: '', sql: '' });
            const closePermissionPointSubqueryModal = () => {
                showPermissionPointSubqueryModal.value = false;
                permissionPointNewSubqueryForm.value = { name: '', sql: '' };
            };
            const savePermissionPointSubquery = () => {
                closePermissionPointSubqueryModal();
            };

            Vue.watch(() => udfSubqueryForm.value.name, (val) => {
                udfSubqueryForm.value.code = val.trim().toLowerCase()
                    .replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
            });

            const openUdfSubqueryModal = () => {
                udfSubqueryForm.value = { name: '', code: '', udfType: '行权限', sql: '' };
                udfSubqueryValidation.value = null;
                udfSubqueryExecuted.value = false;
                showUdfSubqueryModal.value = true;
            };
            const closeUdfSubqueryModal = () => {
                showUdfSubqueryModal.value = false;
            };
            const executeUdfSql = () => {
                if (!udfSubqueryForm.value.sql.trim()) {
                    udfSubqueryValidation.value = { success: false, message: 'SQL 不能为空' };
                    udfSubqueryExecuted.value = false;
                    return;
                }
                const isSuccess = Math.random() > 0.2;
                if (isSuccess) {
                    udfSubqueryValidation.value = { success: true, message: '执行成功' };
                    udfSubqueryExecuted.value = true;
                } else {
                    udfSubqueryValidation.value = { success: false, message: '执行失败：未知的表名，请检查 SQL 语句' };
                    udfSubqueryExecuted.value = false;
                }
            };
            const saveUdfSubquery = () => {
                if (!udfSubqueryForm.value.name.trim() || !udfSubqueryExecuted.value) return;
                udfList.value.push({
                    id: 'udf_' + Date.now(),
                    name: udfSubqueryForm.value.name.trim(),
                    type: 'subquery',
                    udfType: udfSubqueryForm.value.udfType,
                    code: udfSubqueryForm.value.code,
                    sql: udfSubqueryForm.value.sql,
                    appliedTableCount: 0,
                    enabled: true
                });
                closeUdfSubqueryModal();
            };
            const toggleUdfEnabled = (udf) => { udf.enabled = !udf.enabled; };
            const deleteUdf = (index) => { udfList.value.splice(index, 1); };

            // ─── 应用表数 hover popover ─────────────────
            const showUdfAppliedTables = ref(null);
            // mock 表列表（按 udf.id 映射）
            const udfAppliedTablesMock = {
                'udf_1': [{ name: 'ks.emp.leave', env: 'online' }, { name: 'ks.hr.user_stats', env: 'pre' }],
                'udf_2': [{ name: 'ks.hr.dept_mapping', env: 'online' }],
                'udf_3': [{ name: 'ks.perm.matrix', env: 'online' }, { name: 'ks.audit.log', env: 'pre' }, { name: 'ks.data.resource', env: 'online' }],
            };
            const getUdfAppliedTables = (udf) => udfAppliedTablesMock[udf.id] || [];

            // ─── 新建函数弹窗 ─────────────────────────
            const showUdfFunctionModal = ref(false);
            const udfFunctionForm = ref({ name: '', code: '', udfType: '行权限', params: [], sql: '' });
            const udfFunctionValidation = ref(null);
            const udfFunctionExecuted = ref(false);
            // 执行时的参数填写弹框
            const showUdfExecParamsModal = ref(false);
            const udfExecParamValues = ref({}); // { paramName: value }

            Vue.watch(() => udfFunctionForm.value.name, (val) => {
                udfFunctionForm.value.code = val.trim().toLowerCase()
                    .replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
            });

            const openUdfFunctionModal = () => {
                udfFunctionForm.value = { name: '', code: '', udfType: '行权限', params: [], sql: '' };
                udfFunctionValidation.value = null;
                udfFunctionExecuted.value = false;
                showUdfFunctionModal.value = true;
            };
            const closeUdfFunctionModal = () => { showUdfFunctionModal.value = false; };

            const addFunctionParam = () => {
                udfFunctionForm.value.params.push({ name: '', type: 'STRING', description: '' });
            };
            const removeFunctionParam = (index) => {
                udfFunctionForm.value.params.splice(index, 1);
            };

            // 点击「执行」：若有参数则先弹参数填写框，否则直接执行
            const executeUdfFunction = () => {
                if (!udfFunctionForm.value.sql.trim()) {
                    udfFunctionValidation.value = { success: false, message: 'SQL 不能为空' };
                    udfFunctionExecuted.value = false;
                    return;
                }
                const params = udfFunctionForm.value.params.filter(p => p.name.trim());
                if (params.length > 0) {
                    // 初始化参数值
                    const vals = {};
                    params.forEach(p => { vals[p.name] = ''; });
                    udfExecParamValues.value = vals;
                    showUdfExecParamsModal.value = true;
                } else {
                    runUdfFunctionExec();
                }
            };

            // 实际执行（模拟）
            const runUdfFunctionExec = () => {
                showUdfExecParamsModal.value = false;
                const isSuccess = Math.random() > 0.2;
                if (isSuccess) {
                    udfFunctionValidation.value = { success: true, message: '执行成功' };
                    udfFunctionExecuted.value = true;
                } else {
                    udfFunctionValidation.value = { success: false, message: '执行失败：未知表名，请检查 SQL 语句' };
                    udfFunctionExecuted.value = false;
                }
            };

            const saveUdfFunction = () => {
                if (!udfFunctionForm.value.name.trim() || !udfFunctionExecuted.value) return;
                udfList.value.push({
                    id: 'udf_fn_' + Date.now(),
                    name: udfFunctionForm.value.name.trim(),
                    type: 'function',
                    udfType: udfFunctionForm.value.udfType,
                    code: udfFunctionForm.value.code,
                    sql: udfFunctionForm.value.sql,
                    params: udfFunctionForm.value.params,
                    appliedTableCount: 0,
                    enabled: true
                });
                closeUdfFunctionModal();
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

            // ==================== 权限中心状态 ====================
            const currentMainView = ref('catalog'); // 'catalog' | 'permission_center'
            const permissionCenterTab = ref('my_applications'); // 'my_applications' | 'my_permissions' | 'my_approval' | 'audit'
            const showApplyFlow = ref(false); // 在「我的申请」页面内展开申请流程
            const viewingAppDetail = ref(null); // 查看申请详情展开（存储 app.id）

            // 当前登录用户角色（mock: 'user' | 'approver' | 'admin'）
            const currentUserRole = ref('admin'); // mock 默认管理员视角

            // 域列表（顶级 CATALOG 节点），用于申请时选域
            const permissionDomains = ref([
                { id: 'domain_hr', name: 'HR人力资源域', description: '人员、组织、绩效、人才等HR核心数据', tableCount: 5 },
                { id: 'domain_sre', name: 'SRE运维域', description: 'SRE运维平台相关数据', tableCount: 3 },
                { id: 'domain_ai', name: 'AI Skills库', description: 'AI技能与模型相关数据', tableCount: 2 },
                { id: 'domain_common', name: '公共资源库', description: '全局公共基础数据', tableCount: 8 }
            ]);

            // 申请步骤状态
            const permissionApplyType = ref(''); // 'standard' | 'custom' | 'copy'
            const permissionApplyStep = ref(1); // 1~6
            const applyMode = ref('new'); // 'new' | 'reapply' | 'renewal'
            const permissionApplyForm = ref({
                domainId: null,
                domainName: '',
                roleId: null,
                roleName: '',
                sensitivityLevel: '',
                selectedTables: [], // [{ id, name, chineseName }]
                tableRowFilters: {}, // { tableId: [{ field, operator, value, valueType }] }
                selectedFields: {}, // 非标用: { tableId: ['field1', ...] }
                validityDays: 90,
                reason: ''
            });

            // 非标申请：已选表列表（多选）
            const customApplySelectedTableIds = ref([]);
            const customApplyCurrentTableId = ref(null);
            const customApplyConfigIndex = ref(0);
            const customApplyFieldSearch = ref({});
            const customApplyTableCategory = ref('全部');
            const customApplyRowPermForm = ref({});
            const selectedRoleIds = ref([]);

            // 单选角色
            const expandedRoleId = ref(null);
            const toggleRoleExpand = (ruleId) => {
                expandedRoleId.value = expandedRoleId.value === ruleId ? null : ruleId;
            };

            // 按表申请：目录展开/收起
            const expandedTableDirs = ref({});
            const toggleTableDir = (dirName) => {
                expandedTableDirs.value[dirName] = !expandedTableDirs.value[dirName];
            };
            const expandAllTableDirs = () => {
                const dirs = {};
                const tables = pcAvailableTables.value || [];
                const catSet = new Set(tables.map(t => t.subCategory || '未分类'));
                catSet.forEach(c => { dirs[c] = true; });
                expandedTableDirs.value = dirs;
            };
            const collapseAllTableDirs = () => {
                expandedTableDirs.value = {};
            };

            // 按表申请：按目录分组的表列表
            const groupedTablesByDir = computed(() => {
                const tables = pcAvailableTables.value || [];
                const filter = customApplyTableCategory.value;
                const filtered = filter === '全部' ? tables : tables.filter(t => t.category === filter);
                const groups = {};
                filtered.forEach(t => {
                    const dir = t.subCategory || '未分类';
                    if (!groups[dir]) groups[dir] = [];
                    groups[dir].push(t);
                });
                return groups;
            });

            // 需要在 permissionCenterColumnPermissionRules 定义之后引用，先占位，后面赋值
            const pcColumnPermissionRules = ref(
                (window.HR_MOCK && window.HR_MOCK.tables) ? (() => {
                    return [
                        { id: 'cpr_1', name: 'OD-基础', sensitivityLevel: 'basic', description: '覆盖员工基础信息和考勤信息，适用于基础组织分析', tableFields: { tbl_hr_emp_all: ['emp_id','emp_code','emp_name','emp_name_en','gender','birth_date','email_corp','mobile','dept_id','dept_name','level_code','level_name','job_title','hire_date','emp_status','emp_type','emp_nature','work_location','work_city','direct_leader_id','direct_leader_name'] } },
                        { id: 'cpr_2', name: 'OD-敏感-职级晋升-低职级', sensitivityLevel: 'sensitive', description: '包含职级晋升数据，适用于E9及以下员工晋升分析', tableFields: { tbl_hr_emp_all: ['emp_id','emp_name','dept_id','dept_name','level_code','level_name','job_family','job_title','hire_date','emp_status','promoted_times','last_level_change_date','last_level_change_type','promotion_year','promotion_result','promote_from_level','promote_to_level','promotion_date'] } },
                        { id: 'cpr_3', name: 'OD-敏感-绩效信息-低职级', sensitivityLevel: 'sensitive', description: '包含员工绩效数据，适用于E9及以下员工绩效分析', tableFields: { tbl_hr_emp_all: ['emp_id','emp_name','dept_id','dept_name','level_code','level_name','emp_status','perf_year','perf_cycle','perf_result','perf_score','perf_rank','perf_rank_pct','calibrated_result'] } },
                        { id: 'cpr_4', name: 'OD-敏感-薪酬信息-低职级', sensitivityLevel: 'high_sensitive', description: '包含员工薪酬数据，适用于E9及以下员工薪酬分析', tableFields: { tbl_hr_emp_all: ['emp_id','emp_name','dept_id','dept_name','level_code','level_name','emp_status','base_salary','base_salary_monthly','annual_salary','annual_ctc','bonus_target_pct','bonus_target_amount','actual_bonus','salary_band'] } },
                        { id: 'cpr_5', name: 'OD-人才盘点-高职级', sensitivityLevel: 'top_sensitive', description: '包含人才盘点和潜力评估数据，仅限E14及以上人员分析', tableFields: { tbl_hr_emp_all: ['emp_id','emp_name','dept_id','dept_name','level_code','level_name','emp_status','talent_pool','talent_tier','high_potential_flag','succession_plan_flag','perf_result','perf_score'] } }
                    ];
                })() : []
            );
            const pcAvailableTables = ref(
                (window.HR_MOCK && window.HR_MOCK.tables) ? window.HR_MOCK.tables : []
            );

            // 申请记录 Mock 数据
            const permissionApplications = ref([
                {
                    id: 'app_001',
                    type: 'standard',
                    roleId: 'cpr_1',
                    roleName: 'OD-基础',
                    sensitivityLevel: 'basic',
                    domainName: 'HR人力资源域',
                    tables: [
                        {
                            tableId: 'tbl_1', tableName: 'ks.emp.base', chineseName: '员工基础信息表',
                            rowFilters: [{ field: 'emp_type', operator: '=', value: '全职', valueType: 'value' }]
                        },
                        {
                            tableId: 'tbl_2', tableName: 'ks.emp.leave', chineseName: '员工休假记录表',
                            rowFilters: []
                        }
                    ],
                    validityDays: 90,
                    expireAt: '2026-09-16',
                    reason: '用于OD人员组织分析项目',
                    status: 'approved',
                    bpmProcessId: 'bpm_20260616_001',
                    approvalNodes: [
                        { name: '初审', status: 'done', approver: '王建国', doneAt: '2026-06-17 09:10' },
                        { name: '系统开通', status: 'done', approver: '系统自动', doneAt: '2026-06-17 09:12' },
                        { name: '终审', status: 'done', approver: '李晓明', doneAt: '2026-06-17 14:30' }
                    ],
                    appliedAt: '2026-06-16',
                    approvedAt: '2026-06-17',
                    applicantId: 'user_001',
                    applicantName: 'Yuzhiyuan'
                },
                {
                    id: 'app_002',
                    type: 'standard',
                    roleId: 'cpr_3',
                    roleName: 'OD-敏感-绩效信息-低职级',
                    sensitivityLevel: 'sensitive',
                    domainName: 'HR人力资源域',
                    tables: [
                        {
                            tableId: 'tbl_1', tableName: 'ks.emp.base', chineseName: '员工基础信息表',
                            rowFilters: [{ field: 'dept_id', operator: '=', value: '${user_dept}', valueType: 'env_var' }]
                        },
                        {
                            tableId: 'tbl_3', tableName: 'ks.performance.review', chineseName: '绩效评估表',
                            rowFilters: [{ field: 'dept_id', operator: '=', value: '${user_dept}', valueType: 'env_var' }]
                        }
                    ],
                    validityDays: 30,
                    expireAt: '2026-07-20',
                    reason: '季度绩效分析',
                    status: 'pending',
                    bpmProcessId: 'bpm_20260618_002',
                    approvalNodes: [
                        { name: '初审', status: 'done', approver: '王建国', doneAt: '2026-06-19 10:00' },
                        { name: '汇报线上级', status: 'current', approver: '张总', doneAt: null },
                        { name: 'OD负责人', status: 'pending', approver: '陈OD', doneAt: null },
                        { name: '系统开通', status: 'pending', approver: '系统自动', doneAt: null },
                        { name: '终审', status: 'pending', approver: '李晓明', doneAt: null }
                    ],
                    appliedAt: '2026-06-18',
                    approvedAt: null,
                    applicantId: 'user_001',
                    applicantName: 'Yuzhiyuan'
                },
                {
                    id: 'app_003',
                    type: 'custom',
                    roleId: null,
                    roleName: '自定义权限',
                    sensitivityLevel: 'high_sensitive',
                    domainName: 'HR人力资源域',
                    tables: [
                        {
                            tableId: 'tbl_5', tableName: 'ks.management.info', chineseName: '管理信息表',
                            fields: ['mgmt_id', 'emp_id', 'mgmt_level', 'authority_level'],
                            rowFilters: [{ field: 'mgmt_level', operator: '<=', value: '3', valueType: 'value' }]
                        }
                    ],
                    validityDays: 180,
                    expireAt: '2025-12-25',
                    reason: '',
                    status: 'expired',
                    bpmProcessId: 'bpm_20250625_003',
                    approvalNodes: [
                        { name: '初审', status: 'done', approver: '王建国', doneAt: '2025-06-26 11:00' },
                        { name: '汇报线上级', status: 'done', approver: '张总', doneAt: '2025-06-26 14:00' },
                        { name: 'OD负责人', status: 'done', approver: '陈OD', doneAt: '2025-06-27 09:00' },
                        { name: '高敏审批人', status: 'done', approver: '董事长办公室', doneAt: '2025-06-27 11:30' },
                        { name: '系统开通', status: 'done', approver: '系统自动', doneAt: '2025-06-27 11:32' },
                        { name: '终审', status: 'done', approver: '李晓明', doneAt: '2025-06-27 16:00' }
                    ],
                    appliedAt: '2025-06-25',
                    approvedAt: '2025-06-27',
                    applicantId: 'user_001',
                    applicantName: 'Yuzhiyuan'
                },
                {
                    id: 'app_004',
                    type: 'standard',
                    roleId: 'cpr_2',
                    roleName: 'OD-敏感-职级晋升-低职级',
                    sensitivityLevel: 'sensitive',
                    domainName: 'HR人力资源域',
                    tables: [
                        {
                            tableId: 'tbl_4', tableName: 'ks.promotion.record', chineseName: '晋升记录表',
                            rowFilters: []
                        }
                    ],
                    validityDays: 30,
                    expireAt: '2026-06-20',
                    reason: '职级晋升数据分析',
                    status: 'approved',
                    bpmProcessId: 'bpm_20260521_004',
                    approvalNodes: [
                        { name: '初审', status: 'done', approver: '王建国', doneAt: '2026-05-22 09:00' },
                        { name: '汇报线上级', status: 'done', approver: '张总', doneAt: '2026-05-22 15:00' },
                        { name: 'OD负责人', status: 'done', approver: '陈OD', doneAt: '2026-05-23 10:00' },
                        { name: '系统开通', status: 'done', approver: '系统自动', doneAt: '2026-05-23 10:02' },
                        { name: '终审', status: 'done', approver: '李晓明', doneAt: '2026-05-23 14:00' }
                    ],
                    appliedAt: '2026-05-21',
                    approvedAt: '2026-05-23',
                    applicantId: 'user_001',
                    applicantName: 'Yuzhiyuan'
                },
                // 其他用户的申请（用于管理员审计视角）
                {
                    id: 'app_005',
                    type: 'standard',
                    roleId: 'cpr_1',
                    roleName: 'OD-基础',
                    sensitivityLevel: 'basic',
                    domainName: 'HR人力资源域',
                    tables: [
                        { tableId: 'tbl_1', tableName: 'ks.emp.base', chineseName: '员工基础信息表', rowFilters: [] },
                        { tableId: 'tbl_2', tableName: 'ks.emp.leave', chineseName: '员工休假记录表', rowFilters: [] }
                    ],
                    validityDays: 90,
                    expireAt: '2026-08-30',
                    reason: '',
                    status: 'approved',
                    bpmProcessId: 'bpm_20260601_005',
                    approvalNodes: [
                        { name: '初审', status: 'done', approver: '王建国', doneAt: '2026-06-02 09:00' },
                        { name: '系统开通', status: 'done', approver: '系统自动', doneAt: '2026-06-02 09:02' },
                        { name: '终审', status: 'done', approver: '李晓明', doneAt: '2026-06-02 14:00' }
                    ],
                    appliedAt: '2026-06-01',
                    approvedAt: '2026-06-02',
                    applicantId: 'user_002',
                    applicantName: 'Zhanghao'
                },
                {
                    id: 'app_006',
                    type: 'standard',
                    roleId: 'cpr_4',
                    roleName: 'OD-敏感-管理信息-低职级',
                    sensitivityLevel: 'high_sensitive',
                    domainName: 'HR人力资源域',
                    tables: [
                        { tableId: 'tbl_5', tableName: 'ks.management.info', chineseName: '管理信息表', rowFilters: [] }
                    ],
                    validityDays: 90,
                    expireAt: '2026-09-10',
                    reason: '管理层数据分析项目',
                    status: 'frozen',
                    frozenAt: '2026-06-15',
                    bpmProcessId: 'bpm_20260611_006',
                    approvalNodes: [
                        { name: '初审', status: 'done', approver: '王建国', doneAt: '2026-06-12 09:00' },
                        { name: '汇报线上级', status: 'done', approver: '张总', doneAt: '2026-06-12 15:00' },
                        { name: 'OD负责人', status: 'done', approver: '陈OD', doneAt: '2026-06-13 10:00' },
                        { name: '高敏审批人', status: 'done', approver: '董事长办公室', doneAt: '2026-06-13 11:00' },
                        { name: '系统开通', status: 'done', approver: '系统自动', doneAt: '2026-06-13 11:02' },
                        { name: '终审', status: 'done', approver: '李晓明', doneAt: '2026-06-13 16:00' }
                    ],
                    appliedAt: '2026-06-11',
                    approvedAt: '2026-06-13',
                    applicantId: 'user_003',
                    applicantName: 'Liwei'
                }
            ]);

            // 我的审批 Mock 数据（需要我审批的单据）
            const myApprovalItems = ref([
                {
                    id: 'approval_001',
                    applicantName: 'Zhanghao',
                    applicantId: 'user_002',
                    roleName: 'OD-基础',
                    sensitivityLevel: 'basic',
                    tables: [{ tableId: 'tbl_1', tableName: 'ks.emp.base' }, { tableId: 'tbl_2', tableName: 'ks.emp.leave' }],
                    appliedAt: '2026-06-01',
                    bpmProcessId: 'bpm_20260601_005',
                    myApprovalStatus: 'pending', // 'pending' | 'approved' | 'rejected'
                    approvalNodeType: '初审'
                },
                {
                    id: 'approval_002',
                    applicantName: 'Liwu',
                    applicantId: 'user_003',
                    roleName: 'OD-敏感-绩效信息-低职级',
                    sensitivityLevel: 'sensitive',
                    tables: [{ tableId: 'tbl_1', tableName: 'ks.emp.base' }, { tableId: 'tbl_3', tableName: 'ks.performance.review' }],
                    appliedAt: '2026-06-14',
                    bpmProcessId: 'bpm_20260614_007',
                    myApprovalStatus: 'approved',
                    approvalNodeType: '初审'
                },
                {
                    id: 'approval_003',
                    applicantName: 'Wangfei',
                    applicantId: 'user_004',
                    roleName: '自定义权限',
                    sensitivityLevel: 'high_sensitive',
                    tables: [{ tableId: 'tbl_5', tableName: 'ks.management.info' }],
                    appliedAt: '2026-06-10',
                    bpmProcessId: 'bpm_20260610_008',
                    myApprovalStatus: 'rejected',
                    approvalNodeType: '终审'
                }
            ]);

            const approvalStatusLabel = (status) => {
                const map = { pending: '待审批', approved: '已通过', rejected: '已拒绝' };
                return map[status] || status;
            };
            const approvalStatusClass = (status) => {
                const map = {
                    pending: 'bg-blue-100 text-blue-700',
                    approved: 'bg-green-100 text-green-700',
                    rejected: 'bg-red-100 text-red-700'
                };
                return map[status] || 'bg-gray-100 text-gray-500';
            };

            // 续签弹窗状态
            const showRenewalModal = ref(false);
            const renewalTarget = ref(null); // 被续签的申请对象
            const renewalValidityDays = ref(90);
            const renewalReason = ref('');

            // 从已有申请填充表单
            const fillFormFromApp = (app) => {
                permissionApplyType.value = app.type || 'standard';
                const domain = permissionDomains.value.find(d => d.name === app.domainName);
                const tableRowFilters = {};
                const selectedFields = {};
                app.tables.forEach(t => {
                    tableRowFilters[t.tableId] = t.rowFilters ? [...t.rowFilters.map(f => ({...f}))] : [];
                    selectedFields[t.tableId] = t.fields ? [...t.fields] : [];
                });
                permissionApplyForm.value = {
                    domainId: domain ? domain.id : null,
                    domainName: app.domainName || '',
                    roleId: app.roleId,
                    roleName: app.type === 'standard' ? app.roleName : '自定义权限',
                    sensitivityLevel: app.sensitivityLevel || '',
                    selectedTables: app.tables.map(t => ({ id: t.tableId, name: t.tableName, chineseName: t.chineseName || '' })),
                    tableRowFilters,
                    selectedFields,
                    validityDays: app.validityDays || 90,
                    reason: app.reason || ''
                };
                customApplySelectedTableIds.value = app.tables.map(t => t.tableId);
            };

            // 重新申请：预填表单，可编辑
            const reApplyPermission = (app) => {
                applyMode.value = 'reapply';
                fillFormFromApp(app);
                renewalTarget.value = app;
                renewalReason.value = '';
                permissionApplyStep.value = 3;
                if (typeof currentMainView !== 'undefined') currentMainView.value = 'permission_center';
                permissionCenterTab.value = 'my_applications';
                showApplyFlow.value = true;
            };

            // 续签：预填表单，只允许修改有效期
            const openRenewalForm = (app) => {
                applyMode.value = 'renewal';
                fillFormFromApp(app);
                renewalTarget.value = app;
                renewalReason.value = '';
                permissionApplyStep.value = 3;
                if (typeof currentMainView !== 'undefined') currentMainView.value = 'permission_center';
                permissionCenterTab.value = 'my_applications';
                showApplyFlow.value = true;
            };

            // 归还确认弹窗
            const showRevokeConfirm = ref(false);
            const revokeTarget = ref(null);

            // 冻结/解冻确认弹窗
            const showFreezeConfirm = ref(false);
            const freezeTarget = ref(null);
            const freezeAction = ref('freeze'); // 'freeze' | 'unfreeze'

            // 权限审计清查：查询状态
            const auditSearchMode = ref('by_person'); // 'by_person' | 'by_table'
            const auditSearchPersonQuery = ref('');
            const auditSearchPersonResult = ref(null);
            const auditSearchDomainId = ref(null);
            const auditSearchTableId = ref(null);
            const auditSearchTableResult = ref([]);

            // 申请权限：步骤流转方法
            const startPermissionApply = (type) => {
                permissionApplyType.value = type || '';
                applyMode.value = 'new';
                permissionApplyStep.value = 1;
                permissionApplyForm.value = {
                    domainId: null, domainName: '', roleId: null, roleName: '', roleNames: '', sensitivityLevel: '',
                    selectedTables: [], tableRowFilters: {}, selectedFields: {}, validityDays: 90, reason: ''
                };
                customApplySelectedTableIds.value = [];
                customApplyCurrentTableId.value = null;
                expandedRoleId.value = null;
                customApplyConfigIndex.value = 0;
                customApplyFieldSearch.value = {};
                customApplyTableCategory.value = '全部';
                customApplyRowPermForm.value = {};
                // 默认展开所有目录
                const dirs = {};
                const tables = pcAvailableTables.value || [];
                const catSet = new Set(tables.map(t => t.subCategory || '未分类'));
                catSet.forEach(c => { dirs[c] = true; });
                expandedTableDirs.value = dirs;
            };

            const selectApplyRoleSingle = (rule) => {
                selectedRoleIds.value = [rule.id];
                permissionApplyForm.value.roleId = rule.id;
                permissionApplyForm.value.roleName = rule.name;
                permissionApplyForm.value.roleNames = rule.name;
                permissionApplyForm.value.sensitivityLevel = rule.sensitivityLevel;
                const tableIds = Object.keys(rule.tableFields);
                permissionApplyForm.value.selectedTables = tableIds.map(tid => {
                    const tbl = pcAvailableTables.value.find(t => t.id === tid);
                    return tbl ? { id: tbl.id, name: tbl.name, chineseName: tbl.chineseName } : { id: tid, name: tid, chineseName: '' };
                });
                const rf = {};
                tableIds.forEach(tid => { rf[tid] = null; });
                permissionApplyForm.value.tableRowFilters = rf;
            };

            const startCustomApplyConfig = () => {
                const selectedTables = pcAvailableTables.value.filter(t => customApplySelectedTableIds.value.includes(t.id));
                permissionApplyForm.value.selectedTables = selectedTables.map(t => ({ id: t.id, name: t.name, chineseName: t.chineseName }));
                selectedTables.forEach(t => {
                    // 默认选中分区字段和唯一键字段
                    const defaultFields = (t.fields || []).filter(f => f.is_partition || f.is_unique_key).map(f => f.name);
                    permissionApplyForm.value.selectedFields[t.id] = defaultFields;
                    customApplyRowPermForm.value[t.id] = { org: [], family: [], channel: [], level: [], workLocation: [], empType: [], empNature: [], contractEntity: '' };
                });
                customApplyConfigIndex.value = 0;
                permissionApplyStep.value = 3;
            };

            const customApplyNextTable = () => {
                const total = permissionApplyForm.value.selectedTables.length;
                if (customApplyConfigIndex.value < total - 1) customApplyConfigIndex.value++;
            };
            const customApplyPrevTable = () => {
                if (customApplyConfigIndex.value > 0) customApplyConfigIndex.value--;
            };

            // 保留兼容
            const toggleApplyPermissionRole = (rule) => { selectApplyRoleSingle(rule); };
            const confirmSelectedRoles = () => {};

            const selectPermissionDomain = (domain) => {
                permissionApplyForm.value.domainId = domain.id;
                permissionApplyForm.value.domainName = domain.name;
            };

            const selectApplyPermissionRole = (rule) => {
                permissionApplyForm.value.roleId = rule.id;
                permissionApplyForm.value.roleName = rule.name;
                permissionApplyForm.value.sensitivityLevel = rule.sensitivityLevel;
                // 预填该角色覆盖的所有表
                const tableIds = Object.keys(rule.tableFields);
                permissionApplyForm.value.selectedTables = tableIds.map(tid => {
                    const tbl = availableTablesForColumnPermission.value.find(t => t.id === tid);
                    return tbl ? { id: tbl.id, name: tbl.name, chineseName: tbl.chineseName } : { id: tid, name: tid, chineseName: '' };
                });
                // 初始化每张表的行规则为空
                const rf = {};
                tableIds.forEach(tid => { rf[tid] = []; });
                permissionApplyForm.value.tableRowFilters = rf;
                permissionApplyStep.value = 3;
            };

            const submitPermissionApplication = () => {
                const form = permissionApplyForm.value;
                const newApp = {
                    id: 'app_' + Date.now(),
                    type: permissionApplyType.value,
                    roleId: form.roleId,
                    roleName: form.roleName || '自定义权限',
                    sensitivityLevel: form.sensitivityLevel,
                    domainName: form.domainName,
                    tables: form.selectedTables.map(t => ({
                        tableId: t.id,
                        tableName: t.name,
                        chineseName: t.chineseName,
                        fields: form.selectedFields[t.id] || [],
                        rowFilters: form.tableRowFilters[t.id] || []
                    })),
                    validityDays: form.validityDays,
                    expireAt: (() => {
                        const d = new Date();
                        d.setDate(d.getDate() + form.validityDays);
                        return d.toISOString().slice(0, 10);
                    })(),
                    reason: form.reason,
                    status: 'pending',
                    bpmProcessId: 'bpm_mock_' + Date.now(),
                    approvalNodes: getSensitivityApprovalNodes(form.sensitivityLevel),
                    appliedAt: new Date().toISOString().slice(0, 10),
                    approvedAt: null,
                    applicantId: 'user_001',
                    applicantName: 'Yuzhiyuan'
                };
                permissionApplications.value.unshift(newApp);
                // 重置表单，返回第一步
                permissionApplyStep.value = 0; // 0 = 提交成功状态
            };

            const getSensitivityApprovalNodes = (level) => {
                const base = [
                    { name: '初审', status: 'current', approver: '王建国', doneAt: null },
                    { name: '系统开通', status: 'pending', approver: '系统自动', doneAt: null },
                    { name: '终审', status: 'pending', approver: '李晓明', doneAt: null }
                ];
                const sensitive = [
                    { name: '初审', status: 'current', approver: '王建国', doneAt: null },
                    { name: '汇报线上级', status: 'pending', approver: '（待定）', doneAt: null },
                    { name: 'OD负责人', status: 'pending', approver: '陈OD', doneAt: null },
                    { name: '系统开通', status: 'pending', approver: '系统自动', doneAt: null },
                    { name: '终审', status: 'pending', approver: '李晓明', doneAt: null }
                ];
                const highSensitive = [...sensitive.slice(0, 3),
                    { name: '高敏审批人', status: 'pending', approver: '董事长办公室', doneAt: null },
                    ...sensitive.slice(3)
                ];
                const topSensitive = [...highSensitive.slice(0, 4),
                    { name: '顶级审批人', status: 'pending', approver: '分管VP', doneAt: null },
                    ...highSensitive.slice(4)
                ];
                if (level === 'basic') return base;
                if (level === 'sensitive') return sensitive;
                if (level === 'high_sensitive') return highSensitive;
                if (level === 'top_sensitive') return topSensitive;
                return base;
            };

            // 添加行规则
            const addPermissionRowFilter = (tableId) => {
                if (!permissionApplyForm.value.tableRowFilters[tableId]) {
                    permissionApplyForm.value.tableRowFilters[tableId] = [];
                }
                permissionApplyForm.value.tableRowFilters[tableId].push({ field: '', operator: '=', value: '', valueType: 'value' });
            };
            const removePermissionRowFilter = (tableId, idx) => {
                permissionApplyForm.value.tableRowFilters[tableId].splice(idx, 1);
            };

            // 续签
            const submitRenewal = () => {
                const app = renewalTarget.value;
                const d = new Date();
                d.setDate(d.getDate() + permissionApplyForm.value.validityDays);
                const newApp = {
                    ...app,
                    id: 'app_renew_' + Date.now(),
                    validityDays: permissionApplyForm.value.validityDays,
                    expireAt: d.toISOString().slice(0, 10),
                    reason: renewalReason.value,
                    status: 'pending',
                    bpmProcessId: 'bpm_renew_' + Date.now(),
                    approvalNodes: getSensitivityApprovalNodes(app.sensitivityLevel),
                    appliedAt: new Date().toISOString().slice(0, 10),
                    approvedAt: null,
                    isRenewal: true,
                    renewedFromId: app.id
                };
                permissionApplications.value.unshift(newApp);
                permissionApplyStep.value = 0;
                applyMode.value = 'new';
            };

            // 归还
            const openRevokeConfirm = (app) => {
                revokeTarget.value = app;
                showRevokeConfirm.value = true;
            };
            const confirmRevoke = () => {
                revokeTarget.value.status = 'revoked';
                revokeTarget.value.revokedAt = new Date().toISOString().slice(0, 10);
                showRevokeConfirm.value = false;
                revokeTarget.value = null;
            };

            // 撤销申请
            const cancelApplication = (app) => {
                if (app.status === 'pending') {
                    app.status = 'cancelled';
                }
            };

            // 冻结/解冻
            const openFreezeConfirm = (app, action) => {
                freezeTarget.value = app;
                freezeAction.value = action;
                showFreezeConfirm.value = true;
            };
            const confirmFreezeAction = () => {
                if (freezeAction.value === 'freeze') {
                    freezeTarget.value.status = 'frozen';
                    freezeTarget.value.frozenAt = new Date().toISOString().slice(0, 10);
                } else {
                    const app = freezeTarget.value;
                    const today = new Date().toISOString().slice(0, 10);
                    app.status = app.expireAt < today ? 'expired' : 'approved';
                    app.frozenAt = null;
                }
                showFreezeConfirm.value = false;
                freezeTarget.value = null;
            };

            // 审计：按人搜索
            const auditSearchByPerson = () => {
                const q = auditSearchPersonQuery.value.trim().toLowerCase();
                if (!q) return;
                const found = permissionApplications.value.filter(a =>
                    a.applicantName.toLowerCase().includes(q) || a.applicantId.toLowerCase().includes(q)
                );
                auditSearchPersonResult.value = found;
            };

            // 审计：按表搜索
            const auditSearchByTable = () => {
                if (!auditSearchTableId.value) return;
                const tid = auditSearchTableId.value;
                const found = permissionApplications.value.filter(a =>
                    ['approved', 'frozen'].includes(a.status) &&
                    a.tables.some(t => t.tableId === tid)
                );
                auditSearchTableResult.value = found;
            };

            // 辅助：敏感等级 label
            const sensitivityLevelLabel = (level) => {
                const map = { basic: '基础', sensitive: '敏感', high_sensitive: '高敏', top_sensitive: '极高敏' };
                return map[level] || level || '—';
            };
            const sensitivityLevelClass = (level) => {
                const map = { basic: 'bg-green-100 text-green-700', sensitive: 'bg-yellow-100 text-yellow-700', high_sensitive: 'bg-orange-100 text-orange-700', top_sensitive: 'bg-red-100 text-red-700' };
                return map[level] || 'bg-gray-100 text-gray-500';
            };

            // 申请状态 label
            const appStatusLabel = (status) => {
                const map = { pending: '审批中', approved: '已通过', rejected: '已拒绝', expired: '已过期', revoked: '已归还', frozen: '已冻结', cancelled: '已撤销' };
                return map[status] || status;
            };
            const appStatusClass = (status) => {
                const map = {
                    pending: 'bg-blue-100 text-blue-700',
                    approved: 'bg-green-100 text-green-700',
                    rejected: 'bg-red-100 text-red-700',
                    expired: 'bg-gray-100 text-gray-500',
                    revoked: 'bg-gray-100 text-gray-500',
                    frozen: 'bg-orange-100 text-orange-700',
                    cancelled: 'bg-gray-100 text-gray-400'
                };
                return map[status] || 'bg-gray-100 text-gray-500';
            };

            // 计算剩余天数
            const daysUntilExpiry = (expireAt) => {
                if (!expireAt) return null;
                const diff = Math.ceil((new Date(expireAt) - new Date()) / (1000 * 60 * 60 * 24));
                return diff;
            };
            // ==================== 权限中心状态 END ====================
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
                // 离开二级业务域时，若停在分类管理 Tab 则回退到资源树
                const root = catalogTree.value[0];
                const isSecondary = node && node.type === 'CATALOG' && root && root.children &&
                    root.children.some(c => c.id === node.id);
                if (!isSecondary && catalogActiveTab.value === 'categories') {
                    catalogActiveTab.value = 'resources';
                }
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

            const toggleCreateAssetTable = (table) => {
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
                selectedValidityType.value = 'permanent';
                validityStartDate.value = '';
                validityEndDate.value = '';
            };

            const closeAddPermissionDialog = () => {
                showAddPermissionDialog.value = false;
                userSearchQuery.value = '';
                selectedUser.value = null;
                selectedPermissionRole.value = 'viewer';
                selectedValidityType.value = 'permanent';
                validityStartDate.value = '';
                validityEndDate.value = '';
            };

            const selectUser = (user) => {
                selectedUser.value = user;
            };

            const selectPermissionRole = (role) => {
                selectedPermissionRole.value = role;
            };

            const selectValidityType = (type) => {
                selectedValidityType.value = type;
                if (type === 'permanent' || type === '30d' || type === '90d' || type === '180d') {
                    validityStartDate.value = '';
                    validityEndDate.value = '';
                }
                if (type === 'custom') {
                    validityStartDate.value = new Date().toISOString().split('T')[0];
                    validityEndDate.value = '';
                }
            };

            const confirmAddPermission = () => {
                if (!selectedUser.value) {
                    alert('请选择用户');
                    return;
                }

                // 确定有效期数据
                let validityType = selectedValidityType.value;
                let expiryDate = null;

                if (validityType === 'permanent') {
                    expiryDate = null;
                } else if (validityType === '30d' || validityType === '90d' || validityType === '180d') {
                    expiryDate = computedExpiryDate.value;
                    validityType = 'custom'; // 快捷选择最终存为 custom 类型
                } else if (validityType === 'custom') {
                    if (!validityEndDate.value) {
                        alert('请选择截止时间');
                        return;
                    }
                    if (validityStartDate.value && validityEndDate.value && new Date(validityEndDate.value) <= new Date(validityStartDate.value)) {
                        alert('截止时间必须大于开始时间');
                        return;
                    }
                    expiryDate = validityEndDate.value;
                }

                // 添加新权限
                currentPermissions.value.push({
                    id: Date.now(),
                    name: selectedUser.value.name,
                    email: selectedUser.value.email,
                    role: selectedPermissionRole.value,
                    avatar: selectedUser.value.avatar,
                    validityType: validityType === 'permanent' ? 'permanent' : 'custom',
                    expiryDate: expiryDate
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

            // ─── 合并行权限规则（标签规则 + 子查询） ───────────
            const mergedRowRules = Vue.computed(() => {
                const tagRules = globalAuthRules.value.map(rule => ({
                    id: rule.id,
                    name: rule.name,
                    ruleType: 'tag_rule',
                    preview: (rule.rowFilters && rule.rowFilters.length > 0)
                        ? rule.rowFilters.map(f => `${f.field} ${f.operator} ${f.valueType === 'env_var' ? '{' + f.value + '}' : f.value}`)
                        : rule.tags || [],
                    previewIsConditions: (rule.rowFilters && rule.rowFilters.length > 0),
                    appliedTableCount: rule.appliedTables?.length || 0,
                    appliedTableList: rule.appliedTables || [],
                    enabled: rule.enabled,
                    // 保留原始数据引用以便编辑
                    _original: rule,
                    _originalType: 'globalAuthRule'
                }));
                const subqueryRules = udfList.value.map(udf => ({
                    id: udf.id,
                    name: udf.name,
                    ruleType: 'subquery',
                    preview: udf.sql || '',
                    appliedTableCount: udf.appliedTableCount || getUdfAppliedTables(udf).length,
                    appliedTableList: getUdfAppliedTables(udf),
                    enabled: udf.enabled,
                    // 保留原始数据引用以便编辑
                    _original: udf,
                    _originalType: 'udf'
                }));
                return [...tagRules, ...subqueryRules];
            });

            // ─── 合并行权限规则编辑 ───────────
            const showRowRuleEditModal = ref(false);
            const editingRowRule = ref({ name: '', ruleType: 'subquery', sql: '', code: '', rowFilters: [], conditionLogic: '', enabled: true });
            const editingRowRuleIndex = ref(-1);
            const rowRuleSqlValidation = ref(null);
            const rowRuleSqlExecuted = ref(false);

            Vue.watch(() => editingRowRule.value.name, (val) => {
                if (editingRowRule.value.ruleType === 'subquery' && editingRowRuleIndex.value === -1) {
                    editingRowRule.value.code = val.trim().toLowerCase()
                        .replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
                }
            });

            const openRowRuleEdit = (index) => {
                editingRowRuleIndex.value = index;
                if (index === -1) {
                    // 新建
                    editingRowRule.value = { name: '', ruleType: 'subquery', sql: '', code: '', rowFilters: [], conditionLogic: '', enabled: true };
                    rowRuleSqlValidation.value = null;
                    rowRuleSqlExecuted.value = false;
                } else {
                    // 编辑：根据合并列表中的规则类型还原原始数据
                    const mergedRule = mergedRowRules.value[index];
                    if (mergedRule.ruleType === 'tag_rule') {
                        const original = mergedRule._original;
                        editingRowRule.value = {
                            name: original.name,
                            ruleType: 'tag_rule',
                            tags: original.tags || [],
                            rowFilters: JSON.parse(JSON.stringify(original.rowFilters || [])),
                            conditionLogic: original.conditionLogic || '',
                            enabled: original.enabled,
                            _originalType: 'globalAuthRule',
                            _originalIndex: globalAuthRules.value.indexOf(original)
                        };
                        rowRuleSqlValidation.value = null;
                        rowRuleSqlExecuted.value = false;
                    } else if (mergedRule.ruleType === 'subquery') {
                        const original = mergedRule._original;
                        editingRowRule.value = {
                            name: original.name,
                            ruleType: 'subquery',
                            code: original.code,
                            sql: original.sql,
                            enabled: original.enabled,
                            _originalType: 'udf',
                            _originalIndex: udfList.value.indexOf(original)
                        };
                        rowRuleSqlValidation.value = null;
                        rowRuleSqlExecuted.value = false;
                    }
                }
                showRowRuleEditModal.value = true;
            };

            const closeRowRuleEdit = () => {
                showRowRuleEditModal.value = false;
                editingRowRule.value = { name: '', ruleType: 'subquery', sql: '', code: '', rowFilters: [], conditionLogic: '', enabled: true };
                editingRowRuleIndex.value = -1;
                rowRuleSqlValidation.value = null;
                rowRuleSqlExecuted.value = false;
            };

            const executeRowRuleSql = () => {
                if (!editingRowRule.value.sql.trim()) {
                    rowRuleSqlValidation.value = { success: false, message: 'SQL 不能为空' };
                    rowRuleSqlExecuted.value = false;
                    return;
                }
                const isSuccess = Math.random() > 0.2;
                if (isSuccess) {
                    rowRuleSqlValidation.value = { success: true, message: '执行成功' };
                    rowRuleSqlExecuted.value = true;
                } else {
                    rowRuleSqlValidation.value = { success: false, message: '执行失败：未知的表名，请检查 SQL 语句' };
                    rowRuleSqlExecuted.value = false;
                }
            };

            const addRowRuleRowFilter = () => {
                if (!editingRowRule.value.rowFilters) {
                    editingRowRule.value.rowFilters = [];
                }
                editingRowRule.value.rowFilters.push({
                    field: '',
                    operator: '=',
                    value: '',
                    valueType: 'literal'
                });
            };

            const removeRowRuleRowFilter = (index) => {
                editingRowRule.value.rowFilters.splice(index, 1);
            };

            const saveRowRuleEdit = () => {
                if (!editingRowRule.value.name.trim()) return;
                if (editingRowRule.value.ruleType === 'subquery' && !rowRuleSqlExecuted.value) return;

                if (editingRowRuleIndex.value === -1) {
                    // 新建
                    if (editingRowRule.value.ruleType === 'subquery') {
                        udfList.value.push({
                            id: 'udf_' + Date.now(),
                            name: editingRowRule.value.name.trim(),
                            type: 'subquery',
                            udfType: '行权限',
                            code: editingRowRule.value.code,
                            sql: editingRowRule.value.sql,
                            appliedTableCount: 0,
                            enabled: editingRowRule.value.enabled
                        });
                    } else if (editingRowRule.value.ruleType === 'tag_rule') {
                        globalAuthRules.value.push({
                            id: 'global_rule_' + Date.now(),
                            name: editingRowRule.value.name.trim(),
                            tags: editingRowRule.value.tags || [],
                            targetAudience: { type: 'role', value: '' },
                            rowFilters: editingRowRule.value.rowFilters || [],
                            conditionLogic: editingRowRule.value.conditionLogic || '',
                            columnVisibility: { mode: 'all', fields: [] },
                            appliedTables: [],
                            enabled: editingRowRule.value.enabled
                        });
                    }
                } else {
                    // 编辑：根据规则类型更新对应的数据源
                    const mergedRule = mergedRowRules.value[editingRowRuleIndex.value];
                    if (editingRowRule.value.ruleType === 'tag_rule') {
                        const originalIndex = mergedRule._originalType === 'globalAuthRule'
                            ? globalAuthRules.value.indexOf(mergedRule._original)
                            : -1;
                        if (originalIndex > -1) {
                            globalAuthRules.value[originalIndex].name = editingRowRule.value.name.trim();
                            globalAuthRules.value[originalIndex].rowFilters = editingRowRule.value.rowFilters || [];
                            globalAuthRules.value[originalIndex].conditionLogic = editingRowRule.value.conditionLogic || '';
                            globalAuthRules.value[originalIndex].enabled = editingRowRule.value.enabled;
                        }
                    } else if (editingRowRule.value.ruleType === 'subquery') {
                        const originalIndex = mergedRule._originalType === 'udf'
                            ? udfList.value.indexOf(mergedRule._original)
                            : -1;
                        if (originalIndex > -1) {
                            udfList.value[originalIndex].name = editingRowRule.value.name.trim();
                            udfList.value[originalIndex].sql = editingRowRule.value.sql;
                            udfList.value[originalIndex].enabled = editingRowRule.value.enabled;
                        }
                    }
                }
                closeRowRuleEdit();
            };

            const toggleMergedRowRuleEnabled = (rule) => {
                rule._original.enabled = !rule._original.enabled;
            };

            const deleteMergedRowRule = (index) => {
                const mergedRule = mergedRowRules.value[index];
                if (confirm('确定要删除这个行权限规则吗？')) {
                    if (mergedRule._originalType === 'globalAuthRule') {
                        const originalIndex = globalAuthRules.value.indexOf(mergedRule._original);
                        if (originalIndex > -1) globalAuthRules.value.splice(originalIndex, 1);
                    } else if (mergedRule._originalType === 'udf') {
                        const originalIndex = udfList.value.indexOf(mergedRule._original);
                        if (originalIndex > -1) udfList.value.splice(originalIndex, 1);
                    }
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

            // 左侧目录树：文件夹聚焦（不用下拉框，用 TreeItem 上的聚焦按钮）
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

            // ============ BOT DRAWER ============
            const showBotDrawer = ref(false);
            const botMessages = ref([]);
            const botInputText = ref('');
            const botIsLoading = ref(false);
            const showPresetCard = ref(false);
            const presetCardQuestion = ref('');
            const botAgentType = ref('lumos');
            const botPresetQuestion = ref('');
            const botMessagesRef = ref(null);

            const scrollBotToBottom = () => {
                Vue.nextTick(() => {
                    const el = botMessagesRef.value;
                    if (el) el.scrollTop = el.scrollHeight;
                });
            };

            const { reactive: botReactive } = Vue;

            const addBotMessage = (msg) => {
                // 用 reactive 包裹，确保嵌套属性变化可以被 Vue 追踪
                const reactiveMsg = botReactive(msg);
                botMessages.value.push(reactiveMsg);
                scrollBotToBottom();
                return reactiveMsg;
            };

            const sleep = (ms) => new Promise(r => setTimeout(r, ms));

            const typeText = async (msgObj, text) => {
                const chars = text.split('');
                for (const ch of chars) {
                    msgObj.content = (msgObj.content || '') + ch;
                    scrollBotToBottom();
                    await sleep(18);
                }
            };

            const runBotFlow = async (question) => {
                botIsLoading.value = true;

                // 1. 用户消息
                addBotMessage({ role: 'user', content: '[' + botAgentType.value.toUpperCase() + '] ' + question });

                // 2. assistant 思考气泡 —— reactive 对象，后续修改可被追踪
                const assistantMsg = addBotMessage({ role: 'assistant', isThinking: true, toolCalls: [], content: '' });
                await sleep(600);

                const isAge = question.includes('年龄') || question.includes('分布');

                // 工具调用序列
                const toolSeqs = isAge ? [
                    { icon: 'ph-magnifying-glass', label: '检索知识库文档索引', result: '找到 3 个相关文档片段（召回率 0.87）' },
                    { icon: 'ph-database', label: '查询员工数据库 (ks.emp.leave)', result: 'SELECT age, dept FROM employees WHERE dept = "企业应用部"\n→ 返回 142 行数据' },
                    { icon: 'ph-chart-bar', label: '计算年龄分布区间', result: '20-25岁: 18人 | 26-30岁: 43人 | 31-35岁: 51人\n36-40岁: 22人 | 41岁+: 8人' },
                    { icon: 'ph-file-text', label: '生成分析报告', result: '平均年龄 31.4 岁，主力区间 31-35 岁（35.9%）' }
                ] : [
                    { icon: 'ph-magnifying-glass', label: '向量化查询召回', result: 'Query: "' + question + '"\nTop-3 chunks 相似度: 0.92 / 0.88 / 0.81' },
                    { icon: 'ph-sort-ascending', label: 'Rerank 精排打分', result: 'Rerank 模型: bge-reranker-v2\n精排后最优 chunk 得分: 0.94' },
                    { icon: 'ph-file-text', label: '生成召回结果摘要', result: '命中文档: 开发环境配置指南 (wiki_common_101)\n摘要: 文档涵盖开发环境搭建流程...' }
                ];

                assistantMsg.isThinking = false;

                for (const tc of toolSeqs) {
                    // toolCall 也用 reactive，使 status/result 变化可追踪
                    const toolCall = botReactive({ icon: tc.icon, label: tc.label, status: 'running', result: '' });
                    assistantMsg.toolCalls.push(toolCall);
                    scrollBotToBottom();
                    await sleep(900 + Math.random() * 400);
                    toolCall.status = 'done';
                    toolCall.result = tc.result;
                    scrollBotToBottom();
                    await sleep(300);
                }

                await sleep(400);

                // 最终回复
                const agentName = botAgentType.value.toUpperCase();
                const finalText = isAge
                    ? '✅ 企业应用部年龄分布分析完成（Agent: ' + agentName + '）\n\n📊 分布详情：\n• 20-25岁：18人（12.7%）\n• 26-30岁：43人（30.3%）\n• 31-35岁：51人（35.9%）⭐ 主力区间\n• 36-40岁：22人（15.5%）\n• 41岁+：8人（5.6%）\n\n📈 平均年龄：31.4 岁，团队以 30-35 岁骨干为主，整体偏年轻化。'
                    : '✅ 文档召回测试完成（Agent: ' + agentName + '）\n\n📄 召回结果：\n命中文档「开发环境配置指南」(wiki_common_101)\n\n🔍 召回指标：\n• Top-1 相似度：0.92（优秀）\n• Rerank 精排分：0.94\n• 召回耗时：约 180ms\n\n💡 结论：文档已成功建立索引，召回质量良好，可正常为 Agent 提供上下文。';

                await typeText(assistantMsg, finalText);
                botIsLoading.value = false;
            };

            const selectPresetQuestion = (question) => {
                botPresetQuestion.value = question;
                showPresetCard.value = true;
                scrollBotToBottom();
            };

            const submitPresetQuestion = async () => {
                if (botIsLoading.value) return;
                showPresetCard.value = false;
                await runBotFlow(botPresetQuestion.value);
            };

            const sendBotMessage = async () => {
                const text = botInputText.value.trim();
                if (!text || botIsLoading.value) return;
                botInputText.value = '';
                if (text.includes('召回') || text.includes('文档') || text.includes('年龄') || text.includes('分布')) {
                    selectPresetQuestion(text);
                } else {
                    addBotMessage({ role: 'user', content: text });
                    botIsLoading.value = true;
                    await sleep(600);
                    const replyMsg = addBotMessage({ role: 'assistant', isThinking: true, toolCalls: [], content: '' });
                    await sleep(800);
                    replyMsg.isThinking = false;
                    await typeText(replyMsg, '收到您的问题「' + text + '」，我可以帮您测试文档召回或计算数据分析。\n\n试试发送：\n• "测试一下文档的召回"\n• "帮我算一下企业应用部年龄分布"');
                    botIsLoading.value = false;
                }
            };
            // ============ END BOT DRAWER ============

            // ==================== provide 权限中心上下文给子组件 ====================
            Vue.provide('permissionCenterContext', {
                permissionCenterTab, currentUserRole, permissionDomains,
                showApplyFlow, viewingAppDetail, viewingAppDetail,
                applyMode,
                permissionApplyType, permissionApplyStep, permissionApplyForm,
                permissionApplications,
                myApprovalItems, approvalStatusLabel, approvalStatusClass,
                customApplySelectedTableIds, customApplyCurrentTableId,
                customApplyConfigIndex, customApplyFieldSearch, customApplyTableCategory, customApplyRowPermForm,
                showRenewalModal, renewalTarget, renewalValidityDays, renewalReason,
                showRevokeConfirm, revokeTarget,
                showFreezeConfirm, freezeTarget, freezeAction,
                auditSearchMode, auditSearchPersonQuery, auditSearchPersonResult,
                auditSearchDomainId, auditSearchTableId, auditSearchTableResult,
                availableTablesForColumnPermission: pcAvailableTables, columnPermissionRules: pcColumnPermissionRules,
                startPermissionApply, selectPermissionDomain, selectApplyPermissionRole,
                toggleApplyPermissionRole, confirmSelectedRoles, selectedRoleIds,
                expandedRoleId, toggleRoleExpand, selectApplyRoleSingle,
                expandedTableDirs, toggleTableDir, expandAllTableDirs, collapseAllTableDirs, groupedTablesByDir,
                startCustomApplyConfig, customApplyNextTable, customApplyPrevTable,
                submitPermissionApplication,
                addPermissionRowFilter, removePermissionRowFilter,
                openRenewalForm, reApplyPermission, submitRenewal,
                openRevokeConfirm, confirmRevoke,
                cancelApplication,
                openFreezeConfirm, confirmFreezeAction,
                auditSearchByPerson, auditSearchByTable,
                sensitivityLevelLabel, sensitivityLevelClass,
                appStatusLabel, appStatusClass, daysUntilExpiry,
                getSensitivityApprovalNodes
            });

            return {
                catalogTree, selectedNode, catalogActiveTab, resourceTypeFilter, filteredChildren, selectNode, handleRenameNode, toggleNode,
                isSecondaryDomainCatalog,
                getNodeIcon, getColor, getBgColor, getTypeLabel,
                sidebarTypeFilter, sidebarSearchQuery,
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
                // 合并行权限规则
                mergedRowRules, showRowRuleEditModal, editingRowRule, editingRowRuleIndex,
                rowRuleSqlValidation, rowRuleSqlExecuted,
                openRowRuleEdit, closeRowRuleEdit, executeRowRuleSql, saveRowRuleEdit,
                addRowRuleRowFilter, removeRowRuleRowFilter,
                toggleMergedRowRuleEnabled, deleteMergedRowRule,
                // UDF
                rulesSubTab, udfList, showUdfSubqueryModal, udfSubqueryForm, udfSubqueryValidation, udfSubqueryExecuted,
                openUdfSubqueryModal, closeUdfSubqueryModal, executeUdfSql, saveUdfSubquery,
                showPermissionPointSubqueryModal, permissionPointNewSubqueryForm,
                closePermissionPointSubqueryModal, savePermissionPointSubquery,
                toggleUdfEnabled, deleteUdf, openUdfFunctionModal,
                showUdfAppliedTables, getUdfAppliedTables,
                showUdfFunctionModal, udfFunctionForm, udfFunctionValidation, udfFunctionExecuted,
                closeUdfFunctionModal, addFunctionParam, removeFunctionParam, executeUdfFunction, saveUdfFunction,
                showUdfExecParamsModal, udfExecParamValues, runUdfFunctionExec,
                // 分类
                classificationTree,
                classificationOptions,
                // 列权限规则
                permissionPointTree,
                columnPermissionRules, selectedColumnRule,
                showColumnRuleModal, editingColumnRule, editingColumnRuleIndex,
                openColumnRuleEdit, closeColumnRuleEdit, saveColumnRule, deleteColumnRule, deleteColumnRuleDirect,
                toggleColumnRuleEnabled, getColRulePermissionPointNames, getColRuleTableFieldPreview, showColRuleAppliedTables,
                availableTablesForColumnPermission,
                colRuleTableSearch, colRuleTableSelectOpen, colRuleFieldGroupMode,
                selectedTableIdsForColRule, selectedTablesForColRule, colRuleFilteredTableOptions,
                selectTableForColRule, removeSelectedTableForColRule, getColRuleFieldGroups,
                isColRuleGroupFullyChecked, isColRuleGroupIndeterminate, toggleColRuleGroupSelection,
                isTableFullyChecked, isTableIndeterminate, toggleTableSelection, toggleFieldSelection, getTotalSelectedFieldCount, getSelectedTableCount,
                colRuleSelectedTableId, colRuleViewMode, colRuleShowCategory, colRuleShowSelected, colRuleGlobalCategoryFilters, colRuleTableFilters, colRuleFieldFilters, colRuleFilterSearch, colRuleFilterSearchFocused, colRuleResourceType, colRuleResourceTypeDropdownOpen,
                getAllCategories, getCategoriesForTable,
                getFilterDropdownOptions, addFilterCondition, removeFilterCondition, clearAllFilterConditions, hasAnyFilterCondition, getAllFilterConditions, finishFilterSearch,
                getFlatFieldsForTable, getDisplayFieldsForTable,
                isFilterCategoryFullyChecked, isFilterCategoryIndeterminate,
                expandedTablesForColRule, expandedPPsForColRule, colRuleFieldSearchQueries,
                toggleTableExpandForColRule, togglePPExpandForColRule,
                filteredTablesForColRule, filteredPPGroupsForColRule,
                isPPFullyCheckedForColRule, isPPIndeterminateForColRule, togglePPForColRule,
                isTableFullyCheckedInPP, isTableIndeterminateInPP, toggleTableForPPInColRule,
                showAddResourcePointModal, addingResourcePoints,
                openAddResourcePointModal, closeAddResourcePointModal, saveAddedResourcePoints,
                isAddResourceParentFullyChecked, isAddResourceParentIndeterminate, toggleAddResourceParent, toggleAddResourcePoint,
                // 权限点树内新增/重命名（资源点弹窗）
                showNewParentInput, showAddParentInput, addPermissionPointParent, cancelAddParent,
                newParentName, newChildName, addingChildToParentId, addChildToParent, confirmAddChild, cancelAddChild,
                renamingNodeId, renamingNodeName, renamingNodeType,
                startRenameNode, confirmRenameNode, cancelRenameNode, deletePermissionPointNode,
                // 批量新增
                showBatchImportModal, showBatchImportView, batchImportSource, batchImportFile, batchImportPreview,
                openBatchImportModal, closeBatchImportModal, exitBatchImportView, handleBatchImportFile, confirmBatchImport,
                // 规则名称/描述编辑
                editingRuleName, editingRuleNameValue, startEditRuleName, confirmEditRuleName, cancelEditRuleName,
                editingRuleDescription, editingRuleDescriptionValue, startEditRuleDescription, confirmEditRuleDescription, cancelEditRuleDescription,
                // 更新表字段弹窗
                showAddTableFieldModal, addTableFieldSearchQuery, addFieldSelectedFields, addTableFieldViewMode,
                expandedTablesForAddField, expandedPPsForAddField,
                toggleTableExpandForAddField, togglePPExpandForAddField,
                openAddTableFieldModalWithExisting,
                filteredAvailableTablesForAddField, filteredPermissionPointGroupsForAddField,
                isFieldMatchSearch,
                isTableFullyCheckedForAddField, isTableIndeterminateForAddField, getSelectedFieldCountForAddField,
                toggleTableForAddField, toggleFieldForAddField,
                getTotalSelectedFieldCountForAddField, getSelectedTableCountForAddField, confirmAddTableField,
                getFieldsGroupedByPermissionPoint, getPermissionPointCountForTable,
                getFieldsForTableAndPP, getFieldsGroupedByCategory,
                isCategoryFullyChecked, isCategoryIndeterminate, toggleCategorySelection,
                getSelectedTablesForColRule, getSelectedFieldsForTable, getSelectedFieldsForTableFiltered,
                isPermissionPointFullyCheckedForAddField, isPermissionPointIndeterminateForAddField,
                getSelectedFieldCountForPPForAddField, togglePermissionPointForAddField,
                navigateToTableDetail,
                showCreateDataAssetWizard, createDataAssetStep, createDataAssetMethod,
                createDataAssetForm, dataSourceTables,
                selectCreateMethod, goBackCreateWizard, closeCreateWizard, previewCreateView, saveCreateDataAsset,
                toggleCreateAssetTable, isTableSelected, updateFieldDescription, updateViewFieldDescription, proceedToFinalStep,
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
                selectedValidityType, validityStartDate, validityEndDate, computedExpiryDate,
                currentPermissions, inheritedPermissions, availableUsers, filteredUsers,
                openAddPermissionDialog, closeAddPermissionDialog, selectUser, selectPermissionRole, selectValidityType,
                confirmAddPermission, removePermission, getRoleLabel, getRoleBadgeClass,
                // 编辑资源
                showEditNodeModal, editNodeForm, eligibleCatalogs, topLevelCatalogName,
                openEditNodeModal, saveEditNode,

                // 子查询相关
                showCreateSubqueryModal, subqueryForm, subqueryValidation, subqueries,
                openCreateSubqueryModal, closeCreateSubqueryModal, validateSubquerySql, saveSubquery,
                toggleGlobalRuleSubqueryDropdown, updateGlobalRuleSubquerySearch, selectGlobalRuleSubquery,

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
                addGlobalTag: window.App.addGlobalTag,
                // Bot 对话抽屉
                showBotDrawer, botMessages, botInputText, botIsLoading,
                showPresetCard, botAgentType, botPresetQuestion, botMessagesRef,
                selectPresetQuestion, submitPresetQuestion, sendBotMessage,

                // 权限中心
                currentMainView, permissionCenterTab, currentUserRole,
                showApplyFlow,
                applyMode,
                permissionDomains, permissionApplyType, permissionApplyStep, permissionApplyForm,
                customApplySelectedTableIds, customApplyCurrentTableId,
                permissionApplications,
                myApprovalItems, approvalStatusLabel, approvalStatusClass,
                showRenewalModal, renewalTarget, renewalValidityDays, renewalReason,
                showRevokeConfirm, revokeTarget,
                showFreezeConfirm, freezeTarget, freezeAction,
                auditSearchMode, auditSearchPersonQuery, auditSearchPersonResult,
                auditSearchDomainId, auditSearchTableId, auditSearchTableResult,
                startPermissionApply, selectPermissionDomain, selectApplyPermissionRole,
                submitPermissionApplication,
                addPermissionRowFilter, removePermissionRowFilter,
                openRenewalForm, reApplyPermission, submitRenewal,
                openRevokeConfirm, confirmRevoke,
                cancelApplication,
                openFreezeConfirm, confirmFreezeAction,
                auditSearchByPerson, auditSearchByTable,
                sensitivityLevelLabel, sensitivityLevelClass,
                appStatusLabel, appStatusClass, daysUntilExpiry,
                getSensitivityApprovalNodes
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

    // 注册权限中心组件
    if (window.AppTemplates && window.AppTemplates.PermissionCenter) {
        app.component('PermissionCenter', {
            name: 'PermissionCenter',
            setup() {
                const ctx = Vue.inject('permissionCenterContext');
                return ctx;
            },
            template: window.AppTemplates.PermissionCenter
        });
    }

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
    app.component('CategoryManagement', CategoryManagement);
    app.component('CreateDataAssetWizard', CreateDataAssetWizard);

    app.mount('#app');
})();
