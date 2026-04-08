// 简化版乐享API - 直接HTTP请求
// 不依赖MCP协议，直接调用乐享API

// 乐享API基础URL
const LEXIANG_API_BASE = 'https://api.lexiangla.com/v1';

export default async function handler(req, res) {
    // 启用CORS
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
        const { query, spaceId, limit = 10 } = req.body;
        const targetSpaceId = spaceId || '103d710cda0b481dbee76ab7e8994c56';
        
        console.log('📚 乐享API请求:', { query, spaceId: targetSpaceId });

        // 方案1: 尝试直接调用乐享开放API（如果有）
        // 由于乐享API可能需要认证，这里尝试几种方式
        
        // 尝试调用乐享搜索API
        const searchUrl = `${LEXIANG_API_BASE}/spaces/${targetSpaceId}/search?q=${encodeURIComponent(query || '')}&limit=${limit}`;
        
        console.log('🔍 尝试调用:', searchUrl);
        
        let results = [];
        let apiError = null;
        
        try {
            const response = await fetch(searchUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'SpeechGenerator/1.0'
                },
                timeout: 10000
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ 乐享API调用成功');
                results = formatResults(data);
            } else {
                apiError = `API返回状态: ${response.status}`;
                console.log('⚠️ 乐享API错误:', apiError);
            }
        } catch (fetchError) {
            apiError = fetchError.message;
            console.log('⚠️ 乐享API调用失败:', apiError);
        }
        
        // 如果API调用失败，返回模拟数据用于测试
        if (results.length === 0) {
            console.log('⚠️ 使用测试数据');
            results = getTestData();
        }
        
        res.status(200).json({
            success: true,
            results: results,
            meta: {
                query: query,
                spaceId: targetSpaceId,
                count: results.length,
                timestamp: new Date().toISOString(),
                source: 'lexiang_api',
                apiError: apiError || null,
                isTestData: results[0]?.isTest || false
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

// 格式化API结果
function formatResults(data) {
    if (!data || !Array.isArray(data.results)) return [];
    
    return data.results.map((item, index) => ({
        id: `lexiang-${index}`,
        title: item.title || '未命名',
        content: item.summary || item.content || '',
        url: item.url || item.link || '',
        source: 'lexiang',
        relevance: 0.8,
        updatedAt: item.updated_at || new Date().toISOString()
    }));
}

// 测试数据 - 用于验证API通路
function getTestData() {
    return [
        {
            id: 'lexiang-test-1',
            title: '腾讯教育智能体平台实践案例',
            content: '腾讯教育智能体平台于2025年9月正式发布，面向高校提供AI智能体应用平台。目前已有8所高校、64支战队、109名选手参与，产出100+教育智能体应用。',
            url: 'https://csig.lexiangla.com/spaces/103d710cda0b481dbee76ab7e8994c56',
            source: 'lexiang',
            relevance: 0.9,
            updatedAt: '2025-03-01',
            isTest: true
        },
        {
            id: 'lexiang-test-2',
            title: '青少年AIGC创作工坊推广计划',
            content: '青少年AIGC创作工坊是腾讯自主研发的面向青少年的AIGC创作平台，已覆盖超过300所学校、5000名师生，师生创作了超过30000份学生作品。',
            url: 'https://csig.lexiangla.com/spaces/103d710cda0b481dbee76ab7e8994c56',
            source: 'lexiang',
            relevance: 0.85,
            updatedAt: '2025-02-15',
            isTest: true
        },
        {
            id: 'lexiang-test-3',
            title: '同济大学大模型合作进展',
            content: '腾讯教育与同济大学围绕大模型核心展开大设计层面的深度协同创新，共同规划面向智能教学场景的下一代教育大模型。',
            url: 'https://csig.lexiangla.com/spaces/103d710cda0b481dbee76ab7e8994c56',
            source: 'lexiang',
            relevance: 0.8,
            updatedAt: '2025-01-20',
            isTest: true
        }
    ];
}
