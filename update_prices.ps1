
$env:VERCEL_ORG_ID = "team_Dj2DqCOnEynmyz033J9Ex7ev"
$env:VERCEL_PROJECT_ID = "prj_VMkqlPBAGAJnYN2PeDSqiWs1zUNs"

$vars = @{
    "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_ARGENTINA" = "price_1T52MpPcE1dEtoc26s777X8i"
    "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_AUSTRALIA" = "price_1Srux6PcE1dEtoc2p5MWOkZJ"
    "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_BRAZIL" = "price_1T52PgPcE1dEtoc2KJAJTNAc"
    "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_CHILE" = "price_1SruzDPcE1dEtoc2YjMhLcpb"
    "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_COLOMBIA" = "price_1SruxdPcE1dEtoc2ixO01SZR"
    "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_EUROPE" = "price_1Sruw2PcE1dEtoc2x5UgRZG3"
    "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_INDIA" = "price_1SruwmPcE1dEtoc2J68vDUy3"
    "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_MEXICO" = "price_1SruydPcE1dEtoc21hLdbYlM"
    "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_USA" = "price_1T52QVPcE1dEtoc2LeCUYCfO"
    "NEXT_PUBLIC_STRIPE_ELITE_PUC_ANGELS_PRICE_ID" = "price_1T52RePcE1dEtoc2yGU5eht3"
}

foreach ($key in $vars.Keys) {
    Write-Host "Updating $key to $($vars[$key])..."
    # Remove first to ensure update
    echo "y" | npx vercel env rm $key production
    echo $($vars[$key]) "n" | npx vercel env add $key production
}
