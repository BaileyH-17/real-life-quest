// 全局变量
let schedules = [];
let editingScheduleId = null;

// 游戏化相关变量
let gameData = {
    xp: 0,
    medals: [],
    completedQuestsCount: 0,
    completedQuests: [],
    currentQuest: null,
    lastQuestDate: null,
    userInfo: {
        name: '超级爆炸龙',
        avatar: null
    }
};

// 勋章定义
const MEDALS = [
    { id: 'first_quest', name: '初次冒险', icon: '🏆', condition: { type: 'quests', value: 1 } },
    { id: 'explorer', name: '探索者', icon: '🗺️', condition: { type: 'quest_type', value: 'exploration', count: 5 } },
    { id: 'thinker', name: '思考者', icon: '🤔', condition: { type: 'quest_type', value: 'introspection', count: 5 } },
    { id: 'streak_3', name: '连续3天', icon: '🔥', condition: { type: 'streak', value: 3 } },
    { id: 'streak_7', name: '连续7天', icon: '🔥🔥', condition: { type: 'streak', value: 7 } },
    { id: 'streak_30', name: '连续30天', icon: '🔥🔥🔥', condition: { type: 'streak', value: 30 } },
    { id: 'xp_100', name: '百级达人', icon: '💯', condition: { type: 'xp', value: 100 } },
    { id: 'xp_500', name: '五百级达人', icon: '💪', condition: { type: 'xp', value: 500 } },
    { id: 'xp_1000', name: '千级大师', icon: '🌟', condition: { type: 'xp', value: 1000 } },
    { id: 'quests_10', name: '任务新手', icon: '🎯', condition: { type: 'quests', value: 10 } },
    { id: 'quests_50', name: '任务专家', icon: '🎯🎯', condition: { type: 'quests', value: 50 } },
    { id: 'quests_100', name: '任务大师', icon: '🎯🎯🎯', condition: { type: 'quests', value: 100 } },
    { id: 'explorer_10', name: '资深探索者', icon: '🧭', condition: { type: 'quest_type', value: 'exploration', count: 10 } },
    { id: 'explorer_20', name: '冒险王', icon: '🗡️', condition: { type: 'quest_type', value: 'exploration', count: 20 } },
    { id: 'thinker_10', name: '资深思考者', icon: '🧠', condition: { type: 'quest_type', value: 'introspection', count: 10 } },
    { id: 'thinker_20', name: '哲学大师', icon: '📚', condition: { type: 'quest_type', value: 'introspection', count: 20 } },
    { id: 'medals_5', name: '勋章收集者', icon: '🏅', condition: { type: 'medals', value: 5 } },
    { id: 'medals_10', name: '勋章大师', icon: '🏅🏅', condition: { type: 'medals', value: 10 } }
];

// 月历相关变量
let currentDate = new Date();
let selectedDate = new Date();

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// 初始化应用
function initApp() {
    // 加载本地存储数据
    loadData();
    
    // 初始化表单提交事件
    initForms();
    
    // 确保当前日期和选中日期都是今天，使用UTC方法避免时区问题
    const today = new Date();
    currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // 初始化月历
    initCalendar();
    
    // 渲染初始数据
    renderSchedules();
    renderDailySchedule();
    updateGameStats();
    renderMedals();
    
    // 初始化设置功能
    initSettings();
    
    // 渲染用户信息
    renderUserInfo();
    
    // 测试设置按钮事件绑定
    console.log('initApp completed');
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        console.log('Settings button found');
        // 直接绑定事件，确保能触发
        settingsBtn.onclick = function() {
            console.log('Settings button clicked');
            openSettingsModal();
        };
    } else {
        console.log('Settings button not found');
    }
}



// 更新游戏统计显示
function updateGameStats() {
    // 更新数值显示
    document.getElementById('xpDisplay').textContent = `${gameData.xp} XP`;
    document.getElementById('medalsDisplay').textContent = gameData.medals.length;
    document.getElementById('totalXpDisplay').textContent = gameData.xp;
    document.getElementById('totalMedalsDisplay').textContent = gameData.medals.length;
    document.getElementById('completedQuestsDisplay').textContent = gameData.completedQuestsCount;
    
    // 更新XP进度条
    // 假设每100 XP为一个等级，计算当前等级和进度
    const currentLevel = Math.floor(gameData.xp / 100);
    const progressInLevel = gameData.xp % 100;
    const progressPercentage = (progressInLevel / 100) * 100;
    
    // 更新进度条宽度
    const xpProgress = document.getElementById('xpProgress');
    if (xpProgress) {
        xpProgress.style.width = `${progressPercentage}%`;
    }
}

// 渲染每日日程
function renderDailySchedule() {
    const container = document.getElementById('dailyScheduleList');
    const selectedDateString = formatDateForStorage(selectedDate);
    
    // 过滤出选中日期的日程
    const filteredSchedules = schedules.filter(s => s.date === selectedDateString);
    
    // 按时间排序
    const sortedSchedules = [...filteredSchedules].sort((a, b) => {
        if (!a.startTime && !b.startTime) return 0;
        if (!a.startTime) return -1;
        if (!b.startTime) return 1;
        return a.startTime.localeCompare(b.startTime);
    });
    
    if (sortedSchedules.length === 0) {
        container.innerHTML = `
            <p class="text-sm text-slate-500 italic">空空如也...</p>
        `;
        return;
    }
    
    container.innerHTML = sortedSchedules.map(schedule => `
        <div class="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg transition-colors hover:bg-slate-100">
            <span class="text-xs font-medium text-slate-600">${schedule.startTime ? `${schedule.startTime} - ${schedule.endTime || ''}` : '全天'}</span>
            <span class="text-sm font-medium text-slate-800">${schedule.title}</span>
        </div>
    `).join('');
}

