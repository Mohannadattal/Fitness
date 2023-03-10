import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import {Observable, take} from "rxjs";
import {Injectable} from "@angular/core";
import * as fromRoot from "../app.reducer"
import {Store} from "@ngrx/store";

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private store:Store<fromRoot.State>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean
    | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   return this.store.select(fromRoot.getIsAuth).pipe(take(1))
  }

  canLoad(route: Route) {
    return this.store.select(fromRoot.getIsAuth).pipe(take(1))
  }
}
