import { Context } from 'grammy';
import { MyContext } from '../bot';

// Обработка текстовых сообщений (создание тикетов)
// Также можно добавить обработку фото, документов и т.д.

export const messages = async (ctx: MyContext) => {
  // Игнорируем команды (они обрабатываются в commands.ts)
  if (ctx.message?.text?.startsWith('/')) return;

  const userId = ctx.from!.id;
  const username = ctx.from!.username || ctx.from!.first_name;
  const text = ctx.message?.text || 'Без текста (возможно, медиа)'; // Упрощенная обработка

  // Генерация ID тикета (в реальном проекте используйте базу данных)
  const ticketId = `T-${Date.now().toString(36).toUpperCase()}`;

  // Сохранение тикета (в демо просто логируем)
  console.log(`[Тикет ${ticketId}] От: ${username} (${userId})\nТекст: ${text}`);

  // Подтверждение пользователю
  await ctx.reply(
    `✅ Тикет #${ticketId} создан!\n\n` +
    `📝 Ваше сообщение: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}\n` +
    `🆔 ID: ${ticketId}\n` +
    `📊 Статус: Открыт\n\n` +
    `Оператор ответит в ближайшее время. Вы получите уведомление.`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📋 Мои тикеты', callback_data: 'my_tickets' }],
          [{ text: '❌ Отменить', callback_data: `cancel_${ticketId}` }],
        ],
      },
    }
  );

  // Уведомление администраторам (если нужно)
  // В реальном проекте отправьте в чат админов или через очередь
  const adminIds = process.env.ADMIN_IDS?.split(',').map(id => parseInt(id.trim())) || [];
  for (const adminId of adminIds) {
    try {
      await ctx.telegram.sendMessage(
        adminId,
        `🔔 Новый тикет!\n#${ticketId}\nОт: @${username}\nТекст: ${text.substring(0, 200)}...`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: '👁️ Посмотреть', callback_data: `view_ticket_${ticketId}` }],
            ],
          },
        }
      );
    } catch (error) {
      console.error('Не удалось уведомить админа:', adminId, error);
    }
  }
};