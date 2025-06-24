#!/bin/bash

echo "=== ENCONTRANDO LA RUTA CORRECTA DE AUTH ==="

cd /home/deploy/atendimento/backend

echo "1. CONFIGURACION DE RUTAS PRINCIPALES:"
echo "====================================="
echo "✓ Contenido de src/routes/index.ts:"
cat src/routes/index.ts

echo ""
echo "2. PROBANDO RUTAS DIRECTAS:"
echo "=========================="

# Lista de posibles rutas a probar
routes=(
    "/login"
    "/auth/login" 
    "/api/login"
    "/api/auth/login"
    "/v1/login"
    "/v1/auth/login"
    "/session/login"
    "/user/login"
)

echo "✓ Probando rutas de login:"
for route in "${routes[@]}"; do
    echo -n "Probando $route: "
    status=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8080$route \
        -H "Content-Type: application/json" \
        -d '{"email":"admin@whaticket.com","password":"123456"}')
    echo "HTTP $status"
    
    # Si encontramos una ruta que no da 404, intentar ver la respuesta
    if [ "$status" != "404" ]; then
        echo "  → Respuesta completa:"
        response=$(curl -s -X POST http://localhost:8080$route \
            -H "Content-Type: application/json" \
            -d '{"email":"admin@whaticket.com","password":"123456"}')
        echo "  $response" | head -c 200
        echo ""
    fi
done

echo ""
echo "3. VERIFICAR RUTAS COMPILADAS:"
echo "============================"
echo "✓ Contenido de dist/routes/index.js (primeras 50 líneas):"
cat dist/routes/index.js | head -50

echo ""
echo "4. VERIFICAR AUTHROUTES COMPILADO:"
echo "================================"
echo "✓ Contenido de dist/routes/authRoutes.js:"
cat dist/routes/authRoutes.js

echo ""
echo "5. BUSCAR REFERENCIAS DE AUTH EN EL CODIGO:"
echo "=========================================="
echo "✓ Buscar cómo se registra authRoutes:"
grep -r "authRoutes\|auth.*Routes" src/ | head -10

echo ""
echo "6. RECOMENDACION:"
echo "================"
echo "Si ninguna ruta funciona, el problema puede ser:"
echo "1. Las rutas no están registradas en index.ts"
echo "2. Hay un problema en la compilación"
echo "3. Falta algún middleware o configuración"
echo ""
echo "Revisa la configuración de index.ts para ver cómo se registran las rutas."
