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
    workCard: {
      date: 'Tarih',
      duration: 'Süre',
      type: {
        work: 'Çalışma',
        break: 'Mola'
      },
      viewDetails: 'Detayları Gör'
    }
  },
  en: {
    title: 'My Works',
    loading: 'Loading works...',
    error: 'An error occurred while loading works',
    noWorks: 'You have no work records yet',
    workCard: {
      date: 'Date',
      duration: 'Duration',
      type: {
        work: 'Work',
        break: 'Break'
      },
      viewDetails: 'View Details'
    }
  },
  ja: {
    title: '作業履歴',
    loading: '作業を読み込んでいます...',
    error: '作業の読み込み中にエラーが発生しました',
    noWorks: '作業記録はまだありません',
    workCard: {
      date: '日付',
      duration: '期間',
      type: {
        work: '作業',
        break: '休憩'
      },
      viewDetails: '詳細を見る'
    }
  }
};

export default function Works() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    async function fetchWorks() {
      try {
        const response = await fetch('/api/work/list');
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
    }

    fetchWorks();
  }, []);

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

      <div className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          </div>

          {works.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t.noWorks}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {works.map((work) => (
                <div
                  key={work._id?.toString()}
                  className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        work.sessions[work.sessions.length - 1]?.type === 'work' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {t.workCard.type[work.sessions[work.sessions.length - 1]?.type || 'work']}
                      </span>
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
                        <dd className="mt-1 text-sm text-gray-900">
                          {formatDuration(work.totalWorkTime)}
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