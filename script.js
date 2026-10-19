const kategoriPengeluaran = ["Makanan", "Transportasi", "Tagihan", "Belanja", "Hiburan", "Kesehatan", "Lainnya"];
const kategoriPemasukan = ["Gaji", "Bonus", "Usaha", "Hadiah", "Lainnya"];
 
const form = document.getElementById("form-transaksi");
 
function muatData(kunci, cadangan) {
  const teks = localStorage.getItem(kunci);
  if (teks === null) return cadangan;
  return JSON.parse(teks);
}
 
function simpanData(kunci, data) {
  localStorage.setItem(kunci, JSON.stringify(data));
}
 
function formatRupiah(angka) {
  return "Rp" + angka.toLocaleString("id-ID");
}
 
function tampilPesan(teks) {
  const status = document.getElementById("status");
  status.textContent = teks;
  status.className = "status sukses";
}
 
let transaksi = muatData("transaksi", []);
 
function isiKategori() {
  const daftar = form.jenis.value === "pengeluaran" ? kategoriPengeluaran : kategoriPemasukan;
  let html = '<option value="">Pilih kategori</option>';
  daftar.forEach(function (k) {
    html += `<option value="${k}">${k}</option>`;
  });
  form.kategori.innerHTML = html;
}
 
function resetForm() {
  form.reset();
  form.tanggal.value = new Date().toLocaleDateString("sv-SE");
  isiKategori();
}
 
function renderDaftar() {
  const urut = transaksi.slice().sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id);
 
  const baris = urut.map(function (t) {
    const masuk = t.jenis === "pemasukan";
    return `<tr>
      <td data-label="Tanggal">${t.tanggal}</td>
      <td data-label="Catatan">${t.catatan || "-"}</td>
      <td data-label="Kategori">${t.kategori}</td>
      <td data-label="Amplop">-</td>
      <td data-label="Nominal" class="${masuk ? "masuk" : "keluar"}">${masuk ? "+" : "−"} ${formatRupiah(t.nominal)}</td>
      <td class="aksi">
        <button class="outline kecil bahaya" onclick="hapusTransaksi(${t.id})">Hapus</button>
      </td>
    </tr>`;
  });
 
  document.getElementById("isi-tabel").innerHTML = baris.join("");
  document.getElementById("kosong").hidden = transaksi.length > 0;
}
 
function hapusTransaksi(id) {
  if (!confirm("Hapus transaksi ini?")) return;
  transaksi = transaksi.filter((t) => t.id !== id);
  simpanData("transaksi", transaksi);
  tampilPesan("Transaksi dihapus.");
  renderDaftar();
}
 
form.addEventListener("submit", function (event) {
  event.preventDefault();
 
  const data = {
    id: Date.now(),
    tanggal: form.tanggal.value,
    jenis: form.jenis.value,
    kategori: form.kategori.value,
    nominal: Number(form.nominal.value),
    catatan: form.catatan.value.trim()
  };
 
  transaksi.push(data);
  simpanData("transaksi", transaksi);
  resetForm();
  tampilPesan("Transaksi ditambahkan.");
  renderDaftar();
});
 
form.addEventListener("change", function (event) {
  if (event.target.name === "jenis") isiKategori();
});
 
document.getElementById("label-amplop").hidden = true;
resetForm();
renderDaftar();
 