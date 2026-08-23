const config = window.CAFE_FIREBASE_CONFIG;
const configured = config && config.apiKey && !config.apiKey.startsWith('REPLACE_');
let auth;
let db;
let currentUser = null;
const serverTimestamp = () => firebase.firestore.FieldValue.serverTimestamp();

function notify(message) {
    if (typeof window.showNotification === 'function') window.showNotification(message);
    else window.alert(message);
}

function safeText(value) {
    const element = document.createElement('div');
    element.textContent = value || '';
    return element.innerHTML;
}

function syncToGoogleSheets(type, payload) {
    const url = config?.googleSheetsWebAppUrl;
    if (!url || url.includes('REPLACE_')) return;
    fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ type, ...payload })
    }).catch(() => {});
}

async function getCustomerProfile(user) {
    const snapshot = await db.collection('customers').doc(user.uid).get();
    return snapshot.exists() ? snapshot.data() : {};
}

async function refreshAccountPanel() {

    const panel =
        document.getElementById('accountPanel');

    if (!panel || !currentUser) {
        return;
    }


    // ==========================================
    // 1. LOAD CUSTOMER PROFILE
    // ==========================================

    let profile = {};

    try {

        profile =
            await getCustomerProfile(currentUser);

    } catch (error) {

        console.error(
            'Could not load customer profile:',
            error
        );

    }


    // ==========================================
    // 2. LOAD ORDERS FROM GOOGLE SHEETS
    // ==========================================

    let orders = [];

    try {

        orders =
            await loadOrdersFromGoogleSheets();

    } catch (error) {

        console.error(
            'Could not load order history:',
            error
        );

    }


    // ==========================================
    // 3. CUSTOMER NAME
    // ==========================================

    const realName =
        profile.realName ||
        profile.name ||
        currentUser.displayName ||
        'Customer';


    const displayName =
        profile.displayName ||
        currentUser.displayName ||
        realName;


    // ==========================================
    // 4. ACCOUNT PANEL
    // ==========================================

    panel.innerHTML = `

        <div class="account-heading">

            <div>

                <p class="account-eyebrow">
                    Signed in as
                </p>

                <h2>
                    ${safeText(realName)}
                </h2>

                <p>
                    ${safeText(currentUser.email)}
                </p>

            </div>


            <button
                class="account-signout"
                type="button"
                onclick="signOutCustomer()"
            >
                Sign out
            </button>

        </div>


        <form
            id="customerProfileForm"
            class="account-form"
        >

            <label>

                Real name

                <input
                    type="text"
                    value="${safeText(realName)}"
                    readonly
                >

            </label>


            <label>

                Display name

                <input
                    id="customerName"
                    required
                    maxlength="60"
                    value="${safeText(displayName)}"
                >

            </label>


            <label class="account-check">

                <input
                    id="customerOffers"
                    type="checkbox"
                    ${profile.marketingOptIn ? 'checked' : ''}
                >

                Send me offers and café updates

            </label>


            <button
                id="savePreferencesBtn"
                class="account-primary"
                type="submit"
                disabled
            >
                Save preferences
            </button>

        </form>


        <!-- ==================================
             ORDER HISTORY
        =================================== -->

        <div class="order-history">

            <h3>
                Order history
            </h3>

            ${
                orders.length

                    ? `

                        <ul>

                            ${orders.map(order => `

                                <li>

                                    <div>

                                        <strong>
                                            ${safeText(
                                                order.items ||
                                                order.itemName ||
                                                'Order'
                                            )}
                                        </strong>

                                        ${
                                            order.orderId
                                                ? `
                                                    <small>
                                                        Order ID:
                                                        ${safeText(order.orderId)}
                                                    </small>
                                                  `
                                                : ''
                                        }

                                    </div>


                                    <div>

                                        ${
                                            order.total !== undefined
                                                ? `
                                                    <strong>
                                                        ₹${Number(order.total).toFixed(2)}
                                                    </strong>
                                                  `
                                                : ''
                                        }

                                        <span>
                                            ${safeText(
                                                order.status ||
                                                'New'
                                            )}
                                        </span>

                                    </div>

                                </li>

                            `).join('')}

                        </ul>

                    `

                    : `

                        <p>
                            No orders yet. Your future orders
                            will appear here.
                        </p>

                    `
            }

        </div>

    `;


    // ==========================================
    // 5. PROFILE FORM
    // ==========================================

    const form =
        document.getElementById(
            'customerProfileForm'
        );


    const nameInput =
        document.getElementById(
            'customerName'
        );


    const offersInput =
        document.getElementById(
            'customerOffers'
        );


    const saveBtn =
        document.getElementById(
            'savePreferencesBtn'
        );


    if (
        !form ||
        !nameInput ||
        !offersInput ||
        !saveBtn
    ) {
        return;
    }


    // ==========================================
    // 6. ORIGINAL VALUES
    // ==========================================

    const originalName =
        nameInput.value.trim();


    const originalOffers =
        offersInput.checked;


    // ==========================================
    // 7. DETECT CHANGES
    // ==========================================

    function checkForChanges() {

        const nameChanged =
            nameInput.value.trim() !==
            originalName;


        const offersChanged =
            offersInput.checked !==
            originalOffers;


        saveBtn.disabled =
            !(nameChanged || offersChanged);

    }


    nameInput.addEventListener(
        'input',
        checkForChanges
    );


    offersInput.addEventListener(
        'change',
        checkForChanges
    );


    // ==========================================
    // 8. SAVE PREFERENCES
    // ==========================================

    form.addEventListener(
        'submit',
        savePreferences
    );

}

