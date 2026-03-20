// Vercel Serverless Function - 测试API连接
export default async function handler(req, res) {
    // 启用CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        res.status(405).json({ error: '方法不允许' });
        return;
    }
    
    const { provider } = req.query;
    
    try {
        // 获取API密钥和配置
        let apiKey, baseURL, model, providerName;
        
        if (provider === 'glm') {
            apiKey = process.env.GLM_API_KEY;
            baseURL = 'https://open.bigmodel.cn/api/paas/v4';
            model = 'glm-4-plus';
            providerName = 'GLM-4 Plus';
        } else {
            res.status(404).json({ error: '不支持的API提供商' });
            return;
        }
        
        if (!apiKey) {
            res.status(400).json({ error: '请先在Vercel环境变量中配置API密钥' });
            return;
        }
        
        console.log(`🔍 正在测试 ${providerName} API连接...`);
        
        // 测试API连接
        const testResult = await testAPIConnection(provider, apiKey, baseURL, model);
        
        if (testResult.success) {
            console.log(`✅ ${providerName} 连接测试成功`);
            res.status(200).json({
                success: true,
                provider: provider,
                message: `${providerName} 连接测试成功`,
                response: testResult.response,
                timestamp: testResult.timestamp
            });
        } else {
            console.log(`❌ ${providerName} 连接测试失败:`, testResult.error);
            res.status(400).json({
                success: false,
                provider: provider,
                error: testResult.error,
                timestamp: testResult.timestamp
            });
        }
        
    } catch (error) {
        console.error('❌ 测试连接失败:', error);
        res.status(500).json({ error: '测试连接失败' });
    }
}

// 测试API连接函数
async function testAPIConnection(provider, apiKey, baseURL, model) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        };

        const requestBody = {
            model: model,
            messages: [
                {
                    role: 'user',
                    content: '请回复"连接测试成功"'
                }
            ],
            max_tokens: 50,
            temperature: 0.7
        };

        const response = await fetch(`${baseURL}/chat/completions`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API请求失败: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return {
            success: true,
            response: data.choices[0].message.content,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}