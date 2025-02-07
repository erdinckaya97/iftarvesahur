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

        fetch(`https://api.aladhan.com/v1/timingsByCity?city=${sehir}&country=Turkey&method=kaya`)
            .then(response => response.json())
            .then(data => {
                const sahurVakti = new Date();
                const iftarVakti = new Date();
                sahurVakti.setHours(...data.data.timings.Fajr.split(':'));
                iftarVakti.setHours(...data.data.timings.Maghrib.split(':'));

                sayacId = setInterval(() => {
                    const simdikiZaman = new Date();
                    const sahuraKalanSure = sahurVakti - simdikiZaman;
                    const iftaraKalanSure = iftarVakti - simdikiZaman;

                    if (Math.abs(sahuraKalanSure) < Math.abs(iftaraKalanSure)) {
                        aktifVakitElement.innerHTML = `
                            <div class="vakit-card">
                                <div class="vakit-baslik">Sahur Vakti</div>
                                <div class="vakit-saat">${data.data.timings.Fajr}</div>
                                <div class="geri-sayim">${formatSure(sahuraKalanSure)}</div>
                            </div>
                        `;
                    } else {
                        aktifVakitElement.innerHTML = `
                            <div class="vakit-card">
                                <div class="vakit-baslik">İftar Vakti</div>
                                <div class="vakit-saat">${data.data.timings.Maghrib}</div>
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
