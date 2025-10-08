// script.js
const inputs = document.querySelectorAll("input");


function hitung() {
const unitLapangan = parseFloat(document.getElementById("unitLapangan").value) || 0;
const jamMain = parseFloat(document.getElementById("jamMain").value) || 0;
const hargaLapanganPerJam = parseFloat(document.getElementById("hargaLapanganPerJam").value) || 0;
const hargaSlop = parseFloat(document.getElementById("hargaSlop").value) || 0;
const isiSlop = parseFloat(document.getElementById("isiSlop").value) || 1;
const jumlahPlayer = parseFloat(document.getElementById("jumlahPlayer").value) || 1;
const cockTerpakai = parseFloat(document.getElementById("cockTerpakai").value) || 0;


const hargaPerCock = hargaSlop / isiSlop;
const hargaCockPerOrang = (hargaPerCock / jumlahPlayer) * cockTerpakai;
const totalLapangan = hargaLapanganPerJam * unitLapangan * jamMain;
const totalKeseluruhan = totalLapangan + (hargaPerCock * cockTerpakai);
const biayaPerOrang = totalKeseluruhan / jumlahPlayer;
const biayaPembulatan = Math.ceil(biayaPerOrang / 1000) * 1000;
const selisih = biayaPembulatan - biayaPerOrang;


document.getElementById("hargaPerCock").innerText = formatRupiah(hargaPerCock);
document.getElementById("hargaCockPerOrang").innerText = formatRupiah(hargaCockPerOrang);
document.getElementById("totalLapangan").innerText = formatRupiah(totalLapangan);
document.getElementById("totalKeseluruhan").innerText = formatRupiah(totalKeseluruhan);
document.getElementById("biayaPerOrang").innerText = formatRupiah(biayaPerOrang);
document.getElementById("biayaPembulatan").innerText = formatRupiah(biayaPembulatan);
document.getElementById("selisih").innerText = formatRupiah(selisih);
}


function formatRupiah(angka) {
return "Rp " + angka.toLocaleString("id-ID", {minimumFractionDigits:0});
}


inputs.forEach(input => input.addEventListener("input", hitung));
hitung();


// Export ke gambar
const exportBtn = document.getElementById("exportBtn");
exportBtn.addEventListener("click", () => {
const captureArea = document.getElementById("captureArea");
html2canvas(captureArea).then(canvas => {
const link = document.createElement("a");
link.download = "biaya-badminton.png";
link.href = canvas.toDataURL();
link.click();
});
});
