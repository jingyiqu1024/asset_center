// Define global namespace
window.App = window.App || {};
window.App.MockData = {};

window.App.MockData.catalog = [
    {
        id: "root_common",
        name: "公共资源库",
        type: "CATALOG",
        isOpen: true,
        children: [
            { id: "wiki_common_101", name: "开发环境配置指南", type: "RESOURCE", resourceType: "DOCUMENT" },
            { id: "data_500_common", name: "各办事处地址簿", type: "RESOURCE", resourceType: "DATA_ASSET" },
            { id: "data_upload_mock", name: "2024Q4员工津贴明细", type: "RESOURCE", resourceType: "DATA_ASSET", sourceType: "EXCEL" },
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
            { id: "wiki_101", name: "2024 员工手册", type: "RESOURCE", resourceType: "DOCUMENT" },
            { id: "dict_02", name: "Employee_Levels", type: "RESOURCE", resourceType: "DICTIONARY" },
            { id: "skill_data_analysis", name: "数据分析", type: "RESOURCE", resourceType: "SKILL" },
            {
                id: "cat_hr_workflows",
                name: "审批流程",
                type: "CATALOG",
                isOpen: true,
                children: [
                    { id: "data_202", name: "ks.emp.leave", chineseName: "员工休假记录表", type: "RESOURCE", resourceType: "DATA_ASSET" },
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
            { id: "wiki_900", name: "SRE 运维手册 v2", type: "RESOURCE", resourceType: "DOCUMENT" },
            { id: "card_01", name: "集群健康状态组件", type: "RESOURCE", resourceType: "PAGE_CARD" },
            { id: "dict_01", name: "K8s_Error_Codes", type: "RESOURCE", resourceType: "DICTIONARY" },
            { id: "func_88", name: "restart_k8s_pod", type: "RESOURCE", resourceType: "FUNCTION" },
            { id: "skill_k8s_ops", name: "k8s-operations", type: "RESOURCE", resourceType: "SKILL" }
        ]
    },
    {
        id: "root_ai_skills",
        name: "AI Skills 库",
        type: "CATALOG",
        isOpen: true,
        children: [
            { id: "skill_data_analysis", name: "data-analysis", type: "RESOURCE", resourceType: "SKILL" },
            { id: "skill_api_generator", name: "api-code-generator", type: "RESOURCE", resourceType: "SKILL" },
            { id: "skill_db_migration", name: "database-migration-helper", type: "RESOURCE", resourceType: "SKILL" }
        ]
    }
];

window.App.MockData.resourceTypeMap = {
    'DOCUMENT': '文档',
    'DATA_ASSET': '结构化数据',
    'FUNCTION': '函数',
    'PAGE_CARD': '页面卡片',
    'SKILL': 'SKILLS',
    'DICTIONARY': '字典',
    'CATALOG': '文件夹'
};
