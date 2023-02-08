import {Injectable} from '@angular/core';
import {ExerciseModel} from "./exercise.model";
import {map, Subscription, take} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {UiService} from "../shared/ui.service";
import * as fromTraining from "../training/store/training.reducer"
import * as UI from "../shared/store/ui.actions"
import {Store} from "@ngrx/store";
import * as Training from "../training/store/training.actions"

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  fbSubscription: Subscription[] = []


  constructor(private db: AngularFirestore,
              private uiService: UiService,
              private store: Store<fromTraining.State>) {}

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading)
    this.fbSubscription.push(this.db.collection('availableExercises').snapshotChanges().pipe(map(docArray => {
      //throw (new Error())
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          name: doc.payload.doc.data()['name'],
          duration: doc.payload.doc.data()['duration'],
          calories: doc.payload.doc.data()['calories']

        }
      })

    })).subscribe((exercises: ExerciseModel[]) => {
      this.store.dispatch(new UI.StopLoading)
      this.store.dispatch(new Training.SetAvailableTrainings(exercises))


    }, error => {
      this.store.dispatch(new UI.StopLoading)
      this.uiService.showSnackBar('Fetching Exercise failed, please try again later',
        null, 5000)
    }))

  }

  startExercise(selectedId) {
    this.store.dispatch(new Training.StartTraining(selectedId))
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({...ex, date: new Date(), state: 'completed'})
      this.store.dispatch(new Training.StopTraining())
    })
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({
        ...ex,
        duration: ex.duration * (progress / 100),
        calories: ex.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled'
      })
      this.store.dispatch(new Training.StopTraining())
    })

    this.store.dispatch(new Training.StopTraining())
  }

  fetchCompletedOrCanceledExercises() {
    this.fbSubscription.push(this.db.collection('finishedExercises').valueChanges()
      .subscribe((exercises: ExerciseModel[]) => {
        this.store.dispatch(new Training.SetFinishedTrainings(exercises))
      }))
  }

  cancelSubscription() {
    this.fbSubscription.forEach(sub => {
      sub.unsubscribe()
    })
  }

  addDataToDatabase(exercise: ExerciseModel) {
    this.db.collection('finishedExercises').add(exercise)

  }
}
