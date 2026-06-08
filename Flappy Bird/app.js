// Phaser Game Configuration
let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: false
    }
  },
  // Fixed scale rules to accurately handle page centering across all display sizes
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let game = new Phaser.Game(config);
let bird;
let columns;
let road;
let cursors;
let scoreText;
let highScoreText;
let messageToPlayer;
let gameOverText;

let score = 0;
let highScore = localStorage.getItem('flappyHighScore') ? parseInt(localStorage.getItem('flappyHighScore')) : 0;
let isGameStarted = false;
let isGameOver = false;
let spawnTimer;

function preload() {
  let canvasTexture = this.textures.createCanvas('birdTexture', 20, 20);
  let ctx = canvasTexture.context;
  ctx.fillStyle = '#ffde3b'; 
  ctx.fillRect(0, 0, 20, 20);
  canvasTexture.refresh();

  let columnTexture = this.textures.createCanvas('columnTexture', 60, 400);
  let ctx2 = columnTexture.context;
  ctx2.fillStyle = '#73bf2e'; 
  ctx2.fillRect(0, 0, 60, 400);
  columnTexture.refresh();

  let roadTexture = this.textures.createCanvas('roadTexture', 800, 40);
  let ctx3 = roadTexture.context;
  ctx3.fillStyle = '#d2b48c'; 
  ctx3.fillRect(0, 0, 800, 40);
  roadTexture.refresh();
}

function create() {
  isGameOver = false;
  isGameStarted = false;
  score = 0;

  this.cameras.main.setBackgroundColor('#71c5cf');

  road = this.physics.add.staticGroup();
  road.create(400, 580, 'roadTexture').refreshBody();

  columns = this.physics.add.group();

  bird = this.physics.add.sprite(200, 250, 'birdTexture');
  bird.setCollideWorldBounds(true);
  bird.body.allowGravity = false; 

  cursors = this.input.keyboard.createCursorKeys();

  scoreText = this.add.text(40, 40, 'Score: 0', { fontSize: '28px', fill: '#fff', fontStyle: 'bold' });
  highScoreText = this.add.text(760, 40, 'High Score: ' + highScore, { fontSize: '28px', fill: '#fff', fontStyle: 'bold' }).setOrigin(1, 0);
  
  messageToPlayer = this.add.text(400, 300, 'Press SPACE BAR to Jump & Start', { fontSize: '24px', fill: '#fff', backgroundColor: '#000000a0', padding: 10 }).setOrigin(0.5);

  gameOverText = this.add.text(400, 520, ' GAME OVER ', { 
    fontSize: '40px', 
    fill: '#fff', 
    fontStyle: 'bold', 
    backgroundColor: '#e74c3c', 
    padding: { x: 20, y: 10 } 
  }).setOrigin(0.5).setVisible(false);

  this.physics.add.collider(bird, road, hitObstacle, null, this);
  this.physics.add.collider(bird, columns, hitObstacle, null, this);

  spawnTimer = this.time.addEvent({
    delay: 1500,
    callback: spawnColumns,
    callbackScope: this,
    loop: true,
    paused: true
  });
}

function update() {
  if (cursors.space.isDown && !isGameStarted && !isGameOver) {
    isGameStarted = true;
    bird.body.allowGravity = true;
    messageToPlayer.setVisible(false);
    spawnTimer.paused = false;
  }

  if (cursors.space.isDown && isGameStarted && !isGameOver) {
    bird.setVelocityY(-330);
  }

  if (isGameStarted && !isGameOver) {
    columns.children.iterate(function (column) {
      if (column) {
        if (column.x < -50) {
          column.destroy();
        }
        if (!column.passed && column.x < bird.x && column.isTop) {
          column.passed = true;
          score++;
          scoreText.setText('Score: ' + score);

          if (score > highScore) {
            highScore = score;
            localStorage.setItem('flappyHighScore', highScore);
            highScoreText.setText('High Score: ' + highScore);
          }
        }
      }
    });
  }
}

function spawnColumns() {
  if (isGameOver) return;

  let gapSize = Math.max(110, 180 - (score * 5)); 
  let minHeight = 50;
  let maxHeight = 380;
  let topColumnHeight = Phaser.Math.Between(minHeight, maxHeight);

  let topColumn = columns.create(850, topColumnHeight - 200, 'columnTexture');
  topColumn.body.allowGravity = false;
  topColumn.setVelocityX(-200); 
  topColumn.isTop = true;
  topColumn.passed = false;

  let bottomColumn = columns.create(850, topColumnHeight + gapSize + 200, 'columnTexture');
  bottomColumn.body.allowGravity = false;
  bottomColumn.setVelocityX(-200); 
  bottomColumn.isTop = false;
}

function hitObstacle() {
  if (isGameOver) return;

  isGameOver = true;
  spawnTimer.paused = true;
  bird.setTint(0xff0000); 
  bird.setVelocity(0, 0); 
  columns.setVelocityX(0);

  gameOverText.setVisible(true);
}