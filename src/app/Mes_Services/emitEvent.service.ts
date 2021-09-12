import { Subject } from 'rxjs';
import { EventModel } from '../Models/eventAction';

export class EmitEvent {
  //Emettre les evenements avec number
  //TODO
  emitEventSubjectBug: Subject<EventModel> = new Subject<EventModel>();
  //Emettre les evenements avec string et indice

  //Emission EventBug avec number
  //TODO
  emit_Event_Update_(event: EventModel) {
    this.emitEventSubjectBug.next(event);
  }
}
