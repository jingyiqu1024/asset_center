window.App = window.App || {};
window.App.Utils = {};

const { resourceTypeMap } = window.App.MockData;

window.App.Utils.getNodeIcon = (node) => {
    if (node.type === 'CATALOG') return 'ph-folder-open';
    switch (node.resourceType) {
        case 'DOCUMENT': return 'ph-file-text';
        case 'DATA_ASSET': return 'ph-database';
        case 'FUNCTION': return 'ph-code';
        case 'PAGE_CARD': return 'ph-layout';
        case 'SKILL': return 'ph-lightning';
        case 'DICTIONARY': return 'ph-list-bullets';
        default: return 'ph-file';
    }
};

window.App.Utils.getColor = (node) => {
    if (node.type === 'CATALOG') return 'text-yellow-500';
    switch (node.resourceType) {
        case 'DOCUMENT': return 'text-orange-600';
        case 'DATA_ASSET': return 'text-blue-600';
        case 'FUNCTION': return 'text-purple-600';
        case 'PAGE_CARD': return 'text-pink-600';
        case 'SKILL': return 'text-emerald-600';
        case 'DICTIONARY': return 'text-cyan-600';
        default: return 'text-slate-600';
    }
};

window.App.Utils.getBgColor = (node) => {
    if (node.type === 'CATALOG') return 'bg-yellow-50 border-yellow-100';
    switch (node.resourceType) {
        case 'DOCUMENT': return 'bg-orange-50 border-orange-100';
        case 'DATA_ASSET': return 'bg-blue-50 border-blue-100';
        case 'FUNCTION': return 'bg-purple-50 border-purple-100';
        case 'PAGE_CARD': return 'bg-pink-50 border-pink-100';
        case 'SKILL': return 'bg-emerald-50 border-emerald-100';
        case 'DICTIONARY': return 'bg-cyan-50 border-cyan-100';
        default: return 'bg-slate-50 border-slate-100';
    }
};

window.App.Utils.getTypeLabel = (node) => {
    if (node.type === 'CATALOG') return '文件夹';
    return resourceTypeMap[node.resourceType] || node.resourceType;
};
