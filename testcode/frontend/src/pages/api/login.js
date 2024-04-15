// pages/api/login.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        // Flaskバックエンドへのリクエストを設定
        const flaskResponse = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body),
        });
  
        // Flaskバックエンドからのレスポンスを確認
        if (!flaskResponse.ok) {
          // レスポンスがOKでない場合はエラーレスポンスを返す
          const error = await flaskResponse.json();
          return res.status(flaskResponse.status).json(error);
        }
  
        // FlaskからのレスポンスがOKの場合は、その内容をクライアントに転送
        const user = await flaskResponse.json();
        return res.status(200).json(user);
  
      } catch (error) {
        // エラーハンドリング
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    } else {
      // POST以外のメソッドでリクエストが来た場合は405を返す
      res.setHeader('Allow', ['POST']);
      return res.status(405).end('Method Not Allowed');
    }
  }
  