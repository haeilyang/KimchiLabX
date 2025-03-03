const fetch = require("node-fetch");

exports.handler = async function(event) {
  const API_KEY = process.env.VUE_APP_OPENAI_API_KEY;
  const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API 키가 없습니다." }),
    };
  }

  try {
    const body = JSON.parse(event.body);

    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "OpenAI API 요청 실패", details: error.message }),
    };
  }
};
