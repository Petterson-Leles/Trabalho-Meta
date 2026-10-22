/* Museu dos Smartphones — dados da exposição.
   Todos os números vêm das fontes listadas em SOURCES. Quando não há dado confiável, o campo fica null
   e o site mostra "Dado não confirmado em fonte confiável". */

const SOURCES = {
  chmSimon:   { t: "Computer History Museum — IBM/BellSouth Simon Personal Communicator", u: "https://www.computerhistory.org/revolution/mobile-computing/18/341/1733" },
  wikiSimon:  { t: "Wikipedia — IBM Simon", u: "https://en.wikipedia.org/wiki/IBM_Simon" },
  smNokia:    { t: "Science Museum Group — Nokia 9000 Communicator (c. 1996)", u: "https://collection.sciencemuseumgroup.org.uk/objects/co8439032/nokia-9000-communicator-mobile-phone-mobile-telephone" },
  tmoBB:      { t: "T-Mobile (press release, jun. 2003) — T-Mobile USA launches new BlackBerry 6210", u: "https://www.t-mobile.com/news/press/t-mobile-usa-launches-new-blackberry-6210" },
  wikiQuark:  { t: "Wikipedia — BlackBerry Quark (série 6210/6220/6230/6280)", u: "https://en.wikipedia.org/wiki/BlackBerry_Quark" },
  wikiBBList: { t: "Wikipedia — List of BlackBerry products", u: "https://en.wikipedia.org/wiki/List_of_BlackBerry_products" },
  apple2007:  { t: "Apple Newsroom (09/01/2007) — Apple Reinvents the Phone with iPhone", u: "https://www.apple.com/newsroom/2007/01/09Apple-Reinvents-the-Phone-with-iPhone/" },
  wikiIphone: { t: "Wikipedia — iPhone (1st generation)", u: "https://en.wikipedia.org/wiki/IPhone_(1st_generation)" },
  apple2008:  { t: "Apple Newsroom (14/07/2008) — iPhone App Store Downloads Top 10 Million in First Weekend", u: "https://www.apple.com/newsroom/2008/07/14iPhone-App-Store-Downloads-Top-10-Million-in-First-Weekend/" },
  oha:        { t: "Open Handset Alliance — Android and Open Handset Alliance Launch (05/11/2007)", u: "https://openhandsetalliance.com/media_room.html" },
  techspotG1: { t: "TechSpot (23/09/2008) — T-Mobile officially unveils first Google Android phone", u: "https://www.techspot.com/news/31750-t-mobile-officially-unveils-first-google-android-phone.html" },
  wikiDream:  { t: "Wikipedia — HTC Dream (T-Mobile G1)", u: "https://en.wikipedia.org/wiki/HTC_Dream" },
  samsungS3:  { t: "Samsung Mobile Press (03/05/2012) — Samsung Introduces the GALAXY S III", u: "https://samsungmobilepress.com/articles/samsung-introduces-the-galaxy-s-iii-the-smartphone-designed-for-humans-and-inspired-by-nature" },
  wikiS3:     { t: "Wikipedia — Samsung Galaxy S III", u: "https://en.wikipedia.org/wiki/Samsung_Galaxy_S_III" },
  samsungS24: { t: "Samsung Newsroom (jan. 2024) — Enter the New Era of Mobile AI With Samsung Galaxy S24 Series", u: "https://news.samsung.com/global/enter-the-new-era-of-mobile-ai-with-samsung-galaxy-s24-series" },
  qcom8g3:    { t: "Qualcomm — Snapdragon 8 Gen 3 Mobile Platform (Product Brief)", u: "https://www.qualcomm.com/content/dam/qcomm-martech/dm-assets/documents/Snapdragon-8-Gen-3-SM8650-Q-AB-Product-Brief.pdf" },
  appleAI:    { t: "Apple Newsroom (10/06/2024) — Introducing Apple Intelligence for iPhone, iPad, and Mac", u: "https://www.apple.com/newsroom/2024/06/introducing-apple-intelligence-for-iphone-ipad-and-mac/" },
  geminiNano: { t: "Android Developers — Gemini Nano (IA no aparelho via AICore)", u: "https://developer.android.com/ai/gemini-nano" },
  armSoC:     { t: "Arm — Glossary: What is SoC Development?", u: "https://www.arm.com/glossary/soc-development" },
  gsma2025:   { t: "GSMA — The State of Mobile Internet Connectivity 2025 (Overview Report)", u: "https://www.gsma.com/somic/wp-content/uploads/2025/09/The-State-of-Mobile-Internet-Connectivity-2025-Overview-Report.pdf" },
  wikiHist:   { t: "Wikipedia — History of smartphones", u: "https://en.wikipedia.org/wiki/History_of_smartphones" }
};

