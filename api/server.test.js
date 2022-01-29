const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

describe("Sanity", () => {
  test("test check", () => {
    expect(true).toBe(true);
  });
  test("Environment check", () => {
    expect(process.env.NODE_ENV).toBe("testing");
  });
});

describe("******** POST, /api/auth/register ******** ", () => {
  let res;
  describe('Valid Data:', () => {
  beforeEach(async () => {
    res = await request(server)
      .post("/api/auth/register")
      .send({ username: "tester2", password: "111111" });
  });
  test("res with 201 on success", async () => {
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ username: "tester2" });
  });
  test("inserts into db", async () => {
    const [testUser] = await db("users").where("id", 1);
    expect(testUser).toMatchObject({ username: "tester2" });
  });
});
describe('Username Missing:', () => {
  beforeEach(async () => {
    res = await request(server)
      .post("/api/auth/register")
      .send({password: "111111" });
  });
  test("res with 400 and correct message", async () => {
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ message: "username and password required" });
  });
});
describe('Password Missing:', () => {
  beforeEach(async () => {
    res = await request(server)
      .post("/api/auth/register")
      .send({username: "tester123" });
  });
  test("res with 400 and correct message", async () => {
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ message: "username and password required" });
  });
});

});


describe('******** POST, /api/auth/login ********', () => {
  beforeAll(async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'login1', password: '111111' })
  })
  let res
  describe('Valid Credentials:', () => {
    beforeEach(async () => {
      res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'login1', password: '111111' })
    })
    test('res status 200', async () => {
      expect(res.status).toBe(200)
    })
    test('res token exists', async () => {
      expect(res.body.token).toBeTruthy()
    })
    test('res message valid', async () => {
      expect(res.body).toMatchObject({ message: 'welcome, login1' })
    })
 
  })
  describe('Invalid Credentials', () => {
    test('res message correct', async () => {
      res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'login1', password: '222222' })
      expect(res.body).toMatchObject({ message: 'invalid credentials' })
      })
    })
  })
