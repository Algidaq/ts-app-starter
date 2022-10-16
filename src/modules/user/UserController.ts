import { Request, Response } from 'express';
const kUsers = [
  { id: 1, name: 'Algidaq Elemgdadi', email: 'Algidaq94@gmail.com' },
  { id: 2, name: 'Algidaq Elemgdadi2', email: 'Algidaq942@gmail.com' },
  { id: 3, name: 'Algidaq Elemgdadi2', email: 'Algidaq942@gmail.com' },
];
export default class UserController {
  async getAllUsers(req: Request, res: Response): Promise<void | Response> {
    return res.json(kUsers);
  }
}
