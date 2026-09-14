import { useLayoutEffect } from 'react';
import HomePage from './components/HomePage';
import { initializeSite } from './lib/siteController';
import './styles/site.css';

export default function App() {
  // layout effect：在浏览器首帧绘制前就切到正确 tab，避免冷刷新时闪现首页 OS 桌面
  useLayoutEffect(() => initializeSite(), []);

  return <HomePage />;
}
