const canvas = document.getElementById('fluid-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let points = [];
let mouseColor = 0;

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', init);
init();

window.addEventListener('mousemove', e => {
    for(let i = 0; i < 4; i++) {
        points.push(new FluidPoint(e.clientX, e.clientY));
    }
});

class FluidPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = Math.random() * Math.PI * 2;
        this.velocity = Math.random() * 2 + 1;
        this.vx = Math.cos(this.angle) * this.velocity;
        this.vy = Math.sin(this.angle) * this.velocity;
        this.life = 100;
        this.size = Math.random() * 35 + 15;
        this.hue = mouseColor;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.6;
        this.size += 0.4;
        this.vx *= 0.97;
        this.vy *= 0.97;
    }

    draw() {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 50%, ${this.life / 100})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, 0, width, height);
    mouseColor = (mouseColor + 1) % 360;
    for (let i = points.length - 1; i >= 0; i--) {
        points[i].update();
        points[i].draw();
        if (points[i].life <= 0) points.splice(i, 1);
    }
    requestAnimationFrame(animate);
}

animate();