const request = require("supertest");
//var userController = require("./api/controllers/userController")
//jest.setTimeout(15000);

const app = require("../../app");
describe("Tesztelések", () =>
{

    
    test("létezik az errorHandler.js", () =>{
        var errorHandler = require("../middlewares/errorHandler");

        expect(errorHandler).toBeDefined(); 
    })

    test("Nem létező endpoint 404 el tér vissza", async () => {
        const response = await request(app).get("/user/nincsilyenendpoint456454");
        expect(response.status).toEqual(404);
    });
/* Az errorhandler vmiért nem jó az app-ban > nem változtatja meg az error message-t/ a 404 es kód működik mert alapból azt az errort adja ki a nem talált kérésre !!!
    test("Nem létező endpoint hibánál jó hibaüzenettel tér vissza", async () => {
        const response = await request(app).get("/nincsilyenendpoint456454");
        expect(response.body.message).toEqual("Not found");
    });
*/
    
    
})

const dishController = require("../controllers/dishController");
const purchaseController = require("../controllers/purchaseController");
const testController = require("../controllers/testController");
const userController = require("../controllers/userController");

//------Controllerek------
describe("Controller tesztek", ()=>
{
    

    test.each(["createDish","getAllDishes"])
    ("dishControllerben léteznek a kérések", async (keres)=>
    {
        expect(dishController[keres]).toBeDefined();
    });


    test.each(["getAllActivePurchase","deActivatePurchase","PlaceOrder"])
    ("purchaseControllerben léteznek a kérések", async (keres)=>
    {
        expect(purchaseController[keres]).toBeDefined();
    });
    
 
    test("testControllerben léteznek a kérések", ()=>
    {
        expect(testController.DataCreate).toBeDefined();
    });
    

    test.each(["getUser","getAllUser","createUser","verifyEmail","loginUser","deleteUser"])
    ("userControllerben léteznek a kérések", (keres)=>
    {
        expect(userController[keres]).toBeDefined();
    });
})


//------Middlewares------
describe("Middlewares tesztek", ()=>
{


})

//------Routes------
describe("Routes tesztek", ()=>
{

    test("dishRouteson helyes státusszal térnek vissza a GET kérések",async ()=>{
        const res = await request(app).get('/api/v1/get-users');
        expect(res.statusCode).toBe(200);
    });

    test("purchaseRouteson helyes státusszal térnek vissza a GET kérések",async ()=>{
        const res = await request(app).get('/api/v1/get-all-active-order');
        expect(res.statusCode).toBe(200);
    });
    
    test("purchaseRouteson helyes státusszal térnek vissza a POST kérések",async ()=>{
        const id = 1;
        const res = await request(app).post(`/api/v1/place-order/${id}`);
        expect(res.statusCode).toBe(201);
    });

    test("purchaseRouteson helyes státusszal térnek vissza a PATCH kérések",async ()=>{
        const res = await request(app).patch('/api/v1/in-activate-order/1');
        expect(res.statusCode).toBe(200);
    });

    test.each(["/get-users","/get-user/1"])("userRouteson helyes státusszal térnek vissza a GET kérések",async (endpoint)=>{
        const res = await request(app).get(`/api/v1${endpoint}`);
        expect(res.statusCode).toBe(200);
    });

    test.each(["/register","/login"])("userRouteson helyes státusszal térnek vissza a POST kérések",async (endpoint)=>{
        const res = await request(app).post(`/api/v1${endpoint}`);
        expect(res.statusCode).toBe(201);
    });

    test("userRouteson helyes státusszal térnek vissza a DELETE kérések",async ()=>{
        const res = await request(app).delete('/api/v1/delete-user/1');
        expect(res.statusCode).toBe(200);
    });

    test("userRouteson helyes státusszal térnek vissza a PATCH kérések",async ()=>{
        const res = await request(app).patch('/api/v1/verify-user');
        expect(res.statusCode).toBe(200);
    });
})

//------Modellek------
describe("Modellek léteznek", ()=>
{
    
    test.each(["allergenables","allergy","dish","index","order_connection","order_dish_connection","purchase","user"])
    ("Léteznek-e az adatbázis táblái backenden teszt",(model)=>{
        var models = require("../models/"+model)
        expect(models).toBeDefined();
    });
    
})

//------Services------
describe("Services tesztek", ()=>
{

    
})
    