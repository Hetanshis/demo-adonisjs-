import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Category from "App/Models/Category";
import Product from "App/Models/Product";
import CategoryValidator, {
  CategoryUpdateValidator,
} from "App/Validators/CategoryValidator";

export default class CategoriesController {
  public async create({ request, response }: HttpContextContract) {
    const validate: any = await request.validate(CategoryValidator);

    const exisitingCategory = await Category.findBy("title", validate.title);

    if (exisitingCategory) {
      return response.json({ message: "Title is already exist" });
    }
    const product: any = await Product.find(validate.productId);

    const category = await Category.create({
      title: validate.title,
      productId: validate.productId,
    });
    if (!category) {
      return response.json({ message: "Category can`t created" });
    }
    return response.json({ message: "Category created successfully" });
  }

  public async getLists({ request, response, auth }: HttpContextContract) {
    const page = request.input("page", 1);
    const limit = request.input("per_page", 2);
    const category = await Category.query()

      .orderBy("id", "asc")
      .paginate(page, limit);

    if (!category) {
      return response.json({ message: "category does not get Lists" });
    }
    return response.json({
      message: "category fetch Lists successfully",
      category,
    });
  }

  public async getList({ request, response, params }: HttpContextContract) {
    const findId = await Category.find(params.id);

    if (!findId) {
      return response.json({ message: "Category id can`t exist" });
    }

    const category = await Category.findBy("id", params.id);
    if (!category) {
      return response.json({ message: "category doe snot exist" });
    }

    return response.json({
      message: "category can fetch list successfully",
      category,
    });
  }

  public async update({ request, response, params }: HttpContextContract) {
    const findId = await Category.find(params.id);

    if (!findId) {
      return response.json({ message: "Category id can`t exist" });
    }

    const validate = await request.validate(CategoryUpdateValidator);

    const existingCategory = await Category.findBy("title", validate.title);

    if (existingCategory) {
      return response.json({ message: "Title is already exist" });
    }

    const category = await Category.query()
      .where("id", params.id)
      .update({ title: validate.title });

    if (!category) {
      return response.json({ message: "category can`t Update list" });
    }
    return response.json({ message: "category Update list successfully" });
  }

  public async delete({ request, response, params }: HttpContextContract) {
    const findId = await Category.find(params.id);

    if (!findId) {
      return response.json({ message: "Category id can`t exist" });
    }

    const category = await Category.query().where("id", params.id).delete();
    if (!category) {
      return response.json({ message: "category can`t delete list" });
    }
    return response.json({ message: "category delete list successfully" });
  }
}
