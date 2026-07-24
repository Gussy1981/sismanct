Set WshShell = CreateObject("WScript.Shell")

' Iniciar MongoDB sin ventana (0 = oculto)
WshShell.Run """C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe"" --dbpath C:\data\db", 0, False

' Esperar 3 segundos para que MongoDB arranque antes que Node
WScript.Sleep 3000

' Iniciar backend Node sin ventana
WshShell.Run "cmd /c cd /d C:\Users\Gustavo\Desktop\SisManCT && npm start", 0, False
