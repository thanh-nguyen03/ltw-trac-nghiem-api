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
  static readonly CONTEST_ALREADY_HAS_SUBMISSIONS =
    'Contest already has submissions';
  static readonly CONTEST_TIME_INVALID = 'Contest time is invalid';
  static readonly CONTEST_TIME_REQUIRED =
    'Contest start time and end time is required for fix time contest';
  static readonly CONTEST_NOT_STARTED = 'Contest has not started yet';
  static readonly CONTEST_ENDED = 'Contest has ended';

  // Questions
  static readonly QUESTION_NOT_FOUND = 'Question not found';
  static readonly QUESTIONS_NUMBER_INVALID = 'Duplicate questions number';
  static readonly QUESTION_OPTIONS_INVALID = 'Question options are invalid';
  static readonly QUESTION_OPTIONS_NUMBER_INVALID =
    'Duplicate question options number';
  static readonly QUESTION_CORRECT_OPTIONS_INVALID =
    'A question must have one and only one correct option';
  static readonly QUESTION_CANNOT_BE_ADDED_AFTER_START_TIME =
    'Cannot add question after contest has started';
  static readonly QUESTION_OPTION_NOT_FOUND = 'Question option not found';
}
