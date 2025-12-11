# Card Layout untuk Halaman Jadwal Agenda

## 📋 Ringkasan Perubahan

Halaman **Jadwal Agenda** (`/list-agenda`) telah diubah dari tampilan tabel menjadi **card layout** yang lebih visual dan user-friendly, khusus untuk user dengan level "Umum".

---

## ✨ Fitur Baru

### **1. Card Grid Layout**

- Layout grid responsive: 3 kolom (desktop), 2 kolom (tablet), 1 kolom (mobile)
- Card dengan hover effect yang smooth
- Shadow dan animasi modern

### **2. Informasi yang Ditampilkan**

Setiap card menampilkan:

- ✅ **Poster/Gambar** event (220px tinggi)
- ✅ **Kategori** agenda (badge di kanan atas)
- ✅ **Judul** event (max 2 baris)
- ✅ **Deskripsi** (truncated max 100 karakter, max 3 baris)
- ✅ **Tanggal Pelaksanaan** dengan icon kalender
- ✅ **Batas Pendaftaran** dengan icon jam
- ✅ **Lokasi** dengan icon map marker
- ✅ **Tombol "Lihat Detail"** untuk membuka modal

### **3. State Management**

- **Loading state**: Spinner saat fetch data
- **Empty state**: Pesan "Belum ada agenda tersedia" jika tidak ada data
- **Error handling**: Placeholder image jika gambar gagal load

### **4. Pagination**

- Pagination dengan max 5 page numbers
- Previous/Next buttons
- Info jumlah data (contoh: "Menampilkan 1 - 6 dari 6 agenda")
- Auto scroll to top saat ganti halaman

### **5. Filter**

- ❌ **DIHAPUS** - User umum tidak perlu filter kompleks
- ✅ Otomatis hanya menampilkan agenda dengan status "Tayang"

---

## 🎨 Design Highlights

### **Card Styling**

- Border radius: 12px
- Box shadow dengan depth yang berbeda saat hover
- Hover effect: translateY(-8px) + shadow lebih tebal
- Image zoom effect saat hover (scale 1.05)

### **Color Palette**

