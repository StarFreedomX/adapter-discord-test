import { Context, h, Schema, Session } from 'koishi'
import {} from '@koishijs/plugin-adapter-discord'

export const name = 'test'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

type DiscordButtonEvent = { id: string; componentType?: number; values?: string[] }
type DiscordModalEvent = { custom_id: string; fields: Record<string, string> }

function buildElements(type: string, session: Session): h[] | null {
  const el: h[] = []

  switch (type) {
    // ========== 纯文本类 ==========
    case 'text':
      el.push(h.text('这是一段普通文字'))
      el.push(h.text('特殊字符会被 escape: * _ ` ~ | ( ) [ ]'))
      break

    case 'b':
      el.push(h('b', {}, [h.text('这是粗体文字')]))
      el.push(h.text(' + '))
      el.push(h('strong', {}, [h.text('这也是粗体(strong)')]))
      break

    case 'i':
      el.push(h('i', {}, [h.text('这是斜体文字')]))
      el.push(h.text(' + '))
      el.push(h('em', {}, [h.text('这也是斜体(em)')]))
      break

    case 'u':
      el.push(h('u', {}, [h.text('这是下划线文字')]))
      el.push(h.text(' + '))
      el.push(h('ins', {}, [h.text('这也是下划线(ins)')]))
      break

    case 's':
      el.push(h('s', {}, [h.text('这是删除线文字')]))
      el.push(h.text(' + '))
      el.push(h('del', {}, [h.text('这也是删除线(del)')]))
      break

    case 'spl':
      el.push(h.text('前方剧透: '))
      el.push(h('spl', {}, [h.text('隐藏内容在这里')]))
      break

    case 'code':
      el.push(h.text('使用 '))
      el.push(h('code', {}, [h.text('console.log("hello")')]))
      el.push(h.text(' 来输出日志'))
      break

    case 'codeblock':
      el.push(h('code-block', { language: 'typescript' }, [
        h.text('const foo: string = "hello"\nconsole.log(foo)'),
      ]))
      break

    case 'a':
      el.push(h('a', { href: 'https://koishi.chat' }, [
        h.text('Koishi 官网'),
      ]))
      break

    case 'br':
      el.push(h.text('第一行'))
      el.push(h('br'))
      el.push(h.text('第二行'))
      el.push(h('br'))
      el.push(h.text('第三行'))
      break

    case 'p':
      el.push(h('p', {}, [h.text('这是第一段文字')]))
      el.push(h('p', {}, [h.text('这是第二段文字，会和上一段有空行分隔')]))
      break

    case 'blockquote':
      el.push(h('blockquote', {}, [h.text('这是一段引用的文字')]))
      el.push(h.text('这是普通文字，不在引用中'))
      break

    case 'ul':
      el.push(h('ul', {}, [
        h('li', {}, [h.text('无序列表项目 1')]),
        h('li', {}, [h.text('无序列表项目 2')]),
        h('li', {}, [h.text('无序列表项目 3')]),
      ]))
      break

    case 'ol':
      el.push(h('ol', {}, [
        h('li', {}, [h.text('有序列表项目 1')]),
        h('li', {}, [h.text('有序列表项目 2')]),
        h('li', {}, [h.text('有序列表项目 3')]),
      ]))
      break

    // ========== 引用类 ==========
    case 'at':
      el.push(h.text('at 用户: '))
      el.push(h('at', { id: session.userId }))
      el.push(h.text('\n'))
      el.push(h('at', { type: 'here' }))
      break

    case 'sharp':
      el.push(h.text('跳转到频道: '))
      el.push(h('sharp', { id: session.channelId }))
      break

    case 'face':
      el.push(h.text('Discord 内置表情: '))
      el.push(h('face', { name: 'smile', id: '0' }))
      el.push(h.text('  动画表情: '))
      el.push(h('face', { name: 'party', id: '1', animated: true }))
      break

    // ========== 富媒体类 ==========
    case 'author':
      el.push(h('author', { name: '自定义名称', avatar: 'https://koishi.chat/logo.png' }))
      el.push(h.text('这条消息会用自定义的 author 名称发送'))
      break

    case 'img':
      el.push(h('img', { src: 'https://koishi.chat/logo.png' }))
      el.push(h.text('上方是一张图片'))
      break

    case 'video':
      el.push(h('video', {
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
      }))
      break

    case 'audio':
      el.push(h('audio', {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: 10,
      }))
      break

    case 'share':
      el.push(h('share', {
        title: '嵌入消息标题',
        description: '这是嵌入消息的描述文字',
        url: 'https://koishi.chat',
        image: 'https://koishi.chat/logo.png',
      }))
      break

    // ========== 引用/转发 ==========
    case 'quote':
      el.push(h('quote', { id: session.messageId }))
      el.push(h.text('这是一条回复消息(会@对方)'))
      el.push(h('message', {}, [
        h('quote', { id: session.messageId, silent: true }),
        h.text('这是一条静默回复(不会@对方)'),
      ]))
      break

    case 'figure':
      el.push(h('figure', {}, [
        h('img', { src: 'https://koishi.chat/logo.png' }),
        h.text('图片下方的说明文字'),
      ]))
      break

    // ========== 按钮 ==========
    case 'button':
      el.push(h.text('链接按钮(点开会跳转): '))
      el.push(h('button', { type: 'link', href: 'https://koishi.chat' }, [h.text('🔗 访问 Koishi')]))
      el.push(h.text('\n交互按钮: '))
      el.push(h('button', { class: 'primary', id: 'btn-hello' }, [h.text('👋 打招呼')]))
      el.push(h('button', { class: 'secondary', id: 'btn-info' }, [h.text('ℹ️ 信息')]))
      el.push(h('button', { class: 'danger', id: 'btn-delete' }, [h.text('🗑 删除')]))
      el.push(h('button', { class: 'success', id: 'btn-ok' }, [h.text('✅ 确认')]))
      break

    // ========== 消息结构 ==========
    case 'message':
      el.push(h.text('第一条消息'))
      el.push(h('message', {}, [h.text('第二条消息(分开发送)')]))
      break

    case 'forward':
      if (!session.guildId) {
        return null
      }
      el.push(h('message', { forward: true }, [
        h('message', { id: 'fake-1' }, [
          h('author', { name: '用户A', avatar: 'https://koishi.chat/logo.png' }),
          h.text('用户A 的消息'),
        ]),
        h('message', { id: 'fake-2' }, [
          h('author', { name: '用户B' }),
          h.text('用户B 的消息'),
        ]),
      ]))
      break

    // ========== 组合展示 ==========
    case 'nested':
      el.push(h.text('普通 '))
      el.push(h('b', {}, [h.text('粗体')]))
      el.push(h.text(' 中包含 '))
      el.push(h('b', {}, [
        h.text('粗体里的'),
        h('i', {}, [h.text('粗斜体')]),
        h.text('文字'),
      ]))
      el.push(h.text(' 效果'))
      break

    // ========== 新增: Select Menu ==========
    case 'select':
      el.push(h.text('请选择一个选项: '))
      el.push(h('discord:select', {
        id: 'sel-demo',
        type: 'string',
        placeholder: '选择一个颜色',
        action: (s: Session) => s.send(`你选择了: ${(s.event.button as unknown as DiscordButtonEvent).values?.join(', ') || ''}`),
      }, [
        h('discord:option', { label: '🔴 红色', value: 'red', description: '热情的红色' }),
        h('discord:option', { label: '🟢 绿色', value: 'green', description: '清新的绿色' }),
        h('discord:option', { label: '🔵 蓝色', value: 'blue', description: '冷静的蓝色' }),
      ]))
      break

    case 'select-user':
      el.push(h.text('请选择用户: '))
      el.push(h('discord:select', {
        id: 'sel-user',
        type: 'user',
        placeholder: '选择一个用户',
        action: (s: Session) => s.send(`你选择了用户: ${(s.event.button as unknown as DiscordButtonEvent).values?.join(', ') || ''}`),
      }, []))
      break

    // ========== 新增: Rich Embed ==========
    case 'embed':
      el.push(h('discord:embed', {
        title: '📦 结构化 Embed 标题',
        description: '这是通过 discord:embed 元素构建的富文本嵌入消息',
        url: 'https://koishi.chat',
        color: 0x5865F2,
      }, [
        h('discord:embed-author', { name: 'Koishi', icon_url: 'https://koishi.chat/logo.png', url: 'https://koishi.chat' }),
        h('discord:embed-field', { name: '字段 1', value: '值 1', inline: true }),
        h('discord:embed-field', { name: '字段 2', value: '值 2', inline: true }),
        h('discord:embed-field', { name: '长字段', value: '这个字段不内联，独占一行' }),
        h('discord:embed-footer', { text: '底部信息 · 今天', icon_url: 'https://koishi.chat/logo.png' }),
      ]))
      break

    case 'embed-multi':
      el.push(h.text('这是一条包含多个 embed 的消息：'))
      el.push(h('discord:embed', {
        title: '第一个 Embed',
        description: '内容 A',
        color: 0xFF0000,
      }, [
        h('discord:embed-footer', { text: 'Footer A' }),
      ]))
      el.push(h('discord:embed', {
        title: '第二个 Embed',
        description: '内容 B',
        color: 0x00FF00,
      }, [
        h('discord:embed-footer', { text: 'Footer B' }),
      ]))
      el.push(h('discord:embed', {
        title: '第三个 Embed',
        description: '内容 C',
        color: 0x0000FF,
      }, [
        h('discord:embed-image', { url: 'https://koishi.chat/logo.png' }),
      ]))
      break

    // ========== 新增: Modal 多字段表单 ==========
    case 'modal':
      el.push(h.text('点击按钮打开注册表单: '))
      el.push(h('button', {
        type: 'input',
        id: 'register-form',
        class: 'primary',
        text: '📝 注册',
      }, [
        h('discord:modal-input', { label: '用户名', id: 'username', required: true, placeholder: '输入用户名' }),
        h('discord:modal-input', { label: '邮箱', id: 'email', placeholder: 'user@example.com' }),
        h('discord:modal-input', { label: '简介', id: 'bio', style: 'paragraph', placeholder: '介绍一下你自己...', required: false }),
      ]))
      break

    // ========== 新增: Ephemeral ==========
    case 'ephemeral':
      el.push(h.text('点击按钮，仅你能看到回复: '))
      el.push(h('button', {
        class: 'primary',
        action: (s: Session) => s.send(h('message', { ephemeral: true }, [h.text('这条消息只有你能看到 👀')])),
      }, [h.text('👁 仅自己可见')]))
      break

    // 直接发 ephemeral（仅 slash command 有效）
    case 'once-ephemeral':
      el.push(h('message', { ephemeral: true }, [
        h.text('👀 这条消息只有你能看到！(slash command 直发)'),
      ]))
      break

    default:
      return null
  }
  return el
}

