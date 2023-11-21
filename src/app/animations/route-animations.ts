import {
  trigger,
  transition,
  style,
  query,
  animate,
} from '@angular/animations';

export const fadeInOutAnimation = trigger('fadeInOutAnimation', [
  transition('* <=> *', [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          left: 0,
          width: '100%',
          opacity: 0,
        }),
      ],
      { optional: true }
    ),
    query(':enter', [animate('0.3s ease', style({ opacity: 1 }))], {
      optional: true,
    }),
    query(':leave', [animate('0.3s ease', style({ opacity: 0 }))], {
      optional: true,
    }),
  ]),
]);
