const request = require("supertest");
//var userController = require("./api/controllers/userController")
//jest.setTimeout(15000); //evvel tudjuk meghosszabbítani a várási időt, alap 5 mp(5000)

const app = require("../../app");

const dishController = require("../controllers/dishController");
const purchaseController = require("../controllers/purchaseController");
const testController = require("../controllers/testController");
const userController = require("../controllers/userController");

describe("Backend tesztek",()=>
{
//------Controllerek------
describe("Controller tesztek", ()=>
    {
        
    
        test.each(["createDish","getAllDishes"])
        ("dishControllerben léteznek a kérések: %s", async (keres)=>        //keres -> kérés
        {
            expect(dishController[keres]).toBeDefined();
        });
    
    
        test.each(["getAllActivePurchase","deActivatePurchase","PlaceOrder"])
        ("purchaseControllerben léteznek a kérések: %s", async (keres)=>
        {
            expect(purchaseController[keres]).toBeDefined();
        });
        
     
        test.each(["DataCreate"])("testControllerben léteznek a kérések: %s", (keres)=>
        {
            expect(testController[keres]).toBeDefined();
        });
        
    
        test.each(["getUser","getAllUser","createUser","verifyEmail","loginUser","deleteUser"])
        ("userControllerben léteznek a kérések: %s", (keres)=>
        {
            expect(userController[keres]).toBeDefined();
        });
    })
    
    
    //------Middlewares------
    describe("Middlewares tesztek", ()=>
    {
        test.each(["errorHandler","userAuth"])("léteznek a middlewarek: %s", (mware) =>{
            var middleware = require(`../middlewares/${mware}`);
    
            expect(middleware).toBeDefined(); 
        })
    
        test.each(["notFoundError","showError"])("errorHandler funkció'i' léteznek: %s", (funkcio) =>{
            var errorHandler = require(`../middlewares/errorHandler`);
    
            expect(errorHandler[funkcio]).toBeDefined(); 
        })
    
        test.each(["authenticateToken"])("userAuth funkció'i' léteznek: %s", (funkcio) =>{
            var userAuth = require(`../middlewares/userAuth`);
    
            expect(userAuth[funkcio]).toBeDefined(); 
        })
    })
    
    //------Routes------
    describe("Routes tesztek", ()=>
    {
    
        test.each(["/get-users"])("dishRouteson helyes státusszal térnek vissza a GET kérések: %s",async (endpoint)=>{
            const res = await request(app).get(`/api/v1/${endpoint}`);
            expect(res.statusCode).toBe(200);
        });
    
        test.each(["/get-all-active-order"])("purchaseRouteson helyes státusszal térnek vissza a GET kérések: %s",async (endpoint)=>{
            const res = await request(app).get(`/api/v1/${endpoint}`);
            expect(res.statusCode).toBe(200);
        });
        
        test.each(["/place-order/1"])("purchaseRouteson helyes státusszal térnek vissza a POST kérések: %s",async (endpoint)=>{
            const res = await request(app).post(`/api/v1/${endpoint}`);
            expect(res.statusCode).toBe(201);
        });
    
        test.each(["/in-activate-order/1"])("purchaseRouteson helyes státusszal térnek vissza a PATCH kérések: %s",async (endpoint)=>{
            const res = await request(app).patch(`/api/v1${endpoint}`);
            expect(res.statusCode).toBe(200);
        });
    
        test.each(["/get-users","/get-user/1"])("userRouteson helyes státusszal térnek vissza a GET kérések: %s",async (endpoint)=>{
            const res = await request(app).get(`/api/v1${endpoint}`);
            expect(res.statusCode).toBe(200);
        });
    
        test.each(["/register","/login"])("userRouteson helyes státusszal térnek vissza a POST kérések: %s",async (endpoint)=>{
            const res = await request(app).post(`/api/v1${endpoint}`);
            expect(res.statusCode).toBe(201);
        });
    
        test.each(["/delete-user/1"])("userRouteson helyes státusszal térnek vissza a DELETE kérések: %s",async (endpoint)=>{
            const res = await request(app).delete(`/api/v1${endpoint}`);
            expect(res.statusCode).toBe(200);
        });
    
        test.each(["/verify-user"])("userRouteson helyes státusszal térnek vissza a PATCH kérések: %s",async (endpoint)=>{
            const res = await request(app).patch(`/api/v1${endpoint}`);
            expect(res.statusCode).toBe(200);
        });
    })
    
    //------Modellek------
    describe("Modellek léteznek", ()=>
    {
        
        test.each(["allergenables","allergy","dish","index","order_connection","order_dish_connection","purchase","user"])
        ("Léteznek-e az adatbázis táblái backenden: %s",(model)=>{
            var models = require(`../models/${model}`)
            expect(models).toBeDefined();
        });
        
    })
    
    //------Services------
    describe("Services tesztek", ()=>
    {
        test.each(["dishService","orderConnectionService","purchaseService","userService"])
        ("Services fileok léteznek: %s",(service)=>{
            var services = require(`../services/${service}`)
            expect(services).toBeDefined();
        });
    
        test.each([
            ["dishService", "DishService"],
            ["orderConnectionService", "OrderConnectionService"],
            ["purchaseService", "PurchaseService"],
            ["userService", "UserService"]
        ])
        ("Services osztály példánya létezik: %s -> %s", (service, osztaly) => {
            const services = require(`../services/${service}`);
            
            expect(services.constructor.name).toBe(osztaly); // így működik csak mert példányt ad vissza a service :P
        });
        
        test.each(["createDish","getAllDishes"])
        ("dishService funkcióa'i' létezik/nek: %s",(funkcio)=>{
            var dishService = require(`../services/dishService`)
            expect(dishService[funkcio]).toBeDefined();
        });
    
        test.each(["createPurchaseConnection"])
        ("orderConnectionService funkcióa'i' létezik/nek: %s",(funkcio)=>{
            var orderConnectionService = require(`../services/orderConnectionService`)
            expect(orderConnectionService[funkcio]).toBeDefined();
        });
    
        test.each(["getAllActivePurchase","deActivatePurchase"])
        ("purchaseService funkcióa'i' létezik/nek: %s",(funkcio)=>{
            var purchaseService = require(`../services/purchaseService`)
            expect(purchaseService[funkcio]).toBeDefined();
        });
    
        test.each(["createUser","getAllUser","getUser","deleteUser","verifyEmail","checkForExistingUser","getUserByEmail"])
        ("userService funkció'i' létezik/nek: %s",(funkcio)=>{
            var userService = require(`../services/userService`)
            expect(userService[funkcio]).toBeDefined();
        });
    })
        
})

