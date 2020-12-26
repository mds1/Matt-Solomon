import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/BaseLayout.vue'),
    children: [
      { name: 'home', path: '', component: () => import('pages/Home.vue') },
      { name: 'contact', path: '/contact', component: () => import('pages/Contact.vue') },
      { name: 'projects', path: '/projects', component: () => import('pages/Projects.vue') },
      { name: 'compound', path: '/compound-rates', component: () => import('pages/CompoundRates.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