const ALL_TYPES = [
  'text', 'b', 'i', 'u', 's', 'spl', 'code', 'codeblock', 'a', 'br', 'p',
  'blockquote', 'ul', 'ol', 'at', 'sharp', 'face', 'author',
  'img', 'video', 'audio', 'share', 'quote', 'figure',
  'button', 'message', 'forward', 'nested',
  'select', 'select-user', 'embed', 'embed-multi',
  'modal', 'ephemeral', 'once-ephemeral',
] as const

export function apply(ctx: Context, _config: Config) {
  ctx.command('test [...types]', '测试 Discord adapter 各元素效果，可多选。例: test b i u')
    .action(async ({ session }, ...types: string[]) => {
      if (!types.length) {
        const desc: Record<string, string> = {
          text: '普通文字', b: '粗体 **', i: '斜体 *', u: '下划线 __', s: '删除线 ~~',
          spl: '遮罩 ||', code: '行内代码', codeblock: '代码块', a: '超链接', br: '换行',
          p: '段落', blockquote: '引用 >', ul: '无序列表', ol: '有序列表',
          at: '@提及', sharp: '#频道', face: '表情', author: '自定义发送者',
          img: '图片', video: '视频', audio: '语音', share: '嵌入消息',
          quote: '回复', figure: '图文组合', button: '按钮', message: '多消息',
          forward: '转发', nested: '嵌套格式', select: '选择菜单', 'select-user': '用户选择',
          embed: '结构化Embed', 'embed-multi': '多Embed', modal: '多字段表单', ephemeral: '按钮Ephemeral', 'once-ephemeral': '直接Ephemeral',
        }
        const groups = [
          ['text', 'b', 'i', 'u', 's', 'spl', 'code', 'codeblock', 'a', 'br', 'p', 'blockquote', 'ul', 'ol'],
          ['at', 'sharp', 'face', 'author', 'img', 'video', 'audio', 'share'],
          ['quote', 'figure', 'button', 'message', 'forward', 'nested'],
          ['select', 'select-user', 'embed', 'embed-multi', 'modal', 'ephemeral', 'once-ephemeral'],
        ]
        const titles = ['📝 文本格式', '🔗 引用与媒体', '📦 结构与交互', '🆕 新增功能']
        await session.send(
          h('message', {}, [
            h.text(`用法: **test <类型>**  或  **test all**\n`),
            ...groups.map((g, i) => h('discord:embed', {
              title: titles[i],
              color: [0x5865F2, 0x57F287, 0xFEE75C, 0xED4245][i],
            }, g.map(t => h('discord:embed-field', {
              name: t, value: desc[t] || '', inline: true,
            })))),
          ]),
        )
        return
      }
      if (types[0] === 'all') {
        for (const t of ALL_TYPES) {
          const elems = buildElements(t, session)
          if (elems) await session.send(h('message', { id: t }, elems))
        }
        await session.send(`--- 全部 ${ALL_TYPES.length} 种发送完毕 ---`)
        return
      }
      if (types[0] === 'test') {
        await session.send(`<b>1</b><i>1.5</i><b>2</b><b>3</b>`)
        return
      }

      let count = 0
      for (const t of types) {
        if (!(ALL_TYPES as readonly string[]).includes(t)) {
          await session.send(`未知类型: ${t}`)
          continue
        }
        const elems = buildElements(t, session)
        if (!elems) {
          await session.send(`${t} 在此环境不可用`)
          continue
        }
        await session.send(h('message', { id: t }, elems))
        count++
      }
      await session.send(`--- 已发送 ${count}/${types.length} 种 ---`)
    })

  ctx.middleware(async (session, next) => {
    console.dir({ elements: session.elements, quote: session.quote }, { depth: 5 })
    return next()
  })

  ctx.on('interaction/button', (session) => {
    const btnId = session.event?.button?.id as string
    const compType = (session.event?.button as unknown as DiscordButtonEvent)?.componentType
    console.log(`[按钮按下] id=${btnId} user=${session.userId} compType=${compType}`)

    // 跳过 select menu 交互 (componentType 3,5,6,7,8)，它们有各自的 action 回调
    if (compType && compType !== 2) {
      console.log(`[跳过 select 交互] id=${btnId} compType=${compType}`)
      return
    }

    const replies: Record<string, string> = {
      'btn-hello': `👋 <@${session.userId}> 你好！你按下了打招呼按钮`,
      'btn-info': `ℹ️ 当前时间: ${new Date().toLocaleString()}`,
      'btn-delete': '🗑 模拟删除操作(什么都没发生)',
      'btn-ok': '✅ 操作已确认！',
    }
    if (!replies[btnId]) return // 不是我们管的按钮（有 action 回调的），不管
    return session.send(replies[btnId])
  })

  // 处理 modal 表单提交
  ctx.on('interaction/command', (session) => {
    const modal = (session.event as unknown as Record<string, DiscordModalEvent>)?.modal
    if (!modal) return // 不是 modal 提交（是 slash command），跳过
    console.log(`[Modal提交] id=${modal.custom_id} fields=`, modal.fields)
    const lines = Object.entries(modal.fields as Record<string, string>)
      .flatMap(([k, v]) => [h('b', {}, [h.text(k)]), h.text(`: ${v || '(空)'}`), h('br')])
    return session.send(h('message', {}, [h.text('📋 表单已提交:\n'), ...lines]))
  })
}
