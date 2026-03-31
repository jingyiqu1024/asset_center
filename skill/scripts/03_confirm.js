/**
 * 步骤 3: 用户确认内容
 * 目标: 让用户确认总结内容是否正确，是否需要修改
 */

async function confirmContent(summary) {
  console.log('\n📋 内容总结如下:\n');
  displaySummary(summary);

  const options = [
    { label: "确认内容", description: "内容准确，继续下一步", isRecommended: true, value: "confirm" },
    { label: "修改内容", description: "需要调整部分内容", isRecommended: false, value: "edit" },
    { label: "重新生成", description: "重新分析并生成总结", isRecommended: false, value: "regenerate" }
  ];

  const choice = await ask_user_questions({
    questions: [{ question: "以上总结内容是否准确？", options }]
  });

  if (choice === 'confirm') {
    console.log('✅ 用户确认内容准确');
    return { confirmed: true, summary };
  }

  if (choice === 'edit') {
    const editedSummary = await allowUserEdit(summary);
    return { confirmed: true, summary: editedSummary, wasEdited: true };
  }

  if (choice === 'regenerate') {
    console.log('🔄 重新生成总结...');
    return { confirmed: false, shouldRegenerate: true };
  }
}

function displaySummary(summary) {
  console.log(`📌 标题: ${summary.title}`);
  console.log(`\n📄 概述:\n${summary.overview}`);

  if (summary.keyPoints?.length > 0) {
    console.log('\n🎯 核心要点:');
    summary.keyPoints.forEach((point, i) => console.log(`  ${i + 1}. ${point}`));
  }

  if (summary.decisions?.length > 0) {
    console.log('\n✅ 关键决策:');
    summary.decisions.forEach((d, i) => console.log(`  ${i + 1}. ${d.decision}`));
  }
}

async function allowUserEdit(summary) {
  const editOptions = [
    { label: "修改标题", value: "title" },
    { label: "修改概述", value: "overview" },
    { label: "修改核心要点", value: "keyPoints" },
    { label: "完成修改", value: "done" }
  ];

  let editing = true;
  while (editing) {
    const editChoice = await ask_user_questions({
      questions: [{ question: "您想修改哪部分？", options: editOptions }]
    });

    if (editChoice === 'done') {
      editing = false;
    } else {
      const newValue = await getUserTextInput(`请输入新的${editChoice}内容：`);
      summary[editChoice] = editChoice === 'keyPoints' ? newValue.split('\n').filter(l => l.trim()) : newValue;
    }
  }

  return summary;
}
