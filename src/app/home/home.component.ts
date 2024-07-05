import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, take, tap} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import { CoursesService } from '../services/courses.services';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  constructor(private coursesService: CoursesService) {

  }

  ngOnInit() {
    // this.http.get('/api/courses')
    //   .subscribe(
    //     res => {

    //       const courses: Course[] = res["payload"].sort(sortCoursesBySeqNo);

    //       this.beginnerCourses = courses.filter(course => course.category == "BEGINNER");

    //       this.advancedCourses = courses.filter(course => course.category == "ADVANCED");

    //     });
    this.reloadCourses();
  }

  reloadCourses () {
    // we are not calling the backend directly with this diferent approach
    const courses$ = this.coursesService.loadAllCourses()
    .pipe(
      map(courses => courses.sort(sortCoursesBySeqNo))
    );
    this.beginnerCourses$ = courses$
    .pipe(
      map(courses => courses.filter(course => course.category == "BEGINNER"))
    );
    this.advancedCourses$ = courses$
    .pipe(
      map(courses => courses.filter(course => course.category == "ADVANCED"))
    );
  }

}




