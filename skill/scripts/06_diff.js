/**
 * 步骤 6: 生成 Diff（替换模式）
 * 目标: 当用户选择替换模式时，生成详细的 diff 对比
 */

async function generateDiff(originalContent, newContent) {
  console.log('📊 正在生成变更对比...');

  const originalLines = originalContent.split('\n');
  const newLines = newContent.split('\n');
  const changes = computeChanges(originalLines, newLines);

  const stats = {
    linesAdded: changes.filter(c => c.type === 'add').length,
    linesRemoved: changes.filter(c => c.type === 'remove').length,
    linesModified: changes.filter(c => c.type === 'modify').length,
    totalChanges: changes.filter(c => c.type !== 'unchanged').length
  };

  console.log('\n变更统计:');
  console.log(`  + ${stats.linesAdded} 行新增`);
  console.log(`  - ${stats.linesRemoved} 行删除`);
  console.log(`  ~ ${stats.linesModified} 行修改`);

  displayDiffPreview(changes);

  return { changes, stats, originalContent, newContent };
}

function computeChanges(originalLines, newLines) {
  const changes = [];
  const maxLen = Math.max(originalLines.length, newLines.length);

  for (let i = 0; i < maxLen; i++) {
    const orig = originalLines[i];
    const next = newLines[i];

    if (orig === undefined) {
      changes.push({ type: 'add', content: next, lineNumber: i + 1 });
    } else if (next === undefined) {
      changes.push({ type: 'remove', content: orig, lineNumber: i + 1 });
    } else if (orig !== next) {
      changes.push({ type: 'modify', original: orig, new: next, lineNumber: i + 1 });
    } else {
      changes.push({ type: 'unchanged', content: orig, lineNumber: i + 1 });
    }
  }

  return changes;
}

function displayDiffPreview(changes) {
  console.log('\n详细变更预览（前20行）:');
  changes.slice(0, 20).forEach(change => {
    if (change.type === 'add') {
      console.log(`+ ${change.content}`);
    } else if (change.type === 'remove') {
      console.log(`- ${change.original || change.content}`);
    } else if (change.type === 'modify') {
      console.log(`- ${change.original}`);
      console.log(`+ ${change.new}`);
    }
  });

  if (changes.length > 20) {
    console.log(`\n... 还有 ${changes.length - 20} 处变更`);
  }
}
