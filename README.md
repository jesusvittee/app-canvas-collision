# Demo Colisión 2D

Simulación interactiva de círculos con canvas y JavaScript puro, organizada en tres etapas progresivas.

## Demos

| | Descripción |
|---|---|
| **A** | Dos círculos rebotan en los bordes del canvas |
| **B** | Los círculos cambian a rojo al colisionar entre sí |
| **C** | Rebote físico real entre círculos con reflexión sobre la normal |

## Estructura

```
├── index.html
└── assets/
    ├── css/
    │   └── style.css
    └── js/
    |    ├── main.js           # Demo A
    |    ├── main_colision.js  # Demo B
    |    └── main_rebote.js    # Demo C
    |__ img/
        |_favicon.png
```

## Conceptos aplicados

- **Canvas API** — dibujo y animación con `requestAnimationFrame`
- **Detección de colisión** — distancia euclidiana entre centros
- **Rebote en bordes** — inversión de velocidad al tocar los límites
- **Física de rebote** — separación de círculos solapados y reflexión de velocidad sobre la normal de colisión

## Uso

Abre `index.html` en cualquier navegador moderno. No requiere dependencias ni servidor.
