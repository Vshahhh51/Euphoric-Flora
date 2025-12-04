//vatsal

import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());


let nextId = 4;
let colors = [
  { id: 1, name: "red", hex: "#ff0000" },
  { id: 2, name: "green", hex: "#00ff00" },
  { id: 3, name: "blue", hex: "#0000ff" },
];


const isHex = (s) => /^#?[0-9a-fA-F]{6}$/.test(s);
const normHex = (s) => (s.startsWith("#") ? s.toLowerCase() : "#" + s.toLowerCase());


app.get("/api/colors", (req, res) => {
  res.json(colors);
});


app.get("/api/colors/:id", (req, res) => {
  const id = Number(req.params.id);
  const color = colors.find((c) => c.id === id);
  if (!color) return res.status(404).json({ error: "Color not found" });
  res.json(color);
});


app.post("/api/colors", (req, res) => {
  const { name, hex } = req.body ?? {};
  if (!name || !hex || !isHex(hex))
    return res.status(400).json({ error: "Required: name, hex(6-digit)" });

  if (colors.some((c) => c.name.toLowerCase() === name.toLowerCase()))
    return res.status(409).json({ error: "Color name already exists" });

  const color = { id: nextId++, name, hex: normHex(hex) };
  colors.push(color);
  res.status(201).json(color);
});


app.put("/api/colors/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = colors.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Color not found" });

  const { name, hex } = req.body ?? {};
  if (!name || !hex || !isHex(hex))
    return res.status(400).json({ error: "Required: name, hex(6-digit)" });

  colors[idx] = { id, name, hex: normHex(hex) };
  res.json(colors[idx]);
});

app.patch("/api/colors/:id", (req, res) => {
  const id = Number(req.params.id);
  const color = colors.find((c) => c.id === id);
  if (!color) return res.status(404).json({ error: "Color not found" });

  const { name, hex } = req.body ?? {};
  if (hex && !isHex(hex))
    return res.status(400).json({ error: "hex must be 6-digit" });
});