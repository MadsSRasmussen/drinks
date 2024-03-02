import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import { Users } from '../firebase.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/dev',
      name: 'dev',
      component: () => import('../views/DevLogin.vue')
    },
    {
      path: '/dev/dashboard',
      name: 'dashboard',
      component: () => import('../views/DevDashboard.vue'),
      meta: {
        requiresAuth: true,
        allowedAuthStates: ["admin", "super"]
      }
    },
    {
      path: '/dev/users',
      name: 'users',
      component: () => import('../views/UsersOverview.vue'),
      meta: {
        requiresAuth: true,
        allowedAuthStates: ["super"]
      }
    },
    {
      path: '/dev/games',
      name: 'games',
      component: () => import('../views/GamesOverview.vue'),
      meta: {
        requiresAuth: true,
        allowedAuthStates: ["admin", "super"]
      }
    },
    {
      path: '/dev/games/:id',
      name: 'edit game',
      component: () => import('../views/EditGame.vue'),
      meta: {
        requiresAuth: true,
        allowedAuthStates: ["admin", "super"]
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  
  try {
    // Checks if af route that needs authentication exists
    if(to.matched.some((record) => record.meta.requiresAuth)){
      
      // If authenticated route exists, hen get the auth-status
      Users.getAuthStatus()
        .then((status) => {
          
          let isAutherized = true;

          // Chechk if route is allowed by making sure, that all routes are allowed by status
          to.matched.forEach((record) => {
            if (!record.meta.allowedAuthStates.includes(status)) {
              isAutherized = false;
            }
          });
          
          // If a route exists, that does not allow the status, deny acces:
          if (isAutherized) {
            next();
          } else {
            alert("You do not have acces!");
            next(from);
          }
        }).catch((error) => {
          console.error(error);
          next("/dev");
        });

    } else {
      
      next();
    
    }
  } catch (error) {
    console.error(error);
    next("/");
  }
  
});

export default router
