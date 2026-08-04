// supabase-auth.js - Mobile Optimized with On-Screen Logging
let supabase;

// 1. INITIALIZATION & DEBUG GUARDS
console.log("Supabase Auth Script loaded successfully!");

try {
    const supabaseUrl = 'https://qzubciaxoknwddcfuzuj.supabase.co';
    const supabaseKey = 'sb_publishable_hsbz2xf7ODsb36VNb-gJ-w__22nrY4r';
    
    // Ensure the CDN script loaded properly before trying to use it
    if (!window.supabase) {
        throw new Error("Supabase CDN not found. Check the <head> of your index.html");
    }
    
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    console.log("Supabase client initialized.");
} catch (e) {
    console.error("Setup Error:", e);
    // Fallback if the DOM isn't ready yet
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => {
            document.getElementById('authMessage').innerText = "Setup Error: " + e.message;
        });
    } else {
        document.getElementById('authMessage').innerText = "Setup Error: " + e.message;
    }
}

// 2. Sign Up Logic
async function handleSignup() {
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const authMessage = document.getElementById('authMessage');

    if (!email || !password) {
        authMessage.style.color = "#ff3b3b";
        authMessage.innerText = "Please enter email and password.";
        return;
    }

    authMessage.style.color = "white";
    authMessage.innerText = "Creating account...";

    try {
        if (!supabase) throw new Error("Supabase failed to initialize.");
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        authMessage.style.color = "#25D366";
        authMessage.innerText = "Success! Check your email for confirmation.";
    } catch (err) {
        authMessage.style.color = "#ff3b3b";
        authMessage.innerText = "Error: " + err.message;
        console.error("Signup Error:", err);
    }
}

// 3. Login Logic
async function handleLogin() {
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const authMessage = document.getElementById('authMessage');

    if (!email || !password) {
        authMessage.style.color = "#ff3b3b";
        authMessage.innerText = "Please enter email and password.";
        return;
    }

    authMessage.style.color = "white";
    authMessage.innerText = "Signing in...";

    try {
        if (!supabase) throw new Error("Supabase failed to initialize.");
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        authMessage.innerText = "";
        checkSession();
    } catch (err) {
        authMessage.style.color = "#ff3b3b";
        authMessage.innerText = "Error: " + err.message;
        console.error("Login Error:", err);
    }
}

// 4. Logout Logic
async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    checkSession();
}

// 5. Session Checker
async function checkSession() {
    if (!supabase) return;
    
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const authFormContainer = document.getElementById('authFormContainer');
        const authProfileContainer = document.getElementById('authProfileContainer');
        const profileEmail = document.getElementById('profileEmail');
        const userStateDisplay = document.getElementById('userStateDisplay');

        if (session) {
            authFormContainer.style.display = "none";
            authProfileContainer.style.display = "block";
            profileEmail.innerText = `Logged in as: ${session.user.email}`;
            userStateDisplay.innerText = "Active Session";
            userStateDisplay.style.color = "#25D366";
        } else {
            authFormContainer.style.display = "block";
            authProfileContainer.style.display = "none";
            userStateDisplay.innerText = "Not logged in";
            userStateDisplay.style.color = "#ff3b3b";
        }
    } catch (e) {
        console.error("Session Check Error:", e);
    }
}

// 6. Safe Startup
// Ensures checkSession runs whether the script loads early or late
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', checkSession);
} else {
    checkSession();
}
