/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", "HomeController.index");
Route.post("/upload", "FilesController.upload");
Route.get("/post", async ({ auth }) => {
  await auth.use("api").authenticate();
  return `You are logged in as ${auth.user!.email}`;
});

Route.group(() => {
  //Todo Route Crud Api:--
  Route.group(() => {
    Route.get("/lists", "TodosController.index");
    Route.post("/create", "TodosController.store");
    Route.put("/update/:id", "TodosController.update");
    Route.get("/list/:id", "TodosController.getList");
    Route.delete("/delete/:id", "TodosController.delete");
  })
    .prefix("/todo")
    .middleware("auth");

  //User Route :Auth Api:--
  Route.group(() => {
    Route.post("/register", "AuthsController.register");
    Route.post("/login", "AuthsController.login");
    Route.get("/verify-email/:token", "EmailVerificationsController.confirm");
    Route.post("/forgot-password/:email", "AuthsController.forgotPassword");
    Route.post("/change-password", "AuthsController.changePassword").middleware(
      "auth:api"
    );
    Route.post("/reset-password/:email", "AuthsController.resetPassword");

    Route.group(() => {
      Route.get("/details", "AuthsController.getUser");
      Route.put("/update", "AuthsController.update");
      Route.delete("/delete", "AuthsController.delete");
    })
      .prefix("/profile")
      .middleware("auth:api");
  }).prefix("/user");

  //Posts Route:Crud Api:--
  Route.group(() => {
    Route.post("/create", "PostsController.create");
    Route.get("/lists", "PostsController.getLists");
    Route.get("/list/:id", "PostsController.getList");
    Route.put("/update/:id", "PostsController.update");
    Route.delete("/delete/:id", "PostsController.delete");
  })
    .prefix("/posts")
    .middleware("auth");

  //Skills Route:Crud Api:--
  Route.group(() => {
    Route.post("/create", "SkillsController.create");
    Route.get("/lists", "SkillsController.getLists");
  }).prefix("/skill");

  //SkillUsers Route:Crud Api:--
  Route.group(() => {
    Route.post("/create", "UserSkillsController.create").middleware("auth");
    Route.get("/lists", "UserSkillsController.getList");
  }).prefix("/SkillUser");

  //Admin Route:Auth Api:--
  Route.group(() => {
    Route.group(() => {
      Route.post("/signUp", "AdminsController.register");
      Route.post("/signIn", "AdminsController.login");
      Route.post("/email-verify/:token", "AdminsController.emailVerify");
      Route.post("/forgot-password/:email", "AdminsController.forgotPassword");
      Route.post("/reset-password/:email", "AdminsController.ResetPassword");
    }).prefix("/auth");
    Route.group(() => {
      Route.get("/details", "AdminsController.getAdminProfile");
      Route.put("/update", "AdminsController.update");
      Route.delete("/delete", "AdminsController.delete");
      Route.post("/change-password", "AdminsController.changePassword");
    })
      .prefix("/profile")
      .middleware("auth:web");
  }).prefix("/admin");

  //SubAdmin Route:Crud Api:--
  Route.group(() => {
    Route.post("/create", "SubAdminsController.create");
    Route.get("/details", "SubAdminsController.getDetails");
    Route.get("/detail/:id", "SubAdminsController.getDetail");
    Route.put("/update/:id", "SubAdminsController.update");
    Route.delete("/delete/:id", "SubAdminsController.delete");
  })
    .prefix("/subAdmin")
    .middleware("auth:web");

  //Distributor Route:Auth Api:--
  Route.group(() => {
    Route.post("/signUp", "DistributorsController.create");
    Route.post("/signIn", "DistributorsController.login");
    Route.post("/email-verify", "DistributorsController.emailVerify");
    Route.post(
      "/forgot-password/:email",
      "DistributorsController.forgotPassword"
    );
    Route.post(
      "/reset-password/:email",
      "DistributorsController.resetPassword"
    );
    Route.group(() => {
      Route.get("/details", "DistributorsController.getProfile");
      Route.put("/update", "DistributorsController.updateProfile");
      Route.delete("/delete", "DistributorsController.deleteProfile");
      Route.post("/changePassword", "DistributorsController.changePassword");
    })
      .prefix("/profile")
      .middleware("auth:dist");
  }).prefix("/distributor");

  //Product Route:Crud Api:--
  Route.group(() => {
    Route.post("/create", "ProductsController.create");
    Route.get("/lists", "ProductsController.getLists");
    Route.get("/list/:id", "ProductsController.getList");
    Route.put("/update/:id", "ProductsController.updateList");
    Route.delete("/delete/:id", "ProductsController.deleteList");
  })
    .prefix("/product")
    .middleware("auth:dist");

  //Category crud Api:---
  Route.group(() => {
    Route.post("/create", "CategoriesController.create");
    Route.get("/lists", "CategoriesController.getLists");
    Route.get("/list/:id", "CategoriesController.getList");
    Route.put("/update/:id", "CategoriesController.update");
    Route.delete("/delete/:id", "CategoriesController.delete");
  }).prefix("/category");
}).prefix("api");
