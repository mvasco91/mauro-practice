# CELPIP Trainer

App de preparación para el CELPIP: reading, listening, writing y speaking, método 3·2·1,
entrenador de conectores, banco de errores y ciclo de 17 días. Funciona 100% gratis.

## Estructura
Archivos en la raíz del proyecto (App.jsx, main.jsx, index.html) — sin carpeta src/.

## Configuración gratuita
1. Crea tu API key gratuita en https://aistudio.google.com/apikey (Gemini, sin tarjeta).
2. Opcional: key de Anthropic en https://console.anthropic.com (requiere crédito, mejor calidad).
   Al crearla, vincúlala a un Workspace específico (no "todos los espacios de trabajo").
3. Abre la app → Inicio → engranaje (Ajustes) → pega tus keys → Guardar.

## Correr local
```bash
npm install
npm run dev
```

## Publicar en GitHub Pages (gratis)
1. Repo público en GitHub.
2. git init && git add . && git commit -m "CELPIP Trainer" && git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git && git push -u origin main
3. Settings → Pages → Source: GitHub Actions.
4. El workflow (.github/workflows/deploy.yml) construye y publica en cada push.
5. URL: https://TU_USUARIO.github.io/TU_REPO/

## Actualizar después
Reemplaza App.jsx en la raíz del proyecto y:
```bash
git add .
git commit -m "actualización"
git push
```
`git add .` sube cualquier archivo modificado sin importar en qué carpeta esté —
es el comando más seguro para actualizar.

## Notas
- Progreso guardado en localStorage por navegador/dispositivo.
- Dictado de speaking: Web Speech API (Chrome/Safari/Edge).
- Listening con voces del sistema por defecto; Edge de escritorio trae voces neuronales gratis.
- Audio real opcional con key de OpenAI TTS en Ajustes (~US$0.02/audio).
