// Vercel Serverless Function - 获取系统状态
export default function handler(req, res) {
    // 启用CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'GET') {
        res.status(405).json({ error: '方法不允许' });
        return;
    }
    
    try {
        // 从环境变量获取API密钥状态
        const glmApiKey = process.env.GLM_API_KEY || '';
        
        const status = {
            server: 'running',
            environment: 'vercel',
            timestamp: new Date().toISOString(),
            configFile: true,
            apis: {
                glm: {
                    name: 'GLM-4 Plus',
                    status: glmApiKey ? 'configured' : 'disconnected',
                    hasKey: Boolean(glmApiKey && glmApiKey.length > 0),
                    lastTest: null
                }
            }
        };

        console.log('✅ 系统状态检查完成');
        res.status(200).json(status);
        
    } catch (error) {
        console.error('❌ 获取状态失败:', error);
        res.status(500).json({ error: '获取状态失败' });
    }
}