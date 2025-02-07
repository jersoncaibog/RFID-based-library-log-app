import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/leaderboard - Get top visitors
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'all' // all, today, week, month
    const limit = parseInt(searchParams.get('limit') || '10')

    let dateFilter: { gte: Date } | undefined
    const now = new Date()

    switch (period) {
      case 'today':
        dateFilter = {
          gte: new Date(now.setHours(0, 0, 0, 0))
        }
        break
      case 'week':
        const weekAgo = new Date(now)
        weekAgo.setDate(weekAgo.getDate() - 7)
        dateFilter = {
          gte: weekAgo
        }
        break
      case 'month':
        const monthAgo = new Date(now)
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        dateFilter = {
          gte: monthAgo
        }
        break
      default:
        dateFilter = undefined
    }

    const students = await prisma.student.findMany({
      select: {
        student_id: true,
        first_name: true,
        last_name: true,
        check_ins: {
          where: dateFilter ? {
            check_in_date: dateFilter
          } : undefined
        }
      }
    })

    const topVisitors = students
      .map(student => ({
        student_id: student.student_id,
        full_name: `${student.first_name} ${student.last_name}`,
        visit_count: student.check_ins.length
      }))
      .sort((a, b) => b.visit_count - a.visit_count)
      .slice(0, limit)

    return NextResponse.json(topVisitors)
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
} 