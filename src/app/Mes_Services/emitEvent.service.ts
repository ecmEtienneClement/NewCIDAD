import { Subject } from 'rxjs';
import {
  EventModel,
  EventModelObjBug,
  EventModelObjReponse,
} from '../Models/eventAction';

export class EmitEvent {
  //Emettre les evenements avec number
  //TODO
  emitEventSubjectBug: Subject<EventModel> = new Subject<EventModel>();

  //Emettre les evenements avec objBug
  //TODO
  emitEventSubjectObjBug: Subject<EventModelObjBug> =
    new Subject<EventModelObjBug>();
    
  //Emettre les evenements avec objReponse
  //TODO
  emitEventSubjectObjReponse: Subject<EventModelObjReponse> =
    new Subject<EventModelObjReponse>();

  //Emission EventBug avec number
  //TODO
  emit_Event_Update_(event: EventModel) {
    this.emitEventSubjectBug.next(event);
  }
  //Emission EventReponse avec obj
  //TODO
  emit_Event_Obj_Bug_(event: EventModelObjBug) {
    this.emitEventSubjectObjBug.next(event);
  }
  //Emission EventReponse avec obj
  //TODO
  emit_Event_Obj_Reponse_(event: EventModelObjReponse) {
    this.emitEventSubjectObjReponse.next(event);
  }
}
