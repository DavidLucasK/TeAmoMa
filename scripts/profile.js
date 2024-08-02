const backendUrl = 'https://backendlogindl.vercel.app/api/auth';
const uploadUrl = `${backendUrl}/upload`; // Certifique-se de que este é o URL correto

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
