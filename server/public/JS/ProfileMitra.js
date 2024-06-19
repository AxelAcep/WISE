document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('Home').addEventListener('click', () => {
        window.location.href = "/mitra";
    });
    
    document.getElementById('Profil').addEventListener('click', () => {
        window.location.href = "/mitraprofile";
    });

    const user = window.localStorage.getItem('activeuser');

    if (user) {
        loadEvents(user); // Call loadEvents with user as an argument
    }
});

async function loadEvents(user) {
    try {
        const url = `mitraprofile/detail?user=${encodeURIComponent(user)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        
        if (data.length > 0) {
            const userData = data[0];
            const namaElement = document.querySelector('.tabelprofil #Nama'); 
            const nimElement = document.querySelector('.tabelprofil #Kode');
            const status = document.querySelector('.tabelprofil #status');
            const acara0 = document.querySelector('.tabelprofil #acara0');
            const acara1 = document.querySelector('.tabelprofil #acara1');
            const acara2 = document.querySelector('.tabelprofil #acara2');
            const gambarElement = document.querySelector('.Profile-userimg');

            gambarElement.src = "Data/ProfileUser/" + userData.LinkProfil;
            namaElement.innerHTML = userData.Nama; 
            nimElement.innerHTML = userData.KodeMitra;
            status.innerHTML = userData.Status;
            acara0.innerHTML = userData.acaraberjalan;
            acara1.innerHTML = userData.acarapending;
            acara2.innerHTML = userData.totalacara;
        
            const namaBesarElement = document.getElementById('NamaBesar');
            namaBesarElement.textContent = userData.Nama;

          } else {
            console.error('No user data found');
        }

    } catch (error) {
        console.error('Error loading events:', error);
    }
}
