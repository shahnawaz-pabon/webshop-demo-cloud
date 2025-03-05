import { Component } from '@angular/core';

@Component({
    selector: 'app-back-arrow-icon',
    standalone: true,
    template: `
        <span class="arrow">↩</span>
    `,
    styles: [`
        .arrow {
            font-size: 24px;
            color: var(--color-primary-100);
            line-height: 1;
            display: flex;
            align-items: center;
            transform: scaleY(-1);
        }
    `]
})
export class BackArrowIconComponent { } 