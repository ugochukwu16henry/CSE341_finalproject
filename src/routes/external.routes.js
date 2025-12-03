const express = require("express");
const router = express.Router();
const axios = require("axios");

/**
 * @swagger
 * /quotes/random:
 *   get:
 *     summary: Get a random inspirational quote from FavQs API
 *     tags: [External APIs]
 *     responses:
 *       200:
 *         description: Random quote retrieved successfully
 *       500:
 *         description: Error fetching quote from external API
 */
router.get("/quotes/random", async (req, res) => {
  try {
    const response = await axios.get("https://favqs.com/api/qotd");
    const quote = {
      text: response.data.quote.body,
      author: response.data.quote.author,
      source: "FavQs",
    };
    res.status(200).json(quote);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch quote from external API",
      details: err.message,
    });
  }
});

/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Search for books using Google Books API
 *     tags: [External APIs]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query for books
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 *       400:
 *         description: Query parameter is required
 *       500:
 *         description: Error fetching books from external API
 */
router.get("/books/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const response = await axios.get("https://www.googleapis.com/books/v1/volumes", {
      params: {
        q: q,
        maxResults: 10,
      },
    });

    const books = response.data.items?.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      description: item.volumeInfo.description,
      publishedDate: item.volumeInfo.publishedDate,
      imageLinks: item.volumeInfo.imageLinks,
      previewLink: item.volumeInfo.previewLink,
    })) || [];

    res.status(200).json({
      totalItems: response.data.totalItems || 0,
      books: books,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch books from external API",
      details: err.message,
    });
  }
});

module.exports = router;