const NC = null; // "não confirmado"

const DEVICES = [
  {
    id: "simon", name: "IBM Simon", short: "Simon", year: 1994, maker: "IBM + BellSouth", emoji: "📟",
    milestone: "Telefone e organizador pessoal no mesmo aparelho",
    phrase: "O primeiro aparelho vendido que juntava telefone celular, agenda e tela sensível ao toque.",
    photo: "img/ibm-simon.jpg",
    history: "Apresentado como protótipo na feira COMDEX em novembro de 1992 e vendido nos EUA pela operadora BellSouth a partir de 16 de agosto de 1994. Custava US$ 899 com contrato de dois anos. Era pensado para profissionais que carregavam celular, agenda eletrônica, pager e fax separados.",
    innovation: "Reuniu em um só objeto telefone, agenda, calendário, bloco de notas, calculadora, relógio mundial, fax e pager — tudo controlado por uma tela sensível ao toque, com caneta (stylus) e teclado na tela.",
    limits: "Pesava cerca de 510 g, a bateria durava em torno de 1 hora de uso, a tela era monocromática e pequena e o preço era alto. Vendeu cerca de 50 mil unidades e saiu de linha em fevereiro de 1995.",
    curiosity: "O Simon já tinha um teclado preditivo na tela, que sugeria letras enquanto o usuário digitava com a caneta — uma ideia que voltaria décadas depois nos teclados dos smartphones.",
    spec: {
      interface: "Tela sensível ao toque (resistiva), monocromática, com caneta stylus",
      cpu: "NEC V30HL de 16 MHz (16 bits), dentro do SoC Vadem VG230",
      ram: "1 MB",
      storage: "1 MB de memória flash (≈2 MB com compressão)",
      screen: "4,5 × 1,4 pol. · 160 × 293 pixels · monocromática",
      network: "Telefonia celular, fax e pager",
      functions: "Telefone, agenda, calendário, notas, calculadora, relógio mundial, fax",
      limits: "≈1 h de bateria · 510 g · US$ 899 · só nos EUA"
    },
    ramMB: 1, storageMB: 1,
    dims: [64, 203, 38],
    sources: ["chmSimon", "wikiSimon"]
  },
  {
    id: "bb6210", name: "BlackBerry 6210", short: "BlackBerry", year: 2003, maker: "Research In Motion (RIM)", emoji: "⌨️",
    milestone: "E-mail no bolso para o mundo do trabalho",
    phrase: "Teclado QWERTY físico, telefone integrado e e-mail que chegava sozinho ao aparelho.",
    photo: null,
    history: "Lançado em 2003. Nos EUA, a operadora T-Mobile anunciou o aparelho em junho de 2003 por US$ 299,99. Era muito usado por executivos e empresas, que precisavam responder e-mails fora do escritório. O modelo anterior com voz, o BlackBerry 5810 (2002), exigia fone de ouvido para falar.",
    innovation: "E-mail \"push\": as mensagens chegavam automaticamente, sem o usuário precisar verificar. Suportava até 10 contas, SMS, agenda, contatos e tarefas sincronizados com o computador, além de aplicativos de terceiros em Java (J2ME). O telefone já vinha integrado ao aparelho.",
    limits: "Tela pequena e monocromática (160 × 100 pixels), navegação na web limitada e foco no uso corporativo. As especificações internas abaixo são da família \"Quark\" (6210/6220/6230/6280), não exclusivas do 6210.",
    curiosity: "No 6210, tocar em um e-mail, número de telefone ou endereço web dentro de uma mensagem já abria uma nova mensagem, fazia a ligação ou abria o link — um sinal de integração entre funções.",
    spec: {
      interface: "Teclado QWERTY físico + tela monocromática",
      cpu: "ARM7 de 32 bits (dado da família Quark)",
      ram: "2 MB de SRAM (dado da família Quark)",
      storage: "16 MB de flash (dado da família Quark)",
      screen: "160 × 100 pixels · monocromática",
      network: "GSM/GPRS (900/1900 MHz)",
      functions: "E-mail push, SMS, telefone, agenda, contatos, tarefas, apps Java",
      limits: "Tela monocromática · web limitada · foco corporativo"
    },
    ramMB: 2, storageMB: 16,
    dims: [75, 113, 20],
    sources: ["tmoBB", "wikiQuark", "wikiBBList"]
  },
  {
    id: "iphone", name: "iPhone (1ª geração)", short: "iPhone", year: 2007, maker: "Apple", emoji: "📱",
    milestone: "Interface multitoque centrada na tela",
    phrase: "Trocou o teclado físico por uma tela grande controlada com os dedos e popularizou a web completa no celular.",
    photo: "img/iphone-2007.jpg",
    history: "Anunciado em 9 de janeiro de 2007 e lançado nos EUA em 29 de junho de 2007 (US$ 499 para 4 GB e US$ 599 para 8 GB). Juntava telefone, tocador de música e navegador de internet. Não foi o primeiro smartphone nem a primeira tela sensível ao toque, mas mudou a forma de interagir com eles.",
    innovation: "Tela multitoque de 3,5 polegadas usada só com os dedos (gestos como rolar e ampliar), navegador Safari com páginas completas, Google Maps, e-mail em HTML, correio de voz visual e sensores de movimento, proximidade e luz ambiente.",
    limits: "Usava a rede EDGE (2G), sem 3G. No lançamento não havia loja de aplicativos: a App Store só chegou em julho de 2008. Bateria não removível e preço alto.",
    curiosity: "Na apresentação, Steve Jobs chamou o multitoque de \"a interface mais revolucionária desde o mouse\". Quando a App Store abriu, em 2008, já tinha mais de 800 aplicativos e passou de 10 milhões de downloads no primeiro fim de semana.",
    spec: {
      interface: "Tela multitoque capacitiva (dedos, sem caneta)",
      cpu: "Samsung S5L8900, ARM de 32 bits a 412 MHz",
      ram: "128 MB",
      storage: "4 ou 8 GB (depois 16 GB) de flash",
      screen: "3,5 pol. · 480 × 320 pixels",
      network: "GSM/EDGE, Wi-Fi 802.11b/g, Bluetooth 2.0",
      functions: "Safari, Mapas, e-mail HTML, música e vídeo, câmera 2 MP, correio de voz visual",
      limits: "Sem 3G · sem loja de apps no lançamento · preço alto"
    },
    ramMB: 128, storageMB: 4096,
    dims: [61, 115, 11.6],
    sources: ["apple2007", "wikiIphone", "apple2008"]
  },
  {
    id: "g1", name: "HTC Dream / T-Mobile G1", short: "T-Mobile G1", year: 2008, maker: "HTC + T-Mobile + Google", emoji: "🌐",
    milestone: "Primeiro smartphone Android comercializado",
    phrase: "Estreou o Android e a loja Android Market, abrindo um novo ecossistema de aplicativos.",
    photo: null,
    history: "O Android foi anunciado em 5 de novembro de 2007 junto com a Open Handset Alliance (Google, HTC, Qualcomm, Motorola, Deutsche Telekom e outras). O G1 foi apresentado em 23 de setembro de 2008, por US$ 179 com contrato, e começou a ser vendido nas lojas da T-Mobile em 22 de outubro de 2008.",
    innovation: "Sistema operacional aberto para vários fabricantes e o primeiro aparelho com acesso ao Android Market. Tinha tela sensível ao toque, teclado QWERTY deslizante, 3G, Wi-Fi, GPS e câmera de 3 MP.",
    limits: "Apenas 256 MB de armazenamento interno, bateria de 1.150 mAh e um sistema ainda em primeira versão (Android 1.0), que recebeu atualizações até o Android 1.6.",
    curiosity: "O G1 chegou às lojas em 22 de outubro de 2008 — exatamente 18 anos antes desta apresentação.",
    spec: {
      interface: "Tela touchscreen capacitiva + teclado QWERTY deslizante + trackball",
      cpu: "Qualcomm MSM7201A, ARM11 a 528 MHz",
      ram: "192 MB",
      storage: "256 MB internos + cartão microSD (1 GB incluso)",
      screen: "3,2 pol. · 320 × 480 pixels",
      network: "3G (HSDPA), EDGE, Wi-Fi, GPS",
      functions: "Android Market, navegador completo, Gmail, Mapas, câmera 3 MP",
      limits: "Pouco armazenamento interno · bateria de 1.150 mAh · Android 1.0 ainda imaturo"
    },
    ramMB: 192, storageMB: 256,
    dims: [55.7, 117.7, 17.1],
    sources: ["oha", "techspotG1", "wikiDream"]
  },
  {
    id: "s3", name: "Samsung Galaxy S III", short: "Galaxy S III", year: 2012, maker: "Samsung", emoji: "📸",
    milestone: "Telas grandes, processadores de 4 núcleos e assistentes de voz",
    phrase: "Tela de 4,8 polegadas em HD, processador de quatro núcleos e recursos inteligentes como S Voice e Smart Stay.",
    photo: null,
    history: "Apresentado em Londres em 3 de maio de 2012 e lançado no fim de maio na Europa. Representa a fase em que o smartphone se tornou o principal aparelho de muitas pessoas: fotos, redes sociais, vídeos e mapas no dia a dia.",
    innovation: "Tela HD Super AMOLED de 4,8 polegadas (1280 × 720), processador de quatro núcleos a 1,4 GHz, câmera de 8 MP, NFC, Bluetooth 4.0, GPS/GLONASS e funções como S Voice (comandos de voz), Smart Stay (a câmera frontal percebe se você está olhando a tela) e S Beam (troca de arquivos encostando dois aparelhos).",
    limits: "Bateria de 2.100 mAh para uma tela grande, assistente de voz com comandos limitados e 4G disponível apenas em alguns mercados.",
    curiosity: "Segundo a Samsung, o S Beam transferia um filme de 1 GB em cerca de três minutos sem usar Wi-Fi nem rede celular. A linha S III vendeu 20 milhões de unidades em 100 dias.",
    spec: {
      interface: "Tela touchscreen multitoque + botão físico de início",
      cpu: "Samsung Exynos 4 Quad, 4 núcleos ARM Cortex-A9 a 1,4 GHz (GPU Mali-400 MP)",
      ram: "Até 2 GB, conforme a versão",
      storage: "16 ou 32 GB (64 GB depois) + microSD até 64 GB",
      screen: "4,8 pol. · 1280 × 720 · Super AMOLED",
      network: "3G HSPA+ (4G em alguns mercados), Wi-Fi n, NFC, Bluetooth 4.0, GPS/GLONASS",
      functions: "S Voice, Smart Stay, S Beam, câmera 8 MP, Android 4.0",
      limits: "Bateria de 2.100 mAh · assistente de voz limitado · 4G só em alguns mercados"
    },
    ramMB: 2048, storageMB: 16384,
    dims: [70.6, 136.6, 8.6],
    sources: ["samsungS3", "wikiS3"]
  },
  {
    id: "s24", name: "Samsung Galaxy S24 Ultra", short: "Galaxy S24 Ultra", year: 2024, maker: "Samsung", emoji: "🧠",
    milestone: "Inteligência artificial integrada ao sistema",
    phrase: "Galaxy AI: tradução de chamadas, resumos, transcrição, busca com um círculo e edição de fotos com IA generativa.",
    photo: "img/galaxy-s24-ultra.jpg",
    history: "Apresentado no Galaxy Unpacked de janeiro de 2024 como o início da \"nova era da IA móvel\" da Samsung. Exemplo da geração em que a inteligência artificial passa a fazer parte de funções básicas: ligações, mensagens, notas, fotos e busca.",
    innovation: "Recursos Galaxy AI verificados: Live Translate (tradução de chamadas), Interpreter (conversa traduzida em tela dividida, funciona sem internet), Chat Assist, Note Assist, Transcript Assist, Circle to Search com Google e Generative Edit. Primeiro Galaxy com estrutura de titânio.",
    limits: "Vários recursos de IA exigem conexão com a internet e conta Samsung; a própria Samsung avisa que não garante a precisão das respostas da IA. Bateria ainda precisa de recarga diária no uso intenso e o aparelho é caro.",
    curiosity: "O chip Snapdragon 8 Gen 3 tem uma NPU (Hexagon) e, segundo a Qualcomm, consegue executar modelos de IA de até 10 bilhões de parâmetros inteiramente no aparelho.",
    spec: {
      interface: "Tela multitoque de 6,8 pol. + caneta S Pen + voz",
      cpu: "Snapdragon 8 Gen 3 for Galaxy (CPU Kryo, GPU Adreno, NPU Hexagon)",
      ram: "12 GB",
      storage: "256 GB, 512 GB ou 1 TB",
      screen: "6,8 pol. · QHD+ · Dynamic AMOLED 2X · 1–120 Hz",
      network: "5G, Wi-Fi, Bluetooth, GPS",
      functions: "Galaxy AI (tradução, resumos, transcrição, Circle to Search, edição generativa), câmera 200 MP",
      limits: "Muitos recursos de IA dependem da nuvem · respostas da IA podem errar · preço alto"
    },
    ramMB: 12288, storageMB: 262144,
    dims: [79, 162.3, 8.6],
    sources: ["samsungS24", "qcom8g3"]
  },
  {
    id: "future", name: "Próxima geração", short: "Futuro", year: "Futuro", maker: "Conceito do autor", emoji: "🔮",
    concept: true,
    milestone: "Visão de futuro — conceito, não produto anunciado",
    phrase: "Um assistente que entende voz, imagem e texto, roda modelos maiores no próprio aparelho e conecta tarefas entre apps.",
    photo: null,
    history: "Este card não mostra um produto real. É uma projeção baseada em tendências que já aparecem em anúncios de fabricantes: mais IA executada no próprio aparelho, assistentes que entendem o que está na tela e integração entre aplicativos.",
    innovation: "Possibilidades: assistentes de IA mais contextuais; processamento local de modelos mais avançados; interação por voz, imagem e texto ao mesmo tempo; tarefas que atravessam vários aplicativos; chips mais eficientes para gastar menos bateria.",
    limits: "Desafios que continuam: privacidade dos dados pessoais, segurança contra golpes e invasões, consumo de energia, custo dos aparelhos e risco de dependência da tecnologia.",
    curiosity: "Parte disso já começou: o Android oferece a IA Gemini Nano rodando no aparelho, e a Apple combina IA no aparelho com servidores próprios (Private Cloud Compute) para pedidos mais complexos.",
    spec: {
      interface: "Conceito: voz + imagem + texto, com assistente contextual",
      cpu: "Conceito: SoC com NPU mais potente e eficiente",
      ram: "Não se aplica (conceito)",
      storage: "Não se aplica (conceito)",
      screen: "Não se aplica (conceito)",
      network: "Conceito: IA híbrida, no aparelho e na nuvem",
      functions: "Conceito: tarefas entre apps, resumos, tradução, ajuda personalizada",
      limits: "Privacidade · segurança · energia · custo"
    },
    ramMB: null, storageMB: null,
    dims: [72, 150, 7.5],
    sources: ["geminiNano", "appleAI", "qcom8g3"]
  }
];

