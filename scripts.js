// В качестве хранения данных выбрал window.sessionStorage,
// т.к. предполагается, что за одним компьютером поочередно работают два пользователя,
// каждый раз уходя они закрывают за собой вкладку или браузер
// и они не хотели бы видеть в следующий раз информацию на данной странице о предыдущем пользователе.
// (настройка "Запуск браузера -> Открывать ранее открытые вкладки" на ПК отключена).
// При каждом новом посещении при открытии вкладки или браузера они не против вновь вводить свои данные.

const button = document.getElementById('btn');
const userName = document.getElementById('name');
const day = document.getElementById('day');
const month = document.getElementById('month');
const form = document.forms[0];
const greeting = document.querySelector('.greeting');
let userInfo = null;
let now = Date.now();
let birthdayDate = null;
const monthsArr = ['январь' , 'февраль' , 'март' , 'апрель' , 'май' , 'июнь' , 'июль' , 'август' , 'сентябрь' , 'октябрь' , 'ноябрь' , 'декабрь'];
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function checkName() {
  if (/[0-9]/.test(userName.value)) {
    userName.classList.add('incorrect');
    button.disabled = true;
  } else {
    userName.classList.remove('incorrect');
    button.disabled = false; 
  } 
}
userName.addEventListener('input', checkName);

function checkDay() {
  let userDay = day.value;
  if (!isFinite(userDay) || userDay.length > 2 || userDay < 1 || userDay > 31) {
    day.classList.add('incorrect');
    button.disabled = true;
  } else {
    day.classList.remove('incorrect'); 
    button.disabled = false;
  }
  checkForValidQtyOfDaysInMonth();
}
day.addEventListener('input', checkDay);

function checkMonth() {
  let userMonth = month.value.toLowerCase();
  if (!monthsArr.includes(userMonth)) {
    month.classList.add('incorrect');
    button.disabled = true;
  } else {
    month.classList.remove('incorrect');
    button.disabled = false;
  }
  checkForValidQtyOfDaysInMonth();
}
month.addEventListener('change', checkMonth);

function checkForValidQtyOfDaysInMonth() {
  let userDay = day.value;
  let userMonth = monthsArr.indexOf(month.value.toLowerCase());
  if (userDay > daysInMonth[userMonth]) {
    day.classList.add('incorrect');
    button.disabled = true;
  } else if (userDay < daysInMonth[userMonth]) {
    day.classList.remove('incorrect');
    button.disabled = false;
  }
}

function setDataToSessionStorage(e) {
  e.preventDefault();
  if ((userName.value.length === 0) ||
      (day.value.length === 0) ||
      (month.value.length === 0) ||
      userName.classList.contains('incorrect') ||
      day.classList.contains('incorrect') ||
      month.classList.contains('incorrect'))
  return;
  const user = {
    name: userName.value,
    day: parseInt(day.value),
    month: month.value.toLowerCase(),
  }
  sessionStorage.setItem('userData', JSON.stringify(user));
  showFormOrGreeting();
  getDataFromSessionStorage();
  userInfo && getTime();
}
button.addEventListener('click', setDataToSessionStorage);

function showFormOrGreeting() {
  if (sessionStorage.getItem('userData')) {
    form.style.opacity = '0';
    greeting.style.opacity = '1';
    greeting.style.zIndex = '1';
  } else {
    form.style.opacity = '1';
    greeting.style.opacity = '0';
    greeting.style.zIndex = '-1';
  }
}

function getDataFromSessionStorage() {
  showFormOrGreeting();
  userInfo = JSON.parse(sessionStorage.getItem('userData'));
}
window.onload = getDataFromSessionStorage();

function getTime() {
  now = new Date();
  let thisYear = now.getFullYear();
  const birthDay = userInfo.day;
  const birthMonth = monthsArr.indexOf(userInfo.month);
  let birthTimestamp = Math.floor(new Date(thisYear, birthMonth, birthDay).getTime() / 1000);
  const nowTimestamp = Math.floor(now.getTime() / 1000);

  // If the birthday has already been this year (we are looking for it in next year)
  if (birthTimestamp < nowTimestamp) {
    birthTimestamp = Math.floor(new Date(thisYear + 1, birthMonth, birthDay).getTime() / 1000);
  }
  const leftTimestampTillBirthDay = birthTimestamp - nowTimestamp;
  // Remaining days until birthday
  let leftDays = Math.floor(leftTimestampTillBirthDay / 86400);
  const months = Math.abs(Math.floor(leftDays / 30));
  const days = Math.abs(leftDays - months * 30);
  const hours = Math.abs(Math.floor((leftTimestampTillBirthDay % 86400) / 3600));
  const mins = Math.abs(Math.floor((leftTimestampTillBirthDay % 3600) / 60));
  const secs = Math.abs(Math.floor(leftTimestampTillBirthDay % 60));
  // Show calculated date
  const greeting = document.querySelector('.greeting');
  let wordMonthsEnding = null;
  let wordDaysEnding = null;
  let wordHoursEnding = null;
  let wordMinsEnding = null;
  let wordSecsEnding = null;

  switch (months) {
    case 1: wordMonthsEnding = '';
      break;
    case 2:
    case 3:
    case 4: wordMonthsEnding = 'a';
      break;
    case 0:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12: wordMonthsEnding = 'ев';
      break; 
  }
  (days === 1 || days === 21 || days === 31) && (wordDaysEnding = 'день');
  (days >= 2 && days <= 4 || days >= 22 && days <= 24) && (wordDaysEnding= 'дня');
  (days >= 5 && days <= 20 || days >= 25 && days <= 30 || days === 0) && (wordDaysEnding = 'дней');
    (hours === 1 || hours === 21) && (wordHoursEnding = '');
    (hours >= 2 && hours <= 4 || hours >= 22 && hours <= 24) && (wordHoursEnding = 'а');
    (hours >= 5 && hours <= 20 || hours === 0) && (wordHoursEnding = 'ов');
      (mins === 1 || mins === 21 || mins === 31 || mins === 41 || mins === 51) && (wordMinsEnding = 'а');
      (mins >= 2 && mins <= 4 || mins >= 22 && mins <= 24 || mins >= 32 && mins <= 34 || mins >= 42 && mins <= 44 || mins >= 52 && mins <= 54) && (wordMinsEnding = 'ы');
      (mins >= 5 && mins <= 20 || mins >= 25 && mins <= 30 || mins >= 35 && mins <= 40 || mins >= 45 && mins <= 50 || mins >= 55 && mins <= 60 || mins === 0) && (wordMinsEnding = '');
        (secs === 1 || secs === 21 || secs === 31 || secs === 41 || secs === 51) && (wordSecsEnding = 'а');
        (secs >= 2 && secs <= 4 || secs >= 22 && secs <= 24 || secs >= 32 && secs <= 34 || secs >= 42 && secs <= 44 || secs >= 52 && secs <= 54) && (wordSecsEnding = 'ы');
        (secs >= 5 && secs <= 20 || secs >= 25 && secs <= 30 || secs >= 35 && secs <= 40 || secs >= 45 && secs <= 50 || secs >= 55 && secs <= 60 || secs === 0) && (wordSecsEnding = '');
        greeting.textContent = `${userInfo.name}, до Вашего дня рождения осталось ${months} месяц${wordMonthsEnding}, ${days} ${wordDaysEnding}, ${hours} час${wordHoursEnding}, ${mins} минут${wordMinsEnding}, ${secs} секунд${wordSecsEnding}`;
  setTimeout(getTime, 1000);
}

window.onload = function draw() {
  userInfo && setTimeout(getTime, 1000);;
}
