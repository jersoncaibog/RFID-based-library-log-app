import { prisma } from '@/lib/prisma'
import { Status } from '@prisma/client'
import { NextResponse } from 'next/server'

// GET /api/students - List all students with search and filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const grade = searchParams.get('grade')
    const section = searchParams.get('section')
    const status = searchParams.get('status')
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
        { grade_level: grade || undefined },
        { section: section || undefined },
        { status: status ? (status as Status) : undefined }
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
    const student = await prisma.student.create({
      data: {
        rfid_number: body.rfid_number,
        first_name: body.first_name,
        last_name: body.last_name,
        grade_level: body.grade_level,
        section: body.section,
        status: body.status || 'active'
      }
    })
    return NextResponse.json(student)
  } catch (error) {
    console.error('Failed to create student:', error)
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    )
  }
} 