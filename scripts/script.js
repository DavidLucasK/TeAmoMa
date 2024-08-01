function typeWriter(elemento, texto, callback) {
    const textoArray = texto.split('');
    elemento.innerHTML = '';
    textoArray.forEach((letra, i) => {
        setTimeout(function() {
            elemento.innerHTML += letra;
        }, 50 * i);
    });

    const tempoTotal = 100 * textoArray.length;
    setTimeout(() => {
        if (callback) callback();
    }, tempoTotal + 10);
}

const parags = document.querySelectorAll('.home .typewriter');

const textos1 = [
    'Oi gatinha!',
    'Essa plataforma foi uma idéia que tive.',
    'Acho que você vai gostar :)',
];

const textos2 = [
    'Oi de novo!',
    'Espero que esteja gostando amor.',
    'Lembre-se sempre: Eu te amo',
];

const textos3 = [
    'Bem-vinda novamente gatinha!',
    'Estou feliz que você esteja usando o site hehe.',
    'Tem alguma sugestão pra loja? Me chama!'
];


function obterTextos4(lovePoints) {
    if (lovePoints > 1000) {
        return [
            'Oiieee!',
            'Que bom que você está aqui de novo.',
            'UAU! Você já tem mais de 1000 LovePoints? Parabéns ❤️',
        ];
    } else {
        return [
            'Oiieee!',
            'Que bom que você está aqui de novo.',
            'Quantos pontos você já tem?',
        ];
    }
}

const hasVisited = localStorage.getItem('hasVisited');

// Recupera os pontos armazenados e adiciona à variável lovePoints
const backendUrl = 'https://backendlogindl.vercel.app';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeHlmbWJwemp5cGlkdWt6bHFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIyNTc5NjIsImV4cCI6MjAzNzgzMzk2Mn0._iRG2YBG6bRkYZG27BRbD-KnrAX1aBHqloTvHGlcNKQ'
async function fetchUserPoints() {
    try {
        const response = await fetch(`${backendUrl}/api/auth/points`, {
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

//Adiciona aos LovePoints reais da página
const lovePoints = await fetchUserPoints();
const points = document.querySelector('.points');
points.innerHTML = `${lovePoints} LovePoints`;

let textos;
if (hasVisited) {
    const randomIndex = Math.floor(Math.random() * 4);
    switch (randomIndex) {
        case 0:
            textos = textos2;
            break;
        case 1:
            textos = textos3;
            break;
        case 2:
            textos = obterTextos4(lovePoints); // Chama a função com lovePoints
            break;
        default:
            textos = textos2;
    }
} else {
    textos = textos1;
}

function startTypingEffect() {
    let index = 0;
    
    function typeNextParagraph() {
        if (index < parags.length) {
            typeWriter(parags[index], textos[index], () => {
                index++;
                typeNextParagraph();
            });
        }
    }
    
    typeNextParagraph();
}

localStorage.setItem('hasVisited', true);

startTypingEffect();

window.onload = function() {
    const lojaNavNone = document.getElementById('lojaNavNone');
    const profile = document.getElementById('profile');
    if (hasVisited) {
        lojaNavNone.style.display= 'block';    
        profile.style.display= 'block';    
    }
    else {
        setTimeout(function() {
            lojaNavNone.classList.remove('lojaNavNone');
            lojaNavNone.classList.add('lojaNav');
        }, 4000);
        profile.style.display= 'none';
    }
}


//Função para mudar a foto de perfil
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const profileImage = document.getElementById('profileImage');
    const changePhotoButton = document.getElementById('changePhotoButton');

    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        profileImage.src = savedImage;
    }

    changePhotoButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const imageDataUrl = e.target.result;
                profileImage.src = imageDataUrl;
                localStorage.setItem('profileImage', imageDataUrl);
            };

            reader.readAsDataURL(file);
        }
    });
});
