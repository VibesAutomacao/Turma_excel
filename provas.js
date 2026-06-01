// Questões de Excel para o quiz/provas (10 por nível)
// Cada questão: { q, options: [A,B,C,D], correctIndex }

export const PROVAS = {
  easy: [
    {
      q: 'No Excel, qual função soma os valores de um intervalo?',
      options: ['MEDIA(intervalo)', 'SOMA(intervalo)', 'CONT.SES(intervalo;critério)', 'PROCV(valor;matriz;coluna;FALSO)'],
      correctIndex: 1,
    },
    {
      q: 'Qual atalho abre a caixa de “Localizar e Substituir” no Excel?',
      options: ['Ctrl + F', 'Ctrl + H', 'Ctrl + P', 'Ctrl + Z'],
      correctIndex: 1,
    },
    {
      q: 'Para congelar a primeira linha ou coluna, usamos:',
      options: ['Mesclar e Centralizar', 'Classificar e Filtrar', 'Congelar Painéis', 'Validação de Dados'],
      correctIndex: 2,
    },
    {
      q: 'Qual opção cria uma lista de números automaticamente (incrementando)?',
      options: ['Preenchimento Automático (arrastar alça)', 'Somente copiar e colar', 'Duplicar Planilha', 'Converter texto em colunas'],
      correctIndex: 0,
    },
    {
      q: 'Qual função retorna a média de um intervalo?',
      options: ['MÉDIA(intervalo)', 'MAIOR(intervalo)', 'MÍN(intervalo)', 'SE(intervalo;v1;v2)'],
      correctIndex: 0,
    },
    {
      q: 'No Excel, o “%” em uma célula representa:',
      options: ['texto literal', 'um valor decimal multiplicado por 100', 'um erro de fórmula', 'sempre 0'],
      correctIndex: 1,
    },
    {
      q: 'Qual recurso ajuda a destacar valores acima/abaixo de um critério?',
      options: ['Formatação Condicional', 'Validação de Dados', 'Proteção de Planilha', 'Quebra de Página'],
      correctIndex: 0,
    },
    {
      q: 'Para criar uma tabela (Ctrl+T), o objetivo principal é:',
      options: ['embaralhar dados', 'facilitar filtros e referências estruturadas', 'somente mudar a cor das células', 'criar gráficos automaticamente'],
      correctIndex: 1,
    },
    {
      q: 'Qual função retorna o maior valor de um intervalo?',
      options: ['MENOR(intervalo)', 'MÁX(intervalo)', 'CONT.SE(intervalo;critério)', 'SOMA(intervalo)'],
      correctIndex: 1,
    },
    {
      q: 'Em fórmulas, o que significa “$” antes da coluna/linha?',
      options: ['Evita arredondamento', 'Trava referência (referência absoluta)', 'Marca célula como fixa', 'Define formato moeda'],
      correctIndex: 1,
    },
  ],

  medium: [
    {
      q: 'Qual fórmula busca um valor na primeira coluna de uma tabela e retorna o correspondente?',
      options: [
        'PROCV(valor_procurado;matriz_tabela;coluna_retorno;FALSO)',
        'SOMASE(intervalo;critério;faixa_soma)',
        'ÍNDICE(matriz;linha;coluna) sem CORRESP()',
        'SEERRO(valor;valor_se_erro)',
      ],
      correctIndex: 0,
    },
    {
      q: 'Para somar apenas valores que atendem a um critério, usamos:',
      options: ['CONT.SE()', 'SOMASE()', 'TEXTO()', 'DESLOCAR()'],
      correctIndex: 1,
    },
    {
      q: 'Qual função verifica uma condição e retorna um valor se verdadeiro e outro se falso?',
      options: ['E()', 'SE()', 'OU()', 'NÚM.CARACT()'],
      correctIndex: 1,
    },
    {
      q: 'Ao usar CORRESP (MATCH), ela retorna:',
      options: ['o valor encontrado', 'a posição (índice) da correspondência', 'o nome da coluna', 'o resultado final da busca'],
      correctIndex: 1,
    },
    {
      q: 'Em um gráfico, o que é “Eixo Secundário” útil para:',
      options: ['exibir a mesma escala', 'comparar séries com escalas muito diferentes', 'remover legendas', 'fixar células'],
      correctIndex: 1,
    },
    {
      q: 'Qual recurso ajuda a remover duplicidades em uma lista?',
      options: ['Remover Duplicatas', 'Agrupar', 'Consolidar', 'Quebrar Texto'],
      correctIndex: 0,
    },
    {
      q: 'O que a função SEERRO faz?',
      options: ['Substitui valores por erros automaticamente', 'Retorna valor se houver erro', 'Oculta erros de tabela', 'Cria gráfico de erro'],
      correctIndex: 1,
    },
    {
      q: 'Ao usar filtros, a opção “Segmentação de Dados” é típica de:',
      options: ['tabelas e gráficos dinâmicos', 'fórmulas de texto', 'formatação condicional', 'proteção por senha'],
      correctIndex: 0,
    },
    {
      q: 'Para transpor uma matriz (linhas viram colunas), usa-se:',
      options: ['TRANSPOR()', 'TRANSFORMAR', 'INV. MATRIZ', 'TRANSFORMULA'],
      correctIndex: 0,
    },
    {
      q: 'Qual função arredonda um número para cima (ex.: 2,3 vira 3)?',
      options: ['ARRED()', 'ARREDONDAR.PARA.BAIXO()', 'ARREDONDAR.PARA.CIMA()', 'TRUNCAR()'],
      correctIndex: 2,
    },
  ],

  hard: [
    {
      q: 'Qual combinação mais comum para fazer PROCV “melhor” (busca horizontal/precisa) é:',
      options: [
        'ÍNDICE + CORRESP',
        'SOMA + SE',
        'TEXTO + CONCAT',
        'MAIS + MENOS',
      ],
      correctIndex: 0,
    },
    {
      q: 'Em um cenário com várias condições, qual função avalia múltiplos critérios com E (todos verdadeiros) ?',
      options: ['OU()', 'E()', 'NÃO()', 'RESPOSTA()'],
      correctIndex: 1,
    },
    {
      q: 'Qual função retorna a interseção entre duas listas (aproximação conceitual no Excel via recursos modernos)?',
      options: [
        'FILTRAR() / XLOOKUP (dependendo do Excel)',
        'SORTEAR()',
        'PROCURARX()',
        'NÃO existe função para isso',
      ],
      correctIndex: 0,
    },
    {
      q: 'Para concatenar textos com separador, normalmente usa-se:',
      options: ['CONCAT()', 'CONCATENAR() / TEXTO.JUNTAR()', 'SE()', 'SOMA.VALOR()'],
      correctIndex: 1,
    },
    {
      q: 'Qual recurso é mais adequado para consolidar dados de várias planilhas/abas em uma visão?',
      options: ['Classificação manual', 'Consolidar (Consolidar/Importar)', 'Congelar Painéis', 'Ocultar Linhas'],
      correctIndex: 1,
    },
    {
      q: 'Ao trabalhar com tabelas dinâmicas, “Campos” e “Filtros” servem para:',
      options: ['visualizar vídeos', 'organizar e segmentar dados para análise', 'mudar links do player', 'formatar fonte'],
      correctIndex: 1,
    },
    {
      q: 'Qual função retorna o valor absoluto (módulo) de um número?',
      options: ['ABS()', 'MOD()', 'RAIZ()', 'LOG()'],
      correctIndex: 0,
    },
    {
      q: 'Para calcular percentil ou quantis, uma das funções usadas é:',
      options: ['QUARTIL()', 'PERCENTIL.INC()', 'SOMA.PRODUTO()', 'CONT.SE()', ''],
      correctIndex: 1,
    },
    {
      q: 'Ao criar validação de dados com lista suspensa, o conteúdo vem de:',
      options: ['uma fórmula aleatória', 'um intervalo/coluna (ou lista definida)', 'apenas texto fixo digitado', 'o formato de célula'],
      correctIndex: 1,
    },
    {
      q: 'Qual função calcula a soma do produto entre intervalos (útil para ponderação)?',
      options: ['SOMASE()', 'SOMA.PRODUTO()', 'MULT()', 'SOMARX()'],
      correctIndex: 1,
    },
  ],
};

export function getProva(level) {
  const key = level === 'easy' || level === 'medium' || level === 'hard' ? level : 'easy';
  return PROVAS[key];
}

