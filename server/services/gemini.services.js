const gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";


export const gernrateGeminiResponse = async (prompt) => {
    try {
        const response = await fetch(gemini_url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": process.env.GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: prompt }
                            ]
                        }
                    ]
                })

            })
        if (!response.ok) {
            const err = await response.text();
            throw new Error(err)
        }

        const data = await response.json();

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error("No text returend from Gemini")
        }

        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(cleanText);
    } catch (error) {
      console.error("Gemini Fetch Error:", error.message);
      throw new Error("Gemini API fetch failed")
    }
}