import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const server = new Server({ name: "pokemon-server", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_pokemon_info",
        description: "ポケモンの基本情報を取得します。",
        inputSchema: {
          type: "object",
          properties: {
            pokemon_name: {
              type: "string",
              description: "英語名（例: pikachu）",
            },
          },
          required: ["pokemon_name"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_pokemon_info") {
    const { pokemon_name } = request.params.arguments;
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon_name.toLowerCase()}`);
      if (!res.ok) throw new Error("ポケモンが見つかりません。");
      const data = await res.json();
      const types = data.types.map(t => t.type.name).join(", ");
      const text = `名前: ${data.name}\nタイプ: ${types}\n身長: ${data.height / 10}m\n体重: ${data.weight / 10}kg`;
      return { content: [{ type: "text", text }] };
    } catch (e) {
      return { content: [{ type: "text", text: `エラー: ${e.message}` }], isError: true };
    }
  }
  throw new Error("Unknown tool");
});

const transport = new StdioServerTransport();
await server.connect(transport);
