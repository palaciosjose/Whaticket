#!/bin/bash

echo "=== CREANDO USUARIO ADMIN - SOLUCION FINAL ==="

# Crear empresa, plan y usuario correctamente
mysql -u atendimento -pcA+3bN7cReJgiaeeEvmne7cAS56a/4UQMYDr7SWC5yk= atendimento << 'EOF'

-- Ver estructura de Companies
DESCRIBE Companies;

-- Crear empresa con status numérico (1 = activo)
INSERT IGNORE INTO Companies (id, name, phone, email, status, planId, createdAt, updatedAt)
VALUES (1, 'Mi Empresa', '123456789', 'admin@empresa.com', 1, 1, NOW(), NOW());

-- Verificar empresa creada
SELECT 'EMPRESA CREADA:' as resultado;
SELECT * FROM Companies;

-- Crear usuario admin
INSERT IGNORE INTO Users (name, email, passwordHash, profile, companyId, createdAt, updatedAt) 
VALUES ('Admin', 'admin@whaticket.com', '$2a$08$WnHc8lUHjmqSLYAyBOssKu1vlpHUIGp9lF0rMHSH1lYfHfFdN5.Vm', 'admin', 1, NOW(), NOW());

-- Verificar usuario creado
SELECT 'USUARIO CREADO:' as resultado;
SELECT id, name, email, profile, companyId FROM Users;

-- Crear configuraciones básicas
INSERT IGNORE INTO Settings (`key`, value, companyId, createdAt, updatedAt)
VALUES 
('userCreation', 'enabled', 1, NOW(), NOW()),
('allHistoric', 'enabled', 1, NOW(), NOW()),
('chatBotType', 'text', 1, NOW(), NOW());

SELECT 'CONFIGURACIONES CREADAS:' as resultado;
SELECT `key`, value FROM Settings WHERE companyId = 1;

EOF

echo ""
echo "✓ Reiniciando backend..."
pm2 restart atendimento-backend

echo "✓ Esperando estabilización..."
sleep 5

echo ""
echo "=== VERIFICACION FINAL ==="

# Verificar que todo funciona
mysql -u atendimento -pcA+3bN7cReJgiaeeEvmne7cAS56a/4UQMYDr7SWC5yk= atendimento -e "
SELECT 'RESUMEN FINAL:' as estado;
SELECT 'Empresas:' as tabla, COUNT(*) as total FROM Companies;
SELECT 'Usuarios:' as tabla, COUNT(*) as total FROM Users;
SELECT 'Planes:' as tabla, COUNT(*) as total FROM Plans;
SELECT 'Configuraciones:' as tabla, COUNT(*) as total FROM Settings;
"

echo ""
echo "=== ¡LISTO PARA USAR! ==="
echo "URL: https://whaticket.streamdigi.co"
echo "Usuario: admin@whaticket.com"
echo "Contraseña: 123456"
echo ""
echo "Probando login..."
curl -X POST https://whaticket.streamdigi.co/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@whaticket.com","password":"123456"}' \
  -s | head -c 200
echo ""
echo ""
echo "Si ves un token JWT arriba, ¡el login funciona perfectamente!"
