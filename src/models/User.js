/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.lobby = null;
    this.ready = null;
    this.stats = null;
    this.password = null;
    Object.assign(this, data);
  }
}

export default User;
