// Game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 1000;
canvas.height = 600;

// Game state
let gameState = {
    score: 0,
    lives: 3,
    currentLevel: 1,
    gameRunning: true,
    keys: {},
    camera: { x: 0, y: 0 }
};

// Player object
const player = {
    x: 50,
    y: 400,
    width: 32,
    height: 40,
    velX: 0,
    velY: 0,
    speed: 5,
    jumpPower: 15,
    grounded: false,
    color: '#FF6B6B'
};

// Game objects arrays
let platforms = [];
let enemies = [];
let coins = [];
let particles = [];

// Level configurations
const levels = {
    1: {
        platforms: [
            {x: 0, y: 550, width: 300, height: 50},
            {x: 400, y: 500, width: 150, height: 20},
            {x: 650, y: 400, width: 150, height: 20},
            {x: 900, y: 350, width: 200, height: 20},
            {x: 1200, y: 300, width: 150, height: 20},
            {x: 1450, y: 550, width: 300, height: 50}
        ],
        enemies: [
            {x: 450, y: 460, width: 30, height: 30, velX: -1, color: '#8B0000'},
            {x: 950, y: 310, width: 30, height: 30, velX: 1, color: '#8B0000'},
            {x: 1500, y: 510, width: 30, height: 30, velX: -1, color: '#8B0000'}
        ],
        coins: [
            {x: 470, y: 450, width: 20, height: 20},
            {x: 700, y: 350, width: 20, height: 20},
            {x: 950, y: 280, width: 20, height: 20},
            {x: 1250, y: 250, width: 20, height: 20},
            {x: 1550, y: 500, width: 20, height: 20}
        ],
        goal: {x: 1600, y: 480, width: 40, height: 70}
    },
    2: {
        platforms: [
            {x: 0, y: 550, width: 300, height: 50},
            {x: 400, y: 500, width: 150, height: 20},
            {x: 650, y: 430, width: 150, height: 20},
            {x: 900, y: 380, width: 150, height: 20},
            {x: 1150, y: 450, width: 150, height: 20},
            {x: 1400, y: 400, width: 150, height: 20},
            {x: 1650, y: 550, width: 300, height: 50}
        ],
        enemies: [
            {x: 450, y: 460, width: 30, height: 30, velX: -0.6, color: '#4B0082'},
            {x: 950, y: 340, width: 30, height: 30, velX: 0.6, color: '#4B0082'},
            {x: 1750, y: 510, width: 30, height: 30, velX: -0.6, color: '#4B0082'}
        ],
        coins: [
            {x: 470, y: 450, width: 20, height: 20},
            {x: 700, y: 380, width: 20, height: 20},
            {x: 950, y: 330, width: 20, height: 20},
            {x: 1200, y: 400, width: 20, height: 20},
            {x: 1450, y: 350, width: 20, height: 20}
        ],
        goal: {x: 1800, y: 480, width: 40, height: 70}
    },
    3: {
        platforms: [
            {x: 0, y: 550, width: 250, height: 50},
            {x: 350, y: 480, width: 120, height: 20},
            {x: 550, y: 420, width: 120, height: 20},
            {x: 750, y: 350, width: 120, height: 20},
            {x: 950, y: 280, width: 120, height: 20},
            {x: 1150, y: 350, width: 120, height: 20},
            {x: 1350, y: 420, width: 120, height: 20},
            {x: 1550, y: 480, width: 120, height: 20},
            {x: 1750, y: 400, width: 120, height: 20},
            {x: 1950, y: 550, width: 300, height: 50}
        ],
        enemies: [
            {x: 380, y: 440, width: 30, height: 30, velX: -1, color: '#FF1493'},
            {x: 580, y: 380, width: 30, height: 30, velX: 1, color: '#FF1493'},
            {x: 980, y: 240, width: 30, height: 30, velX: -1, color: '#FF1493'},
            {x: 1180, y: 310, width: 30, height: 30, velX: 1, color: '#FF1493'},
            {x: 1580, y: 440, width: 30, height: 30, velX: -1, color: '#FF1493'},
            {x: 2050, y: 510, width: 30, height: 30, velX: -1, color: '#FF1493'}
        ],
        coins: [
            {x: 400, y: 430, width: 20, height: 20},
            {x: 600, y: 370, width: 20, height: 20},
            {x: 800, y: 300, width: 20, height: 20},
            {x: 1000, y: 230, width: 20, height: 20},
            {x: 1200, y: 300, width: 20, height: 20},
            {x: 1400, y: 370, width: 20, height: 20},
            {x: 1800, y: 350, width: 20, height: 20}
        ],
        goal: {x: 2100, y: 480, width: 40, height: 70}
    }
};

