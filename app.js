// State
let assets = JSON.parse(localStorage.getItem('assets')) || [];
let currency = localStorage.getItem('currency') || 'USD';
let currentTab = 'all';
let currentView = 'home'; // home, growth, settings
let projectionYears = 5;
let allocationChart = null;
const COINBASE_API = 'https://api.coinbase.com/v2/prices';

// UK Banks List
const UK_BANKS = [
    'Barclays', 'HSBC', 'Lloyds Bank', 'NatWest', 'Santander UK',
    'Royal Bank of Scotland', 'TSB Bank', 'Nationwide Building Society',
    'Halifax', 'First Direct', 'Metro Bank', 'Monzo', 'Revolut',
    'Starling Bank', 'Nationwide', 'Virgin Money', 'Tesco Bank',
    'M&S Bank', 'Co-operative Bank', 'Yorkshire Bank', 'Clydesdale Bank',
    'AIB (UK)', 'Bank of Ireland UK', 'Bank of Scotland', 'Adam & Company',
    'Atom Bank', 'Chase UK', 'Kroo', 'Zopa Bank', 'Tandem Bank'
].sort();

// Supported Assets with Images
const SUPPORTED_CRYPTO = [
    { symbol: 'BTC', name: 'Bitcoin', id: 'bitcoin', image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
    { symbol: 'ETH', name: 'Ethereum', id: 'ethereum', image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    { symbol: 'SOL', name: 'Solana', id: 'solana', image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
    { symbol: 'USDT', name: 'Tether', id: 'tether', image: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
    { symbol: 'BNB', name: 'Binance Coin', id: 'binancecoin', image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
    { symbol: 'XRP', name: 'XRP', id: 'ripple', image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
    { symbol: 'USDC', name: 'USDC', id: 'usd-coin', image: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
    { symbol: 'ADA', name: 'Cardano', id: 'cardano', image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
    { symbol: 'AVAX', name: 'Avalanche', id: 'avalanche-2', image: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png' },
    { symbol: 'DOGE', name: 'Dogecoin', id: 'dogecoin', image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' },
    { symbol: 'DOT', name: 'Polkadot', id: 'polkadot', image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png' },
    { symbol: 'TRX', name: 'TRON', id: 'tron', image: 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png' },
    { symbol: 'LINK', name: 'Chainlink', id: 'chainlink', image: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
    { symbol: 'MATIC', name: 'Polygon', id: 'matic-network', image: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png' },
    { symbol: 'SHIB', name: 'Shiba Inu', id: 'shiba-inu', image: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png' },
    { symbol: 'LTC', name: 'Litecoin', id: 'litecoin', image: 'https://assets.coingecko.com/coins/images/2/small/litecoin.png' },
    { symbol: 'DAI', name: 'Dai', id: 'dai', image: 'https://assets.coingecko.com/coins/images/9956/small/4943.png' },
    { symbol: 'BCH', name: 'Bitcoin Cash', id: 'bitcoin-cash', image: 'https://assets.coingecko.com/coins/images/780/small/bitcoin-cash-circle.png' },
    { symbol: 'UNI', name: 'Uniswap', id: 'uniswap', image: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png' },
    { symbol: 'ATOM', name: 'Cosmos', id: 'cosmos', image: 'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png' }
];

// Using Clearbit for stock logos (fallback to text if fails)
const SUPPORTED_STOCKS = [
    { symbol: 'AAPL', name: 'Apple Inc.', image: 'https://logo.clearbit.com/apple.com' },
    { symbol: 'MSFT', name: 'Microsoft Corp', image: 'https://logo.clearbit.com/microsoft.com' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', image: 'https://logo.clearbit.com/abc.xyz' },
    { symbol: 'AMZN', name: 'Amazon.com', image: 'https://logo.clearbit.com/amazon.com' },
    { symbol: 'NVDA', name: 'NVIDIA Corp', image: 'https://logo.clearbit.com/nvidia.com' },
    { symbol: 'TSLA', name: 'Tesla Inc.', image: 'https://logo.clearbit.com/tesla.com' },
    { symbol: 'META', name: 'Meta Platforms', image: 'https://logo.clearbit.com/meta.com' },
    { symbol: 'BRK.B', name: 'Berkshire Hathaway', image: 'https://logo.clearbit.com/berkshirehathaway.com' },
    { symbol: 'TSM', name: 'TSMC', image: 'https://logo.clearbit.com/tsmc.com' },
    { symbol: 'V', name: 'Visa Inc.', image: 'https://logo.clearbit.com/visa.com' },
    { symbol: 'JPM', name: 'JPMorgan Chase', image: 'https://logo.clearbit.com/jpmorganchase.com' },
    { symbol: 'WMT', name: 'Walmart', image: 'https://logo.clearbit.com/walmart.com' },
    { symbol: 'MA', name: 'Mastercard', image: 'https://logo.clearbit.com/mastercard.com' },
    { symbol: 'SPY', name: 'S&P 500 ETF', image: 'https://logo.clearbit.com/statestreet.com' },
    { symbol: 'QQQ', name: 'Invesco QQQ', image: 'https://logo.clearbit.com/invesco.com' }
];

// Mock Stock Prices
const MOCK_STOCK_PRICES = {
    'AAPL': 185.50, 'MSFT': 370.00, 'GOOGL': 140.10, 'AMZN': 145.30, 'NVDA': 480.90,
    'TSLA': 240.20, 'META': 330.50, 'BRK.B': 360.00, 'TSM': 100.20, 'V': 255.10,
    'JPM': 165.40, 'WMT': 155.30, 'MA': 410.20, 'SPY': 470.50, 'QQQ': 405.10
};

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // FIREBASE CONFIGURATION
    // ==========================================
    const firebaseConfig = {
        apiKey: "AIzaSyBgOLZ1qR66TWrd8IOw9mlpDcb-FVkNDVs",
        authDomain: "assetly-ad663.firebaseapp.com",
        projectId: "assetly-ad663",
        storageBucket: "assetly-ad663.firebasestorage.app",
        messagingSenderId: "685693781118",
        appId: "1:685693781118:web:a3d67adcd21f553d06442f",
        measurementId: "G-2L29DDEP2W"
    };
    // ==========================================

    // Initialize Firebase
    let auth, db, user = null;
    let isFirebaseInitialized = false;
    let isOfflineMode = false; // Track offline state to suppress noisy toasts

    (async function initializeFirebase() {
        try {
            if (firebaseConfig.apiKey) {
                firebase.initializeApp(firebaseConfig);
                auth = firebase.auth();
                db = firebase.firestore();

                // Use Long Polling to avoid "Client is offline" errors in some environments
                db.settings({ experimentalForceLongPolling: true });

                // Enable Offline Persistence
                try {
                    await db.enablePersistence();
                    console.log('Persistence enabled');
                } catch (err) {
                    if (err.code == 'failed-precondition') {
                        console.warn('Persistence failed: Multiple tabs open');
                    } else if (err.code == 'unimplemented') {
                        console.warn('Persistence not supported by browser');
                    }
                }

                isFirebaseInitialized = true;
                console.log('Firebase initialized with persistence');

                // Initialize app logic after Firebase is ready
                init();
            } else {
                console.warn('Firebase config missing. Running in offline mode.');
                init();
            }
        } catch (error) {
            console.error('Firebase initialization error:', error);
            init(); // Try to init anyway (offline mode)
        }
    })();

    // DOM Elements
    const assetsContainer = document.getElementById('assets-container');
    const totalBalanceEl = document.getElementById('total-balance');
    const addBtn = document.getElementById('add-btn');
    console.log('Add Button found:', addBtn);
    const addModal = document.getElementById('add-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const addForm = document.getElementById('add-form');
    const assetSymbolSelect = document.getElementById('asset-symbol');
    const typeRadios = document.querySelectorAll('input[name="type"]');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const settingsBtn = document.getElementById('settings-btn');
    // Settings Modal removed
    const currencyRadios = document.querySelectorAll('input[name="currency"]');
    const navBtns = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.tab-view');

    // Auth Elements
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userProfile = document.getElementById('user-profile');
    const authContainer = document.getElementById('auth-container');

    // Auth UI Update Function
    function updateAuthUI() {
        console.log('updateAuthUI called. User:', user);
        if (user) {
            console.log('Showing user profile, hiding login button');
            loginBtn.classList.add('hidden');
            userProfile.classList.remove('hidden');

            // Show user email
            let emailDisplay = document.getElementById('user-email-display');
            if (!emailDisplay) {
                emailDisplay = document.createElement('div');
                emailDisplay.id = 'user-email-display';
                emailDisplay.style.textAlign = 'center';
                emailDisplay.style.marginBottom = '10px';
                emailDisplay.style.color = '#8A8FA3';
                emailDisplay.style.fontSize = '14px';
                userProfile.insertBefore(emailDisplay, userProfile.firstChild);
            }
            emailDisplay.textContent = `Signed in as: ${user.email} (ID: ${user.uid.slice(0, 5)})`;

            // Test Cloud Button removed as requested
        } else {
            console.log('Showing login button, hiding user profile');
            loginBtn.classList.remove('hidden');
            userProfile.classList.add('hidden');
        }
    }

    // Auth Handlers
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            console.log('Login button clicked');
            if (!isFirebaseInitialized) {
                alert('Firebase is not configured. Please add your config in app.js');
                return;
            }

            if (!auth) {
                alert('Auth module not initialized. Check console for errors.');
                return;
            }

            const provider = new firebase.auth.GoogleAuthProvider();
            console.log('Starting sign in with POPUP...');

            auth.signInWithPopup(provider)
                .then((result) => {
                    console.log('Sign in successful. User:', result.user);
                    // Force UI update
                    updateAuthUI();
                })
                .catch(error => {
                    console.error('Login error:', error);
                    if (error.code === 'auth/popup-blocked') {
                        alert('Login Popup Blocked. Please allow popups for this site.');
                    } else if (error.code === 'auth/popup-closed-by-user') {
                        console.log('Popup closed by user');
                    } else if (error.code === 'auth/unauthorized-domain') {
                        alert(`DOMAIN ERROR: ${window.location.hostname} is not authorized in Firebase Console.`);
                    } else {
                        alert('Login failed: ' + error.message);
                    }
                });
        });
    }

    // Handle Redirect Result (Removed as we are using Popup)
    // if (isFirebaseInitialized && auth) { ... }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut().then(() => {
                console.log('Logged out');
                // Clear local data to prevent leaks
                localStorage.removeItem('assets');
                localStorage.removeItem('currency');
                window.location.reload();
            });
        });
    }

    // Cloud Sync Functions
    async function saveAssetsToCloud() {
        if (!user || !db) return;
        try {
            await db.collection('users').doc(user.uid).set({
                assets: assets,
                currency: currency,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            console.log('Saved assets to cloud');
        } catch (error) {
            console.error('Error saving to cloud:', error);
            alert('Cloud Save Error: ' + error.message);
        }
    }

    async function loadAssetsFromCloud() {
        if (!user || !db) return;
        try {
            const doc = await db.collection('users').doc(user.uid).get();
            if (doc.exists) {
                const data = doc.data();
                if (data.assets) {
                    assets = data.assets;
                    console.log('Loaded assets from cloud:', assets.length);
                    localStorage.setItem('assets', JSON.stringify(assets));
                }
                if (data.currency) {
                    currency = data.currency;
                    localStorage.setItem('currency', currency);
                    const radio = document.querySelector(`input[name="currency"][value="${currency}"]`);
                    if (radio) radio.checked = true;
                }
            } else {
                console.log('No cloud data found, syncing local to cloud');
                saveAssetsToCloud();
            }
        } catch (error) {
            console.error('Error loading from cloud:', error);
        }
    }

    function loadAssetsFromLocal() {
        const localAssets = localStorage.getItem('assets');
        if (localAssets) {
            assets = JSON.parse(localAssets);
            console.log('Loaded assets from local storage');
        }
    }

    // Initialization
    async function init() {
        if (isFirebaseInitialized) {
            auth.onAuthStateChanged(async (currentUser) => {
                console.log('Auth state changed. Current user:', currentUser);
                user = currentUser;
                updateAuthUI();
                if (user) {
                    await loadAssetsFromCloud();
                } else {
                    loadAssetsFromLocal();
                }
                renderAssets();
                updateTotalBalance();
                if (currentView === 'growth') renderGrowthTab();
            });
        } else {
            loadAssetsFromLocal();
            renderAssets();
            updateTotalBalance();
            if (currentView === 'growth') renderGrowthTab();
        }

        // Set initial currency radio
        document.querySelector(`input[name="currency"][value="${currency}"]`).checked = true;

        // Initialize free UK postcode autocomplete
        // Initialize custom address autocomplete
        const addressInput = document.getElementById('asset-address');
        let suggestionsList = document.getElementById('address-suggestions-list');

        if (!suggestionsList) {
            suggestionsList = document.createElement('ul');
            suggestionsList.id = 'address-suggestions-list';
            suggestionsList.className = 'suggestions-list hidden';
            addressInput.parentNode.style.position = 'relative'; // Ensure parent is relative
            addressInput.parentNode.appendChild(suggestionsList);
        }

        // Close suggestions on click outside
        document.addEventListener('click', (e) => {
            if (!addressInput.contains(e.target) && !suggestionsList.contains(e.target)) {
                suggestionsList.classList.add('hidden');
            }
        });

        // Address autocomplete handler (Nominatim)
        let debounceTimer;
        addressInput.addEventListener('input', async (e) => {
            clearTimeout(debounceTimer);
            const query = e.target.value.trim();

            if (query.length < 3) {
                suggestionsList.classList.add('hidden');
                return;
            }

            debounceTimer = setTimeout(async () => {
                try {
                    console.log('Looking up address:', query);
                    // Use Nominatim API for address search
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=gb`);
                    const data = await response.json();

                    console.log('Nominatim response:', data);

                    if (data && data.length > 0) {
                        suggestionsList.innerHTML = '';
                        suggestionsList.classList.remove('hidden');

                        data.forEach(item => {
                            const li = document.createElement('li');
                            li.className = 'suggestion-item';

                            // Format address
                            const addr = item.address;
                            const street = addr.road || '';
                            const number = addr.house_number || '';
                            const city = addr.city || addr.town || addr.village || addr.hamlet || addr.suburb || '';
                            const postcode = addr.postcode || '';

                            // Check if user typed a number
                            const queryNumMatch = query.match(/^(\d+)\s/);
                            const queryNum = queryNumMatch ? queryNumMatch[1] : null;

                            // Construct specific format: "10 Andermans, Windsor, SL4 5RN"
                            let mainParts = [];

                            if (number) {
                                mainParts.push(number + ' ' + street);
                            } else if (queryNum && street) {
                                // User typed a number but API returned street only -> use user's number
                                mainParts.push(queryNum + ' ' + street);
                            } else if (street) {
                                mainParts.push(street);
                            }

                            if (city) mainParts.push(city);
                            if (postcode) mainParts.push(postcode);

                            const mainText = mainParts.length > 0 ? mainParts.join(', ') : item.display_name.split(',').slice(0, 3).join(',');
                            const subText = item.display_name; // Keep full address as subtext for context

                            li.innerHTML = `
                                <i class="ph ph-map-pin suggestion-icon"></i>
                                <div class="suggestion-text">
                                    <span class="suggestion-main">${mainText}</span>
                                    <span class="suggestion-sub">${subText}</span>
                                </div>
                            `;

                            li.addEventListener('click', () => {
                                // Use our formatted text which includes the number
                                addressInput.value = mainText;
                                suggestionsList.classList.add('hidden');
                                // Trigger valuation
                                addressInput.dispatchEvent(new Event('blur'));
                            });

                            suggestionsList.appendChild(li);
                        });
                    } else {
                        suggestionsList.classList.add('hidden');
                    }
                } catch (err) {
                    console.error('Address lookup error:', err);
                }
            }, 300);
        });

        // Auto-fetch property valuation when address is entered
        addressInput.addEventListener('blur', async () => {
            const address = addressInput.value.trim();
            if (address) {
                const priceInput = document.getElementById('asset-manual-price');
                priceInput.value = 'Estimating...';
                priceInput.disabled = true;

                console.log('Fetching valuation for:', address);
                const valuation = await fetchPropertyValuation(address);
                console.log('Valuation result:', valuation);

                if (valuation) {
                    priceInput.value = Math.round(valuation);
                    priceInput.disabled = false;
                    priceInput.placeholder = `Avg from ${Math.round(valuation).toLocaleString()} sales`;
                    console.log('Auto-filled price:', valuation);
                } else {
                    priceInput.value = '';
                    priceInput.disabled = false;
                    priceInput.placeholder = 'Enter price manually';
                    console.log('Could not estimate - manual entry required');
                }
            }
        });

        renderAssets();
        populateAssetDropdown('crypto'); // Default
        await updatePrices();
        // Update prices every 15 seconds for real-time feel
        setInterval(updatePrices, 15000);
    }

    // Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTab = btn.dataset.tab;
            renderAssets();
        });
    });

    // Settings Logic
    settingsBtn.addEventListener('click', () => {
        // Switch to Settings Tab
        navBtns.forEach(b => b.classList.remove('active'));
        // Find the settings nav button
        const settingsNavBtn = document.querySelector('.nav-btn[data-view="settings"]');
        if (settingsNavBtn) settingsNavBtn.classList.add('active');

        views.forEach(v => v.classList.remove('active'));
        document.getElementById('settings-view').classList.add('active');
        currentView = 'settings';
    });

    // Close Settings Button removed

    currencyRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            currency = e.target.value;
            localStorage.setItem('currency', currency);
            renderAssets();
        });
    });

    // Bottom Navigation Logic
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const viewName = btn.dataset.view;

            // Update UI
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            views.forEach(v => v.classList.remove('active'));
            document.getElementById(`${viewName}-view`).classList.add('active');

            currentView = viewName;

            if (currentView === 'growth') {
                renderGrowthTab();
            }
        });
    });

    // Format Currency Helper
    function formatCurrency(value) {
        const symbol = currency === 'USD' ? '$' : '£';
        return symbol + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Populate Dropdown
    function populateAssetDropdown(type) {
        assetSymbolSelect.innerHTML = '';
        const list = type === 'crypto' ? SUPPORTED_CRYPTO : SUPPORTED_STOCKS;

        list.forEach(item => {
            const option = document.createElement('option');
            option.value = item.symbol;
            option.textContent = `${item.symbol} - ${item.name}`;
            assetSymbolSelect.appendChild(option);
        });
    }

    // Handle Type Change
    typeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const type = e.target.value;

            // Get form elements
            const selectGroup = document.getElementById('asset-select-group');
            const addressGroup = document.getElementById('asset-address-group');
            const quantityGroup = document.getElementById('asset-quantity-group');
            const priceGroup = document.getElementById('asset-manual-price-group');
            const bankGroup = document.getElementById('asset-bank-group');
            const goldGroup = document.getElementById('asset-gold-group');
            const symbolSelect = document.getElementById('asset-symbol');
            const addressInput = document.getElementById('asset-address');
            const priceInput = document.getElementById('asset-manual-price');
            const amountInput = document.getElementById('asset-amount');
            const bankSelect = document.getElementById('asset-bank');
            const goldWeightInput = document.getElementById('asset-gold-weight');

            if (type === 'crypto' || type === 'stock') {
                populateAssetDropdown(type);
                selectGroup.style.display = 'block';
                addressGroup.style.display = 'none';
                quantityGroup.style.display = 'block';
                priceGroup.style.display = 'none';
                bankGroup.style.display = 'none';
                goldGroup.style.display = 'none';

                // Manage required and disabled attributes
                symbolSelect.required = true;
                symbolSelect.disabled = false;
                addressInput.required = false;
                priceInput.required = false;
                amountInput.required = true;
                bankSelect.required = false;
                goldWeightInput.required = false;
            } else if (type === 'property') {
                selectGroup.style.display = 'none';
                addressGroup.style.display = 'block';
                quantityGroup.style.display = 'none';
                priceGroup.style.display = 'block';
                bankGroup.style.display = 'none';
                goldGroup.style.display = 'none';

                // Manage required and disabled attributes
                symbolSelect.required = false;
                symbolSelect.disabled = true;
                addressInput.required = true;
                priceInput.required = true;
                amountInput.required = false;
                bankSelect.required = false;
                goldWeightInput.required = false;
            } else if (type === 'cash') {
                // Cash: show bank selector and amount
                selectGroup.style.display = 'none';
                addressGroup.style.display = 'none';
                quantityGroup.style.display = 'block';
                priceGroup.style.display = 'none';
                bankGroup.style.display = 'block';
                goldGroup.style.display = 'none';

                // Populate banks
                bankSelect.innerHTML = '<option value="">Select a bank...</option>';
                UK_BANKS.forEach(bank => {
                    const option = document.createElement('option');
                    option.value = bank;
                    option.textContent = bank;
                    bankSelect.appendChild(option);
                });

                // Manage required attributes
                symbolSelect.required = false;
                symbolSelect.disabled = true;
                addressInput.required = false;
                priceInput.required = false;
                amountInput.required = true;
                bankSelect.required = true;
                goldWeightInput.required = false;
            } else if (type === 'gold') {
                // Gold: show weight selector
                selectGroup.style.display = 'none';
                addressGroup.style.display = 'none';
                quantityGroup.style.display = 'none';
                priceGroup.style.display = 'none';
                bankGroup.style.display = 'none';
                goldGroup.style.display = 'block';

                // Manage required attributes
                symbolSelect.required = false;
                symbolSelect.disabled = true;
                addressInput.required = false;
                priceInput.required = false;
                amountInput.required = false;
                bankSelect.required = false;
                goldWeightInput.required = true;
            } else {
                // For other
                selectGroup.style.display = 'none';
                addressGroup.style.display = 'none';
                quantityGroup.style.display = 'block';
                priceGroup.style.display = 'block';
                bankGroup.style.display = 'none';
                goldGroup.style.display = 'none';

                // Manage required and disabled attributes
                symbolSelect.required = false;
                symbolSelect.disabled = true;
                addressInput.required = false;
                priceInput.required = true;
                amountInput.required = true;
                bankSelect.required = false;
                goldWeightInput.required = false;
            }
        });
    });

    // Fetch Property Valuation using UK Land Registry Price Paid Data
    async function fetchPropertyValuation(address) {
        try {
            // Extract postcode from address (basic extraction)
            const postcodeMatch = address.match(/[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}/i);

            if (!postcodeMatch) {
                console.log('No valid UK postcode found in address');
                return null;
            }

            const postcode = postcodeMatch[0].toUpperCase().replace(/\s/g, '');
            console.log('Extracted postcode:', postcode);

            // UK Land Registry Price Paid Data API (free, no auth required)
            // Get recent sales in the postcode area
            const apiUrl = `https://landregistry.data.gov.uk/data/ppi/transaction-record.json?postcode=${encodeURIComponent(postcode)}&_limit=10`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                console.error('Land Registry API error:', response.status);
                return null;
            }

            const data = await response.json();

            if (!data.items || data.items.length === 0) {
                console.log('No sold prices found for this postcode');
                return null;
            }

            // Calculate average from recent sales
            const prices = data.items.map(item => item.pricePaid).filter(price => price > 0);

            if (prices.length === 0) return null;

            const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
            console.log(`Found ${prices.length} recent sales, average: £${averagePrice.toLocaleString()}`);

            return averagePrice;

        } catch (error) {
            console.error('Property valuation error:', error);
            return null;
        }
    }

    // Update Total Balance
    function updateTotalBalance() {
        const grandTotal = assets.reduce((sum, a) => sum + (a.amount * (a.currentPrice || 0)), 0);
        totalBalanceEl.setAttribute('data-value', grandTotal);
        animateValue(totalBalanceEl, parseFloat(totalBalanceEl.getAttribute('data-prev') || 0), grandTotal, 1000);
        totalBalanceEl.setAttribute('data-prev', grandTotal);
    }

    // Render Asset List
    function renderAssets() {
        assetsContainer.innerHTML = '';

        if (assets.length === 0) {
            assetsContainer.innerHTML = `
            <div class="empty-state">
                <p>No assets yet. Tap + to add.</p>
            </div>
        `;
            totalBalanceEl.textContent = '$0.00';
            return;
        }

        let totalBalance = 0;

        const filteredAssets = currentTab === 'all' ? assets : assets.filter(a => a.type === currentTab);

        if (filteredAssets.length === 0 && assets.length > 0) {
            assetsContainer.innerHTML = `
            <div class="empty-state">
                <p>No ${currentTab} assets found.</p>
            </div>
        `;
            // Calculate total balance anyway
            const total = assets.reduce((sum, a) => sum + (a.amount * (a.currentPrice || 0)), 0);
            animateValue(totalBalanceEl, parseFloat(totalBalanceEl.getAttribute('data-value')) || 0, total, 1000);
            return;
        }

        filteredAssets.forEach((asset) => {
            // Find original index for delete
            const originalIndex = assets.indexOf(asset);

            const value = asset.amount * (asset.currentPrice || 0);
            totalBalance += value;

            // Find metadata for image
            let iconHTML;
            if (asset.type === 'crypto') {
                const cryptoInfo = SUPPORTED_CRYPTO.find(c => c.symbol === asset.symbol);
                iconHTML = cryptoInfo?.image
                    ? `<img src="${cryptoInfo.image}" alt="${asset.symbol}" onerror="this.parentElement.innerHTML='${asset.symbol.charAt(0)}'">`
                    : asset.symbol.charAt(0);
            } else if (asset.type === 'stock') {
                const stockInfo = SUPPORTED_STOCKS.find(s => s.symbol === asset.symbol);
                iconHTML = stockInfo?.image
                    ? `<img src="${stockInfo.image}" alt="${asset.symbol}" onerror="this.parentElement.innerHTML='${asset.symbol.charAt(0)}'">`
                    : asset.symbol.charAt(0);
            } else if (asset.type === 'property') {
                iconHTML = '🏠';
            } else if (asset.type === 'cash') {
                // Bank icon - use bank emoji or first letter
                const bankEmojis = {
                    'Barclays': '🏦',
                    'HSBC': '🏦',
                    'Lloyds Bank': '🐴',
                    'NatWest': '🏦',
                    'Santander UK': '🔴',
                    'Monzo': '🌈',
                    'Revolut': '💜',
                    'Starling Bank': '⭐',
                    'Chase UK': '💙'
                };
                iconHTML = bankEmojis[asset.symbol] || '💰';
            } else if (asset.type === 'gold') {
                iconHTML = '🥇';
            } else {
                iconHTML = asset.symbol?.charAt(0) || '📊';
            }
            // Create Wrapper for Swipe
            const wrapper = document.createElement('div');
            wrapper.className = 'asset-wrapper';

            // Delete Background
            const deleteBg = document.createElement('div');
            deleteBg.className = 'asset-delete-bg';
            deleteBg.innerHTML = '<i class="ph ph-trash"></i>';
            deleteBg.onclick = () => {
                if (confirm(`Delete ${asset.symbol}?`)) deleteAsset(originalIndex);
            };
            wrapper.appendChild(deleteBg);

            // Generate Sparkline SVG
            let sparklineSvg = '';
            if (asset.sparkline && asset.sparkline.length > 0) {
                const isUp = asset.sparkline[asset.sparkline.length - 1] >= asset.sparkline[0];
                const color = isUp ? '#30D158' : '#FF453A';
                const path = generateSparklinePath(asset.sparkline);
                sparklineSvg = `
                <svg viewBox="0 0 100 50" preserveAspectRatio="none">
                    <path d="${path}" stroke="${color}" />
                </svg>
            `;
            }

            // Asset Item
            const item = document.createElement('div');
            item.className = 'asset-item';
            item.style.cursor = 'pointer';

            // Click handler to edit asset
            item.addEventListener('click', (e) => {
                // Don't open edit if clicking delete button
                if (e.target.closest('.delete-btn-desktop')) {
                    return;
                }
                openEditModal(originalIndex);
            });

            // Display name - use address for property, symbol for others
            const displayName = asset.type === 'property' ? (asset.address || asset.symbol) : asset.symbol;
            const displayType = asset.type.charAt(0).toUpperCase() + asset.type.slice(1);

            item.innerHTML = `
            <div class="asset-info">
                <div class="asset-icon ${!iconHTML.includes('<img') ? 'placeholder' : ''}">
                    ${iconHTML}
                </div>
                <div class="asset-details">
                    <h4>${displayName}</h4>
                    <p>${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</p>
                </div>
            </div>
            <div class="asset-graph">
                ${sparklineSvg}
            </div>
            <div class="asset-values">
                <span class="value">${formatCurrency(value)}</span>
                <span class="amount">${asset.amount} × ${formatCurrency(asset.currentPrice || 0)}</span>
            </div>
            <button class="delete-btn-desktop" data-index="${originalIndex}" data-symbol="${asset.symbol}">
                Delete
            </button>
        `;

            // Swipe Logic
            let startX = 0;
            let currentX = 0;
            const threshold = -80; // Delete button width

            item.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                item.style.transition = 'none';
            }, { passive: true });

            item.addEventListener('touchmove', (e) => {
                currentX = e.touches[0].clientX - startX;
                if (currentX < 0 && currentX > -100) { // Only swipe left
                    item.style.transform = `translateX(${currentX}px)`;
                }
            }, { passive: true });

            item.addEventListener('touchend', () => {
                item.style.transition = 'transform 0.2s ease-out';
                if (currentX < -60) {
                    item.style.transform = `translateX(${threshold}px)`;
                    if (currentX < -150) {
                        if (confirm(`Delete ${asset.symbol}?`)) {
                            deleteAsset(originalIndex);
                        } else {
                            item.style.transform = 'translateX(0)';
                        }
                    }
                } else {
                    item.style.transform = 'translateX(0)';
                }
                currentX = 0;
            });

            // Don't add a click handler to reset swipe - it conflicts with delete button

            // Attach delete button handler (no confirmation)
            const deleteBtn = item.querySelector('.delete-btn-desktop');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    const idx = parseInt(deleteBtn.dataset.index);
                    deleteAsset(idx);
                }, true);
            }

            wrapper.appendChild(item);
            assetsContainer.appendChild(wrapper);
        });

        // Calculate total balance of ALL assets for the header, not just filtered
        const grandTotal = assets.reduce((sum, a) => sum + (a.amount * (a.currentPrice || 0)), 0);
        totalBalanceEl.setAttribute('data-value', grandTotal);
        animateValue(totalBalanceEl, parseFloat(totalBalanceEl.getAttribute('data-prev') || 0), grandTotal, 1000);
        totalBalanceEl.setAttribute('data-prev', grandTotal);
    }

    // Generate SVG Path for Sparkline
    function generateSparklinePath(data) {
        if (!data || data.length === 0) return '';
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;

        // Normalize to 0-100 width, 0-50 height
        // Invert Y because SVG 0 is top
        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 50 - ((val - min) / range) * 50;
            return `${x},${y}`;
        });

        return `M ${points.join(' L ')}`;
    }

    // Update Prices
    async function updatePrices() {
        const cryptoAssets = assets.filter(a => a.type === 'crypto');

        if (cryptoAssets.length > 0) {
            try {
                // Fetch each crypto price from Coinbase
                const pricePromises = cryptoAssets.map(async (asset) => {
                    const pair = `${asset.symbol}-${currency}`;
                    try {
                        const response = await fetch(`${COINBASE_API}/${pair}/spot`);
                        const data = await response.json();
                        if (data && data.data && data.data.amount) {
                            return {
                                symbol: asset.symbol,
                                price: parseFloat(data.data.amount)
                            };
                        }
                    } catch (err) {
                        console.error(`Error fetching ${asset.symbol}:`, err);
                    }
                    return null;
                });

                const prices = await Promise.all(pricePromises);
                const priceMap = {};
                prices.forEach(p => {
                    if (p) priceMap[p.symbol] = p.price;
                });

                assets = assets.map(asset => {
                    if (asset.type === 'crypto' && priceMap[asset.symbol]) {
                        // Generate sparkline if missing
                        let sparkline = asset.sparkline || [];
                        if (sparkline.length === 0) {
                            // Initialize with current price
                            let last = priceMap[asset.symbol];
                            for (let i = 0; i < 20; i++) {
                                last = last * (1 + (Math.random() * 0.1 - 0.05));
                                sparkline.push(last);
                            }
                        } else {
                            // Update sparkline with new price
                            sparkline.shift();
                            sparkline.push(priceMap[asset.symbol]);
                        }

                        return {
                            ...asset,
                            currentPrice: priceMap[asset.symbol],
                            sparkline: sparkline
                        };
                    }
                    return asset;
                });
            } catch (error) {
                console.error('Error fetching crypto prices:', error);
            }
        }

        assets = assets.map(asset => {
            if (asset.type === 'stock') {
                let price = MOCK_STOCK_PRICES[asset.symbol] || 100;
                price = price * (1 + (Math.random() * 0.02 - 0.01));

                // Generate fake sparkline if missing or update it
                let sparkline = asset.sparkline || [];
                if (sparkline.length === 0) {
                    // Generate 20 random points
                    let last = price;
                    for (let i = 0; i < 20; i++) {
                        last = last * (1 + (Math.random() * 0.1 - 0.05));
                        sparkline.push(last);
                    }
                } else {
                    // Shift and add new price
                    sparkline.shift();
                    sparkline.push(price);
                }

                return { ...asset, currentPrice: price, sparkline };
            }
            return asset;
        });

        saveAssets();
        renderAssets();
    }

    function getCoinId(symbol) {
        const found = SUPPORTED_CRYPTO.find(c => c.symbol === symbol);
        return found ? found.id : symbol.toLowerCase();
    }

    // Add Asset Logic
    addBtn.addEventListener('click', () => {
        console.log('Add Button Clicked');

        // Open modal first to ensure feedback
        addModal.classList.remove('hidden');
        setTimeout(() => addModal.classList.add('visible'), 10);

        // Pre-select the type based on current tab
        try {
            if (currentTab !== 'all') {
                const radioToSelect = document.querySelector(`input[name="type"][value="${currentTab}"]`);
                if (radioToSelect) {
                    radioToSelect.checked = true;
                    // Trigger the change event to update form fields
                    radioToSelect.dispatchEvent(new Event('change'));
                }
            }
        } catch (err) {
            console.error('Error updating form state:', err);
        }
    });

    closeModalBtn.addEventListener('click', closeModal);



    function closeModal() {
        addModal.classList.remove('visible');
        setTimeout(() => addModal.classList.add('hidden'), 300);
    }

    // Form Submission
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('[ADD ASSET] Form submitted');

        try {
            const typeRadio = document.querySelector('input[name="type"]:checked');
            if (!typeRadio) throw new Error('No asset type selected');

            const type = typeRadio.value;
            console.log('[ADD ASSET] Type:', type);

            let symbol, amount, currentPrice = 0, sparkline = [], address;

            if (type === 'property') {
                address = document.getElementById('asset-address').value.trim();
                if (!address) {
                    alert('Please enter a property address');
                    return;
                }
                amount = 1;
                currentPrice = parseFloat(document.getElementById('asset-manual-price').value);
                if (!currentPrice || currentPrice === 0) {
                    alert('Please wait for property valuation or enter a price manually.');
                    return;
                }
                symbol = address.substring(0, 20);
                let last = currentPrice;
                for (let i = 0; i < 20; i++) {
                    last = last * (1 + (Math.random() * 0.05 - 0.025));
                    sparkline.push(last);
                }
            } else if (type === 'crypto' || type === 'stock') {
                symbol = document.getElementById('asset-symbol').value;
                amount = parseFloat(document.getElementById('asset-amount').value);

                if (!symbol || !amount || amount <= 0) {
                    alert('Please select an asset and enter a valid amount');
                    return;
                }

                try {
                    if (type === 'crypto') {
                        const pair = `${symbol}-${currency}`;
                        console.log('[ADD ASSET] Fetching price for:', pair);
                        const response = await fetch(`${COINBASE_API}/${pair}/spot`);
                        if (!response.ok) throw new Error(`API Error: ${response.status}`);
                        const data = await response.json();
                        currentPrice = parseFloat(data.data.amount);
                        console.log('[ADD ASSET] Price fetched:', currentPrice);
                    } else {
                        currentPrice = Math.random() * 500 + 50;
                    }

                    let last = currentPrice;
                    for (let i = 0; i < 20; i++) {
                        last = last * (1 + (Math.random() * 0.1 - 0.05));
                        sparkline.push(last);
                    }
                } catch (err) {
                    console.error('Price fetch error:', err);
                    alert('Could not fetch price. Please try again or check your connection.');
                    return;
                }
            } else if (type === 'cash') {
                const bank = document.getElementById('asset-bank').value;
                if (!bank) {
                    alert('Please select a bank');
                    return;
                }
                symbol = bank;
                amount = parseFloat(document.getElementById('asset-amount').value);
                if (!amount || amount <= 0) {
                    alert('Please enter a valid amount');
                    return;
                }
                currentPrice = 1;
                sparkline = Array(20).fill(amount);
            } else if (type === 'gold') {
                const weight = parseFloat(document.getElementById('asset-gold-weight').value);
                const unit = document.getElementById('asset-gold-unit').value;

                if (!weight || weight <= 0) {
                    alert('Please enter a valid weight');
                    return;
                }

                const weightInGrams = unit === 'kg' ? weight * 1000 : weight;
                const pricePerGram = currency === 'USD' ? 65 : 50;

                currentPrice = pricePerGram;
                amount = weightInGrams;
                symbol = `Gold (${weight} ${unit})`;

                let last = currentPrice * amount;
                for (let i = 0; i < 20; i++) {
                    last = last * (1 + (Math.random() * 0.04 - 0.02));
                    sparkline.push(last);
                }
            } else {
                symbol = document.getElementById('asset-manual-name').value.trim() || type.toUpperCase();
                amount = parseFloat(document.getElementById('asset-amount').value);
                currentPrice = parseFloat(document.getElementById('asset-manual-price').value) || 0;

                if (!amount || amount <= 0 || !currentPrice || currentPrice <= 0) {
                    alert('Please enter valid amount and price');
                    return;
                }

                let last = currentPrice * amount;
                for (let i = 0; i < 20; i++) {
                    last = last * (1 + (Math.random() * 0.05 - 0.025));
                    sparkline.push(last);
                }
            }

            const assetData = { type, symbol, amount, currentPrice, sparkline };
            if (address) assetData.address = address;

            console.log('[ADD ASSET] Creating asset data:', assetData);

            if (!Array.isArray(assets)) {
                console.error('[ADD ASSET] Assets is not an array, resetting');
                assets = [];
            }

            assets.push(assetData);
            console.log('[ADD ASSET] Assets array now has', assets.length, 'items');

            // Save to both local and cloud
            saveAssets();
            console.log('[ADD ASSET] Saved assets');

            updateTotalBalance();
            console.log('[ADD ASSET] Updated total balance');
            renderAssets();
            console.log('[ADD ASSET] Rendered assets');

            addForm.reset();
            // Reset visibility states
            document.getElementById('asset-select-group').style.display = 'block';
            document.getElementById('asset-address-group').style.display = 'none';
            document.getElementById('asset-quantity-group').style.display = 'block';
            document.getElementById('asset-manual-price-group').style.display = 'none';
            document.getElementById('asset-bank-group').style.display = 'none';
            document.getElementById('asset-gold-group').style.display = 'none';

            console.log('[ADD ASSET] Closing modal...');
            closeModal();
            console.log('[ADD ASSET] Done!');
        } catch (error) {
            console.error('[ADD ASSET] Critical error:', error);
            alert('An error occurred while adding the asset: ' + error.message);
        }
    });



    function deleteAsset(index) {
        assets.splice(index, 1);
        saveAssets();
        updateTotalBalance();
        renderAssets();
    }

    function saveAssets() {
        localStorage.setItem('assets', JSON.stringify(assets));
        if (user && isFirebaseInitialized) {
            saveAssetsToCloud();
        }
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = start + (end - start) * progress;
            const symbol = currency === 'USD' ? '$' : '£';
            obj.innerHTML = symbol + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function calculatePortfolioGrowth(years) {
        const growthRates = {
            crypto: 0.75, // 75% annual (volatile)
            stock: 0.08, // 8% annual
            property: 0.04, // 4% annual
            cash: 0.0, // 0% (loses to inflation)
            gold: 0.03, // 3% annual
            other: 0.02 // 2% annual
        };

        let projectedTotal = 0;
        const projectedAssets = assets.map(asset => {
            const rate = growthRates[asset.type] || 0.02;
            const currentValue = asset.amount * asset.currentPrice;
            const projectedValue = currentValue * Math.pow(1 + rate, years);
            projectedTotal += projectedValue;

            return {
                ...asset,
                projectedValue,
                growthRate: rate * 100
            };
        });

        return { projectedTotal, projectedAssets };
    }

    function renderPieChart() {
        const ctx = document.getElementById('allocation-chart').getContext('2d');

        // Aggregate by type
        const typeValues = {};
        assets.forEach(asset => {
            const value = asset.amount * asset.currentPrice;
            typeValues[asset.type] = (typeValues[asset.type] || 0) + value;
        });

        const labels = Object.keys(typeValues).map(type =>
            type.charAt(0).toUpperCase() + type.slice(1)
        );
        const data = Object.values(typeValues);
        const colors = {
            crypto: '#0052FF',
            stock: '#05B169',
            property: '#F5B740',
            cash: '#8A8FA3',
            gold: '#DF5F67',
            other: '#1E3A8A'
        };
        const backgroundColors = Object.keys(typeValues).map(type => colors[type] || '#8A8FA3');

        // Destroy previous chart if exists
        if (allocationChart) {
            allocationChart.destroy();
        }

        allocationChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: backgroundColors,
                    borderWidth: 2,
                    borderColor: '#15171A'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#FFFFFF',
                            font: {
                                size: 12
                            },
                            padding: 12
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = formatCurrency(context.parsed);
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    function generateAIInsights() {
        const total = assets.reduce((sum, a) => sum + (a.amount * a.currentPrice), 0);
        const { projectedTotal, projectedAssets } = calculatePortfolioGrowth(projectionYears);

        // Calculate diversification
        const typeCount = new Set(assets.map(a => a.type)).size;
        const diversificationScore = Math.min(typeCount / 6 * 100, 100);

        // Find best and worst performers
        const sortedByGrowth = projectedAssets.sort((a, b) => b.growthRate - a.growthRate);
        const bestPerformer = sortedByGrowth[0];
        const worstPerformer = sortedByGrowth[sortedByGrowth.length - 1];

        // Calculate total growth
        const totalGrowth = ((projectedTotal - total) / total * 100).toFixed(1);

        const insights = [];

        // Insight 1: Portfolio projection
        insights.push({
            icon: '📈',
            title: 'Portfolio Growth',
            text: `Your portfolio is projected to grow from ${formatCurrency(total)} to ${formatCurrency(projectedTotal)} in ${projectionYears} years, representing a ${totalGrowth}% increase.`
        });

        // Insight 2: Best performer
        if (bestPerformer) {
            insights.push({
                icon: '🚀',
                title: 'Top Performer',
                text: `${bestPerformer.symbol} is expected to grow at ${bestPerformer.growthRate.toFixed(1)}% annually, reaching ${formatCurrency(bestPerformer.projectedValue)} in ${projectionYears} years.`
            });
        }

        // Insight 3: Diversification
        insights.push({
            icon: '🎯',
            title: 'Diversification Score',
            text: `Your portfolio has a diversification score of ${diversificationScore.toFixed(0)}%. ${diversificationScore >= 70 ? 'Great job spreading your investments across multiple asset types!' :
                diversificationScore >= 40 ? 'Consider adding more asset types to reduce risk.' :
                    'Your portfolio is heavily concentrated. Diversifying could reduce risk.'
                }`
        });

        // Insight 4: Risk warning
        const cryptoWeight = assets.filter(a => a.type === 'crypto')
            .reduce((sum, a) => sum + (a.amount * a.currentPrice), 0) / total * 100;

        if (cryptoWeight > 50) {
            insights.push({
                icon: '⚠️',
                title: 'High Risk Alert',
                text: `${cryptoWeight.toFixed(0)}% of your portfolio is in cryptocurrency, which is highly volatile. Consider balancing with more stable assets like property or stocks.`
            });
        }

        // Insight 5: Recommendation
        const cashWeight = assets.filter(a => a.type === 'cash')
            .reduce((sum, a) => sum + (a.amount * a.currentPrice), 0) / total * 100;

        if (cashWeight > 20) {
            insights.push({
                icon: '💡',
                title: 'AI Recommendation',
                text: `You have ${cashWeight.toFixed(0)}% in cash, which doesn't grow with inflation. Consider investing some of it into growth assets like stocks or index funds for better long-term returns.`
            });
        } else if (typeCount < 3) {
            insights.push({
                icon: '💡',
                title: 'AI Recommendation',
                text: `Consider diversifying into ${6 - typeCount} more asset types such as ${!assets.some(a => a.type === 'property') ? 'property, ' : ''
                    }${!assets.some(a => a.type === 'gold') ? 'gold, ' : ''
                    }or ${!assets.some(a => a.type === 'stock') ? 'stocks ' : 'other investments'} to reduce portfolio risk.`
            });
        }

        return insights;
    }

    function renderGrowthTab() {
        if (assets.length === 0) {
            document.getElementById('ai-insights').innerHTML = `
            <div class="insight-card">
                <p>Add some assets to see AI-powered growth projections and insights!</p>
            </div>
        `;
            return;
        }

        // Render pie chart
        renderPieChart();

        // Update projection
        updateProjection();

        // Render AI insights
        const insights = generateAIInsights();
        const insightsHTML = insights.map(insight => `
        <div class="insight-card">
            <h4>${insight.icon} ${insight.title}</h4>
            <p>${insight.text}</p>
        </div>
    `).join('');

        document.getElementById('ai-insights').innerHTML = insightsHTML;
    }

    function updateProjection() {
        const { projectedTotal } = calculatePortfolioGrowth(projectionYears);
        document.getElementById('projected-balance').textContent = formatCurrency(projectedTotal);
        document.getElementById('projection-years-display').textContent = projectionYears;
    }

    // Projection slider handler
    document.getElementById('years-slider')?.addEventListener('input', (e) => {
        projectionYears = parseInt(e.target.value);
        updateProjection();

        // Update insights with new projection
        if (currentView === 'growth' && assets.length > 0) {
            const insights = generateAIInsights();
            const insightsHTML = insights.map(insight => `
            <div class="insight-card">
                <h4>${insight.icon} ${insight.title}</h4>
                <p>${insight.text}</p>
            </div>
        `).join('');
            document.getElementById('ai-insights').innerHTML = insightsHTML;
        }
    });

    // Settings currency handlers
    document.querySelectorAll('input[name="currency"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            currency = e.target.value;
            localStorage.setItem('currency', currency);

            // Update all displays
            updateTotalBalance();
            renderAssets();
            if (currentView === 'growth') {
                renderGrowthTab();
            }
        });
    });


    // ===== EDIT ASSET FUNCTIONALITY =====
    let editingAssetIndex = null;

    function openEditModal(index) {
        editingAssetIndex = index;
        const asset = assets[index];

        document.getElementById('edit-asset-name').value = asset.symbol;
        document.getElementById('edit-asset-price').value = asset.currentPrice;
        document.getElementById('edit-asset-amount').value = asset.amount;

        document.getElementById('edit-modal').classList.remove('hidden');
        document.getElementById('edit-modal').classList.add('visible');
    }

    // Edit form submission
    const editForm = document.getElementById('edit-form');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (editingAssetIndex === null) return;

        const newPrice = parseFloat(document.getElementById('edit-asset-price').value);
        const newAmount = parseFloat(document.getElementById('edit-asset-amount').value);

        if (!newPrice || !newAmount || newPrice <= 0 || newAmount <= 0) {
            alert('Please enter valid price and amount');
            return;
        }

        // Update asset
        assets[editingAssetIndex].currentPrice = newPrice;
        assets[editingAssetIndex].amount = newAmount;

        // Save and refresh
        saveAssets();

        // Close modal
        document.getElementById('edit-modal').classList.add('hidden');
        document.getElementById('edit-modal').classList.remove('visible');

        // Refresh displays
        updateTotalBalance();
        renderAssets();

        editingAssetIndex = null;
    });


    // Toast Notification System
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        // Style the toast
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '8px',
            background: type === 'error' ? '#EF4444' : '#10B981',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: '9999',
            transition: 'opacity 0.3s ease',
            opacity: '0'
        });

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => toast.style.opacity = '1');

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Cloud Sync Functions
    async function saveAssetsToCloud() {
        if (!user || !db) return;
        updateSyncStatus('pending');
        try {
            console.log('Saving to cloud...', assets.length, 'assets');

            // Create a timeout promise
            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Connection timed out')), 10000)
            );

            // Race the save against the timeout
            await Promise.race([
                db.collection('users').doc(user.uid).set({
                    assets: assets,
                    currency: currency,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true }),
                timeout
            ]);

            console.log('Saved assets to cloud');
            updateSyncStatus('success');

            if (isOfflineMode) {
                isOfflineMode = false;
                showToast('Connection restored: Synced', 'success');
            }
        } catch (error) {
            console.error('Error saving to cloud:', error);
            updateSyncStatus('error');

            const isNetworkError = error.code === 'unavailable' || error.message.includes('offline') || error.message === 'Connection timed out';

            if (isNetworkError) {
                if (!isOfflineMode) {
                    // First time entering offline mode
                    isOfflineMode = true;
                    showToast('Offline Mode: Saving locally', 'info');
                } else {
                    // Already offline, stay silent
                    console.log('Still offline, suppressing toast');
                }

                // Retry logic (Slower retry when offline to save battery)
                console.log('Scheduling background retry...');
                setTimeout(() => saveAssetsToCloud(), 60000); // Retry every 60 seconds
            } else {
                // Real error (permission, etc) - always show
                showToast('Cloud Save Error: ' + error.message, 'error');
            }
        }
    }

    // Sync Status Helper
    function updateSyncStatus(status) {
        const icon = document.getElementById('sync-status');
        if (!icon) return;

        icon.classList.remove('hidden', 'success', 'pending', 'error');
        icon.classList.add(status);

        const i = icon.querySelector('i');
        if (status === 'success') {
            i.className = 'ph ph-cloud-check';
            updateLastSyncedText('Just now');
        } else if (status === 'pending') {
            i.className = 'ph ph-arrows-clockwise';
            updateLastSyncedText('Syncing...');
        } else if (status === 'error') {
            i.className = 'ph ph-cloud-slash';
            updateLastSyncedText('Offline');
        }
    }

    function updateLastSyncedText(text) {
        let el = document.getElementById('last-synced-text');
        if (!el) {
            const container = document.querySelector('.settings-section'); // Add to first section
            if (container) {
                el = document.createElement('p');
                el.id = 'last-synced-text';
                el.style.color = '#8A8FA3';
                el.style.fontSize = '12px';
                el.style.marginTop = '8px';
                container.appendChild(el);
            }
        }
        if (el) el.textContent = `Last Synced: ${text}`;
    }

    async function loadAssetsFromCloud() {
        if (!user || !db) return;
        try {
            console.log('Loading from cloud...');
            const doc = await db.collection('users').doc(user.uid).get();
            if (doc.exists) {
                const data = doc.data();
                if (data.assets && Array.isArray(data.assets)) {
                    assets = data.assets;
                    console.log('Loaded assets from cloud:', assets.length);
                    localStorage.setItem('assets', JSON.stringify(assets));

                    // Update UI immediately
                    updateTotalBalance();
                    renderAssets();
                    if (currentView === 'growth') renderGrowthTab();

                    showToast(`Loaded ${assets.length} assets for user ${user.email}`, 'success');
                }
                if (data.currency) {
                    currency = data.currency;
                    localStorage.setItem('currency', currency);
                    const radio = document.querySelector(`input[name="currency"][value="${currency}"]`);
                    if (radio) radio.checked = true;
                }
            } else {
                console.log('No cloud data found');
                // Only sync local to cloud if we actually have local data
                // This prevents overwriting cloud data with empty local state on a new device
                if (assets.length > 0) {
                    console.log('Syncing local assets to new cloud document');
                    saveAssetsToCloud();
                } else {
                    showToast(`No data found for ${user.email}`, 'info');
                }
            }
        } catch (error) {
            console.error('Error loading from cloud:', error);

            // Retry logic for offline errors
            if (error.message.includes('offline')) {
                console.log('Attempting to reset connection and retry...');
                try {
                    await db.disableNetwork();
                    await db.enableNetwork();
                    // Wait 1 second
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const doc = await db.collection('users').doc(user.uid).get();
                    if (doc.exists) {
                        const data = doc.data();
                        if (data.assets) {
                            assets = data.assets;
                            localStorage.setItem('assets', JSON.stringify(assets));
                            updateTotalBalance();
                            renderAssets();
                            if (currentView === 'growth') renderGrowthTab();
                            showToast('Assets loaded after retry', 'success');
                            return;
                        }
                    }
                } catch (retryError) {
                    console.error('Retry failed:', retryError);
                }
            }

            showToast('Offline Mode: Changes saved locally', 'info');

            // Fallback to local storage
            console.log('Falling back to local storage...');
            loadAssetsFromLocal();
            renderAssets();
            updateTotalBalance();
            if (currentView === 'growth') renderGrowthTab();
        }
    }

    // ... (rest of the file)

    // Property Valuation Service (HM Land Registry)
    async function fetchPropertyValuation(address) {
        // ... (existing implementation)
        console.log('Fetching valuation for:', address);

        try {
            // 1. Extract Postcode
            const postcodeMatch = address.match(/([A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})$/i);
            if (!postcodeMatch) throw new Error('No postcode found');

            const postcode = postcodeMatch[0].toUpperCase();
            const houseNumberMatch = address.match(/^(\d+)/);
            const houseNumber = houseNumberMatch ? houseNumberMatch[1] : null;

            console.log(`Querying Land Registry for ${postcode}, House: ${houseNumber}`);

            // 2. Query Land Registry API
            // MUST use HTTPS to avoid Mixed Content errors on Vercel
            const apiUrl = `https://landregistry.data.gov.uk/data/ppi/transaction-record.json?propertyAddress.postcode=${encodeURIComponent(postcode)}`;
            const response = await fetch(apiUrl);

            if (!response.ok) throw new Error('Land Registry API failed');

            const data = await response.json();
            const transactions = data.result.items;

            if (!transactions || transactions.length === 0) throw new Error('No transaction data found');

            // 3. Find relevant transactions
            let relevantSales = [];
            let exactMatchFound = false;

            if (houseNumber) {
                // Try to find exact property sales
                const propertySales = transactions.filter(t => t.propertyAddress.paon === houseNumber);
                if (propertySales.length > 0) {
                    relevantSales = propertySales;
                    exactMatchFound = true;
                    console.log('Found exact property history:', relevantSales.length, 'records');
                }
            }

            // If no exact match, use all sales in postcode as baseline
            if (relevantSales.length === 0) {
                relevantSales = transactions;
                console.log('Using postcode average from', relevantSales.length, 'records');
            }

            // 4. Sort by date (newest first)
            relevantSales.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));

            // 5. Calculate Estimate
            // We take the most recent sale and apply a simple annual growth factor (e.g., 3%)
            const latestSale = relevantSales[0];
            const price = latestSale.pricePaid;
            const date = new Date(latestSale.transactionDate);
            const now = new Date();

            // Calculate years since sale
            const yearsSinceSale = (now - date) / (1000 * 60 * 60 * 24 * 365);

            // Apply 3.5% annual growth (conservative UK average)
            const estimatedValue = price * Math.pow(1.035, yearsSinceSale);

            console.log(`Base: £${price} on ${date.toISOString().split('T')[0]}, Growth: ${yearsSinceSale.toFixed(1)} years @ 3.5%`);

            return Math.round(estimatedValue / 1000) * 1000; // Round to nearest 1k

        } catch (err) {
            console.warn('Valuation API error, falling back to estimate:', err);

            // Fallback: Deterministic Estimate
            let hash = 0;
            for (let i = 0; i < address.length; i++) {
                hash = ((hash << 5) - hash) + address.charCodeAt(i);
                hash |= 0;
            }
            const basePrice = 250000 + (Math.abs(hash) % 1000000);
            return Math.round(basePrice / 5000) * 5000;
        }
    }

});
