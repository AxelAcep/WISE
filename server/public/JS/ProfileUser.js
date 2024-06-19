document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('Home').addEventListener('click', () => {
        window.location.href = "/user";
    });

    document.getElementById('Profile').addEventListener('click', () => {
        window.location.href = "/userprofile";
    });
    document.getElementById('Riwayat').addEventListener('click', () => {
        window.location.href = "/riwayat";
    });
    const user = window.localStorage.getItem('activeuser');

    if (user) {
        loadEvents(user); // Call loadEvents with user as an argument
    }
});

async function loadEvents(user) {
    try {
        const url = `userprofile/detail?user=${encodeURIComponent(user)}`;
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
            const nimElement = document.querySelector('.tabelprofil #NIM');
            const gambarElement = document.querySelector('.Profile-userimg');

            gambarElement.src = "Data/ProfileUser/" + userData.LinkProfil;
            namaElement.innerHTML = userData.Nama; // Use innerHTML to render HTML content
            nimElement.innerHTML = userData.NIM;

            const namaBesarElement = document.getElementById('NamaBesar');
            namaBesarElement.textContent = userData.Nama;

          } else {
            console.error('No user data found');
        }

    } catch (error) {
        console.error('Error loading events:', error);
    }
}
