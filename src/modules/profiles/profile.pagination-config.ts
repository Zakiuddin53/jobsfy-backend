import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Profile } from './entites/profile.entity';

export const PROFILE_PAGINATION_CONFIG: PaginateConfig<Profile> = {
  defaultSortBy: [['id', 'ASC']],
  searchableColumns: [
    'firstName',
    'lastName',
    'title',
    'city',
    'companyName',
    'country',
    'department',

    'gender',
    'industry',

    'state',
    'title',
  ],
  sortableColumns: [
    'firstName',
    'lastName',
    'title',
    'city',
    'companyName',
    'country',
    'department',

    'gender',
    'industry',

    'state',
    'title',
  ],
  ignoreSearchByInQueryParam: true,
  filterableColumns: {
    firstName: [FilterOperator.EQ, FilterOperator.IN, FilterOperator.ILIKE],
    lastName: [FilterOperator.EQ, FilterOperator.IN, FilterOperator.ILIKE],
    title: [FilterOperator.EQ, FilterOperator.IN, FilterOperator.ILIKE],
    address: [FilterOperator.EQ, FilterOperator.IN, FilterOperator.ILIKE],
    city: [FilterOperator.EQ, FilterOperator.IN, FilterOperator.ILIKE],
    companyName: [FilterOperator.EQ, FilterOperator.IN, FilterOperator.ILIKE],
    country: [FilterOperator.EQ, FilterOperator.IN, FilterOperator.ILIKE],
    department: [FilterOperator.EQ, FilterOperator.IN, FilterOperator.ILIKE],
    gender: [FilterOperator.EQ, FilterOperator.IN, FilterOperator.ILIKE],
    industry: [FilterOperator.EQ, FilterOperator.IN, FilterOperator.ILIKE],
    job: [FilterOperator.EQ, FilterOperator.IN, FilterOperator.ILIKE],
    state: [FilterOperator.EQ, FilterOperator.IN, FilterOperator.ILIKE],
  },
  relations: {
    user: true,
  },
};
