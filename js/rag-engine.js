/**
 * RAG (Retrieval-Augmented Generation) 引擎
 * 用于演讲稿生成器的知识检索和增强
 */

class RAGEngine {
    constructor() {
        this.knowledgeBase = null;
        this.initialized = false;
        this.cache = new Map();
        // 内嵌默认知识库数据（解决本地文件CORS问题）
        this.defaultKnowledgeBase = {
            "metadata": {
                "version": "1.1",
                "lastUpdated": "2025-03-05",
                "description": "腾讯教育石梅总演讲稿生成器知识库"
            },
            "policies": [
                {
                    "id": "policy-001",
                    "title": "教育部人工智能+教育行动计划",
                    "date": "2025-01",
                    "source": "教育部",
                    "content": "加快教育大模型建设与人工智能+教育场景创新，加强对学生数字素养和人工智能应用能力的培养",
                    "tags": ["AI教育", "政策", "大模型"],
                    "importance": "high"
                },
                {
                    "id": "policy-002",
                    "title": "国家教育数字化战略行动",
                    "date": "2024-09",
                    "source": "教育部",
                    "content": "推进教育新型基础设施建设，构建高质量教育支撑体系",
                    "tags": ["数字化转型", "基础设施", "政策"],
                    "importance": "high"
                }
            ],
            "tencent_education": {
                "platforms": [
                    {
                        "name": "腾讯教育智能体平台",
                        "launchDate": "2025-09",
                        "positioning": "新一代教育超级入口，学、用、创、赛一站式学习生态",
                        "description": "腾讯教育针对教育场景打造的AI原生平台，通过Agent技术推动课堂教学模式创新",
                        "features": ["智能体创建", "多智能体协作", "教学场景适配", "多智能体协作与资源调度"],
                        "stats": {
                            "teams": 64,
                            "participants": 109,
                            "outputs": 100
                        },
                        "successfulCases": [
                            {
                                "school": "江苏开放大学",
                                "deploymentDate": "2025-08",
                                "coverage": "20万师生"
                            }
                        ]
                    },
                    {
                        "name": "青少年AIGC创作工坊",
                        "productNature": "腾讯自研产品",
                        "launchDate": "2025-08-19",
                        "currentStats": "截至目前，已覆盖超过300所学校、5000名师生，创作超过30000份学生作品",
                        "description": "腾讯自主研发的面向青少年的AIGC创作平台，基于腾讯混元及开源大模型，旨在探索AIGC的无限潜力，帮助青少年掌握AI辅助下的数字创作能力",
                        "position": "腾讯青少年人工智能教育方案的重要组成部分，是'四大AI实验室'之一",
                        "coreFeatures": [
                            "AI生文、AI绘画、AI视频、AI建模、AI音乐、AI编程与AI智能体等创作工具",
                            "跨学科项目式学习（PBL）：支持'AI+学科'创意实践",
                            "安全防护体系：自研模型、伦理审查、全流程内容与隐私管控",
                            "教育支撑平台：统一账号体系、课程资源管理"
                        ],
                        "technicalBase": "基于腾讯混元及优秀开源大模型，提供一站式多模态AIGC创作工具",
                        "educationalGoal": "腾讯青少年人工智能教育从'创客教育'、'STEAM+AI教育'迈向'AIGC教育'2.0阶段的核心载体",
                        "applicationScenarios": ["校内课程教学", "课后服务", "科普竞赛"],
                        "successfulCases": [
                            {"school": "北京师范大学附属中学", "application": "智能体助力教学"},
                            {"school": "首师大子期实验中学", "application": "'AI+生物'3D建模探索"}
                        ],
                        "stats": {
                            "schools": 300,
                            "teachersStudents": 5000,
                            "works": 30000,
                            "note": "以上为截至目前的累计数据，非2025年8月推出时数据"
                        },
                        "features": ["AI生文", "AI绘画", "AI视频", "AI建模", "AI音乐", "AI编程", "AI智能体"]
                    }
                ],
                "strategies": [
                    {
                        "name": "All in AI，AI in All",
                        "components": ["AI Education", "AI for Education", "AI for Science"]
                    }
                ]
            },
            "speech_patterns": {
                "opening": [
                    "尊敬的各位师长、同仁，大家好！",
                    "各位来宾、各位伙伴，大家下午好！",
                    "尊敬的各位领导和嘉宾，大家好！"
                ],
                "mission": ["用户为本，科技向善"],
                "vision": ["用数字科技，让教育更富创造力"],
                "values": ["科技助教、连接兴学，专业为育"],
                "closing": [
                    "让我们携手同行，共同书写教育创新发展的新篇章！",
                    "期待与各位继续深化合作，共创美好未来！"
                ]
            },
            "cases": [
                {
                    "id": "case-001",
                    "title": "同济大学大模型合作",
                    "date": "2025",
                    "partner": "同济大学",
                    "content": "围绕大模型核心展开大设计层面的深度协同创新",
                    "results": "共同规划面向智能教学场景的下一代教育大模型"
                },
                {
                    "id": "case-002",
                    "title": "上海海事大学海商法大模型",
                    "date": "2025-10",
                    "partner": "上海海事大学",
                    "content": "共同打造海商法大模型，推出双平台战略",
                    "results": "发布海商法大模型和教育数字化平台"
                },
                {
                    "id": "case-003",
                    "title": "腾讯高校AI嘉年华-AI Coding实训营",
                    "date": "2025",
                    "partner": "清华大学、上海交通大学、西安电子科技大学、华南理工大学、深圳大学、香港城市大学",
                    "content": "面向计算机、软件或人工智能专业学生，以'课程讲解+实训'形式开展的线下/线上训练营",
                    "results": "培养学生在AI Coding领域的产业技术实践能力，服务于AI Coding创新挑战赛等赛事",
                    "details": {
                        "duration": "3课时（约0.5天）",
                        "modules": [
                            "AI Coding发展趋势与现状",
                            "如何构建AI Coding智能体",
                            "AI Coding工具入门与腾讯工程实践",
                            "训练营实践（规约编程、大模型实训等7选2）"
                        ],
                        "tools": ["CodeBuddy IDE", "Cloud Studio"],
                        "relatedEvents": ["腾讯未来产品经理创造营", "AI Coding创新挑战赛"]
                    }
                },
                {
                    "id": "case-004",
                    "title": "青少年AIGC创作工坊",
                    "productNature": "腾讯自研产品",
                    "launchDate": "2025-08-19",
                    "date": "2025",
                    "partner": "使用学校包括：北京师范大学附属中学、首师大子期实验中学等（非合作开发方）",
                    "content": "腾讯自主研发的面向青少年的AIGC创作平台，基于腾讯混元及开源大模型，提供AI生文、AI绘画、AI视频、AI建模、AI音乐、AI编程与AI智能体等创作工具，支持跨学科项目式学习（PBL）",
                    "results": "截至目前，已覆盖超过300所学校、5000名师生，师生在平台上创作了超过30000份学生作品；应用于校内课程、课后服务及科普竞赛等多种场景",
                    "details": {
                        "coreModules": [
                            "AI生文、AI绘画、AI视频、AI建模、AI音乐、AI编程与AI智能体",
                            "跨学科项目式学习（PBL）：AI+音乐、AI+化学、AI+英语、AI+数学",
                            "安全防护体系：自研模型、伦理审查、全流程内容与隐私管控",
                            "教育支撑平台：统一账号、课程资源、教/学/管/评全流程"
                        ],
                        "educationalPosition": "腾讯青少年AI教育从'创客教育'、'STEAM+AI教育'迈向'AIGC教育'2.0阶段的核心载体",
                        "productArchitecture": "四大AI实验室之一（AI体验馆、AI训练馆、AI竞技场、AIGC创作工坊）",
                        "successfulCases": [
                            {"school": "北京师范大学附属中学", "application": "智能体助力教学"},
                            {"school": "首师大子期实验中学", "application": "'AI+生物'3D建模探索"}
                        ]
                    }
                },
                {
                    "id": "case-005",
                    "title": "腾讯教育智能体平台使用案例",
                    "date": "2025-09",
                    "partner": "北京大学、清华大学等8所高校及江苏开放大学",
                    "content": "腾讯教育针对教育场景打造的AI原生平台，通过Agent技术推动课堂教学模式创新，构建'学、用、创、赛'一站式新一代学习生态。平台联动腾讯生态资源（腾讯文档、企业微信、Cloud Studio等），实现课程学习、实训工具、知识管理与创作分享的无缝衔接",
                    "results": "平台助力多所高校举办智能体大赛，吸引8所高校64支战队109名选手参与，产出100+涵盖学业规划、代码开发、智能助教等方向的教育智能体应用成果。江苏开放大学于2025年8月引入平台，向20万师生开放使用，探索Agent在终身教育场景的应用",
                    "details": {
                        "positioning": "新一代教育超级入口，学、用、创、赛一站式学习生态",
                        "coreFunctions": [
                            "多智能体协作与资源调度",
                            "多类型智能体覆盖：教学、科研、专家、管理智能体",
                            "丰富教育工具：图像生成、视频生成、音乐生成、编程助手、论文检索"
                        ],
                        "competitionCase": {
                            "date": "2025年9月",
                            "stats": {"teams": 64, "participants": 109, "outputs": 100},
                            "outputDirections": ["学业规划", "代码开发", "智能助教"]
                        },
                        "successfulCases": [
                            {
                                "school": "江苏开放大学",
                                "deploymentDate": "2025年8月",
                                "coverage": "20万师生",
                                "focus": "Agent在终身教育场景的应用"
                            }
                        ]
                    }
                }
            ],
            "hot_topics": [
                {
                    "topic": "教育数字化转型",
                    "keywords": ["智慧教育", "数字校园", "教育新基建"],
                    "trend": "上升"
                },
                {
                    "topic": "AI赋能教学",
                    "keywords": ["智能助教", "个性化学习", "AI课程"],
                    "trend": "上升"
                },
                {
                    "topic": "大模型教育应用",
                    "keywords": ["教育大模型", "Agent", "AIGC"],
                    "trend": "热门"
                },
                {
                    "topic": "AIGC青少年教育",
                    "keywords": ["AIGC创作工坊", "人机共育", "AI+学科", "跨学科PBL"],
                    "trend": "热门"
                }
            ]
        };
    }

