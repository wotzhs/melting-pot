export class AccountService {
  async CreateAccount(req) {
    try {
      return [{ message: "hello world" }, null];
    } catch (err) {
      return [null, err];
    }
  }
}
