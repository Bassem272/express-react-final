import { ErrorBuilder } from "../errors/ErrorBuilder.js";
import Post from "../models/post.model.js";
const errorBuilder = new ErrorBuilder();

export async function getAll({ query, skip, limit, page }) {
  try {
    const posts = await Post.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await Post.countDocuments(query);
    return {
      posts: posts,
      data: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (err) {
    throw errorBuilder.createInternalServerError("Failed to fetch posts.");
  }
}

export async function getPostById(id) {
  try {
    const post = await Post.findById(id);
    if (!post) {
      throw errorBuilder.createNotFound("Post not found.");
    }
    return post;
  } catch (err) {
    if (err.name === "CastError") {
      throw errorBuilder.createBadRequest("Invalid post ID.");
    }
    throw err;
  }
}

export async function addPost(data) {
  try {
    const exist = await Post.findOne({ title: data.title });

    if (exist)
      throw errorBuilder.createBadRequest(
        `"A post with the same title-> ${data.title}  ${exist}  already exists, try another name, please~!"`
      );
    const post = new Post(data);
    await post.save();
    return post;
  } catch (err) {
    throw err;
  }
}

export async function updatePost(id, data) {
  try {
    const updatedPost = await Post.findByIdAndUpdate(id, data, { new: true });
    if (!updatedPost) {
      throw errorBuilder.createNotFound("Post to update not found.");
    }
    return updatedPost;
  } catch (err) {
    throw errorBuilder.createBadRequest("Failed to update post.");
  }
}

export async function deletePost(id) {
  try {
    console.log(" service ", id)
    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) {
      throw errorBuilder.createNotFound("Post to delete not found.");
    }

    return { message: "Post deleted successfully" };
  } catch (err) {
    throw errorBuilder.createBadRequest("Failed to delete post.");
  }
}

// cloudflareUpload.js
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path, { resolve } from "path";
import dotenv from "dotenv";
import { log } from "console";
import bucket from "./firebaseConfig.js";
import { rejects } from "assert";
dotenv.config();

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

export async function uploadToCloudflareFromBuffer(fileBuffer, originalname) {
  try {
    console.log("inside the clud flare fun ", fileBuffer, originalname);
    console.log(
      "inside the clud flare fun 2",
      CLOUDFLARE_ACCOUNT_ID,
      CLOUDFLARE_API_TOKEN
    );

    const form = new FormData();
    form.append("file", fileBuffer, originalname);
    form.append("requireSignedURLs", "false"); // set to true if you want signed delivery
    console.log(
      "POSTING to:",
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`
    );
    console.log("Token starts with:", CLOUDFLARE_API_TOKEN?.slice(0, 5)); // Avoid logging the full token

    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      form,
      {
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          ...form.getHeaders(),
        },
      }
    );

    const result = response.data;
    if (!result.success) throw new Error("Upload failed");

    const imageId = result.result.id;
    const imageUrl = `https://imagedelivery.net/fYLyCvm4wbfotq5pbNNTSg/${imageId}/public`;

    return imageUrl;
  } catch (err) {
    console.error("❌ Upload to Cloudflare failed:", err.message);
    throw err;
  }
}

// export async function uploadToCloudflare(localFilePath) {
//   console.log("cloud flare",CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN )
//   try {
//     const form = new FormData();
//     form.append("file", fs.createReadStream(localFilePath));
//     form.append("requireSignedURLs", "false"); // Set true if you want to protect image access

//     const response = await axios.post(
//       `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`,
//       form,
//       {
//         headers: {
//           Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
//           ...form.getHeaders(),
//         },
//       }
//     );

//     const result = response.data;
//     console.log("result of uplad ---> ", result)

//     if (!result.success) throw new Error("Upload failed");

//     const imageId = result.result.id;
//     const imageUrl = `https://imagedelivery.net/fYLyCvm4wbfotq5pbNNTSg/${imageId}/public`;

//     return imageUrl;
//   } catch (err) {
//     console.error("❌ Upload to Cloudflare failed:", err.message);
//     throw err;
//   }
// }

export async function uploadToFireBase(file) {
  return new Promise((resolve, reject) => {
    // console.log(bucket)
    const blob = bucket.file(`posts-pics/${file.originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    blobStream.on("error", (err) => {
      console.error(err);
      // res.status(500).send('Upload error');
      reject(new Error("Upload error"));
    });

    blobStream.on("finish", async () => {
      try {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        // res.status(200).json({ url: publicUrl });
        console.log("success upload fomr the blobstream");
        resolve(publicUrl);
      } catch (error) {
        reject(error);
      }
    });

    blobStream.end(file.buffer);
  });
}
