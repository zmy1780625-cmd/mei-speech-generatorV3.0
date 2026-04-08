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
                    "results": "共同规划面向智能教学场景的下一代教育大模型",
                    "category": "科研合作/大模型"
                },
                {
                    "id": "case-002",
                    "title": "上海海事大学海商法大模型",
                    "date": "2025-10",
                    "partner": "上海海事大学",
                    "content": "共同打造海商法大模型，推出双平台战略",
                    "results": "发布海商法大模型和教育数字化平台",
                    "category": "垂直领域/法学"
                },
                {
                    "id": "case-003",
                    "title": "腾讯高校AI嘉年华-AI Coding实训营",
                    "date": "2025",
                    "partner": "清华大学、上海交通大学、西安电子科技大学、华南理工大学、深圳大学、香港城市大学",
                    "content": "面向计算机、软件或人工智能专业学生，以'课程讲解+实训'形式开展的线下/线上训练营",
                    "results": "培养学生在AI Coding领域的产业技术实践能力，服务于AI Coding创新挑战赛等赛事",
                    "category": "竞赛活动/编程教育",
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
                    "category": "K12/AIGC教育",
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
                    "title": "腾讯教育智能体平台",
                    "date": "2025-09",
                    "partner": "北京大学、清华大学等8所高校及江苏开放大学",
                    "content": "腾讯教育针对教育场景打造的AI原生平台，通过Agent技术推动课堂教学模式创新，构建'学、用、创、赛'一站式新一代学习生态",
                    "results": "平台助力多所高校举办智能体大赛，吸引8所高校64支战队109名选手参与，产出100+教育智能体应用成果。江苏开放大学向20万师生开放使用",
                    "category": "高等教育/智能体平台",
                    "details": {
                        "positioning": "新一代教育超级入口，学、用、创、赛一站式学习生态",
                        "coreFunctions": ["多智能体协作与资源调度", "多类型智能体覆盖", "丰富教育工具"],
                        "competitionCase": {"date": "2025年9月", "stats": {"teams": 64, "participants": 109, "outputs": 100}}
                    }
                },
                {
                    "id": "case-006",
                    "title": "南京信息工程大学腾讯特色班",
                    "date": "2024",
                    "partner": "南京信息工程大学",
                    "content": "与高校深度合作共建特色人才培养项目，围绕云计算、人工智能等前沿技术领域，打造产教融合的拔尖人才培养模式",
                    "results": "已培养多届学生，毕业生在腾讯及生态企业就业率显著提升，形成可复制的产教融合人才培养范式",
                    "category": "职业教育/产教融合"
                },
                {
                    "id": "case-007",
                    "title": "广东轻工职业技术学院产业学院",
                    "date": "2024",
                    "partner": "广东轻工职业技术学院",
                    "content": "共建数字创意设计产业学院，整合腾讯云技术资源与学校专业优势，培养数字文创、云计算、人工智能等领域的应用型人才",
                    "results": "建成省级示范性产业学院，学生作品多次获得行业设计大奖，毕业生受到腾讯生态企业欢迎",
                    "category": "职业教育/产业学院"
                },
                {
                    "id": "case-008",
                    "title": "深圳职业技术学院云计算人才培养",
                    "date": "2024",
                    "partner": "深圳职业技术学院",
                    "content": "围绕云计算技术技能人才培养开展深度合作，共建实训基地、开发课程标准、组织技能认证",
                    "results": "累计培养学生超过500人，腾讯云认证通过率达85%以上，多名学生入职腾讯及头部互联网企业",
                    "category": "职业教育/技能培训"
                },
                {
                    "id": "case-009",
                    "title": "腾讯支教数字化帮扶项目",
                    "date": "2023-2025",
                    "partner": "云南、贵州、四川等多省偏远地区学校",
                    "content": "通过数字化手段助力教育公平，为偏远地区学校提供在线课程资源、教师培训、智慧教学工具等支持",
                    "results": "累计覆盖超过100所乡村学校，培训乡村教师超过2000人次，受益学生超过5万人",
                    "category": "教育公平/乡村振兴"
                },
                {
                    "id": "case-010",
                    "title": "云南澜沧县教育帮扶项目",
                    "date": "2023-2025",
                    "partner": "云南澜沧拉祜族自治县教育局",
                    "content": "响应国家乡村振兴战略，为澜沧县提供全方位教育信息化支持，包括智慧校园建设、教师培训、AI课程捐赠等",
                    "results": "建成多个智慧教室示范点，培训当地教师500余人次，惠及大凉山师生超过1.5万人",
                    "category": "教育公平/乡村振兴"
                },
                {
                    "id": "case-011",
                    "title": "腾讯教师培训计划",
                    "date": "2024",
                    "partner": "全国多省市教育局、师范院校",
                    "content": "面向中小学教师的信息化教学能力提升培训项目，涵盖AI教学应用、数字化课程设计、智慧教学工具使用等内容",
                    "results": "累计培训教师超过10万人次，覆盖30个省份，参训教师信息化教学能力显著提升",
                    "category": "教师发展/培训"
                },
                {
                    "id": "case-012",
                    "title": "北京师范大学未来教育创新中心合作",
                    "date": "2024",
                    "partner": "北京师范大学",
                    "content": "与北师大未来教育高精尖创新中心建立战略合作，围绕教育人工智能、学习科学、教育大数据等前沿领域开展联合研究",
                    "results": "联合发表多篇高水平学术论文，共同申请多项教育技术专利，联合培养研究生20余名",
                    "category": "科研合作/高等教育"
                },
                {
                    "id": "case-013",
                    "title": "上海市中小学AI课程普及项目",
                    "date": "2024",
                    "partner": "上海市教委",
                    "content": "支持上海市中小学人工智能课程普及工作，提供课程资源、教师培训、教学平台等全方位支持",
                    "results": "已覆盖上海市超过500所中小学，培训AI课程教师2000余人，累计开课超过10000课时，受益学生超过30万人",
                    "category": "K12/课程普及"
                },
                {
                    "id": "case-014",
                    "title": "清华大学-腾讯联合研究中心",
                    "date": "2023",
                    "partner": "清华大学",
                    "content": "在人工智能、大数据、云计算等前沿技术领域建立联合研究中心，开展基础研究和应用研究，推动产学研深度融合",
                    "results": "联合承担国家级科研项目5项，发表顶会论文20余篇，申请发明专利30余项，联合培养博士硕士研究生40余人",
                    "category": "科研合作/联合研究"
                },
                {
                    "id": "case-015",
                    "title": "浙江大学智慧校园建设项目",
                    "date": "2024",
                    "partner": "浙江大学",
                    "content": "为浙江大学提供智慧校园整体解决方案，包括统一身份认证、智能教务管理、一站式服务平台、校园大数据分析等",
                    "results": "建成覆盖全校师生的智慧校园平台，日均活跃用户超过5万人，办事效率提升60%以上，获评全国高校智慧校园建设标杆案例",
                    "category": "智慧校园/高校信息化"
                },
                {
                    "id": "case-016",
                    "title": "华东师范大学教师教育创新项目",
                    "date": "2024",
                    "partner": "华东师范大学",
                    "content": "与华东师大合作开展教师教育创新实践，利用AI技术赋能师范生培养，建设虚拟仿真实训平台、智能教学诊断系统",
                    "results": "建成国内领先的教师教育虚拟仿真实验室，师范生教学能力评估通过率提升25%，相关成果获得省级教学成果奖",
                    "category": "师范教育/教师培养"
                },
                {
                    "id": "case-017",
                    "title": "腾讯AI编程公益活动",
                    "date": "2023-2025",
                    "partner": "全国青少年发展基金会、多省市青少年宫",
                    "content": "面向欠发达地区青少年开展的AI编程公益项目，免费捐赠编程课程、教学平台、师资培训等资源",
                    "results": "累计覆盖中西部地区超过200所学校，捐赠课程资源价值超过500万元，受益学生超过10万人",
                    "category": "公益/教育公平"
                },
                {
                    "id": "case-018",
                    "title": "四川大凉山教育帮扶行动",
                    "date": "2024",
                    "partner": "四川省凉山州教育局",
                    "content": "深入四川大凉山地区开展教育帮扶，为当地学校建设信息化教学环境，捐赠人工智能教育设备和课程，培训当地教师",
                    "results": "建成10个智慧教室示范点，培训当地教师300余人，捐赠AI教育设备价值200余万元",
                    "category": "教育公平/乡村振兴"
                },
                {
                    "id": "case-019",
                    "title": "香港高校AI人才培养合作",
                    "date": "2024",
                    "partner": "香港城市大学、香港科技大学",
                    "content": "与香港高校开展AI人才培养合作，共同开发课程、组织实训项目、举办技术交流活动，促进粤港澳大湾区教育协同发展",
                    "results": "联合培养AI人才超过200人，举办技术交流活动10余场，促进两地师生互动交流",
                    "category": "国际合作/港澳"
                },
                {
                    "id": "case-020",
                    "title": "腾讯犀牛鸟开源人才培养计划",
                    "date": "2023-2025",
                    "partner": "全国多所高校",
                    "content": "面向高校学生的开源人才培养计划，通过开源基础课程、开源项目实践、导师指导等方式，培养高校学生的开源贡献能力",
                    "results": "累计覆盖超过100所高校，培养开源人才超过5000人，学生向腾讯开源项目贡献代码超过10万行",
                    "category": "开源/人才培养"
                },
                {
                    "id": "case-021",
                    "title": "全国青少年人工智能创新挑战赛",
                    "date": "2024",
                    "partner": "中国少年儿童发展服务中心",
                    "content": "支持举办全国性青少年AI创新挑战赛，为赛事提供技术支持、平台支撑和评审服务",
                    "results": "赛事吸引全国超过10万青少年参与，产生优秀创新作品5000余件，发现和培养了一批青少年AI创新人才",
                    "category": "竞赛活动/青少年"
                },
                {
                    "id": "case-022",
                    "title": "武汉理工大学智慧教室建设",
                    "date": "2024",
                    "partner": "武汉理工大学",
                    "content": "为武汉理工大学建设一批智慧教室，配备智能录播、互动教学、AI学情分析等功能，支持混合式教学和翻转课堂",
                    "results": "建成智慧教室50余间，覆盖主要教学楼，师生满意度超过90%，获评湖北省高校智慧教学示范案例",
                    "category": "智慧教室/教学环境"
                },
                {
                    "id": "case-023",
                    "title": "青少年AI伦理与安全教育项目",
                    "date": "2024",
                    "partner": "中国青少年研究中心",
                    "content": "面向青少年开展AI伦理与安全教育，帮助青少年正确认识AI技术，建立负责任的AI使用意识，培养AI时代的数字公民素养",
                    "results": "开发AI伦理课程10余门，覆盖中小学生超过50万人，相关成果被多地教育部门采纳推广",
                    "category": "AI伦理/安全教育"
                },
                {
                    "id": "case-024",
                    "title": "腾讯教育开源生态建设",
                    "date": "2023-2025",
                    "partner": "开源社区、多所高校",
                    "content": "推动教育技术开源生态建设，开源多款教育工具和产品，与社区共建教育技术基础设施，降低教育信息化门槛",
                    "results": "开源项目累计获得Star超过10万，贡献者超过1000人，多个项目成为教育技术领域的主流开源方案",
                    "category": "开源/生态建设"
                }
            ],
            "topic_case_mapping": {
                "description": "演讲主题与推荐案例的智能映射配置，用于实现案例多样性",
                "matchingRules": [
                    {
                        "id": "rule-k12",
                        "name": "K12基础教育",
                        "keywords": ["K12", "中小学", "小学", "初中", "高中", "基础教育", "青少年", "课后服务", "双减", "素质教育"],
                        "recommendedCases": ["case-004", "case-011", "case-012", "case-013", "case-021"],
                        "priority": 1
                    },
                    {
                        "id": "rule-higher-edu",
                        "name": "高等教育",
                        "keywords": ["高校", "大学", "本科", "研究生", "高等教育", "双一流", "985", "211", "学科建设"],
                        "recommendedCases": ["case-001", "case-002", "case-003", "case-005", "case-014", "case-015"],
                        "priority": 1
                    },
                    {
                        "id": "rule-vocational",
                        "name": "职业教育",
                        "keywords": ["职业", "高职", "中职", "技校", "技能人才", "产教融合", "产业学院", "工匠", "实训"],
                        "recommendedCases": ["case-006", "case-007", "case-008"],
                        "priority": 1
                    },
                    {
                        "id": "rule-lifelong",
                        "name": "终身教育",
                        "keywords": ["终身", "继续教育", "成人教育", "开放大学", "老年教育", "社区教育", "学习型社会"],
                        "recommendedCases": ["case-005", "case-009", "case-010"],
                        "priority": 1
                    },
                    {
                        "id": "rule-teacher",
                        "name": "教师发展",
                        "keywords": ["教师", "师资", "教学能力", "教师培训", "师范", "教学创新", "备课", "教研"],
                        "recommendedCases": ["case-011", "case-012", "case-013", "case-016"],
                        "priority": 1
                    },
                    {
                        "id": "rule-rural",
                        "name": "教育公平与乡村教育",
                        "keywords": ["乡村", "农村", "教育公平", "偏远", "支教", "普惠", "均衡", "帮扶", "乡村振兴"],
                        "recommendedCases": ["case-009", "case-010", "case-017", "case-018"],
                        "priority": 1
                    },
                    {
                        "id": "rule-international",
                        "name": "国际教育合作",
                        "keywords": ["国际", "海外", "留学", "一带一路", "港澳", "国际化", "全球", "跨境"],
                        "recommendedCases": ["case-003", "case-019"],
                        "priority": 2
                    },
                    {
                        "id": "rule-research",
                        "name": "科研与创新",
                        "keywords": ["科研", "学术", "研究", "实验室", "论文", "期刊", "课题", "创新", "前沿"],
                        "recommendedCases": ["case-001", "case-002", "case-014", "case-020"],
                        "priority": 1
                    },
                    {
                        "id": "rule-industry",
                        "name": "行业垂直领域",
                        "keywords": ["法律", "医学", "金融", "工程", "交通", "海事", "能源", "垂直", "专业"],
                        "recommendedCases": ["case-002", "case-006", "case-007", "case-008"],
                        "priority": 1
                    },
                    {
                        "id": "rule-competition",
                        "name": "竞赛与活动",
                        "keywords": ["竞赛", "大赛", "挑战", "创新赛", "编程", "黑客松", "活动", "节", "嘉年华"],
                        "recommendedCases": ["case-003", "case-004", "case-011", "case-021"],
                        "priority": 2
                    },
                    {
                        "id": "rule-campus",
                        "name": "智慧校园",
                        "keywords": ["校园", "数字化", "信息化", "智慧校园", "一网通办", "管理", "服务", "安全"],
                        "recommendedCases": ["case-005", "case-015", "case-022"],
                        "priority": 2
                    },
                    {
                        "id": "rule-ai-ethics",
                        "name": "AI伦理与安全",
                        "keywords": ["伦理", "安全", "隐私", "保护", "规范", "治理", "责任", "可信", "绿色"],
                        "recommendedCases": ["case-004", "case-023"],
                        "priority": 2
                    },
                    {
                        "id": "rule-open-source",
                        "name": "开源与生态",
                        "keywords": ["开源", "开放", "生态", "社区", "共建", "共享", "协作", "贡献"],
                        "recommendedCases": ["case-003", "case-020", "case-024"],
                        "priority": 2
                    }
                ],
                "diversitySettings": {
                    "maxCasesPerTopic": 3,
                    "minCaseVariety": 2,
                    "avoidRepetition": true,
                    "rotationEnabled": true
                }
            },
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
            // 1. 首先加载本地知识库
            const response = await fetch('./knowledge-base/education-data.json');
            this.knowledgeBase = await response.json();
            console.log('RAG引擎初始化成功（从文件加载）');
            
            // 2. 尝试从乐享知识库获取最新数据（如果可用）
            try {
                const lexiangData = await this.fetchLexiangData();
                if (lexiangData && lexiangData.length > 0) {
                    // 合并乐享数据到本地知识库
                    this.mergeLexiangData(lexiangData);
                    console.log('乐享知识库数据已合并');
                }
            } catch (lexiangError) {
                console.log('乐享知识库加载失败（可能未配置MCP）:', lexiangError.message);
            }
        } catch (error) {
            // 如果加载失败（如本地文件CORS问题），使用内嵌默认数据
            console.log('RAG引擎使用内嵌默认数据（文件加载失败）');
            this.knowledgeBase = this.defaultKnowledgeBase;
        }
        this.initialized = true;
        return true;
    }

    /**
     * 从乐享知识库获取数据
     * 通过后端API代理调用乐享MCP服务
     */
    async fetchLexiangData(query = '腾讯教育 案例 产品') {
        // 检查是否配置了乐享MCP
        const mcpConfig = window.mcpConfig || {};
        if (!mcpConfig.lexiang || !mcpConfig.lexiang.enabled) {
            console.log('乐享MCP未配置，跳过');
            return [];
        }
        
        try {
            console.log('📚 正在调用乐享知识库API...');
            
            // 调用后端API代理
            const response = await fetch('/api/lexiang', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    spaceId: mcpConfig.lexiang.spaceId || '103d710cda0b481dbee76ab7e8994c56',
                    query: query,
                    action: 'search',
                    limit: 10
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.results && data.results.length > 0) {
                    console.log(`✅ 乐享API返回 ${data.results.length} 条数据`);
                    return data.results;
                } else {
                    console.log('乐享API返回空数据:', data.error || '未知原因');
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.log('乐享API调用失败:', response.status, errorData.error);
            }
        } catch (error) {
            console.log('乐享API调用失败:', error.message);
        }
        
        return [];
    }
    
    /**
     * 合并乐享数据到本地知识库
     * 将乐享文档转换为知识库案例格式
     */
    mergeLexiangData(lexiangData) {
        if (!this.knowledgeBase || !lexiangData || lexiangData.length === 0) return;
        
        // 标记乐享数据来源
        this.knowledgeBase.lexiangData = {
            lastUpdated: new Date().toISOString(),
            source: 'CSIG教育空间',
            itemCount: lexiangData.length,
            items: lexiangData.map(item => ({
                id: item.id,
                title: item.title,
                content: item.content || '',
                source: item.source,
                relevance: item.relevance || 0.8
            }))
        };
        
        // 将乐享数据转换为知识库案例格式
        const lexiangCases = lexiangData.map((item, index) => {
            // 从乐享内容提取关键信息
            const content = item.content || '';
            const lines = content.split('\n').filter(l => l.trim());
            
            // 尝试提取合作伙伴
            const partnerMatch = content.match(/合作伙伴[：:]\s*([^\n]+)/) || 
                                 content.match(/与([^（(]+)（[^)]+）合作/) ||
                                 content.match(/([^\s,，]+大学|[^\s,，]+学院)/);
            const partner = partnerMatch ? partnerMatch[1].trim() : '腾讯教育生态';
            
            // 尝试提取成果描述
            const resultMatch = content.match(/成果[：:]\s*([^\n]+)/) || 
                               content.match(/实现了([^。]+)/) ||
                               content.match(/覆盖([^。]+)/);
            const results = resultMatch ? resultMatch[1].trim() : '推动教育数字化发展';
            
            return {
                id: `lexiang-case-${index}`,
                title: item.title || '教育合作项目',
                date: item.updatedAt ? item.updatedAt.split('T')[0] : '2025',
                partner: partner,
                content: lines[0] || content.substring(0, 100) + '...',
                results: results,
                category: '乐享知识库/动态案例',
                source: 'lexiang',
                url: item.url || '',
                relevance: item.relevance || 0.5
            };
        });
        
        // 合并到知识库cases数组
        if (!this.knowledgeBase.cases) {
            this.knowledgeBase.cases = [];
        }
        
        // 过滤掉已存在的乐享案例（避免重复）
        const existingIds = new Set(this.knowledgeBase.cases.map(c => c.id));
        const newCases = lexiangCases.filter(c => !existingIds.has(c.id));
        
        // 添加新案例
        this.knowledgeBase.cases.push(...newCases);
        
        console.log(`✅ 已合并 ${newCases.length} 条乐享案例到知识库（总计 ${this.knowledgeBase.cases.length} 条）`);
    }

    /**
     * 初始化案例使用历史记录
     */
    initCaseHistory() {
        if (!this.caseUsageHistory) {
            this.caseUsageHistory = new Map(); // caseId -> 使用次数
            this.recentlyUsedCases = []; // 最近使用的案例ID列表
            this.maxHistorySize = 20; // 保留最近20次使用的案例
        }
    }

    /**
     * 记录案例使用
     */
    recordCaseUsage(caseIds) {
        this.initCaseHistory();
        
        caseIds.forEach(caseId => {
            // 更新使用次数
            this.caseUsageHistory.set(caseId, (this.caseUsageHistory.get(caseId) || 0) + 1);
            
            // 添加到最近使用列表
            this.recentlyUsedCases.unshift(caseId);
        });
        
        // 限制历史记录大小
        if (this.recentlyUsedCases.length > this.maxHistorySize) {
            this.recentlyUsedCases = this.recentlyUsedCases.slice(0, this.maxHistorySize);
        }
    }

    /**
     * 打乱数组（Fisher-Yates洗牌算法）
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * 主题-案例智能匹配算法（增强版：支持随机化、轮换和历史记录）
     * 根据演讲主题自动选择最相关的案例，确保每次使用不同案例
     * @param {string} query - 演讲主题/查询
     * @param {number} maxCases - 最多返回的案例数量
     * @param {boolean} enableRandomization - 是否启用随机化（默认true）
     * @returns {Array} - 推荐案例ID列表
     */
    matchCasesByTopic(query, maxCases = 3, enableRandomization = true) {
        this.initCaseHistory();
        
        if (!this.knowledgeBase || !this.knowledgeBase.topic_case_mapping) {
            console.log('未找到主题映射配置，使用随机默认案例');
            return this.selectRandomCases(['case-005', 'case-004', 'case-001', 'case-014', 'case-015', 'case-011', 'case-006', 'case-009', 'case-020', 'case-012'], maxCases);
        }

        const mapping = this.knowledgeBase.topic_case_mapping;
        const rules = mapping.matchingRules || [];
        
        // 提取查询中的关键词（简单分词）
        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(/[\s,，.。!！?？;:；：""''（）()]+/).filter(w => w.length > 1);
        
        console.log('主题匹配分析:', query, '| 关键词:', queryWords.join(', '));
        
        // 计算每个规则的匹配度
        const matchScores = rules.map(rule => {
            let score = 0;
            let matchedKeywords = [];
            
            // 检查关键词匹配
            rule.keywords.forEach(keyword => {
                const keywordLower = keyword.toLowerCase();
                // 完全匹配得分更高
                if (queryLower.includes(keywordLower)) {
                    score += 5;
                    matchedKeywords.push(keyword);
                }
                // 部分匹配
                else if (queryWords.some(w => w.includes(keywordLower) || keywordLower.includes(w))) {
                    score += 2;
                    if (!matchedKeywords.includes(keyword)) {
                        matchedKeywords.push(keyword);
                    }
                }
            });
            
            return {
                rule: rule,
                score: score,
                matchedKeywords: matchedKeywords,
                priority: rule.priority || 99
            };
        });
        
        // 过滤出有匹配的规则，并按匹配度排序
        const matchedRules = matchScores
            .filter(m => m.score > 0)
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return a.priority - b.priority;
            });
        
        console.log(`找到 ${matchedRules.length} 个匹配的主题规则`);
        matchedRules.slice(0, 3).forEach((m, i) => {
            console.log(`  匹配${i+1}: ${m.rule.name} (得分:${m.score}, 关键词:${m.matchedKeywords.join(',')})`);
        });
        
        // 收集所有匹配的案例池
        let candidateCasePool = [];
        
        matchedRules.forEach(match => {
            match.rule.recommendedCases.forEach(caseId => {
                const caseItem = this.getCaseById(caseId);
                if (caseItem) {
                    candidateCasePool.push({
                        id: caseId,
                        score: match.score,
                        priority: match.priority,
                        category: caseItem.category || '通用',
                        title: caseItem.title
                    });
                }
            });
        });
        
        // 如果没有匹配到主题，使用所有案例作为候选池
        if (candidateCasePool.length === 0) {
            console.log('未找到匹配主题，使用全部案例池');
            candidateCasePool = (this.knowledgeBase.cases || [])
                .filter(c => c.id)
                .map(c => ({
                    id: c.id,
                    score: 1,
                    priority: 99,
                    category: c.category || '通用',
                    title: c.title
                }));
        }
        
        // 按分数排序，分数相同则按优先级排序
        candidateCasePool.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.priority - b.priority;
        });
        
        // 去重（保留最高分的）
        const seen = new Set();
        const uniqueCandidates = [];
        candidateCasePool.forEach(c => {
            if (!seen.has(c.id)) {
                seen.add(c.id);
                uniqueCandidates.push(c);
            }
        });
        
        console.log(`候选案例池: ${uniqueCandidates.length} 个案例`);
        
        // 选择策略：多样化 + 随机化
        const selectedCases = this.selectCasesWithDiversityAndRandomization(uniqueCandidates, maxCases, enableRandomization);
        
        // 记录本次使用的案例
        this.recordCaseUsage(selectedCases);
        
        console.log('最终选中的案例:', selectedCases.join(', '));
        return selectedCases;
    }

    /**
     * 多样化 + 随机化的案例选择
     */
    selectCasesWithDiversityAndRandomization(candidates, maxCases, enableRandomization = true) {
        if (candidates.length <= maxCases) {
            return candidates.map(c => c.id);
        }
        
        const selected = [];
        const usedCategories = new Set();
        
        // 首先，优先选择不同类别的案例（确保多样性）
        const categoryGroups = {};
        candidates.forEach(c => {
            const mainCat = c.category.split('/')[0];
            if (!categoryGroups[mainCat]) categoryGroups[mainCat] = [];
            categoryGroups[mainCat].push(c);
        });
        
        // 对每个类别内的案例进行随机打乱
        if (enableRandomization) {
            Object.keys(categoryGroups).forEach(cat => {
                categoryGroups[cat] = this.shuffleArray(categoryGroups[cat]);
            });
        }
        
        // 第一轮：从每个类别中选择一个（确保多样性）
        const categories = Object.keys(categoryGroups);
        let catIndex = 0;
        
        while (selected.length < maxCases && catIndex < categories.length) {
            const cat = categories[catIndex];
            const availableInCat = categoryGroups[cat].filter(c => !selected.includes(c.id));
            
            if (availableInCat.length > 0) {
                selected.push(availableInCat[0].id);
                usedCategories.add(cat);
            }
            catIndex++;
        }
        
        // 第二轮：如果还有名额，从所有候选中随机选择
        if (selected.length < maxCases) {
            const remaining = candidates
                .filter(c => !selected.includes(c.id))
                .map(c => c.id);
            
            const shuffledRemaining = enableRandomization ? this.shuffleArray(remaining) : remaining;
            
            while (selected.length < maxCases && shuffledRemaining.length > 0) {
                selected.push(shuffledRemaining.shift());
            }
        }
        
        // 最后随机打乱返回顺序
        return enableRandomization ? this.shuffleArray(selected) : selected;
    }

    /**
     * 从列表中随机选择指定数量的案例（不考虑类别多样性）
     */
    selectRandomCases(caseIds, maxCases) {
        const shuffled = this.shuffleArray(caseIds);
        return shuffled.slice(0, Math.min(maxCases, caseIds.length));
    }
    
    /**
     * 根据ID获取案例详情
     */
    getCaseById(caseId) {
        if (!this.knowledgeBase || !this.knowledgeBase.cases) return null;
        return this.knowledgeBase.cases.find(c => c.id === caseId);
    }
    
    /**
     * 选择多样化的案例
     * 确保返回的案例来自不同类别
     */
    selectDiverseCases(caseIds, maxCases) {
        if (!caseIds || caseIds.length === 0) return [];
        
        const selected = [];
        const usedCategories = new Set();
        
        // 首先选择不同类别的案例
        for (const caseId of caseIds) {
            if (selected.length >= maxCases) break;
            
            const caseItem = this.getCaseById(caseId);
            if (!caseItem) continue;
            
            const category = caseItem.category || '通用';
            const mainCategory = category.split('/')[0];
            
            // 优先选择不同类别的案例
            if (!usedCategories.has(mainCategory)) {
                selected.push(caseId);
                usedCategories.add(mainCategory);
            }
        }
        
        // 如果还有名额，补充其他案例
        for (const caseId of caseIds) {
            if (selected.length >= maxCases) break;
            if (!selected.includes(caseId)) {
                selected.push(caseId);
            }
        }
        
        return selected;
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
            'case-006': '适合产教融合、特色人才培养、高职教育主题',
            'case-007': '适合职业教育、产业学院、数字文创人才培养主题',
            'case-008': '适合技能培训、云计算认证、高职就业导向主题',
            'case-009': '适合教育公平、乡村教育、公益帮扶主题',
            'case-010': '适合乡村振兴、边疆教育、民族地区教育主题',
            'case-011': '适合教师培训、信息化教学能力提升、师资建设主题',
            'case-012': '适合教育科研、学习科学、教育大数据研究主题',
            'case-013': '适合K12课程普及、区域教育信息化、政策落地主题',
            'case-014': '适合顶尖高校合作、前沿技术研究、产学研融合主题',
            'case-015': '适合智慧校园、高校信息化、数字治理主题',
            'case-016': '适合师范教育、教师培养、教学能力实训主题',
            'case-017': '适合公益项目、欠发达地区教育、编程普及主题',
            'case-018': '适合深度帮扶、边远地区教育、彝族地区教育主题',
            'case-019': '适合港澳合作、国际化教育、大湾区教育协同主题',
            'case-020': '适合开源教育、工程实践、社区贡献主题',
            'case-021': '适合青少年竞赛、创新人才培养、科技活动主题',
            'case-022': '适合智慧教室、教学环境改造、混合式教学主题',
            'case-023': '适合AI伦理教育、数字素养、安全教育主题',
            'case-024': '适合开源生态、技术共建、社区协作主题'
        };
        return notes[caseId] || '';
    }

    /**
     * 根据查询检索相关知识（增强版，带智能案例匹配 + 随机化）
     * @param {string} query - 查询主题
     * @param {string} type - 演讲类型
     * @param {number} topK - 返回结果数量
     * @param {number} maxCases - 最多返回的案例数量（默认2个）
     * @param {boolean} useSmartMatching - 是否使用智能案例匹配（默认true）
     * @param {boolean} randomizeCases - 是否随机选择案例（默认true）
     */
    async retrieve(query, type = 'keynote', topK = 5, maxCases = 2, useSmartMatching = true, randomizeCases = true) {
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

        // 3. 检索案例 - 智能随机选择
        console.log(`🔀 案例随机化: ${randomizeCases ? '已启用' : '已禁用'}`);
        const relevantCases = this.searchCases(queryLower, maxCases, useSmartMatching, randomizeCases);
        results.push(...relevantCases);

        // 4. 检索乐享知识库数据
        const lexiangData = await this.searchLexiangKnowledge(queryLower, 2);
        if (lexiangData.length > 0) {
            results.push(...lexiangData);
        }

        // 5. 检索热点话题
        const hotTopics = this.searchHotTopics(queryLower);
        if (hotTopics.length > 0) {
            results.push(hotTopics[0]); // 最多1个热点话题
        }

        // 6. 根据演讲类型获取风格模板
        const styleTemplate = this.getStyleTemplate(type);
        
        // 7. 获取案例使用统计（调试用）
        const caseStats = this.getCaseUsageStats();
        console.log(`📊 案例使用统计: 已使用 ${caseStats.totalUniqueCases} 个不同案例`);
        
        return {
            context: this.formatContext(results.slice(0, topK)),
            style: styleTemplate,
            stats: this.getLatestStats(),
            policies: relevantPolicies,
            cases: relevantCases,
            lexiangData: lexiangData,
            selectedCases: relevantCases.slice(0, maxCases), // 明确返回选中的案例
            caseUsageStats: caseStats // 返回使用统计
        };
    }

    /**
     * 搜索乐享知识库数据
     */
    async searchLexiangKnowledge(query, maxResults = 2) {
        // 如果知识库中有lexiangData，从中搜索
        if (this.knowledgeBase?.lexiangData?.items && this.knowledgeBase.lexiangData.items.length > 0) {
            const items = this.knowledgeBase.lexiangData.items;
            console.log(`🔍 从乐享知识库搜索: "${query}", 可用数据: ${items.length} 条`);
            
            const scored = items.map(item => {
                let score = 0;
                const text = `${item.title} ${item.content || ''}`.toLowerCase();
                const queryLower = query.toLowerCase();
                
                // 标题包含查询词，高分
                if (item.title?.toLowerCase().includes(queryLower)) score += 10;
                
                // 内容包含查询词
                if (item.content?.toLowerCase().includes(queryLower)) score += 5;
                
                // 关键词匹配
                const keywords = queryLower.split(/\s+/).filter(k => k.length > 1);
                keywords.forEach(kw => {
                    if (text.includes(kw)) score += 2;
                });
                
                console.log(`  - ${item.title}: 匹配度 ${score}`);
                
                return { ...item, score };
            }).filter(item => item.score > 0)
              .sort((a, b) => b.score - a.score);
            
            // 如果有匹配项，返回匹配项；否则返回前几条数据
            const selectedItems = scored.length > 0 ? scored.slice(0, maxResults) : items.slice(0, maxResults);
            
            console.log(`✅ 乐享搜索返回 ${selectedItems.length} 条数据`);
            
            return selectedItems.map(item => ({
                type: 'lexiang',
                title: item.title,
                content: item.content || '',
                source: '乐享知识库',
                relevance: item.score ? Math.min(item.score / 10, 1) : 0.8
            }));
        }
        
        console.log('⚠️ 知识库中无乐享数据，尝试实时获取...');
        
        // 尝试实时获取
        try {
            const lexiangResults = await this.fetchLexiangData(query);
            if (lexiangResults && lexiangResults.length > 0) {
                console.log(`✅ 实时获取 ${lexiangResults.length} 条乐享数据`);
                return lexiangResults.slice(0, maxResults).map(item => ({
                    type: 'lexiang',
                    title: item.title,
                    content: item.content || '',
                    source: '乐享知识库',
                    relevance: item.relevance || 0.8
                }));
            }
        } catch (e) {
            console.log('乐享实时搜索失败:', e.message);
        }
        
        console.log('❌ 未找到乐享数据');
        return [];
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
     * 搜索案例 - 智能匹配并限制数量（增强版，支持主题映射 + 随机化）
     * @param {string} query - 查询关键词（演讲主题）
     * @param {number} maxResults - 最多返回的案例数量（默认2个）
     * @param {boolean} useSmartMatching - 是否使用智能主题匹配（默认true）
     * @param {boolean} enableRandomization - 是否启用案例随机化（默认true）
     */
    searchCases(query, maxResults = 2, useSmartMatching = true, enableRandomization = true) {
        if (!this.knowledgeBase?.cases) return [];

        let selectedCaseIds = [];
        let matchReason = '';

        // 优先使用智能主题匹配（带随机化）
        if (useSmartMatching && this.knowledgeBase.topic_case_mapping) {
            selectedCaseIds = this.matchCasesByTopic(query, maxResults, enableRandomization);
            matchReason = '基于主题智能随机匹配';
            console.log(`智能随机匹配结果: ${selectedCaseIds.join(', ')}`);
        }

        // 获取案例详情
        let selectedCases = this.getCaseDetails(selectedCaseIds).slice(0, maxResults);

        // 如果智能匹配未返回足够案例，使用传统关键词搜索补充
        if (selectedCases.length < maxResults) {
            const existingIds = new Set(selectedCases.map(c => c.id));
            const additionalCases = this.searchCasesByKeywords(query, maxResults * 3); // 多搜索一些以便随机选择
            
            // 随机打乱补充的案例
            const shuffledAdditional = enableRandomization ? 
                this.shuffleArray(additionalCases) : additionalCases;
            
            shuffledAdditional.forEach(caseItem => {
                if (!existingIds.has(caseItem.id) && selectedCases.length < maxResults) {
                    selectedCases.push({
                        ...caseItem,
                        matchSource: '关键词随机补充'
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
            matchSource: caseItem.matchSource || matchReason || '智能随机匹配'
        }));
    }

    /**
     * 获取案例使用统计（用于调试和优化）
     */
    getCaseUsageStats() {
        this.initCaseHistory();
        return {
            usageCount: Object.fromEntries(this.caseUsageHistory),
            recentlyUsed: this.recentlyUsedCases.slice(0, 10),
            totalUniqueCases: this.caseUsageHistory.size
        };
    }

    /**
     * 重置案例使用历史
     */
    resetCaseHistory() {
        this.caseUsageHistory = new Map();
        this.recentlyUsedCases = [];
        console.log('案例使用历史已重置');
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
        let lexiangCount = 0;
        
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
                case 'lexiang':
                    lexiangCount++;
                    context += `[乐享知识库${lexiangCount}] ${result.title}：${result.content}\n\n`;
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
