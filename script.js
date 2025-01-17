// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const icon = themeToggle.querySelector('i');
        if (body.classList.contains('dark-mode')) {
            icon.classList.replace('ri-sun-line', 'ri-moon-line');
        } else {
            icon.classList.replace('ri-moon-line', 'ri-sun-line');
        }
    });

    // Sample Transaction Data
    const transactions = [
        { id: 1, type: 'expense', category: 'Groceries', amount: 150.75, date: '2024-01-15' },
        { id: 2, type: 'income', category: 'Salary', amount: 3500.00, date: '2024-01-01' },
        { id: 3, type: 'expense', category: 'Utilities', amount: 200.00, date: '2024-01-10' },
        // Add more transactions as needed
    ];

    // Populate Recent Transactions
    const transactionsList = document.querySelector('.transactions-list');
    transactions.forEach(transaction => {
        const transactionElement = createTransactionElement(transaction);
        transactionsList.appendChild(transactionElement);
    });

    // Initialize Charts
    initializeCharts();
});

function createTransactionElement(transaction) {
    const div = document.createElement('div');
    div.className = 'transaction-item';
    div.innerHTML = `
        <div class="transaction-info">
            <span class="transaction-category">${transaction.category}</span>
            <span class="transaction-date">${transaction.date}</span>
        </div>
        <span class="transaction-amount ${transaction.type}">
            ${transaction.type === 'expense' ? '-' : '+'}$${transaction.amount.toFixed(2)}
        </span>
    `;
    return div;
}

function initializeCharts() {
    // Spending Analysis Chart
    const spendingCtx = document.getElementById('spendingChart').getContext('2d');
    new Chart(spendingCtx, {
        type: 'doughnut',
        data: {
            labels: ['Housing', 'Food', 'Transportation', 'Entertainment', 'Utilities'],
            datasets: [{
                data: [35, 25, 15, 15, 10],
                backgroundColor: [
                    '#6c5ce7',
                    '#a8a4e6',
                    '#81ecec',
                    '#74b9ff',
                    '#a3cb38'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Income vs Expenses Chart
    const comparisonCtx = document.getElementById('comparisonChart').getContext('2d');
    new Chart(comparisonCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Income',
                    data: [4500, 4800, 4600, 4900, 5100, 5300],
                    backgroundColor: '#6c5ce7'
                },
                {
                    label: 'Expenses',
                    data: [3200, 3400, 3100, 3500, 3300, 3600],
                    backgroundColor: '#a8a4e6'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add animation to cards on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.glass-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    observer.observe(card);
});

//edit balances
let balance = 2500


function updateFigs(){
    document.getElementById("balance").innerText = balance.toString()

}

setInterval(updateFigs, 10000)
