import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, of, map, startWith, catchError } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { ResetPasswordState } from 'src/app/interface/appstates';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetpasswordComponent {
  resetPasswordState$: Observable<ResetPasswordState> = of({ dataState: DataState.LOADED });
  readonly DataState = DataState;

  constructor(private userService: UserService, private noficationService: NotificationService) {}

  resetPassword(resetPasswordForm: NgForm): void {
    this.resetPasswordState$ = this.userService.requestPasswordReset$(resetPasswordForm.value.email)
      .pipe(
        map(response => {
          this.noficationService.onError(response.message);
          console.log(response);
          resetPasswordForm.reset();
          return { dataState: DataState.LOADED, resetPasswordSuccess: true, message: response.message };
        }),
        startWith({ dataState: DataState.LOADING, resetPasswordSuccess: false }),
        catchError((error: string) => {
          this.noficationService.onError(error);
          return of({ dataState: DataState.ERROR, resetPasswordSuccess: false, error});
        })
      )
  }
}
