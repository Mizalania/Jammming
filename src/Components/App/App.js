import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {searchResults: [],
      playlistName: 'New Playlist Name',
      playlistTracks: []
      };
    this.addTrack=this.addTrack.bind(this);
    this.removeTrack=this.removeTrack.bind(this);
    this.updatePlaylistName=this.updatePlaylistName.bind(this);
    this.savePlaylist=this.savePlaylist.bind(this);
    this.search=this.search.bind(this);
  }

  search(term) {
    Spotify.search(term).then(searchResults => this.setState({searchResults: searchResults}));
  }

  addTrack(track) {
    const newtracks = this.state.playlistTracks;
    if (!newtracks.includes(track)) {
      newtracks.push(track);
      this.setState({playlistTracks: newtracks});
      }
    }

  removeTrack(track) {
    const newtracks = this.state.playlistTracks;
    if (newtracks.includes(track)) {
      newtracks.pop(track);
      this.setState({playlistTracks: newtracks});
      }
    }

  savePlaylist() {
      let trackURIs = [];
      this.state.playlistTracks.forEach(playlistTrack => {
        trackURIs.push(playlistTrack.uri);
      });
      Spotify.savePlaylist(this.state.playlistName, trackURIs);
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks:[]
      });
    }


  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
        <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
        <SearchResults searchResults={this.state.searchResults}
                       onAdd={this.addTrack}/>
        <Playlist onSave={this.savePlaylist}
                  onNameChange={this.updatePlaylistName}
                  playlistName={this.state.playlistName}
                  playlistTracks={this.state.playlistTracks}
                  onRemove={this.removeTrack}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
