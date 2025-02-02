# Super Tutor AI - Development Documentation

This documentation covers the setup and architecture of the Super Tutor AI platform, which consists of a Node.js/Express backend and a frontend application for AI-powered educational tools.

## Project Structure

```
/
├── frontend/          # React frontend application
├── backend/          # Node.js/Express backend
├── docker-compose.yml
└── docs/            # This documentation
```

## Frontend

The frontend application provides an interface for educational tools including:

- YouTube content analysis
- Text-based question generation
- Worksheet creation
- Multiple choice question generation
- Text summarization and rewriting
- Proofreading assistance
- Lesson planning
- Report card generation
- Essay grading
- PowerPoint presentation generation

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
npm install
npm start
```

The development server will start on port 3000.

## Backend

The backend is built with Node.js and Express, structured for modularity and scalability:

- `/lib` - Core business logic and service libraries
- `/route` - Express route handlers and API endpoints
- `/utils` - Shared utility functions
- `index.js` - Server entry point

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
npm install
npm start
```

The API server will start on port 3000.

## Docker Setup

### Prerequisites

- Docker
- Docker Compose

### Docker Compose Configuration

```yaml
version: '3.8'

services:
  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - REACT_APP_API_URL=http://backend:3000
    volumes:
      - ./frontend:/usr/src/app
      - /usr/src/app/node_modules
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - ./backend:/usr/src/app
      - /usr/src/app/node_modules

networks:
  default:
    driver: bridge
```

### Running with Docker Compose

1. Build and start all services:
```bash
docker-compose up --build
```

2. Stop all services:
```bash
docker-compose down
```

## Development Workflow

1. Clone the repository:
```bash
git clone https://github.com/yourusername/super-tutor-ai.git
cd super-tutor-ai
```

2. Choose your development method:
   - Local development: Follow the frontend and backend setup instructions above
   - Docker development: Use the Docker Compose configuration

3. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Benefits

- **Time Efficiency**: Automated educational content generation and grading
- **Enhanced Learning**: AI-powered tools for personalized education
- **Improved Engagement**: Interactive learning materials and assessments
- **Streamlined Communication**: Automated report generation and proofreading

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Add your license information here]