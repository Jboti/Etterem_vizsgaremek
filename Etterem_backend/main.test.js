const request = require("supertest");
//var userController = require("./api/controllers/userController")


describe("Tesztelések", () =>
{

    const app = require("./app");
    test("létezik az errorHandler.js", async() =>{
        var errorHandler = require("./api/middlewares/errorHandler");

        expect(errorHandler).toBeDefined(); 
    })

    test("getAllUser 200 as státusz kóddal tér vissza", async () => {
        const response = await request(app).get("/user/getAllUser");
        expect(response.status).toEqual(200);
    });
    
    test("Nem létező endpoint 404 el tér vissza", async () => {
        const response = await request(app).get("/user/nincsilyenendpoint456454");
        expect(response.status).toEqual(404);
    });

    test("Nem létező endpoint hibánál jó hibaüzenettel tér vissza", async () => {
        const response = await request(app).get("/nincsilyenendpoint456454");
        expect(response.body.message).toEqual("Not found");
    });



/*
    test("létezik a createUser a userControllerben", async() =>{
        

        expect(userController.createUser).toBeDefined(); 
    })
    test("User megfelelő attribútumokkal rendelkezik", async () => 
        {
            const mockReq = {
                id:0,
                timestamp: 'vmi1',
                created: 'vmi',
                userName: 'NagyÁrpi',
                fullName: 'Árpád Nagy',
                email: '@freemailxd.com',
                password: 'password',
                points: 0,
                isAdmin: false,
                isActive: false
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        var mockUser = userController.createUser(mockReq, mockRes, ()=>{});

        expect(mockUser).toBeDefined();
        expect(mockUser.id).toBeDefined();
        expect(mockUser.timestamp).toBeDefined();

        });*/
        
})
/*timestamp: currentDate.toISOString(),
            created: currentDate.toISOString(),
            userName: userName,
            fullName: fullName,
            email: email,
            password: await bcrypt.hash(password,salt),
            points: 0,
            isAdmin: false,
            isActive: false //email verification után true*/ 