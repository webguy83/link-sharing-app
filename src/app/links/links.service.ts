import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { platformOptions } from '../shared/constants/platform-options';
import { PlatformLink } from '../shared/models/platform-options.model';
import { linkPlatformValidator } from '../validators/validators';

interface DropdownInfo {
  isOpen: boolean;
  placeholder: string;
  iconFileName: string;
}

interface FormControlValue {
  platform: string;
  link: string;
}

type PlatformOptionsLookup = { [key: string]: PlatformLink };

@Injectable()
export class LinksService {
  constructor(private fb: FormBuilder) {}

  createLinkFormGroup(): FormGroup {
    const firstPlatformOption = platformOptions[0];
    return this.fb.group(
      {
        platform: [firstPlatformOption.value, Validators.required],
        link: [null, Validators.required],
      },
      { validators: linkPlatformValidator }
    );
  }

  createInitialDropdownInfo(): DropdownInfo {
    const firstPlatformOption = platformOptions[0];
    return {
      isOpen: false,
      placeholder: firstPlatformOption.placeholder,
      iconFileName: firstPlatformOption.iconFileName,
    };
  }

  get platformOptionsLookup() {
    return platformOptions.reduce((acc, option) => {
      acc[option.value] = {
        bgColour: option.bgColour,
        iconFileName: option.iconFileName,
        platform: option.label,
      };
      return acc;
    }, {} as PlatformOptionsLookup);
  }

  mapToPlatformLinks(linkItems: FormArray): PlatformLink[] {
    const formControlsValues: FormControlValue[] = linkItems.getRawValue();

    return formControlsValues.map((control: FormControlValue) => {
      const platformLink = this.platformOptionsLookup[control.platform];

      // Construct the new PlatformLink object
      return {
        platform: platformLink.platform,
        link: control.link,
        bgColour: platformLink.bgColour,
        iconFileName: platformLink.iconFileName,
      };
    });
  }
}
