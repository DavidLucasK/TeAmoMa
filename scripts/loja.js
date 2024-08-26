// URLs e API Key
const backendUrl = 'https://backendlogindl.vercel.app/api/auth';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeHlmbWJwemp5cGlkdWt6bHFmIiwicm9zZSI6ImFub24iLCJpYXQiOjE3MjIyNTc5NjIsImV4cCI6MjAzNzgzMzk2Mn0._iRG2YBG6bRkYZG27BRbD-KnrAX1aBHqloTvHGlcNKQ';

// Função para buscar pontos do usuário
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

// Função para atualizar pontos no servidor
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

// Função para registrar um resgate
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

// Função para gerenciar resgates
async function handleRedemption(button, pointsRequired, rewardId) {
    const pointsElement = document.querySelector('.points');
    const currentPoints = parseInt(pointsElement.textContent, 10);

    if (currentPoints >= pointsRequired) {
        try {
            await updatePoints('amor', -pointsRequired);
            await insertRedemption('1', rewardId, pointsRequired);
            console.log("Resgate feito com sucesso");
            Swal.fire({
                title: "Parabéns gatinha",
                text: "Resgate feito com sucesso!",
                confirmButtonColor: "#d11507",
                confirmButtonText: "❤"
            }).then(() => {
                location.reload(); // Recarrega a página após o sucesso
            });
        } catch (error) {
            console.error('Erro ao processar resgate:', error);
            Swal.fire({
                title: "Erro",
                text: "Algo deu errado durante o resgate. Tente novamente.",
                confirmButtonColor: "#d11507",
                confirmButtonText: "❤"
            }).then(() => {
                location.reload(); // Recarrega a página após um erro
            });
        }
    } else {
        console.log("Erro: pontos insuficientes");
        Swal.fire({
            title: "Oops",
            text: "Você não tem pontos suficientes espertinha kkk",
            confirmButtonColor: "#d11507",
            confirmButtonText: "❤"
        }).then(() => {
            location.reload(); // Recarrega a página após pontos insuficientes
        });
    }
}

// Função para buscar e listar itens da loja
async function fetchStoreItems() {
    try {
        const response = await fetch(`${backendUrl}/items`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': apiKey,
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar itens da loja: ' + response.statusText);
        }

        const items = await response.json();
        displayStoreItems(items);
    } catch (error) {
        console.error('Erro ao buscar itens da loja:', error);
    }
}

// Função para exibir itens da loja no HTML
function displayStoreItems(items) {
    const storeSection = document.querySelector('.store-section');
    storeSection.innerHTML = '<h2>Loja de Recompensas</h2>'; // Reset the section's innerHTML

    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.innerHTML = `
            <div class="left-side">
                <img src="${item.image_url}" alt="${item.name}">
            </div>
            <div class="right-side">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p>LovePoints necessários: ${item.points_required}</p>
                <button class="redeem-button" data-reward-id="${item.id}">Resgatar</button>
            </div>
        `;
        storeSection.appendChild(itemDiv);
    });

    // Adiciona eventos aos botões de resgate
    document.querySelectorAll('.redeem-button').forEach(button => {
        button.addEventListener('click', () => {
            //Desabilita o botão após o resgate
            button.disabled = true;

            const pointsRequired = parseInt(button.previousElementSibling.textContent.match(/\d+/)[0], 10);
            const rewardId = button.getAttribute('data-reward-id');
            handleRedemption(button, pointsRequired, rewardId);
        });
    });
}

// Adiciona aos LovePoints reais da página
(async function() {
    const lovePoints = await fetchUserPoints();
    const points = document.querySelector('.points');
    points.innerHTML = `${lovePoints} LovePoints`;

    // Carregar itens da loja
    fetchStoreItems();
})();
