# Panduan Pembaruan dan Deployment Aplikasi

Dokumen ini menjelaskan alur kerja untuk mengunggah pembaruan kode ke repositori GitHub dan melihat hasilnya di URL pratinjau sebelum dirilis ke versi live.

## Alur Kerja Setiap Kali Ada Pembaruan

Ikuti langkah-langkah ini setiap kali Anda ingin memperbarui aplikasi Anda.

### Langkah 1: Siapkan Branch Baru

Selalu mulai dengan membuat "cabang" (branch) baru untuk setiap fitur atau perbaikan. Ini menjaga riwayat kerja Anda tetap rapi.

```bash
# 1. Pastikan Anda berada di branch 'main' dan ambil versi terbaru
git checkout main
git pull origin main

# 2. Buat branch baru yang deskriptif
git checkout -b nama-branch-baru-anda
```
**Contoh nama branch:** `git checkout -b perbaikan-tampilan-struk`

---

### Langkah 2: Simpan Perubahan (Commit)

Setelah kode diubah (misalnya, setelah saya membantu Anda), simpan perubahan tersebut ke dalam branch baru Anda.

```bash
# 1. Tambahkan semua file yang berubah
git add .

# 2. Simpan dengan pesan yang jelas tentang apa yang Anda ubah
git commit -m "feat: Memperbaiki perataan pada struk cetak"
```
> **Tips:** Awali pesan commit dengan `feat:` untuk fitur baru, atau `fix:` untuk perbaikan bug.

---

### Langkah 3: Unggah (Push) ke GitHub

Kirim branch baru Anda beserta perubahannya ke repositori di GitHub.

```bash
# Ganti 'nama-branch-baru-anda' dengan nama branch yang Anda buat
git push -u origin nama-branch-baru-anda
```

---

### Langkah 4: Buat Pull Request (PR) & Lihat Pratinjau

Setelah `git push` berhasil, proses selanjutnya terjadi di situs web GitHub.

1.  **Buka Repositori Anda:** Buka halaman repositori Anda di browser (misal: `https://github.com/username/nama-repo`).
2.  **Buat Pull Request:** Anda akan melihat notifikasi berwarna kuning dengan tombol **"Compare & pull request"**. Klik tombol tersebut.
3.  **Beri Judul dan Deskripsi:** Tulis judul yang jelas untuk Pull Request Anda, lalu klik **"Create pull request"**.

**Selesai! Sistem Otomatis Mengambil Alih:**

*   **Deployment Pratinjau:** GitHub Actions akan secara otomatis men-deploy perubahan Anda ke sebuah **URL pratinjau**.
*   **Dapatkan Link:** Tunggu beberapa menit. Sebuah bot Firebase akan menambahkan komentar di halaman Pull Request Anda yang berisi **link ke URL pratinjau**.
*   **Tinjau Perubahan:** Klik link tersebut untuk melihat dan menguji perubahan Anda secara langsung tanpa mempengaruhi situs utama Anda.

Jika Anda puas dengan pratinjaunya, Anda bisa menggabungkan (merge) Pull Request tersebut di GitHub.
