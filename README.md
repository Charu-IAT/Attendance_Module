# Attendance_Module
Attendance Module System
Document Name - Business Requirement Document
Project Name - Attendance Service Management System
Version - 1.1.0
Prepared For - Attendance Service Project 
Document Type - BRD
1. Introduction 
1.1 Purpose 
The purpose of this document is to define the business requirements for the Attendance 
Service Management System. 
This system is developed to automate attendance tracking, student performance 
management, and placement-related activities within an educational institution or 
training organization. 
The document explains: 
• Business objectives  
• Project scope  
• Functional requirements  
• Non-functional requirements  
• User roles  
• Technology stack  
• Database requirements 
1.2 Project Overview 
The Attendance Service Management System is a web-based application developed using: 
• Frontend: React + Vite  
• Backend: Spring Boot + Java  
• Database: MySQL  
The system allows: 
• Admin to manage trainers and students  
• Trainers to manage attendance and marks  
• Students to view marks, and job opportunities  
The backend APIs are documented using Swagger OpenAPI. 
2. Business Objectives 
The objectives of the project are: 
• Automate attendance management  
• Reduce manual attendance errors  
• Track student performance  
• Maintain task and assessment records  
• Provide placement-related job links  
• Improve transparency between trainers and students  
• Generate centralized academic records  
3. Scope of the Project 
3.1 In Scope 
The system includes: 
• User authentication  
• Role-based access  
• Trainer management  
• Student management  
• Daily attendance marking  
• Attendance percentage calculation  
• Task marks management  
• Assessment marks management  
• Job links management  
• Swagger API documentation  
4. Stakeholders 
Stakeholder 
   Admin 
   Trainer
Responsibility 
   Manages trainers and students 
   Marks attendance and updates marks 
5. User Roles and Responsibilities 
5.1 Admin 
The Admin has full access to the system. 
Responsibilities 
• Login to the application  
• Add trainers  
• Add students  
• Update trainer details  
• Update student details  
• Delete trainers  
• Delete students  
• Monitor attendance reports  
• Monitor student performance  
• Add job opportunity links  
5.2 Trainer 
Trainer manages attendance and academic records. 
Responsibilities 
• Login to the system  
• Mark daily attendance  
• Update attendance   
6. System Architecture 
Frontend Layer 
• React + Vite  
• Axios API integration  
• React Router navigation  
Backend Layer 
• Spring Boot REST APIs  
• Service Layer  
• Repository Layer  
• Hibernate ORM  
Database Layer 
• MySQL Database  
7. Assumptions 
• Admin creates trainer and student accounts  
• Trainers maintain attendance and marks   
• Internet connectivity is available  
• Database server is active  
8. Constraints 
• System depends on API availability  
• Attendance calculation depends on accurate records  
• Users must provide valid credentials  
Technology Stack:
Components Version
1. Java v17
2. SpringBoot v4.0.3
3. SpringBoot Data JPA v4.0.3
4. MySQL v8.x
5. Maven v3.9.x
6. Hibernate v6.x
7. Swagger(Springdoc OpenAPI) v2.5.0
8. React(Frontend) v18.2.x
9. React DOM v18.2.x
10. Vite v5.x npm v11.10.1
11. Bootstrap v5.3x
Frontend : React + Vite Database : MySQL Backend: Springboot + Java
Backend Project Creation Method: The project is created by using Spring Boot Initializer
Spring Boot Initializer Configuration:
Setting Value
Project: Maven
Language: Java
Name: attendance_module
Packaging: Jar
Java Version: 17

Frontend Project Creation Method: This project is created by using vite with React template

Frontend Configuration:
Setting Value
Framework: React
Build Tool: Vite
Language: JavaScript Package Manager: npm
Node Version: 22.20.0(LTS)
npm Version: 11.10.1x

Dependencies for Backend:
Parent Config (Version control) parent: groupId:org.springframework.boot artifactId:spring-boot-starter-parent version:3.2.5 properties: java.version: 17

Core Dependencies: Spring web (Rest APIs): groupId: org.springframework.boot artifactId: spring-boot-starter-web (@RestController, @RequestMapping, Embedded Tomcat)

Spring Data JPA (Database ORM) groupId: org.springframework.boot artifactId: spring-boot-starter-data-jpa (Repository Layer, CRUD operation, Hibernate Integration)

MySQL Driver: groupId: com.mysql artifactId: mysql-connector-j (Used to connect MySQL 8.x database)

Swagger(OpenAPI Documentation) groupId: org.springdoc artifactId: springdoc-openapi-starter-webmvc-ui version: 2.5.0

Validation: groupId: org.springframework.boot artifactId: spring-boot-starter-validation (@NotNull, @Size, @Email, DTO validation)

Lombok: groupId: org.projectlombok artifactId: lombok optional: true (@Getter, @Setter, @Builder, @NoArgsConstructor)

DevTools (Development Only) groupId: org.springframework.boot artifactId: spring-boot-devtools scope: runtime optional: true (Auto restart, Faster development)

Frontend Dependencies:
"name": "cms-frontend", "version": "1.0.0", "private": true, "type": "module", "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" }

"dependencies": { "react": "^18.2.0", "react-dom": "^18.2.0", "axios": "^1.6.0", "react-router-dom": "^6.22.0" }

"devDependencies": { "vite": "^5.2.0", "@vitejs/plugin-react": "^4.2.0", "eslint": "^8.57.0" } Version Alignment: Frontend Version → 1.0.0 Backend Version → 1.0.0 Microservice Version → 1.0.0

API Documentation
The backend APIs are documented using Swagger (OpenAPI). Developers can access interactive API documentation at:

http://localhost:8080/swagger-ui/

Release Notes v1.0.0 (Initial Release)

=> Attendance marking API => Attendance percentage calculation => Batch-wise attendance retrieval => Swagger documentation
