const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.test") }); // ✅ Load test env

const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Sweet = require("../models/Sweet");

beforeAll(async () => {
  console.log("🔐 Test MONGO_URI:", process.env.MONGO_URI); // For debug
  await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
  await Sweet.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/sweets", () => {
  it("should add a new sweet", async () => {
    const res = await request(app).post("/api/sweets").send({
      id: 1001,
      name: "Rasgulla",
      category: "Milk-Based",
      price: 25,
      quantity: 30,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.name).toBe("Rasgulla");
  });
});

describe("GET /api/sweets", () => {
  it("should fetch all sweets", async () => {
    await Sweet.create([
      {
        id: 1001,
        name: "Kaju Katli",
        category: "Nut-Based",
        price: 50,
        quantity: 20,
      },
      {
        id: 1002,
        name: "Gajar Halwa",
        category: "Vegetable-Based",
        price: 30,
        quantity: 15,
      },
    ]);

    const res = await request(app).get("/api/sweets");
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(2);
    expect(res.body.data[0]).toHaveProperty("name");
  });
});
