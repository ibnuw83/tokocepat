# Panduan Mengunggah Pembaruan ke GitHub

Ikuti tiga langkah sederhana ini setiap kali Anda ingin menyimpan dan mengunggah pembaruan kode ke repositori GitHub Anda. Jalankan semua perintah ini dari dalam folder proyek Anda.

---

### Langkah 1: Daftarkan Semua Perubahan (`git add`)

Perintah ini "mendaftarkan" semua file yang baru saja diubah agar siap untuk disimpan. Tanda titik (`.`) berarti "semua file di folder ini".

```bash
git add .
```

---

### Langkah 2: Beri Keterangan pada Perubahan Anda (`git commit`)

Perintah ini "menyimpan" perubahan yang sudah Anda daftarkan. Anda **wajib** memberikan pesan singkat (menggunakan `-m`) untuk menjelaskan apa yang Anda ubah. Ini sangat penting untuk melacak riwayat.

**Contoh pesan:**
```bash
git commit -m "Memperbaiki tampilan struk agar rata kanan-kiri"
```
*(Ganti pesan di dalam tanda kutip sesuai dengan perubahan yang Anda buat).*

---

### Langkah 3: Unggah Perubahan ke GitHub (`git push`)

Perintah ini mengambil perubahan yang sudah Anda "simpan" di komputer lokal dan mengunggahnya ke repositori Anda di server GitHub.

```bash
git push
```

---

**Selesai!** Perubahan Anda kini sudah ada di GitHub dan proses otomatis akan berjalan jika sudah diatur.
