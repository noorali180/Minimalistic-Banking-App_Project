'use strict'

const account1 = {
    owner: 'Noor Ali',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    movementsDates: [
        "2021-11-14T21:15:17.178Z",
        "2021-11-15T07:22:02.383Z",
        "2021-11-16T09:15:04.904Z",
        "2021-11-17T10:17:24.185Z",
        "2021-11-18T14:11:59.604Z",
        "2021-11-19T17:01:17.194Z",
        "2021-11-20T23:36:17.929Z",
        "2021-11-21T10:51:36.790Z",
    ],
    currency: "USD",
    interestRate: 1.2,
    pin: 1111,
    locale: 'en-US',
};
  
const account2 = {
    owner: 'Mumtaz Ali',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    movementsDates: [
        "2019-11-18T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2020-04-01T10:17:24.185Z",
        "2020-05-08T14:11:59.604Z",
        "2020-07-26T17:01:17.194Z",
        "2020-07-28T23:36:17.929Z",
        "2020-08-01T10:51:36.790Z",
    ],
    currency: "USD",
    interestRate: 1.5,
    pin: 2222,
    locale: 'en-US',

};
  
const account3 = {
    owner: 'Gulam Mustafa',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    movementsDates: [
        "2019-11-18T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2020-04-01T10:17:24.185Z",
        "2020-05-08T14:11:59.604Z",
        "2020-07-26T17:01:17.194Z",
        "2020-07-28T23:36:17.929Z",
        "2020-08-01T10:51:36.790Z",
    ],
    currency: "USD",
    interestRate: 0.7,
    pin: 3333,
    locale: 'en-US',

};
  
const account4 = {
    owner: 'Zubair Ali',
    movements: [430, 1000, 700, 50, 90],
    movementsDates: [
        "2019-11-18T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2020-04-01T10:17:24.185Z",
        "2020-05-08T14:11:59.604Z",
        "2020-07-26T17:01:17.194Z",
        "2020-07-28T23:36:17.929Z",
        "2020-08-01T10:51:36.790Z",
    ],
    currency: "USD",
    interestRate: 1,
    pin: 4444,
    locale: 'en-US',

};
  
const accounts = [account1, account2, account3, account4];

// Selecting Elements...

// LABELS.
const welcome = document.querySelector('.welcome');

const balanceLabel = document.querySelector('.balance_value');
const balanceDate = document.querySelector('.date');

const summaryIn = document.querySelector('.summary_value-in');
const summaryOut = document.querySelector('.summary_value-out');
const summaryInterest = document.querySelector('.summary_value-interest');

const labelTimer = document.querySelector('.timer');

// CONTAINERS
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

// INPUTS
const loginUserInput = document.querySelector('.login_input-user');
const loginPinInput = document.querySelector('.login_input-pin');
  
const transferUserInput = document.querySelector('.form_input-to');
const transferAmountInput = document.querySelector('.form_input-transfer');

const loanAmountInput = document.querySelector('.form_input-loan');

const closeUserInput = document.querySelector('.form_input-user');
const closePinInput = document.querySelector('.form_input-pin');

// BUTTONS
const loginBtn = document.querySelector('.login_btn');
const transferBtn = document.querySelector('.form_btn-transfer');
const loanBtn = document.querySelector('.form_btn-loan');
const closeBtn = document.querySelector('.form_btn-close');

const sortBtn = document.querySelector('.btn_sort');

// x----x----x----x----x----x----x----x----x-----x-----x-----x-----x-----x-----x-----x-----x

let currentAccount = account1, timer;


// FUNCTIONALITIES>>>

// function to internationalize numbers...
const intlNumber = function(locale, number){
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
    }).format(number);
}

// function to internationalize movements dates...
const intlMovDate = function(locale, date){
    const now = new Date();
    const movDate = new Date(date);
    const daysPassed = Math.round((now - movDate)/ 1000 / 60 / 60 / 24);

    if(daysPassed === 0) return 'Today';
    else if(daysPassed === 1) return 'Yesterday';
    else if(daysPassed === 2) return '2 days ago';
    else if(daysPassed === 3) return '3 days ago';
    else return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        weekday: 'long',
    }).format(movDate);
}

// function to internationalize main date...
const intlDate = function (locale) {
    const now = new Date();

    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        weekday: 'short',
    }).format(now);
}

// LOGOUT TIMER
const startLogoutTimer = function(){
    let time = 300; // 5 minutes...
    
    const rapid = function(){
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);

        labelTimer.textContent = `${min}:${sec}`;

        if(time === 0) {
            clearInterval(timer);
            welcome.textContent = 'Log in to get started';
            containerApp.style.opacity = 0;
        }

        time--;
    }

    rapid();
    const timer = setInterval(rapid, 1000);

    return timer;
}

// function to create usernames...
const createUserNames = function (accounts) {
    accounts.forEach((acc) => acc.userName = acc.owner.split(' ')
    .map((word) => word[0])
    .join('')
    .toLowerCase());
}
createUserNames(accounts);

// function to calculate and display total balance...
const displayBalance = function (currentAccount){
    const totalBalance = currentAccount.movements.reduce((accum, mov) => accum + mov, 0);
    const intlBalance = intlNumber(currentAccount.locale, totalBalance);
    currentAccount.balance = totalBalance;

    balanceLabel.textContent = intlBalance;
}

