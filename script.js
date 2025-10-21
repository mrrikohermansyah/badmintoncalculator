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

  // Format tanggal untuk receipt
  function formatTanggal() {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return now.toLocaleDateString("id-ID", options);
  }

  // Update receipt dengan data terbaru
  function updateReceipt(data) {
    document.getElementById("receiptDate").textContent = formatTanggal();
    document.getElementById("receiptHargaLapangan").textContent = formatRupiah(
      data.hargaLapanganPerJam
    );
    document.getElementById("receiptLapanganDetail").textContent = `${
      data.unitLapangan
    } unit × ${data.jamMain.toFixed(1)} jam`;
    document.getElementById("receiptTotalLapangan").textContent = formatRupiah(
      data.totalLapangan
    );
    document.getElementById("receiptCockTerpakai").textContent =
      data.cockTerpakai;
    document.getElementById("receiptCockDetail").textContent = `@${formatRupiah(
      data.hargaPerCock
    )}/pcs`;
    document.getElementById("receiptTotalCock").textContent = formatRupiah(
      data.hargaTotalCock
    );
    document.getElementById("receiptSubtotal").textContent = formatRupiah(
      data.totalKeseluruhan
    );
    document.getElementById(
      "receiptJumlahPlayer"
    ).textContent = `${data.jumlahPlayer} orang`;
    document.getElementById("receiptBiayaPerOrang").textContent = formatRupiah(
      data.biayaPerOrang
    );
    document.getElementById("receiptSelisih").textContent = formatRupiah(
      data.selisih
    );
    document.getElementById("receiptGrandTotal").textContent = formatRupiah(
      data.biayaPembulatan
    );
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

    // Update receipt
    updateReceipt({
      hargaLapanganPerJam,
      unitLapangan,
      jamMain,
      totalLapangan,
      cockTerpakai,
      hargaPerCock,
      hargaTotalCock,
      totalKeseluruhan,
      jumlahPlayer,
      biayaPerOrang,
      selisih,
      biayaPembulatan,
    });
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

  // Buat receipt element secara dinamis untuk export
  function createReceiptForExport() {
    const receiptData = {
      hargaLapanganPerJam: cleanNumber(
        document.getElementById("hargaLapanganPerJam").value
      ),
      unitLapangan:
        parseInt(document.getElementById("unitLapangan").value) || 1,
      jamMain: (parseInt(document.getElementById("jamMain").value) || 0) / 60,
      cockTerpakai:
        parseInt(document.getElementById("cockTerpakai").value) || 0,
      jumlahPlayer:
        parseInt(document.getElementById("jumlahPlayer").value) || 1,
      hargaSlop: cleanNumber(document.getElementById("hargaSlop").value),
      isiSlop: parseInt(document.getElementById("isiSlop").value) || 1,
    };

    // Hitung ulang untuk receipt
    const hargaPerCock =
      receiptData.isiSlop > 0 ? receiptData.hargaSlop / receiptData.isiSlop : 0;
    const hargaTotalCock = hargaPerCock * receiptData.cockTerpakai;
    const totalLapangan =
      receiptData.hargaLapanganPerJam *
      receiptData.unitLapangan *
      receiptData.jamMain;
    const totalKeseluruhan = totalLapangan + hargaTotalCock;
    const biayaPerOrang =
      receiptData.jumlahPlayer > 0
        ? totalKeseluruhan / receiptData.jumlahPlayer
        : 0;
    const biayaPembulatan = Math.ceil(biayaPerOrang / 1000) * 1000;
    const selisih = biayaPembulatan - biayaPerOrang;

    // Buat elemen receipt
    const receiptDiv = document.createElement("div");
    receiptDiv.className = "receipt";
    receiptDiv.style.width = "300px";
    receiptDiv.style.background = "white";
    receiptDiv.style.padding = "20px";
    receiptDiv.style.boxShadow = "0 0 20px rgba(0,0,0,0.1)";
    receiptDiv.style.border = "1px solid #ddd";
    receiptDiv.style.fontFamily = "'Courier New', monospace";
    receiptDiv.style.color = "#000";
    receiptDiv.style.fontSize = "12px";

    receiptDiv.innerHTML = `
            <div style="text-align: center; margin-bottom: 15px;">
                <div style="font-size: 20px; font-weight: bold; margin-bottom: 5px;">BADMINTON CLUB</div>
                <div style="font-size: 14px; margin-bottom: 8px; color: #666;">BILLING STATEMENT</div>
                <div style="font-size: 12px; color: #888; margin-bottom: 10px;">${formatTanggal()}</div>
            </div>
            
            <div style="text-align: center; margin: 10px 0; font-size: 12px; color: #000; letter-spacing: -1px;">═══════════════════════════════</div>
            
            <div style="margin: 15px 0;">
                <div style="margin: 8px 0; display: flex; flex-direction: column;">
                    <span style="font-weight: bold;">Lapangan (@${formatRupiah(
                      receiptData.hargaLapanganPerJam
                    )}/jam)</span>
                    <span style="font-size: 11px; color: #666; margin-left: 10px;">${
                      receiptData.unitLapangan
                    } unit × ${receiptData.jamMain.toFixed(1)} jam</span>
                    <span style="align-self: flex-end; margin-top: 2px; font-weight: bold;">${formatRupiah(
                      totalLapangan
                    )}</span>
                </div>
                
                <div style="margin: 8px 0; display: flex; flex-direction: column;">
                    <span style="font-weight: bold;">Shuttlecock (${
                      receiptData.cockTerpakai
                    } pcs)</span>
                    <span style="font-size: 11px; color: #666; margin-left: 10px;">@${formatRupiah(
                      hargaPerCock
                    )}/pcs</span>
                    <span style="align-self: flex-end; margin-top: 2px; font-weight: bold;">${formatRupiah(
                      hargaTotalCock
                    )}</span>
                </div>
            </div>
            
            <div style="text-align: center; margin: 10px 0; font-size: 12px; color: #000; letter-spacing: -1px;">───────────────────────────────</div>
            
            <div style="margin: 15px 0;">
                <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 13px;">
                    <span>SUBTOTAL</span>
                    <span>${formatRupiah(totalKeseluruhan)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 13px;">
                    <span>Pemain</span>
                    <span>${receiptData.jumlahPlayer} orang</span>
                </div>
            </div>
            
            <div style="text-align: center; margin: 10px 0; font-size: 12px; color: #000; letter-spacing: -1px;">───────────────────────────────</div>
            
            <div style="margin: 15px 0;">
                <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 13px;">
                    <span>Biaya per Orang</span>
                    <span>${formatRupiah(biayaPerOrang)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 13px;">
                    <span>Pembulatan</span>
                    <span>${formatRupiah(selisih)}</span>
                </div>
            </div>
            
            <div style="text-align: center; margin: 10px 0; font-size: 12px; color: #000; letter-spacing: -1px;">═══════════════════════════════</div>
            
            <div style="display: flex; justify-content: space-between; margin: 15px 0; font-size: 16px; font-weight: bold; padding-top: 10px; border-top: 2px dashed #000;">
                <span>TOTAL PER ORANG</span>
                <span>${formatRupiah(biayaPembulatan)}</span>
            </div>
            
            <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #666; line-height: 1.4;">
                <div>Terima kasih telah bermain!</div>
                <div>71001-04-8314</div>
            </div>
        `;

    return receiptDiv;
  }

  // Export ke gambar
  document.getElementById("exportBtn").addEventListener("click", () => {
    // Tampilkan loading state
    const originalText = document.getElementById("exportBtn").textContent;
    document.getElementById("exportBtn").textContent = "Membuat Receipt...";
    document.getElementById("exportBtn").disabled = true;

    // Buat receipt untuk export
    const receiptElement = createReceiptForExport();

    // Tambahkan ke DOM sementara
    document.body.appendChild(receiptElement);

    // Capture dengan html2canvas
    html2canvas(receiptElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })
      .then((canvas) => {
        // Buat link download
        const link = document.createElement("a");
        link.download = `badminton-receipt-${new Date()
          .toISOString()
          .slice(0, 10)}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        // Hapus elemen receipt dari DOM
        document.body.removeChild(receiptElement);

        // Kembalikan tombol ke keadaan semula
        document.getElementById("exportBtn").textContent = originalText;
        document.getElementById("exportBtn").disabled = false;
      })
      .catch((error) => {
        console.error("Error generating receipt:", error);
        alert("Terjadi kesalahan saat membuat receipt. Silakan coba lagi.");

        // Hapus elemen receipt dari DOM jika error
        if (document.body.contains(receiptElement)) {
          document.body.removeChild(receiptElement);
        }

        // Kembalikan tombol ke keadaan semula
        document.getElementById("exportBtn").textContent = originalText;
        document.getElementById("exportBtn").disabled = false;
      });
  });

  // Hitung awal saat halaman dimuat
  hitung();
});
