import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  log(message: string, data: any): void {
    console.log(message, data)
  }
}
