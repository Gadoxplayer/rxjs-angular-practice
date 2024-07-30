import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";

@Injectable({
    providedIn: 'root',
})
export class CoursesStore {

    private subject = new BehaviorSubject<Course[]>([]);

    courses$: Observable<Course[]> = this.subject.asObservable();

    constructor(private http: HttpClient,
                private loading: LoadingService,
                private message: MessagesService) {
        this.loadAllCourses();
    }
    /**
     * This method is private so it will not be called anywhere elase exept by the store during the corresponding lifecycle
     */
    private loadAllCourses() {
        const loadCourses$ = this.http.get<Course[]>('./api/courses')
            .pipe(
                map(response => response['payload']),
                catchError(err => {
                    const errorMessage = "Could not load courses";
                    this.message.showErrors(errorMessage);
                    return throwError(err);
                }),
                tap(courses => this.subject.next(courses))
            );
        this.loading.showLoaderUntilCompleted(loadCourses$)
            .subscribe()
    }

    filterByCategory(category: string): Observable<Course[]> {
        return this.courses$
            .pipe(
                map((courses: Course[])=> courses.filter(course => course.category == category).sort(sortCoursesBySeqNo))
            )
    }
}