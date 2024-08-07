let users = JSON.parse(localStorage.getItem('users')) || [
    {name: "הלל בן חמדה", prayer: "הצלחה בלימודים", emoji: "📚"},
    {name: "נתנאל איתמר בן מירה", prayer: "זיווג טוב ומתאים", emoji: "💍"},
    {name: "נחום זאב בן מרים", prayer: "הצלחה בלימודים", emoji: "📚"},
    {name: "אריאל בן סיגלית", prayer: "זיווג טוב ומתאים", emoji: "💍"},
    {name: "שי בן שירה", prayer: "זיווג טוב ומתאים", emoji: "💍"},
    {name: "משה בן רֵנָה", prayer: "להתפלל במניין נץ בקביעות", emoji: "🌅"},
    {name: "רונן בן מירה", prayer: "פרנסה בשפע בקלות ובשמחה", emoji: "💵"},
    {name: "נועם יששכר בן שולמית", prayer: "זיווג טוב ומתאים", emoji: "💍"},
    {name: "חגי שמעון בן שרית", prayer: "בריאות איתנה", emoji: "💪"},
    {name: "מנחם בן אסתר", prayer: "ס\"ד קניית דירה", emoji: "🏠"},
    {name: "איתמר בן נורית", prayer: "הצלחה בכל", emoji: "🎓"}
];

let currentUser = null;
let dailyCompletion = JSON.parse(localStorage.getItem('dailyCompletion')) || {};
const totalDays = 40;
let startDate = localStorage.getItem('startDate') ? new Date(localStorage.getItem('startDate')) : new Date();

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

function updateDaysRemaining() {
    const today = new Date();
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, totalDays - daysPassed);
    document.getElementById('daysRemaining').textContent = `נותרו ${daysRemaining} ימים`;

    anime({
        targets: '#countdownAnimation',
        innerHTML: [totalDays, daysRemaining],
        round: 1,
        easing: 'easeInOutExpo'
    });
}

function updateDailyProgress() {
    const completedToday = Object.values(dailyCompletion).filter(Boolean).length;
    const progress = (completedToday / users.length) * 100;
    anime({
        targets: '#dailyProgress',
        width: `${progress}%`,
        easing: 'easeInOutQuad',
        duration: 800
    });
    document.getElementById('completionStatus').textContent = `${completedToday} מתוך ${users.length} השלימו היום`;
}

function updatePersonalStats() {
    if (!currentUser) return;

    const userIndex = users.findIndex(user => user.name === currentUser);
    const userStats = JSON.parse(localStorage.getItem(`userStats_${userIndex}`)) || {
        totalCompletions: 0,
        streak: 0,
        lastCompletion: null
    };

    const statsContainer = document.getElementById('personalStats');
    statsContainer.innerHTML = `
        <div class="stat-box">
            <div class="stat-value">${userStats.totalCompletions}</div>
            <div class="stat-label">סך הכל השלמות</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${userStats.streak}</div>
            <div class="stat-label">רצף ימים</div>
        </div>
    `;
}

document.getElementById('userSelect').addEventListener('change', (e) => {
    currentUser = e.target.value;
    document.getElementById('markComplete').disabled = dailyCompletion[currentUser];
    showToast(`ברוך הבא, ${currentUser}!`);
    updatePersonalStats();
});

document.getElementById('markComplete').addEventListener('click', () => {
    if (currentUser) {
        dailyCompletion[currentUser] = true;
        localStorage.setItem('dailyCompletion', JSON.stringify(dailyCompletion));
        updateDailyProgress();
        document.getElementById('markComplete').disabled = true;
        showToast("כל הכבוד! סימנת את המזמור להיום.");
        triggerEmojiRain();
        updateUserStats();
    }
});

