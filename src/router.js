import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
function importComponent(path){
    return()=> import(`./components/${path}.vue`);
}

const router = new VueRouter({
    mode: 'history',
    routes:[
        {
            path: '/',
            component: importComponent("DashboardLayout"),
            children: [
                //Dashboard
                {
                    path:'/home',
                    name: 'Home',
                    meta:{title: 'Home'},
                    component: importComponent('Home'),
                },
                {
                    path:'/marketplace',
                    name: 'Marketplace',
                    meta:{title: 'Marketplace'},
                    component: importComponent('Marketplace'),
                },
                {
                    path: '/course',
                    name: 'Course',
                    meta: { title: 'Course' },
                    component: importComponent('DataMaster/Course'),
                },
                {
                    path:'/komen',
                    name: 'Komen',
                    meta:{title: 'Komen'},
                    component: importComponent('Komen'),
                },
                {
                    path:'/profil',
                    name: 'Profil',
                    meta:{title: 'Profil'},
                    component: importComponent('Profil'),
                },
            ],
        },
        //LOgin
        {
            path: '/login',
            name: 'Login',
            meta: { title: 'Login' },
            component: importComponent ('Login'),
        },
        //regis
        {
            path: '/register',
            name: 'Register',
            meta: { title: 'Register' },
            component: importComponent ('Register'),
        },
        {
            path:'*',
            redirect: '/'
        },
    ],
});

//set Judul
router.beforeEach( (to, from, next) => {
    document.title = to.meta.title;
    next();
});
export default router;