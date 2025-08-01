import jsonwebtoken from "jsonwebtoken";

const gererateToken = (userId) => {
  const token = jsonwebtoken.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return token;
}
export default gererateToken;