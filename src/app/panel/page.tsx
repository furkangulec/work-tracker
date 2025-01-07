'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

interface WorkStats {
  totalWorks: number;
  totalWorkTime: number;
  totalBreakTime: number;
  averageWorkTime: number;
  averageBreakTime: number;
  lastWeekWorks: number;
  mostProductiveDay: {
    date: string;
    totalWorkTime: number;
  } | null;
}

export default function Panel() {
  const [stats, setStats] = useState<WorkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  type TranslationType = {
    [K in 'tr' | 'en' | 'ja']: {
      title: string;
      loading: string;
      returnToWork: string;
      totalWorks: string;
      totalWorkTime: string;
      totalBreakTime: string;
      lastWeekWorks: string;
      averageTimes: string;
      averageWorkTime: string;
      averageBreakTime: string;
      mostProductiveDay: string;
      date: string;
      noData: string;
    }
  };

  const translations: TranslationType = {
    tr: {
      title: 'Çalışma İstatistikleri',
      loading: 'İstatistikler yükleniyor...',
      returnToWork: 'Çalışmaya Dön',
      totalWorks: 'Toplam Çalışma',
      totalWorkTime: 'Toplam Çalışma Süresi',
      totalBreakTime: 'Toplam Mola Süresi',
      lastWeekWorks: 'Son 7 Gün Çalışma',
      averageTimes: 'Ortalama Süreler',
      averageWorkTime: 'Ortalama Çalışma Süresi',
      averageBreakTime: 'Ortalama Mola Süresi',
      mostProductiveDay: 'En Verimli Gün',
      date: 'Tarih',
      noData: 'Henüz veri yok'
    },
    en: {
      title: 'Work Statistics',
      loading: 'Loading statistics...',
      returnToWork: 'Return to Work',
      totalWorks: 'Total Works',
      totalWorkTime: 'Total Work Time',
      totalBreakTime: 'Total Break Time',
      lastWeekWorks: 'Last 7 Days Works',
      averageTimes: 'Average Times',
      averageWorkTime: 'Average Work Time',
      averageBreakTime: 'Average Break Time',
      mostProductiveDay: 'Most Productive Day',
      date: 'Date',
      noData: 'No data yet'
    },
    ja: {
      title: '作業統計',
      loading: '統計を読み込んでいます...',
      returnToWork: '作業に戻る',
      totalWorks: '合計作業数',
      totalWorkTime: '合計作業時間',
      totalBreakTime: '合計休憩時間',
      lastWeekWorks: '過去7日間の作業',
      averageTimes: '平均時間',
      averageWorkTime: '平均作業時間',
      averageBreakTime: '平均休憩時間',
      mostProductiveDay: '最も生産的な日',
      date: '日付',
      noData: 'データなし'
    }
  };

  const t = translations[language as 'tr' | 'en' | 'ja'];

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/work/stats');
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch statistics');
        }

        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours}s ${minutes}dk ${seconds}sn`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <h2 className="mt-4 text-lg text-gray-600">{t.loading}</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Squared notebook background */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(#e5e7eb 1px, transparent 1px),
            linear-gradient(90deg, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          opacity: 0.2
        }}
      />

      <div className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ← {t.returnToWork}
            </Link>
          </div>

          {stats && (
            <div className="space-y-8">
              {/* Main Stats Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Works */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {t.totalWorks}
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {stats.totalWorks}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Work Time */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {t.totalWorkTime}
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {formatTime(stats.totalWorkTime)}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Break Time */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {t.totalBreakTime}
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {formatTime(stats.totalBreakTime)}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Last Week Works */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {t.lastWeekWorks}
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {stats.lastWeekWorks}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Average Times */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      {t.averageTimes}
                    </h3>
                    <dl className="grid grid-cols-1 gap-5">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          {t.averageWorkTime}
                        </dt>
                        <dd className="mt-1 text-xl font-semibold text-gray-900">
                          {formatTime(stats.averageWorkTime)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          {t.averageBreakTime}
                        </dt>
                        <dd className="mt-1 text-xl font-semibold text-gray-900">
                          {formatTime(stats.averageBreakTime)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Most Productive Day */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      {t.mostProductiveDay}
                    </h3>
                    {stats.mostProductiveDay ? (
                      <dl className="grid grid-cols-1 gap-5">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t.date}
                          </dt>
                          <dd className="mt-1 text-xl font-semibold text-gray-900">
                            {stats.mostProductiveDay.date}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {t.totalWorkTime}
                          </dt>
                          <dd className="mt-1 text-xl font-semibold text-gray-900">
                            {formatTime(stats.mostProductiveDay.totalWorkTime)}
                          </dd>
                        </div>
                      </dl>
                    ) : (
                      <p className="text-gray-500">{t.noData}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 