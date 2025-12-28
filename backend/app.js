const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");


const user = require("./routes/user");
const book = require("./routes/book");
const cart = require("./routes/cart");
const fav = require("./routes/favourite");
const order = require("./routes/order");

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 1000;

// Allow only your Netlify frontend
app.use(
  cors({
    origin: "https://bookverse-47wi.onrender.com",
    credentials: true,
  })
);

app.use(express.json());

// Database Connection
require("./conn/conn");

// ✅ AI Chat Route using wit API


const Book = require("./models/book");
const axios = require("axios");

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    let reply = "Sorry, I couldn't understand that.";
    let buttons = null;

    const lowerMsg = message.toLowerCase();

    // ----------------------------
    // 1️⃣ Greetings / Small Talk
    // ----------------------------
    if (["hi", "hello", "hey there", "hey"].includes(lowerMsg)) {
      reply =
        "Hi! 👋 I’m your BookHeaven Assistant. Ask me about books, authors, availability, or price.";
      buttons = ["Recent Books", "Recommend Fantasy Books", "Contact Support"];
    } else if (lowerMsg.includes("how are you")) {
      reply = "I’m great, thank you! I can help you find books, check availability, or show prices.";
    } else if (lowerMsg.includes("what can you do")) {
      reply =
        "I can show recent books, search by author, check availability, tell prices, give book details, and recommend books by genre.";
      buttons = ["Recent Books", "Recommend Fiction Books", "Contact Support"];
    }

    // ----------------------------
    // 2️⃣ Recent / Latest Books
    // ----------------------------
    else if (lowerMsg.includes("recent books") || lowerMsg.includes("latest books") || lowerMsg.includes("new arrivals")) {
      const books = await Book.find().sort({ createdAt: -1 }).limit(5);
      reply = books.length
        ? `Here are the latest books:\n${books.map((b) => b.title).join(", ")}`
        : "No books found!";
      buttons = ["Recommend Fiction Books", "Recommend Fantasy Books"];
    }

    // ----------------------------
    // 3️⃣ Recommendations by Genre
    // ----------------------------
else if (lowerMsg.includes("top rated")) {
  const books = await Book.find().sort({ rating: -1 }).limit(5);
  reply = books.length
    ? `Top Rated Books:\n${books.map((b) => `${b.title} (${b.rating}⭐)`).join("\n")}`
    : "No books found!";
  buttons = ["Recent Books", "Top Rated Books", "Contact Support"];
}

    // ----------------------------
    // 4️⃣ Author Search
    // ----------------------------
    else if (lowerMsg.match(/books? by (.+)/i)) {
      const authorMatch = lowerMsg.match(/books? by (.+)/i);
      const books = await Book.find({ author: new RegExp(authorMatch[1], "i") });
      reply = books.length
        ? `Books by ${authorMatch[1]}:\n${books.map((b) => b.title).join(", ")}`
        : `No books found by ${authorMatch[1]}.`;
      buttons = ["Recent Books", "Recommend Fiction Books"];
    }

    // ----------------------------
    // 5️⃣ Availability
    // ----------------------------
    else if (lowerMsg.match(/is (.+?) available[?]?$/i)) {
      const titleMatch = lowerMsg.match(/is (.+?) available[?]?$/i);
      if (titleMatch) {
        const bookTitle = titleMatch[1].trim();
        const book = await Book.findOne({ title: new RegExp(`^${bookTitle}$`, "i") });
        reply = book
          ? book.available
            ? `${book.title} is available.`
            : `${book.title} is currently unavailable.`
          : `Book titled "${bookTitle}" not found.`;
        buttons = ["Recent Books", "Recommend Fantasy Books"];
      }
    }

    // ----------------------------
    // 6️⃣ Price Inquiry
    // ----------------------------
    else if (lowerMsg.match(/price of (.+)/i)) {
      const titleMatch = lowerMsg.match(/price of (.+)/i);
      if (titleMatch) {
        const bookTitle = titleMatch[1].trim();
        const book = await Book.findOne({ title: new RegExp(`^${bookTitle}$`, "i") });
        reply = book
          ? `The price of "${book.title}" is ₹${book.price.toFixed(2)}.`
          : `Book titled "${bookTitle}" not found.`;
        buttons = ["Recent Books", "Recommend Fiction Books"];
      }
    }

    // ----------------------------
    // 7️⃣ Book Details
    // ----------------------------
    else if (lowerMsg.match(/details of (.+)/i)) {
      const titleMatch = lowerMsg.match(/details of (.+)/i);
      if (titleMatch) {
        const bookTitle = titleMatch[1].trim();
        const book = await Book.findOne({ title: new RegExp(`^${bookTitle}$`, "i") });
        reply = book
          ? `Title: ${book.title}\nAuthor: ${book.author}\nGenre: ${book.genre || "N/A"}\nPrice: $${book.price.toFixed(2)}\nAvailable: ${book.available ? "Yes" : "No"}`
          : `Book titled "${bookTitle}" not found.`;
        buttons = ["Recent Books", "Contact Support"];
      }
    }

    // ----------------------------
    // 8️⃣ Support / FAQs
    // ----------------------------
    else if (lowerMsg.includes("contact support")) {
      reply = "You can contact support at aniketjain7247213350@gmail.com or call +91-7247213350.";
      buttons = ["Recent Books", "Recommend Fiction Books"];
    }

    // ----------------------------
    // 9️⃣ Default fallback
    // ----------------------------
    else {
      reply = "Sorry, I couldn't understand that. Try asking about books, authors, availability, or price.";
      buttons = ["Recent Books", "Recommend Fantasy Books", "Contact Support"];
    }

    // ----------------------------
    res.json({ reply, buttons });
  } catch (err) {
    console.error("AI Error:", err.message);
    res.status(500).json({ reply: "⚠️ Error connecting to AI service." });
  }
});


// Calling Routes
app.use("/api/v1", user);
app.use("/api/v1", book);
app.use("/api/v1", cart);
app.use("/api/v1", fav);
app.use("/api/v1", order);

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server Started at PORT: ${PORT}`);
});


// Health check endpoint
app.get("/ping", (req, res) => {
  res.status(200).send("OK");
});
