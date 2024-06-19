document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('Home').addEventListener('click', () => {
        window.location.href = "/user";
    });
    document.getElementById('Profil').addEventListener('click', () => {
        window.location.href = "/userprofile";
    });
    document.getElementById('Riwayat').addEventListener('click', () => {
        window.location.href = "/riwayat";
    });
    const KDAcara = window.localStorage.getItem('activeEvent');
    const user = window.localStorage.getItem('activeuser');

    loadEvents(KDAcara, user)
    
});


async function loadEvents(KDAcara, user) {
    try{
        const url = `useracara/event?KDAcara=${encodeURIComponent(KDAcara)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        
        const userData = data[0];
        
        const date = new Date(userData.Tanggal);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('id-ID', options);

        const namaElement = document.querySelector('#Nama');
        const gambarElement = document.querySelector('#Gambar');
        const namatextElement = document.querySelector('#NamaText');
        const namaAcaraElement = document.querySelector('#NamaAcara');
        const TanggalElement = document.querySelector('#Tanggal');
        const JamElement = document.querySelector('#JamAcara');
        const bannerElement = document.querySelector('#banner');
        const p1Element = document.querySelector('#Paragraf1');
        const p2Element = document.querySelector('#Paragraf3');
        const p3Element = document.querySelector('#Paragraf2');
        const TextNim = document.querySelector('#TextNIM');



        gambarElement.src = "Data/ProfileUser/" + userData.LinkProfil;
        namaElement.innerHTML = userData.Nama;
        namatextElement.innerHTML = "Beranda > " + userData.Nama + " > " + userData.KodeAcara;
        namaAcaraElement.innerHTML = userData.NamaAcara;
        TanggalElement.innerHTML = formattedDate;
        JamElement.innerHTML = userData.Waktu;
        bannerElement.src = "Data/BannerImage/" + userData.LinkGambar;
        p1Element.innerHTML = userData.text0
        p2Element.innerHTML = userData.text1
        p3Element.innerHTML = userData.text2
        TextNim.innerHTML = "NIM : " + user;
    } catch(error){

    }

} 


document.getElementById('DaftarButton').addEventListener('click', async () => {
    const KDAcara = window.localStorage.getItem('activeEvent');
    const user = window.localStorage.getItem('activeuser');
    const LinkDetail = document.getElementById('LinkDetail').value;

    const formData = new FormData();
    formData.append('KodeAcara', KDAcara);
    formData.append('KodeUser', user);
    formData.append('LinkDetail', LinkDetail);
    formData.append('Status', "Ditolak");

    const response = await fetch('useracara/daftar', {
        method: 'POST',
        body: formData
    })

    if(response.status == 400 ){
        alert("Anda Sudah Pernah Mendaftar!")
    }

    if(response.status == 200){
        alert("Pendaftaran Berhasil")
    }
    /*
    try {
        const response = await fetch('http://localhost:4001/useracara/daftar', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            if (result.message === 'Daftar Berhasil') {
                alert('Daftar Berhasil');
                window.location.reload();
            } else {
                alert('Daftar Gagal / Sudah Terdaftar');
            }
        } else {
            const result = await response.json();
            alert(result.message);
        }
    } catch (error) {
        console.error('Error adding event:', error);
        alert('Error adding event');
    } */
});


