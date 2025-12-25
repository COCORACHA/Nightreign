import React, { useState, useEffect } from 'react';
import { Skull, Sword, Shield, Shuffle, UserPlus, Trash2, ArrowRight, RotateCcw, Ghost, Users, Save } from 'lucide-react';

// --- 資料庫 ---

const WEAPON_LIST = [
  "短劍", "直劍", "大劍", "特大劍", "刺劍", "重刺劍", 
  "曲劍", "大曲劍", "刀", "雙頭劍", "斧", "大斧", 
  "槌", "連枷", "大槌", "特大武器", "矛", "大矛", 
  "戟", "鐮刀", "軟鞭", "拳頭", "鉤爪", "弓", 
  "大弓", "弩", "弩砲", "小盾", "中盾", "大盾", 
  "聖印記", "手杖"
];

// 預設的 10 種 Debuff
const DEBUFF_LIST = [
  "不能升至满级(最终等级<15级)",
  "5级前只能单独作战",
  "第一晚必须打一个红boss",
  "禁止鎖定敵人",
  "禁止升級武器",
  "禁止使用戰灰/技能",
  "血瓶不能全收集",
  "不能用金色传说武器",
  "不能使用当局夜王弱属性的武器",
  "每人最多带4把武器",
  "第一晚阵亡队友不能拉人",
  "禁消耗品、道具"
];

// 絕望感隊名詞庫
const DESPAIR_ADJECTIVES = [
  "腐爛的", "被遺棄的", "破碎的", "絕望的", "無光的", 
  "哀嚎的", "被詛咒的", "吞噬的", "空虛的", "永夜的"
];
const DESPAIR_NOUNS = [
  "亡者", "餘燼", "祭品", "受虐兒", "殘肢", 
  "孤魂", "罪人", "污穢", "廢料", "墓碑"
];

// 角色/職業列表 (用於抽獎)
const CHARACTER_LIST = [
  "追蹤者", "女爵", "鐵之眼", "無賴", "復仇者", 
  "隱士", "守護者", "執行者", "送葬者", "學者"
];

// --- 新增：角色圖片對應表 ---
// 您可以在這裡將網址換成真實的圖片連結 (例如 imgur, discord 圖片連結等)
// 目前使用自動生成的文字圖片作為示範
const CHARACTER_IMAGES = {
  "追蹤者": "https://media.discordapp.net/attachments/1386171818389536800/1453602673893838878/thumbnail-WYLDER-V2.webp?ex=694e0c7c&is=694cbafc&hm=297ea61d7fffc60c25dcac1c6a9e5f9b4ebc9e6db2d29feba549a1652fbc1ec6&=&format=webp",
  "女爵": "https://media.discordapp.net/attachments/1386171818389536800/1453602676284850277/thumbnail-DUCHESS-V2.webp?ex=694e0c7c&is=694cbafc&hm=6e6abdf11777adeed0e1e83c1f76bf43ba3ab652bbcc1bd27c28c3e0e62c4ffb&=&format=webp",
  "鐵之眼": "https://media.discordapp.net/attachments/1386171818389536800/1453602674636357723/ironeye-thumbnail-V2.webp?ex=694e0c7c&is=694cbafc&hm=a7c68ca206b86a9e07d73ae39811a3707c0fa14d4e782761bad2c63042c635dc&=&format=webp",
  "無賴": "https://media.discordapp.net/attachments/1386171818389536800/1453602675248726189/raider-thumbnail-V2.webp?ex=694e0c7c&is=694cbafc&hm=3a81335163e3e0ca401d2643659fe8148f906f902eca3c312d6fc80d10b534c1&=&format=webp",
  "復仇者": "https://media.discordapp.net/attachments/1386171818389536800/1453602675965825116/revenant-thumbnail-V2.webp?ex=694e0c7c&is=694cbafc&hm=69db619b20c3c6de30887ccc07a9e5d12bf1303a78bf42f7003f3536469295d2&=&format=webp",
  "隱士": "https://media.discordapp.net/attachments/1386171818389536800/1453602672375763108/thumbnail-RECLUSE-v2.webp?ex=694e0c7b&is=694cbafb&hm=fc581ce805be36af0c2a2a271e57df1658c6a83849cafec959d21c3240308398&=&format=webp",
  "守護者": "https://media.discordapp.net/attachments/1386171818389536800/1453602673176743976/thumbnail-GUARDIAN_-V2.webp?ex=694e0c7b&is=694cbafb&hm=4f018892e5dc4a9e1aa7bbb7a9c0da4f739d401cba7fa5f7919fc7fac372e853&=&format=webp",
  "執行者": "https://media.discordapp.net/attachments/1386171818389536800/1453602675664097444/executor-thumbnail-V2.webp?ex=694e0c7c&is=694cbafc&hm=dffa08c74148f0d9cd090d35f5b30309bd76064be6194adbbaab9e7f9c4a0d46&=&format=webp",
  "送葬者": "https://media.discordapp.net/attachments/1386171818389536800/1453602671201222696/Undertaker-thumbnail-3.webp?ex=694e0c7b&is=694cbafb&hm=efae8984772086cb991462f6f7fab7c792ae06fbf3a1344b63dce1b95a4f8b7a&=&format=webp",
  "學者": "https://media.discordapp.net/attachments/1386171818389536800/1453602670417023149/Scholar-thumbnail-3.webp?ex=694e0c7b&is=694cbafb&hm=bfa365ca7f5c9ae351f1b7dccc75daf2fbf3171abb94859054346f9431841eef&=&format=webp"
};

