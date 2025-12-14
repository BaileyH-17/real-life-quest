// Generate quests based on user schedule keywords
function generateQuests(userSchedule) {
  // Ensure QUEST_DATABASE is available
  if (typeof QUEST_DATABASE === 'undefined') {
    console.error('QUEST_DATABASE is not loaded. Make sure to include quests.js before this file.');
    return [];
  }

  // Step 1: Keyword Extraction
  const matchedTags = [];
  const scheduleLower = userSchedule.toLowerCase();

  // Check for tired-related keywords
  if (scheduleLower.includes('累') || scheduleLower.includes('困') || 
      scheduleLower.includes('烦') || scheduleLower.includes('不想动')) {
    matchedTags.push('tired', 'indoor', 'mind');
  }

  // Check for free-related keywords
  if (scheduleLower.includes('玩') || scheduleLower.includes('逛') || 
      scheduleLower.includes('空') || scheduleLower.includes('周末')) {
    matchedTags.push('free', 'outdoor', 'action');
  }

  // Check for busy-related keywords
  if (scheduleLower.includes('课') || scheduleLower.includes('班') || 
      scheduleLower.includes('忙') || scheduleLower.includes('作业')) {
    matchedTags.push('busy', 'indoor');
  }

  // Step 2: Filter and Randomize
  let candidateQuests = [];

  if (matchedTags.length > 0) {
    // Filter quests that have at least one matched tag
    candidateQuests = QUEST_DATABASE.filter(quest => {
      return quest.tags.some(tag => matchedTags.includes(tag));
    });
  }

  // If no matches, use all quests
  if (candidateQuests.length === 0) {
    candidateQuests = [...QUEST_DATABASE];
  }

  // Step 3: Select two quests, preferably with different types
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
  module.exports = generateQuests;
} else if (typeof window !== 'undefined') {
  window.generateQuests = generateQuests;
}