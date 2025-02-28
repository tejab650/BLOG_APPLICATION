# Inroduction
The Blog Application is a web-based platform that allows users to create, manage, and interact with blog posts. The application is built using **MERN** (MongoDB, Express.js, React, and Node.js) stack. It enables users to register, log in, and publish blog posts.
This application is designed to provide a seamless and interactive blogging experience with features such as user authentication, and responsive UI. It follows a RESTful API architecture for efficient data exchange.

# Backend Configuration

Before running the backend, ensure you create a .env file inside the backend folder. This file should contain essential configurations such as:

- **Database Connection**(e.g., MongoDB)

- **Cloudinary Configuration**(for uploading images to the cloud)

- **Other Environment Variables**(such as API keys, authentication secrets, etc.)

> Example .env file

# MongoDB Configuration
- MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database?retryWrites=true&w=majority

# Cloudinary Configuration
- CLOUDINARY_CLOUD_NAME=your_cloud_name

- CLOUDINARY_API_KEY=your_api_key

- CLOUDINARY_API_SECRET=your_api_secret

# Other Configuration
- SECRET_KEY=your_secret_key

- PORT=5000


# Running the Project

> Running the Backend:

- Navigate to the **backend** folder and install dependencies.

- **commands** : cd Backend , npm i

- **Start the backend server** : npm start

> Running the Frontend:

- Navigate to the **Frontend/blog** folder and install dependencies.

- **commands** : cd Frontend/blog , npm i

- **Start the frontend server** : npm start


