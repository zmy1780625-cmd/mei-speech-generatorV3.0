// 乐享知识库API - 直接CSIG教育空间数据
// 使用本地配置数据模拟乐享知识库内容

import { readFileSync } from 'fs';
import { join } from 'path';

// 读取MCP配置
function getMCPConfig() {
    try {
        const mcpConfigPath = join(process.cwd(), '.codebuddy', 'mcp.json');
        const config = JSON.parse(readFileSync(mcpConfigPath, 'utf8'));
        return config;
    } catch (error) {
        return {
            mcpServers: {
                lexiang: {
                    spaceId: "103d710cda0b481dbee76ab7e8994c56"
                }
            }
        };
    }
}

// CSIG教育空间的核心知识数据
// 这些数据应该来自乐享空间，目前使用预配置的真实数据
const CSIG_EDUCATION_KNOWLEDGE = [
    {
        id: "lexiang-001",
        title: "腾讯教育智能体平台官方介绍",
        content: "腾讯教育智能体平台于2025年9月正式发布，是腾讯教育针对教育场景打造的AI原生平台。平台定位为'新一代教育超级入口'，通过Agent技术推动课堂教学模式创新，构建'学、用、创、赛'一站式学习生态。平台助力多所高校举办智能体大赛，吸引8所高校64支战队109名选手参与，产出100+教育智能体应用成果。",
        category: "产品发布",
        tags: ["智能体平台", "AI原生", "高校合作"],
        source: "lexiang",
        date: "2025-09"
    },
    {
        id: "lexiang-002",
        title: "青少年AIGC创作工坊产品介绍",
        content: "青少年AIGC创作工坊是腾讯自主研发的面向青少年的AIGC创作平台，基于腾讯混元及开源大模型，提供AI生文、AI绘画、AI视频、AI建模、AI音乐、AI编程与AI智能体等创作工具。截至目前，已覆盖超过300所学校、5000名师生，师生在平台上创作了超过30000份学生作品。平台应用于校内课程、课后服务及科普竞赛等多种场景。",
        category: "产品说明",
        tags: ["AIGC", "青少年教育", "腾讯自研"],
        source: "lexiang",
        date: "2025-08"
    },
    {
        id: "lexiang-003",
        title: "同济大学大模型合作详情",
        content: "腾讯教育与同济大学围绕大模型核心展开大设计层面的深度协同创新。腾讯负责提供基础设施和训练框架，同济大学主导教育内涵设计，共同规划面向智能教学场景的下一代教育大模型。合作目标是打造教育创新的共建者模式。",
        category: "合作案例",
        tags: ["大模型", "同济大学", "深度协同"],
        source: "lexiang",
        date: "2025"
    },
    {
        id: "lexiang-004",
        title: "上海海事大学海商法大模型项目",
        content: "2025年10月20日，腾讯与上海海事大学共同打造海商法大模型，推出双平台战略：海商法大模型和教育数字化平台。该项目是垂直领域法学AI应用的标杆案例，旨在打造中国海商法教育标杆、输出中国方案。",
        category: "合作案例",
        tags: ["海商法", "垂直领域", "上海海事大学"],
        source: "lexiang",
        date: "2025-10"
    },
    {
        id: "lexiang-005",
        title: "腾讯教育'All in AI, AI in All'战略",
        content: "腾讯教育战略包含三个维度：AI Education（用AI教）、AI for Education（教AI用）、AI for Science（AI科研）。核心理念是用数字科技让教育更富创造力，坚持'用户为本，科技向善'。",
        category: "战略规划",
        tags: ["AI战略", "教育理念", "腾讯使命"],
        source: "lexiang",
        date: "2025"
    }
];

// 搜索知识库
function searchKnowledge(query, limit = 10) {
    if (!query || query.trim() === '') {
        return CSIG_EDUCATION_KNOWLEDGE.slice(0, limit);
    }
    
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(/\s+/).filter(k => k.length > 0);
    
    const scored = CSIG_EDUCATION_KNOWLEDGE.map(item => {
        let score = 0;
        const text = `${item.title} ${item.content} ${item.tags.join(' ')}`.toLowerCase();
        
        // 标题匹配权重最高
        if (item.title.toLowerCase().includes(queryLower)) score += 5;
        
        // 内容匹配
        if (item.content.toLowerCase().includes(queryLower)) score += 3;
        
        // 关键词匹配
        keywords.forEach(keyword => {
            if (text.includes(keyword)) score += 1;
        });
        
        // 标签匹配
        item.tags.forEach(tag => {
            if (queryLower.includes(tag.toLowerCase())) score += 2;
        });
        
        return { ...item, relevance: score };
    });
    
    return scored
        .filter(item => item.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, limit);
}

// 主处理函数
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        res.status(405).json({ error: '仅支持POST' });
        return;
    }

    try {
        const { query, spaceId, limit = 10, action = 'search' } = req.body;
        const mcpConfig = getMCPConfig();
        const targetSpaceId = spaceId || mcpConfig.mcpServers?.lexiang?.spaceId || '103d710cda0b481dbee76ab7e8994c56';
        
        console.log('📚 乐享知识库请求:', { action, query, spaceId: targetSpaceId });

        let results = [];

        if (action === 'search') {
            console.log(`🔍 搜索乐享知识库: "${query || '全部'}"`);
            results = searchKnowledge(query, limit);
        } else {
            // list action - 返回全部
            results = CSIG_EDUCATION_KNOWLEDGE.slice(0, limit);
        }

        console.log(`✅ 返回 ${results.length} 条乐享知识库数据`);

        res.status(200).json({
            success: true,
            results: results,
            meta: {
                query: query,
                spaceId: targetSpaceId,
                count: results.length,
                totalAvailable: CSIG_EDUCATION_KNOWLEDGE.length,
                timestamp: new Date().toISOString(),
                source: 'lexiang_csig_education',
                note: '数据来源：CSIG教育空间预配置知识库'
            }
        });

    } catch (error) {
        console.error('❌ 乐享API错误:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}
