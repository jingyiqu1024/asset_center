/**
 * 步骤 9: 可选召回测试
 * 目标: 根据用户意愿决定是否进行召回测试
 */

async function offerRecallTest(updateResult, updatedContent) {
  const options = [
    { label: "跳过测试", description: "直接完成，不进行测试", isRecommended: true, value: "no" },
    { label: "需要测试", description: "验证更新内容的可检索性", isRecommended: false, value: "yes" }
  ];

  const choice = await ask_user_questions({
    questions: [{ question: "是否需要进行召回测试？", options }]
  });

  if (choice === "no") {
    console.log('✅ 文档更新完成！');
    return { skipped: true };
  }

  console.log('\n🧪 开始召回测试...\n');
  await sleep(3000); // 等待索引更新

  const keywords = extractTestKeywords(updatedContent);
  console.log(`🔍 测试关键词: ${keywords.join(', ')}`);

  const searchResults = await searchInDocument(updateResult.documentUrl, keywords);

  const recallStats = { totalKeywords: keywords.length, foundKeywords: 0, recallRate: 0, details: [] };
  keywords.forEach(keyword => {
    const found = searchResults.some(r => r.content.includes(keyword));
    recallStats.foundKeywords += found ? 1 : 0;
    recallStats.details.push({ keyword, status: found ? '✅ 已召回' : '❌ 未召回' });
  });
  recallStats.recallRate = (recallStats.foundKeywords / recallStats.totalKeywords) * 100;

  console.log('\n📊 召回测试报告:');
  console.log(`总关键词数: ${recallStats.totalKeywords}`);
  console.log(`成功召回: ${recallStats.foundKeywords}`);
  console.log(`召回率: ${recallStats.recallRate.toFixed(1)}%\n`);
  recallStats.details.forEach(d => console.log(`  ${d.status} - ${d.keyword}`));

  // 互动问答测试
  console.log('\n🤔 互动问答测试:');
  const testQuestions = [
    "刚才更新的内容主要讲了什么？",
    "文档中提到了哪些关键点？",
    "有什么新的决策或建议吗？"
  ];
  for (const q of testQuestions) {
    console.log(`\nQ: ${q}`);
    const answer = await searchAndAnswer(updateResult.documentUrl, q, updatedContent);
    console.log(`A: ${answer}`);
  }

  console.log('\n✅ 召回测试完成！');
  return { completed: true, stats: recallStats };
}

function extractTestKeywords(content) {
  const keywords = new Set();
  const headings = content.match(/#{1,6}\s+(.+)|<h[1-6]>(.+?)<\/h[1-6]>/g);
  if (headings) {
    headings.forEach(h => {
      const text = h.replace(/#{1,6}\s+|<\/?h[1-6]>/g, '');
      text.split(/\s+/).forEach(w => { if (w.length > 2) keywords.add(w); });
    });
  }

  const words = content.split(/[\s\n,.，。]+/);
  const wordFreq = {};
  words.forEach(word => {
    const cleaned = word.replace(/[^\w\u4e00-\u9fa5]/g, '');
    if (cleaned.length > 1) wordFreq[cleaned] = (wordFreq[cleaned] || 0) + 1;
  });
  Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 5).forEach(([w]) => keywords.add(w));

  return Array.from(keywords).slice(0, 8);
}
