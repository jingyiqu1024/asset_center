// DetailSkill Component - IDE Style with File Tree + Editor
window.App = window.App || {};
window.App.Components = window.App.Components || {};

window.App.Components.DetailSkill = {
    props: ['node', 'globalTags'],
    setup(props) {
        const { ref, computed, onMounted } = Vue;
        const skillData = ref(null);
        const selectedFile = ref(null);
        const fileContent = ref('');
        const expandedFolders = ref(new Set(['root']));
        const currentVersion = ref('v2.1.0'); // 当前选择的版本
        const showVersionDropdown = ref(false);
        const showPublishModal = ref(false);
        const publishForm = ref({
            version: '',
            environment: 'test', // test, pre, online
            description: ''
        });

        // 版本列表（模拟）
        const versions = ref([
            {
                version: 'v2.1.0',
                date: '2024-01-25',
                author: 'AI Team',
                description: '新增热力图支持',
                environments: {
                    online: true,   // 已发布到生产
                    pre: false,     // 未发布到预发
                    test: true      // 已发布到测试
                }
            },
            {
                version: 'v2.0.0',
                date: '2024-01-15',
                author: 'AI Team',
                description: '重构核心引擎',
                environments: {
                    online: false,
                    pre: true,
                    test: true
                }
            },
            {
                version: 'v1.5.0',
                date: '2023-12-20',
                author: 'AI Team',
                description: '支持数据质量报告',
                environments: {
                    online: false,
                    pre: false,
                    test: true
                }
            }
        ]);

        const selectVersion = (version) => {
            currentVersion.value = version;
            showVersionDropdown.value = false;
        };

        const openPublishModal = (version) => {
            publishForm.value.version = version;
            publishForm.value.environment = 'test';
            publishForm.value.description = '';
            showPublishModal.value = true;
            showVersionDropdown.value = false;
        };

        const closePublishModal = () => {
            showPublishModal.value = false;
        };

        const confirmPublish = () => {
            const envMap = {
                'test': '测试',
                'pre': '预发',
                'online': '生产'
            };
            alert(`发布版本 ${publishForm.value.version} 到 ${envMap[publishForm.value.environment]} 环境\n备注: ${publishForm.value.description || '无'}`);

            // 更新环境标签（模拟）
            const ver = versions.value.find(v => v.version === publishForm.value.version);
            if (ver) {
                ver.environments[publishForm.value.environment] = true;
            }

            closePublishModal();
        };

        // 加载 Skill 数据
        onMounted(() => {
            console.log('DetailSkill mounted, node:', props.node);
            console.log('SkillData available:', window.App.SkillData);

            if (window.App.SkillData && window.App.SkillData.skills) {
                skillData.value = window.App.SkillData.skills[props.node.id];
                console.log('Loaded skill data:', skillData.value);

                // 默认选中 SKILL.md
                if (skillData.value && skillData.value.skillMd) {
                    selectedFile.value = {
                        name: 'SKILL.md',
                        type: 'file',
                        path: 'SKILL.md'
                    };
                    fileContent.value = skillData.value.skillMd;
                }
            } else {
                console.error('SkillData not found in window.App');
            }
        });

        const toggleFolder = (path) => {
            if (expandedFolders.value.has(path)) {
                expandedFolders.value.delete(path);
            } else {
                expandedFolders.value.add(path);
            }
            expandedFolders.value = new Set(expandedFolders.value);
        };

        const isFolderExpanded = (path) => {
            return expandedFolders.value.has(path);
        };

        const selectFile = (file, path) => {
            selectedFile.value = { ...file, path };

            // 加载文件内容
            if (file.name === 'SKILL.md') {
                fileContent.value = skillData.value.skillMd;
            } else if (file.name === 'requirements.txt') {
                fileContent.value = skillData.value.metadata.dependencies.join('\n');
            } else if (file.name === 'README.md') {
                fileContent.value = `# ${skillData.value.displayName}\n\n${skillData.value.description}\n\n## 版本\n${skillData.value.version}`;
            } else if (skillData.value.examples && file.name.includes('example')) {
                const example = skillData.value.examples[0];
                fileContent.value = example ? example.code : '// Example code';
            } else {
                fileContent.value = `# ${file.name}\n\n文件内容 (模拟)`;
            }
        };

        const getFileIcon = (file) => {
            if (file.type === 'directory') return 'ph-folder';
            const ext = file.name.split('.').pop();
            const iconMap = {
                'md': 'ph-file-text',
                'py': 'ph-file-py',
                'js': 'ph-file-js',
                'ts': 'ph-file-ts',
                'json': 'ph-brackets-curly',
                'yaml': 'ph-file-code',
                'yml': 'ph-file-code',
                'txt': 'ph-file-text',
            };
            return iconMap[ext] || 'ph-file';
        };

        const getFileColor = (file) => {
            if (file.type === 'directory') return 'text-yellow-500';
            const ext = file.name.split('.').pop();
            const colorMap = {
                'md': 'text-blue-500',
                'py': 'text-blue-600',
                'js': 'text-yellow-500',
                'ts': 'text-blue-600',
                'json': 'text-orange-500',
                'yaml': 'text-purple-500',
                'yml': 'text-purple-500',
            };
            return colorMap[ext] || 'text-slate-400';
        };

        const createNewFile = () => {
            const fileName = prompt('输入文件名:');
            if (fileName) {
                alert(`创建文件: ${fileName} (功能开发中)`);
            }
        };

        const createNewFolder = () => {
            const folderName = prompt('输入文件夹名:');
            if (folderName) {
                alert(`创建文件夹: ${folderName} (功能开发中)`);
            }
        };

        const saveFile = () => {
            alert('保存成功 (模拟)');
        };

        return {
            skillData,
            selectedFile,
            fileContent,
            expandedFolders,
            currentVersion,
            versions,
            showVersionDropdown,
            showPublishModal,
            publishForm,
            selectVersion,
            openPublishModal,
            closePublishModal,
            confirmPublish,
            toggleFolder,
            isFolderExpanded,
            selectFile,
            getFileIcon,
            getFileColor,
            createNewFile,
            createNewFolder,
            saveFile,
            
            // ==================== 标签管理 ====================
            resourceTags: ref(props.node.tags || ['AI研发', '核心算法']),
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
        <div class="h-full flex flex-col bg-slate-50">
            <div v-if="skillData" class="h-full flex flex-col">
                <!-- Main Content: Two Column Layout -->
                <div class="flex-1 flex overflow-hidden">
                <!-- Left Sidebar: File Tree -->
                <div class="w-72 bg-slate-800 text-slate-300 border-r border-slate-700 flex flex-col overflow-hidden">
                    <!-- Version Selector -->
                    <div class="px-3 py-3 border-b border-slate-700">
                        <div class="text-xs font-semibold uppercase text-slate-400 mb-2">版本</div>
                        <div class="flex gap-2">
                            <div class="relative flex-1">
                                <button 
                                    @click="showVersionDropdown = !showVersionDropdown"
                                    class="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm text-left flex items-center justify-between transition-colors">
                                    <span class="flex items-center gap-2">
                                        <i class="ph ph-git-branch"></i>
                                        {{ currentVersion }}
                                    </span>
                                    <i :class="['ph ph-caret-down transition-transform', showVersionDropdown ? 'rotate-180' : '']"></i>
                                </button>
                                
                                <!-- Version Dropdown -->
                                <div v-show="showVersionDropdown" 
                                    class="absolute top-full left-0 right-0 mt-1 bg-slate-700 rounded shadow-xl border border-slate-600 z-50 max-h-80 overflow-y-auto">
                                    <div v-for="ver in versions" :key="ver.version"
                                        @click="selectVersion(ver.version)"
                                        :class="[
                                            'px-3 py-2.5 border-b border-slate-600 last:border-b-0 cursor-pointer',
                                            ver.version === currentVersion ? 'bg-slate-600' : 'hover:bg-slate-650'
                                        ]">
                                        <div class="flex items-center gap-2 mb-1">
                                            <span class="text-sm font-semibold text-white">{{ ver.version }}</span>
                                            <!-- Only show published environment tags -->
                                            <span v-if="ver.environments.online" class="px-1.5 py-0.5 bg-green-600 text-white text-xs rounded">生产</span>
                                            <span v-if="ver.environments.pre" class="px-1.5 py-0.5 bg-yellow-600 text-white text-xs rounded">预发</span>
                                            <span v-if="ver.environments.test" class="px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded">测试</span>
                                        </div>
                                        <div class="text-xs text-slate-400">{{ ver.date }} · {{ ver.author }}</div>
                                        <div class="text-xs text-slate-300 mt-1">{{ ver.description }}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Publish Button -->
                            <button 
                                @click="openPublishModal(currentVersion)"
                                class="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm text-slate-300 hover:text-white transition-colors border border-slate-600 flex items-center gap-1.5">
                                <i class="ph ph-rocket-launch"></i>
                                发布
                            </button>
                        </div>
                    </div>

                    <!-- File Tree Header -->
                        <div class="px-3 py-2 border-b border-slate-700 flex items-center justify-between">
                            <div class="text-xs font-semibold uppercase text-slate-400">文件</div>
                            <div class="flex gap-1">
                                <button @click="createNewFile" class="p-1 hover:bg-slate-700 rounded transition-colors" title="新建文件">
                                    <i class="ph ph-file-plus text-sm"></i>
                                </button>
                                <button @click="createNewFolder" class="p-1 hover:bg-slate-700 rounded transition-colors" title="新建文件夹">
                                    <i class="ph ph-folder-plus text-sm"></i>
                                </button>
                            </div>
                        </div>

                        <!-- File Tree -->
                        <div class="flex-1 overflow-y-auto py-2">
                            <skill-file-tree-item
                                v-if="skillData.fileTree"
                                :node="skillData.fileTree"
                                :path="skillData.fileTree.name"
                                :selected-path="selectedFile?.path"
                                :expanded-folders="expandedFolders"
                                @select="selectFile"
                                @toggle="toggleFolder">
                            </skill-file-tree-item>
                        </div>

                        <!-- Skill Info Footer -->
                        <div class="px-3 py-3 border-t border-slate-700 bg-slate-900/50">
                            <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">资源标签</div>
                            <div class="flex flex-wrap gap-1.5 mb-3">
                                <div v-for="tag in resourceTags" :key="tag" 
                                    class="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-[10px] border border-slate-600">
                                    {{ tag }}
                                </div>
                                <div class="relative">
                                    <button v-if="!showAddTagInput" @click="showAddTagInput = true" 
                                        class="w-5 h-5 flex items-center justify-center rounded border border-dashed border-slate-600 text-slate-500 hover:text-white hover:border-slate-400 transition-all">
                                        <i class="ph ph-plus text-xs"></i>
                                    </button>
                                    <div v-else class="flex items-center gap-1 bg-slate-800 border border-slate-600 rounded px-1 py-0.5 shadow-xl absolute left-0 bottom-full mb-1 z-[100]">
                                        <input v-model="newTagName" @keyup.enter="addTag" list="global-skill-tags"
                                            class="w-20 text-[10px] bg-transparent text-white outline-none border-none" placeholder="新标签..." />
                                        <datalist id="global-skill-tags">
                                            <option v-for="tag in globalTags" :key="tag" :value="tag"></option>
                                        </datalist>
                                        <button @click="addTag" class="text-indigo-400"><i class="ph-bold ph-check text-[10px]"></i></button>
                                        <button @click="showAddTagInput = false" class="text-slate-500"><i class="ph ph-x text-[10px]"></i></button>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-1 text-xs">
                                <div class="flex items-center justify-between text-slate-400">
                                    <span>Runtime</span>
                                    <span class="text-slate-300">{{ skillData.metadata.runtime }}</span>
                                </div>
                                <div class="flex items-center justify-between text-slate-400">
                                    <span>沙箱模式</span>
                                    <span class="text-green-400">{{ skillData.metadata.sandboxMode }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Panel: Editor -->
                    <div class="flex-1 flex flex-col bg-white overflow-hidden">
                        <!-- Editor Tab Bar -->
                        <div v-if="selectedFile" class="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <i :class="['ph', getFileIcon(selectedFile), getFileColor(selectedFile)]"></i>
                                <span class="text-sm font-medium text-slate-700">{{ selectedFile.name }}</span>
                                <span class="text-xs text-slate-400">{{ selectedFile.path }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <button @click="saveFile" class="px-3 py-1 text-xs bg-indigo-600 text-white hover:bg-indigo-700 rounded flex items-center gap-1.5 transition-colors">
                                    <i class="ph ph-floppy-disk"></i>
                                    保存
                                </button>
                            </div>
                        </div>

                        <!-- Editor Content -->
                        <div class="flex-1 overflow-auto">
                            <div v-if="selectedFile" class="h-full">
                                <!-- For Markdown files, show rendered + edit -->
                                <div v-if="selectedFile.name.endsWith('.md')" class="grid grid-cols-2 gap-0 h-full">
                                    <!-- Left: Editor -->
                                    <div class="border-r border-slate-200 flex flex-col">
                                        <div class="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-600">
                                            编辑模式
                                        </div>
                                        <textarea 
                                            v-model="fileContent"
                                            class="flex-1 px-4 py-3 font-mono text-sm resize-none focus:outline-none"
                                            style="tab-size: 4;"
                                        ></textarea>
                                    </div>
                                    <!-- Right: Preview -->
                                    <div class="flex flex-col overflow-hidden">
                                        <div class="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-600">
                                            预览
                                        </div>
                                        <div class="flex-1 overflow-y-auto px-6 py-4 prose prose-slate max-w-none">
                                            <pre class="whitespace-pre-wrap text-sm leading-relaxed">{{ fileContent }}</pre>
                                        </div>
                                    </div>
                                </div>
                                <!-- For code files, show editor only -->
                                <div v-else class="h-full">
                                    <textarea 
                                        v-model="fileContent"
                                        class="w-full h-full px-4 py-3 font-mono text-sm resize-none focus:outline-none"
                                        style="tab-size: 4;"
                                    ></textarea>
                                </div>
                            </div>
                            <div v-else class="h-full flex items-center justify-center text-slate-400">
                                <div class="text-center">
                                    <i class="ph ph-file-dashed text-4xl mb-2 block"></i>
                                    <p class="text-sm">选择一个文件以查看内容</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="h-full flex items-center justify-center text-slate-400">
                <div class="text-center">
                    <i class="ph ph-warning-circle text-4xl mb-2 block"></i>
                    <p>加载 Skill 数据中...</p>
                    <p class="text-xs mt-2">Node ID: {{ node.id }}</p>
                    <p class="text-xs">请查看控制台日志</p>
                </div>
            </div>

            <!-- Publish Modal -->
            <div v-if="showPublishModal" @click="closePublishModal"
                class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
                <div @click.stop class="bg-white rounded-xl shadow-2xl w-full max-w-md">
                    <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                        <h3 class="text-lg font-bold text-slate-900">发布版本</h3>
                        <button @click="closePublishModal" class="text-slate-400 hover:text-slate-600">
                            <i class="ph ph-x text-xl"></i>
                        </button>
                    </div>

                    <div class="p-6 space-y-4">
                        <!-- Version -->
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">版本</label>
                            <input 
                                v-model="publishForm.version" 
                                readonly
                                class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 font-mono text-sm">
                        </div>

                        <!-- Environment -->
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">发布环境</label>
                            <div class="flex gap-2">
                                <button 
                                    @click="publishForm.environment = 'test'"
                                    :class="[
                                        'flex-1 px-4 py-2 rounded-lg border-2 transition-colors font-medium text-sm',
                                        publishForm.environment === 'test'
                                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                    ]">
                                    <i class="ph ph-flask mr-1.5"></i>
                                    测试
                                </button>
                                <button 
                                    @click="publishForm.environment = 'pre'"
                                    :class="[
                                        'flex-1 px-4 py-2 rounded-lg border-2 transition-colors font-medium text-sm',
                                        publishForm.environment === 'pre'
                                            ? 'border-yellow-600 bg-yellow-50 text-yellow-700'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                    ]">
                                    <i class="ph ph-git-branch mr-1.5"></i>
                                    预发
                                </button>
                                <button 
                                    @click="publishForm.environment = 'online'"
                                    :class="[
                                        'flex-1 px-4 py-2 rounded-lg border-2 transition-colors font-medium text-sm',
                                        publishForm.environment === 'online'
                                            ? 'border-green-600 bg-green-50 text-green-700'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                    ]">
                                    <i class="ph ph-rocket-launch mr-1.5"></i>
                                    生产
                                </button>
                            </div>
                        </div>

                        <!-- Description -->
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">备注（可选）</label>
                            <textarea 
                                v-model="publishForm.description"
                                rows="3"
                                placeholder="请输入发布备注..."
                                class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"></textarea>
                        </div>

                        <!-- Warning for online -->
                        <div v-if="publishForm.environment === 'online'" class="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div class="flex items-start gap-2 text-red-800 text-sm">
                                <i class="ph ph-warning-circle text-red-600 flex-shrink-0 mt-0.5"></i>
                                <span>注意：发布到生产环境将影响所有使用该 Skill 的 AI Agent，请谨慎操作。</span>
                            </div>
                        </div>
                    </div>

                    <div class="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
                        <button @click="closePublishModal"
                            class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            取消
                        </button>
                        <button @click="confirmPublish"
                            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                            <i class="ph ph-check"></i>
                            确认发布
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
};

