import {Client, Repository} from 'redis-om';
import {UserSchema, UserInterface, User} from './User.entity';

const DEFAULT_REDIS_CLIENT_URL = 'redis://default:redispw@localhost:6379';

//TODO improve error messages
export class UsersController {
  private usersRepository: Repository<User>;

  constructor() {
    const CLIENT_URL = process.env.REDIS_CLIENT_URL ?? DEFAULT_REDIS_CLIENT_URL;
    const client = new Client();
    client.open(CLIENT_URL);
    this.usersRepository = client.fetchRepository(UserSchema);
    this.usersRepository.createIndex();
  }

  /**
   * @method loginUser
   * @param wallet
   * @param secret
   */
  public async loginUser(wallet: string, secret: string) {
    return (await (
      await this.usersRepository.fetch(wallet)
    ).toJSON()) as UserInterface;
  }

  /**
   * @method registerUser
   * @param wallet
   * @param secret
   */
  public async registerUser(wallet: string, secret: string) {
    return (
      (await this.usersRepository.createAndSave({
        wallet,
        name: wallet,
        secret,
        availableSpace: 0,
        usedSpace: 0,
      })) !== undefined
    );
  }
}
