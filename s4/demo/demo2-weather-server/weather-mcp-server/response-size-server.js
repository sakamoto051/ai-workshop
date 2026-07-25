import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ==========================================
// 戻り値サイズの実測用サーバー
// 同じデータソース（Open-Meteo）に対して、
// 「取得可能な変数を全部盛りで返す」ツールと「絞り込んで返す」ツールの
// 2つを用意する。同一の会話で両方を呼び出すのではなく、
// 新規会話ごとに片方だけを呼び出し、直後の Context Usage を比較する。
// ==========================================

const server = new Server(
  { name: "weather-response-size-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

const RAW_HOURLY_VARS = [
  "temperature_2m", "relative_humidity_2m", "dew_point_2m", "apparent_temperature",
  "precipitation_probability", "precipitation", "rain", "showers", "snowfall", "snow_depth",
  "weather_code", "pressure_msl", "surface_pressure", "cloud_cover", "cloud_cover_low",
  "cloud_cover_mid", "cloud_cover_high", "visibility", "evapotranspiration",
  "et0_fao_evapotranspiration", "vapour_pressure_deficit",
  "wind_speed_10m", "wind_speed_80m", "wind_speed_120m", "wind_speed_180m",
  "wind_direction_10m", "wind_direction_80m", "wind_direction_120m", "wind_direction_180m",
  "wind_gusts_10m", "temperature_80m", "temperature_120m", "temperature_180m",
  "soil_temperature_0cm", "soil_temperature_6cm", "soil_temperature_18cm", "soil_temperature_54cm",
  "soil_moisture_0_to_1cm", "soil_moisture_1_to_3cm", "soil_moisture_3_to_9cm",
  "soil_moisture_9_to_27cm", "soil_moisture_27_to_81cm",
].join(",");

const RAW_DAILY_VARS = [
  "weather_code", "temperature_2m_max", "temperature_2m_min", "sunrise", "sunset",
  "uv_index_max", "precipitation_sum", "rain_sum", "showers_sum", "snowfall_sum",
  "precipitation_hours", "precipitation_probability_max",
  "wind_speed_10m_max", "wind_gusts_10m_max", "wind_direction_10m_dominant",
].join(",");

async function geocode(location) {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=ja&format=json`
  );
  if (!res.ok) throw new Error("地名検索に失敗しました。");
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error("地名が見つかりません。");
  return data.results[0];
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_weather_raw",
        description: "指定地点の気象データを、取得可能な変数を全て含めて返します（16日分・時間別/日別）。",
        inputSchema: {
          type: "object",
          properties: {
            location: { type: "string", description: "地名（英語表記、例: Tokyo）" },
          },
          required: ["location"],
        },
      },
      {
        name: "get_weather_filtered",
        description: "指定地点の現在の天気（天気・気温・風速）のみを絞り込んで返します。",
        inputSchema: {
          type: "object",
          properties: {
            location: { type: "string", description: "地名（英語表記、例: Tokyo）" },
          },
          required: ["location"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { location } = request.params.arguments;
  try {
    const place = await geocode(location);

    if (request.params.name === "get_weather_raw") {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
        `&hourly=${RAW_HOURLY_VARS}&daily=${RAW_DAILY_VARS}&forecast_days=16&timezone=${encodeURIComponent(place.timezone)}`
      );
      if (!res.ok) throw new Error("天気情報の取得に失敗しました。");
      const data = await res.json();
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }

    if (request.params.name === "get_weather_filtered") {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current_weather=true&timezone=${encodeURIComponent(place.timezone)}`
      );
      if (!res.ok) throw new Error("天気情報の取得に失敗しました。");
      const data = await res.json();
      const cw = data.current_weather;
      const text = `地点: ${place.name}\n気温: ${cw.temperature}°C\n風速: ${cw.windspeed}km/h`;
      return { content: [{ type: "text", text }] };
    }

    throw new Error("Unknown tool");
  } catch (e) {
    return { content: [{ type: "text", text: `エラー: ${e.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
