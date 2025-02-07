const aktifVakitElement = document.getElementById('aktif-vakit');
const sehirlerElement = document.getElementById('sehirler');
let sayacId;

// Sayfa yüklendiğinde İstanbul'u otomatik seç
window.addEventListener('DOMContentLoaded', (event) => {
    sehirlerElement.value = "İstanbul";
    // İstanbul için vakitleri getir
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

    fetch(`https://iftaranekadarkaldi.com/sehir/5041/istanbul-iftar-saati`)
        .then(response => response.text())
        .then(html => {
            // HTML içeriğini parse etmek için bir DOM parser kullanıyoruz
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Vakitleri siteden çekiyoruz
            const imsak = doc.querySelector('.imsak-vakti').textContent.trim();
            const aksam = doc.querySelector('.aksam-vakti').textContent.trim();

            const sahurVakti = new Date();
            const iftarVakti = new Date();
            
            sahurVakti.setHours(...imsak.split(':'));
            iftarVakti.setHours(...aksam.split(':'));

            sayacId = setInterval(() => {
                const simdikiZaman = new Date();
                const sahuraKalanSure = sahurVakti - simdikiZaman;
                const iftaraKalanSure = iftarVakti - simdikiZaman;

                if (Math.abs(sahuraKalanSure) < Math.abs(iftaraKalanSure)) {
                    aktifVakitElement.innerHTML = `
                        <div class="vakit-card">
                            <div class="vakit-baslik">Sahur Vakti</div>
                            <div class="vakit-saat">${imsak}</div>
                            <div class="geri-sayim">${formatSure(sahuraKalanSure)}</div>
                        </div>
                    `;
                } else {
                    aktifVakitElement.innerHTML = `
                        <div class="vakit-card">
                            <div class="vakit-baslik">İftar Vakti</div>
                            <div class="vakit-saat">${aksam}</div>
                            <div class="geri-sayim">${formatSure(iftaraKalanSure)}</div>
                        </div>
                    `;
                }
            }, 1000);
        })
        .catch(error => console.error('Hata:', error));
}

function formatSure(ms) {
    if (ms < 0) ms = Math.abs(ms);
    const saniye = Math.floor((ms / 1000) % 60);
    const dakika = Math.floor((ms / 1000 / 60) % 60);
    const saat = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${saat} saat ${dakika} dakika ${saniye} saniye`;
}
