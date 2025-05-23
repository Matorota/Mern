import { Request, Response } from "express";
import Product from "../models/product";
export const postProduct = async (
  req: Request<{}, {}, { title: string; photoSrc: string }>,
  res: Response
) => {
  try {
    const body = req.body;
    const newProduct = await Product.create({
      title: body.title,
      photoSrc: body.photoSrc,
    });

    res.status(200).json({
      addedProduct: newProduct,
      status: 200,
    });
  } catch (error) {
    console.error("Klaida pridedant produktą:", error);
    res.status(500).send({
      status: 500,
      message: "An error occured while adding a product.",
      validationErrors: null,
    });
  }
};

export const updateProduct = async (
  req: Request<{ _id: string }, {}, { title: string; photoSrc: string }>,
  res: Response
) => {
  try {
    const { _id } = req.params;
    const body = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      {
        title: body.title,
        photoSrc: body.photoSrc,
      },
      { new: true }
    );

    if (!updatedProduct) {
      res.status(404).json({
        status: 404,
        message: "Product not found.",
      });
      return;
    }

    res.status(200).json({
      updatedProduct,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "An error occurred while updating the product.",
      validationErrors: null,
    });
  }
};

export const deleteProduct = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      res.status(404).json({
        status: 404,
        message: "Product not found.",
      });
      return;
    }
    res.status(200).json({
      status: 200,
      message: "Product deleted.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 500,
      message: "An error occurred while deleting the product.",
      validationErrors: null,
    });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const totalItems = await Product.countDocuments();
    const totalPages = Math.ceil(totalItems / pageSize);

    const products = await Product.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        pageSize,
        totalItems,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
