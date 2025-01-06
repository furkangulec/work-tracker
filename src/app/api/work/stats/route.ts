import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Work } from '@/types/work';
import { verifyJwt, getJwtFromCookie } from '@/lib/jwt';

export async function GET(request: Request) {
  try {
    // Get and verify token
    const cookieHeader = request.headers.get('cookie') || '';
    const token = getJwtFromCookie(cookieHeader);
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = verifyJwt(token);
    if (!userData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('work-tracker');
    const works = db.collection<Work>('works');

    // Get all completed works for the user
    const userWorks = await works.find({
      userId: userData.id,
      isFinished: true
    }).toArray();

    // Calculate statistics
    const stats = {
      totalWorks: userWorks.length,
      totalWorkTime: userWorks.reduce((acc, work) => acc + work.totalWorkTime, 0),
      totalBreakTime: userWorks.reduce((acc, work) => acc + work.totalBreakTime, 0),
      averageWorkTime: userWorks.length > 0 
        ? Math.round(userWorks.reduce((acc, work) => acc + work.totalWorkTime, 0) / userWorks.length)
        : 0,
      averageBreakTime: userWorks.length > 0
        ? Math.round(userWorks.reduce((acc, work) => acc + work.totalBreakTime, 0) / userWorks.length)
        : 0,
      // Last 7 days statistics
      lastWeekWorks: userWorks.filter(work => {
        const workDate = new Date(work.startTime);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return workDate >= weekAgo;
      }).length,
      // Most productive day (day with most work time)
      dailyStats: userWorks.reduce((acc: {[key: string]: number}, work) => {
        const date = new Date(work.startTime).toLocaleDateString();
        acc[date] = (acc[date] || 0) + work.totalWorkTime;
        return acc;
      }, {})
    };

    const mostProductiveDay = Object.entries(stats.dailyStats)
      .sort(([,a], [,b]) => b - a)[0];

    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        mostProductiveDay: mostProductiveDay ? {
          date: mostProductiveDay[0],
          totalWorkTime: mostProductiveDay[1]
        } : null
      }
    });
  } catch (error) {
    console.error('Get work stats error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 