const fs = require('fs');
const path = 'c:/Users/Gautam Jain/Desktop/v0-gaming/gaming-dashboard/app/leaderboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// replace token extraction
content = content.replace('const { token } = useAuthStore()', 'const { token, user } = useAuthStore()');

// replace currentPlayer logic
content = content.replace(
    'const currentPlayer = globalLeaderboard.find((p) => p.username === "player11")',
    'const currentPlayer = user ? globalLeaderboard.find((p) => p.username === user.username) : null'
);

// replace player11 matching in Tabs
content = content.replaceAll(
    'player.username === "player11"',
    'user && player.username === user.username'
);

// fix undefined accesses for topThree by making them optional with fallback
// 2nd Place
content = content.replace('{topThree[1]?.username.slice(0, 1).toUpperCase()}', '{topThree[1]?.username?.slice(0, 1).toUpperCase() || "?"}');
content = content.replace('{topThree[1]?.username}', '{topThree[1]?.username || "-"}');
content = content.replace('{topThree[1]?.points.toLocaleString()}', '{topThree[1]?.points?.toLocaleString() || 0}');
content = content.replace('{topThree[1]?.winRate}%', '{topThree[1]?.winRate || 0}%');

// 1st Place
content = content.replace('{topThree[0]?.username.slice(0, 1).toUpperCase()}', '{topThree[0]?.username?.slice(0, 1).toUpperCase() || "?"}');
content = content.replace('{topThree[0]?.username}', '{topThree[0]?.username || "-"}');
content = content.replace('{topThree[0]?.points.toLocaleString()}', '{topThree[0]?.points?.toLocaleString() || 0}');
content = content.replace('{topThree[0]?.winRate}%', '{topThree[0]?.winRate || 0}%');

// 3rd Place
content = content.replace('{topThree[2]?.username.slice(0, 1).toUpperCase()}', '{topThree[2]?.username?.slice(0, 1).toUpperCase() || "?"}');
content = content.replace('{topThree[2]?.username}', '{topThree[2]?.username || "-"}');
content = content.replace('{topThree[2]?.points.toLocaleString()}', '{topThree[2]?.points?.toLocaleString() || 0}');
content = content.replace('{topThree[2]?.winRate}%', '{topThree[2]?.winRate || 0}%');

// Leaderboard Stats - Top Score
content = content.replace('{globalLeaderboard[0]?.points.toLocaleString()}', '{globalLeaderboard[0]?.points?.toLocaleString() || 0}');

// Leaderboard Stats - Best Streak
content = content.replace('{Math.max(...globalLeaderboard.map((p) => Math.abs(p.streak)))}', '{globalLeaderboard.length > 0 ? Math.max(...globalLeaderboard.map((p) => p.streak)) : 0}');
// Let's do it safely
content = content.replace('{Math.max(...globalLeaderboard.map((p) => p.streak))}', '{globalLeaderboard.length > 0 ? Math.max(...globalLeaderboard.map((p) => p.streak)) : 0}');

// Leaderboard Stats - Avg Win Rate
content = content.replace('{Math.round(globalLeaderboard.reduce((acc, p) => acc + p.winRate, 0) / globalLeaderboard.length)}%', '{globalLeaderboard.length > 0 ? Math.round(globalLeaderboard.reduce((acc, p) => acc + p.winRate, 0) / globalLeaderboard.length) : 0}%');

fs.writeFileSync(path, content, 'utf8');
console.log('Done!');
