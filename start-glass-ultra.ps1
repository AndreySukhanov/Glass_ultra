# Установка кодировки UTF-8 для поддержки кириллицы
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

# Переход в директорию скрипта
Set-Location $PSScriptRoot

# Запуск приложения
npm start
