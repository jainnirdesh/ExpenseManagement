function showRegister() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'block';
}

function showLogin() {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('auth-section').style.display = 'block';
}

function registerUser() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const occupation = document.getElementById('register-occupation').value;

    if (!username || !password || !email || !phone) {
        alert('Please fill all required fields');
        return;
    }
    const userObj = { username, password, email, phone, occupation };
    localStorage.setItem('expenseUser', JSON.stringify(userObj));
    alert('Registration successful! Please login.');
    showLogin();
}

function loginUser() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const user = JSON.parse(localStorage.getItem('expenseUser'));
    if (user && user.username === username && user.password === password) {
        localStorage.setItem('expenseLoggedIn', 'true');
        localStorage.setItem('currentUser', username);
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('register-section').style.display = 'none';
        document.querySelector('.container').style.display = 'block';
    } else {
        alert('Invalid credentials');
    }
}

function logoutUser() {
    localStorage.removeItem('expenseLoggedIn');
    localStorage.removeItem('currentUser');
    location.reload();
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function showProfileModal() {
    const user = JSON.parse(localStorage.getItem('expenseUser'));
    if (user) {
        document.getElementById('profile-modal-details').innerHTML = `
            <div style="font-size:1.2rem;font-weight:600;margin-bottom:8px;">${user.username}</div>
            <div>Email: <b>${user.email || '-'}</b></div>
            <div>Phone: <b>${user.phone || '-'}</b></div>
            <div>Occupation: <b>${user.occupation || '-'}</b></div>
        `;
    }
    document.getElementById('profile-modal').style.display = 'flex';
    if (document.getElementById('edit-profile-btn')) document.getElementById('edit-profile-btn').style.display = 'inline-block';
    if (document.getElementById('save-profile-btn')) document.getElementById('save-profile-btn').remove();
}

function closeProfileModal() {
    document.getElementById('profile-modal').style.display = 'none';
}

function enableProfileEdit() {
    const user = JSON.parse(localStorage.getItem('expenseUser'));
    document.getElementById('profile-modal-details').innerHTML = `
        <div style="font-size:1.2rem;font-weight:600;margin-bottom:8px;">
            <input id="edit-username" value="${user.username}" disabled style="font-weight:600; text-align:center; border:none; background:#f4f7fa; border-radius:6px;"/>
        </div>
        <div>Email: <input id="edit-email" value="${user.email || ''}" type="email"></div>
        <div>Phone: <input id="edit-phone" value="${user.phone || ''}" type="text"></div>
        <div>Occupation: <input id="edit-occupation" value="${user.occupation || ''}" type="text"></div>
    `;
    document.getElementById('edit-profile-btn').style.display = 'none';

    // Add Save button safely
    if (!document.getElementById('save-profile-btn')) {
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.className = 'profile-btn';
        saveBtn.id = 'save-profile-btn';
        saveBtn.style.marginTop = '12px';
        saveBtn.onclick = saveProfileEdit;
        document.querySelector('.profile-modal-card').appendChild(saveBtn);
    }
}

function saveProfileEdit() {
    const username = document.getElementById('edit-username').value;
    const email = document.getElementById('edit-email').value;
    const phone = document.getElementById('edit-phone').value;
    const occupation = document.getElementById('edit-occupation').value;

    if (!email || !phone) {
        alert('Email and Phone are required!');
        return;
    }

    // Update localStorage
    const userObj = { username, email, phone, occupation, password: JSON.parse(localStorage.getItem('expenseUser')).password };
    localStorage.setItem('expenseUser', JSON.stringify(userObj));

    // Remove Save button and show Edit button again
    document.getElementById('save-profile-btn').remove();
    document.getElementById('edit-profile-btn').style.display = 'inline-block';

    // Refresh profile details
    showProfileModal();
}

// On page load, check login
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('expenseLoggedIn') === 'true') {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('register-section').style.display = 'none';
        document.querySelector('.container').style.display = 'block';
    } else {
        document.querySelector('.container').style.display = 'none';
        document.getElementById('auth-section').style.display = 'block';
    }
    const user = JSON.parse(localStorage.getItem('expenseUser'));
    if (user) {
        document.getElementById('profile-details').innerHTML = `
            <strong>${user.username}</strong><br>
            Email: ${user.email}<br>
            Phone: ${user.phone}<br>
            Occupation: ${user.occupation || ''}<br>
        `;
    }
});