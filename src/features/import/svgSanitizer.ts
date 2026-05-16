export interface SanitizedSvgResult {
  svgString: string;
  regions: { id: string; name: string }[];
  safe: boolean;
  warnings: string[];
}

const DANGEROUS_TAGS = [
  'script', 'foreignObject', 'iframe', 'object', 'embed', 'link', 'style',
  'meta', 'title', 'base', 'head', 'body', 'html', 'use'
];

const DANGEROUS_ATTRS = [
  'onabort', 'onblur', 'oncancel', 'oncanplay', 'oncanplaythrough',
  'onchange', 'onclick', 'onclose', 'oncontextmenu', 'oncuechange',
  'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave',
  'ondragover', 'ondragstart', 'ondrop', 'ondurationchange',
  'onemptied', 'onended', 'onerror', 'onfocus', 'oninput',
  'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onload',
  'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onmousedown',
  'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout',
  'onmouseover', 'onmouseup', 'onpause', 'onplay', 'onplaying',
  'onprogress', 'onratechange', 'onreset', 'onresize', 'onscroll',
  'onseeked', 'onseeking', 'onselect', 'onshow', 'onstalled',
  'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'onvolumechange',
  'onwaiting', 'onwheel', 'onmousewheel',
  'xlink:href', 'href', 'src', 'data', 'action', 'formaction',
  'content', 'http-equiv', 'rel', 'media'
];

export function sanitizeSvg(rawSvg: string): SanitizedSvgResult {
  const warnings: string[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawSvg, 'image/svg+xml');

  // Check for parser errors
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    warnings.push('SVG parse error detected');
    return { svgString: '', regions: [], safe: false, warnings };
  }

  const svgEl = doc.querySelector('svg');
  if (!svgEl) {
    warnings.push('No SVG element found');
    return { svgString: '', regions: [], safe: false, warnings };
  }

  // Remove dangerous elements
  DANGEROUS_TAGS.forEach(tag => {
    const els = svgEl.querySelectorAll(tag);
    els.forEach(el => {
      warnings.push(`Removed dangerous tag: <${tag}>`);
      el.remove();
    });
  });

  // Remove external references in <image>
  const images = svgEl.querySelectorAll('image');
  images.forEach(img => {
    const href = img.getAttribute('href') || img.getAttribute('xlink:href');
    if (href && !href.startsWith('data:')) {
      warnings.push('Removed external image reference');
      img.remove();
    }
  });

  // Remove external CSS in <style>
  const styles = svgEl.querySelectorAll('style');
  styles.forEach(s => s.remove());

  // Strip dangerous attributes from ALL elements
  const allEls = svgEl.querySelectorAll('*');
  allEls.forEach(el => {
    const attrs = Array.from(el.attributes);
    attrs.forEach(attr => {
      const name = attr.name.toLowerCase();
      if (DANGEROUS_ATTRS.some(d => name === d || name.startsWith('on'))) {
        warnings.push(`Removed dangerous attribute: ${name}`);
        el.removeAttribute(attr.name);
      }
      // Remove javascript: URLs
      if (attr.value.toLowerCase().startsWith('javascript:')) {
        warnings.push('Removed javascript: URL');
        el.removeAttribute(attr.name);
      }
    });
  });

  // Remove any comment nodes
  const walker = document.createTreeWalker(svgEl, NodeFilter.SHOW_COMMENT);
  const comments: Comment[] = [];
  while (walker.nextNode()) comments.push(walker.currentNode as Comment);
  comments.forEach(c => c.remove());

  // Extract regions from paths and shapes
  const regions: { id: string; name: string }[] = [];
  const selectors = ['path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline'];
  let index = 0;

  selectors.forEach(sel => {
    const els = svgEl.querySelectorAll(sel);
    els.forEach((el, i) => {
      let id = el.getAttribute('id');
      if (!id) {
        id = `region-${sel}-${i}-${Date.now()}`;
        el.setAttribute('id', id);
      }
      // Ensure fill is set for tap-to-fill
      el.setAttribute('fill', '#ffffff');
      // Remove any stroke that would block clicking
      el.removeAttribute('stroke');
      regions.push({
        id,
        name: `Region ${index + 1}`,
      });
      index++;
    });
  });

  if (regions.length === 0) {
    warnings.push('No colourable regions found in SVG');
  }

  // Serialize back to string
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgEl);

  return {
    svgString,
    regions,
    safe: warnings.length === 0 || !warnings.some(w => w.includes('dangerous')),
    warnings,
  };
}