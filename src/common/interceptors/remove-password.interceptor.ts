import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class RemovePasswordInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe(map((data) => this.handleRemovePasswordField(data)));
  }

  private handleRemovePasswordField(_data: any) {
    const { data } = _data;
    const removePasswordField = (obj: any) => {
      for (const key in obj) {
        if (key === 'password') {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          removePasswordField(obj[key]);
        }
      }
    };
    removePasswordField(data);
    return _data;
  }
}
