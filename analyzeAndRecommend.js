// Keyword-based schedule analysis and quest recommendation function
function analyzeAndRecommend(scheduleText) {
  // Ensure QUEST_DATABASE is available
  if (typeof QUEST_DATABASE === 'undefined') {
    console.error('QUEST_DATABASE is not loaded. Make sure to include quests.js before this file.');
    return [];
  }

  // 1. Define KEYWORDS dictionary
  const KEYWORDS = {
    busy: ['学习', '上课', '作业', '工作', '开会', '考试', '复习', 'ddl', '满课', '忙', '写代码', '实验'],
    relax: ['休息', '没事', '周末', '放假', '玩', '逛', '睡觉', '游戏', '追剧', '空', '无聊'],
    outdoor: ['出门', '买', '去', '跑', '散步', '外面', '天气', '运动'],
    tired: ['累', '困', '难受', '烦', '死', '痛', '不想动', 'eemo']
  };

  // 2. Keyword counting
  const counts = {
    busy: 0,
    relax: 0,
    outdoor: 0,
    tired: 0
  };

  const scheduleLower = scheduleText.toLowerCase();

  // Count occurrences of each keyword category
  Object.entries(KEYWORDS).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      if (scheduleLower.includes(keyword)) {
        counts[category]++;
      }
    });
  });

  // 3. Decision tree to determine tags
  let recommendedTags = [];

  // Priority 1: Tired state
  if (counts.tired > 0) {
    recommendedTags.push('tired', 'healing');
  }
  // Priority 2: Busy state
  else if (counts.busy > counts.relax) {
    recommendedTags.push('busy', 'indoor');
  }
  // Priority 3: Relaxed state
  else if (counts.relax >= counts.busy) {
    recommendedTags.push('free', 'outdoor');
  }
  // Default: No keywords matched
  else {
    // Random recommendation, no specific tags
  }

  // 4. Filter quests from database
  let candidateQuests = [];

  if (recommendedTags.length > 0) {
    // Filter quests that have at least one matching tag
    candidateQuests = QUEST_DATABASE.filter(quest => {
      return quest.tags.some(tag => recommendedTags.includes(tag));
    });
  }

  // If no matches, use all quests
  if (candidateQuests.length === 0) {
    candidateQuests = [...QUEST_DATABASE];
  }

  // 5. Select two quests, preferably with different types
  let questA, questB;

  // Shuffle the candidate quests
  const shuffled = candidateQuests.sort(() => 0.5 - Math.random());

  // Try to find quests with different types first
  const actionQuests = shuffled.filter(q => q.type === 'action');
  const mindQuests = shuffled.filter(q => q.type === 'mind');

  if (actionQuests.length > 0 && mindQuests.length > 0) {
    // If we have both types, pick one from each
    questA = actionQuests[Math.floor(Math.random() * actionQuests.length)];
    questB = mindQuests[Math.floor(Math.random() * mindQuests.length)];
  } else {
    // Otherwise, pick any two random quests
    questA = shuffled[0];
    questB = shuffled[1] || shuffled[0]; // Fallback if only one quest available
  }

  // Return the two quests
  return [questA, questB];
}

// Export the function for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = analyzeAndRecommend;
} else if (typeof window !== 'undefined') {
  window.analyzeAndRecommend = analyzeAndRecommend;
}