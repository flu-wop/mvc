// Cormorant Garamond for generated images. Fetched from Google Fonts at request
// time; if that fails the image falls back to the default sans, never errors.
let cache: ArrayBuffer | null | undefined;

export async function displayFont(): Promise<ArrayBuffer | null> {
  if (cache !== undefined) return cache;
  try {
    const css = await (
      await fetch("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400", {
        headers: { "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1" },
      })
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    cache = url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    cache = null;
  }
  return cache;
}
