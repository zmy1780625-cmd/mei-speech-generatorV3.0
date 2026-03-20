const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API配置文件路径
const CONFIG_FILE = path.join(__dirname, 'api-config.json');

// 初始化配置文件
async function initConfigFile() {
    try {
        await fs.access(CONFIG_FILE);
    } catch (error) {
        // 文件不存在，创建默认配置
        const defaultConfig = {
            apis: {
                glm: {
                    name: 'GLM-4 Plus',
                    apiKey: '',
                    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
                    model: 'glm-4-plus',
                    status: 'disconnected',
                    lastTest: null
                }
            },
            settings: {
                defaultModel: 'glm',
                autoTest: true,
                created: new Date().toISOString(),
                updated: new Date().toISOString()
            }
        };
        await fs.writeFile(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
        console.log('✅ 创建默认API配置文件');
    }
}

// 读取配置
async function readConfig() {
    try {
        const data = await fs.readFile(CONFIG_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ 读取配置失败:', error);
        return null;
    }
}

// 保存配置
async function saveConfig(config) {
    try {
        config.settings.updated = new Date().toISOString();
        await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
        return true;
    } catch (error) {
        console.error('❌ 保存配置失败:', error);
        return false;
    }
}

// 测试API连接
async function testAPIConnection(provider, apiKey, baseURL, model) {
    try {
        const fetch = (await import('node-fetch')).default;
        
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
            body: JSON.stringify(requestBody),
            timeout: 10000
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

// API路由

// 获取配置状态
app.get('/api/config', async (req, res) => {
    try {
        const config = await readConfig();
        if (!config) {
            return res.status(500).json({ error: '无法读取配置' });
        }

        // 不返回敏感信息（API密钥）
        const safeConfig = {
            apis: {},
            settings: config.settings
        };

        Object.keys(config.apis).forEach(provider => {
            const api = config.apis[provider];
            safeConfig.apis[provider] = {
                name: api.name,
                baseURL: api.baseURL,
                model: api.model,
                status: api.status,
                lastTest: api.lastTest,
                hasKey: Boolean(api.apiKey && api.apiKey.length > 0)
            };
        });

        res.json(safeConfig);
    } catch (error) {
        console.error('❌ 获取配置失败:', error);
        res.status(500).json({ error: '获取配置失败' });
    }
});

// 更新API配置
app.post('/api/config/:provider', async (req, res) => {
    try {
        const { provider } = req.params;
        const { apiKey, autoTest = false } = req.body;

        if (!apiKey || typeof apiKey !== 'string') {
            return res.status(400).json({ error: 'API密钥不能为空' });
        }

        const config = await readConfig();
        if (!config || !config.apis[provider]) {
            return res.status(404).json({ error: '不支持的API提供商' });
        }

        // 更新配置
        config.apis[provider].apiKey = apiKey;
        config.apis[provider].status = 'configured';

        // 如果启用自动测试，进行连接测试
        if (autoTest) {
            console.log(`🔍 正在测试 ${provider} API连接...`);
            const testResult = await testAPIConnection(
                provider,
                apiKey,
                config.apis[provider].baseURL,
                config.apis[provider].model
            );

            config.apis[provider].status = testResult.success ? 'connected' : 'error';
            config.apis[provider].lastTest = testResult.timestamp;

            if (!testResult.success) {
                console.log(`❌ ${provider} 连接测试失败:`, testResult.error);
            } else {
                console.log(`✅ ${provider} 连接测试成功`);
            }
        }

        // 保存配置
        const saved = await saveConfig(config);
        if (!saved) {
            return res.status(500).json({ error: '保存配置失败' });
        }

        res.json({
            success: true,
            provider: provider,
            status: config.apis[provider].status,
            lastTest: config.apis[provider].lastTest,
            message: `${config.apis[provider].name} 配置${autoTest ? '并测试' : ''}完成`
        });

    } catch (error) {
        console.error('❌ 更新配置失败:', error);
        res.status(500).json({ error: '更新配置失败' });
    }
});

// 测试API连接
app.post('/api/test/:provider', async (req, res) => {
    try {
        const { provider } = req.params;
        
        const config = await readConfig();
        if (!config || !config.apis[provider]) {
            return res.status(404).json({ error: '不支持的API提供商' });
        }

        const api = config.apis[provider];
        if (!api.apiKey) {
            return res.status(400).json({ error: '请先配置API密钥' });
        }

        console.log(`🔍 正在测试 ${provider} API连接...`);
        const testResult = await testAPIConnection(
            provider,
            api.apiKey,
            api.baseURL,
            api.model
        );

        // 更新状态
        config.apis[provider].status = testResult.success ? 'connected' : 'error';
        config.apis[provider].lastTest = testResult.timestamp;
        await saveConfig(config);

        if (testResult.success) {
            console.log(`✅ ${provider} 连接测试成功`);
            res.json({
                success: true,
                provider: provider,
                message: `${api.name} 连接测试成功`,
                response: testResult.response,
                timestamp: testResult.timestamp
            });
        } else {
            console.log(`❌ ${provider} 连接测试失败:`, testResult.error);
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
});

// 生成演讲稿
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, provider, model } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: '生成提示不能为空' });
        }

        const config = await readConfig();
        if (!config || !config.apis[provider]) {
            return res.status(404).json({ error: '不支持的API提供商' });
        }

        const api = config.apis[provider];
        if (!api.apiKey) {
            return res.status(400).json({ error: '请先配置API密钥' });
        }

        console.log(`🤖 正在使用 ${api.name} 生成演讲稿...`);

        const fetch = (await import('node-fetch')).default;
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${api.apiKey}`
        };

        const requestBody = {
            model: model || api.model,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 4000,
            temperature: 0.7
        };

        const response = await fetch(`${api.baseURL}/chat/completions`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody),
            timeout: 30000
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API请求失败: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const generatedContent = data.choices[0].message.content;

        console.log(`✅ 演讲稿生成完成，字数: ${generatedContent.length}`);

        res.json({
            success: true,
            content: generatedContent,
            provider: provider,
            model: model || api.model,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ 生成演讲稿失败:', error);
        res.status(500).json({ error: error.message });
    }
});

// 清除配置
app.delete('/api/config/:provider', async (req, res) => {
    try {
        const { provider } = req.params;
        
        const config = await readConfig();
        if (!config || !config.apis[provider]) {
            return res.status(404).json({ error: '不支持的API提供商' });
        }

        // 清除API密钥
        config.apis[provider].apiKey = '';
        config.apis[provider].status = 'disconnected';
        config.apis[provider].lastTest = null;

        const saved = await saveConfig(config);
        if (!saved) {
            return res.status(500).json({ error: '保存配置失败' });
        }

        res.json({
            success: true,
            provider: provider,
            message: `${config.apis[provider].name} 配置已清除`
        });

    } catch (error) {
        console.error('❌ 清除配置失败:', error);
        res.status(500).json({ error: '清除配置失败' });
    }
});

// 获取系统状态
app.get('/api/status', async (req, res) => {
    try {
        const config = await readConfig();
        const status = {
            server: 'running',
            timestamp: new Date().toISOString(),
            configFile: Boolean(config),
            apis: {}
        };

        if (config) {
            Object.keys(config.apis).forEach(provider => {
                const api = config.apis[provider];
                status.apis[provider] = {
                    name: api.name,
                    status: api.status,
                    hasKey: Boolean(api.apiKey && api.apiKey.length > 0),
                    lastTest: api.lastTest
                };
            });
        }

        res.json(status);
    } catch (error) {
        console.error('❌ 获取状态失败:', error);
        res.status(500).json({ error: '获取状态失败' });
    }
});

// 启动服务器
async function startServer() {
    try {
        await initConfigFile();
        
        // 启动时自动测试API连接
        console.log('🔍 正在测试预配置的API连接...');
        await testAllAPIs();
        
        app.listen(PORT, () => {
            console.log(`🚀 演讲稿生成器后端服务已启动`);
            console.log(`📡 服务地址: http://localhost:${PORT}`);
            console.log(`🌐 网页地址: http://localhost:${PORT}/index.html`);
            console.log(`📊 系统状态: http://localhost:${PORT}/api/status`);
            console.log('');
            console.log('🔧 API配置状态:');
            showAPIStatus();
        });
    } catch (error) {
        console.error('❌ 启动服务器失败:', error);
        process.exit(1);
    }
}

