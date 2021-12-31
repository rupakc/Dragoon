@echo off
SET mongodb_path=C:\Users\rupachak\Downloads\mongodb-win32-x86_64-2008plus-ssl-3.7.8\mongodb-win32-x86_64-2008plus-ssl-3.7.8\bin\mongod.exe
start cmd /k %mongodb_path%
node server.js