describe("Frontend tesztek:",()=>{
    describe("View tesztelések",()=>{
        test.each(["HomeView","MenuView","OrderView","UserView"])
        ("Sima View fileok léteznek-e: %s",(file)=>{
            var view = require(`../../../Etterem_front/src/views/${file}`);
            expect(view).toBeDefined();
        });
    })
})

const bcrypt = require('bcrypt');
const mockUsers = require('../../__mocks__/userMockock');

describe('Mock User információk', () => {
    test('Mock User helyes struktúra', async () => {
        const users = await mockUsers();
        const user = users[0]; // Csak egy felhasználó van a mockban

        expect(user).toHaveProperty('id', null);
        expect(user).toHaveProperty('timestamp');
        expect(user).toHaveProperty('created');
        expect(user).toHaveProperty('userName', 'mockUserName');
        expect(user).toHaveProperty('fullName', 'Mock FullName');
        expect(user).toHaveProperty('email', 'mock@example.com');
        expect(user).toHaveProperty('password');
        expect(user).toHaveProperty('points', 0);
        expect(user).toHaveProperty('isAdmin', false);
        expect(user).toHaveProperty('isActive', false);

        // Ellenőrizheted, hogy a jelszó hashelve lett-e
        const isPasswordValid = await bcrypt.compare('mockPassword', user.password);
        expect(isPasswordValid).toBe(true);
    });
});