import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import TaskManager from "./pages/TaskManager";
import { persistor, store } from "./store/store";

function App() {
	return (
		<Provider store={store}>
			<PersistGate
				loading={null}
				persistor={persistor}
			>
				<TaskManager />
			</PersistGate>
		</Provider>
	);
}

export default App;
