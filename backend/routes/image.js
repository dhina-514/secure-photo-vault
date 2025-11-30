const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Image = require("../models/Image");
const authMiddleware = require("./authMiddleware");

const router = express.Router();

// Ensure uploads folder exists
const uploadFolder = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + ".enc"); // encrypted file
  },
});

const upload = multer({ storage });

// Upload encrypted image
router.post(
  "/upload",
  authMiddleware,
  upload.single("encryptedFile"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });

      const { originalName, mimeType } = req.body;

      const image = new Image({
        owner: req.user.id,
        originalName: originalName || "unknown",
        encryptedPath: req.file.path,
        mimeType: mimeType || "application/octet-stream",
        size: req.file.size,
      });

      await image.save();

      res.status(201).json({ message: "Image uploaded", image });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all images for logged-in user (metadata only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const images = await Image.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(images);
  } catch (err) {
    console.error("Get images error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Download specific encrypted file
router.get("/:id/download", authMiddleware, async (req, res) => {
  try {
    const image = await Image.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!image) return res.status(404).json({ message: "Image not found" });

    res.download(image.encryptedPath, path.basename(image.encryptedPath));
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get encrypted content for one image (for decryption on client)
router.get("/:id/content", authMiddleware, async (req, res) => {
  try {
    const image = await Image.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Read ciphertext from the .enc file (we stored ciphertext as text)
    fs.readFile(image.encryptedPath, "utf8", (err, data) => {
      if (err) {
        console.error("Read file error:", err);
        return res.status(500).json({ message: "Could not read encrypted file" });
      }

      // data = ciphertext string
      res.json({ ciphertext: data, mimeType: image.mimeType });
    });
  } catch (err) {
    console.error("Get image content error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an encrypted image
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const image = await Image.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete encrypted file from disk
    if (image.encryptedPath) {
      fs.unlink(image.encryptedPath, (err) => {
        if (err) {
          console.error("Failed to delete file:", err.message);
        }
      });
    }

    // Delete document from DB
    await image.deleteOne();

    res.json({ message: "Image deleted" });
  } catch (err) {
    console.error("Delete image error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
