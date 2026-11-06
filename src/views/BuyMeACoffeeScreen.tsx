import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Coffee,
  ArrowLeft,
  Copy,
  Check,
  Building2,
  Smartphone,
  Heart,
  Sparkles,
  User,
  MapPin,
  FileCode2,
  BadgeCheck,
  Globe,
  Gift
} from 'lucide-react';

export const BuyMeACoffeeScreen: React.FC = () => {
  const { setActiveScreen, t, languageCode } = useApp();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey(null);
      }, 2500);
    } catch {
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey(null);
      }, 2500);
    }
  };

  const coffeePackages = [
    { count: languageCode === 'bn' ? '১টি কফি ☕' : '1 Coffee ☕', amount: '৳১০০ / $1', label: languageCode === 'bn' ? 'স্মল সাপোর্ট' : 'Small Support' },
    { count: languageCode === 'bn' ? '২টি কফি ☕☕' : '2 Coffees ☕☕', amount: '৳২৫০ / $2.5', label: languageCode === 'bn' ? 'মিডিয়াম সাপোর্ট' : 'Medium Support', popular: true },
    { count: languageCode === 'bn' ? '৩টি কফি ☕☕☕' : '3 Coffees ☕☕☕', amount: '৳৫০০ / $5', label: languageCode === 'bn' ? 'বিগ সাপোর্ট' : 'Big Support' },
    { count: languageCode === 'bn' ? 'কাস্টম কফি ☕✨' : 'Custom Coffee ☕✨', amount: languageCode === 'bn' ? 'যেকোনো পরিমাণ' : 'Any Amount', label: languageCode === 'bn' ? 'বিশেষ উপহার' : 'Special Gift' },
  ];

  const mobileBankingList = [
    {
      id: 'bkash',
      name: 'bKash Personal',
      number: '01919462158',
      color: 'from-pink-600 to-rose-600',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      tag: 'bKash Send Money / Cash In',
      logoText: 'bKash',
    },
    {
      id: 'nagad',
      name: 'Nagad Personal',
      number: '01919462158',
      color: 'from-orange-600 to-amber-600',
      badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      tag: 'Nagad Send Money / Cash In',
      logoText: 'Nagad',
    },
  ];

  const bankAccounts = [
    {
      id: 'bank_asia',
      bankName: 'Bank Asia',
      accountHolder: 'MD Shahin',
      accountNumber: '01034016742',
      branchLocation: 'Niloy, 60 Dargah Gate, Sylhet',
      swiftCode: 'BALBBDDH',
      routingNumber: '070913798',
      color: 'from-blue-600 to-indigo-700',
    },
    {
      id: 'dbbl',
      bankName: 'Dutch-Bangla Bank',
      branchName: 'Shyamoli Branch',
      accountHolder: 'MD Shahin',
      accountNumber: '1481030371831',
      branchLocation: '24, Shyamoli cinema complex, 2nd floor 24/1',
      swiftCode: 'DBBLBDDH',
      routingNumber: '090263978',
      color: 'from-emerald-600 to-teal-700',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setActiveScreen('dashboard')}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-slate-800/80 hover:bg-slate-700/80 px-3 py-1.5 rounded-xl text-sm font-medium border border-slate-700/50 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToHome')}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <Coffee className="w-4 h-4" />
          </div>
          <span className="font-bold text-base bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent">
            {t('buyMeACoffee')}
          </span>
        </div>

        <button
          onClick={() => setActiveScreen('developer_info')}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-800 text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <User className="w-3.5 h-3.5" />
          <span>{t('developerName')}</span>
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* HERO BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950/50 to-slate-900 border border-amber-500/40 p-6 shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 animate-bounce">
              <Coffee className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl font-black text-white tracking-wide flex items-center justify-center gap-2">
                <span>{t('buyCoffeeTitle')}</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </h1>
              <p className="text-xs sm:text-sm text-amber-200/90 font-medium max-w-lg mx-auto leading-relaxed bg-amber-950/40 p-3 rounded-2xl border border-amber-500/20">
                💡 {t('buyCoffeeDesc')}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>{t('verifiedAuthor')}: MD Shahin</span>
            </div>
          </div>
        </div>

        {/* COFFEE OFFER SUGGESTIONS */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-sm px-1">
            <Gift className="w-4 h-4 text-amber-400" />
            <h2>{t('buyMeACoffee')} {languageCode === 'bn' ? 'অফারের পরিমাণ নির্দেশিকা' : 'Contribution Tiers'}</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {coffeePackages.map((pkg, idx) => (
              <div
                key={idx}
                className={`relative bg-slate-900/90 border ${
                  pkg.popular ? 'border-amber-500/60 bg-amber-950/20' : 'border-slate-800'
                } rounded-2xl p-3 text-center space-y-1 shadow-md`}
              >
                {pkg.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                    {languageCode === 'bn' ? 'পপুলার' : 'Popular'}
                  </span>
                )}
                <div className="font-extrabold text-xs text-amber-300">{pkg.count}</div>
                <div className="font-black text-base text-white">{pkg.amount}</div>
                <div className="text-[10px] text-slate-400 font-medium">{pkg.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE BANKING SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-slate-200 font-bold text-base px-1">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-amber-400" />
              <h2>{t('mobileBankingTitle')}</h2>
            </div>
            <span className="text-xs font-semibold text-amber-400 bg-slate-900 px-2.5 py-1 rounded-full border border-amber-500/30">
              01919462158
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mobileBankingList.map((mb) => {
              const isCopied = copiedKey === mb.id;
              return (
                <div
                  key={mb.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 space-y-3 shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-extrabold text-white bg-gradient-to-r ${mb.color}`}>
                        {mb.logoText}
                      </div>
                      <span className="font-semibold text-slate-200 text-sm">{mb.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${mb.badgeColor}`}>
                      Personal
                    </span>
                  </div>

                  <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between">
                    <div className="font-mono text-base font-bold text-amber-300 tracking-wider">
                      {mb.number}
                    </div>
                    <button
                      onClick={() => handleCopy(mb.number, mb.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{t('numberCopied')}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>{t('copyNumber')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BANKING SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-base">
              <Building2 className="w-5 h-5 text-blue-400" />
              <h2>{t('bankingAccountsTitle')}</h2>
            </div>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
              Wire / Local Transfer
            </span>
          </div>

          <div className="space-y-4">
            {bankAccounts.map((bank) => (
              <div
                key={bank.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${bank.color}`} />
                      {bank.bankName}
                    </h3>
                    {bank.branchName && (
                      <p className="text-xs text-amber-400 font-medium ml-5">{bank.branchName}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-xs text-slate-300">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-white">{t('accountHolder')}: {bank.accountHolder}</span>
                  </div>
                </div>

                {/* ACCOUNT NUMBER */}
                <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">
                      {t('accountNumber')}
                    </span>
                    <span className="font-mono text-lg font-black text-amber-300 tracking-wider">
                      {bank.accountNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(bank.accountNumber, `${bank.id}_acc`)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      copiedKey === `${bank.id}_acc`
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {copiedKey === `${bank.id}_acc` ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{t('numberCopied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t('copyNumber')}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* GRID DETAILS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Location */}
                  <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1 font-semibold">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {t('bankLocation')}
                    </span>
                    <p className="text-slate-200 font-medium">{bank.branchLocation}</p>
                  </div>

                  {/* SWIFT & Routing */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1 font-semibold">
                        <Globe className="w-3 h-3 text-indigo-400" />
                        {t('swiftCode')}
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-slate-200 font-bold">{bank.swiftCode}</span>
                        <button
                          onClick={() => handleCopy(bank.swiftCode, `${bank.id}_swift`)}
                          className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                        >
                          {copiedKey === `${bank.id}_swift` ? t('numberCopied') : t('copyNumber')}
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1 font-semibold">
                        <FileCode2 className="w-3 h-3 text-teal-400" />
                        {t('routingNumber')}
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-slate-200 font-bold">{bank.routingNumber}</span>
                        <button
                          onClick={() => handleCopy(bank.routingNumber, `${bank.id}_routing`)}
                          className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                        >
                          {copiedKey === `${bank.id}_routing` ? t('numberCopied') : t('copyNumber')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* THANK YOU CARD */}
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center space-y-2">
          <BadgeCheck className="w-6 h-6 text-amber-400 mx-auto" />
          <h4 className="text-sm font-bold text-amber-200">
            {languageCode === 'bn' ? 'কফি অফার ও সহযোগিতার জন্য অশেষ ধন্যবাদ!' : 'Thank you for your coffee support!'}
          </h4>
          <p className="text-xs text-slate-300">
            {languageCode === 'bn'
              ? 'আপনার প্রতিটি কফি অফার ও ভালোবাসা আমাদের WeatherGlobe অ্যাপটিকে আরও ভালো এবং ফ্রি রাখার জন্য কাজ করে যেতে অনুপ্রাণিত করে।'
              : 'Your coffee contribution inspires us to keep WeatherGlobe fast, free, and updated.'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => setActiveScreen('developer_info')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('developerTitle')}</span>
            </button>
            <button
              onClick={() => setActiveScreen('dashboard')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {t('backToHome')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