// SkillFileTreeItem Component (递归组件用于文件树)
window.App.Components.SkillFileTreeItem = {
    name: 'SkillFileTreeItem',
    props: ['node', 'path', 'selectedPath', 'expandedFolders', 'level'],
    setup(props, { emit }) {
        const level = props.level || 0;

        const isExpanded = Vue.computed(() => {
            return props.expandedFolders.has(props.path);
        });

        const isSelected = Vue.computed(() => {
            return props.selectedPath === props.path;
        });

        const toggle = () => {
            if (props.node.type === 'directory') {
                emit('toggle', props.path);
            }
        };

        const select = () => {
            if (props.node.type === 'file') {
                emit('select', props.node, props.path);
            } else {
                toggle();
            }
        };

        const getIcon = () => {
            if (props.node.type === 'directory') {
                return isExpanded.value ? 'ph-folder-open' : 'ph-folder';
            }
            const ext = props.node.name.split('.').pop();
            const iconMap = {
                'md': 'ph-file-text',
                'py': 'ph-file-py',
                'js': 'ph-file-js',
                'ts': 'ph-file-ts',
                'json': 'ph-brackets-curly',
                'yaml': 'ph-file-code',
                'yml': 'ph-file-code',
            };
            return iconMap[ext] || 'ph-file';
        };

        const getColor = () => {
            if (props.node.type === 'directory') return 'text-yellow-500';
            const ext = props.node.name.split('.').pop();
            const colorMap = {
                'md': 'text-blue-400',
                'py': 'text-blue-400',
                'js': 'text-yellow-400',
                'ts': 'text-blue-400',
                'json': 'text-orange-400',
                'yaml': 'text-purple-400',
            };
            return colorMap[ext] || 'text-slate-400';
        };

        return { level, isExpanded, isSelected, toggle, select, getIcon, getColor };
    },
    template: `
        <div>
            <div
                @click="select"
                :class="[
                    'flex items-center gap-2 px-3 py-1 cursor-pointer transition-colors text-sm',
                    isSelected ? 'bg-slate-700 text-white' : 'hover:bg-slate-700/50'
                ]"
                :style="{ paddingLeft: (level * 16 + 12) + 'px' }">
                <i v-if="node.type === 'directory'"
                    :class="['ph ph-caret-right text-xs transition-transform', isExpanded ? 'rotate-90' : '']"></i>
                <i :class="['ph text-base', getIcon(), getColor()]"></i>
                <span class="flex-1 truncate">{{ node.name }}</span>
                <span v-if="node.size" class="text-xs text-slate-500">{{ node.size }}</span>
            </div>
            <div v-if="node.type === 'directory' && isExpanded && node.children">
                <skill-file-tree-item
                    v-for="(child, index) in node.children"
                    :key="index"
                    :node="child"
                    :path="path + '/' + child.name"
                    :selected-path="selectedPath"
                    :expanded-folders="expandedFolders"
                    :level="level + 1"
                    @select="$emit('select', $event, $event.path)"
                    @toggle="$emit('toggle', $event)">
                </skill-file-tree-item>
            </div>
        </div>
    `
};
