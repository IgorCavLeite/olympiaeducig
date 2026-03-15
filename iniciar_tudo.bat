@echo off
title Ativando Projeto OlympIA
echo ==========================================
echo    INICIANDO BACKEND E FRONTEND...
echo ==========================================

:: Inicia o Backend em uma nova janela
start cmd /k "echo --- BACKEND --- && cd backend && npx tsx server.ts"

:: Inicia o Frontend em uma nova janela
start cmd /k "echo --- FRONTEND --- && cd frontend && npx expo start"

echo.
echo Tudo pronto! Verifique as janelas abertas.
pause