import mongoose from "mongoose";

const TEST_DB_URI =
    process.env.TEST_MONGODB_URI ||
    "mongodb://localhost:27017/code-review-test";

beforeAll(async () => {
    await mongoose.connect(TEST_DB_URI);
});

afterEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        await collections[key]?.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.disconnect();
});




