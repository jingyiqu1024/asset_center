// ==================== 权限中心独立页面 Vue App ====================
(function() {
    const { createApp, ref, computed, inject, watch, reactive } = Vue;

    // 加载模板
    const template = window.AppTemplates && window.AppTemplates.PermissionCenter
        ? window.AppTemplates.PermissionCenter
        : '<div class="py-12 text-center text-slate-400"><p class="text-sm">权限中心模板加载失败</p></div>';

    // 行权限添加条件：当前待添加的条件（null=无, ''=正在选类型, 'family'等=已选类型待填写）
    const pendingRowPermCondition = ref(null); // for custom apply
    const pendingCopyRowPermCondition = ref({}); // { tableId: null | '' | 'family' etc } for copy apply

    const startAddRowPermCondition = () => {
        // 如果有正在编辑的 pending 条件（已选了类型），先完成它让它变成正式卡片
        if (pendingRowPermCondition.value && pendingRowPermCondition.value !== '') {
            pendingRowPermCondition.value = null; // 完成：条件卡片出现在 v-for 列表
        }
        pendingRowPermCondition.value = ''; // 开启新的添加行
    };
    const cancelAddRowPermCondition = () => {
        // 如果 pending 行已选了条件类型，从 activeConditions 移除
        if (pendingRowPermCondition.value && pendingRowPermCondition.value !== '') {
            const tblId = permissionApplyForm.value.selectedTables[customApplyConfigIndex.value]?.id;
            if (tblId) removeRowPermCondition(tblId, pendingRowPermCondition.value);
        }
        pendingRowPermCondition.value = null;
    };
    const confirmAddRowPermCondition = (tableId, condKey) => {
        addRowPermCondition(tableId, condKey);
        pendingRowPermCondition.value = condKey; // 切换到填写值状态
    };
    const finishAddRowPermCondition = () => {
        pendingRowPermCondition.value = null;
    };

    const startAddCopyRowPermCondition = (tableId) => {
        // 如果有正在编辑的 pending 条件，先完成它
        if (pendingCopyRowPermCondition.value[tableId] && pendingCopyRowPermCondition.value[tableId] !== '') {
            const copy = { ...pendingCopyRowPermCondition.value };
            delete copy[tableId];
            pendingCopyRowPermCondition.value = copy;
        }
        pendingCopyRowPermCondition.value = { ...pendingCopyRowPermCondition.value, [tableId]: '' };
    };
    const cancelAddCopyRowPermCondition = (tableId) => {
        const copy = { ...pendingCopyRowPermCondition.value };
        delete copy[tableId];
        pendingCopyRowPermCondition.value = copy;
    };
    const confirmAddCopyRowPermCondition = (tableId, condKey) => {
        addRowPermCondition_toCopy(tableId, condKey);
        pendingCopyRowPermCondition.value = { ...pendingCopyRowPermCondition.value, [tableId]: condKey };
    };
    const finishAddCopyRowPermCondition = (tableId) => {
        const copy = { ...pendingCopyRowPermCondition.value };
        delete copy[tableId];
        pendingCopyRowPermCondition.value = copy;
    };

    // 按表申请：构造一份空的行权限表单（供 customApplyRowPermForm 复用）
    // 默认展示「所在组织」，其他条件需手动添加
    // mode: 'structured'（结构化配置）| 'custom'（自定义行权限，用户自由输入）
    const createEmptyRowPermForm = () => ({
        // 行权限模式：structured=结构化条件配置；custom=自定义文本输入
        mode: 'structured',
        // 自定义行权限表达式（仅 mode==='custom' 时使用）
        customExpression: '',
        // 已激活的条件 key 列表（默认包含 org）
        activeConditions: ['org'],
        org: [], orgSearch: '',
        family: [], familySelected: '',
        channel: [], channelSelected: '',
        level: [], levelSelected: '',
        workLocation: [], locSelected: '',
        empType: [], empTypeSelected: '',
        empNature: [], empNatureSelected: '',
        contractEntity: '',
        condRelation: 'and'
    });

    // 将预定义的 rowFilters 转为动态表单格式（用于复制权限按表申请的回显）
    // rowFilters 格式: [{id:'rule_e9_below', label:'除HR外所有E9及以下员工'}, ...]
    const convertRowFiltersToForm = (rowFilters) => {
        const form = createEmptyRowPermForm();
        if (!rowFilters || rowFilters.length === 0) return form;
        // 根据 rule id 解析出条件
        rowFilters.forEach(rf => {
            const ruleId = rf.id;
            if (ruleId === 'rule_e9_below') {
                form.activeConditions = ['org', 'level'];
                form.level = ['E1','E2','E3','E4','E5','E6','E7','E8','E9'];
                form.org = ['全公司（排除HR部门）'];
            } else if (ruleId === 'rule_e10_e13') {
                if (!form.activeConditions.includes('level')) form.activeConditions.push('level');
                form.level = [...form.level, 'E10','E11','E12','E13'].filter((v,i,a)=>a.indexOf(v)===i);
                if (!form.activeConditions.includes('org')) form.activeConditions.push('org');
                if (!form.org.length) form.org = ['全公司（排除HR部门）'];
            } else if (ruleId === 'rule_e14_above') {
                if (!form.activeConditions.includes('level')) form.activeConditions.push('level');
                form.level = [...form.level, 'E14','E15','E16'].filter((v,i,a)=>a.indexOf(v)===i);
                if (!form.activeConditions.includes('org')) form.activeConditions.push('org');
                if (!form.org.length) form.org = ['全公司（排除HR部门）'];
            } else if (ruleId === 'rule_odbp_dept') {
                if (!form.activeConditions.includes('org')) form.activeConditions.push('org');
                form.org = ['作为ODBP管辖的部门'];
            }
        });
        // 去重 org
        form.org = [...new Set(form.org)];
        // 确保 org 始终在 activeConditions 最前面
        const orgIdx = form.activeConditions.indexOf('org');
        if (orgIdx > 0) {
            form.activeConditions.splice(orgIdx, 1);
            form.activeConditions.unshift('org');
        }
        return form;
    };

    // 将动态表单转为 rowFilters 格式（用于提交申请）
    // 返回 [{condKey, condLabel, values}]
    const convertFormToRowFilters = (form) => {
        if (!form) return [];
        // 自定义行权限模式：直接返回用户输入的纯文字作为单条过滤条件
        if (form.mode === 'custom') {
            const text = (form.customExpression || '').trim();
            if (!text) return [];
            return [{ condKey: 'custom', condLabel: '自定义行权限', values: [text], isCustom: true }];
        }
        const filters = [];
        form.activeConditions.forEach(key => {
            const def = rowPermConditionDefs.find(d => d.key === key);
            let values = [];
            if (key === 'org') values = form.org || [];
            else if (key === 'family') values = form.family || [];
            else if (key === 'channel') values = form.channel || [];
            else if (key === 'level') values = form.level || [];
            else if (key === 'workLocation') values = form.workLocation || [];
            else if (key === 'empType') values = form.empType || [];
            else if (key === 'empNature') values = form.empNature || [];
            else if (key === 'contractEntity') values = form.contractEntity ? [form.contractEntity] : [];
            if (values.length > 0) {
                filters.push({
                    condKey: key,
                    condLabel: def ? def.label : key,
                    values: values
                });
            }
        });
        return filters;
    };

    // 可用行权限条件定义（供下拉选择）
    const rowPermConditionDefs = [
        { key: 'org', label: '所在组织', inputType: 'search' },
        { key: 'family', label: '族', inputType: 'select', options: ['技术族','产品族','运营族','职能族','创意族','商业化族'] },
        { key: 'channel', label: '通道', inputType: 'select', options: ['专业通道','管理通道','技术专家通道'] },
        { key: 'level', label: '职级', inputType: 'select', options: ['E1','E2','E3','E4','E5','E6','E7','E8','E9','E10','E11','E12','E13','E14','E15','E16','M1','M2','M3','M4','P1','P2','P3','P4','P5','P6'] },
        { key: 'workLocation', label: '工作地', inputType: 'select', options: ['北京','上海','广州','深圳','杭州','成都','武汉','西安','南京','海外'] },
        { key: 'empType', label: '员工类型', inputType: 'select', options: ['正式员工','实习生','外包','劳务派遣','顾问'] },
        { key: 'empNature', label: '员工性质', inputType: 'select', options: ['全职','兼职','返聘','HRO','BOT'] },
        { key: 'contractEntity', label: '合同主体', inputType: 'text' }
    ];

    // 添加行权限条件到指定表（按表申请）
    const addRowPermCondition = (tableId, conditionKey) => {
        const form = customApplyRowPermForm.value[tableId];
        if (!form) return;
        if (!form.activeConditions.includes(conditionKey)) {
            form.activeConditions.push(conditionKey);
        }
    };
    // 移除行权限条件（不能移除 org）（按表申请）
    const removeRowPermCondition = (tableId, conditionKey) => {
        const form = customApplyRowPermForm.value[tableId];
        if (!form || conditionKey === 'org') return;
        const idx = form.activeConditions.indexOf(conditionKey);
        if (idx !== -1) {
            form.activeConditions.splice(idx, 1);
        }
        // 清空该条件的数据
        if (conditionKey === 'contractEntity') {
            form.contractEntity = '';
        } else if (form[conditionKey]) {
            form[conditionKey] = [];
        }
        if (form[conditionKey + 'Selected']) form[conditionKey + 'Selected'] = '';
        if (form[conditionKey + 'Search']) form[conditionKey + 'Search'] = '';
    };
    // 添加行权限条件到指定表（复制权限的按表申请部分）
    const addRowPermCondition_toCopy = (tableId, conditionKey) => {
        const form = copyCustomRowPermForm.value[tableId];
        if (!form) return;
        if (!form.activeConditions.includes(conditionKey)) {
            form.activeConditions.push(conditionKey);
        }
    };
    // 移除行权限条件（复制权限的按表申请部分）
    const removeRowPermCondition_fromCopy = (tableId, conditionKey) => {
        const form = copyCustomRowPermForm.value[tableId];
        if (!form || conditionKey === 'org') return;
        const idx = form.activeConditions.indexOf(conditionKey);
        if (idx !== -1) {
            form.activeConditions.splice(idx, 1);
        }
        if (conditionKey === 'contractEntity') {
            form.contractEntity = '';
        } else if (form[conditionKey]) {
            form[conditionKey] = [];
        }
        if (form[conditionKey + 'Selected']) form[conditionKey + 'Selected'] = '';
        if (form[conditionKey + 'Search']) form[conditionKey + 'Search'] = '';
    };

    // ========== 状态定义 ==========

    const permissionCenterTab = ref('my_applications');
    const showApplyFlow = ref(false);
    const showDetailDrawer = ref(false);
const detailDrawerData = ref(null); // 当前查看的申请详情数据
const detailDrawerSourceTab = ref(''); // 来源tab: 'my_applications' | 'my_permissions' | 'my_approval'

const openDetailDrawer = (app, sourceTab) => {
    detailDrawerData.value = app;
    detailDrawerSourceTab.value = sourceTab || permissionCenterTab.value;
    showDetailDrawer.value = true;
};

const closeDetailDrawer = () => {
    showDetailDrawer.value = false;
    detailDrawerData.value = null;
};

const viewingAppDetail = ref(null);
    const currentUserRole = ref('admin');

    const permissionDomains = ref([
        { id: 'domain_hr', name: 'HR人力资源域', description: '人员、组织、绩效、人才等HR核心数据', tableCount: 5 },
        { id: 'domain_sre', name: 'SRE运维域', description: 'SRE运维平台相关数据', tableCount: 3 },
        { id: 'domain_ai', name: 'AI Skills库', description: 'AI技能与模型相关数据', tableCount: 2 },
        { id: 'domain_common', name: '公共资源库', description: '全局公共基础数据', tableCount: 8 }
    ]);

    const permissionApplyType = ref('');
    const permissionApplyStep = ref(1);
    const applyMode = ref('new'); // 'new' | 'reapply' | 'renewal'
    const permissionApplyForm = ref({
        domainId: null, domainName: '', roleId: null, roleName: '', roleNames: '', sensitivityLevel: '',
        selectedTables: [], tableRowFilters: {}, selectedFields: {}, validityDays: 90, reason: '', copyUserId: '', copyUserName: ''
    });

    const applicationFilters = ref({ authType: '', roleName: '', tableName: '', appliedAtStart: '', appliedAtEnd: '', status: '' });
    const applicationFilterField1 = ref('');
    const applicationFilterField2 = ref('');
    const applicationFilterField3 = ref('');
    const approvalFilters = ref({ orderId: '', applicant: '', authType: '', roleName: '', tableName: '', appliedAt: '', status: '' });
    const approvalFilterField1 = ref('');
    const approvalFilterField2 = ref('');
    const approvalFilterField3 = ref('');
    const permissionFilters = ref({ source: '', roleName: '', tableName: '', expireStart: '', expireEnd: '', status: '' });
    const permissionFilterField1 = ref('');
    const permissionFilterField2 = ref('');
    const permissionFilterField3 = ref('');

    const copyPermissionUsers = ref([
        { id: 'user_002', name: '张浩', userName: 'zhanghao', department: '产品部' },
        { id: 'user_003', name: '李伟', userName: 'liwei', department: '技术部' },
        { id: 'user_004', name: '王飞', userName: 'wangfei', department: '运营部' },
        { id: 'user_005', name: '孙丽', userName: 'sunli', department: '数据工程部' },
        { id: 'user_006', name: '陈伟', userName: 'chenwei', department: '财务部' },
        { id: 'user_007', name: '赵欣', userName: 'zhaoxin', department: '市场部' }
    ]);
    const copyPermissionSelectedUserId = ref('');
    const copyPermissionSelectedAppIds = ref([]);
    const copyPermissionSelectedTables = ref({}); // { appId: [tableId1, tableId2, ...] }
    // 新增：复制权限选中的标准角色 ID 列表（选人后默认全选）
    const copyPermissionSelectedRoleIds = ref([]);
    // 新增：复制权限统一行权限（选人后默认勾选被复制对象的行权限，可修改）
    const copyPermissionUnifiedRowPerm = ref([]);
    // 新增：复制权限行权限条件间关系（and/or）
    const copyPermissionRowPermRelation = ref('and');
    // 新增：复制权限角色卡片展开状态
    const copyExpandedRoleId = ref(null);
    // 新增：复制权限 - 每个角色的行权限（key=roleId, value={id,label} 或 null，单选）
    const copyPermissionRoleRowPerm = ref({});
    // 新增：按表申请行权限自动复用标记 - 记录哪些表是自动复用来的（展示 banner 提示）
    const customApplyRowPermAutoFilled = ref({}); // { tableId: true/false }

    const customApplySelectedTableIds = ref([]);
    const roleUnifiedRowPerm = ref(null); // 单选：{id, label} 或 null
    const roleUnifiedRowPermRelation = ref('and');
    const selectedRoleIds = ref([]);
    const roleSearchQuery = ref('');
    const customApplyCurrentTableId = ref(null);
    // 按表申请：当前配置的表索引（逐表配置）
    const customApplyConfigIndex = ref(0);
    // 按角色申请：当前配置的表索引（逐表配置）
    const roleApplyConfigIndex = ref(0);
    // 按表申请：每张表的字段搜索关键词
    const customApplyFieldSearch = ref({});
    // 按表申请：分类过滤
    const customApplyTableCategory = ref('全部');
    // 按表申请：行权限表单（按表）
    const customApplyRowPermForm = ref({});

    // 可用表列表（与 catalog 页面共享同一 mock 数据源）
    const availableTablesForColumnPermission = ref(
        (window.HR_MOCK && window.HR_MOCK.tables) ? window.HR_MOCK.tables : []
    );

    // HR_MOCK 中的行权限规则和字段分类（直接暴露给模板，避免模板中直接访问 window）
    const hrRowPermRules = (window.HR_MOCK && window.HR_MOCK.rowPermRules) ? window.HR_MOCK.rowPermRules : [];
    const hrFieldCategories = (window.HR_MOCK && window.HR_MOCK.fieldCategories) ? window.HR_MOCK.fieldCategories : {};
    const hrFieldChineseNameMap = (window.HR_MOCK && window.HR_MOCK.fieldChineseNameMap) ? window.HR_MOCK.fieldChineseNameMap : {};

    // 辅助方法：将字段列表按分类聚合，返回 { groups, overflowCategoryCount }
    // tableId 用于查找表的 fields 元数据获取分类信息
    // maxFieldsPerCategory 每个分类最多展示的字段数量（默认10），超出显示 "..."
    // maxCategories 最多展示的分类组数量（默认3），超出显示 "..."
    const groupFieldsByCategory = (fieldNames, tableId, maxFieldsPerCategory, maxCategories) => {
        const maxFields = typeof maxFieldsPerCategory === 'number' ? maxFieldsPerCategory : 10;
        const maxCats = typeof maxCategories === 'number' ? maxCategories : 3;
        const table = availableTablesForColumnPermission.value.find(t => t.id === tableId);
        const tableFields = table ? (table.fields || []) : [];
        // 构建 name -> category 映射
        const nameToCategory = {};
        tableFields.forEach(f => { nameToCategory[f.name] = f.category || '未分类'; });
        // 对于不在表 fields 中的字段，从 hrFieldCategories 反查
        if (Object.keys(nameToCategory).length === 0) {
            Object.keys(hrFieldCategories).forEach(cat => {
                hrFieldCategories[cat].forEach(name => { nameToCategory[name] = cat; });
            });
        }
        // 按分类聚合
        const catMap = {};
        const catOrder = [];
        fieldNames.forEach(fname => {
            const cat = nameToCategory[fname] || '未分类';
            if (!catMap[cat]) { catMap[cat] = []; catOrder.push(cat); }
            catMap[cat].push({
                name: fname,
                chineseName: hrFieldChineseNameMap[fname] || fname
            });
        });
        // 转为数组，每个分类内最多展示 maxFields 个字段
        const allGroups = catOrder.map(cat => {
            const allFieldsInCat = catMap[cat];
            const visibleFields = allFieldsInCat.slice(0, maxFields);
            return {
                category: cat,
                fields: visibleFields,
                count: allFieldsInCat.length,
                overflowCount: allFieldsInCat.length - visibleFields.length
            };
        });
        // 最多展示 maxCats 个分类组
        const visibleGroups = allGroups.slice(0, maxCats);
        const overflowCategoryCount = allGroups.length - maxCats;

        return { groups: visibleGroups, overflowCategoryCount };
    };

    // 列权限规则（HR 域预定义角色）
    const columnPermissionRules = ref([
        {
            id: 'cpr_1', name: 'OD-基础', sensitivityLevel: 'basic', roleType: 'OD',
            description: '覆盖员工基础信息和考勤信息，适用于基础组织分析',
            tableFields: {
                tbl_hr_emp_all: ['emp_id','emp_code','emp_name','emp_name_en','gender','birth_date','birth_year','birth_month','email_corp','email','mobile','mobile_backup','nationality','nation','political_status','marital_status','highest_education','graduation_school','major','degree','dept_id','dept_name','dept_code','dept_level','dept_path','dept_path_name','biz_unit','biz_unit_name','direct_leader_id','direct_leader_name','level_code','level_name','job_title','hire_date','emp_status','emp_type','emp_nature','work_location','work_city'],
                tbl_hr_ltc_emp: ['emp_id','emp_code','emp_name','emp_status','emp_type','dept_id','dept_name','level_code','level_name','job_title','hire_date','snapshot_date','partition_date'],
                tbl_att_attendance_2: ['emp_id','attendance_year','attendance_month','attendance_date','work_days','actual_work_days','absence_days','late_times','early_leave_times','overtime_hours','overtime_hours_weekday','overtime_hours_weekend','annual_leave_balance','annual_leave_used','sick_leave_used','dept_id','partition_date']
            },
            tableRowRules: {
                tbl_hr_emp_all:      { chineseName: '员工全量信息表',  englishName: 'topic_hr_emp_all_td',                       rowRuleDesc: '所属部门范围内员工，E13及以下', ruleId: 'rule_e10_e13' },
                tbl_hr_ltc_emp:      { chineseName: '员工快照维度表',  englishName: 'dim_hr_ltc_emp_cp',                         rowRuleDesc: '所属部门范围内员工，E13及以下', ruleId: 'rule_e10_e13' },
                tbl_att_attendance_2:{ chineseName: '员工考勤月汇总',  englishName: 'app_outer_attendance_emp_attendance_mi',     rowRuleDesc: '所属部门范围内员工，E13及以下', ruleId: 'rule_e10_e13' }
            }
        },
        {
            id: 'cpr_2', name: 'OD-敏感-职级晋升-低职级', sensitivityLevel: 'sensitive', roleType: 'OD',
            description: '包含职级晋升数据，适用于E9及以下员工晋升分析',
            tableFields: {
                tbl_hr_emp_all: ['emp_id','emp_name','dept_id','dept_name','dept_code','dept_level','dept_path','level_code','level_name','level_group','level_category','job_family','job_family_name','job_title','job_title_code','position_name','position_code','position_type','hire_date','emp_status','promoted_times','last_level_change_date','last_level_change_type','promotion_year','promotion_result','promote_from_level','promote_to_level','promotion_date','promotion_effective_date','promotion_approver']
            },
            tableRowRules: {
                tbl_hr_emp_all: { chineseName: '员工全量信息表', englishName: 'topic_hr_emp_all_td', rowRuleDesc: '所属部门范围内员工，E9及以下', ruleId: 'rule_e9_below' }
            }
        },
        {
            id: 'cpr_3', name: 'OD-敏感-绩效信息-低职级', sensitivityLevel: 'sensitive', roleType: 'OD',
            description: '包含员工绩效数据，适用于E9及以下员工绩效分析',
            tableFields: {
                tbl_hr_emp_all: ['emp_id','emp_name','dept_id','dept_name','level_code','level_name','emp_status','perf_year','perf_cycle','perf_result','perf_result_code','perf_score','perf_rank','perf_rank_pct','perf_level','perf_level_code','perf_type','perf_status','kpi_score','okr_score','ability_score','value_score','calibrated_result','calibration_date','calibration_round']
            },
            tableRowRules: {
                tbl_hr_emp_all: { chineseName: '员工全量信息表', englishName: 'topic_hr_emp_all_td', rowRuleDesc: '所属部门范围内员工，E9及以下', ruleId: 'rule_e9_below' }
            }
        },
        {
            id: 'cpr_4', name: 'OD-敏感-薪酬信息-低职级', sensitivityLevel: 'high_sensitive', roleType: 'OD',
            description: '包含员工薪酬数据，适用于E9及以下员工薪酬分析',
            tableFields: {
                tbl_hr_emp_all: ['emp_id','emp_name','dept_id','dept_name','level_code','level_name','emp_status','base_salary','base_salary_monthly','annual_salary','annual_ctc','annual_tc','cash_salary','variable_salary','bonus_target_pct','bonus_target_amount','actual_bonus','bonus_year','equity_grant_amount','equity_vested','equity_unvested','allowance_total','allowance_housing','allowance_transport','salary_band','salary_range_min','salary_range_max','salary_range_mid','net_salary','total_deduction']
            },
            tableRowRules: {
                tbl_hr_emp_all: { chineseName: '员工全量信息表', englishName: 'topic_hr_emp_all_td', rowRuleDesc: '所属部门范围内员工，E9及以下', ruleId: 'rule_e9_below' }
            }
        },
        {
            id: 'cpr_5', name: 'OD-人才盘点-高职级', sensitivityLevel: 'top_sensitive', roleType: 'OD极高敏',
            description: '包含人才盘点和潜力评估数据，仅限E14及以上人员分析',
            tableFields: {
                tbl_hr_emp_all: ['emp_id','emp_name','dept_id','dept_name','level_code','level_name','emp_status','talent_pool','talent_tier','high_potential_flag','succession_plan_flag','perf_result','perf_score','promotion_year','promotion_result']
            },
            tableRowRules: {
                tbl_hr_emp_all: { chineseName: '员工全量信息表', englishName: 'topic_hr_emp_all_td', rowRuleDesc: '所属部门范围内员工，E14及以上', ruleId: 'rule_e14_above' }
            }
        },
        {
            id: 'cpr_6', name: 'BP-基础信息', sensitivityLevel: 'basic', roleType: 'BP',
            description: 'BP视角的员工基础信息查询，适用于BP日常运营',
            tableFields: {
                tbl_hr_emp_all: ['emp_id','emp_name','emp_code','dept_id','dept_name','level_code','level_name','job_title','hire_date','emp_status','work_location']
            },
            tableRowRules: {
                tbl_hr_emp_all: { chineseName: '员工全量信息表', englishName: 'topic_hr_emp_all_td', rowRuleDesc: 'BP汇报链路下所有层级员工', ruleId: 'rule_odbp_dept' }
            }
        },
        {
            id: 'cpr_7', name: 'R-招聘专员', sensitivityLevel: 'basic', roleType: 'R',
            description: '招聘专员视角，适用于招聘流程数据分析',
            tableFields: {
                tbl_hr_emp_all: ['emp_id','emp_name','dept_id','dept_name','hire_date','emp_status','emp_type','position_name']
            },
            tableRowRules: {
                tbl_hr_emp_all: { chineseName: '员工全量信息表', englishName: 'topic_hr_emp_all_td', rowRuleDesc: '负责招聘的部门范围内所有在职员工', ruleId: 'rule_odbp_dept' }
            }
        },
        {
            id: 'cpr_8', name: '通道BP-OD通道', sensitivityLevel: 'sensitive', roleType: '通道BP',
            description: 'OD通道BP视角，适用于通道人才分析',
            tableFields: {
                tbl_hr_emp_all: ['emp_id','emp_name','dept_id','dept_name','level_code','level_name','job_family','job_title','emp_status','talent_pool','high_potential_flag']
            },
            tableRowRules: {
                tbl_hr_emp_all: { chineseName: '员工全量信息表', englishName: 'topic_hr_emp_all_td', rowRuleDesc: '所辖通道范围内全量员工', ruleId: 'rule_odbp_dept' }
            }
        },
        {
            id: 'cpr_9', name: 'ODBP-部门BP', sensitivityLevel: 'high_sensitive', roleType: 'ODBP',
            description: 'ODBP视角的部门敏感数据，适用于部门OD分析',
            tableFields: {
                tbl_hr_emp_all: ['emp_id','emp_name','dept_id','dept_name','level_code','level_name','emp_status','base_salary','perf_result','talent_tier']
            },
            tableRowRules: {
                tbl_hr_emp_all: { chineseName: '员工全量信息表', englishName: 'topic_hr_emp_all_td', rowRuleDesc: '所辖部门范围内员工，不含 HR 部门', ruleId: 'rule_odbp_dept' }
            }
        },
        {
            id: 'cpr_10', name: 'CB-薪酬分析', sensitivityLevel: 'high_sensitive', roleType: 'CB',
            description: 'CB视角的薪酬数据分析，适用于薪酬结构调研',
            tableFields: {
                tbl_hr_emp_all: ['emp_id','emp_name','dept_id','dept_name','level_code','level_name','base_salary','annual_salary','bonus_target_pct','salary_band']
            },
            tableRowRules: {
                tbl_hr_emp_all: { chineseName: '员工全量信息表', englishName: 'topic_hr_emp_all_td', rowRuleDesc: '全公司在职员工，E13及以下', ruleId: 'rule_e10_e13' }
            }
        },
        {
            id: 'cpr_11', name: '生态用工-外包分析', sensitivityLevel: 'sensitive', roleType: '生态用工',
            description: '生态用工视角的外包人员数据分析',
            tableFields: {
                tbl_hr_emp_all: ['emp_id','emp_name','emp_type','emp_nature','dept_id','dept_name','contract_entity','work_location','hire_date','emp_status']
            },
            tableRowRules: {
                tbl_hr_emp_all: { chineseName: '员工全量信息表', englishName: 'topic_hr_emp_all_td', rowRuleDesc: '外包/实习生类型员工，全公司范围', ruleId: 'rule_odbp_dept' }
            }
        },
        {
            id: 'cpr_12', name: 'SSC-共享服务', sensitivityLevel: 'basic', roleType: 'SSC',
            description: 'SSC视角的共享服务数据查询',
            tableFields: {
                tbl_hr_emp_all: ['emp_id','emp_name','emp_code','dept_id','dept_name','hire_date','emp_status','work_location']
            },
            tableRowRules: {
                tbl_hr_emp_all: { chineseName: '员工全量信息表', englishName: 'topic_hr_emp_all_td', rowRuleDesc: 'SSC服务范围内所有员工', ruleId: 'rule_odbp_dept' }
            }
        },
        {
            id: 'cpr_13', name: 'HRPA-人事专员', sensitivityLevel: 'sensitive', roleType: 'HRPA',
            description: 'HRPA视角的人事专员数据操作',
            tableFields: {
                tbl_hr_emp_all: ['emp_id','emp_name','emp_code','dept_id','dept_name','level_code','level_name','hire_date','emp_status','emp_type','contract_start_date','contract_end_date']
            },
            tableRowRules: {
                tbl_hr_emp_all: { chineseName: '员工全量信息表', englishName: 'topic_hr_emp_all_td', rowRuleDesc: '负责管理的部门范围内员工，含离职人员', ruleId: 'rule_odbp_dept' }
            }
        }
    ]);

    const permissionApplications = ref([
        {
            id: 'app_proxy_001', type: 'standard', roleId: 'cpr_2', roleName: '招聘-数据分析岗', roleNames: '招聘-数据分析岗',
            sensitivityLevel: 'sensitive', domainName: 'HR人力资源域',
            tables: [
                { tableId: 'tbl_recruit_basic', tableName: 'topic_recruit_basic_td', chineseName: '招聘基础信息表', rowFilters: [] }
            ],
            validityDays: 90, expireAt: '2026-12-07', reason: '新入职员工招聘数据分析需要', status: 'approved', source: '主动申请', expireReason: '',
            bpmProcessId: 'bpm_proxy_001',
            approvalNodes: [
                { name: '直接上级', status: 'done', approver: '赵欣', doneAt: '2026-09-05 10:20' },
                { name: '权限管理员', status: 'done', approver: '李晓明', doneAt: '2026-09-05 14:00' }
            ],
            appliedAt: '2026-09-05', approvedAt: '2026-09-05',
            applicantId: 'user_001', applicantName: '陈思思',
            proxyApplicantId: 'user_008', proxyApplicantName: '刘洋'
        },
        {
            id: 'app_multi_001', type: 'standard',
            roleId: 'cpr_2,cpr_3',
            roleName: 'OD-基础、招聘-数据分析岗',
            roleNames: 'OD-基础、招聘-数据分析岗',
            sensitivityLevel: 'sensitive', domainName: 'HR人力资源域',
            roles: [
                {
                    roleId: 'cpr_1', roleName: 'OD-基础', sensitivityLevel: 'basic', description: '组织基础数据只读权限',
                    tables: [
                        {
                            tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表',
                            fields: [
                                { name: 'emp_id', chineseName: '员工工号' }, { name: 'emp_name', chineseName: '员工姓名' },
                                { name: 'dept_name', chineseName: '部门名称' }, { name: 'job_level', chineseName: '职级' },
                                { name: 'entry_date', chineseName: '入职日期' }, { name: 'emp_status', chineseName: '在职状态' }
                            ],
                            rowFilters: [{ label: '所在组织：产品部' }]
                        }
                    ]
                },
                {
                    roleId: 'cpr_2', roleName: '招聘-数据分析岗', sensitivityLevel: 'sensitive', description: '招聘流程数据查询权限',
                    tables: [
                        {
                            tableId: 'tbl_recruit_basic', tableName: 'topic_recruit_basic_td', chineseName: '招聘基础信息表',
                            fields: [
                                { name: 'candidate_id', chineseName: '候选人ID' }, { name: 'apply_position', chineseName: '应聘岗位' },
                                { name: 'interview_status', chineseName: '面试状态' }, { name: 'offer_status', chineseName: 'Offer状态' },
                                { name: 'onboard_date', chineseName: '到岗日期' }
                            ],
                            rowFilters: [{ label: '所在组织：产品部' }]
                        },
                        {
                            tableId: 'tbl_recruit_funnel', tableName: 'topic_recruit_funnel_td', chineseName: '招聘漏斗表',
                            fields: [
                                { name: 'dept_id', chineseName: '部门ID' }, { name: 'position_cnt', chineseName: '需求人数' },
                                { name: 'cv_cnt', chineseName: '简历量' }, { name: 'offer_cnt', chineseName: 'Offer数' }
                            ],
                            rowFilters: []
                        }
                    ]
                }
            ],
            tables: [],
            validityDays: 90, expireAt: '2026-12-06', reason: '参与Q4人才分析专项，需要同时查看组织和招聘数据',
            status: 'pending', source: '主动申请', expireReason: '',
            bpmProcessId: 'bpm_multi_001',
            approvalNodes: [
                { name: '初审', status: 'current', approver: '王建国', doneAt: null },
                { name: '汇报线上级', status: 'pending', approver: '（待定）', doneAt: null },
                { name: 'OD负责人', status: 'pending', approver: '陈OD', doneAt: null },
                { name: '系统开通', status: 'pending', approver: '系统自动', doneAt: null },
                { name: '终审', status: 'pending', approver: '李晓明', doneAt: null }
            ],
            appliedAt: '2026-09-07', approvedAt: null,
            applicantId: 'user_001', applicantName: '陈思思'
        },
        {
            id: 'app_001', type: 'standard', roleId: 'cpr_1', roleName: 'OD-基础', roleNames: 'OD-基础', sensitivityLevel: 'basic', domainName: 'HR人力资源域',
            tables: [
                { tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表', rowFilters: [{ id: 'rule_e9_below', label: '除HR外所有E9及以下员工' }] },
                { tableId: 'tbl_att_attendance_2', tableName: 'app_outer_attendance_emp_attendance_mi', chineseName: '员工考勤月汇总', rowFilters: [{ id: 'rule_e9_below', label: '除HR外所有E9及以下员工' }] }
            ],
            validityDays: 90, expireAt: '2026-09-16', reason: '用于OD人员组织分析项目', status: 'approved', source: '主动申请', expireReason: '',
            bpmProcessId: 'bpm_20260616_001',
            approvalNodes: [
                { name: '初审', status: 'done', approver: '王建国', doneAt: '2026-06-17 09:10' },
                { name: '系统开通', status: 'done', approver: '系统自动', doneAt: '2026-06-17 09:12' },
                { name: '终审', status: 'done', approver: '李晓明', doneAt: '2026-06-17 14:30' }
            ],
            appliedAt: '2026-06-16', approvedAt: '2026-06-17', applicantId: 'user_001', applicantName: '陈思思'
        },
        {
            id: 'app_002', type: 'standard', roleId: 'cpr_3', roleName: 'OD-敏感-绩效信息-低职级', roleNames: 'OD-敏感-绩效信息-低职级', sensitivityLevel: 'sensitive', domainName: 'HR人力资源域',
            tables: [
                { tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表', rowFilters: [{ id: 'rule_odbp_dept', label: '作为ODBP管辖的部门的员工' }] }
            ],
            validityDays: 30, expireAt: '2026-07-20', reason: '季度绩效分析', status: 'pending', source: '主动申请', expireReason: '',
            bpmProcessId: 'bpm_20260618_002',
            approvalNodes: [
                { name: '初审', status: 'done', approver: '王建国', doneAt: '2026-06-19 10:00' },
                { name: '汇报线上级', status: 'current', approver: '张总', doneAt: null },
                { name: 'OD负责人', status: 'pending', approver: '陈OD', doneAt: null },
                { name: '系统开通', status: 'pending', approver: '系统自动', doneAt: null },
                { name: '终审', status: 'pending', approver: '李晓明', doneAt: null }
            ],
            appliedAt: '2026-06-18', approvedAt: null, applicantId: 'user_001', applicantName: '陈思思'
        },
        {
            id: 'app_003', type: 'custom', roleId: null, roleName: '【非标角色】曲景怡qujingyi', roleNames: '【非标角色】曲景怡qujingyi', sensitivityLevel: 'high_sensitive', domainName: 'HR人力资源域',
            tables: [
                { tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表', fields: ['emp_id','emp_name','dept_id','dept_name','level_code','base_salary','annual_salary'], rowFilters: [{ id: 'rule_e14_above', label: '除HR外所有E14及以上员工' }] }
            ],
            validityDays: 180, expireAt: '2025-12-25', reason: '', status: 'expired', source: '主动申请', expireReason: '权限过期',
            bpmProcessId: 'bpm_20250625_003',
            approvalNodes: [
                { name: '初审', status: 'done', approver: '王建国', doneAt: '2025-06-26 11:00' },
                { name: '汇报线上级', status: 'done', approver: '张总', doneAt: '2025-06-26 14:00' },
                { name: 'OD负责人', status: 'done', approver: '陈OD', doneAt: '2025-06-27 09:00' },
                { name: '高敏审批人', status: 'done', approver: '董事长办公室', doneAt: '2025-06-27 11:30' },
                { name: '系统开通', status: 'done', approver: '系统自动', doneAt: '2025-06-27 11:32' },
                { name: '终审', status: 'done', approver: '李晓明', doneAt: '2025-06-27 16:00' }
            ],
            appliedAt: '2025-06-25', approvedAt: '2025-06-27', applicantId: 'user_001', applicantName: '陈思思'
        },
        {
            id: 'app_004', type: 'standard', roleId: 'cpr_2', roleName: 'OD-敏感-职级晋升-低职级', roleNames: 'OD-敏感-职级晋升-低职级', sensitivityLevel: 'sensitive', domainName: 'HR人力资源域',
            tables: [
                { tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表', rowFilters: [{ id: 'rule_e9_below', label: '除HR外所有E9及以下员工' }] }
            ],
            validityDays: 30, expireAt: '2026-06-20', reason: '职级晋升数据分析', status: 'approved', source: '用户组继承', expireReason: '',
            bpmProcessId: 'bpm_20260521_004',
            approvalNodes: [
                { name: '初审', status: 'done', approver: '王建国', doneAt: '2026-05-22 09:00' },
                { name: '汇报线上级', status: 'done', approver: '张总', doneAt: '2026-05-22 15:00' },
                { name: 'OD负责人', status: 'done', approver: '陈OD', doneAt: '2026-05-23 10:00' },
                { name: '系统开通', status: 'done', approver: '系统自动', doneAt: '2026-05-23 10:02' },
                { name: '终审', status: 'done', approver: '李晓明', doneAt: '2026-05-23 14:00' }
            ],
            appliedAt: '2026-05-21', approvedAt: '2026-05-23', applicantId: 'user_001', applicantName: '陈思思'
        },
        {
            id: 'app_005', type: 'standard', roleId: 'cpr_1', roleName: 'OD-基础', roleNames: 'OD-基础', sensitivityLevel: 'basic', domainName: 'HR人力资源域',
            tables: [
                { tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表', rowFilters: [] },
                { tableId: 'tbl_hr_ltc_emp', tableName: 'dim_hr_ltc_emp_cp', chineseName: '员工快照维度表', rowFilters: [] }
            ],
            validityDays: 90, expireAt: '2026-08-30', reason: '', status: 'approved', source: '用户组继承', expireReason: '',
            bpmProcessId: 'bpm_20260601_005',
            approvalNodes: [
                { name: '初审', status: 'done', approver: '王建国', doneAt: '2026-06-02 09:00' },
                { name: '系统开通', status: 'done', approver: '系统自动', doneAt: '2026-06-02 09:02' },
                { name: '终审', status: 'done', approver: '李晓明', doneAt: '2026-06-02 14:00' }
            ],
            appliedAt: '2026-06-01', approvedAt: '2026-06-02', applicantId: 'user_002', applicantName: '张浩'
        },
        {
            id: 'app_006', type: 'standard', roleId: 'cpr_4', roleName: 'OD-敏感-薪酬信息-低职级', roleNames: 'OD-敏感-薪酬信息-低职级', sensitivityLevel: 'high_sensitive', domainName: 'HR人力资源域',
            tables: [
                { tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表', rowFilters: [{ id: 'rule_e9_below', label: '除HR外所有E9及以下员工' }] }
            ],
            validityDays: 90, expireAt: '2026-09-10', reason: '管理层数据分析项目', status: 'revoked', expireReason: '主动归还', revokedAt: '2026-06-15',
            bpmProcessId: 'bpm_20260611_006',
            approvalNodes: [
                { name: '初审', status: 'done', approver: '王建国', doneAt: '2026-06-12 09:00' },
                { name: '汇报线上级', status: 'done', approver: '张总', doneAt: '2026-06-12 15:00' },
                { name: 'OD负责人', status: 'done', approver: '陈OD', doneAt: '2026-06-13 10:00' },
                { name: '高敏审批人', status: 'done', approver: '董事长办公室', doneAt: '2026-06-13 11:00' },
                { name: '系统开通', status: 'done', approver: '系统自动', doneAt: '2026-06-13 11:02' },
                { name: '终审', status: 'done', approver: '李晓明', doneAt: '2026-06-13 16:00' }
            ],
            appliedAt: '2026-06-11', approvedAt: '2026-06-13', applicantId: 'user_003', applicantName: '李伟'
        },
        // 复制权限的申请数据
        {
            id: 'app_013', type: 'copy', roleId: 'cpr_1', roleName: 'OD-基础', roleNames: 'OD-基础', sensitivityLevel: 'basic', domainName: 'HR人力资源域',
            tables: [
                { tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表', rowFilters: [{ id: 'rule_e9_below', label: '除HR外所有E9及以下员工' }] },
                { tableId: 'tbl_att_attendance_2', tableName: 'app_outer_attendance_emp_attendance_mi', chineseName: '员工考勤月汇总', rowFilters: [{ id: 'rule_e9_below', label: '除HR外所有E9及以下员工' }] }
            ],
            validityDays: 90, expireAt: '2026-09-20', reason: '复用孙丽的权限范围', status: 'pending', source: '主动申请', expireReason: '',
            bpmProcessId: 'bpm_20260618_013', approvalNodes: [
                { name: '初审', status: 'current', approver: '王建国', doneAt: null },
                { name: '系统开通', status: 'pending', approver: '系统自动', doneAt: null },
                { name: '终审', status: 'pending', approver: '李晓明', doneAt: null }
            ],
            appliedAt: '2026-06-18', approvedAt: null, applicantId: 'user_001', applicantName: '陈思思', copiedFromUserName: '孙丽'
        },
        // 更多用户的权限数据（供复制权限使用）
        {
            id: 'app_007', type: 'standard', roleId: 'cpr_1', roleName: 'OD-基础', roleNames: 'OD-基础', sensitivityLevel: 'basic', domainName: 'HR人力资源域',
            tables: [
                { tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表', rowFilters: [{ id: 'rule_e9_below', label: '除HR外所有E9及以下员工' }] },
                { tableId: 'tbl_att_attendance_2', tableName: 'app_outer_attendance_emp_attendance_mi', chineseName: '员工考勤月汇总', rowFilters: [{ id: 'rule_e9_below', label: '除HR外所有E9及以下员工' }] }
            ],
            validityDays: 90, expireAt: '2026-09-12', reason: '', status: 'approved', source: '主动申请', expireReason: '',
            bpmProcessId: 'bpm_20260601_007', approvalNodes: [], appliedAt: '2026-06-01', approvedAt: '2026-06-02', applicantId: 'user_005', applicantName: '孙丽'
        },
        {
            id: 'app_008', type: 'standard', roleId: 'cpr_3', roleName: 'OD-敏感-绩效信息-低职级', roleNames: 'OD-敏感-绩效信息-低职级', sensitivityLevel: 'sensitive', domainName: 'HR人力资源域',
            tables: [
                { tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表', rowFilters: [{ id: 'rule_odbp_dept', label: '作为ODBP管辖的部门的员工' }] }
            ],
            validityDays: 180, expireAt: '2026-12-15', reason: '绩效管理分析', status: 'approved', source: '主动申请', expireReason: '',
            bpmProcessId: 'bpm_20260301_008', approvalNodes: [], appliedAt: '2026-03-01', approvedAt: '2026-03-02', applicantId: 'user_005', applicantName: '孙丽'
        },
        // 孙丽的按表申请权限（供复制权限使用）
        {
            id: 'app_014', type: 'custom', roleId: null, roleName: '【非标角色】曲景怡qujingyi', roleNames: '【非标角色】曲景怡qujingyi', sensitivityLevel: 'sensitive', domainName: 'HR人力资源域',
            tables: [
                { tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表', fields: ['emp_id','emp_name','dept_id','dept_name','level_code','level_name','hire_date','emp_status'], rowFilters: [{ id: 'rule_e9_below', label: '除HR外所有E9及以下员工' }] },
                { tableId: 'tbl_hr_ltc_emp', tableName: 'dim_hr_ltc_emp_cp', chineseName: '员工快照维度表', fields: ['emp_id','emp_code','emp_name','emp_status','dept_id','dept_name','level_code'], rowFilters: [{ id: 'rule_e9_below', label: '除HR外所有E9及以下员工' }] }
            ],
            validityDays: 90, expireAt: '2026-10-01', reason: '数据工程团队分析项目', status: 'approved', source: '主动申请', expireReason: '',
            bpmProcessId: 'bpm_20260701_014', approvalNodes: [], appliedAt: '2026-07-01', approvedAt: '2026-07-02', applicantId: 'user_005', applicantName: '孙丽'
        },
        {
            id: 'app_009', type: 'standard', roleId: 'cpr_2', roleName: 'OD-敏感-职级晋升-低职级', roleNames: 'OD-敏感-职级晋升-低职级', sensitivityLevel: 'sensitive', domainName: 'HR人力资源域',
            tables: [
                { tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表', rowFilters: [{ id: 'rule_e9_below', label: '除HR外所有E9及以下员工' }] }
            ],
            validityDays: 365, expireAt: '2027-06-01', reason: '人才发展数据分析', status: 'approved', source: '主动申请', expireReason: '',
            bpmProcessId: 'bpm_20260601_009', approvalNodes: [], appliedAt: '2026-06-01', approvedAt: '2026-06-02', applicantId: 'user_006', applicantName: '陈伟'
        },
        {
            id: 'app_010', type: 'standard', roleId: 'cpr_1', roleName: 'OD-基础', roleNames: 'OD-基础', sensitivityLevel: 'basic', domainName: 'HR人力资源域',
            tables: [
                { tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表', rowFilters: [] },
                { tableId: 'tbl_hr_ltc_emp', tableName: 'dim_hr_ltc_emp_cp', chineseName: '员工快照维度表', rowFilters: [] }
            ],
            validityDays: 90, expireAt: '2026-09-01', reason: '财务分析需要', status: 'approved', source: '用户组继承', expireReason: '',
            bpmProcessId: 'bpm_20260301_010', approvalNodes: [], appliedAt: '2026-03-01', approvedAt: '2026-03-02', applicantId: 'user_006', applicantName: '陈伟'
        },
        {
            id: 'app_011', type: 'standard', roleId: 'cpr_4', roleName: 'OD-敏感-薪酬信息-低职级', roleNames: 'OD-敏感-薪酬信息-低职级', sensitivityLevel: 'high_sensitive', domainName: 'HR人力资源域',
            tables: [
                { tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表', rowFilters: [{ id: 'rule_e9_below', label: '除HR外所有E9及以下员工' }] }
            ],
            validityDays: 90, expireAt: '2026-09-05', reason: '薪酬预算分析', status: 'approved', source: '主动申请', expireReason: '',
            bpmProcessId: 'bpm_20260601_011', approvalNodes: [], appliedAt: '2026-06-01', approvedAt: '2026-06-02', applicantId: 'user_007', applicantName: '赵欣'
        },
        {
            id: 'app_012', type: 'standard', roleId: 'cpr_1', roleName: 'OD-基础', roleNames: 'OD-基础', sensitivityLevel: 'basic', domainName: 'HR人力资源域',
            tables: [
                { tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表', rowFilters: [] },
                { tableId: 'tbl_att_attendance_2', tableName: 'app_outer_attendance_emp_attendance_mi', chineseName: '员工考勤月汇总', rowFilters: [] },
                { tableId: 'tbl_hr_ltc_emp', tableName: 'dim_hr_ltc_emp_cp', chineseName: '员工快照维度表', rowFilters: [] }
            ],
            validityDays: 180, expireAt: '2026-12-01', reason: '市场团队需要基础HR数据', status: 'approved', source: '主动申请', expireReason: '',
            bpmProcessId: 'bpm_20260601_012', approvalNodes: [], appliedAt: '2026-06-01', approvedAt: '2026-06-02', applicantId: 'user_007', applicantName: '赵欣'
        },
        // 赵欣的按表申请权限
        {
            id: 'app_015', type: 'custom', roleId: null, roleName: '【非标角色】曲景怡qujingyi', roleNames: '【非标角色】曲景怡qujingyi', sensitivityLevel: 'high_sensitive', domainName: 'HR人力资源域',
            tables: [
                { tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表', fields: ['emp_id','emp_name','dept_id','dept_name','level_code','base_salary','annual_salary'], rowFilters: [{ id: 'rule_e14_above', label: '除HR外所有E14及以上员工' }] }
            ],
            validityDays: 180, expireAt: '2026-12-15', reason: '薪酬趋势分析', status: 'approved', source: '主动申请', expireReason: '',
            bpmProcessId: 'bpm_20260501_015', approvalNodes: [], appliedAt: '2026-05-01', approvedAt: '2026-05-02', applicantId: 'user_007', applicantName: '赵欣'
        }
    ]);

    const myApprovalItems = ref([
        { id: 'approval_001', applicantName: '张浩', applicantId: 'user_002', applicantDept: '产品部/用户增长中心', type: 'standard', roleName: 'OD-基础', roleNames: 'OD-基础', sensitivityLevel: 'basic', domainName: 'HR人力资源域', tables: [{ tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表' }, { tableId: 'tbl_hr_ltc_emp', tableName: 'dim_hr_ltc_emp_cp', chineseName: '员工快照维度表' }], validityDays: 90, expireAt: '2026-09-01', reason: '用于OD人员组织分析项目', appliedAt: '2026-06-01', bpmProcessId: 'bpm_20260601_005', myApprovalStatus: 'pending', approvalNodeType: '初审', approvalNodes: [
            { name: '初审', status: 'current', approver: '陈思思', doneAt: null },
            { name: '系统开通', status: 'pending', approver: '系统自动', doneAt: null },
            { name: '终审', status: 'pending', approver: '李晓明', doneAt: null }
        ] },
        { id: 'approval_002', applicantName: '李伟', applicantId: 'user_003', applicantDept: '技术部/数据平台', type: 'standard', roleName: 'OD-敏感-绩效信息-低职级', roleNames: 'OD-敏感-绩效信息-低职级', sensitivityLevel: 'sensitive', domainName: 'HR人力资源域', tables: [{ tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表' }], validityDays: 30, expireAt: '2026-07-14', reason: '季度绩效分析', appliedAt: '2026-06-14', bpmProcessId: 'bpm_20260614_007', myApprovalStatus: 'approved', approvalNodeType: '初审', approvalNodes: [
            { name: '初审', status: 'done', approver: '陈思思', doneAt: '2026-06-15 09:00' },
            { name: '汇报线上级', status: 'done', approver: '张总', doneAt: '2026-06-15 14:00' },
            { name: 'OD负责人', status: 'done', approver: '陈OD', doneAt: '2026-06-16 10:00' },
            { name: '系统开通', status: 'done', approver: '系统自动', doneAt: '2026-06-16 10:02' },
            { name: '终审', status: 'done', approver: '李晓明', doneAt: '2026-06-16 14:00' }
        ] },
        { id: 'approval_003', applicantName: '王飞', applicantId: 'user_004', applicantDept: '运营部/增长运营', type: 'standard', roleName: 'OD-敏感-薪酬信息-低职级', roleNames: 'OD-敏感-薪酬信息-低职级', sensitivityLevel: 'high_sensitive', domainName: 'HR人力资源域', tables: [{ tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表' }], validityDays: 180, expireAt: '2026-12-10', reason: '薪酬结构分析项目', appliedAt: '2026-06-10', bpmProcessId: 'bpm_20260610_008', myApprovalStatus: 'rejected', approvalNodeType: '终审', approvalNodes: [
            { name: '初审', status: 'done', approver: '陈思思', doneAt: '2026-06-11 09:00' },
            { name: '汇报线上级', status: 'done', approver: '张总', doneAt: '2026-06-11 14:00' },
            { name: 'OD负责人', status: 'done', approver: '陈OD', doneAt: '2026-06-12 10:00' },
            { name: '高敏审批人', status: 'done', approver: '董事长办公室', doneAt: '2026-06-12 11:00' },
            { name: '终审', status: 'done', approver: '李晓明', doneAt: '2026-06-12 16:00' }
        ] },
        { id: 'approval_004', applicantName: '孙丽', applicantId: 'user_005', applicantDept: '数据工程部/数据中台', type: 'custom', roleName: '', roleNames: '', sensitivityLevel: 'high_sensitive', domainName: 'HR人力资源域', tables: [{ tableId: 'tbl_hr_emp_all', tableName: 'topic_hr_emp_all_td', chineseName: '员工全量信息表' }, { tableId: 'tbl_hr_ltc_emp', tableName: 'dim_hr_ltc_emp_cp', chineseName: '员工快照维度表' }], validityDays: 90, expireAt: '2026-09-15', reason: '自定义分析需求', appliedAt: '2026-06-15', bpmProcessId: 'bpm_20260615_009', myApprovalStatus: 'pending', approvalNodeType: '初审', approvalNodes: [
            { name: '初审', status: 'current', approver: '陈思思', doneAt: null },
            { name: '汇报线上级', status: 'pending', approver: '张总', doneAt: null },
            { name: '高敏审批人', status: 'pending', approver: '董事长办公室', doneAt: null },
            { name: '终审', status: 'pending', approver: '李晓明', doneAt: null }
        ] }
    ]);

    const approvalStatusLabel = (status) => { const map = { pending: '待审批', approved: '已通过', rejected: '已拒绝' }; return map[status] || status; };
    const approvalStatusClass = (status) => { const map = { pending: 'bg-blue-100 text-blue-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' }; return map[status] || 'bg-gray-100 text-gray-500'; };

    const authTypeLabel = (type) => { const map = { standard: '按标准角色授权', custom: '按表授权', copy: '复制他人权限' }; return map[type] || type || '-'; };

    const showRenewalModal = ref(false);
    const renewalTarget = ref(null);
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
            roleNames: app.roleNames || app.roleName || '',
            sensitivityLevel: app.sensitivityLevel || '',
            selectedTables: app.tables.map(t => ({ id: t.tableId, name: t.tableName, chineseName: t.chineseName || '' })),
            tableRowFilters,
            selectedFields,
            validityDays: app.validityDays || 90,
            reason: app.reason || ''
        };
        customApplySelectedTableIds.value = app.tables.map(t => t.tableId);
        // 标准角色申请时，从已有申请提取统一的行权限（取第一张表的行权限作为统一值）
        if (app.type === 'standard' && app.tables.length > 0) {
            const firstRowFilters = app.tables[0].rowFilters || [];
            roleUnifiedRowPerm.value = firstRowFilters.length > 0 ? {id: firstRowFilters[0].id, label: firstRowFilters[0].label} : null;
            // 恢复条件间关系（标准角色固定为且）
            roleUnifiedRowPermRelation.value = 'and';
        } else {
            roleUnifiedRowPerm.value = null;
            roleUnifiedRowPermRelation.value = 'and';
        }
    };

    // 重新申请：预填表单，可编辑
    const reApplyPermission = (app) => {
        applyMode.value = 'reapply';
        fillFormFromApp(app);
        renewalTarget.value = app;
        renewalReason.value = '';
        roleApplyConfigIndex.value = 0;
        permissionApplyStep.value = 3;
        permissionCenterTab.value = 'my_applications';
        showApplyFlow.value = true;
    };

    // 续签：预填表单，只允许修改有效期
    const openRenewalForm = (app) => {
        applyMode.value = 'renewal';
        fillFormFromApp(app);
        renewalTarget.value = app;
        renewalReason.value = '';
        roleApplyConfigIndex.value = 0;
        permissionApplyStep.value = 2;
        permissionCenterTab.value = 'my_applications';
        showApplyFlow.value = true;
    };

    const showRevokeConfirm = ref(false);
    const revokeTarget = ref(null);

    // 行权限表达式内行展开——用 ref 存当前展开的 key（单选展开）
    const expandedRowExprKey = ref('');
    const toggleRowExpr = (key) => {
        expandedRowExprKey.value = expandedRowExprKey.value === key ? '' : key;
    };
    const getRowExprContent = (filterId) => {
        const rule = hrRowPermRules.find(r => r.id === filterId);
        return rule && rule.expression ? rule.expression : null;
    };
    const toggleRowExprDOM = (el) => {
        const block = el.parentElement && el.parentElement.querySelector('.row-expr-block');
        if (block) block.style.display = block.style.display === 'none' ? 'block' : 'none';
    };

    const showFreezeConfirm = ref(false);
    const freezeTarget = ref(null);
    const freezeAction = ref('freeze');

    const auditSearchMode = ref('by_person');
    const auditSearchPersonQuery = ref('');
    const auditSearchPersonResult = ref(null);
    const auditSearchDomainId = ref(null);
    const auditSearchTableId = ref(null);
    const auditSearchTableResult = ref([]);

    // ========== 管理员设置状态 ==========
    const permissionAdmins = ref([
        { id: 'admin_1', name: '陈思思', userName: 'chensisi', department: '数据治理部', domains: ['HR人力资源域', '公共资源库'], addedAt: '2026-01-10', active: true },
        { id: 'admin_2', name: '王建国', userName: 'wangjianguo', department: 'OD组织发展部', domains: ['HR人力资源域'], addedAt: '2026-03-15', active: true },
        { id: 'admin_3', name: '李明', userName: 'liming', department: '信息安全部', domains: ['SRE运维域', 'AI Skills库'], addedAt: '2026-02-20', active: false }
    ]);

    const showAddAdminModal = ref(false);
    const newAdminSearchQuery = ref('');
    const newAdminSearchResults = ref([]);
    const newAdminSelected = ref(null);
    const newAdminDomains = ref([]);

    // Mock 用户搜索库
    const allUsersForSearch = [
        { id: 'u_search_1', name: '陈伟', userName: 'chenwei', department: '财务部' },
        { id: 'u_search_2', name: '张浩', userName: 'zhanghao', department: '产品部' },
        { id: 'u_search_3', name: '李伟', userName: 'liwei', department: '技术部' },
        { id: 'u_search_4', name: '王飞', userName: 'wangfei', department: '运营部' },
        { id: 'u_search_5', name: '孙丽', userName: 'sunli', department: '数据工程部' }
    ];

    const searchNewAdmin = () => {
        const q = newAdminSearchQuery.value.trim().toLowerCase();
        if (!q) { newAdminSearchResults.value = []; return; }
        newAdminSearchResults.value = allUsersForSearch.filter(u =>
            u.name.toLowerCase().includes(q) || u.userName.toLowerCase().includes(q) || u.department.toLowerCase().includes(q)
        );
    };

    const selectNewAdmin = (u) => { newAdminSelected.value = u; newAdminSearchResults.value = []; };

    const addPermissionAdmin = () => {
        if (!newAdminSelected.value || newAdminDomains.value.length === 0) return;
        permissionAdmins.value.push({
            id: 'admin_' + Date.now(),
            name: newAdminSelected.value.name,
            userName: newAdminSelected.value.userName,
            department: newAdminSelected.value.department,
            domains: [...newAdminDomains.value],
            addedAt: new Date().toISOString().slice(0, 10),
            active: true
        });
        showAddAdminModal.value = false;
        newAdminSelected.value = null;
        newAdminSearchQuery.value = '';
        newAdminSearchResults.value = [];
        newAdminDomains.value = [];
    };

    // ========== 方法定义 ==========

    // ========== 代申请状态 ==========
    // 申请对象模式：'self'（为自己）| 'proxy'（替他人）
    const proxyApplyMode = ref('self');
    // 被代申请人（proxy 模式）
    const proxyApplyTargetId = ref('');
    const proxyApplyTargetName = ref('');
    const proxyApplyTargetDept = ref('');
    const proxyApplySearchQuery = ref('');
    const proxyApplySearchResults = ref([]);
    // 可搜索的用户列表（与复制权限共用同一份 mock 数据）
    const searchProxyApplyUsers = () => {
        const q = (proxyApplySearchQuery.value || '').trim().toLowerCase();
        if (!q) { proxyApplySearchResults.value = []; return; }
        const pool = [
            { id: 'user_002', name: '张浩', userName: 'zhanghao', department: '产品部' },
            { id: 'user_003', name: '李伟', userName: 'liwei', department: '技术部' },
            { id: 'user_004', name: '王飞', userName: 'wangfei', department: '运营部' },
            { id: 'user_005', name: '孙丽', userName: 'sunli', department: '数据工程部' },
            { id: 'user_006', name: '陈伟', userName: 'chenwei', department: '财务部' },
            { id: 'user_007', name: '赵欣', userName: 'zhaoxin', department: '市场部' },
            { id: 'user_008', name: '刘洋', userName: 'liuyang', department: '人力资源部' },
            { id: 'user_009', name: '吴敏', userName: 'wumin', department: 'OD组织发展部' }
        ];
        proxyApplySearchResults.value = pool.filter(u =>
            u.name.includes(q) || u.userName.toLowerCase().includes(q) || u.department.includes(q)
        );
    };
    const selectProxyApplyTarget = (user) => {
        proxyApplyTargetId.value = user.id;
        proxyApplyTargetName.value = user.name;
        proxyApplyTargetDept.value = user.department;
        proxyApplySearchQuery.value = user.name;
        proxyApplySearchResults.value = [];
    };
    const hideProxySearchResults = () => { proxyApplySearchResults.value = []; };
    const clearProxyApplyTarget = () => {
        proxyApplyTargetId.value = '';
        proxyApplyTargetName.value = '';
        proxyApplyTargetDept.value = '';
        proxyApplySearchQuery.value = '';
        proxyApplySearchResults.value = [];
    };

    // ========== 多角色选择（按标准角色授权）==========
    // 多个角色的行权限表单（key=roleId，value=rowPermForm）
    const multiRoleRowPermForms = ref({});
    // 当前正在配置行权限的角色 Tab 索引
    const multiRoleActiveTabIdx = ref(0);
    // 选中角色时初始化其行权限表单
    const initMultiRoleRowPermForm = (roleId) => {
        if (!multiRoleRowPermForms.value[roleId]) {
            multiRoleRowPermForms.value[roleId] = createEmptyRowPermForm();
        }
    };
    // 切换多角色 Tab
    const switchMultiRoleTab = (idx) => {
        multiRoleActiveTabIdx.value = idx;
    };
    // 当前多角色 Tab 对应的行权限表单
    const currentMultiRoleRowPermForm = computed(() => {
        const roleId = selectedRoleIds.value[multiRoleActiveTabIdx.value];
        return roleId ? multiRoleRowPermForms.value[roleId] : null;
    });
    // 当前多角色 Tab 对应的角色定义
    const currentMultiRoleRule = computed(() => {
        const roleId = selectedRoleIds.value[multiRoleActiveTabIdx.value];
        return roleId ? columnPermissionRules.value.find(r => r.id === roleId) : null;
    });
    // 切换多角色选中状态（checkbox，最多5个）
    const toggleMultiRoleSelection = (rule) => {
        const idx = selectedRoleIds.value.indexOf(rule.id);
        if (idx !== -1) {
            // 取消选中：移除角色和对应的行权限表单
            selectedRoleIds.value.splice(idx, 1);
            delete multiRoleRowPermForms.value[rule.id];
            // 修正 Tab 索引越界
            if (multiRoleActiveTabIdx.value >= selectedRoleIds.value.length) {
                multiRoleActiveTabIdx.value = Math.max(0, selectedRoleIds.value.length - 1);
            }
        } else {
            if (selectedRoleIds.value.length >= 5) {
                window.alert('单次申请最多选择 5 个角色');
                return;
            }
            selectedRoleIds.value.push(rule.id);
            initMultiRoleRowPermForm(rule.id);
            // 跳到新增角色的 Tab
            multiRoleActiveTabIdx.value = selectedRoleIds.value.length - 1;
        }
        // 更新 permissionApplyForm 中的角色信息
        syncMultiRoleFormMeta();
    };
    // 同步多角色聚合信息到 permissionApplyForm（名称、敏感等级取最高）
    const syncMultiRoleFormMeta = () => {
        const rules = selectedRoleIds.value.map(id => columnPermissionRules.value.find(r => r.id === id)).filter(Boolean);
        if (rules.length === 0) {
            permissionApplyForm.value.roleId = null;
            permissionApplyForm.value.roleName = '';
            permissionApplyForm.value.roleNames = '';
            permissionApplyForm.value.sensitivityLevel = '';
            permissionApplyForm.value.selectedTables = [];
            return;
        }
        const sensitivityOrder = { basic: 0, sensitive: 1, high_sensitive: 2, top_sensitive: 3 };
        const maxSensitivity = rules.reduce((max, r) =>
            (sensitivityOrder[r.sensitivityLevel] || 0) > (sensitivityOrder[max] || 0) ? r.sensitivityLevel : max, 'basic');
        permissionApplyForm.value.roleId = rules.map(r => r.id).join(',');
        permissionApplyForm.value.roleName = rules.map(r => r.name).join('、');
        permissionApplyForm.value.roleNames = rules.map(r => r.name).join('、');
        permissionApplyForm.value.sensitivityLevel = maxSensitivity;
        // 合并所有角色的表列表（去重）
        const tableMap = new Map();
        rules.forEach(r => {
            Object.keys(r.tableFields || {}).forEach(tid => {
                if (!tableMap.has(tid)) {
                    const tbl = availableTablesForColumnPermission.value.find(t => t.id === tid);
                    tableMap.set(tid, tbl ? { id: tbl.id, name: tbl.name, chineseName: tbl.chineseName } : { id: tid, name: tid, chineseName: '' });
                }
            });
        });
        permissionApplyForm.value.selectedTables = Array.from(tableMap.values());
    };
    // 多角色：「复制当前角色行权限到所有角色」
    const copyMultiRoleRowPermToAll = () => {
        const srcId = selectedRoleIds.value[multiRoleActiveTabIdx.value];
        const srcForm = multiRoleRowPermForms.value[srcId];
        if (!srcForm) return;
        selectedRoleIds.value.forEach(roleId => {
            if (roleId !== srcId) {
                multiRoleRowPermForms.value[roleId] = JSON.parse(JSON.stringify(srcForm));
            }
        });
        window.alert(`已将当前行权限配置应用到其他 ${selectedRoleIds.value.length - 1} 个角色，可在对应角色 Tab 下修改。`);
    };
    // 多角色：检测是否有重复申请（已有 approved 权限的角色）
    const duplicateRoleIds = computed(() => {
        return selectedRoleIds.value.filter(roleId => {
            return permissionApplications.value.some(a =>
                a.applicantId === 'user_001' && a.status === 'approved'
                && a.type === 'standard' && a.roleId === roleId
            );
        });
    });

    // ========== 角色选择下拉状态 ==========
    const roleDropdownOpen = ref(false);
    const openRoleDropdown = () => { roleDropdownOpen.value = true; };
    const closeRoleDropdown = () => { roleDropdownOpen.value = false; };
    // 点击下拉选项：选中/取消，然后关闭
    const selectRoleFromDropdown = (rule) => {
        toggleMultiRoleSelection(rule);
        // 选中后不关闭，方便继续多选；搜索词保留
    };
    // 展示某角色详情的卡片展开状态（用 roleId 做 key）
    const expandedRoleDetailId = ref(null);
    const toggleRoleDetailCard = (roleId) => {
        expandedRoleDetailId.value = expandedRoleDetailId.value === roleId ? null : roleId;
    };
    const renewalExpandedRoleId = ref(null);
    const toggleRenewalRoleCard = (roleId) => {
        renewalExpandedRoleId.value = renewalExpandedRoleId.value === roleId ? null : roleId;
    };

    // ========== 模板安全 setter（避免模板直接赋值 ref 丢失响应性）==========
    const setProxyApplyMode = (mode) => { proxyApplyMode.value = mode; };
    const setPermissionApplyType = (type) => { permissionApplyType.value = type; };
    const setApplyStep = (step) => { permissionApplyStep.value = step; };
    const setApplyStepAndReset = (step) => {
        permissionApplyStep.value = step;
        if (step === 1) {
            permissionApplyForm.value.domainId = null;
            permissionApplyForm.value.domainName = '';
        }
    };
    const setCustomApplyConfigIndex = (idx) => { customApplyConfigIndex.value = idx; };

    const startPermissionApply = (type) => {
        permissionApplyType.value = type || '';
        applyMode.value = 'new';
        permissionApplyStep.value = 1;
        permissionApplyForm.value = { domainId: null, domainName: '', roleId: null, roleName: '', roleNames: '', sensitivityLevel: '', selectedTables: [], tableRowFilters: {}, selectedFields: {}, validityDays: 90, reason: '', copyUserId: '', copyUserName: '' };
        customApplySelectedTableIds.value = [];
        roleUnifiedRowPerm.value = null;
        roleUnifiedRowPermRelation.value = 'and';
        selectedRoleIds.value = [];
        expandedRoleId.value = null;
        roleSearchQuery.value = '';
        customApplyConfigIndex.value = 0;
        customApplyFieldSearch.value = {};
        customApplyTableCategory.value = '全部';
        customApplyRowPermForm.value = {};
        customApplyRowPermAutoFilled.value = {};
        // 重置多角色状态
        multiRoleRowPermForms.value = {};
        multiRoleActiveTabIdx.value = 0;
        // 重置角色下拉状态
        roleDropdownOpen.value = false;
        expandedRoleDetailId.value = null;
        // 重置代申请状态
        proxyApplyMode.value = 'self';
        clearProxyApplyTarget();
        // 默认展开所有目录
        const dirs = {};
        const tables = availableTablesForColumnPermission.value || [];
        const catSet = new Set(tables.map(t => t.subCategory || '未分类'));
        catSet.forEach(c => { dirs[c] = true; });
        expandedTableDirs.value = dirs;
        copyPermissionSelectedUserId.value = '';
        copyPermissionSelectedAppIds.value = [];
        copyPermissionSelectedTables.value = {};
        // 重置复制权限新增状态
        copyPermissionSelectedRoleIds.value = [];
        copyPermissionUnifiedRowPerm.value = [];
        copyPermissionRowPermRelation.value = 'and';
        copyExpandedRoleId.value = null;
        // 重置按角色/按表行权限
        copyPermissionRoleRowPerm.value = {};
        // 重置按表申请复制状态
        copyPermissionSelectedCustomTableIds.value = [];
        copyCustomRowPermForm.value = {};
        copyCustomRowPermAutoFilled.value = {};
        copyCustomExpandedTableId.value = null;
        // 重置待添加条件状态
        pendingRowPermCondition.value = null;
        pendingCopyRowPermCondition.value = {};
    };

    const selectPermissionDomain = (domain) => {
        permissionApplyForm.value.domainId = domain.id;
        permissionApplyForm.value.domainName = domain.name;
    };

    const selectApplyPermissionRole = (rule) => {
        permissionApplyForm.value.roleId = rule.id;
        permissionApplyForm.value.roleName = rule.name;
        permissionApplyForm.value.roleNames = rule.name;
        permissionApplyForm.value.sensitivityLevel = rule.sensitivityLevel;
        const tableIds = Object.keys(rule.tableFields);
        permissionApplyForm.value.selectedTables = tableIds.map(tid => {
            const tbl = availableTablesForColumnPermission.value.find(t => t.id === tid);
            return tbl ? { id: tbl.id, name: tbl.name, chineseName: tbl.chineseName } : { id: tid, name: tid, chineseName: '' };
        });
        const rf = {};
        tableIds.forEach(tid => { rf[tid] = []; });
        permissionApplyForm.value.tableRowFilters = rf;
        roleApplyConfigIndex.value = 0;
    };

    // 单选角色：展开/折叠详情
    const expandedRoleId = ref(null);
    const step3RoleDetailExpanded = ref(false);
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
        const tables = availableTablesForColumnPermission.value || [];
        const catSet = new Set(tables.map(t => t.subCategory || '未分类'));
        catSet.forEach(c => { dirs[c] = true; });
        expandedTableDirs.value = dirs;
    };
    const collapseAllTableDirs = () => {
        expandedTableDirs.value = {};
    };

    // 按表申请：按目录分组的表列表
    const groupedTablesByDir = computed(() => {
        const tables = availableTablesForColumnPermission.value || [];
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

    // 单选角色并进入 Step 3
    const selectApplyRoleSingle = (rule) => {
        selectedRoleIds.value = [rule.id];
        permissionApplyForm.value.roleId = rule.id;
        permissionApplyForm.value.roleName = rule.name;
        permissionApplyForm.value.roleNames = rule.name;
        permissionApplyForm.value.sensitivityLevel = rule.sensitivityLevel;
        const tableIds = Object.keys(rule.tableFields);
        permissionApplyForm.value.selectedTables = tableIds.map(tid => {
            const tbl = availableTablesForColumnPermission.value.find(t => t.id === tid);
            return tbl ? { id: tbl.id, name: tbl.name, chineseName: tbl.chineseName } : { id: tid, name: tid, chineseName: '' };
        });
        // 不再逐表配置行权限，重置统一行权限（单选）
        roleUnifiedRowPerm.value = null;
        roleUnifiedRowPermRelation.value = 'and';
        // 保留 tableRowFilters 用于提交时填充，但不再逐表交互
        const rf = {};
        tableIds.forEach(tid => { rf[tid] = []; });
        permissionApplyForm.value.tableRowFilters = rf;
        step3RoleDetailExpanded.value = false;
    };

    // 保留以下函数以向后兼容（不再用于新流程）
    const toggleApplyPermissionRole = (rule) => { selectApplyRoleSingle(rule); };
    const confirmSelectedRoles = () => {};

    // 按表申请：进入逐表配置阶段（Step3）
    const startCustomApplyConfig = () => {
        const selectedTables = availableTablesForColumnPermission.value.filter(t => customApplySelectedTableIds.value.includes(t.id));
        permissionApplyForm.value.selectedTables = selectedTables.map(t => ({ id: t.id, name: t.name, chineseName: t.chineseName }));
        // 初始化每张表的 selectedFields 和 rowPermForm
        selectedTables.forEach(t => {
            // 默认选中分区字段和唯一键字段
            const defaultFields = (t.fields || []).filter(f => f.is_partition || f.is_unique_key).map(f => f.name);
            permissionApplyForm.value.selectedFields[t.id] = defaultFields;
            customApplyRowPermForm.value[t.id] = createEmptyRowPermForm();
        });
        customApplyConfigIndex.value = 0;
        // 重置自动复用标记
        customApplyRowPermAutoFilled.value = {};
        permissionApplyStep.value = 3;
    };

    // 按表申请：导航到下一张表或完成
    // 新增：统一跳转到指定表索引（处理自动复用行权限逻辑）
    // 当向前跳转且目标表为默认空状态时，自动复用当前表的行权限
    const goToCustomTable = (idx) => {
        if (idx === customApplyConfigIndex.value) return;
        const total = permissionApplyForm.value.selectedTables.length;
        if (idx < 0 || idx >= total) return;
        // 仅向前跳转时触发自动复用
        if (idx > customApplyConfigIndex.value) {
            const srcId = permissionApplyForm.value.selectedTables[customApplyConfigIndex.value].id;
            const dstId = permissionApplyForm.value.selectedTables[idx].id;
            const srcForm = customApplyRowPermForm.value[srcId];
            const dstForm = customApplyRowPermForm.value[dstId];
            // 判断目标表是否为默认空状态（结构化模式且所有数组为空、contractEntity 为空、自定义内容为空）
            const isDstDefault = dstForm && dstForm.mode === 'structured'
                && Array.isArray(dstForm.org) && dstForm.org.length === 0
                && Array.isArray(dstForm.family) && dstForm.family.length === 0
                && Array.isArray(dstForm.channel) && dstForm.channel.length === 0
                && Array.isArray(dstForm.level) && dstForm.level.length === 0
                && Array.isArray(dstForm.workLocation) && dstForm.workLocation.length === 0
                && Array.isArray(dstForm.empType) && dstForm.empType.length === 0
                && Array.isArray(dstForm.empNature) && dstForm.empNature.length === 0
                && (!dstForm.contractEntity || dstForm.contractEntity === '')
                && (!dstForm.customExpression || dstForm.customExpression.trim() === '');
            // 判断源表是否有配置过行权限（结构化模式有条件值，或自定义模式有内容）
            const srcHasConfig = srcForm && (
                (srcForm.mode === 'custom' && srcForm.customExpression && srcForm.customExpression.trim() !== '') ||
                (srcForm.org && srcForm.org.length > 0) ||
                (srcForm.family && srcForm.family.length > 0) ||
                (srcForm.channel && srcForm.channel.length > 0) ||
                (srcForm.level && srcForm.level.length > 0) ||
                (srcForm.workLocation && srcForm.workLocation.length > 0) ||
                (srcForm.empType && srcForm.empType.length > 0) ||
                (srcForm.empNature && srcForm.empNature.length > 0) ||
                (srcForm.contractEntity)
            );
            if (isDstDefault && srcHasConfig) {
                // 深拷贝源表行权限到目标表，避免引用共享
                customApplyRowPermForm.value[dstId] = JSON.parse(JSON.stringify(srcForm));
                // 标记为自动复用，用于展示 banner 提示
                customApplyRowPermAutoFilled.value[dstId] = true;
            }
        }
        customApplyConfigIndex.value = idx;
    };
    const customApplyNextTable = () => {
        const total = permissionApplyForm.value.selectedTables.length;
        if (customApplyConfigIndex.value < total - 1) {
            goToCustomTable(customApplyConfigIndex.value + 1);
        }
    };
    const customApplyPrevTable = () => {
        if (customApplyConfigIndex.value > 0) customApplyConfigIndex.value--;
    };
    // 「应用到其他表」：把当前表（第一张表）的行权限深拷贝到其他所有表，其他表可继续修改
    const copyRowPermToOtherTables = () => {
        const srcId = permissionApplyForm.value.selectedTables[customApplyConfigIndex.value].id;
        const srcForm = customApplyRowPermForm.value[srcId];
        if (!srcForm) return;
        let count = 0;
        permissionApplyForm.value.selectedTables.forEach(t => {
            if (t.id !== srcId) {
                customApplyRowPermForm.value[t.id] = JSON.parse(JSON.stringify(srcForm));
                customApplyRowPermAutoFilled.value[t.id] = true;
                count++;
            }
        });
        if (count > 0) {
            window.alert(`已将当前行权限配置应用到其他 ${count} 张表，可在对应表下进行修改。`);
        }
    };

    // 当前生效的行权限表单：始终返回当前表自己的表单（各表独立可编辑）
    const currentRowPermForm = computed(() => {
        const cur = permissionApplyForm.value.selectedTables[customApplyConfigIndex.value];
        return cur ? customApplyRowPermForm.value[cur.id] : null;
    });

    const copyUserPermissions = computed(() => {
        if (!copyPermissionSelectedUserId.value) return [];
        return permissionApplications.value.filter(a => a.applicantId === copyPermissionSelectedUserId.value && ['approved','expired','revoked'].includes(a.status));
    });

    // 新增：被复制用户的标准角色列表（按 roleId 去重，附带原行权限作为默认值）
    // 每个角色包含：roleId, roleName, sensitivityLevel, sourceAppId, sourceExpireAt, defaultRowFilters, defaultRelation, tableFields
    const copyUserStandardRoles = computed(() => {
        if (!copyPermissionSelectedUserId.value) return [];
        const apps = permissionApplications.value.filter(a =>
            a.applicantId === copyPermissionSelectedUserId.value
            && a.type === 'standard'
            && ['approved','expired','revoked'].includes(a.status)
        );
        // 按 roleId 去重（同一角色可能有多条申请，取最近一条 approved 的）
        const roleMap = new Map();
        // 先按 appliedAt 倒序排，确保取最近
        const sorted = [...apps].sort((a, b) => (b.appliedAt || '').localeCompare(a.appliedAt || ''));
        sorted.forEach(a => {
            if (a.roleId && !roleMap.has(a.roleId)) {
                // 从 columnPermissionRules 取该角色的 tableFields（用于展开查看表和字段）
                const ruleDef = columnPermissionRules.value.find(r => r.id === a.roleId);
                roleMap.set(a.roleId, {
                    roleId: a.roleId,
                    roleName: a.roleName,
                    sensitivityLevel: a.sensitivityLevel,
                    sourceAppId: a.id,
                    sourceExpireAt: a.expireAt,
                    // 提取该角色原申请中的行权限（取所有表的并集）
                    defaultRowFilters: a.tables.flatMap(t => (t.rowFilters || []).map(f => ({ id: f.id, label: f.label }))),
                    defaultRelation: (a.tables[0] && a.tables[0].condRelation === 'or') ? 'or' : 'and',
                    tableFields: ruleDef ? ruleDef.tableFields : {},
                    roleType: ruleDef ? ruleDef.roleType : null
                });
            }
        });
        return Array.from(roleMap.values());
    });

    // 新增：被复制用户的按表申请权限列表（type === 'custom'）
    // 每个条目包含：appId, tableId, tableName, chineseName, fields（列权限，只读）, rowFilters（行权限，回显）
    const copyUserCustomTables = computed(() => {
        if (!copyPermissionSelectedUserId.value) return [];
        const apps = permissionApplications.value.filter(a =>
            a.applicantId === copyPermissionSelectedUserId.value
            && a.type === 'custom'
            && ['approved','expired','revoked'].includes(a.status)
        );
        // 按 appliedAt 倒序排
        const sorted = [...apps].sort((a, b) => (b.appliedAt || '').localeCompare(a.appliedAt || ''));
        // 按 tableId 去重（同一表可能有多条申请，取最近一条）
        const tableMap = new Map();
        sorted.forEach(a => {
            (a.tables || []).forEach(t => {
                if (!tableMap.has(t.tableId)) {
                    tableMap.set(t.tableId, {
                        sourceAppId: a.id,
                        tableId: t.tableId,
                        tableName: t.tableName,
                        chineseName: t.chineseName || '',
                        fields: t.fields || [], // 列权限
                        sensitivityLevel: a.sensitivityLevel,
                        rowFilters: t.rowFilters || [] // 行权限（从原申请回显）
                    });
                }
            });
        });
        return Array.from(tableMap.values());
    });

    // 新增：复制权限 - 选中的按表申请表 ID 列表
    const copyPermissionSelectedCustomTableIds = ref([]);
    // 新增：复制权限 - 按表申请每张表的行权限表单（从被复制人回显，可编辑）
    const copyCustomRowPermForm = ref({});
    // 新增：复制权限 - 按表申请行权限自动复用标记
    const copyCustomRowPermAutoFilled = ref({});
    // 新增：复制权限 - 按表申请展开的表 ID
    const copyCustomExpandedTableId = ref(null);

    const toggleCopyCustomTableExpand = (tableId) => {
        copyCustomExpandedTableId.value = copyCustomExpandedTableId.value === tableId ? null : tableId;
    };
    const toggleCopyCustomTableSelection = (tableId) => {
        const idx = copyPermissionSelectedCustomTableIds.value.indexOf(tableId);
        if (idx === -1) {
            copyPermissionSelectedCustomTableIds.value.push(tableId);
        } else {
            copyPermissionSelectedCustomTableIds.value.splice(idx, 1);
        }
    };
    const selectAllCopyCustomTables = () => {
        copyPermissionSelectedCustomTableIds.value = copyUserCustomTables.value.map(t => t.tableId);
    };
    const clearAllCopyCustomTables = () => {
        copyPermissionSelectedCustomTableIds.value = [];
    };

    const selectCopyPermissionUser = (userId) => {
        copyPermissionSelectedUserId.value = userId;
        copyPermissionSelectedAppIds.value = [];
        copyPermissionSelectedTables.value = [];
        const user = copyPermissionUsers.value.find(u => u.id === userId);
        permissionApplyForm.value.copyUserId = user ? user.id : '';
        permissionApplyForm.value.copyUserName = user ? user.name : '';
        // 选人后不自动勾选任何角色或行权限，由用户自行选择
        copyPermissionSelectedRoleIds.value = [];
        copyPermissionUnifiedRowPerm.value = [];
        copyPermissionRowPermRelation.value = 'and';
        // 重置按角色行权限
        copyPermissionRoleRowPerm.value = {};
        // 重置按表申请复制状态
        copyPermissionSelectedCustomTableIds.value = [];
        copyCustomRowPermForm.value = {};
        copyCustomRowPermAutoFilled.value = {};
        copyCustomExpandedTableId.value = null;
        // 重置 form 的角色信息
        permissionApplyForm.value.roleId = '';
        permissionApplyForm.value.roleName = '';
        permissionApplyForm.value.roleNames = '';
        permissionApplyForm.value.sensitivityLevel = 'basic';
        // 初始化按表申请行权限表单（从被复制人回显）
        // 延迟到 copyUserCustomTables 计算后通过 watch 初始化
    };

    // Watch: 选人后自动初始化标准角色的行权限（从被复制人数据回显，单选：只取第一条）
    watch(() => copyUserStandardRoles.value, (roles) => {
        if (roles.length === 0) {
            copyPermissionRoleRowPerm.value = {};
            return;
        }
        const perms = {};
        roles.forEach(r => {
            // 单选：每个角色只取第一条行权限规则
            const firstFilter = r.defaultRowFilters && r.defaultRowFilters.length > 0 ? r.defaultRowFilters[0] : null;
            perms[r.roleId] = firstFilter ? {id: firstFilter.id, label: firstFilter.label} : null;
        });
        copyPermissionRoleRowPerm.value = perms;
    }, { immediate: true });

    // Watch: 选人后自动初始化按表申请的行权限（从被复制人数据回显）
    watch(() => copyUserCustomTables.value, (tables) => {
        if (tables.length === 0) {
            copyCustomRowPermForm.value = {};
            return;
        }
        // 用转换函数预填每张表的行权限表单（从 rowFilters 回显）
        const forms = {};
        tables.forEach(t => {
            forms[t.tableId] = convertRowFiltersToForm(t.rowFilters || []);
        });
        copyCustomRowPermForm.value = forms;
        copyPermissionSelectedCustomTableIds.value = [];
    }, { immediate: true });

    // 合计已选行权限 ID 列表（供有效期和审批流判断使用）
    // 角色行权限取单选预制规则的 ID；按表申请行权限取表单中激活条件 condKey 列表
    const copyAllRowPermIds = computed(() => {
        const ids = [];
        const seen = new Set();
        copyPermissionSelectedRoleIds.value.forEach(roleId => {
            const perm = copyPermissionRoleRowPerm.value[roleId];
            if (perm && !seen.has(perm.id)) { seen.add(perm.id); ids.push(perm.id); }
        });
        copyPermissionSelectedCustomTableIds.value.forEach(tableId => {
            const form = copyCustomRowPermForm.value[tableId];
            if (form) {
                form.activeConditions.forEach(key => {
                    if (!seen.has(key)) { seen.add(key); ids.push(key); }
                });
            }
        });
        return ids;
    });

    // 切换角色行权限选中（单选：每个角色只能选一条行权限规则）
    const toggleCopyRoleRowPerm = (roleId, ruleId, ruleLabel) => {
        const current = copyPermissionRoleRowPerm.value[roleId];
        // 如果点击已选中的规则，取消选中；否则选中该规则
        if (current && current.id === ruleId) {
            copyPermissionRoleRowPerm.value[roleId] = null;
        } else {
            copyPermissionRoleRowPerm.value[roleId] = {id: ruleId, label: ruleLabel};
        }
    };

    // 新增：复制权限 - 切换角色选中状态（允许用户取消某个角色）
    const toggleCopyRoleSelection = (roleId) => {
        const idx = copyPermissionSelectedRoleIds.value.indexOf(roleId);
        if (idx === -1) {
            copyPermissionSelectedRoleIds.value.push(roleId);
        } else {
            copyPermissionSelectedRoleIds.value.splice(idx, 1);
        }
        // 更新 form 的角色信息
        updateCopyFormRoleInfo();
    };

    // 新增：复制权限 - 全选/清空角色
    const selectAllCopyRoles = () => {
        copyPermissionSelectedRoleIds.value = copyUserStandardRoles.value.map(r => r.roleId);
        updateCopyFormRoleInfo();
    };
    const clearAllCopyRoles = () => {
        copyPermissionSelectedRoleIds.value = [];
        updateCopyFormRoleInfo();
    };

    // 新增：复制权限 - 同步 form 的角色信息（敏感等级取最高）
    const updateCopyFormRoleInfo = () => {
        const selectedRoles = copyUserStandardRoles.value.filter(r => copyPermissionSelectedRoleIds.value.includes(r.roleId));
        if (selectedRoles.length > 0) {
            permissionApplyForm.value.roleId = selectedRoles.map(r => r.roleId).join(',');
            permissionApplyForm.value.roleName = selectedRoles.map(r => r.roleName).join('、');
            permissionApplyForm.value.roleNames = selectedRoles.map(r => r.roleName).join('、');
            const sensitivityOrder = { basic: 0, sensitive: 1, high_sensitive: 2, top_sensitive: 3 };
            permissionApplyForm.value.sensitivityLevel = selectedRoles.reduce((max, r) =>
                (sensitivityOrder[r.sensitivityLevel] || 0) > (sensitivityOrder[max] || 0) ? r.sensitivityLevel : max, 'basic');
        } else {
            permissionApplyForm.value.roleId = '';
            permissionApplyForm.value.roleName = '';
            permissionApplyForm.value.roleNames = '';
            permissionApplyForm.value.sensitivityLevel = 'basic';
        }
    };

    // 新增：复制权限 - 展开/收起角色详情
    const toggleCopyRoleExpand = (roleId) => {
        copyExpandedRoleId.value = copyExpandedRoleId.value === roleId ? null : roleId;
    };

    const submitCopyPermissionApplication = () => {
        // 仅使用选中的标准角色组装申请
        const selectedRoles = copyUserStandardRoles.value.filter(r => copyPermissionSelectedRoleIds.value.includes(r.roleId));
        if (selectedRoles.length === 0) return;
        // 组装 tables：仅标准角色下的所有表
        const tables = [];
        const tableIdSet = new Set(); // 去重（多个角色可能覆盖同一张表）
        selectedRoles.forEach(role => {
            const tableIds = Object.keys(role.tableFields || {});
            tableIds.forEach(tid => {
                if (tableIdSet.has(tid)) return; // 同表只取第一次
                tableIdSet.add(tid);
                const tbl = availableTablesForColumnPermission.value.find(t => t.id === tid);
                tables.push({
                    tableId: tid,
                    tableName: tbl ? tbl.name : tid,
                    chineseName: tbl ? tbl.chineseName : '',
                    fields: role.tableFields[tid] || [],
                    rowFilters: [],
                    condRelation: 'and'
                });
            });
        });
        if (tables.length === 0) return;
        const d = new Date();
        d.setDate(d.getDate() + permissionApplyForm.value.validityDays);
        permissionApplications.value.unshift({
            id: 'app_copy_' + Date.now(),
            type: 'copy',
            source: '主动申请',
            copiedFromUserId: permissionApplyForm.value.copyUserId,
            copiedFromUserName: permissionApplyForm.value.copyUserName,
            roleId: selectedRoles.map(r => r.roleId).join(','),
            roleName: selectedRoles.map(r => r.roleName).join('、') || '-',
            roleNames: selectedRoles.map(r => r.roleName).join('、') || '-',
            sensitivityLevel: permissionApplyForm.value.sensitivityLevel || 'basic',
            domainName: permissionApplyForm.value.domainName,
            tables: tables,
            validityDays: permissionApplyForm.value.validityDays,
            expireAt: d.toISOString().slice(0, 10),
            reason: permissionApplyForm.value.reason,
            status: 'pending',
            expireReason: '',
            bpmProcessId: 'bpm_copy_' + Date.now(),
            approvalNodes: getSensitivityApprovalNodes(permissionApplyForm.value.sensitivityLevel || 'basic'),
            appliedAt: new Date().toISOString().slice(0, 10),
            approvedAt: null,
            applicantId: 'user_001',
            applicantName: '陈思思'
        });
        showApplyFlow.value = true;
        permissionApplyStep.value = 0;
        applyMode.value = 'new';
    };

    const getPermissionRows = () => {
        const rows = [];
        permissionApplications.value.filter(a => a.applicantId === 'user_001' && ['approved','expired','revoked'].includes(a.status)).forEach(app => {
            if (app.type === 'custom') {
                // 按表申请：每张表单独一行
                app.tables.forEach(t => rows.push({ app, tables: [t], isCustomTableRow: true }));
            } else {
                // 按角色申请：一个角色一行，包含所有表
                rows.push({ app, tables: app.tables, isCustomTableRow: false });
            }
        });
        return rows;
    };

    const matchText = (value, keyword) => !keyword || String(value || '').toLowerCase().includes(String(keyword).toLowerCase());

    const filteredApplications = computed(() => permissionApplications.value.filter(a => {
        if (a.applicantId !== 'user_001') return false;
        const f = applicationFilters.value;
        const dateMatch = (!f.appliedAtStart || a.appliedAt >= f.appliedAtStart) && (!f.appliedAtEnd || a.appliedAt <= f.appliedAtEnd);
        return (!f.authType || a.type === f.authType) &&
            matchText(a.roleNames || a.roleName, f.roleName) &&
            matchText(a.tables.map(t => t.tableName).join(' '), f.tableName) &&
            dateMatch &&
            (!f.status || a.status === f.status);
    }));

    const filteredApprovalItems = computed(() => myApprovalItems.value.filter(item => {
        const f = approvalFilters.value;
        return matchText(item.applicantName + item.applicantId, f.applicant) &&
            (!f.authType || item.type === f.authType) &&
            matchText(item.roleNames || item.roleName, f.roleName) && matchText(item.tables.map(t => t.tableName).join(' '), f.tableName) &&
            (!f.appliedAt || item.appliedAt.startsWith(f.appliedAt)) && (!f.status || item.myApprovalStatus === f.status);
    }));

    const filteredPermissionRows = computed(() => getPermissionRows().filter(row => {
        const f = permissionFilters.value;
        const app = row.app;
        const expireOk = (!f.expireStart || app.expireAt >= f.expireStart) && (!f.expireEnd || app.expireAt <= f.expireEnd);
        return (!f.source || (app.source || '主动申请') === f.source) &&
            matchText(app.type === 'custom' ? '【非标角色】曲景怡qujingyi' : (app.roleNames || app.roleName), f.roleName) &&
            matchText(row.tables.map(t => t.tableName).join(' '), f.tableName) && expireOk && (!f.status || app.status === f.status);
    }));

    const permissionStatusLabel = (status) => status === 'approved' ? '生效中' : '已失效';
    const permissionStatusClass = (status) => status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500';
    const permissionExpireReason = (app) => {
        if (app.status === 'approved') return '-';
        if (app.expireReason) return app.expireReason;
        if (app.status === 'revoked') return '主动归还';
        return '权限过期';
    };

    const submitPermissionApplication = () => {
        const form = permissionApplyForm.value;
        // 多角色（标准角色授权）时：将各角色行权限表单汇入 tableRowFilters，并校验
        if (permissionApplyType.value === 'standard' && selectedRoleIds.value.length > 1) {
            // 检测重复申请
            if (duplicateRoleIds.value.length > 0) {
                const names = duplicateRoleIds.value.map(id => {
                    const r = columnPermissionRules.value.find(r => r.id === id);
                    return r ? r.name : id;
                }).join('、');
                const ok = window.confirm(`「${names}」已有生效中的权限，是否继续提交？（续签请从「我的权限」入口操作）`);
                if (!ok) return;
            }
            // 验证每个角色的行权限
            for (const roleId of selectedRoleIds.value) {
                const f = multiRoleRowPermForms.value[roleId];
                const rule = columnPermissionRules.value.find(r => r.id === roleId);
                if (!f) continue;
                if (f.mode === 'structured' && (!f.org || f.org.length === 0)) {
                    const tabIdx = selectedRoleIds.value.indexOf(roleId);
                    if (tabIdx >= 0) multiRoleActiveTabIdx.value = tabIdx;
                    window.alert(`请填写「${rule ? rule.name : roleId}」角色的所在组织`);
                    return;
                }
                if (f.mode === 'custom' && (!f.customExpression || f.customExpression.trim() === '')) {
                    const tabIdx = selectedRoleIds.value.indexOf(roleId);
                    if (tabIdx >= 0) multiRoleActiveTabIdx.value = tabIdx;
                    window.alert(`请填写「${rule ? rule.name : roleId}」角色的自定义行权限`);
                    return;
                }
            }
        }
        // 按表申请时：将自定义行权限表单转为 tableRowFilters
        if (permissionApplyType.value === 'custom') {
            const forms = customApplyRowPermForm.value;
            // 验证：结构化模式→所在组织必填；自定义模式→表达式必填
            for (const t of form.selectedTables) {
                const f = forms[t.id];
                if (!f) continue;
                if (f.mode === 'custom') {
                    if (!f.customExpression || f.customExpression.trim() === '') {
                        // 跳转到缺失内容的表
                        const idx = form.selectedTables.findIndex(st => st.id === t.id);
                        if (idx >= 0) customApplyConfigIndex.value = idx;
                        window.alert(`请填写「${t.name}」的自定义行权限`);
                        return;
                    }
                } else {
                    if (!f.org || f.org.length === 0) {
                        // 跳转到缺失所在组织的表
                        const idx = form.selectedTables.findIndex(st => st.id === t.id);
                        if (idx >= 0) customApplyConfigIndex.value = idx;
                        window.alert(`请填写「${t.name}」的所在组织`);
                        return;
                    }
                }
            }
            form.selectedTables.forEach(t => {
                form.tableRowFilters[t.id] = convertFormToRowFilters(forms[t.id]);
            });
        }
        // 构建代申请人信息
        const isProxy = proxyApplyMode.value === 'proxy' && proxyApplyTargetId.value;
        const applicantId = isProxy ? proxyApplyTargetId.value : 'user_001';
        const applicantName = isProxy ? proxyApplyTargetName.value : '陈思思';
        const proxyInfo = isProxy ? { proxyApplicantId: 'user_001', proxyApplicantName: '陈思思' } : {};
        // 构建多角色详情数组（standard 时存每个角色的独立信息）
        const rolesDetail = permissionApplyType.value === 'standard' && selectedRoleIds.value.length > 0
            ? selectedRoleIds.value.map(roleId => {
                const rule = columnPermissionRules.value.find(r => r.id === roleId);
                const rowPermForm = multiRoleRowPermForms.value[roleId] || {};
                // 把行权限 form 转成 rowFilters 格式
                let rowFilters = [];
                if (rowPermForm.mode === 'custom' && rowPermForm.customExpression) {
                    rowFilters = [{ label: rowPermForm.customExpression, isCustomExpr: true }];
                } else if (rowPermForm.mode === 'structured' && rowPermForm.org && rowPermForm.org.length > 0) {
                    rowFilters = rowPermForm.org.map(o => ({ label: `所在组织：${o}`, field: 'zero_dept_name', operator: '=', value: o }));
                }
                // 该角色覆盖的表
                const tables = Object.keys(rule?.tableFields || {}).map(tableId => {
                    const tbl = availableTablesForColumnPermission.value.find(t => t.id === tableId);
                    return {
                        tableId, tableName: tbl?.name || tableId, chineseName: tbl?.chineseName || '',
                        fields: rule.tableFields[tableId] || [],
                        rowFilters
                    };
                });
                return {
                    roleId, roleName: rule?.name || roleId,
                    sensitivityLevel: rule?.sensitivityLevel || 'basic',
                    description: rule?.description || '',
                    tables
                };
            })
            : null;

        const newApp = {
            id: 'app_' + Date.now(),
            type: permissionApplyType.value,
            source: '主动申请',
            roleId: form.roleId,
            roleName: form.roleName || '自定义权限',
            roleNames: form.roleNames || form.roleName || '自定义权限',
            sensitivityLevel: form.sensitivityLevel,
            domainName: form.domainName,
            // 多角色独立详情（standard 时使用）
            roles: rolesDetail,
            tables: form.selectedTables.map(t => ({
                tableId: t.id, tableName: t.name, chineseName: t.chineseName,
                fields: form.selectedFields[t.id] || [],
                rowFilters: form.tableRowFilters[t.id] || [],
                condRelation: permissionApplyType.value === 'standard' ? 'and' : undefined
            })),
            validityDays: form.validityDays,
            expireAt: (() => { const d = new Date(); d.setDate(d.getDate() + form.validityDays); return d.toISOString().slice(0, 10); })(),
            reason: form.reason, status: 'pending', expireReason: '',
            bpmProcessId: 'bpm_mock_' + Date.now(),
            approvalNodes: getSensitivityApprovalNodes(form.sensitivityLevel),
            appliedAt: new Date().toISOString().slice(0, 10),
            approvedAt: null,
            applicantId,
            applicantName,
            ...proxyInfo
        };
        permissionApplications.value.unshift(newApp);
        permissionApplyStep.value = 0;
    };

    const getSensitivityApprovalNodes = (level) => {
        const base = [{ name: '初审', status: 'current', approver: '王建国', doneAt: null }, { name: '系统开通', status: 'pending', approver: '系统自动', doneAt: null }, { name: '终审', status: 'pending', approver: '李晓明', doneAt: null }];
        const sensitive = [{ name: '初审', status: 'current', approver: '王建国', doneAt: null }, { name: '汇报线上级', status: 'pending', approver: '（待定）', doneAt: null }, { name: 'OD负责人', status: 'pending', approver: '陈OD', doneAt: null }, { name: '系统开通', status: 'pending', approver: '系统自动', doneAt: null }, { name: '终审', status: 'pending', approver: '李晓明', doneAt: null }];
        const highSensitive = [...sensitive.slice(0, 3), { name: '高敏审批人', status: 'pending', approver: '董事长办公室', doneAt: null }, ...sensitive.slice(3)];
        const topSensitive = [...highSensitive.slice(0, 4), { name: '顶级审批人', status: 'pending', approver: '分管VP', doneAt: null }, ...highSensitive.slice(4)];
        if (level === 'basic') return base;
        if (level === 'sensitive') return sensitive;
        if (level === 'high_sensitive') return highSensitive;
        if (level === 'top_sensitive') return topSensitive;
        return base;
    };

    const addPermissionRowFilter = (tableId) => {
        if (!permissionApplyForm.value.tableRowFilters[tableId]) permissionApplyForm.value.tableRowFilters[tableId] = [];
        permissionApplyForm.value.tableRowFilters[tableId].push({ field: '', operator: '=', value: '', valueType: 'value' });
    };
    const removePermissionRowFilter = (tableId, idx) => { permissionApplyForm.value.tableRowFilters[tableId].splice(idx, 1); };

    const submitRenewal = () => {
        const app = renewalTarget.value;
        const d = new Date(); d.setDate(d.getDate() + permissionApplyForm.value.validityDays);
        const newApp = { ...app, id: 'app_renew_' + Date.now(), validityDays: permissionApplyForm.value.validityDays, expireAt: d.toISOString().slice(0, 10), reason: renewalReason.value, status: 'pending', expireReason: '', bpmProcessId: 'bpm_renew_' + Date.now(), approvalNodes: getSensitivityApprovalNodes(app.sensitivityLevel), appliedAt: new Date().toISOString().slice(0, 10), approvedAt: null, isRenewal: true, renewedFromId: app.id };
        permissionApplications.value.unshift(newApp);
        permissionApplyStep.value = 0;
        applyMode.value = 'new';
    };

    const openRevokeConfirm = (app) => { revokeTarget.value = app; showRevokeConfirm.value = true; };
    const confirmRevoke = () => { revokeTarget.value.status = 'revoked'; revokeTarget.value.expireReason = '主动归还'; revokeTarget.value.revokedAt = new Date().toISOString().slice(0, 10); showRevokeConfirm.value = false; revokeTarget.value = null; };

    const cancelApplication = (app) => { if (app.status === 'pending') app.status = 'cancelled'; };

    const openFreezeConfirm = (app, action) => { freezeTarget.value = app; freezeAction.value = action; showFreezeConfirm.value = true; };
    const confirmFreezeAction = () => {
        if (freezeAction.value === 'freeze') { freezeTarget.value.status = 'frozen'; freezeTarget.value.frozenAt = new Date().toISOString().slice(0, 10); }
        else { const app = freezeTarget.value; const today = new Date().toISOString().slice(0, 10); app.status = app.expireAt < today ? 'expired' : 'approved'; app.frozenAt = null; }
        showFreezeConfirm.value = false; freezeTarget.value = null;
    };

    const auditSearchByPerson = () => { const q = auditSearchPersonQuery.value.trim().toLowerCase(); if (!q) return; auditSearchPersonResult.value = permissionApplications.value.filter(a => a.applicantName.toLowerCase().includes(q) || a.applicantId.toLowerCase().includes(q)); };
    const auditSearchByTable = () => { if (!auditSearchTableId.value) return; const tid = auditSearchTableId.value; auditSearchTableResult.value = permissionApplications.value.filter(a => ['approved','frozen'].includes(a.status) && a.tables.some(t => t.tableId === tid)); };

    const sensitivityLevelLabel = (level) => { const map = { basic: '基础', sensitive: '敏感', high_sensitive: '高敏', top_sensitive: '极高敏' }; return map[level] || level || '—'; };
    const sensitivityLevelClass = (level) => { const map = { basic: 'bg-green-100 text-green-700', sensitive: 'bg-yellow-100 text-yellow-700', high_sensitive: 'bg-orange-100 text-orange-700', top_sensitive: 'bg-red-100 text-red-700' }; return map[level] || 'bg-gray-100 text-gray-500'; };

    // 审批流配置：不同角色类型对应不同审批节点
    // roleType 可选值：BP, R, 通道BP, ODBP, OD, CB, 生态用工, SSC, HRPA, OD极高敏
    const approvalFlowConfig = {
        'BP': ['直接上级', '权限管理', 'BPH', '系统侧开通'],
        'R': ['直接上级', '权限管理', 'BPH', 'C招负责人', '系统侧开通'],
        '通道BP': ['直接上级', '权限管理', 'OD通道负责人', '系统侧开通'],
        'ODBP': ['直接上级', '权限管理', 'OD部门负责人', 'BPH', '系统侧开通'],
        'OD': ['直接上级', '权限管理', 'OD部门负责人', '系统侧开通'],
        'CB': ['直接上级', '权限管理', 'CB部门负责人', '系统侧开通'],
        '生态用工': ['直接上级', '权限管理', '生态用工部门负责人', '系统侧开通'],
        'SSC': ['直接上级', '权限管理', 'SSC部门负责人', '系统侧开通'],
        'HRPA': ['直接上级', '权限管理', 'HRPA部门负责人', '系统侧开通'],
        'OD极高敏': ['直接上级', '权限管理', 'OD/CB负责人', 'HR负责人（琳姐）', '系统侧开通（知会BPH+HRPA）']
    };
    // 检查行权限是否需要 BPH 审批（标准角色/复制申请用，基于预定义规则ID）
    // 触发条件：行权限包含 E14 及以上数据（isHighLevel），或超过自己所管辖的部门范围（!isManagedScope）
    const rowPermNeedsBPH = (rowPermIds) => {
        if (!rowPermIds || rowPermIds.length === 0) return false;
        return rowPermIds.some(rid => {
            const rule = hrRowPermRules.find(r => r.id === rid);
            if (!rule) return false;
            return rule.isHighLevel === true || rule.isManagedScope === false;
        });
    };
    // 按表申请的行权限是否需要 BPH（基于自定义表单中的职级选择）
    // 触发条件：选中的职级包含 E14 及以上
    const highLevelValues = ['E14','E15','E16','M1','M2','M3','M4'];
    const customRowPermNeedsBPH = () => {
        const forms = customApplyRowPermForm.value;
        for (const tid in forms) {
            const f = forms[tid];
            if (f && f.level && f.level.some(l => highLevelValues.includes(l))) return true;
        }
        return false;
    };
    // 按表申请是否选了高敏字段（C3/C4）
    const customHasHighSensitiveFields = () => {
        const selectedFieldsMap = permissionApplyForm.value.selectedFields || {};
        const tables = availableTablesForColumnPermission.value || [];
        for (const tid in selectedFieldsMap) {
            const selected = selectedFieldsMap[tid] || [];
            if (selected.length === 0) continue;
            const table = tables.find(t => t.id === tid);
            if (!table || !table.fields) continue;
            const hasHigh = table.fields.some(f => selected.includes(f.name) && (f.securityLevel === 'C3' || f.securityLevel === 'C4'));
            if (hasHigh) return true;
        }
        return false;
    };
    // 是否应隐藏 365 天有效期选项
    // 标准角色：角色本身高敏/极高敏，或行权限含 E14+
    // 按表申请：选了高敏字段（C3/C4），或行权限含 E14+
    // 复制申请：被复制权限高敏/极高敏，或行权限含 E14+
    const shouldHide365Validity = (roleType, sensitivityLevel, rowPermIds, isCustom) => {
        // 角色敏感等级判断（标准/复制）
        if (sensitivityLevel === 'high_sensitive' || sensitivityLevel === 'top_sensitive') return true;
        // 行权限 BPH 触发条件（也意味着高敏场景）
        if (rowPermIds && rowPermNeedsBPH(rowPermIds)) return true;
        // 按表申请：高敏字段
        if (isCustom && customHasHighSensitiveFields()) return true;
        // 按表申请：行权限职级含 E14+
        if (isCustom && customRowPermNeedsBPH()) return true;
        return false;
    };
    // 标准角色的有效期可用天数列表（高敏时去掉 365）
    const getValidityDays = (roleType, sensitivityLevel, rowPermIds, isCustom) => {
        const base = [7, 30, 90, 180, 365];
        if (shouldHide365Validity(roleType, sensitivityLevel, rowPermIds, isCustom)) {
            return base.filter(d => d !== 365);
        }
        return base;
    };
    // 监听：当 365 应被隐藏但当前选了 365，则重置为 180
    watch(() => [
        permissionApplyForm.value.roleId,
        permissionApplyForm.value.sensitivityLevel,
        roleUnifiedRowPerm.value ? [roleUnifiedRowPerm.value.id] : [],
        customApplyRowPermForm.value,
        permissionApplyForm.value.selectedFields
    ], () => {
        if (permissionApplyForm.value.validityDays === 365) {
            const role = columnPermissionRules.value.find(r => r.id === permissionApplyForm.value.roleId);
            const isCustom = permissionApplyType.value === 'custom';
            if (shouldHide365Validity(role?.roleType, permissionApplyForm.value.sensitivityLevel, roleUnifiedRowPerm.value ? [roleUnifiedRowPerm.value.id] : [], isCustom)) {
                permissionApplyForm.value.validityDays = 180;
            }
        }
    }, { deep: true });
    // 根据角色类型或敏感等级获取审批流
    // roleType：标准/复制申请用角色类型；sensitivityLevel：按表申请用敏感等级推断
    // needsBPH：行权限是否触发 BPH 审批条件
    const getApprovalFlow = (roleType, sensitivityLevel, needsBPH) => {
        let type = roleType;
        if (!type && sensitivityLevel) {
            type = sensitivityLevel === 'top_sensitive' ? 'OD极高敏' : 'OD';
        }
        let flow = [...(approvalFlowConfig[type] || approvalFlowConfig['OD'])];
        // 如果行权限触发 BPH 条件，且当前流程不含 BPH，则在「系统侧开通」前插入 BPH
        if (needsBPH && !flow.some(n => n === 'BPH' || n.includes('BPH'))) {
            const sysIdx = flow.findIndex(n => n.includes('系统侧开通'));
            if (sysIdx >= 0) {
                flow.splice(sysIdx, 0, 'BPH');
            } else {
                flow.push('BPH');
            }
        }
        return flow;
    };

    const appStatusLabel = (status) => { const map = { pending: '审批中', approved: '已通过', rejected: '已拒绝', expired: '已过期', revoked: '已归还', frozen: '已冻结', cancelled: '已撤销' }; return map[status] || status; };
    const appStatusClass = (status) => { const map = { pending: 'bg-blue-100 text-blue-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', expired: 'bg-gray-100 text-gray-500', revoked: 'bg-gray-100 text-gray-500', frozen: 'bg-orange-100 text-orange-700', cancelled: 'bg-gray-100 text-gray-400' }; return map[status] || 'bg-gray-100 text-gray-500'; };

    const daysUntilExpiry = (expireAt) => { if (!expireAt) return null; return Math.ceil((new Date(expireAt) - new Date()) / (1000 * 60 * 60 * 24)); };

    // ========== 我的权限：视图状态 ==========
    const myPermViewMode = ref('by-role');
    const myPermSelectedIdx = ref(0);
    const myPermNavSearch = ref('');
    const myPermSqlVisibleMap = reactive({});
    const toggleMyPermSql = (id) => {
        myPermSqlVisibleMap[id] = !myPermSqlVisibleMap[id];
    };
    const isMyPermSqlVisible = (id) => !!myPermSqlVisibleMap[id];

    // 从 permissionApplications 聚合已生效权限（approved），按角色分组
    const myActiveRolePerms = computed(() => {
        const roleMap = {};
        const roleOrder = [];
        permissionApplications.value
            .filter(a => a.applicantId === 'user_001' && a.status === 'approved')
            .forEach(app => {
                const getRoleEntries = () => {
                    if (app.roles && app.roles.length > 0) {
                        return app.roles.map(r => ({
                            roleId: r.roleId, roleName: r.roleName,
                            sensitivityLevel: r.sensitivityLevel || app.sensitivityLevel,
                            description: r.description || '',
                            tables: r.tables || [],
                            app
                        }));
                    }
                    if (app.type === 'standard' && (app.roleId || app.roleName)) {
                        const ruleDef = columnPermissionRules.value.find(r => r.id === app.roleId);
                        return [{
                            roleId: app.roleId, roleName: app.roleName || app.roleNames || '-',
                            sensitivityLevel: app.sensitivityLevel,
                            description: ruleDef ? ruleDef.description : '',
                            tables: app.tables || [],
                            app
                        }];
                    }
                    if (app.type === 'custom') {
                        return [{
                            roleId: '__custom__' + app.id, roleName: '自定义权限',
                            sensitivityLevel: app.sensitivityLevel,
                            description: '按表自定义字段申请',
                            tables: app.tables || [],
                            app
                        }];
                    }
                    return [];
                };
                getRoleEntries().forEach(entry => {
                    const key = entry.roleId;
                    if (!roleMap[key]) {
                        roleMap[key] = {
                            roleId: entry.roleId, roleName: entry.roleName,
                            sensitivityLevel: entry.sensitivityLevel, description: entry.description,
                            tables: []
                        };
                        roleOrder.push(key);
                    }
                    entry.tables.forEach(t => {
                        let tbl = roleMap[key].tables.find(x => x.tableId === t.tableId);
                        if (!tbl) {
                            tbl = { tableId: t.tableId, tableName: t.tableName, chineseName: t.chineseName, rules: [] };
                            roleMap[key].tables.push(tbl);
                        }
                        tbl.rules.push({
                            app: entry.app,
                            rowFilters: t.rowFilters || [],
                            fields: t.fields || []
                        });
                    });
                });
            });
        return roleOrder.map(k => roleMap[k]);
    });

    // 从 permissionApplications 聚合已生效权限，按表分组
    const myActiveTablePerms = computed(() => {
        const tableMap = {};
        const tableOrder = [];
        permissionApplications.value
            .filter(a => a.applicantId === 'user_001' && a.status === 'approved')
            .forEach(app => {
                const getTables = () => {
                    if (app.roles && app.roles.length > 0) {
                        return app.roles.flatMap(r =>
                            (r.tables || []).map(t => ({
                                ...t,
                                roleName: r.roleName, roleId: r.roleId,
                                sensitivityLevel: r.sensitivityLevel || app.sensitivityLevel,
                                app
                            }))
                        );
                    }
                    return (app.tables || []).map(t => ({
                        ...t,
                        roleName: app.type === 'custom' ? '【非标角色】曲景怡qujingyi' : (app.roleName || app.roleNames || '-'),
                        roleId: app.roleId,
                        sensitivityLevel: app.sensitivityLevel,
                        app
                    }));
                };
                getTables().forEach(entry => {
                    const key = entry.tableId;
                    if (!tableMap[key]) {
                        tableMap[key] = {
                            tableId: entry.tableId,
                            tableName: entry.tableName || entry.tableId,
                            chineseName: entry.chineseName || '',
                            rules: []
                        };
                        tableOrder.push(key);
                    }
                    tableMap[key].rules.push({
                        roleId: entry.roleId, roleName: entry.roleName,
                        sensitivityLevel: entry.sensitivityLevel,
                        rowFilters: entry.rowFilters || [],
                        fields: entry.fields || [],
                        app: entry.app
                    });
                });
            });
        return tableOrder.map(k => tableMap[k]);
    });

    // 我的权限左侧导航项（经过搜索过滤后）
    const myPermNavItems = computed(() => {
        const q = myPermNavSearch.value.trim().toLowerCase();
        const items = myPermViewMode.value === 'by-role'
            ? myActiveRolePerms.value.map((r, i) => ({ idx: i, label: r.roleName, sub: r.tables.length + ' 张表', key: r.roleId }))
            : myActiveTablePerms.value.map((t, i) => ({ idx: i, label: t.chineseName || t.tableName, sub: t.tableName, key: t.tableId }));
        if (!q) return items;
        return items.filter(it => it.label.toLowerCase().includes(q) || it.sub.toLowerCase().includes(q));
    });

    // 切换视图模式时重置选中
    const switchMyPermView = (mode) => {
        myPermViewMode.value = mode;
        myPermSelectedIdx.value = 0;
        myPermNavSearch.value = '';
    };

    // 当前详情
    const myPermCurrentDetail = computed(() => {
        const nav = myPermNavItems.value;
        const item = nav[myPermSelectedIdx.value];
        if (!item) return null;
        return myPermViewMode.value === 'by-role' ? myActiveRolePerms.value[item.idx] : myActiveTablePerms.value[item.idx];
    });

    watch(myPermNavSearch, () => {
        myPermSelectedIdx.value = 0;
    });

    // ========== 创建 Vue App ==========

    const app = createApp({
        setup() {
            // 返回所有需要在根模板（permission_center.html）中直接使用的变量
            return {
                permissionCenterTab, currentUserRole, permissionDomains,
                showApplyFlow, viewingAppDetail,
                showDetailDrawer, detailDrawerData, detailDrawerSourceTab, openDetailDrawer, closeDetailDrawer,
                applyMode,
                permissionApplyType, permissionApplyStep, permissionApplyForm,
                permissionApplications,
                filteredApplications, filteredApprovalItems, filteredPermissionRows,
                applicationFilters, applicationFilterField1, applicationFilterField2, applicationFilterField3,
                approvalFilters, approvalFilterField1, approvalFilterField2, approvalFilterField3,
                permissionFilters, permissionFilterField1, permissionFilterField2, permissionFilterField3,
                copyPermissionUsers, copyPermissionSelectedUserId, copyPermissionSelectedAppIds, copyPermissionSelectedTables,
                copyPermissionSelectedRoleIds, copyPermissionUnifiedRowPerm, copyPermissionRowPermRelation, copyExpandedRoleId,
                copyPermissionRoleRowPerm, copyAllRowPermIds, toggleCopyRoleRowPerm,
                copyUserCustomTables, copyPermissionSelectedCustomTableIds, copyCustomRowPermForm, copyCustomRowPermAutoFilled, copyCustomExpandedTableId,
                toggleCopyCustomTableExpand, toggleCopyCustomTableSelection, selectAllCopyCustomTables, clearAllCopyCustomTables,
                copyUserPermissions, copyUserStandardRoles, selectCopyPermissionUser, toggleCopyRoleSelection, selectAllCopyRoles, clearAllCopyRoles, toggleCopyRoleExpand, submitCopyPermissionApplication,
                myApprovalItems, approvalStatusLabel, approvalStatusClass,
                authTypeLabel,
                customApplySelectedTableIds, customApplyCurrentTableId,
                customApplyConfigIndex, roleApplyConfigIndex, customApplyFieldSearch, customApplyTableCategory, customApplyRowPermForm, customApplyRowPermAutoFilled,
                currentRowPermForm, rowPermConditionDefs, addRowPermCondition, removeRowPermCondition, addRowPermCondition_toCopy, removeRowPermCondition_fromCopy,
                pendingRowPermCondition, pendingCopyRowPermCondition,
                startAddRowPermCondition, cancelAddRowPermCondition, confirmAddRowPermCondition, finishAddRowPermCondition,
                startAddCopyRowPermCondition, cancelAddCopyRowPermCondition, confirmAddCopyRowPermCondition, finishAddCopyRowPermCondition,
                startCustomApplyConfig, customApplyNextTable, customApplyPrevTable, goToCustomTable, copyRowPermToOtherTables,
                showRenewalModal, renewalTarget, renewalValidityDays, renewalReason,
                showRevokeConfirm, revokeTarget,
                showFreezeConfirm, freezeTarget, freezeAction,
                auditSearchMode, auditSearchPersonQuery, auditSearchPersonResult,
                auditSearchDomainId, auditSearchTableId, auditSearchTableResult,
                availableTablesForColumnPermission, columnPermissionRules, hrRowPermRules, hrFieldCategories, hrFieldChineseNameMap, groupFieldsByCategory,
                startPermissionApply, selectPermissionDomain, selectApplyPermissionRole,
                toggleApplyPermissionRole, confirmSelectedRoles, selectedRoleIds, roleSearchQuery, roleUnifiedRowPerm, roleUnifiedRowPermRelation,
                expandedRoleId, toggleRoleExpand, step3RoleDetailExpanded, selectApplyRoleSingle,
                // 代申请
                setProxyApplyMode, setPermissionApplyType,
                roleDropdownOpen, openRoleDropdown, closeRoleDropdown, selectRoleFromDropdown,
                expandedRoleDetailId, toggleRoleDetailCard, renewalExpandedRoleId, toggleRenewalRoleCard,
                proxyApplyMode, proxyApplyTargetId, proxyApplyTargetName, proxyApplyTargetDept,
                proxyApplySearchQuery, proxyApplySearchResults, searchProxyApplyUsers, selectProxyApplyTarget, clearProxyApplyTarget, hideProxySearchResults,
                // 多角色选择
                toggleMultiRoleSelection, multiRoleRowPermForms, multiRoleActiveTabIdx, switchMultiRoleTab,
                currentMultiRoleRowPermForm, currentMultiRoleRule, syncMultiRoleFormMeta, copyMultiRoleRowPermToAll, duplicateRoleIds, duplicateRoleIds,
                expandedTableDirs, toggleTableDir, expandAllTableDirs, collapseAllTableDirs, groupedTablesByDir,
                submitPermissionApplication,
                addPermissionRowFilter, removePermissionRowFilter,
                openRenewalForm, reApplyPermission, submitRenewal,
                openRevokeConfirm, confirmRevoke,
                expandedRowExprKey, toggleRowExpr, getRowExprContent, toggleRowExprDOM,
                cancelApplication,
                openFreezeConfirm, confirmFreezeAction,
                auditSearchByPerson, auditSearchByTable,
                sensitivityLevelLabel, sensitivityLevelClass, getApprovalFlow, rowPermNeedsBPH, customRowPermNeedsBPH, customHasHighSensitiveFields, shouldHide365Validity, getValidityDays,
                appStatusLabel, appStatusClass, daysUntilExpiry,
                permissionStatusLabel, permissionStatusClass, permissionExpireReason,
                getSensitivityApprovalNodes,
                myPermViewMode, myPermSelectedIdx, myPermNavSearch, myPermSqlVisibleMap, toggleMyPermSql, isMyPermSqlVisible,
                myActiveRolePerms, myActiveTablePerms, myPermNavItems, myPermCurrentDetail, switchMyPermView,
                // 管理员设置
                permissionAdmins, showAddAdminModal,
                newAdminSearchQuery, newAdminSearchResults, newAdminSelected, newAdminDomains,
                searchNewAdmin, selectNewAdmin, addPermissionAdmin
            };
        }
    });

    // 通过 app.provide 注入上下文（替代错误的 Vue.provide 写法）
    app.provide('permissionCenterContext', {
        permissionCenterTab, currentUserRole, permissionDomains,
        showApplyFlow, viewingAppDetail,
        showDetailDrawer, detailDrawerData, detailDrawerSourceTab, openDetailDrawer, closeDetailDrawer,
        applyMode,
        permissionApplyType, permissionApplyStep, permissionApplyForm,
        permissionApplications,
        filteredApplications, filteredApprovalItems, filteredPermissionRows,
        applicationFilters, applicationFilterField1, applicationFilterField2, applicationFilterField3, approvalFilters, approvalFilterField1, approvalFilterField2, approvalFilterField3, permissionFilters, permissionFilterField1, permissionFilterField2, permissionFilterField3,
        copyPermissionUsers, copyPermissionSelectedUserId, copyPermissionSelectedAppIds, copyPermissionSelectedTables,
        copyPermissionSelectedRoleIds, copyPermissionUnifiedRowPerm, copyPermissionRowPermRelation, copyExpandedRoleId,
        copyPermissionRoleRowPerm, copyAllRowPermIds, toggleCopyRoleRowPerm,
        copyUserCustomTables, copyPermissionSelectedCustomTableIds, copyCustomRowPermForm, copyCustomRowPermAutoFilled, copyCustomExpandedTableId, toggleCopyCustomTableExpand, toggleCopyCustomTableSelection, selectAllCopyCustomTables, clearAllCopyCustomTables,
        copyUserPermissions, copyUserStandardRoles, selectCopyPermissionUser, toggleCopyRoleSelection, selectAllCopyRoles, clearAllCopyRoles, toggleCopyRoleExpand, submitCopyPermissionApplication,
        myApprovalItems, approvalStatusLabel, approvalStatusClass,
        authTypeLabel,
        customApplySelectedTableIds, customApplyCurrentTableId,
        customApplyConfigIndex, roleApplyConfigIndex, customApplyFieldSearch, customApplyTableCategory, customApplyRowPermForm, customApplyRowPermAutoFilled,
        currentRowPermForm, rowPermConditionDefs, addRowPermCondition, removeRowPermCondition, addRowPermCondition_toCopy, removeRowPermCondition_fromCopy, pendingRowPermCondition, pendingCopyRowPermCondition, startAddRowPermCondition, cancelAddRowPermCondition, confirmAddRowPermCondition, finishAddRowPermCondition, startAddCopyRowPermCondition, cancelAddCopyRowPermCondition, confirmAddCopyRowPermCondition, finishAddCopyRowPermCondition,
        startCustomApplyConfig, customApplyNextTable, customApplyPrevTable, goToCustomTable, copyRowPermToOtherTables,
        showRenewalModal, renewalTarget, renewalValidityDays, renewalReason,
        showRevokeConfirm, revokeTarget,
        showFreezeConfirm, freezeTarget, freezeAction,
        auditSearchMode, auditSearchPersonQuery, auditSearchPersonResult,
        auditSearchDomainId, auditSearchTableId, auditSearchTableResult,
        availableTablesForColumnPermission, columnPermissionRules, hrRowPermRules, hrFieldCategories, hrFieldChineseNameMap, groupFieldsByCategory,
        startPermissionApply, selectPermissionDomain, selectApplyPermissionRole,
        toggleApplyPermissionRole, confirmSelectedRoles, selectedRoleIds, roleSearchQuery, roleUnifiedRowPerm, roleUnifiedRowPermRelation,
        expandedRoleId, toggleRoleExpand, step3RoleDetailExpanded, selectApplyRoleSingle,
        // 多角色选择
        toggleMultiRoleSelection, multiRoleRowPermForms, multiRoleActiveTabIdx, switchMultiRoleTab,
        currentMultiRoleRowPermForm, currentMultiRoleRule, syncMultiRoleFormMeta, copyMultiRoleRowPermToAll, duplicateRoleIds,
        // 代申请
        setProxyApplyMode, setPermissionApplyType,
        roleDropdownOpen, openRoleDropdown, closeRoleDropdown, selectRoleFromDropdown,
        expandedRoleDetailId, toggleRoleDetailCard, renewalExpandedRoleId, toggleRenewalRoleCard,
        proxyApplyMode, proxyApplyTargetId, proxyApplyTargetName, proxyApplyTargetDept,
        proxyApplySearchQuery, proxyApplySearchResults, searchProxyApplyUsers, selectProxyApplyTarget, clearProxyApplyTarget, hideProxySearchResults,
        expandedTableDirs, toggleTableDir, expandAllTableDirs, collapseAllTableDirs, groupedTablesByDir,
        submitPermissionApplication,
        addPermissionRowFilter, removePermissionRowFilter,
        openRenewalForm, reApplyPermission, submitRenewal,
        openRevokeConfirm, confirmRevoke,
        expandedRowExprKey, toggleRowExpr, getRowExprContent, toggleRowExprDOM,
        cancelApplication,
        auditSearchByPerson, auditSearchByTable,
        sensitivityLevelLabel, sensitivityLevelClass, getApprovalFlow, rowPermNeedsBPH, customRowPermNeedsBPH, customHasHighSensitiveFields, shouldHide365Validity, getValidityDays,
        appStatusLabel, appStatusClass, daysUntilExpiry,
        permissionStatusLabel, permissionStatusClass, permissionExpireReason,
        getSensitivityApprovalNodes,
        myPermViewMode, myPermSelectedIdx, myPermNavSearch, myPermSqlVisibleMap, toggleMyPermSql, isMyPermSqlVisible,
        myActiveRolePerms, myActiveTablePerms, myPermNavItems, myPermCurrentDetail, switchMyPermView,
        // 管理员设置
        permissionAdmins, showAddAdminModal,
        newAdminSearchQuery, newAdminSearchResults, newAdminSelected, newAdminDomains,
        searchNewAdmin, selectNewAdmin, addPermissionAdmin
    });

    // 注册权限中心组件
    if (window.AppTemplates && window.AppTemplates.PermissionCenter) {
        app.component('PermissionCenter', {
            name: 'PermissionCenter',
            setup() {
                const ctx = inject('permissionCenterContext');
                return ctx;
            },
            template: window.AppTemplates.PermissionCenter
        });
    }

    app.mount('#app');
})();