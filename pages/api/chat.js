// pages/api/chat.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { prompt } = req.body;

      const openaiResponse = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_SECRET_KEY}`, // Access the API key from your .env.local file
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 150,
        }),
      });

      if (!openaiResponse.ok) {
        throw new Error(`Error from OpenAI: ${openaiResponse.statusText}`);
      }

      const responseData = await openaiResponse.json();
      res.status(200).json({ botMessage: responseData.choices[0].text.trim() });
    } catch (error) {
      console.error('Error handling /api/chat POST request:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
  }
}
