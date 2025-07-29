// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/initiate", async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const khaltiRes = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      {
        return_url: "https://localhost:5175/myposts", // Frontend callback route
        website_url: "https://localhost:5175",
        amount: 40000, // 400 rupees = 400 * 100
        purchase_order_id: `sub_${Date.now()}`,
        purchase_order_name: "VaultDesk Pro Subscription",
        customer_info: { name, email, phone },
      },
      {
        headers: {
          Authorization: "Key 0706d8013d62436d912e34e0cb78d6c3", // Replace with your Khalti sandbox key
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(khaltiRes.data);
  } catch (err) {
    console.error("Khalti initiation error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to initiate Khalti payment" });
  }
});

module.exports = router;
