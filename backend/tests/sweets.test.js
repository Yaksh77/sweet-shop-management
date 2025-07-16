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

describe("DELETE /api/sweets/:id", () => {
  it("should delete a sweet by ID", async () => {
    const sweet = await Sweet.create({
      id: 1005,
      name: "Jalebi",
      category: "Traditional",
      price: 20,
      quantity: 50,
    });

    const res = await request(app).delete(`/api/sweets/${sweet.id}`);
    expect(res.statusCode).toBe(200);

    const exists = await Sweet.findOne({ id: 1005 });
    expect(exists).toBeNull();
  });
});

describe("PUT /api/sweets/:id", () => {
  it("should update an existing sweet", async () => {
    const sweet = await Sweet.create({
      id: 1004,
      name: "Jalebi",
      category: "Traditional",
      price: 20,
      quantity: 50,
    });

    const updatedData = {
      name: "Jalebi Deluxe",
      price: 75,
      quantity: 30,
    };

    const res = await request(app)
      .put(`/api/sweets/${sweet.id}`)
      .send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe("Jalebi Deluxe");
    expect(res.body.data.price).toBe(75);
    expect(res.body.data.quantity).toBe(30);
  });

  it("should return 404 for non-existent sweet", async () => {
    const res = await request(app)
      .put("/api/sweets/99999")
      .send({ name: "Fake Sweet", price: 10 });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Sweet not found to update"); // ✅ or match your exact error
  });
});

describe("PATCH /api/sweets/:id/purchase", () => {
  it("should not allow purchase if insufficient quantity", async () => {
    const sweet = await Sweet.create({
      id: 2002,
      name: "Jalebi",
      category: "Traditional",
      price: 25,
      quantity: 2,
    });

    const res = await request(app)
      .patch(`/api/sweets/${sweet.id}/purchase`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/insufficient stock/i); // ✅ Must match your controller
  });

  it("should not allow purchase if insufficient quantity", async () => {
    const sweet = await Sweet.create({
      id: 2002,
      name: "Jalebi",
      category: "Traditional",
      price: 25,
      quantity: 2,
    });

    const res = await request(app)
      .patch(`/api/sweets/${sweet.id}/purchase`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/insufficient stock/i); // ✅ Must match your controller
  });
});

describe("PATCH /api/sweets/:id/restock", () => {
  it("should increase quantity by specified amount", async () => {
    const sweet = await Sweet.create({
      id: 2003,
      name: "Ladoo",
      category: "Traditional",
      price: 10,
      quantity: 5,
    });

    const res = await request(app)
      .patch(`/api/sweets/${sweet.id}/restock`)
      .send({ quantity: 10 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.quantity).toBe(15);
  });

  it("should return 404 if sweet not found", async () => {
    const res = await request(app)
      .patch("/api/sweets/88888/restock")
      .send({ quantity: 10 });

    expect(res.statusCode).toBe(404);
  });
});

describe("POST /api/sweets/:id/review", () => {
  it("should add a review and increase loyalty points", async () => {
    const sweet = await Sweet.create({
      id: 999,
      name: "Chocolate Bar",
      category: "Modern",
      price: 10,
      quantity: 10,
      reviews: [],
      loyaltyPoints: 10,
    });

    const res = await request(app)
      .post(`/api/sweets/${sweet.id}/review`)
      .send({ name: "Yaksh", message: "Great!", rating: 5 });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.reviews.length).toBe(1);
    expect(res.body.data.loyaltyPoints).toBe(10);
  });
});
