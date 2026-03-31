(function() {
    const { ref, computed, onMounted } = Vue;

const DetailFunction = {
    name: 'DetailFunction',
    props: ['node', 'globalTags'],
    setup(props) {
        const funcData = ref(null);
        const loading = ref(true);
        const activeTab = ref('api'); // api, examples
        const testMode = ref(false);
        const testParams = ref({});
        const testResult = ref(null);

        // Mock 数据
        const mockFunctionData = {
            func_305: {
                id: "func_305",
                name: "submit_leave_request",
                display_name: "提交请假申请",
                description: "员工提交请假申请，支持事假、病假、年假等类型。提交后进入审批流程。",
                category: "HR/审批流程",
                version: "1.2.0",
                author: "hr_system",
                updatedAt: "2024-01-15",
                tags: ["HR", "审批", "请假"],
                icon: "📝",
                
                capability: {
                    intent: "用户需要请假时调用此接口提交申请单",
                    when_to_use: "用户明确表达请假需求，如'我要请假'、'明天不来了'、'帮我申请病假'等",
                    limitations: [
                        "不支持跨年度请假",
                        "病假超过3天需要医院证明"
                    ]
                },
                
                api: {
                    endpoint: "https://api.company.com/hr/leaves",
                    method: "POST",
                    auth: {
                        type: "bearer",
                        header_name: "Authorization"
                    }
                },
                
                schema: {
                    input: {
                        required: ["leave_type", "start_date", "end_date"],
                        properties: {
                            leave_type: {
                                type: "string",
                                enum: ["annual_leave", "sick_leave", "personal_leave"],
                                description: "请假类型",
                                enumLabels: {
                                    annual_leave: "年假",
                                    sick_leave: "病假",
                                    personal_leave: "事假"
                                },
                                example: "sick_leave"
                            },
                            start_date: {
                                type: "string",
                                format: "date",
                                description: "开始日期（YYYY-MM-DD）",
                                example: "2024-01-24"
                            },
                            end_date: {
                                type: "string",
                                format: "date",
                                description: "结束日期（YYYY-MM-DD）",
                                example: "2024-01-24"
                            },
                            reason: {
                                type: "string",
                                description: "请假原因（可选）",
                                example: "发烧，需要休息"
                            }
                        }
                    },
                    output: {
                        properties: {
                            request_id: {
                                type: "string",
                                description: "申请单号"
                            },
                            status: {
                                type: "string",
                                description: "申请状态"
                            },
                            approvers: {
                                type: "array",
                                description: "审批人列表"
                            }
                        }
                    },
                    errors: {
                        "400": "参数错误：日期格式不正确或开始日期晚于结束日期",
                        "403": "权限不足：用户没有提交请假权限",
                        "409": "冲突：该时间段已有其他请假申请"
                    }
                },
                
                examples: [
                    {
                        scenario: "提交一天病假",
                        input: {
                            leave_type: "sick_leave",
                            start_date: "2024-01-24",
                            end_date: "2024-01-24",
                            reason: "发烧，需要休息"
                        },
                        output: {
                            request_id: "#2024012401",
                            status: "pending",
                            approvers: ["张经理", "HR部门"]
                        }
                    }
                ],
                
                monitoring: {
                    health_status: "healthy",
                    today_calls: 45,
                    success_rate: 98.5,
                    avg_response_time: "120ms"
                }
            },
            func_88: {
                id: "func_88",
                name: "restart_k8s_pod",
                display_name: "重启 K8s Pod",
                description: "重启指定 Kubernetes 集群中的 Pod，支持强制重启和优雅重启。",
                category: "SRE/运维",
                version: "2.0.1",
                author: "sre_team",
                updatedAt: "2024-01-20",
                tags: ["K8s", "运维", "重启"],
                icon: "🔄",
                
                capability: {
                    intent: "需要重启 Pod 时调用，支持生产环境和测试环境",
                    when_to_use: "Pod 异常、需要更新配置、手动故障恢复等场景",
                    limitations: [
                        "生产环境需要二次确认",
                        "仅 SRE 域用户可用"
                    ]
                },
                
                api: {
                    endpoint: "https://api.company.com/k8s/pods/restart",
                    method: "POST",
                    auth: {
                        type: "bearer",
                        header_name: "Authorization"
                    }
                },
                
                schema: {
                    input: {
                        required: ["namespace", "pod_name", "cluster"],
                        properties: {
                            namespace: {
                                type: "string",
                                description: "命名空间",
                                example: "production"
                            },
                            pod_name: {
                                type: "string",
                                description: "Pod 名称",
                                example: "payment-service-7d8f9c"
                            },
                            cluster: {
                                type: "string",
                                description: "集群名称",
                                example: "prod-cluster-01"
                            },
                            force: {
                                type: "boolean",
                                description: "是否强制重启",
                                example: false
                            }
                        }
                    },
                    output: {
                        properties: {
                            success: {
                                type: "boolean",
                                description: "是否成功"
                            },
                            new_pod_id: {
                                type: "string",
                                description: "新 Pod ID"
                            },
                            restart_time: {
                                type: "string",
                                description: "重启耗时"
                            }
                        }
                    },
                    errors: {
                        "403": "权限不足：仅 SRE 用户可操作",
                        "404": "Pod 不存在",
                        "500": "重启失败，请检查集群状态"
                    }
                },
                
                examples: [
                    {
                        scenario: "重启生产环境 Pod",
                        input: {
                            namespace: "production",
                            pod_name: "payment-service-7d8f9c",
                            cluster: "prod-cluster-01",
                            force: false
                        },
                        output: {
                            success: true,
                            new_pod_id: "payment-service-a1b2c3",
                            restart_time: "15s"
                        }
                    }
                ],
                
                monitoring: {
                    health_status: "healthy",
                    today_calls: 12,
                    success_rate: 100,
                    avg_response_time: "3200ms"
                }
            },
            func_logger: {
                id: "func_logger",
                name: "system_logger_v2",
                display_name: "系统日志记录",
                description: "记录系统操作日志，支持多级别日志和结构化存储。",
                category: "通用/工具",
                version: "2.1.0",
                author: "platform_team",
                updatedAt: "2024-01-10",
                tags: ["日志", "监控", "工具"],
                icon: "📋",
                
                capability: {
                    intent: "需要记录操作日志时调用",
                    when_to_use: "关键操作、错误追踪、审计需求等场景",
                    limitations: ["单次日志内容不超过 10KB"]
                },
                
                api: {
                    endpoint: "https://api.company.com/logs",
                    method: "POST",
                    auth: {
                        type: "api_key",
                        header_name: "X-API-Key"
                    }
                },
                
                schema: {
                    input: {
                        required: ["level", "message"],
                        properties: {
                            level: {
                                type: "string",
                                enum: ["info", "warn", "error"],
                                description: "日志级别",
                                example: "info"
                            },
                            message: {
                                type: "string",
                                description: "日志内容",
                                example: "用户登录成功"
                            },
                            metadata: {
                                type: "object",
                                description: "附加元数据"
                            }
                        }
                    },
                    output: {
                        properties: {
                            log_id: {
                                type: "string",
                                description: "日志 ID"
                            },
                            timestamp: {
                                type: "string",
                                description: "记录时间"
                            }
                        }
                    },
                    errors: {
                        "400": "参数错误",
                        "413": "日志内容过大"
                    }
                },
                
                examples: [
                    {
                        scenario: "记录用户操作",
                        input: {
                            level: "info",
                            message: "用户提交请假申请",
                            metadata: {
                                user_id: "E001",
                                action: "submit_leave"
                            }
                        },
                        output: {
                            log_id: "log_20240124_001",
                            timestamp: "2024-01-24T10:30:00Z"
                        }
                    }
                ],
                
                monitoring: {
                    health_status: "healthy",
                    today_calls: 1523,
                    success_rate: 99.9,
                    avg_response_time: "50ms"
                }
            }
        };

        onMounted(() => {
            loadFunctionData();
        });

        const loadFunctionData = () => {
            loading.value = true;
            const funcId = props.node.id;
            funcData.value = mockFunctionData[funcId];
            loading.value = false;
        };

        const healthStatusColor = computed(() => {
            if (!funcData.value) return 'gray';
            const status = funcData.value.monitoring.health_status;
            return status === 'healthy' ? 'green' : status === 'degraded' ? 'orange' : 'red';
        });

        const healthStatusLabel = computed(() => {
            if (!funcData.value) return '未知';
            const status = funcData.value.monitoring.health_status;
            return status === 'healthy' ? '正常' : status === 'degraded' ? '降级' : '故障';
        });

        const testCall = () => {
            testResult.value = {
                success: true,
                message: "这是模拟调用，实际环境会调用真实 API",
                data: funcData.value.examples[0].output
            };
        };

        return {
            funcData,
            loading,
            activeTab,
            testMode,
            testParams,
            testResult,
            healthStatusColor,
            healthStatusLabel,
            testCall,
            
            // ==================== 标签管理 ====================
            resourceTags: ref(props.node.tags || ['基础知识', '通用工具']),
            showAddTagInput: ref(false),
            newTagName: ref(''),
            
            addTag() {
                if (this.newTagName.trim()) {
                    const tag = this.newTagName.trim();
                    if (!this.resourceTags.includes(tag)) {
                        this.resourceTags.push(tag);
                        if (!props.node.tags) props.node.tags = [];
                        if (!props.node.tags.includes(tag)) props.node.tags.push(tag);
                        
                        // 模拟全局同步
                        if (window.App && window.App.addGlobalTag) {
                            window.App.addGlobalTag(tag);
                        }
                    }
                    this.newTagName = '';
                    this.showAddTagInput = false;
                }
            }
        };
    },
    template: `
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="!funcData" class="error">未找到函数数据</div>
        <div v-else class="detail-function">
            <!-- 简洁 Header -->
            <div class="function-header">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-1">
                        <h1>{{ funcData.name }}</h1>
                        <span class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-bold uppercase tracking-wider border border-purple-200">
                            {{ funcData.version }}
                        </span>
                    </div>
                    
                    <!-- Resource Tags -->
                    <div class="flex items-center gap-1.5 py-1">
                        <div v-for="tag in resourceTags" :key="tag" 
                            class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium border border-slate-200">
                            {{ tag }}
                        </div>
                        <div class="relative">
                            <button v-if="!showAddTagInput" @click="showAddTagInput = true" 
                                class="w-5 h-5 flex items-center justify-center rounded border border-dashed border-slate-300 text-slate-400 hover:text-indigo-600 hover:border-indigo-400 transition-all">
                                <i class="ph ph-plus text-xs"></i>
                            </button>
                            <div v-else class="flex items-center gap-1 bg-white border border-indigo-200 rounded px-1 py-0.5 shadow-sm absolute left-0 top-0 z-10">
                                <input v-model="newTagName" @keyup.enter="addTag" list="global-func-tags"
                                    class="w-20 text-[10px] outline-none" placeholder="输入新标签..." />
                                <datalist id="global-func-tags">
                                    <option v-for="tag in globalTags" :key="tag" :value="tag"></option>
                                </datalist>
                                <button @click="addTag" class="text-indigo-600"><i class="ph-bold ph-check text-[10px]"></i></button>
                                <button @click="showAddTagInput = false" class="text-slate-400"><i class="ph ph-x text-[10px]"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="header-actions">
                    <button class="btn-test" @click="testMode = !testMode">测试</button>
                </div>
            </div>

            <!-- Description -->
            <div class="function-description">{{ funcData.description }}</div>

            <!-- Tabs -->
            <div class="tabs">
                <button 
                    :class="['tab', { active: activeTab === 'api' }]"
                    @click="activeTab = 'api'"
                >
                    API 与参数
                </button>
                <button 
                    :class="['tab', { active: activeTab === 'examples' }]"
                    @click="activeTab = 'examples'"
                >
                    示例
                </button>
            </div>

            <!-- Tab Content -->
            <div class="tab-content">
                <!-- API Tab -->
                <div v-show="activeTab === 'api'" class="tab-pane">
                    <!-- API 基础信息 -->
                    <section class="section">
                        <h3>API</h3>
                        <table class="info-table">
                            <tr>
                                <td class="label">endpoint</td>
                                <td><code>{{ funcData.api.endpoint }}</code></td>
                            </tr>
                            <tr>
                                <td class="label">method</td>
                                <td><span class="method-badge">{{ funcData.api.method }}</span></td>
                            </tr>
                            <tr>
                                <td class="label">auth</td>
                                <td>{{ funcData.api.auth.type }} ({{ funcData.api.auth.header_name }})</td>
                            </tr>
                        </table>
                    </section>

                    <!-- Input -->
                    <section class="section">
                        <h3>input</h3>
                        <table class="schema-table">
                            <thead>
                                <tr>
                                    <th>字段</th>
                                    <th>类型</th>
                                    <th>必填</th>
                                    <th>说明</th>
                                    <th>示例</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(prop, key) in funcData.schema.input.properties" :key="key">
                                    <td><code>{{ key }}</code></td>
                                    <td>
                                        <span class="type-badge">{{ prop.type }}</span>
                                        <span v-if="prop.enum" class="enum-badge">enum</span>
                                    </td>
                                    <td>
                                        <span v-if="funcData.schema.input.required.includes(key)" class="required">✓</span>
                                        <span v-else class="optional">-</span>
                                    </td>
                                    <td>
                                        {{ prop.description }}
                                        <div v-if="prop.enum" class="enum-values">
                                            <span v-for="(val, idx) in prop.enum" :key="idx" class="enum-item">
                                                {{ val }}
                                                <span v-if="prop.enumLabels && prop.enumLabels[val]" class="enum-label">
                                                    ({{ prop.enumLabels[val] }})
                                                </span>
                                            </span>
                                        </div>
                                    </td>
                                    <td><code>{{ prop.example }}</code></td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <!-- Output -->
                    <section class="section">
                        <h3>output</h3>
                        <table class="schema-table">
                            <thead>
                                <tr>
                                    <th>字段</th>
                                    <th>类型</th>
                                    <th>说明</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(prop, key) in funcData.schema.output.properties" :key="key">
                                    <td><code>{{ key }}</code></td>
                                    <td><span class="type-badge">{{ prop.type }}</span></td>
                                    <td>{{ prop.description }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <!-- Errors -->
                    <section class="section">
                        <h3>errors</h3>
                        <table class="error-table">
                            <thead>
                                <tr>
                                    <th>状态码</th>
                                    <th>说明</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(msg, code) in funcData.schema.errors" :key="code">
                                    <td><span class="error-code">{{ code }}</span></td>
                                    <td>{{ msg }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <!-- Capability -->
                    <section class="section">
                        <h3>capability (AI 调用指引)</h3>
                        <table class="info-table">
                            <tr>
                                <td class="label">intent</td>
                                <td>{{ funcData.capability.intent }}</td>
                            </tr>
                            <tr>
                                <td class="label">when_to_use</td>
                                <td>{{ funcData.capability.when_to_use }}</td>
                            </tr>
                            <tr v-if="funcData.capability.limitations.length">
                                <td class="label">limitations</td>
                                <td>
                                    <ul class="limitations-list">
                                        <li v-for="(limit, idx) in funcData.capability.limitations" :key="idx">
                                            {{ limit }}
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        </table>
                    </section>
                </div>

                <!-- Examples Tab -->
                <div v-show="activeTab === 'examples'" class="tab-pane">
                    <div v-for="(example, idx) in funcData.examples" :key="idx" class="example-block">
                        <h3>{{ example.scenario }}</h3>
                        <div class="example-section">
                            <h4>input</h4>
                            <pre><code>{{ JSON.stringify(example.input, null, 2) }}</code></pre>
                        </div>
                        <div class="example-section">
                            <h4>output</h4>
                            <pre><code>{{ JSON.stringify(example.output, null, 2) }}</code></pre>
                        </div>
                        <div class="example-section">
                            <h4>调用代码</h4>
                            <pre><code>await call_service('{{ funcData.id }}', {{ JSON.stringify(example.input, null, 2) }});</code></pre>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Test Panel -->
            <div v-if="testMode" class="test-panel">
                <h3>测试调用</h3>
                <div class="test-form">
                    <div v-for="(prop, key) in funcData.schema.input.properties" :key="key" class="form-group">
                        <label>
                            {{ key }}
                            <span v-if="funcData.schema.input.required.includes(key)" class="required-mark">*</span>
                        </label>
                        <input 
                            v-if="prop.type === 'string' && !prop.enum" 
                            v-model="testParams[key]"
                            :placeholder="prop.example"
                            class="form-input"
                        />
                        <select v-else-if="prop.enum" v-model="testParams[key]" class="form-select">
                            <option value="">请选择</option>
                            <option v-for="val in prop.enum" :key="val" :value="val">
                                {{ prop.enumLabels && prop.enumLabels[val] ? prop.enumLabels[val] : val }}
                            </option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button @click="testCall" class="btn-submit">执行</button>
                        <button @click="testMode = false" class="btn-cancel">取消</button>
                    </div>
                </div>
                <div v-if="testResult" class="test-result">
                    <h4>结果</h4>
                    <pre><code>{{ JSON.stringify(testResult, null, 2) }}</code></pre>
                </div>
            </div>
        </div>
    `
};

// 导出到全局
if (!window.App) window.App = {};
if (!window.App.Components) window.App.Components = {};
window.App.Components.DetailFunction = DetailFunction;
})();
