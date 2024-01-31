import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, BehaviorSubject, map, startWith, catchError, of, switchMap } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { AccountType, VerifyState } from 'src/app/interface/appstates';
import { User } from 'src/app/interface/user';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyComponent implements OnInit{
  verifyState$: Observable<VerifyState>;
  private userSubject = new BehaviorSubject<User>(null);
  user$ = this.userSubject.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState  = DataState;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private noficationService: NotificationService) {}
  
  ngOnInit(): void {
    this.verifyState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const type: AccountType = this.getAccountType(window.location.href);
        return this.userService.verify$(params.get('key'), type)
        .pipe(map(response => {
          this.noficationService.onDefault(response.message);
          type === 'password' ? this.userSubject.next(response.data.user) : null;
          return { type, title: 'Verified!', dataState: DataState.LOADED, message: response.message, verifySuccess: true };
        }),
          startWith({ title: 'Verifying!', dataState: DataState.LOADING, message: 'Please wait while we verify the information', verifySuccess: false }),
          catchError((error: string) => {
            this.noficationService.onError(error);
            return of({ title: 'An Error Occured' , dataState: DataState.ERROR, error, message: error, verifySuccess: false })
          })
        )
      })
    );
  }

  renewPassword(renewPasswordForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.verifyState$ = this.userService.renewPassword$({ userId: this.userSubject.value.id, 
                                                          password: renewPasswordForm.value.password, 
                                                          confirmPassword: renewPasswordForm.value.confirmPassword })
        .pipe(map(response => {
          this.noficationService.onDefault(response.message);
          this.isLoadingSubject.next(false);
          return { type: 'account' as AccountType, title: 'Success!', dataState: DataState.LOADED, message: response.message, verifySuccess: true };
        }),
          startWith({ type: 'password' as AccountType, title: 'Verified!', dataState: DataState.LOADED, verifySuccess: false }),
          catchError((error: string) => {
            this.noficationService.onError(error);
            this.isLoadingSubject.next(false);
            return of({ type: 'password' as AccountType, title: 'Verified!', dataState: DataState.LOADED, error, verifySuccess: true })
          })
        )
  }

  private getAccountType(url: string): AccountType {
    return url.includes('password') ? 'password' : 'account';
  }
}
