# Collaborative Whiteboard Webapp

A real-time collaborative whiteboard application built with React, Node.js, and PostgreSQL. This webapp allows users to create, share, and collaborate on digital whiteboards with drawing tools, real-time synchronization, and user management.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login/signup with JWT tokens and bcrypt password hashing
- **Whiteboard Creation**: Create and manage multiple whiteboards
- **Drawing Tools**: Pen, line, square, circle, and eraser tools
- **Real-time Collaboration**: Multiple users can draw simultaneously on the same board
- **History Management**: Undo/redo functionality with canvas state history
- **Board Management**: Create, view, update, and delete whiteboards
- **Responsive Design**: Works on desktop and mobile devices

### Drawing Features
- **Multiple Drawing Tools**: Pen, line, square, circle, and eraser
- **Touch Support**: Full touch support for mobile devices
- **High DPI Support**: Optimized for high-resolution displays
- **Canvas Operations**: Clear canvas, undo/redo, real-time preview
- **Event Tracking**: All drawing events are tracked and stored for collaboration

## 🏗️ System Architecture

### Frontend (React + Vite)
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Canvas.jsx       # Main drawing canvas component
│   │   ├── ActionBar.jsx    # Tool selection and actions
│   │   ├── BoardCard.jsx    # Individual board display
│   │   ├── Header.jsx       # Navigation header
│   │   └── ...
│   ├── pages/               # Route components
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── Board.jsx        # Whiteboard interface
│   │   ├── Login.jsx        # Authentication page
│   │   └── Hero.jsx         # Landing page
│   ├── context/             # React context for state management
│   │   └── UserContext.jsx  # User authentication context
│   └── helper.js            # API configuration
```

### Backend (Node.js + Express)
```
server/
├── controllers/             # Business logic controllers
│   ├── userController.js    # User authentication logic
│   └── boardController.js   # Board management logic
├── middlewares/             # Custom middleware
│   └── tokenVerify.js       # JWT authentication middleware
├── routes/                  # API route definitions
│   ├── userRoute.js         # User-related endpoints
│   └── boardRoute.js        # Board-related endpoints
├── prisma/                  # Database schema and migrations
│   └── schema.prisma        # Database schema definition
└── index.js                 # Main server file
```

## 🗄️ Database Design

### Schema Overview
The application uses PostgreSQL with Prisma ORM for database management.

#### User Model
```prisma
model User {
  id              Int      @id @default(autoincrement())
  email           String   @unique
  name            String?
  password_hash   String
  createdAt       DateTime @default(now())
  isAuthenticated Boolean  @default(false)
  boards          Board[]
  events          Event[]
}
```

#### Board Model
```prisma
model Board {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  events    Event[]
}
```

#### Event Model (for Real-time Collaboration)
```prisma
model Event {
  id          Int      @id @default(autoincrement())
  board_id    Int
  user_id     Int
  event_type  String
  event_data  Json
  createdAt   DateTime @default(now())
  board       Board    @relation(fields: [board_id], references: [id])
  user        User     @relation(fields: [user_id], references: [id])
}
```

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - UI library
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Toastify** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time communication (configured but not fully implemented)
- **CORS** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WhiteBoard
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Database Setup**
   ```bash
   # Create a PostgreSQL database
   # Update the DATABASE_URL in server/.env
   
   # Run database migrations
   cd server
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Environment Variables**
   
   Create `server/.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/whiteboard_db"
   JWT_SECRET="your-jwt-secret-key"
   NODE_ENV="development"
   ```
   
   Create `client/.env` file:
   ```env
   VITE_BACKEND_URL="http://localhost:7000"
   ```

5. **Start the application**
   ```bash
   # Start the backend server
   cd server
   npm run dev
   
   # Start the frontend development server (in a new terminal)
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:7000

## 📱 Key Functionalities

### User Management
- **Registration**: Create new user accounts with email and password
- **Authentication**: Secure login with JWT token-based authentication
- **Session Management**: Persistent login sessions with HTTP-only cookies
- **User Profile**: View and manage user information

### Whiteboard Management
- **Create Boards**: Create new whiteboards with custom titles and descriptions
- **Board Dashboard**: View all user's whiteboards in an organized dashboard
- **Board Operations**: Edit, delete, and manage whiteboard properties
- **Board Access**: Navigate to individual whiteboards via unique URLs

### Drawing Features
- **Drawing Tools**:
  - **Pen**: Freehand drawing with customizable stroke
  - **Line**: Straight line drawing with preview
  - **Square**: Rectangle drawing with live preview
  - **Circle**: Circular shapes with radius preview
  - **Eraser**: Remove parts of the drawing
- **Canvas Operations**:
  - **Undo/Redo**: Step-by-step history navigation
  - **Clear Canvas**: Reset the entire whiteboard
  - **Real-time Preview**: Live preview for shape tools
- **Touch Support**: Full mobile and tablet support

### Real-time Collaboration (Architecture Ready)
- **Event System**: All drawing events are tracked and stored
- **Socket.io Integration**: Real-time communication infrastructure
- **Event Synchronization**: Drawing events are saved to database for persistence
- **Multi-user Support**: Multiple users can collaborate on the same board

## 🔧 API Endpoints

### Authentication Endpoints
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `GET /api/users/getuserdata` - Get user details

### Board Management Endpoints
- `GET /api/boards/getboards` - Get all user boards
- `GET /api/boards/:boardId` - Get specific board
- `POST /api/boards/create` - Create new board
- `PUT /api/boards/update/:boardId` - Update board
- `DELETE /api/boards/delete/:boardId` - Delete board

### Drawing Event Endpoints
- `POST /api/boards/:boardId/event` - Save drawing event
- `GET /api/boards/:boardId/events` - Get board events
- `DELETE /api/boards/:boardId/events` - Clear board events

## 🎨 UI/UX Features

### Design System
- **Dark Theme**: Modern dark interface with gradient backgrounds
- **Responsive Layout**: Mobile-first responsive design
- **Interactive Elements**: Hover effects and smooth transitions
- **Toast Notifications**: User feedback for all actions
- **Loading States**: Visual feedback during API calls

### User Experience
- **Intuitive Navigation**: Clear navigation between boards and dashboard
- **Tool Selection**: Easy-to-use drawing tool selection
- **Visual Feedback**: Real-time preview for drawing tools
- **Error Handling**: Comprehensive error messages and validation

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: Secure cookie storage for tokens
- **CORS Protection**: Configured cross-origin resource sharing
- **Input Validation**: Server-side validation for all inputs
- **Protected Routes**: Authentication middleware for secure endpoints

## 🚧 Future Enhancements

### Planned Features
- **Real-time Collaboration**: Complete Socket.io implementation for live collaboration
- **User Presence**: Show active users on boards
- **Board Sharing**: Share boards with specific users or make them public
- **Export Functionality**: Export boards as images or PDFs
- **Advanced Drawing Tools**: More drawing tools and customization options
- **Board Templates**: Pre-designed board templates
- **Comments and Annotations**: Add text comments to boards
- **Version History**: Track and restore previous versions of boards

### Technical Improvements
- **Performance Optimization**: Canvas rendering optimizations
- **Offline Support**: Progressive Web App features
- **Mobile App**: React Native mobile application
- **Advanced Caching**: Redis for improved performance
- **File Uploads**: Support for image and document uploads

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- React team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
- All contributors and users of this project

---

**Note**: This is currently a single-user whiteboard application. Real-time collaboration features are architecturally ready but not fully implemented. The foundation is solid for adding multi-user collaboration in future updates.