// Main JavaScript file for the Expense Tracker application

document.addEventListener('DOMContentLoaded', () => {
    window.transactions = getTransactions(); // storage.js ka function
    renderTransactions();
    updateSummary();
    renderExpenseChart();

    const form = document.getElementById('transaction-form');
    form.addEventListener('submit', handleFormSubmit);

    const filter = document.getElementById('filter-category');
    if (filter) {
        filter.addEventListener('change', renderTransactions);
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

function handleFormSubmit(e) {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    if (!date || !description || !amount || !category) {
        showError('Please fill all fields.');
        return;
    }

    // Amount sign set karo
    let finalAmount = amount;
    if (category !== "Income") {
        finalAmount = -Math.abs(amount); // Expense ko negative banao
    }

    const transaction = {
        id: Date.now(),
        date,
        description,
        amount: finalAmount,
        category
    };

    addTransaction(transaction);
    clearForm();
    hideError();
    renderTransactions();
    updateSummary();
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

    // Save button add karein
    if (!document.getElementById('save-profile-btn')) {
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.className = 'profile-btn';
        saveBtn.id = 'save-profile-btn';
        saveBtn.style.marginTop = '12px';
        saveBtn.onclick = saveProfileEdit;
        document.querySelector('.profile-modal-card').insertBefore(saveBtn, document.querySelector('.profile-btn.logout'));
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