const SPEC_ROWS = [
  ["interface", "Tipo de interface"],
  ["cpu", "Processamento"],
  ["ram", "Memória RAM"],
  ["storage", "Armazenamento"],
  ["screen", "Tela"],
  ["network", "Conectividade"],
  ["functions", "Funções disponíveis"],
  ["limits", "Limitações"]
];

const PARTS = {
  soc:   { title: "SoC — o \"computador em um chip\"", icon: "🧩",
           text: "System on a Chip: um único chip reúne CPU, GPU, NPU, processador de imagem e controladores. Em um PC de mesa, essas partes costumam ficar em chips e placas separados. Juntar tudo economiza espaço e energia — essencial para caber no bolso.",
           example: "O IBM Simon (1994) já usava um SoC simples, o Vadem VG230. O Snapdragon 8 Gen 3 (2023) reúne CPU, GPU, NPU e processador de imagem em 4 nm.",
           src: ["armSoC", "wikiSimon", "qcom8g3"] },
  cpu:   { title: "CPU — o processador principal", icon: "⚙️",
           text: "Executa as instruções do sistema e dos aplicativos: abrir um app, calcular, organizar tarefas. Os celulares usam quase sempre a arquitetura ARM, pensada para gastar pouca energia.",
           example: "Simon: 16 MHz. iPhone 2007: 412 MHz. Galaxy S III: 4 núcleos a 1,4 GHz. Snapdragon 8 Gen 3: núcleo principal de até 3,3 GHz.",
           src: ["wikiSimon", "wikiIphone", "wikiS3", "qcom8g3"] },
  gpu:   { title: "GPU — o processador gráfico", icon: "🎮",
           text: "Desenha tudo o que aparece na tela: ícones, animações, vídeos e jogos. Trabalha em paralelo com milhares de pixels ao mesmo tempo.",
           example: "Galaxy S III: GPU Mali-400 MP. Snapdragon 8 Gen 3: GPU Adreno com ray tracing (iluminação realista) por hardware.",
           src: ["wikiS3", "qcom8g3"] },
  npu:   { title: "NPU — o acelerador de inteligência artificial", icon: "🧠",
           text: "Um bloco especializado em cálculos de redes neurais. Faz tarefas de IA — reconhecer rostos em fotos, transcrever voz, traduzir — gastando bem menos energia do que a CPU.",
           example: "A NPU Hexagon do Snapdragon 8 Gen 3 executa, segundo a Qualcomm, modelos de até 10 bilhões de parâmetros no próprio aparelho.",
           src: ["qcom8g3"] },
  ram:   { title: "RAM — memória de trabalho", icon: "🗂️",
           text: "Memória rápida e temporária onde ficam os aplicativos abertos. Quanto mais RAM, mais apps ficam prontos ao mesmo tempo. Ao desligar, o conteúdo da RAM se apaga.",
           example: "1 MB no IBM Simon → 128 MB no iPhone 2007 → 12 GB no Galaxy S24 Ultra: cerca de 12 mil vezes mais.",
           src: ["wikiSimon", "wikiIphone", "samsungS24"] },
  flash: { title: "Armazenamento flash", icon: "💾",
           text: "Onde ficam sistema, aplicativos, fotos e arquivos. Diferente da RAM, não perde os dados quando o aparelho desliga. Não tem partes móveis, por isso resiste a quedas melhor que um disco rígido.",
           example: "1 MB no Simon → 4 a 8 GB no iPhone 2007 → até 1 TB no Galaxy S24 Ultra.",
           src: ["wikiSimon", "apple2007", "samsungS24"] },
  battery: { title: "Bateria", icon: "🔋",
           text: "Bateria de íons de lítio que alimenta todos os componentes. Telas maiores, 5G e IA consomem mais, por isso a eficiência dos chips é tão importante.",
           example: "Simon: cerca de 1 hora de uso. G1: 1.150 mAh. Galaxy S III: 2.100 mAh. Galaxy S24 Ultra: 5.000 mAh. Ainda é uma das maiores limitações.",
           src: ["wikiSimon", "wikiDream", "samsungS3", "samsungS24"] },
  sensors: { title: "Sensores e câmeras", icon: "📡",
           text: "Acelerômetro (gira a tela), sensor de proximidade (apaga a tela no ouvido), luz ambiente, GPS, câmeras e microfones permitem que o celular perceba o mundo ao redor.",
           example: "iPhone 2007: acelerômetro, proximidade e luz ambiente. G1 (2008): GPS. Galaxy S III: Smart Stay usava a câmera frontal para saber se você olhava a tela.",
           src: ["apple2007", "wikiDream", "samsungS3"] },
  touch: { title: "Tela sensível ao toque", icon: "👆",
           text: "A camada de toque fica sobre a tela. As telas resistivas reagem à pressão (bom para caneta). As capacitivas detectam a eletricidade do dedo e reconhecem vários toques ao mesmo tempo (multitoque).",
           example: "IBM Simon: tela resistiva com caneta. iPhone 2007 e G1: telas capacitivas usadas com os dedos.",
           src: ["wikiSimon", "apple2007", "wikiDream"] }
};

