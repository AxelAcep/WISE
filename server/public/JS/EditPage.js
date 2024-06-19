const dropArea = document.querySelector(".drag-area");
const dragText = document.querySelector(".header");
let button = dropArea.querySelector(".button");
let input = dropArea.querySelector("input");
let file;
let KodeAcaraUnik 
let LinkGambarUnik 
let DaftarSiswa = [];

const KDAcara = window.localStorage.getItem('activeEvent');
const user = window.localStorage.getItem('activeuser');

document.addEventListener('DOMContentLoaded', function() {
  let imgTag = `<img src="/Data/BannerImage/${KDAcara}.jpg" alt="">`;
  dropArea.innerHTML = imgTag;
  loadEvents(KDAcara);
  loadHadir(KDAcara);

  document.getElementById('Home').addEventListener('click', () => {
      window.location.href = "/mitra";
  });

  document.getElementById('Profil').addEventListener('click', () => {
      window.location.href = "/mitraprofile";
  });
});


button.onclick = () => {
  input.click();
};

input.addEventListener("change", function () {
  file = this.files[0];
  dropArea.classList.add("active");
  displayFile();
});

function displayFile() {
  let fileType = file.type;
  let validExtensions = ["image/jpeg", "image/jpg", "image/png"];

  if (validExtensions.includes(fileType)) {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      let fileURL = fileReader.result;
      let imgTag = `<img src="${fileURL}" alt="">`;
      dropArea.innerHTML = imgTag;
    };
    fileReader.readAsDataURL(file);
  } else {
    alert("This is not an Image File");
    dropArea.classList.remove("active");
  }
}

const removeButton = document.getElementById("RemoveIMG");

removeButton.addEventListener("click", function() {
  input.value = ""; 
  input.click(); 
});

async function loadEvents(KDAcara) {
  try{
      const url = `editacarapage/event?KDAcara=${encodeURIComponent(KDAcara)}`;
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      });
      const data = await response.json();
      
      const userData = data[0];
      const namaElement = document.querySelector('.detail-date#Nama');
      const gambarElement = document.querySelector('.detail-organisasi #Gambar');
      const namatextElement = document.querySelector('.detail-date#NamaText');

      gambarElement.src = "Data/ProfileUser/" + userData.LinkProfil;
      namaElement.innerHTML = userData.Nama;
      namatextElement.innerHTML = "Beranda > " + userData.Nama + " > " + userData.KodeAcara;
      
      const date = new Date(userData.Tanggal);
      const options = { day: 'numeric', month: 'long', year: 'numeric' };

      const NamaAcara = document.getElementById('exampleInputEmail1');
      const Tanggal = document.getElementById('exampleInputEmail2');
      const Waktu = document.getElementById('exampleInputEmail3');

      NamaAcara.value  = userData.NamaAcara
      Tanggal.value = userData.Tanggal;
      Waktu.value = userData.Waktu;

      const p1 = document.getElementById('Text1');
      const p2 = document.getElementById('Text2');
      const p3 = document.getElementById('Text3');

      p1.value = userData.text0;
      p2.value = userData.text1;
      p3.value = userData.text2;

  } catch(error){

  }

} 

