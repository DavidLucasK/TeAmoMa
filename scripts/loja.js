// Recupera os pontos armazenados e adiciona à variável lovePoints
const backendUrl = 'https://backendlogindl.vercel.app/api/auth';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeHlmbWJwemp5cGlkdWt6bHFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIyNTc5NjIsImV4cCI6MjAzNzgzMzk2Mn0._iRG2YBG6bRkYZG27BRbD-KnrAX1aBHqloTvHGlcNKQ'
async function fetchUserPoints() {
    try {
        const response = await fetch(`${backendUrl}/points`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': apiKey,
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar pontos: ' + response.statusText);
        }

        const data = await response.json();
        return data.points;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Função para atualizar os pontos no servidor
async function updatePoints(username, pointsEarned) {
    try {
        const response = await fetch(`${backendUrl}/update-points`, {
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

async function insertRedemption(userId, rewardId, pointsRequired) {
    try {
        const response = await fetch(`${backendUrl}/insert-redemption`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': apiKey,
            },
            body: JSON.stringify({ userId, rewardId, pointsRequired }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Resgate registrado com sucesso!');
        } else {
            console.error('Erro ao registrar resgate:', data.message);
        }
    } catch (error) {
        console.error('Erro ao enviar a requisição:', error);
    }
}

async function handleRedemption(button, pointsRequired, rewardId) {

    const pointsElement = document.querySelector('.points');
    const currentPoints = parseInt(pointsElement.textContent, 10);

    if (currentPoints >= pointsRequired) {
        try {
            // Atualizar pontos
            await updatePoints('amor', -pointsRequired);
            await insertRedemption('1', rewardId, pointsRequired);
            console.log("resgate feito com sucesso")
            Swal.fire({
                title: "Parabéns gatinha",
                text: "Resgate feito com sucesso!",
                confirmButtonColor: "#d11507",
                confirmButtonText: "❤"
            });

        } catch (error) {
            console.error('Erro ao processar resgate:', error);
        }
    } else {
        console.log("erro do if pq tem menos pontos")
        Swal.fire({
            title: "Oops",
            text: "Você não tem pontos suficientes espertinha kkk",
            confirmButtonColor: "#d11507",
            confirmButtonText: "❤"
        });
    }
}


document.querySelectorAll('.redeem-button').forEach(button => {
    button.addEventListener('click', () => {
        //Trocar pointsRequired depois para vir da função junto com os cards de rewards.
        const pointsRequired = parseInt(button.previousElementSibling.textContent.match(/\d+/)[0], 10);
        const rewardId = button.getAttribute('data-reward-id');
        handleRedemption(button, pointsRequired, rewardId);
    });
});

//Adiciona aos LovePoints reais da página
const lovePoints = await fetchUserPoints();
const points = document.querySelector('.points');
points.innerHTML = `${lovePoints} LovePoints`;