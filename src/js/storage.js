// This file handles local storage functionalities for the Expense Tracker application.

function saveTransactions(transactions) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        localStorage.setItem('transactions_' + currentUser, JSON.stringify(transactions));
    }
}

function getTransactions() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const transactions = localStorage.getItem('transactions_' + currentUser);
        return transactions ? JSON.parse(transactions) : [];
    }
    return [];
}