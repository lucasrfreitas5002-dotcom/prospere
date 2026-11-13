/**
 * js/quiz.js
 * Lógica do quiz interativo de perfil de prosperidade.
 * Gerencia as perguntas, validação de respostas, navegação (Avançar/Voltar),
 * cálculo do perfil predominante com regra de desempate, salvamento no localStorage,
 * exibição do resultado e recursos de acessibilidade.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Dados das 7 perguntas do quiz e suas 4 alternativas correspondentes aos perfis:
    // A = Desbravador da Prosperidade
    // B = Arquiteto da Abundância
    // C = Realizador
    // D = Guardião do Equilíbrio
    const perguntas = [
        {
            id: 1,
            titulo: "Quando você olha para a sua situação financeira e profissional hoje, qual pensamento mais se repete?",
            alternativas: [
                { letra: "A", perfil: "Desbravador da Prosperidade", texto: "Eu sei que tenho potencial, mas sinto que estou no lugar errado ou que as oportunidades certas não aparecem." },
                { letra: "B", perfil: "Arquiteto da Abundância", texto: "Eu me esforço muito, mas parece que falta organização e uma estrutura sólida para o dinheiro render." },
                { letra: "C", perfil: "Realizador", texto: "Trabalho duro e entrego muito, mas sinto que o retorno financeiro não acompanha o meu esforço." },
                { letra: "D", perfil: "Guardião do Equilíbrio", texto: "Eu ganho o suficiente, mas sinto um vazio constante, como se o dinheiro e o trabalho estivessem desconectados do meu propósito." }
            ]
        },
        {
            id: 2,
            titulo: "Qual dessas frases mais se aproxima da forma como você enxergava o dinheiro na sua infância ou juventude?",
            alternativas: [
                { letra: "A", perfil: "Desbravador da Prosperidade", texto: "Dinheiro é conquista, é preciso correr atrás e desbravar novos caminhos para obtê-lo." },
                { letra: "B", perfil: "Arquiteto da Abundância", texto: "Dinheiro é fruto de planejamento rígido, economia e controle absoluto de cada centavo." },
                { letra: "C", perfil: "Realizador", texto: "Dinheiro é recompensa direta pelo trabalho árduo e pela competência técnica." },
                { letra: "D", perfil: "Guardião do Equilíbrio", texto: "Dinheiro é energia; se houver desarmonia espiritual ou emocional, ele foge de você." }
            ]
        },
        {
            id: 3,
            titulo: "Diante de um novo projeto ou desafio profissional, como você costuma agir no primeiro dia?",
            alternativas: [
                { letra: "A", perfil: "Desbravador da Prosperidade", texto: "Jogo-me de cabeça com entusiasmo, criando ideias inovadoras, embora às vezes me perca nos detalhes." },
                { letra: "B", perfil: "Arquiteto da Abundância", texto: "Crio planilhas, divido as tarefas por etapas e só começo quando tudo está perfeitamente estruturado." },
                { letra: "C", perfil: "Realizador", texto: "Foco na execução prática e imediata para ver resultados rápidos e tangíveis acontecerem." },
                { letra: "D", perfil: "Guardião do Equilíbrio", texto: "Analiso se esse projeto respeita meus valores, minha paz interior e o meu tempo de descanso." }
            ]
        },
        {
            id: 4,
            titulo: "O que você sente que mais drena a sua energia e impede seu crescimento financeiro?",
            alternativas: [
                { letra: "A", perfil: "Desbravador da Prosperidade", texto: "A falta de constância; começo muitas coisas empolgado, mas mudo de foco rápido." },
                { letra: "B", perfil: "Arquiteto da Abundância", texto: "O excesso de cautela e o medo de errar, que muitas vezes me paralisam antes de agir." },
                { letra: "C", perfil: "Realizador", texto: "A sensação de sobrecarga; sinto que carrego o peso do mundo nas costas para fazer as coisas funcionarem." },
                { letra: "D", perfil: "Guardião do Equilíbrio", texto: "A culpa ou o conflito interno entre querer prosperar financeiramente e manter a minha espiritualidade." }
            ]
        },
        {
            id: 5,
            titulo: "Se você pudesse descrever a sua vida ideal daqui a três anos, qual cenário traria mais paz ao seu coração?",
            alternativas: [
                { letra: "A", perfil: "Desbravador da Prosperidade", texto: "Viver de forma dinâmica, explorando novos horizontes e gerando novas fontes de renda com liberdade." },
                { letra: "B", perfil: "Arquiteto da Abundância", texto: "Ter total estabilidade financeira, investimentos seguros e uma rotina perfeitamente organizada." },
                { letra: "C", perfil: "Realizador", texto: "Ser reconhecido pelo meu valor, liderando projetos de impacto e com alta rentabilidade." },
                { letra: "D", perfil: "Guardião do Equilíbrio", texto: "Viver em plena harmonia, onde a abundância material sustenta uma vida com propósito e tempo para o essencial." }
            ]
        },
        {
            id: 6,
            titulo: "Quando você precisa tomar uma decisão financeira importante, qual é o seu critério número um?",
            alternativas: [
                { letra: "A", perfil: "Desbravador da Prosperidade", texto: "A intuição e o potencial de novidade e crescimento que a oportunidade oferece." },
                { letra: "B", perfil: "Arquiteto da Abundância", texto: "A segurança a longo prazo e a previsibilidade de riscos." },
                { letra: "C", perfil: "Realizador", texto: "O retorno prático e o quanto aquilo vai acelerar minhas metas imediatas." },
                { letra: "D", perfil: "Guardião do Equilíbrio", texto: "O alinhamento daquela escolha com os meus princípios e com o bem-estar de quem está ao meu redor." }
            ]
        },
        {
            id: 7,
            titulo: "Você quer continuar tentando sozinho(a) ou prefere começar agora com um caminho claro?",
            alternativas: [
                { letra: "A", perfil: "Desbravador da Prosperidade", texto: "Começar agora e ajustar o caminho enquanto avanço." },
                { letra: "B", perfil: "Arquiteto da Abundância", texto: "Começar agora, com um método passo a passo e metas claras." },
                { letra: "C", perfil: "Realizador", texto: "Começar agora e direcionar meu esforço para o que realmente importa." },
                { letra: "D", perfil: "Guardião do Equilíbrio", texto: "Começar agora, com consciência, sem culpa e em paz com meus valores." }
            ]
        }
    ];

    // Textos reflexivos detalhados para cada resultado de perfil
    const resultadosInfo = {
        "Desbravador da Prosperidade": {
            espelho: "Você tem uma chama interna de iniciativa e criatividade. Vê possibilidades onde outros veem obstáculos e tem facilidade para começar novos caminhos.",
            pontoAtencao: "O risco de dispersão. Iniciar muitos projetos sem consolidar o anterior pode gerar desgaste e sensação de estagnação.",
            ponte: "Quando essa energia ganha direção e método, suas ideias têm mais chances de sair do papel. É esse o caminho que O Código da Prosperidade apresenta."
        },
        "Arquiteto da Abundância": {
            espelho: "Você valoriza estrutura, ordem e segurança. Acredita que a prosperidade é construída com disciplina, planejamento e bases sólidas.",
            pontoAtencao: "O excesso de cautela. O medo de arriscar ou de sair da rotina pode fazer você perder oportunidades de crescimento.",
            ponte: "Um método claro ajuda a manter a segurança e, ao mesmo tempo, abrir espaço para novas possibilidades. É esse o caminho que O Código da Prosperidade apresenta."
        },
        "Realizador": {
            espelho: "Você é movido pela ação e pela entrega. Busca resultados práticos e crescimento profissional e financeiro através do seu trabalho.",
            pontoAtencao: "A sobrecarga. Assumir todo o peso da execução pode trazer cansaço e limitar a sua capacidade de crescer.",
            ponte: "Quando você direciona sua força para o que importa de verdade, o esforço fica mais leve e mais claro. É esse o caminho que O Código da Prosperidade apresenta."
        },
        "Guardião do Equilíbrio": {
            espelho: "Você busca harmonia entre o material e o espiritual. Para você, o dinheiro e o sucesso fazem mais sentido quando estão alinhados ao seu propósito e aos seus valores.",
            pontoAtencao: "A resistência inconsciente. Crenças de que espiritualidade e riqueza não caminham juntas podem criar barreiras difíceis de perceber.",
            ponte: "Unir consciência e ação prática permite buscar prosperidade com mais tranquilidade e sem culpa. É esse o caminho que O Código da Prosperidade apresenta."
        }
    };

    // Estado atual do quiz
    let indiceAtual = 0; // Índice da pergunta (0 a 6)
    const respostasUsuario = {}; // Armazena a alternativa escolhida por cada índice de pergunta: { 0: 'A', 1: 'C', ... }

    // Elementos do DOM
    const quizContainer = document.getElementById('quiz-container');
    const quizContador = document.getElementById('quiz-contador');
    const quizSecao = document.getElementById('quiz-secao');
    const resultadoSecao = document.getElementById('resultado-secao');

    if (!quizContainer) return; // Se não estiver na página index.html, interrompe

    // Função para renderizar a pergunta atual na tela
    function renderizarPergunta() {
        const pergunta = perguntas[indiceAtual];
        const totalPerguntas = perguntas.length;
        const respostaSalva = respostasUsuario[indiceAtual] || '';

        // Atualiza o contador e acessibilidade (aria-live)
        quizContador.innerText = `Pergunta ${indiceAtual + 1} de ${totalPerguntas}`;
        quizContador.setAttribute('aria-live', 'polite');

        // Monta o HTML da pergunta e das alternativas
        let html = `
            <div style="margin-bottom: 25px;">
                <h3 style="font-size: 1.25rem; color: var(--cor-dourado-claro); margin-bottom: 20px; line-height: 1.4;">
                    ${pergunta.titulo}
                </h3>
                <div role="radiogroup" aria-label="${pergunta.titulo}" style="display: flex; flexDirection: column; gap: 12px;">
        `;

        pergunta.alternativas.forEach((alt, idx) => {
            const selecionada = respostaSalva === alt.perfil ? 'checked' : '';
            const bordaSelecionada = respostaSalva === alt.perfil ? 'border-color: var(--cor-dourado); background-color: rgba(212, 175, 55, 0.1);' : 'border-color: rgba(212, 175, 55, 0.2); background-color: var(--cor-preto);';
            
            html += `
                <label class="quiz-opcao" style="display: flex; align-items: flex-start; gap: 12px; padding: 16px; border: 1px solid; ${bordaSelecionada} border-radius: 8px; cursor: pointer; transition: var(--transition-base);">
                    <input type="radio" name="pergunta-${pergunta.id}" value="${alt.perfil}" ${selecionada} style="margin-top: 4px; accent-color: var(--cor-dourado);" />
                    <span style="font-size: 1rem; color: var(--cor-texto);">${alt.texto}</span>
                </label>
            `;
        });

        html += `
                </div>
            </div>
            <div id="quiz-erro" style="color: #ef4444; font-size: 0.9rem; margin-bottom: 15px; display: none;">
                Por favor, selecione uma alternativa para continuar.
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 30px;">
                <button id="btn-voltar" class="btn-secundario" ${indiceAtual === 0 ? 'style="visibility: hidden;"' : ''}>Voltar</button>
                <button id="btn-avancar" class="btn-principal">${indiceAtual === totalPerguntas - 1 ? 'Ver Meu Resultado' : 'Avançar'}</button>
            </div>
        `;

        quizContainer.innerHTML = html;

        // Adiciona ouvintes de evento aos botões e opções
        const btnVoltar = document.getElementById('btn-voltar');
        const btnAvancar = document.getElementById('btn-avancar');
        const radios = quizContainer.querySelectorAll('input[type="radio"]');

        // Salva a resposta ao clicar em uma alternativa
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                respostasUsuario[indiceAtual] = e.target.value;
                const erroEl = document.getElementById('quiz-erro');
                if (erroEl) erroEl.style.display = 'none';
                
                // Atualiza estilos visuais das opções
                quizContainer.querySelectorAll('.quiz-opcao').forEach(el => {
                    el.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                    el.style.backgroundColor = 'var(--cor-preto)';
                });
                e.target.closest('label').style.borderColor = 'var(--cor-dourado)';
                e.target.closest('label').style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
            });
        });

        if (btnVoltar) {
            btnVoltar.addEventListener('click', () => {
                if (indiceAtual > 0) {
                    indiceAtual--;
                    renderizarPergunta();
                }
            });
        }

        if (btnAvancar) {
            btnAvancar.addEventListener('click', () => {
                // Validação: não avança sem resposta selecionada
                if (!respostasUsuario[indiceAtual]) {
                    const erroEl = document.getElementById('quiz-erro');
                    if (erroEl) erroEl.style.display = 'block';
                    return;
                }

                if (indiceAtual < totalPerguntas - 1) {
                    indiceAtual++;
                    renderizarPergunta();
                } else {
                    calcularEExibirResultado();
                }
            });
        }
    }

    // Função para calcular o perfil predominante com regra de desempate
    function calcularEExibirResultado() {
        const contagemPerfis = {
            "Desbravador da Prosperidade": 0,
            "Arquiteto da Abundância": 0,
            "Realizador": 0,
            "Guardião do Equilíbrio": 0
        };

        // Conta as respostas de cada perfil
        Object.values(respostasUsuario).forEach(perfil => {
            if (contagemPerfis[perfil] !== undefined) {
                contagemPerfis[perfil]++;
            }
        });

        // Encontra a maior pontuação
        let maiorPontuacao = -1;
        let perfisEmpatados = [];

        for (const [perfil, qtd] of Object.entries(contagemPerfis)) {
            if (qtd > maiorPontuacao) {
                maiorPontuacao = qtd;
                perfisEmpatados = [perfil];
            } else if (qtd === maiorPontuacao) {
                perfisEmpatados.push(perfil);
            }
        }

        let perfilFinal = perfisEmpatados[0];

        // Regra de desempate: se houver empate, vence o perfil escolhido na pergunta 7 (índice 6) se estiver entre os empatados
        const perfilPergunta7 = respostasUsuario[6];
        if (perfisEmpatados.length > 1 && perfisEmpatados.includes(perfilPergunta7)) {
            perfilFinal = perfilPergunta7;
        } else if (perfisEmpatados.length > 1) {
            // Ordem fixa de prioridade se persistir o empate fora da pergunta 7
            const ordemFixa = [
                "Desbravador da Prosperidade",
                "Arquiteto da Abundância",
                "Realizador",
                "Guardião do Equilíbrio"
            ];
            for (const p of ordemFixa) {
                if (perfisEmpatados.includes(p)) {
                    perfilFinal = p;
                    break;
                }
            }
        }

        // Salva o perfil resultante no localStorage para a página de oferta
        localStorage.setItem('perfilPredominante', perfilFinal);

        // Renderiza a seção de resultado
        renderizarResultado(perfilFinal);
    }

    // Função para renderizar o resultado na tela
    function renderizarResultado(perfil) {
        const info = resultadosInfo[perfil];
        if (!info) return;

        // Oculta a seção do quiz e exibe a seção de resultado
        quizSecao.style.display = 'none';
        resultadoSecao.style.display = 'block';

        resultadoSecao.innerHTML = `
            <div style="text-align: center; max-width: 800px; margin: 0 auto;">
                <span style="color: var(--cor-dourado); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Seu Perfil Predominante</span>
                <h2 style="font-size: 2.2rem; color: var(--cor-dourado-claro); margin: 15px 0 30px 0;">${perfil}</h2>
                
                <div style="text-align: left; display: flex; flex-direction: column; gap: 20px; margin-bottom: 40px;">
                    <div style="background-color: var(--cor-preto); padding: 20px; border-radius: 8px; border-left: 4px solid var(--cor-dourado);">
                        <h4 style="color: var(--cor-dourado); margin-bottom: 8px; font-size: 1.1rem;">1. Espelho (Como você age)</h4>
                        <p style="color: var(--cor-texto); line-height: 1.7;">${info.espelho}</p>
                    </div>

                    <div style="background-color: var(--cor-preto); padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444;">
                        <h4 style="color: #f87171; margin-bottom: 8px; font-size: 1.1rem;">2. Ponto de Atenção (O que costuma travar)</h4>
                        <p style="color: var(--cor-texto); line-height: 1.7;">${info.pontoAtencao}</p>
                    </div>

                    <div style="background-color: var(--cor-preto); padding: 20px; border-radius: 8px; border-left: 4px solid var(--cor-verde-esmeralda);">
                        <h4 style="color: var(--cor-verde-claro); margin-bottom: 8px; font-size: 1.1rem;">3. A Ponte (O que muda com o método)</h4>
                        <p style="color: var(--cor-texto); line-height: 1.7;">${info.ponte}</p>
                    </div>
                </div>

                <a href="oferta.html" class="btn-principal" style="font-size: 1.1rem; padding: 16px 36px;">Ver o caminho do meu perfil</a>
            </div>
        `;

        // Rola a tela suavemente para o resultado
        resultadoSecao.scrollIntoView({ behavior: 'smooth' });
    }

    // Inicializa o quiz na primeira pergunta
    renderizarPergunta();
});
