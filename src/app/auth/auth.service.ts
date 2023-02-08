import {Injectable} from '@angular/core';
import {AuthDataModel} from "./auth-data.model";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {TrainingService} from "../training/training.service";
import {UiService} from "../shared/ui.service";
import {Store} from '@ngrx/store';
import * as fromRoot from "../app.reducer"
import * as UI from "../shared/store/ui.actions"
import * as Auth from "./store/auth.actions"


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private router: Router,
              private afAuth: AngularFireAuth,
              private trainingService: TrainingService,
              private uiService: UiService,
              private store: Store<fromRoot.State>) {}

  initAuthLister() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.store.dispatch(new Auth.SetAuthenticated())
        this.router.navigate(['/training'])
      } else {
        this.trainingService.cancelSubscription()
       this.store.dispatch(new Auth.SetUnauthenticated())
        this.router.navigate(['/login'])

      }
    })
  }

  registerUser(authData: AuthDataModel) {
    this.store.dispatch(new UI.StartLoading())
    this.afAuth.createUserWithEmailAndPassword(
      authData.email,
      authData.password).then(result => {
      this.store.dispatch(new UI.StopLoading())

    }).catch(error => {
      this.store.dispatch(new UI.StopLoading())
      this.uiService.showSnackBar(error.message, null, 5000)
    })
  }

  login(authData: AuthDataModel) {
    this.store.dispatch(new UI.StartLoading())
    this.afAuth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
     this.store.dispatch(new UI.StopLoading())
    }).catch(error => {
      this.store.dispatch(new UI.StopLoading())
      this.uiService.showSnackBar(error.message, null, 5000)
    })
  }
  logout() {
    this.afAuth.signOut()
  }
}
