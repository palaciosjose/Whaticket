#!/bin/bash

# ===============================================
# SCRIPT DIAGNÓSTICO - ESTRUCTURA WHATICKET
# Analiza tu instalación para verificar compatibilidad
# ===============================================

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para mostrar encabezado
show_header() {
    echo -e "${BLUE}"
    echo "=================================================="
    echo "    DIAGNÓSTICO DE ESTRUCTURA WHATICKET"
    echo "    Análisis de compatibilidad para traducciones"
    echo "=================================================="
    echo -e "${NC}"
}

# Función para crear reporte
create_report() {
    REPORT_FILE="whaticket_diagnostico_$(date +%Y%m%d_%H%M%S).txt"
    exec > >(tee -a "$REPORT_FILE")
    exec 2>&1
    echo "Generando reporte en: $REPORT_FILE"
}

# Verificar directorio raíz
check_root_directory() {
    echo -e "${CYAN}[1/10] Verificando directorio raíz...${NC}"
    
    if [[ -d "frontend" ]] && [[ -d "backend" ]]; then
        echo -e "${GREEN}✓ Estructura básica encontrada${NC}"
        
        # Verificar package.json para identificar versión
        if [[ -f "frontend/package.json" ]]; then
            echo -e "${GREEN}✓ Frontend package.json encontrado${NC}"
            echo "=== INFORMACIÓN DEL FRONTEND ==="
            grep -E '"name"|"version"|"react"|"i18n"' frontend/package.json 2>/dev/null || echo "No se encontró información específica"
        fi
        
        if [[ -f "backend/package.json" ]]; then
            echo -e "${GREEN}✓ Backend package.json encontrado${NC}"
            echo "=== INFORMACIÓN DEL BACKEND ==="
            grep -E '"name"|"version"|"express"|"sequelize"' backend/package.json 2>/dev/null || echo "No se encontró información específica"
        fi
    else
        echo -e "${RED}✗ No se encontraron las carpetas frontend/backend${NC}"
        echo "Por favor ejecuta este script desde el directorio raíz de Whaticket"
        exit 1
    fi
    echo ""
}

# Verificar estructura de traducciones
check_translation_structure() {
    echo -e "${CYAN}[2/10] Analizando estructura de traducciones...${NC}"
    
    # Buscar archivos de traducción existentes
    TRANSLATION_PATHS=(
        "frontend/src/translate"
        "frontend/src/locales"
        "frontend/src/i18n"
        "frontend/src/translations"
    )
    
    for path in "${TRANSLATION_PATHS[@]}"; do
        if [[ -d "$path" ]]; then
            echo -e "${GREEN}✓ Encontrado directorio de traducciones: $path${NC}"
            
            # Listar archivos en el directorio
            echo "Archivos encontrados:"
            find "$path" -name "*.js" -o -name "*.json" -o -name "*.ts" | head -10
            
            # Buscar configuración de idiomas
            find "$path" -name "*.js" -exec grep -l "pt\|es\|en" {} \; 2>/dev/null | head -5
        fi
    done
    echo ""
}

# Verificar FlowBuilder
check_flowbuilder() {
    echo -e "${CYAN}[3/10] Buscando componentes del FlowBuilder...${NC}"
    
    # Buscar referencias al FlowBuilder
    FLOWBUILDER_PATHS=(
        "frontend/src/components/FlowBuilder"
        "frontend/src/pages/FlowBuilder"
        "frontend/src/containers/FlowBuilder"
    )
    
    for path in "${FLOWBUILDER_PATHS[@]}"; do
        if [[ -d "$path" ]]; then
            echo -e "${GREEN}✓ FlowBuilder encontrado en: $path${NC}"
            
            # Listar archivos del FlowBuilder
            echo "Archivos del FlowBuilder:"
            find "$path" -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | head -10
        fi
    done
    
    # Buscar archivos que contengan referencias al FlowBuilder
    echo "Buscando referencias al FlowBuilder en código..."
    find frontend/src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l -i "flowbuilder\|flow.builder\|flow_builder" 2>/dev/null | head -5
    echo ""
}

# Buscar textos específicos en portugués
check_portuguese_texts() {
    echo -e "${CYAN}[4/10] Buscando textos en portugués que necesitan traducción...${NC}"
    
    # Textos específicos que vimos en la captura
    PORTUGUESE_TEXTS=(
        "Início do fluxo"
        "Este bloco marca o início"
        "Conteúdo" 
        "Menu"
        "Randomizador"
        "Intervalo"
        "Ticket"
        "TypeBot"
        "OpenAI"
        "Contas Premium"
        "TV por internet"
        "Promoções"
        "Meios de pagamento"
        "Reportar falhas"
        "Perguntas frequentes"
        "Meus serviços"
    )
    
    echo "Textos encontrados que necesitan traducción:"
    for text in "${PORTUGUESE_TEXTS[@]}"; do
        files=$(find frontend/src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "$text" 2>/dev/null)
        if [[ -n "$files" ]]; then
            echo -e "${YELLOW}  '$text' encontrado en:${NC}"
            echo "$files" | head -3 | sed 's/^/    /'
        fi
    done
    echo ""
}

# Verificar sistema de internacionalización
check_i18n_system() {
    echo -e "${CYAN}[5/10] Verificando sistema de internacionalización...${NC}"
    
    # Buscar librerías de i18n en package.json
    if [[ -f "frontend/package.json" ]]; then
        echo "Librerías de i18n instaladas:"
        grep -E '"(react-)?i18n|i18next|react-intl"' frontend/package.json 2>/dev/null || echo "No se encontraron librerías específicas de i18n"
    fi
    
    # Buscar imports de i18n en código
    echo "Imports de i18n encontrados:"
    find frontend/src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -h "import.*i18n\|import.*translation\|useTranslation" 2>/dev/null | head -5
    echo ""
}

