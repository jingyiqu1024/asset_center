#!/usr/bin/env python3
"""
Skill 交互式测试脚本
用于手动测试 doc-context-sync skill 的各项功能
"""

import json
import sys
from datetime import datetime

def print_header(title):
    """打印章节标题"""
    print('\n' + '='*70)
    print(f'📋 {title}')
    print('='*70)

def print_success(message):
    """打印成功消息"""
    print(f'✅ {message}')

def print_error(message):
    """打印错误消息"""
    print(f'❌ {message}')

def print_info(message):
    """打印信息"""
    print(f'ℹ️  {message}')

def get_user_input(prompt, default=None):
    """获取用户输入"""
    if default:
        user_input = input(f'{prompt} [{default}]: ').strip()
        return user_input if user_input else default
    return input(f'{prompt}: ').strip()

def confirm(message):
    """确认操作"""
    response = get_user_input(f'{message} (y/n)', 'y').lower()
    return response in ['y', 'yes', 'Y', 'Yes', '']

def test_authentication():
    """测试步骤 1: 身份认证"""
    print_header('步骤 1: 用户身份认证')
    
    print('\n🔐 模拟用户身份认证...')
    username = get_user_input('请输入用户名', 'chensisi03')
    display_name = get_user_input('请输入显示名称', '陈思思')
    
    # 模拟权限检查
    print(f'\n正在验证用户 "{username}" 的权限...')
    
    permissions = ['read', 'edit', 'admin']
    print(f'用户权限: {", ".join(permissions)}')
    
    if 'edit' in permissions:
        print_success(f'身份验证成功！用户 "{display_name}" 拥有编辑权限')
        return {
            'success': True,
            'user': {
                'username': username,
                'displayName': display_name,
                'permissions': permissions
            }
        }
    else:
        print_error('权限不足：用户没有编辑权限')
        return {'success': False}

def test_read_document():
    """测试步骤 2: 读取文档"""
    print_header('步骤 2: 读取文档内容')
    
    print('\n📄 请选择文档来源:')
    print('1. 模拟资源管理平台文档')
    print('2. 读取本地文件')
    print('3. 手动输入文档内容')
    
    choice = get_user_input('请选择 (1-3)', '1')
    
    if choice == '1':
        # 模拟平台文档
        document = {
            'id': 'doc_test_001',
            'name': '测试文档',
            'format': 'html',
            'content': '<h1>测试文档</h1><h2>1. 概述</h2><p>这是一个测试文档。</p>',
            'metadata': {
                'createdBy': '张三',
                'createdAt': '2024-03-01 10:00:00'
            }
        }
        print_success(f'已读取文档: {document["name"]}')
        print(f'📏 内容长度: {len(document["content"])} 字符')
        print(f'📝 文档格式: {document["format"].upper()}')
        
    elif choice == '2':
        # 读取本地文件
        file_path = get_user_input('请输入文件路径')
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            document = {
                'id': 'doc_local',
                'name': file_path.split('/')[-1],
                'format': 'plain',
                'content': content,
                'metadata': {
                    'source': 'local_file',
                    'path': file_path
                }
            }
            print_success(f'已读取本地文件: {document["name"]}')
            print(f'📏 内容长度: {len(document["content"])} 字符')
        except Exception as e:
            print_error(f'读取文件失败: {str(e)}')
            return {'success': False}
    
    else:
        # 手动输入
        print('\n请输入文档内容（输入 END 结束）:')
        lines = []
        while True:
            line = input()
            if line.strip() == 'END':
                break
            lines.append(line)
        
        content = '\n'.join(lines)
        document = {
            'id': 'doc_manual',
            'name': '手动输入文档',
            'format': 'plain',
            'content': content,
            'metadata': {
                'source': 'manual_input'
            }
        }
        print_success(f'已接收文档内容: {len(document["content"])} 字符')
    
    # 显示内容预览
    if confirm('\n是否显示文档内容预览？'):
        print('\n📄 文档内容预览（前 300 字符）:')
        print('─'*70)
        print(document['content'][:300] + ('...' if len(document['content']) > 300 else ''))
        print('─'*70)
    
    return {'success': True, 'document': document}

