$env:PATH = "C:\Program Files\Git\cmd;C:\Program Files\Git\bin;$env:PATH"
$puro = Get-ChildItem -Path (Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Packages") `
  -Recurse -Filter puro.exe -ErrorAction SilentlyContinue |
  Select-Object -First 1 -ExpandProperty FullName

if (-not $puro) {
  Write-Error "Puro executable was not found under LOCALAPPDATA."
  exit 1
}

& $puro flutter @Args
