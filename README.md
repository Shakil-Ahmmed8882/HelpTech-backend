# HelpTech Backend
This is the backend for HelpTech, a dynamic full-stack web application designed to help tech enthusiasts navigate the ever-evolving world of technology. This backend API handles user authentication, post management, voting systems, premium content access, and more. The backend is powered by Node.js, Express.js, and MongoDB.






![ERdiagram](https://raw.githubusercontent.com/Shakil-Ahmmed8882/HelpTech-backend/refs/heads/main/assets/image/ERdiagram.png)


## Table of Contents

- [Project Features](#project-features)
- [Technologies Used](#technologies-used)
- [Setup & Installation](#setup--installation)
- [API Endpoints](#apiendpoints)
- [Database Collections](#database-collections)
- [ER Diagram](#ERiagram)
- [shots](#screenshots)


## **Project Features**
- **User Authentication**: JWT-based secure login and registration.
- **User Profiles**: Users can update their profiles, follow others, and view followers.
- **Post Creation & Sharing**: Users can create and share tech - 
- **tips with rich text** , categorize posts, and attach images.

- **Voting System**: Upvote or downvote posts and comments.

- **Premium Content**: Access to exclusive content via SSL
- **PDF Generation**: Convert tech guides into downloadable PDFs.

- **Admin Dashboard**: Admins can manage users, posts, and view payment history
## Technologies Used


### Backend:
- Node.js
- Express.js
- MongoDB (Mongoose ORM)
- JWT for authentication
- SSL

### Other:
- Bcrypt.js (for password hashing)
- Cloudinary (for image uploads)
- zod
- nodmailer




## Database Collections
![Collections](https://raw.githubusercontent.com/Shakil-Ahmmed8882/HelpTech-backend/refs/heads/main/assets/image/collections.png)








# **Endpoints**

## User Management
- POST/auth/login: login and get access & refresh token

- POST /auth/register  register and get access & refresh token

- POST /auth/forget-password: Hit with userId and get the reset ui link in the email

- PUT /auth/reset-password navigate to reset ui & change password



## Post Management
- `POST /post/create-post` : Create a new post for the user.
- `GET ``/post/`: Get all posts.
- GET` /``post/my-posts: get individual user all posts ` 
- GET` /``post/:id`  get a post by ID.
- PATCH` /``post/:id`Update a post of the current user.
- `DELETE /``post/:`Delete a post by the current user. (soft delete, only post publisher || admin can delete




## Comment Management
- `POST /users/:id/posts/:postId/comments` : Add a comment to a specific post.
-  `GET /users/:postId/comments` :  Get all comments on a specific post
-  `PUT /users/comments/:commentId` : Edit comment only who published it. ( user ID from token )
-  `DELETE /commments/:id/comments/:commentId` : Delete a comment made by the user.




## Upvote/Downvote Management
-  POST /votes/:id/upvotes: Retrieve upvotes by any user. ( up & down vote )
- GET /votes/:id/upvotes: Retrieve upvotes by any user.
-  DELETE /votes/:id Remove by any user. (remove vote)




## Category Management
- `POST /category` : Create a new category ( admin ).
- `GET ``/category/`: Get all categories (user, admin).
- GET` /`category`/id: get category by id` 
- PATCH` /`category`/:id`Update a category.
- DELETE` /`category`/:id`  Delete a category by id 




## Payments
- `POST /category` : Create a new payment( admin ).
- `GET ``/category/`: Get all payments 
- GET` /`category`/id: get category by id` 
- DELETE` /`category`/:id`  Delete a payment by ID if it failed






---





## Analytics 
-  `POST /category` : Create a new category ( admin ).
-  `GET ``/category/`: Get all categories (user, admin).
-  GET` /`category`/id: get category by id` 
-  PATCH` /`category`/:id`Update a category.






## Follows
-  `POST /category` : Create a new category ( admin ).
-  `GET ``/category/`: Get all categories (user, admin).
-  GET` /`category`/id: get category by id` 
-  PATCH` /`category`/:id`Update a category.
-  DELETE` /`category`/:id`  Delete a category by id 




## Setup & Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/tech-tips-tricks-hub.git
   cd tech-tips-tricks-hub```





1. Clone the repository:
   ```bash
   git install 

   ```


## Set up environment variables
```
NODE_ENV = development 
PORT = 5000
DATABASE_URL = ...
JWT_ACCESS_SECRET = ...

JWT_ACCESS_EXPIRES_IN = ...
JWT_REFRESH_SECRET = ...
JWT_REFRESH_EXPIRES_IN = ...
BCRYPT_SALT_ROUND = 12

reset_pass_ui_link= http://localhost:3000/reset-password
SERVER_URL = server url 
CLIENT_URL = client url


STORE_ID= .. 
STORE_PASSWD= ..
IS_LIVE= false


```

## Run the server:


```
npm start

```

## Contact

For inquiries or feedback, please reach out to us at [shakilahmmed8882@gmail.com](shakilahmmed8882@gmail.com).

---

## **Thanks**
Thanks for your time. See you.. 

