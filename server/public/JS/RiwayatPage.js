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
    const url = `   riwayat/detail?KodeUser=${encodeURIComponent(user)}`;
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      });
      const data = await response.json();

      const listDaftar = document.getElementById('ListHistori');
      listDaftar.innerHTML = '';

     data.forEach(data => {
    const eventElement = document.createElement('tr'); // Buat elemen <tr>
    eventElement.innerHTML = `<td>${data.NamaAcara} || by: ${data.NamaMitra} </td>`; // Isi dengan konten

    listDaftar.appendChild(eventElement); // Tambahkan <tr> ke dalam elemen listDaftar
});

}