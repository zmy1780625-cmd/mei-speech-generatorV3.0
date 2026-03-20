// Vercel Serverless Function - 生成演讲稿
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
    
    try {
        const { prompt, provider, model } = req.body;

        if (!prompt) {
            res.status(400).json({ error: '生成提示不能为空' });
            return;
        }

        // 获取API密钥和配置
        let apiKey, baseURL, modelName, providerName;
        
        if (provider === 'glm') {
            apiKey = process.env.GLM_API_KEY;
            baseURL = 'https://open.bigmodel.cn/api/paas/v4';
            modelName = model || 'glm-4-plus';
            providerName = 'GLM-4 Plus';
        } else {
            res.status(404).json({ error: '不支持的API提供商' });
            return;
        }

        if (!apiKey) {
            res.status(400).json({ error: '请先在Vercel环境变量中配置API密钥' });
            return;
        }

        console.log(`🤖 正在使用 ${providerName} 生成演讲稿...`);

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        };

        const requestBody = {
            model: modelName,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 4000,
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
        const generatedContent = data.choices[0].message.content;

        console.log(`✅ 演讲稿生成完成，字数: ${generatedContent.length}`);

        res.status(200).json({
            success: true,
            content: generatedContent,
            provider: provider,
            model: modelName,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ 生成演讲稿失败:', error);
        res.status(500).json({ error: error.message });
    }
}