# Verificar configuración de rutas
check_routes() {
    echo -e "${CYAN}[6/10] Verificando configuración de rutas...${NC}"
    
    # Buscar rutas del FlowBuilder
    find frontend/src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "flowbuilder\|/flow" 2>/dev/null | while read file; do
        echo "Rutas encontradas en $file:"
        grep -n "flowbuilder\|/flow" "$file" 2>/dev/null | head -3
    done
    echo ""
}

# Verificar estructura de archivos React
check_react_structure() {
    echo -e "${CYAN}[7/10] Analizando estructura React...${NC}"
    
    # Verificar si usa hooks o class components
    echo "Tipo de componentes utilizados:"
    hook_count=$(find frontend/src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -c "useState\|useEffect" 2>/dev/null | awk '{sum += $1} END {print sum}')
    class_count=$(find frontend/src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -c "class.*extends.*Component" 2>/dev/null | awk '{sum += $1} END {print sum}')
    
    echo "  Hooks React: $hook_count referencias"
    echo "  Class Components: $class_count referencias"
    
    # Verificar versión de React
    if [[ -f "frontend/package.json" ]]; then
        react_version=$(grep '"react"' frontend/package.json | head -1)
        echo "  Versión React: $react_version"
    fi
    echo ""
}

# Verificar configuración de ambiente
check_environment() {
    echo -e "${CYAN}[8/10] Verificando configuración de ambiente...${NC}"
    
    # Verificar archivos .env
    ENV_FILES=(".env" "frontend/.env" "backend/.env" ".env.local" "frontend/.env.local")
    
    for env_file in "${ENV_FILES[@]}"; do
        if [[ -f "$env_file" ]]; then
            echo -e "${GREEN}✓ Archivo $env_file encontrado${NC}"
            
            # Buscar configuraciones de idioma
            echo "Configuraciones relacionadas con idioma:"
            grep -i "lang\|locale\|i18n" "$env_file" 2>/dev/null || echo "  No se encontraron configuraciones de idioma"
        fi
    done
    echo ""
}

# Verificar base de datos
check_database() {
    echo -e "${CYAN}[9/10] Verificando configuración de base de datos...${NC}"
    
    # Buscar migraciones relacionadas con idiomas
    if [[ -d "backend/src/database/migrations" ]]; then
        echo "Migraciones relacionadas con configuración:"
        find backend/src/database/migrations -name "*.js" | xargs grep -l -i "setting\|config\|language" 2>/dev/null | head -5
    fi
    
    # Buscar seeders
    if [[ -d "backend/src/database/seeders" ]]; then
        echo "Seeders encontrados:"
        ls backend/src/database/seeders/ | head -5
    fi
    echo ""
}

# Generar recomendaciones
generate_recommendations() {
    echo -e "${CYAN}[10/10] Generando recomendaciones...${NC}"
    
    echo -e "${GREEN}=== RECOMENDACIONES BASADAS EN TU INSTALACIÓN ===${NC}"
    
    # Verificar si tiene estructura de traducciones
    if [[ -d "frontend/src/translate" ]] || [[ -d "frontend/src/i18n" ]]; then
        echo -e "${GREEN}✓ Tu instalación ya tiene estructura de traducciones${NC}"
        echo "  → Las traducciones que preparé son compatibles"
        echo "  → Puedes usar el script automatizado"
    else
        echo -e "${YELLOW}⚠ No se encontró estructura estándar de traducciones${NC}"
        echo "  → Será necesario crear la estructura completa"
        echo "  → Recomiendo implementación manual paso a paso"
    fi
    
    # Verificar FlowBuilder
    if find frontend/src -name "*.js" -o -name "*.jsx" | xargs grep -l -i "flowbuilder" >/dev/null 2>&1; then
        echo -e "${GREEN}✓ FlowBuilder detectado en tu instalación${NC}"
        echo "  → Las traducciones del FlowBuilder son aplicables"
    else
        echo -e "${YELLOW}⚠ FlowBuilder no detectado claramente${NC}"
        echo "  → Verifica que la función esté habilitada"
    fi
    
    # Verificar i18n
    if grep -r "i18n\|useTranslation" frontend/src >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Sistema i18n detectado${NC}"
        echo "  → Usar enfoque con hooks de traducción"
    else
        echo -e "${YELLOW}⚠ No se detectó sistema i18n${NC}"
        echo "  → Usar enfoque de reemplazo directo de textos"
    fi
    
    echo ""
    echo -e "${BLUE}=== PRÓXIMOS PASOS RECOMENDADOS ===${NC}"
    echo "1. Revisa el reporte generado: $REPORT_FILE"
    echo "2. Haz backup de tu instalación actual"
    echo "3. Según el análisis, elige el método de implementación:"
    echo "   - Si tienes estructura i18n: Usar script automatizado"
    echo "   - Si no tienes i18n: Implementación manual paso a paso"
    echo ""
}

# Función principal
main() {
    show_header
    create_report
    
    check_root_directory
    check_translation_structure  
    check_flowbuilder
    check_portuguese_texts
    check_i18n_system
    check_routes
    check_react_structure
    check_environment
    check_database
    generate_recommendations
    
    echo -e "${GREEN}¡Diagnóstico completado!${NC}"
    echo "Reporte guardado en: $REPORT_FILE"
}

# Ejecutar si es llamado directamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi

