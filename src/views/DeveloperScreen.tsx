import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeveloperInfoCard } from '../components/DeveloperInfoCard';
import {
  ArrowLeft,
  Mail,
  Copy,
  Check,
  MapPin,
  Sparkles,
  UserCheck,
  MessageSquare,
  Send,
} from 'lucide-react';

export const DeveloperScreen: React.FC = () => {
  const { setActiveScreen, t, languageCode } = useApp();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [isSent, setIsSent] = useState(false);

  const developerEmail = 'shahin.prpl@gmail.com';

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(developerEmail);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = developerEmail;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim()) return;

    const mailtoUrl = `mailto:${developerEmail}?subject=${encodeURIComponent(
      messageSubject || 'WeatherGlobe App Inquiry'
    )}&body=${encodeURIComponent(messageBody)}`;

    window.location.href = mailtoUrl;
    setIsSent(true);
    setTimeout(() => setIsSent(false), 3000);
    setMessageSubject('');
    setMessageBody('');
  };

  return (
    <div className="pb-28 pt-4 px-4 max-w-2xl mx-auto space-y-5">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs">
        <button
          onClick={() => setActiveScreen('dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToHome')}</span>
        </button>

        <span className="text-[11px] font-extrabold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 px-3 py-1 rounded-full">
          {t('officialDeveloperPage')}
        </span>
      </div>

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white border border-teal-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden text-center space-y-3">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700 p-0.5 shadow-xl flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center border border-teal-300/40">
            <span className="font-black text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-200 to-white">
              MS
            </span>
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 px-3 py-0.5 rounded-full mb-1">
            <UserCheck className="w-3.5 h-3.5 text-teal-300" />
            <span className="text-[11px] font-extrabold text-teal-200">
              {t('verifiedAuthor')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t('developerName')}
          </h1>
          <p className="text-xs sm:text-sm text-teal-300 font-bold mt-1">
            {t('developerRole')}
          </p>
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span>{t('developerLocation')}</span>
          </p>
        </div>

        {/* Quick Email Pill Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
          <button
            onClick={() => setActiveScreen('buy_me_a_coffee')}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-slate-950/20" />
            <span>{t('buyMeACoffee')} ☕</span>
          </button>

          <a
            href={`mailto:${developerEmail}`}
            className="w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Mail className="w-4 h-4" />
            <span>{developerEmail}</span>
          </a>

          <button
            onClick={handleCopyEmail}
            className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copiedEmail ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">{t('emailCopied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-teal-400" />
                <span>{t('copyEmail')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Full Developer Info Card Component */}
      <DeveloperInfoCard />

      {/* Direct Contact & Feedback Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <MessageSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {t('directInquiryTitle')}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t('directInquirySub')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              {t('subjectLabel')}:
            </label>
            <input
              type="text"
              value={messageSubject}
              onChange={(e) => setMessageSubject(e.target.value)}
              placeholder={t('subjectPlaceholder')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              {t('messageLabel')}:
            </label>
            <textarea
              rows={3}
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              placeholder={t('messagePlaceholder')}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{t('openEmailApp')}</span>
          </button>

          {isSent && (
            <p className="text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-bounce pt-1">
              {t('openingEmailClient')}
            </p>
          )}
        </form>
      </div>

      {/* Back to Home Action Button */}
      <button
        onClick={() => setActiveScreen('dashboard')}
        className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs text-center shadow-sm flex items-center justify-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('backToHome')}</span>
      </button>
    </div>
  );
};
