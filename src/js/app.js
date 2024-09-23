let timer;
let timeLeft = 25 * 60; // 25 minutos em segundos
let isRunning = false;
let isPaused = false;

// Função para atualizar a exibição do temporizador
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('time').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Função para iniciar o temporizador
function startTimer() {
  if (!isRunning) {
    isRunning = true;
    isPaused = false;
    document.getElementById('pause-btn').style.display = 'inline';
    document.getElementById('reset-btn').style.display = 'inline'; // Mostra o botão de reset
    document.getElementById('start-btn').style.display = 'none';

    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
        chrome.storage.local.set({ timeLeft, isRunning: true });
      } else {
        clearInterval(timer);
        alert("Tempo do Pomodoro concluído!");
        resetTimer();
      }
    }, 1000);
  }
}

// Função para pausar o temporizador
function pauseTimer() {
  if (isRunning) {
    clearInterval(timer);
    isRunning = false;
    isPaused = true;
    chrome.storage.local.set({ timeLeft, isRunning: false, isPaused: true });
    document.getElementById('pause-btn').style.display = 'none';
    document.getElementById('start-btn').textContent = 'Continuar';
    document.getElementById('start-btn').style.display = 'inline';
  }
}

// Função para resetar o temporizador para 25 minutos
function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isPaused = false;
  timeLeft = 25 * 60;
  updateTimerDisplay();
  chrome.storage.local.set({ timeLeft, isRunning: false, isPaused: false });
  document.getElementById('start-btn').textContent = 'Iniciar';
  document.getElementById('start-btn').style.display = 'inline';
  document.getElementById('pause-btn').style.display = 'none';
  document.getElementById('reset-btn').style.display = 'none'; // Esconde o botão de reset após o reset
}

// Carrega o estado do temporizador do armazenamento local
chrome.storage.local.get(['timeLeft', 'isRunning', 'isPaused'], (result) => {
  if (result.timeLeft) {
    timeLeft = result.timeLeft;
  }
  updateTimerDisplay();

  if (result.isRunning) {
    startTimer();
  } else if (result.isPaused) {
    isPaused = true;
    document.getElementById('start-btn').textContent = 'Continuar';
    document.getElementById('start-btn').style.display = 'inline';
    document.getElementById('pause-btn').style.display = 'none';
    document.getElementById('reset-btn').style.display = 'inline'; // Mostra o botão de reset se pausado
  }
});

// Adiciona os eventos aos botões
document.getElementById('start-btn').addEventListener('click', startTimer);
document.getElementById('pause-btn').addEventListener('click', pauseTimer);
document.getElementById('reset-btn').addEventListener('click', resetTimer); // Adiciona o evento ao botão de reset

updateTimerDisplay();
