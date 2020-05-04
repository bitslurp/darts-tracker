import { Observable, Subject } from 'rxjs';
import DartsMatch, { DartsMatchModel } from '../data/DartsMatch';
import moment from 'moment';
import { Collection } from 'realm';
import { RealmRepository, DataObservable } from './RealmRepository';
import { BoardPosition } from '../data/Throw';

const typeName = 'DartsMatch';

/**
 * A repository for DartsMatchModel objects
 */
class DartsMatchRepo extends RealmRepository {
  /**
   * Create and persist a new darts match.
   * @param match DartsMatchModel data to persist
   * @returns An Observable which will provide reference to the created live Realm.Object
   */
  createDartsMatch(
    match: DartsMatchModel,
  ): Observable<DartsMatchModel & Realm.Object> {
    const subject = new Subject<DartsMatchModel & Realm.Object>();
    this.realm.then(realm => {
      realm.write(() => {
        const dartsMatch = realm.create<DartsMatchModel & Realm.Object>(
          typeName,
          match,
        );
        subject.next(dartsMatch);

        subject.complete();
      });
    });

    return subject;
  }

  /**
   * Update DartsMatchModel with the next throw for the active user
   * @param dartsMatch Model to update
   * @param go The BoardPosition which the active player has hit
   */
  async addGo(dartsMatch: DartsMatchModel, go: BoardPosition) {
    const realm = await this.realm;

    realm.write(() => {
      DartsMatch.nextGo(dartsMatch, go);
    });
  }

  /**
   * Find an individual
   * @param matchId The DartsMatchModel.id to look up
   */
  findById(matchId: string): DataObservable<DartsMatchModel & Realm.Object> {
    return this.createDataObervable<DartsMatchModel & Realm.Object>(
      async subject => {
        const realm = await this.realm;
        const match = realm
          .objects<DartsMatchModel & Realm.Object>(typeName)
          .find(match => match.id === matchId);

        // Match typed as any due to inaccurate typing in Realm lib
        const listener = (match: any) => {
          // If we pass the live match object then it will not trigger a UI update.
          // Find it again so that we have a new object
          subject.next(
            realm
              .objects<DartsMatchModel & Realm.Object>(typeName)
              .find(match => match.id === matchId),
          );
        };
        match.addListener(listener);

        return () => match.removeAllListeners();
      },
    );
  }

  findMatchesByMonth(
    month: number,
    year: number,
  ): DataObservable<Collection<DartsMatchModel>> {
    const startDate = moment()
      .year(year)
      .month(month)
      .startOf('month');
    const endDate = startDate.clone().endOf('month');

    return this.createDataObervable<Collection<DartsMatchModel>>(
      async subject => {
        const realm = await this.realm;
        const matches = realm
          .objects<DartsMatchModel>(typeName)
          .filtered(
            `createdAt >= ${startDate
              .toISOString()
              .substr(0, 19)} && createdAt <= ${endDate
              .toISOString()
              .substr(0, 19)}`,
          );

        const listener = (matches: Collection<DartsMatchModel>) =>
          subject.next(matches);
        matches.addListener(listener);

        return () => matches.removeAllListeners();
      },
    );
  }
}

export default new DartsMatchRepo();
