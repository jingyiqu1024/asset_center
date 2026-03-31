const { createApp, ref, computed } = Vue;
const { catalog, resourceTypeMap } = window.App.MockData;
const { getNodeIcon, getColor, getBgColor, getTypeLabel } = window.App.Utils;
const { TreeItem, DetailData, DetailDictionary, DetailDocument } = window.App.Components;

const app = createApp({
    setup() {
        const catalogTree = ref(catalog);
        // 查找并选中 2024 员工手册
        const findDocumentNode = (nodes) => {
            for (const node of nodes) {
                if (node.id === 'wiki_101') return node;
                if (node.children) {
                    const found = findDocumentNode(node.children);
                    if (found) return found;
                }
            }
            return null;
        };
        const documentNode = findDocumentNode(catalog) || catalogTree.value[0];
        const selectedNode = ref(documentNode);
        const showCreateMenu = ref(false);

        const selectNode = (node) => {
            selectedNode.value = node;
        };

        const toggleNode = (node) => {
            // Logic handled in component mutation of prop for this simple demo
        };

        const createItem = (type) => {
            alert(`Action: Create New ${type}`);
            showCreateMenu.value = false;
        };

        const currentDetailComponent = computed(() => {
            if (!selectedNode.value) return null;
            if (selectedNode.value.type === 'CATALOG') return 'CatalogView';

            switch (selectedNode.value.resourceType) {
                case 'DOCUMENT': return 'DetailDocument';
                case 'DATA_ASSET': return 'DetailData';
                case 'FUNCTION': return 'DetailFunction';
                case 'DICTIONARY': return 'DetailDictionary';
                default: return null;
            }
        });

        return {
            catalogTree,
            selectedNode,
            selectNode,
            toggleNode,
            getNodeIcon,
            getColor,
            getBgColor,
            getTypeLabel,
            showCreateMenu,
            createItem,
            currentDetailComponent
        };
    }
});

app.component('tree-item', TreeItem);
app.component('DetailDocument', window.App.Components.DetailDocument);
app.component('DetailData', DetailData);
app.component('DetailFunction', window.App.Components.DetailFunction);
app.component('DetailDictionary', DetailDictionary);

app.mount('#app');