const AI_MODES = [
  { id: "device", icon: "📱", title: "IA no próprio aparelho",
    how: "O modelo de IA roda no chip do celular (CPU, GPU e NPU). Os dados não precisam sair do aparelho.",
    examples: [
      ["Gemini Nano (Android): resumos, revisão de texto e descrição de imagens, inclusive sem internet", "geminiNano"],
      ["Interpreter (Galaxy S24): conversa traduzida em tela dividida, funciona sem dados nem Wi-Fi", "samsungS24"],
      ["Image Playground (Apple): cria imagens inteiramente no aparelho", "appleAI"]
    ],
    pros: "Mais privacidade, funciona offline, resposta rápida, sem custo de servidor.",
    cons: "Modelos menores, limite de memória e bateria; o desempenho varia conforme o aparelho." },
  { id: "cloud", icon: "☁️", title: "IA na nuvem",
    how: "O pedido é enviado pela internet para servidores com modelos grandes, e a resposta volta para o celular.",
    examples: [
      ["Circle to Search com Google: exige conexão com a internet", "samsungS24"],
      ["Generative Edit (Galaxy S24): edição de fotos com IA generativa exige rede e conta Samsung", "samsungS24"],
      ["ChatGPT integrado à Siri: só com permissão do usuário a cada envio", "appleAI"]
    ],
    pros: "Modelos muito mais poderosos e atualizados, sem pesar no aparelho.",
    cons: "Depende de internet, pode ter atraso e exige confiar dados pessoais a um servidor." },
  { id: "hybrid", icon: "🔀", title: "IA híbrida",
    how: "O aparelho resolve o que consegue localmente e manda para a nuvem apenas os pedidos mais complexos.",
    examples: [
      ["Apple Intelligence: modelos no aparelho + Private Cloud Compute para pedidos complexos", "appleAI"],
      ["Android: \"inferência híbrida\" que usa o Gemini Nano e encaminha casos difíceis para modelos na nuvem", "geminiNano"],
      ["Galaxy AI: parte dos recursos no aparelho, parte dependente de rede", "samsungS24"]
    ],
    pros: "Equilíbrio entre privacidade, velocidade e poder de processamento.",
    cons: "Mais complexa; o usuário nem sempre sabe onde cada dado é processado." }
];
