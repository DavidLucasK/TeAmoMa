// Variáveis globais
let questions = [];
let currentQuestionIndex = 0;
let points = 0;
let quizStatus = false; // Variável para armazenar o status do quiz

// URLs e API Key
const backendUrl = 'https://backendlogindl.vercel.app/api/auth';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeHlmbWJwemp5cGlkdWt6bHFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIyNTc5NjIsImV4cCI6MjAzNzgzMzk2Mn0._iRG2YBG6bRkYZG27BRbD-KnrAX1aBHqloTvHGlcNKQ';

// Função para buscar perguntas do endpoint com método GET
async function fetchQuestions() {
    try {
        const response = await fetch(`${backendUrl}/questions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': apiKey
            }
        });

        if (!response.ok) throw new Error('Falha ao buscar perguntas.');

        questions = await response.json();
        console.log(questions);
        await fetchQuizStatus();
        checkQuizStatus();
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para buscar o status do quiz
async function fetchQuizStatus() {
    try {
        const response = await fetch(`${backendUrl}/quiz-status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': apiKey
            }
        });

        if (!response.ok) throw new Error('Falha ao buscar status do quiz.');

        const data = await response.json();
        quizStatus = data.is_completed;
        console.log('Status do quiz:', quizStatus);
    } catch (error) {
        console.error('Erro:', error);
        quizStatus = false;
    }
}

// Função para atualizar o status do quiz
async function updateQuizStatus() {
    try {
        const response = await fetch(`${backendUrl}/update-quiz-status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': apiKey
            }
        });

        if (!response.ok) throw new Error('Falha ao atualizar status do quiz.');

        console.log('Status do quiz atualizado com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para exibir a pergunta atual
async function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        document.getElementById('question').textContent = question.pergunta;

        // Resetar opções
        question.answers.forEach((answer, index) => {
            const optionDiv = document.getElementById(`option${index}`);
            if (optionDiv) {
                optionDiv.innerHTML = answer.resposta;
                optionDiv.dataset.correct = answer.is_correta ? 'true' : 'false';
                optionDiv.classList.remove('correct', 'incorrect', 'disabled');
            }
        });

        // Mostra botão de pergunta anterior se não for a primeira pergunta
        const prevButton = document.getElementById('prev-button');
        if (currentQuestionIndex > 0) {
            prevButton.style.display = 'inline-block';
        } else {
            prevButton.style.display = 'none';
        }

        // Altera o botão de próxima pergunta para finalizar quiz
        const nextButton = document.getElementById('next-button');
        if (currentQuestionIndex === questions.length - 1) {
            nextButton.textContent = 'Finalizar Quiz';
        } else {
            nextButton.textContent = 'Próxima Pergunta';
        }
    } else {
        await updatePoints();
    }
}

// Função para selecionar uma opção
function selectOption(index) {
    const question = questions[currentQuestionIndex];
    const selectedOption = document.getElementById(`option${index}`);
    console.log(selectedOption.dataset.correct);

    // Verifica se a opção selecionada é a correta e adiciona pontos
    if (selectedOption.dataset.correct === 'true') {
        points += 50; // Adiciona 50 pontos por resposta correta
    }
    console.log(points);

    // Marca visualmente todas as opções
    question.answers.forEach((answer, optionIndex) => {
        const optionDiv = document.getElementById(`option${optionIndex}`);
        if (optionDiv) {
            if (optionDiv.dataset.correct === 'true') {
                optionDiv.classList.add('correct');
            } else {
                optionDiv.classList.add('incorrect');
            }
            // Desabilita as opções
            optionDiv.classList.add('disabled');
        }
    });
}

// Função para ir para a próxima pergunta
function nextQuestion() {
    currentQuestionIndex++;
    showQuestion();
}

// Função para ir para a pergunta anterior
function prevQuestion() {
    currentQuestionIndex--;
    showQuestion();
}

// Função para atualizar os pontos no endpoint
async function updatePoints() {
    try {
        const response = await fetch(`${backendUrl}/update-points`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': apiKey
            },
            body: JSON.stringify({
                username: 'amor',
                pointsEarned: points
            })
        });

        if (!response.ok) throw new Error('Falha ao atualizar pontos.');
        Swal.fire('Quiz Concluído!', `Você ganhou ${points} pontos.`, 'success');
        await updateQuizStatus();
        window.location.href = 'como.html';
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para verificar o status do quiz
function checkQuizStatus() {
    const question = document.getElementById('question');
    const optionsContainer = document.getElementById('options');
    const button = document.getElementById('next-button');
    const buttonPrev = document.getElementById('prev-button');
    const voltar = document.getElementById('voltar');

    if (quizStatus) {
        question.innerHTML = 'Você já completou o quiz hoje! Volte amanhã ❤️';
        optionsContainer.style.display = 'none';
        buttonPrev.style.display = 'none';
        button.innerHTML = 'Voltar';
        button.onclick = () => {
            window.location.href = 'como.html';
        };
        voltar.style.display = 'none';
    } else {
        showQuestion();
    }
}

// Inicializa o quiz quando a página carrega
window.onload = async () => {
    await fetchQuestions();
};
