import { Method, Controller, IsPublicMethod } from '../../decorators/index.js';
import { Success } from '../../helpers/index.js';
import { PayloadRequest } from '../../../interfaces/controller.js';
import { Context } from '../../index.js';
import { OpposerDatabase } from '../../../orm/index.js';
import User from '../models/usr.js';

@Controller('auth')
export default class Auth {
  private get db() {
    return Context.get<OpposerDatabase>('db');
  }

  @IsPublicMethod()
  @Method()
  async login(payload: PayloadRequest<any>) {
    const { lg, ps } = payload.data;
    const repo = this.db.getRepository(User);
    const user = await repo.findOne({ where: { lg, ps, ac: true } });

    if (!user) {
      throw new Error('Invalid credentials or inactive account.');
    }

    // This is a simplified example, in a real app you'd generate a real JWT
    return Success({
      token: 'JWT-TOKEN-EXAMPLE',
      user: {
        id: user.id,
        fn: user.fn,
        ln: user.ln,
        lg: user.lg,
      },
    });
  }

  @IsPublicMethod()
  @Method()
  async register(payload: PayloadRequest<any>) {
    const { fn, ln, lg, ps } = payload.data;
    const repo = this.db.getRepository(User);

    const existing = await repo.findOne({ where: { lg } });
    if (existing) {
      throw new Error('User already exists.');
    }

    const user = await repo.insert({
      fn,
      ln,
      lg,
      ps,
      ac: true,
    } as any);

    return Success(user);
  }

  @Method()
  async me() {
    // Current user context would be handled by middleware
    return Success({ message: 'User profile' });
  }

  @Method()
  async logout() {
    return Success({ message: 'Logged out' });
  }

  @Method()
  async refresh() {
    return Success({ token: 'NEW-JWT-TOKEN' });
  }

  static get social() {
    return {
      login: () => {},
      callback: () => {},
    };
  }
}
