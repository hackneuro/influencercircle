const cheerio = require('cheerio');
async function search(q) {
  const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}&iax=images&ia=images`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  const $ = cheerio.load(html);
  const images = [];
  $('.zcm-wrap img').each((i, el) => {
    const src = $(el).attr('src');
    if (src) images.push(src);
  });
  console.log(images);
}
search('cats');
