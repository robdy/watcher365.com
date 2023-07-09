#region Settings and variables
$dataFolder = 'data'
$versionFolder = Join-Path $dataFolder 'versions'
#endregion Settings and variables

#region Processing
$allFiles = Get-ChildItem $dataFolder -File
foreach ($file in $allFiles[0..9]) {
	<#
	$file = $allFiles[0]
	#>
	$gitLog = git log "data/$($file.Name)"
	$commitsList = $gitLog | Select-String -Pattern 'commit \w{40}'

	for ($i = $commitsList.count; $i -gt 0; $i--) {
		if ($commitsList[$i]) {
			$beforeCommit = $commitsList[$i].Line.replace('commit ','')
		} else {
			$beforeCommit = ''
		}
		$afterCommit  = $commitsList[$i-1].Line.replace('commit ','')
		$commitDateString = $gitLog[$commitsList[$i-1].LineNumber +1] -replace('^Date:\s*')
		$commitDateObj = [DateTime]::parseexact($commitDateString, 'ddd MMM d HH:mm:ss yyyy K', $null)
		$commitDate = Get-Date $commitDateObj -Format 'o'
		# Compare content from two commits
		if ($beforeCommit) {
			$beforeContent = git show "$($beforeCommit):data/$($file.Name)"
		} else {
			$beforeContent = "{ }"
		}
		$afterContent  = git show "$($afterCommit):data/$($file.Name)"

		$previousData = $beforeContent | ConvertFrom-Json
		$currentData  = $afterContent  | ConvertFrom-Json
		
		# Extract changes
		#TODO Fix bug not detecting change in category
		if (Compare-Object $currentData.PSObject.Properties $previousData.PSObject.Properties) {
			# If there are differences
			$diffObject = New-Object PSObject
			$diffObject | Add-Member -Type NoteProperty -Name 'timestamp' -Value $commitDate
			$propsToBeCompared = @(
				'category'
				'title',
				'description',
				'publicDisclosureAvailabilityDate',
				'publicPreviewDate'
			)
			foreach ($prop in $propsToBeCompared) {
				if (
					(
						($prop -ne 'category') -and
						($currentData.$prop -ne $previousData.$prop)
					) -or
					(
						($prop -eq 'category') -and
						(
							(-not $previousData.$prop) -or
							(Compare-Object $currentData.$prop $previousData.$prop)
						)
					)
				) {
					$diffObject | Add-Member -Type NoteProperty -Name $prop -Value @{
						"oldValue" = $previousData.$prop
						"newValue" = $currentData.$prop
					}
				}
			}
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
			$diffObject | ConvertTo-Json | Out-File $versionFile -Force
		} else { # Change in untracked property
			Write-Host "$($file.BaseName): skipping change in untracked property"
		}
	}
}# end of foreach ($file in $allFiles)
#endregion Processing
