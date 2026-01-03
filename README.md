# Mini Postman

A lightweight API testing tool similar to Postman. Create, send, and manage API requests, save requests & collections, import from cURL/Postman collections, and test APIs with ease.

## Video


[![Watch](https://img.youtube.com/vi/YOUTUBE_VIDEO_ID/0.jpg)](https://drive.google.com/file/d/1obK4CNKyPd_5VUx5T62fYDVP-J-EYsP8/view?usp=sharing)

Click the image above to watch the full demo video.




---

## Table of Contents

- [Features](#features)  
- [Folder Structure](#folder-structure)  
- [Database Schema](#database-schema)  
- [Backend API](#backend-api)  
- [Frontend](#frontend)  
- [Setup & Run](#setup--run)  
- [Postman Collection Example](#postman-collection-example)  
- [cURL Example](#curl-example)  
- [Future Improvements](#future-improvements)  

---

## Features

- User Authentication (Sign up, Login, Logout)  
- Send API requests (GET, POST, PUT, DELETE)  
- Save requests to the database  
- Add headers & body  
- Execute requests & view response  
- Import from cURL command  
- Import Postman v2 collection  
- Environment variables support  

---




Setup & Run
Backend

Navigate to the backend folder:

cd Backend


Install dependencies:

npm install


Create .env file at the root of backend:

PORT=5000
JWT_SECRET=super_secret_key
DB_PATH=./database.sqlite


Initialize the database (SQLite creates the file automatically):

node src/server.js
# Database tables will auto-create on server start


Server will run at:

http://localhost:5000

Frontend

Navigate to frontend folder:

cd Frontend


Install dependencies:

npm install


Create .env.local if needed:

VITE_API_BASE_URL=http://localhost:5000/api/v1


Run frontend:

npm run dev


Open browser:

http://localhost:5173


## Folder Structure

MiniPostman/
│
├─ Backend/
│ ├─ src/
│ │ ├─ controllers/
│ │ │ ├─ auth.controller.js
│ │ │ ├─ request.controller.js
│ │ │ └─ environment.controller.js
│ │ ├─ models/
│ │ │ ├─ user.model.js
│ │ │ ├─ request.model.js
│ │ │ ├─ requestExecution.model.js
│ │ │ └─ environment.model.js
│ │ ├─ routes/
│ │ │ ├─ v1/
│ │ │ │ ├─ auth.routes.js
│ │ │ │ ├─ request.routes.js
│ │ │ │ └─ environment.routes.js
│ │ │ └─ index.js
│ │ ├─ middleware/
│ │ │ └─ auth.middleware.js
│ │ └─ utils/
│ │ └─ dbAsync.js
│ └─ database.sqlite
│
├─ Frontend/
│ ├─ src/
│ │ ├─ pages/
│ │ │ ├─ LoginPage.jsx
│ │ │ └─ SignupPage.jsx
│ │ ├─ store/
│ │ │ └─ slices/
│ │ │ ├─ authSlice.js
│ │ │ ├─ requestsSlice.js
│ │ │ └─ collectionsSlice.js
│ │ ├─ layout/
│ │ │ └─ AuthLayout.jsx
│ │ └─ services/
│ │ └─ api.js
│ └─ index.html
│
└─ README.md



MiniPostman/
│
├─ Backend/
│ ├─ src/
│ │ ├─ controllers/
│ │ │ ├─ auth.controller.js
│ │ │ ├─ request.controller.js
│ │ │ └─ environment.controller.js
│ │ ├─ models/
│ │ │ ├─ user.model.js
│ │ │ ├─ request.model.js
│ │ │ ├─ requestExecution.model.js
│ │ │ └─ environment.model.js
│ │ ├─ routes/
│ │ │ ├─ v1/
│ │ │ │ ├─ auth.routes.js
│ │ │ │ ├─ request.routes.js
│ │ │ │ └─ environment.routes.js
│ │ │ └─ index.js
│ │ ├─ middleware/
│ │ │ └─ auth.middleware.js
│ │ └─ utils/
│ │ └─ dbAsync.js
│ └─ database.sqlite
│
├─ Frontend/
│ ├─ src/
│ │ ├─ pages/
│ │ │ ├─ LoginPage.jsx
│ │ │ └─ SignupPage.jsx
│ │ ├─ store/
│ │ │ └─ slices/
│ │ │ ├─ authSlice.js
│ │ │ ├─ requestsSlice.js
│ │ │ └─ collectionsSlice.js
│ │ ├─ layout/
│ │ │ └─ AuthLayout.jsx
│ │ └─ services/
│ │ └─ api.js
│ └─ index.html
│
└─ README.md


Postman Collection Example
<details> <summary>Click to expand JSON</summary>
{
  "info": {
    "_postman_id": "b9f1c2a4-1234-4a12-9b45-abc123xyz",
    "name": "Mini Postman Demo Collection",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Users",
      "request": {
        "method": "GET",
        "header": [
          { "key": "Accept", "value": "application/json" }
        ],
        "url": { "raw": "{{baseUrl}}/users", "host": ["{{baseUrl}}"], "path": ["users"] }
      }
    },
    {
      "name": "Create Post",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Hello World\",\n  \"body\": \"This is a test post\",\n  \"userId\": 1\n}"
        },
        "url": { "raw": "{{baseUrl}}/posts", "host": ["{{baseUrl}}"], "path": ["posts"] }
      }
    }
  ]
}


cURL Example
# GET Users
curl -X GET "http://localhost:5000/api/v1/requests" \
-H "Accept: application/json" \
--cookie "token=<your_jwt_token>"

# POST a Request
curl -X POST "http://localhost:5000/api/v1/requests" \
-H "Content-Type: application/json" \
--cookie "token=<your_jwt_token>" \
-d '{
  "name": "Get Users",
  "method": "GET",
  "url": "https://jsonplaceholder.typicode.com/users",
  "headers": [{ "key": "Accept", "value": "application/json" }]
}'
