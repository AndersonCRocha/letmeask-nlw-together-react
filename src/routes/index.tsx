import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Home } from "../pages/Home";
import { NewRoom } from "../pages/NewRoom";

export function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/rooms/new" component={NewRoom} />
      </Switch>
    </BrowserRouter>
  );
}
