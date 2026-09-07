import { mediaUrl } from './api';
import type { Media } from './types';

// These exact demo references correspond to supplied local illustration assets.
// Unknown or missing images must never silently show a different food.
const demoImages: Record<string, string> = {
  '/demo/foods/classic-chicken-burger.jpg': '/images/chicken-burger.webp',
  '/demo/foods/shan-noodle-cup.jpg': '/images/shan-noodles.webp',
  '/demo/foods/chocolate-brownie.jpg': '/images/brownie-tea.webp',
  '/demo/foods/myanmar-milk-tea.jpg': '/images/brownie-tea.webp',
};

export function orderImage(image?: Media | null) {
  if (!image?.url) return { src: '', illustrative: false };
  if (image.provider === 'demo-local') return { src: demoImages[image.url] || '', illustrative: true };
  return { src: mediaUrl(image.url), illustrative: false };
}
