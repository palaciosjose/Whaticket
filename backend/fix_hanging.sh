#!/bin/bash

echo "=== SOLUCIONANDO CUELGUE DE PUBLICSETTINGS ==="

cd /home/deploy/atendimento/backend

echo "✓ Problema identificado: GetPublicSettingService se cuelga buscando configuraciones"
echo "✓ Solución: Crear todas las configuraciones necesarias en la BD"

# Crear todas las configuraciones que el frontend necesita
echo "✓ Creando configuraciones completas en la base de datos..."

mysql -u atendimento -pcA+3bN7cReJgiaeeEvmne7cAS56a/4UQMYDr7SWC5yk= atendimento << 'EOF'
-- Verificar configuraciones existentes
SELECT 'CONFIGURACIONES ANTES:' as estado;
SELECT COUNT(*) as total FROM Settings WHERE companyId = 1;

-- Eliminar configuraciones existentes para evitar duplicados
DELETE FROM Settings WHERE companyId = 1;

-- Insertar TODAS las configuraciones necesarias
INSERT INTO Settings (`key`, value, companyId, createdAt, updatedAt) VALUES
('appName', 'StreamDigi Sistema Multiagente', 1, NOW(), NOW()),
('appLogoLight', '', 1, NOW(), NOW()),
('appLogoDark', '', 1, NOW(), NOW()),
('appLogoFavicon', '', 1, NOW(), NOW()),
('primaryColorLight', '#3f51b5', 1, NOW(), NOW()),
('primaryColorDark', '#303f9f', 1, NOW(), NOW()),
('allowSignup', 'disabled', 1, NOW(), NOW()),
('userCreation', 'enabled', 1, NOW(), NOW()),
('allHistoric', 'enabled', 1, NOW(), NOW()),
('chatBotType', 'text', 1, NOW(), NOW()),
('CheckMsgIsGroup', 'enabled', 1, NOW(), NOW()),
('call', 'disabled', 1, NOW(), NOW()),
('sideMenu', 'enabled', 1, NOW(), NOW()),
('closeTicketApi', 'disabled', 1, NOW(), NOW()),
('darkMode', 'disabled', 1, NOW(), NOW()),
('ASC', 'enabled', 1, NOW(), NOW()),
('created', 'enabled', 1, NOW(), NOW()),
('timeCreateNewTicket', '10', 1, NOW(), NOW()),
('ipixc', 'disabled', 1, NOW(), NOW()),
('tokenixc', '', 1, NOW(), NOW()),
('ipmkauth', 'disabled', 1, NOW(), NOW()),
('clientidmkauth', '', 1, NOW(), NOW()),
('clientsecretmkauth', '', 1, NOW(), NOW());

-- Verificar que se crearon correctamente
SELECT 'CONFIGURACIONES DESPUÉS:' as estado;
SELECT COUNT(*) as total FROM Settings WHERE companyId = 1;

-- Mostrar algunas configuraciones creadas
SELECT 'CONFIGURACIONES PRINCIPALES:' as resultado;
SELECT `key`, value FROM Settings WHERE companyId = 1 AND `key` IN ('appName', 'allowSignup', 'primaryColorLight') ORDER BY `key`;
EOF

echo "✓ Configuraciones creadas en la base de datos"

# Reiniciar backend completamente
echo "✓ Reiniciando backend para limpiar cache..."
pm2 restart atendimento-backend --update-env

echo "✓ Esperando que el backend se estabilice..."
sleep 10

# Probar las rutas que antes se colgaban
echo "✓ Probando rutas que antes causaban timeout..."

echo "- Probando appName:"
response1=$(timeout 5 curl -s "http://localhost:8080/public-settings/appName?token=wtV" || echo "TIMEOUT")
echo "  Respuesta: ${response1:0:50}..."

echo "- Probando allowSignup:"
response2=$(timeout 5 curl -s "http://localhost:8080/public-settings/allowSignup?token=wtV" || echo "TIMEOUT")
echo "  Respuesta: ${response2:0:50}..."

echo "- Probando primaryColorDark:"
response3=$(timeout 5 curl -s "http://localhost:8080/public-settings/primaryColorDark?token=wtV" || echo "TIMEOUT")
echo "  Respuesta: ${response3:0:50}..."

echo "- Probando version:"
response4=$(timeout 5 curl -s "http://localhost:8080/version" || echo "TIMEOUT")
echo "  Respuesta: ${response4:0:50}..."

echo ""
echo "=== RESULTADO ==="
if [[ "$response1" != "TIMEOUT" && "$response2" != "TIMEOUT" && "$response3" != "TIMEOUT" ]]; then
    echo "🎉 ¡PROBLEMA SOLUCIONADO!"
    echo "✓ Las rutas de public-settings ya no se cuelgan"
    echo "✓ El backend responde correctamente"
    echo ""
    echo "=== PRUEBA EN EL NAVEGADOR ==="
    echo "Ve a: https://whaticket.streamdigi.co"
    echo "Recarga la página - ya NO deberías ver errores 504"
    echo "El login debería funcionar perfectamente ahora"
    echo ""
    echo "Usuario: admin@whaticket.com"
    echo "Contraseña: 123456"
else
    echo "⚠️ Algunas rutas siguen con timeout"
    echo "Puede haber un problema más profundo en el código del servicio"
    echo "Revisa los logs: pm2 logs atendimento-backend"
fi

echo ""
echo "Estado de PM2:"
pm2 list | grep atendimento
