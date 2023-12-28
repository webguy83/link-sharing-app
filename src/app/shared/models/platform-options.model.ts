export interface PlatformOption {
  label: string;
  value: string;
  iconFileName: string;
  bgColour: string;
  urlPattern: RegExp;
  placeholder: string;
}

export interface PlatformLink {
  platform: string;
  link?: string;
  bgColour: string;
  iconFileName: string;
}
