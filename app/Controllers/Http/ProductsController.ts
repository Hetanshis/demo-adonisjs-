import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ProductValidator, {
  ProductUpdateValidator,
} from "App/Validators/ProductValidator";
import Product from "App/Models/Product";
import Application from "@ioc:Adonis/Core/Application";

export default class ProductsController {
  public async create({ request, response, auth }: HttpContextContract) {
    await auth.use("dist").authenticate();
    const validate: any = await request.validate(ProductValidator);

    const existingProduct = await Product.findBy("title", validate.title);

    if (existingProduct) {
      return response.json({ message: "title is already exist" });
    }

    const product: any = await Product.create({
      title: validate.title,
      description: validate.description,
      price: validate.price,
      quantity: validate.quantity,
      image: validate.image,
    });

    await product.image.move(Application.tmpPath("uploadss"));
    product.image = product.image.fileName;
    await product.save();
    if (!product) {
      return response.json({ message: "Product does not created" });
    }
    return response.json({ message: "Product created successfully" });
  }

  public async getLists({ request, response, auth }: HttpContextContract) {
    console.log("call", response);

    await auth.use("dist").authenticate();
    const page = request.input("page", 1);
    const limit = request.input("per_page", 2);
    const product = await Product.query()

      .preload("categories")
      .orderBy("id", "asc")

      .paginate(page, limit);
    // const product2 = await product;
    // const product3 = await product2;
    // console.log("start product3========");
    // console.log(product3[0].Product);
    // console.log("start product3========");
    // console.log(product, "product product");

    if (!product) {
      return response.json({ message: "Product does not get Lists" });
    }
    return response.json({
      message: "Product fetch Lists successfully",
      product,
    });
  }

  public async getList({ response, params, auth }: HttpContextContract) {
    await auth.use("dist").authenticate();
    const product = await Product.find(params.id);

    if (!product) {
      return response.json({ message: "Product can`t fetch list" });
    }

    return response.json({
      message: "Product can fetch list successfully",
      product,
    });
  }

  public async updateList({
    request,
    response,
    auth,
    params,
  }: HttpContextContract) {
    await auth.use("dist").authenticate();

    const validate: any = await request.validate(ProductUpdateValidator);

    const existingProduct = await Product.findBy("title", validate.title);

    if (existingProduct) {
      return response.json({ message: "title is already exist" });
    }

    const product: any = await Product.query().where("id", params.id).update({
      title: validate.title,
      description: validate.description,
      price: validate.price,
      quantity: validate.quantity,
      image: validate.image.clientName,
    });

    await product.image?.move(Application.tmpPath("upload"));

    if (!product) {
      return response.json({ message: "Product does not updated" });
    }
    return response.json({ message: "Product updated successfully" });
  }

  public async deleteList({ response, params, auth }: HttpContextContract) {
    await auth.use("dist").authenticate();
    const findId = await Product.find(params.id);
    if (!findId) {
      return response.json({ message: "Product id can`t exist" });
    }
    const product = await Product.query().where("id", params.id).delete();

    if (!product) {
      return response.json({ message: "Product can`t delete list" });
    }

    return response.json({
      message: "Product can delete list successfully",
    });
  }
}
