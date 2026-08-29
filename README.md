# CELPIP Trainer

App de preparación para el CELPIP: reading, listening, writing y speaking, método 3·2·1,
entrenador de conectores, banco de errores y ciclo de 17 días. **Funciona 100% gratis.**

## Configuración gratuita (5 minutos)

### 1. Crear la API key gratuita de Gemini
- Entra a https://aistudio.google.com/apikey con tu cuenta de Google.
- Crea una API key. No pide tarjeta ni facturación.
- El plan gratuito da 250 solicitudes/día con Gemini 2.5 Flash: una sesión diaria completa usa ~20.

### 2. Probar local
```bash
npm install
npm run dev
```
Abrir la app → Inicio → engranaje (Ajustes) → pegar la key de Gemini → Guardar.

### 3. Publicar gratis en GitHub Pages
1. Crear un repositorio **público** en GitHub (Pages gratuito requiere repo público).
2. Subir el proyecto:
   ```bash
   git init && git add . && git commit -m "CELPIP Trainer"
   git branch -M main
   git remote add origin git@github.com:TU_USUARIO/celpip-trainer.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Source: GitHub Actions**.
4. El workflow incluido construye y publica solo en cada push.
5. La app queda en `https://TU_USUARIO.github.io/celpip-trainer/`.
6. Abrirla, ir a Ajustes y pegar la key de Gemini en ese navegador.

Es seguro que el repo sea público: las keys nunca están en el código, viven solo en el
localStorage del navegador donde las pegaste. La URL es pública pero nadie puede gastar tu cuota.

Alternativa con login real (también gratis): Cloudflare Pages + Cloudflare Access.

## Audio de listening sin pagar
Las voces del sistema se eligen automáticamente priorizando las neuronales. En
**Microsoft Edge de escritorio** son las voces "Natural" de Azure: gratis y de alta calidad.
Opcional de pago: key de OpenAI en Ajustes para audio con una voz por personaje (~US$0.02/audio).

## Keys opcionales
- **Anthropic** (pago): alternativa a Gemini para generar/evaluar. Si hay ambas, se usa Gemini.
- **OpenAI** (pago): solo para el audio real de listening.

## Notas
- El progreso se guarda en localStorage por navegador/dispositivo.
- El dictado de speaking usa Web Speech API (Chrome/Safari/Edge).
