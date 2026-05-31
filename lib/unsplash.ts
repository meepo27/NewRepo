const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export async function getDestinationImage(query: string): Promise<string> {
  if (!UNSPLASH_ACCESS_KEY) {
    return getFallbackGradient(query);
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' travel')}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
    );
    const data = await res.json();
    if (data.results?.[0]?.urls?.regular) {
      return data.results[0].urls.regular;
    }
  } catch {}

  return getFallbackGradient(query);
}

function getFallbackGradient(query: string): string {
  const gradients = [
    'linear-gradient(135deg, #0A0F1E 0%, #1a2040 50%, #F5A623 100%)',
    'linear-gradient(135deg, #0A0F1E 0%, #1f3a5f 50%, #8BAF8B 100%)',
    'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)',
    'linear-gradient(135deg, #0A0F1E 0%, #2d1b69 50%, #F5A623 100%)',
  ];
  const idx = query.charCodeAt(0) % gradients.length;
  return gradients[idx];
}
