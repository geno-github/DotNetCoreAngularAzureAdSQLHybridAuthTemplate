# TFS Build script for Angular .NetCore applications
# 
# Author:  Geno Salvati (Turner)
# Created:  7/24/2017
# Revised:  3/15/2019 - Removed DotNetCore 1.1 path stuff

# get incoming build variables as parameters
param
(
    [string] $buildConfiguration,
    [string] $buildDefinitionName,
    [string] $buildNumber,
    [string] $buildArtifactStagingDirectory,	
	[string] $projectNameToBuild,
	[string] $targetFramework
)

Write-Host "Build Configuration: " $buildConfiguration
Write-Host "Build Definition: " $buildDefinitionName
Write-Host "Build Number: " $buildNumber
Write-Host "Build Artifact Staging Directory: " $buildArtifactStagingDirectory
Write-Host "Target framework: " $targetFramework

# add type needed for archive
Add-Type -As System.IO.Compression.FileSystem

# function to be used for build process for project
function Build-Project {
	param (
		[string]$projectDirectory
	)

	cd $projectDirectory

	$projectOutput = $buildArtifactStagingDirectory + "/" + $buildNumber + "/" + $projectDirectory
	Write-Host "Project Output: " $projectOutput

	$projectOutputZip = $buildArtifactStagingDirectory + "/" + $buildNumber + "/" + $projectDirectory + ".zip"
	Write-Host "Project Output Zip: " $projectOutputZip

	$buildNumberShort = $buildNumber.Split('_')[-1]
	Write-Host "Build Number Short: " $buildNumberShort	

	# get npm dependencies
	write-host "Starting... npm install for $projectDirectory"
	&'c:\program files\nodejs\npm.cmd' install --loglevel=error 2>.\npm.errors.txt
	$messages = (Get-Content .\npm.errors.txt) 
	$errors = $messages | select-string 'ERROR' -AllMatches -CaseSensitive
	if ($errors.length -lt 0) {
		Write-Error $messages
	}
	write-host "Complete... npm install for $projectDirectory"

	# build Angular2 application with webpack		
	if (($buildConfiguration -eq 'Prod') -or ($buildConfiguration -eq 'Production')) {  # build the production version
		write-host "Starting... Angular CLI build/package for $projectDirectory - PROD configuration"
		#&'c:\program files\nodejs\npm.cmd' run buildprod 2>.\ng-build.errors.txt	
		$process = Start-Process -FilePath "C:\program files\nodejs\npm.cmd" -ArgumentList "run buildprod 2>.\ng-build.errors.txt" -PassThru -Wait
		write-host "Process exit code for npm build command: "
		$process.ExitCode
		write-host "Complete... Angular CLI build/package for $projectDirectory - PROD configuration"

		# create wwwroot if it does not already exist
		if(!(Test-Path -Path wwwroot )){
			New-Item -ItemType directory -Path wwwroot
		}

		# gzip PROD output
		cd wwwroot
		$scriptNames = gci *.js -name
		foreach ($scriptName in $scriptNames) {
			Write-Host "Compressing the following file: " $scriptName
			Compress-GZip -FullName $scriptName
		}
		cd ..
	}	
	else { 
		if ($buildConfiguration -eq 'TST') {
			write-host "Starting... Angular CLI build/package for $projectDirectory - TST configuration"
			#&'c:\program files\nodejs\npm.cmd' run buildtest 2>.\ng-build.errors.txt	
			$process = Start-Process -FilePath "C:\program files\nodejs\npm.cmd" -ArgumentList "run buildtest 2>.\ng-build.errors.txt" -PassThru -Wait
			write-host "Process exit code for npm build command: "
			$process.ExitCode
			write-host "Complete... Angular CLI build/package for $projectDirectory - TST configuration"
		}	
		else {
			write-host "Starting... Angular CLI build/package for $projectDirectory - NON-PROD configuration"
			#&'c:\program files\nodejs\npm.cmd' run build 2>.\ng-build.errors.txt	
			$process = Start-Process -FilePath "C:\program files\nodejs\npm.cmd" -ArgumentList "run build 2>.\ng-build.errors.txt" -PassThru -Wait
			write-host "Process exit code for npm build command: "
			$process.ExitCode
			write-host "Complete... Angular CLI build/package for $projectDirectory - NON-PROD configuration"
		}
	}
		
	$messages = (Get-Content .\ng-build.errors.txt) 
	$errors = $messages | select-string 'ERR!' -AllMatches -CaseSensitive
	if ($errors.length -gt 0) {
		Write-Error "Errors detected in the Angular build.  Please see TFS Build logs at Powershell step for additional details."
	}
	else {
		Write-Host "Angular build completed successfully"
	}
	write-host "Completed... Angular CLI build/package for $projectDirectory"

	# build dotnetcore application
	write-host "Starting... dotnet build for $projectDirectory"
	& 'c:\program files\dotnet\dotnet.exe' publish -f $targetFramework -c $buildConfiguration -o $projectOutput --version-suffix $buildNumberShort | Out-Host
	write-host "Completed... dotnet build for $projectDirectory"

	# create zip from output
	write-host "Starting... zipping project output from $projectOutput to $projectOutputZip"
	[io.compression.zipfile]::CreateFromDirectory($projectOutput, $projectOutputZip) 
	write-host "Completed... zipping project output from $projectOutput to $projectOutputZip"

	cd ..	
}

 function Compress-GZip {
    <#
    .NOTES
        Copyright 2013 Robert Nees
        Licensed under the Apache License, Version 2.0 (the "License");
    .SYNOPSIS
        GZip Compress (.gz)
    .DESCRIPTION
        A buffered GZip (.gz) Compress function that support pipelined input
    .Example
        ls .\NotCompressFile.xml | Compress-GZip -Verbose -WhatIf
    .Example
        Compress-GZip -FullName NotCompressFile.xml -NewName Compressed.xml.funkyextension
    .LINK
        http://sushihangover.blogspot.com
    .LINK
        https://github.com/sushihangover
    #>
    [cmdletbinding(SupportsShouldProcess=$True,ConfirmImpact="Low")]
    param (
        [Alias("PSPath")][parameter(mandatory=$true,ValueFromPipeline=$true,ValueFromPipelineByPropertyName=$true)][string]$FullName,
        [Alias("NewName")][parameter(mandatory=$false,ValueFromPipeline=$false,ValueFromPipelineByPropertyName=$true)][string]$GZipPath,
        [parameter(mandatory=$false)][switch]$Force
    )
    Process {
        $_BufferSize = 1024 * 8
        if (Test-Path -Path $FullName -PathType Leaf) {
            Write-Verbose "Reading from: $FullName"
            if ($GZipPath.Length -eq 0) {
                $tmpPath = ls -Path $FullName
                $GZipPath = Join-Path -Path ($tmpPath.DirectoryName) -ChildPath ($tmpPath.Name + '.gz')
            }
            if (Test-Path -Path $GZipPath -PathType Leaf -IsValid) {
                Write-Verbose "Compressing to: $GZipPath"
            } else {
                Write-Error -Message "$FullName is not a valid path/file"
                return
            }
        } else {
            Write-Error -Message "$GZipPath does not exist"
            return
        }
        if (Test-Path -Path $GZipPath -PathType Leaf) {
            If ($Force.IsPresent) {
                if ($pscmdlet.ShouldProcess("Overwrite Existing File @ $GZipPath")) {
                    New-Item $GZipPath -ItemType file
                }
            }
        } else {
            if ($pscmdlet.ShouldProcess("Create new Compressed File @ $GZipPath")) {
                New-Item $GZipPath -ItemType file
            }
        }
        if ($pscmdlet.ShouldProcess("Creating Compress File @ $GZipPath")) {
            Write-Verbose "Opening streams and file to save compressed version to..."
            $input = New-Object System.IO.FileStream (ls -path $FullName).FullName, ([IO.FileMode]::Open), ([IO.FileAccess]::Read), ([IO.FileShare]::Read);
            $output = New-Object System.IO.FileStream (ls -path $GZipPath).FullName, ([IO.FileMode]::Create), ([IO.FileAccess]::Write), ([IO.FileShare]::None)
            $gzipStream = New-Object System.IO.Compression.GzipStream $output, ([IO.Compression.CompressionMode]::Compress)
            try {
                $buffer = New-Object byte[]($_BufferSize);
                while ($true) {
                    $read = $input.Read($buffer, 0, ($_BufferSize))
                    if ($read -le 0) {
                        break;
                    }
                    $gzipStream.Write($buffer, 0, $read)
                }
            }
            finally {
                Write-Verbose "Closing streams and newly compressed file"
                $gzipStream.Close();
                $output.Close();
                $input.Close();
            }
        }
    }
}

