#!/usr/bin/env python3
"""
生成 wiki_data.js 文件
读取 wiki_mock_data 目录下的所有 Wiki 数据并转换为 JavaScript 格式
"""

import json
import os
from pathlib import Path

def escape_js_string(s):
    """转义 JavaScript 字符串"""
    return s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

def read_wiki_data(wiki_dir):
    """读取单个 Wiki 的所有数据"""
    wiki_path = Path(wiki_dir)
    
    # 读取 .meta.json
    meta_file = wiki_path / '.meta.json'
    if not meta_file.exists():
        print(f"Warning: {meta_file} not found")
        return None
    
    with open(meta_file, 'r', encoding='utf-8') as f:
        meta = json.load(f)
    
    # 读取所有文档内容
    documents = {}
    
    def collect_files(nav_items):
        """递归收集所有文档文件路径"""
        files = []
        for item in nav_items:
            if 'file' in item and item['file']:
                files.append(item['file'])
            if 'children' in item and item['children']:
                files.extend(collect_files(item['children']))
        return files
    
    file_paths = collect_files(meta.get('navigation', []))
    
    # 读取每个文档的内容
    for file_path in file_paths:
        full_path = wiki_path / file_path
        if full_path.exists():
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
                documents[file_path] = content
        else:
            print(f"Warning: {full_path} not found")
    
    return {
        'meta': meta,
        'documents': documents
    }

def generate_wiki_data_js(wiki_mock_data_dir, output_file):
    """生成 wiki_data.js 文件"""
    wiki_mock_path = Path(wiki_mock_data_dir)
    
    # 收集所有 Wiki 数据
    all_wikis = {}
    
    # 遍历 wiki_mock_data 目录下的所有子目录
    for wiki_dir in wiki_mock_path.iterdir():
        if wiki_dir.is_dir() and not wiki_dir.name.startswith('.'):
            wiki_id = wiki_dir.name
            print(f"Processing wiki: {wiki_id}")
            wiki_data = read_wiki_data(wiki_dir)
            if wiki_data:
                all_wikis[wiki_id] = wiki_data
    
    # 生成 JavaScript 文件
    js_content = []
    js_content.append("// Auto-generated wiki data")
    js_content.append("// DO NOT EDIT MANUALLY - use generate_wiki_data.py to regenerate")
    js_content.append("")
    js_content.append("window.App = window.App || {};")
    js_content.append("window.App.WikiData = {};")
    js_content.append("")
    
    for wiki_id, wiki_data in all_wikis.items():
        js_content.append(f"// Wiki: {wiki_id}")
        js_content.append(f"window.App.WikiData['{wiki_id}'] = {{")
        
        # 元数据
        js_content.append("  meta: " + json.dumps(wiki_data['meta'], ensure_ascii=False, indent=2).replace('\n', '\n  ') + ",")
        
        # 文档内容
        js_content.append("  documents: {")
        for file_path, content in wiki_data['documents'].items():
            escaped_content = escape_js_string(content)
            js_content.append(f"    '{file_path}': `{escaped_content}`,")
        js_content.append("  }")
        
        js_content.append("};")
        js_content.append("")
    
    # 写入文件
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(js_content))
    
    print(f"Generated: {output_file}")
    print(f"Total wikis: {len(all_wikis)}")
    for wiki_id, wiki_data in all_wikis.items():
        print(f"  - {wiki_id}: {len(wiki_data['documents'])} documents")

if __name__ == '__main__':
    # 当前脚本所在目录
    script_dir = Path(__file__).parent
    
    # wiki_mock_data 目录
    wiki_mock_data_dir = script_dir / 'wiki_mock_data'
    
    # 输出文件路径
    output_file = script_dir / 'js' / 'wiki_data.js'
    
    generate_wiki_data_js(wiki_mock_data_dir, output_file)
