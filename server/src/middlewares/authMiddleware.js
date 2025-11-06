import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ error: "Token ausente" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "change_me");
    req.user = payload; // { sub, email }
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
