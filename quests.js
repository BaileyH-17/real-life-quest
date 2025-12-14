const QUEST_DATABASE = [
  // Busy scenarios
  {
    id: "busy_1",
    title: "快速整理桌面",
    description: "在工作间隙花5分钟整理你的桌面，保持整洁的工作环境",
    tags: ["busy", "indoor", "quick"],
    type: "action"
  },
  {
    id: "busy_2",
    title: "高效笔记整理",
    description: "将今天的会议笔记整理成清晰的要点，提高工作效率",
    tags: ["busy", "indoor", "mind"],
    type: "mind"
  },
  {
    id: "busy_3",
    title: "短时间运动",
    description: "在忙碌的工作日中，抽出10分钟做一组简单的拉伸运动",
    tags: ["busy", "indoor", "action"],
    type: "action"
  },
  {
    id: "busy_4",
    title: "快速冥想",
    description: "利用5分钟进行深呼吸冥想，缓解工作压力",
    tags: ["busy", "indoor", "mind"],
    type: "mind"
  },
  {
    id: "busy_5",
    title: "高效回复邮件",
    description: "集中精力回复3封最重要的邮件，避免邮件堆积",
    tags: ["busy", "indoor", "mind"],
    type: "mind"
  },
  
  // Free scenarios
  {
    id: "free_1",
    title: "公园散步",
    description: "在附近的公园散步30分钟，享受大自然的美好",
    tags: ["free", "outdoor", "action"],
    type: "action"
  },
  {
    id: "free_2",
    title: "阅读一本新书",
    description: "找一个安静的角落，阅读30分钟你感兴趣的书籍",
    tags: ["free", "indoor", "mind"],
    type: "mind"
  },
  {
    id: "free_3",
    title: "尝试新的咖啡",
    description: "去附近的咖啡店，尝试一种你从未喝过的咖啡口味",
    tags: ["free", "outdoor", "action"],
    type: "action"
  },
  {
    id: "free_4",
    title: "学习新技能",
    description: "利用空闲时间学习15分钟新技能，比如编程、绘画或摄影",
    tags: ["free", "indoor", "mind"],
    type: "mind"
  },
  {
    id: "free_5",
    title: "拍摄风景照片",
    description: "带着手机或相机，去户外拍摄5张你认为美丽的风景照片",
    tags: ["free", "outdoor", "action"],
    type: "action"
  },
  {
    id: "free_6",
    title: "写日记",
    description: "记录今天的心情和感受，留下美好的回忆",
    tags: ["free", "indoor", "mind"],
    type: "mind"
  },
  {
    id: "free_7",
    title: "骑自行车兜风",
    description: "骑上自行车，在周边地区兜风1小时，享受微风拂面的感觉",
    tags: ["free", "outdoor", "action"],
    type: "action"
  },
  {
    id: "free_8",
    title: "听音乐放松",
    description: "找一张舒适的椅子，听30分钟你喜欢的音乐，放松身心",
    tags: ["free", "indoor", "mind"],
    type: "mind"
  },
  
  // Outdoor scenarios
  {
    id: "outdoor_1",
    title: "晨跑锻炼",
    description: "在清晨进行30分钟的跑步锻炼，呼吸新鲜空气",
    tags: ["outdoor", "action", "energetic"],
    type: "action"
  },
  {
    id: "outdoor_2",
    title: "野餐活动",
    description: "准备一些食物，和朋友或家人去公园野餐",
    tags: ["outdoor", "action", "free"],
    type: "action"
  },
  {
    id: "outdoor_3",
    title: "观察云朵",
    description: "躺在草地上，观察天上的云朵，发挥你的想象力",
    tags: ["outdoor", "mind", "free"],
    type: "mind"
  },
  {
    id: "outdoor_4",
    title: "徒步旅行",
    description: "选择一条适合的徒步路线，进行1-2小时的徒步旅行",
    tags: ["outdoor", "action", "energetic"],
    type: "action"
  },
  {
    id: "outdoor_5",
    title: "户外写生",
    description: "带上绘画工具，在户外找一个景物进行写生创作",
    tags: ["outdoor", "mind", "free"],
    type: "mind"
  },
  
  // Indoor scenarios
  {
    id: "indoor_1",
    title: "烹饪新菜品",
    description: "尝试烹饪一道你从未做过的新菜品，享受烹饪的乐趣",
    tags: ["indoor", "action", "free"],
    type: "action"
  },
  {
    id: "indoor_2",
    title: "整理衣柜",
    description: "整理你的衣柜，将衣物分类收纳，保持整洁",
    tags: ["indoor", "action", "busy"],
    type: "action"
  },
  {
    id: "indoor_3",
    title: "看一部电影",
    description: "选择一部你感兴趣的电影，放松地观看",
    tags: ["indoor", "mind", "free"],
    type: "mind"
  },
  {
    id: "indoor_4",
    title: "学习烹饪技巧",
    description: "观看烹饪视频，学习一个新的烹饪技巧",
    tags: ["indoor", "mind", "busy"],
    type: "mind"
  },
  {
    id: "indoor_5",
    title: "组装家具",
    description: "尝试组装一件新家具，锻炼你的动手能力",
    tags: ["indoor", "action", "energetic"],
    type: "action"
  },
  
  // Tired scenarios
  {
    id: "tired_1",
    title: "舒适的午睡",
    description: "在感到疲惫时，进行20分钟的午睡，恢复精力",
    tags: ["tired", "indoor", "mind"],
    type: "mind"
  },
  {
    id: "tired_2",
    title: "温水泡脚",
    description: "用温水泡脚15分钟，缓解疲劳感",
    tags: ["tired", "indoor", "action"],
    type: "action"
  },
  {
    id: "tired_3",
    title: "听舒缓音乐",
    description: "听一些舒缓的音乐，放松身心",
    tags: ["tired", "indoor", "mind"],
    type: "mind"
  },
  {
    id: "tired_4",
    title: "简单伸展",
    description: "做一些简单的伸展动作，缓解身体疲劳",
    tags: ["tired", "indoor", "action"],
    type: "action"
  },
  {
    id: "tired_5",
    title: "冥想放松",
    description: "进行10分钟的冥想，让大脑得到休息",
    tags: ["tired", "indoor", "mind"],
    type: "mind"
  },
  
  // Energetic scenarios
  {
    id: "energetic_1",
    title: "篮球运动",
    description: "和朋友一起打篮球，享受运动的快乐",
    tags: ["energetic", "outdoor", "action"],
    type: "action"
  },
  {
    id: "energetic_2",
    title: "学习新舞蹈",
    description: "学习一种新的舞蹈，释放你的活力",
    tags: ["energetic", "indoor", "action"],
    type: "action"
  },
  {
    id: "energetic_3",
    title: "创意写作",
    description: "发挥你的想象力，写一篇创意故事或诗歌",
    tags: ["energetic", "indoor", "mind"],
    type: "mind"
  },
  {
    id: "energetic_4",
    title: "爬山挑战",
    description: "挑战一座小山，享受登顶的成就感",
    tags: ["energetic", "outdoor", "action"],
    type: "action"
  },
  {
    id: "energetic_5",
    title: "学习新语言",
    description: "充满活力地学习30分钟新语言，挑战自己",
    tags: ["energetic", "indoor", "mind"],
    type: "mind"
  },
  
  // Social scenarios
  {
    id: "social_1",
    title: "与朋友聚餐",
    description: "约上好朋友一起聚餐，分享彼此的生活",
    tags: ["free", "outdoor", "action"],
    type: "action"
  },
  {
    id: "social_2",
    title: "电话问候家人",
    description: "给家人打个电话，问候他们的近况",
    tags: ["free", "indoor", "mind"],
    type: "mind"
  },
  {
    id: "social_3",
    title: "参加社交活动",
    description: "参加一场你感兴趣的社交活动，认识新朋友",
    tags: ["free", "outdoor", "action"],
    type: "action"
  },
  {
    id: "social_4",
    title: "写感谢信",
    description: "给帮助过你的人写一封感谢信，表达你的感激之情",
    tags: ["free", "outdoor", "action"],
    type: "mind"
  },
  
  // Introvert scenarios
  {
    id: "introvert_1",
    title: "独自品茶",
    description: "泡一杯你喜欢的茶，独自享受安静的时光",
    tags: ["free", "indoor", "mind"],
    type: "mind"
  },
  {
    id: "introvert_2",
    title: "室内瑜伽",
    description: "在家进行30分钟的瑜伽练习，保持身心平衡",
    tags: ["free", "indoor", "action"],
    type: "action"
  },
  {
    id: "introvert_3",
    title: "拼图游戏",
    description: "完成一幅拼图，锻炼你的专注力",
    tags: ["free", "indoor", "mind"],
    type: "mind"
  },
  {
    id: "introvert_4",
    title: "整理照片",
    description: "整理你的照片，回忆美好的时光",
    tags: ["free", "indoor", "action"],
    type: "action"
  },
  
  // Quick tasks
  {
    id: "quick_1",
    title: "喝一杯水",
    description: "提醒自己喝一杯水，保持身体水分",
    tags: ["busy", "indoor", "action"],
    type: "action"
  },
  {
    id: "quick_2",
    title: "远眺放松眼睛",
    description: "每隔一段时间，远眺窗外5分钟，保护眼睛",
    tags: ["busy", "indoor", "mind"],
    type: "mind"
  },
  {
    id: "quick_3",
    title: "整理背包",
    description: "花3分钟整理你的背包，确保物品齐全",
    tags: ["busy", "indoor", "action"],
    type: "action"
  },
  {
    id: "quick_4",
    title: "制定今日计划",
    description: "早上花5分钟制定今天的工作计划，提高效率",
    tags: ["busy", "indoor", "mind"],
    type: "mind"
  }
];

// Export the database for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QUEST_DATABASE;
} else if (typeof window !== 'undefined') {
  window.QUEST_DATABASE = QUEST_DATABASE;
}