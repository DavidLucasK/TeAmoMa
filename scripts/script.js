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
    'Lembre-se sempre: Eu te amo, tá?',
];

const textos3 = [
    'Bem-vinda novamente gatinha!',
    'Estou feliz que você esteja usando o site hehe.',
    'Tem alguma sugestão pra loja? Me chama!'
];

const textos4 = [
    'Olá amor da minha vida!',
    'Tá gostando do site que fiz pra você?',
    'Me da um beijinho então rs ❤'
];

const textos5 = [
    'Oi minha princesa!',
    'Gostei de criar coisas pra você.',
    'Espero que esteja se divertindo com o site!'
];

const textos6 = [
    'Oi meu bem!',
    'Cada detalhe desse site foi pensado em você.',
    'Você é a razão de tudo isso ❤'
];

const textos7 = [
    'Ei, amorzinho!',
    'Seu sorriso é o que me inspira.',
    'Me avisa se quiser algo diferente no site!'
];

const textos8 = [
    'Oiiie gatona!',
    'Estou sempre pensando em novas idéias pra te surpreender.',
    'Me fala o que você ta achando até agora, blz?'
];

const textos9 = [
    'Oi, amor da minha vida!',
    'Esse site é só mais uma forma de mostrar como te amo.',
    'Quero que cada visita sua seja especial e que você se divirta!'
];

const textos10 = [
    'Oi, gatenhaaaa ❤',
    'Me diverti criando essas coisas pra te ver feliz.',
    'Você merece o melhor, sempre. ❤'
];

const textos11 = [
    'Oi meu nenééémmm',
    'Te amo muito tá?',
    'Me chama no whats, to com saudades de você 😔'
];



function obterTextos4(lovePoints) {
    if (lovePoints > 4000) {
        return [
            'Oi bebêeee',
            'OQUE?! Você já tem mais de 4000 LOVEPOINTS?',
            'PARA DE USAR HACK HEIN, TO DE OLHO 👀'
        ]
    }

    else if (lovePoints > 1000) {
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

async function showAlert() {
    const result = await Swal.fire({
        title: "Essa é a Lojinha",
        text: `Aqui você pode trocar seus LovePoints por prêmios`,
        confirmButtonText: "❤",
        customClass: {
            container: 'custom-swal-container',
            title: 'custom-swal-title',
            content: 'custom-swal-content',
            confirmButton: 'custom-swal-confirm-button'
        }
    });

    return result;
}

const hasVisitedLoja = true;

window.onload = async function() {
    // Verifica a URL da página atuall
    const path = window.location.pathname;

    if (path === '/loja.html') {

        if (!hasVisitedLoja) 
        {
            Swal.fire({
                title: 'Bem-vindo à Loja!',
                text: 'Esta é sua primeira visita à nossa loja.',
                icon: 'info',
                confirmButtonText: 'Ok'
            }).then(() => {
                localStorage.setItem('hasVisitedLoja', 'true');
            });

            hasVisitedLoja = true;

            return hasVisitedLoja;
        }
        else 
        {
            const hasVisitedLoja = true
            return hasVisitedLoja;
        }

    }

    if (path === '/index.html') {
        localStorage.setItem('hasVisited', 'true');
    }

    return hasVisitedLoja;
};

const hasVisited = localStorage.getItem('hasVisited');

// Recupera os pontos armazenados e adiciona à variável lovePoints
const backendUrl = 'https://backendlogindl.vercel.app';
async function fetchUserPoints() {
    try {
        const response = await fetch(`${backendUrl}/api/auth/points`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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
    const randomIndex = Math.floor(Math.random() * 10);
    switch (randomIndex) {
        case 0:
            textos = textos2;
            break;
        case 1:
            textos = textos3;
            break;
        case 2:
            textos = obterTextos4(lovePoints);
            break;
        case 3:
            textos = textos4;
            break;
        case 4:
            textos = textos5;
            break;
        case 5:
            textos = textos6;
            break;
        case 6:
            textos = textos7;
            break;
        case 7:
            textos = textos8;
            break;
        case 8:
            textos = textos9;
            break;
        case 9:
            textos = textos10;
            break;
        case 10:
            textos = textos11;
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
            parags[index].style.fontSize = "22pt";
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