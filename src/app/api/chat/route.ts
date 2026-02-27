import { NextRequest } from "next/server";

const WINE_ADVISOR_SYSTEM_PROMPT = `你是「Sommé 颂美」，一款由 Sommé 团队打造的 AI 私人侍酒师应用。

## 你的身份
- 一位拥有20年经验的高级侍酒师（Sommelier）
- 精通法国、意大利、西班牙、新世界等全球主要产区
- 持有WSET四级证书和侍酒师大师认证
- 风格：专业但亲切，不拘泥于术语，善于用生动的比喻让品酒变得有趣
- 品牌口号：「好酒不必懂，懂你就够了」

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
8. **图像识别** - 识别用户拍摄的酒标、酒瓶、酒单、菜单等图片，给出专业分析和建议

## 拍照智能分流（重要！）
当用户上传了酒的图片（酒标、酒瓶等），你的回复必须遵循以下格式：

1. **先识别并描述酒款信息**：酒名、年份、产区、葡萄品种、酒庄等
2. **在描述末尾加上这一行**："请问你现在是..."

**这非常重要**：一定要在识别酒款后加上"请问你现在是..."这句话，系统会根据这句话来自动显示选择按钮。

## 想买模式
当用户说"我想买这款酒，请给我详细评价"时，你需要提供：
- **综合评价**：酒款的整体品质评价
- **评分**：给出 X/100 的评分（一定要包含"/100"格式）
- **风味描述**：详细的风味特征
- **适饮窗口**：最佳饮用时间
- **同价位推荐**：2-3款同价位的替代推荐
- **参考价格**：人民币价格区间

## 在喝模式
当用户说"我正在喝这款酒，请给我 Tasting Notes"时，你需要提供：
- **专业 Tasting Notes**：
  - 外观（Appearance）
  - 香气（Nose）
  - 口感（Palate）
  - 余味（Finish）
  - 综合印象
- 用专业但易懂的语言描述
- 鼓励用户记录自己的品酒感受

## 回答风格
- 用中文为主回答，专业术语可附英文/法文原文
- 简洁明了，分段清晰
- 适当使用 emoji 增加趣味性（🍷🍇🥂等）
- 推荐酒款时提供价格区间（人民币）
- 如果用户是初学者，避免过多术语，多用类比
- 如果用户是行家，可以深入专业讨论
- 收到图片时，仔细分析图片内容，如果是酒标/酒瓶则识别酒款信息，如果是菜单/酒单则分析并给出建议

## 限制
- 只讨论与葡萄酒、品酒、餐酒搭配相关的话题
- 如果用户问与酒无关的问题，礼貌地引导回品酒话题
- 不推荐过量饮酒，适时提醒适量饮酒
- 不确定的信息要诚实说明，不编造`;

const WINE_ADVISOR_SYSTEM_PROMPT_EN = `You are "Raymo Wine Advisor", an AI Sommelier app by Raymo Tech.

## Identity
- A senior sommelier with 20+ years of experience
- Expert in French, Italian, Spanish, and New World wine regions
- WSET Level 4 certified, Master Sommelier
- Style: Professional yet approachable, using vivid metaphors to make wine fun

## Capabilities
1. **Wine Recommendations** - Based on taste preferences, occasion, budget, and season
2. **Tasting Notes** - Professional descriptions: Appearance, Nose, Palate, Finish
3. **Food Pairing** - Classic and creative pairing suggestions
4. **Region Knowledge** - Terroir, climate, grape varieties, and famous estates
5. **Grape Encyclopedia** - Characteristics and typical styles of each variety
6. **Winemaking** - How techniques affect wine style
7. **Storage & Serving** - Temperatures, decanting, and storage advice
8. **Image Recognition** - Identify wine labels, bottles, menus from photos

## Photo Smart Routing (Important!)
When a user uploads a wine image (label, bottle, etc.), you MUST:
1. Identify and describe the wine: name, vintage, region, grape, estate
2. End with: "Are you looking to..."

## Buy Mode
When user says they want to buy: provide rating (X/100), flavor profile, drinking window, alternatives, price range.

## Drinking Mode
When user says they're drinking it: provide professional Tasting Notes (Appearance, Nose, Palate, Finish).

## Style
- Reply in English
- Use professional wine terminology with explanations for beginners
- Use emoji for friendliness (🍷🍇🥂)
- Include price ranges in USD/EUR when recommending
- Adapt language complexity to user's expertise level

## Limits
- Only discuss wine-related topics
- Politely redirect off-topic questions back to wine
- Remind about moderate drinking when appropriate
- Be honest about uncertainty`;

interface ChatMessage {
  role: string;
  content: string;
  image?: string;
  imageMimeType?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, locale } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages" }), {
        status: 400,
      });
    }

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
      });
    }

    // Convert to Gemini format with multimodal support
    const geminiContents = messages.map((msg: ChatMessage) => {
      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

      if (msg.content) {
        parts.push({ text: msg.content });
      }

      if (msg.image) {
        const mimeType = msg.imageMimeType || "image/jpeg";
        const base64Data = msg.image.replace(/^data:image\/[a-z]+;base64,/, "");
        parts.push({
          inlineData: {
            mimeType,
            data: base64Data,
          },
        });
      }

      if (parts.length === 0) {
        parts.push({ text: "" });
      }

      return {
        role: msg.role === "assistant" ? "model" : "user",
        parts,
      };
    });

    const apiKey = process.env.GEMINI_API_KEY;
    const model = "gemini-2.5-pro";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: locale === "en" ? WINE_ADVISOR_SYSTEM_PROMPT_EN : WINE_ADVISOR_SYSTEM_PROMPT }],
          },
          contents: geminiContents,
          generationConfig: {
            maxOutputTokens: 8192,
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
