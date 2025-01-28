    const sahurElement = document.getElementById('sahur');
    const iftarElement = document.getElementById('iftar');
    const sehirlerElement = document.getElementById('sehirler');
    let sayacId; // Sayacı durdurmak için sayaç kimliğini saklayın

    sehirlerElement.addEventListener('change', function() {
        const sehir = this.value;
        if (sehir) {
            // Yeni bir şehir seçildiğinde eski sayacı durdurun
            if (sayacId) {
                clearInterval(sayacId);
            }

            fetch(`https://api.aladhan.com/v1/timingsByCity?city=${sehir}&country=Turkey&method=18`)
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

                        sahurElement.textContent = 'Sahur\'a Kalan Süre: ' + formatSure(sahuraKalanSure);
                        iftarElement.textContent = 'İftar\'a Kalan Süre: ' + formatSure(iftaraKalanSure);
                    }, 1000);
                })
                .catch(error => console.error('Hata:', error));
        }
    });

    function formatSure(ms) {
        const saniye = Math.floor((ms / 1000) % 60);
        const dakika = Math.floor((ms / 1000 / 60) % 60);
        const saat = Math.floor((ms / (1000 * 60 * 60)) % 24);
        return saat + ' saat ' + dakika + ' dakika ' + saniye + ' saniye';
    }