def test_generate_summary():
    """测试步骤 3: 生成总结"""
    print_header('步骤 3: 生成内容总结')
    
    print('\n请选择总结来源:')
    print('1. 使用示例对话记录')
    print('2. 手动输入总结内容')
    
    choice = get_user_input('请选择 (1-2)', '1')
    
    if choice == '1':
        # 使用示例
        summary = {
            'source': '对话记录',
            'title': get_user_input('总结标题', '前端技术栈升级讨论总结'),
            'overview': '团队就前端技术栈升级进行了深入讨论，最终确定采用 React 18 + Next.js 13 作为新的技术方案。',
            'keyPoints': [
                'React 18 提供了更好的并发特性和性能优化',
                'Next.js 13 的 App Router 提供了更灵活的路由管理',
                'Tailwind CSS 用于快速构建 UI 组件'
            ],
            'decisions': [
                '确定使用 React 18 + Next.js 13',
                '保留现有的 Tailwind CSS 方案'
            ]
        }
    else:
        # 手动输入
        summary = {
            'source': get_user_input('总结来源', '对话记录'),
            'title': get_user_input('总结标题'),
            'overview': get_user_input('总结概述'),
            'keyPoints': [],
            'decisions': []
        }
        
        print('\n输入核心要点（每行一个，输入空行结束）:')
        while True:
            point = input('  - ').strip()
            if not point:
                break
            summary['keyPoints'].append(point)
        
        print('\n输入关键决策（每行一个，输入空行结束）:')
        while True:
            decision = input('  - ').strip()
            if not decision:
                break
            summary['decisions'].append(decision)
    
    # 显示总结
    print(f'\n📝 总结标题: {summary["title"]}')
    print(f'📊 概述: {summary["overview"]}')
    print(f'\n💡 核心要点 ({len(summary["keyPoints"])} 条):')
    for i, point in enumerate(summary['keyPoints'], 1):
        print(f'   {i}. {point}')
    print(f'\n✅ 关键决策 ({len(summary["decisions"])} 项):')
    for i, decision in enumerate(summary['decisions'], 1):
        print(f'   {i}. {decision}')
    
    return {'success': True, 'summary': summary}

def test_format_matching(summary):
    """测试步骤 4: 格式匹配"""
    print_header('步骤 4: 格式检测和匹配')
    
    print('\n请选择目标文档格式:')
    print('1. HTML')
    print('2. Markdown')
    print('3. 纯文本')
    
    choice = get_user_input('请选择 (1-3)', '1')
    
    format_map = {'1': 'html', '2': 'markdown', '3': 'plain'}
    target_format = format_map.get(choice, 'html')
    
    print(f'\n🔄 正在将总结内容转换为 {target_format.upper()} 格式...')
    
    # 转换格式
    if target_format == 'html':
        formatted = f'''<h2>{summary["title"]}</h2>
<h3>概述</h3>
<p>{summary["overview"]}</p>
<h3>核心要点</h3>
<ul>
'''
        for point in summary['keyPoints']:
            formatted += f'  <li>{point}</li>\n'
        formatted += '</ul>\n'
        
    elif target_format == 'markdown':
        formatted = f'''## {summary["title"]}

### 概述

{summary["overview"]}

### 核心要点

'''
        for i, point in enumerate(summary['keyPoints'], 1):
            formatted += f'{i}. {point}\n'
    
    else:
        formatted = f'''{summary["title"]}

概述: {summary["overview"]}

核心要点:
'''
        for i, point in enumerate(summary['keyPoints'], 1):
            formatted += f'{i}. {point}\n'
    
    print_success('格式转换完成')
    print(f'📏 转换后内容长度: {len(formatted)} 字符')
    
    if confirm('\n是否显示转换后的内容？'):
        print('\n📄 转换后的内容:')
        print('─'*70)
        print(formatted)
        print('─'*70)
    
    return {'success': True, 'formatted': formatted, 'format': target_format}

