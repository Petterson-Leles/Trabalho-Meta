# Museu dos Smartphones — Uma Viagem no Tempo

Site interativo do trabalho **Smartphones**, de Petterson Leles (META Escola Técnica · Arquitetura de Computadores).
Apresentação: 22/10/2026.

## O que tem no site
- **Exposição (carrossel 3D)**: 7 aparelhos em ordem cronológica — IBM Simon (1994), BlackBerry 6210 (2003), iPhone (2007), HTC Dream/T-Mobile G1 (2008), Galaxy S III (2012), Galaxy S24 Ultra (2024) e um card conceitual do futuro. Setas, toque/deslizar, teclado (← →, Home, End, Enter).
- **Painel do aparelho**: modelo 3D que gira (arrastar, pinça/roda para zoom, botões Frente/Verso/Girar), foto de referência quando disponível, História, Tecnologia, Grande inovação, Limitações, Curiosidade e Fontes.
- **Linha do tempo**: clicar em um ano leva o carrossel ao aparelho.
- **Comparação**: dois aparelhos lado a lado + imagem de todos na mesma escala + gráfico de RAM (escala logarítmica).
- **Por dentro**: placa ilustrada com SoC, CPU, GPU, NPU, RAM, armazenamento, bateria, sensores e tela touch.
- **IA**: no aparelho × na nuvem × híbrida, com exemplos reais e fontes.
- **Fontes**: todos os links usados.

## Estrutura
```
index.html          página
css/style.css       estilos (paleta do projeto, mobile-first)
js/data.js          TODO o conteúdo e as fontes (edite aqui os textos)
js/models.js        modelos 3D ilustrativos (Three.js r128)
js/app.js           interações
vendor/three.min.js Three.js r128 (MIT) — local, sem depender de CDN
img/                fotos de referência (IBM Simon, iPhone, Galaxy S24 Ultra)
```

## Rodar no computador
Abra um terminal na pasta e rode um servidor simples:
```
python -m http.server 8000
```
Depois acesse http://localhost:8000. (Abrir o `index.html` direto também funciona na maioria dos navegadores.)

## Publicar no GitHub Pages
1. Crie um repositório público no GitHub, por exemplo `museu-smartphones`.
2. Envie todos os arquivos desta pasta (botão **Add file → Upload files**, arraste a pasta inteira).
3. Vá em **Settings → Pages**, em *Source* escolha **Deploy from a branch**, branch `main`, pasta `/ (root)` e salve.
4. Em 1–2 minutos o site estará em `https://SEU-USUARIO.github.io/museu-smartphones/`.
5. Para trocar o QR Code do slide final por esse endereço, gere um QR (ex.: no próprio PowerPoint ou em qualquer gerador) e substitua a imagem.

## Sobre os modelos 3D e as imagens
- Os modelos 3D são **representações ilustrativas** criadas para este projeto, com proporções aproximadas (dimensões publicadas). Não são réplicas exatas e não usam logotipos de marcas.
- Sem WebGL, o site mostra a foto de referência ou um ícone.
- As fotos em `img/` são imagens de referência reunidas pelo autor para fins educacionais. Para publicação ampla, prefira substituí-las por imagens com licença livre (ex.: Wikimedia Commons) e citar o autor.

## Tecnologias
HTML, CSS e JavaScript puros + Three.js. Sem backend, sem build, compatível com hospedagem estática.
