import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/students/[id] - Get a single student
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const student = await prisma.student.findUnique({
      where: { student_id: parseInt(params.id) },
      include: {
        check_ins: {
          orderBy: { check_in_time: 'desc' },
          take: 5
        },
        _count: {
          select: { check_ins: true }
        }
      }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('Failed to fetch student:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student' },
      { status: 500 }
    )
  }
}

// PUT /api/students/[id] - Update a student
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const student = await prisma.student.update({
      where: { student_id: parseInt(params.id) },
      data: {
        rfid_number: body.rfid_number,
        first_name: body.first_name,
        last_name: body.last_name,
        course: body.course,
        year_level: body.year_level,
        section: body.section
      }
    })
    return NextResponse.json(student)
  } catch (error) {
    console.error('Failed to update student:', error)
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    )
  }
}

// DELETE /api/students/[id] - Delete a student
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.student.delete({
      where: { student_id: parseInt(params.id) }
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete student:', error)
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    )
  }
} 