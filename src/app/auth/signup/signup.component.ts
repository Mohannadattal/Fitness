import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from "../auth.service";
import {Observable} from "rxjs";
import {UiService} from "../../shared/ui.service";
import * as fromRoot from "../../app.reducer"
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  isLoading$: Observable<boolean>

  constructor(private authService: AuthService,
              private uiService: UiService,
              private store:Store<fromRoot.State>) {}

  ngOnInit(): void {
 this.isLoading$ = this.store.select(fromRoot.getIsLoading)
  }
  onSubmit(form: NgForm) {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password
    })
  }
}
