# TFS Pre-Release script for Angular .NetCore applications
# 
# Author:  Geno Salvati (Turner)
# Created:  12/22/2016

# get incoming release variables as parameters
param
(
	[string] $projectNameToBuild,
	[string] $releaseDropsFolder,
	[string] $releaseName,
	[string] $releaseEnvironment
)

# get computername from environment
$computerName = $env:COMPUTERNAME

# get date
$currentDateTime = Get-Date

if($projectNameToBuild -ne $null -and $projectNameToBuild -ne '') {
	write-verbose "Running Pre-release script for project: $projectNameToBuild on server $computerName"
}
else {
	write-verbose "Running Pre-release script for solution on server $computerName"
}

# create diagnostics directory and servername.txt
$diagnosticsPath = $releaseDropsFolder + '/wwwroot/diagnostics'
write-verbose "Checking if diagnostics directory exists at $diagnosticsPath on server $computerName"
if (!(Test-Path -Path $diagnosticsPath -PathType Container)) {
	write-verbose "Starting... Creating diagnotic directory at $diagnosticsPath on server $computerName"
	md -Path $diagnosticsPath
	write-verbose "Complete... Creating diagnotic directory at $diagnosticsPath on server $computerName"
}
else {
	write-verbose "Diagnostics directory already exists at $diagnosticsPath on server $computerName"
}

$servernameFilePath = $releaseDropsFolder + '/wwwroot/diagnostics'
$servernameFileLocation = $servernameFilePath + '/servername.txt'
write-verbose "Checking if servername.txt exists at $servernameFilePath on server $computerName"
if (!(Test-Path -Path $servernameFileLocation)) {
	write-verbose "Starting... Creating servername.txt at $servernameFilePath on server $computerName"
	New-Item -Path $servernameFilePath -Name "servername.txt" -Value $computerName -ItemType "file" -Confirm:$false
	write-verbose "Complete... Creating servername.txt at $servernameFilePath on server $computerName"
}
else {
	write-verbose "servername.txt already exists at $servernameFilePath on server $computerName"
}

$deploymentDetailsFilePath = $releaseDropsFolder + '/wwwroot/diagnostics'
$deploymentDetailsFileLocation = $deploymentDetailsFilePath + '/deploymentdetails.txt'
$deploymentDetailsMessage = "Deployment of project: $projectNameToBuild from release: $releaseName-$releaseEnvironment at: $currentDateTime"
write-verbose "Checking if deploymentdetails.txt exists at $deploymentDetailsFilePath on server $computerName"
if (Test-Path -Path $deploymentDetailsFileLocation) {
	# file already exists
	write-verbose "deploymentdetails.txt already exists at $servernameFilePath on server $computerName"
	write-verbose "Starting... Replacing contents of deploymentdetails.txt at $deploymentDetailsFilePath on server $computerName"	
	Set-Content -Path $deploymentDetailsFileLocation -Value $deploymentDetailsMessage
	write-verbose "Complete... Replacing contents of deploymentdetails.txt at $deploymentDetailsFilePath on server $computerName"

}
else {
	# need to create it	
	write-verbose "Starting... Creating deploymentdetails.txt at $deploymentDetailsFilePath on server $computerName"	
	New-Item -Path $deploymentDetailsFilePath -Name "deploymentdetails.txt" -Value $deploymentDetailsMessage -ItemType "file" -Confirm:$false
	write-verbose "Complete... Creating deploymentdetails.txt at $deploymentDetailsFilePath on server $computerName"
}

# reset IIS to close any open connections
write-verbose "Starting...  Reset IIS"
& 'iisreset' | out-host
write-verbose "Complete...  Reset IIS"

write-verbose "Pre-release script completed"
