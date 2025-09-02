import mongoose from "mongoose";

export default async function () {
  await mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log(`connected to the ${process.env.DB_NAME}`))
    .catch((error) => console.log(`Database error ===> `, error));
}