// --- 輔助函式 ---

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateDespairName = () => {
  return `${getRandomItem(DESPAIR_ADJECTIVES)}${getRandomItem(DESPAIR_NOUNS)}`;
};

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- 主組件 ---

export default function NightReignApp() {
  const [view, setView] = useState('home'); // 'home' or 'draw'
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [drawResults, setDrawResults] = useState(null);

  // 初始化：從 localStorage 讀取玩家資料
  useEffect(() => {
    const savedPlayers = localStorage.getItem('nightreign_players');
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
    const savedTeams = localStorage.getItem('nightreign_teams');
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
  }, []);

  // 當玩家或隊伍變動時，存入 localStorage
  useEffect(() => {
    localStorage.setItem('nightreign_players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('nightreign_teams', JSON.stringify(teams));
  }, [teams]);

  // 新增玩家
  const addPlayer = () => {
    if (newPlayerName.trim() && !players.includes(newPlayerName.trim())) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (name) => {
    setPlayers(players.filter(p => p !== name));
  };

  // 分隊邏輯
  const generateTeams = () => {
    if (players.length === 0) return;

    const shuffledPlayers = shuffleArray(players);
    const newTeams = [];
    
    // 改為平均分配邏輯
    const maxPerTeam = 3; // 一隊最多 3 人
    const totalPlayers = shuffledPlayers.length;
    
    // 1. 計算最少需要幾隊 (例如 4 人 -> 2 隊)
    const numTeams = Math.ceil(totalPlayers / maxPerTeam);
    
    // 2. 計算基礎每隊人數與餘數
    // baseSize: 每个人最少分到幾人
    // extra: 有幾隊需要多加 1 人
    const baseSize = Math.floor(totalPlayers / numTeams);
    const extra = totalPlayers % numTeams;

    let startIndex = 0;
    for (let i = 0; i < numTeams; i++) {
      // 前 extra 隊多分配 1 人，以達成盡量平均
      const currentTeamSize = baseSize + (i < extra ? 1 : 0);
      const members = shuffledPlayers.slice(startIndex, startIndex + currentTeamSize);
      
      newTeams.push({
        id: Date.now() + i,
        name: generateDespairName(),
        debuff: getRandomItem(DEBUFF_LIST),
        members: members
      });
      
      startIndex += currentTeamSize;
    }
    setTeams(newTeams);
  };

  // 進入抽獎頁面並生成結果
  const enterDrawPage = (team) => {
    const results = team.members.map(member => {
      // 抽 1 個角色
      const character = getRandomItem(CHARACTER_LIST);
      // 取得對應圖片
      const characterImg = CHARACTER_IMAGES[character];

      // 抽 3 種不重複的武器
      const shuffledWeapons = shuffleArray(WEAPON_LIST);
      const weapons = shuffledWeapons.slice(0, 3);
      
      return {
        playerName: member,
        character,
        characterImg, // 將圖片傳入結果
        weapons
      };
    });

    setSelectedTeam(team);
    setDrawResults(results);
    setView('draw');
  };

  // 重新抽該隊的結果
  const rerollTeam = () => {
    if (selectedTeam) {
      enterDrawPage(selectedTeam);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-serif selection:bg-red-900 selection:text-white">
      {/* 背景紋理效果 */}
      <div className="fixed inset-0 pointer-events-none opacity-5" 
           style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff0000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}>
      </div>

      <div className="max-w-4xl mx-auto p-4 relative z-10">
        
        {/* Header */}
        <header className="mb-8 text-center border-b-2 border-red-900/50 pb-6">
          <h1 className="text-4xl md:text-6xl font-bold text-red-700 tracking-wider uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] flex items-center justify-center gap-3">
            <Skull className="w-10 h-10 md:w-16 md:h-16" />
            NightReign 受虐兒
            <Skull className="w-10 h-10 md:w-16 md:h-16" />
          </h1>
          <p className="mt-2 text-stone-500 italic">只有死亡才是解脫，但你連死亡都無法掌控...</p>
        </header>

        {view === 'home' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* 新增玩家區塊 */}
            <section className="bg-stone-900/50 p-6 rounded-lg border border-stone-800 shadow-xl backdrop-blur-sm">
              <h2 className="text-xl font-bold text-stone-300 mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5" /> 獻上祭品 (輸入玩家)
              </h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                  placeholder="輸入受害者名字..."
                  className="flex-1 bg-stone-950 border border-stone-700 rounded px-4 py-2 focus:outline-none focus:border-red-700 text-stone-200 placeholder-stone-600"
                />
                <button 
                  onClick={addPlayer}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-6 py-2 rounded border border-stone-600 transition-colors"
                >
                  新增
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {players.length === 0 && <span className="text-stone-600 text-sm">暫無祭品...</span>}
                {players.map((player, idx) => (
                  <div key={idx} className="bg-red-950/30 border border-red-900/30 text-stone-300 px-3 py-1 rounded flex items-center gap-2 group">
                    <span>{player}</span>
                    <button onClick={() => removePlayer(player)} className="text-stone-500 hover:text-red-500">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* 分隊操作區塊 */}
            <div className="flex justify-center">
               <button 
                  onClick={generateTeams}
                  disabled={players.length === 0}
                  className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-red-900 font-pj rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-800"
                >
                  <Shuffle className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                  進行分隊與詛咒分配
                  <div className="absolute -inset-3 rounded-xl bg-red-600 opacity-20 group-hover:opacity-40 blur-lg transition duration-200"></div>
                </button>
            </div>

            {/* 小隊列表 */}
            <section className="grid md:grid-cols-2 gap-4">
              {teams.map((team) => (
                <div key={team.id} className="bg-stone-900 border border-stone-800 p-5 rounded-lg relative overflow-hidden group hover:border-red-900/50 transition-all">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Ghost className="w-24 h-24 text-red-600" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-red-500 mb-1">{team.name}</h3>
                  <p className="text-xs text-stone-500 uppercase tracking-widest mb-4">隊伍詛咒: {team.debuff}</p>
                  
                  <div className="flex gap-2 mb-4">
                    {team.members.map((member, i) => (
                      <span key={i} className="bg-stone-950 text-stone-400 text-sm px-2 py-1 rounded border border-stone-800">
                        {member}
                      </span>
                    ))}
                  </div>

                  <button 
                    onClick={() => enterDrawPage(team)}
                    className="w-full mt-2 bg-stone-950 hover:bg-red-950/30 text-stone-300 border border-stone-700 hover:border-red-800 py-2 rounded flex items-center justify-center gap-2 transition-all group-hover:shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                  >
                    <img src="https://api.iconify.design/game-icons:curled-tentacle.svg?color=%23b91c1c" className="w-5 h-5" alt="tentacle" />
                    迎接詛咒降臨
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </section>
          </div>
        )}

        {view === 'draw' && selectedTeam && drawResults && (
          <div className="animate-in zoom-in-95 duration-500">
            <button 
              onClick={() => setView('home')}
              className="mb-4 text-stone-500 hover:text-stone-300 flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> 返回分組大廳
            </button>

            {/* 抽獎結果 Header */}
            <div className="text-center mb-8 relative">
              <h2 className="text-3xl md:text-5xl font-bold text-red-600 mb-2">{selectedTeam.name}</h2>
              <div className="inline-block bg-red-950/20 border border-red-900/50 px-6 py-2 rounded-full">
                <p className="text-red-400 font-mono text-lg animate-pulse">
                  詛咒: {selectedTeam.debuff}
                </p>
              </div>
            </div>

            {/* 玩家卡片 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {drawResults.map((result, idx) => (
                <div key={idx} className="bg-stone-900 border-2 border-stone-800 rounded-xl overflow-hidden shadow-2xl flex flex-col relative group">
                  {/* 玩家名字 */}
                  <div className="bg-stone-950 p-3 text-center border-b border-stone-800 z-20 relative">
                    <h3 className="text-xl font-bold text-stone-200">{result.playerName}</h3>
                  </div>

                  {/* 角色圖片區 */}
                  <div className="h-64 bg-stone-900 relative overflow-hidden">
                     {/* 如果有圖片，顯示圖片作為背景 */}
                     {result.characterImg ? (
                       <>
                         <img 
                           src={result.characterImg} 
                           alt={result.character}
                           className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                         />
                         {/* 漸層遮罩，讓文字清楚 */}
                         <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-90"></div>
                       </>
                     ) : (
                       <div className="absolute inset-0 flex items-center justify-center bg-stone-800">
                         <Users className="w-16 h-16 text-stone-600" />
                       </div>
                     )}
                     
                     {/* 角色名稱覆蓋在圖上 */}
                     <div className="absolute bottom-4 left-0 right-0 text-center z-10 px-2">
                        <span className="block text-3xl font-serif font-bold text-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                          {result.character}
                        </span>
                        <span className="text-xs text-stone-300 uppercase tracking-widest drop-shadow-md">Starting Class</span>
                     </div>
                  </div>

                  {/* 武器列表 */}
                  <div className="bg-stone-950 p-4 flex-1 border-t border-stone-800 z-20 relative">
                    <div className="space-y-3">
                      {result.weapons.map((weapon, wIdx) => (
                        <div key={wIdx} className="flex items-center gap-3 bg-stone-900/50 p-2 rounded border border-stone-800/50">
                          <div className="w-8 h-8 bg-stone-800 rounded flex items-center justify-center text-stone-500">
                            {/* 根據武器名稱簡單判斷圖示，這裡統一用劍圖示，實際可擴充 */}
                            {weapon.includes('盾') ? <Shield className="w-4 h-4" /> : <Sword className="w-4 h-4" />}
                          </div>
                          <span className="text-stone-300 font-medium">{weapon}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 底部按鈕 */}
            <div className="flex justify-center gap-4 pb-12">
               <button 
                  onClick={rerollTeam}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-6 py-3 rounded border border-stone-600 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  重新抽取 (本隊)
                </button>
            </div>

            {/* 底部固定大字 Debuff (再次強調) */}
            <div className="fixed bottom-0 left-0 right-0 bg-red-950/90 border-t-4 border-red-900 p-4 text-center z-50 backdrop-blur-md md:static md:bg-transparent md:border-none md:p-0 md:backdrop-blur-none md:mt-8">
               <h3 className="text-stone-500 text-sm md:hidden mb-1">本隊詛咒</h3>
               <p className="text-xl md:text-3xl font-bold text-red-500 md:hidden">
                 {selectedTeam.debuff}
               </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}