import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

// GET /api/students - List all students with search and filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const course = searchParams.get('course')
    const year = searchParams.get('year')
    const section = searchParams.get('section')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where = {
      AND: [
        {
          OR: search ? [
            { first_name: { contains: search } },
            { last_name: { contains: search } },
            { rfid_number: { contains: search } }
          ] : undefined
        },
        { course: course || undefined },
        { year_level: year || undefined },
        { section: section || undefined }
      ]
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: { check_ins: true }
          }
        },
        orderBy: { student_id: 'desc' }
      }),
      prisma.student.count({ where })
    ])

    return NextResponse.json({
      students,
      total,
      pages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Failed to fetch students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

// POST /api/students - Create a new student
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const studentData: Prisma.StudentCreateInput = {
      rfid_number: body.rfid_number,
      first_name: body.first_name,
      last_name: body.last_name,
      course: body.course || null,
      year_level: body.year_level || null,
      section: body.section || null
    }
    const student = await prisma.student.create({ data: studentData })
    return NextResponse.json(student)
  } catch (error) {
    console.error('Failed to create student:', error)
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    )
  }
} 