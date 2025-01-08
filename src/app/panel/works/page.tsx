'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { Work } from '@/types/work';

const translations = {
  tr: {
    title: 'Çalışmalarım',
    loading: 'Çalışmalar yükleniyor...',
    error: 'Çalışmalar yüklenirken bir hata oluştu',
    noWorks: 'Henüz hiç çalışma kaydınız yok',
    noFilteredWorks: 'Aradığınız kriterlere göre çalışma kaydı bulunamadı',
    filter: {
      startDate: 'Başlangıç',
      endDate: 'Bitiş',
      apply: 'Filtrele',
      clear: 'Temizle',
      sort: 'Sıralama',
      sortOptions: {
        dateDesc: 'Yeniden Eskiye',
        dateAsc: 'Eskiden Yeniye',
        totalTimeDesc: 'Toplam Süre (Azalan)',
        totalTimeAsc: 'Toplam Süre (Artan)',
        workTimeDesc: 'Çalışma Süresi (Azalan)',
        workTimeAsc: 'Çalışma Süresi (Artan)',
        breakTimeDesc: 'Mola Süresi (Azalan)',
        breakTimeAsc: 'Mola Süresi (Artan)'
      }
    },
    workCard: {
      date: 'Tarih',
      duration: 'Toplam Süre',
      durationTitle: 'Süre Detayları',
      workDuration: 'Çalışma',
      breakDuration: 'Mola',
      work: 'Çalışma',
      ongoing: 'Devam Ediyor',
      viewDetails: 'Detayları Gör',
      hasNotes: 'Bu çalışmaya ait notlarınız mevcut'
    }
  },
  en: {
    title: 'My Works',
    loading: 'Loading works...',
    error: 'An error occurred while loading works',
    noWorks: 'You have no work records yet',
    noFilteredWorks: 'No work records found matching your criteria',
    filter: {
      startDate: 'Start',
      endDate: 'End',
      apply: 'Filter',
      clear: 'Clear',
      sort: 'Sort',
      sortOptions: {
        dateDesc: 'Newest First',
        dateAsc: 'Oldest First',
        totalTimeDesc: 'Total Time (Desc)',
        totalTimeAsc: 'Total Time (Asc)',
        workTimeDesc: 'Work Time (Desc)',
        workTimeAsc: 'Work Time (Asc)',
        breakTimeDesc: 'Break Time (Desc)',
        breakTimeAsc: 'Break Time (Asc)'
      }
    },
    workCard: {
      date: 'Date',
      duration: 'Total Duration',
      durationTitle: 'Duration Details',
      workDuration: 'Work',
      breakDuration: 'Break',
      work: 'Work',
      ongoing: 'Ongoing',
      viewDetails: 'View Details',
      hasNotes: 'This work has notes'
    }
  },
  ja: {
    title: '作業履歴',
    loading: '作業を読み込んでいます...',
    error: '作業の読み込み中にエラーが発生しました',
    noWorks: '作業記録はまだありません',
    noFilteredWorks: '検索条件に一致する作業記録が見つかりませんでした',
    filter: {
      startDate: '開始',
      endDate: '終了',
      apply: 'フィルター',
      clear: 'クリア',
      sort: '並び替え',
      sortOptions: {
        dateDesc: '新しい順',
        dateAsc: '古い順',
        totalTimeDesc: '合計時間 (降順)',
        totalTimeAsc: '合計時間 (昇順)',
        workTimeDesc: '作業時間 (降順)',
        workTimeAsc: '作業時間 (昇順)',
        breakTimeDesc: '休憩時間 (降順)',
        breakTimeAsc: '休憩時間 (昇順)'
      }
    },
    workCard: {
      date: '日付',
      duration: '合計時間',
      durationTitle: '時間の詳細',
      workDuration: '作業',
      breakDuration: '休憩',
      work: '作業',
      ongoing: '進行中',
      viewDetails: '詳細を見る',
      hasNotes: 'このワークにメモがあります'
    }
  }
};

export default function Works() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('dateDesc');
  const { language } = useLanguage();

  const t = translations[language as keyof typeof translations];

  const sortWorks = useCallback((worksToSort: Work[]) => {
    return [...worksToSort].sort((a, b) => {
      if (sortBy === 'date') {
        return b.startTime - a.startTime;
      } else if (sortBy === 'duration') {
        const aDuration = (a.totalWorkTime || 0) + (a.totalBreakTime || 0);
        const bDuration = (b.totalWorkTime || 0) + (b.totalBreakTime || 0);
        return bDuration - aDuration;
      }
      return 0;
    });
  }, [sortBy]);

  const fetchWorks = useCallback(async (start?: string, end?: string) => {
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

      setWorks(sortWorks(data.works));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [sortWorks]);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  useEffect(() => {
    setWorks(prevWorks => sortWorks(prevWorks));
  }, [sortBy, sortWorks]);

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

  const isFilterActive = startDate !== '' || endDate !== '';

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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 items-end">
                <div className="lg:col-span-2">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    {t.filter.startDate}
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    {t.filter.endDate}
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  />
                </div>
                <div className="lg:col-span-4">
                  <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
                    {t.filter.sort}
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="mt-1 block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  >
                    {Object.entries(t.filter.sortOptions).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2 lg:col-span-4">
                  <button
                    onClick={handleFilter}
                    className="inline-flex justify-center py-1.5 px-3 text-sm border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {t.filter.apply}
                  </button>
                  <button
                    onClick={handleClear}
                    className="inline-flex justify-center py-1.5 px-3 text-sm border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {t.filter.clear}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {works.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {isFilterActive ? t.noFilteredWorks : t.noWorks}
              </p>
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
                        {work.hasNotes && (
                          <div className="group relative inline-block">
                            <div 
                              className="text-yellow-600 cursor-help"
                            >
                              <svg 
                                className="w-5 h-5" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                                />
                              </svg>
                            </div>
                            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 z-50 hidden group-hover:block">
                              <div className="bg-gray-900 text-white text-xs rounded py-1.5 px-3 whitespace-nowrap">
                                {t.workCard.hasNotes}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2">
                                  <div className="border-4 border-transparent border-b-gray-900"></div>
                                </div>
                              </div>
                            </div>
                          </div>
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
                        <dt className="text-sm font-medium text-gray-500 mb-3">
                          {t.workCard.durationTitle}
                        </dt>
                        <dd className="mt-2 text-sm text-gray-900 space-y-2.5">
                          <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-1.5 rounded w-full">
                            <span className="text-xs font-medium">{t.workCard.duration}:</span>
                            <span className="font-medium">{formatDuration((work.totalWorkTime || 0) + (work.totalBreakTime || 0))}</span>
                          </div>
                          <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded w-full">
                            <span className="text-xs font-medium">{t.workCard.workDuration}:</span>
                            <span className="font-medium">{formatDuration(work.totalWorkTime || 0)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-yellow-700 bg-yellow-50 px-3 py-1.5 rounded w-full">
                            <span className="text-xs font-medium">{t.workCard.breakDuration}:</span>
                            <span className="font-medium">{formatDuration(work.totalBreakTime || 0)}</span>
                          </div>
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