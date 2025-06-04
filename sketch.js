// Variáveis do jogo
let imgPersonagem;
let imgLixo;
let estadoJogo = "menu";
let posicaoX = 200;
let posicaoY = 200;
let velocidadeNormal = 2;
let velocidadeCorrendo = 4;
let lixos = [];
let lixosColetados = 0;
let totalDeLixos = 5;
let nivelAtual = 1;
let mostrandoCreditos = false; // Nova variável para controlar a exibição dos créditos

function preload() {
  // Carregar imagens (substitua pelos seus arquivos)
  imgPersonagem = loadImage('https://cdn-icons-png.flaticon.com/512/686/686589.png'); // Imagem exemplo
  imgLixo = loadImage('https://cdn-icons-png.flaticon.com/512/2553/2553628.png'); // Imagem exemplo
}

function setup() {
  createCanvas(400, 400);
  reiniciarJogo();
}

function draw() {
  switch (estadoJogo) {
    case "menu":
      desenharMenu();
      if (mostrandoCreditos) {
        desenharCreditos();
      }
      break;
    case "jogo":
      atualizarJogo();
      break;
    case "vitoria":
      desenharTelaVitoria();
      break;
  }
}

function reiniciarJogo() {
  // Inicializar lixos
  lixos = [];
  for (let i = 0; i < totalDeLixos; i++) {
    lixos.push({
      x: random(50, 350),
      y: random(50, 350),
      coletado: false,
      tamanho: 25
    });
  }
  lixosColetados = 0;
  
  // Resetar posição do personagem
  posicaoX = 200;
  posicaoY = 200;
}

function desenharMenu() {
  background(220);
  
  // Título
  textAlign(CENTER);
  textSize(24);
  fill(0);
  text("Catador de Lixo", width / 2, 80);
  
  // Instruções
  textSize(14);
  text("Use WASD ou setas para mover\nSegure ESPAÇO para correr\nRecolha os lixos passando por cima", width / 2, 150);

  // Botão de iniciar
  fill(100, 200, 100);
  rectMode(CENTER);
  rect(width / 2, 270, 100, 40, 5);
  fill(0);
  text("Iniciar", width / 2, 275);
  
  // Botão de créditos (novo)
  fill(100, 100, 200);
  rect(width / 2, 320, 100, 30, 5);
  fill(255);
  textSize(12);
  text("Créditos", width / 2, 325);
}

function desenharCreditos() {
  // Fundo semi-transparente
  fill(0, 0, 0, 150);
  rectMode(CORNER);
  rect(0, 0, width, height);
  
  // Caixa de créditos
  fill(255);
  rectMode(CENTER);
  rect(width / 2, height / 2, 300, 200, 10);
  
  // Texto dos créditos
  fill(0);
  textAlign(CENTER);
  textSize(18);
  text("Créditos", width / 2, height / 2 - 70);
  
  textSize(14);
  text("Feito por Arthur Marchezi", width / 2, height / 2 - 40);
  text("Colégio Cristo Rei", width / 2, height / 2 - 20);
  text("Professor: Eduardo", width / 2, height / 2);
  text("Projeto Agrinho", width / 2, height / 2 + 20);
  
  // Botão de fechar
  fill(200, 100, 100);
  rect(width / 2, height / 2 + 60, 100, 30, 5);
  fill(255);
  text("Fechar", width / 2, height / 2 + 65);
}

function desenharTelaVitoria() {
  background(100, 200, 100);
  
  // Mensagem de vitória
  textAlign(CENTER);
  textSize(24);
  fill(255);
  text(`Nível ${nivelAtual} completo!`, width / 2, 120);
  textSize(16);
  text(`Você coletou ${totalDeLixos} lixos!`, width / 2, 160);
  text("Próximo nível: " + (totalDeLixos + 2) + " lixos", width / 2, 190);
  
  // Botão de continuar
  fill(200, 100, 100);
  rectMode(CENTER);
  rect(width / 2, 270, 180, 40, 5);
  fill(255);
  text("Próximo Nível", width / 2, 275);
}

function mousePressed() {
  const botaoIniciar = mouseX > width/2 - 50 && mouseX < width/2 + 50 && 
                       mouseY > 250 && mouseY < 290;
  
  const botaoCreditos = mouseX > width/2 - 50 && mouseX < width/2 + 50 && 
                        mouseY > 305 && mouseY < 335;
  
  const botaoFecharCreditos = mostrandoCreditos && 
                              mouseX > width/2 - 50 && mouseX < width/2 + 50 && 
                              mouseY > height/2 + 45 && mouseY < height/2 + 75;
  
  if (estadoJogo === "menu") {
    if (botaoIniciar) {
      estadoJogo = "jogo";
      reiniciarJogo();
    } else if (botaoCreditos) {
      mostrandoCreditos = true;
    } else if (botaoFecharCreditos) {
      mostrandoCreditos = false;
    }
  } 
  else if (estadoJogo === "vitoria" && botaoIniciar) {
    // Aumenta a dificuldade para o próximo nível
    nivelAtual++;
    totalDeLixos += 2; // Aumenta a quantidade de lixo
    estadoJogo = "jogo";
    reiniciarJogo();
  }
}

function atualizarJogo() {
  // Desenhar cenário
  background(135, 206, 235); // Céu
  fill(34, 139, 34);         // Grama
  rect(0, 300, width, height - 300);
  
  // Atualizar e desenhar lixos
  gerenciarLixos();
  
  // Atualizar e desenhar personagem
  atualizarPersonagem();
  desenharPersonagem();
  
  // Mostrar HUD
  mostrarInformacoes();
  
  // Verificar vitória
  verificarVitoria();
}

function gerenciarLixos() {
  for (let lixo of lixos) {
    if (!lixo.coletado) {
      // Desenhar lixo
      imageMode(CENTER);
      image(imgLixo, lixo.x, lixo.y, lixo.tamanho, lixo.tamanho);
      
      // Verificar colisão
      if (dist(posicaoX + 15, posicaoY + 15, lixo.x, lixo.y) < 20) {
        lixo.coletado = true;
        lixosColetados++;
      }
    }
  }
}

function atualizarPersonagem() {
  const velocidadeAtual = keyIsDown(32) ? velocidadeCorrendo : velocidadeNormal;
  
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) posicaoX = max(0, posicaoX - velocidadeAtual);
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) posicaoX = min(width - 30, posicaoX + velocidadeAtual);
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) posicaoY = max(0, posicaoY - velocidadeAtual);
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) posicaoY = min(height - 30, posicaoY + velocidadeAtual);
}

function desenharPersonagem() {
  imageMode(CENTER);
  // Desenha o personagem (50x50 pixels)
  image(imgPersonagem, posicaoX + 15, posicaoY + 15, 50, 50);
}

function mostrarInformacoes() {
  fill(0);
  textSize(12);
  textAlign(LEFT);
  text(`Lixo: ${lixosColetados}/${totalDeLixos}`, 10, 20);
  text(`Nível: ${nivelAtual}`, 10, 40);
}

function verificarVitoria() {
  if (lixosColetados >= totalDeLixos) {
    estadoJogo = "vitoria";
  }
}