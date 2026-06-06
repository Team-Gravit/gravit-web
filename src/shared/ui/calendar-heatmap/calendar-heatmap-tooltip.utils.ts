type TooltipData = {
  date: string;
  label: string;
};

export function getTooltipPos(cellRect: DOMRect, tooltipEl: HTMLElement) {
  const OFFSET = 8;
  const MARGIN = 8;

  const { width: tw, height: th } = tooltipEl.getBoundingClientRect();

  let x = cellRect.left + cellRect.width / 2 - tw / 2;
  let y = cellRect.top - th - OFFSET;

  if (x + tw > window.innerWidth - MARGIN) {
    x = window.innerWidth - tw - MARGIN;
  }
  if (x < MARGIN) x = MARGIN;

  if (y < MARGIN) {
    y = cellRect.bottom + OFFSET;
  }

  return { x, y };
}

export function showTooltip(tooltip: HTMLElement, cell: HTMLElement, data: TooltipData) {
  tooltip.innerHTML = `
    <div class="tooltip-date">${data.date}</div>
    <div class="tooltip-count">${data.label}</div>
  	`;
  tooltip.classList.remove('hidden');
  tooltip.classList.add('visible');

  // 콘텐츠 렌더 후 위치 계산 (getBoundingClientRect 정확도)
  requestAnimationFrame(() => {
    const { x, y } = getTooltipPos(cell.getBoundingClientRect(), tooltip);
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  });
}

export function hideTooltip(tooltip: HTMLElement) {
  tooltip.classList.remove('visible');
  tooltip.classList.add('hidden');
}
