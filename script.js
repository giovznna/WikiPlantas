let cardContainer = document.querySelector(".card-container");
let allPlantsData = []; // Armazena todos os dados das plantas

async function iniciarBusca(searchTerm = '') {
    // Busca os dados apenas uma vez, na primeira chamada
    if (allPlantsData.length === 0) {
        let resposta = await fetch("data.json");
        allPlantsData = await resposta.json();
    }
 
    // Se o termo de busca estiver vazio, mostra a mensagem inicial
    if (searchTerm.trim() === '') {
        mostrarMensagemInicial();
        return;
    }
 
    // Aplica o filtro se um termo de busca for fornecido
    const dataToRender = allPlantsData.filter(plant => {
        const lowerCaseSearchTerm = searchTerm.trim().toLowerCase();
        const nameMatches = plant.nome.trim().toLowerCase().startsWith(lowerCaseSearchTerm);
        return nameMatches;
      }).sort((a, b) => a.nome.localeCompare(b.nome));
 
    renderizarCards(dataToRender); // Renderiza os dados filtrados
}
 
function renderizarCards(dataToRender) {
    cardContainer.innerHTML = ''; // Limpa os cards existentes antes de renderizar novos
    cardContainer.classList.remove('initial-message'); // Remove a classe inicial
    cardContainer.classList.remove('hidden');
 
    if (dataToRender.length === 0) {
        cardContainer.innerHTML = '<p>Ainda não conhecemos essa plantinha. 😿</p>';
        cardContainer.classList.add('no-results'); // Adiciona a classe quando não há resultados
        cardContainer.classList.remove('initial-message');
        return;
    }
 
    cardContainer.classList.remove('no-results'); // Remove a classe se houver resultados
    for (const dado of dataToRender) {
        let article = document.createElement("article");
        article.classList.add("card");

        // Define a imagem de fundo do card, se existir no JSON
        if (dado.imagem && dado.imagem.trim() !== '') {
            article.style.setProperty('--bg-image', `url('${dado.imagem}')`);
        }

        // Adiciona o link "Saiba mais" apenas se o dado.link existir
        let linkHtml = dado.link ? `<a href="${dado.link}" target="_blank">Saiba mais</a>` : '';
        
        // Formata as tags para exibição
        const tagsHtml = Array.isArray(dado.tags) ? dado.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';

        article.innerHTML=`
        <div class="content">
            <h2>${dado.nome}</h2>
            <p>${dado.descricao}</p>
            <div class="details-section">
                <p><strong>Dificuldade de Cultivo:</strong> ${dado.dificuldade_cultivo || 'Não informado'}</p>
                <p><strong>Curiosidades:</strong> ${dado.curiosidades || 'Não informado'}</p>
            </div>
            <div class="details-section">
                <h3>Cuidados Principais</h3>
                <p><strong>Luz:</strong> ${dado.cuidados_principais?.luz || 'Não informado'}</p>
                <p><strong>Água:</strong> ${dado.cuidados_principais?.agua || 'Não informado'}</p>
                <p><strong>Solo:</strong> ${dado.cuidados_principais?.solo || 'Não informado'}</p>
            </div>
            <div class="tags-container">${tagsHtml}</div>
            <div class="link-container">${linkHtml}</div>
        </div>
        `;
        cardContainer.appendChild(article);
    }
}

function mostrarMensagemInicial() {
    cardContainer.innerHTML = '<p>Descubra curiosidades e cuidados sobre suas plantas favoritas! </p>';
    cardContainer.classList.add('initial-message');
    cardContainer.classList.remove('no-results');
    cardContainer.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('#searchInput');

    if (searchInput) {
        // Mostra a mensagem inicial ao carregar a página
        mostrarMensagemInicial();

        // Aciona a busca a cada alteração no campo de input
        searchInput.addEventListener('input', () => {
            iniciarBusca(searchInput.value);
        });
    }

});
