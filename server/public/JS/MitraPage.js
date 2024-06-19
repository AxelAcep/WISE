document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('Home').addEventListener('click', () => {
        window.location.href = "/mitra";
    });
    document.getElementById('Profil').addEventListener('click', () => {
        window.location.href = "/mitraprofile";
    });
    document.getElementById('Add').addEventListener('click', () => {
        window.location.href = "/addacarapage";
    });
    loadEvents();
});

async function loadEvents() {
    try {
        const user = window.localStorage.getItem('activeuser');
        const url = `mitra/event?user=${encodeURIComponent(user)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const events = await response.json();
        displayEvents(events);

    } catch (error) {
        console.error('Error loading events:', error);
    }
}

function displayEvents(events) {
    const listEvent = document.querySelector('.Recap');
    const pendingEvent = document.querySelector('.Pending');
    
    // Clear previous events if any
    listEvent.innerHTML = '';
    pendingEvent.innerHTML = '';

    events.filter(event => event.status !== 'Pending')
          .forEach(event => {
              const eventElement = document.createElement('div');
              eventElement.classList.add('Events');

              const date = new Date(event.Tanggal);
              const options = { day: 'numeric', month: 'long', year: 'numeric' };
              const formattedDate = date.toLocaleDateString('id-ID', options);

              eventElement.innerHTML = `
                  <img class="Img0" src="Data/BannerImage/${event.LinkGambar}" alt="">
                  <div class="Event-Title">${event.NamaAcara}</div>
                  <div class="Date"> Berakhir: ${formattedDate}</div>
                  <div class="Detail">
                    <p class="textdetail"> Status: </p>
                    <p class="textdetail"> ${event.status} </p>
                  </div>
              `;
              listEvent.appendChild(eventElement);

              // Tambahkan event listener di sini
              eventElement.addEventListener('click', () => {
                alert(`Acara Pending: ${event.KodeAcara}`);
                window.localStorage.setItem('activeEvent', event.KodeAcara);
                if(event.status == 'Berakhir'){
                    window.location.href = "/editpending";  
                }
                else if(event.status == 'Berjalan'){
                    window.location.href = "/editacarapage";   
                }
              });
          });

    events.filter(event => event.status === 'Pending')
          .forEach(event => {
              const eventElement = document.createElement('div');
              eventElement.classList.add('Events', 'PendingEvent');

              const date = new Date(event.Tanggal);
              const options = { day: 'numeric', month: 'long', year: 'numeric' };
              const formattedDate = date.toLocaleDateString('id-ID', options);

              eventElement.innerHTML = `
                  <img class="Img0" src="Data/BannerImage/${event.LinkGambar}" alt="">
                  <div class="Event-Title">${event.NamaAcara}</div>
                  <div class="Date"> ${formattedDate}</div>
                  <div class="Detail">
                    <p class="textdetail"> Status: </p>
                    <p class="textdetail"> ${event.status} </p>
                  </div>
              `;
              pendingEvent.appendChild(eventElement);

              // Tambahkan event listener di sini
              eventElement.addEventListener('click', () => {
                  alert(`Acara Pending: ${event.KodeAcara}`);
                  window.localStorage.setItem('activeEvent', event.KodeAcara);
                  window.location.href = "/editpending";   //Nanti diubah jadi Routi /
              });
          });
}
