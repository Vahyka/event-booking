// src/types/express/index.d.ts
import { UserAttributes } from '../models/user.model'; // путь подкорректируй под свой проект

declare global {
  namespace Express {
    interface Request {
      user?: UserAttributes; // или другой тип, который ты используешь для пользователя
    }
  }
}