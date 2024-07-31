function typeWriter(elemento, texto, callback) {
    const textoArray = texto.split('');
    elemento.innerHTML = '';
    textoArray.forEach((letra, i) => {
        setTimeout(function() {
            elemento.innerHTML += letra;
        }, 50 * i);
    });

    // Tempo total necessário para escrever o texto
    const tempoTotal = 100 * textoArray.length;

    // Chamar a função de callback após o tempo necessário para escrever o texto, mais um pequeno delay
    setTimeout(() => {
        if (callback) callback();
    }, tempoTotal + 10);
}

const parags = document.querySelectorAll('.home .typewriter');

// Arrays de textos para primeira e subsequentes visitas
const textos1 = [
    'Oi gatinha!',
    'Essa plataforma foi uma idéia que tive.',
    'Acho que você vai gostar :)',
];

const textos2 = [
    'Oi de novo!',
    'Espero que esteja gostando.',
    'Lembre-se sempre: Eu te amo',
];

const textos3 = [
    'Oiieee!',
    'Estou feliz que você esteja aqui.',
    'Quantos pontos você já tem?',
];

const textos4 = [
    'Bem-vinda novamente!',
    'Estou feliz que você esteja aqui.',
    'Tem alguma sugestão pra loja? Só me avisar!'
];

// Verifica se o usuário já visitou a página
const hasVisited = localStorage.getItem('hasVisited');

// Escolhe o array de textos com base na visita anterior
let textos;
if (hasVisited) {
    // Gera um número aleatório entre 0 e 3
    const randomIndex = Math.floor(Math.random() * 4);
    switch (randomIndex) {
        case 0:
            textos = textos2;
            break;
        case 1:
            textos = textos3;
            break;
        case 2:
            textos = textos4;
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

// Armazena a informação de visita no localStorage
localStorage.setItem('hasVisited', true);

startTypingEffect();

const lovePoints = 2000;

const points = document.querySelector('.points');

points.innerHTML = `${lovePoints} LovePoints`;

//Mostra a loja depois de um certo tempo
window.onload = function() {
    const loja = document.getElementById('link');
    const lojaNav = document.getElementById('lojaNav');
    const profile = document.getElementById('profile');
    if (hasVisited) {
        lojaNav.style.display= 'block';    
        profile.style.display= 'block';    
        loja.style.display = 'none';
    }
    else {
        lojaNav.style.display= 'none';
        profile.style.display= 'none';
        setTimeout(() => {
            loja.style.display = 'block';
        }, 8000);
    }
}

//Profile Scripts

// script.js
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const profileImage = document.getElementById('profileImage');
    const changePhotoButton = document.getElementById('changePhotoButton');

    // Carregar imagem salva do localStorage se existir
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        profileImage.src = savedImage;
    }

    // Quando o botão é clicado, aciona o input de arquivo
    changePhotoButton.addEventListener('click', () => {
        fileInput.click();
    });

    // Quando o usuário escolhe um arquivo, atualiza a imagem de perfil e salva no localStorage
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const imageDataUrl = e.target.result;
                profileImage.src = imageDataUrl; // Atualiza a src da imagem com o resultado da leitura

                // Salva a URL da imagem no localStorage
                localStorage.setItem('profileImage', imageDataUrl);
            };

            reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados
        }
    });
});