# Drive and SpreadSheets
Create query to drive and spreadsheet with domain user name

## Steps

1. Creante new service account, and paste in folder as privatekey.json
1. Comprove in index.js that reference (file, emails, and id are well)
1. Enable drive and spreadsheets apis
1. In GCP "IAM/Service accounts": "Enable G Suite Domain-wide Delegation"
1. install "Service Account Id" in client Domain panel (Administrar el acceso de cliente API) with scopes:   https://www.googleapis.com/auth/drive,https://www.googleapis.com/auth/spreadsheets 


## install
    
    npm install
    node index.js


