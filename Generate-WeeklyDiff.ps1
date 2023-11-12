# Get last commit  (Monday-Sunday)
$currentDate = Get-Date
$todayString = (Get-Date $currentDate -Format "yyyyMMdd")

# Get last Monday
$n = 0
do {
    $monday = (Get-Date -Hour 0 -Minute 0 -Second 0).AddDays($n)
    $n--
}
Until ( $monday.DayOfWeek -eq "Monday" )
$mondayString = (Get-Date $monday -Format "o")

$commitID = (git log --until "$mondayString" --format="%H" -- 'data')[0]

# Find changed files
$changedFiles = git diff --name-only $commitID -- 'data'

# Generate difference JSON
$changedFiles | ForEach-Object {
	<#
	$changedFile = $changedFiles[0]
	#>
	$changedFile = $_
	# TODO Supress error if file doesn't exist
	
	$oldVersionRaw = git show "$($commitID):$changedFile"
	# Covers the case where the file was added in the commit
	if (-not $oldVersionRaw) {
		$oldVersionRaw = "{}"
	}
	$oldVersion = $oldVersionRaw | ConvertFrom-Json
	$currentVersion = (git show "HEAD:$changedFile") | ConvertFrom-Json
	$oldVersion = if ($oldVersion) { $oldVersion } else { $currentVersion }
	[PSCustomObject]@{
			Path = $_
			CurrentVersion = $currentVersion
			OldVersion = $oldVersion
	}
} | ConvertTo-Json -Depth 3| Out-File "www/data/weekly/$todayString.json"