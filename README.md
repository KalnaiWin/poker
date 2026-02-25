# 🂡 Poker Game (MERN Stack + Socket.io)

A real-time multiplayer poker game built with the MERN stack.  
Players can create public or private rooms, join matches, play poker in real-time using WebSockets, and track match history.

<img width="3840" height="1946" alt="image" src="https://github.com/user-attachments/assets/804b362a-f765-4858-b6c6-324786221295" />


## 🌍 Live Demo
Frontend: https://poker-frontend-znxb.onrender.com  
Video Demo: https://www.facebook.com/reel/889751763401124

## 🧠 Challenges & What I Learned

- Handling real-time synchronization between multiple players
- Preventing invalid game actions from the client
- Managing game state securely on the server
- Optimizing Socket.io event handling

## 🚀 Features

- 🔐 JWT Authentication (Register / Login)
- 🏠 Create public or private game rooms
- 👥 Join and manage poker rooms
- ♠️ Real-time multiplayer gameplay using Socket.io
- 🧠 Server-side poker logic validation
- 📜 Match history tracking (stored in MongoDB)
- 💬 In-room comments / chat


## 🛠 Tech Stack

### Frontend
- React
- Zustand
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose

### Other
- JWT (authentication)
- Socket.io ( Real-time )
- Arcjet (Rate limiting & bot protection)

### Test
- Postman

## 🏗 Architecture
- REST API handles authentication and room management
- Socket.io handles real-time gameplay communication
- MongoDB stores users, rooms, and match history
- Frontend state managed with Zustand

## 📦 Installation

### 1. Clone the repository

git clone https://github.com/KalnaiWin/poker.git

### 2. Install dependencies

Backend:
cd backend
npm install

Frontend:
cd frontend
npm install

## 🔑 Environment Variables

Create a `.env` file in `/backend`:

PORT=3000  
MONGO_URI=your_mongodb_url  
JWT_SECRET=your_secret 
ARCJECT_SECRET=...


### 4. Run the project

Backend + Frontend:
npm run dev

📸 Screenshots

### 🔐 Login & Register Page

<img width="1922" height="3030" alt="Group 2 (1)" src="https://github.com/user-attachments/assets/5dfc3846-0e4c-4c41-8d74-9771d8dc7f7f" />


### 📊 Dashboard → Displays Match History

<img width="3840" height="1940" alt="image" src="https://github.com/user-attachments/assets/cefddb5b-5604-434b-a31e-823b5580d1e7" />


### 🏠 Create Room → Room Management

<img width="3840" height="1924" alt="image" src="https://github.com/user-attachments/assets/2dd59ce7-5312-4a8f-b866-1b2bdea39128" />


### 🎮 Join Room → Play with Other Players

<img width="3840" height="1939" alt="image" src="https://github.com/user-attachments/assets/8de92355-3384-4949-984d-804ef89ce2fa" />


### 💬 In-Room Chat System

<img width="3840" height="1934" alt="image" src="https://github.com/user-attachments/assets/708a70b6-70ee-4bbf-b2bc-e735dac5c7b3" />


### ♠️ Gameplay

<img width="3832" height="1915" alt="image" src="https://github.com/user-attachments/assets/af0efb6e-6c63-4d2f-989c-534fa114ed2c" />
<img width="3840" height="1940" alt="image" src="https://github.com/user-attachments/assets/52ee7612-1838-485a-90ba-fc1759f6a3a7" />


## 👨‍💻 Author

NHBP GitHub: https://github.com/KalnaiWin
