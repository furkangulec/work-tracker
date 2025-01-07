'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { Work } from '@/types/work';

const translations = {
  tr: {
    title: 'Çalışmalarım',
    loading: 'Çalışmalar yükleniyor...',
    error: 'Çalışmalar yüklenirken bir hata oluştu',
    noWorks: 'Henüz hiç çalışma kaydınız yok',
    filter: {
      startDate: 'Başlangıç Tarihi',
      endDate: 'Bitiş Tarihi',
      apply: 'Filtrele',
      clear: 'Temizle'
    },
    workCard: {
      date: 'Tarih',
      duration: 'Toplam Süre',
      workDuration: 'Çalışma',
      breakDuration: 'Mola',
      work: 'Çalışma',
      ongoing: 'Devam Ediyor',
      viewDetails: 'Detayları Gör'
    }
  },
  en: {
    title: 'My Works',
    loading: 'Loading works...',
    error: 'An error occurred while loading works',
    noWorks: 'You have no work records yet',
    filter: {
      startDate: 'Start Date',
      endDate: 'End Date',
      apply: 'Apply Filter',
      clear: 'Clear'
    },
    workCard: {
      date: 'Date',
      duration: 'Total Duration',
      workDuration: 'Work',
      breakDuration: 'Break',
      work: 'Work',
      ongoing: 'Ongoing',
      viewDetails: 'View Details'
    }
  },
  ja: {
    title: '作業履歴',
    loading: '作業を読み込んでいます...',
    error: '作業の読み込み中にエラーが発生しました',
    noWorks: '作業記録はまだありません',
    filter: {
      startDate: '開始日',
      endDate: '終了日',
      apply: 'フィルター',
      clear: 'クリア'
    },
    workCard: {
      date: '日付',
      duration: '合計時間',
      workDuration: '作業',
      breakDuration: '休憩',
      work: '作業',
      ongoing: '進行中',
      viewDetails: '詳細を見る'
    }
  }
};

export default function Works() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { language } = useLanguage();

  const t = translations[language as keyof typeof translations];

  const fetchWorks = async (start?: string, end?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (start) params.append('startDate', start);
      if (end) params.append('endDate', end);

      const response = await fetch(`/api/work/list?${params.toString()}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch works');
      }

      setWorks(data.works);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const handleFilter = () => {
    fetchWorks(startDate, endDate);
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    fetchWorks();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(
      language === 'tr' ? 'tr-TR' : language === 'ja' ? 'ja-JP' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  };

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    
    if (language === 'tr') {
      return `${hours}s ${minutes}dk ${seconds}sn`;
    } else if (language === 'ja') {
      return `${hours}時間 ${minutes}分 ${seconds}秒`;
    } else {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <div className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
            <div className="mt-4 bg-white p-4 rounded-lg shadow-lg border border-gray-100">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    {t.filter.startDate}
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    {t.filter.endDate}
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleFilter}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {t.filter.apply}
                  </button>
                  <button
                    onClick={handleClear}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {t.filter.clear}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {works.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t.noWorks}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {works.map((work, index) => (
                <div
                  key={work._id?.toString()}
                  className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-all duration-200 border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {t.workCard.work} #{works.length - index}
                        </span>
                        {!work.isFinished && (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            {t.workCard.ongoing}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/panel/works/${work._id}`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        {t.workCard.viewDetails}
                      </Link>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          {t.workCard.date}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {formatDate(work.startTime)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          {t.workCard.duration}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center gap-3">
                          <span>{formatDuration(work.totalWorkTime)}</span>
                          <span className="flex items-center gap-2 text-green-700 bg-green-50 px-2 py-1 rounded">
                            <span className="text-xs font-medium">{t.workCard.workDuration}:</span>
                            <span className="font-medium">{formatDuration(work.totalWorkTime - (work.totalBreakTime || 0))}</span>
                          </span>
                          <span className="flex items-center gap-2 text-yellow-700 bg-yellow-50 px-2 py-1 rounded">
                            <span className="text-xs font-medium">{t.workCard.breakDuration}:</span>
                            <span className="font-medium">{formatDuration(work.totalBreakTime || 0)}</span>
                          </span>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 