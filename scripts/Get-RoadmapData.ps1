#region Settings and variables
$dataFolder = 'data'
$versionFolder = Join-Path $dataFolder 'versions'
$roadmapRSSUri = 'https://www.microsoft.com/en-us/microsoft-365/RoadmapFeatureRSS/'
$timestamp = Get-Date -Format 'o'
#endregion Settings and variables

#region Functions
. ./scripts/functions.ps1
#endregion Functions

#region Processing
Write-Host 'Script starting'
$res = Invoke-RestMethod $roadmapRSSUri

if (-not (Test-Path $dataFolder)) {
	New-Item -ItemType Directory $dataFolder
	Write-Host "Creating $dataFolder folder"
}

foreach ($entry in $res) {
	<#
	$entry = $res[0]
	#>
	# Generate filename
	$fileName = $entry.guid.'#text'
	$jsonEntry = $entry | ConvertRSSToFile
	$outFilePath = Join-Path -Path $dataFolder -ChildPath "$fileName.json"

	# Save previous version
	$isNew = -not (Test-Path $outFilePath)
	if (-not $isNew) {
		$previousData = Get-Content $outFilePath | ConvertFrom-Json
	}

	# Save to file
	$jsonEntry | Out-File -FilePath $outFilePath -Force

	# Extract changes
	if (-not $isNew) {
		$currentData = $jsonEntry | ConvertFrom-Json
		if (Compare-Object $currentData.PSObject.Properties $previousData.PSObject.Properties) {
			# If there are differences
			$diffObject = New-Object PSObject
			$diffObject | Add-Member -Type NoteProperty -Name 'timestamp' -Value $timestamp
			$propsToBeCompared = @(
				'category'
				'title',
				'description',
				'publicDisclosureAvailabilityDate',
				'publicPreviewDate'
			)
			foreach ($prop in $propsToBeCompared) {
				if (
					#TODO For category compare joined object 
					($currentData.$prop -ne $previousData.$prop)

				) {
					$diffObject | Add-Member -Type NoteProperty -Name $prop -Value @{
						"oldValue" = $previousData.$prop
						"newValue" = $currentData.$prop
					}
					Write-Host "$prop of $($fileName) changed from $($previousData.$prop) to $($currentData.$prop)"
				}
			}
			$versionNumber = 0
			$versionEntryFolder = Join-Path $versionFolder $fileName
			if (-not (Test-Path $versionEntryFolder)) {
				New-Item -ItemType Directory $versionEntryFolder
			}
			do {
				$versionNumber++
				$versionFile = Join-Path $versionEntryFolder "v$($versionNumber.ToString('0000')).json"
			} until (-not (Test-Path $versionFile))
			# Save differences to file
			$diffObject | ConvertTo-Json | Out-File $versionFile -Force
		}
	} else {
		Write-Host "$($fileName) added: $($currentData.title)"
	}
}
Write-Host 'Script finished'
#endregion Processing