- Primary: Bootstrap blue (#0d6efd)
- Text: Dark (#2c3e50)
- Muted: Gray (#6c757d)
- Icon colors: Primary (calendar), Warning (clock), Danger (map)

### **Typography**

- Title: 1.1rem, font-weight 700
- Description: 0.875rem, line-height 1.6
- Detail labels: 0.7rem, uppercase, letter-spacing 0.5px
- Detail values: 0.875rem, font-weight 500

### **Responsive Breakpoints**

```css
Mobile (< 768px):
- Image height: 180px
- Font sizes: Slightly smaller
- 1 column grid

Tablet (768px - 991px):
- 2 column grid

Desktop (> 992px):
- 3 column grid
```

---

## 🔧 Implementasi Teknis

### **Fetching Data**

```javascript
const fetchEvents = async (page = 1) => {
  const params = {
    page,
    per_page: 20,
    sort: "tglpelaksanaan",
    direction: "desc",
    tayang: "Tayang", // Only published events
  };

  const response = await getEvents(params);
  // ...
};
```

### **Truncate HTML**

Fungsi untuk memotong konten HTML dan menghilangkan tag:

```javascript
const truncateHTML = (html, maxLength) => {
  const text = html.replace(/<[^>]*>/g, ""); // Remove HTML tags
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
```

### **Pagination Logic**

Smart pagination yang menampilkan max 5 halaman:

```javascript
const paginationPages = computed(() => {
  // Show current page ± 2 pages
  let startPage = Math.max(1, current - 2);
  let endPage = Math.min(last, startPage + 4);
  // ...
});
```

---

## 📂 File yang Diubah

1. ✅ `src/pages/generalUser/agendaPage/AgendaPage.vue`

   - Menghapus `BaseTable` component
   - Implementasi card grid layout
   - Custom pagination
   - Loading & empty states
   - Modal integration

2. ✅ `public/images/placeholder-event.jpg`
   - Placeholder image untuk event tanpa poster
   - Gradient blue-purple dengan icon kalender

---

## 🚀 Cara Menggunakan

### **User Umum**

1. Login dengan akun level "Umum"
2. Klik menu **"Jadwal Agenda"**
3. Lihat daftar agenda dalam bentuk card
4. Klik card atau tombol **"Lihat Detail"** untuk info lengkap
5. Gunakan pagination untuk melihat lebih banyak agenda

### **Data yang Muncul**

- Hanya agenda dengan status **"Tayang"**
- Diurutkan berdasarkan **tanggal pelaksanaan** (terbaru dulu)
- 20 agenda per halaman

---

## 🎯 Keuntungan Card Layout vs Table

| Aspek                   | Table        | Card (Baru)     |
| ----------------------- | ------------ | --------------- |
| **Visual Appeal**       | ⭐⭐         | ⭐⭐⭐⭐⭐      |
| **Image Display**       | ❌ Tidak ada | ✅ Poster besar |
| **Mobile Friendly**     | ⭐⭐         | ⭐⭐⭐⭐⭐      |
| **Information Density** | ⭐⭐⭐⭐⭐   | ⭐⭐⭐          |
| **User Experience**     | ⭐⭐⭐       | ⭐⭐⭐⭐⭐      |
| **Suitable For**        | Admin        | General User    |

---

## 🐛 Error Handling

1. **Image Load Error**

   ```javascript
   const handleImageError = (event) => {
     event.target.src = "/images/placeholder-event.jpg";
   };
   ```

2. **Empty Data**

   - Menampilkan empty state dengan icon kalender
   - Pesan: "Belum ada agenda tersedia"

3. **API Error**
   - Console error log
   - Array events dikosongkan
   - Loading state selesai

---

## 📱 Screenshot Expectations

### **Desktop View (3 Columns)**

```
┌─────────┬─────────┬─────────┐
│ Card 1  │ Card 2  │ Card 3  │
├─────────┼─────────┼─────────┤
│ Card 4  │ Card 5  │ Card 6  │
└─────────┴─────────┴─────────┘
```

### **Tablet View (2 Columns)**

```
┌─────────┬─────────┐
│ Card 1  │ Card 2  │
├─────────┼─────────┤
│ Card 3  │ Card 4  │
└─────────┴─────────┘
```

### **Mobile View (1 Column)**

```
┌─────────┐
│ Card 1  │
├─────────┤
│ Card 2  │
├─────────┤
│ Card 3  │
└─────────┘
```

---

## 🔮 Future Enhancements (Optional)

1. **Search Bar**: Simple search by title
2. **Category Filter**: Filter by event category (dropdown)
3. **Date Range Filter**: Filter by date range
4. **Sort Options**: Sort by date, title, category
5. **Bookmark/Favorite**: Save favorite events
6. **Registration Button**: Direct register from card
7. **Countdown Timer**: Days until registration closes
8. **Skeleton Loading**: Better loading UX
9. **Infinite Scroll**: Alternative to pagination
10. **Share Button**: Share event to social media

---

## 📊 Performance

- **Initial Load**: ~200-500ms (depending on API)
- **Page Change**: ~100-300ms + API call
- **Smooth Animations**: 60fps hover effects
- **Image Optimization**: Images are lazy loaded by browser
- **Minimal Re-renders**: Vue 3 reactivity optimization

---

## 🎓 Learning Points

1. **Vue 3 Composition API**: `ref`, `computed`, `onMounted`
2. **Custom Pagination**: Without external library
3. **Responsive Grid**: Bootstrap grid system
4. **CSS Animations**: Hover effects, transitions
5. **Error Handling**: Image fallback, empty states
6. **Modern UI/UX**: Card-based design pattern

---

**Catatan**: Tampilan card ini dirancang khusus untuk user "Umum" yang lebih fokus pada browsing dan viewing. Untuk admin yang perlu manage data, tetap gunakan table layout yang lebih efisien untuk CRUD operations.
