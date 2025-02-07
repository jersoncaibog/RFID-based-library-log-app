import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/leaderboard - Get top visitors
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'all' // all, today, week, month
    const limit = parseInt(searchParams.get('limit') || '10')

    let dateFilter = {}
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
    }

    const topVisitors = await prisma.student.findMany({
      where: {
        status: 'active',
        check_ins: period !== 'all' ? {
          some: {
            check_in_date: dateFilter
          }
        } : undefined
      },
      include: {
        _count: {
          select: {
            check_ins: period !== 'all' ? {
              where: {
                check_in_date: dateFilter
              }
            } : true
          }
        }
      },
      orderBy: {
        check_ins: {
          _count: 'desc'
        }
      },
      take: limit
    })

    return NextResponse.json(topVisitors)
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
} 