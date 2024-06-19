const db = require('../models');

async function authenticateUser(idinput, passwordinput) {
    try {
        const results = await db.sequelize.query("SELECT status FROM users WHERE KodeUser = :kodeUser", {
            replacements: { kodeUser: idinput }
        });

        if (results[0][0]) {
            const status = results[0][0].status;

            let passwordQuery;
            switch (status) {
                case '0':
                    passwordQuery = "SELECT KodeAdmin as idUser, password FROM admin WHERE KodeAdmin = :kodeUser";
                    break;
                case '1':
                    passwordQuery = "SELECT NIM as idUser, password FROM user_mahasiswa WHERE NIM = :kodeUser";
                    break;
                case '2':
                    passwordQuery = "SELECT KodeMitra as idUser, password FROM user_mitra WHERE KodeMitra = :kodeUser";
                    break;
                default:
                    return "Status tidak valid";
            }

            const passwordResults = await db.sequelize.query(passwordQuery, { replacements: { kodeUser: idinput } });
            if (passwordResults[0][0] && passwordResults[0][0].password === passwordinput) {
                return { status, idUser: passwordResults[0][0].idUser };
            } else {
                return { status: 'Password Salah', idUser: '' };
            }
        } else {
            return { status: 'Username Tidak Ditemukan', idUser: '' };
        }
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error("Internal Server Error");
    }
}

module.exports = { authenticateUser };