// 基于日程生成任务
function generateQuestsFromSchedule() {
    const selectedDateString = formatDateForStorage(selectedDate);
    
    // 检查今天是否已经领取过任务
    const today = formatDateForStorage(new Date());
    if (gameData.lastQuestDate === today) {
        showNotification('今天已经领取过任务了，明天再来吧！', 'info');
        return;
    }
    
    // 获取选中日期的日程
    const daySchedules = schedules.filter(s => s.date === selectedDateString);
    
    if (daySchedules.length === 0) {
        showNotification('请先添加当日日程', 'warning');
        return;
    }
    
    // 将日程转换为文本描述，包含开始和结束时间
    const scheduleText = daySchedules.map(s => `${s.startTime ? `${s.startTime}-${s.endTime || '无结束时间'} ` : ''}${s.title}`).join('；');
    
    // 显示加载状态
    const generateBtn = document.querySelector('.generate-btn');
    const originalText = generateBtn.textContent;
    generateBtn.textContent = '生成中...';
    generateBtn.disabled = true;
    
    try {
        // 使用本地关键词权重分析生成任务
        let quests = analyzeAndRecommend(scheduleText);
        
        // 转换quests格式以匹配原有系统要求
        quests = quests.map(quest => ({
            id: quest.id,
            type: quest.type === 'action' ? 'exploration' : 'introspection',
            title: quest.title,
            description: quest.description,
            reward: { xp: Math.floor(Math.random() * 11) + 15 } // 15-25 XP
        }));
        
        // 显示任务选择
        displayQuestOptions(quests);
    } catch (error) {
        console.error('生成任务失败:', error);
        // 显示错误信息
        showNotification('生成任务失败，请重试', 'error');
    } finally {
        // 恢复按钮状态
        generateBtn.textContent = originalText;
        generateBtn.disabled = false;
    }
}

