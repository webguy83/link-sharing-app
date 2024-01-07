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
  profileUrl: string;
}

export interface LinkDataStyled extends LinkData {
  bgColour: string;
  iconFileName: string;
}
