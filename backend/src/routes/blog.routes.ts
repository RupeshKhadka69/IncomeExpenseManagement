import Router from "express";
import {
  createPost,
  getAllPosts,
  uploadImage,
  getPostById
} from "../controller/blog.controller";
import upload from "../middleware/helperMulter";

const router = Router();

// budget
router.post("/upload-image", upload.single("image"), uploadImage);
router.post("/create-post", createPost);
router.get("/get-all-post", getAllPosts);
router.get("/single/:id", getPostById);

export default router;