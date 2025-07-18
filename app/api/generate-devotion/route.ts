import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { verse = 'Psalms 67' } = await request.json();

    // Check if OpenAI is available
    if (process.env.OPENAI_API_KEY) {
      try {
        const prompt = `Generate a daily devotion based on ${verse}. 

Please provide:
1. A devotion title (inspiring and relevant)
2. A key verse or phrase from ${verse} (2-3 sentences max)
3. A devotion content (200-300 words) that explains the verse and applies it to daily life
4. A Tagalog translation of the key verse/phrase
5. A Tagalog translation of the devotion content

Format the response as JSON with these fields:
- devotion_title
- word_text (the key verse/phrase)
- devotion_content
- tagalog_word_text
- tagalog_devotion_content

Make it inspiring, practical, and relevant to modern life.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a Christian devotional writer who creates inspiring, practical daily devotions. Always respond with valid JSON format."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });

        const response = completion.choices[0]?.message?.content;
        
        if (!response) {
          throw new Error('No response from OpenAI');
        }

        // Try to parse the JSON response
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(response);
        } catch (parseError) {
          // If JSON parsing fails, try to extract JSON from the response
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedResponse = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('Invalid JSON response from OpenAI');
          }
        }

        // Add today's date
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const published_date = `${year}-${month}-${day}`;

        const devotionData = {
          ...parsedResponse,
          published_date,
          word_verse: verse,
          audio_url: null,
        };

        return NextResponse.json(devotionData);
      } catch (openaiError) {
        console.error('OpenAI error:', openaiError);
        // Fall through to mock response
      }
    }

    // Mock response when OpenAI is not available or fails
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const published_date = `${year}-${month}-${day}`;

    const mockDevotionData = {
      devotion_title: "God's Blessing and Grace",
      word_text: "May God be gracious to us and bless us and make his face shine on us— so that your ways may be known on earth, your salvation among all nations.",
      devotion_content: "Psalm 67 is a beautiful prayer for God's blessing and grace. The psalmist begins by asking for God's favor and blessing, not just for personal gain, but so that God's ways and salvation may be known throughout the earth. This reflects a heart that desires God's glory above all else. When we seek God's blessing, we should also pray that it would be used to bring others to know Him. The psalm reminds us that God's blessings are not meant to be hoarded but shared, so that all nations might praise Him. As we go through our day, let us remember that every blessing we receive is an opportunity to point others to God's love and grace.",
      tagalog_word_text: "Pagpalain nawa tayo ng Dios at pagpapalain niya tayo, at papangyarihin niya ang kaniyang mukha na lumiwanag sa atin; Upang ang iyong mga daan ay makilala sa lupa, ang iyong kaligtasan sa gitna ng lahat ng mga bansa.",
      tagalog_devotion_content: "Ang Awit 67 ay isang magandang panalangin para sa pagpapala at biyaya ng Dios. Nagsisimula ang salmista sa pamamagitan ng paghingi ng pabor at pagpapala ng Dios, hindi para sa personal na pakinabang, kundi upang ang mga daan ng Dios at ang kaligtasan ay makilala sa buong lupa. Ito ay nagpapakita ng puso na nagnanais ng kaluwalhatian ng Dios higit sa lahat. Kapag hinihingi natin ang pagpapala ng Dios, dapat din nating ipanalangin na ito ay magamit upang dalhin ang iba sa pagkakilala sa Kanya. Ang awit ay nagpapaalala sa atin na ang mga pagpapala ng Dios ay hindi dapat ipunin kundi ibahagi, upang ang lahat ng mga bansa ay makapagpuri sa Kanya.",
      published_date,
      word_verse: verse,
      audio_url: null,
    };

    return NextResponse.json(mockDevotionData);

  } catch (error) {
    console.error('Error generating devotion:', error);
    return NextResponse.json(
      { error: 'Failed to generate devotion' },
      { status: 500 }
    );
  }
} 