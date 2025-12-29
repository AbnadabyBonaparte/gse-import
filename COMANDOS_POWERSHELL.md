# 🔧 Comandos PowerShell - Organização Final

Execute estes comandos na raiz do projeto para finalizar a auditoria:

## 1. Mover Arquivos Defasados para Archive

```powershell
# Criar pasta archive
New-Item -ItemType Directory -Path "docs\archive" -Force

# Mover arquivos defasados
Move-Item "docs\Stack Tecnológica GSE 1000_1000_ O Arsenal do Citizen Developer.md" "docs\archive\" -Force
Move-Item "docs\Roadmap de Execução GSE 1000_1000_ Do Zero ao Lançamento Viral.md" "docs\archive\" -Force
Move-Item "docs\Caderno do Conhecimento GSE 1000_1000_ A Bíblia do Projeto.md" "docs\archive\" -Force
Move-Item "docs\GSE 100% Autônomo A Máquina que Roda Sozinha (FlutterFlow Edition).docx" "docs\archive\" -Force
```

**OU execute o script automatizado:**
```powershell
.\scripts\move_to_archive.ps1
```

## 2. Verificar Arquivos Movidos

```powershell
Get-ChildItem "docs\archive" | Select-Object Name
```

## 3. Commit Final

```powershell
git add .
git commit -m "chore: align project to current stack - remove old FlutterFlow/Make references"
```

## 4. Verificar Consistência Final

```powershell
# Verificar se há referências a FlutterFlow/Make.com em arquivos ativos
Select-String -Path "*.md","*.ts","*.tsx","*.js","*.jsx" -Pattern "FlutterFlow|Make\.com|Zapier" -Exclude "archive\*","AUDITORIA*","COMANDOS*" | Select-Object Path, LineNumber, Line
```

---

**Status:** ✅ Arquivos atualizados | ⏳ Aguardando execução dos comandos PowerShell



