import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();
const GithubProvider = ({ children }) => {
  const [githubUser, setgithubUser] = useState(mockUser);
  const [repos, setrepos] = useState(mockRepos);
  const [followers, setfollowers] = useState(mockFollowers);
  // request loading
  const [requests, setrequests] = useState(0);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState({ show: false, msg: "" });

  const searchGithubUser = async (user) => {
    toggleError();
    setloading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(error)
    );
    if (response) {
      setgithubUser(response.data);
      const { login, followers_url } = response.data;

      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=10`),
      ]).then((results) => {
        const [repos, followers] = results;
        const status = "fulfilled";
        if (repos.status === status) {
          setrepos(repos.value.data);
        }
        if (followers.status === status) {
          setfollowers(followers.value.data);
        }
        console.log(results);
      });
    } else {
      toggleError(true, "there is no user with that username");
    }
    checkRequests();
    setloading(false);
  };
  // check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;

        setrequests(remaining);
        if (remaining === 0) {
          toggleError(true, "sorry you have exceeded your hourly rate limit!");
        }
      })
      .catch((err) => console.log(err));
  };

  function toggleError(show = false, msg = "") {
    seterror({ show, msg });
  }
  // errors

  useEffect(checkRequests, []);
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        loading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};
export { GithubProvider, GithubContext };

// provider ,consumer-GithubContext.provider
