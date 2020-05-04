import { getRealmAsync } from '../data/realm';
import { Observable, Subject } from 'rxjs';

export interface DataObservable<T> {
  complete(): void;
  data: Observable<T>;
}

type UnsubsriberFunction = () => void;

/**
 * A base helper class for Realm repositories.
 */
export abstract class RealmRepository {
  protected realm = getRealmAsync();

  /**
   * A utility method to commit a Realm query action and wrap it in an RxJS Observable.
   *
   * @param query
   * @returns an instance of the DataObservable interface.  This is intended to be used to decouple UI components from knowledge of the actual data source (Realm)
   */
  protected createDataObervable<T>(
    query: (subject: Subject<T>) => Promise<UnsubsriberFunction>,
  ): DataObservable<T> {
    const subject = new Subject<T>();

    const promise = query(subject);

    return {
      data: subject,
      complete() {
        subject.complete();
        try {
          promise.then(unsub => unsub());
        } catch {}
      },
    };
  }
}
