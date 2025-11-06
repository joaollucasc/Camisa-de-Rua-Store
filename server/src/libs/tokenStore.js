import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve para o diretório `server` (duas pastas acima: src/libs -> server/src/libs)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE = path.resolve(__dirname, "..", "..", "tmp_refresh_tokens.json");

async function readAll() {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

async function writeAll(list) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf8");
}

export async function create(tokenObj) {
  const list = await readAll();
  list.push(tokenObj);
  await writeAll(list);
  return tokenObj;
}

export async function find(token) {
  const list = await readAll();
  return list.find((t) => t.token === token) || null;
}

export async function revoke(token) {
  const list = await readAll();
  const idx = list.findIndex((t) => t.token === token);
  if (idx === -1) return 0;
  list[idx].revoked = true;
  await writeAll(list);
  return 1;
}

export async function removeExpired() {
  const list = await readAll();
  const now = new Date();
  const filtered = list.filter((t) => new Date(t.expiresAt) > now && !t.revoked);
  await writeAll(filtered);
  return filtered.length;
}
