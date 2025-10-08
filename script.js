const inputs = document.querySelectorAll("input");

// fungsi untuk bersihin input jadi angka murni
function cleanNumber(str) {
  return parseFloat(str.replace(/[^0-9]/g, "")) || 0;
}

// fungsi format jadi Rupiah
function formatRupiahInput(el) {
  let angka = el.value.replace(/[^0-9]/g, ""); // ambil hanya digit
  if (angka === "") {
    el.value = "";
    return;
  }
  el.value = "Rp " + parseInt(angka).toLocaleString("id-ID");
}

// kalkulasi
function hitung() {
  const unitLapangan = cleanNumber(
    document.getElementById("unitLapangan").value
  );
  const jamMain = cleanNumber(document.getElementById("jamMain").value);
  const hargaLapanganPerJam = cleanNumber(
    document.getElementById("hargaLapanganPerJam").value
  );
  const hargaSlop = cleanNumber(document.getElementById("hargaSlop").value);
  const isiSlop = cleanNumber(document.getElementById("isiSlop").value) || 1;
  const jumlahPlayer =
    cleanNumber(document.getElementById("jumlahPlayer").value) || 1;
  const cockTerpakai = cleanNumber(
    document.getElementById("cockTerpakai").value
  );

  const hargaPerCock = hargaSlop / isiSlop;
  const hargaCockPerOrang = (hargaPerCock / jumlahPlayer) * cockTerpakai;
  const totalLapangan = hargaLapanganPerJam * unitLapangan * jamMain;
  const totalKeseluruhan = totalLapangan + hargaPerCock * cockTerpakai;
  const biayaPerOrang = totalKeseluruhan / jumlahPlayer;
  const biayaPembulatan = Math.ceil(biayaPerOrang / 1000) * 1000;
  const selisih = biayaPembulatan - biayaPerOrang;

  document.getElementById("hargaPerCock").innerText =
    formatRupiah(hargaPerCock);
  document.getElementById("hargaCockPerOrang").innerText =
    formatRupiah(hargaCockPerOrang);
  document.getElementById("totalLapangan").innerText =
    formatRupiah(totalLapangan);
  document.getElementById("totalKeseluruhan").innerText =
    formatRupiah(totalKeseluruhan);
  document.getElementById("biayaPerOrang").innerText =
    formatRupiah(biayaPerOrang);
  document.getElementById("biayaPembulatan").innerText =
    formatRupiah(biayaPembulatan);
  document.getElementById("selisih").innerText = formatRupiah(selisih);
}

function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID", { minimumFractionDigits: 0 });
}

// pasang event listener
inputs.forEach((input) => {
  // kalau input termasuk harga → format dengan Rp
  if (input.id === "hargaLapanganPerJam" || input.id === "hargaSlop") {
    input.addEventListener("input", function () {
      formatRupiahInput(this);
      hitung();
    });
  } else {
    input.addEventListener("input", hitung);
  }
});

hitung();

// Export ke gambar
const exportBtn = document.getElementById("exportBtn");
exportBtn.addEventListener("click", () => {
  const captureArea = document.getElementById("exportArea");
  html2canvas(captureArea).then((canvas) => {
    const link = document.createElement("a");
    link.download = "biaya-badminton.png";
    link.href = canvas.toDataURL();
    link.click();
  });
});
