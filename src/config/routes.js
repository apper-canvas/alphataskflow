import Dashboard from '@/components/pages/Dashboard';
import Today from '@/components/pages/Today';
import Upcoming from '@/components/pages/Upcoming';
import Completed from '@/components/pages/Completed';
import Categories from '@/components/pages/Categories';
import Archive from '@/components/pages/Archive';
export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  today: {
    id: 'today',
    label: 'Today',
    path: '/today',
    icon: 'Calendar',
    component: Today
  },
  upcoming: {
    id: 'upcoming',
    label: 'Upcoming',
    path: '/upcoming',
    icon: 'Clock',
    component: Upcoming
  },
  completed: {
    id: 'completed',
    label: 'Completed',
    path: '/completed',
    icon: 'CheckCircle',
    component: Completed
  },
categories: {
    id: 'categories',
    label: 'Categories',
    path: '/categories',
    icon: 'Folder',
    component: Categories
  },
  archive: {
    id: 'archive',
    label: 'Archive',
    path: '/archive',
    icon: 'Archive',
    component: Archive
  }
};

export const routeArray = Object.values(routes);
export default routes;