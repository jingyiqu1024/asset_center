/**
 * 步骤 5: 格式匹配和内容转换
 * 目标: 检测原始文档格式，将更新内容转换为匹配的格式
 */

async function matchAndConvertFormat(document, summary, location) {
  console.log('🔄 正在检测文档格式并转换内容...');

  // 1. 检测文档格式
  const docFormat = detectDocumentFormat(document);
  console.log(`📋 检测到文档格式: ${docFormat.type}`);

  // 2. 获取周边内容作为格式参考
  const contextContent = location
    ? await getSectionContent(document.id, location.id)
    : await getDocumentTail(document.id, 500);

  // 3. 分析格式特征
  const formatFeatures = analyzeFormatFeatures(contextContent, docFormat);

  // 4. 转换内容
  let formattedContent;
  switch (docFormat.type) {
    case 'html':
      formattedContent = convertToHtml(summary, formatFeatures);
      break;
    case 'markdown':
      formattedContent = convertToMarkdown(summary, formatFeatures);
      break;
    case 'plain':
      formattedContent = convertToPlainText(summary, formatFeatures);
      break;
    default:
      formattedContent = convertToHtml(summary, formatFeatures);
  }

  console.log('✅ 格式转换完成');
  return { formattedContent, docFormat, formatFeatures };
}

function detectDocumentFormat(document) {
  const content = document.content || '';
  if (/<[a-z][\s\S]*>/i.test(content)) return { type: 'html', confidence: 0.9 };
  if (/#{1,6}\s|\*\*|__|\[.*\]\(.*\)/.test(content)) return { type: 'markdown', confidence: 0.8 };
  return { type: 'plain', confidence: 1.0 };
}

function analyzeFormatFeatures(contextContent, docFormat) {
  const features = { headingStyle: 'h2', listStyle: 'ul', hasEmphasis: false, indentSize: 2 };

  if (docFormat.type === 'html') {
    features.headingStyle = contextContent.match(/<h([1-6])/)?.[1] ? `h${contextContent.match(/<h([1-6])/)[1]}` : 'h2';
    features.listStyle = contextContent.includes('<ul>') ? 'ul' : 'ol';
    features.hasEmphasis = contextContent.includes('<strong>') || contextContent.includes('<em>');
  } else if (docFormat.type === 'markdown') {
    const headingMatch = contextContent.match(/^(#{1,6})\s/m);
    features.headingStyle = headingMatch ? headingMatch[1] : '##';
    features.listStyle = contextContent.match(/^[-*]\s/m) ? 'dash' : 'number';
  }

  return features;
}

function convertToHtml(summary, features) {
  const tag = features.headingStyle || 'h2';
  let html = `<${tag}>${summary.title}</${tag}>\n`;

  if (summary.overview) html += `<p>${summary.overview}</p>\n`;

  if (summary.keyPoints?.length > 0) {
    html += `<${tag === 'h2' ? 'h3' : 'h4'}>核心要点</${tag === 'h2' ? 'h3' : 'h4'}>\n<ul>\n`;
    summary.keyPoints.forEach(pt => { html += `  <li>${pt}</li>\n`; });
    html += `</ul>\n`;
  }

  if (summary.decisions?.length > 0) {
    html += `<${tag === 'h2' ? 'h3' : 'h4'}>关键决策</${tag === 'h2' ? 'h3' : 'h4'}>\n<ol>\n`;
    summary.decisions.forEach(d => { html += `  <li>${d.decision || d}</li>\n`; });
    html += `</ol>\n`;
  }

  if (summary.metadata) {
    html += `<p><small>更新时间：${new Date().toLocaleString('zh-CN')} · 更新人：${summary.metadata.inputBy || summary.metadata.extractedBy || '当前用户'}</small></p>\n`;
  }

  return html;
}

function convertToMarkdown(summary, features) {
  const heading = features.headingStyle || '##';
  let md = `${heading} ${summary.title}\n\n`;
  if (summary.overview) md += `${summary.overview}\n\n`;

  if (summary.keyPoints?.length > 0) {
    md += `${heading}# 核心要点\n\n`;
    summary.keyPoints.forEach(pt => { md += `- ${pt}\n`; });
    md += '\n';
  }

  return md;
}

function convertToPlainText(summary, features) {
  let text = `${summary.title}\n${'='.repeat(summary.title.length)}\n\n`;
  if (summary.overview) text += `${summary.overview}\n\n`;
  if (summary.keyPoints?.length > 0) {
    text += '核心要点:\n';
    summary.keyPoints.forEach((pt, i) => { text += `  ${i + 1}. ${pt}\n`; });
  }
  return text;
}
