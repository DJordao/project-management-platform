# Pgp_Diogo_Filipe

## Project description
A web platform for project management with 2 types of users: project managers (can create/update/delete projects and tasks) and developers (can manage associated tasks and their state).

## Technologies used:
C# and Angular.

## Tools used:
GitHub for version control;
Postman for API testing;
Microsof SQL Server Management Studio to create the database diagram, and to help with the management of the database during development.

## To run this project:
* In the root folder run
  ```shellscript
   dotnet run
   ```
* In the angular folder (ClientApp) run 
  ```shellscript 
  npm start
  ```
  
## Notes:
On the first execution (when the database is empty), sample data will be created automatically (2 projects, managed by 1 project manager, each with 2 tasks, associated to 2 developers).
The default password for these users is "Password123!".

