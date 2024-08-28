import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Profile } from './entites/profile.entity';

export const PROFILE_PAGINATION_CONFIG: PaginateConfig<Profile> = {
  defaultSortBy: [['id', 'ASC']],
  searchableColumns: ['title'],
  sortableColumns: ['title'],
  ignoreSearchByInQueryParam: true,
  filterableColumns: {
    name: [FilterOperator.EQ, FilterOperator.IN],
  },
};
