import {
  HomeIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  PlusIcon,
  UserGroupIcon,
  UserIcon,
  ChatBubbleBottomCenterIcon,
  TagIcon,
  ArrowPathRoundedSquareIcon,
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
  { value: 'feelings', label: 'Feelings', icon: ChatBubbleBottomCenterIcon },
  { value: 'replies', label: 'Replies', icon: UserGroupIcon },
  { value: 'tagged', label: 'Tagged', icon: TagIcon },
];

export const communityTabs = [
  { value: 'feelings', label: 'Feelings', icon: ChatBubbleBottomCenterIcon },
  { value: 'members', label: 'Members', icon: UserGroupIcon },
  { value: 'requests', label: 'Requests', icon: ArrowPathRoundedSquareIcon },
];
