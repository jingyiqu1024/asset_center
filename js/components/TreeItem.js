(function () {
    const { getNodeIcon, getColor } = window.App.Utils;
    
    window.TreeItem = {
        name: 'TreeItem',
        template: window.AppTemplates.TreeItem,
        props: {
            node: Object,
            depth: { type: Number, default: 0 },
            selectedId: String
        },
        emits: ['select', 'toggle', 'rename'],
        setup(props, { emit }) {
            const isOpen = Vue.computed(() => props.node.isOpen);
            const isSelected = Vue.computed(() => props.selectedId === props.node.id);
            const nodeIcon = Vue.computed(() => getNodeIcon(props.node));
            const iconColor = Vue.computed(() => {
                if (props.node.type === 'CATALOG') return 'text-slate-500 group-hover:text-slate-300';
                return getColor(props.node);
            });
            const toggle = () => {
                if (props.node.type === 'CATALOG') props.node.isOpen = !props.node.isOpen;
            };
            const handleClick = () => emit('select', props.node);
            return { isOpen, isSelected, nodeIcon, iconColor, toggle, handleClick };
        }
    };
})();