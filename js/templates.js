// Template strings for components
window.AppTemplates = {
    TreeItem: `
            <div class="select-none">
                <div 
                    @click="handleClick"
                    :class="['flex items-center gap-2 px-3 py-1.5 my-0.5 rounded-md cursor-pointer transition-colors text-sm group',
                        isSelected 
                        ? 'bg-indigo-100 text-indigo-700 font-medium border border-indigo-200' 
                        : 'text-slate-600 hover:bg-slate-100']"
                    :style="{ paddingLeft: (depth * 12 + 12) + 'px' }"
                >
                    <span 
                        v-if="node.type === 'CATALOG'" 
                        @click.stop="toggle"
                        class="w-4 h-4 flex items-center justify-center rounded hover:bg-slate-200"
                    >
                        <i :class="['ph ph-caret-right transition-transform text-xs', isOpen ? 'rotate-90' : '']"></i>
                    </span>
                    <span v-else class="w-4"></span>
                    <i :class="['ph text-lg', nodeIcon, isSelected ? 'text-indigo-700' : iconColor]"></i>
                    <span class="truncate flex-1">{{ node.name }}</span>
                    
                    <!-- 重命名按钮（仅目录且非根目录） -->
                    <button 
                        v-if="node.type === 'CATALOG' && node.id !== 'root_all'"
                        @click.stop="$emit('rename', node)"
                        :class="['opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity hover:bg-slate-200',
                                 isSelected ? 'text-indigo-700' : 'text-slate-400 hover:text-slate-600']"
                        title="重命名"
                    >
                        <i class="ph ph-pencil-simple text-sm"></i>
                    </button>
                </div>
                <div v-if="isOpen && node.children && node.children.length > 0">
                    <tree-item 
                        v-for="child in node.children" 
                        :key="child.id" 
                        :node="child"
                        :depth="depth + 1"
                        :selected-id="selectedId"
                        @select="$emit('select', $event)"
                        @toggle="$emit('toggle', $event)"
                        @rename="$emit('rename', $event)"
                    ></tree-item>
                </div>
            </div>
    `,
    DetailWiki: `
            <div class="h-full flex flex-col">
                <div class="h-10 border-b border-slate-200 bg-slate-50 flex items-center px-4 gap-4 text-xs text-slate-500 mb-4 flex-shrink-0">
                    <button class="hover:text-slate-800 flex items-center gap-1"><i class="ph ph-list"></i> Outline</button>
                    <div class="w-px h-4 bg-slate-300"></div>
                    <button class="hover:text-slate-800"><i class="ph ph-text-b"></i></button>
                    <button class="hover:text-slate-800"><i class="ph ph-text-i"></i></button>
                    <button class="hover:text-slate-800"><i class="ph ph-list-bullets"></i></button>
                    <div class="flex-1"></div>
                    <span>Last edited today 10:23 AM</span>
                </div>
                <div class="flex-1 overflow-y-auto px-8 py-4 w-full bg-white">
                    <div class="max-w-3xl mx-auto">
                        <h1 class="text-3xl font-bold text-slate-900 mb-6">{{ node.name }}</h1>
                        <div class="prose prose-slate max-w-none">
                            <p class="text-lg text-slate-600 mb-4">This is a simulated Wiki content area.</p>
                        </div>
                    </div>
                </div>
            </div>
    `,
    FieldEditModal: `
            <div v-if="visible && editingForm" class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" @click.self="$emit('close')">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] flex flex-col">
                    <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                        <h3 class="text-base font-semibold text-slate-900">编辑字段 · {{ schemaFields[editingFieldIndex]?.name }}</h3>
                        <button @click="$emit('close')" class="p-1 text-slate-400 hover:text-slate-600"><i class="ph ph-x text-lg"></i></button>
                    </div>
                    <div class="p-5 overflow-y-auto flex-1 space-y-4" @click.self="$emit('update:showTagTreeDropdown', false)">
                        <div>
                            <label class="block text-xs font-medium text-slate-500 mb-1">字段名</label>
                            <input :value="schemaFields[editingFieldIndex]?.name" readonly class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500" />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-500 mb-1">类型</label>
                            <input :value="schemaFields[editingFieldIndex]?.type" readonly class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500" />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-500 mb-1">描述</label>
                            <input v-model="editingForm.description" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="字段说明" />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-500 mb-1">统计信息</label>
                            <textarea :value="schemaFields[editingFieldIndex]?.fieldStatistics || '—'" readonly class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 font-mono whitespace-pre-wrap min-h-[100px]" rows="4"></textarea>
                            <p class="mt-1 text-xs text-slate-400">统计信息为自动生成，无法编辑</p>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-500 mb-2">治理标签</label>
                            <div class="relative" @click.stop>
                                <button @click.stop="$emit('update:showTagTreeDropdown', !showTagTreeDropdown)" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-left bg-white hover:border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent flex items-center justify-between group">
                                    <span class="text-slate-700">{{ editingForm.governed_tag ? getTagShortName(editingForm.governed_tag) : '— 无 —' }}</span>
                                    <i :class="['ph ph-caret-down text-xs text-slate-400 transition-transform', showTagTreeDropdown ? 'rotate-180' : '']"></i>
                                    <div v-if="editingForm.governed_tag" class="absolute left-0 top-full mt-1 z-[100] hidden group-hover:block min-w-max p-2 bg-slate-800 text-slate-100 rounded-lg shadow-xl text-xs pointer-events-none">
                                        <p class="font-mono">{{ editingForm.governed_tag }}</p>
                                    </div>
                                </button>
                                <div v-if="showTagTreeDropdown" @click.stop class="absolute left-0 right-0 top-full mt-1 z-50 max-h-80 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden flex flex-col">
                                    <div class="p-2 flex-1 overflow-y-auto space-y-0.5">
                                        <div @click.stop="$emit('selectTagFromTree', null)" :class="['px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-indigo-50 flex items-center gap-2', !editingForm.governed_tag ? 'bg-indigo-100 text-indigo-700' : 'text-slate-700']">
                                            <i class="ph ph-check text-xs" v-if="!editingForm.governed_tag"></i>
                                            <span class="w-4" v-else></span>
                                            <span>— 无 —</span>
                                        </div>
                                        <template v-for="node in governedTagTree" :key="node.name">
                                            <div :style="{ paddingLeft: '8px' }" @click.stop="(node.children && node.children.length > 0) ? $emit('toggleTagTreeNode', node.fullPath) : $emit('selectTagFromTree', node.fullPath)" :class="['px-2 py-1.5 text-sm rounded cursor-pointer flex items-center gap-2', editingForm.governed_tag === node.fullPath ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-indigo-50 text-slate-700']">
                                                <i v-if="node.children && node.children.length > 0" :class="['ph ph-caret-right text-xs transition-transform flex-shrink-0', tagTreeExpanded[node.fullPath] ? 'rotate-90' : '']"></i>
                                                <span v-else class="w-3"></span>
                                                <i class="ph ph-check text-xs flex-shrink-0" v-if="editingForm.governed_tag === node.fullPath && (!node.children || !node.children.length)"></i>
                                                <span v-else-if="!node.children || !node.children.length" class="w-3"></span>
                                                <span class="flex-1">{{ node.name }}</span>
                                                <i v-if="node.linkedDict" class="ph ph-link text-xs text-cyan-500 flex-shrink-0" :title="'关联字典: ' + node.linkedDict"></i>
                                            </div>
                                            <template v-if="node.children && node.children.length > 0 && tagTreeExpanded[node.fullPath]">
                                                <div v-for="child in node.children" :key="child.fullPath" :style="{ paddingLeft: '32px' }" @click.stop="$emit('selectTagFromTree', child.fullPath)" :class="['px-2 py-1.5 text-sm rounded cursor-pointer flex items-center gap-2', editingForm.governed_tag === child.fullPath ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-indigo-50 text-slate-700']">
                                                    <i class="ph ph-check text-xs flex-shrink-0" v-if="editingForm.governed_tag === child.fullPath"></i>
                                                    <span v-else class="w-3"></span>
                                                    <span class="flex-1">{{ child.name }}</span>
                                                    <i v-if="child.linkedDict" class="ph ph-link text-xs text-cyan-500 flex-shrink-0" :title="'关联字典: ' + child.linkedDict"></i>
                                                </div>
                                            </template>
                                        </template>
                                    </div>
                                </div>
                            </div>
                            <div v-if="editingForm.governed_tag && hasLinkedDict(editingForm.governed_tag)" class="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
                                <i class="ph ph-link text-xs text-cyan-600"></i>
                                <span>标签关联字典：</span>
                                <button @click="$emit('navigateToDict', getLinkedDict(editingForm.governed_tag))" class="text-cyan-600 hover:text-cyan-700 underline font-medium">
                                    {{ getLinkedDict(editingForm.governed_tag) }}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-medium text-slate-500 mb-2">关联字典</label>
                            <div class="relative">
                                <button @click.stop="showDictDropdown = !showDictDropdown" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-left bg-white hover:border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent flex items-center justify-between group transition-all">
                                    <span :class="editingForm.linked_dict ? 'text-cyan-700 font-medium' : 'text-slate-400'">
                                        {{ editingForm.linked_dict || '搜索选择字典进行关联...' }}
                                    </span>
                                    <div class="flex items-center gap-2">
                                        <i v-if="editingForm.linked_dict" @click.stop="selectDict(null)" class="ph ph-x-circle text-slate-300 hover:text-slate-500 transition-colors"></i>
                                        <i :class="['ph ph-magnifying-glass text-xs text-slate-400 transition-transform', showDictDropdown ? 'rotate-90' : '']"></i>
                                    </div>
                                </button>
                                
                                <div v-if="showDictDropdown" @click.stop class="absolute left-0 right-0 top-full mt-1 z-50 max-h-68 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div class="p-2 border-b border-slate-100 bg-slate-50/50">
                                        <input v-model="dictSearchQuery" ref="dictSearchInput" type="text" 
                                            class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" 
                                            placeholder="输入字典名称或描述搜索..." @click.stop />
                                    </div>
                                    <div class="p-1 overflow-y-auto max-h-48">
                                        <div v-if="filteredDictionaries.length === 0" class="px-4 py-8 text-center text-slate-400">
                                            <i class="ph ph-magnifying-glass text-2xl mb-2 opacity-20"></i>
                                            <p class="text-xs">未找到匹配的字典</p>
                                        </div>
                                        <button v-for="dict in filteredDictionaries" :key="dict.id" 
                                            @click="selectDict(dict)"
                                            class="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors group flex flex-col gap-0.5"
                                            :class="editingForm.linked_dict === dict.name ? 'bg-indigo-50' : ''">
                                            <div class="flex items-center justify-between">
                                                <span class="text-sm font-medium text-slate-700 group-hover:text-indigo-700 transition-colors">{{ dict.name }}</span>
                                                <i v-if="editingForm.linked_dict === dict.name" class="ph-fill ph-check-circle text-indigo-600"></i>
                                            </div>
                                            <span class="text-[10px] text-slate-400 truncate">{{ dict.description || '无描述' }}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" v-model="editingForm.is_encrypted" @change="$emit('update-encryption-init')" class="rounded border-slate-300 text-rose-600 focus:ring-rose-500" />
                                <span class="text-sm font-medium text-slate-700">加密存储</span>
                            </label>
                            
                            <!-- Inline Encryption Config for Field Detail Edit -->
                            <div v-if="editingForm.is_encrypted" class="mt-3 ml-6 space-y-4 p-4 bg-rose-50/30 border border-rose-100 rounded-xl relative overflow-hidden transition-all animate-in fade-in slide-in-from-top-2 duration-300">
                                <div class="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full -mr-12 -mt-12"></div>
                                <div class="text-[11px] font-bold text-rose-600 flex items-center gap-2 mb-2">
                                    <div class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                                    加密参数配置
                                </div>
                                <div class="grid grid-cols-1 gap-4">
                                    <div v-for="(config, cIdx) in editingForm.encryptionConfigs" :key="cIdx" 
                                         class="bg-white border border-rose-100 rounded-xl p-4 shadow-sm relative z-10 transition-all hover:border-rose-200">
                                        <div class="flex items-center justify-between mb-4 pb-2 border-b border-rose-50">
                                            <div class="flex items-center gap-2">
                                                <span class="text-xs font-bold text-slate-700">{{ config.env }}</span>
                                                <span v-if="config.isProduction" class="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] rounded font-bold border border-amber-100 uppercase tracking-tighter">PRD</span>
                                            </div>
                                            <div v-if="config.isSandbox" class="flex items-center gap-3">
                                                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Center 环境</span>
                                                <select v-model="config.keyCenterEnv" class="text-[11px] px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-200 transition-all cursor-pointer hover:bg-white">
                                                    <option value="Online">Online</option>
                                                    <option value="Staging">Staging</option>
                                                    <option value="Test">Test</option>
                                                </select>
                                            </div>
                                            <div v-else class="flex items-center gap-3">
                                                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Center 环境</span>
                                                <span class="text-[11px] font-bold text-slate-400 pl-2">Online</span>
                                            </div>
                                        </div>
                                        
                                        <div class="space-y-1.5">
                                            <div class="flex items-center justify-between">
                                                <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Key Center App Key</label>
                                            </div>
                                            <textarea v-model="config.appKey" rows="2" 
                                                class="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-mono focus:ring-2 focus:ring-rose-200 focus:bg-white outline-none transition-all resize-none placeholder:text-slate-300"
                                                placeholder="请输入 App Key..."></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" v-model="editingForm.is_partition" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                <span class="text-sm font-medium text-slate-700">分区字段</span>
                            </label>
                            <div v-if="editingForm.is_partition" class="mt-3 ml-6 space-y-3 p-3 bg-violet-50/50 border border-violet-100 rounded-lg">
                                <div>
                                    <label class="block text-xs font-medium text-slate-500 mb-1">分区数据格式</label>
                                    <input v-model="editingForm.partition_format" class="w-full px-3 py-1.5 border border-slate-200 rounded text-sm" placeholder="如 yyyyMMdd" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-slate-500 mb-1">全量 / 增量</label>
                                    <select v-model="editingForm.partition_mode" class="w-full px-3 py-1.5 border border-slate-200 rounded text-sm">
                                        <option value="full">全量镜像</option>
                                        <option value="incremental">增量</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="px-5 py-4 border-t border-slate-200 flex justify-end gap-2 flex-shrink-0">
                        <button @click="$emit('close')" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">取消</button>
                        <button @click="$emit('save')" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">保存</button>
                    </div>
                </div>
            </div>
    `,
    PermissionRuleEditModal: `
            <div v-if="visible" class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" @click.self="$emit('close')">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
                    <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                        <h3 class="text-base font-semibold text-slate-900">
                            {{ editingIndex === -1 ? '添加权限规则' : '编辑权限规则 · ' + authRules[editingIndex]?.name }}
                        </h3>
                        <button @click="$emit('close')" class="p-1 text-slate-400 hover:text-slate-600"><i class="ph ph-x text-lg"></i></button>
                    </div>
                    <div class="p-5 overflow-y-auto flex-1 space-y-5">
                        <!-- 规则名称 -->
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">规则名称</label>
                            <input v-model="editingRule.name" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="例如：部门数据隔离" />
                        </div>


                        <!-- ═══════════════════════════════════════════ -->
                        <!-- 列权限 (Column Permissions) -->
                        <!-- ═══════════════════════════════════════════ -->
                        <div v-if="!isGlobal" class="space-y-4">
                            <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
                                <div class="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <i class="ph ph-columns text-blue-600 text-sm"></i>
                                </div>
                                <h4 class="text-sm font-bold text-slate-800">列权限</h4>
                                <span class="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">字段可见范围</span>
                            </div>

                            <!-- 字段范围 -->
                            <div>
                                <label class="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">字段范围</label>
                                <div class="space-y-3">
                                    <div class="grid grid-cols-3 gap-3">
                                        <button @click="editingRule.columnVisibility.mode = 'all'" 
                                            :class="['px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2', editingRule.columnVisibility.mode === 'all' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 hover:border-green-300 text-slate-700']">
                                            <i class="ph ph-check-circle"></i> 全部字段
                                        </button>
                                        <button @click="editingRule.columnVisibility.mode = 'include'" 
                                            :class="['px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2', editingRule.columnVisibility.mode === 'include' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-blue-300 text-slate-700']">
                                            <i class="ph ph-eye"></i> 授权字段
                                        </button>
                                        <button @click="editingRule.columnVisibility.mode = 'exclude'" 
                                            :class="['px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2', editingRule.columnVisibility.mode === 'exclude' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 hover:border-red-300 text-slate-700']">
                                            <i class="ph ph-eye-slash"></i> 排除字段
                                        </button>
                                    </div>
                                    <!-- 字段列表 -->
                                    <div class="border border-slate-200 rounded-lg overflow-hidden bg-white">
                                        <div class="max-h-48 overflow-y-auto">
                                            <table class="min-w-full divide-y divide-slate-200">
                                                <thead class="bg-slate-50 sticky top-0 z-10 transition-colors">
                                                    <tr class="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                                                        <th class="w-12 px-4 py-2 text-center">
                                                            {{ editingRule.columnVisibility.mode === 'all' ? '' : '选择' }}
                                                        </th>
                                                        <th class="px-4 py-2 text-left">字段名</th>
                                                        <th class="px-4 py-2 text-left">描述</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="divide-y divide-slate-200">
                                                    <tr v-for="field in schemaFields" :key="field.name" 
                                                        class="hover:bg-slate-50 transition-colors"
                                                        :class="{'bg-indigo-50/40': (editingRule.columnVisibility.mode === 'all') || (editingRule.columnVisibility.fields.includes(field.name))}">
                                                        <td class="px-4 py-2.5 text-center">
                                                            <template v-if="editingRule.columnVisibility.mode === 'all'">
                                                                <i class="ph-fill ph-check-circle text-green-500 text-base"></i>
                                                            </template>
                                                            <input v-else type="checkbox" 
                                                                :checked="editingRule.columnVisibility.fields.includes(field.name)"
                                                                @change="$emit('toggleColumnField', field.name)"
                                                                class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4">
                                                        </td>
                                                        <td class="px-4 py-2.5 w-40">
                                                            <span class="text-xs font-mono font-medium text-slate-900">{{ field.name }}</span>
                                                        </td>
                                                        <td class="px-4 py-2.5">
                                                            <span class="text-xs text-slate-500 truncate block max-w-xs">{{ field.description }}</span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div v-if="editingRule.columnVisibility.mode !== 'all'" class="px-4 py-2 bg-slate-50 border-t border-slate-200">
                                            <p class="text-[11px] text-slate-500">
                                                当前已选择 <span class="text-indigo-600 font-bold">{{ editingRule.columnVisibility.fields.length }}</span> 个字段
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- ═══════════════════════════════════════════ -->
                        <!-- 行权限 (Row Permissions) -->
                        <!-- ═══════════════════════════════════════════ -->
                        <div class="space-y-4">
                            <div v-if="!isGlobal" class="flex items-center gap-2 pb-2 border-b border-slate-100">
                                <div class="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                                    <i class="ph ph-rows text-amber-600 text-sm"></i>
                                </div>
                                <h4 class="text-sm font-bold text-slate-800">行权限</h4>
                                <span class="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">行级别过滤条件</span>
                            </div>

                            <!-- 规则来源（仅非全局模式显示） -->
                            <div v-if="!isGlobal">
                                <label class="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">规则来源</label>
                                <div class="flex gap-3">
                                    <button @click="editingRule.ruleSource = 'custom'" 
                                        :class="['flex-1 px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2', editingRule.ruleSource === 'custom' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-300 text-slate-700']">
                                        <i class="ph ph-file-text"></i>
                                        <span>表专属规则</span>
                                    </button>
                                    <button @click="editingRule.ruleSource = 'global_reference'" 
                                        :class="['flex-1 px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2', editingRule.ruleSource === 'global_reference' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-300 text-slate-700']">
                                        <i class="ph ph-link"></i>
                                        <span>引用数据访问规则</span>
                                    </button>
                                </div>
                            </div>

                            <!-- ────────────────────────────────────── -->
                            <!-- 表专属规则：条件配置 -->
                            <!-- ────────────────────────────────────── -->
                            <div v-if="isGlobal || editingRule.ruleSource === 'custom'">
                                <div class="flex items-center justify-between mb-2">
                                    <label class="block text-xs font-medium text-slate-500 uppercase tracking-wider">{{ isGlobal ? '标签配置' : '条件配置' }}</label>
                                    <button @click="$emit('addRowFilter')" class="px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 rounded flex items-center gap-1">
                                        <i class="ph ph-plus"></i> 添加条件
                                    </button>
                                </div>
                                <div class="space-y-2">
                                    <div v-for="(filter, index) in editingRule.rowFilters" :key="index" class="flex items-start gap-2">
                                        <div class="w-6 h-9 flex items-center justify-center text-xs font-medium text-slate-500 flex-shrink-0">
                                            {{ index + 1 }}
                                        </div>
                                        <div class="flex-1 grid grid-cols-12 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                            <select v-model="filter.field" class="col-span-3 px-2 py-1.5 border border-slate-300 rounded text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                                <template v-if="isGlobal">
                                                    <option value="">选择标签</option>
                                                    <option v-for="tag in availableTags" :key="tag" :value="tag">{{ tag }}</option>
                                                </template>
                                                <template v-else>
                                                    <option value="">选择字段</option>
                                                    <option value="user_id">user_id</option>
                                                    <option value="department_id">department_id</option>
                                                    <option value="status">status</option>
                                                    <option value="created_at">created_at</option>
                                                </template>
                                            </select>
                                            <select v-model="filter.operator" class="col-span-2 px-2 py-1.5 border border-slate-300 rounded text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                                <option value="=">=</option>
                                                <option value="!=">!=</option>
                                                <option value=">">&gt;</option>
                                                <option value="<">&lt;</option>
                                                <option value=">=">&gt;=</option>
                                                <option value="<=">&lt;=</option>
                                                <option value="IN">IN</option>
                                                <option value="NOT IN">NOT IN</option>
                                            </select>
                                            <select v-model="filter.valueType" class="col-span-2 px-2 py-1.5 border border-slate-300 rounded text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                                <option value="literal">字面值</option>
                                                <option value="env_var">环境变量</option>
                                            </select>
                                            <select v-if="filter.valueType === 'env_var'" v-model="filter.value" class="col-span-5 px-2 py-1.5 border border-slate-300 rounded text-sm font-mono bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                                <option value="">选择环境变量</option>
                                                <option value="visiting_user.user_id">visiting_user.user_id</option>
                                                <option value="visiting_user.role">visiting_user.role</option>
                                                <option value="visiting_user.as_hrbp.department_ids">visiting_user.as_hrbp.department_ids</option>
                                                <option value="visiting_user.as_teamleader.department_ids">visiting_user.as_teamleader.department_ids</option>
                                            </select>
                                            <input v-else v-model="filter.value" type="text" class="col-span-5 px-2 py-1.5 border border-slate-300 rounded text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="输入值" />
                                        </div>
                                        <button @click="$emit('removeRowFilter', index)" class="w-9 h-9 flex items-center justify-center text-red-600 hover:bg-red-50 rounded flex-shrink-0">
                                            <i class="ph ph-trash text-base"></i>
                                        </button>
                                    </div>
                                </div>
                                <p v-if="editingRule.rowFilters.length === 0" class="mt-2 text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                    {{ isGlobal ? '无标签配置条件' : '无行过滤条件（查看所有满足字段范围的行）' }}
                                </p>
                                <div v-else class="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <label class="block text-xs font-medium text-slate-700 mb-2">条件间的组合关系</label>
                                    <input v-model="editingRule.conditionLogic" 
                                        type="text" 
                                        class="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                                        placeholder="例如：1 AND 2 OR 3" />
                                    <p class="mt-2 text-xs text-slate-500">
                                        <i class="ph ph-info text-blue-500"></i> 
                                        使用条件序号（{{ editingRule.rowFilters.map((f, i) => i + 1).join(', ') }}）和逻辑运算符（AND、OR）来组合条件，支持括号。留空则默认为全部 AND 组合。
                                    </p>
                                </div>
                            </div>

                            <!-- ────────────────────────────────────── -->
                            <!-- 引用数据访问规则 -->
                            <!-- ────────────────────────────────────── -->
                            <template v-if="!isGlobal && editingRule.ruleSource === 'global_reference'">
                                <!-- 全局规则选择 -->
                                <div>
                                    <label class="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">选择数据访问规则</label>
                                    <div class="relative">
                                        <button @click="showGlobalDropdown = !showGlobalDropdown" type="button"
                                            class="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white hover:border-indigo-300 transition-all flex items-center justify-between shadow-sm">
                                            <span :class="editingRule.globalRuleRef ? 'text-slate-900 font-medium' : 'text-slate-400'">
                                                {{ editingRule.globalRuleRef || '选择数据访问规则' }}
                                            </span>
                                            <i class="ph ph-caret-down text-slate-400 transition-transform" :class="{'rotate-180': showGlobalDropdown}"></i>
                                        </button>
                                        
                                        <!-- 下拉列表 -->
                                        <div v-if="showGlobalDropdown" 
                                            class="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                                            <div v-if="globalRules.length === 0" class="p-8 text-center bg-slate-50/50">
                                                <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <i class="ph ph-shield-warning text-slate-400 text-2xl"></i>
                                                </div>
                                                <p class="text-sm text-slate-600 font-medium mb-1">暂无可引用的数据访问规则</p>
                                                <p class="text-xs text-slate-400">请先在"文件夹详情页 - 权限规则"中创建</p>
                                            </div>
                                            <div v-else class="max-h-60 overflow-y-auto p-1.5">
                                                <div v-for="rule in globalRules" :key="rule.name" 
                                                    @click="selectGlobalRule(rule)"
                                                    class="p-3 hover:bg-slate-50 rounded-md cursor-pointer transition-colors group">
                                                    <div class="flex items-center justify-between mb-1">
                                                        <span class="text-sm font-semibold text-slate-900 group-hover:text-indigo-600">{{ rule.name }}</span>
                                                        <i v-if="editingRule.globalRuleRef === rule.name" class="ph-fill ph-check-circle text-indigo-600"></i>
                                                    </div>
                                                    <p class="text-xs text-slate-500 line-clamp-1">{{ rule.description }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 全局规则详情 & 映射配置 -->
                                <div v-if="editingRule.globalRuleRef" class="space-y-5 pt-3 border-t border-slate-100">
                                     <!-- 1. 全局规则条件展示 (Read Only) -->
                                     <div>
                                        <h4 class="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wider">规则条件 <span class="text-[10px] font-normal text-slate-400 normal-case ml-1">(继承自数据访问规则，不可编辑)</span></h4>
                                        <div class="space-y-2">
                                             <div v-for="(filter, idx) in globalRules.find(r => r.name === editingRule.globalRuleRef)?.rowFilters || []" :key="idx" class="flex items-center gap-2">
                                                <div class="w-6 h-9 flex items-center justify-center text-xs font-medium text-slate-400 flex-shrink-0 border-r border-transparent">{{ idx + 1 }}</div>
                                                <div class="flex-1 grid grid-cols-12 gap-2 p-1.5 bg-slate-50/50 rounded-lg border border-slate-200 opacity-80 pointer-events-none">
                                                    <!-- Field/Tag: 3 cols -->
                                                    <div class="col-span-3 px-3 py-2 bg-slate-100 border border-slate-200 rounded text-sm text-slate-800 flex items-center truncate">
                                                        {{ filter.field }}
                                                    </div>
                                                    <!-- Operator: 2 cols -->
                                                    <div class="col-span-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded text-sm text-slate-800 flex items-center justify-center font-mono">
                                                        {{ filter.operator }}
                                                    </div>
                                                    <!-- Value Type: 2 cols -->
                                                     <div class="col-span-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded text-sm text-slate-800 flex items-center justify-center">
                                                        {{ filter.valueType === 'env_var' ? '环境变量' : '字面值' }}
                                                    </div>
                                                    <!-- Value: 5 cols -->
                                                     <div class="col-span-5 px-3 py-2 bg-slate-100 border border-slate-200 rounded text-sm text-slate-800 font-mono truncate">
                                                        {{ filter.value || 'NULL' }}
                                                    </div>
                                                </div>
                                             </div>
                                             <div v-if="!globalRules.find(r => r.name === editingRule.globalRuleRef)?.rowFilters?.length" class="text-sm text-slate-400 italic bg-slate-50 px-4 py-2 rounded">无行过滤条件</div>
                                        </div>
                                     </div>

                                     <!-- 2. 标签映射配置 -->
                                     <div v-if="editingRule.tagFieldMappings && Object.keys(editingRule.tagFieldMappings).length > 0">
                                         <div class="flex items-center justify-between mb-3">
                                            <h4 class="text-xs font-medium text-slate-500 uppercase tracking-wider">标签映射配置</h4>
                                            <span class="text-xs text-slate-400">将规则标签映射到当前表字段</span>
                                         </div>
                                         
                                         <div class="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                             <div v-for="(fieldValue, tagName) in editingRule.tagFieldMappings" :key="tagName" class="flex items-center gap-3">
                                                  <!-- Left: Tag (Readonly) -->
                                                  <div class="flex-1">
                                                      <div class="flex items-center gap-2 mb-1.5">
                                                          <i class="ph ph-tag text-amber-500 text-xs"></i>
                                                          <span class="text-xs font-medium text-slate-500">规则标签</span>
                                                      </div>
                                                      <div class="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 flex items-center gap-2 select-none cursor-not-allowed">
                                                          {{ tagName }}
                                                      </div>
                                                  </div>
                                                  
                                                  <!-- Arrow Icon -->
                                                  <div class="flex-shrink-0 pt-6 text-slate-300">
                                                      <i class="ph ph-arrow-right text-lg"></i>
                                                  </div>

                                                  <!-- Right: Field Selection -->
                                                  <div class="flex-1">
                                                      <div class="flex items-center justify-between gap-2 mb-1.5">
                                                          <span class="text-xs font-medium text-slate-500">映射到表字段</span>
                                                          <span v-if="fieldValue" class="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100 flex items-center gap-1"><i class="ph ph-check-circle"></i> 已绑定</span>
                                                          <span v-else class="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 flex items-center gap-1"><i class="ph ph-warning-circle"></i> 未绑定</span>
                                                      </div>
                                                      <div class="relative">
                                                          <select v-model="editingRule.tagFieldMappings[tagName]" 
                                                              class="w-full px-3 py-2.5 border rounded-lg text-sm appearance-none bg-white transition-shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 pl-3 pr-8"
                                                              :class="fieldValue ? 'border-slate-200 text-slate-900' : 'border-amber-300 text-slate-900'">
                                                              <option value="">-- 请选择映射字段 --</option>
                                                              <option v-for="f in schemaFields" :key="f.name" :value="f.name">{{ f.name }} {{ f.description ? '(' + f.description + ')' : '' }}</option>
                                                          </select>
                                                          <i class="ph ph-caret-down absolute right-3 top-1/2 -translate-y-1/2 mt-3 text-slate-400 pointer-events-none"></i>
                                                      </div>
                                                  </div>
                                             </div>
                                         </div>
                                     </div>
                                     <div v-else class="text-sm text-slate-400 italic text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                         此数据访问规则无需要映射的标签
                                     </div>
                                </div>
                            </template>
                        </div>


                    </div>
                    <div class="px-5 py-4 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
                        <div>
                            <button v-if="editingIndex !== -1" @click="$emit('delete')"
                                class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm transition-colors flex items-center gap-1.5 font-medium">
                                <i class="ph ph-trash"></i>
                                删除规则
                            </button>
                        </div>
                        <div class="flex items-center gap-2">
                            <button @click="$emit('close')"
                                class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">取消</button>
                            <button @click="$emit('save')"
                                class="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-100 transition-all">
                                {{ editingIndex === -1 ? '保存' : '完成修改' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    `,
    DetailData: `
            <div class="h-full flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden relative">
                <!-- Header Info & Actions -->
                <div class="px-6 py-5 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
                    <!-- Left: Table Information -->
                    <div>
                        <div class="flex items-center gap-2 group mb-1">
                            <h2 class="text-xl font-bold text-slate-900 font-mono tracking-tight">{{ node?.name }}</h2>
                            <button @click.stop="copyToClipboard(node?.name)"
                                class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                title="复制表名">
                                <i class="ph ph-copy text-lg"></i>
                            </button>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-slate-500">
                            <span>{{ node?.chineseName || '未设置中文名' }}</span>
                            <span v-if="node?.sourceType === 'VIEW'" class="text-slate-300">|</span>
                            <span v-if="node?.sourceType === 'VIEW'" class="text-slate-400">SQL 视图</span>
                            <span class="text-slate-300">|</span>
                            <span>ID: {{ node?.id }}</span>
                        </div>
                        <!-- Resource Tags Section -->
                        <div class="flex items-center gap-1.5 mt-2">
                            <div v-for="tag in (node.tags || ['基础数据', '结构化'])" :key="tag" 
                                class="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-medium border border-indigo-100 flex items-center gap-1">
                                <i class="ph ph-tag text-[8px]"></i>
                                {{ tag }}
                            </div>
                            <div class="relative ml-1">
                                <button v-if="!showResourceTagInput" @click="showResourceTagInput = true" 
                                    class="h-5 px-1.5 flex items-center justify-center gap-1 rounded border border-dashed border-slate-300 text-slate-400 hover:text-indigo-600 hover:border-indigo-400 text-[10px] transition-all bg-white">
                                    <i class="ph ph-plus text-[8px]"></i> 新增标签
                                </button>
                                <div v-else class="flex items-center gap-1 bg-white border border-indigo-200 rounded-md px-1.5 py-0.5 shadow-sm absolute left-0 top-0 z-10 w-40">
                                    <input v-model="newResourceTagName" @keyup.enter="handleAddNewResourceTag" list="global-data-tags"
                                        class="w-full text-[10px] outline-none border-none p-0 focus:ring-0" placeholder="标签名, Enter 确认" autoFocus />
                                    <datalist id="global-data-tags">
                                        <option v-for="tag in globalTags" :key="tag" :value="tag"></option>
                                    </datalist>
                                    <button @click="handleAddNewResourceTag" class="text-indigo-600"><i class="ph ph-check text-[10px]"></i></button>
                                    <button @click="showResourceTagInput = false" class="text-slate-400"><i class="ph ph-x text-[10px]"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Actions -->
                    <div class="flex items-center gap-3">
                        <!-- Version Selector -->
                        <div class="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg">
                            <span class="text-sm text-slate-500">版本：</span>
                            <div class="relative" @click.stop>
                                <!-- 版本触发器按钮 -->
                                <button @click.stop="showVersionDropdown = !showVersionDropdown"
                                    class="flex items-center gap-2 text-sm text-slate-900 hover:text-indigo-600 transition-colors">
                                    <span class="font-semibold">{{ currentVersion.version }}</span>
                                    <span v-if="currentVersion.environments && currentVersion.environments.pre"
                                        class="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">预发</span>
                                    <span v-if="currentVersion.environments && currentVersion.environments.online"
                                        class="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">生产</span>
                                    <i class="ph ph-caret-down text-xs text-slate-400"></i>
                                </button>

                                <!-- 新版两栏下拉面板 -->
                                <div v-if="showVersionDropdown" @click.stop
                                    class="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col" style="width:560px; max-width:calc(100vw - 32px)">
                                    <!-- 上半部分：左右分栏 -->
                                    <div class="flex" style="min-height:360px; max-height:480px">
                                        <!-- 左侧：版本列表 -->
                                        <div class="flex flex-col border-r border-slate-100" style="width:200px; flex-shrink:0">
                                            <!-- 当前版本头部 -->
                                            <div class="px-5 pt-5 pb-4 border-b border-slate-100">
                                                <p class="text-xs text-slate-400 mb-1">当前版本</p>
                                                <div class="flex items-center gap-2">
                                                    <span class="text-3xl font-bold text-slate-900 leading-none">{{ currentVersion.version }}</span>
                                                    <div class="flex flex-col gap-1">
                                                        <span v-if="currentVersion.environments && currentVersion.environments.pre" class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">预发</span>
                                                        <span v-if="currentVersion.environments && currentVersion.environments.online" class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">生产</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- 版本列表标题 -->
                                            <div class="px-5 pt-3 pb-2">
                                                <p class="text-xs text-slate-400">版本列表</p>
                                            </div>
                                            <!-- 版本列表滚动区 -->
                                            <div class="flex-1 overflow-y-auto pb-2">
                                                <!-- 当前版本条目 -->
                                                <button @click="selectedDropdownVersion = null"
                                                    :class="['w-full px-5 py-3 flex items-center justify-between text-left transition-colors', !selectedDropdownVersion ? 'bg-indigo-50' : 'hover:bg-slate-50']">
                                                    <span :class="['text-sm font-medium', !selectedDropdownVersion ? 'text-indigo-700' : 'text-slate-700']">{{ currentVersion.version }}</span>
                                                    <div class="flex items-center gap-1">
                                                        <span v-if="currentVersion.environments && currentVersion.environments.pre" class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                                                        <span v-if="currentVersion.environments && currentVersion.environments.online" class="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
                                                        <span v-if="currentVersion.environments && currentVersion.environments.test && !currentVersion.environments.pre && !currentVersion.environments.online" class="w-2 h-2 rounded-full bg-sky-400 inline-block"></span>
                                                        <span v-if="!(currentVersion.environments && (currentVersion.environments.pre || currentVersion.environments.online || currentVersion.environments.test))" class="w-2 h-2 rounded-full bg-slate-200 inline-block"></span>
                                                    </div>
                                                </button>
                                                <!-- 历史版本条目：只显示有环境标签的已发布版本 -->
                                                <button v-for="v in versionHistory.filter(v => v.environments && (v.environments.pre || v.environments.online || v.environments.test))" :key="v.version"
                                                    @click="selectedDropdownVersion = v"
                                                    :class="['w-full px-5 py-3 flex items-center justify-between text-left transition-colors', selectedDropdownVersion && selectedDropdownVersion.version === v.version ? 'bg-indigo-50' : 'hover:bg-slate-50']">
                                                    <span :class="['text-sm', selectedDropdownVersion && selectedDropdownVersion.version === v.version ? 'font-medium text-indigo-700' : 'text-slate-600']">{{ v.version }}</span>
                                                    <div class="flex items-center gap-1">
                                                        <span v-if="v.environments && v.environments.pre" class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                                                        <span v-if="v.environments && v.environments.online" class="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
                                                        <span v-if="v.environments && v.environments.test" class="w-2 h-2 rounded-full bg-sky-400 inline-block"></span>
                                                        <span v-if="!(v.environments && (v.environments.pre || v.environments.online || v.environments.test))" class="w-2 h-2 rounded-full bg-slate-200 inline-block"></span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        <!-- 右侧：发布记录 -->
                                        <div class="flex-1 flex flex-col overflow-hidden">
                                            <!-- 右侧头部 -->
                                            <div class="px-5 pt-5 pb-3 border-b border-slate-100">
                                                <span class="text-sm font-semibold text-slate-800">{{ selectedDropdownVersion ? selectedDropdownVersion.version : currentVersion.version }}</span>
                                                <span class="mx-2 text-slate-300">|</span>
                                                <span class="text-sm text-slate-400">发布记录</span>
                                            </div>
                                            <!-- 发布记录内容 -->
                                            <div class="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                                                <template v-if="selectedDropdownVersion">
                                                    <div v-if="selectedDropdownVersion.environments && selectedDropdownVersion.environments.online">
                                                        <p class="text-sm font-semibold text-slate-800 mb-2">生产环境</p>
                                                        <p class="text-xs text-slate-500 leading-relaxed mb-3">{{ selectedDropdownVersion.changeLog || '支持版本环境标签持久化展示，优化字段渲染逻辑，修复部分边界问题。' }}</p>
                                                        <div class="flex items-center gap-2">
                                                            <img src="https://api.dicebear.com/7.x/thumbs/svg?seed=online" class="w-6 h-6 rounded-full bg-slate-200" />
                                                            <span class="text-xs text-slate-600">{{ selectedDropdownVersion.createdBy || '张嘉怡' }}</span>
                                                            <span class="text-xs text-slate-400 ml-auto">{{ selectedDropdownVersion.createdAt || '2025-06-04 22:06' }}</span>
                                                        </div>
                                                    </div>
                                                    <div v-if="selectedDropdownVersion.environments && selectedDropdownVersion.environments.pre">
                                                        <p class="text-sm font-semibold text-slate-800 mb-2">预发环境</p>
                                                        <p class="text-xs text-slate-500 leading-relaxed mb-3">{{ selectedDropdownVersion.changeLog || '支持版本环境标签持久化展示，优化字段渲染逻辑，修复部分边界问题。' }}</p>
                                                        <div class="flex items-center gap-2">
                                                            <img src="https://api.dicebear.com/7.x/thumbs/svg?seed=pre" class="w-6 h-6 rounded-full bg-slate-200" />
                                                            <span class="text-xs text-slate-600">{{ selectedDropdownVersion.createdBy || '张俊杰' }}</span>
                                                            <span class="text-xs text-slate-400 ml-auto">{{ selectedDropdownVersion.createdAt || '2025-05-08 21:44' }}</span>
                                                        </div>
                                                    </div>
                                                    <div v-if="selectedDropdownVersion.environments && selectedDropdownVersion.environments.test && !selectedDropdownVersion.environments.online && !selectedDropdownVersion.environments.pre">
                                                        <p class="text-sm font-semibold text-slate-800 mb-2">测试环境</p>
                                                        <p class="text-xs text-slate-500 leading-relaxed mb-3">{{ selectedDropdownVersion.changeLog || '支持版本环境标签持久化展示。' }}</p>
                                                        <div class="flex items-center gap-2">
                                                            <img src="https://api.dicebear.com/7.x/thumbs/svg?seed=test" class="w-6 h-6 rounded-full bg-slate-200" />
                                                            <span class="text-xs text-slate-600">{{ selectedDropdownVersion.createdBy || '当前用户' }}</span>
                                                            <span class="text-xs text-slate-400 ml-auto">{{ selectedDropdownVersion.createdAt || '' }}</span>
                                                        </div>
                                                    </div>
                                                    <div v-if="!(selectedDropdownVersion.environments && (selectedDropdownVersion.environments.online || selectedDropdownVersion.environments.pre || selectedDropdownVersion.environments.test))" class="text-center py-10">
                                                        <i class="ph ph-clock text-3xl text-slate-300 block mb-2"></i>
                                                        <p class="text-xs text-slate-400">该版本暂未发布</p>
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    <div v-if="currentVersion.environments && currentVersion.environments.online">
                                                        <p class="text-sm font-semibold text-slate-800 mb-2">生产环境</p>
                                                        <p class="text-xs text-slate-500 leading-relaxed mb-3">{{ currentVersion.changeLog || '支持版本环境标签持久化展示，优化字段渲染逻辑，修复部分边界问题。' }}</p>
                                                        <div class="flex items-center gap-2">
                                                            <img src="https://api.dicebear.com/7.x/thumbs/svg?seed=online" class="w-6 h-6 rounded-full bg-slate-200" />
                                                            <span class="text-xs text-slate-600">{{ currentVersion.createdBy || '张嘉怡' }}</span>
                                                            <span class="text-xs text-slate-400 ml-auto">{{ currentVersion.createdAt || '2025-06-04 22:06' }}</span>
                                                        </div>
                                                    </div>
                                                    <div v-if="currentVersion.environments && currentVersion.environments.pre">
                                                        <p class="text-sm font-semibold text-slate-800 mb-2">预发环境</p>
                                                        <p class="text-xs text-slate-500 leading-relaxed mb-3">{{ currentVersion.changeLog || '支持版本环境标签持久化展示，优化字段渲染逻辑，修复部分边界问题。' }}</p>
                                                        <div class="flex items-center gap-2">
                                                            <img src="https://api.dicebear.com/7.x/thumbs/svg?seed=pre" class="w-6 h-6 rounded-full bg-slate-200" />
                                                            <span class="text-xs text-slate-600">{{ currentVersion.createdBy || '张俊杰' }}</span>
                                                            <span class="text-xs text-slate-400 ml-auto">{{ currentVersion.createdAt || '2025-05-08 21:44' }}</span>
                                                        </div>
                                                    </div>
                                                    <div v-if="currentVersion.environments && currentVersion.environments.test && !currentVersion.environments.online && !currentVersion.environments.pre">
                                                        <p class="text-sm font-semibold text-slate-800 mb-2">测试环境</p>
                                                        <p class="text-xs text-slate-500 leading-relaxed mb-3">{{ currentVersion.changeLog || '支持版本环境标签持久化展示。' }}</p>
                                                        <div class="flex items-center gap-2">
                                                            <img src="https://api.dicebear.com/7.x/thumbs/svg?seed=test" class="w-6 h-6 rounded-full bg-slate-200" />
                                                            <span class="text-xs text-slate-600">{{ currentVersion.createdBy || '当前用户' }}</span>
                                                            <span class="text-xs text-slate-400 ml-auto">{{ currentVersion.createdAt || '' }}</span>
                                                        </div>
                                                    </div>
                                                    <div v-if="!currentVersion.environments || !(currentVersion.environments.online || currentVersion.environments.pre || currentVersion.environments.test)" class="text-center py-10">
                                                        <i class="ph ph-clock text-3xl text-slate-300 block mb-2"></i>
                                                        <p class="text-xs text-slate-400">当前版本暂未发布</p>
                                                    </div>
                                                </template>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 底部全宽「浏览此版本」按钮 -->
                                    <div class="px-5 py-4 border-t border-slate-100">
                                        <button @click="selectedDropdownVersion ? switchVersion(selectedDropdownVersion) : (showVersionDropdown = false)"
                                            class="w-full py-2.5 border border-indigo-400 text-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-50 transition-colors">
                                            浏览此版本
                                        </button>
                                    </div>
                                </div>
                                <!-- 遮罩 -->
                                <div v-if="showVersionDropdown" @click="showVersionDropdown = false; selectedDropdownVersion = null" class="fixed inset-0 z-40"></div>
                            </div>
                        </div>

                        <!-- Publish Button -->
                        <button @click="openVersionPublish"
                            class="h-9 px-4 bg-white border border-indigo-400 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-all flex items-center gap-1.5">
                            <i class="ph ph-rocket-launch text-base"></i>
                            <span>发布</span>
                        </button>
                    </div>
                </div>
                
                <div class="flex border-b border-slate-200 bg-slate-50/80 flex-shrink-0">
                    <button @click="dataActiveTab = 'schema'"
                        :class="['px-5 py-3 text-sm font-medium border-b-2 transition-colors', dataActiveTab === 'schema' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700']">
                        <i class="ph ph-list-bullets mr-1.5"></i>字段信息
                    </button>
                    <button v-if="node?.sourceType !== 'EXCEL'" @click="dataActiveTab = 'ddl'"
                        :class="['px-5 py-3 text-sm font-medium border-b-2 transition-colors', dataActiveTab === 'ddl' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700']">
                        <i class="ph ph-file-sql mr-1.5"></i>建表语句
                    </button>

                    <button @click="dataActiveTab = 'auth_rules'"
                        :class="['px-5 py-3 text-sm font-medium border-b-2 transition-colors', dataActiveTab === 'auth_rules' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700']">
                        <i class="ph ph-shield-check mr-1.5"></i>权限规则
                    </button>
                </div>

                <div class="flex-1 overflow-auto p-5">
                    <div v-show="dataActiveTab === 'schema'" class="space-y-5">
                        <!-- Warning Banners for Version 1.0.1 -->
                        <div v-if="currentVersion.version === '1.0.1'" class="space-y-3">
                            <!-- Upstream Change Warning -->
                            <div class="flex items-start gap-3 p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
                                <i class="ph-fill ph-info text-lg flex-shrink-0 mt-0.5"></i>
                                <span class="text-sm">检测到上游结构变更，已同步到当前版本。请检查并修复受影响的配置（标签/权限/SQL 等），完成后发布到目标环境。</span>
                            </div>
                        </div>

                        <p class="text-sm text-slate-500">
                            {{ node?.sourceType === 'EXCEL' ? '通过本地文件上传，支持对字段描述、治理标签进行编辑。' : '通过 SQL 视图注册进入，仅支持对已有字段的描述、治理标签、分区标记等进行修改。' }}
                        </p>
                        <!-- 表描述 -->
                        <div class="flex items-start gap-3 p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                            <div class="flex-1 min-w-0">
                                <label class="text-xs font-semibold text-slate-500 uppercase mb-1 block">表描述</label>
                                <p class="text-sm text-slate-800">{{ tableDescription || '—' }}</p>
                            </div>
                            <button @click="openTableDescEdit" class="p-1.5 text-slate-400 hover:text-indigo-600 rounded"><i class="ph ph-pencil-simple text-sm"></i></button>
                        </div>
                        <!-- 表统计信息 -->
                        <div class="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                            <label class="text-xs font-semibold text-slate-500 uppercase mb-2 block">统计信息</label>
                            <pre class="text-xs text-slate-700 whitespace-pre-wrap font-sans">{{ tableStatistics }}</pre>
                        </div>
                        <div class="border border-slate-200 rounded-lg overflow-hidden">
                            <table class="min-w-full">
                                <thead class="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th class="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">字段名</th>
                                        <th class="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">类型</th>
                                        <th class="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">描述</th>
                                        <th class="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">治理标签</th>
                                        <th class="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">关联字典</th>
                                        <th class="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">加密</th>
                                        <th class="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">分区</th>
                                        <th class="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">统计信息</th>
                                        <th class="px-4 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase w-20">操作</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                    <tr v-for="(f, i) in schemaFields" :key="i" class="hover:bg-slate-50/50">
                                        <td class="px-4 py-3 text-sm font-mono text-slate-800">{{ f.name }}</td>
                                        <td class="px-4 py-3 text-sm text-slate-600">{{ f.type }}</td>
                                        <td class="px-4 py-3 text-sm text-slate-600">{{ f.description }}</td>
                                        <td class="px-4 py-3">
                                            <div v-if="f.governed_tag" class="relative inline-block group">
                                                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 cursor-default">
                                                    {{ getTagShortName(f.governed_tag) }}
                                                </span>
                                                <!-- Hover 显示完整路径 -->
                                                <div class="absolute left-0 top-full mt-1 z-50 hidden group-hover:block min-w-max max-w-md p-2.5 bg-slate-800 text-slate-100 rounded-lg shadow-xl text-xs">
                                                    <p class="font-medium text-slate-200 mb-1">完整路径</p>
                                                    <p class="text-slate-300 font-mono">{{ f.governed_tag }}</p>
                                                </div>
                                            </div>
                                            <span v-else class="text-slate-400 text-sm">—</span>
                                        </td>
                                        <!-- 关联字典列 -->
                                        <td class="px-4 py-3">
                                            <div v-if="f.linked_dict">
                                                <div class="inline-flex items-center gap-1.5">
                                                    <button @click="navigateToDict(f.linked_dict)" 
                                                        class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-700 transition-all shadow-sm shadow-cyan-100">
                                                        <i class="ph-fill ph-book-bookmark text-[10px]"></i>
                                                        {{ f.linked_dict }}
                                                    </button>
                                                    <div v-if="!isDictPublishedToAnyEnv(f.linked_dict)" class="relative group/warning">
                                                        <i class="ph-fill ph-warning text-amber-500 text-base cursor-help"></i>
                                                        <div class="absolute left-0 top-full mt-1 z-50 hidden group-hover/warning:block min-w-max max-w-xs p-2.5 bg-slate-800 text-slate-100 rounded-lg shadow-xl text-xs">
                                                            <p class="font-medium text-amber-300 mb-1">⚠️ 该字典未在任何环境生效</p>
                                                            <p class="text-slate-300">请在发布数据表前将字典发布至目标环境。</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-else-if="hasLinkedDict(f.governed_tag)">
                                                <div class="inline-flex items-center gap-1.5">
                                                    <button @click="navigateToDict(getLinkedDict(f.governed_tag))" 
                                                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-colors border border-cyan-100 border-dashed"
                                                        title="由治理标签自动关联">
                                                        <i class="ph ph-link text-xs"></i>
                                                        {{ getLinkedDict(f.governed_tag) }}
                                                    </button>
                                                    <div v-if="!isDictPublishedToAnyEnv(getLinkedDict(f.governed_tag))" class="relative group/warning">
                                                        <i class="ph-fill ph-warning text-amber-500 text-base cursor-help"></i>
                                                        <div class="absolute left-0 top-full mt-1 z-50 hidden group-hover/warning:block min-w-max max-w-xs p-2.5 bg-slate-800 text-slate-100 rounded-lg shadow-xl text-xs">
                                                            <p class="font-medium text-amber-300 mb-1">⚠️ 该字典未在任何环境生效</p>
                                                            <p class="text-slate-300">请在发布数据表前将字典发布至目标环境。</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <span v-else class="text-slate-400 text-sm">—</span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <span v-if="f.is_encrypted" class="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800">
                                                <i class="ph ph-lock text-xs mr-1"></i>是
                                            </span>
                                            <span v-else class="text-slate-400 text-sm">—</span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <div v-if="f.is_partition" class="relative inline-block" @mouseenter="hoverPartitionIndex = i" @mouseleave="hoverPartitionIndex = null">
                                                <span class="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-800 cursor-default">是</span>
                                                <div v-if="hoverPartitionIndex === i && partitionInfo" class="absolute left-0 top-full mt-1 z-50 min-w-[260px] p-3 bg-slate-800 text-slate-100 rounded-lg shadow-xl text-xs">
                                                    <p class="font-medium text-slate-200 mb-2">分区信息</p>
                                                    <p><span class="text-slate-400">分区数据格式：</span>{{ partitionInfo.partition_format }}</p>
                                                    <p class="mt-1"><span class="text-slate-400">全量/增量：</span>{{ partitionInfo.partition_mode === 'full' ? '全量镜像' : '增量' }}</p>
                                                    <p class="mt-1 text-slate-300">全量：<code class="bg-slate-700 px-1 rounded">WHERE {{ partitionInfo.partition_field }}=datetime_value</code></p>
                                                    <p class="mt-0.5 text-slate-300">增量：<code class="bg-slate-700 px-1 rounded">WHERE {{ partitionInfo.partition_field }}&lt;datetime_value</code></p>
                                                </div>
                                            </div>
                                            <span v-else class="text-slate-400 text-sm">—</span>
                                        </td>
                                        <td class="px-4 py-3 text-xs text-slate-600">
                                            <pre v-if="f.fieldStatistics" class="whitespace-pre-wrap font-sans">{{ f.fieldStatistics }}</pre>
                                            <span v-else class="text-slate-400">—</span>
                                        </td>
                                        <td class="px-4 py-3 text-right">
                                            <button @click="openFieldEdit(i)" class="text-slate-400 hover:text-indigo-600 p-1"><i class="ph ph-pencil-simple text-sm"></i></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Tab: 建表语句 -->
                    <div v-show="dataActiveTab === 'ddl'" class="space-y-4">
                        <!-- 提示条 - 简洁化 -->
                        <div class="flex items-center gap-2 px-4 py-3 bg-blue-50/50 text-blue-700 rounded-lg border border-blue-100/50">
                            <i class="ph ph-info-semibold text-lg"></i>
                            <p class="text-sm">来自 SQL 视图注册的建表/视图语句。修改将影响资产解析，请谨慎操作。</p>
                        </div>

                        <!-- 建表语句主体 - 按钮移入此处 -->
                        <div class="relative group">
                            <!-- 悬浮工具栏 (放在代码块内部右上角) -->
                            <div class="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                                <button @click="copyToClipboard(ddlStatement)" 
                                    class="w-8 h-8 flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md border border-slate-700/50 backdrop-blur-sm transition-all"
                                    title="复制语句">
                                    <i class="ph ph-copy text-base"></i>
                                </button>
                                <button @click="openDdlEdit" 
                                    class="w-8 h-8 flex items-center justify-center bg-slate-800/80 hover:bg-red-900/40 text-slate-300 hover:text-white rounded-md border border-slate-700/50 backdrop-blur-sm transition-all"
                                    title="修改建表语句">
                                    <i class="ph ph-pencil-simple-line text-base"></i>
                                </button>
                            </div>

                            <!-- SQL 内容 -->
                            <div class="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
                                <div class="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
                                    <div class="flex items-center gap-2">
                                        <div class="flex gap-1">
                                            <div class="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                                            <div class="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                                            <div class="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                                        </div>
                                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">SQL Editor</span>
                                    </div>
                                    <span class="text-[10px] text-slate-500 font-mono">{{ ddlStatement.split('\\n').length }} lines</span>
                                </div>
                                <pre class="p-5 text-slate-200 text-sm font-mono overflow-x-auto leading-relaxed min-h-[220px] scrollbar-thin scrollbar-thumb-slate-700">{{ ddlStatement }}</pre>
                            </div>
                        </div>
                    </div>

                    <!-- 修改建表语句 Modal -->
                    <div v-if="showDdlEdit" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
                            <!-- Header -->
                            <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                                <h3 class="text-lg font-bold text-slate-900">修改结构化数据资产</h3>
                                <button @click="showDdlEdit = false" class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full transition-colors">
                                    <i class="ph ph-x text-xl"></i>
                                </button>
                            </div>

                            <!-- Content -->
                            <div class="flex-1 overflow-y-auto p-6 space-y-6">
                                <!-- 表英文名 (Immutable) -->
                                <div>
                                    <label class="block text-sm font-semibold text-slate-700 mb-2">表英文名</label>
                                    <div class="relative group">
                                        <input :value="ddlEditForm.name" type="text" readonly
                                            class="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 rounded-lg text-sm font-mono text-slate-500 cursor-not-allowed" />
                                        <div class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <i class="ph ph-lock"></i>
                                        </div>
                                    </div>
                                </div>

                                <!-- 表中文名 -->
                                <div>
                                    <label class="block text-sm font-semibold text-slate-700 mb-2">表中文名 (选填)</label>
                                    <input v-model="ddlEditForm.chineseName" type="text"
                                        class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="请输入表中文名">
                                </div>

                                <!-- 表描述 -->
                                <div>
                                    <label class="block text-sm font-semibold text-slate-700 mb-2">表描述 (选填)</label>
                                    <textarea v-model="ddlEditForm.description" rows="2"
                                        class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="请输入表描述"></textarea>
                                </div>

                                <!-- SQL Editor -->
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-2">查询 SQL</label>
                                    <div class="relative">
                                        <textarea v-model="ddlEditForm.sql" rows="10" class="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none" placeholder="SELECT id, name, department, status, joined_at, dt&#10;FROM raw.emp_leave&#10;WHERE dt >= '20230101';"></textarea>
                                        <div class="mt-2 flex items-center justify-between">
                                            <p class="text-xs text-slate-500">只需编写 SELECT 查询语句</p>
                                            <button @click="runSqlPreview" class="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1.5">
                                                <i class="ph ph-play"></i>查询
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Preview Results -->
                                <div v-if="sqlPreviewResult" class="border border-slate-200 rounded-lg overflow-hidden mt-4">
                                    <div class="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                        <span class="text-sm font-medium text-slate-700">预览结果</span>
                                        <span class="text-xs text-slate-500">前 2 行</span>
                                    </div>
                                    <div class="overflow-x-auto">
                                        <table class="min-w-full divide-y divide-slate-200">
                                            <thead class="bg-slate-50">
                                                <tr>
                                                    <th v-for="col in sqlPreviewResult.columns" :key="col" class="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">{{ col }}</th>
                                                </tr>
                                            </thead>
                                            <tbody class="divide-y divide-slate-200 bg-white">
                                                <tr v-for="(row, idx) in sqlPreviewResult.rows" :key="idx" class="hover:bg-slate-50">
                                                    <td v-for="cell in row" class="px-4 py-3 text-sm text-slate-700">{{ cell }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <!-- 放置目录 -->
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-2">放置目录</label>
                                    <div class="relative">
                                        <button @click="showCatalogDropdown = !showCatalogDropdown" type="button" class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 hover:border-indigo-300 transition-colors flex items-center justify-between">
                                            <span>{{ ddlEditForm.targetCatalogName || '请选择目录' }}</span>
                                            <i class="ph ph-caret-down text-slate-400"></i>
                                        </button>
                                        
                                        <div v-if="showCatalogDropdown" class="absolute bottom-full left-0 right-0 mb-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                                            <div class="p-2">
                                                <div class="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">可选目录</div>
                                                <div class="space-y-1 mt-1">
                                                    <button v-for="cat in eligibleCatalogs" :key="cat.id" @click="selectDdlCatalog(cat)" type="button" class="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded flex items-center gap-2 transition-colors" :class="{'bg-indigo-50 text-indigo-700 font-medium': ddlEditForm.parentId === cat.id}">
                                                        <i class="ph ph-folder text-yellow-500"></i>
                                                        {{ cat.name }}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!-- Footer -->
                            <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
                                <button @click="showDdlEdit = false" class="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">取消</button>
                                <button @click="saveDdlEdit" class="px-8 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all flex items-center gap-2">
                                    <i class="ph ph-check-circle"></i>
                                    完成修改
                                </button>
                            </div>
                        </div>
                    </div>



                    <!-- Tab: 权限规则（末端鉴权） -->
                    <div v-show="dataActiveTab === 'auth_rules'" class="space-y-4">
                        <!-- 环境切换 -->
                        <div class="flex items-center justify-between">
                            <div class="flex bg-slate-100 p-1 rounded-lg">
                                <button @click="activeAuthEnv = 'pre'" 
                                    :class="['px-4 py-1.5 text-xs font-bold rounded-md transition-all', activeAuthEnv === 'pre' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700']">
                                    预发环境
                                </button>
                                <button @click="activeAuthEnv = 'online'" 
                                    :class="['px-4 py-1.5 text-xs font-bold rounded-md transition-all', activeAuthEnv === 'online' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700']">
                                    生产环境
                                </button>
                            </div>
                        </div>

                        <p class="text-sm text-slate-500 leading-relaxed">
                            数据资产被执行 / 查询时，按以下规则进行末端鉴权（行级、列级等）。各环境的权限配置相互独立，变更将实时作用于已发布到该环境的数据表的数据查询结果。
                        </p>
                        <div class="border border-slate-200 rounded-lg overflow-hidden">
                            <table class="min-w-full">
                                <thead class="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th class="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">规则名称</th>
                                        <th class="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">授权对象</th>
                                        <th class="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">列权限</th>
                                        <th class="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">行权限</th>
                                        <th class="px-4 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase w-20">操作</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                    <tr v-for="(r, i) in authRules" :key="i" class="hover:bg-slate-50/50">
                                        <td class="px-4 py-3 text-sm font-medium text-slate-800">{{ r.name }}</td>
                                        <td class="px-4 py-3 text-sm text-slate-600">
                                            <span class="inline-flex items-center gap-1">
                                                <i :class="['ph text-xs', r.targetAudience.type === 'individual' ? 'ph-user' : r.targetAudience.type === 'role' ? 'ph-users' : 'ph-buildings']"></i>
                                                {{ r.targetAudience.value }}
                                            </span>
                                        </td>
                                        <!-- 列权限 -->
                                        <td class="px-4 py-3">
                                            <template v-if="r.columnVisibility">
                                                <span v-if="r.columnVisibility.mode === 'all'" class="inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                                                    <i class="ph ph-check-circle text-sm"></i> 全部字段
                                                </span>
                                                <span v-else-if="r.columnVisibility.mode === 'include'" class="inline-flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                                                    <i class="ph ph-eye text-sm"></i> 授权 <code class="font-mono text-[11px] ml-0.5">{{ r.columnVisibility.fields.join(', ') }}</code>
                                                </span>
                                                <span v-else-if="r.columnVisibility.mode === 'exclude'" class="inline-flex items-center gap-1.5 text-xs text-red-700 bg-red-50 px-2 py-1 rounded-md border border-red-100">
                                                    <i class="ph ph-eye-slash text-sm"></i> 排除 <code class="font-mono text-[11px] ml-0.5">{{ r.columnVisibility.fields.join(', ') }}</code>
                                                </span>
                                            </template>
                                            <span v-else class="text-xs text-slate-400">-</span>
                                        </td>
                                        <!-- 行权限 -->
                                        <td class="px-4 py-3">
                                            <div v-if="r.ruleSource === 'custom' || !r.ruleSource">
                                                <span class="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                                                    <i class="ph ph-file-text text-sm text-slate-500"></i> 表专属
                                                </span>
                                                <span v-if="r.rowFilters && r.rowFilters.filter(f => f.field).length > 0" class="ml-1.5 text-[11px] text-slate-500 font-mono">
                                                    {{ r.conditionLogic?.trim() || r.rowFilters.filter(f => f.field).map((f, idx) => idx + 1).join(' AND ') }}
                                                </span>
                                                <span v-else class="ml-1.5 text-[11px] text-slate-400 italic">无条件</span>
                                            </div>
                                            <div v-else-if="r.ruleSource === 'global_reference'">
                                                <span class="inline-flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                                                    <i class="ph ph-link text-sm"></i> 引用
                                                </span>
                                                <button v-if="r.globalRuleRef" @click="navigateToRule(r.globalRuleRef)" class="ml-1.5 text-xs text-cyan-600 hover:text-cyan-800 underline decoration-dashed font-medium">
                                                    {{ r.globalRuleRef }}
                                                </button>
                                            </div>
                                            <span v-else class="text-xs text-slate-400">-</span>
                                        </td>
                                        <td class="px-4 py-3 text-right">
                                            <button @click="openAuthRuleEdit(i)" class="text-slate-400 hover:text-indigo-600 p-1"><i class="ph ph-pencil-simple text-sm"></i></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <button @click="openAuthRuleEdit(-1)" class="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-medium rounded hover:bg-slate-100">
                            <i class="ph ph-plus"></i> 添加规则
                        </button>
                    </div>
                </div>

                <!-- 表描述编辑弹层 -->
                <div v-if="showTableDescEdit" class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" @click.self="showTableDescEdit = false">
                    <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
                        <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                            <h3 class="text-base font-semibold text-slate-900">编辑表描述</h3>
                            <button @click="showTableDescEdit = false" class="p-1 text-slate-400 hover:text-slate-600"><i class="ph ph-x text-lg"></i></button>
                        </div>
                        <div class="p-5">
                            <textarea v-model="tableDescForm" rows="4" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="请输入表的描述"></textarea>
                        </div>
                        <div class="px-5 py-4 border-t border-slate-200 flex justify-end gap-2">
                            <button @click="showTableDescEdit = false" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">取消</button>
                            <button @click="saveTableDescEdit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">保存</button>
                        </div>
                    </div>
                </div>

                <!-- 字段编辑弹层（组件） -->
                <field-edit-modal
                    :visible="showFieldEdit"
                    :editing-form="editingForm"
                    :editing-field-index="editingFieldIndex"
                    :schema-fields="schemaFields"
                    :governed-tag-tree="governedTagTree"
                    :dictionaries="dictionaries"
                    :show-tag-tree-dropdown="showTagTreeDropdown"
                    :tag-tree-expanded="tagTreeExpanded"
                    @close="closeFieldEdit"
                    @save="saveFieldEdit"
                    @update:showTagTreeDropdown="showTagTreeDropdown = $event"
                    @toggleTagTreeNode="toggleTagTreeNode"
                    @selectTagFromTree="selectTagFromTree"
                    @navigateToDict="navigateToDict"
                    @update-encryption-init="updateDetailFieldEncryptionInit"
                />

                <!-- 版本发布弹层 -->
                <div v-if="showVersionPublish" class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" @click.self="showVersionPublish = false">
                    <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 flex flex-col">
                        <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                            <h3 class="text-base font-semibold text-slate-900">发布版本 · {{ currentVersion.version }}</h3>
                            <button @click="showVersionPublish = false" class="p-1 text-slate-400 hover:text-slate-600">
                                <i class="ph ph-x text-lg"></i>
                            </button>
                        </div>
                        <div class="p-5 space-y-4 flex-1 overflow-y-auto">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">发布到环境</label>
                                <div class="flex gap-3">
                                    <button @click="publishForm.environment = 'online'" 
                                        :class="['px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2', publishForm.environment === 'online' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-300 text-slate-700']">
                                        <i class="ph ph-check-circle" v-if="publishForm.environment === 'online'"></i>
                                        <span>生产</span>
                                    </button>
                                    <button @click="publishForm.environment = 'pre'" 
                                        :class="['px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2', publishForm.environment === 'pre' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-300 text-slate-700']">
                                        <i class="ph ph-check-circle" v-if="publishForm.environment === 'pre'"></i>
                                        <span>预发</span>
                                    </button>
                                    <button @click="publishForm.environment = 'test'" 
                                        :class="['px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2', publishForm.environment === 'test' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-300 text-slate-700']">
                                        <i class="ph ph-check-circle" v-if="publishForm.environment === 'test'"></i>
                                        <span>测试</span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">发布备注</label>
                                <textarea v-model="publishForm.note" 
                                    class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none" 
                                    rows="4" 
                                    placeholder="本次发布的说明（可选）"></textarea>
                            </div>
                        </div>
                        <div class="px-5 py-4 border-t border-slate-200 flex justify-end gap-2 flex-shrink-0">
                            <button @click="showVersionPublish = false" 
                                class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm transition-colors">取消</button>
                            <button @click="saveVersionPublish" 
                                class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                <i class="ph ph-upload-simple"></i>确认发布
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 权限规则编辑弹层（组件） -->
                <permission-rule-edit-modal
                    :visible="showAuthRuleEdit"
                    :editing-rule="editingAuthRule"
                    :editing-index="editingAuthRuleIndex"
                    :auth-rules="authRules"
                    :schema-fields="schemaFields"
                    :show-audience-dropdown="showAudienceDropdown"
                    :global-rules="globalRules"
                    @close="closeAuthRuleEdit"
                    @save="saveAuthRuleEdit"
                    @update:showAudienceDropdown="showAudienceDropdown = $event"
                    @selectAudience="selectAudience"
                    @addRowFilter="addRowFilter"
                    @removeRowFilter="removeRowFilter"
                    @toggleColumnField="toggleColumnField"
                />

                <!-- 版本发布弹窗 -->
                <div v-if="showVersionPublish" class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" @click.self="showVersionPublish = false">
                    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
                        <div class="px-5 py-4 border-b border-slate-200">
                            <h3 class="text-lg font-semibold text-slate-900">发布版本到环境</h3>
                        </div>
                        <div class="p-5 space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">目标环境 *</label>
                                <div class="grid grid-cols-2 gap-3">
                                    <button @click="publishForm.environment = 'pre'" 
                                        :class="['px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all', 
                                            publishForm.environment === 'pre' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-blue-300 text-slate-700']">
                                        预发环境
                                    </button>
                                    <button @click="publishForm.environment = 'online'" 
                                        :class="['px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all', 
                                            publishForm.environment === 'online' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 hover:border-green-300 text-slate-700']">
                                        生产环境
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">发布说明</label>
                                <textarea v-model="publishForm.note" rows="3"
                                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                                    placeholder="简要描述本次发布的内容..."></textarea>
                            </div>
                        </div>
                        <div class="px-5 py-4 border-t border-slate-200 flex items-center justify-end gap-2">
                            <button @click="showVersionPublish = false"
                                class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                取消
                            </button>
                            <button @click="saveVersionPublish"
                                class="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                确认发布
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    `,
    TagCollection: `
            <div class="h-full flex bg-white">
                <!-- 左侧：标签列表 -->
                <div class="w-1/3 border-r border-slate-200 flex flex-col bg-white">
                    <!-- Header -->
                    <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <i class="ph ph-tags text-xl text-amber-600"></i>
                                <h2 class="text-sm font-bold text-slate-800">治理标签</h2>
                            </div>
                            <button 
                                @click="addRootTag"
                                class="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-1.5 font-semibold shadow-sm">
                                <i class="ph ph-plus"></i>
                                添加标签
                            </button>
                        </div>
                    </div>

                    <!-- 搜索栏 -->
                    <div class="px-4 py-3 border-b border-slate-100 bg-white">
                        <div class="relative">
                            <i class="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            <input 
                                v-model="tagSearchQuery" 
                                type="text"
                                placeholder="搜索标签名称/标签code..."
                                class="w-full pl-9 pr-3 py-1.5 bg-slate-100 border-transparent rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all" />
                        </div>
                    </div>

                    <!-- 平铺列表视图 - 无层级 -->
                    <div class="flex-1 overflow-y-auto divide-y divide-slate-50">
                        <div v-if="!filteredFlatTags || filteredFlatTags.length === 0" class="p-8 text-center text-slate-400">
                            <i class="ph ph-tag text-3xl mb-2 opacity-20"></i>
                            <p class="text-xs">未找到匹配的标签</p>
                        </div>
                        <div 
                            v-for="tag in filteredFlatTags" 
                            :key="tag.id" 
                            class="px-4 py-3 hover:bg-indigo-50/50 cursor-pointer transition-colors group relative"
                            :class="selectedTag?.id === tag.id ? 'bg-indigo-50 border-l-4 border-indigo-600 pl-3' : 'pl-4'"
                            @click="selectTag(tag)">
                            <div class="flex items-start justify-between gap-3">
                                <div class="min-w-0">
                                    <div class="flex items-center gap-1.5 mb-0.5">
                                        <div class="w-4 h-4 rounded bg-amber-100 flex items-center justify-center flex-shrink-0">
                                            <i class="ph ph-tag text-[10px] text-amber-600"></i>
                                        </div>
                                        <span class="text-sm font-semibold text-slate-900 truncate">{{ tag.name }}</span>
                                    </div>
                                    <div class="text-[10px] text-slate-400 font-mono truncate">{{ tag.identifier }}</div>
                                </div>
                                
                                <!-- 操作按钮 -->
                                <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        v-if="!tag.originNodeId || tag.originNodeId === currentNodeId"
                                        @click.stop="editTag(tag)"
                                        class="p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded transition-colors">
                                        <i class="ph ph-pencil-simple"></i>
                                    </button>
                                    <button 
                                        v-if="!tag.originNodeId || tag.originNodeId === currentNodeId"
                                        @click.stop="confirmDeleteTag(tag)"
                                        class="p-1 text-slate-400 hover:text-red-600 hover:bg-white rounded transition-colors">
                                        <i class="ph ph-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 右侧：标签详情 -->
                <div class="flex-1 flex flex-col bg-slate-50/30">
                    <!-- 空状态 -->
                    <div v-if="!selectedTag" class="flex-1 flex items-center justify-center text-slate-400">
                        <div class="text-center">
                            <div class="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <i class="ph ph-tag text-4xl text-slate-200"></i>
                            </div>
                            <p class="text-sm font-medium">选择左侧标签查看详情</p>
                            <p class="text-xs mt-1">您可以查看标签的应用范围及权限规则</p>
                        </div>
                    </div>

                    <!-- 标签详情 -->
                    <template v-else>
                        <!-- Header -->
                        <div class="px-6 py-5 border-b border-slate-200 bg-white flex-shrink-0">
                            <div class="flex items-center gap-3 mb-1">
                                <div class="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                                    <i class="ph ph-tag text-amber-600"></i>
                                </div>
                                <h3 class="text-lg font-bold text-slate-900">{{ selectedTag.name }}</h3>
                            </div>
                            <div class="flex items-center gap-4 text-xs">
                                <div class="flex items-center gap-1.5 text-slate-500">
                                    <span class="font-medium">全路径:</span>
                                    <code class="px-1.5 py-0.5 bg-slate-100 rounded font-mono text-[11px]">{{ selectedTag.fullPath }}</code>
                                </div>
                                <div class="h-3 w-px bg-slate-200"></div>
                                <div class="flex items-center gap-1.5 text-slate-500">
                                    <span class="font-medium">标签code:</span>
                                    <code class="px-1.5 py-0.5 bg-slate-100 rounded font-mono text-[11px]">{{ selectedTag.identifier }}</code>
                                </div>
                            </div>
                        </div>

                        <!-- 详情内容 -->
                        <div class="flex-1 overflow-y-auto p-8 space-y-10">
                            <!-- 标签描述 -->
                            <section>
                                <div class="flex items-center gap-2 mb-3">
                                    <div class="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
                                    <h4 class="text-sm font-bold text-slate-800">业务描述</h4>
                                </div>
                                <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-600 leading-relaxed">
                                    {{ selectedTag.description || '暂无描述信息' }}
                                </div>
                            </section>


                            <!-- 应用的字段详情 - 按环境分组 -->
                            <section>
                                <div class="flex items-center justify-between mb-4">
                                    <div class="flex items-center gap-2">
                                        <div class="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                                        <h4 class="text-sm font-bold text-slate-800">当前应用于 ({{ selectedTag.appliedFields?.length || 0 }})</h4>
                                    </div>
                                </div>
                                
                                <div v-if="selectedTag.appliedFields && selectedTag.appliedFields.length > 0" class="space-y-5">

                                    <!-- ONLINE 环境 -->
                                    <div v-if="selectedTag.appliedFields.filter(f => f.env === 'online').length > 0">
                                        <div class="flex items-center gap-2 mb-3">
                                            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">ONLINE</span>
                                            <span class="text-xs text-slate-400">{{ selectedTag.appliedFields.filter(f => f.env === 'online').length }} 个字段</span>
                                        </div>
                                        <div class="space-y-2">
                                            <div v-for="field in selectedTag.appliedFields.filter(f => f.env === 'online')" :key="'online_' + field.id"
                                                class="p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all">
                                                <div class="flex items-start gap-3">
                                                    <div class="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <i class="ph ph-database text-emerald-600 text-lg"></i>
                                                    </div>
                                                    <div class="flex-1 min-w-0">
                                                        <div class="flex items-center justify-between mb-1.5">
                                                            <div class="flex items-center gap-2">
                                                                <span class="text-sm font-bold text-slate-900">{{ field.assetName }}</span>
                                                                <span v-if="field.version" class="text-[10px] text-slate-400 font-mono">{{ field.version }}</span>
                                                            </div>
                                                            <span class="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500 font-medium font-mono">{{ field.fieldType }}</span>
                                                        </div>
                                                        <div class="flex items-center gap-2 text-xs">
                                                            <code class="text-indigo-600 font-mono bg-indigo-50 px-1.5 py-0.5 rounded">{{ field.fieldName }}</code>
                                                            <span v-if="field.tableName" class="text-slate-400 font-mono">{{ field.tableName }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- PRE 环境 -->
                                    <div v-if="selectedTag.appliedFields.filter(f => f.env === 'pre').length > 0">
                                        <div class="flex items-center gap-2 mb-3">
                                            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200">PRE</span>
                                            <span class="text-xs text-slate-400">{{ selectedTag.appliedFields.filter(f => f.env === 'pre').length }} 个字段</span>
                                        </div>
                                        <div class="space-y-2">
                                            <div v-for="field in selectedTag.appliedFields.filter(f => f.env === 'pre')" :key="'pre_' + field.id"
                                                class="p-4 bg-white border border-slate-200 rounded-xl hover:border-amber-300 hover:shadow-sm transition-all">
                                                <div class="flex items-start gap-3">
                                                    <div class="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <i class="ph ph-database text-amber-600 text-lg"></i>
                                                    </div>
                                                    <div class="flex-1 min-w-0">
                                                        <div class="flex items-center justify-between mb-1.5">
                                                            <div class="flex items-center gap-2">
                                                                <span class="text-sm font-bold text-slate-900">{{ field.assetName }}</span>
                                                                <span v-if="field.version" class="text-[10px] text-slate-400 font-mono">{{ field.version }}</span>
                                                            </div>
                                                            <span class="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500 font-medium font-mono">{{ field.fieldType }}</span>
                                                        </div>
                                                        <div class="flex items-center gap-2 text-xs">
                                                            <code class="text-indigo-600 font-mono bg-indigo-50 px-1.5 py-0.5 rounded">{{ field.fieldName }}</code>
                                                            <span v-if="field.tableName" class="text-slate-400 font-mono">{{ field.tableName }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                                <div v-else class="bg-white/50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
                                    <p class="text-sm text-slate-400">暂无应用的字段</p>
                                </div>
                            </section>

                            <!-- 权限规则详情 -->
                            <section>
                                <div class="flex items-center gap-2 mb-4">
                                    <div class="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                                    <h4 class="text-sm font-bold text-slate-800">关联访问规则 ({{ selectedTag.relatedRules?.length || 0 }})</h4>
                                </div>
                                
                                <div v-if="selectedTag.relatedRules && selectedTag.relatedRules.length > 0" class="space-y-3">
                                    <div v-for="rule in selectedTag.relatedRules" :key="rule.id" 
                                        class="p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all">
                                        <div class="flex items-start justify-between mb-3">
                                            <div class="flex items-center gap-2">
                                                <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                                    <i class="ph ph-shield-check text-emerald-600"></i>
                                                </div>
                                                <h5 class="text-sm font-bold text-slate-900">{{ rule.name }}</h5>
                                            </div>
                                            <span :class="['px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider', 
                                                rule.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600']">
                                                {{ rule.enabled ? 'Enabled' : 'Disabled' }}
                                            </span>
                                        </div>
                                        <div class="bg-slate-50 border border-slate-100 rounded-lg p-3">
                                            <div class="text-[10px] text-slate-400 font-bold uppercase mb-1">Access Condition</div>
                                            <code class="text-xs text-slate-700 font-mono block break-all">{{ rule.condition }}</code>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="bg-white/50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
                                    <p class="text-sm text-slate-400">暂无关联的规则</p>
                                </div>
                            </section>
                        </div>
                    </template>
                </div>

                <!-- 编辑标签弹窗 (复用) -->
                <div v-if="showEditModal" class="fixed inset-0 bg-black/30 z-[100] flex items-center justify-center p-4">
                    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
                        <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                            <h3 class="text-lg font-bold text-slate-900">{{ editingTag ? '编辑治理标签' : '添加治理标签' }}</h3>
                            <button @click="showEditModal = false" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
                                <i class="ph ph-x text-xl"></i>
                            </button>
                        </div>
                        <div class="p-6 space-y-5">
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-1.5">标签名称 <span class="text-rose-500">*</span></label>
                                <input 
                                    v-model="editForm.name"
                                    class="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="例如: PII 个人信息" />
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-1.5">标签code <span class="text-rose-500">*</span></label>
                                <div class="relative group">
                                    <input 
                                        v-model="editForm.identifier"
                                        :readonly="!!editingTag"
                                        :class="{'bg-slate-50 cursor-not-allowed text-slate-500': !!editingTag}"
                                        class="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="例如：PII_PERSON_INFO" />
                                    <div v-if="!!editingTag" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <i class="ph ph-lock"></i>
                                    </div>
                                    <div v-if="!!editingTag" class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                        Code 设定后不可修改
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-1.5">标签描述</label>
                                <textarea 
                                    v-model="editForm.description"
                                    rows="4"
                                    class="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="描述该标签的业务含义和建议用途..."></textarea>
                            </div>
                        </div>
                        <div class="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50">
                            <button 
                                @click="showEditModal = false"
                                class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
                                取消
                            </button>
                            <button 
                                @click="saveTag"
                                class="px-8 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-bold shadow-md shadow-indigo-100">
                                保存
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 删除确认弹窗 -->
                <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/30 z-[110] flex items-center justify-center p-4">
                    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200">
                        <div class="px-6 py-5 bg-rose-50 border-b border-rose-100">
                            <div class="flex items-center gap-3 text-rose-600">
                                <i class="ph-fill ph-warning text-2xl"></i>
                                <h3 class="text-lg font-bold">确认删除标签</h3>
                            </div>
                        </div>
                        <div class="p-6">
                            <p class="text-sm text-slate-600 leading-relaxed">确定要删除标签 <span class="font-bold text-slate-900">"{{ tagToDelete?.tag?.name }}"</span> 吗？<br><br>这将移除该资产下所有字段以此标签进行的关联，此操作不可恢复。</p>
                        </div>
                        <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
                            <button 
                                @click="handleCancelDelete"
                                class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
                                取消
                            </button>
                            <button 
                                @click="deleteTag"
                                class="px-6 py-2 text-sm bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all font-bold shadow-md shadow-rose-100">
                                确认删除
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    `,

    CreateDataAssetWizard: `            <div v-if="visible" class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" @click.self="handleClose" style="z-index: 9999;">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
                    <!-- Header -->
                    <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                        <h3 class="text-lg font-semibold text-slate-900">创建结构化数据资产</h3>
                        <button @click="handleClose" class="p-1 text-slate-400 hover:text-slate-600">
                            <i class="ph ph-x text-xl"></i>
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 overflow-y-auto p-6">
                        <!-- Step 1: 选择创建方式 -->
                        <div v-if="step === 1" class="space-y-6">
                            <p class="text-sm text-slate-500">请选择创建方式：</p>
                            <div class="grid grid-cols-3 gap-4">
                                <button @click="handleSelectMethod('VIEW')" 
                                    class="p-6 border-2 border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-left group">
                                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                                        <i class="ph ph-eye text-2xl text-blue-600"></i>
                                    </div>
                                    <h4 class="font-semibold text-slate-900 mb-2">从已有数据资产构建新视图</h4>
                                    <p class="text-sm text-slate-500">通过 SQL 视图创建新的数据资产</p>
                                </button>
                                <button @click="handleSelectMethod('ONLINE')" 
                                    class="p-6 border-2 border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-left group">
                                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                                        <i class="ph ph-cloud-arrow-down text-2xl text-green-600"></i>
                                    </div>
                                    <h4 class="font-semibold text-slate-900 mb-2">从生产环境接入新的数据资源</h4>
                                    <p class="text-sm text-slate-500">从天工、DataHub、MySQL 等接入</p>
                                </button>
                                <button @click="handleSelectMethod('EXCEL')" 
                                    class="p-6 border-2 border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-left group">
                                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                                        <i class="ph ph-file-xls text-2xl text-purple-600"></i>
                                    </div>
                                    <h4 class="font-semibold text-slate-900 mb-2">通过本地文件上传</h4>
                                    <p class="text-sm text-slate-500">上传 Excel/CSV 文件创建数据资产</p>
                                </button>
                            </div>
                        </div>

                        <!-- Step 2: 写 SQL 并预览 -->
                        <div v-if="step === 2" class="space-y-6">
                            <!-- 方式1: 从已有数据资产构建新视图 -->
                            <template v-if="method === 'VIEW'">
                                <div class="space-y-4">
                                    <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-center gap-3">
                                        <div class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                                            <i class="ph ph-terminal-window text-xl"></i>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-slate-800">编写视角 SQL</h4>
                                            <p class="text-xs text-indigo-600 font-medium">通过编写 SQL 语句定义新视图的数据逻辑</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-2">查询 SQL</label>
                                        <textarea :value="form.viewSql" @input="$emit('update:form', {...form, viewSql: $event.target.value})" 
                                            class="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-slate-50" 
                                            rows="12" 
                                            placeholder="SELECT id, name, department, status, joined_at, dt&#10;FROM raw.emp_leave&#10;WHERE dt >= '20230101';"></textarea>
                                        <div class="mt-2 flex items-center justify-between">
                                            <p class="text-xs text-slate-500">只需编写 SELECT 查询语句</p>
                                            <button @click="handlePreview" type="button"
                                                class="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-md shadow-indigo-100">
                                                <i class="ph ph-play-circle text-lg"></i>预览数据
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <!-- 预览结果区域 -->
                                    <div v-if="previewData" class="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                        <div class="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                            <div class="flex items-center gap-2">
                                                <i class="ph ph-table text-indigo-500"></i>
                                                <span class="text-sm font-bold text-slate-700">预览结果</span>
                                            </div>
                                            <span class="text-[11px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200 uppercase">Top 5 Records</span>
                                        </div>
                                        <div class="overflow-x-auto max-h-[300px]">
                                            <table class="min-w-full divide-y divide-slate-200">
                                                <thead class="bg-slate-50/50">
                                                    <tr>
                                                        <th v-for="col in previewData.columns" :key="col" 
                                                            class="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                            {{ col }}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody class="divide-y divide-slate-100 bg-white">
                                                    <tr v-for="(row, idx) in previewData.rows" :key="idx" class="hover:bg-slate-50/80 transition-colors">
                                                        <td v-for="(cell, cellIdx) in row" :key="cellIdx" 
                                                            class="px-4 py-3 text-sm text-slate-600 font-mono">
                                                            {{ cell }}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <!-- Step 3: 元数据信息 (VIEW) -->
                        <div v-if="step === 3 && method === 'VIEW'" class="space-y-4">
                            <div class="flex items-center gap-3 bg-amber-50 px-4 py-3 rounded-xl border border-amber-100">
                                <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white">
                                    <i class="ph ph-list-magnifying-glass text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-slate-800">元数据配置</h4>
                                    <p class="text-xs text-amber-600 font-medium">配置视图输出字段的元数据信息</p>
                                </div>
                            </div>

                            <div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <table class="min-w-full divide-y divide-slate-200">
                                    <thead class="bg-slate-50">
                                        <tr>
                                            <th class="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">字段名称</th>
                                            <th class="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">类型</th>
                                            <th class="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">字段描述 (手动输入)</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100 bg-white">
                                        <tr v-for="(field, fIdx) in form.viewFields || []" :key="field.name" class="hover:bg-slate-50/50 transition-colors">
                                            <td class="px-6 py-4 text-sm font-mono font-bold text-slate-900">{{ field.name }}</td>
                                            <td class="px-6 py-4">
                                                <span class="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 border border-slate-200 uppercase tracking-wider">
                                                    {{ field.type || 'STRING' }}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4">
                                                <input type="text" 
                                                    :value="field.description"
                                                    @input="$emit('update-view-field-description', fIdx, $event.target.value)"
                                                    class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                                                    placeholder="请输入该字段的描述..." />
                                            </td>
                                        </tr>
                                        <tr v-if="!(form.viewFields && form.viewFields.length)">
                                            <td colspan="3" class="px-6 py-12 text-center text-slate-400 italic text-sm">
                                                请先在第一步执行查询以获取输出字段
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Step 4: 信息填写 (VIEW) -->
                        <div v-if="step === 4 && method === 'VIEW'" class="space-y-6">
                            <div class="flex items-center gap-3 bg-indigo-50 px-4 py-3 rounded-xl border border-indigo-100">
                                <div class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                                    <i class="ph ph-info text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-slate-800">视图基础信息</h4>
                                    <p class="text-xs text-indigo-600 font-medium">配置视图在资产目录中的展示信息</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-6">
                                <div class="space-y-5">
                                    <div>
                                        <label class="block text-sm font-bold text-slate-700 mb-2">视图名称 (英文) <span class="text-red-500">*</span></label>
                                        <input :value="form.name" @input="$emit('update:form', {...form, name: $event.target.value})" 
                                            class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                                            placeholder="例如：emp_leave_view" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-bold text-slate-700 mb-2">中文名称 <span class="text-red-500">*</span></label>
                                        <input :value="form.chineseName" @input="$emit('update:form', {...form, chineseName: $event.target.value})" 
                                            class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                                            placeholder="例如：员工离职视图" />
                                    </div>
                                </div>
                                <div class="space-y-5">
                                    <div>
                                        <label class="block text-sm font-bold text-slate-700 mb-2">视图描述</label>
                                        <textarea :value="form.description" @input="$emit('update:form', {...form, description: $event.target.value})" 
                                            class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all" 
                                            rows="4"
                                            placeholder="请描述这个视图的业务用途..."></textarea>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-2">放置目录 <span class="text-red-500">*</span></label>
                                <div class="relative">
                                    <button @click="showCatalogDropdown = !showCatalogDropdown" type="button"
                                        class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-700 hover:border-indigo-300 transition-all flex items-center justify-between shadow-sm outline-none">
                                        <div class="flex items-center gap-2">
                                            <i class="ph ph-folder text-amber-500 text-lg"></i>
                                            <span class="font-medium">{{ form.targetCatalog?.name || '请选择目标目录' }}</span>
                                        </div>
                                        <i class="ph ph-caret-down text-slate-400"></i>
                                    </button>
                                    <div v-if="showCatalogDropdown" 
                                        class="absolute bottom-full left-0 right-0 mb-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto p-2">
                                        <!-- 目录树内容省略，复用之前的结构 -->
                                        <button @click.stop="handleCreateNewCatalog" type="button"
                                            class="w-full px-3 py-2 mb-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center justify-center gap-2 transition-colors border border-dashed border-indigo-200">
                                            <i class="ph ph-plus-circle text-base"></i>新建存放目录
                                        </button>
                                        <div class="space-y-0.5">
                                            <button @click="selectCatalog({id: 'root_all', name: '全部'})" type="button"
                                                class="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded flex items-center gap-2">
                                                <i class="ph ph-folder text-yellow-500"></i>全部
                                            </button>
                                            <button @click="selectCatalog({id: 'root_common', name: '公共资源库'})" type="button"
                                                class="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded flex items-center gap-2 ml-4">
                                                <i class="ph ph-folder text-yellow-500"></i>公共资源库
                                            </button>
                                            <button @click="selectCatalog({id: 'root_hr', name: 'HR 人力资源域'})" type="button"
                                                class="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded flex items-center gap-2 ml-4">
                                                <i class="ph ph-folder text-yellow-500"></i>HR 人力资源域
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 其他方法的 Step 2 保持原样 -->
                        <div v-if="step === 2 && method !== 'VIEW'" class="space-y-6">
                            <!-- 方式2: 从生产环境接入新的数据资源 -->
                            <template v-if="method === 'ONLINE'">
                                <!-- Step 2: 搜索并选择表 -->
                                <div class="space-y-4">
                                    <label class="block text-sm font-bold text-slate-700">搜索并选择表</label>
                                    <div class="relative">
                                        <i class="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                        <input v-model="tableSearchQuery" type="text" 
                                            placeholder="输入表名称进行搜索..." 
                                            class="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                                    </div>

                                    <!-- 搜索结果列表 -->
                                    <div v-if="tableSearchQuery.trim()" class="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm mt-4">
                                        <div class="max-h-[400px] overflow-y-auto">
                                            <div v-if="filteredTables.length === 0" class="px-8 py-8 text-center text-slate-400">
                                                <i class="ph ph-mask-sad text-4xl mb-2"></i>
                                                <p class="text-sm italic">未找到匹配的数据表</p>
                                            </div>
                                            <div v-else v-for="table in filteredTables" :key="table.name"
                                                @click="$emit('select-table', table)"
                                                :class="['px-5 py-4 cursor-pointer flex items-center gap-4 transition-all border-l-4', isTableSelected(table) ? 'bg-indigo-50 border-indigo-500' : 'hover:bg-slate-50 border-transparent']">
                                                <div :class="['w-10 h-10 rounded-lg flex items-center justify-center shrink-0', isTableSelected(table) ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400']">
                                                    <i class="ph ph-table text-xl"></i>
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <div class="text-sm font-mono font-bold text-slate-900 truncate mb-0.5">{{ table.name }}</div>
                                                    <div class="text-xs text-slate-500 truncate flex items-center gap-2">
                                                        <span class="px-1.5 py-0.5 rounded-[4px] bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                                                            {{ table.sourceType || 'TABLE' }}
                                                        </span>
                                                        {{ table.description || '无表描述' }}
                                                    </div>
                                                </div>
                                                <i v-if="isTableSelected(table)" class="ph-fill ph-check-circle text-indigo-600 text-xl"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <!-- 方式3: 通过本地文件上传 -->
                            <template v-if="method === 'EXCEL'">
                                <!-- Step 2: 上传文件并选择Sheet -->
                                <div v-if="step === 2" class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-2">上传文件</label>
                                        <div class="mb-3 flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                            <i class="ph ph-info text-blue-500 text-sm mt-0.5"></i>
                                            <p class="leading-relaxed">
                                                提示：系统仅导入连续数据区域（中间无空行/空列），且只保存当前单元格的值，不包含公式和格式。
                                            </p>
                                        </div>
                                        <div @click="$refs.excelInput.click()" class="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                                            <i class="ph ph-file-xls text-4xl text-slate-400 mb-3"></i>
                                            <p class="text-sm text-slate-600 mb-2">点击选择或拖拽文件到此处</p>
                                            <p class="text-xs text-slate-500">支持 .xlsx, .xls, .csv 格式</p>
                                            <input type="file" ref="excelInput" accept=".xlsx,.xls,.csv" class="hidden" @change="$emit('file-upload', $event)" />
                                        </div>
                                    </div>
                                    <!-- 文件上传后显示Sheet选择 -->
                                    <div v-if="form.uploadedFile" class="space-y-3">
                                        <div class="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <i class="ph ph-check-circle text-green-600 text-xl"></i>
                                            <div class="flex-1">
                                                <p class="text-sm font-medium text-green-900">{{ form.uploadedFile.name }}</p>
                                                <p class="text-xs text-green-600">{{ form.uploadedFile.size }}</p>
                                            </div>
                                        </div>
                                        <!-- 解析状态 -->
                                        <div v-if="form.isParsing" class="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                                            <i class="ph ph-circle-notch text-3xl text-indigo-600 animate-spin mb-3"></i>
                                            <p class="text-sm text-slate-600">正在解析文件并提取数据表...</p>
                                        </div>

                                        <div v-if="!form.isParsing && form.availableSheets.length > 0">
                                            <label class="block text-sm font-medium text-slate-700 mb-2">选择要导入的 Sheet</label>
                                            <div class="border border-slate-200 rounded-lg overflow-hidden">
                                                <div v-for="sheet in form.availableSheets" :key="sheet.name"
                                                    @click="$emit('select-sheet', sheet)"
                                                    :class="['flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
                                                             form.selectedSheet?.name === sheet.name ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-slate-50']">
                                                    <input type="radio" 
                                                        :checked="form.selectedSheet?.name === sheet.name"
                                                        :name="'sheet-select'"
                                                        @click.stop
                                                        class="text-indigo-600 focus:ring-indigo-500" />
                                                    <div class="flex-1">
                                                        <div class="font-medium text-slate-900">{{ sheet.name }}</div>
                                                        <div class="text-xs text-slate-500 mt-0.5">{{ sheet.rowCount }} 行 × {{ sheet.columnCount }} 列</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>

                    <!-- Step 3: ONLINE方法 - 元数据预览 -->
                    <div v-if="step === 3 && method === 'ONLINE'" class="space-y-4">
                        <div class="flex items-center gap-3 bg-indigo-50 px-4 py-3 rounded-xl border border-indigo-100">
                             <div class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                                <i class="ph ph-eye text-xl"></i>
                             </div>
                             <div>
                                <h3 class="font-bold text-slate-900">{{ form.tableMetadata?.name || '未选定表' }}</h3>
                                <p class="text-xs text-indigo-600 font-medium">选定数据表元数据预览与编辑</p>
                             </div>
                        </div>

                        <div>
                            <div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <div class="overflow-x-auto">
                                    <table class="min-w-full divide-y divide-slate-200">
                                        <thead class="bg-slate-50">
                                            <tr>
                                                <th class="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">名称</th>
                                                <th class="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">类型</th>
                                                <th class="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider w-1/3">字段中文化</th>
                                                <th class="px-6 py-4 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">加密</th>
                                                <th class="px-6 py-4 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">分区</th>
                                            </tr>
                                        </thead>
                                        <tbody v-if="form.tableMetadata?.fields" class="divide-y divide-slate-100 bg-white">
                                            <template v-for="field in form.tableMetadata.fields" :key="field.name">
                                                <tr class="hover:bg-slate-50/50 transition-colors">
                                                    <td class="px-6 py-4">
                                                        <div class="flex items-center gap-2">
                                                            <span class="text-sm font-mono font-bold text-slate-900">{{ field.name }}</span>
                                                            <span v-if="field.isPrimary" class="inline-flex items-center px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded border border-amber-100 uppercase">
                                                                <i class="ph ph-key text-[10px] mr-1"></i>主键
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td class="px-6 py-4">
                                                        <span class="px-1.5 py-0.5 bg-slate-50 rounded text-[10px] font-mono font-bold text-slate-500 border border-slate-100 uppercase">{{ field.type }}</span>
                                                    </td>
                                                    <td class="px-6 py-4">
                                                        <input type="text" 
                                                            :value="field.description"
                                                            @input="$emit('update-field-description', field.name, $event.target.value)"
                                                            class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                                                            placeholder="编辑字段描述..." />
                                                    </td>
                                                    <td class="px-6 py-4 text-center">
                                                        <input type="checkbox" 
                                                            :checked="field.isEncrypted"
                                                            @change="updateOnlineFieldEncryption(field.name, $event.target.checked)"
                                                            class="rounded border-slate-300 text-red-600 focus:ring-red-500" />
                                                    </td>
                                                    <td class="px-6 py-4 text-center">
                                                        <span :class="['px-2 py-0.5 rounded text-[10px] font-bold', field.isPartition ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-50 text-slate-400 border border-slate-100']">
                                                            {{ field.isPartition ? '是' : '否' }}
                                                        </span>
                                                    </td>
                                                </tr>
                                                <!-- Inline Encryption Config -->
                                                <tr v-if="field.isEncrypted" :key="field.name + '_config'" class="bg-rose-50/20">
                                                    <td colspan="5" class="px-6 py-5 border-l-4 border-rose-400">
                                                        <div class="space-y-4">
                                                            <div class="flex items-center justify-between">
                                                                <div class="text-[11px] font-bold text-rose-600 flex items-center gap-2">
                                                                    <div class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                                                                    字段 [{{ field.name }}] 加密参数配置
                                                                </div>
                                                                <button @click="copyEncryptionConfig(field)" 
                                                                    class="text-[10px] bg-white border border-rose-200 text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-all font-bold shadow-sm flex items-center gap-1.5">
                                                                    <i class="ph ph-copy"></i> 复制此配置到其他已勾选加密的字段
                                                                </button>
                                                            </div>
                                                            
                                                            <div class="grid grid-cols-2 gap-4">
                                                                <div v-for="(config, cIdx) in field.encryptionConfigs" :key="cIdx" 
                                                                     class="bg-white border border-rose-100 rounded-xl p-4 shadow-sm">
                                                                    <div class="flex items-center justify-between mb-4 pb-2 border-b border-rose-50">
                                                                        <div class="flex items-center gap-2">
                                                                            <span class="text-xs font-bold text-slate-700">{{ config.env }}</span>
                                                                            <span v-if="config.isProduction" class="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] rounded font-bold border border-amber-100 uppercase tracking-tighter">PRD</span>
                                                                        </div>
                                                                        <div v-if="config.isSandbox" class="flex items-center gap-3">
                                                                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Center 环境</span>
                                                                            <select v-model="config.keyCenterEnv" class="text-[11px] px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-200 transition-all cursor-pointer">
                                                                                <option value="Online">Online</option>
                                                                                <option value="Staging">Staging</option>
                                                                                <option value="Test">Test</option>
                                                                            </select>
                                                                        </div>
                                                                        <div v-else class="flex items-center gap-3">
                                                                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Center 环境</span>
                                                                            <span class="text-[11px] font-bold text-slate-400">-</span>
                                                                        </div>
                                                                    </div>
                                                                    <div class="space-y-2">
                                                                        <div class="flex items-center justify-between">
                                                                            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Key Center App Key</span>
                                                                        </div>
                                                                        <textarea v-model="config.appKey" rows="2" placeholder="请输入该字段在此环境下的加密密钥..." 
                                                                            class="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white transition-all resize-none placeholder:text-slate-300"></textarea>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </template>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: EXCEL方法 - 预览数据并编辑元数据 -->
                    <div v-if="step === 3 && method === 'EXCEL'" class="flex-1 overflow-y-auto p-6 space-y-4">
                        <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h3 class="font-semibold text-slate-900 mb-1">{{ form.selectedSheet?.name }}</h3>
                            <p class="text-sm text-slate-600">{{ form.selectedSheet?.rowCount }} 行 × {{ form.selectedSheet?.columnCount }} 列</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">字段元数据</label>
                            <div class="border border-slate-200 rounded-lg overflow-hidden">
                                <div class="overflow-x-auto">
                                    <table class="min-w-full divide-y divide-slate-200">
                                        <thead class="bg-slate-50">
                                            <tr>
                                                <th class="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">字段名</th>
                                                <th class="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">类型</th>
                                                <th class="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">长度</th>
                                                <th class="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider w-1/4">描述</th>
                                                <th class="px-4 py-3 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">加密</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-slate-200 bg-white">
                                            <template v-for="(field, idx) in form.excelFields" :key="idx">
                                                <tr class="hover:bg-slate-50/50 transition-colors">
                                                    <td class="px-4 py-3 text-sm">
                                                        <input type="text" 
                                                            :value="field.name"
                                                            @input="$emit('update-excel-field', idx, 'name', $event.target.value)"
                                                            class="w-full px-2 py-1 border border-slate-200 rounded text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                            placeholder="字段名" />
                                                    </td>
                                                    <td class="px-4 py-3 text-sm">
                                                        <select 
                                                            :value="field.type"
                                                            @change="$emit('update-excel-field', idx, 'type', $event.target.value)"
                                                            class="w-full px-2 py-1 border border-slate-200 rounded text-xs bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                                                            <option value="STRING">STRING</option>
                                                            <option value="BIGINT">BIGINT</option>
                                                            <option value="INT">INT</option>
                                                            <option value="DOUBLE">DOUBLE</option>
                                                            <option value="BOOLEAN">BOOLEAN</option>
                                                            <option value="TIMESTAMP">TIMESTAMP</option>
                                                            <option value="DATE">DATE</option>
                                                        </select>
                                                    </td>
                                                    <td class="px-4 py-3 text-sm">
                                                        <input type="text" 
                                                            :value="field.length"
                                                            @input="$emit('update-excel-field', idx, 'length', $event.target.value)"
                                                            class="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                                                            placeholder="长度" />
                                                    </td>
                                                    <td class="px-4 py-3 text-sm">
                                                        <input type="text" 
                                                            :value="field.description"
                                                            @input="$emit('update-excel-field', idx, 'description', $event.target.value)"
                                                            class="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                                                            placeholder="添加字段描述" />
                                                    </td>
                                                    <td class="px-4 py-3 text-center">
                                                        <input type="checkbox" 
                                                            :checked="field.isEncrypted"
                                                            @change="updateExcelFieldEncryption(idx, $event.target.checked)"
                                                            class="rounded border-slate-300 text-red-600 focus:ring-red-500" />
                                                    </td>
                                                </tr>
                                                <!-- Inline Encryption Config for EXCEL -->
                                                <tr v-if="field.isEncrypted" :key="'excel_'+idx+'_config'" class="bg-rose-50/20">
                                                    <td colspan="5" class="px-4 py-4 border-l-4 border-rose-400">
                                                        <div class="space-y-4">
                                                            <div class="flex items-center justify-between">
                                                                <div class="text-[11px] font-bold text-rose-600 flex items-center gap-2">
                                                                    <div class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                                                                    字段 [{{ field.name }}] 加密参数配置
                                                                </div>
                                                                <button @click="copyExcelEncryptionConfig(field)" 
                                                                    class="text-[10px] bg-white border border-rose-200 text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-all font-bold shadow-sm flex items-center gap-1.5">
                                                                    <i class="ph ph-copy"></i> 复制此配置到其他已勾选加密的字段
                                                                </button>
                                                            </div>
                                                            
                                                            <div class="grid grid-cols-2 gap-4">
                                                                <div v-for="(config, cIdx) in field.encryptionConfigs" :key="cIdx" 
                                                                     class="bg-white border border-rose-100 rounded-xl p-4 shadow-sm">
                                                                    <div class="flex items-center justify-between mb-4 pb-2 border-b border-rose-50">
                                                                        <div class="flex items-center gap-2">
                                                                            <span class="text-xs font-bold text-slate-700">{{ config.env }}</span>
                                                                            <span v-if="config.isProduction" class="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] rounded font-bold border border-amber-100 uppercase tracking-tighter">PRD</span>
                                                                        </div>
                                                                        <div v-if="config.isSandbox" class="flex items-center gap-3">
                                                                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Center 环境</span>
                                                                            <select v-model="config.keyCenterEnv" class="text-[11px] px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-200 transition-all cursor-pointer">
                                                                                <option value="Online">Online</option>
                                                                                <option value="Staging">Staging</option>
                                                                                <option value="Test">Test</option>
                                                                            </select>
                                                                        </div>
                                                                        <div v-else class="flex items-center gap-3">
                                                                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Center 环境</span>
                                                                            <span class="text-[11px] font-bold text-slate-400 pl-2">Online</span>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div class="space-y-1.5">
                                                                        <div class="flex items-center justify-between">
                                                                            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Key Center App Key</label>
                                                                        </div>
                                                                        <textarea v-model="config.appKey" rows="2" 
                                                                            class="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-mono focus:ring-2 focus:ring-rose-200 focus:bg-white outline-none transition-all resize-none placeholder:text-slate-300"
                                                                            placeholder="请输入 App Key..."></textarea>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </template>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 4: EXCEL方法 - 输入表信息 -->
                    <div v-if="step === 4 && method === 'EXCEL'" class="flex-1 overflow-y-auto p-6 space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">
                                集群名称 <span class="text-red-500">*</span>
                            </label>
                            <div class="flex gap-2 relative">
                                <div class="flex-1 relative">
                                    <i class="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10"></i>
                                    <input 
                                        :value="form.clusterName"
                                        @input="$emit('update:form', {...form, clusterName: $event.target.value})"
                                        @focus="showClusterSearch = true"
                                        @blur="setTimeout(() => showClusterSearch = false, 200)"
                                        class="w-full pl-9 pr-10 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                                        placeholder="搜索或输入集群名称" />
                                    <i class="ph ph-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"></i>
                                    
                                    <!-- 集群搜索下拉列表 -->
                                    <div v-if="showClusterSearch" 
                                         class="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-60 overflow-hidden flex flex-col">
                                        <div class="px-3 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            推荐集群
                                        </div>
                                        <div class="overflow-y-auto max-h-48">
                                            <div v-if="filteredClusters.length === 0" class="px-4 py-4 text-center text-slate-400 text-xs">
                                                未找到匹配的集群
                                            </div>
                                            <div v-for="cluster in filteredClusters" :key="cluster.name"
                                                @mousedown="selectCluster(cluster)"
                                                class="px-4 py-2.5 hover:bg-indigo-50 cursor-pointer flex justify-between items-center border-b border-slate-50 last:border-b-0 transition-colors group">
                                                <div>
                                                    <div class="text-sm font-medium text-slate-700 group-hover:text-indigo-700">{{ cluster.name }}</div>
                                                    <div class="text-[10px] text-slate-400 group-hover:text-indigo-400">{{ cluster.type }}</div>
                                                </div>
                                                <i class="ph ph-plus-circle text-slate-300 group-hover:text-indigo-400 transition-colors"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    @click="testClusterConnection"
                                    :disabled="testConnectionStatus === 'testing'"
                                    :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border', 
                                             testConnectionStatus === 'testing' ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300']">
                                    <i v-if="testConnectionStatus === 'testing'" class="ph ph-circle-notch animate-spin"></i>
                                    <i v-else class="ph ph-plugs"></i>
                                    {{ testConnectionStatus === 'testing' ? '连接中...' : '连接' }}
                                </button>
                                
                                <!-- Toast-like Connection Message -->
                                <transition name="fade">
                                    <div v-if="testConnectionMessage" 
                                         :class="['absolute -top-10 right-0 px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold flex items-center gap-2 border animate-bounce',
                                                 testConnectionStatus === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                 testConnectionStatus === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200']">
                                        <i :class="['ph-fill', testConnectionStatus === 'success' ? 'ph-check-circle' : testConnectionStatus === 'error' ? 'ph-x-circle' : 'ph-info']"></i>
                                        {{ testConnectionMessage }}
                                    </div>
                                </transition>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">
                                表名称 <span class="text-red-500">*</span>
                            </label>
                            <input 
                                :value="form.tableName"
                                @input="$emit('update:form', {...form, tableName: $event.target.value})"
                                class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                                placeholder="例如：员工信息表" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">表中文名</label>
                            <input 
                                :value="form.chineseName" 
                                @input="$emit('update:form', {...form, chineseName: $event.target.value})"
                                class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                                placeholder="例如：员工信息表" />

                                </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">表描述（选填）</label>
                            <textarea 
                                :value="form.description"
                                @input="$emit('update:form', {...form, description: $event.target.value})"
                                rows="3"
                                class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none" 
                                placeholder="请描述这个数据表的用途和业务含义..."></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">
                                放置目录 <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <button @click="showCatalogDropdown = !showCatalogDropdown" type="button"
                                    class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 hover:border-indigo-300 transition-colors flex items-center justify-between">
                                    <span>{{ form.targetCatalog?.name || '请选择目录' }}</span>
                                    <i class="ph ph-caret-down text-slate-400"></i>
                                </button>
                                <div v-if="showCatalogDropdown" 
                                    class="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                                    <div class="p-2">
                                        <!-- 新建目录按钮 -->
                                        <button @click.stop="handleCreateNewCatalog" type="button"
                                            class="w-full px-2 py-1.5 mb-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded flex items-center justify-center gap-1.5 transition-colors">
                                            <i class="ph ph-plus text-sm"></i>新建目录
                                        </button>
                                        <div class="border-t border-slate-200 my-1"></div>
                                        <!-- 简化版目录树 -->
                                        <button @click="selectCatalog({id: 'root_all', name: '全部'})" type="button"
                                            class="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded flex items-center gap-2">
                                            <i class="ph ph-folder text-yellow-500"></i>全部
                                        </button>
                                        <button @click="selectCatalog({id: 'root_data_warehouse', name: '数据仓库域'})" type="button"
                                            class="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded flex items-center gap-2">
                                            <i class="ph ph-folder text-yellow-500"></i>数据仓库域
                                        </button>
                                        <button @click="selectCatalog({id: 'root_hr', name: 'HR 域'})" type="button"
                                            class="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded flex items-center gap-2">
                                            <i class="ph ph-folder text-yellow-500"></i>HR 域
                                        </button>
                                        <button @click="selectCatalog({id: 'cat_hr_workflows', name: '审批流程'})" type="button"
                                            class="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded flex items-center gap-2 ml-4">
                                            <i class="ph ph-folder text-yellow-500"></i>审批流程
                                        </button>
                                        <button @click="selectCatalog({id: 'root_sre', name: 'SRE 运维域'})" type="button"
                                            class="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded flex items-center gap-2">
                                            <i class="ph ph-folder text-yellow-500"></i>SRE 运维域
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 4: ONLINE方法 - 最终确认 -->
                    <div v-if="step === 4 && method === 'ONLINE'" class="space-y-5 flex-1 overflow-y-auto p-6 scrollbar-hide">
                        <div class="space-y-5">
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-2">表名称 <span class="text-red-500">*</span></label>
                                <div class="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 font-mono flex items-center gap-3 select-none">
                                    <i class="ph ph-lock text-slate-400"></i>
                                    {{ form.tableMetadata?.name || 'Unknown' }}
                                </div>
                                <p class="mt-1.5 text-[11px] text-slate-400 font-medium">生产环境同步表名，不支持修改</p>
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-2">表中文名</label>
                                <input 
                                    :value="form.chineseName" 
                                    @input="$emit('update:form', {...form, chineseName: $event.target.value})"
                                    class="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none" 
                                    placeholder="请输入表中文名（选填）" />
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-2">表描述</label>
                                <textarea 
                                    :value="form.description"
                                    @input="$emit('update:form', {...form, description: $event.target.value})"
                                    rows="3"
                                    class="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all outline-none" 
                                    placeholder="请输入表描述（选填）"></textarea>
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-2">放置目录 <span class="text-red-500">*</span></label>
                                <div class="relative">
                                    <button @click="showCatalogDropdown = !showCatalogDropdown" type="button"
                                        class="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 hover:border-indigo-300 transition-all flex items-center justify-between shadow-sm outline-none">
                                        <div class="flex items-center gap-2">
                                            <i class="ph ph-folder text-amber-500 text-lg"></i>
                                            <span class="font-medium">{{ form.targetCatalog?.name || '请选择目标目录' }}</span>
                                        </div>
                                        <i class="ph ph-caret-down text-slate-400 transition-transform" :class="{'rotate-180': showCatalogDropdown}"></i>
                                    </button>
                                    <div v-if="showCatalogDropdown" 
                                        class="absolute bottom-full left-0 right-0 mb-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto p-2">
                                        <!-- 新建目录按钮 -->
                                        <button @click.stop="handleCreateNewCatalog" type="button"
                                            class="w-full px-3 py-2 mb-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center justify-center gap-2 transition-colors border border-dashed border-indigo-200">
                                            <i class="ph ph-plus-circle text-base"></i>新建存放目录
                                        </button>
                                        <div class="space-y-0.5">
                                            <button @click="selectCatalog({id: 'root_all', name: '全部'})" type="button"
                                                class="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded flex items-center gap-2">
                                                <i class="ph ph-folder text-yellow-500"></i>全部
                                            </button>
                                            <button @click="selectCatalog({id: 'root_hr', name: 'HR 人力资源域'})" type="button"
                                                class="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded flex items-center gap-2 ml-4">
                                                <i class="ph ph-folder text-yellow-500"></i>HR 人力资源域
                                            </button>
                                            <button @click="selectCatalog({id: 'cat_hr_workflows', name: '审批流程'})" type="button"
                                                class="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded flex items-center gap-2 ml-8">
                                                <i class="ph ph-folder text-yellow-500"></i>审批流程
                                            </button>
                                            <button @click="selectCatalog({id: 'root_sre', name: 'SRE 运维域'})" type="button"
                                                class="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded flex items-center gap-2">
                                                <i class="ph ph-folder text-yellow-500"></i>SRE 运维域
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 新建目录弹窗 -->
                    <div v-if="showNewCatalogForm" class="fixed inset-0 bg-black/30 z-[10000] flex items-center justify-center" @click.self="cancelNewCatalog">
                        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
                            <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                                <h3 class="text-lg font-semibold text-slate-900">新建目录</h3>
                                <button @click="cancelNewCatalog" class="p-1 text-slate-400 hover:text-slate-600">
                                    <i class="ph ph-x text-xl"></i>
                                </button>
                            </div>
                            
                            <div class="p-6 space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-2">选择父目录 <span class="text-red-500">*</span></label>
                                    <div class="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                                        <button @click="selectNewCatalogParent({id: 'root_all', name: '全部'})" type="button"
                                            :class="['w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors border-b border-slate-100',
                                                     newCatalogParent?.id === 'root_all' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50']">
                                            <i class="ph ph-folder text-yellow-500"></i>
                                            <span>全部</span>
                                            <i v-if="newCatalogParent?.id === 'root_all'" class="ph-fill ph-check-circle text-indigo-600 ml-auto"></i>
                                        </button>
                                        <button @click="selectNewCatalogParent({id: 'root_data_warehouse', name: '数据仓库域'})" type="button"
                                            :class="['w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors border-b border-slate-100',
                                                     newCatalogParent?.id === 'root_data_warehouse' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50']">
                                            <i class="ph ph-folder text-yellow-500"></i>
                                            <span>数据仓库域</span>
                                            <i v-if="newCatalogParent?.id === 'root_data_warehouse'" class="ph-fill ph-check-circle text-indigo-600 ml-auto"></i>
                                        </button>
                                        <button @click="selectNewCatalogParent({id: 'root_hr', name: 'HR 域'})" type="button"
                                            :class="['w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors border-b border-slate-100',
                                                     newCatalogParent?.id === 'root_hr' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50']">
                                            <i class="ph ph-folder text-yellow-500"></i>
                                            <span>HR 域</span>
                                            <i v-if="newCatalogParent?.id === 'root_hr'" class="ph-fill ph-check-circle text-indigo-600 ml-auto"></i>
                                        </button>
                                        <button @click="selectNewCatalogParent({id: 'root_sre', name: 'SRE 运维域'})" type="button"
                                            :class="['w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors',
                                                     newCatalogParent?.id === 'root_sre' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50']">
                                            <i class="ph ph-folder text-yellow-500"></i>
                                            <span>SRE 运维域</span>
                                            <i v-if="newCatalogParent?.id === 'root_sre'" class="ph-fill ph-check-circle text-indigo-600 ml-auto"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-2">目录名称 <span class="text-red-500">*</span></label>
                                    <input v-model="newCatalogName" type="text" 
                                        placeholder="输入新目录名称"
                                        class="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                                </div>
                            </div>
                            
                            <div class="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                                <button @click="cancelNewCatalog" type="button"
                                    class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm">
                                    取消
                                </button>
                                <button @click="confirmNewCatalog" type="button"
                                    class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                                    确认
                                </button>
                            </div>
                        </div>
                    </div>

                    </div> <!-- End Content -->

                    <!-- Footer -->
                    <div class="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 flex-shrink-0">
                        <button @click="handleClose" 
                            class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm">
                            取消
                        </button>
                        <!-- VIEW 方式：逐步引导 -->
                        <button v-if="step === 2 && method === 'VIEW' && previewData" @click="$emit('next-step')" 
                            class="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm font-bold shadow-lg shadow-indigo-100">
                            下一步 <i class="ph ph-arrow-right"></i>
                        </button>
                        <button v-if="step === 3 && method === 'VIEW'" @click="$emit('next-step')" 
                            class="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm font-bold shadow-lg shadow-indigo-100">
                            下一步 <i class="ph ph-arrow-right"></i>
                        </button>
                        <button v-if="step === 4 && method === 'VIEW'" @click="handleSave" 
                            :disabled="!form.name || !form.chineseName || !form.targetCatalog"
                            :class="['px-5 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-bold shadow-lg',
                                     (!form.name || !form.chineseName || !form.targetCatalog) ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100']">
                            <i class="ph ph-check-circle"></i>完成创建
                        </button>

                        <!-- ONLINE 方式 Step 3：进入最终确认 -->
                        <button v-if="step === 3 && method === 'ONLINE'" @click="$emit('next-step')" 
                            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm">
                            下一步 <i class="ph ph-arrow-right"></i>
                        </button>
                        <!-- ONLINE 方式 Step 4：完成创建 -->
                        <button v-if="step === 4 && method === 'ONLINE'" @click="handleSave" 
                            :disabled="!form.targetCatalog"
                            :class="['px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm',
                                     !form.targetCatalog ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700']">
                            <i class="ph ph-check"></i>完成创建
                        </button>
                        <!-- EXCEL 方式 Step 2：进入元数据预览 -->
                        <button v-if="step === 2 && method === 'EXCEL' && form.selectedSheet" @click="$emit('preview')" 
                            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm">
                            下一步 <i class="ph ph-arrow-right"></i>
                        </button>
                        <!-- EXCEL 方式 Step 3：进入表信息输入 -->
                        <button v-if="step === 3 && method === 'EXCEL'" @click="$emit('next-step')" 
                            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm">
                            下一步 <i class="ph ph-arrow-right"></i>
                        </button>
                        <!-- EXCEL 方式 Step 4：完成创建 -->
                        <button v-if="step === 4 && method === 'EXCEL'" @click="handleSave" 
                            :disabled="!form.tableName || !form.targetCatalog || !form.clusterName"
                            :class="['px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm',
                                     (!form.tableName || !form.targetCatalog || !form.clusterName) ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700']">
                            <i class="ph ph-check"></i>完成创建
                        </button>
                    </div>
            </div>

</div>

`,

    EnumTreeItem: `
            <!-- 当前行 -->
            <tr class="border-b border-slate-200 hover:bg-slate-50 group">
                <!-- Code 列（带缩进和展开图标） -->
                <td class="py-3 px-4">
                    <div class="flex items-center gap-2" :style="{ paddingLeft: (depth * 24) + 'px' }">
                        <button v-if="enumItem.children && enumItem.children.length > 0" 
                            @click="isOpen = !isOpen"
                            class="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 flex-shrink-0">
                            <i :class="['ph ph-caret-right transition-transform', isOpen ? 'rotate-90' : '']"></i>
                        </button>
                        <span v-else class="w-5 flex-shrink-0"></span>
                        <code class="text-sm font-mono text-indigo-600">{{ enumItem.code }}</code>
                    </div>
                </td>
                <!-- Label 列 -->
                <td class="py-3 px-4">
                    <span class="text-sm text-slate-900">{{ enumItem.label }}</span>
                </td>
                <!-- Description 列 -->
                <td class="py-3 px-4">
                    <span class="text-sm text-slate-600">{{ enumItem.description || '—' }}</span>
                </td>
                <!-- 操作列 -->
                <td class="py-3 px-4 text-right">
                    <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button v-if="dictType === 'tree'" @click="$emit('add-child', enumItem)" 
                            class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                            title="添加子枚举">
                            <i class="ph ph-plus text-sm"></i>
                        </button>
                        <button @click="$emit('edit', enumItem)" 
                            class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="编辑">
                            <i class="ph ph-pencil-simple text-sm"></i>
                        </button>
                        <button @click="$emit('delete', enumItem)" 
                            class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="删除">
                            <i class="ph ph-trash text-sm"></i>
                        </button>
                    </div>
                </td>
            </tr>
            <!-- 子项（递归） -->
            <template v-if="isOpen && enumItem.children && enumItem.children.length > 0">
                <enum-tree-item 
                    v-for="child in enumItem.children" 
                    :key="child.id"
                    :enum-item="child"
                    :depth="depth + 1"
                    :dict-type="dictType"
                    @add-child="$emit('add-child', $event)"
                    @edit="$emit('edit', $event)"
                    @delete="$emit('delete', $event)">
                </enum-tree-item>
            </template>
    `,
    DetailDictionary: `
            <div class="h-full flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <!-- 版本管理栏（统一组件） -->
                <version-bar
                    :current-version="currentVersionData"
                    :versions="dictData.versions"
                    :extra-tags="[{
                        label: dictData.type === 'tree' ? '树状' : '单排',
                        class: dictData.type === 'tree' ? 'bg-purple-100 text-purple-700' : 'bg-cyan-100 text-cyan-700'
                    }]"
                    @switch-version="switchVersion"
                    @open-publish="openVersionPublish">
                </version-bar>
                
                <!-- Tab 栏 -->
                <div class="flex border-b border-slate-200 bg-slate-50/80 flex-shrink-0">
                    <button @click="activeTab = 'enums'"
                        :class="['px-5 py-3 text-sm font-medium border-b-2 transition-colors', 
                            activeTab === 'enums' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700']">
                        <i class="ph ph-list-bullets mr-1.5"></i>枚举项
                    </button>
                    <button @click="activeTab = 'tags'"
                        :class="['px-5 py-3 text-sm font-medium border-b-2 transition-colors', 
                            activeTab === 'tags' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700']">
                        <i class="ph ph-brackets-curly mr-1.5"></i>关联字段
                    </button>
                </div>

                <!-- 内容区域 -->
                <div class="flex-1 overflow-auto">
                    <!-- Tab: 枚举项 -->
                    <div v-show="activeTab === 'enums'" class="h-full flex flex-col p-5">
                        <div class="flex items-center justify-between mb-4">
                            <p class="text-sm text-slate-500">{{ dictData.type === 'tree' ? '支持层级结构的枚举项管理' : '单排列表的枚举项管理' }}</p>
                            <button @click="addRootEnum" 
                                class="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center gap-1">
                                <i class="ph ph-plus"></i>添加枚举
                            </button>
                        </div>
                        <div class="flex-1 overflow-auto border border-slate-200 rounded-lg bg-white">
                            <table class="w-full">
                                <thead class="bg-slate-50 border-b border-slate-200 sticky top-0">
                                    <tr>
                                        <th class="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Code</th>
                                        <th class="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Label</th>
                                        <th class="py-3 px-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Description</th>
                                        <th class="py-3 px-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider w-32">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <enum-tree-item 
                                        v-for="enumItem in enumTree" 
                                        :key="enumItem.id"
                                        :enum-item="enumItem"
                                        :depth="0"
                                        :dict-type="dictData.type"
                                        @add-child="addChildEnum"
                                        @edit="editEnum"
                                        @delete="confirmDeleteEnum">
                                    </enum-tree-item>
                                    <tr v-if="enumTree.length === 0">
                                        <td colspan="4" class="py-12 text-center text-slate-400">
                                            <i class="ph ph-list-bullets text-4xl mb-2 block"></i>
                                            <span class="text-sm">暂无枚举项</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Tab: 关联字段 -->
                    <div v-show="activeTab === 'tags'" class="h-full flex flex-col p-5">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex flex-col">
                                <p class="text-sm font-bold text-slate-800">直接关联字段</p>
                                <p class="text-xs text-slate-500">直接将字典映射到具体资产的字段上</p>
                            </div>
                            <button @click="openFieldSearch" 
                                class="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center gap-1 shadow-sm">
                                <i class="ph ph-plus-circle"></i>新增关联字段
                            </button>
                        </div>
                        
                        <!-- 直接关联字段列表 -->
                        <div class="mb-8 overflow-hidden border border-slate-200 rounded-xl bg-white shadow-sm">
                            <table class="w-full text-left border-collapse">
                                <thead class="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th class="px-4 py-3">字段名称</th>
                                        <th class="px-4 py-3">所属表/资产</th>
                                        <th class="px-4 py-3">字段类型</th>
                                        <th class="px-4 py-3">字段描述</th>
                                        <th class="px-4 py-3 text-right">操作</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <tr v-if="!appliedFields || appliedFields.length === 0">
                                        <td colspan="5" class="px-4 py-12 text-center text-slate-400 italic text-sm">暂无直接关联字段</td>
                                    </tr>
                                    <tr v-for="field in appliedFields" :key="field.id" class="hover:bg-slate-50 transition-colors group">
                                        <td class="px-4 py-3">
                                            <div class="flex items-center gap-2">
                                                <i class="ph ph-hash text-indigo-400"></i>
                                                <span class="text-sm font-semibold text-slate-900">{{ field.fieldName }}</span>
                                            </div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <div class="flex items-center gap-1.5 text-xs text-slate-600">
                                                <i class="ph ph-database text-slate-400"></i>
                                                {{ field.assetName }}
                                            </div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <span class="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono font-bold text-slate-500 uppercase">{{ field.fieldType }}</span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <span class="text-xs text-slate-500 line-clamp-1">{{ field.description || '—' }}</span>
                                        </td>
                                        <td class="px-4 py-3 text-right">
                                            <button @click="removeAppliedField(field.id)" class="p-1.5 text-slate-400 hover:text-rose-600 transition-colors">
                                                <i class="ph ph-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- 标签间接关联 (原有的关联标签逻辑) -->
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex flex-col">
                                <p class="text-sm font-bold text-slate-800">通过标签关联</p>
                                <p class="text-xs text-slate-500">通过治理标签作为桥梁，实现字典对一类字段的批量覆盖</p>
                            </div>
                            <button @click="showTagSelector = !showTagSelector" 
                                class="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm flex items-center gap-1">
                                <i class="ph ph-tag"></i>管理关联标签
                            </button>
                        </div>
                        <div class="flex-1 overflow-y-auto space-y-4">
                            <div v-if="associatedTags.length === 0" 
                                class="border border-slate-200 border-dashed rounded-xl bg-slate-50/50 p-10 text-center text-slate-400">
                                <i class="ph ph-tag-chevron text-4xl mb-2 opacity-30"></i>
                                <p class="text-sm">暂无关联标签</p>
                            </div>
                            <div v-for="tag in associatedTags" :key="tag" 
                                class="border border-slate-200 rounded-xl bg-white p-4 shadow-sm">
                                <div class="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                                    <div class="w-7 h-7 rounded bg-indigo-50 flex items-center justify-center">
                                        <i class="ph ph-tag text-indigo-600"></i>
                                    </div>
                                    <span class="flex-1 font-bold text-slate-800 text-sm">{{ tag }}</span>
                                    <button @click="toggleTagAssociation(tag)" 
                                        class="text-slate-400 hover:text-rose-600 transition-colors">
                                        <i class="ph ph-x-circle text-lg"></i>
                                    </button>
                                </div>
                                <div class="space-y-1.5">
                                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-2">匹配的字段：</div>
                                    <div v-for="field in getFieldsForTag(tag)" :key="field" 
                                        @click="navigateToField(field.split('.')[0], field.split('.')[1])"
                                        class="text-sm text-slate-600 hover:text-indigo-600 cursor-pointer flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 transition-all group">
                                        <i class="ph ph-arrow-square-out text-xs text-slate-300 group-hover:text-indigo-400"></i>
                                        <code class="font-mono text-[11px]">{{ field }}</code>
                                    </div>
                                    <div v-if="getFieldsForTag(tag).length === 0" 
                                        class="text-xs text-slate-400 italic px-2">暂无匹配字段</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 关联字段搜索 Modal -->
                <div v-if="showFieldSearchModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60]" @click.self="showFieldSearchModal = false">
                    <div class="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-2xl flex flex-col max-h-[80vh] overflow-hidden border border-slate-200">
                        <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
                            <h3 class="text-lg font-bold text-slate-900">关联字段到字典</h3>
                            <button @click="showFieldSearchModal = false" class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <i class="ph ph-x text-xl"></i>
                            </button>
                        </div>
                        
                        <div class="p-6 flex-1 flex flex-col min-h-0 bg-slate-50/30">
                            <!-- 步骤 1: 搜索并选择资产 -->
                            <div class="mb-6">
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-2">步骤 1: 搜索表/资产</label>
                                <div class="relative">
                                    <i class="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                    <input v-model="assetSearchQuery" type="text" 
                                        class="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white shadow-sm"
                                        placeholder="搜索资产名称，例如: employee_info">
                                </div>
                            </div>

                            <div v-if="assetSearchQuery && !selectedAsset" class="flex-1 overflow-y-auto mb-6 bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-sm">
                                <div v-if="filteredAssets.length === 0" class="p-8 text-center text-slate-400">
                                    <p class="text-sm">未找到匹配的资产</p>
                                </div>
                                <div v-for="asset in filteredAssets" :key="asset.id" 
                                    @click="selectAssetForFieldLink(asset)"
                                    class="px-4 py-3 hover:bg-indigo-50/50 cursor-pointer flex items-center gap-3 group transition-colors">
                                    <div class="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all">
                                        <i class="ph ph-database text-xl"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-bold text-slate-900 truncate">{{ asset.name }}</p>
                                        <p class="text-xs text-slate-500 truncate">{{ asset.description || '暂无描述' }}</p>
                                    </div>
                                    <i class="ph ph-caret-right text-slate-300"></i>
                                </div>
                            </div>

                            <!-- 步骤 2: 选择字段 -->
                            <div v-if="selectedAsset" class="flex-1 flex flex-col min-h-0">
                                <div class="mb-2 flex items-center justify-between">
                                    <label class="block text-xs font-bold text-slate-500 uppercase">步骤 2: 选择要关联的字段 ({{ selectedAsset.name }})</label>
                                    <button @click="selectedAsset = null" class="text-xs text-indigo-600 font-bold hover:underline">重新选择资产</button>
                                </div>
                                <div class="flex-1 overflow-y-auto bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-sm">
                                    <div v-for="f in assetFieldsForLinking" :key="f.name" 
                                        @click="toggleFieldSelection(f)"
                                        class="px-4 py-3 hover:bg-indigo-50/50 cursor-pointer flex items-center justify-between group transition-colors">
                                        <div class="flex items-center gap-3">
                                            <div :class="['w-5 h-5 rounded-md border flex items-center justify-center transition-all', 
                                                isFieldSelectedForLink(f) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 group-hover:border-indigo-400 bg-white']">
                                                <i v-if="isFieldSelectedForLink(f)" class="ph ph-check text-xs font-bold"></i>
                                            </div>
                                            <div class="min-w-0">
                                                <div class="flex items-center gap-2">
                                                    <span class="text-sm font-bold text-slate-900">{{ f.name }}</span>
                                                    <span class="px-1 py-0.5 rounded bg-slate-100 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tighter">{{ f.type }}</span>
                                                </div>
                                                <p class="text-[11px] text-slate-400 truncate">{{ f.description || '暂无描述' }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-white">
                            <button @click="showFieldSearchModal = false" 
                                class="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-bold transition-colors">取消</button>
                            <button @click="confirmFieldLink" 
                                :disabled="!selectedAsset || selectedFieldsForLink.length === 0"
                                class="px-8 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm font-bold shadow-md shadow-indigo-100 disabled:opacity-50 disabled:shadow-none transition-all">
                                确认关联 ({{ selectedFieldsForLink.length }})
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 枚举编辑 Modal -->
                <div v-if="showEnumModal" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div class="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
                        <div class="px-5 py-4 border-b border-slate-200">
                            <h3 class="text-lg font-semibold text-slate-900">
                                {{ editingEnum && !editingEnum.parent ? '编辑枚举' : '添加枚举' }}
                            </h3>
                        </div>
                        <div class="px-5 py-4 space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">Code *</label>
                                <input v-model="editForm.code" type="text" 
                                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                    placeholder="例如: POD_FAILED">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">Label *</label>
                                <input v-model="editForm.label" type="text" 
                                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                    placeholder="例如: Pod 启动失败">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                <textarea v-model="editForm.description" rows="3"
                                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                                    placeholder="描述信息，用于检索和索引"></textarea>
                            </div>
                        </div>
                        <div class="px-5 py-4 border-t border-slate-200 flex justify-end gap-2">
                            <button @click="showEnumModal = false" 
                                class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">取消</button>
                            <button @click="saveEnum" 
                                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">保存</button>
                        </div>
                    </div>
                </div>

                <!-- 删除确认 Modal -->
                <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div class="bg-white rounded-lg w-full max-w-sm mx-4 shadow-xl">
                        <div class="px-5 py-4">
                            <h3 class="text-lg font-semibold text-slate-900 mb-2">确认删除</h3>
                            <p class="text-sm text-slate-600">
                                确定要删除枚举项 <span class="font-medium">{{ enumToDelete?.label }}</span> 吗？
                                <span v-if="enumToDelete?.children?.length > 0" class="text-red-600">
                                    这将同时删除其所有子项。
                                </span>
                            </p>
                        </div>
                        <div class="px-5 py-4 border-t border-slate-200 flex justify-end gap-2">
                            <button @click="showDeleteConfirm = false" 
                                class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">取消</button>
                            <button @click="deleteEnum" 
                                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">删除</button>
                        </div>
                    </div>
                </div>

                <!-- 版本发布弹窗 -->
                <div v-if="showVersionPublish" class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" @click.self="showVersionPublish = false">
                    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
                        <div class="px-5 py-4 border-b border-slate-200">
                            <h3 class="text-lg font-semibold text-slate-900">发布版本到环境</h3>
                        </div>
                        <div class="p-5 space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">目标环境 *</label>
                                <div class="grid grid-cols-2 gap-3">
                                    <button @click="publishForm.environment = 'pre'" 
                                        :class="['px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all', 
                                            publishForm.environment === 'pre' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-blue-300 text-slate-700']">
                                        预发环境
                                    </button>
                                    <button @click="publishForm.environment = 'online'" 
                                        :class="['px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all', 
                                            publishForm.environment === 'online' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 hover:border-green-300 text-slate-700']">
                                        生产环境
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">发布说明</label>
                                <textarea v-model="publishForm.note" rows="3"
                                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                                    placeholder="简要描述本次发布的内容..."></textarea>
                            </div>
                        </div>
                        <div class="px-5 py-4 border-t border-slate-200 flex items-center justify-end gap-2">
                            <button @click="showVersionPublish = false"
                                class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                取消
                            </button>
                            <button @click="saveVersionPublish"
                                class="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                确认发布
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    `
};
