let prisma = null;

// Só inicializa o PrismaClient quando houver DATABASE_URL configurada.
// Isso evita erros durante desenvolvimento quando o cliente ainda não foi gerado
// ou quando não há DB configurado (usamos tokenStore como fallback).
if (process.env.DATABASE_URL) {
	try {
		const { PrismaClient } = await import("@prisma/client");
		prisma = new PrismaClient();
	} catch (err) {
		console.warn("Prisma client não pôde ser inicializado:", err.message);
		prisma = null;
	}
}

export default prisma;
