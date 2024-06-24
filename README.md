# Project Name

## Description
Application desgined to keep track of users and their connections.

## Technologies Used
- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend**: FastAPI, SQlite, sqlalchemy
- **Containerization**: Docker

## Setup Instructions
### Prerequisites
- Docker
- Docker Compose

### Running the Application
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/yourproject.git
    cd yourproject
    ```
2. Build and run the containers:
    ```bash
    docker-compose up --build
    ```

The frontend will be accessible at `http://localhost:3000` and the backend at `http://localhost:8001`.



## Running Tests

### Frontend Tests

To run tests in the frontend, navigate to the `frontend` directory and use the following command:

```bash
npm test
```

This will launch the test runner in the interactive watch mode. For more detailed information, refer to the [frontend README.md](frontend/README.md).

### Backend Tests

To run tests in the backend, ensure you have pytest installed. If not, you can install it using pip:

```bash
pip install pytest
```

Then, navigate to the `backend` directory and run the following command:

```bash
pytest
```

This will discover and run all the test cases in the `tests` directory. Make sure your working directory is the `backend` folder to avoid any import errors.

## TODO List

Things that due to the time constrain I was not able to achieve.

- [ ] Finish testing the backend.
- [ ] Add more unit tests to the frontend.
- [ ] Add E2E testing.
- [ ] Set up workflow to run backend test.
- [ ] Add pre-commit.
- [ ] Create a github action to run pre-commit and check the code on every PR
- [ ] Add a state manager in the frontend.
- [ ] Make the frontend responsive
