const aktifVakitElement = document.getElementById('aktif-vakit');
const sehirlerElement = document.getElementById('sehirler');
let sayacId;

// Şehir bilgileri
const sehirler = {
    "İstanbul": { ulke: "Turkey", sehir: "Istanbul" },
    "Adana": { ulke: "Turkey", sehir: "Adana" },
    "Adıyaman": { ulke: "Turkey", sehir: "Adiyaman" },
    "Afyonkarahisar": { ulke: "Turkey", sehir: "Afyonkarahisar" },
    "Ağrı": { ulke: "Turkey", sehir: "Agri" },
    "Aksaray": { ulke: "Turkey", sehir: "Aksaray" },
    "Amasya": { ulke: "Turkey", sehir: "Amasya" },
    "Ankara": { ulke: "Turkey", sehir: "Ankara" },
    "Antalya": { ulke: "Turkey", sehir: "Antalya" },
    "Ardahan": { ulke: "Turkey", sehir: "Ardahan" },
    "Artvin": { ulke: "Turkey", sehir: "Artvin" },
    "Aydın": { ulke: "Turkey", sehir: "Aydin" },
    "Balıkesir": { ulke: "Turkey", sehir: "Balikesir" },
    "Bartın": { ulke: "Turkey", sehir: "Bartin" },
    "Batman": { ulke: "Turkey", sehir: "Batman" },
    "Bayburt": { ulke: "Turkey", sehir: "Bayburt" },
    "Bilecik": { ulke: "Turkey", sehir: "Bilecik" },
    "Bingöl": { ulke: "Turkey", sehir: "Bingol" },
    "Bitlis": { ulke: "Turkey", sehir: "Bitlis" },
    "Bolu": { ulke: "Turkey", sehir: "Bolu" },
    "Burdur": { ulke: "Turkey", sehir: "Burdur" },
    "Bursa": { ulke: "Turkey", sehir: "Bursa" },
    "Çanakkale": { ulke: "Turkey", sehir: "Canakkale" },
    "Çankırı": { ulke: "Turkey", sehir: "Cankiri" },
    "Çorum": { ulke: "Turkey", sehir: "Corum" },
    "Denizli": { ulke: "Turkey", sehir: "Denizli" },
    "Diyarbakır": { ulke: "Turkey", sehir: "Diyarbakir" },
    "Düzce": { ulke: "Turkey", sehir: "Duzce" },
    "Edirne": { ulke: "Turkey", sehir: "Edirne" },
    "Elazığ": { ulke: "Turkey", sehir: "Elazig" },
    "Erzincan": { ulke: "Turkey", sehir: "Erzincan" },
    "Erzurum": { ulke: "Turkey", sehir: "Erzurum" },
    "Eskişehir": { ulke: "Turkey", sehir: "Eskisehir" },
    "Gaziantep": { ulke: "Turkey", sehir: "Gaziantep" },
    "Giresun": { ulke: "Turkey", sehir: "Giresun" },
    "Gümüşhane": { ulke: "Turkey", sehir: "Gumushane" },
    "Hakkâri": { ulke: "Turkey", sehir: "Hakkari" },
    "Hatay": { ulke: "Turkey", sehir: "Hatay" },
    "Iğdır": { ulke: "Turkey", sehir: "Igdir" },
    "Isparta": { ulke: "Turkey", sehir: "Isparta" },
    "İzmir": { ulke: "Turkey", sehir: "Izmir" },
    "Kahramanmaraş": { ulke: "Turkey", sehir: "Kahramanmaras" },
    "Karabük": { ulke: "Turkey", sehir: "Karabuk" },
    "Karaman": { ulke: "Turkey", sehir: "Karaman" },
    "Kars": { ulke: "Turkey", sehir: "Kars" },
    "Kastamonu": { ulke: "Turkey", sehir: "Kastamonu" },
    "Kayseri": { ulke: "Turkey", sehir: "Kayseri" },
    "Kırıkkale": { ulke: "Turkey", sehir: "Kirikkale" },
    "Kırklareli": { ulke: "Turkey", sehir: "Kirklareli" },
    "Kırşehir": { ulke: "Turkey", sehir: "Kirsehir" },
    "Kilis": { ulke: "Turkey", sehir: "Kilis" },
    "Kocaeli": { ulke: "Turkey", sehir: "Kocaeli" },
    "Konya": { ulke: "Turkey", sehir: "Konya" },
    "Kütahya": { ulke: "Turkey", sehir: "Kutahya" },
    "Malatya": { ulke: "Turkey", sehir: "Malatya" },
    "Manisa": { ulke: "Turkey", sehir: "Manisa" },
    "Mardin": { ulke: "Turkey", sehir: "Mardin" },
    "Mersin": { ulke: "Turkey", sehir: "Mersin" },
    "Muğla": { ulke: "Turkey", sehir: "Mugla" },
    "Muş": { ulke: "Turkey", sehir: "Mus" },
    "Nevşehir": { ulke: "Turkey", sehir: "Nevsehir" },
    "Niğde": { ulke: "Turkey", sehir: "Nigde" },
    "Ordu": { ulke: "Turkey", sehir: "Ordu" },
    "Osmaniye": { ulke: "Turkey", sehir: "Osmaniye" },
    "Rize": { ulke: "Turkey", sehir: "Rize" },
    "Sakarya": { ulke: "Turkey", sehir: "Sakarya" },
    "Samsun": { ulke: "Turkey", sehir: "Samsun" },
    "Siirt": { ulke: "Turkey", sehir: "Siirt" },
    "Sinop": { ulke: "Turkey", sehir: "Sinop" },
    "Sivas": { ulke: "Turkey", sehir: "Sivas" },
    "Şanlıurfa": { ulke: "Turkey", sehir: "Sanliurfa" },
    "Şırnak": { ulke: "Turkey", sehir: "Sirnak" },
    "Tekirdağ": { ulke: "Turkey", sehir: "Tekirdag" },
    "Tokat": { ulke: "Turkey", sehir: "Tokat" },
    "Trabzon": { ulke: "Turkey", sehir: "Trabzon" },
    "Tunceli": { ulke: "Turkey", sehir: "Tunceli" },
    "Uşak": { ulke: "Turkey", sehir: "Usak" },
    "Van": { ulke: "Turkey", sehir: "Van" },
    "Yalova": { ulke: "Turkey", sehir: "Yalova" },
    "Yozgat": { ulke: "Turkey", sehir: "Yozgat" },
    "Zonguldak": { ulke: "Turkey", sehir: "Zonguldak" }
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
