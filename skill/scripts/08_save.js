/**
 * 步骤 8: 保存更新
 * 目标: 执行文档更新并记录修改信息
 */

async function saveDocumentUpdate(updatePlan, userAuth) {
  console.log('💾 正在保存更新...');

  try {
    const updateRequest = {
      documentId: updatePlan.document.id,
      mode: updatePlan.mode,
      content: updatePlan.formattedContent,
      location: updatePlan.location,
      metadata: {
        modifiedBy: {
          userId: userAuth.user.id,
          username: userAuth.user.username,
          displayName: userAuth.user.displayName
        },
        modifiedAt: new Date().toISOString(),
        source: updatePlan.contentSource,
        changeType: updatePlan.mode,
        changeStats: updatePlan.diffResult?.stats || {
          linesAdded: countLines(updatePlan.formattedContent)
        }
      }
    };

    const response = await fetch(`/api/documents/${updatePlan.document.id}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userAuth.token}`
      },
      body: JSON.stringify(updateRequest)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`保存失败: ${error.message}`);
    }

    const result = await response.json();

    console.log('✅ 文档更新成功！');
    console.log(`📄 文档链接: ${result.documentUrl}`);
    console.log(`🕐 版本号: ${result.version}`);
    console.log(`👤 修改人: ${userAuth.user.displayName}`);

    await logUpdateHistory({
      documentId: updatePlan.document.id,
      documentName: updatePlan.document.name,
      operation: updatePlan.mode,
      modifiedBy: userAuth.user.displayName,
      timestamp: new Date().toISOString(),
      changes: updatePlan.diffResult?.stats,
      versionId: result.version
    });

    return { success: true, documentUrl: result.documentUrl, version: result.version, timestamp: result.timestamp };

  } catch (error) {
    console.error('❌ 保存失败:', error);
    return { success: false, error: error.message };
  }
}

// 重试机制
async function saveWithRetry(updatePlan, userAuth, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await saveDocumentUpdate(updatePlan, userAuth);
      return result;
    } catch (error) {
      console.error(`❌ 保存失败 (第 ${attempt}/${maxRetries} 次):`, error.message);
      if (attempt < maxRetries) {
        console.log(`⏳ ${attempt} 秒后重试...`);
        await sleep(attempt * 1000);
      } else {
        console.log('❌ 已达到最大重试次数，保存失败');
        throw error;
      }
    }
  }
}

// 记录修改历史
async function logUpdateHistory(record) {
  const historyEntry = { ...record, loggedAt: new Date().toISOString() };
  await appendToFile('.agent-history/document-updates.json', JSON.stringify(historyEntry, null, 2) + ',\n');
  console.log('📝 修改记录已保存');
}

function countLines(content) {
  return (content.match(/\n/g) || []).length + 1;
}
