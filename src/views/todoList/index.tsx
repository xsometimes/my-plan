import IndexedDBProvider from '../../utils/hooks/useIndexeddb';
import IDBConfig from '../../common/dbConfig';
import TodoList from './todoList';

const Wrapper = () => (
  <IndexedDBProvider config={IDBConfig.todo}><TodoList /></IndexedDBProvider>
)

export default Wrapper;