    /**
     * 初始化RAG引擎，加载知识库
     */
    async initialize() {
        try {
            // 尝试从文件加载（服务器环境下）
            const response = await fetch('./knowledge-base/education-data.json');
            this.knowledgeBase = await response.json();
            console.log('RAG引擎初始化成功（从文件加载）');
        } catch (error) {
            // 如果加载失败（如本地文件CORS问题），使用内嵌默认数据
            console.log('RAG引擎使用内嵌默认数据（文件加载失败）');
            this.knowledgeBase = this.defaultKnowledgeBase;
        }
        this.initialized = true;
        return true;
    }

    /**
     * 主题-案例智能匹配算法
     * 根据演讲主题自动选择最相关的案例
     * @param {string} query - 演讲主题/查询
     * @returns {Array} - 推荐案例ID列表
     */
    matchCasesByTopic(query) {
        if (!this.knowledgeBase || !this.knowledgeBase.topic_case_mapping) {
            console.log('未找到主题映射配置，使用默认案例');
            return ['case-005', 'case-004']; // 默认返回最通用的案例
        }

        const mapping = this.knowledgeBase.topic_case_mapping;
        const rules = mapping.matchingRules || [];
        
        // 提取查询中的关键词（简单分词）
        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(/[\s,，.。!！?？;:；：""''（）()]+/);
        
        console.log('主题匹配分析:', query);
        
        // 计算每个规则的匹配度
        const matchScores = rules.map(rule => {
            let score = 0;
            let matchedKeywords = [];
            
            // 检查关键词匹配
            rule.keywords.forEach(keyword => {
                const keywordLower = keyword.toLowerCase();
                // 完全匹配得分更高
                if (queryLower.includes(keywordLower)) {
                    score += 3;
                    matchedKeywords.push(keyword);
                }
                // 部分匹配
                else if (queryWords.some(w => w.includes(keywordLower) || keywordLower.includes(w))) {
                    score += 1;
                    matchedKeywords.push(keyword);
                }
            });
            
            return {
                rule: rule,
                score: score,
                matchedKeywords: matchedKeywords,
                priority: rule.priority || 99
            };
        });
        
        // 按匹配度排序，匹配度相同按优先级排序
        matchScores.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return a.priority - b.priority;
        });
        
        // 记录匹配结果供调试
        console.log('匹配结果排序:', matchScores.map(m => ({
            theme: m.rule.theme,
            score: m.score,
            priority: m.priority,
            matched: m.matchedKeywords
        })));
        
        // 选择最佳匹配
        const bestMatch = matchScores[0];
        
        if (bestMatch && bestMatch.score > 0) {
            console.log(`最佳匹配主题: ${bestMatch.rule.theme}, 推荐案例:`, bestMatch.rule.recommendedCases);
            return bestMatch.rule.recommendedCases;
        }
        
        // 无匹配时返回默认案例
        console.log('未找到匹配主题，使用默认案例');
        return ['case-005', 'case-004'];
    }

    /**
     * 获取案例详细信息
     * @param {Array} caseIds - 案例ID列表
     * @returns {Array} - 案例详情列表
     */
    getCaseDetails(caseIds) {
        if (!this.knowledgeBase || !this.knowledgeBase.cases) {
            return [];
        }
        
        return caseIds.map(id => {
            const caseItem = this.knowledgeBase.cases.find(c => c.id === id);
            if (caseItem) {
                return {
                    ...caseItem,
                    relevanceNote: this.getRelevanceNote(id)
                };
            }
            return null;
        }).filter(Boolean);
    }

    /**
     * 获取案例与主题的关联说明
     */
    getRelevanceNote(caseId) {
        const notes = {
            'case-001': '适合学术研讨、大模型技术交流场景，体现深度技术协同',
            'case-002': '适合专业领域AI应用、产教融合、学科大模型主题',
            'case-003': '适合编程教育、AI Coding、高校人才培养主题',
            'case-004': '适合K12教育、AIGC创作、青少年AI素养主题',
            'case-005': '适合智能体应用、高校生态建设、终身教育主题',
            'case-006': '适合高校推广、教育生态建设、产教融合主题'
        };
        return notes[caseId] || '';
    }

    /**
     * 根据查询检索相关知识（增强版，带智能案例匹配）
     * @param {string} query - 查询主题
     * @param {string} type - 演讲类型
     * @param {number} topK - 返回结果数量
     * @param {number} maxCases - 最多返回的案例数量（默认2个）
     * @param {boolean} useSmartMatching - 是否使用智能案例匹配（默认true）
     */
    async retrieve(query, type = 'keynote', topK = 5, maxCases = 2, useSmartMatching = true) {
        if (!this.initialized) {
            await this.initialize();
        }

        const results = [];
        const queryLower = query.toLowerCase();
        
        // 1. 检索相关政策
        const relevantPolicies = this.searchPolicies(queryLower);
        results.push(...relevantPolicies.slice(0, 1)); // 最多1个政策

        // 2. 检索腾讯教育数据
        const tencentData = this.searchTencentData(queryLower);
        if (tencentData) {
            results.push(tencentData);
        }

        // 3. 检索案例 - 按相关性排序并限制数量
        const relevantCases = this.searchCases(queryLower, maxCases);
        results.push(...relevantCases);

        // 4. 检索热点话题
        const hotTopics = this.searchHotTopics(queryLower);
        if (hotTopics.length > 0) {
            results.push(hotTopics[0]); // 最多1个热点话题
        }

        // 5. 根据演讲类型获取风格模板
        const styleTemplate = this.getStyleTemplate(type);
        
        return {
            context: this.formatContext(results.slice(0, topK)),
            style: styleTemplate,
            stats: this.getLatestStats(),
            policies: relevantPolicies,
            cases: relevantCases,
            selectedCases: relevantCases.slice(0, maxCases) // 明确返回选中的案例
        };
    }

    /**
     * 搜索相关政策
     */
    searchPolicies(query) {
        if (!this.knowledgeBase?.policies) return [];
        
        return this.knowledgeBase.policies
            .filter(policy => {
                const searchText = `${policy.title} ${policy.content} ${policy.tags.join(' ')}`.toLowerCase();
                return searchText.includes(query) || 
                       policy.tags.some(tag => query.includes(tag.toLowerCase()));
            })
            .map(policy => ({
                type: 'policy',
                title: policy.title,
                content: policy.content,
                date: policy.date,
                source: policy.source,
                relevance: this.calculateRelevance(query, policy)
            }))
            .sort((a, b) => b.relevance - a.relevance);
    }

    /**
     * 搜索腾讯教育数据
     */
    searchTencentData(query) {
        if (!this.knowledgeBase?.tencent_education) return null;

        const data = this.knowledgeBase.tencent_education;
        let bestMatch = null;
        let maxRelevance = 0;

        // 搜索平台数据
        data.platforms?.forEach(platform => {
            const platformText = `${platform.name} ${platform.features.join(' ')}`.toLowerCase();
            const relevance = this.calculateRelevance(query, { text: platformText });
            
            if (relevance > maxRelevance) {
                maxRelevance = relevance;
                bestMatch = {
                    type: 'tencent_platform',
                    name: platform.name,
                    stats: platform.stats,
                    features: platform.features,
                    launchDate: platform.launchDate
                };
            }
        });

        // 搜索战略
        data.strategies?.forEach(strategy => {
            const strategyText = `${strategy.name} ${strategy.components.join(' ')}`.toLowerCase();
            if (strategyText.includes(query)) {
                bestMatch = {
                    type: 'tencent_strategy',
                    name: strategy.name,
                    components: strategy.components
                };
            }
        });

        return bestMatch;
    }

    /**
     * 搜索案例 - 智能匹配并限制数量（增强版，支持主题映射）
     * @param {string} query - 查询关键词（演讲主题）
     * @param {number} maxResults - 最多返回的案例数量（默认2个）
     * @param {boolean} useSmartMatching - 是否使用智能主题匹配（默认true）
     */
    searchCases(query, maxResults = 2, useSmartMatching = true) {
        if (!this.knowledgeBase?.cases) return [];

        let selectedCaseIds = [];
        let matchReason = '';

        // 优先使用智能主题匹配
        if (useSmartMatching && this.knowledgeBase.topic_case_mapping) {
            selectedCaseIds = this.matchCasesByTopic(query);
            matchReason = '基于主题智能匹配';
            console.log(`智能匹配结果: ${selectedCaseIds.join(', ')}`);
        }

        // 获取案例详情
        let selectedCases = this.getCaseDetails(selectedCaseIds).slice(0, maxResults);

        // 如果智能匹配未返回足够案例，使用传统关键词搜索补充
        if (selectedCases.length < maxResults) {
            const existingIds = new Set(selectedCases.map(c => c.id));
            const additionalCases = this.searchCasesByKeywords(query, maxResults - selectedCases.length);
            
            additionalCases.forEach(caseItem => {
                if (!existingIds.has(caseItem.id) && selectedCases.length < maxResults) {
                    selectedCases.push({
                        ...caseItem,
                        matchSource: '关键词补充'
                    });
                }
            });
        }

        // 格式化返回结果
        return selectedCases.map(caseItem => ({
            type: 'case',
            id: caseItem.id,
            title: caseItem.title,
            partner: caseItem.partner,
            content: caseItem.content,
            results: caseItem.results,
            date: caseItem.date,
            relevanceNote: caseItem.relevanceNote || '',
            matchSource: caseItem.matchSource || matchReason || '智能匹配'
        }));
    }

    /**
     * 基于关键词搜索案例（传统方法，用于补充）
     * @param {string} query - 查询关键词
     * @param {number} maxResults - 最多返回数量
     */
    searchCasesByKeywords(query, maxResults = 2) {
        if (!this.knowledgeBase?.cases) return [];

        const scoredCases = this.knowledgeBase.cases
            .map(caseItem => {
                const searchText = `${caseItem.title} ${caseItem.partner} ${caseItem.content} ${caseItem.results}`.toLowerCase();
                let relevance = 0;
                
                if (caseItem.title.toLowerCase().includes(query)) relevance += 10;
                if (caseItem.partner.toLowerCase().includes(query)) relevance += 8;
                if (caseItem.content.toLowerCase().includes(query)) relevance += 5;
                
                const queryWords = query.split(/\s+/);
                queryWords.forEach(word => {
                    if (searchText.includes(word)) relevance += 2;
                });
                
                return { item: caseItem, relevance };
            })
            .filter(scored => scored.relevance > 0)
            .sort((a, b) => b.relevance - a.relevance);

        return scoredCases.slice(0, maxResults).map(scored => scored.item);
    }

    /**
     * 搜索热点话题
     */
    searchHotTopics(query) {
        if (!this.knowledgeBase?.hot_topics) return [];

        return this.knowledgeBase.hot_topics
            .filter(topic => {
                const searchText = `${topic.topic} ${topic.keywords.join(' ')}`.toLowerCase();
                return searchText.includes(query);
            })
            .map(topic => ({
                type: 'hot_topic',
                topic: topic.topic,
                keywords: topic.keywords,
                trend: topic.trend
            }));
    }

    /**
     * 获取风格模板
     */
    getStyleTemplate(type) {
        const patterns = this.knowledgeBase?.speech_patterns;
        if (!patterns) return null;

        return {
            opening: this.getRandomItem(patterns.opening),
            mission: patterns.mission[0],
            vision: patterns.vision[0],
            values: patterns.values[0],
            closing: this.getRandomItem(patterns.closing)
        };
    }

    /**
     * 获取最新统计数据
     */
    getLatestStats() {
        const stats = {};
        const platforms = this.knowledgeBase?.tencent_education?.platforms;
        
        if (platforms) {
            platforms.forEach(platform => {
                if (platform.stats) {
                    stats[platform.name] = platform.stats;
                }
            });
        }
        
        return stats;
    }

    /**
     * 计算相关性分数
     */
    calculateRelevance(query, item) {
        let score = 0;
        const text = item.text || `${item.title || ''} ${item.content || ''}`.toLowerCase();
        
        // 完全匹配
        if (text.includes(query)) {
            score += 10;
        }
        
        // 关键词匹配
        const queryWords = query.split(/\s+/);
        queryWords.forEach(word => {
            if (text.includes(word)) {
                score += 2;
            }
        });
        
        // 时间越新分数越高
        if (item.date) {
            const year = parseInt(item.date.split('-')[0]);
            if (year >= 2024) {
                score += 3;
            }
        }
        
        return score;
    }

    /**
     * 格式化检索结果
     */
    formatContext(results) {
        let context = '';
        
        results.forEach((result, index) => {
            switch (result.type) {
                case 'policy':
                    context += `[政策${index + 1}] ${result.title}（${result.date}）：${result.content}\n\n`;
                    break;
                case 'tencent_platform':
                    context += `[平台数据] ${result.name}：已覆盖${result.stats.schools || '多'}所学校，服务${result.stats.teachersStudents || '数千'}名师生\n\n`;
                    break;
                case 'case':
                    context += `[合作案例] ${result.title}（${result.partner}）：${result.content}。成果：${result.results}\n\n`;
                    break;
                case 'hot_topic':
                    context += `[热点话题] ${result.topic}，关键词：${result.keywords.join('、')}，趋势：${result.trend}\n\n`;
                    break;
            }
        });
        
        return context.trim();
    }

    /**
     * 获取随机项
     */
    getRandomItem(array) {
        if (!array || array.length === 0) return '';
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * 智能推荐数据
     * 根据主题自动推荐相关数据
     */
    async recommendData(topic) {
        const recommendations = {
            stats: [],
            cases: [],
            policies: []
        };

        const topicKeywords = {
            '人工智能': ['AI', '大模型', '智能体', 'AIGC'],
            '数字化': ['数字化转型', '数字校园', '智慧教育'],
            '合作': ['合作案例', '高校合作'],
            '创新': ['创新', '智能体大赛', '创作工坊']
        };

        // 匹配关键词
        for (const [key, keywords] of Object.entries(topicKeywords)) {
            if (keywords.some(kw => topic.includes(kw))) {
                const relatedData = await this.retrieve(key, 'keynote', 3);
                recommendations.stats.push(...this.extractStats(relatedData.stats));
                recommendations.cases.push(...relatedData.cases.slice(0, 2));
                recommendations.policies.push(...relatedData.policies.slice(0, 2));
            }
        }

        return recommendations;
    }

    /**
     * 提取统计数据
     */
    extractStats(stats) {
        const result = [];
        for (const [platform, data] of Object.entries(stats)) {
            for (const [key, value] of Object.entries(data)) {
                result.push({
                    platform,
                    metric: key,
                    value
                });
            }
        }
        return result;
    }
}

// 创建全局RAG引擎实例
const ragEngine = new RAGEngine();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RAGEngine, ragEngine };
}
