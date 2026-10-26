# workflowhub

WorkFlowHub — Django REST Framework and React application with Docker, GitHub Actions, and CircleCI.

# WorkFlowHub



A workflow management application for SOFT806 Assignment 1.



\## Technologies



\- Backend: Django REST Framework

\- Frontend: React with Vite

\- Package management: pip and npm

\- Planned containerisation: Docker

\- Planned CI pipelines: GitHub Actions and CircleCI



\## Current progress



Backend and frontend starter projects are configured.

Authentication, workflow features, Docker, and CI pipelines are planned in GitHub issues.



\## Prerequisites



\- Python 3.12

\- Node.js 24 LTS and npm

\- Git



\## Backend setup on Windows



Run these commands from the repository root:



```bat

python -m venv .venv

.venv\\Scripts\\activate

python -m pip install -r backend\\requirements.txt

python backend\\manage.py migrate

python backend\\manage.py runserver

```



Open http://127.0.0.1:8000.



\## Frontend setup on Windows



Open a separate terminal at the repository root:



```bat

cd frontend

npm ci

npm run dev

```



Open the Local URL shown in the terminal.



\## Checks



From the repository root with the Python environment activated:



```bat

python backend\\manage.py check

```



From the frontend folder:



```bat

npm run build

```



\## Development workflow



1\. Select a GitHub issue and move it to In Progress.

2\. Create a feature branch from the updated main branch.

3\. Make changes and commit in meaningful steps.

4\. Open a pull request linking the issue.

5\. Move the issue to In Review.

6\. Review changes and record feedback before merging.

7\. Once CI pipelines exist, check that they pass before merging.

8\. Move completed issues to Done after merging.



\## Project structure



\- backend/: Django project and requirements.txt

\- frontend/: React application, package.json, and package-lock.json

## Environment configuration



Before starting the backend, copy the example file:



```bat

copy backend\\.env.example backend\\.env

```



In backend/.env, replace DJANGO\_SECRET\_KEY with a locally generated random key.

Configure DJANGO\_DEBUG and DJANGO\_ALLOWED\_HOSTS for your environment.

Django loads this file using python-dotenv.



Before starting the frontend:



```bat

copy frontend\\.env.example frontend\\.env

```



VITE\_API\_URL sets the backend API base URL.

Restart the frontend development server after changing this value.

Frontend environment variables are public; never put secrets in them.



Local .env files are ignored by Git.

Commit only .env.example files containing placeholders.

## Run with Docker locally



Start Docker Desktop. Stop local Django and Vite servers to free ports 8000 and 5173.

Configure backend/.env as described above.



Build both images from the repository root:



```bat

docker build -t workflowhub-backend:local ./backend

docker build -t workflowhub-frontend:local ./frontend

```



Create and start the containers:



```bat

docker run -d --name workflowhub-backend --env-file backend/.env -p 127.0.0.1:8000:8000 workflowhub-backend:local sh -c "python manage.py migrate \&\& python manage.py runserver 0.0.0.0:8000"

docker run -d --name workflowhub-frontend -p 127.0.0.1:5173:80 workflowhub-frontend:local

```



Open http://localhost:5173 and register a test account.



Check containers and backend logs:



```bat

docker ps

docker logs workflowhub-backend

```



Stop existing containers:



```bat

docker stop workflowhub-frontend workflowhub-backend

```



Start those same containers again:



```bat

docker start workflowhub-backend workflowhub-frontend

```



The SQLite database is stored inside the backend container.

Stopping and restarting that container preserves it.

Removing the container deletes its database because no persistent volume is configured.



The frontend API URL is set at image build time using VITE\_API\_URL.

The backend receives its environment variables at container runtime.

The Django development server is used for this local assignment demonstration.

