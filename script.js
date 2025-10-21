// Tunggu hingga DOM selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll("input");

  // Bersihkan input jadi angka murni
  function cleanNumber(str) {
    if (typeof str === "number") return str;
    if (typeof str !== "string") return 0;
    return parseFloat(str.replace(/[^0-9]/g, "")) || 0;
  }

  // Format jadi Rupiah untuk input harga
  function formatRupiahInput(el) {
    let angka = el.value.replace(/[^0-9]/g, "");
    if (angka === "") {
      el.value = "";
      return;
    }
    el.value = "Rp " + parseInt(angka).toLocaleString("id-ID");
  }

  // Format Rupiah untuk output (tampilan)
  function formatRupiah(angka) {
    return "Rp " + Math.round(angka).toLocaleString("id-ID");
  }

  // Kalkulasi biaya
  function hitung() {
    const unitLapangan =
      parseInt(document.getElementById("unitLapangan").value) || 1;

    // Durasi main dalam menit → konversi ke jam
    const menitMain = parseInt(document.getElementById("jamMain").value) || 0;
    const jamMain = menitMain / 60;

    const hargaLapanganPerJam = cleanNumber(
      document.getElementById("hargaLapanganPerJam").value
    );
    const hargaSlop = cleanNumber(document.getElementById("hargaSlop").value);
    const isiSlop = parseInt(document.getElementById("isiSlop").value) || 1;
    const jumlahPlayer =
      parseInt(document.getElementById("jumlahPlayer").value) || 1;
    const cockTerpakai =
      parseInt(document.getElementById("cockTerpakai").value) || 0;

    // Validasi input
    if (jumlahPlayer <= 0) {
      alert("Jumlah pemain harus lebih dari 0");
      return;
    }

    // Perhitungan
    const hargaPerCock = isiSlop > 0 ? hargaSlop / isiSlop : 0;
    const hargaTotalCock = hargaPerCock * cockTerpakai;
    const hargaCockPerOrang =
      jumlahPlayer > 0 ? (hargaPerCock * cockTerpakai) / jumlahPlayer : 0;
    const totalLapangan = hargaLapanganPerJam * unitLapangan * jamMain;
    const totalKeseluruhan = totalLapangan + hargaTotalCock;
    const biayaPerOrang =
      jumlahPlayer > 0 ? totalKeseluruhan / jumlahPlayer : 0;
    const biayaPembulatan = Math.ceil(biayaPerOrang / 1000) * 1000;
    const selisih = biayaPembulatan - biayaPerOrang;

    // Update hasil
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

  // Event listener untuk input
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

  // Export ke gambar
  document.getElementById("exportBtn").addEventListener("click", () => {
    const captureArea = document.getElementById("exportArea");

    // Tampilkan loading state
    const originalText = document.getElementById("exportBtn").textContent;
    document.getElementById("exportBtn").textContent = "Membuat gambar...";
    document.getElementById("exportBtn").disabled = true;

    html2canvas(captureArea, {
      scale: 2, // Kualitas lebih tinggi
      useCORS: true,
      logging: false,
    })
      .then((canvas) => {
        const link = document.createElement("a");
        link.download = "biaya-badminton.png";
        link.href = canvas.toDataURL("image/png");
        link.click();

        // Kembalikan tombol ke keadaan semula
        document.getElementById("exportBtn").textContent = originalText;
        document.getElementById("exportBtn").disabled = false;
      })
      .catch((error) => {
        console.error("Error generating image:", error);
        alert("Terjadi kesalahan saat membuat gambar. Silakan coba lagi.");

        // Kembalikan tombol ke keadaan semula
        document.getElementById("exportBtn").textContent = originalText;
        document.getElementById("exportBtn").disabled = false;
      });
  });

  // Hitung awal saat halaman dimuat
  hitung();
});