// 测试所有API连接
async function testAllAPIs() {
    const config = await readConfig();
    if (!config || !config.apis) return;
    
    for (const [provider, api] of Object.entries(config.apis)) {
        if (api.apiKey) {
            console.log(`🔍 测试 ${api.name} 连接...`);
            const testResult = await testAPIConnection(
                provider,
                api.apiKey,
                api.baseURL,
                api.model
            );
            
            config.apis[provider].status = testResult.success ? 'connected' : 'error';
            config.apis[provider].lastTest = testResult.timestamp;
            
            if (testResult.success) {
                console.log(`✅ ${api.name} 连接成功`);
            } else {
                console.log(`❌ ${api.name} 连接失败: ${testResult.error}`);
            }
        }
    }
    
    await saveConfig(config);
}

// 显示API状态
async function showAPIStatus() {
    const config = await readConfig();
    if (!config || !config.apis) return;
    
    Object.entries(config.apis).forEach(([provider, api]) => {
        const statusIcon = api.status === 'connected' ? '✅' : 
                          api.status === 'configured' ? '⚙️' : '❌';
        console.log(`  ${statusIcon} ${api.name}: ${api.status}`);
    });
    console.log('');
}

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n🛑 正在关闭服务器...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 正在关闭服务器...');
    process.exit(0);
});

startServer();