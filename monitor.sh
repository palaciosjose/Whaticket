#!/bin/bash
clear
echo "=========================================="
echo "    WHATICKET PERFORMANCE MONITOR"
echo "=========================================="
echo "Fecha: $(date)"
echo ""
echo "--- PM2 STATUS ---"
pm2 status

echo ""
echo "--- RECURSOS DEL SERVIDOR ---"
echo "RAM Total: $(free -h | awk '/^Mem:/ {print $2}')"
echo "RAM Usada: $(free -h | awk '/^Mem:/ {print $3}')"
echo "RAM Libre: $(free -h | awk '/^Mem:/ {print $4}')"
echo "CPU Load: $(uptime | awk -F'load average:' '{print $2}')"

echo ""
echo "--- CONEXIONES ACTIVAS ---"
echo "Puerto 8080 (Backend): $(netstat -an | grep :8080 | grep ESTABLISHED | wc -l) conexiones"
echo "Puerto 3333 (Frontend): $(netstat -an | grep :3333 | grep ESTABLISHED | wc -l) conexiones"

echo ""
echo "--- ESPACIO EN DISCO ---"
df -h / | tail -1 | awk '{print "Usado: " $3 " / " $2 " (" $5 ")"}'

echo ""
echo "=========================================="
echo "Para monitoreo en tiempo real: pm2 monit"
echo "Para logs: pm2 logs"
echo "=========================================="
