import { Bot } from 'grammy';
import { middleware } from 'grammy';
import { commands } from './handlers/commands';
import { messages } from './handlers/messages';
import { callbacks } from './handlers/callbacks';
import { Storage } from './middleware/storage';

// Создание экземпляра бота с токеном из переменных окружения
const bot = new Bot(process.env.BOT_TOKEN!);

// Подключение middleware для работы с сессиями (если нужно)
// В этом примере используем простой in-memory storage для демо
// Для продакшена замените на KV или базу данных
bot.use(Storage);

// Middleware для логирования (опционально)
bot.use(async (ctx, next) => {
  console.log(`Update from ${ctx.from?.username || ctx.from?.id}: ${ctx.updateType}`);
  await next();
});

// Регистрация обработчиков
bot.use(commands);
bot.use(messages);
bot.use(callbacks);

// Глобальный обработчик ошибок
bot.catch((err) => {
  console.error('Ошибка в боте:', err);
});

// Экспорт бота для использования в webhook
export { bot };