// 显示任务选择模态框
function displayQuestOptions(quests) {
    // 获取正确的模态框元素
    const questOptionsContainer = document.querySelector('.quest-select-options');
    const modal = document.getElementById('questSelectModal');
    const modalContent = document.getElementById('questSelectContent');
    
    questOptionsContainer.innerHTML = '';
    
    quests.forEach((quest, index) => {
        const questElement = document.createElement('div');
        questElement.className = `quest-option ${quest.type} bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 transform transition-all duration-500 opacity-0 translate-y-4`;
        
        // 根据任务类型设置背景色
        const bgColor = quest.type === 'exploration' ? 'from-indigo-50 to-purple-50' : 'from-green-50 to-teal-50';
        questElement.innerHTML = `
            <div class="p-5 bg-gradient-to-br ${bgColor}">
                <div class="flex justify-between items-start mb-3">
                    <div class="quest-type text-xs font-medium px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">${quest.type === 'exploration' ? '动态探索类' : '静态内省类'}</div>
                    <div class="quest-reward flex items-center gap-1">
                        <span class="text-yellow-500">🎁</span>
                        <span class="text-sm font-semibold">${quest.reward.xp} XP</span>
                    </div>
                </div>
                <div class="quest-title text-lg font-bold text-slate-800 mb-2">${quest.title}</div>
                <div class="quest-description text-slate-600 mb-4">${quest.description}</div>
                
                <!-- 任务标签 -->
                <div class="quest-tags flex flex-wrap gap-2">
                    ${quest.tags ? quest.tags.map(tag => {
                        // 根据标签类型设置颜色
                        let tagColor = 'bg-slate-100 text-slate-700';
                        if (tag === 'busy' || tag === 'indoor') tagColor = 'bg-blue-100 text-blue-700';
                        if (tag === 'free' || tag === 'outdoor') tagColor = 'bg-green-100 text-green-700';
                        if (tag === 'tired' || tag === 'healing') tagColor = 'bg-purple-100 text-purple-700';
                        return `<span class="tag-item text-xs px-2 py-1 rounded-full ${tagColor}">${tag}</span>`;
                    }).join('') : ''}
                </div>
            </div>
        `;
        
        questElement.addEventListener('click', () => selectQuest(quest));
        questOptionsContainer.appendChild(questElement);
        
        // 添加延迟动画效果
        setTimeout(() => {
            questElement.style.opacity = '1';
            questElement.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // 显示模态框并添加动画
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
}

// 关闭任务选择模态框
function closeQuestSelectModal() {
    const modal = document.getElementById('questSelectModal');
    const modalContent = document.getElementById('questSelectContent');
    
    // 添加关闭动画
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
}

// 显示特定日期完成的任务模态框
function showCompletedQuestsModal(dateString) {
    // 检查是否已经有这个模态框，如果没有则创建
    let modal = document.getElementById('completedQuestsModal');
    if (!modal) {
        // 创建模态框元素
        modal = document.createElement('div');
        modal.id = 'completedQuestsModal';
        modal.className = 'modal fixed inset-0 z-50 hidden flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" id="modalOverlay"></div>
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden transform scale-95 opacity-0 transition-all duration-300">
                <div class="bg-indigo-600 p-6 text-white text-center relative overflow-hidden">
                    <h3 class="text-xl font-bold">完成的任务</h3>
                    <p id="modalDateTitle" class="text-indigo-100 text-sm mt-1"></p>
                    <button class="close absolute top-4 right-4 text-white/70 hover:text-white p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                        <span class="text-lg font-bold">×</span>
                    </button>
                </div>
                
                <div class="p-6 max-h-[60vh] overflow-y-auto">
                    <div id="completedQuestsList" class="space-y-4">
                        <!-- Completed quests will be generated by JS -->
                    </div>
                </div>
            </div>
        `;
        
        // 添加到文档中
        document.body.appendChild(modal);
        
        // 添加关闭事件 - 使用原生HTML关闭按钮，避免依赖Lucide
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeCompletedQuestsModal();
            });
        }
        
        // 添加遮罩层点击关闭事件
        const overlay = modal.querySelector('#modalOverlay');
        if (overlay) {
            overlay.addEventListener('click', function() {
                closeCompletedQuestsModal();
            });
        }
        
        // 点击模态框外部关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeCompletedQuestsModal();
            }
        });
    }
    
    // 获取并显示该日期的完成任务
    const completedQuestsOnDate = gameData.completedQuests.filter(q => q.date === dateString);
    const completedQuestsList = modal.querySelector('#completedQuestsList');
    const modalDateTitle = modal.querySelector('#modalDateTitle');
    
    // 设置日期标题
    modalDateTitle.textContent = formatDate(new Date(dateString));
    
    if (completedQuestsOnDate.length === 0) {
        completedQuestsList.innerHTML = `
            <div class="text-center py-10 text-slate-400 text-sm">
                该日期没有完成的任务
            </div>
        `;
    } else {
        completedQuestsList.innerHTML = completedQuestsOnDate.map(quest => `
            <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 transition-all hover:shadow-md">
                <div class="font-medium text-slate-800 mb-2">${quest.title}</div>
                <div class="text-sm text-slate-600 mb-3">${quest.description}</div>
                <div class="text-xs text-slate-500 mb-3">获得 ${quest.xp} XP</div>
                <div class="text-sm text-slate-700 mb-3">${quest.checkinText}</div>
                ${quest.imageData ? `
                    <div class="mt-3">
                        <img src="${quest.imageData}" alt="任务完成图片" class="w-full h-48 object-cover rounded-lg border border-slate-200">
                    </div>
                ` : ''}
            </div>
        `).join('');
    }
    
    // 显示模态框
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        const modalContent = modal.querySelector('.bg-white');
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
}

// 关闭完成任务模态框
function closeCompletedQuestsModal() {
    const modal = document.getElementById('completedQuestsModal');
    if (modal) {
        const modalContent = modal.querySelector('.bg-white');
        modalContent.style.opacity = '0';
        modalContent.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300);
    }
}

// 选择任务
function selectQuest(quest) {
    // 调试阶段：暂时移除每日任务限制
    // const today = formatDateForStorage(new Date());
    // if (gameData.lastQuestDate === today) {
    //     alert('每天只能领取一个任务，请明天再来领取！');
    //     return;
    // }
    
    // 关闭任务选择模态框
    closeQuestSelectModal();
    
    // 保存当前任务
    gameData.currentQuest = quest;
    
    // 调试阶段：暂时移除每日任务限制
    // gameData.lastQuestDate = today;
    
    // 将任务自动添加到当日日程
    addQuestToSchedule(quest);
    
    // 显示当前任务
    displayCurrentQuest();
    
    // 保存游戏数据
    saveGameData();
}

// 不再将任务添加到日程栏，直接在任务栏完成
function addQuestToSchedule(quest) {
    // 移除将任务添加到日程的逻辑，直接在任务栏完成
    return;
}

// 显示当前任务
function displayCurrentQuest() {
    const currentQuestContainer = document.getElementById('currentQuest');
    const quest = gameData.currentQuest;
    
    currentQuestContainer.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div class="current-quest-title text-lg font-bold text-slate-800 mb-2">${quest.title}</div>
            <div class="current-quest-description text-slate-600 mb-3">${quest.description}</div>
            <div class="quest-reward flex items-center gap-1 text-yellow-600 font-medium mb-4">
                <span>🎁</span>
                <span>奖励：${quest.reward.xp} XP</span>
            </div>
            <button class="start-quest-btn w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all transform active:scale-95">开始任务</button>
        </div>
    `;
    
    // 添加开始任务按钮事件监听器
    document.querySelector('.start-quest-btn').addEventListener('click', startQuest);
    
    // 显示当前任务区域，隐藏其他区域
    document.querySelector('.input-bubble').style.display = 'none';
    document.getElementById('currentQuestSection').style.display = 'block';
    document.getElementById('questCheckinSection').style.display = 'none';
}

// 开始任务
function startQuest() {
    // 显示任务打卡区域
    document.querySelector('.input-bubble').style.display = 'none';
    document.getElementById('currentQuestSection').style.display = 'none';
    document.getElementById('questCheckinSection').style.display = 'block';
}

// 完成任务打卡
function completeQuestCheckin() {
    const checkinText = document.getElementById('checkinText').value.trim();
    const checkinImage = document.getElementById('checkinImage').files[0];
    
    if (!checkinText) {
        showNotification('请分享你的完成感受', 'warning');
        return;
    }
    
    // 检查是否选择了图片
    if (!checkinImage) {
        showNotification('请添加一张图片', 'warning');
        return;
    }
    
    // 处理图片上传（这里仅模拟，实际应用中应上传到服务器）
    const handleImage = (imageData) => {
        console.log('Processing quest completion:', gameData.currentQuest);
        
        // 确保当前任务存在
        if (!gameData.currentQuest) {
            console.error('No current quest found!');
            showNotification('任务数据错误，请重试', 'error');
            return;
        }
        
        // 计算奖励
        const quest = gameData.currentQuest;
        const xpGain = quest.reward.xp;
        
        console.log('Current XP:', gameData.xp, 'XP Gain:', xpGain);
        
        // 更新游戏数据
        gameData.xp += xpGain;
        gameData.completedQuestsCount += 1;
        
        // 保存完成的任务信息，包括图片
        const completedQuest = {
            id: quest.id,
            title: quest.title,
            description: quest.description,
            type: quest.type,
            xp: xpGain,
            completedAt: new Date().toISOString(),
            date: formatDateForStorage(new Date()),
            checkinText: checkinText,
            imageData: imageData
        };
        
        gameData.completedQuests.push(completedQuest);
        
        console.log('Updated XP:', gameData.xp);
        
        // 检查是否获得新勋章
        checkMedals();
        
        // 重置当前任务
        gameData.currentQuest = null;
        
        // 更新显示
        updateGameStats();
        
        // 重新渲染日历，显示新的完成任务图片
        renderCalendar();
        
        // 显示成功消息
        showNotification(`任务完成！获得 ${xpGain} XP`, 'success');
        
        // 庆祝效果：撒花
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        
        // 重置界面
        resetQuestInterface();
        
        // 保存游戏数据
        saveGameData();
        console.log('Game data saved');
    };
    
    // 处理图片并完成任务
    const reader = new FileReader();
    reader.onload = function(e) {
        handleImage(e.target.result);
    };
    reader.onerror = function(error) {
        console.error('Image processing error:', error);
        showNotification('图片处理失败，请重试', 'error');
    };
    reader.readAsDataURL(checkinImage);
}

// 重置任务界面
function resetQuestInterface() {
    document.getElementById('checkinText').value = '';
    document.getElementById('checkinImage').value = '';
    
    // 显示任务生成区域，隐藏其他区域
    document.querySelector('.input-bubble').style.display = 'block';
    document.getElementById('currentQuestSection').style.display = 'none';
    document.getElementById('questCheckinSection').style.display = 'none';
}

// 检查勋章
function checkMedals() {
    MEDALS.forEach(medal => {
        if (!gameData.medals.includes(medal.id) && meetsMedalCondition(medal)) {
            gameData.medals.push(medal.id);
            showNotification(`恭喜获得新勋章：${medal.name} ${medal.icon}`, 'success');
        }
    });
}

// 检查是否满足勋章条件
function meetsMedalCondition(medal) {
    const condition = medal.condition;
    
    switch (condition.type) {
        case 'quests':
            return gameData.completedQuestsCount >= condition.value;
        case 'xp':
            return gameData.xp >= condition.value;
        case 'streak':
            // 简单实现，实际应用中应记录连续天数
            return gameData.completedQuestsCount >= condition.value;
        case 'quest_type':
            // 简单实现，实际应用中应记录不同类型任务的完成数量
            return gameData.completedQuestsCount >= condition.count;
        case 'medals':
            // 检查已获得的勋章数量
            return gameData.medals.length >= condition.value;
        default:
            return false;
    }
}

// 渲染勋章
function renderMedals() {
    const medalsGrid = document.getElementById('medalsGrid');
    
    medalsGrid.innerHTML = MEDALS.map(medal => {
        const isUnlocked = gameData.medals.includes(medal.id);
        return `
            <div class="medal-item rounded-xl p-4 transition-all duration-300 cursor-pointer ${isUnlocked ? 'bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md hover:shadow-lg transform hover:-translate-y-1' : 'bg-slate-50 opacity-50 grayscale'}" title="${isUnlocked ? medal.name : '未解锁'}">
                <div class="medal-icon text-3xl mb-2 transition-all duration-300 ${isUnlocked ? 'animate-pulse' : ''}">${medal.icon}</div>
                <div class="medal-name text-xs font-medium ${isUnlocked ? 'text-indigo-600' : 'text-slate-400'}">${medal.name}</div>
            </div>
        `;
    }).join('');
}

// --------------------- 月历功能 --------------------- 

// 初始化月历
function initCalendar() {
    renderCalendar();
    updateSelectedDateDisplay();
    renderTimeline();
}

// 渲染月历
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 更新当前月份显示
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    document.getElementById('currentMonth').textContent = `${year}年 ${monthNames[month]}`;
    
    const calendarGrid = document.getElementById('calendarGrid');
    
    // 清空现有内容
    calendarGrid.innerHTML = '';
    
    // 添加星期标题
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    dayNames.forEach(dayName => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day calendar-day-name';
        dayElement.textContent = dayName;
        calendarGrid.appendChild(dayElement);
    });
    
    // 获取当月第一天和最后一天
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 获取当月第一天是星期几
    const startDay = firstDay.getDay();
    
    // 获取上个月最后一天
    const prevMonthLastDay = new Date(year, month, 0);
    
    // 计算需要显示的总天数
    const totalDays = startDay + lastDay.getDate();
    
    // 生成日历天数
    for (let i = 0; i < totalDays; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        let day;
        let dayDate;
        
        if (i < startDay) {
            // 上个月的天数
            day = prevMonthLastDay.getDate() - startDay + i + 1;
            dayDate = new Date(year, month - 1, day);
            dayElement.classList.add('other-month');
        } else {
            // 当月的天数
            day = i - startDay + 1;
            dayDate = new Date(year, month, day);
        }
        
        // 设置日期文本
        dayElement.textContent = day;
        
        // 检查是否是今天
        const today = new Date();
        if (dayDate.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        // 检查是否是选中日期
        if (dayDate.toDateString() === selectedDate.toDateString()) {
            dayElement.classList.add('selected');
        }
        
        // 添加日期点击事件
        dayElement.addEventListener('click', function() {
            selectDate(dayDate);
        });
        
        // 添加日程标记
        const dateString = formatDateForStorage(dayDate);
        const hasSchedule = schedules.some(s => s.date === dateString);
        
        if (hasSchedule) {
            const scheduleMarker = document.createElement('div');
            scheduleMarker.className = 'schedule-marker';
            dayElement.appendChild(scheduleMarker);
        }
        
        // 添加完成任务图片标记
        const completedQuestsOnDate = gameData.completedQuests.filter(q => q.date === dateString);
        if (completedQuestsOnDate.length > 0) {
            // 添加任务完成标记
            const questMarker = document.createElement('div');
            questMarker.className = 'quest-marker';
            questMarker.textContent = '🎮';
            questMarker.title = `${completedQuestsOnDate.length}个完成的任务`;
            questMarker.style.position = 'absolute';
            questMarker.style.bottom = '2px';
            questMarker.style.right = '2px';
            questMarker.style.fontSize = '12px';
            dayElement.appendChild(questMarker);
            
            // 为标记添加点击事件，避免与日期选择冲突
            questMarker.addEventListener('click', function(e) {
                e.stopPropagation(); // 阻止事件冒泡
                showCompletedQuestsModal(dateString);
            });
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

// 切换月份
function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
}

// 选择日期
function selectDate(date) {
    // 创建一个新的日期对象，只保留年月日，避免时区问题
    selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // 重新渲染日历和数据
    renderCalendar();
    updateSelectedDateDisplay();
    renderSchedules();
    renderTimeline();
    renderDailySchedule(); // 更新每日日程显示
}

// 更新选中日期显示
function updateSelectedDateDisplay() {
    const formattedDate = formatDate(selectedDate);
    const selectedDateDisplay = document.getElementById('selectedDateDisplay');
    if (selectedDateDisplay) {
        selectedDateDisplay.textContent = formattedDate;
    }
    const selectedDateDisplayQuest = document.getElementById('selectedDateDisplayQuest');
    if (selectedDateDisplayQuest) {
        selectedDateDisplayQuest.textContent = formattedDate;
    }
}

// 格式化日期用于存储，避免时区问题
function formatDateForStorage(date) {
    if (typeof date === 'string') {
        return date; // 如果已经是字符串格式，直接返回
    }
    // 使用UTC方法确保日期格式正确，不受时区影响
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 初始化表单提交事件
function initForms() {
    // 日程表单
    const scheduleForm = document.getElementById('scheduleForm');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSchedule();
        });
    }
    
    // 任务打卡表单
    const questCheckinForm = document.getElementById('questCheckinForm');
    if (questCheckinForm) {
        questCheckinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            completeQuestCheckin();
        });
    }
    
    // 设置表单
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSettings();
        });
    }
}

