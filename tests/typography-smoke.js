module.exports = async function smoke(page, baseUrl) {
  await page.goto(baseUrl);
  await page.waitForTimeout(500);
  const text = await page.textContent('body');
  if (!text || text.trim().length === 0) {
    throw new Error('Page contains no visible text');
  }
  const heading = await page.locator('h1, h2, .title, .header').first();
  if (!(await heading.isVisible())) {
    throw new Error('No visible heading found');
  }
  const fontSize = await heading.evaluate(el => {
    const style = window.getComputedStyle(el);
    return parseFloat(style.fontSize);
  });
  if (fontSize < 12) {
    throw new Error(`Heading font size too small: ${fontSize}px`);
  }
  const fontFamily = await heading.evaluate(el => {
    const style = window.getComputedStyle(el);
    return style.fontFamily;
  });
  const generics = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy'];
  const trimmed = fontFamily.split(',')[0].trim().toLowerCase();
  if (generics.includes(trimmed) && !fontFamily.includes(',')) {
    console.warn('Typography may be using generic fallback font');
  }
}