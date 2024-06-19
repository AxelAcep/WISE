document.getElementById('Home').addEventListener('click', async () => {
    window.location.href = "/user";
})

document.getElementById('Profile').addEventListener('click', async () => {
    window.location.href = "/userprofile";
})
document.getElementById('Riwayat').addEventListener('click', () => {
    window.location.href = "/riwayat";
});

async function loadEvents() {
    try {
        const response = await fetch('user/event');
        const events = await response.json();

        const listEvent = document.getElementById('ListEvent');

        // Kosongkan konten di dalam listEvent
        listEvent.innerHTML = '';

        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.classList.add('Events');

            if(event.Status == "Berjalan"){
                const date = new Date(event.Tanggal);
                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                const formattedDate = date.toLocaleDateString('id-ID', options);
    
                eventElement.innerHTML = `
                    <img class="Img0" src="Data/BannerImage/${event.LinkGambar}" alt="">
                    <div class="Event-Title">${event.NamaAcara}</div>
                    <div class="Date"> Berakhir: ${formattedDate}</div>
                    <div class="Detail">
                        <img class="Img10" src= "Data/ProfileUser/${event.LinkProfil}" alt="">
                        <p class="textdetail"> ${event.Nama} </p>
                    </div>
                `;
    //${event.LinkGambar}</
                listEvent.appendChild(eventElement);   
                eventElement.addEventListener('click', () => {
                    window.localStorage.setItem('activeEvent', event.KodeAcara);
                    window.location.href = "/useracara";   //Nanti diubah jadi Routi /
                  });
            }
        });
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadEvents);
