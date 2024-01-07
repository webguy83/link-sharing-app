import { LinkDataStyled } from './../shared/models/platform-options.model';
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  platformOptions,
  platformOptionsLookup,
} from '../shared/constants/platform-options';
import { LinkData } from '../shared/models/platform-options.model';
import { linkPlatformValidator } from '../validators/validators';

interface AdditionalLinkState {
  isOpen: boolean;
  placeholder: string;
  iconFileName: string;
}

@Injectable()
export class LinksService {
  constructor(private fb: FormBuilder) {}

  createLinkFormGroup(link?: LinkData): FormGroup {
    const platform = link?.platform || platformOptions[0].value;
    const profileUrl = link?.profileUrl || null;

    return this.fb.group(
      {
        platform: [platform, Validators.required],
        profileUrl: [profileUrl, Validators.required],
      },
      { validators: linkPlatformValidator }
    );
  }

  mapToPlatformLinks(linkItems: FormArray): LinkDataStyled[] {
    const formControlsValues: LinkData[] = linkItems.getRawValue();

    return formControlsValues.map((control: LinkData) => {
      const platformLink = platformOptionsLookup[control.platform];

      // Construct the new LinkData object
      return {
        platform: platformLink.platform,
        profileUrl: control.profileUrl,
        bgColour: platformLink.bgColour,
        iconFileName: platformLink.iconFileName,
        label: platformLink.label,
      };
    });
  }

  updateLinkPlatform(
    platformControl: AbstractControl,
    profileUrlControl: AbstractControl,
    platform: string
  ): void {
    platformControl.setValue(platform); // Safely set the value of the control
    profileUrlControl.reset(); // Reset the link control
  }

  getAdditionalLinkState(platform?: string): AdditionalLinkState {
    const platformOption = platformOptions.find(
      (option) => option.value === platform
    );
    return {
      isOpen: false,
      placeholder:
        platformOption?.placeholder || platformOptions[0].placeholder,
      iconFileName:
        platformOption?.iconFileName || platformOptions[0].iconFileName,
    };
  }
}
