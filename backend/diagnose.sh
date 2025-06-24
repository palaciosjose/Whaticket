#!/bin/bash

echo "=== DIAGNOSTICO COMPLETO DEL BACKEND ==="

cd /home/deploy/atendimento/backend

echo "1. ESTRUCTURA DE ARCHIVOS:"
echo "========================="
echo "✓ Archivos principales:"
ls -la src/ 2>/dev/null | head -10

echo ""
echo "✓ Archivos de rutas:"
find src -name "*.ts" -type f | grep -i route | head -10
ls -la src/routes/ 2>/dev/null || echo "No hay carpeta routes en src"

echo ""
echo "✓ Archivos de auth:"
find src -name "*auth*" -type f

echo ""
echo "2. CONFIGURACION DEL SERVIDOR:"
echo "============================="
echo "✓ Archivo principal del servidor:"
server_file=$(find src -name "*.ts" -type f | xargs grep -l "listen\|app.listen" | head -1)
if [ -n "$server_file" ]; then
    echo "Archivo encontrado: $server_file"
    echo "Contenido relevante:"
    grep -A5 -B5 "app.use\|app.listen\|router\|/api\|/auth" "$server_file" 2>/dev/null | head -20
else
    echo "No se encontró archivo principal del servidor"
fi

echo ""
echo "3. RUTAS COMPILADAS:"
echo "==================="
ls -la dist/ 2>/dev/null | head -10
echo ""
echo "✓ Rutas en dist:"
ls -la dist/routes/ 2>/dev/null || echo "No hay carpeta routes en dist"

echo ""
echo "4. PRUEBAS DIRECTAS DEL BACKEND:"
echo "==============================="
echo "✓ Raíz del backend:"
curl -s -I http://localhost:8080/ | head -3

echo ""
echo "✓ Probando rutas comunes:"
for route in "/auth/login" "/api/auth/login" "/login" "/users" "/health" "/public"; do
    echo -n "Probando $route: "
    status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080$route)
    echo "HTTP $status"
done

echo ""
echo "✓ Respuesta completa de la raíz:"
curl -s http://localhost:8080/ | head -10

echo ""
echo "5. CONFIGURACION ACTUAL:"
echo "======================="
echo "✓ Variables de entorno importantes:"
grep -E "PORT|BACKEND_URL|NODE_ENV" .env

echo ""
echo "✓ Estado de PM2:"
pm2 list | grep atendimento

echo ""
echo "6. LOGS RECIENTES:"
echo "================="
echo "✓ Últimas líneas de log:"
pm2 logs atendimento-backend --lines 5 --nostream 2>/dev/null || echo "No se pudieron obtener logs"

echo ""
echo "7. RECOMENDACIONES:"
echo "=================="
echo "Si no ves rutas de auth activas, es probable que:"
echo "1. Las rutas estén en un prefijo diferente"
echo "2. El backend no se haya compilado correctamente"
echo "3. Falte alguna configuración en el archivo principal"
echo ""
echo "Revisa los resultados arriba para identificar el problema exacto."
