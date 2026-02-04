
const apiKey = "019bfb84-c738-7064-bba6-a9082e8e6140";
const apiUrl = "https://remote.hackneuro.com/api/public/link/";

async function test() {
  console.log("Testing API connection...");
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: "teste_trae_debug@hackneuro.com",
        name: "Teste Trae Debug",
        phone: "5511999999999",
        channel: "linkedin"
      })
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body:", text);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
