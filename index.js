const campoEntradas = document.getElementById('entradas');
const botaoSortear = document.getElementById('botaoSortear');
const botaoResetar = document.getElementById('botaoResetar');
const exibicaoVencedor = document.getElementById('vencedor');
const campoParticipantes = document.getElementById('participantes');
const campoSorteios = document.getElementById('sorteios');
const exibicaoProbabilidade = document.getElementById('probabilidade');
const secaoSorteados = document.getElementById('sorteados');

const containerHistorico = document.querySelector(".secao-historico");
const listaHistorico = document.getElementById('historico');

const botaoHistorico = document.createElement("button");
botaoHistorico.textContent = "Mostrar Histórico";
botaoHistorico.id = "botaoHistorico";
containerHistorico.prepend(botaoHistorico);

let historicoVisivel = false;
let sorteados = [];

function calcularProbabilidade(participantes, sorteios) {
    if (participantes <= 0 || sorteios <= 0) return 0;
    return (1 - Math.pow((participantes - 1) / participantes, sorteios)) * 100;
}

function atualizarProbabilidade() {
    const participantes = parseInt(campoParticipantes.value, 10);
    const sorteios = parseInt(campoSorteios.value, 10);

    const probabilidade = calcularProbabilidade(participantes, sorteios);
    exibicaoProbabilidade.textContent = 
        `A probabilidade de ganhar é ${probabilidade.toFixed(2)}%`;
}

function atualizarParticipantes() {
    const regexEntradaValida = /^[a-zA-Zá-úÁ-ÚãõÃÕêÊéÉíÍóÓúÚçÇ0-9\s]+$/;
    const entradas = campoEntradas.value.split(',').map(e => e.trim()).filter(e => regexEntradaValida.test(e));
    campoParticipantes.value = entradas.length;

    atualizarProbabilidade();
}

function atualizarSorteios() {
    let sorteios = parseInt(campoSorteios.value, 10);
    if (sorteios < 1) {
        sorteios = 1;
    }
    campoSorteios.value = sorteios;

    atualizarProbabilidade();
}

function realizarSorteio() {
    const entradas = campoEntradas.value.split(',').map(e => e.trim()).filter(Boolean);
    const sorteiosRestantes = parseInt(campoSorteios.value, 10);

    if (entradas.length === 0) {
        alert('Por favor, insira nomes ou números para o sorteio.');
        return;
    }

    if (sorteiosRestantes <= 0) {
        alert('Não há mais sorteios restantes.');
        return;
    }

    const indiceAleatorio = Math.floor(Math.random() * entradas.length);
    const vencedor = entradas[indiceAleatorio];

    entradas.splice(indiceAleatorio, 1);

    sorteados.push(vencedor);
    renderizarSorteados();

    campoEntradas.value = entradas.join(', ');
    exibicaoVencedor.textContent = `Vencedor: ${vencedor}`;

    campoParticipantes.value = entradas.length;
    campoSorteios.value = sorteiosRestantes - 1;
    atualizarProbabilidade();

    atualizarHistorico(vencedor);
}

function atualizarHistorico(vencedor) {
    const historico = JSON.parse(localStorage.getItem('historico')) || [];
    historico.push(vencedor);
    localStorage.setItem('historico', JSON.stringify(historico));
    renderizarHistorico(); 
}

function renderizarHistorico() {
    const historico = JSON.parse(localStorage.getItem('historico')) || [];
    listaHistorico.innerHTML = historico.map(vencedor => `<li>${vencedor}</li>`).join('');
    
    listaHistorico.style.display = "none";
}

function alternarHistorico() {
    historicoVisivel = !historicoVisivel;
    listaHistorico.style.display = historicoVisivel ? "block" : "none";
    botaoHistorico.textContent = historicoVisivel ? "Ocultar Histórico" : "Mostrar Histórico";
}

function renderizarSorteados() {
    secaoSorteados.innerHTML = sorteados.map(vencedor => `<li>${vencedor}</li>`).join('');
}

function resetarSorteio() {
    campoEntradas.value = '';
    exibicaoVencedor.textContent = 'O vencedor será exibido aqui!';
    campoParticipantes.value = 0;
    exibicaoProbabilidade.textContent = 'Preencha os campos acima para calcular a probabilidade.';
    localStorage.removeItem('historico');
    localStorage.removeItem('sorteados');
    renderizarHistorico();
    renderizarSorteados();
}

botaoSortear.addEventListener('click', realizarSorteio);
botaoResetar.addEventListener('click', resetarSorteio);
botaoHistorico.addEventListener("click", alternarHistorico);

campoEntradas.addEventListener('input', atualizarParticipantes);
campoSorteios.addEventListener('input', atualizarSorteios);

renderizarHistorico();
