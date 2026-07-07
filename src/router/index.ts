import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import DashboardView from '../views/dashboard/DashboardView.vue'
import PacksView from '../views/packs/PacksView.vue'
import NewPackView from '../views/packs/NewPackView.vue'
import PackDetailView from '../views/packs/PackDetailView.vue'
import AiQaView from '../views/packs/AiQaView.vue'
import PracticeView from '../views/practice/PracticeView.vue'
import WrongBookView from '../views/practice/WrongBookView.vue'
import WrongDetailView from '../views/practice/WrongDetailView.vue'
import FlashcardsView from '../views/practice/FlashcardsView.vue'
import TasksView from '../views/practice/TasksView.vue'
import FocusView from '../views/practice/FocusView.vue'
import CommunityView from '../views/community/CommunityView.vue'
import CommunityNewView from '../views/community/CommunityNewView.vue'
import CommunityDetailView from '../views/community/CommunityDetailView.vue'
import TargetView from '../views/target/TargetView.vue'
import ProfileView from '../views/profile/ProfileView.vue'
import ReportsView from '../views/profile/ReportsView.vue'
import SettingsView from '../views/profile/SettingsView.vue'
import AiProviderSettingsView from '../views/profile/AiProviderSettingsView.vue'
import WorkspaceFeatureView from '../views/shared/WorkspaceFeatureView.vue'
import { isAuthenticated } from '../api/client'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/auth/login', component: LoginView, meta: { layout: 'auth' } },
    { path: '/auth/register', component: RegisterView, meta: { layout: 'auth' } },
    { path: '/dashboard', component: DashboardView, meta: { title: '学习首页' } },
    { path: '/packs', component: PacksView, meta: { title: '学习包' } },
    { path: '/packs/new', component: NewPackView, meta: { title: '新建学习包' } },
    { path: '/packs/:id', component: PackDetailView, meta: { title: '学习包详情' } },
    { path: '/packs/:id/chapters', component: WorkspaceFeatureView, meta: { title: '章节结构', mode: 'chapters' } },
    { path: '/packs/:id/qa', component: AiQaView, meta: { title: 'AI 问答' } },
    { path: '/packs/:id/question-bank', component: WorkspaceFeatureView, meta: { title: '智能题库', mode: 'question-bank' } },
    { path: '/packs/:id/practice', component: PracticeView, meta: { title: '章节练习' } },
    { path: '/packs/:id/practice/result', component: WorkspaceFeatureView, meta: { title: '练习结果', mode: 'practice-result' } },
    { path: '/packs/:id/flashcards', component: FlashcardsView, meta: { title: '记忆卡片' } },
    { path: '/wrong-book', component: WrongBookView, meta: { title: '错题本' } },
    { path: '/wrong-book/:id', component: WrongDetailView, meta: { title: '错题详情' } },
    { path: '/tasks', component: TasksView, meta: { title: '学习任务' } },
    { path: '/focus', component: FocusView, meta: { title: '专注打卡' } },
    { path: '/ranking', component: WorkspaceFeatureView, meta: { title: '学习排行榜', mode: 'ranking' } },
    { path: '/community', component: CommunityView, meta: { title: '社区互助圈子' } },
    { path: '/community/new', component: CommunityNewView, meta: { title: '发布帖子' } },
    { path: '/community/:id', component: CommunityDetailView, meta: { title: '帖子详情' } },
    { path: '/target', component: TargetView, meta: { title: '院校与目标规划' } },
    { path: '/profile', component: ProfileView, meta: { title: '个人中心' } },
    { path: '/profile/reports', component: ReportsView, meta: { title: '学习报告' } },
    { path: '/settings', component: SettingsView, meta: { title: '学习偏好设置' } },
    { path: '/settings/ai-provider', component: AiProviderSettingsView, meta: { title: 'AI 接入与密钥设置' } },
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
  ],
})

router.beforeEach((to) => {
  const isAuthRoute = to.meta.layout === 'auth'

  if (!isAuthRoute && !isAuthenticated()) {
    return { path: '/auth/login', query: { redirect: to.fullPath } }
  }

  if (isAuthRoute && isAuthenticated()) {
    return '/dashboard'
  }

  return true
})

export default router
