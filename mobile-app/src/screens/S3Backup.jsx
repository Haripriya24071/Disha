import React from 'react';

/**
 * S3Backup Screen — Haripriya
 * Provides low-stress alternative travel options (trains and buses)
 * if a ticket is stuck on the waiting list.
 * 
 * Rules:
 * - One primary "I will wait for the final list" button (no countdown, no pressure)
 * - Availability indicated by word AND icon (✔ Available / ⏳ Waiting / ? Unknown)
 * - External booking links open safely in a new tab (target="_blank" rel="noopener")
 */
export function S3Backup({ journey, onBack, t, lang, LangDropdownComponent, HeaderComponent }) {
  // Use passed data or §10.3 standard backup options
  const routeFrom = journey?.route?.from_name || journey?.route?.from || 'Bengaluru';
  const routeTo = journey?.route?.to_name || journey?.route?.to || 'Chennai';

  const trains = [
    {
      number: '12627',
      name: 'Karnataka Express',
      departs: '21:20',
      arrives: '05:10',
      availability: 'Available',
      book_url: 'https://www.irctc.co.in/'
    },
    {
      number: '12608',
      name: 'Lalbagh Express',
      departs: '06:20',
      arrives: '12:15',
      availability: 'Waiting',
      book_url: 'https://www.irctc.co.in/'
    },
    {
      number: '12028',
      name: 'Shatabdi Express',
      departs: '06:00',
      arrives: '11:00',
      availability: 'Available',
      book_url: 'https://www.irctc.co.in/'
    }
  ];

  const buses = [
    {
      operator: 'KSRTC (Karnataka State Road Transport)',
      note: 'Direct government bus services with verified tracking',
      url: 'https://ksrtc.in/'
    },
    {
      operator: 'TNSTC / APSRTC',
      note: 'State highway express buses from Bengaluru',
      url: 'https://www.tnstc.in/'
    },
    {
      operator: 'redBus Portal',
      note: 'Compare verified private & state bus departures',
      url: 'https://www.redbus.in/'
    }
  ];

  function renderAvailabilityBadge(status) {
    if (status === 'Available') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-900 border border-green-300">
          <span aria-hidden="true">✔</span>
          <span>Available</span>
        </span>
      );
    }
    if (status === 'Waiting') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-900 border border-amber-300">
          <span aria-hidden="true">⏳</span>
          <span>Waiting</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 border border-gray-300">
        <span aria-hidden="true">?</span>
        <span>Unknown</span>
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4FF] text-gray-900 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur shadow-sm px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 min-h-[48px] min-w-[48px] flex items-center justify-center text-gray-700"
            aria-label="Go back to My Journey"
          >
            <span className="text-2xl font-bold" aria-hidden="true">←</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            {t('ui.backup_plan') || 'Backup plan'}
          </h1>
        </div>
        {LangDropdownComponent && <LangDropdownComponent />}
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pt-6 space-y-6">
        {/* Intro */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-100 space-y-2">
          <p className="text-lg text-gray-800 font-medium">
            Your ticket may not confirm. Here are other ways to travel from{' '}
            <span className="font-bold text-blue-900">{routeFrom}</span> to{' '}
            <span className="font-bold text-blue-900">{routeTo}</span>:
          </p>
        </div>

        {/* Section: Other trains */}
        <section aria-labelledby="heading-other-trains" className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🚆</span>
            <h2 id="heading-other-trains" className="text-xl font-bold text-gray-900 tracking-wide uppercase">
              {t('ui.other_trains') || 'Other trains'}
            </h2>
          </div>

          <div className="space-y-3">
            {trains.map((train) => (
              <article
                key={train.number}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-3 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {train.number} {train.name}
                    </h3>
                    <p className="text-base text-gray-600">
                      Departs {train.departs} · Arrives {train.arrives}
                    </p>
                  </div>
                  {renderAvailabilityBadge(train.availability)}
                </div>

                <div className="pt-1">
                  <a
                    href={train.book_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-base min-h-[48px] shadow-sm active:scale-[0.99] transition"
                  >
                    <span>{t('ui.book') || 'Book'}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Section: Buses */}
        <section aria-labelledby="heading-buses" className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🚌</span>
            <h2 id="heading-buses" className="text-xl font-bold text-gray-900 tracking-wide uppercase">
              {t('ui.buses') || 'Buses'}
            </h2>
          </div>

          <div className="space-y-3">
            {buses.map((bus, idx) => (
              <article
                key={idx}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-2 hover:border-blue-300 transition-colors"
              >
                <h3 className="text-lg font-bold text-gray-900">
                  {bus.operator}
                </h3>
                <p className="text-base text-gray-600">
                  {bus.note}
                </p>
                <div className="pt-1">
                  <a
                    href={bus.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-lg border-2 border-gray-300 hover:border-gray-400 bg-gray-50 text-gray-900 font-semibold text-base min-h-[48px] active:scale-[0.99] transition"
                  >
                    <span>{t('ui.open_site') || 'Open website'}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Helpline 139 Assistance */}
        <div className="text-center pt-2">
          <a
            href="tel:139"
            className="inline-flex items-center justify-center gap-2 text-base font-semibold text-blue-800 hover:underline min-h-[48px] px-4"
          >
            <span aria-hidden="true">📞</span>
            <span>{t('ui.call_139') || 'Call railway helpline 139'}</span>
          </a>
        </div>

        {/* Primary Return Button (No pressure) */}
        <div className="pt-4 sticky bottom-4">
          <button
            onClick={onBack}
            className="w-full py-4 px-6 rounded-2xl bg-[#1A1A2E] hover:bg-gray-800 active:scale-[0.99] text-white font-bold text-lg min-h-[56px] shadow-lg flex items-center justify-center gap-3 transition"
          >
            <span aria-hidden="true">⏳</span>
            <span>{t('ui.wait') || 'I will wait for the final list'}</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default S3Backup;
