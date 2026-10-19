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
 
function tampilPesan(id, teks) {
  const elemen = document.getElementById(id);
  elemen.textContent = teks;
  elemen.className = "status sukses";
}
 
let transaksi = muatData("transaksi", []);
let amplop = muatData("amplop", [
  { id: 1, nama: "Belanja Dapur", nominal: 0 },
  { id: 2, nama: "Listrik dan Air", nominal: 0 },
  { id: 3, nama: "Sekolah Anak", nominal: 0 }
]);
let idDiubah = null;
 
function totalJenis(jenis) {
  return transaksi
    .filter((t) => t.jenis === jenis)
    .reduce((total, t) => total + t.nominal, 0);
}
 
function hitungTerpakai(amplopId) {
  return transaksi
    .filter((t) => t.jenis === "pengeluaran" && t.amplopId === amplopId)
    .reduce((total, t) => total + t.nominal, 0);
}
 
function renderRingkasan() {
  const pemasukan = totalJenis("pemasukan");
  const pengeluaran = totalJenis("pengeluaran");
  document.getElementById("pemasukan").textContent = formatRupiah(pemasukan);
  document.getElementById("pengeluaran").textContent = formatRupiah(pengeluaran);
  document.getElementById("saldo").textContent = formatRupiah(pemasukan - pengeluaran);
}
 
function namaAmplop(id) {
  const a = amplop.find((x) => x.id === id);
  return a ? a.nama : "-";
}
 
function isiKategori() {
  const daftar = form.jenis.value === "pengeluaran" ? kategoriPengeluaran : kategoriPemasukan;
  let html = '<option value="">Pilih kategori</option>';
  daftar.forEach(function (k) {
    html += `<option value="${k}">${k}</option>`;
  });
  form.kategori.innerHTML = html;
}
 
function isiPilihanAmplop() {
  let html = '<option value="">Pilih amplop</option>';
  amplop.forEach(function (a) {
    html += `<option value="${a.id}">${a.nama}</option>`;
  });
  form.amplop.innerHTML = html;
}
 
function aturLabelAmplop() {
  document.getElementById("label-amplop").hidden = form.jenis.value !== "pengeluaran";
}
 
function hapusErrors() {
  ["nominal", "tanggal", "kategori", "amplop"].forEach(function (nama) {
    document.getElementById("err-" + nama).textContent = "";
  });
}
 
function resetForm() {
  idDiubah = null;
  form.reset();
  form.tanggal.value = new Date().toLocaleDateString("sv-SE");
  isiKategori();
  aturLabelAmplop();
  hapusErrors();
  document.getElementById("judul-form").textContent = "Tambah transaksi";
  document.getElementById("tombol-simpan").textContent = "Simpan transaksi";
  document.getElementById("tombol-batal").hidden = true;
}
 
function validasiForm(data) {
  const errors = { nominal: "", tanggal: "", kategori: "", amplop: "" };
 
  if (!(data.nominal > 0)) errors.nominal = "Nominal harus lebih dari 0.";
  if (data.tanggal === "") errors.tanggal = "Tanggal wajib diisi.";
  if (data.kategori === "") errors.kategori = "Pilih salah satu kategori.";
  if (data.jenis === "pengeluaran" && data.amplopId === null) errors.amplop = "Pilih amplop untuk pengeluaran ini.";
 
  document.getElementById("err-nominal").textContent = errors.nominal;
  document.getElementById("err-tanggal").textContent = errors.tanggal;
  document.getElementById("err-kategori").textContent = errors.kategori;
  document.getElementById("err-amplop").textContent = errors.amplop;
 
  return !(errors.nominal || errors.tanggal || errors.kategori || errors.amplop);
}
 
function renderDaftar() {
  const urut = transaksi.slice().sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id);
 
  const baris = urut.map(function (t) {
    const masuk = t.jenis === "pemasukan";
    return `<tr>
      <td data-label="Tanggal">${t.tanggal}</td>
      <td data-label="Catatan">${t.catatan || "-"}</td>
      <td data-label="Kategori">${t.kategori}</td>
      <td data-label="Amplop">${masuk ? "-" : namaAmplop(t.amplopId)}</td>
      <td data-label="Nominal" class="${masuk ? "masuk" : "keluar"}">${masuk ? "+" : "−"} ${formatRupiah(t.nominal)}</td>
      <td class="aksi">
        <button class="outline kecil" onclick="mulaiUbah(${t.id})">Ubah</button>
        <button class="outline kecil bahaya" onclick="hapusTransaksi(${t.id})">Hapus</button>
      </td>
    </tr>`;
  });
 
  document.getElementById("isi-tabel").innerHTML = baris.join("");
  document.getElementById("kosong").hidden = transaksi.length > 0;
}
 
