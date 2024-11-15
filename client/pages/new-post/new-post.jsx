import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import AppContext from '../../lib/app-context';
import debounce from 'lodash/debounce';

export default function NewPostForm() {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const requests = useRef(new Set());
  // Modal state
  const [modalView, setModalView] = useState('none');
  // Game search states
  const [gameSearch, setGameSearch] = useState('');
  const [gameList, setGameList] = useState([]);
  const [searchStatus, setSearchStatus] = useState('empty');
  const [chosenGame, setChosenGame] = useState(null);
  // Form values
  const [formValues, setFormValues] = useState({
    name: '',
    game: '',
    comments: ''
  });

  const handleSearch = event => {
    const requestController = new AbortController();
    requests.current.add(requestController);
    const { signal } = requestController;
    const selectedGame = gameList.find(game => game.gameId === event.target.dataset.gameid);
    fetch(`/api/boardGameInfo/${selectedGame.gameId}`, { signal })
      .then(response => response.json())
      .then(gameInfo => {
        if (signal.aborted) return;
        gameInfo.description = DOMPurify.sanitize(gameInfo.description);
        gameInfo.name = selectedGame.name;
        gameInfo.gameId = selectedGame.gameId;
        setChosenGame(gameInfo);
        setSearchStatus('empty');
        setModalView('none');
      })
      .then(() => {
        if (signal.aborted) return;
        setSearchStatus('chosen');
        setFormValues(prev => ({
          ...prev,
          game: selectedGame.name
        }));
      })
      .catch(() => { })
      .finally(() => requests.current.delete(requestController));
  };

  const handleClick = () => {
    setModalView('search');
    runSearch();
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleType = event => {
    const newValue = event.target.value;
    if (newValue !== gameSearch) {
      setGameSearch(newValue);
      runSearch();
    }
  };

  const runSearch = debounce(() => {
    if (gameSearch.length > 0) {
      setSearchStatus('searching');
      const requestController = new AbortController();
      requests.current.add(requestController);
      const { signal } = requestController;
      fetch(`/api/boardGames/${gameSearch}`, { signal })
        .then(response => response.json())
        .then(games => {
          if (signal.aborted) return;
          if (games.error || games.length < 1) {
            setSearchStatus('none');
          } else {
            setGameList(games);
            setSearchStatus('result');
          }
        })
        .catch(() => { })
        .finally(() => requests.current.delete(requestController));
    } else {
      setSearchStatus('empty');
    }
  }, 500);

  const handlePost = event => {
    event.preventDefault();
    const requestController = new AbortController();
    requests.current.add(requestController);
    const { signal } = requestController;
    const body = JSON.stringify({
      comments: formValues.comments,
      gameId: chosenGame.gameId,
      gameImg: chosenGame.imageUrl,
      game: formValues.game,
      lender: formValues.name,
      thumbnail: chosenGame.thumbnailUrl,
      description: chosenGame.description,
      minPlayers: chosenGame.minPlayers,
      maxPlayers: chosenGame.maxPlayers,
      minPlayTime: chosenGame.minPlayTime,
      maxPlayTime: chosenGame.maxPlayTime,
      age: chosenGame.age,
      year: chosenGame.yearPublished,
      lenderId: user.userId
    });

    fetch('/api/boardGamePosts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal
    })
      .then(response => response.json())
      .then(post => {
        if (signal.aborted) return;
        setChosenGame(null);
        setFormValues({
          name: '',
          game: '',
          comments: ''
        });
      })
      .catch(() => { })
      .finally(() => requests.current.delete(requestController));
  };

  const renderForm = () => {
    if (chosenGame) {
      return (
        <>
          <div className="row">
            <div className="col-4 bookmark title shadow">
              <h1 className="text-shadow orange">New Post</h1>
            </div>
          </div>
          <div className="row row-2">
            <div className="col-2 col image-post">
              <img src={chosenGame.imageUrl} alt={chosenGame.name} />
            </div>
            <div className="col-2 col text-post">
              <div className="form-element">
                <div className="label bookmark shadow">
                  <label className="orange" htmlFor="new-game-search">Name of Game:</label>
                </div>
                <div className="search-input">
                  <div className="search-icon">
                    <label htmlFor="new-game-search"><i className="orange fas fa-search"></i></label>
                  </div>
                  <input onClick={handleClick} required type="text" name="game" className="lora" id="new-game-search" value={chosenGame.name} placeholder="Search for a game..." />
                </div>
              </div>
              <div className="form-element">
                <div className="label bookmark shadow">
                  <label className="orange" htmlFor="new-game-name">Your Name:</label>
                </div>
                <div className="input">
                  <input required type="text" onChange={handleChange} value={formValues.name} className="lora" name="name" id="new-game-name" />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-element col">
              <div className="label bookmark shadow">
                <label className="orange" htmlFor="new-game-comments">Comments:</label>
              </div>
              <div className="input col-1">
                <textarea onChange={handleChange} value={formValues.comments} required className="lora" name="comments" id="new-game-comments" cols="30" rows="8"></textarea>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="row">
            <div className="col-4 bookmark title shadow">
              <h1 className="text-shadow orange">New Post</h1>
            </div>
          </div>
          <div className="row row-2">
            <div className="col-2 col image-post">
              <img src=".\images\placeholder-image-square.jpg" alt="game image" />
            </div>
            <div className="col-2 col text-post">
              <div className="form-element">
                <div className="label bookmark shadow">
                  <label className="orange" htmlFor="new-game-search">Name of Game:</label>
                </div>
                <div className="search-input">
                  <div className="search-icon">
                    <label htmlFor="new-game-search"><i className="orange fas fa-search"></i></label>
                  </div>
                  <input onClick={handleClick} readOnly required type="text" className="lora" id="new-game-search" value={formValues.game} placeholder="Search for a game..." />
                </div>
              </div>
              <div className="form-element">
                <div className="label bookmark shadow">
                  <label className="orange" htmlFor="new-game-name">Your Name:</label>
                </div>
                <div className="input">
                  <input onChange={handleChange} required type="text" className="lora" value={formValues.name} id="new-game-name" />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-element col">
              <div className="label bookmark shadow">
                <label className="orange" htmlFor="new-game-comments">Comments:</label>
              </div>
              <div className="input col-1">
                <textarea onChange={handleChange} required className="lora" name="new-game-comments" value={formValues.comments} id="new-game-comments" cols="30" rows="8"></textarea>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  const renderSearch = () => {
    if (searchStatus === 'none') {
      return (
        <div className="row search-message">
          <h3 className="orange">No games were found, try again</h3>
        </div>
      );
    } else
    if (searchStatus === 'searching') {
      return (
          <div className="row search-message">
            <h3 className="orange">Searching...</h3>
          </div>
      );
    } else if (searchStatus === 'result') {
      return (
          <>
            <SearchList list={gameList} handleSearch={handleSearch} />
          </>
      );
    } else if (searchStatus === 'chosen') {
      return (
          <div className="row search-message">
            <h3 className="orange">Loading Game...</h3>
          </div>
      );
    } else {
      return <></>;
    }
  };

  if (!user) return navigate('/sign-in');
  let hidden;
  if (modalView === 'search') {
    hidden = '';
  } else {
    hidden = 'hidden';
  }
  return (
    <>
      <form onSubmit={handlePost} action="#" className="game-search" autoComplete="off" id="new-post-form">
        {renderForm()}
        <div className="row form-button">
          <button className="text-shadow form-button shadow" type="submit">Post</button>
        </div>
      </form>
      <div onSubmit={handleSearch} className={`modal-container ${hidden}`}>
        <div className="row row-2">
          <div className="search-input shadow col-2">
            <div className="search-icon">
              <label htmlFor="new-game-search-modal"><i className="orange fas fa-search"></i></label>
            </div>
            <input autoComplete="off" onKeyUp={handleType} required type="text" className="lora" id="new-game-search-modal" name='game' placeholder="Search for a game..." />
          </div>
        </div>
        <div className="row row-2">
          {renderSearch()}
        </div>
      </div>
    </>
  );
}

function SearchList(props) {
  const gameList = props.list.map(item => {
    return (
      <GameItem key={item.gameId} value={item.name} handleSearch={props.handleSearch} id={item.gameId} />
    );
  });
  return (
    <div className="col-2 search-list shadow">
      { gameList}
    </div>
  );
}

function GameItem(props) {
  const name = props.value;
  return (
    <button onClick={props.handleSearch} className="col-1 search-item shadow" data-gameid={props.id}>{name}</button>
  );
}