// 初始化设置功能
function initSettings() {
    // 绑定头像上传事件
    const avatarUpload = document.getElementById('avatarUpload');
    if (avatarUpload) {
        avatarUpload.addEventListener('change', handleAvatarUpload);
    }
    
    // 绑定更改头像按钮事件
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', function() {
            document.getElementById('avatarUpload').click();
        });
    }
    
    // 绑定更改昵称按钮事件
    const changeNameBtn = document.getElementById('changeNameBtn');
    if (changeNameBtn) {
        changeNameBtn.addEventListener('click', function() {
            document.getElementById('nameInputPanel').classList.remove('hidden');
            // 设置当前昵称
            document.getElementById('userName').value = gameData.userInfo.name;
        });
    }
    
    // 绑定取消更改昵称按钮事件
    const cancelNameBtn = document.getElementById('cancelNameBtn');
    if (cancelNameBtn) {
        cancelNameBtn.addEventListener('click', function() {
            document.getElementById('nameInputPanel').classList.add('hidden');
        });
    }
    
    // 绑定保存昵称按钮事件
    const saveNameBtn = document.getElementById('saveNameBtn');
    if (saveNameBtn) {
        saveNameBtn.addEventListener('click', function() {
            const userName = document.getElementById('userName').value.trim();
            if (!userName) {
                showNotification('请输入昵称', 'warning');
                return;
            }
            // 更新用户信息
            gameData.userInfo.name = userName;
            // 保存到本地存储
            saveGameData();
            // 重新渲染用户信息
            renderUserInfo();
            // 隐藏输入面板
            document.getElementById('nameInputPanel').classList.add('hidden');
            // 显示保存成功提示
            showNotification('昵称已更新', 'success');
        });
    }
    
    // 绑定系统初始化按钮事件
    const initSystemBtn = document.getElementById('initSystemBtn');
    if (initSystemBtn) {
        initSystemBtn.addEventListener('click', initSystem);
    }
    
    // 绑定设置模态框关闭事件
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        // 点击关闭按钮
        const closeBtn = settingsModal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeSettingsModal);
        }
        
        // 点击模态框外部
        settingsModal.addEventListener('click', function(e) {
            if (e.target === settingsModal) {
                closeSettingsModal();
            }
        });
    }
}

