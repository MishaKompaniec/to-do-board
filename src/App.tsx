import { Provider } from 'react-redux';
import { Layout } from './components';
import MainPage from './page/main';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <Layout>
        <MainPage />
      </Layout>
    </Provider>
  );
}

export default App;
