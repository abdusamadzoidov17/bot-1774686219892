import { Context } from 'grammy';
import { MyContext } from '../bot';

// Простой middleware для добавления кастомных свойств в контекст
// В реальном проекте здесь можно подключить базу данных или KV

export const Storage = async (ctx: MyContext, next: () => Promise<void>) => {
  // Добавляем в контекст объект для работы с данными
  ctx.db = {
    // Заглушки для будущих методов работы с БД
    getTicket: async (id: string) => {
      console.log(`[DB] Получение тикета ${id}`);
      return null;
    },
    saveTicket: async (ticket: any) => {
      console.log(`[DB] Сохранение тикета`, ticket);
      return true;
    },
    updateTicket: async (id: string, updates: any) => {
      console.log(`[DB] Обновление тикета ${id}`, updates);
      return true;
    },
  };

  await next();
};

// Расширение типа Context
declare module 'grammy' {
  interface Context {
    db: {
      getTicket: (id: string) => Promise<any>;
      saveTicket: (ticket: any) => Promise<boolean>;
      updateTicket: (id: string, updates: any) => Promise<boolean>;
    };
  }
}