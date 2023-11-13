#region Settings and variables
$dataFolder = 'data'
$versionFolder = Join-Path $dataFolder 'versions'
#endregion Settings and variables

#region Processing
$allFiles = Get-ChildItem $dataFolder -File
foreach ($file in $allFiles) {
	<#
	$file = $allFiles[0]
	#>
	$gitLog = git log "data/$($file.Name)"
	$commitsList = $gitLog | Select-String -Pattern 'commit \w{40}'

	for ($i = $commitsList.count; $i -gt 0; $i--) {
		$afterCommit  = $commitsList[$i-1].Line.replace('commit ','')
		$commitDateString = $gitLog[$commitsList[$i-1].LineNumber +1] -replace('^Date:\s*')
		$commitDateObj = [DateTime]::parseexact($commitDateString, 'ddd MMM d HH:mm:ss yyyy K', $null)
		$commitDate = Get-Date $commitDateObj -Format 'o'
		$afterContent  = git show "$($afterCommit):data/$($file.Name)"

		$currentData  = $afterContent  | ConvertFrom-Json
		
		$versionNumber = 0
		$versionEntryFolder = Join-Path $versionFolder $file.BaseName
		if (-not (Test-Path $versionEntryFolder)) {
			New-Item -ItemType Directory $versionEntryFolder
		}
		do {
			$versionNumber++
			$versionFile = Join-Path $versionEntryFolder "v$($versionNumber.ToString('0000')).json"
		} until (-not (Test-Path $versionFile))
		# Save differences to file
		$fullContentObj =  $currentData | Select-Object @{name="timestamp";expression={$commitDate}},* 
		$fullContentObj | ConvertTo-Json | Out-File $versionFile -Force
	}
}# end of foreach ($file in $allFiles)
#endregion Processing
