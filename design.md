# Design Specification: Weather Dashboard App

## 1. Konsep Visual & Tema
Desain ini mengusung tema **Modern, Minimalist, dan Immersive**. Fokus utama adalah memberikan pengalaman visual yang memukau bagi pengguna melalui latar belakang (background) yang merespons kondisi cuaca secara *real-time*. Antarmuka pengguna (UI) menggunakan *glassmorphism* atau panel transparan gelap/terang agar teks tetap terbaca tanpa menutupi keindahan gambar latar belakang.

## 2. Dynamic Background Strategy (Strategi Background Fleksibel)
Untuk menjawab kebutuhan *background* yang berubah sesuai kondisi cuaca, pendekatan yang paling fleksibel dan *scalable* adalah menggunakan **CSS Classes yang dikontrol oleh React State** atau sebuah **Komponen `<WeatherBackground />` Terpisah**.

### Mengapa ini fleksibel?
1. **Pemisahan Logika & UI:** Kita bisa memetakan kode cuaca (dari Weather API) ke kategori cuaca umum (misal: `clear-day`, `clear-night`, `rainy`, `cloudy`, `snowy`).
2. **Mudah Diubah:** Kita bisa memulai dengan CSS Gradients (lebih ringan), lalu perlahan beralih menggunakan gambar (Images) berkualitas tinggi, atau bahkan animasi ringan (CSS/Canvas/Video) tanpa mengubah struktur layout utama.
3. **Performa:** Menggunakan CSS untuk *background transitions* memberikan transisi yang sangat mulus (smooth) saat pengguna berganti kota favorit.

**Contoh Mapping:**
- `Clear (Siang)` -> Latar belakang pemandangan cerah, gradient biru muda ke oranye senja (seperti referensi).
- `Cloudy/Overcast` -> Gradient abu-abu yang lebih redup.
- `Rain` -> Latar belakang gelap kebiruan dengan efek *overlay* rintik hujan.
- `Night` -> Gradient biru tua ke hitam dengan aksen bintang.

## 3. Palet Warna (Color Palette)
Karena latar belakang akan dinamis, warna UI komponen harus netral dan memiliki kontras yang baik.

- **Teks Utama (Primary Text):** `#FFFFFF` (Putih) untuk keterbacaan di atas latar belakang dinamis.
- **Teks Sekunder (Secondary Text):** `#E2E8F0` (Slate-200) atau `#CBD5E1` (Slate-300) dengan opacity 70%-80%.
- **Aksen (Accent/Highlight):** Warna kuning hangat seperti `#FBBF24` (Amber-400) untuk ikon matahari, suhu utama, atau indikator tab aktif (seperti garis bawah kuning di menu "TODAY").
- **Panel/Card Background:** Menggunakan efek *Glassmorphism*. 
  - Latar: `#000000` (Hitam) atau `#1E293B` (Slate-800) dengan `opacity` 20% - 40%.
  - Efek: `backdrop-blur-md` (blur efek kaca).

## 4. Tipografi (Typography)
- **Font Family Utama:** *Inter*, *Roboto*, atau *Outfit* (Sans-Serif, Modern).
- **Hirarki:**
  - **Suhu Utama (Hero Temp):** Sangat besar (misal: `7rem` atau `text-8xl`), Font-weight: Bold.
  - **Judul/Waktu:** Sedang (`text-xl` atau `text-2xl`), Font-weight: Medium/Semibold.
  - **Label Detail:** Kecil (`text-sm`), Uppercase, letter-spacing lebar (`tracking-wider`).

## 5. Tata Letak & Komponen (Layout & Components)
Sesuai referensi gambar dan PRD, layout akan dibagi menjadi 3 bagian utama:

### A. Header (Top Navigation)
- **Kiri:** Logo App ("SYNOPTIC" / Nama App Anda), Ikon Lokasi + Teks Kota & Negara Bagian.
- **Tengah:** Toggle Suhu (°C | °F).
- **Kanan:** Pilihan Bahasa (opsional) dan Ikon Menu (Hamburger) untuk mengakses "Change Location" atau "Saved Locations".

### B. Main Content (Hero Section)
Dibagi menjadi 3 kolom/area di desktop (berubah menjadi stack vertikal di mobile):
1. **Summary Info (Kiri):**
   - Ikon cuaca besar.
   - Tanggal & Waktu.
   - Suhu Utama (e.g., +22°C).
   - "Feels like" & Deskripsi Singkat.
   - Waktu Sunrise & Sunset.
2. **More Details (Tengah):**
   - Panel transparan berisi list metrik: Wind Speed, Humidity, Pressure, Precipitation Probability, UV Index.
3. **Hourly Forecast (Kanan):**
   - Card/Panel transparan dengan sistem grid/flex horizontal.
   - Menampilkan prakiraan per segmen waktu (NIGHT, MORNING, DAY, EVENING) atau scrollable 24 jam ke depan.

### C. Bottom Section (Daily Forecast)
- **Tab Navigation:** "TODAY" dan "SHOW FOR 10 DAYS" (Atau 5 Days sesuai PRD).
- **List Hari:** Horizontal row menampilkan nama hari, suhu min/max, ikon cuaca, dan deskripsi singkat (Cloudy, Sunny). Di mobile, ini bisa menjadi list vertikal (satu hari per baris).

## 6. Responsiveness (Mobile-First)
- **Desktop:** Layout seperti referensi, lebar penuh, memanfaatkan ruang horisontal.
- **Tablet/Mobile:** 
  - Header tetap di atas.
  - Hero Section menjadi satu kolom bertumpuk (Summary di atas, Details di tengah, Hourly di bawah).
  - Bottom Section (Daily Forecast) menjadi *horizontal swipe* atau list vertikal agar mudah dibaca di layar HP.
  - Panel transparan akan dibuat lebih penuh (*full width*) dengan margin kecil.

## 7. Interaksi & Animasi (Micro-interactions)
- Transisi halus (fade in/out) saat data *loading* (mengurangi kedipan layar).
- Efek *hover* pada daftar hari atau lokasi favorit (sedikit terangkat atau tambah terang).
- *Smooth crossfade* saat latar belakang berganti (ketika user pindah kota atau kondisi cuaca berubah).
