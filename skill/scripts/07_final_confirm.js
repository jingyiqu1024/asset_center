/**
 * 步骤 7: 最终确认
 * 目标: 向用户展示最终的变更内容和格式，获得确认后保存
 */

async function getFinalConfirmation(updatePlan, userAuth) {
  console.log('\n⚠️  最终确认\n');
  console.log(`📄 文档: ${updatePlan.document.name}`);
  console.log(`📝 操作: ${getModeLabel(updatePlan.mode)}`);
  if (updatePlan.location) console.log(`📍 位置: ${updatePlan.location.title}`);
  console.log(`👤 操作人: ${userAuth.user.displayName} (将被记录到操作日志)`);
  console.log('\n📋 变更内容预览:');
  console.log(updatePlan.formattedContent.substring(0, 500) + (updatePlan.formattedContent.length > 500 ? '...' : ''));

  if (updatePlan.diffResult) {
    console.log('\n📊 变更统计:');
    console.log(`  + ${updatePlan.diffResult.stats.linesAdded} 行新增`);
    console.log(`  - ${updatePlan.diffResult.stats.linesRemoved} 行删除`);
    console.log(`  ~ ${updatePlan.diffResult.stats.linesModified} 行修改`);
  }

  const options = [
    { label: "确认保存", description: `将以 "${userAuth.user.displayName}" 的身份保存`, isRecommended: true, value: "confirm" },
    { label: "取消操作", description: "放弃本次更新", isRecommended: false, value: "cancel" }
  ];

  const choice = await ask_user_questions({
    questions: [{ question: `⚠️ 此操作将记录操作人为 "${userAuth.user.displayName}"，确认继续吗？`, options }]
  });

  if (choice === 'confirm') {
    console.log('✅ 用户确认保存');
    return { confirmed: true };
  }

  console.log('❌ 操作已取消');
  return { confirmed: false };
}

function getModeLabel(mode) {
  const labels = {
    'append': '追加到文档末尾',
    'insert': '插入到指定章节后',
    'replace': '替换指定章节内容'
  };
  return labels[mode] || mode;
}
