import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AppContext from '../../lib/app-context';
import debounce from '../../lib/debounce';

export default function Posts() {
  const { user } = useContext(AppContext);
  const [state, setState] = useState({
    searchStatus: 'empty',
    searchValue: '',
    recentPosts: [],
    searchedPosts: []
  });

  const requests = new Set();

  useEffect(() => {
    const requestController = new AbortController();
    requests.add(requestController);
    const { signal } = requestController;

    fetch('/api/boardGamePosts', { signal })
      .then(response => response.json())
      .then(postInfo => {
        if (signal.aborted) return;
        const recentPosts = postInfo.slice();
        setState(prev => ({ ...prev, recentPosts }));
      })
      .catch(() => {})
      .finally(() => requests.delete(requestController));

    return () => {
      requests.forEach(req => req.abort());
    };
  }, [requests]);

  const handleType = debounce(event => {
    if (event.target.value !== state.searchValue) {
      setState(prev => ({ ...prev, searchValue: event.target.value }));
      runSearch(event.target.value);
    }
  }, 500);

  const runSearch = async searchValue => {
    if (searchValue.length > 0) {
      setState(prev => ({ ...prev, searchStatus: 'searching' }));
      const requestController = new AbortController();
      requests.add(requestController);
      const { signal } = requestController;

      try {
        const response = await fetch(`/api/boardGamePosts/search/${searchValue}`, { signal });
        const posts = await response.json();

        if (signal.aborted) return;

        if (posts.error || posts.length < 1) {
          setState(prev => ({ ...prev, searchStatus: 'none' }));
        } else {
          setState(prev => ({
            ...prev,
            searchedPosts: posts,
            searchStatus: 'result'
          }));
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        requests.delete(requestController);
      }
    } else {
      setState(prev => ({ ...prev, searchStatus: 'empty' }));
    }
  };

  const renderSearch = () => {
    if (state.searchStatus === 'none') {
      return (
        <div className="row search-message">
          <h3 className="orange">No posts were found, try again</h3>
        </div>
      );
    } else if (state.searchStatus === 'searching') {
      return (
        <div className="row search-message">
          <h3 className="orange">Searching...</h3>
        </div>
      );
    } else if (state.searchStatus === 'result') {
      return <PostingList postList={state.searchedPosts} />;
    }
    return null;
  };

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <>
      <div className="row">
        <div className="col-4 bookmark title shadow">
          <h1 className="text-shadow orange">Postings</h1>
        </div>
      </div>
      <div className="row row-2">
        <div className="search-input shadow col-2">
          <div className="search-icon">
            <label htmlFor="game-search">
              <i className="orange fas fa-search"></i>
            </label>
          </div>
          <input
            autoComplete="off"
            onKeyUp={handleType}
            type="text"
            className="lora"
            id="game-search"
            name="game"
            placeholder="Search for a game..."
          />
        </div>
      </div>
      <div className="row row-2">
        {renderSearch()}
      </div>
      <div className="postings-container">
        <PostingList postList={state.recentPosts} />
      </div>
    </>
  );
}

function PostingList({ postList }) {
  if (postList.length < 1) return null;

  return (
    <div className="row row-2 post-list">
      {postList.map(post => (
        <PostItem key={post.postId} info={post} />
      ))}
    </div>
  );
}

function PostItem({ info }) {
  const { gameName: game, lenderName: name, image, postId } = info;

  return (
    <Link to={`/post/${postId}`} className="post-item">
      <div className="post-item-info">
        <div>
          <h3 className="orange shadow post-item-info-title">Title</h3>
        </div>
        <div>
          <h3 className="lora post-item-info-value">{game}</h3>
        </div>
        <div>
          <h3 className="orange shadow post-item-info-title">Lender</h3>
        </div>
        <div>
          <h3 className="lora post-item-info-value">{name}</h3>
        </div>
      </div>
      <div className="post-item-img">
        <img src={image} alt={game} />
      </div>
    </Link>
  );
}
