const questions = [
    {
        question: "Qual meu jogo preferido?",
        options: ["Super Mario 64", "Valorant", "Chrono Trigger", "Grand Chase"],
        correct: 2
    },
    {
        question: "Qual o anime que eu mais gostei de assistir?",
        options: ["Sword Art Online", "Bleach", "Dragon Ball Z", "One Piece"],
        correct: 0
    },
    {
        question: "Qual o gênero de música que eu mais gosto?",
        options: ["Pop", "Rap", "Eletrônica", "Rock"],
        correct: 3
    },
    {
        question: "Qual o filme que eu mais assisti?",
        options: ["Interstellar", "Forrest Gump", "Vingadores: Guerra Infinita", "Questão de Tempo"],
        correct: 3
    },
    {
        question: "Qual a banda que eu mais ouvi?",
        options: ["Oficina G3", "AC/DC", "Switchfoot", "Queen"],
        correct: 2
    }
];

// Embaralha as perguntas
const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

let currentQuestionIndex = 0;
let lovePoints = 0;

function loadQuestion() {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    document.getElementById('question').innerText = currentQuestion.question;
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        option.innerText = currentQuestion.options[index];
        option.classList.remove('correct', 'incorrect');
    });
}

function selectOption(index) {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    options.forEach((option, optionIndex) => {
        if (optionIndex === currentQuestion.correct) {
            option.classList.add('correct');
        } else {
            option.classList.add('incorrect');
        }
    });
    if (index === currentQuestion.correct) {
        lovePoints += 50;
    }
}

async function showAlert() {
    const result = await Swal.fire({
        title: "Parabéns gatinha",
        text: `Você ganhou ${lovePoints} LovePoints!`,
        confirmButtonText: "❤",
        customClass: {
            container: 'custom-swal-container',
            title: 'custom-swal-title',
            content: 'custom-swal-content',
            confirmButton: 'custom-swal-confirm-button'
        }
    });

    return result; // Opcional, se precisar do resultado
}

const backendUrl = 'https://backendlogindl.vercel.app';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeHlmbWJwemp5cGlkdWt6bHFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIyNTc5NjIsImV4cCI6MjAzNzgzMzk2Mn0._iRG2YBG6bRkYZG27BRbD-KnrAX1aBHqloTvHGlcNKQ'

// Função para atualizar os pontos no servidor
async function updatePoints(username, pointsEarned) {
    try {
        const response = await fetch(`${backendUrl}/api/auth/update-points`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': apiKey,
            },
            body: JSON.stringify({ username, pointsEarned }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Pontos atualizados com sucesso!');
        } else {
            console.error('Erro ao atualizar pontos:', data.message);
        }
    } catch (error) {
        console.error('Erro ao enviar a requisição:', error);
    }
}

// Função assíncrona para gerenciar o fluxo de perguntas e navegação
async function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= shuffledQuestions.length) {
        await showAlert(); // Espera o alerta ser fechado

        // Adiciona os pontos ao servidor
        const username = 'amor'; // Altere conforme necessário
        await updatePoints(username, lovePoints);

        // Define a flag indicando que o quiz foi completado
        localStorage.setItem('quizCompleted', 'true');

        // Navega para a nova página
        window.location.href = "loja.html";
    } else {
        loadQuestion();
    }
}

function checkQuizStatus() {
    const quizCompleted = localStorage.getItem('quizCompleted');
    const question = document.getElementById('question');
    const options = document.querySelectorAll('.option');
    const button = document.getElementById('next-button');
    const voltar = document.getElementById('voltar');
    if (quizCompleted === 'true') {
        question.innerHTML = 'Você já completou o quiz hoje! Volte amanhã ❤️';
        options.forEach(option => {
            option.style.display = 'none';
        });
        button.innerHTML = 'Voltar';
        button.onclick = () => {
            window.location.href = 'como.html';
        }
        voltar.style.display = 'none';
    } else {
        loadQuestion();
    }
}

window.onload = checkQuizStatus;
