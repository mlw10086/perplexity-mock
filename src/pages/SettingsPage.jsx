import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Avatar } from '@/components/ui/Avatar';
import { RadioGroup, RadioItem } from '@/components/ui/Radio';
import { User, Lock, Bell, Globe, Sun, Moon, Monitor, PanelLeftOpen } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSettings } from '@/contexts/SettingsContext';
import { cn } from '@/lib/utils';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { settings, updateSetting } = useSettings();
  
  // 通知设置状态
  const [notifications, setNotifications] = React.useState({
    email: true,
    push: false,
    marketing: false,
  });

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
       <h1 className="text-3xl font-display font-bold mb-8">设置</h1>

       <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
             <TabsTrigger value="profile" className="flex gap-2"><User size={16}/> 个人资料</TabsTrigger>
             <TabsTrigger value="account" className="flex gap-2"><Lock size={16}/> 账户</TabsTrigger>
             <TabsTrigger value="notifications" className="flex gap-2"><Bell size={16}/> 通知</TabsTrigger>
             <TabsTrigger value="appearance" className="flex gap-2"><Globe size={16}/> 外观</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
             <Card>
                <CardHeader>
                   <CardTitle>个人资料信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="flex items-center gap-6">
                      <Avatar className="w-24 h-24 text-2xl" fallback="张" />
                      <div className="space-y-2">
                         <Button variant="outline">更换头像</Button>
                         <p className="text-xs text-text-muted">JPG、GIF 或 PNG，最大 800K</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-sm font-medium">姓</label>
                         <Input defaultValue="张" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium">名</label>
                         <Input defaultValue="三" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium">个人简介</label>
                      <Input defaultValue="北京的产品设计师" />
                   </div>
                   <div className="flex justify-end">
                      <Button>保存更改</Button>
                   </div>
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="notifications">
             <Card>
                <CardHeader>
                   <CardTitle>通知偏好设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="flex items-center justify-between pb-4 border-b border-border">
                      <div className="space-y-0.5">
                         <h4 className="font-medium text-text-main">邮件通知</h4>
                         <p className="text-sm text-text-muted">接收有关您账户活动的邮件。</p>
                      </div>
                      <Switch 
                         checked={notifications.email}
                         onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                      />
                   </div>

                   <div className="flex items-center justify-between pb-4 border-b border-border">
                      <div className="space-y-0.5">
                         <h4 className="font-medium text-text-main">推送通知</h4>
                         <p className="text-sm text-text-muted">在您的设备上接收推送通知。</p>
                      </div>
                      <Switch 
                         checked={notifications.push}
                         onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                      />
                   </div>

                   <div className="flex items-center justify-between pb-4 border-b border-border last:border-0">
                      <div className="space-y-0.5">
                         <h4 className="font-medium text-text-main">营销邮件</h4>
                         <p className="text-sm text-text-muted">接收有关新产品和功能的邮件。</p>
                      </div>
                      <Switch 
                         checked={notifications.marketing}
                         onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                      />
                   </div>

                   <div className="pt-4 border-t border-border">
                      <p className="text-sm text-text-muted">
                         💡 已启用: {Object.entries(notifications).filter(([_, v]) => v).map(([k]) => 
                            ({ email: '邮件通知', push: '推送通知', marketing: '营销邮件' }[k])
                         ).join('、') || '无'}
                      </p>
                   </div>
                </CardContent>
             </Card>
          </TabsContent>
          
          <TabsContent value="account">
              <Card>
                <CardHeader>
                   <CardTitle>账户设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   {/* 邮箱地址 */}
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-text-main">邮箱地址</label>
                      <div className="flex gap-3">
                         <Input 
                            type="email" 
                            defaultValue="zhangsan@example.com" 
                            className="flex-1"
                         />
                         <Button variant="outline">更改</Button>
                      </div>
                      <p className="text-xs text-text-muted">这是您用于登录和接收通知的邮箱地址。</p>
                   </div>

                   {/* 密码 */}
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-text-main">密码</label>
                      <div className="flex gap-3">
                         <Input 
                            type="password" 
                            defaultValue="••••••••" 
                            disabled
                            className="flex-1"
                         />
                         <Button variant="outline">更改密码</Button>
                      </div>
                      <p className="text-xs text-text-muted">设置一个强密码以保护您的账户安全。</p>
                   </div>

                   {/* 两步验证 */}
                   <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-surface-hover transition-colors">
                      <div className="space-y-0.5">
                         <h4 className="font-medium text-text-main">两步验证</h4>
                         <p className="text-sm text-text-muted">为您的账户添加额外的安全保护层。</p>
                      </div>
                      <Switch 
                         checked={false}
                         onCheckedChange={(checked) => console.log('Two-factor:', checked)}
                      />
                   </div>

                   {/* 登录设备 */}
                   <div className="space-y-3">
                      <div className="flex items-center justify-between">
                         <h4 className="font-medium text-text-main">登录设备</h4>
                         <Button variant="ghost" size="sm">查看全部</Button>
                      </div>
                      <div className="space-y-2">
                         {[
                            { device: 'Windows PC', location: '北京, 中国', time: '当前设备', active: true },
                            { device: 'iPhone 14 Pro', location: '上海, 中国', time: '2 天前', active: false },
                         ].map((session, idx) => (
                            <div key={idx} className={cn(
                               "flex items-center justify-between p-3 rounded-lg border border-border",
                               session.active && "bg-primary/5 border-primary/20"
                            )}>
                               <div className="flex items-center gap-3">
                                  <div className={cn(
                                     "w-2 h-2 rounded-full",
                                     session.active ? "bg-green-500" : "bg-text-muted"
                                  )} />
                                  <div>
                                     <p className="text-sm font-medium text-text-main">{session.device}</p>
                                     <p className="text-xs text-text-muted">
                                        {session.location} · {session.time}
                                     </p>
                                  </div>
                               </div>
                               {!session.active && (
                                  <Button variant="ghost" size="sm" className="text-xs">注销</Button>
                               )}
                            </div>
                         ))}
                      </div>
                   </div>

                   {/* 危险区域 */}
                   <div className="pt-6 border-t border-border space-y-4">
                      <h4 className="font-medium text-text-main text-red-500">危险区域</h4>
                      
                      <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                         <div className="space-y-3">
                            <div>
                               <h5 className="font-medium text-text-main mb-1">删除账户</h5>
                               <p className="text-sm text-text-muted">
                                  永久删除您的账户和所有相关数据。此操作无法撤销。
                               </p>
                            </div>
                            <Button variant="danger" size="sm">
                              删除我的账户
                            </Button>
                         </div>
                      </div>
                   </div>
                </CardContent>
              </Card>
          </TabsContent>
          <TabsContent value="appearance">
              <Card>
                <CardHeader>
                   <CardTitle>外观设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div>
                      <h4 className="font-medium text-text-main mb-4">主题模式</h4>
                      <RadioGroup value={theme} onValueChange={setTheme}>
                         <div className="space-y-3">
                            <div className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'}`}
                                 onClick={() => setTheme('light')}>
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                                     <Sun size={20} className="text-yellow-500" />
                                  </div>
                                  <div>
                                     <p className="font-medium text-text-main">浅色模式</p>
                                     <p className="text-xs text-text-muted">明亮清晰的界面</p>
                                  </div>
                               </div>
                               <RadioItem value="light" />
                            </div>

                            <div className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'}`}
                                 onClick={() => setTheme('dark')}>
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center">
                                     <Moon size={20} className="text-blue-400" />
                                  </div>
                                  <div>
                                     <p className="font-medium text-text-main">深色模式</p>
                                     <p className="text-xs text-text-muted">深色舒适的界面</p>
                                  </div>
                               </div>
                               <RadioItem value="dark" />
                            </div>

                            <div className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'}`}
                                 onClick={() => setTheme('system')}>
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                     <Monitor size={20} className="text-white" />
                                  </div>
                                  <div>
                                     <p className="font-medium text-text-main">跟随系统</p>
                                     <p className="text-xs text-text-muted">自动匹配系统主题</p>
                                  </div>
                               </div>
                               <RadioItem value="system" />
                            </div>
                         </div>
                      </RadioGroup>
                   </div>

                   <div className="pt-4 border-t border-border">
                      <p className="text-sm text-text-muted">
                         当前主题: <span className="font-medium text-text-main">
                           {theme === 'light' ? '浅色模式' : theme === 'dark' ? '深色模式' : '跟随系统'}
                         </span>
                      </p>
                   </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                   <CardTitle>侧边栏设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-surface-hover transition-colors">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <PanelLeftOpen size={20} className="text-primary" />
                         </div>
                         <div>
                            <p className="font-medium text-text-main">鼠标悬停自动展开</p>
                            <p className="text-xs text-text-muted mt-1">
                               收起侧边栏后，将鼠标移至边栏区域可自动展开
                            </p>
                         </div>
                      </div>
                      <Switch 
                         checked={settings.autoExpandSidebar} 
                         onCheckedChange={(checked) => updateSetting('autoExpandSidebar', checked)}
                      />
                   </div>

                   <div className="pt-2">
                      <p className="text-sm text-text-muted">
                         💡 提示: {settings.autoExpandSidebar ? '已启用' : '已禁用'}自动展开功能
                      </p>
                   </div>
                </CardContent>
              </Card>
          </TabsContent>
       </Tabs>
    </div>
  );
};

export default SettingsPage;
