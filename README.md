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
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI

## Getting Started

1. Clone the repository
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
DATABASE_URL="postgresql://user:password@localhost:5432/library_db"
```

## Features in Detail

### Visit Log

- Real-time check-in system
- Filter by student name, RFID, course, and date
- Export filtered data to CSV
- Pagination for better performance

### Student Management

- Add/Edit student information
- RFID card assignment
- Course and section management

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
