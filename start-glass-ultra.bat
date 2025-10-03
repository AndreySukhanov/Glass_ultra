@echo off
REM Установка кодировки UTF-8 для поддержки кириллицы
chcp 65001 >nul
cd /d "%~dp0"
npm start
