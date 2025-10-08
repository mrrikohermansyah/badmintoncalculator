const inputs = document.querySelectorAll("input");

// 🔹 Bersihin input jadi angka murni
function cleanNumber(str) {
  return parseFloat(str.replace(/[^0-9]/g, "")) || 0;
}

// 🔹 Format jadi Rupiah untuk input harga
function formatRupiahInput(el) {
  let angka = el.value.replace(/[^0-9]/g, "");
  if (angka === "") {
    el.value = "";
    return;
  }
  el.value = "Rp " + parseInt(angka).toLocaleString("id-ID");
}

// 🔹 Format Rupiah untuk output (tampilan)
function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

// 🔹 Kalkulasi biaya
function hitung() {
  const unitLapangan = cleanNumber(
    document.getElementById("unitLapangan").value
  );

  // durasi main dalam menit → konversi ke jam
  const menitMain = parseInt(document.getElementById("jamMain").value) || 0;
  const jamMain = menitMain / 60;

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
  const hargaTotalCock = hargaPerCock * cockTerpakai;
  const hargaCockPerOrang = (hargaPerCock * cockTerpakai) / jumlahPlayer;
  const totalLapangan = hargaLapanganPerJam * unitLapangan * jamMain;
  const totalKeseluruhan = totalLapangan + hargaTotalCock;
  const biayaPerOrang = totalKeseluruhan / jumlahPlayer;
  const biayaPembulatan = Math.ceil(biayaPerOrang / 1000) * 1000;
  const selisih = biayaPembulatan - biayaPerOrang;

  // 🔹 Update hasil
  document.getElementById("hargaPerCock").innerText =
    formatRupiah(hargaPerCock);
  document.getElementById("hargaTotalCock").innerText =
    formatRupiah(hargaTotalCock);
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

// 🔹 Event listener
inputs.forEach((input) => {
  if (input.id === "hargaLapanganPerJam" || input.id === "hargaSlop") {
    input.addEventListener("input", function () {
      formatRupiahInput(this);
      hitung();
    });
  } else {
    input.addEventListener("input", hitung);
  }
});

// 🔹 Hitung awal
hitung();

// 🔹 Export ke gambar
document.getElementById("exportBtn").addEventListener("click", () => {
  const captureArea = document.getElementById("exportArea");
  html2canvas(captureArea).then((canvas) => {
    const link = document.createElement("a");
    link.download = "biaya-badminton.png";
    link.href = canvas.toDataURL();
    link.click();
  });
});
