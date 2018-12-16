import {trigger, animate, style, query, transition} from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({ 
          opacity: '0'
        }),
        animate('0.5s ease-in-out', style({ opacity: '1' }))
      ], 
      { optional: true }
    ),
  ])
])