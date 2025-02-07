const aktifVakitElement = document.getElementById('aktif-vakit');
const sehirlerElement = document.getElementById('sehirler');
let sayacId;

// Şehir bilgileri
const sehirler = {
    "İstanbul": { ulke: "Turkey", sehir: "Istanbul" },
    "Ankara": { ulke: "Turkey", sehir: "Ankara" },
    "İzmir": { ulke: "Turkey", sehir: "Izmir" },
    "Bursa": { ulke: "Turkey", sehir: "Bursa" },
    "Antalya": { ulke: "Turkey", sehir: "Antalya" }
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

    const sehirBilgi = sehirler[sehir];
    const bugun = new Date();
    
    // Aladhan API'si için URL oluştur
    const apiUrl = `https://api.aladhan.com/v1/timingsByCity/${bugun.getDate()}-${bugun.getMonth() + 1}-${bugun.getFullYear()}?city=${sehirBilgi.sehir}&country=${sehirBilgi.ulke}&method=13`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const vakitler = data.data.timings;
            
            const sahurVakti = new Date();
            const iftarVakti = new Date();
            
            const [sahurSaat, sahurDakika] = vakitler.Fajr.split(':');
            const [iftarSaat, iftarDakika] = vakitler.Maghrib.split(':');
            
            sahurVakti.setHours(parseInt(sahurSaat), parseInt(sahurDakika), 0);
            iftarVakti.setHours(parseInt(iftarSaat), parseInt(iftarDakika), 0);

            // Eğer vakit geçmişse, sonraki güne ayarla
            if (sahurVakti < new Date()) {
                sahurVakti.setDate(sahurVakti.getDate() + 1);
                // Sonraki günün vakitlerini al
                const sonrakiGun = new Date(bugun);
                sonrakiGun.setDate(sonrakiGun.getDate() + 1);
                fetch(`https://api.aladhan.com/v1/timingsByCity/${sonrakiGun.getDate()}-${sonrakiGun.getMonth() + 1}-${sonrakiGun.getFullYear()}?city=${sehirBilgi.sehir}&country=${sehirBilgi.ulke}&method=13`)
                    .then(response => response.json())
                    .then(sonrakiData => {
                        const [yeniSaat, yeniDakika] = sonrakiData.data.timings.Fajr.split(':');
                        sahurVakti.setHours(parseInt(yeniSaat), parseInt(yeniDakika), 0);
                    });
            }

            if (iftarVakti < new Date()) {
                iftarVakti.setDate(iftarVakti.getDate() + 1);
                // Sonraki günün vakitlerini al
                const sonrakiGun = new Date(bugun);
                sonrakiGun.setDate(sonrakiGun.getDate() + 1);
                fetch(`https://api.aladhan.com/v1/timingsByCity/${sonrakiGun.getDate()}-${sonrakiGun.getMonth() + 1}-${sonrakiGun.getFullYear()}?city=${sehirBilgi.sehir}&country=${sehirBilgi.ulke}&method=13`)
                    .then(response => response.json())
                    .then(sonrakiData => {
                        const [yeniSaat, yeniDakika] = sonrakiData.data.timings.Maghrib.split(':');
                        iftarVakti.setHours(parseInt(yeniSaat), parseInt(yeniDakika), 0);
                    });
            }

            sayacId = setInterval(() => {
                const simdikiZaman = new Date();
                const sahuraKalanSure = sahurVakti - simdikiZaman;
                const iftaraKalanSure = iftarVakti - simdikiZaman;

                if (Math.abs(sahuraKalanSure) < Math.abs(iftaraKalanSure)) {
                    aktifVakitElement.innerHTML = `
                        <div class="vakit-card">
                            <div class="vakit-baslik">Sahur Vakti</div>
                            <div class="vakit-saat">${vakitler.Fajr}</div>
                            <div class="geri-sayim">${formatSure(sahuraKalanSure)}</div>
                            <div class="sehir-bilgisi">${sehir}</div>
                        </div>
                    `;
                } else {
                    aktifVakitElement.innerHTML = `
                        <div class="vakit-card">
                            <div class="vakit-baslik">İftar Vakti</div>
                            <div class="vakit-saat">${vakitler.Maghrib}</div>
                            <div class="geri-sayim">${formatSure(iftaraKalanSure)}</div>
                            <div class="sehir-bilgisi">${sehir}</div>
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
