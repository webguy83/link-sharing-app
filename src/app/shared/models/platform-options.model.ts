export interface PlatformOption {
  label: string;
  value: string;
  iconFileName: string;
  bgColour: string;
  urlPattern: RegExp;
  placeholder: string;
}

export interface LinkData {
  platform: string;
  link: string;
}

export interface LinkDataStyled extends LinkData {
  bgColour: string;
  iconFileName: string;
}
