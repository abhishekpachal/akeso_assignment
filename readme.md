Clone the repository

Front end codes are inside frontend folder
and server codes are inside backend folder

The follow the steps to run the project

Make sure **`docker-compose.yml`** is located in the root folder
Then run

	`docker compose up --build`

It will start pulling images and then build the system

To run on detached mode after building run

    `docker compose up -d'

For development mode run

    `docker compose -f docker-compose.dev.yml up --build` 


------------


**BACKEND**

Configurations are written in *Dockerfile* inside backend folder. For dev mode *Docerfile.dev* is referenced in docker compose file

Right after building docker compose use the following commands to generate and migrate postgres schema.
schema is located at **`backend/drizzle/schema.js`**

This project is using Drizzle ORM for database connectivity

To generate first move to **backend** folder and use 

	`npx drizzle-kit generate`

Once generation is done use migration command as follows

	`npx drizzle-kit migrate`

Once everything is done check if backend server is running by visiting the following url

	`http://localhost:5000/`

This will show response like "Welcome to the Task Management API"
                                
<br><br>

**DB INDEXING (Optional)**

```
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

CREATE INDEX idx_task_history_prev_assigned_to
ON task_history ((previous_value ->> 'assigned_to'));

CREATE INDEX idx_task_history_new_assigned_to
ON task_history ((new_value ->> 'assigned_to'));

CREATE INDEX idx_task_history_timestamp_desc
ON task_history (timestamp DESC);
```

---------------------------------------


**FRONTEND**

Configurations are written inside *Dockerfile* of frontend folder. For dev mode *Docerfile.dev* is referenced in docker compose file

Once Docker compose is running front end will also run. It can be seen using `http://localhost:3000`

If docker compose is run using `docker-compose.dev.yml` it will work as live development mode enabling fast refersh 