'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface WorkSession {
  _id: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: 'work' | 'break';
  userId: string;
}

const translations = {
  tr: {
    title: 'Çalışma Detayları',
    loading: 'Çalışma detayları yükleniyor...',
    error: 'Çalışma detayları yüklenirken bir hata oluştu',
    notFound: 'Çalışma bulunamadı',
    backToList: 'Listeye Dön',
    details: {
      type: {
        label: 'Tür',
        work: 'Çalışma',
        break: 'Mola'
      },
      startTime: 'Başlangıç Zamanı',
      endTime: 'Bitiş Zamanı',
      duration: 'Süre'
    }
  },
  en: {
    title: 'Work Details',
    loading: 'Loading work details...',
    error: 'An error occurred while loading work details',
    notFound: 'Work not found',
    backToList: 'Back to List',
    details: {
      type: {
        label: 'Type',
        work: 'Work',
        break: 'Break'
      },
      startTime: 'Start Time',
      endTime: 'End Time',
      duration: 'Duration'
    }
  },
  ja: {
    title: '作業詳細',
    loading: '作業詳細を読み込んでいます...',
    error: '作業詳細の読み込み中にエラーが発生しました',
    notFound: '作業が見つかりません',
    backToList: '一覧に戻る',
    details: {
      type: {
        label: '種類',
        work: '作業',
        break: '休憩'
      },
      startTime: '開始時間',
      endTime: '終了時間',
      duration: '期間'
    }
  }
};

export default function WorkDetail() {
  const [work, setWork] = useState<WorkSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const params = useParams();
  const router = useRouter();

  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    async function fetchWorkDetail() {
      try {
        const response = await fetch(`/api/work/${params.id}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch work details');
        }

        if (!data.work) {
          router.push('/panel/works');
          return;
        }

        setWork(data.work);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchWorkDetail();
    }
  }, [params.id, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
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

  if (!work) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p>{t.notFound}</p>
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
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
            <Link
              href="/panel/works"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ← {t.backToList}
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                work.type === 'work' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {t.details.type[work.type]}
              </span>
            </div>
            <div className="border-t border-gray-200">
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
                    {formatDate(work.endTime)}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    {t.details.duration}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatDuration(work.duration)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 