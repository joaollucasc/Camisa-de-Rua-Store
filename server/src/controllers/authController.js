import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "../libs/prisma.js";
import * as tokenStore from "../libs/tokenStore.js";

// Verifica se o prisma está disponível.
// Se o prisma não conectou, usamos o tokenStore em arquivo.
const usePrisma = !!prisma; 

export async function register(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email e password são obrigatórios" });

    // 2. PROCURA O USUÁRIO NO BANCO DE DADOS (PRISMA)
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "Usuário já existe" });

    const hashed = bcrypt.hashSync(password, 8);

    // 3. CRIA O USUÁRIO NO BANCO DE DADOS (PRISMA)
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name || "Sem nome",
      },
    });

    const { password: _p, ...safe } = newUser;
    return res.status(201).json({ user: safe });

  } catch (err) {
    console.error("Erro no register:", err.message);
    return res.status(500).json({ error: "Erro interno", details: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email e password são obrigatórios" });

    // 4. PROCURA O USUÁRIO NO BANCO (PRISMA)
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });

    const payload = { sub: user.id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || "change_me", { expiresIn: "15m" });

    const refreshToken = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

    // 5. SALVA O REFRESH TOKEN NO BANCO (PRISMA)
    if (usePrisma) {
      // O schema.prisma está correto para isso
      await prisma.refreshToken.create({ 
        data: { 
          token: refreshToken, 
          userId: user.id, 
          expiresAt 
        } 
      });
    } else {
      // Fallback se o prisma não conectou
      await tokenStore.create({ token: refreshToken, userId: user.id, expiresAt: expiresAt.toISOString(), revoked: false });
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
    });

    const { password: _p, ...safe } = user;
    return res.json({ user: safe, accessToken });
  } catch (err) {
    console.error("Erro no login:", err.message);
    return res.status(500).json({ error: "Erro interno", details: err.message });
  }
}

export async function refresh(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ error: "Refresh token ausente" });

    // 6. PROCURA O REFRESH TOKEN NO BANCO (PRISMA)
    const record = usePrisma 
      ? await prisma.refreshToken.findUnique({ where: { token } }) 
      : await tokenStore.find(token);

    if (!record || record.revoked) return res.status(401).json({ error: "Refresh token inválido" });
    const expiresAt = usePrisma ? record.expiresAt : new Date(record.expiresAt);
    if (new Date(expiresAt) < new Date()) return res.status(401).json({ error: "Refresh token expirado" });

    // 7. PROCURA O DONO DO TOKEN NO BANCO (PRISMA)
    const user = await prisma.user.findUnique({ where: { id: record.userId } });
    if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

    const payload = { sub: user.id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || "change_me", { expiresIn: "15m" });
    return res.json({ accessToken });
  } catch (err)
  {
    console.error("Erro no refresh:", err.message);
    return res.status(500).json({ error: "Erro interno", details: err.message });
  }
}

export async function logout(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      // 8. REVOGA O TOKEN NO BANCO (PRISMA)
      if (usePrisma) {
        await prisma.refreshToken.updateMany({ where: { token }, data: { revoked: true } });
      } else {
        await tokenStore.revoke(token);
      }
      res.clearCookie("refreshToken");
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error("Erro no logout:", err.message);
    return res.status(500).json({ error: "Erro interno", details: err.message });
  }
}

export async function listUsers(req, res) {
  // 9. LISTA USUÁRIOS DO BANCO (PRISMA)
  const users = await prisma.user.findMany({
    select: { // Seleciona apenas campos seguros (sem a senha)
      id: true,
      email: true,
      name: true,
      createdAt: true
    }
  });
  res.json({ users });
}