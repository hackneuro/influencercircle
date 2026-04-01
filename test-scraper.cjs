const cheerio = require('cheerio');
async function search(q) {
  const res = await fetch(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  const $ = cheerio.load(html);
  const images = [];
  $('img').each((i, el) => {
    const src = $(el).attr('src');
    if (src && src.startsWith('http')) images.push(src);
  });
  console.log(images.slice(0, 5));
}
search('cats');
