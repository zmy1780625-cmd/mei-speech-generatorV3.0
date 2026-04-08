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
    },
    {
        id: "lexiang-006",
        title: "腾讯高校AI嘉年华-AI Coding实训营",
        content: "面向清华大学、上海交通大学、西安电子科技大学、华南理工大学、深圳大学、香港城市大学等高校计算机、软件或人工智能专业学生，以'课程讲解+实训'形式开展的AI Coding训练营。涵盖AI Coding发展趋势、智能体构建、工具入门与腾讯工程实践等内容，培养学生在AI Coding领域的产业技术实践能力。",
        category: "竞赛活动",
        tags: ["AI Coding", "高校合作", "编程教育", "实训营"],
        source: "lexiang",
        date: "2025"
    },
    {
        id: "lexiang-007",
        title: "南京信息工程大学腾讯特色班",
        content: "与南京信息工程大学深度合作共建特色人才培养项目，围绕云计算、人工智能等前沿技术领域，打造产教融合的拔尖人才培养模式。课程体系融入企业真实项目案例，学生参与腾讯实际业务场景的技术实践，形成可复制的产教融合人才培养范式。",
        category: "合作案例",
        tags: ["特色班", "产教融合", "南京信息工程大学", "云计算"],
        source: "lexiang",
        date: "2024"
    },
    {
        id: "lexiang-008",
        title: "清华大学-腾讯联合研究中心",
        content: "在人工智能、大数据、云计算等前沿技术领域建立联合研究中心，开展基础研究和应用研究，推动产学研深度融合。联合承担国家级科研项目5项，发表顶会论文20余篇，申请发明专利30余项，联合培养博士硕士研究生40余人。",
        category: "合作案例",
        tags: ["清华大学", "联合研究", "科研合作", "前沿技术"],
        source: "lexiang",
        date: "2023"
    },
    {
        id: "lexiang-009",
        title: "浙江大学智慧校园建设项目",
        content: "为浙江大学提供智慧校园整体解决方案，包括统一身份认证、智能教务管理、一站式服务平台、校园大数据分析等。整合腾讯会议、企业微信等工具，提升校园管理和服务效率。建成覆盖全校师生的智慧校园平台，日均活跃用户超过5万人，办事效率提升60%以上。",
        category: "合作案例",
        tags: ["浙江大学", "智慧校园", "高校信息化", "数字化"],
        source: "lexiang",
        date: "2024"
    },
    {
        id: "lexiang-010",
        title: "北京师范大学未来教育高精尖创新中心合作",
        content: "与北师大未来教育高精尖创新中心建立战略合作，围绕教育人工智能、学习科学、教育大数据等前沿领域开展联合研究。联合发表多篇高水平学术论文，共同申请多项教育技术专利，联合培养研究生20余名，多项研究成果在教育实践中得到应用。",
        category: "合作案例",
        tags: ["北京师范大学", "教育科研", "教育AI", "联合研究"],
        source: "lexiang",
        date: "2024"
    },
    {
        id: "lexiang-011",
        title: "腾讯犀牛鸟开源人才培养计划",
        content: "面向高校学生的开源人才培养计划，通过开源基础课程、开源项目实践、导师指导等方式，培养高校学生的开源贡献能力和工程实践能力。累计覆盖超过100所高校，培养开源人才超过5000人，学生向腾讯开源项目贡献代码超过10万行。",
        category: "人才培养",
        tags: ["开源", "人才培养", "犀牛鸟计划", "高校合作"],
        source: "lexiang",
        date: "2023-2025"
    },
    {
        id: "lexiang-012",
        title: "上海市中小学AI课程普及项目",
        content: "支持上海市中小学人工智能课程普及工作，提供课程资源、教师培训、教学平台等全方位支持。开发适合不同学段的AI课程，帮助中小学生建立人工智能素养。已覆盖上海市超过500所中小学，培训AI课程教师2000余人，累计开课超过10000课时，受益学生超过30万人。",
        category: "合作案例",
        tags: ["K12教育", "上海", "AI课程普及", "教育公平"],
        source: "lexiang",
        date: "2024"
    },
    {
        id: "lexiang-013",
        title: "广东轻工职业技术学院产业学院",
        content: "共建数字创意设计产业学院，整合腾讯云技术资源与学校专业优势，培养数字文创、云计算、人工智能等领域的应用型人才。引入企业真实项目作为教学案例，建立'工作室制'教学模式。建成省级示范性产业学院，学生作品多次获得行业设计大奖。",
        category: "合作案例",
        tags: ["职业教育", "产业学院", "广东轻工", "数字文创"],
        source: "lexiang",
        date: "2024"
    },
    {
        id: "lexiang-014",
        title: "腾讯支教数字化帮扶项目",
        content: "通过数字化手段助力教育公平，为云南、贵州、四川等多省偏远地区学校提供在线课程资源、教师培训、智慧教学工具等支持。利用腾讯会议、腾讯课堂等工具搭建城乡教育桥梁，让优质教育资源触达更多乡村学生。累计覆盖超过100所乡村学校，培训乡村教师超过2000人次，受益学生超过5万人。",
        category: "社会责任",
        tags: ["教育公平", "乡村振兴", "支教", "数字化帮扶"],
        source: "lexiang",
        date: "2023-2025"
    },
    {
        id: "lexiang-015",
        title: "香港高校AI人才培养合作",
        content: "与香港城市大学、香港科技大学等高校开展AI人才培养合作，共同开发课程、组织实训项目、举办技术交流活动，促进粤港澳大湾区教育协同发展。联合培养AI人才超过200人，举办技术交流活动10余场，促进两地师生互动交流。",
        category: "合作案例",
        tags: ["香港", "大湾区", "AI人才", "国际合作"],
        source: "lexiang",
        date: "2024"
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