function renderInputAmplop() {
  let html = "";
  amplop.forEach(function (a) {
    html += `<li>
      <label>${a.nama} (Rp)
        <input type="number" min="0" step="1" value="${a.nominal}">
      </label>
    </li>`;
  });
  document.getElementById("input-amplop").innerHTML = html;
}
 
function renderAmplop() {
  let html = "";
  amplop.forEach(function (a) {
    const terpakai = hitungTerpakai(a.id);
    const sisa = a.nominal - terpakai;
    const habis = (a.nominal > 0 || terpakai > 0) && sisa <= 0;
    const warna = habis ? "habis" : "aman";
 
    html += `<li>
      <h3>${a.nama} ${habis ? '<span class="badge habis">Habis</span>' : ""}</h3>
      <p class="sisa ${warna}">${sisa < 0 ? "Lebih " + formatRupiah(-sisa) : "Sisa " + formatRupiah(sisa)}</p>
      <progress class="${warna}" value="${Math.min(terpakai, a.nominal)}" max="${a.nominal || 1}"></progress>
      <small>Terpakai ${formatRupiah(terpakai)} dari ${formatRupiah(a.nominal)}</small>
    </li>`;
  });
  document.getElementById("daftar-amplop").innerHTML = html;
}
 
function renderSemua() {
  renderRingkasan();
  renderDaftar();
  renderAmplop();
}
 
function mulaiUbah(id) {
  const t = transaksi.find((x) => x.id === id);
  idDiubah = id;
 
  form.jenis.value = t.jenis;
  isiKategori();
  aturLabelAmplop();
  form.kategori.value = t.kategori;
  form.nominal.value = t.nominal;
  form.tanggal.value = t.tanggal;
  form.catatan.value = t.catatan;
  form.amplop.value = t.amplopId === null ? "" : t.amplopId;
 
  hapusErrors();
  document.getElementById("judul-form").textContent = "Ubah transaksi";
  document.getElementById("tombol-simpan").textContent = "Simpan perubahan";
  document.getElementById("tombol-batal").hidden = false;
  form.nominal.focus();
}
 
function hapusTransaksi(id) {
  if (!confirm("Hapus transaksi ini?")) return;
  transaksi = transaksi.filter((t) => t.id !== id);
  simpanData("transaksi", transaksi);
  if (idDiubah === id) resetForm();
  tampilPesan("status", "Transaksi dihapus.");
  renderSemua();
}
 
form.addEventListener("submit", function (event) {
  event.preventDefault();
 
  const data = {
    id: Date.now(),
    tanggal: form.tanggal.value,
    jenis: form.jenis.value,
    kategori: form.kategori.value,
    nominal: Number(form.nominal.value),
    catatan: form.catatan.value.trim(),
    amplopId: null
  };
  if (data.jenis === "pengeluaran" && form.amplop.value !== "") {
    data.amplopId = Number(form.amplop.value);
  }
 
  if (!validasiForm(data)) return;
 
  let pesan = "Transaksi ditambahkan.";
  if (idDiubah === null) {
    transaksi.push(data);
  } else {
    data.id = idDiubah;
    transaksi = transaksi.map((t) => (t.id === idDiubah ? data : t));
    pesan = "Transaksi diperbarui.";
  }
 
  simpanData("transaksi", transaksi);
  resetForm();
  tampilPesan("status", pesan);
  renderSemua();
});
 
form.addEventListener("change", function (event) {
  if (event.target.name === "jenis") {
    isiKategori();
    aturLabelAmplop();
  }
});
 
document.getElementById("tombol-batal").addEventListener("click", function () {
  resetForm();
  tampilPesan("status", "");
});
 
document.getElementById("form-amplop").addEventListener("submit", function (event) {
  event.preventDefault();
 
  const inputs = document.querySelectorAll("#input-amplop input");
  let valid = true;
  inputs.forEach(function (input) {
    if (input.value === "" || Number(input.value) < 0) valid = false;
  });
 
  if (!valid) {
    document.getElementById("err-amplop-form").textContent = "Nominal amplop harus diisi, minimal 0.";
    return;
  }
  document.getElementById("err-amplop-form").textContent = "";
 
  inputs.forEach(function (input, i) {
    amplop[i].nominal = Number(input.value);
  });
  simpanData("amplop", amplop);
  tampilPesan("status-amplop", "Nominal amplop disimpan.");
  renderAmplop();
});
 
isiPilihanAmplop();
renderInputAmplop();
resetForm();
renderSemua();
 