@echo off
electron-packager .. "Blimp Animator" --out="." --prune="true" --arch="x64" --platform="win32" --asar=true --icon="../img/logo-32.ico"