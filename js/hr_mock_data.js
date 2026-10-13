// HR 人力资源域 Mock 数据
// topic_hr_emp_all_td - 400 个字段
(function() {
    // 字段分类定义
    var fieldCategories = {
        '基础信息': [
            'emp_id','emp_code','emp_name','emp_name_en','emp_name_pinyin','emp_nickname',
            'gender','gender_code','birth_date','birth_year','birth_month','birth_day',
            'age','age_range','id_card_no','id_card_type','nationality','nation',
            'political_status','marital_status','highest_education','graduation_school',
            'major','degree','school_type','graduation_year','graduate_month',
            'email','email_corp','mobile','mobile_backup','wechat','dingtalk_id',
            'employee_no','badge_no','ad_account','ldap_account','sys_account',
            'avatar_url','signature','personal_intro','emergency_contact','emergency_phone'
        ],
        '在职信息': [
            'emp_status','emp_type','emp_nature','hire_date','formal_date','probation_end_date',
            'contract_start_date','contract_end_date','contract_type','contract_company',
            'contract_entity','labor_dispatch','internship_type','part_time_type',
            'work_location','work_city','work_province','work_country','work_timezone',
            'work_address','office_building','office_floor','office_room','seat_no',
            'onboard_channel','onboard_type','onboard_source','referral_emp_id','probation_days',
            'actual_probation_days','probation_result','first_work_date','social_security_city',
            'social_security_type','provident_fund_city','provident_fund_account',
            'bank_card_no','bank_name','bank_branch','salary_payment_type'
        ],
        '组织信息': [
            'dept_id','dept_name','dept_code','dept_level','dept_path','dept_path_name',
            'dept_full_name','biz_unit','biz_unit_name','biz_unit_id','business_line',
            'business_line_id','cost_center','cost_center_name','cost_center_code',
            'profit_center','profit_center_name','team_id','team_name','group_id','group_name',
            'direct_leader_id','direct_leader_name','direct_leader_level','direct_leader_dept',
            'hr_bp_id','hr_bp_name','hrbp_dept','od_bp_id','od_bp_name',
            'second_leader_id','second_leader_name','third_leader_id','third_leader_name',
            'org_path','org_path_id','org_depth','management_path','management_depth',
            'direct_report_count','total_report_count','is_manager','is_top_manager'
        ],
        '职级信息': [
            'level_code','level_name','level_group','level_category','level_rank',
            'job_family','job_family_name','job_family_code','job_subfamily','job_subfamily_name',
            'job_title','job_title_code','job_title_en','position_name','position_code',
            'position_type','position_category','position_level','sequence','sequence_name',
            'sequence_code','grade','grade_name','grade_level','salary_band','salary_range_min',
            'salary_range_max','salary_range_mid','target_compensation','last_level_change_date',
            'last_level_change_type','level_years','current_level_start_date',
            'promoted_times','level_change_count','level_change_history'
        ],
        '绩效信息': [
            'perf_year','perf_cycle','perf_result','perf_result_code','perf_score',
            'perf_rank','perf_rank_pct','perf_level','perf_level_code','perf_type',
            'perf_status','kpi_score','okr_score','ability_score','value_score',
            '360_score','manager_score','peer_score','self_score','calibrated_score',
            'calibrated_result','calibration_date','calibration_round','calibration_status',
            'pbc_q1','pbc_q2','pbc_q3','pbc_q4','annual_pbc','last_perf_result',
            'last_perf_year','consecutive_high_perf','consecutive_low_perf','perf_improvement_plan',
            'pip_start_date','pip_end_date','pip_result'
        ],
        '薪酬信息': [
            'base_salary','base_salary_monthly','annual_salary','annual_ctc','annual_tc',
            'cash_salary','variable_salary','bonus_target_pct','bonus_target_amount',
            'actual_bonus','bonus_year','bonus_payment_date','equity_grant_amount',
            'equity_grant_date','equity_vested','equity_unvested','equity_plan',
            'equity_type','allowance_total','allowance_housing','allowance_transport',
            'allowance_meal','allowance_communication','allowance_other','overtime_type',
            'overtime_pay_type','tax_method','tax_city','individual_income_tax',
            'social_insurance_personal','provident_fund_personal','total_deduction',
            'net_salary','salary_adjustment_date','salary_adjustment_pct','salary_adjustment_reason',
            'salary_adjustment_type','last_salary_review_date','salary_review_result'
        ],
        '晋升信息': [
            'promotion_year','promotion_cycle','promotion_result','promotion_type',
            'promotion_status','nomination_date','nomination_source','nomination_type',
            'promote_from_level','promote_to_level','promotion_date','promotion_effective_date',
            'promotion_approver','promotion_reason','promotion_committee_result',
            'calibration_result_promo','promo_score','promo_rank','promo_rank_pct',
            'promo_panel_result','promo_oral_result','promo_written_result',
            'eligible_for_promotion','promotion_eligibility_reason','fast_track_flag',
            'high_potential_flag','succession_plan_flag','talent_pool','talent_tier'
        ],
        '离职信息': [
            'resign_date','resign_apply_date','last_work_date','handover_date',
            'resign_type','resign_reason','resign_reason_detail','resign_reason_code',
            'resign_subtype','voluntary_resign','involuntary_resign','resign_initiator',
            'resign_approved_by','resign_approval_date','notice_period_days',
            'actual_notice_days','resignation_letter_received','exit_interview_done',
            'exit_interview_date','exit_interview_result','knowledge_transfer_done',
            'asset_return_done','system_deactivate_done','alumni_network_join',
            'rehire_eligible','rehire_flag','last_dept_id','last_dept_name',
            'last_level_code','last_job_title','tenure_days','tenure_months','tenure_years'
        ],
        '考勤信息': [
            'attendance_year','attendance_month','attendance_date','work_days',
            'actual_work_days','absence_days','late_times','early_leave_times',
            'overtime_hours','overtime_hours_weekday','overtime_hours_weekend','overtime_hours_holiday',
            'annual_leave_balance','annual_leave_used','sick_leave_used','personal_leave_used',
            'maternity_leave_used','paternity_leave_used','bereavement_leave_used',
            'marriage_leave_used','public_holiday_days','remote_work_days','field_work_days',
            'business_trip_days','business_trip_count','punch_in_time','punch_out_time',
            'punch_in_location','punch_out_location','attendance_status','attendance_exception_type'
        ],
        '系统字段': [
            'create_time','update_time','create_by','update_by','is_deleted','deleted_time',
            'data_source','data_source_system','sync_time','sync_batch_id','partition_date',
            'etl_date','etl_time','record_version','record_status','data_quality_flag',
            'data_quality_score','tenant_id','org_id','app_id','module_id',
            'ext_field_1','ext_field_2','ext_field_3','ext_field_4','ext_field_5',
            'ext_field_6','ext_field_7','ext_field_8','ext_field_9','ext_field_10'
        ]
    };

    // 字段中文名映射
    var fieldChineseNameMap = {
        // 基础信息
        'emp_id': '员工ID', 'emp_code': '员工编号', 'emp_name': '员工姓名', 'emp_name_en': '员工英文名',
        'emp_name_pinyin': '姓名拼音', 'emp_nickname': '员工昵称', 'gender': '性别', 'gender_code': '性别编码',
        'birth_date': '出生日期', 'birth_year': '出生年份', 'birth_month': '出生月份', 'birth_day': '出生日',
        'age': '年龄', 'age_range': '年龄段', 'id_card_no': '身份证号', 'id_card_type': '证件类型',
        'nationality': '国籍', 'nation': '民族', 'political_status': '政治面貌', 'marital_status': '婚姻状况',
        'highest_education': '最高学历', 'graduation_school': '毕业院校', 'major': '专业', 'degree': '学位',
        'school_type': '院校类型', 'graduation_year': '毕业年份', 'graduate_month': '毕业月份',
        'email': '个人邮箱', 'email_corp': '企业邮箱', 'mobile': '手机号', 'mobile_backup': '备用手机号',
        'wechat': '微信', 'dingtalk_id': '钉钉ID', 'employee_no': '工号', 'badge_no': '工牌号',
        'ad_account': 'AD账号', 'ldap_account': 'LDAP账号', 'sys_account': '系统账号',
        'avatar_url': '头像URL', 'signature': '个性签名', 'personal_intro': '个人简介',
        'emergency_contact': '紧急联系人', 'emergency_phone': '紧急联系电话',
        // 在职信息
        'emp_status': '在职状态', 'emp_type': '员工类型', 'emp_nature': '用工性质',
        'hire_date': '入职日期', 'formal_date': '转正日期', 'probation_end_date': '试用期截止日',
        'contract_start_date': '合同开始日', 'contract_end_date': '合同结束日', 'contract_type': '合同类型',
        'contract_company': '签约公司', 'contract_entity': '签约主体', 'labor_dispatch': '劳务派遣',
        'internship_type': '实习类型', 'part_time_type': '兼职类型',
        'work_location': '工作地点', 'work_city': '工作城市', 'work_province': '工作省份',
        'work_country': '工作国家', 'work_timezone': '工作时区',
        'work_address': '工作地址', 'office_building': '办公楼', 'office_floor': '办公楼层',
        'office_room': '办公室', 'seat_no': '座位号',
        'onboard_channel': '入职渠道', 'onboard_type': '入职类型', 'onboard_source': '入职来源',
        'referral_emp_id': '推荐人员工ID', 'probation_days': '试用期天数',
        'actual_probation_days': '实际试用天数', 'probation_result': '试用期结果',
        'first_work_date': '首次工作日', 'social_security_city': '社保城市',
        'social_security_type': '社保类型', 'provident_fund_city': '公积金城市',
        'provident_fund_account': '公积金账号', 'bank_card_no': '银行卡号', 'bank_name': '银行名称',
        'bank_branch': '银行支行', 'salary_payment_type': '薪酬支付方式',
        'start_date': '开始日期', 'end_date': '结束日期', 'intern_type': '实习生类型',
        // 组织信息
        'dept_id': '部门ID', 'dept_name': '部门名称', 'dept_code': '部门编码', 'dept_level': '部门层级',
        'dept_path': '部门路径', 'dept_path_name': '部门路径名', 'dept_full_name': '部门全称',
        'biz_unit': '业务单元', 'biz_unit_name': '业务单元名称', 'biz_unit_id': '业务单元ID',
        'business_line': '业务线', 'business_line_id': '业务线ID',
        'cost_center': '成本中心', 'cost_center_name': '成本中心名称', 'cost_center_code': '成本中心编码',
        'profit_center': '利润中心', 'profit_center_name': '利润中心名称',
        'team_id': '团队ID', 'team_name': '团队名称', 'group_id': '组ID', 'group_name': '组名称',
        'direct_leader_id': '直属上级ID', 'direct_leader_name': '直属上级姓名',
        'direct_leader_level': '直属上级职级', 'direct_leader_dept': '直属上级部门',
        'hr_bp_id': 'HRBP ID', 'hr_bp_name': 'HRBP姓名', 'hrbp_dept': 'HRBP部门',
        'od_bp_id': 'OD BP ID', 'od_bp_name': 'OD BP姓名',
        'second_leader_id': '二级上级ID', 'second_leader_name': '二级上级姓名',
        'third_leader_id': '三级上级ID', 'third_leader_name': '三级上级姓名',
        'org_path': '组织路径', 'org_path_id': '组织路径ID', 'org_depth': '组织深度',
        'management_path': '管理路径', 'management_depth': '管理深度',
        'direct_report_count': '直属下属数', 'total_report_count': '总下属数',
        'is_manager': '是否管理者', 'is_top_manager': '是否高管',
        'approver_id': '审批人ID',
        // 职级信息
        'level_code': '职级编码', 'level_name': '职级名称', 'level_group': '职级组',
        'level_category': '职级类别', 'level_rank': '职级排序',
        'job_family': '职位族', 'job_family_name': '职位族名称', 'job_family_code': '职位族编码',
        'job_subfamily': '职位子族', 'job_subfamily_name': '职位子族名称',
        'job_title': '职位名称', 'job_title_code': '职位编码', 'job_title_en': '职位英文名',
        'position_name': '岗位名称', 'position_code': '岗位编码',
        'position_type': '岗位类型', 'position_category': '岗位类别',
        'position_level': '岗位层级', 'sequence': '序列', 'sequence_name': '序列名称',
        'sequence_code': '序列编码', 'grade': '等级', 'grade_name': '等级名称',
        'grade_level': '等级层级', 'salary_band': '薪资区间', 'salary_range_min': '薪资下限',
        'salary_range_max': '薪资上限', 'salary_range_mid': '薪资中值',
        'target_compensation': '目标薪酬',
        'last_level_change_date': '最近职级变更日期', 'last_level_change_type': '最近职级变更类型',
        'level_years': '当前职级年限', 'current_level_start_date': '当前职级起始日',
        'promoted_times': '晋升次数', 'level_change_count': '职级变更次数',
        'level_change_history': '职级变更历史',
        'vocation_type': '职级类型', 'filter_flag': '过滤标记',
        // 绩效信息
        'perf_year': '绩效年度', 'perf_cycle': '绩效周期', 'perf_result': '绩效结果',
        'perf_result_code': '绩效结果编码', 'perf_score': '绩效得分',
        'perf_rank': '绩效排名', 'perf_rank_pct': '绩效排名百分位',
        'perf_level': '绩效等级', 'perf_level_code': '绩效等级编码', 'perf_type': '绩效类型',
        'perf_status': '绩效状态', 'kpi_score': 'KPI得分', 'okr_score': 'OKR得分',
        'ability_score': '能力得分', 'value_score': '价值观得分',
        '360_score': '360评分', 'manager_score': '主管评分', 'peer_score': '同事评分',
        'self_score': '自评分数', 'calibrated_score': '校准分数',
        'calibrated_result': '校准结果', 'calibration_date': '校准日期',
        'calibration_round': '校准轮次', 'calibration_status': '校准状态',
        'pbc_q1': 'PBC Q1', 'pbc_q2': 'PBC Q2', 'pbc_q3': 'PBC Q3', 'pbc_q4': 'PBC Q4',
        'annual_pbc': '年度PBC', 'last_perf_result': '上次绩效结果',
        'last_perf_year': '上次绩效年度', 'consecutive_high_perf': '连续高绩效次数',
        'consecutive_low_perf': '连续低绩效次数', 'perf_improvement_plan': '绩效改进计划',
        'pip_start_date': 'PIP开始日', 'pip_end_date': 'PIP结束日', 'pip_result': 'PIP结果',
        // 薪酬信息
        'base_salary': '基本薪资', 'base_salary_monthly': '月薪', 'annual_salary': '年薪',
        'annual_ctc': '年总包CTC', 'annual_tc': '年总成本',
        'cash_salary': '现金薪资', 'variable_salary': '浮动薪资',
        'bonus_target_pct': '目标奖金比例', 'bonus_target_amount': '目标奖金金额',
        'actual_bonus': '实际奖金', 'bonus_year': '奖金年度',
        'bonus_payment_date': '奖金发放日',
        'equity_grant_amount': '期权授予数量', 'equity_grant_date': '期权授予日',
        'equity_vested': '已归属期权', 'equity_unvested': '未归属期权',
        'equity_plan': '期权计划', 'equity_type': '期权类型',
        'allowance_total': '津贴合计', 'allowance_housing': '住房津贴',
        'allowance_transport': '交通津贴', 'allowance_meal': '餐补',
        'allowance_communication': '通讯津贴', 'allowance_other': '其他津贴',
        'overtime_type': '加班类型', 'overtime_pay_type': '加班费类型',
        'tax_method': '计税方式', 'tax_city': '纳税城市',
        'individual_income_tax': '个人所得税', 'social_insurance_personal': '个人社保',
        'provident_fund_personal': '个人公积金', 'total_deduction': '总扣款',
        'net_salary': '税后薪资', 'salary_adjustment_date': '调薪日期',
        'salary_adjustment_pct': '调薪比例', 'salary_adjustment_reason': '调薪原因',
        'salary_adjustment_type': '调薪类型', 'last_salary_review_date': '上次调薪日',
        'salary_review_result': '调薪结果',
        // 晋升信息
        'promotion_year': '晋升年度', 'promotion_cycle': '晋升周期',
        'promotion_result': '晋升结果', 'promotion_type': '晋升类型',
        'promotion_status': '晋升状态', 'nomination_date': '提名日期',
        'nomination_source': '提名来源', 'nomination_type': '提名类型',
        'promote_from_level': '晋升前职级', 'promote_to_level': '晋升后职级',
        'promotion_date': '晋升日期', 'promotion_effective_date': '晋升生效日',
        'promotion_approver': '晋升审批人', 'promotion_reason': '晋升原因',
        'promotion_committee_result': '晋升委员会结果',
        'calibration_result_promo': '晋升校准结果', 'promo_score': '晋升评分',
        'promo_rank': '晋升排名', 'promo_rank_pct': '晋升排名百分位',
        'promo_panel_result': '晋升评审结果', 'promo_oral_result': '晋升答辩结果',
        'promo_written_result': '晋升笔试结果', 'eligible_for_promotion': '可晋升',
        'promotion_eligibility_reason': '晋升资格原因', 'fast_track_flag': '快通道标记',
        'high_potential_flag': '高潜标记', 'succession_plan_flag': '继任计划标记',
        'talent_pool': '人才池', 'talent_tier': '人才层级',
        // 离职信息
        'resign_date': '离职日期', 'resign_apply_date': '离职申请日',
        'last_work_date': '最后工作日', 'handover_date': '交接日期',
        'resign_type': '离职类型', 'resign_reason': '离职原因',
        'resign_reason_detail': '离职原因详情', 'resign_reason_code': '离职原因编码',
        'resign_subtype': '离职子类型', 'voluntary_resign': '主动离职',
        'involuntary_resign': '被动离职', 'resign_initiator': '离职发起人',
        'resign_approved_by': '离职审批人', 'resign_approval_date': '离职审批日',
        'notice_period_days': '通知期天数', 'actual_notice_days': '实际通知天数',
        'resignation_letter_received': '离职信已收', 'exit_interview_done': '离职面谈已完成',
        'exit_interview_date': '离职面谈日', 'exit_interview_result': '离职面谈结果',
        'knowledge_transfer_done': '知识转移完成', 'asset_return_done': '资产归还完成',
        'system_deactivate_done': '系统注销完成', 'alumni_network_join': '加入校友网',
        'rehire_eligible': '可返聘', 'rehire_flag': '返聘标记',
        'last_dept_id': '最后部门ID', 'last_dept_name': '最后部门名称',
        'last_level_code': '最后职级编码', 'last_job_title': '最后职位名称',
        'tenure_days': '在职天数', 'tenure_months': '在职月数', 'tenure_years': '在职年数',
        // 考勤信息
        'attendance_year': '考勤年度', 'attendance_month': '考勤月份',
        'attendance_date': '考勤日期', 'work_days': '应出勤天数',
        'actual_work_days': '实际出勤天数', 'absence_days': '缺勤天数',
        'late_times': '迟到次数', 'early_leave_times': '早退次数',
        'overtime_hours': '加班时长', 'overtime_hours_weekday': '工作日加班时长',
        'overtime_hours_weekend': '周末加班时长', 'overtime_hours_holiday': '节假日加班时长',
        'annual_leave_balance': '年假余额', 'annual_leave_used': '年假已用',
        'sick_leave_used': '病假已用', 'personal_leave_used': '事假已用',
        'maternity_leave_used': '产假已用', 'paternity_leave_used': '陪产假已用',
        'bereavement_leave_used': '丧假已用', 'marriage_leave_used': '婚假已用',
        'public_holiday_days': '法定假日天数', 'remote_work_days': '远程工作天数',
        'field_work_days': '外勤天数', 'business_trip_days': '出差天数',
        'business_trip_count': '出差次数', 'punch_in_time': '上班打卡时间',
        'punch_out_time': '下班打卡时间', 'punch_in_location': '上班打卡位置',
        'punch_out_location': '下班打卡位置', 'attendance_status': '考勤状态',
        'attendance_exception_type': '考勤异常类型',
        'work_hours': '工作时长', 'late_flag': '迟到标记',
        'early_leave_flag': '早退标记', 'absence_flag': '缺勤标记',
        'overtime_date': '加班日期', 'overtime_type': '加班类型', 'overtime_reason': '加班原因',
        'overtime_pay_type': '加班费类型',
        'leave_type': '请假类型', 'leave_start_date': '请假开始日',
        'leave_end_date': '请假结束日', 'leave_days': '请假天数', 'leave_reason': '请假原因',
        'leave_id': '请假ID',
        'appeal_date': '申诉日期', 'appeal_type': '申诉类型', 'appeal_reason': '申诉原因',
        'appeal_status': '申诉状态',
        // 系统字段
        'create_time': '创建时间', 'update_time': '更新时间', 'create_by': '创建人',
        'update_by': '更新人', 'is_deleted': '是否删除', 'deleted_time': '删除时间',
        'data_source': '数据源', 'data_source_system': '数据源系统',
        'sync_time': '同步时间', 'sync_batch_id': '同步批次ID',
        'partition_date': '分区日期', 'etl_date': 'ETL日期', 'etl_time': 'ETL时间',
        'record_version': '记录版本', 'record_status': '记录状态',
        'data_quality_flag': '数据质量标记', 'data_quality_score': '数据质量得分',
        'tenant_id': '租户ID', 'org_id': '组织ID', 'app_id': '应用ID',
        'module_id': '模块ID',
        'ext_field_1': '扩展字段1', 'ext_field_2': '扩展字段2', 'ext_field_3': '扩展字段3',
        'ext_field_4': '扩展字段4', 'ext_field_5': '扩展字段5',
        'ext_field_6': '扩展字段6', 'ext_field_7': '扩展字段7', 'ext_field_8': '扩展字段8',
        'ext_field_9': '扩展字段9', 'ext_field_10': '扩展字段10',
        'snapshot_date': '快照日期',
        'flow_type': '流程类型', 'flow_status': '流程状态',
        'apply_date': '申请日期', 'approve_date': '审批日期',
        'approve_status': '审批状态',
        // 组织相关
        'org_id': '组织ID', 'org_name': '组织名称', 'org_code': '组织编码',
        'org_level': '组织层级', 'org_type': '组织类型', 'parent_org_id': '上级组织ID',
        'month': '月份', 'emp_count': '员工数量',
        'company_name': '公司名称', 'industry': '行业', 'description': '描述',
        'org_type_code': '组织类型编码', 'org_type_name': '组织类型名称',
        'headcount': '编制人数', 'vacancy': '空缺人数',
        'new_hire_count': '新入职人数', 'resign_count': '离职人数',
        'transfer_in_count': '调入人数', 'transfer_out_count': '调出人数',
        'avg_tenure_months': '平均司龄(月)', 'avg_age': '平均年龄',
        'avg_salary': '平均薪资', 'salary_total': '薪资总额',
        'headcount_budget': '编制预算', 'headcount_actual': '实际人数',
        'fill_rate': '满编率', 'headcount_change': '编制变化',
        'budget_amount': '预算金额', 'actual_amount': '实际金额',
        'variance': '偏差', 'variance_pct': '偏差率',
        'headcount_plan': '人数计划', 'hire_plan': '招聘计划',
        'perf_org_score': '组织绩效得分', 'perf_org_rank': '组织绩效排名',
        'perf_org_level': '组织绩效等级',
        'headcount_eop': '期末人数', 'headcount_bop': '期初人数',
        'hc_change_hire': '入职变化', 'hc_change_resign': '离职变化',
        'hc_change_transfer_in': '调入变化', 'hc_change_transfer_out': '调出变化',
        'hc_change_promotion': '晋升变化', 'hc_change_other': '其他变化'
    };

    // 展开成 400 个字段对象
    var allFields = [];
    Object.keys(fieldCategories).forEach(function(cat) {
        fieldCategories[cat].forEach(function(name) {
            allFields.push({
                name: name,
                category: cat,
                is_partition: name === 'partition_date',
                is_unique_key: name === 'emp_id'  // 员工主表的唯一键
            });
        });
    });

    // 辅助：为字段列表添加 is_partition / is_unique_key / securityLevel 标记
    // 安全等级规则：薪酬/绩效/晋升信息为 C4（极高敏），在职/组织/职级/离职为 C3（高敏），基础/考勤/系统字段为 C2（中敏）
    var fieldSecurityByCategory = {
        '基础信息': 'C2', '在职信息': 'C3', '组织信息': 'C3', '职级信息': 'C3',
        '绩效信息': 'C4', '薪酬信息': 'C4', '晋升信息': 'C4', '离职信息': 'C3',
        '考勤信息': 'C2', '系统字段': 'C2'
    };
    var enrichFields = function(fields) {
        return fields.map(function(f) {
            return {
                name: f.name,
                category: f.category,
                is_partition: f.name === 'partition_date' || f.is_partition === true,
                is_unique_key: f.is_unique_key === true,
                securityLevel: f.securityLevel || fieldSecurityByCategory[f.category] || 'C2'
            };
        });
    };

    // 对所有表统一应用 enrichFields
    var enrichTables = function(tables) {
        return tables.map(function(t) {
            return Object.assign({}, t, { fields: enrichFields(t.fields) });
        });
    };

    var _rawTables = [
            // 员工表 - 员工主表
            {
                id: 'tbl_hr_emp_all',
                name: 'topic_hr_emp_all_td',
                chineseName: '员工全量信息表',
                category: '员工',
                subCategory: '员工表',
                fields: enrichFields(allFields)
            },
            {
                id: 'tbl_hr_ltc_emp',
                name: 'dim_hr_ltc_emp_cp',
                chineseName: '员工快照维度表',
                category: '员工',
                subCategory: '员工表',
                fields: [
                    { name: 'emp_id', category: '基础信息', is_unique_key: true }, { name: 'emp_code', category: '基础信息' },
                    { name: 'emp_name', category: '基础信息' }, { name: 'emp_status', category: '在职信息' },
                    { name: 'emp_type', category: '在职信息' }, { name: 'dept_id', category: '组织信息' },
                    { name: 'dept_name', category: '组织信息' }, { name: 'level_code', category: '职级信息' },
                    { name: 'level_name', category: '职级信息' }, { name: 'job_title', category: '职级信息' },
                    { name: 'hire_date', category: '在职信息' }, { name: 'snapshot_date', category: '系统字段' },
                    { name: 'partition_date', category: '系统字段' }
                ]
            },
            // 员工表 - 考勤表
            {
                id: 'tbl_att_attendance_1',
                name: 'app_outer_attendance_emp_attendance_di',
                chineseName: '员工考勤日明细',
                category: '员工',
                subCategory: '考勤表',
                fields: [
                    { name: 'emp_id', category: '基础信息', is_unique_key: true }, { name: 'attendance_date', category: '考勤信息' },
                    { name: 'attendance_status', category: '考勤信息' }, { name: 'punch_in_time', category: '考勤信息' },
                    { name: 'punch_out_time', category: '考勤信息' }, { name: 'work_hours', category: '考勤信息' },
                    { name: 'overtime_hours', category: '考勤信息' }, { name: 'late_flag', category: '考勤信息' },
                    { name: 'early_leave_flag', category: '考勤信息' }, { name: 'absence_flag', category: '考勤信息' },
                    { name: 'dept_id', category: '组织信息' }, { name: 'partition_date', category: '系统字段' }
                ]
            },
            {
                id: 'tbl_att_attendance_2',
                name: 'app_outer_attendance_emp_attendance_mi',
                chineseName: '员工考勤月汇总',
                category: '员工',
                subCategory: '考勤表',
                fields: [
                    { name: 'emp_id', category: '基础信息', is_unique_key: true }, { name: 'attendance_year', category: '考勤信息' },
                    { name: 'attendance_month', category: '考勤信息' }, { name: 'work_days', category: '考勤信息' },
                    { name: 'actual_work_days', category: '考勤信息' }, { name: 'overtime_hours', category: '考勤信息' },
                    { name: 'late_times', category: '考勤信息' }, { name: 'absence_days', category: '考勤信息' },
                    { name: 'dept_id', category: '组织信息' }, { name: 'partition_date', category: '系统字段' }
                ]
            },
            {
                id: 'tbl_att_overtime',
                name: 'app_outer_attendance_emp_overtime_di',
                chineseName: '员工加班明细表',
                category: '员工',
                subCategory: '考勤表',
                fields: [
                    { name: 'emp_id', category: '基础信息', is_unique_key: true }, { name: 'overtime_date', category: '考勤信息' },
                    { name: 'overtime_hours', category: '考勤信息' }, { name: 'overtime_type', category: '考勤信息' },
                    { name: 'overtime_reason', category: '考勤信息' }, { name: 'approver_id', category: '组织信息' },
                    { name: 'approve_status', category: '系统字段' }, { name: 'partition_date', category: '系统字段' }
                ]
            },
            {
                id: 'tbl_att_vacation',
                name: 'app_outer_attendance_emp_vacation_di',
                chineseName: '员工假期明细表',
                category: '员工',
                subCategory: '考勤表',
                fields: [
                    { name: 'emp_id', category: '基础信息', is_unique_key: true }, { name: 'leave_type', category: '考勤信息' },
                    { name: 'leave_start_date', category: '考勤信息' }, { name: 'leave_end_date', category: '考勤信息' },
                    { name: 'leave_days', category: '考勤信息' }, { name: 'leave_reason', category: '考勤信息' },
                    { name: 'approve_status', category: '系统字段' }, { name: 'partition_date', category: '系统字段' }
                ]
            },
            {
                id: 'tbl_att_clockin',
                name: 'app_outer_attendance_clockin_appeal_di',
                chineseName: '打卡申诉记录表',
                category: '员工',
                subCategory: '考勤表',
                fields: [
                    { name: 'emp_id', category: '基础信息', is_unique_key: true }, { name: 'appeal_date', category: '考勤信息' },
                    { name: 'appeal_type', category: '考勤信息' }, { name: 'appeal_reason', category: '考勤信息' },
                    { name: 'appeal_status', category: '系统字段' }, { name: 'partition_date', category: '系统字段' }
                ]
            },
            {
                id: 'tbl_vocation_filter',
                name: 'emp_vocation_filter_part_td',
                chineseName: '员工职级过滤快照',
                category: '员工',
                subCategory: '考勤表',
                fields: [
                    { name: 'emp_id', category: '基础信息', is_unique_key: true }, { name: 'vocation_type', category: '职级信息' },
                    { name: 'filter_flag', category: '系统字段' }, { name: 'partition_date', category: '系统字段' }
                ]
            },
            {
                id: 'tbl_cawf',
                name: 'emp_cawf_di',
                chineseName: '员工工作流审批日明细',
                category: '员工',
                subCategory: '考勤表',
                fields: [
                    { name: 'emp_id', category: '基础信息', is_unique_key: true }, { name: 'flow_type', category: '系统字段' },
                    { name: 'flow_status', category: '系统字段' }, { name: 'apply_date', category: '系统字段' },
                    { name: 'approve_date', category: '系统字段' }, { name: 'partition_date', category: '系统字段' }
                ]
            },
            {
                id: 'tbl_att_intern',
                name: 'app_hr_attendance_intern_attendance_di',
                chineseName: '实习生考勤日明细',
                category: '员工',
                subCategory: '考勤表',
                fields: [
                    { name: 'emp_id', category: '基础信息', is_unique_key: true }, { name: 'attendance_date', category: '考勤信息' },
                    { name: 'attendance_status', category: '考勤信息' }, { name: 'intern_type', category: '在职信息' },
                    { name: 'dept_id', category: '组织信息' }, { name: 'partition_date', category: '系统字段' }
                ]
            },
            // 员工表 - 个人信息
            {
                id: 'tbl_work_exp',
                name: 'fact_hr_corehr_employee_work_experience_td',
                chineseName: '员工工作经历表',
                category: '员工',
                subCategory: '个人信息',
                fields: [
                    { name: 'emp_id', category: '基础信息', is_unique_key: true }, { name: 'company_name', category: '基础信息' },
                    { name: 'job_title', category: '职级信息' }, { name: 'start_date', category: '在职信息' },
                    { name: 'end_date', category: '在职信息' }, { name: 'industry', category: '基础信息' },
                    { name: 'description', category: '基础信息' }, { name: 'partition_date', category: '系统字段' }
                ]
            },
            // 组织表 - 组织明细
            {
                id: 'tbl_org_front_1m',
                name: 'app_hr_org_org_front_class_1m',
                chineseName: '组织前台分类月快照',
                category: '组织',
                subCategory: '组织明细',
                fields: [
                    { name: 'org_id', category: '组织信息', is_unique_key: true }, { name: 'org_name', category: '组织信息' },
                    { name: 'org_code', category: '组织信息' }, { name: 'org_level', category: '组织信息' },
                    { name: 'org_type', category: '组织信息' }, { name: 'parent_org_id', category: '组织信息' },
                    { name: 'org_path', category: '组织信息' }, { name: 'month', category: '系统字段' },
                    { name: 'partition_date', category: '系统字段', is_partition: true }
                ]
            },
            {
                id: 'tbl_org_1m',
                name: 'app_hr_org_org_1m',
                chineseName: '组织月快照表',
                category: '组织',
                subCategory: '组织明细',
                fields: [
                    { name: 'org_id', category: '组织信息', is_unique_key: true }, { name: 'org_name', category: '组织信息' },
                    { name: 'org_code', category: '组织信息' }, { name: 'org_level', category: '组织信息' },
                    { name: 'parent_org_id', category: '组织信息' }, { name: 'emp_count', category: '组织信息' },
                    { name: 'month', category: '系统字段' }, { name: 'partition_date', category: '系统字段', is_partition: true }
                ]
            },
            // 组织表 - 组织指标
            {
                id: 'tbl_develop_perf_org',
                name: 'app_hr_develop_perf_org_front_class_1m',
                chineseName: '组织绩效前台分类月表',
                category: '组织',
                subCategory: '组织指标',
                fields: [
                    { name: 'org_id', category: '组织信息', is_unique_key: true }, { name: 'org_name', category: '组织信息' },
                    { name: 'perf_year', category: '绩效信息' }, { name: 'perf_month', category: '绩效信息' },
                    { name: 'perf_score_avg', category: '绩效信息' }, { name: 'perf_result_dist', category: '绩效信息' },
                    { name: 'emp_count', category: '组织信息' }, { name: 'partition_date', category: '系统字段' }
                ]
            },
            {
                id: 'tbl_org_attr_dis',
                name: 'app_hr_org_org_front_class_attr_dis_1m',
                chineseName: '组织属性分布月表',
                category: '组织',
                subCategory: '组织指标',
                fields: [
                    { name: 'org_id', category: '组织信息', is_unique_key: true }, { name: 'attr_type', category: '组织信息' },
                    { name: 'attr_value', category: '组织信息' }, { name: 'emp_count', category: '组织信息' },
                    { name: 'ratio', category: '组织信息' }, { name: 'month', category: '系统字段' },
                    { name: 'partition_date', category: '系统字段' }
                ]
            },
            {
                id: 'tbl_view_org_attr_1',
                name: 'view_app_hr_org_org_front_class_attr_1',
                chineseName: '组织属性视图1',
                category: '组织',
                subCategory: '组织指标',
                fields: [
                    { name: 'org_id', category: '组织信息', is_unique_key: true }, { name: 'org_name', category: '组织信息' },
                    { name: 'attr_code', category: '组织信息' }, { name: 'attr_name', category: '组织信息' },
                    { name: 'attr_value', category: '组织信息' }, { name: 'partition_date', category: '系统字段' }
                ]
            },
            {
                id: 'tbl_view_org_attr_2',
                name: 'view_app_hr_org_org_front_class_attr_2',
                chineseName: '组织属性视图2',
                category: '组织',
                subCategory: '组织指标',
                fields: [
                    { name: 'org_id', category: '组织信息', is_unique_key: true }, { name: 'org_name', category: '组织信息' },
                    { name: 'attr_code', category: '组织信息' }, { name: 'attr_name', category: '组织信息' },
                    { name: 'attr_value', category: '组织信息' }, { name: 'partition_date', category: '系统字段' }
                ]
            },
            {
                id: 'tbl_view_org_ca_1',
                name: 'view_app_hr_org_org_front_class_ca_1',
                chineseName: '组织分类汇总视图1',
                category: '组织',
                subCategory: '组织指标',
                fields: [
                    { name: 'org_id', category: '组织信息', is_unique_key: true }, { name: 'class_code', category: '组织信息' },
                    { name: 'class_name', category: '组织信息' }, { name: 'emp_count', category: '组织信息' },
                    { name: 'partition_date', category: '系统字段' }
                ]
            },
            {
                id: 'tbl_view_org_ca_2',
                name: 'view_app_hr_org_org_front_class_ca_2',
                chineseName: '组织分类汇总视图2',
                category: '组织',
                subCategory: '组织指标',
                fields: [
                    { name: 'org_id', category: '组织信息', is_unique_key: true }, { name: 'class_code', category: '组织信息' },
                    { name: 'class_name', category: '组织信息' }, { name: 'emp_count', category: '组织信息' },
                    { name: 'partition_date', category: '系统字段' }
                ]
            }
        ];

    // ========== 组织树 Mock 数据 ==========
    var orgTree = [
        {
            id: 'org_ks', name: '快手科技', level: 0, parentId: null, empCount: 12000,
            children: [
                {
                    id: 'org_product', name: '产品技术中心', level: 1, parentId: 'org_ks', empCount: 4500,
                    children: [
                        { id: 'org_product_pm', name: '产品部', level: 2, parentId: 'org_product', empCount: 320, children: [] },
                        { id: 'org_product_tech', name: '技术部', level: 2, parentId: 'org_product', empCount: 1800, children: [
                            { id: 'org_product_tech_infra', name: '基础架构组', level: 3, parentId: 'org_product_tech', empCount: 200, children: [] },
                            { id: 'org_product_tech_be', name: '后端开发组', level: 3, parentId: 'org_product_tech', empCount: 600, children: [] },
                            { id: 'org_product_tech_fe', name: '前端开发组', level: 3, parentId: 'org_product_tech', empCount: 300, children: [] }
                        ]},
                        { id: 'org_product_data', name: '数据工程部', level: 2, parentId: 'org_product', empCount: 280, children: [] }
                    ]
                },
                {
                    id: 'org_commercial', name: '商业化事业群', level: 1, parentId: 'org_ks', empCount: 2800,
                    children: [
                        { id: 'org_commercial_ad', name: '广告营销部', level: 2, parentId: 'org_commercial', empCount: 850, children: [] },
                        { id: 'org_commercial_bd', name: '商务拓展部', level: 2, parentId: 'org_commercial', empCount: 620, children: [] },
                        { id: 'org_commercial_ops', name: '运营中台', level: 2, parentId: 'org_commercial', empCount: 430, children: [] }
                    ]
                },
                {
                    id: 'org_content', name: '内容生态事业群', level: 1, parentId: 'org_ks', empCount: 1600,
                    children: [
                        { id: 'org_content_creator', name: '创作者生态部', level: 2, parentId: 'org_content', empCount: 480, children: [] },
                        { id: 'org_content_live', name: '直播业务部', level: 2, parentId: 'org_content', empCount: 560, children: [] }
                    ]
                },
                {
                    id: 'org_hr', name: '人力资源中心', level: 1, parentId: 'org_ks', empCount: 380,
                    children: [
                        { id: 'org_hr_hrbp', name: 'HRBP团队', level: 2, parentId: 'org_hr', empCount: 85, children: [] },
                        { id: 'org_hr_od', name: 'OD组织发展', level: 2, parentId: 'org_hr', empCount: 40, children: [] },
                        { id: 'org_hr_recruit', name: '招聘团队', level: 2, parentId: 'org_hr', empCount: 90, children: [] },
                        { id: 'org_hr_comp', name: '薪酬福利团队', level: 2, parentId: 'org_hr', empCount: 55, children: [] }
                    ]
                },
                {
                    id: 'org_finance', name: '财务中心', level: 1, parentId: 'org_ks', empCount: 450,
                    children: [
                        { id: 'org_finance_acc', name: '会计核算部', level: 2, parentId: 'org_finance', empCount: 130, children: [] },
                        { id: 'org_finance_bp', name: '财务BP部', level: 2, parentId: 'org_finance', empCount: 80, children: [] }
                    ]
                }
            ]
        }
    ];

    // 组织树扁平化（供搜索用）
    var orgFlatList = [];
    var flattenOrg = function(nodes) {
        nodes.forEach(function(n) {
            orgFlatList.push({ id: n.id, name: n.name, level: n.level, parentId: n.parentId, empCount: n.empCount });
            if (n.children && n.children.length) flattenOrg(n.children);
        });
    };
    flattenOrg(orgTree);

    // ========== HR 岗位角色定义 ==========
    var hrPositionRoles = [
        { id: 'role_hrbp',      name: 'HRBP',            description: '人力资源业务伙伴，负责对接指定业务部门的全方位 HR 支持', icon: 'ph-handshake' },
        { id: 'role_odbp',      name: 'ODBP',              description: '组织发展业务伙伴，负责组织诊断、人才发展和组织效能提升', icon: 'ph-tree-structure' },
        { id: 'role_erbp',      name: 'ERBP',             description: '员工关系业务伙伴，负责员工关系管理、劳动合规与员工体验', icon: 'ph-heart-handshake' },
        { id: 'role_recruiter', name: 'Recruiter',         description: '招聘专员，负责特定业务线或职能的招聘执行工作', icon: 'ph-user-plus' },
        { id: 'role_rec_leader',name: 'Recruiter Leader',  description: '招聘负责人，统筹管辖范围内的招聘策略与团队管理', icon: 'ph-users-three' },
        { id: 'role_bphead',    name: 'BP Head',           description: 'BP 负责人，对某一大业务域的 HR 整体策略与交付负责', icon: 'ph-crown-simple' },
        { id: 'role_bpleader',  name: 'BP Leader',         description: 'BP 团队 Leader，负责管辖范围内 BP 团队的能力建设和日常管理', icon: 'ph-medal' }
    ];

    // ========== 员工 Mock 数据（用于 BP 管辖员工预览）==========
    // 按部门分组，每个部门 6-10 人
    var mockEmployeesByOrg = {
        'org_product_pm': [
            { id: 'e001', name: '张宇航', level: 'E7', title: '高级产品经理', dept: '产品部', orgPath: '快手 / 产品线 / 产品策略部', originalBp: '马倩倩' },
            { id: 'e002', name: '李思雨', level: 'E6', title: '产品经理', dept: '产品部', orgPath: '快手 / 产品线 / 产品策略部', originalBp: '马倩倩' },
            { id: 'e003', name: '王晓明', level: 'E8', title: '资深产品经理', dept: '产品部', orgPath: '快手 / 产品线 / 产品策略部', originalBp: '马倩倩' },
            { id: 'e004', name: '陈静怡', level: 'E5', title: '产品专员', dept: '产品部', orgPath: '快手 / 产品线 / 产品策略部', originalBp: '马倩倩' },
            { id: 'e005', name: '刘子豪', level: 'E6', title: '产品经理', dept: '产品部', orgPath: '快手 / 产品线 / 产品策略部', originalBp: '马倩倩' },
            { id: 'e006', name: '赵美琳', level: 'E9', title: '产品总监', dept: '产品部', orgPath: '快手 / 产品线 / 产品策略部', originalBp: '马倩倩' }
        ],
        'org_product_tech': [
            { id: 'e007', name: '孙浩然', level: 'E7', title: '高级工程师', dept: '技术部', orgPath: '快手 / 产品线 / 产品技术部', originalBp: '宋佳慧' },
            { id: 'e008', name: '周鑫', level: 'E8', title: '资深工程师', dept: '技术部', orgPath: '快手 / 产品线 / 产品技术部', originalBp: '宋佳慧' },
            { id: 'e009', name: '吴月', level: 'E6', title: '工程师', dept: '技术部', orgPath: '快手 / 产品线 / 产品技术部', originalBp: '宋佳慧' },
            { id: 'e010', name: '郑伟国', level: 'E9', title: '技术专家', dept: '技术部', orgPath: '快手 / 产品线 / 产品技术部', originalBp: '宋佳慧' },
            { id: 'e011', name: '冯婷婷', level: 'E5', title: '初级工程师', dept: '技术部', orgPath: '快手 / 产品线 / 产品技术部', originalBp: '宋佳慧' },
            { id: 'e012', name: '蒋昊', level: 'E7', title: '高级工程师', dept: '技术部', orgPath: '快手 / 产品线 / 产品技术部', originalBp: '宋佳慧' },
            { id: 'e013', name: '苏磊', level: 'E6', title: '工程师', dept: '技术部', orgPath: '快手 / 产品线 / 产品技术部', originalBp: '宋佳慧' }
        ],
        'org_product_tech_infra': [
            { id: 'e014', name: '林大伟', level: 'E8', title: '资深架构师', dept: '基础架构组', orgPath: '快手 / 产品线 / 产品技术部 / 基础架构组', originalBp: '宋佳慧' },
            { id: 'e015', name: '许晓冬', level: 'E7', title: '高级工程师', dept: '基础架构组', orgPath: '快手 / 产品线 / 产品技术部 / 基础架构组', originalBp: '宋佳慧' },
            { id: 'e016', name: '潘悦', level: 'E6', title: '工程师', dept: '基础架构组', orgPath: '快手 / 产品线 / 产品技术部 / 基础架构组', originalBp: '宋佳慧' }
        ],
        'org_product_tech_be': [
            { id: 'e017', name: '韩雪峰', level: 'E7', title: '高级后端工程师', dept: '后端开发组', orgPath: '快手 / 产品线 / 产品技术部 / 后端开发组', originalBp: '宋佳慧' },
            { id: 'e018', name: '杨柳', level: 'E6', title: '后端工程师', dept: '后端开发组', orgPath: '快手 / 产品线 / 产品技术部 / 后端开发组', originalBp: '宋佳慧' },
            { id: 'e019', name: '谢天', level: 'E8', title: '技术专家', dept: '后端开发组', orgPath: '快手 / 产品线 / 产品技术部 / 后端开发组', originalBp: '宋佳慧' },
            { id: 'e020', name: '高燕', level: 'E5', title: '初级工程师', dept: '后端开发组', orgPath: '快手 / 产品线 / 产品技术部 / 后端开发组', originalBp: '宋佳慧' }
        ],
        'org_product_tech_fe': [
            { id: 'e021', name: '曹阳', level: 'E7', title: '高级前端工程师', dept: '前端开发组', orgPath: '快手 / 产品线 / 产品技术部 / 前端开发组', originalBp: null },
            { id: 'e022', name: '彭敏', level: 'E6', title: '前端工程师', dept: '前端开发组', orgPath: '快手 / 产品线 / 产品技术部 / 前端开发组', originalBp: null },
            { id: 'e023', name: '丁磊', level: 'E5', title: '前端工程师', dept: '前端开发组', orgPath: '快手 / 产品线 / 产品技术部 / 前端开发组', originalBp: null }
        ],
        'org_commercial_ad': [
            { id: 'e024', name: '黄志远', level: 'E7', title: '高级营销专家', dept: '广告营销部', orgPath: '快手 / 商业化 / 广告营销部', originalBp: '郑晓燕' },
            { id: 'e025', name: '程欢', level: 'E6', title: '营销专员', dept: '广告营销部', orgPath: '快手 / 商业化 / 广告营销部', originalBp: '郑晓燕' },
            { id: 'e026', name: '傅颖', level: 'E8', title: '营销总监', dept: '广告营销部', orgPath: '快手 / 商业化 / 广告营销部', originalBp: '郑晓燕' },
            { id: 'e027', name: '叶志', level: 'E5', title: '营销助理', dept: '广告营销部', orgPath: '快手 / 商业化 / 广告营销部', originalBp: '郑晓燕' }
        ],
        'org_commercial_bd': [
            { id: 'e028', name: '方思远', level: 'E7', title: '商务经理', dept: '商务拓展部', orgPath: '快手 / 商业化 / 商务拓展部', originalBp: null },
            { id: 'e029', name: '邓晓红', level: 'E6', title: '商务专员', dept: '商务拓展部', orgPath: '快手 / 商业化 / 商务拓展部', originalBp: null },
            { id: 'e030', name: '唐飞', level: 'E8', title: '高级商务经理', dept: '商务拓展部', orgPath: '快手 / 商业化 / 商务拓展部', originalBp: null }
        ],
        'org_content_creator': [
            { id: 'e031', name: '薛洁', level: 'E6', title: '运营专员', dept: '创作者生态部', orgPath: '快手 / 内容生态 / 创作者生态部', originalBp: '李梦瑶' },
            { id: 'e032', name: '崔涛', level: 'E7', title: '高级运营专家', dept: '创作者生态部', orgPath: '快手 / 内容生态 / 创作者生态部', originalBp: '李梦瑶' },
            { id: 'e033', name: '段明', level: 'E5', title: '运营助理', dept: '创作者生态部', orgPath: '快手 / 内容生态 / 创作者生态部', originalBp: '李梦瑶' }
        ],
        'org_hr_hrbp': [
            { id: 'e034', name: '陈思思', level: 'E7', title: 'HRBP', dept: 'HRBP团队', orgPath: '快手 / 人力资源中心 / HRBP团队', originalBp: null },
            { id: 'e035', name: '宋佳慧', level: 'E6', title: 'HRBP', dept: 'HRBP团队', orgPath: '快手 / 人力资源中心 / HRBP团队', originalBp: null },
            { id: 'e036', name: '任睿', level: 'E8', title: '资深HRBP', dept: 'HRBP团队', orgPath: '快手 / 人力资源中心 / HRBP团队', originalBp: null }
        ],
        'org_hr_recruit': [
            { id: 'e037', name: '魏芳', level: 'E6', title: '招聘专员', dept: '招聘团队', orgPath: '快手 / 人力资源中心 / 招聘团队', originalBp: null },
            { id: 'e038', name: '贾楠', level: 'E7', title: '高级招聘专员', dept: '招聘团队', orgPath: '快手 / 人力资源中心 / 招聘团队', originalBp: null }
        ]
    };

    // 获取某组织（含子组织）下的所有员工
    var getEmployeesByOrg = function(orgId) {
        var result = [];
        var collect = function(id) {
            if (mockEmployeesByOrg[id]) result = result.concat(mockEmployeesByOrg[id]);
            var node = orgFlatList.find(function(n) { return n.id === id; });
            // 找子节点
            orgFlatList.filter(function(n) { return n.parentId === id; }).forEach(function(child) {
                collect(child.id);
            });
        };
        collect(orgId);
        return result;
    };

    // ========== 各组织各角色当前持有人 ==========
    // 结构：{ orgId: { roleId: { id, name, userName } | null } }
    var orgRoleHolders = {
        'org_ks':                 { role_hrbp: null, role_odbp: { id: 'u_holder_1', name: '刘芳', userName: 'liufang' }, role_bphead: { id: 'u_holder_2', name: '张晓东', userName: 'zhangxiaodong' }, role_bpleader: null, role_erbp: null, role_recruiter: null, role_rec_leader: null },
        'org_product':            { role_hrbp: { id: 'u_holder_3', name: '马倩倩', userName: 'maqianqian' }, role_odbp: { id: 'u_holder_4', name: '吴建国', userName: 'wujianguo' }, role_erbp: null, role_recruiter: null, role_rec_leader: { id: 'u_holder_5', name: '周海燕', userName: 'zhoughaiyan' }, role_bphead: null, role_bpleader: null },
        'org_product_pm':         { role_hrbp: { id: 'u_holder_6', name: '陈思思', userName: 'chenss' }, role_odbp: null, role_erbp: null, role_recruiter: { id: 'u_holder_7', name: '贾楠', userName: 'jianan' }, role_rec_leader: null, role_bphead: null, role_bpleader: null },
        'org_product_tech':       { role_hrbp: { id: 'u_holder_8', name: '宋佳慧', userName: 'songjh' }, role_odbp: null, role_erbp: null, role_recruiter: { id: 'u_holder_9', name: '魏芳', userName: 'weifang' }, role_rec_leader: null, role_bphead: null, role_bpleader: null },
        'org_product_tech_infra': { role_hrbp: null, role_odbp: null, role_erbp: null, role_recruiter: null, role_rec_leader: null, role_bphead: null, role_bpleader: null },
        'org_product_tech_be':    { role_hrbp: null, role_odbp: null, role_erbp: null, role_recruiter: { id: 'u_holder_10', name: '任睿', userName: 'renrui' }, role_rec_leader: null, role_bphead: null, role_bpleader: null },
        'org_product_tech_fe':    { role_hrbp: null, role_odbp: null, role_erbp: null, role_recruiter: null, role_rec_leader: null, role_bphead: null, role_bpleader: null },
        'org_product_data':       { role_hrbp: { id: 'u_holder_11', name: '曲景怡', userName: 'qujingyi' }, role_odbp: null, role_erbp: null, role_recruiter: null, role_rec_leader: null, role_bphead: null, role_bpleader: null },
        'org_commercial':         { role_hrbp: { id: 'u_holder_12', name: '郑晓燕', userName: 'zhengxy' }, role_odbp: null, role_erbp: { id: 'u_holder_13', name: '赵磊', userName: 'zhaolei' }, role_recruiter: null, role_rec_leader: { id: 'u_holder_14', name: '钱伟', userName: 'qianwei' }, role_bphead: null, role_bpleader: null },
        'org_commercial_ad':      { role_hrbp: null, role_odbp: null, role_erbp: null, role_recruiter: { id: 'u_holder_15', name: '孙艳', userName: 'sunyan' }, role_rec_leader: null, role_bphead: null, role_bpleader: null },
        'org_commercial_bd':      { role_hrbp: null, role_odbp: null, role_erbp: null, role_recruiter: null, role_rec_leader: null, role_bphead: null, role_bpleader: null },
        'org_commercial_ops':     { role_hrbp: null, role_odbp: null, role_erbp: null, role_recruiter: null, role_rec_leader: null, role_bphead: null, role_bpleader: null },
        'org_content':            { role_hrbp: { id: 'u_holder_16', name: '李梦瑶', userName: 'limengyao' }, role_odbp: null, role_erbp: null, role_recruiter: null, role_rec_leader: null, role_bphead: null, role_bpleader: null },
        'org_content_creator':    { role_hrbp: null, role_odbp: null, role_erbp: null, role_recruiter: { id: 'u_holder_17', name: '王涛', userName: 'wangtao' }, role_rec_leader: null, role_bphead: null, role_bpleader: null },
        'org_content_live':       { role_hrbp: null, role_odbp: null, role_erbp: null, role_recruiter: null, role_rec_leader: null, role_bphead: null, role_bpleader: null },
        'org_hr':                 { role_hrbp: null, role_odbp: null, role_erbp: null, role_recruiter: null, role_rec_leader: null, role_bphead: { id: 'u_holder_18', name: '吴雪梅', userName: 'wuxuemei' }, role_bpleader: { id: 'u_holder_19', name: '张建平', userName: 'zhangjp' } },
        'org_hr_hrbp':            { role_hrbp: null, role_odbp: null, role_erbp: null, role_recruiter: null, role_rec_leader: null, role_bphead: null, role_bpleader: null },
        'org_hr_recruit':         { role_hrbp: null, role_odbp: null, role_erbp: null, role_recruiter: null, role_rec_leader: { id: 'u_holder_20', name: '林小红', userName: 'linxh' }, role_bphead: null, role_bpleader: null }
    };

    // 搜索组织（关键词命中，不包含子组织）
    var searchOrgs = function(keyword) {
        if (!keyword || !keyword.trim()) return [];
        var kw = keyword.trim().toLowerCase();
        return orgFlatList.filter(function(n) {
            return n.name.toLowerCase().indexOf(kw) >= 0 || n.id.toLowerCase().indexOf(kw) >= 0;
        });
    };

    // 获取某人作为某角色负责的所有部门
    var getOrgsByRoleHolder = function(userName, roleId) {
        var result = [];
        Object.keys(orgRoleHolders).forEach(function(orgId) {
            var holder = orgRoleHolders[orgId] && orgRoleHolders[orgId][roleId];
            if (holder && holder.userName === userName) {
                var org = orgFlatList.find(function(n) { return n.id === orgId; });
                if (org) result.push(org);
            }
        });
        return result;
    };

    // 获取某组织某角色的当前持有人
    var getRoleHolder = function(orgId, roleId) {
        return (orgRoleHolders[orgId] && orgRoleHolders[orgId][roleId]) || null;
    };

    // 搜索用户（用于「查某人负责部门」工具）
    var allUsers = [
        { id: 'u_holder_1', name: '刘芳', userName: 'liufang', department: '人力资源中心' },
        { id: 'u_holder_2', name: '张晓东', userName: 'zhangxiaodong', department: '人力资源中心' },
        { id: 'u_holder_3', name: '马倩倩', userName: 'maqianqian', department: 'HRBP团队' },
        { id: 'u_holder_4', name: '吴建国', userName: 'wujianguo', department: '组织发展部' },
        { id: 'u_holder_5', name: '周海燕', userName: 'zhoughaiyan', department: '招聘团队' },
        { id: 'u_holder_6', name: '陈思思', userName: 'chenss', department: 'HRBP团队' },
        { id: 'u_holder_7', name: '贾楠', userName: 'jianan', department: '招聘团队' },
        { id: 'u_holder_8', name: '宋佳慧', userName: 'songjh', department: 'HRBP团队' },
        { id: 'u_holder_9', name: '魏芳', userName: 'weifang', department: '招聘团队' },
        { id: 'u_holder_10', name: '任睿', userName: 'renrui', department: 'HRBP团队' },
        { id: 'u_holder_11', name: '曲景怡', userName: 'qujingyi', department: 'HRBP团队' },
        { id: 'u_holder_12', name: '郑晓燕', userName: 'zhengxy', department: 'HRBP团队' },
        { id: 'u_holder_13', name: '赵磊', userName: 'zhaolei', department: '员工关系部' },
        { id: 'u_holder_14', name: '钱伟', userName: 'qianwei', department: '招聘团队' },
        { id: 'u_holder_15', name: '孙艳', userName: 'sunyan', department: '招聘团队' },
        { id: 'u_holder_16', name: '李梦瑶', userName: 'limengyao', department: 'HRBP团队' },
        { id: 'u_holder_17', name: '王涛', userName: 'wangtao', department: '招聘团队' },
        { id: 'u_holder_18', name: '吴雪梅', userName: 'wuxuemei', department: '人力资源中心' },
        { id: 'u_holder_19', name: '张建平', userName: 'zhangjp', department: '人力资源中心' },
        { id: 'u_holder_20', name: '林小红', userName: 'linxh', department: '招聘团队' }
    ];

    var searchHrUsers = function(keyword) {
        if (!keyword || !keyword.trim()) return [];
        var kw = keyword.trim().toLowerCase();
        return allUsers.filter(function(u) {
            return u.name.indexOf(kw) >= 0 || u.userName.toLowerCase().indexOf(kw) >= 0;
        }).slice(0, 8);
    };

    window.HR_MOCK = {
        fieldCategories: fieldCategories,
        fieldChineseNameMap: fieldChineseNameMap,
        // topic_hr_emp_all_td 的完整字段列表
        empAllTdFields: enrichFields(allFields),

        // HR 域下所有表（用于权限中心 availableTablesForColumnPermission）
        tables: enrichTables(_rawTables),

        // 组织树
        orgTree: orgTree,
        orgFlatList: orgFlatList,

        // HR 岗位角色定义
        hrPositionRoles: hrPositionRoles,

        // 各组织各角色当前持有人
        orgRoleHolders: orgRoleHolders,

        // 搜索组织（关键词命中，不含子组织）
        searchOrgs: searchOrgs,

        // 获取某人作为某角色负责的部门列表
        getOrgsByRoleHolder: getOrgsByRoleHolder,

        // 获取某组织某角色的当前持有人
        getRoleHolder: getRoleHolder,

        // 搜索 HR 用户（用于「替代查询」工具）
        searchHrUsers: searchHrUsers,
        allUsers: allUsers,

        // 按组织获取员工（含子组织）
        getEmployeesByOrg: getEmployeesByOrg,

        // 预定义行权限规则（按表申请时使用）
        rowPermRules: [
            { id: 'rule_e9_below',  label: '除HR外所有E9及以下员工',   desc: '范围：全公司 E9 及以下级别员工，排除HR部门', isHighLevel: false, isManagedScope: false,
              expression: "level_code IN ('E1','E2','E3','E4','E5','E6','E7','E8','E9')\nAND zero_dept != 'D0193'" },
            { id: 'rule_e10_e13',   label: '除HR外所有E10-E13员工',     desc: '范围：全公司 E10～E13 级别员工，排除HR部门', isHighLevel: false, isManagedScope: false,
              expression: "level_code IN ('E10','E11','E12','E13')\nAND zero_dept != 'D0193'" },
            { id: 'rule_e14_above', label: '除HR外所有E14及以上员工', desc: '范围：全公司 E14 及以上级别员工，排除HR部门', isHighLevel: true,  isManagedScope: false,
              expression: "level_code IN ('E14','E15','E16','E17','E18')\nAND zero_dept != 'D0193'" },
            { id: 'rule_odbp_dept', label: '作为ODBP管辖的部门的员工',   desc: '范围：申请人作为 ODBP 所管辖部门下的员工', isHighLevel: false, isManagedScope: true,
              expression: "dept_id IN (\n  SELECT dept_id FROM odbp_managed_scope\n  WHERE odbp_uid = CURRENT_USER()\n)" }
        ]
    };
})();
