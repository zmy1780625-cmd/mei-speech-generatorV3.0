// Vercel Serverless Function - 获取API配置
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
        // 从环境变量获取API密钥
        const glmApiKey = process.env.GLM_API_KEY || '';
        
        // 构建配置对象
        const config = {
            apis: {
                glm: {
                    name: 'GLM-4 Plus',
                    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
                    model: 'glm-4-plus',
                    status: glmApiKey ? 'configured' : 'disconnected',
                    lastTest: null,
                    hasKey: Boolean(glmApiKey && glmApiKey.length > 0)
                }
            },
            settings: {
                defaultModel: 'glm',
                autoTest: false,
                hideConfig: true,
                environment: 'vercel',
                created: new Date().toISOString(),
                updated: new Date().toISOString()
            }
        };
        
        console.log('✅ 返回API配置，GLM有密钥:', Boolean(glmApiKey));
        res.status(200).json(config);
        
    } catch (error) {
        console.error('❌ 获取配置失败:', error);
        res.status(500).json({ error: '获取配置失败' });
    }
}