// --------------------- 日程管理功能 --------------------- 

// 打开日程模态框
function openScheduleModal(scheduleId = null) {
    const modal = document.getElementById('scheduleModal');
    const modalContent = modal.querySelector('.absolute.bottom-0.left-0.right-0');
    const modalTitle = document.getElementById('scheduleModalTitle');
    const form = document.getElementById('scheduleForm');
    const scheduleDateInput = document.getElementById('scheduleDate');
    
    if (scheduleId) {
        // 编辑模式
        editingScheduleId = scheduleId;
        const schedule = schedules.find(s => s.id === scheduleId);
        if (schedule) {
            modalTitle.textContent = '编辑日程';
            document.getElementById('scheduleId').value = schedule.id;
            document.getElementById('scheduleTitle').value = schedule.title;
            scheduleDateInput.value = schedule.date;
            document.getElementById('scheduleStartTime').value = schedule.startTime || '';
            document.getElementById('scheduleEndTime').value = schedule.endTime || '';
        }
    } else {
        // 添加模式
        editingScheduleId = null;
        modalTitle.textContent = '添加日程';
        form.reset();
        // 设置默认日期为选中日期
        scheduleDateInput.value = formatDateForStorage(selectedDate);
    }
    
    // 显示模态框并添加动画
    modal.classList.remove('hidden');
    setTimeout(() => {
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
    }, 10);
}

