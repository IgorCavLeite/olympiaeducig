@echo off
title Ativando Projeto OlympIA
echo ==========================================
echo    IP ATUAL DA REDE: 172.16.20.162
echo ==========================================

:: Inicia o Backend
start cmd /k "echo --- BACKEND --- && cd backend && npx tsx server.ts"

:: Inicia o Frontend
start cmd /k "echo --- FRONTEND --- && cd frontend && npx expo start"

echo.
echo Verifique se o IP acima e o do Config.ts sao iguais!
pause