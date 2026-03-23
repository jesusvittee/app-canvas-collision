{
    const canvas = document.getElementById("canvasC");
    let ctx = canvas.getContext("2d");

    canvas.height = window.innerHeight / 2;
    canvas.width = window.innerWidth / 2;

    canvas.style.background = "rgb(200, 230, 255)";

    const RED_DURATION = 500;

    class Circle {
        constructor(x, y, radius, text, speed) {
            this.posX = x;
            this.posY = y;
            this.radius = radius;
            this.color = "blue";
            this.text = text;
            this.speed = speed;
            this.dx = (Math.random() - 0.5) * this.speed;
            this.dy = (Math.random() - 0.5) * this.speed;
            this.redUntil = 0;
        }

        draw(context) {
            context.beginPath();
            context.strokeStyle = this.color;
            context.lineWidth = 2;
            context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
            context.stroke();
            context.fillStyle = this.color;
            context.font = "14px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(this.text, this.posX, this.posY);
            context.closePath();
        }

        move() {
            if (this.posX + this.radius > canvas.width)  { this.posX = canvas.width - this.radius;  this.dx *= -1; }
            if (this.posX - this.radius < 0)              { this.posX = this.radius;                 this.dx *= -1; }
            if (this.posY + this.radius > canvas.height)  { this.posY = canvas.height - this.radius; this.dy *= -1; }
            if (this.posY - this.radius < 0)              { this.posY = this.radius;                 this.dy *= -1; }
            this.posX += this.dx;
            this.posY += this.dy;
        }
    }

    function detectarColision(c1, c2) {
        let dx = c1.posX - c2.posX;
        let dy = c1.posY - c2.posY;
        let dist = Math.sqrt(dx * dx + dy * dy);
        return { colision: dist < (c1.radius + c2.radius), dist, dx, dy };
    }

    function resolverRebote(c1, c2, dx, dy, dist) {
        let nx = dx / dist;
        let ny = dy / dist;

        let overlap = (c1.radius + c2.radius) - dist;
        c1.posX += nx * overlap / 2;
        c1.posY += ny * overlap / 2;
        c2.posX -= nx * overlap / 2;
        c2.posY -= ny * overlap / 2;

        let dvx = c1.dx - c2.dx;
        let dvy = c1.dy - c2.dy;
        let dot = dvx * nx + dvy * ny;

        if (dot > 0) {
            c1.dx -= dot * nx;
            c1.dy -= dot * ny;
            c2.dx += dot * nx;
            c2.dy += dot * ny;
        }
    }

    let circles = [];
    let N = 12;

    for (let i = 0; i < N; i++) {
        let intentos = 0;
        let colocado = false;
        while (!colocado && intentos < 200) {
            let radius = Math.random() * 30 + 20;
            let x = Math.random() * (canvas.width - radius * 2) + radius;
            let y = Math.random() * (canvas.height - radius * 2) + radius;
            let speed = Math.random() * 4 + 2;
            let solapa = circles.some(c => {
                let dx = c.posX - x;
                let dy = c.posY - y;
                return Math.sqrt(dx * dx + dy * dy) < (c.radius + radius + 2);
            });
            if (!solapa) {
                circles.push(new Circle(x, y, radius, i + 1, speed));
                colocado = true;
            }
            intentos++;
        }
    }

    function update() {
        requestAnimationFrame(update);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const now = performance.now();

        circles.forEach(c => { c.color = now < c.redUntil ? "red" : "blue"; });
        circles.forEach(c => c.move());

        for (let i = 0; i < circles.length; i++) {
            for (let j = i + 1; j < circles.length; j++) {
                let { colision, dist, dx, dy } = detectarColision(circles[i], circles[j]);
                if (colision) {
                    resolverRebote(circles[i], circles[j], dx, dy, dist);
                    circles[i].redUntil = now + RED_DURATION;
                    circles[j].redUntil = now + RED_DURATION;
                    circles[i].color = "red";
                    circles[j].color = "red";
                }
            }
        }

        circles.forEach(c => c.draw(ctx));
    }

    update();
}