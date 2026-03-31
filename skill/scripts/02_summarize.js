/**
 * 步骤 2: 提取和总结核心内容
 * 目标: 从不同来源提取内容并生成描述性总结
 * 场景: A-上传文档 / B-对话记录 / C-直接输入
 */

// ==================== 场景 A: 上传文档总结 ====================

async function summarizeUploadedDocument(file) {
  console.log(`📄 正在分析上传的文档: ${file.name}`);

  let extractedContent = '';
  if (file.type.includes('pdf')) {
    extractedContent = await extractPdfContent(file);
  } else if (file.type.includes('word')) {
    extractedContent = await extractWordContent(file);
  }

  const structure = analyzeDocumentStructure(extractedContent);

  const summary = {
    title: file.name.replace(/\.[^/.]+$/, ''),
    overview: generateOverview(extractedContent),
    keyPoints: extractKeyPoints(extractedContent, 5),
    context: extractContext(extractedContent),
    conclusion: extractConclusion(extractedContent),
    metadata: {
      source: file.name,
      uploadedAt: new Date().toISOString(),
      extractedBy: currentUser.displayName
    }
  };

  console.log('✅ 文档分析完成');
  return summary;
}

function generateOverview(content) {
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
  const overview = paragraphs.slice(0, 3).join(' ');
  return overview.length > 300 ? overview.substring(0, 297) + '...' : overview;
}

function extractKeyPoints(content, maxPoints = 5) {
  const keyPoints = [];
  const listMatches = content.match(/(?:^|\n)[\d•\-*]\s*(.+)/g);
  if (listMatches) keyPoints.push(...listMatches.slice(0, maxPoints).map(m => m.trim()));

  const keywords = ['重要', '关键', '核心', '主要', '必须', '需要'];
  const sentences = content.split(/[。！？\n]/).filter(s => s.trim().length > 10);
  sentences.forEach(sentence => {
    if (keyPoints.length >= maxPoints) return;
    if (keywords.some(kw => sentence.includes(kw))) keyPoints.push(sentence.trim());
  });

  return keyPoints.slice(0, maxPoints);
}

// ==================== 场景 B: 对话记录总结 ====================

async function summarizeConversation() {
  console.log('💬 正在分析对话历史...');
  const conversation = await getConversationHistory();

  const analysis = {
    topic: extractMainTopic(conversation),
    discussions: [],
    decisions: [],
    keyPoints: [],
    participants: new Set()
  };

  conversation.forEach(message => {
    analysis.participants.add(message.sender);

    const discussion = extractDiscussionPoint(message.content);
    if (discussion) {
      analysis.discussions.push({ point: discussion, timestamp: message.timestamp, speaker: message.sender });
    }

    if (isDecision(message.content)) {
      analysis.decisions.push({ decision: extractDecision(message.content), timestamp: message.timestamp, decidedBy: message.sender });
    }

    const keyInfo = extractKeyInformation(message.content);
    if (keyInfo) analysis.keyPoints.push(keyInfo);
  });

  const summary = {
    title: `${analysis.topic} - 讨论总结`,
    overview: generateConversationOverview(analysis),
    discussionPoints: formatDiscussions(analysis.discussions),
    decisions: formatDecisions(analysis.decisions),
    keyTakeaways: analysis.keyPoints,
    metadata: {
      source: '对话历史',
      participants: Array.from(analysis.participants),
      messageCount: conversation.length,
      timeRange: { start: conversation[0].timestamp, end: conversation[conversation.length - 1].timestamp }
    }
  };

  console.log('✅ 对话分析完成');
  return summary;
}

function isDecision(content) {
  const decisionKeywords = ['决定', '确定', '选择', '采用', '使用', '最终', '批准', '同意', '通过'];
  return decisionKeywords.some(kw => content.includes(kw));
}

function generateConversationOverview(analysis) {
  const participantList = Array.from(analysis.participants).join('、');
  return `本次讨论由 ${participantList} 参与，主要围绕"${analysis.topic}"展开。` +
    `讨论中达成了 ${analysis.decisions.length} 项关键决策，` +
    `并明确了 ${analysis.keyPoints.length} 个核心要点。`;
}

// ==================== 场景 C: 直接文本输入 ====================

async function processDirectInput(userInput) {
  console.log('✍️ 正在处理用户输入的内容...');
  const contentType = detectContentType(userInput);

  let optimizedContent = '';
  if (contentType === 'structured') {
    optimizedContent = userInput;
  } else if (contentType === 'paragraph') {
    optimizedContent = formatParagraphs(userInput);
  } else if (contentType === 'list') {
    optimizedContent = formatList(userInput);
  }

  const summary = {
    title: extractTitle(userInput) || '用户提供的内容',
    content: optimizedContent,
    metadata: { source: '直接输入', inputBy: currentUser.displayName, timestamp: new Date().toISOString() }
  };

  console.log('✅ 内容处理完成');
  return summary;
}
