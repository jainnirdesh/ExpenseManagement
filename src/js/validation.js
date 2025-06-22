function validateTransactionInput(amount, description) {
    const amountPattern = /^\d+(\.\d{1,2})?$/; // Validates positive numbers with up to two decimal places
    const descriptionPattern = /^.{1,50}$/; // Validates description length (1 to 50 characters)

    if (!amountPattern.test(amount)) {
        return { valid: false, message: "Amount must be a positive number with up to two decimal places." };
    }

    if (!descriptionPattern.test(description)) {
        return { valid: false, message: "Description must be between 1 and 50 characters." };
    }

    return { valid: true, message: "" };
}

function displayErrorMessage(message) {
    const errorElement = document.getElementById("error-message");
    errorElement.textContent = message;
    errorElement.style.display = "block";
}

function clearErrorMessage() {
    const errorElement = document.getElementById("error-message");
    errorElement.textContent = "";
    errorElement.style.display = "none";
}
