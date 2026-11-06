import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, BellRing, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

export const PushNotificationManager: React.FC = () => {
  const { languageCode, weatherData, selectedLocation, getLocationName } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'granted';
    } catch {
      return false;
    }
  });
  const [testSent, setTestSent] = useState<boolean>(false);

  const isBn = languageCode === 'bn';
  const currentLocName = getLocationName(selectedLocation);
  const hasAlerts = weatherData?.alerts && weatherData.alerts.length > 0;

  const handleRequestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert(isBn ? 'এই ব্রাউজারে পুশ নোটিফিকেশন সমর্থিত নয়।' : 'Push notifications are not supported in this browser.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        new Notification(isBn ? 'WeatherGlobe নোটিফিকেশন সচল!' : 'WeatherGlobe Notifications Enabled!', {
          body: isBn
            ? `${currentLocName}-এ বৃষ্টির বা ঝড়ের রিয়েল-টাইম অ্যালার্ট পাঠানো হবে।`
            : `Real-time weather and rain alerts will be sent for ${currentLocName}.`,
          icon: '/logo.svg',
        });
      } else {
        alert(isBn ? 'নোটিফিকেশন পারমিশন দেওয়া হয়নি।' : 'Notification permission was denied.');
      }
    } catch (e) {
      console.error('Notification error:', e);
    }
  };

  const handleTestPushAlarm = () => {
    if (!notificationsEnabled) {
      handleRequestPermission();
      return;
    }

    setTestSent(true);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(isBn ? '⚠️ কালবৈশাখী ও বৃষ্টির জরুরি অ্যালার্ট!' : '⚠️ Storm & Rain Alert Test!', {
        body: isBn
          ? `${currentLocName}-এ আগামী ১০ মিনিটের মধ্যে বৃষ্টি বা দমকা হাওয়া বইতে পারে!`
          : `Rain or strong wind gust expected in ${currentLocName} within the next 10 minutes!`,
        icon: '/logo.svg',
      });
    } else {
      alert(isBn ? `⚠️ টেস্ট অ্যালার্ট: ${currentLocName}-এ আবহাওয়া স্বাভাবিক রয়েছে।` : `⚠️ Test Alert: Weather in ${currentLocName} is stable.`);
    }

    setTimeout(() => setTestSent(false), 4000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-md space-y-3.5">
      <div className="flex items-center justify-between border-b pb-2.5 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <BellRing className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              {isBn ? 'পুশ নোটিফিকেশন ও রিয়েল-টাইম ওয়েদার অ্যালার্ম' : 'Push Notifications & Real-Time Weather Alarms'}
            </h2>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
              {isBn ? 'ঝড়, তীব্র তাপপ্রবাহ বা বৃষ্টি নামার ৫-১০ মিনিট আগে মোবাইল অ্যালার্ট' : 'Instant mobile alerts 5-10 minutes before rain, storms, or heatwaves'}
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
          notificationsEnabled
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
        }`}>
          {notificationsEnabled ? (isBn ? 'অ্যালার্ট সচল' : 'Alerts Active') : (isBn ? 'অ্যালার্ট বন্ধ' : 'Alerts Disabled')}
        </span>
      </div>

      <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <p className="font-extrabold text-slate-900 dark:text-white">
            {notificationsEnabled ? (isBn ? 'আপনার ডিভাইসে রিয়েল-টাইম অ্যালার্ম সেট করা আছে।' : 'Real-time weather alarms are active on this device.') : (isBn ? 'ঝড় ও বৃষ্টির আগে নোটিফিকেশন পেতে অনুমতি দিন।' : 'Enable permissions to receive rain & storm push notifications.')}
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
            {isBn ? 'প্রতিদিন নির্দিষ্ট সময়ে এবং জরুরি মুহূর্তে স্বয়ংক্রিয় নোটিফিকেশন পাঠানো হবে।' : 'Automated alerts will be triggered for severe weather changes.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!notificationsEnabled ? (
            <button
              onClick={handleRequestPermission}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Bell className="w-4 h-4" />
              <span>{isBn ? 'নোটিফিকেশন অন করুন' : 'Enable Alarms'}</span>
            </button>
          ) : (
            <button
              onClick={handleTestPushAlarm}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{testSent ? (isBn ? 'অ্যালার্ট পাঠানো হয়েছে!' : 'Test Sent!') : (isBn ? 'টেস্ট অ্যালার্ট পাঠান' : 'Test Push Alarm')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
