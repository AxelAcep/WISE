const dropArea = document.querySelector(".drag-area");
const dragText = document.querySelector(".header");
let button = dropArea.querySelector(".button");
let input = dropArea.querySelector("input");
let file;
let KodeAcaraUnik 
let LinkGambarUnik 

button.onclick = () => {
  input.click();
};

input.addEventListener("change", function () {
  file = this.files[0];
  dropArea.classList.add("active");
  displayFile();
});

dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload";
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop";
});

dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  file = event.dataTransfer.files[0];
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

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('Home').addEventListener('click', () => {
        window.location.href = "/mitra";
    });

    document.getElementById('Profil').addEventListener('click', () => {
        window.location.href = "/mitraprofile";
    });

    const user = window.localStorage.getItem('activeuser');

    if (user) {
        loadEvents(user);
    }

    document.querySelector('.ButtonMitra').addEventListener('click', async () => {

        if (!file) {
            alert('Please upload an image file.');
            return;
        }
    
        const formData = new FormData();
        formData.append('gambar', file);

        console.log(formData.get('gambar'));
    
        try {
            const response = await fetch('addacarapage/addimage', {
                method: 'POST',
                body: formData
            });
    
            if (response.ok) {
                const responseData = await response.json();
                KodeAcaraUnik = responseData.KodeAcaraUnik;
                LinkGambarUnik = responseData.fileName;
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
        const Paragraf1 = document.getElementById('Paragraph1').value;
        const Paragraf2 = document.getElementById('Paragraph2').value;
        const Paragraf3 = document.getElementById('Paragraph3').value;

        
        // Assuming the backend can handle file upload and form data together
        const formData2 = new FormData();
        formData2.append('KodeAcara', KodeAcara);
        formData2.append('KodeMitra', KodeMitra);
        formData2.append('NamaAcara', NamaAcara);
        formData2.append('Tanggal', Tanggal);
        formData2.append('Waktu', Waktu);
        formData2.append('Paragraf1', Paragraf1);
        formData2.append('Paragraf2', Paragraf2);
        formData2.append('Paragraf3', Paragraf3);
        formData2.append('NamaGambar', LinkGambar);

        try {
            const response = await fetch('addacarapage/addEvent', {
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
});

async function loadEvents(user) {
    try {
        const url = `addacarapage/detail?user=${encodeURIComponent(user)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (data.length > 0) {
            const userData = data[0];
            const namaElement = document.querySelector('.detail-date#Nama');
            const gambarElement = document.querySelector('.detail-organisasi #Gambar');
            const namatextElement = document.querySelector('.detail-date#NamaText');

            gambarElement.src = "Data/ProfileUser/" + userData.LinkProfil;
            namaElement.innerHTML = userData.Nama;
            namatextElement.innerHTML = "Beranda > " + userData.Nama + " > " + userData.KodeMitra;

        } else {
            console.error('No user data found');
        }

    } catch (error) {
        console.error('Error loading events:', error);
    }
}




