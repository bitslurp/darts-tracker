import { Player } from '../data/Player';
import { Collection } from 'realm';
import { RealmRepository, DataObservable } from './RealmRepository';
import { Observable, Subject } from 'rxjs';

const typeName = 'Player';
/**
 *  A repository for DartsMatchModel objects with methods to find and create players.
 */
class PlayerRepo extends RealmRepository {
  /**
   * Get an DataObservable for all existing players
   */
  getAll(): DataObservable<Collection<Player>> {
    return this.createDataObervable<Collection<Player>>(async subject => {
      const listener = (players: Collection<Player>) => subject.next(players);
      const realm = await this.realm;
      const players = realm.objects<Player>(typeName);

      players.addListener(listener);

      return () => players.removeAllListeners();
    });
  }

  /**
   * Add a new darts player
   * @param playerName
   */
  create(playerName: string): Observable<Player & Realm.Object> {
    const player: Player = { name: playerName };
    const subject = new Subject<Player & Realm.Object>();
    this.realm.then(realm => {
      realm.write(() => {
        const playerObject = realm.create<Player & Realm.Object>(
          typeName,
          player,
        );

        subject.next(playerObject);
        subject.complete();
      });
    });

    return subject;
  }
}

export default new PlayerRepo();
