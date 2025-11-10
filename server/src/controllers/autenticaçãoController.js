import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Usuário teste (apenas para desenvolvimento)
const users = [
  { id: 1, email: "teste@teste.com", password: bcrypt.hashSync("123456", 8), name: "Usuário Teste" },
];

export function register(req, res) {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email e password são obrigatórios" });
  }

  const exists = users.find((u) => u.email === email);
  if (exists) return res.status(409).json({ error: "Usuário já existe" });

  const hashed = bcrypt.hashSync(password, 8);
  const newUser = { id: users.length + 1, email, password: hashed, name: name || "Sem nome" };
  users.push(newUser);

  const { password: _p, ...safe } = newUser;
  return res.status(201).json({ user: safe });
}

export function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email e password são obrigatórios" });

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

  const ok = bcrypt.compareSync(password, user.password);
  if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });

  const payload = { sub: user.id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET || "change_me", { expiresIn: "1d" });

  const { password: _p, ...safe } = user;
  return res.json({ user: safe, token });
}

export function listUsers(req, res) {
  const safeList = users.map(({ password, ...rest }) => rest);
  res.json({ users: safeList });
}
