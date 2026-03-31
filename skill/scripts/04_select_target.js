/**
 * 步骤 4: 选择更新位置和模式
 * 目标: 确定内容要更新到文档的哪里，以及用什么方式
 */

async function selectUpdateTarget(document) {
  console.log('\n📍 请选择更新位置和模式\n');

  // 第一步：选择更新模式
  const modeOptions = [
    { label: "追加到末尾", description: "在文档末尾添加新内容", isRecommended: true, value: "append" },
    { label: "插入到指定章节后", description: "在某章节后插入内容", isRecommended: false, value: "insert" },
    { label: "替换现有内容", description: "替换指定章节的内容", isRecommended: false, value: "replace" }
  ];

  const mode = await ask_user_questions({
    questions: [{ question: "您希望如何更新文档？", options: modeOptions }]
  });

  let location = null;
  if (mode === 'insert' || mode === 'replace') {
    const sections = await getDocumentSections(document.id);
    const sectionOptions = sections.map(s => ({
      label: s.title,
      description: `第 ${s.level} 级标题，${s.charCount} 字`,
      value: s.id
    }));

    const sectionId = await ask_user_questions({
      questions: [{ question: `请选择${mode === 'insert' ? '插入位置' : '要替换的章节'}：`, options: sectionOptions }]
    });

    location = sections.find(s => s.id === sectionId);
  }

  console.log(`✅ 已选择：${getModeLabel(mode)}${location ? ` - ${location.title}` : ''}`);
  return { mode, location };
}

async function getDocumentSections(documentId) {
  const response = await fetch(`/api/documents/${documentId}/sections`, {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  return await response.json();
}

function getModeLabel(mode) {
  const labels = {
    'append': '追加到末尾',
    'insert': '插入模式 - 在指定章节后插入',
    'replace': '替换模式 - 替换现有内容'
  };
  return labels[mode] || mode;
}
