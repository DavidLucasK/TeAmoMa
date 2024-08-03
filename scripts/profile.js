const backendUrl = 'https://backendlogindl.vercel.app/api/auth';
const uploadUrl = `${backendUrl}/upload`;
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeHlmbWJwemp5cGlkdWt6bHFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIyNTc5NjIsImV4cCI6MjAzNzgzMzk2Mn0._iRG2YBG6bRkYZG27BRbD-KnrAX1aBHqloTvHGlcNKQ'

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

                // Chama a função de upload de imagem
                uploadImage(file);
            };

            reader.readAsDataURL(file);
        }
    });
});

function uploadImage(file) {
    const formData = new FormData();
    formData.append('photo', file); // A chave deve corresponder à chave esperada no backend

    fetch(uploadUrl, { 
        method: 'POST',
        body: formData
    })
    .then(response => {
        // Verifique o tipo de conteúdo da resposta
        if (response.headers.get('content-type').includes('application/json')) {
            return response.json();
        } else {
            return response.text().then(text => {
                throw new Error(`Expected JSON, but received: ${text}`);
            });
        }
    })
    .then(data => {
        if (data.message === 'Foto enviada com sucesso!') {
        } else {
            console.error('Erro no upload:', data);
        }
    })
    .catch(error => {
        console.error('Erro no upload:', error);
    });
}

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

//Adiciona aos LovePoints reais da página
const lovePoints = await fetchUserPoints();
const points = document.querySelector('.points');
points.innerHTML = `${lovePoints} LovePoints`;