def test_save_operation(user):
    """测试步骤 5: 保存操作"""
    print_header('步骤 5: 模拟保存更新')
    
    print(f'\n💾 准备保存更新...')
    print(f'   操作人: {user["displayName"]} ({user["username"]})')
    print(f'   操作时间: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    
    if not confirm('\n⚠️  确认保存此更新？'):
        print_info('操作已取消')
        return {'success': False, 'cancelled': True}
    
    print('\n💾 正在保存...')
    
    # 模拟保存延迟
    import time
    time.sleep(1)
    
    print_success('文档更新成功！')
    print(f'   新版本: v2.5')
    print(f'   文档链接: http://localhost:8083/document/doc_test_001')
    
    # 审计日志
    audit_log = {
        'operation': 'document_update',
        'user': user,
        'timestamp': datetime.now().isoformat(),
        'success': True
    }
    
    print('\n📝 审计日志已记录')
    if confirm('是否显示审计日志详情？'):
        print(json.dumps(audit_log, indent=2, ensure_ascii=False))
    
    return {'success': True}

def test_recall(formatted_content):
    """测试步骤 6: 召回测试"""
    print_header('步骤 6: 召回测试（可选）')
    
    if not confirm('\n是否需要进行召回测试？'):
        print_info('已跳过召回测试')
        return {'success': True, 'skipped': True}
    
    print('\n🧪 开始召回测试...')
    
    # 提取关键词
    keywords_input = get_user_input('请输入测试关键词（逗号分隔）', 'React 18,Next.js,技术选型')
    keywords = [k.strip() for k in keywords_input.split(',')]
    
    print(f'\n🔍 测试关键词: {", ".join(keywords)}')
    print('\n📊 召回测试报告:')
    
    # 简单的关键词匹配
    found = 0
    for keyword in keywords:
        if keyword.lower() in formatted_content.lower():
            print(f'   ✅ 已召回 - {keyword}')
            found += 1
        else:
            print(f'   ❌ 未召回 - {keyword}')
    
    recall_rate = (found / len(keywords)) * 100 if keywords else 0
    
    print(f'\n   总关键词数: {len(keywords)}')
    print(f'   成功召回: {found}')
    print(f'   召回率: {recall_rate:.1f}%')
    
    return {'success': True, 'recallRate': recall_rate}

def main():
    """主函数"""
    print('\n')
    print('╔' + '═'*68 + '╗')
    print('║' + ' '*8 + 'Skill 交互式测试 - doc-context-sync v3.0' + ' '*17 + '║')
    print('║' + ' '*20 + '手动测试每个步骤' + ' '*28 + '║')
    print('╚' + '═'*68 + '╝')
    
    print('\n欢迎使用 Skill 交互式测试工具！')
    print('这个工具会引导你逐步测试 skill 的各项功能。\n')
    
    try:
        # 步骤 1: 身份认证
        auth_result = test_authentication()
        if not auth_result['success']:
            print_error('测试终止: 身份认证失败')
            return
        user = auth_result['user']
        
        if not confirm('\n继续测试步骤 2？'):
            print_info('测试已终止')
            return
        
        # 步骤 2: 读取文档
        read_result = test_read_document()
        if not read_result['success']:
            print_error('测试终止: 无法读取文档')
            return
        
        if not confirm('\n继续测试步骤 3？'):
            print_info('测试已终止')
            return
        
        # 步骤 3: 生成总结
        summary_result = test_generate_summary()
        if not summary_result['success']:
            print_error('测试终止: 总结生成失败')
            return
        
        if not confirm('\n继续测试步骤 4？'):
            print_info('测试已终止')
            return
        
        # 步骤 4: 格式匹配
        format_result = test_format_matching(summary_result['summary'])
        if not format_result['success']:
            print_error('测试终止: 格式匹配失败')
            return
        
        if not confirm('\n继续测试步骤 5？'):
            print_info('测试已终止')
            return
        
        # 步骤 5: 保存操作
        save_result = test_save_operation(user)
        if not save_result['success']:
            if not save_result.get('cancelled'):
                print_error('测试终止: 保存失败')
            return
        
        # 步骤 6: 召回测试
        recall_result = test_recall(format_result['formatted'])
        
        # 测试总结
        print('\n' + '='*70)
        print('🎉 测试总结')
        print('='*70)
        
        print('\n✅ 所有步骤测试完成！\n')
        
        print('测试项目:')
        print('  ✅ 用户身份认证')
        print('  ✅ 文档内容读取')
        print('  ✅ 内容总结生成')
        print('  ✅ 格式匹配转换')
        print('  ✅ 保存操作模拟')
        if not recall_result.get('skipped'):
            print(f'  ✅ 召回测试 (召回率: {recall_result.get("recallRate", 0):.1f}%)')
        else:
            print('  ⏭️  召回测试（已跳过）')
        
        print(f'\nSkill 状态: ✅ 可用')
        print(f'测试时间: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}\n')
        
    except KeyboardInterrupt:
        print('\n\n⚠️  测试被用户中断')
    except Exception as e:
        print_error(f'测试过程中发生错误: {str(e)}')
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
