import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Post from "App/Models/Post";
import User from "App/Models/User";

import PostValidator, {
  PostUpdateValidator,
} from "App/Validators/PostValidator";

export default class PostsController {
  public async create({ request, response, auth }) {
    const title = request.input("title");
    const body = request.input("body");
    const data: any = await request.validate(PostValidator);

    const user: any = await User.find(auth.user.id);
    const posts = await user
      .related("posts")
      .create({ title: data.title, body: data.body });

    // const posts = await Post.create(data);
    if (!posts) {
      return response.json({ status: false, message: "Posts does not exist" });
    }
    return response.json({
      status: true,
      message: "Posts is created successfully",
    });
  }

  public async getLists({ request, response }: HttpContextContract) {
    const page = request.input("page", 1);
    const limit = request.input("per_page", 2);
    const posts = await Post.query().orderBy("id", "asc").paginate(page, limit);

    if (!posts) {
      return response.json({
        status: false,
        message: "Posts can`t Get Details",
      });
    }
    return response.json({
      status: true,
      message: "Posts Can fetch details successfully",
      posts,
    });
  }

  public async getList({ response, params }: HttpContextContract) {
    const posts = await Post.findOrFail(params.id);
    if (!posts) {
      return response.json({
        status: false,
        message: "Posts id can`t Get",
      });
    }
    return response.json({
      status: true,
      message: "Posts Can fetch detail successfully",
      posts,
    });
  }

  public async update({ request, response, params }: HttpContextContract) {
    const posts = await Post.findOrFail(params.id);
    const data = await request.validate(PostUpdateValidator);
    // posts.title = request.input("title");
    // posts.body = request.input("body");
    // await posts.save();

    const result = await Post.query()
      .where("id", params.id)
      .update({ title: data.title, body: data.body });

    if (!posts) {
      return response.json({
        status: false,
        message: "Posts id does not exist",
      });
    }
    if (!result) {
      return response.json({ status: false, message: "Posts can`t Updated" });
    }

    return response.json({
      status: true,
      message: "Posts updated  detail successfully",
    });
  }

  public async delete({ response, params }: HttpContextContract) {
    const posts = await Post.findOrFail(params.id);
    await posts.delete();
    if (!posts) {
      return response.json({
        status: false,
        message: "Posts id does not exist",
      });
    }
    return response.json({
      status: true,
      message: "Posts deleted  detail successfully",
    });
  }
}
