#region Settings and variables
$dataFolder = 'data'
$versionFolder = Join-Path $dataFolder 'versions'
$roadmapRSSUri = 'https://www.microsoft.com/en-us/microsoft-365/RoadmapFeatureRSS/'
#endregion Settings and variables

#region Functions
function ConvertRSSToFile {
	param(
		[Parameter(Mandatory = $true,
			ValueFromPipeline = $true)]
		[Object]
		$InputObject
	)
	process {
		$matches = $null
		$publicPreviewDate = $null
		$GADate = $null
		if ($InputObject.description -match '(?: *<br>Preview date: )([\w ]+)') {
			$publicPreviewDate = $matches.1
			$InputObject.description = $InputObject.description.Replace($matches.0, '')
		}
		if ($InputObject.description -match '(?: *<br>GA date: )([\w ]+)') {
			$GADate = $matches.1
			$InputObject.description = $InputObject.description.Replace($matches.0, '')
		}

		$objProperties = [ordered]@{
			'guid'                             = $InputObject.guid.'#text'
			'link'                             = $InputObject.link
			'category'                         = $InputObject.category | Sort-Object
			'title'                            = $InputObject.title
			'description'                      = $InputObject.description
			'pubDate'                          = $InputObject.pubDate
			'updated'                          = $InputObject.updated
			'publicDisclosureAvailabilityDate' = $GADate
			'publicPreviewDate'                = $publicPreviewDate
		}
		$processedObj = [PSCustomObject]$objProperties

		ConvertTo-Json -InputObject $processedObj
	}
}
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
	$isNew =
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
			$propsToBeCompared = @(
				'category'
				'title',
				'description',
				'publicDisclosureAvailabilityDate',
				'publicPreviewDate'
			)
			foreach ($prop in $propsToBeCompared) {
				if ($currentData.$prop -ne $previousData.$prop) {
					$diffObject | Add-Member -Type NoteProperty -Name $prop -Value @{
						"oldValue": $previousData.$prop
						"newValue": $currentData.$prop
					}
					Write-Host "$prop of $($currentData.guid) changed from $($previousData.$prop) to $($currentData.$prop)"
				}
			}
			$versionNumber = 0
			$versionEntryFolder = Join-Path $versionFolder $currentData.guid
			do {
				$versionNumber++
				$versionFile = Join-Path $versionEntryFolder "v$($versionNumber.ToString('0000')).json"
			} until (-not (Test-Path (Join-Path $versionFolder)))
			# Save differences to file
		}
	} else {
		Write-Host "$($currentData.guid) added: $($currentData.title)"
	}
}
Write-Host 'Script finished'
#endregion Processing