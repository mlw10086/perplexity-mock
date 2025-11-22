import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Switch';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Search, Mail, Bell, CheckCircle, AlertTriangle, XCircle, Info, ArrowRight } from 'lucide-react';

const ComponentsPage = () => {
  const [switchState, setSwitchState] = React.useState(false);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 animate-fade-in pb-20">
      
      <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold">UI 组件库</h1>
            <p className="text-text-muted">采用 Perplexity 美学设计的可复用组件集合。</p>
          </div>
          <Link to="/components/advanced">
            <Button variant="primary" className="flex items-center gap-2">
              查看高级组件
              <ArrowRight size={16} />
            </Button>
          </Link>
      </div>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">按钮</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">主要</Button>
          <Button variant="secondary">次要</Button>
          <Button variant="outline">轮廓</Button>
          <Button variant="ghost">幽灵</Button>
          <Button variant="danger">危险</Button>
          <Button variant="primary" disabled>禁用</Button>
          <Button variant="primary" size="sm">小号</Button>
          <Button variant="primary" size="lg">大号</Button>
          <Button variant="outline" size="icon"><Bell size={18} /></Button>
        </div>
      </section>

      {/* Inputs */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">输入框</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
             <label className="text-sm font-medium">默认输入框</label>
             <Input placeholder="输入内容..." />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium">带图标</label>
             <Input icon={Search} placeholder="搜索..." />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium">禁用</label>
             <Input disabled placeholder="无法输入" />
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">标签</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">默认</Badge>
          <Badge variant="primary">主要</Badge>
          <Badge variant="secondary">次要</Badge>
          <Badge variant="outline">轮廓</Badge>
          <Badge variant="success">成功</Badge>
          <Badge variant="warning">警告</Badge>
          <Badge variant="danger">危险</Badge>
        </div>
      </section>

      {/* Controls */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">控件</h2>
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-3">
              <Switch checked={switchState} onCheckedChange={setSwitchState} />
              <span className="text-sm">{switchState ? '开启' : '关闭'}</span>
           </div>
           <div className="flex -space-x-2">
              <Avatar fallback="张" />
              <Avatar fallback="李" className="bg-blue-500/10 text-blue-500 border-blue-500/20" />
              <Avatar fallback="王" className="bg-green-500/10 text-green-500 border-green-500/20" />
           </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">标签页</h2>
        <Card className="w-full max-w-lg">
          <CardHeader>
             <CardTitle>账户设置</CardTitle>
          </CardHeader>
          <CardContent>
             <Tabs defaultValue="general" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="general">常规</TabsTrigger>
                    <TabsTrigger value="password">密码</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <div className="py-4 space-y-4">
                       <div className="space-y-1">
                          <label className="text-sm">姓名</label>
                          <Input defaultValue="张三" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-sm">邮箱</label>
                          <Input defaultValue="zhangsan@example.com" icon={Mail} />
                       </div>
                       <Button>保存更改</Button>
                    </div>
                </TabsContent>
                <TabsContent value="password">
                    <div className="py-4 text-sm text-text-muted">
                        演示版本中密码修改已禁用。
                    </div>
                </TabsContent>
             </Tabs>
          </CardContent>
        </Card>
      </section>

      {/* Data Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">数据表格</h2>
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>发票</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>方式</TableHead>
                        <TableHead className="text-right">金额</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[
                        { id: "INV001", status: "已支付", method: "信用卡", amount: "¥250.00" },
                        { id: "INV002", status: "待处理", method: "PayPal", amount: "¥150.00" },
                        { id: "INV003", status: "未支付", method: "银行转账", amount: "¥350.00" },
                        { id: "INV004", status: "已支付", method: "信用卡", amount: "¥450.00" },
                    ].map((invoice) => (
                        <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.id}</TableCell>
                            <TableCell>
                                <Badge variant={invoice.status === '已支付' ? 'success' : invoice.status === '待处理' ? 'warning' : 'danger'}>
                                    {invoice.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{invoice.method}</TableCell>
                            <TableCell className="text-right">{invoice.amount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
      </section>

    </div>
  );
};

export default ComponentsPage;
