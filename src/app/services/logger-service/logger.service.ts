import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  log<T>(message: string, data: T | '!'): void {
    console.log(message, data)
  }
}
