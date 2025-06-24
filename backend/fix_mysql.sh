#!/bin/bash

echo "=== SOLUCIONANDO INCOMPATIBILIDADES MYSQL ==="

cd /home/deploy/atendimento/backend

# Backup del .env
cp .env .env.backup-mysql-fix

# Corregir timezone
sed -i 's/America\/Sao_Paulo/America\/Bogota/g' .env

echo "✓ Configuración de timezone corregida"

# Crear usuario admin directamente
echo "✓ Creando usuario admin..."
mysql -u atendimento -pcA+3bN7cReJgiaeeEvmne7cAS56a/4UQMYDr7SWC5yk= atendimento << EOF
-- Crear empresa por defecto
INSERT IGNORE INTO Companies (id, name, phone, email, status, planId, createdAt, updatedAt)
VALUES (1, 'Mi Empresa', '123456789', 'admin@empresa.com', 'active', 1, NOW(), NOW());

-- Crear usuario admin
INSERT IGNORE INTO Users (name, email, passwordHash, profile, companyId, createdAt, updatedAt) 
VALUES ('Admin', 'admin@whaticket.com', '\$2a\$08\$WnHc8lUHjmqSLYAyBOssKu1vlpHUIGp9lF0rMHSH1lYfHfFdN5.Vm', 'admin', 1, NOW(), NOW());

-- Crear configuraciones básicas
INSERT IGNORE INTO Settings (\`key\`, value, companyId, createdAt, updatedAt)
VALUES 
('userCreation', 'enabled', 1, NOW(), NOW()),
('allHistoric', 'enabled', 1, NOW(), NOW()),
('chatBotType', 'text', 1, NOW(), NOW());

-- Crear plan básico
INSERT IGNORE INTO Plans (id, name, users, connections, queues, value, createdAt, updatedAt)
VALUES (1, 'Plan Básico', 999, 999, 999, 0, NOW(), NOW());
EOF

# Reiniciar backend
echo "✓ Reiniciando backend..."
pm2 restart atendimento-backend

echo "✓ Esperando que el backend se estabilice..."
sleep 5

# Verificar usuario creado
echo "✓ Verificando usuario admin:"
mysql -u atendimento -pcA+3bN7cReJgiaeeEvmne7cAS56a/4UQMYDr7SWC5yk= atendimento -e "SELECT id, name, email, profile FROM Users;"

echo "✓ Verificando configuraciones:"
mysql -u atendimento -pcA+3bN7cReJgiaeeEvmne7cAS56a/4UQMYDr7SWC5yk= atendimento -e "SELECT \`key\`, value FROM Settings LIMIT 5;"

echo ""
echo "=== ¡PROBLEMA SOLUCIONADO! ==="
echo "Ahora puedes acceder con:"
echo "URL: https://whaticket.streamdigi.co"
echo "Usuario: admin@whaticket.com"
echo "Contraseña: 123456"
echo ""
echo "Si persisten problemas, verifica los logs:"
echo "pm2 logs atendimento-backend"
