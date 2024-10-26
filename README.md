
# MERN Stack Coding Challenge

## Project Overview

This project is a MERN stack application designed to manage and visualize product transactions using data fetched from a third-party API. It consists of a backend service that interacts with a MongoDB database and a frontend application built with React that displays transaction data in a user-friendly interface, including tables and charts.

## Table of Contents

- [Installation](#installation)
- [Backend API](#backend-api)
  - [Data Source](#data-source)
  - [API Endpoints](#api-endpoints)
- [Frontend Features](#frontend-features)
- [Usage](#usage)
- [Technologies Used](#technologies-used)

## Installation

To get started with the project, clone the repository and install the required dependencies for both the backend and frontend.

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install the necessary packages:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the necessary packages:
   ```bash
   npm install
   ```

3. Start the frontend application:
   ```bash
   npm start
   ```

## Backend API

### Data Source

- **Third Party API URL**: [Product Transaction JSON](https://s3.amazonaws.com/roxiler.com/product_transaction.json)
- **Request Method**: GET
- **Response Format**: JSON

### API Endpoints

1. **Initialize Database**
   - **Method**: `GET`
   - **Endpoint**: `/api/v1/product/seed_data/`
   - **Description**: Fetches data from the third-party API and initializes the database with seed data.

2. **List Transactions**
   - **Method**: `GET`
   - **Endpoint**: `/api/v1/product/all_transactions/:month?q=`
   - **Query Parameters**: 
     - `month`: Expected values are any month between January to December.
     -  `q`: (optional) for filtering transactions by product name.
     - `page`: (optional) The page number for pagination (default: 1).
     - `limit`: (optional) Number of items per page (default: 10).
   - **Description**: Returns a list of transactions filtered by the selected month, with support for search and pagination.

3. **Statistics**
   - **Method**: `GET`
   - **Endpoint**: `/api/v1/product/statistics/:month`
   - **Query Parameters**: 
     - `month`: Expected values are any month between January to December.
   - **Description**: Returns total sales amount, total sold items, and total not sold items for the selected month.

4. **Bar Chart Data**
   - **Method**: `GET`
   - **Endpoint**: `/api/v1/product/priceRange/:month`
   - **Query Parameters**: 
     - `month`: Expected values are any month between January to December.
   - **Description**: Returns data for a bar chart showing price ranges and the number of items sold in each range for the selected month.

5. **Pie Chart Data**
   - **Method**: `GET`
   - **Endpoint**: `/api/v1/product/uniqueCategories/:month`
   - **Query Parameters**: 
     - `month`: Expected values are any month between January to December.
   - **Description**: Returns unique categories and the number of items sold from each category for the selected month.

6. **Combined Data**
   - **Method**: `GET`
   - **Endpoint**: `/api/v1/product/combinedResponse/:month`
   - **Query Parameters**: 
     - `month`: Expected values are any month between January to December.
   - **Description**: Combines responses from the statistics, priceRange, and uniqueCategores APIs.

## Frontend Features

- **Transactions Table**: Displays a list of transactions for a selected month, with search and pagination functionalities.
- **Transactions Statistics**: Shows total sales amount, total sold items, and total not sold items for the selected month.
- **Transactions Bar Chart**: Visualizes the price range and the number of items in that range for the selected month.
- **Transactions Pie Chart**: Displays unique categories and the number of items sold in each category for the selected month.

## Usage

1. Select a month from the dropdown menu to view transactions for that month.
2. Use the search box to filter transactions by title, description, or price.
3. Navigate through the transaction list using the "Next" and "Previous" buttons.
4. View statistics, bar charts, and pie charts based on the selected month.

## Technologies Used

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React, Axios, Chart.js (or any charting library)
- **Other**: Mongoose, dotenv
