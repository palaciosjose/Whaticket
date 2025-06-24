#!/bin/bash

echo "=== CORRIGIENDO RUTAS DE NGINX - SOLUCION FINAL ==="

# Backup de la configuración actual
sudo cp /etc/nginx/sites-available/atendimento /etc/nginx/sites-available/atendimento.backup-routes

echo "✓ Backup de Nginx creado"

# Crear nueva configuración corregida
sudo tee /etc/nginx/sites-available/atendimento > /dev/null <<'EOF'
server {
    listen 80;
    server_name whaticket.streamdigi.co;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name whaticket.streamdigi.co;
    client_max_body_size 20M;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/whaticket.streamdigi.co/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/whaticket.streamdigi.co/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Frontend
    location / {
        proxy_pass http://127.0.0.1:3333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Rutas específicas de auth (NUEVA CONFIGURACION)
    location /api/auth/ {
        rewrite ^/api/auth/(.*)$ /auth/$1 break;
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API General
    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

echo "✓ Nueva configuración de Nginx creada"

# Probar configuración
echo "✓ Probando configuración de Nginx..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✓ Configuración de Nginx válida"
    
    # Recargar Nginx
    echo "✓ Recargando Nginx..."
    sudo systemctl reload nginx
    
    echo "✓ Esperando que se estabilice..."
    sleep 3
    
    # Probar el login
    echo "✓ Probando login corregido..."
    response=$(curl -X POST https://whaticket.streamdigi.co/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"email":"admin@whaticket.com","password":"123456"}' \
        -s -w "\n%{http_code}")
    
    echo "Respuesta del login:"
    echo "$response"
    
    if echo "$response" | grep -q "token\|jwt"; then
        echo ""
        echo "🎉 ¡PROBLEMA SOLUCIONADO COMPLETAMENTE!"
        echo ""
        echo "=== TU WHATICKET ESTÁ FUNCIONANDO ==="
        echo "URL: https://whaticket.streamdigi.co"
        echo "Usuario: admin@whaticket.com" 
        echo "Contraseña: 123456"
        echo ""
        echo "¡Ya puedes usar tu sistema de tickets de WhatsApp!"
    else
        echo ""
        echo "ℹ️ Nginx corregido, pero puede haber otro problema menor."
        echo "Intenta acceder por navegador: https://whaticket.streamdigi.co"
    fi
    
else
    echo "❌ Error en configuración de Nginx"
    echo "Restaurando backup..."
    sudo cp /etc/nginx/sites-available/atendimento.backup-routes /etc/nginx/sites-available/atendimento
    sudo systemctl reload nginx
fi
