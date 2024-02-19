import { LinkBlock, PlatformOption } from '../models/basics.model';

export const platformOptions: PlatformOption[] = [
  {
    bgColour: '#1A1A1A',
    label: 'GitHub',
    value: 'github',
    iconFileName: 'icon-github.svg',
    urlPattern: /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+$/,
    placeholder: 'https://github.com/username',
  },
  {
    bgColour: '#FFFFFF',
    label: 'Frontend Mentor',
    value: 'frontend_mentor',
    iconFileName: 'icon-frontend-mentor.svg',
    urlPattern:
      /^https?:\/\/(www\.)?frontendmentor\.io\/profile\/[a-zA-Z0-9_-]+$/,
    placeholder: 'https://www.frontendmentor.io/profile/username',
  },
  {
    bgColour: '#43B7E9',
    label: 'Twitter',
    value: 'twitter',
    iconFileName: 'icon-twitter.svg',
    urlPattern: /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+$/,
    placeholder: 'https://twitter.com/username',
  },
  {
    bgColour: '#2D68FF',
    label: 'LinkedIn',
    value: 'linkedin',
    iconFileName: 'icon-linkedin.svg',
    urlPattern: /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/,
    placeholder: 'https://www.linkedin.com/in/username',
  },
  {
    bgColour: '#EE3939',
    label: 'YouTube',
    value: 'youtube',
    iconFileName: 'icon-youtube.svg',
    urlPattern:
      /^https?:\/\/(www\.)?youtube\.com\/(channel\/[a-zA-Z0-9_-]+|c\/[a-zA-Z0-9_-]+|user\/[a-zA-Z0-9_-]+)(\/.*)?$/,
    placeholder: 'https://www.youtube.com/channel/CHANNEL_ID',
  },
  {
    bgColour: '#2442AC',
    label: 'Facebook',
    value: 'facebook',
    iconFileName: 'icon-facebook.svg',
    urlPattern:
      /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+[a-zA-Z0-9-]{5,}\/?$/,
    placeholder: 'https://www.facebook.com/username',
  },
  {
    bgColour: '#EE3FC8',
    label: 'Twitch',
    value: 'twitch',
    iconFileName: 'icon-twitch.svg',
    urlPattern: /^https?:\/\/(www\.)?twitch\.tv\/[a-zA-Z0-9_]+[a-zA-Z0-9_-]*$/,
    placeholder: 'https://www.twitch.tv/username',
  },
  {
    bgColour: '#333333',
    label: 'Dev.to',
    value: 'dev_to',
    iconFileName: 'icon-devto.svg',
    urlPattern: /^https?:\/\/dev\.to\/[a-zA-Z0-9_-]+$/,
    placeholder: 'https://dev.to/username',
  },
  {
    bgColour: '#8A1A50',
    label: 'Codewars',
    value: 'codewars',
    iconFileName: 'icon-codewars.svg',
    urlPattern: /^https?:\/\/(www\.)?codewars\.com\/users\/[a-zA-Z0-9_-]+$/,
    placeholder: 'https://www.codewars.com/users/username',
  },
  {
    bgColour: '#1E1F26',
    label: 'Codepen',
    value: 'codepen',
    iconFileName: 'icon-codepen.svg',
    urlPattern: /^https?:\/\/codepen\.io\/[a-zA-Z0-9_-]+$/,
    placeholder: 'https://codepen.io/username',
  },
  {
    bgColour: '#302267',
    label: 'freeCodeCamp',
    value: 'freecodecamp',
    iconFileName: 'icon-freecodecamp.svg',
    urlPattern: /^https?:\/\/(www\.)?freecodecamp\.org\/[a-zA-Z0-9_-]+$/,
    placeholder: 'https://www.freecodecamp.org/username',
  },
  {
    bgColour: '#EB4925',
    label: 'GitLab',
    value: 'gitlab',
    iconFileName: 'icon-gitlab.svg',
    urlPattern: /^https?:\/\/(www\.)?gitlab\.com\/[a-zA-Z0-9_-]+$/,
    placeholder: 'https://gitlab.com/username',
  },
  {
    bgColour: '#0330D1',
    label: 'Hashnode',
    value: 'hashnode',
    iconFileName: 'icon-hashnode.svg',
    urlPattern: /^https?:\/\/hashnode\.com\/@?[a-zA-Z0-9_-]+$/,
    placeholder: 'https://hashnode.com/@username',
  },
  {
    bgColour: '#EC7100',
    label: 'Stack Overflow',
    value: 'stack_overflow',
    iconFileName: 'icon-stack-overflow.svg',
    urlPattern: /^https?:\/\/stackoverflow\.com\/users\/\d+\/?[a-zA-Z0-9_-]*$/,
    placeholder: 'https://stackoverflow.com/users/USER_ID/username',
  },
];

type PlatformOptionsLookup = { [key: string]: LinkBlock };

export const platformOptionsLookup = platformOptions.reduce((acc, option) => {
  acc[option.value] = {
    bgColour: option.bgColour,
    iconFileName: option.iconFileName,
    platform: option.value,
    label: option.label,
    profileUrl: '',
  };
  return acc;
}, {} as PlatformOptionsLookup);
