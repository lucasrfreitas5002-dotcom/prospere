# Prospere

Projeto integrado de autoconhecimento, reflexão e oferta de e-books do **Prospere**.

## Estrutura Final
- `index.html`: Página inicial com a copy e os três caminhos (Roleta do Prospere, Quiz, Promoção).
- `quiz.html`: Vídeo explicativo do YouTube (nocookie), quiz interativo de 7 perguntas, resultado e seção "Sobre quem criou".
- `oferta.html`: Promoção (e-books) com o link "Voltar ao início", perfil salvo e placeholder do vídeo de fechamento.
- `prospere-roleta/`: Roleta interativa de Tarot com 78 cartas, giros diários e imagens das cartas.
- `css/estilo.css`: Estilos centrais da aplicação (Mobile First).
- `js/quiz.js`: Lógica e desempate do quiz.
- `js/oferta.js`: Lógica da página de ofertas.
- `config/produtos.js`: Dados dos e-books.
- `config/vendedor.js`: Informações do produtor.
- `assets/`: Imagens e recursos visuais.
- `materiais-privados/`: PDFs (ignorada pelo Git).

## Imagens das Cartas de Tarot (Rider-Waite-Smith)
- **Fonte**: Baralho Rider-Waite-Smith (publicado originalmente em 1909, ilustrado por Pamela Colman Smith sob direção de Arthur Edward Waite).
- **Licença**: Domínio Público (devido à antiguidade da obra, anterior a 1929).
- Armazenadas e otimizadas em `prospere-roleta/assets/cartas/` no formato WebP (~400px de largura).

## Como Executar
Basta abrir o arquivo `index.html` diretamente em qualquer navegador web moderno.
