// transactions.js

// Make transactions array global
window.transactions = window.transactions || [];

let dateFilter = { from: null, to: null };

function addTransaction(transaction) {
    window.transactions.push(transaction);
    saveTransactions(window.transactions);
    renderTransactions();
    updateSummary();
    renderExpenseChart();
}

function applyDateFilter() {
    dateFilter.from = document.getElementById('filter-from').value;
    dateFilter.to = document.getElementById('filter-to').value;
    renderTransactions();
}

function clearDateFilter() {
    dateFilter = { from: null, to: null };
    document.getElementById('filter-from').value = '';
    document.getElementById('filter-to').value = '';
    renderTransactions();
}

// Update renderTransactions to use dateFilter
function renderTransactions() {
    const list = document.getElementById('transaction-list');
    const filter = document.getElementById('filter-category');
    const selectedCategory = filter ? filter.value : "All";
    list.innerHTML = '';

    let filteredTransactions = window.transactions;

    // Category filter
    if (selectedCategory && selectedCategory !== "All") {
        filteredTransactions = filteredTransactions.filter(tx => tx.category === selectedCategory);
    }

    // Date filter
    if (dateFilter.from) {
        filteredTransactions = filteredTransactions.filter(tx => tx.date >= dateFilter.from);
    }
    if (dateFilter.to) {
        filteredTransactions = filteredTransactions.filter(tx => tx.date <= dateFilter.to);
    }

    filteredTransactions.forEach(tx => {
        const li = document.createElement('li');
        li.className = tx.amount >= 0 ? 'income' : 'expense';
        li.innerHTML = `
            <span>${tx.date}</span>
            <span>${tx.description}</span>
            <span>${tx.category}</span>
            <span>${tx.amount >= 0 ? '+' : '-'}₹${Math.abs(tx.amount)}</span>
            <button onclick="editTransaction(${tx.id})" class="edit-btn">Edit</button>
            <button onclick="deleteTransaction(${tx.id})" class="delete-btn">Delete</button>
        `;
        list.appendChild(li);
    });
}

function clearForm() {
    document.getElementById('transaction-form').reset();
}

function showError(msg) {
    document.getElementById('error-message').textContent = msg;
}

function hideError() {
    document.getElementById('error-message').textContent = '';
}

function deleteTransaction(id) {
    window.transactions = window.transactions.filter(transaction => transaction.id !== id);
    saveTransactions(window.transactions);
    renderTransactions();
    updateSummary();
    renderExpenseChart();
}

function getTransactions() {
    return window.transactions;
}

function categorizeTransaction(id, category) {
    const transaction = window.transactions.find(transaction => transaction.id === id);
    if (transaction) {
        transaction.category = category;
        saveTransactions(window.transactions);
        renderTransactions();
        updateSummary();
    }
}

function editTransaction(id) {
    const transaction = window.transactions.find(tx => tx.id === id);
    if (transaction) {
        document.getElementById('date').value = transaction.date;
        document.getElementById('description').value = transaction.description;
        document.getElementById('amount').value = Math.abs(transaction.amount);
        document.getElementById('category').value = transaction.category;

        window.transactions = window.transactions.filter(tx => tx.id !== id);
        saveTransactions(window.transactions);
        renderTransactions();
        updateSummary();
        renderExpenseChart();
    }
}

function exportTransactions() {
    const dataStr = JSON.stringify(window.transactions, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = "transactions.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importTransactions(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                window.transactions = imported;
                saveTransactions(window.transactions);
                renderTransactions();
                updateSummary();
                renderExpenseChart && renderExpenseChart();
                alert("Transactions imported successfully!");
            } else {
                alert("Invalid file format.");
            }
        } catch {
            alert("Invalid file content.");
        }
    };
    reader.readAsText(file);
}