function updateAuthButtons(user) {
    document.querySelectorAll('.auth-trigger').forEach((button) => {
        button.textContent = user ? `Hi, ${(user.displayName || 'there').trim().split(/\s+/)[0]}` : 'Sign in';
        button.classList.toggle('logged-in', Boolean(user));
    });
    document.querySelectorAll('.auth-signout-trigger').forEach((button) => {
        button.hidden = !user;
    });
}

function showAuthView(view) {
    document.querySelectorAll('.auth-view').forEach((section) => section.hidden = section.dataset.authView !== view);
}

async function handleRegister(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.elements.registerName.value.trim();
    const email = form.elements.registerEmail.value.trim();
    const password = form.elements.registerPassword.value;
    try {
        const result = await auth.createUserWithEmailAndPassword(email, password);
        await result.user.updateProfile({ displayName: name });
        await db.collection('customers').doc(result.user.uid).set({
            name,
            email,
            marketingOptIn: form.elements.marketingOptIn.checked,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        syncToGoogleSheets('customer', { customerId: result.user.uid, name, email, marketingOptIn: form.elements.marketingOptIn.checked });
        notify('Account created successfully. Welcome!');
        showAuthView('account');
    } catch (error) {
        notify(error.message.replace('Firebase: ', ''));
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const form = event.currentTarget;
    try {
        await auth.signInWithEmailAndPassword(form.elements.loginEmail.value.trim(), form.elements.loginPassword.value);
        notify('Welcome back!');
        showAuthView('account');
    } catch (error) {
        notify('Could not sign in. Please check your email and password.');
    }
}

async function savePreferences(event) {
    event.preventDefault();

    const name = document.getElementById('customerName').value.trim();
    const marketingOptIn = document.getElementById('customerOffers').checked;
    const saveBtn = document.getElementById('savePreferencesBtn');

    if (!name) return;

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
        const existingProfile = await getCustomerProfile(currentUser);
        const realName = existingProfile.realName || existingProfile.name || currentUser.displayName || name;

        await currentUser.updateProfile({
            displayName: name
        });

        await db.collection('customers').doc(currentUser.uid).set({
            realName: realName,
            displayName: name,
            marketingOptIn: marketingOptIn,
            updatedAt: serverTimestamp()
        }, { merge: true });

        notify('Preferences saved successfully!');

        saveBtn.textContent = 'Saved ✓';

        setTimeout(() => {
            saveBtn.textContent = 'Save preferences';
            saveBtn.disabled = true;
        }, 1500);

    } catch (error) {
        console.error('Could not save preferences:', error);

        notify('Could not save your preferences. Please try again.');

        saveBtn.disabled = false;
        saveBtn.textContent = 'Save preferences';
    }
}

window.openAuthModal = function() {
    const modal = document.getElementById('accountModal');
    if (!configured) {
        notify('Customer accounts will be available after Firebase is configured.');
        return;
    }
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    showAuthView(currentUser ? 'account' : 'login');
    if (currentUser) refreshAccountPanel();
};

window.closeAuthModal = function() {
    const modal = document.getElementById('accountModal');
    modal?.classList.remove('show');
    modal?.setAttribute('aria-hidden', 'true');
};

window.signOutCustomer = async function() {
    await auth.signOut();
    window.closeAuthModal();
    notify('You have signed out.');
};

window.saveCustomerOrder = async function(itemName, price) {
    if (!configured || !currentUser) return;
    const order = { itemName, price, status: 'Order request', createdAt: serverTimestamp() };
    await db.collection('customers').doc(currentUser.uid).collection('orders').add(order);
    syncToGoogleSheets('order', { customerId: currentUser.uid, email: currentUser.email, itemName, price, status: order.status });
};

if (configured) {
    firebase.initializeApp(config);
    auth = firebase.auth();
    db = firebase.firestore();
    auth.onAuthStateChanged(async (user) => {
        currentUser = user;
        window.cafeCurrentUser = () => currentUser;
        updateAuthButtons(user);
        if (user && document.getElementById('accountModal')?.classList.contains('show')) await refreshAccountPanel();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
    document.querySelectorAll('[data-auth-switch]').forEach((button) => button.addEventListener('click', () => showAuthView(button.dataset.authSwitch)));
    document.getElementById('accountModal')?.addEventListener('click', (event) => {
        if (event.target.id === 'accountModal') window.closeAuthModal();
    });
    updateAuthButtons(null);
});
// Make authentication and Firestore available to the cart system
window.cafeAuth = auth;
window.cafeDb = db;
window.cafeCurrentUser = () => currentUser;

async function loadOrdersFromGoogleSheets() {

    const user =
        typeof currentUser !== 'undefined'
            ? currentUser
            : null;

    if (!user) {
        return [];
    }

    const orderUrl =
        config?.googleSheetsOrderWebAppUrl;

    if (!orderUrl) {
        console.error(
            'Order Google Sheets URL is missing.'
        );

        return [];
    }

    try {

        const url =
            orderUrl +
            '?customerId=' +
            encodeURIComponent(user.uid);

        const response =
            await fetch(url);

        const data =
            await response.json();

        if (!data.success) {

            console.error(
                'Could not load orders:',
                data.error
            );

            return [];

        }

        return data.orders || [];

    } catch (error) {

        console.error(
            'Could not load orders from Google Sheets:',
            error
        );

        return [];

    }

}