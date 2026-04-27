@echo off
title Ativando Projeto OlympIA
echo ==========================================
echo    Iniciando OlympIA...
echo ==========================================

start cmd /k "echo --- BACKEND --- && cd backend && npx tsx server.ts"
start cmd /k "echo --- FRONTEND --- && cd frontend && npx expo start --host lan"

echo.
echo Projeto iniciado! Escaneie o QR code no celular.
pause