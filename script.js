// Navigasi Tab Kalkulator
function switchTab(tabId) {
    document.querySelectorAll('.calc-panel').forEach(panel => panel.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('border-orange-500', 'bg-orange-500/10', 'text-orange-400', 'shadow-lg', 'shadow-orange-500/5');
        btn.classList.add('border-slate-700', 'bg-slate-800/50', 'text-slate-400');
        const iconSpan = btn.querySelector('span');
        if(iconSpan) {
            iconSpan.classList.remove('bg-orange-500', 'text-white');
            iconSpan.classList.add('bg-slate-700', 'text-slate-300');
        }
        const titleDiv = btn.querySelector('.text-base');
        if(titleDiv) {
            titleDiv.classList.remove('text-white');
            titleDiv.classList.add('text-slate-200');
        }
    });

    document.getElementById(`panel-${tabId}`).classList.remove('hidden');
    const activeBtn = document.getElementById(`tab-${tabId}`);
    activeBtn.classList.remove('border-slate-700', 'bg-slate-800/50', 'text-slate-400');
    activeBtn.classList.add('border-orange-500', 'bg-orange-500/10', 'text-orange-400', 'shadow-lg', 'shadow-orange-500/5');
    
    const activeIcon = activeBtn.querySelector('span');
    if(activeIcon) {
        activeIcon.classList.remove('bg-slate-700', 'text-slate-300');
        activeIcon.classList.add('bg-orange-500', 'text-white');
    }
    const activeTitle = activeBtn.querySelector('.text-base');
    if(activeTitle) {
        activeTitle.classList.remove('text-slate-200');
        activeTitle.classList.add('text-white');
    }
}

// Dark/Light Theme Toggle
function toggleDarkMode() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        html.classList.add('light');
    } else {
        html.classList.remove('dark'); // Default dark
        html.classList.add('dark');
    }
}

// 1. Kalkulator Square Column Concrete
function calculateColumn() {
    const b = parseFloat(document.getElementById('col-b').value) / 1000; // m
    const h = parseFloat(document.getElementById('col-h').value) / 1000; // m
    const L = parseFloat(document.getElementById('col-l').value); // m
    const fc = parseFloat(document.getElementById('col-fc').value);

    if (isNaN(b) || isNaN(h) || isNaN(L) || b <= 0 || h <= 0 || L <= 0) {
        alert('Mohon masukkan angka dimensi yang valid!');
        return;
    }

    const netArea = b * h;
    const volumePure = netArea * L;
    const volumeWaste = volumePure * 1.05; // Faktor susut 5%

    // Estimasi material per m3 beton mutu standar
    const cement = volumeWaste * 350; // kg
    const sand = volumeWaste * 0.54;   // m3
    const gravel = volumeWaste * 0.76; // m3
    const water = volumeWaste * 210;   // liter

    // Cek SNI 2847 (fc minimum struktur adalah 20 MPa)
    const isSnsValid = fc >= 20;
    const statusBadge = isSnsValid 
        ? `<span class="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-bold">SESUAI SNI 2847</span>`
        : `<span class="px-2 py-1 bg-rose-500/20 text-rose-400 text-xs rounded-full font-bold">TIDAK SESUAI (fc' < 20 MPa)</span>`;

    document.getElementById('result-content').innerHTML = `
        <div class="space-y-3">
            <div class="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                <span class="text-slate-400">Status SNI:</span>
                <div>${statusBadge}</div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                    <div class="text-xs text-slate-400">Volume Bersih</div>
                    <div class="text-lg font-bold text-white">${volumePure.toFixed(3)} m³</div>
                </div>
                <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                    <div class="text-xs text-slate-400">+ Waste 5%</div>
                    <div class="text-lg font-bold text-orange-400">${volumeWaste.toFixed(3)} m³</div>
                </div>
            </div>
            <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 space-y-2">
                <div class="text-xs font-bold text-slate-300 uppercase tracking-wider">Estimasi Kebutuhan Material:</div>
                <div class="flex justify-between text-sm"><span class="text-slate-400">Semen (Zak @ 40kg):</span> <span class="font-bold text-white">${Math.ceil(cement / 40)} Zak (${cement.toFixed(1)} kg)</span></div>
                <div class="flex justify-between text-sm"><span class="text-slate-400">Pasir Beton:</span> <span class="font-bold text-white">${sand.toFixed(2)} m³</span></div>
                <div class="flex justify-between text-sm"><span class="text-slate-400">Kerikil / Split:</span> <span class="font-bold text-white">${gravel.toFixed(2)} m³</span></div>
                <div class="flex justify-between text-sm"><span class="text-slate-400">Air Kerja:</span> <span class="font-bold text-white">${water.toFixed(1)} Liter</span></div>
            </div>
        </div>
    `;
}

