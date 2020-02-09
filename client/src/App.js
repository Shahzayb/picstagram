import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Layout from './component/Layout';
import Navbar from './component/Navbar';
import Home from './page/Home';

function App() {
  return (
    <>
      <Navbar />
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={() => <div>Login</div>} />
          <Route path="/register" component={() => <div>register</div>} />
          <Route path="/photo/:photoId" component={() => <div>photo</div>} />
          <Route path="/post" component={() => <div>make post</div>} />
          <Route
            path="/search/:term"
            component={() => <div>search result</div>}
          />
          <Route
            path="/account/edit"
            component={() => <div>edit account</div>}
          />
          <Route
            path="/account/change-password"
            component={() => <div>change password</div>}
          />
          <Route
            exact
            path="/:username"
            component={() => <div>user profile</div>}
          />
        </Switch>
      </Layout>
    </>
  );
}

export default App;
