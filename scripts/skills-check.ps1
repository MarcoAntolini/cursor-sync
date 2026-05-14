$ErrorActionPreference = 'SilentlyContinue'
$sync   = "$env:USERPROFILE\cursor-sync"
$status = "$sync\.skills-check-status.json"
$lock   = "$sync\.skills-check.lock"

# Mutex via lock file
try {
  $fs = [System.IO.File]::Open($lock, 'OpenOrCreate', 'ReadWrite', 'None')
} catch { exit 0 }

try {
  $job = Start-Job -ScriptBlock { npx -y skills check -g 2>&1 }
  $done = Wait-Job $job -Timeout 90
  if (-not $done) { Stop-Job $job; Remove-Job $job -Force; exit 0 }
  $output = Receive-Job $job -ErrorAction SilentlyContinue
  Remove-Job $job -Force

  $pendingLines = $output | Select-String -Pattern 'update available|outdated|needs? update' -CaseSensitive:$false
  $pending = ($pendingLines | Measure-Object).Count
  $summary = ($pendingLines | ForEach-Object {
    ($_ -split '\s+' | Select-Object -First 1)
  }) -join ','

  $now = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
  @{
    checkedAt = $now
    pending   = $pending
    summary   = $summary
  } | ConvertTo-Json | Set-Content -Path $status -Encoding UTF8
} finally {
  $fs.Close()
  Remove-Item $lock -ErrorAction SilentlyContinue
}