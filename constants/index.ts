import {
  HomeIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  PlusIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export const sidebarLinks = [
  {
    icon: HomeIcon,
    route: '/',
    label: 'Home',
  },
  {
    icon: MagnifyingGlassIcon,
    route: '/search',
    label: 'Search',
  },
  {
    icon: HeartIcon,
    route: '/activity',
    label: 'Activity',
  },
  {
    icon: PlusIcon,
    route: '/create-feeling',
    label: 'Create Feeling',
  },
  {
    icon: UserGroupIcon,
    route: '/communities',
    label: 'Communities',
  },
  {
    icon: UserIcon,
    route: '/profile',
    label: 'Profile',
  },
];

export const profileTabs = [
  { value: 'feelings', label: 'Feelings', icon: '/assets/reply.svg' },
  { value: 'replies', label: 'Replies', icon: '/assets/members.svg' },
  { value: 'tagged', label: 'Tagged', icon: '/assets/tag.svg' },
];

export const communityTabs = [
  { value: 'feelings', label: 'Feelings', icon: '/assets/reply.svg' },
  { value: 'members', label: 'Members', icon: '/assets/members.svg' },
  { value: 'requests', label: 'Requests', icon: '/assets/request.svg' },
];
