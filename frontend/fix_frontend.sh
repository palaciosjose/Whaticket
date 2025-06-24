#!/bin/bash

echo "=== CORRIGIENDO CONFIGURACION DEL FRONTEND ==="

cd /home/deploy/atendimento/frontend

echo "✓ Ubicación actual: $(pwd)"

# Backup de configuración actual si existe
if [ -f .env ]; then
    cp .env .env.backup-$(date +%Y%m%d-%H%M%S)
    echo "✓ Backup de .env creado"
fi

# Crear configuración correcta
echo "✓ Creando configuración correcta del frontend..."
cat > .env << 'EOF'
REACT_APP_BACKEND_URL=https://whaticket.streamdigi.co/api
REACT_APP_FRONTEND_URL=https://whaticket.streamdigi.co
REACT_APP_HOURS_CLOSE_TICKETS_AUTO=""
GENERATE_SOURCEMAP=false
EOF

echo "✓ Nueva configuración:"
cat .env

# Verificar si hay otros archivos de configuración
echo ""
echo "✓ Buscando otros archivos de configuración..."
find . -name "*.env*" -type f 2>/dev/null | head -5

# Buscar referencias a apiwhaticket en archivos JS
echo ""
echo "✓ Buscando referencias a apiwhaticket..."
find . -name "*.js" -o -name "*.json" | xargs grep -l "apiwhaticket" 2>/dev/null | head -3

# Reconstruir frontend
echo ""
echo "✓ Reconstruyendo frontend..."
npm install --silent

echo "✓ Construyendo frontend con nueva configuración..."
npm run build

# Verificar que el build se creó
if [ -d "build" ]; then
    echo "✓ Frontend construido exitosamente"
    ls -la build/ | head -5
else
    echo "❌ Error: No se pudo construir el frontend"
    exit 1
fi

# Reiniciar frontend
echo ""
echo "✓ Reiniciando frontend..."
pm2 restart atendimento-frontend

echo "✓ Esperando que se estabilice..."
sleep 5

# Verificar estado
echo ""
echo "✓ Estado final:"
pm2 list | grep atendimento

echo ""
echo "=== ¡CONFIGURACION CORREGIDA! ==="
echo ""
echo "Ahora intenta hacer login en:"
echo "https://whaticket.streamdigi.co"
echo ""
echo "Usuario: admin@whaticket.com"
echo "Contraseña: 123456"
echo ""
echo "El frontend ahora debería conectar correctamente al backend."
echo "¡Ya no deberías ver errores de CORS!"
