// pages/api/get_action_data.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
      let flaskResponse;
      try {
        flaskResponse = await fetch('http://localhost:5000/get_action_data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body),
        });
  
        if (!flaskResponse.ok) {
          throw new Error(`HTTP error! status: ${flaskResponse.status}`);
        }
  
        const data = await flaskResponse.json();
        res.status(200).json(data);
      } catch (error) {
        // flaskResponseが定義されている場合はそのステータスを使用し、そうでない場合は500を使用
        res.status(flaskResponse?.status || 500).json({ error: error.message });
      }
    } else {
      // GETリクエストに対する405 Method Not Allowedを返す
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  