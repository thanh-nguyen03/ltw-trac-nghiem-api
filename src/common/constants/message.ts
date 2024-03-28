export class Message {
  static readonly SUCCESS = 'Success';
  static readonly ERROR = 'Error';

  // Auth
  static readonly INVALID_CREDENTIALS = 'Invalid credentials';
  static readonly INVALID_REFRESH_TOKEN = 'Invalid refresh token';
  static readonly USERNAME_TAKEN = 'Username is already taken';
  static readonly USER_CREATED_SUCCESSFULLY = 'User created successfully';
  static readonly USER_NOT_FOUND = 'User not found';

  // Contest
  static readonly CONTEST_NOT_FOUND = 'Contest not found';
  static readonly QUESTION_OPTIONS_INVALID = 'Question options are invalid';
  static readonly QUESTION_CORRECT_OPTIONS_INVALID =
    'Question correct options are invalid';
}
