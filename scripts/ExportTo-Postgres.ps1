cd data/versions
$allFiles = Get-ChildItem -Recurse -File "*.json"
$csvFilePath = 'export.csv'
"timestamp`tguid`tcategory`ttitle`tdescription`tpubdate`tupdated`tpublicdisclosureavailabilitydate`tpublicpreviewdate" | 
	Out-File $csvFilePath

foreach ($file in $allFiles) {
	$data = $null
	$data = Get-Content $file | ConvertFrom-Json -Depth 2
	$processedDescription = $data.description.replace(
		# Newlines are OK, that was a false positive
		# Covers newlines
		# "`n","\n").replace(
		# # Covers single quotes
		# "'","''"
		# ).replace(
		# Covers double quotes
		'"',"'`""
		)
	$processedTitle = $data.title.replace(
		# Newlines are OK, that was a false positive
		# Covers newlines
		# "`n","\n").replace(
		# # Covers single quotes
		# "'","''"
		# ).replace(
		# Covers double quotes
		'"',"'`""
		)
	"$($data.timestamp.toString('yyyy-MM-dd hh:mm:ss'))`t$($data.guid)`t{$($data.category -join ',')}`t`"$processedTitle`"`t`"$processedDescription`"`t`"$($data.pubdate)`"`t`"$($data.updated)`"`t`"$($data.publicDisclosureAvailabilityDate)`"`t`"$($data.publicPreviewDate)`"" | Out-File $csvFilePath -Append
	Start-Sleep -Milliseconds 5
	$n++
}

# Delimiter: [tab]
# Quote "
# Escape '
# Remove id from columns
