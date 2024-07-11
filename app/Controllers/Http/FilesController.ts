import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Application from "@ioc:Adonis/Core/Application";

export default class FilesController {
  public async upload({ request, response }: HttpContextContract) {
    const coverImage = request.file("cover_image", {
      size: "2mb",
      extnames: ["jpg", "png", "gif"],
    });

    if (!coverImage) {
      return;
    }

    if (!coverImage.isValid) {
      return coverImage.errors;
    }

    if (coverImage) {
      await coverImage.move(Application.tmpPath("uploads"));
    }

    // console.log(coverImage);
    return response.json({
      status: true,
      message: "Image uplaod successfully",
    });
  }
}
