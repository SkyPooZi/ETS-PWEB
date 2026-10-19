# AI-LOG

Log penggunaan AI (Claude) selama hackathon.

## Simpan data dan daftar transaksi
- Prompt: "buat fungsi JS untuk menyimpan dan membaca transaksi dari localStorage, lalu menampilkannya ke tabel dengan tombol hapus"
- Dipakai: muatData(), simpanData(), renderDaftar()
- Diubah: kode saya minta disederhanakan supaya mudah saya pahami, dan komentar saya hapus

## Validasi dan ringkasan
- Prompt: "buat fungsi JS untuk validasi form transaksi dengan pesan error di halaman, dan menghitung total pemasukan, pengeluaran, dan saldo"
- Dipakai: validasiForm(), totalJenis()
- Diubah: nominal dan amplopId saya ubah ke angka dengan Number() sebelum disimpan

## Amplop dan edit transaksi
- Prompt: "buat fungsi JS untuk menghitung sisa tiap amplop dari transaksi, menandai amplop yang habis, dan mengedit transaksi lewat form yang sama"
- Dipakai: hitungTerpakai(), mulaiUbah()
- Diubah: fitur filter, budget, dan ekspor/impor yang ikut dibuat AI saya hapus karena tidak saya pilih