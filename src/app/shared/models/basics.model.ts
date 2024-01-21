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

export interface LinkBlock extends LinkData {
  bgColour: string;
  iconFileName: string;
  label: string;
}

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  picture: File | null;
}

export interface NotificationData {
  message: string;
  iconPath?: string;
}
