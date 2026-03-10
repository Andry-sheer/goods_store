import { Router } from "express";
import { ProductModel } from "../models/index.js";
import { MESSAGE, ROUTES, STATUS_CODES } from "../common/index.js";

const router = Router();

router.get(ROUTES.API, (req, res) => {
  res.status(STATUS_CODES.OK).json({
    status: STATUS_CODES.OK,
    message: MESSAGE.OK,
  });
});

router.get(ROUTES.PRODUCT, async (req, res) => {
  const product = await ProductModel.find();
  res.json(product);
});

router.post(ROUTES.PRODUCT, async (req, res) => {
  try {
    const product = new ProductModel(req.body);

    await product.save();

    res.json(product);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error : MESSAGE.INTERNAL_SERVER_ERROR });
  }
});

export default router;
