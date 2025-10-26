
## ⚙️ Setup & Installation

### Backend Setup

```bash
cd Backend
dotnet restore
dotnet ef database update    # Apply migrations to create the SQLite DB
dotnet run
```

### Frontend Setup

```cd frontend
npm install
npm run dev
```
### Deployed links 

- The backend is deployed at render using docker as runtime and frontend is deployed at vercel at the following links. To run the app on localhost pls make changes at the required API url declaration. 
- Here, it is located in the file `services/api.ts`.

vercel: https://appsian-2-8b5p.vercel.app/
backend: https://appsian-2.onrender.com