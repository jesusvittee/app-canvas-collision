const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height / 2;
canvas.width = window_width / 2;

canvas.style.background = "rgb(136, 255, 144)";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;

        // dirección aleatoria
        this.dx = (Math.random() - 0.5) * this.speed;
        this.dy = (Math.random() - 0.5) * this.speed;
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

    update(context) {
        this.draw(context);

        // rebote con paredes
        if (this.posX + this.radius > canvas.width || this.posX - this.radius < 0) {
            this.dx *= -1;
        }

        if (this.posY + this.radius > canvas.height || this.posY - this.radius < 0) {
            this.dy *= -1;
        }

        this.posX += this.dx;
        this.posY += this.dy;
    }
}

// 🔥 FUNCIÓN DE COLISIÓN
function detectarColision(c1, c2) {
    let dx = c1.posX - c2.posX;
    let dy = c1.posY - c2.posY;
    let distancia = Math.sqrt(dx * dx + dy * dy);

    return distancia < (c1.radius + c2.radius);
}

// 🔥 RESPUESTA DE COLISIÓN (rebote simple)
function resolverColision(c1, c2) {
    let tempDx = c1.dx;
    let tempDy = c1.dy;

    c1.dx = c2.dx;
    c1.dy = c2.dy;

    c2.dx = tempDx;
    c2.dy = tempDy;
}

// 🔥 CREAR N CÍRCULOS
let circles = [];
let N = 12; // puedes cambiar la cantidad

for (let i = 0; i < N; i++) {
    let radius = Math.random() * 30 + 20;

    let x = Math.random() * (canvas.width - radius * 2) + radius;
    let y = Math.random() * (canvas.height - radius * 2) + radius;

    let speed = Math.random() * 4 + 1;

    circles.push(new Circle(x, y, radius, "blue", i + 1, speed));
}

// 🔥 ANIMACIÓN
function update() {
    requestAnimationFrame(update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // actualizar círculos
    circles.forEach(c => c.update(ctx));

    // detectar colisiones entre todos
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (detectarColision(circles[i], circles[j])) {
                resolverColision(circles[i], circles[j]);

                // cambiar color al colisionar (opcional)
                circles[i].color = "red";
                circles[j].color = "red";
            } else {
                circles[i].color = "blue";
                circles[j].color = "blue";
            }
        }
    }
}

update();