// 关闭日程模态框
function closeScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    const modalContent = modal.querySelector('.absolute.bottom-0.left-0.right-0');
    
    // 添加关闭动画
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'translateY(100%)';
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// 保存日程
function saveSchedule() {
    const id = document.getElementById('scheduleId').value || generateId();
    const title = document.getElementById('scheduleTitle').value;
    const date = document.getElementById('scheduleDate').value;
    const startTime = document.getElementById('scheduleStartTime').value;
    const endTime = document.getElementById('scheduleEndTime').value;
    const description = ''; // scheduleDescription元素在当前HTML中不存在，默认为空字符串
    
    // 检查是否是编辑模式，如果是则保留原有状态，否则默认为未完成
    const existingSchedule = schedules.find(s => s.id === id);
    const completed = existingSchedule ? existingSchedule.completed || false : false;
    
    // 直接使用日期选择器的值，不进行任何转换，避免时区问题
    const schedule = {
        id,
        title,
        date,
        startTime,
        endTime,
        description,
        completed,
        createdAt: new Date().toISOString()
    };
    
    if (editingScheduleId) {
        // 更新现有日程
        const index = schedules.findIndex(s => s.id === editingScheduleId);
        if (index !== -1) {
            schedules[index] = schedule;
        }
    } else {
        // 添加新日程
        schedules.push(schedule);
    }
    
    // 保存到本地存储
    saveData();
    // 重新渲染
    renderCalendar();
    renderSchedules();
    renderTimeline();
    renderDailySchedule(); // 更新任务界面的日程列表
    // 关闭模态框
    closeScheduleModal();
}

// 删除日程
function deleteSchedule(id) {
    if (confirm('确定要删除这个日程吗？')) {
        schedules = schedules.filter(s => s.id !== id);
        saveData();
        renderCalendar();
        renderSchedules();
        renderTimeline();
        renderDailySchedule(); // 更新任务界面的日程列表
    }
}

// 切换日程完成状态
function toggleScheduleComplete(id) {
    const schedule = schedules.find(s => s.id === id);
    if (schedule) {
        // 更新完成状态
        schedule.completed = !schedule.completed;
        
        // 保存日程数据
        saveData();
        renderCalendar();
        renderSchedules();
        renderTimeline();
        renderDailySchedule(); // 更新任务界面的日程列表
    }
}

