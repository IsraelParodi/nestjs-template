export class Email {
  private readonly value: string;

  constructor(email: string) {
    this.value = email;
  }

  getValue() {
    return this.value;
  }
}
