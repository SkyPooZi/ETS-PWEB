# PROSES
 
## 1. Persona dan masalahnya
 
Persona saya adalah **ibu rumah tangga**. dia membagi uang belanja bulanan ke beberapa "amplop" (misalnya belanja dapur, listrik dan air, serta sekolah anak) di awal bulan. Masalahnya, dia kesulitan dalam memantau sisa uang di tiap amplop dan sering mendapatkan uang di amplop itu kosong. 
 
## 2. Rancangan struktur data
 
Data disimpan di localStorage dengan dua kunci, keduanya berupa array objek yang di-`JSON.stringify()`.
 
**Kunci `transaksi`**
```js
{
  id: 1739251200000,
  tanggal: "2026-10-19",
  jenis: "pengeluaran",
  kategori: "Makan",
  nominal: 25000,
  catatan: "Sayur dan ikan",
  amplopId: 2
}
```
 
**Kunci `amplop`**
```js
{
  id: 1,
  nama: "Belanja Dapur",
  nominal: 1500000
}
```
 
Sisa amplop **tidak disimpan**, tetapi dihitung:
`sisa = nominal amplop − jumlah nominal semua transaksi pengeluaran dengan amplopId tersebut`
 
## 3. Keputusan desain
 
**Keputusan:** Sisa amplop dihitung ulang dari data transaksi setiap kali dirender (lewat `reduce`), bukan disimpan sebagai angka di objek amplop.
 
**Alasan:** Jika sisa disimpan, setiap tambah, hapus, atau edit transaksi harus ikut memperbarui dua tempat, dan risiko datanya tidak sinkron besar (misalnya transaksi dihapus tetapi sisa amplop tidak kembali). Dengan menghitung dari transaksi, hanya ada satu sumber kebenaran, sehingga fitur khas memakai data transaksi yang sama sesuai ketentuan.
 
### Bug 1: Pilihan amplop tetap muncul saat memilih Pemasukan
- **Masalah:** Kolom "Amplop" di form seharusnya hanya tampil untuk pengeluaran, tetapi tetap terlihat setelah saya memilih Pemasukan.
- **Penyebab:** `aturLabelAmplop()` sudah memberi atribut `hidden` pada label, tetapi CSS `label { display: grid; }` mengalahkan gaya bawaan browser untuk `hidden`. Saya sempat menghapus aturan `[hidden]` dari CSS sehingga tidak ada yang menyembunyikan label itu.
- **Solusi:** Menambahkan kembali aturan `[hidden] { display: none; }` di `style.css`. Aturan ini lebih spesifik daripada `label`, jadi atribut `hidden` kembali berfungsi.
## 5. Ringkasan checkpoint
 
1. **Checkpoint 1 (W1–W4):** form tambah, daftar transaksi dari array JS, hapus dengan konfirmasi, simpan dan muat dari localStorage.
2. **Checkpoint 2 (W5, W6, amplop):** ringkasan otomatis, validasi dengan pesan di halaman, atur nominal 3 amplop, pilihan amplop pada pengeluaran.
3. **Checkpoint 3 (sisa amplop, edit, responsif):** sisa dan penanda amplop habis, edit transaksi, tabel menjadi kartu di layar HP.
