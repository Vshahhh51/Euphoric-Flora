# Euphoric Flora

An online flower shop where customers can browse flowers for any occasion, create an account, and place orders.

**Live demo:** https://euphoric-flora.onrender.com

Built by Group #9 as a team final project.

## Features

- Product listings and a shopping cart (React, component-based UI)
- Account sign-up and login with bcrypt-hashed passwords
- Order placement and order history per user, stored in SQLite
- Social sign-in support through Firebase
- Admin page for viewing registered users
- REST API built with Express

## Tech stack

React 18 · Node.js · Express · SQLite · bcrypt · Firebase Auth · Render (deployment)

## API

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/signup` | Create an account |
| POST | `/api/auth/login` | Log in |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders/:userId` | Get a user's orders |
| POST / GET | `/api/users` | Create / list users |

## Run locally

```bash
npm install
npm start
```

Then open http://localhost:5000. The SQLite database (`database.sqlite`) is created automatically on first run.

## Screenshots

![Home page](pics/WhatsApp%20Image%202025-12-02%20at%2017.30.25.jpeg)
![Shop](pics/WhatsApp%20Image%202025-12-02%20at%2017.30.25%20(1).jpeg)
