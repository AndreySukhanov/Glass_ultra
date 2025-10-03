$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Glass Ultra.lnk")
$Shortcut.TargetPath = "$PSScriptRoot\start-glass-ultra.bat"
$Shortcut.WorkingDirectory = $PSScriptRoot
$Shortcut.IconLocation = "$PSScriptRoot\src\ui\assets\logo.ico"
$Shortcut.Description = "Glass Ultra - AI Desktop Assistant"
$Shortcut.Save()
Write-Host "Desktop shortcut created successfully!"
