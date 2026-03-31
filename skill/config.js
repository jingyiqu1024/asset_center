/**
 * doc-context-sync skill 配置文件
 */

const config = {
  // 认证配置
  authentication: {
    method: 'sso',        // 'sso' | 'token' | 'oauth'
    tokenExpiry: 3600,    // Token 有效期（秒）
    autoRefresh: true
  },

  // 内容总结配置
  summary: {
    maxLength: 5000,      // 总结最大字符数
    keyPointsCount: 5,    // 核心要点数量
    includeMetadata: true
  },

  // Diff 配置
  diff: {
    contextLines: 3,      // 上下文行数
    ignoreWhitespace: false,
    showLineNumbers: true
  },

  // 召回测试配置
  recallTest: {
    defaultBehavior: 'ask',  // 'ask' | 'auto' | 'skip'
    keywordCount: 8,
    waitTime: 3000           // 等待索引更新时间（毫秒）
  },

  // 安全配置
  security: {
    requireConfirmation: true,  // 保存前需要确认
    logAllOperations: true,
    createBackup: true,
    maxBackups: 10
  }
};

module.exports = config;
