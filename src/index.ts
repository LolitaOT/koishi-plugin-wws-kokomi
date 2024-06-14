import { Context, Schema, h } from 'koishi';

export const name = 'wws-kokomi'

export interface Config {
  url: string;
  token: string;
}

export const inject = ['http']

const defaultUrl = 'http://43.133.59.53:8000/bot/'
const defaultToken = 'user'

export const Config: Schema<Config> = Schema.object({
  url: Schema.string().default(defaultUrl).description('kokomi 的请求地址。'),
  token: Schema.string().default(defaultToken).description('kokomi 的请求 Token')
})

export function apply(ctx: Context) {
  ctx.command('wws [...args]')
  .action(async ({session}, ...args ) => {
    const res: {
      type: 'msg' | 'img',
      msg?: string;
      img?: string
    } = await ctx.http.get(defaultUrl, {
      params: {
        token: defaultToken,
        user_id: session.event.user.id,
        message: args.length < 1 ? 'me' : args.map((arg: string) => {
          if(arg.includes(' ')) {
            return `'${arg}'`
          }
          return arg
        }).join(' '),
        platform: 'qq_bot',
        platform_id: '123456',
        channel_id: '123456'
      }
    })
    if(res.type === 'msg') {
      return res.msg
    } 
    if(res.type === 'img') {
      return h('img', { src: res.img })
    }
    
    return '未知消息类型'
  })
}
