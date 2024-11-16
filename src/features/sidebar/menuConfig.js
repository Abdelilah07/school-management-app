// Add your menu items here, they will be rendered in the sidebar, in the order you add them.
// Make sure to write the icon name correctly, you can find the icon names here: https://lucide.dev/icons.

export const menuItems = [
  {
    label: 'Home',
    icon: 'Home',
    href: '/home',
  },
  {
    label: 'Courses',
    icon: 'BookOpenText',
    href: '/courses',
    count: 24,
    badge: 'New',
  },
  {
    label: 'Quizzes',
    icon: 'MessageCircleQuestion',
    href: '/quizzes',
    count: 24,
    badge: 'New',
  },
  {
    label: 'Trainees',
    icon: 'Users',
    href: '/trainees',
    count: 892,
  },
  {
    label: 'Attendance',
    icon: 'ClipboardCheck',
    href: '/attendance',
    count: 12,
  },
  {
    label: 'Schedule',
    icon: 'Calendar',
    href: '/schedule',
    count: 12,
  },
  {
    label: 'Specializations',
    icon: 'BookMarked',
    href: '/specializations',
    count: 4,
  },
  {
    label: 'Competences',
    icon: 'BookMarked',
    href: '/competences',
    count: 4,
  },
  { type: 'divider' },
  {
    label: 'Documents',
    icon: 'FileText',
    href: '/documents',
  },
  {
    label: 'Settings',
    icon: 'Settings',
    href: '/settings',
  },
];
