// import express from "express";
// import multer from "multer";
// import {
//   uploadImage,
//   getImages,
//   getImageById,
//   updateImage,
//   deleteImage,
// } from "../controllers/image.Controller";

// const router = express.Router();

// const upload = multer({
//   storage: multer.memoryStorage(),
// });

// router.post("/", upload.single("image"), uploadImage);
// router.get("/", getImages);
// router.get("/:id", getImageById);
// router.put("/:id", upload.single("image"), updateImage);
// router.delete("/:id", deleteImage);

// export default router;