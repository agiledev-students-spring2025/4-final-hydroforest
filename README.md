# HydroForest

## Project Link 
[HydroForest](http://157.245.217.182)

## Project Overview

**HydroForest** is a full-stack web application that transforms hydration tracking into a fun and rewarding experience. Every time a user logs a bottle of water, a virtual tree grows in their digital forest. Over time, consistent hydration leads to a thriving virtual environment—gamifying the habit of staying hydrated.

## Product Vision

_HydroForest turns daily water intake into an engaging, habit-forming experience by letting users grow a customizable forest as they hydrate._

## Team Members

- [Jun Li](https://github.com/jljune9li)
- [Natalie Ovcarov](https://github.com/nataliovcharov)
- [Daniel Brito](https://github.com/danny031103)
- [Nabiha Siddique](https://github.com/ns5190)
- [Alvaro Martinez](https://github.com/AlvaroMartinezM)

## How It Works

From the user’s perspective, HydroForest provides the following features:

- Log daily water intake
- View progress through a growing visual forest
- Track hydration history over time
- Customize your forest with unlockable elements
- Receive hydration reminders and motivational notifications

## Project History

HydroForest began as part of our **Agile Software Development & DevOps** course, inspired by a shared challenge—drinking enough water. Our goal was to build a tool that makes hydration fun, motivating users with visual rewards and habit-forming gamification.

We followed an **Agile methodology**, continuously iterating through sprints to build and improve the app:

- **Sprint 0**  
  We built our app map and prototype to define the user flow and core features like hydration tracking, virtual forest growth, and progress history.

- **Sprint 1**  
  Focused on front-end development—designing the UI, hydration tracker, forest visualization, calendar view, social features, and navigation.

- **Sprint 2**  
  Back-end development with an Express.js server. We implemented dynamic API routes for:

  - User authentication
  - Hydration logging
  - Tree unlocking  
    Using mock JSON data, we connected front-end components to simulate full-stack functionality, including profile management and hydration history.

- **Sprint 3**
  - We integrated MongoDB Atlas to replace mock data. Using Mongoose, we defined schemas for users and trees, and established secure, JWT-protected API routes.
  - All incoming data is validated using express-validator before being stored, ensuring data integrity and security.

- **Sprint 4**
   - We deployed our web application -- HydroForest using digital ocean.
   - Extra Credits:
      - Completed: Deploying to a docker container
      - Completed: Implemented continuous integration.
      - Completed: Continuous Deployment.

Our end goal: deliver a polished, engaging app that helps users build better habits by the end of the semester.

## How to Contribute

Interested in contributing?  
Please read our [CONTRIBUTING.md](https://github.com/agiledev-students-spring2025/4-final-hydroforest/blob/master/CONTRIBUTING.md) for guidelines.

---

## Running the Project Locally

Follow the steps below to set up and run **HydroForest** on your local machine:

### 1. Fork and Clone the Repository

```bash
git clone https://github.com/agiledev-students-spring2025/4-final-hydroforest
```

### 2. Open the Project on Visual Studio Code

- Launch Visual Studio Code.
- Open the cloned repository folder (4-final-hydroforest)

### 3. Navigate to the Front-End Folder:

- Open the integrated terminal in VS Code.
- Change directory to the `front-end` folder:

```bash
cd front-end
```

### 4. Add Your Front-End Environment File

- Copy the front end .env file into the front-end folder.

- You can find the required .env file in our team Discord.

### 5. Install Dependencies of Front-End and Launch the Front-End:

- Install the necessary packages:

```bash
npm install
```

- Start the application:

```bash
npm start
```

### 6. Navigate to the Back-End Folder:

- in a different shell
- Change directory to the `back-end` folder:

```bash
cd back-end
```

### 7. Add Your Back-End Environment File

- Copy the back end .env file into the back-end folder.

- You can find the required .env file in our team Discord.

### 8. Install Dependencies of Back-end and Launch the Application:

- Install the necessary packages:

```bash
npm install
```

- Start the application:

```bash
npm start
```

### 9. Access the app

Once both the back-end and front-end are running, open your browser and go to

```bash
http://localhost:3000
```

### 10. For testing:

```bash
npm test
```
