import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

// GET /api/visits - Get visit logs with filters and pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const grade = searchParams.get('grade')
    const section = searchParams.get('section')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: Prisma.CheckInWhereInput = {}

    if (search || grade || section) {
      where.student = {
        AND: [
          search ? {
            OR: [
              { first_name: { contains: search } },
              { last_name: { contains: search } },
              { rfid_number: { contains: search } }
            ]
          } : {},
          grade ? { course: grade } : {},
          section ? { section: section } : {}
        ]
      }
    }

    if (startDate && endDate) {
      where.check_in_date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const [visits, total] = await Promise.all([
      prisma.checkIn.findMany({
        where,
        include: {
          student: true
        },
        orderBy: [
          { check_in_date: 'desc' },
          { check_in_time: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.checkIn.count({ where })
    ])

    const formattedVisits = visits.map(visit => {
      console.log('Original date:', visit.check_in_date);
      console.log('Original time:', visit.check_in_time);
      return {
        ...visit,
        check_in_date: visit.check_in_date.toISOString().split('T')[0],
        check_in_time: visit.check_in_time.toTimeString().split(' ')[0],
        student: {
          ...visit.student,
          formatted_course: `${visit.student.course} ${visit.student.year_level}-${visit.student.section}`
        }
      }
    })

    return NextResponse.json({
      visits: formattedVisits,
      total,
      pages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Failed to fetch visits:', error)
    return NextResponse.json({ error: 'Failed to fetch visits' }, { status: 500 })
  }
} 