function updateUserStats() {
    const userIndex = users.findIndex(user => user.name === currentUser);
    let userStats = JSON.parse(localStorage.getItem(`userStats_${userIndex}`)) || {
        totalCompletions: 0,
        streak: 0,
        lastCompletion: null
    };

    const today = new Date().toDateString();

    userStats.totalCompletions++;

    if (userStats.lastCompletion === today) {
        // User has already completed today, do nothing
    } else if (userStats.lastCompletion === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()) {
        // User completed yesterday, increment streak
        userStats.streak++;
    } else {
        // User missed a day, reset streak
        userStats.streak = 1;
    }

    userStats.lastCompletion = today;

    localStorage.setItem(`userStats_${userIndex}`, JSON.stringify(userStats));
    updatePersonalStats();
}

function triggerEmojiRain() {
    const emojis = ['🙏', '✨', '💖', '🕯️', '📿', '🌟'];
    const rainContainer = document.getElementById('emojiRain');
    rainContainer.innerHTML = '';

    for (let i = 0; i < 50; i++) {
        const emoji = document.createElement('span');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = `${Math.random() * 100}%`;
        emoji.style.animationDuration = `${Math.random() * 2 + 1}s`;
        emoji.style.animationDelay = `${Math.random() * 2}s`;
        rainContainer.appendChild(emoji);
    }

    setTimeout(() => {
        rainContainer.innerHTML = '';
    }, 5000);
}

// Admin functionality
const adminBtn = document.getElementById('adminBtn');
const adminModal = document.getElementById('adminModal');
const closeBtn = document.getElementsByClassName('close')[0];
const loginBtn = document.getElementById('loginBtn');
const adminPanel = document.getElementById('adminPanel');
const addUserBtn = document.getElementById('addUserBtn');

adminBtn.onclick = () => {
    adminModal.style.display = "block";
    setTimeout(() => adminModal.classList.add('show'), 10);
}
closeBtn.onclick = () => {
    adminModal.classList.remove('show');
    setTimeout(() => adminModal.style.display = "none", 300);
}
window.onclick = (event) => {
    if (event.target == adminModal) {
        adminModal.classList.remove('show');
        setTimeout(() => adminModal.style.display = "none", 300);
    }
}

loginBtn.onclick = () => {
    if (document.getElementById('adminPassword').value === '1111') {
        document.getElementById('loginForm').style.display = 'none';
        adminPanel.style.display = 'block';
        showToast("ברוך הבא, מנהל!");
        updateAdminUserList();
    } else {
        showToast("סיסמה שגויה, נסה שוב.");
    }
}

addUserBtn.onclick = () => {
    const newName = document.getElementById('newUserName').value;
    const newPrayer = document.getElementById('newPrayerRequest').value;
    const newEmoji = document.getElementById('newPrayerEmoji').value;
    if (newName && newPrayer && newEmoji) {
        users.push({name: newName, prayer: newPrayer, emoji: newEmoji});
        updateUserList();
        updateAdminUserList();
        localStorage.setItem('users', JSON.stringify(users));
        showToast(`המשתמש ${newName} נוסף בהצלחה!`);
        document.getElementById('newUserName').value = '';
        document.getElementById('newPrayerRequest').value = '';
        document.getElementById('newPrayerEmoji').value = '';
    } else {
        showToast("אנא מלא את כל השדות.");
    }
}

function updateUserList() {
    const select = document.getElementById('userSelect');
    const prayerList = document.getElementById('prayerList');
    select.innerHTML = '<option value="">בחר את שמך</option>';
    prayerList.innerHTML = '';
    users.forEach((user, index) => {
        select.innerHTML += `<option value="${user.name}">${user.name}</option>`;
        const li = document.createElement('li');
        li.innerHTML = `<span>${user.emoji} ${user.name} - ${user.prayer}</span>`;
        li.style.opacity = '0';
        prayerList.appendChild(li);
        setTimeout(() => {
            anime({
                targets: li,
                opacity: 1,
                translateX: [20, 0],
                easing: 'easeOutQuad',
                duration: 500
            });
        }, index * 100);
    });
}

