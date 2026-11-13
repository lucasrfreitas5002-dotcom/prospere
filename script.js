/* Roleta Mística: lógica da aplicação (JavaScript puro, sem dependências).
   Fluxo: login (nome) → roleta (3 giros) → conclusão → volta ao login. */
(() => {
  'use strict';

  const BANCO = Array.isArray(window.BANCO_CARTAS) ? window.BANCO_CARTAS : [];
  const TOTAL_GIROS = 3;
  const DURACAO_GIRO_MS = 4600;   // precisa bater com a transição do CSS (.roda-grupo)
  const VOLTAS_EXTRAS = 6;        // voltas completas antes de parar na carta sorteada

  const SIMBOLO_GRUPO = { 'Arcanos Maiores': '✦' };
  const SIMBOLO_NAIPE = { Paus: '▲', Copas: '▼', Espadas: '△', Ouros: '▽' };
  const SIGNOS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

  const $ = {
    login: document.getElementById('tela-login'),
    form: document.getElementById('form-login'),
    usuario: document.getElementById('usuario'),
    erroLogin: document.getElementById('erro-login'),
    roleta: document.getElementById('tela-roleta'),
    btnVoltar: document.getElementById('btn-voltar'),
    saudacao: document.getElementById('saudacao'),
    contador: document.getElementById('contador'),
    progresso: document.querySelectorAll('.progresso li'),
    roda: document.getElementById('roda'),
    btnGirar: document.getElementById('btn-girar'),
    resultado: document.getElementById('resultado'),
    posicao: document.getElementById('cf-posicao'),
    face: document.getElementById('carta-face'),
    numero: document.getElementById('cf-numero'),
    simbolo: document.getElementById('cf-simbolo'),
    nome: document.getElementById('cf-nome'),
    grupoCarta: document.getElementById('cf-grupo'),
    chaves: document.getElementById('cf-chaves'),
    descricao: document.getElementById('cf-descricao'),
    btnFinalizar: document.getElementById('btn-finalizar'),
    fim: document.getElementById('tela-fim'),
    btnOk: document.getElementById('btn-ok'),
    estrelas: document.querySelector('.estrelas'),
    img: document.getElementById('cf-img')
  };

  const estado = {
    usuario: '',
    disponiveis: [],   // índices ainda não sorteados nesta consulta (sem reposição)
    giros: 0,
    girando: false,
    rotacao: 0,        // graus acumulados da roda
    ultimoIdx: null
  };

  let grupoRoda = null; // <g> que gira, criado em montarRoda()

  // ---------- Utilidades ----------
  const mod360 = (graus) => ((graus % 360) + 360) % 360;

  // Inteiro uniforme em [0, max) usando crypto.getRandomValues quando disponível.
  function inteiroAleatorio(max) {
    if (window.crypto && window.crypto.getRandomValues) {
      const limite = Math.floor(4294967296 / max) * max; // evita viés de módulo
      const buf = new Uint32Array(1);
      let valor;
      do {
        window.crypto.getRandomValues(buf);
        valor = buf[0];
      } while (valor >= limite);
      return valor % max;
    }
    return Math.floor(Math.random() * max);
  }

  // Sorteia uma carta ainda não usada nesta consulta.
  function sortearIndice() {
    const k = inteiroAleatorio(estado.disponiveis.length);
    return estado.disponiveis.splice(k, 1)[0];
  }

  function validarBanco() {
    return BANCO.length === 78 && BANCO.every((c) =>
      c && typeof c.nome === 'string' && typeof c.significado === 'string' && Array.isArray(c.palavrasChave)
    );
  }

  // ---------- Telas e mensagens ----------
  function mostrarTela(tela) {
    [$.login, $.roleta, $.fim].forEach((t) => { t.hidden = t !== tela; });
    if (tela === $.login) $.usuario.focus();
  }

  function mostrarErro(msg) {
    $.erroLogin.textContent = msg;
    $.erroLogin.hidden = !msg;
  }

  function criarEstrelas(qtd = 70) {
    if (!$.estrelas) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < qtd; i++) {
      const s = document.createElement('span');
      const tamanho = Math.random() < 0.2 ? 3 : 2;
      s.className = 'estrela';
      s.style.left = (Math.random() * 100).toFixed(2) + '%';
      s.style.top = (Math.random() * 100).toFixed(2) + '%';
      s.style.width = tamanho + 'px';
      s.style.height = tamanho + 'px';
      s.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
      frag.appendChild(s);
    }
    $.estrelas.appendChild(frag);
  }

  // ---------- Roda ----------
  function montarRoda() {
    const passo = 360 / BANCO.length;

    const cartas = BANCO.map((carta, i) => {
      return `<g transform="rotate(${(i * passo).toFixed(4)})">` +
        `<rect data-i="${i}" x="-4.5" y="-176" width="9" height="26" rx="1.5" fill="url(#patternVerso)" stroke="#d4af37" stroke-width=".4"/>` +
        `</g>`;
    }).join('');

    const signos = SIGNOS.map((glifo, k) => {
      const a = (k * 30) * Math.PI / 180;
      const x = (124 * Math.sin(a)).toFixed(1);
      const y = (-124 * Math.cos(a)).toFixed(1);
      return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="13" fill="#d4af37">${glifo}</text>`;
    }).join('');

    const pontosEstrela = [];
    for (let k = 0; k < 16; k++) {
      const r = k % 2 ? 30 : 58;
      const a = (k * 22.5) * Math.PI / 180;
      pontosEstrela.push(`${(r * Math.sin(a)).toFixed(1)},${(-r * Math.cos(a)).toFixed(1)}`);
    }

    $.roda.innerHTML =
      `      <defs>
        <linearGradient id="gOuro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3d77a"/><stop offset="1" stop-color="#8a6512"/></linearGradient>
        <linearGradient id="gRoxo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6d3fc4"/><stop offset="1" stop-color="#1a0b2e"/></linearGradient>
        <radialGradient id="gHub"><stop offset="0" stop-color="#4b2d7a"/><stop offset="1" stop-color="#120822"/></radialGradient>
        <pattern id="patternVerso" width="9" height="26" patternUnits="userSpaceOnUse">
          <image href="assets/cartas/verso.webp" width="9" height="26" preserveAspectRatio="none"/>
        </pattern>
      </defs>
      <circle r="192" fill="none" stroke="#d4af37" stroke-width="3"/>
      <circle r="182" fill="none" stroke="#2d1450" stroke-width="12"/>
      <g id="roda-grupo" class="roda-grupo">
        ${cartas}
        <circle r="142" fill="none" stroke="#d4af37" stroke-width="1" stroke-dasharray="2 4"/>
        ${signos}
        <circle r="104" fill="url(#gHub)" stroke="#d4af37" stroke-width="2"/>
        <polygon points="${pontosEstrela.join(' ')}" fill="none" stroke="#f3d77a" stroke-width="1.2"/>
        <circle r="12" fill="#f4efe6"/>
      </g>`;

    grupoRoda = document.getElementById('roda-grupo');
  }

  function marcarNaRoda(idx) {
    if (estado.ultimoIdx !== null) {
      const anterior = $.roda.querySelector(`rect[data-i="${estado.ultimoIdx}"]`);
      if (anterior) anterior.classList.remove('destaque');
    }
    const atual = $.roda.querySelector(`rect[data-i="${idx}"]`);
    if (atual) atual.classList.add('usada', 'destaque');
    estado.ultimoIdx = idx;
  }

  // ---------- Consulta ----------
  function atualizarProgresso() {
    $.progresso.forEach((li, i) => {
      li.classList.toggle('feito', i < estado.giros);
      li.classList.toggle('atual', i === estado.giros && estado.giros < TOTAL_GIROS);
    });
  }

  // Reinicia o baralho e a roda. Chamado ao começar uma nova consulta e ao concluir.
  function novaConsulta() {
    estado.disponiveis = BANCO.map((_, i) => i);
    estado.giros = 0;
    estado.girando = false;
    estado.ultimoIdx = null;
    $.roda.querySelectorAll('rect').forEach((r) => r.classList.remove('usada', 'destaque'));
    $.resultado.hidden = true;
    $.btnGirar.hidden = false;
    $.btnGirar.disabled = false;
    $.btnFinalizar.hidden = true;
    $.contador.textContent = '';
    atualizarProgresso();
  }

  function girar() {
    if (estado.girando || estado.giros >= TOTAL_GIROS || estado.disponiveis.length === 0 || !grupoRoda) return;

    estado.girando = true;
    $.btnGirar.disabled = true;
    $.resultado.hidden = true;
    $.contador.textContent = 'A roleta está girando…';

    // O sorteio acontece aqui, na lógica. A animação só mostra o resultado já escolhido.
    const idx = sortearIndice();
    const passo = 360 / BANCO.length;
    const base = mod360(estado.rotacao);
    const alvo = mod360(-idx * passo); // a carta sorteada precisa chegar ao topo, sob o ponteiro
    estado.rotacao += VOLTAS_EXTRAS * 360 + mod360(alvo - base);
    grupoRoda.style.transform = `rotate(${estado.rotacao}deg)`;

    setTimeout(() => revelar(idx), DURACAO_GIRO_MS + 100);
  }

  function revelar(idx) {
    const carta = BANCO[idx];
    estado.giros += 1;
    estado.girando = false;
    marcarNaRoda(idx);

    $.numero.textContent = carta.numero;
    if ($.img) {
      $.img.src = carta.imagem;
      $.img.alt = carta.nome;
    }
    $.simbolo.textContent = carta.naipe ? SIMBOLO_NAIPE[carta.naipe] : SIMBOLO_GRUPO[carta.grupo] || '✦';
    $.nome.textContent = carta.nome;
    $.grupoCarta.textContent = carta.naipe ? `${carta.grupo} · ${carta.naipe}` : carta.grupo;
    $.chaves.replaceChildren(...carta.palavrasChave.map((p) => {
      const li = document.createElement('li');
      li.textContent = p;
      return li;
    }));
    $.descricao.textContent = carta.significado;
    $.posicao.textContent = `Giro ${estado.giros} de ${TOTAL_GIROS}`;

    $.resultado.hidden = false;
    $.face.classList.remove('virar');
    void $.face.offsetWidth; // reinicia a animação de revelação
    $.face.classList.add('virar');

    atualizarProgresso();

    if (estado.giros >= TOTAL_GIROS) {
      $.btnGirar.hidden = true;
      $.btnFinalizar.hidden = false;
      $.contador.textContent = 'Os 3 giros foram concluídos.';
    } else {
      $.btnGirar.disabled = false;
      $.contador.textContent = `${estado.giros} de ${TOTAL_GIROS} giros realizados`;
    }
  }

  // ---------- Eventos ----------
  $.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = $.usuario.value.trim();
    if (nome.length < 2) {
      mostrarErro('Digite um nome com pelo menos 2 caracteres.');
      $.usuario.focus();
      return;
    }
    mostrarErro('');
    estado.usuario = nome;
    $.saudacao.textContent = `Olá, ${nome}`;
    novaConsulta();
    mostrarTela($.roleta);
  });

  $.btnGirar.addEventListener('click', girar);

  $.btnVoltar.addEventListener('click', () => {
    if (estado.girando) return;
    novaConsulta();
    mostrarTela($.login);
  });

  // Concluir: reseta a consulta e mostra a tela de parabéns.
  $.btnFinalizar.addEventListener('click', () => {
    novaConsulta();
    mostrarTela($.fim);
  });

  // OK: volta à tela de login.
  $.btnOk.addEventListener('click', () => {
    estado.usuario = '';
    $.usuario.value = '';
    mostrarErro('');
    mostrarTela($.login);
  });

  // ---------- Inicialização ----------
  try {
    if (!validarBanco()) throw new Error('Banco de cartas inválido ou incompleto (esperado: 78 cartas).');
    criarEstrelas();
    montarRoda();
    novaConsulta();
  } catch (err) {
    console.error(err);
    mostrarErro('Não foi possível carregar as cartas. Confira se a pasta "data" está junto do index.html.');
    $.form.querySelector('button').disabled = true;
  }

  mostrarTela($.login);
})();
