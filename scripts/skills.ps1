# Hierarchy-aware wrapper for the Skills CLI (skills-tree).
# Dot-source from your profile: . "$env:USERPROFILE\cursor-sync\scripts\skills.ps1"
# Or run once:                  pwsh -File ./scripts/skills.ps1 check

# Capture path at source/run time — $PSScriptRoot is empty inside the function later.
$global:SkillsTreeBin = Join-Path $PSScriptRoot "skills-cli\bin\skills-tree.mjs"

function global:skills {
  if (-not (Test-Path -LiteralPath $global:SkillsTreeBin)) {
    Write-Error "skills-tree entrypoint not found: $global:SkillsTreeBin (re-source scripts/skills.ps1)"
    return
  }
  node $global:SkillsTreeBin @args
}

if ($MyInvocation.InvocationName -ne ".") {
  skills @args
}