// Initialize level
function initLevel(levelNum) {
    const level = levels[levelNum];
    platforms = [...level.platforms];
    enemies = [...level.enemies];
    coins = [...level.coins];
    goal = {...level.goal};
    
    // Reset player position
    player.x = 50;
    player.y = 400;
    player.velX = 0;
    player.velY = 0;
    gameState.camera.x = 0;
}

// Input handling
document.addEventListener('keydown', (e) => {
    gameState.keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    gameState.keys[e.code] = false;
});

// Collision detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Create particle effect
function createParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x,
            y: y,
            velX: (Math.random() - 0.5) * 10,
            velY: Math.random() * -8 - 2,
            life: 30,
            color: color
        });
    }
}

// Update particles
function updateParticles() {
    particles = particles.filter(particle => {
        particle.x += particle.velX;
        particle.y += particle.velY;
        particle.velY += 0.3;
        particle.life--;
        return particle.life > 0;
    });
}

// Draw particles
function drawParticles() {
    particles.forEach(particle => {
        ctx.globalAlpha = particle.life / 30;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x - gameState.camera.x, particle.y, 4, 4);
        ctx.globalAlpha = 1;
    });
}

// Player physics
function updatePlayer() {
    if (!gameState.gameRunning) return;
    
    // Horizontal movement
    if (gameState.keys['ArrowLeft']) {
        player.velX = -player.speed;
    } else if (gameState.keys['ArrowRight']) {
        player.velX = player.speed;
    } else {
        player.velX *= 0.8; // Friction
    }
    
    // Jumping
    if (gameState.keys['Space'] && player.grounded) {
        player.velY = -player.jumpPower;
        player.grounded = false;
    }
    
    // Gravity
    player.velY += 0.8;
    if (player.velY > 15) player.velY = 15;
    
    // Update position
    player.x += player.velX;
    player.y += player.velY;
    
    // Platform collision
    player.grounded = false;
    platforms.forEach(platform => {
        if (checkCollision(player, platform)) {
            if (player.velY > 0 && player.y < platform.y) {
                player.y = platform.y - player.height;
                player.velY = 0;
                player.grounded = true;
            }
        }
    });
    
    // Screen boundaries
    if (player.x < 0) player.x = 0;
    if (player.y > canvas.height) {
        // Player fell off screen
        gameState.lives--;
        updateUI();
        if (gameState.lives <= 0) {
            gameOver();
        } else {
            // Reset player position
            player.x = 50;
            player.y = 400;
            player.velX = 0;
            player.velY = 0;
            gameState.camera.x = 0;
        }
    }
    
    // Update camera
    gameState.camera.x = player.x - canvas.width / 3;
    if (gameState.camera.x < 0) gameState.camera.x = 0;
}

// Update enemies
function updateEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.velX;
        
        // Reverse direction at platform edges
        let onPlatform = false;
        platforms.forEach(platform => {
            if (enemy.y + enemy.height >= platform.y && 
                enemy.y + enemy.height <= platform.y + platform.height + 10 &&
                enemy.x + enemy.width > platform.x && 
                enemy.x < platform.x + platform.width) {
                onPlatform = true;
            }
        });
        
        if (!onPlatform || enemy.x <= 0) {
            enemy.velX *= -1;
        }
        
        // Check collision with player
        if (checkCollision(player, enemy)) {
            gameState.lives--;
            createParticles(player.x + player.width/2, player.y + player.height/2, '#FF0000');
            updateUI();
            if (gameState.lives <= 0) {
                gameOver();
            } else {
                // Reset player position
                player.x = 50;
                player.y = 400;
                player.velX = 0;
                player.velY = 0;
                gameState.camera.x = 0;
            }
        }
    });
}