document.querySelector('.ButtonMitra').addEventListener('click', async () => {

  if (!file) {
      alert('Please upload an image file.');
      return;
  }

  const formData = new FormData();
  formData.append('gambar', file);
  formData.append('KodeAcara', KDAcara);

  try {
      const response = await fetch('editacarapage/addimage', {
          method: 'POST',
          body: formData
      });

      if (response.ok) {
          const responseData = await response.json();
          KodeAcaraUnik = responseData.KodeAcaraUnik;
          LinkGambarUnik = responseData.LinkGambarUnik;
      } else {
          alert('Failed to upload image');
      }
  } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
  }

  const KodeMitra = user;
  const KodeAcara = KodeAcaraUnik;
  const LinkGambar = LinkGambarUnik;
  
  const NamaAcara = document.getElementById('exampleInputEmail1').value;
  const Tanggal = document.getElementById('exampleInputEmail2').value; 
  const Waktu = document.getElementById('exampleInputEmail3').value;
  const p1 = document.getElementById('Text1').value;
  const p2 = document.getElementById('Text2').value;
  const p3 = document.getElementById('Text3').value;

  
  // Assuming the backend can handle file upload and form data together
  const formData2 = new FormData();
  formData2.append('KodeAcara', KodeAcara);
  formData2.append('KodeMitra', KodeMitra);
  formData2.append('NamaAcara', NamaAcara);
  formData2.append('Tanggal', Tanggal);
  formData2.append('Waktu', Waktu);
  formData2.append('Paragraf1', p1);
  formData2.append('Paragraf2', p2);
  formData2.append('Paragraf3', p3);
  formData2.append('NamaGambar', LinkGambar); 
  console.log(formData2);

  
  try {
      const response = await fetch('editacarapage/addEvent', {
          method: 'POST',
          body: formData2
      });

      if (response.ok) {
          alert('Event added successfully');
          window.location.reload();
      } else {
          alert('Failed to add event');
      }
  } catch (error) {
      console.error('Error adding event:', error);
      alert('Error adding event');
  } 
});  


async function loadHadir(KDAcara){
  //alert("Hadi Bos " + KDAcara);

  const url = `editacarapage/hadir?KodeAcara=${encodeURIComponent(KDAcara)}`;
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
                            <p class = "col-4"> Link : ${data.LinkDetail} </p>
                            <div class="form-check col-2">
                              <input class="form-check-input" type="checkbox" value="${data.NIM}" id="flexCheckDefault" ${diterimaditolak}>
                              <label class="form-check-label" for="flexCheckDefault">
                                Lulus
                              </label>
                            </div> 
        `;
        listDaftar.appendChild(eventElement);
      })
}

document.querySelector('#SimpanHadir').addEventListener('click', async () => {
  //alert("Simpaaan UOOOHG")
  const KDAcara = window.localStorage.getItem('activeEvent');
  var checkboxes = document.querySelectorAll('.form-check-input');
  var checkedValues = [];
  var uncheckedValues = [];
        
        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                checkedValues.push(checkbox.value);
            } else{
                uncheckedValues.push(checkbox.value);
            }
        });

        //alert("Checked values: " + checkedValues.join(', '));  
        //alert("UnChecked values: " + uncheckedValues.join(', '));     

        var formData3 = new FormData();
        
        checkedValues.forEach((value, index) => {
          formData3.append(`NIM`, value);
        }); 

        uncheckedValues.forEach((value, index) => {
          formData3.append(`NIM0`, value);
        }); 

        formData3.append(`KodeAcara`,KDAcara);

        const response = await fetch('editacarapage/addhadir', {
          method: 'POST',
          body: formData3
        });

        if(response.status == 200){
          alert("Daftar Hadir Telah Terupdate!")
        }
        else if(response.status == 400){
          alert("Tidak Ada Mahasiswa Dipilih")
        }
})

document.querySelector('.ButtonMitra1').addEventListener('click', async () => { 
  console.log('KDAcara:', KDAcara); // Tambahkan ini untuk debug
  const userConfirmed = confirm(`Apakah benar acara ini Akan di Selesaikan? ` + KDAcara);
  if (userConfirmed) {

    var formData3 = new FormData();
    formData3.append('yesorno', 'Berakhir');
    formData3.append('KodeAcara', KDAcara);

    //alert(formData3.get('KodeAcara'));
    //alert(formData3.get('yesorno'));

    const response = await fetch('editacarapage/acc', {
      method: 'POST',
      body: formData3
  });
    if (response.ok) {
      alert('Acara Sudah Selesai');
      window.location.href = "mitra";
    } else {
      alert('Terjadi kesalahan saat memperbarui status acara');
    }
  } else {
    alert('Interaksi Dibatalkan');
  }
});
