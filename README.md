# walton

# Category Management REST API

This is a REST API for managing categories with nested levels, built using Node.js, TypeScript, Express.js, and MongoDB. It allows you to create, retrieve, update, and delete categories while automatically deactivating child categories when their parent is deactivated.

## Table of Contents

- [Getting Started](#getting-started)
- [Endpoints](#endpoints)
  - [Create a Category](#create-a-category)
  - [Get a Category by ID](#get-a-category-by-id)
  - [Update a Category by ID](#update-a-category-by-id)
  - [Delete a Category by ID](#delete-a-category-by-id)
- [Payload Examples](#payload-examples)
- [Setting Up](#setting-up)
- [Running the Application](#running-the-application)

## Getting Started

To get started with this REST API, you'll need Node.js, TypeScript, MongoDB, and npm (Node Package Manager) installed on your system.

## Endpoints

### Create a Category

- **HTTP Method**: POST
- **Endpoint**: \`/api/categories\`
- **Request Payload**:

\`\`\`json
{
  "name": "Electronics",
  "parentId": null
}
\`\`\`

- **Response Payload (Success)**:

\`\`\`json
{
  "_id": "category_id",
  "name": "Electronics",
  "parent": null,
  "isActive": true
}
\`\`\`

### Get a Category by ID

- **HTTP Method**: GET
- **Endpoint**: \`/api/categories/:id\`
- **Response Payload (Success)**:

\`\`\`json
{
  "_id": "category_id",
  "name": "Electronics",
  "parent": null,
  "isActive": true
}
\`\`\`

### Update a Category by ID

- **HTTP Method**: PUT
- **Endpoint**: \`/api/categories/:id\`
- **Request Payload**:

\`\`\`json
{
  "name": "New Electronics Name",
  "isActive": false
}
\`\`\`

- **Response Payload (Success)**:

\`\`\`json
{
  "_id": "category_id",
  "name": "New Electronics Name",
  "parent": null,
  "isActive": false
}
\`\`\`

### Delete a Category by ID

- **HTTP Method**: DELETE
- **Endpoint**: \`/api/categories/:id\`
- **Response Payload (Success)**:

No content (HTTP Status Code: 204)

## Payload Examples

These are examples of the data that you would send in requests and receive in responses when using the API.

## Setting Up

1. Clone this repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Install dependencies by running \`npm install\`.
4. Set up your MongoDB connection by replacing the connection URL in \`app.ts\`:

\`\`\`javascript
mongoose
  .connect('mongodb://localhost:27017/your_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
\`\`\`

Replace \`'mongodb://localhost:27017/your_database'\` with your actual MongoDB connection URL.

## Running the Application

1. Start the application by running \`npm run dev\` in your terminal.
2. The server will be running on \`http://localhost:4000\` by default.

That's it! You can now use the provided endpoints to manage your categories with nested levels using this REST API.


