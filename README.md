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

