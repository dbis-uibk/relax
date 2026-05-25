# This script was added in 2026 to repair "languages.csv": the file was maintained only partially, most
# changes were done in JSON files. So this script rebuilds "languages.csv" based on the json files.
# Ideally, it should never be used again, as future localization changes will always be done in "languanges.csv",
# and the json files are built by "writeLanguageFiles.py"

# Move to script dir so that all files are searched in this path.
Set-Location (Split-Path $script:MyInvocation.MyCommand.Path)

[string[]] $languages = @("en", "pt", "de", "es", "kr", "it")
# Hashtable of hashtable of all translations per Language (first key is language, second key is resource name)
$jsonstrings = @{}
foreach ($lang in $languages) { 
  [string] $jsonfile = "$lang.json"

  $jsonData = Get-Content -Path $jsonfile -Raw | ConvertFrom-Json

  # Build List (order is necessary), because it defines the output order
  $dictionary = [ordered]@{}

  foreach ($prop in  $jsonData.PSObject.Properties) {
    $dictionary.Add($prop.Name, $prop.Value)
  }

  $jsonstrings.Add($lang, $dictionary)
}


$newLines = @()
# Loop over the "en" localizations - they define the order.
foreach ($prop in  $jsonstrings["en"].Keys) {
  # Copy all values:
  # First add all properties to a hashtable, then create a PSCustomObject.
  # I think it should be a ordered hashtable so that property order is the same as in the language list.
  $myHashtable = [ordered]@{
    Key     = $prop
  }
  # Add languages:
  foreach ($lang in $languages) {
    # If string is empty, revert to english text.
    [string] $translation = $jsonstrings[$lang][$prop]
    if ($lang -ne "en" -and [string]::IsNullOrEmpty($translation) ) {
      $translation = $jsonstrings["en"][$prop]
      Write-Host "missing translation for $lang and $prop - falling back to english: ""$translation"""
      if ([string]::IsNullOrEmpty($translation)){
        Write-Host "No english translation for $prop" -ForegroundColor Red
      }
    }
    $myHashtable.Add($lang, $translation)
  }

  # Now build a PSCustomObject for the csv line
  $newLine = [pscustomobject]$myHashtable 

  $newLines += $newLine
}

$newLines | Export-CSV -Path "languages.csv"  -UseQuotes AsNeeded  # Use quotes only if needed.

Read-Host -Prompt "Done. Press ENTER to continue."