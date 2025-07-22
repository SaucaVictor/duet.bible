import './styles.css';
import './output.css';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import '@fortawesome/fontawesome-free/css/all.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
library.add(faSearch);
const app = createApp(App)

app.use(router)
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount('#app')
