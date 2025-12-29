# GSE 1000 - Script de Teste do Agente Concierge
# PowerShell Script para testar o webhook de identificação de peças

param(
    [Parameter(Mandatory=$true)]
    [string]$WebhookUrl,
    
    [Parameter(Mandatory=$true)]
    [string]$ImageUrl,
    
    [string]$Vin = "",
    [string]$CarModel = ""
)

Write-Host "🏎️ GSE Import - Teste do Agente Concierge" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Preparar payload
$body = @{
    imageUrl = $ImageUrl
}

if ($Vin) {
    $body.vin = $Vin
}

if ($CarModel) {
    $body.carModel = $CarModel
}

# Converter para JSON
$jsonBody = $body | ConvertTo-Json

Write-Host "📤 Enviando requisição..." -ForegroundColor Yellow
Write-Host "   Webhook: $WebhookUrl" -ForegroundColor Gray
Write-Host "   Imagem: $ImageUrl" -ForegroundColor Gray
if ($Vin) { Write-Host "   VIN: $Vin" -ForegroundColor Gray }
if ($CarModel) { Write-Host "   Modelo: $CarModel" -ForegroundColor Gray }
Write-Host ""

try {
    # Fazer requisição POST
    $response = Invoke-RestMethod -Uri $WebhookUrl -Method Post -Body $jsonBody -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "✅ Resposta recebida:" -ForegroundColor Green
    Write-Host ""
    
    # Formatar resposta
    if ($response.success) {
        Write-Host "Identificação:" -ForegroundColor Cyan
        Write-Host $response.identification -ForegroundColor White
        Write-Host ""
        Write-Host "Timestamp: $($response.timestamp)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Erro na identificação" -ForegroundColor Red
        Write-Host $response | ConvertTo-Json -Depth 10
    }
    
} catch {
    Write-Host "❌ Erro na requisição:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        Write-Host "Detalhes:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Teste concluído!" -ForegroundColor Green

