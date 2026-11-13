/**
 * config/produtos.js
 * Arquivo único de configuração dos produtos do projeto O Código da Prosperidade.
 * Centraliza preços, descrições, status e regras de recomendação por perfil.
 */

const produtosConfig = {
    // Títulos de oferta personalizados por perfil para a página de vendas
    titulosOfertaPorPerfil: {
        "Desbravador da Prosperidade": "O Caminho Ideal para o Desbravador da Prosperidade",
        "Arquiteto da Abundância": "O Caminho Ideal para o Arquiteto da Abundância",
        "Realizador": "O Caminho Ideal para o Realizador",
        "Guardião do Equilíbrio": "O Caminho Ideal para o Guardião do Equilíbrio"
    },

    // Lista de produtos
    produtos: [
        {
            id: "volume-1",
            nome: "O Código da Prosperidade, Volume 1",
            descricao: "Introdução aos fundamentos essenciais e à mudança de mentalidade para destravar sua relação com a abundância.",
            conteudo: "E-book digital (Volume 1).",
            preco: 14.90,
            linkCheckout: "", // Vazio até definição da plataforma
            status: "em_breve", // 'disponivel', 'em_breve', 'indisponivel'
            recomendadoPara: ["Desbravador da Prosperidade"],
            promocaoAte: "" // Vazio = sem prazo/escassez falsa
        },
        {
            id: "volume-2",
            nome: "O Código da Prosperidade, Volume 2",
            descricao: "Aprofundamento avançado em estratégias práticas de crescimento e expansão financeira.",
            conteudo: "E-book digital completo (Volume 2).",
            preco: 19.90,
            linkCheckout: "",
            status: "em_breve",
            recomendadoPara: ["Guardião do Equilíbrio"],
            promocaoAte: ""
        },
        {
            id: "pacote-completo",
            nome: "Pacote Completo: Volume 1 + Volume 2",
            descricao: "A experiência completa unindo os fundamentos e o aprofundamento avançado para transformar sua jornada.",
            conteudo: "Volume 1 + Volume 2 + Bônus exclusivo.",
            preco: 29.90,
            linkCheckout: "",
            status: "em_breve", // Desativado até confirmação de bônus/checkout
            recomendadoPara: ["Arquiteto da Abundância", "Realizador"],
            promocaoAte: ""
        }
    ],

    // Campo de bônus (mantido vazio conforme regras)
    bonus: {
        titulo: "",
        descricao: "",
        status: "oculto"
    }
};
