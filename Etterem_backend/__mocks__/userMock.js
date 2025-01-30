const bcrypt = require('bcrypt');

const mockUsers = async () => {
    const currentDate = new Date();
    const salt = await bcrypt.genSalt(10);
    const userName = "mockUserName";
    const fullName = "Mock FullName";
    const email = "mock@example.com";
    const password = "mockPassword";

    return [
        {
            id: null,
            timestamp: currentDate.toISOString(),
            created: currentDate.toISOString(),
            userName: userName,
            fullName: fullName,
            email: email,
            password: await bcrypt.hash(password, salt),
            points: 0,
            isAdmin: false,
            isActive: false, // email verification után true
        },
    ];
};

module.exports = mockUsers;
