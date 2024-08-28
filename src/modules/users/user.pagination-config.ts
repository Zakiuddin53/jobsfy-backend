import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { User } from './entites/user.entity';

export const USER_PAGINATION_CONFIG: PaginateConfig<User> = {
  defaultSortBy: [['id', 'ASC']],
  searchableColumns: ['email'],
  sortableColumns: ['email'],
  ignoreSearchByInQueryParam: true,
  filterableColumns: {
    name: [FilterOperator.EQ, FilterOperator.IN],
  },
};
