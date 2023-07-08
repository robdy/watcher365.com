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