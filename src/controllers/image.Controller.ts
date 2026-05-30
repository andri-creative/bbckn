// import { Request, Response } from "express";
// import Image from "../models/images.models";
// import { dropbox } from "../config/dropbox";

// export const uploadImage = async (req: Request, res: Response) => {
//   try {
//     const file = req.file;
//     const { title, description } = req.body;

//     if (!file) {
//       return res.status(400).json({
//         success: false,
//         message: "File gambar wajib diupload",
//       });
//     }

//     const filename = `${Date.now()}-${file.originalname}`;
//     const dropboxPath = `/images/${filename}`;

//     await dropbox.filesUpload({
//       path: dropboxPath,
//       contents: file.buffer,
//       mode: { ".tag": "add" },
//     });

//     const image = await Image.create({
//       title,
//       description,
//       filename,
//       dropboxPath,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Gambar berhasil diupload",
//       data: image,
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const getImages = async (_req: Request, res: Response) => {
//   try {
//     const images = await Image.find().sort({ createdAt: -1 });

//     return res.json({
//       success: true,
//       data: images,
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const getImageById = async (req: Request, res: Response) => {
//   try {
//     const image = await Image.findById(req.params.id);

//     if (!image) {
//       return res.status(404).json({
//         success: false,
//         message: "Gambar tidak ditemukan",
//       });
//     }

//     const temporaryLink = await dropbox.filesGetTemporaryLink({
//       path: image.dropboxPath,
//     });

//     return res.json({
//       success: true,
//       data: {
//         ...image.toObject(),
//         imageUrl: temporaryLink.result.link,
//       },
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const updateImage = async (req: Request, res: Response) => {
//   try {
//     const image = await Image.findById(req.params.id);

//     if (!image) {
//       return res.status(404).json({
//         success: false,
//         message: "Gambar tidak ditemukan",
//       });
//     }

//     const { title, description } = req.body;

//     image.title = title ?? image.title;
//     image.description = description ?? image.description;

//     if (req.file) {
//       await dropbox.filesDeleteV2({
//         path: image.dropboxPath,
//       });

//       const filename = `${Date.now()}-${req.file.originalname}`;
//       const dropboxPath = `/images/${filename}`;

//       await dropbox.filesUpload({
//         path: dropboxPath,
//         contents: req.file.buffer,
//         mode: { ".tag": "add" },
//       });

//       image.filename = filename;
//       image.dropboxPath = dropboxPath;
//     }

//     await image.save();

//     return res.json({
//       success: true,
//       message: "Gambar berhasil diupdate",
//       data: image,
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const deleteImage = async (req: Request, res: Response) => {
//   try {
//     const image = await Image.findById(req.params.id);

//     if (!image) {
//       return res.status(404).json({
//         success: false,
//         message: "Gambar tidak ditemukan",
//       });
//     }

//     await dropbox.filesDeleteV2({
//       path: image.dropboxPath,
//     });

//     await image.deleteOne();

//     return res.json({
//       success: true,
//       message: "Gambar berhasil dihapus",
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };