import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import {
  CalendarClockIcon,
  CheckCircle2Icon,
  EllipsisIcon,
  FileTextIcon,
  HistoryIcon,
  MailIcon,
  Maximize2Icon,
  MessageSquareTextIcon,
  NotebookTextIcon,
  PaperclipIcon,
  PhoneIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui/tabs'
import { TooltipProvider } from '@/components/ui/tooltip'
import { DetailGroup } from './detail-group'
import { DetailRow } from './detail-row'
import { DetailSheet } from './detail-sheet'
import { DetailSheetAction } from './detail-sheet-action'

const meta = {
  title: 'Patterns/DetailSheet',
  component: DetailSheet,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DetailSheet>

export default meta

type Story = StoryObj<typeof meta>

function LeadIdentity() {
  return (
    <DetailGroup title="Contato">
      <div className="flex items-start gap-3 p-4">
        <Avatar className="size-11">
          <AvatarFallback>MA</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold">Mariana Alves</p>
            <Badge variant="secondary">Ativo</Badge>
          </div>
          <p className="mt-1 truncate text-muted-foreground text-sm">mariana.alves@example.test</p>
          <p className="text-muted-foreground text-sm">+55 85 99999-0001</p>
        </div>
        <div className="flex gap-2">
          <DetailSheetAction label="Enviar e-mail">
            <MailIcon className="size-4" aria-hidden="true" />
          </DetailSheetAction>
          <DetailSheetAction label="Ligar">
            <PhoneIcon className="size-4" aria-hidden="true" />
          </DetailSheetAction>
        </div>
      </div>
    </DetailGroup>
  )
}

function LeadOverview() {
  return (
    <div className="space-y-8">
      <LeadIdentity />

      <DetailGroup title="Detalhes">
        <DetailRow label="Etapa" value="Atendimento" />
        <DetailRow label="Responsável" value="Aline Martins" />
        <DetailRow label="Prioridade" value="Alta" />
      </DetailGroup>

      <DetailGroup title="Próxima tarefa">
        <DetailRow
          description="Preparar escopo e condições para a reunião."
          label="Enviar proposta inicial"
          leading={<CalendarClockIcon className="size-4" aria-hidden="true" />}
          value={<span className="text-warning-foreground">Hoje, 16:00</span>}
        />
      </DetailGroup>

      <DetailGroup title="Nota recente">
        <DetailRow
          description="Cliente confirmou o envio do contrato e aguarda a proposta."
          label="Contrato recebido para análise"
          leading={<NotebookTextIcon className="size-4" aria-hidden="true" />}
          value={<span className="text-muted-foreground">2h</span>}
        />
      </DetailGroup>
    </div>
  )
}

function LeadActivity() {
  return (
    <div className="space-y-8">
      <DetailGroup title="Hoje">
        <DetailRow
          description="Aline Martins adicionou uma nota."
          label="Contrato recebido para análise"
          leading={<NotebookTextIcon className="size-4" aria-hidden="true" />}
          value={<span className="text-muted-foreground">14:32</span>}
        />
        <DetailRow
          description="Conversa registrada no histórico do lead."
          label="Retorno pelo WhatsApp"
          leading={<MessageSquareTextIcon className="size-4" aria-hidden="true" />}
          value={<span className="text-muted-foreground">11:18</span>}
        />
      </DetailGroup>

      <DetailGroup title="Ontem">
        <DetailRow
          description="Concluída por Aline Martins."
          label="Revisar contrato recebido"
          leading={<CheckCircle2Icon className="size-4" aria-hidden="true" />}
          value={<span className="text-success-foreground">Concluída</span>}
        />
      </DetailGroup>
    </div>
  )
}

function ScrollableLeadContent() {
  return (
    <div className="space-y-8">
      <LeadOverview />

      <DetailGroup title="Tarefas relacionadas">
        <DetailRow
          description="Hoje, 16:00 · Aline Martins"
          label="Enviar proposta inicial"
          leading={<CalendarClockIcon className="size-4" aria-hidden="true" />}
          value="Pendente"
        />
        <DetailRow
          description="Amanhã, 09:30 · Gabriel Costa"
          label="Validar condições comerciais"
          leading={<CalendarClockIcon className="size-4" aria-hidden="true" />}
          value="Agendada"
        />
        <DetailRow
          description="Concluída ontem por Aline Martins"
          label="Revisar contrato recebido"
          leading={<CheckCircle2Icon className="size-4" aria-hidden="true" />}
          value="Concluída"
        />
      </DetailGroup>

      <DetailGroup title="Notas">
        <DetailRow
          description="Cliente prefere contato no período da tarde."
          label="Preferência de atendimento"
          leading={<NotebookTextIcon className="size-4" aria-hidden="true" />}
          value="Hoje"
        />
        <DetailRow
          description="Escopo inclui implantação e treinamento da equipe."
          label="Resumo da oportunidade"
          leading={<NotebookTextIcon className="size-4" aria-hidden="true" />}
          value="Ontem"
        />
        <DetailRow
          description="Decisão final depende da aprovação financeira."
          label="Próximo marco"
          leading={<NotebookTextIcon className="size-4" aria-hidden="true" />}
          value="2d"
        />
      </DetailGroup>

      <DetailGroup title="Arquivos">
        <DetailRow
          description="PDF · 1,8 MB"
          label="Contrato para análise.pdf"
          leading={<FileTextIcon className="size-4" aria-hidden="true" />}
          value="Hoje"
        />
        <DetailRow
          description="PDF · 840 KB"
          label="Proposta comercial v2.pdf"
          leading={<PaperclipIcon className="size-4" aria-hidden="true" />}
          value="Ontem"
        />
      </DetailGroup>

      <DetailGroup title="Histórico">
        <DetailRow
          description="Alterado por Aline Martins"
          label="Etapa movida para Atendimento"
          leading={<HistoryIcon className="size-4" aria-hidden="true" />}
          value="Hoje"
        />
        <DetailRow
          description="Mensagem recebida pelo WhatsApp"
          label="Lead solicitou nova proposta"
          leading={<MessageSquareTextIcon className="size-4" aria-hidden="true" />}
          value="Ontem"
        />
        <DetailRow
          description="Responsável definido automaticamente"
          label="Lead atribuído a Aline Martins"
          leading={<HistoryIcon className="size-4" aria-hidden="true" />}
          value="3d"
        />
        <DetailRow
          description="Origem: formulário do site"
          label="Lead criado"
          leading={<HistoryIcon className="size-4" aria-hidden="true" />}
          value="5d"
        />
      </DetailGroup>
    </div>
  )
}

function DetailTabs({
  activeTab,
  onTabChange,
  scrollable = false,
}: Readonly<{
  activeTab: 'overview' | 'activity'
  onTabChange: (tab: 'overview' | 'activity') => void
  scrollable?: boolean
}>) {
  return (
    <Tabs
      className="gap-0"
      onValueChange={(value) => onTabChange(value as 'overview' | 'activity')}
      value={activeTab}
    >
      <div className="sticky top-0 z-10 -mx-4 -mt-4 bg-popover px-4 pt-4 pb-5">
        <TabsList aria-label="Seções do detalhe" className="[--radius:9999px] w-full">
          <TabsTab value="overview">Visão geral</TabsTab>
          <TabsTab value="activity">Atividade</TabsTab>
        </TabsList>
      </div>
      <TabsPanel value="overview">
        {scrollable ? <ScrollableLeadContent /> : <LeadOverview />}
      </TabsPanel>
      <TabsPanel value="activity">
        <LeadActivity />
      </TabsPanel>
    </Tabs>
  )
}

function StoryShell({ withTabs }: Readonly<{ withTabs: boolean }>) {
  const [open, setOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'activity'>('overview')

  return (
    <TooltipProvider>
      <main className="flex min-h-screen items-center justify-center bg-muted/35 p-6 text-foreground">
        <Button onClick={() => setOpen(true)} variant="outline">
          Abrir detalhes
        </Button>

        <DetailSheet
          actions={
            <>
              <DetailSheetAction label="Expandir detalhes">
                <Maximize2Icon className="size-4" aria-hidden="true" />
              </DetailSheetAction>
              <DetailSheetAction label="Mais ações">
                <EllipsisIcon className="size-4" aria-hidden="true" />
              </DetailSheetAction>
            </>
          }
          description="Lead em atendimento"
          footer={
            <>
              <Button onClick={() => setOpen(false)} variant="outline">
                Fechar
              </Button>
              <Button>Abrir lead completo</Button>
            </>
          }
          onOpenChange={setOpen}
          open={open}
          title="Mariana Alves"
        >
          {withTabs ? (
            <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
          ) : (
            <LeadOverview />
          )}
        </DetailSheet>
      </main>
    </TooltipProvider>
  )
}

function ScrollableStoryShell() {
  const [open, setOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'activity'>('overview')

  return (
    <TooltipProvider>
      <main className="flex min-h-screen items-center justify-center bg-muted/35 p-6 text-foreground">
        <Button onClick={() => setOpen(true)} variant="outline">
          Abrir detalhes
        </Button>

        <DetailSheet
          actions={
            <>
              <DetailSheetAction label="Expandir detalhes">
                <Maximize2Icon className="size-4" aria-hidden="true" />
              </DetailSheetAction>
              <DetailSheetAction label="Mais ações">
                <EllipsisIcon className="size-4" aria-hidden="true" />
              </DetailSheetAction>
            </>
          }
          description="Lead em atendimento · conteúdo extenso"
          footer={
            <>
              <Button onClick={() => setOpen(false)} variant="outline">
                Fechar
              </Button>
              <Button>Abrir lead completo</Button>
            </>
          }
          onOpenChange={setOpen}
          open={open}
          title="Mariana Alves"
        >
          <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} scrollable />
        </DetailSheet>
      </main>
    </TooltipProvider>
  )
}

export const WithoutTabs: Story = {
  play: async ({ canvasElement }) => {
    const screen = within(canvasElement.ownerDocument.body)

    await expect(screen.getByRole('dialog', { name: 'Mariana Alves' })).toBeVisible()
    await expect(screen.getByText('Contato')).toBeVisible()
    await expect(screen.getByText('Detalhes')).toBeVisible()
    await expect(screen.getByText('Próxima tarefa')).toBeVisible()
    await expect(screen.getByLabelText('Expandir detalhes')).toBeVisible()
    await expect(screen.getByLabelText('Mais ações')).toBeVisible()
    await expect(screen.getByLabelText('Fechar detalhes')).toBeVisible()
  },
  render: () => <StoryShell withTabs={false} />,
}

export const WithTabs: Story = {
  play: async ({ canvasElement }) => {
    const screen = within(canvasElement.ownerDocument.body)

    await expect(screen.getByRole('tab', { name: 'Visão geral' })).toHaveAttribute(
      'aria-selected',
      'true',
    )

    await userEvent.click(screen.getByRole('tab', { name: 'Atividade' }))

    await expect(screen.getByRole('tab', { name: 'Atividade' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await expect(screen.getByText('Retorno pelo WhatsApp')).toBeVisible()
    await expect(screen.getByText('Revisar contrato recebido')).toBeVisible()
  },
  render: () => <StoryShell withTabs />,
}

export const ScrollableContent: Story = {
  play: async ({ canvasElement }) => {
    const screen = within(canvasElement.ownerDocument.body)

    await expect(screen.getByRole('tablist', { name: 'Seções do detalhe' })).toBeVisible()
    await expect(screen.getByText('Tarefas relacionadas')).toBeVisible()
    await expect(screen.getByText('Arquivos')).toBeVisible()
    await expect(screen.getByText('Histórico')).toBeVisible()
    await expect(screen.getByText('Lead criado')).toBeVisible()
  },
  render: () => <ScrollableStoryShell />,
}
