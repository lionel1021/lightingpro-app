import { redirect } from 'next/navigation';

export default async function RootPage() {
  // 面向北美市场，首次访问始终重定向到英文页面
  redirect('/en');
}