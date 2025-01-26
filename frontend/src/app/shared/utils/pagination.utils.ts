import { Params } from '@angular/router';
import { Subject } from 'rxjs';

export class PaginationUtils {
    private static readonly ITEMS_PER_PAGE = 8;

    static getSelectedPage(queryParams: Params): number {
        const page = queryParams['page'];
        return page ? parseInt(page) : 1;
    }

    static emitPaginationConfig(page: number, totalCount: number, subject: Subject<{ maxPage: number, currentPage: number }>): void {
        const maxPage = Math.ceil(totalCount / this.ITEMS_PER_PAGE);
        subject.next({ maxPage, currentPage: page });
    }
}