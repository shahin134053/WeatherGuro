import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Luggage, MapPin, Sun, Umbrella, Sparkles, CheckCircle2, ShieldAlert, X } from 'lucide-react';

interface TouristDestination {
  id: string;
  name: string;
  nameBn: string;
  region: string;
  bestMonthsBn: string;
  clothingTipsBn: string;
  packingListBn: string[];
  safetyIndexPercent: number;
}

const TOURIST_DESTINATIONS: TouristDestination[] = [
  {
    id: 'sajek',
    name: 'Sajek Valley',
    nameBn: 'সাজেক ভ্যালি (মেঘের রাজ্য)',
    region: 'রাঙ্গামাটি পাহাড়ি অঞ্চল',
    bestMonthsBn: 'সেপ্টেম্বর থেকে মার্চ (শীত ও মেঘের মৌসুম)',
    clothingTipsBn: 'পাহাড়ের ওপর সকালে ও রাতে ভালো ঠান্ডা থাকে। জ্যাকেট বা উইন্ডব্রেকার সাথে রাখুন।',
    packingListBn: ['উইন্ডপ্রুফ জ্যাকেট', 'পাহাড়ি ট্রেকিং জুতো', 'পাওয়ার ব্যাংক', 'পরাসেটামল ও ফার্স্ট এইড'],
    safetyIndexPercent: 95,
  },
  {
    id: 'coxsbazar',
    name: "Cox's Bazar",
    nameBn: 'কক্সবাজার সমুদ্র সৈকত',
    region: 'চট্টগ্রাম উপকূল',
    bestMonthsBn: 'অক্টোবর থেকে এপ্রিল (স্বচ্ছ পানি ও শান্ত সমুদ্র)',
    clothingTipsBn: 'হালকা সুতির পোশাক, সানগ্লাস ও সানস্কিন লোশন ব্যবহার করুন।',
    packingListBn: ['সানগ্লাস ও হ্যাট', 'সানস্কিন এসপিএফ ৫০', 'সুইমস্যুট / হালকা পোশাক', 'ওয়াটারপ্রুফ ফোন ব্যাগ'],
    safetyIndexPercent: 92,
  },
  {
    id: 'sreemangal',
    name: 'Sreemangal',
    nameBn: 'শ্রীমঙ্গল চা বাগান ও লাউয়াছড়া',
    region: 'মৌলভীবাজার, সিলেট',
    bestMonthsBn: 'জুলাই থেকে মার্চ (চা বাগানের সবুজ রূপ ও পাখি দেখভাল)',
    clothingTipsBn: 'বনের ভেতর হাঁটার জন্য ফুল হাতা পোশাক ও আরামদায়ক ক্যাজুয়াল জুতো পরুন।',
    packingListBn: ['মশানিরোধক ক্রিম (Odomos)', 'হাঁটার রানিং শু', 'বৃষ্টির জন্য হালকা ছাতা', 'ক্যামেরা'],
    safetyIndexPercent: 98,
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans',
    nameBn: 'সুন্দরবন ম্যানগ্রোভ ফরেস্ট',
    region: 'খুলনা / বাগেরহাট',
    bestMonthsBn: 'নভেম্বর থেকে ফেব্রুয়ারি (হরিণ ও বাঘ দেখার সেরা সময়)',
    clothingTipsBn: 'হালকা সবুজ বা খাকি রঙের সুতির পোশাক পরুন (উজ্জ্বল রঙ বুনো প্রাণীকে চমকে দেয়)।',
    packingListBn: ['বাইনোকুলার (Binoculars)', 'ফ্ল্যাশলাইট', 'লাইফ জ্যাকেট', 'ফার্স্ট এইড ও ব্যাকআপ মেডিসিন'],
    safetyIndexPercent: 88,
  },
  {
    id: 'stmartins',
    name: "Saint Martin's Island",
    nameBn: 'সেন্টমার্টিন প্রবাল দ্বীপ',
    region: 'টেকনাফ, কক্সবাজার',
    bestMonthsBn: 'নভেম্বর থেকে মার্চ (জাহাজ চলাচল মৌসুম)',
    clothingTipsBn: 'হালকা সুতি সামুদ্রিক পোশাক ও বিচ স্যান্ডেল।',
    packingListBn: ['প্যাকেটজাত খাবার ও বিশুদ্ধ পানি', 'বিচ স্যান্ডেল', 'সানগ্লাস', 'পাওয়ার ব্যাংক'],
    safetyIndexPercent: 90,
  },
];

export const TouristTravelGuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { setSelectedLocation } = useApp();
  const [selectedSpotIdx, setSelectedSpotIdx] = useState<number>(0);

  if (!isOpen) return null;

  const spot = TOURIST_DESTINATIONS[selectedSpotIdx];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Luggage className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                পর্যটন আবহাওয়া ও ট্রাভেল প্যাকিং গাইড
              </h3>
              <p className="text-[10px] text-slate-500">ভ্রমণকারীদের জন্য প্রস্তুতি নির্দেশিকা</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spot Selection Selector */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
          {TOURIST_DESTINATIONS.map((dest, idx) => (
            <button
              key={dest.id}
              onClick={() => setSelectedSpotIdx(idx)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSpotIdx === idx
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {dest.name}
            </button>
          ))}
        </div>

        {/* Spot Details */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{spot.nameBn}</h4>
              <p className="text-[10px] text-slate-500">{spot.region}</p>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
              ভ্রমণ উপযোগী {spot.safetyIndexPercent}%
            </span>
          </div>

          <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
            <p className="text-[11px]">
              <strong>সেরা মৌসুম:</strong> {spot.bestMonthsBn}
            </p>
            <p className="text-[11px] bg-white/60 dark:bg-slate-800/60 p-2.5 rounded-xl border border-amber-500/20 leading-relaxed">
              <strong>পোশাকের পরামর্শ:</strong> {spot.clothingTipsBn}
            </p>
          </div>

          <div>
            <p className="font-bold text-slate-900 dark:text-white mb-1.5">সাথে যা রাখা জরুরি (Packing List):</p>
            <div className="grid grid-cols-2 gap-1.5">
              {spot.packingListBn.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button onClick={onClose} className="w-full py-2.5 rounded-2xl bg-teal-600 text-white font-bold text-xs cursor-pointer">
          বন্ধ করুন
        </button>
      </div>
    </div>
  );
};
