document.addEventListener('DOMContentLoaded', () => {
    loadEvents();

    document.getElementById('LihatUser0').addEventListener('click', () => {
        loadmahasiswa();
    });
    document.getElementById('LihatUser1').addEventListener('click', () => {
        loadmitra();
    });
    document.getElementById('AddUser').addEventListener('click', () => {
        adduser();
    });
});


async function loadEvents() {
    try {
        const user = window.localStorage.getItem('activeuser');
        const url = `admin/event`;

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

    events.filter(event => event.Status != 'Pending')
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
                    <p class="textdetail"> ${event.Status} </p>
                  </div>
              `;
              listEvent.appendChild(eventElement);

              // Tambahkan event listener di sini
              eventElement.addEventListener('click', () => {
                alert(`Acara Pending: ${event.KodeAcara}`);
                window.localStorage.setItem('activeEvent', event.KodeAcara);
                window.location.href = "/Editacarapage";   //Nanti diubah jadi Routi /
              });
          });

    events.filter(event => event.Status === 'Pending')
          .forEach(event => {
              const eventElement = document.createElement('div');
              eventElement.classList.add('Events', 'PendingEvent');

              const date = new Date(event.Tanggal);
              const options = { day: 'numeric', month: 'long', year: 'numeric' };
              const formattedDate = date.toLocaleDateString('id-ID', options);

              eventElement.innerHTML = `
                  <img class="Img0" src="Data/BannerImage/${event.LinkGambar}" alt="">
                  <div class="Event-Title">${event.NamaAcara} : ${event.Nama} </div>
                  <div class="Date"> ${formattedDate}</div>
              `;
              const DetailButton = document.createElement('div');
              DetailButton.classList.add('Detail')

              const YesButton = document.createElement('button');
              YesButton.type = 'button';
              YesButton.classList.add('btn', 'btn-outline-primary', 'buttonadmin');
              YesButton.id = 'b-Yes';
              YesButton.textContent = 'Yes';

              const NoButton = document.createElement('button');
              NoButton.type = 'button';
              NoButton.classList.add('btn', 'btn-outline-danger', 'buttonadmin');
              NoButton.id = 'b-No';
              NoButton.textContent = 'No';

              pendingEvent.appendChild(eventElement);
              eventElement.appendChild(DetailButton);
              DetailButton.appendChild(YesButton);
              DetailButton.appendChild(NoButton);

              var formData = new FormData();

              YesButton.addEventListener('click', async (e) => {
                e.stopPropagation();
                const userConfirmed = confirm(`Apakah benar acara ini diterima?: ${event.KodeAcara}`);
                if (userConfirmed) {
                    var formData = new FormData();
                    formData.append('yesorno', true);
                    formData.append('KodeAcara', event.KodeAcara);

                    const response = await fetch('admin/acc', {
                        method: 'POST',
                        body: formData
                    });
                    if(response.ok){
                        alert('Acara DITERIMA');
                        window.location.href = "admin";
                    }
                } else {
                    alert('Interaksi Dibatalkan');
                }
            });

            NoButton.addEventListener('click', async (e) => {
                e.stopPropagation();
                const userConfirmed = confirm(`Apakah benar acara ini Ditolak?: ${event.KodeAcara}`);
                if (userConfirmed) {
                    formData.append('yesorno', false);
                    formData.append('KodeAcara', event.KodeAcara);

                    const response = await fetch('admin/acc', {
                        method: 'POST',
                        body: formData
                    });
                    if(response.ok){
                        alert('Acara DITOLAK');
                        window.location.href = "admin";
                    }
                } else {
                    alert('Interaksi Dibatalkan');
                }
            });

            eventElement.addEventListener('click', () => {
                alert(`Acara Pending: ${event.KodeAcara}`);
                window.localStorage.setItem('activeEvent', event.KodeAcara);
                window.location.href = "/editpending";   //Nanti diubah jadi Routi /
              });


          });   
}

async function loadmahasiswa(){
    const tambahbutton = document.getElementById('SimpanHadir');
    tambahbutton.innerHTML = "Hapus";

    const url = `admin/usermahasiswa`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();

    const listDaftar = document.getElementById('ModalBody');
    listDaftar.innerHTML = '';

    data.forEach(data => {
      const eventElement = document.createElement('div');
      eventElement.classList.add('row');
      var diterimaditolak = ``;
      if(data.Status == "Masuk"){
        diterimaditolak = `checked`
      }

      eventElement.innerHTML = `
                          <p class = "col-2"> NIM : ${data.NIM} </p>
                          <P class = "col-4"> Nama : ${data.Nama} </P>
                          <p class = "col-4"> Status : Mahasiswa </p>
                          <div class="form-check col-2">
                            <input class="form-check-input" type="checkbox" value="${data.NIM}" id="flexCheckDefault" ${diterimaditolak}>
                            <label class="form-check-label" for="flexCheckDefault">
                            </label>
                          </div> 
      `;
      listDaftar.appendChild(eventElement);
    }) 


    document.querySelector('#SimpanHadir').addEventListener('click', async () => { 
        var checkboxes = document.querySelectorAll('.form-check-input');
        var checkedValues = [];
              
              checkboxes.forEach(function(checkbox) {
                  if (checkbox.checked) {
                      checkedValues.push(checkbox.value);
                  }
              });
    
              var formData3 = new FormData();
            
              checkedValues.forEach((value, index) => {
                formData3.append(`NIM`, value);
              }); 
    
              const response = await fetch('admin/hapusmahasiswa', {
                method: 'POST',
                body: formData3
              });
    
              if(response.status == 400){
                alert("User Berhasil Dihapus");
                window.location.href = "admin";
              }
      
    })
}



async function loadmitra(){
    const tambahbutton = document.getElementById('SimpanHadir');
    tambahbutton.innerHTML = "Hapus";

    const url = `admin/usermitra`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();

    const listDaftar = document.getElementById('ModalBody');
    listDaftar.innerHTML = '';

    data.forEach(data => {
      const eventElement = document.createElement('div');
      eventElement.classList.add('row');
      var diterimaditolak = ``;
      if(data.Status == "Masuk"){
        diterimaditolak = `checked`
      }

      eventElement.innerHTML = `
                          <p class = "col-2"> Kode : ${data.KodeMitra} </p>
                          <P class = "col-4"> Nama : ${data.Nama} </P>
                          <p class = "col-4"> Status : ${data.Status} </p>
                          <div class="form-check col-2">
                            <input class="form-check-input" type="checkbox" value="${data.KodeMitra}" id="flexCheckDefault" ${diterimaditolak}>
                            <label class="form-check-label" for="flexCheckDefault">
                          </div> 
      `;
      listDaftar.appendChild(eventElement);
    }) 


    document.querySelector('#SimpanHadir').addEventListener('click', async () => { 
        var checkboxes = document.querySelectorAll('.form-check-input');
        var checkedValues = [];
              
              checkboxes.forEach(function(checkbox) {
                  if (checkbox.checked) {
                      checkedValues.push(checkbox.value);
                  }
              });
    
              var formData3 = new FormData();
            
              checkedValues.forEach((value, index) => {
                formData3.append(`KodeMitra`, value);
              }); 
    
              const response = await fetch('admin/hapusmitra', {
                method: 'POST',
                body: formData3
              });
    
              if(response.status == 200){
                alert("User Berhasil Dihapus");
                window.location.href = "admin";
              }
      
    })
}

async function adduser() {
    
    const listDaftar = document.getElementById('ModalBody');
    listDaftar.innerHTML = '';  // Mengosongkan konten modal body

    const tambahbutton = document.getElementById('SimpanHadir');
    tambahbutton.innerHTML = "Tambah";

    // Membuat elemen div baru
    const eventElement = document.createElement('div');
    eventElement.classList.add('div');
    eventElement.innerHTML = `
        <div class="modal-body">
            <form>
            <div class="form-group">
                <label for="kodeUser" class="col-form-label">KodeUser: </label>
                <input class="form-control" id="kodeUser" type="text">
            </div>

            <div class="form-group">
                <label for="nama" class="col-form-label">Nama: </label>
                <input class="form-control" id="nama" type="text">
            </div>

            <div class="form-group">
                <label for="password" class="col-form-label">Password: </label>
                <input class="form-control" id="password" type="text">
            </div>

            <div class="form-check">
                <input class="form-check-input" type="radio" name="userType" id="exampleRadios1" value="Mahasiswa">
                <label class="form-check-label" for="exampleRadios1">Mahasiswa</label>
            </div>

            <div class="form-check">
                <input class="form-check-input" type="radio" name="userType" id="exampleRadios2" value="Mitra-Dalam">
                <label class="form-check-label" for="exampleRadios2">Mitra-Dalam</label>
            </div>

            <div class="form-check">
                <input class="form-check-input" type="radio" name="userType" id="exampleRadios3" value="Mitra-Luar">
                <label class="form-check-label" for="exampleRadios3">Mitra-Luar</label>
            </div>


                
            </form>
        </div>
    `;

    // Menambahkan elemen div baru ke dalam modal body
    listDaftar.appendChild(eventElement);

    document.querySelector('#SimpanHadir').addEventListener('click', async () => { 
        const kodeUser = document.getElementById('kodeUser').value;
        const nama = document.getElementById('nama').value;
        const password = document.getElementById('password').value;
        const userType = document.querySelector('input[name="userType"]:checked').value;
    
        const formData2 = new FormData();
        if(userType == "Mahasiswa") {
            formData2.append('NIM', kodeUser);
            formData2.append('Nama', nama);
            formData2.append('password', password);

            const response = await fetch('admin/addmahasiswa', {
                method: 'POST',
                body: formData2
            });
             window.location.href = "admin";
        } 
        
        else{
            formData2.append('KodeMitra', kodeUser);
            formData2.append('Nama', nama);
            formData2.append('password', password);
            if(userType == "Mitra-Luar"){
                formData2.append('status', "Luar" )
            } else{
                formData2.append('status', "Dalam" )
            }

            const response = await fetch('admin/addmitra', {
                method: 'POST',
                body: formData2
            });
             window.location.href = "admin";
        }
      
    })
}