// 渲染日程列表
function renderSchedules() {
    const container = document.getElementById('scheduleList');
    const selectedDateString = formatDateForStorage(selectedDate);
    
    // 过滤出选中日期的日程
    const filteredSchedules = schedules.filter(s => s.date === selectedDateString);
    
    // 按完成状态和时间排序：未完成的在前，已完成的在后，都按时间排序
    const sortedSchedules = [...filteredSchedules].sort((a, b) => {
        // 已完成的排在后面
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        
        // 都未完成或都已完成，按时间排序
        if (!a.startTime && !b.startTime) return 0;
        if (!a.startTime) return -1;
        if (!b.startTime) return 1;
        return a.startTime.localeCompare(b.startTime);
    });
    
    if (sortedSchedules.length === 0) {
        container.innerHTML = `
            <div class="text-center py-10 text-slate-400 text-sm">
                暂无日程，去添加一个吧！
            </div>
        `;
        return;
    }
    
    container.innerHTML = sortedSchedules.map(schedule => `
        <div class="schedule-item bg-white rounded-xl shadow-sm border border-slate-100 p-4 transition-all hover:shadow-md ${schedule.completed ? 'opacity-70' : ''}" data-schedule-id="${schedule.id}">
            <div class="flex justify-between items-start mb-3">
                <div class="flex items-start gap-2">
                    <button class="p-1 hover:bg-slate-100 rounded-full transition-colors" onclick="toggleScheduleComplete('${schedule.id}')" title="${schedule.completed ? '标记为未完成' : '标记为完成'}">
                        ${schedule.completed ? '✅' : '⬜'}
                    </button>
                    <div class="flex-1">
                        <div class="font-medium text-slate-800 ${schedule.completed ? 'line-through' : ''}">${schedule.title}</div>
                        <div class="text-xs text-slate-500 mt-1">
                            ${schedule.startTime ? `${schedule.startTime} - ${schedule.endTime || ''}` : '全天'}
                        </div>
                    </div>
                </div>
                <div class="flex gap-1">
                    <button class="p-1 hover:bg-slate-100 rounded-full transition-colors" onclick="openScheduleModal('${schedule.id}')" title="编辑">
                        <i data-lucide="edit" class="w-4 h-4 text-slate-400"></i>
                    </button>
                    <button class="p-1 hover:bg-slate-100 rounded-full transition-colors" onclick="deleteSchedule('${schedule.id}')" title="删除">
                        <i data-lucide="trash-2" class="w-4 h-4 text-slate-400"></i>
                    </button>
                </div>
            </div>
            ${schedule.description ? `<div class="text-sm text-slate-600 pl-7">${schedule.description}</div>` : ''}
        </div>
    `).join('');
    
    // 添加长按事件监听器
    addLongPressEventListeners();
}

// 添加长按事件监听器
function addLongPressEventListeners() {
    const scheduleItems = document.querySelectorAll('.schedule-item');
    let longPressTimer;
    
    scheduleItems.forEach(item => {
        // 鼠标事件（用于桌面）
        item.addEventListener('mousedown', (e) => {
            startLongPress(e, item);
        });
        
        item.addEventListener('mouseup', cancelLongPress);
        item.addEventListener('mouseleave', cancelLongPress);
        
        // 触摸事件（用于移动设备）
        item.addEventListener('touchstart', (e) => {
            startLongPress(e, item);
        });
        
        item.addEventListener('touchend', cancelLongPress);
        item.addEventListener('touchcancel', cancelLongPress);
    });
    
    function startLongPress(e, item) {
        longPressTimer = setTimeout(() => {
            showContextMenu(e, item.dataset.scheduleId);
        }, 500); // 500ms长按阈值
    }
    
    function cancelLongPress() {
        clearTimeout(longPressTimer);
    }
}

// 显示上下文菜单
function showContextMenu(event, scheduleId) {
    // 移除现有的上下文菜单
    hideContextMenu();
    
    // 创建上下文菜单
    const contextMenu = document.createElement('div');
    contextMenu.id = 'contextMenu';
    contextMenu.className = 'context-menu fixed z-50 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 transition-all duration-200 opacity-0 transform scale-95';
    contextMenu.innerHTML = `
        <div class="context-menu-item flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-indigo-50 cursor-pointer transition-colors" onclick="openScheduleModal('${scheduleId}'); hideContextMenu();">
            <i data-lucide="edit" class="w-4 h-4 text-indigo-500"></i>
            编辑
        </div>
        <div class="context-menu-item flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer transition-colors" onclick="deleteSchedule('${scheduleId}'); hideContextMenu();">
            <i data-lucide="trash-2" class="w-4 h-4 text-red-500"></i>
            删除
        </div>
    `;
    
    // 添加到文档
    document.body.appendChild(contextMenu);
    
    // 设置位置
    const rect = event.target.getBoundingClientRect();
    let x = event.clientX;
    let y = event.clientY;
    
    // 确保菜单在视窗内
    const menuWidth = contextMenu.offsetWidth;
    const menuHeight = contextMenu.offsetHeight;
    
    if (x + menuWidth > window.innerWidth) {
        x = window.innerWidth - menuWidth - 10;
    }
    
    if (y + menuHeight > window.innerHeight) {
        y = window.innerHeight - menuHeight - 10;
    }
    
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    
    // 显示菜单（添加动画）
    setTimeout(() => {
        contextMenu.style.opacity = '1';
        contextMenu.style.transform = 'scale(1)';
    }, 10);
    
    // 添加点击外部关闭菜单
    document.addEventListener('click', hideContextMenu);
    
    // 重新初始化Lucide图标
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// 隐藏上下文菜单
function hideContextMenu() {
    const contextMenu = document.getElementById('contextMenu');
    if (contextMenu) {
        // 添加关闭动画
        contextMenu.style.opacity = '0';
        contextMenu.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            contextMenu.remove();
        }, 200);
        
        // 移除事件监听器
        document.removeEventListener('click', hideContextMenu);
    }
}

// 渲染时间轴 - 注意：scheduleTimeline元素在当前HTML中不存在，已简化该函数
function renderTimeline() {
    // 该函数在当前HTML结构中没有对应的容器，因此简化处理
    // 我们将直接使用renderSchedules函数来显示日程
    return;
}

// --------------------- 本地存储功能 --------------------- 

// 保存数据到本地存储
function saveData() {
    localStorage.setItem('schedules', JSON.stringify(schedules));
    saveGameData();
}

// 保存游戏数据到本地存储
function saveGameData() {
    localStorage.setItem('gameData', JSON.stringify(gameData));
}

