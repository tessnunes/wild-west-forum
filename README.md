# wild-west-forum

Tess Nunes
University of Maine
COS 498- Server Side-Web-Development
November 7, 2025

Overview
Wild West Forum is a full-stack web application that allows users to register, log in, and post comments
in a classic discussion forum format. Built with Node.js, Express, Handlebars, and Nginx, the app is
fully containerized using Docker and Docker Compose for easy deployment. It serves as part of an
educational software engineering project.

Features
• User registration and login system
• Create and view comments
• Dynamic server-side rendering with Handlebars
• Reverse proxy and routing with Nginx
• Fully containerized setup using Docker

Technology Stack
• Frontend Rendering: Handlebars (.hbs templates)
• Backend Framework: Express.js (Node.js)
• Web Server / Proxy: Nginx
• Containerization: Docker & Docker Compose
• Language: JavaScript (Node.js 18-alpine)

Running Locally
1. Clone the repository:
git clone <your-repo-url>
2. Build and run containers:
sudo docker compose up --build
3. Access the app at: http://localhost:8181
4. Stop the containers with:
sudo docker compose down
Deploying on a Remote Server (DigitalOcean)
1 SSH into the droplet: ssh tessnunes@
2 Navigate to the project folder: cd ~/midterm/wild-west-forum
3 Start the app: sudo docker compose up -d
4 Access via browser: http://:8181


