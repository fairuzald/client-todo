export const isValidColorInput = (color: string): boolean => {
  return color === "" || color === "#" || /^#?([0-9A-Fa-f]{0,6})$/i.test(color);
};

export const normalizeColor = (color: string): string => {
  if (color === "") return "";
  if (color === "#") return "#";

  if (/^#([0-9A-Fa-f]{6})$/i.test(color)) return color.toUpperCase();

  if (/^#([0-9A-Fa-f]{3})$/i.test(color)) {
    const hex = color.slice(1);
    return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`.toUpperCase();
  }

  if (/^([0-9A-Fa-f]{1,6})$/i.test(color)) {
    if (color.length === 3) {
      return `#${color[0]}${color[0]}${color[1]}${color[1]}${color[2]}${color[2]}`.toUpperCase();
    }
    return `#${color.padEnd(6, "0")}`.toUpperCase();
  }

  if (/^#([0-9A-Fa-f]{1,5})$/i.test(color)) {
    const hex = color.slice(1);
    return `#${hex.padEnd(6, "0")}`.toUpperCase();
  }

  return color;
};

export const getSafeColor = (color: string): string => {
  if (/^#([0-9A-Fa-f]{6})$/i.test(color)) return color.toUpperCase();

  if (/^#([0-9A-Fa-f]{3})$/i.test(color)) {
    const hex = color.slice(1);
    return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`.toUpperCase();
  }

  if (/^#([0-9A-Fa-f]{1,5})$/i.test(color)) {
    const hex = color.slice(1);
    return `#${hex.padEnd(6, "0")}`.toUpperCase();
  }

  if (/^([0-9A-Fa-f]{3,6})$/i.test(color)) {
    if (color.length === 3) {
      return `#${color[0]}${color[0]}${color[1]}${color[1]}${color[2]}${color[2]}`.toUpperCase();
    }
    return `#${color.padEnd(6, "0")}`.toUpperCase();
  }

  return "#0EA5E9";
};

export const getSubmissionColor = (color: string): string => {
  if (/^#([0-9A-Fa-f]{6})$/i.test(color)) return color.toUpperCase();

  const normalized = normalizeColor(color);

  if (/^#([0-9A-Fa-f]{6})$/i.test(normalized)) return normalized;

  return "#0EA5E9";
};
