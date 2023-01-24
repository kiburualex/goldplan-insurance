import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import homeFill from '@iconify/icons-eva/home-fill';
// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
    {
        title: 'dashboard',
        path: '/dashboard/',
        icon: getIcon(pieChart2Fill)
    },
    {
        title: 'users',
        path: '/users/list',
        icon: getIcon(peopleFill)
    },
    {
        title: 'insurances',
        path: '/insurances',
        icon: getIcon(homeFill)
    }
];

export default sidebarConfig;
