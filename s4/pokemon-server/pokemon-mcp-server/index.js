import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourceTemplatesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  { name: "pokemon-server", version: "1.0.0" },
  { capabilities: { tools: {}, resources: {}, prompts: {} } }
);

// ==========================================
// 1. Tools (ツール機能) の定義と実装
// ==========================================
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

// ==========================================
// 2. Resources (リソース機能) の定義と実装
// ==========================================
server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
  return {
    resourceTemplates: [
      {
        uriTemplate: "pokemon://{pokemon_name}/info",
        name: "Pokemon Info",
        description: "指定したポケモンの詳細データ（能力値や特性など）を取得します。",
        mimeType: "text/plain"
      }
    ]
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  const match = uri.match(/^pokemon:\/\/([^/]+)\/info$/);
  if (!match) {
    throw new Error(`Unsupported URI: ${uri}`);
  }
  const pokemon_name = match[1].toLowerCase();
  
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon_name}`);
    if (!res.ok) throw new Error("ポケモンが見つかりません。");
    const data = await res.json();
    
    const stats = data.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join("\n");
    const abilities = data.abilities.map(a => a.ability.name).join(", ");
    const text = `【${data.name.toUpperCase()} の詳細情報】\nタイプ: ${data.types.map(t => t.type.name).join(", ")}\n特性: ${abilities}\nステータス:\n${stats}`;
    
    return {
      contents: [
        {
          uri: uri,
          mimeType: "text/plain",
          text: text
        }
      ]
    };
  } catch (e) {
    throw new Error(`Failed to read pokemon resource: ${e.message}`);
  }
});

// ==========================================
// 3. Prompts (プロンプト機能) の定義と実装
// ==========================================
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "suggest-pokemon-team",
        description: "指定したコンセプトに合わせたおすすめのポケモンチーム編成を提案します。",
        arguments: [
          {
            name: "concept",
            description: "チームのコンセプトや戦術（例: rain team, trick room, beginner-friendlyなど）",
            required: true
          }
        ]
      }
    ]
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name !== "suggest-pokemon-team") {
    throw new Error("Unknown prompt");
  }
  const concept = request.params.arguments?.concept || "バランス重視";
  
  return {
    description: `${concept} コンセプトに基づくポケモンチームの提案`,
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `以下のコンセプトに合わせたおすすめのポケモンチーム（6匹）を提案してください。\nコンセプト: ${concept}\n各ポケモンの役割やおすすめのわざ、持ち物、相乗効果（シナジー）についても詳しく解説してください。`
        }
      }
    ]
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
