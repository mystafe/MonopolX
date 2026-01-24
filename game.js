        // Production mode check
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        const debugLog = (...args) => {
            if (!isProduction) console.log(...args);
        };
        const debugError = (...args) => {
            if (!isProduction) console.error(...args);
        };

        // Performance utilities
        const debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };

        const throttle = (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };

        // GLOBAL FUNCTIONS - ATTACH TO WINDOW FOR RELIABILITY
        window.openStats = function () {
            const stats = document.getElementById('statsContent');
            if (!stats) return;
            stats.innerHTML = '';
            G.players.forEach(p => {
                if (p.out) return;
                const card = document.createElement('div');
                card.style.cssText = 'background:rgba(20,20,30,0.98); padding:10px; border-radius:10px; border:1px solid ' + COLORS[p.color] + '44; margin-bottom:8px; box-shadow:0 4px 15px rgba(0,0,0,0.4);';

                const propGroups = {};
                p.props.forEach(id => {
                    const s = window.activeSQ[id];
                    const color = s.color || (s.type === 'railroad' ? '#333' : '#9c27b0');
                    if (!propGroups[color]) propGroups[color] = [];
                    propGroups[color].push(s.name);
                });

                let propHTML = '';
                Object.keys(propGroups).forEach(color => {
                    propHTML += '<div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:8px;">';
                    propGroups[color].forEach(name => {
                        propHTML += '<span style="background:' + color + '; color:' + ((color === '#fff' || color === '#ffeb3b') ? '#000' : '#fff') + '; padding:2px 5px; border-radius:3px; font-size:0.5rem; font-weight:800; border:1px solid rgba(255,255,255,0.1);">' + name + '</span>';
                    });
                    propHTML += '</div>';
                });

                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-weight:900; color:${COLORS[p.color]}; font-size:0.75rem;">${p.icon} ${p.name.toUpperCase()}</span>
                        <span style="font-weight:900; color:var(--gold); font-size:0.85rem;">${p.money.toLocaleString()}₺</span>
                    </div>
                    ${propHTML || '<div style="opacity:0.4; font-size:0.6rem; margin-top:5px;">Mülk yok</div>'}
                `;
                stats.appendChild(card);
            });
            document.getElementById('statsModal').classList.add('active');
        };

        let selectedIcons = { 1: '🚗', 2: '🎩', 3: '🐕', 4: '🦖' }; // Default icons
        const TOKEN_ICONS_ALL = ['🚗', '🎩', '🐕', '🚢', '🦖', '👞', '🧺', '🐈', '🚀', '🚁', '🚂', '🐎', '🦢', '🐢', '🐙', '👾', '🤖', '👻', '👽', '👑', '💎', '💰', '🔑', '🔔', '⚓', '⛵', '🌟', '⚡', '🔥', '💧', '🌿', '🌸', '🍄', '🌈', '☀️', '🌙', '⭐', '🌍', '💡', '⚙️', '⚖️', '🛠️', '🛡️', '⚔️', '🔮', '🪄', '🎲', '🧩', '🎯', '🎳', '🎤', '🎧', '🎸', '🎹', '🥁', '🎺', '🎻', '🎨', '🎭', '🎬', '📸', '🎥', '💻', '📱', '⌚', '💾', '🖨️', '🖱️', '⌨️', '📞', '📠', '📡', '🛰️', '💡', '🔌', '🔋', '🧲', '🧪', '🔬', '🔭', '🧬', '🦠', '💉', '💊', '🩹', '🩺', '🌡️', '🩸', '🩻', '🩼', '🩽', '🩾', '🩿', '🪀', '🪁', '🪂', '🪃', '🪄', '🪅', '🪆', '🪇', '🪈', '🪉', '🪊', '🪋', '🪌', '🪍', '🪎', '🪏', '🪐', '🪑', '🪒', '🪓', '🪔', '🪕', '🪖', '🪗', '🪘', '🪙', '🪚', '🪛', '🪜', '🪝', '🪞', '🪟', '🪠', '🪡', '🪢', '🧶', '🧵', '🪟', '🪠', '🪡', '🪢', '🧶', '🧵', '🪧', '🪨', '🪩', '🪪', '🪫', '🪬', '🪭', '🪮', '🪯', '🪰', '🪱', '🪲', '🪳', '🪴', '🪵', '🪶', '🪷', '🪸', '🪹', '🪺', '🪻', '🪼', '🪽', '🪾', '🪿', '🫀', '🫁', '🫂', '🫃', '🫄', '🫅', '🫆', '🫇', '🫈', '🫉', '🫊', '🫋', '🫌', '🫍', '🫎', '🫏', '🫐', '🫑', '🫒', '🫓', '🫔', '🫕', '🫖', '🫗', '🫘', '🫙', '🫚', '🫛', '🫜', '🫝', '🫞', '🫟', '🫠', '🫡', '🫢', '🫣', '🫤', '🫥', '🫠', '🫧', '🫨', '🫩', '🫪', '🫫', '🫬', '🫭', '🫮', '🫯', '🫰', '🫱', '🫲', '🫳', '🫴', '🫵', '🫶', '🫷', '🫸', '🫹', '🫺', '🫻', '🫼', '🫽', '🫾', '🫿', '🬀', '🬁', '🬂', '🬃', '🬄', '🬅', '🬆', '🬇', '🬈', '🬉', '🬊', '🬋', '🬌', '🬍', '🬎', '🬏', '🬐', '🬑', '🬒', '🬓', '🬔', '🬕', '🬖', '🬗', '🬘', '🬙', '🬚', '🬛', '🬜', '🬝', '🬞', '🬟', '🬠', '🬡', '🬢', '🬣', '🬤', '🬥', '🬦', '🬧', '🬨', '🬩', '🬪', '🬫', '🬬', '🬭', '🬮', '🬯', '🬰', '🬱', '🬲', '🬳', '🬴', '🬵', '🬶', '🬷', '🬸', '🬹', '🬺', '🬻', '🬼', '🬽', '🬾', '🬿', '🭀', '🭁', '🭂', '🭃', '🭄', '🭅', '🭆', '🭇', '🭈', '🭉', '🭊', '🭋', '🭌', '🭍', '🭎', '🭏', '🭐', '🭑', '🭒', '🭓', '🭔', '🭕', '🭖', '🭗', '🭘', '🭙', '🭚', '🭛', '🭜', '🭝', '🭞', '🭟', '🭠', '🭡', '🭢', '🭣', '🭤', '🭥', '🭦', '🭧', '🭨', '🭩', '🭪', '🭫', '🭬', '🭭', '🭮', '🭯', '🭰', '🭱', '🭲', '🭳', '🭴', '🭵', '🭶', '🭷', '🭸', '🭹', '🭺', '🭻', '🭼', '🭽', '🭾', '🭿', '🮀', '🮁', '🮂', '🮃', '🮄', '🮅', '🮆', '🮇', '🮈', '🮉', '🮊', '🮋', '🮌', '🮍', '🮎', '🮏', '🮐', '🮑', '🮒', '🮓', '🮔', '🮕', '🮖', '🮗', '🮘', '🮙', '🮚', '🮛', '🮜', '🮝', '🮞', '🮟', '🮠', '🮡', '🮢', '🮣', '🮤', '🮥', '🮦', '🮧', '🮨', '🮩', '🮪', '🮫', '🮬', '🮭', '🮮', '🮯', '🮰', '🮱', '🮲', '🮳', '🮴', '🮵', '🮶', '🮷', '🮸', '🮹', '🮺', '🮻', '🮼', '🮽', '🮾', '🮿', '🯀', '🯁', '🯂', '🯃', '🯄', '🯅', '🯆', '🯇', '🯈', '🯉', '🯊', '🯋', '🯌', '🯍', '🯎', '🯏', '🯐', '🯑', '🯒', '🯓', '🯔', '🯕', '🯖', '🯗', '🯘', '🯙', '🯚', '🯛', '🯜', '🯝', '🯞', '🯟', '🯠', '🯡', '🯢', '🯣', '🯤', '🯥', '🯦', '🯧', '🯨', '🯩', '🯪', '🯫', '🯬', '🯭', '🯮', '🯯', '🯰', '🯱', '🯲', '🯳', '🯴', '🯵', '🯶', '🯷', '🯸', '🯹', '🯺', '🯻', '🯼', '🯽', '🯾', '🯿'];

        function autoName(num) {
            const type = document.getElementById('t' + num).value;
            const input = document.getElementById('p' + num);
            const preview = document.getElementById('preview-p' + num);
            if (type === 'none') {
                input.value = '';
                if (preview) preview.style.opacity = '0.2';
                return;
            }
            if (preview) preview.style.opacity = '1';
            if (type === 'human') input.value = (num === 1 ? 'Mustafa' : 'Oyuncu ' + num);
            else input.value = 'Robot-' + (num - 1 || 'X');
        }

        const CATEGORIZED_ICONS = {
            classic: ['🚗', '🎩', '🐕', '🚢', '🦖', '👞', '🧺', '🐈', '🚀', '🚁', '🚂', '🐎'],
            animals: ['🦆', '🐢', '🦢', '🦅', '🦄', '🐝', '🦋', '🐙', '🦖', '🦜', '🦩', '🐘', '🦍', '🐳', '🦀', '🦁', '🦉', '🦙'],
            travel: ['🌍', '⛵', '🚁', '🛩️', '🏍️', '🚲', '🛴', '🗺️', '🗼', '🏔️', '🏖️', '🏰', '🏕️', '🎡', '🚜', '🛶', '⛺'],
            objects: ['💎', '👑', '💰', '🔑', '🔔', '⚓', '🎲', '🧩', '🎯', '🎤', '🎧', '🎸', '🎨', '🎭', '🎬', '📸', '💾', '💡', '🛡️', '⚙️']
        };

        let currentPickingPlayer = null;
        function togglePers(pIdx) {
            const t = document.getElementById('t' + pIdx).value;
            const pers = document.getElementById('pers' + pIdx);
            const persBtn = document.getElementById('persBtn' + pIdx);
            // Keep pers select hidden - it's only used for value storage
            // Only show the button for AI players
            if (persBtn) persBtn.style.display = t.startsWith('ai') ? 'block' : 'none';
        }

        let currentPlayerTypeModal = null;
        let currentPlayerPersModal = null;

        function openPlayerTypeModal(playerNum) {
            currentPlayerTypeModal = playerNum;
            const modal = document.getElementById('playerTypeModal');
            if (modal) modal.classList.add('active');
            // Update selected state
            const currentType = document.getElementById('t' + playerNum).value;
            document.querySelectorAll('.player-type-card-modal').forEach(card => {
                card.classList.remove('selected');
            });
            const selectedCard = document.getElementById(`player-type-${currentType}`);
            if (selectedCard) selectedCard.classList.add('selected');
            // Show/hide 'none' option based on player number (only for players 3 and 4)
            const noneOption = document.getElementById('player-type-none');
            if (noneOption) {
                noneOption.style.display = (playerNum >= 3) ? 'flex' : 'none';
            }
        }

        function selectPlayerTypeFromModal(type) {
            if (!currentPlayerTypeModal) return;
            const select = document.getElementById('t' + currentPlayerTypeModal);
            if (select) {
                select.value = type;
                autoName(currentPlayerTypeModal);
                togglePers(currentPlayerTypeModal);
                updatePlayerTypeDisplay(currentPlayerTypeModal);
            }
            closeModal('playerTypeModal');
            currentPlayerTypeModal = null;
        }

        function updatePlayerTypeDisplay(playerNum) {
            const select = document.getElementById('t' + playerNum);
            if (!select) return;
            const type = select.value;
            const typeNames = {
                'human': `👤 ${t('human')}`,
                'ai-easy': `🤖 ${t('ai_easy')}`,
                'ai-medium': `🤖 ${t('ai_medium')}`,
                'ai-hard': `🤖 ${t('ai_hard')}`,
                'none': `--- (${t('closed_option')})`
            };
            const currentTypeEl = document.getElementById('currentType' + playerNum);
            if (currentTypeEl) {
                currentTypeEl.textContent = typeNames[type] || `👤 ${t('human')}`;
            }
        }

        function updatePlayerPersDisplay(playerNum) {
            const select = document.getElementById('pers' + playerNum);
            if (!select) return;
            const pers = select.value;
            const persNames = {
                'Random': `🎲 ${t('random')}`,
                'Tycoon': `💼 ${t('ai_tycoon')}`,
                'Banker': `🏦 ${t('ai_banker')}`,
                'Opportunist': `🦊 ${t('ai_opportunist')}`
            };
            const currentPersEl = document.getElementById('currentPers' + playerNum);
            if (currentPersEl) {
                currentPersEl.textContent = persNames[pers] || `🎲 ${t('random')}`;
            }
        }

        function openPlayerPersModal(playerNum) {
            currentPlayerPersModal = playerNum;
            const modal = document.getElementById('playerPersModal');
            if (modal) modal.classList.add('active');
            // Update selected state
            const currentPers = document.getElementById('pers' + playerNum).value;
            document.querySelectorAll('.player-pers-card-modal').forEach(card => {
                card.classList.remove('selected');
            });
            const selectedCard = document.getElementById(`player-pers-${currentPers}`);
            if (selectedCard) selectedCard.classList.add('selected');
        }

        function selectPlayerPersFromModal(pers) {
            if (!currentPlayerPersModal) return;
            const select = document.getElementById('pers' + currentPlayerPersModal);
            if (select) {
                select.value = pers;
                updatePlayerPersDisplay(currentPlayerPersModal);
            }
            closeModal('playerPersModal');
            currentPlayerPersModal = null;
        }

        function initIconSelectors() {
            // No longer populates inline lists. Just initializes default previews.
            for (let i = 1; i <= 4; i++) {
                selectIcon(i, selectedIcons[i]);
            }
        }

        function openIconPicker(playerNum) {
            currentPickingPlayer = playerNum;
            const allBtn = document.querySelector('#iconCategories .icon-category-btn') || { classList: { add: () => { } } };
            filterIcons('all', allBtn);
            document.getElementById('iconModal').classList.add('active');
        }

        function filterIcons(cat, btn) {
            const grid = document.getElementById('iconGrid');
            grid.innerHTML = '';

            // UI Toggle
            document.querySelectorAll('.icon-category-btn').forEach(b => b.classList.remove('active'));
            if (btn && btn.classList) btn.classList.add('active');

            let list = [];
            if (cat === 'all') {
                Object.values(CATEGORIZED_ICONS).forEach(l => list = list.concat(l));
            } else {
                list = CATEGORIZED_ICONS[cat] || [];
            }

            // Remove duplicates
            list = [...new Set(list)];

            list.forEach(icon => {
                const opt = document.createElement('div');
                opt.className = 'icon-opt-big';
                opt.textContent = icon;

                // Real-time check if icon is already used by another player
                const isUsed = Object.entries(selectedIcons).some(([p, i]) => i === icon && parseInt(p) !== currentPickingPlayer);

                if (isUsed) {
                    opt.style.opacity = '0.2';
                    opt.style.filter = 'grayscale(1)';
                    opt.style.pointerEvents = 'none';
                }

                opt.onclick = () => {
                    selectIcon(currentPickingPlayer, icon);
                    closeModal('iconModal');
                };
                grid.appendChild(opt);
            });
        }

        function selectIcon(playerNum, icon) {
            selectedIcons[playerNum] = icon;
            const preview = document.getElementById(`preview-p${playerNum}`);
            if (preview) preview.textContent = icon;
        }
        function setTheme(themeName) {
            document.body.className = ''; // Clear existing themes
            document.body.classList.add(`theme-${themeName}`);

            document.querySelectorAll('.theme-card, .theme-card-modal').forEach(card => {
                card.classList.remove('selected');
            });
            const oldCard = document.getElementById(`theme-${themeName}`);
            const modalCard = document.getElementById(`theme-modal-${themeName}`);
            if (oldCard) oldCard.classList.add('selected');
            if (modalCard) modalCard.classList.add('selected');
            
            // Update current theme name in button
            const themeNames = {
                premium: 'Premium',
                marble: 'Marble',
                parchment: 'Paper',
                cyber: 'Cyber',
                nature: 'Nature',
                royal: 'Royal'
            };
            const currentThemeNameEl = document.getElementById('currentThemeName');
            if (currentThemeNameEl) {
                currentThemeNameEl.textContent = themeNames[themeName] || 'Premium';
            }
        }

        function openThemeModal() {
            const modal = document.getElementById('themeModal');
            if (modal) modal.classList.add('active');
        }
        window.openThemeModal = openThemeModal;

        function selectThemeFromModal(themeName) {
            setTheme(themeName);
            closeModal('themeModal');
        }

        function openMapModal() {
            const modal = document.getElementById('mapModal');
            if (modal) modal.classList.add('active');
        }

        function selectMapFromModal(mapKey) {
            // Update hidden select element for compatibility
            const mapSelect = document.getElementById('mapSelect');
            if (mapSelect) {
                mapSelect.value = mapKey;
            }
            
            // Update current map name in button
            const mapNames = {
                turkiye: '🇹🇷 Türkiye Turu',
                superlig: '⚽ Süper Lig',
                istanbul: '🏙️ İstanbul Boğazı',
                world: '🗺️ Global Cities',
                mars: '🚀 Mars Kolonisi'
            };
            const currentMapNameEl = document.getElementById('currentMapName');
            if (currentMapNameEl) {
                currentMapNameEl.textContent = mapNames[mapKey] || '🇹🇷 Türkiye Turu';
            }
            
            // Update selected state in modal
            document.querySelectorAll('.map-card-modal').forEach(card => {
                card.classList.remove('selected');
            });
            const selectedCard = document.getElementById(`map-modal-${mapKey}`);
            if (selectedCard) {
                selectedCard.classList.add('selected');
            }
            
            closeModal('mapModal');
        }

        function openDifficultyModal() {
            const modal = document.getElementById('difficultyModal');
            if (modal) modal.classList.add('active');
        }
        window.openDifficultyModal = openDifficultyModal;

        function selectDifficultyFromModal(level) {
            const difficultySelect = document.getElementById('difficultyLevel');
            if (difficultySelect) difficultySelect.value = level;
            updateDifficultyDisplay();
            
            document.querySelectorAll('.difficulty-card-modal').forEach(card => {
                card.classList.remove('selected');
            });
            const selectedCard = document.getElementById(`difficulty-modal-${level}`);
            if (selectedCard) selectedCard.classList.add('selected');
            
            closeModal('difficultyModal');
        }

        function openLangModal() {
            const modal = document.getElementById('langModal');
            if (modal) modal.classList.add('active');
        }
        window.openLangModal = openLangModal;

        function selectLangFromModal(lang) {
            const langSelect = document.getElementById('setupLang');
            if (langSelect) langSelect.value = lang;
            currLang = lang;
            updateLangUI();
            
            const langNames = { tr: '🇹🇷 Türkçe', en: '🇬🇧 English' };
            const currentLangNameEl = document.getElementById('currentLangName');
            if (currentLangNameEl) {
                currentLangNameEl.textContent = langNames[lang] || '🇹🇷 Türkçe';
            }
            
            // Update difficulty label
            const difficultyLabel = document.querySelector('label[for="difficultyLevel"], .rule-item:has(#difficultyLevel) label');
            if (difficultyLabel) {
                difficultyLabel.textContent = lang === 'en' ? 'DIFFICULTY' : 'OYUN ZORLUĞU';
            }
            
            // Update current difficulty name
            const difficultySelect = document.getElementById('difficultyLevel');
            if (difficultySelect) {
                const level = difficultySelect.value;
                const difficultyNames = {
                    '1': { tr: 'En Kolay', en: 'Very Easy' },
                    '2': { tr: 'Kolay', en: 'Easy' },
                    '3': { tr: 'Normal', en: 'Normal' },
                    '4': { tr: 'Zor', en: 'Hard' },
                    '5': { tr: 'En Zor', en: 'Very Hard' }
                };
                const currentDifficultyNameEl = document.getElementById('currentDifficultyName');
                if (currentDifficultyNameEl) {
                    currentDifficultyNameEl.textContent = difficultyNames[level]?.[lang] || difficultyNames['3'][lang];
                }
            }
            
            document.querySelectorAll('.lang-card-modal').forEach(card => {
                card.classList.remove('selected');
            });
            const selectedCard = document.getElementById(`lang-modal-${lang}`);
            if (selectedCard) selectedCard.classList.add('selected');
            
            closeModal('langModal');
        }

        function openSpeedModal() {
            const modal = document.getElementById('speedModal');
            if (modal) modal.classList.add('active');
        }
        window.openSpeedModal = openSpeedModal;

        function selectSpeedFromModal(speed) {
            const speedSelect = document.getElementById('setupSpeed');
            if (speedSelect) speedSelect.value = speed;
            const speedRange = document.getElementById('speedRange');
            if (speedRange) speedRange.value = speed;
            updateSpeedDisp();
            
            const speedNames = { 
                '100': `🐢 ${t('speed_slow')}`, 
                '200': `⚡ ${t('speed_normal')}`, 
                '300': `🚀 ${t('speed_fast')}`, 
                '400': `⚡ ${t('speed_lightning')}` 
            };
            const currentSpeedNameEl = document.getElementById('currentSpeedName');
            if (currentSpeedNameEl) {
                currentSpeedNameEl.textContent = speedNames[speed] || `⚡ ${t('speed_normal')}`;
            }
            
            document.querySelectorAll('.speed-card-modal').forEach(card => {
                card.classList.remove('selected');
            });
            const selectedCard = document.getElementById(`speed-modal-${speed}`);
            if (selectedCard) selectedCard.classList.add('selected');
            
            closeModal('speedModal');
        }

        function initMapSelection() {
            const mapSelect = document.getElementById('mapSelect');
            if (mapSelect) {
                const currentMap = mapSelect.value || 'turkiye';
                selectMapFromModal(currentMap);
            }
            
            // Initialize lang selection
            const langSelect = document.getElementById('setupLang');
            if (langSelect) {
                selectLangFromModal(langSelect.value || 'tr');
            }
            
            // Initialize speed selection
            const speedSelect = document.getElementById('setupSpeed');
            if (speedSelect) {
                selectSpeedFromModal(speedSelect.value || '200');
            }
            
            // Initialize difficulty selection
            const difficultySelect = document.getElementById('difficultyLevel');
            if (difficultySelect) {
                selectDifficultyFromModal(difficultySelect.value || '3');
            }
            
            // Initialize player type and personality displays
            for (let i = 1; i <= 4; i++) {
                updatePlayerTypeDisplay(i);
                updatePlayerPersDisplay(i);
                togglePers(i);
            }
        }

        const SQ = [
            { id: 0, name: "BAŞLA", type: "go" },
            { id: 1, name: "Şırnak", type: "property", color: "#8B4513", price: 60, rent: [2, 10, 30, 90, 160, 250], hc: 50, g: "brown" },
            { id: 2, name: "Sandık", type: "chest" },
            { id: 3, name: "Hakkari", type: "property", color: "#8B4513", price: 60, rent: [4, 20, 60, 180, 320, 450], hc: 50, g: "brown" },
            { id: 4, name: "Gelir Vergisi", type: "tax", amount: 200 },
            { id: 5, name: "Marmaray", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
            { id: 6, name: "Erzurum", type: "property", color: "#87CEEB", price: 100, rent: [6, 30, 90, 270, 400, 550], hc: 50, g: "lightblue" },
            { id: 7, name: "Şans", type: "chance" },
            { id: 8, name: "Trabzon", type: "property", color: "#87CEEB", price: 100, rent: [6, 30, 90, 270, 400, 550], hc: 50, g: "lightblue" },
            { id: 9, name: "Samsun", type: "property", color: "#87CEEB", price: 120, rent: [8, 40, 100, 300, 450, 600], hc: 50, g: "lightblue" },
            { id: 10, name: "HAPİS", type: "jail" },
            { id: 11, name: "Diyarbakır", type: "property", color: "#FF69B4", price: 140, rent: [10, 50, 150, 450, 625, 750], hc: 100, g: "pink" },
            { id: 12, name: "Elektrik Şti.", type: "utility", price: 150 },
            { id: 13, name: "Şanlıurfa", type: "property", color: "#FF69B4", price: 140, rent: [10, 50, 150, 450, 625, 750], hc: 100, g: "pink" },
            { id: 14, name: "Malatya", type: "property", color: "#FF69B4", price: 160, rent: [12, 60, 180, 500, 700, 900], hc: 100, g: "pink" },
            { id: 15, name: "Sirkeci", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
            { id: 16, name: "Çanakkale", type: "property", color: "#FFA500", price: 180, rent: [14, 70, 200, 550, 750, 950], hc: 100, g: "orange" },
            { id: 17, name: "Sandık", type: "chest" },
            { id: 18, name: "Edirne", type: "property", color: "#FFA500", price: 180, rent: [14, 70, 200, 550, 750, 950], hc: 100, g: "orange" },
            { id: 19, name: "Balıkesir", type: "property", color: "#FFA500", price: 200, rent: [16, 80, 220, 600, 800, 1000], hc: 100, g: "orange" },
            { id: 20, name: "PARK", type: "parking" },
            { id: 21, name: "Konya", type: "property", color: "#FF0000", price: 220, rent: [18, 90, 250, 700, 875, 1050], hc: 150, g: "red" },
            { id: 22, name: "Şans", type: "chance" },
            { id: 23, name: "Kayseri", type: "property", color: "#FF0000", price: 220, rent: [18, 90, 250, 700, 875, 1050], hc: 150, g: "red" },
            { id: 24, name: "Eskişehir", type: "property", color: "#FF0000", price: 240, rent: [20, 100, 300, 750, 925, 1100], hc: 150, g: "red" },
            { id: 25, name: "Ankara İst.", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
            { id: 26, name: "Adana", type: "property", color: "#FFFF00", price: 260, rent: [22, 110, 330, 800, 975, 1150], hc: 150, g: "yellow" },
            { id: 27, name: "Mersin", type: "property", color: "#FFFF00", price: 260, rent: [22, 110, 330, 800, 975, 1150], hc: 150, g: "yellow" },
            { id: 28, name: "Su Şti.", type: "utility", price: 150 },
            { id: 29, name: "Gaziantep", type: "property", color: "#FFFF00", price: 280, rent: [24, 120, 360, 850, 1025, 1200], hc: 150, g: "yellow" },
            { id: 30, name: "HAPİSE GİT", type: "gotojail" },
            { id: 31, name: "Bursa", type: "property", color: "#228B22", price: 300, rent: [26, 130, 390, 900, 1100, 1275], hc: 200, g: "green" },
            { id: 32, name: "Giresun", type: "property", color: "#228B22", price: 300, rent: [26, 130, 390, 900, 1100, 1275], hc: 200, g: "green" },
            { id: 33, name: "Sandık", type: "chest" },
            { id: 34, name: "İzmir", type: "property", color: "#228B22", price: 320, rent: [28, 150, 450, 1000, 1200, 1400], hc: 200, g: "green" },
            { id: 35, name: "İstanbul İst.", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
            { id: 36, name: "Şans", type: "chance" },
            { id: 37, name: "Ankara", type: "property", color: "#0000CD", price: 350, rent: [35, 175, 500, 1100, 1300, 1500], hc: 200, g: "darkblue" },
            { id: 38, name: "Lüks Vergisi", type: "tax", amount: 100 },
            { id: 39, name: "İstanbul", type: "property", color: "#0000CD", price: 400, rent: [50, 200, 600, 1400, 1700, 2000], hc: 200, g: "darkblue" }
        ];

        const AI_PHRASES = {
            Tycoon: {
                buy: ["Bu mülk imparatorluğumun incisi olacak.", "Paranın kokusunu alıyorum...", "Satın alıyorum, çünkü asalet bunu gerektirir."],
                rent: ["Öderken elin titremesin!", "Benim arsamda yürümenin bir bedeli var.", "Cüzdanını biraz daha açman gerekecek."],
                jail: ["Avukatlarım ilgileniyor.", "Sadece kısa bir tatil...", "Hücrem bile sizin sarayınızdan lükstür."]
            },
            Banker: {
                buy: ["Stratejik bir yatırım.", "Portföyümü çeşitlendiriyorum.", "Risk analizi olumlu çıktı."],
                rent: ["Faiziyle birlikte alıyorum.", "İş dünyasında duygulara yer yoktur.", "Muhasebe kayıtlarına işledim."],
                jail: ["Süreç yönetimi hatası...", "Hukuki bir boşluk bulacağım.", "Nakit akışı devam ediyor."]
            },
            Opportunist: {
                buy: ["Burası tam bir kelepir!", "Şans ayağıma geldi.", "Hemen kapmalıyım!"],
                rent: ["Bedava peynir sadece farededir...", "Şansın bittiği yerdesin.", "Kismet ayağıma geldi."],
                jail: ["Bu sefer yakalandık.", "Planlarımı biraz ertelemek zorundayım.", "Tünel kazmaya başladım bile!"]
            }
        };
        const GR = { brown: [1, 3], lightblue: [6, 8, 9], pink: [11, 13, 14], orange: [16, 18, 19], red: [21, 23, 24], yellow: [26, 27, 29], green: [31, 32, 34], darkblue: [37, 39], railroad: [5, 15, 25, 35], utility: [12, 28] };
        let CHANCE = [{ t: "Başlangıca git, 200₺ al!", a: "goto", to: 0, c: 200 }, { t: "Haydarpaşa'ya git.", a: "goto", to: 5 }, { t: "3 kare geri.", a: "move", s: -3 }, { t: "Hapise git!", a: "jail" }, { t: "50₺ kazan!", a: "get", m: 50 }, { t: "15₺ ceza.", a: "pay", m: 15 }, { t: "150₺ kazan!", a: "get", m: 150 }, { t: "Tamir: Ev 25₺, Otel 100₺", a: "repair", h: 25, o: 100 }, { t: "Ücretsiz Hapisten Çıkış Kartı!", a: "jailfree" }];
        let CHEST = [{ t: "Başlangıca git, 200₺ al!", a: "goto", to: 0, c: 200 }, { t: "Banka hatası: 200₺!", a: "get", m: 200 }, { t: "Doktor: 50₺", a: "pay", m: 50 }, { t: "Hisse: 50₺", a: "get", m: 50 }, { t: "Hapise git!", a: "jail" }, { t: "Tatil: 100₺", a: "get", m: 100 }, { t: "Vergi iadesi: 20₺", a: "get", m: 20 }, { t: "Miras: 100₺", a: "get", m: 100 }, { t: "Ücretsiz Hapisten Çıkış Kartı!", a: "jailfree" }];

        const SND = {
            ctx: null,
            enabled: true,
            init() {
                if (!this.ctx) {
                    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { }
                }
            },
            play(type) {
                if (!this.enabled) return;
                this.init();
                if (!this.ctx) return;
                const o = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                o.connect(g); g.connect(this.ctx.destination);
                const now = this.ctx.currentTime;
                if (type === 'dice') {
                    o.type = 'square';
                    o.frequency.setValueAtTime(120, now);
                    o.frequency.exponentialRampToValueAtTime(10, now + 0.15);
                    g.gain.setValueAtTime(0.05, now);
                    g.gain.linearRampToValueAtTime(0, now + 0.15);
                    o.start(); o.stop(now + 0.15);
                } else if (type === 'coin') {
                    o.type = 'sine';
                    o.frequency.setValueAtTime(800, now);
                    o.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                    g.gain.setValueAtTime(0.05, now);
                    g.gain.linearRampToValueAtTime(0, now + 0.15);
                    o.start(); o.stop(now + 0.15);
                } else if (type === 'buy') {
                    o.type = 'triangle';
                    o.frequency.setValueAtTime(400, now);
                    o.frequency.linearRampToValueAtTime(800, now + 0.4);
                    g.gain.setValueAtTime(0.05, now);
                    g.gain.linearRampToValueAtTime(0, now + 0.4);
                    o.start(); o.stop(now + 0.4);
                } else if (type === 'jail') {
                    o.type = 'sawtooth';
                    o.frequency.setValueAtTime(200, now);
                    o.frequency.linearRampToValueAtTime(50, now + 0.5);
                    g.gain.setValueAtTime(0.05, now);
                    g.gain.linearRampToValueAtTime(0, now + 0.5);
                    o.start(); o.stop(now + 0.5);
                }
            }
        };

        function toggleSoundEffect() {
            SND.enabled = !SND.enabled;
            const btn = document.getElementById('toggleSound');
            const mobBtn = document.getElementById('toggleSoundMob');
            if (btn) btn.classList.toggle('on', SND.enabled);
            if (mobBtn) mobBtn.classList.toggle('on', SND.enabled);
            autoSave();
        }

        // Trade Response Popup Functions
        function showTradeResponse(playerName, accepted) {
            const overlay = document.getElementById('tradeResponseOverlay');
            const popup = document.getElementById('tradeResponsePopup');
            const icon = document.getElementById('tradeResponseIcon');
            const title = document.getElementById('tradeResponseTitle');
            const message = document.getElementById('tradeResponseMessage');

            popup.classList.remove('accepted', 'rejected');

            if (accepted) {
                popup.classList.add('accepted');
                icon.textContent = '✅';
                title.textContent = t('trade_accepted_title');
                message.innerHTML = `<span class="trade-response-player">${playerName}</span> ${t('offer_accepted')}`;
            } else {
                popup.classList.add('rejected');
                icon.textContent = '❌';
                title.textContent = t('trade_rejected_title');
                message.innerHTML = `<span class="trade-response-player">${playerName}</span> ${t('offer_rejected')}`;
            }

            overlay.classList.add('active');
            popup.classList.add('active');

            // Auto-hide after 2.5 seconds
            setTimeout(() => {
                hideTradeResponse();
            }, 2500);
        }

        function hideTradeResponse() {
            const overlay = document.getElementById('tradeResponseOverlay');
            const popup = document.getElementById('tradeResponsePopup');
            overlay.classList.remove('active');
            popup.classList.remove('active');
        }

        function toast(message, type = 'info') {
            const container = document.getElementById('toast-container');
            if (!container) return;

            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;

            const icon = type === 'success' ? '🎉' : type === 'error' ? '❌' : 'ℹ️';

            toast.innerHTML = `
                <span class="toast-icon">${icon}</span>
                <span class="toast-message">${message}</span>
            `;

            container.appendChild(toast);

            // Auto remove
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-20px) scale(0.9)';
                setTimeout(() => toast.remove(), 400);
            }, 3500);
        }
        window.toast = toast; // Ensure it's global

        function animatePropertyTransfer(propId, toPlayerId) {
            const sqEl = document.getElementById('sq-' + propId);
            const pn = document.getElementById('playersPanel');
            if (!sqEl || !pn) return;
            const targetCard = pn.children[toPlayerId];
            if (!targetCard) return;
            const rectStart = sqEl.getBoundingClientRect();
            const rectEnd = targetCard.getBoundingClientRect();
            const ghost = document.createElement('div');
            ghost.className = 'property-transfer-ghost';
            ghost.style.background = window.activeSQ[propId].color || '#999';
            ghost.style.left = rectStart.left + (rectStart.width / 2) - 20 + 'px';
            ghost.style.top = rectStart.top + (rectStart.height / 2) - 20 + 'px';
            document.body.appendChild(ghost);
            requestAnimationFrame(() => {
                setTimeout(() => {
                    ghost.style.left = rectEnd.left + (rectEnd.width / 2) - 20 + 'px';
                    ghost.style.top = rectEnd.top + (rectEnd.height / 2) - 20 + 'px';
                    ghost.style.transform = 'scale(0.3) rotate(15deg)';
                    ghost.style.opacity = '0';
                }, 50);
            });
            setTimeout(() => ghost.remove(), 1000);
        }

        // Secret Cheat Code - 5 clicks on KAYITLAR gives 500₺ to Player 1
        let secretClickCount = 0;
        let secretClickTimer = null;
        function secretCheatClick() {
            secretClickCount++;

            // Reset counter after 3 seconds of no clicks
            clearTimeout(secretClickTimer);
            secretClickTimer = setTimeout(() => {
                secretClickCount = 0;
            }, 3000);

            if (secretClickCount >= 5) {
                secretClickCount = 0;

                // Check if game is active and player 1 exists
                if (G.players && G.players.length > 0) {
                    const player1 = G.players[0];
                    if (!player1.out) {
                        chgMoney(player1, 500);
                        log(`🎁 GİZLİ BONUS! ${player1.name} 500₺ kazandı!`, true);
                        spawnConfetti();
                        updateUI();
                        autoSave();
                    }
                }
            }
        }

        function spawnConfetti() {
            for (let i = 0; i < 40; i++) {
                const c = document.createElement('div');
                c.style.cssText = `position:fixed; width:8px; height:8px; background-color:${['#FFD700', '#C41E3A', '#2196F3', '#4CAF50', '#E91E63'][Math.floor(Math.random() * 5)]}; top:-10px; left:${Math.random() * 100}vw; z-index:9999; border-radius:1px;`;
                document.body.appendChild(c);
                const anim = c.animate([
                    { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
                    { transform: `translateY(100vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
                ], { duration: 1500 + Math.random() * 2000, easing: 'cubic-bezier(0,.5,.5,1)' });
                anim.onfinish = () => c.remove();
            }
        }

        const COLORS = { red: '#f44336', blue: '#2196f3', green: '#4caf50', yellow: '#ffeb3b' };
        const TOKEN_ICONS = ['🚗', '🎩', '🐕', '🚢', '🦖', '👞', '🧺', '🐈'];
        const LANGS = {
            tr: {
                start: "YENİ OYUNA BAŞLA",
                resume: "ÖNCEKİ OYUNA DEVAM ET",
                roll: "ZAR AT",
                buy: "SATIN AL",
                auction: "İHALE",
                house: "EV",
                mortgage: "İPOTEK",
                trade: "TAKAS YAP",
                endTurn: "TURU BİTİR",
                thinking: "düşünüyor...",
                jail: "HAPİS",
                jailPay: "CEZA ÖDE",
                jailCard: "KART KULLAN",
                stats: "İSTATİSTİKLER",
                theme: "GÖRÜNÜM TEMASI",
                speed: "HIZ",
                sound: "SES EFEKTLERİ",
                lang: "DİL",
                earned: "Toplam Kazanç",
                rentPaid: "Ödenen Kira",
                rentReceived: "Alınan Kira",
                taxPaid: "Vergi/Ceza",
                jailTurns: "Hapiste Geçen",
                doubles: "Çift Atma",
                lands: "Basılan Kare",
                winner: "kazandı!",
                ai_tycoon: "Kodaman",
                ai_banker: "Bankacı",
                ai_opportunist: "Fırsatçı",
                human: "İnsan",
                set_break: "Setimi bozamam!",
                not_fair: "Teklifi yetersiz buldu.",
                offer_accepted: "teklifi kabul etti!",
                offer_rejected: "teklifi reddetti.",
                counter: "daha iyi bir fiyat öneriyor:",
                chance_title: "ŞANS",
                chest_title: "SANDIK",
                chance_cards: [
                    { t: "Başlangıca git, 200₺ al!", a: "goto", to: 0, c: 200 },
                    { t: "Haydarpaşa'ya git.", a: "goto", to: 5 },
                    { t: "3 kare geri.", a: "move", s: -3 },
                    { t: "Hapise git!", a: "jail" },
                    { t: "50₺ kazan!", a: "get", m: 50 },
                    { t: "15₺ ceza.", a: "pay", m: 15 },
                    { t: "150₺ kazan!", a: "get", m: 150 },
                    { t: "Tamir: Ev 25₺, Otel 100₺", a: "repair", h: 25, o: 100 },
                    { t: "Ücretsiz Hapisten Çıkış Kartı!", a: "jailfree" }
                ],
                chest_cards: [
                    { t: "Başlangıca git, 200₺ al!", a: "goto", to: 0, c: 200 },
                    { t: "Banka hatası: 200₺!", a: "get", m: 200 },
                    { t: "Doktor: 50₺", a: "pay", m: 50 },
                    { t: "Hisse: 50₺", a: "get", m: 50 },
                    { t: "Hapise git!", a: "jail" },
                    { t: "Tatil: 100₺", a: "get", m: 100 },
                    { t: "Vergi iadesi: 20₺", a: "get", m: 20 },
                    { t: "Miras: 100₺", a: "get", m: 100 },
                    { t: "Ücretsiz Hapisten Çıkış Kartı!", a: "jailfree" }
                ],
                trade_offer_header: "🤝 TAKAS TEKLİFİ",
                trade_giver_label: "VERECEĞİ",
                trade_taker_label: "İSTEDİĞİ",
                trade_accept_btn: "✅ KABUL ET",
                trade_reject_btn: "❌ REDDET",
                trade_your_offer_label: "📤 Vereceğin:",
                trade_their_offer_label: "📥 Alacağın:",
                trade_offer_btn: "✅ Teklif Et",
                trade_money_placeholder: "Para (₺)",
                trade_title: "DEĞİŞ TOKUŞ",
                trade_offer_title: "TAKAS TEKLİFİ",
                trade_offer_msg: "sana bir takas teklifi gönderdi!",
                trade_nothing: "Para/Mülk yok",
                trade_accepted_title: "KABUL EDİLDİ!",
                trade_rejected_title: "REDDEDİLDİ",
                trade_success: "Takas başarıyla gerçekleşti!",
                buy_success: "başarıyla satın alındı!",
                trade_confirm: "%s kabul etsin mi?",
                trade_you: "Sen:",
                trade_return: "Karşılık:",
                trade_no_partner: "Takas yapılacak aktif başka oyuncu yok!",
                trade_select_item: "Bir şey seç!",
                trade_no_money: "Yeterli para yok!",
                trade_no_prop: "Mülk yok",
                trade_cancel: "İptal",
                trade_execute: "TAKAS YAP",
                players_header: "👥 OYUNCULAR",
                controls_header: "🎮 KONTROLLER",
                log_header: "📝 KAYITLAR",
                mortgage_header: "💰 İPOTEK",
                mortgage_empty: "Mülkün yok",
                mortgage_close: "Kapat",
                mortgage_status: "(İPOTEKLİ)",
                mortgage_sell_houses: "Önce evleri sat",
                mortgage_log: "ipotek",
                mortgage_out_log: "ipotekten çıkardı",
                currency: "₺",
                dice_rolled: "🎲 %s: %s+%s=%s%s",
                double: " ÇİFT!",
                jail_double: "🔓 %s çift atarak çıktı!",
                jail_wait_pay: "⚖️ %s 3 tur bekleyip 50₺ ödedi",
                jail_stay: "🔒 Hapiste (%s/3)",
                jail_3_doubles: "⚠️ %s 3 çift - HAPİS!",
                double_roll_again: "🎯 %s çift attı! Tekrar zar atabilir.",
                salary_msg: "💰 %s +%s₺ maaş aldı",
                tax_msg: "💸 %s %s₺ vergi ödedi",
                jail_go_msg: "👮 %s hapse girdi!",
                park_msg: "🎉 %s %s₺ park ödülü aldı!",
                land_own: "🏠 %s kendi mülküne geldi: %s",
                land_buy_warn: "🏠 %s satılık: %s₺",
                land_no_money: "⚠️ Para yetmiyor, açık arttırma?",
                rent_log: "💰 %s → %s: %s₺ kira",
                rent_toast: "💸 %s'e %s₺ kira ödediniz.",
                auction_log: "🔨 %s açık artırmada!",
                player_config_title: "OYUNCU YAPILANDIRMASI",
                name_placeholder: "İsim Girin",
                change_label: "DEĞİŞTİR",
                ai_easy: "Kolay AI",
                ai_medium: "Orta AI",
                ai_hard: "Zor AI",
                random: "Rastgele",
                closed_option: "Kapalı",
                map_selection_title: "HARİTA SEÇİMİ",
                map_select_button: "Harita Seç",
                general_settings_title: "GENEL AYARLAR",
                difficulty_label: "OYUN ZORLUĞU",
                board_3d_effect: "3D TAHTA EFEKTİ",
                theme_select_button: "Tema Seç",
                game_rules_title: "OYUN KURALLARI",
                starting_money_label: "BAŞLANGIÇ $",
                salary_label: "MAAŞ",
                park_pool_label: "PARK HAVUZU",
                random_start_label: "RASTGELE BAŞL.",
                made_by: "Made by",
                lang_select_title: "Dil Seç",
                speed_select_title: "Hız Seç",
                difficulty_select_title: "Oyun Zorluğu",
                player_type_title: "Oyuncu Tipi",
                personality_title: "Kişilik",
                map_select_title: "Harita Seç",
                theme_select_title: "Tema Seç",
                close_button: "Kapat",
                speed_slow: "Yavaş",
                speed_normal: "Normal",
                speed_fast: "Hızlı",
                speed_lightning: "Şimşek",
                difficulty_very_easy: "En Kolay",
                difficulty_easy: "Kolay",
                difficulty_normal: "Normal",
                difficulty_hard: "Zor",
                difficulty_very_hard: "En Zor"
            },
            en: {
                start: "START NEW GAME",
                resume: "RESUME PREVIOUS GAME",
                roll: "ROLL DICE",
                buy: "BUY",
                auction: "AUCTION",
                house: "HOUSE",
                mortgage: "MORTGAGE",
                trade: "TRADE",
                endTurn: "END TURN",
                thinking: "thinking...",
                jail: "JAIL",
                jailPay: "PAY FINE",
                jailCard: "USE CARD",
                stats: "STATISTICS",
                theme: "APPEARANCE THEME",
                speed: "SPEED",
                sound: "SOUND EFFECTS",
                lang: "LANGUAGE",
                earned: "Total Earned",
                rentPaid: "Rent Paid",
                rentReceived: "Rent Received",
                taxPaid: "Tax/Fine",
                jailTurns: "Jail Turns",
                doubles: "Dice Doubles",
                lands: "Squares Landed",
                winner: "won!",
                ai_tycoon: "Tycoon",
                ai_banker: "Banker",
                ai_opportunist: "Opportunist",
                human: "Human",
                set_break: "I can't break my set!",
                not_fair: "Found the offer insufficient.",
                counter: "suggests a better price:",
                offer_accepted: "accepted the offer!",
                offer_rejected: "rejected the offer.",
                buy_success: "purchased successfully!",
                chance_title: "CHANCE",
                chest_title: "CHEST",
                chance_cards: [
                    { t: "Go to Start, collect $200!", a: "goto", to: 0, c: 200 },
                    { t: "Go to the Railroad.", a: "goto", to: 5 },
                    { t: "Go back 3 spaces.", a: "move", s: -3 },
                    { t: "Go to Jail!", a: "jail" },
                    { t: "Win $50!", a: "get", m: 50 },
                    { t: "Pay $15 fine.", a: "pay", m: 15 },
                    { t: "Win $150!", a: "get", m: 150 },
                    { t: "Repairs: House $25, Hotel $100", a: "repair", h: 25, o: 100 },
                    { t: "Get Out of Jail Free Card!", a: "jailfree" }
                ],
                chest_cards: [
                    { t: "Go to Start, collect $200!", a: "goto", to: 0, c: 200 },
                    { t: "Bank error in your favor: $200!", a: "get", m: 200 },
                    { t: "Doctor fee: $50", a: "pay", m: 50 },
                    { t: "From sale of stock: $50", a: "get", m: 50 },
                    { t: "Go to Jail!", a: "jail" },
                    { t: "Holiday fund matures: $100", a: "get", m: 100 },
                    { t: "Tax refund: $20", a: "get", m: 20 },
                    { t: "Inherit $100", a: "get", m: 100 },
                    { t: "Get Out of Jail Free Card!", a: "jailfree" }
                ],
                trade_offer_header: "🤝 TRADE OFFER",
                trade_giver_label: "GIVING",
                trade_taker_label: "WANTING",
                trade_accept_btn: "✅ ACCEPT",
                trade_reject_btn: "❌ REJECT",
                trade_your_offer_label: "📤 Your Offer:",
                trade_their_offer_label: "📥 Their Offer:",
                trade_offer_btn: "✅ Propose",
                trade_money_placeholder: "Money ($)",
                trade_title: "TRADE",
                trade_offer_title: "TRADE OFFER",
                trade_offer_msg: "has sent you a trade offer!",
                trade_nothing: "No money/property",
                trade_accepted_title: "OFFER ACCEPTED!",
                trade_rejected_title: "OFFER REJECTED",
                trade_success: "Trade completed successfully!",
                trade_confirm: "Should %s accept?",
                trade_you: "You:",
                trade_return: "In exchange:",
                trade_no_partner: "No other active players to trade with!",
                trade_select_item: "Select something!",
                trade_no_money: "Not enough money!",
                trade_no_prop: "No property",
                trade_cancel: "Cancel",
                trade_execute: "EXECUTE TRADE",
                players_header: "👥 PLAYERS",
                controls_header: "🎮 CONTROLS",
                log_header: "📝 LOG",
                mortgage_header: "💰 MORTGAGE",
                mortgage_empty: "No properties",
                mortgage_close: "Close",
                mortgage_status: "(MORTGAGED)",
                mortgage_sell_houses: "Sell houses first",
                mortgage_log: "mortgaged",
                mortgage_out_log: "unmortgaged",
                currency: "$",
                dice_rolled: "🎲 %s: %s+%s=%s%s",
                double: " DOUBLE!",
                jail_double: "🔓 %s out by double!",
                jail_wait_pay: "⚖️ %s waited 3 turns and paid 50",
                jail_stay: "🔒 In Jail (%s/3)",
                jail_3_doubles: "⚠️ %s 3 doubles - JAIL!",
                double_roll_again: "🎯 %s doubles! Roll again.",
                salary_msg: "💰 %s +%s salary collected",
                tax_msg: "💸 %s paid %s tax",
                jail_go_msg: "👮 %s went to jail!",
                park_msg: "🎉 %s collected %s park reward!",
                land_own: "🏠 %s landed on own property: %s",
                land_buy_warn: "🏠 %s for sale: %s",
                land_no_money: "⚠️ Not enough money, auction?",
                rent_log: "💰 %s → %s: %s rent",
                rent_toast: "💸 Paid %s rent to %s.",
                auction_log: "🔨 %s in auction!",
                player_config_title: "PLAYER CONFIGURATION",
                name_placeholder: "Enter Name",
                change_label: "CHANGE",
                ai_easy: "Easy AI",
                ai_medium: "Medium AI",
                ai_hard: "Hard AI",
                random: "Random",
                closed_option: "Closed",
                map_selection_title: "MAP SELECTION",
                map_select_button: "Select Map",
                general_settings_title: "GENERAL SETTINGS",
                difficulty_label: "DIFFICULTY",
                board_3d_effect: "3D BOARD EFFECT",
                theme_select_button: "Select Theme",
                game_rules_title: "GAME RULES",
                starting_money_label: "STARTING $",
                salary_label: "SALARY",
                park_pool_label: "PARK POOL",
                random_start_label: "RANDOM START",
                made_by: "Made by",
                lang_select_title: "Select Language",
                speed_select_title: "Select Speed",
                difficulty_select_title: "Game Difficulty",
                player_type_title: "Player Type",
                personality_title: "Personality",
                map_select_title: "Select Map",
                theme_select_title: "Select Theme",
                close_button: "Close",
                speed_slow: "Slow",
                speed_normal: "Normal",
                speed_fast: "Fast",
                speed_lightning: "Lightning",
                difficulty_very_easy: "Very Easy",
                difficulty_easy: "Easy",
                difficulty_normal: "Normal",
                difficulty_hard: "Hard",
                difficulty_very_hard: "Very Hard"
            }
        };

        let currLang = 'tr';
        function t(key) { return LANGS[currLang][key] || key; }

        function toggleLang() {
            currLang = currLang === 'tr' ? 'en' : 'tr';
            const langText = currLang.toUpperCase();
            const langLabel = document.getElementById('langLabel');
            const langLabelMob = document.getElementById('langLabelMob');
            if (langLabel) langLabel.textContent = langText;
            if (langLabelMob) langLabelMob.textContent = langText;
            updateLangUI();
            autoSave();
        }

        function updateLangUI() {
            // Update setup screen
            const startBtn = document.getElementById('startGameBtn');
            if (startBtn) startBtn.textContent = t('start');
            const resBtn = document.getElementById('resumeBtn');
            if (resBtn) resBtn.textContent = t('resume');
            
            // Update setup screen titles
            const playerConfigTitle = document.getElementById('playerConfigTitle');
            if (playerConfigTitle) {
                playerConfigTitle.textContent = `👥 ${t('player_config_title')}`;
            }
            
            const mapSelectionTitle = document.getElementById('mapSelectionTitle');
            if (mapSelectionTitle) {
                mapSelectionTitle.textContent = `🗺️ ${t('map_selection_title')}`;
            }
            
            const mapSelectButton = document.getElementById('mapSelectButtonText');
            if (mapSelectButton) {
                mapSelectButton.textContent = t('map_select_button');
            }
            
            const generalSettingsTitle = document.getElementById('generalSettingsTitle');
            if (generalSettingsTitle) {
                generalSettingsTitle.textContent = `⚙️ ${t('general_settings_title')}`;
            }
            
            const themeTitle = document.getElementById('themeTitle');
            if (themeTitle) {
                themeTitle.textContent = `🏛️ ${t('theme')}`;
            }
            
            const themeSelectButton = document.getElementById('themeSelectButtonText');
            if (themeSelectButton) {
                themeSelectButton.textContent = t('theme_select_button');
            }
            
            const gameRulesTitle = document.getElementById('gameRulesTitle');
            if (gameRulesTitle) {
                gameRulesTitle.textContent = `⚖️ ${t('game_rules_title')}`;
            }
            
            // Update labels
            const langLabel = document.getElementById('langLabelText');
            if (langLabel) {
                langLabel.textContent = `${t('lang')} / LANG`;
            }
            
            const speedLabel = document.getElementById('speedLabelText');
            if (speedLabel) {
                speedLabel.textContent = `${t('speed')} / SPEED`;
            }
            
            const difficultyLabel = document.getElementById('difficultyLabel');
            if (difficultyLabel) {
                difficultyLabel.textContent = t('difficulty_label');
            }
            
            const board3DLabel = document.getElementById('board3DLabel');
            if (board3DLabel) {
                board3DLabel.textContent = t('board_3d_effect');
            }
            
            // Update rule labels
            const startingMoneyLabel = document.getElementById('startingMoneyLabel');
            if (startingMoneyLabel) {
                startingMoneyLabel.textContent = t('starting_money_label');
            }
            
            const salaryLabel = document.getElementById('salaryLabel');
            if (salaryLabel) {
                salaryLabel.textContent = t('salary_label');
            }
            
            const parkPoolLabel = document.getElementById('parkPoolLabel');
            if (parkPoolLabel) {
                parkPoolLabel.textContent = t('park_pool_label');
            }
            
            const randomStartLabel = document.getElementById('randomStartLabel');
            if (randomStartLabel) {
                randomStartLabel.textContent = t('random_start_label');
            }
            
            // Update placeholders
            document.querySelectorAll('input[data-placeholder-tr]').forEach(input => {
                input.placeholder = currLang === 'tr' ? input.getAttribute('data-placeholder-tr') : input.getAttribute('data-placeholder-en');
            });
            
            // Update token preview labels
            document.querySelectorAll('.token-preview').forEach(el => {
                el.setAttribute('data-label', t('change_label'));
            });
            
            // Update player type displays
            for (let i = 1; i <= 4; i++) {
                updatePlayerTypeDisplay(i);
                updatePlayerPersDisplay(i);
            }
            
            // Update speed and difficulty displays
            const speedSelect = document.getElementById('setupSpeed');
            if (speedSelect) {
                selectSpeedFromModal(speedSelect.value || '200');
            }
            
            const difficultySelect = document.getElementById('difficultyLevel');
            if (difficultySelect) {
                updateDifficultyDisplay();
            }
            
            // Update modal titles
            const langModalTitle = document.getElementById('langModalTitle');
            if (langModalTitle) {
                langModalTitle.textContent = `🌐 ${t('lang_select_title')} / Language`;
            }
            
            const speedModalTitle = document.getElementById('speedModalTitle');
            if (speedModalTitle) {
                speedModalTitle.textContent = `⚡ ${t('speed_select_title')} / Speed`;
            }
            
            const difficultyModalTitle = document.getElementById('difficultyModalTitle');
            if (difficultyModalTitle) {
                difficultyModalTitle.textContent = `⚖️ ${t('difficulty_select_title')} / Difficulty`;
            }
            
            const playerTypeModalTitle = document.getElementById('playerTypeModalTitle');
            if (playerTypeModalTitle) {
                playerTypeModalTitle.textContent = `👤 ${t('player_type_title')}`;
            }
            
            const playerPersModalTitle = document.getElementById('playerPersModalTitle');
            if (playerPersModalTitle) {
                playerPersModalTitle.textContent = `🎭 ${t('personality_title')}`;
            }
            
            const mapModalTitle = document.getElementById('mapModalTitle');
            if (mapModalTitle) {
                mapModalTitle.textContent = `🗺️ ${t('map_select_title')}`;
            }
            
            const themeModalTitle = document.getElementById('themeModalTitle');
            if (themeModalTitle) {
                themeModalTitle.textContent = `🏛️ ${t('theme_select_title')}`;
            }
            
            // Update close buttons
            const closeButtons = ['langModalCloseBtn', 'speedModalCloseBtn', 'difficultyModalCloseBtn', 
                                  'playerTypeModalCloseBtn', 'playerPersModalCloseBtn', 'mapModalCloseBtn'];
            closeButtons.forEach(btnId => {
                const btn = document.getElementById(btnId);
                if (btn) {
                    btn.textContent = t('close_button');
                }
            });
            
            // Update speed modal options dynamically
            const speedOptionsData = {
                '100': { emoji: '🐢', text: t('speed_slow') },
                '200': { emoji: '⚡', text: t('speed_normal') },
                '300': { emoji: '🚀', text: t('speed_fast') },
                '400': { emoji: '⚡', text: t('speed_lightning') }
            };
            
            Object.keys(speedOptionsData).forEach(speed => {
                const card = document.getElementById(`speed-modal-${speed}`);
                if (card) {
                    const span = card.querySelector('span');
                    if (span) {
                        span.textContent = `${speedOptionsData[speed].emoji} ${speedOptionsData[speed].text}`;
                    }
                }
            });
            
            // Update difficulty modal options dynamically
            const difficultyOptionsData = {
                '1': t('difficulty_very_easy'),
                '2': t('difficulty_easy'),
                '3': t('difficulty_normal'),
                '4': t('difficulty_hard'),
                '5': t('difficulty_very_hard')
            };
            
            Object.keys(difficultyOptionsData).forEach(level => {
                const card = document.getElementById(`difficulty-modal-${level}`);
                if (card) {
                    const span = card.querySelector('span');
                    if (span) {
                        span.textContent = difficultyOptionsData[level];
                    }
                }
            });
            
            // Update player type modal options
            const playerTypeOptionsData = {
                'human': { emoji: '👤', text: t('human') },
                'ai-easy': { emoji: '🤖', text: t('ai_easy') },
                'ai-medium': { emoji: '🤖', text: t('ai_medium') },
                'ai-hard': { emoji: '🤖', text: t('ai_hard') },
                'none': { emoji: '---', text: `(${t('closed_option')})` }
            };
            
            Object.keys(playerTypeOptionsData).forEach(type => {
                const card = document.getElementById(`player-type-${type}`);
                if (card) {
                    const span = card.querySelector('span');
                    if (span) {
                        const opt = playerTypeOptionsData[type];
                        span.textContent = type === 'none' ? `${opt.emoji} ${opt.text}` : `${opt.emoji} ${opt.text}`;
                    }
                }
            });
            
            // Update personality modal options
            const personalityOptionsData = {
                'Random': { emoji: '🎲', text: t('random') },
                'Tycoon': { emoji: '💼', text: t('ai_tycoon') },
                'Banker': { emoji: '🏦', text: t('ai_banker') },
                'Opportunist': { emoji: '🦊', text: t('ai_opportunist') }
            };
            
            Object.keys(personalityOptionsData).forEach(pers => {
                const card = document.getElementById(`player-pers-${pers}`);
                if (card) {
                    const span = card.querySelector('span');
                    if (span) {
                        const opt = personalityOptionsData[pers];
                        span.textContent = `${opt.emoji} ${opt.text}`;
                    }
                }
            });
            
            // Update credit badge
            const madeByText = document.getElementById('madeByText');
            if (madeByText) {
                madeByText.textContent = t('made_by');
            }

            // Update game UI buttons
            const rollBtn = document.getElementById('rollBtn');
            const buyBtn = document.getElementById('buyBtn');
            const auctionBtn = document.getElementById('auctionBtn');
            const buildBtn = document.getElementById('buildBtn');
            const endBtn = document.getElementById('endBtn');
            const mobRollBtn = document.getElementById('mobRollBtn');
            const mobBuyBtn = document.getElementById('mobBuyBtn');
            const mobEndBtn = document.getElementById('mobEndBtn');

            if (rollBtn) rollBtn.innerHTML = `🎲 ${t('roll')}`;
            if (buyBtn) buyBtn.innerHTML = `🏠 ${t('buy')}`;
            if (auctionBtn) auctionBtn.innerHTML = `🔨 ${t('auction')}`;
            if (buildBtn) buildBtn.innerHTML = `🏗️ ${t('house')}`;
            if (endBtn) endBtn.innerHTML = `⏭️ ${t('endTurn')}`;

            // Mobile buttons
            const mobTradeBtn = document.getElementById('mobTradeBtn');
            const mobBuildBtn = document.getElementById('mobBuildBtn');
            if (mobRollBtn) {
                mobRollBtn.innerHTML = `<span class="mob-btn-icon">🎲</span><span class="mob-btn-text">${t('roll')}</span>`;
            }
            if (mobBuyBtn) {
                mobBuyBtn.innerHTML = `<span class="mob-btn-icon">🏠</span><span class="mob-btn-text">${t('buy')}</span>`;
            }
            if (mobEndBtn) {
                mobEndBtn.innerHTML = `<span class="mob-btn-icon">⏭️</span><span class="mob-btn-text">${t('endTurn')}</span>`;
            }
            if (mobTradeBtn) {
                mobTradeBtn.innerHTML = `<span class="mob-btn-icon">🔄</span><span class="mob-btn-text">${t('trade')}</span>`;
            }
            if (mobBuildBtn) {
                mobBuildBtn.innerHTML = `<span class="mob-btn-icon">🏗️</span><span class="mob-btn-text">${t('house')}</span>`;
            }

            // Jail controls
            const jailPayBtn = document.querySelector('#jailControls .btn-action');
            if (jailPayBtn) jailPayBtn.innerHTML = `💸 ${t('jailPay')} (50₺)`;
            const jailCardBtn = document.getElementById('useJailCardBtn');
            if (jailCardBtn) jailCardBtn.innerHTML = `🎫 ${t('jailCard')}`;

            // Update side panel headers based on language
            const playerHeader = document.querySelector('.players-side h2');
            if (playerHeader) playerHeader.innerHTML = t('players_header');

            const sideHeaders = document.querySelectorAll('.side-panel h2');
            if (sideHeaders[1]) sideHeaders[1].innerHTML = t('controls_header');
            if (sideHeaders[2]) sideHeaders[2].innerHTML = t('log_header');

            // Update token preview labels
            document.querySelectorAll('.token-preview').forEach(el => {
                el.setAttribute('data-label', t('change_label'));
            });

            // Trade buttons
            document.querySelectorAll('button[onclick="openTrade()"]').forEach(btn => {
                btn.innerHTML = `🔄 ${t('trade')}`;
            });

            // Mortgage buttons
            document.querySelectorAll('button[onclick="openMortgage()"]').forEach(btn => {
                btn.innerHTML = `💰 ${t('mortgage')}`;
            });

            // Trade Modals
            const tradeOfferHeader = document.getElementById('tradeOfferHeader');
            if (tradeOfferHeader) tradeOfferHeader.innerHTML = t('trade_offer_header');
            const tradeOfferGiverLabel = document.getElementById('tradeOfferGiverLabel');
            if (tradeOfferGiverLabel) tradeOfferGiverLabel.innerHTML = t('trade_giver_label');
            const tradeOfferTakerLabel = document.getElementById('tradeOfferTakerLabel');
            if (tradeOfferTakerLabel) tradeOfferTakerLabel.innerHTML = t('trade_taker_label');
            const acceptTradeBtn = document.getElementById('acceptTradeBtn');
            if (acceptTradeBtn) acceptTradeBtn.innerHTML = t('trade_accept_btn');
            const rejectTradeBtn = document.getElementById('rejectTradeBtn');
            if (rejectTradeBtn) rejectTradeBtn.innerHTML = t('trade_reject_btn');

            const tradeModalHeader = document.getElementById('tradeModalHeader');
            if (tradeModalHeader) tradeModalHeader.innerHTML = `🔄 ${t('trade_title')}`;
            const tradeYourOfferLabel = document.getElementById('tradeYourOfferLabel');
            if (tradeYourOfferLabel) tradeYourOfferLabel.innerHTML = t('trade_your_offer_label');
            const tradeTheirOfferLabel = document.getElementById('tradeTheirOfferLabel');
            if (tradeTheirOfferLabel) tradeTheirOfferLabel.innerHTML = t('trade_their_offer_label');
            const tradeProposeBtn = document.getElementById('tradeProposeBtn');
            if (tradeProposeBtn) tradeProposeBtn.innerHTML = t('trade_offer_btn');
            const tradeCancelBtn = document.getElementById('tradeCancelBtn');
            if (tradeCancelBtn) tradeCancelBtn.innerHTML = t('trade_cancel');

            const myMoneyInput = document.getElementById('myMoney');
            if (myMoneyInput) myMoneyInput.placeholder = t('trade_money_placeholder');
            const theirMoneyInput = document.getElementById('theirMoney');
            if (theirMoneyInput) theirMoneyInput.placeholder = t('trade_money_placeholder');
            // Mortgage modal
            const mortgageHeader = document.querySelector('#mortgageModal h2');
            if (mortgageHeader) mortgageHeader.innerHTML = t('mortgage_header');
            const mortgageCloseBtn = document.querySelector('#mortgageModal .btn-secondary');
            if (mortgageCloseBtn) mortgageCloseBtn.innerHTML = t('mortgage_close');
        }

        let G = { players: [], cur: 0, rolled: false, doubles: 0, park: 0, pending: null };
        let AUC = { on: false, prop: null, bid: 0, bidder: null, parts: [], idx: 0 };
        let TR = { my: [], their: [] };
        function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a }
        const MAPS = {
            istanbul: [
                { id: 0, name: "BAŞLA", type: "go" }, { id: 1, name: "Kasımpaşa", type: "property", color: "#8B4513", price: 60, rent: [2, 10, 30, 90, 160, 250], hc: 50, g: "brown" }, { id: 2, name: "Sandık", type: "chest" }, { id: 3, name: "Dolapdere", type: "property", color: "#8B4513", price: 60, rent: [4, 20, 60, 180, 320, 450], hc: 50, g: "brown" }, { id: 4, name: "Vergi", type: "tax", amount: 200 }, { id: 5, name: "Haydarpaşa", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
                { id: 6, name: "Beşiktaş", type: "property", color: "#87CEEB", price: 100, rent: [6, 30, 90, 270, 400, 550], hc: 50, g: "lightblue" }, { id: 7, name: "Şans", type: "chance" }, { id: 8, name: "Ortaköy", type: "property", color: "#87CEEB", price: 100, rent: [6, 30, 90, 270, 400, 550], hc: 50, g: "lightblue" }, { id: 9, name: "Arnavutköy", type: "property", color: "#87CEEB", price: 120, rent: [8, 40, 100, 300, 450, 600], hc: 50, g: "lightblue" }, { id: 10, name: "HAPİS", type: "jail" },
                { id: 11, name: "Kadıköy", type: "property", color: "#FF69B4", price: 140, rent: [10, 50, 150, 450, 625, 750], hc: 100, g: "pink" }, { id: 12, name: "İSKİ", type: "utility", price: 150 }, { id: 13, name: "Moda", type: "property", color: "#FF69B4", price: 140, rent: [10, 50, 150, 450, 625, 750], hc: 100, g: "pink" }, { id: 14, name: "Fenerbahçe", type: "property", color: "#FF69B4", price: 160, rent: [12, 60, 180, 500, 700, 900], hc: 100, g: "pink" }, { id: 15, name: "Sirkeci", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
                { id: 16, name: "Taksim", type: "property", color: "#FFA500", price: 180, rent: [14, 70, 200, 550, 750, 950], hc: 100, g: "orange" }, { id: 17, name: "Sandık", type: "chest" }, { id: 18, name: "Cihangir", type: "property", color: "#FFA500", price: 180, rent: [14, 70, 200, 550, 750, 950], hc: 100, g: "orange" }, { id: 19, name: "Galata", type: "property", color: "#FFA500", price: 200, rent: [16, 80, 220, 600, 800, 1000], hc: 100, g: "orange" }, { id: 20, name: "ÜCRETSİZ PARK", type: "parking" },
                { id: 21, name: "Şişli", type: "property", color: "#FF0000", price: 220, rent: [18, 90, 250, 700, 875, 1050], hc: 150, g: "red" }, { id: 22, name: "Şans", type: "chance" }, { id: 23, name: "Mecidiyeköy", type: "property", color: "#FF0000", price: 220, rent: [18, 90, 250, 700, 875, 1050], hc: 150, g: "red" }, { id: 24, name: "Levent", type: "property", color: "#FF0000", price: 240, rent: [20, 100, 300, 750, 925, 1100], hc: 150, g: "red" }, { id: 25, name: "Ankara İst.", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
                { id: 26, name: "Üsküdar", type: "property", color: "#FFFF00", price: 260, rent: [22, 110, 330, 800, 975, 1150], hc: 150, g: "yellow" }, { id: 27, name: "Çengelköy", type: "property", color: "#FFFF00", price: 260, rent: [22, 110, 330, 800, 975, 1150], hc: 150, g: "yellow" }, { id: 28, name: "İGDAŞ", type: "utility", price: 150 }, { id: 29, name: "Beylerbeyi", type: "property", color: "#FFFF00", price: 280, rent: [24, 120, 360, 850, 1025, 1200], hc: 150, g: "yellow" }, { id: 30, name: "HAPİSE GİT", type: "gotojail" },
                { id: 31, name: "Bebek", type: "property", color: "#228B22", price: 300, rent: [26, 130, 390, 900, 1100, 1275], hc: 200, g: "green" }, { id: 32, name: "Etiler", type: "property", color: "#228B22", price: 300, rent: [26, 130, 390, 900, 1100, 1275], hc: 200, g: "green" }, { id: 33, name: "Sandık", type: "chest" }, { id: 34, name: "Yeniköy", type: "property", color: "#228B22", price: 320, rent: [28, 150, 450, 1000, 1200, 1400], hc: 200, g: "green" }, { id: 35, name: "İstanbul İst.", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
                { id: 36, name: "Şans", type: "chance" }, { id: 37, name: "Nişantaşı", type: "property", color: "#0000CD", price: 350, rent: [35, 175, 500, 1100, 1300, 1500], hc: 200, g: "darkblue" }, { id: 38, name: "Lüks Vergisi", type: "tax", amount: 100 }, { id: 39, name: "Bağdat Cd.", type: "property", color: "#0000CD", price: 400, rent: [50, 200, 600, 1400, 1700, 2000], hc: 200, g: "darkblue" }
            ],
            turkiye: SQ, // Original SQ is now 'turkiye'
            world: [
                { id: 0, name: "START", type: "go" }, { id: 1, name: "Old Delhi", type: "property", color: "#8B4513", price: 60, rent: [2, 10, 30, 90, 160, 250], hc: 50, g: "brown" }, { id: 2, name: "Chest", type: "chest" }, { id: 3, name: "Jakarta", type: "property", color: "#8B4513", price: 60, rent: [4, 20, 60, 180, 320, 450], hc: 50, g: "brown" }, { id: 4, name: "Income Tax", type: "tax", amount: 200 }, { id: 5, name: "Reading RR", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
                { id: 6, name: "Hong Kong", type: "property", color: "#87CEEB", price: 100, rent: [6, 30, 90, 270, 400, 550], hc: 50, g: "lightblue" }, { id: 7, name: "Chance", type: "chance" }, { id: 8, name: "Beijing", type: "property", color: "#87CEEB", price: 100, rent: [6, 30, 90, 270, 400, 550], hc: 50, g: "lightblue" }, { id: 9, name: "Shanghai", type: "property", color: "#87CEEB", price: 120, rent: [8, 40, 100, 300, 450, 600], hc: 50, g: "lightblue" }, { id: 10, name: "JAIL", type: "jail" },
                { id: 11, name: "Athens", type: "property", color: "#FF69B4", price: 140, rent: [10, 50, 150, 450, 625, 750], hc: 100, g: "pink" }, { id: 12, name: "Electric Co.", type: "utility", price: 150 }, { id: 13, name: "Rome", type: "property", color: "#FF69B4", price: 140, rent: [10, 50, 150, 450, 625, 750], hc: 100, g: "pink" }, { id: 14, name: "Madrid", type: "property", color: "#FF69B4", price: 160, rent: [12, 60, 180, 500, 700, 900], hc: 100, g: "pink" }, { id: 15, name: "Pennsylvania RR", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
                { id: 16, name: "Berlin", type: "property", color: "#FFA500", price: 180, rent: [14, 70, 200, 550, 750, 950], hc: 100, g: "orange" }, { id: 17, name: "Chest", type: "chest" }, { id: 18, name: "Vienna", type: "property", color: "#FFA500", price: 180, rent: [14, 70, 200, 550, 750, 950], hc: 100, g: "orange" }, { id: 19, name: "Prague", type: "property", color: "#FFA500", price: 200, rent: [16, 80, 220, 600, 800, 1000], hc: 100, g: "orange" }, { id: 20, name: "FREE PARKING", type: "parking" },
                { id: 21, name: "Tokyo", type: "property", color: "#FF0000", price: 220, rent: [18, 90, 250, 700, 875, 1050], hc: 150, g: "red" }, { id: 22, name: "Chance", type: "chance" }, { id: 23, name: "Seoul", type: "property", color: "#FF0000", price: 220, rent: [18, 90, 250, 700, 875, 1050], hc: 150, g: "red" }, { id: 24, name: "Kyoto", type: "property", color: "#FF0000", price: 240, rent: [20, 100, 300, 750, 925, 1100], hc: 150, g: "red" }, { id: 25, name: "B. & O. RR", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
                { id: 26, name: "Sydney", type: "property", color: "#FFFF00", price: 260, rent: [22, 110, 330, 800, 975, 1150], hc: 150, g: "yellow" }, { id: 27, name: "Melbourne", type: "property", color: "#FFFF00", price: 260, rent: [22, 110, 330, 800, 975, 1150], hc: 150, g: "yellow" }, { id: 28, name: "Water Works", type: "utility", price: 150 }, { id: 29, name: "Auckland", type: "property", color: "#FFFF00", price: 280, rent: [24, 120, 360, 850, 1025, 1200], hc: 150, g: "yellow" }, { id: 30, name: "GO TO JAIL", type: "gotojail" },
                { id: 31, name: "Rio de Janeiro", type: "property", color: "#228B22", price: 300, rent: [26, 130, 390, 900, 1100, 1275], hc: 200, g: "green" }, { id: 32, name: "Buenos Aires", type: "property", color: "#228B22", price: 300, rent: [26, 130, 390, 900, 1100, 1275], hc: 200, g: "green" }, { id: 33, name: "Chest", type: "chest" }, { id: 34, name: "Santiago", type: "property", color: "#228B22", price: 320, rent: [28, 150, 450, 1000, 1200, 1400], hc: 200, g: "green" }, { id: 35, name: "Short Line", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
                { id: 36, name: "Chance", type: "chance" }, { id: 37, name: "London", type: "property", color: "#0000CD", price: 350, rent: [35, 175, 500, 1100, 1300, 1500], hc: 200, g: "darkblue" }, { id: 38, name: "Luxury Tax", type: "tax", amount: 100 }, { id: 39, name: "New York", type: "property", color: "#0000CD", price: 400, rent: [50, 200, 600, 1400, 1700, 2000], hc: 200, g: "darkblue" }
            ],
            superlig: [
                { id: 0, name: "BAŞLA", type: "go" },
                { id: 1, name: "İstanbulspor", type: "property", color: "#8B4513", price: 60, rent: [2, 10, 30, 90, 160, 250], hc: 50, g: "brown" },
                { id: 2, name: "Sandık", type: "chest" },
                { id: 3, name: "Pendikspor", type: "property", color: "#8B4513", price: 60, rent: [4, 20, 60, 180, 320, 450], hc: 50, g: "brown" },
                { id: 4, name: "TFF Kesintisi", type: "tax", amount: 200 },
                { id: 5, name: "Atatürk Olimpiyat", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
                { id: 6, name: "Rizespor", type: "property", color: "#87CEEB", price: 100, rent: [6, 30, 90, 270, 400, 550], hc: 50, g: "lightblue" },
                { id: 7, name: "VAR", type: "chance" },
                { id: 8, name: "Ankaragücü", type: "property", color: "#87CEEB", price: 100, rent: [6, 30, 90, 270, 400, 550], hc: 50, g: "lightblue" },
                { id: 9, name: "Kasımpaşa", type: "property", color: "#87CEEB", price: 120, rent: [8, 40, 100, 300, 450, 600], hc: 50, g: "lightblue" },
                { id: 10, name: "CEZA", type: "jail" },
                { id: 11, name: "Sivasspor", type: "property", color: "#FF69B4", price: 140, rent: [10, 50, 150, 450, 625, 750], hc: 100, g: "pink" },
                { id: 12, name: "Passolig", type: "utility", price: 150 },
                { id: 13, name: "Antalyaspor", type: "property", color: "#FF69B4", price: 140, rent: [10, 50, 150, 450, 625, 750], hc: 100, g: "pink" },
                { id: 14, name: "Alanyaspor", type: "property", color: "#FF69B4", price: 160, rent: [12, 60, 180, 500, 700, 900], hc: 100, g: "pink" },
                { id: 15, name: "Vodafone Park", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
                { id: 16, name: "Kayserispor", type: "property", color: "#FFA500", price: 180, rent: [14, 70, 200, 550, 750, 950], hc: 100, g: "orange" },
                { id: 17, name: "Sandık", type: "chest" },
                { id: 18, name: "Konyaspor", type: "property", color: "#FFA500", price: 180, rent: [14, 70, 200, 550, 750, 950], hc: 100, g: "orange" },
                { id: 19, name: "Gaziantep FK", type: "property", color: "#FFA500", price: 200, rent: [16, 80, 220, 600, 800, 1000], hc: 100, g: "orange" },
                { id: 20, name: "MİLLİ ARA", type: "parking" },
                { id: 21, name: "Adana Demir", type: "property", color: "#FF0000", price: 220, rent: [18, 90, 250, 700, 875, 1050], hc: 150, g: "red" },
                { id: 22, name: "VAR", type: "chance" },
                { id: 23, name: "Başakşehir", type: "property", color: "#FF0000", price: 220, rent: [18, 90, 250, 700, 875, 1050], hc: 150, g: "red" },
                { id: 24, name: "Trabzonspor", type: "property", color: "#FF0000", price: 240, rent: [20, 100, 300, 750, 925, 1100], hc: 150, g: "red" },
                { id: 25, name: "Şükrü Saracoğlu", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
                { id: 26, name: "Samsunspor", type: "property", color: "#FFFF00", price: 260, rent: [22, 110, 330, 800, 975, 1150], hc: 150, g: "yellow" },
                { id: 27, name: "Göztepe", type: "property", color: "#FFFF00", price: 260, rent: [22, 110, 330, 800, 975, 1150], hc: 150, g: "yellow" },
                { id: 28, name: "beIN Sports", type: "utility", price: 150 },
                { id: 29, name: "Hatayspor", type: "property", color: "#FFFF00", price: 280, rent: [24, 120, 360, 850, 1025, 1200], hc: 150, g: "yellow" },
                { id: 30, name: "KIRMIZI KART", type: "gotojail" },
                { id: 31, name: "Beşiktaş", type: "property", color: "#228B22", price: 300, rent: [26, 130, 390, 900, 1100, 1275], hc: 200, g: "green" },
                { id: 32, name: "Fenerbahçe", type: "property", color: "#228B22", price: 320, rent: [28, 150, 450, 1000, 1200, 1400], hc: 200, g: "green" },
                { id: 33, name: "Sandık", type: "chest" },
                { id: 34, name: "Trabzonspor", type: "property", color: "#228B22", price: 320, rent: [28, 150, 450, 1000, 1200, 1400], hc: 200, g: "green" },
                { id: 35, name: "Nef Stadyumu", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
                { id: 36, name: "VAR", type: "chance" },
                { id: 37, name: "ŞAMPİYONLAR LİGİ", type: "property", color: "#0000CD", price: 380, rent: [40, 180, 550, 1200, 1400, 1600], hc: 200, g: "darkblue" },
                { id: 38, name: "UEFA Cezası", type: "tax", amount: 100 },
                { id: 39, name: "GALATASARAY", type: "property", color: "#0000CD", price: 450, rent: [60, 250, 700, 1600, 1900, 2200], hc: 200, g: "darkblue" }
            ],
            mars: [
                { id: 0, name: "BAŞLA", type: "go" }, { id: 1, name: "Toz Bulutu", type: "property", color: "#8B4513", price: 60, rent: [2, 10, 30, 90, 160, 250], hc: 50, g: "brown" }, { id: 2, name: "İkmal", type: "chest" }, { id: 3, name: "Kızıl Vadi", type: "property", color: "#8B4513", price: 60, rent: [4, 20, 60, 180, 320, 450], hc: 50, g: "brown" }, { id: 4, name: "Oksijen Vergisi", type: "tax", amount: 200 }, { id: 5, name: "Roket Üssü Alpha", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
                { id: 6, name: "Olympus Mons", type: "property", color: "#87CEEB", price: 100, rent: [6, 30, 90, 270, 400, 550], hc: 50, g: "lightblue" }, { id: 7, name: "Sinyal", type: "chance" }, { id: 8, name: "Tharsis Planum", type: "property", color: "#87CEEB", price: 100, rent: [6, 30, 90, 270, 400, 550], hc: 50, g: "lightblue" }, { id: 9, name: "Valles Marineris", type: "property", color: "#87CEEB", price: 120, rent: [8, 40, 100, 300, 450, 600], hc: 50, g: "lightblue" }, { id: 10, name: "KARANTİNA", type: "jail" },
                { id: 11, name: "Elysium", type: "property", color: "#FF69B4", price: 140, rent: [10, 50, 150, 450, 625, 750], hc: 100, g: "pink" }, { id: 12, name: "Güneş Panelleri", type: "utility", price: 150 }, { id: 13, name: "Utopia Planitia", type: "property", color: "#FF69B4", price: 140, rent: [10, 50, 150, 450, 625, 750], hc: 100, g: "pink" }, { id: 14, name: "Hellas Planitia", type: "property", color: "#FF69B4", price: 160, rent: [12, 60, 180, 500, 700, 900], hc: 100, g: "pink" }, { id: 15, name: "Işınlanma Kapısı", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
                { id: 16, name: "Curiosity Üssü", type: "property", color: "#FFA500", price: 180, rent: [14, 70, 200, 550, 750, 950], hc: 100, g: "orange" }, { id: 17, name: "İkmal", type: "chest" }, { id: 18, name: "Perseverance", type: "property", color: "#FFA500", price: 180, rent: [14, 70, 200, 550, 750, 950], hc: 100, g: "orange" }, { id: 19, name: "Zhurong", type: "property", color: "#FFA500", price: 200, rent: [16, 80, 220, 600, 800, 1000], hc: 100, g: "orange" }, { id: 20, name: "YERÇEKİMSİZ ALAN", type: "parking" },
                { id: 21, name: "Arsia Mons", type: "property", color: "#FF0000", price: 220, rent: [18, 90, 250, 700, 875, 1050], hc: 150, g: "red" }, { id: 22, name: "Sinyal", type: "chance" }, { id: 23, name: "Pavonis Mons", type: "property", color: "#FF0000", price: 220, rent: [18, 90, 250, 700, 875, 1050], hc: 150, g: "red" }, { id: 24, name: "Ascraeus Mons", type: "property", color: "#FF0000", price: 240, rent: [20, 100, 300, 750, 925, 1100], hc: 150, g: "red" }, { id: 25, name: "Roket Üssü Beta", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
                { id: 26, name: "Gale Krateri", type: "property", color: "#FFFF00", price: 260, rent: [22, 110, 330, 800, 975, 1150], hc: 150, g: "yellow" }, { id: 27, name: "Endeavour", type: "property", color: "#FFFF00", price: 260, rent: [22, 110, 330, 800, 975, 1150], hc: 150, g: "yellow" }, { id: 28, name: "Su Sondajı", type: "utility", price: 150 }, { id: 29, name: "Terra Cimmeria", type: "property", color: "#FFFF00", price: 280, rent: [24, 120, 360, 850, 1025, 1200], hc: 150, g: "yellow" }, { id: 30, name: "DÜNYA'YA ATILDI", type: "gotojail" },
                { id: 31, name: "Buzul Gölü", type: "property", color: "#228B22", price: 300, rent: [26, 130, 390, 900, 1100, 1275], hc: 200, g: "green" }, { id: 32, name: "Kristal Şehir", type: "property", color: "#228B22", price: 300, rent: [26, 130, 390, 900, 1100, 1275], hc: 200, g: "green" }, { id: 33, name: "İkmal", type: "chest" }, { id: 34, name: "Dome-1", type: "property", color: "#228B22", price: 320, rent: [28, 150, 450, 1000, 1200, 1400], hc: 200, g: "green" }, { id: 35, name: "Solaris İstasyonu", type: "railroad", price: 200, rent: [25, 50, 100, 200] },
                { id: 36, name: "Sinyal", type: "chance" }, { id: 37, name: "Kubbe Şehir", type: "property", color: "#0000CD", price: 350, rent: [35, 175, 500, 1100, 1300, 1500], hc: 200, g: "darkblue" }, { id: 38, name: "Meteor Vergisi", type: "tax", amount: 100 }, { id: 39, name: "Mars Başkenti", type: "property", color: "#0000CD", price: 400, rent: [50, 200, 600, 1400, 1700, 2000], hc: 200, g: "darkblue" }
            ]
        };

        function getMapSQ(key) {
            return MAPS[key];
        }

        function startGame() {
            try {
                const mapSelect = document.getElementById('mapSelect');
                if (!mapSelect) {
                    debugError("mapSelect element not found");
                    return;
                }
                const mapKey = mapSelect.value;
                window.activeSQ = getMapSQ(mapKey); // Globally accessible SQ for current game
                if (!window.activeSQ || !Array.isArray(window.activeSQ)) {
                    debugError("Invalid map data for key:", mapKey);
                    alert('Harita yüklenemedi. Lütfen sayfayı yenileyin.');
                    return;
                }

            const configs = [
                { id: 1, name: document.getElementById('p1').value, type: document.getElementById('t1').value, color: 'red', icon: selectedIcons[1], pers: document.getElementById('pers1').value },
                { id: 2, name: document.getElementById('p2').value, type: document.getElementById('t2').value, color: 'blue', icon: selectedIcons[2], pers: document.getElementById('pers2').value },
                { id: 3, name: document.getElementById('p3').value, type: document.getElementById('t3').value, color: 'green', icon: selectedIcons[3], pers: document.getElementById('pers3').value },
                { id: 4, name: document.getElementById('p4').value, type: document.getElementById('t4').value, color: 'yellow', icon: selectedIcons[4], pers: document.getElementById('pers4').value }
            ];

            const activePlayers = configs.filter(c => c.type !== 'none' && c.name.trim() !== '');

            if (activePlayers.length < 2) { alert('En az 2 oyuncu gerekli!'); return; }

            G.customRules = {
                startMoney: parseInt(document.getElementById('ruleStartMoney').value) || 1500,
                salary: parseInt(document.getElementById('ruleSalary').value) || 200,
                parkingPool: document.getElementById('toggleParkPool').classList.contains('on'),
                randomStart: document.getElementById('toggleRandomStart').classList.contains('on'),
                difficultyLevel: parseInt(document.getElementById('difficultyLevel').value) || 3
            };

            // const availableIcons = shuffle([...TOKEN_ICONS]); // No longer needed, using selectedIcons
            G.players = activePlayers.map((c, i) => {
                const types = ['Tycoon', 'Banker', 'Opportunist'];
                let personality = 'Human';
                let name = c.name.trim();
                const isAI = c.type.startsWith('ai');

                if (isAI) {
                    personality = c.pers === 'Random' ? types[Math.floor(Math.random() * types.length)] : c.pers;
                    // Auto-prefix with Robot if not present
                    if (!name.toLowerCase().includes('robot')) {
                        name = `Robot ${name}`;
                    }
                }
                return {
                    id: i,
                    name: name,
                    color: c.color,
                    icon: c.icon,
                    money: G.customRules.startMoney,
                    pos: 0,
                    props: [],
                    jail: false,
                    jt: 0,
                    out: false,
                    isAI: isAI,
                    difficulty: c.type.split('-')[1] || null,
                    personality: personality,
                    jailCards: 0,
                    stats: {
                        earned: G.customRules.startMoney,
                        rentPaid: 0,
                        rentReceived: 0,
                        jailTurns: 0,
                        doubles: 0,
                        taxPaid: 0,
                        lands: 0
                    }
                };
            });


            // Initialize customRules if missing property
            if (!G.customRules) G.customRules = { salary: 200, parkingPool: true };


            G.cur = 0;
            G.rolled = false;
            G.props = {};

            if (G.customRules.randomStart) {
                // Her oyuncuya 2-3 rastgele mülk dağıt (ilerlemeli mod için 3 daha dengeli)
                const pool = window.activeSQ.filter(s => ['property', 'railroad', 'utility'].includes(s.type)).map(s => s.id);
                shuffle(pool);
                G.players.forEach(p => {
                    for (let k = 0; k < 3; k++) {
                        const pid = pool.pop();
                        if (pid === undefined) break;
                        p.props.push(pid);
                        G.props[pid] = { owner: p.id, houses: 0, mort: false };
                    }
                });

                // Sadece tam sete sahip olanlara rastgele 1-2 ev ver (Monopol kurallarına uygun ilerleme)
                G.players.forEach(p => {
                    Object.entries(GR).forEach(([g, ids]) => {
                        if (g === 'railroad' || g === 'utility') return;
                        const ownsAll = ids.every(id => G.props[id] && G.props[id].owner === p.id);
                        if (ownsAll) {
                            const houseCount = Math.floor(Math.random() * 3); // 0, 1, 2 ev
                            ids.forEach(id => {
                                G.props[id].houses = houseCount;
                            });
                        }
                    });
                });
                log(`🎲 Rastgele mülkler dağıtıldı ve set tamamlayanlara evler verildi!`, true);
            }
                shuffle(CHANCE);
                shuffle(CHEST);

                // Show loading state
                const gameContainer = document.getElementById('gameContainer');
                if (gameContainer) {
                    gameContainer.style.opacity = '0.5';
                    gameContainer.style.pointerEvents = 'none';
                }

                buildBoard();
                updateOwners();
                updateUI();

                // Remove duplicate calls (optimization)
                // buildBoard();
                // updateOwners();
                // updateUI();

                const setupScreen = document.getElementById('setupScreen');
                if (setupScreen) setupScreen.classList.add('hidden');
                if (gameContainer) gameContainer.style.display = 'flex';

                // Fixed: Force token alignment at start line
                setTimeout(() => {
                    try {
                        updateTokens();
                        if (typeof sync3DEffectFromUI === 'function') sync3DEffectFromUI();
                        // Remove loading state
                        if (gameContainer) {
                            gameContainer.style.opacity = '1';
                            gameContainer.style.pointerEvents = 'auto';
                        }
                    } catch (e) {
                        debugError("Token update error:", e);
                        if (gameContainer) {
                            gameContainer.style.opacity = '1';
                            gameContainer.style.pointerEvents = 'auto';
                        }
                    }
                }, 150);

                log(`🎮 Oyun başladı!`, true);
                checkAI();

                // Sync settings from setup screen
                const setupLang = document.getElementById('setupLang');
                const setupSpeed = document.getElementById('setupSpeed');
                const setup3DToggle = document.getElementById('setup3DToggle');
                if (setupLang) currLang = setupLang.value;
                const speedRange = document.getElementById('speedRange');
                if (speedRange && setupSpeed) {
                    speedRange.value = setupSpeed.value;
                    updateSpeedDisp();
                }
                // 3D efekt varsayılan olarak kapalı
                if (setup3DToggle) {
                    const shouldEnable = setup3DToggle.classList.contains('on');
                    set3DEffect(shouldEnable);
                } else {
                    set3DEffect(false);
                }
                updateLangUI();
            } catch (e) {
                debugError("startGame error:", e);
                alert('Oyun başlatılırken bir hata oluştu. Lütfen sayfayı yenileyin.');
            }
        }
        window.startGame = startGame; // Expose to global scope

        function checkAI() {
            if (document.querySelector('.modal-overlay.active')) {
                setTimeout(checkAI, 1000);
                return;
            }
            const p = G.players[G.cur];
            if (!p || p.out) { endTurn(); return; }
            if (p.isAI) {
                if (G.rolled) {
                    // AI already rolled but turn didn't end? Possible catch-up
                    setTimeout(aiPostTurn, 1000);
                    return;
                }
                log(`🤖 ${p.name} düşünüyor...`);
                setTimeout(() => playAITurn(p), 1500);
            }
        }




        function aiHandleProp(s) {
            const p = G.players[G.cur];
            const pool = p.money;
            const price = s.price;
            let shouldBuy = false;

            // Get difficulty settings
            const difficulty = G.customRules.difficultyLevel || 3;
            const settings = getDifficultySettings(difficulty);
            
            // AI Karar Mantığı + Kişilik Etkisi + Zorluk Seviyesi
            let baseSafeMargin = 150;
            if (p.personality === 'Banker') baseSafeMargin = 500;
            if (p.personality === 'Tycoon') baseSafeMargin = 0;
            
            // Adjust safe margin based on difficulty (lower = more aggressive)
            const safeMargin = Math.floor(baseSafeMargin * (1 - settings.aiAggressiveness * 0.5));

            if (p.difficulty === 'easy') {
                shouldBuy = pool >= price && Math.random() > (0.5 + settings.aiAggressiveness * 0.2);
            } else if (p.difficulty === 'medium') {
                shouldBuy = pool >= price + safeMargin;
            } else if (p.difficulty === 'hard') {
                shouldBuy = pool >= price + (p.personality === 'Banker' ? Math.floor(300 * (1 - settings.aiAggressiveness * 0.3)) : -50);
            }

            if (shouldBuy) {
                aiSpeak(p, 'buy');
                buyProp();
            } else {
                startAuction();
            }
        }

        function aiSpeak(p, action) {
            if (!p || !p.isAI) return;
            const phrases = AI_PHRASES[p.personality][action];
            if (!phrases) return;
            const msg = phrases[Math.floor(Math.random() * phrases.length)];

            const tokenEl = document.querySelector(`.token-${p.color}`);
            if (tokenEl) {
                const bubble = tokenEl.querySelector('.speech-bubble') || document.createElement('div');
                bubble.className = 'speech-bubble';
                bubble.textContent = msg;
                if (!tokenEl.contains(bubble)) tokenEl.appendChild(bubble);

                setTimeout(() => bubble.classList.add('active'), 100);
                setTimeout(() => bubble.classList.remove('active'), 4000);
            }
        }

        function playAITurn(p) {
            // New logic: AI rolls with a delay for realism
            if (p.jail) {
                const staySafe = p.difficulty === 'hard' && G.players.some(op => op.id !== p.id && op.props.some(pid => G.props[pid] && G.props[pid].houses > 0));

                // AI prioritize card then fine if rich
                if (p.jailCards > 0) {
                    useJailCard();
                    return;
                }

                if (p.money > 1000 && p.difficulty !== 'easy') {
                    aiSpeak(p, 'jail');
                    payJail();
                    return;
                }

                if (p.difficulty === 'easy' || (p.difficulty === 'medium' && p.money < 1000) || staySafe) {
                    rollDice();
                } else {
                    if (p.money >= 50) {
                        aiSpeak(p, 'jail');
                        payJail();
                    } else { rollDice(); }
                }
                return;
            }
            rollDice();
        }

        function getDifficultySettings(level) {
            const levelNum = parseInt(level) || 3;
            const settings = {
                1: { aiAggressiveness: 0.2, rentMultiplier: 0.9, challengeChance: 0.05, extraChaos: false },
                2: { aiAggressiveness: 0.4, rentMultiplier: 0.95, challengeChance: 0.08, extraChaos: false },
                3: { aiAggressiveness: 0.6, rentMultiplier: 1.0, challengeChance: 0.12, extraChaos: false },
                4: { aiAggressiveness: 0.8, rentMultiplier: 1.2, challengeChance: 0.2, extraChaos: false },
                5: { aiAggressiveness: 1.0, rentMultiplier: 1.4, challengeChance: 0.3, extraChaos: true }
            };
            return settings[levelNum] || settings[3];
        }

        function updateDifficultyDisplay() {
            const difficultySelect = document.getElementById('difficultyLevel');
            if (!difficultySelect) return;
            
            const level = difficultySelect.value || '3';
            const lang = currLang || 'tr';
            
            const difficultyNames = {
                '1': { tr: 'En Kolay', en: 'Very Easy' },
                '2': { tr: 'Kolay', en: 'Easy' },
                '3': { tr: 'Normal', en: 'Normal' },
                '4': { tr: 'Zor', en: 'Hard' },
                '5': { tr: 'En Zor', en: 'Very Hard' }
            };
            
            const currentDifficultyNameEl = document.getElementById('currentDifficultyName');
            if (currentDifficultyNameEl) {
                currentDifficultyNameEl.textContent = difficultyNames[level]?.[lang] || difficultyNames['3'][lang];
            }
            
            // Update difficulty label
            const difficultyLabel = document.getElementById('difficultyLabel');
            if (difficultyLabel) {
                difficultyLabel.textContent = lang === 'en' ? 'DIFFICULTY' : 'OYUN ZORLUĞU';
            }
            
            // Update modal cards
            const modalCards = {
                '1': { tr: 'En Kolay', en: 'Very Easy' },
                '2': { tr: 'Kolay', en: 'Easy' },
                '3': { tr: 'Normal', en: 'Normal' },
                '4': { tr: 'Zor', en: 'Hard' },
                '5': { tr: 'En Zor', en: 'Very Hard' }
            };
            
            Object.keys(modalCards).forEach(lvl => {
                const card = document.getElementById(`difficulty-modal-${lvl}`);
                if (card) {
                    const span = card.querySelector('span');
                    if (span) {
                        span.textContent = modalCards[lvl][lang] || modalCards[lvl]['tr'];
                    }
                }
            });
            
            // Hide description
            const descriptionEl = document.getElementById('difficultyDescription');
            if (descriptionEl) {
                descriptionEl.style.display = 'none';
            }
        }

        function updateSpeedDisp() {
            const v = document.getElementById('speedRange').value;
            const lbl = document.getElementById('speedVal');
            if (v >= 350) lbl.textContent = "ŞİMŞEK ⚡";
            else if (v >= 250) lbl.textContent = "Hızlı";
            else if (v >= 150) lbl.textContent = "Normal";
            else lbl.textContent = "Yavaş";
        }

        function getSpeed() {
            const v = parseInt(document.getElementById('speedRange').value) || 250;
            return 450 - v; // Invert: larger value = smaller delay = faster
        }

        function aiPostTurn() {
            const p = G.players[G.cur];
            const speed = getSpeed();

            // AI Mülk Geliştirme
            Object.entries(GR).forEach(([g, ids]) => {
                if (g === 'railroad' || g === 'utility') return;
                const all = ids.every(x => G.props[x] && G.props[x].owner === p.id && !G.props[x].mort);
                if (all) {
                    ids.forEach(x => {
                        const s = window.activeSQ[x], pr = G.props[x];
                        const limit = 5;
                        let margin = 300;
                        if (p.personality === 'Tycoon') margin = 100;
                        if (p.personality === 'Banker') margin = 700;

                        if (pr.houses < limit && p.money >= s.hc + margin) {
                            buildHouse(x);
                        }
                    });
                }
            });


            // AI Takas Başlatma Kontrolü (Zorluk seviyesine göre)
            let tradePending = false;
            const difficulty = G.customRules.difficultyLevel || 3;
            const settings = getDifficultySettings(difficulty);
            const tradeChance = 0.1 + (settings.aiAggressiveness * 0.3); // 0.1 to 0.4
            if (Math.random() < tradeChance) {
                tradePending = aiInitiateTrade(p);
            }

            if (!tradePending) {
                setTimeout(endTurn, speed * 5);
            }
        }


        function openTradeOffer(sender, receiver, data) {
            const modal = document.getElementById('tradeOfferModal');
            document.getElementById('tradeOfferText').innerHTML = `<span style="color:${COLORS[sender.color]}">${sender.name}</span> <span>${t('trade_offer_msg')}</span>`;

            const giverDiv = document.getElementById('tradeOfferGiver');
            const takerDiv = document.getElementById('tradeOfferTaker');

            // Render money summaries
            const sMoney = `<div class="trade-offer-money">${data.myMoney > 0 ? '+' : ''}${data.myMoney}${t('currency')}</div>`;
            const rMoney = `<div class="trade-offer-money">${data.theirMoney > 0 ? '+' : ''}${data.theirMoney}${t('currency')}</div>`;

            // Render property lists with premium styles
            const sProps = data.myProps.map(id => {
                const s = window.activeSQ[id];
                return `<div class="trade-offer-prop" style="border-left-color:${s.color || '#999'}">
                    <span>${s.name}</span> <span style="opacity:0.5;">${s.price}${t('currency')}</span>
                </div>`;
            }).join('');

            const rProps = data.theirProps.map(id => {
                const s = window.activeSQ[id];
                return `<div class="trade-offer-prop" style="border-left-color:${s.color || '#999'}">
                    <span>${s.name}</span> <span style="opacity:0.5;">${s.price}${t('currency')}</span>
                </div>`;
            }).join('');

            giverDiv.innerHTML = (data.myMoney > 0 ? sMoney : '') + `<div class="trade-offer-props">${sProps || `<div style="opacity:0.3; text-align:center; padding:10px;">${t('trade_nothing')}</div>`}</div>`;
            takerDiv.innerHTML = (data.theirMoney > 0 ? rMoney : '') + `<div class="trade-offer-props">${rProps || `<div style="opacity:0.3; text-align:center; padding:10px;">${t('trade_nothing')}</div>`}</div>`;

            document.getElementById('acceptTradeBtn').onclick = () => {
                executeTrade(sender, receiver, data.myProps, data.theirProps, data.myMoney, data.theirMoney);
                closeModal('tradeOfferModal');
                showTradeResponse(receiver.name, true);
                if (sender.isAI && G.cur === sender.id) {
                    setTimeout(endTurn, 1000);
                }
            };
            document.getElementById('rejectTradeBtn').onclick = () => {
                log(`❌ ${receiver.name} ${t('offer_rejected')}`);
                closeModal('tradeOfferModal');
                showTradeResponse(receiver.name, false);
                if (sender.isAI && G.cur === sender.id) {
                    setTimeout(endTurn, 1000);
                }
            };

            modal.classList.add('active');
        }


        function aiInitiateTrade(p) {
            for (const [g, ids] of Object.entries(GR)) {
                if (g === 'railroad' || g === 'utility') continue;
                const myCount = ids.filter(id => G.props[id] && G.props[id].owner === p.id).length;
                if (myCount > 0 && myCount < ids.length) {
                    const missing = ids.find(id => G.props[id] && G.props[id].owner !== null && G.props[id].owner !== p.id);
                    if (missing) {
                        const targetOwner = G.players[G.props[missing].owner];
                        if (targetOwner.out) continue;

                        const s = window.activeSQ[missing];
                        const offer = Math.floor(s.price * 1.5);
                        if (p.money > offer + 300) {
                            if (targetOwner.isAI) {
                                if (aiEvaluateTrade(p, targetOwner, { myProps: [], theirProps: [missing], myMoney: offer, theirMoney: 0 })) {
                                    executeTrade(p, targetOwner, [], [missing], offer, 0);
                                }
                            } else {
                                openTradeOffer(p, targetOwner, { myProps: [], theirProps: [missing], myMoney: offer, theirMoney: 0 });
                            }
                            return true; // Modal opened
                        }
                    }
                }
            }
            return false;
        }


        function aiEvaluateTrade(sender, receiver, data) {
            const sValue = data.myMoney + data.myProps.reduce((sum, id) => sum + (window.activeSQ[id].price || 0), 0);
            const rValue = data.theirMoney + data.theirProps.reduce((sum, id) => sum + (window.activeSQ[id].price || 0), 0);

            let threshold = 1.0;
            if (receiver.difficulty === 'easy') threshold = 0.7;
            if (receiver.difficulty === 'hard') threshold = 1.4;

            // AI'nın işine yarayacak bir mülk mü?
            let valuableToAI = data.myProps.some(id => {
                const s = window.activeSQ[id];
                const group = s.g || s.type; // Railroad/Utility için type'ı kullan
                if (!GR[group]) return false;
                return GR[group].some(gid => G.props[gid] && G.props[gid].owner === receiver.id);
            });

            if (valuableToAI) threshold -= 0.3;

            const isFair = sValue >= rValue * threshold;

            if (receiver.difficulty === 'hard' && !valuableToAI && data.theirProps.some(id => {
                const s = window.activeSQ[id];
                const group = s.g || s.type;
                if (!group || !GR[group]) return false;
                return GR[group].every(gid => G.props[gid] && G.props[gid].owner === receiver.id);
            })) {
                log(`❌ ${receiver.name}: "${t('set_break')}"`);
                showTradeResponse(receiver.name, false);
                return false;
            }

            if (isFair) {
                log(`✅ ${receiver.name} ${t('offer_accepted')}`);
                showTradeResponse(receiver.name, true);
                return true;
            } else {
                let msg = t('not_fair');
                if (data.myMoney > 0 && sValue >= rValue * threshold * 0.8 && !valuableToAI) {
                    const suggested = Math.floor(rValue * threshold * 1.1);
                    msg = `${t('counter')} ${suggested}${t('currency')}`;
                }
                log(`❌ ${receiver.name}: "${msg}"`);
                toast(`${receiver.name}: ${msg}`, 'error'); // Removed X icon from string as it's in the function
                showTradeResponse(receiver.name, false);
                return false;
            }
        }

        function executeTrade(p, partner, myProps, theirProps, myM, thM) {
            if (myM) chgMoney(p, -myM);
            if (thM) chgMoney(p, thM);
            if (myM) chgMoney(partner, myM);
            if (thM) chgMoney(partner, -thM);

            // Animate properties
            myProps.forEach(id => animatePropertyTransfer(id, partner.id));
            theirProps.forEach(id => animatePropertyTransfer(id, p.id));

            // Instant ownership flip and UI update
            myProps.forEach(id => {
                p.props = p.props.filter(x => x !== id);
                partner.props.push(id);
                G.props[id].owner = partner.id;
            });
            theirProps.forEach(id => {
                partner.props = partner.props.filter(x => x !== id);
                p.props.push(id);
                G.props[id].owner = p.id;
            });

            log(`🔄 ${t('trade_success')}`, true);
            toast(t('trade_success'), 'success');
            updateUI();
            updateOwners();
            autoSave();
        }


        function buildBoard() {
            const b = document.getElementById('board');
            b.innerHTML = '';

            // Re-insert center content
            const c = document.createElement('div');
            c.className = 'board-center';
            c.innerHTML = `
                <div class="center-logo">MONOPOLX</div>
                <div class="dice-container" id="diceContainer">
                    <div class="dice" id="d1" onclick="rollDice()"></div>
                    <div class="dice" id="d2" onclick="rollDice()"></div>
                </div>
            `;
            b.appendChild(c);

            const tl = document.createElement('div');
            tl.className = 'tokens-layer';
            tl.id = 'tokensLayer';
            b.appendChild(tl);

            window.activeSQ.forEach((s, i) => {
                const d = document.createElement('div');
                d.className = 'square'; d.id = 'sq-' + i;
                d.onclick = () => showProp(i);
                const p = getPos(i);
                d.style.gridColumn = p.c; d.style.gridRow = p.r;

                let h = '';
                if (s.type === 'property' || s.type === 'railroad' || s.type === 'utility') {
                    h = `<div class="color-bar" style="background:${s.color || '#333'}"><div class="square-name">${s.name}</div></div><div class="buildings" id="bld-${i}"></div><div class="square-content"><div class="square-price">${s.price}₺</div></div><div class="owner-bar" id="own-${i}"><div class="owner-info" id="own-info-${i}"></div></div>`;
                } else if (s.type === 'chance' || s.type === 'chest' || s.type === 'tax') {
                    const icon = s.type === 'chance' ? '❓' : (s.type === 'chest' ? '📦' : '💰');
                    h = `<div class="square-content ${s.type}"><div class="corner-icon">${icon}</div><div class="square-name">${s.name}</div>${s.amount ? `<div class="square-price">${s.amount}₺</div>` : ''}</div>`;
                } else {
                    const icons = { go: '➡️', jail: '🔒', parking: '🅿️', gotojail: '👮' };
                    h = `<div class="corner-icon">${icons[s.type] || ''}</div><div class="square-name">${s.name}</div>`;
                }

                d.innerHTML = h;

                // Add corner classes if applicable
                if (i === 0) d.classList.add('corner', 'corner-go');
                else if (i === 10) d.classList.add('corner', 'corner-jail');
                else if (i === 20) d.classList.add('corner', 'corner-parking');
                else if (i === 30) d.classList.add('corner', 'corner-gotojail');

                b.appendChild(d);
                if (G.props[i]) updateBld(i); // Başlangıç binalarını çiz
            });
            updateTokens();
        }
        function getPos(i) { if (i <= 10) return { r: 11, c: 11 - i }; if (i <= 19) return { r: 10 - (i - 11), c: 1 }; if (i <= 30) return { r: 1, c: i - 19 }; return { r: i - 29, c: 11 } }
        function sqHTML(s) {
            const ic = { go: '➡️', jail: '🔒', parking: '🅿️', gotojail: '👮', chance: '❓', chest: '📦', tax: '💰', railroad: '🚂' };
            if (['go', 'jail', 'parking', 'gotojail'].includes(s.type)) return `<div class="square-content"><div class="corner-icon">${ic[s.type]}</div><div class="square-name">${s.name}</div></div>`;
            if (s.type === 'property') return `<div class="color-bar" style="background:${s.color}"><div class="square-name">${s.name}</div></div><div class="buildings" id="bld-${s.id}"></div><div class="square-content"><div class="square-price">${s.price}₺</div></div><div class="owner-bar" id="own-${s.id}"><div class="owner-info" id="own-info-${s.id}"></div></div>`;
            if (s.type === 'utility') return `<div class="square-content"><div class="corner-icon">${s.name.includes('Elektrik') ? '💡' : '💧'}</div><div class="square-name">${s.name}</div><div class="square-price">${s.price}₺</div></div><div class="owner-info" id="own-info-${s.id}"></div><div class="owner-bar" id="own-${s.id}"></div>`;
            if (s.type === 'railroad') return `<div class="square-content"><div class="corner-icon">🚂</div><div class="square-name">${s.name}</div><div class="square-price">${s.price}₺</div></div><div class="owner-info" id="own-info-${s.id}"></div><div class="owner-bar" id="own-${s.id}"></div>`;
            if (s.type === 'tax') return `<div class="square-content"><div class="corner-icon">💰</div><div class="square-name">${s.name}</div><div class="square-price">${s.amount}₺</div></div>`;
            return `<div class="square-content"><div class="corner-icon">${ic[s.type] || '📋'}</div><div class="square-name">${s.name}</div></div>`
        }
        function dFace(v) { const p = { 1: [0, 0, 0, 0, 1, 0, 0, 0, 0], 2: [1, 0, 0, 0, 0, 0, 0, 0, 1], 3: [1, 0, 0, 0, 1, 0, 0, 0, 1], 4: [1, 0, 1, 0, 0, 0, 1, 0, 1], 5: [1, 0, 1, 0, 1, 0, 1, 0, 1], 6: [1, 0, 1, 1, 0, 1, 1, 0, 1] }; return p[v].map(x => `<div class="dot ${x ? 'active' : ''}"></div>`).join('') }
        function moneyAnim(pid, amt, pos) { const el = document.querySelector(`.player-card:nth-child(${pid + 1})`); if (!el) return; const r = el.getBoundingClientRect(); const f = document.createElement('div'); f.className = `money-float ${pos ? 'pos' : 'neg'}`; f.textContent = `${pos ? '+' : '-'}${Math.abs(amt)}₺`; f.style.left = r.left + r.width / 2 + 'px'; f.style.top = r.top + 'px'; document.body.appendChild(f); setTimeout(() => f.remove(), 800); const m = el.querySelector('.player-money'); if (m) { m.classList.remove('up', 'down'); void m.offsetWidth; m.classList.add(pos ? 'up' : 'down') } }
        function chgMoney(p, amt) {
            p.money += amt;
            moneyAnim(p.id, amt, amt > 0);
            if (amt !== 0) SND.play('coin');
        }

        function rollDice() {
            if (G.rolled) {
                debugLog("Dice already rolled for this turn.");
                return;
            }
            if (document.querySelector('.modal-overlay.active')) return;

            const p = G.players[G.cur]; if (p.out) return;
            document.getElementById('rollBtn').disabled = true;
            document.getElementById('jailControls').style.display = 'none';
            const d1 = document.getElementById('d1'), d2 = document.getElementById('d2');
            SND.play('dice');
            d1.classList.add('rolling'); d2.classList.add('rolling');

            setTimeout(() => {
                let v1 = Math.floor(Math.random() * 6) + 1, v2 = Math.floor(Math.random() * 6) + 1;
                // Cheat for fast dice if rule on
                // if (G.customRules.fastDice && Math.random() < 0.3) { v1 = v2; } // fastDice rule removed
                d1.innerHTML = dFace(v1); d2.innerHTML = dFace(v2);
                d1.classList.remove('rolling'); d2.classList.remove('rolling');
                const dbl = v1 === v2, tot = v1 + v2;
                log(t('dice_rolled').replace('%s', p.name).replace('%s', v1).replace('%s', v2).replace('%s', tot).replace('%s', dbl ? t('double') : ''));
                if (p.jail) {
                    p.stats.jailTurns++;
                    if (dbl) { p.jail = false; p.jt = 0; log(t('jail_double').replace('%s', p.name), true); G.rolled = true; animMove(tot) }
                    else {
                        p.jt++;
                        if (p.jt >= 3) {
                            if (p.money >= 50) {
                                chgMoney(p, -50, 'tax');
                                p.jail = false;
                                p.jt = 0;
                                log(t('jail_wait_pay').replace('%s', p.name));
                                G.rolled = true;
                                document.getElementById('endBtn').disabled = false;
                                if (p.isAI) aiPostTurn();
                            } else {
                                bankrupt();
                            }
                        } else {
                            log(t('jail_stay').replace('%s', p.jt));
                            G.rolled = true;
                            document.getElementById('endBtn').disabled = false;
                            if (p.isAI) aiPostTurn();
                        }
                    }
                } else {
                    if (dbl) {
                        p.stats.doubles++;
                        G.doubles++;
                        if (G.doubles >= 3) {
                            log(t('jail_3_doubles').replace('%s', p.name), true);
                            goJail();
                            G.rolled = true;
                            G.doubles = 0;
                            document.getElementById('endBtn').disabled = false;
                            if (p.isAI) aiPostTurn();
                            return;
                        }
                        log(t('double_roll_again').replace('%s', p.name), true);
                        G.rolled = false;
                        document.getElementById('endBtn').disabled = true;
                        if (window.innerWidth <= 900) {
                            const mobEnd = document.getElementById('mobEndBtn');
                            if (mobEnd) mobEnd.disabled = true;
                        }
                    } else {
                        G.doubles = 0;
                        G.rolled = true;
                    }
                    animMove(tot);
                }
                updateUI();
            }, 500);
        }


        function payJail() {
            const p = G.players[G.cur];
            if (p.money >= 50) {
                chgMoney(p, -50);
                p.jail = false;
                p.jt = 0;
                log(`💸 ${p.name} 50₺ kefaletle çıktı`);
                document.getElementById('jailControls').style.display = 'none';
                rollDice();
            } else {
                alert("Yeterli paranız yok!");
            }
        }

        function useJailCard() {
            const p = G.players[G.cur];
            if (p.jailCards > 0) {
                p.jailCards--;
                p.jail = false;
                p.jt = 0;
                log(`🎫 ${p.name} kurtuluş kartını kullandı`);
                document.getElementById('jailControls').style.display = 'none';
                rollDice();
            }
        }
        function animMove(steps) {
            const p = G.players[G.cur];
            const totalSteps = Math.abs(steps);
            const direction = steps > 0 ? 1 : -1;
            const speed = getSpeed();

            let currentStep = 0;
            function nextStep() {
                if (currentStep >= totalSteps) {
                    setTimeout(() => handleLand(p.pos), 400);
                    return;
                }

                currentStep++;
                const oldPos = p.pos;
                p.pos = (p.pos + direction + 40) % 40;

                if (direction > 0 && p.pos === 0) {
                    const sal = G.customRules.salary;
                    chgMoney(p, sal);
                    log(t('salary_msg').replace('%s', p.name).replace('%s', sal), true);
                }

                // Smooth Glide Logic
                updateTokens();

                const token = document.querySelector(`.token-${p.color}`);
                if (token) {
                    token.style.transition = `all ${speed * 1.5}ms cubic-bezier(0.19, 1, 0.22, 1)`;
                    token.classList.add('moving');
                    setTimeout(() => token.classList.remove('moving'), speed);
                }

                setTimeout(nextStep, speed * 2);
            }
            nextStep();
        }

        function playRentAnim(fromId, toId, amount) {
            const fromCard = document.querySelector(`.player-card:nth-child(${fromId + 1})`);
            const toCard = document.querySelector(`.player-card:nth-child(${toId + 1})`);
            if (!fromCard || !toCard) return;

            const fromRect = fromCard.getBoundingClientRect();
            const toRect = toCard.getBoundingClientRect();

            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const m = document.createElement('div');
                    m.className = 'rent-money';
                    m.textContent = '💵';
                    m.style.left = (fromRect.left + fromRect.width / 2) + 'px';
                    m.style.top = (fromRect.top + fromRect.height / 2) + 'px';
                    m.style.setProperty('--target-x', (toRect.left + toRect.width / 2) + 'px');
                    m.style.setProperty('--target-y', (toRect.top + toRect.height / 2) + 'px');
                    document.body.appendChild(m);
                    setTimeout(() => m.remove(), 1000);
                }, i * 150);
            }
        }

        function handleLand(pos) {
            try {
                if (!window.activeSQ || !window.activeSQ[pos]) {
                    debugError("Invalid position:", pos);
                    return;
                }
                const s = window.activeSQ[pos];
                const p = G.players[G.cur];
                if (!p) {
                    debugError("No current player");
                    return;
                }
                
                document.querySelectorAll('.square').forEach(x => x.classList.remove('current'));
                const sqEl = document.getElementById('sq-' + pos);
                if (sqEl) sqEl.classList.add('current');
                
                if (['property', 'railroad', 'utility'].includes(s.type)) handleProp(s);
                else if (s.type === 'chance') drawCard(LANGS[currLang].chance_cards, `❓ ${t('chance_title')}`, '❓');
                else if (s.type === 'chest') drawCard(LANGS[currLang].chest_cards, `📦 ${t('chest_title')}`, '📦');
                else if (s.type === 'tax') {
                    if (p.money >= s.amount) {
                        chgMoney(p, -s.amount);
                        if (G.customRules.parkingPool) G.park += s.amount;
                        log(t('tax_msg').replace('%s', p.name).replace('%s', s.amount));
                    } else bankrupt();
                    const endBtn = document.getElementById('endBtn');
                    if (endBtn) endBtn.disabled = false;
                    if (p.isAI) aiPostTurn();
                } else if (s.type === 'gotojail') {
                    goJail();
                    const endBtn = document.getElementById('endBtn');
                    if (endBtn) endBtn.disabled = false;
                    if (p.isAI) aiPostTurn();
                } else if (s.type === 'parking' && G.park > 0) {
                    chgMoney(p, G.park);
                    log(t('park_msg').replace('%s', p.name).replace('%s', G.park), true);
                    G.park = 0;
                    const endBtn = document.getElementById('endBtn');
                    if (endBtn) endBtn.disabled = false;
                    if (p.isAI) aiPostTurn();
                } else {
                    const endBtn = document.getElementById('endBtn');
                    if (endBtn) endBtn.disabled = false;
                    if (p.isAI) aiPostTurn();
                }
                if (p.stats) p.stats.lands++;
                updateUI();
            } catch (e) {
                debugError("handleLand error:", e);
                const endBtn = document.getElementById('endBtn');
                if (endBtn) endBtn.disabled = false;
            }
        }

        function handleProp(s) {
            const p = G.players[G.cur], pr = G.props[s.id];
            if (!pr) {
                G.pending = s.id;
                if (p.money >= s.price) {
                    document.getElementById('buyBtn').disabled = false; document.getElementById('auctionBtn').disabled = false; document.getElementById('auctionBtn').style.display = 'inline-block'; log(t('land_buy_warn').replace('%s', s.name).replace('%s', s.price)); if (p.isAI) setTimeout(() => aiHandleProp(s), 1000);
                } else {
                    document.getElementById('auctionBtn').disabled = false; document.getElementById('auctionBtn').style.display = 'inline-block'; log(t('land_no_money')); if (p.isAI) setTimeout(startAuction, 1000);
                }
                document.getElementById('endBtn').disabled = false
            } else if (pr.owner !== p.id) {
                const ow = G.players[pr.owner];
                if (!ow.out && !pr.mort) {
                    const r = calcRent(s, pr);
                    if (p.money >= r) {
                        if (ow.isAI) aiSpeak(ow, 'rent');
                        chgMoney(p, -r, 'rent'); chgMoney(ow, r, 'rent');
                        playRentAnim(p.id, ow.id, r);
                        log(t('rent_log').replace('%s', p.name).replace('%s', ow.name).replace('%s', r));
                        toast(t('rent_toast').replace('%s', ow.name).replace('%s', r), 'error');
                        // Reset temporary double rent after payment
                        if (G.tempDoubleRent) {
                            G.tempDoubleRent = false;
                        }
                    } else bankrupt(p.id, ow.id);
                }
                document.getElementById('endBtn').disabled = false; if (p.isAI) aiPostTurn();

            } else {
                log(t('land_own').replace('%s', p.name).replace('%s', s.name));
                toast(t('land_own').replace('%s', p.name).replace('%s', s.name), 'info');
                document.getElementById('endBtn').disabled = false; updateBuildBtn(); if (p.isAI) aiPostTurn();
            }
        }
        function calcRent(s, pr) { 
            const ow = G.players[pr.owner]; 
            let baseRent = 0;
            
            if (s.type === 'railroad') {
                baseRent = s.rent[ow.props.filter(x => window.activeSQ[x].type === 'railroad').length - 1];
            } else if (s.type === 'utility') { 
                const c = ow.props.filter(x => window.activeSQ[x].type === 'utility').length; 
                const d = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1; 
                baseRent = c === 2 ? d * 10 : d * 4;
            } else {
                if (pr.houses === 5) baseRent = s.rent[5];
                else if (pr.houses > 0) baseRent = s.rent[pr.houses];
                else {
                    const g = GR[s.g]; 
                    const all = g.every(x => G.props[x] && G.props[x].owner === pr.owner); 
                    baseRent = all ? s.rent[0] * 2 : s.rent[0];
                }
            }
            
            // Apply difficulty multiplier
            const difficulty = G.customRules.difficultyLevel || 3;
            const settings = getDifficultySettings(difficulty);
            let finalRent = Math.floor(baseRent * settings.rentMultiplier);
            
            // Apply temporary double rent if active
            if (G.tempDoubleRent) {
                finalRent = Math.floor(finalRent * 2);
            }
            
            return finalRent;
        }
        function buyProp() {
            const p = G.players[G.cur], s = window.activeSQ[G.pending];
            const propId = s.id;
            chgMoney(p, -s.price); p.props.push(propId);
            G.props[propId] = { owner: p.id, houses: 0, mort: false };

            animatePropertyTransfer(propId, p.id);
            log(`✅ ${p.name} ${s.name} aldı!`, true);
            toast(`🏡 ${s.name} ${t('buy_success')}`, 'success');
            SND.play('buy');
            spawnConfetti();

            document.getElementById('buyBtn').disabled = true;
            document.getElementById('auctionBtn').disabled = true;
            document.getElementById('auctionBtn').style.display = 'none';
            G.pending = null;
            updateOwners();
            updateBuildBtn();
            updateUI();
            if (p.isAI) aiPostTurn();
        }
        function startAuction() { const s = window.activeSQ[G.pending]; AUC = { on: true, prop: G.pending, bid: 0, bidder: null, parts: G.players.filter(x => !x.out).map(x => ({ ...x, pass: false })), idx: 0 }; document.getElementById('buyBtn').disabled = true; document.getElementById('auctionBtn').disabled = true; document.getElementById('auctionBtn').style.display = 'none'; updateAuc(); document.getElementById('auctionModal').classList.add('active'); log(t('auction_log').replace('%s', s.name), true) }
        function updateAuc() {
            const s = window.activeSQ[AUC.prop];
            document.getElementById('auctionProp').innerHTML = `
                <div style="display:inline-block;width:25px;height:40px;background:${s.color || '#999'};border-radius:5px;vertical-align:middle;margin-right:8px"></div>
                <div style="display:inline-block;vertical-align:middle">
                    <span style="font-weight:700;display:block">${s.name}</span>
                    <span style="font-size:0.7rem;opacity:0.6;font-weight:600">BANKA DEĞERİ: ${s.price}₺</span>
                </div>
            `;
            document.getElementById('auctionBid').textContent = AUC.bid > 0 ? AUC.bid + '₺' : 'Teklif yok';
            document.getElementById('auctionInfo').textContent = AUC.bidder !== null ? `En yüksek: ${G.players[AUC.bidder].name}` : '';
            const act = AUC.parts.filter(x => !x.pass);
            if (act.length <= 1 && AUC.bid > 0) { endAuc(); return }
            while (AUC.parts[AUC.idx].pass) AUC.idx = (AUC.idx + 1) % AUC.parts.length;
            const cur = AUC.parts[AUC.idx];
            document.getElementById('auctionPlayers').innerHTML = AUC.parts.map((x, i) => `<div class="auction-player ${x.pass ? 'out' : ''} ${i === AUC.idx ? 'current' : ''}" style="border-color:${COLORS[x.color]}">${x.name}${x.pass ? ' ❌' : ''}<div style="font-size:0.75rem;opacity:0.7">${x.money}₺</div></div>`).join('');

            // AI Bidding Logic Hook
            if (cur.isAI && !cur.pass) {
                // Hide buttons for everyone while AI thinks
                document.getElementById('bidBtns').innerHTML = `<div style="color:var(--gold)">🤖 ${cur.name} düşünüyor...</div>`;
                setTimeout(() => aiBid(cur), 1000);
            } else {
                let btns = `<div style="margin-bottom:8px;color:var(--gold);font-weight:600">${cur.name} teklif veriyor</div>`;[10, 50, 100].forEach(a => { if (AUC.bid + a <= cur.money) btns += `<button class="bid-btn" onclick="placeBid(${a})">+${a}₺</button>` }); btns += `<button class="bid-btn pass" onclick="passBid()">❌ Çekil</button>`; document.getElementById('bidBtns').innerHTML = btns
            }
        }

        function aiBid(p) {
            const s = window.activeSQ[AUC.prop];
            const limit = p.difficulty === 'easy' ? s.price * 0.8 : (p.difficulty === 'medium' ? s.price * 1.1 : s.price * 1.5);

            // Hard AI prioritizes +50 bid if affordable and within limit
            if (p.difficulty === 'hard' && AUC.bid + 50 <= p.money && AUC.bid + 50 <= limit) {
                placeBid(50);
            } else if (AUC.bid + 10 <= p.money && AUC.bid + 10 <= limit) {
                // Regular bid fallback
                placeBid(10);
            } else {
                // If can't afford or exceed limit, pass
                passBid();
            }
        }
        function placeBid(a) {
            const b = AUC.parts[AUC.idx];
            if (AUC.bid + a > b.money) return;
            AUC.bid += a;
            AUC.bidder = b.id;
            log(`💰 ${b.name}: ${AUC.bid}₺`);
            nextBidder()
        }
        function passBid() { const b = AUC.parts[AUC.idx]; b.pass = true; log(`❌ ${b.name} çekildi`); nextBidder() }
        function nextBidder() { const act = AUC.parts.filter(x => !x.pass); if (act.length <= 1) { endAuc(); return } do { AUC.idx = (AUC.idx + 1) % AUC.parts.length } while (AUC.parts[AUC.idx].pass); updateAuc() }
        function endAuc() {
            const s = window.activeSQ[AUC.prop]; if (AUC.bidder !== null && AUC.bid > 0) { const w = G.players[AUC.bidder]; chgMoney(w, -AUC.bid); w.props.push(s.id); G.props[s.id] = { owner: w.id, houses: 0, mort: false }; log(`🎉 ${w.name} ${s.name}'i ${AUC.bid}₺'ye aldı!`, true) } else log(`⚠️ ${s.name} satılmadı`); document.getElementById('auctionModal').classList.remove('active'); AUC.on = false; G.pending = null; updateUI(); updateOwners();
            if (G.players[G.cur].isAI) {
                aiPostTurn();
            }
        }
        function drawCard(deck, title, icon) {
            let c = deck.shift();
            deck.push(c);

            // Difficulty Level Challenge Logic
            const difficulty = G.customRules.difficultyLevel || 3;
            const settings = getDifficultySettings(difficulty);
            if (Math.random() < settings.challengeChance) {
                const challenges = [
                    { t: "KAOS! Bir rakibinle piyon yerlerinizi takas edin!", a: "swap" },
                    { t: "İFLASIN EŞİĞİ! Nakit paranın yarısını kaybet!", a: "halve" },
                    { t: "MİLYARDER OL! Nakit paran ikiye katlansın!", a: "double" },
                    { t: "EMLAK KRİZİ! Rastgele bir mülkünü bankaya geri ver!", a: "lose_prop" },
                    { t: "PİYANGO! Diğer tüm oyunculardan 100₺ al!", a: "lottery" }
                ];
                
                // En zor seviye için ekstra kaos kartları
                if (settings.extraChaos && Math.random() < 0.3) {
                    const extraChaos = [
                        { t: "💥 MEGA KAOS! Tüm oyuncular yer değiştirsin!", a: "mega_swap" },
                        { t: "⚡ ŞİMŞEK! Rastgele bir rakibin tüm parasını al!", a: "steal_all" },
                        { t: "🌪️ FIRTINA! Tüm mülklerin kirası 2 katına çıksın!", a: "double_rent" },
                        { t: "💀 KARANLIK! Tüm oyuncular hapse gitsin!", a: "jail_all" },
                        { t: "🔥 YANGIN! Rastgele 3 mülkünü kaybet!", a: "lose_three" }
                    ];
                    challenges.push(...extraChaos);
                }
                
                c = challenges[Math.floor(Math.random() * challenges.length)];
                title = "🔥 CHALLENGE";
                icon = "🔥";
            }

            const cardHeader = document.getElementById('cardTitle');
            cardHeader.textContent = title;
            if (title.includes(t('chance_title'))) cardHeader.style.background = '#ff9800';
            else if (title.includes(t('chest_title'))) cardHeader.style.background = '#2196f3';
            else if (title.includes('CHALLENGE')) cardHeader.style.background = '#ff3d00';

            document.getElementById('cardIcon').textContent = icon;
            document.getElementById('cardText').textContent = c.t;
            toast(`${icon} ${c.t}`, 'info');
            document.getElementById('cardModal').classList.add('active');
            const p = G.players[G.cur];

            if (c.a === 'get') {
                chgMoney(p, c.m);
                log(`💰 +${c.m}₺`);
            } else if (c.a === 'pay') {
                if (p.money >= c.m) {
                    chgMoney(p, -c.m);
                    G.park += c.m;
                    log(`💸 -${c.m}₺`);
                } else bankrupt();
            } else if (c.a === 'jailfree') {
                p.jailCards++;
                log(`🎫 Hapisten Çıkış Kartı alındı!`);
            } else if (c.a === 'goto') {
                setTimeout(() => {
                    closeModal('cardModal');
                    if (c.to < p.pos && c.c) chgMoney(p, c.c);
                    p.pos = c.to;
                    updateUI();
                    setTimeout(() => handleLand(c.to), 200);
                }, 1200);
                return;
            } else if (c.a === 'move') {
                setTimeout(() => {
                    closeModal('cardModal');
                    animMove(c.s);
                }, 1200);
                return;
            } else if (c.a === 'jail') {
                setTimeout(() => {
                    closeModal('cardModal');
                    goJail();
                    document.getElementById('endBtn').disabled = false;
                    if (p.isAI) aiPostTurn();
                }, 1200);
                return;
            } else if (c.a === 'repair') {
                let cost = 0;
                p.props.forEach(id => {
                    const pr = G.props[id];
                    if (pr && pr.houses > 0) cost += pr.houses === 5 ? c.o : pr.houses * c.h;
                });
                if (cost > 0) {
                    if (p.money >= cost) {
                        chgMoney(p, -cost);
                        G.park += cost;
                        log(`🔧 -${cost}₺ tamir`);
                    } else bankrupt();
                }
            } else if (c.a === 'swap') {
                const targets = G.players.filter(op => op.id !== p.id && !op.out);
                if (targets.length) {
                    const target = targets[Math.floor(Math.random() * targets.length)];
                    const oldPos = p.pos;
                    p.pos = target.pos;
                    target.pos = oldPos;
                    log(`🌀 ${p.name} ve ${target.name} yer değiştirdi!`, true);
                    updateUI();
                }
            } else if (c.a === 'halve') {
                chgMoney(p, -Math.floor(p.money / 2));
            } else if (c.a === 'double') {
                chgMoney(p, p.money);
            } else if (c.a === 'lose_prop') {
                if (p.props.length > 0) {
                    const rid = p.props[Math.floor(Math.random() * p.props.length)];
                    delete G.props[rid];
                    p.props = p.props.filter(pid => pid !== rid);
                    log(`🏚️ ${p.name}, ${window.activeSQ[rid].name} mülkünü kaybetti!`, true);
                    updateOwners();
                }
            } else if (c.a === 'lottery') {
                G.players.forEach(op => {
                    if (op.id !== p.id && !op.out) {
                        const amt = Math.min(op.money, 100);
                        chgMoney(op, -amt);
                        chgMoney(p, amt);
                    }
                });
            } else if (c.a === 'mega_swap') {
                // Tüm oyuncular rastgele yer değiştir
                const positions = G.players.map(pl => pl.pos);
                shuffle(positions);
                G.players.forEach((pl, idx) => {
                    pl.pos = positions[idx];
                });
                log(`🌀 MEGA KAOS! Tüm oyuncular yer değiştirdi!`, true);
                updateUI();
            } else if (c.a === 'steal_all') {
                const targets = G.players.filter(op => op.id !== p.id && !op.out);
                if (targets.length) {
                    const target = targets[Math.floor(Math.random() * targets.length)];
                    const stolen = target.money;
                    chgMoney(target, -stolen);
                    chgMoney(p, stolen);
                    log(`⚡ ${p.name}, ${target.name}'in tüm parasını çaldı! (${stolen}₺)`, true);
                }
            } else if (c.a === 'double_rent') {
                // Bu tur için tüm kiralar 2 katına çıkar (geçici)
                G.tempDoubleRent = true;
                log(`🌪️ FIRTINA! Bu tur tüm kiralar 2 katına çıktı!`, true);
            } else if (c.a === 'jail_all') {
                G.players.forEach(pl => {
                    if (pl.id !== p.id && !pl.out) {
                        pl.pos = 10;
                        pl.jail = true;
                        pl.jt = 0;
                    }
                });
                log(`💀 KARANLIK! Tüm rakipler hapse gitti!`, true);
                updateUI();
            } else if (c.a === 'lose_three') {
                if (p.props.length > 0) {
                    const toLose = Math.min(3, p.props.length);
                    const lostProps = [];
                    for (let i = 0; i < toLose && p.props.length > 0; i++) {
                        const rid = p.props[Math.floor(Math.random() * p.props.length)];
                        lostProps.push(window.activeSQ[rid].name);
                        delete G.props[rid];
                        p.props = p.props.filter(pid => pid !== rid);
                    }
                    log(`🔥 YANGIN! ${p.name}, ${toLose} mülkünü kaybetti! (${lostProps.join(', ')})`, true);
                    updateOwners();
                }
            }
            document.getElementById('endBtn').disabled = false;
            updateUI();
            if (p.isAI) {
                setTimeout(() => closeModal('cardModal'), 1500);
                setTimeout(aiPostTurn, 1600);
            }
        }
        function goJail() {
            const p = G.players[G.cur];
            p.pos = 10; p.jail = true; p.jt = 0; G.doubles = 0;
            log(`🔒 ${p.name} HAPİSTE!`, true);
            toast(`🔒 HAPSE GİRDİNİZ!`, 'error');
            SND.play('jail'); updateUI()
        }

        function resolvePropId(s, i) {
            return (s && s.id !== undefined) ? s.id : i;
        }
        function updateOwners() {
            if (!window.activeSQ) return;
            window.activeSQ.forEach((s, i) => {
                const propId = resolvePropId(s, i);
                const pr = G.props[propId];
                const owner = pr ? G.players[pr.owner] : null;
                const isOwned = !!owner;
                const isMort = pr && pr.mort;
                const el = document.getElementById('own-' + i);
                const info = document.getElementById('own-info-' + i);
                const sq = document.getElementById('sq-' + i);
                if (el) {
                    if (isOwned) {
                        el.style.background = COLORS[owner.color];
                        el.style.opacity = isMort ? '0.3' : '0.8';
                        el.style.display = 'flex';
                        if (sq) {
                            sq.style.boxShadow = `inset 0 0 0 3px ${COLORS[owner.color]}`;
                        }
                    } else {
                        el.style.background = '';
                        el.style.opacity = '0';
                        el.style.display = 'none';
                        if (sq) sq.style.boxShadow = 'none';
                    }
                }
                if (info) {
                    if (isOwned) {
                        info.textContent = owner.name;
                        info.style.opacity = isMort ? '0.5' : '1';
                    } else {
                        info.textContent = '';
                        info.style.opacity = '0';
                    }
                }
                if (sq) {
                    if (isOwned) {
                        sq.classList.add('owned');
                        if (isMort) sq.style.filter = 'grayscale(0.5)';
                        else sq.style.filter = 'none';
                    } else {
                        sq.classList.remove('owned');
                        sq.style.filter = 'none';
                    }
                }
            });
        }
        function updateBuildBtn() {
            const p = G.players[G.cur];
            if (!p || p.isAI) return;
            let canBuildAnywhere = false;

            Object.entries(GR).forEach(([groupName, ids]) => {
                // Sadece arsa grubunda ev kurulabilir
                if (groupName === 'railroad' || groupName === 'utility') return;

                // Tüm gruba sahip mi ve hiçbiri ipotekli değil mi?
                const hasFullSet = ids.every(id => G.props[id] && G.props[id].owner === p.id && !G.props[id].mort);

                if (hasFullSet) {
                    ids.forEach(id => {
                        const sq = window.activeSQ[id];
                        const pr = G.props[id];
                        // Ev sayısı 5'ten az (otel olmamış) ve parası yetiyor mu?
                        if (pr.houses < 5 && p.money >= sq.hc) {
                            canBuildAnywhere = true;
                        }
                    });
                }
            });

            document.getElementById('buildBtn').disabled = !canBuildAnywhere;
        }
        function openBuild() {
            const p = G.players[G.cur];
            const c = document.getElementById('buildList');
            c.innerHTML = '';
            Object.entries(GR).forEach(([g, ids]) => {
                if (g === 'railroad' || g === 'utility') return;
                const all = ids.every(x => G.props[x] && G.props[x].owner === p.id && !G.props[x].mort);
                if (all) ids.forEach(x => {
                    const s = window.activeSQ[x], pr = G.props[x];
                    const limit = G.customRules.infHouses ? 99 : 5;
                    if (pr.houses < limit && p.money >= s.hc) {
                        const d = document.createElement('div');
                        d.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:10px;background:rgba(255,255,255,0.1);border-radius:8px;margin-bottom:8px';
                        let label = pr.houses === 4 ? 'Otel' : pr.houses + ' ev';
                        if (pr.houses >= 5) label = 'Gelişmiş';
                        d.innerHTML = `<span><span style="display:inline-block;width:15px;height:15px;background:${s.color};border-radius:3px;margin-right:8px"></span>${s.name} (${label})</span><button class="btn btn-action" style="padding:6px 12px;animation:none" onclick="buildHouse(${x})">🏗️ ${s.hc}₺</button>`;
                        c.appendChild(d)
                    }
                })
            });
            if (!c.innerHTML) c.innerHTML = '<p style="text-align:center;opacity:0.6;padding:15px">İnşa edilebilecek mülk yok</p>';
            document.getElementById('buildModal').classList.add('active')
        }

        function buildHouse(id) {
            const p = G.players[G.cur], s = window.activeSQ[id], pr = G.props[id];
            chgMoney(p, -s.hc);
            pr.houses++;
            log(`🏗️ ${p.name} ${s.name}'e ${pr.houses === 5 ? 'OTEL' : 'ev'} yaptı!`, true);
            updateBld(id);
            updateUI();
            openBuild();
        }
        function updateBld(id) { const pr = G.props[id]; if (!pr) return; const c = document.getElementById('bld-' + id); if (!c) return; c.innerHTML = ''; if (pr.houses === 5) c.innerHTML = '<div class="hotel"></div>'; else for (let i = 0; i < pr.houses; i++)c.innerHTML += '<div class="house"></div>' }
        function openMortgage() { const p = G.players[G.cur]; const c = document.getElementById('mortgageList'); c.innerHTML = ''; if (!p.props.length) { c.innerHTML = `<p style="text-align:center;opacity:0.6;padding:15px">${t('mortgage_empty')}</p>`; document.getElementById('mortgageModal').classList.add('active'); return } p.props.forEach(id => { const s = window.activeSQ[id], pr = G.props[id], v = Math.floor(s.price / 2); const d = document.createElement('div'); d.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:10px;background:rgba(255,255,255,0.1);border-radius:8px;margin-bottom:8px'; if (pr.mort) { const cost = Math.floor(v * 1.1); d.innerHTML = `<span style="opacity:0.5"><span style="display:inline-block;width:15px;height:15px;background:${s.color || '#999'};border-radius:3px;margin-right:8px"></span>${s.name} ${t('mortgage_status')}</span><button class="btn btn-action" style="padding:6px 12px;animation:none" onclick="unmort(${id})" ${p.money < cost ? 'disabled' : ''}>🔓 ${cost}${t('currency')}</button>` } else if (pr.houses === 0) d.innerHTML = `<span><span style="display:inline-block;width:15px;height:15px;background:${s.color || '#999'};border-radius:3px;margin-right:8px"></span>${s.name}</span><button class="btn btn-end" style="padding:6px 12px" onclick="mort(${id})">💰 +${v}${t('currency')}</button>`; else d.innerHTML = `<span><span style="display:inline-block;width:15px;height:15px;background:${s.color || '#999'};border-radius:3px;margin-right:8px"></span>${s.name} (${pr.houses} ev)</span><span style="opacity:0.5">${t('mortgage_sell_houses')}</span>`; c.appendChild(d) }); document.getElementById('mortgageModal').classList.add('active') }
        function mort(id) { const p = G.players[G.cur], s = window.activeSQ[id], pr = G.props[id]; pr.mort = true; chgMoney(p, Math.floor(s.price / 2)); log(`💰 ${p.name} ${s.name} ${t('mortgage_log')}`); updateUI(); updateOwners(); openMortgage() }
        function unmort(id) { const p = G.players[G.cur], s = window.activeSQ[id], pr = G.props[id]; pr.mort = false; chgMoney(p, -Math.floor(s.price / 2 * 1.1)); log(`🔓 ${p.name} ${s.name} ${t('mortgage_out_log')}`); updateUI(); updateOwners(); openMortgage() }
        let lastTradePartner = null;
        function openTrade() {
            const p = G.players[G.cur];
            const sel = document.getElementById('tradePlayer');
            sel.innerHTML = '';
            let count = 0;
            G.players.forEach(x => {
                if (x.id !== p.id && !x.out) {
                    sel.innerHTML += `<option value="${x.id}">${x.name} (${x.money}₺)</option>`;
                    count++;
                }
            });
            if (count === 0) { alert(t('trade_no_partner')); return; }
            TR = { my: [], their: [] };
            lastTradePartner = parseInt(sel.value);
            document.getElementById('myMoney').value = '';
            document.getElementById('theirMoney').value = '';
            updateTrade();
            document.getElementById('tradeModal').classList.add('active')
        }
        function updateTrade() {
            const p = G.players[G.cur], tidVal = document.getElementById('tradePlayer').value;
            if (tidVal === "") return;
            const tid = parseInt(tidVal), partner = G.players[tid];
            if (!partner) return;

            // Partner değiştiyse karşı tarafın seçili mülklerini temizle
            if (lastTradePartner !== tid) {
                TR.their = [];
                lastTradePartner = tid;
            }

            const myC = document.getElementById('myProps');
            myC.innerHTML = '';
            if (!p.props.length) myC.innerHTML = `<div style="grid-column: 1/-1; opacity:0.5; text-align:center; padding:20px;">${t('trade_no_prop')}</div>`;
            else p.props.forEach(id => {
                const s = window.activeSQ[id];
                const d = document.createElement('div');
                d.className = 'trade-prop' + (TR.my.includes(id) ? ' selected' : '');
                d.innerHTML = `<div class="trade-prop-color" style="background:${s.color || '#999'}"></div><span>${s.name}</span>`;
                d.onclick = () => {
                    const i = TR.my.indexOf(id);
                    if (i > -1) TR.my.splice(i, 1);
                    else TR.my.push(id);
                    updateTrade();
                };
                myC.appendChild(d);
            });

            const thC = document.getElementById('theirProps');
            thC.innerHTML = '';
            if (!partner.props.length) thC.innerHTML = `<div style="grid-column: 1/-1; opacity:0.5; text-align:center; padding:20px;">${t('trade_no_prop')}</div>`;
            else partner.props.forEach(id => {
                const s = window.activeSQ[id];
                const d = document.createElement('div');
                d.className = 'trade-prop' + (TR.their.includes(id) ? ' selected' : '');
                d.innerHTML = `<div class="trade-prop-color" style="background:${s.color || '#999'}"></div><span>${s.name}</span>`;
                d.onclick = () => {
                    const i = TR.their.indexOf(id);
                    if (i > -1) TR.their.splice(i, 1);
                    else TR.their.push(id);
                    updateTrade();
                };
                thC.appendChild(d);
            });
        }
        function doTrade() {
            const p = G.players[G.cur], tid = parseInt(document.getElementById('tradePlayer').value), partner = G.players[tid];
            const myM = parseInt(document.getElementById('myMoney').value) || 0, thM = parseInt(document.getElementById('theirMoney').value) || 0;
            if (!TR.my.length && !TR.their.length && !myM && !thM) { alert(t('trade_select_item')); return }
            if (myM > p.money || thM > partner.money) { alert(t('trade_no_money')); return }

            const tradeData = { myProps: [...TR.my], theirProps: [...TR.their], myMoney: myM, theirMoney: thM };

            if (partner.isAI) {
                if (aiEvaluateTrade(p, partner, tradeData)) {
                    closeModal('tradeModal');
                    executeTrade(p, partner, [...TR.my], [...TR.their], myM, thM);
                }
            } else {
                closeModal('tradeModal');
                openTradeOffer(p, partner, tradeData);
            }
        }

        function bankrupt(targetId = null, creditorId = null) {
            const pid = targetId === null ? G.cur : targetId;
            const p = G.players[pid];
            if (p.out) return; // Already out

            p.out = true;
            log(`💀 ${p.name} iflas etti!`, true);

            if (creditorId !== null) {
                const creditor = G.players[creditorId];
                log(`💰 Tüm varlıkları ${creditor.name} oyuncusuna devredildi.`, true);

                // Devret parayı (kalan varsa)
                if (p.money > 0) chgMoney(creditor, p.money);

                // Devret mülkleri
                p.props.forEach(id => {
                    creditor.props.push(id);
                    G.props[id].owner = creditor.id;
                    // Note: Houses/Hotels remain as they are in some rules, 
                    // but standard Monopoly usually clears them if bankrupting to bank.
                    // Here we keep them if bankrupting to another player.
                });

                // Devret hapis kartlarını
                creditor.jailCards += p.jailCards;
            } else {
                // Bankaya iflas
                p.props.forEach(id => {
                    const sq = window.activeSQ[id];
                    delete G.props[id];
                    updateBld(id); // Reset houses/hotels on board
                });
                log(`🏦 Varlıkları bankaya devredildi.`, true);
            }

            p.props = [];
            p.money = 0;
            p.jailCards = 0;

            const act = G.players.filter(x => !x.out);
            if (act.length === 1) {
                document.getElementById('winText').textContent = `${act[0].name} ${act[0].money.toLocaleString('tr-TR')}₺ ile kazandı!`;
                document.getElementById('winModal').classList.add('active');
                spawnConfetti();
                setInterval(spawnConfetti, 2000);
            }

            updateOwners();
            updateUI();

            // If it was the current player's turn, we should probably auto-end it or enable the button
            if (pid === G.cur) {
                document.getElementById('endBtn').disabled = false;
                // If AI, it will be handled by the caller or next checkAI
            }
        }
        function endTurn() {
            G.pending = null;
            G.rolled = false;
            G.doubles = 0;
            do { G.cur = (G.cur + 1) % G.players.length } while (G.players[G.cur].out);

            const p = G.players[G.cur];
            document.getElementById('rollBtn').disabled = false;
            document.getElementById('buyBtn').disabled = true;
            document.getElementById('auctionBtn').disabled = true;
            document.getElementById('auctionBtn').style.display = 'none';
            document.getElementById('buildBtn').disabled = true;
            document.getElementById('endBtn').disabled = true;

            // Show jail controls if in jail
            const jc = document.getElementById('jailControls');
            if (p.jail) {
                jc.style.display = 'flex';
                document.getElementById('useJailCardBtn').disabled = (p.jailCards <= 0);
            } else {
                jc.style.display = 'none';
            }

            document.querySelectorAll('.square').forEach(x => x.classList.remove('current'));
            log(`▶️ ${G.players[G.cur].name}'ın sırası!`, true);
            updateUI();
            autoSave();
            checkAI();
        }

        function autoSave() {
            try {
                const themeMatch = document.body.className.match(/theme-([a-z]+)/);
                const data = {
                    G: G,
                    CHANCE: CHANCE,
                    CHEST: CHEST,
                    mapKey: document.getElementById('mapSelect') ? document.getElementById('mapSelect').value : 'turkiye',
                    gameLog: document.getElementById('gameLog').innerHTML,
                    selectedIcons: selectedIcons,
                    theme: themeMatch ? themeMatch[1] : 'premium',
                    sound: SND.enabled,
                    lang: currLang
                };

                localStorage.setItem('monopolx_autosave', JSON.stringify(data));
            } catch (e) { debugError("AutoSave failed", e); }
        }

        function loadGame() {
            try {
                const raw = localStorage.getItem('monopolx_autosave');
                if (!raw) return;
                const data = JSON.parse(raw);
                G = data.G;
                CHANCE = data.CHANCE;
                CHEST = data.CHEST;

                if (data.lang) {
                    currLang = data.lang;
                    const lLbl = document.getElementById('langLabel');
                    if (lLbl) lLbl.textContent = currLang.toUpperCase();
                    updateLangUI();
                }

                if (data.sound !== undefined) {
                    SND.enabled = data.sound;
                    const btn = document.getElementById('toggleSound');
                    if (btn) btn.classList.toggle('on', SND.enabled);
                }


                if (data.selectedIcons) {
                    Object.assign(selectedIcons, data.selectedIcons);
                    for (let i = 1; i <= 4; i++) {
                        const preview = document.getElementById(`preview-p${i}`);
                        if (preview) preview.textContent = selectedIcons[i];
                    }
                }

                if (data.theme) setTheme(data.theme);

                const mapK = data.mapKey || 'turkiye';
                window.activeSQ = getMapSQ(mapK);
                if (document.getElementById('mapSelect')) document.getElementById('mapSelect').value = mapK;

                document.getElementById('setupScreen').classList.add('hidden');
                document.getElementById('gameContainer').style.display = 'flex';
                buildBoard();
                sync3DEffectFromUI();
                document.getElementById('gameLog').innerHTML = data.gameLog || "";
                updateOwners();
                updateUI();
                log("🎮 Oyun kaldığı yerden devam ediyor!", true);
                if (G.players[G.cur] && G.players[G.cur].isAI && !G.rolled) {
                    checkAI();
                }
            } catch (e) {
                debugError("Load failed", e);
                alert("Kayıt dosyası yüklenirken hata oluştu. Lütfen konsolu kontrol edin.");
            }
        }

        function togglePanel(side) {
            const panel = side === 'left' ? document.getElementById('leftPanel') : document.getElementById('rightPanel');
            const toggle = side === 'left' ? document.getElementById('toggleLeftPanel') : document.getElementById('toggleRightPanel');
            
            if (panel && toggle) {
                panel.classList.toggle('collapsed');
                const isCollapsed = panel.classList.contains('collapsed');
                
                // Update icon rotation
                const icon = toggle.querySelector('.panel-toggle-icon');
                if (icon) {
                    if (side === 'left') {
                        icon.textContent = isCollapsed ? '▶' : '◀';
                    } else {
                        icon.textContent = isCollapsed ? '◀' : '▶';
                    }
                }
                
                // Save state
                localStorage.setItem(`panel_${side}_collapsed`, isCollapsed);
            }
        }
        window.togglePanel = togglePanel;

        function initPanelStates() {
            const leftCollapsed = localStorage.getItem('panel_left_collapsed') === 'true';
            const rightCollapsed = localStorage.getItem('panel_right_collapsed') === 'true';
            
            if (leftCollapsed) {
                document.getElementById('leftPanel')?.classList.add('collapsed');
                const leftToggle = document.getElementById('toggleLeftPanel');
                if (leftToggle) {
                    const icon = leftToggle.querySelector('.panel-toggle-icon');
                    if (icon) icon.textContent = '▶';
                }
            }
            
            if (rightCollapsed) {
                document.getElementById('rightPanel')?.classList.add('collapsed');
                const rightToggle = document.getElementById('toggleRightPanel');
                if (rightToggle) {
                    const icon = rightToggle.querySelector('.panel-toggle-icon');
                    if (icon) icon.textContent = '◀';
                }
            }
        }

        window.onload = () => {
            if (localStorage.getItem('monopolx_autosave')) {
                document.getElementById('resumeBtn').style.display = 'block';
            }
            // Ensure 3D is off on fresh load
            set3DEffect(false);
            // Initialize difficulty display
            updateDifficultyDisplay();
            initMapSelection();
            // Initialize language UI
            updateLangUI();
            // Initialize panel states
            initPanelStates();

            // Listen for resize to re-align tokens
            window.addEventListener('resize', throttle(() => {
                if (G.players && G.players.length > 0) updateTokens();
            }, 250));
        }

        function updateUI() {
            try {
                updateTokens();
                updatePanel();
                const d = document.getElementById('parkDisp');
                if (d) d.innerHTML = `<span style="opacity:0.7; font-size:0.75rem; margin-right:6px;">🅿️ Park</span><span style="color:var(--gold); font-weight:700; font-size:0.9rem;">${G.park || 0}₺</span>`;
                Object.keys(G.props || {}).forEach(id => {
                    try {
                        updateBld(parseInt(id));
                    } catch (e) {
                        debugError("updateBld error:", e);
                    }
                });

                const p = G.players[G.cur];
                if (!p) return;
                
                const ctrl = document.querySelector('.controls-vertical');
                const turnName = document.getElementById('currentPlayerName');

            if (p) {
                if (turnName) {
                    turnName.textContent = p.isAI ? `🤖 ${p.name}` : `👤 ${p.name}`;
                    turnName.style.color = COLORS[p.color];
                }

                const aiOverlay = document.getElementById('aiOverlay');
                const aiWaitName = document.getElementById('aiWaitingPlayerName');

                if (ctrl) {
                    if (p.isAI) {
                        // AI sırasında sadece bilgilendirme overlay'i göster, ama butonları engelleme
                        ctrl.style.opacity = '0.85';
                        // pointerEvents'i kaldırdık - kullanıcı "Turu Atla" butonunu kullanabilir
                        if (aiOverlay) aiOverlay.classList.add('active');
                        if (aiWaitName) aiWaitName.textContent = p.name;
                        
                        // "Turu Atla" butonunu AI sırasında da görünür ve kullanılabilir yap
                        const endBtn = document.getElementById('endBtn');
                        const mobEndBtn = document.getElementById('mobEndBtn');
                        if (endBtn) {
                            endBtn.style.opacity = '1';
                            endBtn.style.pointerEvents = 'auto';
                            endBtn.style.position = 'relative';
                            endBtn.style.zIndex = '101';
                        }
                        if (mobEndBtn) {
                            mobEndBtn.style.opacity = '1';
                            mobEndBtn.style.pointerEvents = 'auto';
                            mobEndBtn.style.position = 'relative';
                            mobEndBtn.style.zIndex = '101';
                        }
                    } else {
                        ctrl.style.opacity = '1';
                        ctrl.style.pointerEvents = 'auto';
                        if (aiOverlay) aiOverlay.classList.remove('active');
                    }
                }

                // Sync Mobile Header & Bottom Bar
                if (window.innerWidth <= 900) {
                    const mobName = document.getElementById('mobCurrentName');
                    const mobMoney = document.getElementById('mobCurrentMoney');
                    const mobIcon = document.getElementById('mobCurrentIcon');
                    if (mobName) mobName.textContent = p.name;
                    if (mobMoney) mobMoney.textContent = p.money.toLocaleString() + '₺';
                    if (mobIcon) mobIcon.textContent = p.icon;

                    const mobRoll = document.getElementById('mobRollBtn');
                    const mobBuy = document.getElementById('mobBuyBtn');
                    const mobEnd = document.getElementById('mobEndBtn');

                    if (mobRoll) mobRoll.disabled = G.rolled || p.isAI;
                    const buyBtn = document.getElementById('buyBtn');
                    const endBtn = document.getElementById('endBtn');
                    if (mobBuy && buyBtn) mobBuy.disabled = buyBtn.disabled;
                    
                    // "Turu Atla" butonu AI sırasında da görünür ve kullanılabilir olmalı
                    if (mobEnd && endBtn) {
                        mobEnd.disabled = endBtn.disabled;
                        // AI sırasında bile buton görünür olsun
                        if (p.isAI) {
                            mobEnd.style.opacity = '1';
                            mobEnd.style.pointerEvents = 'auto';
                            mobEnd.style.zIndex = '102';
                        }
                    }
                }
            }
            } catch (e) {
                debugError("updateUI error:", e);
            }
        }
        function updateTokens() {
            const layer = document.getElementById('tokensLayer');
            if (!layer) return;

            G.players.forEach(p => {
                if (p.out) {
                    const existing = document.getElementById('token-p' + p.id);
                    if (existing) existing.remove();
                    return;
                }

                let t = document.getElementById('token-p' + p.id);
                if (!t) {
                    t = document.createElement('div');
                    t.id = 'token-p' + p.id;
                    t.className = `token token-${p.color}`;
                    t.innerHTML = p.icon + '<div class="speech-bubble"></div>';
                    layer.appendChild(t);
                }

                const pos = getPos(p.pos);
                // Grid is 11x11, so center of a cell is (cell - 0.5) / 11
                t.style.left = ((pos.c - 0.5) / 11 * 100) + '%';
                t.style.top = ((pos.r - 0.5) / 11 * 100) + '%';

                // Add minor scale for active player
                const isActive = G.players[G.cur].id === p.id;
                t.style.transform = `translate(-50%, -50%) ${isActive ? 'scale(1.15)' : 'scale(1)'}`;
                t.classList.toggle('active-token', isActive);
            });

            // Sırası olan oyuncunun karesini vurgula
            document.querySelectorAll('.square').forEach(s => s.classList.remove('current-active'));
            const curP = G.players[G.cur];
            const curSq = document.getElementById('sq-' + curP.pos);
            if (curSq) curSq.classList.add('current-active');
        }
        function updatePanel() {
            const pn = document.getElementById('playersPanel');
            if (!pn) return;
            pn.innerHTML = '';
            G.players.forEach((p, i) => {
                const c = document.createElement('div');
                c.className = 'player-card' + (i === G.cur ? ' active' : '') + (p.out ? ' bankrupt' : '');
                const dots = p.props.map(id => {
                    const s = window.activeSQ ? window.activeSQ[id] : null;
                    const pr = G.props[id];
                    if (!s) return ''; // Güvenlik kontrolü
                    const bgColor = s.color || (s.type === 'railroad' ? '#333' : '#9c27b0');
                    const opacity = (pr && pr.mort) ? 'opacity:0.4;' : '';
                    return `<div class="prop-dot" style="background:${bgColor};${opacity}" title="${s.name}"></div>`;
                }).join('');
                c.innerHTML = `<div class="player-header"><div class="player-token-icon" style="background:${COLORS[p.color]}"></div><div><div class="player-name">${p.name}${p.isAI ? `<span class="ai-badge">${p.difficulty}</span>` : ''}${i === G.cur ? ' 🎯' : ''}</div><div class="player-money">${p.money.toLocaleString('tr-TR')}₺</div></div></div>${p.jail ? `<div style="color:#ff9800;font-size:0.75rem">🔒 Hapiste (${p.jt}/3)</div>` : ''}<div class="player-props">${dots || '<span style="opacity:0.4;font-size:0.7rem">Mülk yok</span>'}</div>`;
                pn.appendChild(c);
            });
        }
        function showProp(i) {
            const s = window.activeSQ[i];
            if (!s || !['property', 'railroad', 'utility'].includes(s.type)) return;
            const propId = resolvePropId(s, i);
            const pr = G.props[propId];
            const owner = pr ? G.players[pr.owner] : null;
            let own = 'Satılık';
            if (owner) {
                own = `<span style="color:${COLORS[owner.color]}">${owner.name}</span>${pr.mort ? ' <span style="color:#f44336">(İpotekli)</span>' : ''}`;
            }
            document.getElementById('propInfo').innerHTML = `<div style="display:flex;align-items:center;gap:12px;margin-bottom:15px"><div style="width:35px;height:55px;background:${s.color || '#999'};border-radius:6px"></div><div><h3 style="margin:0">${s.name}</h3><p style="margin:4px 0 0;opacity:0.7">Sahibi: ${own}</p></div></div>`;
            let det = `<p><span>💰 Fiyat:</span><span>${s.price}₺</span></p>`;
            if (s.type === 'property') {
                det += `<p><span>Boş kira:</span><span>${s.rent[0]}₺</span></p>`;
                for (let h = 1; h <= 4; h++)det += `<p><span>${h} Ev:</span><span>${s.rent[h]}₺</span></p>`;
                det += `<p><span>🏨 Otel:</span><span>${s.rent[5]}₺</span></p><p><span>Ev maliyeti:</span><span>${s.hc}₺</span></p>`;
                if (pr && pr.houses > 0) det += `<p style="color:var(--gold)"><span>Mevcut:</span><span>${pr.houses === 5 ? '1 Otel' : pr.houses + ' Ev'}</span></p>`;
            } else if (s.type === 'railroad') {
                for (let r = 1; r <= 4; r++)det += `<p><span>${r} İstasyon:</span><span>${s.rent[r - 1]}₺</span></p>`;
            } else {
                det += `<p><span>1 Şirket:</span><span>Zar×4</span></p><p><span>2 Şirket:</span><span>Zar×10</span></p>`;
            }
            det += `<p><span>İpotek:</span><span>${Math.floor(s.price / 2)}₺</span></p>`;
            document.getElementById('propDetails').innerHTML = det;
            document.getElementById('propModal').classList.add('active');
        }
        function closeModal(id) { document.getElementById(id).classList.remove('active') }
        function log(m, imp = false) { const l = document.getElementById('gameLog'); const e = document.createElement('div'); e.className = 'log-entry' + (imp ? ' important' : ''); e.textContent = m; l.insertBefore(e, l.firstChild); while (l.children.length > 40) l.removeChild(l.lastChild) }

        // Keyboard Shortcuts
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
                e.preventDefault();

                const rollBtn = document.getElementById('rollBtn');
                const endBtn = document.getElementById('endBtn');

                if (rollBtn && !rollBtn.disabled && rollBtn.offsetParent !== null) {
                    rollDice();
                } else if (endBtn && !endBtn.disabled && endBtn.offsetParent !== null) {
                    endTurn();
                }
            }
        });

        // Dynamic 3D Board Tilt Logic
        let tiltEnabled = false;

        function set3DEffect(enabled) {
            tiltEnabled = !!enabled;
            const btn = document.getElementById('toggle3D');
            const mobBtn = document.getElementById('toggle3DMob');
            if (btn) btn.classList.toggle('on', tiltEnabled);
            if (mobBtn) mobBtn.classList.toggle('on', tiltEnabled);

            const board = document.querySelector('.board');
            const container = document.querySelector('.board-container');

            if (tiltEnabled) {
                // 3D efekti aç - perspektif ve rotasyon ekle
                if (container) {
                    container.classList.add('tilt-active');
                    container.style.perspective = '2000px';
                }
                if (board) {
                    board.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    board.style.transform = `rotateX(5deg) rotateY(0deg)`;
                    setTimeout(() => { board.style.transition = 'transform 0.1s ease-out'; }, 600);
                }
            } else {
                // 3D efekti kapat - düz yap
                resetBoardToFlat();
            }
        }

        function toggle3DEffect() {
            set3DEffect(!tiltEnabled);
        }

        function sync3DEffectFromUI() {
            const btn = document.getElementById('toggle3D');
            const mobBtn = document.getElementById('toggle3DMob');
            // A toggle is 'on' only if it has the 'on' class
            const shouldEnable = (btn && btn.classList.contains('on')) || (mobBtn && mobBtn.classList.contains('on'));
            set3DEffect(shouldEnable);
        }

        function resetBoardToFlat() {
            const board = document.querySelector('.board');
            const container = document.querySelector('.board-container');
            if (board) {
                board.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                board.style.transform = 'none';
                setTimeout(() => { board.style.transition = 'none'; }, 600);
            }
            if (container) {
                container.classList.remove('tilt-active');
                container.style.perspective = 'none';
            }
        }

        function resetBoardTilt() {
            if (!tiltEnabled) {
                resetBoardToFlat();
                return;
            }
            const board = document.querySelector('.board');
            if (board) {
                board.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                board.style.transform = `rotateX(5deg) rotateY(0deg)`;
                setTimeout(() => { board.style.transition = 'transform 0.1s ease-out'; }, 600);
            }
        }

        document.addEventListener('mousemove', e => {
            if (!tiltEnabled) return;
            const board = document.querySelector('.board');
            const setup = document.getElementById('setupScreen');
            if (!board || (setup && !setup.classList.contains('hidden'))) return;

            // Side panel check
            const panels = document.querySelectorAll('.side-panel');
            let overPanel = false;
            panels.forEach(p => {
                const rect = p.getBoundingClientRect();
                if (e.clientX >= rect.left && e.clientX <= rect.right) overPanel = true;
            });

            if (overPanel) {
                resetBoardTilt();
            } else {
                const x = (window.innerWidth / 2 - e.pageX) / 60;
                const y = (window.innerHeight / 2 - e.pageY) / 60;
                board.style.transform = `rotateX(${5 + y}deg) rotateY(${-x}deg)`;
            }
        });

        document.addEventListener('mouseleave', resetBoardTilt);

        // Initialize setup screen UI & Fixed Event Listeners
        window.addEventListener('load', () => {
            initIconSelectors();
            setTheme('premium'); // Default to Premium
            autoName(3); autoName(4);

            if (localStorage.getItem('monopolx_autosave')) {
                document.getElementById('resumeBtn').style.display = 'block';
            }
            // Ensure 3D is off by default
            set3DEffect(false);
        });

        const throttledTokens = () => {
            if (G.players && G.players.length > 0 && document.getElementById('gameContainer').style.display !== 'none') {
                updateTokens();
            }
        };
        window.addEventListener('resize', throttledTokens);
        window.addEventListener('scroll', throttledTokens);
