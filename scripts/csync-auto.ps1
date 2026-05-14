Set-Location "$env:USERPROFILE\cursor-sync"
git pull --rebase --quiet 2>$null
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
  git commit -m "auto: $(Get-Date -Format o)" | Out-Null
}
git push --quiet 2>$null