// Skill Mock Data
window.App = window.App || {};
window.App.SkillData = {};

window.App.SkillData.skills = {
    skill_data_analysis: {
        id: "skill_data_analysis",
        name: "data-analysis",
        displayName: "数据分析助手",
        version: "2.1.0",
        author: "AI Team",
        description: "提供强大的数据分析能力，包括数据清洗、统计分析、可视化等功能",
        tags: ["数据分析", "Python", "Pandas", "可视化"],
        createdAt: "2024-01-10",
        updatedAt: "2024-01-25",
        
        // Skill 元数据
        metadata: {
            runtime: "python",
            pythonVersion: ">=3.8",
            dependencies: ["pandas>=1.5.0", "numpy>=1.24.0", "matplotlib>=3.7.0", "seaborn>=0.12.0"],
            entryPoint: "main.py",
            sandboxMode: "isolated"
        },

        // 目录结构
        fileTree: {
            name: "data-analysis",
            type: "directory",
            children: [
                {
                    name: "SKILL.md",
                    type: "file",
                    size: "8.5 KB",
                    description: "Skill 使用指南和 AI 加载指令"
                },
                {
                    name: "main.py",
                    type: "file",
                    size: "12.3 KB",
                    description: "主入口文件，提供数据分析核心功能"
                },
                {
                    name: "requirements.txt",
                    type: "file",
                    size: "0.5 KB",
                    description: "Python 依赖包列表"
                },
                {
                    name: "config.yaml",
                    type: "file",
                    size: "1.2 KB",
                    description: "配置文件"
                },
                {
                    name: "lib",
                    type: "directory",
                    children: [
                        {
                            name: "data_cleaner.py",
                            type: "file",
                            size: "6.8 KB",
                            description: "数据清洗工具"
                        },
                        {
                            name: "stat_analyzer.py",
                            type: "file",
                            size: "9.2 KB",
                            description: "统计分析工具"
                        },
                        {
                            name: "visualizer.py",
                            type: "file",
                            size: "7.5 KB",
                            description: "数据可视化工具"
                        }
                    ]
                },
                {
                    name: "tests",
                    type: "directory",
                    children: [
                        {
                            name: "test_cleaner.py",
                            type: "file",
                            size: "3.2 KB",
                            description: "数据清洗测试用例"
                        },
                        {
                            name: "test_analyzer.py",
                            type: "file",
                            size: "4.1 KB",
                            description: "统计分析测试用例"
                        }
                    ]
                },
                {
                    name: "examples",
                    type: "directory",
                    children: [
                        {
                            name: "basic_usage.ipynb",
                            type: "file",
                            size: "15.6 KB",
                            description: "基础使用示例 (Jupyter Notebook)"
                        },
                        {
                            name: "sample_data.csv",
                            type: "file",
                            size: "245 KB",
                            description: "示例数据集"
                        }
                    ]
                },
                {
                    name: "README.md",
                    type: "file",
                    size: "4.2 KB",
                    description: "项目说明文档"
                }
            ]
        },

        // SKILL.md 内容
        skillMd: `# Data Analysis Skill

## 概述
这是一个专业的数据分析 Skill，为 AI Agent 提供完整的数据分析工具链。

## 核心能力
- 📊 **数据清洗**：处理缺失值、异常值、重复数据
- 📈 **统计分析**：描述性统计、相关分析、假设检验
- 🎨 **数据可视化**：折线图、柱状图、散点图、热力图
- 🔍 **数据探索**：自动生成数据质量报告

## 使用场景
当用户需要分析数据时，AI 应该加载这个 Skill：
- "分析这个 CSV 文件"
- "帮我看看这些数据的分布"
- "生成数据质量报告"
- "画个图展示销售趋势"

## 快速开始

### 1. 导入 Skill
\`\`\`python
from data_analysis import DataAnalyzer

# 初始化分析器
analyzer = DataAnalyzer('data.csv')
\`\`\`

### 2. 数据清洗
\`\`\`python
# 自动清洗数据
cleaned_data = analyzer.clean(
    drop_duplicates=True,
    fill_missing='mean',
    remove_outliers=True
)
\`\`\`

### 3. 统计分析
\`\`\`python
# 生成统计报告
stats = analyzer.describe()
print(stats)

# 相关性分析
correlation = analyzer.correlation_matrix()
\`\`\`

### 4. 可视化
\`\`\`python
# 生成可视化图表
analyzer.plot_distribution(column='sales')
analyzer.plot_trend(x='date', y='revenue')
analyzer.plot_heatmap(columns=['col1', 'col2', 'col3'])
\`\`\`

## API 文档

### DataAnalyzer 类

#### 初始化
\`\`\`python
DataAnalyzer(data_source: str | DataFrame, encoding: str = 'utf-8')
\`\`\`

#### 主要方法
- \`clean(**options)\` - 数据清洗
- \`describe()\` - 描述性统计
- \`correlation_matrix()\` - 相关性矩阵
- \`plot_distribution(column)\` - 分布图
- \`plot_trend(x, y)\` - 趋势图
- \`export_report(format='html')\` - 导出报告

## 配置选项
可以通过 \`config.yaml\` 自定义：
\`\`\`yaml
cleaning:
  missing_threshold: 0.5
  outlier_method: 'iqr'
  
visualization:
  default_theme: 'seaborn'
  figure_size: [12, 6]
  dpi: 100
\`\`\`

## 依赖项
- pandas >= 1.5.0
- numpy >= 1.24.0
- matplotlib >= 3.7.0
- seaborn >= 0.12.0

## 注意事项
⚠️ **数据隐私**：在处理敏感数据时，Skill 运行在隔离沙箱中，不会泄露数据
⚠️ **内存限制**：建议处理的数据集不超过 500MB
⚠️ **文件格式**：支持 CSV, Excel, JSON, Parquet

## 更新日志
- **v2.1.0** (2024-01-25): 新增热力图支持，优化内存使用
- **v2.0.0** (2024-01-15): 重构核心引擎，提升 3x 性能
- **v1.5.0** (2023-12-20): 支持自动数据质量报告`,

        // 示例代码
        examples: [
            {
                title: "基础数据分析流程",
                code: `from data_analysis import DataAnalyzer

# 加载数据
analyzer = DataAnalyzer('sales_data.csv')

# 查看数据概览
print(analyzer.info())

# 清洗数据
cleaned = analyzer.clean(
    drop_duplicates=True,
    fill_missing='median',
    remove_outliers=True
)

# 统计分析
stats = analyzer.describe()
print(f"平均销售额: {stats['sales']['mean']}")
print(f"销售中位数: {stats['sales']['median']}")

# 生成报告
analyzer.export_report(format='html', output='report.html')`
            },
            {
                title: "可视化数据趋势",
                code: `from data_analysis import DataAnalyzer
import matplotlib.pyplot as plt

analyzer = DataAnalyzer('monthly_revenue.csv')

# 绘制时间序列趋势
analyzer.plot_trend(
    x='month',
    y='revenue',
    title='月度收入趋势',
    show_trend_line=True
)

# 绘制分布图
analyzer.plot_distribution(
    column='profit_margin',
    bins=30,
    show_mean=True,
    show_median=True
)

plt.show()`
            },
            {
                title: "相关性分析",
                code: `from data_analysis import DataAnalyzer

analyzer = DataAnalyzer('customer_data.csv')

# 计算相关性矩阵
corr = analyzer.correlation_matrix(
    columns=['age', 'income', 'spending', 'satisfaction']
)

# 可视化相关性热力图
analyzer.plot_heatmap(
    data=corr,
    title='客户特征相关性分析',
    annot=True,  # 显示数值
    cmap='coolwarm'
)

# 找出强相关特征
strong_corr = analyzer.find_strong_correlations(threshold=0.7)
print(strong_corr)`
            }
        ],

        // 使用统计
        usage: {
            totalCalls: 1247,
            lastUsed: "2024-01-26 14:32:15",
            avgExecutionTime: "2.3s",
            successRate: "98.5%",
            topUsers: [
                { name: "数据分析团队", calls: 456 },
                { name: "产品团队", calls: 332 },
                { name: "运营团队", calls: 218 }
            ]
        }
    },

    skill_api_generator: {
        id: "skill_api_generator",
        name: "api-code-generator",
        displayName: "API 代码生成器",
        version: "1.8.0",
        author: "DevTools Team",
        description: "根据 API 规范自动生成后端代码，支持 FastAPI、Flask、Express 等框架",
        tags: ["代码生成", "API", "后端开发", "Python", "Node.js"],
        createdAt: "2023-11-15",
        updatedAt: "2024-01-20",
        
        metadata: {
            runtime: "multi",
            supportedLanguages: ["python", "javascript", "typescript"],
            supportedFrameworks: ["fastapi", "flask", "express", "nestjs"],
            entryPoint: "generator.py",
            sandboxMode: "isolated"
        },

        fileTree: {
            name: "api-code-generator",
            type: "directory",
            children: [
                { name: "SKILL.md", type: "file", size: "10.2 KB" },
                { name: "generator.py", type: "file", size: "18.5 KB" },
                { name: "requirements.txt", type: "file", size: "0.8 KB" },
                {
                    name: "templates",
                    type: "directory",
                    children: [
                        { name: "fastapi_template.jinja2", type: "file", size: "5.2 KB" },
                        { name: "flask_template.jinja2", type: "file", size: "4.8 KB" },
                        { name: "express_template.jinja2", type: "file", size: "6.1 KB" }
                    ]
                },
                {
                    name: "parsers",
                    type: "directory",
                    children: [
                        { name: "openapi_parser.py", type: "file", size: "8.9 KB" },
                        { name: "swagger_parser.py", type: "file", size: "7.3 KB" }
                    ]
                },
                { name: "tests", type: "directory", children: [] },
                { name: "examples", type: "directory", children: [] }
            ]
        },

        skillMd: `# API Code Generator Skill

## 概述
自动根据 API 规范（OpenAPI/Swagger）生成高质量的后端代码。

## 核心能力
- 🚀 支持多种后端框架（FastAPI, Flask, Express, NestJS）
- 📝 自动生成路由、模型、验证逻辑
- 🔒 内置安全最佳实践（鉴权、限流、CORS）
- 📚 自动生成 API 文档

## 使用场景
当用户需要快速搭建 API 服务时：
- "根据这个 OpenAPI spec 生成 FastAPI 代码"
- "帮我创建一个 RESTful API 服务"
- "生成带鉴权的用户管理接口"

## 快速开始
\`\`\`python
from api_code_generator import APIGenerator

# 从 OpenAPI 规范生成代码
generator = APIGenerator('api-spec.yaml')
generator.generate(
    framework='fastapi',
    output_dir='./generated',
    include_tests=True
)
\`\`\`

生成的代码结构：
\`\`\`
generated/
├── main.py          # 应用入口
├── models.py        # 数据模型
├── routes.py        # API 路由
├── schemas.py       # Pydantic schemas
├── auth.py          # 鉴权中间件
├── tests/           # 测试用例
└── requirements.txt # 依赖项
\`\`\``,

        examples: [
            {
                title: "生成 FastAPI 服务",
                code: `from api_code_generator import APIGenerator

generator = APIGenerator('user-api.yaml')
generator.generate(
    framework='fastapi',
    features=['auth', 'validation', 'pagination'],
    output_dir='./user_service'
)

print("✅ API 代码生成完成！")
print("运行服务: cd user_service && uvicorn main:app --reload")`
            }
        ],

        usage: {
            totalCalls: 892,
            lastUsed: "2024-01-26 16:45:30",
            avgExecutionTime: "5.1s",
            successRate: "96.8%"
        }
    },

    skill_k8s_ops: {
        id: "skill_k8s_ops",
        name: "k8s-operations",
        displayName: "Kubernetes 运维助手",
        version: "3.2.1",
        author: "SRE Team",
        description: "提供 K8s 集群管理、故障诊断、自动化运维能力",
        tags: ["Kubernetes", "运维", "DevOps", "自动化"],
        createdAt: "2023-09-10",
        updatedAt: "2024-01-22",
        
        metadata: {
            runtime: "python",
            pythonVersion: ">=3.9",
            dependencies: ["kubernetes>=28.0.0", "pyyaml>=6.0", "click>=8.1.0"],
            entryPoint: "k8s_ops.py",
            sandboxMode: "controlled"
        },

        fileTree: {
            name: "k8s-operations",
            type: "directory",
            children: [
                { name: "SKILL.md", type: "file", size: "12.8 KB" },
                { name: "k8s_ops.py", type: "file", size: "22.1 KB" },
                { name: "requirements.txt", type: "file", size: "0.6 KB" },
                { name: "kubeconfig.yaml", type: "file", size: "2.1 KB" },
                {
                    name: "operations",
                    type: "directory",
                    children: [
                        { name: "pod_manager.py", type: "file", size: "9.8 KB" },
                        { name: "deployment_controller.py", type: "file", size: "11.2 KB" },
                        { name: "health_checker.py", type: "file", size: "7.5 KB" },
                        { name: "log_collector.py", type: "file", size: "6.3 KB" }
                    ]
                },
                {
                    name: "diagnostics",
                    type: "directory",
                    children: [
                        { name: "error_analyzer.py", type: "file", size: "8.7 KB" },
                        { name: "performance_profiler.py", type: "file", size: "10.2 KB" }
                    ]
                },
                { name: "scripts", type: "directory", children: [] },
                { name: "tests", type: "directory", children: [] }
            ]
        },

        skillMd: `# Kubernetes Operations Skill

## 概述
专业的 K8s 运维工具集，提供集群管理、故障诊断、自动化运维能力。

## 核心能力
- 🔧 **Pod 管理**：重启、扩缩容、日志查看
- 🩺 **健康检查**：自动检测集群健康状态
- 🐛 **故障诊断**：智能分析常见问题（镜像拉取失败、OOM、CrashLoop）
- 📊 **性能监控**：资源使用率、响应时间分析
- 🤖 **自动化运维**：一键执行常见运维任务

## 使用场景
- "重启 production 环境的 payment-service"
- "检查集群健康状态"
- "为什么这个 Pod 一直 CrashLoopBackOff？"
- "查看最近的错误日志"

## 快速开始
\`\`\`python
from k8s_operations import K8sOperator

# 初始化（自动加载 kubeconfig）
operator = K8sOperator(cluster='prod-cluster-01')

# 重启 Pod
operator.restart_pod(
    namespace='production',
    pod_name='payment-service-7d8f9c',
    confirm=True
)

# 检查健康状态
health = operator.check_health(namespace='production')
print(health.summary())

# 诊断问题
diagnosis = operator.diagnose_pod('failing-pod')
print(diagnosis.suggestions)
\`\`\`

## 安全机制
⚠️ **生产环境保护**：对生产环境的操作需要二次确认
⚠️ **权限控制**：基于 RBAC，只能操作授权的命名空间
⚠️ **操作审计**：所有操作自动记录日志`,

        examples: [
            {
                title: "重启故障 Pod",
                code: `from k8s_operations import K8sOperator

operator = K8sOperator('prod-cluster-01')

# 查找问题 Pod
problem_pods = operator.find_unhealthy_pods(namespace='production')

for pod in problem_pods:
    print(f"发现问题 Pod: {pod.name} - 状态: {pod.status}")
    
    # 诊断问题
    diagnosis = operator.diagnose_pod(pod.name)
    print(f"问题原因: {diagnosis.root_cause}")
    print(f"建议操作: {diagnosis.suggestion}")
    
    # 如果是 CrashLoop，尝试重启
    if diagnosis.issue_type == 'CrashLoopBackOff':
        operator.restart_pod(pod.name, namespace='production')`
            },
            {
                title: "集群健康检查",
                code: `from k8s_operations import K8sOperator

operator = K8sOperator('prod-cluster-01')

# 全面健康检查
report = operator.health_check_all()

print(f"集群状态: {report.status}")
print(f"节点数: {report.total_nodes} (正常: {report.healthy_nodes})")
print(f"Pod 数: {report.total_pods} (运行中: {report.running_pods})")

# 异常告警
if report.alerts:
    for alert in report.alerts:
        print(f"⚠️ {alert.severity}: {alert.message}")`
            }
        ],

        usage: {
            totalCalls: 3421,
            lastUsed: "2024-01-26 18:12:05",
            avgExecutionTime: "1.8s",
            successRate: "99.2%"
        }
    },

    skill_db_migration: {
        id: "skill_db_migration",
        name: "database-migration-helper",
        displayName: "数据库迁移助手",
        version: "1.5.2",
        author: "Database Team",
        description: "自动生成数据库迁移脚本，支持版本管理和回滚，兼容多种数据库",
        tags: ["数据库", "迁移", "SQL", "版本管理"],
        createdAt: "2023-10-05",
        updatedAt: "2024-01-18",
        
        metadata: {
            runtime: "python",
            pythonVersion: ">=3.9",
            dependencies: ["sqlalchemy>=2.0.0", "alembic>=1.12.0", "pymysql>=1.1.0", "psycopg2>=2.9.0"],
            entryPoint: "migrate.py",
            sandboxMode: "controlled"
        },

        fileTree: {
            name: "database-migration-helper",
            type: "directory",
            children: [
                { name: "SKILL.md", type: "file", size: "9.8 KB" },
                { name: "migrate.py", type: "file", size: "16.2 KB" },
                { name: "requirements.txt", type: "file", size: "0.7 KB" },
                { name: "config.yaml", type: "file", size: "1.5 KB" },
                {
                    name: "generators",
                    type: "directory",
                    children: [
                        { name: "schema_differ.py", type: "file", size: "11.4 KB" },
                        { name: "sql_generator.py", type: "file", size: "9.8 KB" },
                        { name: "rollback_generator.py", type: "file", size: "7.2 KB" }
                    ]
                },
                {
                    name: "adapters",
                    type: "directory",
                    children: [
                        { name: "mysql_adapter.py", type: "file", size: "6.5 KB" },
                        { name: "postgres_adapter.py", type: "file", size: "6.8 KB" },
                        { name: "sqlite_adapter.py", type: "file", size: "4.2 KB" }
                    ]
                },
                {
                    name: "templates",
                    type: "directory",
                    children: [
                        { name: "migration_template.sql", type: "file", size: "2.1 KB" },
                        { name: "rollback_template.sql", type: "file", size: "1.8 KB" }
                    ]
                },
                { name: "tests", type: "directory", children: [] },
                { name: "README.md", type: "file", size: "5.5 KB" }
            ]
        },

        skillMd: `# Database Migration Helper Skill

## 概述
自动化数据库迁移工具，帮助开发者安全地管理数据库 schema 变更。

## 核心能力
- 🔍 **Schema 对比**：自动检测两个数据库之间的差异
- 📝 **迁移脚本生成**：自动生成 SQL 迁移脚本
- ↩️ **回滚支持**：生成对应的回滚脚本，支持安全回退
- 🗄️ **多数据库支持**：MySQL, PostgreSQL, SQLite
- 📊 **版本管理**：基于 Alembic 的版本控制
- ✅ **安全检查**：迁移前自动备份和风险评估

## 使用场景
当用户需要管理数据库变更时：
- "帮我生成数据库迁移脚本"
- "对比开发环境和生产环境的数据库差异"
- "回滚上一次的数据库迁移"
- "给用户表添加一个字段"

## 快速开始

### 1. 连接数据库
\`\`\`python
from database_migration import MigrationHelper

# 初始化
helper = MigrationHelper(
    source_db='mysql://user:pass@localhost/dev_db',
    target_db='mysql://user:pass@prod.example.com/prod_db'
)
\`\`\`

### 2. 检测差异
\`\`\`python
# 对比两个数据库的 schema
diff = helper.compare_schemas()

print(f"发现 {len(diff.changes)} 处差异:")
for change in diff.changes:
    print(f"  - {change.type}: {change.description}")
\`\`\`

### 3. 生成迁移脚本
\`\`\`python
# 生成迁移和回滚脚本
migration = helper.generate_migration(
    version='v2.3.0',
    description='添加用户表的 avatar 字段'
)

print(f"迁移脚本: {migration.forward_sql}")
print(f"回滚脚本: {migration.rollback_sql}")
\`\`\`

### 4. 执行迁移
\`\`\`python
# 应用迁移（带确认）
result = helper.apply_migration(
    migration_id='v2.3.0',
    dry_run=True,  # 先模拟运行
    auto_backup=True  # 自动备份
)

if result.success:
    print("✅ 迁移成功完成")
else:
    print(f"❌ 迁移失败: {result.error}")
\`\`\`

## API 文档

### MigrationHelper 类

#### compare_schemas()
对比源数据库和目标数据库的 schema 差异。

**返回**: SchemaDiff 对象
- \`changes\`: 变更列表
- \`tables_added\`: 新增的表
- \`tables_removed\`: 删除的表
- \`columns_changed\`: 字段变更

#### generate_migration(version, description, changes=None)
生成迁移脚本。

**参数**:
- \`version\`: 版本号
- \`description\`: 变更描述
- \`changes\`: 可选，指定变更（不指定则自动检测）

**返回**: Migration 对象
- \`forward_sql\`: 前向迁移 SQL
- \`rollback_sql\`: 回滚 SQL
- \`safety_warnings\`: 安全警告列表

#### apply_migration(migration_id, dry_run=False, auto_backup=True)
执行迁移。

**参数**:
- \`migration_id\`: 迁移版本号
- \`dry_run\`: 模拟运行，不实际执行
- \`auto_backup\`: 执行前自动备份

#### rollback_migration(version=None)
回滚迁移。

**参数**:
- \`version\`: 回滚到的版本（默认回滚上一个版本）

## 安全机制

⚠️ **自动备份**：执行迁移前自动创建数据库备份
⚠️ **风险评估**：自动识别高风险操作（如删除表、删除字段）
⚠️ **Dry Run**：支持模拟执行，预览变更效果
⚠️ **事务保护**：迁移在事务中执行，失败自动回滚
⚠️ **锁定保护**：执行迁移时锁定数据库，防止并发修改

## 支持的数据库

| 数据库 | 版本 | 状态 |
|--------|------|------|
| MySQL | 5.7+ | ✅ 完全支持 |
| PostgreSQL | 12+ | ✅ 完全支持 |
| SQLite | 3.35+ | ⚠️ 部分支持 |
| SQL Server | - | 🚧 开发中 |

## 限制说明

- 不支持跨数据库类型迁移（如 MySQL → PostgreSQL）
- 大表迁移（>100万行）需要特殊处理
- 外键约束变更需要手动审核
- 不支持存储过程和触发器的自动迁移`,

        examples: [
            {
                title: "添加新字段",
                code: `from database_migration import MigrationHelper

helper = MigrationHelper('mysql://localhost/mydb')

# 定义变更
change = helper.add_column(
    table='users',
    column='avatar_url',
    type='VARCHAR(255)',
    nullable=True,
    default=None
)

# 生成迁移
migration = helper.generate_migration(
    version='v2.3.0',
    description='添加用户头像字段',
    changes=[change]
)

# 查看生成的 SQL
print("前向迁移:")
print(migration.forward_sql)
print("\\n回滚脚本:")
print(migration.rollback_sql)

# 应用迁移
helper.apply_migration('v2.3.0', dry_run=False, auto_backup=True)`
            },
            {
                title: "对比环境差异",
                code: `from database_migration import MigrationHelper

# 对比开发和生产环境
helper = MigrationHelper(
    source_db='mysql://localhost/dev_db',
    target_db='mysql://prod.server/prod_db'
)

# 检测差异
diff = helper.compare_schemas()

print(f"共发现 {len(diff.changes)} 处差异:\\n")

# 新增的表
if diff.tables_added:
    print("新增表:")
    for table in diff.tables_added:
        print(f"  + {table}")

# 字段变更
if diff.columns_changed:
    print("\\n字段变更:")
    for change in diff.columns_changed:
        print(f"  ~ {change.table}.{change.column}: {change.description}")

# 生成同步脚本
migration = helper.generate_migration(
    version='prod_sync_v1',
    description='同步生产环境到最新 schema'
)

print(f"\\n生成的迁移脚本已保存到: {migration.file_path}")`
            },
            {
                title: "回滚迁移",
                code: `from database_migration import MigrationHelper

helper = MigrationHelper('mysql://localhost/mydb')

# 查看当前版本
current = helper.get_current_version()
print(f"当前版本: {current}")

# 查看迁移历史
history = helper.get_migration_history()
for entry in history:
    print(f"{entry.version} - {entry.description} ({entry.applied_at})")

# 回滚到上一个版本
result = helper.rollback_migration()

if result.success:
    print(f"✅ 成功回滚到版本: {result.version}")
else:
    print(f"❌ 回滚失败: {result.error}")
    # 如果回滚失败，可以从备份恢复
    helper.restore_from_backup(result.backup_id)`
            }
        ],

        usage: {
            totalCalls: 1567,
            lastUsed: "2024-01-26 15:28:40",
            avgExecutionTime: "3.5s",
            successRate: "97.8%",
            topUsers: [
                { name: "后端开发团队", calls: 789 },
                { name: "数据库管理员", calls: 512 },
                { name: "DevOps 团队", calls: 266 }
            ]
        }
    }
};
