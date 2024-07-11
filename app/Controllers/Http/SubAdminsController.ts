import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Admin from "App/Models/Admin";
import AdminValidator, { UpdateValidator } from "App/Validators/AdminValidator";

export default class SubAdminsController {
  public async create({ request, response, auth }: HttpContextContract) {
    await auth.use("web").authenticate();

    const data = await request.validate(AdminValidator);

    const existingAdmin = await Admin.findBy("email", data.email);

    if (existingAdmin) {
      return response.json({
        status: false,
        message: "Email is already exist",
      });
    }

    const subAdmin = await Admin.create({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (!subAdmin) {
      return response.json({
        status: false,
        message: "SubAdmin can`t Created successfully",
      });
    }
    await subAdmin.save();

    return response.json({
      status: true,
      message: "SubAdmin can Created successfully",
    });
  }

  public async getDetails({ response, auth, request }: HttpContextContract) {
    await auth.use("web").authenticate();
    const page = request.input("page", 1);
    const limit = request.input("per_page", 2);

    const subAdmin = await Admin.query()
      .orderBy("id", "asc")
      .paginate(page, limit);
    if (!subAdmin) {
      return response.json({
        status: false,
        message: "SubAdmin can`t get details",
      });
    }

    return response.json({
      status: false,
      message: "SubAdmin get details fetch successfully",
      subAdmin,
    });
  }

  public async getDetail({ response, auth, params }: HttpContextContract) {
    await auth.use("web").authenticate();

    const subAdmin = await Admin.find(params.id);
    if (!subAdmin) {
      return response.json({
        status: false,
        message: "SubAdmin can`t get detail",
      });
    }

    return response.json({
      status: false,
      message: "SubAdmin get detail fetch successfully",
      subAdmin,
    });
  }

  public async update({
    request,
    response,
    auth,
    params,
  }: HttpContextContract) {
    await auth.use("web").authenticate();
    const findId = await Admin.find(params.id);
    console.log(params.id);
    if (!findId) {
      return response.json({ status: false, message: "Id is not found" });
    }
    const data = await request.validate(UpdateValidator);

    const subAdmin = await Admin.query().where("id", params.id).update({
      name: data.name,
      email: data.email,
    });
    if (!subAdmin) {
      return response.json({
        status: false,
        message: "SubAdmin can`t Update detail",
      });
    }

    return response.json({
      status: true,
      message: "SubAdmin can  Update detail successfully",
    });
  }

  public async delete({ response, auth, params }: HttpContextContract) {
    await auth.use("web").authenticate();

    const subAdmin = await Admin.query().where("id", params.id).delete();
    if (!subAdmin) {
      return response.json({
        status: false,
        message: "SubAdmin can`t delete detail",
      });
    }

    return response.json({
      status: true,
      message: "SubAdmin can delete detail successfully",
    });
  }
}
