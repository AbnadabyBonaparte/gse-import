# Script para mover arquivos defasados para docs/archive
# Execute: .\scripts\move_to_archive.ps1

$ErrorActionPreference = "Stop"

# Criar pasta archive se não existir
$archivePath = "docs\archive"
if (-not (Test-Path $archivePath)) {
    New-Item -ItemType Directory -Path $archivePath | Out-Null
    Write-Host "✅ Pasta archive criada" -ForegroundColor Green
}

# Lista de arquivos para mover
$filesToMove = @(
    "docs\Stack Tecnológica GSE 1000_1000_ O Arsenal do Citizen Developer.md",
    "docs\Roadmap de Execução GSE 1000_1000_ Do Zero ao Lançamento Viral.md",
    "docs\Caderno do Conhecimento GSE 1000_1000_ A Bíblia do Projeto.md",
    "docs\GSE 100% Autônomo A Máquina que Roda Sozinha (FlutterFlow Edition).docx"
)

Write-Host "`n🔄 Movendo arquivos defasados para archive...`n" -ForegroundColor Yellow

foreach ($file in $filesToMove) {
    if (Test-Path $file) {
        $fileName = Split-Path $file -Leaf
        Move-Item -Path $file -Destination $archivePath -Force
        Write-Host "✅ Movido: $fileName" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Não encontrado: $file" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Concluído! Arquivos movidos para docs\archive\`n" -ForegroundColor Green


