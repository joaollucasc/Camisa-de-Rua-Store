import prisma from "../libs/prisma.js";

// Lista os produtos do banco
export async function listar(req, res) {
  try {
    const produtos = await prisma.product.findMany();
    res.json({ produtos });
  } catch (err) {
    console.error("Erro ao listar produtos:", err.message);
    res.status(500).json({ error: "Erro interno ao buscar produtos" });
  }
}

// Obtém um produto do banco
export async function obter(req, res) {
  try {
    const id = Number(req.params.id);
    const p = await prisma.product.findUnique({ where: { id } });

    if (!p) return res.status(404).json({ error: "Produto não encontrado" });
    return res.json({ produto: p });
  } catch (err) {
    console.error("Erro ao obter produto:", err.message);
    res.status(500).json({ error: "Erro interno" });
  }
}

// Cria um produto do banco
export async function criar(req, res) {
  try {
    const { nome, preco, categoria } = req.body;
    if (!nome || preco == null) return res.status(400).json({ error: "nome e preco são obrigatórios" });

    const novo = await prisma.product.create({
      data: {
        nome,
        preco: Number(preco),
        categoria: categoria || ""
      }
    });

    return res.status(201).json({ produto: novo });
  } catch (err) {
    console.error("Erro ao criar produto:", err.message);
    res.status(500).json({ error: "Erro interno" });
  }
}