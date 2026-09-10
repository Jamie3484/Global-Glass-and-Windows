/**
 * Smooth scrolling utility that accounts for sticky header offset
 */
export function scrollToSection(targetId: string, customOffset: number = 85): void {
  const id = targetId.startsWith('#') ? targetId.substring(1) : targetId;
  const element = document.getElementById(id);

  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - customOffset;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: 'smooth'
    });
  } else {
    // Fallback query selector
    const fallback = document.querySelector(targetId.startsWith('#') ? targetId : `#${targetId}`);
    if (fallback) {
      fallback.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

export function scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

export function scrollToBottom(): void {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  });
}
