import Anthropic from "@anthropic-ai/sdk";
import { Config } from "../Config";

const anthropic = new Anthropic({
    apiKey: Config.CLAUDE_API_KEY,
    dangerouslyAllowBrowser: true // Required for React Native/Expo usage without a backend proxy
});

export const identifySpecies = async (base64Image: string): Promise<string | null> => {
    try {
        // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

        const message = await anthropic.messages.create({
            model: "claude-sonnet-4-5-20250929",
            max_tokens: 1024,
            messages: [{
                role: "user",
                content: [
                    {
                        type: "image",
                        source: {
                            type: "base64",
                            media_type: "image/jpeg",
                            data: base64Data,
                        },
                    },
                    {
                        type: "text",
                        text: "Identify the wildlife species in this image. Return ONLY the common name. If you are not sure, or if it is not a wildlife species, return 'Unknown'."
                    }
                ],
            }],
        });

        const content = message.content[0];
        if (content.type === 'text') {
            return content.text.trim();
        }
        return null;
    } catch (error) {
        console.error("Error identifying species:", error);
        return null;
    }
};