function updateAdminUserList() {
    const adminUserList = document.getElementById('adminUserList');
    adminUserList.innerHTML = '';
    users.forEach((user, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${user.name} - ${user.prayer} ${user.emoji}</span>
            <button onclick="removeUser(${index})">הסר</button>
        `;
        adminUserList.appendChild(li);
    });
}

function removeUser(index) {
    const removedUser = users.splice(index, 1)[0];
    updateUserList();
    updateAdminUserList();
    localStorage.setItem('users', JSON.stringify(users));
    showToast(`המשתמש ${removedUser.name} הוסר בהצלחה.`);
}

function displayPsalm() {
    const psalm = `מִזְמוֹר לְתוֹדָה: הָרִיעוּ לַיהוָה כָּל הָאָרֶץ׃
    עִבְדוּ אֶת־יְהוָה בְּשִׂמְחָה בֹּאוּ לְפָנָיו בִּרְנָנָה׃
    דְּעוּ כִּי יְהוָה הוּא אֱלֹהִים הוּא־עָשָׂנוּ ולא [וְלוֹ] אֲנַחְנוּ עַמּוֹ וְצֹאן מַרְעִיתוֹ׃
    בֹּאוּ שְׁעָרָיו בְּתוֹדָה חֲצֵרֹתָיו בִּתְהִלָּה הוֹדוּ־לוֹ בָּרֲכוּ שְׁמוֹ׃
    כִּי־טוֹב יְהוָה לְעוֹלָם חַסְדּוֹ וְעַד־דֹּר וָדֹר אֱמוּנָתוֹ׃`;

    const psalmElement = document.getElementById('psalm');
    psalmElement.innerHTML = '';
    
    psalm.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        psalmElement.appendChild(span);
        
        setTimeout(() => {
            anime({
                targets: span,
                opacity: 1,
                easing: 'easeInOutQuad',
                duration: 50
            });
        }, index * 20);
    });
}

function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const currentDate = new Date().toLocaleDateString('he-IL', options);
    dateElement.textContent = currentDate;
}

// Initialize
updateDaysRemaining();
updateDailyProgress();
updateUserList();
displayPsalm();
updateCurrentDate();

// Reset daily completion at midnight
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        dailyCompletion = {};
        localStorage.setItem('dailyCompletion', JSON.stringify(dailyCompletion));
        updateDailyProgress();
        showToast("יום חדש התחיל! אל תשכח לומר את המזמור.");
        updateCurrentDate();
    }
}, 60000);

// Save start date if not already set
if (!localStorage.getItem('startDate')) {
    localStorage.setItem('startDate', startDate.toISOString());
}









// בקשת אישור להתראות
function requestNotificationPermission() {
if (!("Notification" in window)) {
alert("הדפדפן שלך לא תומך בהתראות.");
return;
}

if (Notification.permission !== "granted" && Notification.permission !== "denied") {
Notification.requestPermission().then(function (permission) {
    if (permission === "granted") {
        alert("תודה שאישרת קבלת התראות!");
    }
});
}
}

// פונקציה לשליחת התראה
function sendNotification(message) {
if (Notification.permission === "granted") {
new Notification("תזכורת למזמור לתודה", {
    body: message,
    icon: "/path/to/icon.png" // החלף עם הנתיב לאייקון שלך
});
}
}

// הוספת כפתור לפאנל הניהול
function addNotificationButton() {
const adminPanel = document.getElementById('adminPanel');
if (adminPanel) {
const notificationSection = document.createElement('div');
notificationSection.innerHTML = `
    <h3>שליחת התראה</h3>
    <input type="text" id="notificationMessage" placeholder="הודעת ההתראה">
    <button onclick="sendNotificationToAll()">שלח התראה לכולם</button>
`;
adminPanel.appendChild(notificationSection);
}
}
function sendNotificationToAll() {
const message = document.getElementById('notificationMessage').value;
if (message) {
fetch('/api/send-notification', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
})
.then(response => response.json())
.then(data => {
    console.log('Notification sent:', data);
    alert('התראה נשלחה: ' + message);
})
.catch(error => {
    console.error('Error sending notification:', error);
});
} else {
alert('אנא הכנס הודעה לפני השליחה');
}
}

// הפעלת הפונקציות בטעינת העמוד
document.addEventListener('DOMContentLoaded', function() {
requestNotificationPermission();
addNotificationButton();
});