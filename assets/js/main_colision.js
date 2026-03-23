{
    const canvas = document.getElementById("canvasB");
    let ctx = canvas.getContext("2d");

    canvas.height = window.innerHeight / 2;
    canvas.width = window.innerWidth / 2;

    canvas.style.background = "rgb(136, 255, 144)";

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
            if (this.posX + this.radius > canvas.width || this.posX - this.radius < 0) { this.dx *= -1; }
            if (this.posY + this.radius > canvas.height || this.posY - this.radius < 0) { this.dy *= -1; }
            this.posX += this.dx;
            this.posY += this.dy;
        }
    }

    function detectarColision(c1, c2) {
        let dx = c1.posX - c2.posX;
        let dy = c1.posY - c2.posY;
        return Math.sqrt(dx * dx + dy * dy) < (c1.radius + c2.radius);
    }

    function resolverColision(c1, c2) {
        let tempDx = c1.dx;
        let tempDy = c1.dy;
        c1.dx = c2.dx;
        c1.dy = c2.dy;
        c2.dx = tempDx;
        c2.dy = tempDy;
    }

    let circles = [];
    let N = 12;

    for (let i = 0; i < N; i++) {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let y = Math.random() * (canvas.height - radius * 2) + radius;
        let speed = Math.random() * 4 + 1;
        circles.push(new Circle(x, y, radius, i + 1, speed));
    }

    function update() {
        requestAnimationFrame(update);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const now = performance.now();

        circles.forEach(c => { c.color = now < c.redUntil ? "red" : "blue"; });
        circles.forEach(c => c.move());

        for (let i = 0; i < circles.length; i++) {
            for (let j = i + 1; j < circles.length; j++) {
                if (detectarColision(circles[i], circles[j])) {
                    resolverColision(circles[i], circles[j]);
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