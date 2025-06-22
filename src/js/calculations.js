function calculateTotalIncome(transactions) {
    return transactions
        .filter(transaction => transaction.amount > 0)
        .reduce((total, transaction) => total + transaction.amount, 0);
}

function calculateTotalExpenses(transactions) {
    return transactions
        .filter(transaction => transaction.amount < 0)
        .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
}

function calculateNetIncome(transactions) {
    const totalIncome = calculateTotalIncome(transactions);
    const totalExpenses = calculateTotalExpenses(transactions);
    return totalIncome - totalExpenses;
}

function updateSummary() {
    const transactions = window.transactions || [];
    const income = calculateTotalIncome(transactions);
    const expense = calculateTotalExpenses(transactions);
    const net = income - expense;

    document.getElementById('income-amount').textContent = income;
    document.getElementById('expense-amount').textContent = expense;
    document.getElementById('balance-amount').textContent = net;
}

let expenseChart; // Chart instance ko global rakhein

function renderExpenseChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const transactions = window.transactions || [];
    const expenseByCategory = {};

    transactions.forEach(tx => {
        if (tx.amount < 0) {
            expenseByCategory[tx.category] = (expenseByCategory[tx.category] || 0) + Math.abs(tx.amount);
        }
    });

    const categories = Object.keys(expenseByCategory);
    const amounts = Object.values(expenseByCategory);

    // Agar pehle chart bana hua hai toh destroy karo
    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: [
                    '#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#34495e'
                ],
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Expenses by Category'
                }
            }
        }
    });
}