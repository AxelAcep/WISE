document.getElementById('loginButton').addEventListener('click', async () => {
    const username = document.getElementById('exampleInputEmail1').value;
    const password = document.getElementById('exampleInputPassword1').value;

    if (!username || !password) {
        alert('Username and password are required');
        return;
    }

    const url = '';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idinput1: username, idinput2: password })
        });

        const responseData = await response.json();

        const UserIDActive = responseData.idUser;
        const UserMode = responseData.status;

        if (UserMode === '1') {
            window.location.href = "/user";
            window.localStorage.setItem('activeuser', username);
        } else if (UserMode === '2') {
            window.location.href = "/mitra";
            window.localStorage.setItem('activeuser', username);
        } else if (UserMode === '0') {
            window.location.href = "/admin";
            window.localStorage.setItem('activeuser', username);
        } else {
            alert(responseData.status);
        }

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing your request');
    }
});
