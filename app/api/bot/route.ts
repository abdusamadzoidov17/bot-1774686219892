import { webhookCallback } from 'grammy';
import { bot } from '@/src/bot';

// Включение вебхука для Next.js App Router
// Используем 'next-js' для совместимости с Next.js
// Важно: BOT_TOKEN должен быть в переменных окружения Vercel

export const POST = webhookCallback(bot, 'next-js');

// Обработка GET запросов (для проверки работы)
export const GET = async () => {
  return new Response('Telegram Support Bot is running');
};