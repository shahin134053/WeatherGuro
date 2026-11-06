import { LocationItem } from '../types';

export interface DivisionDistricts {
  divisionNameEn: string;
  divisionNameBn: string;
  districts: LocationItem[];
}

export const BANGLADESH_DISTRICTS: DivisionDistricts[] = [
  {
    divisionNameEn: 'Dhaka Division',
    divisionNameBn: 'ঢাকা বিভাগ',
    districts: [
      { id: 'bd-dhaka', name: 'Dhaka', localName: 'ঢাকা', country: 'Bangladesh', countryCode: 'BD', lat: 23.8103, lng: 90.4125, admin1: 'Dhaka Division' },
      { id: 'bd-gazipur', name: 'Gazipur', localName: 'গাজীপুর', country: 'Bangladesh', countryCode: 'BD', lat: 24.0, lng: 90.42, admin1: 'Dhaka Division' },
      { id: 'bd-narayanganj', name: 'Narayanganj', localName: 'নারায়ণগঞ্জ', country: 'Bangladesh', countryCode: 'BD', lat: 23.6238, lng: 90.5, admin1: 'Dhaka Division' },
      { id: 'bd-tangail', name: 'Tangail', localName: 'টাঙ্গাইল', country: 'Bangladesh', countryCode: 'BD', lat: 24.2513, lng: 89.9167, admin1: 'Dhaka Division' },
      { id: 'bd-faridpur', name: 'Faridpur', localName: 'ফরিদপুর', country: 'Bangladesh', countryCode: 'BD', lat: 23.607, lng: 89.8429, admin1: 'Dhaka Division' },
      { id: 'bd-manikganj', name: 'Manikganj', localName: 'মানিকগঞ্জ', country: 'Bangladesh', countryCode: 'BD', lat: 23.8644, lng: 90.0047, admin1: 'Dhaka Division' },
      { id: 'bd-munshiganj', name: 'Munshiganj', localName: 'মুন্সীগঞ্জ', country: 'Bangladesh', countryCode: 'BD', lat: 23.5422, lng: 90.5305, admin1: 'Dhaka Division' },
      { id: 'bd-narsingdi', name: 'Narsingdi', localName: 'নরসিংদী', country: 'Bangladesh', countryCode: 'BD', lat: 23.9193, lng: 90.7176, admin1: 'Dhaka Division' },
      { id: 'bd-gopalganj', name: 'Gopalganj', localName: 'গোপালগঞ্জ', country: 'Bangladesh', countryCode: 'BD', lat: 23.0059, lng: 89.8266, admin1: 'Dhaka Division' },
      { id: 'bd-madaripur', name: 'Madaripur', localName: 'মাদারীপুর', country: 'Bangladesh', countryCode: 'BD', lat: 23.1641, lng: 90.1896, admin1: 'Dhaka Division' },
      { id: 'bd-rajbari', name: 'Rajbari', localName: 'রাজবাড়ী', country: 'Bangladesh', countryCode: 'BD', lat: 23.7574, lng: 89.6444, admin1: 'Dhaka Division' },
      { id: 'bd-shariatpur', name: 'Shariatpur', localName: 'শরীয়তপুর', country: 'Bangladesh', countryCode: 'BD', lat: 23.2423, lng: 90.4348, admin1: 'Dhaka Division' },
      { id: 'bd-kishoreganj', name: 'Kishoreganj', localName: 'কিশোরগঞ্জ', country: 'Bangladesh', countryCode: 'BD', lat: 24.4449, lng: 90.7765, admin1: 'Dhaka Division' },
    ],
  },
  {
    divisionNameEn: 'Chattogram Division',
    divisionNameBn: 'চট্টগ্রাম বিভাগ',
    districts: [
      { id: 'bd-chattogram', name: 'Chattogram', localName: 'চট্টগ্রাম', country: 'Bangladesh', countryCode: 'BD', lat: 22.3569, lng: 91.7832, admin1: 'Chattogram Division' },
      { id: 'bd-coxsbazar', name: "Cox's Bazar", localName: 'কক্সবাজার', country: 'Bangladesh', countryCode: 'BD', lat: 21.4272, lng: 92.0058, admin1: 'Chattogram Division' },
      { id: 'bd-cumilla', name: 'Cumilla', localName: 'কুমিল্লা', country: 'Bangladesh', countryCode: 'BD', lat: 23.4607, lng: 91.1809, admin1: 'Chattogram Division' },
      { id: 'bd-feni', name: 'Feni', localName: 'ফেনী', country: 'Bangladesh', countryCode: 'BD', lat: 23.0159, lng: 91.3976, admin1: 'Chattogram Division' },
      { id: 'bd-noakhali', name: 'Noakhali', localName: 'নোয়াখালী', country: 'Bangladesh', countryCode: 'BD', lat: 22.8695, lng: 91.0993, admin1: 'Chattogram Division' },
      { id: 'bd-lakshmipur', name: 'Lakshmipur', localName: 'লক্ষ্মীপুর', country: 'Bangladesh', countryCode: 'BD', lat: 22.9447, lng: 90.8282, admin1: 'Chattogram Division' },
      { id: 'bd-chandpur', name: 'Chandpur', localName: 'চাঁদপুর', country: 'Bangladesh', countryCode: 'BD', lat: 23.2332, lng: 90.6712, admin1: 'Chattogram Division' },
      { id: 'bd-brahmanbaria', name: 'Brahmanbaria', localName: 'ব্রাহ্মণবাড়িয়া', country: 'Bangladesh', countryCode: 'BD', lat: 23.957, lng: 91.1119, admin1: 'Chattogram Division' },
      { id: 'bd-rangamati', name: 'Rangamati', localName: 'রাঙ্গামাটি', country: 'Bangladesh', countryCode: 'BD', lat: 22.6533, lng: 92.1753, admin1: 'Chattogram Division' },
      { id: 'bd-bandarban', name: 'Bandarban', localName: 'বান্দরবান', country: 'Bangladesh', countryCode: 'BD', lat: 21.8311, lng: 92.3686, admin1: 'Chattogram Division' },
      { id: 'bd-khagrachhari', name: 'Khagrachhari', localName: 'খাগড়াছড়ি', country: 'Bangladesh', countryCode: 'BD', lat: 23.1192, lng: 91.9846, admin1: 'Chattogram Division' },
    ],
  },
  {
    divisionNameEn: 'Sylhet Division',
    divisionNameBn: 'সিলেট বিভাগ',
    districts: [
      { id: 'bd-sylhet', name: 'Sylhet', localName: 'সিলেট', country: 'Bangladesh', countryCode: 'BD', lat: 24.8949, lng: 91.8687, admin1: 'Sylhet Division' },
      { id: 'bd-moulvibazar', name: 'Moulvibazar', localName: 'মৌলভীবাজার', country: 'Bangladesh', countryCode: 'BD', lat: 24.4829, lng: 91.7774, admin1: 'Sylhet Division' },
      { id: 'bd-habiganj', name: 'Habiganj', localName: 'হবিগঞ্জ', country: 'Bangladesh', countryCode: 'BD', lat: 24.3749, lng: 91.4155, admin1: 'Sylhet Division' },
      { id: 'bd-sunamganj', name: 'Sunamganj', localName: 'সুনামগঞ্জ', country: 'Bangladesh', countryCode: 'BD', lat: 25.0658, lng: 91.395, admin1: 'Sylhet Division' },
    ],
  },
  {
    divisionNameEn: 'Rajshahi Division',
    divisionNameBn: 'রাজশাহী বিভাগ',
    districts: [
      { id: 'bd-rajshahi', name: 'Rajshahi', localName: 'রাজশাহী', country: 'Bangladesh', countryCode: 'BD', lat: 24.3745, lng: 88.6042, admin1: 'Rajshahi Division' },
      { id: 'bd-bogra', name: 'Bogra', localName: 'বগুড়া', country: 'Bangladesh', countryCode: 'BD', lat: 24.8481, lng: 89.373, admin1: 'Rajshahi Division' },
      { id: 'bd-pabna', name: 'Pabna', localName: 'পাবনা', country: 'Bangladesh', countryCode: 'BD', lat: 24.0108, lng: 89.2331, admin1: 'Rajshahi Division' },
      { id: 'bd-sirajganj', name: 'Sirajganj', localName: 'সিরাজগঞ্জ', country: 'Bangladesh', countryCode: 'BD', lat: 24.4534, lng: 89.7008, admin1: 'Rajshahi Division' },
      { id: 'bd-naogaon', name: 'Naogaon', localName: 'নওগাঁ', country: 'Bangladesh', countryCode: 'BD', lat: 24.7936, lng: 88.9318, admin1: 'Rajshahi Division' },
      { id: 'bd-natore', name: 'Natore', localName: 'নাটোর', country: 'Bangladesh', countryCode: 'BD', lat: 24.4206, lng: 89.0003, admin1: 'Rajshahi Division' },
      { id: 'bd-chapainawabganj', name: 'Chapainawabganj', localName: 'চাঁপাইনবাবগঞ্জ', country: 'Bangladesh', countryCode: 'BD', lat: 24.5965, lng: 88.2775, admin1: 'Rajshahi Division' },
      { id: 'bd-joypurhat', name: 'Joypurhat', localName: 'জয়পুরহাট', country: 'Bangladesh', countryCode: 'BD', lat: 25.1018, lng: 89.028, admin1: 'Rajshahi Division' },
    ],
  },
  {
    divisionNameEn: 'Khulna Division',
    divisionNameBn: 'খুলনা বিভাগ',
    districts: [
      { id: 'bd-khulna', name: 'Khulna', localName: 'খুলনা', country: 'Bangladesh', countryCode: 'BD', lat: 22.8456, lng: 89.5403, admin1: 'Khulna Division' },
      { id: 'bd-jessore', name: 'Jashore', localName: 'যশোর', country: 'Bangladesh', countryCode: 'BD', lat: 23.1664, lng: 89.2081, admin1: 'Khulna Division' },
      { id: 'bd-kushtia', name: 'Kushtia', localName: 'কুষ্টিয়া', country: 'Bangladesh', countryCode: 'BD', lat: 23.9013, lng: 89.1204, admin1: 'Khulna Division' },
      { id: 'bd-satkhira', name: 'Satkhira', localName: 'সাতক্ষীরা', country: 'Bangladesh', countryCode: 'BD', lat: 22.7185, lng: 89.0705, admin1: 'Khulna Division' },
      { id: 'bd-bagerhat', name: 'Bagerhat', localName: 'বাগেরহাট', country: 'Bangladesh', countryCode: 'BD', lat: 22.6516, lng: 89.7859, admin1: 'Khulna Division' },
      { id: 'bd-jhenaidah', name: 'Jhenaidah', localName: 'ঝিনাইদহ', country: 'Bangladesh', countryCode: 'BD', lat: 23.5448, lng: 89.1539, admin1: 'Khulna Division' },
      { id: 'bd-chuadanga', name: 'Chuadanga', localName: 'চুয়াডাঙ্গা', country: 'Bangladesh', countryCode: 'BD', lat: 23.6402, lng: 88.8418, admin1: 'Khulna Division' },
      { id: 'bd-meherpur', name: 'Meherpur', localName: 'মেহেরপুর', country: 'Bangladesh', countryCode: 'BD', lat: 23.7622, lng: 88.6318, admin1: 'Khulna Division' },
      { id: 'bd-narail', name: 'Narail', localName: 'নড়াইল', country: 'Bangladesh', countryCode: 'BD', lat: 23.1725, lng: 89.5127, admin1: 'Khulna Division' },
      { id: 'bd-magura', name: 'Magura', localName: 'মাগুরা', country: 'Bangladesh', countryCode: 'BD', lat: 23.4873, lng: 89.4199, admin1: 'Khulna Division' },
    ],
  },
  {
    divisionNameEn: 'Barishal Division',
    divisionNameBn: 'বরিশাল বিভাগ',
    districts: [
      { id: 'bd-barishal', name: 'Barishal', localName: 'বরিশাল', country: 'Bangladesh', countryCode: 'BD', lat: 22.701, lng: 90.3535, admin1: 'Barishal Division' },
      { id: 'bd-patuakhali', name: 'Patuakhali', localName: 'পটুয়াখালী', country: 'Bangladesh', countryCode: 'BD', lat: 22.3596, lng: 90.3299, admin1: 'Barishal Division' },
      { id: 'bd-bhola', name: 'Bhola', localName: 'ভোলা', country: 'Bangladesh', countryCode: 'BD', lat: 22.6859, lng: 90.6481, admin1: 'Barishal Division' },
      { id: 'bd-pirojpur', name: 'Pirojpur', localName: 'পিরোজপুর', country: 'Bangladesh', countryCode: 'BD', lat: 22.5841, lng: 89.972, admin1: 'Barishal Division' },
      { id: 'bd-jhalokati', name: 'Jhalokati', localName: 'ঝালকাঠি', country: 'Bangladesh', countryCode: 'BD', lat: 22.6406, lng: 90.1987, admin1: 'Barishal Division' },
      { id: 'bd-barguna', name: 'Barguna', localName: 'বরগুনা', country: 'Bangladesh', countryCode: 'BD', lat: 22.1528, lng: 90.1259, admin1: 'Barishal Division' },
    ],
  },
  {
    divisionNameEn: 'Rangpur Division',
    divisionNameBn: 'রংপুর বিভাগ',
    districts: [
      { id: 'bd-rangpur', name: 'Rangpur', localName: 'রংপুর', country: 'Bangladesh', countryCode: 'BD', lat: 25.7439, lng: 89.2752, admin1: 'Rangpur Division' },
      { id: 'bd-dinajpur', name: 'Dinajpur', localName: 'দিনাজপুর', country: 'Bangladesh', countryCode: 'BD', lat: 25.6217, lng: 88.6355, admin1: 'Rangpur Division' },
      { id: 'bd-kurigram', name: 'Kurigram', localName: 'কুড়িগ্রাম', country: 'Bangladesh', countryCode: 'BD', lat: 25.8054, lng: 89.6361, admin1: 'Rangpur Division' },
      { id: 'bd-gaibandha', name: 'Gaibandha', localName: 'গাইবান্ধা', country: 'Bangladesh', countryCode: 'BD', lat: 25.3288, lng: 89.5403, admin1: 'Rangpur Division' },
      { id: 'bd-nilphamari', name: 'Nilphamari', localName: 'নীলফামারী', country: 'Bangladesh', countryCode: 'BD', lat: 25.9318, lng: 88.856, admin1: 'Rangpur Division' },
      { id: 'bd-panchagarh', name: 'Panchagarh', localName: 'পঞ্চগড়', country: 'Bangladesh', countryCode: 'BD', lat: 26.3411, lng: 88.5542, admin1: 'Rangpur Division' },
      { id: 'bd-thakurgaon', name: 'Thakurgaon', localName: 'ঠাকুরগাঁও', country: 'Bangladesh', countryCode: 'BD', lat: 26.0337, lng: 88.4617, admin1: 'Rangpur Division' },
      { id: 'bd-lalmonirhat', name: 'Lalmonirhat', localName: 'লালমনিরহাট', country: 'Bangladesh', countryCode: 'BD', lat: 25.9165, lng: 89.4532, admin1: 'Rangpur Division' },
    ],
  },
  {
    divisionNameEn: 'Mymensingh Division',
    divisionNameBn: 'ময়মনসিংহ বিভাগ',
    districts: [
      { id: 'bd-mymensingh', name: 'Mymensingh', localName: 'ময়মনসিংহ', country: 'Bangladesh', countryCode: 'BD', lat: 24.7471, lng: 90.4203, admin1: 'Mymensingh Division' },
      { id: 'bd-jamalpur', name: 'Jamalpur', localName: 'জামালপুর', country: 'Bangladesh', countryCode: 'BD', lat: 24.9375, lng: 89.9378, admin1: 'Mymensingh Division' },
      { id: 'bd-netrokona', name: 'Netrokona', localName: 'নেত্রকোণা', country: 'Bangladesh', countryCode: 'BD', lat: 24.8709, lng: 90.7279, admin1: 'Mymensingh Division' },
      { id: 'bd-sherpur', name: 'Sherpur', localName: 'শেরপুর', country: 'Bangladesh', countryCode: 'BD', lat: 25.0205, lng: 90.0153, admin1: 'Mymensingh Division' },
    ],
  },
];