// Update coins
function updateCoins() {
    coins = coins.filter(coin => {
        if (checkCollision(player, coin)) {
            gameState.score += 100;
            createParticles(coin.x + coin.width/2, coin.y + coin.height/2, '#FFD700');
            updateUI();
            return false; // Remove coin
        }
        return true;
    });
}

// Check goal
function checkGoal() {
    if (checkCollision(player, goal)) {
        if (gameState.currentLevel < 3) {
            levelComplete();
        } else {
            gameWon();
        }
    }
}

// Drawing functions
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - gameState.camera.x, player.y, player.width, player.height);
    
    // Simple face
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(player.x - gameState.camera.x + 8, player.y + 8, 6, 6);
    ctx.fillRect(player.x - gameState.camera.x + 18, player.y + 8, 6, 6);
    ctx.fillStyle = '#000000';
    ctx.fillRect(player.x - gameState.camera.x + 10, player.y + 10, 2, 2);
    ctx.fillRect(player.x - gameState.camera.x + 20, player.y + 10, 2, 2);
}

function drawPlatforms() {
    ctx.fillStyle = '#8B4513';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x - gameState.camera.x, platform.y, platform.width, platform.height);
        
        // Add some texture
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(platform.x - gameState.camera.x, platform.y, platform.width, 5);
        ctx.fillStyle = '#8B4513';
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x - gameState.camera.x, enemy.y, enemy.width, enemy.height);
        
        // Simple angry face
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(enemy.x - gameState.camera.x + 6, enemy.y + 6, 4, 4);
        ctx.fillRect(enemy.x - gameState.camera.x + 16, enemy.y + 6, 4, 4);
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(enemy.x - gameState.camera.x + 10, enemy.y + 16, 8, 4);
    });
}

function drawCoins() {
    coins.forEach(coin => {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(coin.x - gameState.camera.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Add shine effect
        ctx.fillStyle = '#FFF8DC';
        ctx.beginPath();
        ctx.arc(coin.x - gameState.camera.x + coin.width/2 - 3, coin.y + coin.height/2 - 3, 3, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawGoal() {
    ctx.fillStyle = '#32CD32';
    ctx.fillRect(goal.x - gameState.camera.x, goal.y, goal.width, goal.height);
    
    // Flag design
    ctx.fillStyle = '#228B22';
    ctx.fillRect(goal.x - gameState.camera.x, goal.y, 8, goal.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(goal.x - gameState.camera.x + 8, goal.y, 32, 25);
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(goal.x - gameState.camera.x + 8, goal.y + 12, 32, 13);
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update game objects
    updatePlayer();
    updateEnemies();
    updateCoins();
    updateParticles();
    checkGoal();
    
    // Draw everything
    drawPlatforms();
    drawEnemies();
    drawCoins();
    drawGoal();
    drawPlayer();
    drawParticles();
    
    requestAnimationFrame(gameLoop);
}

// UI functions
function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('lives').textContent = gameState.lives;
    document.getElementById('level').textContent = gameState.currentLevel;
}

function gameOver() {
    gameState.gameRunning = false;
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('gameOver').style.display = 'flex';
}

function levelComplete() {
    gameState.gameRunning = false;
    document.getElementById('levelScore').textContent = gameState.score;
    document.getElementById('levelComplete').style.display = 'flex';
}

function gameWon() {
    gameState.gameRunning = false;
    document.getElementById('winScore').textContent = gameState.score;
    document.getElementById('gameWon').style.display = 'flex';
}

function nextLevel() {
    gameState.currentLevel++;
    gameState.gameRunning = true;
    document.getElementById('levelComplete').style.display = 'none';
    initLevel(gameState.currentLevel);
    updateUI();
}

function restartGame() {
    gameState.score = 0;
    gameState.lives = 3;
    gameState.currentLevel = 1;
    gameState.gameRunning = true;
    gameState.camera.x = 0;
    
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('gameWon').style.display = 'none';
    
    initLevel(1);
    updateUI();
}

// Initialize game
initLevel(1);
updateUI();
gameLoop();