import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { User } from './entites/user.entity';
import { Not } from 'typeorm';

export const USER_PAGINATION_CONFIG: PaginateConfig<User> = {
  defaultSortBy: [['id', 'ASC']],
  searchableColumns: ['email'],
  sortableColumns: ['email', 'userType'],
  ignoreSearchByInQueryParam: true,
  filterableColumns: {
    userType: [FilterOperator.EQ, FilterOperator.IN],
    role: [FilterOperator.EQ, FilterOperator.IN],
  },
  relations: {
    profile: true,
  },
  where: {
    role: Not('admin'),
  },
};