// 从本地存储加载数据
function loadData() {
    const savedSchedules = localStorage.getItem('schedules');
    const savedGameData = localStorage.getItem('gameData');
    
    schedules = savedSchedules ? JSON.parse(savedSchedules) : [];
    gameData = savedGameData ? JSON.parse(savedGameData) : {
        xp: 0,
        medals: [],
        completedQuestsCount: 0,
        completedQuests: [],
        currentQuest: null,
        lastQuestDate: null
    };
    
    // 确保所有必要字段都存在
    if (!gameData.hasOwnProperty('lastQuestDate')) {
        gameData.lastQuestDate = null;
    }
    
    if (!gameData.hasOwnProperty('completedQuestsCount')) {
        // 转换旧数据格式
        gameData.completedQuestsCount = gameData.completedQuests || 0;
        if (typeof gameData.completedQuests === 'number') {
            gameData.completedQuests = [];
        }
    }
    
    if (!gameData.hasOwnProperty('completedQuests')) {
        gameData.completedQuests = [];
    }
}

// --------------------- 工具函数 --------------------- 

// 生成唯一ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 格式化日期
function formatDate(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
}

// 点击模态框外部关闭模态框
window.onclick = function(event) {
    const scheduleModal = document.getElementById('scheduleModal');
    const questSelectModal = document.getElementById('questSelectModal');
    const settingsModal = document.getElementById('settingsModal');
    
    if (event.target === scheduleModal) {
        closeScheduleModal();
    }
    if (event.target === questSelectModal) {
        closeQuestSelectModal();
    }
    if (event.target === settingsModal) {
        closeSettingsModal();
    }
}

// --------------------- 自定义通知功能 --------------------- 

// 显示自定义通知
function showNotification(message, type = 'info') {
    // 获取通知元素
    const notification = document.getElementById('notification');
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationTitle = document.getElementById('notificationTitle');
    const notificationMessage = document.getElementById('notificationMessage');
    
    // 设置通知类型和内容
    const types = {
        info: { icon: 'ℹ️', title: '提示', color: '#6366f1' },
        success: { icon: '✅', title: '成功', color: '#10b981' },
        warning: { icon: '⚠️', title: '警告', color: '#f59e0b' },
        error: { icon: '❌', title: '错误', color: '#ef4444' }
    };
    
    const config = types[type] || types.info;
    notificationIcon.textContent = config.icon;
    notificationTitle.textContent = config.title;
    notificationMessage.textContent = message;
    
    // 显示通知
    notification.classList.remove('hidden');
    notification.style.transform = 'translateY(0) scale(1)';
    notification.style.opacity = '1';
    
    // 3秒后自动隐藏
    setTimeout(hideNotification, 3000);
}

// 隐藏自定义通知
function hideNotification() {
    const notification = document.getElementById('notification');
    notification.style.transform = 'translateY(-20px) scale(0.95)';
    notification.style.opacity = '0';
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 300);
}

// --------------------- 设置功能 --------------------- 

// 打开设置模态框
function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (!modal) {
        console.error('Settings modal not found');
        return;
    }
    
    const modalContent = modal.querySelector('.bg-white');
    if (!modalContent) {
        console.error('Modal content not found');
        return;
    }
    
    // 重置面板状态
    document.getElementById('nameInputPanel').classList.add('hidden');
    
    // 显示模态框
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // 添加动画
    setTimeout(() => {
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
    
    console.log('Settings modal opened');
}

// 关闭设置模态框
function closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    
    const modalContent = modal.querySelector('.bg-white');
    if (!modalContent) return;
    
    // 添加关闭动画
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        // 重置面板状态
        document.getElementById('nameInputPanel').classList.add('hidden');
    }, 300);
}

// 处理头像上传
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        showNotification('请选择图片文件', 'warning');
        return;
    }
    
    // 读取文件
    const reader = new FileReader();
    reader.onload = function(e) {
        gameData.userInfo.avatar = e.target.result;
        // 保存到本地存储
        saveGameData();
        // 重新渲染用户信息
        renderUserInfo();
        // 显示成功提示
        showNotification('头像已更新', 'success');
    };
    reader.readAsDataURL(file);
}

// 更新头像预览
function updateAvatarPreview() {
    // 头像预览现在在个人资料界面，不在设置模态框中
    const profileAvatar = document.querySelector('.profile-stats + .bg-indigo-600 .w-20');
    if (profileAvatar) {
        if (gameData.userInfo.avatar) {
            // 如果有头像图片，使用图片
            profileAvatar.innerHTML = `<img src="${gameData.userInfo.avatar}" alt="头像" class="w-full h-full rounded-full object-cover border-2 border-white/30 shadow-lg">`;
        } else {
            // 否则使用默认头像
            profileAvatar.innerHTML = '😎';
        }
    }
}

// 保存设置功能已拆分到单独的按钮事件中，不再需要此函数

// 渲染用户信息
function renderUserInfo() {
    // 更新个人资料界面的用户名
    const profileName = document.querySelector('.profile-stats + .bg-indigo-600 h2');
    if (profileName) {
        profileName.textContent = gameData.userInfo.name;
    }
    
    // 更新头像预览
    updateAvatarPreview();
}

// 系统初始化
function initSystem() {
    if (confirm('确定要初始化所有数据吗？此操作不可恢复！')) {
        // 清除所有本地存储数据
        localStorage.removeItem('schedules');
        localStorage.removeItem('gameData');
        
        // 重新加载页面
        location.reload();
    }
}
