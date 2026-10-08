# sync.ps1 - git-sync the campaign repos.
# Run by Claude Code SessionStart/SessionEnd hooks (see .claude/settings.local.json in each repo
# listed in sync-repos.txt; wiring a new machine is documented in BOOTSTRAP.md next to this file).
#
# Carried over from fvtt-campaign-greenrest (2026-09-27) with two changes, both aimed at what made
# that repo messy:
#   - STRAYS ARE NOT COMMITTED. Greenrest's `git add -A` swept in whatever landed in the tree -
#     387 node_modules files, stray art crops. Here, an untracked path whose top-level entry is not
#     already tracked (a new root file or folder) is left unstaged and named, so it gets filed or
#     committed on purpose. Everything under an existing folder syncs as before.
#   - THE COMMIT MESSAGE SAYS WHAT CHANGED ("sync (<machine>): plans, world/npcs - 3 files")
#     instead of 56 identical "notes sync" commits.
#
# Location-independent: everything resolves from $PSScriptRoot, so this file works from any repo
# one level under the Repos parent directory.
#
# Best-effort by design: offline or missing-remote just means "sync later" - never block a session.
$ErrorActionPreference = 'Continue'
$parent = Split-Path -Parent $PSScriptRoot
$manifest = Join-Path $PSScriptRoot 'sync-repos.txt'
if (-not (Test-Path $manifest)) { exit 0 }
$names = Get-Content $manifest | Where-Object { $_.Trim() -and -not $_.Trim().StartsWith('#') }
foreach ($name in $names) {
    $n = $name.Trim()
    $repo = Join-Path $parent $n
    if (-not (Test-Path (Join-Path $repo '.git'))) {
        Write-Output "sync: skip $n (not cloned on this machine)"
        continue
    }
    # Only ever sync 'main'. A clone still on 'master' would otherwise be
    # auto-committed and pushed to a NEW origin/master: push.default=simple
    # recreates the branch the 2026-08-13 rename deleted, and exits 0, so it
    # looks like a clean push. Skip loudly instead.
    $branch = git -C $repo rev-parse --abbrev-ref HEAD
    if ($branch -ne 'main') {
        Write-Output "sync: SKIP $n - on branch '$branch', expected 'main'. Nothing committed or pushed."
        continue
    }
    $dirty = git -C $repo status --porcelain
    if ($dirty) {
        git -C $repo add -A | Out-Null
        # Unstage strays: new paths whose top-level entry is not already tracked.
        $known = @(git -C $repo ls-tree --name-only HEAD 2>$null)
        if ($known.Count -gt 0) {
            $strays = @(git -C $repo diff --cached --name-only --diff-filter=A |
                Where-Object { $known -notcontains ($_ -split '/')[0] })
            if ($strays.Count -gt 0) {
                git -C $repo reset -q -- $strays | Out-Null
                Write-Output "sync: $n - $($strays.Count) stray path(s) NOT committed (new at the root; file them or commit on purpose):"
                $strays | ForEach-Object { Write-Output "        $_" }
            }
        }
        $staged = @(git -C $repo diff --cached --name-only)
        if ($staged.Count -gt 0) {
            $areas = $staged | ForEach-Object {
                $p = $_ -split '/'
                if ($p.Count -gt 2 -and @('world', 'sessions', 'party-snapshots', 'players') -contains $p[0]) { "$($p[0])/$($p[1])" }
                elseif ($p.Count -gt 1) { $p[0] } else { $_ }
            } | Sort-Object -Unique
            $noun = if ($staged.Count -eq 1) { 'file' } else { 'files' }
            git -C $repo commit -m "sync ($env:COMPUTERNAME): $($areas -join ', ') - $($staged.Count) $noun" | Out-Null
        }
    }
    $hasRemote = git -C $repo remote
    if (-not $hasRemote) {
        Write-Output "sync: $n committed locally (no remote yet - see BOOTSTRAP.md)"
        continue
    }
    # Explicit refspecs: never let push.default pick the remote branch for us.
    #
    # Fetch and rebase are kept SEPARATE, and the rebase targets the stable
    # remote-tracking ref (origin/main) rather than FETCH_HEAD. `git pull --rebase`
    # rebases onto FETCH_HEAD, and FETCH_HEAD is a single shared file: when two
    # hook runs fetch the same repo at once - which happens on every Claude Code
    # RESTART, where the old session's SessionEnd and the new session's SessionStart
    # both fire this script, and any time two agents run in one repo - it can hold
    # more than one for-merge entry and git aborts with
    # "fatal: Cannot rebase onto multiple branches." (Observed twice on LAPTOP-16,
    # 2026-08-17, on both the notes and campaign repos.) Nothing was ever pushed and
    # the next sync healed it, but the scary message cost real diagnosis time twice.
    # origin/main is written per-remote-branch and is immune to that race.
    $fetchOut = git -C $repo fetch origin main 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Output "sync: $n FETCH FAILED - nothing pushed (offline?):"
        $fetchOut | ForEach-Object { Write-Output "        $_" }
        continue
    }
    $pullOut = git -C $repo rebase --autostash origin/main 2>&1
    if ($LASTEXITCODE -ne 0) {
        # Leave no half-finished rebase behind for the next session to trip over.
        git -C $repo rebase --abort 2>&1 | Out-Null
        Write-Output "sync: $n REBASE FAILED - nothing pushed, rebase aborted. Resolve by hand:"
        $pullOut | ForEach-Object { Write-Output "        $_" }
        continue
    }
    $pushOut = git -C $repo push origin HEAD:main 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Output "sync: $n synced"
    }
    else {
        Write-Output "sync: $n PUSH FAILED - offline, or remote repo missing? see BOOTSTRAP.md:"
        $pushOut | ForEach-Object { Write-Output "        $_" }
    }
}
exit 0
