// 乐享API诊断工具
// 用于测试乐享MCP连接和查看原始响应

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    const diagnostics = {
        timestamp: new Date().toISOString(),
        tests: []
    };
    
    const spaceId = '103d710cda0b481dbee76ab7e8994c56';
    const mcpUrl = 'https://mcp.lexiang-app.com/mcp?company_from=csig&preset=meta';
    
    // 测试1: 基本网络连通性
    try {
        console.log('🧪 测试1: 检查MCP URL连通性...');
        const response = await fetch(mcpUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'test-1',
                method: 'initialize',
                params: {
                    protocolVersion: '2024-11-05',
                    capabilities: {},
                    clientInfo: { name: 'test', version: '1.0' }
                }
            }),
            timeout: 10000
        });
        
        const responseText = await response.text();
        diagnostics.tests.push({
            name: 'MCP初始化',
            status: response.ok ? 'success' : 'error',
            statusCode: response.status,
            responsePreview: responseText.substring(0, 500)
        });
    } catch (error) {
        diagnostics.tests.push({
            name: 'MCP初始化',
            status: 'error',
            error: error.message
        });
    }
    
    // 测试2: 尝试列出工具
    try {
        console.log('🧪 测试2: 尝试列出MCP工具...');
        const response = await fetch(mcpUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'test-2',
                method: 'tools/list',
                params: {}
            }),
            timeout: 10000
        });
        
        const responseText = await response.text();
        diagnostics.tests.push({
            name: '列出工具',
            status: response.ok ? 'success' : 'error',
            statusCode: response.status,
            responsePreview: responseText.substring(0, 500)
        });
    } catch (error) {
        diagnostics.tests.push({
            name: '列出工具',
            status: 'error',
            error: error.message
        });
    }
    
    // 测试3: 直接HTTP GET测试
    try {
        console.log('🧪 测试3: 直接HTTP GET测试...');
        const spaceUrl = `https://csig.lexiangla.com/spaces/${spaceId}`;
        const response = await fetch(spaceUrl, {
            method: 'GET',
            headers: { 'Accept': 'text/html,application/json' },
            timeout: 10000
        });
        
        diagnostics.tests.push({
            name: '空间页面访问',
            status: response.ok ? 'success' : 'error',
            statusCode: response.status,
            contentType: response.headers.get('content-type')
        });
    } catch (error) {
        diagnostics.tests.push({
            name: '空间页面访问',
            status: 'error',
            error: error.message
        });
    }
    
    // 汇总
    const successCount = diagnostics.tests.filter(t => t.status === 'success').length;
    diagnostics.summary = {
        total: diagnostics.tests.length,
        success: successCount,
        failed: diagnostics.tests.length - successCount,
        recommendation: successCount === 0 
            ? '乐享MCP服务暂时不可用，请检查网络连接或联系管理员' 
            : '部分测试通过，请查看详细结果'
    };
    
    res.status(200).json(diagnostics);
}
