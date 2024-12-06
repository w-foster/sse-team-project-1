
# RuneScape Real-Time Price Tracker

This project is a web application that provides real-time RuneScape item prices by utilizing data from the RuneScape Wiki's Real-Time Prices API. The app consists of a Flask backend for data retrieval and a React frontend to display the prices.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup (Flask)](#backend-setup-flask)
3. [Frontend Setup (React)](#frontend-setup-react)
4. [Running the Application](#running-the-application)
5. [API Endpoints](#api-endpoints)
6. [Contributing](#contributing)
7. [License](#license)

---

## Prerequisites

Before setting up the project, ensure that you have the following installed on your machine:

- **Python 3.8+**
- **Node.js 16+** (which includes npm)
- **pip** (Python package manager)
- **virtualenv** (optional, for creating a virtual environment)

---

## Backend Setup (Flask)

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone git@github.com:w-foster/sse-team-project-1.git
cd sse-team-project-1
```

### 2. Set up a Virtual Environment

It is recommended to use a virtual environment to isolate your project dependencies:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

Next, install the required Python packages:

```bash
pip install -r requirements.txt
```

### 4. Running the Flask Backend

Run the Flask development server to start the backend:

```bash
python src/app.py
```

This will start the backend server on `http://localhost:5000`.

### 5. Backend API

The backend fetches real-time prices from the RuneScape Wiki API and exposes the data through the following endpoint:

#### `GET /api/prices`

- **Description**: Fetches the current prices of RuneScape items in JSON format.
- **Example Request**:

```bash
curl http://localhost:5000/api/prices
```

---

## Frontend Setup (React)

### 1. Install Frontend Dependencies

Navigate to the `frontend` directory and install the required JavaScript dependencies:

```bash
cd frontend
npm install
```

### 2. Running the React App

Start the React development server:

```bash
npm start
```

This will run the frontend on `http://localhost:3000`.

### 3. Frontend Features

The frontend provides the following features:

- A list of RuneScape items and their current prices.
- A search function to look up individual items.
- Real-time updates using API calls to the Flask backend.
- Graphs showing price changes in 5m, 1h and 24h intervals.
- Favourites tab that is specific to your login information.
- Data analysis on the number of most viewed and favourited items by all users.

---

## Running the Application

Once both the backend and frontend are running, you should be able to visit the app at the following URLs:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://localhost:5000](http://localhost:5000)

The React frontend will make API requests to the Flask backend to display real-time item prices.

---

## API Endpoints

The backend provides the following API endpoint:

### `GET /api/prices`

- **Method**: GET
- **Description**: Fetches the real-time prices for RuneScape items.
- **Response**: A JSON array containing item names and their corresponding prices.

#### Example Response:

```json
[
  {
    "name": "Dragon Scimitar",
    "price": 1000000
  },
  {
    "name": "Saradomin Brew",
    "price": 20000
  }
]
```

---

## Contributing

Contributions are welcome! To contribute to this project:

1. **Fork the repository.**
2. **Create a new branch**: `git checkout -b feature-name`.
3. **Commit your changes**: `git commit -am 'Add new feature'`.
4. **Push to your branch**: `git push origin feature-name`.
5. **Create a new Pull Request.**

---

## License

This project is licensed under ANDY. See the LICENSE file for more details.