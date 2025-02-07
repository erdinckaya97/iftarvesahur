const aktifVakitElement = document.getElementById('aktif-vakit');
const sehirlerElement = document.getElementById('sehirler');
let sayacId;

// Şehir koordinatları
const sehirler = {
    "İstanbul": { lat: 41.0082, lng: 28.9784 },
    "Ankara": { lat: 39.9306, lng: 32.7439 },
    "İzmir": { lat: 38.4237, lng: 27.1428 }
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

    const koordinat = sehirler[sehir];
    
    // Önce şehir bilgisini al
    fetch(`https://vakit.vercel.app/api/nearByPlaces?lat=${koordinat.lat}&lng=${koordinat.lng}&lang=tr`)
        .then(response => response.json())
        .then(yerler => {
            const sehirId = yerler[0].id; // İlk sonucu kullan
            
            // Şehir ID'si ile vakitleri al
            return fetch(`https://vakit.vercel.app/api/timings/${sehirId}`);
        })
        .then(response => response.json())
        .then(data => {
            const sahurVakti = new Date();
            const iftarVakti = new Date();
            
            const [sahurSaat, sahurDakika] = data.timings.Fajr.split(':');
            const [iftarSaat, iftarDakika] = data.timings.Maghrib.split(':');
            
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
                            <div class="vakit-saat">${data.timings.Fajr}</div>
                            <div class="geri-sayim">${formatSure(sahuraKalanSure)}</div>
                        </div>
                    `;
                } else {
                    aktifVakitElement.innerHTML = `
                        <div class="vakit-card">
                            <div class="vakit-baslik">İftar Vakti</div>
                            <div class="vakit-saat">${data.timings.Maghrib}</div>
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
