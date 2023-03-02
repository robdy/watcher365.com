#region Settings and variables
$dataFolder = 'data'
$roadmapRSSUri = 'https://www.microsoft.com/en-us/microsoft-365/RoadmapFeatureRSS/'
#endregion Settings and variables

$res = Invoke-RestMethod $roadmapRSSUri

function ConvertRSSToFile {
	param(
		[Parameter(Mandatory = $true,
			ValueFromPipeline = $true)]
		[Object]
		$InputObject
	)

	$objProperties = [ordered]@{
		'guid'        = $InputObject.guid.'#text'
		'link'        = $InputObject.link
		'category'    = $InputObject.category | Sort-Object
		'title'       = $InputObject.title
		'description' = $InputObject.description
		'pubDate'     = $InputObject.pubDate
		'updated'     = $InputObject.updated
	}
	$processedObj = [PSCustomObject]$objProperties

	ConvertTo-Json -InputObject $processedObj
}

if (-not (Test-Path $dataFolder)) {
	New-Item -ItemType Directory $dataFolder
}

foreach ($entry in $res) {
	$fileName = $entry.guid.'#text'
	$jsonEntry = $entry | ConvertRSSToFile
	$outFilePath = Join-Path -Path $dataFolder -ChildPath "$fileName.json"
	$jsonEntry | Out-File -FilePath $outFilePath -Force
}