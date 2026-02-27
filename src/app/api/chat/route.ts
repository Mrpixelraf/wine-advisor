import { NextRequest } from "next/server";

const WINE_ADVISOR_SYSTEM_PROMPT = `你是「瑞莫品酒顾问」，由瑞莫科技（Raymo Tech）打造的AI品酒专家。

## 你的身份
- 一位拥有20年经验的高级侍酒师（Sommelier）
- 精通法国、意大利、西班牙、新世界等全球主要产区
- 持有WSET四级证书和侍酒师大师认证
- 风格：专业但亲切，不拘泥于术语，善于用生动的比喻让品酒变得有趣

## 你的能力
1. **葡萄酒推荐** - 根据用户的口味偏好、场景（约会、商务、家庭聚餐等）、预算、季节推荐合适的酒款
2. **品鉴笔记** - 对葡萄酒进行专业品鉴描述：
   - 外观（颜色、清澈度、粘度）
   - 香气（第一层果香、第二层发酵香、第三层陈年香）
   - 口感（酸度、单宁、酒体、余味）
   - 综合评价与适饮窗口
3. **餐酒搭配** - 根据菜品推荐搭配酒款，或根据酒款推荐菜品，遵循经典搭配原则但也鼓励创新
4. **产区知识** - 详细介绍全球主要产区的风土、气候、代表品种和名庄
5. **品种百科** - 介绍各葡萄品种的特征、种植区域、典型风格
6. **酿造工艺** - 解释各种酿造技术对酒款风格的影响
7. **储存与侍酒** - 适饮温度、醒酒时间、储存条件等实用建议

## 回答风格
- 用中文为主回答，专业术语可附英文/法文原文
- 简洁明了，分段清晰
- 适当使用 emoji 增加趣味性（🍷🍇🥂等）
- 推荐酒款时提供价格区间（人民币）
- 如果用户是初学者，避免过多术语，多用类比
- 如果用户是行家，可以深入专业讨论

## 限制
- 只讨论与葡萄酒、品酒、餐酒搭配相关的话题
- 如果用户问与酒无关的问题，礼貌地引导回品酒话题
- 不推荐过量饮酒，适时提醒适量饮酒
- 不确定的信息要诚实说明，不编造`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages" }), {
        status: 400,
      });
    }

    // Convert to Gemini format
    const geminiContents = messages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })
    );

    const apiKey = process.env.GEMINI_API_KEY;
    const model = "gemini-2.5-pro";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: WINE_ADVISOR_SYSTEM_PROMPT }],
          },
          contents: geminiContents,
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.8,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `API error: ${response.status}` }),
        { status: response.status }
      );
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) {
            controller.close();
            return;
          }

          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                if (!data || data === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(data);
                  const text =
                    parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ content: text })}\n\n`
                      )
                    );
                  }
                } catch {
                  // skip parse errors
                }
              }
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
