
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
                associatedTags: ['PII 个人信息/性别']
            }
        });

        // 数据资产版本数据（统一版本管理）
        const dataAssetVersions = ref({
            data_202: {
                id: 'data_202',
                currentVersion: 'v1',
                versions: [
                    {
                        version: 'v1',
                        status: 'published',
                        publishedAt: '2024-01-10',
                        publishedBy: 'data_admin',
                        schema: 'current', // 表示使用 DetailData 组件中的当前 schema
                        authRules: 'current' // 表示使用 DetailData 组件中的当前 authRules
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
                    { id: 'data_202', name: '员工休假记录表' },
                    { id: 'data_500', name: '用户画像表' }
                ]
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
                    { id: 'data_202', name: '员工休假记录表' }
                ]
            }
        ]);
        const showGlobalRuleEdit = ref(false);
        const editingGlobalRule = ref(null);
        const editingGlobalRuleIndex = ref(-1);
        const showAppliedTables = ref(null);
        const showAudienceDropdown = ref(false);
        const showSearchDropdown = ref(false);
        const searchActiveTab = ref('ALL');
        const showCreateDataAssetWizard = ref(false);
        const createDataAssetStep = ref(1); // 1: 选择方式, 2: 填写表单, 3: 预览
        const createDataAssetMethod = ref(null); // 'VIEW', 'ONLINE', 'EXCEL'

        // 创建数据资产的数据
        const createDataAssetForm = ref({
            // 通用字段
            name: '',
            description: '',
            targetCatalog: null,

            // 方式1: 从已有数据资产构建新视图
            viewSql: '',

            // 方式2: 从生产环境接入
        });
    }
});
}) ();
