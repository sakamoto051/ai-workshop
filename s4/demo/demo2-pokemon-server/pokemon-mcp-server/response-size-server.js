import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ==========================================
// 戻り値サイズの実測用サーバー
// 同じデータソース（PokéAPI）に対して、
// 「生データをそのまま返す」ツールと「絞り込んで返す」ツールの
// 2つを用意する。同一の会話で両方を呼び出すのではなく、
// 新規会話ごとに片方だけを呼び出し、直後の Context Usage を比較する。
// ==========================================

const server = new Server(
  { name: "pokemon-response-size-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_pokemon_raw",
        description: "ポケモンの生データ（PokéAPIのレスポンスをそのまま）を返します。",
        inputSchema: {
          type: "object",
          properties: {
            pokemon_name: { type: "string", description: "英語名（例: pikachu）" },
          },
          required: ["pokemon_name"],
        },
      },
      {
        name: "get_pokemon_filtered",
        description: "ポケモンの基本情報（名前・タイプ・身長・体重）のみを絞り込んで返します。",
        inputSchema: {
          type: "object",
          properties: {
            pokemon_name: { type: "string", description: "英語名（例: pikachu）" },
          },
          required: ["pokemon_name"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { pokemon_name } = request.params.arguments;
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon_name.toLowerCase()}`);
    if (!res.ok) throw new Error("ポケモンが見つかりません。");
    const data = await res.json();

    if (request.params.name === "get_pokemon_raw") {
      const text = JSON.stringify(data);
      return { content: [{ type: "text", text }] };
    }

    if (request.params.name === "get_pokemon_filtered") {
      const types = data.types.map(t => t.type.name).join(", ");
      const text = `名前: ${data.name}\nタイプ: ${types}\n身長: ${data.height / 10}m\n体重: ${data.weight / 10}kg`;
      return { content: [{ type: "text", text }] };
    }

    throw new Error("Unknown tool");
  } catch (e) {
    return { content: [{ type: "text", text: `エラー: ${e.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
