const request = require("supertest");
//var userController = require("./api/controllers/userController")
//jest.setTimeout(15000); //evvel tudjuk meghosszabbítani a várási időt, alap 5 mp(5000)

const app = require("../../app");

const dishController = require("../controllers/dishController");
const purchaseController = require("../controllers/purchaseController");
const testController = require("../controllers/testController");
const userController = require("../controllers/userController");

jest.mock("../db/dbContext", () => require("../../__mocks__/db"));



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
    
    
        test.each(["getAllActivePurchase","deActivatePurchase","placeOrder"])
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
    
        test.each(["/get-user"])("userRouteson helyes státusszal térnek vissza a GET kérések: %s", async (endpoint) => {
            const token = 'some-valid-token';
            const userData = { id: 1, name: 'John Doe', email: 'john@example.com' };
          
            const res = await request(app)
              .get(`/api/v1${endpoint}`)
              .set('Authorization', `Bearer ${token}`);
          
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(userData);
          });
          
          test.each(["/get-user"])("userRouteson helyes státusszal térnek vissza a GET kérések (unauthenticated): %s", async (endpoint) => {
            const token = 'some-invalid-token';
          
            const res = await request(app)
              .get(`/api/v1${endpoint}`)
              .set('Authorization', `Bearer ${token}`);
          
            expect(res.statusCode).toBe(401);
            expect(res.text).toBe('Unauthorized');
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
    
        test.each(["createUser","getAllUser","getUser","deleteUser","verifyEmail","checkForExistinguserName","getUserByEmail"])
        ("userService funkció'i' létezik/nek: %s",(funkcio)=>{
            var userService = require(`../services/userService`)
            expect(userService[funkcio]).toBeDefined();
        });
    })


    

    describe("Repository tests", () => {
      beforeAll(async () => {
        await require("../../__mocks__/db").sequelize.sync({ force: true });
      });

      const dishRepository = require("../repositories/dishRepository");
      const userRepository = require("../repositories/userRepository");
      const purchaseRepository = require("../repositories/purchaseRepository");
      const order_connectionRepositroy = require("../repositories/order_connectionRepository");

      let mockDish;

      describe("DishRepo tesztek", () => {
        beforeAll(async () => {
           mockDish = {
            id: 1,
            name: "Mock Dish",
            created: new Date().toISOString().split("T")[0],//az adat struktúrában dateonly va, viszont itt visszakapjuk a timeot is ezért azt le kell vágni ebből
            price: 10,
            available: true,
            sauceOptions: {},
            customizationOptions: {},
            description: "This is a mock dish",
            type: "Mock Type",
            img: null
          };
            await dishRepository.createDish(mockDish);
        });
  
        test("getDish returns mockDish", async () => {
            const receivedDish = await dishRepository.getDish(1);
            expect(receivedDish.get({ plain: true })).toEqual(mockDish);
        });

        test("deleteDish deletes the dish and GetAllDishes returns 0 dishes", async () => {
          await dishRepository.deleteDish(mockDish);
          expect((await dishRepository.getAllDishes()).length).toBe(0);
        });
      });

      describe("UserRepo tesztek", () => {
        let mockUser;
        beforeAll(async () => {
          mockUser = {
              id:1,
              timestamp: new Date().toISOString(),
              created: new Date().toISOString().split("T")[0],
              userName: "mockUserName",
              fullName: "Mock FullName",
              email: "mock@example.com",
              password: "mockPassword",
              points: 0,  
              isAdmin: false,
              isActive: false, // email verification után true
          };
          await userRepository.createUser(mockUser);
          },);

  
        test("getUser returns mockUser", async () => {
          const receivedUser = await userRepository.getUser(1);
          expect(receivedUser.get({ plain: true }))
          .toEqual({
            id:mockUser.id,
            created:mockUser.created,
            userName:mockUser.userName,
            fullName:mockUser.fullName,
            email:mockUser.email,
            points:mockUser.points
          });
        });
  
        test("getAllUser returns with length 1", async () => {
          expect((await userRepository.getAllUser()).length).toBe(1);
        })

        
        

        /*test("verifyEmail verifies email", async () => { nem tesztelem le mert a getUser nem tér vissza az isActive al és nem tudom letesztelni a változást a mockUserben
            const receivedUser = await userRepository.getUser(1);
            console.log(mockUser,"AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            console.log(await userRepository.verifyEmail(1))
            await userRepository.verifyEmail(1);
            expect(mockUser.isActive).toEqual(true)
            
        })*/

        
        test("getUserByEmail returns with correct user", async () => {
            const foundUser = await userRepository.getUserByEmail("mock@example.com");
            const plainUser = foundUser.get({ plain: true });
            console.log(plainUser);
            expect(plainUser.email).toEqual(mockUser.email);
        })
        test("checkForExistinguserName returns with correct user", async () => {
            const foundUser = await userRepository.checkForExistinguserName("mockUserName");
            const plainUser = foundUser.get({ plain: true });
            expect(plainUser.userName).toEqual(mockUser.userName);
        })

        test("updateUserName updates username", async () => {
            const Userupdate = {id:1, userName:"newusername"};
            userRepository.updateUserName(Userupdate);
            const receivedUser = await userRepository.getUser(1);
            expect(receivedUser.userName).toEqual("newusername")
            
        })

        /*test("changePassword changes password", async () => {
            console.log(await userRepository.changePassword("newpassword",1))
            await userRepository.changePassword("newpassword",1);
            expect(mockUser.password).toEqual("newpassword")
        })*/

        test("changeUserName changes username", async () => {
            await userRepository.changeUserName("newusername",1);
            const receivedUser = await userRepository.getUser(1);
            expect(receivedUser.userName).toEqual("newusername")
        })

        test("getUserPwById returns with correct password", async () => {
            const foundUser = await userRepository.getUserPwById(1);
            const plainUser = foundUser.get({ plain: true });
            expect(plainUser.password).toEqual(mockUser.password);
        })

        test("deleteUser deletes the user and GetAllUser returns 0 users", async () => {
            await userRepository.deleteUser(1);
            expect((await userRepository.getAllUser()).length).toBe(0);
        });
    });


    

    });

    
})