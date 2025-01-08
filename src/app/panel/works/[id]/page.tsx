'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Work } from '@/types/work';

const translations = {
  tr: {
    title: 'Çalışma Detayları',
    loading: 'Çalışma detayları yükleniyor...',
    error: 'Çalışma detayları yüklenirken bir hata oluştu',
    notFound: 'Çalışma bulunamadı',
    backToList: 'Listeye Dön',
    details: {
      startTime: 'Başlangıç Zamanı',
      endTime: 'Bitiş Zamanı',
      totalDuration: 'Toplam Süre',
      workDuration: 'Toplam Çalışma Süresi',
      breakDuration: 'Toplam Mola Süresi',
      sessions: 'Oturum Detayları',
      work: 'Çalışma',
      break: 'Mola',
      ongoing: 'Devam Ediyor'
    }
  },
  en: {
    title: 'Work Details',
    loading: 'Loading work details...',
    error: 'An error occurred while loading work details',
    notFound: 'Work not found',
    backToList: 'Back to List',
    details: {
      startTime: 'Start Time',
      endTime: 'End Time',
      totalDuration: 'Total Duration',
      workDuration: 'Total Work Time',
      breakDuration: 'Total Break Time',
      sessions: 'Session Details',
      work: 'Work',
      break: 'Break',
      ongoing: 'Ongoing'
    }
  },
  ja: {
    title: '作業詳細',
    loading: '作業詳細を読み込んでいます...',
    error: '作業詳細の読み込み中にエラーが発生しました',
    notFound: '作業が見つかりません',
    backToList: '一覧に戻る',
    details: {
      startTime: '開始時間',
      endTime: '終了時間',
      totalDuration: '合計時間',
      workDuration: '合計作業時間',
      breakDuration: '合計休憩時間',
      sessions: 'セッション詳細',
      work: '作業',
      break: '休憩',
      ongoing: '進行中'
    }
  }
};

export default function WorkDetail() {
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const params = useParams();

  const t = translations[language as keyof typeof translations];

  const fetchWorkDetail = useCallback(async () => {
    try {
      const response = await fetch(`/api/work/${params.id}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch work details');
      }

      if (!data.work) {
        setError('Work not found');
        return;
      }

      setWork(data.work);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchWorkDetail();
  }, [fetchWorkDetail]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(
      language === 'tr' ? 'tr-TR' : language === 'ja' ? 'ja-JP' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    );
  };

  const formatDuration = (ms: number | undefined) => {
    if (!ms) return '-';
    
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
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>{t.notFound}</p>
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
      <div className="max-w-4xl mx-auto p-8 relative z-10">
        <div className="mb-8 flex justify-between items-center">
          <Link
            href="/panel/works"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            ← {t.backToList}
          </Link>
        </div>

        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border-b border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    {t.details.startTime}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatDate(work.startTime)}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    {t.details.endTime}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {work.endTime ? formatDate(work.endTime) : '-'}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    {t.details.totalDuration}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatDuration((work.totalWorkTime || 0) + (work.totalBreakTime || 0))}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    {t.details.workDuration}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatDuration(work.totalWorkTime || 0)}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    {t.details.breakDuration}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatDuration(work.totalBreakTime || 0)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Sessions Timeline */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">{t.details.sessions}</h3>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {work.sessions.map((session, sessionIdx) => (
                      <li key={sessionIdx}>
                        <div className="relative pb-8">
                          {sessionIdx !== work.sessions.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                session.type === 'work' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {session.type === 'work' ? '🎯' : '☕'}
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-500">
                                  {session.type === 'work' ? t.details.work : t.details.break}
                                </p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                <div className="font-medium">
                                  {formatDate(session.startTime)}
                                </div>
                                <div className="text-gray-400">
                                  {session.endTime ? formatDuration(session.endTime - session.startTime) : t.details.ongoing}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 