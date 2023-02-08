import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ExerciseModel} from "../exercise.model";
import {TrainingService} from "../training.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import * as fromTraining from "../store/training.reducer"
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state']
  dataSource = new MatTableDataSource<ExerciseModel>()
  @ViewChild(MatSort, {static: false}) sort: MatSort
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator


  constructor(private trainingService: TrainingService, private store: Store<fromTraining.State>) {}

  ngOnInit(): void {
    this.store.select(fromTraining.getFinishedExercises).subscribe((exercises: ExerciseModel[]) => {
      this.dataSource.data = exercises;
    })
    this.trainingService.fetchCompletedOrCanceledExercises()
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

}
