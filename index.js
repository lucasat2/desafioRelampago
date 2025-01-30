const campoEntradas = document.getElementById('entradas');
const botaoSortear = document.getElementById('botaoSortear');
const botaoResetar = document.getElementById('botaoResetar');
const exibicaoVencedor = document.getElementById('vencedor');
const campoParticipantes = document.getElementById('participantes');
const campoSorteios = document.getElementById('sorteios');
const exibicaoProbabilidade = document.getElementById('probabilidade');
const secaoHistorico = document.getElementById('historico');
const secaoSorteados = document.getElementById('sorteados');

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
    const entradas = campoEntradas.value.split(',').map(e => e.trim()).filter(Boolean);
    campoParticipantes.value = entradas.length;

    atualizarProbabilidade();
}