// 2. Kalkulator Cantilever Beam
function calculateBeam() {
    const L = parseFloat(document.getElementById('beam-l').value); // m
    const q = parseFloat(document.getElementById('beam-q').value); // kN/m
    const b = parseFloat(document.getElementById('beam-b').value); // mm
    const h = parseFloat(document.getElementById('beam-h').value); // mm
    const Ec = parseFloat(document.getElementById('beam-e').value); // MPa

    if (isNaN(L) || isNaN(q) || isNaN(b) || isNaN(h) || L <= 0 || q <= 0) {
        alert('Mohon masukkan data struktur balok yang valid!');
        return;
    }

    // Momen Maksimum Kantilever (diperletakan jepit): M = 0.5 * q * L^2 (kN.m)
    const Mmax = 0.5 * q * Math.pow(L, 2);
    // Gaya Geser Maksimum: V = q * L (kN)
    const Vmax = q * L;

    // Inersia Penampang I = (b * h^3) / 12 (mm^4)
    const I = (b * Math.pow(h, 3)) / 12;
    // Lendutan Maksimum Akibat Beban Merata Kantilever: delta = (q_N/mm * L_mm^4) / (8 * Ec * I)
    const q_nmm = (q * 1000) / 1000; // N/mm
    const L_mm = L * 1000;
    const deltaMax = ( (q_nmm * Math.pow(L_mm, 4)) / (8 * Ec * I) ); // mm

    // Batas izin lendutan SNI: L / 250
    const allowDeflection = L_mm / 250;
    const isDeflectionValid = deltaMax <= allowDeflection;

    const defStatus = isDeflectionValid
        ? `<span class="text-emerald-400 font-bold">AMAN (Memenuhi L/250)</span>`
        : `<span class="text-rose-400 font-bold">TIDAK AMAN (Lendutan Berlebih)</span>`;

    document.getElementById('result-content').innerHTML = `
        <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                    <div class="text-xs text-slate-400">Momen Jepit ($M_{max}$)</div>
                    <div class="text-lg font-bold text-orange-400">${Mmax.toFixed(2)} kNm</div>
                </div>
                <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                    <div class="text-xs text-slate-400">Gaya Geser ($V_{max}$)</div>
                    <div class="text-lg font-bold text-white">${Vmax.toFixed(2)} kN</div>
                </div>
            </div>
            <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 space-y-2">
                <div class="text-xs font-bold text-slate-300 uppercase tracking-wider">Analisis Lendutan & SNI:</div>
                <div class="flex justify-between text-sm"><span class="text-slate-400">Lendutan Hitung:</span> <span class="font-bold text-white">${deltaMax.toFixed(3)} mm</span></div>
                <div class="flex justify-between text-sm"><span class="text-slate-400">Batas Izin (L/250):</span> <span class="font-bold text-white">${allowDeflection.toFixed(2)} mm</span></div>
                <div class="pt-2 border-t border-slate-800 flex justify-between text-sm items-center"><span class="text-slate-400">Verifikasi SNI:</span> <span>${defStatus}</span></div>
            </div>
        </div>
    `;
}

// 3. Kalkulator 4-Bar Column Capacity
function calculateCol4Bar() {
    const b = parseFloat(document.getElementById('col4-b').value); // mm
    const h = parseFloat(document.getElementById('col4-h').value); // mm
    const dbar = parseFloat(document.getElementById('col4-dbar').value); // mm
    const Pu = parseFloat(document.getElementById('col4-pu').value); // kN
    const fc = parseFloat(document.getElementById('col4-fc').value); // MPa
    const fy = parseFloat(document.getElementById('col4-fy').value); // MPa

    if (isNaN(b) || isNaN(h) || isNaN(Pu)) {
        alert('Mohon lengkapi parameter data kolom!');
        return;
    }

    const Ag = b * h; // mm2
    // 4 batang tulangan utama
    const As = 4 * (0.25 * Math.PI * Math.pow(dbar, 2)); // mm2
    const rho = As / Ag; // rasio tulangan

    // Cek batasan rasio tulangan SNI 2847: 1% (0.01) <= rho <= 8% (0.08)
    const isRhoValid = rho >= 0.01 && rho <= 0.08;

    // Kapasitas Aksial Nominal Pendek (Aproksimasi SNI untuk kolom ikat):
    // Pn,max = 0.85 * fc' * (Ag - As) + fy * As (dalam Newton, lalu dikonversi ke kN)
    const Pn = (0.85 * fc * (Ag - As) + fy * As) / 1000; // kN
    // Faktor reduksi kekuatan phi untuk kolom ikat = 0.65
    const phiPn = 0.65 * Pn;

    const isCapacityValid = phiPn >= Pu;
    const capacityStatus = isCapacityValid
        ? `<span class="text-emerald-400 font-bold">AMAN ($\\phi P_n \\ge P_u$)</span>`
        : `<span class="text-rose-400 font-bold">KAPASITAS TIDAK CUKUP</span>`;

    const rhoStatus = isRhoValid
        ? `<span class="text-emerald-400 font-bold">MEMENUHI (1% - 8%)</span>`
        : `<span class="text-rose-400 font-bold">DILUAR BATAS SNI</span>`;

    document.getElementById('result-content').innerHTML = `
        <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                    <div class="text-xs text-slate-400">Kapasitas Desain ($\\phi P_n$)</div>
                    <div class="text-lg font-bold text-orange-400">${phiPn.toFixed(1)} kN</div>
                </div>
                <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                    <div class="text-xs text-slate-400">Beban Rencana ($P_u$)</div>
                    <div class="text-lg font-bold text-white">${Pu} kN</div>
                </div>
            </div>
            <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 space-y-2">
                <div class="text-xs font-bold text-slate-300 uppercase tracking-wider">Cek SNI Tulangan & Kapasitas:</div>
                <div class="flex justify-between text-sm"><span class="text-slate-400">Luas Tulangan ($A_s$):</span> <span class="font-bold text-white">${As.toFixed(1)} mm²</span></div>
                <div class="flex justify-between text-sm"><span class="text-slate-400">Rasio Tulangan ($\\rho$):</span> <span class="font-bold text-white">${(rho*100).toFixed(2)}%</span></div>
                <div class="flex justify-between text-sm"><span class="text-slate-400">Cek Rasio SNI:</span> <span>${rhoStatus}</span></div>
                <div class="pt-2 border-t border-slate-800 flex justify-between text-sm items-center"><span class="text-slate-400">Status Beban:</span> <span>${capacityStatus}</span></div>
            </div>
        </div>
    `;
}