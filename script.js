const aktifVakitElement = document.getElementById('aktif-vakit');
const sehirlerElement = document.getElementById('sehirler');
let sayacId;

const sehirKodlari = {
    "İstanbul": "9541",
    "Ankara": "9206",
    "İzmir": "9560"
};

// Sayfa yüklendiğinde İstanbul'u otomatik seç
window.addEventListener('DOMContentLoaded', (event) => {
    sehirlerElement.value = "İstanbul";
    vakitleriGuncelle("İstanbul");
});

sehirlerElement.addEventListener('change', function() {
    const sehir = this.value;
    if (sehir) {
        vakitleriGuncelle(sehir);
    }
});

function vakitleriGuncelle(sehir) {
    if (sayacId) {
        clearInterval(sayacId);
    }

    const sehirKodu = sehirKodlari[sehir];
    const bugun = new Date();
    const yil = bugun.getFullYear();
    const ay = String(bugun.getMonth() + 1).padStart(2, '0');
    const gun = String(bugun.getDate()).padStart(2, '0');

    // API isteği için gerekli headers
    const requestOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Referer': 'https://awqatsalah.diyanet.gov.tr/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
    };

    fetch(`https://awqatsalah.diyanet.gov.tr/api/timesOfDay?region=${sehirKodu}&date=${yil}-${ay}-${gun}`, requestOptions)
        .then(response => response.json())
        .then(data => {
            const vakitler = data[0]; // İlk eleman günün vakitlerini içeriyor
            
            const sahurVakti = new Date();
            const iftarVakti = new Date();
            
            // API'den gelen vakitleri kullan
            const [sahurSaat, sahurDakika] = vakitler.fajr.split(':');
            const [iftarSaat, iftarDakika] = vakitler.maghrib.split(':');
            
            sahurVakti.setHours(parseInt(sahurSaat), parseInt(sahurDakika), 0);
            iftarVakti.setHours(parseInt(iftarSaat), parseInt(iftarDakika), 0);

            // Eğer vakit geçmişse, sonraki güne ayarla
            if (sahurVakti < new Date()) {
                sahurVakti.setDate(sahurVakti.getDate() + 1);
            }
            if (iftarVakti < new Date()) {
                iftarVakti.setDate(iftarVakti.getDate() + 1);
            }

            sayacId = setInterval(() => {
                const simdikiZaman = new Date();
                const sahuraKalanSure = sahurVakti - simdikiZaman;
                const iftaraKalanSure = iftarVakti - simdikiZaman;

                if (Math.abs(sahuraKalanSure) < Math.abs(iftaraKalanSure)) {
                    aktifVakitElement.innerHTML = `
                        <div class="vakit-card">
                            <div class="vakit-baslik">Sahur Vakti</div>
                            <div class="vakit-saat">${vakitler.fajr}</div>
                            <div class="geri-sayim">${formatSure(sahuraKalanSure)}</div>
                        </div>
                    `;
                } else {
                    aktifVakitElement.innerHTML = `
                        <div class="vakit-card">
                            <div class="vakit-baslik">İftar Vakti</div>
                            <div class="vakit-saat">${vakitler.maghrib}</div>
                            <div class="geri-sayim">${formatSure(iftaraKalanSure)}</div>
                        </div>
                    `;
                }
            }, 1000);
        })
        .catch(error => {
            console.error('Hata:', error);
            aktifVakitElement.innerHTML = `
                <div class="vakit-card">
                    <div class="vakit-baslik">Hata</div>
                    <div class="vakit-saat">Vakitler alınamadı</div>
                </div>
            `;
        });
}

function formatSure(ms) {
    if (ms < 0) ms = Math.abs(ms);
    const saniye = Math.floor((ms / 1000) % 60);
    const dakika = Math.floor((ms / 1000 / 60) % 60);
    const saat = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${saat} saat ${dakika} dakika ${saniye} saniye`;
}
