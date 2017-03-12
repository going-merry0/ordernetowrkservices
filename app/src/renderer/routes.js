import List from './components/List'

export default [
  {
    path: '/',
    name: 'list',
    component: List
  },
  {
    path: '*',
    redirect: '/'
  }
]
