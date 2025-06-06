Clone the repository

The follow the steps to run the project

Make sure **`docker-compose.yml`** is located in the root folder
Then run

	`docker compose up --build`

It will start pulling images and then build the systems


------------


**BACKEND**

Right after that use the following commands to generate and migrate postgres schema
schema is located at **`backend/drizzle/schema.js`**

To generate use 

	`npx drizzle-kit generate`

Once generation is done use migration command as follows

	`npx drizzle-kit migrate`

Once everything is done check if backend server is running by visiting the following url

	`http://localhost:5000/`

This will show response like "Welcome to the Task Management API"
                                
<br><br>

**DB INDEXING (Optional)**

Create index as follows for better  data retrieval

CREATE UNIQUE INDEX idx_users_email ON users (email);

CREATE INDEX idx_users_id ON users (id);

CREATE INDEX idx_tasks_user_filtering_ordering
ON tasks (
  user_id,
  deleted,
  priority,
  status,
  due_date,
  created_at DESC
);

CREATE INDEX idx_tasks_id_user_id ON tasks (id, user_id);