# fix path
Write-Host "Starting... Adding nodejs path to path environment variable, if not already present"
$envPaths = $env:Path -split ';'
    if ($envPaths.toLower() -notcontains 'c:\program files\nodejs') {
		Write-Host "Adding nodejs path to path environment variable"
        $envPaths = $envPaths + 'c:\program files\nodejs'
        $env:Path = $envPaths -join ';'
}
Write-Host "Complete... Adding nodejs path to path environment variable, if not already present"
write-host "Path: " $env:path | out-host

# Determine script location for PowerShell
$ScriptDir = Split-Path $script:MyInvocation.MyCommand.Path
 
Write-Host "Current script directory is: $ScriptDir"

# get directories for projects in solution
$projectDirectories = Get-ChildItem -Directory
Write-Host "Solution Directories: " $projectDirectories

# loop through projects
if($projectNameToBuild -ne 'All') {
	Build-Project -projectDirectory $projectNameToBuild
}
else {
	foreach ($projectDirectory in $projectDirectories) {
		Write-Host "Directory Name: " $projectDirectory.Name
		if ($projectDirectory.Name -eq 'packages') {
			Write-Host "Skipping directory: " $projectDirectory.Name
		}
		else { # directory is not packages, OK to build
			Build-Project -projectDirectory $projectDirectory
		}
	}
}