// function to display movements...
const displayMovements = function (currentAccount, sort = false){
    containerMovements.innerHTML = '';
    const movs = sort ? currentAccount.movements.slice().sort((a, b) => a - b) : currentAccount.movements;

    movs.forEach((mov, i) => {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const html = `
            <div class="movements_row">
              <div class="movements_type movements_type-${type}">${i + 1} ${type}</div>
              <div class="movements_date">${sort ? '' : intlMovDate(currentAccount.locale, currentAccount.movementsDates[i])}</div>
              <div class="movements_value">${intlNumber(currentAccount.locale, mov)}</div>
            </div>
        `;

        containerMovements.insertAdjacentHTML("afterbegin", html);
    })
}

// function to calculate and display summary...
const displaySummary = function(currentAccount){
    const sumIn = intlNumber(currentAccount.locale, currentAccount.movements.filter(mov => mov > 0).reduce((accum, dep) => accum + dep, 0));
    summaryIn.textContent = sumIn;

    const sumOut = intlNumber(currentAccount.locale, Math.abs(currentAccount.movements.filter(mov => mov < 0).reduce((accum, wit) => accum + wit, 0)));
    summaryOut.textContent = sumOut;

    const sumInterest = intlNumber(currentAccount.locale, currentAccount.movements.filter(mov => mov > 0)
                                    .map(deposit => (deposit * currentAccount.interestRate) / 100)
                                    .reduce((accum, deposit) => accum + deposit, 0)
                                    );
    summaryInterest.textContent = sumInterest;
}

// function to update complete app UI...
const updateUI = function (currentAccount){
    displayBalance(currentAccount);
    displayMovements(currentAccount);
    displaySummary(currentAccount);
}

// LOGIN FUNCTIONALITY...
loginBtn.addEventListener('click', function (e){
    e.preventDefault();

    const user = loginUserInput.value;
    const pin = +loginPinInput.value;

    currentAccount = accounts.find(acc => user === acc.userName);

    if(currentAccount?.pin === pin){
        welcome.textContent = `Good Day, ${currentAccount.owner.split(' ')[0]} 😊`;
        balanceDate.textContent = intlDate(currentAccount.locale);
        updateUI(currentAccount);

        if(timer) clearInterval(timer);
        timer = startLogoutTimer();

        containerApp.style.opacity = 1;
        loginUserInput.value = loginPinInput.value = '';
        loginUserInput.blur();
        loginPinInput.blur();
    }
    else{
        alert('User not FOUND or INVALID Pin.');
        loginUserInput.value = loginPinInput.value = '';
        loginUserInput.blur();
        loginPinInput.blur();
    }
});

// TRANSFER FUNCTIONALITY...
transferBtn.addEventListener('click', function(e){
    e.preventDefault();

    const user = transferUserInput.value;
    const amount = +transferAmountInput.value;

    const userAccount = accounts.find(acc => acc.userName === user);

    if(user === '' || amount === '') return;

    if(!userAccount) alert('Sorry User not FOUND.');
    else if(amount <= 0) alert('Enter a valid amount to transfer.');
    else if(amount > currentAccount.balance) alert('Don\'t have enough balance.');
    else if(user === currentAccount.userName) alert('Cannot transfer money to own account!');
    else{
        userAccount.movements.push(amount);
        userAccount.movementsDates.push(new Date().toISOString());

        currentAccount.movements.push(-amount);
        currentAccount.movementsDates.push(new Date().toISOString());

        updateUI(currentAccount);
    }

    transferAmountInput.value = transferUserInput.value = '';
    transferUserInput.blur();
    transferAmountInput.blur();
});

// LOAN FUNCITONALITY
loanBtn.addEventListener('click', function(e){
    e.preventDefault();

    const loanAmount = +loanAmountInput.value;

    if(loanAmount === 0) return;

    if(loanAmount < 0) alert('Please insert a valid amount.');
    if(currentAccount.movements.some(mov => mov >= loanAmount * 0.1)) alert('Not Eligible for LOAN.');
    else{
        setTimeout(() => {
            currentAccount.movements.push(loanAmount);
            currentAccount.movementsDates.push(new Date().toISOString());
            updateUI(currentAccount);
        }, 5000);
    }

    loanAmountInput.value = '';
    loanAmountInput.blur();
})

// CLOSE FUNCTIONALITY
closeBtn.addEventListener('click', function(e){
    e.preventDefault();

    const closeUser = closeUserInput.value;
    const closePin = +closePinInput.value;

    const closeAccIndex = accounts.findIndex(acc => acc.userName === closeUser);

    if(closeUser === '' || closePin === '') return;
    
    if(closeUser !== currentAccount.userName) alert('Sorry You are not LOGGED IN.');
    else if(closePin !== currentAccount.pin) alert('Sorry incorrect PIN');
    else{
        accounts.splice(closeAccIndex, 1);
        containerApp.style.opacity = 0;
        welcome.textContent = 'Log in to get started!';

        if(timer) clearInterval(timer);
    }

    closeUserInput.value = closePinInput.value = '';
    closeUserInput.blur();
    closePinInput.blur();
});

// SORT FUNCTIONALITY
let sort = true;
sortBtn.addEventListener('click', function(e){
    e.preventDefault();

    displayMovements(currentAccount, sort);
    sort = !sort;
});
