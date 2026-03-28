import { Context } from 'grammy';
import { MyContext } from '../bot';

// Обработка inline-кнопок

export const callbacks = async (ctx: MyContext) => {
  const data = ctx.callbackQuery?.data;
  if (!data) return;

  switch (true) {
    case data === 'new_ticket':
      await ctx.reply('Опишите вашу проблему текстом. Вы также можете прикрепить фото или документ.');
      await ctx.answerCbQuery();
      break;

    case data === 'my_tickets':
      await ctx.reply('📋 Ваши тикеты:\n(Функция в разработке)');
      await ctx.answerCbQuery();
      break;

    case data === 'admin_tickets':
      // Проверка админа
      const adminIds = process.env.ADMIN_IDS?.split(',').map(id => parseInt(id.trim())) || [];
      if (!adminIds.includes(ctx.from!.id)) {
        await ctx.answerCbQuery('⛔ Доступ запрещен');
        return;
      }
      await ctx.reply('📂 Список открытых тикетов:\n(Функция в разработке)');
      await ctx.answerCbQuery();
      break;

    case data.startsWith('cancel_'):
      const ticketId = data.split('_')[1];
      await ctx.reply(`❌ Тикет #${ticketId} отменен.`);
      await ctx.answerCbQuery('Тикет отменен');
      break;

    case data.startsWith('view_ticket_'):
      // Проверка админа
      if (!adminIds.includes(ctx.from!.id)) {
        await ctx.answerCbQuery('⛔ Доступ запрещен');
        return;
      }
      const viewTicketId = data.split('_')[2];
      await ctx.reply(`👁️ Тикет #${viewTicketId}\n(Функция просмотра в разработке)`);
      await ctx.answerCbQuery();
      break;

    default:
      await ctx.answerCbQuery('Неизвестное действие');
  }
};