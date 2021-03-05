import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {map} from "rxjs/operators";

export interface Task {
    id?: string,
    title: string,
    date?: string
}

export interface CreateResponse {
    name:string
}

@Injectable ({providedIn: 'root'})
export class TasksService {

    static url = 'https://organizer-app-81775-default-rtdb.firebaseio.com/';
    constructor (private http: HttpClient){

    }
    create (task:Task):Observable<Task> {
        return this.http
            .post<CreateResponse> (`${TasksService.url}/${task.date}.json`, task)
            .pipe(map(res => {
                return {...task, id: res.name}
            }))
    }

    load(date:moment.Moment){
        return this.http
            .get<Task[]>(` ${TasksService.url}/${date.format('DD-MM-YYYY')}.json`)
            .pipe(map(tasks => {
                if (!tasks) {
                    return []
                }
                return Object.keys(tasks).map(key => ({...tasks[key], id:key}))
            }))

    }

    remove (task:Task):Observable<void>{
        return this.http
            .delete<void>(`${TasksService.url}/${task.date}/${task.id}.json`)
    }

}