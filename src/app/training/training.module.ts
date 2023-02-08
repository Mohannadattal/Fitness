import {NgModule} from '@angular/core';
import {SharedModule} from "../shared/shared.module";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {TrainingRoutingModule} from "./training.routing.module";
import {StoreModule} from "@ngrx/store";


import {TrainingComponent} from "./training.component";
import {NewTrainingComponent} from "./new-training/new-training.component";
import {CurrentTrainingComponent} from "./current-training/current-training.component";
import {PastTrainingsComponent} from "./past-trainings/past-trainings.component";
import {StopTrainingComponent} from "../stop-training/stop-training.component";
import {trainingReducer} from "./store/training.reducer";


@NgModule({
  declarations: [
    TrainingComponent,
    NewTrainingComponent,
    CurrentTrainingComponent,
    PastTrainingsComponent,
    StopTrainingComponent,
  ],
  imports: [
    SharedModule,
    AngularFirestoreModule,
    TrainingRoutingModule,
    StoreModule.forFeature('training', trainingReducer)
  ],
  entryComponents: [StopTrainingComponent]
})
export class TrainingModule {
}
