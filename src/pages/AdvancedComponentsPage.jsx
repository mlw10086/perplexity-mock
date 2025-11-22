import React from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { RadioGroup, RadioItem } from '@/components/ui/Radio';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Slider } from '@/components/ui/Slider';
import { Progress } from '@/components/ui/Progress';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Separator } from '@/components/ui/Separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/Dialog';
import { Tooltip } from '@/components/ui/Tooltip';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Pagination } from '@/components/ui/Pagination';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/DropdownMenu';
import { Popover } from '@/components/ui/Popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/Sheet';
import { CommandMenu, CommandGroup, CommandItem } from '@/components/ui/CommandMenu';
import { Rating } from '@/components/ui/Rating';
import { Timeline, TimelineItem } from '@/components/ui/Timeline';
import { Stepper } from '@/components/ui/Stepper';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { EmptyState } from '@/components/ui/EmptyState';
import { ContextMenu } from '@/components/ui/ContextMenu';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Home, Settings, Download, Edit, Trash, Copy, Share, Archive, CheckCircle, Clock, Activity } from 'lucide-react';

const AdvancedComponentsPage = () => {
  const [checkboxState, setCheckboxState] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState('option1');
  const [selectValue, setSelectValue] = React.useState('');
  const [sliderValue, setSliderValue] = React.useState(50);
  const [progressValue, setProgressValue] = React.useState(65);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [ratingValue, setRatingValue] = React.useState(3);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentStep, setCurrentStep] = React.useState(2);
  const [colorValue, setColorValue] = React.useState('#13B9C4');

  const selectOptions = [
    { value: 'option1', label: '选项 1' },
    { value: 'option2', label: '选项 2' },
    { value: 'option3', label: '选项 3' },
  ];

  const breadcrumbItems = [
    { label: '首页', href: '/', icon: Home },
    { label: '组件', href: '/components' },
    { label: '高级组件' },
  ];

  const steps = [
    { label: '基本信息', description: '填写基本资料' },
    { label: '详细设置', description: '配置详细信息' },
    { label: '审核确认', description: '确认提交' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-16 animate-fade-in pb-20">
      
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold">高级组件</h1>
        <p className="text-text-muted">更多高级和复杂的 UI 组件</p>
      </div>

      {/* Form Controls */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-border pb-3">表单控件</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>复选框</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Checkbox checked={checkboxState} onCheckedChange={setCheckboxState} label="记住我" />
              <Checkbox checked={true} label="接受条款和条件" />
              <Checkbox checked={false} label="订阅新闻通讯" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>单选按钮</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                <RadioItem value="option1" label="选项 1" />
                <RadioItem value="option2" label="选项 2" />
                <RadioItem value="option3" label="选项 3" />
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>下拉选择</CardTitle>
            </CardHeader>
            <CardContent>
              <Select options={selectOptions} value={selectValue} onChange={setSelectValue} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>文本域</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="输入多行文本..." rows={4} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>滑块</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Slider value={sliderValue} onChange={setSliderValue} />
              <div className="text-center text-sm text-text-muted">当前值: {sliderValue}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>进度条</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={progressValue} showLabel />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setProgressValue(Math.max(0, progressValue - 10))}>-10</Button>
                <Button size="sm" onClick={() => setProgressValue(Math.min(100, progressValue + 10))}>+10</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feedback Components */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-border pb-3">反馈组件</h2>
        
        <div className="space-y-4">
          <Alert variant="success" title="成功">操作已成功完成！</Alert>
          <Alert variant="warning" title="警告">请注意此操作可能会影响数据。</Alert>
          <Alert variant="error" title="错误">发生了一个错误，请稍后重试。</Alert>
          <Alert variant="info" title="提示" onClose={() => console.log('关闭')}>这是一条信息提示。</Alert>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Spinner size={20} />
            <span className="text-sm text-text-muted">加载中...</span>
          </div>
          <div className="flex items-center gap-2">
            <Spinner size={32} />
            <span className="text-sm text-text-muted">处理中...</span>
          </div>
        </div>
      </section>

      {/* Dialog & Overlay */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-border pb-3">对话框与覆盖层</h2>
        
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setDialogOpen(true)}>打开对话框</Button>
          <Button onClick={() => setSheetOpen(true)} variant="secondary">打开侧边栏</Button>
          <Button onClick={() => setCommandOpen(true)} variant="outline">打开命令面板</Button>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogClose onClose={() => setDialogOpen(false)} />
            <DialogHeader>
              <DialogTitle>确认操作</DialogTitle>
              <DialogDescription>您确定要执行此操作吗？此操作无法撤销。</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
              <Button onClick={() => setDialogOpen(false)}>确认</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen} side="right">
          <SheetContent onClose={() => setSheetOpen(false)}>
            <SheetHeader>
              <SheetTitle>侧边栏标题</SheetTitle>
              <SheetDescription>这是侧边栏的描述内容。</SheetDescription>
            </SheetHeader>
            <div className="py-6">
              <p className="text-sm text-text-muted">这里可以放置任何内容...</p>
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={() => setSheetOpen(false)}>关闭</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <CommandMenu open={commandOpen} onOpenChange={setCommandOpen}>
          <CommandGroup heading="导航">
            <CommandItem icon={Home} shortcut="⌘H">首页</CommandItem>
            <CommandItem icon={Settings} shortcut="⌘S">设置</CommandItem>
          </CommandGroup>
          <CommandGroup heading="操作">
            <CommandItem icon={Download}>下载</CommandItem>
            <CommandItem icon={Share}>分享</CommandItem>
          </CommandGroup>
        </CommandMenu>
      </section>

      {/* Interactive Components */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-border pb-3">交互组件</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>评分</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Rating value={ratingValue} onChange={setRatingValue} />
              <div className="text-sm text-text-muted">当前评分: {ratingValue} 星</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>颜色选择器</CardTitle>
            </CardHeader>
            <CardContent>
              <ColorPicker value={colorValue} onChange={setColorValue} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>下拉菜单</CardTitle>
            </CardHeader>
            <CardContent>
              <DropdownMenu
                trigger={<Button variant="outline">打开菜单</Button>}
              >
                <DropdownMenuLabel>操作</DropdownMenuLabel>
                <DropdownMenuItem icon={Edit}>编辑</DropdownMenuItem>
                <DropdownMenuItem icon={Copy}>复制</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem icon={Trash}>删除</DropdownMenuItem>
              </DropdownMenu>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>弹出框</CardTitle>
            </CardHeader>
            <CardContent>
              <Popover
                trigger={<Button variant="outline">打开弹出框</Button>}
                position="bottom"
              >
                <div className="w-64 space-y-2">
                  <h4 className="font-medium text-sm">弹出框标题</h4>
                  <p className="text-xs text-text-muted">这是弹出框的内容...</p>
                </div>
              </Popover>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>右键菜单</CardTitle>
          </CardHeader>
          <CardContent>
            <ContextMenu
              items={[
                { label: '编辑', icon: Edit, onClick: () => console.log('编辑') },
                { label: '复制', icon: Copy, onClick: () => console.log('复制'), shortcut: '⌘C' },
                { label: '归档', icon: Archive, onClick: () => console.log('归档') },
                { separator: true },
                { label: '删除', icon: Trash, onClick: () => console.log('删除'), danger: true },
              ]}
            >
              <div className="p-12 border-2 border-dashed border-border rounded-lg text-center text-text-muted cursor-pointer hover:border-primary transition-colors">
                右键点击这里查看上下文菜单
              </div>
            </ContextMenu>
          </CardContent>
        </Card>
      </section>

      {/* Navigation & Layout */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-border pb-3">导航与布局</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>面包屑</CardTitle>
          </CardHeader>
          <CardContent>
            <Breadcrumb items={breadcrumbItems} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>分页</CardTitle>
          </CardHeader>
          <CardContent>
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>步骤条</CardTitle>
          </CardHeader>
          <CardContent className="py-6">
            <Stepper steps={steps} currentStep={currentStep} />
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                上一步
              </Button>
              <Button
                onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                disabled={currentStep === 3}
              >
                下一步
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>时间线</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline>
              <TimelineItem
                icon={CheckCircle}
                title="项目启动"
                description="项目正式开始开发"
                time="2024-01-01"
                active
              />
              <TimelineItem
                icon={Clock}
                title="开发中"
                description="正在进行功能开发"
                time="2024-01-15"
              />
              <TimelineItem
                icon={Activity}
                title="即将发布"
                description="准备发布第一个版本"
                time="2024-02-01"
              />
            </Timeline>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>折叠面板</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion>
              <AccordionItem title="什么是 React？" defaultOpen>
                React 是一个用于构建用户界面的 JavaScript 库。
              </AccordionItem>
              <AccordionItem title="什么是 Tailwind CSS？">
                Tailwind CSS 是一个实用优先的 CSS 框架。
              </AccordionItem>
              <AccordionItem title="如何开始学习？">
                从官方文档开始，然后通过实践项目来学习。
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </section>

      {/* Display Components */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-border pb-3">显示组件</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>代码块</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock
              language="javascript"
              code={`const greeting = "你好，世界！";
console.log(greeting);

function add(a, b) {
  return a + b;
}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>骨架屏</CardTitle>
          </CardHeader>
          <CardContent>
            <SkeletonCard />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>空状态</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="暂无内容"
              description="还没有任何数据，点击下方按钮开始创建。"
              actionLabel="创建新项目"
              action={() => console.log('创建')}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>工具提示</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Tooltip content="顶部提示" position="top">
              <Button variant="outline">上方</Button>
            </Tooltip>
            <Tooltip content="底部提示" position="bottom">
              <Button variant="outline">下方</Button>
            </Tooltip>
            <Tooltip content="左侧提示" position="left">
              <Button variant="outline">左侧</Button>
            </Tooltip>
            <Tooltip content="右侧提示" position="right">
              <Button variant="outline">右侧</Button>
            </Tooltip>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-8" />

    </div>
  );
};

export default AdvancedComponentsPage;
