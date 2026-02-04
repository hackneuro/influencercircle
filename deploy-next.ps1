<#
.SYNOPSIS
    Deploys the static Next.js site to S3 and invalidates CloudFront.
#>

$DomainName = "influencercircle.net"
$BucketName = "influencercircle.net"

# 1. Build
Write-Host "[1/3] Building Project (Static Export)..." -ForegroundColor Yellow
cmd /c "npm run build"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed."
    exit 1
}

if (-not (Test-Path "out")) {
    Write-Error "'out' folder missing. Ensure 'output: export' is in next.config.ts"
    exit 1
}

# 2. Sync
Write-Host "`n[2/3] Syncing to S3..." -ForegroundColor Yellow
aws s3 sync "out" "s3://$BucketName" --delete
if ($LASTEXITCODE -ne 0) {
    Write-Error "S3 Sync failed."
    exit 1
}

# 3. Invalidation
Write-Host "`n[3/3] Invalidating Cache..." -ForegroundColor Yellow
$DistList = aws cloudfront list-distributions --output json | ConvertFrom-Json
$Dist = $DistList.DistributionList.Items | Where-Object { $_.Aliases.Items -contains $DomainName } | Select-Object -First 1

if ($Dist) {
    aws cloudfront create-invalidation --distribution-id $Dist.Id --paths "/*"
    Write-Host "Invalidation submitted."
}
else {
    Write-Warning "Distribution not found for $DomainName."
}

Write-Host "`nDone!" -ForegroundColor Cyan
