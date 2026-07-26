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
  { name: "weather-server", version: "1.0.0" },
  { capabilities: { tools: {}, resources: {}, prompts: {} } }
);

// WMO Weather interpretation codes (出典: https://open-meteo.com/en/docs)
function weatherCodeToText(code) {
  const map = {
    0: "快晴",
    1: "晴れ", 2: "晴れ時々曇り", 3: "曇り",
    45: "霧", 48: "霧（着氷性）",
    51: "小雨", 53: "霧雨", 55: "強い霧雨",
    56: "着氷性の霧雨（弱）", 57: "着氷性の霧雨（強）",
    61: "小雨", 63: "雨", 65: "大雨",
    66: "着氷性の雨（弱）", 67: "着氷性の雨（強）",
    71: "小雪", 73: "雪", 75: "大雪",
    77: "霧雪",
    80: "にわか雨（弱）", 81: "にわか雨", 82: "激しいにわか雨",
    85: "にわか雪（弱）", 86: "にわか雪（強）",
    95: "雷雨",
    96: "雷雨（雹を伴う、弱）", 99: "雷雨（雹を伴う、強）",
  };
  return map[code] ?? `不明な天気コード(${code})`;
}

async function geocode(location) {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=ja&format=json`
  );
  if (!res.ok) throw new Error("地名検索に失敗しました。");
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error("地名が見つかりません。");
  return data.results[0];
}

// ==========================================
// 1. Tools (ツール機能) の定義と実装
// ==========================================
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_weather",
        description: "指定した地点の現在の天気を取得します。",
        inputSchema: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "地名（英語表記、例: Tokyo, Osaka, Paris）",
            },
          },
          required: ["location"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_weather") {
    const { location } = request.params.arguments;
    try {
      const place = await geocode(location);

      // 機能拡張前: 今日の天気のみ取得
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current_weather=true&timezone=${encodeURIComponent(place.timezone)}`
      );
      if (!res.ok) throw new Error("天気情報の取得に失敗しました。");
      const data = await res.json();
      const cw = data.current_weather;
      const text = `地点: ${place.name}\n天気: ${weatherCodeToText(cw.weathercode)}\n気温: ${cw.temperature}°C\n風速: ${cw.windspeed}km/h`;

      // 機能拡張後（ステップ3）: 明日の予報も取得する場合
      // const res = await fetch(
      //   `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&forecast_days=2&timezone=${encodeURIComponent(place.timezone)}`
      // );
      // if (!res.ok) throw new Error("天気情報の取得に失敗しました。");
      // const data = await res.json();
      // const cw = data.current_weather;
      // const text = `地点: ${place.name}\n天気: ${weatherCodeToText(cw.weathercode)}\n気温: ${cw.temperature}°C\n風速: ${cw.windspeed}km/h\n明日の予報: 最高${data.daily.temperature_2m_max[1]}°C 最低${data.daily.temperature_2m_min[1]}°C`;

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
        uriTemplate: "weather://{location}/forecast",
        name: "Weather Forecast",
        description: "指定した地点の7日間の天気予報（最高/最低気温・降水確率）を取得します。",
        mimeType: "text/plain"
      }
    ]
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  const match = uri.match(/^weather:\/\/([^/]+)\/forecast$/);
  if (!match) {
    throw new Error(`Unsupported URI: ${uri}`);
  }
  const location = decodeURIComponent(match[1]);

  try {
    const place = await geocode(location);
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7&timezone=${encodeURIComponent(place.timezone)}`
    );
    if (!res.ok) throw new Error("天気予報の取得に失敗しました。");
    const data = await res.json();

    const lines = data.daily.time.map((date, i) =>
      `${date}: ${weatherCodeToText(data.daily.weather_code[i])} / 最高${data.daily.temperature_2m_max[i]}°C 最低${data.daily.temperature_2m_min[i]}°C / 降水確率${data.daily.precipitation_probability_max[i]}%`
    );
    const text = `【${place.name} の7日間予報】\n${lines.join("\n")}`;

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
    throw new Error(`Failed to read weather resource: ${e.message}`);
  }
});

// ==========================================
// 3. Prompts (プロンプト機能) の定義と実装
// ==========================================
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "suggest-packing-list",
        description: "指定した地点の天気を踏まえた旅行の持ち物リストを提案します。",
        arguments: [
          {
            name: "location",
            description: "旅行先の地名（例: 東京, 札幌, 那覇）",
            required: true
          }
        ]
      }
    ]
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name !== "suggest-packing-list") {
    throw new Error("Unknown prompt");
  }
  const location = request.params.arguments?.location || "東京";

  return {
    description: `${location} の天気を踏まえた持ち物リストの提案`,
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `${location} の現在の天気予報を調べたうえで、旅行に持っていくべき持ち物リストを提案してください。\n服装・雨具・気温対策など、天気の特徴に応じた理由も添えてください。`
        }
      }
    ]
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
