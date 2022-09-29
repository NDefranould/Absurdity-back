Notice d'utilisation Api back
  
=> npm i  
=> npm init -y  
=> sudo nano ~/.bashrc  
=> ajouter  

    export SQITCH_USERNAME=absurdity;
    export SQITCH_PASSWORD=absurdity;  

=> Faire ctrl X puis Y puis ENTRER;  

=> FERMER VSCODE ET TERMINAL PUIS ROUVRIR

# CREATION DATABASE && DEPLOIEMENT SQITCH

=> sudo -i -u postgres psql  

=> CREATE USER absurdity WITH PASSWORD 'absurdity';  

=> CREATE DATABASE absurdity OWNER absurdity;  

=> CTRL + D (pour quitter #postgres=>)  

=> cd data/  
=> sqitch deploy  

# VERIFICATION DEPLOIEMENT SUR LA BDD

=> cd ..  
=> psql -U absurdity -d absurdity  
=> \dt  

# CONFIGURATION .ENV

=> Créer un fichier .env  
=> Copier coller ce qui suit 

            PORT=3000
            PGUSER=absurdity 
            PGHOST=localhost
            PGPASSWORD=absurdity 
            PGDATABASE=absurdity 
            PGPORT=5432

