$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
Push-Location $projectRoot
try {
  foreach ($task in @('build','check','test')) {
    & npm.cmd run $task
    if ($LASTEXITCODE -ne 0) { throw "Failed task: $task" }
  }
  $stamp = (Get-Date).ToString('yyyyMMdd-HHmmss')
  $delivery = Join-Path $projectRoot "deliverables/aperturelab-v5-$stamp"
  $sourceStage = Join-Path $delivery 'source'
  New-Item -ItemType Directory -Path $sourceStage | Out-Null
  foreach ($directory in @('src','content','public','docs')) {
    Copy-Item -LiteralPath (Join-Path $projectRoot $directory) -Destination $sourceStage -Recurse
  }
  foreach ($file in @('package.json','package-lock.json','site.config.json','README.md','LICENSE','THIRD_PARTY_NOTICES.md','CONTRIBUTING.md')) {
    Copy-Item -LiteralPath (Join-Path $projectRoot $file) -Destination $sourceStage
  }
  $scriptStage = New-Item -ItemType Directory -Path (Join-Path $sourceStage 'scripts')
  $allowed = @('build.cjs','check.cjs','serve.cjs','members.cjs','projects.cjs','logo-leaves.cjs','aperture.cjs','make-aperture-assets.cjs','package.ps1')
  Get-ChildItem -LiteralPath $PSScriptRoot -File | Where-Object { $_.Name -in $allowed -or $_.Name.EndsWith('.test.mjs') } | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination $scriptStage.FullName
  }
  $assetStage = New-Item -ItemType Directory -Path (Join-Path $sourceStage 'source-assets')
  Copy-Item -LiteralPath (Join-Path $projectRoot 'source-assets/valve-aperture-science-original.svg') -Destination $assetStage.FullName
  Compress-Archive -Path (Join-Path $sourceStage '*') -DestinationPath (Join-Path $delivery 'source.zip')
  Compress-Archive -Path (Join-Path $projectRoot 'public/*') -DestinationPath (Join-Path $delivery 'site.zip')
  Copy-Item -LiteralPath (Join-Path $projectRoot 'docs/开发文档.md'),(Join-Path $projectRoot 'docs/交付说明.md') -Destination $delivery
  $manifest = @('source.zip','site.zip') | ForEach-Object {
    $f = Get-Item -LiteralPath (Join-Path $delivery $_)
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try { $hash = [BitConverter]::ToString($sha.ComputeHash([System.IO.File]::ReadAllBytes($f.FullName))).Replace('-','') } finally { $sha.Dispose() }
    [ordered]@{file=$_.ToString();bytes=$f.Length;sha256=$hash}
  }
  $manifest | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $delivery '校验清单.json') -Encoding UTF8
  $outer = "$delivery.zip"
  Compress-Archive -LiteralPath (Join-Path $delivery 'source.zip'),(Join-Path $delivery 'site.zip'),(Join-Path $delivery '开发文档.md'),(Join-Path $delivery '交付说明.md'),(Join-Path $delivery '校验清单.json') -DestinationPath $outer
  Write-Output "Delivery: $outer"
} finally { Pop-Location }
