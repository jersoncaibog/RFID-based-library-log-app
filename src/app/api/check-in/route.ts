import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// POST /api/check-in - Record a student check-in
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { rfid_number } = body

    // Find the student by RFID
    const student = await prisma.student.findUnique({
      where: { rfid_number }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Check if student is inactive
    if (student.status === 'inactive') {
      return NextResponse.json(
        { error: 'Student is inactive' },
        { status: 400 }
      )
    }

    // Create the check-in record
    const checkIn = await prisma.checkIn.create({
      data: {
        student_id: student.student_id,
        check_in_time: new Date(),
        check_in_date: new Date()
      },
      include: {
        student: true
      }
    })

    return NextResponse.json({
      message: 'Check-in recorded successfully',
      checkIn
    })
  } catch (error) {
    console.error('Failed to record check-in:', error)
    return NextResponse.json(
      { error: 'Failed to record check-in' },
      { status: 500 }
    )
  }
} 