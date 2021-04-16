import IndexedDBProvider from '../../utils/hooks/useIndexeddb';
import IDBConfig from '../../common/dbConfig';
import WeeklyReport from './weeklyReport';

const Wrapper = () => (
  <IndexedDBProvider config={IDBConfig.weeklyReport}><WeeklyReport /></IndexedDBProvider>
)

export default Wrapper;
