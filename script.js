const aktifVakitElement = document.getElementById('aktif-vakit');
const sehirlerElement = document.getElementById('sehirler');
let sayacId;

const API_KEY = "your_token"; // CollectAPI token'ınızı buraya yazın

// Sayfa yüklendiğinde İstanbul'u otomatik seç
window.addEventListener('DOMContentLoaded', (event) => {
    sehirlerElement.value = "istanbul";
    vakitleriGuncelle("istanbul");
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

    fetch(`https://api.collectapi.com/pray/all?data.city=${sehir}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `apikey ${API_KEY}`
        }
    })
        .then(response => response.json())
        .then(data => {
            const vakitler = data.result;
            
            const sahurVakti = new Date();
            const iftarVakti = new Date();
            
            const [sahurSaat, sahurDakika] = vakitler[0].Imsak.split(':');
            const [iftarSaat, iftarDakika] = vakitler[0].Aksam.split(':');
            
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
                            <div class="vakit-saat">${vakitler[0].Imsak}</div>
                            <div class="geri-sayim">${formatSure(sahuraKalanSure)}</div>
                        </div>
                    `;
                } else {
                    aktifVakitElement.innerHTML = `
                        <div class="vakit-card">
                            <div class="vakit-baslik">İftar Vakti</div>
                            <div class="vakit-saat">${vakitler[0].Aksam}</div>
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
