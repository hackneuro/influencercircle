
$env:VERCEL_ORG_ID = "team_Dj2DqCOnEynmyz033J9Ex7ev"
$env:VERCEL_PROJECT_ID = "prj_VMkqlPBAGAJnYN2PeDSqiWs1zUNs"

$vars = @{
    "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_ARGENTINA" = "prod_Tpa8Krwgo4oIpg"
    "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_AUSTRALIA" = "prod_Tpa7PuntOGAaMd"
    "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_BRAZIL" = "prod_Tpa5qDMf9Ape2T"
    "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_CHILE" = "prod_Tpa9MDdd6Jqgbv"
    "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_COLOMBIA" = "prod_Tpa715p8yjCtYI"
    "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_EUROPE" = "prod_Tpa6nEG7wuFHFg"
    "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_INDIA" = "prod_Tpa7qpLhtguRjR"
    "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_MEXICO" = "prod_Tpa8LjRlwrXtlG"
    "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_USA" = "prod_Tpa5pjg30ulWko"
    "NEXT_PUBLIC_STRIPE_ELITE_PUC_ANGELS_PRICE_ID" = "prod_ToNinTROLT1kOB"
}

foreach ($key in $vars.Keys) {
    Write-Host "Adding $key..."
    # Usando echo para responder ao prompt da CLI (valor + confirmação)
    echo $vars[$key] "n" | npx vercel env add $key production
}
