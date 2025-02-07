# Library RFID Logbook System

A modern web application for managing library visits using RFID technology. Built with Next.js, TypeScript, and Prisma.

## Features

- 📱 Responsive dashboard interface
- 🔄 Real-time RFID check-in system
- 📊 Visit log with filtering and pagination
- 📥 Export visit data to CSV
- 👥 Student management system
- 🎨 Modern UI with Tailwind CSS and Shadcn UI

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MySQL/MariaDB with Prisma ORM
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/library-rfid-system.git
   cd library-rfid-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```

4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following variables:

```
DATABASE_URL="mysql://user:password@localhost:3306/library_db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Database Schema

### Create Tables

```sql
-- Create Students table
CREATE TABLE `students` (
    `student_id` INT AUTO_INCREMENT PRIMARY KEY,
    `rfid_number` VARCHAR(255) UNIQUE NOT NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `course` VARCHAR(50),
    `year_level` VARCHAR(50),
    `section` VARCHAR(50),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Check-ins table
CREATE TABLE `check_ins` (
    `check_in_id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `check_in_time` TIME NOT NULL,
    `check_in_date` DATE NOT NULL,
    `device_id` VARCHAR(255),
    FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`)
);

-- Create Leaderboard view
CREATE VIEW `leaderboard` AS
SELECT 
    s.student_id,
    CONCAT(s.first_name, ' ', s.last_name) as full_name,
    COUNT(c.check_in_id) as visit_count
FROM students s
LEFT JOIN check_ins c ON s.student_id = c.student_id
GROUP BY s.student_id, full_name;
```

### Indexes for Better Performance

```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_students_rfid ON students(rfid_number);
CREATE INDEX idx_checkins_date ON check_ins(check_in_date);
CREATE INDEX idx_checkins_student ON check_ins(student_id);
```

### Initial Setup

```sql
-- Insert default admin user
INSERT INTO "Users" (email, password, name, role)
VALUES ('admin@library.com', 'hashed_password', 'Admin User', 'ADMIN');

-- Create necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

## Features in Detail

### Visit Log

- Real-time check-in system using RFID
- Filter by student name, RFID, course, and date
- Export filtered data to CSV
- View daily check-in records

### Student Management

- Add/Edit student information
- RFID card assignment
- Course, year level, and section management

### Reports

- Leaderboard of top visitors
- Daily check-in statistics
- Student visit history

## API Routes

- `GET /api/students` - List all students
- `POST /api/students` - Create new student
- `GET /api/check-ins` - Get check-in logs
- `POST /api/check-ins` - Record new check-in
- `GET /api/leaderboard` - Get top visitors

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a new Pull Request

## Troubleshooting

If you encounter any issues:

1. Ensure MySQL/MariaDB is running
2. Check if all environment variables are set correctly
3. Try clearing the database and running migrations again:
   ```bash
   npx prisma migrate reset
   npx prisma generate
   npx prisma db push
   ```

## License

This project is licensed under the MIT License.
