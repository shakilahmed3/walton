# Walton Job Task API Documentation

This documentation provides an overview of  Express.js API with 
-  NodeJS
-   MongoDB
-   Typescript
-   ExpressJS
-   REST
-   Redis
-   Git (for version control and code sharing)
-   README.md file for basic deployment documentation and instructions on deploying it to Render.com.

# Walton API

This repository contains an Express.js API for managing categories. It includes features such as creating, retrieving, updating, and deactivating categories. This README provides an overview of the API and instructions for deployment on Render.com.

## Table of Contents

- [API Overview](#api-overview)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Deployment on Render.com](#deployment-on-rendercom)

## API Overview

The API provides endpoints to manage categories. It includes the following functionalities:

- Get all categories
- Create a new category
- Retrieve a category by ID
- Update a category by ID
- Deactivate a category by ID
- Search for a category by name

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/shakil1206/walton
2.  Install the required dependencies:
        
    `cd walton npm install` 
    
3.  Configure environment variables as needed. You may need to set up environment variables for your database connection, Redis, and other settings.
    
4.  Start the Express.js server:
    
    `npm run dev` 
    
    If you want to build typescript project simply run:
    `npm run build`
    
    If you run production or staging server then run:
    `npm run staging` or `npm run production`
    
    ***Note: Make sure before run `npm run build`
    
    The API will be available at localhost: `http://localhost:4000` and the production: 	`https://walton-job.onrender.com`
    
## Usage

Here's how to use the API:

-   Use the provided API endpoints to manage categories.
-   Refer to the Swagger documentation for detailed information on available endpoints. You can access the Swagger documentation at `http://localhost:4000/api/docs` and production: `https://walton-job.onrender.com` when the server is running locally or production.

## API Endpoints

The API endpoints are documented using Swagger. For a detailed list of available endpoints and their descriptions, please refer to the [Swagger Documentation](https://chat.openai.com/c/4361c7a4-a970-4521-b7f0-b1bb994064ea#).

## Deployment on Render.com

To deploy this Express.js API on Render.com, follow these steps:

1.  Sign up for an account on [Render](https://render.com/) if you don't have one.
    
2.  Create a new web service on Render:
    
    -   Connect your GitHub repository to Render.
    -   Configure the build settings. You may need to specify a build command and a start command based on your project's configuration.
    -   Set up environment variables if necessary.
3.  Deploy your application.
    
4.  Once the deployment is successful, Render will provide you with a live URL where your API is hosted.
   
## Md Shakil Ahmed
