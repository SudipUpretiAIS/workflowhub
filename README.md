# WorkFlowHub

WorkFlowHub is a workflow management application created for the
SOFT806 Continuous Integration and Continuous Deployment assignment.

The application uses a Django REST Framework backend and a React
frontend. Users can register, log in and manage their own workflow
items.

## Technologies

- Backend: Python, Django and Django REST Framework
- Frontend: React with Vite
- Backend package management: pip and requirements.txt
- Frontend package management: npm and package.json
- Containerisation: Docker and Docker Compose
- CI pipelines: GitHub Actions and CircleCI
- Database for local development: SQLite

## Application features

- User registration
- Login and logout
- Create and view workflow items
- Edit workflow items and update their status
- Delete workflow items
- Access only the authenticated user's workflow items

Workflow item statuses are:

- Pending
- In Progress
- Completed

## Run the application with Docker Compose

### Requirements

- Git
- Docker Desktop with Docker Compose

### 1. Clone the repository

Open a terminal and run:

```bash
git clone https://github.com/SudipUpretiAIS/workflowhub.git
cd workflowhub
```

Until the Docker Compose changes are merged into `main`, select
the branch that contains the complete local setup:

```bash
git switch feature/docker-compose
```

### 2. Configure the backend environment

On Windows Command Prompt, copy the example environment file:

```cmd
copy backend\.env.example backend\.env
```

Open `backend\.env` and replace the example `DJANGO_SECRET_KEY`
with your own random value.

For local development, the file should include:

```text
DJANGO_SECRET_KEY=your-own-random-secret-key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
```

Do not use the example secret key above for a real deployment.
The local `.env` file must not be committed to GitHub.

### 3. Start the application

Start Docker Desktop. From the project root, run:

```bash
docker compose up --build -d
```

The first build may take a few minutes.

### 4. Open the application

Open the frontend in your browser:

```text
http://localhost:5173/
```

Register a new account and log in to create workflow items.

### 5. Check the containers

```bash
docker compose ps
```

### 6. Stop the containers

```bash
docker compose stop
```

### Local database

The local setup uses SQLite inside the backend container.
Data may be lost if the container is removed or recreated.

This Docker Compose setup is intended for local development
and testing.

## Run without Docker on Windows

### Requirements

- Python 3.12
- Node.js and npm
- Git

### Backend

From the project root:

```cmd
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r backend\requirements.txt
copy backend\.env.example backend\.env
```

Edit `backend\.env` and set your own local secret key. Then run:

```cmd
python backend\manage.py migrate
python backend\manage.py runserver
```

The backend development server runs at:

```text
http://127.0.0.1:8000/
```

If `backend\.env` already exists, use the existing file instead
of overwriting it.

### Frontend

Open a separate Command Prompt in the project root:

```cmd
copy frontend\.env.example frontend\.env
cd frontend
npm ci
npm run dev
```

Open the local URL shown in the terminal.

`VITE_API_URL` configures the backend API address. Frontend
environment variables are visible to the browser, so do not
put secrets in them.

## Run backend tests

With the Python virtual environment activated, run from the
project root:

```cmd
python backend\manage.py test userauth workflows
```

## Continuous integration

### GitHub Actions

The workflow configuration is stored in:

```text
.github/workflows/docker-build.yml
```

It builds the backend and frontend Docker images and runs
backend tests.

### CircleCI

The pipeline configuration is stored in:

```text
.circleci/config.yml
```

It also builds the Docker images and runs backend tests.

## Project structure

```text
backend/             Django backend and Python dependencies
frontend/            React frontend and npm dependencies
.github/workflows/   GitHub Actions configuration
.circleci/           CircleCI configuration
compose.yml          Docker Compose configuration
```

## Development workflow

1. Select a GitHub issue.
2. Create a feature branch.
3. Make changes and commit them.
4. Push the branch and create a pull request.
5. Check the CI pipeline results.
6. Review and merge changes according to the project workflow.