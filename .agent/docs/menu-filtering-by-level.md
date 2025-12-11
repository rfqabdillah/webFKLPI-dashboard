# Dokumentasi Sistem Menu Berdasarkan Level User

## 📋 Ringkasan Perubahan

Sistem filtering menu telah diubah dari berdasarkan `idjenispengguna` (ID Jenis Pengguna) menjadi **berdasarkan `idlevel` (ID Level User)** agar konsisten dengan sistem layout yang ada di `body.vue`.

---

## 🔑 Konstanta Penting

### ID Level "Umum"

```
01729723-6880-4c3c-ab67-d7f3a4424482
```

**Lokasi konstanta:**

- `src/store/modules/menu.js` (line 5) - untuk filtering menu
- `src/components/body.vue` (line 60) - untuk layout

---

## 🎯 Aturan Filtering Menu

### **User dengan Level "Umum" (ID: 01729723-6880-4c3c-ab67-d7f3a4424482)**

**Mode:** WHITELIST (hanya tampilkan menu yang eksplisit diizinkan)

**Menu yang DITAMPILKAN:**

1. ✅ **Profil Saya** (`/my-profile`)
2. ✅ **Jadwal Agenda** (`/list-agenda`)
3. ✅ **Agenda Saya** (`/my-agenda`)

**Menu yang DISEMBUNYIKAN:**

- ❌ Semua headTitle (General, Referensi)
- ❌ Beranda
- ❌ Kepegawaian
- ❌ Agenda (Admin)
- ❌ Website
- ❌ Referensi (Umum & Kepegawaian)

**Layout:** Horizontal (LosAngeles) - topbar style

---

### **User dengan Level Lainnya (Admin, Operator, dll.)**

**Mode:** BLACKLIST (tampilkan semua kecuali yang dilarang)

**Menu yang DITAMPILKAN:**

- ✅ Semua headTitle (General, Referensi)
- ✅ Beranda
- ✅ Kepegawaian
- ✅ Agenda (Admin) - Daftar Kegiatan & Kategori
- ✅ Website (semua submenu)
- ✅ Referensi (semua submenu)

**Menu yang DISEMBUNYIKAN:**

- ❌ Profil Saya (khusus untuk user Umum)
- ❌ Jadwal Agenda (khusus untuk user Umum)
- ❌ Agenda Saya (khusus untuk user Umum)

**Layout:** Vertical (Dubai) - sidebar style

---

## 📝 Cara Kerja Sistem

### 1. Saat Loading Aplikasi

```javascript
// Di menu.js (line 71-73)
const userLevel = getCurrentUserLevel(); // Ambil idlevel dari localStorage
const filteredMenuData = filterMenuByLevel(menuItems.data, userLevel); // Filter menu
```

### 2. Fungsi `getCurrentUserLevel()`

Mengambil `id_level` dari localStorage dengan mencari di 2 lokasi:

```javascript
userData.data[0].id_level; // Lokasi 1: Direct property
userData.data[0].roles.id_level; // Lokasi 2: Dalam object roles
```

### 3. Fungsi `filterMenuByLevel()`

**Untuk user "Umum":**

```javascript
if (isUmumUser) {
  // Hanya tampilkan menu yang punya allowedLevels dengan ID "Umum"
  return item.allowedLevels.includes(UMUM_LEVEL_ID);
}
```

**Untuk user lainnya:**

```javascript
else {
  // Tampilkan semua menu KECUALI yang punya allowedLevels tapi tidak include ID user
  if (item.allowedLevels && !item.allowedLevels.includes(userLevel)) {
    return false; // Sembunyikan menu khusus level lain
  }
  return true; // Tampilkan menu umum
}
```

---

## 🔧 Cara Menambahkan Menu Baru

### Menu Khusus untuk Level Tertentu

```javascript
{
  "title": "Menu Khusus",
  "icon": "stroke-icon",
  "type": "link",
  "path": "/special-menu",
  "active": false,
  "allowedLevels": ["01729723-6880-4c3c-ab67-d7f3a4424482"] // Hanya untuk Umum
}
```

### Menu untuk Semua Level (Tanpa Pembatasan)

```javascript
{
  "title": "Menu Umum",
  "icon": "stroke-icon",
  "type": "link",
  "path": "/public-menu",
  "active": false
  // TIDAK ADA allowedLevels = tampil untuk semua level kecuali Umum
}
```

### Menu untuk Multiple Levels

```javascript
{
  "title": "Menu Multi Level",
  "icon": "stroke-icon",
  "type": "link",
  "path": "/multi-menu",
  "active": false,
  "allowedLevels": [
    "01729723-6880-4c3c-ab67-d7f3a4424482", // Umum
    "id-level-admin",                        // Admin
    "id-level-operator"                      // Operator
  ]
}
```

---

## 🧪 Testing

### Test User "Umum"

1. Login dengan user yang memiliki `idlevel` = `01729723-6880-4c3c-ab67-d7f3a4424482`
2. **Expected:** Hanya melihat 3 menu (Profil Saya, Jadwal Agenda, Agenda Saya)
3. **Expected:** Layout horizontal (topbar)
4. **Expected:** Tidak ada headTitle "General" atau "Referensi"

### Test User Admin/Operator

1. Login dengan user yang memiliki `idlevel` selain ID Umum
2. **Expected:** Melihat semua menu kecuali menu khusus Umum
3. **Expected:** Layout vertical (sidebar)
4. **Expected:** Ada headTitle "General" dan "Referensi"

---

## 📂 File yang Diubah

1. ✅ `src/store/modules/menu.js`

   - Konstanta: `NON_ASN_JENISPENGGUNA_ID` → `UMUM_LEVEL_ID`
   - Function: `getCurrentUserJenisPengguna()` → `getCurrentUserLevel()`
   - Function: `filterMenuByJenisPengguna()` → `filterMenuByLevel()`
   - Getter: `isNonAsnUser` → `isUmumUser`

2. ✅ `src/data/menu.js`
   - Menu "Profil Saya": `allowedJenisPengguna` → `allowedLevels`
   - Menu "Jadwal Agenda": `allowedJenisPengguna` → `allowedLevels`
   - Menu "Agenda Saya": `allowedJenisPengguna` → `allowedLevels`
   - Nilai ID diganti dari ID jenis pengguna ke ID level "Umum"

---

## 🚨 Catatan Penting

1. **Konsistensi ID**: Pastikan user dengan level "Umum" di database memiliki `idlevel` = `01729723-6880-4c3c-ab67-d7f3a4424482`

2. **localStorage Structure**: Sistem mengharapkan struktur:

   ```javascript
   {
     data: [
       {
         id_level: "...", // Atau
         roles: {
           id_level: "...",
         },
       },
     ];
   }
   ```

3. **Reload Required**: Jika mengubah menu.js atau struktur allowedLevels, user harus login ulang atau clear cache

4. **Future Enhancement**: Jika ingin kombinasi filtering (berdasarkan level DAN jenis pengguna), tambahkan logika di `filterMenuByLevel()`

---

## 📊 Mapping Level vs Jenis Pengguna (Referensi)

| Level    | ID Level                               | Jenis Pengguna | ID Jenis Pengguna                      |
| -------- | -------------------------------------- | -------------- | -------------------------------------- |
| Umum     | `01729723-6880-4c3c-ab67-d7f3a4424482` | Non-ASN        | `7563d021-664d-4cd9-87d7-82cb3440664f` |
| Admin    | (ID lain)                              | ASN            | (ID lain)                              |
| Operator | (ID lain)                              | ASN            | (ID lain)                              |

**Sistem saat ini:** Filtering berdasarkan **ID Level** saja.
