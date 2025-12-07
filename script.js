// Tab Navigation
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabId = this.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        this.classList.add('active');
        document.getElementById(tabId).classList.add('active');
        
        if (tabId === 'transactions') {
            displayTransactions();
        }
    });
});

// Calculate loan
function calculateLoan(amount, rate, years) {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    
    let monthly;
    if (monthlyRate === 0) {
        monthly = amount / months;
    } else {
        monthly = amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                  (Math.pow(1 + monthlyRate, months) - 1);
    }
    
    const total = monthly * months;
    const interest = total - amount;
    
    return {
        monthly: monthly.toFixed(2),
        total: total.toFixed(2),
        interest: interest.toFixed(2)
    };
}

// Format currency
function formatCurrency(value) {
    return '$' + parseFloat(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Calculator form
document.getElementById('calcForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('amount').value);
    const rate = parseFloat(document.getElementById('rate').value);
    const years = parseFloat(document.getElementById('years').value);
    
    const result = calculateLoan(amount, rate, years);
    
    document.getElementById('monthlyPayment').textContent = formatCurrency(result.monthly);
    document.getElementById('totalPayment').textContent = formatCurrency(result.total);
    document.getElementById('totalInterest').textContent = formatCurrency(result.interest);
    
    document.getElementById('result').classList.add('show');
});

// Add transaction form
document.getElementById('addForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('addAmount').value);
    const rate = parseFloat(document.getElementById('addRate').value);
    const years = parseFloat(document.getElementById('addYears').value);
    const loanType = document.getElementById('loanType').value;
    const notes = document.getElementById('notes').value;
    
    const result = calculateLoan(amount, rate, years);
    
    const transaction = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        amount: amount,
        rate: rate,
        years: years,
        loanType: loanType,
        monthly: result.monthly,
        total: result.total,
        interest: result.interest,
        notes: notes
    };
    
    let transactions = JSON.parse(localStorage.getItem('loans')) || [];
    transactions.push(transaction);
    localStorage.setItem('loans', JSON.stringify(transactions));
    
    this.reset();
    alert('Transaksioni u ruajt me sukses!');
});

// Display transactions
function displayTransactions() {
    const transactions = JSON.parse(localStorage.getItem('loans')) || [];
    const list = document.getElementById('transactionList');
    
    if (transactions.length === 0) {
        list.innerHTML = '<div class="no-data">Asnjë transaksion për momentin. Shtoni kredinë tuaj të parë!</div>';
        return;
    }
    
    list.innerHTML = transactions.reverse().map(t => `
        <div class="transaction-item">
            <div class="transaction-header">
                <div>
                    <span class="transaction-type">${t.loanType}</span>
                    <div class="transaction-date">${t.date}</div>
                </div>
                <button class="btn btn-delete" onclick="deleteTransaction(${t.id})">Fshi</button>
            </div>
            <div class="transaction-details">
                <div class="detail-item">
                    <span class="detail-label">Vlera e kredisë</span>
                    <span class="detail-value">${formatCurrency(t.amount)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Norma e Interesit</span>
                    <span class="detail-value">${t.rate}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Periudha e Kredisë</span>
                    <span class="detail-value">${t.years} vite</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Pagesat Mujore</span>
                    <span class="detail-value">${formatCurrency(t.monthly)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Pagesa Totale</span>
                    <span class="detail-value">${formatCurrency(t.total)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Shuma e Interesit</span>
                    <span class="detail-value">${formatCurrency(t.interest)}</span>
                </div>
            </div>
            ${t.notes ? `<div class="transaction-notes"><strong>Notes:</strong> ${t.notes}</div>` : ''}
        </div>
    `).join('');
}

// Delete transaction
function deleteTransaction(id) {
    if (confirm('A jeni të sigurt që doni të fshini këtë transaksion?')) {
        let transactions = JSON.parse(localStorage.getItem('loans')) || [];
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('loans', JSON.stringify(transactions));
        displayTransactions();
    }
}

// Clear all transactions
function clearAll() {
    if (confirm('A jeni i sigurt që doni të fshini të gjitha transaksionet? Veprimi është i përhershëm.')) {
        localStorage.removeItem('loans');
        displayTransactions();
    }
}

// Initialize
displayTransactions();