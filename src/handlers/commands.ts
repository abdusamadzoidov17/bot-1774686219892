import { Context } from 'grammy';
import { MyContext } from '../bot';

// Обработка команд
// /start - приветствие и инструкция
// /support - создать новый тикет
// /my tickets - просмотр своих тикетов
// /admin - панель администратора (только для админов)

export const commands = async (ctx: MyContext) => {
  const text = ctx.message?.text;
  if (!text) return;

  switch (text.split(' ')[0]) {
    case '/start':
      await ctx.reply(
        '👋 Привет! Я бот службы поддержки.\n\n' +
        'Я помогу вам:\n' +
        '• Создать обращение в поддержку (/support)\n' +
        '• Просмотреть статус ваших обращений (/my tickets)\n' +
        '• Связаться с оператором\n\n' +
        'Просто отправьте сообщение, и я создам тикет!',
        {
          reply_markup: {
            keyboard: [
              [{ text: '🆘 Создать обращение', callback_data: 'new_ticket' }],
              [{ text: '📋 Мои тикеты', callback_data: 'my_tickets' }],
            ],
            resize_keyboard: true,
          },
        }
      );
      break;

    case '/support':
      await ctx.reply(
        '📝 Опишите вашу проблему или вопрос.\n' +
        'Отправьте текстовое сообщение, и я создам тикет.\n' +
        'Вы также можете прикрепить фото или документ.',
        {
          reply_markup: {
            remove_keyboard: true,
          },
        }
      );
      break;

    case '/my':
      if (text.includes('tickets')) {
        await ctx.reply('Функция просмотра тикетов в разработке. Скоро будет доступна!');
      }
      break;

    case '/admin':
      // Проверка на администратора (пример: ID из переменной окружения)
      const adminIds = process.env.ADMIN_IDS?.split(',').map(id => parseInt(id.trim())) || [];
      if (adminIds.includes(ctx.from!.id)) {
        await ctx.reply(
          '🔐 Панель администратора:\n\n' +
          '• /tickets - все открытые тикеты\n' +
          '• /ticket <id> - просмотр тикета\n' +
          '• /close <id> - закрыть тикет',
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: '📂 Все тикеты', callback_data: 'admin_tickets' }],
              ],
            },
          }
        );
      } else {
        await ctx.reply('⛔ У вас нет доступа к панели администратора.');
      }
      break;

    default:
      // Неизвестная команда
      await ctx.reply('Неизвестная команда. Используйте /start для начала работы.');
  }
};