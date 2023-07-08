#region Settings and variables
$dataFolder = 'data'
$versionFolder = Join-Path $dataFolder 'versions'
$timestamp = Get-Date -Format 'o'
#endregion Settings and variables

#region Functions
. ./scripts/functions.ps1
#endregion Functions

#region Processing
$allFiles = Get-ChildItem $dataFolder -File
foreach ($file in $allFiles) {
	<#
	$file = $allFiles[0]
	#>
	$gitLog = git log "data/$($file.Name)"
	$commitsList = $gitLog | Select-String -Pattern 'commit \w{40}'

	for ($i = $commitsList.count - 1; $i -gt 0; $i--) {
		$beforeCommit = $commitsList[$i].Line.replace('commit ','')
		$afterCommit  = $commitsList[$i-1].Line.replace('commit ','')
		# Compare content from two commits
		$beforeContent = git show "$($beforeCommit):data/$($file.Name)"
		$afterContent  = git show "$($afterCommit):data/$($file.Name)"
		#TODO Extract fuction from Get-RoadmapData.ps1 and use both here and there
	}

}
#endregion Processing
